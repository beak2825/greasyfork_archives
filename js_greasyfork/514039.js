// ==UserScript==
// @name         IMVU Product Download CFL Revisions Dropdown
// @namespace    http://tampermonkey.net/
// @version      1.3
// @auther       heapsofjoy
// @description  Adds a single dropdown button with all available CFL revisions for IMVU products, with forced .cfl download.
// @match        *://*.imvu.com/shop/product.php?products_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514039/IMVU%20Product%20Download%20CFL%20Revisions%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/514039/IMVU%20Product%20Download%20CFL%20Revisions%20Dropdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('products_id');
    if (!productId) return; // Exit if no productId found

    // Set the HTTPS base URL for the product files
    const baseUrl = `https://userimages-akm.imvu.com/productdata/${productId}`;

    // Create the dropdown button
    const dropdownButton = document.createElement('button');
    dropdownButton.innerHTML = 'o';
    dropdownButton.title = 'Download CFL Revisions';
    dropdownButton.style.position = 'fixed';
    dropdownButton.style.bottom = '10px';
    dropdownButton.style.right = '10px';
    dropdownButton.style.width = '40px';
    dropdownButton.style.height = '40px';
    dropdownButton.style.backgroundColor = '#ff69b4';
    dropdownButton.style.color = 'white';
    dropdownButton.style.border = 'none';
    dropdownButton.style.borderRadius = '20px';
    dropdownButton.style.cursor = 'pointer';
    dropdownButton.style.fontFamily = 'Arial, sans-serif';
    dropdownButton.style.fontSize = '20px';
    dropdownButton.style.boxShadow = '0px 4px 10px rgba(0,0,0,0.2)';
    dropdownButton.style.zIndex = '1000';

    // Create the dropdown menu (initially hidden and positioned above the button)
    const dropdownMenu = document.createElement('div');
    dropdownMenu.style.display = 'none';
    dropdownMenu.style.position = 'fixed';
    dropdownMenu.style.bottom = '60px';
    dropdownMenu.style.right = '10px';
    dropdownMenu.style.width = '250px';
    dropdownMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    dropdownMenu.style.color = 'white';
    dropdownMenu.style.padding = '10px';
    dropdownMenu.style.border = '1px solid #ddd';
    dropdownMenu.style.borderRadius = '10px';
    dropdownMenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    dropdownMenu.style.zIndex = '1001';

    // Toggle dropdown menu visibility and button expansion on click
    dropdownButton.onclick = () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
        dropdownButton.style.width = dropdownMenu.style.display === 'none' ? '40px' : '60px';
        dropdownButton.style.height = dropdownMenu.style.display === 'none' ? '40px' : '40px';
        dropdownButton.innerHTML = dropdownMenu.style.display === 'none' ? '📥' : 'Close ▼';
    };

function addRevisionLink(revision) {
    const revisionLink = document.createElement('a');
    revisionLink.textContent = `View Revision ${revision}`;
    revisionLink.style.display = 'block';
    revisionLink.style.padding = '8px 0';
    revisionLink.style.color = '#ff69b4';
    revisionLink.style.textDecoration = 'none';
    revisionLink.style.borderBottom = '1px solid #444';

    // Just open the JSON file in a new tab
    revisionLink.href = `${baseUrl}/${revision}/_contents.json`;
    revisionLink.target = '_blank';
    revisionLink.rel = 'noopener noreferrer';

    dropdownMenu.appendChild(revisionLink);
}


    // Function to check if a revision exists
    function checkRevision(revision, misses = 0, maxMisses = 10) {
        const url = `${baseUrl}/${revision}/_contents.json`;
        fetch(url, { method: 'HEAD' })
            .then((response) => {
                if (response.ok) {
                    addRevisionLink(revision);
                    checkRevision(revision + 1, 0, maxMisses); // Reset misses on success
                } else {
                    if (misses < maxMisses) {
                        checkRevision(revision + 1, misses + 1, maxMisses);
                    }
                }
            })
            .catch(() => {
                if (misses < maxMisses) {
                    checkRevision(revision + 1, misses + 1, maxMisses);
                }
            });
    }    

    checkRevision(1, 0, 10);

    // Append the dropdown button and menu to the page
    document.body.appendChild(dropdownButton);
    document.body.appendChild(dropdownMenu);

    // Hide dropdown if clicked outside
    document.addEventListener('click', (event) => {
        if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
            dropdownButton.innerHTML = 'o';
            dropdownButton.style.width = '40px';
            dropdownButton.style.height = '40px';
        }
    });
})();