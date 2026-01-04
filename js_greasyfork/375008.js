// ==UserScript==
// @icon         http://www.wanke001.com/favicon.ico
// @name         Wanke 10 times speed
// @namespace    https://greasyfork.org/zh-CN/scripts/375008-wanke-10-times-speed
// @version      0.1.2
// @description  玩课网视频十倍速播放自动跳转下一节
// @author       Karen
// @match        http://*.wanke001.com/stu/courseWare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375008/Wanke%2010%20times%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/375008/Wanke%2010%20times%20speed.meta.js
// ==/UserScript==
(function() {
    'use strict';

    window.checkVideo = function() {
        var video = document.getElementById("video_html5_api");
        if(video != null) {
            var duration = video.duration;
            var currentTime = video.currentTime;
            video.playbackRate = 10;
            if(currentTime >= duration / 1.5) {
                $("#next_detail").click();
            }
        } else {
            $("#next_detail").click();
        }
        window.setTimeout("checkVideo()",2000);
    }
    window.setTimeout("checkVideo()", 5000);

})();