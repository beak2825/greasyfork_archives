// ==UserScript==
// @name         Folo 更宽显示
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  直接针对容器宽度限制进行优化
// @author       ObenK
// @license      MIT
// @match        https://app.folo.is/*
// @match        https://follow.is/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543674/Folo%20%E6%9B%B4%E5%AE%BD%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/543674/Folo%20%E6%9B%B4%E5%AE%BD%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 直接针对问题根源：max-w-full 和 clamp 限制
    function forceWide() {
        // 移除所有 max-w-full 限制
        document.querySelectorAll('.max-w-full').forEach(el => {
            el.style.maxWidth = 'none';
            el.style.width = '100%';
        });

        // 移除所有 clamp 限制
        document.querySelectorAll('[class*="max-w-"]').forEach(el => {
            el.style.maxWidth = 'none';
            el.style.width = '100%';
        });

        // 移除所有 max-w-prose 限制
        document.querySelectorAll('.max-w-prose, .max-w-none').forEach(el => {
            el.style.maxWidth = 'none';
            el.style.width = '100%';
        });

        // 专门处理内容页容器
        const contentContainer = document.querySelector('.mx-auto.mb-32.mt-8');
        if (contentContainer) {
            contentContainer.style.maxWidth = 'none';
            contentContainer.style.width = '100%';
            contentContainer.style.paddingLeft = '1rem';
            contentContainer.style.paddingRight = '1rem';
        }

        // 处理AI总结容器
        const aiContainer = document.querySelector('.group.relative.my-8');
        if (aiContainer) {
            aiContainer.style.maxWidth = 'none';
            aiContainer.style.width = '100%';

            // 处理高度限制
            const heightContainer = aiContainer.querySelector('.overflow-hidden[style*="height"]');
            if (heightContainer) {
                heightContainer.style.height = 'auto';
                heightContainer.style.maxHeight = 'none';
            }
        }

        // 处理文章内容
        const proseElements = document.querySelectorAll('.prose, .prose-sm, .prose-lg, .prose-xl');
        proseElements.forEach(el => {
            el.style.maxWidth = 'none';
            el.style.width = '100%';
        });
    }

    // 添加强力CSS覆盖
    function addForceStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 强制移除所有宽度限制 */
            .max-w-full,
            .max-w-prose,
            .max-w-none,
            [class*="max-w-"] {
                max-width: none !important;
                width: 100% !important;
            }

            /* 强制展开内容容器 */
            .mx-auto.mb-32.mt-8 {
                max-width: none !important;
                width: 100% !important;
                padding-left: 1rem !important;
                padding-right: 1rem !important;
            }

            /* 强制展开AI总结 */
            .group.relative.my-8 {
                max-width: none !important;
                width: 100% !important;
            }

            .group.relative.my-8 .overflow-hidden[style*="height"] {
                height: auto !important;
                max-height: none !important;
            }

            /* 强制展开文章内容 */
            .prose, .prose-sm, .prose-lg, .prose-xl {
                max-width: none !important;
                width: 100% !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ESC快捷键处理：关闭文章内容并切换焦点回文章列表
    function handleEscKey(event) {
        if (event.key === 'Escape') {
            // 直接查找指定的关闭按钮：i-mgc-close-cute-re
            const closeIcon = document.querySelector('i.i-mgc-close-cute-re');
            if (closeIcon) {
                const closeButton = closeIcon.closest('button') || closeIcon.parentElement;
                if (closeButton) {
                    closeButton.click();

                    // 延迟后将焦点设置到指定的今日按钮元素
                    setTimeout(() => {
                        const targetElement = document.querySelector('.relative.flex.items-center.text-sm.lg\\:text-base.gap-1.px-4.font-bold.text-text.h-7 button');

                        if (targetElement) {
                            targetElement.focus();
                            // 添加视觉提示
                            targetElement.style.outline = '2px solid #007bff';
                            targetElement.style.outlineOffset = '2px';

                            // 2秒后移除视觉提示
                            setTimeout(() => {
                                targetElement.style.outline = '';
                                targetElement.style.outlineOffset = '';
                            }, 2000);
                        }
                    }, 100);
                }
            }
        }
    }

    // 持续优化
    function continuousOptimize() {
        addForceStyles();
        forceWide();

        // 每500ms检查一次，确保持续有效
        setInterval(forceWide, 500);
    }

    // 初始化
    function init() {
        continuousOptimize();

        // 添加ESC键监听
        document.addEventListener('keydown', handleEscKey);

        // 监听所有变化
        new MutationObserver(() => {
            setTimeout(forceWide, 100);
        }).observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
