// ==UserScript==
// @name         云学堂文档课学习加速（2倍速 + 每10秒提交）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  文档课2倍速倒计时 + 自动10秒提交进度 + 跳过心跳提示
// @match        https://asiainfo.yunxuetang.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544802/%E4%BA%91%E5%AD%A6%E5%A0%82%E6%96%87%E6%A1%A3%E8%AF%BE%E5%AD%A6%E4%B9%A0%E5%8A%A0%E9%80%9F%EF%BC%882%E5%80%8D%E9%80%9F%20%2B%20%E6%AF%8F10%E7%A7%92%E6%8F%90%E4%BA%A4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544802/%E4%BA%91%E5%AD%A6%E5%A0%82%E6%96%87%E6%A1%A3%E8%AF%BE%E5%AD%A6%E4%B9%A0%E5%8A%A0%E9%80%9F%EF%BC%882%E5%80%8D%E9%80%9F%20%2B%20%E6%AF%8F10%E7%A7%92%E6%8F%90%E4%BA%A4%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[学习加速脚本] 正在初始化...');

    const waitFor = (condFn, callback, timeout = 10000) => {
        const start = Date.now();
        const timer = setInterval(() => {
            if (condFn()) {
                clearInterval(timer);
                callback();
            } else if (Date.now() - start > timeout) {
                clearInterval(timer);
                console.warn('[学习加速脚本] 条件等待超时');
            }
        }, 100);
    };

    // 等待页面中 countDown 函数被定义
    waitFor(() => typeof window.countDown === 'function', () => {
        console.log('[学习加速脚本] 尝试覆盖 countDown 函数为 2 倍速版本...');

        const originalCountDown = window.countDown;
        window.countDown = function (a, b) {
            clearInterval(window.timer);

            console.log('[学习加速脚本] countDown 已被加速处理');
            let c = 2; // 2倍速
            a = parseInt(a / c);

            window.timer = setInterval(function () {
                window.timerCount = (window.timerCount || 0) + 1;
                window.heartNum = (window.heartNum || 0) + 1;
                window.reZero = (window.reZero || 0) + 1;
                window.phaseTrackIntervalNum = (window.phaseTrackIntervalNum || 0) + 1;
                window.actualStudyHours = (window.actualStudyHours || 0) + 1;
                --a;

                if (typeof b === 'function') {
                    const days = Math.floor(a / 86400);
                    const hours = Math.floor((a % 86400) / 3600);
                    const minutes = Math.floor((a % 3600) / 60);
                    const seconds = a % 60;

                    let f = '';
                    if (days > 0) f += days + '天';
                    if (hours > 0) f += hours + '小时';
                    if (minutes > 0) f += minutes + '分';
                    if (seconds >= 0) f += seconds + '秒';

                    b(f);
                }

                // 提交进度或心跳
                if (window.reZero >= window.validtimeSpan) {
                    window.reZero = 0;
                    window.heartNum = 0;
                    if (typeof submitStudy === 'function') submitStudy();
                } else if (window.heartNum >= window.heartbeatTime) {
                    window.heartNum = 0;
                    if (typeof checkHeart === 'function') checkHeart(() => {});
                }

                if (a <= 0) clearInterval(window.timer);
            }, 1000);
        };

        console.log('[学习加速脚本] 成功覆盖 countDown()！');
    });

    // 设置为每10秒提交一次进度
    waitFor(() => typeof window.validtimeSpan !== 'undefined', () => {
        window.validtimeSpan = 10;
        console.log('[学习加速脚本] 已设置 validtimeSpan = 10 秒');
    });

    // 跳过心跳提示（iframe遮罩）
    waitFor(() => typeof window.showHeartTip === 'function', () => {
        const originalShowHeartTip = window.showHeartTip;
        window.showHeartTip = function (msg) {
            console.log('[学习加速脚本] 拦截 showHeartTip，自动继续学习');
            if (typeof learnKng === 'function') {
                learnKng(); // 自动继续
            }
        };
    });
})();
