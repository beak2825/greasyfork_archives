// ==UserScript==
// @name         Persistent Console Logger
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  记录所有 console.log 即使控制台被清除也能查看
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513278/Persistent%20Console%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/513278/Persistent%20Console%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个存储日志的数组
    const logStorage = [];

    // 保存原始的 console.log 和 console.clear 方法
    const originalLog = console.log;
    const originalClear = console.clear;

    // 重写 console.log 方法
    console.log = function(...args) {
        // 将日志存储到 logStorage 数组
        logStorage.push({
            type: 'log',
            args: args,
            timestamp: new Date()
        });

        // 调用原始的 console.log 方法
        originalLog.apply(console, args);
    };

    // 重写 console.warn 方法
    console.warn = function(...args) {
        logStorage.push({
            type: 'warn',
            args: args,
            timestamp: new Date()
        });
        originalLog.apply(console, args);
    };

    // 重写 console.error 方法
    console.error = function(...args) {
        logStorage.push({
            type: 'error',
            args: args,
            timestamp: new Date()
        });
        originalLog.apply(console, args);
    };

    // 重写 console.clear 方法
    console.clear = function() {
        // 可以选择不清除 logStorage，或根据需要清除
        // 这里选择不清除，确保日志仍然被记录

        // 调用原始的 console.clear 方法
        originalClear.apply(console);
    };

    // 创建一个界面按钮来查看存储的日志
    const createLogViewer = () => {
        // 创建按钮
        const button = document.createElement('button');
        button.innerText = '查看持久化日志';
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
        button.title = '点击查看持久化的 console.log 日志';

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
        logWindow.style.overflowY = 'scroll';
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

        // 添加事件监听器
        button.addEventListener('click', () => {
            logWindow.style.display = 'block';
            renderLogs();
        });

        closeButton.addEventListener('click', () => {
            logWindow.style.display = 'none';
        });

        // 添加内容到 logWindow
        logWindow.appendChild(closeButton);

        // 创建日志内容容器
        const logContent = document.createElement('div');
        logContent.style.marginTop = '40px';
        logWindow.appendChild(logContent);

        // 渲染日志内容
        const renderLogs = () => {
            logContent.innerHTML = ''; // 清空之前的内容
            logStorage.forEach(entry => {
                const logEntry = document.createElement('div');
                logEntry.style.marginBottom = '5px';
                logEntry.style.padding = '5px';
                logEntry.style.borderBottom = '1px solid #555';

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
            });
        };

        // 自动刷新日志内容
        setInterval(renderLogs, 1000);

        // 将按钮和日志窗口添加到页面
        document.body.appendChild(button);
        document.body.appendChild(logWindow);
    };

    // 延迟创建界面，确保页面加载完成
    window.addEventListener('load', createLogViewer);

    // 可选：将日志存储到本地存储，以便刷新页面后仍能保留
    const saveLogsToLocalStorage = () => {
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('persistentLogs', JSON.stringify(logStorage));
        });

        // 读取本地存储的日志
        const savedLogs = localStorage.getItem('persistentLogs');
        if (savedLogs) {
            try {
                const parsedLogs = JSON.parse(savedLogs);
                // 将字符串的 timestamp 转回 Date 对象
                parsedLogs.forEach(log => {
                    if (log.timestamp) {
                        log.timestamp = new Date(log.timestamp);
                    }
                });
                logStorage.push(...parsedLogs);
                localStorage.removeItem('persistentLogs');
            } catch (e) {
                console.error('Failed to parse saved logs:', e);
            }
        }
    };

    saveLogsToLocalStorage();

})();
