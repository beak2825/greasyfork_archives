// ==UserScript==
// @name         Reddit Video Pause on Scroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mute or stop videos on Reddit when they are scrolled out of view
// @author       NettiMies
// @match        https://old.reddit.com/*
// @match        https://www.reddit.com/*
// @grant        none
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/498900/Reddit%20Video%20Pause%20on%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/498900/Reddit%20Video%20Pause%20on%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view
                if (video.paused) {
                    video.play();
                }
                video.muted = false;
            } else {
                // Video is out of view
                video.pause();
                video.muted = true;
            }
        });
    }, {
        threshold: 0.5 // Adjust threshold as needed
    });

    function checkForVideos() {
        document.querySelectorAll('video').forEach(video => {
            observer.observe(video);
        });
    }

    // Check for new videos periodically, I don't know jack about javascript, I just know it sucks balls and is slow as hell, so this might decimate performance... Didn't for me though, so we BALL!!
    setInterval(checkForVideos, 1000);
})();
