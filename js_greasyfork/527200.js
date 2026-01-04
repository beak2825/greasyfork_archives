// ==UserScript==
// @name         网页保活助手
// @namespace    http://tampermonkey.net/
// @version      5.2.2
// @description  【多站点独立配置】智能状态同步 + 跨Tab保活控制（每个网站独立设置）+AJAX心跳
// @match        *://ecp.sgcc.com.cn/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527200/%E7%BD%91%E9%A1%B5%E4%BF%9D%E6%B4%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527200/%E7%BD%91%E9%A1%B5%E4%BF%9D%E6%B4%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 生成带网站标识的存储键
    const currentSite = window.location.hostname;
    const getSiteKey = (key) => `${currentSite}_${key}`;

    // 配置存储（每个网站独立）
    const CONFIG = {
        keepAliveEnabled: GM_getValue(getSiteKey('keepAliveEnabled'), true),
        keepAliveInterval: GM_getValue(getSiteKey('keepAliveInterval'), 300),
        inactivityLimit: GM_getValue(getSiteKey('inactivityLimit'), 600),
        forceRefreshEnabled: GM_getValue(getSiteKey('forceRefreshEnabled'), false),
        lastActivity: GM_getValue(getSiteKey('lastActivity'), Date.now())
    };

    // 运行时状态
    let state = {
        refreshTimer: null,
        keepAliveTimer: null,
        pendingRefresh: false
    };

    // 视觉样式
    GM_addStyle(`
        #control-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 50px;
            height: 50px;
            z-index: 1000000;
            cursor: pointer;
        }
        #control-container:hover #control-panel {
            display: block !important;
        }
        #control-panel {
            display: none;
            position: absolute;
            left: 0;
            top: 50px;
            background: rgba(255,255,255,0.98);
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            width: 320px;
            z-index: 1000001;
        }
        #refresh-warning {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: lightyellow;
            color: #000;
            padding: 20px 30px;
            border-radius: 10px;
            font-size: 18px;
            z-index: 999999;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .status-indicator {
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            z-index: 999998;
        }
        .active-status { background: #28a745; color: white; }
        .inactive-status { background: #dc3545; color: white; }
    `);

    // 控制面板
    function createControlPanel() {
        const container = document.createElement('div');
        container.id = 'control-container';
        const panel = document.createElement('div');
        panel.id = 'control-panel';
        panel.innerHTML = `
            <h3 style="margin:0 0 15px 0;">保活控制中心 - ${currentSite}</h3>
            <label style="display:block; margin:10px 0;">
                <input type="checkbox" id="keepAliveEnabled" ${CONFIG.keepAliveEnabled ? 'checked' : ''}>
                启用智能保活
            </label>
            <label style="display:block; margin:10px 0;">
                保活间隔(秒):
                <input type="number" id="keepAliveInterval" value="${CONFIG.keepAliveInterval}" style="width:80px;">
            </label>
            <label style="display:block; margin:10px 0;">
                无操作超时(秒):
                <input type="number" id="inactivityLimit" value="${CONFIG.inactivityLimit}" style="width:80px;">
            </label>
            <label style="display:block; margin:10px 0;">
                <input type="checkbox" id="forceRefreshEnabled" ${CONFIG.forceRefreshEnabled ? 'checked' : ''}>
                强制全页刷新
            </label>
            <div style="margin-top:15px; color:#666; font-size:12px;">
                当前状态: <span id="statusText">检测中...</span>
            </div>
        `;
        container.appendChild(panel);
        document.body.appendChild(container);

        const inputs = panel.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', handleSettingChange);
        });
        updateStatusDisplay();
    }

    // 设置变更处理
    function handleSettingChange(e) {
        const target = e.target;
        switch(target.id) {
            case 'keepAliveEnabled':
                CONFIG.keepAliveEnabled = target.checked;
                GM_setValue(getSiteKey('keepAliveEnabled'), target.checked);
                if (!target.checked) stopKeepAlive();
                break;
            case 'keepAliveInterval':
                CONFIG.keepAliveInterval = Math.max(0, parseInt(target.value) || 300);
                GM_setValue(getSiteKey('keepAliveInterval'), CONFIG.keepAliveInterval);
                resetKeepAlive();
                break;
            case 'inactivityLimit':
                CONFIG.inactivityLimit = Math.max(0, parseInt(target.value) || 600);
                GM_setValue(getSiteKey('inactivityLimit'), CONFIG.inactivityLimit);
                break;
            case 'forceRefreshEnabled':
                CONFIG.forceRefreshEnabled = target.checked;
                GM_setValue(getSiteKey('forceRefreshEnabled'), target.checked);
                break;
        }
        updateStatusDisplay();
    }
    // 设置菜单
    // 菜单项注册函数
    function registerMenu() {
        GM_registerMenuCommand(`【${CONFIG.keepAliveEnabled ? '✔' : '✘'}】启用智能保活`, () => {
            CONFIG.keepAliveEnabled = !CONFIG.keepAliveEnabled;
            GM_setValue(getSiteKey('keepAliveEnabled'), CONFIG.keepAliveEnabled);
            registerMenu(); // 重新注册菜单，使显示更新
        });

        GM_registerMenuCommand(`保活间隔: ${CONFIG.keepAliveInterval}秒`, () => {
            const input = prompt("请输入保活间隔（秒）：", CONFIG.keepAliveInterval);
            if (input !== null) {
                CONFIG.keepAliveInterval = parseInt(input) || 300;
                GM_setValue(getSiteKey('keepAliveInterval'), CONFIG.keepAliveInterval);
                registerMenu();
            }
        });

        GM_registerMenuCommand(`无操作超时: ${CONFIG.inactivityLimit}秒`, () => {
            const input = prompt("请输入无操作超时（秒）：", CONFIG.inactivityLimit);
            if (input !== null) {
                CONFIG.inactivityLimit = parseInt(input) || 600;
                GM_setValue(getSiteKey('inactivityLimit'), CONFIG.inactivityLimit);
                registerMenu();
            }
        });

        GM_registerMenuCommand(`【${CONFIG.forceRefreshEnabled ? '✔' : '✘'}】强制全页刷新`, () => {
            CONFIG.forceRefreshEnabled = !CONFIG.forceRefreshEnabled;
            GM_setValue(getSiteKey('forceRefreshEnabled'), CONFIG.forceRefreshEnabled);
            registerMenu();
        });

    }
    // 初始化菜单
    registerMenu();

    // 核心保活逻辑
    function checkActivityState() {
        const now = Date.now();
        const elapsed = now - CONFIG.lastActivity;
        const isInactive = elapsed > CONFIG.inactivityLimit * 1000;

        if ((document.hidden || isInactive) && !state.keepAliveTimer) {
            startKeepAlive();
        } else if (!document.hidden && !isInactive && state.keepAliveTimer) {
            stopKeepAlive();
        }
    }

    function startKeepAlive() {
        if (!CONFIG.keepAliveEnabled) return;
        performKeepAlive();
        state.keepAliveTimer = setInterval(() => {
            performKeepAlive();
        }, CONFIG.keepAliveInterval * 1000);
    }

    function performKeepAlive() {
        GM_xmlhttpRequest({
            method: 'HEAD',
            url: window.location.href,
            onload: (res) => {
                if (CONFIG.forceRefreshEnabled && shouldForceRefresh()) {
                    scheduleForceRefresh();
                }
            },
            onerror: (err) => {
                if (CONFIG.forceRefreshEnabled && shouldForceRefresh()) {
                    scheduleForceRefresh();
                }
            }
        });
    }

    function shouldForceRefresh() {
        return document.hidden || (Date.now() - CONFIG.lastActivity > CONFIG.inactivityLimit * 1000);
    }

    // 刷新控制相关
    function scheduleForceRefresh() {
        if (state.pendingRefresh) return;
        state.pendingRefresh = true;
        showRefreshWarning();
        state.refreshTimer = setTimeout(() => {
            location.reload();
        }, CONFIG.keepAliveInterval * 1000);
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    function handleVisibilityChange() {
        if (!document.hidden && state.pendingRefresh) {
            cancelRefresh();
            stopKeepAlive();
        }
    }

    function cancelRefresh() {
        clearTimeout(state.refreshTimer);
        state.refreshTimer = null;
        state.pendingRefresh = false;
        const warning = document.getElementById('refresh-warning');
        warning && warning.remove();
    }

    function showRefreshWarning() {
        const warning = document.createElement('div');
        warning.id = 'refresh-warning';
        warning.innerHTML = `
            <div>系统即将自动刷新</div>
            <div style="font-size:14px; margin-top:8px;">
                倒计时: <span id="refreshCountdown">${CONFIG.keepAliveInterval}</span>秒
            </div>
        `;
        document.body.appendChild(warning);
        startCountdown();
    }

    function startCountdown() {
        const countdownEl = document.getElementById('refreshCountdown');
        let remaining = CONFIG.keepAliveInterval;
        const timer = setInterval(() => {
            remaining--;
            countdownEl.textContent = remaining;
            if (remaining <= 0) clearInterval(timer);
        }, 1000);
    }
    // 辅助功能
    function stopKeepAlive() {
        clearInterval(state.keepAliveTimer);
        state.keepAliveTimer = null;
        cancelRefresh();
    }

    function resetKeepAlive() {
        stopKeepAlive();
        checkActivityState();
    }

    function updateStatusDisplay() {
        const statusText = document.querySelector('#statusText');
        if (!statusText) return;
        statusText.textContent = state.keepAliveTimer
            ? `工作中 (间隔:${CONFIG.keepAliveInterval}秒)`
            : '待机中 (检测无操作状态)';
    }

    // 事件监听
    function initEventListeners() {
        ['mousemove', 'keydown', 'click'].forEach(event => {
            document.addEventListener(event, () => {
                CONFIG.lastActivity = Date.now();
                GM_setValue(getSiteKey('lastActivity'), CONFIG.lastActivity);
                if (!document.hidden) {
                    cancelRefresh();
                    stopKeepAlive();
                }
                checkActivityState();
            });
        });

        document.addEventListener('visibilitychange', () => {
            checkActivityState();
            updateStatusDisplay();
        });

        setInterval(() => {
            checkActivityState();
            updateStatusDisplay();
        }, 1000);
    }

    // 初始化
    function init() {
        if (document.body) {
            createControlPanel();
            initEventListeners();
            checkActivityState();
        } else {
            window.addEventListener('DOMContentLoaded', init);
        }
    }

    init();
})();