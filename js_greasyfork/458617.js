// ==UserScript==
// @name         bilibili 多 P 自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  多 P 视频自动跳转到上次观看的视频
// @author       share121
// @match        *://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/458617/bilibili%20%E5%A4%9A%20P%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/458617/bilibili%20%E5%A4%9A%20P%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
(function t(){document.querySelector(".bpx-player-toast-confirm")?.click();setTimeout(t)})();