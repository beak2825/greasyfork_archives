// ==UserScript==
// @name         Block Twitch Prime Popup
// @namespace    https://greasyfork.org/en/users/1200587-trilla-g
// @version      1.0
// @description  Block a specific iframe from loading on Twitch.tv
// @author       Trilla_G
// @match        *://*.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496602/Block%20Twitch%20Prime%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/496602/Block%20Twitch%20Prime%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the iframe with the specified src
    function removeIframe() {
        const iframes = document.querySelectorAll('iframe[src*="supervisor.ext-twitch.tv/supervisor/v1/index.html"]');
        iframes.forEach(iframe => {
            iframe.parentNode.removeChild(iframe);
            console.log('Blocked iframe: supervisor.ext-twitch.tv/supervisor/v1/index.html');
        });
    }

    // Run the function immediately in case the iframe is already in the DOM
    removeIframe();

    // Use a MutationObserver to detect and remove the iframe if it gets added dynamically
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IFRAME' && node.src.includes('supervisor.ext-twitch.tv/supervisor/v1/index.html')) {
                    node.parentNode.removeChild(node);
                    console.log('Blocked dynamically added iframe: supervisor.ext-twitch.tv/supervisor/v1/index.html');
                }
            });
        });
    });

    // Start observing the document for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
