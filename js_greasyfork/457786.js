// ==UserScript==
// @name         大纪元沉浸式阅读脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  优化阅读大纪元新闻的体验
// @author       zzyyesimola
// @match        *.epochtimes.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457786/%E5%A4%A7%E7%BA%AA%E5%85%83%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/457786/%E5%A4%A7%E7%BA%AA%E5%85%83%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('.article').style = "width: 100%;"
    document.querySelector('#main').style = "background-color: bisque;"
    document.querySelector('.related_post').style = "display: none;"
    document.querySelector('.post_list').style = "display: none;"
    document.querySelector('.comment_block').style = "display: none;"
    document.querySelector('.commentbar').style = "display: none;"
    document.querySelector('#commentpost').style = "display: none;"
    document.querySelector('#comment_box').style = "display: none;"
    document.querySelector('.sidebar').style = "display: none;"
})();