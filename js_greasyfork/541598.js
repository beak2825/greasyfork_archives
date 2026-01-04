// ==UserScript==
// @name         Get Zyxel Circle User Info
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Get Zyxel Circle User Info with Web API and Digital Clock
// @author       Rick.Chen
// @match        https://beta.circle.zyxel.com/*
// @exclude      https://beta.circle.zyxel.com/landing*
// @exclude      https://beta.circle.zyxel.com/callback*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/541598/Get%20Zyxel%20Circle%20User%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/541598/Get%20Zyxel%20Circle%20User%20Info.meta.js
// ==/UserScript==

/*
Changelog:

v1.0  - Initial version: Show account, account_id, mzc_account_id in panel.
v1.1  - Add minimize/restore panel button (–/Show User Info).
v1.2  - Add PAYG setting value display (from /payg/setting, regex parse).
v1.3  - Add debug, only show console log/error when debug=1.
v1.4  - All UI/label/console log messages in English, panel UI/logic refactored.
v1.5  - SPA compatibility fix, POSTPAY field support for license_store/detail page.
v1.6  - Fix POSTPAY field not displaying on /payg/introduction/detail page.
      - Support auto-detect window.payg_setting_app and #payg_detail_app.__vue__ until POSTPAYENABLE is found.
      - Add detailed comments for maintainability.
v1.7  - Fix POSTPAY detection issue by using GM_xmlhttpRequest API approach.
      - Call /payg/introduction/price API to get POSTPAYENABLE status.
      - Avoid Tampermonkey execution environment limitations.
      - Support all pages with POSTPAYENABLE functionality.
v1.8  - Fix mzc_account_id display issue on non-dashboard pages.
      - Only attempt to get mzc_account_id on dashboard page.
      - Show "N/A (Dashboard only)" on other pages.
v1.9  - Fix POSTPAYENABLE detection logic to avoid false positives.
      - Remove incorrect inference logic based on price data availability.
      - Show "Not found" when POSTPAYENABLE field is not present in API response.
v2.0  - Enhanced POSTPAYENABLE detection with multiple API endpoints.
      - Try multiple API endpoints to find POSTPAYENABLE status.
      - Support JSON and HTML parsing for different endpoint types.
      - Fallback mechanism when one endpoint fails.
v2.1  - Improved HTML response handling for POSTPAYENABLE detection.
      - Better error handling for non-JSON responses.
      - Multiple regex patterns to find POSTPAYENABLE in HTML content.
      - Enhanced logging for debugging HTML parsing.
v2.2  - Optimized POSTPAYENABLE detection with debug mode control.
      - All POSTPAY detection logs now controlled by debug mode.
      - Cleaner console output in normal mode.
      - Improved code structure and readability.
v2.3  - Fixed togglePanel function not defined error.
      - Replaced undefined togglePanel with proper show/hide logic.
      - Tampermonkey menu now works correctly.
v2.4  - Added digital clock feature.
      - Display current date and time (YYYY-MM-DD HH:MM:SS).
      - Real-time updates every second.
      - Clean and readable time format.
v2.5  - Optimized code structure and performance.
      - Added new API endpoint /setting/get_user_info for better account_id detection.
      - Prioritized userEmail extraction from DOM for username display.
      - Consolidated duplicate DOM search logic.
      - Improved error handling and code readability.
v2.6  - Add excluded URL: callback
v2.7  - Add Country field to display country_name from get_user_info API
      - Support multiple API endpoints for country_name detection
      - Include DOM fallback mechanism for country_name extraction
v2.8  - Updated for Vue 3 Composition API architecture
      - Modified mzc_account_id extraction to support Vue 3 ref() syntax
      - Updated POSTPAYENABLE detection to match const POSTPAYENABLE = ref(true) format
      - Enhanced regex patterns to handle Vue 3 ref() with various formats (with/without const, spaces, semicolons)
      - Improved code structure and added comprehensive comments
      - Maintained backward compatibility with legacy formats
*/

