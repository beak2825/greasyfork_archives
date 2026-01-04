// ==UserScript==
// @name         VNDB 跳转2dfan以及hitomi
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在VNDB标题旁添加2DFan和Hitomi搜索按钮
// @author       swordmitri
// @match        https://vndb.org/v*
// @grant        none
// @icon         https://vndb.org/favicon.ico
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539411/VNDB%20%E8%B7%B3%E8%BD%AC2dfan%E4%BB%A5%E5%8F%8Ahitomi.user.js
// @updateURL https://update.greasyfork.org/scripts/539411/VNDB%20%E8%B7%B3%E8%BD%AC2dfan%E4%BB%A5%E5%8F%8Ahitomi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建唯一标识类名
    const CONTAINER_CLASS = 'vndb-search-tools-container';

    function createSearchButton(text, url, color) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            background: ${color};
            color: white;
            padding: 5px 10px;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            margin: 0 5px;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'none';
            button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        });

        // 点击事件
        button.addEventListener('click', () => {
            window.open(url, '_blank');
        });

        return button;
    }

    function addSearchTools() {
        // 检查是否已存在容器
        if (document.querySelector(`.${CONTAINER_CLASS}`)) return;

        // 查找主标题元素
        const titleElement = document.querySelector('h1[lang="ja"]') ||
                             document.querySelector('#vtitle h1');

        if (titleElement) {
            // 提取标题文本并清理
            let searchText = titleElement.textContent.trim();
            searchText = searchText.replace(/[【】《》\(\)]/g, ''); // 移除常见符号

            // 创建按钮容器
            const container = document.createElement('div');
            container.className = CONTAINER_CLASS;
            container.style.cssText = `
                display: flex;
                margin: 10px 0 15px 0;
                gap: 8px;
                flex-wrap: wrap;
            `;

            // 创建2DFan搜索按钮
            const dfanButton = createSearchButton(
                '🔍 2DFan',
                `https://2dfan.com/subjects/search?keyword=${encodeURIComponent(searchText)}`,
                'linear-gradient(to bottom, #4A90E2, #007BFF)'
            );

            // 创建Hitomi搜索按钮
            const hitomiButton = createSearchButton(
                '🌸 Hitomi',
                `https://hitomi.la/search.html?${encodeURIComponent(searchText)}`,
                'linear-gradient(to bottom, #e91e63, #c2185b)'
            );

            // 添加到容器
            container.appendChild(dfanButton);
            container.appendChild(hitomiButton);

            // 插入到标题后
            titleElement.parentNode.insertBefore(container, titleElement.nextSibling);
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