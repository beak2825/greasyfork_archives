// ==UserScript==
// @name         微力同步任务定时启停（多时间段版）
// @namespace    http://tampermonkey.net/
// @version      V1.2
// @description  为微力同步任务增加多时间段定时启停功能，添加每5分钟自动刷新及倒计时，系统锁定后可以继续执行
// @author       west_goo@163.com
// @match        http://127.0.0.1:8886/*
// @match        http://localhost:8886/*
// @match        http://*:8886/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/546265/%E5%BE%AE%E5%8A%9B%E5%90%8C%E6%AD%A5%E4%BB%BB%E5%8A%A1%E5%AE%9A%E6%97%B6%E5%90%AF%E5%81%9C%EF%BC%88%E5%A4%9A%E6%97%B6%E9%97%B4%E6%AE%B5%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546265/%E5%BE%AE%E5%8A%9B%E5%90%8C%E6%AD%A5%E4%BB%BB%E5%8A%A1%E5%AE%9A%E6%97%B6%E5%90%AF%E5%81%9C%EF%BC%88%E5%A4%9A%E6%97%B6%E9%97%B4%E6%AE%B5%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .schedule-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 20px;
            z-index: 10000;
            width: 450px;
            max-height: 80vh;
            overflow-y: auto;
            font-family: inherit;
            border: 1px solid #e0e0e0;
        }

        .schedule-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .schedule-title {
            font-size: 18px;
            font-weight: 500;
            color: #333;
        }

        .schedule-close {
            cursor: pointer;
            font-size: 24px;
            color: #999;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        .schedule-close:hover {
            background: #f5f5f5;
            color: #666;
        }

        .schedule-form {
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            color: #555;
        }

        .form-control {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .form-control:focus {
            border-color: #3f51b5;
            outline: none;
            box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
        }

        .time-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .time-input {
            flex: 1;
        }

        .schedule-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }

        .btn {
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }

        .btn-primary {
            background: #3f51b5;
            color: white;
        }

        .btn-primary:hover {
            background: #303f9f;
        }

        .btn-secondary {
            background: #f5f5f5;
            color: #333;
        }

        .btn-secondary:hover {
            background: #e0e0e0;
        }

        .btn-add {
            background: #4caf50;
            color: white;
            margin-bottom: 15px;
        }

        .btn-add:hover {
            background: #3d9140;
        }

        .btn-remove {
            background: #f44336;
            color: white;
            padding: 4px 8px;
            margin-top: 25px;
        }

        .btn-remove:hover {
            background: #d32f2f;
        }

        .schedule-indicator {
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: 4px;
            background: rgba(63, 81, 181, 0.1);
            color: #3f51b5;
            font-size: 12px;
            margin-left: 5px;
            white-space: nowrap;
            overflow: visible;
            text-overflow: clip;
            max-width: none;
        }

        .schedule-icon {
            margin-right: 5px;
        }

        .schedule-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            color: #666;
            padding: 5px;
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            font-size: 14px;
            margin-left: 5px;
        }

        .schedule-btn:hover {
            background: #f5f5f5;
            color: #3f51b5;
        }

        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        }

        .schedule-status {
            margin-left: 10px;
            font-size: 12px;
            color: #666;
            display: inline-flex;
            align-items: center;
        }

        .refresh-countdown {
            color: #4caf50;
            font-weight: 500;
            margin: 0 5px;
        }

        .period-container {
            border: 1px solid #eee;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 15px;
            position: relative;
        }

        .period-header {
            font-weight: 500;
            margin-bottom: 10px;
            color: #666;
            display: flex;
            justify-content: space-between;
        }

        .folder-status, [class*="status-"] {
            display: inline-flex;
            align-items: center;
            flex-wrap: nowrap;
            max-width: 200px;
        }

        /* 系统状态指示器 */
        .system-status-indicator {
            margin-left: 5px;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 11px;
            background: rgba(76, 175, 80, 0.1);
            color: #4caf50;
        }
    `);

    // 注册菜单命令
    GM_registerMenuCommand("清除所有定时数据", () => {
        if (confirm("确定要清除所有任务的定时设置吗？此操作不可恢复！")) {
            GM_setValue('scheduleRules', '{}');
            scheduleRules = {};
            updateScheduleButtons();
            alert("所有定时数据已清除");
        }
    });

    GM_registerMenuCommand("立即刷新页面", () => {
        location.reload();
    });

    // 存储变量
    let currentTaskName = '';
    let scheduleRules = {};
    try {
        const storedRules = GM_getValue('scheduleRules', '{}');
        scheduleRules = JSON.parse(storedRules);
    } catch (e) {
        console.error('读取定时规则失败，重置为默认值', e);
        scheduleRules = {};
    }

    // 定时器和状态变量
    let scheduleTimer = null;
    let refreshTimer = null;
    let countdownTimer = null;
    let remainingSeconds = 0;
    let lastCheckTime = null; // 记录上次检查时间，用于系统锁定后校准
    let dialogElement = null;
    let overlayElement = null;
    let countdownElement = null;
    let systemStatusElement = null;

    /**
     * 创建时间段配置区域
     */
    function createPeriodElement(period, index) {
        const periodEl = document.createElement('div');
        periodEl.className = 'period-container';
        periodEl.dataset.index = index;

        periodEl.innerHTML = `
            <div class="period-header">
                <span>时间段 ${index + 1}</span>
                <div class="form-check">
                    <label>
                        <input type="checkbox" class="period-enabled" ${period.enabled ? 'checked' : ''}>
                        启用此时间段
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">启动时间</label>
                <div class="time-row">
                    <input type="time" class="form-control time-input schedule-start-time"
                           value="${period.startTime || '08:00'}">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">停止时间</label>
                <div class="time-row">
                    <input type="time" class="form-control time-input schedule-stop-time"
                           value="${period.stopTime || '18:00'}">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">重复周期</label>
                <select class="form-control schedule-repeat">
                    <option value="daily" ${(period.repeat || 'daily') === 'daily' ? 'selected' : ''}>每天</option>
                    <option value="weekdays" ${(period.repeat || 'daily') === 'weekdays' ? 'selected' : ''}>工作日(周一到周五)</option>
                    <option value="weekends" ${(period.repeat || 'daily') === 'weekends' ? 'selected' : ''}>周末(周六周日)</option>
                </select>
            </div>
            <button class="btn btn-remove" data-index="${index}">删除</button>
        `;

        periodEl.querySelector('.btn-remove').addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removePeriod(index);
        });

        return periodEl;
    }

    /**
     * 移除指定索引的时间段
     */
    function removePeriod(index) {
        const periodsContainer = dialogElement.querySelector('.periods-container');
        const periodElements = periodsContainer.querySelectorAll('.period-container');

        if (periodElements.length <= 1) {
            alert('至少保留一个时间段');
            return;
        }

        periodElements[index].remove();

        const remainingPeriods = periodsContainer.querySelectorAll('.period-container');
        remainingPeriods.forEach((el, i) => {
            el.dataset.index = i;
            el.querySelector('.period-header span').textContent = `时间段 ${i + 1}`;
            el.querySelector('.btn-remove').dataset.index = i;
        });
    }

    /**
     * 添加新的时间段
     */
    function addNewPeriod() {
        const periodsContainer = dialogElement.querySelector('.periods-container');
        const periodCount = periodsContainer.querySelectorAll('.period-container').length;

        const newPeriod = {
            enabled: true,
            startTime: '08:00',
            stopTime: '18:00',
            repeat: 'daily'
        };

        const periodEl = createPeriodElement(newPeriod, periodCount);
        periodsContainer.appendChild(periodEl);
    }

    /**
     * 创建定时对话框
     */
    function createScheduleDialog() {
        if (dialogElement && overlayElement) return;

        dialogElement = document.createElement('div');
        dialogElement.className = 'schedule-dialog';
        dialogElement.style.display = 'none';
        dialogElement.innerHTML = `
            <div class="schedule-header">
                <div class="schedule-title">定时设置</div>
                <div class="schedule-close">&times;</div>
            </div>
            <div class="schedule-form">
                <div class="form-group">
                    <label class="form-label">任务名称</label>
                    <input type="text" class="form-control" id="schedule-task-name" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">启用定时功能</label>
                    <input type="checkbox" id="schedule-enabled" style="margin-left: 10px;">
                </div>
                <div class="form-group">
                    <button class="btn btn-add" id="add-period">+ 添加时间段</button>
                    <div class="periods-container"></div>
                </div>
            </div>
            <div class="schedule-actions">
                <button class="btn btn-secondary" id="schedule-cancel">取消</button>
                <button class="btn btn-primary" id="schedule-save">保存</button>
            </div>
        `;
        document.body.appendChild(dialogElement);

        overlayElement = document.createElement('div');
        overlayElement.className = 'overlay';
        overlayElement.style.display = 'none';
        document.body.appendChild(overlayElement);

        dialogElement.querySelector('.schedule-close').addEventListener('click', hideScheduleDialog);
        dialogElement.querySelector('#schedule-cancel').addEventListener('click', hideScheduleDialog);
        dialogElement.querySelector('#schedule-save').addEventListener('click', saveSchedule);
        dialogElement.querySelector('#add-period').addEventListener('click', addNewPeriod);
    }

    /**
     * 显示定时对话框
     */
    function showScheduleDialog(taskName) {
        currentTaskName = taskName;
        createScheduleDialog();

        const taskRule = scheduleRules[taskName] || {
            enabled: true,
            periods: [{
                enabled: true,
                startTime: '08:00',
                stopTime: '18:00',
                repeat: 'daily'
            }]
        };

        dialogElement.querySelector('#schedule-task-name').value = taskName;
        dialogElement.querySelector('#schedule-enabled').checked = taskRule.enabled;

        const periodsContainer = dialogElement.querySelector('.periods-container');
        periodsContainer.innerHTML = '';

        taskRule.periods.forEach((period, index) => {
            const periodEl = createPeriodElement(period, index);
            periodsContainer.appendChild(periodEl);
        });

        dialogElement.style.display = 'block';
        overlayElement.style.display = 'block';
    }

    /**
     * 隐藏定时对话框
     */
    function hideScheduleDialog() {
        if (dialogElement) dialogElement.style.display = 'none';
        if (overlayElement) overlayElement.style.display = 'none';
    }

    /**
     * 保存定时设置
     */
    function saveSchedule() {
        const enabled = dialogElement.querySelector('#schedule-enabled').checked;
        const periodElements = dialogElement.querySelectorAll('.period-container');

        const periods = Array.from(periodElements).map(el => {
            const startTime = el.querySelector('.schedule-start-time').value;
            const stopTime = el.querySelector('.schedule-stop-time').value;

            if (!startTime || !stopTime) {
                alert('请填写完整的时间设置');
                throw new Error('时间设置不完整');
            }

            return {
                enabled: el.querySelector('.period-enabled').checked,
                startTime,
                stopTime,
                repeat: el.querySelector('.schedule-repeat').value
            };
        });

        scheduleRules[currentTaskName] = { enabled, periods };
        GM_setValue('scheduleRules', JSON.stringify(scheduleRules));
        hideScheduleDialog();

        updateScheduleButtons();
        startScheduleTimer();
    }

    /**
     * 为任务行添加定时按钮和状态指示器
     */
    function addScheduleButtons() {
        const taskRows = document.querySelectorAll('tr:has(.folder-name)');
        if (taskRows.length === 0) {
            console.log('未找到任务行，等待页面加载...');
            return;
        }

        taskRows.forEach(row => {
            const nameElement = row.querySelector('.folder-name [class*="cursor-"]');
            if (!nameElement) return;
            const taskName = nameElement.textContent.trim();
            if (!taskName) return;

            const actionContainer = row.querySelector('.q-btn-group, .options-container, [class*="actions-"]');
            if (!actionContainer) return;

            if (actionContainer.querySelector('.schedule-btn')) return;

            const scheduleBtn = document.createElement('button');
            scheduleBtn.className = 'schedule-btn';
            scheduleBtn.title = '定时设置';
            scheduleBtn.innerHTML = '<i class="material-icons schedule-icon">access_time</i>定时';
            scheduleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showScheduleDialog(taskName);
            });
            actionContainer.appendChild(scheduleBtn);

            const existingIndicator = row.querySelector('.schedule-indicator');
            if (existingIndicator) existingIndicator.remove();

            const rule = scheduleRules[taskName];
            if (rule && rule.enabled) {
                let statusContainer = row.querySelector('.folder-status, [class*="status-"]');

                if (!statusContainer) {
                    statusContainer = row.querySelector('.folder-name');
                }

                if (!statusContainer) {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > 0) {
                        statusContainer = cells[cells.length - 1];
                    }
                }

                if (statusContainer) {
                    const indicator = document.createElement('span');
                    indicator.className = 'schedule-indicator';
                    indicator.innerHTML = `<i class="material-icons" style="font-size:14px">access_time</i>
                                          已设置 ${rule.periods?.length || 0} 个时段`;

                    statusContainer.style.whiteSpace = 'nowrap';
                    statusContainer.style.overflow = 'visible';

                    statusContainer.appendChild(indicator);
                }
            }
        });
    }

    /**
     * 更新所有定时按钮和指示器
     */
    function updateScheduleButtons() {
        document.querySelectorAll('.schedule-btn').forEach(btn => btn.remove());
        document.querySelectorAll('.schedule-indicator').forEach(ind => ind.remove());
        addScheduleButtons();
    }

    /**
     * 检查当前时间是否在指定的时间段内
     */
    function isInTimePeriod(currentTime, period) {
        const { startTime, stopTime } = period;

        if (startTime <= stopTime) {
            return currentTime >= startTime && currentTime < stopTime;
        } else {
            return currentTime >= startTime || currentTime < stopTime;
        }
    }

    /**
     * 检查重复周期是否匹配
     */
    function isRepeatMatch(dayOfWeek, repeat) {
        switch (repeat) {
            case 'daily':
                return true;
            case 'weekdays':
                return dayOfWeek >= 1 && dayOfWeek <= 5;
            case 'weekends':
                return dayOfWeek === 0 || dayOfWeek === 6;
            default:
                return false;
        }
    }

    /**
     * 执行定时任务检查（启动/暂停任务）
     */
    function executeSchedules() {
        const now = new Date();
        const currentTimeStamp = now.getTime();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        const dayOfWeek = now.getDay();

        // 检查是否经历了系统锁定（时间跳跃超过2分钟）
        if (lastCheckTime && (currentTimeStamp - lastCheckTime > 2 * 60 * 1000)) {
            console.log(`检测到系统可能被锁定，时间差: ${Math.round((currentTimeStamp - lastCheckTime)/1000)}秒，执行全量检查`);
            updateSystemStatus("已从锁定状态恢复，已执行同步检查");
        } else {
            updateSystemStatus("正常运行中");
        }

        // 更新上次检查时间
        lastCheckTime = currentTimeStamp;

        Object.entries(scheduleRules).forEach(([taskName, taskRule]) => {
            if (!taskRule.enabled) return;

            let shouldRun = false;

            (taskRule.periods || []).forEach(period => {
                if (!period.enabled) return;

                if (isRepeatMatch(dayOfWeek, period.repeat) &&
                    isInTimePeriod(currentTime, period)) {
                    shouldRun = true;
                }
            });

            const taskRow = Array.from(document.querySelectorAll('tr:has(.folder-name)')).find(row => {
                const nameEl = row.querySelector('.folder-name [class*="cursor-"]');
                return nameEl && nameEl.textContent.trim() === taskName;
            });
            if (!taskRow) return;

            const controlBtns = taskRow.querySelectorAll('.q-btn-group button, .options-container button');
            let targetBtn = null;
            for (const btn of controlBtns) {
                const iconText = btn.querySelector('i')?.textContent;
                if (iconText === 'pause_circle_outline' || iconText === 'play_circle_outline') {
                    targetBtn = btn;
                    break;
                }
            }
            if (!targetBtn) return;

            const isRunning = targetBtn.querySelector('i').textContent === 'pause_circle_outline';

            if (shouldRun) {
                if (!isRunning) {
                    targetBtn.click();
                    console.log(`[定时] 启动任务: ${taskName}（当前时间：${currentTime}）`);
                }
            } else {
                if (isRunning) {
                    targetBtn.click();
                    console.log(`[定时] 暂停任务: ${taskName}（当前时间：${currentTime}）`);
                }
            }
        });
    }

    /**
     * 启动定时器（优化系统锁定后恢复）
     */
    function startScheduleTimer() {
        if (scheduleTimer) clearInterval(scheduleTimer);

        // 记录初始检查时间
        lastCheckTime = new Date().getTime();

        // 使用较短的检查间隔（30秒），提高系统恢复锁后的响应速度
        scheduleTimer = setInterval(executeSchedules, 30 * 1000);
        executeSchedules(); // 立即执行一次
    }

    /**
     * 更新系统状态显示
     */
    function updateSystemStatus(status) {
        if (!systemStatusElement) {
            const statusContainer = document.querySelector('.vsync-footer, .status-bar, .footer');
            if (statusContainer) {
                systemStatusElement = document.createElement('span');
                systemStatusElement.className = 'system-status-indicator';
                statusContainer.appendChild(systemStatusElement);
            }
        }

        if (systemStatusElement) {
            systemStatusElement.textContent = status;
        }
    }

    /**
     * 更新倒计时显示
     */
    function updateCountdown() {
        if (remainingSeconds <= 0) {
            location.reload();
            return;
        }

        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        if (countdownElement) {
            countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        remainingSeconds--;
    }

    /**
     * 创建倒计时显示元素
     */
    function createCountdownElement() {
        if (countdownElement) return;

        countdownElement = document.createElement('span');
        countdownElement.className = 'refresh-countdown';

        const statusContainer = document.querySelector('.vsync-footer, .status-bar, .footer');
        if (statusContainer) {
            const statusEl = statusContainer.querySelector('.schedule-status');
            if (statusEl) {
                statusEl.innerHTML = '<i class="material-icons" style="font-size:14px">access_time</i> 多时段定时运行中 | 下次刷新: <span class="refresh-countdown"></span>';
                countdownElement = statusEl.querySelector('.refresh-countdown');
            } else {
                const newStatusEl = document.createElement('div');
                newStatusEl.className = 'schedule-status';
                newStatusEl.innerHTML = '<i class="material-icons" style="font-size:14px">access_time</i> 多时段定时运行中 | 下次刷新: <span class="refresh-countdown"></span>';
                statusContainer.appendChild(newStatusEl);
                countdownElement = newStatusEl.querySelector('.refresh-countdown');
            }
        }
    }

    /**
     * 启动页面刷新定时器和倒计时
     */
    function startRefreshTimer() {
        if (refreshTimer) clearInterval(refreshTimer);
        if (countdownTimer) clearInterval(countdownTimer);

        const totalSeconds = 5 * 60;
        remainingSeconds = totalSeconds;

        createCountdownElement();
        updateCountdown();

        countdownTimer = setInterval(updateCountdown, 1000);

        refreshTimer = setInterval(() => {
            console.log(`[定时刷新] 自动刷新页面（间隔：5分钟）`);
            location.reload();
        }, totalSeconds * 1000);
    }

    /**
     * 初始化脚本
     */
    function init() {
        console.log('微力同步定时脚本（多时间段版）初始化完成');

        const taskContainer = document.querySelector('.q-table tbody, [class*="task-list-"]');
        const observeTarget = taskContainer || document.body;

        const observer = new MutationObserver((mutations) => {
            if (mutations.some(m => m.addedNodes.length > 0 || m.removedNodes.length > 0)) {
                addScheduleButtons();
            }
        });
        observer.observe(observeTarget, {
            childList: true,
            subtree: true,
            attributes: false
        });

        addScheduleButtons();
        startScheduleTimer();
        startRefreshTimer();
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
