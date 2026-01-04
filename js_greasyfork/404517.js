// ==UserScript==
// @name         bilibili默认关闭弹幕
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    Mayeths
// @version      1.0
// @description  找了网上默认关闭弹幕的脚本，发现都做得太复杂了，就自己写了一个只有几行的就可以很好实现的脚本
// @author       Mayeths
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/watchlater/*
// @match        *://*.bilibili.com/bangumi/play/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/404517/bilibili%E9%BB%98%E8%AE%A4%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/404517/bilibili%E9%BB%98%E8%AE%A4%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

function closeDanMu() {
    const dmswitch = document.querySelector(".bui-checkbox")
    if (dmswitch && !dmswitch.hasAttribute("autoclosed")) {
       dmswitch.click()
       dmswitch.setAttribute("autoclosed", true)
    }
}

(function() {
    'use strict';
    setInterval(closeDanMu, 100)
})();
