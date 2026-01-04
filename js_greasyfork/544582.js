// ==UserScript==
// @name         Google Maps Place Validator
// @namespace    https://github.com/gncnpk/google-maps-place-validator
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @version      0.0.9
// @description  Scan Google Maps using the Nearby Search API and validate places for missing/invalid data such as website, phone number, hours or emojis in names.
// @match        https://*.google.com/maps/*@*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com/maps
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544582/Google%20Maps%20Place%20Validator.user.js
// @updateURL https://update.greasyfork.org/scripts/544582/Google%20Maps%20Place%20Validator.meta.js
// ==/UserScript==

;
(function() {
    'use strict';

    // Avoid double-inject
    if (document.getElementById('md-panel')) return;

    const STORAGE_KEY = 'md_api_key';
    const STORAGE_WHITE = 'md_whitelist';
    const STORAGE_BLACKLIST = 'md_type_blacklist';
    const STORAGE_POS = 'md_panel_pos';
    const STORAGE_SIZE = 'md_panel_size';
    const STORAGE_CACHE = 'md_results_cache';

    /**
     * Detects if text contains emojis
     */
    function hasEmoji(text) {
        if (!text || typeof text !== 'string') return false;

        // Comprehensive emoji regex pattern
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|[\u{FE00}-\u{FE0F}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F18E}]|[\u{3030}]|[\u{2B50}]|[\u{2B55}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{3297}]|[\u{3299}]|[\u{303D}]|[\u{00A9}]|[\u{00AE}]|[\u{2122}]|[\u{23F3}]|[\u{24C2}]|[\u{23E9}-\u{23EF}]|[\u{25B6}]|[\u{23F8}-\u{23FA}]/gu;

        return emojiRegex.test(text);
    }

    /**
     * Extracts the zoom level from a Google Maps URL of the form
     *    …@<lat>,<lng>,<zoom>z…
     * returns a Number or null if none found.
     */
    function getZoomFromUrl() {
        const m = window.location.href.match(
            /@[-\d.]+,[-\d.]+,([\d.]+)z/
        );
        return m ? parseFloat(m[1]) : null;
    }

    /**
     * Given a zoom level, returns a radius in meters.
     * At baseZoom=10 → baseRadius=50000.
     * Each zoom level ↑ halves the radius.
     * Clamped to [100, 50000].
     */
    function computeRadius(zoom) {
        const baseZoom = 10;
        const baseRadius = 50000;
        if (zoom === null) return baseRadius;
        const r = baseRadius * Math.pow(2, baseZoom - zoom);
        return Math.min(baseRadius, Math.max(100, Math.round(r)));
    }

    // Cache management
    let resultsCache = [];
    try {
        const cached = JSON.parse(localStorage.getItem(STORAGE_CACHE) || '[]');
        if (Array.isArray(cached)) resultsCache = cached;
    } catch {}

    function persistCache() {
        // Keep only last 10 cache entries to avoid storage bloat
        if (resultsCache.length > 10) {
            resultsCache = resultsCache.slice(-10);
        }
        localStorage.setItem(STORAGE_CACHE, JSON.stringify(resultsCache));
    }

    function generateCacheKey(lat, lng, radius) {
        // Round coordinates to avoid too many similar cache entries
        const roundLat = Math.round(lat * 1000) / 1000;
        const roundLng = Math.round(lng * 1000) / 1000;
        return `${roundLat},${roundLng},${radius}`;
    }

    // Build panel
    const panel = document.createElement('div');
    panel.id = 'md-panel';
    Object.assign(panel.style, {
        position: 'fixed',
        top: '10px',
        left: '10px',
        width: '360px',
        minWidth: '200px',
        minHeight: '120px',
        background: '#fff',
        border: '1px solid #333',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        zIndex: 999999,
        userSelect: 'none',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        resize: 'both',
        overflow: 'auto'
    });
    panel.innerHTML = `
    <div id="md-header" style="
        background:#444;color:#fff;padding:6px 8px;
        display:flex;justify-content:space-between;
        align-items:center;border-radius:4px 4px 0 0;
        cursor:move;">
      <span>Place Validator</span>
      <button id="md-close-btn" style="
          background:transparent;border:none;
          color:#fff;font-size:16px;line-height:1;
          cursor:pointer;" title="Hide panel">×</button>
    </div>
    <div id="md-content" style="padding:8px;display:flex;flex-direction:column;height:calc(100% - 40px);">
      <div id="md-key-section" style="margin-bottom:6px;flex-shrink:0;">
        <input id="md-api-key" type="text"
          placeholder="Enter API Key"
          style="width:100%;box-sizing:border-box;
                 padding:4px;border:1px solid #ccc;
                 border-radius:2px;"/>
        <button id="md-set-btn" style="
          width:100%;margin-top:4px;padding:6px;
          background:#28a;color:#fff;border:none;
          border-radius:2px;cursor:pointer;
        ">Set API Key</button>
      </div>
      <div style="margin-bottom:6px;flex-shrink:0;">
        <button id="md-scan-btn" disabled style="
          width:100%;padding:6px;
          background:#28a;color:#fff;border:none;
          border-radius:2px;cursor:pointer;
        ">Scan Nearby</button>
      </div>
      <div style="margin-bottom:6px;display:flex;gap:4px;flex-shrink:0;">
        <button id="md-cached-btn" style="
          flex:1;padding:4px;
          background:#4a4;color:#fff;border:none;
          border-radius:2px;cursor:pointer;font-size:12px;
        ">View Cached Results</button>
        <button id="md-clear-cache-btn" style="
          padding:4px 8px;
          background:#d44;color:#fff;border:none;
          border-radius:2px;cursor:pointer;font-size:12px;
        ">Clear Cache</button>
      </div>
      <div style="margin-bottom:6px;flex-shrink:0;">
        <button id="md-manage-blacklist-btn" style="
          width:100%;padding:4px;
          background:#666;color:#fff;border:none;
          border-radius:2px;cursor:pointer;font-size:12px;
        ">Manage Type Blacklist</button>
      </div>
      <div id="md-blacklist-section" style="display:none;margin-bottom:6px;background:#f5f5f5;padding:6px;border-radius:2px;flex-shrink:0;">
        <div style="font-weight:bold;margin-bottom:4px;">Blacklisted Types:</div>
        <div id="md-blacklist-display" style="font-size:12px;margin-bottom:6px;"></div>
        <input id="md-new-blacklist-type" type="text"
          placeholder="Add type (e.g., bus_stop)"
          style="width:70%;box-sizing:border-box;
                 padding:3px;border:1px solid #ccc;
                 border-radius:2px;font-size:12px;"/>
        <button id="md-add-blacklist-btn" style="
          width:25%;margin-left:2%;padding:3px;
          background:#d44;color:#fff;border:none;
          border-radius:2px;cursor:pointer;font-size:12px;
        ">Add</button>
      </div>
      <div id="md-cache-section" style="display:none;margin-bottom:6px;background:#f0f8ff;padding:6px;border-radius:2px;flex-shrink:0;">
        <div style="font-weight:bold;margin-bottom:4px;">Cached Results:</div>
        <div id="md-cache-list" style="font-size:11px;max-height:100px;overflow-y:auto;"></div>
      </div>
      <div id="md-output" style="
          flex:1;
          min-height:150px;
          overflow-x:auto;
          overflow-y:auto;
          background:#f9f9f9;padding:6px;
          border:1px solid #ccc;border-radius:2px;
          white-space:nowrap;
      "></div>
    </div>
  `;
    document.body.appendChild(panel);

    // Restore last position
    const rawPos = localStorage.getItem(STORAGE_POS);
    if (rawPos) {
        try {
            const pos = JSON.parse(rawPos);
            if (pos.top) panel.style.top = pos.top;
            if (pos.left) panel.style.left = pos.left;
        } catch {}
    }

    // Restore last size
    const rawSize = localStorage.getItem(STORAGE_SIZE);
    if (rawSize) {
        try {
            const sz = JSON.parse(rawSize);
            if (sz.width) panel.style.width = sz.width;
            if (sz.height) panel.style.height = sz.height;
        } catch {}
    }

    // Track resizes and persist
    const ro = new ResizeObserver(entries => {
        for (const entry of entries) {
            const {
                width,
                height
            } = entry.contentRect;
            localStorage.setItem(
                STORAGE_SIZE,
                JSON.stringify({
                    width: Math.round(width) + 'px',
                    height: Math.round(height) + 'px'
                })
            );
        }
    });
    ro.observe(panel);

    function adjustPanelSize() {
        const maxHeight = window.innerHeight - 100; // Leave some margin
        const maxWidth = window.innerWidth - 100;

        const currentHeight = parseInt(panel.style.height) || 400;
        const currentWidth = parseInt(panel.style.width) || 360;

        if (currentHeight > maxHeight) {
            panel.style.height = maxHeight + 'px';
        }
        if (currentWidth > maxWidth) {
            panel.style.width = maxWidth + 'px';
        }

        // Ensure panel stays within viewport
        const rect = panel.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            panel.style.left = (window.innerWidth - rect.width - 10) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            panel.style.top = (window.innerHeight - rect.height - 10) + 'px';
        }
    }

    window.addEventListener('resize', adjustPanelSize);

    // Drag support via Pointer Events
    const header = document.getElementById('md-header');
    let dragging = false,
        offsetX = 0,
        offsetY = 0;
    header.style.touchAction = 'none';

    header.addEventListener('pointerdown', e => {
        // Don't start dragging if clicking on the close button
        if (e.target.id === 'md-close-btn') {
            return;
        }

        dragging = true;
        const r = panel.getBoundingClientRect();
        offsetX = e.clientX - r.left;
        offsetY = e.clientY - r.top;
        header.setPointerCapture(e.pointerId);
        e.preventDefault();
    });

    document.addEventListener('pointermove', e => {
        if (!dragging) return;
        panel.style.left = (e.clientX - offsetX) + 'px';
        panel.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('pointerup', e => {
        if (!dragging) return;
        dragging = false;
        try {
            header.releasePointerCapture(e.pointerId);
        } catch {}
        // Persist position
        localStorage.setItem(
            STORAGE_POS,
            JSON.stringify({
                left: panel.style.left,
                top: panel.style.top
            })
        );
    });

    header.addEventListener('pointercancel', () => {
        dragging = false;
    });

    // Close/toggle button - wait for DOM to be ready
    function setupToggleButton() {
        const closeBtn = panel.querySelector('#md-close-btn');
        const contentDiv = panel.querySelector('#md-content');

        if (closeBtn && contentDiv) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Use getComputedStyle to check actual visibility
                const isHidden = window.getComputedStyle(contentDiv).display === 'none';

                if (isHidden) {
                    // Show content
                    contentDiv.style.display = 'flex';
                    closeBtn.textContent = '×';
                    closeBtn.title = 'Hide panel';
                    // Restore panel height
                    panel.style.height = '';
                    panel.style.minHeight = '120px';
                } else {
                    // Hide content
                    contentDiv.style.display = 'none';
                    closeBtn.textContent = '↑';
                    closeBtn.title = 'Show panel';
                    // Set panel height to just the header
                    panel.style.height = 'auto';
                    panel.style.minHeight = '40px';
                }
            });
        }
    }

    // Setup toggle button after a short delay to ensure DOM is ready
    setTimeout(setupToggleButton, 100);

    // Controls
    const keySection = document.getElementById('md-key-section');
    const keyInput = document.getElementById('md-api-key');
    const setBtn = document.getElementById('md-set-btn');
    const scanBtn = document.getElementById('md-scan-btn');
    const cachedBtn = document.getElementById('md-cached-btn');
    const clearCacheBtn = document.getElementById('md-clear-cache-btn');
    const cacheSection = document.getElementById('md-cache-section');
    const cacheList = document.getElementById('md-cache-list');
    const output = document.getElementById('md-output');

    // Load API key
    if (localStorage.getItem(STORAGE_KEY)) {
        keySection.style.display = 'none';
        scanBtn.disabled = false;
    }

    // Update cached button state
    function updateCacheButtonState() {
        cachedBtn.disabled = resultsCache.length === 0;
        clearCacheBtn.disabled = resultsCache.length === 0;
        if (resultsCache.length === 0) {
            cachedBtn.style.background = '#ccc';
            clearCacheBtn.style.background = '#ccc';
        } else {
            cachedBtn.style.background = '#4a4';
            clearCacheBtn.style.background = '#d44';
        }
    }

    updateCacheButtonState();

    // Whitelist
    let whitelist = [];
    try {
        const w = JSON.parse(localStorage.getItem(STORAGE_WHITE) || '[]');
        if (Array.isArray(w)) whitelist = w;
    } catch {}

    function persistWhitelist() {
        localStorage.setItem(STORAGE_WHITE, JSON.stringify(whitelist));
    }

    let typeBlacklist = ['bus_stop', 'public_bathroom', 'doctor', 'consultant', 'transit_station', 'playground', 'swimming_pool'];
    try {
        const b = JSON.parse(localStorage.getItem(STORAGE_BLACKLIST) || '[]');
        if (Array.isArray(b) && b.length > 0) typeBlacklist = b;
    } catch {}

    function persistTypeBlacklist() {
        localStorage.setItem(STORAGE_BLACKLIST, JSON.stringify(typeBlacklist));
    }

    // Blacklist management UI
    const manageBlacklistBtn = document.getElementById('md-manage-blacklist-btn');
    const blacklistSection = document.getElementById('md-blacklist-section');
    const blacklistDisplay = document.getElementById('md-blacklist-display');
    const newBlacklistInput = document.getElementById('md-new-blacklist-type');
    const addBlacklistBtn = document.getElementById('md-add-blacklist-btn');

    function updateBlacklistDisplay() {
        if (typeBlacklist.length === 0) {
            blacklistDisplay.textContent = 'None';
        } else {
            blacklistDisplay.innerHTML = typeBlacklist.map(type => {
                return `<span style="background:#ddd;padding:2px 6px;margin:2px;border-radius:2px;display:inline-block;">
                    ${type}
                    <button onclick="removeFromBlacklist('${type}')" style="background:none;border:none;color:#666;cursor:pointer;margin-left:4px;">×</button>
                </span>`;
            }).join('');
        }
    }

    // Cache management UI
    function updateCacheList() {
        if (resultsCache.length === 0) {
            cacheList.innerHTML = '<div style="color:#666;">No cached results</div>';
            return;
        }

        cacheList.innerHTML = resultsCache.map((cache, idx) => {
            const date = new Date(cache.timestamp).toLocaleString();
            const location = `${cache.lat.toFixed(3)}, ${cache.lng.toFixed(3)}`;
            return `<div style="margin-bottom:4px;padding:4px;background:#fff;border-radius:2px;">
                <div style="font-weight:bold;">${date}</div>
                <div>Location: ${location} (${cache.radius}m radius)</div>
                <div>Results: ${cache.results.length} places</div>
                <button onclick="loadCachedResult(${idx})" style="
                    background:#28a;color:#fff;border:none;
                    border-radius:2px;padding:2px 6px;cursor:pointer;
                    font-size:10px;margin-top:2px;">Load</button>
            </div>`;
        }).join('');
    }

    // Make functions globally accessible for inline onclick
    window.removeFromBlacklist = function(type) {
        typeBlacklist = typeBlacklist.filter(t => t !== type);
        persistTypeBlacklist();
        updateBlacklistDisplay();
    };

    window.loadCachedResult = function(idx) {
        if (idx >= 0 && idx < resultsCache.length) {
            const cache = resultsCache[idx];
            displayResults(cache.results, true, new Date(cache.timestamp));
            cacheSection.style.display = 'none';
        }
    };

    // Cache management event listeners
    cachedBtn.addEventListener('click', () => {
        const isVisible = cacheSection.style.display !== 'none';
        cacheSection.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) updateCacheList();
    });

    clearCacheBtn.addEventListener('click', () => {
        if (confirm('Clear all cached results?')) {
            resultsCache = [];
            localStorage.removeItem(STORAGE_CACHE);
            updateCacheButtonState();
            updateCacheList();
            cacheSection.style.display = 'none';
        }
    });

    manageBlacklistBtn.addEventListener('click', () => {
        const isVisible = blacklistSection.style.display !== 'none';
        blacklistSection.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) updateBlacklistDisplay();
    });

    addBlacklistBtn.addEventListener('click', () => {
        const newType = newBlacklistInput.value.trim().toLowerCase();
        if (newType && !typeBlacklist.includes(newType)) {
            typeBlacklist.push(newType);
            persistTypeBlacklist();
            updateBlacklistDisplay();
            newBlacklistInput.value = '';
        }
    });

    newBlacklistInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBlacklistBtn.click();
        }
    });

    // Set API key
    setBtn.addEventListener('click', () => {
        const k = keyInput.value.trim();
        if (!k) return alert('Please enter a valid API key.');
        localStorage.setItem(STORAGE_KEY, k);
        keySection.style.display = 'none';
        scanBtn.disabled = false;
    });

    // Field labels
    const FIELD_LABELS = {
        websiteUri: 'Website',
        nationalPhoneNumber: 'Phone number',
        currentOpeningHours: 'Hours',
        hasEmoji: 'Has emoji in name'
    };

    function getPlaceName(p) {
        const d = p.displayName;
        if (typeof d === 'string') return d;
        if (d && typeof d.text === 'string') return d.text;
        if (d && typeof d.name === 'string') return d.name;
        return p.id;
    }

    function findMissing(arr) {
        return arr.reduce((acc, p) => {
            // Filter out places where name is just street number + route or just route
            if (p.addressComponents && Array.isArray(p.addressComponents)) {
                const streetNumberComponent = p.addressComponents.find(
                    c => c.types && c.types.includes('street_number')
                );

                const routeComponent = p.addressComponents.find(
                    c => c.types && c.types.includes('route')
                );

                const placeName = getPlaceName(p);

                if (routeComponent) {
                    const routeShort = routeComponent.shortText;
                    const routeLong = routeComponent.longText;

                    // Skip if the place name is just the street name (short or long)
                    if (placeName === routeShort || placeName === routeLong) {
                        return acc;
                    }

                    // Skip if the place name is street number + route (any combination)
                    if (streetNumberComponent) {
                        const streetNumberShort = streetNumberComponent.shortText;
                        const streetNumberLong = streetNumberComponent.longText;

                        const combinations = [
                            `${streetNumberShort} ${routeShort}`,
                            `${streetNumberShort} ${routeLong}`,
                            `${streetNumberLong} ${routeShort}`,
                            `${streetNumberLong} ${routeLong}`
                        ];

                        if (combinations.includes(placeName)) {
                            return acc;
                        }
                    }
                }
            }

            const miss = [];
            const placeName = getPlaceName(p);

            // Check for missing data
            if (!p.websiteUri ||
                !p.websiteUri.trim()) miss.push(
                FIELD_LABELS.websiteUri
            );
            if (!p.nationalPhoneNumber ||
                !p.nationalPhoneNumber.trim()) miss.push(
                FIELD_LABELS.nationalPhoneNumber
            );
            if (!p.currentOpeningHours ||
                typeof p.currentOpeningHours !== 'object') miss.push(
                FIELD_LABELS.currentOpeningHours
            );

            // Check for emojis in name
            if (hasEmoji(placeName)) {
                miss.push(FIELD_LABELS.hasEmoji);
            }

            // Add to results if has missing data OR has emojis
            if (miss.length) {
                // capture primaryType if present
                const typeName = p.primaryTypeDisplayName?.text || ''
                acc.push({
                    id: p.id,
                    name: placeName,
                    uri: p.googleMapsUri,
                    missing: miss,
                    primaryTypeDisplayName: typeName,
                    primaryType: p.primaryType
                });
            }
            return acc;
        }, []);
    }

    function displayResults(missing, isFromCache = false, cacheDate = null) {
        if (!missing.length) {
            const message = isFromCache ?
                `✅ All places had complete data and no emojis (cached ${cacheDate ? cacheDate.toLocaleString() : ''})` :
                '✅ All places have complete data and no emojis in names.';
            output.textContent = message;
            return;
        }

        // Filter out whitelisted places
        missing = missing.filter(p => !whitelist.includes(p.id));

        if (!missing.length) {
            const message = isFromCache ?
                `✅ All remaining places had complete data and no emojis (cached ${cacheDate ? cacheDate.toLocaleString() : ''})` :
                '✅ All places have complete data and no emojis in names.';
            output.textContent = message;
            return;
        }

        // Create header with cache info
        output.innerHTML = '';

        if (isFromCache && cacheDate) {
            const cacheInfo = document.createElement('div');
            cacheInfo.style.cssText = 'background:#e6f3ff;padding:4px;margin-bottom:6px;border-radius:2px;font-size:12px;color:#0066cc;';
            cacheInfo.textContent = `📄 Cached results from ${cacheDate.toLocaleString()}`;
            output.appendChild(cacheInfo);
        }

        // Render list
        const ul = document.createElement('ul');
        ul.style.listStyle = 'disc';
        ul.style.margin = '0';
        ul.style.padding = '0 0 0 1em';

        missing.forEach(p => {
            const li = document.createElement('li');
            li.style.whiteSpace = 'nowrap';
            li.style.marginBottom = '9px';
            li.style.position = 'relative';
            li.style.paddingRight = '120px'; // Add space to prevent text from going under buttons

            const a = document.createElement('a');
            a.href = p.uri;
            a.textContent = p.name;
            a.target = '_blank';
            a.style.fontWeight = 'bold';

            // Add emoji indicator if name has emojis
            if (hasEmoji(p.name)) {
                a.style.color = '#ff6600'; // Orange color for emoji names
            }

            li.appendChild(a);

            // show type next to the link
            if (p.primaryTypeDisplayName) {
                li.appendChild(
                    document.createTextNode(
                        ` (${p.primaryTypeDisplayName})`
                    )
                );
            }
            // then show missing fields
            li.appendChild(
                document.createTextNode(
                    ' – flagged for: ' + p.missing.join(', ')
                )
            );

            // Create button container for proper alignment
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'position: absolute; right: 8px; top: 50%; transform: translateY(-50%); display: inline-flex; gap: 4px; align-items: center; background: rgba(255,255,255,0.9); border-radius: 2px; padding: 2px;';

            const btn = document.createElement('button');
            btn.textContent = 'Whitelist';
            btn.style.cssText = `
    background: #28a;
    color: #fff;
    border: none;
    border-radius: 2px;
    padding: 2px 8px;
    cursor: pointer;
    font-size: 11px;
    height: 22px;
    line-height: 1;
`;
            btn.addEventListener('click', () => {
                if (!whitelist.includes(p.id)) {
                    whitelist.push(p.id);
                    persistWhitelist();
                }
                li.remove();
                if (!ul.childElementCount) {
                    const message = isFromCache ?
                        `✅ All remaining places had complete data and no emojis (cached ${cacheDate ? cacheDate.toLocaleString() : ''})` :
                        '✅ All places have complete data and no emojis in names.';
                    output.textContent = message;
                }
            });
            buttonContainer.appendChild(btn);

            // Add blacklist button for the type (only for fresh results)
            if (p.primaryType && !isFromCache) {
                const blacklistBtn = document.createElement('button');
                blacklistBtn.textContent = 'Blacklist Type';
                blacklistBtn.style.cssText = `
        background: #d44;
        color: #fff;
        border: none;
        border-radius: 2px;
        padding: 2px 8px;
        cursor: pointer;
        font-size: 11px;
        height: 22px;
        line-height: 1;
    `;
                blacklistBtn.addEventListener('click', () => {
                    const type = p.primaryType.toLowerCase();
                    if (!typeBlacklist.includes(type)) {
                        typeBlacklist.push(type);
                        persistTypeBlacklist();
                        alert(`Added "${type}" to blacklist. Please scan again to see updated results.`);
                    }
                });
                buttonContainer.appendChild(blacklistBtn);
            }

            li.appendChild(buttonContainer);

            ul.appendChild(li);
        });

        output.appendChild(ul);
    }

    // Scan action
    scanBtn.addEventListener('click', async () => {
        output.textContent = '';
        const key = localStorage.getItem(STORAGE_KEY);
        if (!key) {
            output.textContent = '❌ API key missing.';
            return;
        }

        // Parse coords
        let lat, lng;
        try {
            const part = window.location.href.split('@')[1].split('/')[0];
            [lat, lng] = part.split(',').map(n => parseFloat(n));
            if (isNaN(lat) || isNaN(lng)) throw 0;
        } catch {
            output.textContent =
                '❌ Could not parse "@lat,lng" from URL.';
            return;
        }

        const zoom = getZoomFromUrl();
        const radius = computeRadius(zoom);
        const cacheKey = generateCacheKey(lat, lng, radius);

        // Check if we have recent cached results for this location
        const recentCache = resultsCache.find(cache => {
            const cacheAge = Date.now() - cache.timestamp;
            const maxAge = 30 * 60 * 1000; // 30 minutes
            return cache.cacheKey === cacheKey && cacheAge < maxAge;
        });

        if (recentCache) {
            const ageMinutes = Math.round((Date.now() - recentCache.timestamp) / (60 * 1000));
            if (confirm(`Found cached results from ${ageMinutes} minutes ago. Use cached results instead of making a new API request?`)) {
                displayResults(recentCache.results, true, new Date(recentCache.timestamp));
                return;
            }
        }

        const body = {
            locationRestriction: {
                circle: {
                    center: {
                        latitude: lat,
                        longitude: lng
                    },
                    radius: radius
                }
            },
            rankPreference: "DISTANCE"
        };

        // Add excludedTypes to the request body if there are any blacklisted types
        if (typeBlacklist.length > 0) {
            body.excludedTypes = typeBlacklist;
        }

        // Fetch
        let data;
        try {
            const res = await fetch(
                `https://places.googleapis.com/v1/places:searchNearby?key=` +
                `${encodeURIComponent(key)}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-FieldMask': ['places.id',
                            'places.displayName',
                            'places.websiteUri',
                            'places.nationalPhoneNumber',
                            'places.currentOpeningHours',
                            'places.googleMapsUri',
                            'places.primaryType',
                            'places.primaryTypeDisplayName',
                            'places.addressComponents'
                        ].join(",")
                    },
                    body: JSON.stringify(body)
                }
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            data = await res.json();
        } catch (err) {
            output.textContent = '❌ Fetch error: ' + err.message;
            return;
        }

        const arr = Array.isArray(data.places) ? data.places :
            Array.isArray(data.results) ? data.results : [];

        let missing = findMissing(arr);

        // Cache the results
        const cacheEntry = {
            timestamp: Date.now(),
            lat: lat,
            lng: lng,
            radius: radius,
            cacheKey: cacheKey,
            results: missing
        };

        // Remove any existing cache for this location to avoid duplicates
        resultsCache = resultsCache.filter(cache => cache.cacheKey !== cacheKey);
        resultsCache.push(cacheEntry);
        persistCache();
        updateCacheButtonState();

        displayResults(missing, false);
    });
})();
