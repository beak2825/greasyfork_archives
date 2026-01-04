// ==UserScript==
// @name         YouTube Video Quality Changer (using number keys)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  change video quality of youtube videos using number keys
// @author       ankit
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538048/YouTube%20Video%20Quality%20Changer%20%28using%20number%20keys%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538048/YouTube%20Video%20Quality%20Changer%20%28using%20number%20keys%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Map number keys to quality labels
    const qualityMap = {
        '1': 'tiny',   // 144p
        '2': 'small',  // 240p
        '3': 'medium', // 360p
        '4': 'large',  // 480p
        '7': 'hd720',  // 720p
        '8': 'hd1080', // 1080p
        '9': 'hd1440'  // 1440p (2K)
    };

    // Convert key code or key string to mapped quality
    function getQuality(key) {
        return qualityMap[key] || null;
    }

    // Set video quality using YouTube player API
    function setQuality(quality) {
        const player = document.getElementById('movie_player');
        if (!player || typeof player.getAvailableQualityLevels !== 'function' || typeof player.setPlaybackQualityRange !== 'function') {
            console.log('YouTube player not ready or API missing');
            return;
        }

        const availableQualities = player.getAvailableQualityLevels(); // e.g. ['hd1080','hd720','large', ...]
        if (!availableQualities || availableQualities.length === 0) {
            console.log('No quality levels available');
            return;
        }

        // Find closest matching quality supported
        if (availableQualities.includes(quality)) {
            player.setPlaybackQualityRange(quality);
            console.log(`Quality set to: ${quality}`);
        } else {
            // If exact quality not found, fallback to highest available below requested quality
            const ordered = ['tiny','small','medium','large','hd720','hd1080','hd1440','hd2160','highres'];
            const requestedIndex = ordered.indexOf(quality);
            if (requestedIndex === -1) {
                console.log('Requested quality not recognized:', quality);
                return;
            }
            // Find best fallback quality available
            let fallback = null;
            for (let i = requestedIndex; i >= 0; i--) {
                if (availableQualities.includes(ordered[i])) {
                    fallback = ordered[i];
                    break;
                }
            }
            if (fallback) {
                player.setPlaybackQualityRange(fallback);
                console.log(`Quality set to fallback: ${fallback}`);
            } else {
                console.log('No suitable fallback quality found');
            }
        }
    }

    window.addEventListener('keydown', function(e) {
        // Only trigger if no modifier keys pressed
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

        // Get the pressed key
        const key = e.key;

        const quality = getQuality(key);
        if (quality) {
            e.preventDefault();
            e.stopImmediatePropagation();
            setQuality(quality);
        }
    }, true);  // Use capture to intercept before YouTube handles it

})();
