// ==UserScript==
// @name         Square Corners for All Elements - 全局方角
// @namespace    http://tampermonkey.net/
// @version      Beta
// @description  硬朗风网页：将网页圆角变为方角！
// @author       ZiLite
// @license MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497124/Square%20Corners%20for%20All%20Elements%20-%20%E5%85%A8%E5%B1%80%E6%96%B9%E8%A7%92.user.js
// @updateURL https://update.greasyfork.org/scripts/497124/Square%20Corners%20for%20All%20Elements%20-%20%E5%85%A8%E5%B1%80%E6%96%B9%E8%A7%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个高优先级样式
    const css = `
        body *:not(.specific-class-1):not(.specific-class-2):not(.specific-class-3) {
            border-radius: 0 !important;
        }
    `;

    // 将样式添加到页面
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(css, style.sheet.cssRules.length);

    // 监听DOM变化，动态应用样式
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                Array.from(mutation.addedNodes).forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        applyStylesToNode(node);
                    }
                });
            }
        });
    });

    // 应用样式到节点
    function applyStylesToNode(node) {
        if (!node.classList.contains('specific-class-1') &&
            !node.classList.contains('specific-class-2') &&
            !node.classList.contains('specific-class-3')) {
            node.style.borderRadius = '0 !important';
        }
    }

    // 观察整个文档
    observer.observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true
    });

    // 初始应用样式
    document.querySelectorAll('body *').forEach(applyStylesToNode);
})();