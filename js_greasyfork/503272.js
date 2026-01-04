// ==UserScript==
// @name         B站直播马赛克去除
// @namespace    http://github.com/x7z0
// @version      0.1
// @description  在live.bilibili.com中移除id为 'web-player-module-area-mask-panel' 的元素
// @author       x7z0
// @match        *://live.bilibili.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503272/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/503272/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the element
    function removeElement() {
        var element = document.getElementById('web-player-module-area-mask-panel');
        if (element) {
            element.remove();
        }
    }

    // Run the function once the page has fully loaded
    window.addEventListener('load', removeElement);

    // Optionally, use a MutationObserver to handle dynamic content changes
    var observer = new MutationObserver(removeElement);
    observer.observe(document.body, { childList: true, subtree: true });
})();
