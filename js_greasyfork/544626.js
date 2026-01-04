// ==UserScript==
// @name         起点：直接查看正文
// @description  自动点击起点小说页面的“立即阅读”或“免费试读”按钮，进入正文，不看评论。
// @version      1.0
// @author       yzcjd
// @author2       ChatGPT4辅助
// @namespace    https://greasyfork.org/users/1171320
// @match        https://www.qidian.com/book/*
// @match        https://book.qidian.com/info/*
// @icon1         https://www.qidian.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544626/%E8%B5%B7%E7%82%B9%EF%BC%9A%E7%9B%B4%E6%8E%A5%E6%9F%A5%E7%9C%8B%E6%AD%A3%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/544626/%E8%B5%B7%E7%82%B9%EF%BC%9A%E7%9B%B4%E6%8E%A5%E6%9F%A5%E7%9C%8B%E6%AD%A3%E6%96%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', () => {
        // 使用 requestAnimationFrame 确保 DOM 完整渲染
        requestAnimationFrame(() => {
            const readBtn = document.querySelector('#readBtn');

            if (readBtn) {
                console.log('[起点自动阅读] 找到“免费试读”按钮，自动跳转...');
                readBtn.click();
            } else {
                console.warn('[起点自动阅读] 未找到“阅读”按钮');
            }
        });
    });
})();
