// ==UserScript==
// @name         哔哩哔哩(bilibili.com)番剧跳过片头
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  片头开始播放时，按 J 或者 Enter 跳过片头（播放进度前进90秒）
// @author       zhpjy
// @match        *://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/377235/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28bilibilicom%29%E7%95%AA%E5%89%A7%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/377235/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28bilibilicom%29%E7%95%AA%E5%89%A7%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4.meta.js
// ==/UserScript==

//片头分为两种情况
//一种是一开头就是片头，按J或Enter就可以精确地让进度条前进90秒
//第二种是播放一段后然后才是90秒的片头，按J或Enter跳过片头时间长度减去反应时间的差
//第三种片头不是90秒的就没法了哈哈哈

// 键码
var keyCodeJ = 74;
var keyCodeEnter = 13
var OPTime = 90; //片头长度
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
        var video = document.querySelector("#bilibili-player video");
        if(video.currentTime>=1){
            video.currentTime += (OPTime-RecTime);
        }else{
            video.currentTime += OPTime;
            video.play();
        }
    }
};