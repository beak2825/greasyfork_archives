// ==UserScript==
// @name         Facebook Reel to Watch Link Converter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Convert Facebook reel links to watch links
// @author       w4t3r1ily
// @match        *://*/*
// @include      *
// @grant        none
// @icon https://cdn.iconscout.com/icon/free/png-512/free-instagram-reel-6807451-5582462.png?
// @downloadURL https://update.greasyfork.org/scripts/500739/Facebook%20Reel%20to%20Watch%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/500739/Facebook%20Reel%20to%20Watch%20Link%20Converter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to create the new watch link element with an arrow sign
    function createWatchLink(videoId) {
        const watchLink = document.createElement('a');
        watchLink.href = `https://www.facebook.com/watch/?v=${videoId}`; // Construct the watch URL using the video ID
        watchLink.textContent = `⇒ https://www.facebook.com/watch/?v=${videoId}`; // Set the text content of the link with an arrow sign
        return watchLink; // Return the newly created link element
    }

    // Get all anchor elements on the page
    const links = document.querySelectorAll('a');

    // Iterate over each link
    links.forEach(link => {
        // Match the URL against the specific Facebook reel pattern and extract the video ID
        const match = link.href.match(/https:\/\/www\.facebook\.com\/reel\/(\d+)/);
        if (match) {
            const videoId = match[1]; // Extract the video ID from the matched pattern
            const watchLink = createWatchLink(videoId); // Create a watch link using the extracted video ID

            // Create a line break element
            const lineBreak = document.createElement('br');

            // Insert the line break and then the new link below the original link
            link.insertAdjacentElement('afterend', lineBreak); // Insert the line break after the original link
            lineBreak.insertAdjacentElement('afterend', watchLink); // Insert the new watch link after the line break
        }
    });
})();