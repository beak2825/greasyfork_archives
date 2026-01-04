// ==UserScript==
// @name         Twitch Middle Mouse Button Mute / Unmute
// @author       NWP
// @description  Mutes / unmutes a Twitch video by clicking the middle mouse button within the video player. While performing the middle mouse button click, the scroll button gets disabled. Mute / unmute / scroll disabling won't work with any elements floating over the video player.
// @namespace    https://greasyfork.org/users/877912
// @version      0.1
// @license      MIT
// @match        *://*.twitch.tv/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501777/Twitch%20Middle%20Mouse%20Button%20Mute%20%20Unmute.user.js
// @updateURL https://update.greasyfork.org/scripts/501777/Twitch%20Middle%20Mouse%20Button%20Mute%20%20Unmute.meta.js
// ==/UserScript==

(function() {
    // div[data... is for when the controls are visible, video is for when the controls are hidden
    // due to https://greasyfork.org/en/scripts/501592-auto-hide-video-controls-almost-instantly-really-quickly-for-the-twitch-desktop-and-mobile-site
    // being enabled
    //
    // Normally, only div[data... is needed
    const videoArea = "div[data-a-target='player-overlay-click-handler'], video";
    const muteButton = "button[data-a-target='player-mute-unmute-button']";

    function handleMiddleMouseButtonDown(event) {
        if (event.button === 1 && event.target.closest(videoArea)) {
            event.preventDefault();
            const button = document.querySelector(muteButton);
            if (button) {
                button.click();
            }
        }
    }

    function addEventListenersToVideos() {
        const videos = document.querySelectorAll(videoArea);
        videos.forEach((video) => {
            video.removeEventListener('mousedown', handleMiddleMouseButtonDown);
            video.addEventListener('mousedown', handleMiddleMouseButtonDown);
        });
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.matches(videoArea) || node.querySelector(videoArea)) {
                            addEventListenersToVideos();
                        }
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    addEventListenersToVideos();
})();