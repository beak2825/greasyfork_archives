// ==UserScript==
// @name         GMGN Solscan 跳转按钮
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为gmgn.ai网站的钱包地址添加Solscan跳转按钮，但在特定区域内不显示
// @author      memeslayer
// @license     MIT
// @match        https://gmgn.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543882/GMGN%20Solscan%20%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/543882/GMGN%20Solscan%20%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义需要排除的区域选择器
    const EXCLUDED_AREAS = [
        '.g-table-body',           // 交易活动表格
        '.g-table-wrapper',        // 表格包装器
        '[style*="overflow: auto"]' // 包含overflow: auto的元素
    ];

    // 检查元素是否在排除区域内
    function isInExcludedArea(element) {
        for (let selector of EXCLUDED_AREAS) {
            if (element.closest(selector)) {
                return true;
            }
        }
        return false;
    }

    // 等待页面加载完成后执行
    function addSolscanButtons() {
        // 查找所有钱包地址链接
        const walletLinks = document.querySelectorAll('a[href*="/sol/address/"]');

        walletLinks.forEach(link => {
            // 检查是否已经添加过按钮，避免重复添加
            if (link.dataset.solscanProcessed) return;

            // 检查是否在排除区域内
            if (isInExcludedArea(link)) {
                // 标记为已处理但不添加按钮
                link.dataset.solscanProcessed = 'true';
                return;
            }

            // 从href中提取钱包地址
            const href = link.getAttribute('href');
            const addressMatch = href.match(/\/sol\/address\/([A-Za-z0-9]+)/);

            if (addressMatch) {
                const walletAddress = addressMatch[1];

                // 创建Solscan按钮
                const solscanButton = createSolscanButton(walletAddress);

                // 寻找合适的插入位置 - 在链接的父容器后面
                const container = link.parentElement;
                if (container) {
                    // 创建一个包装div来放置按钮
                    const buttonWrapper = document.createElement('div');
                    buttonWrapper.style.cssText = `
                        display: flex;
                        align-items: center;
                        margin-left: 6px;
                    `;
                    buttonWrapper.appendChild(solscanButton);

                    // 将按钮插入到链接后面
                    container.insertAdjacentElement('afterend', buttonWrapper);
                }

                // 标记为已处理
                link.dataset.solscanProcessed = 'true';
            }
        });
    }

    // 创建Solscan按钮
    function createSolscanButton(address) {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
                <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z"/>
            </svg>
        `;

        button.title = `在Solscan中查看地址: ${address.substring(0, 8)}...`;
        button.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3px;
            background: linear-gradient(135deg, #5BACF8 0%, #4A9FE7 100%);
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            z-index: 1000;
            min-width: 16px;
            min-height: 16px;
        `;

        // 鼠标悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.background = 'linear-gradient(135deg, #4A9FE7 0%, #3B8ED6 100%)';
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = 'linear-gradient(135deg, #5BACF8 0%, #4A9FE7 100%)';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        });

        // 点击事件
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 构建Solscan URL
            const solscanUrl = `https://solscan.io/account/${address}?activity_type=ACTIVITY_SPL_TRANSFER&remove_spam=true&exclude_amount_zero=true&flow=in&value=100&value=undefined&token_address=So11111111111111111111111111111111111111111#transfers`;

            // 在新标签页中打开
            window.open(solscanUrl, '_blank', 'noopener,noreferrer');
        });

        return button;
    }

    // 处理动态加载的内容
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 检查是否有新的钱包链接被添加
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.querySelector && node.querySelector('a[href*="/sol/address/"]')) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });

            if (shouldProcess) {
                // 延迟执行以确保DOM完全更新
                setTimeout(addSolscanButtons, 100);
            }
        });

        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    // 等待页面加载完成
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    addSolscanButtons();
                    setupObserver();
                }, 500);
            });
        } else {
            setTimeout(() => {
                addSolscanButtons();
                setupObserver();
            }, 500);
        }
    }

    // 初始化脚本
    init();

    // 定期检查新的元素（备用方案）
    setInterval(addSolscanButtons, 3000);

    console.log('GMGN Solscan 跳转按钮已激活 - 已排除特定区域');
})();