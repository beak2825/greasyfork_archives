// ==UserScript==
// @name         Search Fakku Doujin with Schale Network Mirrors
// @namespace    http://tampermonkey.net/
// @version      1.06
// @description  Extracts title and searches on Schale Network mirrors (NiyaNiya, Seia, Shupogaki, Hoshino). Marks Koharu and Seia as inactive in red color.
// @author       FunkyJustin
// @match        https://www.fakku.net/hentai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507506/Search%20Fakku%20Doujin%20with%20Schale%20Network%20Mirrors.user.js
// @updateURL https://update.greasyfork.org/scripts/507506/Search%20Fakku%20Doujin%20with%20Schale%20Network%20Mirrors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and insert search buttons
    function addSearchButtons() {
        const titleElement = document.querySelector('h1[class^="block col-span-full"]');

        if (titleElement) {
            const title = titleElement.innerText;

            // Create a container for all buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.flexDirection = 'column'; // Stack rows vertically
            buttonContainer.style.alignItems = 'flex-start'; // Align to the left
            buttonContainer.style.gap = '10px'; // Add spacing between rows
            buttonContainer.style.marginTop = '20px';

            // Row for active (green) buttons
            const activeRow = document.createElement('div');
            activeRow.style.display = 'flex';
            activeRow.style.gap = '10px'; // Add spacing between buttons

            // Row for inactive (red) buttons
            const inactiveRow = document.createElement('div');
            inactiveRow.style.display = 'flex';
            inactiveRow.style.gap = '10px'; // Add spacing between buttons

            // Add buttons for all mirrors
            const niyaNiyaButton = createButton('Search with NiyaNiya', title, 'https://niyaniya.moe/browse?s=');
            const shupogakiButton = createButton('Search with Shupogaki', title, 'https://shupogaki.moe/browse?s=');
            const hoshinoButton = createButton('Search with Hoshino', title, 'https://hoshino.one/browse?s=');

            const koharuButton = createButton('Search with Koharu (Inactive)', title, 'https://koharu.to/browse?s=', '#FF0000');
            const seiaButton = createButton('Search with Seia (Inactive)', title, 'https://seia.to/browse?s=', '#FF0000');

            // Append buttons to respective rows
            activeRow.appendChild(niyaNiyaButton);
            activeRow.appendChild(shupogakiButton);
            activeRow.appendChild(hoshinoButton);

            inactiveRow.appendChild(koharuButton);
            inactiveRow.appendChild(seiaButton);

            // Append rows to the container
            buttonContainer.appendChild(activeRow);
            buttonContainer.appendChild(inactiveRow);

            // Insert the button container after the title element
            titleElement.parentNode.insertBefore(buttonContainer, titleElement.nextSibling);
        } else {
            console.error("Title element not found. Buttons could not be added.");
        }
    }

    // Helper function to create and style a button
    function createButton(buttonText, title, baseUrl, bgColor = '#4CAF50') {
        const button = document.createElement('button');
        button.innerText = buttonText;
        button.style.padding = '10px 15px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = bgColor;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // When the button is clicked, open a new tab with the search URL
        button.onclick = function() {
            const searchUrl = `${baseUrl}${encodeURIComponent(title)}`;
            window.open(searchUrl, '_blank');
        };

        return button;
    }

    // Wait for the page to fully load before attempting to add the buttons
    window.addEventListener('load', addSearchButtons);
})();
