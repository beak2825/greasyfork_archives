// ==UserScript==
// @name         Audiobookbay Info Hash to Magnet Link
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Convert Info Hash to Magnet Link and hide certain links
// @author       You
// @match        https://audiobookbay.lu/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489269/Audiobookbay%20Info%20Hash%20to%20Magnet%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/489269/Audiobookbay%20Info%20Hash%20to%20Magnet%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all td elements containing the info hash
    let infoHashes = document.querySelectorAll('td');

    infoHashes.forEach((td) => {
        // Check if the td contains an info hash
        if (/^[a-f0-9]{40}$/i.test(td.textContent)) {
            // Create the magnet link
            let magnetLink = 'magnet:?xt=urn:btih:' + td.textContent;

            // Create a new anchor element
            let a = document.createElement('a');
            a.href = magnetLink;
            a.textContent = magnetLink;
            a.style.fontSize = '15px';  // Increase the font size

            // Replace the td's content with the new anchor element
            td.textContent = '';
            td.appendChild(a);
        }
    });

    // List of links to hide
    let linksToHide = ['Torrent Free Downloads', 'Magnet', 'Download Files Now', 'Start Anonymous Download'];

    // Select all anchor elements
    let links = document.querySelectorAll('a');

    links.forEach((link) => {
        // Check if the link's text is in the list of links to hide
        if (linksToHide.includes(link.textContent)) {
            // Hide the link
            link.style.display = 'none';

            // Create a new span element with the original text and a note
            let span = document.createElement('span');
            span.textContent = link.textContent + ' (Removed link by script)';

            // Add the new span element after the hidden link
            link.parentNode.insertBefore(span, link.nextSibling);
        }
    });
})();
