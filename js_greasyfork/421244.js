// ==UserScript==
// @name         去除Bilibili/b站播放时关注弹窗
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去除b站播放中的关注、三连弹窗
// @author       xianfei
// @match        *://*.bilibili.com/video/*
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421244/%E5%8E%BB%E9%99%A4Bilibilib%E7%AB%99%E6%92%AD%E6%94%BE%E6%97%B6%E5%85%B3%E6%B3%A8%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/421244/%E5%8E%BB%E9%99%A4Bilibilib%E7%AB%99%E6%92%AD%E6%94%BE%E6%97%B6%E5%85%B3%E6%B3%A8%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

setInterval(function() {
    for (var e of document.getElementsByClassName("bpx-player-cmd-dm-wrap")){
        e.remove();
    }
}, 100)