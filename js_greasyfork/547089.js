// ==UserScript==
// @name         Torn Bounty Status Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Enhanced bounty status display with hospital timing
// @author       FishSoup
// @match        https://www.torn.com/bounties.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/547089/Torn%20Bounty%20Status%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/547089/Torn%20Bounty%20Status%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        apiBaseUrl: 'https://api.torn.com/v2/user/',
        apiParams: '/basic?striptags=true&key=',
        statusColors: {
            hospital: '#ff4444',
            jail: '#ff8800',
            traveling: '#4488ff',
            okay: '#44aa44',
            abroad: '#4488ff'
        },
        updateInterval: 10000, // 10 seconds
        apiRateLimit: {
            requestsPerMinute: 100,
            requestQueue: [],
            lastRequestTime: 0,
            callsPerSecond: 100, // Target 100 calls per second
            delayBetweenCalls: 10 // 1000ms / 100 = 10ms delay between calls
        }
    };

    // API Key management
    let apiKey = GM_getValue('tornApiKey', '');

    // Store for managing updates and intervals
    const statusManager = {
        indicators: new Map(),
        intervals: new Map(),
        updateQueue: [],
        apiCallQueue: []
    };

    // API Rate limiting with queue system
    function canMakeApiCall() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Remove requests older than 1 minute
        CONFIG.apiRateLimit.requestQueue = CONFIG.apiRateLimit.requestQueue.filter(time => time > oneMinuteAgo);
        
        // Check if we're under the rate limit
        return CONFIG.apiRateLimit.requestQueue.length < CONFIG.apiRateLimit.requestsPerMinute;
    }

    function recordApiCall() {
        CONFIG.apiRateLimit.requestQueue.push(Date.now());
    }

    // Queue system for API calls with delay
    function queueApiCall(callback) {
        statusManager.apiCallQueue.push(callback);
        processApiQueue();
    }

    let isProcessingQueue = false;

    async function processApiQueue() {
        if (isProcessingQueue || statusManager.apiCallQueue.length === 0) {
            return;
        }

        isProcessingQueue = true;

        while (statusManager.apiCallQueue.length > 0) {
            const callback = statusManager.apiCallQueue.shift();
            
            if (canMakeApiCall()) {
                await callback();
                // Wait for the specified delay before next call (50ms for 20 calls/second)
                await new Promise(resolve => setTimeout(resolve, CONFIG.apiRateLimit.delayBetweenCalls));
            } else {
                // If we hit rate limit, put the callback back and wait longer
                statusManager.apiCallQueue.unshift(callback);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        isProcessingQueue = false;
    }

    // Extract status from existing page elements
    function getExistingStatus(bountyItem) {
        // Try multiple selectors to find status information on the page
        const statusSelectors = [
            '.user-red-status',     // Hospital
            '.user-green-status',   // Okay
            '.user-blue-status',    // Traveling/Abroad
            '.user-orange-status',  // Jail
            '[class*="user-"][class*="-status"]', // Any user status class
            '.status span',         // Generic status span
            '.status'               // Status container
        ];

        for (const selector of statusSelectors) {
            const statusElement = bountyItem.querySelector(selector);
            if (statusElement) {
                const statusText = statusElement.textContent.trim().toLowerCase();
                
                // Map common status text to our status types
                if (statusText.includes('okay') || statusText.includes('online')) {
                    return 'okay';
                } else if (statusText.includes('hospital') || statusText.includes('hosp')) {
                    return 'hospital';
                } else if (statusText.includes('travel') || statusText.includes('abroad')) {
                    return 'traveling';
                } else if (statusText.includes('jail') || statusText.includes('federal')) {
                    return 'jail';
                }
                
                // Also check class names for status
                const className = statusElement.className.toLowerCase();
                if (className.includes('green')) return 'okay';
                if (className.includes('red')) return 'hospital';
                if (className.includes('blue')) return 'traveling';
                if (className.includes('orange')) return 'jail';
            }
        }
        
        return null; // Status not found on page
    }
    function isMobileLayout() {
        return document.querySelector('.ui-accordion') !== null;
    }

    // Extract user ID from profile link
    function extractUserId(profileLink) {
        const match = profileLink.match(/XID=(\d+)/);
        return match ? match[1] : null;
    }

    // Format time remaining
    function formatTimeRemaining(seconds) {
        if (seconds <= 0) return 'Released';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    // Make API call to get user status with rate limiting
    async function getUserStatus(userId) {
        if (!apiKey || !canMakeApiCall()) {
            return null;
        }

        return new Promise((resolve) => {
            recordApiCall();
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${CONFIG.apiBaseUrl}${userId}${CONFIG.apiParams}${apiKey}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            console.error(`API Error for user ${userId}:`, data.error);
                            if (data.error.code === 5) {
                                console.warn('Rate limit hit, slowing down requests');
                            }
                            resolve(null);
                            return;
                        }
                        resolve(data);
                    } catch (e) {
                        console.error('Error parsing API response:', e);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error('API request failed:', error);
                    resolve(null);
                }
            });
        });
    }

    // Create status indicator element
    function createStatusIndicator(status, timeRemaining = null, isMobile = false) {
        const indicator = document.createElement('div');
        const statusLower = status.toLowerCase();
        
        let displayContent = '';
        let color = CONFIG.statusColors[statusLower] || '#666';
        let isHospital = statusLower === 'hospital' && timeRemaining !== null;

        // Create display content based on status
        if (isHospital) {
            displayContent = formatTimeRemaining(timeRemaining);
        } else {
            // Use clear text and emojis for better visibility
            switch (statusLower) {
                case 'okay':
                    displayContent = 'OK';
                    color = '#44aa44'; // Keep green for OK
                    break;
                case 'traveling':
                case 'abroad':
                    displayContent = '✈️';
                    color = '#4488ff'; // Blue for traveling
                    break;
                case 'jail':
                    displayContent = '🔒'; // Prison/lock emoji
                    color = '#ff8800'; // Orange for jail
                    break;
                case 'hospital':
                    displayContent = '🏥'; // Hospital emoji if no timing
                    color = '#ff4444'; // Red for hospital
                    break;
                case 'loading':
                    displayContent = '⏳';
                    color = '#888'; // Gray for loading
                    break;
            }
        }

        // Consistent inline styling for both mobile and desktop (in name column)
        indicator.style.cssText = `
            display: inline-block;
            background: ${isHospital ? color : 'rgba(0,0,0,0.7)'};
            color: ${isHospital ? 'white' : (statusLower === 'okay' ? '#44aa44' : 'white')};
            padding: ${isHospital ? '2px 6px' : '2px 5px'};
            border-radius: 4px;
            font-size: ${isHospital ? '10px' : (statusLower === 'okay' ? '9px' : '11px')};
            font-weight: ${statusLower === 'okay' ? 'bold' : 'normal'};
            margin-right: 6px;
            vertical-align: middle;
            min-width: ${isHospital ? 'auto' : '22px'};
            text-align: center;
            line-height: 1.2;
            border: ${statusLower === 'okay' ? '1px solid #44aa44' : 'none'};
        `;

        indicator.textContent = displayContent;
        indicator.className = 'bounty-status-indicator';
        indicator.title = `Status: ${status}${timeRemaining !== null ? ` (${formatTimeRemaining(timeRemaining)} remaining)` : ''}`;
        indicator.dataset.userId = indicator.dataset.userId || '';
        indicator.dataset.status = statusLower;

        return indicator;
    }

    // Update user status from API
    async function updateUserStatus(userId, indicator, isMobile, isInitial) {
        try {
            const userData = await getUserStatus(userId);
            if (!userData || !userData.profile || !userData.profile.status) {
                return;
            }

            const status = userData.profile.status;
            const statusState = status.state.toLowerCase();
            
            // Update the indicator
            let timeRemaining = null;
            if (statusState === 'hospital' && status.until) {
                const currentTime = Math.floor(Date.now() / 1000);
                timeRemaining = status.until - currentTime;
            }

            // Create new indicator with updated info
            const newIndicator = createStatusIndicator(statusState, timeRemaining, isMobile);
            newIndicator.dataset.userId = userId;
            
            // Replace the old indicator
            indicator.replaceWith(newIndicator);
            
            // Update our reference
            statusManager.indicators.set(userId, newIndicator);
            
            // Set up countdown timer for hospital status
            if (statusState === 'hospital' && timeRemaining && timeRemaining > 0) {
                const countdownInterval = setInterval(() => {
                    const now = Math.floor(Date.now() / 1000);
                    const remaining = status.until - now;
                    
                    if (remaining <= 0) {
                        clearInterval(countdownInterval);
                        // Update to released/okay status
                        const releasedIndicator = createStatusIndicator('okay', null, isMobile);
                        releasedIndicator.dataset.userId = userId;
                        newIndicator.replaceWith(releasedIndicator);
                        statusManager.indicators.set(userId, releasedIndicator);
                    } else {
                        newIndicator.textContent = formatTimeRemaining(remaining);
                        newIndicator.title = `Hospital time remaining: ${formatTimeRemaining(remaining)}`;
                    }
                }, 1000);
            }
            
        } catch (error) {
            console.error(`Error updating status for user ${userId}:`, error);
        }
    }

    // Process a single bounty item
    async function processBountyItem(bountyItem, delay = 0, isQuickPass = false) {
        // Check if already processed
        if (bountyItem.querySelector('.bounty-status-indicator')) {
            return;
        }

        // Find the target name link
        const targetLink = bountyItem.querySelector('a[href*="profiles.php?XID="]');
        if (!targetLink) return;

        const userId = extractUserId(targetLink.href);
        if (!userId) return;

        const mobile = isMobileLayout();
        
        // First, try to get status from existing page elements
        const existingStatus = getExistingStatus(bountyItem);
        
        let statusIndicator;
        let needsApiCall = false;
        
        if (existingStatus) {
            // We found status on the page, use it immediately
            statusIndicator = createStatusIndicator(existingStatus, null, mobile);
            
            // Only hospital status needs API calls for timing
            needsApiCall = existingStatus === 'hospital' && apiKey;
        } else {
            // No status found on page, we'll need an API call
            statusIndicator = createStatusIndicator('loading', null, mobile);
            needsApiCall = apiKey;
        }
        
        statusIndicator.dataset.userId = userId;
        
        // Always position in name column BEFORE the player name (both mobile and desktop)
        targetLink.parentNode.insertBefore(statusIndicator, targetLink);

        // Store indicator for management
        statusManager.indicators.set(userId, statusIndicator);

        // If this is a quick pass, only process items that don't need API calls
        if (isQuickPass) {
            if (!needsApiCall) {
                // We're done with this item for the quick pass
                return;
            } else {
                // Remove the indicator for now, it will be processed in the full pass
                statusIndicator.remove();
                statusManager.indicators.delete(userId);
                return;
            }
        }

        // Full processing - handle API calls if needed
        if (needsApiCall) {
            // Queue the API call with delay for rate limiting
            setTimeout(() => {
                queueApiCall(async () => {
                    await updateUserStatus(userId, statusIndicator, mobile, true);
                });
                
                // Set up periodic updates every 10 seconds
                const interval = setInterval(() => {
                    queueApiCall(async () => {
                        await updateUserStatus(userId, statusIndicator, mobile, false);
                    });
                }, CONFIG.updateInterval);
                
                statusManager.intervals.set(userId, interval);
            }, delay);
        }
    }

    // Process all existing bounties on the page
    function processExistingBounties() {
        // Clear existing intervals to prevent memory leaks
        statusManager.intervals.forEach(interval => clearInterval(interval));
        statusManager.intervals.clear();
        statusManager.indicators.clear();
        
        // Find bounty items based on layout
        let bountyItems;
        if (isMobileLayout()) {
            bountyItems = document.querySelectorAll('.bounties-list li ul.item');
        } else {
            bountyItems = document.querySelectorAll('.bounties-list li ul.item');
        }
        
        console.log(`Processing ${bountyItems.length} bounty items...`);
        
        // PHASE 1: Quick pass - immediately show status for items that don't need API calls
        console.log('Phase 1: Quick pass for non-API status...');
        bountyItems.forEach((item, index) => {
            processBountyItem(item, 0, true); // isQuickPass = true
        });
        
        // PHASE 2: Process items that need API calls with staggered delays
        setTimeout(() => {
            console.log('Phase 2: API calls for hospital timing...');
            
            let apiCallCount = 0;
            bountyItems.forEach((item, index) => {
                // Check if this item needs an API call (hospital status or unknown status)
                const targetLink = item.querySelector('a[href*="profiles.php?XID="]');
                if (!targetLink) return;
                
                const existingStatus = getExistingStatus(item);
                const needsApiCall = !existingStatus || existingStatus === 'hospital';
                
                if (needsApiCall) {
                    // Stagger API calls
                    const delay = Math.floor(apiCallCount / CONFIG.apiRateLimit.callsPerSecond) * 1000 + 
                                  (apiCallCount % CONFIG.apiRateLimit.callsPerSecond) * CONFIG.apiRateLimit.delayBetweenCalls;
                    
                    setTimeout(() => {
                        processBountyItem(item, 0, false); // isQuickPass = false
                    }, delay);
                    
                    apiCallCount++;
                }
            });
            
            console.log(`Queued ${apiCallCount} API calls for detailed status updates`);
        }, 100); // Small delay between phases
    }

    // Create API key input dialog
    function showApiKeyDialog() {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2a2a2a;
            border: 2px solid #555;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            color: white;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;

        dialog.innerHTML = `
            <h3 style="margin-top: 0; color: #fff;">Torn API Key Setup</h3>
            <p>Enter your Torn API key to enable hospital timing:</p>
            <input type="text" id="apiKeyInput" placeholder="Your API Key" style="
                width: 300px;
                padding: 8px;
                margin: 10px 0;
                background: #444;
                border: 1px solid #666;
                color: white;
                border-radius: 4px;
            " value="${apiKey}">
            <br>
            <button id="saveApiKey" style="
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 10px;
            ">Save</button>
            <button id="cancelApiKey" style="
                background: #666;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">Cancel</button>
            <p style="font-size: 12px; color: #aaa;">
                Get your API key from: <a href="https://www.torn.com/preferences.php#tab=api" target="_blank" style="color: #4CAF50;">Torn Preferences</a>
            </p>
        `;

        document.body.appendChild(dialog);

        document.getElementById('saveApiKey').onclick = () => {
            const newApiKey = document.getElementById('apiKeyInput').value.trim();
            if (newApiKey) {
                apiKey = newApiKey;
                GM_setValue('tornApiKey', apiKey);
                console.log('API Key saved');
                
                // Remove the setup button since we now have an API key
                const setupBtn = document.getElementById('torn-api-setup-btn');
                if (setupBtn) {
                    setupBtn.remove();
                }
            }
            document.body.removeChild(dialog);
            if (newApiKey) {
                processExistingBounties();
            }
        };

        document.getElementById('cancelApiKey').onclick = () => {
            document.body.removeChild(dialog);
        };
    }

    // Add settings button to page (only if no API key)
    function addSettingsButton() {
        if (apiKey) {
            return; // Don't show button if API key is already set
        }
        
        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = 'Setup API Key';
        settingsBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #ff6b35;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: move;
            z-index: 9999;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(255,107,53,0.4);
            user-select: none;
            transition: transform 0.1s ease;
        `;
        settingsBtn.onclick = showApiKeyDialog;
        settingsBtn.id = 'torn-api-setup-btn';
        
        // Make button draggable
        makeDraggable(settingsBtn);
        
        document.body.appendChild(settingsBtn);
    }

    // Make element draggable
    function makeDraggable(element) {
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let elementStartX = 0;
        let elementStartY = 0;

        element.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Only left mouse button
            
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            
            const rect = element.getBoundingClientRect();
            elementStartX = rect.left;
            elementStartY = rect.top;
            
            element.style.transform = 'scale(0.95)';
            element.style.cursor = 'grabbing';
            
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;
            
            const newX = elementStartX + deltaX;
            const newY = elementStartY + deltaY;
            
            // Keep button within viewport bounds
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            
            const clampedX = Math.max(0, Math.min(newX, maxX));
            const clampedY = Math.max(0, Math.min(newY, maxY));
            
            element.style.left = clampedX + 'px';
            element.style.top = clampedY + 'px';
            element.style.bottom = 'auto';
            element.style.right = 'auto';
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            element.style.transform = 'scale(1)';
            element.style.cursor = 'move';
            
            // If the mouse didn't move much, treat it as a click
            const deltaX = Math.abs(e.clientX - dragStartX);
            const deltaY = Math.abs(e.clientY - dragStartY);
            
            if (deltaX < 5 && deltaY < 5) {
                // This was a click, not a drag
                setTimeout(() => {
                    showApiKeyDialog();
                }, 10);
            }
        });

        // Touch support for mobile
        element.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            isDragging = true;
            dragStartX = touch.clientX;
            dragStartY = touch.clientY;
            
            const rect = element.getBoundingClientRect();
            elementStartX = rect.left;
            elementStartY = rect.top;
            
            element.style.transform = 'scale(0.95)';
            
            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - dragStartX;
            const deltaY = touch.clientY - dragStartY;
            
            const newX = elementStartX + deltaX;
            const newY = elementStartY + deltaY;
            
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            
            const clampedX = Math.max(0, Math.min(newX, maxX));
            const clampedY = Math.max(0, Math.min(newY, maxY));
            
            element.style.left = clampedX + 'px';
            element.style.top = clampedY + 'px';
            element.style.bottom = 'auto';
            element.style.right = 'auto';
            
            e.preventDefault();
        });

        document.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            element.style.transform = 'scale(1)';
            
            const touch = e.changedTouches[0];
            const deltaX = Math.abs(touch.clientX - dragStartX);
            const deltaY = Math.abs(touch.clientY - dragStartY);
            
            if (deltaX < 5 && deltaY < 5) {
                setTimeout(() => {
                    showApiKeyDialog();
                }, 10);
            }
        });
    }

    // Set up mutation observer for dynamic content
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if it's a bounty item or contains bounty items
                        const bountyItems = node.querySelectorAll ? 
                            node.querySelectorAll('ul.item') : [];
                        
                        if (node.matches && node.matches('ul.item')) {
                            processBountyItem(node, 0, false); // Process new items normally
                        } else {
                            bountyItems.forEach(item => processBountyItem(item, 0, false));
                        }
                    }
                });
            });
        });

        // Observe the bounties container
        const bountiesContainer = document.querySelector('.bounties-list');
        if (bountiesContainer) {
            observer.observe(bountiesContainer, {
                childList: true,
                subtree: true
            });
        }

        // Also observe the main content area for page changes
        const mainContainer = document.querySelector('#mainContainer');
        if (mainContainer) {
            observer.observe(mainContainer, {
                childList: true,
                subtree: true
            });
        }

        // Handle accordion expansions on mobile
        if (isMobileLayout()) {
            document.addEventListener('click', (e) => {
                if (e.target.closest('.ui-accordion-header')) {
                    // Small delay to let accordion expand
                    setTimeout(() => {
                        const expandedContent = e.target.closest('li').querySelector('.ui-accordion-content');
                        if (expandedContent) {
                            // Process any newly visible elements
                            processExistingBounties();
                        }
                    }, 300);
                }
            });
        }
    }

    // Cleanup function
    function cleanup() {
        statusManager.intervals.forEach(interval => clearInterval(interval));
        statusManager.intervals.clear();
        statusManager.indicators.clear();
        statusManager.apiCallQueue = [];
    }

    // Initialize the script
    function init() {
        console.log('Torn Bounty Status Enhancer loaded');
        console.log('Mobile layout detected:', isMobileLayout());
        console.log('API Key present:', !!apiKey);
        console.log('API Rate limit: 100 calls/second with 10ms delay');
        
        // Add settings button only if no API key
        addSettingsButton();
        
        // Show API key dialog if not set (with delay to avoid conflicts)
        if (!apiKey) {
            setTimeout(showApiKeyDialog, 1500);
        }
        
        // Process existing bounties
        setTimeout(processExistingBounties, 1000);
        
        // Set up observer for dynamic content
        setupObserver();
        
        // Re-process on page navigation (for SPA behavior)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                cleanup(); // Clean up old intervals
                setTimeout(processExistingBounties, 1000);
            }
        }).observe(document, { subtree: true, childList: true });

        // Cleanup on page unload
        window.addEventListener('beforeunload', cleanup);
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();