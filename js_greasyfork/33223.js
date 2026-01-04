// ==UserScript==
// @name                jump2Wikiwand
// @description         Redirect Wikipedia to Wikiwand for a modern browsing experience.
// @description:zh-CN   重定向 Wikipedia 页面到 Wikiwand 以获得现代的浏览体验
// @description:zh-TW   重定向 Wikipedia 頁面到 Wikiwand 以獲得現代的瀏覽體驗
// @author              ladit
// @version             1.2.0
// @namespace           https://greasyfork.org/zh-CN/scripts/33223
// @homepageURL         https://github.com/ladit/Userscripts
// @supportURL          https://github.com/ladit/Userscripts
// @grant               none

// @match               http*://*.wikipedia.org/*
// @run-at              document-start
// @downloadURL https://update.greasyfork.org/scripts/33223/jump2Wikiwand.user.js
// @updateURL https://update.greasyfork.org/scripts/33223/jump2Wikiwand.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!document.URL.includes('oldformat=true')) {
      window.location.replace(document.URL.replace(/https?:\/\/([\w-]+)\.wikipedia\.org\/[\w-]+\/([^#&\?]+)/, 'https://www.wikiwand.com/$1/$2'));
    }
})();

