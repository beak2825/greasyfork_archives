// ==UserScript==
// @name         YouTube Playback Speed Control, can remember. YouTube播放视频倍速自定义，可记忆
// @namespace    UserScriptSpeedControl
// @version      1.0
// @description  Customize playback speed on YouTube videos.
// @author       gosky9
// @match        *://*youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492337/YouTube%20Playback%20Speed%20Control%2C%20can%20remember%20YouTube%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E5%8F%AF%E8%AE%B0%E5%BF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/492337/YouTube%20Playback%20Speed%20Control%2C%20can%20remember%20YouTube%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E5%8F%AF%E8%AE%B0%E5%BF%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let videoSpeedElement;

    setInterval(function () {
        if (location.href.indexOf("short") > -1 || location.href.indexOf("channel") > -1) return;
        if (document.querySelector("#above-the-fold") && document.getElementById("video_speed_div") === null) {
            addSpeedBtn();
            initSpeed();
        }
        setPlaybackRate();

        let skip_ad_btn = document.querySelector(".ytp-ad-skip-button");
        if (skip_ad_btn) {
            skip_ad_btn.click();
        }
    }, 500);

    function addSpeedBtn() {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            #video_speed_div button {
                outline: 0;
                padding: 5px 7px;
                margin-left: 10px;
                background-color: #ede9e9;
                border: 0;
                border-radius: 12px;
                color: #222;
                cursor: pointer;
            }
            #video_speed_div button:first-child { margin-left: 0; }
            #video_speed_div button:hover { background-color: #e2e0e0; }
            .video_speed_div-button-active {
                background-color: #ff0000!important;
                color: #fff!important;
            }`;
        document.getElementsByTagName('head').item(0).appendChild(style);

        videoSpeedElement = document.createElement("div");
        videoSpeedElement.setAttribute("id", "video_speed_div");

        let targetElement = document.querySelector("#above-the-fold");
        targetElement.insertBefore(videoSpeedElement, targetElement.firstChild);
    }

    function initSpeed() {
        let speedArr = getStorageSpeeds();
        updateSpeedButtons(speedArr);
        highlightActiveButton(localStorage.getItem("third_video_plugin_speed"));
    }

    function customSpeedSettingEvent() {
        let userSpeeds = window.prompt("Enter custom speeds, separated by commas (e.g., 0.5,1.25,1.75):", getStorageSpeeds().join(","));
        if (!userSpeeds) return;
        userSpeeds = userSpeeds.split(",").map(speed => parseFloat(speed.trim())).filter(speed => !isNaN(speed));

        localStorage.setItem("third_video_plugin_speeds", userSpeeds.join(","));
        updateSpeedButtons(userSpeeds);
        highlightActiveButton(localStorage.getItem("third_video_plugin_speed"));
    }

    function updateSpeedButtons(speeds) {
        clearSpeedButtons();
        addCustomSpeedButton();

        speeds.forEach(speed => {
            let btn = document.createElement("button");
            btn.innerHTML = "x" + speed;
            btn.id = "speed_btn_" + speed;
            btn.addEventListener("click", () => changeVideoSpeed(speed));
            videoSpeedElement.appendChild(btn);
        });

        highlightActiveButton(localStorage.getItem("third_video_plugin_speed"));
    }

    function clearSpeedButtons() {
        while (videoSpeedElement.firstChild) {
            videoSpeedElement.removeChild(videoSpeedElement.firstChild);
        }
    }

    function addCustomSpeedButton() {
        let customSpeedBtn = document.createElement("button");
        customSpeedBtn.innerHTML = "Custom Speed";
        customSpeedBtn.addEventListener("click", customSpeedSettingEvent);
        videoSpeedElement.appendChild(customSpeedBtn);
    }

    function getStorageSpeeds() {
        let storageSpeeds = localStorage.getItem("third_video_plugin_speeds");
        if (!storageSpeeds) return [0.5, 1, 1.5, 1.75, 2, 2.5, 3];
        return storageSpeeds.split(",").map(speed => parseFloat(speed));
    }

    function setPlaybackRate(speed) {
        let third_video_plugin_speed = speed || localStorage.getItem("third_video_plugin_speed");
        if (!third_video_plugin_speed) return;

        let videoDom = document.querySelector(".html5-main-video");
        if (!videoDom) return;
        videoDom.playbackRate = third_video_plugin_speed;
    }

    function changeVideoSpeed(speed) {
        localStorage.setItem("third_video_plugin_speed", speed);
        setPlaybackRate(speed);
        highlightActiveButton(speed);
    }

    function highlightActiveButton(speed) {
        const buttons = videoSpeedElement.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("video_speed_div-button-active");
            if (buttons[i].id === "speed_btn_" + speed) {
                buttons[i].classList.add("video_speed_div-button-active");
            }
        }
    }
})();
