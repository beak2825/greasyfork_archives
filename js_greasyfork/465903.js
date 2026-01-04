// ==UserScript==
// @name         HuYa & Star Rail auto receive reward
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动领取直播奖励
// @author       SCate
// @match        https://zt.huya.com/20d10b70/pc/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huya.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465903/HuYa%20%20Star%20Rail%20auto%20receive%20reward.user.js
// @updateURL https://update.greasyfork.org/scripts/465903/HuYa%20%20Star%20Rail%20auto%20receive%20reward.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = () => {
    const startTime = '02:00:00';
    const endTime = '02:20:00';
    const retestTime = 1 * 60 * 1000;
    const loadDelay = 2 * 1000;

    const styleEL = document.createElement('style');
    styleEL.type = 'text/css';
    styleEL.innerHTML = '.diy-modal{user-select: auto!important;}'
    document.head.appendChild(styleEL)

    const delay = (cb, time) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const res = cb();
                resolve(res);
            },time || loadDelay)
        }).catch(() => {
            console.log('error');
            return delay(cb);
        })
    }
    const autoReceive = () => {
        const buttonList = document.querySelectorAll('.task-exp + div');
        Array.from(buttonList).forEach(el => {
            if (el.innerText !== '领取') return;
            el.click();
        })
    }
    const run = () => {
        /**
        return delay(() => {
            const tab = document.querySelectorAll('.pos .item')[1]
            if (!tab) return Promise.reject();
            tab.click();
        }).then(() => delay(() => {
            const tab = document.querySelectorAll('.diy-manual-link .tab-item')[1]
            if (!tab) return Promise.reject();
            tab.click();
        })).then(() => delay(autoReceive))
        */
        return delay(() => {
            const tab = document.querySelectorAll('.pos .item')[1]
            if (!tab) return Promise.reject();
            tab.click();
        }).then(() => delay(autoReceive, 10 * 1000))
    }
    const writeCount = (logName) => {
        const count = localStorage.getItem(logName) || 0
        localStorage.setItem(logName, Number(count) + 1)
    }
    const [startHour, startMin] = startTime.split(':');
    const [endHour, endMin] = endTime.split(':');
    const checkTime = () => {
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();
        let inRange = false;
        if (hour < startHour || hour > endHour) {
            inRange = false;
        } else if (hour === startHour) {
            inRange = min >= startMin
        } else if (hour === endHour) {
            inRange = min <= endMin
        } else {
            inRange = true;
        }
        writeCount('checkTime')
        if (inRange) {
            writeCount('reload')
            setTimeout(() => {
                location.reload()
            }, retestTime)
        } else {
            setTimeout(checkTime, retestTime)
        }
    }
    run().then(checkTime);
    }
})();