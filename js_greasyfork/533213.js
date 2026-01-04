// ==UserScript==
// @name         哈粉自动钓鱼
// @namespace    http://imwzj.uk/
// @version      1.4
// @description  用于 h5 架构的哈粉宾馆的自动输入的钓鱼脚本，全平台通用
// @author       瓯州人和 Grok
// @match        https://hf.bobba.cn/h5
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533213/%E5%93%88%E7%B2%89%E8%87%AA%E5%8A%A8%E9%92%93%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/533213/%E5%93%88%E7%B2%89%E8%87%AA%E5%8A%A8%E9%92%93%E9%B1%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let counter = 1; // 计数器，从 1 开始递增
    let intervalId = null; // 定时器 ID
    let isRunning = false; // 自动输入状态
    let iframe = null; // iframe 元素
    let logArea = null; // 日志文本区域
    let intervalInput = null; // 间隔输入框
    let intervalMs = 60000; // 默认间隔 60 秒
    let floatDiv = null; // 悬浮窗
    let icon = null; // 最小化图标

    // 添加日志到可折叠文本区域
    function appendLog(message) {
        if (logArea) {
            logArea.textContent += `[${new Date().toLocaleTimeString()}] ${message}\n`;
            logArea.scrollTop = logArea.scrollHeight; // 自动滚动到最新
        }
    }

    // 模拟按键（回车）
    function simulateKeyPress(element, key) {
        const event = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: key,
            code: key === 'Enter' ? 'Enter' : 'Digit' + key
        });
        element.dispatchEvent(event);
    }

    // 自动输入函数
    function autoInput() {
        if (!iframe || !iframe.contentDocument) {
            appendLog('无法访问 iframe');
            return;
        }

        const inputField = iframe.contentDocument.querySelector('input.chat-input');

        if (inputField) {
            inputField.focus();
            inputField.value = '';
            const numberStr = counter.toString();
            inputField.value = numberStr;
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
            inputField.dispatchEvent(new Event('change', { bubbles: true }));
            simulateKeyPress(inputField, 'Enter');
            appendLog(`输入数字：${counter}`);

            setTimeout(() => {}, 1000);
            const chatWidget = iframe.contentDocument.querySelector('.nitro-chat-widget');
            const chatBubbles = chatWidget.querySelectorAll('.bubble-container');
            console.log(chatBubbles.length)
            if (chatBubbles.length > 0) {
                const latestChatBubble = chatBubbles[chatBubbles.length - 1];
                const messageSpan = latestChatBubble.querySelector('.chat-bubble').querySelector('span.message');

                console.log(messageSpan.textContent.trim())
                console.log((counter - 1).toString())

                if (messageSpan && messageSpan.textContent.trim() === (counter - 1).toString()) {
                    console.log('最新 chat-bubble 的 span.message 内容是数字 5');
                } else {
                    console.log('最新 chat-bubble 的 span.message 内容不是数字 5 或不存在');
                }
            } else {
                console.log('未找到 chat-bubble 元素');
            }

            counter++;


        } else {
            appendLog('未在 iframe 中找到聊天输入框');
        }
    }

    // 切换自动输入状态
    function toggleAutoInput(button) {
        if (isRunning) {
            clearInterval(intervalId);
            intervalId = null;
            isRunning = false;
            appendLog('自动输入已停止');
            button.textContent = '开始钓鱼';
        } else {
            const intervalSec = parseFloat(intervalInput.value);
            if (isNaN(intervalSec) || intervalSec <= 0) {
                appendLog('无效间隔。请填写正数（秒）。');
                return;
            }
            intervalMs = intervalSec * 1000;
            autoInput(); // 立即运行
            intervalId = setInterval(autoInput, intervalMs); // 按自定义间隔运行
            isRunning = true;
            appendLog(`自动输入已开始，间隔 ${intervalSec} 秒`);
            button.textContent = '停止钓鱼';
        }
    }

    // 最小化悬浮窗
    function minimizeWindow() {
        floatDiv.style.display = 'none';
        icon.style.display = 'block';
        appendLog('悬浮窗已最小化');
    }

    // 恢复悬浮窗
    function restoreWindow() {
        floatDiv.style.display = 'block';
        icon.style.display = 'none';
        appendLog('悬浮窗已恢复');
    }

    // 创建固定悬浮窗和图标
    function createFloatingWindow() {
        // 悬浮窗
        floatDiv = document.createElement('div');
        floatDiv.style.position = 'fixed';
        floatDiv.style.top = '10px';
        floatDiv.style.right = '10px';
        floatDiv.style.backgroundColor = '#f0f0f0';
        floatDiv.style.padding = '10px';
        floatDiv.style.border = '1px solid #ccc';
        floatDiv.style.borderRadius = '5px';
        floatDiv.style.zIndex = '9999';
        floatDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        floatDiv.style.minWidth = '220px';

        // 最小化按钮
        const minimizeButton = document.createElement('button');
        minimizeButton.textContent = '最小化';
        minimizeButton.style.padding = '5px 10px';
        minimizeButton.style.cursor = 'pointer';
        minimizeButton.style.backgroundColor = '#FF9800';
        minimizeButton.style.color = 'white';
        minimizeButton.style.border = 'none';
        minimizeButton.style.borderRadius = '3px';
        minimizeButton.style.width = '100%';
        minimizeButton.style.marginBottom = '5px';

        minimizeButton.addEventListener('click', minimizeWindow);

        // 自动输入切换按钮
        const button = document.createElement('button');
        button.textContent = '开始钓鱼';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.width = '100%';
        button.style.marginBottom = '5px';

        button.addEventListener('click', () => toggleAutoInput(button));

        // 间隔输入框
        const intervalLabel = document.createElement('label');
        intervalLabel.textContent = '间隔（秒）：';
        intervalLabel.style.display = 'block';
        intervalLabel.style.marginBottom = '5px';

        intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.value = '60';
        intervalInput.min = '1';
        intervalInput.style.width = '100%';
        intervalInput.style.padding = '5px';
        intervalInput.style.border = '1px solid #ccc';
        intervalInput.style.borderRadius = '3px';
        intervalInput.style.marginBottom = '5px';

        // 日志切换按钮
        const toggleLog = document.createElement('button');
        toggleLog.textContent = '显示日志';
        toggleLog.style.padding = '5px 10px';
        toggleLog.style.cursor = 'pointer';
        toggleLog.style.backgroundColor = '#2196F3';
        toggleLog.style.color = 'white';
        toggleLog.style.border = 'none';
        toggleLog.style.borderRadius = '3px';
        toggleLog.style.width = '100%';
        toggleLog.style.marginBottom = '5px';

        logArea = document.createElement('textarea');
        logArea.style.width = '100%';
        logArea.style.height = '100px';
        logArea.style.display = 'none';
        logArea.style.resize = 'none';
        logArea.style.border = '1px solid #ccc';
        logArea.style.borderRadius = '3px';
        logArea.readOnly = true;

        toggleLog.addEventListener('click', () => {
            if (logArea.style.display === 'none') {
                logArea.style.display = 'block';
                toggleLog.textContent = '隐藏日志';
            } else {
                logArea.style.display = 'none';
                toggleLog.textContent = '显示日志';
            }
        });

        floatDiv.appendChild(minimizeButton);
        floatDiv.appendChild(button);
        floatDiv.appendChild(intervalLabel);
        floatDiv.appendChild(intervalInput);
        floatDiv.appendChild(toggleLog);
        floatDiv.appendChild(logArea);

        // 最小化图标
        icon = document.createElement('div');
        icon.style.position = 'fixed';
        icon.style.top = '10px';
        icon.style.right = '10px';
        icon.style.width = '30px';
        icon.style.height = '30px';
        icon.style.backgroundColor = '#4CAF50';
        icon.style.borderRadius = '50%';
        icon.style.display = 'none';
        icon.style.zIndex = '9999';
        icon.style.cursor = 'pointer';
        icon.style.textAlign = 'center';
        icon.style.lineHeight = '30px';
        icon.style.color = 'white';
        icon.style.fontSize = '18px';
        icon.textContent = '🎣';
        icon.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        icon.addEventListener('click', restoreWindow);

        document.body.appendChild(floatDiv);
        document.body.appendChild(icon);

        // 初始日志
        appendLog('悬浮窗已创建。设置间隔并点击按钮以切换自动输入。');
    }

    // 页面加载后初始化
    window.addEventListener('load', () => {
        // 查找特定 iframe
        iframe = document.querySelector('iframe[src*="/nitro-client/nitro-cool/index.html"]');
        if (!iframe) {
            appendLog('未找到包含 "/nitro-client/nitro-cool/index.html" 的 iframe');
            createFloatingWindow();
            return;
        }

        // 检查 iframe 是否可访问
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDoc) {
                appendLog('无法访问 iframe 内容');
                createFloatingWindow();
                return;
            }
        } catch (e) {
            appendLog('访问 iframe 出错：' + e.message);
            createFloatingWindow();
            return;
        }

        createFloatingWindow();
        minimizeWindow(); // 初始最小化悬浮窗

        // 定期检查输入框（最多 60 秒）
        let attempts = 0;
        const maxAttempts = 12;
        const checkInterval = setInterval(() => {
            const inputField = iframe.contentDocument.querySelector('input.chat-input');
            if (inputField) {
                appendLog('在 iframe 中找到聊天输入框。');
                clearInterval(checkInterval);
            } else {
                attempts++;
                appendLog(`尝试 ${attempts}：未在 iframe 中找到聊天输入框。`);
                if (attempts >= maxAttempts) {
                    appendLog('警告：60 秒后仍未找到聊天输入框，请确认输入框存在。');
                    clearInterval(checkInterval);
                }
            }
        }, 5000); // 每 5 秒检查一次
    });
})();