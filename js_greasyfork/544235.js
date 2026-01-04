// ==UserScript==
// @name         Enhanced Bank Sorting for flatmmmo.com
// @namespace    http://tampermonkey.net/
// @version      2.6.2
// @description  Add better sorting features to bank storage
// @author       Carlos
// @match        https://flatmmo.com/play.php
// @match        https://flatmmo.com/play.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544235/Enhanced%20Bank%20Sorting%20for%20flatmmmocom.user.js
// @updateURL https://update.greasyfork.org/scripts/544235/Enhanced%20Bank%20Sorting%20for%20flatmmmocom.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    console.log('Enhanced Bank Sorting script loaded!');
 
    let original_bank_items = [];
    let current_sort_method = 'original';
 
    // Wait for the page to load and bank to be available
    function init() {
        if (typeof bank_items === 'undefined' || typeof refresh_bank !== 'function') {
            setTimeout(init, 500);
            return;
        }
 
        // Store original order when first loaded
        if (original_bank_items.length === 0) {
            original_bank_items = [...bank_items];
        }
 
        addSortingControls();
    }
 
    function addSortingControls() {
        const storageWrapper = document.querySelector('.storage-wrapper');
        if (!storageWrapper) {
            setTimeout(addSortingControls, 500);
            return;
        }
 
        // Check if controls already exist
        if (document.getElementById('sorting-controls')) {
            return;
        }
 
        // Create sorting controls container
        const sortingControls = document.createElement('div');
        sortingControls.id = 'sorting-controls';
        sortingControls.style.cssText = `
            margin: 10px 0;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border: 1px solid #555;
            border-radius: 5px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
        `;
 
        // Sort label
        const sortLabel = document.createElement('span');
        sortLabel.textContent = 'Sort by: ';
        sortLabel.style.cssText = `
            color: white;
            font-weight: bold;
            font-size: 14pt;
        `;
 
        // Sort buttons container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        `;
 
        // Sort options with their functions
        const sortOptions = [
            { id: 'original', text: 'Original', method: sortByOriginal },
            { id: 'name-asc', text: 'Name A-Z', method: () => sortByName(false) },
            { id: 'name-desc', text: 'Name Z-A', method: () => sortByName(true) },
            { id: 'amount-high', text: 'Amount ↓', method: () => sortByAmount(true) },
            { id: 'amount-low', text: 'Amount ↑', method: () => sortByAmount(false) },
            { id: 'type', text: 'Type', method: sortByType }
        ];
 
        // Create buttons
        sortOptions.forEach(option => {
            const button = document.createElement('button');
            button.id = `sort-${option.id}`;
            button.textContent = option.text;
            button.style.cssText = `
                padding: 8px 12px;
                border: 1px solid #666;
                border-radius: 3px;
                background-color: #333;
                color: white;
                cursor: pointer;
                font-size: 11pt;
                font-family: Courier;
                transition: all 0.2s;
            `;
 
            button.addEventListener('mouseenter', function() {
                if (current_sort_method !== option.id) {
                    this.style.backgroundColor = '#555';
                }
            });
 
            button.addEventListener('mouseleave', function() {
                if (current_sort_method !== option.id) {
                    this.style.backgroundColor = '#333';
                }
            });
 
            button.addEventListener('click', function() {
                // Prevent re-sorting if the same method is selected
                if (current_sort_method === option.id) {
                    return;
                }
 
                // Reset all buttons to default style
                document.querySelectorAll('[id^="sort-"]').forEach(btn => {
                    btn.style.backgroundColor = '#333';
                    btn.style.borderColor = '#666';
                });
 
                // Highlight the selected button
                this.style.backgroundColor = '#555';
                this.style.borderColor = '#888';
 
                current_sort_method = option.id;
                resetBankItems(); // Reset items and apply new sort method
                option.method();
            });
 
            buttonContainer.appendChild(button);
        });
 
        // Set initial active button
        setTimeout(() => {
            document.getElementById('sort-original').style.backgroundColor = '#555';
            document.getElementById('sort-original').style.borderColor = '#888';
        }, 100);
 
        // Assemble controls
        sortingControls.appendChild(sortLabel);
        sortingControls.appendChild(buttonContainer);
 
        // Insert after the search input
        const searchInput = storageWrapper.querySelector('input[type="text"]');
        if (searchInput && searchInput.parentNode) {
            searchInput.parentNode.insertBefore(sortingControls, searchInput.nextSibling);
        } else {
            storageWrapper.insertBefore(sortingControls, storageWrapper.firstChild);
        }
    }
 
    // Function to reset bank items to original state and ensure no conflicts
    function resetBankItems() {
        bank_items.splice(0, bank_items.length, ...original_bank_items);
    }
 
    // Flag to prevent refresh_bank loop during sorting
    let isSorting = false;

    // Sorting Functions
    function sortByOriginal() {
        isSorting = true;
        resetBankItems();
        originalRefreshBank();
        isSorting = false;
    }
 
    function sortByName(reverse = false) {
        isSorting = true;
        resetBankItems();
        bank_items.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return reverse ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
        });
        originalRefreshBank();
        isSorting = false;
    }
 
    function sortByAmount(highToLow = true) {
        isSorting = true;
        resetBankItems();
        bank_items.sort((a, b) => {
            return highToLow ? b.value - a.value : a.value - b.value;
        });
        originalRefreshBank();
        isSorting = false;
    }
 
    function sortByType() {
        isSorting = true;
        resetBankItems();
        
        // Enhanced item type categories - alphabetical order for pure type sorting
        const itemCategories = {
            arrows: ['arrow', 'heads'],
            armor: ['helmet', 'body', 'legs', 'boots', 'gloves', 'mask', 'hat', 'top', 'skirt'],
            bars: ['_bar', 'promethium', 'gold', 'silver', 'iron', 'bronze', 'copper'],
            containers: ['bucket', 'vial'],
            food_cooked: ['cooked_', 'cake', 'bread'],
            food_raw: ['raw_', 'milk_bucket', 'wheat', 'sugarcane', 'banana'],
            gems: ['diamond', 'ruby', 'emerald', 'sapphire', 'crystal', 'gemstone'],
            jewelry: ['necklace', 'ring', 'sigil'],
            leaves: ['leaf'],
            materials: ['fur', 'hide', 'skin', 'silk', 'coal', 'string', 'feathers', 'nails', 'glass', 'bones', 'bonemeal', 'matches', 'algae'],
            misc: [],
            mushrooms: ['mushroom', 'shroom', 'fireshroom', 'moldshroom', 'seashroom', 'rockshroom', 'green_mushroom', 'blue_mushroom', 'spirit_mushroom', 'red_mushroom'],
            orbs: ['orb'],
            potions: ['potion'],
            seeds: ['seeds', 'haunted_tree_seeds', 'crystal_leaf_seeds', 'mangrove_tree_seeds', 'maple_tree_seeds', 'willow_tree_seeds', 'gold_leaf_seeds', 'oak_tree_seeds', 'lime_leaf_seeds', 'tree_seeds', 'fireshroom_seeds', 'moldshroom_seeds', 'green_leaf_seeds', 'seashroom_seeds', 'rockshroom_seeds', 'stardust_seeds', 'blue_mushroom_seeds', 'green_mushroom_seeds', 'dotted_green_leaf_seeds', 'spirit_mushroom_seeds', 'red_mushroom_seeds', 'hp_mushroom_seeds', 'wheat_seeds'],
            tools: ['pickaxe', 'axe', 'shovel', 'fishing_rod', 'bonecrusher'],
            trees: ['logs', 'plank'],
            weapons: ['sword', 'bow', 'staff', 'knife', 'mace', 'club', 'harpoon']
        };
 
        function getItemType(itemName) {
            const name = itemName.toLowerCase();
            
            // Check each category
            for (const [type, keywords] of Object.entries(itemCategories)) {
                if (type === 'misc') continue;
                
                if (keywords.some(keyword => name.includes(keyword))) {
                    return type;
                }
            }
            return 'misc';
        }
 
        bank_items.sort((a, b) => {
            const typeA = getItemType(a.name);
            const typeB = getItemType(b.name);
            
            // Sort by type name alphabetically first
            if (typeA !== typeB) {
                return typeA.localeCompare(typeB);
            }
            
            // Within same type, sort by item name alphabetically
            return a.name.localeCompare(b.name);
        });
        originalRefreshBank();
        isSorting = false;
    }
 
    // Override the original refresh_bank function
    const originalRefreshBank = window.refresh_bank;
    window.refresh_bank = function() {
        // Skip the override if we're in the middle of sorting
        if (isSorting) {
            originalRefreshBank.apply(this, arguments);
            return;
        }

        // Store current items before refresh if they haven't been stored yet
        if (bank_items.length > 0 && original_bank_items.length === 0) {
            original_bank_items = [...bank_items];
        }

        // Call the original refresh_bank function
        originalRefreshBank.apply(this, arguments);

        // Update original_bank_items after refresh to include new items
        setTimeout(() => {
            if (current_sort_method === 'original') {
                original_bank_items = [...bank_items];
            } else {
                // Store the current unsorted state as new original
                original_bank_items = [...bank_items];
                
                // Reapply current sorting method
                switch(current_sort_method) {
                    case 'name-asc':
                        sortByName(false);
                        break;
                    case 'name-desc':
                        sortByName(true);
                        break;
                    case 'amount-high':
                        sortByAmount(true);
                        break;
                    case 'amount-low':
                        sortByAmount(false);
                        break;
                    case 'type':
                        sortByType();
                        break;
                }
            }
        }, 50);
    };
 
    // Start initialization
    init();
 
    // Also run when bank is opened
    const originalIsBank = window.is_bank_open;
    if (originalIsBank) {
        setInterval(() => {
            if (is_bank_open() && !document.getElementById('sorting-controls')) {
                addSortingControls();
            }
        }, 1000);
    }
 
})();