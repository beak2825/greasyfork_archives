// ==UserScript==
// @name          CIJ subtitle show on pause (Dynamic)
// @namespace     http://tampermonkey.net/
// @version       0.0.3
// @description   Automatically shows subtitles when video pauses and hides them when it plays.
// @author        Sapjax
// @license MIT
// @match         https://cijapanese.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=cijapanese.com
// @grant         none
// @run-at        document-body
// @downloadURL https://update.greasyfork.org/scripts/542272/CIJ%20subtitle%20show%20on%20pause%20%28Dynamic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542272/CIJ%20subtitle%20show%20on%20pause%20%28Dynamic%29.meta.js
// ==/UserScript==

(function() {
    const videoSelector = 'video';
    const subtitleSelector = '.vds-captions';

    let currentVideo = null;
    let currentSubtitle = null;

    const handlePlay = () => {
        document.querySelector(subtitleSelector)?.setAttribute('aria-hidden', 'true');
        console.log('Video playing, subtitles hidden.');
    };

    const handlePause = () => {
        const subTitle = document.querySelector(subtitleSelector)
        if(subTitle) {
            subTitle?.setAttribute('aria-hidden','false');
            const currentSubBtn = document.querySelector('.btn-ghost-yellow')
            const shortParagraphsBtn = document.querySelectorAll('[aria-labelledby="transcript"] .form-check-input')[3]
            if(currentSubBtn && shortParagraphsBtn) {
                if(!shortParagraphsBtn.checked) {
                    shortParagraphsBtn.click()
                }
                setTimeout(() => {
                    const text = currentSubBtn.nextElementSibling.innerHTML
                    subTitle.querySelector('[data-part="cue"]').innerHTML = text;
                },0)
            }
            console.log('Video paused, subtitles shown.');
        }

    };


    function attachListeners(videoElement) {
        if (currentVideo === videoElement) {
            return;
        }

        // Clean up old listeners if a different video was being observed
        if (currentVideo) {
            removeListeners(currentVideo);
        }

        console.log('Attaching listeners to video and subtitle.');
        videoElement.addEventListener('play', handlePlay);
        videoElement.addEventListener('pause', handlePause);

        currentVideo = videoElement;
    }


    function removeListeners(videoElement) {
        console.log('Removing listeners from video.');
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);

        currentVideo = null;
        currentSubtitle = null;
    }

    // --- MutationObserver Setup ---
    const observer = new MutationObserver((mutationsList, obs) => {
        const video = document.querySelector(videoSelector);

        if (video) {
            if (video !== currentVideo) {
                console.log('Video found or changed. Attaching listeners.');
                attachListeners(video);
            }

        }
        // Scenario 2: Video are no longer present
        else if (!video && currentVideo) { // If video disappeared
            console.log('Video disappeared. Removing listeners.');
            removeListeners(currentVideo);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check in case the video and subtitle are already present on page load
    const initialVideo = document.querySelector(videoSelector);
    if (initialVideo) {
        console.log('Initial video found on page load. Attaching listeners.');
        attachListeners(initialVideo);
    } else {
        console.log('Video not found on initial load. Waiting for DOM changes.');
    }
})();