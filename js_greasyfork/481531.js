// ==UserScript==
// @name         MovieDB Modal Button
// @namespace    https://www.just-smart.no/
// @version      1.0
// @icon         https://www.themoviedb.org/favicon.png
// @description  Add a modal button to a MovieDB page.
// @author       Zabkas
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481531/MovieDB%20Modal%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/481531/MovieDB%20Modal%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the specified element by its parent
    function removeElementByParentSelector(parentSelector) {
        const parentElement = document.querySelector(parentSelector);
        if (parentElement) {
            parentElement.remove();
        }
    }

    // Call the function to remove the specified tooltip element by its parent
    removeElementByParentSelector('.k-animation-container');
})();

(function() {
    'use strict';

    // Function to get the movie or TV show ID from the URL
    function getMediaID() {
        const url = window.location.href;
        const match = url.match(/\/(movie|tv)\/(\d+)/);
        if (match) {
            return match[2];
        }
        return null;
    }

    // Function to create and show the modal
    function showModal() {
        const mediaID = getMediaID();
        if (!mediaID) {
            alert('Movie or TV show ID not found in the URL.');
            return;
        }

        let mediaType = 'movie';
        if (window.location.href.includes('/tv/')) {
            mediaType = 'tv';
        }

        const iframeURL = `https://vidsrc.to/embed/${mediaType}/${mediaID}`;

        // Create a modal container
        const modalContainer = document.createElement('div');
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modalContainer.style.display = 'flex';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.zIndex = '9999'; // Ensure the modal appears above other elements

        // Create the iframe element with the dynamic URL and allowfullscreen attribute
        const iframe = document.createElement('iframe');
        iframe.src = iframeURL;
        iframe.style.width = '800px'; // Adjust the width and height as needed
        iframe.style.height = '600px';
        iframe.setAttribute('allowfullscreen', ''); // Allow fullscreen for the iframe

        // Append the iframe to the modal container
        modalContainer.appendChild(iframe);

        // Add a close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => {
            modalContainer.style.display = 'none';
            location.reload(); // Refresh the page after closing the modal
        });
        modalContainer.appendChild(closeButton);

        // Append the modal container directly to the body
        document.body.appendChild(modalContainer);
    }

    // Find the existing "Rate It!" button element
    const rateItButton = document.querySelector('#rate_it');

    if (rateItButton) {
        // Create your provided button as a replacement
        const newButton = document.createElement('li');
        newButton.className = 'tooltip use_tooltip';
        newButton.title = 'Watch Baby'; // Set the tooltip title here

        const watchLink = document.createElement('a');
        watchLink.className = 'no_click add_to_account_list watchlist';
        watchLink.href = '#';

        // Use the play icon found on the page
        const playIcon = document.querySelector('.glyphicons_v2.play');

        if (playIcon) {
            const clonedPlayIcon = playIcon.cloneNode(true);
            clonedPlayIcon.style.color = 'white'; // Set the icon's color to white
            watchLink.appendChild(clonedPlayIcon);
        }

        newButton.appendChild(watchLink);

        newButton.style.marginLeft = '10px'; // Adjust margin as needed
        newButton.addEventListener('click', showModal);

        // Replace the existing "Rate It!" button with your button
        rateItButton.parentNode.replaceChild(newButton, rateItButton);
    }
})();
