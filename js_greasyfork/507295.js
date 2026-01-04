// ==UserScript==
// @name         Sync Google Searches to Bing (Invisible XMLHttpRequest)
// @namespace    Violentmonkey Scripts
// @version      1.6
// @description  Automatically searches on Bing when you search on Google, using an invisible XMLHttpRequest
// @author       intercepted16
// @include      https://www.google.com/*
// @include      https://www.google.*/*
// @grant        GM_xmlhttpRequest
// @connect      bing.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507295/Sync%20Google%20Searches%20to%20Bing%20%28Invisible%20XMLHttpRequest%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507295/Sync%20Google%20Searches%20to%20Bing%20%28Invisible%20XMLHttpRequest%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the regex pattern for matching Google search URLs
    const googleSearchRegex = /^https:\/\/www\.google\.(com|com\.[a-z]{2,3})\/search.*/;

    // Check if the current URL matches the Google search pattern
    if (googleSearchRegex.test(window.location.href)) {
        // Extract search query from the Google URL
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');

        if (query) {
            let bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

            // Function to check if the user is on a mobile device
            function isMobile() {
                return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
            }

            // Add additional query parameters only if the user is not on a mobile device
            if (!isMobile()) {
                bingUrl += `&cvid=5ea855fc7c2446b79bd423c6c8dfcca3&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQABhAMgYIAhAuGEAyBggDEC4YQDIGCAQQLhhAMgYIBRAuGEAyBggGEAAYQDIGCAcQABhAMgYICBAuGEDSAQc1NjZqMGoxqAIAsAIA&FORM=ANSPA1&PC=U531`;
            }

            // Use GM_xmlhttpRequest to send a GET request to Bing
            GM_xmlhttpRequest({
                method: "GET",
                url: bingUrl,
                onload: function(response) {
                    console.log("Bing search performed silently");
                },
                onerror: function(error) {
                    console.error("Error performing Bing search:", error);
                }
            });
        }
    }
})();
