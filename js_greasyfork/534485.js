// ==UserScript==
// @name         Torn Plushies & Flowers Tracker
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  Track plushies and flowers in Torn inventory and calculate missing items
// @author       You
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/preferences.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534485/Torn%20Plushies%20%20Flowers%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/534485/Torn%20Plushies%20%20Flowers%20Tracker.meta.js
// ==/UserScript==
(() => {
    'use strict';
    // Enable debug logging
    const DEBUG = true;
    // Default configuration
    const DEFAULT_CONFIG = {
        apiKey: '',
        useMarketPrices: true,
        cacheDuration: 24,
        lastCacheUpdate: 0
    };
    // Load configuration from GM storage
    const loadConfig = () => {
        try {
            const savedConfig = GM_getValue('plushiesFlowersConfig');
            return savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG;
        }
        catch (e) {
            log('Error loading configuration, using defaults', e);
            return DEFAULT_CONFIG;
        }
    };
    // Save configuration to GM storage
    const saveConfig = (config) => {
        try {
            GM_setValue('plushiesFlowersConfig', JSON.stringify(config));
            log('Configuration saved', config);
        }
        catch (e) {
            log('Error saving configuration', e);
        }
    };
    // Load cached market prices
    const loadCachedPrices = () => {
        try {
            const cachedData = GM_getValue('plushiesFlowersPrices');
            if (!cachedData) {
                log('No cached price data found');
                return {};
            }
            const parsedData = JSON.parse(cachedData);
            log('Loaded cached prices data:', parsedData);
            // Log the structure of the prices object for debugging
            if (parsedData.prices) {
                log(`Cache contains prices for ${Object.keys(parsedData.prices).length} items`);
                log('First few cached prices:', Object.entries(parsedData.prices).slice(0, 5));
            }
            else {
                log('Cache does not contain a valid prices object');
            }
            return parsedData;
        }
        catch (e) {
            log('Error loading cached prices, using empty cache', e);
            return {};
        }
    };
    // Save market prices to cache
    const saveCachedPrices = (prices) => {
        try {
            const cacheData = {
                timestamp: Date.now(),
                prices: prices
            };
            GM_setValue('plushiesFlowersPrices', JSON.stringify(cacheData));
            log('Market prices cached', cacheData);
        }
        catch (e) {
            log('Error caching market prices', e);
        }
    };
    // Check if cache is valid (within cacheDuration)
    const isCacheValid = (config) => {
        try {
            const cachedData = GM_getValue('plushiesFlowersPrices');
            if (!cachedData)
                return false;
            const data = JSON.parse(cachedData);
            const now = Date.now();
            const cacheAge = (now - data.timestamp) / (1000 * 60 * 60); // hours
            return cacheAge < config.cacheDuration;
        }
        catch (e) {
            log('Error checking cache validity', e);
            return false;
        }
    };
    // Clear the price cache
    const clearCache = () => {
        try {
            GM_setValue('plushiesFlowersPrices', '');
            log('Price cache cleared');
        }
        catch (e) {
            log('Error clearing cache', e);
        }
    };
    // Overpay and sale price storage helpers
    const OVERPAY_STORAGE_KEY = 'plushiesFlowersOverpay';
    const SALE_PRICE_KEY_PLUSHIES = 'plushiesSetSalePrice';
    const SALE_PRICE_KEY_FLOWERS = 'flowersSetSalePrice';
    const loadOverpayMap = () => {
        try {
            const raw = GM_getValue(OVERPAY_STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        }
        catch (e) {
            log('Error loading overpay map', e);
            return {};
        }
    };
    const saveOverpayMap = (map) => {
        try {
            GM_setValue(OVERPAY_STORAGE_KEY, JSON.stringify(map));
        }
        catch (e) {
            log('Error saving overpay map', e);
        }
    };
    const loadSalePrice = (key) => {
        try {
            const v = GM_getValue(key);
            return v ? Number(v) : 0;
        }
        catch (_e) {
            return 0;
        }
    };
    const saveSalePrice = (key, value) => {
        try {
            GM_setValue(key, String(value || 0));
        }
        catch (e) {
            log('Error saving sale price', e);
        }
    };
    // Current configuration
    let config = loadConfig();
    // Helper function for logging
    const log = (message, data) => {
        if (DEBUG) {
            if (data) {
                console.log(`[Plushies & Flowers Tracker] ${message}`, data);
            }
            else {
                console.log(`[Plushies & Flowers Tracker] ${message}`);
            }
        }
    };
    log('Script initialized');
    // Configuration - Update these values if the total numbers change
    const TOTAL_PLUSHIES = 13; // Total unique plushies in a complete set
    const TOTAL_FLOWERS = 11; // Total unique flowers in a complete set
    // Plushie names for reference
    const PLUSHIE_NAMES = [
        'Teddy Bear', 'Camel', 'Chamois', 'Jaguar', 'Kitten', 'Lion',
        'Monkey', 'Nessie', 'Panda', 'Red Fox', 'Sheep', 'Stingray', 'Wolverine'
    ];
    // Flower names for reference
    const FLOWER_NAMES = [
        'Dahlia', 'Orchid', 'African Violet', 'Cherry Blossom', 'Peony',
        'Ceibo Flower', 'Edelweiss', 'Crocus', 'Heather', 'Tribulus Omanense', 'Banana Orchid'
    ];
    // Collections to store found items and prices
    const plushiesFound = new Map();
    const flowersFound = new Map();
    const plushiePrices = new Map();
    const flowerPrices = new Map();
    // Item IDs for plushies and flowers (used for both market links and images)
    const PLUSHIE_IDS = {
        'Teddy Bear': 187,
        'Camel': 384,
        'Chamois': 273,
        'Jaguar': 258,
        'Kitten': 215,
        'Lion': 281,
        'Monkey': 269,
        'Nessie': 266,
        'Panda': 274,
        'Red Fox': 268,
        'Sheep': 186,
        'Stingray': 618,
        'Wolverine': 261
    };
    const FLOWER_IDS = {
        'Dahlia': 260,
        'Orchid': 264,
        'African Violet': 282,
        'Cherry Blossom': 277,
        'Peony': 276,
        'Ceibo Flower': 271,
        'Edelweiss': 272,
        'Crocus': 263,
        'Heather': 267,
        'Tribulus Omanense': 385,
        'Banana Orchid': 617
    };
    // Function to create and add the tracker button
    const addTrackerButton = () => {
        // Only run on inventory pages
        if (!window.location.href.includes('item.php'))
            return;
        // Check if our container already exists (to avoid duplicates)
        if (document.getElementById('plushies-flowers-tracker')) {
            log('Tracker already exists, not adding again');
            return;
        }
        // Create a container similar to the weapon ID script
        const container = document.createElement('div');
        container.className = 'tutorial-cont';
        container.id = 'plushies-flowers-tracker';
        const titleContainer = document.createElement('div');
        titleContainer.className = 'title-gray top-round';
        titleContainer.setAttribute('role', 'heading');
        titleContainer.setAttribute('aria-level', '5');
        const title = document.createElement('span');
        title.className = 'tutorial-title';
        title.innerHTML = 'Plushies & Flowers Collection Tracker';
        titleContainer.appendChild(title);
        container.appendChild(titleContainer);
        const description = document.createElement('div');
        description.className = 'tutorial-desc bottom-round cont-gray p10';
        description.innerHTML = `
            <p>Track your plushies and flowers collections to see what you're missing!</p>
            <p>Make sure to scroll down completely on each page to load all items before analyzing.</p>
        `;
        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.display = 'flex';
        buttonWrapper.style.justifyContent = 'space-around';
        buttonWrapper.style.marginTop = '10px';
        const plushiesButton = document.createElement('div');
        plushiesButton.className = 'torn-btn';
        plushiesButton.innerHTML = 'Analyze Plushies';
        plushiesButton.style.width = '150px';
        plushiesButton.style.display = 'flex';
        plushiesButton.style.alignItems = 'center';
        plushiesButton.style.justifyContent = 'center';
        const flowersButton = document.createElement('div');
        flowersButton.className = 'torn-btn';
        flowersButton.innerHTML = 'Analyze Flowers';
        flowersButton.style.width = '150px';
        flowersButton.style.display = 'flex';
        flowersButton.style.alignItems = 'center';
        flowersButton.style.justifyContent = 'center';
        buttonWrapper.appendChild(plushiesButton);
        buttonWrapper.appendChild(flowersButton);
        description.appendChild(buttonWrapper);
        container.appendChild(description);
        const delimiter = document.createElement('hr');
        delimiter.className = 'delimiter-999 m-top10 m-bottom10';
        // Find the last item list in the page to add our container after it
        // This ensures we don't add it multiple times and it's positioned correctly
        const itemLists = document.querySelectorAll('ul.items-cont');
        const lastItemList = itemLists[itemLists.length - 1];
        if (lastItemList && lastItemList.parentElement) {
            // Add some spacing
            const spacer = document.createElement('div');
            spacer.style.height = '20px';
            lastItemList.parentElement.insertAdjacentElement('afterend', spacer);
            spacer.insertAdjacentElement('afterend', container);
        }
        else {
            // Fallback to category-wrap if we can't find item lists
            const categoryWrap = document.getElementById('category-wrap');
            if (categoryWrap) {
                categoryWrap.insertAdjacentElement('afterend', delimiter);
                categoryWrap.insertAdjacentElement('afterend', container);
            }
        }
        // Add click events
        plushiesButton.addEventListener('click', () => analyzePlushies());
        flowersButton.addEventListener('click', () => analyzeFlowers());
    };
    // Function to directly scan the inventory for plushies and flowers
    const scanInventory = () => {
        log('Directly scanning inventory for plushies and flowers');
        // Clear existing collections
        plushiesFound.clear();
        flowersFound.clear();
        log('Cleared existing collections');
    };
    // Function to scan plushies
    const scanPlushies = () => {
        log('Scanning plushies...');
        // Find the plushies list
        const plushiesList = document.getElementById('plushies-items');
        if (!plushiesList) {
            log('Plushies list not found');
            return;
        }
        // Get all list items in the plushies section
        const plushieItems = Array.from(plushiesList.children);
        log(`Found ${plushieItems.length} plushie items`, plushieItems);
        // Process each plushie item
        plushieItems.forEach((item) => {
            processPlushieItem(item);
        });
    };
    // Function to scan flowers
    const scanFlowers = () => {
        log('Scanning flowers...');
        // Find the flowers list
        const flowersList = document.getElementById('flowers-items');
        if (!flowersList) {
            log('Flowers list not found');
            return;
        }
        // Get all list items in the flowers section
        const flowerItems = Array.from(flowersList.children);
        log(`Found ${flowerItems.length} flower items`, flowerItems);
        // Process each flower item
        flowerItems.forEach((item) => {
            processFlowerItem(item);
        });
    };
    // Function to process a plushie item from the inventory
    const processPlushieItem = (item) => {
        var _a;
        try {
            // Extract the name from the item
            const nameElement = item.querySelector('.name');
            if (!nameElement)
                return;
            // Get the name without 'Plushie' suffix
            let name = ((_a = nameElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            name = name.replace(' Plushie', '');
            // Extract the quantity
            const quantityElement = item.querySelector('.qty');
            const quantity = quantityElement ? parseInt(quantityElement.textContent || '0') : 1;
            // Extract the price
            const priceElement = item.querySelector('.price');
            let price = 0;
            if (priceElement) {
                const priceText = priceElement.textContent || '';
                price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
            }
            // Add to collections
            plushiesFound.set(name, quantity);
            plushiePrices.set(name, price);
            log(`Found plushie: ${name}, Quantity: ${quantity}, Price: $${price}`);
        }
        catch (e) {
            log('Error processing plushie item', e);
        }
    };
    // Function to process a flower item from the inventory
    const processFlowerItem = (item) => {
        var _a;
        try {
            // Extract the name from the item
            const nameElement = item.querySelector('.name');
            if (!nameElement)
                return;
            // Get the name without 'Flower' suffix
            let name = ((_a = nameElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            if (!name.startsWith('Ceibo'))
                name = name.replace(' Flower', '');
            // Extract the quantity
            const quantityElement = item.querySelector('.qty');
            const quantity = quantityElement ? parseInt(quantityElement.textContent || '0') : 1;
            // Extract the price
            const priceElement = item.querySelector('.price');
            let price = 0;
            if (priceElement) {
                const priceText = priceElement.textContent || '';
                price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
            }
            // Add to collections
            flowersFound.set(name, quantity);
            flowerPrices.set(name, price);
            log(`Found flower: ${name}, Quantity: ${quantity}, Price: $${price}`);
        }
        catch (e) {
            log('Error processing flower item', e);
        }
    };
    // Function to display a popup with results
    const showResultPopup = (content) => {
        // Remove any existing popup
        const existingPopup = document.getElementById('plushies-flowers-result');
        if (existingPopup) {
            existingPopup.remove();
        }
        // Create the popup container
        const popup = document.createElement('div');
        popup.id = 'plushies-flowers-result';
        popup.style.position = 'fixed';
        popup.style.top = '50px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.width = '800px';
        popup.style.maxWidth = '90%';
        popup.style.maxHeight = '80vh';
        popup.style.backgroundColor = '#1a1a1a';
        popup.style.border = '1px solid #444';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        popup.style.zIndex = '9999';
        popup.style.overflow = 'hidden';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        // Create the header
        const header = document.createElement('div');
        header.style.padding = '10px';
        header.style.backgroundColor = '#333';
        header.style.borderBottom = '1px solid #444';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.cursor = 'move';
        const title = document.createElement('div');
        title.textContent = 'Torn Plushies & Flowers Tracker';
        title.style.fontWeight = 'bold';
        title.style.color = '#ffb502';
        const closeButton = document.createElement('div');
        closeButton.textContent = '×';
        closeButton.style.fontSize = '24px';
        closeButton.style.color = '#fff';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => popup.remove());
        header.appendChild(title);
        header.appendChild(closeButton);
        // Create the content area
        const contentArea = document.createElement('div');
        contentArea.style.padding = '15px';
        contentArea.style.overflowY = 'auto';
        contentArea.style.maxHeight = 'calc(80vh - 50px)';
        contentArea.innerHTML = content;
        popup.appendChild(header);
        popup.appendChild(contentArea);
        // Add to the page
        document.body.appendChild(popup);
        // Make the popup draggable
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - popup.getBoundingClientRect().left;
            offsetY = e.clientY - popup.getBoundingClientRect().top;
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                popup.style.left = (e.clientX - offsetX) + 'px';
                popup.style.top = (e.clientY - offsetY) + 'px';
                popup.style.transform = 'none';
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    };
    // Function to display flowers results
    const displayFlowersResults = () => {
        // Check if we found any flowers
        log(`Found ${flowersFound.size} flowers in inventory`, Array.from(flowersFound.entries()));
        if (flowersFound.size === 0) {
            log('No flowers found, showing error popup');
            showResultPopup('No flowers found in your inventory. Make sure you have clicked the Flowers tab and scrolled through your inventory to load all items.');
            return;
        }
        // Count unique flowers
        const uniqueFlowersCount = flowersFound.size;
        // Calculate total flowers
        let totalFlowersCount = 0;
        flowersFound.forEach(qty => totalFlowersCount += qty);
        // Calculate missing flower types (unique flowers missing)
        const missingFlowerTypes = (uniqueFlowersCount <= TOTAL_FLOWERS) ? TOTAL_FLOWERS - uniqueFlowersCount : 0;
        // Find the flower with the highest quantity to use as target for complete sets
        let maxQuantity = 0;
        flowersFound.forEach(qty => {
            if (qty > maxQuantity)
                maxQuantity = qty;
        });
        // Default target sets is the maximum quantity (can be adjusted by user)
        let targetSets = maxQuantity;
        // Calculate total missing flowers count (how many flowers needed to reach potential maximum)
        let totalMissingFlowers = 0;
        // For each flower, calculate how many are needed to reach the target sets
        FLOWER_NAMES.forEach(name => {
            const quantity = flowersFound.get(name) || 0;
            const missing = targetSets - quantity;
            if (missing > 0) {
                totalMissingFlowers += missing;
            }
        });
        // Prepare missing flowers list
        const missingFlowers = FLOWER_NAMES.filter(name => !flowersFound.has(name));
        // Generate table rows for each flower
        let tableRows = '';
        let totalInvestment = 0; // uses adjusted (overpay) unit prices
        let singleSetValue = 0; // market value of a single set
        let adjustedSingleSetCost = 0; // adjusted cost of a single set
        const overpayMap = loadOverpayMap();
        // First add the flowers the user has
        FLOWER_NAMES.forEach(name => {
            const quantity = flowersFound.get(name) || 0;
            const missing = maxQuantity - quantity;
            const itemId = FLOWER_IDS[name] || 0;
            // Try to get price from API first, then fall back to DOM-extracted price
            let price = 0;
            if (config.useMarketPrices && config.apiKey) {
                price = getMarketPrice(itemId);
            }
            // If no API price, use DOM-extracted price
            if (price === 0) {
                price = flowerPrices.get(name) || 0;
            }
            log(`Price for ${name} Flower (ID: ${FLOWER_IDS[name]}): $${price}`);
            const overpayPct = Number(overpayMap[itemId] || 0);
            const adjustedUnit = Math.round(price * (1 + (overpayPct / 100)));
            const totalPrice = adjustedUnit * missing;
            // Add to total investment if there are missing items
            if (missing > 0 && adjustedUnit > 0) {
                totalInvestment += totalPrice;
            }
            // Add to single set value (one of each flower)
            if (price > 0) {
                singleSetValue += price;
            }
            if (adjustedUnit > 0) {
                adjustedSingleSetCost += adjustedUnit;
            }
            // Create market link
            const marketLink = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${itemId}`;
            // Use the item ID for the image
            const imageId = itemId;
            // Format price with commas
            const formattedPrice = price > 0 ? `$${price.toLocaleString()}` : '-';
            const formattedAdjusted = adjustedUnit > 0 ? `$${adjustedUnit.toLocaleString()}` : '-';
            const formattedTotalPrice = totalPrice > 0 ? `$${totalPrice.toLocaleString()}` : '-';
            tableRows += `
                <tr>
                    <td style="vertical-align: middle; text-align: center;"><img src="https://www.torn.com/images/items/${imageId}/small.png" style="width: 30px; height: 30px; object-fit: contain;" alt="${name} Flower" /></td>
                    <td style="vertical-align: middle; color: #fff;">${name.startsWith('Ceibo') ? name : name + ' Flower'}</td>
                    <td style="vertical-align: middle; text-align: center; color: #fff;">${quantity}</td>
                    <td style="vertical-align: middle; text-align: center; color: #fff;">${missing}</td>
                    <td style="vertical-align: middle; text-align: center; color: #fff;">${overpayPct > 0 ? `${formattedAdjusted}<div style="color:#aaa;font-size:11px;">(${formattedPrice})</div>` : formattedAdjusted}</td>
                    <td style=\"vertical-align: middle; text-align: center; color: #fff;\"><input type=\"number\" class=\"overpay-input\" data-item-id=\"${itemId}\" value=\"${overpayPct}\" min=\"0\" max=\"500\" step=\"1\" style=\"width:70px; padding:3px; background-color:#333; color:#fff; border:1px solid #555;\"/></td>
                    <td style="vertical-align: middle; text-align: center; color: #fff;">${formattedTotalPrice}</td>
                    <td style="vertical-align: middle; text-align: center;">${missing > 0 ? `<a href="${marketLink}" target="_blank" class="t-blue">Buy</a>` : '-'}</td>
                </tr>
            `;
        });
        // Add total row
        if (totalInvestment > 0) {
            tableRows += `
                <tr>
                    <td colspan=\"6\" style=\"vertical-align: middle; text-align: right; color: #ffb502; font-weight: bold;\">Total Investment:</td>
                    <td style="vertical-align: middle; text-align: center; color: #ffb502; font-weight: bold;">$${totalInvestment.toLocaleString()}</td>
                    <td></td>
                </tr>
            `;
        }
        // Add single set value row
        if (singleSetValue > 0) {
            tableRows += `
            <tr>
                <td colspan=\"6\" style=\"vertical-align: middle; text-align: right; color: #ffb502; font-weight: bold;\">Market Value of Single Set:</td>
                <td style="vertical-align: middle; text-align: center; color: #ffb502; font-weight: bold;">$${singleSetValue.toLocaleString()}</td>
                <td></td>
            </tr>
        `;
            tableRows += `
            <tr>
                <td colspan=\"6\" style=\"vertical-align: middle; text-align: right; color: #ffb502; font-weight: bold;\">Adjusted Cost of Single Set:</td>
                <td id=\"flower-single-set-adjusted\" style=\"vertical-align: middle; text-align: center; color: #ffb502; font-weight: bold;\">$${adjustedSingleSetCost.toLocaleString()}</td>
                <td></td>
            </tr>
        `;
        }
        // Calculate how many complete sets can be made
        const completeSets = uniqueFlowersCount < TOTAL_FLOWERS ? 0 : Math.min(...Array.from(flowersFound.values(), v => v || 0).filter(v => v > 0));
        const potentialCompleteSets = maxQuantity;
        // Show results with table
        const resultMessage = `
            <div style="color: #ffb502; font-size: 18px; font-weight: bold; margin-bottom: 10px;">Flowers Collection Progress</div>
            <div style="margin-bottom: 15px; padding: 10px; background-color: #222; border-radius: 5px;">
                <p style="color: #fff; margin-bottom: 5px;">Target number of sets: <input type="number" id="flower-target-sets" value="${targetSets}" min="1" max="${maxQuantity}" style="width: 80px; padding: 5px; background-color: #333; color: #fff; border: 1px solid #555;"> <button id="update-flower-calc" style="padding: 5px 10px; background-color: #ffb502; color: #000; border: none; cursor: pointer;">Update</button></p>
                <p style="color: #aaa; font-size: 12px;">Adjust the target number of sets to calculate how many flowers you need to collect.</p>
                <p style=\"color: #fff; margin: 8px 0 5px;\">Sale price per set: <input type=\"number\" id=\"flower-sale-price\" value=\"${loadSalePrice(SALE_PRICE_KEY_FLOWERS) || ''}\" min=\"0\" style=\"width: 120px; padding: 5px; background-color: #333; color: #fff; border: 1px solid #555;\"> <button id=\"update-flower-sale\" style=\"padding: 5px 10px; background-color: #ffb502; color: #000; border: none; cursor: pointer;\">Update</button> <button id=\"reset-flower-overpay\" style=\"padding: 5px 10px; background-color: #444; color: #fff; border: none; cursor: pointer; margin-left: 8px;\">Reset Overpay</button></p>
                <p style=\"color: #aaa; font-size: 12px;\">Expected Gain: <span id=\"flower-expected-gain\">${loadSalePrice(SALE_PRICE_KEY_FLOWERS) ? `$${(loadSalePrice(SALE_PRICE_KEY_FLOWERS) - adjustedSingleSetCost).toLocaleString()}` : '-'}<\/span> <span id=\"flower-expected-roi\">${loadSalePrice(SALE_PRICE_KEY_FLOWERS) && adjustedSingleSetCost > 0 ? `(${(((loadSalePrice(SALE_PRICE_KEY_FLOWERS) - adjustedSingleSetCost) / adjustedSingleSetCost) * 100).toFixed(2)}%)` : ''}<\/span><span id=\"flower-expected-total\">${loadSalePrice(SALE_PRICE_KEY_FLOWERS) && adjustedSingleSetCost > 0 ? ` per set for a total of $${(((loadSalePrice(SALE_PRICE_KEY_FLOWERS) - adjustedSingleSetCost) * targetSets) || 0).toLocaleString()} for the ${targetSets} sets` : ''}<\/span></p>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px; padding: 15px; background-color: #222; border-radius: 5px;">
                <div style="flex: 1; min-width: 200px; background-color: #333; padding: 12px; border-radius: 5px; border-left: 3px solid #ffb502;">
                    <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Unique Flowers</div>
                    <div style="color: #fff; font-size: 16px; font-weight: bold;">${uniqueFlowersCount}/${TOTAL_FLOWERS}</div>
                </div>
                <div style="flex: 1; min-width: 200px; background-color: #333; padding: 12px; border-radius: 5px; border-left: 3px solid #ffb502;">
                    <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Total Flowers Owned</div>
                    <div style="color: #fff; font-size: 16px; font-weight: bold;">${totalFlowersCount.toLocaleString()}</div>
                </div>
                <div style="flex: 1; min-width: 200px; background-color: #333; padding: 12px; border-radius: 5px; border-left: 3px solid #ffb502;">
                    <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Complete Sets</div>
                    <div style="color: #fff; font-size: 16px; font-weight: bold;">${completeSets} <span style="color: #aaa; font-size: 12px;">(potential: ${potentialCompleteSets})</span></div>
                </div>
                <div style="flex: 1; min-width: 200px; background-color: #333; padding: 12px; border-radius: 5px; border-left: 3px solid #ffb502;">
                    <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Missing Flower Types</div>
                    <div style="color: #fff; font-size: 16px; font-weight: bold;">${missingFlowerTypes}</div>
                </div>
                <div style="flex: 1; min-width: 200px; background-color: #333; padding: 12px; border-radius: 5px; border-left: 3px solid #ffb502;">
                    <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Total Flowers Needed</div>
                    <div style="color: #fff; font-size: 16px; font-weight: bold;">${totalMissingFlowers.toLocaleString()}</div>
                </div>
            </div>

            <div style="height: 100%; overflow: auto; margin-top: 10px;">
                <table class="torn-table" width="100%" style="border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 8px; text-align: center; background-color: #333; color: #ffb502;"></th>
                            <th style="padding: 8px; text-align: left; background-color: #333; color: #ffb502;">Name</th>
                            <th style="padding: 8px; text-align: center; background-color: #333; color: #ffb502;">Owned</th>
                            <th style="padding: 8px; text-align: center; background-color: #333; color: #ffb502;">Missing</th>
                            <th style=\"padding: 8px; text-align: center; background-color: #333; color: #ffb502;\">Unit Price</th>
                            <th style=\"padding: 8px; text-align: center; background-color: #333; color: #ffb502;\">Overpay %</th>
                            <th style=\"padding: 8px; text-align: center; background-color: #333; color: #ffb502;\">Total</th>
                            <th style="padding: 8px; text-align: center; background-color: #333; color: #ffb502;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;
        showResultPopup(resultMessage);
        // Recalc + bindings for flowers
        setTimeout(() => {
            const popup = document.getElementById('plushies-flowers-result');
            const tableBody = popup ? popup.querySelector('.torn-table tbody') : null;
            const targetInput = document.getElementById('flower-target-sets');
            const saleInput = document.getElementById('flower-sale-price');
            const bindOverpayInputs = () => {
                if (!tableBody) return;
                const inputs = tableBody.querySelectorAll('.overpay-input');
                inputs.forEach(inp => {
                    inp.addEventListener('input', (ev) => {
                        const el = ev.target;
                        const id = el.getAttribute('data-item-id');
                        const val = Number(el.value || '0');
                        const m = loadOverpayMap();
                        m[id] = val;
                        saveOverpayMap(m);
                        recalc();
                    });
                });
            };
            const recalc = () => {
                const m = loadOverpayMap();
                const target = targetInput ? Math.max(1, parseInt(targetInput.value || '1', 10)) : targetSets;
                let newRows = '';
                let newTotal = 0;
                let newSSV = 0;
                let newAdjSS = 0;
                let newTotalMissing = 0;
                FLOWER_NAMES.forEach(name => {
                    const qty = flowersFound.get(name) || 0;
                    const id = FLOWER_IDS[name] || 0;
                    let price = 0;
                    if (config.useMarketPrices && config.apiKey) price = getMarketPrice(id);
                    if (price === 0) price = flowerPrices.get(name) || 0;
                    const missing = Math.max(0, target - qty);
                    if (missing > 0) newTotalMissing += missing;
                    const overpct = Number(m[id] || 0);
                    const adjUnit = Math.round(price * (1 + (overpct / 100)));
                    const total = missing * adjUnit;
                    if (missing > 0) newTotal += total;
                    if (price > 0) newSSV += price;
                    if (adjUnit > 0) newAdjSS += adjUnit;
                    const formattedPrice = price > 0 ? `$${price.toLocaleString()}` : '-';
                    const formattedAdjusted = adjUnit > 0 ? `$${adjUnit.toLocaleString()}` : '-';
                    const formattedTotal = total > 0 ? `$${total.toLocaleString()}` : '-';
                    newRows += `
                        <tr>
                            <td style=\"vertical-align: middle; text-align: center;\"><img src=\"https://www.torn.com/images/items/${id}/small.png\" style=\"width: 30px; height: 30px; object-fit: contain;\" alt=\"${name} Flower\" /></td>
                            <td style=\"vertical-align: middle; color: #fff;\">${name.startsWith('Ceibo') ? name : name + ' Flower'}</td>
                            <td style=\"vertical-align: middle; text-align: center; color: #fff;\">${qty}</td>
                            <td style=\"vertical-align: middle; text-align: center; color: #fff;\">${missing}</td>
                            <td style=\"vertical-align: middle; text-align: center; color: #fff;\">${overpct > 0 ? `${formattedAdjusted}<div style=\\"color:#aaa;font-size:11px;\\">(${formattedPrice})</div>` : formattedAdjusted}</td>
                            <td style=\"vertical-align: middle; text-align: center; color: #fff;\"><input type=\"number\" class=\"overpay-input\" data-item-id=\"${id}\" value=\"${overpct}\" min=\"0\" max=\"500\" step=\"1\" style=\"width:70px; padding:3px; background-color:#333; color:#fff; border:1px solid #555;\"/></td>
                            <td style=\"vertical-align: middle; text-align: center; color: #fff;\">${formattedTotal}</td>
                            <td style=\"vertical-align: middle; text-align: center;\">${missing > 0 ? `<a href=\"https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${id}\" target=\"_blank\" class=\"t-blue\">Buy</a>` : '-'}</td>
                        </tr>`;
                });
                if (tableBody) {
                    const footer = `
                        <tr>
                            <td colspan=\"6\" style=\"text-align: right; padding: 10px; color: #ffb502; font-weight: bold;\">Total Investment:</td>
                            <td style=\"text-align: center; padding: 10px; color: #ffb502; font-weight: bold;\">$${newTotal.toLocaleString()}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan=\"6\" style=\"text-align: right; padding: 10px; color: #ffb502; font-weight: bold;\">Market Value of Single Set:</td>
                            <td style=\"text-align: center; padding: 10px; color: #ffb502; font-weight: bold;\">$${newSSV.toLocaleString()}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan=\"6\" style=\"text-align: right; padding: 10px; color: #ffb502; font-weight: bold;\">Adjusted Cost of Single Set:</td>
                            <td id=\"flower-single-set-adjusted\" style=\"text-align: center; padding: 10px; color: #ffb502; font-weight: bold;\">$${newAdjSS.toLocaleString()}</td>
                            <td></td>
                        </tr>`;
                    tableBody.innerHTML = newRows + footer;
                    bindOverpayInputs();
                }
                // Update summary tile for total needed
                const summaryElements = document.querySelectorAll('div[style*="flex: 1"]');
                summaryElements.forEach(element => {
                    const labelElement = element.querySelector('div:first-child');
                    const valueElement = element.querySelector('div:last-child');
                    if (labelElement && valueElement) {
                        const label = labelElement.textContent || '';
                        if (label.includes('Total Flowers Needed')) {
                            valueElement.innerHTML = `${newTotalMissing.toLocaleString()}`;
                        }
                    }
                });
                // Expected gain/ROI
                const gainEl = document.getElementById('flower-expected-gain');
                const roiEl = document.getElementById('flower-expected-roi');
                const totalEl = document.getElementById('flower-expected-total');
                const sale = saleInput ? Number(saleInput.value || '0') : 0;
                if (gainEl && roiEl) {
                    if (sale > 0 && newAdjSS > 0) {
                        const gain = sale - newAdjSS;
                        const roi = (gain / newAdjSS) * 100;
                        gainEl.textContent = `$${gain.toLocaleString()}`;
                        roiEl.textContent = `(${roi.toFixed(2)}%)`;
                        if (totalEl) totalEl.textContent = ` per set for a total of $${(gain * target).toLocaleString()} for the ${target} sets`;
                    } else {
                        gainEl.textContent = '-';
                        roiEl.textContent = '';
                        if (totalEl) totalEl.textContent = '';
                    }
                }
            };
            const updateBtn = document.getElementById('update-flower-calc');
            if (updateBtn) updateBtn.addEventListener('click', recalc);
            if (saleInput) {
                const saleBtn = document.getElementById('update-flower-sale');
                if (saleBtn) saleBtn.addEventListener('click', () => { saveSalePrice(SALE_PRICE_KEY_FLOWERS, Number(saleInput.value || '0')); recalc(); });
                saleInput.addEventListener('input', () => { saveSalePrice(SALE_PRICE_KEY_FLOWERS, Number(saleInput.value || '0')); recalc(); });
            }
            const resetFlowerBtn = document.getElementById('reset-flower-overpay');
            if (resetFlowerBtn) {
                resetFlowerBtn.addEventListener('click', () => {
                    saveOverpayMap({});
                    if (tableBody) tableBody.querySelectorAll('.overpay-input').forEach(inp => inp.value = '0');
                    recalc();
                });
            }
            bindOverpayInputs();
        }, 300);
    };
    // Function to get market price for an item
    const getMarketPrice = (itemId) => {
        try {
            const cachedData = GM_getValue('plushiesFlowersPrices');
            if (!cachedData) {
                log(`No cached price data found for item ${itemId}`);
                return 0;
            }
            const data = JSON.parse(cachedData);
            // Convert itemId to string since API returns string keys
            const itemIdStr = itemId.toString();
            const price = data.prices && data.prices[itemIdStr] ? Number(data.prices[itemIdStr]) : 0;
            if (price > 0) {
                log(`Found cached price for item ${itemId}: $${price}`);
            }
            else {
                log(`No price found in cache for item ${itemId}`);
            }
            return price;
        }
        catch (e) {
            log('Error getting market price', e);
            return 0;
        }
    };
    // Function to fetch market prices from Torn API v2
    const fetchMarketPrices = (callback, forceUpdate = false) => {
        // Combine plushie and flower IDs for the API request
        const itemIds = [];
        // Add plushie IDs
        for (const name in PLUSHIE_IDS) {
            itemIds.push(PLUSHIE_IDS[name]);
        }
        // Add flower IDs
        for (const name in FLOWER_IDS) {
            itemIds.push(FLOWER_IDS[name]);
        }
        log(`Fetching market prices for ${itemIds.length} items...`);
        // Check if we have valid cached data and it's not too old
        const cachedData = loadCachedPrices();
        if (!forceUpdate && isCacheValid(config)) {
            log('Using cached market prices');
            callback(true);
            return;
        }
        // Build the API URL using the more efficient v2 torn/items endpoint
        // This endpoint provides just the item information we need with less data to process
        const apiUrl = `https://api.torn.com/v2/torn/items?ids=${itemIds.join(',')}&key=${config.apiKey}`;
        log(`Fetching item prices from API: ${apiUrl}`);
        // Make the API request
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    // Check for API errors
                    if (data.error) {
                        log('API Error:', data.error);
                        callback(false);
                        return;
                    }
                    // Check if we got a valid response
                    if (!data.items) {
                        log('Invalid API response - no items data:', data);
                        callback(false);
                        return;
                    }
                    // Process the items data
                    const prices = {};
                    // Extract market values for each item
                    for (const itemId in data.items) {
                        const item = data.items[itemId];
                        // The market price is nested inside value.market_price
                        if (item && item.id && item.value && item.value.market_price) {
                            // Ensure we're storing numeric values as numbers
                            const marketValue = Number(item.value.market_price);
                            // Use the actual item ID from the API response
                            const actualItemId = item.id.toString();
                            prices[actualItemId] = marketValue;
                            log(`Fetched market value for item ${actualItemId} (${item.name}): $${marketValue.toLocaleString()}`);
                        }
                        else {
                            log(`No market value found for item ${itemId} in API response`);
                        }
                    }
                    // Log the total number of prices fetched
                    log(`Fetched prices for ${Object.keys(prices).length} items out of ${itemIds.length} requested`);
                    // Debug log the prices object before caching
                    log('Prices object to be cached:', prices);
                    // Cache the prices
                    saveCachedPrices(prices);
                    // Update the config with the last cache update time
                    config.lastCacheUpdate = Date.now();
                    saveConfig(config);
                    // Force a reload of the cached prices to verify they were stored correctly
                    const verifiedCache = loadCachedPrices();
                    log('Verified cached prices after saving:', verifiedCache);
                    callback(true);
                }
                catch (e) {
                    log('Error processing API response', e);
                    callback(false);
                }
            },
            onerror: (error) => {
                log('API request error', error);
                callback(false);
            }
        });
    };
    // Function to analyze plushies
    const analyzePlushies = () => {
        log('Analyzing plushies...');
        // Fetch market prices if needed
        if (config.useMarketPrices && config.apiKey) {
            fetchMarketPrices((success) => {
                if (success) {
                    log('Market prices updated successfully');
                }
                continueAnalyzePlushies();
            });
        }
        else {
            continueAnalyzePlushies();
        }
    };
    // Continue with plushie analysis after price fetch
    const continueAnalyzePlushies = () => {
        // Make sure we're on the plushies tab
        const plushiesTab = document.querySelector('a[data-category="plushies"]');
        if (plushiesTab) {
            // Click the plushies tab to ensure items are loaded
            log('Clicking plushies tab to ensure items are loaded');
            plushiesTab.click();
            // Give a moment for the tab to load
            setTimeout(() => {
                // Scan for plushies directly
                scanPlushies();
                displayPlushiesResults();
            }, 500);
        }
        else {
            // Try to scan anyway
            scanPlushies();
            displayPlushiesResults();
        }
    };
    // Function to display plushies results
    const displayPlushiesResults = () => {
        // Check if we found any plushies
        log(`Found ${plushiesFound.size} plushies in inventory`, Array.from(plushiesFound.entries()));
        if (plushiesFound.size === 0) {
            log('No plushies found, showing error popup');
            showResultPopup('No plushies found in your inventory. Make sure you have clicked the Plushies tab and scrolled through your inventory to load all items.');
            return;
        }
        // Count unique plushies
        const uniquePlushiesCount = plushiesFound.size;
        // Calculate total plushies
        let totalPlushiesCount = 0;
        plushiesFound.forEach(qty => totalPlushiesCount += qty);
        // Calculate missing plushies types (unique plushies missing)
        const missingPlushiesTypes = TOTAL_PLUSHIES - uniquePlushiesCount;
        // Find the plushie with the highest quantity to use as target for complete sets
        let maxQuantity = 0;
        plushiesFound.forEach(qty => {
            if (qty > maxQuantity)
                maxQuantity = qty;
        });
        // Default target sets is the maximum quantity (can be adjusted by user)
        let targetSets = maxQuantity;
        // Calculate total missing plushies count (how many plushies needed to reach potential maximum)
        let totalMissingPlushies = 0;
        // For each plushie, calculate how many are needed to reach the target sets
        PLUSHIE_NAMES.forEach(name => {
            const quantity = plushiesFound.get(name) || 0;
            const missing = targetSets - quantity;
            if (missing > 0) {
                totalMissingPlushies += missing;
            }
        });
        // Prepare missing plushies list
        const missingPlushies = PLUSHIE_NAMES.filter(name => !plushiesFound.has(name));
        // Generate table rows for each plushie
        let tableRows = '';
        let totalInvestment = 0; // adjusted total based on overpay
        let singleSetValue = 0; // market value of a single complete set
        let adjustedSingleSetCost = 0; // adjusted cost of single set with overpay
        const overpayMap = loadOverpayMap();
        // First add the plushies the user has
        PLUSHIE_NAMES.forEach(name => {
            const quantity = plushiesFound.get(name) || 0;
            const missing = maxQuantity - quantity;
            const itemId = PLUSHIE_IDS[name] || 0;
            // Try to get price from API first, then fall back to DOM-extracted price
            let price = 0;
            if (config.useMarketPrices && config.apiKey) {
                price = getMarketPrice(itemId);
            }
            // If no API price, use DOM-extracted price
            if (price === 0) {
                price = plushiePrices.get(name) || 0;
            }
            log(`Price for ${name} Plushie (ID: ${PLUSHIE_IDS[name]}): $${price}`);
            const overpayPct = Number(overpayMap[itemId] || 0);
            const adjustedUnit = Math.round(price * (1 + (overpayPct / 100)));
            const totalPrice = adjustedUnit * missing;
            // Add to total investment if there are missing items
            if (missing > 0 && adjustedUnit > 0) {
                totalInvestment += totalPrice;
            }
            // Add to single set value (one of each plushie)
            if (price > 0) {
                singleSetValue += price;
            }
            if (adjustedUnit > 0) {
                adjustedSingleSetCost += adjustedUnit;
            }
            // Create market link
            const marketLink = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${itemId}`;
            // Use the item ID for the image
            const imageId = itemId;
            // Format price with commas
            const formattedPrice = price > 0 ? `$${price.toLocaleString()}` : '-';
            const formattedAdjusted = adjustedUnit > 0 ? `$${adjustedUnit.toLocaleString()}` : '-';
            const formattedTotalPrice = totalPrice > 0 ? `$${totalPrice.toLocaleString()}` : '-';
            tableRows += `
            <tr>
                <td style="vertical-align: middle; text-align: center;"><img src="https://www.torn.com/images/items/${imageId}/small.png" style="width: 30px; height: 30px; object-fit: contain;" alt="${name} Plushie" /></td>
                <td style="vertical-align: middle; color: #fff;">${name} Plushie</td>
                <td style="vertical-align: middle; text-align: center; color: #fff;">${quantity}</td>
                <td style="vertical-align: middle; text-align: center; color: #fff;">${missing}</td>
                <td style="vertical-align: middle; text-align: center; color: #fff;">${overpayPct > 0 ? `${formattedAdjusted}<div style=\"color:#aaa;font-size:11px;\">(${formattedPrice})</div>` : formattedAdjusted}</td>
                <td style=\"vertical-align: middle; text-align: center; color: #fff;\"><input type=\"number\" class=\"overpay-input\" data-item-id=\"${itemId}\" value=\"${overpayPct}\" min=\"0\" max=\"500\" step=\"1\" style=\"width:70px; padding:3px; background-color:#333; color:#fff; border:1px solid #555;\"/></td>
                <td style="vertical-align: middle; text-align: center; color: #fff;">${formattedTotalPrice}</td>
                <td style="vertical-align: middle; text-align: center;">${missing > 0 ? `<a href="${marketLink}" target="_blank" class="t-blue">Buy</a>` : '-'}</td>
            </tr>
        `;
        });
        // Add total investment row
        if (totalInvestment > 0) {
            tableRows += `
            <tr>
                <td colspan=\"6\" style=\"vertical-align: middle; text-align: right; color: #ffb502; font-weight: bold;\">Total Investment:</td>
                <td style="vertical-align: middle; text-align: center; color: #ffb502; font-weight: bold;">$${totalInvestment.toLocaleString()}</td>
                <td></td>
            </tr>
        `;
        }
        // Add single set value row
        if (singleSetValue > 0) {
            tableRows += `
            <tr>
                <td colspan=\"6\" style=\"vertical-align: middle; text-align: right; color: #ffb502; font-weight: bold;\">Market Value of Single Set:</td>
                <td style="vertical-align: middle; text-align: center; color: #ffb502; font-weight: bold;">$${singleSetValue.toLocaleString()}</td>
                <td></td>
            </tr>
        `;
            tableRows += `
            <tr>
                <td colspan=\"6\" style=\"vertical-align: middle; text-align: right; color: #ffb502; font-weight: bold;\">Adjusted Cost of Single Set:</td>
                <td id=\"plushies-single-set-adjusted\" style=\"vertical-align: middle; text-align: center; color: #ffb502; font-weight: bold;\">$${adjustedSingleSetCost.toLocaleString()}</td>
                <td></td>
            </tr>
        `;
        }
        // Calculate how many complete sets can be made
        // If any plushie is missing (uniquePlushiesCount < TOTAL_PLUSHIES), then no complete sets can be made
        const completeSets = uniquePlushiesCount < TOTAL_PLUSHIES ? 0 : Math.min(...Array.from(plushiesFound.values(), v => v || 0).filter(v => v > 0));
        const potentialCompleteSets = maxQuantity;
        // Show results with table
        const resultMessage = `
        <div style="color: #ffb502; font-size: 18px; font-weight: bold; margin-bottom: 10px;">Plushies Collection Progress</div>
        <div style="margin-bottom: 15px; padding: 10px; background-color: #222; border-radius: 5px;">
            <p style="color: #fff; margin-bottom: 5px;">Target number of sets: <input type="number" id="plushie-target-sets" value="${targetSets}" min="1" max="${maxQuantity}" style="width: 80px; padding: 5px; background-color: #333; color: #fff; border: 1px solid #555;"> <button id="update-plushie-calc" style="padding: 5px 10px; background-color: #ffb502; color: #000; border: none; cursor: pointer;">Update</button></p>
            <p style=\"color: #fff; margin: 8px 0 5px;\">Sale price per set: <input type=\"number\" id=\"plushie-sale-price\" value=\"${loadSalePrice(SALE_PRICE_KEY_PLUSHIES) || ''}\" min=\"0\" style=\"width: 120px; padding: 5px; background-color:#333; color:#fff; border:1px solid #555;\"> <button id=\"update-plushie-sale\" style=\"padding: 5px 10px; background-color:#ffb502; color:#000; border:none; cursor:pointer;\">Update</button> <button id=\"reset-plushie-overpay\" style=\"padding: 5px 10px; background-color: #444; color: #fff; border: none; cursor: pointer; margin-left: 8px;\">Reset Overpay</button></p>
            <p style=\"color: #aaa; font-size: 12px;\">Expected Gain: <span id=\"plushies-expected-gain\">${loadSalePrice(SALE_PRICE_KEY_PLUSHIES) ? `$${(loadSalePrice(SALE_PRICE_KEY_PLUSHIES) - adjustedSingleSetCost).toLocaleString()}` : '-'}<\/span> <span id=\"plushies-expected-roi\">${loadSalePrice(SALE_PRICE_KEY_PLUSHIES) && adjustedSingleSetCost > 0 ? `(${(((loadSalePrice(SALE_PRICE_KEY_PLUSHIES) - adjustedSingleSetCost) / adjustedSingleSetCost) * 100).toFixed(2)}%)` : ''}<\/span><span id=\"plushies-expected-total\">${loadSalePrice(SALE_PRICE_KEY_PLUSHIES) && adjustedSingleSetCost > 0 ? ` per set for a total of $${(((loadSalePrice(SALE_PRICE_KEY_PLUSHIES) - adjustedSingleSetCost) * targetSets) || 0).toLocaleString()} for the ${targetSets} sets` : ''}<\/span></p>
            <p style="color: #aaa; font-size: 12px;">Adjust the target number of sets to calculate how many plushies you need to collect.</p>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px; padding: 15px; background-color: #222; border-radius: 5px;">
            <div style="flex: 1; min-width: 200px; background-color: #333; padding: 12px; border-radius: 5px; border-left: 3px solid #ffb502;">
                <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Unique Plushies</div>
                <div style="color: #fff; font-size: 16px; font-weight: bold;">${uniquePlushiesCount}/${TOTAL_PLUSHIES}</div>
            </div>
            <div style="flex: 1; min-width: 200px; background-color: #333; padding: 12px; border-radius: 5px; border-left: 3px solid #ffb502;">
                <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Total Plushies Owned</div>
                <div style="color: #fff; font-size: 16px; font-weight: bold;">${totalPlushiesCount.toLocaleString()}</div>
            </div>
            <div style="flex: 1; min-width: 200px; background-color: #333; padding: 12px; border-radius: 5px; border-left: 3px solid #ffb502;">
                <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Complete Sets</div>
                <div style="color: #fff; font-size: 16px; font-weight: bold;">${completeSets} <span style="color: #aaa; font-size: 12px;">(potential: ${potentialCompleteSets})</span></div>
            </div>
            <div style="flex: 1; min-width: 200px; background-color: #333; padding: 12px; border-radius: 5px; border-left: 3px solid #ffb502;">
                <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Missing Plushie Types</div>
                <div style="color: #fff; font-size: 16px; font-weight: bold;">${missingPlushiesTypes}</div>
            </div>
            <div style="flex: 1; min-width: 200px; background-color: #333; padding: 12px; border-radius: 5px; border-left: 3px solid #ffb502;">
                <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Total Plushies Needed</div>
                <div style="color: #fff; font-size: 16px; font-weight: bold;">${totalMissingPlushies.toLocaleString()}</div>
            </div>
        </div>

        <div style="height: 100%; overflow: auto; margin-top: 10px;">
            <table class="torn-table" width="100%" style="border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="padding: 8px; text-align: center; background-color: #333; color: #ffb502;"></th>
                        <th style="padding: 8px; text-align: left; background-color: #333; color: #ffb502;">Name</th>
                        <th style="padding: 8px; text-align: center; background-color: #333; color: #ffb502;">Owned</th>
                        <th style="padding: 8px; text-align: center; background-color: #333; color: #ffb502;">Missing</th>
                        <th style=\"padding: 8px; text-align: center; background-color: #333; color: #ffb502;\">Unit Price</th>
                        <th style=\"padding: 8px; text-align: center; background-color: #333; color: #ffb502;\">Overpay %</th>
                        <th style=\"padding: 8px; text-align: center; background-color: #333; color: #ffb502;\">Total</th>
                        <th style="padding: 8px; text-align: center; background-color: #333; color: #ffb502;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>

        <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <button id="export-plushies-data" style="padding: 10px 15px; background-color: #ffb502; color: #000; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; display: flex; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style="margin-right: 8px; fill: currentColor;"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                Export Missing Plushies
            </button>
        </div>
    `;
        showResultPopup(resultMessage);
        // Function to export missing plushies data
        const exportMissingPlushiesData = () => {
            // Create a data object with missing plushies
            const missingPlushiesData = {
                timestamp: new Date().toISOString(),
                targetSets: targetSets,
                totalMissingPlushies: totalMissingPlushies,
                totalInvestment: totalInvestment,
                items: []
            };
            // Add each missing plushie to the data
            PLUSHIE_NAMES.forEach(name => {
                const quantity = plushiesFound.get(name) || 0;
                const itemId = PLUSHIE_IDS[name] || 0;
                const price = getMarketPrice(itemId);
                const missing = Math.max(0, targetSets - quantity);
                if (missing > 0) {
                    missingPlushiesData.items.push({
                        name: `${name} Plushie`,
                        itemId: itemId,
                        missing: missing,
                        unitPrice: price,
                        totalCost: missing * price
                    });
                }
            });
            // Convert to JSON and create a downloadable file
            const dataStr = JSON.stringify(missingPlushiesData, null, 2);
            const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
            // Create a temporary link element and trigger download
            const exportLink = document.createElement('a');
            exportLink.setAttribute('href', dataUri);
            exportLink.setAttribute('download', `torn-plushies-shopping-list-${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(exportLink);
            exportLink.click();
            document.body.removeChild(exportLink);
            // Also copy a simplified version to clipboard for easy sharing
            const clipboardText = missingPlushiesData.items.map(item => `${item.name}: ${item.missing} needed`).join('\n');
            const clipboardHeader = `Torn Plushies Shopping List (${new Date().toLocaleDateString()})\n\n`;
            navigator.clipboard.writeText(clipboardHeader + clipboardText)
                .then(() => {
                alert('Shopping list exported! A JSON file has been downloaded and a text version copied to your clipboard.');
            })
                .catch(err => {
                console.error('Could not copy to clipboard:', err);
                alert('Shopping list exported! A JSON file has been downloaded.');
            });
        };
        // Add event handlers for the buttons
        setTimeout(() => {
            const popup = document.getElementById('plushies-flowers-result');
            const tableBody = popup ? popup.querySelector('.torn-table tbody') : null;
            // Export button event handler
            const exportButton = document.getElementById('export-plushies-data');
            if (exportButton) exportButton.addEventListener('click', exportMissingPlushiesData);
            const targetInput = document.getElementById('plushie-target-sets');
            const saleInput = document.getElementById('plushie-sale-price');
            const bindOverpayInputs = () => {
                if (!tableBody) return;
                tableBody.querySelectorAll('.overpay-input').forEach(inp => {
                    inp.addEventListener('input', (ev) => {
                        const el = ev.target;
                        const id = el.getAttribute('data-item-id');
                        const val = Number(el.value || '0');
                        const m = loadOverpayMap();
                        m[id] = val;
                        saveOverpayMap(m);
                        recalc();
                    });
                });
            };
            const recalc = () => {
                const m = loadOverpayMap();
                const target = targetInput ? Math.max(1, parseInt(targetInput.value || '1', 10)) : maxQuantity;
                let newRows = '';
                let newTotalInvestment = 0;
                let newSingleSetValue = 0;
                let newAdjustedSingle = 0;
                let newTotalMissing = 0;
                PLUSHIE_NAMES.forEach(name => {
                    const quantity = plushiesFound.get(name) || 0;
                    const itemId = PLUSHIE_IDS[name] || 0;
                    let price = 0;
                    if (config.useMarketPrices && config.apiKey) price = getMarketPrice(itemId);
                    if (price === 0) price = plushiePrices.get(name) || 0;
                    const missing = Math.max(0, target - quantity);
                    if (missing > 0) newTotalMissing += missing;
                    const overpct = Number(m[itemId] || 0);
                    const adjUnit = Math.round(price * (1 + (overpct / 100)));
                    const total = missing * adjUnit;
                    if (missing > 0) newTotalInvestment += total;
                    if (price > 0) newSingleSetValue += price;
                    if (adjUnit > 0) newAdjustedSingle += adjUnit;
                    const formattedPrice = price > 0 ? `$${price.toLocaleString()}` : '-';
                    const formattedAdjusted = adjUnit > 0 ? `$${adjUnit.toLocaleString()}` : '-';
                    const formattedTotal = total > 0 ? `$${total.toLocaleString()}` : '-';
                    newRows += `
                        <tr>
                            <td style=\"vertical-align: middle; text-align: center;\"><img src=\"https://www.torn.com/images/items/${itemId}/small.png\" style=\"width: 30px; height: 30px; object-fit: contain;\" alt=\"${name} Plushie\" /></td>
                            <td style=\"vertical-align: middle; color: #fff;\">${name} Plushie</td>
                            <td style=\"vertical-align: middle; text-align: center; color: #fff;\">${quantity}</td>
                            <td style=\"vertical-align: middle; text-align: center; color: #fff;\">${missing}</td>
                            <td style=\"vertical-align: middle; text-align: center; color: #fff;\">${overpct > 0 ? `${formattedAdjusted}<div style=\\"color:#aaa;font-size:11px;\\">(${formattedPrice})</div>` : formattedAdjusted}</td>
                            <td style=\"vertical-align: middle; text-align: center; color: #fff;\"><input type=\"number\" class=\"overpay-input\" data-item-id=\"${itemId}\" value=\"${overpct}\" min=\"0\" max=\"500\" step=\"1\" style=\"width:70px; padding:3px; background-color:#333; color:#fff; border:1px solid #555;\"/></td>
                            <td style=\"vertical-align: middle; text-align: center; color: #fff;\">${formattedTotal}</td>
                            <td style=\"vertical-align: middle; text-align: center;\">${missing > 0 ? `<a href=\"https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${itemId}\" target=\"_blank\" class=\"t-blue\">Buy</a>` : '-'}</td>
                        </tr>`;
                });
                if (tableBody) {
                    const footer = `
                        <tr>
                            <td colspan=\"6\" style=\"text-align: right; padding: 10px; color: #ffb502; font-weight: bold;\">Total Investment:</td>
                            <td style=\"text-align: center; padding: 10px; color: #ffb502; font-weight: bold;\">$${newTotalInvestment.toLocaleString()}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan=\"6\" style=\"text-align: right; padding: 10px; color: #ffb502; font-weight: bold;\">Market Value of Single Set:</td>
                            <td style=\"text-align: center; padding: 10px; color: #ffb502; font-weight: bold;\">$${newSingleSetValue.toLocaleString()}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan=\"6\" style=\"text-align: right; padding: 10px; color: #ffb502; font-weight: bold;\">Adjusted Cost of Single Set:</td>
                            <td id=\"plushies-single-set-adjusted\" style=\"text-align: center; padding: 10px; color: #ffb502; font-weight: bold;\">$${newAdjustedSingle.toLocaleString()}</td>
                            <td></td>
                        </tr>`;
                    tableBody.innerHTML = newRows + footer;
                    bindOverpayInputs();
                }
                // Update summary tile for total needed
                const summaryElements = document.querySelectorAll('div[style*="flex: 1"]');
                summaryElements.forEach(element => {
                    const labelElement = element.querySelector('div:first-child');
                    const valueElement = element.querySelector('div:last-child');
                    if (labelElement && valueElement) {
                        const label = labelElement.textContent || '';
                        if (label.includes('Total Plushies Needed')) {
                            valueElement.innerHTML = `${newTotalMissing.toLocaleString()}`;
                        }
                    }
                });
                // Update expected gain/ROI
                const gainEl = document.getElementById('plushies-expected-gain');
                const roiEl = document.getElementById('plushies-expected-roi');
                const totalEl = document.getElementById('plushies-expected-total');
                const sale = saleInput ? Number(saleInput.value || '0') : 0;
                if (gainEl && roiEl) {
                    if (sale > 0 && newAdjustedSingle > 0) {
                        const gain = sale - newAdjustedSingle;
                        const roi = (gain / newAdjustedSingle) * 100;
                        gainEl.textContent = `$${gain.toLocaleString()}`;
                        roiEl.textContent = `(${roi.toFixed(2)}%)`;
                        if (totalEl) totalEl.textContent = ` per set for a total of $${(gain * target).toLocaleString()} for the ${target} sets`;
                    } else {
                        gainEl.textContent = '-';
                        roiEl.textContent = '';
                        if (totalEl) totalEl.textContent = '';
                    }
                }
            };
            const updateButton = document.getElementById('update-plushie-calc');
            if (updateButton) updateButton.addEventListener('click', recalc);
            if (saleInput) {
                const saleBtn = document.getElementById('update-plushie-sale');
                if (saleBtn) saleBtn.addEventListener('click', () => { saveSalePrice(SALE_PRICE_KEY_PLUSHIES, Number(saleInput.value || '0')); recalc(); });
                saleInput.addEventListener('input', () => { saveSalePrice(SALE_PRICE_KEY_PLUSHIES, Number(saleInput.value || '0')); recalc(); });
            }
            const resetPlushBtn = document.getElementById('reset-plushie-overpay');
            if (resetPlushBtn) {
                resetPlushBtn.addEventListener('click', () => {
                    saveOverpayMap({});
                    if (tableBody) tableBody.querySelectorAll('.overpay-input').forEach(inp => inp.value = '0');
                    recalc();
                });
            }
            bindOverpayInputs();
        }, 500);
    };
    // Function to analyze flowers
    const analyzeFlowers = () => {
        log('Analyzing flowers...');
        // Fetch market prices if needed
        if (config.useMarketPrices && config.apiKey) {
            fetchMarketPrices((success) => {
                if (success) {
                    log('Market prices updated successfully');
                }
                continueAnalyzeFlowers();
            });
        }
        else {
            continueAnalyzeFlowers();
        }
    };
    // Continue with flower analysis after price fetch
    const continueAnalyzeFlowers = () => {
        // Make sure we're on the flowers tab
        const flowersTab = document.querySelector('a[data-category="flowers"]');
        if (flowersTab) {
            // Click the flowers tab to ensure items are loaded
            log('Clicking flowers tab to ensure items are loaded');
            flowersTab.click();
            // Give a moment for the tab to load
            setTimeout(() => {
                // Scan for flowers directly
                scanFlowers();
                displayFlowersResults();
            }, 500);
        }
        else {
            // Try to scan anyway
            scanFlowers();
            displayFlowersResults();
        }
    };
    // Function to create the configuration UI
    const createConfigUI = () => {
        log('Creating configuration UI');
        // Check if our settings panel already exists to prevent duplicates
        if (document.getElementById('plushies-flowers-settings')) {
            log('Settings panel already exists, not creating another one');
            return;
        }
        // Find the preferences container
        const prefsContainer = document.querySelector('.preferences-container');
        if (!prefsContainer) {
            log('Preferences container not found');
            return;
        }
        // Create our config container
        const configContainer = document.createElement('div');
        configContainer.className = 'preferences-container-wrap';
        configContainer.id = 'plushies-flowers-settings';
        // Create the title
        const titleDiv = document.createElement('div');
        titleDiv.className = 'title-black top-round';
        titleDiv.textContent = 'Plushies & Flowers Tracker Settings';
        configContainer.appendChild(titleDiv);
        // Create the content container
        const content = document.createElement('div');
        content.className = 'cont-gray bottom-round';
        content.style.padding = '10px';
        // Create the API key input
        const apiKeyLabel = document.createElement('label');
        apiKeyLabel.textContent = 'Torn API Key (requires v2 access):';
        apiKeyLabel.style.display = 'block';
        apiKeyLabel.style.marginBottom = '5px';
        content.appendChild(apiKeyLabel);
        const apiKeyContainer = document.createElement('div');
        apiKeyContainer.style.display = 'flex';
        apiKeyContainer.style.marginBottom = '15px';
        apiKeyContainer.style.alignItems = 'center';
        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'password';
        apiKeyInput.value = config.apiKey;
        apiKeyInput.style.flex = '1';
        apiKeyInput.style.marginRight = '10px';
        apiKeyInput.style.padding = '5px';
        apiKeyContainer.appendChild(apiKeyInput);
        const showApiKeyButton = document.createElement('button');
        showApiKeyButton.className = 'torn-btn';
        showApiKeyButton.textContent = 'Show API Key';
        showApiKeyButton.addEventListener('click', () => {
            if (apiKeyInput.type === 'password') {
                apiKeyInput.type = 'text';
                showApiKeyButton.textContent = 'Hide API Key';
            }
            else {
                apiKeyInput.type = 'password';
                showApiKeyButton.textContent = 'Show API Key';
            }
        });
        apiKeyContainer.appendChild(showApiKeyButton);
        content.appendChild(apiKeyContainer);
        // Create the use market prices checkbox
        const useMarketContainer = document.createElement('div');
        useMarketContainer.style.marginBottom = '15px';
        const useMarketCheck = document.createElement('input');
        useMarketCheck.type = 'checkbox';
        useMarketCheck.id = 'use-market-prices';
        useMarketCheck.checked = config.useMarketPrices;
        useMarketContainer.appendChild(useMarketCheck);
        const useMarketLabel = document.createElement('label');
        useMarketLabel.htmlFor = 'use-market-prices';
        useMarketLabel.textContent = ' Use market prices from Torn API';
        useMarketLabel.style.marginLeft = '5px';
        useMarketContainer.appendChild(useMarketLabel);
        content.appendChild(useMarketContainer);
        // Create the cache duration input
        const cacheContainer = document.createElement('div');
        cacheContainer.style.marginBottom = '15px';
        const cacheLabel = document.createElement('label');
        cacheLabel.textContent = 'Cache duration (hours): ';
        cacheContainer.appendChild(cacheLabel);
        const cacheInput = document.createElement('input');
        cacheInput.type = 'number';
        cacheInput.min = '1';
        cacheInput.max = '72';
        cacheInput.value = config.cacheDuration.toString();
        cacheInput.style.width = '60px';
        cacheInput.style.marginLeft = '5px';
        cacheContainer.appendChild(cacheInput);
        content.appendChild(cacheContainer);
        const lastUpdateDiv = document.createElement('div');
        lastUpdateDiv.style.marginBottom = '15px';
        let lastUpdateText = 'Cache status: ';
        try {
            const cachedData = GM_getValue('plushiesFlowersPrices');
            if (cachedData) {
                const data = JSON.parse(cachedData);
                const date = new Date(data.timestamp);
                lastUpdateText += `Last updated on ${date.toLocaleString()}`;
            }
            else {
                lastUpdateText += 'No cached data';
            }
        }
        catch (e) {
            lastUpdateText += 'Error reading cache';
        }
        lastUpdateDiv.textContent = lastUpdateText;
        content.appendChild(lastUpdateDiv);
        // Buttons row
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.gap = '10px';
        buttonsDiv.style.flexWrap = 'wrap';
        // Save button
        const saveButton = document.createElement('button');
        saveButton.className = 'torn-btn';
        saveButton.textContent = 'Save Settings';
        saveButton.addEventListener('click', () => {
            config.apiKey = apiKeyInput.value.trim();
            config.useMarketPrices = useMarketCheck.checked;
            config.cacheDuration = parseInt(cacheInput.value) || 24;
            saveConfig(config);
            alert('Settings saved!');
        });
        buttonsDiv.appendChild(saveButton);
        // Clear cache button
        const clearButton = document.createElement('button');
        clearButton.className = 'torn-btn';
        clearButton.textContent = 'Clear Price Cache';
        clearButton.addEventListener('click', () => {
            clearCache();
            alert('Price cache cleared!');
            // Update the last update text
            lastUpdateDiv.textContent = 'Cache status: No cached data (cleared)';
        });
        buttonsDiv.appendChild(clearButton);
        // Update prices button
        const updateButton = document.createElement('button');
        updateButton.className = 'torn-btn';
        updateButton.textContent = 'Update Prices Now';
        updateButton.addEventListener('click', () => {
            // Check if API key is set
            if (!apiKeyInput.value.trim()) {
                alert('Please enter an API key first!');
                return;
            }
            // Disable button during update
            updateButton.disabled = true;
            updateButton.textContent = 'Updating...';
            // Save current settings first
            config.apiKey = apiKeyInput.value.trim();
            config.useMarketPrices = useMarketCheck.checked;
            config.cacheDuration = parseInt(cacheInput.value) || 24;
            saveConfig(config);
            // Clear existing cache first
            log('Clearing existing price cache before update');
            GM_setValue('plushiesFlowersPrices', '');
            // Force fetch new prices with forceUpdate=true
            fetchMarketPrices((success) => {
                updateButton.disabled = false;
                updateButton.textContent = 'Update Prices Now';
                if (success) {
                    // Verify the cache was updated properly
                    const cachedData = GM_getValue('plushiesFlowersPrices');
                    if (cachedData) {
                        try {
                            const parsedData = JSON.parse(cachedData);
                            const priceCount = parsedData.prices ? Object.keys(parsedData.prices).length : 0;
                            log(`Cache verification: Found ${priceCount} prices in cache`);
                            alert(`Market prices updated successfully! Cached ${priceCount} item prices.`);
                        }
                        catch (e) {
                            log('Error verifying cache after update', e);
                            alert('Market prices updated but there may be an issue with the cache.');
                        }
                    }
                    else {
                        log('No cache data found after update');
                        alert('Market prices update failed - no cache data found.');
                    }
                    // Update the last update text
                    try {
                        const cachedData = GM_getValue('plushiesFlowersPrices');
                        if (cachedData) {
                            const data = JSON.parse(cachedData);
                            const date = new Date(data.timestamp);
                            lastUpdateDiv.textContent = `Cache status: Last updated on ${date.toLocaleString()}`;
                        }
                    }
                    catch (e) {
                        log('Error updating cache status text', e);
                    }
                }
                else {
                    alert('Failed to update market prices. Make sure your API key has access to the market endpoint in API v2.');
                }
            }, true); // Force update
        });
        buttonsDiv.appendChild(updateButton);
        content.appendChild(buttonsDiv);
        configContainer.appendChild(content);
        // Add our config section to the page
        prefsContainer.appendChild(configContainer);
    };
    // Initialize the script
    const init = () => {
        log('Initializing script...');
        // Check if we're on the preferences page
        if (window.location.href.includes('preferences.php')) {
            createConfigUI();
            return;
        }
        // We're on the item page, add the tracker button
        addTrackerButton();
        log('Tracker button added');
        // Add event listeners to the inventory tabs to ensure we can detect when tabs are changed
        const plushiesTab = document.querySelector('a[data-category="plushies"]');
        const flowersTab = document.querySelector('a[data-category="flowers"]');
        if (plushiesTab) {
            plushiesTab.addEventListener('click', () => {
                log('Plushies tab clicked');
                setTimeout(scanPlushies, 500);
            });
        }
        if (flowersTab) {
            flowersTab.addEventListener('click', () => {
                log('Flowers tab clicked');
                setTimeout(scanFlowers, 500);
            });
        }
        // Initial scan of inventory
        setTimeout(() => {
            log('Performing initial inventory scan...');
            scanInventory();
        }, 1000);
    };
    // Run the script when the page is fully loaded
    window.addEventListener('load', init);
    // Also run when DOM content is loaded (as a backup)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    }
    else {
        log('Document already loaded, initializing immediately');
        init();
    }
})();