// ==UserScript==
// @name         PT site auto attendance (self use)
// @namespace    http://tampermonkey.net/
// @version      0.1.17
// @description  每天凌晨0点在pt站点进行签到
// @author       Door Ma
// @match        https://pt.btschool.club/*
// @match        https://kufei.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542263/PT%20site%20auto%20attendance%20%28self%20use%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542263/PT%20site%20auto%20attendance%20%28self%20use%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ptSites = [{
      name: "BTSCHOOL",
      domain: "pt.btschool.club",
      attendenceUrl: "index.php?action=addbonus"
    }, {
      name: "库非",
      domain: "kufei.org",
      attendenceUrl: "attendance.php"
    }];
    
    // 点击签到链接
    async function clickSign(site) {
        const link = document.querySelector('a[href="' + site.attendenceUrl + '"]');
        if (link) {
            link.click();
            console.log('[签到脚本] 已于', new Date().toLocaleString(), '执行点击。');
            localStorage.setItem('checkedDate', new Date().toDateString()); // 标志签到时间
        } else {
            console.warn('[签到脚本] 未找到签到按钮。');
            await wait(1000);
        }
    }

    // 计算下一次触发的延迟（毫秒）
    function getDelayToNextMidnight() {
        const now = new Date();
        const nextMidnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1, // 明天
            0, 0, 45, 0         // 00:00:45.000
        );
        return nextMidnight - now;
    }

    // 点击失败时的重启等待（毫秒）
    async function wait(miliseconds) {
        return new Promise(action => setTimeout(action, miliseconds));
    }
    
    // 首次调度，并在每次触发后重新调度
    async function scheduleDaily() {
        const localPtSiteURL = new URL(window.location.href);
        console.log('[签到脚本] 当前站点', localPtSiteURL.host);
        const localPtSite = ptSites.find(e => e.domain === localPtSiteURL.host);
        console.log('[签到脚本] 当前站点信息', localPtSite);
        while (localStorage.getItem('checkedDate') !== new Date().toDateString()) {
            await clickSign(localPtSite);
        }
        const delay = getDelayToNextMidnight();
        console.log('[签到脚本] 下次将在', delay / 1000 / 60, '分钟后执行签到。');
        setTimeout(() => {
            location.reload();
            scheduleDaily();
        }, delay);
    }

    // 等待页面完全加载后开始调度
    window.addEventListener('load', scheduleDaily);
})();
