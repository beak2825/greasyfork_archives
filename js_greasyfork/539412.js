// ==UserScript==
// @name         2DFan 跳转VNDB以及hitomi
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在2DFan标题下方添加VNDB和Hitomi搜索按钮
// @author       swordmitri
// @match        https://*.2dfan.com/*
// @grant        none
// @icon         https://2dfan.com/favicon.ico
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539412/2DFan%20%E8%B7%B3%E8%BD%ACVNDB%E4%BB%A5%E5%8F%8Ahitomi.user.js
// @updateURL https://update.greasyfork.org/scripts/539412/2DFan%20%E8%B7%B3%E8%BD%ACVNDB%E4%BB%A5%E5%8F%8Ahitomi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建唯一标识类名
    const CONTAINER_CLASS = 'tdfan-search-tools-container';

    function createSearchButton(text, url, color) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            background: ${color};
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 3px 6px rgba(0,0,0,0.16);
            display: flex;
            align-items: center;
            gap: 6px;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 5px 10px rgba(0,0,0,0.2)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'none';
            button.style.boxShadow = '0 3px 6px rgba(0,0,0,0.16)';
        });

        // 添加图标
        const icon = document.createElement('span');
        icon.textContent = text.includes('VNDB') ? '📖' : '🌸';
        icon.style.fontSize = '16px';
        button.prepend(icon);

        // 点击事件
        button.addEventListener('click', () => {
            window.open(url, '_blank');
        });

        return button;
    }

    function addSearchTools() {
        // 检查是否已存在容器
        if (document.querySelector(`.${CONTAINER_CLASS}`)) return;

        // 查找目标区域 - 2DFan的标题区域
        const headerDiv = document.querySelector('div.navbar.navbar-inner.block-header.no-border');

        if (headerDiv) {
            // 查找标题元素
            const titleElement = headerDiv.querySelector('h3');

            if (titleElement) {
                // 提取标题文本并清理
                let searchText = titleElement.textContent.trim();
                searchText = searchText.replace('介绍', '').replace(/[【】《》]/g, '').trim();

                // 创建按钮容器
                const container = document.createElement('div');
                container.className = CONTAINER_CLASS;
                container.style.cssText = `
                    display: flex;
                    margin: 15px 0 5px 0;
                    gap: 12px;
                    flex-wrap: wrap;
                    padding: 10px 0;
                    border-top: 1px solid #eee;
                `;

                // 创建VNDB搜索按钮
                const vndbButton = createSearchButton(
                    'VNDB 搜索',
                    `https://vndb.org/v?q=${encodeURIComponent(searchText)}`,
                    'linear-gradient(to right, #3498db, #1a5276)'
                );

                // 创建Hitomi搜索按钮
                const hitomiButton = createSearchButton(
                    'Hitomi 搜索',
                    `https://hitomi.la/search.html?${encodeURIComponent(searchText)}`,
                    'linear-gradient(to right, #e84393, #d63031)'
                );

                // 添加到容器
                container.appendChild(vndbButton);
                container.appendChild(hitomiButton);

                // 插入到标题下方
                headerDiv.appendChild(container);
            }
        }
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(() => {
        addSearchTools();
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // 初始添加
    addSearchTools();
})();