// ==UserScript==
// @name         Farm RPG Locksmith Gold Indicator
// @version      1.0.30
// @description  Adds a gold indicator to items in the Locksmith and shows the total gold available.
// @author       ClientCoin
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @match        *://*farmrpg.com/index.php*
// @match        *://*farmrpg.com/
// @match        *://*alpha.farmrpg.com/index.php*
// @match        *://*alpha.farmrpg.com/
// @grant        none
// @license      MIT
// @namespace    whatisthisok
// @downloadURL https://update.greasyfork.org/scripts/547563/Farm%20RPG%20Locksmith%20Gold%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/547563/Farm%20RPG%20Locksmith%20Gold%20Indicator.meta.js
// ==/UserScript==

'use strict';

// Set to a bitwise sum of desired flags: 1=Errors, 2=Info, 4=Container search details, 8=Detailed item processing.
const DEBUG_LEVEL = 0;

const DEBUG_ERRORS = 1;
const DEBUG_INFO = 2;
const DEBUG_CONTAINER_SEARCH = 4;
const DEBUG_ITEM_PROCESSING = 8;

/**
 * Custom logging function that checks against the DEBUG_LEVEL bitfield.
 * @param {string} message - The message to log.
 * @param {number} level - The log level flag (e.g., DEBUG_ERRORS, DEBUG_INFO).
 * @param {*} [data=null] - Optional data to log with the message.
 */
function logDebug(message, level, data = null) {
    if ((DEBUG_LEVEL & level) === level) {
        if (data !== null) {
            console.log(`[Locksmith Gold] ${message}`, data);
        } else {
            console.log(`[Locksmith Gold] ${message}`);
        }
    }
}

// A map of item names to the amount of gold they contain.
const GOLD_ITEMS = {
    "Thomas's Tavern Tote": 25,
    "Stack of Cards": 25,
    "Pot of Gold (Large)": 50,
    "Pot of Gold (Small)": 10,
    "Cornucopia": 25,
    "Box of Chocolate 01": 25,
    "Spring Basket 01": 25,
    "frank's Basket": 25,
    "Summer Basket": 25,
    "Christmas Present 01": 50,
    "Present 02": 50,
    "Backpack": 25,
    "Fall Basket": 25,
    "Treat Bag 04": 25,
    "Cornucopia 01": 25,
    "Lovely Present": 25,
    "Winter Basket": 25,
    "Frozen Chest 03": 25,
    "Box Of Chocolate 02": 25,
    "Holger's Lunch Box": 25,
    "Beatrix's Big Box of Boom": 25,
    "Holiday Cheer Bundle 01": 25,
    "Buddy's School Bag": 25,
    "Apple Basket": 25,
    "Treat Bag 05": 25,
    "Cornucopia 02": 25,
    "Cornucopia 03": 25,
    "Fancy Present": 25,
    "Frozen Chest 01": 25,
    "Heart-shaped Box 01": 25,
    "Green Backpack": 85,
    "Pot of Gold (Medium)": 25,
    "Magical Chest 01": 25,
    "Rosalie's Beach Tote": 25,
    "Beatrix's Booming Brawl Box 01": 25, 
    "Beatrix's Booming Brawl Box 02": 25,
    "Pillow Case 01": 75,
    "Baba's Snack Pack": 25,
    "Apple Crate 01": 25,
    "Apple Crate 02": 25,
    "Treat Bag 04": 25,
    "Treat Bag 05": 25,
    "Treat Bag 06": 25,
    "Shiny Present": 25,
    "Frozen Chest 02": 25,
    "Heart-Shaped Box 02": 25,
    "Spring Basket 02": 25,
    "Magical Chest 02": 25,
    "Buddy's Beach Bag": 25,
    "Beatrix's Booming Brawl Box 02": 25,
    // New items added below
    "5 Gold": 5,
    "50 Gold": 50,
    "10 Gold": 10,
    "25 Gold": 25,
    "100 Gold": 100,
};

