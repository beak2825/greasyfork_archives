// ==UserScript==
// @name         Flat MMO Recipe Item Names
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add item names underneath pictures in recipe materials
// @author       Carlos
// @match        https://flatmmo.com/db/makeitems.php
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/544351/Flat%20MMO%20Recipe%20Item%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/544351/Flat%20MMO%20Recipe%20Item%20Names.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Item name mapping based on image filenames
    const itemNames = {
        // Materials & Resources
        'logs.png': 'Logs',
        'willow_logs.png': 'Willow Logs',
        'oak_logs.png': 'Oak Logs',
        'maple_logs.png': 'Maple Logs',
        'mangrove_logs.png': 'Mangrove Logs',
        'haunted_logs.png': 'Haunted Logs',

        // Mushrooms
        'red_mushroom.png': 'Red Mushroom',
        'green_mushroom.png': 'Green Mushroom',
        'blue_mushroom.png': 'Blue Mushroom',
        'rockshroom.png': 'Rockshroom',
        'moldshroom.png': 'Moldshroom',
        'seashroom.png': 'Seashroom',
        'fireshroom.png': 'Fireshroom',

        // Leaves
        'dotted_green_leaf.png': 'Dotted Green Leaf',
        'green_leaf.png': 'Green Leaf',

        // Containers & Tools
        'vial.png': 'Vial',
        'bucket.png': 'Bucket',
        'water_bucket.png': 'Water Bucket',
        'milk_bucket.png': 'Milk Bucket',

        // Food Items
        'wheat.png': 'Wheat',
        'sugarcane.png': 'Sugarcane',
        'chicken_egg.png': 'Chicken Egg',
        'banana.png': 'Banana',

        // Crafting Materials
        'string.png': 'String',
        'purple_string.png': 'Purple String',
        'feathers.png': 'Feathers',
        'glass.png': 'Glass',
        'sand.png': 'Sand',
        'bones.png': 'Bones',
        'giant_bones.png': 'Giant Bones',
        'bonemeal.png': 'Bonemeal',
        'barbed_wire.png': 'Barbed Wire',

        // Animal Hides & Furs
        'snakeskin.png': 'Snakeskin',
        'bear_fur.png': 'Bear Fur',
        'tiger_fur.png': 'Tiger Fur',
        'crocodile_hides.png': 'Crocodile Hides',

        // Ores & Metals
        'copper.png': 'Copper',
        'iron.png': 'Iron',
        'silver.png': 'Silver',
        'gold.png': 'Gold',
        'promethium.png': 'Promethium',
        'coal.png': 'Coal',
        'charcoal.png': 'Charcoal',

        // Bars
        'bronze_bar.png': 'Bronze Bar',
        'iron_bar.png': 'Iron Bar',
        'silver_bar.png': 'Silver Bar',
        'gold_bar.png': 'Gold Bar',
        'promethium_bar.png': 'Promethium Bar',

        // Gems
        'sapphire.png': 'Sapphire',
        'emerald.png': 'Emerald',
        'ruby.png': 'Ruby',
        'diamond.png': 'Diamond',
        'cut_sapphire.png': 'Cut Sapphire',
        'cut_emerald.png': 'Cut Emerald',
        'cut_ruby.png': 'Cut Ruby',
        'cut_diamond.png': 'Cut Diamond',
        'enchanted_sapphire.png': 'Enchanted Sapphire',
        'enchanted_emerald.png': 'Enchanted Emerald',
        'enchanted_ruby.png': 'Enchanted Ruby',
        'enchanted_diamond.png': 'Enchanted Diamond',

        // Enchanting Materials
        'stardust.png': 'Stardust',
        'blue_mage_silk.png': 'Blue Mage Silk',
        'red_mage_silk.png': 'Red Mage Silk',
        'unpowered_orb.png': 'Unpowered Orb',

        // Arrow Components
        'arrow_shafts.png': 'Arrow Shafts',
        'bronze_arrow_heads.png': 'Bronze Arrow Heads',
        'iron_arrow_heads.png': 'Iron Arrow Heads',
        'silver_arrow_heads.png': 'Silver Arrow Heads',
        'gold_arrow_heads.png': 'Gold Arrow Heads',
        'promethium_arrow_heads.png': 'Promethium Arrow Heads',

        // Crafted Items (for upgrade recipes)
        'fishing_net.png': 'Fishing Net',
        'uncooked_cake.png': 'Uncooked Cake',
        'bread_dough.png': 'Bread Dough',
        'blue_mage_boots.png': 'Blue Mage Boots',
        'blue_mage_gloves.png': 'Blue Mage Gloves',
        'blue_mage_hat.png': 'Blue Mage Hat',
        'blue_mage_top.png': 'Blue Mage Top',
        'blue_mage_skirt.png': 'Blue Mage Skirt',
        'maple_plank.png': 'Maple Plank',
        'nails.png': 'Nails'
    };

    function getItemNameFromSrc(src) {
        // Extract filename from the src path
        const filename = src.split('/').pop();
        return itemNames[filename] || filename.replace('.png', '').replace(/_/g, ' ');
    }

    function addItemNames() {
        // Find all material cells (5th column in the table)
        const materialCells = document.querySelectorAll('.dynamic-table td:nth-child(5)');

        materialCells.forEach(cell => {
            // Find all images in this cell
            const images = cell.querySelectorAll('img.w30');

            images.forEach(img => {
                // Check if we already added a name for this image
                if (img.nextElementSibling && img.nextElementSibling.classList.contains('item-name')) {
                    return;
                }

                const itemName = getItemNameFromSrc(img.src);

                // Create a span element for the item name
                const nameSpan = document.createElement('span');
                nameSpan.textContent = itemName;
                nameSpan.className = 'item-name';
                nameSpan.style.cssText = `
                    display: block;
                    font-size: 10px;
                    color: #333;
                    text-align: center;
                    margin-top: 2px;
                    font-weight: bold;
                    text-shadow: 1px 1px 1px rgba(255,255,255,0.8);
                `;

                // Insert the name after the image
                img.parentNode.insertBefore(nameSpan, img.nextSibling);
            });
        });
    }

    // Run when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addItemNames);
    } else {
        addItemNames();
    }

    // Also run when filter changes (since the script uses display:none/block)
    const filterInputs = document.querySelectorAll('input[name="filter"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            // Small delay to let the filter apply first
            setTimeout(addItemNames, 100);
        });
    });

})();