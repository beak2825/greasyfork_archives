// ==UserScript==
// @name         Block YouTube's "Most Replayed" Graph
// @namespace    https://www.tampermonkey.net/
// @version      0.1
// @description  Blocks YouTube's "Most Replayed/Most Watched" feature graph and highlights.
// @author       NotScott
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @icon         https://www.youtube.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/480051/Block%20YouTube%27s%20%22Most%20Replayed%22%20Graph.user.js
// @updateURL https://update.greasyfork.org/scripts/480051/Block%20YouTube%27s%20%22Most%20Replayed%22%20Graph.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the Most Replayed Feature
    function blockMostReplayedFeature() {
        var mostReplayedElement = document.querySelector('.ytp-heat-map-chapter');
        if (mostReplayedElement) {
            mostReplayedElement.remove();
        }
    }

    // Run the function when the page is fully loaded
    window.addEventListener('load', blockMostReplayedFeature);

    // Also, run the function when the page changes dynamically (e.g., when navigating to a new video)
    var observer = new MutationObserver(blockMostReplayedFeature);
    observer.observe(document.body, { subtree: true, childList: true });
})();