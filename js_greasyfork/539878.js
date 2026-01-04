// ==UserScript==
// @name         Make Language Reactor campatible with Yomitan
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Waits for Language Reactor panel to load, then removes <br> tags from subtitles, so that when using yomitan can pick up full sentence when scanning the subtitle inside video.
// @author       cokoryu@outlook.com
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539878/Make%20Language%20Reactor%20campatible%20with%20Yomitan.user.js
// @updateURL https://update.greasyfork.org/scripts/539878/Make%20Language%20Reactor%20campatible%20with%20Yomitan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This is the function that contains your original logic.
    function removeBrTags() {
        // Find the Language Reactor subtitle container.
        const llnSubs = document.querySelector("#lln-subs");

        // If it doesn't exist for some reason, just stop.
        if (!llnSubs) {
            console.log("Language Reactor Improver: #lln-subs not found yet.");
            return;
        }

        console.log("Language Reactor Improver: #lln-subs found! Removing <br> tags.");

        const brTags = llnSubs.querySelectorAll('br');
        brTags.forEach(br => {
            br.remove();
        });

        // We can also observe the subtitle panel itself for changes,
        // in case new subtitles with <br> tags are loaded later.
        const subObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                     const newBrTags = llnSubs.querySelectorAll('br');
                     if (newBrTags.length > 0) {
                         // console.log("Language Reactor Improver: New <br> tags detected, removing...");
                         newBrTags.forEach(br => br.remove());
                     }
                }
            }
        });

        // Start observing the subtitle panel for new children being added.
        subObserver.observe(llnSubs, { childList: true, subtree: true });
    }

    // This function will wait for the #lln-subs element to be added to the page.
    function waitForElement(selector, callback) {
        // Check if the element already exists
        if (document.querySelector(selector)) {
            callback();
            return;
        }

        // If not, set up a MutationObserver to watch for it
        const observer = new MutationObserver((mutations, me) => {
            if (document.querySelector(selector)) {
                callback();
            }
        });

        // Start observing the entire document for additions
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // --- Main Execution ---

    // This is the key part:
    // We wait for the '#lln-subs-container' (a parent element that loads first)
    // before running our main function.
    waitForElement('#lln-subs', removeBrTags);

})();