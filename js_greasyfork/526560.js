// ==UserScript==
// @name         Auto Loop and Autoplay for All Video Players
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Enables loop and autoplay on all video players online
// @author       Dj Dragkan
// @match        *://*/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526560/Auto%20Loop%20and%20Autoplay%20for%20All%20Video%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/526560/Auto%20Loop%20and%20Autoplay%20for%20All%20Video%20Players.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enableLoopAndAutoplay(video) {
        if (video && !video.dataset.loopEnabled) {
            // Enable loop
            video.loop = true;
            video.dataset.loopEnabled = "true";
            console.log("Loop enabled on:", video);
        }

        // Enable autoplay after the first playback finishes
        video.addEventListener('ended', () => {
            video.autoplay = true;
            video.play();
            console.log("Autoplay enabled on:", video);
        });
    }

    function checkVideos() {
        let videos = document.querySelectorAll("video");
        videos.forEach(enableLoopAndAutoplay);
    }

    // Observer to detect new videos on the page
    const observer = new MutationObserver(checkVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    // Enable loop and autoplay on videos already present
    checkVideos();
})();
