// ==UserScript==
// @name         智能页面自动刷新器 (UI优化版 支持Youtube)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  标签页独立控制，为不同网站记住刷新间隔。默认1秒，并添加了始终可见的加减按钮来调整时间，操作更方便。
// @author       YourName
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540495/%E6%99%BA%E8%83%BD%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%99%A8%20%28UI%E4%BC%98%E5%8C%96%E7%89%88%20%E6%94%AF%E6%8C%81Youtube%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540495/%E6%99%BA%E8%83%BD%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%99%A8%20%28UI%E4%BC%98%E5%8C%96%E7%89%88%20%E6%94%AF%E6%8C%81Youtube%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timerId = null; // 用于存储 setTimeout 的 ID

    const intervalStorageKey = `refreshInterval_${window.location.hostname}`;
    const stateSessionKey = 'isRefreshingState';

    // --- 1. 添加样式 (已更新以支持新按钮) ---
    GM_addStyle(`
        #auto-refresh-panel {
            position: fixed; top: 15px; right: 15px; z-index: 99999;
            background-color: rgba(255, 255, 255, 0.95); border: 1px solid #ccc;
            border-radius: 8px; padding: 10px 15px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            display: flex; align-items: center; gap: 10px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
        }
        #auto-refresh-panel label { color: #333; font-weight: bold; margin-right: 0; }

        /* NEW: 包含输入框和加减按钮的容器 */
        #refresh-input-container {
            display: flex;
            align-items: center;
        }

        /* NEW: 加减按钮的样式 */
        .stepper-btn {
            width: 28px;
            height: 28px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            color: #333;
            font-size: 18px;
            font-weight: bold;
            line-height: 26px; /* 垂直居中 */
            text-align: center;
            cursor: pointer;
            user-select: none; /* 防止双击选中文本 */
        }
        .stepper-btn:hover {
            background-color: #e0e0e0;
        }
        #btn-minus {
            border-radius: 4px 0 0 4px;
            border-right: none;
        }
        #btn-plus {
            border-radius: 0 4px 4px 0;
            border-left: none;
        }

        #auto-refresh-input {
            width: 50px;
            height: 28px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 0; /* 中间部分无圆角 */
            text-align: center;
            box-sizing: border-box; /* 确保宽高计算准确 */
        }
        /* KEY CHANGE: 隐藏所有浏览器自带的数字输入框箭头 */
        #auto-refresh-input::-webkit-outer-spin-button,
        #auto-refresh-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        #auto-refresh-input[type=number] {
            -moz-appearance: textfield;
        }

        #toggle-refresh-btn {
            padding: 5px 12px; height: 28px; border: none; border-radius: 4px; color: white;
            cursor: pointer; font-weight: bold; transition: background-color 0.3s;
        }
        #toggle-refresh-btn.start { background-color: #28a745; }
        #toggle-refresh-btn.start:hover { background-color: #218838; }
        #toggle-refresh-btn.stop { background-color: #dc3545; }
        #toggle-refresh-btn.stop:hover { background-color: #c82333; }
    `);

    // --- 2. 创建 UI 元素 (已重构) ---
    const panel = document.createElement('div');
    panel.id = 'auto-refresh-panel';

    const label = document.createElement('label');
    label.textContent = '刷新间隔(秒):';

    // NEW: 创建包含输入框和按钮的容器
    const inputContainer = document.createElement('div');
    inputContainer.id = 'refresh-input-container';

    // NEW: 创建减号按钮
    const minusBtn = document.createElement('button');
    minusBtn.id = 'btn-minus';
    minusBtn.className = 'stepper-btn';
    minusBtn.textContent = '-';

    const intervalInput = document.createElement('input');
    intervalInput.id = 'auto-refresh-input';
    intervalInput.type = 'number';
    intervalInput.min = 1;
    intervalInput.max = 600;
    // KEY CHANGE: 默认值改为 1
    intervalInput.value = GM_getValue(intervalStorageKey, 1);

    // NEW: 创建加号按钮
    const plusBtn = document.createElement('button');
    plusBtn.id = 'btn-plus';
    plusBtn.className = 'stepper-btn';
    plusBtn.textContent = '+';

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'toggle-refresh-btn';

    // 组装UI
    inputContainer.appendChild(minusBtn);
    inputContainer.appendChild(intervalInput);
    inputContainer.appendChild(plusBtn);

    panel.appendChild(label);
    panel.appendChild(inputContainer);
    panel.appendChild(toggleBtn);
    document.body.appendChild(panel);


    // --- 3. 核心逻辑 (已添加对新按钮的支持) ---

    // 触发change事件的辅助函数，用于通知脚本值已改变并保存
    const triggerChangeEvent = () => {
        intervalInput.dispatchEvent(new Event('change'));
    };

    // NEW: 为减号按钮添加事件
    minusBtn.addEventListener('click', () => {
        let currentValue = parseInt(intervalInput.value, 10);
        if (currentValue > intervalInput.min) {
            intervalInput.value = currentValue - 1;
            triggerChangeEvent();
        }
    });

    // NEW: 为加号按钮添加事件
    plusBtn.addEventListener('click', () => {
        let currentValue = parseInt(intervalInput.value, 10);
        if (currentValue < intervalInput.max) {
            intervalInput.value = currentValue + 1;
            triggerChangeEvent();
        }
    });

    // [其余逻辑与 V3.0 相同]
    const updateUI = (isRefreshing) => {
        const buttons = [minusBtn, plusBtn];
        if (isRefreshing) {
            toggleBtn.textContent = '停止刷新';
            toggleBtn.className = 'stop';
            intervalInput.disabled = true;
            buttons.forEach(btn => btn.disabled = true); // 刷新时禁用加减按钮
        } else {
            toggleBtn.textContent = '开始刷新';
            toggleBtn.className = 'start';
            intervalInput.disabled = false;
            buttons.forEach(btn => btn.disabled = false); // 停止时启用加减按钮
        }
    };

    const startRefresh = () => {
        // 输入验证现在也防止手动输入无效值
        let interval = parseInt(intervalInput.value, 10);
        if (isNaN(interval) || interval < intervalInput.min || interval > intervalInput.max) {
            alert(`请输入 ${intervalInput.min} 到 ${intervalInput.max} 之间的秒数！`);
            interval = GM_getValue(intervalStorageKey, 1); // 恢复为上次保存的有效值
            intervalInput.value = interval;
            sessionStorage.removeItem(stateSessionKey);
            updateUI(false);
            return;
        }

        GM_setValue(intervalStorageKey, interval);
        sessionStorage.setItem(stateSessionKey, 'true');
        updateUI(true);

        console.log(`[标签页独立刷新] 页面将在 ${interval} 秒后刷新...`);
        timerId = setTimeout(() => {
            window.location.reload();
        }, interval * 1000);
    };

    const stopRefresh = () => {
        if (timerId) clearTimeout(timerId);
        sessionStorage.removeItem(stateSessionKey);
        updateUI(false);
        console.log('[标签页独立刷新] 页面自动刷新已停止。');
    };

    toggleBtn.addEventListener('click', () => {
        const isCurrentlyRefreshing = sessionStorage.getItem(stateSessionKey) === 'true';
        if (isCurrentlyRefreshing) {
            stopRefresh();
        } else {
            startRefresh();
        }
    });

    intervalInput.addEventListener('change', () => {
        const interval = parseInt(intervalInput.value, 10);
        if (!isNaN(interval) && interval >= intervalInput.min && interval <= intervalInput.max) {
            GM_setValue(intervalStorageKey, interval);
        }
    });

    // --- 4. 初始化 ---
    const initialState = sessionStorage.getItem(stateSessionKey) === 'true';
    if (initialState) {
        startRefresh();
    } else {
        updateUI(false);
    }

})();