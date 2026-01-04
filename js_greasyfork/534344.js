// ==UserScript==
// @name         Basic Ad Blocker & Anti-Adblock Defeater (UserScript)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  A basic UserScript to attempt blocking common ads, including pop-up video ads and unwanted new tab redirects, and some anti-adblock detection methods.
// @author       Snow2122
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534344/Basic%20Ad%20Blocker%20%20Anti-Adblock%20Defeater%20%28UserScript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534344/Basic%20Ad%20Blocker%20%20Anti-Adblock%20Defeater%20%28UserScript%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // A list of common ad-related CSS selectors to hide or remove.
    // This list is based on common patterns found in advertising elements.
    const adSelectors = [
        // Generic ad containers
        '.ad', '.ads', '.advert', '.ad-container', '.banner-ad', '.google-ad',
        '.top-ad', '.bottom-ad', '.sidebar-ad', '.popup-ad',
        // Common element IDs
        '#ad', '#ads', '#advertisement', '#banner', '#google_ads_iframe',
        // Elements commonly used by ad networks or for injecting ads
        'iframe[src*="adserver"]', 'iframe[src*="doubleclick.net"]',
        'iframe[src*="googlesyndication.com"]', 'iframe[src*="adnxs.com"]',
        'iframe[src*="taboola.com"]', 'iframe[src*="outbrain.com"]',
        'iframe[src*="mgid.com"]', 'iframe[src*="monetize"]',
        'div[id*="ad_"]', 'div[class*="ad_"]',
        'div[id*="banner"]', 'div[class*="banner"]',
        'div[id*="advert"]', 'div[class*="advert"]',
        'div[data-google-query-id]', // Google AdSense specific
        // Elements often associated with "suggested content" or native ads
        '.native-ad', '.recommended-content', '.sponsored-content',
        // Pop-up related
        '.modal-backdrop', '.ad-popup-overlay', '.no-scroll',
        'body.adblock-active', // Some sites add this class when detecting adblock
        'div[style*="z-index: 99999"]', // Common for pop-ups
        'div[style*="position: fixed"]', // Common for sticky ads/pop-ups

        // --- Selectors specifically for video ads ---
        'video', // Directly target video tags
        'div[class*="video-ad"]', 'div[id*="video-ad"]', // Common video ad containers
        'div[class*="video-overlay"]', 'div[id*="video-overlay"]', // Overlays often used for video pop-ups
        'div[class*="video-player-ad"]', 'div[id*="video-player-ad"]', // More specific video player ad identifiers
        'iframe[src*="videoplaza.tv"]', // Known video ad server
        'iframe[src*="adform.net"]',   // Known video ad server
    ];

    // CSS rules to hide elements immediately. This is injected into the <head>.
    // Using !important to try and override inline styles.
    const hideCss = adSelectors.join(', ') + ' { display: none !important; visibility: hidden !important; }';

    // Anti-adblock detection circumvention attempts.
    // These are common variables or functions websites might check.
    const antiAdblockDefeaters = {
        // Common global variables checked by adblock detection scripts
        'AdBlock': false,
        'adblock': false,
        'blockAdblock': false,
        '_AdBlock_': false,
        'canRunAds': true, // Some scripts check this
        // Overriding common detection functions/properties
        'checkAdblock': () => false,
        'isAdblockActive': false,
    };

    // --- New blacklist for unwanted pop-up/redirect URLs ---
    const popupRedirectBlacklist = [
        'doubleclick.net', 'googlesyndication.com', 'adserver', 'popads.net',
        'onclickads.net', 'admaven.com', 'redirect.', 'trafficjunky.net',
        'exoclick.com', 'propellerads.com', 'adsterra.com', 'mgid.com',
        'popunder.', 'popcash.net', 'cpm-gate.com', 'adclick', 'ad-track'
    ];

    // --- Core Functions ---

    /**
     * Injects CSS rules into the document head to hide ad elements.
     * This runs very early to hide ads before they are fully rendered.
     */
    function injectHideCss() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(hideCss));
        document.head.appendChild(style);
        console.log('[Basic Ad Blocker] Injected CSS to hide ads.');
    }

    /**
     * Attempts to apply anti-adblock detection circumvention.
     * This tries to make the browser appear as if no ad blocker is present.
     */
    function circumventAntiAdblock() {
        for (const prop in antiAdblockDefeaters) {
            if (Object.prototype.hasOwnProperty.call(antiAdblockDefeaters, prop)) {
                try {
                    // Try to define a property on window to mimic no adblocker
                    Object.defineProperty(window, prop, {
                        value: antiAdblockDefeaters[prop],
                        writable: false, // Make it read-only if possible
                        configurable: true // Allow re-definition if needed
                    });
                    console.log(`[Basic Ad Blocker] Set window.${prop} to ${antiAdblockDefeaters[prop]}`);
                } catch (e) {
                    console.warn(`[Basic Ad Blocker] Failed to define window.${prop}:`, e);
                    // Fallback for strict environments
                    window[prop] = antiAdblockDefeaters[prop];
                }
            }
        }

        // Override common element dimension checks for anti-adblock
        // Websites might create a dummy ad div and check its size.
        const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
        const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

        if (originalOffsetWidth) {
            Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
                get: function() {
                    // If the element has common ad-related attributes, return a non-zero size
                    if (this.id && this.id.includes('ad') || this.className && this.className.includes('ad')) {
                        return 100; // Return a plausible size
                    }
                    return originalOffsetWidth.get.apply(this);
                },
                configurable: true
            });
        }

        if (originalOffsetHeight) {
            Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
                get: function() {
                    // If the element has common ad-related attributes, return a non-zero size
                    if (this.id && this.id.includes('ad') || this.className && this.className.includes('ad')) {
                        return 100; // Return a plausible size
                    }
                    return originalOffsetHeight.get.apply(this);
                },
                configurable: true
            });
        }
        console.log('[Basic Ad Blocker] Attempted to circumvent anti-adblock size checks.');
    }

    /**
     * Overrides window.open to block unwanted pop-up and redirect tabs.
     */
    function blockPopunders() {
        const originalWindowOpen = window.open;

        window.open = function(url, name, features) {
            // Check if the URL matches any of the blacklisted patterns
            const isBlocked = popupRedirectBlacklist.some(pattern => url && url.includes(pattern));

            if (isBlocked) {
                console.warn(`[Basic Ad Blocker] Blocked pop-under/redirect attempt to: ${url}`);
                return null; // Prevent the window from opening
            }

            // If not blocked, call the original window.open
            return originalWindowOpen.apply(this, arguments);
        };
        console.log('[Basic Ad Blocker] window.open override active for pop-under blocking.');
    }


    /**
     * Removes or hides elements matching ad selectors.
     * This function can be called repeatedly, e.g., on DOM mutations.
     * @param {HTMLElement | Document} container - The element or document to search within.
     */
    function blockAds(container = document) {
        let blockedCount = 0;
        adSelectors.forEach(selector => {
            try {
                const elements = container.querySelectorAll(selector);
                elements.forEach(el => {
                    // Check if the element is already hidden by our CSS
                    // If not, hide it with inline style or remove it if it's an iframe
                    if (el.style.display !== 'none' && el.style.visibility !== 'hidden') {
                        if (el.tagName === 'IFRAME') {
                            el.remove(); // Removing iframes is more effective for blocking content
                            console.log(`[Basic Ad Blocker] Removed iframe: ${selector}`);
                        } else if (el.tagName === 'VIDEO') {
                            // For video elements, try to pause and remove source before removing
                            if (!el.paused) el.pause();
                            el.src = ''; // Clear the video source
                            // Remove child <source> elements if any
                            while (el.firstChild) {
                                el.removeChild(el.firstChild);
                            }
                            el.remove(); // Remove the video element entirely
                            console.log(`[Basic Ad Blocker] Removed video ad: ${selector}`);
                        }
                        else {
                            el.style.setProperty('display', 'none', 'important');
                            el.style.setProperty('visibility', 'hidden', 'important');
                            console.log(`[Basic Ad Blocker] Hidden element: ${selector}`);
                        }
                        blockedCount++;
                    }
                });
            } catch (e) {
                console.error(`[Basic Ad Blocker] Error querying selector ${selector}:`, e);
            }
        });
        if (blockedCount > 0) {
            console.log(`[Basic Ad Blocker] Blocked ${blockedCount} elements.`);
        }
    }

    /**
     * Initializes the MutationObserver to watch for DOM changes.
     * When new nodes are added, it re-applies ad-blocking logic.
     */
    function setupMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        // Only process element nodes
                        if (node.nodeType === 1) { // Node.ELEMENT_NODE
                            blockAds(node);
                        }
                    });
                }
            });
        });

        // Start observing the entire document body for child list changes and subtree changes
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('[Basic Ad Blocker] MutationObserver set up.');
    }

    // --- Execution Flow ---

    // 1. Run anti-adblock circumvention attempts immediately
    //    before most scripts have a chance to run their checks.
    circumventAntiAdblock();

    // 2. Override window.open to block pop-unders and unwanted redirects.
    blockPopunders();

    // 3. Inject CSS rules at document-start to hide elements early.
    //    This is the fastest way to get visual hiding in place.
    injectHideCss();

    // 4. Perform an initial ad blocking pass on the existing document.
    //    This catches elements present in the initial HTML.
    blockAds();

    // 5. Set up a MutationObserver to catch dynamically loaded ads or elements
    //    that change after the initial page load. This ensures continuous blocking.
    //    Wait for the document body to be available before setting up the observer.
    if (document.body) {
        setupMutationObserver();
    } else {
        // If body is not yet available (e.g., very early in document-start),
        // wait for DOMContentLoaded to ensure body exists.
        document.addEventListener('DOMContentLoaded', setupMutationObserver);
    }

    console.log('[Basic Ad Blocker] UserScript initialized.');

})();
