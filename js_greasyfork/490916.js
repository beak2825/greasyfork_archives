// ==UserScript==
// @name         Google Search Maps Buttons
// @description  Adds maps buttons to Google Search and filters out -site:pinterest.* (modified from Daan Grashoff / Delivator)
// @version      0.1.1
// @author       mseitz
// @namespace    https://greasyfork.org/en/scripts/490916-google-search-maps-buttons
// @include      https://www.google.tld/search*
// @icon         https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png
// @grant        none
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @homepageURL  https://greasyfork.org/en/scripts/490916-google-search-maps-buttons
// @downloadURL https://update.greasyfork.org/scripts/490916/Google%20Search%20Maps%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/490916/Google%20Search%20Maps%20Buttons.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function addMapsLink() {
        // Find the existing results tabs (Images, News, etc.)
        const linksContainer = document.querySelector('.crJ18e');
        const tabsContainer = document.querySelector('.IUOThf');
        const mapImage = document.querySelector('#lu_map');

        // Get the search query from the URL
        const searchQuery = new URLSearchParams(window.location.search).get('q').replace("-site:pinterest.*", '');

        // Construct the Maps link with the query
        const mapsLink = `${window.location.origin}/maps?q=${searchQuery}`;

        // If map image exists
        if (mapImage) {
            const anchorElement = document.createElement('a');
            anchorElement.href = mapsLink;
            mapImage.parentNode.insertBefore(anchorElement, mapImage);
            anchorElement.appendChild(mapImage);
        }

        // If links exist, proceed
        if (linksContainer) {
            // Create the Maps button
            const mapsButtonL = document.createElement('a');
            mapsButtonL.classList.add('nPDzT', 'T3FoJb');  // Style to match other tabs

            // Create the inner elements for the Maps button
            const mapDivL = document.createElement('div');
            mapDivL.jsname = 'bVqjv';
            mapDivL.classList.add('YmvwI');    //GKS7s

            const mapSpanL = document.createElement('span');
            mapSpanL.classList.add('FMKtTb', 'UqcIvb');
            mapSpanL.jsname = 'pIvPIe';
            mapSpanL.textContent = 'Maps';

            // Assemble the elements
            mapDivL.appendChild(mapSpanL);
            mapsButtonL.appendChild(mapDivL);
            mapsButtonL.href = mapsLink;

            // Insert the Maps button at the beginning of the tabs container
            linksContainer.prepend(mapsButtonL);
        }

        // If tabs exist, proceed
        if (tabsContainer) {
            // Create the Maps button
            const mapsButtonT = document.createElement('a');
            mapsButtonT.classList.add('nPDzT', 'T3FoJb');  // Style to match other tabs

            // Create the inner elements for the Maps button
            const mapDivT = document.createElement('div');
            mapDivT.jsname = 'bVqjv';
            mapDivT.classList.add('GKS7s');

            const mapSpanT = document.createElement('span');
            mapSpanT.classList.add('FMKtTb', 'UqcIvb');
            mapSpanT.jsname = 'pIvPIe';
            mapSpanT.textContent = 'Maps';

            // Assemble the elements
            mapDivT.appendChild(mapSpanT);
            mapsButtonT.appendChild(mapDivT);
            mapsButtonT.href = mapsLink;

            // Insert the Maps button at the beginning of the tabs container
            tabsContainer.prepend(mapsButtonT);
        }

    }

    // Call the function to add the button
    addMapsLink();

})();
