// ==UserScript==
// @name         Block Douban Movie Redirect
// @namespace    https://github.com/Gemini/Douban-Redirect-Blocker
// @version      1.1
// @description  Redirect Douban movie links from desktop to mobile version
// @license      MIT
// @author       Your Name
// @match        https://movie.douban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486944/Block%20Douban%20Movie%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/486944/Block%20Douban%20Movie%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面是否是桌面版豆瓣电影链接
    if (window.location.href.includes("https://movie.douban.com/")) {
        // 重定向到移动版链接
        window.location.href = window.location.href.replace("https://movie.douban.com/", "https://m.douban.com/");
    }
})();