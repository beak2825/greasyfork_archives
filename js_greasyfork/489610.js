// ==UserScript==
// @name         带自动清理的视频播放进度恢复脚本
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动恢复视频播放进度，并在30天后清理旧记录
// @author       CWJ
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489610/%E5%B8%A6%E8%87%AA%E5%8A%A8%E6%B8%85%E7%90%86%E7%9A%84%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6%E6%81%A2%E5%A4%8D%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/489610/%E5%B8%A6%E8%87%AA%E5%8A%A8%E6%B8%85%E7%90%86%E7%9A%84%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6%E6%81%A2%E5%A4%8D%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const videoSelector = 'video';
    const expirationDays = 30;

    function getVideoId(video) {
        return video.src || window.location.href;
    }

    function displayAlert(message) {
        const alertBox = document.createElement('div');
        alertBox.innerText = message;
        alertBox.style.position = 'fixed';
        alertBox.style.zIndex = '10000';
        alertBox.style.left = '50%';
        alertBox.style.top = '10%';
        alertBox.style.transform = 'translateX(-50%)';
        alertBox.style.background = 'rgba(0, 0, 0, 0.7)';
        alertBox.style.color = 'white';
        alertBox.style.padding = '10px';
        alertBox.style.borderRadius = '5px';
        document.body.appendChild(alertBox);

        setTimeout(() => {
            document.body.removeChild(alertBox);
        }, 2000);
    }

    function clearExpiredData() {
        const data = localStorage.getItem('savedVideoData');
        const videosData = data ? JSON.parse(data) : {};
        const currentTime = new Date().getTime();

        Object.entries(videosData).forEach(([key, value]) => {
            if (currentTime - value.timestamp > expirationDays * 24 * 60 * 60 * 1000) {
                delete videosData[key];
            }
        });

        localStorage.setItem('savedVideoData', JSON.stringify(videosData));
    }

    window.addEventListener('load', () => {
        clearExpiredData();

        const video = document.querySelector(videoSelector);
        if (video) {
            const videoId = getVideoId(video);
            const data = localStorage.getItem('savedVideoData');
            const videosData = data ? JSON.parse(data) : {};

            if (videosData[videoId] && videosData[videoId].currentTime) {
                video.currentTime = parseFloat(videosData[videoId].currentTime);
                displayAlert('从上次播放');
            }

            video.addEventListener('timeupdate', () => {
                videosData[videoId] = { currentTime: video.currentTime, timestamp: new Date().getTime() };
                localStorage.setItem('savedVideoData', JSON.stringify(videosData));
            });
        }
    });
})();