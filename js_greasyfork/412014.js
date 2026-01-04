// ==UserScript==
// @name         Acfun直播好听机器人
// @description  直播间自动好听好听
// @version      0.0.0.1
// @author       Asroe
// @match        https://live.acfun.cn/live/*
// @run-at       document-start
// @license      GNU General Public License v3.0 or later
// @namespace    https://greasyfork.org/zh-CN/users/685098-asroe
// @downloadURL https://update.greasyfork.org/scripts/412014/Acfun%E7%9B%B4%E6%92%AD%E5%A5%BD%E5%90%AC%E6%9C%BA%E5%99%A8%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/412014/Acfun%E7%9B%B4%E6%92%AD%E5%A5%BD%E5%90%AC%E6%9C%BA%E5%99%A8%E4%BA%BA.meta.js
// ==/UserScript==
let evt = document.createEvent('HTMLEvents')
evt.initEvent('input', true, true)
setInterval(function (){
    document.getElementsByClassName('danmaku-input')[1].value = '好听好听';
    document.getElementsByClassName('danmaku-input')[1].dispatchEvent(evt);
    document.getElementsByClassName('send-btn enable')[0].click();
}, 3000);