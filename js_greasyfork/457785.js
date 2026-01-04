// ==UserScript==
// @name         NTDTV沉浸式阅读脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  优化阅读NTDTV新闻的体验
// @author       zzyyesimola
// @match        *.ntdtv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457785/NTDTV%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/457785/NTDTV%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('.article_content').style = "width: 100%"
    document.querySelector('#main').style = "background-color: bisque;"
    document.querySelector('.sidebar').style = "display: none"
    document.querySelector('.post_related').style = "display: none;"
    document.querySelector('#commentary_block').style = "display: none;"

})();