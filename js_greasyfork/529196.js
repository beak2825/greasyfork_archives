// ==UserScript==
// @name         B站全局倒计时
// @namespace    https://greasyfork.org/zh-CN/scripts/457839
// @version      8.0
// @description  全站同步倒计时，支持所有子域名，归零关闭所有B站页面，每日两小时限制，支持暂停功能
// @author       OYYS
// @match        https://*.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_notification
// @connect      bilibili.com
// @run-at       document-start
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/529196/B%E7%AB%99%E5%85%A8%E5%B1%80%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/529196/B%E7%AB%99%E5%85%A8%E5%B1%80%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储初始化
    const initStorage = () => {
        // 检查是否需要重置每日时间限制
        const lastResetDate = GM_getValue('lastResetDate');
        const currentDate = new Date().toLocaleDateString();

        if (!lastResetDate || lastResetDate !== currentDate) {
            GM_setValue('globalEndTime', Date.now() + 7200000); // 每日两小时
            GM_setValue('timerStatus', 'running');
            GM_setValue('lastResetDate', currentDate);
            GM_setValue('paused', false);
            GM_setValue('pausedRemaining', 0);
        } else {
            const paused = GM_getValue('paused');
            if (paused) {
                // 从暂停时间恢复
                const pausedRemaining = GM_getValue('pausedRemaining');
                const newEndTime = Date.now() + pausedRemaining;
                GM_setValue('globalEndTime', newEndTime);
                GM_setValue('paused', false);
                GM_setValue('pausedRemaining', 0);
            } else if (!GM_getValue('globalEndTime')) {
                GM_setValue('globalEndTime', Date.now() + 7200000);
                GM_setValue('timerStatus', 'running');
            }
        }
    }

    // 创建倒计时UI
    const createTimerUI = () => {
        const timer = document.createElement('div');
        timer.id = 'bili-global-timer';
        timer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: #00ff00;
            padding: 15px 25px;
            border-radius: 15px;
            font-family: 'Segoe UI', sans-serif;
            font-size: 1.5em;
            box-shadow: 0 0 15px rgba(0,255,0,0.3);
            z-index: 2147483647;
            transition: all 0.3s;
            cursor: pointer;
        `;
        timer.title = '点击暂停/继续';
        document.body.appendChild(timer);

        // 点击倒计时区域暂停/继续
        timer.addEventListener('click', () => {
            const paused = GM_getValue('paused');
            if (paused) {
                // 恢复
                const pausedRemaining = GM_getValue('pausedRemaining');
                const newEndTime = Date.now() + pausedRemaining;
                GM_setValue('globalEndTime', newEndTime);
                GM_setValue('paused', false);
                GM_setValue('pausedRemaining', 0);
                GM_notification('倒计时已恢复', '操作提醒');
            } else {
                // 暂停
                const endTime = GM_getValue('globalEndTime');
                const remaining = endTime - Date.now();
                GM_setValue('pausedRemaining', remaining);
                GM_setValue('paused', true);
                GM_notification('倒计时已暂停', '操作提醒');
                // 关闭所有B站页面
                const closeAllTabs = () => {
                    try {
                        window.close();
                        // 通过递归关闭所有同源页面
                        if (window.opener) {
                            window.opener.postMessage('forceCloseBiliTabs', '*');
                        }
                    } catch(e) {
                        GM_notification('请手动关闭B站标签页', '操作提醒');
                    }
                }
                closeAllTabs();
            }
            location.reload();
        });
    }

    // 跨域同步控制器
    const syncController = () => {
        const checkStatus = () => {
            const status = GM_getValue('timerStatus');
            const endTime = GM_getValue('globalEndTime');
            const paused = GM_getValue('paused');

            if (status === 'expired' || Date.now() > endTime) {
                GM_setValue('timerStatus', 'expired');
                return true;
            }
            return false;
        }

        const closeAllTabs = () => {
            try {
                window.close();
                // 通过递归关闭所有同源页面
                if (window.opener) {
                    window.opener.postMessage('forceCloseBiliTabs', '*');
                }
            } catch(e) {
                GM_notification('请手动关闭B站标签页', '操作提醒');
            }
        }

        // 消息监听
        window.addEventListener('message', (e) => {
            if (e.data === 'forceCloseBiliTabs') {
                closeAllTabs();
            }
        });

        // 状态轮询
        setInterval(() => {
            if (checkStatus()) {
                document.getElementById('bili-global-timer').style.display = 'none';
                closeAllTabs();
                GM_setValue('timerStatus', 'expired');
            }
        }, 1000);
    }

    // 动态更新显示
    const updateDisplay = () => {
        const timerElement = document.getElementById('bili-global-timer');
        const formatTime = (ms) => {
            const hours = Math.floor(ms / 3600000);
            const minutes = Math.floor((ms % 3600000) / 60000);
            const seconds = Math.floor((ms % 60000) / 1000);
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        const update = () => {
            const paused = GM_getValue('paused');
            if (paused) {
                timerElement.innerHTML = `⏸️ 当前状态：暂停`;
                timerElement.style.color = '#ffff00';
                timerElement.style.animation = '';
                return;
            }

            const endTime = GM_getValue('globalEndTime');
            const remaining = endTime - Date.now();

            timerElement.innerHTML = `⏳ 今日剩余时间：${formatTime(remaining)}`;

            // 样式变化
            if (remaining < 300000) { // 最后5分钟
                timerElement.style.color = '#ff0000';
                timerElement.style.animation = 'alertBlink 1s infinite';
            } else {
                timerElement.style.animation = '';
            }
        }

        setInterval(update, 1000);
        update();
    }

    // 注入动画样式
    GM_addStyle(`
        @keyframes alertBlink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }
        #bili-global-timer:hover {
            transform: scale(1.05);
        }
    `);

    // 初始化执行
    initStorage();
    createTimerUI();
    updateDisplay();
    syncController();

    // 右键菜单
    GM_registerMenuCommand('重置倒计时', () => {
        GM_setValue('globalEndTime', Date.now() + 7200000);
        GM_setValue('timerStatus', 'running');
        GM_setValue('paused', false);
        GM_setValue('pausedRemaining', 0);
        location.reload();
    });

    GM_registerMenuCommand('增加1小时', () => {
        const currentEnd = GM_getValue('globalEndTime');
        GM_setValue('globalEndTime', currentEnd + 3600000);
    });

    GM_registerMenuCommand('查看今日剩余时间', () => {
        const endTime = GM_getValue('globalEndTime');
        const remaining = endTime - Date.now();
        GM_notification(`今日剩余时间：${Math.floor(remaining / 3600000)}小时${Math.floor((remaining % 3600000) / 60000)}分钟`, '时间提醒');
    });

    GM_registerMenuCommand('暂停/继续倒计时', () => {
        const paused = GM_getValue('paused');
        if (paused) {
            // 恢复
            const pausedRemaining = GM_getValue('pausedRemaining');
            const newEndTime = Date.now() + pausedRemaining;
            GM_setValue('globalEndTime', newEndTime);
            GM_setValue('paused', false);
            GM_setValue('pausedRemaining', 0);
            GM_notification('倒计时已恢复', '操作提醒');
        } else {
            // 暂停
            const endTime = GM_getValue('globalEndTime');
            const remaining = endTime - Date.now();
            GM_setValue('pausedRemaining', remaining);
            GM_setValue('paused', true);
            GM_notification('倒计时已暂停', '操作提醒');
            // 关闭所有B站页面
            const closeAllTabs = () => {
                try {
                    window.close();
                    // 通过递归关闭所有同源页面
                    if (window.opener) {
                        window.opener.postMessage('forceCloseBiliTabs', '*');
                    }
                } catch(e) {
                    GM_notification('请手动关闭B站标签页', '操作提醒');
                }
            }
            closeAllTabs();
        }
        location.reload();
    });
})();