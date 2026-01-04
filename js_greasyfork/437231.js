// ==UserScript==
// @name         BiliBili直播网址重定向
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  BiliBili直播网址重定向到旧版直播间
// @author       qiuyue0
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/437231/BiliBili%E7%9B%B4%E6%92%AD%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/437231/BiliBili%E7%9B%B4%E6%92%AD%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

var reg = /(https:\/\/live.bilibili.com)\/(\d+)/;
var match = document.location.href.match(reg);
if(match){
document.location.href = match[1] + "/blanc/" + match[2];
}