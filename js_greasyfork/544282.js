// ==UserScript==
// @name         Farm RPG Harvest Log Sum
// @namespace    ClientCoinCropSum
// @version      4.5.1
// @description  Extracts and permanently stores all harvested crops, calculates average drops per harvest, and outputs to the console. Includes automatic data purging.
// @author       ClientCoin
// @match        https://farmrpg.com/*
// @match        https://alpha.farmrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/544282/Farm%20RPG%20Harvest%20Log%20Sum.user.js
// @updateURL https://update.greasyfork.org/scripts/544282/Farm%20RPG%20Harvest%20Log%20Sum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SCRIPT SETTINGS ---
    // Set this to `true` for detailed console output, `false` to run silently.
    const DEBUG_MODE = false;

    // The maximum storage size in KB before old data is purged.
    const MAX_STORAGE_KB = 4096; // Corresponds to 4 MB

    // A map defining special sub-drops and their corresponding main crops.
    const SUB_DROPS_MAP = {
        'Gold Peppers': 'Peppers',
        'Yellow Watermelon': 'Watermelon',
        'Hot Potato': 'Potato',
        'Inferno Pepper': 'Peppers',
        'Gold Eggplant': 'Eggplant',
        'Gold Peas': 'Peas',
        'Gold Carrot': 'Carrot',
        'Gold Cucumber': 'Cucumber',
        'Mega Beet': 'Beet',
        'Mega Cotton': 'Cotton',
        'Mega Sunflower': 'Sunflower'
        // Add more special drops here if needed in the future, e.g.: 'Special Drop': 'Main Crop'
    };

    let isProcessing = false;

    /**
     * Parses the harvest log from the current page and adds any new data to persistent storage.
     * Then, it processes all the stored data to produce the final summary.
     */
    async function processHarvestLog() {
        if (isProcessing) {
            // A flag to prevent the function from running multiple times in quick succession.
            return;
        }

        isProcessing = true;

        const harvestLogTitle = document.getElementById('harvestlog');
        if (!harvestLogTitle) {
            isProcessing = false;
            return;
        }

        // 1. Correctly find the main container for the harvest log items.
        // The list of harvests is in the second `div.card` element that is a sibling
        // of the `content-block-title` element.
        const harvestLogCard = harvestLogTitle.nextElementSibling.nextElementSibling;

        if (!harvestLogCard) {
            console.error('Could not find the card container for the harvest log. Please check your page HTML.');
            isProcessing = false;
            return;
        }

        // Retrieve existing harvest data from storage.
        // Initialize an empty object if no data is found.
        const storedData = await GM_getValue('harvestData', {});
        const processedHarvests = new Set(Object.keys(storedData));

        let newHarvestsAdded = 0;
        let purgedEntries = 0;

        // 2. Iterate over the harvest log on the current page.
        harvestLogCard.querySelectorAll('.list-block > div.list-group').forEach(group => {
            const titleElement = group.querySelector('.list-group-title');
            if (!titleElement) return;

            // Use the timestamp as a unique ID for this harvest session.
            const harvestTimestamp = titleElement.textContent.trim().replace('Harvest on ', '');

            // Only process harvests we haven't seen before.
            if (!processedHarvests.has(harvestTimestamp)) {
                newHarvestsAdded++;
                processedHarvests.add(harvestTimestamp);
                storedData[harvestTimestamp] = [];

                const items = group.querySelectorAll('li.close-panel');
                const mainCropElement = items[0].querySelector('.item-title strong');
                const currentMainCropName = mainCropElement ? mainCropElement.textContent.trim() : null;

                items.forEach(item => {
                    const cropNameElement = item.querySelector('.item-title strong');
                    const harvestAmountElement = item.querySelector('.item-after');

                    const cropName = cropNameElement ? cropNameElement.textContent.trim() : null;
                    const harvestAmount = parseInt(harvestAmountElement ? harvestAmountElement.textContent.trim().replace(/,/g, '') : '0', 10);

                    if (cropName && !isNaN(harvestAmount)) {
                        storedData[harvestTimestamp].push({
                            name: cropName,
                            amount: harvestAmount,
                            isMain: cropName === currentMainCropName
                        });
                    }
                });

                // Check and purge the oldest entry if storage limit is exceeded after adding a new one.
                let storageSize = JSON.stringify(storedData).length;
                if (storageSize / 1024 > MAX_STORAGE_KB) {
                    const sortedKeys = Object.keys(storedData).sort();
                    if (sortedKeys.length > 0) {
                        delete storedData[sortedKeys[0]];
                        purgedEntries++;
                    }
                }
            }
        });

        // Save the updated data back to storage if any changes were made.
        if (newHarvestsAdded > 0 || purgedEntries > 0) {
            await GM_setValue('harvestData', storedData);
        }

        // 3. Process all stored data to generate the final summary.
        const mainCropTotals = new Map();
        const mainCropOccurrences = new Map();
        const subDropTotals = new Map();

        Object.values(storedData).forEach(sessionItems => {
            let currentMainCropName = null;
            if (sessionItems.length > 0) {
                currentMainCropName = sessionItems[0].isMain ? sessionItems[0].name : null;
            }

            if (currentMainCropName) {
                const currentMainOccurrences = mainCropOccurrences.get(currentMainCropName) || 0;
                mainCropOccurrences.set(currentMainCropName, currentMainOccurrences + 1);
            }

            sessionItems.forEach(item => {
                const isSubDrop = Object.keys(SUB_DROPS_MAP).includes(item.name);

                if (isSubDrop) {
                    const currentSubTotal = subDropTotals.get(item.name) || 0;
                    subDropTotals.set(item.name, currentSubTotal + item.amount);
                } else if (item.isMain) {
                    const currentMainTotal = mainCropTotals.get(item.name) || 0;
                    mainCropTotals.set(item.name, currentMainTotal + item.amount);
                }
            });
        });

        // Calculate storage size again after any potential purging.
        const finalStorageSize = JSON.stringify(storedData).length;
        const finalStorageSizeKB = (finalStorageSize / 1024).toFixed(2);

        // 4. Log the final summary of all crops to the console.
        console.log('--- Final Harvest Log Summary ---');
        if(DEBUG_MODE) {
            console.log(`Total Harvest Sessions Recorded: ${Object.keys(storedData).length}`);
            console.log(`Current data size: ${finalStorageSizeKB} KB`);
            if (purgedEntries > 0) {
                console.log(`Note: Automatically purged ${purgedEntries} oldest harvest entries to manage storage.`);
            }
            console.log(`To clear all stored harvest data, run 'clearHarvestData()' in the console.`);
            console.log('\nHarvest Totals and Rates:');
        }
        if (purgedEntries > 0) {
            console.log(`Note: Automatically purged ${purgedEntries} oldest harvest entries to manage storage.`);
        }

        mainCropTotals.forEach((total, crop) => {
            const occurrences = mainCropOccurrences.get(crop) || 0;
            if (occurrences > 0) {
                const aph = (total / occurrences);
                console.log(`${crop}: ${aph.toFixed(2)} aph (${total} in ${occurrences} harvests)`);
            }
        });

        subDropTotals.forEach((total, crop) => {
            const mainCrop = SUB_DROPS_MAP[crop];
            const mainCropTotal = mainCropTotals.get(mainCrop) || 0;

            if (mainCropTotal > 0 && total > 0) {
                const dropRate = (mainCropTotal / total);
                console.log(`${crop}: 1 in ${Math.round(dropRate)} (${total} from ${mainCropTotal})`);
            }
        });

        //console.log('---------------------------------');

        isProcessing = false;
    }

    // Set up the MutationObserver to listen for page changes and then run the script.
    const target = document.getElementById("fireworks");
    if (!target) {
        console.error('Target element #fireworks not found. MutationObserver cannot be set up.');
        return;
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.attributeName === "data-page") {
                const newPage = target.getAttribute("data-page");
                if (newPage === "farminfo") {
                    processHarvestLog();
                }
            }
        }
    });

    const config = {
        attributes: true,
        childList: false,
        subtree: false
    };

    observer.observe(target, config);

    // Run immediately if the user is already on the correct page when the script is loaded.
    const currentPage = target.getAttribute("data-page");
    if (currentPage === "farminfo") {
        processHarvestLog();
    }
})();