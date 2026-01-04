// ==UserScript==
// @name         获取海逊erp的token
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  在HaiHuiSelling页面显示并复制AUTH_TOKEN、companyId、staffId，每5秒更新，支持手动刷新，并提供获取ID的提示。支持点击单个复制和一键复制（格式为 KEY = "VALUE"），复制提示改为悬浮小提示。
// @author       YourName
// @match        https://haihuiselling.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license MIT
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545142/%E8%8E%B7%E5%8F%96%E6%B5%B7%E9%80%8Aerp%E7%9A%84token.user.js
// @updateURL https://update.greasyfork.org/scripts/545142/%E8%8E%B7%E5%8F%96%E6%B5%B7%E9%80%8Aerp%E7%9A%84token.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局变量 ---
    let currentAuthToken = "Waiting for token...";
    let currentCompanyId = "Waiting for ID...";
    let currentStaffId = "Waiting for ID...";

    let tokenDisplayElement = null;
    let companyIdDisplayElement = null;
    let staffIdDisplayElement = null;
    let countdownDisplayElement = null;
    let hintDisplayElement = null; // 用于显示提示信息

    let countdownIntervalId = null; // 用于1秒倒计时显示
    let countdownSeconds = 5; // 初始倒计时值

    let isWindowVisible = true; // 初始状态为可见

    let floatingMessageElement = null; // 悬浮提示元素
    let messageTimeoutId = null; // 悬浮提示的定时器ID

    // --- CSS 样式 ---
    GM_addStyle(`
        #authTokenWindow {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px; /* 稍微加宽以容纳更多信息 */
            background-color: #f9f9f9;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 99999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            display: flex;
            flex-direction: column;
            resize: both; /* 允许用户调整大小 */
            overflow: auto; /* 内容溢出时显示滚动条 */
            min-width: 250px;
            min-height: 180px;
        }
        #authTokenWindow.hidden {
            display: none;
        }
        #authTokenHeader {
            background-color: #4CAF50;
            color: white;
            padding: 8px 12px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
        }
        #authTokenCloseBtn {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0 5px;
            line-height: 1;
        }
        #authTokenCloseBtn:hover {
            color: #ddd;
        }
        #authTokenContent {
            padding: 12px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 8px; /* 调整间距 */
        }
        #authTokenDisplay, #companyIdDisplay, #staffIdDisplay {
            background-color: #eee;
            border: 1px dashed #aaa;
            padding: 8px;
            border-radius: 4px;
            word-break: break-all;
            font-family: monospace;
            font-size: 13px;
            color: #000;
            min-height: 25px; /* 稍微减小高度 */
            display: flex;
            align-items: center;
            cursor: pointer; /* 指示可点击 */
            transition: background-color 0.2s; /* 鼠标悬停效果 */
        }
        #authTokenDisplay:hover, #companyIdDisplay:hover, #staffIdDisplay:hover {
            background-color: #e0e0e0; /* 鼠标悬停效果 */
        }
        #countdownDisplay {
            font-size: 12px;
            color: #666;
            text-align: right;
            margin-top: 5px;
            padding-right: 5px;
        }
        #hintDisplay { /* 提示信息样式 */
            font-size: 12px;
            color: #d9534f; /* 红色，醒目 */
            margin-top: 5px;
            text-align: center;
            font-weight: bold;
        }
        #authTokenActions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 10px; /* 增加按钮与上方内容的间距 */
        }
        #authTokenActions button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            transition: background-color 0.2s;
        }
        #authTokenActions button:hover {
            background-color: #0056b3;
        }

        /* 悬浮提示框样式 */
        #floatingCopyMessage {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 0); /* 初始位置，水平居中 */
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 100000; /* 确保在最上层 */
            font-size: 14px;
            opacity: 0; /* 初始隐藏 */
            transition: opacity 0.3s ease-out, transform 0.3s ease-out; /* 平滑过渡效果 */
            pointer-events: none; /* 允许点击穿透，不阻挡下方元素 */
            white-space: nowrap; /* 防止文本换行 */
        }
    `);

    // --- UI 创建 ---
    function createAuthTokenWindow() {
        const windowDiv = document.createElement('div');
        windowDiv.id = 'authTokenWindow';
        if (!isWindowVisible) {
            windowDiv.classList.add('hidden');
        }

        const headerDiv = document.createElement('div');
        headerDiv.id = 'authTokenHeader';
        headerDiv.innerHTML = `<span>HaiHuiSelling Info</span><button id="authTokenCloseBtn">×</button>`;
        windowDiv.appendChild(headerDiv);

        const contentDiv = document.createElement('div');
        contentDiv.id = 'authTokenContent';
        windowDiv.appendChild(contentDiv);

        // Token 显示区域
        tokenDisplayElement = document.createElement('div');
        tokenDisplayElement.id = 'authTokenDisplay';
        tokenDisplayElement.textContent = `Token: ${currentAuthToken}`;
        tokenDisplayElement.title = '点击复制 Token'; // 鼠标悬停提示
        tokenDisplayElement.addEventListener('click', () => {
            copyToClipboard(currentAuthToken, 'AUTH_TOKEN');
        });
        contentDiv.appendChild(tokenDisplayElement);

        // Company ID 显示区域
        companyIdDisplayElement = document.createElement('div');
        companyIdDisplayElement.id = 'companyIdDisplay';
        companyIdDisplayElement.textContent = `Company ID: ${currentCompanyId}`;
        companyIdDisplayElement.title = '点击复制 Company ID'; // 鼠标悬停提示
        companyIdDisplayElement.addEventListener('click', () => {
            copyToClipboard(currentCompanyId, 'Company ID');
        });
        contentDiv.appendChild(companyIdDisplayElement);

        // Staff ID 显示区域
        staffIdDisplayElement = document.createElement('div');
        staffIdDisplayElement.id = 'staffIdDisplay';
        staffIdDisplayElement.textContent = `Staff ID: ${currentStaffId}`;
        staffIdDisplayElement.title = '点击复制 Staff ID'; // 鼠标悬停提示
        staffIdDisplayElement.addEventListener('click', () => {
            copyToClipboard(currentStaffId, 'Staff ID');
        });
        contentDiv.appendChild(staffIdDisplayElement);

        hintDisplayElement = document.createElement('div'); // 创建提示元素
        hintDisplayElement.id = 'hintDisplay';
        contentDiv.appendChild(hintDisplayElement);

        countdownDisplayElement = document.createElement('div');
        countdownDisplayElement.id = 'countdownDisplay';
        contentDiv.appendChild(countdownDisplayElement);

        const actionsDiv = document.createElement('div');
        actionsDiv.id = 'authTokenActions';
        contentDiv.appendChild(actionsDiv);

        // 一键复制按钮
        const copyAllButton = document.createElement('button');
        copyAllButton.textContent = '一键复制';
        copyAllButton.addEventListener('click', copyAllInfo);
        actionsDiv.appendChild(copyAllButton);

        const refreshButton = document.createElement('button');
        refreshButton.textContent = '手动刷新';
        refreshButton.addEventListener('click', () => {
            updateDisplay(); // 手动刷新时立即更新显示
            startCountdown(); // 并重新开始倒计时
        });
        actionsDiv.appendChild(refreshButton);

        document.body.appendChild(windowDiv);

        // --- 拖动功能 ---
        let isDragging = false;
        let offsetX, offsetY;

        headerDiv.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - windowDiv.getBoundingClientRect().left;
            offsetY = e.clientY - windowDiv.getBoundingClientRect().top;
            windowDiv.style.cursor = 'grabbing';
            e.preventDefault(); // 防止拖动时选中文字
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            windowDiv.style.left = (e.clientX - offsetX) + 'px';
            windowDiv.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            windowDiv.style.cursor = 'move';
        });

        // --- 关闭按钮功能 ---
        document.getElementById('authTokenCloseBtn').addEventListener('click', () => {
            windowDiv.classList.add('hidden');
            isWindowVisible = false;
            // 清除所有定时器
            if (countdownIntervalId) {
                clearInterval(countdownIntervalId);
                countdownIntervalId = null;
            }
            // 隐藏可能存在的悬浮提示
            if (floatingMessageElement) {
                floatingMessageElement.remove();
                floatingMessageElement = null;
                clearTimeout(messageTimeoutId);
                messageTimeoutId = null;
            }
        });
    }

    // --- 信息显示更新 ---
    function updateDisplay() {
        tokenDisplayElement.textContent = `Token: ${currentAuthToken}`;
        companyIdDisplayElement.textContent = `Company ID: ${currentCompanyId}`;
        staffIdDisplayElement.textContent = `Staff ID: ${currentStaffId}`;

        // 根据 Company ID 和 Staff ID 的获取状态显示或隐藏提示
        if (currentCompanyId === "Waiting for ID..." || currentStaffId === "Waiting for ID...") {
            hintDisplayElement.textContent = "提示：请尝试点击左侧菜单的 '商品汇总' 以获取 Company ID 和 Staff ID。";
        } else {
            hintDisplayElement.textContent = ""; // 清除提示
        }

        console.log('Display updated:', { token: currentAuthToken, companyId: currentCompanyId, staffId: currentStaffId });
    }

    // --- 显示悬浮提示框 ---
    function showFloatingMessage(message, duration = 2000) {
        // 清除任何现有的消息和定时器
        if (messageTimeoutId) {
            clearTimeout(messageTimeoutId);
            messageTimeoutId = null;
        }
        if (floatingMessageElement) {
            floatingMessageElement.remove(); // 立即移除旧的元素
            floatingMessageElement = null;
        }

        // 创建新的提示元素
        floatingMessageElement = document.createElement('div');
        floatingMessageElement.id = 'floatingCopyMessage';
        floatingMessageElement.textContent = message;
        document.body.appendChild(floatingMessageElement);

        // 触发淡入动画
        // 使用一个小延迟确保元素已添加到DOM并触发CSS过渡
        setTimeout(() => {
            if (floatingMessageElement) {
                floatingMessageElement.style.opacity = '1';
                floatingMessageElement.style.transform = 'translate(-50%, 0)'; // 移动到最终位置
            }
        }, 10);

        // 设置定时器，在指定时间后淡出并移除
        messageTimeoutId = setTimeout(() => {
            if (floatingMessageElement) {
                floatingMessageElement.style.opacity = '0';
                floatingMessageElement.style.transform = 'translate(-50%, -20px)'; // 向上移动一点，同时淡出
                // 监听过渡结束事件，确保元素在动画完成后被移除
                floatingMessageElement.addEventListener('transitionend', function handler() {
                    if (floatingMessageElement) {
                        floatingMessageElement.remove();
                        floatingMessageElement = null;
                    }
                    floatingMessageElement.removeEventListener('transitionend', handler); // 移除事件监听器，避免内存泄漏
                });
            }
        }, duration);
    }

    // --- 复制单个值到剪贴板 ---
    function copyToClipboard(value, name) {
        if (value && value !== "Waiting for token..." && value !== "Waiting for ID..." && value !== "Not Found") {
            GM_setClipboard(value, 'text');
            showFloatingMessage(`${name} 已复制！`);
        } else {
            showFloatingMessage(`没有可复制的 ${name}。`);
        }
    }

    // --- 复制所有信息到剪贴板 ---
    function copyAllInfo() {
        let allInfo = []; // 使用数组来收集每行，最后join
        let copiedCount = 0;

        if (currentAuthToken && currentAuthToken !== "Waiting for token..." && currentAuthToken !== "Not Found") {
            allInfo.push(`AUTH_TOKEN = "${currentAuthToken}"`);
            copiedCount++;
        }
        if (currentCompanyId && currentCompanyId !== "Waiting for ID..." && currentCompanyId !== "Not Found") {
            // Company ID 是数字，不需要引号
            allInfo.push(`COMPANY_ID = ${currentCompanyId}`);
            copiedCount++;
        }
        if (currentStaffId && currentStaffId !== "Waiting for ID..." && currentStaffId !== "Not Found") {
            allInfo.push(`STAFF_ID = "${currentStaffId}"`);
            copiedCount++;
        }

        if (copiedCount > 0) {
            GM_setClipboard(allInfo.join('\n'), 'text'); // 使用换行符连接数组元素
            showFloatingMessage(`已复制 ${copiedCount} 项信息！`);
        } else {
            showFloatingMessage('没有可复制的信息。');
        }
    }

    // --- 倒计时逻辑 ---
    function startCountdown() {
        clearInterval(countdownIntervalId); // 清除任何现有倒计时
        countdownSeconds = 5; // 重置倒计时

        countdownIntervalId = setInterval(() => {
            countdownSeconds--;
            if (countdownSeconds <= 0) {
                countdownSeconds = 5; // 重置为下一个循环
                updateDisplay(); // 触发显示更新（每5秒）
            }
            countdownDisplayElement.textContent = `下次刷新还有 ${countdownSeconds} 秒`;
        }, 1000); // 每秒更新一次
    }

    // --- XHR 请求拦截 ---

    // 拦截 setRequestHeader 以获取 token
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
        if (name.toLowerCase() === 'token' && value) {
            if (currentAuthToken !== value) { // 只有当token发生变化时才更新
                currentAuthToken = value;
                updateDisplay(); // 立即更新显示
                console.log('AUTH_TOKEN captured:', currentAuthToken);
            }
        }
        originalSetRequestHeader.apply(this, arguments);
    };

    // 拦截 send 方法以获取请求体中的 companyId 和 staffId
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        // 检查数据是否为字符串且看起来像JSON
        if (typeof data === 'string' && data.startsWith('{') && data.endsWith('}')) {
            try {
                const parsedData = JSON.parse(data);
                let updated = false;

                // 检查 product 对象中的 companyId
                if (parsedData.product && parsedData.product.companyId !== undefined) {
                    if (currentCompanyId !== parsedData.product.companyId) {
                        currentCompanyId = parsedData.product.companyId;
                        updated = true;
                        console.log('companyId captured (from product):', currentCompanyId);
                    }
                }
                // 检查 product 对象中的 staffId
                if (parsedData.product && parsedData.product.staffId !== undefined) {
                    if (currentStaffId !== parsedData.product.staffId) {
                        currentStaffId = parsedData.product.staffId;
                        updated = true;
                        console.log('staffId captured (from product):', currentStaffId);
                    }
                }
                // 检查根级别的 companyId (以防有切换公司API直接发送)
                if (parsedData.companyId !== undefined) {
                    if (currentCompanyId !== parsedData.companyId) {
                        currentCompanyId = parsedData.companyId;
                        updated = true;
                        console.log('companyId captured (from root):', currentCompanyId);
                    }
                }
                // 检查根级别的 staffId (以防有切换公司API直接发送)
                if (parsedData.staffId !== undefined) {
                    if (currentStaffId !== parsedData.staffId) {
                        currentStaffId = parsedData.staffId;
                        updated = true;
                        console.log('staffId captured (from root):', currentStaffId);
                    }
                }

                if (updated) {
                    updateDisplay(); // 如果有任何ID变化，立即更新显示
                }

            } catch (e) {
                // console.warn("Failed to parse XHR send data as JSON:", e); // 可选：用于调试
            }
        }
        // 调用原始的 send 方法，确保请求正常发出
        originalXHRSend.apply(this, arguments);
    };

    // --- 初始化 ---
    function init() {
        createAuthTokenWindow();
        updateDisplay(); // 初始显示更新，包括提示
        startCountdown(); // 启动倒计时
    }

    // 确保DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
