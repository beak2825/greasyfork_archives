// ==UserScript==
// @name         AniwatchTV - Player Isolation and Anti-Redirect
// @namespace    https://aniwatchtv.to/
// @version      121.V121.Aniwatch.V3000
// @description  Pauses all scripts except the video player on AniwatchTV and prevents redirects
// @author       [NotYou](Gabriel Underwood)
// @match        https://aniwatchtv.to/watch/*
// @match        http://aniwatchtv.to/watch/*
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534236/AniwatchTV%20-%20Player%20Isolation%20and%20Anti-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/534236/AniwatchTV%20-%20Player%20Isolation%20and%20Anti-Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('AniwatchTV Player Isolation Script initialized');
    
    // Store original functions that we'll override
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalPushState = History.prototype.pushState;
    const originalReplaceState = History.prototype.replaceState;
    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;
    const originalOpen = window.open;
    
    // Known player elements based on provided HTML
    const PLAYER_SELECTORS = [
        '.player-frame',
        '#iframe-embed',
        '#embed-loading',
        '.loading-relative',
        '.loading-box'
    ];
    
    // Track if we've found and protected the player
    let playerProtected = false;
    let redirectsPrevented = 0;
    
    // Function to check if element is part of the video player
    function isPlayerElement(element) {
        if (!element) return false;
        
        // Check if element matches our known player selectors
        for (const selector of PLAYER_SELECTORS) {
            if (element.matches && element.matches(selector)) {
                return true;
            }
            
            // Check for specific ID
            if (selector.startsWith('#') && element.id === selector.substring(1)) {
                return true;
            }
            
            // Check for specific class
            if (selector.startsWith('.') && element.classList && 
                element.classList.contains(selector.substring(1))) {
                return true;
            }
        }
        
        // Check if element is the iframe with src containing player
        if (element.tagName === 'IFRAME' && element.id === 'iframe-embed') {
            return true;
        }
        
        // Check if it's a loading indicator for the player
        if (element.classList && 
            (element.classList.contains('loading') || 
             element.classList.contains('loading-relative') ||
             element.classList.contains('loading-box'))) {
            return true;
        }
        
        // Check if it's a direct child of player-frame
        if (element.parentElement && 
            element.parentElement.classList &&
            element.parentElement.classList.contains('player-frame')) {
            return true;
        }
        
        return false;
    }
    
    // Check if element is part of the player or an ancestor of the player
    function isPlayerOrAncestor(element) {
        if (isPlayerElement(element)) return true;
        
        // Check ancestors
        let parent = element.parentElement;
        while (parent) {
            if (isPlayerElement(parent)) return true;
            parent = parent.parentElement;
        }
        
        return false;
    }
    
    // Function to show notification
    function showNotification(message, duration = 3000) {
        if (!document.body) {
            setTimeout(() => showNotification(message, duration), 100);
            return;
        }
        
        let notification = document.getElementById('aniwatch-script-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'aniwatch-script-notification';
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            notification.style.color = 'white';
            notification.style.padding = '12px 16px';
            notification.style.borderRadius = '6px';
            notification.style.zIndex = '9999999';
            notification.style.fontFamily = 'Arial, sans-serif';
            notification.style.fontSize = '14px';
            notification.style.maxWidth = '300px';
            notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.style.display = 'block';
        
        // Hide after duration
        setTimeout(() => {
            notification.style.display = 'none';
        }, duration);
    }
    
    // Block redirects to home page
    function blockRedirectToHome(url) {
        if (!url) return false;
        
        try {
            const urlObj = new URL(url, window.location.origin);
            // Check if it's trying to redirect to homepage
            if (urlObj.pathname === '/' || 
                urlObj.pathname === '/home' || 
                urlObj.pathname.toLowerCase().includes('home')) {
                redirectsPrevented++;
                return true; // Should block
            }
        } catch (e) {
            // If URL parsing fails, be cautious and don't block
            return false;
        }
        
        return false; // Don't block
    }
    
    // Override setTimeout to control script execution
    window.setTimeout = function(callback, timeout, ...args) {
        // If it's a string callback, check for problematic redirects
        if (typeof callback === 'string') {
            if (callback.includes('location') || 
                callback.includes('redirect') || 
                callback.includes('window.location')) {
                return Math.floor(Math.random() * 10000); // Fake timeout ID
            }
        }
        
        // For function callbacks, create a wrapper
        if (typeof callback === 'function') {
            const wrappedCallback = function() {
                // Detect if this is executed in player context
                const isPlayerContext = isPlayerOrAncestor(this);
                
                // If it's player-related or we're in an iframe that's the player
                if (isPlayerContext || window.self !== window.top) {
                    return callback.apply(this, args);
                }
                
                // Block potentially problematic callbacks
                return null;
            };
            
            return originalSetTimeout.call(this, wrappedCallback, timeout);
        }
        
        return originalSetTimeout.apply(this, arguments);
    };
    
    // Override setInterval similar to setTimeout
    window.setInterval = function(callback, timeout, ...args) {
        // If it's a string callback, check for problematic redirects
        if (typeof callback === 'string') {
            if (callback.includes('location') || 
                callback.includes('redirect') || 
                callback.includes('window.location')) {
                return Math.floor(Math.random() * 10000); // Fake interval ID
            }
        }
        
        // For function callbacks, create a wrapper
        if (typeof callback === 'function') {
            const wrappedCallback = function() {
                // Detect if this is executed in player context
                const isPlayerContext = isPlayerOrAncestor(this);
                
                // If it's player-related or we're in an iframe that's the player
                if (isPlayerContext || window.self !== window.top) {
                    return callback.apply(this, args);
                }
                
                // Block potentially problematic callbacks
                return null;
            };
            
            return originalSetInterval.call(this, wrappedCallback, timeout);
        }
        
        return originalSetInterval.apply(this, arguments);
    };
    
    // Override history methods to prevent navigation
    History.prototype.pushState = function(state, title, url) {
        if (blockRedirectToHome(url)) {
            console.log('Blocked pushState redirect to:', url);
            return;
        }
        return originalPushState.apply(this, arguments);
    };
    
    History.prototype.replaceState = function(state, title, url) {
        if (blockRedirectToHome(url)) {
            console.log('Blocked replaceState redirect to:', url);
            return;
        }
        return originalReplaceState.apply(this, arguments);
    };
    
    // Override location methods
    const originalLocationAssign = Location.prototype.assign;
    Location.prototype.assign = function(url) {
        if (blockRedirectToHome(url)) {
            console.log('Blocked location.assign redirect to:', url);
            return;
        }
        return originalLocationAssign.call(this, url);
    };
    
    const originalLocationReplace = Location.prototype.replace;
    Location.prototype.replace = function(url) {
        if (blockRedirectToHome(url)) {
            console.log('Blocked location.replace redirect to:', url);
            return;
        }
        return originalLocationReplace.call(this, url);
    };
    
    // Override window.open
    window.open = function(url) {
        if (url && typeof url === 'string' && url.includes('home')) {
            console.log('Blocked window.open redirect to:', url);
            redirectsPrevented++;
            return null;
        }
        return originalOpen.apply(this, arguments);
    };
    
    // Block setting location directly
    Object.defineProperty(window, 'location', {
        get: function() {
            return window.location;
        },
        set: function(url) {
            if (typeof url === 'string' && url.includes('home')) {
                console.log('Blocked direct location change to:', url);
                redirectsPrevented++;
                return window.location;
            }
            window.location.href = url;
            return window.location;
        }
    });
    
    // Find and protect the player once DOM is ready
    function findAndProtectPlayer() {
        console.log('Looking for video player to protect...');
        
        // Specifically look for the player elements from the provided HTML
        const playerFrame = document.querySelector('.player-frame');
        const iframe = document.querySelector('#iframe-embed');
        
        if (playerFrame && iframe) {
            console.log('Found player elements to protect');
            playerProtected = true;
            
            // Make sure iframe src is properly set if empty
            if (!iframe.src || iframe.src === '') {
                // Try to find the correct source from page data
                // This is a common pattern where the iframe src is set by JS
                const scriptTags = document.querySelectorAll('script:not([src])');
                let possibleSrc = '';
                
                scriptTags.forEach(script => {
                    const content = script.textContent;
                    if (content.includes('iframe-embed') && content.includes('src')) {
                        const match = content.match(/["']iframe-embed["']\.src\s*=\s*["']([^"']+)["']/);
                        if (match && match[1]) {
                            possibleSrc = match[1];
                        }
                    }
                });
                
                if (possibleSrc) {
                    console.log('Setting iframe src to:', possibleSrc);
                    iframe.src = possibleSrc;
                }
            }
            
            // Enhance player visibility
            playerFrame.style.zIndex = '9999';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.minHeight = '500px';
            iframe.setAttribute('allowfullscreen', 'true');
            
            showNotification('Player protected. Blocking all other scripts.', 5000);
        } else {
            console.log('Player elements not found yet');
            
            // If not found, try again in a moment
            setTimeout(findAndProtectPlayer, 500);
        }
    }
    
    // Add style to hide annoying elements and ensure player visibility
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Hide potential ad elements */
            div[class*="ads"], div[id*="ads"],
            div[class*="ad-"], div[id*="ad-"],
            div[class*="-ad"], div[id*="-ad"],
            div[class*="banner"], div[id*="banner"],
            div[class*="popup"], div[id*="popup"] {
                display: none !important;
            }
            
            /* Make sure player is visible */
            .player-frame {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 9999 !important;
                min-height: 500px !important;
            }
            
            #iframe-embed {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                width: 100% !important;
                height: 100% !important;
                min-height: 500px !important;
            }
        `;
        
        // Add style to head
        const head = document.head || document.getElementsByTagName('head')[0];
        if (head) {
            head.appendChild(style);
        } else {
            // If head isn't available yet, wait and try again
            setTimeout(addStyles, 100);
        }
    }
    
    // Monitor status and display periodic updates
    function startStatusMonitor() {
        setInterval(() => {
            if (redirectsPrevented > 0) {
                showNotification(`Prevented ${redirectsPrevented} redirect attempts`);
                redirectsPrevented = 0;
            }
        }, 10000);
    }
    
    // Initialize everything
    function initialize() {
        // Add styles immediately
        addStyles();
        
        // Start finding and protecting player once DOM starts loading
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', findAndProtectPlayer);
        } else {
            findAndProtectPlayer();
        }
        
        // Start status monitor
        startStatusMonitor();
        
        console.log('AniwatchTV Player Isolation Script fully initialized');
    }
    
    // Execute initialization
    initialize();
})();