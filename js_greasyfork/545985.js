// ==UserScript==
// @name         微力同步任务定时启停（多时间段版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为微力同步任务增加多时间段定时启停功能，优化状态显示
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
// @downloadURL https://update.greasyfork.org/scripts/545985/%E5%BE%AE%E5%8A%9B%E5%90%8C%E6%AD%A5%E4%BB%BB%E5%8A%A1%E5%AE%9A%E6%97%B6%E5%90%AF%E5%81%9C%EF%BC%88%E5%A4%9A%E6%97%B6%E9%97%B4%E6%AE%B5%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545985/%E5%BE%AE%E5%8A%9B%E5%90%8C%E6%AD%A5%E4%BB%BB%E5%8A%A1%E5%AE%9A%E6%97%B6%E5%90%AF%E5%81%9C%EF%BC%88%E5%A4%9A%E6%97%B6%E9%97%B4%E6%AE%B5%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式（重点优化状态显示区域）
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

        /* 优化状态指示器样式，确保文字完整显示 */
        .schedule-indicator {
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: 4px;
            background: rgba(63, 81, 181, 0.1);
            color: #3f51b5;
            font-size: 12px;
            margin-left: 5px;
            white-space: nowrap; /* 禁止文字换行 */
            overflow: visible; /* 允许溢出显示 */
            text-overflow: clip; /* 不显示省略号 */
            max-width: none; /* 取消最大宽度限制 */
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

        /* 优化状态容器样式，确保有足够空间 */
        .folder-status, [class*="status-"] {
            display: inline-flex;
            align-items: center;
            flex-wrap: nowrap;
            max-width: 200px; /* 增加状态容器宽度 */
        }
    `);

    // 注册暴力猴菜单命令 - 清除所有定时数据
    GM_registerMenuCommand("清除所有定时数据", () => {
        if (confirm("确定要清除所有任务的定时设置吗？此操作不可恢复！")) {
            // 清除存储的数据
            GM_setValue('scheduleRules', '{}');
            // 更新内存中的规则
            scheduleRules = {};
            // 更新UI
            updateScheduleButtons();
            // 显示成功消息
            alert("所有定时数据已清除");
        }
    });

    // 存储当前任务名称
    let currentTaskName = '';
    // 存储定时规则 - 多时间段版本
    let scheduleRules = {};
    try {
        const storedRules = GM_getValue('scheduleRules', '{}');
        scheduleRules = JSON.parse(storedRules);
    } catch (e) {
        console.error('读取定时规则失败，重置为默认值', e);
        scheduleRules = {};
    }

    // 存储定时器
    let scheduleTimer = null;
    // 存储对话框元素
    let dialogElement = null;
    let overlayElement = null;

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

        // 添加删除按钮事件
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

        // 移除DOM元素
        periodElements[index].remove();

        // 更新剩余时间段的索引和标题
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

        // 创建新的时间段配置
        const newPeriod = {
            enabled: true,
            startTime: '08:00',
            stopTime: '18:00',
            repeat: 'daily'
        };

        // 创建并添加DOM元素
        const periodEl = createPeriodElement(newPeriod, periodCount);
        periodsContainer.appendChild(periodEl);
    }

    /**
     * 创建定时对话框
     */
    function createScheduleDialog() {
        if (dialogElement && overlayElement) return;

        // 创建对话框
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

        // 创建遮罩层
        overlayElement = document.createElement('div');
        overlayElement.className = 'overlay';
        overlayElement.style.display = 'none';
        document.body.appendChild(overlayElement);

        // 绑定事件
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

        // 获取任务的定时规则
        const taskRule = scheduleRules[taskName] || {
            enabled: true,
            periods: [{
                enabled: true,
                startTime: '08:00',
                stopTime: '18:00',
                repeat: 'daily'
            }]
        };

        // 填充任务名称和启用状态
        dialogElement.querySelector('#schedule-task-name').value = taskName;
        dialogElement.querySelector('#schedule-enabled').checked = taskRule.enabled;

        // 清空并填充时间段
        const periodsContainer = dialogElement.querySelector('.periods-container');
        periodsContainer.innerHTML = '';

        taskRule.periods.forEach((period, index) => {
            const periodEl = createPeriodElement(period, index);
            periodsContainer.appendChild(periodEl);
        });

        // 显示对话框
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

        // 收集所有时间段配置
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

        // 保存规则
        scheduleRules[currentTaskName] = { enabled, periods };
        GM_setValue('scheduleRules', JSON.stringify(scheduleRules));
        hideScheduleDialog();

        // 更新UI和定时器
        updateScheduleButtons();
        startScheduleTimer();
    }

    /**
     * 为任务行添加定时按钮和状态指示器
     */
    function addScheduleButtons() {
        // 定位任务行
        const taskRows = document.querySelectorAll('tr:has(.folder-name)');
        if (taskRows.length === 0) {
            console.log('未找到任务行，等待页面加载...');
            return;
        }

        taskRows.forEach(row => {
            // 获取任务名称
            const nameElement = row.querySelector('.folder-name [class*="cursor-"]');
            if (!nameElement) return;
            const taskName = nameElement.textContent.trim();
            if (!taskName) return;

            // 定位操作按钮容器
            const actionContainer = row.querySelector('.q-btn-group, .options-container, [class*="actions-"]');
            if (!actionContainer) return;

            // 避免重复添加按钮
            if (actionContainer.querySelector('.schedule-btn')) return;

            // 创建定时按钮
            const scheduleBtn = document.createElement('button');
            scheduleBtn.className = 'schedule-btn';
            scheduleBtn.title = '定时设置';
            scheduleBtn.innerHTML = '<i class="material-icons schedule-icon">access_time</i>定时';
            scheduleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showScheduleDialog(taskName);
            });
            actionContainer.appendChild(scheduleBtn);

            // 添加定时状态指示器
            const existingIndicator = row.querySelector('.schedule-indicator');
            if (existingIndicator) existingIndicator.remove();

            const rule = scheduleRules[taskName];
            if (rule && rule.enabled) {
                // 尝试多种位置添加，确保能显示
                let statusContainer = row.querySelector('.folder-status, [class*="status-"]');

                // 如果找不到状态容器，尝试添加到任务名称后面
                if (!statusContainer) {
                    statusContainer = row.querySelector('.folder-name');
                }

                // 如果还是找不到，尝试添加到整行的最后一个单元格
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

                    // 确保状态容器有足够的显示空间
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
        // 移除现有按钮和指示器
        document.querySelectorAll('.schedule-btn').forEach(btn => btn.remove());
        document.querySelectorAll('.schedule-indicator').forEach(ind => ind.remove());
        // 重新添加
        addScheduleButtons();
    }

    /**
     * 检查当前时间是否在指定的时间段内
     */
    function isInTimePeriod(currentTime, period) {
        const { startTime, stopTime } = period;

        if (startTime <= stopTime) {
            // 当天内（如08:00~18:00）
            return currentTime >= startTime && currentTime < stopTime;
        } else {
            // 跨天（如22:00~06:00）
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
                return dayOfWeek >= 1 && dayOfWeek <= 5; // 周一到周五
            case 'weekends':
                return dayOfWeek === 0 || dayOfWeek === 6; // 周六到周日
            default:
                return false;
        }
    }

    /**
     * 执行定时任务检查（启动/暂停任务）
     */
    function executeSchedules() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        const dayOfWeek = now.getDay();

        Object.entries(scheduleRules).forEach(([taskName, taskRule]) => {
            // 任务级别的启用开关
            if (!taskRule.enabled) return;

            // 检查是否有任何时间段匹配当前时间
            let shouldRun = false;

            (taskRule.periods || []).forEach(period => {
                // 时间段级别的启用开关
                if (!period.enabled) return;

                // 检查重复周期和时间范围
                if (isRepeatMatch(dayOfWeek, period.repeat) &&
                    isInTimePeriod(currentTime, period)) {
                    shouldRun = true;
                }
            });

            // 查找任务行
            const taskRow = Array.from(document.querySelectorAll('tr:has(.folder-name)')).find(row => {
                const nameEl = row.querySelector('.folder-name [class*="cursor-"]');
                return nameEl && nameEl.textContent.trim() === taskName;
            });
            if (!taskRow) return;

            // 查找控制按钮
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

            // 判断当前状态
            const isRunning = targetBtn.querySelector('i').textContent === 'pause_circle_outline';

            // 执行操作
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
     * 启动定时器
     */
    function startScheduleTimer() {
        if (scheduleTimer) clearInterval(scheduleTimer);
        // 每分钟检查一次
        scheduleTimer = setInterval(executeSchedules, 60 * 1000);
        executeSchedules(); // 立即执行一次
    }

    /**
     * 初始化脚本
     */
    function init() {
        console.log('微力同步定时脚本（多时间段版）初始化完成');

        // 定位任务列表容器
        const taskContainer = document.querySelector('.q-table tbody, [class*="task-list-"]');
        const observeTarget = taskContainer || document.body;

        // 监听任务列表变化
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

        // 初始添加按钮
        addScheduleButtons();

        // 启动定时器
        startScheduleTimer();

        // 添加脚本状态提示
        setTimeout(() => {
            const statusContainer = document.querySelector('.vsync-footer, .status-bar, .footer');
            if (statusContainer) {
                const statusEl = document.createElement('div');
                statusEl.className = 'schedule-status';
                statusEl.innerHTML = '<i class="material-icons" style="font-size:14px">access_time</i> 多时段定时功能运行中';
                statusContainer.appendChild(statusEl);
            }
        }, 2000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
