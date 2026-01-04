// ==UserScript==
// @name         济达教育网课助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  济达教育 自动视频播放 刷课助手
// @author       Nuzoul
// @license      MIT
// @match        https://www.jetjy.com/*
// @icon         https://www.jetjy.com//favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480731/%E6%B5%8E%E8%BE%BE%E6%95%99%E8%82%B2%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/480731/%E6%B5%8E%E8%BE%BE%E6%95%99%E8%82%B2%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const playercontainerId = 'playercontainer';
    const videoSelector = 'video.jw-video,video.vjs-tech';
    const courseSelector = 'div.el-row div.el-col';
    const messageBoxWrapperSelector = '.el-message-box__wrapper';
    const confirmButtonSelector = '.el-message-box__btns button';
    const courseListItemSelector = '.courseMenuList li';
    const progressSelector = '.f-right';
    const stateIdle = 'jw-state-idle';
    const statePaused = 'jw-state-paused';
    const statePlaying = 'jw-state-playing';

    const autoPlayVideo = function () {
        const playerContainer = document.getElementById(playercontainerId);
        if (!playerContainer || playerContainer.classList.contains(statePlaying)) {
            return;
        }

        if (playerContainer.classList.contains(stateIdle) && !jumpToCourse()) {
            console.log("当前页面已全部播放完成....");
            return;
        }

        if (!playerContainer.classList.contains(statePlaying)) {
            console.log('当前暂停播放');
            const videoElement = document.querySelector(videoSelector);
            if (videoElement) {
                playVideo();
            }
        }

        const messageBoxWrapper = document.querySelector(messageBoxWrapperSelector);
        if (messageBoxWrapper && window.getComputedStyle(messageBoxWrapper).display !== 'none') {
            const confirmButton = document.querySelector(confirmButtonSelector);
            if (confirmButton) {
                confirmButton.click();
                location.reload();
            }
        }
    };

     function playVideo() {
        let playTimes = 1;
        const intervalId = setInterval(() => {
            if(playTimes >= 5){
                console.log(`播放失败，尝试播放次数：${playTimes}`);
                clearInterval(intervalId);
                return;
            }
            const playerContainer = document.getElementById(playercontainerId);
            const videoElement = playerContainer.querySelector(videoSelector);
            if(!videoElement){
                console.log("videoElement not exist");
                clearInterval(intervalId);
            }
            if (playerContainer && videoElement && !playerContainer.classList.contains(statePlaying)) {
                console.log(`第 ${playTimes} 次尝试播放`);
                videoElement.muted = true;
                videoElement.play();
            } else {
                clearInterval(intervalId);
            }
            playTimes++;
        }, 1000);
    }

    function jumpToCourse() {
        const listItems = document.querySelectorAll(courseListItemSelector);
        const listItemsArray = Array.from(listItems);

        const result = listItemsArray.some((item, index) => {
            const progressElement = item.querySelector(progressSelector);
            const progressText = progressElement.textContent.trim();

            if (progressText === '100%') {
                //console.log(`第 ${index + 1} 个课程已完成，跳过`);
            } else {
                const courseLi = item.querySelector(courseSelector);
                courseLi.click();
                console.log(`点击了第 ${index + 1} 个课程`);
                return true;
            }

            return false;
        });

        return result;
    }

    window.onload = function () {
        const intervalId = setInterval(autoPlayVideo, 6000);
    };

})();
