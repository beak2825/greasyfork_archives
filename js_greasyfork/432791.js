// ==UserScript==
// @name         移除烦人的弹出层
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  移除了一些弹出的登录页面，比如知乎，未来还有 CSDN 等
// @author       Luoming
// @match        *://www.zhihu.com/*
// @supportURL   https://github.com/Liumingxun/RemoveAnnoyingModal
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABIUExURf///39/fz8/PwAAAGY5OUg9Pf/Ozv8tLf9WVv/09Jtqav/q6v9FRf8jI/9TU/9UVIt2dv9DQ/9RUf9CQv9BQYV6ev/S0plsbGVb0PEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACPSURBVDhP7dPBDsIgEEVRZtoKA4zSWvX//9QGaJtqnzFx46J3w4KTCYRgvoiIQUQZNB/KYGdC2zF37TyBmrKunawTcdbXjXcQop4vGhMEJvSqfZg3doAMqoNgIE6vo7obBHcbQ4j2sYDpPtt8IkqeFwCDE0rrhNcz1PAtagco/ReAz80V4DKYvhasgF8y5gmUZQUDtxtBKwAAAABJRU5ErkJggg==
// @run-at       document-idle
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/432791/%E7%A7%BB%E9%99%A4%E7%83%A6%E4%BA%BA%E7%9A%84%E5%BC%B9%E5%87%BA%E5%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/432791/%E7%A7%BB%E9%99%A4%E7%83%A6%E4%BA%BA%E7%9A%84%E5%BC%B9%E5%87%BA%E5%B1%82.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // document.querySelector("body > div:nth-child(13) > div > div > div")
    window.onload = function () {
        const modal = document.querySelector("body > div:nth-child(13) > div > div > div")
        GM_log('Luoming 2333')
        modal.parentNode.removeChild(modal)
        document.querySelector('html').style.overflow = "scroll"
    }
})();