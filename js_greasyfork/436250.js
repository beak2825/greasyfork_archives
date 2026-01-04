// ==UserScript==
// @name         Allow F12
// @name:zh-CN   允许使用 F12
// @namespace    http://lab.wsl.moe/
// @match        http://*/*
// @match        https://*/*
// @license      MIT
// @version      0.3.4
// @description  Allow to open Dev Tools on some website.
// @description:zh-CN  令某些打开 Developer Tools 的网站就弹 debugger 的功能失效。
// @author       MisakaMikoto
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436250/Allow%20F12.user.js
// @updateURL https://update.greasyfork.org/scripts/436250/Allow%20F12.meta.js
// ==/UserScript==

(function() {

    const origSetInterval = window.setInterval;
    const toString = () => {
        return 'function constructor() {\n    [native code]\n}';
    };
    toString.toString = toString;
    if (toString.toSource) {
        toString.toSource = toString;
    }

    window.setInterval = (func, time) => {
        if (func.toString().indexOf('debugger') !== -1) {
            console.warn('Rejected to register a interval contains debugger statement.');
            return;
        }
        origSetInterval(func, time);
    };
    window.setInterval.toString = toString;

    const origFunction = Function;
    class FakeFunction extends origFunction {
        constructor(func) {
            if (!func) {
                super(func);
                return;
            }
            if (func.indexOf && func.indexOf('debugger') !== -1) {
                //console.warn('Rejected to generate a function contains debugger statement.');
                func = '';
            }
            super(func);
        }
    }
    FakeFunction.constructor = (func) => {
        return new FakeFunction(func);
    };
    window.Function = FakeFunction;
    Function.constructor.toString = toString;
    if (Function.constructor.toSource) {
        Function.constructor.toSource = toString;
    }

    if (localStorage.__disableEvalHook__ == null || localStorage.__disableEvalHook__ === '') {
        localStorage.__disableEvalHook__ = 'true';
    }
    if (Object && Object.defineProperty) {
        const originalConsole = {};
        const noWriteAbleConsole = {};
        for (let k in console) {
            let func = console[k];
            originalConsole[k] = func;
        }

        for (let k in originalConsole) {
            const origFunc = originalConsole[k];
            let func = origFunc;
            switch (k) {
                case 'clear':
                    func = () => {};
                    break;
                case 'log':
                case 'info':
                case 'warn':
                case 'error':
                    func = (...args) => {
                        const nativeToString = ([]).toString;
                        for (let i of args) {
                            const rawToString = i.toString;
                            rawToString.toString = nativeToString;
                            const targetSourceCode = rawToString.toString();
                            if (targetSourceCode.startsWith('function') && targetSourceCode.indexOf('[native code]') === -1) {
                                console.warn('Some script mabe trying to disable F12 console.');
                                return;
                            }
                        }
                        const executeResult = origFunc.apply(this, args);
                        originalConsole.groupCollapsed('trace for upper log');
                        originalConsole.debug('agrs: ', args);
                        originalConsole.trace(args[0]);
                        originalConsole.groupEnd();
                        return executeResult;
                    };
                    break;
            }
            Object.defineProperty(noWriteAbleConsole, k, {
                get: () => { return func },
                set: (val) => {
                    originalConsole.warn('Some script trying to change console function:');
                    originalConsole.warn(val);
                    return val;
                }
            });
        }
        Object.defineProperty(window, 'console', {
            get: () => { return noWriteAbleConsole },
            set: (val) => {
                originalConsole.warn('Some script trying to change console object:');
                originalConsole.warn(val);
                return val;
            }
        });
        const realWindowEval = window.eval;
        if (localStorage.__disableEvalHook__ !== 'true') {
            window.eval = (func) => {
                if (func.indexOf('debugger') !== -1) {
                    func = func.replace(/debugger?/, 'throw null');
                }
                console.log(func);
                const localEval = realWindowEval;
                const result = localEval.apply(this, [func]);
                return result;
            };
        }
        const origDefineProperty = Object.defineProperty;
        Object.defineProperty = (obj, k, opt) => {
            if (obj === window && k === 'console') {
                originalConsole.warn('Some script trying to change console object:');
                originalConsole.warn(opt);
                return;
            }
            const result = origDefineProperty(obj, k, opt);
            return result;
        };
        const origDefineProperties = Object.defineProperties;
        Object.defineProperties = (obj, opt) => {
            if (obj === window) {
                if (opt.console != null) {
                    delete opt['console'];
                    originalConsole.warn('Some script trying to change console object:');
                    originalConsole.warn(opt);
                }
            }
            const result = origDefineProperties(obj, opt);
            return result;
        };
    } else {
        const originalConsole = {};
        for (let k in console) {
            let func = console[k];
            if (k === 'clear') {
                func = () => {};
            }
            originalConsole[k] = func;
        }

        const setConsoleFunc = () => {
            for (let k in originalConsole) {
                console[k] = originalConsole[k];
            }
        }

        setInterval(() => {
            setConsoleFunc();
        }, 1000);
    }
})();