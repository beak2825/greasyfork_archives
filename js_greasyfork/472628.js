// ==UserScript==
// @name         滚动到页面顶部和底部
// @namespace    your-namespace
// @version      1.0
// @description  使用Ctrl+上箭头滚动到页面顶部，使用Ctrl+下箭头滚动到页面底部
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472628/%E6%BB%9A%E5%8A%A8%E5%88%B0%E9%A1%B5%E9%9D%A2%E9%A1%B6%E9%83%A8%E5%92%8C%E5%BA%95%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/472628/%E6%BB%9A%E5%8A%A8%E5%88%B0%E9%A1%B5%E9%9D%A2%E9%A1%B6%E9%83%A8%E5%92%8C%E5%BA%95%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey) {
            if (event.keyCode === 38) { // 上箭头键
                scrollToTop();
            } else if (event.keyCode === 40) { // 下箭头键
                scrollToBottom();
            }
        }
    });

    // 滚动到页面顶部
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 滚动到页面底部
    function scrollToBottom() {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }
})();
