// ==UserScript==
// @name         BiliBili 3.0X PlayBack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  设置B站默认播放速度为3.0倍
// @author       drlor
// @include      *://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486778/BiliBili%2030X%20PlayBack.user.js
// @updateURL https://update.greasyfork.org/scripts/486778/BiliBili%2030X%20PlayBack.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.querySelector("video:first-child").playbackRate = 3.0;
    var timer = setInterval(function() {
        if(sessionStorage.getItem("bilibili_player_settings") === null) {
            document.querySelector("video:first-child").playbackRate = 3.0;
        } else {
            document.querySelector("video:first-child").playbackRate = 3.0;
            var playSettingObj = JSON.parse(sessionStorage.getItem("bilibili_player_settings"));
            playSettingObj['video_status']['videospeed'] = 3.0;
            sessionStorage.setItem('bilibili_player_settings', JSON.stringify(playSettingObj));
            clearInterval(timer);
        }
    }, 100);
    // Your code here...
})();