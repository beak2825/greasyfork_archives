// ==UserScript==
// @name         iNaturalist Geomodel Viewier
// @version      1.0
// @description  Add a link to the Geomodel result for iNaturalist taxa
// @author       Nathan Ruser
// @match        https://www.inaturalist.org/taxa/*
// @grant        none
// @license     MIT
// @namespace https://greasyfork.org/users/1187802
// @downloadURL https://update.greasyfork.org/scripts/476672/iNaturalist%20Geomodel%20Viewier.user.js
// @updateURL https://update.greasyfork.org/scripts/476672/iNaturalist%20Geomodel%20Viewier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the Taxa ID from the URL
    const match = window.location.pathname.match(/\/taxa\/(\d+)/);
    if (!match) return; // Exit if not on a valid taxa page
    const taxaId = match[1];

    // Create a link element
    const link = document.createElement('a');
    link.href = `https://www.inaturalist.org/geo_model/${taxaId}/explain`;
    link.textContent = 'Geo-Model';

    // Apply CSS styles
    link.style.border = '0 transparent';
    link.style.backgroundColor = 'inherit';
    link.style.color = 'black';
    link.style.opacity = '1';
    link.style.textDecoration = 'none'; // Remove underline
    link.addEventListener('mouseenter', () => {
        link.style.borderBottom = '3px solid #74ac00';
    });
    link.addEventListener('mouseleave', () => {
        link.style.borderBottom = 'none';
    });

    // Find the "Map" tab
    const mapTab = document.querySelector('a[href="#map-tab"]');
    if (mapTab) {
        // Create a new list item for the link
        const listItem = document.createElement('li');
        listItem.appendChild(link);

        // Insert the list item after the "Map" tab
        mapTab.parentElement.insertAdjacentElement('afterend', listItem);
    }
})();