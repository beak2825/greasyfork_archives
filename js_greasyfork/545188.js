// ==UserScript==
// @name         B站广告拦截提示移除器
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  移除B站首页顶部广告拦截提示
// @author       levinism
// @match        https://www.bilibili.com/
// @grant        none
// @run-at       document-end
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545188/B%E7%AB%99%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E6%8F%90%E7%A4%BA%E7%A7%BB%E9%99%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545188/B%E7%AB%99%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E6%8F%90%E7%A4%BA%E7%A7%BB%E9%99%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主要移除函数
    const removeAdblockTip = () => {
        // 查找广告提示元素
        const adblockTip = document.querySelector('div.adblock-tips');

        if (adblockTip) {
            // 移除广告提示元素
            adblockTip.remove();
            console.log('B站广告拦截提示已移除');

            // 检查并恢复被隐藏的顶部导航栏
            const header = document.querySelector('header');
            if (header && header.style.top === '40px') {
                header.style.top = '0';
            }
        }
    };

    // 立即尝试移除
    removeAdblockTip();

    // 使用MutationObserver监控DOM变化
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            // 检查新增节点中是否包含广告提示
            if (mutation.addedNodes.length) {
                removeAdblockTip();
            }
        }
    });

    // 开始监控整个文档的变化
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // 额外添加CSS样式确保完全隐藏
    const style = document.createElement('style');
    style.innerHTML = `
        div.adblock-tips {
            display: none !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            visibility: hidden !important;
        }

        body {
            padding-top: 0 !important;
        }
    `;
    document.head.appendChild(style);
})();