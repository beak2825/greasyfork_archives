// ==UserScript==
// @name         绕过加载公告失败的刷新
// @namespace    http://tampermonkey.net/
// @version      2025-02-22
// @license MIT
// @description  绕过加载公告失败的五秒后刷新
// @author       richi-shek
// @match        https://cwm.elysia.rip/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elysia.rip
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527794/%E7%BB%95%E8%BF%87%E5%8A%A0%E8%BD%BD%E5%85%AC%E5%91%8A%E5%A4%B1%E8%B4%A5%E7%9A%84%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/527794/%E7%BB%95%E8%BF%87%E5%8A%A0%E8%BD%BD%E5%85%AC%E5%91%8A%E5%A4%B1%E8%B4%A5%E7%9A%84%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

let a = window.setTimeout
window.setTimeout = function() {
    if(arguments[1]==5e3 && arguments[0].toString()=='()=>{location.href=location.href}')
        return
    return a.apply(window, arguments)
}