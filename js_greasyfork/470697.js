// ==UserScript==
// @name         2014 for Google neocities Part 1
// @namespace    https://vanced-youtube.neocities.org/2013/
// @version      1.0
// @description  Remove specific nodes from websites containing a specific URL
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470697/2014%20for%20Google%20neocities%20Part%201.user.js
// @updateURL https://update.greasyfork.org/scripts/470697/2014%20for%20Google%20neocities%20Part%201.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the node selectors to remove
    const selectorsToRemove = [
        'div.nbpr > span.nbprs',
        'div.bg'
    ];

    // Function to remove nodes
    function removeNodes() {
        selectorsToRemove.forEach(selector => {
            const nodes = document.querySelectorAll(selector);
            nodes.forEach(node => {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            });
        });
    }

    // Check if the current URL contains the target URL
    if (window.location.href.includes('https://vanced-youtube.neocities.org/2013/')) {
        // Wait for the page to load and then remove the nodes
        window.addEventListener('load', removeNodes);
    }
})();