// ==UserScript==
// @name         知乎优化-专项优化
// @namespace    https://zhihu.com/
// @version      1.4
// @description  1- 隐藏搜索框里的推荐；2- 隐藏辟谣卡片
// @author       AI
// @match        https://www.zhihu.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535533/%E7%9F%A5%E4%B9%8E%E4%BC%98%E5%8C%96-%E4%B8%93%E9%A1%B9%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/535533/%E7%9F%A5%E4%B9%8E%E4%BC%98%E5%8C%96-%E4%B8%93%E9%A1%B9%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*************** 样式注入：隐藏搜索框里的推荐与辟谣卡片 ***************/
    const style = document.createElement('style');
    style.textContent = `
        /* 隐藏辟谣卡片 */
        div:has(> div > div[style*="rotateX"][style*="opacity"] > div > a) {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            transform: none !important;
            animation: none !important;
            transition: none !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
        }

        /* 隐藏搜索框里的推荐 */
        .SearchBar-input input[placeholder] {
            color: inherit !important;
            -webkit-text-fill-color: inherit !important;
        }
        .SearchBar-input input[placeholder]::placeholder {
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    /*************** 隐藏辟谣卡片：动态处理 ***************/
    function hideFlippingCards() {
        requestAnimationFrame(() => {
            const containers = document.querySelectorAll(
                'div:has(> div > div[style*="rotateX"][style*="opacity"] > div > a)'
            );
            containers.forEach(container => {
                container.style.display = 'none';
                container.style.visibility = 'hidden';
                container.style.opacity = '0';
                container.style.height = '0';
                container.style.width = '0';
                container.style.overflow = 'hidden';
            });
        });
    }

    // 初始隐藏
    hideFlippingCards();

    // MutationObserver 优化
    const cardObserver = new MutationObserver(() => {
        hideFlippingCards();
    });

    cardObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });

    /*************** 隐藏搜索框里的推荐：动态处理 ***************/
    function clearSearchPlaceholder() {
        const inputs = document.querySelectorAll('.SearchBar-input input');
        inputs.forEach(input => {
            if (input.placeholder !== '') {
                input.placeholder = '';
                input.setAttribute('placeholder', '');
            }
        });
    }

    // 初始清空
    clearSearchPlaceholder();

    // 监控 placeholder 属性变化
    const placeholderObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'placeholder') {
                const input = mutation.target;
                if (input.placeholder !== '') {
                    input.placeholder = '';
                    input.setAttribute('placeholder', '');
                }
            }
        });
    });

    // 为现有输入框绑定观察
    document.querySelectorAll('.SearchBar-input input').forEach(input => {
        placeholderObserver.observe(input, {
            attributes: true,
            attributeFilter: ['placeholder']
        });
    });

    // 监控动态添加的输入框
    const inputObserver = new MutationObserver(() => {
        document.querySelectorAll('.SearchBar-input input').forEach(input => {
            if (!input.__observed) {
                placeholderObserver.observe(input, {
                    attributes: true,
                    attributeFilter: ['placeholder']
                });
                input.__observed = true;
                if (input.placeholder !== '') {
                    input.placeholder = '';
                    input.setAttribute('placeholder', '');
                }
            }
        });
    });

    inputObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 焦点事件清空 placeholder
    document.addEventListener('focusin', (event) => {
        const input = event.target;
        if (input.matches('.SearchBar-input input') && input.placeholder !== '') {
            input.placeholder = '';
            input.setAttribute('placeholder', '');
        }
    });

    // 周期性检查
    setInterval(() => {
        clearSearchPlaceholder();
        hideFlippingCards();
    }, 200);

    // 在 DOM 加载完成时再检查一次
    document.addEventListener('DOMContentLoaded', () => {
        hideFlippingCards();
        clearSearchPlaceholder();
    });
})();