// ==UserScript==
// @name         Anna's Archive Wait Skipper (v4.1)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Finds the real download link on the slow download page and bypasses the timer.
// @author       You & Your Friend
// @match        *://annas-archive.org/slow_download/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532725/Anna%27s%20Archive%20Wait%20Skipper%20%28v41%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532725/Anna%27s%20Archive%20Wait%20Skipper%20%28v41%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- The Problem ---
    // The website now hides the real download button and shows a fake, disabled one first.
    // The real button is present in the HTML from the start but isn't immediately clickable.
    // Our goal is to find the correct button and click it as soon as the page lets us.

    // This is the selector for the main download button. It seems they now use this ID for it.
    const DOWNLOAD_BUTTON_SELECTOR = '#download-button';

    const attemptBypass = () => {
        // Find the one and only download button.
        const downloadButton = document.querySelector(DOWNLOAD_BUTTON_SELECTOR);

        // Check if the button exists and if it has an 'href' attribute.
        // The disabled button might not have an href, but the real one will.
        if (downloadButton && downloadButton.hasAttribute('href')) {
            console.log('Anna\'s Archive Skipper: Found the active download link. Clicking now!');

            // Stop the page's countdown timer script, just in case.
            window.stop();

            // Click the button to start the download.
            downloadButton.click();

            return true; // Signal that we're done.
        }

        // If we're here, the button wasn't ready yet.
        console.log('Anna\'s Archive Skipper: Waiting for the download button to become active...');
        return false;
    };

    // --- The Solution ---
    // A MutationObserver is the perfect tool for this job. It's super efficient.
    // It will watch the page for any changes and run our code only when something happens.
    const observer = new MutationObserver((mutationsList, obs) => {
        // We run our bypass function on every change until it succeeds.
        if (attemptBypass()) {
            // Once we've successfully clicked the button, we don't need to watch anymore.
            console.log('Anna\'s Archive Skipper: Bypass successful. Disconnecting observer.');
            obs.disconnect();
        }
    });

    // Start observing the whole document for changes to elements and their attributes.
    // This is robust because it will catch the moment the 'href' is added to the button.
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true // We also watch for attribute changes now!
    });

    // We can also try one initial time right away, just in case the button is ready on page load.
    attemptBypass();

})();