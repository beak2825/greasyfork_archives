// ==UserScript==
// @name         Google Chat Remove Previews
// @namespace    https://greasyfork.org/en/users/923902-mike-schuchardt
// @version      0.3
// @description  Removes existing preview cards and tries to prevent new ones
// @author       Mike Schuchardt
// @license      MIT
// @match        https://chat.google.com/*

// @downloadURL https://update.greasyfork.org/scripts/446279/Google%20Chat%20Remove%20Previews.user.js
// @updateURL https://update.greasyfork.org/scripts/446279/Google%20Chat%20Remove%20Previews.meta.js
// ==/UserScript==

// jshint esversion: 6

(function() {
    'use strict';

    // Helper to remove previews descending from the given element
    let removePreviews = function(element) {
        // Remove existing preview cards from chat log
        for(let previewLink of element.querySelectorAll('div > div > a[aria-label $= "Web Page."]')) {
            console.log("Removing preview card for:", previewLink.getAttribute('href'));
            previewLink.parentElement.parentElement.remove();
        }
        // Click X button for new preview cards
        for (let previewRemove of element.querySelectorAll('div > div[aria-label$="Web Page."] + div > div[aria-label^="Remove"]')) {
            console.log("Clicking remove button:", previewRemove.getAttribute('aria-label'));
            previewRemove.click();
        }
    };

    // Start by removing all existing previews at document load
    removePreviews(document.body);

    // Register handler to catch new previews as they are added to the DOM
    let observer = new MutationObserver(mutations => {
        for(let mutation of mutations) {
            for(let addedNode of mutation.addedNodes) {
                if (addedNode.nodeType == Node.ELEMENT_NODE) {
                    removePreviews(addedNode);
                }
            }
        }
    });
    observer.observe(document, { childList: true, subtree: true });

})();