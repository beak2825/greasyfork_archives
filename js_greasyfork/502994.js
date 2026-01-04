// ==UserScript==
// @name         磁力链接显示
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  解析磁力网站搜索后页面上的磁力链接，显示为表格，并提供复制按钮。
// @Changes      1.1版本添加了调整大小的功能。
// @author       lyleOuO
// @license MIT
// @match        https://en.btdig.com/*
// @match        https://fzxuvyyi.clg167.buzz/*
// @match        https://javdb.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502994/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/502994/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从设置中获取容器的尺寸和背景透明度，设置默认值
    const containerWidth = GM_getValue('containerWidth', '700px');
    const containerHeight = GM_getValue('containerHeight', '200px');
    const containerBackground = GM_getValue('containerBackground', 'rgba(255, 255, 255, 1)'); // 不透明

    // 磁力链接的正则表达式
    const magnetRegex = /magnet:\?xt=urn:btih:([\w\d]{40})/gi;
    const links = document.querySelectorAll('a');
    const magnetLinks = Array.from(links)
        .map(link => link.href.match(magnetRegex))
        .flat()
        .filter(Boolean);

    // 创建并插入样式
    const style = document.createElement('style');
    style.textContent = `
        .container {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: ${containerBackground};
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
            width: ${containerWidth};
            height: ${containerHeight};
            overflow-y: auto;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            cursor: move;
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: flex;
            flex-direction: column;
        }
        .container table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #ddd;
            margin: 0;
            border-spacing: 0;
        }
        .container td {
            padding: 5px;
            border-bottom: 1px solid #ddd;
        }
        .copy-button {
            padding: 5px 8px;
            font-size: 12px;
            background-color: red;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .copy-button:hover {
            background-color: #b30000;
        }
        .resize-handle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 16px;
            height: 16px;
            background-color: #ddd;
            cursor: nwse-resize;
            z-index: 10000;
            border-top: 2px solid #ccc;
            border-left: 2px solid #ccc;
        }
    `;
    document.head.appendChild(style);

    // 创建主容器
    const container = document.createElement('div');
    container.className = 'container';

    // 创建表格
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');
    const fragment = document.createDocumentFragment();

    magnetLinks.forEach(link => {
        const row = document.createElement('tr');

        // 创建链接单元格
        const linkCell = document.createElement('td');
        const linkElement = document.createElement('a');
        linkElement.href = link;
        linkElement.textContent = link;
        linkElement.target = '_blank';
        linkElement.style.textDecoration = 'none';
        linkElement.style.color = '#1e90ff';
        linkElement.style.wordBreak = 'break-all'; // 防止链接过长而溢出
        linkCell.appendChild(linkElement);
        row.appendChild(linkCell);

        // 创建复制按钮单元格
        const copyCell = document.createElement('td');
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制';
        copyButton.className = 'copy-button';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(link)
                .then(() => {
                    copyButton.textContent = '已复制';
                    setTimeout(() => {
                        copyButton.textContent = '复制'; // 恢复原文本
                    }, 2000); // 2秒后恢复为“复制”
                })
                .catch(err => console.error('复制失败', err));
        };
        copyCell.appendChild(copyButton);
        row.appendChild(copyCell);

        fragment.appendChild(row);
    });

    tableBody.appendChild(fragment);
    table.appendChild(tableBody);
    container.appendChild(table);

    // 创建调整大小角标
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    container.appendChild(resizeHandle);

    // 调整大小功能
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(getComputedStyle(container).width, 10);
        startHeight = parseInt(getComputedStyle(container).height, 10);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', () => {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            GM_setValue('containerWidth', container.style.width);
            GM_setValue('containerHeight', container.style.height);
        });
    });

    function resize(e) {
        if (isResizing) {
            const newWidth = Math.max(200, startWidth + (e.clientX - startX));
            const newHeight = Math.max(100, startHeight + (e.clientY - startY));
            container.style.width = `${newWidth}px`;
            container.style.height = `${newHeight}px`;
        }
    }

    document.body.appendChild(container);

    // 实现拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener('mousedown', (e) => {
        if (e.target === resizeHandle) return; // 不在调整大小角标上触发拖动
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
        container.style.transition = 'none'; // 禁用过渡效果
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const containerRect = container.getBoundingClientRect();
            const maxX = window.innerWidth - containerRect.width;
            const maxY = window.innerHeight - containerRect.height;
            container.style.left = `${Math.min(Math.max(0, e.clientX - offsetX), maxX)}px`;
            container.style.top = `${Math.min(Math.max(0, e.clientY - offsetY), maxY)}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.transition = ''; // 恢复过渡效果
    });

    // 初始化容器位置和尺寸
    container.style.left = GM_getValue('containerLeft', 'auto');
    container.style.top = GM_getValue('containerTop', 'auto');
})();
