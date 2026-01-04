// ==UserScript==
// @name         GPTGod.online 全自动批量注册机器人 (v3.4.5-Fixed)
// @namespace    http://tampermonkey.net/
// @version      3.4.5
// @description  修复手动退出登录开关bug，全自动批量注册，支持手动退出登录控制，AI识别超时重试，无操作自动刷新，支持中途暂停恢复，显示验证码截图，自动识别图形验证码，支持错误重试，通过API彻底登出，界面精简。
// @author       Your Name & AI Assistant
// @match        https://gptgod.online/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gptgod.online
// @downloadURL https://update.greasyfork.org/scripts/545559/GPTGodonline%20%E5%85%A8%E8%87%AA%E5%8A%A8%E6%89%B9%E9%87%8F%E6%B3%A8%E5%86%8C%E6%9C%BA%E5%99%A8%E4%BA%BA%20%28v345-Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545559/GPTGodonline%20%E5%85%A8%E8%87%AA%E5%8A%A8%E6%89%B9%E9%87%8F%E6%B3%A8%E5%86%8C%E6%9C%BA%E5%99%A8%E4%BA%BA%20%28v345-Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ===================================================================================
    // --- 配置区域 ---
    const MAIL_API_BASE_URL = 'https://ms-vercel.888782.xyz';
    const AI_API_ENDPOINT = 'https://api.888782.xyz/v1/chat/completions';
    const AI_API_KEY = 'sk-Zr3jgV31PW2ua2gi2e396623848641C98cC0631207F8D3C8';
    const AI_MAIL_MODEL = 'gpt-4.1-mini';
    const AI_CAPTCHA_MODEL = 'gpt-4.1-mini';
    const MAX_RETRIES = 2;
    const AI_CAPTCHA_TIMEOUT = 10000; // 10秒AI识别超时
    const USER_INACTIVITY_TIMEOUT = 60000; // 30秒无操作超时
    // ===================================================================================

    // --- 极致美观的样式定义 ---
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        #reg-control-panel { position: fixed; bottom: 20px; right: 20px; width: 420px; min-height: 150px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1), 0 8px 15px rgba(0, 0, 0, 0.06); z-index: 9999; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); animation: slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes slideInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .reg-panel-header { padding: 16px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 700; font-size: 16px; display: flex; align-items: center; justify-content: space-between; }
        .reg-header-title { display: flex; align-items: center; gap: 10px; } .reg-header-icon { font-size: 20px; } .reg-version { font-size: 11px; opacity: 0.8; font-weight: 400; }
        .reg-panel-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .reg-progress-container { margin-bottom: 12px; } .reg-progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; } .reg-progress-title { font-size: 13px; font-weight: 600; color: #374151; } .reg-progress-step { font-size: 11px; color: #6b7280; background: #f3f4f6; padding: 3px 7px; border-radius: 10px; font-weight: 500; } .reg-progress-bar { width: 100%; height: 5px; background: #e5e7eb; border-radius: 10px; overflow: hidden; } .reg-progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #8b5cf6); border-radius: 10px; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .reg-batch-progress { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; margin-bottom: 10px; } .reg-batch-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; } .reg-batch-title { font-size: 12px; font-weight: 600; color: #475569; } .reg-batch-counter { font-size: 11px; background: #3b82f6; color: white; padding: 2px 6px; border-radius: 8px; } .reg-batch-bar { width: 100%; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; } .reg-batch-fill { height: 100%; background: linear-gradient(90deg, #10b981, #06b6d4); transition: width: 0.3s ease; }
        .reg-status-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; position: relative; }
        .reg-status-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; } .reg-status-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; color: white; } .status-running .reg-status-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); animation: spin 2s linear infinite; } .status-success .reg-status-icon { background: linear-gradient(135deg, #10b981, #059669); } .status-waiting .reg-status-icon { background: linear-gradient(135deg, #f59e0b, #d97706); animation: pulse 1.5s infinite; } .status-error .reg-status-icon { background: linear-gradient(135deg, #ef4444, #dc2626); } .status-paused .reg-status-icon { background: linear-gradient(135deg, #6b7280, #4b5563); }
        .reg-status-title { font-size: 14px; font-weight: 600; color: #1f2937; } .reg-status-subtitle { font-size: 12px; color: #6b7280; margin-top: 2px; }
        .reg-status-details { margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb; } .reg-detail-item { display: flex; flex-direction: column; font-size: 11px; color: #6b7280; margin-bottom: 8px; } .reg-detail-item span:first-child { font-weight: 600; margin-bottom: 2px; color: #374151;} .reg-detail-value { font-weight: 400; color: #4b5563; word-break: break-all; background: #f3f4f6; padding: 3px 5px; border-radius: 4px; margin-top: 2px;} .reg-timestamp { font-size: 10px; color: #9ca3af; text-align: center; margin-top: 6px; font-family: 'SF Mono', Monaco, monospace; }
        #reg-control-panel button { padding: 12px 16px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 13px; width: 100%; transition: all 0.2s; }
        .reg-btn-primary { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; } .reg-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(59, 130, 246, 0.4); } .reg-btn-secondary { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; } .reg-btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; } .reg-btn-warning { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; } .reg-btn-info { background: linear-gradient(135deg, #6366f1, #4338ca); color: white; } .reg-btn-success { background: linear-gradient(135deg, #10b981, #047857); color: white; }
        .reg-button-group { display: flex; gap: 10px; } .reg-button-group button { flex: 1; } .reg-button-group-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; } .reg-button-group-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; } .reg-button-group-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 6px; }
        .reg-batch-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 10px; } .reg-stat-item { background: #f8fafc; padding: 8px; border-radius: 8px; text-align: center; } .reg-stat-number { font-size: 16px; font-weight: 700; color: #1f2937; } .reg-stat-label { font-size: 10px; color: #6b7280; margin-top: 2px; } .stat-success { border-left: 3px solid #10b981; } .stat-failed { border-left: 3px solid #ef4444; } .stat-total { border-left: 3px solid #3b82f6; }
        .reg-pause-indicator { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 8px; margin-bottom: 10px; font-size: 12px; color: #92400e; text-align: center; font-weight: 600; }
        .reg-captcha-image { margin-top: 10px; text-align: center; } .reg-captcha-image img { max-width: 100%; border-radius: 8px; border: 2px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); } .reg-captcha-label { font-size: 11px; color: #6b7280; margin-bottom: 5px; font-weight: 600; }
        .reg-setting-toggle { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s; } .reg-setting-toggle:hover { background: #e2e8f0; } .reg-setting-label { font-size: 12px; font-weight: 600; color: #475569; pointer-events: none; } .reg-toggle-switch { position: relative; width: 44px; height: 24px; background: #cbd5e1; border-radius: 12px; cursor: pointer; transition: background 0.3s; pointer-events: none; } .reg-toggle-switch.active { background: #10b981; } .reg-toggle-slider { position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1); pointer-events: none; } .reg-toggle-switch.active .reg-toggle-slider { transform: translateX(20px); }
        .reg-manual-logout-waiting { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px; margin-bottom: 10px; text-align: center; } .reg-manual-logout-title { font-size: 13px; font-weight: 600; color: #92400e; margin-bottom: 8px; } .reg-manual-logout-subtitle { font-size: 11px; color: #a16207; margin-bottom: 10px; }
        .reg-reset-warning { background: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-bottom: 10px; text-align: center; } .reg-reset-title { font-size: 13px; font-weight: 600; color: #991b1b; margin-bottom: 8px; } .reg-reset-subtitle { font-size: 11px; color: #b91c1c; margin-bottom: 10px; }
    `);

    // --- 任务状态管理 ---
    let accountQueue = [];
    let currentAccountIndex = 0;
    let batchStats = { total: 0, success: 0, failed: 0 };
    let taskStatus = 'idle'; // idle, running, paused, completed
    let currentStep = 0, totalSteps = 6, taskStartTime = null, currentEmail = '';
    let manualLogout = false; // 手动退出登录开关
    let userActivityTimer = null; // 用户活动计时器
    let lastActivityTime = Date.now(); // 最后活动时间
    let aiRequestController = null; // AI请求控制器

    // --- 全局任务管理器 ---
    let globalTaskManager = {
        activeRequests: new Set(), // 正在进行的GM_xmlhttpRequest
        activeTimers: new Set(),   // 正在运行的定时器ID
        activityListeners: [],     // 用户活动监听器
        isForceResetting: false,   // 强制重置标识

        // 添加请求
        addRequest: function(request) {
            this.activeRequests.add(request);
            console.log(`Added request, total active: ${this.activeRequests.size}`);
        },

        // 移除请求
        removeRequest: function(request) {
            this.activeRequests.delete(request);
            console.log(`Removed request, total active: ${this.activeRequests.size}`);
        },

        // 添加定时器
        addTimer: function(timerId) {
            this.activeTimers.add(timerId);
            console.log(`Added timer ${timerId}, total active: ${this.activeTimers.size}`);
        },

        // 移除定时器
        removeTimer: function(timerId) {
            this.activeTimers.delete(timerId);
            console.log(`Removed timer ${timerId}, total active: ${this.activeTimers.size}`);
        },

        // 清理所有活动任务
        cleanupAll: function() {
            console.log('Starting cleanup of all active tasks...');
            this.isForceResetting = true;

            // 中止所有正在进行的请求
            this.activeRequests.forEach(request => {
                try {
                    if (request && typeof request.abort === 'function') {
                        request.abort();
                        console.log('Aborted active request');
                    }
                } catch (e) {
                    console.error('Error aborting request:', e);
                }
            });
            this.activeRequests.clear();

            // 清理所有定时器
            this.activeTimers.forEach(timerId => {
                try {
                    clearTimeout(timerId);
                    clearInterval(timerId);
                    console.log(`Cleared timer ${timerId}`);
                } catch (e) {
                    console.error('Error clearing timer:', e);
                }
            });
            this.activeTimers.clear();

            // 移除用户活动监听器
            this.activityListeners.forEach(listener => {
                try {
                    document.removeEventListener(listener.event, listener.handler, true);
                    console.log(`Removed ${listener.event} listener`);
                } catch (e) {
                    console.error('Error removing listener:', e);
                }
            });
            this.activityListeners = [];

            console.log('Cleanup completed');
        }
    };

    // --- 包装setTimeout和setInterval ---
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;

    window.setTimeout = function(callback, delay, ...args) {
        const timerId = originalSetTimeout(() => {
            globalTaskManager.removeTimer(timerId);
            if (!globalTaskManager.isForceResetting) {
                callback(...args);
            }
        }, delay);
        globalTaskManager.addTimer(timerId);
        return timerId;
    };

    window.setInterval = function(callback, delay, ...args) {
        const timerId = originalSetInterval(() => {
            if (!globalTaskManager.isForceResetting) {
                callback(...args);
            } else {
                clearInterval(timerId);
                globalTaskManager.removeTimer(timerId);
            }
        }, delay);
        globalTaskManager.addTimer(timerId);
        return timerId;
    };

    function setInputValue(element, value) { if (!element) return; const desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value"); desc.set.call(element, value); element.dispatchEvent(new Event('input', { bubbles: true })); }
    function updatePanel(html) { let p = document.getElementById('reg-control-panel'); if (!p) { p = document.createElement('div'); p.id = 'reg-control-panel'; document.body.appendChild(p); } p.innerHTML = html; }
    function removePanel() { const p = document.getElementById('reg-control-panel'); if (p) p.remove(); }
    function getCurrentTime() { return new Date().toLocaleTimeString('zh-CN', { hour12: false }); }
    function getElapsedTime() { if (!taskStartTime) return '00:00'; const e = Math.floor((Date.now() - taskStartTime) / 1000); return `${Math.floor(e/60).toString().padStart(2,'0')}:${(e%60).toString().padStart(2,'0')}`; }

    // --- 用户活动检测系统 ---
    function initUserActivityDetection() {
        if (globalTaskManager.isForceResetting) return;

        // 监听用户活动事件
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        const updateLastActivity = () => {
            if (!globalTaskManager.isForceResetting) {
                lastActivityTime = Date.now();
                console.log('User activity detected, updating last activity time');
            }
        };

        // 添加事件监听器并记录
        activityEvents.forEach(eventType => {
            const listener = { event: eventType, handler: updateLastActivity };
            document.addEventListener(eventType, updateLastActivity, true);
            globalTaskManager.activityListeners.push(listener);
        });

        // 启动定时检查
        startInactivityCheck();
    }

    function startInactivityCheck() {
        if (userActivityTimer) {
            clearInterval(userActivityTimer);
        }

        userActivityTimer = setInterval(() => {
            if (globalTaskManager.isForceResetting) return;

            const now = Date.now();
            const inactiveTime = now - lastActivityTime;

            console.log(`Checking user activity: inactive for ${Math.round(inactiveTime/1000)}s`);

            // 如果超过30秒无活动且当前在任务执行中
            if (inactiveTime > USER_INACTIVITY_TIMEOUT && taskStatus === 'running') {
                console.log('User inactive for 30+ seconds, refreshing page...');
                clearInterval(userActivityTimer);

                // 显示刷新提示
                updatePanel(`
                    <div class="reg-panel-header" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <div class="reg-header-title"><span class="reg-header-icon">🔄</span><div>自动刷新</div></div>
                        <div class="reg-version">v3.4.5</div>
                    </div>
                    <div class="reg-panel-body">
                        <div class="reg-status-card status-waiting">
                            <div class="reg-status-header">
                                <div class="reg-status-icon">⏰</div>
                                <div>
                                    <div class="reg-status-title">检测到30秒无操作</div>
                                    <div class="reg-status-subtitle">正在自动刷新页面...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `);

                setTimeout(() => {
                    if (!globalTaskManager.isForceResetting) {
                        window.location.reload();
                    }
                }, 2000);
            }
        }, 5000); // 每5秒检查一次
    }

    // --- 批量注册辅助函数 ---
    function parseAccountList(inputText) {
        const lines = inputText.trim().split('\n').filter(line => line.trim().length > 0);
        const accounts = [];
        for (let line of lines) {
            const parts = line.trim().split(/:|----/);
            if (parts.length >= 4) {
                accounts.push(line.trim());
            }
        }
        return accounts;
    }

    function getBatchProgressHTML() {
        const batchProgress = Math.round((currentAccountIndex / batchStats.total) * 100);
        return `
            <div class="reg-batch-progress">
                <div class="reg-batch-header">
                    <div class="reg-batch-title">批量注册进度</div>
                    <div class="reg-batch-counter">${Math.min(currentAccountIndex + 1, batchStats.total)}/${batchStats.total}</div>
                </div>
                <div class="reg-batch-bar">
                    <div class="reg-batch-fill" style="width: ${batchProgress}%"></div>
                </div>
            </div>
        `;
    }

    function getBatchStatsHTML() {
        return `
            <div class="reg-batch-stats">
                <div class="reg-stat-item stat-total">
                    <div class="reg-stat-number">${batchStats.total}</div>
                    <div class="reg-stat-label">总账号</div>
                </div>
                <div class="reg-stat-item stat-success">
                    <div class="reg-stat-number">${batchStats.success}</div>
                    <div class="reg-stat-label">成功</div>
                </div>
                <div class="reg-stat-item stat-failed">
                    <div class="reg-stat-number">${batchStats.failed}</div>
                    <div class="reg-stat-label">失败</div>
                </div>
            </div>
        `;
    }

    // --- 手动退出登录开关HTML ---
    function getManualLogoutToggleHTML() {
        return `
            <div class="reg-setting-toggle" id="reg-manual-logout-toggle">
                <div class="reg-setting-label">📋 手动退出登录</div>
                <div class="reg-toggle-switch${manualLogout ? ' active' : ''}">
                    <div class="reg-toggle-slider"></div>
                </div>
            </div>
        `;
    }

    // --- 暂停指示器 ---
    function getPauseIndicatorHTML() {
        return `<div class="reg-pause-indicator">⏸️ 任务已暂停 - 可以选择恢复或重置</div>`;
    }

    // --- 暂停任务 ---
    function pauseTask() {
        if (globalTaskManager.isForceResetting) return;
        taskStatus = 'paused';
        console.log('Task paused, saving state...');
        saveBatchState();
        showPausedInterface();
    }

    // --- 恢复任务 ---
    function resumeTask() {
        if (globalTaskManager.isForceResetting) return;
        taskStatus = 'running';
        console.log('Task resumed, saving state...');
        saveBatchState();

        // 恢复时重置任务开始时间
        if (!taskStartTime) {
            taskStartTime = Date.now();
        }

        // 重新启动用户活动检测
        initUserActivityDetection();

        // 确保跳转到注册页面
        setTimeout(() => {
            if (!globalTaskManager.isForceResetting) {
                window.location.href = 'https://gptgod.online/#/register';
            }
        }, 500);
    }

    // --- 暂停界面 ---
    function showPausedInterface() {
        const isBatchMode = batchStats.total > 1;
        updatePanel(`
            <div class="reg-panel-header" style="background: linear-gradient(135deg, #6b7280, #4b5563);">
                <div class="reg-header-title"><span class="reg-header-icon">⏸️</span><div>任务暂停</div></div>
                <div class="reg-version">v3.4.5</div>
            </div>
            <div class="reg-panel-body">
                ${isBatchMode ? getBatchProgressHTML() : ''}
                ${getPauseIndicatorHTML()}
                ${getManualLogoutToggleHTML()}
                <div class="reg-status-card status-paused">
                    <div class="reg-status-header"><div class="reg-status-icon">⏸</div><div><div class="reg-status-title">批量任务已暂停</div><div class="reg-status-subtitle">您可以选择恢复任务或重置所有数据</div></div></div>
                    <div class="reg-status-details">
                        <div class="reg-detail-item"><span>当前进度:</span><span class="reg-detail-value">第${currentAccountIndex + 1}个，共${batchStats.total}个账号</span></div>
                        <div class="reg-detail-item"><span>已完成:</span><span class="reg-detail-value">${batchStats.success}个成功，${batchStats.failed}个失败</span></div>
                        <div class="reg-detail-item"><span>剩余账号:</span><span class="reg-detail-value">${batchStats.total - currentAccountIndex}个</span></div>
                        <div class="reg-detail-item"><span>手动退出:</span><span class="reg-detail-value">${manualLogout ? '开启' : '关闭'}</span></div>
                    </div>
                    <div class="reg-timestamp">暂停时间: ${getCurrentTime()}</div>
                </div>
                ${isBatchMode ? getBatchStatsHTML() : ''}
                <div class="reg-button-group-3">
                    <button id="reg-resume-btn" class="reg-btn-success">恢复任务</button>
                    <button id="reg-reset-btn" class="reg-btn-danger">重置任务</button>
                    <button id="reg-close-btn" class="reg-btn-secondary">关闭面板</button>
                </div>
            </div>
        `);
    }

    // --- 强制重置任务函数 ---
    function resetTask() {
        console.log('Starting force reset task...');

        // 显示重置警告界面
        updatePanel(`
            <div class="reg-panel-header" style="background: linear-gradient(135deg, #ef4444, #b91c1c);">
                <div class="reg-header-title"><span class="reg-header-icon">🛑</span><div>强制重置中</div></div>
                <div class="reg-version">v3.4.5</div>
            </div>
            <div class="reg-panel-body">
                <div class="reg-reset-warning">
                    <div class="reg-reset-title">⚠️ 正在强制重置所有任务</div>
                    <div class="reg-reset-subtitle">正在中止所有活动请求和定时器...</div>
                </div>
                <div class="reg-status-card status-error">
                    <div class="reg-status-header">
                        <div class="reg-status-icon">🔄</div>
                        <div>
                            <div class="reg-status-title">任务重置进行中</div>
                            <div class="reg-status-subtitle">请稍等，正在清理所有运行状态</div>
                        </div>
                    </div>
                    <div class="reg-status-details">
                        <div class="reg-detail-item"><span>活动请求:</span><span class="reg-detail-value">${globalTaskManager.activeRequests.size}个</span></div>
                        <div class="reg-detail-item"><span>活动定时器:</span><span class="reg-detail-value">${globalTaskManager.activeTimers.size}个</span></div>
                        <div class="reg-detail-item"><span>事件监听器:</span><span class="reg-detail-value">${globalTaskManager.activityListeners.length}个</span></div>
                    </div>
                </div>
            </div>
        `);

        // 延时执行清理，让用户看到重置状态
        setTimeout(() => {
            // 清理所有活动任务
            globalTaskManager.cleanupAll();

            // 清理用户活动计时器
            if (userActivityTimer) {
                clearInterval(userActivityTimer);
                userActivityTimer = null;
            }

            // 重置所有状态变量
            accountQueue = [];
            currentAccountIndex = 0;
            batchStats = { total: 0, success: 0, failed: 0 };
            taskStatus = 'idle';
            currentStep = 0;
            taskStartTime = null;
            currentEmail = '';
            manualLogout = false;
            lastActivityTime = Date.now();

            // 清理所有存储的数据
            GM_deleteValue('accountQueue');
            GM_deleteValue('currentAccountIndex');
            GM_deleteValue('batchStats');
            GM_deleteValue('taskStatus');
            GM_deleteValue('manualLogout');
            GM_deleteValue('retryCount');

            console.log('Reset completed, all tasks have been stopped');

            // 重置完成后显示初始界面
            setTimeout(() => {
                globalTaskManager.isForceResetting = false;
                showInitialPrompt();
            }, 1000);

        }, 800);
    }

    // --- 加载批量注册状态 ---
    function loadBatchState() {
        accountQueue = GM_getValue('accountQueue', []);
        currentAccountIndex = GM_getValue('currentAccountIndex', 0);
        batchStats = GM_getValue('batchStats', { total: 0, success: 0, failed: 0 });
        taskStatus = GM_getValue('taskStatus', 'idle');
        manualLogout = GM_getValue('manualLogout', false);
        console.log('Loaded batch state:', { accountQueue: accountQueue.length, currentAccountIndex, batchStats, taskStatus, manualLogout });
    }

    // --- 保存批量注册状态 ---
    function saveBatchState() {
        if (globalTaskManager.isForceResetting) return;
        GM_setValue('accountQueue', accountQueue);
        GM_setValue('currentAccountIndex', currentAccountIndex);
        GM_setValue('batchStats', batchStats);
        GM_setValue('taskStatus', taskStatus);
        GM_setValue('manualLogout', manualLogout);
        console.log('Saved batch state:', { accountQueue: accountQueue.length, currentAccountIndex, batchStats, taskStatus, manualLogout });
    }

    // --- 统一的错误显示面板 ---
    function showErrorPanel(title, subtitle, details = {}) {
        if (globalTaskManager.isForceResetting) return;
        const isBatchMode = batchStats.total > 1;
        updatePanel(`
            <div class="reg-panel-header" style="background: linear-gradient(135deg, #ef4444, #b91c1c);">
                <div class="reg-header-title"><span class="reg-header-icon">❌</span><div>错误</div></div>
                <div class="reg-version">v3.4.5</div>
            </div>
            <div class="reg-panel-body">
                ${isBatchMode ? getBatchProgressHTML() : ''}
                <div class="reg-status-card status-error">
                    <div class="reg-status-header"><div class="reg-status-icon">!</div><div><div class="reg-status-title">${title}</div><div class="reg-status-subtitle">${subtitle}</div></div></div>
                    <div class="reg-status-details">
                        ${details.statusCode ? `<div class="reg-detail-item"><span>状态码:</span><span class="reg-detail-value">${details.statusCode}</span></div>` : ''}
                        ${details.endpoint ? `<div class="reg-detail-item"><span>API端点:</span><span class="reg-detail-value">${details.endpoint}</span></div>` : ''}
                        ${details.errorMessage ? `<div class="reg-detail-item"><span>错误信息:</span><span class="reg-detail-value">${details.errorMessage}</span></div>` : ''}
                    </div>
                    <div class="reg-timestamp">发生时间: ${getCurrentTime()}</div>
                </div>
                ${isBatchMode ? getBatchStatsHTML() : ''}
                <div class="reg-button-group-3">
                    ${isBatchMode ? '<button id="reg-skip-btn" class="reg-btn-warning">跳过继续</button>' : ''}
                    <button id="reg-pause-btn" class="reg-btn-info">暂停任务</button>
                    <button id="reg-reset-btn" class="reg-btn-danger">强制重置</button>
                </div>
            </div>
        `);
    }

    // --- 增强的进度更新函数 ---
    function updateProgress(step, title, subtitle, details = {}) {
        if (globalTaskManager.isForceResetting) return '';
        currentStep = step;
        const progress = Math.round((step / totalSteps) * 100);
        const isBatchMode = batchStats.total > 1;
        const detailItems = [
            details.fullEmail ? `<div class="reg-detail-item"><span>操作邮箱:</span><span class="reg-detail-value">${details.fullEmail}</span></div>` : '',
            details.elapsed ? `<div class="reg-detail-item"><span>已用时间:</span><span class="reg-detail-value">${details.elapsed}</span></div>` : '',
            details.nextAction ? `<div class="reg-detail-item"><span>当前动作:</span><span class="reg-detail-value">${details.nextAction}</span></div>` : '',
            details.apiEndpoint ? `<div class="reg-detail-item"><span>API端点:</span><span class="reg-detail-value">${details.apiEndpoint}</span></div>` : '',
            details.waitTime ? `<div class="reg-detail-item"><span>预设等待:</span><span class="reg-detail-value">${details.waitTime}秒</span></div>` : '',
            details.code ? `<div class="reg-detail-item"><span>识别验证码:</span><span class="reg-detail-value">${details.code}</span></div>` : '',
            details.rawResponse ? `<div class="reg-detail-item"><span>AI原始返回:</span><span class="reg-detail-value">${details.rawResponse}</span></div>` : ''
        ].filter(Boolean).join('');

        // 验证码截图显示
        const captchaImageHTML = details.captchaImage ? `
            <div class="reg-captcha-image">
                <div class="reg-captcha-label">🖼️ 验证码截图</div>
                <img src="${details.captchaImage}" alt="验证码截图" />
            </div>
        ` : '';

        return `
            ${isBatchMode ? getBatchProgressHTML() : ''}
            <div class="reg-progress-container">
                <div class="reg-progress-header"><div class="reg-progress-title">${title}</div><div class="reg-progress-step">${step}/${totalSteps}</div></div>
                <div class="reg-progress-bar"><div class="reg-progress-fill" style="width: ${progress}%"></div></div>
            </div>
            <div class="reg-status-card ${details.status || 'status-running'}">
                <div class="reg-status-header"><div class="reg-status-icon">${details.icon || '⚙'}</div><div><div class="reg-status-title">${title}</div><div class="reg-status-subtitle">${subtitle}</div></div></div>
                ${detailItems ? `<div class="reg-status-details">${detailItems}</div>` : ''}
                ${captchaImageHTML}
                <div class="reg-timestamp">更新时间: ${getCurrentTime()}</div>
            </div>
            ${isBatchMode ? getBatchStatsHTML() : ''}
        `;
    }

    // --- 处理可重试错误的函数 ---
    function handleRetryableError(title, subtitle, details = {}) {
        if (globalTaskManager.isForceResetting) return;
        let retryCount = GM_getValue('retryCount', 0);
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            GM_setValue('retryCount', retryCount);
            const waitSeconds = 5;
            const isBatchMode = batchStats.total > 1;
            updatePanel(`
                <div class="reg-panel-header" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                    <div class="reg-header-title"><span class="reg-header-icon">⚠️</span><div>任务重试</div></div>
                    <div class="reg-version">v3.4.5</div>
                </div>
                <div class="reg-panel-body">
                    ${isBatchMode ? getBatchProgressHTML() : ''}
                    <div class="reg-status-card status-waiting">
                        <div class="reg-status-header"><div class="reg-status-icon">🔄</div><div><div class="reg-status-title">${title} (尝试 ${retryCount}/${MAX_RETRIES})</div><div class="reg-status-subtitle">${subtitle}</div><div class="reg-status-subtitle">${waitSeconds}秒后自动重试...</div></div></div>
                    </div>
                    ${isBatchMode ? getBatchStatsHTML() : ''}
                    <div class="reg-button-group-2">
                        <button id="reg-pause-btn" class="reg-btn-info">暂停任务</button>
                        <button id="reg-reset-btn" class="reg-btn-danger">强制重置</button>
                    </div>
                </div>
            `);
            setTimeout(() => {
                if (taskStatus !== 'paused' && !globalTaskManager.isForceResetting) {
                    window.location.href = 'https://gptgod.online/';
                }
            }, waitSeconds * 1000);
        } else {
            showErrorPanel(`任务失败 (已达最大重试次数)`, subtitle, details);
            GM_deleteValue('retryCount');
        }
    }

    // --- 精简的初始界面 ---
    function showInitialPrompt() {
        if (MAIL_API_BASE_URL.includes('YOUR_MAIL_API_DOMAIN') || globalTaskManager.isForceResetting) {
            if (!globalTaskManager.isForceResetting) {
                showErrorPanel('配置错误', '请先在脚本代码中配置您的邮件API域名！');
            }
            return;
        }
        updatePanel(`
            <div class="reg-panel-header">
                <div class="reg-header-title"><span class="reg-header-icon">🚀</span><div>批量注册机器人</div></div>
                <div class="reg-version">v3.4.5</div>
            </div>
            <div class="reg-panel-body">
                ${getManualLogoutToggleHTML()}
                <div class="reg-button-group"><button id="reg-start-btn" class="reg-btn-primary">开始批量注册</button><button id="reg-close-btn" class="reg-btn-secondary">关闭</button></div>
            </div>
        `);
    }

    // --- 核心流程: 自动识别图形验证码 ---
    async function solveGraphicalCaptcha(modalElement) {
        if (globalTaskManager.isForceResetting) return;

        const AI_CAPTCHA_PROMPT = `
# Role: 验证码识别专家

## Profile
- language: 中文
- description: 一个专为高精度识别验证码而设计的AI模型。能够快速、准确地从复杂的图像中提取字符或计算数学表达式的结果，并能有效对抗常见的干扰元素。
- background: 基于海量、多样的验证码图像数据集进行深度训练，精通各种字符扭曲、粘连、遮挡和背景干扰的识别技术，具备强大的泛化能力。
- personality: 精确、高效、客观、直接。只关注任务本身，不产生任何与结果无关的额外信息。
- expertise: 计算机视觉、高级光学字符识别（OCR）、图像预处理与去噪、模式识别、基础算术逻辑。
- target_audience: 需要自动化处理验证码的开发者、自动化测试工程师、数据科学家。

## Skills
1. 核心识别能力
   - 高精度字符识别: 准确识别大小写英文字母、数字，并能精确区分外形相似的字符（如：0和O，1和l，g和9）。
   - 数学运算处理: 识别并解析图片中的数学算式（如：3+5*2），并计算出最终的数值结果。
   - 强抗干扰能力: 自动过滤和忽略图像中的干扰线、噪点、斑块、背景纹理等非关键信息。
   - 字符分割技术: 即使在字符粘连、重叠或间距不等的情况下，也能有效地将其分离以便独立识别。
2. 辅助处理能力
   - 图像预处理: 自动对输入图像进行灰度化、二值化、去噪等操作，以提升识别的准确率。
   - 快速响应: 以极低的延迟返回识别结果，满足实时性要求。
   - 结果格式化: 严格按照指定的格式输出，确保输出的纯净性，便于程序调用。
   - 鲁棒性: 对于不同字体、大小、颜色、角度的字符组合均有较高的识别成功率。

## Rules
1. 基本原则：
   - 结果唯一: 输出内容必须是且仅是验证码的识别结果。
   - 绝对精确: 尽最大努力确保字符识别的大小写和数值计算的准确性。
   - 任务聚焦: 仅处理验证码内容，忽略图像中的任何其他元素。
   - 保持静默: 除最终结果外，不输出任何提示、标签、解释或说明。
2. 行为准则：
   - 直接输出结果: 若为字符型验证码，直接返回字符串；若为计算题，直接返回计算后的数字。
   - 严格区分大小写: 必须准确识别并返回字符的原始大小写形式（例如'W'和'w'是不同字符）。
   - 精准区分易混淆字符: 必须对数字"0"和字母"O"、数字"1"和字母"l"等易混淆字符进行准确区分。
   - 自动执行运算: 遇到数学表达式时，必须完成计算并仅返回最终的阿拉伯数字结果。
3. 限制条件：
   - 禁止任何解释: 不得对识别过程、结果的置信度或遇到的困难进行任何说明。
   - 禁止附加文本: 返回的最终结果前后不能有任何空格、引号、标签或"答案是："等引导性词语。
   - 禁止互动: 不得向用户提问或请求更清晰的图片。
   - 禁止失败提示: 即使无法完全识别，也应根据已识别内容尽力输出，而不是返回"无法识别"之类的自然语言。

## Workflows
- 目标: 接收一张验证码图片，精准、快速地返回其内容或计算结果。
- 步骤 1: 接收图像并进行分析，判断验证码类型（字符型或数学计算型）。
- 步骤 2: 应用图像预处理技术，对图像进行降噪、增强和二值化，以凸显关键字符，强制消除干扰线和背景。
- 步骤 3: 对处理后的图像进行字符分割，然后逐一识别。对于数学题，则识别数字和运算符。
- 步骤 4: 整合识别结果。如果是字符，则按顺序拼接成字符串；如果是数学题，则执行运算。
- 步骤 5: 输出最终结果。确保输出内容绝对纯净，符合Rules中的所有规定。
- 预期结果: 一个不包含任何多余信息的字符串（如"aB5fG"）或一个数字（如"28"）。

## Initialization
作为验证码识别专家，你必须遵守上述Rules，按照Workflows执行任务。

---
## 【任务指令】
请严格遵循以上所有规则，分析接下来提供的图片，并直接返回识别结果。
`;

        const panelTemplate = (details) => `
            <div class="reg-panel-header"><div class="reg-header-title"><span class="reg-header-icon">🤖</span><div>AI识别中</div></div><div class="reg-version">v3.4.5</div></div>
            <div class="reg-panel-body">${updateProgress(2, '识别图形验证码', 'AI正在处理图像...', details)}<div class="reg-button-group-2"><button id="reg-pause-btn" class="reg-btn-info">暂停任务</button><button id="reg-reset-btn" class="reg-btn-danger">强制重置</button></div></div>`;

        updatePanel(panelTemplate({ status: 'status-running', icon: '🖼️', fullEmail: currentEmail, elapsed: getElapsedTime(), nextAction: '净化图像' }));

        const interferenceLines = modalElement.querySelectorAll('path[fill="none"]');
        interferenceLines.forEach(line => line.remove());
        await new Promise(resolve => setTimeout(resolve, 200));

        const captchaImageContainer = modalElement.querySelector('.ant-modal-body > div');
        if (!captchaImageContainer) {
            showErrorPanel('页面元素错误', '无法定位到图形验证码的容器。');
            return;
        }

        const canvas = await html2canvas(captchaImageContainer);
        const imageBase64 = canvas.toDataURL('image/png');

        // 在UI中显示验证码截图
        updatePanel(panelTemplate({
            status: 'status-running',
            icon: '🧠',
            fullEmail: currentEmail,
            elapsed: getElapsedTime(),
            nextAction: '发送至AI识别 (10秒超时)',
            captchaImage: imageBase64
        }));

        // 10秒超时控制
        let timeoutId = setTimeout(() => {
            if (!globalTaskManager.isForceResetting) {
                console.log('AI captcha recognition timed out after 10 seconds, refreshing page...');
                updatePanel(`
                    <div class="reg-panel-header" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <div class="reg-header-title"><span class="reg-header-icon">⏰</span><div>AI识别超时</div></div>
                        <div class="reg-version">v3.4.5</div>
                    </div>
                    <div class="reg-panel-body">
                        <div class="reg-status-card status-waiting">
                            <div class="reg-status-header">
                                <div class="reg-status-icon">🔄</div>
                                <div>
                                    <div class="reg-status-title">AI识别超时 (10秒)</div>
                                    <div class="reg-status-subtitle">正在刷新页面重新尝试...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                setTimeout(() => {
                    if (!globalTaskManager.isForceResetting) {
                        window.location.reload();
                    }
                }, 2000);
            }
        }, AI_CAPTCHA_TIMEOUT);

        const request = GM_xmlhttpRequest({
            method: 'POST',
            url: AI_API_ENDPOINT,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AI_API_KEY}` },
            data: JSON.stringify({
                model: AI_CAPTCHA_MODEL,
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: AI_CAPTCHA_PROMPT },
                        { type: 'image_url', image_url: { url: imageBase64 } }
                    ]
                }],
                temperature: 0.1,
                max_tokens: 20
            }),
            onload: (response) => {
                globalTaskManager.removeRequest(request);
                clearTimeout(timeoutId);

                if (globalTaskManager.isForceResetting) return;

                if (response.status >= 200 && response.status < 300) {
                    const data = JSON.parse(response.responseText);
                    const rawCode = data.choices[0].message.content;
                    const captchaCode = rawCode.trim().replace(/[^a-zA-Z0-9]/g, '');

                    if (captchaCode && captchaCode.length > 2) {
                        updatePanel(panelTemplate({
                            status: 'status-success',
                            icon: '✅',
                            code: captchaCode,
                            rawResponse: rawCode,
                            captchaImage: imageBase64
                        }));
                        const input = modalElement.querySelector('input.ant-input');
                        const okButton = modalElement.querySelector('button.ant-btn-primary');
                        if (input && okButton) {
                            setInputValue(input, captchaCode);
                            okButton.click();
                            setTimeout(fetchEmailAndProcess, 1000);
                        } else {
                            showErrorPanel('页面元素错误', '在模态框中找不到输入框或确认按钮。');
                        }
                    } else {
                        showErrorPanel('AI识别失败', `未能从图像中提取有效验证码`, { endpoint: AI_API_ENDPOINT, errorMessage: `原始返回: "${rawCode}"` });
                    }
                } else {
                    showErrorPanel('AI API错误', `识别图形验证码时服务器返回错误`, { statusCode: response.status, endpoint: AI_API_ENDPOINT, errorMessage: response.responseText });
                }
            },
            onerror: (error) => {
                globalTaskManager.removeRequest(request);
                clearTimeout(timeoutId);
                if (!globalTaskManager.isForceResetting) {
                    showErrorPanel('网络错误', '请求AI API(图形验证码)失败', { endpoint: AI_API_ENDPOINT, errorMessage: '请检查网络连接或API域名' });
                }
            }
        });

        globalTaskManager.addRequest(request);
    }

    // --- 核心流程: 填表与触发验证 ---
    async function fillRegistrationForm() {
        if (currentAccountIndex >= accountQueue.length || globalTaskManager.isForceResetting) return;

        const currentAccountData = accountQueue[currentAccountIndex];
        const [email] = currentAccountData.split(/:|----/);
        currentEmail = email;
        taskStatus = 'running';

        if (!taskStartTime) {
            taskStartTime = Date.now();
        }

        const updateUI = (step, title, sub, details) => {
            if (!globalTaskManager.isForceResetting) {
                updatePanel(`
                    <div class="reg-panel-header"><div class="reg-header-title"><span class="reg-header-icon">⚙️</span><div>任务执行中</div></div><div class="reg-version">v3.4.5</div></div>
                    <div class="reg-panel-body">${updateProgress(step, title, sub, details)}<div class="reg-button-group-2"><button id="reg-pause-btn" class="reg-btn-info">暂停任务</button><button id="reg-reset-btn" class="reg-btn-danger">强制重置</button></div></div>
                `);
            }
        };

        updateUI(1, '填写表单', '定位并填充注册信息...', { status: 'status-running', icon: '📝', fullEmail: email, elapsed: getElapsedTime(), nextAction: '等待页面元素加载' });

        const interval = setInterval(() => {
            if (globalTaskManager.isForceResetting) {
                clearInterval(interval);
                return;
            }

            const emailInput = document.querySelector('#email');
            const pwdInput = document.querySelector('#password');
            const pwdConfirm = document.querySelector('#password_confirm');
            const inviteCode = document.querySelector('#invite_code');
            const getCodeBtn = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim() === '获取验证码');

            if (emailInput && pwdInput && pwdConfirm && inviteCode && getCodeBtn) {
                clearInterval(interval);
                setInputValue(emailInput, email);
                setInputValue(pwdInput, email);
                setInputValue(pwdConfirm, email);
                setInputValue(inviteCode, '81pkh2ywu3s6vmtcfxz3dptor');
                getCodeBtn.click();

                updateUI(2, '检测验证方式', '等待人机验证模块加载...', { status: 'status-waiting', icon: '🔍', fullEmail: email, elapsed: getElapsedTime() });

                let checkModalInterval = null;
                let modalTimeout = null;

                const startModalDetection = () => {
                    checkModalInterval = setInterval(() => {
                        if (globalTaskManager.isForceResetting) {
                            clearInterval(checkModalInterval);
                            clearTimeout(modalTimeout);
                            return;
                        }

                        const captchaModal = document.querySelector('.ant-modal-wrap:not([style*="display: none"]) .ant-modal-content');
                        if (captchaModal) {
                            clearInterval(checkModalInterval);
                            clearTimeout(modalTimeout);
                            solveGraphicalCaptcha(captchaModal);
                        }
                    }, 500);

                    modalTimeout = setTimeout(() => {
                        if (!globalTaskManager.isForceResetting) {
                            clearInterval(checkModalInterval);
                            showErrorPanel('超时错误', '10秒内未检测到图形验证码弹窗。');
                        }
                    }, 10000);
                };

                startModalDetection();
            }
        }, 500);

        setTimeout(() => {
            if (!globalTaskManager.isForceResetting) {
                clearInterval(interval);
            }
        }, 15000);
    }

    // --- 核心流程: 获取邮件并处理 ---
    async function fetchEmailAndProcess() {
        if (globalTaskManager.isForceResetting) return;

        const panelTemplate = (step, title, sub, details) => `
            <div class="reg-panel-header"><div class="reg-header-title"><span class="reg-header-icon">⚙️</span><div>任务执行中</div></div><div class="reg-version">v3.4.5</div></div>
            <div class="reg-panel-body">${updateProgress(step, title, sub, details)}<div class="reg-button-group-2"><button id="reg-pause-btn" class="reg-btn-info">暂停任务</button><button id="reg-reset-btn" class="reg-btn-danger">强制重置</button></div></div>`;
        updatePanel(panelTemplate(3, '等待邮件', '延迟10秒确保邮件送达', { status: 'status-waiting', icon: '⏱', fullEmail: currentEmail, elapsed: getElapsedTime(), waitTime: 10, nextAction: '获取邮件' }));
        await new Promise(resolve => setTimeout(resolve, 10000));

        if (globalTaskManager.isForceResetting) return;

        const currentAccountData = accountQueue[currentAccountIndex];
        if (!currentAccountData) { showErrorPanel('数据丢失', '找不到当前账号的注册信息。'); return; }
        const parts = currentAccountData.split(/:|----/);
        const email = parts[0]; let clientId, refreshToken;
        if (parts[2] && parts[3]) {
            if (parts[2].length === 36 && parts[2].includes('-')) { clientId = parts[2]; refreshToken = parts[3]; }
            else if (parts[3].length === 36 && parts[3].includes('-')) { clientId = parts[3]; refreshToken = parts[2]; }
            else { clientId = parts[2]; refreshToken = parts[3]; }
        } else { showErrorPanel('凭证格式错误', '无法解析Client ID和令牌。'); return; }
        const mailApiUrl = `${MAIL_API_BASE_URL}/api/mail-new?refresh_token=${encodeURIComponent(refreshToken)}&client_id=${encodeURIComponent(clientId)}&email=${encodeURIComponent(email)}&mailbox=Junk&response_type=html`;
        updatePanel(panelTemplate(4, '获取邮件', '从服务器读取验证邮件...', { status: 'status-running', icon: '📧', fullEmail: currentEmail, elapsed: getElapsedTime(), apiEndpoint: MAIL_API_BASE_URL + '/...' }));

        const request = GM_xmlhttpRequest({
            method: 'GET', url: mailApiUrl,
            onload: (response) => {
                globalTaskManager.removeRequest(request);
                if (!globalTaskManager.isForceResetting) {
                    if (response.status >= 200 && response.status < 300) {
                        extractCodeWithAI(response.responseText);
                    } else {
                        handleRetryableError('邮件API错误', `服务器返回错误`, { statusCode: response.status, endpoint: MAIL_API_BASE_URL });
                    }
                }
            },
            onerror: (error) => {
                globalTaskManager.removeRequest(request);
                if (!globalTaskManager.isForceResetting) {
                    handleRetryableError('网络错误', '请求邮件API失败', { endpoint: MAIL_API_BASE_URL, errorMessage: '请检查网络连接或API域名' });
                }
            }
        });

        globalTaskManager.addRequest(request);
    }

    // --- 核心流程: AI提取邮件验证码 ---
    function extractCodeWithAI(emailHtml) {
        if (globalTaskManager.isForceResetting) return;

        const panelTemplate = (details) => `
            <div class="reg-panel-header"><div class="reg-header-title"><span class="reg-header-icon">🤖</span><div>AI识别中</div></div><div class="reg-version">v3.4.5</div></div>
            <div class="reg-panel-body">${updateProgress(5, 'AI智能识别', '正在从邮件中提取验证码...', details)}<div class="reg-button-group-2"><button id="reg-pause-btn" class="reg-btn-info">暂停任务</button><button id="reg-reset-btn" class="reg-btn-danger">强制重置</button></div></div>`;
        updatePanel(panelTemplate({ status: 'status-running', icon: '🧠', fullEmail: currentEmail, elapsed: getElapsedTime(), apiEndpoint: AI_API_ENDPOINT }));
        const prompt = `Task: Extract the verification code from the following HTML email content. Instruction: The verification code may be a combination of numbers and letters. It is usually a short, standalone string. Please analyze the content and return ONLY the verification code itself, with no extra text, explanations, or labels. HTML Content: """ ${emailHtml} """ Verification Code:`;

        const request = GM_xmlhttpRequest({
            method: 'POST', url: AI_API_ENDPOINT, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AI_API_KEY}` },
            data: JSON.stringify({ model: AI_MAIL_MODEL, messages: [{ role: 'user', content: prompt }], temperature: 0.1, max_tokens: 20 }),
            onload: (response) => {
                globalTaskManager.removeRequest(request);
                if (!globalTaskManager.isForceResetting) {
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        const rawCode = data.choices[0].message.content;
                        const code = rawCode.trim().replace(/["'.,\s]/g, '');
                        if (code && code.length > 2 && code.length < 15) {
                            GM_deleteValue('retryCount');
                            updatePanel(panelTemplate({ status: 'status-success', icon: '✅', fullEmail: currentEmail, elapsed: getElapsedTime(), apiEndpoint: AI_API_ENDPOINT, rawResponse: rawCode }));
                            setTimeout(() => fillCodeAndSubmit(code), 500);
                        } else {
                            handleRetryableError('AI识别失败', `未能从邮件中提取有效验证码`, { endpoint: AI_API_ENDPOINT, errorMessage: `原始返回: "${rawCode}"` });
                        }
                    } else {
                        handleRetryableError('AI API错误', `服务器返回错误`, { statusCode: response.status, endpoint: AI_API_ENDPOINT, errorMessage: response.responseText });
                    }
                }
            },
            onerror: (error) => {
                globalTaskManager.removeRequest(request);
                if (!globalTaskManager.isForceResetting) {
                    handleRetryableError('网络错误', '请求AI API失败', { endpoint: AI_API_ENDPOINT, errorMessage: '请检查网络连接或API域名' });
                }
            }
        });

        globalTaskManager.addRequest(request);
    }

    // --- 核心流程: 填写验证码并提交 ---
    function fillCodeAndSubmit(code) {
        if (globalTaskManager.isForceResetting) return;

        const codeInput = document.querySelector('#code');
        const submitBtn = Array.from(document.querySelectorAll('button span')).find(s => s.textContent.trim() === '提 交')?.closest('button');
        if (codeInput && submitBtn) {
            updatePanel(`
                <div class="reg-panel-header"><div class="reg-header-title"><span class="reg-header-icon">✅</span><div>提交注册</div></div><div class="reg-version">v3.4.5</div></div>
                <div class="reg-panel-body">${updateProgress(6, '完成注册', '自动提交最终信息...', { status: 'status-success', icon: '🎉', fullEmail: currentEmail, elapsed: getElapsedTime(), code: code })}</div>
            `);
            setInputValue(codeInput, code);
            submitBtn.click();
            completeCurrentAccountAndProceed();
        } else {
            showErrorPanel('页面元素错误', '找不到验证码输入框或提交按钮。');
        }
    }

    // --- 完成当前账号并处理下一个 ---
    function completeCurrentAccountAndProceed() {
        if (globalTaskManager.isForceResetting) return;

        batchStats.success++;
        saveBatchState();

        // 如果开启了手动退出登录，显示手动退出界面
        if (manualLogout) {
            showManualLogoutInterface();
        } else {
            // 原有的自动处理逻辑
            const waitSeconds = 8;
            let countdown = waitSeconds;

            const updateCountdownUI = () => {
                if (globalTaskManager.isForceResetting) return;
                const remainingAccounts = batchStats.total - currentAccountIndex - 1;
                const isLastAccount = remainingAccounts === 0;
                updatePanel(`
                    <div class="reg-panel-header" style="background: linear-gradient(135deg, #10b981, #047857);">
                        <div class="reg-header-title"><span class="reg-header-icon">🎉</span><div>账号成功</div></div>
                        <div class="reg-version">v3.4.5</div>
                    </div>
                    <div class="reg-panel-body">
                        ${getBatchProgressHTML()}
                        <div class="reg-status-card status-success">
                            <div class="reg-status-header"><div class="reg-status-icon">🎯</div><div><div class="reg-status-title">账号注册成功！</div><div class="reg-status-subtitle">${isLastAccount ? `${countdown}秒后完成所有注册并退出...` : `${countdown}秒后继续下一个账号...`}</div></div></div>
                             <div class="reg-status-details">
                                <div class="reg-detail-item"><span>注册邮箱:</span><span class="reg-detail-value">${currentEmail}</span></div>
                                <div class="reg-detail-item"><span>本次用时:</span><span class="reg-detail-value">${getElapsedTime()}</span></div>
                                <div class="reg-detail-item"><span>剩余账号:</span><span class="reg-detail-value">${remainingAccounts}个</span></div>
                            </div>
                        </div>
                        ${getBatchStatsHTML()}
                    </div>
                `);
            };

            updateCountdownUI();

            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0 && !globalTaskManager.isForceResetting) {
                    updateCountdownUI();
                } else {
                    clearInterval(countdownInterval);
                    if (!globalTaskManager.isForceResetting) {
                        proceedToNextAccountOrFinish();
                    }
                }
            }, 1000);
        }
    }

    // --- 手动退出登录界面 ---
    function showManualLogoutInterface() {
        if (globalTaskManager.isForceResetting) return;

        const remainingAccounts = batchStats.total - currentAccountIndex - 1;
        const isLastAccount = remainingAccounts === 0;

        updatePanel(`
            <div class="reg-panel-header" style="background: linear-gradient(135deg, #10b981, #047857);">
                <div class="reg-header-title"><span class="reg-header-icon">🎉</span><div>注册成功</div></div>
                <div class="reg-version">v3.4.5</div>
            </div>
            <div class="reg-panel-body">
                ${getBatchProgressHTML()}
                <div class="reg-manual-logout-waiting">
                    <div class="reg-manual-logout-title">📋 账号注册成功！等待手动操作</div>
                    <div class="reg-manual-logout-subtitle">当前已登录账号，请检查注册结果后点击下方按钮继续</div>
                </div>
                <div class="reg-status-card status-success">
                    <div class="reg-status-header"><div class="reg-status-icon">⏸</div><div><div class="reg-status-title">等待手动退出登录</div><div class="reg-status-subtitle">您可以查看注册结果，确认无误后手动退出</div></div></div>
                    <div class="reg-status-details">
                        <div class="reg-detail-item"><span>注册邮箱:</span><span class="reg-detail-value">${currentEmail}</span></div>
                        <div class="reg-detail-item"><span>本次用时:</span><span class="reg-detail-value">${getElapsedTime()}</span></div>
                        <div class="reg-detail-item"><span>剩余账号:</span><span class="reg-detail-value">${remainingAccounts}个</span></div>
                        <div class="reg-detail-item"><span>下一步:</span><span class="reg-detail-value">${isLastAccount ? '完成所有注册' : '继续下一个账号'}</span></div>
                    </div>
                    <div class="reg-timestamp">完成时间: ${getCurrentTime()}</div>
                </div>
                ${getBatchStatsHTML()}
                <div class="reg-button-group-4">
                    <button id="reg-logout-continue-btn" class="reg-btn-primary">${isLastAccount ? '退出完成' : '退出继续'}</button>
                    <button id="reg-pause-btn" class="reg-btn-info">暂停任务</button>
                    <button id="reg-skip-btn" class="reg-btn-warning">跳过账号</button>
                    <button id="reg-reset-btn" class="reg-btn-danger">强制重置</button>
                </div>
            </div>
        `);
    }

    // --- 处理下一个账号或完成批量注册 ---
    function proceedToNextAccountOrFinish() {
        if (globalTaskManager.isForceResetting) return;

        currentAccountIndex++;
        saveBatchState();

        if (currentAccountIndex < accountQueue.length) {
            // 还有更多账号，继续注册
            performApiLogoutAndProceed();
        } else {
            // 所有账号都完成了，先执行最后一个账号的登出操作
            performFinalLogoutAndShowSummary();
        }
    }

    // --- 最后一个账号的登出操作 ---
    function performFinalLogoutAndShowSummary() {
        if (globalTaskManager.isForceResetting) return;

        updatePanel(`
            <div class="reg-panel-header" style="background: linear-gradient(135deg, #6366f1, #4338ca);">
                <div class="reg-header-title"><span class="reg-header-icon">🧹</span><div>最终清理</div></div>
                <div class="reg-version">v3.4.5</div>
            </div>
            <div class="reg-panel-body">
                ${getBatchProgressHTML()}
                <div class="reg-status-card status-running">
                    <div class="reg-status-header"><div class="reg-status-icon">🔄</div><div><div class="reg-status-title">正在退出最后一个账号...</div><div class="reg-status-subtitle">清理登录状态并准备显示总结</div></div></div>
                </div>
                ${getBatchStatsHTML()}
            </div>
        `);

        // 调用登出API
        const request = GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://gptgod.online/api/user/logout',
            timeout: 8000,
            onload: function(response) {
                globalTaskManager.removeRequest(request);
                console.log(`Final logout API response status: ${response.status}. Showing completion summary.`);
                if (!globalTaskManager.isForceResetting) {
                    setTimeout(showBatchCompletionSummary, 1000);
                }
            },
            onerror: function(error) {
                globalTaskManager.removeRequest(request);
                console.error('Final logout API request failed. Showing summary anyway.', error);
                if (!globalTaskManager.isForceResetting) {
                    setTimeout(showBatchCompletionSummary, 1000);
                }
            },
            ontimeout: function() {
                globalTaskManager.removeRequest(request);
                console.warn('Final logout API request timed out. Showing summary anyway.');
                if (!globalTaskManager.isForceResetting) {
                    setTimeout(showBatchCompletionSummary, 1000);
                }
            }
        });

        globalTaskManager.addRequest(request);
    }

    // --- 批量注册完成总结 ---
    function showBatchCompletionSummary() {
        if (globalTaskManager.isForceResetting) return;

        taskStatus = 'completed';
        updatePanel(`
            <div class="reg-panel-header" style="background: linear-gradient(135deg, #10b981, #047857);">
                <div class="reg-header-title"><span class="reg-header-icon">🏆</span><div>批量完成</div></div>
                <div class="reg-version">v3.4.5</div>
            </div>
            <div class="reg-panel-body">
                <div class="reg-status-card status-success">
                    <div class="reg-status-header"><div class="reg-status-icon">🎊</div><div><div class="reg-status-title">批量注册任务完成！</div><div class="reg-status-subtitle">所有账号处理完毕，已退出最后账号登录</div></div></div>
                    <div class="reg-status-details">
                        <div class="reg-detail-item"><span>处理总数:</span><span class="reg-detail-value">${batchStats.total}个账号</span></div>
                        <div class="reg-detail-item"><span>成功注册:</span><span class="reg-detail-value">${batchStats.success}个账号</span></div>
                        <div class="reg-detail-item"><span>失败数量:</span><span class="reg-detail-value">${batchStats.failed}个账号</span></div>
                        <div class="reg-detail-item"><span>成功率:</span><span class="reg-detail-value">${Math.round((batchStats.success / batchStats.total) * 100)}%</span></div>
                    </div>
                </div>
                ${getBatchStatsHTML()}
                <button id="reg-reset-btn" class="reg-btn-primary">开始新的批量任务</button>
            </div>
        `);

        // 清理批量任务数据
        setTimeout(() => {
            if (!globalTaskManager.isForceResetting) {
                GM_deleteValue('accountQueue');
                GM_deleteValue('currentAccountIndex');
                GM_deleteValue('batchStats');
                GM_deleteValue('taskStatus');
            }
        }, 2000);
    }

    // --- 跳过当前账号 ---
    function skipCurrentAccount() {
        if (globalTaskManager.isForceResetting) return;

        batchStats.failed++;
        currentAccountIndex++;
        saveBatchState();

        if (currentAccountIndex < accountQueue.length) {
            performApiLogoutAndProceed();
        } else {
            performFinalLogoutAndShowSummary();
        }
    }

    // --- API登出并继续下一个账号 ---
    function performApiLogoutAndProceed() {
        if (globalTaskManager.isForceResetting) return;

        updatePanel(`
            <div class="reg-panel-header" style="background: linear-gradient(135deg, #6366f1, #4338ca);">
                <div class="reg-header-title"><span class="reg-header-icon">🧹</span><div>准备下一个</div></div>
                <div class="reg-version">v3.4.5</div>
            </div>
            <div class="reg-panel-body">
                ${getBatchProgressHTML()}
                <div class="reg-status-card status-running">
                    <div class="reg-status-header"><div class="reg-status-icon">🔄</div><div><div class="reg-status-title">正在登出当前账号...</div><div class="reg-status-subtitle">准备注册下一个账号</div></div></div>
                </div>
                ${getBatchStatsHTML()}
            </div>
        `);

        // 重置单个任务的状态
        currentStep = 0;
        taskStartTime = null;
        currentEmail = '';
        GM_deleteValue('retryCount');

        // 调用登出API
        const request = GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://gptgod.online/api/user/logout',
            timeout: 8000,
            onload: function(response) {
                globalTaskManager.removeRequest(request);
                console.log(`Logout API response status: ${response.status}. Proceeding to next account.`);
                if (!globalTaskManager.isForceResetting) {
                    setTimeout(() => window.location.href = 'https://gptgod.online/#/register', 1000);
                }
            },
            onerror: function(error) {
                globalTaskManager.removeRequest(request);
                console.error('Logout API request failed. Proceeding anyway.', error);
                if (!globalTaskManager.isForceResetting) {
                    setTimeout(() => window.location.href = 'https://gptgod.online/#/register', 1000);
                }
            },
            ontimeout: function() {
                globalTaskManager.removeRequest(request);
                console.warn('Logout API request timed out. Proceeding anyway.');
                if (!globalTaskManager.isForceResetting) {
                    setTimeout(() => window.location.href = 'https://gptgod.online/#/register', 1000);
                }
            }
        });

        globalTaskManager.addRequest(request);
    }

    // --- 【修复】事件委托和主逻辑 ---
    document.body.addEventListener('click', function(event) {
        // 【修复】首先检查是否在控制面板内点击
        if (!event.target.closest('#reg-control-panel')) return;

        // 【修复】优先处理手动退出登录开关
        if (event.target.closest('#reg-manual-logout-toggle')) {
            console.log('Manual logout toggle clicked');
            manualLogout = !manualLogout;
            saveBatchState();

            // 更新开关状态
            const toggle = event.target.closest('#reg-manual-logout-toggle').querySelector('.reg-toggle-switch');
            if (toggle) {
                toggle.className = `reg-toggle-switch${manualLogout ? ' active' : ''}`;
            }

            console.log(`Manual logout mode: ${manualLogout ? 'enabled' : 'disabled'}`);
            return;
        }

        // 【修复】然后处理按钮点击
        const button = event.target.closest('button');
        if (!button) return;

        switch (button.id) {
            case 'reg-start-btn':
                const promptText = `请输入批量注册信息（支持多个账号）:\n\n格式：每行一个账号\n邮箱:密码:client_id:令牌\n或\n邮箱:密码:令牌:client_id\n\n支持 : 和 ---- 分隔符。\n\n示例：\ntest1@outlook.com:pass123:client-id-1:token-1\ntest2@outlook.com:pass456:client-id-2:token-2`;
                const inputData = prompt(promptText, '');
                if (inputData) {
                    const accounts = parseAccountList(inputData);
                    if (accounts.length > 0) {
                        accountQueue = accounts;
                        currentAccountIndex = 0;
                        batchStats = { total: accounts.length, success: 0, failed: 0 };
                        taskStatus = 'running';
                        saveBatchState();
                        GM_setValue('retryCount', 0);

                        // 启动用户活动检测
                        initUserActivityDetection();

                        window.location.href = 'https://gptgod.online/#/register';
                    } else {
                        showErrorPanel('输入格式错误', '请确保每行包含完整的4部分账号信息。');
                    }
                }
                break;
            case 'reg-close-btn':
                removePanel();
                break;
            case 'reg-reset-btn':
                if (confirm('⚠️ 确定要强制重置当前批量任务吗？\n\n这将中止所有正在运行的请求和定时器！')) {
                    resetTask();
                }
                break;
            case 'reg-skip-btn':
                if (confirm('确定要跳过当前账号并继续下一个吗？')) {
                    skipCurrentAccount();
                }
                break;
            case 'reg-pause-btn':
                if (confirm('确定要暂停当前批量任务吗？')) {
                    pauseTask();
                }
                break;
            case 'reg-resume-btn':
                console.log('Resume button clicked');
                if (confirm('确定要恢复批量注册任务吗？')) {
                    resumeTask();
                }
                break;
            case 'reg-logout-continue-btn':
                console.log('Manual logout and continue button clicked');
                proceedToNextAccountOrFinish();
                break;
        }
    });

    // --- 主逻辑 ---
    function main() {
        loadBatchState();

        const hash = window.location.hash;
        const hasAccounts = accountQueue.length > 0;
        const isValidIndex = currentAccountIndex < accountQueue.length;

        console.log('Main function called:', { hash, hasAccounts, isValidIndex, taskStatus, currentAccountIndex, accountQueueLength: accountQueue.length, manualLogout });

        // 如果任务被暂停，显示暂停界面
        if (taskStatus === 'paused' && hasAccounts) {
            console.log('Showing paused interface');
            showPausedInterface();
            return;
        }

        if (hash === '#/register' && hasAccounts && isValidIndex && taskStatus === 'running') {
            console.log('Starting registration form fill');
            // 启动用户活动检测
            initUserActivityDetection();
            fillRegistrationForm();
        } else if (hasAccounts && isValidIndex && taskStatus === 'running') {
            console.log('Redirecting to register page');
            window.location.href = 'https://gptgod.online/#/register';
        } else if (hasAccounts && !isValidIndex && taskStatus === 'completed') {
            // 所有账号都完成了
            console.log('Showing completion summary');
            showBatchCompletionSummary();
        } else {
            console.log('Showing initial prompt');
            if (!document.getElementById('reg-control-panel')) {
                showInitialPrompt();
            }
        }
    }

    function run() { setTimeout(main, 1000); }
    window.addEventListener('load', run);
    window.addEventListener('hashchange', run);
})();