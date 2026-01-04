// ==UserScript==
// @name         Enhanced Hourglass Timer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  An enhanced hourglass timer with multiple timer management and visualization. 修复网站兼容性问题，防止干扰其他网站功能
// @author       Your name
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @exclude      *://tonybb23-wui.hf.space/*
// @exclude      *://web.telegram.org/*
// @exclude      *://free-api.ldo.pics/*
// @downloadURL https://update.greasyfork.org/scripts/529518/Enhanced%20Hourglass%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/529518/Enhanced%20Hourglass%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在iframe中
    if (window.self !== window.top) {
        // 在iframe中，不执行脚本
        return;
    }

    // 定义唯一的黄色
    const YELLOW = '#f1c40f';
    
    // 定义CSS命名空间前缀，避免样式冲突
    const PREFIX = 'eht-';

    // 样式定义，添加了命名空间前缀
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        #${PREFIX}enhanced-hourglass-button {
            position: fixed;
            bottom: 33%;
            right: 20px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            color: #3498db;
            border: 1px solid rgba(52, 152, 219, 0.3);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.2s ease;
            backdrop-filter: blur(2px);
            user-select: none;
            cursor: pointer;
        }

        #${PREFIX}enhanced-hourglass-button:hover {
            background: rgba(255, 255, 255, 0.6);
        }

        #${PREFIX}enhanced-hourglass-button.active {
            background: rgba(231, 76, 60, 0.2);
            color: #e74c3c;
            transform: rotate(180deg);
        }

        #${PREFIX}enhanced-hourglass-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.98);
            z-index: 9998;
            font-family: 'Poppins', sans-serif;
            display: none;
            overflow-y: auto;
        }

        .${PREFIX}hourglass-content {
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
            position: relative;
        }

        .${PREFIX}hourglass-header, .${PREFIX}hourglass-controls, .${PREFIX}hourglass-presets {
            background: #fff;
            padding: 20px;
            border-radius: 20px;
            margin-bottom: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .${PREFIX}hourglass-header {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        }

        .${PREFIX}hourglass-title {
            margin: 0;
            font-size: 24px;
            color: #333;
            font-weight: 600;
        }

        .${PREFIX}hourglass-controls {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
        }

        .${PREFIX}hourglass-controls .${PREFIX}btn {
            flex: 1;
            min-width: 0;
            padding: 10px;
            margin: 0;
            text-align: center;
        }

        .${PREFIX}hourglass-presets h3 {
            margin-top: 0;
            font-size: 20px;
            color: #333;
            font-weight: 500;
            margin-bottom: 20px;
        }

        .${PREFIX}preset-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }

        .${PREFIX}preset-buttons .${PREFIX}btn {
            flex: 1;
            min-width: 120px;
        }

        .${PREFIX}hourglass-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }

        .${PREFIX}hourglass-item {
            background: #fff;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
            padding: 15px;
            transition: all 0.3s ease;
            cursor: move;
            position: relative;
            overflow: hidden;
        }

        .${PREFIX}hourglass-item:hover {
            transform: translateY(-3px);
        }

        .${PREFIX}hourglass-item.${PREFIX}dragging {
            opacity: 0.7;
            transform: scale(0.95);
        }

        .${PREFIX}hourglass-item.${PREFIX}drag-over {
            border: 2px dashed #3498db;
        }

        /* 沙漏视觉效果 */
        .${PREFIX}hourglass-visual {
            position: relative;
            width: 50px;
            height: 80px;
            margin: 10px auto;
        }

        .${PREFIX}hourglass-top, .${PREFIX}hourglass-bottom {
            position: absolute;
            width: 100%;
            height: 47%;
            background: rgba(240, 240, 240, 0.8);
            overflow: hidden;
            border-radius: 8px;
        }

        .${PREFIX}hourglass-top {
            top: 0;
            clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .${PREFIX}hourglass-bottom {
            bottom: 0;
            clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
            border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .${PREFIX}sand {
            position: absolute;
            width: 100%;
            background: currentColor;
            transition: height 1s linear;
        }

        .${PREFIX}sand-top {
            top: 0;
            clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
            color: ${YELLOW};
        }

        .${PREFIX}sand-bottom {
            bottom: 0;
            clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
            color: ${YELLOW}; /* 修改为黄色 */
        }

        .${PREFIX}sand-flow {
            position: absolute;
            width: 2px;
            left: 50%;
            height: 60%;
            top: 20%;
            transform: translateX(-50%);
            background: ${YELLOW};
            opacity: 0.7;
        }

        .${PREFIX}progress-bar {
            height: 4px;
            background: #f0f0f0;
            border-radius: 2px;
            overflow: hidden;
            margin: 8px 0;
        }

        .${PREFIX}progress-fill {
            height: 100%;
            background: ${YELLOW};
            transition: width 0.5s ease;
        }

        .${PREFIX}time-display {
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            color: #333;
            margin: 10px 0;
        }

        .${PREFIX}timer-info {
            padding: 10px;
            margin: 8px 0;
            background: rgba(240, 240, 250, 0.5);
            border-radius: 10px;
            font-size: 13px;
        }

        .${PREFIX}timer-info p {
            margin: 5px 0;
            font-size: 13px;
            color: #555;
        }

        .${PREFIX}linked-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 10px;
            background: rgba(52, 152, 219, 0.1);
            border-radius: 10px;
            font-size: 12px;
            color: #3498db;
            margin-top: 8px;
        }

        .${PREFIX}linked-badge:before {
            content: '🔗';
            margin-right: 5px;
        }

        .${PREFIX}status-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 500;
            color: white;
        }

        .${PREFIX}status-badge.${PREFIX}running {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
        }

        .${PREFIX}status-badge.${PREFIX}paused {
            background: linear-gradient(135deg, ${YELLOW}, #f39c12);
        }

        .${PREFIX}status-badge.${PREFIX}completed {
            background: linear-gradient(135deg, #3498db, #2980b9);
        }

        .${PREFIX}timer-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }

        .${PREFIX}btn {
            padding: 8px 12px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
            font-size: 13px;
            font-weight: 500;
        }

        .${PREFIX}btn-primary {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
        }

        .${PREFIX}btn-danger {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
        }

        .${PREFIX}btn-warning {
            background: linear-gradient(135deg, ${YELLOW}, #f39c12);
            color: white;
        }

        .${PREFIX}modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            backdrop-filter: blur(3px);
        }

        .${PREFIX}modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 25px;
            border-radius: 15px;
            width: 400px;
            max-width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .${PREFIX}form-group {
            margin-bottom: 15px;
        }

        .${PREFIX}form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
            font-size: 14px;
        }

        .${PREFIX}form-group input, .${PREFIX}form-group select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 10px;
            font-size: 14px;
            font-family: 'Poppins', sans-serif;
        }

        .${PREFIX}error {
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            font-weight: 400;
        }
    `;

    // Timer 类（增加 startTime 属性，采用基于时间戳的计算恢复状态）
    class Timer {
        constructor(config) {
            this.id = Date.now();
            this.name = config.name;
            this.duration = config.duration;
            this.unit = config.unit;
            this.repeat = config.repeat || 'none';
            this.totalSeconds = this.duration * (this.unit === 'minutes' ? 60 : 3600);
            this.remainingTime = this.totalSeconds;
            this.isRunning = false;
            this.isPaused = false;
            this.isCompleted = false;
            this.linkedTimer = null;
            this.lastCompletionDate = null;
            this.startTime = null; // 记录启动或恢复时的时间戳
        }

        start() {
            if (!this.isRunning && !this.isCompleted) {
                this.isRunning = true;
                this.isPaused = false;
                if (!this.startTime) {
                    this.startTime = Date.now();
                }
                this.tick();
            }
        }

        pause() {
            if(this.isRunning) {
                // 根据已过去的时间更新剩余时间
                let elapsed = (Date.now() - this.startTime) / 1000;
                this.remainingTime = Math.max(0, this.remainingTime - elapsed);
                this.startTime = null;
                this.isPaused = true;
                this.isRunning = false;
            }
        }

        resume() {
            if (this.isPaused && !this.isCompleted) {
                this.isRunning = true;
                this.isPaused = false;
                this.startTime = Date.now();
                this.tick();
            }
        }

        reset() {
            this.remainingTime = this.totalSeconds;
            this.isRunning = false;
            this.isPaused = false;
            this.isCompleted = false;
            this.startTime = null;
        }

        tick() {
            if (!this.isRunning) return;
            let elapsed = (Date.now() - this.startTime) / 1000;
            let effectiveRemaining = this.remainingTime - elapsed;
            if (effectiveRemaining > 0) {
                setTimeout(() => this.tick(), 1000);
            } else {
                this.remainingTime = 0;
                this.isCompleted = true;
                this.isRunning = false;
                this.startTime = null;
                this.lastCompletionDate = new Date();

                // 通知应用计时器已完成
                const app = window.hourglassApp;
                if (app) {
                    app.hasCompletedTimer = true;
                    const button = document.getElementById(`${PREFIX}enhanced-hourglass-button`);
                    if (button) {
                        button.innerHTML = '✅';
                    }
                    app.removeCompletedTimer(this); // 完成后自动删除计时器
                }

                GM_notification({
                    title: '计时器完成',
                    text: `${this.name} 已完成！`,
                    timeout: 5000
                });

                if (this.repeat === 'continuous') {
                    this.reset();
                    this.start();
                } else if (this.repeat === 'daily') {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(0, 0, 0, 0);
                    const delay = tomorrow.getTime() - Date.now();
                    setTimeout(() => {
                        this.reset();
                        this.start();
                    }, delay);
                } else if (this.linkedTimer) {
                    this.linkedTimer.start();
                }
            }
        }

        getEffectiveRemaining() {
            if (this.isRunning && this.startTime) {
                let elapsed = (Date.now() - this.startTime) / 1000;
                return Math.max(0, this.remainingTime - elapsed);
            }
            return this.remainingTime;
        }

        getFormattedTime() {
            const remaining = Math.floor(this.getEffectiveRemaining());
            const hours = Math.floor(remaining / 3600);
            const minutes = Math.floor((remaining % 3600) / 60);
            const seconds = remaining % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        getProgress() {
            return ((this.totalSeconds - this.getEffectiveRemaining()) / this.totalSeconds) * 100;
        }

        setLinkedTimer(timer) {
            this.linkedTimer = timer;
        }

        removeLinkedTimer() {
            this.linkedTimer = null;
        }

        getLinkedTimerId() {
            return this.linkedTimer ? this.linkedTimer.id : null;
        }

        toJSON() {
            return {
                id: this.id,
                name: this.name,
                duration: this.duration,
                unit: this.unit,
                repeat: this.repeat,
                remainingTime: this.isRunning ? this.getEffectiveRemaining() : this.remainingTime,
                isRunning: this.isRunning,
                isPaused: this.isPaused,
                isCompleted: this.isCompleted,
                linkedTimerId: this.getLinkedTimerId(),
                lastCompletionDate: this.lastCompletionDate,
                startTime: this.startTime
            };
        }
    }

    // 主应用类
    class EnhancedHourglassTimer {
        constructor() {
            this.timers = [];
            this.presets = [
                { name: "25分钟番茄钟", duration: 25, unit: "minutes", repeat: "none" },
                { name: "5分钟休息", duration: 5, unit: "minutes", repeat: "none" },
                { name: "15分钟会议", duration: 15, unit: "minutes", repeat: "none" },
                { name: "1小时专注", duration: 1, unit: "hours", repeat: "none" }
            ];
            this.draggedTimer = null;
            this.updateInterval = null;
            this.isVisible = false;
            this.hasCompletedTimer = false;
            this.init();
        }

        init() {
            this.createUI();
            this.loadData();
            this.attachEventListeners();
            this.startAutoUpdate();
            this.checkDailyTimers();

            // 在页面卸载前保存数据，防止刷新/新标签页时数据丢失
            window.addEventListener('beforeunload', () => {
                this.saveData();
            });
        }

        startAutoUpdate() {
            this.updateInterval = setInterval(() => this.updateUI(), 1000);
        }

        createUI() {
            // 创建浮动按钮
            const button = document.createElement('button');
            button.id = `${PREFIX}enhanced-hourglass-button`;
            button.innerHTML = '⌛';
            button.title = '显示/隐藏计时器面板';
            document.body.appendChild(button);

            button.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault(); // 阻止默认行为
                if (this.hasCompletedTimer) {
                    this.hasCompletedTimer = false;
                    button.innerHTML = '⌛';
                }
                this.togglePanel();
                return false; // 防止事件传播
            });

            // 创建主容器
            const container = document.createElement('div');
            container.id = `${PREFIX}enhanced-hourglass-container`;
            container.innerHTML = `
                <div class="${PREFIX}hourglass-content">
                    <div class="${PREFIX}hourglass-header">
                        <h2 class="${PREFIX}hourglass-title">增强型沙漏计时器</h2>
                    </div>

                    <div class="${PREFIX}hourglass-controls">
                        <button class="${PREFIX}btn ${PREFIX}btn-primary" id="${PREFIX}add-timer">添加计时器</button>
                        <button class="${PREFIX}btn ${PREFIX}btn-primary" id="${PREFIX}pause-all">全部暂停</button>
                        <button class="${PREFIX}btn ${PREFIX}btn-danger" id="${PREFIX}reset-all">全部重置</button>
                        <button class="${PREFIX}btn ${PREFIX}btn-danger" id="${PREFIX}clear-all">全部清除</button>
                        <button class="${PREFIX}btn ${PREFIX}btn-primary" id="${PREFIX}export-data">导出数据</button>
                        <input type="file" id="${PREFIX}import-file" accept=".json" style="display: none;">
                        <button class="${PREFIX}btn ${PREFIX}btn-primary" id="${PREFIX}import-data">导入数据</button>
                    </div>

                    <div class="${PREFIX}hourglass-presets">
                        <h3>快速预设</h3>
                        <div class="${PREFIX}preset-buttons">
                            ${this.presets.map(preset => `
                                <button class="${PREFIX}btn ${PREFIX}btn-primary" data-preset='${JSON.stringify(preset)}'>
                                    ${preset.name}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="${PREFIX}hourglass-grid" id="${PREFIX}timer-grid"></div>
                </div>

                <div class="${PREFIX}modal" id="${PREFIX}add-timer-modal">
                    <div class="${PREFIX}modal-content">
                        <h3>添加新计时器</h3>
                        <form id="${PREFIX}timer-form">
                            <div class="${PREFIX}form-group">
                                <label for="${PREFIX}timer-name">名称</label>
                                <input type="text" id="${PREFIX}timer-name" required>
                                <div class="${PREFIX}error" id="${PREFIX}name-error"></div>
                            </div>
                            <div class="${PREFIX}form-group">
                                <label for="${PREFIX}timer-duration">时长</label>
                                <input type="number" id="${PREFIX}timer-duration" min="1" required>
                                <div class="${PREFIX}error" id="${PREFIX}duration-error"></div>
                            </div>
                            <div class="${PREFIX}form-group">
                                <label for="${PREFIX}timer-unit">单位</label>
                                <select id="${PREFIX}timer-unit">
                                    <option value="minutes">分钟</option>
                                    <option value="hours">小时</option>
                                </select>
                            </div>
                            <div class="${PREFIX}form-group">
                                <label for="${PREFIX}timer-repeat">重复模式</label>
                                <select id="${PREFIX}timer-repeat">
                                    <option value="none">不重复</option>
                                    <option value="continuous">持续重复</option>
                                    <option value="daily">每日重复</option>
                                </select>
                            </div>
                            <button type="submit" class="${PREFIX}btn ${PREFIX}btn-primary">创建计时器</button>
                            <button type="button" class="${PREFIX}btn ${PREFIX}btn-danger" id="${PREFIX}cancel-timer">取消</button>
                        </form>
                    </div>
                </div>
            `;
            document.body.appendChild(container);
            GM_addStyle(styles);
            
            // 创建事件隔离层，防止事件传播到页面其他元素
            container.addEventListener('click', e => {
                e.stopPropagation();
            });
            
            container.addEventListener('mousedown', e => {
                e.stopPropagation();
            });
            
            container.addEventListener('keydown', e => {
                // 阻止除了Tab和Escape之外的键盘事件传播
                if (e.key !== 'Tab' && e.key !== 'Escape') {
                    e.stopPropagation();
                }
            });
            
            // 允许面板内部滚动
            container.addEventListener('wheel', e => {
                e.stopPropagation();
            }, { passive: true });
        }

        attachEventListeners() {
            document.getElementById(`${PREFIX}add-timer`).addEventListener('click', (e) => {
                e.stopPropagation();
                this.showAddTimerModal();
            });
            document.getElementById(`${PREFIX}pause-all`).addEventListener('click', (e) => {
                e.stopPropagation();
                this.pauseAllTimers();
            });
            document.getElementById(`${PREFIX}reset-all`).addEventListener('click', (e) => {
                e.stopPropagation();
                this.resetAllTimers();
            });
            document.getElementById(`${PREFIX}clear-all`).addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearAllTimers();
            });

            document.querySelectorAll(`.${PREFIX}preset-buttons .${PREFIX}btn`).forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const preset = JSON.parse(e.target.dataset.preset);
                    const timer = new Timer(preset);
                    this.timers.push(timer);
                    this.saveData();
                    this.updateUI();
                });
            });

            document.getElementById(`${PREFIX}export-data`).addEventListener('click', (e) => {
                e.stopPropagation();
                this.exportData();
            });
            document.getElementById(`${PREFIX}import-data`).addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById(`${PREFIX}import-file`).click();
            });
            document.getElementById(`${PREFIX}import-file`).addEventListener('change', (e) => {
                e.stopPropagation();
                this.importData(e);
            });

            // 修改快捷键：Ctrl+Shift+H 切换计时器面板，避免与网站原有快捷键冲突
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                    e.stopPropagation();
                    e.preventDefault();
                    this.togglePanel();
                }
            });
            
            // 点击面板外部区域关闭面板
            document.addEventListener('click', (e) => {
                if (this.isVisible && !e.target.closest(`#${PREFIX}enhanced-hourglass-container`) && 
                   !e.target.closest(`#${PREFIX}enhanced-hourglass-button`)) {
                    this.togglePanel();
                }
            }, { capture: true });
        }

        togglePanel() {
            const button = document.getElementById(`${PREFIX}enhanced-hourglass-button`);
            const container = document.getElementById(`${PREFIX}enhanced-hourglass-container`);
            this.isVisible = !this.isVisible;
            container.style.display = this.isVisible ? 'block' : 'none';
            button.classList.toggle('active', this.isVisible);
            
            // 不再阻止页面滚动，改为使面板内容可滚动
            // document.body.style.overflow = this.isVisible ? 'hidden' : '';
        }

        loadData() {
            const savedData = GM_getValue('hourglassData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.timers = data.map(timerData => {
                    const timer = new Timer({
                        name: timerData.name,
                        duration: timerData.duration,
                        unit: timerData.unit,
                        repeat: timerData.repeat
                    });
                    timer.id = timerData.id;
                    timer.remainingTime = timerData.remainingTime;
                    timer.isRunning = timerData.isRunning;
                    timer.isPaused = timerData.isPaused;
                    timer.isCompleted = timerData.isCompleted;
                    timer.lastCompletionDate = timerData.lastCompletionDate;
                    timer.startTime = timerData.startTime;
                    return timer;
                });

                // 调整正在运行的计时器，计算刷新期间经过的时间
                this.timers.forEach(timer => {
                    if (timer.isRunning && timer.startTime) {
                        let elapsed = (Date.now() - timer.startTime) / 1000;
                        timer.remainingTime = Math.max(0, timer.remainingTime - elapsed);
                        timer.startTime = Date.now(); // 重置开始时间
                        if (timer.remainingTime <= 0) {
                            timer.isCompleted = true;
                            timer.isRunning = false;
                        } else {
                            timer.start();
                        }
                    }
                });

                // 恢复计时器链接
                data.forEach((timerData, index) => {
                    if (timerData.linkedTimerId) {
                        const linkedTimer = this.timers.find(t => t.id === timerData.linkedTimerId);
                        if (linkedTimer) {
                            this.timers[index].setLinkedTimer(linkedTimer);
                        }
                    }
                });
            }
        }

        saveData() {
            GM_setValue('hourglassData', JSON.stringify(this.timers));
        }

        showAddTimerModal() {
            const modal = document.getElementById(`${PREFIX}add-timer-modal`);
            modal.style.display = 'block';
            const form = document.getElementById(`${PREFIX}timer-form`);
            const cancelBtn = document.getElementById(`${PREFIX}cancel-timer`);

            const closeModal = () => {
                modal.style.display = 'none';
                form.reset();
            };

            cancelBtn.onclick = (e) => {
                e.stopPropagation();
                closeModal();
            };
            modal.onclick = (e) => {
                e.stopPropagation();
                if (e.target === modal) closeModal();
            };

            form.onsubmit = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const name = document.getElementById(`${PREFIX}timer-name`).value;
                const duration = parseInt(document.getElementById(`${PREFIX}timer-duration`).value);
                const unit = document.getElementById(`${PREFIX}timer-unit`).value;
                const repeat = document.getElementById(`${PREFIX}timer-repeat`).value;
                if (!this.validateTimerForm(name, duration)) return;
                const timer = new Timer({ name, duration, unit, repeat });
                this.timers.push(timer);
                this.saveData();
                this.updateUI();
                closeModal();
            };
        }

        validateTimerForm(name, duration) {
            let isValid = true;
            const nameError = document.getElementById(`${PREFIX}name-error`);
            const durationError = document.getElementById(`${PREFIX}duration-error`);
            nameError.textContent = '';
            durationError.textContent = '';
            if (!name.trim()) {
                nameError.textContent = '名称不能为空';
                isValid = false;
            }
            if (isNaN(duration) || duration < 1) {
                durationError.textContent = '时长必须是正数';
                isValid = false;
            }
            return isValid;
        }

        pauseAllTimers() {
            this.timers.forEach(timer => {
                if (timer.isRunning) {
                    timer.pause();
                }
            });
            this.updateUI();
        }

        resetAllTimers() {
            this.timers.forEach(timer => timer.reset());
            this.updateUI();
        }

        clearAllTimers() {
            this.timers = [];
            this.saveData();
            this.updateUI();
        }

        updateUI() {
            const grid = document.getElementById(`${PREFIX}timer-grid`);
            grid.innerHTML = '';
            this.timers.forEach(timer => {
                const timerElement = this.createTimerElement(timer);
                grid.appendChild(timerElement);
            });
        }

        createTimerElement(timer) {
            const element = document.createElement('div');
            element.className = `${PREFIX}hourglass-item`;
            element.setAttribute('draggable', true);
            element.setAttribute('data-timer-id', timer.id);

            const statusBadge = timer.isRunning ?
                `<div class="${PREFIX}status-badge ${PREFIX}running">运行中</div>` :
                timer.isPaused ?
                    `<div class="${PREFIX}status-badge ${PREFIX}paused">已暂停</div>` :
                    timer.isCompleted ?
                        `<div class="${PREFIX}status-badge ${PREFIX}completed">已完成</div>` : '';

            const progress = timer.getProgress();
            const hourglassVisual = `
                <div class="${PREFIX}hourglass-visual">
                    <div class="${PREFIX}hourglass-container">
                        <div class="${PREFIX}hourglass-top">
                            <div class="${PREFIX}sand ${PREFIX}sand-top" style="height: ${100 - progress}%"></div>
                        </div>
                        ${timer.isRunning ? `<div class="${PREFIX}sand-flow"></div>` : ''}
                        <div class="${PREFIX}hourglass-bottom">
                            <div class="${PREFIX}sand ${PREFIX}sand-bottom" style="height: ${progress}%; color: ${YELLOW};"></div>
                        </div>
                    </div>
                </div>
            `;

            element.innerHTML = `
                ${statusBadge}
                <h3>${timer.name}</h3>
                ${hourglassVisual}
                <div class="${PREFIX}time-display">${timer.getFormattedTime()}</div>
                <div class="${PREFIX}progress-bar">
                    <div class="${PREFIX}progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="${PREFIX}timer-info">
                    <p><strong>重复:</strong> ${this.translateRepeat(timer.repeat)}</p>
                    ${timer.linkedTimer ?
                      `<div class="${PREFIX}linked-badge">链接到: ${timer.linkedTimer.name}</div>` : ''}
                </div>
                <div class="${PREFIX}timer-controls">
                    <button class="${PREFIX}btn ${PREFIX}btn-primary ${PREFIX}start-pause">
                        ${timer.isRunning ? '暂停' : '开始'}
                    </button>
                    <button class="${PREFIX}btn ${PREFIX}btn-danger ${PREFIX}reset">重置</button>
                    <button class="${PREFIX}btn ${PREFIX}btn-danger ${PREFIX}delete">删除</button>
                    ${timer.linkedTimer ?
                      `<button class="${PREFIX}btn ${PREFIX}btn-warning ${PREFIX}unlink">解除链接</button>` : ''}
                </div>
            `;

            this.attachDragEvents(element, timer);
            this.attachTimerControlEvents(element, timer);
            return element;
        }

        attachDragEvents(element, timer) {
            element.addEventListener('dragstart', (e) => {
                e.stopPropagation();
                this.draggedTimer = timer;
                element.classList.add(`${PREFIX}dragging`);
                e.dataTransfer.setData('text/plain', timer.id);
            });
            element.addEventListener('dragend', (e) => {
                e.stopPropagation();
                element.classList.remove(`${PREFIX}dragging`);
                this.draggedTimer = null;
            });
            element.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.draggedTimer && this.draggedTimer !== timer) {
                    element.classList.add(`${PREFIX}drag-over`);
                }
            });
            element.addEventListener('dragleave', (e) => {
                e.stopPropagation();
                element.classList.remove(`${PREFIX}drag-over`);
            });
            element.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                element.classList.remove(`${PREFIX}drag-over`);
                if (this.draggedTimer && this.draggedTimer !== timer) {
                    this.draggedTimer.setLinkedTimer(timer);
                    this.saveData();
                    this.updateUI();
                }
            });
        }

        attachTimerControlEvents(element, timer) {
            const startPauseBtn = element.querySelector(`.${PREFIX}start-pause`);
            const resetBtn = element.querySelector(`.${PREFIX}reset`);
            const deleteBtn = element.querySelector(`.${PREFIX}delete`);
            const unlinkBtn = element.querySelector(`.${PREFIX}unlink`);

            if (startPauseBtn) {
                startPauseBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (timer.isRunning) timer.pause();
                    else if (timer.isPaused) timer.resume();
                    else timer.start();
                    this.updateUI();
                });
            }
            if (resetBtn) {
                resetBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    timer.reset();
                    this.updateUI();
                });
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.timers.forEach(t => {
                        if (t.linkedTimer === timer) {
                            t.removeLinkedTimer();
                        }
                    });
                    this.timers = this.timers.filter(t => t.id !== timer.id);
                    this.saveData();
                    this.updateUI();
                });
            }
            if (unlinkBtn) {
                unlinkBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    timer.removeLinkedTimer();
                    this.saveData();
                    this.updateUI();
                });
            }
        }

        translateRepeat(repeat) {
            const translations = {
                'none': '不重复',
                'continuous': '持续重复',
                'daily': '每日重复'
            };
            return translations[repeat] || repeat;
        }

        exportData() {
            const data = JSON.stringify(this.timers, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'hourglass-timers.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        importData(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        this.timers = data.map(timerData => {
                            const timer = new Timer({
                                name: timerData.name,
                                duration: timerData.duration,
                                unit: timerData.unit,
                                repeat: timerData.repeat
                            });
                            timer.id = timerData.id;
                            timer.remainingTime = timerData.remainingTime;
                            timer.isRunning = false; // 导入时初始化为停止状态
                            timer.isPaused = false;
                            timer.isCompleted = timerData.isCompleted;
                            timer.lastCompletionDate = timerData.lastCompletionDate;
                            timer.startTime = timerData.startTime;
                            return timer;
                        });
                        data.forEach((timerData, index) => {
                            if (timerData.linkedTimerId) {
                                const linkedTimer = this.timers.find(t => t.id === timerData.linkedTimerId);
                                if (linkedTimer) {
                                    this.timers[index].setLinkedTimer(linkedTimer);
                                }
                            }
                        });
                        this.saveData();
                        this.updateUI();
                        alert('导入成功！');
                    } catch (error) {
                        alert('导入失败：无效的文件格式');
                    }
                };
                reader.readAsText(file);
            }
        }

        checkDailyTimers() {
            setInterval(() => {
                const now = new Date();
                this.timers.forEach(timer => {
                    if (timer.repeat === 'daily' && !timer.isRunning) {
                        const lastCompletion = timer.lastCompletionDate ? new Date(timer.lastCompletionDate) : null;
                        if (!lastCompletion || !this.isSameDay(lastCompletion, now)) {
                            timer.reset();
                            timer.start();
                        }
                    }
                });
            }, 60000);
        }

        isSameDay(date1, date2) {
            return date1.getFullYear() === date2.getFullYear() &&
                   date1.getMonth() === date2.getMonth() &&
                   date1.getDate() === date2.getDate();
        }

        removeCompletedTimer(timer) {
            this.timers.forEach(t => {
                if (t.linkedTimer === timer) {
                    t.removeLinkedTimer();
                }
            });
            this.timers = this.timers.filter(t => t.id !== timer.id);
            this.saveData();
            this.updateUI();
        }
    }
    
    // 初始化应用
    const app = new EnhancedHourglassTimer();
    window.hourglassApp = app;
})();