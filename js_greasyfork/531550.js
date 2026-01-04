// ==UserScript==
// @name         Grubhub Sorter & Filter v1.9.2 (License, UI Colors)
// @namespace    http://tampermonkey.net/
// @version      1.9.2
// @description  Sorts/filters restaurants, adds De-duplication & Tie-breaking. UI starts closed. Darker UI BG.
// @author       cdmichaelb
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/
// @match        *://*.grubhub.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531550/Grubhub%20Sorter%20%20Filter%20v192%20%28License%2C%20UI%20Colors%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531550/Grubhub%20Sorter%20%20Filter%20v192%20%28License%2C%20UI%20Colors%29.meta.js
// ==/UserScript==

/*
License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
You are free to:
    Share — copy and redistribute the material in any medium or format
    Adapt — remix, transform, and build upon the material
Under the following terms:
    Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
    NonCommercial — You may not use the material for commercial purposes.
    ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
Full license text: https://creativecommons.org/licenses/by-nc-sa/4.0/
*/

(function() {
    'use strict';
    console.info("GH Sorter v1.9.2: Script executing.");

    // --- Configuration / State ---
    let config = {
        maxDistance: GM_getValue('grubhub_maxDistance', 3.0),
        prioritizeOffers: GM_getValue('grubhub_prioritizeOffers', false),
        prioritizeFavorites: GM_getValue('grubhub_prioritizeFavorites', false),
        scriptEnabled: GM_getValue('grubhub_scriptEnabled', true),
        uiVisible: GM_getValue('grubhub_uiVisible', false) // Default to false
    };

    // --- Constants ---
    const RESTAURANT_CARD_SELECTOR = 'span[data-testid="restaurant-card"]';
    const CAROUSEL_SLIDE_SELECTOR = 'div[data-testid="carousel-slide"]';
    const GRID_CELL_SELECTOR = 'div[data-testid="grid-component-cell-wrapper"]';
    const ITEM_SELECTOR_STRING = `${CAROUSEL_SLIDE_SELECTOR}, ${GRID_CELL_SELECTOR}`; // Combined item selector

    let LIST_CONTAINER_SELECTORS_STRING = [
        'span[data-testid="carousel-scroll-wrapper"]', // Carousel container
        'div[data-testid="topic-grid-component"] > div.featured-topic > div.s-row', // Grid container
        // Fallbacks
        'div[role="list"]:has(> div[data-testid="search-result-card"])',
        'div[role="list"]',
        'div[data-testid="restaurant-feed"] > div > div[role="list"]',
        '[data-testid="search-result-container"]'
    ].join(', ');

    const DISTANCE_SELECTOR = 'span[data-testid="ghs-restaurant-time-estimate"]';
    const RESTAURANT_NAME_LINK_SELECTOR = 'a[data-testid="restaurant-name"]';
    const OFFER_BADGE_SELECTOR = '[data-testid*="offer"], [data-testid*="BogoHeaderText"], [data-component="Badges"] > span, div[data-testid="restaurant-offer"]';
    const FAVORITE_BUTTON_SELECTOR = 'button[data-testid="favorite-icon"]';
    const FAVORITED_INDICATOR_TITLE = 'saved restaurant';

    const UI_CONTAINER_ID = 'gh-sorter-ui-container';
    const UI_TOGGLE_ID = 'gh-sorter-ui-toggle';
    const STATUS_MESSAGE_ID = 'gh-sorter-status-message';
    const COLOR_DISTANCE_CLASS = 'gh-sorter-colored-distance';
    const MIN_COLOR_DIST = 0.1;
    const MAX_COLOR_DIST = 5.0;
    const MIN_ITEMS_FOR_INIT = 1;

    let sortRunId = 0;
    let debounceTimer = null;
    let observer = null;
    let initialCheckInterval = null;
    let uiContainer = null;
    let statusTimeout = null;
    let initialCheckRetries = 0;
    const MAX_INITIAL_CHECK_RETRIES = 40;
    let hasInitialized = false;

    // --- Styling ---
    try {
        GM_addStyle(`
            /* Dark UI Background & Light Text */
            body #${UI_CONTAINER_ID} {
                background-color: #2D2E2E !important; /* Dark Gray */
                color: #EAEAEA !important; /* Light Gray Text */
                border: 1px solid #555 !important; /* Darker border */
            }
            #${UI_CONTAINER_ID} {
                position: fixed; bottom: 10px; right: 10px; padding: 15px; border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.4); z-index: 9999;
                font-family: sans-serif; font-size: 14px;
                display: ${config.uiVisible ? 'block' : 'none'}; width: 260px;
            }
            /* Adjust Title and Close Button for Dark BG */
            #${UI_CONTAINER_ID} h4 {
                color: #FFFFFF !important; /* White Title */
                margin: 0 0 10px 0; font-size: 16px;
                border-bottom: 1px solid #555 !important; /* Darker separator */
                padding-bottom: 5px;
            }
             #${UI_CONTAINER_ID} label {
                 color: #EAEAEA !important; /* Ensure labels are light */
                 display: block; margin-bottom: 8px;
             }
             #${UI_CONTAINER_ID} .gh-sorter-ui-close {
                 color: #BBB !important; /* Lighter close button */
                 position: absolute; top: 5px; right: 10px; background: none; border: none;
                 font-size: 18px; cursor: pointer;
             }
             #${UI_CONTAINER_ID} .gh-sorter-ui-close:hover { color: #FFFFFF !important; } /* White on hover */
             /* Input text color might need adjustment if browser defaults are dark */
             #${UI_CONTAINER_ID} input[type="number"] {
                color: #333; /* Keep input text dark for contrast on its white background */
                background-color: #FFF; /* Ensure input BG is white */
                width: 50px; margin-left: 5px; margin-right: 5px; padding: 3px;
                border: 1px solid #ccc; border-radius: 4px;
             }
             /* Adjust checkbox appearance if needed (often browser-specific) */
             #${UI_CONTAINER_ID} input[type="checkbox"] {
                 margin-right: 5px; vertical-align: middle;
                 filter: invert(1) hue-rotate(180deg); /* Basic invert to make it visible on dark */
             }

             /* Other Styles */
            #${UI_TOGGLE_ID} {
                display: ${config.uiVisible ? 'none' : 'flex'}; /* Show if panel hidden */
                position: fixed; bottom: 10px; right: 10px; width: 40px; height: 40px;
                background-color: #00a082; color: white; border: none; border-radius: 50%;
                font-size: 20px; line-height: 40px; text-align: center; cursor: pointer;
                box-shadow: 0 1px 5px rgba(0,0,0,0.3); z-index: 9998;
                align-items: center; justify-content: center;
            }
            #${UI_TOGGLE_ID} svg { width: 20px; height: 20px; fill: currentColor; }
            #${STATUS_MESSAGE_ID} {
                position: fixed; bottom: 60px; right: 10px;
                background-color: rgba(0, 0, 0, 0.8); color: white; padding: 8px 15px;
                border-radius: 4px; font-size: 13px; z-index: 10000; opacity: 0;
                transition: opacity 0.5s ease-in-out; pointer-events: none;
            }
            #${STATUS_MESSAGE_ID}.visible { opacity: 1; }
            .${COLOR_DISTANCE_CLASS} { font-weight: bold; padding: 0 2px; border-radius: 3px; }
            .gh-sorter-hidden { display: none !important; }
            /* Button colors remain the same */
            #${UI_CONTAINER_ID} .gh-sorter-button { background-color: #00a082; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; margin-top: 5px; margin-right: 5px; }
            #${UI_CONTAINER_ID} .gh-sorter-button:hover { background-color: #007a63; }
            #${UI_CONTAINER_ID} .gh-sorter-debug-button { background-color: #f0ad4e; }
            #${UI_CONTAINER_ID} .gh-sorter-debug-button:hover { background-color: #ec971f; }
        `);
        console.info("GH Sorter: Styles applied.");
    } catch (e) { console.error("GH Sorter: Error applying styles.", e); }

    // --- UI Functions ---
    // Added explicit null check for appendChild target
    function showStatusMessage(message, duration = 3000) { try { let statusDiv = document.getElementById(STATUS_MESSAGE_ID); const parent = (document.body || document.documentElement); if (!parent) return; if (!statusDiv) { statusDiv = document.createElement('div'); statusDiv.id = STATUS_MESSAGE_ID; parent.appendChild(statusDiv); } statusDiv.textContent = message; statusDiv.classList.add('visible'); clearTimeout(statusTimeout); statusTimeout = setTimeout(() => { statusDiv.classList.remove('visible'); }, duration); } catch(e) { console.error("GH Sorter: Error in showStatusMessage", e); } }

    // Added explicit null check for appendChild target
    function createSettingsUI() {
        try {
            if (document.getElementById(UI_CONTAINER_ID)) return;
            const parent = (document.body || document.documentElement);
            if (!parent) { console.error("GH Sorter: Cannot find body/documentElement to append UI."); return; }
            console.info("GH Sorter: Creating Settings UI.");

            uiContainer = document.createElement('div'); uiContainer.id = UI_CONTAINER_ID;
            // Set initial display based on config BEFORE appending
            uiContainer.style.display = config.uiVisible ? 'block' : 'none';
            uiContainer.innerHTML = `<button id="gh-sorter-ui-closer" class="gh-sorter-ui-close" title="Close Settings">×</button><h4>Grubhub Sorter</h4>`;

            // Standard Controls...
             const enabledLabel = document.createElement('label'); const enabledCheckbox = document.createElement('input'); enabledCheckbox.type = 'checkbox'; enabledCheckbox.checked = config.scriptEnabled; enabledCheckbox.addEventListener('change', () => { config.scriptEnabled = enabledCheckbox.checked; GM_setValue('grubhub_scriptEnabled', config.scriptEnabled); showStatusMessage(`Sorter ${config.scriptEnabled ? 'Enabled' : 'Disabled'}`); if (!config.scriptEnabled) { resetAllCardStyles(); } else if(hasInitialized) { sortAndFilterRestaurants(); }}); enabledLabel.appendChild(enabledCheckbox); enabledLabel.appendChild(document.createTextNode(' Enable Sorting/Filtering')); uiContainer.appendChild(enabledLabel);
             const distanceLabel = document.createElement('label'); const distanceInput = document.createElement('input'); distanceInput.type = 'number'; distanceInput.value = config.maxDistance; distanceInput.min = '0'; distanceInput.step = '0.1'; distanceInput.addEventListener('change', () => { const newMax = parseFloat(distanceInput.value); if (!isNaN(newMax) && newMax >= 0) { config.maxDistance = newMax; GM_setValue('grubhub_maxDistance', config.maxDistance); showStatusMessage(`Max distance set to ${config.maxDistance} mi`); if(hasInitialized) sortAndFilterRestaurants(); } else { showStatusMessage('Invalid distance value.', 4000); distanceInput.value = config.maxDistance; } }); distanceLabel.appendChild(document.createTextNode('Max Distance:')); distanceLabel.appendChild(distanceInput); distanceLabel.appendChild(document.createTextNode(' mi')); uiContainer.appendChild(distanceLabel);
             const offersLabel = document.createElement('label'); const offersCheckbox = document.createElement('input'); offersCheckbox.type = 'checkbox'; offersCheckbox.checked = config.prioritizeOffers; offersCheckbox.addEventListener('change', () => { config.prioritizeOffers = offersCheckbox.checked; GM_setValue('grubhub_prioritizeOffers', config.prioritizeOffers); showStatusMessage(`Prioritize Offers: ${config.prioritizeOffers ? 'ON' : 'OFF'}`); if(hasInitialized) sortAndFilterRestaurants(); }); offersLabel.appendChild(offersCheckbox); offersLabel.appendChild(document.createTextNode(' Prioritize Offers')); uiContainer.appendChild(offersLabel);
             const favsLabel = document.createElement('label'); const favsCheckbox = document.createElement('input'); favsCheckbox.type = 'checkbox'; favsCheckbox.checked = config.prioritizeFavorites; favsCheckbox.addEventListener('change', () => { config.prioritizeFavorites = favsCheckbox.checked; GM_setValue('grubhub_prioritizeFavorites', config.prioritizeFavorites); showStatusMessage(`Prioritize Favorites: ${config.prioritizeFavorites ? 'ON' : 'OFF'}`); if(hasInitialized) sortAndFilterRestaurants(); }); favsLabel.appendChild(favsCheckbox); favsLabel.appendChild(document.createTextNode(' Prioritize Favorites')); uiContainer.appendChild(favsLabel);

            const buttonContainer = document.createElement('div');
            const refreshButton = document.createElement('button'); refreshButton.textContent = 'Refresh Sorting'; refreshButton.className = 'gh-sorter-button'; refreshButton.addEventListener('click', () => { if (!hasInitialized) { showStatusMessage("Sorter not ready. Run 'Check Selectors' maybe?", 4000); return; } console.info("GH Sorter: Manual refresh triggered via UI button."); showStatusMessage('Refreshing sorting...'); sortAndFilterRestaurants(true); }); buttonContainer.appendChild(refreshButton);
            const debugButton = document.createElement('button'); debugButton.textContent = 'Check Selectors'; debugButton.title = 'Run current selectors and log results to console (F12)'; debugButton.className = 'gh-sorter-button gh-sorter-debug-button'; debugButton.addEventListener('click', runSelectorCheck); buttonContainer.appendChild(debugButton);
            uiContainer.appendChild(buttonContainer);

            parent.appendChild(uiContainer); // Append panel

            // Toggle Button
            const toggleButton = document.createElement('button'); toggleButton.id = UI_TOGGLE_ID;
            toggleButton.title = "Grubhub Sorter Settings";
            toggleButton.style.display = config.uiVisible ? 'none' : 'flex'; // Set initial display
            toggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.14,12.94a2,2,0,0,1-1.62-.72l-.06-.09a6,6,0,0,0-8.92,0l-.06.09a2,2,0,0,1-1.62.72A2,2,0,0,1,4.86,12L4.74,11a10,10,0,0,1,.57-4.54l.11-.18a2,2,0,0,1,1.12-1.12l.18-.11A10,10,0,0,1,11,4.74l1,.12a2,2,0,0,1,.72,1.62l.09.06a6,6,0,0,0,0,8.92l-.09.06a2,2,0,0,1-.72,1.62l-1,.12a10,10,0,0,1-4.54.57l-.18.11a2,2,0,0,1-1.12,1.12l-.11.18A10,10,0,0,1,4.74,13l.12-1a2,2,0,0,1,1.62-.72ZM12,15.5A3.5,3.5,0,1,0,8.5,12,3.5,3.5,0,0,0,12,15.5Z"/></svg>`;
            toggleButton.addEventListener('click', toggleUIVisibility);
            parent.appendChild(toggleButton); // Append toggle

            // Add listener AFTER element is in DOM
            uiContainer.querySelector('#gh-sorter-ui-closer').addEventListener('click', toggleUIVisibility);

            showStatusMessage("Sorter UI loaded.", 2000);
        } catch (e) { console.error("GH Sorter: Error creating UI.", e); showStatusMessage("Sorter UI failed to load!", 5000); }
    }
    function toggleUIVisibility() { /* ... */ try { config.uiVisible = !config.uiVisible; GM_setValue('grubhub_uiVisible', config.uiVisible); if (uiContainer) { uiContainer.style.display = config.uiVisible ? 'block' : 'none'; } updateUIToggleVisibility(); } catch(e) { console.error("GH Sorter: Error in toggleUIVisibility", e); } }
    function updateUIToggleVisibility() { /* ... */ try { const toggleButton = document.getElementById(UI_TOGGLE_ID); if (toggleButton) { toggleButton.style.display = config.uiVisible ? 'none' : 'flex'; } } catch(e) { console.error("GH Sorter: Error in updateUIToggleVisibility", e); } }
    function resetCardStyles(itemElement) { /* ... */ try { itemElement.classList.remove('gh-sorter-hidden'); const cardElement = itemElement.querySelector(RESTAURANT_CARD_SELECTOR); if (!cardElement) return; const distanceEl = cardElement.querySelector(DISTANCE_SELECTOR); if (distanceEl) { distanceEl.style.color = ''; distanceEl.style.fontWeight = ''; distanceEl.classList.remove(COLOR_DISTANCE_CLASS); } } catch(e) { console.warn("GH Sorter: Error resetting item styles", e, itemElement); } }
    function resetAllCardStyles() { /* ... */ try { document.querySelectorAll(ITEM_SELECTOR_STRING).forEach(resetCardStyles); document.querySelectorAll('.' + COLOR_DISTANCE_CLASS).forEach(el => { el.style.color = ''; el.style.fontWeight = ''; el.classList.remove(COLOR_DISTANCE_CLASS); }); console.info("GH Sorter: Reset styles for detected items."); } catch(e) { console.error("GH Sorter: Error resetting all styles", e); } }
    function runSelectorCheck() { /* ... */ try { console.log("--- GH Sorter: Manual Selector Check ---"); showStatusMessage("Checking selectors... (See console F12)"); console.log(`Checking for Containers with selector: "${LIST_CONTAINER_SELECTORS_STRING}"`); const containers = document.querySelectorAll(LIST_CONTAINER_SELECTORS_STRING); console.log(`Found ${containers.length} container elements.`); if (containers.length > 0) { console.log("First container outerHTML:", containers[0].outerHTML.substring(0, 500) + (containers[0].outerHTML.length > 500 ? '...' : '')); const firstContainerItems = containers[0].querySelectorAll(ITEM_SELECTOR_STRING); console.log(`Found ${firstContainerItems.length} items (slides/cells) within the first container.`); if (firstContainerItems.length > 0) { const itemSelector = firstContainerItems[0].matches(CAROUSEL_SLIDE_SELECTOR) ? CAROUSEL_SLIDE_SELECTOR : GRID_CELL_SELECTOR; console.log(`First item in container (selector: ${itemSelector}) outerHTML:`, firstContainerItems[0].outerHTML.substring(0, 500) + (firstContainerItems[0].outerHTML.length > 500 ? '...' : '')); const cardInFirstItem = firstContainerItems[0].querySelector(RESTAURANT_CARD_SELECTOR); console.log(`Card element ('${RESTAURANT_CARD_SELECTOR}') found in first item: ${!!cardInFirstItem}`); if(cardInFirstItem) { const distEl = cardInFirstItem.querySelector(DISTANCE_SELECTOR); console.log(`Distance element ('${DISTANCE_SELECTOR}') found in first card: ${!!distEl}`); if(distEl) console.log("Distance element text:", distEl.textContent); const linkEl = cardInFirstItem.querySelector(RESTAURANT_NAME_LINK_SELECTOR); console.log(`Link element ('${RESTAURANT_NAME_LINK_SELECTOR}') found in first card: ${!!linkEl}. Href: ${linkEl?.getAttribute('href')}`); } } } const cards = document.querySelectorAll(RESTAURANT_CARD_SELECTOR); console.log(`Found ${cards.length} card elements globally (using "${RESTAURANT_CARD_SELECTOR}").`); const items = document.querySelectorAll(ITEM_SELECTOR_STRING); console.log(`Found ${items.length} items (slides+cells) globally.`); console.log("-----------------------------------------"); showStatusMessage(`Selector Check Done: ${items.length} items / ${containers.length} containers found globally.`, 5000); } catch (e) { console.error("GH Sorter: Error during manual selector check.", e); showStatusMessage("Error during selector check! (See console F12)", 5000); } }


    // --- Core Logic (Functions unchanged) ---
    function getColorForDistance(distance) { /* ... */ try { if (distance === Infinity || distance === null || isNaN(distance)) { return '#888'; } const clampedDistance = Math.max(MIN_COLOR_DIST, Math.min(distance, MAX_COLOR_DIST)); const normalized = (clampedDistance - MIN_COLOR_DIST) / (MAX_COLOR_DIST - MIN_COLOR_DIST); const hue = 120 * (1 - normalized); return `hsl(${hue}, 90%, 40%)`; } catch(e) { console.warn("GH Sorter: Error calculating color", e); return '#888'; } }
    function parseDistance(cardElement) { /* ... */ try { const distanceElement = cardElement?.querySelector(DISTANCE_SELECTOR); if (distanceElement?.textContent) { const match = distanceElement.textContent.match(/•\s*([\d.]+)\s*mi/i); if (match?.[1]) return parseFloat(match[1]); } const textContent = cardElement?.textContent || ''; const broaderMatch = textContent.match(/•\s*([\d.]+)\s*mi/i); if (broaderMatch?.[1]) return parseFloat(broaderMatch[1]); return Infinity; } catch(e) { console.warn("GH Sorter: Error parsing distance", e, cardElement); return Infinity; } }
    function hasOffer(cardElement) { /* ... */ try { return !!cardElement?.querySelector(OFFER_BADGE_SELECTOR); } catch(e) { console.warn("GH Sorter: Error checking offer", e, cardElement); return false; } }
    function isFavorited(cardElement) { /* ... */ try { const favButton = cardElement?.querySelector(FAVORITE_BUTTON_SELECTOR); if (!favButton) return false; const title = favButton.getAttribute('title')?.toLowerCase(); return title === FAVORITED_INDICATOR_TITLE; } catch(e) { console.warn("GH Sorter: Error checking favorite", e, cardElement); return false; } }
    function getRestaurantLink(cardElement) { /* ... */ try { const linkElement = cardElement?.querySelector(RESTAURANT_NAME_LINK_SELECTOR); return linkElement?.getAttribute('href') || null; } catch(e) { console.warn("GH Sorter: Error getting restaurant link", e, cardElement); return null; } }
    function getItemData(itemElement, forceReparse = false) { /* ... */ try { const cardElement = itemElement.querySelector(RESTAURANT_CARD_SELECTOR); if (!cardElement) { console.warn("GH Sorter: No card found within item:", itemElement); return { itemElement: itemElement, distance: Infinity, hasOffer: false, isFavorited: false, isHidden: false, isValid: false, href: null }; } if (itemElement.dataset.ghProcessed === 'true' && !forceReparse) { const currentFavorite = isFavorited(cardElement); if ( (itemElement.dataset.ghIsFavorited === 'true') !== currentFavorite ) { itemElement.dataset.ghIsFavorited = currentFavorite; } return { itemElement: itemElement, distance: parseFloat(itemElement.dataset.ghDistance || Infinity), hasOffer: itemElement.dataset.ghHasOffer === 'true', isFavorited: itemElement.dataset.ghIsFavorited === 'true', isHidden: itemElement.classList.contains('gh-sorter-hidden'), isValid: true, href: itemElement.dataset.ghHref || getRestaurantLink(cardElement) }; } const distance = parseDistance(cardElement); const offer = hasOffer(cardElement); const favorite = isFavorited(cardElement); const href = getRestaurantLink(cardElement); itemElement.dataset.ghDistance = distance; itemElement.dataset.ghHasOffer = offer; itemElement.dataset.ghIsFavorited = favorite; itemElement.dataset.ghHref = href; itemElement.dataset.ghProcessed = 'true'; return { itemElement: itemElement, distance: distance, hasOffer: offer, isFavorited: favorite, isHidden: config.scriptEnabled && distance > config.maxDistance, isValid: true, href: href }; } catch(e) { console.error("GH Sorter: Error getting item/card data", e, itemElement); return { itemElement: itemElement, distance: Infinity, hasOffer: false, isFavorited: false, isHidden: false, isValid: false, href: null }; } }
    function applyItemStyles(itemData, displayedHrefs) { /* ... */ try { const itemElement = itemData.itemElement; const cardElement = itemElement.querySelector(RESTAURANT_CARD_SELECTOR); const distanceEl = cardElement?.querySelector(DISTANCE_SELECTOR); let isDuplicate = false; let shouldBeHidden = config.scriptEnabled && itemData.distance > config.maxDistance; if (config.scriptEnabled && !shouldBeHidden && itemData.href) { if (displayedHrefs.has(itemData.href)) { shouldBeHidden = true; isDuplicate = true; } else { displayedHrefs.add(itemData.href); } } if (shouldBeHidden) { itemElement.classList.add('gh-sorter-hidden'); itemData.isHidden = true; } else { itemElement.classList.remove('gh-sorter-hidden'); itemData.isHidden = false; } if (distanceEl) { if (config.scriptEnabled && !shouldBeHidden && itemData.distance !== Infinity) { const color = getColorForDistance(itemData.distance); distanceEl.style.color = color; distanceEl.style.fontWeight = 'bold'; distanceEl.classList.add(COLOR_DISTANCE_CLASS); } else { distanceEl.style.color = ''; distanceEl.style.fontWeight = ''; distanceEl.classList.remove(COLOR_DISTANCE_CLASS); } } return itemData.isHidden; } catch(e) { console.error("GH Sorter: Error applying styles to item", e, itemData.itemElement); return itemData.itemElement.classList.contains('gh-sorter-hidden'); } }
    function sortAndFilterRestaurants(forceReparse = false) { /* ... Includes dedupe + tiebreak */ try { if (!hasInitialized) { console.warn("GH Sorter: sortAndFilterRestaurants called before initialization."); return; } if (!config.scriptEnabled && !forceReparse) { console.info("GH Sorter: Script disabled, skipping."); return; } sortRunId++; const runType = forceReparse ? 'Manual' : 'Auto'; console.info(`GH Sorter: --- Run ${sortRunId} (${runType}) --- Starting`); const listContainers = document.querySelectorAll(LIST_CONTAINER_SELECTORS_STRING); if (listContainers.length === 0) { console.info(`GH Sorter: Run ${sortRunId}: No list containers found.`); return; } console.info(`GH Sorter: Run ${sortRunId}: Found ${listContainers.length} containers.`); const processedRestaurantHrefs = new Set(); listContainers.forEach((container, index) => { try { const itemsInContainer = Array.from(container.querySelectorAll(ITEM_SELECTOR_STRING)); if (itemsInContainer.length === 0) { return; } const itemType = itemsInContainer[0].matches(CAROUSEL_SLIDE_SELECTOR) ? 'slides' : 'grid cells'; console.info(`GH Sorter: Container ${index + 1} processing ${itemsInContainer.length} ${itemType}.`); const itemsData = itemsInContainer.map(item => getItemData(item, forceReparse)).filter(data => data.isValid); itemsData.forEach(data => { data.isHidden = applyItemStyles(data, processedRestaurantHrefs); }); if (!config.scriptEnabled) return; const visibleItemsData = itemsData.filter(data => !data.isHidden); const hiddenItemsData = itemsData.filter(data => data.isHidden); if (visibleItemsData.length <= 1) { hiddenItemsData.forEach(data => container.appendChild(data.itemElement)); return; } visibleItemsData.sort((a, b) => { if (config.prioritizeFavorites) { if (a.isFavorited && !b.isFavorited) return -1; if (!a.isFavorited && b.isFavorited) return 1; } if (config.prioritizeOffers) { if (a.hasOffer && !b.hasOffer) return -1; if (!a.hasOffer && b.hasOffer) return 1; } if (a.distance !== b.distance) { return a.distance - b.distance; } const aScore = (a.isFavorited ? 1 : 0) + (a.hasOffer ? 1 : 0); const bScore = (b.isFavorited ? 1 : 0) + (b.hasOffer ? 1 : 0); if (aScore !== bScore) { return bScore - aScore; } if (a.href && b.href) { return a.href.localeCompare(b.href); } return 0; }); visibleItemsData.forEach(data => container.appendChild(data.itemElement)); hiddenItemsData.forEach(data => container.appendChild(data.itemElement)); } catch (containerError) { console.error(`GH Sorter: Error processing container ${index + 1}.`, containerError, container); } }); console.info(`GH Sorter: --- Run ${sortRunId} --- Finished.`); } catch (mainError) { console.error("GH Sorter: Critical error in sortAndFilterRestaurants.", mainError); } }

    // --- Initialization and Observation (unchanged) ---
    function initializeObserver() { /* ... */ try { if (observer) observer.disconnect(); observer = new MutationObserver(mutations => { let needsProcessing = false; for (const mutation of mutations) { const parentContainer = mutation.target.closest(LIST_CONTAINER_SELECTORS_STRING); if (parentContainer) { if (mutation.type === 'childList') { const addedNodes = Array.from(mutation.addedNodes); const removedNodes = Array.from(mutation.removedNodes); if (addedNodes.some(n => n.nodeType === Node.ELEMENT_NODE && (n.matches(ITEM_SELECTOR_STRING) || n.querySelector(ITEM_SELECTOR_STRING))) || removedNodes.some(n => n.nodeType === Node.ELEMENT_NODE && n.matches(ITEM_SELECTOR_STRING))) { needsProcessing = true; break; } } else if (mutation.type === 'attributes') { if (mutation.target.matches && (mutation.target.matches(ITEM_SELECTOR_STRING) || mutation.target.matches(RESTAURANT_CARD_SELECTOR) || mutation.target.closest(FAVORITE_BUTTON_SELECTOR) || mutation.target.closest(DISTANCE_SELECTOR) )) { needsProcessing = true; break; } } } else if (mutation.type === 'childList') { const addedNodes = Array.from(mutation.addedNodes); if (addedNodes.some(n => n.nodeType === Node.ELEMENT_NODE && (n.matches(RESTAURANT_CARD_SELECTOR) || n.querySelector(RESTAURANT_CARD_SELECTOR)))) { needsProcessing = true; break; } } } if (needsProcessing) { clearTimeout(debounceTimer); debounceTimer = setTimeout(() => sortAndFilterRestaurants(false), 950); } }); console.info("GH Sorter: Initializing MutationObserver."); observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'aria-label', 'data-testid', 'title'] }); } catch(e) { console.error("GH Sorter: Failed to initialize MutationObserver.", e); } }
    function startInitializationCheck() { /* ... */ if (hasInitialized || initialCheckInterval) return; console.info("GH Sorter: Starting initialization check sequence."); initialCheckRetries = 0; clearInterval(initialCheckInterval); function check() { try { initialCheckRetries++; if (initialCheckRetries % 5 === 1 || initialCheckRetries === MAX_INITIAL_CHECK_RETRIES) console.info(`GH Sorter: Init check #${initialCheckRetries}.`); const items = document.querySelectorAll(ITEM_SELECTOR_STRING); const itemCount = items.length; const containerExists = !!document.querySelector(LIST_CONTAINER_SELECTORS_STRING); if (itemCount >= MIN_ITEMS_FOR_INIT && containerExists) { console.info(`GH Sorter: Found ${itemCount} items (slides/cells) and container. Initializing sorter functionality.`); clearInterval(initialCheckInterval); initialCheckInterval = null; hasInitialized = true; sortAndFilterRestaurants(true); initializeObserver(); showStatusMessage("Sorter initialized & running.", 3000); return; } if (initialCheckRetries > MAX_INITIAL_CHECK_RETRIES) { console.error(`GH Sorter: Timed out waiting for elements (${ITEM_SELECTOR_STRING}). Sorting may not work.`); clearInterval(initialCheckInterval); initialCheckInterval = null; showStatusMessage("Sorter init failed: Couldn't find lists automatically.", 10000); } } catch (checkError) { console.error("GH Sorter: Error during initialization check.", checkError); clearInterval(initialCheckInterval); initialCheckInterval = null; } } initialCheckInterval = setInterval(check, 750); check(); }

    // --- IMMEDIATE ACTIONS (unchanged) ---
    function initUI() { if (document.getElementById(UI_TOGGLE_ID)) return; console.info("GH Sorter: DOM ready. Creating UI."); createSettingsUI(); }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initUI); } else { initUI(); }

    // --- DELAYED ACTIONS (unchanged) ---
    window.addEventListener('load', () => { console.info("GH Sorter: Window load event fired. Starting initialization checks soon."); setTimeout(startInitializationCheck, 500); });
    setTimeout(() => { if (!initialCheckInterval && !hasInitialized) { console.warn("GH Sorter: Window load fallback. Starting initialization checks."); startInitializationCheck(); } }, 7000);

})(); // End of userscript