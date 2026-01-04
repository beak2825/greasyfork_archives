// ==UserScript==
// @name         Yahoo Mail Ad Sidebar Hider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides the advertisement sidebar on Yahoo Mail website
// @author       sharmanhall
// @match        *://mail.yahoo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473892/Yahoo%20Mail%20Ad%20Sidebar%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/473892/Yahoo%20Mail%20Ad%20Sidebar%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the advertisement div
    function hideAdvertisement() {
        const adDiv = document.querySelector('div[data-test-id="mail-right-rail"]');
        if (adDiv) {
            adDiv.style.display = 'none';
        }
    }

    // Wait for the page to load, then hide the advertisement
    window.addEventListener('load', () => {
        hideAdvertisement();
    });

    // Optional: Add a click event listener to the "Hide Advertisement" button
    const hideButton = document.querySelector('div[data-test-id="right-rail-hidead-btn"]');
    if (hideButton) {
        hideButton.addEventListener('click', () => {
            hideAdvertisement();
        });
    }
})();
