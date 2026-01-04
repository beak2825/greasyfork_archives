// ==UserScript==
// @name         Steam Badge Info for Booster Creator
// @namespace    https://github.com/encumber/
// @version      1.29
// @description  Injects badge information into the booster creator page using a user-defined ID. Includes a favorites list using IndexedDB and Steam-styled controls. Caches SteamSets API data using IndexedDB with a 1-week timeout. Adds import/export for favorites. Displays badge unlock date if available.
// @author       Nitoned
// @match        https://steamcommunity.com/tradingcards/boostercreator/*
// @match        https://steamcommunity.com//tradingcards/boostercreator/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        indexedDB
// @downloadURL https://update.greasyfork.org/scripts/535434/Steam%20Badge%20Info%20for%20Booster%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/535434/Steam%20Badge%20Info%20for%20Booster%20Creator.meta.js
// ==/UserScript==

// ====================================================================
// === USER CONFIGURATION - EDIT THESE VALUES BEFORE SAVING SCRIPT ===
// ====================================================================

// IMPORTANT: Replace the placeholder value below with your actual Steam ID.
// This can be your custom URL name (e.g., 'myprofile') or your SteamID64 (e.g., '76561198012345678').
const USER_STEAM_ID = "client"; // <--- PUT YOUR STEAM ID HERE

// steamsets api key for listing all badge icons
// If you are getting 401 errors, double-check your key on the SteamSets website.
// It's possible the key expired, was revoked, or you copied it correctly.
const SteamSetsAPI = ""; // <--- PUT YOUR SteamSets API KEY HERE

// Set this to 'true' if the USER_STEAM_ID you entered is a SteamID64.
// Set this to 'false' if the USER_STEAM_ID you entered is a custom URL name.
const STEAM_ID_IS_STEAMID64 = false; // <--- SET TO true FOR STEAMID64, false FOR CUSTOM URL NAME

// Set this to 'true' to enable detailed logging messages in your browser's console.
// Set this to 'false' to disable all console logs from this script.
const ENABLE_CONSOLE_LOGS = true; // <--- SET TO true OR false FOR LOGGING - KEEP TRUE FOR NOW

// Default sort order for favorites ('appid_asc', 'appid_desc', 'foil_first', 'foil_last')
// This is saved using GM_setValue/GM_getValue
let currentFavoritesSortOrder = GM_getValue('favoritesSortOrder', 'appid_asc'); // Load saved sort order

// Cache timeout for SteamSets API data in milliseconds (1 week)
const API_CACHE_TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// ====================================================================
// === END USER CONFIGURATION - DO NOT EDIT BELOW THIS LINE UNLESS ===
// === YOU UNDERSTAND THE CODE                                     ===
// ====================================================================

