// ==UserScript==
// @name         speed
// @namespace    宜宾学院智慧在线课程课程视频加速自动播放
// @description  宜宾学院智慧在线课程课程视频加速自动播放，使用该脚本选择网络较好的情况下进行，最好再连接网线进行学习。每一章节的每类课程视频需要手动切换选择
// @version      1.0.1
// @author       XIAOANDX
// @icon         https://blog.xiaoandx.club/images/avatar.png
// @match        http://mooc.yibinu.edu.cn/study/*
// @downloadURL https://update.greasyfork.org/scripts/426659/speed.user.js
// @updateURL https://update.greasyfork.org/scripts/426659/speed.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        document.querySelector('video').playbackRate = 16;
    },5000);
    var overTime = "1:00";
    window.onload = function(){
        setInterval(()=>{
            var newTime=document.getElementById("mediaplayer_controlbar_elapsed").innerText;
            overTime=document.getElementById("mediaplayer_controlbar_duration").innerText;
            if(overTime != "" && newTime == overTime ){
                document.getElementsByClassName("view-tip")[1].click();
            }
        },7000);
    }
})();

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds) {
        console.log(new Date().getTime());
    }
}

