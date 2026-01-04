// ==UserScript==
// @name         Steam Game Card Badge Enhancer
// @namespace    https://github.com/encumber
// @version      1.4
// @description  Enhances Steam game card pages with cached badge information from steamsets.com, highlighting foils with an animation and showing levels on separate lines, inserted after a specific element.
// @author       Nitoned
// @match        https://steamcommunity.com/*/gamecards/*
// @grant        GM_xmlhttpRequest
// @connect      api.steamsets.com
// @downloadURL https://update.greasyfork.org/scripts/536523/Steam%20Game%20Card%20Badge%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/536523/Steam%20Game%20Card%20Badge%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const STEAMSETS_API_KEY = ''; // Get api key from https://steamsets.com/settings/developer-apps
    const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
    const DB_NAME = 'SteamGameCardBadgeCache';
    const DB_VERSION = 2;
    const STORE_NAME = 'gameCardBadges';
    // Selector for the element AFTER which we want to insert the badge container
    const INSERT_AFTER_SELECTOR = '#responsive_page_template_content > div.pagecontent > div.maincontent > div > div.badge_row_inner > div:nth-child(5)';
    // ---------------------

    // --- Foil Animation Style ---
    const foilStyle = `
        .steam-badge-item.foil {
            position: relative; /* Needed for absolute positioning of the pseudo-element */
            overflow: hidden;   /* Hide the overflow of the shine effect */
            background-color: #222; /* Darker background for contrast */
            border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
            box-shadow: 0 0 10px rgba(255, 255, 245, 0.1); /* Subtle glow */
        }

        .steam-badge-item.foil::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                45deg,
                rgba(255, 255, 255, 0) 0%, /* Start transparent */
                rgba(255, 255, 255, 0.2) 0%, /* Shine effect */
                rgba(255, 255, 255, 0) 0%  /* End transparent */
            );
            background-size: 200% 100%; /* Make the gradient wider than the element */
            animation: shine 3s linear infinite; /* Adjust animation duration as needed */
        }

        @keyframes shine {
            0% {
                background-position: -200% center; /* Start the gradient off-screen to the left */
            }
            100% {
                background-position: 200% center; /* Move the gradient off-screen to the right */
            }
        }
    `;
    // ----------------------------

    let db;
    let dbPromise = null;

    // Function to add the foil animation style to the head
    function addFoilStyle() {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.innerHTML = foilStyle;
        document.head.appendChild(styleElement);
    }


    // Function to open or create the IndexedDB database
    function openDatabase() {
        if (dbPromise) {
            return dbPromise;
        }

        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = function(event) {
                console.log('IndexedDB: Upgrade needed', event.oldVersion, '->', event.newVersion);
                db = event.target.result;
                try {
                    if (event.oldVersion < 1) {
                         console.log('IndexedDB: Creating object store:', STORE_NAME);
                         db.createObjectStore(STORE_NAME, { keyPath: 'appId' });
                    }
                    // Add any future migrations here for higher versions.

                } catch (e) {
                     console.error('IndexedDB: Error during upgrade:', e);
                     reject(e);
                }
            };

            request.onsuccess = function(event) {
                db = event.target.result;
                console.log('IndexedDB: Database opened successfully');
                db.onclose = function() {
                    console.log('IndexedDB: Database connection closed unexpectedly.');
                    db = null;
                    dbPromise = null;
                };
                db.onerror = function(err) {
                     console.error('IndexedDB: Unhandled database error:', err);
                };
                resolve(db);
            };

            request.onerror = function(event) {
                console.error('IndexedDB: Error opening database:', event.target.error);
                reject('IndexedDB error: ' + (event.target.error ? event.target.error.message : 'Unknown error'));
            };
             request.onblocked = function() {
                console.warn('IndexedDB: Database connection blocked. Close other tabs with this page.');
            };
        });

        return dbPromise;
    }

    // Function to get cached data for a specific App ID
    async function getCachedBadgeData(appId) {
        try {
            await openDatabase();

            if (!db) {
                 console.warn('IndexedDB: Database not available for get.');
                 return null;
            }

            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            return new Promise((resolve, reject) => {
                 const request = store.get(appId);

                 request.onsuccess = function(event) {
                     const cachedData = event.target.result;
                     if (cachedData) {
                         const now = Date.now();
                         if (now - cachedData.timestamp < CACHE_DURATION_MS) {
                             console.log('IndexedDB: Found fresh cache for', appId);
                             resolve(cachedData.data);
                         } else {
                             console.log('IndexedDB: Cache for', appId, 'is stale.');
                             resolve(null);
                         }
                     } else {
                         console.log('IndexedDB: No cache found for', appId);
                         resolve(null);
                     }
                 };

                 request.onerror = function(event) {
                     console.error('IndexedDB: Error getting cached data for', appId, ':', event.target.error);
                     // Resolve with null on error so the script doesn't stop here
                     resolve(null);
                 };
            });
        } catch (error) {
             console.error('IndexedDB: Error in getCachedBadgeData:', error);
             // Resolve with null on error so the script doesn't stop here
             return null;
        }
    }

    // Function to store badge data in IndexedDB
    async function cacheBadgeData(appId, data) {
         try {
            await openDatabase();

            if (!db) {
                 console.warn('IndexedDB: Database not available for cache.');
                 return;
            }

            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const dataToStore = {
                appId: appId,
                data: data,
                timestamp: Date.now()
            };

            return new Promise((resolve, reject) => {
                 const request = store.put(dataToStore);

                 request.onsuccess = function() {
                     console.log('IndexedDB: Cached data for', appId);
                     resolve();
                 };

                 request.onerror = function(event) {
                     console.error('IndexedDB: Error caching data for', appId, ':', event.target.error);
                     // Resolve on error so the script doesn't stop here
                     resolve();
                 };
            });
         } catch (error) {
              console.error('IndexedDB: Error in cacheBadgeData:', error);
              // Resolve on error so the script doesn't stop here
         }
    }


    function fetchBadgeDataFromApi(appId) {
        console.log('Fetching badge data from API for App ID:', appId);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.steamsets.com/v1/app.listBadges',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${STEAMSETS_API_KEY}`
                },
                data: JSON.stringify({
                    appId: appId
                }),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data && data.badges) {
                                resolve(data.badges);
                            } else {
                                reject(new Error('API response is missing the "badges" array.'));
                            }
                        } catch (e) {
                            reject(new Error('Error parsing API response: ' + e));
                        }
                    } else {
                        reject(new Error(`API request failed with status ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Error fetching badge data: ' + (error.statusText || 'Unknown network error')));
                }
            });
        });
    }

    function displayBadges(badges, appId) {
        const insertAfterElement = document.querySelector(INSERT_AFTER_SELECTOR);

        if (!insertAfterElement) {
            console.error(`Could not find the insertion point element using selector: ${INSERT_AFTER_SELECTOR}`);
            return;
        }

        // Find the parent element of the insertion point
        const parentElement = insertAfterElement.parentElement;
         if (!parentElement) {
             console.error('Could not find the parent element of the insertion point.');
             return;
         }


        // Remove any previously added badge containers and adjacent clearing divs
        // We search for elements immediately following the insertAfterElement
        let nextSibling = insertAfterElement.nextElementSibling;
        while(nextSibling && (nextSibling.classList.contains('game_cards_clear') || nextSibling.classList.contains('steam-badge-container'))) {
             let temp = nextSibling.nextElementSibling;
             nextSibling.remove();
             nextSibling = temp;
        }


        const clearDivBefore = document.createElement('div');
        clearDivBefore.classList.add('game_cards_clear');
        clearDivBefore.style.clear = 'both';

        const badgeContainer = document.createElement('div');
        badgeContainer.classList.add('steam-badge-container');
        badgeContainer.style.marginTop = '20px';
        badgeContainer.style.width = '1000px'; // Set width to 1000px
        badgeContainer.style.marginLeft = '30px'; // Add left margin of 100px
        badgeContainer.style.boxSizing = 'border-box';
        badgeContainer.style.display = 'flex'; // Use flexbox to arrange items
        badgeContainer.style.flexWrap = 'wrap'; // Allow items to wrap to the next line
        badgeContainer.style.gap = '20px'; // Add space between badge items

        const sortedBadges = badges.sort((a, b) => {
            if (a.isFoil === b.isFoil) {
                return a.baseLevel - b.baseLevel;
            }
            return a.isFoil ? 1 : -1;
        });

        sortedBadges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.classList.add('steam-badge-item');
            badgeElement.style.textAlign = 'center';
            badgeElement.style.verticalAlign = 'top';
            badgeElement.style.flex = '0 0 auto'; // Prevent items from growing/shrinkings
            badgeElement.style.width = '120px'; // Set a fixed width for each badge item
             badgeElement.style.padding = '5px'; // Added padding
             badgeElement.style.borderRadius = '5px'; // Added border radius


            // Apply foil highlighting styles using the 'foil' class
            if (badge.isFoil) {
                badgeElement.classList.add('foil');
                // Remove the previous gold border and background styles
                badgeElement.style.border = '';
                badgeElement.style.backgroundColor = '';
            } else {
                // Ensure non-foil badges have a default background
                 badgeElement.style.backgroundColor = '#1a1a1a'; // Example: a dark background
            }


            // Div for Level
            const badgeLevel = document.createElement('div');
            badgeLevel.textContent = `${badge.isFoil ? 'Foil' : `Level ${badge.baseLevel}`}`;
            badgeLevel.style.fontWeight = 'bold';
             if (badge.isFoil) {
                 badgeLevel.style.color = 'gold'; // Keep gold text for foil level
            } else {
                 badgeLevel.style.color = '#ccc'; // Default text color for non-foil
            }
            badgeElement.appendChild(badgeLevel);

            // Div for Name
            const badgeName = document.createElement('div');
            badgeName.textContent = badge.name;
            badgeName.style.fontWeight = 'normal';
            badgeName.style.fontSize = '0.9em';
            badgeName.style.whiteSpace = 'nowrap'; // Prevent name from wrapping
            badgeName.style.overflow = 'hidden'; // Hide overflow text
            badgeName.style.textOverflow = 'ellipsis'; // Show ellipsis for overflow
            badgeName.style.color = '#ccc'; // Default text color
            badgeElement.appendChild(badgeName);


            const badgeImage = document.createElement('img');
            badgeImage.src = `https://cdn.fastly.steamstatic.com/steamcommunity/public/images/items/${appId}/${badge.badgeImage}`;
            badgeImage.alt = badge.name;
            badgeImage.style.maxWidth = '100px';
            badgeImage.style.height = 'auto';
            badgeImage.style.display = 'block';
            badgeImage.style.margin = '5px auto';
            badgeElement.appendChild(badgeImage);

            const badgeScarcity = document.createElement('div');
            badgeScarcity.textContent = `Scarcity: ${badge.scarcity}`;
            badgeScarcity.style.fontSize = '0.8em';
            badgeScarcity.style.color = '#888'; // Grey out scarcity text
            badgeElement.appendChild(badgeScarcity);

            badgeContainer.appendChild(badgeElement);
        });

        // Insert the first clearing div after the specified element
        parentElement.insertBefore(clearDivBefore, insertAfterElement.nextSibling);
        // Insert the badge container after the first clearing div
        clearDivBefore.parentNode.insertBefore(badgeContainer, clearDivBefore.nextSibling);

         // Add the second clearing div after the badge container
        const clearDivAfter = document.createElement('div');
        clearDivAfter.classList.add('game_cards_clear');
        clearDivAfter.style.clear = 'both';
        badgeContainer.parentNode.insertBefore(clearDivAfter, badgeContainer.nextSibling);
    }

    async function init() {
        // Add the foil style to the head as soon as the script runs
        addFoilStyle();

        const urlParts = window.location.pathname.split('/');
        const gamecardsIndex = urlParts.indexOf('gamecards');
        let appId = null;

        if (gamecardsIndex !== -1 && gamecardsIndex + 1 < urlParts.length) {
            appId = parseInt(urlParts[gamecardsIndex + 1]);
        }

        if (isNaN(appId)) {
            console.error('Could not extract App ID from the URL.');
            return;
        }

        // Wait for the specific element to be present in the DOM before proceeding
        const observer = new MutationObserver((mutations, obs) => {
            const insertAfterElement = document.querySelector(INSERT_AFTER_SELECTOR);
            if (insertAfterElement) {
                obs.disconnect(); // Stop observing once the element is found
                processBadgeData(appId);
            }
        });

        // Start observing the body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // In case the element is already present on page load
        if (document.querySelector(INSERT_AFTER_SELECTOR)) {
             observer.disconnect(); // Stop observing
             processBadgeData(appId);
        }
    }

    async function processBadgeData(appId) {
        try {
            const cachedBadgeData = await getCachedBadgeData(appId);

            if (cachedBadgeData) {
                console.log('Using cached badge data for App ID:', appId);
                displayBadges(cachedBadgeData, appId);
            } else {
                console.log('Cached data not found or stale for App ID:', appId, '. Fetching from API.');
                const fetchedBadgeData = await fetchBadgeDataFromApi(appId);

                if (fetchedBadgeData && fetchedBadgeData.length > 0) {
                    console.log('Successfully fetched badge data for App ID:', appId);
                    displayBadges(fetchedBadgeData, appId);
                    // Do not await cacheData; let it happen in the background
                    cacheBadgeData(appId, fetchedBadgeData).catch(e => console.error('Failed to cache data:', e));
                    console.log('Attempting to cache badge data for App ID:', appId);
                } else {
                    console.log('No badge data found for this app from API.');
                }
            }
        } catch (error) {
            // Log the error but allow the script to continue if possible
            console.error('Error during badge data processing:', error);
        }
    }


    window.addEventListener('load', init);

})();