// ==UserScript==
// @name         Steam Badge Enhancer
// @namespace    https://github.com/encumber
// @version      2.1
// @description  Enhances Steam badges with detailed data, crafted highlight, IndexedDB for local caching, immediate cached display, and optional manual re-queue button. Seamless data hot-swapping during background refresh.
// @author       Nitoned
// @match        https://steamcommunity.com/*/badges/*
// @match        https://steamcommunity.com/*/badges*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/535436/Steam%20Badge%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/535436/Steam%20Badge%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const STEAMSETS_API_KEY = ''; // Get api key from https://steamsets.com/settings/developer-apps
    const STEAMSETS_API_URL = 'https://api.steamsets.com/v1/app.listBadges';
    const STEAM_BADGE_INFO_URL = 'https://steamcommunity.com/my/ajaxgetbadgeinfo/';
    const STEAMSETS_API_CALL_DELAY_MS = 1000; // 1 second delay before Steamsets API calls
    const STEAM_API_CALL_DELAY_MS = 200; // 200ms delay between Steam's ajaxgetbadgeinfo calls
    const CACHE_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const SCRIPT_TOGGLE_KEY = 'steamBadgeEnhancerEnabled'; // Key for the main script toggle
    const REQUEUE_BUTTON_TOGGLE_KEY = 'steamBadgeRequeueButtonEnabled'; // Key for the re-queue button toggle

    // IndexedDB Configuration
    const DB_NAME = 'SteamBadgeCacheDB';
    const DB_VERSION = 1; // Increment this if you change the database structure
    const STORE_NAME = 'badgeCache';
    // --- End Configuration ---

    // Get the current state of the toggle settings
    let isScriptEnabled = GM_getValue(SCRIPT_TOGGLE_KEY, true); // Default script enabled to true
    let isRequeueButtonEnabled = GM_getValue(REQUEUE_BUTTON_TOGGLE_KEY, true); // Default re-queue button enabled to true
     // Variable to hold the IndexedDB database instance
    let db = null;

    // --- IndexedDB Functions ---

    function openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error("IndexedDB database error:", event.target.error);
                reject(event.target.error);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                 // Create the object store if it doesn't exist
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'appId' });
                    console.log(`IndexedDB object store "${STORE_NAME}" created.`);
                }
                // Future versions could add indexes here if needed for querying
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                console.log("IndexedDB database opened successfully.");
                resolve(db);
            };
        });
    }

     async function getCacheEntry(appId) {
         if (!db) {
             console.warn("IndexedDB not initialized. Cannot get cache entry.");
             return null;
         }

         return new Promise((resolve, reject) => {
             const transaction = db.transaction([STORE_NAME], 'readonly');
             const store = transaction.objectStore(STORE_NAME);
             const request = store.get(appId);

             request.onerror = (event) => {
                 console.error(`Error getting cache entry for appId ${appId} from IndexedDB:`, event.target.error);
                 resolve(null); // Resolve with null on error
             };

             request.onsuccess = (event) => {
                 const cachedEntry = event.target.result;
                 // console.log(`IndexedDB get success for appId ${appId}:`, cachedEntry); // Too chatty
                 resolve(cachedEntry);
             };
         });
     }

     async function setCacheEntry(appId, cacheEntry) {
         if (!db) {
             console.warn("IndexedDB not initialized. Cannot set cache entry.");
             return false;
         }

         return new Promise((resolve, reject) => {
             const transaction = db.transaction([STORE_NAME], 'readwrite');
             const store = transaction.objectStore(STORE_NAME);

             // Add the appId to the object since it's the keyPath
             cacheEntry.appId = appId;

             const request = store.put(cacheEntry); // put() adds or updates

             request.onerror = (event) => {
                 console.error(`Error setting cache entry for appId ${appId} in IndexedDB:`, event.target.error);
                 resolve(false); // Resolve with false on error
             };

             request.onsuccess = (event) => {
                 // console.log(`IndexedDB set success for appId ${appId}.`); // Too chatty
                 resolve(true); // Resolve with true on success
             };

             transaction.oncomplete = () => {
                 // console.log(`IndexedDB transaction complete for appId ${appId}.`); // Too chatty
                 // The resolve is already called in onsuccess
             };
         });
     }

     async function removeCacheEntry(appId) {
         if (!db) {
             console.warn("IndexedDB not initialized. Cannot remove cache entry.");
             return false;
         }

         return new Promise((resolve, reject) => {
             const transaction = db.transaction([STORE_NAME], 'readwrite');
             const store = transaction.objectStore(STORE_NAME);
             const request = store.delete(appId);

             request.onerror = (event) => {
                 console.error(`Error removing cache entry for appId ${appId} from IndexedDB:`, event.target.error);
                 resolve(false); // Resolve with false on error
             };

             request.onsuccess = (event) => {
                 console.log(`Removed cache entry for App ID: ${appId} from IndexedDB.`);
                 resolve(true); // Resolve with true on success
             };

              transaction.oncomplete = () => {
                 // console.log(`IndexedDB delete transaction complete for appId ${appId}.`); // Too chatty
                 // The resolve is already called in onsuccess
             };
         });
     }

     // --- End IndexedDB Functions ---


    // Add the toggle buttons
    function addToggleButtons() {
        const profileHeader = document.querySelector('.profile_header_actions, .profile_header_actions_secondary');
        if (!profileHeader) {
             console.warn("Could not find profile header actions to add toggle buttons.");
             return;
        }

        // Add Main Script Toggle Button
        const scriptToggleButton = document.createElement('div');
        scriptToggleButton.id = 'steam-badge-enhancer-toggle';
        scriptToggleButton.style.cssText = `
            display: inline-block;
            margin-left: 10px;
            padding: 5px 10px;
            background-color: ${isScriptEnabled ? '#5cb85c' : '#d9534f'}; /* Green for enabled, Red for disabled */
            color: white;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            line-height: 1.2;
            user-select: none;
            margin-bottom: 5px; /* Space between buttons */
        `;
        scriptToggleButton.textContent = `Enhancer: ${isScriptEnabled ? 'Enabled' : 'Disabled'}`;
        scriptToggleButton.title = `Click to ${isScriptEnabled ? 'disable' : 'enable'} the Steam Badge Enhancer script.`;

        scriptToggleButton.addEventListener('click', () => {
            isScriptEnabled = !isScriptEnabled;
            GM_setValue(SCRIPT_TOGGLE_KEY, isScriptEnabled);
            scriptToggleButton.style.backgroundColor = isScriptEnabled ? '#5cb85c' : '#d9534f';
            scriptToggleButton.textContent = `Enhancer: ${isScriptEnabled ? 'Enabled' : 'Disabled'}`;
            scriptToggleButton.title = `Click to ${isScriptEnabled ? 'disable' : 'enable'} the Steam Badge Enhancer script.`;
            console.log(`Steam Badge Enhancer ${isScriptEnabled ? 'enabled' : 'disabled'}. Reload the page for changes to take full effect.`);
            // Reloading is recommended for the main toggle
        });

        profileHeader.appendChild(scriptToggleButton);

        // Add Re-queue Button Toggle Button
        const requeueToggle = document.createElement('div');
        requeueToggle.id = 'steam-badge-requeue-toggle';
         requeueToggle.style.cssText = `
            display: inline-block;
            margin-left: 10px;
            padding: 5px 10px;
            background-color: ${isRequeueButtonEnabled ? '#5cb85c' : '#d9534f'}; /* Green for enabled, Red for disabled */
            color: white;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            line-height: 1.2;
            user-select: none;
             /* Position relative to allow margin-left */
             position: relative;
             top: 0px; /* Align with the first button if needed */
        `;
        requeueToggle.textContent = `Re-queue Button: ${isRequeueButtonEnabled ? 'Shown' : 'Hidden'}`;
        requeueToggle.title = `Click to ${isRequeueButtonEnabled ? 'hide' : 'show'} the Re-queue Data Fetch buttons.`;

        requeueToggle.addEventListener('click', () => {
            isRequeueButtonEnabled = !isRequeueButtonEnabled;
            GM_setValue(REQUEUE_BUTTON_TOGGLE_KEY, isRequeueButtonEnabled);
            requeueToggle.style.backgroundColor = isRequeueButtonEnabled ? '#5cb85c' : '#d9534f';
            requeueToggle.textContent = `Re-queue Button: ${isRequeueButtonEnabled ? 'Shown' : 'Hidden'}`;
            requeueToggle.title = `Click to ${isRequeueButtonEnabled ? 'hide' : 'show'} the Re-queue Data Fetch buttons.`;
            console.log(`Re-queue buttons ${isRequeueButtonEnabled ? 'shown' : 'hidden'}.`);

            // Immediately hide/show buttons without requiring a reload
            const buttons = document.querySelectorAll('.requeue_button');
            buttons.forEach(button => {
                button.style.display = isRequeueButtonEnabled ? '' : 'none';
            });
        });

         // Find the parent of the first button and insert the second button after it
         if (scriptToggleButton.parentNode) {
              scriptToggleButton.parentNode.insertBefore(requeueToggle, scriptToggleButton.nextSibling);
         } else {
              // Fallback if parent not found (less likely)
              profileHeader.appendChild(requeueToggle);
         }


         console.log("Steam Badge Enhancer toggle buttons added.");
    }


    // Add script styles
    GM_addStyle(`
        /* Style for the container holding the appended badge details */
        .enhanced_badge_details_container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center; /* Center the individual badges */
            align-items: flex-start; /* Align items to the top */
            margin-top: 10px; /* Space between original content and new content */
            padding-top: 10px;
            border-top: 1px solid #303030; /* Separator line */
            width: 100%; /* Take full width of the badge row */
             min-height: 80px; /* Ensure container has some height even when empty or loading */
             position: relative; /* Needed for absolute positioned loading indicators */
        }

        .badge_info_container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 5px 15px; /* Increased horizontal margin (left and right) */
            text-align: center;
            width: 120px; /* Increased width of each badge container */
            flex-shrink: 0; /* Prevent shrinking */
             position: relative; /* Needed for highlight pseudo-element */
        }

        .badge_image {
            width: 64px; /* Adjust image size as needed */
            height: 64px; /* Adjust image size as needed */
            object-fit: contain;
            margin-bottom: 5px;
        }

        .badge_name {
            font-weight: bold;
            margin-bottom: 2px;
            font-size: 0.8em; /* Adjust font size for name */
            /* Added text truncation styles */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%; /* Ensure it respects the container width */
        }

        .badge_xp, .badge_scarcity, .badge_completion_date, .badge_level_display { /* Added .badge_level_display */
            font-size: 0.8em; /* Adjust font size for these elements */
            color: #8f98a0; /* Adjust secondary text color */
        }

        .badge_completion_date {
             font-size: 0.75em; /* Slightly smaller font for the date */
             white-space: nowrap; /* Prevent wrapping for the date */
             overflow: hidden; /* Hide overflow */
             text-overflow: ellipsis; /* Show ellipsis if still overflows */
             max-width: 100%; /* Ensure it respects the container width */
        }

        /* Style for highlighting the crafted badge */
        .badge_info_container.crafted {
            box-shadow: 0 0 8px 2px rgb(154 155 255 / 50%);
            border: 1px solid #8e8e95;
            padding: 0px 5px 15px 5px;
        }

        /* Style for the re-queue button */
        .requeue_button {
            padding: 3px 8px;
            max-width: 15px;
            background-color: #22558f;
            color: #ffffff;
            border: 1px solid #505050;
            border-radius: 3px;
            cursor: pointer;
            font-size: 1.3em;
            text-align: center;
             /* IMPORTANT: Stop click event propagation */
            z-index: 99999; /* Increased z-index */
            position: relative; /* Needed for z-index to work */
        }

        .requeue_button:hover {
            background-color: #404040;
        }

        /* Style for the initial loading/cached indicator */
         .initial_indicator {
             color: #8f98a0;
             font-style: italic;
             margin: 10px;
             width: 100%;
             display: block;
             text-align: center;
         }

         /* Style for the loading overlay */
         .enhancer_loading_overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent dark overlay */
              display: flex;
              justify-content: center;
              align-items: center;
              color: white;
              font-size: 1.2em;
              z-index: -10; /* Above badge details but below the container */
         }

    `);

    function extractAppIdFromBadgeLink(badgeRow) {
        const badgeLink = badgeRow.querySelector('a.badge_row_overlay');
        if (badgeLink) {
            const match = badgeLink.href.match(/\/gamecards\/(\d+)\//);
            if (match && match[1]) {
                return parseInt(match[1], 10);
            }
        }

        // Fallback if primary link not found or doesn't have appid
        const badgeImageLink = badgeRow.querySelector('.badge_info_image a'); // Link around the badge image
        if (badgeImageLink) {
            const steamStoreLinkMatch = badgeImageLink.href.match(/\/app\/(\d+)\//);
            if (steamStoreLinkMatch && steamStoreLinkMatch[1]) {
                return parseInt(steamStoreLinkMatch[1], 10);
            }
        }

        return null;
    }

    async function getBadgeData(appId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: STEAMSETS_API_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${STEAMSETS_API_KEY}` // Use the single API key
                },
                data: JSON.stringify({ appId: appId }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (data && Array.isArray(data.badges)) {
                            console.log(`Successfully fetched Steamsets badge data for appId ${appId}.`);
                            resolve(data.badges);
                        } else {
                            console.error(`Steamsets API response for appId ${appId} did not contain a valid 'badges' array. Response data:`, data);
                            resolve([]); // Resolve with empty array if data is not as expected
                        }
                    } catch (e) {
                        console.error(`Error parsing Steamsets API response for appId ${appId}:`, e);
                        resolve([]); // Resolve with empty array on parsing error
                    }
                },
                onerror: function(error) {
                    console.error(`GM_xmlhttpRequest error for appId ${appId}:`, error);
                    resolve([]); // Resolve with empty array on request error
                }
            });
        });
    }

     async function getCraftedBadgeInfo(appId, isFoil = false) {
         return new Promise((resolve, reject) => {
             let url = `${STEAM_BADGE_INFO_URL}${appId}`;
             if (isFoil) {
                 url += '?border=1'; // Add parameter for foil badge info
             }

             GM_xmlhttpRequest({
                 method: 'GET',
                 url: url,
                 onload: function(response) {
                     try {
                         const data = JSON.parse(response.responseText); // Parse the JSON response

                         let craftedLevel = 0;
                         let isCrafted = false;

                         // Check if badgedata and level exist in the JSON response
                         if (data && data.badgedata && typeof data.badgedata.level === 'number') {
                              craftedLevel = data.badgedata.level;
                              // Consider it crafted if the level is greater than 0
                              isCrafted = craftedLevel > 0;
                         }

                         // console.log(`Fetched crafted info for appId ${appId} (Foil: ${isFoil}): Crafted Level = ${craftedLevel}, Is Crafted = ${isCrafted}`); // Too chatty

                         // Return the crafted level and whether a badge (at any level) is crafted
                         resolve({ craftedLevel: craftedLevel, isCrafted: isCrafted });

                     } catch (e) {
                         console.error(`Error parsing Steam badge info JSON for appId ${appId} (Foil: ${isFoil}):`, e);
                         resolve({ craftedLevel: 0, isCrafted: false }); // Resolve with default values on error
                     }
                 },
                 onerror: function(error) {
                     console.error(`GM_xmlhttpRequest error fetching Steam badge info for appId ${appId} (Foil: ${isFoil}):`, error);
                     resolve({ craftedLevel: 0, isCrafted: false }); // Resolve with default values on error
                 }
             });
         });
     }


    // Helper function for introducing a delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

     // Helper function to format date for display
     function formatDateForDisplay(dateString) {
         try {
             const date = new Date(dateString);
             if (isNaN(date.getTime())) {
                 return 'Date unavailable';
             }

             const options = {
                 month: 'short', // 'Jan', 'Feb', etc.
                 day: 'numeric',
                 year: 'numeric',
                 hour: 'numeric', // 12-hour format
                 minute: 'numeric',
                 hour12: true // Use 12-hour format with AM/PM
             };

             // Use locale-specific formatting, then replace commas for the desired format
             let formatted = date.toLocaleString(undefined, options);

             // The default toLocaleString with 'short' month and numeric day/year
             // often results in "Month Day, Year, HH:MM AM/PM".
             // We'll return this format directly.

             return formatted;

         } catch (e) {
             console.error("Error formatting date:", e);
             return 'Date Formatting Error';
         }
     }


    // --- IndexedDB Caching Functions (Replacing Local Storage) ---

    function isCacheValid(cachedEntry) {
        if (!cachedEntry) {
            return false; // Entry doesn't exist
        }
        // Check for basic structure required
        // Note: The appId is now part of the stored object due to keyPath
        if (typeof cachedEntry.timestamp !== 'number' ||
            !cachedEntry.steamsetsData ||
            typeof cachedEntry.craftedNormalInfo !== 'object' ||
            typeof cachedEntry.craftedFoilInfo !== 'object' ||
             typeof cachedEntry.appId !== 'number') { // Check for appId as well
             console.log("Cache entry has invalid structure:", cachedEntry);
            return false; // Invalid structure
        }

        const now = Date.now();
        const isValid = (now - cachedEntry.timestamp) < CACHE_EXPIRATION_MS;
        return isValid;
    }


    // Map to store badge rows grouped by App ID (needed globally for re-queue)
    const badgeRowsByAppId = new Map();
     // Queue for App IDs to process (fetch new data)
    const fetchQueue = [];
     // Flag to prevent multiple fetch loops running simultaneously
    let isFetching = false;
     // Set to track App IDs currently being fetched
    const currentlyFetching = new Set();


     // Function to add an App ID to the fetch queue
     function queueAppIdForFetch(appId) {
         // Only add if not already in the queue or being processed
         if (!fetchQueue.includes(appId) && !currentlyFetching.has(appId)) {
              fetchQueue.push(appId);
              console.log(`App ID ${appId} added to fetch queue. Queue size: ${fetchQueue.length}`);
              // If not already fetching, start the fetch loop
              if (!isFetching) {
                  processFetchQueue();
              }
         } else {
              // console.log(`App ID ${appId} is already in the fetch queue or being fetched.`); // Too chatty
         }
     }

    // Main function to process the fetch queue
    async function processFetchQueue() {
        if (isFetching || fetchQueue.length === 0) {
            return; // Don't start if already fetching or queue is empty
        }

        isFetching = true;
        console.log("Starting fetch queue processing.");

        while (fetchQueue.length > 0) {
            const appId = fetchQueue[0]; // Peek at the next App ID

            // Ensure the App ID is added to the currentlyFetching set before processing
            currentlyFetching.add(appId);

            const rowsForApp = badgeRowsByAppId.get(appId) || [];

            if (rowsForApp.length === 0) {
                console.log(`No badge rows found for App ID ${appId} in badgeRowsByAppId map for fetch. Removing from queue.`);
                 fetchQueue.shift(); // Remove the item if no rows found
                 currentlyFetching.delete(appId); // Remove from fetching set
                continue; // Skip
            }

            console.log(`Processing App ID ${appId} from fetch queue.`);

             // Add loading indicator overlay to each row
            rowsForApp.forEach(badgeRow => {
                 let enhancedBadgeDetailsContainer = badgeRow.querySelector('.enhanced_badge_details_container');
                 if (!enhancedBadgeDetailsContainer) {
                     console.error(`Container not found for App ID ${appId} during fetch process.`);
                     return; // Skip this row if container is missing (shouldn't happen after initialSetup)
                 }

                 // Check if an overlay already exists
                 let loadingOverlay = enhancedBadgeDetailsContainer.querySelector('.enhancer_loading_overlay');
                 if (!loadingOverlay) {
                     loadingOverlay = document.createElement('div');
                     loadingOverlay.classList.add('enhancer_loading_overlay');
                     loadingOverlay.textContent = "Updating data...";
                     enhancedBadgeDetailsContainer.appendChild(loadingOverlay);
                 } else {
                     loadingOverlay.textContent = "Updating data..."; // Update text if it exists
                     loadingOverlay.style.display = 'flex'; // Ensure it's visible
                 }
            });


            // --- Fetch Steamsets data with 1-second delay ---
            await delay(STEAMSETS_API_CALL_DELAY_MS);
            const badgeData = await getBadgeData(appId);

            // --- Fetch Crafted Badge Info (Normal) with shorter delay ---
             await delay(STEAM_API_CALL_DELAY_MS);
             const craftedNormalInfo = await getCraftedBadgeInfo(appId, false);

             // --- Fetch Crafted Badge Info (Foil) with shorter delay ---
             await delay(STEAM_API_CALL_DELAY_MS);
             const craftedFoilInfo = await getCraftedBadgeInfo(appId, true);

             // Prepare cache entry
             const cacheEntry = {
                 timestamp: Date.now(),
                 steamsetsData: badgeData,
                 craftedNormalInfo: craftedNormalInfo,
                 craftedFoilInfo: craftedFoilInfo
             };

            // Store fetched data in IndexedDB
            await setCacheEntry(appId, cacheEntry); // Use the new IndexedDB set function

             // Display the updated data *before* removing the overlay
            displayBadgeDetails(appId, rowsForApp, badgeData, craftedNormalInfo, craftedFoilInfo, false); // Displaying fresh data

            // Remove the loading overlay after displaying new data
             rowsForApp.forEach(badgeRow => {
                 const enhancedBadgeDetailsContainer = badgeRow.querySelector('.enhanced_badge_details_container');
                 const loadingOverlay = enhancedBadgeDetailsContainer ? enhancedBadgeDetailsContainer.querySelector('.enhancer_loading_overlay') : null;
                 if (loadingOverlay) {
                     loadingOverlay.remove(); // Remove the overlay element
                 }
             });


             fetchQueue.shift(); // Remove the item from the queue AFTER successful fetch and cache
             currentlyFetching.delete(appId); // Remove from fetching set

        }

        isFetching = false;
        console.log("Finished fetch queue processing.");
    }


    // Function to display badge details (extracted for reusability)
    function displayBadgeDetails(appId, rowsForApp, badgeData, craftedNormalInfo, craftedFoilInfo, isCached) {
        console.log(`Displaying details for App ID ${appId}. Data is cached: ${isCached}`);

        // Find the existing container (created in initialSetup or processFetchQueue)
        rowsForApp.forEach(badgeRow => {
             const container = badgeRow.querySelector('.enhanced_badge_details_container');
             if(container) {
                 // Keep the container, but replace its *content* (excluding the overlay if it exists)
                 const loadingOverlay = container.querySelector('.enhancer_loading_overlay'); // Find existing overlay

                 // Create a temporary container to hold the new badge details HTML
                 const tempDiv = document.createElement('div');

                 if (badgeData.length > 0) {
                     // Sort badges: Levels 1-5 (non-foil) then Foil
                     const sortedBadges = badgeData.sort((a, b) => {
                         if (a.isFoil === b.isFoil) {
                             return a.baseLevel - b.baseLevel; // Sort by level if same foil status
                         }
                         return a.isFoil ? 1 : -1; // Foil comes after non-foil
                     });

                     // Create the HTML content for the detailed badges
                     const detailedBadgesHtml = sortedBadges.map(badge => {
                         const formattedCompletionDate = badge.firstCompletion ? formatDateForDisplay(badge.firstCompletion) : 'Date unavailable';

                         // Determine if this badge level should be highlighted
                         let isCraftedHighlight = false;
                         if (!badge.isFoil && craftedNormalInfo.isCrafted && craftedNormalInfo.craftedLevel === badge.baseLevel) {
                             isCraftedHighlight = true;
                         } else if (badge.isFoil && craftedFoilInfo.isCrafted && craftedFoilInfo.craftedLevel === badge.baseLevel) {
                              isCraftedHighlight = true;
                         }

                         // Add 'crafted' class if it needs highlighting
                         const containerClass = isCraftedHighlight ? 'badge_info_container crafted' : 'badge_info_container';

                         return `
                             <div class="${containerClass}">
                                 <div class="badge_name" title="${badge.name}">${badge.name}</div>
                                 <img class="badge_image" src="https://cdn.fastly.steamstatic.com/steamcommunity/public/images/items/${appId}/${badge.badgeImage}" alt="${badge.name}">
                                 <div class="badge_completion_date">${formattedCompletionDate}</div> <!-- Added First Completion Date -->
                                 <div class="badge_scarcity">Scarcity: ${badge.scarcity}</div>
                                 <div class="badge_level_display">Level: ${badge.baseLevel}${badge.isFoil ? ' (Foil)' : ''}</div> <!-- Added Level Display -->
                             </div>
                         `;
                     }).join(''); // Join the array of HTML strings into a single string

                     tempDiv.innerHTML = detailedBadgesHtml;

                 } else {
                      console.log(`No detailed badge data found for appId ${appId}. Displaying "No data available".`);
                      // Display a message
                      const noDataMessage = document.createElement('div');
                      noDataMessage.textContent = `No detailed badge data available for this game (App ID: ${appId}).`;
                      noDataMessage.style.color = '#8f98a0';
                      noDataMessage.style.margin = '10px auto'; // Center the message
                      tempDiv.appendChild(noDataMessage);
                 }

                 // Add a visual indicator if data was from cache
                 if (isCached) {
                      const cachedIndicator = document.createElement('div');
                      cachedIndicator.textContent = `⠀`; // Text indicating cache
                      cachedIndicator.style.fontSize = '0.7em';
                      cachedIndicator.style.color = '#8f98a0';
                      cachedIndicator.style.textAlign = 'center';
                      cachedIndicator.style.marginTop = '5px';
                       // Prepend to the temporary container
                       tempDiv.insertBefore(cachedIndicator, tempDiv.firstChild);
                 }

                 // Replace the *content* of the main container with the content from tempDiv
                 // This avoids removing and re-adding the container itself or the overlay
                 while(container.firstChild && container.firstChild !== loadingOverlay) {
                     container.removeChild(container.firstChild);
                 }
                 while(tempDiv.firstChild) {
                     container.insertBefore(tempDiv.firstChild, loadingOverlay); // Insert before the overlay if it exists
                 }


                  // Add the re-queue button if enabled, ENSURING IT DOESN'T ALREADY EXIST
                  // This part remains the same as it's added to badge_title_stats, not the enhanced_badge_details_container
                     if (isRequeueButtonEnabled) {
                          const badgeTitleStatsContainer = badgeRow.querySelector('.badge_title_stats');
                          // Check if a re-queue button already exists within this container
                          const existingRequeueButton = badgeTitleStatsContainer ? badgeTitleStatsContainer.querySelector('.requeue_button') : null;

                          if (badgeTitleStatsContainer && !existingRequeueButton) { // Only add if container exists and button doesn't exist
                               const requeueButton = document.createElement('div');
                               requeueButton.classList.add('requeue_button');
                               requeueButton.textContent = ' ↻​ ';
                               // Store the appId on the button for easy access in the event listener
                               requeueButton.dataset.appId = appId;
                               badgeTitleStatsContainer.appendChild(requeueButton);

                               // Add click listener to the button
                               requeueButton.addEventListener('click', handleRequeueClick);
                          } else if (!badgeTitleStatsContainer) {
                               console.warn(`Could not find .badge_title_stats container for App ID ${appId} to add re-queue button.`);
                          }
                     }


             } else {
                 console.error(`Could not find .enhanced_badge_details_container for App ID ${appId} during display.`);
             }
        });
    }


     // Event handler for the re-queue button
     function handleRequeueClick(event) {
         event.preventDefault(); // Prevent default link behavior
         event.stopPropagation(); // *** IMPORTANT: Stop click event from bubbling up ***

         const appId = parseInt(event.target.dataset.appId, 10);
         if (!isNaN(appId)) {
             console.log(`Manual re-queue requested for App ID: ${appId}`);
             removeCacheEntry(appId); // Remove the old cache entry
             queueAppIdForFetch(appId); // Add to the fetch queue
         } else {
             console.error("Could not get App ID from re-queue button data.");
         }
     }

    // Function to delete elements with class 'badge_title_stats_drops' and 'badge_title_stats_playtime'
    function deleteBadgeStats() {
        const dropsElements = document.querySelectorAll('.badge_title_stats_drops');
        dropsElements.forEach(element => {
            element.remove();
            // console.log("Removed element with class 'badge_title_stats_drops'"); // Too chatty
        });
        const playtimeElements = document.querySelectorAll('.badge_title_stats_playtime');
         playtimeElements.forEach(element => {
             element.remove();
             // console.log("Removed element with class 'badge_title_stats_playtime'"); // Too chatty
         });
    }


    // Initial setup: Collect all badge rows, display cached, and queue uncached/expired
    async function initialSetup() { // Make initialSetup async because it awaits openDatabase and getCacheEntry

         // Add the toggle buttons first
         addToggleButtons();

         // Check if the script is enabled AFTER adding toggle buttons
         if (!isScriptEnabled) {
             console.log("Steam Badge Enhancer is disabled. Toggle buttons are available.");
              // Still delete the unnecessary stats elements even if enhancement is disabled
             deleteBadgeStats();
             return; // Exit the function if disabled
         }

        console.log("Steam Badge Enhancer: Initial setup.");

         // --- Initialize IndexedDB ---
         try {
             await openDatabase();
         } catch (error) {
             console.error("Failed to open IndexedDB. Caching will not be available.", error);
             // Decide how to proceed if IndexedDB fails. For now, we'll continue
             // but caching functions will log warnings.
         }
         // --- End IndexedDB Initialization ---

        // Delete the unnecessary stats elements immediately
        deleteBadgeStats();


        const allBadgeRows = document.querySelectorAll('.badge_row.is_link');

        // Group badge rows by App ID
        allBadgeRows.forEach(badgeRow => {
            const appId = extractAppIdFromBadgeLink(badgeRow);
            if (appId) {
                if (!badgeRowsByAppId.has(appId)) {
                    badgeRowsByAppId.set(appId, []);
                }
                badgeRowsByAppId.get(appId).push(badgeRow);
            } else {
                 console.warn("Could not extract App ID from a badge row:", badgeRow);
            }
        });

         console.log(`Initial setup found ${badgeRowsByAppId.size} unique App IDs.`);

         const appIdsOnPage = new Set(badgeRowsByAppId.keys()); // Get all App IDs found on the page

         // Process App IDs on the page
         for (const appId of appIdsOnPage) { // Use for...of loop to allow await inside
             const rowsForApp = badgeRowsByAppId.get(appId);
             if (!rowsForApp || rowsForApp.length === 0) {
                  console.warn(`No rows found for App ID ${appId} during initial setup.`);
                  continue; // Skip if no rows found
             }

             // Add the initial container to each row immediately
             rowsForApp.forEach(badgeRow => {
                 const enhancedBadgeDetailsContainer = document.createElement('div');
                 enhancedBadgeDetailsContainer.classList.add('enhanced_badge_details_container');
                 // Add an initial indicator message
                 const initialIndicator = document.createElement('div');
                 initialIndicator.classList.add('initial_indicator');
                 initialIndicator.textContent = "Checking cache..."; // Initial state
                 enhancedBadgeDetailsContainer.appendChild(initialIndicator);
                 badgeRow.appendChild(enhancedBadgeDetailsContainer);
             });


             // Try to get cache entry from IndexedDB (async)
             const cachedEntry = await getCacheEntry(appId); // Await the IndexedDB get

             if (isCacheValid(cachedEntry)) {
                  console.log(`Found valid cache for App ID: ${appId}. Displaying immediately.`);
                 // Immediately display cached data
                 displayBadgeDetails(appId, rowsForApp, cachedEntry.steamsetsData, cachedEntry.craftedNormalInfo, cachedEntry.craftedFoilInfo, true);
                 // Queue for background refresh if cache is old but still valid
                 const now = Date.now();
                 if ((now - cachedEntry.timestamp) > (CACHE_EXPIRATION_MS / 2)) { // Example: refresh if cache is older than half the expiration time
                     console.log(`Cache for App ID ${appId} is older than half the expiration, queueing for background refresh.`);
                     queueAppIdForFetch(appId);
                 }


             } else {
                  console.log(`No valid cache for App ID: ${appId}. Queueing for fetch.`);
                 // Update indicator to reflect API loading
                 rowsForApp.forEach(badgeRow => {
                        const indicator = badgeRow.querySelector('.enhanced_badge_details_container .initial_indicator');
                        if(indicator) indicator.textContent = "Loading detailed badge data...";
                   });
                 // Queue for background fetching
                 queueAppIdForFetch(appId);
             }
         }

         // The processFetchQueue function will start automatically if the fetchQueue is not empty
    }


    // Run the initial setup when the page is loaded
    window.addEventListener('load', initialSetup);

})();
