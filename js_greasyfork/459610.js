// ==UserScript==
// @name         YouTube Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Blocks ads on YouTube videos
// @author       Your Name
// @match        *://www.youtube.com/watch*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459610/YouTube%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/459610/YouTube%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hide the video ad container
    var adContainer = document.getElementById("video-ads");
    if (adContainer) {
        adContainer.style.display = "none";
    }

    // Remove the ad banner
    var adBanner = document.getElementById("masthead-ad");
    if (adBanner) {
        adBanner.style.display = "none";
    }
})();
