// ==UserScript==
// @name         Auto Select Wikipedia Color Theme
// @namespace    https://github.com/nullstreak
// @version      1.5
// @license MIT
// @description  Automatically select the "Automatic" color theme on Wikipedia
// @match        https://*.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532741/Auto%20Select%20Wikipedia%20Color%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/532741/Auto%20Select%20Wikipedia%20Color%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to wait for element to be available in DOM
    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.getElementById(selector)) {
                return resolve(document.getElementById(selector));
            }

            const observer = new MutationObserver(mutations => {
                const element = document.getElementById(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        });
    }

    // Main function to handle the theme selection
    async function selectAutoTheme() {
        try {
            const autoColorInput = await waitForElement('skin-client-pref-skin-theme-value-os');
            autoColorInput.click();
        } catch (error) {
            console.error('Error selecting auto theme:', error);
        }
    }

    // Start the process
    selectAutoTheme();
})();