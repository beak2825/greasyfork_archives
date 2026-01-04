// ==UserScript==
// @name         每日指定时间自动刷新页面
// @namespace    http://ptlsp.com/
// @version      0.1
// @description  在每天凌晨1点和早上6点自动刷新页面
// @author       PTLSP
// @match        *://*/*
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/488501/%E6%AF%8F%E6%97%A5%E6%8C%87%E5%AE%9A%E6%97%B6%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/488501/%E6%AF%8F%E6%97%A5%E6%8C%87%E5%AE%9A%E6%97%B6%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function scheduleRefresh(hours, minutes) {
        const now = new Date();
        let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        // 如果当前时间已经过了目标时间，则目标时间设为明天
        if (now > target) {
            target.setDate(target.getDate() + 1);
        }
        const timeout = target.getTime() - now.getTime();
        setTimeout(() => {
            window.location.reload();
        }, timeout);
    }

    // 设置在每天凌晨1点自动刷新页面
    scheduleRefresh(1, 0);
    // 设置在每天早上6点自动刷新页面
    scheduleRefresh(6, 0);
})();
