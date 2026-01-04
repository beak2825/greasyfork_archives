// ==UserScript==
// @name         隐藏 update_password_modal
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  监听页面中的 .update_password_modal 并将其隐藏
// @match        https://n.ihotel.cn/*
// @match        https://uc.ihotel.cn/*
// @author       tzp
// @match        *://*/*  // 在所有网页上运行，您可以修改为特定的域名
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523170/%E9%9A%90%E8%97%8F%20update_password_modal.user.js
// @updateURL https://update.greasyfork.org/scripts/523170/%E9%9A%90%E8%97%8F%20update_password_modal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监控DOM的变动
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // 确认节点是元素节点
                if (node.nodeType === 1) {
                    // 检查是否是 .update_password_modal 元素
                    if (node.classList && node.classList.contains('update_password_modal')) {
                        hideElement(node);
                    }
                    // 如果新增的节点本身不是目标元素，则检查它的子节点
                    const targetElements = node.querySelectorAll && node.querySelectorAll('.update_password_modal');
                    if (targetElements && targetElements.length > 0) {
                        targetElements.forEach(hideElement);
                    }
                }
            });
        });
    });

    // 开始监听 document.body 的子节点变化（包括子树中的所有变动）
    observer.observe(document.body, { childList: true, subtree: true });

    // 隐藏元素的函数
    function hideElement(element) {
        element.style.display = 'none';
        console.log('隐藏了 .update_password_modal 元素:', element);
    }
})();