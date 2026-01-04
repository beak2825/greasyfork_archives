// ==UserScript==
// @name         Nitter to Twitter Link Converter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Convert Nitter links to Twitter links
// @author       w4t3r1ily
// @match        *://*/*
// @include      *
// @grant        none
// @icon         https://f-droid.org/repo/com.plexer0.nitter/en-US/icon_Kh4S6V1yqClUU5mFhmZ-bOb_yAuYi2V_bGbjMyQEUW8=.png
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @downloadURL https://update.greasyfork.org/scripts/465147/Nitter%20to%20Twitter%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/465147/Nitter%20to%20Twitter%20Link%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the new Twitter link element with an arrow sign
    function createTwitterLink(username, tweetId) {
        const twitterLink = document.createElement('a');
        twitterLink.href = `https://twitter.com/${username}/status/${tweetId}`; // Construct the Twitter URL using the username and tweet ID
        twitterLink.textContent = `⇒ https://twitter.com/${username}/status/${tweetId}`; // Set the text content of the link with an arrow sign
        return twitterLink; // Return the newly created link element
    }

    // Get all anchor elements on the page
    const links = document.querySelectorAll('a');

    // Iterate over each link
    links.forEach(link => {
        // Match the URL against the specific Nitter pattern with any domain and extract the username and tweet ID
        const match = link.href.match(/https:\/\/nitter\.[a-z.]+\/([^/]+)\/status\/(\d+)/);
        if (match) {
            const username = match[1]; // Extract the username from the matched pattern
            const tweetId = match[2]; // Extract the tweet ID from the matched pattern
            const twitterLink = createTwitterLink(username, tweetId); // Create a Twitter link using the extracted username and tweet ID

            // Create a line break element
            const lineBreak = document.createElement('br');

            // Insert the line break and then the new link below the original link
            link.insertAdjacentElement('afterend', lineBreak); // Insert the line break after the original link
            lineBreak.insertAdjacentElement('afterend', twitterLink); // Insert the new Twitter link after the line break
        }
    });
})();
