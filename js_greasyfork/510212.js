// ==UserScript==
// @name         讯飞星火大模型反反调试(F12控制台)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  讯飞星火大模型反反调试，解决打开控制台跳转about:blank，解决控制台日志被定时清理。
// @author       XAGU
// @match        *://xinghuo.xfyun.cn/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510212/%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%AB%E5%A4%A7%E6%A8%A1%E5%9E%8B%E5%8F%8D%E5%8F%8D%E8%B0%83%E8%AF%95%28F12%E6%8E%A7%E5%88%B6%E5%8F%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/510212/%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%AB%E5%A4%A7%E6%A8%A1%E5%9E%8B%E5%8F%8D%E5%8F%8D%E8%B0%83%E8%AF%95%28F12%E6%8E%A7%E5%88%B6%E5%8F%B0%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 保存原始的 Reflect.construct
    const originalConstruct = Reflect.construct;

    // 重写 Reflect.construct
    Reflect.construct = function (target, args, newTarget) {
        if (target.prototype.onDevToolOpen != undefined) {
            console.log('拦截检测创建:', target, args, newTarget);
            if (args.length == 1) {
                //设置为不启用
                args[0].enabled = false;
            }
        }
        // 调用原始的 Reflect.construct
        return originalConstruct.apply(this, arguments);
    };

    //定时检测
    const originalSetInterval = window.setInterval;

    window.setInterval = function (callback, delay, ...args) {
        if (callback.toString().includes('ondevtoolclose')) {
            console.log('拦截检测创建：', callback, delay, ...args);
            return;
        }
        return originalSetInterval.call(window, callback, delay, ...args);
    };

})();
