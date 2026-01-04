// ==UserScript==
// @name         WhatsApp话术助手 - LinkedIn优化版
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  WhatsApp Message Helper with Tabbed Interface, Auto-Translation, Priority Sorting, Double-Click Copy, Export/Import, Tab Management, Resizable Panel, LinkedIn Popup Features
// @author       Grok & YourName
// @license      MIT
// @match        https://web.whatsapp.com/*
// @match        https://www.facebook.com/*
// @match        *://www.linkedin.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/531391/WhatsApp%E8%AF%9D%E6%9C%AF%E5%8A%A9%E6%89%8B%20-%20LinkedIn%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/531391/WhatsApp%E8%AF%9D%E6%9C%AF%E5%8A%A9%E6%89%8B%20-%20LinkedIn%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

// MIT License
// Copyright (c) 2028 Jameson Yang
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is furnished
// to do so, subject to the following conditions:
// ...

(function() {
    'use strict';

    // 合并样式
    const styles = `
        .floating-btn {
            position: fixed;
            width: 10.5px;
            height: 10.5px;
            background-color: #25D366;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            font-size: 6px;
        }
        .control-panel {
            position: fixed;
            width: 450px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            padding: 20px;
            z-index: 1000;
            display: none;
            max-height: 500px;
            min-width: 300px;
            min-height: 300px;
            transition: opacity 0.3s ease, height 0.3s ease;
            overflow: hidden;
            border: 5px solid transparent;
        }
        .control-panel h3 { margin: 0 0 15px 0; color: #25D366; display: inline-block; }
        .collapse-btn {
            float: right;
            background-color: #ff4444;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
        }
        .collapse-btn:hover { background-color: #cc0000; }
        .close-btn {
            float: right;
            background-color: #ff4444;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 5px;
        }
        .close-btn:hover { background-color: #cc0000; }
        .always-on-top-btn {
            background-color: #25D366;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 5px;
        }
        .always-on-top-btn:hover { background-color: #20bd57; }
        .settings-btn {
            background-color: #25D366;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 10px;
        }
        .settings-btn:hover { background-color: #20bd57; }
        .settings-container {
            margin-top: 10px;
            display: none;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .settings-container label {
            font-weight: bold;
            margin-right: 5px;
            color: #333;
        }
        .position-container, .opacity-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        .opacity-slider { width: 120px; }
        .settings-container select, .settings-container input[type="range"] {
            padding: 3px;
            border-radius: 3px;
            border: 1px solid #ccc;
        }
        .settings-container select:hover, .settings-container input[type="range"]:hover {
            border-color: #25D366;
        }
        .tab-container { display: flex; flex-wrap: nowrap; overflow-x: auto; margin-bottom: 15px; padding-bottom: 5px; width: 100%; }
        .tab-btn { padding: 5px 10px; margin-right: 5px; background-color: #f0f0f0; border: none; border-radius: 5px; cursor: pointer; white-space: nowrap; position: relative; }
        .tab-btn.active { background-color: #25D366; color: white; }
        .tab-btn:hover { background-color: #e0e0e0; }
        .tab-delete-btn { position: absolute; top: -5px; right: -5px; background-color: #ff4444; color: white; border: none; border-radius: 50%; width: 16px; height: 16px; font-size: 12px; line-height: 16px; text-align: center; cursor: pointer; display: none; }
        .tab-btn:hover .tab-delete-btn { display: block; }
        .tab-delete-btn:hover { background-color: #cc0000; }
        .message-list { overflow-y: auto; max-height: calc(100% - 150px); width: 100%; }
        .message-item { padding: 8px; margin: 5px 0; background-color: #f5f5f5; border-radius: 5px; display: flex; align-items: stretch; gap: 10px; cursor: move; }
        .message-item:hover { background-color: #e0e0e0; }
        .message-content { flex-grow: 1; }
        .original-text { font-weight: bold; margin-bottom: 4px; }
        .translated-text { font-size: 0.9em; color: #666; }
        .action-buttons { display: flex; flex-direction: column; gap: 5px; }
        .action-btn { background-color: #25D366; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; width: 60px; }
        .action-btn:hover { background-color: #20bd57; }
        .delete-btn { background-color: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; }
        .delete-btn:hover { background-color: #cc0000; }
        .search-container { margin-top: 10px; display: flex; align-items: center; width: 100%; }
        .search-input { width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 5px; font-size: 14px; }
        .edit-dialog, .add-dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.2); z-index: 2000; display: none; width: 400px; }
        .edit-dialog h3, .add-dialog h3 { margin: 0 0 15px 0; color: #25D366; }
        .edit-dialog label, .add-dialog label { display: block; margin-bottom: 5px; font-weight: bold; }
        .edit-dialog textarea, .add-dialog textarea { width: 100%; height: 80px; margin-bottom: 10px; padding: 5px; box-sizing: border-box; resize: vertical; }
        .edit-dialog select, .add-dialog select { width: 100%; padding: 5px; margin-bottom: 10px; }
        .edit-dialog button, .add-dialog button { padding: 5px 10px; margin-right: 10px; cursor: pointer; }
        .move-btn { background-color: #25D366; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; }
        .move-btn:hover { background-color: #20bd57; }
        .add-btn { float: right; background-color: #25D366; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
        .add-btn:hover { background-color: #20bd57; }
        .export-import-btns { margin-top: 10px; display: flex; gap: 10px; width: 100%; flex-wrap: wrap; }
        .export-btn, .import-btn { background-color: #25D366; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
        .export-btn:hover, .import-btn:hover { background-color: #20bd57; }
        .status-bar {
            background-color: #f0f0f0;
            padding: 5px 10px;
            font-size: 12px;
            color: #0077b5;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            text-align: left;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
        .toggle-extra-btn {
            background-color: #25D366;
            color: white;
            border: none;
            padding: 3px 8px;
            border-radius: 5px;
            cursor: pointer;
        }
        .toggle-extra-btn:hover {
            background-color: #20bd57;
        }
        .extra-buttons-container {
            display: none;
            margin-top: 10px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // 记录鼠标点击位置
    let lastMouseX = 0, lastMouseY = 0;
    document.addEventListener('click', (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    const floatBtn = document.createElement('div');
    floatBtn.className = 'floating-btn';
    floatBtn.innerHTML = '✉️';
    document.body.appendChild(floatBtn);

    const panel = document.createElement('div');
    panel.className = 'control-panel';
    document.body.appendChild(panel);

    const editDialog = document.createElement('div');
    editDialog.className = 'edit-dialog';
    editDialog.innerHTML = `
        <h3>Edit Message</h3>
        <label>Original Text:</label>
        <textarea id="editOriginal"></textarea>
        <label>Source Language:</label>
        <select id="sourceLang">
            <option value="ZH">中文</option>
            <option value="EN">英文</option>
            <option value="FR">法语</option>
            <option value="ES">西班牙语</option>
            <option value="RU">俄语</option>
            <option value="PT">葡萄牙语</option>
        </select>
        <label>Target Language:</label>
        <select id="targetLang">
            <option value="ZH">中文</option>
            <option value="EN">英文</option>
            <option value="FR">法语</option>
            <option value="ES">西班牙语</option>
            <option value="RU">俄语</option>
            <option value="PT">葡萄牙语</option>
        </select>
        <label>Translation Engine:</label>
        <select id="translateEngine">
            <option value="qwen-max">Qwen-Max</option>
            <option value="deepl">DeepL</option>
            <option value="glm4">GLM-4</option>
        </select>
        <label>Translated Text:</label>
        <textarea id="editTranslated"></textarea>
        <label>Priority (1-100):</label>
        <input type="number" id="editPriority" min="1" max="100" value="1" style="width: 100%; padding: 5px; margin-bottom: 10px;">
        <div>
            <button id="translateBtn">Translate</button>
            <button id="saveEdit">Save</button>
            <button id="moveEdit" class="move-btn">Move</button>
            <button id="deleteEdit" class="delete-btn">Delete</button>
            <button id="cancelEdit">Cancel</button>
        </div>
    `;
    document.body.appendChild(editDialog);

    const addDialog = document.createElement('div');
    addDialog.className = 'add-dialog';
    addDialog.innerHTML = `
        <h3>Add New Message</h3>
        <label>Original Text:</label>
        <textarea id="addOriginal"></textarea>
        <label>Source Language:</label>
        <select id="addSourceLang">
            <option value="ZH">中文</option>
            <option value="EN">英文</option>
            <option value="FR">法语</option>
            <option value="ES">西班牙语</option>
            <option value="RU">俄语</option>
            <option value="PT">葡萄牙语</option>
        </select>
        <label>Target Language:</label>
        <select id="addTargetLang">
            <option value="ZH">中文</option>
            <option value="EN">英文</option>
            <option value="FR">法语</option>
            <option value="ES">西班牙语</option>
            <option value="RU">俄语</option>
            <option value="PT">葡萄牙语</option>
        </select>
        <label>Translation Engine:</label>
        <select id="addTranslateEngine">
            <option value="qwen-max">Qwen-Max</option>
            <option value="deepl">DeepL</option>
            <option value="glm4">GLM-4</option>
        </select>
        <label>Translated Text:</label>
        <textarea id="addTranslated"></textarea>
        <label>Priority (1-100):</label>
        <input type="number" id="addPriority" min="1" max="100" value="1" style="width: 100%; padding: 5px; margin-bottom: 10px;">
        <div>
            <button id="addTranslateBtn">Translate</button>
            <button id="saveAdd">Save</button>
            <button id="deleteAdd" class="delete-btn">Delete</button>
            <button id="cancelAdd">Cancel</button>
        </div>
    `;
    document.body.appendChild(addDialog);

    const DEEPL_AUTH_KEY = 'd1bb179e-baa8-369d-1a0c-be1a7655b603:fx';
    const GLM4_AUTH_KEY = 'aaaa63e138f84209b732a6b7ae76b067.RwzDQet5YZmth8o6';
    const QWEN_MAX_AUTH_KEY = 'sk-ffd22562e50040b9b8e2b19fc11412cc';

    let tabs = GM_getValue('tabs', [
        { name: 'Greetings', messages: [
            { original: "Hello! How can I assist you today?", translated: "你好！我今天能如何帮助你？", priority: 1 },
            { original: "Thank you for your message!", translated: "感谢你的消息！", priority: 1 }
        ]},
        { name: 'Replies', messages: [
            { original: "I'll get back to you soon.", translated: "我很快会回复你。", priority: 1 },
            { original: "Could you please provide more details?", translated: "你能提供更多细节吗？", priority: 1 }
        ]},
        { name: 'Closings', messages: [
            { original: "Have a great day!", translated: "祝你一天愉快！", priority: 1 },
            { original: "Looking forward to your response.", translated: "期待你的回复。", priority: 1 }
        ]},
        { name: 'Custom 1', messages: [] },
        { name: 'Custom 2', messages: [] }
    ]);

    let activeTab = 0;
    let position = GM_getValue('position', 'bottom-right');
    let bgOpacity = GM_getValue('bgOpacity', 1);
    let fullOpacity = GM_getValue('fullOpacity', 1);
    let savedHeight = GM_getValue('popupHeight', '500px');
    let savedExpandedHeight = GM_getValue('popupExpandedHeight', '560px');
    let isExpanded = false;
    let statusBar;

    function updateStatus(message, isError = false) {
        if (statusBar) {
            statusBar.innerText = message;
            statusBar.style.color = isError ? '#d32f2f' : '#0077b5';
            setTimeout(() => {
                statusBar.innerText = '就绪';
                statusBar.style.color = '#0077b5';
            }, 3000);
        }
    }

    // 新增函数：切换悬浮图标的显示/隐藏状态
    function toggleFloatBtn() {
        floatBtn.style.display = floatBtn.style.display === 'none' ? 'flex' : 'none';
        if (floatBtn.style.display === 'none') {
            panel.style.display = 'none';
        }
    }

    // 添加 F9 快捷键监听
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F9') {
            e.preventDefault();
            toggleFloatBtn();
        }
    });

    // 添加油猴菜单
    GM_registerMenuCommand('浮动图标控制 -> 显示', () => {
        if (floatBtn.style.display === 'none') {
            toggleFloatBtn();
        }
    });

    GM_registerMenuCommand('浮动图标控制 -> 隐藏', () => {
        if (floatBtn.style.display !== 'none') {
            toggleFloatBtn();
        }
    });

    GM_registerMenuCommand('显示话术助手弹窗', () => {
        GM_setValue('popupActive', true);
        initPanel();
        panel.style.display = 'block';
    });

    GM_registerMenuCommand('隐藏话术助手弹窗', () => {
        GM_setValue('popupActive', false);
        panel.style.display = 'none';
    });

    function initPanel() {
        // 恢复上次保存的位置和大小
        const savedTop = GM_getValue('popupTop', '20px');
        const savedLeft = GM_getValue('popupLeft', '');
        const savedRight = GM_getValue('popupRight', '20px');
        const savedWidth = GM_getValue('popupWidth', '450px');
        savedHeight = GM_getValue('popupHeight', '500px');
        savedExpandedHeight = GM_getValue('popupExpandedHeight', '560px');

        panel.style.position = 'fixed';
        panel.style.top = savedTop;
        panel.style.left = savedLeft;
        panel.style.right = savedRight;
        panel.style.width = savedWidth;
        panel.style.height = savedHeight;
        panel.style.zIndex = GM_getValue('popupAlwaysOnTop', false) ? '2147483647' : '9999';

        panel.innerHTML = `
            <h3>Message Helper</h3>
            <button class="close-btn">×</button>
            <button class="collapse-btn">−</button>
            <button class="always-on-top-btn">置顶</button>
            <button class="add-btn">+</button>
            <div class="tab-container"></div>
            <div class="message-list"></div>
            <div class="search-container">
                <input type="text" class="search-input" id="searchInput" placeholder="Search messages...">
            </div>
            <div class="extra-buttons-container" id="extraButtonsContainer">
                <div class="export-import-btns">
                    <button class="export-btn" id="exportBtn">Export</button>
                    <button class="import-btn" id="importBtn">Import</button>
                    <button class="settings-btn" id="settingsBtn">Settings</button>
                </div>
                <div class="settings-container" id="settingsContainer">
                    <div class="position-container">
                        <label title="Adjust the position of the floating button and panel">Position:</label>
                        <select id="positionSelect">
                            <option value="top-left">Left Top</option>
                            <option value="middle-left">Left Middle</option>
                            <option value="bottom-left">Left Bottom</option>
                            <option value="top-right">Right Top</option>
                            <option value="middle-right">Right Middle</option>
                            <option value="bottom-right">Right Bottom</option>
                        </select>
                    </div>
                    <div class="opacity-container">
                        <label title="Adjust background transparency (buttons and backgrounds)">Background:</label>
                        <input type="range" min="0" max="1" step="0.1" value="${bgOpacity}" class="opacity-slider" id="bgOpacitySlider">
                    </div>
                    <div class="opacity-container">
                        <label title="Adjust overall transparency (excluding messages and sliders)">Overall:</label>
                        <input type="range" min="0" max="1" step="0.1" value="${fullOpacity}" class="opacity-slider" id="fullOpacitySlider">
                    </div>
                </div>
            </div>
            <div class="status-bar" id="statusBar"><span>就绪</span><button class="toggle-extra-btn" id="toggleExtraBtn">展开</button></div>
        `;

        statusBar = panel.querySelector('#statusBar span');
        panel.querySelector('#positionSelect').value = position;
        updatePosition();
        updateOpacity();
        renderTabs();
        renderMessages();
        setupDragAndDrop();
        setupExportImport();
        setupSearch();
        setupResize();
        setupDragPanel();
        setupLongPressEdit();
        setupExtraButtonsToggle();

        panel.querySelector('.collapse-btn').addEventListener('click', () => {
            if (content.style.display === 'none') {
                content.style.display = 'flex';
                panel.style.height = isExpanded ? savedExpandedHeight : savedHeight;
            } else {
                content.style.display = 'none';
                panel.style.height = 'auto';
            }
        });

        panel.querySelector('.close-btn').addEventListener('click', () => {
            panel.style.display = 'none';
            GM_setValue('popupActive', false);
        });

        panel.querySelector('.always-on-top-btn').addEventListener('click', () => {
            const isOnTop = GM_getValue('popupAlwaysOnTop', false);
            GM_setValue('popupAlwaysOnTop', !isOnTop);
            panel.style.zIndex = !isOnTop ? '2147483647' : '9999';
            panel.querySelector('.always-on-top-btn').style.backgroundColor = !isOnTop ? '#ffffff33' : '#25D366';
        });
        if (GM_getValue('popupAlwaysOnTop', false)) {
            panel.querySelector('.always-on-top-btn').style.backgroundColor = '#ffffff33';
        }

        const settingsBtn = panel.querySelector('#settingsBtn');
        const settingsContainer = panel.querySelector('#settingsContainer');
        settingsBtn.addEventListener('click', () => {
            settingsContainer.style.display = settingsContainer.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !floatBtn.contains(e.target)) {
                settingsContainer.style.display = 'none';
            }
        });

        panel.querySelector('#positionSelect').addEventListener('change', (e) => {
            position = e.target.value;
            GM_setValue('position', position);
            updatePosition();
        });

        const bgSlider = panel.querySelector('#bgOpacitySlider');
        const fullSlider = panel.querySelector('#fullOpacitySlider');

        bgSlider.addEventListener('input', (e) => {
            bgOpacity = parseFloat(e.target.value);
            GM_setValue('bgOpacity', bgOpacity);
            updateOpacity();
        });

        fullSlider.addEventListener('input', (e) => {
            fullOpacity = parseFloat(e.target.value);
            GM_setValue('fullOpacity', fullOpacity);
            updateOpacity();
        });
    }

    let content;
    function updatePosition() {
        const offset = 20;
        const panelOffset = 90;

        switch(position) {
            case 'top-left':
                floatBtn.style.top = `${offset}px`;
                floatBtn.style.left = `${offset}px`;
                floatBtn.style.bottom = '';
                floatBtn.style.right = '';
                panel.style.top = `${panelOffset}px`;
                panel.style.left = `${offset}px`;
                panel.style.bottom = '';
                panel.style.right = '';
                break;
            case 'middle-left':
                floatBtn.style.top = '50%';
                floatBtn.style.left = `${offset}px`;
                floatBtn.style.transform = 'translateY(-50%)';
                floatBtn.style.bottom = '';
                floatBtn.style.right = '';
                panel.style.top = '50%';
                panel.style.left = `${panelOffset}px`;
                panel.style.transform = 'translateY(-50%)';
                panel.style.bottom = '';
                panel.style.right = '';
                break;
            case 'bottom-left':
                floatBtn.style.bottom = `${offset}px`;
                floatBtn.style.left = `${offset}px`;
                floatBtn.style.top = '';
                floatBtn.style.right = '';
                panel.style.bottom = `${panelOffset}px`;
                panel.style.left = `${offset}px`;
                panel.style.top = '';
                panel.style.right = '';
                break;
            case 'top-right':
                floatBtn.style.top = `${offset}px`;
                floatBtn.style.right = `${offset}px`;
                floatBtn.style.bottom = '';
                floatBtn.style.left = '';
                panel.style.top = `${panelOffset}px`;
                panel.style.right = `${offset}px`;
                panel.style.bottom = '';
                panel.style.left = '';
                break;
            case 'middle-right':
                floatBtn.style.top = '50%';
                floatBtn.style.right = `${offset}px`;
                floatBtn.style.transform = 'translateY(-50%)';
                floatBtn.style.bottom = '';
                floatBtn.style.left = '';
                panel.style.top = '50%';
                panel.style.right = `${panelOffset}px`;
                panel.style.transform = 'translateY(-50%)';
                panel.style.bottom = '';
                panel.style.left = '';
                break;
            case 'bottom-right':
                floatBtn.style.bottom = `${offset}px`;
                floatBtn.style.right = `${offset}px`;
                floatBtn.style.top = '';
                floatBtn.style.left = '';
                panel.style.bottom = `${panelOffset}px`;
                panel.style.right = `${offset}px`;
                panel.style.top = '';
                panel.style.left = '';
                break;
        }
        // 保存位置
        GM_setValue('popupTop', panel.style.top);
        GM_setValue('popupLeft', panel.style.left);
        GM_setValue('popupRight', panel.style.right);
    }

    function updateOpacity() {
        const bgOpacityValue = bgOpacity;
        const fullOpacityValue = fullOpacity;

        panel.style.backgroundColor = `rgba(255, 255, 255, ${bgOpacityValue})`;
        panel.querySelectorAll('.message-item').forEach(item => {
            item.style.backgroundColor = `rgba(245, 245, 245, ${bgOpacityValue})`;
            item.style.setProperty('background-color', `rgba(245, 245, 245, ${bgOpacityValue})`, 'important');
            item.addEventListener('mouseover', () => {
                item.style.backgroundColor = `rgba(224, 224, 224, ${bgOpacityValue})`;
            });
            item.addEventListener('mouseout', () => {
                item.style.backgroundColor = `rgba(245, 245, 245, ${bgOpacityValue})`;
            });
        });
        panel.querySelectorAll('.tab-btn:not(.active), .action-btn, .delete-btn, .add-btn, .export-btn, .import-btn, .collapse-btn, .settings-btn, .move-btn, .close-btn, .toggle-extra-btn').forEach(btn => {
            btn.style.opacity = bgOpacityValue;
        });
        panel.querySelectorAll('.tab-btn.active').forEach(btn => {
            btn.style.backgroundColor = `rgba(37, 211, 102, ${bgOpacityValue})`;
        });

        panel.style.opacity = fullOpacityValue;
        panel.querySelectorAll('.opacity-slider').forEach(slider => {
            slider.style.opacity = 1;
        });
        panel.querySelectorAll('.message-content').forEach(content => {
            content.style.opacity = 1;
        });
    }

    function setupDragPanel() {
        let isDragging = false, startX, startY;
        const titleBar = panel.querySelector('h3').parentElement;
        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - panel.offsetLeft;
            startY = e.clientY - panel.offsetTop;
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = `${e.clientX - startX}px`;
                panel.style.right = 'auto';
                panel.style.top = `${e.clientY - startY}px`;
                GM_setValue('popupTop', panel.style.top);
                GM_setValue('popupLeft', panel.style.left);
                GM_setValue('popupRight', panel.style.right);
            }
        });
        document.addEventListener('mouseup', () => isDragging = false);
    }

    function setupResize() {
        const resizeHandles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
        resizeHandles.forEach(dir => {
            const handle = document.createElement('div');
            handle.style.position = 'absolute';
            handle.style.width = '10px';
            handle.style.height = '10px';
            handle.style.background = 'transparent';
            handle.style.zIndex = '10000';
            handle.style.cursor = dir.includes('n') && dir.includes('w') ? 'nw-resize' :
                                  dir.includes('n') && dir.includes('e') ? 'ne-resize' :
                                  dir.includes('s') && dir.includes('w') ? 'sw-resize' :
                                  dir.includes('s') && dir.includes('e') ? 'se-resize' :
                                  dir.includes('n') ? 'n-resize' :
                                  dir.includes('s') ? 's-resize' :
                                  dir.includes('e') ? 'e-resize' : 'w-resize';
            if (dir.includes('n')) handle.style.top = '-5px';
            if (dir.includes('s')) handle.style.bottom = '-5px';
            if (dir.includes('e')) handle.style.right = '-5px';
            if (dir.includes('w')) handle.style.left = '-5px';
            panel.appendChild(handle);

            let resizing = false, startWidth, startHeight, startLeft, startTop, startMouseX, startMouseY;
            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                resizing = true;
                startWidth = panel.offsetWidth;
                startHeight = panel.offsetHeight;
                startLeft = panel.offsetLeft;
                startTop = panel.offsetTop;
                startMouseX = e.clientX;
                startMouseY = e.clientY;
            });
            document.addEventListener('mousemove', (e) => {
                if (resizing) {
                    let newWidth = startWidth, newHeight = startHeight, newLeft = startLeft, newTop = startTop;
                    if (dir.includes('e')) newWidth = startWidth + (e.clientX - startMouseX);
                    if (dir.includes('w')) {
                        newWidth = startWidth - (e.clientX - startMouseX);
                        newLeft = startLeft + (e.clientX - startMouseX);
                    }
                    if (dir.includes('s')) newHeight = startHeight + (e.clientY - startMouseY);
                    if (dir.includes('n')) {
                        newHeight = startHeight - (e.clientY - startMouseY);
                        newTop = startTop + (e.clientY - startMouseY);
                    }
                    panel.style.width = `${Math.max(200, newWidth)}px`;
                    panel.style.height = `${Math.max(150, newHeight)}px`;
                    savedHeight = isExpanded ? panel.style.height : savedHeight;
                    savedExpandedHeight = isExpanded ? panel.style.height : savedExpandedHeight;
                    if (dir.includes('w') || dir.includes('n')) {
                        panel.style.left = `${newLeft}px`;
                        panel.style.top = `${newTop}px`;
                        panel.style.right = 'auto';
                    }
                    GM_setValue('popupWidth', panel.style.width);
                    GM_setValue('popupHeight', savedHeight);
                    GM_setValue('popupExpandedHeight', savedExpandedHeight);
                    GM_setValue('popupTop', panel.style.top);
                    GM_setValue('popupLeft', panel.style.left);
                    GM_setValue('popupRight', panel.style.right);
                }
            });
            document.addEventListener('mouseup', () => resizing = false);
        });
    }

    function setupExtraButtonsToggle() {
        const toggleBtn = panel.querySelector('#toggleExtraBtn');
        const extraContainer = panel.querySelector('#extraButtonsContainer');
        toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            extraContainer.style.display = isExpanded ? 'block' : 'none';
            toggleBtn.textContent = isExpanded ? '收起' : '展开';
            panel.style.height = isExpanded ? savedExpandedHeight : savedHeight;
            GM_setValue('popupHeight', savedHeight);
            GM_setValue('popupExpandedHeight', savedExpandedHeight);
        });
    }

    function renderTabs() {
        const tabContainer = panel.querySelector('.tab-container');
        tabContainer.innerHTML = '';

        tabs.sort((a, b) => (b.priority || 1) - (a.priority || 1));

        tabs.forEach((tab, index) => {
            const tabBtn = document.createElement('button');
            tabBtn.className = `tab-btn ${index === activeTab ? 'active' : ''}`;
            tabBtn.textContent = `${tab.name} ${tab.priority ? `(${tab.priority})` : ''}`;
            tabBtn.addEventListener('click', () => {
                activeTab = index;
                renderTabs();
                renderMessages();
                setupDragAndDrop();
                updateOpacity();
            });

            tabBtn.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const editTabDialog = document.createElement('div');
                editTabDialog.className = 'edit-dialog';
                editTabDialog.innerHTML = `
                    <h3>Edit Tab</h3>
                    <label>Tab Name:</label>
                    <input type="text" id="editTabName" value="${tab.name}" style="width: 100%; padding: 5px; margin-bottom: 10px;">
                    <label>Priority (1-99):</label>
                    <input type="number" id="editTabPriority" min="1" max="99" value="${tab.priority || 1}" style="width: 100%; padding: 5px; margin-bottom: 10px;">
                    <div>
                        <button id="saveTabEdit">Save</button>
                        <button id="cancelTabEdit">Cancel</button>
                    </div>
                `;
                document.body.appendChild(editTabDialog);
                editTabDialog.style.display = 'block';

                document.getElementById('saveTabEdit').onclick = () => {
                    const newName = document.getElementById('editTabName').value.trim();
                    const newPriority = parseInt(document.getElementById('editTabPriority').value) || 1;
                    if (newName) {
                        tabs[index].name = newName;
                        tabs[index].priority = Math.max(1, Math.min(99, newPriority));
                        GM_setValue('tabs', tabs);
                        renderTabs();
                        renderMessages();
                        setupDragAndDrop();
                        updateOpacity();
                    }
                    document.body.removeChild(editTabDialog);
                };

                document.getElementById('cancelTabEdit').onclick = () => {
                    document.body.removeChild(editTabDialog);
                };
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'tab-delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete tab "${tab.name}"?`)) {
                    tabs.splice(index, 1);
                    if (activeTab >= tabs.length) activeTab = tabs.length - 1;
                    GM_setValue('tabs', tabs);
                    renderTabs();
                    renderMessages();
                    setupDragAndDrop();
                    updateOpacity();
                }
            });
            tabBtn.appendChild(deleteBtn);

            tabContainer.appendChild(tabBtn);
        });

        const addTabBtn = document.createElement('button');
        addTabBtn.className = 'tab-btn';
        addTabBtn.textContent = '+ New Tab';
        addTabBtn.addEventListener('click', () => {
            const newTabName = prompt('Enter new tab name:', 'New Tab');
            if (newTabName) {
                const newTab = { name: newTabName, messages: [] };
                tabs.push(newTab);
                activeTab = tabs.length - 1;
                GM_setValue('tabs', tabs);
                renderTabs();
                renderMessages();
                setupDragAndDrop();
                updateOpacity();
            }
        });
        tabContainer.appendChild(addTabBtn);
    }

    function renderMessages(searchTerm = '') {
        const messageList = panel.querySelector('.message-list');
        messageList.innerHTML = '';

        let messagesToRender = tabs[activeTab].messages;
        if (searchTerm) {
            messagesToRender = [];
            tabs.forEach(tab => {
                tab.messages.forEach((msg, index) => {
                    if (msg.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        msg.translated.toLowerCase().includes(searchTerm.toLowerCase())) {
                        messagesToRender.push({ ...msg, tabIndex: tabs.indexOf(tab), msgIndex: index });
                    }
                });
            });
        }

        messagesToRender.sort((a, b) => (b.priority || 1) - (a.priority || 1));
        messagesToRender.forEach((msg, index) => {
            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            messageItem.draggable = !searchTerm;
            messageItem.dataset.index = searchTerm ? msg.msgIndex : index;
            messageItem.dataset.tabIndex = searchTerm ? msg.tabIndex : activeTab;
            messageItem.innerHTML = `
                <div class="message-content">
                    <div class="original-text">${index + 1}. ${msg.original}</div>
                    <div class="translated-text">${msg.translated}</div>
                </div>
                <div class="action-buttons">
                    <button class="action-btn send-btn">Send</button>
                </div>
            `;
            messageList.appendChild(messageItem);
        });
        updateOpacity();
    }

    function setupDragAndDrop() {
        const messageList = panel.querySelector('.message-list');
        let draggedItem = null;

        messageList.addEventListener('dragstart', (e) => {
            draggedItem = e.target.closest('.message-item');
            if (draggedItem) draggedItem.style.opacity = '0.5';
        });

        messageList.addEventListener('dragend', (e) => {
            if (draggedItem) draggedItem.style.opacity = '1';
            draggedItem = null;
        });

        messageList.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        messageList.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetItem = e.target.closest('.message-item');
            if (!targetItem || draggedItem === targetItem || !draggedItem) return;

            const fromIndex = parseInt(draggedItem.dataset.index);
            const toIndex = parseInt(targetItem.dataset.index);
            const messages = tabs[activeTab].messages;

            const [movedItem] = messages.splice(fromIndex, 1);
            messages.splice(toIndex, 0, movedItem);
            GM_setValue('tabs', tabs);
            renderMessages();
            setupDragAndDrop();
            updateOpacity();
        });
    }

    function setupLongPressEdit() {
        let timer;
        const messageList = panel.querySelector('.message-list');
        messageList.addEventListener('mousedown', (e) => {
            const messageItem = e.target.closest('.message-item');
            if (!messageItem) return;
            timer = setTimeout(() => {
                const searchTerm = document.getElementById('searchInput').value;
                const tabIndex = searchTerm ? parseInt(messageItem.dataset.tabIndex) : activeTab;
                const msgIndex = parseInt(messageItem.dataset.index);
                showEditDialog(tabIndex, msgIndex);
            }, 2000);
        });
        messageList.addEventListener('mouseup', () => clearTimeout(timer));
        messageList.addEventListener('mouseleave', () => clearTimeout(timer));
    }

    function translateWithDeepL(text, targetLang, callback) {
        const data = `text=${encodeURIComponent(text)}&target_lang=${targetLang}`;
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api-free.deepl.com/v2/translate',
            headers: {
                'Authorization': `DeepL-Auth-Key ${DEEPL_AUTH_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    callback(data.translations[0].text);
                } catch (e) {
                    callback('Translation failed');
                }
            },
            onerror: () => callback('Translation failed')
        });
    }

    function translateWithGLM4(text, targetLang, callback) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            headers: {
                'Authorization': `Bearer ${GLM4_AUTH_KEY}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: 'glm-4-flash',
                messages: [{ role: 'user', content: `Translate to ${targetLang}: ${text}` }],
                temperature: 0.7
            }),
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    callback(data.choices[0].message.content.trim());
                } catch (e) {
                    callback('Translation failed');
                }
            },
            onerror: () => callback('Translation failed')
        });
    }

    function translateWithQwenMax(text, targetLang, callback) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
            headers: {
                'Authorization': `Bearer ${QWEN_MAX_AUTH_KEY}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: 'qwen-max',
                input: { prompt: `Translate to ${targetLang}: ${text}` },
                parameters: { temperature: 0.7 }
            }),
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    callback(data.output.text.trim());
                } catch (e) {
                    callback('Translation failed');
                }
            },
            onerror: () => callback('Translation failed')
        });
    }

    function translateText(text, engine, targetLang, callback) {
        if (engine === 'deepl') translateWithDeepL(text, targetLang, callback);
        else if (engine === 'glm4') translateWithGLM4(text, targetLang, callback);
        else if (engine === 'qwen-max') translateWithQwenMax(text, targetLang, callback);
    }

    function showEditDialog(tabIndex, msgIndex) {
        const originalTextarea = document.getElementById('editOriginal');
        const sourceLangSelect = document.getElementById('sourceLang');
        const targetLangSelect = document.getElementById('targetLang');
        const translateEngine = document.getElementById('translateEngine');
        const translatedTextarea = document.getElementById('editTranslated');
        const priorityInput = document.getElementById('editPriority');
        originalTextarea.value = tabs[tabIndex].messages[msgIndex].original;
        translatedTextarea.value = tabs[tabIndex].messages[msgIndex].translated;
        priorityInput.value = tabs[tabIndex].messages[msgIndex].priority || 1;
        sourceLangSelect.value = 'ZH';
        targetLangSelect.value = 'EN';
        translateEngine.value = 'qwen-max';
        editDialog.style.display = 'block';

        document.getElementById('translateBtn').onclick = () => {
            translateText(originalTextarea.value, translateEngine.value, targetLangSelect.value, (translated) => {
                translatedTextarea.value = translated;
            });
        };

        document.getElementById('saveEdit').onclick = () => {
            tabs[tabIndex].messages[msgIndex].original = originalTextarea.value.trim();
            tabs[tabIndex].messages[msgIndex].translated = translatedTextarea.value.trim();
            tabs[tabIndex].messages[msgIndex].priority = Math.max(1, Math.min(100, parseInt(priorityInput.value) || 1));
            GM_setValue('tabs', tabs);
            renderMessages(document.getElementById('searchInput').value);
            setupDragAndDrop();
            updateOpacity();
            editDialog.style.display = 'none';
        };

        document.getElementById('moveEdit').onclick = () => {
            const targetTabIndex = promptMoveTargetTab(tabIndex);
            if (targetTabIndex !== null && targetTabIndex !== tabIndex) {
                const message = tabs[tabIndex].messages[msgIndex];
                tabs[tabIndex].messages.splice(msgIndex, 1);
                tabs[targetTabIndex].messages.push({
                    original: originalTextarea.value.trim(),
                    translated: translatedTextarea.value.trim(),
                    priority: Math.max(1, Math.min(100, parseInt(priorityInput.value) || 1))
                });
                tabs[targetTabIndex].messages.sort((a, b) => (b.priority || 1) - (a.priority || 1));
                GM_setValue('tabs', tabs);
                renderMessages(document.getElementById('searchInput').value);
                setupDragAndDrop();
                updateOpacity();
                editDialog.style.display = 'none';
            }
        };

        document.getElementById('deleteEdit').onclick = () => {
            if (confirm('Are you sure you want to delete this message?')) {
                tabs[tabIndex].messages.splice(msgIndex, 1);
                GM_setValue('tabs', tabs);
                renderMessages(document.getElementById('searchInput').value);
                setupDragAndDrop();
                updateOpacity();
                editDialog.style.display = 'none';
            }
        };

        document.getElementById('cancelEdit').onclick = () => {
            editDialog.style.display = 'none';
        };
    }

    function promptMoveTargetTab(currentTabIndex) {
        const tabOptions = tabs.map((tab, index) =>
            index !== currentTabIndex ? `${index + 1}. ${tab.name}` : null
        ).filter(option => option !== null).join('\n');
        const input = prompt(`Select the tab to move the message to (enter the number):\n${tabOptions}`);
        if (input === null) return null;
        const targetIndex = parseInt(input) - 1;
        if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= tabs.length || targetIndex === currentTabIndex) {
            alert('Invalid tab selection!');
            return null;
        }
        return targetIndex;
    }

    function showAddDialog() {
        const originalTextarea = document.getElementById('addOriginal');
        const sourceLangSelect = document.getElementById('addSourceLang');
        const targetLangSelect = document.getElementById('addTargetLang');
        const translateEngine = document.getElementById('addTranslateEngine');
        const translatedTextarea = document.getElementById('addTranslated');
        const priorityInput = document.getElementById('addPriority');
        originalTextarea.value = '';
        translatedTextarea.value = '';
        priorityInput.value = 1;
        sourceLangSelect.value = 'ZH';
        targetLangSelect.value = 'EN';
        translateEngine.value = 'qwen-max';
        addDialog.style.display = 'block';

        document.getElementById('addTranslateBtn').onclick = () => {
            translateText(originalTextarea.value, translateEngine.value, targetLangSelect.value, (translated) => {
                translatedTextarea.value = translated;
            });
        };

        document.getElementById('saveAdd').onclick = () => {
            tabs[activeTab].messages.push({
                original: originalTextarea.value.trim(),
                translated: translatedTextarea.value.trim(),
                priority: Math.max(1, Math.min(100, parseInt(priorityInput.value) || 1))
            });
            GM_setValue('tabs', tabs);
            renderMessages(document.getElementById('searchInput').value);
            setupDragAndDrop();
            updateOpacity();
            addDialog.style.display = 'none';
        };

        document.getElementById('deleteAdd').onclick = () => {
            if (confirm('Are you sure you want to delete this new message draft?')) {
                originalTextarea.value = '';
                translatedTextarea.value = '';
                priorityInput.value = 1;
            }
        };

        document.getElementById('cancelAdd').onclick = () => {
            addDialog.style.display = 'none';
        };
    }

    function setupExportImport() {
        document.getElementById('exportBtn').addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tabs));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "whatsapp_messages.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedTabs = JSON.parse(e.target.result);
                        tabs = importedTabs;
                        GM_setValue('tabs', tabs);
                        renderTabs();
                        renderMessages(document.getElementById('searchInput').value);
                        setupDragAndDrop();
                        updateOpacity();
                    } catch (error) {
                        alert('Import failed! Invalid JSON file.');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }

    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => {
            renderMessages(searchInput.value);
            setupDragAndDrop();
            updateOpacity();
        });
    }

    floatBtn.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        if (panel.style.display === 'block' && !panel.innerHTML) {
            initPanel();
        }
        GM_setValue('popupActive', panel.style.display === 'block');
    });

    panel.addEventListener('click', (e) => {
        const messageItem = e.target.closest('.message-item');
        const searchTerm = document.getElementById('searchInput').value;

        if (e.target.classList.contains('add-btn')) {
            showAddDialog();
            return;
        }

        if (!messageItem) return;

        const tabIndex = searchTerm ? parseInt(messageItem.dataset.tabIndex) : activeTab;
        const msgIndex = parseInt(messageItem.dataset.index);

        if (e.target.classList.contains('send-btn')) {
            const textToSend = tabs[tabIndex].messages[msgIndex].original;
            // 查找所有可能的输入框
            const inputs = Array.from(document.querySelectorAll('.msg-form__contenteditable, [contenteditable="true"], textarea, input[type="text"]'));
            if (inputs.length === 0) {
                updateStatus('未找到输入框，请点击输入框后重试', true);
                return;
            }

            // 尝试找到距离上次鼠标点击位置最近的输入框
            let closestInput = null;
            let minDistance = Infinity;
            inputs.forEach(input => {
                const rect = input.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const distance = Math.sqrt(Math.pow(centerX - lastMouseX, 2) + Math.pow(centerY - lastMouseY, 2));
                if (distance < minDistance) {
                    minDistance = distance;
                    closestInput = input;
                }
            });

            if (closestInput) {
                closestInput.focus();
                // 插入文本到输入框
                if (document.execCommand) {
                    document.execCommand('insertText', false, textToSend);
                } else {
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(closestInput);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    closestInput.textContent += textToSend;
                }
                updateStatus(`已发送: ${textToSend}`);
            } else {
                updateStatus('未找到靠近点击位置的输入框', true);
            }
        }
    });

    panel.addEventListener('dblclick', (e) => {
        const messageItem = e.target.closest('.message-item');
        if (!messageItem || e.target.classList.contains('action-btn')) return;

        const searchTerm = document.getElementById('searchInput').value;
        const tabIndex = searchTerm ? parseInt(messageItem.dataset.tabIndex) : activeTab;
        const msgIndex = parseInt(messageItem.dataset.index);
        const originalText = tabs[tabIndex].messages[msgIndex].original;

        navigator.clipboard.writeText(originalText).then(() => {
            updateStatus(`已复制: ${originalText}`);
        }).catch(() => {
            updateStatus('复制失败，请重试', true);
        });
    });

    // 初始化：默认不创建弹窗，保持隐藏状态
    if (GM_getValue('popupActive', false)) {
        initPanel();
        panel.style.display = 'block';
    }

    // MutationObserver 确保弹窗不被移除（但尊重用户关闭操作）
    const observer = new MutationObserver(() => {
        if (GM_getValue('popupActive', false) && !document.querySelector('.control-panel')) {
            initPanel();
            panel.style.display = 'block';
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    updatePosition();
})();
