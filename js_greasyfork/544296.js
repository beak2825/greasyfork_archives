// ==UserScript==
// @name         GMGN KOL喊单快捷跳转
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  快速跳转到X3.pro查看代币KOL喊单信息
// @author       Crypto.MX
// @match        https://gmgn.ai/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544296/GMGN%20KOL%E5%96%8A%E5%8D%95%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/544296/GMGN%20KOL%E5%96%8A%E5%8D%95%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let currentChain = '';
    let currentTokenAddress = '';

    console.log(`
    ==========================================
    🎯 GMGN KOL喊单快捷跳转脚本已启动
    ==========================================
    版本: 2.0
    功能: 快速跳转到X3.pro查看KOL喊单
    作者: Crypto.MX
    ==========================================
    `);

    /**
     * 添加CSS样式
     */
    function addStyles() {
        GM_addStyle(`
            .kol-jump-icon {
                display: flex;
                gap: 2px;
                align-items: center;
                font-size: 13px;
                line-height: 16px;
                font-weight: normal;
                color: rgb(156, 163, 175);
                transition: colors 0.2s ease;
                cursor: pointer;
                padding: 4px 6px;
                border-radius: 4px;
                background: transparent;
                border: none;
            }
            .kol-jump-icon:hover {
                color: rgb(229, 231, 235);
                background: rgba(75, 85, 99, 0.1);
            }
            .kol-jump-icon svg {
                width: 14px;
                height: 14px;
                fill: currentColor;
            }
        `);
    }

    /**
     * 解析当前URL获取链网络和代币地址
     */
    function parseCurrentUrl() {
        const url = location.href;
        console.log(`[URL解析] 开始解析URL: ${url}`);

        const match = url.match(/\/([^\/]+)\/token\/([^?&#]+)/);
        if (match) {
            currentChain = match[1];
            let rawAddress = match[2];

            // 处理可能存在的前缀
            if (rawAddress.includes('_')) {
                const parts = rawAddress.split('_');
                if (parts.length >= 2) {
                    currentTokenAddress = parts[1];
                    console.log(`[URL解析] 检测到前缀格式，原始: ${rawAddress}, 提取代币地址: ${currentTokenAddress}`);
                } else {
                    currentTokenAddress = rawAddress;
                }
            } else {
                currentTokenAddress = rawAddress;
            }

            if (currentTokenAddress.length >= 32) {
                console.log(`[URL解析] ✅ 解析成功 - 链网络: ${currentChain}, 代币地址: ${currentTokenAddress}`);
            } else {
                console.warn(`[URL解析] ⚠️ 代币地址长度异常: ${currentTokenAddress} (长度: ${currentTokenAddress.length})`);
            }
        } else {
            currentChain = '';
            currentTokenAddress = '';
            console.log('[URL解析] ❌ 无法从URL解析出代币信息');
        }
    }

    /**
     * 跳转到X3.pro页面
     */
    function jumpToX3Pro() {
        if (!currentTokenAddress) {
            console.warn('[跳转] ❌ 无有效的代币地址，无法跳转');
            return;
        }

        const x3ProUrl = `https://x3.pro/trending-tweets/coin-search?address=${currentTokenAddress}`;
        console.log(`[跳转] 🚀 跳转到X3.pro: ${x3ProUrl}`);

        window.open(x3ProUrl, '_blank');
    }

    /**
     * 设置UI界面
     */
    function setupUI() {
        const observer = new MutationObserver(() => {
            if (currentTokenAddress) {
                injectKolIcon();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始尝试注入
        setTimeout(() => {
            if (currentTokenAddress) {
                injectKolIcon();
            }
        }, 1000);
    }

    /**
     * 注入KOL图标
     */
    function injectKolIcon() {
        // 查找目标容器
        const targetSelector = '.flex.items-center.text-sm.gap-x-4px.text-text-300.whitespace-nowrap';
        const container = document.querySelector(targetSelector);

        if (!container) {
            console.log('[UI注入] 未找到目标容器，稍后重试');
            return;
        }

        // 检查是否已经注入过
        if (container.querySelector('.kol-jump-icon')) {
            return;
        }

        // 创建KOL图标元素
        const kolIcon = document.createElement('button');
        kolIcon.className = 'kol-jump-icon';
        kolIcon.title = '查看KOL喊单信息';

        // 使用类似风格的KOL分析图标
        kolIcon.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M10 2C8.34315 2 7 3.34315 7 5C7 6.65685 8.34315 8 10 8C11.6569 8 13 6.65685 13 5C13 3.34315 11.6569 2 10 2ZM5.5 5C5.5 2.51472 7.51472 0.5 10 0.5C12.4853 0.5 14.5 2.51472 14.5 5C14.5 7.48528 12.4853 9.5 10 9.5C7.51472 9.5 5.5 7.48528 5.5 5Z"/>
                <path d="M3 18.5C3 14.634 6.13401 11.5 10 11.5C13.866 11.5 17 14.634 17 18.5V19.25C17 19.6642 16.6642 20 16.25 20C15.8358 20 15.5 19.6642 15.5 19.25V18.5C15.5 15.4624 13.0376 13 10 13C6.96243 13 4.5 15.4624 4.5 18.5V19.25C4.5 19.6642 4.16421 20 3.75 20C3.33579 20 3 19.6642 3 19.25V18.5Z"/>
                <path d="M18.5 5.5C18.9142 5.5 19.25 5.83579 19.25 6.25V8.25C19.25 8.66421 18.9142 9 18.5 9C18.0858 9 17.75 8.66421 17.75 8.25V6.25C17.75 5.83579 18.0858 5.5 18.5 5.5Z"/>
                <path d="M16.75 7.25C16.75 6.83579 17.0858 6.5 17.5 6.5H19.5C19.9142 6.5 20.25 6.83579 20.25 7.25C20.25 7.66421 19.9142 8 19.5 8H17.5C17.0858 8 16.75 7.66421 16.75 7.25Z"/>
            </svg>
            KOL
        `;

        // 绑定点击事件
        kolIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            jumpToX3Pro();
        });

        // 插入到容器中
        container.appendChild(kolIcon);

        console.log(`[UI注入] ✅ KOL图标已注入，代币地址: ${currentTokenAddress}`);
    }

    /**
     * 监听URL变化
     */
    function setupUrlChangeListener() {
        let lastUrl = location.href;

        // 监听浏览器历史变化
        window.addEventListener('popstate', () => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                handleUrlChange();
            }
        });

        // 监听pushState和replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(handleUrlChange, 100);
        };

        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            setTimeout(handleUrlChange, 100);
        };

        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                handleUrlChange();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 处理URL变化
     */
    function handleUrlChange() {
        console.log('[URL监听] 检测到URL变化:', location.href);

        const oldTokenAddress = currentTokenAddress;
        parseCurrentUrl();

        if (currentTokenAddress !== oldTokenAddress) {
            console.log(`[URL监听] 代币地址已变化: ${oldTokenAddress} -> ${currentTokenAddress}`);

            // 移除旧的图标
            const oldIcons = document.querySelectorAll('.kol-jump-icon');
            oldIcons.forEach(icon => icon.remove());

            // 延迟注入新图标
            setTimeout(() => {
                if (currentTokenAddress) {
                    injectKolIcon();
                }
            }, 500);
        }
    }

    /**
     * 初始化脚本
     */
    function init() {
        console.log('[脚本初始化] 🚀 开始初始化KOL快捷跳转脚本');

        addStyles();
        parseCurrentUrl();
        setupUI();
        setupUrlChangeListener();

        console.log('[脚本初始化] ✅ KOL快捷跳转脚本初始化完成');
    }

    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();