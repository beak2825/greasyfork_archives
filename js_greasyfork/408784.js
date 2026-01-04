// ==UserScript==
// @name         BiliBiliVideoSpeed
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  调整B站视频速度
// @author       Eilen https://github.com/EilenC
// @include      https://*.bilibili.com/*
// @match        https://www.bilibili.com/video/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408784/BiliBiliVideoSpeed.user.js
// @updateURL https://update.greasyfork.org/scripts/408784/BiliBiliVideoSpeed.meta.js
// ==/UserScript==

(function() {
    var video = document.getElementsByTagName("video")[0];

    function keyd(e){
        console.log(e.key);
        var speedLabel = document.getElementsByClassName('bilibili-player-video-btn-speed-name')[0];
        var speed = 1;
        if(e.key == "+"){
            speed = video.playbackRate + 0.20;
            video.playbackRate = speed.toFixed(3);
            console.log(video.playbackRate);
        }else if(e.key == "-"){
            speed = video.playbackRate - 0.20;
            video.playbackRate = speed.toFixed(3);
            console.log(video.playbackRate);
        }
        speedLabel.innerHTML=video.playbackRate+"x";
    }
    document.body.removeEventListener('keydown', keyd);
    document.body.addEventListener('keydown', keyd);
    // Your code here...
})();