const GOLD_EMOJI = '💰';
const PROCESSED_ATTRIBUTE = 'data-fpgi-processed';
const processedItems = new Set();

/**
 * Main function that orchestrates the entire process.
 * This is called by the MutationObserver when a relevant page change occurs.
 */
function addGoldIndicatorsToLocksmith() {
    logDebug("Executing main script function for Locksmith page.", DEBUG_INFO);

    // Step 1: Clean up any previous indicators to avoid duplicates on refresh.
    const oldTotalIndicator = document.getElementById('total-gold-indicator');
    if (oldTotalIndicator) {
        oldTotalIndicator.remove();
        logDebug("🗑️ Removed old total gold indicator from previous run.", DEBUG_INFO);
    }
    const oldTotalIndicatorFooter = document.getElementById('total-gold-indicator-footer');
    if (oldTotalIndicatorFooter) {
        oldTotalIndicatorFooter.remove();
        logDebug("🗑️ Removed old footer total gold indicator from previous run.", DEBUG_INFO);
    }
    document.querySelectorAll(`[${PROCESSED_ATTRIBUTE}]`).forEach(el => {
        el.removeAttribute(PROCESSED_ATTRIBUTE);
        const oldIndivIndicator = el.querySelector('.individual-gold-indicator');
        if(oldIndivIndicator) {
            oldIndivIndicator.remove();
        }
        // Remove the highlight class from any old items
        el.style.border = '';
        el.style.boxShadow = '';
        const titleElement = el.querySelector('.item-title strong');
        if (titleElement) {
            titleElement.style.color = '';
        }
    });
    processedItems.clear();
    logDebug("✅ Cleaned up old indicators and reset processed flags.", DEBUG_INFO);

    // Step 2: Find all items that can be opened on the locksmith page.
    const locksmithItems = document.querySelectorAll('.page[data-page="locksmith"] .list-block:not(.searchbar-not-found) .item-content');

    if (locksmithItems.length === 0) {
        logDebug("No locksmith items found in the current view.", DEBUG_INFO);
        return;
    }

    logDebug(`🔍 Found ${locksmithItems.length} potential items to process.`, DEBUG_INFO);

    let totalGold = 0;
    // Step 3: Loop through each item, check for gold, and add an indicator.
    locksmithItems.forEach((item, index) => {
        logDebug(`Processing item at index ${index}.`, DEBUG_ITEM_PROCESSING);
        const itemNameElement = item.querySelector('.item-title strong');

        if (itemNameElement) {
            const itemName = itemNameElement.textContent.trim();
            const cleanName = itemName.replace(/\s*\((\d+,?\d*)\)|\s*(\(\d+,\d+\)|\s*\(\d+\))$/, '').trim();

            logDebug(`🔎 Extracted item name: "${cleanName}"`, DEBUG_ITEM_PROCESSING);

            let quantity = 1;
            const quantityMatch = itemName.match(/\((\d+,?\d*)\)/);
            if (quantityMatch) {
                quantity = parseInt(quantityMatch[1].replace(/,/g, ''), 10);
            }

            logDebug(`🔢 Item quantity detected as: ${quantity}`, DEBUG_ITEM_PROCESSING);

            if (GOLD_ITEMS[cleanName]) {
                const goldAmount = GOLD_ITEMS[cleanName];
                const totalItemGold = goldAmount * quantity;

                logDebug(`✨ Found a match! "${cleanName}" contains ${goldAmount} gold each. Total for this item: ${totalItemGold}.`, DEBUG_ITEM_PROCESSING);

                // Only count for global total if we haven't seen this item before
                if (!processedItems.has(cleanName)) {
                    totalGold += totalItemGold;
                    processedItems.add(cleanName);
                    logDebug(`➕ Adding to total gold. Current total: ${totalGold}.`, DEBUG_INFO);
                } else {
                    logDebug(`⚠️ Item "${cleanName}" already counted for global total. Skipping.`, DEBUG_INFO);
                }

                // Visual enhancements
                item.style.border = '2px solid goldenrod';
                item.style.boxShadow = '0 0 5px goldenrod, inset 0 0 5px goldenrod';
                itemNameElement.style.color = 'goldenrod';

                const goldIndicator = document.createElement('span');
                goldIndicator.classList.add('individual-gold-indicator');
                goldIndicator.innerHTML = ` <span style="font-size: 11px; color: goldenrod;">(${totalItemGold.toLocaleString()}${GOLD_EMOJI})</span>`;
                itemNameElement.appendChild(goldIndicator);

            } else {
                logDebug(`🤷 No gold amount defined for item: "${cleanName}".`, DEBUG_ITEM_PROCESSING);
            }
        } else {
            logDebug(`❌ No 'strong' tag found within item-title for item at index ${index}, skipping.`, DEBUG_ERRORS);
        }

        item.setAttribute(PROCESSED_ATTRIBUTE, 'true');
    });

    // Step 4: Find the specific warning card and add the total gold indicator.
    const warningCardInner = document.querySelector('.page[data-page="locksmith"] .card.searchbar-found .card-content-inner');

    if (totalGold > 0 && warningCardInner) {
        logDebug(`💰 Final calculated total gold is: ${totalGold.toLocaleString()}.`, DEBUG_INFO);

        const totalIndicatorHTML = `<p id="total-gold-indicator" style="text-align: center; font-size: 1.2em; font-weight: bold; margin-bottom: 10px; color: goldenrod;">${GOLD_EMOJI} **Total Gold Available: ${totalGold.toLocaleString()}** ${GOLD_EMOJI}</p>`;
        const totalIndicatorElement = document.createElement('div');
        totalIndicatorElement.innerHTML = totalIndicatorHTML;

        const totalIndicatorElementFooter = document.createElement('div');
        totalIndicatorElementFooter.innerHTML = totalIndicatorHTML;
        totalIndicatorElementFooter.querySelector('#total-gold-indicator').id = 'total-gold-indicator-footer';

        // Insert at the beginning and the end of the warning card content.
        warningCardInner.prepend(totalIndicatorElement);
        warningCardInner.append(totalIndicatorElementFooter);

        logDebug("➕ Added new total gold indicator to the warning card.", DEBUG_INFO);
    } else {
        logDebug("📉 No gold-containing items found, or the warning card container could not be located. Skipping total indicator.", DEBUG_INFO);
    }
}

