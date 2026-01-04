// ==UserScript==
// @name        Resume Video
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Resume YouTube videos from where you left off.
// @author       InariOkami
// @match        https://www.youtube.com/watch*
// @grant        none
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/YouTube_Rewind_Logo_%282017_to_2021%29.svg/1276px-YouTube_Rewind_Logo_%282017_to_2021%29.svg.png
// @downloadURL https://update.greasyfork.org/scripts/502378/Resume%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/502378/Resume%20Video.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const MINIMUM_TIME = 5;
    const END_BUFFER = 5;

    function saveTimestamp() {
        const videoId = new URLSearchParams(window.location.search).get('v');
        const videoElement = document.querySelector('video');
        if (videoId && videoElement) {
            const currentTime = videoElement.currentTime;
            const videoDuration = videoElement.duration;

            if (currentTime > MINIMUM_TIME && currentTime < (videoDuration - END_BUFFER)) {
                localStorage.setItem(`youtube_${videoId}`, currentTime);
            }
        }
    }

    function resumeVideo() {
        const videoId = new URLSearchParams(window.location.search).get('v');
        const videoElement = document.querySelector('video');
        if (videoId && videoElement) {
            const savedTime = localStorage.getItem(`youtube_${videoId}`);
            if (savedTime) {
                const timeToResume = parseFloat(savedTime);
                if (timeToResume > MINIMUM_TIME && timeToResume < (videoElement.duration - END_BUFFER)) {
                    videoElement.currentTime = timeToResume;
                }
            }
        }
    }

    function init() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            resumeVideo();
            window.addEventListener('beforeunload', saveTimestamp);
        } else {
            setTimeout(init, 1000);
        }
    }

    window.addEventListener('load', init);
})();