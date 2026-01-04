// ==UserScript==
// @name         B站直播原画签到
// @namespace    http://tampermonkey.net/
// @version      3.0.2
// @description  B站:直播间自动签到+自动切最高画质
// @author       似血
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com//favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/444716/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%8E%9F%E7%94%BB%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/444716/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%8E%9F%E7%94%BB%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
fetch('https://api.live.bilibili.com/xlive/web-ucenter/v1/sign/DoSign', { credentials: 'include' })
window.top.livePlayer.switchQuality('10000')
