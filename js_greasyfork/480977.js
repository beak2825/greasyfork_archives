// ==UserScript==
// @name         Pinterest Copyrighted Audio Force Unmute
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license      MIT
// @description  Forces audio to be unmuted and sets volume to max on pinterest videos that are blocked in specific regions.
// @author       Bonkeyzz
// @match     https://*.pinterest.com/*
// @match     https://*.pinterest.at/*
// @match     https://*.pinterest.ca/*
// @match     https://*.pinterest.ch/*
// @match     https://*.pinterest.cl/*
// @match     https://*.pinterest.co.kr/*
// @match     https://*.pinterest.co.uk/*
// @match     https://*.pinterest.com.au/*
// @match     https://*.pinterest.com.mx/*
// @match     https://*.pinterest.de/*
// @match     https://*.pinterest.dk/*
// @match     https://*.pinterest.es/*
// @match     https://*.pinterest.fr/*
// @match     https://*.pinterest.ie/*
// @match     https://*.pinterest.info/*
// @match     https://*.pinterest.it/*
// @match     https://*.pinterest.jp/*
// @match     https://*.pinterest.nz/*
// @match     https://*.pinterest.ph/*
// @match     https://*.pinterest.pt/*
// @match     https://*.pinterest.se/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480977/Pinterest%20Copyrighted%20Audio%20Force%20Unmute.user.js
// @updateURL https://update.greasyfork.org/scripts/480977/Pinterest%20Copyrighted%20Audio%20Force%20Unmute.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set volume and unmute videos
    function setVideoProperties(video) {
        if(!video.muted || video.volume !== 0) return;
        video.volume = 1; // Set volume to maximum
        video.muted = false; // Keep it unmuted
    }

    // Function to continuously update video properties
    function updateVideoProperties() {
        // Find the elements containing the class 'hwa'
        const videoList = document.querySelectorAll('.hwa'); // Class 'hwa' is part of the pinterest video player

        // Update audio properties of each element
        videoList.forEach(setVideoProperties);

        // Repeat the process every second
        setTimeout(updateVideoProperties, 1000);
    }

    // Start updating video properties
    updateVideoProperties();
})();