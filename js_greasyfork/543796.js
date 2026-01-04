// ==UserScript==
// @name         Bilibili 首页搜索框
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  将 Bilibili 首页替换为居中的搜索框（阻止原始网页加载）
// @author       You
// @match        https://www.bilibili.com/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543796/Bilibili%20%E9%A6%96%E9%A1%B5%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/543796/Bilibili%20%E9%A6%96%E9%A1%B5%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在文档开始加载时立即执行
    // 清空文档内容
    if (document.readyState === 'loading') {
        // 如果文档还在加载中，清空内容
        document.open();
        document.close();
    }

    // 创建基本的HTML结构
    document.documentElement.innerHTML = '';

    // 创建head
    const head = document.createElement('head');
    const title = document.createElement('title');
    title.textContent = 'Bilibili 搜索';
    head.appendChild(title);

    // 添加基本样式
    const style = document.createElement('style');
    style.textContent = `
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        }
    `;
    head.appendChild(style);
    document.documentElement.appendChild(head);

    // 创建body
    const body = document.createElement('body');
    document.documentElement.appendChild(body);

    // 创建容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.backgroundColor = '#f5f5f5';

    // 创建搜索框容器
    const searchContainer = document.createElement('div');
    searchContainer.style.display = 'flex';
    searchContainer.style.flexDirection = 'column';
    searchContainer.style.alignItems = 'center';

    // 创建 Bilibili Logo
    const logo = document.createElement('div');
    logo.innerHTML = '<svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#00A1D6"/><path d="M35 35 L35 65 L65 65 L65 35 Z" fill="white"/><circle cx="40" cy="45" r="3" fill="#00A1D6"/><circle cx="60" cy="45" r="3" fill="#00A1D6"/></svg>';
    logo.style.marginBottom = '20px';

    // 创建搜索框
    const searchBox = document.createElement('div');
    searchBox.style.display = 'flex';
    searchBox.style.width = '500px';
    searchBox.style.height = '40px';
    searchBox.style.borderRadius = '20px';
    searchBox.style.overflow = 'hidden';
    searchBox.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    searchBox.style.backgroundColor = 'white';

    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '搜索 Bilibili 视频、番剧、UP 主或内容';
    input.style.flex = '1';
    input.style.border = 'none';
    input.style.padding = '0 20px';
    input.style.fontSize = '14px';
    input.style.outline = 'none';

    // 创建搜索按钮
    const searchButton = document.createElement('button');
    searchButton.textContent = '搜索';
    searchButton.style.width = '80px';
    searchButton.style.backgroundColor = '#00A1D6';
    searchButton.style.color = 'white';
    searchButton.style.border = 'none';
    searchButton.style.cursor = 'pointer';
    searchButton.style.fontSize = '14px';

    // 添加搜索功能
    searchButton.addEventListener('click', function() {
        const query = input.value.trim();
        if (query) {
            window.location.href = `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`;
        }
    });

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = input.value.trim();
            if (query) {
                window.location.href = `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`;
            }
        }
    });

    // 组装元素
    searchBox.appendChild(input);
    searchBox.appendChild(searchButton);
    searchContainer.appendChild(logo);
    searchContainer.appendChild(searchBox);
    container.appendChild(searchContainer);
    body.appendChild(container);

    // 聚焦到输入框
    window.addEventListener('load', function() {
        input.focus();
    });
})();
