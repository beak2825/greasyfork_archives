// ==UserScript==
// @name         抖音风控绕过
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过代理方式修改 JavaScript 获取到的 accept-language 和 user-agent
// @author       You
// @match        *://*.douyin.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546300/%E6%8A%96%E9%9F%B3%E9%A3%8E%E6%8E%A7%E7%BB%95%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/546300/%E6%8A%96%E9%9F%B3%E9%A3%8E%E6%8E%A7%E7%BB%95%E8%BF%87.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // 固定的值
    const FIXED_ACCEPT_LANGUAGE = 'zh-CN,zh';
    const FIXED_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) douyin/4.4.202 Chrome/104.0.5112.102 Electron/20.1.0-tt.4.release.douyin.195 TTElectron/20.1.0-tt.4.release.douyin.195 Safari/537.36 awemePcClient/4.4.202 buildId/12034427 osName/Windows';
    console.log("记得自己改请求头语言和UA");
    // 保存原始的 navigator 对象
    const originalNavigator = navigator;

    // 创建一个新的 navigator 对象代理
    const navigatorProxy = new Proxy(originalNavigator, {
        get: function(target, prop) {
            // 拦截 acceptLanguage 属性
            if (prop === 'language' || prop === 'languages') {
                if (prop === 'language') {
                    return FIXED_ACCEPT_LANGUAGE.split(',')[0];
                } else if (prop === 'languages') {
                    return FIXED_ACCEPT_LANGUAGE.split(',');
                }
            }

            // 拦截 userAgent 属性
            if (prop === 'userAgent') {
                return FIXED_USER_AGENT;
            }

            // 拦截其他属性
            const value = target[prop];
            if (typeof value === 'function') {
                return value.bind(target);
            }
            return value;
        }
    });

    // 通过 Object.defineProperty 重新定义 navigator
    try {
        Object.defineProperty(window, 'navigator', {
            value: navigatorProxy,
            writable: false,
            configurable: false
        });
    } catch (e) {
        console.warn('无法重新定义 navigator:', e);
    }

    // 重写 Navigator.prototype 的相关属性
    try {
        Object.defineProperty(Navigator.prototype, 'userAgent', {
            get: function() {
                return FIXED_USER_AGENT;
            },
            configurable: false,
            enumerable: true
        });

        Object.defineProperty(Navigator.prototype, 'language', {
            get: function() {
                return FIXED_ACCEPT_LANGUAGE.split(',')[0];
            },
            configurable: false,
            enumerable: true
        });

        Object.defineProperty(Navigator.prototype, 'languages', {
            get: function() {
                return FIXED_ACCEPT_LANGUAGE.split(',');
            },
            configurable: false,
            enumerable: true
        });
    } catch (e) {
        console.warn('无法修改 Navigator.prototype:', e);
    }

    // 拦截 Intl 对象的相关方法
    try {
        const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
        Intl.DateTimeFormat.prototype.resolvedOptions = function() {
            const result = originalResolvedOptions.call(this);
            result.locale = FIXED_ACCEPT_LANGUAGE.split(',')[0];
            return result;
        };
    } catch (e) {
        console.warn('无法修改 Intl.DateTimeFormat:', e);
    }

    // 创建一个更全面的代理对象来处理可能的检测
    const handler = {
        get: function(target, prop) {
            if (prop === 'navigator') {
                return navigatorProxy;
            }
            return target[prop];
        }
    };

    // 尝试代理 window 对象
    try {
        const windowProxy = new Proxy(window, handler);
        // 这里不直接替换 window，因为可能会导致问题
        // 而是通过其他方式增强检测绕过
    } catch (e) {
        console.warn('无法创建 window 代理:', e);
    }

    console.log('Accept-Language 和 User-Agent 修改完成');
    console.log('当前 User-Agent:', navigator.userAgent);
    console.log('当前 Language:', navigator.language);
})();