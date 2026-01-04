// ==UserScript==
// @name         Telegram to TGStat Link Converter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Convert Telegram links to TGStat links
// @author       w4t3r1ily
// @match        *://*/*
// @include      *
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tgstat.com
// @downloadURL https://update.greasyfork.org/scripts/487483/Telegram%20to%20TGStat%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/487483/Telegram%20to%20TGStat%20Link%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the new Tgstat link element with an arrow sign
    function createTgstatLink(username, postId) {
        const tgstatLink = document.createElement('a');
        tgstatLink.href = `https://tgstat.com/en/channel/@${username}/${postId}`; // Construct the Tgstat URL using the username and post ID
        tgstatLink.textContent = `⇒ https://tgstat.com/en/channel/@${username}/${postId}`; // Set the text content of the link with an arrow sign
        return tgstatLink; // Return the newly created link element
    }

    // Get all anchor elements on the page
    const links = document.querySelectorAll('a');

    // Iterate over each link
    links.forEach(link => {
        // Match the URL against the specific Telegram pattern and extract the username and post ID
        const match = link.href.match(/https:\/\/t\.me\/([^/]+)\/(\d+)/);
        if (match) {
            const username = match[1]; // Extract the username from the matched pattern
            const postId = match[2]; // Extract the post ID from the matched pattern
            const tgstatLink = createTgstatLink(username, postId); // Create a Tgstat link using the extracted username and post ID

            // Create a line break element
            const lineBreak = document.createElement('br');

            // Insert the line break and then the new link below the original link
            link.insertAdjacentElement('afterend', lineBreak); // Insert the line break after the original link
            lineBreak.insertAdjacentElement('afterend', tgstatLink); // Insert the new Tgstat link after the line break
        }
    });
})();
