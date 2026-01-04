// ==UserScript==
// @name         YouTube Millisecond Timer
// @namespace    https://youtube.com/
// @version      1.0
// @description  Показывает время воспроизведения видео с миллисекундами на YouTube
// @author       christopher wayne
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535778/YouTube%20Millisecond%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/535778/YouTube%20Millisecond%20Timer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitForPlayer = setInterval(() => {
        const video = document.querySelector('video');
        const timeDisplay = document.querySelector('.ytp-time-current');

        if (video && timeDisplay) {
            clearInterval(waitForPlayer);
            addMillisecondDisplay(video, timeDisplay);
        }
    }, 500);

    function addMillisecondDisplay(video, originalDisplay) {
        const customDisplay = document.createElement('span');
        customDisplay.style.marginLeft = '10px';
        customDisplay.style.color = '#0ff';
        customDisplay.style.fontSize = '14px';
        customDisplay.style.fontFamily = 'monospace';

        originalDisplay.parentNode.appendChild(customDisplay);

        setInterval(() => {
            const time = video.currentTime;
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            const milliseconds = Math.floor((time % 1) * 1000);
            const formatted = `${pad(minutes)}:${pad(seconds)}.${padMs(milliseconds)}`;
            customDisplay.textContent = formatted;
        }, 50);
    }

    function pad(n) {
        return n.toString().padStart(2, '0');
    }

    function padMs(ms) {
        return ms.toString().padStart(3, '0');
    }
})();