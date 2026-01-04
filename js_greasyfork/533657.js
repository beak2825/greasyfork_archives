// ==UserScript==
// @name         Manarion Reliable Audio Alerts
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Reliable audio alerts for Manarion quests and items
// @author       Grogu2484
// @match        *://*.manarion.com/*
// @match        *://manarion.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533657/Manarion%20Reliable%20Audio%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/533657/Manarion%20Reliable%20Audio%20Alerts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("[Manarion Audio Alerts] Script loaded");
    
    // =============================
    // CONFIGURATION - Change these settings as needed
    // =============================
    
    const ALERT_VOLUME = 1.0; // Maximum volume
    const CHECK_INTERVAL = 500; // Check every 500ms (twice per second)
    const SHOW_DEBUG = true; // Set to true to see debug messages
    
    // What to detect and alert for
    const ALERTS = {
        quest: {
            enabled: true,
            soundUrl: 'https://freesound.org/data/previews/320/320655_5260872-lq.mp3',
            volume: ALERT_VOLUME,
            cooldown: 5000 // 5 seconds between alerts
        },
        orb: {
            enabled: true,
            soundUrl: 'https://freesound.org/data/previews/387/387229_7255534-lq.mp3',
            volume: ALERT_VOLUME,
            cooldown: 3000 // 3 seconds between alerts
        },
        epic: {
            enabled: true,
            soundUrl: 'https://freesound.org/data/previews/369/369515_3255970-lq.mp3',
            volume: ALERT_VOLUME,
            cooldown: 3000
        },
        legendary: {
            enabled: true,
            soundUrl: 'https://freesound.org/data/previews/394/394418_5121236-lq.mp3', 
            volume: ALERT_VOLUME,
            cooldown: 3000
        }
    };
    
    // Text patterns to detect
    const PATTERNS = {
        quest: [
            'quest completed',
            'quest complete',
            'objective complete',
            'objective completed',
            'mission complete',
            'task complete',
            'completed quest',
            'congratulations',
            'quest finished',
            'level up'
        ],
        orb: [
            'orb of power',
            'orb of chaos',
            'orb of divinity'
        ],
        epic: [
            'epic',
            'rare',
            'superior'
        ],
        legendary: [
            'legendary',
            'mythic',
            'ancient',
            'unique'
        ]
    };
    
    // Class/Element patterns to detect
    const SELECTORS = {
        quest: [
            '.quest-complete',
            '.quest-success',
            '.objective-complete',
            '.complete-animation',
            '.quest-done',
            '.success-message',
            '[data-quest-status="completed"]',
            '[class*="complete"]'
        ],
        loot: [
            '.item-quality',
            '.quality',
            '.rarity',
            '.loot-item',
            '.loot-tracker-item',
            '.item-drop',
            '[class*="item"]',
            '[class*="loot"]',
            '[class*="drop"]'
        ]
    };
    
    // =============================
    // INTERNAL STATE - Don't modify
    // =============================
    
    // Store audio objects
    const sounds = {};
    
    // Track when sounds were last played
    const lastPlayed = {
        quest: 0,
        orb: 0,
        epic: 0,
        legendary: 0
    };
    
    // Already detected items to prevent duplicates
    const detected = new Set();
    
    // Flag to track if audio is working
    let audioLoaded = false;
    let userInteracted = false;
    
    // Debug logging
    function log(message) {
        if (SHOW_DEBUG) {
            console.log(`[Manarion Audio Alerts] ${message}`);
        }
    }
    
    // =============================
    // CORE FUNCTIONS
    // =============================
    
    // Initialize audio elements
    function initAudio() {
        log("Initializing audio...");
        
        for (const [type, config] of Object.entries(ALERTS)) {
            if (config.enabled) {
                try {
                    // Create and configure audio element
                    sounds[type] = new Audio();
                    sounds[type].src = config.soundUrl;
                    sounds[type].volume = config.volume;
                    sounds[type].preload = 'auto';
                    
                    // Add event listeners
                    sounds[type].addEventListener('canplaythrough', () => {
                        log(`${type} sound loaded successfully`);
                        audioLoaded = true;
                    });
                    
                    sounds[type].addEventListener('error', (e) => {
                        log(`Error loading ${type} sound: ${e.message}`);
                    });
                    
                    // Force load attempt
                    sounds[type].load();
                } catch (e) {
                    log(`Failed to create ${type} sound: ${e.message}`);
                }
            }
        }
    }
    
    // Play a sound with cooldown check
    function playSound(type, reason) {
        if (!ALERTS[type].enabled) return false;
        if (!sounds[type]) return false;
        
        const now = Date.now();
        
        // Check cooldown
        if (now - lastPlayed[type] < ALERTS[type].cooldown) {
            log(`${type} sound on cooldown, skipping`);
            return false;
        }
        
        try {
            // Update last played time immediately to prevent multiple triggers
            lastPlayed[type] = now;
            
            // Reset to beginning
            sounds[type].currentTime = 0;
            
            // Check if user has interacted
            if (!userInteracted) {
                log(`Cannot play ${type} sound: waiting for user interaction`);
                
                // Show a more visible indicator to prompt user interaction
                showInteractionPrompt();
                return false;
            }
            
            // Play the sound
            const playPromise = sounds[type].play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    log(`${type} sound played successfully: ${reason}`);
                    
                    // Show visual feedback in the indicator
                    flashIndicator(type);
                    
                }).catch(error => {
                    log(`Failed to play ${type} sound: ${error}`);
                    
                    // If sound fails due to user interaction requirement
                    if (error.name === 'NotAllowedError') {
                        userInteracted = false;
                        showInteractionPrompt();
                    }
                });
            }
            
            return true;
        } catch (e) {
            log(`Error playing ${type} sound: ${e.message}`);
            return false;
        }
    }
    
    // =============================
    // DETECTION FUNCTIONS
    // =============================
    
    // Check for quest completion
    function checkQuestCompletion() {
        if (!ALERTS.quest.enabled) return false;
        
        // Check text patterns
        for (const pattern of PATTERNS.quest) {
            const elements = findElementsContainingText(pattern);
            
            for (const element of elements) {
                const id = `quest-${pattern}-${Date.now()}`;
                if (!detected.has(id)) {
                    detected.add(id);
                    log(`Quest completion detected: ${pattern}`);
                    playSound('quest', `Quest completion: ${pattern}`);
                    return true;
                }
            }
        }
        
        // Check visual indicators
        for (const selector of SELECTORS.quest) {
            try {
                const elements = document.querySelectorAll(selector);
                
                if (elements.length > 0) {
                    for (const element of elements) {
                        // Skip if not visible
                        if (isElementHidden(element)) continue;
                        
                        const id = `quest-selector-${selector}-${Date.now()}`;
                        if (!detected.has(id)) {
                            detected.add(id);
                            log(`Quest completion element found: ${selector}`);
                            playSound('quest', `Quest completion detected`);
                            return true;
                        }
                    }
                }
            } catch (e) {
                log(`Error checking selector ${selector}: ${e.message}`);
            }
        }
        
        return false;
    }
    
    // Check for special item drops
    function checkItemDrops() {
        // Check for orbs
        if (ALERTS.orb.enabled) {
            for (const orbName of PATTERNS.orb) {
                const elements = findElementsContainingText(orbName);
                
                for (const element of elements) {
                    // Skip if not visible
                    if (isElementHidden(element)) continue;
                    
                    // Create a more unique ID using text context
                    const id = `orb-${orbName}-${Date.now()}`;
                    if (!detected.has(id)) {
                        detected.add(id);
                        log(`Orb detected: ${orbName}`);
                        playSound('orb', `${orbName} dropped!`);
                        return true;
                    }
                }
            }
        }
        
        // Check for legendary and epic items
        for (const selector of SELECTORS.loot) {
            try {
                const elements = document.querySelectorAll(selector);
                
                for (const element of elements) {
                    // Skip if not visible
                    if (isElementHidden(element)) continue;
                    
                    const text = element.textContent.toLowerCase();
                    const classes = element.className ? element.className.toLowerCase() : '';
                    
                    // Check for legendary first (more specific)
                    if (ALERTS.legendary.enabled) {
                        for (const quality of PATTERNS.legendary) {
                            if (text.includes(quality) || classes.includes(quality)) {
                                const id = `legendary-${quality}-${Date.now()}`;
                                if (!detected.has(id)) {
                                    detected.add(id);
                                    log(`Legendary item detected: ${quality}`);
                                    playSound('legendary', 'Legendary item dropped!');
                                    return true;
                                }
                            }
                        }
                    }
                    
                    // Check for epic
                    if (ALERTS.epic.enabled) {
                        for (const quality of PATTERNS.epic) {
                            if (text.includes(quality) || classes.includes(quality)) {
                                const id = `epic-${quality}-${Date.now()}`;
                                if (!detected.has(id)) {
                                    detected.add(id);
                                    log(`Epic item detected: ${quality}`);
                                    playSound('epic', 'Epic item dropped!');
                                    return true;
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                log(`Error checking loot selector ${selector}: ${e.message}`);
            }
        }
        
        return false;
    }
    
    // =============================
    // HELPER FUNCTIONS
    // =============================
    
    // Find elements containing specific text
    function findElementsContainingText(searchText) {
        const result = [];
        const searchTextLower = searchText.toLowerCase();
        
        // A recursive function to search through all text nodes
        function searchNodes(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.toLowerCase().includes(searchTextLower)) {
                    // Add the parent element to our results
                    if (node.parentElement && !isElementHidden(node.parentElement)) {
                        result.push(node.parentElement);
                    }
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Check element's attributes for the text
                if (node.hasAttributes()) {
                    for (const attr of node.attributes) {
                        if (attr.value.toLowerCase().includes(searchTextLower)) {
                            if (!isElementHidden(node)) {
                                result.push(node);
                                break; // No need to check other attributes
                            }
                        }
                    }
                }
                
                // Continue searching child nodes
                for (const childNode of node.childNodes) {
                    searchNodes(childNode);
                }
            }
        }
        
        try {
            // Only search if we have a body
            if (document.body) {
                searchNodes(document.body);
            }
        } catch (e) {
            log(`Error searching for text "${searchText}": ${e.message}`);
        }
        
        return result;
    }
    
    // Check if an element is hidden (not visible)
    function isElementHidden(element) {
        if (!element) return true;
        
        try {
            const style = window.getComputedStyle(element);
            return style.display === 'none' || 
                   style.visibility === 'hidden' || 
                   style.opacity === '0' ||
                   element.offsetParent === null;
        } catch (e) {
            return true; // Assume hidden if we can't check
        }
    }
    
    // Clean up old detected items
    function cleanupDetected() {
        if (detected.size > 500) {
            const itemsArray = Array.from(detected);
            for (let i = 0; i < 200; i++) {
                detected.delete(itemsArray[i]);
            }
            log(`Cleaned up detected items cache (${detected.size} remaining)`);
        }
    }
    
    // =============================
    // UI ELEMENTS
    // =============================
    
    // Create and add indicator to the page
    function addIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'manarion-alert-indicator';
        indicator.style.position = 'fixed';
        indicator.style.bottom = '5px';
        indicator.style.right = '5px';
        indicator.style.background = 'rgba(0,0,0,0.7)';
        indicator.style.color = '#00ff00';
        indicator.style.padding = '6px 10px';
        indicator.style.borderRadius = '5px';
        indicator.style.fontSize = '12px';
        indicator.style.fontFamily = 'Arial, sans-serif';
        indicator.style.zIndex = '9999';
        indicator.style.cursor = 'pointer';
        indicator.style.transition = 'background 0.3s, transform 0.1s';
        indicator.style.userSelect = 'none';
        indicator.textContent = '🔊 Audio Alerts Active';
        indicator.title = 'Click to test sounds';
        
        // Make it interactive - click to test sounds and enable audio
        indicator.addEventListener('click', function() {
            // Mark user interaction
            userInteracted = true;
            
            // Hide prompt if visible
            const prompt = document.getElementById('manarion-interaction-prompt');
            if (prompt) {
                prompt.style.display = 'none';
            }
            
            // Get the current sound type or default to quest
            let soundType = this.getAttribute('data-sound') || 'quest';
            
            // Cycle through sound types
            switch (soundType) {
                case 'quest':
                    playSound('quest', 'Test: Quest completion');
                    this.setAttribute('data-sound', 'orb');
                    break;
                case 'orb':
                    playSound('orb', 'Test: Orb drop');
                    this.setAttribute('data-sound', 'epic');
                    break;
                case 'epic':
                    playSound('epic', 'Test: Epic item');
                    this.setAttribute('data-sound', 'legendary');
                    break;
                case 'legendary':
                    playSound('legendary', 'Test: Legendary item');
                    this.setAttribute('data-sound', 'quest');
                    break;
            }
            
            // Visual feedback
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
        
        document.body.appendChild(indicator);
        return indicator;
    }
    
    // Flash the indicator when a sound plays
    function flashIndicator(type) {
        const indicator = document.getElementById('manarion-alert-indicator');
        if (!indicator) return;
        
        let color;
        switch (type) {
            case 'quest':
                color = 'rgba(0,255,0,0.8)'; // Bright green
                break;
            case 'orb':
                color = 'rgba(128,0,255,0.8)'; // Purple
                break;
            case 'epic':
                color = 'rgba(0,128,255,0.8)'; // Blue
                break;
            case 'legendary':
                color = 'rgba(255,215,0,0.8)'; // Gold
                break;
            default:
                color = 'rgba(255,255,255,0.8)'; // White
        }
        
        indicator.style.backgroundColor = color;
        indicator.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            indicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
            indicator.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Show a prompt for user interaction (needed for audio)
    function showInteractionPrompt() {
        // Don't show again if it exists
        if (document.getElementById('manarion-interaction-prompt')) return;
        
        const prompt = document.createElement('div');
        prompt.id = 'manarion-interaction-prompt';
        prompt.style.position = 'fixed';
        prompt.style.bottom = '35px';
        prompt.style.right = '5px';
        prompt.style.background = 'rgba(255,255,0,0.9)';
        prompt.style.color = 'black';
        prompt.style.padding = '10px';
        prompt.style.borderRadius = '5px';
        prompt.style.fontSize = '14px';
        prompt.style.fontFamily = 'Arial, sans-serif';
        prompt.style.zIndex = '10000';
        prompt.style.maxWidth = '250px';
        prompt.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
        prompt.innerHTML = '⚠️ <b>Click the green indicator</b> to enable sound alerts!';
        
        document.body.appendChild(prompt);
        
        // Auto-hide after 15 seconds
        setTimeout(() => {
            if (prompt.parentNode) {
                prompt.style.opacity = '0';
                prompt.style.transition = 'opacity 1s';
                setTimeout(() => {
                    if (prompt.parentNode) {
                        prompt.parentNode.removeChild(prompt);
                    }
                }, 1000);
            }
        }, 15000);
    }
    
    // =============================
    // INITIALIZATION
    // =============================
    
    // Set up observers for DOM changes
    function setupObservers() {
        try {
            // Create a mutation observer to watch for DOM changes
            const observer = new MutationObserver(() => {
                checkQuestCompletion();
                checkItemDrops();
            });
            
            // Start observing the document body
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
            });
            
            log('DOM observer initialized');
            return true;
        } catch (e) {
            log(`Error setting up observer: ${e.message}`);
            return false;
        }
    }
    
    // Main initialization function
    function initialize() {
        log('Initializing...');
        
        // Initialize audio
        initAudio();
        
        // Add indicator to page
        const indicator = addIndicator();
        if (indicator) {
            log('Indicator added');
        }
        
        // Set up DOM observers
        setupObservers();
        
        // Set up interval for periodic checks
        setInterval(() => {
            checkQuestCompletion();
            checkItemDrops();
            
            // Clean up detected items periodically
            cleanupDetected();
        }, CHECK_INTERVAL);
        
        // Wait a bit then run checks
        setTimeout(() => {
            checkQuestCompletion();
            checkItemDrops();
        }, 2000);
        
        // Track user interaction with page (needed for audio)
        document.addEventListener('click', function() {
            userInteracted = true;
            
            // Hide prompt if visible
            const prompt = document.getElementById('manarion-interaction-prompt');
            if (prompt) {
                prompt.style.display = 'none';
            }
        }, { once: true });
        
        log('Initialization complete');
    }
    
    // Wait for page to load and then initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // Page already loaded
        initialize();
    }
    
    // Also initialize on window load as a backup
    window.addEventListener('load', () => {
        // Check if already initialized
        if (!document.getElementById('manarion-alert-indicator')) {
            initialize();
        }
    });
})();