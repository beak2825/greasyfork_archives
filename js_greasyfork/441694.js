// ==UserScript==
// @name         bilibili自动跳过充电页面
// @namespace    http://tampermonkey.net/
// @version      1.20
// @description  自动跳过b站视频播放结束后的5秒充电画面
// @author       WTA104
// @match        https://www.bilibili.com/video/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441694/bilibili%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%85%85%E7%94%B5%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/441694/bilibili%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%85%85%E7%94%B5%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
    if(document.querySelector('bwp-video')){
        document.querySelector('bwp-video').addEventListener('ended', function () {
        document.getElementsByClassName('bpx-player-electric-jump')[0].click();
        }, false);
    }
    else {
        document.querySelector('video').addEventListener('ended', function () {
        document.getElementsByClassName('bpx-player-electric-jump')[0].click();
        }, false);
    }
})();