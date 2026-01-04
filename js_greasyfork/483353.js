// ==UserScript==
// @name        Disable YouTube Subtitles
// @namespace   https://greasyfork.org/en/users/1229931-aeos7
// @match       https://*.youtube.com/*
// @run-at      document-end
// @grant       none
// @version     1.0.3
// @author      AEOS7
// @description Disables subtitles on YouTube videos
// @downloadURL https://update.greasyfork.org/scripts/483353/Disable%20YouTube%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/483353/Disable%20YouTube%20Subtitles.meta.js
// ==/UserScript==

document.querySelector('video')
    .addEventListener('play', () => { // When video is played
        document.querySelector(".ytp-subtitles-button.ytp-button")
            .innerHTML.match('unavailable') === null && document.querySelector(".ytp-subtitles-button.ytp-button")
            .ariaPressed === 'true' ? document.querySelector(".ytp-subtitles-button.ytp-button")
            .click() : ''; // Auto-disable subtitles if available and they are enabled
    }, {
        once: true
    }); // Finishes timeupdate event listener