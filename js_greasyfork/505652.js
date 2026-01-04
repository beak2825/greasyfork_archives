// ==UserScript==
// @name         Block Official Rickroll Video
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Block any content related to the official Rickroll YouTube video while allowing other content
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505652/Block%20Official%20Rickroll%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/505652/Block%20Official%20Rickroll%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL of the specific Rickroll video to block
    const rickrollUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    // Function to block content related to the Rickroll video
    function blockRickrollContent() {
        // Find all anchor tags on the page
        const links = document.querySelectorAll('a');
        
        links.forEach(link => {
            if (link.href.includes(rickrollUrl)) {
                // Block the Rickroll video link
                link.style.display = 'none'; // Hide the link
                // Optionally, you can replace the link text
                // link.textContent = '[Link blocked]';
            }
        });

        // Find all iframes on the page
        const iframes = document.querySelectorAll('iframe');

        iframes.forEach(iframe => {
            if (iframe.src.includes(rickrollUrl)) {
                // Block the iframe containing the Rickroll video
                iframe.style.display = 'none'; // Hide the iframe
                // Optionally, you can replace the iframe content
                // iframe.src = 'about:blank'; // Clear the iframe source
            }
        });
    }

    // Run the function initially
    blockRickrollContent();

    // Observe changes to dynamically loaded content
    const observer = new MutationObserver(() => {
        blockRickrollContent();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Handle links and iframes added to the DOM after script execution
    document.addEventListener('DOMContentLoaded', () => {
        blockRickrollContent();
    });
})();
