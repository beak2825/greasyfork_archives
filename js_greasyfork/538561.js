// ==UserScript==
// @name         小黑盒一键跳转Steam
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  无需刷新！自动在小黑盒游戏页面添加Steam商店按钮
// @author       Faker
// @match        https://www.xiaoheihe.cn/app/topic/game/pc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoheihe.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538561/%E5%B0%8F%E9%BB%91%E7%9B%92%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%ACSteam.user.js
// @updateURL https://update.greasyfork.org/scripts/538561/%E5%B0%8F%E9%BB%91%E7%9B%92%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%ACSteam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BTN_ID = 'heybox2steam-btn'; // 按钮唯一标识

    // 创建Steam按钮
    function createSteamButton() {
        const steamBtn = document.createElement('a');
        steamBtn.id = BTN_ID;
        steamBtn.className = 'game-btn';
        steamBtn.textContent = 'Steam商店';

        // 按钮样式 - 使用小黑盒原生风格
        steamBtn.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 34px;
            padding: 0 15px;
            margin-left: 10px;
            background: linear-gradient(90deg, #00adee 0%, #0078d7 100%);
            color: white!important;
            border-radius: 4px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none!important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
        `;

        // 悬停效果
        steamBtn.addEventListener('mouseenter', () => {
            steamBtn.style.transform = 'translateY(-2px)';
            steamBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
        });

        steamBtn.addEventListener('mouseleave', () => {
            steamBtn.style.transform = 'none';
            steamBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });

        // 点击事件
        steamBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const gameId = window.location.pathname.split('/').pop();
            window.open(`https://store.steampowered.com/app/${gameId}/`, '_blank');
        });

        return steamBtn;
    }

    // 主函数 - 检测并添加按钮
    function addSteamButton() {
        // 如果按钮已存在，则跳过
        if (document.getElementById(BTN_ID)) return;

        // 查找目标位置
        const priceRow = document.querySelector('.price-row');
        if (!priceRow) return;

        // 创建并添加按钮
        const steamBtn = createSteamButton();
        priceRow.appendChild(steamBtn);
    }

    // 使用MutationObserver监控DOM变化
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            // 检查新增节点中是否包含.price-row
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 &&
                       (node.classList.contains('price-row') ||
                        node.querySelector('.price-row'))) {
                        addSteamButton();
                    }
                }
            }
        }
    });

    // 启动监控
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始检查
    addSteamButton();

    // 页面完全加载后再次检查
    window.addEventListener('load', addSteamButton);

    // 添加周期性检查（兜底机制）
    setInterval(addSteamButton, 2000);

    // 添加CSS样式确保按钮位置正确
    const style = document.createElement('style');
    style.textContent = `
        .price-row {
            display: flex!important;
            align-items: center!important;
            flex-wrap: wrap!important;
            gap: 10px!important;
        }
        #${BTN_ID} {
            order: 2; /* 确保按钮在合适的位置 */
        }
    `;
    document.head.appendChild(style);
})();