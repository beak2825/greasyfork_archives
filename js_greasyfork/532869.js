// ==UserScript==
// @name         Anti-Debugger Bypass By Probablement
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypasses various JavaScript anti-debugging techniques
// @author       Probablement
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532869/Anti-Debugger%20Bypass%20By%20Probablement.user.js
// @updateURL https://update.greasyfork.org/scripts/532869/Anti-Debugger%20Bypass%20By%20Probablement.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const settings = {
        showNotifications: true,
        notificationDuration: 5000,
        logToConsole: true
    };
    
    let bypassCounters = {
        debugger: 0,
        console: 0,
        devtools: 0,
        functionToString: 0,
        timing: 0,
        properties: 0
    };
    
    function log(message) {
        if (settings.logToConsole) {
            console.log(`%c[Anti-Debugger Bypass]%c ${message}`, 'color: #3498db; font-weight: bold;', 'color: inherit');
        }
    }
    
    const notifications = (function() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        function show(message, type = 'info') {
            if (!settings.showNotifications) return;
            
            const notification = document.createElement('div');
            notification.style.cssText = `
                background-color: white;
                color: #333;
                border-radius: 8px;
                padding: 12px 16px;
                margin-bottom: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                min-width: 280px;
                max-width: 450px;
                transform: translateX(150%);
                transition: transform 0.3s ease-out;
                border-left: 4px solid #3498db;
            `;
            
            if (type === 'success') {
                notification.style.borderColor = '#2ecc71';
            } else if (type === 'warning') {
                notification.style.borderColor = '#f39c12';
            } else if (type === 'error') {
                notification.style.borderColor = '#e74c3c';
            }
            
            const icon = document.createElement('div');
            icon.style.cssText = `
                margin-right: 12px;
                font-size: 18px;
            `;
            
            if (type === 'success') {
                icon.innerHTML = '✅';
            } else if (type === 'warning') {
                icon.innerHTML = '⚠️';
            } else if (type === 'error') {
                icon.innerHTML = '❌';
            } else {
                icon.innerHTML = 'ℹ️';
            }
            
            const content = document.createElement('div');
            content.style.cssText = `
                flex-grow: 1;
            `;
            
            const title = document.createElement('div');
            title.style.cssText = `
                font-weight: bold;
                margin-bottom: 4px;
            `;
            title.textContent = 'Anti-Debugger Bypass';
            
            const messageEl = document.createElement('div');
            messageEl.style.cssText = `
                font-size: 14px;
            `;
            messageEl.textContent = message;
            
            const closeBtn = document.createElement('div');
            closeBtn.style.cssText = `
                margin-left: 12px;
                cursor: pointer;
                font-size: 18px;
                opacity: 0.6;
                transition: opacity 0.2s;
            `;
            closeBtn.innerHTML = '×';
            closeBtn.addEventListener('mouseover', () => { closeBtn.style.opacity = '1'; });
            closeBtn.addEventListener('mouseout', () => { closeBtn.style.opacity = '0.6'; });
            closeBtn.addEventListener('click', () => { remove(notification); });
            
            content.appendChild(title);
            content.appendChild(messageEl);
            notification.appendChild(icon);
            notification.appendChild(content);
            notification.appendChild(closeBtn);
            
            container.appendChild(notification);
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 10);
            
            setTimeout(() => { remove(notification); }, settings.notificationDuration);
            
            return notification;
        }
        
        function remove(notification) {
            notification.style.transform = 'translateX(150%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode === container) {
                    container.removeChild(notification);
                }
            }, 300);
        }
        
        function init() {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(container);
            });
            if (document.body) {
                document.body.appendChild(container);
            }
        }
        
        return {
            init,
            show
        };
    })();
    
    notifications.init();
    
    function bypassDebuggerStatements() {
        const originalConstructor = Function.prototype.constructor;
        
        Function.prototype.constructor = function() {
            const args = Array.from(arguments);
            const body = args.join('');
            
            if (body.includes('debugger')) {
                bypassCounters.debugger++;
                const newBody = body.replace(/debugger;?/g, '// debugger bypassed');
                return originalConstructor.apply(this, [newBody]);
            }
            
            return originalConstructor.apply(this, arguments);
        };
        
        const originalEval = window.eval;
        window.eval = function(code) {
            if (typeof code === 'string' && code.includes('debugger')) {
                bypassCounters.debugger++;
                code = code.replace(/debugger;?/g, '// debugger bypassed');
            }
            return originalEval.call(window, code);
        };
        
        window.onerror = function(message, source, lineno, colno, error) {
            if (message && message.includes('debugger')) {
                bypassCounters.debugger++;
                return true;
            }
            return false;
        };
        
        log('Debugger statement bypass installed');
    }
    
    function protectConsole() {
        const originalMethods = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info,
            debug: console.debug,
            clear: console.clear,
            dir: console.dir,
            trace: console.trace
        };
        
        for (const method in originalMethods) {
            Object.defineProperty(console, method, {
                get: function() {
                    return originalMethods[method];
                },
                set: function(value) {
                    bypassCounters.console++;
                    log(`Prevented console.${method} override`);
                    return originalMethods[method];
                },
                configurable: false
            });
        }
        
        log('Console protection installed');
    }
    
    function bypassDevToolsDetection() {
        const methodsToCheck = [
            'toString',
            'constructor'
        ];
        
        const originalFunctionToString = Function.prototype.toString;
        
        Object.defineProperty(Function.prototype, 'toString', {
            get: function() {
                return function() {
                    try {
                        const nativeString = originalFunctionToString.call(this);
                        
                        if (nativeString.includes('[native code]')) {
                            return nativeString;
                        }
                        
                        if (this === Object.defineProperty || 
                            this === Object.defineProperties ||
                            this === Object.getOwnPropertyDescriptor ||
                            this === Function.prototype.toString) {
                            bypassCounters.functionToString++;
                            return originalFunctionToString.call(Function.prototype.toString);
                        }
                        
                        return nativeString;
                    } catch (e) {
                        return 'function() { [native code] }';
                    }
                };
            },
            set: function() {
                bypassCounters.functionToString++;
            },
            configurable: false
        });
        
        const originalDateNow = Date.now;
        let previousTime = originalDateNow();
        
        Object.defineProperty(Date, 'now', {
            get: function() {
                return function() {
                    const actualTime = originalDateNow();
                    if (actualTime - previousTime > 100) {
                        bypassCounters.timing++;
                        previousTime = previousTime + 16;
                        return previousTime;
                    }
                    previousTime = actualTime;
                    return actualTime;
                };
            },
            configurable: false
        });
        
        if (window.performance && window.performance.now) {
            const originalPerformanceNow = window.performance.now;
            let previousPerformanceTime = originalPerformanceNow.call(window.performance);
            
            Object.defineProperty(window.performance, 'now', {
                get: function() {
                    return function() {
                        const actualTime = originalPerformanceNow.call(window.performance);
                        if (actualTime - previousPerformanceTime > 100) {
                            bypassCounters.timing++;
                            previousPerformanceTime = previousPerformanceTime + 16;
                            return previousPerformanceTime;
                        }
                        previousPerformanceTime = actualTime;
                        return actualTime;
                    };
                },
                configurable: false
            });
        }
        
        function neutralizeDetection() {
            const detectionProps = [
                { object: window, props: ['devtools', 'webdriver', '__webdriver_evaluate', '__selenium_evaluate', '__webdriver_script_fn', '__webdriver_script_func'] },
                { object: document, props: ['__webdriver_script_fn', '__selenium_evaluate', '__webdriver_evaluate'] },
                { object: navigator, props: ['webdriver'] }
            ];
            
            detectionProps.forEach(({object, props}) => {
                props.forEach(prop => {
                    try {
                        if (object[prop]) {
                            Object.defineProperty(object, prop, {
                                get: function() { 
                                    bypassCounters.properties++;
                                    return undefined; 
                                },
                                configurable: false
                            });
                        }
                    } catch (e) {}
                });
            });
            
            if (window.chrome) {
                const nativeChrome = window.chrome;
                Object.defineProperty(window, 'chrome', {
                    get: function() {
                        return nativeChrome;
                    },
                    set: function() {
                        bypassCounters.properties++;
                    },
                    configurable: false
                });
            }
        }
        
        if (window.console && window.console.firebug) {
            bypassCounters.devtools++;
            delete window.console.firebug;
        }
        
        neutralizeDetection();
        log('DevTools detection bypasses installed');
    }
    
    function bypassToStringChecks() {
        const nativeObjectToString = Object.prototype.toString;
        
        Object.defineProperty(Object.prototype, 'toString', {
            get: function() {
                if (new Error().stack.includes('detect')) {
                    bypassCounters.functionToString++;
                    return function() {
                        if (this === window) return '[object Window]';
                        if (this === document) return '[object HTMLDocument]';
                        if (this instanceof HTMLElement) return '[object HTMLElement]';
                        if (this instanceof Event) return '[object Event]';
                        return nativeObjectToString.call(this);
                    };
                }
                return nativeObjectToString;
            },
            configurable: false
        });
        
        log('toString checks bypass installed');
    }
    
    function patchBrowserFeatures() {
        if (window.navigator) {
            const originalUserAgent = navigator.userAgent;
            try {
                Object.defineProperty(navigator, 'userAgent', {
                    get: function() {
                        if (new Error().stack.includes('detect')) {
                            bypassCounters.properties++;
                            return originalUserAgent.replace(/FirePHP|Firebug/gi, '');
                        }
                        return originalUserAgent;
                    }
                });
            } catch (e) {}
        }
        
        const heightDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
        const widthDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
        
        if (heightDescriptor && heightDescriptor.get) {
            Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
                get: function() {
                    if (new Error().stack.includes('detect') || new Error().stack.includes('devtool')) {
                        bypassCounters.properties++;
                        return 0;
                    }
                    return heightDescriptor.get.call(this);
                }
            });
        }
        
        if (widthDescriptor && widthDescriptor.get) {
            Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
                get: function() {
                    if (new Error().stack.includes('detect') || new Error().stack.includes('devtool')) {
                        bypassCounters.properties++;
                        return 0;
                    }
                    return widthDescriptor.get.call(this);
                }
            });
        }
        
        log('Browser features patched');
    }
    
    function activateBypasses() {
        bypassDebuggerStatements();
        protectConsole();
        bypassDevToolsDetection();
        bypassToStringChecks();
        patchBrowserFeatures();
        
        setTimeout(() => {
            notifications.show('Anti-debugging protections activated', 'success');
        }, 1000);
        
        setInterval(() => {
            const totalBypassed = Object.values(bypassCounters).reduce((total, count) => total + count, 0);
            if (totalBypassed > 0) {
                notifications.show(`Bypassed ${totalBypassed} anti-debugging techniques`, 'info');
                Object.keys(bypassCounters).forEach(key => {
                    bypassCounters[key] = 0;
                });
            }
        }, 10000);
        
        log('All anti-debugging bypasses successfully applied');
    }
    
    activateBypasses();
})();
