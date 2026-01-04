// ==UserScript==
// @name         Bilibili 回到旧版
// @namespace    Copilot
// @version      1.0
// @description  Redirect bilibili.com or www.bilibili.com to www.bilibili.com/index.html
// @match        http*://bilibili.com/*
// @match        http*://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487708/Bilibili%20%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/487708/Bilibili%20%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    var url = window.location.href;

    // Check if the URL is bilibili.com or www.bilibili.com
    if (url === "https://bilibili.com/" || url === "https://www.bilibili.com/") {
        // Redirect to www.bilibili.com/index.html
        window.location.replace("https://www.bilibili.com/index.html");
    }
})();
