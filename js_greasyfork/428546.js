// ==UserScript==
// @name         bilibili播放视频倍速自定义
// @description 12
// @version      0.91
// @include      http*://*bilibili.com/video/*
// @grant        none
// @namespace https://greasyfork.org/users/747939
// @downloadURL https://update.greasyfork.org/scripts/428546/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/428546/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
 
    const THIRD_VIDEO_PLUGIN_DANMU_STATUS = "third_video_plugin_danmu_status";
    const THIRD_VIDEO_PLUGIN_SPEED = "third_video_plugin_speed";
    const THIRD_VIDEO_PLUGIN_SPEEDS = "third_video_plugin_speeds";
 
    let videoSpeedElement = document.createElement("div"),
        currentHref = "",
        viewReportDiv;
    videoSpeedElement.setAttribute("id", "video_speed_div");
 
    let style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = "#video_speed_div button, #third_video_plugin_btn { outline: 0; padding: 3px 5px; margin-left: 10px; background-color: #e2e0e0; border: 0; color: #222; cursor: pointer;} .video_speed_div-button-active { border: 0!important; background-color: #ffafc9!important; color: #fff!important; }";
    document.getElementsByTagName("head").item(0).appendChild(style);
 
    let _interval = setInterval(function () {
        if (document.querySelector(".bb-comment") && document.getElementById("video_speed_div") === null) {
            addSpeedBtns();
        }
    }, 100);
 
    // 默认关闭弹幕
    // setTimeout(function () {
    //     closeDanmu();
    // }, 1500);
 
    // 打开视频默认全屏
    // setTimeout(function() {
    //     fullScreen();
    // }, 500);
 
    function addSpeedBtns() {
        viewReportDiv = document.querySelector("#viewbox_report").querySelector(".video-data:last-child");
        // 创建一个设置倍速的按钮
        let speedsettingsbtn = document.createElement("button");
        speedsettingsbtn.innerHTML = "&nbsp;&nbsp;S&nbsp;&nbsp;";
        speedsettingsbtn.style.backgroundColor = "black";
        speedsettingsbtn.style.color = "white";
        speedsettingsbtn.setAttribute("id", "third_video_plugin_btn");
        speedsettingsbtn.addEventListener("click", speedsettingsevent);
        viewReportDiv.appendChild(speedsettingsbtn);
 
        initBtn();
 
        videoSpeedElement.style.width = "100%";
        videoSpeedElement.style.height = "24px";
 
        viewReportDiv.appendChild(videoSpeedElement);
 
        clearInterval(_interval);
 
        // 加载之间已经设置的速度, 在同一个页面中切换视频后，设置的速度就没了，这里用一个定时器，200ms设置一下
        setInterval(function () {
            let third_video_plugin_speed = localStorage.getItem(THIRD_VIDEO_PLUGIN_SPEED);
            if (!third_video_plugin_speed) {
                third_video_plugin_speed = "1";
                localStorage.setItem(THIRD_VIDEO_PLUGIN_SPEED, third_video_plugin_speed);
            }
            // 设置倍速按钮高亮
            hightlightBtn(third_video_plugin_speed);
 
            let videoObj = document.querySelector("bwp-video") ||  document.querySelector("video");
            if (videoObj) {
                videoObj.playbackRate = third_video_plugin_speed*1;
                
 
                let nextBtn = document.querySelector(".bilibili-player-iconfont-next");
                if (nextBtn) {
                    let currentTime = videoObj.currentTime;
                    let totalTime = videoObj.duration;
                    if (totalTime - currentTime < 0.5) {
                        // 视频还剩500ms的时候自动跳转到下一个视频，防止出现充电界面
                        document.querySelector(".bilibili-player-iconfont-next").click();
                    }
                }
 
                let broswerPath = window.location.href;
                if (currentHref !== broswerPath) {
                    currentHref = broswerPath;
                    pageContentChange();
                }
 
                let switchBtn = document.querySelector(".bilibili-player-video-danmaku-switch");
                if (switchBtn) switchBtn.addEventListener("click", danmuClickHandler, false);
            }
        }, 200);
    }
 
    function danmuClickHandler(e) {
        if (e.isTrusted) {
            let span = document.querySelector(".bilibili-player-video-danmaku-switch>.choose_danmaku");
            if (span.textContent === "开启弹幕") {
                writeDanmuStatus(1);
            } else {
                writeDanmuStatus(2);
            }
        }
    }
 
    function initBtn() {
        let speedArr = getStorageSpeeds();
        if (speedArr.length === 0) {
            speedArr = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];
        }
        for (let i = 0; i < speedArr.length; i++) {
            let speed = speedArr[i];
            let btn = document.createElement("button");
            btn.innerHTML = "x" + speed;
            btn.style.width = "40px";
            btn.setAttribute("id", "third_video_plugin_btn_" + speed);
            btn.addEventListener("click", changeVideoSpeed);
            videoSpeedElement.appendChild(btn);
        }
    }
 
    function getStorageSpeeds() {
        let storageSpeeds = localStorage.getItem(THIRD_VIDEO_PLUGIN_SPEEDS);
        if (!storageSpeeds) return [];
        return storageSpeeds.split(",");
    }
 
    function speedsettingsevent() {
        let a = window.prompt("输入倍速，以英文逗号隔开。", "");
        if (!a) return;
        a = a.replace(/\s+/g, "");
        let speeds = a.split(",");
        for (let i = 0; i < speeds.length; i++) {
            let speed = parseInt(speeds[i]);
            if (isNaN(speed)) return;
        }
        localStorage.setItem(THIRD_VIDEO_PLUGIN_SPEEDS, a);
        // clear btns
        let btns_length = videoSpeedElement.childNodes.length;
        for (let i = 0; i < btns_length; i++) {
            let btn = videoSpeedElement.childNodes[0];
            videoSpeedElement.removeChild(btn);
        }
        let storageSpeed = localStorage.getItem(THIRD_VIDEO_PLUGIN_SPEED);
        if (speeds.indexOf(storageSpeed) === -1) localStorage.setItem(THIRD_VIDEO_PLUGIN_SPEED, "1");
        // add new btns
        initBtn();
    }
 
    function pageContentChange() {
        setTimeout(function () {
            // 弹幕设置
            let storageDanmuStatus = localStorage.getItem(THIRD_VIDEO_PLUGIN_DANMU_STATUS);
            if (!storageDanmuStatus) {
                storageDanmuStatus = 1; // 默认开启
                writeDanmuStatus(1);
            }
            if (parseInt(storageDanmuStatus) !== 1) {
                document.querySelector(".bui-checkbox").click();
            }
        }, 1000);
    }
 
    function writeDanmuStatus(status) {
        if (status === 1 || status === 2) {
            localStorage.setItem(THIRD_VIDEO_PLUGIN_DANMU_STATUS, status);
        }
    }
 
    function changeVideoSpeed(e) {
        let speed = parseFloat(e.target.innerHTML.replace("x", ""));
        localStorage.setItem(THIRD_VIDEO_PLUGIN_SPEED, speed);
        hightlightBtn(speed);
    }
 
    function hightlightBtn(speed) {
        let currentSpeedBtn = document.getElementById("third_video_plugin_btn_" + speed);
        if (currentSpeedBtn && currentSpeedBtn.className.indexOf("video_speed_div-button-active") === -1) {
            for (let i = 0; i < videoSpeedElement.childNodes.length; i++) {
                let btn = videoSpeedElement.childNodes[i];
                btn.setAttribute("class", "");
            }
            currentSpeedBtn.setAttribute("class", "video_speed_div-button-active");
        }
    }
 
    function closeDanmu() {
        document.querySelector(".bui-checkbox").click();
    }
 
    function fullScreen() {
        document.querySelector(".bilibili-player-iconfont-web-fullscreen-off").click();
    }
})();