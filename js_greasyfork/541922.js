// ==UserScript==
// @name         网页资源优先级优化器
// @name:en      Web Resource Priority Optimizer
// @namespace    https://github.com/web-resource-optimizer
// @version      1.0.0
// @description  自动优化网页资源（JS、CSS、图片、字体）的加载优先级，降低阻塞时间，提升页面性能
// @description:en Automatically optimize web resource (JS, CSS, images, fonts) loading priority to reduce blocking time and improve page performance
// @author       moyu001
// @license      MIT
// @match        *://*/*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @inject-into  page
// @sandbox      JavaScript
// @downloadURL https://update.greasyfork.org/scripts/541922/%E7%BD%91%E9%A1%B5%E8%B5%84%E6%BA%90%E4%BC%98%E5%85%88%E7%BA%A7%E4%BC%98%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541922/%E7%BD%91%E9%A1%B5%E8%B5%84%E6%BA%90%E4%BC%98%E5%85%88%E7%BA%A7%E4%BC%98%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

/**
 * 网页资源优先级优化器
 * Web Resource Priority Optimizer
 *
 * 基于行业最佳实践，自动优化网页资源加载优先级
 * 支持JS、CSS、图片、字体的智能优化
 * 兼容主流CDN和跨站资源
 * 提供低侵入、可回退的安全优化方案
 */

