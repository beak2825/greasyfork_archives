// ==UserScript==
// @name         Hide Wattpad Bottom Banner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the bottom banner on Wattpad.com
// @author       remmy89
// @match        https://www.wattpad.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465000/Hide%20Wattpad%20Bottom%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/465000/Hide%20Wattpad%20Bottom%20Banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the bottom banner element
    const bottomBanner = document.querySelector('.bottom-banner.dismissible.show');

    // Check if the element exists
    if (bottomBanner) {
        // Hide the element
        bottomBanner.style.display = 'none';
    }
})();