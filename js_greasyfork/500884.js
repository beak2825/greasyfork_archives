// ==UserScript==
// @name         Edge搜索结果文本复制并防止导航
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  允许复制Edge搜索结果中的预览文本而不跳转页面，并保持正常的光标样式。
// @author       冰雪聪明琪露诺
// @match        *://*.bing.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500884/Edge%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%E5%B9%B6%E9%98%B2%E6%AD%A2%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/500884/Edge%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%E5%B9%B6%E9%98%B2%E6%AD%A2%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止默认点击行为（跳转）的函数
    function preventNavigation(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    // 观察搜索结果页面的变化，以确保处理动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        addEventListeners(node);
                    }
                }
            }
        });
    });

    // 观察器的配置
    const config = { childList: true, subtree: true };

    // 开始观察目标节点的配置变化
    observer.observe(document.body, config);

    // 初始调用以处理现有内容
    addEventListeners(document.body);

    function addEventListeners(node) {
        const previewTexts = node.querySelectorAll('.b_caption p'); // 根据Bing搜索结果的实际结构调整选择器
        previewTexts.forEach(function(previewText) {
            previewText.addEventListener('click', preventNavigation, true);
            previewText.style.cursor = 'text'; // 设置光标样式为文本选择样式
        });
    }
})();