(function() {
    'use strict';

    let debug = 0; // 1=debug mode, 0=normal mode

    // ====== Control Panel UI ======
    GM_addStyle(`
        .user-info-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 12px;
            max-width: 300px;
        }
        .user-info-panel h3 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 14px;
        }
        .user-info-item {
            margin: 5px 0;
            padding: 5px;
            background: #f5f5f5;
            border-radius: 3px;
        }
        .user-info-label {
            font-weight: bold;
            color: #666;
        }
        .user-info-value {
            color: #333;
            word-break: break-all;
        }
        .clock-item {
            margin: 5px 0;
            padding: 8px;
            background: #e8f4fd;
            border-radius: 3px;
            border-left: 3px solid #007cba;
        }
        .clock-label {
            font-weight: bold;
            color: #007cba;
            font-size: 11px;
        }
        .clock-value {
            color: #333;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            font-weight: bold;
            text-align: center;
            margin-top: 3px;
        }
        .refresh-btn {
            background: #007cba;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 10px;
            width: 100%;
        }
        .refresh-btn:hover {
            background: #005a87;
        }
    `);

    let panel = null;
    let isPanelVisible = true;
    let clockInterval = null;

    // ====== Create Control Panel ======
    function createPanel() {
        panel = document.createElement('div');
        panel.className = 'user-info-panel';
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">Circle User Info</h3>
                <button id="minimize-user-info-panel" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #888;">–</button>
            </div>
            <div id="user-info-content">
                <div class="user-info-item">
                    <span class="user-info-label">Account:</span>
                    <div class="user-info-value" id="username">Loading...</div>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">Circle Account ID:</span>
                    <div class="user-info-value" id="account-id">Loading...</div>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">MZC Account ID:</span>
                    <div class="user-info-value" id="mzc-account-id">Loading...</div>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">PAYG:</span>
                    <div class="user-info-value" id="payg-setting-value">Loading...</div>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">POSTPAY:</span>
                    <div class="user-info-value" id="postpayenable-value">Loading...</div>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">Country:</span>
                    <div class="user-info-value" id="country-name">Loading...</div>
                </div>
                <div class="clock-item">
                    <div class="clock-label">Current Time:</div>
                    <div class="clock-value" id="current-time">Loading...</div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        if (debug) console.log('[Panel] Panel created and added to body');

        // Minimize Panel Button
        const minimizeBtn = panel.querySelector('#minimize-user-info-panel');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', showMiniButton);
        }

        // Check if clock element exists
        const clockElement = document.getElementById('current-time');
        if (clockElement) {
            if (debug) console.log('[Panel] Clock element found:', clockElement);
        } else {
            if (debug) console.error('[Panel] Clock element not found after panel creation!');
        }
    }

    // ====== Digital Clock Functions ======
    /**
     * Format current date and time as YYYY-MM-DD HH:MM:SS.
     *
     * Creates a formatted string with current date and time.
     *
     * Args:
     *     None
     *
     * Returns:
     *     string: Formatted date and time string
     */
    function getFormattedDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * Update the clock display with current time.
     *
     * Updates the clock element with formatted date and time.
     *
     * Args:
     *     None
     *
     * Returns:
     *     None
     */
    function updateClock() {
        const clockElement = document.getElementById('current-time');
        if (clockElement) {
            const timeString = getFormattedDateTime();
            clockElement.textContent = timeString;
            if (debug) console.log('[Clock] Updated time:', timeString);
        } else {
            if (debug) console.error('[Clock] Clock element not found!');
        }
    }

    /**
     * Start the clock timer for real-time updates.
     *
     * Initializes the clock and sets up interval for updates.
     *
     * Args:
     *     None
     *
     * Returns:
     *     None
     */
    function startClock() {
        // Initial update
        updateClock();

        // Set up interval for updates every second
        if (clockInterval) {
            clearInterval(clockInterval);
        }
        clockInterval = setInterval(updateClock, 1000);

        if (debug) console.log('[Clock] Started real-time clock updates');
    }

    /**
     * Stop the clock timer.
     *
     * Clears the interval to stop clock updates.
     *
     * Args:
     *     None
     *
     * Returns:
     *     None
     */
    function stopClock() {
        if (clockInterval) {
            clearInterval(clockInterval);
            clockInterval = null;
            if (debug) console.log('[Clock] Stopped clock updates');
        }
    }

    // ====== Minimize/Restore Panel ======
    let miniBtn = null;
    function showMiniButton() {
        if (panel) panel.style.display = 'none';
        if (!miniBtn) {
            miniBtn = document.createElement('button');
            miniBtn.textContent = 'Show User Info';
            miniBtn.style.position = 'fixed';
            miniBtn.style.top = '10px';
            miniBtn.style.right = '10px';
            miniBtn.style.zIndex = '10001';
            miniBtn.style.background = '#007cba';
            miniBtn.style.color = 'white';
            miniBtn.style.border = 'none';
            miniBtn.style.borderRadius = '5px';
            miniBtn.style.padding = '6px 12px';
            miniBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            miniBtn.style.cursor = 'pointer';
            miniBtn.addEventListener('click', restorePanel);
            document.body.appendChild(miniBtn);
        } else {
            miniBtn.style.display = 'block';
        }
        isPanelVisible = false;
        GM_setValue('panel_visible', false);
    }
    function restorePanel() {
        if (panel) panel.style.display = 'block';
        if (miniBtn) miniBtn.style.display = 'none';
        isPanelVisible = true;
        GM_setValue('panel_visible', true);
    }

    // ====== Show/Hide Panel ======
    function showPanel() {
        if (panel) {
            panel.style.display = 'block';
            if (miniBtn) miniBtn.style.display = 'none';
            isPanelVisible = true;
            GM_setValue('panel_visible', true);
        }
    }
    function hidePanel() {
        showMiniButton();
    }

    // ====== Update Display ======
    function updateUsernameDisplay(value, source) {
        const element = document.getElementById('username');
        if (element) {
            element.textContent = value;
            if (debug) console.log('Update Username Display:', value, source);
        } else {
            if (debug) console.error('Username element not found');
        }
    }
    function updateAccountIdDisplay(value, source) {
        const element = document.getElementById('account-id');
        if (element) {
            element.textContent = value;
            if (debug) console.log('Update account_id Display:', value, source);
        } else {
            if (debug) console.error('account-id element not found');
        }
    }
    function updateCountryDisplay(value, source) {
        const element = document.getElementById('country-name');
        if (element) {
            element.textContent = value;
            if (debug) console.log('Update Country Display:', value, source);
        } else {
            if (debug) console.error('country-name element not found');
        }
    }

    // ====== API and DOM Fetch ======
    function fetchAccountIdFromAPI() {
        // Try new API endpoint first
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://beta.circle.zyxel.com/setting/get_user_info',
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (debug) console.log('New API Response:', data);

                    if (data.success && data.account_id) {
                        if (debug) console.log('Found account_id in new API:', data.account_id);
                        updateAccountIdDisplay(data.account_id, 'from new API');
                        GM_setValue('account_id', data.account_id);

                        // Extract country_name if available - check corporate object
                        if (data.corporate && data.corporate.country_name) {
                            if (debug) console.log('Found country_name in new API:', data.corporate.country_name);
                            updateCountryDisplay(data.corporate.country_name, 'from new API');
                            GM_setValue('country_name', data.corporate.country_name);
                        } else {
                            if (debug) console.log('No country_name in new API response, trying old API for country only...');
                            fetchCountryFromOldAPI();
                        }

                        // Always try to get username from DOM (userEmail) first
                        extractUsernameFromDOM();
                    } else {
                        if (debug) console.log('New API failed, trying old API...');
                        fetchAccountIdFromOldAPI();
                    }
                } catch (e) {
                    if (debug) console.log('New API parse failed:', e);
                    fetchAccountIdFromOldAPI();
                }
            },
            onerror: function() {
                if (debug) console.log('New API request failed, trying old API...');
                fetchAccountIdFromOldAPI();
            }
        });
    }

    function fetchCountryFromOldAPI() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://beta.circle.zyxel.com/user/profile',
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (debug) console.log('Old API Response for country:', data);

                    // Extract country_name from old API if available - check corporate object
                    if (data.success && data.corporate && data.corporate.country_name) {
                        if (debug) console.log('Found country_name in old API:', data.corporate.country_name);
                        updateCountryDisplay(data.corporate.country_name, 'from old API');
                        GM_setValue('country_name', data.corporate.country_name);
                    } else if (data.success && data.data && data.data.corporate && data.data.corporate.country_name) {
                        if (debug) console.log('Found country_name in old API (in data.corporate):', data.data.corporate.country_name);
                        updateCountryDisplay(data.data.corporate.country_name, 'from old API');
                        GM_setValue('country_name', data.data.corporate.country_name);
                    } else {
                        if (debug) console.log('No country_name in old API response:', data);
                        updateCountryDisplay('No country_name in API response', 'API Error');
                        extractCountryFromDOM();
                    }
                } catch (e) {
                    if (debug) console.log('Old API request failed for country:', e);
                    updateCountryDisplay('API request failed', 'API Error');
                    extractCountryFromDOM();
                }
            },
            onerror: function() {
                if (debug) console.log('Old API request failed for country');
                updateCountryDisplay('API request failed', 'API Error');
                extractCountryFromDOM();
            }
        });
    }

    function fetchAccountIdFromOldAPI() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://beta.circle.zyxel.com/user/profile',
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (debug) console.log('Old API Response:', data);

                    // Extract username
                    if (data.success && data.user && data.user.username) {
                        if (debug) console.log('Found username in old API:', data.user.username);
                        updateUsernameDisplay(data.user.username, 'from old API');
                        GM_setValue('username', data.user.username);
                    } else if (data.success && data.username) {
                        if (debug) console.log('Found username in old API (direct):', data.username);
                        updateUsernameDisplay(data.username, 'from old API');
                        GM_setValue('username', data.username);
                    } else {
                        if (debug) console.log('No username in old API response:', data);
                        updateUsernameDisplay('No username in API response', 'API Error');
                        extractUsernameFromDOM();
                    }

                    // Extract account_id
                    if (data.success && data.account_id) {
                        if (debug) console.log('Found account_id in old API:', data.account_id);
                        updateAccountIdDisplay(data.account_id, 'from old API');
                        GM_setValue('account_id', data.account_id);
                    } else if (data.success && data.data && data.data.account_id) {
                        if (debug) console.log('Found account_id in old API (in data):', data.data.account_id);
                        updateAccountIdDisplay(data.data.account_id, 'from old API');
                        GM_setValue('account_id', data.data.account_id);
                    } else {
                        if (debug) console.log('No account_id in old API response:', data);
                        updateAccountIdDisplay('No account_id in API response', 'API Error');
                        extractAccountIdFromDOM();
                    }

                    // Extract country_name from old API if available - check corporate object
                    if (data.success && data.corporate && data.corporate.country_name) {
                        if (debug) console.log('Found country_name in old API:', data.corporate.country_name);
                        updateCountryDisplay(data.corporate.country_name, 'from old API');
                        GM_setValue('country_name', data.corporate.country_name);
                    } else if (data.success && data.data && data.data.corporate && data.data.corporate.country_name) {
                        if (debug) console.log('Found country_name in old API (in data.corporate):', data.data.corporate.country_name);
                        updateCountryDisplay(data.data.corporate.country_name, 'from old API');
                        GM_setValue('country_name', data.data.corporate.country_name);
                    } else {
                        if (debug) console.log('No country_name in old API response, trying DOM...');
                        extractCountryFromDOM();
                    }
                } catch (e) {
                    if (debug) console.log('Old API request failed:', e);
                    updateAccountIdDisplay('API request failed', 'API Error');
                    updateUsernameDisplay('API request failed', 'API Error');
                    updateCountryDisplay('API request failed', 'API Error');
                    extractAccountIdFromDOM();
                    extractUsernameFromDOM();
                    extractCountryFromDOM();
                }
            },
            onerror: function() {
                if (debug) console.log('Old API request failed');
                updateAccountIdDisplay('API request failed', 'API Error');
                updateUsernameDisplay('API request failed', 'API Error');
                updateCountryDisplay('API request failed', 'API Error');
                extractAccountIdFromDOM();
                extractUsernameFromDOM();
                extractCountryFromDOM();
            }
        });
    }

    /**
     * Generic DOM search function for any field.
     *
     * Searches for a field value in various DOM locations.
     *
     * Args:
     *     fieldName: string - The field name to search for
     *     elementId: string - The element ID to update
     *     storageKey: string - The GM storage key
     *
     * Returns:
     *     string|null: The found value or null if not found
     */
    function searchFieldInDOM(fieldName, elementId, storageKey) {
        const html = document.documentElement.outerHTML;

        // Regex patterns for different formats
        const patterns = [
            new RegExp(`${fieldName}\\s*[:=]\\s*['"\`]([^'"\`]+)['"\`]`),
            new RegExp(`data-${fieldName.replace(/_/g, '-')}\\s*=\\s*['"\`]([^'"\`]+)['"\`]`),
            new RegExp(`"${fieldName}"\\s*:\\s*"([^"]+)"`),
            new RegExp(`'${fieldName}'\\s*:\\s*'([^']+)'`)
        ];

        // Try regex patterns
        for (let pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                if (debug) console.log(`Found ${fieldName} in DOM (regex):`, match[1]);
                return match[1];
            }
        }

        // Try DOM elements
        const selectors = [
            `meta[name="${fieldName}"]`,
            `meta[property="${fieldName}"]`,
            `input[name="${fieldName}"]`,
            `input[id="${fieldName}"]`,
            `[data-${fieldName.replace(/_/g, '-')}]`
        ];

        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                const value = element.getAttribute('content') ||
                             element.getAttribute(`data-${fieldName.replace(/_/g, '-')}`) ||
                             element.value ||
                             element.textContent;
                if (value && value.trim()) {
                    if (debug) console.log(`Found ${fieldName} in DOM element:`, value.trim());
                    return value.trim();
                }
            }
        }

        return null;
    }

    // Backup to get account_id
    function extractAccountIdFromDOM() {
        const value = searchFieldInDOM('account_id', 'account-id', 'account_id');
        if (value) {
            updateAccountIdDisplay(value, 'From DOM');
            GM_setValue('account_id', value);
        } else {
            if (debug) console.log('account_id not found in DOM');
            updateAccountIdDisplay('Not found', 'DOM search');
        }
    }

    function extractUsernameFromDOM() {
        const html = document.documentElement.outerHTML;

        // Only try to find userEmail variable
        const emailMatch = html.match(/var\s+userEmail\s*=\s*['"`]([^'"`]+)['"`]/);
        if (emailMatch) {
            if (debug) console.log('Found userEmail in DOM:', emailMatch[1]);
            updateUsernameDisplay(emailMatch[1], 'From DOM (email)');
            GM_setValue('username', emailMatch[1]);
        } else {
            if (debug) console.log('userEmail not found in DOM');
            updateUsernameDisplay('Not found', 'DOM search');
        }
    }

    function extractCountryFromDOM() {
        const value = searchFieldInDOM('country_name', 'country-name', 'country_name');
        if (value) {
            updateCountryDisplay(value, 'From DOM');
            GM_setValue('country_name', value);
        } else {
            if (debug) console.log('country_name not found in DOM');
            updateCountryDisplay('Not found', 'DOM search');
        }
    }

    /**
     * Extract mzc_account_id from Vue 3 Composition API code.
     *
     * Searches for mzc_account_id value in HTML using regex patterns to match
     * Vue 3 ref() syntax. Only executes on dashboard page, shows 'N/A' on other pages.
     *
     * Supported formats:
     *   - const mzc_account_id = ref('value');
     *   - mzc_account_id = ref('value');
     *   - mzc_account_id: 'value' (legacy format)
     *
     * Args:
     *     None
     *
     * Returns:
     *     None
     *
     * Note:
     *     Only dashboard page extracts the value, other pages display 'N/A (Dashboard only)'.
     *     Updates both the UI element and GM storage if value is found.
     */
    function extractMzcAccountId() {
        const mzcAccountIdEl = document.getElementById('mzc-account-id');
        
        // Check if we're on dashboard page
        if (!window.location.pathname.includes('/dashboard')) {
            if (mzcAccountIdEl) {
                mzcAccountIdEl.textContent = 'N/A (Dashboard only)';
            }
            return;
        }
        
        // Get full HTML content for pattern matching
        const html = document.documentElement.outerHTML;
        let mzcAccountIdValue = 'Not found';
        
        // Regex patterns to match Vue 3 ref() syntax
        // Pattern 1: mzc_account_id = ref('value') - handles with/without const, spaces, semicolon
        // Pattern 2: const mzc_account_id = ref('value') - explicit const keyword
        // Pattern 3: mzc_account_id: 'value' - legacy format (backward compatibility)
        const patterns = [
            /mzc_account_id\s*=\s*ref\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/,
            /const\s+mzc_account_id\s*=\s*ref\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/,
            /mzc_account_id\s*:\s*['"`]([^'"`]+)['"`]/
        ];
        
        // Try each pattern until we find a match
        let match = null;
        for (let pattern of patterns) {
            match = html.match(pattern);
            if (match) {
                mzcAccountIdValue = match[1];
                if (debug) {
                    console.log('[Tampermonkey] Found mzc_account_id using pattern:', pattern);
                    console.log('[Tampermonkey] Full match:', match[0]);
                    console.log('[Tampermonkey] Extracted value:', mzcAccountIdValue);
                }
                break;
            }
        }
        
        // Debug output if pattern matching failed
        if (!match) {
            const mzcIndex = html.indexOf('mzc_account_id');
            if (mzcIndex !== -1) {
                const snippet = html.substring(mzcIndex, mzcIndex + 200);
                if (debug) {
                    console.log('[Tampermonkey] mzc_account_id found but pattern match failed');
                    console.log('[Tampermonkey] Snippet:', snippet);
                    
                    // Check if 'ref' exists in the snippet for debugging
                    const refIndex = snippet.indexOf('ref');
                    if (refIndex !== -1) {
                        console.log('[Tampermonkey] Found "ref" at position', refIndex, 'in snippet');
                        console.log('[Tampermonkey] Context around ref:', 
                            snippet.substring(Math.max(0, refIndex - 20), refIndex + 50));
                    } else {
                        console.log('[Tampermonkey] "ref" not found in snippet');
                    }
                }
            } else {
                if (debug) {
                    console.log('[Tampermonkey] mzc_account_id not found in HTML at all');
                }
            }
        }
        
        // Update UI element with extracted value
        if (mzcAccountIdEl) {
            mzcAccountIdEl.textContent = mzcAccountIdValue;
        }
        
        // Save to GM storage if value was successfully extracted
        if (match) {
            GM_setValue('mzc_account_id', mzcAccountIdValue);
        }
    }

    // ====== Tampermonkey Menu ======
    function registerMenuCommands() {
        GM_registerMenuCommand('Toggle Panel', function() {
            if (isPanelVisible) {
                hidePanel();
            } else {
                showPanel();
            }
        });
    }

    /**
     * Initialize data fetching and clock.
     *
     * Starts all data collection processes and clock updates.
     *
     * Args:
     *     None
     *
     * Returns:
     *     None
     */
    function initializeDataFetch() {
        if (debug) console.log('[Init] Starting data fetch and clock...');
        fetchAccountIdFromAPI();
        extractMzcAccountId();
        fetchPaygSetting();
        fetchPostPayEnableFromVue();
        startClock(); // Start the digital clock
    }

    // ====== Initialize ======
    function init() {
        registerMenuCommands();

        function setupPanel() {
            createPanel();
            const wasVisible = GM_getValue('panel_visible', true);
            if (!wasVisible) {
                hidePanel();
            }
            setTimeout(initializeDataFetch, 500);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupPanel);
        } else {
            setupPanel();
        }
    }
    // ====== Start Script ======
    init();

    function fetchPaygSetting() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://beta.circle.zyxel.com/payg/setting',
            onload: function(response) {
                try {
                    const html = response.responseText;
                    let paygSettingValue = 'Not found';
                    
                    // Try multiple patterns to match Vue 3 ref syntax
                    // Pattern 1: const paygSetting = ref('value'); (with const and semicolon)
                    let match = html.match(/const\s+paygSetting\s*=\s*ref\(['"](\w+)['"]\)\s*;/);
                    if (!match) {
                        // Pattern 2: const paygSetting = ref('value') (with const, no semicolon)
                        match = html.match(/const\s+paygSetting\s*=\s*ref\(['"](\w+)['"]\)/);
                    }
                    if (!match) {
                        // Pattern 3: paygSetting = ref('value'); (without const, with semicolon)
                        match = html.match(/paygSetting\s*=\s*ref\(['"](\w+)['"]\)\s*;/);
                    }
                    if (!match) {
                        // Pattern 4: paygSetting = ref('value') (without const, no semicolon)
                        match = html.match(/paygSetting\s*=\s*ref\(['"](\w+)['"]\)/);
                    }
                    if (!match) {
                        // Pattern 5: Original pattern (backward compatibility)
                        match = html.match(/paygSetting\s*:\s*['"](\w+)['"]/);
                    }
                    
                    if (match) {
                        paygSettingValue = match[1];
                        if (debug) console.log('[Tampermonkey] paygSetting found:', paygSettingValue);
                    } else {
                        if (debug) {
                            console.log('[Tampermonkey] paygSetting not found in HTML');
                            // Search for paygSetting in HTML to help debug
                            const paygIndex = html.indexOf('paygSetting');
                            if (paygIndex !== -1) {
                                const snippet = html.substring(Math.max(0, paygIndex - 50), paygIndex + 200);
                                console.log('[Tampermonkey] paygSetting context:', snippet);
                            }
                        }
                    }
                    document.getElementById('payg-setting-value').textContent = paygSettingValue;
                } catch (e) {
                    if (debug) console.error('[Tampermonkey] Error parsing paygSetting:', e);
                    document.getElementById('payg-setting-value').textContent = 'Parse error';
                }
            },
            onerror: function() {
                document.getElementById('payg-setting-value').textContent = 'Request error';
            }
        });
    }

    /**
     * Fetch POSTPAYENABLE status from multiple API endpoints.
     *
     * Tries different API endpoints to get POSTPAYENABLE value,
     * and updates panel display with the result.
     *
     * Args:
     *     None
     *
     * Returns:
     *     None
     */
    function fetchPostPayEnableFromVue() {
        if (debug) console.log('[Tampermonkey] Starting POSTPAY detection via multiple APIs...');

        // Try multiple API endpoints
        const apiEndpoints = [
            'https://beta.circle.zyxel.com/payg/introduction/detail',
            'https://beta.circle.zyxel.com/payg/setting',
            'https://beta.circle.zyxel.com/user/profile',
            'https://beta.circle.zyxel.com/dashboard'
        ];

        let currentEndpointIndex = 0;

        function tryNextEndpoint() {
            if (currentEndpointIndex >= apiEndpoints.length) {
                // All endpoints tried, show "Not found"
                let panelEl = document.getElementById('postpayenable-value');
                if (panelEl) {
                    panelEl.textContent = 'Not found';
                }
                if (debug) console.log('[Tampermonkey][POSTPAY] All endpoints tried, POSTPAYENABLE not found');
                return;
            }

            const endpoint = apiEndpoints[currentEndpointIndex];
            if (debug) console.log(`[Tampermonkey][POSTPAY] Trying endpoint: ${endpoint}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: endpoint,
                headers: {
                    'Accept': 'application/json, text/html, */*',
                    'Content-Type': 'application/json'
                },
                onload: function(response) {
                    try {
                        // Try to parse as JSON first
                        const data = JSON.parse(response.responseText);
                        if (debug) console.log(`[Tampermonkey][POSTPAY] JSON Response from ${endpoint}:`, data);

                        // Check for POSTPAYENABLE in various JSON locations
                        let postpayValue = null;

                        // Direct field
                        if (data.POSTPAYENABLE !== undefined) {
                            postpayValue = String(data.POSTPAYENABLE);
                        } else if (data.responseData && data.responseData.POSTPAYENABLE !== undefined) {
                            postpayValue = String(data.responseData.POSTPAYENABLE);
                        } else if (data.data && data.data.POSTPAYENABLE !== undefined) {
                            postpayValue = String(data.data.POSTPAYENABLE);
                        } else if (data.user && data.user.POSTPAYENABLE !== undefined) {
                            postpayValue = String(data.user.POSTPAYENABLE);
                        } else if (data.profile && data.profile.POSTPAYENABLE !== undefined) {
                            postpayValue = String(data.profile.POSTPAYENABLE);
                        }

                        if (postpayValue !== null) {
                            // Found POSTPAYENABLE in JSON
                            let panelEl = document.getElementById('postpayenable-value');
                            if (panelEl) {
                                panelEl.textContent = postpayValue;
                            }
                            if (debug) console.log(`[Tampermonkey][POSTPAY] Found POSTPAYENABLE in JSON: ${postpayValue} from ${endpoint}`);
                            return;
                        }

                        // Try next endpoint
                        currentEndpointIndex++;
                        tryNextEndpoint();

                    } catch (e) {
                        // JSON parse failed, treat as HTML
                        if (debug) console.log(`[Tampermonkey][POSTPAY] Treating ${endpoint} as HTML response`);

                        const htmlContent = response.responseText;
                        let postpayValue = null;

                        // Regex patterns to match Vue 3 ref() syntax for POSTPAYENABLE
                        // Pattern 1: const POSTPAYENABLE = ref(true); (with const and semicolon)
                        // Pattern 2: const POSTPAYENABLE = ref(true) (with const, no semicolon)
                        // Pattern 3: POSTPAYENABLE = ref(true); (without const, with semicolon)
                        // Pattern 4: POSTPAYENABLE = ref(true) (without const, no semicolon)
                        // Pattern 5: Flexible pattern - find POSTPAYENABLE and ref( in proximity
                        // Pattern 6: Legacy patterns (backward compatibility)
                        let match = htmlContent.match(/const\s+POSTPAYENABLE\s*=\s*ref\s*\(\s*(\w+)\s*\)\s*;/i);
                        if (!match) {
                            match = htmlContent.match(/const\s+POSTPAYENABLE\s*=\s*ref\s*\(\s*(\w+)\s*\)/i);
                        }
                        if (!match) {
                            match = htmlContent.match(/POSTPAYENABLE\s*=\s*ref\s*\(\s*(\w+)\s*\)\s*;/i);
                        }
                        if (!match) {
                            match = htmlContent.match(/POSTPAYENABLE\s*=\s*ref\s*\(\s*(\w+)\s*\)/i);
                        }
                        if (!match) {
                            // More flexible pattern: find POSTPAYENABLE and ref( in proximity
                            const postpayIndex = htmlContent.indexOf('POSTPAYENABLE');
                            if (postpayIndex !== -1) {
                                const snippet = htmlContent.substring(postpayIndex, postpayIndex + 100);
                                const refMatch = snippet.match(/POSTPAYENABLE[^=]*=\s*ref\s*\(\s*(\w+)\s*\)/i);
                                if (refMatch) {
                                    match = refMatch;
                                }
                            }
                        }
                        if (!match) {
                            // Legacy patterns for backward compatibility
                            const legacyPatterns = [
                                /POSTPAYENABLE\s*:\s*['"`](\w+)['"`]/i,
                                /"POSTPAYENABLE"\s*:\s*['"`](\w+)['"`]/i,
                                /'POSTPAYENABLE'\s*:\s*['"`](\w+)['"`]/i
                            ];
                            for (let pattern of legacyPatterns) {
                                const patternMatch = htmlContent.match(pattern);
                                if (patternMatch) {
                                    match = patternMatch;
                                    break;
                                }
                            }
                        }

                        if (match) {
                            postpayValue = match[1];
                            
                            // Validate: postpayValue should be "true" or "false", not "ref"
                            // If we accidentally matched "ref" as the value, try to correct it
                            if (postpayValue === 'ref') {
                                if (debug) {
                                    console.log(`[Tampermonkey][POSTPAY] Warning: Matched "ref" instead of boolean value. Full match: ${match[0]}`);
                                }
                                
                                // Try to find the actual boolean value after ref(
                                const refIndex = htmlContent.indexOf('POSTPAYENABLE');
                                if (refIndex !== -1) {
                                    const context = htmlContent.substring(refIndex, refIndex + 150);
                                    const betterMatch = context.match(/POSTPAYENABLE[^=]*=\s*ref\s*\(\s*(true|false)\s*\)/i);
                                    if (betterMatch) {
                                        postpayValue = betterMatch[1];
                                        if (debug) {
                                            console.log(`[Tampermonkey][POSTPAY] Corrected value: ${postpayValue}`);
                                        }
                                    }
                                }
                            }
                            
                            // Update UI with extracted value
                            let panelEl = document.getElementById('postpayenable-value');
                            if (panelEl) {
                                panelEl.textContent = postpayValue;
                            }
                            if (debug) {
                                console.log(`[Tampermonkey][POSTPAY] Found POSTPAYENABLE in HTML: ${postpayValue} from ${endpoint}, full match: ${match[0]}`);
                            }
                            return;
                        } else {
                            // Pattern matching failed, output debug info
                            if (debug) {
                                const postpayIndex = htmlContent.indexOf('POSTPAYENABLE');
                                if (postpayIndex !== -1) {
                                    const snippet = htmlContent.substring(
                                        Math.max(0, postpayIndex - 50), 
                                        postpayIndex + 200
                                    );
                                    console.log('[Tampermonkey][POSTPAY] POSTPAYENABLE context:', snippet);
                                }
                            }
                        }

                        // Try next endpoint
                        currentEndpointIndex++;
                        tryNextEndpoint();
                    }
                },
                onerror: function(error) {
                    if (debug) console.log(`[Tampermonkey][POSTPAY] Request error for ${endpoint}:`, error);
                    // Try next endpoint
                    currentEndpointIndex++;
                    tryNextEndpoint();
                }
            });
        }

        // Start trying endpoints
        tryNextEndpoint();
    }

    // ====== SPA Page Detection and POSTPAY Fetching ======
    let lastPath = '';
    setInterval(() => {
        if (window.location.pathname.startsWith('/license_store/detail')) {
            if (document.getElementById('postpayenable-value') && lastPath !== window.location.pathname) {
                lastPath = window.location.pathname;
                fetchPostPayEnableFromVue();
            }
        }
    }, 1000);

})();