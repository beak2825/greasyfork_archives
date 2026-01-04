// ==UserScript==
// @name         Jio Premium
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Jio Premium logo and Remove Jiocinema Watermark
// @author       devilrajat
// @match        https://www.jiocinema.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jiocinema.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500277/Jio%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/500277/Jio%20Premium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the content of the target element
    function changeContent() {
        // Select the paragraph element with the specific class
        var upgradeElement = document.querySelector('.MuiTypography-root.MuiTypography-body1Bold.mui-style-gbwi1-fontStyle');

        // If the element exists and contains the text 'Upgrade', change its content
        if (upgradeElement && upgradeElement.textContent.includes('Upgrade')) {
            upgradeElement.textContent = upgradeElement.textContent.replace('Upgrade', 'Premium');
            return true; // Indicate that the change has been made
        }
        return false; // Indicate that the change has not been made
    }

    // Function to remove a specific <div> element
    function removeLogoDiv() {
        var logoDiv = document.querySelector('.flex.items-center.justify-end.logoContainer');
        if (logoDiv) {
            logoDiv.remove();
            return true; // Indicate that the div has been removed
        }
        return false; // Indicate that the div has not been found/removed
    }

    // Try to change the content and remove the div immediately if the elements exist
    var contentChanged = changeContent();
    var logoRemoved = removeLogoDiv();

    // If the elements weren't found, create a MutationObserver to wait for them
    if (!contentChanged || !logoRemoved) {
        var observer = new MutationObserver(function(mutations) {
            var contentChanged = changeContent();
            var logoRemoved = removeLogoDiv();

            // Once the changes have been made, disconnect the observer
            if (contentChanged && logoRemoved) {
                observer.disconnect();
            }
        });

        // Start observing the document for added nodes
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
})();