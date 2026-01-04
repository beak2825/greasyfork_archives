// ==UserScript==
// @name         Image Replacement
// @namespace    1gd67390i
// @version      1.0
// @description  Replaces the image source on specific websites
// @match        *://vanced-youtube.neocities.org/2015/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470067/Image%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/470067/Image%20Replacement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select the image element to be replaced
    var image = document.querySelector('img[src="/images/nav_logo225_hr.png"]');

    // Check if the image element exists
    if (image) {
        // Replace the image source
        image.src = 'https://googlewebhp.neocities.org/nav_logo224_hr.png';
    }
})();