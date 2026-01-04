// ==UserScript==
// @name         原神激励领奖
// @namespace    http://tampermonkey.net/
// @version      20250725003805
// @description  B站原神激励活动自动领奖脚本，简洁高效的自动化工具
// @author       You
// @match        https://www.bilibili.com/blackboard/era/award-exchange.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538700/%E5%8E%9F%E7%A5%9E%E6%BF%80%E5%8A%B1%E9%A2%86%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/538700/%E5%8E%9F%E7%A5%9E%E6%BF%80%E5%8A%B1%E9%A2%86%E5%A5%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 全局状态 ==========
    const state = {
        isAutoClicking: false,
        clickCount: 0,
        timers: {
            autoClick: null,
            timeUpdate: null,
            monitor: null
        }
    };

    // ========== 配置管理 ==========
    const config = {
        interval: 1000, // 默认点击间隔
        customTimeEnabled: false, // 新策略开关
        customTimes: ["00:29:58", "00:59:58"], // 默认时间点
        
        load() {
            this.interval = parseInt(localStorage.getItem('click-interval')) || 1000;
            this.customTimeEnabled = localStorage.getItem('custom-time-enabled') === 'true';
            const times = localStorage.getItem('custom-times');
            if (times) {
                try {
                    const arr = JSON.parse(times);
                    if (Array.isArray(arr) && arr.length === 2) {
                        this.customTimes = arr;
                    }
                } catch {}
            }
        },
        
        save() {
            localStorage.setItem('click-interval', this.interval);
            localStorage.setItem('custom-time-enabled', this.customTimeEnabled);
            localStorage.setItem('custom-times', JSON.stringify(this.customTimes));
        }
    };

    // ========== 按钮管理 ==========
    const buttonManager = {
        selector: "#app > div > div.home-wrap.select-disable > section.tool-wrap > div.button.exchange-button",
        stopTexts: ["查看奖励", "每日库存已达上限", "暂无领取资格"],
        
        get element() {
            return document.querySelector(this.selector);
        },
        
        get text() {
            return this.element?.textContent.trim() || '';
        },
        
        removeDisable() {
            const button = this.element;
            if (button) {
                button.classList.remove("disable");
                console.log("Button disable class removed");
            }
        },
        
        shouldAutoClick() {
            return this.text === "领取奖励";
        },
        
        shouldInitialClick() {
            return this.text !== "查看奖励";
        },
        
        shouldStop() {
            return this.stopTexts.includes(this.text);
        },
        
        click() {
            const button = this.element;
            if (button) {
                button.click();
                return true;
            }
            return false;
        },
        
        isVerificationPresent() {
            return document.querySelector("body > div.geetest_panel.geetest_wind > div.geetest_panel_box.geetest_no_logo.geetest_panelshowclick > div.geetest_panel_next") !== null;
        }
    };

    // ========== 消息系统 ==========
    const messageSystem = {
        container: null,
        
        init() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    pointer-events: none;
                `;
                document.body.appendChild(this.container);
            }
        },
        
        show(message, type = 'info', duration = 3000) {
            this.init();
            
            const colors = {
                success: '#51CF66',
                info: '#339AF0', 
                error: '#FF6B6B'
            };
            
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                padding: 12px 20px;
                background-color: ${colors[type]};
                color: white;
                border-radius: 8px;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                max-width: 300px;
                transform: translateX(-100%);
                opacity: 0;
                transition: all 0.3s ease-out;
                pointer-events: auto;
            `;
            
            this.container.appendChild(notification);
            
            // 动画显示
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
                notification.style.opacity = '1';
            }, 10);
            
            // 自动移除
            setTimeout(() => {
                notification.style.transform = 'translateX(-100%)';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
    };

    // ========== 时间显示 ==========
    const timeDisplay = {
        iframe: null,
        
        init() {
            // 创建隐藏iframe获取网络时间
            this.iframe = document.createElement('iframe');
            this.iframe.src = 'https://www.bjtime.net/';
            this.iframe.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;';
            document.body.appendChild(this.iframe);
            
            this.iframe.onload = () => this.startUpdate();
            this.iframe.onerror = () => this.startLocalUpdate();
            
            // 5秒超时使用本地时间
            setTimeout(() => {
                const display = document.getElementById('time-display');
                if (display && display.textContent === '00:00:00.000') {
                    this.startLocalUpdate();
                }
            }, 5000);
        },
        
        startUpdate() {
            state.timers.timeUpdate = setInterval(() => {
                const timeEl = document.getElementById('time-display');
                const dateEl = document.getElementById('date-display');
                if (!timeEl || !dateEl) return;
                
                try {
                    const iframeDoc = this.iframe.contentDocument;
                    const timeElement = iframeDoc.querySelector('#cTime');
                    
                    if (timeElement?.textContent) {
                        const parts = timeElement.textContent.split(' ');
                        if (parts.length >= 2) {
                            dateEl.textContent = parts[0];
                            timeEl.textContent = parts[1];
                            this.checkAutoRefresh(parts[1]);
                            return;
                        }
                    }
                } catch (e) {
                    // 跨域错误，使用本地时间
                }
                
                this.updateLocal(timeEl, dateEl);
            }, 100);
        },
        
        startLocalUpdate() {
            state.timers.timeUpdate = setInterval(() => {
                const timeEl = document.getElementById('time-display');
                const dateEl = document.getElementById('date-display');
                if (timeEl && dateEl) {
                    this.updateLocal(timeEl, dateEl);
                }
            }, 100);
        },
        
        updateLocal(timeEl, dateEl) {
            const now = new Date();
            const date = now.getFullYear() + '-' + 
                        String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(now.getDate()).padStart(2, '0');
            const time = String(now.getHours()).padStart(2, '0') + ':' + 
                        String(now.getMinutes()).padStart(2, '0') + ':' + 
                        String(now.getSeconds()).padStart(2, '0') + '.' + 
                        String(now.getMilliseconds()).padStart(3, '0');
            
            dateEl.textContent = date;
            timeEl.textContent = time;
            this.checkAutoRefresh(time);
        },
        
        checkAutoRefresh(timeString) {
            // 只保留自定义时间点策略
            if (config.customTimeEnabled) {
                for (const t of config.customTimes) {
                    if (timeString.startsWith(t)) {
                        messageSystem.show(`到达自定义领奖时间 ${t}，正在自动领奖...`, 'info');
                        autoClicker.start();
                        break;
                    }
                }
            }
        },
        
        cleanup() {
            if (state.timers.timeUpdate) {
                clearInterval(state.timers.timeUpdate);
                state.timers.timeUpdate = null;
            }
        }
    };

    // ========== 自动点击控制 ==========
    const autoClicker = {
        start() {
            if (state.isAutoClicking) return;
            
            const button = buttonManager.element;
            if (!button) {
                messageSystem.show("找不到领奖按钮！", "error");
                return;
            }
            
            state.isAutoClicking = true;
            state.clickCount = 0;
            ui.updateButton();
            messageSystem.show(`开始自动领奖 (${config.interval}ms间隔)`, "success");
            
            state.timers.autoClick = setInterval(() => {
                // 检查验证码
                if (buttonManager.isVerificationPresent()) {
                    console.log('Verification panel detected, skipping click');
                    return;
                }
                
                // 检查停止条件
                if (buttonManager.shouldStop()) {
                    this.stop(`${buttonManager.text} (总共点击 ${state.clickCount} 次)`);
                    return;
                }
                
                // 执行点击
                if (buttonManager.click()) {
                    state.clickCount++;
                    messageSystem.show(`第 ${state.clickCount} 次点击领奖`, "info", 1500);
                } else {
                    this.stop(`按钮消失，已停止 (总共点击 ${state.clickCount} 次)`);
                }
            }, config.interval);
            
            // 30秒超时保护
            setTimeout(() => {
                if (state.isAutoClicking) {
                    this.stop(`自动领奖已超时停止 (总共点击 ${state.clickCount} 次)`);
                }
            }, 10000);
        },
        
        stop(reason = null) {
            if (!state.isAutoClicking) return;
            
            if (state.timers.autoClick) {
                clearInterval(state.timers.autoClick);
                state.timers.autoClick = null;
            }
            
            state.isAutoClicking = false;
            ui.updateButton();
            
            const message = reason || `已停止自动领奖 (总共点击 ${state.clickCount} 次)`;
            messageSystem.show(message, "info");
            state.clickCount = 0;
        },
        
        toggle() {
            if (state.isAutoClicking) {
                this.stop();
            } else {
                this.start();
            }
        }
    };

    // ========== 监控系统 ==========
    const monitor = {
        hasAutoClicked: false,
        
        start() {
            state.timers.monitor = setInterval(() => {
                // 移除按钮禁用状态
                buttonManager.removeDisable();
                
                // 检查自动点击条件
                if (!this.hasAutoClicked && buttonManager.shouldAutoClick()) {
                    console.log('Auto-trigger detected: button text is "领取奖励"');
                    messageSystem.show('检测到"领取奖励"，自动点击一次', 'success');
                    buttonManager.click();
                    this.hasAutoClicked = true;
                }
                
                // 检查页面错误
                this.checkPageError();
            }, 1000);
        },
        
        checkPageError() {
            const errorDialog = document.querySelector('body > div.v-dialog > div.v-dialog__wrap > div > div.v-dialog__body');
            if (errorDialog) {
                console.log('Error dialog detected, refreshing page...');
                messageSystem.show('检测到页面错误，正在刷新...', 'info');
                this.cleanup();
                setTimeout(() => window.location.reload(), 100);
            }
        },
        
        cleanup() {
            if (state.timers.monitor) {
                clearInterval(state.timers.monitor);
                state.timers.monitor = null;
            }
        }
    };

    // ========== UI控制 ==========
    const ui = {
        panel: null,
        
        create() {
            this.panel = document.createElement("div");
            this.panel.style.cssText = `
                position: fixed;
                top: 2%;
                right: 2%;
                z-index: 9999;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                min-width: 180px;
                display: flex;
                flex-direction: column;
            `;
            
            // 创建内容
            this.panel.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 12px;background:rgba(0,0,0,0.05);border-radius:8px 8px 0 0;cursor:grab;user-select:none;">
                    <span style="font-size:12px;font-weight:bold;color:#333;">自动领奖</span>
                    <div style="width:20px;height:16px;background:rgba(0,0,0,0.1);border-radius:3px;font-size:10px;color:#666;display:flex;align-items:center;justify-content:center;">⋮⋮</div>
                </div>
                <div style="padding:0 12px 6px 12px !important;margin:0 !important;box-sizing:border-box !important;">
                    <button id="control-btn" style="width:100% !important;padding:10px !important;background-color:#00A1D6 !important;color:white !important;border:none !important;border-radius:5px !important;font-size:14px !important;font-weight:bold !important;cursor:pointer !important;margin:4px 0 6px 0 !important;box-sizing:border-box !important;display:block !important;">开始自动领奖</button>
                    <div style="display:flex;align-items:center;gap:8px;margin:0 0 6px 0 !important;">
                        <label style="color:#333;font-size:12px;font-weight:bold;min-width:35px;margin:0 !important;padding:0 !important;">间隔:</label>
                        <select id="interval-select" style="flex:1;padding:4px 8px;border:1px solid #ccc;border-radius:4px;font-size:12px;margin:0 !important;">
                            <option value="100">100ms</option>
                            <option value="200">200ms</option>
                            <option value="500">500ms</option>
                            <option value="800" selected>800ms</option>
                            <option value="1000">1000ms</option>
                        </select>
                    </div>
                    <div style="display:flex;align-items:center;justify-content:space-between;margin:8px 0 0 0 !important;">
                        <span style="color:#333;font-size:12px;font-weight:bold;margin:0 !important;padding:0 !important;">触发自动领奖时间</span>
                        <div id="custom-time-switch" style="position:relative;width:44px;height:24px;background-color:#ccc;border-radius:24px;cursor:pointer;transition:background-color 0.3s;margin:0 !important;">
                            <div style="position:absolute;top:2px;left:2px;width:20px;height:20px;background-color:white;border-radius:50%;transition:left 0.3s;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>
                        </div>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:4px;margin:6px 0 0 0 !important;">
                        <input id="custom-time-1" type="text" maxlength="8" style="padding:4px 6px;border:1px solid #ccc;border-radius:4px;font-size:12px;" placeholder="00:29:58" value="${config.customTimes[0]}">
                        <input id="custom-time-2" type="text" maxlength="8" style="padding:4px 6px;border:1px solid #ccc;border-radius:4px;font-size:12px;" placeholder="00:59:58" value="${config.customTimes[1]}">
                    </div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(74, 144, 226, 0.9), rgba(126, 208, 255, 0.9));color:white;padding:8px 12px;text-align:center;">
                    <div id="time-display" style="font-size:14px;font-weight:600;margin-bottom:1px;">00:00:00.000</div>
                    <div id="date-display" style="font-size:11px;opacity:0.9;">2025-01-19</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(116, 185, 255, 0.9), rgba(162, 210, 255, 0.9));color:#1a365d;padding:6px 12px;text-align:center;border-radius:0 0 8px 8px;">
                    <div style="font-size:10px;font-weight:500;">💡 进入页面后会自动点击一次</div>
                </div>
            `;
            
            document.body.appendChild(this.panel);
            this.bindEvents();
            this.updateSettings();
        },
        
        bindEvents() {
            // 控制按钮
            document.getElementById('control-btn').onclick = () => autoClicker.toggle();
            
            // 间隔选择
            const intervalSelect = document.getElementById('interval-select');
            intervalSelect.value = config.interval;
            intervalSelect.onchange = (e) => {
                config.interval = parseInt(e.target.value);
                config.save();
                messageSystem.show(`点击间隔已设置为 ${config.interval}ms`, "info");
                
                // 如果正在运行，重启
                if (state.isAutoClicking) {
                    autoClicker.stop();
                    setTimeout(() => autoClicker.start(), 100);
                }
            };
            
            // 自定义时间策略开关
            const customTimeSwitch = document.getElementById('custom-time-switch');
            customTimeSwitch.onclick = () => {
                config.customTimeEnabled = !config.customTimeEnabled;
                config.save();
                this.updateCustomTimeSwitch();
                messageSystem.show(`自定义领奖时间已${config.customTimeEnabled ? '开启' : '关闭'}`, "info");
            };

            // 自定义时间输入框
            const customTime1 = document.getElementById('custom-time-1');
            const customTime2 = document.getElementById('custom-time-2');
            const validate = v => /^\d{2}:\d{2}:\d{2}$/.test(v);
            customTime1.onchange = (e) => {
                let v = e.target.value.trim();
                if (!validate(v)) {
                    messageSystem.show('时间格式应为 HH:MM:SS', 'error');
                    e.target.value = config.customTimes[0];
                    return;
                }
                config.customTimes[0] = v;
                config.save();
                messageSystem.show(`自定义领奖时间1已设置为 ${v}`, 'info');
            };
            customTime2.onchange = (e) => {
                let v = e.target.value.trim();
                if (!validate(v)) {
                    messageSystem.show('时间格式应为 HH:MM:SS', 'error');
                    e.target.value = config.customTimes[1];
                    return;
                }
                config.customTimes[1] = v;
                config.save();
                messageSystem.show(`自定义领奖时间2已设置为 ${v}`, 'info');
            };
            
            // 拖动功能
            this.addDragFunctionality();
        },
        
        updateButton() {
            const btn = document.getElementById('control-btn');
            if (btn) {
                if (state.isAutoClicking) {
                    btn.textContent = "停止自动领奖";
                    btn.style.backgroundColor = "#FF6B6B";
                } else {
                    btn.textContent = "开始自动领奖";
                    btn.style.backgroundColor = "#00A1D6";
                }
            }
        },
        
        updateCustomTimeSwitch() {
            const switchEl = document.getElementById('custom-time-switch');
            const thumb = switchEl.firstElementChild;
            if (config.customTimeEnabled) {
                switchEl.style.backgroundColor = '#4CAF50';
                thumb.style.left = '22px';
            } else {
                switchEl.style.backgroundColor = '#ccc';
                thumb.style.left = '2px';
            }
        },
        
        updateSettings() {
            document.getElementById('interval-select').value = config.interval;
            this.updateCustomTimeSwitch();
            document.getElementById('custom-time-1').value = config.customTimes[0];
            document.getElementById('custom-time-2').value = config.customTimes[1];
        },
        
        addDragFunctionality() {
            const titleBar = this.panel.firstElementChild;
            let isDragging = false;
            let startX, startY, startLeft, startTop;
            
            titleBar.onmousedown = (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = this.panel.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;
                titleBar.style.cursor = 'grabbing';
                e.preventDefault();
            };
            
            document.onmousemove = (e) => {
                if (!isDragging) return;
                
                let newLeft = startLeft + (e.clientX - startX);
                let newTop = startTop + (e.clientY - startY);
                
                // 边界检查
                const maxLeft = window.innerWidth - this.panel.offsetWidth;
                const maxTop = window.innerHeight - this.panel.offsetHeight;
                
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));
                
                this.panel.style.left = newLeft + 'px';
                this.panel.style.top = newTop + 'px';
                this.panel.style.right = 'auto';
                this.panel.style.bottom = 'auto';
            };
            
            document.onmouseup = () => {
                if (isDragging) {
                    isDragging = false;
                    titleBar.style.cursor = 'grab';
                }
            };
        }
    };

    // ========== 初始化 ==========
    function init() {
        setTimeout(() => {
            config.load();
            buttonManager.removeDisable();
            ui.create();
            timeDisplay.init();
            monitor.start();
            
            // 页面加载后立即检查自动点击
            setTimeout(() => {
                if (buttonManager.shouldInitialClick()) {
                    console.log('Initial auto-click triggered');
                    messageSystem.show('页面加载完成，自动点击一次', 'success');
                    buttonManager.click();
                    monitor.hasAutoClicked = true;
                }
            }, 100);
            
            console.log("Auto-click userscript initialized (v2)");
        }, 100);
    }

    // ========== 页面加载检测 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========== 页面卸载清理 ==========
    window.addEventListener('beforeunload', () => {
        Object.values(state.timers).forEach(timer => {
            if (timer) clearInterval(timer);
        });
        timeDisplay.cleanup();
        monitor.cleanup();
    });

})();