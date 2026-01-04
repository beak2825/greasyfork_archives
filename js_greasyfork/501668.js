// ==UserScript==
// @name         Unrecommended (Cleaned)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Remove YouTube homepage videos with less than 5000 views or watched over 75% to avoid layout gaps. Only runs on homepage.
// @author       Fraktal
// @match        https://www.youtube.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501668/Unrecommended%20%28Cleaned%29.user.js
// @updateURL https://update.greasyfork.org/scripts/501668/Unrecommended%20%28Cleaned%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function parseViewCount(viewCountText) {
        const normalizedText = viewCountText.replace(/[^0-9KM.]/g, '');
        let multiplier = 1;

        if (normalizedText.endsWith('K')) {
            multiplier = 1000;
        } else if (normalizedText.endsWith('M')) {
            multiplier = 1000000;
        }

        return parseFloat(normalizedText) * multiplier;
    }

    function removeLowViewCountOrWatchedVideos() {
        const videoElements = document.querySelectorAll('#dismissible');

        videoElements.forEach(video => {
            let removeVideo = false;

            const viewCountElement = video.querySelector('.inline-metadata-item.style-scope.ytd-video-meta-block');
            if (viewCountElement) {
                const viewCountText = viewCountElement.innerText;
                const viewCount = parseViewCount(viewCountText);

                if (viewCount < 5000) {
                    removeVideo = true;
                }
            }

            const progressBarElement = video.querySelector('#progress');
            if (progressBarElement) {
                const progressBarWidth = parseFloat(progressBarElement.style.width);
                if (progressBarWidth >= 75) {
                    removeVideo = true;
                }
            }

            if (removeVideo) {
                const parentElement = video.closest('ytd-grid-video-renderer') || 
                                      video.closest('ytd-rich-item-renderer') || 
                                      video.closest('ytd-video-renderer') || 
                                      video.closest('ytd-compact-video-renderer');

                if (parentElement) {
                    parentElement.remove(); // completely remove from DOM
                } else {
                    video.remove(); // fallback
                }
            }
        });
    }

    // Initial run after load delay (YouTube loads slowly)
    setTimeout(() => {
        removeLowViewCountOrWatchedVideos();
    }, 1000);

    // Watch for dynamic content loading
    const observer = new MutationObserver(() => {
        removeLowViewCountOrWatchedVideos();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
