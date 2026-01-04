// ==UserScript==
// @name         BiliBili 1.5X PlayBack
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  设置B站默认播放速度为1.5倍
// @author       Aqua
// @include      *://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406287/BiliBili%2015X%20PlayBack.user.js
// @updateURL https://update.greasyfork.org/scripts/406287/BiliBili%2015X%20PlayBack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("video:first-child").playbackRate = 1.5;
    var timer = setInterval(function() {
        if(sessionStorage.getItem("bilibili_player_settings") === null) {
            document.querySelector("video:first-child").playbackRate = 1.5;
        } else {
            document.querySelector("video:first-child").playbackRate = 1.5;
            var playSettingObj = JSON.parse(sessionStorage.getItem("bilibili_player_settings"));
            playSettingObj['video_status']['videospeed'] = 1.5;
            sessionStorage.setItem('bilibili_player_settings', JSON.stringify(playSettingObj));
            console.log('abc');
            clearInterval(timer);
        }
    }, 200);
    // Your code here...
})();
