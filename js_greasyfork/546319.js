// ==UserScript==
// @name         移除指定元素和样式
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  删除app-info, divider元素，关闭高度限制，并禁用多个元素的过渡动画
// @author       You
// @match        *://*.xiaohongshu.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546319/%E7%A7%BB%E9%99%A4%E6%8C%87%E5%AE%9A%E5%85%83%E7%B4%A0%E5%92%8C%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/546319/%E7%A7%BB%E9%99%A4%E6%8C%87%E5%AE%9A%E5%85%83%E7%B4%A0%E5%92%8C%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个函数来执行DOM修改操作
    const modifyElements = () => {
        // 1. 查找并删除 .app-info 元素
        const appInfo = document.querySelector('.app-info');
        if (appInfo) {
            appInfo.remove();
            console.log('油猴脚本: .app-info 元素已删除。');
        }

        // 2. 查找 .channel-list 元素并移除其内联 height 样式
        const channelList = document.querySelector('.channel-list');
        if (channelList && channelList.style.height) {
            channelList.style.height = 'auto';
            console.log('油猴脚本: .channel-list 的 height 样式已关闭。');
        }

        // 3. 查找 .channel-list-content 元素并覆盖其 height 样式
        const channelListContent = document.querySelector('.channel-list-content');
        if (channelListContent) {
            channelListContent.style.height = 'auto';
            console.log('油猴脚本: .channel-list-content 的 height 样式已关闭。');
        }

        // 4. 查找并删除 .divider 元素
        const divider = document.querySelector('.channel-list .divider');
        if (divider) {
            divider.remove();
            console.log('油猴脚本: .divider 元素已删除。');
        }

        // 5. 禁用多个元素的过渡动画
        const elementsToModify = [
            '.note-container',
            '.note-detail-mask',
            '.close-circle',
            '.close-box'
        ];

        elementsToModify.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                // 通过设置内联样式并使用 !important 来确保覆盖所有其他样式规则
                element.style.setProperty('transition', 'none', 'important');
                console.log(`油猴脚本: ${selector} 的过渡动画已禁用。`);
            }
        });
    };

    // 由于现代网页内容可能是动态加载的，
    // 我们使用 MutationObserver 来监视DOM的变化。
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                 modifyElements();
            }
        }
    });

    // 配置观察器以监视整个文档的子节点和后代节点变化
    const config = { childList: true, subtree: true };

    // 在文档加载完成后开始观察
    window.addEventListener('load', () => {
        modifyElements();
        observer.observe(document.body, config);
    });

})();
