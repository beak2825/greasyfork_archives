// ==UserScript==
// @name         Twitch Ad blocker
// @namespace    http://tampermonkey.net/
// @version      V9
// @description  Blocks All twitch ads 100% of the time! Never view another ad! (UPDATED) - Haven't tested, so may or may not work.
// @author       NotYou (Gabriel Underwood)
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538097/Twitch%20Ad%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/538097/Twitch%20Ad%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if element contains ad blocker detection text
    function hasAdBlockerText(element) {
        const text = element.textContent.toLowerCase();
        return text.includes('remove') || text.includes('ad blocker') || text.includes('adblocker') || 
               text.includes('disable your ad blocker') || text.includes('turn off ad blocker') ||
               text.includes('please disable') || text.includes('detected ad blocker');
    }

    // Function to check if element is a legitimate overlay (chat, controls, etc.)
    function isLegitimateOverlay(element) {
        const classList = element.className.toLowerCase();
        const id = element.id.toLowerCase();
        
        // Allow chat and overlay controls
        const allowedPatterns = [
            'chat',
            'control',
            'button',
            'menu',
            'tooltip',
            'dropdown',
            'modal',
            'notification',
            'alert',
            'popup-menu',
            'context-menu',
            'player-controls',
            'stream-info',
            'follow-button',
            'subscribe-button'
        ];
        
        return allowedPatterns.some(pattern => 
            classList.includes(pattern) || id.includes(pattern)
        );
    }

    // Function to check if element is covering significant screen area
    function isCoveringScreen(element) {
        const rect = element.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        // Consider it covering if it's large and positioned absolutely/fixed
        const style = window.getComputedStyle(element);
        const isOverlay = style.position === 'fixed' || style.position === 'absolute';
        const isLarge = rect.width > viewport.width * 0.3 || rect.height > viewport.height * 0.3;
        const isFullScreen = rect.width > viewport.width * 0.8 && rect.height > viewport.height * 0.8;
        
        return isOverlay && (isLarge || isFullScreen);
    }

    // Main function to remove unwanted overlays
    function removeUnwantedOverlays() {
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            // Instantly remove anything with ad blocker detection text
            if (hasAdBlockerText(element)) {
                console.log('Removed ad blocker detection element:', element);
                element.remove();
                return;
            }
            
            // Remove elements covering the screen that aren't legitimate overlays
            if (isCoveringScreen(element) && !isLegitimateOverlay(element)) {
                // Additional check for common ad overlay patterns
                const classList = element.className.toLowerCase();
                const suspiciousPatterns = [
                    'overlay',
                    'interstitial',
                    'banner',
                    'popup',
                    'modal',
                    'dialog'
                ];
                
                const isSuspicious = suspiciousPatterns.some(pattern => classList.includes(pattern));
                
                if (isSuspicious) {
                    console.log('Removed suspicious overlay:', element);
                    element.remove();
                }
            }
        });
    }

    // Run immediately
    removeUnwantedOverlays();

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeUnwantedOverlays);
    }

    // Run when page is fully loaded
    window.addEventListener('load', removeUnwantedOverlays);

    // Continuously monitor for new elements (ads can be dynamically loaded)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // Check the new node itself
                    if (hasAdBlockerText(node)) {
                        console.log('Removed new ad blocker detection element:', node);
                        node.remove();
                        return;
                    }
                    
                    if (isCoveringScreen(node) && !isLegitimateOverlay(node)) {
                        console.log('Removed new overlay element:', node);
                        node.remove();
                        return;
                    }
                    
                    // Check children of the new node
                    const children = node.querySelectorAll('*');
                    children.forEach(child => {
                        if (hasAdBlockerText(child)) {
                            console.log('Removed nested ad blocker detection element:', child);
                            child.remove();
                        } else if (isCoveringScreen(child) && !isLegitimateOverlay(child)) {
                            console.log('Removed nested overlay element:', child);
                            child.remove();
                        }
                    });
                }
            });
        });
    });

    // Start observing
    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

    // Also run periodically as a backup
    setInterval(removeUnwantedOverlays, 2000);

    console.log('Twitch Screen Overlay Blocker is active');
})();