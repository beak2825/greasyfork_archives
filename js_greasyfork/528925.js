// ==UserScript==
// @name         简道云文本框内容复制助手Pro
// @namespace    https://www.jiandaoyun.com/copy
// @version      4.1.2
// @description  双击文本框的文字，可以复制内容到剪贴板。方便复制内容粘贴到其他页面。
// @author       偶然好看
// @license MIT
// @match        https://www.jiandaoyun.com/*
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528925/%E7%AE%80%E9%81%93%E4%BA%91%E6%96%87%E6%9C%AC%E6%A1%86%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8BPro.user.js
// @updateURL https://update.greasyfork.org/scripts/528925/%E7%AE%80%E9%81%93%E4%BA%91%E6%96%87%E6%9C%AC%E6%A1%86%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8BPro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 综合配置系统
    const CONFIG = {
        TARGETS: [
            'div.fx-form-content-disabled span',
            '.subform-cell .fx-form-content-disabled span',
            'input[type="text"]:not([readonly])',
            'textarea:not([readonly])',
            '.input-inner input',
            '[data-editable="true"]'
        ],
        ROUTE_MARKERS: ['.router-link-active', '.tab-header-active'],
        RETRY: { MAX: 5, INTERVAL: 800 },
        STYLES: {
            cursor: 'pointer',
            rippleColor: 'rgba(24, 144, 255, 0.3)',
            inputRipple: '#1890ff33'
        }
    };

    const state = {
        activeRoute: null,
        observer: null,
        retryCount: 0,
        processing: false
    };

    // 新增缺失的函数
    function tagElement(element) {
        if (!element.dataset.superCopy) {
            element.dataset.superCopy = 'true';
            element.style.pointerEvents = 'auto';
            console.debug('[Tag] 元素标记完成:', element);
        }
    }

    function init() {
        if (window.__superCopy) return;
        window.__superCopy = true;

        injectMasterStyles();
        setupGlobalHandlers();
        startRouteWatcher();
        performDeepScan();
        console.info('[Master] 脚本已激活');
    }

    function injectMasterStyles() {
        const style = document.createElement('style');
        style.textContent = `
            [data-super-copy] {
                cursor: ${CONFIG.STYLES.cursor} !important;
                user-select: text !important;
                -webkit-user-select: text !important;
                position: relative !important;
            }
            .super-ripple {
                position: absolute;
                background: ${CONFIG.STYLES.rippleColor};
                border-radius: 50%;
                animation: superRipple 0.6s ease-out;
                transform: scale(0);
                pointer-events: none;
            }
            @keyframes superRipple {
                to { transform: scale(8); opacity: 0; }
            }
        `;
        document.head.prepend(style);
    }

    function setupGlobalHandlers() {
        document.addEventListener('dblclick', event => {
            const target = event.target.closest(CONFIG.TARGETS.join(','));
            target && processCopy(target, event);
        }, true);
    }

    async function processCopy(element, event) {
        if (state.processing) return;
        state.processing = true;

        try {
            let text = element.textContent.trim() || element.value;
            // 新增处理千分符的逻辑
            const thousandSeparatorRegex = /^\d{1,3}(,\d{3})*\.\d{2}$/;
            if (thousandSeparatorRegex.test(text)) {
                text = text.replace(/,/g, '');
            }
            await GM_setClipboard(text);
            showFeedback(element, event);
            console.log('[Success] 复制成功:', text);
        } catch (err) {
            console.error('[Error] 复制失败:', err);
        } finally {
            state.processing = false;
        }
    }

    function showFeedback(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        Object.assign(ripple.style, {
            left: `${event.clientX - rect.left}px`,
            top: `${event.clientY - rect.top}px`,
        });
        ripple.className = 'super-ripple';
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    function startRouteWatcher() {
        const checkRoute = () => {
            const routeSign = document.querySelector(CONFIG.ROUTE_MARKERS)?.innerHTML;
            if (routeSign !== state.activeRoute) {
                state.activeRoute = routeSign;
                performDeepScan(true);
            }
            requestAnimationFrame(checkRoute);
        };
        checkRoute();
    }

    function performDeepScan(force = false) {
        if (state.retryCount >= CONFIG.RETRY.MAX && !force) return;

        // 修复点：使用统⼀的tagElement函数
        document.querySelectorAll(CONFIG.TARGETS.join(','))
            .forEach(tagElement);

        if (!state.observer) {
            state.observer = new MutationObserver(mutations => {
                mutations.forEach(({ addedNodes }) => {
                    addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            node.querySelectorAll(CONFIG.TARGETS.join(','))
                                .forEach(tagElement); // 使用已定义的函数
                        }
                    });
                });
            });
            state.observer.observe(document, {
                childList: true,
                subtree: true
            });
        }

        if (!document.querySelector(CONFIG.TARGETS) && !force) {
            state.retryCount++;
            setTimeout(performDeepScan, CONFIG.RETRY.INTERVAL);
        } else {
            state.retryCount = 0;
        }
    }

    // 安全启动
    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
})();