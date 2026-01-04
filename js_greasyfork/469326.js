// ==UserScript==
// @name         SubsPlease - Copy All Magnet Links
// @namespace    NamedSpace
// @version      1.1
// @description  A simple Button to Copy 1080p Magnet Links to Clipboard from: https://subsplease.org/
// @match        https://subsplease.org/*
// @grant        GM_setClipboard
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469326/SubsPlease%20-%20Copy%20All%20Magnet%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/469326/SubsPlease%20-%20Copy%20All%20Magnet%20Links.meta.js
// ==/UserScript==

/* eslint-env es8 */

(function() {'use strict';

    // Wait function
    function wait(seconds) {return new Promise(resolve => setTimeout(resolve, seconds * 1000));}

    // Copy button element
    const copyButton = document.createElement('button');
    copyButton.textContent = 'copy magnet links';
    copyButton.style.position = 'fixed';
    copyButton.style.bottom = '15px';
    copyButton.style.left = '15px';
    copyButton.style.zIndex = '9999';

    // Function to copy all 1080p magnet links to clipboard
    async function copyAllMagnets() {

        // Finds and collects all magnet links
        const magnetLinks = document.querySelectorAll('a[href^="magnet:"][href*="1080p"]');

        // An array to store all magnet links
        const magnetUrls = [];

        // Iterate over the magnet links and push them into the array
        magnetLinks.forEach((link) => {
            magnetUrls.push(link.href);
        });

        // Sets each magnet links to the clipboard in a new line
        GM_setClipboard(magnetUrls.join('\n'));

        // Notify the magnets were copied
        copyButton.textContent = 'copied links!';

        //Reverts text back after a second
        await wait(1);
        copyButton.textContent = 'copy magnet links';
    }

    // Registers button clicks to activate the main function
    copyButton.addEventListener('click', copyAllMagnets);

    // Append the button to the body of the website
    document.body.appendChild(copyButton);
})();