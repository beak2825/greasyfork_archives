// ==UserScript==
// @name         YTS Magnet Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add magnet button next to YTS download buttons
// @match        https://yts.lt/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503640/YTS%20Magnet%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/503640/YTS%20Magnet%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and add the magnet button
    function addMagnetButton(downloadButton) {
        // Check if the magnet button already exists
        if (downloadButton.nextSibling && downloadButton.nextSibling.classList && downloadButton.nextSibling.classList.contains('magnet-button')) {
            return;
        }

        // Create the magnet button
        const magnetButton = document.createElement('a');
        magnetButton.innerHTML = '🧲'; // Magnet emoji as the button text
        magnetButton.style.cursor = 'pointer';
        magnetButton.title = 'Magnet and open to default torrent app';
        magnetButton.classList.add('magnet-button'); // Add a class for identification

        // Add click event to the magnet button
        magnetButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Get the torrent URL from the download button
            const torrentUrl = downloadButton.href;

            // Construct the magnet link (this is a simplified version, you may need to adjust it)
            const magnetLink = `magnet:?xt=urn:btih:${torrentUrl.split('/').pop()}&dn=${encodeURIComponent(document.title)}`;

            // Open the magnet link (this should trigger qBittorrent if it's set as the default app)
            window.location.href = magnetLink;
        });

        // Create a container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.marginBottom = '10px';

        // Move the original download button into the container
        downloadButton.parentNode.insertBefore(buttonContainer, downloadButton);
        buttonContainer.appendChild(downloadButton);

        // Add the magnet button to the container
        buttonContainer.appendChild(magnetButton);
    }

    // Find all download buttons and add magnet buttons
    function addMagnetButtons() {
        const downloadButtons = document.querySelectorAll('a[href^="https://yts.lt/torrent/download/"]');
        downloadButtons.forEach(addMagnetButton);
    }

    // Function to add a line break after the specified <em> element
    function addLineBreakAfterEmElement() {
        const emElement = document.querySelector('em.pull-left');
        if (emElement && emElement.textContent.includes('Available in:')) {
            const br = document.createElement('br');
            emElement.parentNode.insertBefore(br, emElement.nextSibling);
        }
    }

    // Run the script when the page loads
    window.addEventListener('load', function() {
        addMagnetButtons();
        addLineBreakAfterEmElement();
    });
})();