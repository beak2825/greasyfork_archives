// ==UserScript==
// @name         Auto Orientation Fullscreen
// @namespace    https://github.com/ImPeekaboo
// @version      1.0
// @author       Ayam Penyet
// @description  Adjusts screen orientation to match video aspect ratio in fullscreen for android browser.
// @homepageURL  https://github.com/ImPeekaboo/auto-rotate-fullscreen
// @supportURL   https://github.com/ImPeekaboo/auto-rotate-fullscreen/issues
// @icon         https://cdn-icons-png.flaticon.com/512/10023/10023275.png
// @grant        none
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/521836/Auto%20Orientation%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/521836/Auto%20Orientation%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let orientationLocked = false;

    // Function to check if the video is landscape
    function isLandscape(video) {
        return video.videoWidth > video.videoHeight;
    }

    // Function to check if the video player is a native video player
    function isNativeVideoPlayer(videoElement) {
        if (videoElement && videoElement instanceof HTMLVideoElement) {
            const hasNativeControls = videoElement.controls === true;
            const hasSource = videoElement.querySelector('source') !== null;
            const hasWidthHeight = videoElement.clientWidth > 0 && videoElement.clientHeight > 0;

            // If the video has controls and width/height set, it's likely a native player
            return hasNativeControls && hasSource && hasWidthHeight;
        }
        return false; // Not a native player
    }

    // Lock or unlock screen orientation
    function setOrientation(video) {
        if (isNativeVideoPlayer(video)) {
            return; // Do not adjust orientation for native video players
        }

        if (screen.orientation) {
            const desiredOrientation = isLandscape(video) ? "landscape" : "portrait";
            if (orientationLocked && screen.orientation.locked !== desiredOrientation) {
                screen.orientation.lock(desiredOrientation).catch(console.warn);
            } else if (!orientationLocked) {
                screen.orientation.lock(desiredOrientation).then(() => {
                    orientationLocked = true;
                }).catch(console.warn);
            }
        }
    }

    // Unlock orientation when exiting fullscreen
    function unlockOrientation() {
        if (screen.orientation && orientationLocked) {
            screen.orientation.unlock().then(() => {
                orientationLocked = false;
            }).catch(console.warn);
        }
    }

    // Get the video element, including from shadow DOM and iframes
    function getVideoElement() {
        const fullscreenElem = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
        if (!fullscreenElem) return null;

        // Try to get video directly
        let video = fullscreenElem.querySelector('video');
        if (video) return video;

        // Check shadow DOM
        if (fullscreenElem.shadowRoot) {
            video = fullscreenElem.shadowRoot.querySelector('video');
            if (video) return video;
        }

        // Check iframes
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                video = iframeDoc.querySelector('video');
                if (video && iframeDoc.fullscreenElement) return video;
            } catch (e) {
                console.warn("Cross-origin iframe:", e);
            }
        }

        return null;
    }

    // Handle orientation when entering fullscreen
    function handleFullscreenChange() {
        const video = getVideoElement();
        if (video) {
            // Check and set orientation on entering fullscreen
            setOrientation(video);
            video.addEventListener('loadedmetadata', () => setOrientation(video), { once: true });
            video.addEventListener('play', () => setOrientation(video));
        } else {
            unlockOrientation(); // Unlock orientation when exiting fullscreen
        }
    }

    // Setup fullscreen event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    // Check for initial videos on page load
    const observer = new MutationObserver(() => {
        document.querySelectorAll('video:not([data-script-processed])').forEach(video => {
            video.setAttribute('data-script-processed', true);
            video.addEventListener('loadedmetadata', () => setOrientation(video), { once: true });
            video.addEventListener('play', () => setOrientation(video));
        });
    });
    observer.observe(document, { childList: true, subtree: true });
})();
