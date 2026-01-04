// ==UserScript==
// @name         139Phone自动进入程序
// @description  定时自动检测点击进入云机（带倒计时显示）
// @namespace    kba_139_phone
// @author       kkkkkba
// @license      MIT
// @match        https://cloudphoneh5.buy.139.com/*
// @match        https://cloud139.com/*
// @grant        GM_notification
// @grant        GM_addStyle
// @run-at       document-idle
// @version      1.4.5

// @downloadURL https://update.greasyfork.org/scripts/539496/139Phone%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E7%A8%8B%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/539496/139Phone%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E7%A8%8B%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    // 配置项
    const config = {
        // 测试用5秒
        intervalTime: 5 * 1000,  
        // 正式使用3分钟
        // intervalTime: 3 * 60 * 1000,  
        // 显示通知
        showNotifications: false,
        // 显示倒计时
        showCountdown: true,
        
        buttons: [
            {
                name: "进入云机",
                selector: 'span[data-v-01aeb1d6].normal, span.normal[data-v-01aeb1d6]',
                textMatch: "进入云机"
            },
            {
                name: "重连",
                selector: 'span.van-button__text',
                textMatch: "重连"
            },
            {
                name: "现在进入",
                selector: 'span.van-button__text',
                textMatch: "现在进入"
            },
            {
                name: "知道了",
                selector: 'span.van-button__text',
                textMatch: "知道了"
            },
        ],
        
    };

        
    
    GM_addStyle(`
        .auto-clicker-notification {
            position: fixed;
            bottom: 60px;
            right: 20px;
            max-width: 300px;
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 4px;
            font-size: 14px;
            z-index: 99998;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.3s, fadeOut 0.3s 2.7s forwards;
            transform: translateZ(0);
            font-family: monospace;
            line-height: 1.4;
            pointer-events: none;
            user-select: none;
        }
        .countdown-display {
            position: fixed;
            bottom: 10px;
            right: 20px;
            padding: 5px 10px;
            background: rgba(0, 0, 0, 0.5);
            color: #2ecc71;
            border-radius: 4px;
            font-size: 13px;
            z-index: 99998;
            font-family: monospace;
            pointer-events: none;
            user-select: none;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `);
    
    // 运行状态
    const state = {
        startTime: new Date(),
        lastClickTime: new Date(),
        nextCheckTime: new Date(),
        countdownElement: null
    };
    
    // 初始化倒计时显示
    function initCountdownDisplay() {
        if (!config.showCountdown) return;
        
        state.countdownElement = document.createElement('div');
        state.countdownElement.className = 'countdown-display';
        state.countdownElement.textContent = '0';
        document.body.appendChild(state.countdownElement);
        
        // 每秒更新倒计时
        setInterval(updateCountdown, 1000);
    }
    
    // 更新倒计时显示
    function updateCountdown() {
        if (!state.countdownElement) return;
        
        const now = new Date();
        const timeLeft = Math.max(0, state.nextCheckTime - now);
        const secondsLeft = Math.ceil(timeLeft / 1000);
        const sinceLastClick = now - state.lastClickTime;

        //

        state.countdownElement.textContent = 
            `⏳ 下次检测: ${formatDuration(timeLeft)} | 
            ⏱️ 上次点击: ${formatDuration(sinceLastClick)}前`;
        // 快到时变为黄色
        if (secondsLeft <= 10) {
            state.countdownElement.style.color = '#E54438';
        } else {
            state.countdownElement.style.color = '#2ecc71';
        }
    }
    
    // 格式化时间为 HH:MM:SS
    function formatDuration(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }
    
    // 显示通知
    function showNotification(message, type = 'info') {
        if (!config.showNotifications) return;
        
        const colors = {
            info: '#3498db',
            success: '#2ecc71',
            warning: '#f39c12',
            error: '#e74c3c'
        };
        
        const notification = document.createElement('div');
        notification.className = 'auto-clicker-notification';
        notification.textContent = message;
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // 查找目标元素
    function findTargetElements() {
        const foundElements = [];
        
        config.buttons.forEach(buttonConfig => {
            let elements = Array.from(document.querySelectorAll(buttonConfig.selector));
            
            if (buttonConfig.textMatch) {
                elements = elements.filter(el => 
                    el.textContent.includes(buttonConfig.textMatch)
                );
            }
            
            if (elements.length > 0) {
                foundElements.push({
                    config: buttonConfig,
                    element: elements[0]
                });
            }
        });
        
        return foundElements;
    }
    
    // 模拟点击
    function simulateClick(element, buttonName) {
        if (!element) return false;
        
        try {
            element.scrollIntoViewIfNeeded();
            
            const events = [
                new MouseEvent('mouseover', { bubbles: true }),
                new MouseEvent('mousemove', { bubbles: true }),
                new MouseEvent('mousedown', { bubbles: true }),
                new MouseEvent('mouseup', { bubbles: true }),
                new MouseEvent('click', { bubbles: true })
            ];
            
            events.forEach(event => {
                setTimeout(() => {
                    element.dispatchEvent(event);
                }, 50);
            });
            
            // 更新最后点击时间
            state.lastClickTime = new Date();
            return true;
        } catch (e) {
            showNotification(`点击 ${buttonName} 失败`, 'error');
            return false;
        }
    }
    
    // 主点击函数
    function autoClickButtons() {
        if (document.hidden) return;
        
        // 更新下次检测时间
        state.nextCheckTime = new Date(Date.now() + config.intervalTime);
        
        const targetElements = findTargetElements();
        
        if (targetElements.length > 0) {
            targetElements.forEach(({config: btnConfig, element}) => {
                if (simulateClick(element, btnConfig.name)) {
                    showNotification(`✅ 已点击 ${btnConfig.name}`, 'success');
                } else {
                    showNotification(`⚠️ ${btnConfig.name} 点击未成功`, 'warning');
                }
            });
        } else {
            // 显示未找到按钮和运行时长
            const now = new Date();
            const sinceLastClick = now - state.lastClickTime;
            
            showNotification(
                `⌛ 上次点击 ${formatDuration(sinceLastClick)}前`,
                'info'
            );
        }
    }
    
    // 定时器控制
    let intervalId = null;
    
    function startInterval() {
        stopInterval();
        state.startTime = new Date();
        state.lastClickTime = new Date();
        state.nextCheckTime = new Date(Date.now() + config.intervalTime);
        
        initCountdownDisplay();
        autoClickButtons();
        intervalId = setInterval(autoClickButtons, config.intervalTime);
        showNotification(`🔄 自动点击已启动\n间隔: ${config.intervalTime/1000}秒`, 'info');
    }
    
    function stopInterval() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            if (state.countdownElement) {
                state.countdownElement.remove();
                state.countdownElement = null;
            }
            showNotification('⏹️ 自动点击已停止', 'info');
        }
    }
    
    // 初始化
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) autoClickButtons();
    });
    
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(startInterval, 1000);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(startInterval, 1000);
        });
    }
    
    // 全局API
    window.AutoClicker = {
        start: startInterval,
        stop: stopInterval,
        clickNow: autoClickButtons,
        setInterval: function(ms) {
            config.intervalTime = ms;
            startInterval();
        },
        toggleNotifications: function(show) {
            config.showNotifications = show !== false;
            showNotification(`通知已${config.showNotifications ? '开启' : '关闭'}`);
        },
        toggleCountdown: function(show) {
            config.showCountdown = show !== false;
            if (show && intervalId && !state.countdownElement) {
                initCountdownDisplay();
            } else if (!show && state.countdownElement) {
                state.countdownElement.remove();
                state.countdownElement = null;
            }
        },
        getStatus: function() {
            const now = new Date();
            return {
                isRunning: intervalId !== null,
                nextCheck: state.nextCheckTime ? new Date(state.nextCheckTime) : null,
                lastClick: new Date(state.lastClickTime),
                runtime: formatDuration(now - state.startTime),
                sinceLastClick: formatDuration(now - state.lastClickTime)
            };
        }
    };
})();