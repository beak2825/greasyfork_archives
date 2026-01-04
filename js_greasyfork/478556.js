// ==UserScript==
// @name         XREL.to - Link to IMDB URL Decoder
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically decode and replace encoded URLs on xrel.to to imdb.com
// @author       MickyFoley
// @match        *://www.xrel.to/*
// @grant        none
// @license      GPL-3.0-only
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/478556/XRELto%20-%20Link%20to%20IMDB%20URL%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/478556/XRELto%20-%20Link%20to%20IMDB%20URL%20Decoder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to decode Base64
    function decodeBase64(encodedStr) {
        try {
            return atob(encodedStr);
        } catch (e) {
            console.error('Error decoding Base64: ', e);
            return null;
        }
    }

    function openLinkWithoutReferrer(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    function replaceAreaLinks() {
        console.log("Replacing area links..."); // Log to confirm execution
        // Find all area tags within map tags on the page
        var maps = document.getElementsByTagName('map');
        for (var i = 0; i < maps.length; i++) {
            var areas = maps[i].getElementsByTagName('area');
            for (var j = 0; j < areas.length; j++) {
                var area = areas[j];
                // Check if the area tag matches the specific pattern
                if (area.href.includes("/nfo-derefer.html?url=")) {
                    // Extract the encoded part of the URL
                    var encodedPart = area.href.split("url=")[1].split("&")[0];
                    // Decode URL-encoded characters
                    var decodedURIComponent = decodeURIComponent(encodedPart);
                    // Decode the Base64 URL
                    var decodedUrl = decodeBase64(decodedURIComponent);
                    if (decodedUrl) {
                        // Ensure the decoded URL starts with "https://"
                        if (!decodedUrl.startsWith('https://')) {
                            decodedUrl = 'https://' + decodedUrl.replace(/^http:\/\//i, '');
                        }
                        // Replace the href of the area tag with the decoded URL
                        area.href = decodedUrl;
                        // Remove referrer
                        area.rel = "noreferrer";
                        // Log the replacement for debugging
                        console.log("Replaced URL: ", decodedUrl);
                    }
                }
            }
        }
    }

    // Mutation observer for dynamic content
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // DOM has changed, replace links again
                replaceAreaLinks();
            }
        });
    });

    // Observe the entire document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Replace links on initial load
    replaceAreaLinks();
})();