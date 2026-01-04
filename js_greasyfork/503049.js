// ==UserScript==
// @name         解除csdn博客部分限制
// @namespace    http://tampermonkey.net/
// @version      2024-08-06
// @description  解除csdn部分限制，如复制、无法阅读整篇文章等
// @author       chen
// @match        https://blog.csdn.net/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503049/%E8%A7%A3%E9%99%A4csdn%E5%8D%9A%E5%AE%A2%E9%83%A8%E5%88%86%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/503049/%E8%A7%A3%E9%99%A4csdn%E5%8D%9A%E5%AE%A2%E9%83%A8%E5%88%86%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var style = document.createElement('style');
    style.innerHTML = `
        * {
        user-select: text !important;
        }
    `;
    document.head.appendChild(style);
    $("#content_views").unbind("copy");
    if (document.querySelector(".hide-article-box")!=null){
        $("#article_content").css("height","auto");
    }
})();