// ==UserScript==
// @name     移除B站直播间的模糊/马赛克(V0.2)
// @namespace  http://tampermonkey.net/
// @version   0.2
// @description 个别分区的直播间有模糊，其实现在前端，修改即可，代码极简
// @author    half_drop
// @match    https://live.bilibili.com/*
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/486829/%E7%A7%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9A%84%E6%A8%A1%E7%B3%8A%E9%A9%AC%E8%B5%9B%E5%85%8B%28V02%29.user.js
// @updateURL https://update.greasyfork.org/scripts/486829/%E7%A7%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9A%84%E6%A8%A1%E7%B3%8A%E9%A9%AC%E8%B5%9B%E5%85%8B%28V02%29.meta.js
// ==/UserScript==

GM_addStyle(`
   .web-player-module-area-mask{
    opacity: 0
   }
`);