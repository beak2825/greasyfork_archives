// ==UserScript==
// @name         Base64编码解码工具
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  支持base64编码和解码,并可自动填充选中内容,支持折叠和拖拽,默认最小化
// @match        *://*/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510109/Base64%E7%BC%96%E7%A0%81%E8%A7%A3%E7%A0%81%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/510109/Base64%E7%BC%96%E7%A0%81%E8%A7%A3%E7%A0%81%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式，使用更具体的选择器
    GM_addStyle(`
        #base64-tool-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999999;
            font-family: Arial, sans-serif;
        }
        #base64-tool-container * {
            box-sizing: border-box;
        }
        #base64-tool {
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px;
            width: 300px;
            transition: all 0.3s ease;
        }
        #base64-tool.minimized {
            width: 100px;
            height: 40px;
            overflow: hidden;
            padding: 5px;
        }
        #base64-tool textarea {
            width: 100%;
            height: 80px;
            padding: 8px;
            margin: 5px 0;
            border: 1px solid #ced4da;
            border-radius: 4px;
            resize: vertical;
        }
        #base64-tool button {
            width: 48%;
            padding: 8px;
            margin: 5px 1%;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
        }
        #base64-tool button:hover {
            background: #0056b3;
        }
        #base64-toggle-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 30px;
            height: 30px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        #base64-tool-content {
            margin-top: 30px;
        }
        #base64-drag-handle {
            cursor: move;
            padding: 5px;
            background: #f0f0f0;
            border-bottom: 1px solid #ddd;
            margin: -15px -15px 10px -15px;
            border-radius: 8px 8px 0 0;
        }
    `);

    // 创建容器和工具界面
    const container = document.createElement('div');
    container.id = 'base64-tool-container';
    const tool = document.createElement('div');
    tool.id = 'base64-tool';
    tool.className = 'minimized'; // 默认最小化
    tool.innerHTML = `
        <div id="base64-drag-handle">拖动此处移动工具</div>
        <button id="base64-toggle-btn">+</button>
        <div id="base64-tool-content">
            <textarea id="base64-input" placeholder="输入文本（支持手动输入和自动填充选中文本）"></textarea>
            <button id="base64-encode-btn">编码</button>
            <button id="base64-decode-btn">解码</button>
            <textarea id="base64-output" placeholder="结果" readonly></textarea>
        </div>
    `;
    container.appendChild(tool);
    document.body.appendChild(container);

    // 获取元素
    const input = document.getElementById('base64-input');
    const output = document.getElementById('base64-output');
    const encodeBtn = document.getElementById('base64-encode-btn');
    const decodeBtn = document.getElementById('base64-decode-btn');
    const toggleBtn = document.getElementById('base64-toggle-btn');
    const dragHandle = document.getElementById('base64-drag-handle');

    // 编码功能
    encodeBtn.addEventListener('click', () => {
        output.value = btoa(unescape(encodeURIComponent(input.value)));
    });

    // 解码功能
    decodeBtn.addEventListener('click', () => {
        try {
            output.value = decodeURIComponent(escape(atob(input.value)));
        } catch (e) {
            output.value = '解码失败: 输入不是有效的Base64编码';
        }
    });

    // 监听选中文本事件（自动填充功能）
    document.addEventListener('mouseup', (e) => {
        if (!tool.contains(e.target)) {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                input.value = selectedText;
            }
        }
    });

    // 切换最小化/展开状态
    toggleBtn.addEventListener('click', () => {
        tool.classList.toggle('minimized');
        toggleBtn.textContent = tool.classList.contains('minimized') ? '+' : '-';
    });

    // 拖拽功能
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = container.offsetLeft;
        startTop = container.offsetTop;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        container.style.left = startLeft + dx + 'px';
        container.style.top = startTop + dy + 'px';
        container.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
})();

