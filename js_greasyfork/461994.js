// ==UserScript==
// @name         bilibili播放视频倍速播放
// @version      1.0
// @description  b站播放视频倍速播放
// @author       tomoya
// @match        *://*.bilibili.com/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/897910
// @downloadURL https://update.greasyfork.org/scripts/461994/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/461994/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const THIRD_VIDEO_PLUGIN_SPEED = "third_video_plugin_speed";
    const THIRD_VIDEO_PLUGIN_SPEEDS = "third_video_plugin_speeds";
    let timer;
    let timer1 = setInterval(()=>{
        if ((document.querySelector(".bili-comment") || document.querySelector(".bb-comment")) && document.getElementById("video_speed_div") === null) {
            initBtn();
            // 需要定时器，因为b站切换视频不刷新页面。
            fn()
            timer = setInterval(fn, 5000);
            clearInterval(timer1)
        }
    },500)
    function fn() {
        let third_video_plugin_speed = localStorage.getItem(THIRD_VIDEO_PLUGIN_SPEED);
        if (!third_video_plugin_speed) {
            third_video_plugin_speed = "1";
            localStorage.setItem(THIRD_VIDEO_PLUGIN_SPEED, third_video_plugin_speed);
        }
        // 设置倍速按钮高亮
        hightlightBtn(third_video_plugin_speed);
        let videoObj = document.querySelector("video");
        if (!videoObj) videoObj = document.querySelector("bwp-video");
        if (videoObj) {
            videoObj.playbackRate = parseFloat(third_video_plugin_speed);
            if (document.querySelector(".bilibili-player-iconfont-next")) {
                let currentTime = videoObj.currentTime;
                let totalTime = videoObj.duration;
                if (totalTime - currentTime < 0.5)
                    // 视频还剩500ms的时候自动跳转到下一个视频，防止出现充电界面
                    document.querySelector(".bilibili-player-iconfont-next").click();
            }
        }
    }
    let videoSpeedElement = document.createElement("div");

    function de(className){
        let ele = document.querySelector(className);
        if(ele)
            ele.remove()
        else
            return;
    }
    function initBtn() {
        de(".copyright.item");
        de(".dm.item");
        de(".honor.item.honor-rank");
        videoSpeedElement.setAttribute("id", "video_speed_div");
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = "#video_speed_div{background-color:white;} #video_speed_div button,#third_video_plugin_btn_{ outline: 0; padding: 2px 4px; margin-left: 5px; background-color: #e2e0e0; border: 0; color: #222; cursor: pointer;} .video_speed_div-button-active { border: 0!important; background-color: #00AEEC !important; color: #fff!important; }";
        document.getElementsByTagName("head").item(0).appendChild(style);
        videoSpeedElement.setAttribute("style", "margin-left:-60px");
        document.querySelector(".video-data-list").appendChild(videoSpeedElement)
        let speedArr = getStorageSpeeds();
        if (speedArr.length === 0) {
            speedArr = [ 1, 1.8, 2, 2.2, 2.5,2.8, 3.0, 3.2, 3.5, 4, 5, 6, 16];
            localStorage.setItem(THIRD_VIDEO_PLUGIN_SPEEDS, speedArr.join(","));
        }
        for (let i = 0; i < speedArr.length; i++) {
            let speed = speedArr[i];
            let btn = document.createElement("button");
            btn.innerHTML = "x" + speed;
            btn.style.width = "30px";
            btn.setAttribute("id", "third_video_plugin_btn_" + speed);
           // if(i==0){
             //   btn.addEventListener("click", ()=>{
               //     clearInterval(timer)
               // });
           // }else{
                btn.addEventListener("click", changeVideoSpeed);
            //}
            videoSpeedElement.appendChild(btn);
        }
    }
    function getStorageSpeeds() {
        let storageSpeeds = localStorage.getItem(THIRD_VIDEO_PLUGIN_SPEEDS);
        if (!storageSpeeds) return [];
        return storageSpeeds.split(",");
    }
    function changeVideoSpeed(e) {
        let speed = parseFloat(e.target.innerHTML.replace("x", ""));
        localStorage.setItem(THIRD_VIDEO_PLUGIN_SPEED, speed);
        fn();
        hightlightBtn(speed);
    }
    function hightlightBtn(speed) {
        let currentSpeedBtn = document.getElementById("third_video_plugin_btn_" + speed);
        if (currentSpeedBtn && currentSpeedBtn.className.indexOf("video_speed_div-button-active") === -1) {
            for (let i = 0; i < videoSpeedElement.childNodes.length; i++)
                videoSpeedElement.childNodes[i].setAttribute("class", "");
            currentSpeedBtn.setAttribute("class", "video_speed_div-button-active");
        }
    }
})();
