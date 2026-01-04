// ==UserScript==
// @name         B站(防AdGuard)弹窗拦截
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  自动移除B站"检测到您的页面展示可能受到浏览器插件影响"的弹窗
// @author       PPPotatooo
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532569/B%E7%AB%99%28%E9%98%B2AdGuard%29%E5%BC%B9%E7%AA%97%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/532569/B%E7%AB%99%28%E9%98%B2AdGuard%29%E5%BC%B9%E7%AA%97%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除弹窗的函数
    function removeAdblockPopup() {
        const popups = document.querySelectorAll('.adblock-tips');
        popups.forEach(popup => {
            popup.style.display = 'none';
        });
    }

    // 页面加载完成后立即执行一次
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAdblockPopup);
    } else {
        removeAdblockPopup();
    }

    // 设置MutationObserver来处理动态添加的弹窗
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // 检查新添加的节点中是否有弹窗
                const hasPopup = Array.from(mutation.addedNodes).some(node => {
                    if (node.nodeType === 1) { // 元素节点
                        if (node.classList && node.classList.contains('adblock-tips')) {
                            return true;
                        }
                        // 检查子节点
                        return node.querySelector('.adblock-tips') !== null;
                    }
                    return false;
                });

                if (hasPopup) {
                    removeAdblockPopup();
                }
            }
        });
    });

    // 开始观察文档变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();