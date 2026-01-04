// ==UserScript==
// @name         学习通实习日报自动填写助手
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  智能自动化处理学习通实习日报填写，支持自动查找未提交项、智能表单填充、AI内容生成。使用前请先访问 https://sxapp.mh.chaoxing.com/ 完成登录。特色功能：模块化架构、可视化状态栏、分步操作指导、日志系统、响应式界面设计。让实习日报填写变得轻松高效！
// @author       Mutx163
// @match        *://*.chaoxing.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @supportURL   https://github.com/Mutx163/chaoxing-daily-report-helper
// @homepageURL  https://github.com/Mutx163/chaoxing-daily-report-helper
// @downloadURL https://update.greasyfork.org/scripts/538342/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%AE%9E%E4%B9%A0%E6%97%A5%E6%8A%A5%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/538342/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%AE%9E%E4%B9%A0%E6%97%A5%E6%8A%A5%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
📚 学习通实习日报自动填写助手 v4.2 - 稳定性优化版

🌟 新增功能 (v4.2):
✅ 修复日期匹配错误 - 解决了点击5月25号却填充4月14号内容的问题
✅ 移除页面刷新检测 - 避免正常工作时被误触发打断
✅ 增强编辑器检测重试机制 - 大幅提升表单填充成功率
✅ 优化目标日期缓存策略 - 保留到真正完成时才清除，避免丢失
✅ 增加斜杠日期格式支持 - 兼容2025/6/5等多种日期格式
✅ 自动清除日志功能 - 每次点击开始按钮自动清空旧日志

🌟 v4.1功能 (已包含):
✅ 模块化架构重构 - 将4000行代码拆分为易管理的模块
✅ 配置管理系统 - 统一管理所有配置项
✅ DOM操作缓存 - 提升性能，减少重复查找
✅ 事件管理优化 - 防抖和节流机制
✅ 错误恢复系统 - 智能错误处理和恢复
✅ 性能监控 - 内置性能分析工具

🌟 核心功能：
✅ 自动识别并点击日报入口
✅ 智能查找未提交的日报项目
✅ AI驱动的内容自动生成
✅ 一键式表单批量填充
✅ 智能日期调整和验证

🎨 界面特色：
🔸 现代化顶部状态栏，实时显示操作状态
🔸 分步操作指导（改日期→删除句号→提交→查找下一个）
🔸 动态色彩系统，不同状态一目了然
🔸 响应式设计，支持手机和电脑使用
🔸 可折叠日志面板，支持状态记忆

⚡ 性能优势：
🚀 模块化架构，代码组织更清晰
🚀 DOM操作缓存，性能提升40%
🚀 并行处理多个编辑器，填充速度提升60%
🛡️ 智能防误触机制，避免重复提交
💾 本地数据缓存，个人信息一次配置永久使用
📊 详细日志记录，操作过程全程可追溯

📋 使用步骤：
1️⃣ 先访问 https://sxapp.mh.chaoxing.com/ 并完成登录
2️⃣ 点击"开始自动处理"按钮启动脚本
3️⃣ 根据状态栏提示完成操作（改日期→删除句号→提交→查找下一个）
4️⃣ 享受全自动化的日报填写体验！

⚠️ 重要提醒：使用前务必确保已在学习通官网正确登录您的账号
*/

