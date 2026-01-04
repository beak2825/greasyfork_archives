// ==UserScript==
// @name         Bilibili Pc网页取消自动连播
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  取消哔哩哔哩前置自动连播.
// @author       wxllllll
// @match        https://www.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513833/Bilibili%20Pc%E7%BD%91%E9%A1%B5%E5%8F%96%E6%B6%88%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/513833/Bilibili%20Pc%E7%BD%91%E9%A1%B5%E5%8F%96%E6%B6%88%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监控 DOM 变化的函数
    function monitorDOMChanges() {
        // 创建一个 MutationObserver 实例
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // 仅检查元素节点
                            // 查找包含“取消连播”文本的元素
                            const cancelAutoplayText = findCancelAutoplayText(node);
                            if (cancelAutoplayText) {
                                // 模拟点击包含“取消连播”文本的元素
                                cancelAutoplayText.click();
                                console.log("自动点击了包含‘取消连播’的元素");
                            }
                        }
                    });
                }
            });
        });

        // 配置 MutationObserver，要观察的目标节点和选项
        observer.observe(document.body, {
            childList: true, // 监听子节点变化
            subtree: true    // 监听整个 DOM 树
        });
    }

    // 查找包含“取消连播”文本的元素的函数
    function findCancelAutoplayText(node) {
        // 查找节点或其子节点中包含“取消连播”文本的元素
        if (node.textContent && node.textContent.includes("取消连播")) {
            return node;
        } else {
            // 如果当前节点不包含文本，查找其子节点
            const children = node.querySelectorAll("*");
            for (let child of children) {
                if (child.textContent && child.textContent.includes("取消连播")) {
                    return child;
                }
            }
        }
        return null;
    }

    // 当页面加载时调用监控函数
    window.addEventListener('load', monitorDOMChanges);

})();
