// ==UserScript==
// @name               浏览器控制台防检测
// @namespace          https://greasyfork.org/users/667968-pyudng
// @version            0.8
// @description        根据 https://github.com/AEPKILL/devtools-detector 的检测方法进行了一个逆向反检测...需要在哪些网站上运行，自己添加到脚本编辑器-设置-用户包括里面去
// @author             PY-DNG
// @license            MIT
// @match              http*://*/*
// @match              http*://blog.aepkill.com/demos/devtools-detector/
// @require            https://update.greasyfork.org/scripts/456034/1532680/Basic%20Functions%20%28For%20userscripts%29.js
// @grant              GM_registerMenuCommand
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_addElement
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/528267/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8E%A7%E5%88%B6%E5%8F%B0%E9%98%B2%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528267/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8E%A7%E5%88%B6%E5%8F%B0%E9%98%B2%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager queueTask FunctionLoader loadFuncs require isLoaded */

(function __MAIN__() {
    'use strict';

	const CONST = {
		TextAllLang: {
			DEFAULT: 'zh-CN',
			'zh-CN': {}
		}
	};

	// Init language
	const i18n = Object.keys(CONST.TextAllLang).includes(navigator.language) ? navigator.language : CONST.TextAllLang.DEFAULT;
	CONST.Text = CONST.TextAllLang[i18n];

    // As a common dependency for almost all funcs, load it synchrously to execute funcs as soon as poosible
    // If we write utils as a normal func which executes in loadFuncs() and serves as a func module through require('utils'),
    // func that depends on utils must wait until utils load asynchrously, which will takes a lot of time.
    // Execute as soon as possible is essential to ensure we have time advantage agains devtools detectors.
    const utils = (function() {
        const win = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
        const SavedValues = {
            _targets: ['Object', 'Function', 'Symbol', 'Reflect', 'performance', 'setTimeout', 'Proxy'],
            _thiskey: Symbol('SavedValues.this-key'),
            original: {}, // original property descriptors
            bound: {}     // property descriptors with "this" bound for whose value is function
        };
        for (const target_name of SavedValues._targets) {
            const source = win[target_name];
            if (['object', 'function'].includes(typeof source) && source !== null) {
                // Save original
                const obj_original = SavedValues.original[target_name] = { [SavedValues._thiskey]: source };
                const obj_bound = SavedValues.bound[target_name] = {}
                for (const prop of Reflect.ownKeys(source)) {
                    const desc_original = Object.getOwnPropertyDescriptor(source, prop);
                    Object.defineProperty(obj_original, prop, desc_original);
                    const desc_bound = { ...desc_original };
                    if (typeof desc_bound.value === 'function') {
                        desc_bound.value = desc_bound.value.bind(source);
                    }
                    Object.defineProperty(obj_bound, prop, desc_bound);
                }
            } else {
                SavedValues.original[target_name] = source;
                SavedValues.bound[target_name] = source;
            }
        }

        function hook(obj, prop, func) {
            const ori_func = obj[prop];
            const hook_func = obj[prop] = wrap(ori_func, func);

            return {
                hook_func, ori_func, unhook
            };

            function unhook() {
                obj[prop] = ori_func;
            }

            function wrap(ori_func, func) {
                return new SavedValues.original.Proxy[SavedValues._thiskey](ori_func, {
                    apply(target, thisArg, argumentsList) {
                        return func.call(thisArg, target, ...argumentsList);
                    },
                    get(target, prop, receiver) {
                        if (prop === 'toString') {
                            return wrap(target[prop], () => target[prop]());
                        }
                        return target[prop];
                    }
                });
            }
        }

        return { window: win, SavedValues, hook }
    }) ();

    loadFuncs([{
        id: 'log-toString-trap',
        desc: '处理各种通过自定义toString/字符串getter，再log到console的检测方法',
        func() {
            const console = utils.window.console;
            const toStringModified = obj => Function.prototype.toString.call(obj.toString) !== 'function toString() { [native code] }';
            utils.hook(console, 'log', function(log, obj) {
                if (obj instanceof Date && toStringModified(obj)) {
                    DoLog(LogLevel.Success, ['拦截了一次 date-toString-trap']);
                    return log.call(this);
                }
                if (obj instanceof Date && toStringModified(obj)) {
                    DoLog(LogLevel.Success, ['拦截了一次 date-toString-trap']);
                    return log.call(this);
                }
                if (obj instanceof HTMLElement && utils.SavedValues.original.Object.hasOwnProperty.call(obj, 'id')) {
                    DoLog(LogLevel.Success, ['拦截了一次 element-id-trap']);
                    return log.call(this);
                }
                if (obj instanceof Function && toStringModified(obj)) {
                    DoLog(LogLevel.Success, ['拦截了一次 function-toString-trap']);
                    return log.call(this);
                }
                if (obj instanceof RegExp && toStringModified(obj)) {
                    DoLog(LogLevel.Success, ['拦截了一次 regexp-toString-trap']);
                    return log.call(this);
                }

                const args = [...arguments];
                args.shift();
                return log.apply(this, args);
            });
            utils.hook(console, 'table', function(table, obj) {
                for (const prop of utils.SavedValues.bound.Reflect.ownKeys(obj)) {
                    const val = obj[prop];
                    if (val instanceof RegExp && toStringModified(val)) {
                        DoLog(LogLevel.Success, ['拦截了一次 dep-reg-trap']);
                        return table.call(this);
                    }
                }

                const args = [...arguments];
                args.shift();
                return table.apply(this, args);
            });
        }
    }, {
        id: 'time-sync',
        desc: '处理各种利用时间检测的方法；原理是让获取时间的函数在一次事件循环里返回同一个值',
        func() {
            return {
                getTime: {
                    performance: hookTimeFunc(utils.window.performance, 'now'),
                    date: hookTimeFunc(utils.window.Date, 'now'),
                    dateInstance: hookTimeFunc(utils.window.Date, 'getTime', true)
                }
            };

            function hookTimeFunc(obj, funcname, construct=false) {
                // 存储当前事件循环里，performance.time返回的值
                // 确切地说，是从一次work调用到下一次work调用之间，返回相同的值
                let time;

                // hook performance.now，始终返回time的值
                const getTime = construct ?
                      (function() {
                          const func = obj.prototype[funcname];
                          return function() {
                              return func.call(new obj(), ...arguments);
                          };
                      }) () : obj[funcname].bind(obj);

                Object.defineProperty(construct ? obj.prototype : obj, funcname, {
                    get() { return function() { return time; } },
                    set() { return true; },
                });

                // work函数，每次事件循环执行一次，清空
                function work() {
                    const setTimeout = utils.SavedValues.original.setTimeout[utils.SavedValues._thiskey].bind(utils.window);
                    setTimeout(work);
                    time = getTime();
                }
                work();

                return getTime;
            }
        }
    }, {
        id: 'console-no-clear',
        desc: '防止调用console.clear()循环清除控制台',
        func() {
            const console = utils.window.console;
            const clear = console._clear = console.clear;

            // 提供选项彻底禁用console.clear
            let no_clear = isEnabled();
            GM_registerMenuCommand('彻底禁用console.clear', function() {
                no_clear = !no_clear;
                if (no_clear) {
                    enable();
                    console._log(`%c已彻底禁用%cconsole.clear\n%c如需清除控制台，请使用控制台清除按钮，或者调用%cconsole._clear()`, 'color: #66cc00;', 'color: orange;', 'color: #66ccff;', 'color: orange;');
                } else {
                    disable();
                    console._log('%c已重新启用%cconsole.clear', 'color: #66cc00;', 'color: orange;');
                }
            });

            // 自动拦截高频清除
            const min_interval = 750, startup_protection = 5000;
            let last_clear = getTime();
            const hook = utils.hook(console, 'clear', function() {
                const startup_time = getTime();
                const time_past = startup_time - last_clear;
                const can_clear = !no_clear && time_past > min_interval && startup_time > startup_protection;
                can_clear && clear();
                last_clear = startup_time;
            });
            console.log([
                `%c[${GM_info.script.name}] %c已拦截%cconsole.clear%c以防止控制台被高频循环清除`,
                `当%cconsole.clear%c距离上次调用的时间间隔小于%c${ min_interval / 1000 }秒%c时，将不执行清除`,
                `同时，页面加载的%c前${ startup_protection / 1000 }秒%c也不会执行清除`,
                `需要注意的是，当将浏览器/标签页切换到后台时，循环清除任务可能会被浏览器放慢，从而绕过高频清除限制`,
                '',
                `您也可通过手动开启 %c"彻底禁用console.clear"%c 功能彻底禁止%cconsole.clear%c清除控制台`,
                `当前 %c"彻底禁用console.clear"%c 功能%c${ no_clear ? '已开启' : '未开启'}%c`
            ].join('\n'), ...[
                'color: #9999ff;', '',
                'color: orange;', '',
                'color: orange;', '',
                'color: orange;', '',
                'color: orange;', '',
                'color: #cc9966;', '',
                'color: orange;', '',
                'color: #cc9966;', '',
                'color: #66cc00;', ''
            ]);

            return { 
                clear,
                get clear_diabled() { return no_clear; },
                set clear_diabled(val) { (no_clear = val) ? enable() : disable(); }
            }

            // 获取精确的（未被hook修改的）页面加载到现在的时间戳
            function getTime() {
                return isLoaded('time-sync') ? require('time-sync').getTime.performance() : performance.now();
            }

            function getEnabledHostList() {
                const enabled_list = GM_getValue('noclear-hosts', []);
                return enabled_list;
            }

            function saveEnabledHostList(enabled_list) {
                GM_setValue('noclear-hosts', enabled_list);
            }

            function isEnabled() {
                const host = location.host;
                const enabled_list = getEnabledHostList();
                return enabled_list.includes(host);
            }

            function enable() {
                const host = location.host;
                const enabled_list = getEnabledHostList();
                !enabled_list.includes(host) && enabled_list.push(host);
                saveEnabledHostList(enabled_list);
            }

            function disable() {
                const host = location.host;
                const enabled_list = getEnabledHostList();
                enabled_list.includes(host) && enabled_list.splice(enabled_list.indexOf(host), 1);
                saveEnabledHostList(enabled_list);
            }
        }
    }, {
        id: 'console-filter',
        desc: '提供选项供用户拦截控制台日志',
        func() {
            let filter_enabled = isEnabled();
            GM_registerMenuCommand('禁止网页输出日志', function() {
                filter_enabled = !filter_enabled;
                if (filter_enabled) {
                    enable();
                    console._log(`%c已禁止网页输出日志到控制台\n%c如需调用%cconsole.xxx%c输出，请在xxx前加一个下划线%c"_"%c再调用，如 %cconsole._log('Hello, world');`, 'color: #66cc00;', 'color: #66ccff;', 'color: orange;', 'color: #66ccff;', 'color: orange', 'color: #66ccff;', 'color: orange');
                } else {
                    disable();
                    console._log('%c已允许网页输出日志到控制台', 'color: #66cc00;');
                }
            });
            const console = utils.window.console;
            Object.keys(console).forEach(prop => {
                if (['clear', '_clear'].includes(prop)) { return; }
                console['_' + prop] = console[prop];
                utils.hook(console, prop, function(func, ...args) {
                    if (!filter_enabled) {
                        return func.apply(this, args);
                    }
                });
            });

            return {
                get enabled() { return filter_enabled; },
                set enabled(val) { val ? enable() : disable(); }
            };

            function getEnabledHostList() {
                const enabled_list = GM_getValue('filtered-hosts', []);
                return enabled_list;
            }

            function saveEnabledHostList(enabled_list) {
                GM_setValue('filtered-hosts', enabled_list);
            }

            function isEnabled() {
                const host = location.host;
                const enabled_list = getEnabledHostList();
                return enabled_list.includes(host);
            }

            function enable() {
                const host = location.host;
                const enabled_list = getEnabledHostList();
                !enabled_list.includes(host) && enabled_list.push(host);
                saveEnabledHostList(enabled_list);
            }

            function disable() {
                const host = location.host;
                const enabled_list = getEnabledHostList();
                enabled_list.includes(host) && enabled_list.splice(enabled_list.indexOf(host), 1);
                saveEnabledHostList(enabled_list);
            }
        }
    }, {
        id: 'user-code',
        desc: '在文档开始加载时运行用户提供的自定义代码',
        func() {
            // 运行用户代码
            const user_code = getUserCode();
            GM_addElement(document.head, 'script', {
                textContent: user_code
            });

            // 接收用户代码
            GM_registerMenuCommand('自定义用户代码', function() {
                const user_input = prompt('您可以在这里输入一些您自己的javascript代码，脚本会在页面开始加载时执行它', getUserCode());
                if (user_input === null) { return; }
                saveUserCode(user_input);
            });

            function getUserCode() {
                const user_code = GM_getValue('user-code', '');
                return user_code;
            }

            function saveUserCode(user_code) {
                GM_setValue('user-code', user_code);
            }
        }
    }]);
})();