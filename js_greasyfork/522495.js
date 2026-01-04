// ==UserScript==
// @name         Add Favorites menu to the UESP Wiki
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a "Favorites" menu to the menu bar for bookmarking and managing favorite pages on UESP using page titles for names.
// @author       SignedBytes
// @license      CC BY 4.0
// @copyright    2024 SignedBytes (gasper.app)
// @match        https://en.uesp.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/522495/Add%20Favorites%20menu%20to%20the%20UESP%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/522495/Add%20Favorites%20menu%20to%20the%20UESP%20Wiki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ensure the script runs only on https://en.uesp.net/
    if (window.location.hostname !== 'en.uesp.net') return;

    // Add the "Favorites" menu item
    const menu = document.querySelector('.pBody > ul');
    if (!menu) return;

    // Create the "Favorites" menu
    const favoritesMenu = document.createElement('li');
    favoritesMenu.id = 'pt-favorites';
    favoritesMenu.innerHTML = `<a href="#" title="View and manage your favorites" style="cursor: pointer;">Favorites</a>`;
    menu.appendChild(favoritesMenu);

    // Add a container for the dropdown
    const dropdown = document.createElement('div');
    dropdown.id = 'favorites-dropdown';
    dropdown.style.display = 'none';
    dropdown.style.position = 'absolute';
    dropdown.style.backgroundColor = '#282828';
    dropdown.style.border = '1px solid #444';
    dropdown.style.padding = '10px';
    dropdown.style.zIndex = '1000';
    dropdown.style.width = '250px';
    dropdown.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.5)';
    dropdown.style.borderRadius = '5px';
    favoritesMenu.appendChild(dropdown);

    // Toggle dropdown on click
    favoritesMenu.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!favoritesMenu.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Load stored favorites
    const favorites = GM_getValue('favorites', []);

    // Helper function to truncate long titles
    const truncateTitle = (title, maxLength = 30) => {
        return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
    };

    // Helper function to update dropdown
    const updateFavoritesDropdown = () => {
        dropdown.innerHTML = '';
        if (favorites.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'No favorites added yet.';
            emptyMessage.style.color = '#fff';
            emptyMessage.style.margin = '0 0 10px';
            dropdown.appendChild(emptyMessage);
        } else {
            favorites.forEach((fav, index) => {
                const favItem = document.createElement('div');
                favItem.style.marginBottom = '8px';
                favItem.style.display = 'flex';
                favItem.style.justifyContent = 'space-between';
                favItem.style.alignItems = 'center';

                const link = document.createElement('a');
                link.href = fav.url;
                link.textContent = truncateTitle(fav.title);
                link.style.color = '#4CAF50';
                link.style.textDecoration = 'none';
                link.style.flexGrow = '1';
                link.style.marginRight = '10px';
                link.setAttribute('title', fav.title); // Full title as a tooltip

                const removeButton = document.createElement('button');
                removeButton.textContent = '-';
                removeButton.style.backgroundColor = '#D32F2F';
                removeButton.style.color = '#fff';
                removeButton.style.border = 'none';
                removeButton.style.padding = '5px 8px';
                removeButton.style.borderRadius = '3px';
                removeButton.style.cursor = 'pointer';

                removeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    favorites.splice(index, 1);
                    GM_setValue('favorites', favorites);
                    updateFavoritesDropdown();
                });

                favItem.appendChild(link);
                favItem.appendChild(removeButton);
                dropdown.appendChild(favItem);
            });
        }

        // Add a "+" button to add the current page
        const addButton = document.createElement('button');
        addButton.textContent = '+ Add Current Page';
        addButton.style.display = 'block';
        addButton.style.margin = '10px auto 0';
        addButton.style.padding = '10px';
        addButton.style.width = '100%';
        addButton.style.backgroundColor = '#2196F3';
        addButton.style.color = '#fff';
        addButton.style.border = 'none';
        addButton.style.borderRadius = '5px';
        addButton.style.cursor = 'pointer';

        addButton.addEventListener('click', (e) => {
            e.preventDefault();
            const pageTitle = document.title; // Use the page's <title> tag
            const pageURL = window.location.href;
            if (!favorites.some(fav => fav.url === pageURL)) {
                favorites.push({ title: pageTitle, url: pageURL });
                GM_setValue('favorites', favorites);
                updateFavoritesDropdown();
                alert('Page added to favorites!');
            } else {
                alert('Page is already in favorites!');
            }
        });
        dropdown.appendChild(addButton);
    };

    updateFavoritesDropdown();
})();
