// ==UserScript==
// @name         基于微休息理论的简易番茄时钟
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  30分钟工作后10分钟休息（中途会随机出现休息时间），带开始/暂停切换按钮，恢复白噪音和提示音播放功能
// @author       POTATO
// @include         *://yuanbao.tencent.com/chat/*
// @include         *://www.ppbzy.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/539355/%E5%9F%BA%E4%BA%8E%E5%BE%AE%E4%BC%91%E6%81%AF%E7%90%86%E8%AE%BA%E7%9A%84%E7%AE%80%E6%98%93%E7%95%AA%E8%8C%84%E6%97%B6%E9%92%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/539355/%E5%9F%BA%E4%BA%8E%E5%BE%AE%E4%BC%91%E6%81%AF%E7%90%86%E8%AE%BA%E7%9A%84%E7%AE%80%E6%98%93%E7%95%AA%E8%8C%84%E6%97%B6%E9%92%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置初始工作和休息时间（单位：分钟）
    // 时间可修改
    const workTime = GM_getValue("workTime", 30); // 工作时间
    const breakTime = GM_getValue("breakTime", 10); // 休息时间
    let isWorkTime = true; // 当前是否是工作时间
    let currentTime = workTime * 60; // 当前剩余时间
    let timer = null;
    let alertTimeout = null; // 提示音定时器
    let isRunning = false; // 计时器运行状态
    let nextAlertTime = 0; // 下一次提示音的时间点
    let alertPlayed = false; // 记录提示音是否已播放

    // 白噪声链接（可以换成你自己的链接）
    const whiteNoiseUrl = "http://ws.stream.qqmusic.qq.com/C4000033PKZz0QwtN4.m4a?guid=795910201&vkey=698DC5709CBE4AAFDA767E7B1E3EC7427FA043C059DD0FB11FADF31D3BDFFC991E7034BD609BE9B1A53424661707E9D536BBFEDB3929E9D5__v2b94c504&uin=&fromtag=120032";
    // 提示音链接（可以换成你自己的链接）
    const alertSoundUrl = "http://ws.stream.qqmusic.qq.com/C400001DJ3CY1WDoq0.m4a?guid=713430602&vkey=018069437CB27C331790D09563D86252ECD53E3C3C0FD9128333CDD37A2F45022E36A060001A92D4C9152B713C70E5266B739385A867E0FB__v2b9ab898&uin=&fromtag=120032";

    // 播放白噪声
    let audio = new Audio(whiteNoiseUrl);
    let alertSound = new Audio(alertSoundUrl);
    let countdownDisplay = null;
    let toggleButton = null; // 全局引用切换按钮

    // 初始化界面显示
    function createCountdownDisplay() {
        countdownDisplay = document.createElement("div");
        countdownDisplay.style.position = "fixed";
        countdownDisplay.style.top = "10px";
        countdownDisplay.style.left = "50%";
        countdownDisplay.style.transform = "translateX(-50%)";
        countdownDisplay.style.padding = "20px";
        countdownDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        countdownDisplay.style.color = "#fff";
        countdownDisplay.style.fontSize = "28px";
        countdownDisplay.style.fontWeight = "bold";
        countdownDisplay.style.borderRadius = "12px";
        countdownDisplay.style.zIndex = "9999";
        countdownDisplay.style.textAlign = "center";
        document.body.appendChild(countdownDisplay);
    }

    // 更新倒计时显示
    function updateCountdown() {
        let minutes = Math.floor(currentTime / 60);
        let seconds = currentTime % 60;
        countdownDisplay.innerHTML = `${isWorkTime ? "工作时间" : "休息时间"}: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    // 播放提示音
    function playAlertSound() {
        alertSound.play();
        alertPlayed = true; // 标记提示音已播放
        alertTimeout = setTimeout(() => alertSound.pause(), 10000); // 10秒后停止提示音
    }

    // 设置下一次提示时间
    function setNextAlertTime() {
        // 计算随机的3-5分钟间隔（180-300秒）
        const randomSeconds = Math.floor(Math.random() * 121) + 180;
        nextAlertTime = currentTime - randomSeconds;
        alertPlayed = false; // 重置播放标记
    }

    // 启动定时器
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            setNextAlertTime(); // 设置第一次提示时间

            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(() => {
                currentTime--;
                updateCountdown();

                // 检查是否到达提示时间（且未播放过提示音）
                if (isWorkTime && !alertPlayed && currentTime <= nextAlertTime) {
                    playAlertSound();
                    setNextAlertTime(); // 设置下一次提示时间
                }

                if (currentTime <= 0) {
                    if (isWorkTime) {
                        // 切换到休息时间
                        isWorkTime = false;
                        currentTime = breakTime * 60;
                        setNextAlertTime(); // 设置休息结束后的提示时间
                        audio.play(); // 开始播放白噪声
                    } else {
                        // 切换到工作时间
                        isWorkTime = true;
                        currentTime = workTime * 60;
                        setNextAlertTime(); // 设置新的提示时间
                        audio.pause(); // 停止播放白噪声
                    }
                }
            }, 1000);

            // 更新切换按钮图标为暂停图标
            toggleButton.innerHTML = `<img src="https://img.icons8.com/ios/452/pause.png" width="50" height="50" />`;
        }
    }

    // 暂停计时
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timer);
            clearTimeout(alertTimeout); // 清除提示音定时器
            audio.pause(); // 停止白噪音
            alertSound.pause(); // 停止提示音
            isRunning = false;

            // 更新切换按钮图标为播放图标
            toggleButton.innerHTML = `<img src="https://img.icons8.com/ios/452/play.png" width="50" height="50" />`;
        }
    }

    // 切换开始/暂停状态
    function toggleTimer() {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    // 重启计时
    function resetTimer() {
        clearInterval(timer);
        clearTimeout(alertTimeout); // 清除提示音定时器
        audio.pause(); // 停止白噪音
        alertSound.pause(); // 停止提示音
        isRunning = false;
        currentTime = isWorkTime ? workTime * 60 : breakTime * 60;
        setNextAlertTime(); // 重置提示时间
        updateCountdown();

        // 更新切换按钮图标为播放图标
        if (toggleButton) {
            toggleButton.innerHTML = `<img src="https://img.icons8.com/ios/452/play.png" width="50" height="50" />`;
        }
    }

    // 初始化
    function init() {
        createCountdownDisplay();
        updateCountdown();
        setNextAlertTime(); // 初始化提示时间
        createControlButtons(); // 创建控制按钮
    }

    // 创建按钮
    function createControlButtons() {
        // 创建按钮容器（位于右下角）
        const buttonContainer = document.createElement("div");
        buttonContainer.style.position = "fixed";
        buttonContainer.style.bottom = "20px";
        buttonContainer.style.right = "20px";
        buttonContainer.style.zIndex = "9999";
        buttonContainer.style.display = "flex";
        buttonContainer.style.flexDirection = "column";
        buttonContainer.style.gap = "15px";
        buttonContainer.style.alignItems = "flex-end";
        document.body.appendChild(buttonContainer);

        // 创建开始/暂停切换按钮
        toggleButton = document.createElement("button");
        toggleButton.style.width = "50px";
        toggleButton.style.height = "50px";
        toggleButton.style.backgroundColor = "#28a745";
        toggleButton.style.border = "none";
        toggleButton.style.borderRadius = "50%";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
        toggleButton.innerHTML = `<img src="https://img.icons8.com/ios/452/play.png" width="50" height="50" />`;
        toggleButton.addEventListener("click", toggleTimer);
        buttonContainer.appendChild(toggleButton);

        // 创建重启按钮（使用新的重启图标）
        const resetButton = document.createElement("button");
        resetButton.style.width = "50px";
        resetButton.style.height = "50px";
        resetButton.style.backgroundColor = "#17a2b8";
        resetButton.style.border = "none";
        resetButton.style.borderRadius = "50%";
        resetButton.style.cursor = "pointer";
        resetButton.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
        resetButton.innerHTML = `<img src="https://img.icons8.com/ios/452/restart.png" width="50" height="50" />`;
        resetButton.addEventListener("click", resetTimer);
        buttonContainer.appendChild(resetButton);
    }

    init();

})();