// ==UserScript==
// @name         秒杀自动点击脚本
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  适用于购物网站秒杀场景，支持动态监控购买按钮、精准时间对齐、自动点击操作。
// @author       Universal
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518583/%E7%A7%92%E6%9D%80%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/518583/%E7%A7%92%E6%9D%80%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        CONTROL_PANEL_ID: 'seckillControl', // 控制面板ID
        MONITOR_INTERVAL: 50, // 动态监控间隔 (毫秒)
        TARGET_TEXT: '立即购买', // 按钮显示文本
    };

    const State = {
        isRunning: false, // 是否正在运行
        serverTimeOffset: 0, // 服务器时间与本地时间的偏差
        targetSelector: GM_getValue('targetSelector', ''), // 目标选择器
        executeTime: GM_getValue('executeTime', ''), // 定时执行时间
    };

    // 添加样式
    function addStyles() {
        GM_addStyle(`
            #seckillControl {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                background: #fff;
                border: 1px solid #ccc;
                padding: 15px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-family: Arial, sans-serif;
                width: 300px;
            }
            #seckillControl input, #seckillControl button {
                margin-bottom: 10px;
            }
            #seckillControl input {
                width: 100%;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 3px;
            }
            #seckillControl button {
                padding: 5px 10px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }
            #seckillControl #startButton {
                background-color: #28a745;
                color: white;
            }
            #seckillControl #stopButton {
                background-color: #dc3545;
                color: white;
            }
        `);
    }

    // 创建控制面板
    function createControlPanel() {
        if (document.getElementById(CONFIG.CONTROL_PANEL_ID)) return;

        const controlPanel = document.createElement('div');
        controlPanel.id = CONFIG.CONTROL_PANEL_ID;
        controlPanel.innerHTML = `
            <label>目标选择器 (CSS 或 XPath):</label>
            <input type="text" id="targetSelectorInput" placeholder="请输入目标选择器" value="${State.targetSelector}">
            <label>执行时间:</label>
            <input type="datetime-local" step="1" id="executeTimeInput" value="${State.executeTime}">
            <button id="startButton">开始</button>
            <button id="stopButton" disabled>停止</button>
            <div id="statusText">状态: 未运行</div>
        `;
        document.body.appendChild(controlPanel);

        document.getElementById('startButton').addEventListener('click', startMonitoring);
        document.getElementById('stopButton').addEventListener('click', stopMonitoring);
        document.getElementById('targetSelectorInput').addEventListener('input', (event) => {
            State.targetSelector = event.target.value.trim();
            GM_setValue('targetSelector', State.targetSelector);
        });
        document.getElementById('executeTimeInput').addEventListener('change', (event) => {
            State.executeTime = event.target.value.trim();
            GM_setValue('executeTime', State.executeTime);
        });
    }

    // 更新状态文本
    function updateStatus(message) {
        document.getElementById('statusText').innerText = `状态: ${message}`;
    }

    // 获取服务器时间偏差
    async function syncServerTime() {
        const start = Date.now();
        // 示例：使用阿里云的 NTP 服务
        const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
        const serverTime = await response.json();
        const end = Date.now();
        State.serverTimeOffset = serverTime.unixtime * 1000 - ((start + end) / 2);
        console.log(`服务器时间偏差: ${State.serverTimeOffset}ms`);
    }

    // 开始监控按钮
    async function startMonitoring() {
        if (State.isRunning) return;

        if (!State.targetSelector || !State.executeTime) {
            alert('请设置目标选择器和执行时间！');
            return;
        }

        updateStatus('同步服务器时间中...');
        await syncServerTime();

        const executeTime = new Date(State.executeTime).getTime();
        const localExecuteTime = executeTime - State.serverTimeOffset;

        if (localExecuteTime <= Date.now()) {
            alert('请设置一个未来的执行时间！');
            return;
        }

        updateStatus('等待执行...');
        setTimeout(() => {
            State.isRunning = true;
            monitorButton();
        }, localExecuteTime - Date.now());

        document.getElementById('stopButton').disabled = false;
    }

    // 停止监控
    function stopMonitoring() {
        State.isRunning = false;
        updateStatus('已停止');
        document.getElementById('stopButton').disabled = true;
    }

    // 动态监控按钮
    function monitorButton() {
        if (!State.isRunning) return;

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                const button = document.querySelector(State.targetSelector);
                if (button && button.textContent.includes(CONFIG.TARGET_TEXT)) {
                    button.click();
                    updateStatus('已点击目标按钮！');
                    observer.disconnect();
                    stopMonitoring();
                    return;
                }
            }
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);

        updateStatus('监控中...');
    }

    // 初始化脚本
    function initialize() {
        addStyles();
        createControlPanel();
        console.log('秒杀脚本已加载');
    }

    initialize();
})();
