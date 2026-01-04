// ==UserScript==
// @name         【微赞直播】801热度自动增长管理器
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  自动规划并执行热度增长计划，自动更新热度值并保存（增加快捷设置人数功能）
// @author       明灯花月夜
// @match        https://live.vzan.com/admin/index.html?*
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539549/%E3%80%90%E5%BE%AE%E8%B5%9E%E7%9B%B4%E6%92%AD%E3%80%91801%E7%83%AD%E5%BA%A6%E8%87%AA%E5%8A%A8%E5%A2%9E%E9%95%BF%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539549/%E3%80%90%E5%BE%AE%E8%B5%9E%E7%9B%B4%E6%92%AD%E3%80%91801%E7%83%AD%E5%BA%A6%E8%87%AA%E5%8A%A8%E5%A2%9E%E9%95%BF%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 获取当前页面的锚点部分
    const hash = window.location.hash;

    // 检查锚点部分是否包含特定路径
    if (hash.includes("DataSetting/ChangeTopicPv")) {
        console.log("匹配成功，当前页面包含 TopicManage/ChangeTopicPv！");
        // 在这里添加你需要执行的代码
    } else {
        console.log("未找到匹配路径，退出脚本");
        return; // 如果未找到，直接返回
    }

    // 添加自定义样式
    GM_addStyle(`
        #heat-manager {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            padding: 20px;
            width: 360px;
            font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
            border: 1px solid #ebeef5;
            transform: translateY(0);
            transition: transform 0.3s ease;
        }
        #heat-manager.minimized {
            width: 200px;
            height: 50px;
            overflow: hidden;
        }
        .manager-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eee;
        }
        .manager-title {
            display: flex;
            align-items: center;
            color: #303133;
            font-size: 16px;
            font-weight: 600;
            margin: 0;
        }
        .manager-title svg {
            margin-right: 10px;
            width: 24px;
            height: 24px;
            fill: #409EFF;
        }
        .manager-actions {
            display: flex;
            gap: 8px;
        }
        .manager-btn {
            width: 32px;
            height: 32px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
            background: #f5f7fa;
            border: 1px solid #dcdfe6;
        }
        .heat-form-group {
            margin-bottom: 18px;
        }
        .heat-form-group label {
            display: block;
            margin-bottom: 8px;
            color: #606266;
            font-size: 14px;
            font-weight: 500;
        }
        .heat-form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            font-size: 14px;
            color: #606266;
            transition: border-color 0.3s;
            box-sizing: border-box;
        }
        .heat-form-group input:focus {
            outline: none;
            border-color: #409EFF;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }
        .heat-btn-group {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }
        .heat-btn {
            flex: 1;
            padding: 8px;
            border-radius: 4px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
            min-width: 48px;
        }
        .heat-btn-primary {
            background: linear-gradient(135deg, #409EFF, #66b1ff);
            color: white;
            box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
        }
        .heat-btn-primary:hover {
            background: linear-gradient(135deg, #66b1ff, #409EFF);
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        }
        .heat-btn-warning {
            background: linear-gradient(135deg, #e6a23c, #ebb563);
            color: white;
        }
        .heat-btn-warning:hover {
            background: linear-gradient(135deg, #ebb563, #e6a23c);
        }
        .heat-btn-default {
            background: #f4f4f5;
            color: #606266;
        }
        .heat-btn-default:hover {
            background: #e9e9eb;
        }
        .heat-result {
            margin-top: 20px;
            padding: 18px;
            background: linear-gradient(to right, #f0f7ff, #ecf5ff);
            border-radius: 8px;
            border-left: 4px solid #409EFF;
        }
        .heat-result p {
            margin: 8px 0;
            font-size: 14px;
            color: #303133;
            display: flex;
            justify-content: space-between;
        }
        .heat-result .result-label {
            color: #606266;
        }
        .heat-result .result-value {
            font-weight: 600;
            color: #409EFF;
        }
        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-idle {
            background-color: #909399;
        }
        .status-running {
            background-color: #67C23A;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
        }
        .progress-container {
            margin-top: 15px;
            background: #ebeef5;
            border-radius: 4px;
            height: 8px;
            overflow: hidden;
        }
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #409EFF, #66b1ff);
            border-radius: 4px;
            transition: width 0.5s ease;
        }
        .notification {
            position: fixed;
            top: 70px;
            right: 30px;
            padding: 15px 20px;
            border-radius: 6px;
            background: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-left: 4px solid #67C23A;
            transform: translateX(120%);
            transition: transform 0.4s ease;
            z-index: 10000;
            max-width: 300px;
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification-title {
            font-weight: 600;
            margin-bottom: 5px;
            color: #303133;
        }
        .notification-content {
            font-size: 14px;
            color: #606266;
        }
    `);

    // 创建UI界面
    const managerHTML = `
        <div id="heat-manager">
            <div class="manager-header">
                <h3 class="manager-title">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                    </svg>
                    801热度自动增长管理器
                    <br \>请勿关闭此网页
                </h3>
                <div class="manager-actions">
                    <div class="manager-btn" id="minimize-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>
                    </div>
                    <div class="manager-btn" id="close-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </div>
                </div>
            </div>
            <div class="heat-form-group">
                <label for="target-time">目标时间</label>
                <input type="datetime-local" id="target-time">
            </div>
            <div class="heat-form-group">
                <label for="target-heat">目标热度值</label>
                <input type="number" id="target-heat" min="0" placeholder="输入目标热度数值" value="5000">
                <div class="heat-btn-group" id="quick-setting-buttons">
                    <button class="heat-btn heat-btn-default" data-target="3000">3k</button>
                    <button class="heat-btn heat-btn-default" data-target="5000">5k</button>
                    <button class="heat-btn heat-btn-default" data-target="6000">6k</button>
                    <button class="heat-btn heat-btn-default" data-target="7000">7k</button>
                    <button class="heat-btn heat-btn-default" data-target="8000">8k</button>
                </div>
            </div>
            <div class="heat-btn-group">
                <button id="start-btn" class="heat-btn heat-btn-primary">开始计划</button>
                <button id="stop-btn" class="heat-btn heat-btn-default" disabled>停止</button>
            </div>
            <div id="heat-result" class="heat-result">
                <p>
                    <span class="result-label">当前状态:</span>
                    <span id="status">
                        <span class="status-indicator status-idle"></span>
                        <span>未开始</span>
                    </span>
                </p>
                <p>
                    <span class="result-label">当前热度:</span>
                    <span id="current-heat" class="result-value">0</span>
                </p>
                <p>
                    <span class="result-label">目标热度:</span>
                    <span id="result-target-heat" class="result-value">0</span>
                </p>
                <p>
                    <span class="result-label">目标时间:</span>
                    <span id="result-target-time" class="result-value">--</span>
                </p>
                <p>
                    <span class="result-label">每分钟增加:</span>
                    <span id="heat-per-minute" class="result-value">0</span>
                </p>
                <p>
                    <span class="result-label">总增加量:</span>
                    <span id="total-increase" class="result-value">0</span>
                </p>
                <p>
                    <span class="result-label">剩余热度:</span>
                    <span id="remaining-heat" class="result-value">0</span>
                </p>
                <p>
                    <span class="result-label">下次更新:</span>
                    <span id="next-update" class="result-value">--</span>
                </p>
                <div class="progress-container">
                    <div id="progress-bar" class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
        </div>
        <div id="notification" class="notification">
            <div class="notification-title">操作成功</div>
            <div class="notification-content">热度值已更新并保存</div>
        </div>
    `;

    // 将UI添加到页面
    document.body.insertAdjacentHTML('beforeend', managerHTML);

    // 获取UI元素
    const heatManager = document.getElementById('heat-manager');
    const minimizeBtn = document.getElementById('minimize-btn');
    const closeBtn = document.getElementById('close-btn');
    const targetTimeInput = document.getElementById('target-time');
    const targetHeatInput = document.getElementById('target-heat');
    const quickSettingButtons = document.getElementById('quick-setting-buttons');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const statusElem = document.getElementById('status');
    const currentHeatElem = document.getElementById('current-heat');
    const resultTargetHeatElem = document.getElementById('result-target-heat');
    const resultTargetTimeElem = document.getElementById('result-target-time');
    const heatPerMinuteElem = document.getElementById('heat-per-minute');
    const totalIncreaseElem = document.getElementById('total-increase');
    const remainingHeatElem = document.getElementById('remaining-heat');
    const nextUpdateElem = document.getElementById('next-update');
    const progressBar = document.getElementById('progress-bar');
    const notification = document.getElementById('notification');

    // 状态变量
    let timer = null;
    let nextUpdateTime = null;
    let heatPerMinute = 0;
    let targetHeat = 0;
    let targetTime = null;
    let currentHeat = 0;
    let isRunning = false;
    let planStartTime = null; // 计划开始时间

    // 设置目标时间为1小时后（默认值）
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    targetTimeInput.value = formatDateTimeLocal(oneHourLater);

    // 获取当前热度输入框
    function getHeatInput() {
        // 增加容错逻辑，应对框架动态渲染
        const inputs = document.querySelectorAll('input[placeholder="输入当前热度数值"]');
        // 优先选择可见元素
        for (const input of inputs) {
            if (input.offsetParent !== null) {
                return input;
            }
        }
        return null;
    }

    // 获取保存按钮
    function getSaveButton() {
        const buttons = document.querySelectorAll('button.el-button--primary.el-button--small');
        for (const button of buttons) {
            if (button.textContent.trim() === '保存') {
                return button;
            }
        }
        return null;
    }

    // 显示通知
    function showNotification(message, isSuccess = true) {
        const title = notification.querySelector('.notification-title');
        const content = notification.querySelector('.notification-content');
        if (isSuccess) {
            notification.style.borderLeftColor = '#67C23A';
            title.textContent = '操作成功';
        } else {
            notification.style.borderLeftColor = '#F56C6C';
            title.textContent = '操作失败';
        }
        content.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // 更新页面上的热度值（针对框架网站特别处理）
    function updateHeatValue(value) {
        const heatInput = getHeatInput();
        if (!heatInput) return false;

        try {
            // 1. 设置输入框的值
            heatInput.value = value;

            // 2. 更新ARIA属性
            heatInput.setAttribute('aria-valuenow', value);

            // 3. 创建并触发input事件
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                composed: true,
                data: value.toString(),
                isComposing: false
            });

            // 4. 创建并触发change事件
            const changeEvent = new Event('change', {
                bubbles: true,
                composed: true
            });

            // 5. 执行事件触发
            heatInput.dispatchEvent(inputEvent);
            heatInput.dispatchEvent(changeEvent);

            // 6. 特殊处理：尝试调用框架的数据绑定更新方法（以Vue为例）
            const vueInstance = heatInput.__vue__;
            if (vueInstance && typeof vueInstance.$emit === 'function') {
                vueInstance.$emit('input', value);
                vueInstance.$emit('change', value);
            }

            return true;
        } catch (error) {
            console.error('更新热度值时发生错误:', error);
            return false;
        }
    }

    // 点击保存按钮
    function clickSaveButton() {
        const saveButton = getSaveButton();
        if (saveButton) {
            // 模拟点击
            saveButton.click();
            return true;
        }
        return false;
    }

    // 执行一次更新操作
    function performUpdate() {
        if (!isRunning) return;

        // 获取当前时间
        const now = new Date();

        // 检查是否达到目标时间
        if (now >= targetTime) {
            // 强制将热度设置为目标值
            if (updateHeatValue(targetHeat)) {
                clickSaveButton();
                showNotification('计划已完成，热度值已设置为目标值');
            } else {
                showNotification('热度输入框未找到或更新失败', false);
            }

            // 强制将进度条设置为100%
            progressBar.style.width = '100%';
            remainingHeatElem.textContent = '0';

            stopPlan();
            return;
        }

        // 计算新的热度值
        const minutesPassed = Math.floor((now - planStartTime) / (1000 * 60));
        const newHeat = Math.min(
            Math.floor(currentHeat + minutesPassed * heatPerMinute),
            targetHeat
        );

        // 更新UI
        currentHeatElem.textContent = newHeat;

        // 计算进度百分比（强制在0-100之间）
        let progress = 0;
        const totalIncrease = targetHeat - currentHeat;
        if (totalIncrease > 0) {
            progress = Math.min(100, Math.max(0, Math.floor((newHeat - currentHeat) / totalIncrease * 100)));
        } else {
            progress = 100; // 当前热度已经等于目标热度
        }
        progressBar.style.width = `${progress}%`;

        // 更新剩余热度显示
        const remainingHeat = targetHeat - newHeat;
        remainingHeatElem.textContent = remainingHeat;

        // 更新页面上的热度值
        if (updateHeatValue(newHeat)) {
            // 点击保存按钮
            if (clickSaveButton()) {
                showNotification(`热度值更新为: ${newHeat}`);
            } else {
                showNotification('保存按钮未找到', false);
            }
        } else {
            showNotification('热度输入框未找到或更新失败', false);
        }

        // 计算下一次更新时间（每分钟的整点秒）
        nextUpdateTime = new Date(now);
        nextUpdateTime.setSeconds(0);
        nextUpdateTime.setMilliseconds(0);
        nextUpdateTime.setMinutes(nextUpdateTime.getMinutes() + 1);

        // 更新UI显示下一次更新时间
        nextUpdateElem.textContent = formatTime(nextUpdateTime);

        // 设置下一次更新
        const timeUntilNextUpdate = nextUpdateTime - now;
        timer = setTimeout(performUpdate, timeUntilNextUpdate);
    }

    // 开始计划
    function startPlan() {
        const targetTimeValue = targetTimeInput.value;
        const targetHeatValue = parseInt(targetHeatInput.value);

        if (!targetTimeValue) {
            showNotification('请选择目标时间', false);
            return;
        }

        if (isNaN(targetHeatValue) || targetHeatValue < 0) {
            showNotification('请输入有效的目标热度值', false);
            return;
        }

        const heatInput = getHeatInput();
        if (!heatInput) {
            showNotification('未找到热度输入框，请确认页面是否正确加载', false);
            return;
        }

        const currentHeatValue = parseInt(heatInput.value) || 0;

        if (currentHeatValue >= targetHeatValue) {
            showNotification('目标热度值必须大于当前热度值', false);
            return;
        }

        targetTime = new Date(targetTimeValue);
        const now = new Date();

        if (targetTime <= now) {
            showNotification('目标时间必须晚于当前时间', false);
            return;
        }

        // 计算时间差（分钟）
        const timeDiff = (targetTime - now) / (1000 * 60);
        const totalIncrease = targetHeatValue - currentHeatValue;
        heatPerMinute = Math.ceil(totalIncrease / timeDiff);

        // 设置状态
        isRunning = true;
        currentHeat = currentHeatValue;
        targetHeat = targetHeatValue;
        planStartTime = new Date(); // 设置计划开始时间

        // 更新UI
        statusElem.innerHTML = '<span class="status-indicator status-running"></span><span>运行中</span>';
        currentHeatElem.textContent = currentHeat;
        resultTargetHeatElem.textContent = targetHeat;
        resultTargetTimeElem.textContent = formatDateTime(targetTime);
        heatPerMinuteElem.textContent = heatPerMinute;
        totalIncreaseElem.textContent = totalIncrease;
        remainingHeatElem.textContent = totalIncrease;
        nextUpdateElem.textContent = '正在计算...';
        progressBar.style.width = '0%';

        // 启用/禁用按钮
        startBtn.disabled = true;
        stopBtn.disabled = false;
        targetTimeInput.disabled = true;
        targetHeatInput.disabled = true;

        // 执行第一次更新
        performUpdate();
    }

    // 停止计划
    function stopPlan() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        isRunning = false;

        // 更新UI
        statusElem.innerHTML = '<span class="status-indicator status-idle"></span><span>已停止</span>';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        targetTimeInput.disabled = false;
        targetHeatInput.disabled = false;
    }

    // 快捷设置目标热度
    function setQuickTarget(target) {
        // 计算正负200之间的随机数
        const randomOffset = Math.floor(Math.random() * 400) - 200;
        const newTarget = target + randomOffset;

        // 确保目标热度不小于0
        const finalTarget = Math.max(0, newTarget);

        // 更新输入框
        targetHeatInput.value = finalTarget;
    }

    // 辅助函数：格式化日期时间
    function formatDateTime(date) {
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\//g, '-');
    }

    // 辅助函数：格式化时间
    function formatTime(date) {
        return date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // 辅助函数：格式化日期时间为本地输入格式
    function formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // 事件监听
    startBtn.addEventListener('click', startPlan);
    stopBtn.addEventListener('click', stopPlan);
    minimizeBtn.addEventListener('click', function() {
        heatManager.classList.toggle('minimized');
    });
    closeBtn.addEventListener('click', function() {
        stopPlan();
        heatManager.remove();
    });

    // 快捷按钮点击事件
    quickSettingButtons.addEventListener('click', function(e) {
        if (e.target.closest('button')) {
            const target = parseInt(e.target.closest('button').dataset.target);
            setQuickTarget(target);
        }
    });

    // 初始化显示当前热度
    const heatInput = getHeatInput();
    if (heatInput) {
        currentHeatElem.textContent = heatInput.value || '0';
    }
})();