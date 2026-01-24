// ==UserScript==
// @name         Draftmancer Card Rating Inspector
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Locate all BoosterCard instances while drafting and display delta winrate from 17lands data
// @homepage     https://greasyfork.org/scripts/545265
// @supportURL   https://greasyfork.org/scripts/545265/feedback
// @author       xiaoas
// @match        https://draftmancer.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545265/Draftmancer%20Card%20Rating%20Inspector.user.js
// @updateURL https://update.greasyfork.org/scripts/545265/Draftmancer%20Card%20Rating%20Inspector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cardRatingsList = []; // Aggregated list of ratings across expansions
    let cardRatingsByName = {}; // Map: name -> rating entry
    let cardRatingsByMtgaId = {}; // Map: mtga_id -> rating entry
    let currentExpansion = 'EOE'; // Default to EOE
    let lastCardNames = []; // Track last known card names
    let refreshInterval = null;
    let isRequestInProgress = false; // Prevent overlapping requests
    let isLoopInProgress = false; // Prevent overlapping main loop runs
    const queriedExpansions = new Set(); // Track expansions whose data has been fetched
    const fetchPromisesByExpansion = {}; // Track in-flight fetches per expansion
    let activeFetchCount = 0; // Track number of active fetches

    // Expansion mapping from page names to 17lands parameters
    const expansionMapping = {
        "Lorwyn Eclipsed": "ECL",
        "Avatar: The Last Airbender": "TLA",
        "Through the Omenpaths": "OM1",
        "Edge of Eternities": "EOE",
        "Final Fantasy": "FIN",
        "Tarkir: Dragonstorm": "TDM",
        "Aetherdrift": "DFT",
        "Foundations": "FDN",
        "Duskmourn: House of Horror": "DSK",
        "Bloomburrow": "BLB",
        "Modern Horizons 3": "MH3",
        "Outlaws of Thunder Junction": "OTJ",
        "Murders at Karlov Manor": "MKM",
        "The Lost Caverns of Ixalan": "LCI",
        "Wilds of Eldraine": "WOE",
        "March of the Machine": "MOM",
    };

    let warnedUnknownExpansions = [];
    // Function to detect current expansion from page
    function detectExpansion() {
        try {
            const setElement = document.querySelector('.selected-set-name');
            if (setElement) {
                const setText = setElement.innerText.trim();
                currentExpansion = expansionMapping[setText];
                if (!currentExpansion && setText && !warnedUnknownExpansions.includes(setText)) {
                    console.warn(`⚠️ Unknown expansion detected: "${setText}". Please update the expansionMapping.`);
                    warnedUnknownExpansions.push(setText);
                }
                return currentExpansion;
            }
        } catch (error) {
            console.error('❌ Error detecting expansion:', error);
        }
        return currentExpansion;
    }

    let warnedUnknownSetNames = [];
    function inferExpansionsFromSetName(setString) {
        const s = (setString || '').toLowerCase();
        const inferred = new Set();
        if (s == 'ecl') inferred.add('ECL');
        if (['tla', 'tle'].includes(s)) inferred.add('TLA');
        if (['om1', 'spm'].includes(s)) inferred.add('OM1');
        if (['eoe', 'eos'].includes(s)) inferred.add('EOE');
        if (s == 'fin') inferred.add('FIN');
        if (s == 'tdm') inferred.add('TDM');
        if (['dft', 'spg'].includes(s)) inferred.add('DFT');
        if (s == 'fdn') inferred.add('FDN');
        if (s == 'dsk') inferred.add('DSK');
        if (s == 'blb') inferred.add('BLB');
        if (s == 'mh3') inferred.add('MH3');
        if (['otj', 'otp'].includes(s)) inferred.add('OTJ');
        if (s == 'mkm') inferred.add('MKM');
        if (s == 'lci') inferred.add('LCI');
        if (['woe', 'wot'].includes(s)) inferred.add('WOE');
        if (['mom', 'mul'].includes(s)) inferred.add('MOM');

        if (inferred.size === 0 && setString && !warnedUnknownSetNames.includes(setString)) {
            console.warn(`⚠️ Failed to infer expansion for card with set name: "${setString}".`);
            warnedUnknownSetNames.push(setString);
        }

        return Array.from(inferred);
    }

    // Function to calculate weighted average win rate for an expansion
    function calculateWeightedAverageWinRate(expansionData) {
        if (!expansionData || expansionData.length === 0) return 0;

        let totalWeightedWinRate = 0;
        let totalGames = 0;

        expansionData.forEach(card => {
            if (card.ever_drawn_win_rate !== undefined && card.ever_drawn_game_count) {
                totalWeightedWinRate += card.ever_drawn_win_rate * card.ever_drawn_game_count;
                totalGames += card.ever_drawn_game_count;
            }
        });

        return totalGames > 0 ? totalWeightedWinRate / totalGames : 0;
    }

    // Function to fetch card ratings data from 17lands for a specific expansion and merge
    async function fetchCardRatings(targetExpansion) {
        if (!targetExpansion) return null;
        if (queriedExpansions.has(targetExpansion)) {
            return null;
        }
        if (fetchPromisesByExpansion[targetExpansion]) {
            return await fetchPromisesByExpansion[targetExpansion];
        }

        // Track global request state
        activeFetchCount += 1;
        isRequestInProgress = activeFetchCount > 0;

        try {
            // console.log(`📊 Fetching card ratings from 17lands for expansion: ${targetExpansion}`);
            let format = 'PremierDraft', suffix = '';
            switch (targetExpansion) {
                case 'OM1':
                    format = 'PickTwoDraft';
                    suffix = '&start_date=2025-09-23&end_date=2025-11-15';
                    break;
                case 'TDM':
                    suffix = '&start_date=2025-04-08&end_date=2025-10-13';
                    break;
                case 'DFT':
                    suffix = '&start_date=2025-02-11&end_date=2025-08-19';
                    break;
                case 'FDN':
                    suffix = '&start_date=2024-11-12&end_date=2025-08-23';
                    break;
                case 'DSK':
                    suffix = '&start_date=2024-09-24&end_date=2025-09-05';
                    break;
                case 'BLB':
                    suffix = '&start_date=2024-07-30&end_date=2025-09-05';
                    break;
                case 'MH3':
                    suffix = '&start_date=2024-06-11&end_date=2025-09-05';
                    break;
                case 'OTJ':
                    suffix = '&start_date=2024-04-16&end_date=2025-09-05';
                    break;
                case 'MKM':
                    suffix = '&start_date=2024-02-06&end_date=2025-09-05';
                    break;
                case 'LCI':
                    suffix = '&start_date=2023-11-14&end_date=2025-09-05';
                    break;
                case 'WOE':
                    suffix = '&start_date=2023-09-05&end_date=2025-09-05';
                    break;
                case 'MOM':
                    suffix = '&start_date=2023-04-18&end_date=2025-09-05';
                    break;
                default:
                    break;
            }
            const url = `https://www.17lands.com/card_ratings/data?expansion=${targetExpansion}&event_type=${format}${suffix}`;
            const fetchPromise = fetch(url).then(async (response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const expansionData = await response.json();
                // Merge entries into list and maps (by mtga_id if available, otherwise by name)
                expansionData.forEach(entry => {
                    if (!entry || !entry.name) return;
                    const id = entry.mtga_id;
                    let existing = null;
                    if (id != null && cardRatingsByMtgaId[id]) {
                        existing = cardRatingsByMtgaId[id];
                    } else if (cardRatingsByName[entry.name]) {
                        existing = cardRatingsByName[entry.name];
                    }

                    if (existing) {
                        // Update existing entry in-place
                        Object.assign(existing, entry);
                        // Ensure maps are synced
                        cardRatingsByName[existing.name] = existing;
                        if (existing.mtga_id != null) {
                            cardRatingsByMtgaId[existing.mtga_id] = existing;
                        }
                    } else {
                        cardRatingsList.push(entry);
                        cardRatingsByName[entry.name] = entry;
                        if (id != null) {
                            cardRatingsByMtgaId[id] = entry;
                        }
                    }
                });
                queriedExpansions.add(targetExpansion);
                return expansionData;
            });

            fetchPromisesByExpansion[targetExpansion] = fetchPromise;
            const result = await fetchPromise;
            return result;
        } catch (error) {
            console.error('❌ Error fetching card ratings:', error);
            return null;
        } finally {
            // Clear in-flight promise and update request tracking
            delete fetchPromisesByExpansion[targetExpansion];
            activeFetchCount = Math.max(0, activeFetchCount - 1);
            isRequestInProgress = activeFetchCount > 0;
        }
    }

    // Function to find card rating by mtga_id (arena_id) first, then by name
    function findCardRating(card) {
        if (!card) return null;
        if (card.arena_id != null && cardRatingsByMtgaId[card.arena_id]) {
            return cardRatingsByMtgaId[card.arena_id];
        }
        if (cardRatingsByName[card.name]) {
            return cardRatingsByName[card.name];
        }
        if (card.name.includes(' // ')) {
            const short_name = card.name.split(' // ')[0];
            if (cardRatingsByName[short_name]) {
                return cardRatingsByName[short_name];
            }
        }
        return null;
    }

    // Function to get color based on delta winrate
    function getColorForDelta(deltaWinrate) {
        // Normalize delta to 0-1 range for color calculation
        const normalizedDelta = Math.max(-0.05, Math.min(0.05, deltaWinrate));
        const normalizedValue = (normalizedDelta + 0.05) / 0.1; // Convert to 0-1 range

        let r, g, b;

        if (normalizedValue >= 0.5) {
            // yellow to green transition (0.5 to 1.0)
            const factor = (normalizedValue - 0.5) * 2; // 0 to 1
            r = Math.round(192 * (1-factor));
            g = Math.round(128 * (1+factor) - 1);
            b = Math.round(32 * (1+factor) - 1);
        } else {
            // red to yellow transition (0.0 to 0.5)
            const factor = normalizedValue * 2; // 0 to 1
            r = Math.round(64 * (3+factor) - 1);
            g = Math.round(127 * factor);
            b = 0;
        }

        return `rgba(${r}, ${g}, ${b}, 0.8)`;
    }
    let warnedUnknownCardNames = [];
    // Function to add delta winrate overlays above each card
    function addDeltaWinrateOverlays(boosterCards) {
        // Extract current card names for comparison
        const currentCardNames = boosterCards.map(card => card.props.card.name);

        // Check if card list has changed
        if (currentCardNames.length === 0) {
            console.log('⚠️ No cards found, skipping overlay refresh');
            return;
        }

        // Check if the card list is the same as last time and overlays already present
        const existingOverlaysForSkipCheck = document.querySelectorAll('.card-name-overlay');
        const isSameCardList = lastCardNames.length === currentCardNames.length &&
            lastCardNames.every((name, index) => name === currentCardNames[index]);
        if (isSameCardList && existingOverlaysForSkipCheck.length === currentCardNames.length) {
            // console.log('🔄 Card list unchanged and overlays present, skipping overlay refresh');
            return;
        }

        // console.log('🎨 Adding delta winrate overlays...');
        // console.log(`📊 Cards changed from [${lastCardNames.join(', ')}] to [${currentCardNames.join(', ')}]`);

        // Update last known card names
        lastCardNames = [...currentCardNames];

        // Remove any existing overlays first
        const existingOverlays = document.querySelectorAll('.card-name-overlay');
        existingOverlays.forEach(overlay => overlay.remove());

        // Try to match Vue components with DOM elements
        boosterCards.forEach((card, index) => {
            const cardData = card.props.card;
            let element = card.el;

            if (!element) {
                console.log(`❌ No DOM element found for card: ${cardData.name}`);
                return;
            }

            // Find the card rating
            const rating = findCardRating(cardData);
            let displayText = cardData.name;
            let backgroundColor = 'rgba(0, 0, 0, 0.8)';

            if (!rating) {
                if (!warnedUnknownCardNames.includes(cardData.name)) {
                    console.log(`⚠️ No rating data found for: ${cardData.name}`);
                    warnedUnknownCardNames.push(cardData.name);
                }
                return;
            }
            const cardWinRate = rating.ever_drawn_win_rate;
            const averageWinRate = 0.55; // hard code to allow multi pack scenario
            const deltaWinrate = cardWinRate - averageWinRate;
            const percentage = (deltaWinrate * 100).toFixed(1);
            displayText = deltaWinrate >= 0 ? `+${percentage}` : `${percentage}`;

            // Use gradual color transition based on delta winrate
            backgroundColor = getColorForDelta(deltaWinrate);

            // Create overlay element
            const overlay = document.createElement('div');
            overlay.className = 'card-name-overlay';
            overlay.textContent = displayText;
            overlay.title = `${cardData.name}: ${displayText}`;
            overlay.style.cssText = `
                position: absolute;
                top: 20%;
                right: 5px;
                background: ${backgroundColor};
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
                cursor: help;
            `;

            // Append the overlay directly to the card element itself
            element.appendChild(overlay);

            // console.log(`✅ Added overlay for "${cardData.name}" (${displayText}) to element:`, element);
        });
    }

    // Function to start monitoring for changes
    function startMonitoring() {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }

        // Monitor for changes in the main content area
        const targetNode = document.querySelector('.main-content') || document.body;

        refreshInterval = setInterval(() => {
            // Only run if no loop is currently in progress
            if (!isLoopInProgress) {
                refreshOverlaysLoop();
            } else {
                // console.log('⏳ Skipping interval - loop in progress');
            }
        }, 1000); // Check every 1000ms

        // console.log('👀 Started monitoring for card changes');
    }

    // Synchronous function to find and return BoosterCard instances using Vue 3 app structure
    function findBoosterCards() {
        try {
            // console.log('🔍 Locating BoosterCard instances using Vue 3 app structure...');

            if (!document.querySelector('.booster.card-container')) { // game has not started yet
                return [];
            }
            // Find the Vue 3 app instance
            const appElement = Array.from(document.querySelectorAll('*')).find((e) => e.__vue_app__);
            if (!appElement) {
                // console.log('❌ No Vue 3 app found');
                return [];
            }

            const app = appElement.__vue_app__;
            // console.log('✅ Vue 3 app found:', app);

            // Check if BoosterCard component exists
            if (!app._component.components.BoosterCard) {
                // console.log('❌ BoosterCard component not found in app._component.components');
                // console.log('Available components:', Object.keys(app._component.components));
                return [];
            }

            // Navigate through the component tree as described
            let currentNode = app._container._vnode.component.subTree;
            if (!currentNode) {
                // console.log('❌ Could not access app._container._vnode.component.subTree');
                return [];
            }

            // Find main-content
            const mainContentNode = currentNode.children?.find(child =>
                child.props?.class === 'main-content'
            );

            if (!mainContentNode) {
                // console.log('❌ Could not find main-content node');
                // console.log('Available children:', currentNode.children);
                return [];
            }

            // Find generic-container
            const genericContainerNode = mainContentNode.children?.find(child =>
                child.props?.class === 'generic-container'
            );

            if (!genericContainerNode) {
                // console.log('❌ Could not find generic-container node');
                // console.log('Available children:', mainContentNode.children);
                return [];
            }

            // Find node with type == 'Symbol(v-fgt)'
            const vFgtNode = genericContainerNode.children?.find(child =>
                child.type && child.type.toString() === 'Symbol(v-fgt)'
            );

            if (!vFgtNode) {
                // console.log('❌ Could not find v-fgt node');
                // console.log('Available children:', genericContainerNode.children);
                return [];
            }

            // Find transition node and navigate to draft-picking container
            const draftPickingNode = vFgtNode.children?.find(child => {
                return child.el && child.el.nodeName === 'DIV'
            });

            if (!draftPickingNode) {
                // console.log('❌ Could not find draft-picking container node');
                // console.log('Available v-fgt children:', vFgtNode.children);
                return [];
            }

            // Get the actual draft-picking node from the component tree
            const actualDraftPickingNode = draftPickingNode.component.subTree.component.subTree;

            // Find booster-cards TransitionGroup
            const boosterCardsNode = actualDraftPickingNode.children?.find(child =>
                child.type?.name === 'TransitionGroup'
            );

            if (!boosterCardsNode) {
                // console.log('❌ Could not find booster-cards TransitionGroup');
                // console.log('Available draft-picking children:', actualDraftPickingNode.children);
                return [];
            }

            // Get the list of BoosterCards
            if (boosterCardsNode.component?.subTree?.children) {
                const boosterCards = boosterCardsNode.component.subTree.children;
                return boosterCards || [];
            } else {
                // console.log('❌ Could not access booster-cards children');
                return [];
            }

        } catch (error) {
            console.error('❌ Error while locating BoosterCards:', error);
            return [];
        }
    }

    // Main loop to: prefetch related data, then render overlays
    async function refreshOverlaysLoop() {
        if (isLoopInProgress) return;
        isLoopInProgress = true;
        try {
            // Prefetch based on detected expansion if possible (best-effort)
            const detected = detectExpansion();
            if (detected && !queriedExpansions.has(detected)) {
                await fetchCardRatings(detected);
            }

            const boosterCards = findBoosterCards();
            if (!boosterCards || boosterCards.length === 0) {
                return;
            }

            // Determine which expansions to fetch based on the sets of visible cards
            const expansionsToFetch = new Set();
            boosterCards.forEach(cardNode => {
                const card = cardNode?.props?.card;
                if (!card) return;
                const hasRating = (card.arena_id != null && cardRatingsByMtgaId[card.arena_id]) || cardRatingsByName[card.name];
                if (hasRating) return;
                const inferred = inferExpansionsFromSetName(card.set);
                inferred.forEach(exp => {
                    if (!queriedExpansions.has(exp)) {
                        expansionsToFetch.add(exp);
                    }
                });
            });

            if (expansionsToFetch.size > 0) {
                await Promise.all(Array.from(expansionsToFetch).map(exp => fetchCardRatings(exp)));
            }

            // Now render overlays
            addDeltaWinrateOverlays(boosterCards);
        } catch (error) {
            console.error('❌ Error in refreshOverlaysLoop:', error);
        } finally {
            isLoopInProgress = false;
        }
    }

    // Register functions to window for easy access
    window.findDraftmancerBoosterCards = findBoosterCards;
    window.addDeltaWinrateOverlays = addDeltaWinrateOverlays;
    window.fetchCardRatings = fetchCardRatings;
    window.startMonitoring = startMonitoring;
    window.refreshOverlaysLoop = refreshOverlaysLoop;
    window.stopMonitoring = () => {
        if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
            console.log('⏹️ Stopped monitoring for card changes');
        }
    };
    // Auto-run the search after a delay to allow Vue to initialize
    setTimeout(() => {
        console.log('🚀 Draftmancer Card Rating Inspector script loaded!');
        console.log('💡 Use window.findDraftmancerBoosterCards() to get BoosterCards');
        console.log('💡 Use window.addDeltaWinrateOverlays(boosterCards) to add visual overlays');
        console.log('💡 Use window.fetchCardRatings(expansion) to fetch 17lands data for a specific expansion');
        console.log('💡 Use window.startMonitoring() to start monitoring for changes');
        console.log('💡 Auto-running monitor in 1 second...');

        setTimeout(() => {
            refreshOverlaysLoop();
            startMonitoring();
        }, 1000);
    }, 100);

})();
