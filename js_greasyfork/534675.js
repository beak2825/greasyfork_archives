// ==UserScript==
// @name         idrivesafely autoskip with video play
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically skips through the course, submits answers, and plays videos.
// @author       idk
// @match        https://app.idrivesafely.com/courseflow/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534675/idrivesafely%20autoskip%20with%20video%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/534675/idrivesafely%20autoskip%20with%20video%20play.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        // 自动点击“下一步”按钮
        var nextButton = document.getElementsByClassName("icon gritIcon--arrow-right")[0];
        if (nextButton) {
            nextButton.click();
        }

        // 自动播放视频
        var videoElement = document.getElementsByClassName("vjs-tech")[0];
        if (videoElement) {
            videoElement.muted = true;  // 静音
            videoElement.play();         // 播放
        }
    }, 1000);
})();
