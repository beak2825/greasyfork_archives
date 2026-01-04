// ==UserScript==
// @name         源码精灵时间限制解除助手
// @namespace    https://codemao.cn/
// @version      1.4
// @description  解除编程猫“源码精灵”时间限制，为什喵都成年了还要吃健康系统！淦！还是自己动手丰衣足食（bushi），酪灰水平很一般所以脚本很 shi ，如遇到问题，欢迎反馈喔！能教教就更好啦喵！
// @author       NanoRocky & ChatGPT
// @license      MIT
// @match        https://trainer-pc.codemao.cn/*
// @match        https://tob.codemao.cn/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537236/%E6%BA%90%E7%A0%81%E7%B2%BE%E7%81%B5%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/537236/%E6%BA%90%E7%A0%81%E7%B2%BE%E7%81%B5%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function safeToString(fn) {
        try {
            return Function.prototype.toString.call(fn);
        } catch (e) {
            return '';
        }
    }

    Date.prototype.getHours = () => 20;
    Date.prototype.getDay = () => 6;

    const patchLockPanel = () => {
        for (const key in window) {
            const val = window[key];
            if (val && typeof val === 'object') {
                for (const fnKey in val) {
                    const fn = val[fnKey];
                    const fnStr = safeToString(fn);
                    if (
                        typeof fn === 'function' &&
                        (fnStr.includes("现在是休息的时间") ||
                         fnStr.includes("LockType.TimeOut") ||
                         fnStr.includes("PlayedEnough"))
                    ) {
                        val[fnKey] = function () {
                            return;
                        };
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const overrideCanPlay = () => {
        for (const key in window) {
            const val = window[key];
            if (val && typeof val === 'object') {
                for (const fnKey in val) {
                    const fn = val[fnKey];
                    if (typeof fn === 'function' && safeToString(fn).includes("当前不是游戏时间哦")) {
                        val[fnKey] = () => {
                            return true;
                        };
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const overridePlayedTimeLimit = () => {
        for (const key in window) {
            const val = window[key];
            if (val && typeof val === 'object') {
                for (const fnKey in val) {
                    const fn = val[fnKey];
                    if (typeof fn === 'function' && safeToString(fn).includes("你已经玩了 60 分钟了哟")) {
                        val[fnKey] = () => {
                            return false;
                        };
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const patchShowLockPanel = () => {
        for (const key in window) {
            const obj = window[key];
            if (!obj || typeof obj !== 'object') continue;

            for (const fnKey in obj) {
                const fn = obj[fnKey];
                const code = safeToString(fn);
                if (
                    typeof fn === 'function' &&
                    code.includes('lobbyScene/prefab/LockGamePanel') &&
                    code.includes('this._showLockPanel')
                ) {
                    for (const protoKey in obj) {
                        const method = obj[protoKey];
                        const methodCode = safeToString(method);
                        if (methodCode.includes('setLabelByLockType') && methodCode.includes('cc.instantiate')) {
                            obj[protoKey] = async function (type, seconds) {
                                if (type === 2 /* LockType.TimeOut */) {
                                    return;
                                } else {
                                    return await fn.call(this, type, seconds);
                                }
                            };
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };

    const forceUnlockGame = () => {
        for (const key in window) {
            const val = window[key];
            if (val && typeof val === 'object') {
                for (const subKey in val) {
                    if (
                        subKey.toLowerCase().includes('locked') &&
                        typeof val[subKey] === 'boolean' &&
                        val[subKey] === true
                    ) {
                        val[subKey] = false;
                    }
                }
            }
        }
    };

    const overrideLockReq = () => {
        for (const key in window) {
            const val = window[key];
            if (!val || typeof val !== 'object') continue;

            for (const fnKey in val) {
                const fn = val[fnKey];
                const code = safeToString(fn);
                if (
                    typeof fn === 'function' &&
                    code.includes('fetch') &&
                    code.includes('lock') &&
                    code.includes('POST')
                ) {
                    val[fnKey] = async function () {
                        return;
                    };
                    return true;
                }
            }
        }
        return false;
    };

    const overridePlayedTimeSet = () => {
        for (const key in window) {
            const val = window[key];
            if (!val || typeof val !== 'object') continue;

            for (const fnKey in val) {
                const fn = val[fnKey];
                const code = safeToString(fn);
                if (
                    typeof fn === 'function' &&
                    code.includes('setToday') &&
                    code.includes('played') &&
                    code.includes('=')
                ) {
                    val[fnKey] = function () {
                        return;
                    };
                    return true;
                }
            }
        }
        return false;
    };

    const jobs = [
        [patchLockPanel, 10000],
        [overrideCanPlay, 10000],
        [overridePlayedTimeLimit, 10000],
        [patchShowLockPanel, 10000],
        [overrideLockReq, 10000],
        [overridePlayedTimeSet, 10000],
    ];

    for (const [fn, maxTime] of jobs) {
        const timer = setInterval(() => {
            if (fn()) clearInterval(timer);
        }, 200);
        setTimeout(() => clearInterval(timer), maxTime);
    }

    setInterval(forceUnlockGame, 1000);
})();