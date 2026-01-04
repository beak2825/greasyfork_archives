// ==UserScript==
// @name         Olevod Video Auto Next
// @namespace    http://your.domain.com
// @version      1.1
// @description  Automates actions on Olevod video player
// @author       Your Name
// @match        https://www.olevod.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491153/Olevod%20Video%20Auto%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/491153/Olevod%20Video%20Auto%20Next.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("silent checking");

    // Function to get the video element
    const getVideoElement = () => {
        return document.querySelector("video");
    };

    // Function to enter fullscreen mode
    const enterFullScreen = (video) => {
        if (video) {
            if (!document.fullscreenElement) {
                console.log("enter full screen")
                video.requestFullscreen();
            }
        }
    };

    // Function to check if the video time equals max time and click next episode
    const checkAndClickNextEpisode = () => {
        const video = getVideoElement();
        if (video) {
            const currentTime = video.currentTime;
            const duration = video.duration;
            const maxTimeThreshold = 0.95; // Adjust this threshold as needed

            // If current time reaches 95% of the duration, simulate clicking the next episode button
            if (currentTime >= maxTimeThreshold * duration) {
                console.log("time is up, next");
                const nextEpisodeButton = parent.$(".next-t");;
                if (nextEpisodeButton) {
                    console.log("i got the next button");
                    nextEpisodeButton.click();
                }
            }

            // Enter fullscreen mode only when the current time is close to the beginning of the duration
            if (currentTime < 5) { // Adjust the threshold as needed
                enterFullScreen(video);
            }
        }
    };

    // Check and click next episode every second
    setInterval(checkAndClickNextEpisode, 1000);

})();