(function() {
    'use strict';

    // --- Logging Helper ---
    function log(...args) {
        if (ENABLE_CONSOLE_LOGS) {
            console.log('[Steam Badge Info]', ...args);
        }
    }

    function logError(...args) {
         if (ENABLE_CONSOLE_LOGS) {
            console.error('[Steam Badge Info]', ...args);
        }
     }
    function logWarn(...args) {
         if (ENABLE_CONSOLE_LOGS) {
            console.warn('[Steam Badge Info]', ...args);
        }
     }
    function logDebug(...args) {
        if (ENABLE_CONSOLE_LOGS) {
            console.debug('[Steam Badge Info Debug]', ...args);
        }
    }
    // --- End Logging Helper ---

    // --- Global State for Scroll Back ---
    let scrollPositionBeforeUpdate = 0;
    let clickedFavoriteAppId = null; // Store the app ID of the clicked favorite
    let clickedFavoriteIsFoil = null; // Store the foil status of the clicked favorite
    // --- End Global State ---


    // --- IndexedDB Setup ---
    const DB_NAME = 'SteamBadgeCache';
    const API_CACHE_STORE_NAME = 'steamSetsBadges';
    const FAVORITES_STORE_NAME = 'favorites'; // New store for favorites
    const DB_VERSION = 2; // Version 2 includes the 'favorites' store
    let db = null;

    function openDatabase() {
        return new Promise((resolve, reject) => {
            if (db) {
                logDebug('Database already open, resolving.');
                resolve(db);
                return;
            }

            // Explicitly access indexedDB from the window object
            const browserIndexedDB = window.indexedDB || window.mozIndexedIndexedDB || window.webkitIndexedIndexedDB || window.msIndexedIndexedDB;

            if (!browserIndexedDB) {
                const error = new Error('IndexedDB is not supported in this environment.');
                logError('IndexedDB not supported:', error);
                reject(error);
                return;
            }

            logDebug(`Opening IndexedDB: ${DB_NAME} (Version ${DB_VERSION})`);
            const request = browserIndexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                logDebug(`IndexedDB upgrade needed: oldVersion=${event.oldVersion}, newVersion=${event.newVersion}`);

                // Create object store for API cache if it doesn't exist
                if (!db.objectStoreNames.contains(API_CACHE_STORE_NAME)) {
                    const apiStore = db.createObjectStore(API_CACHE_STORE_NAME, { keyPath: 'appId' });
                    logDebug(`IndexedDB upgrade: store "${API_CACHE_STORE_NAME}" created.`);
                } else {
                     logDebug(`IndexedDB upgrade: store "${API_CACHE_STORE_NAME}" already exists.`);
                }

                 // Create object store for favorites if it doesn't exist
                 if (!db.objectStoreNames.contains(FAVORITES_STORE_NAME)) {
                     // Favorites need a unique key, combination of appId and isFoil
                     const favoritesStore = db.createObjectStore(FAVORITES_STORE_NAME, { keyPath: 'id' });
                      // We can add indexes for easier querying if needed later, e.g., by appId
                      // favoritesStore.createIndex('appId', 'appId', { unique: false });
                      // favoritesStore.createIndex('isFoil', 'isFoil', { unique: false });
                     logDebug(`IndexedDB upgrade: store "${FAVORITES_STORE_NAME}" created.`);
                 } else {
                      logDebug(`IndexedDB upgrade: store "${FAVORITES_STORE_NAME}" already exists.`);
                 }
                 logDebug('IndexedDB upgrade finished.');
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                logDebug('IndexedDB opened successfully.');
                resolve(db);
            };

            request.onerror = (event) => {
                logError('IndexedDB error:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // --- API Cache Functions ---

    async function getCachedData(appId) {
        try {
            logDebug(`Attempting to get cached data for App ID ${appId}.`);
            const database = await openDatabase(); // <-- Ensure this resolves
            logDebug(`Database opened for getting cached data for App ID ${appId}.`);
            const transaction = database.transaction(API_CACHE_STORE_NAME, 'readonly');
            const store = transaction.objectStore(API_CACHE_STORE_NAME);
            const request = store.get(parseInt(appId));

            return new Promise((resolve, reject) => {
                request.onsuccess = (event) => {
                    const cachedItem = event.target.result;
                    if (cachedItem) {
                        const now = Date.now();
                        if (now - cachedItem.timestamp < API_CACHE_TIMEOUT_MS) {
                            logDebug(`API Cache hit for App ID ${appId}. Data is fresh.`);
                            resolve(cachedItem.data);
                        } else {
                            logDebug(`API Cache hit for App ID ${appId}, but data is stale. Will re-fetch.`);
                            resolve(null); // Data is stale
                        }
                    } else {
                         logDebug(`API Cache miss for App ID ${appId}.`);
                         resolve(null); // No cached item found
                    }
                };
                request.onerror = (event) => {
                    logError('Error getting data from API cache IndexedDB request:', event.target.error);
                    // Crucially, reject the promise here so the catch block in fetchAndDisplayBadgeList is triggered
                    reject(event.target.error);
                };
            });
        } catch (error) {
            logError('Error opening IndexedDB for API cache get:', error);
            // Crucially, re-throw or reject here so the catch block in fetchAndDisplayBadgeList is triggered
            throw error; // Re-throw the error
        }
    }

    async function cacheData(appId, data) {
        try {
            logDebug(`Attempting to cache data for App ID ${appId}.`);
            const database = await openDatabase(); // <-- Ensure this resolves
             logDebug(`Database opened for caching data for App ID ${appId}.`);
            const transaction = database.transaction(API_CACHE_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(API_CACHE_STORE_NAME);
            const itemToCache = {
                appId: parseInt(appId),
                timestamp: Date.now(),
                data: data
            };
            const request = store.put(itemToCache);

            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    logDebug(`Data for App ID ${appId} cached successfully.`);
                    resolve();
                };
                request.onerror = (event) => {
                    logError('Error caching data in API cache IndexedDB request:', event.target.error);
                     // Crucially, reject the promise here
                    reject(event.target.error);
                };
                 // Add transaction completion handler for additional logging
                 transaction.oncomplete = () => {
                     logDebug(`API cache transaction for App ID ${appId} completed.`);
                 };
                 transaction.onerror = (event) => {
                      logError(`API cache transaction for App ID ${appId} failed:`, event.target.error);
                 };
                 transaction.onabort = (event) => {
                      logWarn(`API cache transaction for App ID ${appId} aborted:`, event.target.error);
                 };
            });
        } catch (error) {
            logError('Error opening IndexedDB for API cache:', error);
             // Crucially, re-throw or reject here
            throw error; // Re-throw the error
        }
    }


     async function clearStaleApiCache() {
         try {
             const database = await openDatabase();
             const transaction = database.transaction(API_CACHE_STORE_NAME, 'readwrite');
             const store = transaction.objectStore(API_CACHE_STORE_NAME);
             const now = Date.now();

             const request = store.openCursor();
             request.onsuccess = (event) => {
                 const cursor = event.target.result;
                 if (cursor) {
                     if (now - cursor.value.timestamp > API_CACHE_TIMEOUT_MS) {
                         logDebug(`Deleting stale API cache for App ID ${cursor.value.appId}`);
                         cursor.delete();
                     }
                     cursor.continue();
                 } else {
                     logDebug('Finished clearing stale API cache.');
                 }
             };
             request.onerror = (event) => {
                 logError('Error clearing stale API cache:', event.target.error);
             };
         } catch (error) {
             logError('Error opening IndexedDB for clearing stale API cache:', error);
         }
     }


    // --- Favorites Functions (using IndexedDB) ---

    async function getFavorites() {
        logDebug('Attempting to get favorites from IndexedDB...');
        try {
            const database = await openDatabase();
            const transaction = database.transaction(FAVORITES_STORE_NAME, 'readonly');
            const store = transaction.objectStore(FAVORITES_STORE_NAME);
            const request = store.getAll(); // Get all items

            return new Promise((resolve, reject) => {
                request.onsuccess = (event) => {
                    const favorites = event.target.result || [];
                    logDebug('Successfully fetched favorites from IndexedDB:', favorites);
                    resolve(favorites);
                };
                request.onerror = (event) => {
                    logError('Error getting favorites from IndexedDB request:', event.target.error);
                    reject(event.target.error);
                };
            });
        } catch (error) {
            logError('Error opening IndexedDB for getting favorites:', error);
            // Resolve with empty array if database opening fails
            return [];
        }
    }

    async function toggleFavorite(badgeData) {
        logDebug('Attempting to toggle favorite:', badgeData);
        const favoriteId = `${badgeData.appId}_${badgeData.isFoil ? 'foil' : 'regular'}`;
        logDebug(`Generated favorite ID: ${favoriteId}`);

        try {
            const database = await openDatabase();
            const transaction = database.transaction(FAVORITES_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(FAVORITES_STORE_NAME);

            const getRequest = store.get(favoriteId); // Check if it exists

            getRequest.onsuccess = async (event) => {
                const existingFavorite = event.target.result;
                logDebug(`IndexedDB get result for ID ${favoriteId}:`, existingFavorite);

                if (existingFavorite) {
                    // Item exists, remove it
                    logDebug(`Favorite ${favoriteId} exists, attempting to delete.`);
                    const deleteRequest = store.delete(favoriteId);
                    deleteRequest.onsuccess = () => {
                         log(`Removed favorite: App ID ${badgeData.appId}, Foil: ${badgeData.isFoil}`);
                         displayFavorites(); // Refresh the displayed list
                    };
                    deleteRequest.onerror = (event) => {
                         logError('Error deleting favorite:', event.target.error);
                         // Even on delete error, try to refresh display
                         displayFavorites();
                    };
                } else {
                    // Item does not exist, add it
                    logDebug(`Favorite ${favoriteId} does not exist, attempting to add.`);
                    const newFavorite = {
                        id: favoriteId, // Add the unique ID
                        appId: badgeData.appId,
                        name: badgeData.name || 'Unknown Badge',
                        imageUrl: badgeData.imageUrl,
                        isFoil: badgeData.isFoil // Should already be boolean from createBadgeListItem
                    };
                     logDebug('New favorite data to add:', newFavorite);
                    const putRequest = store.put(newFavorite);
                    putRequest.onsuccess = () => {
                        log(`Added favorite: App ID ${badgeData.appId}, Foil: ${badgeData.isFoil}`);
                        displayFavorites(); // Refresh the displayed list
                    };
                     putRequest.onerror = (event) => {
                         logError('Error adding favorite:', event.target.error);
                          // Even on add error, try to refresh display
                         displayFavorites();
                     };
                }
            };

            getRequest.onerror = (event) => {
                 logError('Error checking for existing favorite in IndexedDB:', event.target.error);
                 // If checking fails, we can't proceed, but let's still try to display current state
                 displayFavorites();
            };

        } catch (error) {
            logError('Error opening IndexedDB for toggling favorite:', error);
            // If opening fails, we can't proceed, but let's still try to display current state
            displayFavorites();
        }
    }


     function sortFavorites(favorites, order) {
        switch (order) {
            case 'appid_asc':
                return favorites.sort((a, b) => parseInt(a.appId) - parseInt(b.appId));
            case 'appid_desc':
                return favorites.sort((a, b) => parseInt(b.appId) - parseInt(a.appId));
            case 'foil_first':
                // Changed sort order based on the dropdown text
                return favorites.sort((a, b) => {
                    if (a.isFoil !== b.isFoil) {
                        return a.isFoil ? -1 : 1; // true (foil) comes before false (non-foil)
                    }
                    return parseInt(a.appId) - parseInt(b.appId); // Secondary sort by appid
                });
            case 'foil_last':
                 // Changed sort order based on the dropdown text
                 return favorites.sort((a, b) => {
                    if (a.isFoil !== b.isFoil) {
                        return a.isFoil ? 1 : -1; // false (non-foil) comes before true (foil)
                    }
                    return parseInt(a.appId) - parseInt(a.appId); // Secondary sort by appid
                });
            default:
                return favorites; // Default to appid_asc if unknown order
        }
     }


        async function displayFavorites() {
        logDebug('Attempting to display favorites...');
        const favoritesContainer = document.querySelector('.favorites-container');
        if (!favoritesContainer) {
            logWarn('Favorites container not found. Cannot display favorites.');
            return;
        }

        // Find or create the items wrapper
        let itemsWrapper = favoritesContainer.querySelector('.favorites-items-wrapper');
        if (!itemsWrapper) {
             logDebug('Favorites items wrapper not found, creating.');
            itemsWrapper = document.createElement('div');
            itemsWrapper.className = 'favorites-items-wrapper';
            favoritesContainer.appendChild(itemsWrapper);
        }
         itemsWrapper.innerHTML = ''; // Clear current items

        try {
            const favorites = await getFavorites(); // Get favorites asynchronously
            logDebug(`Fetched ${favorites.length} favorites for display.`);
            const sortedFavorites = sortFavorites([...favorites], currentFavoritesSortOrder); // Sort a copy

            if (sortedFavorites.length === 0) {
                itemsWrapper.textContent = 'No favorites added yet. Click a badge below to add it!';
                 itemsWrapper.style.color = '#B8B6B4';
                 itemsWrapper.style.textAlign = 'center';
                 itemsWrapper.style.width = '100%';
                 itemsWrapper.style.marginTop = '10px';
                 itemsWrapper.style.minHeight = '100px'; // Give it a minimum height even when empty
            } else {
                 itemsWrapper.style.color = ''; // Reset styles
                 itemsWrapper.style.textAlign = '';
                 itemsWrapper.style.width = '';
                 itemsWrapper.style.marginTop = '';
                 itemsWrapper.style.minHeight = ''; // Remove min-height when populated

                sortedFavorites.forEach(fav => {
                    itemsWrapper.appendChild(createFavoriteItemElement(fav));
                });
            }
             logDebug(`Successfully displayed ${sortedFavorites.length} favorites.`);

             // After displaying favorites, check if we need to scroll back
             // Add a 1-second delay before attempting to scroll
             if (clickedFavoriteAppId !== null) {
                 logDebug('Clicked favorite detected. Waiting 1 second before scrolling back.');
                 setTimeout(() => {
                     scrollToClickedFavorite();
                 }, 1000); // 1000 milliseconds = 1 second
             }


        } catch (error) {
             logError('Error displaying favorites:', error);
             itemsWrapper.textContent = 'Error loading favorites.';
             itemsWrapper.style.color = 'red';
             itemsWrapper.style.textAlign = 'center';
             itemsWrapper.style.width = '100%';
             itemsWrapper.style.marginTop = '10px';
              itemsWrapper.style.minHeight = '100px'; // Give it a minimum height
        }
    }

     function scrollToClickedFavorite() {
         if (clickedFavoriteAppId === null) {
             logDebug('No favorite item click recorded to scroll back to.');
             return;
         }

         logDebug(`Attempting to scroll back to favorite App ID ${clickedFavoriteAppId}, Foil: ${clickedFavoriteIsFoil}`);

         // Find the element corresponding to the clicked favorite
         const selector = `.favorite-item[data-appid="${clickedFavoriteAppId}"][data-is-foil="${clickedFavoriteIsFoil}"]`;
         const clickedElement = document.querySelector(selector);

         if (clickedElement) {
             logDebug('Found clicked favorite element, scrolling into view.');
             // Use scrollIntoView with options for smoother scrolling
             clickedElement.scrollIntoView({
                 behavior: 'smooth', // Use smooth scrolling
                 block: 'center'    // Align the element to the center of the viewport
             });
         } else {
             logWarn(`Clicked favorite element not found after update: ${selector}`);
             // If the element wasn't found (e.g., it was just deleted),
             // we could potentially scroll back to the saved scroll position,
             // but scrolling into view of the item is generally better.
             // For now, just log a warning.
         }

         // Reset the global state after attempting to scroll
         clickedFavoriteAppId = null;
         clickedFavoriteIsFoil = null;
         scrollPositionBeforeUpdate = 0; // Reset scroll position too
     }


    // --- Import/Export Functions ---

    async function exportFavorites() {
        logDebug('Attempting to export favorites...');
        try {
            const favorites = await getFavorites();
            // Exclude the 'id' field for cleaner export, as it's derived
            const exportableFavorites = favorites.map(fav => ({
                 appId: fav.appId,
                 name: fav.name,
                 imageUrl: fav.imageUrl,
                 isFoil: fav.isFoil
            }));
            const jsonString = JSON.stringify(exportableFavorites, null, 2); // Pretty print JSON

            // Display the JSON to the user
            displayExportJson(jsonString);

        } catch (error) {
            logError('Error exporting favorites:', error);
            alert('Error exporting favorites. Check console for details.');
        }
    }

    function displayExportJson(jsonString) {
        // Create a modal-like overlay or inject into a dedicated area
        let exportArea = document.getElementById('favorites-export-area');
        if (!exportArea) {
            exportArea = document.createElement('div');
            exportArea.id = 'favorites-export-area';
            exportArea.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
                background: #1b2838; /* Steam dark background */
                border: 1px solid #333;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                color: #B8B6B4;
                width: 80%;
                max-width: 600px;
                max-height: 80%;
                overflow-y: auto;
            `;
            document.body.appendChild(exportArea);

            const closeButton = document.createElement('span');
            closeButton.textContent = 'X';
            closeButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 18px;
                cursor: pointer;
                color: #B8B6B4;
            `;
            closeButton.onclick = () => exportArea.remove();
            exportArea.appendChild(closeButton);

             const title = document.createElement('h3');
             title.textContent = 'Exported Favorites (Copy Below)';
             title.style.color = '#8BC53F';
             title.style.marginTop = '0';
             exportArea.appendChild(title);

            const textArea = document.createElement('textarea');
            textArea.style.cssText = `
                width: 100%;
                height: 200px;
                margin-top: 10px;
                background: #000;
                color: #B8B6B4;
                border: 1px solid #333;
                padding: 10px;
                resize: vertical;
                font-family: monospace;
            `;
            textArea.value = jsonString;
            exportArea.appendChild(textArea);

             // Select text on focus for easy copying
             textArea.onfocus = () => {
                 textArea.select();
             };
             // Also select on click for mobile or quick copy
             textArea.onclick = () => {
                  textArea.select();
             };


        } else {
             // If area already exists, just update the text area content
             const textArea = exportArea.querySelector('textarea');
             if (textArea) {
                 textArea.value = jsonString;
                 textArea.focus();
                 textArea.select(); // Select for easy copying
             }
             exportArea.style.display = 'block'; // Show if hidden
        }
    }


    function showImportArea() {
         // Create a modal-like overlay or inject into a dedicated area
         let importArea = document.getElementById('favorites-import-area');
         if (!importArea) {
             importArea = document.createElement('div');
             importArea.id = 'favorites-import-area';
             importArea.style.cssText = `
                 position: fixed;
                 top: 50%;
                 left: 50%;
                 transform: translate(-50%, -50%);
                 z-index: 1000;
                 background: #1b2838; /* Steam dark background */
                 border: 1px solid #333;
                 padding: 20px;
                 border-radius: 5px;
                 box-shadow: 0 0 20px rgba(0,0,0,0.5);
                 color: #B8B6B4;
                 width: 80%;
                 max-width: 600px;
                 max-height: 80%;
                 overflow-y: auto;
             `;
             document.body.appendChild(importArea);

             const closeButton = document.createElement('span');
             closeButton.textContent = 'X';
             closeButton.style.cssText = `
                 position: absolute;
                 top: 10px;
                 right: 10px;
                 font-size: 18px;
                 cursor: pointer;
                 color: #B8B6B4;
             `;
             closeButton.onclick = () => importArea.remove();
             importArea.appendChild(closeButton);

             const title = document.createElement('h3');
             title.textContent = 'Import Favorites (Paste JSON Below)';
             title.style.color = '#8BC53F';
             title.style.marginTop = '0';
             importArea.appendChild(title);

             const textArea = document.createElement('textarea');
             textArea.id = 'favorites-import-textarea';
             textArea.style.cssText = `
                 width: 100%;
                 height: 200px;
                 margin-top: 10px;
                 background: #000;
                 color: #B8B6B4;
                 border: 1px solid #333;
                 padding: 10px;
                 resize: vertical;
                 font-family: monospace;
             `;
             importArea.appendChild(textArea);

             const importButton = document.createElement('button');
             importButton.className = 'btn_green_steamui btn_medium'; // Steam button style
             importButton.style.marginTop = '15px';
             importButton.textContent = 'Import Favorites';
             importButton.onclick = () => importFavoritesFromTextarea();
             importArea.appendChild(importButton);

             const warning = document.createElement('p');
              warning.style.fontSize = '11px';
              warning.style.color = '#ff6600'; // Orange color
              warning.textContent = 'Warning: Importing favorites will add them to your existing list. Duplicate items will be updated.';
              importArea.appendChild(warning);

         } else {
              // If area already exists, clear textarea and show
              const textArea = importArea.querySelector('textarea');
              if (textArea) {
                  textArea.value = '';
              }
              importArea.style.display = 'block'; // Show if hidden
         }
    }


    async function importFavoritesFromTextarea() {
        logDebug('Attempting to import favorites from textarea...');
        const importArea = document.getElementById('favorites-import-area');
        const textArea = document.getElementById('favorites-import-textarea');
        if (!textArea || !importArea) {
            logError('Import area or textarea not found.');
            return;
        }

        const jsonString = textArea.value.trim();
        if (!jsonString) {
            alert('Please paste the JSON data into the text area.');
            return;
        }

        try {
            const importedData = JSON.parse(jsonString);

            if (!Array.isArray(importedData)) {
                alert('Import failed: Data is not a valid JSON array.');
                logError('Import failed: Data is not an array.', importedData);
                return;
            }

            const validFavorites = importedData.filter(item =>
                item &&
                (typeof item.appId === 'number' || typeof item.appId === 'string') &&
                typeof item.name === 'string' &&
                typeof item.imageUrl === 'string' &&
                typeof item.isFoil === 'boolean'
            ).map(item => ({
                 // Ensure appId is string for consistency with ID generation
                 appId: String(item.appId),
                 name: item.name,
                 imageUrl: item.imageUrl,
                 isFoil: item.isFoil,
                 // Re-generate the ID for consistency and uniqueness in the DB
                 id: `${String(item.appId)}_${item.isFoil ? 'foil' : 'regular'}`
            }));

            if (validFavorites.length === 0) {
                alert('Import failed: No valid favorite items found in the data.');
                logError('Import failed: No valid favorite items found after filtering.', importedData);
                return;
            }

            logDebug(`Attempting to add ${validFavorites.length} valid favorites to IndexedDB.`);

            const database = await openDatabase();
            const transaction = database.transaction(FAVORITES_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(FAVORITES_STORE_NAME);

            let addedCount = 0;
            let errorCount = 0;

            validFavorites.forEach(fav => {
                const request = store.put(fav); // Use put to add or update
                request.onsuccess = () => {
                     addedCount++;
                };
                request.onerror = (event) => {
                    logError(`Error adding/updating favorite ${fav.id} during import:`, event.target.error);
                    errorCount++;
                };
            });

             transaction.oncomplete = () => {
                 log(`Import transaction complete. Processed: ${validFavorites.length}, Errors: ${errorCount}`);
                 alert(`Import complete!\nProcessed: ${validFavorites.length}\nErrors: ${errorCount}\n(Note: Existing items with the same App ID and Foil status were updated.)`);
                 importArea.remove(); // Close modal after import
                 displayFavorites(); // Refresh displayed list
             };
             transaction.onerror = (event) => {
                 logError('Import transaction failed:', event.target.error);
                 alert(`Import failed: Transaction error. Check console.`);
                 // Keep modal open to show error? Or close? Let's close for now.
                 importArea.remove();
                 displayFavorites(); // Still try to refresh display
             };
             transaction.onabort = (event) => {
                 logWarn('Import transaction aborted:', event.target.error);
                 alert(`Import aborted. Check console.`);
                 importArea.remove();
                 displayFavorites(); // Still try to refresh display
             };


        } catch (error) {
            logError('Error parsing or processing imported JSON:', error);
            alert(`Import failed: Invalid JSON format or processing error.\nDetails: ${error.message}. Check console for more details.`);
        }
    }


    // --- End Import/Export Functions ---


    const style = `
        .badge-container {
            display: flex;
            gap: 40px;
            margin-top: 20px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
            justify-content: center;
            min-height: 180px; /* Placeholder height for badge container */
            align-items: center; /* Center content vertically during loading */
        }

        .badge-list-container, .favorites-container {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
            justify-content: flex-start; /* Align items to the start */
            flex-wrap: wrap;
            align-items: flex-start; /* Align rows to the start */
            min-height: 200px; /* Placeholder height for list containers */
            align-content: flex-start; /* Align rows to the start during loading */
        }

        .favorites-container {
            margin-top: 20px; /* Space above favorites */
            flex-direction: column; /* Stack controls and items */
        }

        .favorites-controls {
             display: flex;
             gap: 10px;
             margin-bottom: 10px;
             align-items: center;
             flex-wrap: wrap; /* Allow controls to wrap on smaller screens */
             /* Added to push groups to edges */
             justify-content: space-between;
             width: 100%; /* Ensure it takes full width */
        }

        /* Group sort controls */
        .favorites-controls .sort-group {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        /* Group import/export buttons */
         .favorites-controls .button-group {
            display: flex;
            gap: 10px;
            align-items: center;
         }


        .favorites-controls label {
            color: #B8B6B4;
            font-size: 12px;
        }

         /* --- Steam-like Dropdown Styling --- */
        .favorites-controls .btn_grey_black {
            padding: 0 8px; /* Adjust padding */
            height: 24px; /* Adjust height */
            line-height: 24px; /* Center text vertically */
            font-size: 12px; /* Match label font size */
            position: relative; /* Needed for arrow positioning */
            cursor: pointer;
            background: linear-gradient( to right, #333, #444 ); /* Darker gradient */
            border-radius: 3px;
            border: none; /* Remove default border */
            color: #B8B6B4;
            text-shadow: none; /* Remove default text shadow */
            /* Added min-width to ensure text visibility */
            min-width: 150px; /* Adjust as needed based on longest option text */
            display: inline-block; /* Ensure it behaves like a block for width */
            box-sizing: border-box; /* Include padding and border in element's total width and height */
        }

        .favorites-controls .btn_grey_black select {
            -webkit-appearance: none; /* Remove default dropdown arrow */
            -moz-appearance: none;
            appearance: none;
            background: transparent; /* Make select background transparent */
            border: none;
            padding: 0;
            margin: 0;
            color: #B8B6B4;
            font-size: 12px;
            cursor: pointer;
            outline: none; /* Remove focus outline */
            width: 100%; /* Take full width of parent button */
            height: 100%; /* Take full height of parent button */
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2; /* Place select above the custom arrow */
             padding-right: 20px; /* Add padding on the right to make space for the arrow */
        }

        /* Custom arrow */
        .favorites-controls .btn_grey_black::after {
            content: '▼'; /* Unicode down arrow */
            position: absolute;
            top: 50%;
            right: 5px; /* Position arrow */
            transform: translateY(-50%);
            font-size: 8px; /* Smaller arrow */
            color: #B8B6B4;
            pointer-events: none; /* Allow clicks to pass through to select */
            z-index: 1; /* Place arrow below select */
        }

        /* Hover effect for the button */
        .favorites-controls .btn_grey_black:hover {
            background: linear-gradient( to right, #444, #555 ); /* Lighter gradient on hover */
            color: #CFCFCF;
        }

        /* Focus effect for the button */
        .favorites-controls .btn_grey_black:focus-within {
             outline: 1px solid #8BC53F; /* Green outline on focus */
        }

         .favorites-controls .btn_grey_black option {
             background-color: #333; /* Background for dropdown options */
             color: #B8B6B4;
         }

        /* --- End Steam-like Dropdown Styling --- */

         /* --- Import/Export Button Styling --- */
         .favorites-controls .steam-button {
             display: inline-block;
             padding: 0 15px;
             height: 24px;
             line-height: 24px;
             font-size: 12px;
             text-decoration: none;
             text-align: center;
             cursor: pointer;
             border-radius: 3px;
             border: none;
             color: #B8B6B4;
             background: linear-gradient( to right, #333, #444 );
             box-sizing: border-box;
         }

         .favorites-controls .steam-button:hover {
             background: linear-gradient( to right, #444, #555 );
             color: #CFCFCF;
         }

         .favorites-controls .steam-button:active {
             background: linear-gradient( to right, #222, #333 );
             color: #B8B6B4;
         }
        /* --- End Import/Export Button Styling --- */


        .favorites-items-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 20px; /* Gap between items */
            width: 100%; /* Take full width of container */
        }

        .badge-box, .badge-list-box, .favorite-item {
            flex: 0 0 calc(16.666% - 17px); /* Calculate width for 6 items per row, adjusting for gap */
            text-align: center;
            padding: 15px;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.1);
            min-width: 100px;
            max-width: 150px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            cursor: pointer; /* Indicate clickable */
            transition: background-color 0.2s ease; /* Smooth hover effect */
        }

         .favorite-item {
             flex: 0 0 calc(16.666% - 17px); /* Ensure 6 items per row */
             cursor: pointer;
         }

        .badge-box:hover, .badge-list-box:hover, .favorite-item:hover {
            background-color: rgba(255, 255, 255, 0.05); /* Subtle hover effect */
        }


        .badge-box.foil, .badge-list-box.foil, .favorite-item.foil {
            background: linear-gradient(
                45deg,
                rgba(0, 0, 0, 0.1) 0%,
                rgba(255, 255, 255, 0.1) 50%,
                rgba(0, 0, 0, 0.1) 100%
            );
            animation: shine 3000s linear infinite;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 15px rgba(255, 255, 245, 0.1);
        }
        @keyframes shine {
            0% {
                background-position: -200% center;
            }
            100% {
                background-position: 200% center;
            }
        }
        .badge-title, .badge-list-title, .favorite-title {
            margin-bottom: 10px;
            color: #8BC53F;
            font-weight: bold;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
        }
        .badge-image, .badge-list-image, .favorite-image {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
            flex-shrink: 0;
        }
        .badge_empty_circle, .badge_list_empty_circle, .favorite_empty_circle {
            width: 80px;
            height: 80px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            margin: 0 auto;
             flex-shrink: 0;
        }

        .badge-link, .badge-list-link, .favorite-link {
            text-decoration: none;
            color: inherit;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 80px;
            box-sizing: border-box;
            margin-bottom: 5px;
        }

        .badge-level, .badge-list-scarcity, .favorite-appid {
            margin-top: 10px;
            color: #B8B6B4;
            font-size: 12px;
        }
         .badge-list-level { /* New style for level in the list */
            margin-top: 4px;
            color: #8BC53F;
            font-size: 11px;
         }
         .foil .badge-list-level {
             color: #CFE6F5;
         }

        .badge-link:hover, .badge-list-link:hover {
            opacity: 0.8;
        }
        .foil .badge-title, .foil .badge-list-title, .foil .favorite-title {
            color: #CFE6F5;
            text-shadow: 0 0 5px rgba(207, 230, 245, 0.5);
        }
        .badge-progress {
            margin-top: 8px;
            color: #B8B6B4;
            font-size: 12px;
        }
        .badge-sets {
            margin-top: 4px;
            color: #8BC53F;
            font-size: 12px;
        }
        .foil .badge-sets {
            color: #CFE6F5;
        }
        .badge-list-scarcity, .favorite-appid {
            margin-top: auto;
            font-size: 11px;
            color: #B8B6B4;
        }

        /* New style for unlocked info */
        .badge-unlocked {
            margin-top: 4px; /* Space below progress */
            color: #B8B6B4;
            font-size: 11px; /* Slightly smaller font */
        }


        /* Styles for Import/Export Modals */
        #favorites-export-area, #favorites-import-area {
             /* Added styles in the JS function for positioning and basics */
             /* Add more specific styles here if needed */
        }

    `;

    function addStyle(css) {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = css;
        // Ensure document.head is available before appending
        if (document.head) {
            document.head.appendChild(styleSheet);
        } else {
            // Fallback if head is not available immediately
            document.documentElement.appendChild(styleSheet);
        }
    }

    function getAppId() {
        const url = window.location.href;
        const match = url.match(/\d+$/);
        return match ? match[0] : null;
    }

    function parseBadgeData(html, isFoil, userId, isSteamId64, appId) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Find the main badge info container first for more precise selection
        // Look for a common parent like .badge_row or .badge_info
        const mainBadgeInfoArea = doc.querySelector('.badge_row, .badge_info'); // Use comma to try multiple selectors
        const context = mainBadgeInfoArea || doc; // Use the main area if found, otherwise the whole doc

        const badgeImage = context.querySelector('.badge_info_image .badge_icon');
        const badgeName = context.querySelector('.badge_info_title');
        const badgeLevel = context.querySelector('.badge_info_description'); // This might contain "Level X" or other text

         // <--- Refined: Get unlocked element within the badge_empty_right div inside the context --->
         const badgeEmptyRight = context.querySelector('.badge_empty_right');
         const badgeUnlocked = badgeEmptyRight ? badgeEmptyRight.querySelector('.badge_info_unlocked') : null;
         // <--- End Refined --->


        const cardElements = doc.querySelectorAll('.badge_card_set_card'); // Card elements are usually in the same doc
        const cardQuantities = [];
        const cardInfo = []; // To store card name and quantity together

        cardElements.forEach(cardElement => {
            const qtyElement = cardElement.querySelector('.badge_card_set_text_qty');
            const nameElement = cardElement.querySelector('.badge_card_set_text_cardname');

            const quantityMatch = qtyElement ? qtyElement.textContent.match(/\((\d+)\)/) : null;
            const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 0; // Treat empty quantity as 0
            cardQuantities.push(quantity);

            const name = nameElement ? nameElement.textContent.trim() : 'Unknown Card';
            cardInfo.push({ name: name, quantity: quantity });
        });

        logDebug(`${isFoil ? 'Foil' : 'Regular'} Badge Cards Found:`);
        logDebug(cardInfo); // Use logDebug for potentially large data

        const totalCards = cardElements.length;
        const completeSets = cardQuantities.length > 0 ? Math.min(...cardQuantities) : 0;
        const ownedCards = cardQuantities.filter(qty => qty > 0).length;

        logDebug(`${isFoil ? 'Foil' : 'Regular'} Badge Summary:`);
        logDebug(`  Total Cards in Set: ${totalCards}`);
        logDebug(`  Owned Card Types: ${ownedCards}`);
        logDebug(`  Complete Sets: ${completeSets}`);

        const levelMatch = badgeLevel ? badgeLevel.textContent.match(/Level (\d+)/) : null;

        // Construct the badge URL using the provided ID and type
        const badgeBaseUrl = userId ? `https://steamcommunity.com/${isSteamId64 ? 'profiles' : 'id'}/${userId}/gamecards/${appId}` : null;
        const badgeUrl = badgeBaseUrl ? `${badgeBaseUrl}${isFoil ? '?border=1' : ''}` : null;

        return {
            imageUrl: badgeImage ? badgeImage.src : null,
            name: badgeName ? badgeName.textContent.trim() : null,
            level: levelMatch ? levelMatch[1] : null,
            badgeUrl: badgeUrl,
            cardProgress: {
                owned: ownedCards,
                total: totalCards,
                completeSets: completeSets
            },
            unlockedInfo: badgeUnlocked ? badgeUnlocked.textContent.trim() : null // Extract unlocked info
        };
    }

    function createBadgeElement(badgeData, isFoil) {
        const badgeBox = document.createElement('div');
        badgeBox.className = `badge-box ${isFoil ? 'foil' : ''}`;

        const title = document.createElement('div');
        title.className = 'badge-title';
        title.textContent = isFoil ? 'Foil Badge' : 'Regular Badge';
        badgeBox.appendChild(title);

        const link = document.createElement('a');
        link.className = 'badge-link';
        if (badgeData.badgeUrl) {
            link.href = badgeData.badgeUrl;
             link.target = '_blank'; // Open link in a new tab
        } else {
             link.style.cursor = 'default';
        }

        if (badgeData.imageUrl) {
            const image = document.createElement('img');
            image.className = 'badge-image';
            image.src = badgeData.imageUrl;
            image.alt = badgeData.name || 'Badge Image'; // Add alt text
            link.appendChild(image);
        } else {
            const emptyCircle = document.createElement('div');
            emptyCircle.className = 'badge_empty_circle';
            link.appendChild(emptyCircle);
        }

        badgeBox.appendChild(link);

        if (badgeData.level) {
            const level = document.createElement('div');
            level.className = 'badge-level';
            level.textContent = `Level ${badgeData.level}`;
            badgeBox.appendChild(level);
        }

        if (badgeData.cardProgress) {
            const progress = document.createElement('div');
            progress.className = 'badge-progress';
            if (badgeData.cardProgress.total > 0) {
                 if (badgeData.cardProgress.owned === 0 || badgeData.cardProgress.owned === badgeData.cardProgress.total) {
                    progress.textContent = ''; // No progress text if 0/total or total/total
                } else {
                    progress.textContent = `${badgeData.cardProgress.owned}/${badgeData.cardProgress.total} Cards`;
                }

                if (badgeData.cardProgress.completeSets > 0) {
                    const sets = document.createElement('div');
                    sets.className = 'badge-sets';
                    sets.textContent = `${badgeData.cardProgress.completeSets} Complete ${badgeData.cardProgress.completeSets === 1 ? 'Set' : 'Sets'}`;
                    progress.appendChild(sets);
                }
            } else {
                 progress.textContent = 'No cards in this set';
            }

            badgeBox.appendChild(progress);
        }

        // Add unlocked info below progress
        if (badgeData.unlockedInfo) {
             const unlocked = document.createElement('div');
             unlocked.className = 'badge-unlocked';
             unlocked.textContent = badgeData.unlockedInfo;
             badgeBox.appendChild(unlocked);
        }


        return badgeBox;
    }

    function createBadgeListItem(badgeData) {
        const badgeListBox = document.createElement('div');
        badgeListBox.className = `badge-list-box ${badgeData.isFoil ? 'foil' : ''}`;
        // Store data attributes for easy access when clicking
        badgeListBox.dataset.appid = badgeData.appId;
        badgeListBox.dataset.badgeImage = badgeData.badgeImage;
        badgeListBox.dataset.isFoil = badgeData.isFoil;
        badgeListBox.dataset.name = badgeData.name || 'Unknown Badge';

        const title = document.createElement('div');
        title.className = 'badge-list-title';
        title.textContent = badgeData.name || 'Unknown Badge';
        badgeListBox.appendChild(title);

        const link = document.createElement('a');
        link.className = 'badge-list-link';
        link.style.cursor = 'pointer'; // Make it look clickable

        let badgeImageUrl = null;
        if (badgeData.appId && badgeData.badgeImage &&
            (typeof badgeData.appId === 'number' || typeof badgeData.appId === 'string') &&
            typeof badgeData.badgeImage === 'string' && badgeData.badgeImage.length > 0) {

            badgeImageUrl = `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/${badgeData.appId}/${badgeData.badgeImage}`;
            badgeListBox.dataset.imageUrl = badgeImageUrl; // Store image URL

            const image = document.createElement('img');
            image.className = 'badge-list-image';
            image.src = badgeImageUrl;
            image.alt = badgeData.name || 'Badge Image';
            image.onerror = () => {
                logError(`Failed to load constructed image for badge list item: ${badgeData.name} from URL: ${badgeImageUrl}`);
                link.innerHTML = '';
                const emptyCircle = document.createElement('div');
                emptyCircle.className = 'badge_list_empty_circle';
                link.appendChild(emptyCircle);
                 badgeListBox.dataset.imageUrl = ''; // Clear failed image URL
            };
            link.appendChild(image);

        } else {
            const emptyCircle = document.createElement('div');
            emptyCircle.className = 'badge_list_empty_circle';
            link.appendChild(emptyCircle);
             badgeListBox.dataset.imageUrl = ''; // Store empty image URL
        }

        badgeListBox.appendChild(link);

        // Display scarcity
        const scarcity = document.createElement('div');
        scarcity.className = 'badge-list-scarcity';
        if (badgeData.scarcity !== undefined && badgeData.scarcity !== null) {
            scarcity.textContent = `Scarcity: ${badgeData.scarcity.toFixed(0)}`; // Format scarcity to 0 decimal places
             if (badgeData.isFoil) {
                 scarcity.style.color = '#CFE6F5'; // Foil color for foil scarcity
             }
        } else {
             scarcity.textContent = badgeData.isFoil ? 'Scarcity (Foil): N/A' : 'Scarcity: N/A'; // Indicate foil or N/A
             scarcity.style.fontStyle = 'italic';
             scarcity.style.color = badgeData.isFoil ? '#CFE6F5' : '#666'; // Foil color or grey for N/A
        }
        badgeListBox.appendChild(scarcity);

        // Display level for non-foil badges if available
        if (!badgeData.isFoil && badgeData.highestLevel !== undefined && badgeData.highestLevel !== null) {
            const level = document.createElement('div');
            level.className = 'badge-list-level';
            level.textContent = `Level ${badgeData.highestLevel}`;
            badgeListBox.appendChild(level);
        }


        // Add click listener to save/remove from favorites
        badgeListBox.addEventListener('click', () => {
            toggleFavorite({
                appId: badgeData.appId,
                name: badgeData.name || 'Unknown Badge',
                imageUrl: badgeListBox.dataset.imageUrl, // Use stored URL
                isFoil: badgeData.isFoil === 'true' || badgeData.isFoil === true // Ensure boolean
            });
        });


        return badgeListBox;
    }

     function createFavoriteItemElement(favoriteData) {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = `favorite-item ${favoriteData.isFoil ? 'foil' : ''}`;
        favoriteItem.dataset.appid = favoriteData.appId;
        favoriteItem.dataset.isFoil = favoriteData.isFoil;

        const title = document.createElement('div');
        title.className = 'favorite-title';
        title.textContent = favoriteData.name || `App ${favoriteData.appId}`;
        favoriteItem.appendChild(title);

        const link = document.createElement('a');
        link.className = 'favorite-link';
        link.href = `#${favoriteData.appId}`; // Set the URL hash
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior

            // --- Store scroll position and clicked item info ---
            scrollPositionBeforeUpdate = window.scrollY || document.documentElement.scrollTop;
            clickedFavoriteAppId = favoriteData.appId;
            clickedFavoriteIsFoil = favoriteData.isFoil;
            logDebug(`Clicked favorite item: App ID ${clickedFavoriteAppId}, Foil: ${clickedFavoriteIsFoil}. Saved scroll position: ${scrollPositionBeforeUpdate}`);
            // --- End Store ---

            // Change the URL hash without a full page reload
            window.location.hash = `${favoriteData.appId}`;
             // Manually trigger the update as hash change might not trigger MutationObserver reliably across all browsers/frameworks
            setTimeout(updateBadgeInfo, 100); // Add a small delay
        });


        if (favoriteData.imageUrl) {
            const image = document.createElement('img');
            image.className = 'favorite-image';
            image.src = favoriteData.imageUrl;
            image.alt = favoriteData.name || 'Badge Image';
             image.onerror = () => {
                logError(`Failed to load image for favorite item: ${favoriteData.name} from URL: ${favoriteData.imageUrl}`);
                link.innerHTML = ''; // Clear any failed image
                const emptyCircle = document.createElement('div');
                emptyCircle.className = 'favorite_empty_circle';
                link.appendChild(emptyCircle);
            };
            link.appendChild(image);
        } else {
            const emptyCircle = document.createElement('div');
            emptyCircle.className = 'favorite_empty_circle';
            link.appendChild(emptyCircle);
        }

        favoriteItem.appendChild(link);

        const appidElement = document.createElement('div');
        appidElement.className = 'favorite-appid';
        appidElement.textContent = `App ID: ${favoriteData.appId}`;
         if (favoriteData.isFoil) {
             const foilIndicator = document.createElement('span');
             foilIndicator.textContent = ' (Foil)';
             foilIndicator.style.color = '#CFE6F5';
             appidElement.appendChild(foilIndicator);
         }
        favoriteItem.appendChild(appidElement);

         // Add a click listener specifically for removing the item
         // This listener is on the item itself. We now check if the clicked
         // element is the title or part of the link before removing.
        favoriteItem.addEventListener('click', (event) => {
             const clickedElement = event.target;
             // Check if the clicked element is the title OR is inside the link
             const isTitle = clickedElement.classList.contains('favorite-title');
             const isInsideLink = clickedElement.closest('.favorite-link');
             const isAppID = clickedElement.closest('.favorite-appid');

             if (!isTitle && !isInsideLink && !isAppID) {
                 logDebug('Clicked outside the title and link, attempting to remove favorite.');
                 toggleFavorite({
                     appId: favoriteData.appId,
                     name: favoriteData.name,
                     imageUrl: favoriteData.imageUrl,
                     isFoil: favoriteData.isFoil
                 });
             } else if (isTitle) {
                  logDebug('Clicked on the favorite title, not removing favorite.');
             } else if (isInsideLink) {
                  logDebug('Clicked on the favorite link, not removing favorite.');
             }else if (isAppID) {
                  logDebug('Clicked on the favorite link, not removing favorite.');
             }
        });


        return favoriteItem;
    }


    async function fetchAndDisplayBadgeList(appId) {
         if (!SteamSetsAPI || SteamSetsAPI === "ss_YOUR_API_KEY") {
            logWarn("SteamSets API key not configured or is placeholder. Skipping badge list fetch.");
            let badgeListContainer = document.querySelector('.badge-list-container');
            if (!badgeListContainer) {
                 badgeListContainer = document.createElement('div');
                 badgeListContainer.className = 'badge-list-container';
                 const target = document.querySelector('.booster_creator_left');
                  if (target) {
                     target.insertAdjacentElement('afterend', badgeListContainer);
                 }
            }
            if (badgeListContainer) {
                 badgeListContainer.innerHTML = '';
                 badgeListContainer.textContent = 'SteamSets API key is not set. Badge list unavailable.';
                 badgeListContainer.style.color = 'orange';
                 badgeListContainer.style.textAlign = 'center';
                  badgeListContainer.style.minHeight = '100px'; // Keep a minimum height for the message
                  badgeListContainer.style.display = 'flex'; // Ensure flex properties apply for centering
                  badgeListContainer.style.alignItems = 'center';
                  badgeListContainer.style.justifyContent = 'center';

            }
            return;
        }

        log(`Attempting to fetch badge list for App ID: ${appId}. Checking cache first.`);

        let badgeListContainer = document.querySelector('.badge-list-container');
         if (!badgeListContainer) {
             badgeListContainer = document.createElement('div');
             badgeListContainer.className = 'badge-list-container';
             const target = document.querySelector('.booster_creator_left');
              if (target) {
                 target.insertAdjacentElement('afterend', badgeListContainer);
             } else {
                 logWarn('Target element .booster_creator_left not found for badge list container insertion.');
                 return;
             }
         }

        badgeListContainer.innerHTML = ''; // Clear previous content
        // Temporarily add a loading message and apply centering styles
        const loadingMessage = document.createElement('div');
        loadingMessage.textContent = 'Loading available badges...';
        loadingMessage.style.color = '#B8B6B4';
        loadingMessage.style.textAlign = 'center';
        loadingMessage.style.width = '100%'; // Ensure text centers horizontally
        badgeListContainer.appendChild(loadingMessage);

         // Apply centering to the container itself while loading
         badgeListContainer.style.display = 'flex';
         badgeListContainer.style.alignItems = 'center';
         badgeListContainer.style.justifyContent = 'center';
         badgeListContainer.style.flexWrap = 'wrap'; // Keep wrap for items later


        try {
            const cachedData = await getCachedData(appId); // <-- Await the promise here

            if (cachedData) {
                logDebug(`Using cached data for App ID ${appId}.`);
                displayBadgeList(cachedData, appId);
                // Reset centering styles once content is loaded
                badgeListContainer.style.display = 'flex'; // Keep flex for items
                badgeListContainer.style.alignItems = 'flex-start'; // Reset alignment
                badgeListContainer.style.justifyContent = 'flex-start'; // Reset alignment
                badgeListContainer.style.color = ''; // Reset style
                 badgeListContainer.style.textAlign = '';

            } else {
                log(`Fetching badge list for App ID: ${appId} from SteamSets API.`);
                 loadingMessage.textContent = 'Fetching available badges...'; // Update loading state

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://api.steamsets.com/v1/app.listBadges',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SteamSetsAPI}`
                    },
                    data: JSON.stringify({
                        appId: parseInt(appId) // Ensure appId is an integer
                    }),
                    onload: response => {
                        log(`SteamSets API response status: ${response.status}`);
                        badgeListContainer.innerHTML = ''; // Clear loading message

                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);

                                if (data && data.badges && Array.isArray(data.badges)) {
                                    log(`Fetched ${data.badges.length} badges from SteamSets API.`);
                                    // Cache the successful response
                                    cacheData(appId, data.badges).catch(cacheError => {
                                         logError('Error caching data after successful API fetch:', cacheError);
                                         // Continue displaying even if caching fails
                                    });
                                    displayBadgeList(data.badges, appId);
                                     // Reset centering styles
                                     badgeListContainer.style.display = 'flex';
                                     badgeListContainer.style.alignItems = 'flex-start';
                                     badgeListContainer.style.justifyContent = 'flex-start';
                                     badgeListContainer.style.color = '';
                                      badgeListContainer.style.textAlign = '';


                                } else {
                                    logError('SteamSets API response did not contain expected badge data structure:', data);
                                    badgeListContainer.textContent = 'Error fetching badge list: Invalid data format.';
                                     badgeListContainer.style.color = 'orange';
                                     badgeListContainer.style.textAlign = 'center';
                                      // Keep centering for error message
                                     badgeListContainer.style.display = 'flex';
                                     badgeListContainer.style.alignItems = 'center';
                                     badgeListContainer.style.justifyContent = 'center';
                                }
                            } catch (e) {
                                logError('Error parsing SteamSets API response:', e);
                                badgeListContainer.textContent = 'Error fetching badge list: Invalid JSON response.';
                                 badgeListContainer.style.color = 'orange';
                                 badgeListContainer.style.textAlign = 'center';
                                  // Keep centering for error message
                                 badgeListContainer.style.display = 'flex';
                                 badgeListContainer.style.alignItems = 'center';
                                 badgeListContainer.style.justifyContent = 'center';
                            }
                        } else if (response.status === 401) {
                             logError(`SteamSets API request failed with status 401 (Unauthorized). Check your API key.`, response.responseText);
                             badgeListContainer.innerHTML = '';
                             badgeListContainer.textContent = 'SteamSets API Error: Unauthorized (401). Please check your API key configuration.';
                             badgeListContainer.style.color = 'red';
                             badgeListContainer.style.textAlign = 'center';
                              // Keep centering for error message
                             badgeListContainer.style.display = 'flex';
                             badgeListContainer.style.alignItems = 'center';
                             badgeListContainer.style.justifyContent = 'center';

                        }
                        else {
                             logError(`SteamSets API request failed with status: ${response.status}`, response.responseText);
                             let errorMessage = `Error fetching badge list. Status: ${response.status}.`;
                             if (response.responseText) {
                                 try {
                                      const errorData = JSON.parse(response.responseText);
                                      if (errorData.message) {
                                           errorMessage += ` Message: ${errorData.message}`;
                                      }
                                 } catch (e) {
                                     // Ignore JSON parsing error if responseText is not JSON
                                 }
                             }
                            badgeListContainer.innerHTML = '';
                            badgeListContainer.textContent = errorMessage;
                             badgeListContainer.style.color = 'orange';
                             badgeListContainer.style.textAlign = 'center';
                              // Keep centering for error message
                             badgeListContainer.style.display = 'flex';
                             badgeListContainer.style.alignItems = 'center';
                             badgeListContainer.style.justifyContent = 'center';
                        }
                    },
                    onerror: (error) => {
                        logError(`SteamSets API request failed:`, error);
                        badgeListContainer.innerHTML = ''; // Clear loading message
                        badgeListContainer.textContent = `Network error fetching badge list.`;
                         badgeListContainer.style.color = 'red';
                         badgeListContainer.style.textAlign = 'center';
                          // Keep centering for error message
                         badgeListContainer.style.display = 'flex';
                         badgeListContainer.style.alignItems = 'center';
                         badgeListContainer.style.justifyContent = 'center';
                    }
                });
            }
        } catch (error) {
            // Catch errors from openDatabase or getCachedData
            logError('Error during API cache retrieval or database open:', error);
            badgeListContainer.innerHTML = ''; // Clear loading message
            badgeListContainer.textContent = `Error accessing badge data cache.`;
             badgeListContainer.style.color = 'red';
             badgeListContainer.style.textAlign = 'center';
              // Keep centering for error message
             badgeListContainer.style.display = 'flex';
             badgeListContainer.style.alignItems = 'center';
             badgeListContainer.style.justifyContent = 'center';
        }
    }

    function displayBadgeList(badges, appId) {
         const badgeListContainer = document.querySelector('.badge-list-container');
         if (!badgeListContainer) {
             logWarn('Badge list container not found during display.');
             return;
         }
         badgeListContainer.innerHTML = ''; // Clear existing content

         if (!badges || badges.length === 0) {
            badgeListContainer.textContent = 'No badges found for this app via SteamSets API.';
             badgeListContainer.style.color = '#B8B6B4';
             badgeListContainer.style.textAlign = 'center';
             // Keep centering for message
             badgeListContainer.style.display = 'flex';
             badgeListContainer.style.alignItems = 'center';
             badgeListContainer.style.justifyContent = 'center';
            return;
         }

         // Sort badges
        const sortedBadges = badges.sort((a, b) => {
            // Sort non-foil badges first
            if (a.isFoil !== b.isFoil) {
                return a.isFoil ? 1 : -1; // non-foil first
            }

            // If both are non-foil, sort by highestLevel ascending (1 to 5)
            if (!a.isFoil && !b.isFoil) {
                // Handle cases where highestLevel might be missing or null
                const levelA = a.highestLevel !== undefined && a.highestLevel !== null ? a.highestLevel : Infinity;
                const levelB = b.highestLevel !== undefined && b.highestLevel !== null ? b.highestLevel : Infinity;
                if (levelA !== levelB) {
                    return levelA - levelB;
                }
                // If levels are the same or missing, sort by scarcity
                 const scarcityA = a.scarcity !== undefined && a.scarcity !== null ? a.scarcity : Infinity;
                 const scarcityB = b.scarcity !== undefined && b.scarcity !== null ? b.scarcity : Infinity;
                 if (scarcityA !== scarcityB) {
                     return scarcityA - scarcityB;
                 }
            }

            // If both are foil, sort by rarity ascending if available, otherwise scarcity, otherwise name
            if (a.isFoil && b.isFoil) {
                 const rarityA = a.rarity !== undefined && a.rarity !== null ? a.rarity : Infinity;
                 const rarityB = b.rarity !== undefined && b.rarity !== null ? b.rarity : Infinity;
                 if (rarityA !== rarityB) {
                     return rarityA - rarityB;
                 }
                  const scarcityA = a.scarcity !== undefined && a.scarcity !== null ? a.scarcity : Infinity;
                  const scarcityB = b.scarcity !== undefined && b.scarcity !== null ? b.scarcity : Infinity;
                  if (scarcityA !== scarcityB) {
                      return scarcityA - scarcityB;
                  }
            }

            // Fallback: Sort by name if other criteria are the same or missing
            return (a.name || '').localeCompare(b.name || '');
        });


        logDebug(`Displaying all available badges (${sortedBadges.length}):`);
        sortedBadges.forEach(badge => {
            // Add appId to the badge data before creating the item
            badge.appId = appId;
            badgeListContainer.appendChild(createBadgeListItem(badge));
        });
         // Reset centering styles for displaying items
         badgeListContainer.style.display = 'flex';
         badgeListContainer.style.alignItems = 'flex-start';
         badgeListContainer.style.justifyContent = 'flex-start';
         badgeListContainer.style.color = ''; // Reset style
         badgeListContainer.style.textAlign = '';
    }


    // Main function to fetch and display badge info
    async function updateBadgeInfo() {
        const appId = getAppId();
        if (!appId) {
            logWarn('Could not get App ID from URL. Displaying favorites only.');
            // If no App ID, clear badge containers and only show favorites
            clearBadgeContainers(false); // Don't remove favorites container
            addFavoritesContainerWithControls(); // Ensure favorites container is present
            displayFavorites(); // Display favorites even if no app ID
            return;
        }

        const userId = USER_STEAM_ID;
        const isSteamId64 = STEAM_ID_IS_STEAMID64;

        if (userId === "REPLACE_WITH_YOUR_STEAM_ID" || SteamSetsAPI === "ss_YOUR_API_KEY") {
            logError("Please update the USER_STEAM_ID and/or SteamSetsAPI variables in the script.");
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'color: red; font-weight: bold; margin-top: 20px; text-align: center;';
            errorDiv.textContent = "Steam Badge Info Injector: Please edit the script and update the configuration variables.";
            const target = document.querySelector('.booster_creator_left');
            if (target) {
                 target.insertAdjacentElement('afterend', errorDiv);
            } else {
                 document.body.prepend(errorDiv);
            }
            clearBadgeContainers(false); // Clear any old containers except favorites
            addFavoritesContainerWithControls(); // Ensure favorites container is present
            displayFavorites(); // Still show favorites if available
            return;
        }

        // Remove existing containers before adding new ones (except favorites)
        clearBadgeContainers(true); // Remove badge containers

        log(`Fetching badge data for App ID: ${appId} and User ID: ${userId} (Type: ${isSteamId64 ? 'SteamID64' : 'Custom ID'})`);

        // Create and insert the badge list container first with loading state
        const badgeListContainer = document.createElement('div');
        badgeListContainer.className = 'badge-list-container';
        badgeListContainer.textContent = 'Loading available badges...'; // Initial loading state
        // Apply centering and min-height immediately
        badgeListContainer.style.display = 'flex';
        badgeListContainer.style.alignItems = 'center';
        badgeListContainer.style.justifyContent = 'center';
        badgeListContainer.style.flexWrap = 'wrap'; // Keep wrap for items later


        const target = document.querySelector('.booster_creator_left');
         if (!target) {
            logWarn('Target element .booster_creator_left not found. Containers not inserted.');
             // Still display favorites even if main container fails
             addFavoritesContainerWithControls(); // Ensure favorites container is present
             displayFavorites();
             return;
        }
        target.insertAdjacentElement('afterend', badgeListContainer); // Insert list container


        // Create and insert the main badge container with loading state
        const mainContainer = document.createElement('div');
        mainContainer.className = 'badge-container';
        mainContainer.textContent = 'Loading your badge info...'; // Initial loading state
         // Apply centering and min-height immediately
         mainContainer.style.display = 'flex';
         mainContainer.style.alignItems = 'center';
         mainContainer.style.justifyContent = 'center';


        // Insert the main container after the badge list container
         badgeListContainer.insertAdjacentElement('afterend', mainContainer);


         // Create and insert the favorites container if it doesn't exist
        addFavoritesContainerWithControls();
         // Always display favorites when updateBadgeInfo runs
         displayFavorites();


        // Fetch and display the list of available badges (this will update the badgeListContainer)
        fetchAndDisplayBadgeList(appId); // This function now handles updating the content and styles


        // Construct URLs using the provided user ID and type
        const userPath = isSteamId64 ? 'profiles' : 'id';
        const regularUrl = `https://steamcommunity.com/${userPath}/${userId}/gamecards/${appId}`;
        const foilUrl = `https://steamcommunity.com/${userPath}/${userId}/gamecards/${appId}?border=1`;

        Promise.all([
            new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: regularUrl,
                    onload: response => {
                        log(`Regular badge request status: ${response.status}`);
                         if (response.status === 200) {
                            resolve(parseBadgeData(response.responseText, false, userId, isSteamId64, appId));
                         } else {
                             logError(`Failed to load regular badge (Status ${response.status})`);
                             resolve({ imageUrl: null, name: `Error loading regular badge (${response.status})`, level: null, badgeUrl: regularUrl, cardProgress: null, unlockedInfo: null }); // Include unlockedInfo
                         }
                    },
                    onerror: (error) => {
                         logError(`Error loading regular badge:`, error);
                         resolve({ imageUrl: null, name: 'Error loading regular badge', level: null, badgeUrl: regularUrl, cardProgress: null, unlockedInfo: null }); // Include unlockedInfo
                    }
                });
            }),
            new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: foilUrl,
                    onload: response => {
                        log(`Foil badge request status: ${response.status}`);
                         if (response.status === 200) {
                            resolve(parseBadgeData(response.responseText, true, userId, isSteamId64, appId));
                         } else {
                              logError(`Failed to load foil badge (Status ${response.status})`);
                             resolve({ imageUrl: null, name: `Error loading foil badge (${response.status})`, level: null, badgeUrl: foilUrl, cardProgress: null, unlockedInfo: null }); // Include unlockedInfo
                         }
                    },
                    onerror: (error) => {
                        logError(`Error loading foil badge:`, error);
                        resolve({ imageUrl: null, name: 'Error loading foil badge', level: null, badgeUrl: foilUrl, cardProgress: null, unlockedInfo: null }); // Include unlockedInfo
                    }
                });
            })
        ]).then(([regularBadge, foilBadge]) => {
            mainContainer.innerHTML = ''; // Clear loading message
            mainContainer.appendChild(createBadgeElement(regularBadge, false));
            mainContainer.appendChild(createBadgeElement(foilBadge, true));
             // Reset centering styles once content is loaded
             mainContainer.style.display = 'flex'; // Keep flex
             mainContainer.style.alignItems = 'center'; // Reset alignment (items are centered by default in flex row)
             mainContainer.style.justifyContent = 'center'; // Reset alignment (items are centered by default in flex row)


        }).catch(error => {
             logError('Error in Promise.all fetching badge data:', error);
             mainContainer.innerHTML = ''; // Clear loading message
             mainContainer.textContent = 'Error loading your badge info.';
              // Keep centering for error message
             mainContainer.style.display = 'flex';
             mainContainer.style.alignItems = 'center';
             mainContainer.style.justifyContent = 'center';
        });
    }

     function clearBadgeContainers(removeFavorites = false) {
         const existingMainContainer = document.querySelector('.badge-container');
         if (existingMainContainer) {
             existingMainContainer.remove();
         }
         const existingListContainer = document.querySelector('.badge-list-container');
         if (existingListContainer) {
             existingListContainer.remove();
         }
         if (removeFavorites) {
              const existingFavoritesContainer = document.querySelector('.favorites-container');
              if (existingFavoritesContainer) {
                  existingFavoritesContainer.remove();
              }
         }
         const existingError = document.querySelector('div[style*="color: red"], div[style*="color: orange"]');
         if(existingError) {
             existingError.remove();
         }
     }

      function addFavoritesContainerWithControls() {
         let favoritesContainer = document.querySelector('.favorites-container');
         if (!favoritesContainer) {
              logDebug('Favorites container not found, creating and adding controls.');
              favoritesContainer = document.createElement('div');
              favoritesContainer.className = 'favorites-container';

              // Add sort controls
              const controlsDiv = document.createElement('div');
              controlsDiv.className = 'favorites-controls';

              // Group sort controls
              const sortGroup = document.createElement('div');
              sortGroup.className = 'sort-group';

              const label = document.createElement('label');
              label.textContent = 'Sort Favorites:';
              label.htmlFor = 'favorites-sort';
              sortGroup.appendChild(label);

              // Create the button wrapper for the select
              const selectWrapper = document.createElement('div');
              selectWrapper.className = 'btn_grey_black'; // Apply Steam button class

              const select = document.createElement('select');
              select.id = 'favorites-sort';
              select.innerHTML = `
                 <option value="appid_asc">App ID (Asc)</option>
                 <option value="appid_desc">App ID (Desc)</option>
                 <option value="foil_first">Foil First</option> <!-- Corrected order based on common preference -->
                 <option value="foil_last">Foil Last</option>
              `;
              select.value = currentFavoritesSortOrder; // Set initial value
              select.addEventListener('change', (event) => {
                  currentFavoritesSortOrder = event.target.value;
                  GM_setValue('favoritesSortOrder', currentFavoritesSortOrder); // Save sort order
                  displayFavorites(); // Redraw favorites with new sort order
              });
              selectWrapper.appendChild(select); // Append select inside the button wrapper
              sortGroup.appendChild(selectWrapper); // Append button wrapper to sort group

              controlsDiv.appendChild(sortGroup); // Add sort group to controls


              // Group import/export buttons
              const buttonGroup = document.createElement('div');
              buttonGroup.className = 'button-group';

              // Add Export Button
              const exportButton = document.createElement('button');
              exportButton.className = 'steam-button'; // Custom Steam-like style
              exportButton.textContent = 'Export Favorites';
              exportButton.onclick = exportFavorites;
              buttonGroup.appendChild(exportButton);

              // Add Import Button
              const importButton = document.createElement('button');
              importButton.className = 'steam-button'; // Custom Steam-like style
              importButton.textContent = 'Import Favorites';
              importButton.onclick = showImportArea; // Show the import modal
              buttonGroup.appendChild(importButton);

              controlsDiv.appendChild(buttonGroup); // Add button group to controls


              favoritesContainer.appendChild(controlsDiv);

              // Find a suitable insertion point
              const mainContainer = document.querySelector('.badge-container');
              const listContainer = document.querySelector('.badge-list-container');
              const target = document.querySelector('.booster_creator_left');

              if (mainContainer) {
                  mainContainer.insertAdjacentElement('afterend', favoritesContainer);
                   logDebug('Favorites container inserted after main badge container.');
              } else if (listContainer) {
                  listContainer.insertAdjacentElement('afterend', favoritesContainer);
                   logDebug('Favorites container inserted after badge list container.');
              } else if (target) {
                  target.insertAdjacentElement('afterend', favoritesContainer);
                   logDebug('Favorites container inserted after .booster_creator_left.');
              } else {
                  logWarn('Could not find insertion point for favorites container. Favorites will not be displayed.');
                  return; // Don't proceed if no target found
              }
              logDebug('Favorites container and controls added.');
         } else {
             // If container exists, just ensure the sort select value is correct
              logDebug('Favorites container already exists, ensuring sort select value is correct.');
              const sortSelect = favoritesContainer.querySelector('#favorites-sort');
              if (sortSelect) {
                  sortSelect.value = currentFavoritesSortOrder;
              }
              // Ensure controls structure is correct (especially after updates)
              const controlsDiv = favoritesContainer.querySelector('.favorites-controls');
              if (controlsDiv) {
                  // Check if the grouping divs exist, if not, rebuild the controls
                  if (!controlsDiv.querySelector('.sort-group') || !controlsDiv.querySelector('.button-group')) {
                      logDebug('Favorites controls structure outdated, rebuilding controls div.');
                      // Clear existing controls
                      controlsDiv.innerHTML = '';

                      // Rebuild sort group
                      const sortGroup = document.createElement('div');
                      sortGroup.className = 'sort-group';
                      const label = document.createElement('label');
                      label.textContent = 'Sort Favorites:';
                      label.htmlFor = 'favorites-sort';
                      sortGroup.appendChild(label);
                       const selectWrapper = document.createElement('div');
                       selectWrapper.className = 'btn_grey_black';
                       const select = document.createElement('select');
                       select.id = 'favorites-sort';
                       select.innerHTML = `
                          <option value="appid_asc">App ID (Asc)</option>
                          <option value="appid_desc">App ID (Desc)</option>
                          <option value="foil_last">Foil First</option>
                          <option value="foil_first">Foil Last</option>
                       `;
                       select.value = currentFavoritesSortOrder;
                       select.addEventListener('change', (event) => {
                           currentFavoritesSortOrder = event.target.value;
                           GM_setValue('favoritesSortOrder', currentFavoritesSortOrder);
                           displayFavorites();
                       });
                       selectWrapper.appendChild(select);
                       sortGroup.appendChild(selectWrapper);
                       controlsDiv.appendChild(sortGroup);


                      // Rebuild button group
                       const buttonGroup = document.createElement('div');
                       buttonGroup.className = 'button-group';

                       const exportButton = document.createElement('button');
                       exportButton.className = 'steam-button';
                       exportButton.textContent = 'Export Favorites';
                       exportButton.onclick = exportFavorites;
                       buttonGroup.appendChild(exportButton);

                       const importButton = document.createElement('button');
                       importButton.className = 'steam-button';
                       importButton.textContent = 'Import Favorites';
                       importButton.onclick = showImportArea;
                       buttonGroup.appendChild(importButton);

                       controlsDiv.appendChild(buttonGroup);

                       logDebug('Favorites controls div rebuilt.');

                  } else {
                       // If groups exist, just ensure buttons are inside the button-group
                       const buttonGroup = controlsDiv.querySelector('.button-group');
                       if (buttonGroup) {
                           // Find existing buttons outside the group and move them
                           controlsDiv.querySelectorAll('.steam-button').forEach(btn => {
                                if (!buttonGroup.contains(btn)) {
                                    logDebug('Moving existing steam-button into button-group.');
                                    buttonGroup.appendChild(btn);
                                }
                           });
                       }
                  }
              } else {
                   logWarn('Favorites controls div not found in existing container.');
              }
         }
     }


    // --- Initial Run and Observers ---

    addStyle(style);

    // Use a small delay to allow the page structure to load
    setTimeout(updateBadgeInfo, 500);

    // Use MutationObserver to detect URL changes within the page
    // Observe the body for subtree and child list changes to catch SPA navigation
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        // Check if the appId part of the URL has changed
        const lastAppId = lastUrl.match(/\d+$/);
        const currentAppId = currentUrl.match(/\d+$/);

        const appIdChanged = (lastAppId && currentAppId && lastAppId[0] !== currentAppId[0]) ||
                             (!lastAppId && currentAppId) ||
                             (lastAppId && !currentAppId);

        if (currentUrl !== lastUrl && appIdChanged) {
            lastUrl = currentUrl;
            log(`URL changed, App ID updated. Updating badge info.`);
            // Add a small delay before updating to ensure the page structure is ready
            setTimeout(updateBadgeInfo, 200);
        } else if (currentUrl !== lastUrl && !appIdChanged) {
             // If URL changed but App ID is the same (e.g., hash change for something else),
             // just re-display favorites in case the container was removed by page script.
             log(`URL changed, but App ID is the same. Redisplaying favorites.`);
             lastUrl = currentUrl; // Still update lastUrl
             // Ensure the favorites container exists before trying to display
             if (!document.querySelector('.favorites-container')) {
                 logDebug('Favorites container missing during non-AppID URL change, attempting to re-add.');
                 addFavoritesContainerWithControls(); // Re-add container if necessary
             }
             setTimeout(displayFavorites, 100); // Always try to display favorites
        } else if (currentUrl === lastUrl) {
             // Check if the favorites container needs to be re-added
             if (!document.querySelector('.favorites-container')) {
                 logDebug('Favorites container missing, re-adding.');
                 addFavoritesContainerWithControls(); // Re-add container and controls
                 displayFavorites(); // Populate the re-added container
             }
        }
    });

    // Start observing the document body
    observer.observe(document.body, { subtree: true, childList: true });

    // Also try to run updateBadgeInfo on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        log('DOMContentLoaded event fired.');
        // Clear stale API cache on DOMContentLoaded (doesn't need to block anything)
        clearStaleApiCache();
        setTimeout(updateBadgeInfo, 300);
    });

    // Initial display of favorites on load
    // We need to wait for the DB to be ready before displaying favorites
    openDatabase().then(() => {
        logDebug('Database ready for initial favorites display.');
        addFavoritesContainerWithControls(); // Ensure container is present early
        displayFavorites();
    }).catch(error => {
         logError('Failed to open database for initial favorites display:', error);
         // Still try to add the container and show an error message
         addFavoritesContainerWithControls();
         const favoritesContainer = document.querySelector('.favorites-container');
          if (favoritesContainer) {
              let itemsWrapper = favoritesContainer.querySelector('.favorites-items-wrapper');
              if (!itemsWrapper) {
                 itemsWrapper = document.createElement('div');
                 itemsWrapper.className = 'favorites-items-wrapper';
                 favoritesContainer.appendChild(itemsWrapper);
              }
              itemsWrapper.textContent = 'Error initializing favorites database.';
              itemsWrapper.style.color = 'red';
              itemsWrapper.style.textAlign = 'center';
              itemsWrapper.style.width = '100%';
              itemsWrapper.style.marginTop = '10px';
          }
    });


    // Clear stale API cache periodically or on load
    clearStaleApiCache();


})();