// ==UserScript==
// @name         去除绑定账号弹框
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Remove modal-mask and bind-phone-number-form elements, and rewrite scroll listener
// @author       AnmSleepalone
// @match        *://juejin.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521842/%E5%8E%BB%E9%99%A4%E7%BB%91%E5%AE%9A%E8%B4%A6%E5%8F%B7%E5%BC%B9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/521842/%E5%8E%BB%E9%99%A4%E7%BB%91%E5%AE%9A%E8%B4%A6%E5%8F%B7%E5%BC%B9%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数：移除指定的元素
    function removeElements() {
        // 移除 modal-mask 元素
        const modalMasks = document.getElementsByClassName('modal-mask');
        while (modalMasks.length > 0) {
            modalMasks[0].remove();
        }

        // 移除 bind-phone-number-form 元素
        const phoneforms = document.getElementsByClassName('bind-phone-number-form');
        while (phoneforms.length > 0) {
            phoneforms[0].remove();
        }

        // 恢复页面滚动
        document.body.style.overflow = 'auto';
    }

    // 函数：重写滚动监听
    function setupScrollListener() {
        // 移除可能存在的所有滚动事件监听器
        window.onscroll = null;

        // 添加新的滚动监听器
        let lastScrollPosition = window.pageYOffset;
        let ticking = false;

        window.addEventListener('scroll', function() {
            lastScrollPosition = window.pageYOffset;

            if (!ticking) {
                window.requestAnimationFrame(function() {
                    // 在这里处理滚动事件
                    console.log('Scroll position:', lastScrollPosition);
                    // 可以在这里添加你的自定义滚动逻辑

                    ticking = false;
                });

                ticking = true;
            }
        }, { passive: true });
    }

    // 主函数：等待DOM加载完成后执行
    function init() {
        // 立即执行一次移除
        removeElements();

        // 设置新的滚动监听
        setupScrollListener();

        // 创建 MutationObserver 来监视 DOM 变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    removeElements();
                }
            });
        });

        // 配置 observer
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 当页面加载完成后执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();