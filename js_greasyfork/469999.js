// ==UserScript==
// @name         Twitter/X Status to Embed Link Converter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Convert Twitter/X status links to embedded tweet links
// @author       w4t3r1ily
// @match        *://*/*
// @include      *
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @downloadURL https://update.greasyfork.org/scripts/469999/TwitterX%20Status%20to%20Embed%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/469999/TwitterX%20Status%20to%20Embed%20Link%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the new embed tweet link element with an arrow sign
    function createEmbedLink(tweetId) {
        const embedLink = document.createElement('a');
        embedLink.href = `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}`; // Construct the embed URL using the tweet ID
        embedLink.textContent = `⇒ https://platform.twitter.com/embed/Tweet.html?id=${tweetId}`; // Set the text content of the link with an arrow sign
        return embedLink; // Return the newly created link element
    }

    // Get all anchor elements on the page
    const links = document.querySelectorAll('a');

    // Iterate over each link
    links.forEach(link => {
        // Match the URL against the specific Twitter/X status pattern and extract the tweet ID
        const match = link.href.match(/https:\/\/(?:twitter|x)\.com\/[^/]+\/status\/(\d+)/);
        if (match) {
            const tweetId = match[1]; // Extract the tweet ID from the matched pattern
            const embedLink = createEmbedLink(tweetId); // Create an embed link using the extracted tweet ID

            // Create a line break element
            const lineBreak = document.createElement('br');

            // Insert the line break and then the new link below the original link
            link.insertAdjacentElement('afterend', lineBreak); // Insert the line break after the original link
            lineBreak.insertAdjacentElement('afterend', embedLink); // Insert the new embed link after the line break
        }
    });
})();
