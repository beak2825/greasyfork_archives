// ==UserScript==
// @name         腾讯视频跳过片头
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  视频开始播放时，按 J 或者 Enter 跳过片头
// @author       PLAY
// @match        *://v.qq.com/*
// @icon         https://v.qq.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403400/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/403400/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4.meta.js
// ==/UserScript==

//按J或Enter跳过一定时间
//看动漫总是好长的的片头手动点太烦

// 键码
var keyCodeJ = 74;
var keyCodeEnter = 13
var SkipTime = 90; //片头长度

//allowed用于防止按键一直按着进度条一直跳的情况
var allowed = true;
window.document.onkeydown=function(event) {
    if (event.repeat !== undefined) {
        allowed = !event.repeat;
    }
    if (!allowed){
        return;
    }
    allowed = false;
    if(event.keyCode == keyCodeJ|| event.keyCode == keyCodeEnter){
        //var video = document.querySelector(".txp_video_container.txp_video_fit_cover video");
        var video = document.querySelector("video[src]");
        video.currentTime += SkipTime;
        video.play();
    }
};