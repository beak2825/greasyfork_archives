// ==UserScript==
// @name         Pter Show Stats Change
// @namespace    https://pterclub.com/forums.php?action=viewforum&forumid=25
// @version      1.0.0
// @description  在首页展示自从上次登录以来的数据变化
// @author       fyzzy1943
// @license MIT
// @match        https://pterclub.com/index.php
// @icon         https://pterclub.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/447725/Pter%20Show%20Stats%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/447725/Pter%20Show%20Stats%20Change.meta.js
// ==/UserScript==

// thx SB100 for GGn_Show_Stats_Change_News_Item.js


// 缓存最小间隔时间 毫秒 10分钟
const CACHE_TIME = 1000 * 60 * 1 * 10;


const SIZE_TYPES = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];


function getStatsFromHtml() {
    const ratio = parseFloat(document.querySelector('.color_ratio').nextSibling.textContent);
    // console.log(ratio);
    const up = toBytes(document.querySelector('.color_uploaded').nextSibling.textContent);
    // console.log(up);
    const down = toBytes(document.querySelector('.color_downloaded').nextSibling.textContent);
    // console.log(down);
    const goldMatch = document.querySelector('.color_bonus').parentElement.nextSibling.nextSibling.nextSibling.textContent.match(/[\d\,]+/);
    const gold = parseFloat(goldMatch && goldMatch[0].replaceAll(',', ''));
    // console.log(gold);

    return {
        ratio: isNaN(ratio) ? 0 : ratio,
        up: isNaN(up) ? 0 : up,
        down: isNaN(down) ? 0 : down,
        gold: isNaN(gold) ? 0 : gold,
        time: (new Date).getTime()
    }
}

function toBytes(s, decimals = 2) {
    const typeMatch = s.match(/[\d,]+\s([\w]+)/);
    const type = typeMatch && typeMatch.length >= 2 && typeMatch[1].toUpperCase();

    // unknown type
    if (!SIZE_TYPES.includes(type)) {
        return 0;
    }

    const currentSizeIndex = SIZE_TYPES.findIndex(size => size === type);
    const desiredSizeIndex = 0;
    const size = parseFloat(s.replace('/,/g', ''));

    return parseFloat(
        (size * 1000 ** (currentSizeIndex - desiredSizeIndex)).toFixed(decimals)
    );
}

function formatBytes(bytes) {
    if (bytes === 0) {
        return '0.00';
    }

    const isNegative = bytes < 0;

    for (let i = 1; i < SIZE_TYPES.length - 1; i += 1) {
        const size = Math.abs(bytes) / 1024 ** i;
        if (size < 1) {
            return `${isNegative ? '-' : ''}${(Math.abs(bytes) / 1024 ** (i - 1)).toFixed(2)} ${SIZE_TYPES[i - 1]}`;
        }
    }

    return '0.00';
}

function msToTime(s) {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    s = (s - mins) / 60;
    const hrs = s % 60;
    s = (s - hrs) / 24;
    const days = s % 24;

    return `${days > 0 ? `${days} 天 ` : ''}${hrs > 0 ? `${hrs} 小时 ` : ''}${mins > 0 ? `${mins} 分钟 ` : ''}${secs > 0 ? `${secs} 秒 ` : ''}`;
}

function displayDelta(change) {
    const timeDiff = (new Date).getTime() - change.generated;

    const mainColumn = document.querySelector('#outer .embedded');
    const changeElem = document.createElement('table');
    changeElem.style.width = '100%';
    changeElem.innerHTML = `
        <tbody>
            <tr><td>
                <h2 style = 'display:inline'>自打上次以来</h2>
                <span ${timeDiff > 1000 ? `title="Values have been cached for ${msToTime(timeDiff)}"` : ''}>
                    ( 与 ${msToTime(change.time)} 前比较 ${timeDiff > 1000 ? '*' : ''} )
                </span>
            </td></tr>
            <tr><td>
                上传增加：${formatBytes(change.up)} &nbsp;
                下载增加：${formatBytes(change.down)} &nbsp;
                上传-下载：${formatBytes(change.up - change.down)} &nbsp;
                分享率增加：${(change.ratio).toFixed(3)} &nbsp;
                猫粮增加：${change.gold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </td></tr>
        </tbody>
      `;

    mainColumn.prepend(changeElem);
}

(function () {
    'use strict';

    const newStats = getStatsFromHtml();
    // console.log(newStats);

    const catchStats = GM_getValue('old_stats');
    const oldStats = catchStats ? catchStats : newStats;
    // console.log(oldStats);

    const change = {
        up: newStats.up - oldStats.up,
        down: newStats.down - oldStats.down,
        ratio: newStats.ratio - oldStats.ratio,
        gold: newStats.gold - oldStats.gold,
        time: newStats.time - oldStats.time,
        generated: newStats.time
    }

    if (!catchStats || (new Date).getTime() - oldStats.time > CACHE_TIME) {
        GM_setValue('old_stats', newStats);
    }

    displayDelta(change);

})();
