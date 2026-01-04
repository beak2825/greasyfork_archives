// ==UserScript==
// @name         Last Action Viewer by Mr_Awaken[3255504]
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Shows player's last action on long-click, with API key management
// @author       Mr_Awaken 
// @match        https://www.torn.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @connect      api.torn.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/542865/Last%20Action%20Viewer%20by%20Mr_Awaken%5B3255504%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/542865/Last%20Action%20Viewer%20by%20Mr_Awaken%5B3255504%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof GM_setValue === 'undefined' && typeof GM !== 'undefined') {
        const GM_getValue = function(key, defaultValue) {
            let value;
            try {
                value = localStorage.getItem('GMcompat_' + key);
                if (value !== null) {
                    return JSON.parse(value);
                }
                GM.getValue(key, defaultValue).then(val => {
                    if (val !== undefined) {
                        localStorage.setItem('GMcompat_' + key, JSON.stringify(val));
                    }
                });
                return defaultValue;
            } catch (e) {
                console.error('Error in GM_getValue compatibility:', e);
                return defaultValue;
            }
        };
        const GM_setValue = function(key, value) {
            try {
                localStorage.setItem('GMcompat_' + key, JSON.stringify(value));
                GM.setValue(key, value);
            } catch (e) {
                console.error('Error in GM_setValue compatibility:', e);
            }
        };
        const GM_deleteValue = function(key) {
            try {
                localStorage.removeItem('GMcompat_' + key);
                GM.deleteValue(key);
            } catch (e) {
                console.error('Error in GM_deleteValue compatibility:', e);
            }
        };
        const GM_listValues = function() {
            const keys = [];
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith('GMcompat_')) {
                        keys.push(key.substring(9));
                    }
                }
            } catch (e) {
                console.error('Error in GM_listValues compatibility:', e);
            }
            return keys;
        };
        window.GM_getValue = GM_getValue;
        window.GM_setValue = GM_setValue;
        window.GM_deleteValue = GM_deleteValue;
        window.GM_listValues = GM_listValues;
    }

    const CACHE_DURATION_MS = 60000;
    let currentDarkMode = document.body.classList.contains('dark-mode');
    const scriptSettings = {
        apiKey: GM_getValue("lastActionApiKey") || "",
    };

    const updateStyles = () => {
        let styleEl = document.getElementById('last-action-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'last-action-styles';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
            .last-action-menu {
                position: fixed;
                background: ${currentDarkMode ? '#333' : '#fff'};
                color: ${currentDarkMode ? '#fff' : '#333'};
                border: 1px solid ${currentDarkMode ? '#555' : '#ddd'};
                padding: 10px;
                border-radius: 5px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                z-index: 99999;
                min-width: 200px;
                max-width: 280px;
                pointer-events: none;
                transition: opacity 0.2s ease;
                font-size: 13px;
                line-height: 1.4;
            }
            .bazaar-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 99999;
            }
            .bazaar-settings-modal {
                background-color: #fff;
                border-radius: 8px;
                padding: 24px;
                width: 500px;
                max-width: 95vw;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                position: relative;
                z-index: 100000;
                font-family: 'Arial', sans-serif;
            }
            .bazaar-settings-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #333;
            }
            .bazaar-settings-card {
                background: #f8f9fa;
                border-radius: 6px;
                padding: 16px;
                margin-bottom: 16px;
            }
            .bazaar-settings-card h3 {
                margin: 0 0 12px 0;
                font-size: 16px;
                color: #333;
            }
            .bazaar-input-group {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            }
            .bazaar-modern-input {
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                width: 100%;
            }
            .bazaar-help-text {
                font-size: 12px;
                color: #666;
                margin: 8px 0 0 0;
                line-height: 1.4;
            }
            .bazaar-settings-buttons {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 20px;
            }
            .bazaar-settings-save, .bazaar-settings-cancel {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            .bazaar-settings-save {
                background: #28a745;
                color: white;
            }
            .bazaar-settings-cancel {
                background: #6c757d;
                color: white;
            }
            .dark-mode .bazaar-settings-modal {
                background-color: #2a2a2a;
                color: #e0e0e0;
                border: 1px solid #444;
            }
            .dark-mode .bazaar-settings-title {
                color: #e0e0e0;
            }
            .dark-mode .bazaar-settings-card {
                background: #3a3a3a;
                border: 1px solid #555;
            }
            .dark-mode .bazaar-settings-card h3 {
                color: #e0e0e0;
            }
            .dark-mode .bazaar-modern-input {
                background: #4a4a4a;
                border-color: #666;
                color: #e0e0e0;
            }
            .dark-mode .bazaar-help-text {
                color: #aaa;
            }
            .last-action-info {
                color: inherit;
                font-size: inherit;
            }
            /* Add more styles as needed from the bazaar script */
        `;
    };
    updateStyles();

    const darkModeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const newDarkMode = document.body.classList.contains('dark-mode');
                if (newDarkMode !== currentDarkMode) {
                    currentDarkMode = newDarkMode;
                    updateStyles();
                }
            }
        });
    });
    darkModeObserver.observe(document.body, { attributes: true });

    function fetchJSON(url, callback) {
        let retryCount = 0;
        const MAX_RETRIES = 2;
        const TIMEOUT_MS = 10000;
        const RETRY_DELAY_MS = 2000;

        function makeRequest(options) {
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                return GM_xmlhttpRequest(options);
            } else if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined') {
                return GM.xmlHttpRequest(options);
            } else {
                console.error('Neither GM_xmlhttpRequest nor GM.xmlHttpRequest are available');
                options.onerror && options.onerror(new Error('XMLHttpRequest API not available'));
                return null;
            }
        }

        function attemptFetch() {
            let timeoutId = setTimeout(() => {
                console.warn(`Request to ${url} timed out, ${retryCount < MAX_RETRIES ? 'retrying...' : 'giving up.'}`);
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    setTimeout(attemptFetch, RETRY_DELAY_MS);
                } else {
                    callback(null);
                }
            }, TIMEOUT_MS);

            makeRequest({
                method: 'GET',
                url,
                timeout: TIMEOUT_MS,
                onload: res => {
                    clearTimeout(timeoutId);
                    try {
                        if (res.status >= 200 && res.status < 300) {
                            callback(JSON.parse(res.responseText));
                        } else {
                            console.warn(`Request to ${url} failed with status ${res.status}`);
                            if (retryCount < MAX_RETRIES) {
                                retryCount++;
                                setTimeout(attemptFetch, RETRY_DELAY_MS);
                            } else {
                                callback(null);
                            }
                        }
                    } catch (e) {
                        console.error(`Error parsing response from ${url}:`, e);
                        callback(null);
                    }
                },
                onerror: (error) => {
                    clearTimeout(timeoutId);
                    console.warn(`Request to ${url} failed:`, error);
                    if (retryCount < MAX_RETRIES) {
                        retryCount++;
                        setTimeout(attemptFetch, RETRY_DELAY_MS);
                    } else {
                        callback(null);
                    }
                },
                ontimeout: () => {
                    clearTimeout(timeoutId);
                    console.warn(`Request to ${url} timed out natively`);
                    if (retryCount < MAX_RETRIES) {
                        retryCount++;
                        setTimeout(attemptFetch, RETRY_DELAY_MS);
                    } else {
                        callback(null);
                    }
                }
            });
        }
        attemptFetch();
    }

    function getCache(key) {
        try {
            const cached = GM_getValue(key);
            if (cached) {
                const payload = JSON.parse(cached);
                if (Date.now() - payload.timestamp < CACHE_DURATION_MS) return payload.data;
            }
        } catch (e) {}
        return null;
    }

    function setCache(key, data) {
        try {
            GM_setValue(key, JSON.stringify({ timestamp: Date.now(), data }));
        } catch (e) {}
    }

    function loadSettings() {
        try {
            scriptSettings.apiKey = GM_getValue("lastActionApiKey") || "";
        } catch (e) {
            console.error("Oops, settings failed to load:", e);
        }
    }

    function saveSettings() {
        try {
            GM_setValue("lastActionApiKey", scriptSettings.apiKey || "");
        } catch (e) {
            console.error("Settings save hiccup:", e);
        }
    }

    loadSettings();

    if (!scriptSettings.apiKey) {
        openLastActionSettingsModal();
    }

    function openLastActionSettingsModal() {
        const overlay = document.createElement("div");
        overlay.className = "bazaar-modal-overlay";
        const modal = document.createElement("div");
        modal.className = "bazaar-settings-modal";
        modal.innerHTML = `
            <div class="bazaar-settings-title">🛠️ Last Action Viewer Configuration</div>
            <div class="bazaar-tab-content active" id="tab-settings" style="max-height: 350px; overflow-y: auto;">
                <div class="bazaar-settings-grid">
                    <div class="bazaar-settings-card">
                        <h3>🔑 API Authentication</h3>
                        <div class="bazaar-input-group">
                            <input type="text" id="last-action-api-key" value="${scriptSettings.apiKey || ''}" placeholder="Enter your Torn API key" class="bazaar-modern-input" style="flex-grow: 1;">
                        </div>
                        <p class="bazaar-help-text">Enter your Torn API key to enable the last action viewer. Data remains private.</p>
                    </div>
                </div>
            </div>
            <div class="bazaar-settings-buttons">
                <button class="bazaar-settings-save">Save Configuration</button>
                <button class="bazaar-settings-cancel">Cancel</button>
            </div>
        `;
        overlay.appendChild(modal);
        modal.querySelector('.bazaar-settings-save').addEventListener('click', () => {
            scriptSettings.apiKey = modal.querySelector('#last-action-api-key').value.trim();
            saveSettings();
            overlay.remove();
        });
        modal.querySelector('.bazaar-settings-cancel').addEventListener('click', () => {
            overlay.remove();
        });
        overlay.addEventListener('click', e => {
            if (e.target === overlay) overlay.remove();
        });
        document.body.appendChild(overlay);
    }

    function addLastActionSettingsMenuItem() {
        const menu = document.querySelector('.settings-menu');
        if (!menu || document.querySelector('.last-action-settings-button')) return;
        const li = document.createElement('li');
        li.className = 'link last-action-settings-button';
        const a = document.createElement('a');
        a.href = '#';
        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon-wrapper';
        const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgIcon.setAttribute('class', 'default');
        svgIcon.setAttribute('fill', '#fff');
        svgIcon.setAttribute('stroke', 'transparent');
        svgIcon.setAttribute('stroke-width', '0');
        svgIcon.setAttribute('width', '16');
        svgIcon.setAttribute('height', '16');
        svgIcon.setAttribute('viewBox', '0 0 640 512');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M320 32c-88.4 0-160 71.6-160 160s71.6 160 160 160 160-71.6 160-160S408.4 32 320 32zm0 288c-70.7 0-128-57.3-128-128s57.3-128 128-128 128 57.3 128 128-57.3 128-128 128z');
        const span = document.createElement('span');
        span.textContent = 'Last Action Viewer Settings';
        svgIcon.appendChild(path);
        iconDiv.appendChild(svgIcon);
        a.appendChild(iconDiv);
        a.appendChild(span);
        li.appendChild(a);
        a.addEventListener('click', e => {
            e.preventDefault();
            document.body.click();
            openLastActionSettingsModal();
        });
        const bazaarSettings = menu.querySelector('.bazaar-settings-button');
        if (bazaarSettings) {
            menu.insertBefore(li, bazaarSettings);
        } else {
            const logoutButton = menu.querySelector('li.logout');
            if (logoutButton) {
                menu.insertBefore(li, logoutButton);
            } else {
                menu.appendChild(li);
            }
        }
    }

    function initLastActionViewer() {
        const LONG_PRESS_DURATION = 500; // 500ms for long press
        let pressTimer;
        let isLongPress = false;

        function attachLongPressListeners(link) {
            // Mouse events for desktop
            link.addEventListener('mousedown', (e) => {
                isLongPress = false;
                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    handleLongPress(e, link);
                }, LONG_PRESS_DURATION);
            });

            link.addEventListener('mouseup', () => {
                clearTimeout(pressTimer);
            });

            link.addEventListener('mouseleave', () => {
                clearTimeout(pressTimer);
            });

            // Touch events for mobile
            link.addEventListener('touchstart', (e) => {
                isLongPress = false;
                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    handleLongPress(e, link);
                }, LONG_PRESS_DURATION);
            });

            link.addEventListener('touchend', () => {
                clearTimeout(pressTimer);
            });

            link.addEventListener('touchcancel', () => {
                clearTimeout(pressTimer);
            });

            // Prevent normal click behavior if it was a long press
            link.addEventListener('click', (e) => {
                if (isLongPress) {
                    e.preventDefault();
                    e.stopPropagation();
                    isLongPress = false;
                }
            });
        }

        const playerLinks = document.querySelectorAll('a[href*="profiles.php?XID="]');
        playerLinks.forEach(attachLongPressListeners);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const newLinks = node.querySelectorAll('a[href*="profiles.php?XID="]');
                            newLinks.forEach(attachLongPressListeners);
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function handleLongPress(event, link) {
        event.preventDefault();
        const playerId = new URL(link.href).searchParams.get('XID');
        if (!playerId) return;

        if (!scriptSettings.apiKey) {
            showMenu(event.clientX || event.touches[0].clientX, event.clientY || event.touches[0].clientY, 'API key not set. Please configure in settings.');
            return;
        }

        // Store player ID for when the popup appears
        window.lastActionPendingPlayerId = playerId;
        
        // Start watching for popup appearance with multiple detection methods
        watchForQuickView(playerId);
    }

    function watchForQuickView(playerId) {
        // Store the player ID globally for the miniprofile observer
        window.lastActionPendingPlayerId = playerId;
        
        // The actual injection will be handled by the miniprofile observer
        // Start a timeout to clear the pending player ID after 5 seconds
        setTimeout(() => {
            if (window.lastActionPendingPlayerId === playerId) {
                window.lastActionPendingPlayerId = null;
            }
        }, 5000);
    }
    
    function injectIntoMiniProfile(wrapper, playerId) {
        // Skip if already injected
        if (wrapper.querySelector('.last-action-info')) return;
        
        console.log('Last Action Viewer: Found miniprofile wrapper, injecting for player', playerId);
        
        // Create the container div
        const containerDiv = document.createElement('div');
        containerDiv.style.cssText = 'color: var(--default-color); font-size: 12px; line-height: 14px;';
        
        // Create the last action div with Lugburz-style formatting
        const lastActionDiv = document.createElement('div');
        lastActionDiv.innerHTML = '<b>Last action:</b> <span class="last-action-info">Loading...</span>';
        
        // Create the view more button (initially hidden)
        const viewMoreBtn = document.createElement('div');
        viewMoreBtn.style.cssText = 'cursor: pointer; color: #4CAF50; text-decoration: underline; margin-top: 2px; display: none;';
        viewMoreBtn.textContent = 'View more';
        
        // Create the expanded stats div (initially hidden)
        const expandedDiv = document.createElement('div');
        expandedDiv.style.cssText = 'margin-top: 4px; display: none; font-size: 11px; line-height: 13px; padding: 6px 8px; background: rgba(0,0,0,0.8); border-radius: 4px; border: 1px solid rgba(255,255,255,0.3);';
        
        // Add click handler for view more
        viewMoreBtn.addEventListener('click', () => {
            if (expandedDiv.style.display === 'none') {
                expandedDiv.style.display = 'block';
                viewMoreBtn.textContent = 'View less';
            } else {
                expandedDiv.style.display = 'none';
                viewMoreBtn.textContent = 'View more';
            }
        });
        
        // Append elements to container
        containerDiv.appendChild(lastActionDiv);
        containerDiv.appendChild(viewMoreBtn);
        containerDiv.appendChild(expandedDiv);
        
        // Append container to wrapper
        wrapper.appendChild(containerDiv);
        
        // Fetch the API data with personalstats
        const url = `https://api.torn.com/user/${playerId}?selections=profile,personalstats&key=${scriptSettings.apiKey}`;
        fetchJSON(url, data => {
            const span = lastActionDiv.querySelector('.last-action-info');
            if (data && data.last_action) {
                const lastAction = data.last_action;
                span.textContent = lastAction.relative;
                
                // Show view more button and populate expanded stats
                if (data.personalstats) {
                    viewMoreBtn.style.display = 'block';
                    const stats = data.personalstats;
                    expandedDiv.innerHTML = `
                        <b>Xanax Taken:</b> ${stats.xantaken || 0}<br>
                        <b>Refills:</b> ${stats.refills || 0}<br>
                        <b>Attacks Won:</b> ${stats.attackswon || 0}<br>
                        <b>Defends Won:</b> ${stats.defendswon || 0}<br>
                        <b>Stat Enhancers Used:</b> ${stats.statenhancersused || 0}<br>
                        <b>Networth:</b> $${(stats.networth || 0).toLocaleString()}
                    `;
                }
            } else if (data && data.error) {
                span.textContent = `Error: ${data.error.error}`;
                span.style.color = '#f44336';
            } else {
                span.textContent = 'Failed to fetch';
                span.style.color = '#f44336';
            }
        });
    }

    function showMenu(x, y, text) {
        const menu = document.createElement('div');
        menu.className = 'last-action-menu';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.textContent = text;

        document.body.appendChild(menu);

        function removeMenu() {
            document.body.removeChild(menu);
            document.removeEventListener('click', removeMenu);
        }
        document.addEventListener('click', removeMenu, { once: true });
    }

    addLastActionSettingsMenuItem();
    initLastActionViewer();

    // Lugburz-style miniprofile observer
    const miniProfileObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            const newNodes = mutation.addedNodes;
            if (newNodes) {
                for (let i = 0; i < newNodes.length; i++) {
                    const node = newNodes[i];
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check for profile-mini-root
                        if (node.id && node.id === 'profile-mini-root') {
                            miniProfileObserver.disconnect();
                            miniProfileObserver.observe(node, { subtree: true, childList: true });
                        } 
                        // Check for user profile wrapper (Lugburz style)
                        else if (node.className && node.className.indexOf && node.className.indexOf('profile-mini-_userProfileWrapper___') > -1) {
                            // Only inject if we have a pending player ID from long press
                            if (window.lastActionPendingPlayerId) {
                                const playerId = window.lastActionPendingPlayerId;
                                window.lastActionPendingPlayerId = null; // Clear it
                                injectIntoMiniProfile(node, playerId);
                            }
                        }
                        // Also check children for the wrapper class
                        else if (node.querySelectorAll) {
                            const wrappers = node.querySelectorAll('[class*="profile-mini-_userProfileWrapper___"]');
                            wrappers.forEach(wrapper => {
                                if (window.lastActionPendingPlayerId) {
                                    const playerId = window.lastActionPendingPlayerId;
                                    window.lastActionPendingPlayerId = null;
                                    injectIntoMiniProfile(wrapper, playerId);
                                }
                            });
                        }
                    }
                }
            }
        });
    });

    // Start observing the entire body for miniprofile elements
    miniProfileObserver.observe(document.body, { subtree: true, childList: true });

    const menuObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('settings-menu')) {
                        addLastActionSettingsMenuItem();
                        break;
                    }
                }
            }
        });
    });
    menuObserver.observe(document.body, { childList: true, subtree: true });

})();