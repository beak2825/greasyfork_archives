// ==UserScript==
// @name        Open with MPV
// @namespace   Violentmonkey Scripts
// @match       https://barbarian.men/*
// @grant       GM_registerMenuCommand
// @version     1.0
// @author      -
// @description Open video in external video player
// @run-at      document-idle
// @license     AGPL
// @downloadURL https://update.greasyfork.org/scripts/545568/Open%20with%20MPV.user.js
// @updateURL https://update.greasyfork.org/scripts/545568/Open%20with%20MPV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function downloadFile(text) {
        const blob = new Blob([text], { type: 'audio/x-mpegurl' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function openWithMPV() {
        const videoSource = document.querySelector('video source');
        if (!videoSource) {
            console.warn('No <video><source> found yet, retrying...');
            setTimeout(openWithMPV, 1000);
            return;
        }

        const src = videoSource.src;
        if (!src) {
            console.error('Video source URL not found.');
            return;
        }

        downloadFile("#EXTM3U\n" + src);
    }

    GM_registerMenuCommand("Open video with MPV", openWithMPV);
})();
