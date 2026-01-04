// ==UserScript==
// @name         Torn User Market Trash Hider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Analyze market items using Pareto efficiency and dim dominated items
// @author       PedroXimenez
// @match        *://www.torn.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538262/Torn%20User%20Market%20Trash%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/538262/Torn%20User%20Market%20Trash%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Module-level state variables for polling system
    let currentItemIds = '';
    let pollingInterval = null;
    let isAnalyzing = false; // Prevent overlapping analyses
    let debugMode = false; // Flag to control verbose logging

    /**
     * Generates a deterministic ID based on item properties
     * @param {string} name - Item name
     * @param {string} price - Item price
     * @param {string} damage - Item damage
     * @param {string} accuracy - Item accuracy
     * @returns {string} Deterministic ID string
     */
    function generateDeterministicId(name, price, damage, accuracy) {
        // Create a hash-like string from the item properties
        const combined = `${name || 'unknown'}_${price || 'noprice'}_${damage || 'nodmg'}_${accuracy || 'noacc'}`;
        // Simple hash function to create a shorter, more consistent ID
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return 'item_' + Math.abs(hash).toString(36);
    }

    /**
     * Extracts the first number found in a data-bonus description string
     * @param {string} description - The description string (e.g., "52% increased Heart damage")
     * @returns {number} - The first number found, or 1 if no number is found
     */
    function extractFirstNumber(description) {
        // Use regex to find the first number (including decimals)
        const match = description.match(/\d+(?:\.\d+)?/);

        // Return the first number found, or 1 if no number exists
        return match ? parseFloat(match[0]) : 1;
    }

    /**
     * Extracts all data-bonus attributes from a DOM element and returns an object
     * @param {Element} element - The DOM element to search within
     * @returns {Object} - Object with bonus titles as keys and first numbers as values
     */
    function extractBonuses(element) {
        const bonuses = {};

        // Find all elements with data-bonus-attachment-title attributes
        const bonusElements = element.querySelectorAll('[data-bonus-attachment-title]');

        bonusElements.forEach(bonusElement => {
            const title = bonusElement.getAttribute('data-bonus-attachment-title');
            const description = bonusElement.getAttribute('data-bonus-attachment-description');

            if (title && description) {
                const value = extractFirstNumber(description);
                bonuses[title] = value;
            }
        });

        return bonuses;
    }

    /**
     * Extracts item data from Torn City item list
     * @param {Document} document - DOM document object to parse
     * @returns {Array} Array of item objects with id, name, price, damage, and accuracy
     */
    function extractItemData(document) {
        // Find the item list container using partial class matching
        const itemList = document.querySelector('ul[class*="itemList___"]');

        if (!itemList) {
            console.warn('Item list container not found');
            return [];
        }

        // Get only li elements that contain a child div with itemTile class
        const items = itemList.querySelectorAll('li:has(div[class*="itemTile"])');

        const extractedData = Array.from(items).map(item => {
            // Use the alt text from the image for item name
            const img = item.querySelector('img.torn-item');
            const name = img?.alt;

            // Skip items without a name (likely not actual items)
            if (!name) return null;

            // Extract price from aria-label of buy button
            const buyButton = item.querySelector('button[aria-label*="Buy item"]');
            let price = null;
            if (buyButton) {
                const priceMatch = buyButton.getAttribute('aria-label').match(/\$(\d+)/);
                price = priceMatch ? `$${priceMatch[1]}` : null;
            }

            // Extract property values (damage and accuracy)
            const propertyValues = item.querySelectorAll('[class*="properties"] [class*="property"] [class*="value"]');
            const damage = propertyValues[0]?.textContent?.trim() || null;
            const accuracy = propertyValues[1]?.textContent?.trim() || null;

            // Generate deterministic ID based on item properties
            const deterministicId = generateDeterministicId(name, price, damage, accuracy);

            // Check if the element already has this ID, if not, update it
            const currentId = item.getAttribute('data-item-id');
            if (currentId !== deterministicId) {
                item.setAttribute('data-item-id', deterministicId);
                if (debugMode && currentId) {
                    console.log(`Updated item ID from ${currentId} to ${deterministicId} for ${name}`);
                }
            }

            // Extract bonuses from the item
            const bonuses = extractBonuses(item);

            // Log item ID and bonuses if any bonuses are found
            if (Object.keys(bonuses).length > 0) {
                console.log(`Item ID: ${deterministicId}, Bonuses:`, bonuses);
            }

            return {
                id: deterministicId,
                name: name,
                price: price,
                damage: damage,
                accuracy: accuracy,
                bonuses: bonuses
            };
        }).filter(Boolean); // Remove null entries

        return extractedData;
    }

    /**
     * Extracts only the IDs from current li elements for efficient polling
     * @param {Document} document - DOM document object to parse
     * @returns {Array} Array of item IDs
     */
    function extractCurrentItemIds(document) {
        try {
            // Find the item list container using partial class matching
            const itemList = document.querySelector('ul[class*="itemList___"]');

            if (!itemList) {
                if (debugMode) console.log('Polling: No itemList container found');
                return [];
            }

            // Get only li elements that contain a child div with itemTile class
            const items = itemList.querySelectorAll('li:has(div[class*="itemTile"])');
            if (debugMode) console.log(`Polling: Found ${items.length} li elements with itemTile`);

            const ids = Array.from(items).map(item => {
                // First check if element already has a data-item-id
                let itemId = item.getAttribute('data-item-id');

                if (!itemId) {
                    // Need to extract item properties to generate deterministic ID
                    const img = item.querySelector('img.torn-item');
                    const name = img?.alt;

                    if (!name) return null; // Skip items without names

                    // Extract price from aria-label of buy button
                    const buyButton = item.querySelector('button[aria-label*="Buy item"]');
                    let price = null;
                    if (buyButton) {
                        const priceMatch = buyButton.getAttribute('aria-label').match(/\$(\d+)/);
                        price = priceMatch ? `$${priceMatch[1]}` : null;
                    }

                    // Extract property values (damage and accuracy)
                    const propertyValues = item.querySelectorAll('[class*="properties"] [class*="property"] [class*="value"]');
                    const damage = propertyValues[0]?.textContent?.trim() || null;
                    const accuracy = propertyValues[1]?.textContent?.trim() || null;

                    // Generate deterministic ID and save it
                    itemId = generateDeterministicId(name, price, damage, accuracy);
                    item.setAttribute('data-item-id', itemId);

                    // Extract bonuses from the new item
                    const bonuses = extractBonuses(item);

                    // Log new item with bonuses if any are found
                    if (Object.keys(bonuses).length > 0) {
                        console.log(`🆕 NEW ITEM DETECTED: ${name} (ID: ${itemId}), Bonuses:`, bonuses);
                    } else {
                        console.log(`🆕 NEW ITEM DETECTED: ${name} (ID: ${itemId})`);
                    }
                }

                return itemId;
            }).filter(Boolean); // Remove null entries

            return ids;
        } catch (error) {
            console.warn('Error extracting item IDs for polling:', error.message);
            return [];
        }
    }

    /**
     * Serialize array of IDs to a sorted string for efficient comparison
     * @param {Array} ids - Array of item IDs
     * @returns {string} Comma-separated sorted string of IDs
     */
    function serializeIds(ids) {
        return ids.sort().join(',');
    }

    /**
     * Remove pareto-dominated class from all elements that currently have it
     * @param {Document} document - DOM document object
     */
    function clearAllDimming(document) {
        try {
            const dominatedElements = document.querySelectorAll('.pareto-dominated');
            dominatedElements.forEach(element => {
                element.classList.remove('pareto-dominated');
            });
        } catch (error) {
            console.warn('Error clearing dimming classes:', error.message);
        }
    }

    /**
     * Handle detected changes in item list
     * @param {Document} document - DOM document object
     */
    function handleItemsChanged(document) {
        if (isAnalyzing) {
            if (debugMode) console.log('Already analyzing, skipping...');
            return; // Prevent overlapping analyses
        }

        isAnalyzing = true;

        try {
            console.log('🔄 ITEMS CHANGED DETECTED - Running full analysis...');

            // Clear all existing dimming
            clearAllDimming(document);

            // Run full analysis (this will add IDs to new elements and apply new dimming)
            const result = analyzeAndDimItems(document);

            // Update stored ID string
            if (result && result.items) {
                const newIds = result.items.map(item => item.id);
                const newSerializedIds = serializeIds(newIds);
                if (debugMode) {
                    console.log(`Updated stored IDs from "${currentItemIds}" to "${newSerializedIds}"`);
                } else {
                    console.log(`📊 Analysis complete: ${result.items.length} items processed`);
                }
                currentItemIds = newSerializedIds;
            }
        } catch (error) {
            console.error('Error handling item changes:', error.message);
        } finally {
            isAnalyzing = false;
        }
    }

    /**
     * Poll for changes in item list every second
     * @param {Document} document - DOM document object
     */
    function pollForChanges(document) {
        try {
            // Extract current item IDs (lightweight operation)
            const currentIds = extractCurrentItemIds(document);
            const serializedIds = serializeIds(currentIds);

            // Debug logging (only in debug mode)
            if (debugMode) {
                console.log(`Polling: Found ${currentIds.length} items, serialized: "${serializedIds}"`);
                console.log(`Stored: "${currentItemIds}"`);
            }

            // Check if IDs have changed
            if (serializedIds !== currentItemIds) {
                if (debugMode) console.log('Change detected! Triggering re-analysis...');
                handleItemsChanged(document);
            }
        } catch (error) {
            console.warn('Error during polling:', error.message);
        }
    }

    /**
     * Start the polling system
     * @param {Document} document - DOM document object
     */
    function startPolling(document) {
        // Clear any existing polling interval
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }

        // Start polling every second
        pollingInterval = setInterval(() => {
            pollForChanges(document);
        }, 1000);

        console.log('🚀 Pareto Market Analyzer: Polling started (1 second interval)');
        console.log('💡 Set ParetoMarketAnalyzer.debugMode = true for verbose logging');

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
            }
        });
    }

    /**
     * Parse price string to number (removes $ and converts to float)
     * @param {string} priceStr - Price string like "$46"
     * @returns {number} - Numeric price value
     */
    function parsePrice(priceStr) {
        return parseFloat(priceStr.replace('$', ''));
    }

    /**
     * Get all unique bonus types present in the current market
     * @param {Array} items - Array of item objects
     * @returns {Array} Array of unique bonus type names
     */
    function getActiveBonusTypes(items) {
        const bonusTypes = new Set();

        items.forEach(item => {
            if (item.bonuses && typeof item.bonuses === 'object') {
                Object.keys(item.bonuses).forEach(bonusType => {
                    bonusTypes.add(bonusType);
                });
            }
        });

        return Array.from(bonusTypes).sort(); // Sort for consistent ordering
    }

    /**
     * Check if item A dominates item B
     * A dominates B if A is better or equal in all attributes and strictly better in at least one
     * For our case: lower price is better, higher damage is better, higher accuracy is better, higher bonus values are better
     * @param {Object} itemA - First item
     * @param {Object} itemB - Second item
     * @param {Array} activeBonusTypes - Array of bonus types to consider (optional)
     * @returns {boolean} - True if A dominates B
     */
    function dominates(itemA, itemB, activeBonusTypes = []) {
        const priceA = parsePrice(itemA.price);
        const priceB = parsePrice(itemB.price);
        const damageA = parseFloat(itemA.damage);
        const damageB = parseFloat(itemB.damage);
        const accuracyA = parseFloat(itemA.accuracy);
        const accuracyB = parseFloat(itemB.accuracy);

        // A dominates B if:
        // - A's price <= B's price (cheaper or equal is better)
        // - A's damage >= B's damage (higher or equal is better)
        // - A's accuracy >= B's accuracy (higher or equal is better)
        // - For each bonus type: A's bonus >= B's bonus (higher or equal is better)
        // - At least one comparison is strictly better

        const priceBetter = priceA <= priceB;
        const damageBetter = damageA >= damageB;
        const accuracyBetter = accuracyA >= accuracyB;

        // Check bonus comparisons
        const bonusComparisons = activeBonusTypes.map(bonusType => {
            const bonusA = (itemA.bonuses && itemA.bonuses[bonusType]) || 0;
            const bonusB = (itemB.bonuses && itemB.bonuses[bonusType]) || 0;
            return {
                bonusType,
                bonusA,
                bonusB,
                better: bonusA >= bonusB,
                strictlyBetter: bonusA > bonusB
            };
        });

        // All traditional dimensions must be better or equal
        if (!priceBetter || !damageBetter || !accuracyBetter) {
            return false;
        }

        // All bonus dimensions must be better or equal
        if (!bonusComparisons.every(comp => comp.better)) {
            return false;
        }

        // At least one dimension must be strictly better
        const priceStrictlyBetter = priceA < priceB;
        const damageStrictlyBetter = damageA > damageB;
        const accuracyStrictlyBetter = accuracyA > accuracyB;
        const anyBonusStrictlyBetter = bonusComparisons.some(comp => comp.strictlyBetter);

        return priceStrictlyBetter || damageStrictlyBetter || accuracyStrictlyBetter || anyBonusStrictlyBetter;
    }

    /**
     * Find the Pareto front from a list of items
     * @param {Array} items - Array of item objects
     * @returns {Object} - Object containing paretoFront array and dominatedItems array
     */
    function findParetoFront(items) {
        const paretoFront = [];
        const dominatedItems = [];

        // Get active bonus types for this market
        const activeBonusTypes = getActiveBonusTypes(items);

        for (let i = 0; i < items.length; i++) {
            const currentItem = items[i];
            let isDominated = false;
            let dominatedBy = [];

            // Check if current item is dominated by any other item
            for (let j = 0; j < items.length; j++) {
                if (i !== j && dominates(items[j], currentItem, activeBonusTypes)) {
                    isDominated = true;
                    const dominatorInfo = {
                        id: items[j].id,
                        name: items[j].name,
                        price: items[j].price,
                        damage: items[j].damage,
                        accuracy: items[j].accuracy
                    };

                    // Include bonus information if present
                    if (items[j].bonuses && Object.keys(items[j].bonuses).length > 0) {
                        dominatorInfo.bonuses = items[j].bonuses;
                    }

                    dominatedBy.push(dominatorInfo);
                }
            }

            if (isDominated) {
                dominatedItems.push({
                    ...currentItem,
                    dominatedBy: dominatedBy
                });
            } else {
                paretoFront.push(currentItem);
            }
        }

        return {
            paretoFront: paretoFront,
            dominatedItems: dominatedItems,
            activeBonusTypes: activeBonusTypes,
            summary: {
                totalItems: items.length,
                paretoFrontSize: paretoFront.length,
                dominatedCount: dominatedItems.length,
                activeBonusCount: activeBonusTypes.length
            }
        };
    }

    /**
     * Apply visual dimming to dominated items in the DOM
     * @param {Document} document - DOM document object
     * @param {Set} dominatedIds - Set of IDs for dominated items
     */
    function dimDominatedItems(document, dominatedIds) {
        // Add CSS styles for dimming if not already present
        let styleElement = document.querySelector('#pareto-dimming-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'pareto-dimming-styles';
            styleElement.textContent = `
                .pareto-dominated {
                    opacity: 0.4 !important;
                    filter: grayscale(50%) !important;
                    transition: opacity 0.3s ease, filter 0.3s ease !important;
                }
                .pareto-dominated:hover {
                    opacity: 0.7 !important;
                    filter: grayscale(25%) !important;
                }
            `;
            document.head.appendChild(styleElement);
        }

        // Find all li elements with data-item-id attributes
        const itemElements = document.querySelectorAll('li[data-item-id]');

        itemElements.forEach(element => {
            const itemId = element.getAttribute('data-item-id');
            if (dominatedIds.has(itemId)) {
                element.classList.add('pareto-dominated');
            } else {
                element.classList.remove('pareto-dominated');
            }
        });
    }

    /**
     * Display Pareto analysis results in console
     * @param {Object} analysis - Result from findParetoFront
     */
    function displayParetoAnalysis(analysis) {
        console.log('\n=== PARETO FRONT ANALYSIS ===');
        console.log(`Total items analyzed: ${analysis.summary.totalItems}`);
        console.log(`Items on Pareto front: ${analysis.summary.paretoFrontSize}`);
        console.log(`Dominated items: ${analysis.summary.dominatedCount}`);

        // Show active bonus types if any
        if (analysis.activeBonusTypes && analysis.activeBonusTypes.length > 0) {
            console.log(`Active bonus types: ${analysis.activeBonusTypes.join(', ')} (${analysis.summary.activeBonusCount} total)`);
        } else {
            console.log('No bonus types found in current market');
        }

        console.log('\n--- PARETO FRONT (Non-dominated items) ---');

        // Create table data with bonus columns
        const tableData = analysis.paretoFront.map(item => {
            const row = {
                id: item.id,
                name: item.name,
                price: item.price,
                damage: item.damage,
                accuracy: item.accuracy
            };

            // Add bonus columns if they exist
            if (analysis.activeBonusTypes) {
                analysis.activeBonusTypes.forEach(bonusType => {
                    const bonusValue = (item.bonuses && item.bonuses[bonusType]) || 0;
                    row[bonusType] = bonusValue;
                });
            }

            return row;
        });

        console.table(tableData);

        if (analysis.dominatedItems.length > 0) {
            console.log('\n--- DOMINATED ITEMS (first 10) ---');
            const sampleDominated = analysis.dominatedItems.slice(0, 10);
            sampleDominated.forEach(item => {
                // Build item description with bonuses
                let itemDesc = `${item.name} (${item.id}) - ${item.price}, ${item.damage} dmg, ${item.accuracy} acc`;
                if (item.bonuses && Object.keys(item.bonuses).length > 0) {
                    const bonusDesc = Object.entries(item.bonuses)
                        .map(([type, value]) => `${type}: ${value}`)
                        .join(', ');
                    itemDesc += `, bonuses: {${bonusDesc}}`;
                }

                console.log(`\n${itemDesc}`);
                console.log(`  Dominated by ${item.dominatedBy.length} item(s):`);
                item.dominatedBy.forEach(dominator => {
                    let dominatorDesc = `    - ${dominator.name} (${dominator.id}): ${dominator.price}, ${dominator.damage} dmg, ${dominator.accuracy} acc`;
                    if (dominator.bonuses && Object.keys(dominator.bonuses).length > 0) {
                        const bonusDesc = Object.entries(dominator.bonuses)
                            .map(([type, value]) => `${type}: ${value}`)
                            .join(', ');
                        dominatorDesc += `, bonuses: {${bonusDesc}}`;
                    }
                    console.log(dominatorDesc);
                });
            });

            if (analysis.dominatedItems.length > 10) {
                console.log(`\n... and ${analysis.dominatedItems.length - 10} more dominated items`);
            }
        }
    }

    /**
     * Main analysis function that combines extraction, analysis, and DOM manipulation
     * @param {Document} document - DOM document object
     * @returns {Object} Analysis results and modified DOM state
     */
    function analyzeAndDimItems(document) {
        try {
            // Extract item data
            const items = extractItemData(document);

            if (items.length === 0) {
                console.log('No items found for Pareto analysis');
                return { items: [], paretoAnalysis: null };
            }

            // Perform Pareto analysis
            const paretoAnalysis = findParetoFront(items);
            const dominatedIds = new Set(paretoAnalysis.dominatedItems.map(item => item.id));

            // Apply visual dimming to dominated items in the DOM
            dimDominatedItems(document, dominatedIds);

            // Display results in console
            if (debugMode) {
              displayParetoAnalysis(paretoAnalysis);
            }

            // Update stored ID string for polling system
            const itemIds = items.map(item => item.id);
            currentItemIds = serializeIds(itemIds);
            if (debugMode) {
                console.log(`Initial analysis: Stored ${itemIds.length} IDs: "${currentItemIds}"`);
            } else {
                console.log(`✅ Initial analysis complete: ${itemIds.length} items processed`);
            }

            return {
                items,
                paretoAnalysis,
                dominatedIds
            };
        } catch (error) {
            console.error('Error in Pareto analysis:', error.message);
            return { items: [], paretoAnalysis: null };
        }
    }

    // Auto-run when page loads (for grease monkey)
    function initParetoAnalyzer() {
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    analyzeAndDimItems(document);
                    startPolling(document);
                }, 1000);
            });
        } else {
            setTimeout(() => {
                analyzeAndDimItems(document);
                startPolling(document);
            }, 1000);
        }
    }

    // Export functions for external use
    window.ParetoMarketAnalyzer = {
        extractItemData,
        findParetoFront,
        dimDominatedItems,
        analyzeAndDimItems,
        displayParetoAnalysis,
        parsePrice,
        dominates,
        // Bonus extraction functions
        extractBonuses,
        extractFirstNumber,
        getActiveBonusTypes,
        // Polling system functions
        extractCurrentItemIds,
        serializeIds,
        clearAllDimming,
        startPolling,
        pollForChanges,
        handleItemsChanged,
        // Debug control
        get debugMode() { return debugMode; },
        set debugMode(value) {
            debugMode = value;
            console.log(`Debug mode ${value ? 'enabled' : 'disabled'}`);
        }
    };

    // Initialize the analyzer
    initParetoAnalyzer();

})();