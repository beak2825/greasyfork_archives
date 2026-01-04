// ==UserScript==
// @name         bilibili播放视频倍速自定义，可记忆，简化版
// @description  bilibili播放视频倍速自定义，刷新浏览器也不会丢失之前设置的速度
// @namespace    bilibiliVideoSpeed1
// @version      2.1.7
// @author       echo
// @icon         https://static.hdslb.com/images/favicon.ico
// @match        https://www.bilibili.com/bangumi/*
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @sandbox      JavaScript
// @compatible   firefox
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/507332/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E5%8F%AF%E8%AE%B0%E5%BF%86%EF%BC%8C%E7%AE%80%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/507332/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E5%8F%AF%E8%AE%B0%E5%BF%86%EF%BC%8C%E7%AE%80%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const THIRD_VIDEO_PLUGIN_SPEED = "third_video_plugin_speed";
    const THIRD_VIDEO_PLUGIN_SPEEDS = "third_video_plugin_speeds";

    const videoSpeedElement = document.createElement("div");
    videoSpeedElement.id = "video_speed_div";

    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = `
      .video-info-container, #viewbox_report {
        height: auto!important;
      }
      #video_speed_div {
        width: 100%;
        height: 24px;
        margin: 8px 0;
      }
      #video_speed_div button, #third_video_plugin_btn {
        outline: 0;
        padding: 4px 9px;
        margin-left: 10px;
        background-color: #f1f2f3;
        border: 0;
        color: #222;
        cursor: pointer;
        border-radius: 6px;
      }
      #third_video_plugin_btn:first-child {
        margin-left: 0;
        background-color: #000!important;
      }
      .video_speed_div-button-active {
        border: 0!important;
        background-color: #00aeec!important;
        color: #fff!important;
      }
    `;
    document.head.appendChild(style);

    let keypressed = false;
    document.addEventListener("keydown", e => keypressed = !!e.keyCode);
    document.addEventListener("keyup", e => keypressed = false);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                const hasComments = document.querySelector("bili-comments") ||
                                    document.querySelector(".bili-comment") ||
                                    document.querySelector(".bb-comment");
                const hasVideoSpeedDiv = document.getElementById("video_speed_div");

                if (hasComments && !hasVideoSpeedDiv) {
                    addSpeedBtns();
                    observer.disconnect();
                }
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function applySpeed(speed) {
        let videoObj = document.querySelector("video") || document.querySelector("bwp-video");
        if (videoObj) {
            videoObj.playbackRate = parseFloat(speed);
            videoObj.onloadstart = () => {
                videoObj.playbackRate = parseFloat(getThirdVideoPluginSpeed());
            };
        }
    }

    function addSpeedBtns() {
        const playerWrap = document.getElementById("playerWrap");
        if (playerWrap) {
            playerWrap.insertAdjacentElement('afterend', videoSpeedElement);
        }else{
            document.getElementById("bilibili-player-wrap").insertAdjacentElement('afterend', videoSpeedElement);

        }

        const speedsettingsbtn = document.createElement("button");
        speedsettingsbtn.textContent = " S ";
        speedsettingsbtn.style.backgroundColor = "black";
        speedsettingsbtn.style.color = "white";
        speedsettingsbtn.id = "third_video_plugin_btn";
        speedsettingsbtn.addEventListener("click", speedsettingsevent);
        videoSpeedElement.appendChild(speedsettingsbtn);

        initBtn();

        videoSpeedElement.style.width = "100%";
        videoSpeedElement.style.height = "24px";

        setTimeout(() => {
            if (keypressed) return;
            const speed = getThirdVideoPluginSpeed();
            hightlightBtn(speed);
            applySpeed(speed);
        }, 500);
    }

    function getThirdVideoPluginSpeed() {
        let speed = GM_getValue(THIRD_VIDEO_PLUGIN_SPEED, "1");
        GM_setValue(THIRD_VIDEO_PLUGIN_SPEED, speed);
        return speed;
    }

    function initBtn() {
        let speedArr = getStorageSpeeds();
        if (!speedArr.length) {
            speedArr = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];
            saveSpeed(speedArr);
        }

        speedArr.forEach(speed => {
            const btn = document.createElement("button");
            btn.textContent = `x${speed}`;
            btn.style.width = "50px";
            btn.id = `third_video_plugin_btn_${speed}`;
            btn.addEventListener("click", changeVideoSpeed);
            videoSpeedElement.appendChild(btn);
        });
    }

    function saveSpeed(speeds) {
        GM_setValue(THIRD_VIDEO_PLUGIN_SPEEDS, speeds.join(","));
    }

    function getStorageSpeeds() {
        return (GM_getValue(THIRD_VIDEO_PLUGIN_SPEEDS, "") || "").split(",");
    }

    function speedsettingsevent() {
        let speeds = window.prompt("输入倍速，以英文逗号隔开。", getStorageSpeeds().join(",")).replace(/\s+/g, "").split(",");
        if (!speeds.every(speed => !isNaN(parseFloat(speed)))) return;
        GM_setValue(THIRD_VIDEO_PLUGIN_SPEEDS, speeds.join(","));
        const currentSpeed = GM_getValue(THIRD_VIDEO_PLUGIN_SPEED);
        if (!speeds.includes(currentSpeed)) GM_setValue(THIRD_VIDEO_PLUGIN_SPEED, "1");
        videoSpeedElement.querySelectorAll("button:not(#third_video_plugin_btn)").forEach(btn => videoSpeedElement.removeChild(btn));
        initBtn();
    }

    function changeVideoSpeed(e) {
        const speed = parseFloat(e.target.textContent.replace("x", ""));
        GM_setValue(THIRD_VIDEO_PLUGIN_SPEED, speed);
        hightlightBtn(speed);
        applySpeed(speed);
    }

    function hightlightBtn(speed) {
        const currentSpeedBtn = document.getElementById(`third_video_plugin_btn_${speed}`);
        if (currentSpeedBtn && !currentSpeedBtn.classList.contains("video_speed_div-button-active")) {
            videoSpeedElement.querySelectorAll("button").forEach(btn => btn.classList.remove("video_speed_div-button-active"));
            currentSpeedBtn.classList.add("video_speed_div-button-active");
        }
    }

})();
