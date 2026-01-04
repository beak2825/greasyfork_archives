// ==UserScript==
// @name         Shopee 悬浮按钮
// @namespace    http://tampermonkey.net/
// @version      2.1.4
// @license      Rayu
// @description  悬浮快捷入口
// @author       Rayu
// @match        https://seller.shopee.tw/*
// @exclude      https://seller.shopee.tw/webchat/conversations
// @match        *://shopee.tw/*
// @match        *://shopee.ph/*
// @match        *://shopee.sg/*
// @match        *://shopee.com.my/*
// @icon         https://www.wikimedia.org/static/favicon/wikipedia.ico
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/469463/Shopee%20%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/469463/Shopee%20%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 配置中心
    const CONFIG = {
        BUTTONS: [
            {
                id: 'shipment-btn',
                content: '待<br>出货',
                path: '/portal/sale/shipment?type=toship',
                title: '待处理订单'
            },
            {
                id: 'products-btn',
                content: '我的<br>商品',
                path: '/portal/product/list/all?page=1&size=48',
                title: '商品管理'
            },
            {
                id: 'analytics-btn',
                content: '商品<br>分析',
                path: '/datacenter/product/overview',
                title: '数据分析'
            },
            {
                id: 'ads-btn',
                content: '我的<br>广告',
                path: '/portal/marketing/pas/assembly',
                title: '广告管理'
            },
            {
                id: 'campaign-btn',
                content: '行销<br>活动',
                path: '/portal/marketing/list/discount',
                title: '营销活动'
            },
            {
                id: 'returns-btn',
                content: '退貨<br>退款',
                path: '/portal/sale/return',
                title: '退货退款'
            }
        ],
        TRACKING_PATTERN: /-i\.(\d+)\.(\d+)/,
        STYLES: `
            :root {
                --primary-color: #ee4d2d;
                --button-size: 52px;
                --hover-scale: 1.08;
                --gap: 8px;
            }
            #floating-buttons-container {
                position: fixed;
                top: 50vh;
                right: 50px;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                gap: var(--gap);
                z-index: 9999;
                filter: drop-shadow(0 2px 6px rgba(0,0,0,0.16));
            }
            .floating-button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: var(--button-size);
                height: var(--button-size);
                background: var(--primary-color);
                color: white !important;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 500;
                line-height: 1.3;
                text-align: center;
                text-decoration: none !important;
                cursor: pointer;
                transition:
                    transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28),
                    opacity 0.2s,
                    background 0.2s;
                user-select: none;
            }
            .floating-button:hover {
                transform: scale(var(--hover-scale));
                background: #d14327;
                opacity: 0.95;
            }
            .floating-button:active {
                transition-duration: 0.1s;
                transform: scale(0.96);
            }
            @media (max-width: 768px) {
                #floating-buttons-container {
                    right: 4px;
                    transform: translateY(-50%) scale(0.82);
                    gap: 6px;
                }
                .floating-button {
                    width: 46px;
                    height: 46px;
                    font-size: 14px;
                }
            }
        `
    };
    // 核心功能模块
    class ShopeeEnhancer {
        constructor() {
            this.observer = null;
            this.reg = CONFIG.TRACKING_PATTERN;
            this.init();
        }
        init() {
            this.injectStyles();
            this.createFloatingButtons();
            this.hijackHistoryMethods();
            this.sanitizeLinks();
        }
        injectStyles() {
            GM_addStyle(CONFIG.STYLES);
        }
        createFloatingButtons() {
            // 清理老容器
            let container = document.getElementById('floating-buttons-container');
            if (container) container.remove();
            // 新建右侧容器
            container = document.createElement('div');
            container.id = 'floating-buttons-container';
            document.body.appendChild(container);
            // 添加配置按钮
            CONFIG.BUTTONS.forEach(btn => {
                let a = document.createElement('a');
                a.className = 'floating-button';
                a.id = btn.id;
                a.href = btn.path.startsWith('javascript:') ? '#' : new URL(btn.path, window.location.origin);
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.title = btn.title;
                a.innerHTML = btn.content;
                container.appendChild(a);
            });
        }
        // URL清理功能
        cleanURL(url) {
            const match = url.match(this.reg);
            if (!match) return url;
            return `${window.location.origin}/product/${match[1]}/${match[2]}`;
        }
        // 劫持历史记录方法，优化URL
        hijackHistoryMethods() {
            const self = this;
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            history.pushState = function (state, title, url) {
                if (url) url = self.cleanURL(url);
                return originalPushState.call(this, state, title, url);
            };
            history.replaceState = function (state, title, url) {
                if (url) url = self.cleanURL(url);
                return originalReplaceState.call(this, state, title, url);
            };
        }
        // 清理页面链接
        sanitizeLinks() {
            if (this.reg.test(window.location.href)) {
                window.location.replace(this.cleanURL(window.location.href));
                return;
            }
            this.processLinks(document);
            // 监控动态加载的内容
            this.observer = new MutationObserver(mutations => {
                mutations.forEach(({ addedNodes }) => {
                    addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.processLinks(node);
                        }
                    });
                });
            });
            this.observer.observe(document, {
                subtree: true,
                childList: true
            });
        }
        // 处理链接
        processLinks(root) {
            const links = root.querySelectorAll('a[href*="-i."]');
            links.forEach(link => {
                link.href = this.cleanURL(link.href);
            });
        }
    }
    // 启动脚本
    const enhancer = new ShopeeEnhancer();
    // 监控路由变化，更新悬浮按钮
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            enhancer.createFloatingButtons();
        }
    }, 1000);
    // --------------- 以下为你提供的代码 ---------------
    GM_addStyle(`
        /* 解除eds-table主体高度限制和滚动 */
        .eds-table__body-container,
        .eds-scrollbar__wrapper,
        .eds-scrollbar__content,
        .eds-scrollbar,
        .eds-table,
        .eds-table__main-body,
        .eds-table__main-header,
        .roi-batch-auto-bidding-strategy-wrapper,
        .common-card__content,
        .common-card,
        [data-v-461b9dcb], /* 视需要加 */
        [data-v-529f5f34] {
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
        }
        /* 隐藏所有滚动条 */
        .eds-scrollbar__bar.horizontal,
        .eds-scrollbar__bar.vertical {
            display: none !important;
        }
    `);
    const targetSelector = [
        '.eds-table__body-container',
        '.eds-scrollbar__wrapper',
        '.eds-scrollbar__content',
        '.eds-scrollbar',
        '.eds-table',
        '.eds-table__main-body',
        '.eds-table__main-header',
        '.roi-batch-auto-bidding-strategy-wrapper',
        '.common-card__content',
        '.common-card',
        '[data-v-461b9dcb]',
        '[data-v-529f5f34]'
    ].join(',');
    function clearHeightAndOverflow() {
        document.querySelectorAll(targetSelector).forEach(el => {
            el.style.maxHeight = 'none';
            el.style.height = 'auto';
            el.style.overflow = 'visible';
        });
    }
    clearHeightAndOverflow();
    const observer = new MutationObserver(() => {
        clearHeightAndOverflow();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();