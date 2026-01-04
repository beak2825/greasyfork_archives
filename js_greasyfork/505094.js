// ==UserScript==
// @name         YouTube to YouTube No-Cookie Embed Player
// @namespace    https://gist.github.com/thedoggybrad/4e17b0046ce072afc3f31610dcdef32a
// @version      0.0.3
// @description  RedirectYouTube video URLs to the no-cookie embed player and stop all requests from loading
// @author       TheDoggyBrad Software Labs
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT--0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/505094/YouTube%20to%20YouTube%20No-Cookie%20Embed%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/505094/YouTube%20to%20YouTube%20No-Cookie%20Embed%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to block all network requests
    function blockNetworkRequests() {
        // Intercept fetch API
        const originalFetch = window.fetch;
        window.fetch = function() {
            return new Promise((resolve, reject) => {
                // Reject all network requests made to YouTube domains
                if (arguments[0].includes('youtube.com') || arguments[0].includes('google.com')) {
                    reject('Blocked YouTube Request');
                } else {
                    resolve(originalFetch.apply(this, arguments));
                }
            });
        };

        // Intercept XMLHttpRequest
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            xhr.open = function(method, url) {
                if (url.includes('youtube.com') || url.includes('google.com')) {
                    console.log('Blocked YouTube Request');
                    xhr.abort();
                } else {
                    originalOpen.apply(this, arguments);
                }
            };
            return xhr;
        };
    }

    // Function to redirect to no-cookie embed
    function redirectToEmbed() {
        let currentUrl = window.location.href;

        // Check if the current URL is a YouTube video page
        let match = currentUrl.match(/https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);

        if (match) {
            let videoId = match[1];
            let embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

            // Redirect immediately without letting the original page load
            if (window.location.href !== embedUrl) {
                window.location.replace(embedUrl); // Prevent page load by redirecting
            }
        }
    }

    // Run the redirection as early as possible (before any content loads)
    redirectToEmbed();

    // Block all network requests (scripts, images, etc.) to YouTube and Google domains
    blockNetworkRequests();

})();