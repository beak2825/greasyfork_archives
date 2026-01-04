// ==UserScript==
// @name         Volume Booster
// @namespace    https://greasyfork.org/zh-CN/users/196399-xyabc120
// @version      2024-09-27
// @description  Control volume of playing media on any webpage
// @author       mr.zhao
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510425/Volume%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/510425/Volume%20Booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const storageKeyName = "VOLUMN_BOOSTER_GAIN_INDEX";
    let currentGainIndex = GM_getValue(storageKeyName, 0);
    const gainValues = [1.0, 2.0, 3.0, 4.0, 5.0];

    // 创建 AudioContext 和 GainNode
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = gainValues[currentGainIndex];

    let connectedVideo = null;
    // 尝试连接现有视频元素
    const connectMedia = () => {
        const videoElement = document.querySelector('video');
        if (videoElement && videoElement !== connectedVideo) {
            if (connectedVideo) {
                connectedVideo.srcObject = null;
            }
            const track = audioContext.createMediaElementSource(videoElement);
            track.connect(gainNode);
            gainNode.connect(audioContext.destination);
            connectedVideo = videoElement;
        }
    };

    // 监听 DOM 变化
    const observer = new MutationObserver(connectMedia);
    observer.observe(document.body, { childList: true, subtree: true });

    // 可选：创建一个按钮来调整音量
    const button = document.createElement('button');
    button.textContent = `Volume Boost ${gainValues[currentGainIndex]}x`;
    button.style.position = 'fixed';
    button.style.top = '70px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = "1px 7px";
    button.title = "左键点击增加音量倍数，右键重置";
    document.body.appendChild(button);

    const updateGain = (gainIndex) => {
        currentGainIndex = gainIndex;
        gainNode.gain.value = gainValues[currentGainIndex];
        button.textContent = `Volume Boost ${gainValues[currentGainIndex]}x`;
        GM_setValue(storageKeyName, gainIndex);
    };

    button.addEventListener('click', () => updateGain(++currentGainIndex % gainValues.length));
    button.addEventListener('contextmenu', () => {
        event.preventDefault();
        updateGain(0);
    });

})();