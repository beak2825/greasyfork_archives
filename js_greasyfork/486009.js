// ==UserScript==
// @name         Suno AI Link Converter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Convert Suno AI links to direct audio links
// @author       w4t3r1ily
// @match        *://*/*
// @include      *
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suno.com
// @downloadURL https://update.greasyfork.org/scripts/486009/Suno%20AI%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/486009/Suno%20AI%20Link%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the new link element with an arrow sign
    function createCDNLink(uuid) {
        const cdnLink = document.createElement('a');
        cdnLink.href = `https://cdn1.suno.ai/${uuid}.mp3`; // Construct the CDN URL using the UUID
        cdnLink.textContent = `⇒ https://cdn1.suno.ai/${uuid}.mp3`; // Set the text content of the link with an arrow sign
        return cdnLink; // Return the newly created link element
    }

    // Get all anchor elements on the page
    const links = document.querySelectorAll('a');

    // Iterate over each link
    links.forEach(link => {
        // Match the URL against the specific Suno AI pattern and extract the UUID
        const match = link.href.match(/https:\/\/(?:app\.suno\.ai|suno\.com)\/song\/([a-f0-9\-]{36})\/?/);
        if (match) {
            const uuid = match[1]; // Extract the UUID from the matched pattern
            const cdnLink = createCDNLink(uuid); // Create a CDN link using the extracted UUID

            // Create a line break element
            const lineBreak = document.createElement('br');

            // Insert the line break and then the new link below the original link
            link.insertAdjacentElement('afterend', lineBreak); // Insert the line break after the original link
            lineBreak.insertAdjacentElement('afterend', cdnLink); // Insert the new CDN link after the line break
        }
    });
})();
