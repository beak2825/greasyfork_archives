// ==UserScript==
// @name         秒杀自动点击脚本（可设置次数和间隔）
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  支持秒杀自动点击，右键选择目标元素，动态检测“立即购买”按钮状态，支持手动设置点击次数和间隔，服务器时间同步功能完善。
// @author       Universal
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518592/%E7%A7%92%E6%9D%80%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%84%9A%E6%9C%AC%EF%BC%88%E5%8F%AF%E8%AE%BE%E7%BD%AE%E6%AC%A1%E6%95%B0%E5%92%8C%E9%97%B4%E9%9A%94%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/518592/%E7%A7%92%E6%9D%80%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%84%9A%E6%9C%AC%EF%BC%88%E5%8F%AF%E8%AE%BE%E7%BD%AE%E6%AC%A1%E6%95%B0%E5%92%8C%E9%97%B4%E9%9A%94%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        CONTROL_PANEL_ID: 'seckillControl', // 控制面板ID
        OVERLAY_ID: 'elementOverlay', // 高亮层ID
        TARGET_TEXT: '立即购买', // 目标按钮显示文本
        SERVER_TIME_API: 'https://worldtimeapi.org/api/timezone/Etc/UTC', // 服务器时间 API
        TIMEOUT_MS: 5000, // 同步时间超时时间
        DEFAULT_CLICK_INTERVAL: 100, // 默认点击间隔（毫秒）
        DEFAULT_CLICK_COUNT: 1, // 默认点击次数
    };

    const State = {
        isRunning: false, // 是否正在运行
        serverTimeOffset: 0, // 服务器时间偏差
        targetSelector: GM_getValue('targetSelector', ''), // 保存的目标选择器
        executeTime: GM_getValue('executeTime', ''), // 预设执行时间
        clickCount: CONFIG.DEFAULT_CLICK_COUNT, // 总点击次数
        clickInterval: CONFIG.DEFAULT_CLICK_INTERVAL, // 点击间隔
        isPicking: false, // 是否正在选择目标元素
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
            #seckillControl #pickButton {
                background-color: #007bff;
                color: white;
            }
            #elementOverlay {
                position: absolute;
                border: 2px dashed #007bff;
                background-color: rgba(0, 123, 255, 0.2);
                pointer-events: none;
                z-index: 9998;
                display: none;
            }
            #statusText {
                font-size: 12px;
                color: #333;
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
            <input type="text" id="targetSelectorInput" placeholder="通过右键选择或手动输入" value="${State.targetSelector}">
            <label>执行时间 (精确到秒):</label>
            <input type="datetime-local" step="1" id="executeTimeInput" value="${State.executeTime}">
            <label>点击次数:</label>
            <input type="number" id="clickCountInput" value="${State.clickCount}" min="1">
            <label>点击间隔 (毫秒):</label>
            <input type="number" id="clickIntervalInput" value="${State.clickInterval}" min="10">
            <button id="pickButton">右键选择目标</button>
            <button id="startButton">开始</button>
            <button id="stopButton" disabled>停止</button>
            <div id="statusText">状态: 未运行</div>
        `;
        document.body.appendChild(controlPanel);

        document.getElementById('pickButton').addEventListener('click', enableElementPicker);
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
        document.getElementById('clickCountInput').addEventListener('change', (event) => {
            State.clickCount = parseInt(event.target.value, 10) || CONFIG.DEFAULT_CLICK_COUNT;
        });
        document.getElementById('clickIntervalInput').addEventListener('change', (event) => {
            State.clickInterval = parseInt(event.target.value, 10) || CONFIG.DEFAULT_CLICK_INTERVAL;
        });
    }

    // 更新状态文本
    function updateStatus(message) {
        const statusText = document.getElementById('statusText');
        statusText.innerText = `状态: ${message}`;
    }

    // 获取服务器时间偏差
    async function syncServerTime() {
        updateStatus('同步服务器时间中...');
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

            const response = await fetch(CONFIG.SERVER_TIME_API, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error('无法获取服务器时间');
            const serverTime = await response.json();

            const now = Date.now();
            State.serverTimeOffset = serverTime.unixtime * 1000 - now;
            updateStatus('服务器时间同步成功');
        } catch (error) {
            console.warn('服务器时间同步失败，回退到本地时间:', error);
            updateStatus('服务器时间同步失败，使用本地时间');
            State.serverTimeOffset = 0; // 回退到本地时间
        }
    }

    // 开始监控
    async function startMonitoring() {
        if (State.isRunning) return;

        if (!State.targetSelector || !State.executeTime) {
            alert('请设置目标选择器和执行时间！');
            return;
        }

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
            executeClicks(State.clickCount, State.clickInterval);
        }, localExecuteTime - Date.now());

        document.getElementById('stopButton').disabled = false;
    }

    // 停止监控
    function stopMonitoring() {
        State.isRunning = false;
        updateStatus('已停止');
        document.getElementById('stopButton').disabled = true;
    }

    // 按次数和间隔点击目标元素
    async function executeClicks(count, interval) {
        const targetElement = document.querySelector(State.targetSelector);
        if (!targetElement) {
            updateStatus('未找到目标元素，操作终止');
            stopMonitoring();
            return;
        }

        for (let i = 0; i < count; i++) {
            if (!State.isRunning) break;
            targetElement.click();
            updateStatus(`已点击 ${i + 1}/${count} 次`);
            await new Promise((resolve) => setTimeout(resolve, interval));
        }

        updateStatus('点击操作完成');
        stopMonitoring();
    }

    // 启用目标选择功能
    function enableElementPicker() {
        alert('请右键单击页面上的目标元素来选择它。');
        State.isPicking = true;

        document.addEventListener('mouseover', highlightElement, true);
        document.addEventListener('contextmenu', selectElement, true);
    }

    // 停用目标选择
    function disableElementPicker() {
        State.isPicking = false;
        const overlay = document.getElementById(CONFIG.OVERLAY_ID);
        overlay.style.display = 'none';

        document.removeEventListener('mouseover', highlightElement, true);
        document.removeEventListener('contextmenu', selectElement, true);
    }

    // 高亮元素
    function highlightElement(event) {
        if (!State.isPicking) return;

        const overlay = document.getElementById(CONFIG.OVERLAY_ID);
        const target = event.target;

        if (!target) return;
        const rect = target.getBoundingClientRect();
        overlay.style.display = 'block';
        overlay.style.top = `${rect.top + window.scrollY}px`;
        overlay.style.left = `${rect.left + window.scrollX}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
    }

    // 右键选择目标元素
    function selectElement(event) {
        if (!State.isPicking) return;

        event.preventDefault();
        const target = event.target;

        const selector = generateSelector(target);
        State.targetSelector = selector;
        GM_setValue('targetSelector', selector);

        document.getElementById('targetSelectorInput').value = selector;
        disableElementPicker();
        alert(`目标元素已选择: ${selector}`);
    }

    // 自动生成选择器
    function generateSelector(element) {
        if (!element) return null;

        let selector = element.tagName.toLowerCase();
        if (element.id) {
            selector += `#${element.id}`;
        } else if (element.className) {
            const className = element.className.trim().split(/\s+/).join('.');
            selector += `.${className}`;
        }
        return selector;
    }

    // 创建高亮层
    function createOverlay() {
        if (document.getElementById(CONFIG.OVERLAY_ID)) return;

        const overlay = document.createElement('div');
        overlay.id = CONFIG.OVERLAY_ID;
        document.body.appendChild(overlay);
    }

    // 初始化脚本
    function initialize() {
        addStyles();
        createControlPanel();
        createOverlay();
    }

    initialize();
})();