(function() {
    'use strict';

    // 全局配置
    const CONFIG = {
        // 版本信息
        VERSION: '1.0.0',
        NAME: 'Web Resource Priority Optimizer',

        // 调试配置
        DEBUG: false,
        LOG_LEVEL: 'INFO', // ERROR, WARN, INFO, DEBUG

        // 功能开关
        FEATURES: {
            JS_OPTIMIZATION: true,
            CSS_OPTIMIZATION: true,
            IMAGE_OPTIMIZATION: true,
            FONT_OPTIMIZATION: true,
            CDN_OPTIMIZATION: true,
            CROSS_ORIGIN_OPTIMIZATION: true,
            DYNAMIC_MONITORING: true
        },

        // 性能配置
        PERFORMANCE: {
            DELAY_LOADING: 1000, // 延迟加载时间（毫秒）
            LAZY_LOADING_THRESHOLD: 0.1, // 懒加载阈值
            PRELOAD_PRIORITY: 'high', // 预加载优先级
            MAX_CONCURRENT_LOADS: 6 // 最大并发加载数
        },

        // 安全配置
        SECURITY: {
            ENABLE_SRI: true,
            FORCE_HTTPS: true,
            CORS_STRICT: false,
            CSP_COMPATIBLE: true
        },

        // CDN配置
        CDN: {
            ENABLED: true,
            PATTERNS: {
                jsdelivr: /cdn\.jsdelivr\.net/i,
                unpkg: /unpkg\.com/i,
                cdnjs: /cdnjs\.cloudflare\.com/i,
                google: /ajax\.googleapis\.com/i,
                googleFonts: /fonts\.googleapis\.com|fonts\.gstatic\.com/i,
                bootstrap: /stackpath\.bootstrapcdn\.com/i,
                fontawesome: /use\.fontawesome\.com/i,
                typekit: /use\.typekit\.net/i,
                iconify: /api\.iconify\.design/i
            }
        },

        // 白名单和黑名单
        LISTS: {
            WHITELIST: [], // 白名单网站（完全跳过优化）
            BLACKLIST: [], // 黑名单网站（禁用特定优化）
            CRITICAL_RESOURCES: [] // 关键资源列表
        }
    };

    // 全局状态管理
    const STATE = {
        // 初始化状态
        initialized: false,
        enabled: true,

        // 优化统计
        stats: {
            optimizedScripts: 0,
            optimizedStyles: 0,
            optimizedImages: 0,
            optimizedFonts: 0,
            cdnResources: 0,
            crossOriginResources: 0,
            errors: 0,
            warnings: 0,
            criticalProtected: 0,
            cdnResourcesPreloaded: 0,
            spaOptimized: 0,
            dynamicCDNOptimized: 0
        },

        // 原始状态记录（用于回退）
        originalStates: {
            scripts: new Map(),
            styles: new Map(),
            images: new Map(),
            fonts: new Map()
        },

        // 性能监控
        performance: {
            startTime: performance.now(),
            loadTimes: new Map(),
            errorRates: new Map()
        },

        // 自动回退配置和状态
        autoRollback: {
            enabled: true,
            fatalErrorCount: 0,
            fatalErrorThreshold: 3,
            lastRollbackReason: '',
            hasRolledBack: false
        }
    };

    // 日志系统
    const Logger = {
        levels: {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        },

        currentLevel: CONFIG.LOG_LEVEL,

        // 日志历史队列
        history: [],
        maxHistory: 500,

        log: function(level, message, data = null) {
            if (this.levels[level] <= this.levels[this.currentLevel]) {
                const timestamp = new Date().toISOString();
                const logMessage = `[${CONFIG.NAME}] [${level}] [${timestamp}] ${message}`;
                // 写入内存日志队列
                this.history.push({
                    level,
                    timestamp,
                    message,
                    data: data ? JSON.stringify(data) : ''
                });
                if (this.history.length > this.maxHistory) {
                    this.history.shift();
                }
                if (CONFIG.DEBUG) {
                    console.log(logMessage, data || '');
                }
                // 保存到GM_log（如果可用）
                if (typeof GM_log !== 'undefined') {
                    GM_log(logMessage);
                }
            }
        },

        error: function(message, data) {
            this.log('ERROR', message, data);
            STATE.stats.errors++;
            if (STATE.autoRollback.enabled) {
                STATE.autoRollback.fatalErrorCount++;
                if (STATE.autoRollback.fatalErrorCount >= STATE.autoRollback.fatalErrorThreshold && !STATE.autoRollback.hasRolledBack) {
                    if (window.WebResourceOptimizer && window.WebResourceOptimizer.controller) {
                        window.WebResourceOptimizer.controller.rollbackAll();
                        STATE.autoRollback.lastRollbackReason = `自动回退：累计致命错误达到${STATE.autoRollback.fatalErrorCount}次`;
                        STATE.autoRollback.hasRolledBack = true;
                        STATE.enabled = false;
                        Logger.info(STATE.autoRollback.lastRollbackReason + '，优化已禁用');
                    }
                }
            }
        },

        warn: function(message, data) {
            this.log('WARN', message, data);
            STATE.stats.warnings++;
        },

        info: function(message, data) {
            this.log('INFO', message, data);
        },

        debug: function(message, data) {
            this.log('DEBUG', message, data);
        },
        // 获取详细日志历史
        getHistory: function() {
            return this.history.map(entry =>
                `[${entry.timestamp}] [${entry.level}] ${entry.message}${entry.data ? ' | ' + entry.data : ''}`
            );
        }
    };

    // 调试开关和日志输出模块
    const DebugModule = {
        // 调试面板
        panel: null,

        // 初始化调试模块
        init: function() {
            this.setupGlobalSwitches();
            this.createDebugPanel();
            this.setupMenuCommands();
            this.setupKeyboardShortcuts();
            Logger.info('Debug module initialized');
        },

        // 设置全局开关
        setupGlobalSwitches: function() {
            // 全局调试开关
            Object.defineProperty(window, 'RESOURCE_OPTIMIZER_DEBUG', {
                get: function() {
                    return CONFIG.DEBUG;
                },
                set: function(value) {
                    CONFIG.DEBUG = Boolean(value);
                    DebugModule.updateDebugMode();
                    Logger.info(`Debug mode ${CONFIG.DEBUG ? 'enabled' : 'disabled'}`);
                },
                configurable: true
            });

            // 全局禁用开关
            Object.defineProperty(window, 'DISABLE_RESOURCE_OPTIMIZER', {
                get: function() {
                    return !STATE.enabled;
                },
                set: function(value) {
                    STATE.enabled = !Boolean(value);
                    if (controller) {
                        controller.setEnabled(STATE.enabled);
                    }
                    Logger.info(`Resource optimizer ${STATE.enabled ? 'enabled' : 'disabled'}`);
                },
                configurable: true
            });

            // 日志级别控制
            Object.defineProperty(window, 'RESOURCE_OPTIMIZER_LOG_LEVEL', {
                get: function() {
                    return Logger.currentLevel;
                },
                set: function(level) {
                    if (Logger.levels.hasOwnProperty(level)) {
                        Logger.currentLevel = level;
                        Logger.info(`Log level changed to ${level}`);
                    } else {
                        Logger.warn(`Invalid log level: ${level}`);
                    }
                },
                configurable: true
            });
        },

        // 创建调试面板
        createDebugPanel: function() {
            if (!CONFIG.DEBUG) return;
            // 创建面板容器
            this.panel = document.createElement('div');
            this.panel.id = 'wro-debug-panel';
            this.panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                width: 300px;
                max-height: 400px;
                background: rgba(0, 0, 0, 0.9);
                color: #fff;
                font-family: monospace;
                font-size: 12px;
                padding: 10px;
                border-radius: 5px;
                z-index: 999999;
                overflow-y: auto;
                display: none;
                box-shadow: 0 2px 8px #0008;
                user-select: none;
            `;
            // 拖拽相关
            this.panel.onmousedown = function(e) {
                if (e.target.className !== 'wro-debug-panel-drag') return;
                const panel = DebugModule.panel;
                let startX = e.clientX, startY = e.clientY;
                let rect = panel.getBoundingClientRect();
                let offsetX = startX - rect.left, offsetY = startY - rect.top;
                function onMove(ev) {
                    panel.style.left = (ev.clientX - offsetX) + 'px';
                    panel.style.top = (ev.clientY - offsetY) + 'px';
                    panel.style.right = 'auto';
                }
                function onUp() {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                }
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
                e.preventDefault();
            };
            // 创建面板内容
            this.updatePanelContent();
            // 添加到页面
            document.body.appendChild(this.panel);
            // 创建切换按钮
            this.createToggleButton();
        },

        // 创建切换按钮
        createToggleButton: function() {
            const button = document.createElement('button');
            button.id = 'wro-debug-toggle';
            button.textContent = 'WRO Debug';
            button.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #007acc;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                z-index: 999998;
            `;

            button.addEventListener('click', () => {
                this.togglePanel();
            });

            document.body.appendChild(button);
        },

        // 切换面板显示
        togglePanel: function() {
            if (this.panel) {
                this.panel.style.display = this.panel.style.display === 'none' ? 'block' : 'none';
                if (this.panel.style.display === 'block') {
                    this.updatePanelContent();
                }
            }
        },

        // 更新面板内容
        updatePanelContent: function() {
            if (!this.panel) return;
            const stats = controller ? controller.getStats() : STATE.stats;
            const filterLevel = this.logFilterLevel || 'ALL';
            const filterKeyword = this.logFilterKeyword || '';
            let logs = Logger.getHistory();
            if (filterLevel !== 'ALL') {
                logs = logs.filter(l => l.includes(`[${filterLevel}]`));
            }
            if (filterKeyword) {
                logs = logs.filter(l => l.toLowerCase().includes(filterKeyword.toLowerCase()));
            }
            const logHtml = logs.length > 0
                ? `<div id=\"wro-debug-logbox\" style=\"height:120px;overflow-y:auto;background:#222;padding:5px;border-radius:3px;margin-top:5px;white-space:pre-wrap;\">${logs.map(l => `<div>${l}</div>`).join('')}</div>`
                : '<div id=\"wro-debug-logbox\" style=\"height:120px;overflow-y:auto;background:#222;padding:5px;border-radius:3px;margin-top:5px;\">无日志</div>';
            // 最小化状态
            const minimized = this.minimized;
            const autoRollbackMsg = STATE.autoRollback.lastRollbackReason
                ? `<div style=\"color:#f0ad4e;margin-bottom:8px;\"><strong>⚠️ ${STATE.autoRollback.lastRollbackReason}</strong></div>`
                : '';
            const autoRollbackConfig = `<div style=\"margin-bottom:8px;\">
                <label><input type=\"checkbox\" id=\"wro-auto-rollback-enable\"${STATE.autoRollback.enabled ? ' checked' : ''}> 自动回退</label>
                <span style=\"margin-left:10px;\">阈值:<input id=\"wro-auto-rollback-threshold\" type=\"number\" min=\"1\" max=\"20\" value=\"${STATE.autoRollback.fatalErrorThreshold}\" style=\"width:40px;font-size:12px;\"></span>
                <span style=\"margin-left:10px;\">已触发:${STATE.autoRollback.fatalErrorCount}</span>
                <span style=\"margin-left:10px;\">已回退:${STATE.autoRollback.hasRolledBack ? '是' : '否'}</span>
            </div>`;
            const showRestoreBtn = STATE.autoRollback.hasRolledBack || !STATE.enabled;
            const restoreBtnHtml = showRestoreBtn ? `<button id=\"wro-restore-optimizer-btn\" style=\"background:#5cb85c;color:white;border:none;padding:3px 6px;cursor:pointer;margin-left:5px;\">重新启用优化</button>` : '';
            const compatMsg = COMPAT_WARNINGS.length > 0
                ? `<div style=\"color:#d9534f;margin-bottom:8px;\"><strong>⚠️ 兼容性警告：${COMPAT_WARNINGS.join('，')}</strong></div>`
                : '';
            this.panel.innerHTML = `
                <div class=\"wro-debug-panel-drag\" style=\"margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px; cursor:move; user-select:none;\">
                    <strong>Web Resource Optimizer Debug</strong>
                    <button onclick=\"DebugModule.minimized = !DebugModule.minimized; DebugModule.updatePanelContent();\"
                            style=\"float:right;background:#444;color:white;border:none;padding:2px 6px;cursor:pointer;font-size:12px;\">${minimized ? '▢' : '—'}</button>
                    <button onclick=\"document.getElementById('wro-debug-panel').style.display='none'\"
                            style=\"float: right; background: #666; color: white; border: none; padding: 2px 5px; cursor: pointer;\">×</button>
                </div>
                ${compatMsg}
                ${autoRollbackMsg}
                ${autoRollbackConfig}
                ${restoreBtnHtml}
                ${minimized ? '' : `
                <div style=\"margin-bottom: 10px;\">
                    <strong>Status:</strong> ${STATE.enabled ? 'Enabled' : 'Disabled'}<br>
                    <strong>Debug:</strong> ${CONFIG.DEBUG ? 'On' : 'Off'}<br>
                    <strong>Log Level:</strong> ${Logger.currentLevel}<br>
                    <strong>Uptime:</strong> ${Math.round((performance.now() - STATE.performance.startTime) / 1000)}s
                </div>
                <div style=\"margin-bottom: 10px;\">
                    <strong>Optimization Stats:</strong><br>
                    Scripts: ${stats.optimizedScripts}<br>
                    Styles: ${stats.optimizedStyles}<br>
                    Images: ${stats.optimizedImages}<br>
                    Fonts: ${stats.optimizedFonts}<br>
                    CDN Resources: ${stats.cdnResources}<br>
                    Cross-Origin: ${stats.crossOriginResources}
                </div>
                <div style=\"margin-bottom: 10px;\">
                    <strong>Errors:</strong> ${stats.errors}<br>
                    <strong>Warnings:</strong> ${stats.warnings}
                </div>
                <div style=\"margin-bottom: 10px;\">
                    <button onclick=\"window.WebResourceOptimizer.debug.resetStats()\"
                            style=\"background: #d9534f; color: white; border: none; padding: 3px 6px; cursor: pointer; margin-right: 5px;\">
                        Reset Stats
                    </button>
                    <button onclick=\"window.WebResourceOptimizer.debug.exportLogs()\"
                            style=\"background: #5cb85c; color: white; border: none; padding: 3px 6px; cursor: pointer;\">
                        Export Logs
                    </button>
                </div>
                <div style=\"margin-bottom: 10px;\">
                    <strong>Quick Actions:</strong><br>
                    <button onclick=\"window.RESOURCE_OPTIMIZER_DEBUG = !window.RESOURCE_OPTIMIZER_DEBUG\"
                            style=\"background: #f0ad4e; color: white; border: none; padding: 2px 4px; cursor: pointer; margin: 2px;\">
                        Toggle Debug
                    </button>
                    <button onclick=\"window.DISABLE_RESOURCE_OPTIMIZER = !window.DISABLE_RESOURCE_OPTIMIZER\"
                            style=\"background: #d9534f; color: white; border: none; padding: 2px 4px; cursor: pointer; margin: 2px;\">
                        Toggle Optimizer
                    </button>
                </div>
                <div style=\"margin-bottom: 10px;\">
                    <strong>详细日志：</strong>
                    <div style=\"margin-bottom:5px;\">
                        <select id=\"wro-log-filter-level\" style=\"font-size:12px;\">
                            <option value=\"ALL\"${filterLevel==='ALL'?' selected':''}>全部</option>
                            <option value=\"ERROR\"${filterLevel==='ERROR'?' selected':''}>ERROR</option>
                            <option value=\"WARN\"${filterLevel==='WARN'?' selected':''}>WARN</option>
                            <option value=\"INFO\"${filterLevel==='INFO'?' selected':''}>INFO</option>
                            <option value=\"DEBUG\"${filterLevel==='DEBUG'?' selected':''}>DEBUG</option>
                        </select>
                        <input id=\"wro-log-filter-keyword\" type=\"text\" placeholder=\"关键词\" value=\"${filterKeyword || ''}\" style=\"font-size:12px;width:80px;margin-left:5px;\">
                        <button id=\"wro-log-clear-btn\" style=\"font-size:12px;margin-left:5px;\">清空</button>
                    </div>
                    ${logHtml}
                </div>
                `}
            `;
            setTimeout(() => {
                const logbox = document.getElementById('wro-debug-logbox');
                if (logbox) logbox.scrollTop = logbox.scrollHeight;
                const levelSel = document.getElementById('wro-log-filter-level');
                if (levelSel) {
                    levelSel.onchange = (e) => {
                        DebugModule.logFilterLevel = e.target.value;
                        DebugModule.updatePanelContent();
                    };
                }
                const kwInput = document.getElementById('wro-log-filter-keyword');
                if (kwInput) {
                    kwInput.oninput = (e) => {
                        DebugModule.logFilterKeyword = e.target.value;
                        DebugModule.updatePanelContent();
                    };
                }
                const clearBtn = document.getElementById('wro-log-clear-btn');
                if (clearBtn) {
                    clearBtn.onclick = () => {
                        Logger.history = [];
                        DebugModule.updatePanelContent();
                    };
                }
                const rollbackBtn = document.querySelector('#wro-debug-panel button[onclick*="rollbackAll"]');
                if (rollbackBtn) {
                    rollbackBtn.onclick = () => {
                        DebugModule.rollbackAll();
                    };
                }
                // 自动回退配置事件绑定
                const enableChk = document.getElementById('wro-auto-rollback-enable');
                if (enableChk) {
                    enableChk.onchange = (e) => {
                        STATE.autoRollback.enabled = !!e.target.checked;
                        DebugModule.updatePanelContent();
                    };
                }
                const thresholdInput = document.getElementById('wro-auto-rollback-threshold');
                if (thresholdInput) {
                    thresholdInput.onchange = (e) => {
                        let v = parseInt(e.target.value, 10);
                        if (isNaN(v) || v < 1) v = 1;
                        STATE.autoRollback.fatalErrorThreshold = v;
                        DebugModule.updatePanelContent();
                    };
                }
                // 重新启用优化按钮事件绑定
                const restoreBtn = document.getElementById('wro-restore-optimizer-btn');
                if (restoreBtn) {
                    restoreBtn.onclick = () => {
                        STATE.autoRollback.hasRolledBack = false;
                        STATE.autoRollback.fatalErrorCount = 0;
                        STATE.autoRollback.lastRollbackReason = '';
                        STATE.enabled = true;
                        Logger.info('用户手动重新启用优化');
                        DebugModule.updatePanelContent();
                    };
                }
            }, 0);
        },

        // 设置菜单命令
        setupMenuCommands: function() {
            if (typeof GM_registerMenuCommand !== 'undefined') {
                // 切换调试模式
                GM_registerMenuCommand('Toggle Debug Mode', () => {
                    CONFIG.DEBUG = !CONFIG.DEBUG;
                    this.updateDebugMode();
                    Logger.info(`Debug mode ${CONFIG.DEBUG ? 'enabled' : 'disabled'} via menu`);
                });

                // 切换优化器
                GM_registerMenuCommand('Toggle Optimizer', () => {
                    STATE.enabled = !STATE.enabled;
                    if (controller) {
                        controller.setEnabled(STATE.enabled);
                    }
                    Logger.info(`Resource optimizer ${STATE.enabled ? 'enabled' : 'disabled'} via menu`);
                });

                // 重置统计
                GM_registerMenuCommand('Reset Statistics', () => {
                    if (controller) {
                        controller.resetStats();
                    }
                    Logger.info('Statistics reset via menu');
                });

                // 导出日志
                GM_registerMenuCommand('Export Logs', () => {
                    this.exportLogs();
                });

                // 显示调试面板
                GM_registerMenuCommand('Show Debug Panel', () => {
                    this.showDebugPanel();
                });
            }
        },

        // 设置键盘快捷键
        setupKeyboardShortcuts: function() {
            document.addEventListener('keydown', (event) => {
                // Ctrl+Shift+D: 切换调试模式
                if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                    event.preventDefault();
                    CONFIG.DEBUG = !CONFIG.DEBUG;
                    this.updateDebugMode();
                    Logger.info(`Debug mode ${CONFIG.DEBUG ? 'enabled' : 'disabled'} via keyboard shortcut`);
                }

                // Ctrl+Shift+O: 切换优化器
                if (event.ctrlKey && event.shiftKey && event.key === 'O') {
                    event.preventDefault();
                    STATE.enabled = !STATE.enabled;
                    if (controller) {
                        controller.setEnabled(STATE.enabled);
                    }
                    Logger.info(`Resource optimizer ${STATE.enabled ? 'enabled' : 'disabled'} via keyboard shortcut`);
                }

                // Ctrl+Shift+P: 显示调试面板
                if (event.ctrlKey && event.shiftKey && event.key === 'P') {
                    event.preventDefault();
                    this.showDebugPanel();
                }
            });
        },

        // 更新调试模式
        updateDebugMode: function() {
            if (CONFIG.DEBUG) {
                this.showDebugPanel();
                this.enableVerboseLogging();
            } else {
                this.hideDebugPanel();
                this.disableVerboseLogging();
            }
        },

        // 显示调试面板
        showDebugPanel: function() {
            if (this.panel) {
                this.panel.style.display = 'block';
                this.updatePanelContent();
            }
        },

        // 隐藏调试面板
        hideDebugPanel: function() {
            if (this.panel) {
                this.panel.style.display = 'none';
            }
        },

        // 启用详细日志
        enableVerboseLogging: function() {
            Logger.currentLevel = 'DEBUG';
            Logger.info('Verbose logging enabled');
        },

        // 禁用详细日志
        disableVerboseLogging: function() {
            Logger.currentLevel = 'INFO';
            Logger.info('Verbose logging disabled');
        },

        // 导出日志
        exportLogs: function() {
            const logs = this.getLogHistory();
            const logText = logs.join('\n');

            // 创建下载链接
            const blob = new Blob([logText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wro-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
            a.click();

            URL.revokeObjectURL(url);
            Logger.info('Logs exported successfully');
        },

        // 获取日志历史
        getLogHistory: function() {
            // 返回详细日志历史
            return Logger.getHistory();
        },

        // 重置统计
        resetStats: function() {
            if (controller) {
                controller.resetStats();
            }
            this.updatePanelContent();
            Logger.info('Statistics reset');
        },

        // 回退所有优化
        rollbackAll: function() {
            let count = 0;
            for (const [el] of STATE.originalStates.scripts) {
                if (el && typeof el.tagName === 'string') {
                    if (typeof this.optimizers?.[0]?.rollback === 'function') {
                        if (this.optimizers[0].rollback(el)) count++;
                    }
                }
            }
            for (const [el] of STATE.originalStates.styles) {
                if (el && typeof el.tagName === 'string') {
                    if (typeof this.optimizers?.[0]?.rollback === 'function') {
                        if (this.optimizers[0].rollback(el)) count++;
                    }
                }
            }
            for (const [el] of STATE.originalStates.fonts) {
                if (el && typeof el.tagName === 'string') {
                    if (typeof this.optimizers?.[0]?.rollback === 'function') {
                        if (this.optimizers[0].rollback(el)) count++;
                    }
                }
            }
            for (const [el] of STATE.originalStates.images) {
                if (el && typeof el.tagName === 'string') {
                    if (typeof this.optimizers?.[0]?.rollback === 'function') {
                        if (this.optimizers[0].rollback(el)) count++;
                    }
                }
            }
            Logger.info(`Rollback all: ${count} elements restored`);
            return count;
        }
    };

    // 工具函数
    const Utils = {
        // 检查是否为关键资源
        isCriticalResource: function(element, resourceType) {
            // data-critical属性
            if (element.hasAttribute('data-critical') && element.getAttribute('data-critical') === 'true') {
                Logger.info(`[关键资源保护] data-critical: ${element.tagName} ${element.src || element.href || element.outerHTML}`);
                STATE.stats.criticalProtected = (STATE.stats.criticalProtected || 0) + 1;
                return true;
            }
            // 内联脚本/样式
            if ((element.tagName === 'SCRIPT' && !element.src) || (element.tagName === 'STYLE')) {
                Logger.info(`[关键资源保护] 内联: ${element.tagName}`);
                STATE.stats.criticalProtected = (STATE.stats.criticalProtected || 0) + 1;
                return true;
            }
            // 白名单
            const url = element.src || element.href || '';
            if (CONFIG.LISTS.WHITELIST.some(domain => url.includes(domain))) {
                Logger.info(`[关键资源保护] 白名单: ${url}`);
                STATE.stats.criticalProtected = (STATE.stats.criticalProtected || 0) + 1;
                return true;
            }
            // 首屏资源（粗略：在视口内的img、首屏css/js）
            if (['img', 'css', 'js', 'font'].includes(resourceType)) {
                try {
                    if (element.getBoundingClientRect) {
                        const rect = element.getBoundingClientRect();
                        if (rect.top >= 0 && rect.top < window.innerHeight * 1.2) {
                            Logger.info(`[关键资源保护] 首屏: ${element.tagName} ${url}`);
                            STATE.stats.criticalProtected = (STATE.stats.criticalProtected || 0) + 1;
                            return true;
                        }
                    }
                } catch (e) {}
            }
            // 常见关键字（react、vue、main、logo、core、polyfill等）
            const keywords = ['react', 'vue', 'main', 'core', 'polyfill', 'logo', 'chunk-vendors', 'runtime', 'manifest', 'bootstrap', 'jquery', 'angular', 'zone.js'];
            if (keywords.some(kw => url.toLowerCase().includes(kw))) {
                Logger.info(`[关键资源保护] 关键字: ${url}`);
                STATE.stats.criticalProtected = (STATE.stats.criticalProtected || 0) + 1;
                return true;
            }
            return false;
        },

        // 检查元素是否在视口内
        isInViewport: function(element) {
            if (!element) return false;

            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // 检查是否为CDN资源
        isCDNResource: function(url) {
            if (!url) return { isCDN: false, provider: null, type: null };
            // CDN域名正则
            const CDN_PATTERNS = CONFIG.CDN.PATTERNS;
            // 路径特征正则
            const PATH_PATTERNS = {
                npm: /\/npm\//,
                github: /\/gh\//,
                ajaxLibs: /\/ajax\/libs\//,
                bootstrap: /bootstrap/i,
                fontawesome: /font-awesome|all\.css/i,
                googleFonts: /css2\?family=|gstatic\.com\/s\//i
            };
            // 文件类型正则
            const FILE_TYPES = {
                js: /\.(js|mjs)$/i,
                css: /\.(css|scss|sass)$/i,
                font: /\.(woff|woff2|ttf|eot|otf)$/i,
                image: /\.(svg|png|jpg|jpeg|gif|webp|avif)$/i
            };
            // 检查CDN域名
            for (const [provider, pattern] of Object.entries(CDN_PATTERNS)) {
                if (pattern.test(url)) {
                    // 检查文件类型
                    let type = null;
                    for (const [ftype, fpattern] of Object.entries(FILE_TYPES)) {
                        if (fpattern.test(url)) {
                            type = ftype;
                            break;
                        }
                    }
                    // 检查路径特征
                    let pathMatch = null;
                    for (const [pname, ppattern] of Object.entries(PATH_PATTERNS)) {
                        if (ppattern.test(url)) {
                            pathMatch = pname;
                            break;
                        }
                    }
                    return { isCDN: true, provider, type, pathMatch };
                }
            }
            return { isCDN: false, provider: null, type: null, pathMatch: null };
        },

        // 检查是否为跨站资源
        isCrossOriginResource: function(url) {
            if (!url) return false;

            try {
                const urlObj = new URL(url, window.location.href);
                return urlObj.origin !== window.location.origin;
            } catch (error) {
                return false;
            }
        },

        // 安全的DOM操作
        safeSetAttribute: function(element, attribute, value) {
            try {
                element.setAttribute(attribute, value);
                return true;
            } catch (error) {
                Logger.warn(`Failed to set attribute ${attribute} on element`, error);
                return false;
            }
        },

        // 安全的DOM移除
        safeRemoveAttribute: function(element, attribute) {
            try {
                element.removeAttribute(attribute);
                return true;
            } catch (error) {
                Logger.warn(`Failed to remove attribute ${attribute} on element`, error);
                return false;
            }
        },

        // 生成唯一ID
        generateId: function() {
            return 'wro_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
    };

    // 资源优化器基类
    class ResourceOptimizer {
        constructor() {
            this.name = 'ResourceOptimizer';
            this.enabled = true;
        }

        // 初始化优化器
        init() {
            Logger.info(`${this.name} initialized`);
        }

        // 优化资源
        optimize(element) {
            if (!this.enabled || !element) return false;
            try {
                this.recordOriginalState(element);
                attachResourceErrorHandler(element);
                return this.doOptimize(element);
            } catch (error) {
                Logger.error(`${this.name} optimization failed`, error);
                return false;
            }
        }

        // 记录原始属性（子类可扩展）
        recordOriginalState(element) {
            if (!element || !element.tagName) return;
            const tag = element.tagName.toUpperCase();
            if (tag === 'SCRIPT' && element.src) {
                if (!STATE.originalStates.scripts.has(element)) {
                    STATE.originalStates.scripts.set(element, {
                        src: element.src,
                        type: element.type,
                        async: element.async,
                        defer: element.defer,
                        crossorigin: element.crossOrigin,
                        attributes: [...element.attributes].map(a => [a.name, a.value])
                    });
                }
            } else if (tag === 'LINK' && element.href) {
                if (element.rel === 'stylesheet' || element.rel === 'preload' || element.href.includes('font')) {
                    if (!STATE.originalStates.styles.has(element)) {
                        STATE.originalStates.styles.set(element, {
                            href: element.href,
                            rel: element.rel,
                            as: element.as,
                            media: element.media,
                            crossorigin: element.crossOrigin,
                            attributes: [...element.attributes].map(a => [a.name, a.value])
                        });
                    }
                } else if (element.rel === 'preload' && element.as === 'font') {
                    if (!STATE.originalStates.fonts.has(element)) {
                        STATE.originalStates.fonts.set(element, {
                            href: element.href,
                            rel: element.rel,
                            as: element.as,
                            crossorigin: element.crossOrigin,
                            attributes: [...element.attributes].map(a => [a.name, a.value])
                        });
                    }
                }
            } else if (tag === 'IMG' && element.src) {
                if (!STATE.originalStates.images.has(element)) {
                    STATE.originalStates.images.set(element, {
                        src: element.src,
                        loading: element.loading,
                        crossorigin: element.crossOrigin,
                        attributes: [...element.attributes].map(a => [a.name, a.value])
                    });
                }
            }
        }

        // 具体的优化逻辑（子类实现）
        doOptimize(element) {
            Logger.warn(`${this.name} doOptimize method not implemented`);
            return false;
        }

        // 回退优化
        rollback(element) {
            if (!element) return false;
            try {
                return this.doRollback(element);
            } catch (error) {
                Logger.error(`${this.name} rollback failed`, error);
                return false;
            }
        }

        // 具体的回退逻辑（基类实现通用属性恢复，子类可扩展）
        doRollback(element) {
            if (!element || !element.tagName) return false;
            const tag = element.tagName.toUpperCase();
            let state;
            if (tag === 'SCRIPT') {
                state = STATE.originalStates.scripts.get(element);
                if (state) {
                    element.src = state.src;
                    element.type = state.type;
                    element.async = state.async;
                    element.defer = state.defer;
                    element.crossOrigin = state.crossorigin;
                    // 恢复所有原始属性
                    for (const [k, v] of state.attributes) {
                        element.setAttribute(k, v);
                    }
                    Logger.info('Script element rolled back', element.src);
                    return true;
                }
            } else if (tag === 'LINK') {
                state = STATE.originalStates.styles.get(element) || STATE.originalStates.fonts.get(element);
                if (state) {
                    element.href = state.href;
                    element.rel = state.rel;
                    element.as = state.as;
                    element.media = state.media;
                    element.crossOrigin = state.crossorigin;
                    for (const [k, v] of state.attributes) {
                        element.setAttribute(k, v);
                    }
                    Logger.info('Link element rolled back', element.href);
                    return true;
                }
            } else if (tag === 'IMG') {
                state = STATE.originalStates.images.get(element);
                if (state) {
                    element.src = state.src;
                    element.loading = state.loading;
                    element.crossOrigin = state.crossorigin;
                    for (const [k, v] of state.attributes) {
                        element.setAttribute(k, v);
                    }
                    Logger.info('Image element rolled back', element.src);
                    return true;
                }
            }
            Logger.warn('No original state found for rollback', element);
            return false;
        }
    }

    // 主控制器
    class ResourceOptimizerController {
        constructor() {
            this.optimizers = [];
            this.observer = null;
            this.initialized = false;
        }

        // 初始化控制器
        init() {
            if (this.initialized) return;

            Logger.info('Initializing Resource Optimizer Controller');

            // 检查是否被禁用
            if (window.DISABLE_RESOURCE_OPTIMIZER) {
                Logger.info('Resource optimizer disabled by user');
                return;
            }

            // 检查调试模式
            if (window.RESOURCE_OPTIMIZER_DEBUG) {
                CONFIG.DEBUG = true;
                Logger.info('Debug mode enabled');
            }

            // 初始化优化器
            this.initOptimizers();

            // 开始监控
            this.startMonitoring();

            // SPA兼容
            setupSPARouterCompatibility(this);

            this.initialized = true;
            Logger.info('Resource Optimizer Controller initialized successfully');
        }

        // 初始化优化器
        initOptimizers() {
            // 这里将在后续任务中实现具体的优化器
            Logger.info('Optimizers will be initialized in subsequent tasks');
        }

        // 开始监控
        startMonitoring() {
            // 监控现有资源
            this.optimizeExistingResources();

            // 监控动态添加的资源
            this.startDynamicMonitoring();
        }

        // 优化现有资源
        optimizeExistingResources() {
            Logger.info('Optimizing existing resources');

            // 优化脚本
            if (CONFIG.FEATURES.JS_OPTIMIZATION) {
                this.optimizeScripts();
            }

            // 优化样式
            if (CONFIG.FEATURES.CSS_OPTIMIZATION) {
                this.optimizeStyles();
            }

            // 优化图片
            if (CONFIG.FEATURES.IMAGE_OPTIMIZATION) {
                this.optimizeImages();
            }

            // 优化字体
            if (CONFIG.FEATURES.FONT_OPTIMIZATION) {
                this.optimizeFonts();
            }
        }

        // 优化脚本
        optimizeScripts() {
            const scripts = document.querySelectorAll('script[src]');
            Logger.info(`Found ${scripts.length} script elements to optimize`);
            scripts.forEach(script => {
                const cdnInfo = Utils.isCDNResource(script.src);
                if (cdnInfo.isCDN) {
                    STATE.stats.cdnResources++;
                    Logger.info(`[CDN识别] JS: ${script.src} | provider: ${cdnInfo.provider} | type: ${cdnInfo.type}`);
                    // === CDN资源预加载优化 ===
                    if (!Utils.isCriticalResource(script, 'js') && !document.querySelector(`link[rel="preload"][href="${script.src}"]`)) {
                        const preload = document.createElement('link');
                        preload.rel = 'preload';
                        preload.as = 'script';
                        preload.href = script.src;
                        preload.crossOrigin = 'anonymous';
                        document.head.appendChild(preload);
                        STATE.stats.cdnResourcesPreloaded = (STATE.stats.cdnResourcesPreloaded || 0) + 1;
                        STATE.stats.dynamicCDNOptimized = (STATE.stats.dynamicCDNOptimized || 0) + 1;
                        Logger.info(`[CDN优化] 已为CDN JS资源添加preload: ${script.src}`);
                    }
                }
                // === 跨站资源CORS安全处理 ===
                if (Utils.isCrossOriginResource(script.src) && !script.hasAttribute('crossorigin') && !Utils.isCriticalResource(script, 'js')) {
                    script.setAttribute('crossorigin', 'anonymous');
                    STATE.stats.crossOriginResources++;
                    Logger.info(`[CORS优化] 已为跨站JS添加crossorigin=anonymous: ${script.src}`);
                }
                // === JS脚本优化核心逻辑 ===
                // 排除关键脚本
                if (Utils.isCriticalResource(script, 'js')) return;
                // 已有async/defer不处理
                if (script.hasAttribute('async') || script.hasAttribute('defer')) return;
                // 白名单不处理
                if (CONFIG.LISTS.WHITELIST.some(domain => script.src.includes(domain))) return;
                // 默认加defer（更安全），如需更激进可加async
                script.setAttribute('defer', 'defer');
                STATE.stats.optimizedScripts++;
                Logger.info(`[JS优化] 已为脚本添加defer: ${script.src}`);
            });
        }

        // 优化样式
        optimizeStyles() {
            const styles = document.querySelectorAll('link[rel="stylesheet"]');
            Logger.info(`Found ${styles.length} style elements to optimize`);
            styles.forEach(style => {
                const cdnInfo = Utils.isCDNResource(style.href);
                if (cdnInfo.isCDN) {
                    STATE.stats.cdnResources++;
                    Logger.info(`[CDN识别] CSS: ${style.href} | provider: ${cdnInfo.provider} | type: ${cdnInfo.type}`);
                    // === CDN资源预加载优化 ===
                    if (!Utils.isCriticalResource(style, 'css') && !document.querySelector(`link[rel="preload"][href="${style.href}"]`)) {
                        const preload = document.createElement('link');
                        preload.rel = 'preload';
                        preload.as = 'style';
                        preload.href = style.href;
                        preload.crossOrigin = 'anonymous';
                        document.head.appendChild(preload);
                        STATE.stats.cdnResourcesPreloaded = (STATE.stats.cdnResourcesPreloaded || 0) + 1;
                        STATE.stats.dynamicCDNOptimized = (STATE.stats.dynamicCDNOptimized || 0) + 1;
                        Logger.info(`[CDN优化] 已为CDN CSS资源添加preload: ${style.href}`);
                    }
                }
                // === 跨站资源CORS安全处理 ===
                if (Utils.isCrossOriginResource(style.href) && !style.hasAttribute('crossorigin') && !Utils.isCriticalResource(style, 'css')) {
                    style.setAttribute('crossorigin', 'anonymous');
                    STATE.stats.crossOriginResources++;
                    Logger.info(`[CORS优化] 已为跨站CSS添加crossorigin=anonymous: ${style.href}`);
                }
                // === CSS优化核心逻辑 ===
                // 排除关键CSS
                if (Utils.isCriticalResource(style, 'css')) return;
                // 已有media=print或preload不处理
                if (style.media === 'print' || style.rel === 'preload') return;
                // 白名单不处理
                if (CONFIG.LISTS.WHITELIST.some(domain => style.href.includes(domain))) return;
                // 优化：先media=print，onload后切回all（兼容性好）
                style.media = 'print';
                style.onload = function() { this.media = 'all'; };
                STATE.stats.optimizedStyles++;
                Logger.info(`[CSS优化] 已为样式添加media=print异步加载: ${style.href}`);
            });
        }

        // 优化图片
        optimizeImages() {
            const images = document.querySelectorAll('img');
            Logger.info(`Found ${images.length} image elements to optimize`);
            images.forEach(img => {
                const cdnInfo = Utils.isCDNResource(img.src);
                if (cdnInfo.isCDN) {
                    STATE.stats.cdnResources++;
                    Logger.info(`[CDN识别] IMG: ${img.src} | provider: ${cdnInfo.provider} | type: ${cdnInfo.type}`);
                }
                // === 跨站资源CORS安全处理 ===
                if (Utils.isCrossOriginResource(img.src) && !img.hasAttribute('crossorigin') && !Utils.isCriticalResource(img, 'img')) {
                    img.setAttribute('crossorigin', 'anonymous');
                    STATE.stats.crossOriginResources++;
                    Logger.info(`[CORS优化] 已为跨站IMG添加crossorigin=anonymous: ${img.src}`);
                }
                // === 图片懒加载优化核心逻辑 ===
                // 排除关键图片
                if (Utils.isCriticalResource(img, 'img')) return;
                // logo图片排除（常见logo类名/id）
                const alt = (img.alt || '').toLowerCase();
                const cls = (img.className || '').toLowerCase();
                const id = (img.id || '').toLowerCase();
                if (alt.includes('logo') || cls.includes('logo') || id.includes('logo')) return;
                // 已有loading属性不处理
                if (img.hasAttribute('loading')) return;
                // 白名单不处理
                if (CONFIG.LISTS.WHITELIST.some(domain => img.src.includes(domain))) return;
                // 添加懒加载
                img.setAttribute('loading', 'lazy');
                STATE.stats.optimizedImages++;
                Logger.info(`[图片优化] 已为图片添加loading=lazy: ${img.src}`);
            });
        }

        // 优化字体
        optimizeFonts() {
            const fonts = document.querySelectorAll('link[rel="preload"][as="font"], link[rel="stylesheet"][href*="font"], link[rel="stylesheet"][href*="fonts"]');
            Logger.info(`Found ${fonts.length} font elements to optimize`);
            fonts.forEach(font => {
                const href = font.href;
                const isPreload = font.rel === 'preload' && font.getAttribute('as') === 'font';
                // === 跨站资源CORS安全处理 ===
                if (Utils.isCrossOriginResource(href) && !font.hasAttribute('crossorigin') && !Utils.isCriticalResource(font, 'font')) {
                    font.setAttribute('crossorigin', 'anonymous');
                    STATE.stats.crossOriginResources++;
                    Logger.info(`[CORS优化] 已为跨站字体添加crossorigin=anonymous: ${href}`);
                }
                // CDN字体预加载
                const cdnInfo = Utils.isCDNResource(href);
                if (cdnInfo.isCDN && !isPreload && !Utils.isCriticalResource(font, 'font') && !document.querySelector(`link[rel="preload"][href="${href}"]`)) {
                    const preload = document.createElement('link');
                    preload.rel = 'preload';
                    preload.as = 'font';
                    preload.href = href;
                    preload.crossOrigin = 'anonymous';
                    document.head.appendChild(preload);
                    STATE.stats.cdnResourcesPreloaded = (STATE.stats.cdnResourcesPreloaded || 0) + 1;
                    STATE.stats.dynamicCDNOptimized = (STATE.stats.dynamicCDNOptimized || 0) + 1;
                    Logger.info(`[CDN优化] 已为CDN 字体资源添加preload: ${href}`);
                }
                // 只处理未preload的关键字体
                if (isPreload) return;
                if (!href || href.endsWith('.css')) return; // 跳过样式表
                if (CONFIG.LISTS.WHITELIST.some(domain => href.includes(domain))) return;
                // 动态插入preload标签
                const preload = document.createElement('link');
                preload.rel = 'preload';
                preload.as = 'font';
                preload.href = href;
                preload.crossOrigin = 'anonymous';
                document.head.appendChild(preload);
                STATE.stats.optimizedFonts++;
                Logger.info(`[字体优化] 已为字体资源添加preload: ${href}`);
            });
        }

        // 开始动态监控
        startDynamicMonitoring() {
            if (!CONFIG.FEATURES.DYNAMIC_MONITORING) return;
            Logger.info('Starting dynamic resource monitoring');
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                this.handleNewElementRecursive(node);
                            }
                        });
                    }
                });
            });
            this.observer.observe(document, {
                childList: true,
                subtree: true
            });
        }
        // 递归处理新元素及其子元素
        handleNewElementRecursive(element) {
            this.handleNewElement(element);
            if (element.children && element.children.length > 0) {
                Array.from(element.children).forEach(child => this.handleNewElementRecursive(child));
            }
            STATE.stats.dynamicOptimized = (STATE.stats.dynamicOptimized || 0) + 1;
        }

        // 处理新添加的元素
        handleNewElement(element) {
            // 动态CDN资源预加载和CORS优化
            if (element.tagName === 'SCRIPT' && element.src) {
                const cdnInfo = Utils.isCDNResource(element.src);
                if (cdnInfo.isCDN) {
                    // CDN预加载
                    if (!Utils.isCriticalResource(element, 'js') && !document.querySelector(`link[rel="preload"][href="${element.src}"]`)) {
                        const preload = document.createElement('link');
                        preload.rel = 'preload';
                        preload.as = 'script';
                        preload.href = element.src;
                        preload.crossOrigin = 'anonymous';
                        document.head.appendChild(preload);
                        STATE.stats.cdnResourcesPreloaded = (STATE.stats.cdnResourcesPreloaded || 0) + 1;
                        STATE.stats.dynamicCDNOptimized = (STATE.stats.dynamicCDNOptimized || 0) + 1;
                        Logger.info(`[CDN优化-动态] 已为动态CDN JS资源添加preload: ${element.src}`);
                    }
                }
                if (Utils.isCrossOriginResource(element.src) && !element.hasAttribute('crossorigin') && !Utils.isCriticalResource(element, 'js')) {
                    element.setAttribute('crossorigin', 'anonymous');
                    STATE.stats.crossOriginResources++;
                    Logger.info(`[CORS优化-动态] 已为动态跨站JS添加crossorigin=anonymous: ${element.src}`);
                }
                // === JS脚本优化核心逻辑 ===
                // 排除关键脚本
                if (Utils.isCriticalResource(element, 'js')) return;
                if (element.hasAttribute('async') || element.hasAttribute('defer')) return;
                if (CONFIG.LISTS.WHITELIST.some(domain => element.src.includes(domain))) return;
                element.setAttribute('defer', 'defer');
                STATE.stats.optimizedScripts++;
                Logger.info(`[JS优化-动态] 已为脚本添加defer: ${element.src}`);
            }
            if (element.tagName === 'LINK' && element.rel === 'stylesheet' && element.href) {
                const cdnInfo = Utils.isCDNResource(element.href);
                if (cdnInfo.isCDN) {
                    // CDN预加载
                    if (!Utils.isCriticalResource(element, 'css') && !document.querySelector(`link[rel="preload"][href="${element.href}"]`)) {
                        const preload = document.createElement('link');
                        preload.rel = 'preload';
                        preload.as = 'style';
                        preload.href = element.href;
                        preload.crossOrigin = 'anonymous';
                        document.head.appendChild(preload);
                        STATE.stats.cdnResourcesPreloaded = (STATE.stats.cdnResourcesPreloaded || 0) + 1;
                        STATE.stats.dynamicCDNOptimized = (STATE.stats.dynamicCDNOptimized || 0) + 1;
                        Logger.info(`[CDN优化-动态] 已为动态CDN CSS资源添加preload: ${element.href}`);
                    }
                }
                if (Utils.isCrossOriginResource(element.href) && !element.hasAttribute('crossorigin') && !Utils.isCriticalResource(element, 'css')) {
                    element.setAttribute('crossorigin', 'anonymous');
                    STATE.stats.crossOriginResources++;
                    Logger.info(`[CORS优化-动态] 已为动态跨站CSS添加crossorigin=anonymous: ${element.href}`);
                }
                // === CSS优化核心逻辑 ===
                // 排除关键CSS
                if (Utils.isCriticalResource(element, 'css')) return;
                if (element.media === 'print' || element.rel === 'preload') return;
                if (CONFIG.LISTS.WHITELIST.some(domain => element.href.includes(domain))) return;
                element.media = 'print';
                element.onload = function() { this.media = 'all'; };
                STATE.stats.optimizedStyles++;
                Logger.info(`[CSS优化-动态] 已为样式添加media=print异步加载: ${element.href}`);
            }
            if (element.tagName === 'LINK' && (element.rel === 'stylesheet' || element.rel === 'preload') && element.href && (element.href.includes('font') || element.href.includes('fonts'))) {
                const href = element.href;
                const isPreload = element.rel === 'preload' && element.getAttribute('as') === 'font';
                const cdnInfo = Utils.isCDNResource(href);
                if (cdnInfo.isCDN && !isPreload && !Utils.isCriticalResource(element, 'font') && !document.querySelector(`link[rel="preload"][href="${href}"]`)) {
                    const preload = document.createElement('link');
                    preload.rel = 'preload';
                    preload.as = 'font';
                    preload.href = href;
                    preload.crossOrigin = 'anonymous';
                    document.head.appendChild(preload);
                    STATE.stats.cdnResourcesPreloaded = (STATE.stats.cdnResourcesPreloaded || 0) + 1;
                    STATE.stats.dynamicCDNOptimized = (STATE.stats.dynamicCDNOptimized || 0) + 1;
                    Logger.info(`[CDN优化-动态] 已为动态CDN 字体资源添加preload: ${href}`);
                }
                if (Utils.isCrossOriginResource(href) && !element.hasAttribute('crossorigin') && !Utils.isCriticalResource(element, 'font')) {
                    element.setAttribute('crossorigin', 'anonymous');
                    STATE.stats.crossOriginResources++;
                    Logger.info(`[CORS优化-动态] 已为动态跨站字体添加crossorigin=anonymous: ${href}`);
                }
                // === 字体优化核心逻辑 ===
                const isPreload2 = element.rel === 'preload' && element.getAttribute('as') === 'font';
                if (isPreload2) return;
                if (!href || href.endsWith('.css')) return;
                if (CONFIG.LISTS.WHITELIST.some(domain => href.includes(domain))) return;
                const preload = document.createElement('link');
                preload.rel = 'preload';
                preload.as = 'font';
                preload.href = href;
                preload.crossOrigin = 'anonymous';
                document.head.appendChild(preload);
                STATE.stats.optimizedFonts++;
                Logger.info(`[字体优化-动态] 已为字体资源添加preload: ${href}`);
            }
            if (element.tagName === 'IMG' && element.src) {
                const cdnInfo = Utils.isCDNResource(element.src);
                if (cdnInfo.isCDN) {
                    STATE.stats.cdnResources++;
                    Logger.info(`[CDN识别-动态] IMG: ${element.src} | provider: ${cdnInfo.provider} | type: ${cdnInfo.type}`);
                }
                // === 动态图片懒加载优化 ===
                if (Utils.isCriticalResource(element, 'img')) return;
                const alt = (element.alt || '').toLowerCase();
                const cls = (element.className || '').toLowerCase();
                const id = (element.id || '').toLowerCase();
                if (alt.includes('logo') || cls.includes('logo') || id.includes('logo')) return;
                if (element.hasAttribute('loading')) return;
                if (CONFIG.LISTS.WHITELIST.some(domain => element.src.includes(domain))) return;
                element.setAttribute('loading', 'lazy');
                STATE.stats.optimizedImages++;
                Logger.info(`[图片优化-动态] 已为图片添加loading=lazy: ${element.src}`);
            }
            Logger.debug('New element detected', element.tagName);
        }

        // 获取统计信息
        getStats() {
            return {
                ...STATE.stats,
                uptime: performance.now() - STATE.performance.startTime
            };
        }

        // 重置统计信息
        resetStats() {
            STATE.stats = {
                optimizedScripts: 0,
                optimizedStyles: 0,
                optimizedImages: 0,
                optimizedFonts: 0,
                cdnResources: 0,
                crossOriginResources: 0,
                errors: 0,
                warnings: 0,
                criticalProtected: 0,
                cdnResourcesPreloaded: 0,
                spaOptimized: 0,
                dynamicCDNOptimized: 0
            };
        }

        // 启用/禁用优化器
        setEnabled(enabled) {
            STATE.enabled = enabled;
            Logger.info(`Resource optimizer ${enabled ? 'enabled' : 'disabled'}`);
        }

        // 清理资源
        destroy() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }

            Logger.info('Resource Optimizer Controller destroyed');
        }

        // 回退所有优化
        rollbackAll() {
            let count = 0;
            for (const [el] of STATE.originalStates.scripts) {
                if (el && typeof el.tagName === 'string') {
                    if (typeof this.optimizers?.[0]?.rollback === 'function') {
                        if (this.optimizers[0].rollback(el)) count++;
                    }
                }
            }
            for (const [el] of STATE.originalStates.styles) {
                if (el && typeof el.tagName === 'string') {
                    if (typeof this.optimizers?.[0]?.rollback === 'function') {
                        if (this.optimizers[0].rollback(el)) count++;
                    }
                }
            }
            for (const [el] of STATE.originalStates.fonts) {
                if (el && typeof el.tagName === 'string') {
                    if (typeof this.optimizers?.[0]?.rollback === 'function') {
                        if (this.optimizers[0].rollback(el)) count++;
                    }
                }
            }
            for (const [el] of STATE.originalStates.images) {
                if (el && typeof el.tagName === 'string') {
                    if (typeof this.optimizers?.[0]?.rollback === 'function') {
                        if (this.optimizers[0].rollback(el)) count++;
                    }
                }
            }
            Logger.info(`Rollback all: ${count} elements restored`);
            return count;
        }
    }

    // 全局实例
    let controller = null;

    // 初始化函数
    function init() {
        try {
            Logger.info('Starting Web Resource Priority Optimizer');

            // 创建控制器
            controller = new ResourceOptimizerController();

            // 初始化控制器
            controller.init();

            // 暴露到全局（用于调试）
            if (CONFIG.DEBUG) {
                window.ResourceOptimizer = {
                    controller: controller,
                    config: CONFIG,
                    state: STATE,
                    logger: Logger,
                    utils: Utils
                };
            }

            Logger.info('Web Resource Priority Optimizer started successfully');

        } catch (error) {
            Logger.error('Failed to initialize Web Resource Priority Optimizer', error);
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 导出到全局（用于后续任务）
    window.WebResourceOptimizer = {
        init: init,
        controller: controller,
        config: CONFIG,
        state: STATE,
        logger: Logger,
        utils: Utils,
        ResourceOptimizer: ResourceOptimizer,
        ResourceOptimizerController: ResourceOptimizerController
    };

    // SPA路由兼容
    function setupSPARouterCompatibility(controller) {
        let lastUrl = location.href;
        let spaOptimizeCount = 0;
        function onRouteChange() {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(() => {
                    if (controller) {
                        controller.optimizeExistingResources();
                        spaOptimizeCount++;
                        STATE.stats.spaOptimized = (STATE.stats.spaOptimized || 0) + 1;
                        Logger.info(`[SPA兼容] 路由变化后已重新优化资源，第${spaOptimizeCount}次`);
                    }
                }, 100);
            }
        }
        // 劫持pushState/replaceState
        const rawPush = history.pushState;
        const rawReplace = history.replaceState;
        history.pushState = function(...args) {
            rawPush.apply(this, args);
            onRouteChange();
        };
        history.replaceState = function(...args) {
            rawReplace.apply(this, args);
            onRouteChange();
        };
        window.addEventListener('popstate', onRouteChange);
    }

    // 资源加载失败检测与回退
    function attachResourceErrorHandler(element) {
        if (!element || !element.tagName) return;
        if (element._wro_errorHandlerAttached) return;
        element._wro_errorHandlerAttached = true;
        element.addEventListener('error', function() {
            Logger.error(`资源加载失败: ${element.tagName} ${element.src || element.href}`);
            // 单资源多次失败可回退该资源
            if (window.WebResourceOptimizer && window.WebResourceOptimizer.controller) {
                window.WebResourceOptimizer.controller.optimizers?.[0]?.rollback?.(element);
            }
        }, true);
    }

    // 兼容性检测与降级
    const COMPAT = {
        Map: typeof Map !== 'undefined',
        Blob: typeof Blob !== 'undefined',
        URL: typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function',
        addEventListener: typeof window.addEventListener === 'function',
        defineProperty: typeof Object.defineProperty === 'function',
        GM_log: typeof GM_log !== 'undefined',
        GM_registerMenuCommand: typeof GM_registerMenuCommand !== 'undefined',
        MutationObserver: typeof MutationObserver !== 'undefined',
        performance: typeof performance !== 'undefined' && typeof performance.now === 'function'
    };
    const COMPAT_WARNINGS = [];
    if (!COMPAT.Map) COMPAT_WARNINGS.push('Map 不支持');
    if (!COMPAT.Blob) COMPAT_WARNINGS.push('Blob 不支持，日志导出不可用');
    if (!COMPAT.URL) COMPAT_WARNINGS.push('URL.createObjectURL 不支持，日志导出不可用');
    if (!COMPAT.addEventListener) COMPAT_WARNINGS.push('addEventListener 不支持，无法监听资源错误');
    if (!COMPAT.defineProperty) COMPAT_WARNINGS.push('Object.defineProperty 不支持，部分全局开关不可用');
    if (!COMPAT.MutationObserver) COMPAT_WARNINGS.push('MutationObserver 不支持，动态优化不可用');
    if (!COMPAT.performance) COMPAT_WARNINGS.push('performance.now 不支持，运行时间不可用');

})();