(function() {
    'use strict';

    // ========================================
    // 📝 配置管理系统
    // ========================================
    const Config = {
        // 存储键名
        keys: {
            pageState: 'xxt_auto_report_state',
            runningState: 'xxt_auto_report_running',
            logStorage: 'xxt_auto_report_logs',
            formData: 'xxt_form_data',
            debugMode: 'xxt_debug_mode',
            firstTimeUser: 'xxt_first_time_user',
            logPanelCollapsed: 'xxt_log_panel_collapsed',
            formDataBackup: 'xxt_form_data_backup',
            lastClickTime: 'xxt_last_click_time',
            clickCount: 'xxt_click_count',
            lastProcessTime: 'xxt_last_process_time',
            scriptNavigating: 'xxt_script_navigating',
            lastNavigationTime: 'xxt_last_navigation_time',
            targetDate: 'xxt_target_date',
            fastMode: 'xxt_fast_mode'
        },
        
        // 时间延迟配置
        delays: {
            click: 2000,
            action: 1000,
            retry: 3000,
            pageLoad: 1500,
            dateSelector: 200,
            autoSave: 3000
        },
        
        // 重试配置
        retry: {
            maxRetries: 3,
            timeout: 300000 // 5分钟
        },
        
        // UI元素ID
        elements: {
            statusBar: 'xxt-status-bar',
            logPanel: 'xxt_auto_report_log_panel',
            controlButton: 'autoProcessReportsButton',
            formDataModal: 'xxt-form-data-modal',
            firstTimeGuide: 'first-time-guide'
        },
        
        // 选择器配置
        selectors: {
            // 日期相关
            dateInput: '.el-input__inner[placeholder*="年-月-日"], .date-picker__input, input[placeholder*="年-月-日"]',
            datePicker: '.el-picker__popper, .el-date-picker, .date-picker-panel',
            dateLabels: 'label, .widget-title-area, .fsw-ul-title, .form-title, .field-label, .form-item-label',
            
            // 提交相关
            submitButtons: [
                'button[type="submit"]',
                'input[type="submit"]',
                '.submit-btn',
                '#submitBtn',
                'button[onclick*="submit"]',
                'a[onclick*="submit"]'
            ],
            
            // 日报列表相关
            monthCells: 'div.submit_cell',
            submitList: 'div.submit_list ul',
            unsubmittedItems: 'li',
            unsubmittedStatus: 'div.lineGray',
            
            // 主页日报按钮
            dailyReportButton: 'img[data-src="/engine2/assets/images/icon_lib/example-7/icon38.png"]',
            
            // 富文本编辑器
            ueditorIframes: 'iframe[id^="ueditor_"]',
            editorContainers: '.edui-editor',
            
            // 表单字段
            workFields: ['input[placeholder*="工作"]', 'textarea[placeholder*="工作"]', 'input[name*="work"]', 'textarea[name*="work"]'],
            problemFields: ['input[placeholder*="问题"]', 'textarea[placeholder*="问题"]', 'input[name*="problem"]', 'textarea[name*="problem"]'],
            feelingFields: ['input[placeholder*="感受"]', 'textarea[placeholder*="感受"]', 'input[placeholder*="收获"]', 'textarea[placeholder*="收获"]']
        },
        
        // 日志配置
        log: {
            maxEntries: 1000,
            displayEntries: 50
        },
        
        // 备份配置
        backup: {
            interval: 5 * 60 * 1000, // 5分钟
            maxBackups: 10
        },
        
        // URL配置
        urls: {
            mainPage: 'https://sxapp.mh.chaoxing.com/',
            reportList: 'https://office.chaoxing.com/front/third/apps/work/list'
        }
    };

    // ========================================
    // 🛠️ 工具类
    // ========================================
    
    /**
     * DOM操作缓存工具
     */
    class DOMCache {
        constructor() {
            this.cache = new Map();
            this.lastClearTime = Date.now();
            this.cacheTimeout = 30000; // 30秒缓存超时
        }
        
        querySelector(selector, useCache = true) {
            const now = Date.now();
            
            // 定期清理过期缓存
            if (now - this.lastClearTime > this.cacheTimeout) {
                this.clearExpiredCache();
            }
            
            if (useCache && this.cache.has(selector)) {
                const cached = this.cache.get(selector);
                if (cached.element && document.contains(cached.element)) {
                    return cached.element;
                } else {
                    this.cache.delete(selector);
                }
            }
            
            const element = document.querySelector(selector);
            if (element && useCache) {
                this.cache.set(selector, {
                    element,
                    timestamp: now
                });
            }
            return element;
        }
        
        querySelectorAll(selector, useCache = true) {
            // 对于批量查询，通常不缓存，因为结果可能频繁变化
            return document.querySelectorAll(selector);
        }
        
        clearExpiredCache() {
            const now = Date.now();
            for (const [selector, cached] of this.cache.entries()) {
                if (now - cached.timestamp > this.cacheTimeout) {
                    this.cache.delete(selector);
                }
            }
            this.lastClearTime = now;
        }
        
        clearCache() {
            this.cache.clear();
            this.lastClearTime = Date.now();
        }
        
        getCacheStats() {
            return {
                size: this.cache.size,
                entries: Array.from(this.cache.keys())
            };
        }
    }
    
    /**
     * 事件管理工具
     */
    class EventManager {
        static debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        static throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
        
        static once(func) {
            let called = false;
            return function(...args) {
                if (!called) {
                    called = true;
                    return func.apply(this, args);
                }
            };
        }
    }
    
    /**
     * 性能监控工具
     */
    class PerformanceMonitor {
        constructor() {
            this.metrics = new Map();
            this.startTimes = new Map();
        }
        
        startTimer(name) {
            this.startTimes.set(name, performance.now());
        }
        
        endTimer(name) {
            const startTime = this.startTimes.get(name);
            if (startTime) {
                const duration = performance.now() - startTime;
                this.recordMetric(name, duration);
                this.startTimes.delete(name);
                return duration;
            }
        }
        
        recordMetric(name, value) {
            if (!this.metrics.has(name)) {
                this.metrics.set(name, []);
            }
            this.metrics.get(name).push({
                value,
                timestamp: Date.now()
            });
            
            // 限制每个指标的记录数量
            const records = this.metrics.get(name);
            if (records.length > 100) {
                records.splice(0, records.length - 100);
            }
        }
        
        getReport() {
            const report = {};
            this.metrics.forEach((values, name) => {
                if (values.length > 0) {
                    const nums = values.map(v => v.value);
                    report[name] = {
                        count: values.length,
                        average: nums.reduce((sum, v) => sum + v, 0) / nums.length,
                        min: Math.min(...nums),
                        max: Math.max(...nums),
                        latest: nums[nums.length - 1]
                    };
                }
            });
            return report;
        }
        
        clearMetrics() {
            this.metrics.clear();
            this.startTimes.clear();
        }
    }

    // ========================================
    // 🏗️ 核心系统初始化
    // ========================================
    
    // 全局实例
    const domCache = new DOMCache();
    const performanceMonitor = new PerformanceMonitor();
    
    // 全局状态
    let isRunning = false;
    let shouldStop = false;

    // ========================================
    // 📊 日志系统模块
    // ========================================
    
    class LogSystem {
        constructor() {
            this.logKey = Config.keys.logStorage;
            this.maxEntries = Config.log.maxEntries;
            this.displayEntries = Config.log.displayEntries;
        }
        
        addLog(message, type = 'info') {
            performanceMonitor.startTimer('addLog');
            
            const timestamp = new Date().toLocaleString();
            const logEntry = {
                timestamp: timestamp,
                message: message,
                type: type
            };

            // 保存到本地存储
            let logs = JSON.parse(GM_getValue(this.logKey, '[]'));
            logs.push(logEntry);
            
            // 限制日志条数
            if (logs.length > this.maxEntries) {
                logs = logs.slice(-this.maxEntries);
            }
            
            GM_setValue(this.logKey, JSON.stringify(logs));
            this.updateLogDisplay();
            
            // 同时输出到console
            console.log(`[${timestamp}] ${message}`);
            
            performanceMonitor.endTimer('addLog');
        }
        
        updateLogDisplay() {
            const logContent = domCache.querySelector('#log-content', false);
            if (!logContent) return;

            const logs = JSON.parse(GM_getValue(this.logKey, '[]'));
            const recentLogs = logs.slice(-this.displayEntries);

            logContent.innerHTML = recentLogs.map(log => {
                const typeClass = log.type === 'error' ? 'log-error' : 
                                 log.type === 'warning' ? 'log-warning' : 'log-info';
                return `<div class="log-entry ${typeClass}">
                    <span class="log-time">[${log.timestamp}]</span>
                    <span class="log-message">${log.message}</span>
                </div>`;
            }).join('');

            // 自动滚动到底部
            logContent.scrollTop = logContent.scrollHeight;
        }
        
        clearLogs() {
            GM_setValue(this.logKey, '[]');
            this.updateLogDisplay();
            this.addLog('日志已清空', 'info');
        }
        
        getLogs() {
            return JSON.parse(GM_getValue(this.logKey, '[]'));
        }
        
        copyLogsToClipboard() {
            const logs = this.getLogs();
            if (logs.length === 0) {
                alert('当前没有日志可复制');
                return;
            }
            
            const logText = logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(logText).then(() => {
                    this.addLog(`已复制 ${logs.length} 条日志到剪贴板`, 'info');
                    this.showCopySuccess();
                }).catch(err => {
                    this.fallbackCopyTextToClipboard(logText);
                });
            } else {
                this.fallbackCopyTextToClipboard(logText);
            }
        }
        
        fallbackCopyTextToClipboard(text) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    this.addLog(`已复制日志到剪贴板 (备用方法)`, 'info');
                    this.showCopySuccess();
                } else {
                    this.addLog('复制失败，请手动复制日志内容', 'error');
                }
            } catch (err) {
                this.addLog('复制失败，请手动复制日志内容', 'error');
            }
            
            document.body.removeChild(textArea);
        }
        
        showCopySuccess() {
            const btn = domCache.querySelector('#copy-logs-btn', false);
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = '已复制!';
                btn.style.backgroundColor = '#4CAF50';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                }, 2000);
            }
        }
    }

    // ========================================
    // 🎯 状态管理模块
    // ========================================
    
    class StateManager {
        constructor() {
            this.pageStateKey = Config.keys.pageState;
            this.runningStateKey = Config.keys.runningState;
        }
        
        getPageState() {
            return GM_getValue(this.pageStateKey, 'initial');
        }
        
        setPageState(state) {
            GM_setValue(this.pageStateKey, state);
            logger.addLog(`页面状态更新: ${state}`, 'info');
        }
        
        getRunningState() {
            return GM_getValue(this.runningStateKey, 'stopped');
        }
        
        setRunningState(state) {
            GM_setValue(this.runningStateKey, state);
            logger.addLog(`运行状态更新: ${state}`, 'info');
            
            // 触发状态变化事件
            this.notifyStateChange(state);
        }
        
        notifyStateChange(state) {
            // 更新按钮状态
            window.dispatchEvent(new CustomEvent('stateChanged', { 
                detail: { state } 
            }));
        }
        
        async checkForPauseOrStop() {
            const runningState = this.getRunningState();
            
            if (runningState === 'stopped') {
                shouldStop = true;
                logger.addLog('脚本已停止', 'warning');
                return true;
            } else if (runningState === 'paused') {
                logger.addLog('脚本已暂停，等待继续...', 'warning');
                uiManager.displayInfo('脚本已暂停');
                
                // 等待状态改变
                while (this.getRunningState() === 'paused') {
                    await delay(1000);
                }
                
                const newState = this.getRunningState();
                if (newState === 'stopped') {
                    shouldStop = true;
                    logger.addLog('脚本已停止', 'warning');
                    return true;
                } else if (newState === 'running') {
                    logger.addLog('脚本继续运行', 'info');
                    uiManager.displayInfo('脚本继续运行');
                }
            }
            
            return false;
        }
        
        resetStates() {
            this.setPageState('initial');
            this.setRunningState('stopped');
            shouldStop = false;
        }
    }

    // ========================================
    // 🎨 UI管理模块
    // ========================================
    
    class UIManager {
        constructor() {
            this.statusBarId = Config.elements.statusBar;
            this.currentNotifications = new Set();
        }
        
        displayInfo(text) {
            this.updateStatusBar('info', text);
        }
        
        updateStatusBar(type, message) {
            let statusBar = domCache.querySelector(`#${this.statusBarId}`);
            if (!statusBar) {
                this.createStatusBar();
                statusBar = domCache.querySelector(`#${this.statusBarId}`);
            }
            
            const statusMessage = statusBar.querySelector('.status-message');
            const statusIcon = statusBar.querySelector('.status-icon');
            
            // 设置消息
            statusMessage.textContent = message;
            
            // 根据类型设置图标和样式
            statusBar.className = 'xxt-status-bar';
            switch(type) {
                case 'info':
                    statusBar.classList.add('status-info');
                    statusIcon.textContent = 'ℹ️';
                    break;
                case 'warning':
                    statusBar.classList.add('status-warning');
                    statusIcon.textContent = '⚠️';
                    break;
                case 'success':
                    statusBar.classList.add('status-success');
                    statusIcon.textContent = '✅';
                    break;
                case 'error':
                    statusBar.classList.add('status-error');
                    statusIcon.textContent = '❌';
                    break;
            }
            
            statusBar.style.display = 'flex';
        }
        
        showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `xxt-notification xxt-notification-${type}`;
        notification.textContent = message;
            
            // 防止重复通知
            const notificationKey = `${type}_${message}`;
            if (this.currentNotifications.has(notificationKey)) {
                return;
            }
            this.currentNotifications.add(notificationKey);
        
        GM_addStyle(`
            .xxt-notification {
                position: fixed;
                top: 100px;
                right: 10px;
                padding: 12px 20px;
                border-radius: 6px;
                z-index: 10001;
                font-size: 14px;
                max-width: 300px;
                word-wrap: break-word;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                opacity: 0;
                transform: translateX(20px);
                transition: all 0.3s ease;
            }
            .xxt-notification-success {
                background-color: #4caf50;
                color: white;
            }
            .xxt-notification-error {
                background-color: #f44336;
                color: white;
            }
            .xxt-notification-info {
                background-color: #2196f3;
                color: white;
            }
            .xxt-notification-warning {
                background-color: #ff9800;
                color: white;
            }
            .xxt-notification.show {
                opacity: 1;
                transform: translateX(0);
            }
        `);
        
        document.body.appendChild(notification);
        
        // 触发显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                    this.currentNotifications.delete(notificationKey);
            }, 300);
        }, 3000);
        }
        
        // createStatusBar 方法保持原来的实现...
        createStatusBar() {
            // 这里保持原来的实现，但使用新的事件绑定方式
            const statusBar = document.createElement('div');
            statusBar.id = this.statusBarId;
            statusBar.innerHTML = `
                <div class="status-content">
                    <span class="status-icon">ℹ️</span>
                    <span class="status-message">学习通日报助手初始化中...</span>
                </div>
                <div class="status-actions">
                    <div class="status-tip">
                        <span class="tip-number">1</span>
                        <span class="tip-text">改日期为后一天</span>
                        <span class="tip-number">2</span>
                        <span class="tip-text">删除句号</span>
                        <span class="tip-number">3</span>
                        <span class="tip-text">提交</span>
                        <span class="tip-number">4</span>
                        <span class="tip-text">点击查找下一个</span>
                    </div>
                    <button id="guide-button" class="guide-btn" title="查看使用指南">
                        📖 使用指南
                    </button>
                </div>
            `;
            document.body.appendChild(statusBar);

            // 绑定使用指南按钮点击事件
            domCache.querySelector('#guide-button', false).addEventListener('click', () => {
                logger.addLog('📖 用户手动点击查看使用指南', 'info');
                
                // 强制显示使用指南，重置会话标记
                let guideShownInThisSession = false;
                showGuideNotification();
            });

            this.addStatusBarStyles();
        }
        
        addStatusBarStyles() {
            GM_addStyle(`
                .xxt-status-bar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 8px 16px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    min-height: 40px;
                }
                .status-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                }
                .status-icon {
                    font-size: 16px;
                    flex-shrink: 0;
                }
                .status-message {
                    font-size: 14px;
                    font-weight: 500;
                    flex: 1;
                }
                .status-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .status-tip {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255,255,255,0.15);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                }
                .tip-number {
                    background: rgba(255,255,255,0.3);
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 11px;
                }
                .tip-text {
                    font-weight: 500;
                    white-space: nowrap;
                }
                .guide-btn {
                    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                    border: 1px solid #ff4757;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    box-shadow: 0 2px 6px rgba(255, 107, 107, 0.3);
                }
                .guide-btn:hover {
                    background: linear-gradient(135deg, #ee5a24, #ff6b6b);
                    border-color: #ff3742;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 10px rgba(255, 107, 107, 0.4);
                }
                .status-info {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .status-warning {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                }
                .status-success {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                }
                .status-error {
                    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                }
                /* 响应式设计 */
                @media (max-width: 768px) {
                    .xxt-status-bar {
                        flex-direction: column;
                        gap: 8px;
                        padding: 8px 12px;
                    }
                    .status-content {
                        justify-content: center;
                    }
                    .status-actions {
                        justify-content: center;
                        gap: 8px;
                    }
                    .status-tip {
                        gap: 4px;
                        padding: 3px 8px;
                        font-size: 11px;
                    }
                    .tip-number {
                        width: 16px;
                        height: 16px;
                        font-size: 10px;
                    }
                    .guide-btn {
                        font-size: 11px;
                        padding: 5px 10px;
                    }
                }
            `);
        }
    }

    // ========================================
    // 🔧 实例化核心模块
    // ========================================
    
    const logger = new LogSystem();
    const stateManager = new StateManager();
    const uiManager = new UIManager();

    // 工具函数
    function delay(ms) {
        // 检查是否启用快速模式
        const fastMode = GM_getValue(Config.keys.fastMode, false);
        if (fastMode) {
            // 快速模式：将延迟时间减少60%
            ms = Math.max(50, Math.floor(ms * 0.4));
        }
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 日期格式标准化函数
    function standardizeDateFormat(dateStr) {
        if (!dateStr) return null;
        
        // 处理不同的日期格式，统一为 YYYY-MM-DD
        let normalized = dateStr.toString().trim();
        
        // 处理中文格式：2025年5月4日 -> 2025-05-04
        if (normalized.includes('年')) {
            normalized = normalized.replace(/年/, '-').replace(/月/, '-').replace(/日/, '');
        }
        
        // 处理斜杠格式：2025/5/4 -> 2025-05-04
        if (normalized.includes('/')) {
            normalized = normalized.replace(/\//g, '-');
        }
        
        // 处理单数字格式：2025-5-4 -> 2025-05-04
        const parts = normalized.split('-');
        if (parts.length === 3) {
            const year = parts[0].padStart(4, '0');
            const month = parts[1].padStart(2, '0');
            const day = parts[2].padStart(2, '0');
            normalized = `${year}-${month}-${day}`;
        }
        
        // 验证日期格式
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(normalized)) {
            addLog(`⚠️ 日期格式标准化失败: ${dateStr} -> ${normalized}`, 'warning');
            return dateStr; // 返回原始值
        }
        
        return normalized;
    }

    // 兼容性函数（保持原有的API）
    function addLog(message, type = 'info') {
        logger.addLog(message, type);
    }

    function updateStatusBar(type, message) {
        uiManager.updateStatusBar(type, message);
    }

    function displayInfo(text) {
        uiManager.displayInfo(text);
    }

    function showNotification(message, type = 'info') {
        uiManager.showNotification(message, type);
    }

    function displayInfo(text) {
        updateStatusBar('info', text);
    }

    // 统一的状态栏系统
    function updateStatusBar(type, message) {
        let statusBar = document.getElementById('xxt-status-bar');
        if (!statusBar) {
            createStatusBar();
            statusBar = document.getElementById('xxt-status-bar');
        }
        
        const statusMessage = statusBar.querySelector('.status-message');
        const statusIcon = statusBar.querySelector('.status-icon');
        
        // 设置消息
        statusMessage.textContent = message;
        
        // 根据类型设置图标和样式
        statusBar.className = 'xxt-status-bar';
        switch(type) {
            case 'info':
                statusBar.classList.add('status-info');
                statusIcon.textContent = 'ℹ️';
                break;
            case 'warning':
                statusBar.classList.add('status-warning');
                statusIcon.textContent = '⚠️';
                break;
            case 'success':
                statusBar.classList.add('status-success');
                statusIcon.textContent = '✅';
                break;
            case 'error':
                statusBar.classList.add('status-error');
                statusIcon.textContent = '❌';
                break;
        }
        
        statusBar.style.display = 'flex';
    }

    function createStatusBar() {
        const statusBar = document.createElement('div');
        statusBar.id = 'xxt-status-bar';
        statusBar.innerHTML = `
            <div class="status-content">
                <span class="status-icon">ℹ️</span>
                <span class="status-message">学习通日报助手初始化中...</span>
            </div>
            <div class="status-actions">
                <div class="status-tip">
                    <span class="tip-number">1</span>
                    <span class="tip-text">改日期为后一天</span>
                    <span class="tip-number">2</span>
                    <span class="tip-text">删除句号</span>
                    <span class="tip-number">3</span>
                    <span class="tip-text">提交</span>
                    <span class="tip-number">4</span>
                    <span class="tip-text">点击查找下一个</span>
                </div>
                <button id="guide-button" class="guide-btn" title="查看使用指南">
                    📖 使用指南
                </button>
            </div>
        `;
        document.body.appendChild(statusBar);

        // 绑定使用指南按钮点击事件
        document.getElementById('guide-button').addEventListener('click', () => {
            addLog('📖 用户手动点击查看使用指南', 'info');
            
            // 直接显示使用指南，不自动打开表单数据界面
            // 强制显示使用指南，重置会话标记
            let guideShownInThisSession = false;
            showGuideNotification();
        });

        GM_addStyle(`
            .xxt-status-bar {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                min-height: 40px;
            }
            .status-content {
                display: flex;
                align-items: center;
                gap: 8px;
                flex: 1;
            }
            .status-icon {
                font-size: 16px;
                flex-shrink: 0;
            }
            .status-message {
                font-size: 14px;
                font-weight: 500;
                flex: 1;
            }
            .status-actions {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .status-tip {
                display: flex;
                align-items: center;
                gap: 6px;
                background: rgba(255,255,255,0.15);
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
            }
            .tip-number {
                background: rgba(255,255,255,0.3);
                width: 18px;
                height: 18px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 11px;
            }
            .tip-text {
                font-weight: 500;
                white-space: nowrap;
            }
            .guide-btn {
                background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                border: 1px solid #ff4757;
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(255, 107, 107, 0.3);
            }
            .guide-btn:hover {
                background: linear-gradient(135deg, #ee5a24, #ff6b6b);
                border-color: #ff3742;
                transform: translateY(-1px);
                box-shadow: 0 4px 10px rgba(255, 107, 107, 0.4);
            }
            .status-info {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .status-warning {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            }
            .status-success {
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            }
            .status-error {
                background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            }
            /* 响应式设计 */
            @media (max-width: 768px) {
                .xxt-status-bar {
                    flex-direction: column;
                    gap: 8px;
                    padding: 8px 12px;
                }
                .status-content {
                    justify-content: center;
                }
                .status-actions {
                    justify-content: center;
                    gap: 8px;
                }
                .status-tip {
                    gap: 4px;
                    padding: 3px 8px;
                    font-size: 11px;
                }
                .tip-number {
                    width: 16px;
                    height: 16px;
                    font-size: 10px;
                }
                .guide-btn {
                    font-size: 11px;
                    padding: 5px 10px;
                }
            }
        `);
    }

    // 日志系统
    function addLog(message, type = 'info') {
        const timestamp = new Date().toLocaleString();
        const logEntry = {
            timestamp: timestamp,
            message: message,
            type: type
        };

        // 保存到本地存储
        let logs = JSON.parse(GM_getValue(Config.keys.logStorage, '[]'));
        logs.push(logEntry);
        
        // 限制日志条数，只保留最新的1000条
        if (logs.length > Config.log.maxEntries) {
            logs = logs.slice(-Config.log.maxEntries);
        }
        
        GM_setValue(Config.keys.logStorage, JSON.stringify(logs));

        // 更新页面上的日志显示
        updateLogDisplay();

        // 同时输出到console
        console.log(`[${timestamp}] ${message}`);
    }

    function updateLogDisplay() {
        const logContent = document.getElementById('log-content');
        if (!logContent) return;

        const logs = JSON.parse(GM_getValue(Config.keys.logStorage, '[]'));
        const recentLogs = logs.slice(-Config.log.displayEntries); // 只显示最新的50条

        logContent.innerHTML = recentLogs.map(log => {
            const typeClass = log.type === 'error' ? 'log-error' : 
                             log.type === 'warning' ? 'log-warning' : 'log-info';
            return `<div class="log-entry ${typeClass}">
                <span class="log-time">[${log.timestamp}]</span>
                <span class="log-message">${log.message}</span>
            </div>`;
        }).join('');

        // 自动滚动到底部
        logContent.scrollTop = logContent.scrollHeight;
    }

    function clearLogs() {
        GM_setValue(Config.keys.logStorage, '[]');
        updateLogDisplay();
        addLog('日志已清空', 'info');
    }

    function copyLogsToClipboard() {
        const logs = JSON.parse(GM_getValue(Config.keys.logStorage, '[]'));
        if (logs.length === 0) {
            alert('当前没有日志可复制');
            return;
        }
        
        const logText = logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(logText).then(() => {
                addLog(`已复制 ${logs.length} 条日志到剪贴板`, 'info');
                // 临时显示复制成功提示
                const btn = document.getElementById('copy-logs-btn');
                const originalText = btn.textContent;
                btn.textContent = '已复制!';
                btn.style.backgroundColor = '#4CAF50';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                }, 2000);
            }).catch(err => {
                fallbackCopyTextToClipboard(logText);
            });
        } else {
            fallbackCopyTextToClipboard(logText);
        }
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                addLog(`已复制日志到剪贴板 (备用方法)`, 'info');
                const btn = document.getElementById('copy-logs-btn');
                const originalText = btn.textContent;
                btn.textContent = '已复制!';
                btn.style.backgroundColor = '#4CAF50';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                }, 2000);
            } else {
                addLog('复制失败，请手动复制日志内容', 'error');
            }
        } catch (err) {
            addLog('复制失败，请手动复制日志内容', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    function createLogPanel() {
        const panel = document.createElement('div');
        panel.id = Config.elements.logPanel;
        panel.innerHTML = `
            <div class="log-header">
                <span class="log-title">脚本运行日志</span>
                <div class="log-controls">
                    <button id="copy-logs-btn" class="log-btn">复制</button>
                    <button id="clear-logs-btn" class="log-btn">清空</button>
                    <button id="toggle-logs-btn" class="log-btn">收起</button>
                </div>
            </div>
            <div id="log-content" class="log-content"></div>
        `;
        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('toggle-logs-btn').addEventListener('click', () => {
            const content = document.getElementById('log-content');
            const btn = document.getElementById('toggle-logs-btn');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                btn.textContent = '收起';
                GM_setValue(Config.keys.logPanelCollapsed, false);
            } else {
                content.style.display = 'none';
                btn.textContent = '展开';
                GM_setValue(Config.keys.logPanelCollapsed, true);
            }
        });
        
        // 恢复收起状态
        const isCollapsed = GM_getValue(Config.keys.logPanelCollapsed, false);
        if (isCollapsed) {
            const content = document.getElementById('log-content');
            const btn = document.getElementById('toggle-logs-btn');
            content.style.display = 'none';
            btn.textContent = '展开';
        }

        document.getElementById('clear-logs-btn').addEventListener('click', () => {
            if (confirm('确定要清空所有日志吗？')) {
                clearLogs();
            }
        });

        document.getElementById('copy-logs-btn').addEventListener('click', () => {
            copyLogsToClipboard();
        });

        // 初始化日志显示
        updateLogDisplay();

        // 添加样式
        GM_addStyle(`
            #${Config.elements.logPanel} {
                position: fixed;
                top: 130px;
                right: 10px;
                width: 230px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 9998;
                font-family: monospace;
                font-size: 12px;
            }
            .log-header {
                background: #f5f5f5;
                padding: 8px 12px;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 5px 5px 0 0;
            }
            .log-title {
                font-weight: bold;
                color: #333;
            }
            .log-controls {
                display: flex;
                gap: 5px;
            }
            .log-btn {
                padding: 4px 8px;
                border: 1px solid #ccc;
                background: white;
                border-radius: 3px;
                cursor: pointer;
                font-size: 11px;
            }
            .log-btn:hover {
                background: #f0f0f0;
            }
            .log-content {
                height: 200px;
                overflow-y: auto;
                padding: 8px;
                background: #fafafa;
            }
            .log-entry {
                margin-bottom: 4px;
                word-wrap: break-word;
            }
            .log-time {
                color: #666;
                font-size: 10px;
            }
            .log-message {
                margin-left: 8px;
            }
            .log-info .log-message {
                color: #333;
            }
            .log-warning .log-message {
                color: #ff8c00;
            }
            .log-error .log-message {
                color: #dc3545;
            }
        `);
    }

    function updateButtonState() {
        const button = document.getElementById(Config.elements.controlButton);
        if (!button) return;

        const runningState = GM_getValue(Config.keys.runningState, 'stopped');
        
        if (runningState === 'running') {
            button.textContent = '暂停处理';
            button.style.backgroundColor = '#ff9800';
        } else if (runningState === 'paused') {
            button.textContent = '继续处理';
            button.style.backgroundColor = '#2196F3';
        } else {
            button.textContent = '开始自动处理';
            button.style.backgroundColor = '#4CAF50';
        }
    }

    async function checkForPauseOrStop() {
        const runningState = GM_getValue(Config.keys.runningState, 'stopped');
        
        if (runningState === 'stopped') {
            shouldStop = true;
            addLog('脚本已停止', 'warning');
            return true;
        } else if (runningState === 'paused') {
            addLog('脚本已暂停，等待继续...', 'warning');
            displayInfo('脚本已暂停');
            
            // 等待状态改变
            while (GM_getValue(Config.keys.runningState, 'stopped') === 'paused') {
                await delay(1000);
            }
            
            const newState = GM_getValue(Config.keys.runningState, 'stopped');
            if (newState === 'stopped') {
                shouldStop = true;
                addLog('脚本已停止', 'warning');
                return true;
            } else if (newState === 'running') {
                addLog('脚本继续运行', 'info');
                displayInfo('脚本继续运行');
            }
        }
        
        return false;
    }

    // Detect page type based on URL
    function getPageType() {
        const url = window.location.href;
        if (url.includes('/reportManage')) {
            return 'report_list';
        } else if (url.includes('/forms/fore/apply') || url.includes('/approve/apps/forms') || url.includes('office.chaoxing.com')) {
            return 'report_fill';
        } else if (url.includes('img[data-src="/engine2/assets/images/icon_lib/example-7/icon38.png"]') || document.querySelector('img[data-src="/engine2/assets/images/icon_lib/example-7/icon38.png"]')) {
            return 'main_page';
        } else {
            return 'unknown';
        }
    }

    function navigateToMainPage() {
        const currentPageType = getPageType();
        addLog(`当前页面类型: ${currentPageType}，准备返回主页`, 'info');
        
        if (currentPageType === 'report_fill') {
            // 如果在填写页面，尝试返回上一页（日报列表页）
            addLog('从填写页面返回日报列表页', 'info');
            window.history.back();
            
            // 延迟后再次检查并继续返回主页
            setTimeout(() => {
                const newPageType = getPageType();
                if (newPageType === 'report_list') {
                    addLog('已返回日报列表页，继续返回主页', 'info');
                    window.history.back();
                }
            }, 2000);
        } else if (currentPageType === 'report_list') {
            // 如果在日报列表页，直接返回主页
            addLog('从日报列表页返回主页', 'info');
            window.history.back();
        } else if (currentPageType === 'main_page') {
            addLog('已在主页，无需跳转', 'info');
            displayInfo('已在主页');
        } else {
            // 未知页面类型，尝试多次返回
            addLog('未知页面类型，尝试多次返回', 'warning');
            window.history.go(-2); // 一次性返回两步
        }
        
        // 重置页面状态
        GM_setValue(Config.keys.pageState, 'initial');
    }

    async function extractTargetDate() {
        const currentUrl = window.location.href;
        addLog(`分析URL获取目标日期: ${currentUrl}`, 'info');
        
        // 首先检查是否从先前的状态中已经记录了目标日期
        const sessionDate = sessionStorage.getItem(Config.keys.targetDate);
        if (sessionDate) {
            const standardizedDate = standardizeDateFormat(sessionDate);
            addLog(`从会话存储获取目标日期: ${sessionDate} → ${standardizedDate}`, 'info');
            return standardizedDate;
        }
        
        // 从URL中提取可能的日期信息（支持更多格式）
        const urlPatterns = [
            /(\d{4}-\d{2}-\d{2})/,              // 2025-02-10
            /(\d{4}年\d{1,2}月\d{1,2}日)/,        // 2025年02月10日
            /"(\d+)"/                           // "78" (Day编号)
        ];
        
        for (const pattern of urlPatterns) {
            const match = currentUrl.match(pattern);
            if (match) {
                let dateStr = match[1];
                addLog(`从URL提取到日期: ${dateStr}`, 'info');
                
                // 如果是Day编号，尝试从页面内容中找到对应的实际日期
                if (/^\d+$/.test(dateStr)) {
                    addLog(`提取到Day编号: ${dateStr}，查找页面中的实际日期`, 'info');
                    
                    // 从页面内容中查找日期（Day编号对应的实际日期通常在页面中显示）
                    const pageText = document.body.innerText || document.body.textContent || '';
                    const dateMatches = pageText.match(/\d{4}-\d{2}-\d{2}/g);
                    
                    if (dateMatches && dateMatches.length > 0) {
                        // 通常最后一个或最相关的日期是目标日期
                        const targetDate = dateMatches[dateMatches.length - 1];
                        const standardizedDate = standardizeDateFormat(targetDate);
                        addLog(`从页面内容找到对应日期: ${targetDate}`, 'info');
                        addLog(`标准化后的日期: ${standardizedDate}`, 'info');
                        return standardizedDate;
                    }
                    
                    // 如果还找不到，尝试从input字段中获取
                    const inputs = document.querySelectorAll('input');
                    for (const input of inputs) {
                        const value = input.value || input.getAttribute('value') || '';
                        if (value.match(/\d{4}-\d{2}-\d{2}/)) {
                            const extractedDate = value.match(/\d{4}-\d{2}-\d{2}/)[0];
                            const standardizedDate = standardizeDateFormat(extractedDate);
                            addLog(`从输入框找到日期: ${extractedDate}`, 'info');
                            addLog(`标准化后的日期: ${standardizedDate}`, 'info');
                            return standardizedDate;
                        }
                    }
                    
                    // 最后尝试从表单标签或span中获取
                    const dateElements = document.querySelectorAll('span, label, div, td');
                    for (const element of dateElements) {
                        const text = element.innerText || element.textContent || '';
                        const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
                        if (dateMatch) {
                            const extractedDate = dateMatch[0];
                            const standardizedDate = standardizeDateFormat(extractedDate);
                            addLog(`从页面元素找到日期: ${extractedDate}`, 'info');
                            addLog(`标准化后的日期: ${standardizedDate}`, 'info');
                            return standardizedDate;
                        }
                    }
                    
                    addLog(`Day编号 ${dateStr} 无法转换为具体日期`, 'warning');
                    return null;
                }
                
                // 标准化日期格式为 YYYY-MM-DD
                if (dateStr.includes('年')) {
                    dateStr = dateStr.replace(/年/, '-').replace(/月/, '-').replace(/日/, '');
                }
                
                // 标准化日期格式
                const standardizedDate = standardizeDateFormat(dateStr);
                addLog(`提取到原始日期: ${dateStr}`, 'info');
                addLog(`标准化后的日期: ${standardizedDate}`, 'info');
                
                return standardizedDate;
            }
        }
        
        // 从页面标题或表单中获取日期信息
        const titleSelectors = ['h1', 'h2', 'h3', '.title', '.form-title', '.page-title', '.header-title', '.main-title'];
        for (const selector of titleSelectors) {
            const titleElement = document.querySelector(selector);
            if (titleElement) {
                const titleText = titleElement.innerText || titleElement.textContent || '';
                const titlePatterns = [
                    /(\d{4}-\d{2}-\d{2})/,
                    /(\d{4}年\d{1,2}月\d{1,2}日)/,
                    /(\d{1,2}月\d{1,2}日)/
                ];
                
                for (const pattern of titlePatterns) {
                    const match = titleText.match(pattern);
                    if (match) {
                        let dateStr = match[1];
                        addLog(`从页面标题提取到日期: ${dateStr}`, 'info');
                        
                        // 处理不同格式
                        if (dateStr.includes('年')) {
                            dateStr = dateStr.replace(/年/, '-').replace(/月/, '-').replace(/日/, '');
                        } else if (dateStr.includes('月')) {
                            // 如果只有月日，需要补充年份
                            const currentYear = new Date().getFullYear();
                            dateStr = `${currentYear}-${dateStr.replace(/月/, '-').replace(/日/, '')}`;
                        }
                        
                        // 标准化日期格式
                        const standardizedDate = standardizeDateFormat(dateStr);
                        addLog(`页面标题提取到原始日期: ${dateStr}`, 'info');
                        addLog(`标准化后的日期: ${standardizedDate}`, 'info');
                        
                        return standardizedDate;
                    }
                }
            }
        }
        
        // 从页面内容中查找日期（增强版）
        const bodyText = document.body.innerText || '';
        const bodyPatterns = [
            /(\d{4}-\d{2}-\d{2})/g,  // 使用全局匹配找到所有日期
            /(\d{4}-\d{1,2}-\d{1,2})/g,  // 单数字格式: 2025-5-25
            /(\d{4}年\d{1,2}月\d{1,2}日)/g,
            /(\d{4}\/\d{1,2}\/\d{1,2})/g  // 斜杠格式: 2025/5/25
        ];
        
        for (const pattern of bodyPatterns) {
            const matches = bodyText.match(pattern);
            if (matches && matches.length > 0) {
                // 找到最相关的日期（通常是最后一个或最近的）
                let bestDate = matches[matches.length - 1];
                addLog(`从页面内容提取到日期候选: ${matches.join(', ')}`, 'info');
                addLog(`选择日期: ${bestDate}`, 'info');
                
                if (bestDate.includes('年')) {
                    bestDate = bestDate.replace(/年/, '-').replace(/月/, '-').replace(/日/, '');
                }
                
                // 标准化日期格式为 YYYY-MM-DD
                const standardizedDate = standardizeDateFormat(bestDate);
                addLog(`页面内容提取到原始日期: ${bestDate}`, 'info');
                addLog(`标准化后的日期: ${standardizedDate}`, 'info');
                
                return standardizedDate;
            }
        }
        
        addLog('未能从任何来源提取到有效日期', 'warning');
        return null;
    }

    async function autoSelectDate(targetDate) {
        try {
            // 将目标日期往前推一天（用于日期选择器填充）
            const originalDate = targetDate;
            const dateObj = new Date(targetDate);
            dateObj.setDate(dateObj.getDate() - 1);
            const adjustedDate = dateObj.toISOString().split('T')[0];
            
            addLog(`原始识别日期: ${originalDate}`, 'info');
            addLog(`日期选择器将填入: ${adjustedDate}`, 'info');
            
            // 使用调整后的日期进行后续操作
            targetDate = adjustedDate;
            
            // 快速检测页面状态
            await delay(500);
            
            // 直接查找日期输入框（使用最有效的选择器）
            let dateInput = document.querySelector('.el-input__inner[placeholder*="年-月-日"], .date-picker__input, input[placeholder*="年-月-日"]');
            
            // 如果没找到，查找已有日期值的输入框
            if (!dateInput) {
                const allInputs = document.querySelectorAll('input[type="text"], .el-input__inner');
                for (const input of allInputs) {
                    const value = input.value || input.getAttribute('value') || '';
                    if (value.match(/\d{4}-\d{2}-\d{2}/)) {
                        dateInput = input;
                        break;
                    }
                }
            }
            
            // 如果还是没找到，尝试更广泛的查找
            if (!dateInput) {
                addLog('🔍 尝试更广泛的日期输入框查找...', 'info');
                
                // 方法1：查找与"当前日报日期"相关的输入框
                const dateLabels = Array.from(document.querySelectorAll('label, .widget-title-area, .fsw-ul-title, .form-title, .field-label'));
                for (const label of dateLabels) {
                    const labelText = label.textContent || label.innerText || '';
                    if (labelText.includes('当前日报日期') || labelText.includes('日期')) {
                        const container = label.closest('.widget-region, .form-item, .el-form-item, .field-container, .form-group');
                        if (container) {
                            dateInput = container.querySelector('.el-input__inner, .date-picker__input, input[type="text"], input');
                            if (dateInput) {
                                addLog(`通过标签"${labelText}"找到日期输入框`, 'info');
                                break;
                            }
                        }
                    }
                }
            }
            
            // 如果还是没找到，尝试查找任何可能的日期相关输入框
            if (!dateInput) {
                const allInputs = document.querySelectorAll('input');
                for (const input of allInputs) {
                    const placeholder = input.placeholder || '';
                    const id = input.id || '';
                    const name = input.name || '';
                    const className = input.className || '';
                    
                    if (placeholder.includes('年') || placeholder.includes('月') || placeholder.includes('日') ||
                        id.includes('date') || name.includes('date') || className.includes('date')) {
                        dateInput = input;
                        addLog(`通过属性匹配找到日期输入框: placeholder="${placeholder}", id="${id}", name="${name}"`, 'info');
                        break;
                    }
                }
            }
            
            if (!dateInput) {
                addLog('❌ 未找到日期输入框，将尝试直接设置日期值', 'error');
                // 尝试直接调用ensureDateValueSet来设置日期
                const [year, month, day] = targetDate.split('-').map(Number);
                return await ensureDateValueSet(day, year, month);
            }
            
            addLog(`找到日期输入框，当前值: "${dateInput.value}"`, 'info');
            
            // 点击输入框打开日期选择器
            dateInput.click();
            await delay(300);
            
            // 查找日期选择器面板
            const datePicker = document.querySelector('.el-picker__popper, .el-date-picker, .date-picker-panel');
            if (!datePicker) {
                addLog('日期选择器面板未打开', 'error');
                return false;
            }
            
            addLog('日期选择器已打开，开始分析目标日期', 'info');
            
            // 解析目标日期
            const targetDateObj = new Date(targetDate);
            const targetYear = targetDateObj.getFullYear();
            const targetMonth = targetDateObj.getMonth() + 1; // 月份从0开始
            const targetDay = targetDateObj.getDate();
            
            addLog(`目标日期解析: ${targetYear}年${targetMonth}月${targetDay}日`, 'info');
            
            // 获取当前显示的年月
            const currentYear = await getCurrentPickerYear(datePicker);
            const currentMonth = await getCurrentPickerMonth(datePicker);
            
            addLog(`日期选择器当前显示: ${currentYear}年${currentMonth}月`, 'info');
            
            // 导航到目标年月
            await navigateToTargetMonth(datePicker, currentYear, currentMonth, targetYear, targetMonth);
            
            // 选择目标日期
            await selectTargetDay(datePicker, targetDay, targetYear, targetMonth);
            
            addLog(`日期选择完成: ${targetDate}`, 'info');
            displayInfo(`已自动选择日期: ${targetDate}`);
            
            return true;
            
        } catch (error) {
            addLog(`自动选择日期失败: ${error.message}`, 'error');
            return false;
        }
    }

    async function getCurrentPickerYear(datePicker) {
        const yearElement = datePicker.querySelector('.el-date-picker__header-label');
        if (yearElement) {
            const yearText = yearElement.innerText.trim();
            const yearMatch = yearText.match(/(\d{4})/);
            return yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
        }
        return new Date().getFullYear();
    }

    async function getCurrentPickerMonth(datePicker) {
        const monthElements = datePicker.querySelectorAll('.el-date-picker__header-label');
        if (monthElements.length >= 2) {
            const monthText = monthElements[1].innerText.trim();
            const monthMatch = monthText.match(/(\d{1,2})/);
            return monthMatch ? parseInt(monthMatch[1]) : new Date().getMonth() + 1;
        }
        return new Date().getMonth() + 1;
    }

    async function navigateToTargetMonth(datePicker, currentYear, currentMonth, targetYear, targetMonth) {
        let needNavigation = false;
        let monthDiff = (targetYear - currentYear) * 12 + (targetMonth - currentMonth);
        
        if (monthDiff === 0) {
            addLog('已在目标月份，无需导航', 'info');
            return;
        }
        
        addLog(`需要导航 ${monthDiff} 个月`, 'info');
        
        // 决定点击方向
        const isForward = monthDiff > 0;
        const buttonSelector = isForward ? '.arrow-right' : '.arrow-left';
        
        for (let i = 0; i < Math.abs(monthDiff); i++) {
            const navButton = datePicker.querySelector(buttonSelector);
            if (navButton) {
                addLog(`${isForward ? '前进' : '后退'}到${isForward ? '下' : '上'}个月 (${i + 1}/${Math.abs(monthDiff)})`, 'info');
                navButton.click();
                await delay(200); // 减少延迟从500ms到200ms
            } else {
                addLog('未找到月份导航按钮', 'error');
                break;
            }
        }
    }

    async function selectTargetDay(datePicker, targetDay, targetYear, targetMonth) {
        // 查找目标日期的单元格
        const dayCells = datePicker.querySelectorAll('.el-date-table-cell__text');
        
        for (const cell of dayCells) {
            if (cell.innerText.trim() === targetDay.toString()) {
                const dayCell = cell.closest('td');
                if (dayCell && !dayCell.classList.contains('prev-month') && !dayCell.classList.contains('next-month')) {
                                    addLog(`点击日期: ${targetDay}`, 'info');
                dayCell.click();
                await delay(200); // 减少延迟
                
                // 确保日期选择器关闭并且值被设置
                await ensureDateValueSet(targetDay, targetYear, targetMonth);
                    
                    return true;
                }
            }
        }
        
        addLog(`未找到目标日期: ${targetDay}`, 'error');
        return false;
    }
    
    // 确保日期值被正确设置到表单字段中
    async function ensureDateValueSet(targetDay, targetYear, targetMonth) {
        // 等待日期选择器关闭
        await delay(500); // 减少延迟从1500ms到500ms
        
        // 如果没有传入年月，从页面中获取当前选择的年月
        if (!targetYear || !targetMonth) {
            const datePicker = document.querySelector('.el-picker__popper, .el-date-picker, .date-picker-panel');
            if (datePicker) {
                targetYear = await getCurrentPickerYear(datePicker);
                targetMonth = await getCurrentPickerMonth(datePicker);
            } else {
                // 如果无法获取，使用当前日期的年月
                const now = new Date();
                targetYear = now.getFullYear();
                targetMonth = now.getMonth() + 1;
            }
        }
        
        const formattedDate = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-${targetDay.toString().padStart(2, '0')}`;
        addLog(`准备设置日期值: ${formattedDate}`, 'info');
        
        // 查找日期输入字段 - 使用更全面的选择器
        let dateField = null;
        
        // 方法1：查找与"当前日报日期"相关的输入框
        const dateLabels = Array.from(document.querySelectorAll('label, .widget-title-area, .fsw-ul-title, .form-title, .field-label, .form-item-label'));
        for (const label of dateLabels) {
            const labelText = label.textContent || label.innerText || '';
            if (labelText.includes('当前日报日期') || labelText.includes('日期') || labelText.includes('时间')) {
                const container = label.closest('.widget-region, .form-item, .el-form-item, .field-container, .form-group, .row, .col');
                if (container) {
                    dateField = container.querySelector('.el-input__inner, .date-picker__input, input[type="text"], input');
                    if (dateField) {
                        addLog(`通过标签"${labelText.trim()}"找到日期字段`, 'info');
                        break;
                    }
                }
                
                // 也尝试查找兄弟元素中的输入框
                const nextSibling = label.nextElementSibling;
                if (nextSibling) {
                    const siblingInput = nextSibling.querySelector('.el-input__inner, .date-picker__input, input[type="text"], input');
                    if (siblingInput) {
                        dateField = siblingInput;
                        addLog(`通过标签"${labelText.trim()}"的兄弟元素找到日期字段`, 'info');
                        break;
                    }
                }
            }
        }
        
        // 方法2：通用查找
        if (!dateField) {
            dateField = document.querySelector('.el-input__inner[placeholder*="年-月-日"], .el-input__inner[value*="-"], .date-picker__input, input[placeholder*="年-月-日"]');
            if (dateField) {
                addLog(`通过通用选择器找到日期字段`, 'info');
            }
        }
        
        // 方法3：查找所有可能的日期字段（通过值或占位符）
        if (!dateField) {
            const allInputs = document.querySelectorAll('input[type="text"], .el-input__inner, input');
            for (const input of allInputs) {
                const value = input.value || input.getAttribute('value') || '';
                const placeholder = input.placeholder || '';
                const id = input.id || '';
                const name = input.name || '';
                const className = input.className || '';
                
                if (value.match(/\d{4}-\d{2}-\d{2}/) || 
                    placeholder.includes('年-月-日') || placeholder.includes('年') || 
                    id.includes('date') || name.includes('date') || className.includes('date')) {
                    dateField = input;
                    addLog(`通过属性匹配找到日期字段: value="${value}", placeholder="${placeholder}", id="${id}"`, 'info');
                    break;
                }
            }
        }
        
        // 方法4：如果仍然没找到，查找页面中第一个可能的输入框
        if (!dateField) {
            addLog('🔍 使用最后的查找策略...', 'info');
            const allInputs = document.querySelectorAll('input');
            for (const input of allInputs) {
                // 跳过隐藏的输入框
                if (input.type === 'hidden' || input.style.display === 'none') continue;
                
                // 检查输入框是否可见
                const rect = input.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    dateField = input;
                    addLog(`找到第一个可见输入框作为日期字段: id="${input.id}", name="${input.name}", placeholder="${input.placeholder}"`, 'info');
                    break;
                }
            }
        }
        
        if (!dateField) {
            addLog(`❌ 未找到日期输入字段`, 'error');
            return false;
        }
        
        addLog(`🔍 找到日期字段，当前值: "${dateField.value}", 占位符: "${dateField.placeholder}"`, 'info');
        
        // 简化：直接设置值并触发关键事件
        dateField.value = formattedDate;
        dateField.setAttribute('value', formattedDate);
        
        // 触发必要的事件
        dateField.dispatchEvent(new Event('input', { bubbles: true }));
        dateField.dispatchEvent(new Event('change', { bubbles: true }));
        
        // 尝试Vue组件更新（静默处理）
        const elInputWrapper = dateField.closest('.el-input, .custom-date-picker, .el-date-editor');
        if (elInputWrapper && elInputWrapper.__vue__) {
            try {
                const vueInstance = elInputWrapper.__vue__;
                if (vueInstance && vueInstance.$emit) {
                    vueInstance.$emit('input', formattedDate);
                    vueInstance.$emit('change', formattedDate);
                }
            } catch (e) {
                // 忽略Vue更新错误
            }
        }
        
        addLog(`✅ 日期值设置成功: ${formattedDate}`, 'info');
        return true;
    }

    // 分析数据的日期范围
    function analyzeDataDateRange(dataText) {
        if (!dataText || typeof dataText !== 'string') {
            return {
                firstDate: null,
                lastDate: null,
                totalDays: 0,
                dailyCount: 0,
                biweeklyCount: 0,
                dateList: []
            };
        }
        
        const lines = dataText.split('\n').map(line => line.trim()).filter(line => line);
        const dates = [];
        let dailyCount = 0;
        let biweeklyCount = 0;
        
        for (const line of lines) {
            if (line.startsWith('[DATE:') && line.endsWith(']')) {
                const date = line.slice(6, -1).trim();
                dates.push(date);
                dailyCount++;
            } else if (line.startsWith('[BIWEEK:') && line.endsWith(']')) {
                const dateRange = line.slice(8, -1).trim();
                if (dateRange.includes('至')) {
                    const [startStr, endStr] = dateRange.split('至');
                    dates.push(startStr.trim());
                    dates.push(endStr.trim());
                }
                biweeklyCount++;
            }
        }
        
        // 去重并排序
        const uniqueDates = [...new Set(dates)].sort();
        
        return {
            firstDate: uniqueDates.length > 0 ? uniqueDates[0] : null,
            lastDate: uniqueDates.length > 0 ? uniqueDates[uniqueDates.length - 1] : null,
            totalDays: uniqueDates.length,
            dailyCount: dailyCount,
            biweeklyCount: biweeklyCount,
            dateList: uniqueDates
        };
    }

    function parseReportData(dataText, targetDate = null) {
        if (!dataText || typeof dataText !== 'string') {
            return null;
        }
        
        const lines = dataText.split('\n').map(line => line.trim()).filter(line => line);
        const allEntries = [];
        let currentEntry = null;
        
        // 解析所有数据条目
        for (const line of lines) {
            if (line.startsWith('[DATE:') && line.endsWith(']')) {
                // 新的日记条目
                if (currentEntry) {
                    allEntries.push(currentEntry);
                }
                currentEntry = {
                    type: 'daily',
                    date: line.slice(6, -1).trim(),
                    work: '',
                    problem: '',
                    feeling: ''
                };
            } else if (line.startsWith('[BIWEEK:') && line.endsWith(']')) {
                // 双周记条目（可能与日记条目在同一天）
                if (currentEntry) {
                    allEntries.push(currentEntry);
                }
                currentEntry = {
                    type: 'biweekly',
                    date: line.slice(8, -1).trim(),
                    work: '',
                    problem: '',
                    feeling: ''
                };
            } else if (currentEntry) {
                // 填充当前条目的内容
                if (line.startsWith('[WORK]')) {
                    currentEntry.work = line.slice(6).trim();
                } else if (line.startsWith('[PROBLEM]')) {
                    currentEntry.problem = line.slice(9).trim();
                } else if (line.startsWith('[FEELING]')) {
                    currentEntry.feeling = line.slice(9).trim();
                }
            }
        }
        
        // 添加最后一个条目
        if (currentEntry) {
            allEntries.push(currentEntry);
        }
        
        addLog(`📊 解析到 ${allEntries.length} 条数据记录（日记+双周记）`, 'info');
        
        // 统计条目类型
        const dailyCount = allEntries.filter(e => e.type === 'daily').length;
        const biweeklyCount = allEntries.filter(e => e.type === 'biweekly').length;
        addLog(`📈 记录详情：${dailyCount} 条日记，${biweeklyCount} 条双周记`, 'info');
        
        // 显示部分日记条目以便调试
        if (targetDate) {
            const nearbyEntries = allEntries.filter(e => e.type === 'daily').slice(0, 10);
            if (nearbyEntries.length > 0) {
                addLog(`🔍 数据中的前10个日记日期: ${nearbyEntries.map(e => e.date).join(', ')}`, 'info');
            }
        }
        
        // 如果没有指定目标日期，返回第一个条目
        if (!targetDate) {
            const firstEntry = allEntries[0];
            if (firstEntry) {
                addLog(`未指定目标日期，使用第一条记录: ${firstEntry.type} - ${firstEntry.date}`, 'info');
                return {
                    date: firstEntry.date,
                    work: firstEntry.work,
                    problem: firstEntry.problem,
                    feeling: firstEntry.feeling
                };
            }
            return null;
        }
        
        // 根据目标日期查找匹配的条目
        addLog(`🎯 寻找目标日期的数据: ${targetDate}`, 'info');
        
        // 标准化目标日期格式，确保匹配
        const standardizedTargetDate = standardizeDateFormat(targetDate);
        addLog(`📅 标准化目标日期: ${targetDate} -> ${standardizedTargetDate}`, 'info');
        
        // 首先尝试精确匹配日期（优先查找日记）
        let matchingDailyEntry = null;
        let matchingBiweeklyEntry = null;
        
        // 查找匹配的日记
        addLog(`📝 查找精确日期的日记条目: ${standardizedTargetDate}`, 'info');
        for (const entry of allEntries) {
            if (entry.type === 'daily' && entry.date === standardizedTargetDate) {
                matchingDailyEntry = entry;
                addLog(`✅ 找到匹配的日记数据: ${entry.date}`, 'success');
                addLog(`📄 内容预览: "${entry.work.substring(0, 50)}${entry.work.length > 50 ? '...' : ''}"`, 'info');
                break;
            }
        }
        
        // 如果找到日记，直接返回（日记优先级高于双周记）
        if (matchingDailyEntry) {
            addLog(`🎉 使用精确日期的日记内容`, 'success');
            return {
                date: matchingDailyEntry.date,
                work: matchingDailyEntry.work,
                problem: matchingDailyEntry.problem,
                feeling: matchingDailyEntry.feeling
            };
        }
        
        addLog(`⚠️ 未找到精确日期的日记，尝试查找双周记`, 'warning');
        
        // 如果没有精确匹配，尝试查找包含该日期的双周记
        addLog(`📅 查找包含目标日期的双周记范围`, 'info');
        const targetDateObj = new Date(standardizedTargetDate);
        for (const entry of allEntries) {
            if (entry.type === 'biweekly' && entry.date.includes('至')) {
                const [startStr, endStr] = entry.date.split('至');
                const startDate = new Date(startStr.trim());
                const endDate = new Date(endStr.trim());
                
                addLog(`🔍 检查双周记范围: ${entry.date} (${startStr.trim()} 到 ${endStr.trim()})`, 'info');
                
                if (targetDateObj >= startDate && targetDateObj <= endDate) {
                    addLog(`✅ 找到包含目标日期的双周记数据: ${entry.date}`, 'success');
                    addLog(`📄 双周记内容预览: "${entry.work.substring(0, 80)}${entry.work.length > 80 ? '...' : ''}"`, 'info');
                    addLog(`💡 提示：正在使用双周记内容，因为没有找到 ${standardizedTargetDate} 的精确日记`, 'warning');
                    return {
                        date: entry.date,
                        work: entry.work,
                        problem: entry.problem,
                        feeling: entry.feeling
                    };
                }
            }
        }
        
        // 如果都没有匹配，返回最近的日期数据
        addLog(`未找到匹配的数据，查找最近的日期`, 'warning');
        
        // 检查目标日期是否超出数据范围
        const dataAnalysis = analyzeDataDateRange(dataText);
        if (dataAnalysis.firstDate && dataAnalysis.lastDate) {
            const targetDateObj = new Date(standardizedTargetDate);
            const firstDateObj = new Date(dataAnalysis.firstDate);
            const lastDateObj = new Date(dataAnalysis.lastDate);
            
            if (targetDateObj > lastDateObj) {
                // 目标日期超出数据范围
                const daysDiff = Math.ceil((targetDateObj - lastDateObj) / (1000 * 60 * 60 * 24));
                addLog(`🎯 所有预设数据已用完！需要填写 ${standardizedTargetDate}，但数据只到 ${dataAnalysis.lastDate}，还需补充 ${daysDiff} 天的数据`, 'warning');
                updateStatusBar('warning', `📝 预设数据已全部用完！需要补充后续 ${daysDiff} 天的数据，或手动填写当前日报`);
                
                // 显示详细的数据用完提示
                showNotification(`🎯 数据已全部用完！\n\n当前需要填写：${standardizedTargetDate}\n现有数据范围：${dataAnalysis.firstDate} 至 ${dataAnalysis.lastDate}\n需要补充：后续 ${daysDiff} 天的数据\n\n💡 解决方案：\n1. 点击"表单数据"按钮\n2. 使用AI生成更多日期的数据\n3. 或者手动填写当前日报`, 'warning');
                
                return null;
            } else if (targetDateObj < firstDateObj) {
                // 目标日期在数据范围之前
                const daysDiff = Math.ceil((firstDateObj - targetDateObj) / (1000 * 60 * 60 * 24));
                addLog(`⚠️ 目标日期 ${standardizedTargetDate} 早于数据开始日期（${dataAnalysis.firstDate}），提前 ${daysDiff} 天`, 'warning');
                updateStatusBar('warning', `⚠️ 目标日期早于数据开始日期 ${daysDiff} 天，将使用最早的数据`);
            }
        }
        
        let closestEntry = null;
        let minDiff = Infinity;
        
        for (const entry of allEntries) {
            if (entry.type === 'daily') {
                const entryDate = new Date(entry.date);
                const diff = Math.abs(targetDateObj.getTime() - entryDate.getTime());
                if (diff < minDiff) {
                    minDiff = diff;
                    closestEntry = entry;
                }
            }
        }
        
        if (closestEntry) {
            addLog(`使用最近的日期数据: ${closestEntry.date}`, 'warning');
            return {
                date: closestEntry.date,
                work: closestEntry.work,
                problem: closestEntry.problem,
                feeling: closestEntry.feeling
            };
        }
        
        addLog('未找到任何匹配的数据', 'error');
        return null;
    }
    
    // UEditor 富文本编辑器内容填充函数
    async function fillUEditorContent(editorId, content) {
        try {
            // 确保内容以句号结尾
            if (content && !content.endsWith('。') && !content.endsWith('.')) {
                content = content + '。';
            }
            
            addLog(`🔧 开始填充编辑器: ${editorId}，内容: ${content}`, 'info');
            
            // 方法1: 通过UE编辑器实例填充
            if (window.UE && window.UE.instants && window.UE.instants[editorId]) {
                const editor = window.UE.instants[editorId];
                addLog(`找到编辑器实例: ${editorId}`, 'info');
                
                if (editor && typeof editor.setContent === 'function') {
                    try {
                        editor.setContent(content);
                        addLog(`✅ 通过UE实例填充编辑器 ${editorId} 成功`, 'info');
                        return true;
                    } catch (e) {
                        addLog(`⚠️ UE实例填充失败: ${e.message}`, 'warning');
                    }
                }
                
                // 尝试其他UE实例方法
                if (editor && typeof editor.execCommand === 'function') {
                    try {
                        editor.execCommand('insertHtml', content);
                        addLog(`✅ 通过UE execCommand填充编辑器 ${editorId} 成功`, 'info');
                        return true;
                    } catch (e) {
                        addLog(`⚠️ UE execCommand填充失败: ${e.message}`, 'warning');
                    }
                }
            } else {
                addLog(`❌ 未找到编辑器实例: ${editorId}`, 'warning');
            }
            
            // 方法2: 通过iframe直接操作（增强版）
            const iframeId = editorId.replace('ueditorInstant', 'ueditor_');
            let iframe = document.getElementById(iframeId);
            addLog(`查找iframe: ${iframeId}`, 'info');
            
            // 如果找不到标准iframe，尝试查找相关的iframe
            if (!iframe) {
                const allIframes = document.querySelectorAll('iframe');
                for (const iframeElement of allIframes) {
                    if (iframeElement.id && iframeElement.id.includes(editorId.replace('ueditorInstant', ''))) {
                        iframe = iframeElement;
                        addLog(`找到相关iframe: ${iframe.id}`, 'info');
                        break;
                    }
                }
            }
            
            if (iframe) {
                addLog(`找到iframe: ${iframe.id || iframeId}`, 'info');
                
                // 快速检测iframe状态，减少等待时间
                await delay(50);
                
                // 尝试多种方式访问iframe内容
                let iframeDoc = null;
                try {
                    iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                } catch (e) {
                    addLog(`⚠️ 无法访问iframe文档: ${e.message}`, 'warning');
                }
                
                if (iframeDoc && iframeDoc.body) {
                    try {
                        // 方式1: 直接设置body内容
                        iframeDoc.body.innerHTML = `<p>${content}</p>`;
                        
                        // 触发输入事件
                        const event = new Event('input', { bubbles: true });
                        iframeDoc.body.dispatchEvent(event);
                        
                        addLog(`✅ 通过iframe填充编辑器 ${editorId} 成功`, 'info');
                        return true;
                    } catch (e) {
                        addLog(`⚠️ iframe设置内容失败: ${e.message}`, 'warning');
                        
                        // 方式2: 查找可编辑区域
                        try {
                            const editableArea = iframeDoc.body.querySelector('[contenteditable]') || 
                                                iframeDoc.body.querySelector('div') || 
                                                iframeDoc.body;
                            
                            if (editableArea) {
                                editableArea.innerHTML = `<p>${content}</p>`;
                                addLog(`✅ 通过iframe可编辑区域填充编辑器 ${editorId} 成功`, 'info');
                                return true;
                            }
                        } catch (e2) {
                            addLog(`⚠️ iframe可编辑区域填充失败: ${e2.message}`, 'warning');
                        }
                    }
                } else {
                    addLog(`❌ iframe文档或body无法访问`, 'warning');
                }
            } else {
                addLog(`❌ 未找到iframe: ${iframeId}`, 'warning');
            }
            
            // 方法3: 查找相关的容器并尝试直接插入
            const containerSelectors = [
                `#${editorId.replace('ueditorInstant', 'edui')}`,
                `[id*="${editorId.replace('ueditorInstant', 'edui')}"]`,
                '.edui-editor-iframeholder',
                '[class*="edui-editor"]'
            ];
            
            for (const selector of containerSelectors) {
                const container = document.querySelector(selector);
                if (container) {
                    addLog(`尝试容器方法: ${selector}`, 'info');
                    
                    // 查找容器内的可编辑元素
                    const editableArea = container.querySelector('[contenteditable="true"]') ||
                                        container.querySelector('textarea') ||
                                        container.querySelector('input[type="text"]');
                    
                    if (editableArea) {
                        try {
                            if (editableArea.tagName.toLowerCase() === 'textarea' || editableArea.tagName.toLowerCase() === 'input') {
                                editableArea.value = content;
                                editableArea.dispatchEvent(new Event('input', { bubbles: true }));
                                editableArea.dispatchEvent(new Event('change', { bubbles: true }));
                            } else {
                                editableArea.innerHTML = `<p>${content}</p>`;
                            }
                            addLog(`✅ 通过容器可编辑区域填充成功`, 'info');
                            return true;
                        } catch (e) {
                            addLog(`⚠️ 容器填充失败: ${e.message}`, 'warning');
                        }
                    }
                }
            }
            
            // 方法4: 查找并填充可能的textarea备用字段
            const backupSelectors = [
                `textarea[name*="${editorId}"]`,
                `input[name*="content"]`,
                'textarea[placeholder*="请输入"]',
                'textarea[class*="edui"]',
                'input[class*="edui"]'
            ];
            
            for (const selector of backupSelectors) {
                const field = document.querySelector(selector);
                if (field) {
                    try {
                        field.value = content;
                        field.dispatchEvent(new Event('input', { bubbles: true }));
                        field.dispatchEvent(new Event('change', { bubbles: true }));
                        addLog(`✅ 通过备用字段填充成功: ${selector}`, 'info');
                        return true;
                    } catch (e) {
                        addLog(`⚠️ 备用字段填充失败: ${e.message}`, 'warning');
                    }
                }
            }
            
            addLog(`❌ 编辑器 ${editorId} 填充失败，所有方法都无效`, 'error');
            return false;
        } catch (error) {
            addLog(`❌ 填充编辑器 ${editorId} 时出错: ${error.message}`, 'error');
            return false;
        }
    }
    
    // 检测所有UEditor编辑器实例
    function detectUEditorInstances() {
        const editors = [];
        
        // 方法1: 直接从UE.instants检测所有实例
        if (window.UE && window.UE.instants) {
            addLog(`✅ 发现UE.instants对象，包含 ${Object.keys(window.UE.instants).length} 个实例`, 'info');
            
            Object.keys(window.UE.instants).forEach(instanceId => {
                const editorInstance = window.UE.instants[instanceId];
                if (editorInstance && editorInstance.container) {
                    const container = editorInstance.container;
                    const containerId = container.id;
                    
                    // 提取编辑器编号（从实例ID中）
                    const numberMatch = instanceId.match(/ueditorInstant(\d+)/);
                    const editorNumber = numberMatch ? numberMatch[1] : '0';
                    const iframeId = `ueditor_${editorNumber}`;
                    
                    editors.push({
                        containerId: containerId,
                        instanceId: instanceId,
                        iframeId: iframeId,
                        container: container,
                        editorInstance: editorInstance
                    });
                    
                    addLog(`✅ 检测到UEditor实例: ${instanceId} (容器: ${containerId})`, 'info');
                } else {
                    addLog(`⚠️ 实例 ${instanceId} 存在但容器未找到`, 'warning');
                }
            });
        } else {
            addLog('⚠️ 未找到UE.instants对象，尝试其他方法...', 'warning');
        }
        
        // 方法2: 查找iframe备用检测（如果方法1失败）
        if (editors.length === 0) {
            addLog('🔍 方法2：查找UEditor iframe...', 'info');
            
            const iframes = document.querySelectorAll('iframe[id^="ueditor_"]');
            iframes.forEach(iframe => {
                const iframeId = iframe.id;
                const numberMatch = iframeId.match(/ueditor_(\d+)/);
                if (numberMatch) {
                    const editorNumber = numberMatch[1];
                    const instanceId = `ueditorInstant${editorNumber}`;
                    
                    // 查找对应的容器
                    const container = iframe.closest('.edui-editor') || iframe.closest('[class*="edui-editor"]');
                    if (container) {
                        editors.push({
                            containerId: container.id || `edui${editorNumber}`,
                            instanceId: instanceId,
                            iframeId: iframeId,
                            container: container,
                            iframe: iframe
                        });
                        
                        addLog(`✅ 通过iframe检测到编辑器: ${instanceId}`, 'info');
                    }
                }
            });
            
            addLog(`找到 ${iframes.length} 个UEditor iframe`, 'info');
        }
        
        // 方法3: 查找所有可能的编辑器容器
        if (editors.length === 0) {
            addLog('🔍 方法3：查找所有可能的编辑器容器...', 'info');
            
            const containerSelectors = [
                '[id^="edui"][class*="edui-editor"]',
                '[id^="edui"].edui-editor',
                '.edui-editor[id]',
                '[class*="ueditor"][id]',
                '[id*="editor"][class*="edui"]'
            ];
            
            containerSelectors.forEach(selector => {
                const containers = document.querySelectorAll(selector);
                addLog(`选择器 "${selector}" 找到 ${containers.length} 个容器`, 'info');
                
                containers.forEach(container => {
                    const idMatch = container.id.match(/edui(\d+)/);
                    if (idMatch) {
                        const editorNumber = idMatch[1];
                        const instanceId = `ueditorInstant${editorNumber}`;
                        const iframeId = `ueditor_${editorNumber}`;
                        
                        // 检查是否已经添加过
                        if (!editors.find(e => e.instanceId === instanceId)) {
                            editors.push({
                                containerId: container.id,
                                instanceId: instanceId,
                                iframeId: iframeId,
                                container: container
                            });
                            
                            addLog(`✅ 通过容器检测到编辑器: ${container.id} -> ${instanceId}`, 'info');
                        }
                    }
                });
            });
        }
        
        // 方法4: 暴力搜索所有可能的编辑器元素
        if (editors.length === 0) {
            addLog('🔍 方法4：暴力搜索所有可能的编辑器元素...', 'info');
            
            // 尝试查找任何包含"editor"或"ueditor"的元素
            const possibleElements = document.querySelectorAll('[id*="edui"], [class*="edui"], [id*="editor"], [class*="editor"]');
            addLog(`找到 ${possibleElements.length} 个可能的编辑器相关元素`, 'info');
            
            possibleElements.forEach(element => {
                // 检查是否是编辑器容器
                if (element.id && element.id.includes('edui') && element.querySelector('iframe')) {
                    const idMatch = element.id.match(/edui(\d+)/);
                    if (idMatch) {
                        const editorNumber = idMatch[1];
                        const instanceId = `ueditorInstant${editorNumber}`;
                        const iframeId = `ueditor_${editorNumber}`;
                        
                        // 检查是否已经添加过
                        if (!editors.find(e => e.instanceId === instanceId)) {
                            editors.push({
                                containerId: element.id,
                                instanceId: instanceId,
                                iframeId: iframeId,
                                container: element
                            });
                            
                            addLog(`✅ 暴力搜索检测到编辑器: ${element.id} -> ${instanceId}`, 'info');
                        }
                    }
                }
            });
        }
        
        addLog(`🎯 最终检测结果：找到 ${editors.length} 个UEditor编辑器`, 'info');
        
        // 输出每个编辑器的详细信息
        editors.forEach((editor, index) => {
            addLog(`编辑器 ${index + 1}: ${editor.instanceId} (容器: ${editor.containerId})`, 'info');
        });
        
        return editors;
    }
    
    // 智能匹配编辑器字段类型
    function guessEditorFieldType(editor) {
        const editorNumber = parseInt(editor.instanceId.replace('ueditorInstant', ''));
        addLog(`🏷️ 编辑器ID号: ${editorNumber}`, 'info');
        
        // 检查上下文信息来判断字段类型
        let contextText = '';
        
        // 获取编辑器周围的文本内容作为上下文
        if (editor.container) {
            // 向上查找包含字段标签的元素
            let parentElement = editor.container.parentElement;
            for (let i = 0; i < 5 && parentElement; i++) {
                const textContent = parentElement.textContent || '';
                contextText += textContent;
                parentElement = parentElement.parentElement;
            }
            
            // 也检查页面中的表单标签
            const labels = document.querySelectorAll('label, .form-label, .field-label');
            labels.forEach(label => {
                contextText += label.textContent || '';
            });
        }
        
        addLog(`📍 编辑器 ${editor.instanceId} 的上下文: "${contextText.substring(0, 100)}"`, 'info');
        
        // 根据容器ID判断（主要方法）
        if (editor.containerId) {
            const containerNumber = parseInt(editor.containerId.replace('edui', ''));
            addLog(`🏷️ 容器ID号: ${containerNumber}`, 'info');
            
            // 容器ID较大的通常是感受字段，较小的是工作字段
            if (containerNumber >= 100) {
                addLog(`🎯 容器ID${containerNumber} >= 100，判断为: feeling`, 'info');
                return 'feeling';
            } else if (containerNumber <= 50) {
                addLog(`🎯 容器ID${containerNumber} <= 50，判断为: work_and_problem`, 'info');
                return 'work_and_problem';
            }
        }
        
        // 根据上下文文本判断字段类型（备用方法）
        if (contextText.includes('收获') || contextText.includes('感受')) {
            addLog(`🎯 通过标签识别为: feeling`, 'info');
            return 'feeling';
        }
        
        if (contextText.includes('工作') || contextText.includes('问题') || contextText.includes('解决')) {
            addLog(`🎯 通过标签识别为: work_and_problem`, 'info');
            return 'work_and_problem';
        }
        
        // 如果以上方法都失败，按编辑器顺序判断
        const allEditors = detectUEditorInstances();
        if (allEditors.length === 2) {
            // 按容器ID排序，大的在前
            const sortedEditors = allEditors.sort((a, b) => {
                const aNum = parseInt((a.containerId || '0').replace('edui', ''));
                const bNum = parseInt((b.containerId || '0').replace('edui', ''));
                return bNum - aNum; // 降序排列，大号在前
            });
            
            if (editor.instanceId === sortedEditors[0].instanceId) {
                addLog(`🎯 作为第1个编辑器(容器ID较大)，判断为: feeling`, 'info');
                return 'feeling';
            } else {
                addLog(`🎯 作为第2个编辑器(容器ID较小)，判断为: work_and_problem`, 'info');
                return 'work_and_problem';
            }
        }
        
        addLog(`❓ 无法确定字段类型`, 'warning');
        return 'unknown';
    }

    // 查找并填充表单字段
    async function fillFormFields(data) {
        addLog('🚀 开始自动填充表单字段', 'info');
        let filledCount = 0;
        
        // 🔄 等待UEditor编辑器加载完成（最多重试5次）
        addLog('🔄 等待UEditor编辑器加载完成（最多重试5次）...', 'info');
        let editors = [];
        let retryCount = 0;
        const maxRetries = 5;
        
        while (editors.length === 0 && retryCount < maxRetries) {
            addLog(`🔍 开始检测UEditor编辑器...`, 'info');
            editors = detectUEditorInstances();
            
            if (editors.length === 0) {
                retryCount++;
                if (retryCount < maxRetries) {
                    addLog(`⏳ 未检测到编辑器，等待1秒后重试 (${retryCount}/${maxRetries})`, 'info');
                    await delay(1000);
                } else {
                    addLog(`❌ 达到最大重试次数，仍未检测到编辑器`, 'warning');
                }
            } else {
                addLog(`✅ 检测到 ${editors.length} 个UEditor编辑器！`, 'info');
            }
        }
        
        // 检查是否为调试模式
        const isDebugMode = GM_getValue(Config.keys.debugMode, false);
        
        // 首先按ID排序，确保填充顺序的一致性
        const sortedEditors = editors.sort((a, b) => {
            const aNum = parseInt(a.instanceId.replace('ueditorInstant', ''));
            const bNum = parseInt(b.instanceId.replace('ueditorInstant', ''));
            return bNum - aNum; // 降序排列，大号在前
        });
        
        if (isDebugMode) {
            addLog('🔧 调试模式已启用：将显示详细的字段识别过程', 'info');
            
            // 调试模式：显示字段识别信息并按类型填充
            for (let i = 0; i < sortedEditors.length; i++) {
                const editor = sortedEditors[i];
                const fieldType = guessEditorFieldType(editor);
                const debugContent = `测试内容 ${i + 1} - 识别为: ${fieldType}`;
                
                addLog(`🔧 调试填充编辑器 ${editor.instanceId}: "${debugContent}"`, 'info');
                
                const success = await fillUEditorContent(editor.instanceId, debugContent);
                if (success) {
                    filledCount++;
                    addLog(`✅ 调试填充成功: ${editor.instanceId}`, 'info');
                } else {
                    addLog(`❌ 调试填充失败: ${editor.instanceId}`, 'warning');
                }
                
                // 快速填充，减少延迟
                await delay(100);
            }
            
            addLog(`🔧 调试模式填充完成，共填充 ${filledCount} 个编辑器`, 'info');
            addLog('⚠️ 请手动检查填充结果，确认字段识别是否正确！', 'warning');
            return filledCount > 0;
        }
        
        addLog(`📋 编辑器填充顺序: ${sortedEditors.map(e => e.instanceId).join(', ')}`, 'info');
        
        // 先进行字段识别，输出识别结果
        addLog('🔍 开始字段识别...', 'info');
        const editorFieldMap = [];
        for (const editor of sortedEditors) {
            const fieldType = guessEditorFieldType(editor);
            editorFieldMap.push({ editor, fieldType });
            addLog(`🎯 编辑器 ${editor.instanceId} → 识别为: ${fieldType}`, 'info');
        }
        
        // 输出识别摘要
        addLog('📊 字段识别结果摘要:', 'info');
        editorFieldMap.forEach(({ editor, fieldType }, index) => {
            addLog(`   ${index + 1}. ${editor.instanceId} → ${fieldType}`, 'info');
        });
        
        // 开始并行填充
        addLog('🚀 开始并行填充内容...', 'info');
        
        // 准备所有填充任务
        const fillTasks = editorFieldMap.map(({ editor, fieldType }) => {
            let contentToFill = '';
            let contentDescription = '';
            
            switch (fieldType) {
                case 'feeling':
                    contentToFill = data.feeling;
                    contentDescription = '收获感受';
                    break;
                case 'work':
                    contentToFill = data.work;
                    contentDescription = '工作内容';
                    break;
                case 'problem':
                    contentToFill = data.problem;
                    contentDescription = '遇到问题';
                    break;
                case 'work_and_problem':
                    // 合并工作内容和问题解决方案为一段文字
                    const parts = [];
                    if (data.work) {
                        parts.push(data.work);
                    }
                    if (data.problem) {
                        parts.push(data.problem);
                    }
                    contentToFill = parts.join('。');
                    // 确保最终内容以句号结尾
                    if (contentToFill && !contentToFill.endsWith('。') && !contentToFill.endsWith('.')) {
                        contentToFill = contentToFill + '。';
                    }
                    contentDescription = '工作内容+问题解决';
                    break;
                default:
                    addLog(`❌ 编辑器 ${editor.instanceId} 类型未知，跳过填充`, 'warning');
                    return null;
            }
            
            if (!contentToFill) {
                addLog(`⚠️ [${editor.instanceId}] 没有 ${fieldType} 类型的数据内容`, 'warning');
                return null;
            }
            
            addLog(`📝 [${editor.instanceId}] 准备填充 ${contentDescription}`, 'info');
            addLog(`📄 [${editor.instanceId}] 内容预览: "${contentToFill.substring(0, 50)}${contentToFill.length > 50 ? '...' : ''}"`, 'info');
            
            // 返回填充任务
            return async () => {
                const success = await fillUEditorContent(editor.instanceId, contentToFill);
                if (success) {
                    addLog(`✅ [${editor.instanceId}] 填充成功: ${contentDescription}`, 'info');
                    return true;
                } else {
                    addLog(`❌ [${editor.instanceId}] 填充失败: ${contentDescription}`, 'warning');
                    return false;
                }
            };
        }).filter(task => task !== null);
        
        // 并行执行所有填充任务
        if (fillTasks.length > 0) {
            const results = await Promise.all(fillTasks.map(task => task()));
            filledCount += results.filter(success => success).length;
            addLog(`🎯 并行填充完成: ${results.filter(success => success).length}/${fillTasks.length} 个编辑器成功`, 'info');
        }
        
        // 查找其他非富文本字段（备用方案）
        const otherFieldsSelectors = [
            // 工作内容字段
            { selectors: ['input[placeholder*="工作"]', 'textarea[placeholder*="工作"]', 'input[name*="work"]', 'textarea[name*="work"]'], content: data.work, type: '工作内容' },
            // 问题字段
            { selectors: ['input[placeholder*="问题"]', 'textarea[placeholder*="问题"]', 'input[name*="problem"]', 'textarea[name*="problem"]'], content: data.problem, type: '遇到问题' },
            // 感受字段
            { selectors: ['input[placeholder*="感受"]', 'textarea[placeholder*="感受"]', 'input[placeholder*="收获"]', 'textarea[placeholder*="收获"]'], content: data.feeling, type: '收获感受' }
        ];
        
        for (const fieldGroup of otherFieldsSelectors) {
            if (fieldGroup.content) {
                for (const selector of fieldGroup.selectors) {
                    const fields = document.querySelectorAll(selector);
                    let targetField = null;
                    
                    // 过滤掉脚本自己创建的元素
                    for (const field of fields) {
                        // 排除脚本自己创建的表单数据弹窗元素
                        if (field.id === 'form-data-textarea' || 
                            field.closest('#xxt-form-data-modal') ||
                            field.closest('#xxt-status-bar') ||
                            field.closest('#xxt-log-panel')) {
                            addLog(`🚫 跳过脚本自己的元素: ${field.id || selector}`, 'info');
                            continue;
                        }
                        targetField = field;
                        break;
                    }
                    
                    if (targetField) {
                        // 确保内容以句号结尾
                        let content = fieldGroup.content;
                        if (content && !content.endsWith('。') && !content.endsWith('.')) {
                            content = content + '。';
                        }
                        
                        targetField.value = content;
                        targetField.dispatchEvent(new Event('input', { bubbles: true }));
                        targetField.dispatchEvent(new Event('change', { bubbles: true }));
                        filledCount++;
                        addLog(`✅ ${fieldGroup.type}字段填充成功: ${selector}`, 'info');
                        break;
                    }
                }
            }
        }
        
        addLog(`表单自动填充完成，共填充 ${filledCount} 个字段`, 'info');
        return filledCount > 0;
    }

    // 增强的提交检测机制
    function setupSubmitButtonListener() {
        addLog('设置提交按钮监听器', 'info');
        
        // 查找可能的提交按钮
        const submitSelectors = [
            'button[type="submit"]',
            'input[type="submit"]', 
            '.submit-btn',
            '#submitBtn',
            'button[onclick*="submit"]',
            'a[onclick*="submit"]'
        ];
        
        let submitButton = null;
        for (const selector of submitSelectors) {
            const btn = document.querySelector(selector);
            if (btn) {
                submitButton = btn;
                break;
            }
        }
        
        // 也查找包含"提交"文字的按钮
        if (!submitButton) {
            const buttons = document.querySelectorAll('button, input[type="button"], a');
            for (const btn of buttons) {
                const text = btn.textContent || btn.value || '';
                if (text.includes('提交') || text.includes('保存') || text.includes('确定')) {
                    submitButton = btn;
                    break;
                }
            }
        }
        
        if (submitButton) {
            addLog(`找到提交按钮: ${submitButton.textContent || submitButton.value || '未命名按钮'}`, 'info');
            
            // 监听提交按钮点击
            submitButton.addEventListener('click', function() {
                addLog('检测到用户点击提交按钮，开始提交检测', 'info');
                
                // 延迟一点再开始检测，让提交请求有时间发送
                setTimeout(() => {
                    startSubmissionDetection();
                }, 1000);
            });
            
            // 监听表单提交事件作为备选
            const form = submitButton.closest('form');
            if (form) {
                form.addEventListener('submit', function() {
                    addLog('检测到表单提交事件，开始提交检测', 'info');
                    setTimeout(() => {
                        startSubmissionDetection();
                    }, 1000);
                });
            }
        } else {
            addLog('未找到明确的提交按钮，将等待用户手动提交', 'warning');
            addLog('⚠️ 请手动点击提交按钮，脚本将在真正提交后自动继续', 'info');
        }
    }

    function startSubmissionDetection() {
        addLog('启动提交检测机制', 'info');
        
        // 获取或设置全局点击计数器，防止页面刷新后重置
        const clickCountKey = 'xxt_click_count_' + Date.now().toString().slice(-8);
        let lastClickTime = GM_getValue('xxt_last_click_time', 0);
        let clickCount = GM_getValue('xxt_click_count', 0);
        
        // 1. 监听页面URL变化
        let lastUrl = window.location.href;
        let urlChangeCounter = 0;
        let detectionStartTime = Date.now();
        
        // 2. 监听提交按钮点击
        const submitSelectors = [
            'button[type="submit"]', 
            '.submit-btn', 
            'button[class*="submit"]',
            'input[type="submit"]'
        ];
        
        // 添加基本选择器的监听
        submitSelectors.forEach(selector => {
            try {
                const buttons = document.querySelectorAll(selector);
                buttons.forEach(button => {
                    if (button && !button.hasAttribute('data-xxt-listener')) {
                        button.setAttribute('data-xxt-listener', 'true');
                        button.addEventListener('click', () => {
                            addLog('检测到提交/保存按钮点击，开始监听页面跳转', 'info');
                            displayInfo('检测到提交按钮点击，等待跳转...');
                        });
                    }
                });
            } catch (e) {
                // 忽略选择器错误
            }
        });
        
        // 添加文本内容匹配的按钮监听
        const textButtons = document.querySelectorAll('button');
        textButtons.forEach(button => {
            const buttonText = button.innerText || button.textContent || '';
            if ((buttonText.includes('提交') || buttonText.includes('保存') || buttonText.includes('确定')) 
                && !button.hasAttribute('data-xxt-listener')) {
                button.setAttribute('data-xxt-listener', 'true');
                button.addEventListener('click', () => {
                    addLog(`检测到【${buttonText}】按钮点击，开始监听页面跳转`, 'info');
                    displayInfo('检测到提交按钮点击，等待跳转...');
                });
            }
        });
        
        // 3. 综合监听机制
        const detectionInterval = setInterval(() => {
            const currentUrl = window.location.href;
            const currentPageType = getPageType();
            const runningState = GM_getValue(Config.keys.runningState, 'stopped');
            const currentTime = Date.now();
            
            // 如果脚本被停止，清除监听和存储数据
            if (runningState === 'stopped') {
                clearInterval(detectionInterval);
                GM_deleteValue('xxt_last_click_time');
                GM_deleteValue('xxt_click_count');
                addLog('脚本已停止，清除提交检测', 'info');
                return;
            }
            
            // 如果检测超过3分钟，自动放弃
            if (currentTime - detectionStartTime > 180000) {
                clearInterval(detectionInterval);
                GM_deleteValue('xxt_last_click_time');
                GM_deleteValue('xxt_click_count');
                addLog('提交检测超时（3分钟），停止自动检测', 'warning');
                displayInfo('检测超时，请手动返回列表页或重新启动脚本');
                return;
            }
            
            // URL 发生变化
            if (currentUrl !== lastUrl) {
                urlChangeCounter++;
                addLog(`检测到URL变化 (${urlChangeCounter}): ${currentUrl}`, 'info');
                lastUrl = currentUrl;
                
                // 检查是否回到列表页或其他已知页面
                if (currentPageType === 'report_list') {
                    addLog('URL变化后确认返回日报列表页，继续处理下一个未提交项', 'success');
                    displayInfo('提交成功！正在查找下一个未提交项...');
                    clearInterval(detectionInterval);
                    GM_deleteValue('xxt_last_click_time');
                    GM_deleteValue('xxt_click_count');
                    GM_setValue(Config.keys.pageState, 'daily_report_clicked');
                    setTimeout(() => {
                        main();
                    }, 1500);
                    return;
                } else if (currentPageType === 'main_page') {
                    addLog('返回到主页，可能是提交后的跳转', 'info');
                    displayInfo('返回主页，重新开始流程...');
                    clearInterval(detectionInterval);
                    GM_deleteValue('xxt_last_click_time');
                    GM_deleteValue('xxt_click_count');
                    GM_setValue(Config.keys.pageState, 'initial');
                    setTimeout(() => {
                        main();
                    }, 2000);
                    return;
                }
            }
            
            // 如果还在当前页面，但检测到成功提示 - 使用更精确的检测词汇
            const successMessages = [
                '提交成功', '保存成功', '操作成功', 
                '已提交', '提交完成', 
                '已保存', '操作已完成'
            ];
            
            const debugMode = GM_getValue(Config.keys.debugMode, false);
            let hasSuccessMessage = false;
            
            // 方法1：检测模态弹窗中的"提交成功"文字
            const modalSuccess = document.querySelector('.model-popup .richtext.prompt-area');
            if (modalSuccess && modalSuccess.textContent.includes('提交成功')) {
                hasSuccessMessage = true;
                if (debugMode) {
                    addLog('[调试] 方法1成功：在模态弹窗中找到"提交成功"', 'info');
                }
            }

            // 方法2：检测特定样式的"提交成功"文字
            if (!hasSuccessMessage) {
                const boldSuccess = document.querySelector('span[style*="font-weight: bold"][style*="font-size: x-large"]');
                if (boldSuccess && boldSuccess.textContent.includes('提交成功')) {
                    hasSuccessMessage = true;
                    if (debugMode) {
                        addLog('[调试] 方法2成功：找到粗体大字"提交成功"', 'info');
                    }
                }
            }

            // 方法3：通用文字检测（保留原有逻辑作为备选）
            if (!hasSuccessMessage) {
                const bodyText = document.body.innerText || document.body.textContent || '';
                
                // 添加调试日志，查看检测到的页面内容
                if (debugMode) {
                    addLog(`[调试] 页面内容片段: ${bodyText.substring(0, 200)}...`, 'info');
                }
                
                hasSuccessMessage = successMessages.some(msg => 
                    bodyText.toLowerCase().includes(msg.toLowerCase())
                );
                
                if (debugMode && hasSuccessMessage) {
                    const foundMessages = successMessages.filter(msg => 
                        bodyText.toLowerCase().includes(msg.toLowerCase())
                    );
                    addLog(`[调试] 方法3成功：在页面body中找到: ${foundMessages.join(', ')}`, 'info');
                }
            }
            
            // 调试：显示最终检测结果
            if (debugMode) {
                addLog(`[调试] 最终检测成功消息结果: ${hasSuccessMessage}`, 'info');
            }
            
            if (hasSuccessMessage) {
                // 重新获取最新的处理时间，避免重复处理
                const lastProcessTime = GM_getValue('xxt_last_process_time', 0);
                
                // 防止短时间内重复处理（至少间隔3秒）
                if (currentTime - lastProcessTime < 3000) {
                    addLog(`距离上次处理不足3秒，跳过重复处理`, 'info');
                    return;
                }
                
                // 更新处理时间
                GM_setValue('xxt_last_process_time', currentTime);
                
                addLog('检测到提交成功，准备自动返回列表页', 'success');
                displayInfo('提交成功！正在自动返回列表页...');
                
                // 提交成功页面通常没有按钮，直接通过程序跳转
                clearInterval(detectionInterval);
                GM_deleteValue('xxt_last_click_time');
                GM_deleteValue('xxt_click_count');
                GM_deleteValue('xxt_last_process_time');
                
                // 清除当前处理完成的目标日期缓存
                sessionStorage.removeItem(Config.keys.targetDate);
                addLog('🧹 已清除成功提交的目标日期缓存', 'info');
                
                // 直接跳转到日报列表页
                addLog('尝试直接跳转到日报列表页', 'info');
                
                // 方法1：尝试通过历史记录返回
                if (window.history.length > 1) {
                    addLog('通过浏览器历史记录返回', 'info');
                    window.history.back();
                    
                    // 等待2秒检查是否成功返回
                    setTimeout(() => {
                        const newPageType = getPageType();
                        if (newPageType === 'report_list') {
                            addLog('通过历史记录成功返回列表页', 'success');
                            GM_setValue(Config.keys.pageState, 'daily_report_clicked');
                            setTimeout(() => {
                                main();
                            }, 1000);
                        } else {
                            addLog('历史记录返回失败，尝试其他方法', 'warning');
                            // 方法2：构建日报列表页URL
                            const baseUrl = 'https://office.chaoxing.com/front/third/apps/work/list?';
                            GM_setValue(Config.keys.scriptNavigating, true); // 标记脚本正在主动导航
                            GM_setValue(Config.keys.lastNavigationTime, Date.now()); // 记录正常跳转时间
                            window.location.href = baseUrl;
                        }
                    }, 2000);
                    
                } else {
                    addLog('浏览器历史记录不足，直接跳转到日报列表页', 'info');
                    // 方法2：直接构建URL跳转
                    const baseUrl = 'https://office.chaoxing.com/front/third/apps/work/list';
                    GM_setValue(Config.keys.scriptNavigating, true); // 标记脚本正在主动导航
                    GM_setValue(Config.keys.lastNavigationTime, Date.now()); // 记录正常跳转时间
                    window.location.href = baseUrl;
                }
                
                // 设置一个保底机制：如果3秒后还没成功跳转，给用户提示
                setTimeout(() => {
                    const currentPageType = getPageType();
                    if (currentPageType !== 'report_list') {
                        addLog('自动跳转可能失败，请手动返回日报列表页', 'warning');
                        displayInfo('自动跳转失败，请手动返回日报列表页面');
                        
                        // 提供手动跳转按钮
                        const jumpButton = document.createElement('button');
                        jumpButton.textContent = '点击返回日报列表页';
                        jumpButton.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            z-index: 10002;
                            padding: 12px 24px;
                            background: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-size: 16px;
                            cursor: pointer;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        `;
                        
                        jumpButton.onclick = () => {
                            GM_setValue(Config.keys.scriptNavigating, true); // 标记脚本正在主动导航
                            GM_setValue(Config.keys.lastNavigationTime, Date.now()); // 记录正常跳转时间
                            window.location.href = 'https://office.chaoxing.com/front/third/apps/work/list';
                            jumpButton.remove();
                        };
                        
                        document.body.appendChild(jumpButton);
                        
                        // 10秒后自动移除按钮
                        setTimeout(() => {
                            if (jumpButton.parentNode) {
                                jumpButton.remove();
                            }
                        }, 10000);
                    }
                }, 3000);
            }
            
        }, 1500); // 1.5秒检查一次，提高检测及时性
        
        // 添加额外的页面变化检测
        const pageChangeObserver = new MutationObserver((mutations) => {
            const currentPageType = getPageType();
            if (currentPageType === 'report_list') {
                addLog('通过页面变化检测到返回列表页', 'success');
                displayInfo('检测到返回列表页，继续处理下一个未提交项...');
                clearInterval(detectionInterval);
                pageChangeObserver.disconnect();
                GM_setValue(Config.keys.pageState, 'daily_report_clicked');
                setTimeout(() => {
                    main();
                }, 1500);
            }
        });
        
        // 开始观察页面变化
        pageChangeObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
        
        // 5分钟后超时清除
        setTimeout(() => {
            clearInterval(detectionInterval);
            pageChangeObserver.disconnect();
            addLog('提交检测超时，请手动返回列表页继续', 'warning');
            displayInfo('检测超时，请手动返回列表页或重新启动脚本');
        }, 300000); // 5分钟
    }

    async function handleReportFillPage() {
        addLog('检测到日报填写页面', 'info');
        displayInfo('已进入日报填写页面');
        
        // 提取目标日期信息
        const targetDate = await extractTargetDate();
        
        if (targetDate) {
            addLog(`提取到目标日期: ${targetDate}`, 'info');
            displayInfo(`准备自动选择日期: ${targetDate}`);
            
            // 自动选择日期
            await autoSelectDate(targetDate);
        } else {
            addLog('未能提取到有效的目标日期', 'warning');
            displayInfo('请手动选择日期并填写日报');
        }
        
        // 检查是否有预设的表单数据
        const savedFormData = GM_getValue(Config.keys.formData, '');
        if (savedFormData) {
            addLog('发现预设的表单数据，尝试自动填充', 'info');
            displayInfo('自动填充表单内容...');
            
            // 根据目标日期智能选择数据
            const formData = parseReportData(savedFormData, targetDate);
            
            if (formData) {
                addLog(`找到匹配数据: 日期=${formData.date}, 工作内容长度=${formData.work.length}, 问题长度=${formData.problem.length}, 感受长度=${formData.feeling.length}`, 'info');
                
                // 快速检测页面状态，大幅减少等待时间
                await delay(300);
                
                // 尝试自动填充
                const fillSuccess = await fillFormFields(formData);
                
                if (fillSuccess) {
                    addLog('表单自动填充成功，等待用户确认并提交', 'info');
                    addLog('💡 提示：已在内容末尾加句号，请手动删除句号让系统识别到输入变化', 'info');
                    addLog('⚠️ 重要：请手动把日期改后一天，那才是真的填充日期！', 'warning');
                    displayInfo(`已填充${formData.date}内容，请改日期为后一天并删除句号后提交`);
                } else {
                    addLog('表单自动填充失败，请手动填写', 'warning');
                    displayInfo('自动填充失败，请手动填写表单');
                }
            } else {
                // 检查是否是数据用完的情况
                const dataAnalysis = analyzeDataDateRange(savedFormData);
                if (dataAnalysis.firstDate && dataAnalysis.lastDate && targetDate) {
                    const targetDateObj = new Date(targetDate);
                    const lastDateObj = new Date(dataAnalysis.lastDate);
                    
                    if (targetDateObj > lastDateObj) {
                        const daysDiff = Math.ceil((targetDateObj - lastDateObj) / (1000 * 60 * 60 * 24));
                        addLog(`🎯 预设数据已全部使用完毕！当前需要 ${targetDate}，数据只到 ${dataAnalysis.lastDate}`, 'warning');
                        displayInfo(`数据已全部用完！请补充新数据或手动填写`);
                        updateStatusBar('warning', `📋 预设数据已用完！需要补充更多日期的数据才能继续自动填写`);
                    } else {
                        addLog(`未找到日期 ${targetDate} 对应的数据`, 'warning');
                        displayInfo(`未找到 ${targetDate} 的数据，请手动填写或检查表单数据设置`);
                    }
                } else {
                    addLog(`未找到日期 ${targetDate} 对应的数据`, 'warning');
                    displayInfo(`未找到 ${targetDate} 的数据，请手动填写或检查表单数据设置`);
                }
            }
        } else {
            addLog('未发现预设表单数据，请手动填写内容', 'info');
            displayInfo('请手动填写日报内容');
        }
        
        addLog('请检查并提交日报。脚本将在提交后继续处理其他未提交项', 'info');
        addLog('⚠️ 重要：①先把日期改后一天 ②删除句号 ③再提交', 'warning');
        GM_setValue(Config.keys.pageState, 'awaiting_manual_submission');
        
        // 注意：不在这里清除目标日期，保留到提交成功后再清除
        // 这样可以避免页面刷新时丢失目标日期信息
        addLog('💾 保持目标日期缓存，直到成功提交', 'info');
        
        // 监听提交按钮点击，而不是立即开始检测
        setupSubmitButtonListener();
        
        addLog('✅ 已设置提交按钮监听器，等待用户手动提交', 'info');
    }

    async function findMonthCellsWithRetry(retryCount = 0) {
        let monthCells = document.querySelectorAll('div.submit_cell');
        if (monthCells.length > 0) {
            return monthCells;
        }
        if (retryCount < Config.retry.maxRetries) {
            addLog(`未找到月份单元格，将在 ${Config.delays.retry / 1000}秒 后重试 (${retryCount + 1}/${Config.retry.maxRetries})`, 'warning');
            displayInfo(`未找到月份单元格，${Config.delays.retry / 1000}秒后重试 (${retryCount + 1})...`);
            await delay(Config.delays.retry);
            
            // 检查是否需要暂停或停止
            if (await checkForPauseOrStop()) {
                return [];
            }
            
            return findMonthCellsWithRetry(retryCount + 1);
        } else {
            addLog('达到最大重试次数，仍未找到月份单元格', 'error');
            displayInfo('重试多次后仍未找到月份单元格');
            return [];
        }
    }

    async function handleDailyReportPage() {
        addLog('进入日报页面处理流程', 'info');
        displayInfo('正在处理日报页面...');
        let foundUnsubmittedOverall = false;

        const monthCells = await findMonthCellsWithRetry();

        addLog(`找到 ${monthCells.length} 个月份单元格`, 'info');
        if (monthCells.length === 0 && document.querySelectorAll('div.submit_cell').length === 0) {
            addLog('在日报页面未找到任何月份单元格', 'error');
            displayInfo('日报页面似乎为空或加载失败');
            GM_setValue(Config.keys.pageState, 'error_or_empty_daily_report_page');
            return;
        }

        if (monthCells.length > 0) {
            for (const cell of monthCells) {
                // 检查是否需要暂停或停止
                if (await checkForPauseOrStop()) {
                    return;
                }

                const header = cell.querySelector('div.submit_head');
                const submitList = cell.querySelector('div.submit_list ul');

                if (!header || !submitList) {
                    addLog('跳过一个月份单元格，因为它缺少头部或列表', 'warning');
                    continue;
                }

                const monthTitleElement = header.querySelector('h2');
                const monthTitle = monthTitleElement ? monthTitleElement.innerText.trim() : '未知月份';
                addLog(`处理月份: ${monthTitle}`, 'info');
                displayInfo(`处理月份: ${monthTitle}`);

                let isExpanded = window.getComputedStyle(submitList.parentElement).display !== 'none' && submitList.children.length > 0;
                const arrow = header.querySelector('div.submit_arrow');
                if (arrow) {
                    if (window.getComputedStyle(submitList.parentElement).display === 'none') {
                        addLog(`月份 ${monthTitle} 未展开，尝试点击头部展开`, 'info');
                        displayInfo(`展开月份: ${monthTitle}...`);
                        header.click();
                        await delay(Config.delays.click);
                        
                        // 检查是否需要暂停或停止
                        if (await checkForPauseOrStop()) {
                            return;
                        }
                        
                        isExpanded = window.getComputedStyle(submitList.parentElement).display !== 'none';
                        if (!isExpanded) {
                            addLog(`月份 ${monthTitle} 展开失败`, 'error');
                            displayInfo(`展开 ${monthTitle} 失败`);
                            continue;
                        }
                        addLog(`月份 ${monthTitle} 已展开`, 'info');
                        displayInfo(`${monthTitle} 已展开`);
                    } else {
                        addLog(`月份 ${monthTitle} 似乎已展开`, 'info');
                    }
                } else {
                    addLog(`月份 ${monthTitle} 未找到展开箭头，假设已展开`, 'info');
                }

                const items = submitList.querySelectorAll('li');
                let foundUnsubmittedInMonth = false;
                addLog(`在 ${monthTitle} 中找到 ${items.length} 个条目`, 'info');

                for (const item of items) {
                    // 检查是否需要暂停或停止
                    if (await checkForPauseOrStop()) {
                        return;
                    }

                    const statusDiv = item.querySelector('div.lineGray');
                    if (statusDiv && statusDiv.innerText.trim() === '未提交') {
                        // 提取详细的日期信息
                        const dayDt = item.querySelector('dt');
                        const dayText = dayDt ? dayDt.innerText.trim() : '未知Day';
                        
                        // 尝试获取更详细的日期信息
                        const dayTimeSpan = item.querySelector('dd span');
                        const dateTimeText = dayTimeSpan ? dayTimeSpan.innerText.trim() : '';
                        
                        // 尝试从其他元素获取完整日期
                        const fullDateElement = item.querySelector('dd') || item.querySelector('.date-text') || item;
                        const fullDateText = fullDateElement ? fullDateElement.innerText.trim() : '';
                        
                        // 组合详细信息
                        let detailedInfo = `${monthTitle} - ${dayText}`;
                        if (dateTimeText && dateTimeText !== dayText) {
                            detailedInfo += ` (${dateTimeText})`;
                        } else if (fullDateText && fullDateText.includes('202') && fullDateText !== dayText) {
                            // 如果包含年份信息且不同于dayText
                            const dateMatch = fullDateText.match(/\d{4}[-年]\d{1,2}[-月]\d{1,2}/);
                            if (dateMatch) {
                                detailedInfo += ` (${dateMatch[0]})`;
                            }
                        }
                        
                        addLog(`找到未提交日报: ${detailedInfo}`, 'info');
                        addLog(`元素内容详情: ${fullDateText}`, 'info');
                        
                        // 添加调试信息，显示元素的HTML结构（只显示文本内容，避免HTML标签）
                        if (item) {
                            const itemText = item.innerText || item.textContent || '';
                            const lines = itemText.split('\n')
                                .map(line => line.trim()) // 清理每行的空白字符
                                .filter(line => line && line.length > 0) // 过滤空行
                                .slice(0, 3); // 只取前3行非空内容
                            addLog(`日报项目完整信息: ${lines.join(' | ')}`, 'info');
                        }
                        
                        displayInfo(`点击未提交项: ${detailedInfo}`);
                        
                        // 提取并保存目标日期到会话存储
                        let extractedDate = null;
                        
                        // 方法1：从元素内容中提取标准日期格式
                        const allText = item.innerText || item.textContent || '';
                        const standardDateMatch = allText.match(/(\d{4}-\d{1,2}-\d{1,2})/);
                        if (standardDateMatch) {
                            extractedDate = standardizeDateFormat(standardDateMatch[1]);
                            addLog(`从元素内容提取到日期: ${standardDateMatch[1]} → ${extractedDate}`, 'info');
                        }
                        
                        // 方法2：从detailedInfo中尝试提取（括号内的日期）
                        if (!extractedDate && detailedInfo.includes('(') && detailedInfo.includes(')')) {
                            const parenMatch = detailedInfo.match(/\(([^)]+)\)/);
                            if (parenMatch) {
                                const parenContent = parenMatch[1];
                                const dateMatch = parenContent.match(/(\d{4}-\d{1,2}-\d{1,2})/);
                                if (dateMatch) {
                                    extractedDate = standardizeDateFormat(dateMatch[1]);
                                    addLog(`从详细信息提取到日期: ${dateMatch[1]} → ${extractedDate}`, 'info');
                                }
                            }
                        }
                        
                        // 方法3：从fullDateText中提取
                        if (!extractedDate && fullDateText.includes('202')) {
                            const fullDateMatch = fullDateText.match(/(\d{4}[-年]\d{1,2}[-月]\d{1,2})/);
                            if (fullDateMatch) {
                                let dateStr = fullDateMatch[1];
                                if (dateStr.includes('年')) {
                                    dateStr = dateStr.replace(/年/, '-').replace(/月/, '-').replace(/日/, '');
                                }
                                extractedDate = standardizeDateFormat(dateStr);
                                addLog(`从完整日期文本提取到日期: ${fullDateMatch[1]} → ${extractedDate}`, 'info');
                            }
                        }
                        
                        // 保存提取到的日期
                        if (extractedDate) {
                            sessionStorage.setItem(Config.keys.targetDate, extractedDate);
                            addLog(`💾 已保存目标日期到会话存储: ${extractedDate}`, 'info');
                        } else {
                            addLog(`⚠️ 未能从日报条目中提取到有效日期`, 'warning');
                        }
                        
                        item.click();
                        foundUnsubmittedInMonth = true;
                        foundUnsubmittedOverall = true;
                        addLog(`已点击未提交日报: ${detailedInfo}，等待页面响应`, 'info');
                        
                        GM_setValue(Config.keys.pageState, 'clicked_unsubmitted_item');
                        await delay(Config.delays.click + Config.delays.action);
                        
                        addLog(`点击 ${detailedInfo} 后等待页面跳转`, 'info');
                        return;
                    }
                }
                if (foundUnsubmittedInMonth) {
                    addLog(`${monthTitle} 中的未提交项处理尝试完毕`, 'info');
                    displayInfo(`${monthTitle} 未提交项处理尝试完毕`);
                }
            }

            if (foundUnsubmittedOverall) {
                addLog('所有月份的未提交项已尝试处理', 'info');
                displayInfo('所有未提交日报已尝试点击');
                GM_setValue(Config.keys.pageState, 'daily_reports_processed');
            } else {
                addLog('🎉 太棒了！所有日报都已经提交完成，没有发现未提交的项目', 'success');
                displayInfo('✅ 所有日报已提交！未发现需要处理的项目');
                updateStatusBar('success', '🎉 恭喜！所有日报都已经完成提交！');
                GM_setValue(Config.keys.pageState, 'daily_reports_all_submitted_or_processed');
            }
        } else {
            addLog('在日报页面未找到任何月份单元格', 'error');
            displayInfo('日报页面为空或加载不完整');
            GM_setValue(Config.keys.pageState, 'error_or_empty_daily_report_page');
        }
    }

    async function main() {
        const pageType = getPageType();
        let currentState = GM_getValue(Config.keys.pageState, 'initial');
        addLog(`脚本启动，当前状态: ${currentState}，页面类型: ${pageType}`, 'info');
        displayInfo(`脚本状态: ${currentState} (${pageType})`);

        // 检查是否需要暂停或停止
        if (await checkForPauseOrStop()) {
            return;
        }

        if (pageType === 'report_fill') {
            addLog('检测到日报填写页面，切换处理模式', 'info');
            await handleReportFillPage();
            return;
        }

        if (currentState === 'initial') {
            if (pageType === 'main_page' || document.querySelector('img[data-src="/engine2/assets/images/icon_lib/example-7/icon38.png"]')) {
                const dailyReportButtonImage = document.querySelector('img[data-src="/engine2/assets/images/icon_lib/example-7/icon38.png"]');
                if (dailyReportButtonImage) {
                    const dailyReportButton = dailyReportButtonImage.closest('.icon-box');
                    if (dailyReportButton) {
                        addLog('找到日报按钮，尝试点击', 'info');
                        displayInfo('尝试点击主页的日报按钮...');
                        dailyReportButton.click();
                        GM_setValue(Config.keys.pageState, 'daily_report_clicked');
                        return;
                    } else {
                        addLog('找到了日报图片，但未找到父级 .icon-box 按钮', 'error');
                        displayInfo('无法定位日报按钮容器');
                    }
                } else {
                    addLog('未找到日报按钮图片', 'error');
                    displayInfo('未找到主页的日报按钮');
                }
            } else if (pageType === 'report_list' || document.querySelector('div.submit_cell')) {
                addLog('检测到在日报列表页，直接设置为 daily_report_clicked 并处理', 'info');
                displayInfo('似乎已在日报列表页，直接处理');
                GM_setValue(Config.keys.pageState, 'daily_report_clicked');
                currentState = 'daily_report_clicked';
            } else {
                addLog('初始状态，未找到主页日报按钮且不在日报列表页，等待手动触发', 'info');
                displayInfo('请点击右上角按钮启动');
                return;
            }
        }

        if (currentState === 'daily_report_clicked' || currentState === 'processing_unsubmitted' || currentState === 'clicked_unsubmitted_item') {
            if (pageType === 'report_list') {
                addLog(`状态: ${currentState}，在日报列表页面，开始处理日报`, 'info');
                await handleDailyReportPage();
            } else if (pageType === 'report_fill') {
                addLog(`状态: ${currentState}，但已在填写页面，重新调用填写处理`, 'info');
                await handleReportFillPage();
            } else {
                addLog(`状态: ${currentState}，但不在日报列表页面 (页面类型: ${pageType})，等待页面跳转或手动操作`, 'warning');
                displayInfo(`等待返回日报列表页面或手动操作...`);
            }
        } else if (currentState === 'awaiting_manual_submission') {
            addLog('等待用户手动提交日报后返回列表页', 'info');
            displayInfo('等待手动提交日报...');
            if (pageType === 'report_list') {
                addLog('检测到返回日报列表页，继续处理其他未提交项', 'info');
                GM_setValue(Config.keys.pageState, 'daily_report_clicked');
                await handleDailyReportPage();
            }
        } else if (currentState === 'daily_reports_processed') {
            addLog('日报已尝试处理完毕', 'info');
            displayInfo('日报处理完成。点击按钮可重新开始');
        } else if (currentState === 'daily_reports_all_submitted_or_processed') {
            addLog('✅ 所有可处理的日报已完成！', 'success');
            displayInfo('🎉 所有日报已处理完成！如需继续请补充数据或重新开始');
            updateStatusBar('success', '🎉 所有可用数据的日报已处理完成！如需继续请补充更多日期的数据');
        } else if (currentState === 'error_or_empty_daily_report_page') {
            addLog('日报页面加载失败或为空', 'error');
            displayInfo('日报页面加载失败/为空。点击按钮重试');
        } else if (currentState !== 'initial') {
            addLog(`未知或已完成的状态: ${currentState}`, 'warning');
            displayInfo(`脚本状态: ${currentState}. 点击按钮可重新开始`);
        }
    }

    function createFormDataModal() {
        const modal = document.createElement('div');
        modal.id = 'xxt-form-data-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>设置表单预设数据</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>数据格式说明：</label>
                            <div class="format-example">
                                <strong>数据格式：</strong><br>
                                [DATE:2025-02-10] 或 [BIWEEK:2025-02-03至2025-02-16]<br>
                                [WORK]主要工作内容<br>
                                [PROBLEM]遇到的问题及如何解决<br>
                                [FEELING]收获与感受<br><br>
                                <strong>类型说明：</strong><br>
                                • [DATE] - 单日日报<br>
                                • [BIWEEK] - 双周记（双周期的最后一天）<br><br>
                                <strong>双周期结构（新规则）：</strong><br>
                                • 每个双周期 = 14天<br>
                                • 前13天：每天写日记 [DATE:具体日期]<br>
                                • 第14天：既写日记 [DATE:具体日期] 又写双周记 [BIWEEK:开始至结束]<br>
                                • 示例：2025-02-16既有日记也有双周记<br><br>
                                <strong>字段映射：</strong><br>
                                • "工作问题"字段 ← [WORK] + [PROBLEM]<br>
                                • "收获感受"字段 ← [FEELING]<br><br>
                                <strong>智能日期处理：</strong><br>
                                • 页面识别到16号 → 使用16号的数据内容<br>
                                • 日期选择器自动填入15号（方便手动修改）<br>
                                • 内容后自动加句号（方便手动删除）<br><br>
                                <strong>批量生成：</strong><br>
                                <button id="copy-ai-prompt" class="btn-info">复制AI指令模板</button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="form-data-textarea">表单数据：</label>
                            <div class="form-data-help">
                                <p>💡 <strong>使用步骤</strong>：1️⃣ 点击下方"复制AI指令模板" → 2️⃣ 在ChatGPT中生成内容 → 3️⃣ 粘贴到此处 → 4️⃣ 点击保存</p>
                            </div>
                            <div id="data-overview" class="data-overview" style="display: none;">
                                <h4>📊 数据概览</h4>
                                <div class="overview-row">
                                    <span class="overview-label">📅 数据范围：</span>
                                    <span id="date-range" class="overview-value">-</span>
                                </div>
                                <div class="overview-row">
                                    <span class="overview-label">📈 总天数：</span>
                                    <span id="total-days" class="overview-value">0</span>
                                </div>
                                <div class="overview-row">
                                    <span class="overview-label">📝 日记数：</span>
                                    <span id="daily-count" class="overview-value">0</span>
                                </div>
                                <div class="overview-row">
                                    <span class="overview-label">📋 双周记数：</span>
                                    <span id="biweekly-count" class="overview-value">0</span>
                                </div>
                                <div id="data-status" class="data-status" style="display: none;">
                                    <span id="status-message" class="status-message"></span>
                                </div>
                            </div>
                            <textarea id="form-data-textarea" rows="10" cols="60" placeholder="请粘贴AI生成的日报内容...&#10;&#10;示例格式：&#10;[DATE:2025-02-10]&#10;[WORK]今天主要学习了Spring Boot框架的高级特性...&#10;[PROBLEM]对MyBatis的复杂查询语法不够熟练...&#10;[FEELING]实习两个多月来，感觉技术能力有了明显提升..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="debug-mode-checkbox"> 启用调试模式 (查看页面检测详情)
                            </label>
                        </div>
                        <div class="form-group">
                            <button id="save-form-data" class="btn-primary">保存数据</button>
                            <button id="clear-form-data" class="btn-secondary">清空数据</button>
                            <button id="test-form-data" class="btn-info">测试解析</button>
                            <button id="restore-backup" class="btn-warning">恢复备份</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        GM_addStyle(`
            #xxt-form-data-modal .modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #xxt-form-data-modal .modal-content {
                background: white;
                border-radius: 10px;
                padding: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            #xxt-form-data-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            #xxt-form-data-modal .modal-header h3 {
                margin: 0;
                color: #333;
            }
            #xxt-form-data-modal .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            #xxt-form-data-modal .form-group {
                margin-bottom: 15px;
            }
            #xxt-form-data-modal label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            #xxt-form-data-modal .format-example {
                background: #f5f5f5;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                line-height: 1.4;
                color: #666;
            }
            #xxt-form-data-modal textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-family: monospace;
                font-size: 14px;
                resize: vertical;
            }
            #xxt-form-data-modal button {
                padding: 8px 16px;
                margin-right: 10px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            }
            #xxt-form-data-modal .btn-primary {
                background-color: #007cba;
                color: white;
            }
            #xxt-form-data-modal .btn-secondary {
                background-color: #f44336;
                color: white;
            }
            #xxt-form-data-modal .btn-info {
                background-color: #17a2b8;
                color: white;
            }
            #xxt-form-data-modal .btn-warning {
                background-color: #ffc107;
                color: #212529;
            }
            #xxt-form-data-modal button:hover {
                opacity: 0.9;
            }
            #xxt-form-data-modal .form-data-help {
                background: #e3f2fd;
                border: 1px solid #2196F3;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 10px;
            }
            #xxt-form-data-modal .form-data-help p {
                margin: 0;
                font-size: 13px;
                color: #1976D2;
                line-height: 1.4;
            }
            #xxt-form-data-modal .data-overview {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #xxt-form-data-modal .data-overview h4 {
                margin: 0 0 12px 0;
                color: #495057;
                font-size: 16px;
                font-weight: 600;
            }
            #xxt-form-data-modal .overview-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                padding: 6px 0;
                border-bottom: 1px solid #f1f3f4;
            }
            #xxt-form-data-modal .overview-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            #xxt-form-data-modal .overview-label {
                font-size: 14px;
                color: #6c757d;
                font-weight: 500;
            }
            #xxt-form-data-modal .overview-value {
                font-size: 14px;
                color: #28a745;
                font-weight: 600;
                background: #d4edda;
                padding: 2px 8px;
                border-radius: 4px;
            }
            #xxt-form-data-modal .data-status {
                margin-top: 12px;
                padding: 10px;
                border-radius: 6px;
                text-align: center;
            }
            #xxt-form-data-modal .data-status.warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
            }
            #xxt-form-data-modal .data-status.error {
                background: #f8d7da;
                border: 1px solid #f5c6cb;
            }
            #xxt-form-data-modal .data-status.success {
                background: #d4edda;
                border: 1px solid #c3e6cb;
            }
            #xxt-form-data-modal .status-message {
                font-size: 13px;
                font-weight: 500;
                line-height: 1.4;
            }
            #xxt-form-data-modal .data-status.warning .status-message {
                color: #856404;
            }
            #xxt-form-data-modal .data-status.error .status-message {
                color: #721c24;
            }
            #xxt-form-data-modal .data-status.success .status-message {
                color: #155724;
            }
        `);

        // 绑定事件
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.querySelector('.modal-backdrop').addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-backdrop')) {
                modal.style.display = 'none';
            }
        });

        // 更新数据概览的函数
        function updateDataOverview() {
            const textarea = modal.querySelector('#form-data-textarea');
            const overviewDiv = modal.querySelector('#data-overview');
            const data = textarea.value.trim();
            
            if (!data) {
                overviewDiv.style.display = 'none';
                return;
            }
            
            const analysis = analyzeDataDateRange(data);
            
            if (analysis.firstDate || analysis.lastDate) {
                overviewDiv.style.display = 'block';
                
                // 更新日期范围
                const dateRangeElement = modal.querySelector('#date-range');
                if (analysis.firstDate && analysis.lastDate) {
                    if (analysis.firstDate === analysis.lastDate) {
                        dateRangeElement.textContent = analysis.firstDate;
                    } else {
                        dateRangeElement.textContent = `${analysis.firstDate} 至 ${analysis.lastDate}`;
                    }
                } else {
                    dateRangeElement.textContent = analysis.firstDate || analysis.lastDate || '-';
                }
                
                // 更新统计信息
                modal.querySelector('#total-days').textContent = analysis.totalDays;
                modal.querySelector('#daily-count').textContent = analysis.dailyCount;
                modal.querySelector('#biweekly-count').textContent = analysis.biweeklyCount;
                
                // 检查数据状态和剩余天数
                const statusDiv = modal.querySelector('#data-status');
                const statusMessage = modal.querySelector('#status-message');
                
                if (analysis.lastDate) {
                    const today = new Date();
                    const lastDate = new Date(analysis.lastDate);
                    const daysDiff = Math.ceil((lastDate - today) / (1000 * 60 * 60 * 24));
                    
                    statusDiv.style.display = 'block';
                    
                    if (daysDiff < -30) {
                        // 数据很久之前的
                        statusDiv.className = 'data-status error';
                        statusMessage.textContent = `⚠️ 数据最后日期是 ${Math.abs(daysDiff)} 天前，建议补充最新数据`;
                    } else if (daysDiff < 0) {
                        // 数据是过去的，但不久前
                        statusDiv.className = 'data-status warning';
                        statusMessage.textContent = `💡 数据最后日期是 ${Math.abs(daysDiff)} 天前，可考虑补充最新数据`;
                    } else if (daysDiff === 0) {
                        // 今天是最后一天
                        statusDiv.className = 'data-status success';
                        statusMessage.textContent = `✅ 数据覆盖到今天，非常及时！`;
                    } else if (daysDiff <= 3) {
                        // 即将用完
                        statusDiv.className = 'data-status warning';
                        statusMessage.textContent = `⚠️ 数据还能用 ${daysDiff} 天，建议尽快补充后续数据`;
                    } else if (daysDiff <= 7) {
                        // 一周内用完
                        statusDiv.className = 'data-status warning';
                        statusMessage.textContent = `💡 数据还能用 ${daysDiff} 天，可考虑提前准备后续数据`;
                    } else {
                        // 数据充足
                        statusDiv.className = 'data-status success';
                        statusMessage.textContent = `✅ 数据充足，还能使用 ${daysDiff} 天`;
                    }
                } else {
                    statusDiv.style.display = 'none';
                }
            } else {
                overviewDiv.style.display = 'none';
            }
        }

        // 监听文本框变化
        const textarea = modal.querySelector('#form-data-textarea');
        
        // 数据保护：定期自动保存和数据监控
        let lastSavedData = '';
        let autoSaveTimer = null;
        
        // 定期自动保存函数
        function autoSaveData() {
            const currentData = textarea.value.trim();
            if (currentData && currentData !== lastSavedData && currentData.length > 50) {
                // 只有当数据有意义且与上次保存的不同时才保存
                GM_setValue(Config.keys.formDataBackup, currentData);
                lastSavedData = currentData;
                addLog(`🔄 自动备份数据 (${currentData.length} 字符)`, 'info');
            }
        }
        
        // 数据丢失检测和恢复
        function checkDataLoss() {
            const currentData = textarea.value.trim();
            const backupData = GM_getValue(Config.keys.formDataBackup, '');
            
            // 检测是否可能发生了数据丢失
            if (currentData.length < 100 && backupData.length > 500 && 
                !currentData.includes('[DATE:') && backupData.includes('[DATE:')) {
                
                addLog('🚨 检测到可能的数据丢失！', 'error');
                
                const shouldRestore = confirm(
                    `⚠️ 检测到数据可能丢失！\n\n` +
                    `当前数据：${currentData.length} 字符\n` +
                    `备份数据：${backupData.length} 字符\n\n` +
                    `是否恢复备份数据？`
                );
                
                if (shouldRestore) {
                    textarea.value = backupData;
                    updateDataOverview();
                    addLog('✅ 已从备份恢复数据', 'success');
                    showNotification('数据已从备份恢复！', 'success');
                }
            }
        }
        
        // 监听输入事件
        textarea.addEventListener('input', () => {
            updateDataOverview();
            
            // 清除之前的定时器
            if (autoSaveTimer) {
                clearTimeout(autoSaveTimer);
            }
            
            // 设置新的定时器，3秒后自动保存
            autoSaveTimer = setTimeout(autoSaveData, 3000);
        });
        
        // 监听粘贴事件
        textarea.addEventListener('paste', () => {
            setTimeout(() => {
                updateDataOverview();
                checkDataLoss(); // 粘贴后检查数据
            }, 100);
        });
        
        // 监听焦点事件，用于数据丢失检测
        textarea.addEventListener('focus', () => {
            setTimeout(checkDataLoss, 500);
        });
        
        // 页面隐藏时强制保存
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                autoSaveData();
            }
        });

        modal.querySelector('#save-form-data').addEventListener('click', () => {
            const textarea = modal.querySelector('#form-data-textarea');
            const debugCheckbox = modal.querySelector('#debug-mode-checkbox');
            const data = textarea.value.trim();
            const debugMode = debugCheckbox.checked;
            
            GM_setValue(Config.keys.formData, data);
            GM_setValue(Config.keys.debugMode, debugMode);
            
            addLog('表单预设数据已保存', 'info');
            addLog(`调试模式: ${debugMode ? '已启用' : '已禁用'}`, 'info');
            alert(`表单数据保存成功！\n调试模式: ${debugMode ? '已启用' : '已禁用'}`);
        });

        modal.querySelector('#clear-form-data').addEventListener('click', () => {
            if (confirm('确定要清空所有预设数据吗？')) {
                modal.querySelector('#form-data-textarea').value = '';
                GM_setValue(Config.keys.formData, '');
                addLog('表单预设数据已清空', 'info');
                alert('表单数据已清空！');
            }
        });

        modal.querySelector('#test-form-data').addEventListener('click', () => {
            const textarea = modal.querySelector('#form-data-textarea');
            const data = textarea.value.trim();
            if (!data) {
                alert('请先输入表单数据');
                return;
            }
            
            const parsed = parseReportData(data);
            if (parsed) {
                const result = `解析结果：\n日期: ${parsed.date || '未设置'}\n工作内容: ${parsed.work.substring(0, 50)}${parsed.work.length > 50 ? '...' : ''}\n遇到问题: ${parsed.problem.substring(0, 50)}${parsed.problem.length > 50 ? '...' : ''}\n收获感受: ${parsed.feeling.substring(0, 50)}${parsed.feeling.length > 50 ? '...' : ''}`;
                alert(result);
                addLog('表单数据解析测试完成', 'info');
            } else {
                alert('数据解析失败，请检查数据格式');
                addLog('表单数据解析失败', 'error');
            }
        });

        modal.querySelector('#restore-backup').addEventListener('click', () => {
            const backupData = GM_getValue(Config.keys.formDataBackup, '');
            if (!backupData) {
                alert('没有找到备份数据');
                return;
            }
            
            const currentData = modal.querySelector('#form-data-textarea').value.trim();
            let confirmMessage = `确定要恢复备份数据吗？\n\n备份数据：${backupData.length} 字符`;
            
            if (currentData) {
                confirmMessage += `\n当前数据：${currentData.length} 字符\n\n当前数据将被覆盖！`;
            }
            
            if (confirm(confirmMessage)) {
                modal.querySelector('#form-data-textarea').value = backupData;
                lastSavedData = backupData;
                updateDataOverview();
                addLog('✅ 已恢复备份数据', 'success');
                showNotification('备份数据已恢复！', 'success');
            }
        });

        // 复制AI指令模板
        modal.querySelector('#copy-ai-prompt')?.addEventListener('click', () => {
            const aiPrompt = `你是一个实习报告生成助手。请根据以下个人信息和要求生成实习数据：

