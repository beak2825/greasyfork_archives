// ==UserScript==
// @name         Wiki zh-cn Mobile Redirect
// @namespace    https://tampermonkey.net/
// @version      0.1
// @description  自动跳转维基系列到简体中文移动版
// @match        *://*.wikipedia.org/*
// @match        *://*.wiktionary.org/*
// @match        *://*.wikiquote.org/*
// @match        *://*.wikinews.org/*
// @match        *://*.wikisource.org/*
// @match        *://*.wikibooks.org/*
// @match        *://*.wikivoyage.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542372/Wiki%20zh-cn%20Mobile%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/542372/Wiki%20zh-cn%20Mobile%20Redirect.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const host = location.hostname;

  // 1. 插入 .m. 切换到移动端
  if (!host.includes('.m.')) {
    const mobileHost = host.replace(/^([a-z\-]+)\.(.+)$/, '$1.m.$2');
    location.replace(
      location.protocol +
        '//' +
        mobileHost +
        location.pathname +
        location.search +
        location.hash,
    );
    return;
  }

  // 2. 中文站优先简体 zh-cn
  if (/^zh\.m\./.test(host)) {
    const url = new URL(location.href);
    if (!url.searchParams.has('variant')) {
      url.searchParams.set('variant', 'zh-cn');
      location.replace(url.toString());
    }
  }
})();