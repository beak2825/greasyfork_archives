// ==UserScript==
// @name         自动打开网址E.YaqaL7x6Dg5C:
// @namespace    https://greasyfork.org/zh-CN/scripts/525406
// @license MIT
// @version      0.3
// @description  自动跳转到指定页面并平滑滚动到底部，定时器在每天的19:05基础上上下偏移40分钟
// @author       KERUA
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/525406/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E7%BD%91%E5%9D%80EYaqaL7x6Dg5C%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/525406/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E7%BD%91%E5%9D%80EYaqaL7x6Dg5C%3A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetUrl = 'https://mbb.eet-china.com/home/me-3994714.html';
    const baseHour = 19; // 基础小时：19点
    const baseMinute = 5; // 基础分钟：5分
    const offsetMinutes = 40; // 上下偏移范围：40分钟

    let menu1 = GM_registerMenuCommand('开始', function () {
        window.location.href = targetUrl;
    });

    // 设置定时器，在每天的19:05基础上上下偏移40分钟重启脚本（24小时制）
    function scheduleRestart() {
        const now = new Date();
        let nextRunTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            baseHour,
            baseMinute,
            0,
            0
        );

        // 计算上下偏移的时间
        const randomOffset = Math.floor(Math.random() * (offsetMinutes * 2 + 1)) - offsetMinutes;
        nextRunTime.setMinutes(nextRunTime.getMinutes() + randomOffset);

        // 如果当前时间已经过了今天的目标时间，则将目标时间设为明天同一时间
        if (now.getTime() >= nextRunTime.getTime()) {
            nextRunTime.setDate(nextRunTime.getDate() + 1);
        }

        // 计算距离下次启动的时间差（毫秒）
        const timeUntilNextRun = nextRunTime.getTime() - now.getTime();

        // 设置定时器
        setTimeout(() => {
            restartScript();
            scheduleRestart(); // 递归调用以持续调度
        }, timeUntilNextRun);
    }

    function restartScript() {
        location.href = targetUrl; // 跳转到指定页面
    }

    // 实现平滑滚动到页面底部的函数
    function smoothScrollToBottom() {
        document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    // 在页面加载完成后执行平滑滚动到底部的操作，但仅限于目标页面
    window.addEventListener('load', function() {
        if (window.location.href === targetUrl) {
            smoothScrollToBottom();
        }
    });

    // 启动定时器
    scheduleRestart();
})();



