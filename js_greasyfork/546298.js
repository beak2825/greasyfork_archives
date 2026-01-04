// ==UserScript==
// @name         csdn风控绕过
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  伪装成微信+伪造指纹罢了
// @author       You
// @match        *://*.csdn.net/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546298/csdn%E9%A3%8E%E6%8E%A7%E7%BB%95%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/546298/csdn%E9%A3%8E%E6%8E%A7%E7%BB%95%E8%BF%87.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        const pageText = document.body.innerText || document.body.textContent;
        const hasKeyword = pageText.toLowerCase().includes("很抱歉，您访问的网站已开启安全防御，请完成 “安全验证” 后继续访问");
        if (hasKeyword) {
            location.reload();
        }
    });
    if (document instanceof XMLDocument) {
        return;
    }

    const toBlob = HTMLCanvasElement.prototype.toBlob;
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;

    HTMLCanvasElement.prototype.htGfd = function () {
        const { width, height } = this;
        const context = this.getContext('2d');
        const shift = {
            'r': Math.floor(Math.random() * 10) - 5,
            'g': Math.floor(Math.random() * 10) - 5,
            'b': Math.floor(Math.random() * 10) - 5
        };
        const matt = context.getImageData(0, 0, width, height);
        for (let i = 0; i < height; i += 3) {
            for (let j = 0; j < width; j += 3) {
                const n = ((i * (width * 4)) + (j * 4));
                matt.data[n + 0] = matt.data[n + 0] + shift.r;
                matt.data[n + 1] = matt.data[n + 1] + shift.g;
                matt.data[n + 2] = matt.data[n + 2] + shift.b;
            }
        }
        context.putImageData(matt, 0, 0);
        this.htGfd = () => {
            window.top.postMessage('htGfd-called', '*');
        };
        window.top.postMessage('htGfd-called', '*');
    };

    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function () {
            if (document.documentElement.dataset.htgfd !== 'false') {
                this.htGfd();
            }
            return toBlob.apply(this, arguments);
        }
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
        value: function () {
            if (document.documentElement.dataset.htgfd !== 'false') {
                this.htGfd();
            }
            return toDataURL.apply(this, arguments);
        }
    });
    document.documentElement.dataset.htGfd = true;
    // 固定的值
    const FIXED_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63090a13) UnifiedPCWindowsWechat(0xf2540615) XWEB/16133 Flue';

    // 保存原始的 navigator 对象
    const originalNavigator = navigator;

    // 创建一个新的 navigator 对象代理
    const navigatorProxy = new Proxy(originalNavigator, {
        get: function (target, prop) {

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
            get: function () {
                return FIXED_USER_AGENT;
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
        Intl.DateTimeFormat.prototype.resolvedOptions = function () {
            const result = originalResolvedOptions.call(this);
            return result;
        };
    } catch (e) {
        console.warn('无法修改 Intl.DateTimeFormat:', e);
    }

    // 创建一个更全面的代理对象来处理可能的检测
    const handler = {
        get: function (target, prop) {
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

    console.log(' User-Agent 修改完成');
    console.log('当前 User-Agent:', navigator.userAgent);
})();