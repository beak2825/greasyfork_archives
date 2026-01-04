// ==UserScript==
// @name         aichattings Private album unblur.
// @namespace    https://aichattings.com/
// @version      1.1
// @description  removes blurring from chatbot images
// @author       r_0_b_3_3
// @match        *://*.aichattings.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525650/aichattings%20Private%20album%20unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/525650/aichattings%20Private%20album%20unblur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to override the zoom property in CSS (only once)
    function overrideZoom() {
        const appElement = document.querySelector('#app');
        if (appElement) {
            appElement.style.zoom = '0.9';
        }
    }

    // Function to modify the HTML structure
    function modifyHtmlStructure() {
        const messageItems = document.querySelectorAll('.message-item.bot');
        messageItems.forEach(item => {
            const imgContent = item.querySelector('.img-content.private-albums');
            if (imgContent) {
                imgContent.classList.remove('private-albums');

                // Remove the 'blur' class from the image
                const img = imgContent.querySelector('.img.blur');
                if (img) {
                    img.classList.remove('blur');
                }

                // Remove the lock element
                const lockElement = imgContent.querySelector('.lock');
                if (lockElement) {
                    lockElement.remove();
                }
            }
        });
    }

    // Observer to watch for new elements
    function observeNewElements() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    modifyHtmlStructure();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    // Run the zoom function once on page load
    window.addEventListener('load', () => {
        overrideZoom();
    });

    // Run the observer to watch for new elements
    observeNewElements();

})();