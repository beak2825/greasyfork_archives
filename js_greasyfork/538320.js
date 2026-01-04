// ==UserScript==
// @name         持续定时刷新器 (Continuous Timer Refresher)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在Cloud Workstations环境中每60秒自动刷新页面，保持会话活跃
// @author       Gemini
// @match        https://*.cloudworkstations.dev/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538320/%E6%8C%81%E7%BB%AD%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E5%99%A8%20%28Continuous%20Timer%20Refresher%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538320/%E6%8C%81%E7%BB%AD%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E5%99%A8%20%28Continuous%20Timer%20Refresher%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const REFRESH_INTERVAL_SECONDS = 60; // 固定刷新间隔（秒）
    const STORAGE_KEY_NEXT_RUN = 'continuousRefresherNextRun'; // 存储下一次运行时间戳的键名

    // --- 状态变量 ---
    let refreshTimerId = null;      // 存储刷新定时器的ID
    let countdownTimerId = null;  // 存储倒计时更新定时器的ID
    let isRunning = false;        // 标记当前页面脚本是否已启动计时器
    let nextRunTimestamp = 0;     // 下次运行的目标时间戳

    // --- 功能函数 ---

    // 更新倒计时显示到控制台
    function updateCountdown() {
        if (!isRunning || nextRunTimestamp <= 0) {
             if (countdownTimerId) clearInterval(countdownTimerId);
             countdownTimerId = null;
             return;
        }

        const now = Date.now();
        const remainingMs = nextRunTimestamp - now;
        const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

        if (remainingSeconds <= 0) {
            console.log('定时刷新器: 即将刷新...');
            if (countdownTimerId) clearInterval(countdownTimerId);
            countdownTimerId = null;
        } else {
            console.log(`定时刷新器: 运行中, ${remainingSeconds} 秒后刷新`);
        }
    }

    // 执行页面刷新，并设置下一次刷新
    function performRefresh() {
        console.log('定时刷新器: 执行刷新');
        // 1. 清除当前页面的所有计时器
        if (refreshTimerId) clearTimeout(refreshTimerId);
        if (countdownTimerId) clearInterval(countdownTimerId);
        refreshTimerId = null;
        countdownTimerId = null;
        isRunning = false;

        // 2. 计算并保存下一次运行的时间戳
        const nextRunCheck = GM_getValue(STORAGE_KEY_NEXT_RUN, 0);
        if (nextRunCheck > 0) {
             const nextTimestamp = Date.now() + REFRESH_INTERVAL_SECONDS * 1000;
             GM_setValue(STORAGE_KEY_NEXT_RUN, nextTimestamp);
             console.log(`定时刷新器: 下次刷新时间戳已设置: ${new Date(nextTimestamp).toLocaleTimeString()}`);
        } else {
             console.log('定时刷新器: 检测到已停止，刷新后不再继续。');
        }

        // 3. 执行刷新
        setTimeout(() => {
            window.location.reload();
        }, 50);
    }

    // 启动刷新流程
    function startRefresh(isAutoStart = false) {
        let delayMs;

        if (isAutoStart) {
            // 自动启动（页面加载时）
            nextRunTimestamp = GM_getValue(STORAGE_KEY_NEXT_RUN, 0);
            const now = Date.now();

            if (nextRunTimestamp <= 0) {
                console.log('定时刷新器: 自动启动检查 - 未设置下次运行时间，重新开始。');
                // 重新开始一个新的刷新周期
                nextRunTimestamp = now + REFRESH_INTERVAL_SECONDS * 1000;
                GM_setValue(STORAGE_KEY_NEXT_RUN, nextRunTimestamp);
                delayMs = REFRESH_INTERVAL_SECONDS * 1000;
            } else {
                delayMs = Math.max(0, nextRunTimestamp - now);
                console.log(`定时刷新器: 自动启动检查 - 计划时间: ${new Date(nextRunTimestamp).toLocaleTimeString()}, 剩余: ${delayMs}ms`);

                if (delayMs < 100) {
                    console.log('定时刷新器: 自动启动检查 - 时间已到，立即刷新。');
                    performRefresh();
                    return;
                }
            }
        } else {
            // 手动启动
            delayMs = REFRESH_INTERVAL_SECONDS * 1000;
            nextRunTimestamp = Date.now() + delayMs;
            GM_setValue(STORAGE_KEY_NEXT_RUN, nextRunTimestamp);
            console.log(`定时刷新器: 手动启动 - 间隔: ${REFRESH_INTERVAL_SECONDS}s, 下次运行: ${new Date(nextRunTimestamp).toLocaleTimeString()}`);
        }

        // 清除可能存在的旧定时器
        if (refreshTimerId) clearTimeout(refreshTimerId);
        if (countdownTimerId) clearInterval(countdownTimerId);

        isRunning = true;

        // 启动新的定时器
        refreshTimerId = setTimeout(performRefresh, delayMs);
        updateCountdown(); // 立即更新一次显示
        countdownTimerId = setInterval(updateCountdown, 30000); // 每30秒输出一次状态到控制台
        
        console.log(`定时刷新器: 已启动，将在 ${REFRESH_INTERVAL_SECONDS} 秒后刷新页面`);
    }

    // 停止刷新流程
    function stopRefresh() {
        if (refreshTimerId) {
            clearTimeout(refreshTimerId);
            refreshTimerId = null;
        }
        if (countdownTimerId) {
            clearInterval(countdownTimerId);
            countdownTimerId = null;
        }

        GM_setValue(STORAGE_KEY_NEXT_RUN, 0);
        isRunning = false;
        nextRunTimestamp = 0;

        console.log('定时刷新器: 已停止');
    }

    // --- 初始化 ---
    function initialize() {
        console.log('定时刷新器脚本: 在 Cloud Workstations 环境中初始化...');
        
        // 自动启动刷新
        nextRunTimestamp = GM_getValue(STORAGE_KEY_NEXT_RUN, 0);
        if (nextRunTimestamp > 0 && Date.now() < nextRunTimestamp + 1000) {
             console.log('定时刷新器: 检测到未完成的刷新任务，尝试自动恢复...');
             startRefresh(true);
        } else {
             console.log('定时刷新器: 开始新的刷新周期...');
             startRefresh(false);
        }
        
        // 添加页面可见性变化监听，确保页面激活时恢复刷新
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && !isRunning) {
                console.log('定时刷新器: 页面重新激活，恢复刷新');
                startRefresh(true);
            }
        });
    }

    // 页面加载完成后自动初始化
    initialize();

})();
