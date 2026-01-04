// ==UserScript==
// @name        Always small font on Wikimedia websites
// @namespace
// @match       https://*.wikipedia.org/*
// @match       https://*.wikiquote.org/*
// @match       https://www.mediawiki.org/*
// @grant       none
// @version     1.2
// @author      Rose
// @description Automatically selects the Small font for the text on Wikipedia, Wikiquote and MediaWiki, bringing the size back to how it used to be and irrespective of whether cookies are enabled.
// @namespace https://greasyfork.org/users/1023939
// @downloadURL https://update.greasyfork.org/scripts/501217/Always%20small%20font%20on%20Wikimedia%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/501217/Always%20small%20font%20on%20Wikimedia%20websites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set the text size to "Small"
    function setTextSizeToSmall() {
        // Check if the page has the necessary elements
        const sizeRadio = document.querySelector('#skin-client-pref-vector-feature-custom-font-size-value-0');
        if (sizeRadio) {
            // Set the "Small" radio button to checked
            sizeRadio.checked = true;

            // Trigger a change event on the radio button
            const changeEvent = new Event('change');
            sizeRadio.dispatchEvent(changeEvent);
        }
    }

    // Function to wait for the necessary element to appear
    function waitForElement() {
        const FontSizeBox = document.querySelector('#skin-client-prefs-vector-feature-custom-font-size');
        if (FontSizeBox) {
            setTextSizeToSmall();
        } else {
            requestAnimationFrame(waitForElement);
        }
    }

    // Run the waitForElement function when the page loads
    window.addEventListener('load', waitForElement);
})();
