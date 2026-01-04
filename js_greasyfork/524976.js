// ==UserScript==
// @name         nigga man elias
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  nigga man
// @author       vamp och kineserna
// @include      https://www.google.tld/search*
// @icon         https://d1nhio0ox7pgb.cloudfront.net/_img/v_collection_png/128x128/shadow/keyboard_key_e.png
// @grant        none
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @downloadURL https://update.greasyfork.org/scripts/524976/nigga%20man%20elias.user.js
// @updateURL https://update.greasyfork.org/scripts/524976/nigga%20man%20elias.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addMapsLink() {
        // Find the existing results tabs (Images, News, etc.)
        const tabsContainer = document.querySelector('.crJ18e');
        const mapImage = document.querySelector('#lu_map');

        // Get the search query from the URL
        const searchQuery = new URLSearchParams(window.location.search).get('q');

        // Construct the Maps link with the query
        const mapsLink = `${window.location.origin}/maps?q=${searchQuery}`;

        // If map image exists
        if (mapImage) {
            const anchorElement = document.createElement('a');
            anchorElement.href = mapsLink;
            mapImage.parentNode.insertBefore(anchorElement, mapImage);
            anchorElement.appendChild(mapImage);
        }

        // If tabs exist, proceed
        if (tabsContainer) {
            // Create the Maps button
            const mapsButton = document.createElement('a');
            mapsButton.classList.add('nPDzT', 'T3FoJb');  // Style to match other tabs

            // Create the inner elements for the Maps button
            const mapDiv = document.createElement('div');
            mapDiv.jsname = 'bVqjv';
            mapDiv.classList.add('YmvwI');

            const mapSpan = document.createElement('span');
            mapSpan.classList.add('FMKtTb', 'UqcIvb');
            mapSpan.jsname = 'pIvPIe';
            mapSpan.textContent = 'Maps';

            // Assemble the elements
            mapDiv.appendChild(mapSpan);
            mapsButton.appendChild(mapDiv);
            mapsButton.href = mapsLink;

            // Insert the Maps button at the beginning of the tabs container
            tabsContainer.prepend(mapsButton);
        }

    }

    // Call the function to add the button
    addMapsLink();

})();