// ==UserScript==
// @name         Windy.com country remover
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Removes specific elements from windy.com
// @author       UAEpro
// @match        https://*.windy.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515622/Windycom%20country%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/515622/Windycom%20country%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements
    function removeElements() {
        // Remove "open-in-app" element
        const openInApp = document.getElementById('open-in-app');
        if (openInApp) {
            openInApp.remove();
        }

        // Remove marker pane
        const markerPane = document.querySelector('.leaflet-pane.leaflet-marker-pane');
        if (markerPane) {
            markerPane.remove();
        }

        // Remove logo
        const logo = document.getElementById('logo');
        if (logo) {
            logo.remove();
        }
    }

    // Initial removal
    removeElements();

    // Set up a MutationObserver to handle dynamically loaded elements
    const observer = new MutationObserver(function(mutations) {
        removeElements();
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();