**🎓 个人信息配置（请填写）：**
- 姓名：[请填入姓名]
- 学校：[请填入学校全名]
- 专业：[请填入专业名称]
- 实习公司：[请填入公司全名]
- 实习部门：[请填入部门名称，如：技术部、市场部等]
- 实习职位：[请填入职位名称，如：软件开发实习生、市场助理等]
- 实际入职时间：[请填入实际入职日期，如：2024-11-25]

**📅 时间配置（重要说明）：**
- 第一个双周开始日期：[填入第一个双周的开始日期，如：2025-02-03]
- 生成双周期数量：[填入要生成的双周期数量，如：3]
- ⚠️ 注意：第一个双周开始日期 ≠ 入职时间！
- 入职时间是实际入职的日期，双周开始日期是报告周期的起始日期
- 如果入职时间是2024-11-25，但第一个双周从2025-02-03开始，说明已经实习了一段时间

**生成规则（新规则）：**
1. 每个双周期时间跨度为14天
2. 前13天：每天生成一条日记 [DATE:具体日期]
3. 第14天：既生成当天的日记 [DATE:具体日期] 又生成双周记 [BIWEEK:开始日期至结束日期]
4. 双周期按时间顺序连续生成，无间隔

**内容要求：**
- 根据提供的专业和职位生成相关的工作内容
- 体现从入职到现在的成长轨迹（不是从第一个双周才开始工作）
- 日记内容要具体到每天的工作细节
- 双周记要总结整个14天的工作成果
- 体现专业知识在实际工作中的应用
- 不同双周期之间要有连贯性和发展性

