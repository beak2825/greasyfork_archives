// ==UserScript==
// @name         隐藏广告
// @namespace    https://github.com/yourname
// @version      1.1
// @description  通过关键词模糊匹配class/id隐藏元素
// @match        *://www.bilibili.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529063/%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/529063/%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置需要隐藏的关键词（自动匹配class和id）
    const keywords = [
        'recommend-list-v1',
        'banner',
        'sidebar',
        'footer',
        'slide_ad',
        '-ad-'
    ];

    // 全量隐藏函数
    const hideElements = () => {
        keywords.forEach(keyword => {
            // 构建模糊匹配选择器（匹配class或id）
            const selector = `
                [class*="${keyword}"],
                [id*="${keyword}"]
            `;

            // 查找所有匹配元素并隐藏
            document.querySelectorAll(selector).forEach(el => {
                el.style.cssText = 'display:none !important;';
            });
        });
    };

    // 初始执行
    hideElements();

    // 动态内容处理（节流优化版）
    let isObserving = false;
    const observer = new MutationObserver(() => {
        if (!isObserving) {
            isObserving = true;
            hideElements();
            setTimeout(() => isObserving = false, 500);
        }
    });

    observer.observe(document, {
        subtree: true,
        childList: true,
        attributes: false
    });

    // 注入应急隐藏按钮（可选调试功能）
    const btn = document.createElement('button');
    btn.textContent = '🚫 强制隐藏';
    btn.style = 'position:fixed; right:20px; bottom:20px; z-index:9999; padding:8px;';
    btn.onclick = hideElements;
    document.body.appendChild(btn);
})();
