// ==UserScript==
// @name         抖音巨量百应直播中控台自动讲解(优化布局版)
// @namespace    https://github.com/KevinLiu
// @version      1.6
// @description  自动控制直播中控台的讲解按钮，优化布局显示
// @author       KevinLiu
// @match        https://buyin.jinritemai.com/dashboard/live/control*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542101/%E6%8A%96%E9%9F%B3%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E7%9B%B4%E6%92%AD%E4%B8%AD%E6%8E%A7%E5%8F%B0%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3%28%E4%BC%98%E5%8C%96%E5%B8%83%E5%B1%80%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542101/%E6%8A%96%E9%9F%B3%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E7%9B%B4%E6%92%AD%E4%B8%AD%E6%8E%A7%E5%8F%B0%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3%28%E4%BC%98%E5%8C%96%E5%B8%83%E5%B1%80%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #auto-explain-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            width: 420px;  /* 增加宽度 */
            height: auto;  /* 改为自动高度 */
            display: flex;
            flex-direction: column;  /* 改为垂直布局 */
        }
        .control-row {
            display: flex;
            gap: 15px;
            margin-bottom: 12px;
            align-items: center;
        }
        .control-group {
            flex: 1;
            margin-bottom: 0;
        }
        .control-group.compact {
            flex: 0 0 120px;
        }
        .control-group label {
            display: block;
            margin-bottom: 3px;
            font-size: 12px;
            color: #666;
        }
        .control-group input {
            width: 100%;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 3px;
            box-sizing: border-box;
            font-size: 12px;
        }
        #status-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .status-display {
            font-size: 12px;
            display: flex;
            align-items: center;
        }
        .progress-display {
            font-size: 12px;
        }
        .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
        }
        .status-running {
            background-color: #28a745;
        }
        .status-stopped {
            background-color: #dc3545;
        }
        .progress-bar-container {
            width: 100%;
            height: 10px;
            background-color: #e9ecef;
            border-radius: 5px;
            overflow: hidden;
            margin: 5px 0;
        }
        .progress-bar {
            height: 100%;
            background-color: #FE2C55;
            width: 0%;
            transition: width 1s linear;
        }
        #auto-explain-btn {
            width: 100%;
            padding: 8px;
            background-color: #FE2C55;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
            transition: background-color 0.3s;
        }
        #auto-explain-btn:hover {
            background-color: #E51E4A;
        }
        #auto-explain-btn.stop {
            background-color: #6c757d;
        }
        #auto-explain-btn.stop:hover {
            background-color: #5a6268;
        }
    `);

    // 创建控制面板
    const panel = document.createElement('div');
    panel.id = 'auto-explain-panel';
    panel.innerHTML = `
        <div class="control-row">
            <div class="control-group compact">
                <label for="explain-interval">基础间隔(秒)</label>
                <input type="number" id="explain-interval" value="20" min="5">
            </div>
            <div class="control-group compact">
                <label for="random-interval">随机+(秒)</label>
                <input type="number" id="random-interval" value="10" min="0">
            </div>
            <button id="auto-explain-btn">开始自动讲解</button>
        </div>
        <div id="status-section">
            <div class="status-display">
                <span class="status-indicator status-stopped"></span>
                <span id="status-text">已停止</span>
            </div>
            <div class="progress-display">
                循环进度: <span id="current-progress">0/0</span>秒
            </div>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar"></div>
        </div>
    `;
    document.body.appendChild(panel);

    // 获取元素
    const intervalInput = document.getElementById('explain-interval');
    const randomInput = document.getElementById('random-interval');
    const currentProgressDisplay = document.getElementById('current-progress');
    const progressBar = document.querySelector('.progress-bar');
    const startBtn = document.getElementById('auto-explain-btn');
    const statusText = document.getElementById('status-text');
    const statusIndicator = document.querySelector('.status-indicator');

    let timer = null;
    let progressTimer = null;
    let isRunning = false;
    let currentCycleTime = 0;
    let totalCycleTime = 0;

    // 更新进度显示
    function updateProgressDisplay() {
        currentProgressDisplay.textContent = `${currentCycleTime}/${totalCycleTime}`;
        const progressPercent = totalCycleTime > 0 ? (currentCycleTime / totalCycleTime) * 100 : 0;
        progressBar.style.width = `${progressPercent}%`;
    }

    // 启动进度计时器
    function startProgressTimer(totalTime) {
        stopProgressTimer();
        totalCycleTime = totalTime;
        currentCycleTime = 0;
        updateProgressDisplay();

        const startTime = Date.now();

        progressTimer = setInterval(() => {
            if (!isRunning) {
                stopProgressTimer();
                return;
            }

            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            currentCycleTime = Math.min(elapsed, totalCycleTime);
            updateProgressDisplay();

            if (currentCycleTime >= totalCycleTime) {
                stopProgressTimer();
            }
        }, 200);
    }

    // 停止进度计时器
    function stopProgressTimer() {
        if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
        }
        currentCycleTime = 0;
        totalCycleTime = 0;
        updateProgressDisplay();
    }

    // 更新状态显示
    function updateStatusDisplay() {
        if (isRunning) {
            statusText.textContent = '运行中';
            statusIndicator.classList.remove('status-stopped');
            statusIndicator.classList.add('status-running');
        } else {
            statusText.textContent = '已停止';
            statusIndicator.classList.remove('status-running');
            statusIndicator.classList.add('status-stopped');
        }
    }

    // 查找讲解按钮
    function findExplainButton() {
        return document.evaluate(
            '//button[contains(., "讲解") or contains(., "取消讲解")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
    }

    // 生成随机间隔时间
    function generateRandomInterval() {
        const base = parseInt(intervalInput.value) || 20;
        const randomMax = parseInt(randomInput.value) || 10;
        const randomAdd = randomMax > 0 ? Math.floor(Math.random() * randomMax) + 1 : 0;
        return base + randomAdd;
    }

    // 执行讲解操作
    async function performExplain() {
        try {
            const explainBtn = findExplainButton();
            if (!explainBtn) {
                console.warn('未找到讲解按钮');
                return false;
            }

            const isActive = explainBtn.textContent.includes('取消讲解');

            if (isActive) {
                explainBtn.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            explainBtn.click();
            return true;
        } catch (error) {
            console.error('执行讲解出错:', error);
            return false;
        }
    }

    // 开始/停止自动讲解
    async function toggleAutoExplain() {
        if (isRunning) {
            clearTimeout(timer);
            stopProgressTimer();
            isRunning = false;
            startBtn.textContent = '开始自动讲解';
            startBtn.classList.remove('stop');
            updateStatusDisplay();
        } else {
            const base = parseInt(intervalInput.value);
            const randomMax = parseInt(randomInput.value);

            if (base < 5) {
                alert('基础间隔时间不能小于5秒');
                return;
            }

            if (randomMax < 0) {
                alert('随机秒数不能为负数');
                return;
            }

            const success = await performExplain();
            if (!success) {
                alert('未找到讲解按钮，请确认页面已加载完成');
                return;
            }

            const nextInterval = generateRandomInterval();
            startProgressTimer(nextInterval);

            isRunning = true;
            startBtn.textContent = '停止自动讲解';
            startBtn.classList.add('stop');
            updateStatusDisplay();

            scheduleNext();
        }
    }

    // 安排下一次执行
    function scheduleNext() {
        if (!isRunning) return;

        const nextInterval = generateRandomInterval();
        startProgressTimer(nextInterval);

        timer = setTimeout(async () => {
            await performExplain();
            scheduleNext();
        }, nextInterval * 1000);
    }

    // 绑定事件
    startBtn.addEventListener('click', toggleAutoExplain);

    // 输入变化时更新显示
    intervalInput.addEventListener('input', () => {
        if (isRunning) {
            const nextInterval = generateRandomInterval();
            startProgressTimer(nextInterval);
        }
    });

    randomInput.addEventListener('input', () => {
        if (isRunning) {
            const nextInterval = generateRandomInterval();
            startProgressTimer(nextInterval);
        }
    });

    // 初始化状态显示
    updateStatusDisplay();

    // 页面卸载时清理定时器
    window.addEventListener('beforeunload', () => {
        clearTimeout(timer);
        stopProgressTimer();
    });
})();