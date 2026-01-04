// ==UserScript==
// @name         跳过视频片头
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  片头开始播放时，按 J 或者 Enter 跳过片头（播放进度前进90秒）
// @author       millylee
// @match        *://www.555flp.com/*
// @icon         https://www.555flp.com/favicon.ico
// @grant        none
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/451305/%E8%B7%B3%E8%BF%87%E8%A7%86%E9%A2%91%E7%89%87%E5%A4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/451305/%E8%B7%B3%E8%BF%87%E8%A7%86%E9%A2%91%E7%89%87%E5%A4%B4.meta.js
// ==/UserScript==

// 键码
var keyCodeJ = 74;
var keyCodeEnter = 13
var OPTime = 120; //片头长度
var RecTime = 1; //反应时间

//allowed用于防止按键一直按着进度条一直跳的情况
var allowed = true;
window.document.onkeydown=function(event) {
    if (event.repeat != undefined) {
        allowed = !event.repeat;
    }
    if (!allowed){
        return;
    }
    allowed = false;
    if(event.keyCode == keyCodeJ|| event.keyCode == keyCodeEnter){
        var video = document.querySelector(".player-box-main video");
        if(video.currentTime>=1){
            video.currentTime += (OPTime-RecTime);
        }else{
            video.currentTime += OPTime;
            video.play();
        }
    }
};