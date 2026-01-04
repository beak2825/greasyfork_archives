// ==UserScript==
// @name        ZH desktop Wikipedia 中文桌面版维基百科优化
// @version     1.0.0
// @description Redirect mobile Wikipedia to desktop and better ZH lang UX.
// @description:zh-hans 重定向移动版维基百科到桌面版，并优化中文用户体验。
// @description:zh-hant 重定向移動版維基百科到桌面版，并優化中文用戶體驗。
// @namespace   AmaniNakupendaWeWe
// @match       *://*.m.wikipedia.org/*
// @match       *://zh.wikipedia.org/zh*/*
// @run-at      document-start
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/451258/ZH%20desktop%20Wikipedia%20%E4%B8%AD%E6%96%87%E6%A1%8C%E9%9D%A2%E7%89%88%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/451258/ZH%20desktop%20Wikipedia%20%E4%B8%AD%E6%96%87%E6%A1%8C%E9%9D%A2%E7%89%88%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

location.replace(
  location.href
    .replace(".m.wikipedia.org/", ".wikipedia.org/")
    .replace(/zh.wikipedia.org\/zh(-[a-z]+)?\//, 'zh.wikipedia.org/wiki/')
);
