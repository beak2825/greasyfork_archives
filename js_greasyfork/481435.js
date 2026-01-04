// @munpf
// https://greasyfork.org/zh-CN/scripts/461790-fix-for-bing-search-returns-to-the-top/discussions/198734
// ==UserScript==
// @name         修复必应搜索自动返回顶部
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Stop doing weird things, Bing ;)
// @author       Geekness
// @match        http*://*.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481435/%E4%BF%AE%E5%A4%8D%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/481435/%E4%BF%AE%E5%A4%8D%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Disable the scroll to top functionality
function disableScrollToTop() {
    let originalFunc = window.scrollTo;
    window.scrollTo = function(x, y) {
        if (y !== 0) {
            originalFunc(x, y);
        }
    };
}

    // Listen for 'focus' events on the window
    window.addEventListener('focus', disableScrollToTop);
})();