// ==UserScript==
// @name         海角大兄弟
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       海角大兄弟
// @license    https://*/post/details*
// @description   播放并复制链接
// @match
https://hjy8.top/*
// @match        https://*/post/details?pid=*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/495673/%E6%B5%B7%E8%A7%92%E5%A4%A7%E5%85%84%E5%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/495673/%E6%B5%B7%E8%A7%92%E5%A4%A7%E5%85%84%E5%BC%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const videoContainer = document.createElement('div');
    const closeButton = document.createElement('div');
    let video;

    const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const getPidFromUrl = () => {
        const url = window.location.href;
        const regex = /[?&]pid=(\d+)/;
        const matches = regex.exec(url);
        if (matches && matches.length > 1) {
            return matches[1];
        }
        return null;
    };

    const sendApiRequestAndPlay = async (pid) => {
        const apiUrl = 'http://www.djyun.icu/api/hjjx?id=' + pid;
        try {
            const response = await fetch(apiUrl);
            const data = await response.text();
            const m3u8Url = getM3U8UrlFromData(data);
            if (m3u8Url) {
                GM_setClipboard(m3u8Url);
                showNotification('数据已复制');
                playVideo(m3u8Url);
            } else {
                console.error('无法获取m3u8链接');
                showNotification('无法获取m3u8链接，请重试！');
            }
        } catch (error) {
            console.error('请求失败:', error);
            showNotification('请求失败，请重试！');
        }
    };

    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.style = `
            position: fixed;
            bottom: 40px;
            right: 20px;
            width: 240px;
            padding: 16px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 8px;
            text-align: center;
            line-height: 20px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
        `;
        notification.innerText = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    };

    const playVideo = (m3u8Url) => {
        video = document.createElement('video');
        video.src = m3u8Url;
        video.controls = true;
        video.style = `
            width: 100%;
            height: 100%;
        `;
        videoContainer.appendChild(video);
        videoContainer.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
        `;
        document.body.appendChild(videoContainer);

        closeButton.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 30px;
            height: 30px;
            background: #FF6161;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
        `;
        closeButton.innerText = 'X';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(videoContainer);
            video = null;
        });
        videoContainer.appendChild(closeButton);
    };

const stopVideo = () => {
    if (video) {
        video.pause(); // 暂停视频播放
        videoContainer.removeChild(video); // 从容器中移除视频
        video = null;
    }
};
    const addFloatingButton = () => {
        const button = document.createElement('div');
        button.style = `
            position: fixed;
            bottom: 50px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #FF6161;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 60px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
        `;
        button.innerText = '复制';
        button.addEventListener('click', () => {
            const pid = getPidFromUrl();
            if (pid) {
                stopVideo();
                sendApiRequestAndPlay(pid);
            } else {
                showNotification('无法获取pid');
            }
        });
        document.body.appendChild(button);
    };

    const stopVideoOnUnload = () => {
        if (video) {
            stopVideo();
        }
    };

function getM3U8UrlFromData(data) {
    var regex = /http:\/\/www\.djyun\.icu\/api\/hjvido\?id=[\w.]+/;
    var matches = regex.exec(data);
    if (matches && matches.length > 0) {
        return matches[0];
    }
    return null;
}


    if (isMobileDevice()) {
        addFloatingButton();
        window.addEventListener('beforeunload', stopVideoOnUnload);
    }
})();