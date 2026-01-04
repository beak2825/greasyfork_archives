// ==UserScript==
// @name         即刻移动端自动跳转Web端
// @namespace    foolgry
// @version      0.4
// @description  自动将即刻移动端链接转换为Web端链接
// @author       Your Name
// @match        https://m.okjike.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490651/%E5%8D%B3%E5%88%BB%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACWeb%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/490651/%E5%8D%B3%E5%88%BB%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACWeb%E7%AB%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的URL
    var currentUrl = window.location.href;

    // 检查是否为移动端即刻链接
    if (currentUrl.startsWith("https://m.okjike.com/reposts")) {
        // 跳转到Web端链接
        window.location.href = currentUrl.replace("m.okjike.com/reposts", "web.okjike.com/repost");
    } else if (currentUrl.startsWith("https://m.okjike.com/originalPosts")) {
        window.location.href = currentUrl.replace("m.okjike.com/originalPosts", "web.okjike.com/originalPost");
    }
})();