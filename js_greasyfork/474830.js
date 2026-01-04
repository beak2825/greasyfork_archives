// ==UserScript==
// @name         Youtube hide 'For you' and 'People also watched'
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides the annoying and irrelevant 'For you' and 'People also watched' segments spliced the middle of your search results.
// @author       Radaman
// @match        https://www.youtube.com/*
// @match        https://consent.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474830/Youtube%20hide%20%27For%20you%27%20and%20%27People%20also%20watched%27.user.js
// @updateURL https://update.greasyfork.org/scripts/474830/Youtube%20hide%20%27For%20you%27%20and%20%27People%20also%20watched%27.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Verbosity
    let verbose = false;

    // Select the node that will be observed for mutations
    const targetNode = document.getRootNode();

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.target.nodeName == 'YTD-SHELF-RENDERER') {
                mutation.target.remove();
                if (verbose) {
                    console.log('Removed annoying shelf.');
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
