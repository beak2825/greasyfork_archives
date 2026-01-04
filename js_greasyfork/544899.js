// ==UserScript==
// @name         BOSS直聘批量投递助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动批量投递职位，处理弹窗，支持关键词跳过
// @author       chenni666
// @match        https://www.zhipin.com/web/geek/jobs?*
// @icon         https://www.zhipin.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/544899/BOSS%E7%9B%B4%E8%81%98%E6%89%B9%E9%87%8F%E6%8A%95%E9%80%92%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/544899/BOSS%E7%9B%B4%E8%81%98%E6%89%B9%E9%87%8F%E6%8A%95%E9%80%92%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .batch-apply-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 300px;
            max-height: 85vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
        }
        
        .batch-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
        }
        
        .batch-title {
            font-size: 16px;
            font-weight: bold;
            color: #1a1a1a;
        }
        
        .batch-controls {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
        }
        
        .batch-btn {
            flex: 1;
            padding: 6px 10px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            font-size: 13px;
        }
        
        .start-btn {
            background: #00a6ff;
            color: white;
        }
        
        .start-btn:hover {
            background: #0088cc;
        }
        
        .start-btn:disabled {
            background: #b3e0ff;
            cursor: not-allowed;
        }
        
        .pause-btn {
            background: #ff9500;
            color: white;
        }
        
        .pause-btn:hover {
            background: #e08600;
        }
        
        .pause-btn:disabled {
            background: #ffd699;
            cursor: not-allowed;
        }
        
        .stop-btn {
            background: #ff3b30;
            color: white;
        }
        
        .stop-btn:hover {
            background: #d63026;
        }
        
        .stop-btn:disabled {
            background: #ffb3b0;
            cursor: not-allowed;
        }
        
        .progress-container {
            margin-bottom: 10px;
        }
        
        .progress-bar {
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #00a6ff, #4cc9f0);
            width: 0%;
            transition: width 0.3s;
        }
        
        .progress-text {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
            text-align: center;
        }
        
        .status-log {
            height: 100px;
            overflow-y: auto;
            border: 1px solid #eee;
            border-radius: 4px;
            padding: 8px;
            font-size: 12px;
            background: #f9f9f9;
            margin-bottom: 8px;
        }
        
        .log-entry {
            margin-bottom: 3px;
            padding-bottom: 3px;
            border-bottom: 1px dashed #eee;
            line-height: 1.4;
        }
        
        .log-entry:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .log-success {
            color: #28a745;
        }
        
        .log-error {
            color: #dc3545;
        }
        
        .log-info {
            color: #17a2b8;
        }
        
        .log-warning {
            color: #ff9500;
        }
        
        .stats-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
            color: #666;
        }
        
        .stats-item {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .stats-value {
            font-weight: bold;
            font-size: 14px;
            color: #00a6ff;
        }
        
        .settings-toggle {
            color: #00a6ff;
            cursor: pointer;
            font-size: 13px;
            text-align: right;
            margin-bottom: 5px;
        }
        
        .settings-panel {
            padding-top: 8px;
            border-top: 1px solid #eee;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .setting-item {
            margin-bottom: 8px;
        }
        
        .setting-label {
            display: block;
            margin-bottom: 3px;
            font-size: 12px;
            color: #666;
        }
        
        .setting-input {
            width: 100%;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
        }
        
        .setting-checkbox {
            margin-right: 8px;
        }
        
        .save-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .save-notification.show {
            opacity: 1;
        }
    `);

    // 创建控制面板
    const container = document.createElement('div');
    container.className = 'batch-apply-container';
    container.innerHTML = `
        <div class="batch-header">
            <div class="batch-title">批量投递助手</div>
        </div>
        <div class="batch-controls">
            <button class="batch-btn start-btn" id="start-btn">开始投递</button>
            <button class="batch-btn pause-btn" id="pause-btn" disabled>暂停</button>
            <button class="batch-btn stop-btn" id="stop-btn" disabled>停止</button>
        </div>
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
            </div>
            <div class="progress-text" id="progress-text">准备就绪</div>
        </div>
        <div class="status-log" id="status-log"></div>
        <div class="stats-container">
            <div class="stats-item">
                <div>总职位</div>
                <div class="stats-value" id="total-jobs">0</div>
            </div>
            <div class="stats-item">
                <div>已投递</div>
                <div class="stats-value" id="applied-jobs">0</div>
            </div>
            <div class="stats-item">
                <div>成功率</div>
                <div class="stats-value" id="success-rate">0%</div>
            </div>
        </div>
        <div class="settings-toggle" id="settings-toggle">▼ 高级设置</div>
        <div class="settings-panel" id="settings-panel" style="display:none;">
            <div class="setting-item">
                <label class="setting-label">职位间隔时间(毫秒)</label>
                <input type="number" class="setting-input" id="interval-time" value="2000">
            </div>
            <div class="setting-item">
                <label class="setting-label">弹窗等待时间(毫秒)</label>
                <input type="number" class="setting-input" id="popup-wait" value="1500">
            </div>
            <div class="setting-item">
                <label class="setting-label">最大重试次数</label>
                <input type="number" class="setting-input" id="max-retry" value="3">
            </div>
            <div class="setting-item">
                <label>
                    <input type="checkbox" class="setting-checkbox" id="auto-close-popup" checked>
                    自动关闭弹窗
                </label>
            </div>
            <div class="setting-item">
                <label>
                    <input type="checkbox" class="setting-checkbox" id="skip-applied" checked>
                    跳过已投递职位
                </label>
            </div>
            <!-- 新增跳过关键词设置 -->
            <div class="setting-item">
                <label class="setting-label">职位名称跳过词(逗号分隔)</label>
                <input type="text" class="setting-input" id="title-keywords" placeholder="例如：外包,驻场,销售">
            </div>
            <div class="setting-item">
                <label class="setting-label">职业描述跳过词(逗号分隔)</label>
                <textarea class="setting-input" id="skip-keywords" rows="2" placeholder="例如：外包,驻场,销售,兼职"></textarea>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // 状态变量
    let jobItems = [];
    let currentIndex = 0;
    let isProcessing = false;
    let isPaused = false;
    let totalJobs = 0;
    let appliedCount = 0;
    let successCount = 0;
    let retryCount = 0;
    let currentTimeoutId = null; // 当前延时任务ID
    const statusLog = document.getElementById('status-log');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const totalJobsEl = document.getElementById('total-jobs');
    const appliedJobsEl = document.getElementById('applied-jobs');
    const successRateEl = document.getElementById('success-rate');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const intervalTimeInput = document.getElementById('interval-time');
    const popupWaitInput = document.getElementById('popup-wait');
    const maxRetryInput = document.getElementById('max-retry');
    const autoClosePopupCheck = document.getElementById('auto-close-popup');
    const skipAppliedCheck = document.getElementById('skip-applied');

    // 新增DOM元素引用
    const skipKeywordsInput = document.getElementById('skip-keywords');
    const titleKeywordsInput = document.getElementById('title-keywords');

    // 加载设置 - 增加关键词设置
    function loadSettings() {
        intervalTimeInput.value = GM_getValue('intervalTime', 2000);
        popupWaitInput.value = GM_getValue('popupWait', 1500);
        maxRetryInput.value = GM_getValue('maxRetry', 3);
        autoClosePopupCheck.checked = GM_getValue('autoClosePopup', true);
        skipAppliedCheck.checked = GM_getValue('skipApplied', true);
        skipKeywordsInput.value = GM_getValue('skipKeywords', '');
        titleKeywordsInput.value = GM_getValue('titleKeywords', '');
    }

    // 保存设置 - 增加关键词设置
    function saveSettings() {
        GM_setValue('intervalTime', parseInt(intervalTimeInput.value));
        GM_setValue('popupWait', parseInt(popupWaitInput.value));
        GM_setValue('maxRetry', parseInt(maxRetryInput.value));
        GM_setValue('autoClosePopup', autoClosePopupCheck.checked);
        GM_setValue('skipApplied', skipAppliedCheck.checked);
        GM_setValue('skipKeywords', skipKeywordsInput.value);
        GM_setValue('titleKeywords', titleKeywordsInput.value);
        
        // 显示保存成功提醒
        showSaveNotification();
    }

    // 显示保存设置提醒
    function showSaveNotification() {
        // 移除已存在的提醒
        const existingNotification = document.querySelector('.save-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 创建新的提醒
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.textContent = '设置已保存';
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 2秒后隐藏并移除
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 2000);
    }

    // 添加日志
    function addLog(message, type = 'info') {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        statusLog.appendChild(logEntry);
        statusLog.scrollTop = statusLog.scrollHeight;
    }

    // 更新统计信息
    function updateStats() {
        totalJobsEl.textContent = totalJobs;
        appliedJobsEl.textContent = appliedCount;
        const rate = totalJobs > 0 ? Math.round((successCount / totalJobs) * 100) : 0;
        successRateEl.textContent = `${rate}%`;
    }

    // 更新进度
    function updateProgress() {
        const percentage = totalJobs > 0 ? Math.round((appliedCount / totalJobs) * 100) : 0;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = totalJobs > 0 ? 
            `${appliedCount}/${totalJobs} (${percentage}%)` : '准备就绪';
    }

    // 获取职位列表
    function getJobList() {
        return Array.from(document.querySelectorAll('.job-card-box'));
    }

    // 检查职位是否已投递
    function isJobApplied(jobItem) {
        const appliedIndicator = jobItem.querySelector('.job-applied');
        return appliedIndicator !== null;
    }

    // 检查职位是否包含关键词
    function containsKeywords(jobItem, jobName = null) {
        // 获取设置的关键词列表
        const skipKeywords = GM_getValue('skipKeywords', '').split(',').map(k => k.trim()).filter(k => k);
        const titleKeywords = GM_getValue('titleKeywords', '').split(',').map(k => k.trim()).filter(k => k);
        
        // 检查职位名称中的关键词
        const jobTitleElem = jobItem.querySelector('.job-title');
        const jobNameText = jobTitleElem ? jobTitleElem.textContent : '';
        if (titleKeywords.length > 0 && jobNameText) {
            const lowerJobName = jobNameText.toLowerCase();
            for (const keyword of titleKeywords) {
                if (keyword && lowerJobName.includes(keyword.toLowerCase())) {
                    return {
                        match: true,
                        keyword: keyword,
                        type: '职位名称'
                    };
                }
            }
        }

        // 检查职位描述中的关键词（需要加载详细页面）
        if (!jobName) return {match: false};
        
        const jobDescElem = document.querySelector('.job-detail-body .desc');
        if (jobDescElem && skipKeywords.length > 0) {
            const jobDescText = jobDescElem.textContent.toLowerCase();
            for (const keyword of skipKeywords) {
                if (keyword && jobDescText.includes(keyword.toLowerCase())) {
                    return {
                        match: true,
                        keyword: keyword,
                        type: '职位描述'
                    };
                }
            }
        }
        
        return {match: false};
    }

    // 点击职位项 - 增加关键词检查
    function clickJobItem(index) {
        if (index >= jobItems.length) {
            addLog('所有职位已处理完毕', 'success');
            isProcessing = false;
            resetButtons();
            return;
        }

        const jobItem = jobItems[index];
        
        // 检查是否跳过已投递职位
        if (skipAppliedCheck.checked && isJobApplied(jobItem)) {
            addLog(`跳过已投递职位 ${index + 1}`, 'info');
            appliedCount++;
            updateProgress();
            updateStats();
            currentTimeoutId = setTimeout(() => processNext(), 500);
            return;
        }

        jobItem.click();
        addLog(`已选择职位 ${index + 1}/${jobItems.length}`);
        
        // 获取职位名称用于检查
        const jobNameElem = document.querySelector('.job-detail-info .job-name');
        const jobName = jobNameElem ? jobNameElem.textContent.trim() : null;
        
        // 设置延迟检查关键词
        currentTimeoutId = setTimeout(() => {
            // 执行关键词检查
            const keywordCheck = containsKeywords(jobItem, jobName);
            if (keywordCheck.match) {
                addLog(`跳过职位 ${index + 1} (包含${keywordCheck.type}关键词: ${keywordCheck.keyword})`, 'warning');
                appliedCount++;
                updateProgress();
                updateStats();
                processNext();
                return;
            }
            
            // 如果没有关键词匹配，继续投递流程
            tryApply(index);
        }, parseInt(popupWaitInput.value) / 2); // 提前一半时间检查关键词
    }

    // 尝试投递
    function tryApply(index) {
        // 查找立即沟通按钮
        const applyBtn = document.querySelector('.op-btn-chat');
        
        if (applyBtn && applyBtn.textContent.includes('立即沟通')) {
            applyBtn.click();
            addLog(`正在投递职位 ${index + 1}...`, 'info');
            
            // 处理弹窗
            currentTimeoutId = setTimeout(() => handlePopup(index), parseInt(popupWaitInput.value));
        } else {
            addLog(`职位 ${index + 1} 无法投递（按钮不存在或已投递）`, 'warning');
            appliedCount++;
            updateProgress();
            updateStats();
            processNext();
        }
    }

    // 处理弹窗
    function handlePopup(index) {
        const popup = document.querySelector('.greet-boss-container');
        const stayButton = document.querySelector('.cancel-btn');
        
        if (popup && stayButton && autoClosePopupCheck.checked) {
            stayButton.click();
            addLog(`成功投递职位 ${index + 1}，已关闭弹窗`, 'success');
            successCount++;
        } else if (popup) {
            addLog(`职位 ${index + 1} 投递成功，但未关闭弹窗`, 'warning');
            successCount++;
        } else {
            // 未检测到弹窗，可能是投递失败
            if (retryCount < parseInt(maxRetryInput.value)) {
                retryCount++;
                addLog(`职位 ${index + 1} 投递未确认，重试中 (${retryCount}/${maxRetryInput.value})`, 'warning');
                currentTimeoutId = setTimeout(() => tryApply(index), 1000);
                return;
            } else {
                addLog(`职位 ${index + 1} 投递失败，达到最大重试次数`, 'error');
            }
        }
        
        appliedCount++;
        updateProgress();
        updateStats();
        retryCount = 0;
        processNext();
    }

    // 处理下一个职位
    function processNext() {
        if (isPaused) return;
        
        currentIndex++;
        if (currentIndex < jobItems.length) {
            currentTimeoutId = setTimeout(() => clickJobItem(currentIndex), parseInt(intervalTimeInput.value));
        } else {
            addLog('批量投递完成！', 'success');
            isProcessing = false;
            resetButtons();
            GM_notification({
                title: 'BOSS直聘批量投递完成',
                text: `成功投递 ${successCount}/${totalJobs} 个职位`,
                timeout: 5000
            });
        }
    }

    // 开始批量投递
    function startBatchApply() {
        if (isProcessing) return;
        
        // 清除可能存在的延时任务
        if (currentTimeoutId) {
            clearTimeout(currentTimeoutId);
            currentTimeoutId = null;
        }
        
        jobItems = getJobList();
        if (jobItems.length === 0) {
            addLog('未找到职位列表，请刷新页面重试', 'error');
            return;
        }
        
        totalJobs = jobItems.length;
        currentIndex = 0;
        appliedCount = 0;
        successCount = 0;
        retryCount = 0;
        isProcessing = true;
        isPaused = false;
        
        addLog(`开始批量投递，共 ${jobItems.length} 个职位`);
        updateProgress();
        updateStats();
        
        // 更新按钮状态
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
        
        clickJobItem(currentIndex);
    }

    // 暂停投递
    function pauseBatchApply() {
        if (!isProcessing) return;
        
        isPaused = true;
        addLog('投递已暂停');
        pauseBtn.textContent = '继续';
        pauseBtn.removeEventListener('click', pauseBatchApply);
        pauseBtn.addEventListener('click', resumeBatchApply);
    }

    // 继续投递
    function resumeBatchApply() {
        if (!isProcessing) return;
        
        isPaused = false;
        addLog('继续投递');
        pauseBtn.textContent = '暂停';
        pauseBtn.removeEventListener('click', resumeBatchApply);
        pauseBtn.addEventListener('click', pauseBatchApply);
        processNext();
    }

    // 停止投递
    function stopBatchApply() {
        if (!isProcessing) return;
        
        // 清除当前延时任务
        if (currentTimeoutId) {
            clearTimeout(currentTimeoutId);
            currentTimeoutId = null;
        }
        
        isProcessing = false;
        isPaused = false;
        addLog('投递已停止');
        addLog(`本次投递统计: 处理了 ${appliedCount}/${totalJobs} 个职位，成功 ${successCount} 个`);
        resetButtons();
    }

    // 重置按钮状态
    function resetButtons() {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        pauseBtn.textContent = '暂停';
        pauseBtn.removeEventListener('click', resumeBatchApply);
        pauseBtn.addEventListener('click', pauseBatchApply);
        
        // 清除延时任务
        if (currentTimeoutId) {
            clearTimeout(currentTimeoutId);
            currentTimeoutId = null;
        }
    }

    // 初始化
    function init() {
        // 加载设置
        loadSettings();
        
        // 添加事件监听
        startBtn.addEventListener('click', startBatchApply);
        pauseBtn.addEventListener('click', pauseBatchApply);
        stopBtn.addEventListener('click', stopBatchApply);
        
        // 设置面板切换
        settingsToggle.addEventListener('click', () => {
            if (settingsPanel.style.display === 'none') {
                settingsPanel.style.display = 'block';
                settingsToggle.textContent = '▲ 收起设置';
            } else {
                settingsPanel.style.display = 'none';
                settingsToggle.textContent = '▼ 高级设置';
            }
        });
        
        // 设置变更保存 - 增加关键词设置
        intervalTimeInput.addEventListener('change', saveSettings);
        popupWaitInput.addEventListener('change', saveSettings);
        maxRetryInput.addEventListener('change', saveSettings);
        autoClosePopupCheck.addEventListener('change', saveSettings);
        skipAppliedCheck.addEventListener('change', saveSettings);
        skipKeywordsInput.addEventListener('change', saveSettings);
        titleKeywordsInput.addEventListener('change', saveSettings);
        
        // 初始日志
        addLog('脚本已加载，准备就绪');
        addLog('点击"开始投递"按钮开始批量投递');
        addLog('注意：请确保在BOSS直聘职位列表页面使用本脚本');
    }

    // 启动初始化
    init();
})();