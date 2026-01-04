// ==UserScript==
// @name        Twitch.tv Frontpage Autoplay Off
// @namespace   https://github.com/mirbyte/TwitchTV-Userscripts/edit/main/Frontpage%20Autoplay%20Off.js
// @match       https://www.twitch.tv/
// @grant       none
// @version     1.2
// @author      mirbyte
// @description Pauses Twitch.tv frontpage carousel video that autoplays recommended streams. Check GitHub page for the demonstration image.
// @icon        https://banner2.cleanpng.com/20180513/xie/kisspng-twitch-computer-icons-logo-5af8037d689af0.0981376915262032614285.jpg
// @downloadURL https://update.greasyfork.org/scripts/524847/Twitchtv%20Frontpage%20Autoplay%20Off.user.js
// @updateURL https://update.greasyfork.org/scripts/524847/Twitchtv%20Frontpage%20Autoplay%20Off.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function pauseAutoplay() {
        // Multiple approaches
        const selectors = [
            '[class*="carousel"] video',
            '[class*="front-page"] video',
            '[class*="frontpage"] video',
            '[class*="hero"] video',
            '[data-a-target*="carousel"] video',
            'video[autoplay]'
        ];

        let videoPaused = false;

        selectors.forEach(selector => {
            const videos = document.querySelectorAll(selector);
            videos.forEach(video => {
                if (video && !video.paused && video.readyState > 0) {
                    video.pause();
                    video.autoplay = false;
                    video.setAttribute('autoplay', 'false');
                    videoPaused = true;
                    console.log("Frontpage video paused:", selector);
                }
            });
        });

        // Also pause any video that's currently playing on the front page
        if (window.location.pathname === '/' || window.location.pathname === '') {
            const allVideos = document.querySelectorAll('video');
            allVideos.forEach(video => {
                if (!video.paused && video.duration > 5) {
                    video.pause();
                    video.autoplay = false;
                    videoPaused = true;
                }
            });
        }

        return videoPaused;
    }

    // Run initially
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', pauseAutoplay);
    } else {
        pauseAutoplay();
    }

    // Enhanced observer with throttling
    let observerTimeout;
    const observer = new MutationObserver(function(mutations) {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            if (window.location.pathname === '/' || window.location.pathname === '') {
                pauseAutoplay();
            }
        }, 200);
    });

    if (document.body) {
        observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['autoplay', 'src']
        });
    }
})();
