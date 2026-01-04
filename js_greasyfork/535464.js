// ==UserScript==
// @name         网页区域文本提取为CSV
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  通过CSS选择器获取网页指定区域的文本内容，并输出为CSV文件。
// @description:en  Extracts text content from a specified webpage area using a CSS selector and outputs it as a CSV file.
// @author       tonyan
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535464/%E7%BD%91%E9%A1%B5%E5%8C%BA%E5%9F%9F%E6%96%87%E6%9C%AC%E6%8F%90%E5%8F%96%E4%B8%BACSV.user.js
// @updateURL https://update.greasyfork.org/scripts/535464/%E7%BD%91%E9%A1%B5%E5%8C%BA%E5%9F%9F%E6%96%87%E6%9C%AC%E6%8F%90%E5%8F%96%E4%B8%BACSV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const BUTTON_TEXT = '提取文本为CSV';
    const INPUT_PLACEHOLDER = '输入css选择器（例如：.next-table-row）';
    const FILENAME_PREFIX = 'extracted_data_';
    const DEFAULT_HEADER = '提取的文本';
    const TRIGGER_BUTTON_TEXT = '提取区域文本';
    const DEFAULT_SELECTOR_ON_TAB = '.next-table-row';
    const MAX_HISTORY_SIZE = 20;
    const HISTORY_STORAGE_KEY = 'tepSelectorHistory';

    // --- 历史记录状态变量 (提升作用域) ---
    let selectorHistory = [];
    let currentHistoryIndex = -1;
    let originalInputValueBeforeNav = '';

    // --- 工具函数 ---
    function escapeCsvCell(cell) {
        if (cell == null) { // 处理 null 或 undefined
            return '';
        }
        cell = String(cell).trim(); // 确保是字符串并去除首尾空格
        // 如果单元格包含逗号、换行符或双引号，则用双引号包围
        // 并且单元格内的双引号需要替换为两个双引号
        if (cell.search(/[,_"\n]/g) >= 0) {
            cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
    }

    function loadSelectorHistory() {
        const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (storedHistory) {
            try {
                selectorHistory = JSON.parse(storedHistory);
                if (!Array.isArray(selectorHistory)) { // 基本的验证
                    selectorHistory = [];
                }
            } catch (e) {
                console.error("Error parsing selector history:", e);
                selectorHistory = [];
            }
        } else {
            selectorHistory = [];
        }
    }

    function saveSelectorToHistory(selector) {
        selector = selector.trim();
        if (!selector) return;

        loadSelectorHistory(); //确保操作的是最新的内存中历史记录

        const existingIndex = selectorHistory.indexOf(selector);
        if (existingIndex > -1) {
            selectorHistory.splice(existingIndex, 1);
        }
        selectorHistory.unshift(selector);
        if (selectorHistory.length > MAX_HISTORY_SIZE) {
            selectorHistory.length = MAX_HISTORY_SIZE;
        }
        try {
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(selectorHistory));
        } catch (e) {
            console.error("Error saving selector history:", e);
        }
    }

    function downloadCsv(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            alert("您的浏览器不支持自动下载。请尝试手动复制内容。");
            GM_setClipboard(csvContent, 'text');
            alert("CSV内容已复制到剪贴板。");
        }
    }

    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'text-extractor-panel';
        panel.classList.add('tep-hidden'); //确保主面板初始隐藏
        panel.innerHTML = `
            <div class="tep-header">区域文本提取<span id="tep-close-button" class="tep-close-btn">&times;</span></div>
            <input type="text" id="tep-selector-input" placeholder="${INPUT_PLACEHOLDER}">
            <button id="tep-extract-button">${BUTTON_TEXT}</button>
            <div id="tep-status" class="tep-status-message"></div>
        `;
        document.body.appendChild(panel);

        const triggerButton = document.createElement('button');
        triggerButton.id = 'tep-trigger-button';
        triggerButton.textContent = TRIGGER_BUTTON_TEXT;
        document.body.appendChild(triggerButton);

        GM_addStyle(`
            #text-extractor-panel {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #f0f0f0;
                border: 1px solid #ccc;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 99999;
                font-family: Arial, sans-serif;
                color: #333;
            }
            #text-extractor-panel .tep-header {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
                text-align: center;
                position: relative; /* 为关闭按钮提供定位上下文 */
            }
            #tep-selector-input {
                width: calc(100% - 22px); /* 减去 padding 和 border */
                padding: 8px;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            #tep-extract-button {
                width: 100%;
                padding: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 15px;
            }
            #tep-extract-button:hover {
                background-color: #45a049;
            }
            .tep-status-message {
                margin-top: 10px;
                font-size: 12px;
                text-align: center;
            }
            .tep-status-error {
                color: red;
            }
            .tep-status-success {
                color: green;
            }

            #tep-trigger-button {
                position: fixed;
                bottom: 80px; /* 与主面板错开 */
                right: 0px;
                background-color: #4CAF50; /* 与原按钮颜色一致 */
                color: white;
                border: none;
                padding: 10px 15px;
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
                cursor: pointer;
                z-index: 100000; /* 确保在最上层 */
                transform: translateX(calc(100% - 40px)); /* 初始露出40px */
                transition: transform 0.3s ease-in-out, background-color 0.3s ease;
                font-size: 14px;
                box-shadow: -2px 2px 5px rgba(0,0,0,0.2);
                white-space: nowrap; /* 防止文字换行 */
            }
            #tep-trigger-button:hover {
                transform: translateX(0);
                background-color: #45a049; /* 悬停颜色加深 */
            }

            .tep-hidden {
                display: none !important;
            }

            .tep-visible {
                display: block !important;
            }
            
            .tep-close-btn {
                position: absolute;
                top: 5px; 
                right: 8px; 
                font-size: 24px; 
                color: #aaa;
                cursor: pointer;
                line-height:1;
                padding: 0 5px;
                font-weight: bold;
            }
            .tep-close-btn:hover {
                color: #555;
            }
        `);

        document.getElementById('tep-extract-button').addEventListener('click', handleExtract);

        // 新增：触发按钮的事件监听
        const tepTriggerButton = document.getElementById('tep-trigger-button');
        const tepPanel = document.getElementById('text-extractor-panel');

        if (tepTriggerButton && tepPanel) {
            tepTriggerButton.addEventListener('click', () => {
                tepPanel.classList.remove('tep-hidden');
                tepPanel.classList.add('tep-visible');
                // 可选: 点击后隐藏触发按钮自身
                // tepTriggerButton.style.display = 'none'; 
            });
        }

        // 新增：关闭按钮的事件监听
        const tepCloseButton = document.getElementById('tep-close-button');
        if (tepCloseButton && tepPanel) { // tepPanel 已经获取过了，可以复用
            tepCloseButton.addEventListener('click', () => {
                tepPanel.classList.remove('tep-visible');
                tepPanel.classList.add('tep-hidden');
                 // 可选: 如果触发按钮被隐藏了，在这里重新显示它
                // if (tepTriggerButton) tepTriggerButton.style.display = 'block';
            });
        }

        // 新增：输入框Tab键处理
        const selectorInputField = document.getElementById('tep-selector-input'); // 复用或确保已获取
        if (selectorInputField) {
            selectorInputField.addEventListener('focus', function() {
                loadSelectorHistory();
                currentHistoryIndex = -1;
                originalInputValueBeforeNav = this.value;
            });

            selectorInputField.addEventListener('input', function() {
                currentHistoryIndex = -1; // 用户手动输入，重置历史导航
                originalInputValueBeforeNav = this.value; // 实时更新原始输入
            });

            selectorInputField.addEventListener('keydown', function(event) {
                const valueBeforeKeydown = this.value; // 在按键处理前记录当前值

                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    event.preventDefault();
                    loadSelectorHistory(); // 确保使用最新的历史记录
                    if (selectorHistory.length === 0) return; // 没有历史则不进行任何操作

                    // 如果是首次开始导航 (之前 currentHistoryIndex 为 -1)
                    // 则将按键前的输入框内容保存为 originalInputValueBeforeNav
                    if (currentHistoryIndex === -1) {
                        originalInputValueBeforeNav = valueBeforeKeydown;
                    }

                    if (event.key === 'ArrowUp') {
                        if (currentHistoryIndex === -1) { // 从当前输入开始向上导航
                            currentHistoryIndex = 0; // 指向最新的历史记录 (index 0)
                        } else if (currentHistoryIndex < selectorHistory.length - 1) {
                            currentHistoryIndex++; // 移动到更早的历史记录 (index增加)
                        }
                        // 只有在 currentHistoryIndex 有效时才更新输入框
                        if (currentHistoryIndex >= 0 && currentHistoryIndex < selectorHistory.length) {
                           this.value = selectorHistory[currentHistoryIndex];
                        }
                    } else if (event.key === 'ArrowDown') {
                        if (currentHistoryIndex === -1) {
                            // 如果未在导航状态（例如，直接按了向下键），则不进行任何操作
                            return;
                        } else if (currentHistoryIndex > 0) {
                            currentHistoryIndex--; // 移动到较新的历史记录 (index减少)
                            this.value = selectorHistory[currentHistoryIndex];
                        } else if (currentHistoryIndex === 0) { // 当前是最新的历史记录 (index 0)
                            currentHistoryIndex = -1; // 退出导航，恢复原始输入
                            this.value = originalInputValueBeforeNav;
                        }
                    }
                } else if (event.key === 'Escape') {
                    if (currentHistoryIndex !== -1) { // 如果正在导航历史
                        this.value = originalInputValueBeforeNav; // 恢复原始输入
                        currentHistoryIndex = -1; // 退出导航状态
                        event.preventDefault(); // 阻止可能的其他 Escape 行为
                    }
                } else if (event.key === 'Tab') {
                    if (this.value.trim() === '') { // Tab键且输入框为空
                        event.preventDefault();
                        this.value = DEFAULT_SELECTOR_ON_TAB;
                    }
                    currentHistoryIndex = -1; // Tab后，无论是否填充，都重置导航状态
                }
                // 对于其他按键（如字母、数字、删除等），`input`事件处理器已处理currentHistoryIndex的重置
            });
        }
    }

    function handleExtract() {
        const selectorInput = document.getElementById('tep-selector-input');
        const statusDiv = document.getElementById('tep-status');
        const selector = selectorInput.value.trim();

        saveSelectorToHistory(selector); // 在获取选择器后立即保存

        statusDiv.textContent = ''; // 清空状态
        statusDiv.className = 'tep-status-message'; // 重置样式

        if (!selector) {
            statusDiv.textContent = '请输入CSS选择器!';
            statusDiv.classList.add('tep-status-error');
            selectorInput.focus();
            return;
        }

        try {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                statusDiv.textContent = `未找到匹配 "${selector}" 的元素。`;
                statusDiv.classList.add('tep-status-error');
                return;
            }

            let csvRows = [];
            // 添加表头
            csvRows.push(escapeCsvCell(DEFAULT_HEADER));

            elements.forEach(el => {
                const textContent = el.textContent || ''; // 获取文本内容，处理 null 的情况
                csvRows.push(escapeCsvCell(textContent));
            });

            const csvString = csvRows.join('\n');
            const timestamp = new Date().toISOString().replace(/[:.-]/g, '').slice(0, -4); // YYYYMMDDTHHMMSS
            const filename = `${FILENAME_PREFIX}${timestamp}.csv`;

            downloadCsv(csvString, filename);
            statusDiv.textContent = `成功提取 ${elements.length} 条文本并开始下载 ${filename}`;
            statusDiv.classList.add('tep-status-success');
        } catch (error) {
            console.error("提取错误:", error);
            statusDiv.textContent = `提取失败: ${error.message}. 请检查选择器是否有效。`;
            statusDiv.classList.add('tep-status-error');
        }
    }

    // --- 初始化 ---
    if (document.readyState === "complete" || document.readyState === "interactive") {
        createUI();
    } else {
        window.addEventListener('DOMContentLoaded', createUI);
    }

})();