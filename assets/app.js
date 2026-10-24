/* ============================================================
   AI 背单词 — 语言切换
   机制：head 内联脚本已在首屏渲染前设定 html[lang]；
   本脚本负责按钮交互、元信息（title/description/OG/Twitter）
   的双语同步，以及偏好持久化。
   ============================================================ */
"use strict";

(function () {
  var LANG_KEY = "beidanci-lang";

  var metaPacks = {
    zh: {
      langAttr: "zh-CN",
      locale: "zh_CN",
      title: "AI 背单词 · 开发中 — 间隔重复词汇学习应用",
      description:
        "AI 背单词是一款开发中的间隔重复（SRS）背单词应用：复习优先、每日新词名额、三档评分、学完自动续组、五本词书、可安装 PWA。项目尚未发布，本页同步产品定位与开发进展（当前 v2.0）。"
    },
    en: {
      langAttr: "en",
      locale: "en_US",
      title: "AI 背单词 · In Development — A Spaced-Repetition Vocabulary App",
      description:
        "AI 背单词 is a spaced-repetition vocabulary app in development: review-first queues, a daily new-word quota, three-way grading, auto-continuing sessions, five word books, and an installable PWA. Not yet released — this page tracks its positioning and progress (currently v2.0)."
    }
  };

  function currentLang() {
    return document.documentElement.lang === "en" ? "en" : "zh";
  }

  function setMetaContent(selector, value) {
    var el = document.head.querySelector(selector);
    if (el) el.setAttribute("content", value);
  }

  function applyMeta(lang) {
    var pack = metaPacks[lang];
    document.title = pack.title;
    setMetaContent('meta[name="description"]', pack.description);
    setMetaContent('meta[property="og:title"]', pack.title);
    setMetaContent('meta[property="og:description"]', pack.description);
    setMetaContent('meta[property="og:locale"]', pack.locale);
    setMetaContent('meta[name="twitter:title"]', pack.title);
    setMetaContent('meta[name="twitter:description"]', pack.description);
  }

  function syncButtons(lang) {
    var zhBtn = document.getElementById("langOptZh");
    var enBtn = document.getElementById("langOptEn");
    if (zhBtn) zhBtn.setAttribute("aria-pressed", lang === "zh" ? "true" : "false");
    if (enBtn) enBtn.setAttribute("aria-pressed", lang === "en" ? "true" : "false");
  }

  /* 契约函数：设置语言（zh / en） */
  function setLang(lang) {
    var next = lang === "en" ? "en" : "zh";
    document.documentElement.lang = metaPacks[next].langAttr;
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch (err) {
      /* 隐私模式等场景下存储不可用，忽略即可 */
    }
    applyMeta(next);
    syncButtons(next);
  }

  /* 契约函数：切换语言 */
  function switchLang(lang) {
    setLang(lang);
  }

  function init() {
    var lang = currentLang();
    applyMeta(lang);
    syncButtons(lang);

    var zhBtn = document.getElementById("langOptZh");
    var enBtn = document.getElementById("langOptEn");
    if (zhBtn) zhBtn.addEventListener("click", function () { setLang("zh"); });
    if (enBtn) enBtn.addEventListener("click", function () { setLang("en"); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* 暴露到全局，便于调试与外部调用 */
  window.setLang = setLang;
  window.switchLang = switchLang;
})();
