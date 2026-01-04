// ==UserScript==
// @name         Twitter/X 时间格式化工具
// @namespace    https://greasyfork.org/
// @version      2.6
// @license      MIT
// @description  正确显示Twitter/X帖子的本地时间
// @author       Richard Tyson
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://x.com/*
// @match        https://mobile.x.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535388/TwitterX%20%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/535388/TwitterX%20%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const defaultConfig = {
        showSeconds: true,
        showTimezone: false,  // 默认不显示时区标签
        dateFormat: 'YYYY-MM-DD',
        timeFormat: '24'
    };

    // 初始化配置
    let config = {
        ...defaultConfig,
        ...JSON.parse(GM_getValue('timeFormatConfig', JSON.stringify(defaultConfig)))
    };

    // 注册菜单命令
    GM_registerMenuCommand('设置时间格式', showConfigDialog);

    // 添加样式
    GM_addStyle(`
        #timeFormatConfigDialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--background-primary, white);
            color: var(--text-primary, black);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            z-index: 9999;
            width: 300px;
            font-family: Arial, sans-serif;
            border: 1px solid var(--border-color, #ddd);
        }
        #timeFormatConfigDialog h3 {
            margin-top: 0;
            color: var(--twitter-blue, #1da1f2);
        }
        .config-field {
            margin-bottom: 15px;
        }
        .config-label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .config-select {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--border-color, #ddd);
            border-radius: 4px;
        }
        .config-checkbox {
            margin-right: 8px;
        }
        .config-buttons {
            margin-top: 20px;
            text-align: right;
        }
        .config-button {
            padding: 8px 15px;
            margin-left: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .config-save {
            background-color: var(--twitter-blue, #1da1f2);
            color: white;
        }
        .config-close {
            background-color: var(--background-secondary, #ddd);
        }
        #timeFormatConfigOverlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
        }
    `);

    // 显示配置对话框
    function showConfigDialog() {
        const overlay = document.createElement('div');
        overlay.id = 'timeFormatConfigOverlay';

        const dialog = document.createElement('div');
        dialog.id = 'timeFormatConfigDialog';
        dialog.innerHTML = `
            <h3>时间格式设置</h3>

            <div class="config-field">
                <label class="config-label">日期格式</label>
                <select class="config-select" id="dateFormatSelect">
                    <option value="YYYY-MM-DD">年-月-日</option>
                    <option value="DD-MM-YYYY">日-月-年</option>
                </select>
            </div>

            <div class="config-field">
                <label class="config-label">时间格式</label>
                <select class="config-select" id="timeFormatSelect">
                    <option value="24">24小时制</option>
                    <option value="12">12小时制</option>
                </select>
            </div>

            <div class="config-field">
                <label>
                    <input type="checkbox" class="config-checkbox" id="showSecondsCheckbox">
                    显示秒数
                </label>
            </div>

            <div class="config-field">
                <label>
                    <input type="checkbox" class="config-checkbox" id="showTimezoneCheckbox">
                    显示时区标签
                </label>
            </div>

            <div class="config-buttons">
                <button class="config-button config-close" id="closeButton">关闭</button>
                <button class="config-button config-save" id="saveButton">保存</button>
            </div>
        `;

        // 设置当前值
        dialog.querySelector('#dateFormatSelect').value = config.dateFormat;
        dialog.querySelector('#timeFormatSelect').value = config.timeFormat;
        dialog.querySelector('#showSecondsCheckbox').checked = config.showSeconds;
        dialog.querySelector('#showTimezoneCheckbox').checked = config.showTimezone;

        // 添加事件监听
        dialog.querySelector('#closeButton').addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        dialog.querySelector('#saveButton').addEventListener('click', () => {
            const newConfig = {
                dateFormat: dialog.querySelector('#dateFormatSelect').value,
                timeFormat: dialog.querySelector('#timeFormatSelect').value,
                showSeconds: dialog.querySelector('#showSecondsCheckbox').checked,
                showTimezone: dialog.querySelector('#showTimezoneCheckbox').checked
            };

            updateConfig(newConfig);
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // 更新配置
    function updateConfig(newConfig) {
        config = newConfig;
        GM_setValue('timeFormatConfig', JSON.stringify(config));
        processedElements = new WeakSet();
        processAllTimeElements();
    }

    // 工具函数
    const pad = (num) => String(num).padStart(2, '0');
    let processedElements = new WeakSet();

    // 获取系统时区
    function getSystemTimezone() {
        const offset = -new Date().getTimezoneOffset();
        const sign = offset >= 0 ? '+' : '-';
        const hours = pad(Math.floor(Math.abs(offset) / 60));
        const minutes = pad(Math.abs(offset) % 60);
        return `UTC${sign}${hours}:${minutes}`;
    }

    // 时间格式化
    function formatDateTime(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "Invalid date";

        // 日期部分
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const formattedDate = config.dateFormat === 'DD-MM-YYYY'
            ? `${day}-${month}-${year}`
            : `${year}-${month}-${day}`;

        // 时间部分
        let hours = date.getHours();
        let ampm = '';

        if (config.timeFormat === '12') {
            ampm = hours >= 12 ? ' PM' : ' AM';
            hours = hours % 12 || 12;
        }

        const displayHours = pad(hours);
        const displayMinutes = pad(date.getMinutes());
        const displaySeconds = config.showSeconds ? `:${pad(date.getSeconds())}` : '';

        const formattedTime = `${displayHours}:${displayMinutes}${displaySeconds}${ampm}`;

        // 时区显示
        const tzDisplay = config.showTimezone ? getSystemTimezone() : '';

        return `${formattedDate} ${formattedTime} ${tzDisplay}`.trim();
    }

    // 处理所有时间元素
    function processAllTimeElements() {
        document.querySelectorAll('time[datetime]').forEach(timeElement => {
            processedElements.delete(timeElement);
            const datetimeStr = timeElement.getAttribute('datetime');
            if (!datetimeStr) return;
            timeElement.textContent = formatDateTime(datetimeStr);
            processedElements.add(timeElement);
        });
    }

    // 监听新内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE &&
                    (node.matches('time[datetime]') || node.querySelector('time[datetime]'))) {
                    processAllTimeElements();
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    processAllTimeElements();
})();