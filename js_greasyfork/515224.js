// ==UserScript==
// @name         Elethor Recyclobot Calculator
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Calculate platinum production and gold profit with a UI, now with searchable item selection, on Elethor.com.
// @author       Eugene
// @match        https://elethor.com/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/515224/Elethor%20Recyclobot%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/515224/Elethor%20Recyclobot%20Calculator.meta.js
// ==/UserScript==
/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
(function() {
    'use strict';

    // Error logging function
    function logError(message, error) {
        console.error(`Elethor Recyclobot Calculator Error: ${message}`, error);
    }

    // Global error handler
    window.addEventListener('error', function(event) {
        logError('Uncaught error', event.error);
    });

    // Define the target URL for the calculator to display
    const TARGET_URL = 'https://elethor.com/character/companion/recyclobot';

    // Define the items and their base platinum points
    const itemList = [
        { name: "Rat Pelt", points: 55, id: 14 },
        { name: "Lava Worm Tooth", points: 60, id: 15 },
        { name: "Tormented Scale", points: 65, id: 16 },
        { name: "Skrivet Pelt", points: 70, id: 17 },
        { name: "Rippling Scale", points: 75, id: 18 },
        { name: "Worg Tooth", points: 80, id: 19 },
        { name: "Razen Hide", points: 85, id: 20 },
        { name: "Basic Reinforcement", points: 0, id: 39 },
        { name: "T0 Scrap", points: 600, id: 40 },
        { name: "T1 Scrap", points: 1000, id: 41 },
        { name: "T2 Scrap", points: 2000, id: 42 },
        { name: "T3 Scrap", points: 3000, id: 43 },
        { name: "Basic Energizing Shard", points: 0, id: 44 },
        { name: "Puncture 1 Essence", points: 320000, id: 45 },
        { name: "Puncture 2 Essence", points: 480000, id: 46 },
        { name: "Puncture 3 Essence", points: 800000, id: 47 },
        { name: "Puncture 4 Essence", points: 1280000, id: 48 },
        { name: "Standard Reinforcement", points: 0, id: 51 },
        { name: "Worg Claw", points: 160, id: 52 },
        { name: "Standard Energizing Shard", points: 0, id: 53 },
        { name: "Azure Tusk", points: 90, id: 54 },
        { name: "Fire Scale", points: 1200, id: 55 },
        { name: "Slotted Talon", points: 1500, id: 56 },
        { name: "Crimson Tusk", points: 95, id: 61 },
        { name: "Gory Tusk", points: 100, id: 62 },
        { name: "Poisonous Barb", points: 105, id: 63 },
        { name: "Karth Plate", points: 110, id: 64 },
        { name: "Improved Reinforcement", points: 0, id: 73 },
        { name: "Quality Reinforcement", points: 0, id: 74 },
        { name: "Improved Energizing Shard", points: 0, id: 75 },
        { name: "Quality Energizing Shard", points: 0, id: 76 },
        { name: "Bat Claw", points: 160, id: 77 },
        { name: "T4 Scrap", points: 4000, id: 78 },
        { name: "T5 Scrap", points: 5000, id: 79 },
        { name: "T6 Scrap", points: 6000, id: 80 },
        { name: "T7 Scrap", points: 7000, id: 81 },
        { name: "Spine Fragment", points: 165, id: 82 },
        { name: "Abyssal Essence", points: 0, id: 83 },
        { name: "Black Ink", points: 170, id: 84 },
        { name: "Dark Tusk", points: 175, id: 85 },
        { name: "Dark Delve", points: 180, id: 86 },
        { name: "Fireproof Tongue", points: 185, id: 87 },
        { name: "Serrated Thorn", points: 190, id: 104 },
        { name: "Imprinted Skull", points: 195, id: 117 },
        { name: "Unhinged Jawbone", points: 200, id: 122 },
        { name: "Pierced Voicebox", points: 205, id: 123 },
        { name: "Broken Shovel", points: 210, id: 124 },
        { name: "Pincered Talon", points: 215, id: 125 },
        { name: "Translucent Scale", points: 220, id: 140 },
        { name: "Scarred Fang", points: 225, id: 141 },
        { name: "Crooked Leg", points: 230, id: 142 },
        { name: "Venom Sample", points: 235, id: 143 },
        { name: "Condensed Vapor", points: 240, id: 144 },
        { name: "Fragment of Silence", points: 245, id: 145 },
        { name: "T8 Scrap", points: 0, id: 155 },
        { name: "Mechanoid Energizing Shard", points: 0, id: 156 },
        { name: "Mechanoid Reinforcement", points: 0, id: 157 },
        { name: "Unholy Remainder", points: 290, id: 158 },
        { name: "Synthetic Tar", points: 295, id: 159 },
        { name: "8.1 Reactor Core", points: 0, id: 160 },
        { name: "8.2 Reactor Core", points: 0, id: 161 },
        { name: "8.3 Reactor Core", points: 0, id: 162 },
        { name: "8.4 Reactor Core", points: 0, id: 163 },
        { name: "8.5 Reactor Core", points: 0, id: 164 },
        { name: "Growg Arm", points: 300, id: 165 },
        { name: "Decomposing Mask", points: 305, id: 166 },
        { name: "Severed Claw", points: 310, id: 168 },
        { name: "Void Fragment", points: 315, id: 169 },
        { name: "T9 Scrap", points: 0, id: 208 },
        { name: "Mutated Energizing Shard", points: 0, id: 209 },
        { name: "Mutated Reinforcement", points: 0, id: 210 },
        { name: "Mutagen", points: 0, id: 211 },
        { name: "Shattered Larynx", points: 340, id: 212 },
        { name: "Slimy Tentacle", points: 345, id: 213 },
        { name: "Broken Shackle", points: 350, id: 214 },
        { name: "Drop of Aether", points: 650, id: 215 },
        { name: "Torn Shadow", points: 355, id: 216 },
        { name: "Cursed Bane", points: 360, id: 217 },
        { name: "Volatile Dust", points: 365, id: 218 },
        { name: "Unstable Mutagen", points: 0, id: 226 },
        { name: "Unstable Particulate", points: 0, id: 227 },
        { name: "Unsorted Valuables", points: 390, id: 228 },
        { name: "T10 Scrap", points: 0, id: 276 },
        { name: "Deepwrought Energizing Shard", points: 0, id: 277 },
        { name: "Deepwrought Reinforcement", points: 0, id: 278 },
        { name: "Deepwrought Helm", points: 0, id: 279 },
        { name: "Spyglass", points: 445, id: 280 },
        { name: "Shattered Shield", points: 455, id: 281 },
        { name: "Shimmering Spearhead", points: 465, id: 282 },
        { name: "T'Chek Incisor", points: 475, id: 283 },
        { name: "Cracked Chestpiece", points: 485, id: 284 },
        { name: "Fractured Rocket", points: 500, id: 285 },
        { name: "Curved Blade", points: 1080, id: 286 },
        { name: "Void Artifact", points: 300000, id: 385 }
    ];

    // Create a button to open the calculator
    let button;
    try {
        button = document.createElement('button');
        button.innerText = 'Open Recyclobot Calculator';
        button.style.padding = '10px';
        button.style.backgroundColor = '#18743c'; // Button color
        button.style.color = '#dee5ed'; // Text color
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.position = 'absolute'; // Use absolute positioning for precise placement
        button.style.zIndex = '9999'; // Ensure the button appears on top
        button.style.display = 'none'; // Initially hidden
    } catch (error) {
        logError('Error creating calculator button', error);
    }

    // Function to position the button
    function positionButton() {
        try {
            const referenceElement = document.querySelector('.button.is-info.is-multiline.w-full'); // Target button
            if (referenceElement) {
                const rect = referenceElement.getBoundingClientRect();
                button.style.top = `${rect.top + window.scrollY - button.offsetHeight - 50}px`; // Move button above the reference element (50px margin)
                button.style.left = `${rect.left + window.scrollX - button.offsetWidth - 10}px`; // Position to the left with a margin
                document.body.appendChild(button); // Append button to the body
            }
        } catch (error) {
            logError('Error positioning calculator button', error);
        }
    }

    // Create a MutationObserver to detect changes in the DOM
    let observer;
    try {
        observer = new MutationObserver((mutations) => {
            // Check if the target element is in the DOM
            const referenceElement = document.querySelector('.button.is-info.is-multiline.w-full');
            if (referenceElement) {
                positionButton(); // Position the button
                observer.disconnect(); // Stop observing once the button is placed
            }
        });

        // Start observing the document body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    } catch (error) {
        logError('Error setting up MutationObserver', error);
    }

    // Create the calculator UI
    let calculatorContainer;
    try {
        calculatorContainer = document.createElement('div');
        calculatorContainer.style.display = 'none'; // Initially hidden
        calculatorContainer.style.position = 'fixed';
        calculatorContainer.style.top = '10px';
        calculatorContainer.style.left = '10px';
        calculatorContainer.style.maxHeight = '90vh';
        calculatorContainer.style.overflowY = 'auto';
        calculatorContainer.style.maxWidth = '95vw';
        calculatorContainer.style.border = '2px solid #505c6c'; // Border around calculator
        calculatorContainer.style.borderRadius = '10px';
        calculatorContainer.style.backgroundColor = '#202c3c'; // Background color
        calculatorContainer.style.zIndex = '1001';
        calculatorContainer.style.padding = '20px';

        // Add media query for mobile devices
        const mobileStyle = document.createElement('style');
        mobileStyle.textContent = `
            @media screen and (max-width: 768px) {
                #calculatorContainer {
                    width: 95vw !important;
                    max-height: 80vh !important;
                    overflow-y: auto !important;
                }
                input, select {
                    width: 100% !important;
                    margin-bottom: 10px !important;
                }
                .tooltip .tooltiptext {
                    width: 80vw !important;
                    margin-left: -40vw !important;
                }
            }
        `;
        document.head.appendChild(mobileStyle);
    } catch (error) {
        logError('Error creating calculator container', error);
    }

    // Function to position the calculator below the "Prospector" element
    function positionCalculator() {
       try {
            const gearElement = document.querySelector('a[href="/character/gear"]');
            if (gearElement) {
                const rect = gearElement.getBoundingClientRect();
                calculatorContainer.style.top = `${rect.bottom + window.scrollY}px`;// From the bottom of the Gear element
                calculatorContainer.style.left = `${rect.left + window.scrollX}px`; // Align horizontally with the Gear element
            }
        } catch (error) {
            logError('Error positioning calculator', error);
        }
    }

    // Set the initial position of the calculator
    try {
        positionCalculator();
        document.body.appendChild(calculatorContainer);
    } catch (error) {
        logError('Error setting initial calculator position', error);
    }

    // Add form elements to the calculator
    calculatorContainer.innerHTML = `
        <style>
            .tooltip {
                position: relative;
                display: inline-block;
                cursor: pointer;
                margin-left: 5px;
            }
            .tooltip .tooltiptext {
                visibility: hidden;
                width: 200px;
                background-color: #555;
                color: #fff;
                text-align: center;
                border-radius: 6px;
                padding: 5px;
                position: absolute;
                z-index: 1;
                bottom: 125%;
                left: 50%;
                margin-left: -100px;
                opacity: 0;
                transition: opacity 0.3s;
            }
            .tooltip:hover .tooltiptext {
                visibility: visible;
                opacity: 1;
            }
            #itemDropdown {
                background-color: #fff;
                border: 1px solid #dee5ed;
                border-radius: 5px;
                max-height: 200px;
                overflow-y: auto;
                position: absolute;
                width: 200px;
                z-index: 1000;
            }
            #itemDropdown div {
                padding: 5px;
                cursor: pointer;
                color: black; /* This matches the color of other input fields */
            }
            #itemDropdown div:hover {
                background-color: #f0f0f0;
            }
        </style>
        <h3 style="color: #dee5ed;">Elethor Recyclobot Calculator</h3>
        <p style="color: #dee5ed; font-size: 0.9em;">Made by <a href="https://elethor.com/profile/49979" target="_blank" style="color: #6cb4e4; text-decoration: underline;">Eugene</a></p>
        <div style="margin-bottom: 5px; position: relative;">
            <label style="color: #dee5ed;">Select Item:</label>
            <input type="text" id="itemSearch" placeholder="Search items..." style="border: 1px solid #dee5ed; border-radius: 5px; padding: 5px; width: 200px; margin-right: 10px; color: black;">
            <div id="itemDropdown" style="display: none;"></div>
            <span class="tooltip">ℹ️<span class="tooltiptext">Choose the item you want to recycle</span></span>
        </div>
        <div style="margin-bottom: 5px;">
            <label style="color: #dee5ed;">Bonus Platinum Level:</label>
            <input type="number" id="bonusPlatinumLevel" required style="border: 1px solid #dee5ed; border-radius: 5px; padding: 5px; width: 100px; margin-right: 10px; color: black;">
            <span class="tooltip">ℹ️<span class="tooltiptext">Your current Bonus Platinum level</span></span>
        </div>
        <div style="margin-bottom: 5px;">
            <label style="color: #dee5ed;">Exchange Rate Level:</label>
            <input type="number" id="exchangeRateLevel" required style="border: 1px solid #dee5ed; border-radius: 5px; padding: 5px; width: 100px; margin-right: 10px; color: black;">
            <span class="tooltip">ℹ️<span class="tooltiptext">Your current Exchange Rate level</span></span>
        </div>
        <div style="margin-bottom: 5px;">
            <label style="color: #dee5ed;">Gold cost per item:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="number" step="0.01" id="itemGoldCost" required style="border: 1px solid #dee5ed; border-radius: 5px; padding: 5px; width: 100px; color: black;">
                <div style="display: flex; align-items: center;">
                    <input type="checkbox" id="autoPull" style="margin-right: 5px;">
                    <label for="autoPull" style="color: #dee5ed; margin-right: 10px;">Auto-pull</label>
                    <select id="priceType" style="border: 1px solid #dee5ed; border-radius: 5px; padding: 5px; color: black;">
                        <option value="sell">Sell price</option>
                        <option value="buy">Buy price</option>
                    </select>
                </div>
            </div>
            <span class="tooltip">ℹ️<span class="tooltiptext">The gold cost for each item you're recycling. Enable Auto-pull to fetch current market prices.</span></span>
        </div>
        <div style="margin-bottom: 5px;">
            <label style="color: #dee5ed;">Gold value per platinum (in millions):</label>
            <input type="number" step="0.01" id="goldPerPlatinum" required style="border: 1px solid #dee5ed; border-radius: 5px; padding: 5px; width: 100px; margin-right: 10px; color: black;">
            <span class="tooltip">ℹ️<span class="tooltiptext">The current gold value of one platinum in millions</span></span>
        </div>
        <div style="margin-bottom: 5px;">
    <label style="color: #dee5ed;">
        <input type="checkbox" id="useProfitForProduction"> Use profit for production
    </label>
     <span class="tooltip">ℹ️<span class="tooltiptext">When unchecked: It calculates profit per platinum. It will stop when it the cost of producing the next platinum exceeds sale price. Use this if you want to make profit from the platinum you produce.         When checked: It calculates profit per platinum. When cost of producing next platinum exceeds sale price,the loss is deducted from the profit you have made till then.Use this if you just want to make platinum. It's better to sell off the mob drops than use the profit, but the decision is up to you. </span></span>
</div>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button id="calculateBtn" style="background-color: #18743c; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Calculate</button>
            <button id="resetBtn" style="background-color: #2596be; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🔄 Reset</button>
            <button id="closeBtn" style="background-color: #a02424; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">X Close</button>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button id="copyInputBtn" style="background-color: #ea951f; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📋 Copy Input</button>
            <button id="copyOutputBtn" style="background-color: #ea951f; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📋 Copy Output</button>
        </div>
        <div id="results" style="margin-top: 20px;"></div>
    `;

    // Show/hide calculator on button click
    button.addEventListener('click', () => {
        try {
            // Toggle the visibility of the calculator
            if (calculatorContainer.style.display === 'none') {
                calculatorContainer.style.display = 'block';
                positionCalculator(); // Ensure it is positioned correctly when opened
                loadInputs(); // Load saved inputs when opening
            } else {
                calculatorContainer.style.display = 'none';
            }
        } catch (error) {
            logError('Error toggling calculator visibility', error);
        }
    });

    // Close button
    calculatorContainer.querySelector('#closeBtn').addEventListener('click', () => {
        try {
            calculatorContainer.style.display = 'none';
        } catch (error) {
            logError('Error closing calculator', error);
        }
    });

    // Reset button functionality
    calculatorContainer.querySelector('#resetBtn').addEventListener('click', () => {
        try {
            document.querySelector('#itemSearch').value = ''; // Clear search input
            document.querySelector('#bonusPlatinumLevel').value = '';
            document.querySelector('#exchangeRateLevel').value = '';
            document.querySelector('#itemGoldCost').value = '';
            document.querySelector('#goldPerPlatinum').value = '';
            clearInputs(); // Clear localStorage
            document.getElementById('results').innerHTML = ''; // Clear results
        } catch (error) {
            logError('Error resetting calculator', error);
        }
    });

   // Function to flash the button when clicked
    function flashButton(button) {
        try {
            const originalColor = button.style.backgroundColor;
            button.style.backgroundColor = '#4CAF50'; // Success color (green)
            setTimeout(() => {
                button.style.backgroundColor = originalColor; // Revert back after 300ms
            }, 300);
        } catch (error) {
            logError('Error flashing button', error);
        }
    }

    // Copy Output button functionality with flash effect
    calculatorContainer.querySelector('#copyOutputBtn').addEventListener('click', () => {
        try {
            const resultsText = document.getElementById('results').innerText;
            navigator.clipboard.writeText(resultsText)
            .then(() => {
                flashButton(calculatorContainer.querySelector('#copyOutputBtn')); // Flash button
                console.log('Output copied to clipboard!');
            })
            .catch(err => logError('Failed to copy output', err));
        } catch (error) {
            logError('Error copying output', error);
        }
    });

    // Copy Input button functionality with flash effect
    calculatorContainer.querySelector('#copyInputBtn').addEventListener('click', () => {
        try {
            const selectedItem = document.querySelector('#itemSearch').value;
            const bonusPlatinumLevel = document.querySelector('#bonusPlatinumLevel').value;
            const exchangeRateLevel = document.querySelector('#exchangeRateLevel').value;
            const itemGoldCost = document.querySelector('#itemGoldCost').value;
            const goldPerPlatinum = document.querySelector('#goldPerPlatinum').value;

            const inputText = `
                Selected Item: ${selectedItem}
                Bonus Platinum Level: ${bonusPlatinumLevel}
                Exchange Rate Level: ${exchangeRateLevel}
                Gold cost per item: ${itemGoldCost}
                Gold value per platinum (in millions): ${goldPerPlatinum}
            `;

            navigator.clipboard.writeText(inputText.trim())
                .then(() => {
                    flashButton(calculatorContainer.querySelector('#copyInputBtn')); // Flash button
                    console.log('Input values copied to clipboard!');
                })
                .catch(err => logError('Failed to copy input', err));
        } catch (error) {
            logError('Error copying input', error);
        }
    });

    // Searchable dropdown functionality
    const itemSearch = document.getElementById('itemSearch');
    const itemDropdown = document.getElementById('itemDropdown');
    let selectedItemPoints = 0;

    function populateDropdown(items) {
        try {
            itemDropdown.innerHTML = '';
            items.forEach(item => {
                const div = document.createElement('div');
                div.textContent = item.name;
                div.onclick = function() {
                    itemSearch.value = item.name;
                    selectedItemPoints = item.points;
                    itemDropdown.style.display = 'none';
                };
                itemDropdown.appendChild(div);
            });
            itemDropdown.style.display = 'block';
        } catch (error) {
            logError('Error populating dropdown', error);
        }
    }

    itemSearch.addEventListener('focus', function() {
        try {
            if (this.value === '') {
                populateDropdown(itemList);
            }
        } catch (error) {
            logError('Error handling item search focus', error);
        }
    });

    itemSearch.addEventListener('input', function() {
        try {
            const searchTerm = this.value.toLowerCase();
            const filteredItems = searchTerm === '' ? itemList : itemList.filter(item =>
                item.name.toLowerCase().includes(searchTerm)
            );
            populateDropdown(filteredItems);
        } catch (error) {
            logError('Error handling item search input', error);
        }
    });

    document.addEventListener('click', function(e) {
        try {
            if (e.target !== itemSearch && e.target !== itemDropdown) {
                itemDropdown.style.display = 'none';
            }
        } catch (error) {
            logError('Error handling document click', error);
        }
    });

    // Function to fetch market data
    async function fetchMarketData(itemId, priceType) {
        try {
            const response = await fetch(`https://elethor.com/game/market/listings?itemId=${itemId}`);
            const data = await response.json();

            if (!data || !Array.isArray(data)) {
                throw new Error('Invalid market data received');
            }

            // Filter listings based on price type
            const relevantListings = data.filter(listing => listing.type === priceType);

            if (relevantListings.length === 0) {
                throw new Error(`No ${priceType} listings found`);
            }

            // Get the appropriate price based on type
            if (priceType === 'sell') {
                // Get lowest sell price
                return Math.min(...relevantListings.map(listing => listing.price));
            } else {
                // Get highest buy price
                return Math.max(...relevantListings.map(listing => listing.price));
            }
        } catch (error) {
            logError('Error fetching market data', error);
            throw error;
        }
    }

    // Auto-pull checkbox event handler
    const autoPullCheckbox = document.getElementById('autoPull');
    const itemGoldCostInput = document.getElementById('itemGoldCost');
    const priceTypeSelect = document.getElementById('priceType');

    autoPullCheckbox.addEventListener('change', function() {
        itemGoldCostInput.disabled = this.checked;
    });

    // Calculate button functionality
    calculatorContainer.querySelector('#calculateBtn').addEventListener('click', async () => {
        try {
            const bonusPlatinumLevel = parseFloat(document.querySelector('#bonusPlatinumLevel').value);
            const exchangeRateLevel = parseFloat(document.querySelector('#exchangeRateLevel').value);
            const goldPerPlatinum = parseFloat(document.querySelector('#goldPerPlatinum').value);

            // Get the selected item's ID
            const selectedItem = itemList.find(item => item.name === document.querySelector('#itemSearch').value);
            if (!selectedItem) {
                throw new Error('Please select a valid item');
            }

            let itemGoldCost;
            const autoPull = document.getElementById('autoPull').checked;

            if (autoPull) {
                try {
                    const priceType = document.getElementById('priceType').value;
                    itemGoldCost = await fetchMarketData(selectedItem.id, priceType);
                    document.getElementById('itemGoldCost').value = itemGoldCost; // Update the input field
                } catch (error) {
                    alert('Failed to fetch market price. Please check if the item is available on the market or enter the price manually.');
                    return;
                }
            } else {
                itemGoldCost = parseFloat(document.querySelector('#itemGoldCost').value);
            }

            // Validation: Check for positive values
            if (
                selectedItemPoints <= 0 ||
                isNaN(bonusPlatinumLevel) || bonusPlatinumLevel < 0 ||
                isNaN(exchangeRateLevel) || exchangeRateLevel < 0 ||
                isNaN(itemGoldCost) || itemGoldCost < 0 ||
                isNaN(goldPerPlatinum) || goldPerPlatinum < 0
            ) {
                throw new Error('Invalid input values');
            }

            saveInputs(selectedItemPoints, bonusPlatinumLevel, exchangeRateLevel, itemGoldCost, goldPerPlatinum);

            const ITEMS_PER_RECYCLE = 200;
            const BASE_PLATINUM_POINTS = selectedItemPoints;
            const BASE_PLATINUM_COST = 10000;
            const MAX_COST_INCREASE_PLATINUM = 20;
            const PLATINUM_GOLD_COST = 250000;
            const BONUS_PLATINUM_INCREMENT = 0.002;

            const exchangeRateMultiplier = 1 + (exchangeRateLevel * 0.01);
            const bonusPlatinumMultiplier = 1 + (bonusPlatinumLevel * BONUS_PLATINUM_INCREMENT);
            const platinumPointsPerRecycle =  Math.floor(BASE_PLATINUM_POINTS * exchangeRateMultiplier);
            let totalGoldProfit = 0;
            let platinumCount = 0;
            let totalGoldSpent = 0;
            let totalItemsUsed = 0;
            let currentPlatinumCost = BASE_PLATINUM_COST;

            while (true) {
                const platinumPointsNeeded = currentPlatinumCost;
                const requiredRecycles = (platinumPointsNeeded / platinumPointsPerRecycle);
                const requiredItems = requiredRecycles * ITEMS_PER_RECYCLE;
                totalItemsUsed += requiredItems;

                const itemsGoldCostTotal = requiredItems * itemGoldCost;
                const totalGoldCost = PLATINUM_GOLD_COST + itemsGoldCostTotal;

                // Total platinum produced including bonus
                const totalPlatinum = 1 * bonusPlatinumMultiplier;
                const basePlatinum = 1; // Base platinum unit
                const bonusPlatinum = totalPlatinum - basePlatinum; // Bonus platinum units

                // Cost per unit of platinum
                const costPerPlatinum = totalGoldCost / totalPlatinum;

                // Calculate profit per platinum unit
                let profit = 0;

                // Profit from base platinum (100% of its gold value)
                profit += (basePlatinum * goldPerPlatinum * 1_000_000) - (costPerPlatinum * basePlatinum);

                // Profit from bonus platinum (90% of its gold value)
                profit += (bonusPlatinum * goldPerPlatinum * 1_000_000 * 0.9) - (costPerPlatinum * bonusPlatinum);

                const useProfitForProduction = document.getElementById('useProfitForProduction').checked;

if (profit <= 0) {
    if (useProfitForProduction && totalGoldProfit > 0) {
        totalGoldProfit += profit; // Deduct loss from totalGoldProfit
    } else {
        break; // Exit the loop if profit is non-positive and checkbox is not checked
    }
}

                // Accumulate the total profits and costs
                totalGoldProfit += profit;
                totalGoldSpent += totalGoldCost;
                platinumCount++;

                // Increase platinum cost for the next cycle
                if (platinumCount < MAX_COST_INCREASE_PLATINUM) {
                    currentPlatinumCost += 1000;
                } else {
                    currentPlatinumCost += 500;
                }
            }

            // Display results
            document.getElementById('results').innerHTML = `
                <p style="color: #dee5ed;">Platinum to produce: ${platinumCount}</p>
                <p style="color: #dee5ed;">Total Gold Profit: ${formatToBillions(totalGoldProfit)}</p>
                <p style="color: #dee5ed;">Maximum Bonus Platinum: ${(platinumCount * bonusPlatinumMultiplier).toFixed(2)}</p>
                <p style="color: #dee5ed;">Total Items Used: ${totalItemsUsed}</p>
            `;
        } catch (error) {
            logError('Error in calculation', error);
            alert('An error occurred during calculation. Please check your inputs and try again.');
        }
    });

    // Function to format value to billions
    function formatToBillions(value) {
        try {
            let billions = value / 1_000_000_000;
            return billions.toFixed(2) + " billion";
        } catch (error) {
            logError('Error formatting to billions', error);
            return "Error";
        }
    }

    // Save inputs to localStorage
    function saveInputs(selectedItemPoints, bonusPlatinumLevel, exchangeRateLevel, itemGoldCost, goldPerPlatinum) {
        try {
            localStorage.setItem('selectedItemPoints', selectedItemPoints);
            localStorage.setItem('bonusPlatinumLevel', bonusPlatinumLevel);
            localStorage.setItem('exchangeRateLevel', exchangeRateLevel);
            localStorage.setItem('itemGoldCost', itemGoldCost);
            localStorage.setItem('goldPerPlatinum', goldPerPlatinum);
        } catch (error) {
            logError('Error saving inputs to localStorage', error);
        }
    }

    // Load inputs from localStorage
    function loadInputs() {
        try {
            const savedItemPoints = localStorage.getItem('selectedItemPoints');
            if (savedItemPoints) {
                const savedItem = itemList.find(item => item.points == savedItemPoints);
                if (savedItem) {
                    document.querySelector('#itemSearch').value = savedItem.name;
                    selectedItemPoints = savedItem.points;
                }
            }
            document.querySelector('#bonusPlatinumLevel').value = localStorage.getItem('bonusPlatinumLevel') || '';
            document.querySelector('#exchangeRateLevel').value = localStorage.getItem('exchangeRateLevel') || '';
            document.querySelector('#itemGoldCost').value = localStorage.getItem('itemGoldCost') || '';
            document.querySelector('#goldPerPlatinum').value = localStorage.getItem('goldPerPlatinum') || '';
        } catch (error) {
            logError('Error loading inputs from localStorage', error);
        }
    }

    // Clear inputs from localStorage
    function clearInputs() {
        try {
            localStorage.removeItem('selectedItemPoints');
            localStorage.removeItem('bonusPlatinumLevel');
            localStorage.removeItem('exchangeRateLevel');
            localStorage.removeItem('itemGoldCost');
            localStorage.removeItem('goldPerPlatinum');
        } catch (error) {
            logError('Error clearing inputs from localStorage', error);
        }
    }

    // URL check function to show button and calculator only on the correct page
    function checkURL() {
        try {
            if (window.location.href === TARGET_URL) {
                button.style.display = 'block';
                if (calculatorContainer.style.display !== 'none') {
                    positionCalculator();
                }
            } else {
                button.style.display = 'none';
                calculatorContainer.style.display = 'none';
            }
        } catch (error) {
            logError('Error checking URL', error);
        }
    }

    // Check URL initially and set interval for changes
    checkURL();
    setInterval(checkURL, 500); // Check URL every 500 milliseconds

})();
