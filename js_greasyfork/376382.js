// ==UserScript==
// @name         Bilibili 一键切换全屏模式(Tab)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  除宽屏外，增加网页全屏和可输入弹幕的网页全屏模式
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376382/Bilibili%20%E4%B8%80%E9%94%AE%E5%88%87%E6%8D%A2%E5%85%A8%E5%B1%8F%E6%A8%A1%E5%BC%8F%28Tab%29.user.js
// @updateURL https://update.greasyfork.org/scripts/376382/Bilibili%20%E4%B8%80%E9%94%AE%E5%88%87%E6%8D%A2%E5%85%A8%E5%B1%8F%E6%A8%A1%E5%BC%8F%28Tab%29.meta.js
// ==/UserScript==

(function() {
    let playerMode = 0
    document.addEventListener('keydown', e => e.keyCode === 9 && player.mode(playerMode = (playerMode + 1) % 4))
})();