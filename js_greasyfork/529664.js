// ==UserScript==
// @name         Add Video Controls on Instagram
// @namespace    https://www.instagram.com/
// @version      1.2
// @license      CC BY-NC-SA 4.0
// @description  Adds controls to videos on Instagram.
// @author       Dan Martí
// @match        *://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529664/Add%20Video%20Controls%20on%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/529664/Add%20Video%20Controls%20on%20Instagram.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyVideo() {
        document.querySelectorAll('video.x1lliihq.x5yr21d.xh8yej3').forEach(video => {
            video.controls = true;

            // Save the mute and volume state before Instagram modifies them
            let prevMuted = video.muted;
            let prevVolume = video.volume;

            // Restore the mute and volume state when interacting with the video
            video.addEventListener('play', () => {
                video.muted = prevMuted;
                video.volume = prevVolume;
            });
            video.addEventListener('seeked', () => {
                video.muted = prevMuted;
                video.volume = prevVolume;
            });
            video.addEventListener('loadeddata', () => {
                video.muted = prevMuted;
                video.volume = prevVolume;
            });
        });
    }

    function removeDiv() {
        document.querySelectorAll('div.x5yr21d.x10l6tqk.x13vifvy.xh8yej3').forEach(div => {
            div.remove();
        });
    }

    // Run at the start and observe changes on the page
    const observer = new MutationObserver(() => {
        modifyVideo();
        removeDiv();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();