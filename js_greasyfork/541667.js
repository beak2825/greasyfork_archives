// ==UserScript==
// @name         Sniffies: Persistent Hide by Your Ratings (Stacked Filters) - Fixed
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide user markers by your Sniffies ratings with combined filters - Performance Fixed
// @match        https://*.sniffies.com/*
// @grant        GM_xmlhttpRequest
// @connect      100.88.77.24
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/541667/Sniffies%3A%20Persistent%20Hide%20by%20Your%20Ratings%20%28Stacked%20Filters%29%20-%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/541667/Sniffies%3A%20Persistent%20Hide%20by%20Your%20Ratings%20%28Stacked%20Filters%29%20-%20Fixed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_ORIGIN = 'http://100.88.77.24:3989';

    // === Filter State ===
    let hideRated = false;    // hide users rated 1 or 2
    let hideUnrated = false;  // hide users without a rating

    // === Performance Improvements ===
    let ratingsCache = new Map(); // Cache ratings to avoid repeated API calls
    let lastFilterTime = 0;
    const FILTER_DEBOUNCE_MS = 100; // Debounce filter calls
    let filterTimeout = null;

    // === Helpers ===
    // Gather all visible user IDs from the map
    function getVisibleUserIds() {
        const ids = new Set();
        document.querySelectorAll('.marker-container.user[id]').forEach(el => {
            ids.add(el.id);
        });
        return Array.from(ids);
    }

    // Fetch ratings for a list of user IDs from the Flask API
    function fetchRatings(userIds) {
        return new Promise((resolve, reject) => {
            // Filter out already cached IDs
            const uncachedIds = userIds.filter(id => !ratingsCache.has(id));

            if (uncachedIds.length === 0) {
                // All IDs are cached, return cached results
                const result = {};
                userIds.forEach(id => {
                    const cached = ratingsCache.get(id);
                    if (cached !== undefined) {
                        result[id] = cached;
                    }
                });
                resolve(result);
                return;
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${API_ORIGIN}/api/ratings`,
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify({ids: uncachedIds}),
                timeout: 5000, // 5 second timeout
                onload(resp) {
                    if (resp.status >= 200 && resp.status < 300) {
                        try {
                            const apiResult = JSON.parse(resp.responseText);

                            // Cache the results and extract just the rating
                            const result = {};
                            uncachedIds.forEach(id => {
                                const userData = apiResult[id];
                                let rating = null;

                                if (userData && userData.rating !== undefined && userData.rating !== null) {
                                    rating = userData.rating;
                                }

                                ratingsCache.set(id, rating);
                                result[id] = rating;
                            });

                            // Add cached results for other requested IDs
                            userIds.forEach(id => {
                                if (!result.hasOwnProperty(id)) {
                                    const cached = ratingsCache.get(id);
                                    if (cached !== undefined) {
                                        result[id] = cached;
                                    }
                                }
                            });

                            resolve(result);
                        } catch (e) {
                            console.error('Error parsing ratings response:', e);
                            reject(e);
                        }
                    } else {
                        reject(new Error(`API returned status ${resp.status}`));
                    }
                },
                onerror(err) {
                    console.error('API request failed:', err);
                    reject(err);
                },
                ontimeout() {
                    console.error('API request timed out');
                    reject(new Error('Request timed out'));
                }
            });
        });
    }

    // Apply current filters to hide/show markers with retry logic
    function filterMarkers() {
        const now = Date.now();
        lastFilterTime = now;

        // Clear any pending filter timeout
        if (filterTimeout) {
            clearTimeout(filterTimeout);
            filterTimeout = null;
        }

        const ids = getVisibleUserIds();
        if (!ids.length) {
            console.log('No visible user IDs found, retrying in 500ms...');
            filterTimeout = setTimeout(filterMarkers, 500);
            return;
        }

        console.log(`Filtering ${ids.length} users...`);

        fetchRatings(ids)
            .then(ratingsMap => {
                // Only apply filters if this is still the most recent call
                if (now !== lastFilterTime) {
                    console.log('Skipping outdated filter call');
                    return;
                }

                let hiddenCount = 0;
                let shownCount = 0;

                document.querySelectorAll('.marker-container.user[id]').forEach(el => {
                    const uid = el.id;
                    const rating = ratingsMap[uid]; // null/undefined = unrated

                    // Decide hide based on combined toggles
                    const shouldHide = (hideRated && (rating === 1 || rating === 2)) ||
                                      (hideUnrated && (rating == null || rating === undefined));

                    const marker = el.closest('.mgl-marker');
                    if (marker) {
                        if (shouldHide) {
                            marker.style.display = 'none';
                            hiddenCount++;
                        } else {
                            marker.style.display = '';
                            shownCount++;
                        }
                    }
                });

                console.log(`Filter applied: ${hiddenCount} hidden, ${shownCount} shown`);
            })
            .catch(err => {
                console.error('Error fetching ratings:', err);
                // Retry after a delay on error
                filterTimeout = setTimeout(filterMarkers, 2000);
            });
    }

    // Debounced version of filterMarkers
    function debouncedFilterMarkers() {
        if (filterTimeout) {
            clearTimeout(filterTimeout);
        }
        filterTimeout = setTimeout(filterMarkers, FILTER_DEBOUNCE_MS);
    }

    // === UI Controls ===
    function injectControls() {
        const box = document.createElement('div');
        Object.assign(box.style, {
            position: 'absolute',
            top: '50px',
            left: '10px',
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '10px',
            zIndex: 999999,
            fontFamily: 'sans-serif',
            fontSize: '12px',
            display: 'flex',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        });

        const btn12 = document.createElement('button');
        btn12.textContent = 'Hide rated 1/2';
        btn12.style.cssText = 'padding: 4px 8px; border: 1px solid #999; border-radius: 3px; background: #f5f5f5; cursor: pointer;';
        btn12.onclick = () => {
            hideRated = !hideRated;
            btn12.style.fontWeight = hideRated ? 'bold' : 'normal';
            btn12.style.background = hideRated ? '#e0e0e0' : '#f5f5f5';
            console.log(`Hide rated 1/2: ${hideRated}`);
            debouncedFilterMarkers();
        };

        const btnUn = document.createElement('button');
        btnUn.textContent = 'Hide unrated';
        btnUn.style.cssText = 'padding: 4px 8px; border: 1px solid #999; border-radius: 3px; background: #f5f5f5; cursor: pointer;';
        btnUn.onclick = () => {
            hideUnrated = !hideUnrated;
            btnUn.style.fontWeight = hideUnrated ? 'bold' : 'normal';
            btnUn.style.background = hideUnrated ? '#e0e0e0' : '#f5f5f5';
            console.log(`Hide unrated: ${hideUnrated}`);
            debouncedFilterMarkers();
        };

        const btnShow = document.createElement('button');
        btnShow.textContent = 'Show All';
        btnShow.style.cssText = 'padding: 4px 8px; border: 1px solid #999; border-radius: 3px; background: #f5f5f5; cursor: pointer;';
        btnShow.onclick = () => {
            hideRated = false;
            hideUnrated = false;
            btn12.style.fontWeight = 'normal';
            btn12.style.background = '#f5f5f5';
            btnUn.style.fontWeight = 'normal';
            btnUn.style.background = '#f5f5f5';
            console.log('Showing all users');
            debouncedFilterMarkers();
        };

        // Add cache clear button for debugging
        const btnClear = document.createElement('button');
        btnClear.textContent = 'Clear Cache';
        btnClear.style.cssText = 'padding: 4px 8px; border: 1px solid #999; border-radius: 3px; background: #ffe0e0; cursor: pointer; font-size: 10px;';
        btnClear.onclick = () => {
            ratingsCache.clear();
            console.log('Ratings cache cleared');
            debouncedFilterMarkers();
        };

        box.append(btn12, btnUn, btnShow, btnClear);
        document.body.appendChild(box);
    }

    // === Keep filters active on map updates ===
    function observeMap() {
        const observer = new MutationObserver((mutations) => {
            let shouldFilter = false;

            mutations.forEach(mutation => {
                // Check if new user markers were added
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList?.contains('marker-container') ||
                            node.querySelector?.('.marker-container.user[id]')) {
                            shouldFilter = true;
                        }
                    }
                });
            });

            if (shouldFilter && (hideRated || hideUnrated)) {
                debouncedFilterMarkers();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // === Initialization ===
    function initialize() {
        console.log('Sniffies rating filter initializing...');
        injectControls();
        observeMap();

        // Initial filter after a short delay to let the page load
        setTimeout(() => {
            if (hideRated || hideUnrated) {
                filterMarkers();
            }
        }, 1000);
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initialize, 1500);
        });
    } else {
        setTimeout(initialize, 1500);
    }
})();