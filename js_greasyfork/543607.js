// ==UserScript==
// @namespace  Youtube Shorts Autoskip With UI
// @name  Youtube Shorts Autoskip With UI
// @description  Auto skip shorts when video ends with keyboard controls
// @author       Merlyn
// @version      1.2.5
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-idle
// @noframes
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543607/Youtube%20Shorts%20Autoskip%20With%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/543607/Youtube%20Shorts%20Autoskip%20With%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Configuration
    const config = {
        autoSkip: true,
        skipInterval: 300,
        keyboardShortcuts: true,
        checkProgressInterval: 250, // How often to check video progress
        endThreshold: 0.99, // Consider video ended at 99% completion
        resetCounterHotkey: 'r', // Hotkey to reset counter
        debugMode: true // Set to true for console logs
    };
    
    // Statistics tracking - initialize with default values
    const stats = {
        skipped: 0
    };
    
    // Try to load saved stats
    try {
        const savedStats = localStorage.getItem('yt-shorts-autoskip-stats');
        if (savedStats) {
            const parsed = JSON.parse(savedStats);
            stats.skipped = parsed.skipped || 0;
        }
        console.log('[YT Shorts AutoSkip] Loaded stats:', stats);
    } catch (e) {
        console.error('[YT Shorts AutoSkip] Error loading stats:', e);
    }
    
    // Variables to track state
    let players = new Set();
    let isInShortsPage = false;
    let progressIntervals = new Map(); // Store intervals for checking video progress
    let counterElement = null;
    let currentVideoId = null;
    
    // Element references for counter
    let skippedEl = null;
    
    // Debug logging
    function log(...args) {
        if (config.debugMode) {
            console.log('[YT Shorts AutoSkip]', ...args);
        }
    }
    
    // Save all stats at once
    function saveStats() {
        try {
            localStorage.setItem('yt-shorts-autoskip-stats', JSON.stringify(stats));
            log('Saved stats:', stats);
        } catch (e) {
            log('Error saving stats:', e);
        }
    }
    
    // Check if we're on the shorts page
    function checkIfShortsPage() {
        const oldValue = isInShortsPage;
        isInShortsPage = window.location.pathname.startsWith('/shorts');
        
        log('Checking shorts page:', isInShortsPage, 'URL:', window.location.pathname);
        
        // If we just entered shorts page, initialize
        if (!oldValue && isInShortsPage) {
            log('Entered shorts page, initializing');
            initializePlayers();
            ensureCounterVisible();
        } else if (oldValue && !isInShortsPage) {
            // Left shorts page
            hideCounter();
        }
        
        return isInShortsPage;
    }
    
    // Skip to next short
    function skipToNext() {
        const nextButton = document.getElementById('navigation-button-down');
        if (nextButton) {
            const button = nextButton.querySelector('button');
            if (button) {
                log('Clicking next button');
                button.click();
                
                // Increment skip counter
                stats.skipped++;
                saveStats();
                updateCounter();
                
                return true;
            }
        }
        return false;
    }
    
    // Skip to previous short
    function skipToPrevious() {
        const prevButton = document.getElementById('navigation-button-up');
        if (prevButton) {
            const button = prevButton.querySelector('button');
            if (button) {
                log('Clicking previous button');
                button.click();
                return true;
            }
        }
        return false;
    }
    
    // Get current video ID from URL
    function getCurrentVideoId() {
        try {
            const url = new URL(window.location.href);
            const pathParts = url.pathname.split('/');
            if (pathParts.length >= 3 && pathParts[1] === 'shorts') {
                return pathParts[2];
            }
        } catch (e) {
            log('Error getting video ID:', e);
        }
        return null;
    }
    
    // Start monitoring video progress
    function startProgressMonitoring(player) {
        // Clear any existing interval for this player
        if (progressIntervals.has(player)) {
            clearInterval(progressIntervals.get(player));
        }
        
        // Create new interval
        const intervalId = setInterval(() => {
            if (!player || !document.body.contains(player)) {
                clearInterval(intervalId);
                progressIntervals.delete(player);
                return;
            }
            
            try {
                // Check if video is near the end
                if (player.duration > 0 && !player.paused) {
                    const progress = player.currentTime / player.duration;
                    
                    // If video is at or past the end threshold, trigger skip
                    if (progress >= config.endThreshold) {
                        log('Video reached end threshold:', progress.toFixed(2));
                        handleVideoEnded();
                    }
                }
                
                // Check if video ID changed (user manually navigated)
                const newVideoId = getCurrentVideoId();
                if (newVideoId && newVideoId !== currentVideoId) {
                    log('Video ID changed from', currentVideoId, 'to', newVideoId);
                    currentVideoId = newVideoId;
                }
            } catch (e) {
                log('Error checking video progress:', e);
            }
        }, config.checkProgressInterval);
        
        progressIntervals.set(player, intervalId);
        
        // Initialize current video ID
        currentVideoId = getCurrentVideoId();
    }
    
    // Initialize video players
    function initializePlayers() {
        document.querySelectorAll('.video-stream.html5-main-video').forEach((player) => {
            if (player && !players.has(player)) {
                log('Initializing new player');
                
                // Store reference to player
                players.add(player);
                
                // Disable loop
                player.loop = false;
                
                // Remove any existing ended listeners to avoid duplicates
                player.removeEventListener('ended', handleVideoEnded);
                
                // Add event listener for video end
                player.addEventListener('ended', handleVideoEnded);
                
                // Start monitoring progress
                startProgressMonitoring(player);
                
                // Also handle when player is removed from DOM
                const observer = new MutationObserver((mutations) => {
                    if (!document.body.contains(player)) {
                        log('Player removed from DOM');
                        players.delete(player);
                        
                        // Clear progress interval
                        if (progressIntervals.has(player)) {
                            clearInterval(progressIntervals.get(player));
                            progressIntervals.delete(player);
                        }
                        
                        observer.disconnect();
                    }
                });
                
                observer.observe(document.body, { 
                    childList: true,
                    subtree: true
                });
            }
        });
    }
    
    // Handle video ended event
    function handleVideoEnded() {
        if (config.autoSkip && isInShortsPage) {
            log('Video ended, auto-skipping to next');
            skipToNext();
        }
    }
    
    // Create and show the counter element using DOM methods instead of innerHTML
    function createCounterElement() {
        // Remove any existing counter first
        if (counterElement) {
            try {
                document.body.removeChild(counterElement);
            } catch (e) {
                // Ignore if already removed
            }
            counterElement = null;
        }
        
        log('Creating counter element');
        
        // Create main container
        counterElement = document.createElement('div');
        counterElement.id = 'yt-shorts-counter';
        
        // Apply styles
        const styles = {
            position: 'fixed',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            fontSize: '16px',
            zIndex: '9999',
            transition: 'opacity 0.3s, transform 0.3s',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            border: '2px solid #ff0000'
        };
        
        // Position in top-right
        styles.top = '70px';
        styles.right = '20px';
        
        // Apply all styles
        Object.assign(counterElement.style, styles);
        
        // Create title
        const titleEl = document.createElement('div');
        titleEl.className = 'counter-title';
        titleEl.textContent = 'Shorts Counter';
        titleEl.style.fontWeight = 'bold';
        titleEl.style.marginBottom = '6px';
        titleEl.style.fontSize = '18px';
        titleEl.style.color = '#ff0000';
        counterElement.appendChild(titleEl);
        
        // Create skipped row
        const skippedRowEl = document.createElement('div');
        skippedRowEl.className = 'counter-row';
        skippedRowEl.style.margin = '3px 0';
        
        skippedEl = document.createElement('span');
        skippedEl.id = 'yt-shorts-skipped';
        skippedEl.style.fontWeight = 'bold';
        skippedEl.style.fontSize = '24px';
        skippedEl.textContent = stats.skipped;
        skippedRowEl.appendChild(skippedEl);
        
        skippedRowEl.appendChild(document.createTextNode(' Shorts'));
        counterElement.appendChild(skippedRowEl);
        
        // Create commands section
        const commandsTitle = document.createElement('div');
        commandsTitle.style.fontWeight = 'bold';
        commandsTitle.style.marginTop = '10px';
        commandsTitle.style.fontSize = '14px';
        commandsTitle.textContent = 'Commands:';
        counterElement.appendChild(commandsTitle);
        
        // Create commands list
        const commandsList = document.createElement('div');
        commandsList.style.fontSize = '13px';
        commandsList.style.marginTop = '4px';
        
        const commands = [
            { key: 'N', action: 'Next short' },
            { key: 'P', action: 'Previous short' },
            { key: 'S', action: 'Toggle auto-skip' },
            { key: 'R', action: 'Reset counter' }
        ];
        
        commands.forEach(cmd => {
            const cmdRow = document.createElement('div');
            cmdRow.style.margin = '2px 0';
            
            const keySpan = document.createElement('span');
            keySpan.style.fontWeight = 'bold';
            keySpan.style.color = '#ff9999';
            keySpan.textContent = cmd.key;
            cmdRow.appendChild(keySpan);
            
            cmdRow.appendChild(document.createTextNode(': ' + cmd.action));
            commandsList.appendChild(cmdRow);
        });
        
        counterElement.appendChild(commandsList);
        
        // Add to document
        document.body.appendChild(counterElement);
        log('Counter element created and added to DOM');
        
        // Make sure it's visible
        counterElement.style.opacity = '1';
        counterElement.style.transform = 'translateY(0)';
    }
    
    // Update counter values
    function updateCounter() {
        if (!counterElement || !document.body.contains(counterElement)) {
            if (isInShortsPage) {
                log('Counter element not found or not in DOM, creating it');
                createCounterElement();
            }
            return;
        }
        
        log('Updating counter values:', stats);
        
        try {
            // Update the counter values
            if (skippedEl) skippedEl.textContent = stats.skipped;
            
            // If any element wasn't found, recreate the counter
            if (!skippedEl) {
                log('Counter element not found, recreating counter');
                createCounterElement();
            }
        } catch (e) {
            log('Error updating counter, recreating:', e);
            createCounterElement();
        }
    }
    
    // Ensure counter is visible
    function ensureCounterVisible() {
        if (!isInShortsPage) return;
        
        if (!counterElement || !document.body.contains(counterElement)) {
            createCounterElement();
        } else {
            counterElement.style.opacity = '1';
            counterElement.style.transform = 'translateY(0)';
            updateCounter(); // Ensure values are up to date
        }
    }
    
    // Hide counter
    function hideCounter() {
        if (!counterElement) return;
        
        try {
            document.body.removeChild(counterElement);
            counterElement = null;
        } catch (e) {
            // Ignore if already removed
        }
    }
    
    // Reset counters
    function resetCounters() {
        if (confirm('Reset shorts counter?')) {
            stats.skipped = 0;
            
            saveStats();
            updateCounter();
            showStatusMessage('Counter reset to zero');
        }
    }
    
    // Set up keyboard shortcuts
    function setupKeyboardShortcuts() {
        if (!config.keyboardShortcuts) return;
        
        document.addEventListener('keydown', (event) => {
            // Don't process if user is typing in an input field
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
            
            switch (event.key.toLowerCase()) {
                case 'n': // Next short
                    if (isInShortsPage) {
                        skipToNext();
                        event.preventDefault();
                    }
                    break;
                case 'p': // Previous short
                    if (isInShortsPage) {
                        skipToPrevious();
                        event.preventDefault();
                    }
                    break;
                case 's': // Toggle auto-skip
                    if (isInShortsPage) {
                        config.autoSkip = !config.autoSkip;
                        showStatusMessage(`Auto-skip: ${config.autoSkip ? 'ON' : 'OFF'}`);
                        event.preventDefault();
                    }
                    break;
                case config.resetCounterHotkey: // Reset counters
                    if (isInShortsPage) {
                        resetCounters();
                        event.preventDefault();
                    }
                    break;
                case 'd': // Force show counter (debug)
                    if (isInShortsPage) {
                        createCounterElement();
                        showStatusMessage('Counter forced visible');
                        event.preventDefault();
                    }
                    break;
            }
        });
    }
    
    // Show temporary status message
    function showStatusMessage(message, duration = 2000) {
        let statusElement = document.getElementById('yt-shorts-autoskip-status');
        
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'yt-shorts-autoskip-status';
            statusElement.style.position = 'fixed';
            statusElement.style.top = '15px';
            statusElement.style.left = '50%';
            statusElement.style.transform = 'translateX(-50%)';
            statusElement.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
            statusElement.style.color = 'white';
            statusElement.style.padding = '10px 15px';
            statusElement.style.borderRadius = '8px';
            statusElement.style.zIndex = '10000';
            statusElement.style.fontSize = '16px';
            statusElement.style.transition = 'opacity 0.3s';
            statusElement.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
            statusElement.style.border = '2px solid #ff0000';
            document.body.appendChild(statusElement);
        }
        
        // Show message
        statusElement.textContent = message;
        statusElement.style.opacity = '1';
        
        // Hide after duration
        clearTimeout(statusElement.timeout);
        statusElement.timeout = setTimeout(() => {
            statusElement.style.opacity = '0';
        }, duration);
    }
    
    // Reinitialize when YouTube's SPA navigation occurs
    function setupNavigationListener() {
        // Watch for URL changes to detect entering/leaving shorts page
        let lastUrl = window.location.href;
        new MutationObserver(() => {
            if (lastUrl !== window.location.href) {
                lastUrl = window.location.href;
                log('URL changed to:', window.location.href);
                
                // Clear all existing players and intervals
                players.forEach(player => {
                    if (progressIntervals.has(player)) {
                        clearInterval(progressIntervals.get(player));
                        progressIntervals.delete(player);
                    }
                });
                players.clear();
                
                // Check if we're on shorts page and initialize
                checkIfShortsPage();
            }
        }).observe(document, {subtree: true, childList: true});
    }
    
    // Main initialization
    function initialize() {
        log('Initializing YouTube Shorts AutoSkip');
        
        // Set up keyboard shortcuts
        setupKeyboardShortcuts();
        
        // Set up navigation listener
        setupNavigationListener();
        
        // Initial check
        checkIfShortsPage();
        
        // Set interval to check for new players
        setInterval(() => {
            if (checkIfShortsPage()) {
                initializePlayers();
                ensureCounterVisible();
            }
        }, config.skipInterval);
        
        // Show initial status if on shorts page
        if (isInShortsPage) {
            showStatusMessage('Shorts Auto-Skip: Active', 3000);
        }
    }
    
    // Start the script
    initialize();
})();