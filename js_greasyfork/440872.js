// ==UserScript==
// @name         Ultimate Autoplay Blocker
// @namespace    https://www.androidacy.com/
// @version      3.1.0
// @description  The last userscript you'll ever need to disable autoplay videos on news sites and elsewhere
// @author       Androidacy
// @include      *
// @icon         https://www.androidacy.com/wp-content/uploads/cropped-cropped-cropped-cropped-New-Project-32-69C2A87-1-192x192.jpg
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/440872/Ultimate%20Autoplay%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/440872/Ultimate%20Autoplay%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // WeakMap to track user interaction status for each media element
    const mediaInteractionMap = new WeakMap();
    
    // Store original play method
    const originalPlay = HTMLMediaElement.prototype.play;
    
    // Track initialization status
    let initialized = false;
    
    // ID for interval timer
    let checkIntervalId = null;

    // Helper: Extract coordinates from event
    const getCoordinates = (event) => {
        if (!event) return null;
        
        try {
            if (event.type.startsWith('mouse')) {
                return { x: event.clientX, y: event.clientY };
            } else if (event.type === 'touchstart' || event.type === 'touchmove' || event.type === 'touchend') {
                // Handle both active touches and changed touches (for touchend)
                const touch = event.touches?.[0] || event.changedTouches?.[0];
                return touch ? { x: touch.clientX, y: touch.clientY } : null;
            }
        } catch (e) {
            // Silently fail if we can't extract coordinates
        }
        return null;
    };

    // Helper: Check if interaction is related to media element
    const isMediaInteraction = (event, media) => {
        if (!event?.isTrusted || !media) return false;
        
        try {
            // For keyboard events on the media itself
            if ((event.type === 'keydown' || event.type === 'keyup') && 
               (document.activeElement === media || media.contains(document.activeElement))) {
                return ['Space', ' ', 'Enter', 'k', 'K'].includes(event.key);
            }
            
            const coords = getCoordinates(event);
            if (!coords) return false;
            
            const { x, y } = coords;
            const rect = media.getBoundingClientRect();
            
            // Direct interaction with the media element
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                return true;
            }
            
            // Check if interaction is near the media (for controls that appear outside)
            const proximity = 64; // px
            if (x >= rect.left - proximity && x <= rect.right + proximity && 
                y >= rect.top - proximity && y <= rect.bottom + proximity) {
                
                // Check elements at interaction position
                try {
                    const elementsAtPoint = document.elementsFromPoint(x, y);
                    if (!elementsAtPoint || elementsAtPoint.length === 0) return false;
                    
                    for (const el of elementsAtPoint) {
                        // Check if element is or contains media controls
                        if (el === media || media.contains(el) || el.contains(media)) {
                            return true;
                        }
                        
                        // Check for common control elements
                        const tagName = el.tagName?.toLowerCase();
                        const role = el.getAttribute('role')?.toLowerCase();
                        const elClass = (el.className || '').toString().toLowerCase();
                        const elId = (el.id || '').toString().toLowerCase();
                        const ariaLabel = el.getAttribute('aria-label')?.toLowerCase();
                        
                        // Check for play buttons and controls
                        if (tagName === 'button' || role === 'button' || 
                            elClass.includes('play') || elId.includes('play') ||
                            elClass.includes('control') || elId.includes('control') ||
                            (ariaLabel && (ariaLabel.includes('play') || ariaLabel.includes('start'))) ||
                            el.onclick || el.parentElement?.onclick) {
                            return true;
                        }
                        
                        // Check for common player UI patterns
                        const playerPatterns = ['player', 'video', 'media', 'youtube', 'vimeo', 'jwplayer'];
                        for (const pattern of playerPatterns) {
                            if (elClass.includes(pattern) || elId.includes(pattern)) {
                                return true;
                            }
                        }
                    }
                } catch (e) {
                    // If elementsFromPoint fails, fall back to less precise detection
                    return document.activeElement === media;
                }
            }
        } catch (e) {
            // If anything fails, be conservative
            return false;
        }
        
        return false;
    };

    // Process a media element
    const processMedia = (media) => {
        if (!media || !(media instanceof HTMLMediaElement)) return;
        
        try {
            // Set initial interaction state if not already set
            if (!mediaInteractionMap.has(media)) {
                mediaInteractionMap.set(media, false);
                
                // Remove autoplay attribute
                if (media.hasAttribute('autoplay')) {
                    media.removeAttribute('autoplay');
                }
                
                // Disable autoplay property
                if (media.autoplay) {
                    media.autoplay = false;
                }
                
                // Listen for play events to pause if autoplay attempted
                media.addEventListener('play', function(e) {
                    if (!mediaInteractionMap.get(this)) {
                        this.pause();
                    }
                }, true);
                
                // Ensure new sources don't trigger autoplay
                media.addEventListener('loadedmetadata', function() {
                    if (!mediaInteractionMap.get(this)) {
                        this.pause();
                    }
                }, true);
                
                // Pause if it's already playing
                if (!media.paused && !mediaInteractionMap.get(media)) {
                    media.pause();
                }
            }
        } catch (e) {
            // Ignore errors in processing
        }
    };

    // Handle user interactions
    const handleUserInteraction = (event) => {
        if (!event?.isTrusted) return;
        
        try {
            document.querySelectorAll('video, audio').forEach(media => {
                if (isMediaInteraction(event, media)) {
                    mediaInteractionMap.set(media, true);
                }
            });
        } catch (e) {
            // Ignore errors in event handling
        }
    };

    // Override HTMLMediaElement.prototype.play
    const overridePlayMethod = () => {
        try {
            HTMLMediaElement.prototype.play = function() {
                try {
                    if (mediaInteractionMap.get(this)) {
                        return originalPlay.apply(this);
                    } else {
                        this.pause();
                        return Promise.reject(new DOMException('NotAllowedError', 'Autoplay blocked by userscript'));
                    }
                } catch (e) {
                    // If there's an error in our override, fall back to original behavior
                    return originalPlay.apply(this);
                }
            };
        } catch (e) {
            // If we can't override play, continue with other protections
        }
    };

    // Override setAttribute to block autoplay attribute
    const overrideSetAttribute = () => {
        try {
            const originalSetAttribute = Element.prototype.setAttribute;
            Element.prototype.setAttribute = function(name, value) {
                if (name === 'autoplay' && this instanceof HTMLMediaElement) {
                    return;
                }
                return originalSetAttribute.call(this, name, value);
            };
        } catch (e) {
            // If we can't override setAttribute, continue with other protections
        }
    };

    // Process all media elements
    const processAllMedia = () => {
        try {
            document.querySelectorAll('video, audio').forEach(processMedia);
        } catch (e) {
            // Ignore errors when processing all media
        }
    };

    // Set up mutation observer for dynamically added elements
    const setupObserver = () => {
        try {
            const observer = new MutationObserver(mutations => {
                let foundMedia = false;
                
                for (const mutation of mutations) {
                    // Check for added nodes
                    if (mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node instanceof HTMLMediaElement) {
                                    processMedia(node);
                                    foundMedia = true;
                                } else if (node.querySelectorAll) {
                                    const mediaElements = node.querySelectorAll('video, audio');
                                    if (mediaElements.length > 0) {
                                        foundMedia = true;
                                        mediaElements.forEach(processMedia);
                                    }
                                }
                            }
                        }
                    }
                    
                    // Check for attribute changes (autoplay)
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'autoplay' && 
                        mutation.target instanceof HTMLMediaElement) {
                        mutation.target.removeAttribute('autoplay');
                    }
                }
                
                // Only scan all media if we found some to avoid performance issues
                if (foundMedia) {
                    processAllMedia();
                }
            });
            
            observer.observe(document.documentElement || document, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['autoplay']
            });
        } catch (e) {
            // If observer setup fails, rely on interval checking instead
            ensureIntervalActive();
        }
    };

    // Add event listeners for user interactions
    const setupEventListeners = () => {
        try {
            // Desktop events
            ['click', 'mousedown'].forEach(eventType => {
                window.addEventListener(eventType, handleUserInteraction, true);
            });
            
            // Mobile events
            ['touchstart', 'touchend'].forEach(eventType => {
                window.addEventListener(eventType, handleUserInteraction, { 
                    capture: true,
                    passive: true 
                });
            });
            
            // Keyboard events
            ['keydown'].forEach(eventType => {
                window.addEventListener(eventType, handleUserInteraction, true);
            });
        } catch (e) {
            // If event setup fails, still continue with other protections
        }
    };

    // Pause all currently playing media
    const pauseAllMedia = () => {
        try {
            document.querySelectorAll('video, audio').forEach(media => {
                if (!mediaInteractionMap.get(media) && !media.paused) {
                    media.pause();
                }
            });
        } catch (e) {
            // Ignore errors when pausing
        }
    };
    
    // Ensure the interval is active
    const ensureIntervalActive = () => {
        if (!checkIntervalId) {
            checkIntervalId = setInterval(() => {
                processAllMedia();
                pauseAllMedia();
            }, 2000);
        }
    };

    // Initialize
    const initialize = () => {
        if (initialized) return;
        initialized = true;
        
        // Override methods to intercept JS autoplay
        overridePlayMethod();
        overrideSetAttribute();
        
        // Set up event listeners
        setupEventListeners();
        
        // Process existing media elements
        processAllMedia();
        
        // Pause any currently playing media
        pauseAllMedia();
        
        // Set up mutation observer for dynamically added elements
        setupObserver();
        
        // Ensure interval is active as a backup
        ensureIntervalActive();
    };

    // Initialize as early as possible
    if (document.readyState !== 'loading') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    }
    
    // Backup initialization when window loads
    window.addEventListener('load', initialize, { once: true });
})();