// ==UserScript==
// @name         屏蔽 DevTools 检测
// @namespace    https://github.com/LFWQSP2641/
// @version      1.3
// @description  拦截 devtools-detector.js 脚本，禁用页面检测 DevTools 的功能。
// @author       LFWQSP2641
// @match        *://*.chaoxing.com/*
// @match        *://blog.aepkill.com/demos/devtools-detector/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531024/%E5%B1%8F%E8%94%BD%20DevTools%20%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/531024/%E5%B1%8F%E8%94%BD%20DevTools%20%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置选项，可以根据需要启用或禁用不同的防御策略
    const CONFIG = {
        // 监听并移除检测脚本标签
        removeScriptTags: true,
        // 高级防御策略（覆盖原生函数、监听属性等）
        advancedProtection: true,
        // 拦截可能的网络请求
        interceptXHR: false,
        // 调试模式
        debug: false
    };

    // 日志函数，仅在调试模式下输出信息
    const log = (...args) => {
        if (CONFIG.debug) {
            console.log('[Anti-DevTools]', ...args);
        }
    };

    // 1. 移除检测脚本标签
    if (CONFIG.removeScriptTags) {
        const scriptPatterns = [
            'devtools-detector.js',
            'devtoolsDetector'
        ];
        
        const scriptFilter = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type !== 'childList') continue;
                
                for (const node of mutation.addedNodes) {
                    if (node.nodeName === 'SCRIPT' && node.src && 
                        scriptPatterns.some(pattern => node.src.includes(pattern))) {
                        log(`已拦截脚本: ${node.src}`);
                        node.remove();
                    }
                }
            }
        });

        // 使用捕获阶段以便更早捕获到脚本添加
        scriptFilter.observe(document, {
            childList: true,
            subtree: true
        });
        
        // 定期检查观察器状态，确保它始终在运行
        const watchdogTimer = setInterval(() => {
            if (!scriptFilter || scriptFilter.takeRecords().length === 0) {
                scriptFilter.disconnect();
                scriptFilter.observe(document, { childList: true, subtree: true });
                log('观察器已重启');
            }
        }, 30000);
        
        // 页面卸载时清理资源
        window.addEventListener('unload', () => {
            scriptFilter.disconnect();
            clearInterval(watchdogTimer);
        }, { once: true });
    }

    // 2. 注入高级防御代码
    if (CONFIG.advancedProtection) {
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                // 保存原始方法引用
                const originals = {
                    defineProperty: Object.defineProperty,
                    getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor,
                    Function: Function,
                    setTimeout: window.setTimeout,
                    console: {}
                };
                
                // 为控制台方法保存原始引用
                if (window.console) {
                    ['log', 'table', 'clear', 'trace', 'debug', 'info', 'warn', 'error'].forEach(method => {
                        if (typeof console[method] === 'function') {
                            originals.console[method] = console[method];
                        }
                    });
                }
                
                // 创建不可变的假 devtoolsDetector 对象
                const fakeDetector = Object.freeze({
                    isLaunch: () => false,
                    launch: () => {},
                    stop: () => {},
                    addListener: () => {},
                    removeListener: () => {},
                    setDetectDelay: () => {},
                    _detectLoop: () => {},
                    _broadcast: () => {},
                    _detectLoopStopped: true,
                    isOpen: false,
                    _isOpen: false
                });
                
                // 检查字符串是否包含检测关键词
                const containsDetectorKeywords = (str) => {
                    if (typeof str !== 'string') return false;
                    const keywords = [
                        'devtools', 'debugger', '_detectLoop', 'isOpen',
                        'console.clear', 'firebug', 'webpackJsonp'
                    ];
                    return keywords.some(keyword => str.includes(keyword));
                };
                
                // 确保 devtoolsDetector 对象始终返回伪造版本
                try {
                    originals.defineProperty(window, 'devtoolsDetector', {
                        configurable: false,
                        enumerable: true,
                        get: function() {
                            return fakeDetector;
                        },
                        set: function() {
                            return fakeDetector;
                        }
                    });
                } catch (e) {
                    // 可能已被定义，尝试覆盖
                    window.devtoolsDetector = fakeDetector;
                }
                
                if (${CONFIG.advancedProtection}) {
                    // 拦截 Function 构造器
                    try {
                        window.Function = function() {
                            const fnBody = arguments[arguments.length - 1];
                            if (typeof fnBody === 'string' && containsDetectorKeywords(fnBody)) {
                                return function() { return false; };
                            }
                            return originals.Function.apply(this, arguments);
                        };
                        window.Function.prototype = originals.Function.prototype;
                    } catch (e) {}
                    
                    // 拦截 setTimeout
                    try {
                        window.setTimeout = function(fn, delay) {
                            if (typeof fn === 'function' && delay >= 100 && delay <= 1500) {
                                try {
                                    const fnStr = fn.toString();
                                    if (containsDetectorKeywords(fnStr)) {
                                        fn = function() {};
                                    }
                                } catch (e) {}
                            }
                            return originals.setTimeout.apply(this, arguments);
                        };
                    } catch (e) {}
                    
                    // 拦截 console 方法
                    if (window.console) {
                        Object.keys(originals.console).forEach(method => {
                            try {
                                console[method] = function() {
                                    try {
                                        const stack = new Error().stack || '';
                                        if (containsDetectorKeywords(stack)) {
                                            return undefined;
                                        }
                                    } catch (e) {}
                                    return originals.console[method].apply(this, arguments);
                                };
                            } catch (e) {}
                        });
                    }
                    
                    // 阻止调试器自动断点
                    try {
                        const div = document.createElement('div');
                        div.id = 'antiDebuggerDiv';
                        div.__defineGetter__('id', function() {
                            // 避免无限递归
                            if (this._id_accessed) return 'antiDebuggerDiv';
                            this._id_accessed = true;
                            
                            // 用于检测调试状态，当调试时此属性读取会触发debugger
                            try { debugger; } catch(e) {}
                            return 'antiDebuggerDiv';
                        });
                        
                        // 使用间接方法在页面中保持引用
                        document.antiDebuggerRef = div;
                    } catch (e) {}
                    
                    // 阻止 Chrome DevTools 协议检测
                    try {
                        const oldToString = Function.prototype.toString;
                        Function.prototype.toString = function() {
                            const fnString = oldToString.apply(this, arguments);
                            if (this === window.navigator.constructor.prototype.hasOwnProperty ||
                                fnString.includes('native code') && 
                                (this.name === 'hasOwnProperty' || 
                                 this.name === 'webdriver' || 
                                 this.name === 'userAgent')) {
                                return 'function hasOwnProperty() { [native code] }';
                            }
                            return fnString;
                        };
                    } catch (e) {}
                    
                    // 阻止通过 Performance API 检测
                    try {
                        const originalGetEntries = performance.getEntries;
                        performance.getEntries = function() {
                            const entries = originalGetEntries.apply(this, arguments);
                            return entries.filter(entry => 
                                !entry.name.includes('devtools') && 
                                !entry.name.includes('chrome-extension')
                            );
                        };
                    } catch (e) {}
                }
                
                // 标记脚本已执行，但避免使用明显名称
                const mark = '_' + Math.random().toString(36).substr(2, 9);
                sessionStorage.setItem(mark, '1');
            })();
        `;

        // 尽早添加到页面并立即移除
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }

    // 3. 拦截 XMLHttpRequest
    if (CONFIG.interceptXHR) {
        const injectXHRScript = document.createElement('script');
        injectXHRScript.textContent = `
            (function() {
                const originalXHR = XMLHttpRequest;
                window.XMLHttpRequest = function() {
                    const xhr = new originalXHR();
                    const originalOpen = xhr.open;
                    const originalSend = xhr.send;
                    
                    xhr.open = function() {
                        const url = arguments[1] || '';
                        if (url.includes('devtools-detector') || url.includes('devtoolsDetector')) {
                            xhr._isDevToolsRequest = true;
                        }
                        return originalOpen.apply(this, arguments);
                    };
                    
                    xhr.send = function() {
                        if (xhr._isDevToolsRequest) {
                            // 重写 readystatechange 监听以返回假响应
                            xhr.addEventListener('readystatechange', function() {
                                if (xhr.readyState === 4) {
                                    Object.defineProperty(xhr, 'status', { value: 200 });
                                    Object.defineProperty(xhr, 'statusText', { value: 'OK' });
                                    Object.defineProperty(xhr, 'responseText', { 
                                        value: 'window.devtoolsDetector={isOpen:false,launch:function(){},stop:function(){},isLaunch:function(){return false},addListener:function(){}};'
                                    });
                                }
                            });
                        }
                        return originalSend.apply(this, arguments);
                    };
                    
                    return xhr;
                };
                
                // 保持原型链一致
                window.XMLHttpRequest.prototype = originalXHR.prototype;
            })();
        `;
        
        (document.head || document.documentElement).appendChild(injectXHRScript);
        injectXHRScript.remove();
    }

    // 记录脚本成功执行
    log('Anti-DevTools-Detector 已激活');
})();