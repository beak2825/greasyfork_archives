// ==UserScript==
// @name         Close eBay Pop-up
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically close eBay pop-up
// @author       Your Name
// @match        https://*.ebay.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493504/Close%20eBay%20Pop-up.user.js
// @updateURL https://update.greasyfork.org/scripts/493504/Close%20eBay%20Pop-up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the pop-up to appear
    var waitForPopUp = setInterval(function() {
        // Check if the pop-up is present
        var popUp = document.querySelector('.lightbox-dialog__window');
        if (popUp) {
            // Find the close button element and click it
            var closeButton = document.querySelector('.lightbox-dialog__close');
            if (closeButton) {
                closeButton.click();
                clearInterval(waitForPopUp); // Stop checking once the pop-up is closed
            }
        }
    }, 1000); // Check every 1 second
})();
