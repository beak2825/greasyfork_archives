// ==UserScript==
// @name         Copy Multilink Links
// @version      0.2
// @description  Add a "COPY" button to copy all links starting with multiup.io to the clipboard
// @author       travisasd
// @match        https://www.ufs.pt/*
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/1254921
// @downloadURL https://update.greasyfork.org/scripts/486007/Copy%20Multilink%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/486007/Copy%20Multilink%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if a link starts with a specific domain
    function isMultilinkDomain(link) {
        return link.startsWith('https://multiup.io') || link.startsWith('https://multiup.io');
    }

    // Function to copy links to clipboard
    function copyMultilinkLinks() {
        const links = document.querySelectorAll('a');
        const multilinkLinks = Array.from(links).filter(link => isMultilinkDomain(link.href));

        const multilinkUrls = multilinkLinks.map(link => link.href).join('\n');
        GM_setClipboard(multilinkUrls, 'text');
    }

    // Function to create and append the COPY button
    function createCopyButton() {
        const button = document.createElement('button');
        button.textContent = 'COPY';
        button.style.position = 'fixed';
        button.style.bottom = '50px';
        button.style.right = '50px';
        button.style.zIndex = '9999';
        button.addEventListener('click', copyMultilinkLinks);
        button.style.fontSize = '16px'; // Adjust the font size as needed
        button.style.padding = '12px 18px'; // Adjust the padding as needed
        button.addEventListener('click', copyMultilinkLinks);


        document.body.appendChild(button);
    }

    // Run the script when the page is loaded
    window.addEventListener('load', createCopyButton);
})();
