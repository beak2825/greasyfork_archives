// ==UserScript==
// @name         Dead Frontier Cheapest Item Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Change border color for the cheapest item in inventory and backpack on page load or DOM update
// @author       Lucky11
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545859/Dead%20Frontier%20Cheapest%20Item%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/545859/Dead%20Frontier%20Cheapest%20Item%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //const ignoredItems = ['Cooked Quinoa','Barrel Backpack Stats 2','Flesh Seeker Stats 888','Tide Breaker Stats 867','Quinoa','Biomass Non-Transferable','Biomass','Wooden Planks','Nails', 'Treasure Chest 2024']; // Replace with actual item names "Non-Transferable" only includes Non-Transferable items
//NOTE : MC items that should be ignored are defined with item name + Stats. For example NGC Barrel Backpack is ignored by writing the name then +" Stats 2" = 'Barrel Backpack Stats 2' if it was GC then it would be 'Barrel Backpack Stats 3' ect.
    const ignoredItems = []; //check example above!
    const highlightAll = true; // Set to true to highlight all items with the same cheapest price or to false to highlight just 1 item
    const highlightStyle = '1.5px dashed #FF6112'; // Change to your desired highlight style

    const ignoreLockedItems = true; // New variable to toggle ignoring locked items
    const ignoreGCItems = true; // New variable to toggle ignoring GC items

    const ignoredItemsDataType = ['forsakentitaniumblades_stats888','dawnreactive_colourBlack_stats2424'];// Define the additional list of ignored item data types when Names don't work.
//If you add item Name correctly to ignoredItems but it still doesn't ignore it then Right click the item in browser
//Inspect element. It will open HTML code with item information
//example: data-quality="1" data-type="forsakentitaniumblades_stats888" data-itemtype="weapon"
//copy data-type value and place it in the list above!

    // Function to generate a new ignored items list based on names
    function Generate_new_ignored_items() {
        const newIgnoredItems = [];
        const items = unsafeWindow.globalData; // Access global data

        for (const itemName of ignoredItems) {
            let modifiedType;
            let baseName = itemName;

            // Check if the item name contains "Cooked"
            if (itemName.includes("Cooked")) {
                baseName = itemName.replace("Cooked ", ""); // Remove "Cooked"
            }

            // Check if the item name contains "Non-Transferable"
            if (itemName.includes("Non-Transferable")) {
                baseName = itemName.replace(" Non-Transferable", ""); // Remove "Non-Transferable"
            }

            // Check for specific keywords and extract suffix
            let suffix = '';
            if (itemName.includes("Stats")) {
                const parts = itemName.split("Stats");
                baseName = parts[0].trim(); // Get everything before "Stats"
                suffix = parts[1] ? `_stats${parts[1].trim()}` : '_stats'; // Append "_stats" or "_statsX" if there's more
                //console.log(suffix);
                //console.log(baseName);
            }

            // Find the type for the base name in globalData
            for (const key in items) {
                if (items[key].name === baseName) {
                    modifiedType = key.toLowerCase(); // Get the original type
                    if (itemName.includes("Cooked")) {
                        modifiedType += "_cooked"; // Append "_cooked" if it was cooked
                    }
                    if (itemName.includes("Non-Transferable")) {
                        modifiedType += "_nt"; // Append "_nt" if it was non-transferable
                    }
                    if (suffix) {
                        modifiedType += suffix.toLowerCase(); // Append any additional suffixes
                    }
                    newIgnoredItems.push(modifiedType); // Push the modified type to the new list
                    break; // Exit the loop once found
                }
            }
        }
        // Add contents from ignoredItemsDataType to newIgnoredItems
        ignoredItemsDataType.forEach(item => {
            newIgnoredItems.push(item); // Push each item from the additional list
        });
        return newIgnoredItems;
    }
    // Function to extract items and their scrap values
    function extractItems(container) {
        const items = [];
        const validSlots = container.querySelectorAll('.validSlot');

        validSlots.forEach(slot => {
            // Check if the slot is locked and if ignoring locked items is enabled
            if (ignoreLockedItems && slot.classList.contains('locked')) {
                return; // Skip locked items if the toggle is on
            }

            const item = slot.querySelector('.item');
            if (item) {
                const dataType = item.dataset.type;
                // Check if item is GC and if ignoring GC items is enabled
                if (ignoreGCItems && (dataType.includes('_stats888') || dataType.includes('_stats2424'))) {
                    return; // Skip GC items if the toggle is on
                }
                const dataQuantity = item.dataset.quantity ? parseInt(item.dataset.quantity) : 1;
                const scrapValue = unsafeWindow.scrapValue(dataType, dataQuantity);

                if (!Generate_new_ignored_items().includes(dataType)) {
                    items.push({ element: item, scrapValue });
                }
            }
        });

        return items;
    }

    // Function to highlight the cheapest item(s)
    function highlightCheapestItem() {
        const inventoryContainer = document.getElementById('inventory');
        const backpackContainer = document.getElementById('backpackdisplay');

        // Check if containers exist
        if (!inventoryContainer || !backpackContainer) {
            console.error("Inventory or Backpack container not found.");
            return; // Exit if containers are not found
        }

        const inventoryItems = extractItems(inventoryContainer);
        const backpackItems = extractItems(backpackContainer);

        const allItems = [...inventoryItems, ...backpackItems];

        if (allItems.length === 0) return;

        // Find the cheapest item
        const cheapestItem = allItems.reduce((prev, curr) => (prev.scrapValue < curr.scrapValue ? prev : curr));
        const cheapestValue = cheapestItem.scrapValue;

        // Reset borders for all items
        allItems.forEach(item => {
            item.element.style.border = '';
        });

        // Highlight the cheapest item(s)
        if (highlightAll) {
            allItems.forEach(item => {
                if (item.scrapValue === cheapestValue) {
                    item.element.style.border = highlightStyle; // Apply the highlight style
                }
            });
        } else {
            cheapestItem.element.style.border = highlightStyle; // Highlight only the cheapest item
        }
    }

    // Run the highlight function after a delay to ensure elements are loaded
    setTimeout(highlightCheapestItem, 2000); // Adjust the delay as needed

    // Observe DOM changes to check for the presence of inventory and backpack containers
    const observer = new MutationObserver(() => {
        const inventoryContainer = document.getElementById('inventory');
        const backpackContainer = document.getElementById('backpackdisplay');

        if (inventoryContainer && backpackContainer) {
            highlightCheapestItem(); // Call the function if both containers are found
            //observer.disconnect(); // Stop observing once the containers are found
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

})();
