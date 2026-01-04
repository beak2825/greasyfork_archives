// ==UserScript==
// @name        visitcube zu google maps
// @namespace   Violentmonkey Scripts
// @match       https://*.visitcube.de/app/*
// @grant       none
// @version     1.5.1
// @author      Tim Heumer
// @description 05/02/2025, 21:17:22
// @downloadURL https://update.greasyfork.org/scripts/526033/visitcube%20zu%20google%20maps.user.js
// @updateURL https://update.greasyfork.org/scripts/526033/visitcube%20zu%20google%20maps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the anchor link (a tag)
    const aLink = document.createElement('a');
    aLink.textContent = 'Maps';
    aLink.href = '#'; // Prevent default link behavior

    // Find the "Forum" list item
    const forumItem = document.querySelector('a[href="/app/ForumEntry"]');
    if (!forumItem) return console.log('Forum link not found.');

    // Insert the link inside a new list item that will float left
    const menuItem = forumItem.closest('li');
    if (menuItem) {
        const aLinkContainer = document.createElement('li');
        aLinkContainer.style.float = 'left'; // Apply float to the <li> element
        aLinkContainer.appendChild(aLink);
        menuItem.parentNode.insertBefore(aLinkContainer, menuItem.nextSibling); // Insert link after "Forum"
    }

    // Link click event to open Google Maps with the addresses
    aLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link action (page reload)

        console.log('Extracting table data...');

        const table = document.querySelector('#entries-container');
        if (!table) return console.log('Table not found.');

        const tbody = table.querySelector('tbody');
        if (!tbody) return console.log('No tbody found.');

        const rows = tbody.querySelectorAll('tr');
        if (rows.length === 0) return console.log('No rows found.');

        let addresses = [];

        rows.forEach(row => {
            const checkbox = row.querySelector('td.table-cell-marker input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                const cells = row.querySelectorAll('td');
                if (cells.length > 5) {
                    const addressDiv = cells[5].querySelector('div');
                    if (addressDiv) {
                        const addressText = addressDiv.innerHTML.replace(/&nbsp;/g, ' ');

                        // Step 1: Split the address by <br> tags
                        let addressParts = addressText.split(/<br\s*\/?>/gi);

                        // Step 2: Assign the street and city based on the split
                        let street = addressParts[0].trim();
                        let city = addressParts[1] ? addressParts[1].trim() : '';

                        // Step 3: Use a simplified regex to capture postcode and the first word of the city
                        const cityTrimmed = city.match(/^(\d{5})\s+([a-zA-ZäöüßÄÖÜ-]+)/);

                        if (cityTrimmed) {
                            // Concatenate postcode and the first word of the city name
                            city = `${cityTrimmed[1]} ${cityTrimmed[2]}`;
                        }

                        // Step 4: Concatenate the street and city with a comma
                        const fullAddress = `${street}, ${city}`;

                        // Step 5: Push the encoded address to the array
                        addresses.push(encodeURIComponent(fullAddress));
                    }
                }
            }
        });

        if (addresses.length > 0) {
            const mapsUrl = `https://www.google.de/maps/dir/${addresses.join('/')}`;
            window.open(mapsUrl, '_blank');
            console.log('Opening Google Maps:', mapsUrl);
        } else {
            console.log('No addresses found.');
        }
    });
})();