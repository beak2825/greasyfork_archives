// ==UserScript==
// @name         ruTorrent Download Selected Torrents
// @namespace    rutorrent
// @description  Add a button to download all selected .torrent files in ruTorrent.
// @author       David Lind
// @include     http://*rutorrent*
// @include     https://*rutorrent*
// @match        https://*rutorrent*
// @version      0.1
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/473230/ruTorrent%20Download%20Selected%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/473230/ruTorrent%20Download%20Selected%20Torrents.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function downloadSelectedTorrents() {
        // Get all selected checkboxes (assuming they have a specific class)
        const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"].transmission-group-checkbox:checked');

        // Create an array to store torrent file links
        const torrentLinks = [];

        // Loop through selected checkboxes and extract torrent file links
        selectedCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('tr'); // Find the parent row
            const torrentLink = row.querySelector('td.name-column a[href$=".torrent"]'); // Modify selector based on your site
            if (torrentLink) {
                torrentLinks.push(torrentLink.href);
            }
        });

        // Trigger the download for each torrent link
        torrentLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link;
            linkElement.download = link.split('/').pop(); // Set the filename
            linkElement.style.display = 'none';
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
        });
    }

    // Add the custom button to the top menu
    const topMenu = document.querySelector('ul#mainMenu');
    if (topMenu) {
        const downloadButton = document.createElement('li');
        downloadButton.innerHTML = '<a href="#" id="download-selected-torrents">Download Selected Torrents</a>';
        topMenu.appendChild(downloadButton);

        // Attach click event handler to the button
        const downloadButtonElement = document.getElementById('download-selected-torrents');
        downloadButtonElement.addEventListener('click', downloadSelectedTorrents);
    }
})();