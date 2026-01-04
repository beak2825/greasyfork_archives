// ==UserScript==
// @name         Apple Music - iTunes Artwork Finder Lookup
// @namespace    http://tampermonkey.net/
// @version      1.7.3
// @description  Add a "🔎 iTunes Artwork Finder" button to Apple Music album pages. Clicking this button will capture the Album and Artist info from the page to the clipboard and open https://bendodson.com/projects/itunes-artwork-finder/, where you can paste the contents of the clipboard to search for high resolution album/cover art. Make sure to change the selectors for the "format" and "country" on iTAF to optimize your results!
// @match        https://music.apple.com/*/album/*
// @match        https://music.apple.com/*/library/albums/*
// @icon         https://ptpimg.me/0r4nex.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512769/Apple%20Music%20-%20iTunes%20Artwork%20Finder%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/512769/Apple%20Music%20-%20iTunes%20Artwork%20Finder%20Lookup.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to create the "🔎 iTunes Artwork Finder" button with SVG icon
    function createButton(album, artist) {
        const button = document.createElement('button');
        button.className = 'custom-button';
        button.style.cssText = 'background-color: var(--keyColorBG); color: white; border: none; padding: 0px 12px; cursor: pointer; border-radius: 6px; font: var(--body-emphasized); display: flex; align-items: center';

        // Create the SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 16 16');
        svg.setAttribute('width', '13');
        svg.setAttribute('height', '13');
        svg.style.marginRight = '5px';

        // Create the path element and set the new d attribute, fill color to white
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'st0');
        path.setAttribute('d', 'M0.9,16c-0.2,0-0.5-0.1-0.7-0.3C0.1,15.5,0,15.3,0,15.1s0.1-0.5,0.3-0.7l4.3-4.3c-0.4-0.5-0.7-1-0.9-1.6C3.4,7.8,3.3,7.1,3.3,6.4c0-0.6,0.1-1.2,0.2-1.7c0.2-0.5,0.4-1.1,0.6-1.5c0.3-0.5,0.6-0.9,1-1.3c0.4-0.4,0.8-0.7,1.3-1c0.5-0.3,1-0.5,1.5-0.6C8.5,0.1,9,0,9.6,0c0.6,0,1.2,0.1,1.7,0.2c0.5,0.1,1.1,0.4,1.5,0.6c0.5,0.3,0.9,0.6,1.3,1c0.4,0.4,0.7,0.8,1,1.3c0.3,0.5,0.5,1,0.6,1.5C15.9,5.2,16,5.8,16,6.4c0,0.6-0.1,1.2-0.2,1.7c-0.2,0.5-0.4,1.1-0.6,1.5c-0.3,0.5-0.6,0.9-1,1.3s-0.8,0.7-1.3,1c-0.5,0.3-1,0.5-1.5,0.6c-0.5,0.1-1.1,0.2-1.7,0.2c-0.7,0-1.5-0.1-2.2-0.4c-0.6-0.2-1.1-0.5-1.6-0.9l-4.3,4.3C1.4,15.9,1.2,16,0.9,16z M9.6,1.9C9.2,1.9,8.8,1.9,8.4,2C8.1,2.1,7.7,2.3,7.4,2.5C7,2.7,6.7,2.9,6.4,3.2C6.2,3.5,5.9,3.8,5.7,4.1C5.5,4.4,5.4,4.8,5.3,5.2C5.2,5.6,5.1,6,5.1,6.4c0,0.6,0.1,1.2,0.4,1.8c0.2,0.5,0.6,1,1,1.4c0.4,0.4,0.9,0.7,1.4,1c0.5,0.2,1.1,0.4,1.8,0.4c0.6,0,1.2-0.1,1.8-0.4c0.5-0.2,1-0.6,1.4-1c0.4-0.4,0.7-0.9,1-1.4C14,7.6,14.1,7,14.1,6.4c0-0.6-0.1-1.2-0.4-1.8c-0.2-0.5-0.6-1-1-1.4c-0.4-0.4-0.9-0.7-1.4-1C10.8,2,10.3,1.9,9.6,1.9z');
        path.setAttribute('fill', '#FFFFFF');

        // Append the path to the SVG
        svg.appendChild(path);

        // Create the text node for "iTunes Artwork Finder"
        const buttonText = document.createTextNode(' iTunes Artwork Finder');

        // Append SVG and text to the button
        button.appendChild(svg);
        button.appendChild(buttonText);

        // Copy album and artist to clipboard
        button.onclick = function () {
            const textToCopy = `${album} ${artist}`;
            navigator.clipboard.writeText(textToCopy).then(() => {
                window.open('https://bendodson.com/projects/itunes-artwork-finder/', '_blank');
            });
        };

        return button;
    }

    // Function to add the button to the primary actions section
    function addButton() {
        const albumElement = document.querySelector('h1.headings__title span[dir="auto"]');
        const artistElement = document.querySelector('div.headings__subtitles');
        const primaryActionsDiv = document.querySelector('div.primary-actions');

        // Check if the button already exists to prevent adding it multiple times
        if (albumElement && artistElement && primaryActionsDiv && !document.querySelector('#search-iTAF-button')) {
            const album = albumElement.innerText;
            const artist = artistElement.innerText;

            // Create and append the "🔎 iTunes Artwork Findero" button
            const button = createButton(album, artist);
            button.id = 'search-iTAF-button'; // Assign an ID to the button to track its presence
            primaryActionsDiv.appendChild(button);
        }
    }

    // Keep checking for changes on the page and add the button once the elements are loaded
    function persistentlyAddButton() {
        addButton();
        setTimeout(persistentlyAddButton, 1000); // Retry every 1 second
    }

    persistentlyAddButton(); // Start the loop to add the button

    // Handle changes in the URL (e.g., if navigating between albums)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(addButton, 1000); // Add button after the URL changes
        }
    }).observe(document, { subtree: true, childList: true });

})();
