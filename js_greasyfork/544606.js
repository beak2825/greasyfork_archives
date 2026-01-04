// ==UserScript==
// @name         H5视频调速器 手机优化版
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description  针对手机浏览器的H5视频调速器，点击播放时移到视口中间，记忆上次播放速度
// @author       Mr.NullNull & 优化
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544606/H5%E8%A7%86%E9%A2%91%E8%B0%83%E9%80%9F%E5%99%A8%20%E6%89%8B%E6%9C%BA%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/544606/H5%E8%A7%86%E9%A2%91%E8%B0%83%E9%80%9F%E5%99%A8%20%E6%89%8B%E6%9C%BA%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 关键修改1：从localStorage读取上次保存的速度，默认1倍速（替代原固定值1）
    var IntPbr = parseFloat(localStorage.getItem('videoPlaybackRate')) || 1;
    var isPlaying = false;
    const IntPbrMax = 16;
    const IntPbrMin = 0.1;

    function Main() {
        if (document.querySelector("myPbrMain")) return;

        // 样式部分不变
        var myCss = document.createElement("style");
        myCss.innerHTML = `
            div#myPbrMain {
                padding: 0; margin: 0; width: auto;
                position: fixed; bottom: 28vw; right: 5vw; z-index: 2147483647;
                display: flex; flex-direction: column; align-items: flex-end;
            }
            div#myPbrMain>div.myPbrBtns { width: auto; margin-bottom: 0.8vw; display: none; }
            div.myPbrBtns { opacity: 0; }
            div.myPbrBtn {
                font: 4vw/1 '微软雅黑'; height: 4vw; padding: 2vw; margin-bottom: 0.8vw;
                border-radius: 20vw; color: #eee; background: rgba(0,0,0,0.65);
                cursor: pointer; white-space: nowrap; text-align: center; min-width: 12vw;
            }
            div#myPbrMain * { box-sizing: content-box; word-break: normal; }
            div.show { animation: shower 0.3s; opacity: 1; display: block !important; }
            div.hidden { animation: hiddener 0.3s; opacity: 0; display: none; }
            @keyframes shower { from { opacity: 0; } to { opacity: 1; } }
            @keyframes hiddener { from { opacity: 1; } to { opacity: 0; } }
        `;
        document.head.appendChild(myCss);

        // 控件HTML部分不变
        var mainDivTop = document.createElement("div");
        mainDivTop.id = "myPbrMain";
        mainDivTop.innerHTML = `
            <div class="myPbrBtns hidden">
                <div class="myPbrBtn" id="myPbrBtn_1000">x10.00</div>
                <div class="myPbrBtn" id="myPbrBtn_600">x6.00</div>
                <div class="myPbrBtn" id="myPbrBtn_300">x3.00</div>
                <div class="myPbrBtn" id="myPbrBtn_200">x2.00</div>
                <div class="myPbrBtn" id="myPbrBtn_150">x1.50</div>
                <div class="myPbrBtn" id="myPbrBtn_125">x1.25</div>
                <div class="myPbrBtn" id="myPbrBtn_100">x1.00</div>
            </div>
            <div class="myPbrBtn" id="myPbrBtn_Main">x1.XX</div>
            <div class="myPbrBtn" id="myPbrBtn_PlayPause">播放</div>
        `;
        document.body.appendChild(mainDivTop);

        var mainBtn = mainDivTop.querySelector("#myPbrBtn_Main");
        var speedPanel = mainDivTop.querySelector(".myPbrBtns");
        var playPauseBtn = mainDivTop.querySelector("#myPbrBtn_PlayPause");

        setMainBtnTxt();
        syncVideoStateToBtn();

        // 初始化同步速度
        setTimeout(() => syncAllVideosSpeed(), 500);

        // 同步按钮状态定时器
        var syncTimer = setInterval(() => {
            syncVideoStateToBtn();
            if (getTargetVideo()) clearInterval(syncTimer);
        }, 500);
        setTimeout(() => clearInterval(syncTimer), 5000);

        // 速度面板切换
        mainBtn.onclick = () => {
            speedPanel.classList.toggle("hidden");
            speedPanel.classList.toggle("show");
        };

        // 核心修复：播放/暂停按钮点击逻辑（确保先滚动再控制）
        playPauseBtn.onclick = function () {
            const targetVideo = getTargetVideo();
            if (targetVideo) {
                setTimeout(() => {
                    scrollToVideoCenter(targetVideo);
                    togglePlayPause(targetVideo);
                }, 50);
            }
        };

        // 速度按钮绑定（不变）
        speedPanel.querySelector("#myPbrBtn_1000").onclick = () => setVideoSpeed(10);
        speedPanel.querySelector("#myPbrBtn_600").onclick = () => setVideoSpeed(6);
        speedPanel.querySelector("#myPbrBtn_300").onclick = () => setVideoSpeed(3);
        speedPanel.querySelector("#myPbrBtn_200").onclick = () => setVideoSpeed(2);
        speedPanel.querySelector("#myPbrBtn_150").onclick = () => setVideoSpeed(1.5);
        speedPanel.querySelector("#myPbrBtn_125").onclick = () => setVideoSpeed(1.25);
        speedPanel.querySelector("#myPbrBtn_100").onclick = () => setVideoSpeed(1);

        // 获取目标视频（不变）
        function getTargetVideo() {
            const videos = document.querySelectorAll("video");
            if (videos.length === 0) return null;
            if (videos.length === 1) return videos[0];

            const viewportCenterY = window.scrollY + window.innerHeight / 2;
            let minDistance = Infinity, targetVideo = null;
            videos.forEach(video => {
                const rect = video.getBoundingClientRect();
                const videoCenterY = window.scrollY + rect.top + rect.height / 2;
                const distance = Math.abs(viewportCenterY - videoCenterY);
                if (distance < minDistance) {
                    minDistance = distance;
                    targetVideo = video;
                }
            });
            return targetVideo;
        }

        // 关键修复：滚动逻辑（用两种方式确保立刻移动到视口中间）
        function scrollToVideoCenter(video) {
            const rect = video.getBoundingClientRect();
            const targetTop = window.scrollY + (window.innerHeight / 2) - (rect.height / 2);
            window.scrollTo({ top: targetTop, left: 0, behavior: "auto" });
            video.scrollIntoView({
                block: "center",
                inline: "start",
                behavior: "auto"
            });
        }

        // 以下函数均不变（仅setVideoSpeed增加本地存储）
        function syncVideoStateToBtn() {
            const targetVideo = getTargetVideo();
            if (targetVideo) {
                isPlaying = !targetVideo.paused;
                updatePlayPauseBtnText();
            }
        }

        function togglePlayPause(video) {
            video.paused ? video.play() : video.pause();
            isPlaying = !video.paused;
            updatePlayPauseBtnText();
        }

        // 关键修改2：设置速度时，将当前速度保存到localStorage（跨页面生效）
        function setVideoSpeed(speed) {
            IntPbr = Math.max(IntPbrMin, Math.min(speed, IntPbrMax));
            localStorage.setItem('videoPlaybackRate', IntPbr); // 新增：保存速度到本地存储
            syncAllVideosSpeed();
            setMainBtnTxt();
            hideSpeedPanel();
        }

        function syncAllVideosSpeed() {
            document.querySelectorAll("video").forEach(v => v.playbackRate = IntPbr);
        }

        function updatePlayPauseBtnText() {
            playPauseBtn.textContent = isPlaying ? "暂停" : "播放";
        }

        function setMainBtnTxt() {
            mainBtn.innerHTML = "x" + IntPbr.toFixed(2);
        }

        function hideSpeedPanel() {
            speedPanel.classList.remove("show");
            speedPanel.classList.add("hidden");
        }

        window.addEventListener('scroll', syncVideoStateToBtn);

        document.addEventListener('play', e => {
            if (e.target.tagName === 'VIDEO') {
                e.target.playbackRate = IntPbr;
                if (e.target === getTargetVideo()) {
                    isPlaying = true;
                    updatePlayPauseBtnText();
                }
            }
        }, true);

        document.addEventListener('pause', e => {
            if (e.target.tagName === 'VIDEO' && e.target === getTargetVideo()) {
                isPlaying = false;
                updatePlayPauseBtnText();
            }
        }, true);
    }

    // 初始化脚本（不变）
    var sli = setInterval(() => {
        if (document.querySelector("video")) {
            Main();
            clearInterval(sli);
        }
    }, 1000);
    setTimeout(() => clearInterval(sli), 10000);
})();