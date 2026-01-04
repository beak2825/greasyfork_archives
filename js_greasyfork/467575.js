// ==UserScript==
// @name             IMDb Torrent Search button (TGx TorrentGalaxy)
// @description      Adds a torrent search button in the top left corner of the IMDb page
// @namespace        mestrenandi
// @author           mestrenandi
// @contributionURL  https://www.paypal.com/donate/?hosted_button_id=PGCMER56TKFFG
// @match            https://www.imdb.com/*
// @version          2.1.1
// @grant            none
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/467575/IMDb%20Torrent%20Search%20button%20%28TGx%20TorrentGalaxy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467575/IMDb%20Torrent%20Search%20button%20%28TGx%20TorrentGalaxy%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a button with the specified properties
    function createButton(id, innerHTML, clickHandler) {
        const button = document.createElement('button');
        button.id = id;
        button.innerHTML = innerHTML;
        button.style.display = "inline-block";
        button.style.marginRight = "0.5rem"; // Space between buttons
        button.style.backgroundColor = "rgba(100, 100, 100, 0.0)"; // Background color with transparency
        button.style.color = "#fff"; // Text color
        button.style.border = "0.5px solid rgba(150, 150, 150, 0.6)"; // Border with transparency
        button.style.borderRadius = "1rem"; // Rounded corners
        button.style.padding = ".18rem .75rem"; // Padding
        button.style.fontSize = ".875rem"; // Font size
        button.style.fontFamily = "Arial, sans-serif"; // Font family
        button.style.cursor = "pointer"; // Pointer cursor on hover
        button.style.transition = "background-color 0.3s, border-color 0.3s"; // Smooth transition

        // Add hover effects
        button.addEventListener('mouseover', function() {
            button.style.backgroundColor = "rgba(150, 150, 150, 0.32)";
        });

        button.addEventListener('mouseout', function() {
            button.style.backgroundColor = "rgba(100, 100, 100, 0.0)";
        });

        // Add click event handler
        button.addEventListener('click', clickHandler);

        return button;
    }

    // Get movie ID for TGx search
    function getMovieId() {
        let movieId;
        let x = window.location.pathname;
        let arr = x.split('/');

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].substring(0, 2) === 'tt' || arr[i].substring(0, 2) === 'TT') {
                movieId = arr[i];
            }
        }
        return movieId;
    }

    // Wait for the title element to be available
    function waitForTitleAndAddButtons() {
        const titleElement = document.querySelector('.hoBFcD');

        if (titleElement) {
            const buttonContainer = document.createElement('div');

            // Create TGx search button
            const movieId = getMovieId();
            if (movieId) {
                const tgxButton = createButton('TGxSearchButton', 'TGx Search', function() {
                    const searchURL = `https://torrentgalaxy.to/torrents.php?search=${movieId}&sort=size&order=desc`;
                    window.open(searchURL, '_blank');
                });
                buttonContainer.appendChild(tgxButton);
            }

            // Insert the button container above the title element
            titleElement.parentNode.insertBefore(buttonContainer, titleElement);
        } else {
            // Retry after a short delay if the title element is not yet available
            setTimeout(waitForTitleAndAddButtons, 100);
        }
    }

    waitForTitleAndAddButtons();
})();