// ==UserScript==
// @name         Leave-debugger
// @namespace    https://github.com/SherryBX/Leave-debugger
// @version      v2.2.0
// @description  用于破解网页无限debugger，支持多种调试方式拦截
// @author       Sherry
// @match        *://*/*
// @include      *://*/*
// @run-at       document-start
// @license      MIT
// @icon         https://mms0.baidu.com/it/u=2886239489,318124131&fm=253&app=138&f=JPEG?w=800&h=800
// @downloadURL https://update.greasyfork.org/scripts/524858/Leave-debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/524858/Leave-debugger.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置项
    const CONFIG = {
        version: 'v2.2.0',
        debugMode: false, // 调试模式开关
        checkPatterns: ['debugger', 'debug', 'DevTools'], // 检查的关键字模式
    };

    // 统一的日志输出
    const Logger = {
        styles: {
            main: 'color: #43bb88; font-size: 14px; font-weight: bold;',
            info: 'color: #666; font-size: 12px;',
            hook: 'color: #43bb88;'
        },
        print(message, style = 'main') {
            console.log(`%c ${message}`, this.styles[style]);
        },
        debug(...args) {
            if (CONFIG.debugMode) {
                console.log('[Debug]', ...args);
            }
        }
    };

    // Hook 状态管理
    const HookManager = {
        notified: new Set(),
        markNotified(type) {
            if (!this.notified.has(type)) {
                this.notified.add(type);
                Logger.print(`🎯 Hook ${type} debugger!`, 'hook');
            }
        }
    };

    // 工具函数
    const Utils = {
        // 安全地检查函数字符串
        safeToString(func) {
            try {
                const str = Function.prototype.toString.call(func);
                return typeof str === 'string' ? str.replace(/\s+/g, '') : '';
            } catch (e) {
                Logger.debug('toString error:', e);
                return '';
            }
        },
        // 检查是否包含调试相关代码
        containsDebugger(content) {
            if (!content) return false;
            return CONFIG.checkPatterns.some(pattern => content.includes(pattern));
        },
        // 创建空函数
        createEmptyFunction() {
            return function () { return -1; };
        }
    };

    // Hook 实现
    const Hooks = {
        // Hook Function constructor
        hookConstructor() {
            const original = Function.prototype.constructor;
            Function.prototype.constructor = function (string) {
                if (Utils.containsDebugger(string)) {
                    HookManager.markNotified('constructor');
                    return Utils.createEmptyFunction();
                }
                return original.apply(this, arguments);
            };
        },

        // Hook setInterval
        hookSetInterval() {
            const original = window.setInterval;
            window.setInterval = function (func, delay) {
                if (typeof func === 'function' && Utils.containsDebugger(Utils.safeToString(func))) {
                    HookManager.markNotified('setInterval');
                    return Utils.createEmptyFunction();
                }
                return original.apply(this, arguments);
            };
        },

        // Hook setTimeout
        hookSetTimeout() {
            const original = window.setTimeout;
            window.setTimeout = function (func, delay) {
                if (typeof func === 'function' && Utils.containsDebugger(Utils.safeToString(func))) {
                    HookManager.markNotified('setTimeout');
                    return Utils.createEmptyFunction();
                }
                return original.apply(this, arguments);
            };
        },

        // Hook eval
        hookEval() {
            const original = window.eval;
            window.eval = function (string) {
                if (Utils.containsDebugger(string)) {
                    HookManager.markNotified('eval');
                    string = string.replace(/debugger\s*;?/g, '');
                }
                return original.call(this, string);
            };
            // 保持 toString 的原始行为
            Object.defineProperty(window.eval, 'toString', {
                value: function() { return original.toString(); },
                configurable: false,
                writable: false
            });
        }
    };

    // 错误处理
    const ErrorHandler = {
        setup() {
            window.addEventListener('error', function (event) {
                if (event.error?.message?.includes('Cannot read properties') ||
                    event.error?.message?.includes('Cannot set property')) {
                    event.preventDefault();
                    Logger.debug('Prevented error:', event.error.message);
                    return false;
                }
            }, true);
        }
    };

    // 初始化
    function initialize() {
        Logger.print('Leave-debugger 已启动 🚀');
        Logger.print(`Version: ${CONFIG.version} 📦`, 'info');
        Logger.print('Author: Sherry 🛡️', 'info');

        // 应用所有 hooks
        Object.values(Hooks).forEach(hook => {
            try {
                hook();
            } catch (e) {
                Logger.debug('Hook error:', e);
            }
        });

        // 设置错误处理
        ErrorHandler.setup();
    }

    // 启动脚本
    initialize();
})();