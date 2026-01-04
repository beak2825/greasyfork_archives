// ==UserScript==
// @name         Replace Roblox Images with Cats
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces all images on Roblox with random cat images
// @author       Your Name
// @match        *://*.roblox.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/523501/Replace%20Roblox%20Images%20with%20Cats.user.js
// @updateURL https://update.greasyfork.org/scripts/523501/Replace%20Roblox%20Images%20with%20Cats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to fetch a random cat image URL
    function getRandomCatImage(callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.thecatapi.com/v1/images/search",
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data && data[0] && data[0].url) {
                    callback(data[0].url);
                } else {
                    console.error("Failed to fetch a cat image.");
                }
            },
            onerror: function() {
                console.error("Error fetching the cat image.");
            }
        });
    }

    // Function to replace images
    function replaceImages() {
        const images = document.querySelectorAll("img");
        images.forEach((img) => {
            getRandomCatImage((catUrl) => {
                img.src = catUrl; // Replace image source with cat image
            });
        });
    }

    // Observe for new elements added dynamically (e.g., infinite scrolling)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                replaceImages();
            }
        });
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial image replacement
    replaceImages();
})();
