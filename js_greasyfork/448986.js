// ==UserScript==
// @name         隐藏b站视频结尾的充电鸣谢
// @namespace    /DBI/bilibili-hide-electric-wrap/
// @version      0.1
// @description  隐藏b站视频结尾的充电鸣谢, 见其他脚本好像都失效了, 只好自己写一个了
// @author       DuckBurnIncense
// @match        *://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448986/%E9%9A%90%E8%97%8Fb%E7%AB%99%E8%A7%86%E9%A2%91%E7%BB%93%E5%B0%BE%E7%9A%84%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/448986/%E9%9A%90%E8%97%8Fb%E7%AB%99%E8%A7%86%E9%A2%91%E7%BB%93%E5%B0%BE%E7%9A%84%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.meta.js
// ==/UserScript==

GM_addStyle(`
    .bpx-player-electric-wrap {
        display: none;
    }
`);