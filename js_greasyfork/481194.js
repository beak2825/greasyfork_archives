// ==UserScript==
// @name         Adblock Scroll Unblocker and Ad Elements Remover for OneJailbreak.com
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enable scrolling on pages that block it due to adblock detection and remove specific ad elements
// @icon         https://www.google.com/s2/favicons?domain=onejailbreak.com
// @author       sharmanhall
// @match        https://onejailbreak.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481194/Adblock%20Scroll%20Unblocker%20and%20Ad%20Elements%20Remover%20for%20OneJailbreakcom.user.js
// @updateURL https://update.greasyfork.org/scripts/481194/Adblock%20Scroll%20Unblocker%20and%20Ad%20Elements%20Remover%20for%20OneJailbreakcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to enable scrolling by changing body's style
    const enableScrolling = () => {
        document.body.style.overflow = 'auto';
    };

    // Function to remove specified elements from the page
    const removeAdElements = () => {
        // Remove the 'contentInfo' div element
        const contentInfoElement = document.getElementById('statementBox');
        if (contentInfoElement) {
            contentInfoElement.remove();
        }

        // Remove 'anchores' div elements containing ads
        const adElements = document.querySelectorAll('.anchores');
        adElements.forEach(el => el.remove());
    };

    // Wait for the document to be fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Call the functions to enable scrolling and remove ad elements
        enableScrolling();
        removeAdElements();
    });

    // Observe for any changes that might re-disable scrolling or re-add ad elements
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // If body's style is modified, re-enable scrolling
            if (mutation.attributeName === 'style') {
                enableScrolling();
            }
            // Check and remove ad elements if they are added again
            removeAdElements();
        });
    });

    // Configuration for the observer
    const config = { attributes: true, childList: true, subtree: true };

    // Start observing the body element for changes in attributes and child elements
    observer.observe(document.body, config);
})();
