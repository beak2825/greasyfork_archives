// ==UserScript==
// @name         Enhanced Hourglass Timer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  An enhanced hourglass timer with multiple timer management and visualization
// @author       Your name
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @license MIT
// @require      https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js
// @downloadURL https://update.greasyfork.org/scripts/529491/Enhanced%20Hourglass%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/529491/Enhanced%20Hourglass%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const COLORS = {
        BLUE: '#3498db',
        RED: '#e74c3c',
        GREEN: '#2ecc71',
        YELLOW: '#f1c40f',
        PURPLE: '#9b59b6',
        ORANGE: '#e67e22'
    };

    // Styles
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        #enhanced-hourglass-button {
            position: fixed;
            bottom: 0;
            right: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            color: #3498db;
            border: 1px solid rgba(52, 152, 219, 0.3);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.2s ease;
            backdrop-filter: blur(2px);
            user-select: none;
        }

        #enhanced-hourglass-button:hover {
            background: rgba(255, 255, 255, 0.6);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }

        #enhanced-hourglass-button.active {
            background: rgba(231, 76, 60, 0.2);
            color: #e74c3c;
            transform: rotate(180deg);
        }

        #enhanced-hourglass-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.98);
            z-index: 99999;
            font-family: 'Poppins', sans-serif;
            display: none;
            overflow-y: auto;
        }

        .hourglass-content {
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
            position: relative;
        }

        .hourglass-header {
            background: #fff;
            padding: 20px;
            border-radius: 20px;
            margin-bottom: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            text-align: center;
        }

        .hourglass-title {
            margin: 0;
            font-size: 24px;
            color: #333;
            font-weight: 600;
        }

        .hourglass-controls {
            background: #fff;
            padding: 20px;
            border-radius: 20px;
            margin-bottom: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
        }

        .hourglass-controls .btn {
            flex: 1;
            min-width: 0;
            padding: 10px;
            margin: 0;
            text-align: center;
        }

        .hourglass-presets {
            background: #fff;
            padding: 20px;
            border-radius: 20px;
            margin-bottom: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .hourglass-presets h3 {
            margin-top: 0;
            font-size: 20px;
            color: #333;
            font-weight: 500;
            margin-bottom: 20px;
        }

        .preset-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }

        .preset-buttons .btn {
            flex: 1;
            min-width: 120px;
        }

        .hourglass-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }

        .hourglass-item {
            background: #fff;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
            padding: 15px;
            transition: all 0.3s ease;
            cursor: move;
            position: relative;
            overflow: hidden;
        }

        .hourglass-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .hourglass-item h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #333;
            font-weight: 600;
        }

        .hourglass-item.dragging {
            opacity: 0.7;
            transform: scale(0.95);
        }

        .hourglass-item.drag-over {
            border: 2px dashed #3498db;
            box-shadow: 0 0 20px rgba(52, 152, 219, 0.3);
        }

        /* 沙漏视觉效果和动画 - 简化版 */
        .hourglass-visual {
            position: relative;
            width: 50px;
            height: 80px;
            margin: 10px auto;
        }

        .hourglass-top,
        .hourglass-bottom {
            position: absolute;
            width: 100%;
            height: 47%;
            background: rgba(240, 240, 240, 0.8);
            overflow: hidden;
            border-radius: 8px;
        }

        .hourglass-top {
            top: 0;
            clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .hourglass-bottom {
            bottom: 0;
            clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
            border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .sand {
            position: absolute;
            width: 100%;
            background: currentColor;
            transition: height 1s linear;
        }

        .sand-top {
            top: 0;
            clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
        }

        .sand-bottom {
            bottom: 0;
            clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
        }

        .sand-flow {
            position: absolute;
            width: 2px;
            left: 50%;
            height: 60%;
            top: 20%;
            transform: translateX(-50%);
            background: #f1c40f;
            opacity: 0.7;
        }

        /* 进度条 */
        .progress-bar {
            height: 4px;
            background: #f0f0f0;
            border-radius: 2px;
            overflow: hidden;
            margin: 8px 0;
        }

        .progress-fill {
            height: 100%;
            background: #f1c40f;
            transition: width 0.5s ease;
        }

        /* 时间显示 */
        .time-display {
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            color: #333;
            margin: 10px 0;
        }

        /* 计时器信息 */
        .timer-info {
            padding: 10px;
            margin: 8px 0;
            background: rgba(240, 240, 250, 0.5);
            border-radius: 10px;
            font-size: 13px;
        }

        .timer-info p {
            margin: 5px 0;
            font-size: 13px;
            color: #555;
        }

        /* 链接标签 */
        .linked-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 10px;
            background: rgba(52, 152, 219, 0.1);
            border-radius: 10px;
            font-size: 12px;
            color: #3498db;
            margin-top: 8px;
        }

        .linked-badge:before {
            content: '🔗';
            margin-right: 5px;
        }

        /* 状态标签 */
        .status-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 500;
            color: white;
        }

        .status-badge.running {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
        }

        .status-badge.paused {
            background: linear-gradient(135deg, #f1c40f, #f39c12);
        }

        .status-badge.completed {
            background: linear-gradient(135deg, #3498db, #2980b9);
        }

        /* 控制按钮 */
        .timer-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }

        .btn {
            padding: 8px 12px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
            font-size: 13px;
            font-weight: 500;
        }

        .btn-primary {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            box-shadow: 0 2px 5px rgba(52, 152, 219, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);
        }

        .btn-danger {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            box-shadow: 0 2px 5px rgba(231, 76, 60, 0.3);
        }

        .btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(231, 76, 60, 0.4);
        }

        .btn-warning {
            background: linear-gradient(135deg, #f1c40f, #f39c12);
            color: white;
            box-shadow: 0 2px 5px rgba(241, 196, 15, 0.3);
        }

        .btn-warning:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(241, 196, 15, 0.4);
        }

        /* 模态框 */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 100000;
            backdrop-filter: blur(3px);
        }

        .modal-content {
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

        .modal-content h3 {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 20px;
            color: #333;
            font-weight: 600;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
            font-size: 14px;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
        }

        .form-group input:focus,
        .form-group select:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
            outline: none;
        }

        .error {
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            font-weight: 400;
        }
    `;

    // Timer class
    class Timer {
        constructor(config) {
            this.id = Date.now();
            this.name = config.name;
            this.duration = config.duration;
            this.unit = config.unit;
            this.repeat = config.repeat || 'none';
            this.color = config.color || '#f1c40f'; // 默认黄色
            this.remainingTime = this.getTotalSeconds();
            this.isRunning = false;
            this.isPaused = false;
            this.isCompleted = false;
            this.linkedTimer = null;
            this.lastCompletionDate = null;
        }

        getTotalSeconds() {
            return this.duration * (this.unit === 'minutes' ? 60 : 3600);
        }

        start() {
            if (!this.isRunning && !this.isCompleted) {
                this.isRunning = true;
                this.isPaused = false;
                this.tick();
            }
        }

        pause() {
            this.isPaused = true;
            this.isRunning = false;
        }

        resume() {
            if (this.isPaused) {
                this.isRunning = true;
                this.isPaused = false;
                this.tick();
            }
        }

        reset() {
            this.remainingTime = this.getTotalSeconds();
            this.isRunning = false;
            this.isPaused = false;
            this.isCompleted = false;
        }

        tick() {
            if (!this.isRunning) return;

            if (this.remainingTime > 0) {
                this.remainingTime--;
                setTimeout(() => this.tick(), 1000);
            } else {
                this.isCompleted = true;
                this.isRunning = false;
                this.lastCompletionDate = new Date();

                // 只设置完成标志，不记录统计数据
                const app = window.hourglassApp;
                if (app) {
                    // 设置完成标志，修改按钮为对勾
                    app.hasCompletedTimer = true;
                    const button = document.getElementById('enhanced-hourglass-button');
                    if (button) {
                        button.innerHTML = '✅';
                    }

                    // 从计时器列表中删除已完成的计时器
                    app.removeCompletedTimer(this);
                }

                // 显示通知
                GM_notification({
                    title: '计时器完成',
                    text: `${this.name} 已完成！`,
                    timeout: 5000
                });

                if (this.repeat === 'continuous') {
                    this.reset();
                    this.start();
                } else if (this.repeat === 'daily') {
                    // 安排明天的运行
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

        getFormattedTime() {
            const hours = Math.floor(this.remainingTime / 3600);
            const minutes = Math.floor((this.remainingTime % 3600) / 60);
            const seconds = this.remainingTime % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        getProgress() {
            return ((this.getTotalSeconds() - this.remainingTime) / this.getTotalSeconds()) * 100;
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
                color: this.color,
                remainingTime: this.remainingTime,
                isRunning: this.isRunning,
                isPaused: this.isPaused,
                isCompleted: this.isCompleted,
                linkedTimerId: this.getLinkedTimerId(),
                lastCompletionDate: this.lastCompletionDate
            };
        }

        isSameDay(date1, date2) {
            return date1.getFullYear() === date2.getFullYear() &&
                   date1.getMonth() === date2.getMonth() &&
                   date1.getDate() === date2.getDate();
        }
    }

    // Main class
    class EnhancedHourglassTimer {
        constructor() {
            this.timers = [];
            this.presets = [
                {
                    name: "25分钟番茄钟",
                    duration: 25,
                    unit: "minutes",
                    repeat: "none",
                    color: "#f1c40f"
                },
                {
                    name: "5分钟休息",
                    duration: 5,
                    unit: "minutes",
                    repeat: "none",
                    color: "#f1c40f"
                },
                {
                    name: "15分钟会议",
                    duration: 15,
                    unit: "minutes",
                    repeat: "none",
                    color: "#f1c40f"
                },
                {
                    name: "1小时专注",
                    duration: 1,
                    unit: "hours",
                    repeat: "none",
                    color: "#f1c40f"
                }
            ];
            this.draggedTimer = null;
            this.updateInterval = null;
            this.isVisible = false;
            this.hasCompletedTimer = false;
            this.init();
            this.checkDailyTimers();
        }

        init() {
            this.createUI();
            this.loadData();
            this.attachEventListeners();
            this.startAutoUpdate();
        }

        startAutoUpdate() {
            // Update UI every second
            this.updateInterval = setInterval(() => {
                this.updateUI();
            }, 1000);
        }

        createUI() {
            // 创建浮动按钮
            const button = document.createElement('button');
            button.id = 'enhanced-hourglass-button';
            button.innerHTML = '⌛';
            button.title = '显示/隐藏计时器面板';
            document.body.appendChild(button);

            // 添加按钮点击事件，重置完成标志和切换面板
            button.addEventListener('click', (e) => {
                console.log("Button clicked"); // 添加调试日志
                e.stopPropagation();

                if (this.hasCompletedTimer) {
                    // 如果有计时器完成，点击后重置按钮
                    this.hasCompletedTimer = false;
                    button.innerHTML = '⌛';
                }
                this.togglePanel();
            });

            // 创建主容器并翻译为中文
            const container = document.createElement('div');
            container.id = 'enhanced-hourglass-container';
            container.innerHTML = `
                <div class="hourglass-content">
                    <div class="hourglass-header">
                        <h2 class="hourglass-title">增强型沙漏计时器</h2>
                    </div>

                    <div class="hourglass-controls">
                        <button class="btn btn-primary" id="add-timer">添加计时器</button>
                        <button class="btn btn-primary" id="pause-all">全部暂停</button>
                        <button class="btn btn-danger" id="reset-all">全部重置</button>
                        <button class="btn btn-danger" id="clear-all">全部清除</button>
                        <button class="btn btn-primary" id="export-data">导出数据</button>
                        <input type="file" id="import-file" accept=".json" style="display: none;">
                        <button class="btn btn-primary" id="import-data">导入数据</button>
                    </div>

                    <div class="hourglass-presets">
                        <h3>快速预设</h3>
                        <div class="preset-buttons">
                            ${this.presets.map(preset => `
                                <button class="btn btn-primary" data-preset='${JSON.stringify(preset)}'>
                                    ${preset.name}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="hourglass-grid" id="timer-grid"></div>
                </div>

                <div class="modal" id="add-timer-modal">
                    <div class="modal-content">
                        <h3>添加新计时器</h3>
                        <form id="timer-form">
                            <div class="form-group">
                                <label for="timer-name">名称</label>
                                <input type="text" id="timer-name" required>
                                <div class="error" id="name-error"></div>
                            </div>
                            <div class="form-group">
                                <label for="timer-duration">时长</label>
                                <input type="number" id="timer-duration" min="1" required>
                                <div class="error" id="duration-error"></div>
                            </div>
                            <div class="form-group">
                                <label for="timer-unit">单位</label>
                                <select id="timer-unit">
                                    <option value="minutes">分钟</option>
                                    <option value="hours">小时</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="timer-repeat">重复模式</label>
                                <select id="timer-repeat">
                                    <option value="none">不重复</option>
                                    <option value="continuous">持续重复</option>
                                    <option value="daily">每日重复</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary">创建计时器</button>
                            <button type="button" class="btn btn-danger" id="cancel-timer">取消</button>
                        </form>
                    </div>
                </div>
            `;
            document.body.appendChild(container);
            GM_addStyle(styles);
        }

        attachEventListeners() {
            document.getElementById('add-timer').addEventListener('click', () => this.showAddTimerModal());
            document.getElementById('pause-all').addEventListener('click', () => this.pauseAllTimers());
            document.getElementById('reset-all').addEventListener('click', () => this.resetAllTimers());
            document.getElementById('clear-all').addEventListener('click', () => this.clearAllTimers());

            // 添加预设按钮监听器
            const presetButtons = document.querySelectorAll('.preset-buttons .btn');
            presetButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const preset = JSON.parse(e.target.dataset.preset);
                    const timer = new Timer(preset);
                    this.timers.push(timer);
                    this.saveData();
                    this.updateUI();
                });
            });

            // 添加导入/导出监听器
            document.getElementById('export-data').addEventListener('click', () => this.exportData());
            document.getElementById('import-data').addEventListener('click', () => document.getElementById('import-file').click());
            document.getElementById('import-file').addEventListener('change', (e) => this.importData(e));

            // 按ESC键关闭面板
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isVisible) {
                    this.togglePanel();
                }
            });
        }

        togglePanel() {
            console.log("togglePanel called"); // 添加调试日志
            const button = document.getElementById('enhanced-hourglass-button');
            const container = document.getElementById('enhanced-hourglass-container');

            this.isVisible = !this.isVisible;
            container.style.display = this.isVisible ? 'block' : 'none';
            button.classList.toggle('active', this.isVisible);

            // 防止背景滚动
            document.body.style.overflow = this.isVisible ? 'hidden' : '';
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
                        repeat: timerData.repeat,
                        color: timerData.color || '#f1c40f'
                    });
                    timer.id = timerData.id;
                    timer.remainingTime = timerData.remainingTime;
                    timer.isRunning = timerData.isRunning;
                    timer.isPaused = timerData.isPaused;
                    timer.isCompleted = timerData.isCompleted;
                    timer.lastCompletionDate = timerData.lastCompletionDate;
                    return timer;
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

                // 恢复运行中的计时器
                this.timers.forEach(timer => {
                    if (timer.isRunning) {
                        timer.start();
                    }
                });
            }
        }

        saveData() {
            GM_setValue('hourglassData', JSON.stringify(this.timers));
        }

        showAddTimerModal() {
            const modal = document.getElementById('add-timer-modal');
            modal.style.display = 'block';

            const form = document.getElementById('timer-form');
            const cancelBtn = document.getElementById('cancel-timer');

            const closeModal = () => {
                modal.style.display = 'none';
                form.reset();
            };

            cancelBtn.onclick = closeModal;
            modal.onclick = (e) => {
                if (e.target === modal) closeModal();
            };

            form.onsubmit = (e) => {
                e.preventDefault();

                const name = document.getElementById('timer-name').value;
                const duration = parseInt(document.getElementById('timer-duration').value);
                const unit = document.getElementById('timer-unit').value;
                const repeat = document.getElementById('timer-repeat').value;
                const color = "#f1c40f"; // 固定黄色

                if (!this.validateTimerForm(name, duration)) return;

                const timer = new Timer({ name, duration, unit, repeat, color });
                this.timers.push(timer);
                this.saveData();
                this.updateUI();
                closeModal();
            };
        }

        validateTimerForm(name, duration) {
            let isValid = true;
            const nameError = document.getElementById('name-error');
            const durationError = document.getElementById('duration-error');

            nameError.textContent = '';
            durationError.textContent = '';

            if (!name.trim()) {
                nameError.textContent = 'Name is required';
                isValid = false;
            }

            if (isNaN(duration) || duration < 1) {
                durationError.textContent = 'Duration must be a positive number';
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
            this.timers.forEach(timer => {
                timer.reset();
            });
            this.updateUI();
        }

        clearAllTimers() {
            // 移除确认对话框，直接清除
            this.timers = [];
            this.saveData();
            this.updateUI();
        }

        updateUI() {
            const grid = document.getElementById('timer-grid');

            grid.innerHTML = '';

            // 显示活动计时器
            this.timers.forEach(timer => {
                const timerElement = this.createTimerElement(timer);
                grid.appendChild(timerElement);
            });
        }

        createTimerElement(timer) {
            const element = document.createElement('div');
            element.className = 'hourglass-item';
            element.setAttribute('draggable', true);
            element.setAttribute('data-timer-id', timer.id);

            // 固定沙子为黄色
            const color = "#f1c40f";

            // 状态标签
            const statusBadge = timer.isRunning ?
                '<div class="status-badge running">运行中</div>' :
                timer.isPaused ?
                    '<div class="status-badge paused">已暂停</div>' :
                    timer.isCompleted ?
                        '<div class="status-badge completed">已完成</div>' : '';

            // 修正沙漏流向 - 沙子从上往下流
            const progress = timer.getProgress();
            const hourglassVisual = `
                <div class="hourglass-visual">
                    <div class="hourglass-container">
                        <div class="hourglass-top">
                            <div class="sand sand-top" style="color: ${color}; height: ${100 - progress}%"></div>
                        </div>
                        ${timer.isRunning ? `
                            <div class="sand-flow" style="color: ${color};"></div>
                        ` : ''}
                        <div class="hourglass-bottom">
                            <div class="sand sand-bottom" style="color: ${color}; height: ${progress}%"></div>
                        </div>
                    </div>
                </div>
            `;

            const timeDisplay = `<div class="time-display">${timer.getFormattedTime()}</div>`;

            const progressBar = `
                <div class="progress-bar">
                    <div class="progress-fill" style="color: ${color}; width: ${progress}%"></div>
                </div>
            `;

            const timerInfo = `
                <div class="timer-info">
                    <p><strong>重复:</strong> ${this.translateRepeat(timer.repeat)}</p>
                    ${timer.linkedTimer ? `
                        <div class="linked-badge">链接到: ${timer.linkedTimer.name}</div>
                    ` : ''}
                </div>
            `;

            const timerControls = `
                <div class="timer-controls">
                    <button class="btn btn-primary start-pause">
                        ${timer.isRunning ? '暂停' : '开始'}
                    </button>
                    <button class="btn btn-danger reset">重置</button>
                    <button class="btn btn-danger delete">删除</button>
                    ${timer.linkedTimer ?
                        `<button class="btn btn-warning unlink">解除链接</button>` :
                        ''}
                </div>
            `;

            element.innerHTML = `
                ${statusBadge}
                <h3>${timer.name}</h3>
                ${hourglassVisual}
                ${timeDisplay}
                ${progressBar}
                ${timerInfo}
                ${timerControls}
            `;

            // 不为归档计时器添加拖拽事件
            element.addEventListener('dragstart', (e) => {
                this.draggedTimer = timer;
                element.classList.add('dragging');
                e.dataTransfer.setData('text/plain', timer.id);
            });

            element.addEventListener('dragend', () => {
                element.classList.remove('dragging');
                this.draggedTimer = null;
            });

            element.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (this.draggedTimer && this.draggedTimer !== timer) {
                    element.classList.add('drag-over');
                }
            });

            element.addEventListener('dragleave', () => {
                element.classList.remove('drag-over');
            });

            element.addEventListener('drop', (e) => {
                e.preventDefault();
                element.classList.remove('drag-over');
                if (this.draggedTimer && this.draggedTimer !== timer) {
                    this.draggedTimer.setLinkedTimer(timer);
                    this.saveData();
                    this.updateUI();
                }
            });

            // 添加控制按钮事件
            const startPauseBtn = element.querySelector('.start-pause');
            const resetBtn = element.querySelector('.reset');
            const deleteBtn = element.querySelector('.delete');
            const unlinkBtn = element.querySelector('.unlink');

            if (startPauseBtn) {
                startPauseBtn.addEventListener('click', () => {
                    if (timer.isRunning) {
                        timer.pause();
                    } else {
                        timer.start();
                    }
                    this.updateUI();
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    timer.reset();
                    this.updateUI();
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    // 移除链接到此计时器的引用
                    this.timers.forEach(t => {
                        if (t.linkedTimer === timer) {
                            t.removeLinkedTimer();
                        }
                    });

                    // 删除计时器
                    this.timers = this.timers.filter(t => t.id !== timer.id);
                    this.saveData();
                    this.updateUI();
                });
            }

            if (unlinkBtn) {
                unlinkBtn.addEventListener('click', () => {
                    timer.removeLinkedTimer();
                    this.saveData();
                    this.updateUI();
                });
            }

            return element;
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
                                repeat: timerData.repeat,
                                color: timerData.color || '#f1c40f'
                            });
                            timer.id = timerData.id;
                            timer.remainingTime = timerData.remainingTime;
                            timer.isRunning = false; // Start imported timers in stopped state
                            timer.isPaused = false;
                            timer.isCompleted = timerData.isCompleted;
                            timer.lastCompletionDate = timerData.lastCompletionDate;
                            return timer;
                        });
                        this.saveData();
                        this.updateUI();
                        alert('Data imported successfully!');
                    } catch (error) {
                        alert('Error importing data: Invalid file format');
                    }
                };
                reader.readAsText(file);
            }
        }

        checkDailyTimers() {
            // Check daily timers every minute
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

        // 添加删除已完成计时器的方法
        removeCompletedTimer(timer) {
            // 如果有链接，先解除链接
            this.timers.forEach(t => {
                if (t.linkedTimer === timer) {
                    t.removeLinkedTimer();
                }
            });

            // 从计时器列表中移除
            this.timers = this.timers.filter(t => t.id !== timer.id);
            this.saveData();
            this.updateUI();
        }
    }

    // Initialize the application
    const app = new EnhancedHourglassTimer();
    window.hourglassApp = app;
})();