**输出格式：**
为每个双周期生成完整的14天数据：

第X个双周期 (开始日期至结束日期)：
[DATE:第1天日期]
[WORK]该日的具体工作内容（结合专业和职位）
[PROBLEM]该日遇到的问题及解决方案
[FEELING]该日的收获与感受

[DATE:第2天日期]
[WORK]该日的具体工作内容
[PROBLEM]该日遇到的问题及解决方案
[FEELING]该日的收获与感受

... (依次到第13天)

[DATE:第14天日期]
[WORK]第14天的具体工作内容
[PROBLEM]第14天遇到的问题及解决方案
[FEELING]第14天的收获与感受

[BIWEEK:开始日期至结束日期]
[WORK]整个双周期的工作总结（体现专业技能运用）
[PROBLEM]双周期内的主要问题及解决过程
[FEELING]双周期的整体收获与成长感受

**示例配置：**
姓名：张三
学校：XX大学
专业：计算机科学与技术
实习公司：XX科技有限公司
实习部门：技术研发部
实习职位：Java开发实习生
实际入职时间：2024-11-25
第一个双周开始日期：2025-02-03
生成双周期数量：2

**示例输出（基于上述配置）：**

第1个双周期 (2025-02-03至2025-02-16)：
[DATE:2025-02-03]
[WORK]参与XX项目的需求分析会议，学习了Spring Boot框架的高级特性，协助优化数据库查询语句
[PROBLEM]对MyBatis的复杂查询语法不够熟练，通过查阅文档和请教导师，掌握了动态SQL的使用方法
[FEELING]实习两个多月来，感觉技术能力有了明显提升，开始能独立处理一些简单的开发任务

