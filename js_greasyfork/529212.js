// ==UserScript==
// @name         小黑盒网页刷新
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  给小黑盒网页版添加导航栏刷新按钮和回到顶部按钮上方悬浮刷新按钮
// @author       sjx01
// @match        https://www.xiaoheihe.cn/app/bbs/*
// @icon         https://www.xiaoheihe.cn/favicon.ico
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529212/%E5%B0%8F%E9%BB%91%E7%9B%92%E7%BD%91%E9%A1%B5%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/529212/%E5%B0%8F%E9%BB%91%E7%9B%92%E7%BD%91%E9%A1%B5%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 常量定义
    const TARGET_URL = 'https://www.xiaoheihe.cn/app/bbs/home'; // 任意页面点击刷新都回到首页刷新帖子
    const DEBOUNCE_DELAY = 100;

    // 配置参数
    const config = {
        design: {
            // 导航栏按钮参数
            navButton: {
                size: 46,
                iconSize: 24,
                spacing: 8,
                colors: {
                    normal: '#8C9196',
                    active: '#2196F3'
                }
            },
            // 悬浮按钮参数
            floatButton: {
                baseZIndex: 9999, // 避免被覆盖
                animationDuration: '0.6s'
            }
        },
        // 选择器参数
        selectors: {
            navContainer: '.hb-view-catalog',
            lastNavButton: '.hb-view-catalog__button:last-child',
            floatButtonGroup: '.scroll-list__button-group'
        }
    };

    // 样式注入
    GM_addStyle(`
        /* ========= 导航栏按钮样式 ========= */
        .hhx-refresh-container {
            margin-top: ${config.design.navButton.spacing}px !important;
            width: 100% !important;
            position: relative !important;
        }

        .hhx-refresh-btn {
            width: 100% !important;
            height: ${config.design.navButton.size}px !important;
            background: rgba(140, 145, 150, 0.1) !important;
            border-radius: 4px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }

        .hhx-refresh-btn:hover {
            background: rgba(140, 145, 150, 0.15) !important;
        }

        .hhx-refresh-icon {
            width: ${config.design.navButton.iconSize}px !important;
            height: ${config.design.navButton.iconSize}px !important;
            position: relative !important;
        }

        .hhx-refresh-icon circle {
            stroke: currentColor;
            stroke-width: 2;
            fill: none;
            stroke-linecap: round;
            transition: stroke 0.3s;
        }

        .hhx-refresh-btn:hover .hhx-refresh-icon,
        .hhx-refresh-btn.loading .hhx-refresh-icon {
            animation: hhx-spin ${config.design.floatButton.animationDuration} linear infinite;
        }

        .hhx-refresh-text {
            font-size: 14px !important;
            color: ${config.design.navButton.colors.normal} !important;
            margin-left: 8px !important;
            transition: color 0.3s !important;
        }

        .hhx-refresh-btn:hover .hhx-refresh-text {
            color: ${config.design.navButton.colors.active} !important;
        }

        /* ========= 悬浮按钮样式 ========= */
        .hhx-float-container {
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
        }

        .hhx-float-refresh {
            position: relative !important;
            background: #fff !important;
            border-radius: 12px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
            border: none !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0;
            transition: all 0.3s !important;
            padding: 0 !important;
            z-index: ${config.design.floatButton.baseZIndex} !important;
        }

        .hhx-float-container:hover .hhx-float-refresh,
        .hhx-float-container.visible .hhx-float-refresh {
            opacity: 1 !important;
        }

        .hhx-float-refresh:hover {
            transform: scale(1.06);
            box-shadow: 0 3px 12px rgba(0,0,0,0.15) !important;
        }

        .hhx-float-refresh svg {
            width: 55% !important;
            height: 55% !important;
            fill: #666 !important;
            transition: transform 0.3s !important;
        }

        .hhx-float-refresh:hover svg {
            transform: rotate(120deg) !important;
        }

        @keyframes hhx-spin {
            100% { transform: rotate(360deg); }
        }
    `);

    // DOM 节点缓存(减少 DOM 操作)
    const nodeCache = {
        navContainer: null,
        lastNavButton: null,
        floatButtonGroup: null
    };

    // 防抖函数(降低 MutationObserver 触发频率)
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // ================= 导航栏按钮逻辑 =================
    // SVG 创建
    const createRefreshIcon = () => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.innerHTML = `
            <circle cx="12" cy="12" r="9" opacity="0.2"/>
            <circle cx="12" cy="12" r="9" stroke-dasharray="20 100" transform="rotate(-90 12 12)"/>
        `;
        svg.setAttribute("class", "hhx-refresh-icon");
        svg.setAttribute("viewBox", "0 0 24 24");
        return svg;
    };

    // 导航栏按钮创建
    const createNavRefreshButton = () => {
        const container = document.createElement('div');
        container.className = 'hhx-refresh-container';

        const btn = document.createElement('div');
        btn.className = 'hhx-refresh-btn';
        btn.append(createRefreshIcon());

        const text = document.createElement('span');
        text.className = 'hhx-refresh-text';
        text.textContent = '刷新';
        btn.appendChild(text);

        btn.addEventListener('click', () => {
            if (btn.classList.contains('loading')) return;
            btn.classList.add('loading');
            setTimeout(() => window.location.href = TARGET_URL, 800);
        });

        container.appendChild(btn);
        return container;
    };

    // 悬浮按钮创建
    const createFloatButton = () => {
        const baseBtn = document.querySelector('.scroll-list__top-btn');
        if (!baseBtn) return null;

        const btn = document.createElement('button');
        btn.className = 'hhx-float-refresh';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
        `;

        // 尺寸同步
        new ResizeObserver(() => {
            const rect = baseBtn.getBoundingClientRect();
            btn.style.width = `${rect.width}px`;
            btn.style.height = `${rect.height}px`;
            btn.style.borderRadius = rect.height <= 30 ? '4px' : '50%';
        }).observe(baseBtn);

        return btn;
    };

    // ================= 节点注入逻辑 =================
    const injectNodes = debounce(() => {
        // 导航栏按钮注入
        if (!nodeCache.navContainer) {
            nodeCache.navContainer = document.querySelector(config.selectors.navContainer);
            nodeCache.lastNavButton = document.querySelector(config.selectors.lastNavButton);
        }

        if (nodeCache.navContainer && nodeCache.lastNavButton &&
            !nodeCache.navContainer.querySelector('.hhx-refresh-container')) {
            const refreshBtn = createNavRefreshButton();
            nodeCache.navContainer.insertBefore(refreshBtn, nodeCache.lastNavButton.nextElementSibling);
            nodeCache.navContainer.style.paddingBottom = `${config.design.navButton.spacing * 2}px`;
        }

        // 悬浮按钮注入
        if (!nodeCache.floatButtonGroup) {
            nodeCache.floatButtonGroup = document.querySelector(config.selectors.floatButtonGroup);
        }

        if (nodeCache.floatButtonGroup && !nodeCache.floatButtonGroup.querySelector('.hhx-float-refresh')) {
            const floatBtn = createFloatButton();
            if (floatBtn) {
                nodeCache.floatButtonGroup.classList.add('hhx-float-container');
                nodeCache.floatButtonGroup.insertBefore(floatBtn, nodeCache.floatButtonGroup.firstChild);
                floatBtn.addEventListener('click', () => window.location.href = TARGET_URL);
            }
        }
    }, DEBOUNCE_DELAY);

    // ================= 统一初始化 =================
    const init = () => {
        const observer = new MutationObserver(injectNodes);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 按钮注入
        injectNodes();
    };

    // 启动脚本
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
