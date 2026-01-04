// ==UserScript==
// @name         去除rule34.xxx广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动从网页中删除指定的元素
// @author       通义千问2.5
// @match        https://rule34.xxx/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511558/%E5%8E%BB%E9%99%A4rule34xxx%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/511558/%E5%8E%BB%E9%99%A4rule34xxx%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要删除的元素的选择器
    const selectorsToRemove = [
        'div.a_list#lmid',
        'div[style="display: inline-flex; vertical-align: top;"]',
        'div.horizontalFlexWithMargins[style="justify-content: center"][data-nosnippet]',
        'div.exo-native-widget-outer-container',
        'span[data-nosnippet]'
    ];

    // 删除匹配选择器的元素
    function removeElements(selectors) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                console.log(`删除了元素:`, element);
                element.remove();
            });
        });
    }

    // 初始化脚本
    function init() {
        console.log('脚本已启动');

        // 首次运行，处理现有元素
        removeElements(selectorsToRemove);

        // 监听DOM变化，以便动态添加的元素也能被处理
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        removeElements(selectorsToRemove);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        console.log('DOM观察器已启动');
    }

    // 确保在页面加载完成后初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();