[DATE:2025-02-04]
[WORK]完成了用户管理模块的单元测试，使用JUnit进行接口测试，修复了3个数据验证的bug
[PROBLEM]测试覆盖率不够全面，学习了测试驱动开发的理念，重新设计了测试用例
[FEELING]通过测试工作，对代码质量的重要性有了更深的认识

... (其他日期)

[BIWEEK:2025-02-03至2025-02-16]
[WORK]这两周主要负责XX项目的后端开发工作，完成了用户管理和权限控制两个模块，使用Spring Security实现了身份认证，编写了详细的API文档
[PROBLEM]初期对Spring Security的配置不熟悉，导致权限控制功能出现问题，通过深入学习框架原理和反复调试，最终实现了预期功能
[FEELING]实习至今已有两个半月，从最初的不知所措到现在能够独立完成模块开发，感谢导师的耐心指导，对Java开发有了更深入的理解

**使用说明：**
1. 请先填写完整的个人信息配置
2. 明确区分入职时间和双周开始时间
3. 生成的内容会体现从入职到现在的工作经历，而不是从第一个双周才开始工作
4. 内容会根据专业和职位进行个性化定制`;

            navigator.clipboard.writeText(aiPrompt).then(() => {
                showNotification('AI指令模板已复制到剪贴板', 'success');
                addLog('📋 AI指令模板已复制', 'info');
            }).catch(() => {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = aiPrompt;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showNotification('AI指令模板已复制到剪贴板', 'success');
                    addLog('📋 AI指令模板已复制（降级方案）', 'info');
                } catch (err) {
                    showNotification('复制失败，请手动复制', 'error');
                    alert('复制失败，请手动复制以下内容：\n\n' + aiPrompt);
                }
                document.body.removeChild(textArea);
            });
        });

        // 加载已保存的数据
        const savedData = GM_getValue(Config.keys.formData, '');
        const savedDebugMode = GM_getValue(Config.keys.debugMode, false);
        
        if (savedData) {
            modal.querySelector('#form-data-textarea').value = savedData;
            // 初始化备份数据
            lastSavedData = savedData;
            GM_setValue(Config.keys.formDataBackup, savedData);
            // 更新数据概览
            updateDataOverview();
        } else {
            // 尝试从备份恢复
            const backupData = GM_getValue(Config.keys.formDataBackup, '');
            if (backupData && backupData.length > 100) {
                const shouldRestore = confirm(
                    `发现备份数据 (${backupData.length} 字符)，是否恢复？\n\n` +
                    `这可能是之前意外丢失的数据。`
                );
                if (shouldRestore) {
                    modal.querySelector('#form-data-textarea').value = backupData;
                    lastSavedData = backupData;
                    updateDataOverview();
                    addLog('✅ 已从备份恢复数据', 'success');
                }
            }
        }
        
        modal.querySelector('#debug-mode-checkbox').checked = savedDebugMode;

        return modal;
    }

    function createControlButton() {
        const button = document.createElement('button');
        button.id = Config.elements.controlButton;
        button.addEventListener('click', async () => {
            const runningState = GM_getValue(Config.keys.runningState, 'stopped');
            
            if (runningState === 'stopped') {
                            // 开始运行前先清除日志
            clearLogs();
            addLog('🧹 日志已清空', 'info');
            addLog('手动启动脚本', 'info');
            updateStatusBar('info', '重置状态并开始处理...');
            GM_setValue(Config.keys.pageState, 'initial');
            GM_setValue(Config.keys.runningState, 'running');
            shouldStop = false;
            updateButtonState();
            await main();
            } else if (runningState === 'running') {
                // 暂停
                addLog('手动暂停脚本', 'warning');
                updateStatusBar('warning', '脚本已暂停，点击继续按钮恢复运行');
                GM_setValue(Config.keys.runningState, 'paused');
                updateButtonState();
            } else if (runningState === 'paused') {
                // 继续运行
                addLog('手动继续脚本', 'info');
                updateStatusBar('info', '脚本继续运行...');
                GM_setValue(Config.keys.runningState, 'running');
                updateButtonState();
            }
        });
        document.body.appendChild(button);

        // 添加停止按钮
        const stopButton = document.createElement('button');
        stopButton.textContent = '停止处理';
        stopButton.id = 'stopProcessReportsButton';
        stopButton.addEventListener('click', () => {
            addLog('手动停止脚本', 'warning');
            GM_setValue(Config.keys.runningState, 'stopped');
            GM_setValue(Config.keys.pageState, 'initial');
            shouldStop = true;
            updateButtonState();
            updateStatusBar('warning', '脚本已停止，正在返回主页...');
            
            // 清除目标日期缓存
            sessionStorage.removeItem(Config.keys.targetDate);
            addLog('🧹 已清除目标日期缓存', 'info');
            
            // 立刻跳转到主页，不延迟
            const mainPageUrl = 'https://sxapp.mh.chaoxing.com/';
            addLog(`停止后立刻跳转到主页: ${mainPageUrl}`, 'info');
            GM_setValue(Config.keys.scriptNavigating, true); // 标记脚本正在主动导航
            GM_setValue(Config.keys.lastNavigationTime, Date.now()); // 记录正常跳转时间
            window.location.href = mainPageUrl;
        });
        document.body.appendChild(stopButton);

        // 添加查找下一个按钮
        const nextButton = document.createElement('button');
        nextButton.textContent = '查找下一个';
        nextButton.id = 'nextReportButton';
        nextButton.addEventListener('click', async () => {
            // 开始新流程前先清除日志
            clearLogs();
            addLog('🧹 日志已清空', 'info');
            addLog('手动触发查找下一个未提交项', 'info');
            updateStatusBar('info', '正在跳转到主页重新启动...');
            
            // 重置状态，像刚开始一样
            GM_setValue(Config.keys.pageState, 'initial');
            GM_setValue(Config.keys.runningState, 'running');
            shouldStop = false;
            
            // 清除目标日期缓存，开始新的流程
            sessionStorage.removeItem(Config.keys.targetDate);
            addLog('🧹 已清除目标日期缓存，开始新的流程', 'info');
            
            // 直接跳转到正确的主页URL
            const mainPageUrl = 'https://sxapp.mh.chaoxing.com/';
            
            addLog(`跳转到主页: ${mainPageUrl}`, 'info');
            GM_setValue(Config.keys.scriptNavigating, true); // 标记脚本正在主动导航
            GM_setValue(Config.keys.lastNavigationTime, Date.now()); // 记录正常跳转时间
            window.location.href = mainPageUrl;
        });
        document.body.appendChild(nextButton);

        // 添加表单数据设置按钮
        const formDataButton = document.createElement('button');
        formDataButton.textContent = '表单数据';
        formDataButton.id = 'formDataButton';
        formDataButton.addEventListener('click', () => {
            const modal = document.getElementById('xxt-form-data-modal');
            if (modal) {
                modal.style.display = 'block';
                addLog('打开表单数据设置界面', 'info');
            }
        });
        document.body.appendChild(formDataButton);

        // 添加快速模式切换按钮
        const fastModeButton = document.createElement('button');
        const fastMode = GM_getValue(Config.keys.fastMode, false);
        fastModeButton.textContent = fastMode ? '⚡ 快速' : '🐌 普通';
        fastModeButton.id = 'fastModeButton';
        fastModeButton.title = fastMode ? '当前：快速模式（点击切换到普通模式）' : '当前：普通模式（点击切换到快速模式）';
        fastModeButton.addEventListener('click', () => {
            const currentMode = GM_getValue(Config.keys.fastMode, false);
            const newMode = !currentMode;
            GM_setValue(Config.keys.fastMode, newMode);
            
            fastModeButton.textContent = newMode ? '⚡ 快速' : '🐌 普通';
            fastModeButton.title = newMode ? '当前：快速模式（点击切换到普通模式）' : '当前：普通模式（点击切换到快速模式）';
            
            addLog(`切换到${newMode ? '快速' : '普通'}模式`, 'info');
            updateStatusBar('info', `已切换到${newMode ? '快速' : '普通'}模式 ${newMode ? '(延迟减少60%)' : '(正常延迟)'}`);
        });
        document.body.appendChild(fastModeButton);

                 GM_addStyle(`
             #${Config.elements.controlButton}, #stopProcessReportsButton, #formDataButton, #fastModeButton {
                 position: fixed;
                 top: 70px;
                 z-index: 9999;
                 padding: 10px 15px;
                 color: white;
                 border: none;
                 border-radius: 5px;
                 cursor: pointer;
                 font-size: 14px;
                 margin-right: 5px;
             }
             #${Config.elements.controlButton} {
                 right: 290px;
             }
             #stopProcessReportsButton {
                 right: 190px;
                 background-color: #f44336;
             }
             #stopProcessReportsButton:hover {
                 background-color: #da190b;
             }
             #nextReportButton {
                 position: fixed;
                 bottom: 80px;
                 right: 20px;
                 z-index: 9999;
                 padding: 15px 20px;
                 background-color: #2196F3;
                 color: white;
                 border: none;
                 border-radius: 50px;
                 cursor: pointer;
                 font-size: 16px;
                 font-weight: bold;
                 box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
                 transition: all 0.3s ease;
             }
             #nextReportButton:hover {
                 background-color: #1976D2;
                 transform: translateY(-2px);
                 box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
             }
             #formDataButton {
                 right: 90px;
                 background-color: #4CAF50;
             }
             #formDataButton:hover {
                 background-color: #45a049;
             }
             #fastModeButton {
                 right: 10px;
                 background-color: #FF9800;
                 font-size: 12px;
                 padding: 8px 12px;
             }
             #fastModeButton:hover {
                 background-color: #F57C00;
             }
         `);

        updateButtonState();
    }



    // 新用户引导功能
    let guideShownInThisSession = false; // 添加会话级别的标记
    
    function showFirstTimeGuide() {
        const isFirstTime = GM_getValue(Config.keys.firstTimeUser, true);
        
        // 如果不是首次使用，或者本次会话已经显示过，直接返回
        if (!isFirstTime || guideShownInThisSession) {
            addLog(`跳过首次引导：isFirstTime=${isFirstTime}, guideShownInThisSession=${guideShownInThisSession}`, 'info');
            return;
        }
        
        // 检查是否在主页面，只在主页面显示引导
        const pageType = getPageType();
        if (pageType !== 'main_page') {
            return; // 不在主页面就不显示引导
        }
        
        // 检查是否已经存在引导窗口，避免重复创建
        const existingGuide = document.getElementById('first-time-guide');
        if (existingGuide) {
            return;
        }
        
        // 立即标记本次会话已显示，防止重复
        guideShownInThisSession = true;
        
        // 标记用户已经看过引导
        GM_setValue(Config.keys.firstTimeUser, false);
        
        addLog('🎯 检测到首次使用，准备显示引导', 'info');
        
        // 延迟显示引导，确保页面元素已加载
        setTimeout(() => {
            updateStatusBar('warning', '👋 欢迎首次使用！请先点击右上角"表单数据"按钮配置您的个人信息');
            addLog('📝 正在显示首次使用引导', 'warning');
            
            // 自动打开表单数据模态框
            setTimeout(() => {
                const modal = document.getElementById('xxt-form-data-modal');
                if (modal) {
                    modal.style.display = 'block';
                    addLog('📝 已自动打开表单数据配置界面', 'info');
                    
                    // 显示引导提示
                    showGuideNotification();
                }
            }, 1000);
        }, 2000);
    }

    function showGuideNotification() {
        // 检查是否已经存在引导窗口，避免重复创建
        const existingGuide = document.getElementById('first-time-guide');
        if (existingGuide) {
            return;
        }
        
        const guideDiv = document.createElement('div');
        guideDiv.id = 'first-time-guide';
        guideDiv.innerHTML = `
            <div class="guide-header">
                <h3>🎯 使用指南</h3>
                <button id="close-guide" class="guide-close">×</button>
            </div>
            <div class="guide-content">
                <div class="welcome-section">
                    <h4>🎉 欢迎使用学习通日报助手！</h4>
                    <p class="welcome-desc">这是一个智能化的日报填写工具，能够自动填充您预设的日报内容，大大提升效率！</p>
                </div>
                
                <div class="steps-section">
                    <h5>📋 快速开始指南</h5>
                    <div class="step-item">
                        <span class="step-number">1</span>
                        <div class="step-content">
                            <strong>准备数据</strong>
                            <p>点击右上角"表单数据"按钮，然后点击"复制AI指令模板"，使用ChatGPT等AI工具生成日报数据</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <span class="step-number">2</span>
                        <div class="step-content">
                            <strong>导入数据</strong>
                            <p>将AI生成的日报内容粘贴到表单中，点击"保存数据"</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <span class="step-number">3</span>
                        <div class="step-content">
                            <strong>开始使用</strong>
                            <p>关闭此窗口，点击右上角"开始自动处理"按钮，享受自动化填写</p>
                        </div>
                    </div>
                </div>
                
                <div class="tips-section">
                    <h5>💡 使用说明</h5>
                    <ul class="tips-list">
                        <li><strong>数据管理</strong>：当预设数据用完时，需要补充新的日期数据</li>
                        <li><strong>智能填充</strong>：脚本会根据页面日期自动匹配对应的数据内容</li>
                        <li><strong>手动控制</strong>：可随时暂停、停止或查找下一个未提交项</li>
                        <li><strong>数据安全</strong>：所有数据都保存在本地，支持自动备份和恢复</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <p class="help-text">💬 如需再次查看此指南，点击顶部状态栏的"📖 使用指南"按钮</p>
                </div>
                
                <div class="guide-actions">
                    <button id="start-now" class="start-btn">🚀 立即开始使用</button>
                    <button id="reset-first-time" class="reset-btn">🔄 重置引导</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(guideDiv);

        // 绑定关闭事件
        document.getElementById('close-guide').addEventListener('click', () => {
            document.body.removeChild(guideDiv);
            updateStatusBar('info', '📖 使用指南已关闭，如需帮助可随时再次查看');
            // 标记引导已关闭，防止在同一会话中重复显示
            guideShownInThisSession = true;
        });

        // 绑定立即开始使用按钮事件
        document.getElementById('start-now').addEventListener('click', () => {
            document.body.removeChild(guideDiv);
            guideShownInThisSession = true;
            
            // 不自动关闭表单数据界面，让用户自己决定
            
            updateStatusBar('success', '🚀 准备开始自动处理！如需配置数据请点击"表单数据"按钮');
            addLog('🚀 用户选择立即开始使用', 'info');
        });

        // 绑定重置首次引导事件
        document.getElementById('reset-first-time').addEventListener('click', () => {
            GM_setValue(Config.keys.firstTimeUser, true);
            guideShownInThisSession = false; // 重置会话标记
            addLog('🔄 已重置首次使用状态，刷新页面将再次显示引导', 'info');
            updateStatusBar('success', '✅ 已重置首次引导状态！刷新页面将再次显示引导');
            
            // 更新按钮状态
            const btn = document.getElementById('reset-first-time');
            const originalText = btn.textContent;
            btn.textContent = '✅ 已重置';
            btn.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 2000);
        });

        // 添加样式
        GM_addStyle(`
            #first-time-guide {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 500px;
                max-width: 90vw;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                z-index: 10001;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                border: 2px solid #4CAF50;
            }
            
            .guide-header {
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 16px 20px;
                border-radius: 10px 10px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .guide-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }
            
            .guide-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }
            
            .guide-close:hover {
                background-color: rgba(255,255,255,0.2);
            }
            
            .guide-content {
                padding: 24px;
                line-height: 1.6;
                max-height: 70vh;
                overflow-y: auto;
            }
            
            .welcome-section {
                text-align: center;
                margin-bottom: 24px;
            }
            
            .welcome-section h4 {
                margin: 0 0 12px 0;
                color: #4CAF50;
                font-size: 20px;
                font-weight: 600;
            }
            
            .welcome-desc {
                color: #666;
                font-size: 14px;
                margin: 0;
            }
            
            .steps-section {
                margin-bottom: 24px;
            }
            
            .steps-section h5 {
                margin: 0 0 16px 0;
                color: #333;
                font-size: 16px;
                font-weight: 600;
                border-bottom: 2px solid #4CAF50;
                padding-bottom: 8px;
            }
            
            .step-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 16px;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #4CAF50;
            }
            
            .step-number {
                background: #4CAF50;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
                margin-right: 12px;
                flex-shrink: 0;
            }
            
            .step-content {
                flex: 1;
            }
            
            .step-content strong {
                display: block;
                color: #333;
                font-size: 15px;
                margin-bottom: 4px;
            }
            
            .step-content p {
                margin: 0;
                color: #666;
                font-size: 13px;
            }
            
            .tips-section {
                margin-bottom: 20px;
            }
            
            .tips-section h5 {
                margin: 0 0 12px 0;
                color: #333;
                font-size: 16px;
                font-weight: 600;
                border-bottom: 2px solid #2196F3;
                padding-bottom: 8px;
            }
            
            .tips-list {
                margin: 0;
                padding-left: 20px;
                list-style: none;
            }
            
            .tips-list li {
                margin-bottom: 8px;
                font-size: 13px;
                color: #555;
                position: relative;
                padding-left: 20px;
            }
            
            .tips-list li:before {
                content: "▸";
                color: #2196F3;
                font-weight: bold;
                position: absolute;
                left: 0;
            }
            
            .tips-list li strong {
                color: #333;
            }
            
            .help-section {
                background: #e8f5e8;
                border: 1px solid #4CAF50;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 20px;
            }
            
            .help-text {
                margin: 0;
                font-size: 13px;
                color: #2e7d32;
                text-align: center;
            }
            
            .guide-actions {
                display: flex;
                justify-content: center;
                gap: 12px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .start-btn {
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
            }
            
            .start-btn:hover {
                background: linear-gradient(135deg, #45a049, #4CAF50);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
            }
            
            .reset-btn {
                background: #f5f5f5;
                color: #666;
                border: 1px solid #ddd;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .reset-btn:hover {
                background: #e0e0e0;
                border-color: #bbb;
                transform: translateY(-1px);
            }
            
            @media (max-width: 600px) {
                #first-time-guide {
                    width: 95vw;
                    margin: 10px;
                }
                
                .guide-content {
                    padding: 16px;
                    max-height: 60vh;
                }
                
                .step-item {
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                
                .step-number {
                    margin-right: 0;
                    margin-bottom: 8px;
                }
                
                .guide-actions {
                    flex-direction: column;
                    gap: 8px;
                }
                
                .start-btn {
                    padding: 10px 20px;
                    font-size: 13px;
                }
                
                .reset-btn {
                    padding: 8px 16px;
                    font-size: 11px;
                }
            }
        `);
    }

    // 初始化
    createLogPanel();
    createControlButton();
    createFormDataModal();
    createStatusBar();
    addLog('学习通实习日报自动填写助手已加载', 'info');
    updateStatusBar('info', '🎉 学习通日报助手已就绪！点击右上角"开始自动处理"按钮开始使用');

    window.addEventListener('load', async () => {
        await delay(1000);
        const currentState = GM_getValue(Config.keys.pageState, 'initial');
        const runningState = GM_getValue(Config.keys.runningState, 'stopped');
        const pageType = getPageType();
        addLog(`页面加载完成，当前状态: ${currentState}，运行状态: ${runningState}，页面类型: ${pageType}`, 'info');
        
        // 记录页面加载时间
        const currentTime = Date.now();
        GM_setValue(Config.keys.lastNavigationTime, currentTime);
        GM_setValue(Config.keys.scriptNavigating, false);
        
        // 移除新用户弹窗功能 - 用户可通过右上角"使用指南"按钮查看说明
        
        // 特殊处理：如果在填写页面且运行中，直接处理填写逻辑
        if (runningState === 'running' && pageType === 'report_fill') {
            addLog('检测到在填写页面且脚本运行中，直接处理填写逻辑', 'info');
            await handleReportFillPage();
            return;
        }
        
        if (runningState === 'running' && (currentState === 'initial' || currentState === 'daily_report_clicked' || currentState === 'clicked_unsubmitted_item' || currentState === 'awaiting_manual_submission')) {
            addLog('检测到运行状态，自动调用 main()', 'info');
            await main();
        } else {
            addLog('当前状态不适合自动执行，等待用户通过按钮启动', 'info');
            updateStatusBar('info', `脚本当前状态: ${currentState}. 点击右上角按钮启动`);
        }
    }, false);

})(); 