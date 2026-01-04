// ==UserScript==
// @name         YouTube Short Link Copier 
// @namespace    https://greasyfork.org/en/scripts/474134-youtube-short-link-copier
// @version      3.2
// @description  Copy the short YouTube link directly when pressing Shift + S, and with timestamp when pressing Shift + C.
// @author       passerbynwfow
// @match        https://www.youtube.com/*
// @match        https://music.youtube.com/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474134/YouTube%20Short%20Link%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/474134/YouTube%20Short%20Link%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getVideoIDFromQuery() {
        return new URLSearchParams(window.location.search).get("v");
    }

    function getCurrentPlaybackTimeInSeconds() {
        const videoElem = document.querySelector('video');
        return videoElem ? Math.floor(videoElem.currentTime) : 0;
    }

    document.addEventListener('keydown', function(e) {
        if (!e.shiftKey) return;

        const host = window.location.host;
        const videoID = getVideoIDFromQuery();
        const currentSeconds = getCurrentPlaybackTimeInSeconds();

        if (e.key === 'S') {
            if (host === 'www.youtube.com' && window.location.pathname.startsWith('/shorts/')) {
                GM_setClipboard(window.location.href);
                return;
            }

            const baseLink = host === 'www.youtube.com' ? 'https://youtu.be/' : 'https://music.youtube.com/watch?v=';
            if (videoID) GM_setClipboard(`${baseLink}${videoID}`);
        } else if (e.key === 'C' && videoID) {
            const baseLink = host === 'www.youtube.com' ? 'https://youtu.be/' : 'https://music.youtube.com/watch?v=';
            GM_setClipboard(`${baseLink}${videoID}&t=${currentSeconds}`);
        }
    });
})();