// Global scope logic for initialization
const target = document.querySelector("#fireworks");
if (target) {
    logDebug("✅ Target element '#fireworks' found.", DEBUG_INFO);
    const observer = new MutationObserver(mutations => {
        logDebug("MutationObserver triggered by a DOM change.", DEBUG_INFO);
        for (const mutation of mutations) {
            if (mutation.attributeName === "data-page") {
                const newPage = target.getAttribute("data-page");
                logDebug(`Page change detected. New page is: '${newPage}'`, DEBUG_INFO);
                if (newPage === "locksmith") {
                    setTimeout(addGoldIndicatorsToLocksmith, 100);
                }
            }
        }
    });

    const config = {
        attributes: true,
        attributeFilter: ['data-page'],
        childList: true,
        subtree: true
    };

    observer.observe(target, config);
    logDebug("Observer attached to '#fireworks' element, listening for 'data-page' changes.", DEBUG_INFO);

    const currentPage = target.getAttribute("data-page");
    logDebug(`Initial page check. Current page is: '${currentPage}'`, DEBUG_INFO);
    if (currentPage === "locksmith") {
        setTimeout(addGoldIndicatorsToLocksmith, 100);
    }
} else {
    logDebug("❌ Target element '#fireworks' not found. Script will not run automatically on page changes.", DEBUG_ERRORS);
}
