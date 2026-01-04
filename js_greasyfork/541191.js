// ==UserScript==
// @name         【微赞直播】801微赞直播间观看刷新器
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  自动刷新微赞直播热度，支持本地存储，可设置倍数、目标热度和停止时间
// @author       明灯花月夜
// @match        https://zb.jingyi.tv/live/page*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541191/%E3%80%90%E5%BE%AE%E8%B5%9E%E7%9B%B4%E6%92%AD%E3%80%91801%E5%BE%AE%E8%B5%9E%E7%9B%B4%E6%92%AD%E9%97%B4%E8%A7%82%E7%9C%8B%E5%88%B7%E6%96%B0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541191/%E3%80%90%E5%BE%AE%E8%B5%9E%E7%9B%B4%E6%92%AD%E3%80%91801%E5%BE%AE%E8%B5%9E%E7%9B%B4%E6%92%AD%E9%97%B4%E8%A7%82%E7%9C%8B%E5%88%B7%E6%96%B0%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 本地存储键名
    const STORAGE_KEY = 'wz-refresher-data';

    // 添加自定义样式
    GM_addStyle(`
        #wz-refresher-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 15px;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.25);
            padding: 22px;
            width: 360px;
            font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
            backdrop-filter: blur(6px);
        }

        #wz-refresher-container:hover {
            box-shadow: 0 8px 35px rgba(0, 0, 0, 0.3);
        }

        .wz-refresher-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 18px;
            padding-bottom: 18px;
            border-bottom: 1px solid #f0f5ff;
        }

        .wz-refresher-title {
            font-size: 22px;
            font-weight: 800;
            color: #2c3e50;
            display: flex;
            align-items: center;
            text-shadow: 0 2px 4px rgba(0,0,0,0.05);
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        .wz-refresher-title i {
            margin-right: 12px;
            font-size: 24px;
        }

        .wz-refresher-close {
            background: none;
            border: none;
            font-size: 22px;
            cursor: pointer;
            color: #a0aec0;
            transition: all 0.2s;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .wz-refresher-close:hover {
            background: #f8fafc;
            color: #e53e3e;
            transform: rotate(90deg);
        }

        .wz-input-group {
            margin-bottom: 18px;
        }

        .wz-input-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 700;
            color: #4a5568;
            font-size: 15px;
            display: flex;
            align-items: center;
        }

        .wz-input-label i {
            margin-right: 10px;
            color: #718096;
            font-size: 18px;
            min-width: 24px;
        }

        .wz-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s;
            background: #f8fafc;
            color: #2d3748;
            box-sizing: border-box;
        }

        .wz-input:focus {
            outline: none;
            border-color: #4299e1;
            background: #fff;
            box-shadow: 0 0 0 4px rgba(66, 153, 225, 0.2);
        }

        .wz-button {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 12px;
            font-size: 17px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.25s ease;
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .wz-button i {
            margin-right: 10px;
            font-size: 20px;
        }

        .wz-button-primary {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
        }

        .wz-button-primary:hover {
            background: linear-gradient(135deg, #4338ca, #6d28d9);
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(79, 70, 229, 0.3);
        }

        .wz-button-primary:active {
            transform: translateY(0);
        }

        .wz-button-stop {
            background: linear-gradient(135deg, #e53e3e, #c53030);
            color: white;
        }

        .wz-button-stop:hover {
            background: linear-gradient(135deg, #c53030, #9b2c2c);
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(229, 62, 62, 0.3);
        }

        .wz-button-stop:active {
            transform: translateY(0);
        }

        .wz-stats-container {
            background: linear-gradient(135deg, #f8fafc, #edf2f7);
            border-radius: 12px;
            padding: 18px;
            margin-top: 20px;
            border: 1px solid #e2e8f0;
        }

        .wz-stats-title {
            font-size: 16px;
            font-weight: 800;
            color: #4a5568;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .wz-stats-title i {
            margin-right: 10px;
            color: #4f46e5;
            font-size: 18px;
        }

        .wz-stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        .wz-stat {
            background: white;
            border-radius: 10px;
            padding: 12px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.03);
            border: 1px solid #e2e8f0;
            transition: transform 0.3s ease;
        }

        .wz-stat:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.08);
        }

        .wz-stat-value {
            font-size: 22px;
            font-weight: 900;
            color: #2d3748;
            margin-bottom: 5px;
            text-shadow: 0 2px 3px rgba(0,0,0,0.05);
        }

        .wz-stat-label {
            font-size: 14px;
            color: #718096;
            font-weight: 600;
        }

        .wz-status {
            margin-top: 20px;
            padding: 16px;
            border-radius: 12px;
            font-size: 15px;
            text-align: center;
            font-weight: 600;
            display: none;
            border: 1px solid;
        }

        .wz-status.running {
            display: block;
            background: rgba(56, 161, 105, 0.1);
            color: #38a169;
            border-color: rgba(56, 161, 105, 0.3);
        }

        .wz-status.stopped {
            display: block;
            background: rgba(229, 62, 62, 0.1);
            color: #e53e3e;
            border-color: rgba(229, 62, 62, 0.3);
        }

        .wz-logo {
            display: flex;
            justify-content: center;
            margin-top: 20px;
            opacity: 0.8;
        }

        .wz-logo-text {
            font-size: 14px;
            color: #718096;
            font-weight: 600;
        }

        .wz-pulse {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #38a169;
            border-radius: 50%;
            margin-left: 10px;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.7; }
        }

        .wz-save-indicator {
            position: absolute;
            top: 8px;
            right: 8px;
            font-size: 13px;
            color: #38a169;
            opacity: 0;
            transition: opacity 0.3s;
            font-weight: 600;
            background: rgba(56, 161, 105, 0.15);
            padding: 3px 8px;
            border-radius: 20px;
        }

        .wz-save-indicator.show {
            opacity: 1;
        }

        .wz-refresh-icon {
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 24px;
            color: #4f46e5;
            animation: spin 1.5s linear infinite;
            display: none;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `);

    // 保存数据到本地存储
    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        showSaveIndicator();
    }

    // 显示保存指示器
    function showSaveIndicator() {
        const indicator = document.getElementById('wz-save-indicator');
        if (indicator) {
            indicator.classList.add('show');
            setTimeout(() => indicator.classList.remove('show'), 1000);
        }
    }

    // 从本地存储加载数据
    function loadData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }

    // 主函数
    function initRefresher() {
        // 创建UI容器
        const container = document.createElement('div');
        container.id = 'wz-refresher-container';
        container.innerHTML = `
            <div class="wz-refresh-icon">🔄</div>
            <div class="wz-refresher-header">
                <div class="wz-refresher-title">
                    <i>🔥</i> 801微赞网页刷新器
                </div>
                <button class="wz-refresher-close">×</button>
            </div>

            <div class="wz-input-group">
                <label class="wz-input-label">
                    <i>⚡</i> 当前倍数
                </label>
                <input type="number" id="wz-multiplier" class="wz-input" min="1" value="1" placeholder="每次刷新增加的热度倍数">
            </div>

            <div class="wz-input-group">
                <label class="wz-input-label">
                    <i>🎯</i> 目标热度
                </label>
                <input type="number" id="wz-target-heat" class="wz-input" placeholder="达到此热度后停止">
            </div>

            <div class="wz-input-group">
                <label class="wz-input-label">
                    <i>⏱️</i> 停止时间
                </label>
                <input type="datetime-local" id="wz-stop-time" class="wz-input">
            </div>

            <button id="wz-start-btn" class="wz-button wz-button-primary">
                <i>▶️</i> 开始刷新
            </button>
            <button id="wz-stop-btn" class="wz-button wz-button-stop">
                <i>⏹️</i> 停止刷新
            </button>

            <div class="wz-stats-container">
                <div class="wz-stats-title">
                    <i>📊</i> 统计信息
                </div>
                <div class="wz-stats-grid">
                    <div class="wz-stat">
                        <div class="wz-stat-value" id="wz-current-heat">0</div>
                        <div class="wz-stat-label">当前热度</div>
                    </div>
                    <div class="wz-stat">
                        <div class="wz-stat-value" id="wz-refresh-count">0</div>
                        <div class="wz-stat-label">刷新次数</div>
                    </div>
                    <div class="wz-stat">
                        <div class="wz-stat-value" id="wz-time-left">--:--</div>
                        <div class="wz-stat-label">剩余时间</div>
                    </div>
                    <div class="wz-stat">
                        <div class="wz-stat-value" id="wz-next-refresh">0s</div>
                        <div class="wz-stat-label">下次刷新</div>
                    </div>
                </div>
            </div>

            <div id="wz-status" class="wz-status">准备就绪</div>

            <div class="wz-logo">
                <div class="wz-logo-text">微赞网页刷新器 v4.0 | 数据已本地保存</div>
            </div>

            <div id="wz-save-indicator" class="wz-save-indicator">✓ 已保存</div>
        `;

        document.body.appendChild(container);

        // 获取DOM元素
        const currentHeatEl = document.getElementById('wz-current-heat');
        const refreshCountEl = document.getElementById('wz-refresh-count');
        const timeLeftEl = document.getElementById('wz-time-left');
        const nextRefreshEl = document.getElementById('wz-next-refresh');
        const startBtn = document.getElementById('wz-start-btn');
        const stopBtn = document.getElementById('wz-stop-btn');
        const closeBtn = container.querySelector('.wz-refresher-close');
        const statusEl = document.getElementById('wz-status');
        const multiplierInput = document.getElementById('wz-multiplier');
        const targetHeatInput = document.getElementById('wz-target-heat');
        const stopTimeInput = document.getElementById('wz-stop-time');
        const refreshIcon = container.querySelector('.wz-refresh-icon');

        // 状态变量
        let refreshInterval = null;
        let refreshCount = 0;
        let startTime = null;
        let stopTime = null;
        let targetHeat = null;
        let multiplier = 1;
        let isRunning = false;
        let nextRefreshTime = null;

        // 从本地存储加载数据
        function loadSavedData() {
            const savedData = loadData();
            if (savedData) {
                multiplierInput.value = savedData.multiplier || 1;
                targetHeatInput.value = savedData.targetHeat || '';
                stopTimeInput.value = savedData.stopTime || '';
                refreshCount = savedData.refreshCount || 0;
                startTime = savedData.startTime || null;
                stopTime = savedData.stopTime ? new Date(savedData.stopTime).getTime() : null;
                isRunning = savedData.isRunning || false;
                nextRefreshTime = savedData.nextRefreshTime || null;

                refreshCountEl.textContent = refreshCount;

                if (isRunning) {
                    // 如果之前是运行状态，重新开始
                    startRefreshing(true);
                }
            }
        }

        // 保存当前状态
        function saveCurrentState() {
            const data = {
                multiplier: multiplier,
                targetHeat: targetHeat,
                stopTime: stopTimeInput.value,
                refreshCount: refreshCount,
                startTime: startTime,
                isRunning: isRunning,
                nextRefreshTime: nextRefreshTime
            };
            saveData(data);
        }

        // 更新当前热度 - 修复版本
        function updateCurrentHeat() {
            try {
                // 修复选择器问题
                const heatElement = document.querySelector('.live-info__item:has(.iconguankan2) p');

                if (!heatElement) {
                    // 备用选择器
                    const items = document.querySelectorAll('.live-info__item');
                    for (const item of items) {
                        const icon = item.querySelector('.iconguankan2');
                        if (icon) {
                            const p = item.querySelector('p');
                            if (p) {
                                const heat = parseInt(p.textContent.trim()) || 0;
                                currentHeatEl.textContent = heat;
                                return heat;
                            }
                        }
                    }
                } else {
                    const heat = parseInt(heatElement.textContent.trim()) || 0;
                    currentHeatEl.textContent = heat;
                    return heat;
                }
            } catch (e) {
                console.error('获取热度失败:', e);
            }
            return 0;
        }

        // 实际刷新页面
        function performPageRefresh() {
            // 显示刷新动画
            refreshIcon.style.display = 'block';

            // 保存当前状态
            saveCurrentState();

            // 模拟刷新延迟
            setTimeout(() => {
                // 实际刷新页面
                location.reload();
            }, 500);
        }

        // 开始刷新
        function startRefreshing(fromLoad = false) {
            if (isRunning && !fromLoad) return;

            // 获取输入值
            multiplier = parseInt(multiplierInput.value) || 1;
            targetHeat = parseInt(targetHeatInput.value) || null;
            stopTime = stopTimeInput.value ? new Date(stopTimeInput.value).getTime() : null;

            // 验证输入
            if (!targetHeat && !stopTime && !fromLoad) {
                showStatus('请设置目标热度或停止时间', 'stopped');
                return;
            }

            // 重置状态
            if (!fromLoad) {
                refreshCount = 0;
                startTime = Date.now();
            }
            isRunning = true;

            // 更新UI
            startBtn.disabled = true;
            statusEl.className = 'wz-status running';
            statusEl.innerHTML = '刷新中... <span class="wz-pulse"></span>';

            // 清除之前的定时器
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }

            // 开始刷新循环
            refreshInterval = setInterval(() => {
                // 保存下一次刷新时间
                nextRefreshTime = Date.now() + 3000;

                // 更新刷新次数
                refreshCount++;
                refreshCountEl.textContent = refreshCount;

                // 更新下次刷新时间
                updateNextRefreshTime();

                // 检查停止条件
                const currentHeat = updateCurrentHeat();
                const currentTime = Date.now();

                // 保存当前状态
                saveCurrentState();

                // 检查目标热度
                if (targetHeat && currentHeat >= targetHeat) {
                    stopRefreshing(`已达到目标热度: ${targetHeat}`);
                    return;
                }

                // 检查停止时间
                if (stopTime && currentTime >= stopTime) {
                    stopRefreshing(`已到达停止时间`);
                    return;
                }

                // 计算剩余时间
                if (stopTime) {
                    const remaining = Math.floor((stopTime - currentTime) / 1000);
                    const minutes = Math.floor(remaining / 60);
                    const seconds = remaining % 60;
                    timeLeftEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }

                // 执行实际页面刷新
                performPageRefresh();

            }, 3000); // 每3秒刷新一次

            // 初始更新
            updateCurrentHeat();
            updateNextRefreshTime();

            // 保存状态
            saveCurrentState();
        }

        // 更新下次刷新时间
        function updateNextRefreshTime() {
            if (refreshInterval && nextRefreshTime) {
                const next = Math.floor((nextRefreshTime - Date.now()) / 1000);
                if (next > 0) {
                    nextRefreshEl.textContent = `${next}s`;
                } else {
                    nextRefreshEl.textContent = '0s';
                }
            } else {
                nextRefreshEl.textContent = '0s';
            }
        }

        // 停止刷新
        function stopRefreshing(message = '已停止刷新') {
            if (!isRunning) return;

            if (refreshInterval) {
                clearInterval(refreshInterval);
                refreshInterval = null;
            }
            isRunning = false;

            // 更新UI
            startBtn.disabled = false;
            statusEl.className = 'wz-status stopped';
            statusEl.textContent = message;

            // 重置计时器显示
            nextRefreshEl.textContent = '0s';

            // 保存状态
            saveCurrentState();
        }

        // 显示状态
        function showStatus(message, type = '') {
            statusEl.className = `wz-status ${type}`;
            statusEl.textContent = message;
            setTimeout(() => {
                if (!isRunning) {
                    statusEl.className = 'wz-status';
                    statusEl.textContent = '';
                }
            }, 3000);
        }

        // 事件监听
        startBtn.addEventListener('click', () => startRefreshing(false));
        stopBtn.addEventListener('click', () => stopRefreshing('已手动停止'));
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
        });

        // 输入变化时保存数据
        multiplierInput.addEventListener('input', saveCurrentState);
        targetHeatInput.addEventListener('input', saveCurrentState);
        stopTimeInput.addEventListener('input', saveCurrentState);

        // 初始化当前热度
        updateCurrentHeat();

        // 设置默认停止时间（1小时后）
        const now = new Date();
        now.setHours(now.getHours() + 1);
        stopTimeInput.value = now.toISOString().slice(0, 16);

        // 从本地存储加载数据
        loadSavedData();

        // 每秒更新下次刷新时间
        setInterval(() => {
            if (isRunning) {
                updateNextRefreshTime();
            }
        }, 500);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        initRefresher();
    } else {
        window.addEventListener('load', initRefresher);
    }
})();