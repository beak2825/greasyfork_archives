// ==UserScript==
// @name         MPROGaming Ad Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass ads and ad-blocker detection on MPROGaming
// @author       abadi718
// @match        https://mprogaming.com/*
// @match        https://*.mprogaming.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544445/MPROGaming%20Ad%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/544445/MPROGaming%20Ad%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Block ad detection functions
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    
    window.setTimeout = function(func, delay, ...args) {
        if (typeof func === 'string') {
            // Block obfuscated ad detection code
            if (func.includes('adblock') || func.includes('blocker') || 
                func.includes('detector') || func.length > 1000) {
                return;
            }
        }
        return originalSetTimeout.call(this, func, delay, ...args);
    };

    window.setInterval = function(func, delay, ...args) {
        if (typeof func === 'string') {
            if (func.includes('adblock') || func.includes('blocker') || 
                func.includes('detector') || func.length > 1000) {
                return;
            }
        }
        return originalSetInterval.call(this, func, delay, ...args);
    };

    // Override ad detection variables
    window.ai_block_class_def = null;
    window.ai_check_block = function() { return true; };
    window.ai_process_lists = function() {};
    window.ai_adb_process_blocks = function() {};
    
    // Block cookie-based detection
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        if (key.includes('aiBLOCKS') || key.includes('adblock') || key.includes('blocker')) {
            return;
        }
        return originalSetItem.call(this, key, value);
    };

    // Remove ad blocker detection elements when DOM loads
    function removeAdBlockerElements() {
        // Remove ad blocker modal/overlay
        const adBlockerModal = document.querySelector('[class*="yxfkbvdlwtjfqufwefnxcddivmrpdrhneomnymezvrvpunaxwwpr"]');
        if (adBlockerModal) {
            adBlockerModal.remove();
        }

        // Remove any elements with obfuscated class names typical of ad detection
        const suspiciousElements = document.querySelectorAll('[class*="etxfw"], [id*="etxfw"], [class*="tetxfw"], [id*="tetxfw"]');
        suspiciousElements.forEach(el => {
            if (el.textContent.includes('Ads Blocker') || 
                el.textContent.includes('Please support us') ||
                el.textContent.includes('detected')) {
                el.remove();
            }
        });

        // Remove overlay backgrounds
        const overlays = document.querySelectorAll('div[style*="position: fixed"][style*="z-index"]');
        overlays.forEach(overlay => {
            const style = overlay.getAttribute('style');
            if (style && style.includes('rgba(0, 0, 0, 0.7)')) {
                overlay.remove();
            }
        });

        // Remove any iframe ads
        const iframes = document.querySelectorAll('iframe[src*="gossipwheel"], iframe[src*="watchnew"]');
        iframes.forEach(iframe => iframe.remove());

        // Hide ad containers
        const adContainers = document.querySelectorAll('.adsbygoogle, [class*="ad-"], [id*="ad-"], .sidebar-ad, .ad-slot, .ads, .doubleclick');
        adContainers.forEach(container => {
            container.style.display = 'none';
        });
    }

    // Override document ready detection
    Object.defineProperty(document, 'readyState', {
        get: function() { return 'complete'; },
        configurable: true
    });

    // Block external ad scripts
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'script') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name === 'src' && typeof value === 'string') {
                    // Block known ad domains and suspicious scripts
                    if (value.includes('gossipwheel') || 
                        value.includes('ptichoolsougn') ||
                        value.includes('bvtpk.com') ||
                        value.includes('mrmnd.com') ||
                        value.includes('googletagmanager') ||
                        value.includes('doubleclick') ||
                        value.includes('googlesyndication')) {
                        return;
                    }
                }
                return originalSetAttribute.call(this, name, value);
            };
        }
        
        return element;
    };

    // Run cleanup when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAdBlockerElements);
    } else {
        removeAdBlockerElements();
    }

    // Continuous monitoring for dynamically added elements
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Check if it's an ad blocker detection element
                    if (node.className && typeof node.className === 'string') {
                        if (node.className.includes('etxfw') || 
                            node.className.includes('tetxfw') ||
                            (node.textContent && (
                                node.textContent.includes('Ads Blocker') ||
                                node.textContent.includes('Please support us') ||
                                node.textContent.includes('detected')
                            ))) {
                            node.remove();
                            return;
                        }
                    }

                    // Remove any modal overlays
                    if (node.style && node.style.position === 'fixed' && 
                        node.style.zIndex && parseInt(node.style.zIndex) > 9999) {
                        node.remove();
                        return;
                    }

                    // Check for ads within the added node
                    const adElements = node.querySelectorAll && node.querySelectorAll('.adsbygoogle, [class*="ad-"], iframe[src*="gossip"]');
                    if (adElements) {
                        adElements.forEach(ad => ad.remove());
                    }
                }
            });
        });
    });

    // Start observing
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Override console to prevent error spam
    const originalError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        if (message.includes('adblock') || message.includes('blocker') || 
            message.includes('Content is protected')) {
            return;
        }
        return originalError.apply(this, args);
    };

    // Block right-click protection
    document.oncontextmenu = null;
    document.ondragstart = null;
    document.onselectstart = null;
    document.onkeydown = null;

    // Remove text selection restrictions
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
        
        .unselectable {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            user-select: text !important;
        }
        
        /* Hide ad detection elements */
        [class*="yxfkbvdlwtjfqufwefnxcddivmrpdrhneomnymezvrvpunaxwwpr"],
        [id*="yxfkbvdlwtjfqufwefnxcddivmrpdrhneomnymezvrvpunaxwwpr"],
        [class*="etxfwetxfw"],
        [id*="etxfwetxfw"] {
            display: none !important;
            visibility: hidden !important;
        }
        
        /* Hide ad containers */
        .adsbygoogle,
        [class*="ad-"],
        .sidebar-ad,
        .ad-slot,
        .ads,
        .doubleclick,
        iframe[src*="gossip"],
        iframe[src*="watchnew"] {
            display: none !important;
        }
    `;
    
    if (document.head) {
        document.head.appendChild(style);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.head.appendChild(style);
        });
    }

    console.log('MPROGaming Ad Bypass: Activated');
})();