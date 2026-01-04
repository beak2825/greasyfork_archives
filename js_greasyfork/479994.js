// ==UserScript==
// @name         Disable YouTube Player Focus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevent focus on certain YouTube player elements
// @author       Smax2k
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479994/Disable%20YouTube%20Player%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/479994/Disable%20YouTube%20Player%20Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select the player elements you want to disable focus on
    var elementsToDisableFocus = document.querySelectorAll('.ytp-progress-bar, .ytp-scrubber-container, .ytp-volume-slider, .ytp-volume-panel, .ytp-mute-button, .ytp-button');

    // Disable focus for each selected element
    elementsToDisableFocus.forEach(function(element) {
        element.setAttribute('tabindex', '-1');
    });
})();
