// ==UserScript==
// @name         知乎自动关闭登录窗
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  尝试精确地关闭知乎登录窗口
// @author       icescat
// @match        *://*.zhihu.com/*
// @grant        none
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488399/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/488399/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 直接尝试点击关闭按钮
    const tryClickCloseButton = () => {
        const closeButton = document.querySelector('.Modal-closeButton');
        if (closeButton) {
            closeButton.click();
        }
    };

    // 使用MutationObserver实时关闭后续出现的登录窗
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                tryClickCloseButton(); // 如果出现新元素，尝试点击关闭按钮
            }
        });
    });

    const config = {
        childList: true,
        subtree: true
    };

    // 在文档加载后立即执行关闭操作，并开始监控DOM变化
    document.addEventListener('DOMContentLoaded', () => {
        tryClickCloseButton();
        observer.observe(document.body, config);
    });
})();
