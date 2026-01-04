// ==UserScript==
// @name         YouTube 剩余时间显示
// @namespace    https://greasyfork.org/users/1171320
// @version      1.02
// @description  根据倍速调整。Display the remaining time of a YouTube video adjusted for playback rate.
// @author       yzcjd
// @author2     Lama AI 辅助
// @match        *://www.youtube.com/watch*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525221/YouTube%20%E5%89%A9%E4%BD%99%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/525221/YouTube%20%E5%89%A9%E4%BD%99%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the UI element
    const createRemainingTimeElement = () => {
        const element = document.createElement('div');
        Object.assign(element.style, {
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: '800',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
        });
        document.body.appendChild(element);
        return element;
    };

    const remainingTimeElement = createRemainingTimeElement();

    // Function to update the remaining time
    const updateRemainingTime = () => {
        const videoElement = document.querySelector('video');
        if (videoElement && videoElement.duration) {
            const currentTime = videoElement.currentTime;
            const duration = videoElement.duration;
            const playbackRate = videoElement.playbackRate || 1;

            const remainingTime = (duration - currentTime) / playbackRate;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = Math.floor(remainingTime % 60);

            remainingTimeElement.textContent = `time left  ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    };

    // Check for video element and set up an observer to update remaining time
    const init = () => {
        const observer = new MutationObserver(() => {
            const videoElement = document.querySelector('video');
            if (videoElement) {
                updateRemainingTime();
                videoElement.addEventListener('timeupdate', updateRemainingTime);
                videoElement.addEventListener('ratechange', updateRemainingTime);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Initialize the script
    init();
})();