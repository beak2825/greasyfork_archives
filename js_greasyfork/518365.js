// ==UserScript==
// @name         MyConsole
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  记录所有 window._console.log 即使控制台被清除也能查看
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518365/MyConsole.user.js
// @updateURL https://update.greasyfork.org/scripts/518365/MyConsole.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var renderLog = undefined;
    var clearLog = undefined;

    window._console = {};

    window._console.log = function(...args) {
        if(!renderLog) return;
        renderLog({
            type: 'log',
            args: args,
            timestamp: new Date()
        });
    };

    window._console.warn = function(...args) {
        if(!renderLog) return;
        renderLog({
            type: 'warn',
            args: args,
            timestamp: new Date()
        });
    };

    window._console.error = function(...args) {
        if(!renderLog) return;
        renderLog({
            type: 'error',
            args: args,
            timestamp: new Date()
        });
    };

    window._console.clear = function() {
        if(!clearLog) return;
        clearLog();
    };

    // 创建一个界面按钮来查看存储的日志
    const createLogViewer = () => {
        // 创建按钮
        const button = document.createElement('button');
        button.innerText = '查看日志';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px 20px';
        button.style.zIndex = 10000;
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        button.title = '点击查看的 window._console.log 日志';

        // 创建日志查看窗口
        const logWindow = document.createElement('div');
        logWindow.style.position = 'fixed';
        logWindow.style.top = '50px';
        logWindow.style.right = '20px';
        logWindow.style.width = '400px';
        logWindow.style.height = '300px';
        logWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        logWindow.style.color = 'white';
        logWindow.style.padding = '10px';
        logWindow.style.borderRadius = '5px';
        logWindow.style.display = 'none';
        logWindow.style.zIndex = 10000;
        logWindow.style.fontFamily = 'monospace';
        logWindow.style.fontSize = '12px';

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.innerText = '关闭';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.backgroundColor = '#f44336';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';

        // 创建清空按钮
        const clearButton = document.createElement('button');
        clearButton.innerText = '清空';
        clearButton.style.position = 'absolute';
        clearButton.style.top = '10px';
        clearButton.style.right = '60px';
        clearButton.style.padding = '5px 10px';
        clearButton.style.backgroundColor = '#4CAF50';
        clearButton.style.color = 'white';
        clearButton.style.border = 'none';
        clearButton.style.borderRadius = '3px';
        clearButton.style.cursor = 'pointer';


        const logContent = document.createElement('div');
        logContent.style.marginTop = '40px';
        logContent.style.overflowY = 'scroll';
        logContent.style.height = '230px';
        logContent.style.userSelect = 'text';

        // 添加事件监听器
        button.addEventListener('click', () => {
            logWindow.style.display = 'block';
        });

        closeButton.addEventListener('click', () => {
            logWindow.style.display = 'none';
        });

        clearButton.addEventListener('click', () => {
            logContent.innerHTML = '';
        });

        // 添加内容到 logWindow
        logWindow.appendChild(closeButton);
        logWindow.appendChild(clearButton);
        // 创建日志内容容器
        logWindow.appendChild(logContent);

        // 渲染日志内容
        renderLog = (entry) => {
            const logEntry = document.createElement('div');
            logEntry.style.marginBottom = '5px';
            logEntry.style.padding = '5px';
            logEntry.style.borderBottom = '1px solid #555';
            logEntry.style.wordBreak = 'break-word';

            const time = entry.timestamp.toLocaleTimeString();
            const type = entry.type.toUpperCase();
            const args = entry.args.map(arg => {
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg);
                    } catch (e) {
                        return '[Object]';
                    }
                }
                return arg.toString();
            }).join(' ');

            logEntry.innerHTML = `<strong>[${time}] ${type}:</strong> ${args}`;
            logContent.appendChild(logEntry);
        };

        clearLog = () => {
            logContent.innerHTML = '';
        }
        // 将按钮和日志窗口添加到页面
        document.body.appendChild(button);
        document.body.appendChild(logWindow);
    };

    // 延迟创建界面，确保页面加载完成
    window.addEventListener('load', createLogViewer);
})();
