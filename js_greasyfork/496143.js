// ==UserScript==
// @name         隐藏b站换一换按钮
// @namespace    http://tampermonkey.net/
// @version      2024-05-26
// @description  拒绝盲目刷视频，善用B站搜索
// @author       潇义
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496143/%E9%9A%90%E8%97%8Fb%E7%AB%99%E6%8D%A2%E4%B8%80%E6%8D%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/496143/%E9%9A%90%E8%97%8Fb%E7%AB%99%E6%8D%A2%E4%B8%80%E6%8D%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Function to display alert after page load
    function showAlert() {

        document.querySelectorAll('.feed-roll-btn .primary-btn.roll-btn').forEach(button => button.style.display = 'none');
    }

    // Listen for the 'load' event to ensure the entire page, including stylesheets, images, and other resources are loaded
    window.addEventListener("load", showAlert);
})();