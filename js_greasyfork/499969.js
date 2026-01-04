// ==UserScript==
// @name         YouTube Default to 1080p
// @description  Force YouTube to default to 1080p quality
// @namespace    http://tampermonkey.net/
// @version      0.6
// @author       Kayleigh (https://github.com/kayleighember)
// @license      MIT
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-end
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/499969/YouTube%20Default%20to%201080p.user.js
// @updateURL https://update.greasyfork.org/scripts/499969/YouTube%20Default%20to%201080p.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function selectHighestQuality() {
        const video = document.querySelector('video');
        if (video && video.getAvailableQualityLevels) {
            const qualities = video.getAvailableQualityLevels();
            if (qualities.includes('hd1080')) {
                video.setPlaybackQuality('hd1080');
            } else if (qualities.includes('hd720')) {
                video.setPlaybackQuality('hd720');
            }
        }
    }

    // Run when a new video loads
    function onNavigate() {
        // Wait a bit for the player to initialize
        setTimeout(selectHighestQuality, 1000);
    }

    // YouTube uses history.pushState for navigation
    const pushState = history.pushState;
    history.pushState = function() {
        pushState.apply(history, arguments);
        onNavigate();
    };

    // Run on initial page load
    onNavigate();
})();
