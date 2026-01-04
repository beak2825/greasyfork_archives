// ==UserScript==
// @name         Dropdown Pokémon Rarity Filter (Legendary, Mythical, Final Evolutions, Rare)
// @namespace    https://moonani.com/
// @version      2.5
// @description  Adds a dropdown to filter Pokémon table by Legendary, Mythical, Final Evolutions, Rare Pokémon, with radio buttons, reset option, and sets "Show All Entries" by default for https://moonani.com/PokeList/index.php.
// @author       https://github.com/brodante
// @license      apache-2.0
// @match        https://moonani.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521003/Dropdown%20Pok%C3%A9mon%20Rarity%20Filter%20%28Legendary%2C%20Mythical%2C%20Final%20Evolutions%2C%20Rare%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521003/Dropdown%20Pok%C3%A9mon%20Rarity%20Filter%20%28Legendary%2C%20Mythical%2C%20Final%20Evolutions%2C%20Rare%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Check if we are on the specific page
    const isPokeListPage = window.location.href === 'https://moonani.com/PokeList/index.php';

    // Pokémon Categories (Using Pokedex numbers)
    const legendaryPokemons = [
        144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384,
        385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 644, 645, 646,
        716, 717, 718, 785, 786, 787, 788, 791, 792, 798, 888, 889, 890, 891, 892, 894, 895, 896, 897, 898
    ];

    const mythicalPokemons = [
        151, 251, 385, 386, 490, 492, 493, 494, 647, 648, 649, 719, 720, 721, 801, 802, 807, 808, 809
    ];

    const finalEvolutions = [
        6, 9, 3, 65, 68, 76, 59, 248, 249, 250, 254, 257, 260, 282, 308, 286, 373, 376, 445, 392, 395, 389,
        497, 500, 503, 658, 655, 652, 724, 727, 730, 811, 815, 818
    ];

    // Adding Rare Pokémon, like Larvitar and others
    const rarePokemons = [
        132, 133, 134, 135, 136, 137, 238, 339, 422, 423, 532, 533, 634, 635, 649, 667, 672, 677, 707, 708,
        720, 721, 722, 734, 735, 744, 745, 751, 752, 787
    ];

    let originalOrder = []; // To store the original table row order

    function createDropdown() {
        const table = document.querySelector('#customers');
        if (!table) return;

        // Style container
        const dropdownContainer = document.createElement('div');
        dropdownContainer.style.margin = '20px 0';
        dropdownContainer.style.padding = '10px';
        dropdownContainer.style.background = '#f9f9f9';
        dropdownContainer.style.border = '1px solid #ddd';
        dropdownContainer.style.borderRadius = '5px';
        dropdownContainer.style.textAlign = 'left';

        // Dropdown label
        const dropdownLabel = document.createElement('div');
        dropdownLabel.textContent = 'Filter Pokémon by Category:';
        dropdownLabel.style.fontSize = '16px';
        dropdownLabel.style.fontWeight = 'bold';
        dropdownLabel.style.marginBottom = '8px';
        dropdownContainer.appendChild(dropdownLabel);

        // Dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.style.display = 'grid';
        dropdownMenu.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))';
        dropdownMenu.style.gap = '10px';

        const categories = ['Legendary Pokémon', 'Mythical Pokémon', 'Final Evolutions', 'Rare Pokémon', 'Reset'];

        categories.forEach(category => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.cursor = 'pointer';
            label.style.padding = '5px';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'pokemon-filter';
            radio.value = category;
            radio.style.marginRight = '8px';
            radio.addEventListener('change', applyFilters);

            label.appendChild(radio);
            label.appendChild(document.createTextNode(category));
            dropdownMenu.appendChild(label);
        });

        dropdownContainer.appendChild(dropdownMenu);
        table.parentNode.insertBefore(dropdownContainer, table);

        observeTableChanges(); // Watch for dynamic table updates
    }

    function applyFilters() {
        const selectedCategory = document.querySelector('input[name="pokemon-filter"]:checked')?.value;

        if (!selectedCategory) return;

        const tableBody = document.querySelector('#customers tbody');
        if (!tableBody) return;

        const rows = Array.from(tableBody.querySelectorAll('tr'));

        // Save original order if not already saved
        if (originalOrder.length === 0) {
            originalOrder = rows.slice();
        }

        // Separate matching and non-matching rows based on selected category
        const matchingRows = [];
        const nonMatchingRows = [];

        rows.forEach(row => {
            const numberCell = row.querySelector('td:nth-child(3)'); // Target the 3rd column for Pokedex number (Number)
            if (numberCell) {
                const pokemonNumber = parseInt(numberCell.textContent.trim(), 10);
                const isMatch = selectedCategory === 'Legendary Pokémon' ? legendaryPokemons.includes(pokemonNumber) :
                                 selectedCategory === 'Mythical Pokémon' ? mythicalPokemons.includes(pokemonNumber) :
                                 selectedCategory === 'Final Evolutions' ? finalEvolutions.includes(pokemonNumber) :
                                 selectedCategory === 'Rare Pokémon' ? rarePokemons.includes(pokemonNumber) :
                                 selectedCategory === 'Reset' ? true : false;

                if (isMatch) {
                    matchingRows.push(row);
                } else {
                    nonMatchingRows.push(row);
                }
            }
        });

        // Reorder table
        tableBody.innerHTML = '';
        matchingRows.forEach(row => tableBody.appendChild(row));
        nonMatchingRows.forEach(row => tableBody.appendChild(row));
    }

    function observeTableChanges() {
        const tableBody = document.querySelector('#customers tbody');
        if (!tableBody) return;

        const observer = new MutationObserver(() => {
            originalOrder = []; // Reset original order on content change
        });

        observer.observe(tableBody, { childList: true, subtree: true });
    }

    // Wait for the table to appear and apply the dropdown immediately
    function waitForTableAndAddDropdown() {
        const table = document.querySelector('#customers');
        if (table) {
            createDropdown(); // If table is already present
        } else {
            // If table is not present, observe the document for changes
            const observer = new MutationObserver(() => {
                const table = document.querySelector('#customers');
                if (table) {
                    createDropdown();
                    observer.disconnect(); // Stop observing once the table is found
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        // Automatically select "All" in the "Show Entries" dropdown if on the specific page
        if (isPokeListPage) {
            const showEntriesDropdown = document.querySelector('select[name="customers_length"]'); // Correct selector for the "Show Entries" dropdown
            if (showEntriesDropdown) {
                showEntriesDropdown.value = '-1'; // Set the dropdown value to "All" (value="-1")
                showEntriesDropdown.dispatchEvent(new Event('change')); // Trigger change event to apply the selection
            }
        }
    }

    // Run the script as soon as the page is ready
    waitForTableAndAddDropdown();

})();
