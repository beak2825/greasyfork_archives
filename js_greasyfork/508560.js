// ==UserScript==
// @name         AudiobookBay Add Magnets Without Login
// @version      1.0
// @description  Add a magnet link next to the InfoHash
// @author       Rust1667
// @match        https://audiobookbay.lu/abss/*
// @icon         https://icons.duckduckgo.com/ip3/audiobookbay.lu.ico
// @grant        none
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/508560/AudiobookBay%20Add%20Magnets%20Without%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/508560/AudiobookBay%20Add%20Magnets%20Without%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tracker URL to include in the magnet link
    const tracker = 'http://tracker.files.fm:6969/announce';

    // Magnet icon image URL
    const magnetIconUrl = 'https://cdn-icons-png.flaticon.com/512/5405/5405497.png';

    // Get the torrent name from the title element with selector '.postTitle > h1:nth-child(1)'
    const titleElement = document.querySelector('.postTitle > h1:nth-child(1)');
    const torrentName = titleElement ? titleElement.innerText.trim() : 'Unnamed Torrent';

    // Find all table rows in the document
    const rows = document.querySelectorAll('tr');

    // Iterate over the rows to find the one containing "Info Hash:"
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');

        if (cells.length === 2 && cells[0].innerText.trim() === 'Info Hash:') {
            // The second cell contains the hash
            const infoHash = cells[1].innerText.trim();

            // Generate the magnet link with the tracker and the torrent name
            const magnetLink = `magnet:?xt=urn:btih:${infoHash}&tr=${encodeURIComponent(tracker)}&dn=${encodeURIComponent(torrentName)}`;

            // Create a plain text node for the info hash
            const infoHashText = document.createTextNode(infoHash);

            // Create an image element for the magnet icon
            const magnetIconElement = document.createElement('img');
            magnetIconElement.src = magnetIconUrl;
            magnetIconElement.alt = 'Magnet Link';
            magnetIconElement.style = 'width: 20px; height: 20px; vertical-align: middle; margin-left: 10px;'; // Adjust size and spacing

            // Create a clickable link for the magnet icon
            const magnetLinkElement = document.createElement('a');
            magnetLinkElement.href = magnetLink;
            magnetLinkElement.appendChild(magnetIconElement);  // Make the image clickable

            // Clear the existing hash text in the cell
            cells[1].innerHTML = '';

            // Add the plain hash text and the clickable magnet icon to the second cell
            cells[1].appendChild(infoHashText);  // Insert the plain hash text
            cells[1].appendChild(magnetLinkElement);  // Insert the clickable magnet icon
        }
    });

})();
