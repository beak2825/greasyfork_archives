// ==UserScript==
// @name         Remove Spotify Now Playing View
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Remove the Now Playing view element and div with a specific class from the page
// @author       Drewby123
// @match        *://open.spotify*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524243/Remove%20Spotify%20Now%20Playing%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/524243/Remove%20Spotify%20Now%20Playing%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey script loaded');

    function removeNowPlayingView() {
        // Remove the Now Playing view by ID
        const nowPlayingView = document.getElementById('Desktop_PanelContainer_Id');
        if (nowPlayingView) {
            nowPlayingView.remove();
            console.log('Now Playing view removed');
        }

        // Remove the div with class OTfMDdomT5S7B5dbYTT8
        const specificDiv = document.querySelector('.OTfMDdomT5S7B5dbYTT8');
        if (specificDiv) {
            specificDiv.remove();
            console.log('Div with class OTfMDdomT5S7B5dbYTT8 removed');
        }
    }

    // Run the function when the page is fully loaded
    window.addEventListener('load', removeNowPlayingView);

    // Observe the document for dynamically added elements
    const observer = new MutationObserver(() => removeNowPlayingView());
    observer.observe(document.body, { childList: true, subtree: true });
})();
