// ==UserScript==
// @name         Feedbin Enhancement
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Refine Feedbin appearance.
// @author       henryxrl
// @match        https://feedbin.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feedbin.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512468/Feedbin%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/512468/Feedbin%20Enhancement.meta.js
// ==/UserScript==

(function () {
    // CHANGE STYLES
    var css =`
        .scroll-bars { scrollbar-color: #91959b #fff !important; }
        .scroll-bars.theme-sunset { scrollbar-color: #8e8c88 #f5f2eb !important; }
        .scroll-bars.theme-dusk { scrollbar-color: #707070 #262626 !important; }
        .scroll-bars.theme-midnight { scrollbar-color: #595959 #000 !important }
        .feed-list li .link-inner { margin: 3px !important; font-size: 1rem !important; padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
        .entry-summary-link { line-height: 1.3 !important; font-size: 1rem !important; }
        `;
    GM_addStyle(css);



    // FIX failed images
    'use strict';

    // Flag to indicate if we need to check for image fixing
    let shouldCheckForImages = false;

    // fix failed images
    const fixImage = () => {
        console.log("Running fixImage...");
        document.querySelectorAll('div.entry-final-content img[data-camo-src]').forEach(function(img) {
            fetch(img.src)
                .then(response => {
                    if (!response.ok) { // If the response is not OK (e.g., 403)
                        img.src = img.getAttribute('data-camo-src'); // Switch to fallback
                    }
                })
                .catch(() => {
                    img.src = img.getAttribute('data-camo-src'); // Handle network errors
                });
        });
    };

    // Check if the entry-final-content has been loaded
    const waitForContentAndFixImages = () => {
        const entryContent = document.querySelector('div.entry-final-content');
        if (entryContent && shouldCheckForImages) {
            // Once content is loaded, fix the images
            fixImage();
            // Set flag to false after fixing images
            shouldCheckForImages = false;
        }
    };

    // Function to add event listeners dynamically to li.entry-summary elements
    const addClickListenerToLiElements = () => {
        document.querySelectorAll('li.entry-summary').forEach(li => {
            if (!li.hasListener) { // Check if the listener is already attached
                li.addEventListener('click', function() {
                    console.log("li.entry-summary clicked.");
                    // Set the flag to true when a new li.entry-summary is clicked
                    shouldCheckForImages = true;
                });
                li.hasListener = true; // Mark the element as having the listener
            }
        });
    };

    // Periodically check if we should fix images
    setInterval(waitForContentAndFixImages, 500); // Checks every 500ms if the content is ready

    // Periodically check if li.entry-summary elements are present and attach listeners
    setInterval(addClickListenerToLiElements, 1000); // Check every second for new li elements
})();


