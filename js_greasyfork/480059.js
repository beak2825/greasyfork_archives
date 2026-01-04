// ==UserScript==
// @name         进入B站封禁直播间
// @description  进入B站封禁直播间，直接启用脚本，打开封禁直播间链接即可。仅支持PC端，进不去多刷新几次。
// @namespace    undefined
// @version      0.3
// @author       dice
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/480059/%E8%BF%9B%E5%85%A5B%E7%AB%99%E5%B0%81%E7%A6%81%E7%9B%B4%E6%92%AD%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/480059/%E8%BF%9B%E5%85%A5B%E7%AB%99%E5%B0%81%E7%A6%81%E7%9B%B4%E6%92%AD%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('call function');
    const timer0 = setInterval(() => {
        if (!window.__NEPTUNE_IS_MY_WAIFU__) {
            return;
        }
        const now = new Date().getTime();
        const { lock_till, is_locked } = window.__NEPTUNE_IS_MY_WAIFU__.roomInitRes.data;
        console.log('封禁信息：', is_locked ? '已封禁' : '未被封禁');
        const lockEnd = new Date(lock_till * 1000);
        const DD = String(lockEnd.getDate()).padStart(2, '0'); // 获取日
        const MM = String(lockEnd.getMonth() + 1).padStart(2, '0'); //获取月份，1 月为 0
        const yyyy = lockEnd.getFullYear(); // 获取年

        // 时间
        const hh = String(lockEnd.getHours()).padStart(2, '0'); //获取当前小时数(0-23)
        const mm = String(lockEnd.getMinutes()).padStart(2, '0'); //获取当前分钟数(0-59)
        const ss = String(lockEnd.getSeconds()).padStart(2, '0'); //获取当前秒数(0-59)
        const lockEndTime = yyyy + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
        console.log(lock_till * 1000 > now ? '封禁到：' + lockEndTime : '');
        window.__NEPTUNE_IS_MY_WAIFU__.roomInitRes.data.is_locked = false;
        clearInterval(timer0);
    }, 0);
})();
