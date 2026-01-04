// ==UserScript==
// @name         AliExpress Product Link Fixer
// @namespace    http://tampermonkey.net/
// @version      2.4
// @license      MIT
// @description  Enhance your AliExpress shopping experience by converting marketing links into direct product links, ensuring each product is easily accessible with a single click.
// @author       NewsGuyTor
// @match        https://*.aliexpress.com/*
// @icon         https://www.aliexpress.com/favicon.ico
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/521404/AliExpress%20Product%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/521404/AliExpress%20Product%20Link%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global Variables ---
    let observer;               // MutationObserver instance to watch for page changes
    let debounceTimer;          // Timer ID for debouncing MutationObserver callbacks
    let isHandlingClick = false; // Flag to prevent click handler re-entry issues

    const ALIFIX_VERSION = '2.4';
    const ALIFIX_LOG = `[AliFix v${ALIFIX_VERSION}]`;
    const ALIFIX_LOG_LONG = `[AliExpress Product Link Fixer v${ALIFIX_VERSION}]`;

    const ALIFIX_CANONICAL_HOST = 'www.aliexpress.com';

    function getAliExpressHostForLinks(host) {
        if (!host) return ALIFIX_CANONICAL_HOST;
        const parts = String(host).split(':');
        const hostname = (parts[0] || '').toLowerCase();
        const port = parts.length > 1 ? ':' + parts.slice(1).join(':') : '';
        if (hostname === 'best.aliexpress.com') return ALIFIX_CANONICAL_HOST + port;
        return host;
    }

    // --- Core Functions ---

    /**
     * Schedules the main link fixing logic to run after a short delay.
     * This prevents the function from running excessively on rapid DOM changes.
     */
    function scheduleFixLinks() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fixLinks, 250); // Wait 250ms after the last mutation
    }

    /**
     * Main function orchestrating the different link fixing strategies.
     * Temporarily disconnects the observer to avoid infinite loops while modifying the DOM.
     */
    function fixLinks() {
        if (observer) observer.disconnect(); // Pause observation during modification

        try {
            // Apply fixes in a specific order
            removeMarketingAnchors();        // Phase 1: Clean up wrapper links without direct product IDs (carefully)
            rewriteAnchorsWithProductIds();  // Phase 2: Correct links that *do* contain product IDs
            fixOrCreateLinksForDataProducts(); // Phase 3: Ensure product elements (divs/etc.) are properly linked
        } catch (err) {
            console.error(`${ALIFIX_LOG_LONG} Error in fixLinks():`, err);
        }
        // Resume observation after modifications are done
        if (observer) {
            try {
                 observer.observe(document.body, { childList: true, subtree: true });
            } catch (e) { // Handle edge case where the page unloads rapidly
                 if (e.name !== 'NotFoundError') console.error(`${ALIFIX_LOG} Error reconnecting observer:`, e);
            }
        } else { console.warn(`${ALIFIX_LOG} Observer not ready.`); }
    }

   /**
     * Phase 1: Removes wrapper anchor tags (`<a>`) that point to marketing URLs
     * (containing '/gcp/' or '/ssr/') *without* a specific 'productIds' parameter.
     * It unwraps the anchor, keeping its child elements in place.
     * It avoids unwrapping anchors that appear to be structural components (containing complex nested divs)
     * or specific excluded navigation elements.
     */
    function removeMarketingAnchors() {
        // Select potential marketing anchors not yet processed by this script
        const anchors = document.querySelectorAll('a[href*="/gcp/"]:not([data-alifix-done]), a[href*="/ssr/"]:not([data-alifix-done])');

        anchors.forEach(a => {
            // Skip if already marked as processed
            if (a.dataset.alifixDone) return;

            // --- Exclusion Checks ---
            // 1. Exclude specific header navigation links (e.g., Bundle Deals, Choice tabs)
            const headerNavContainer = a.closest('div.an_ar.an_at[data-tabs="true"]');
            if (headerNavContainer) {
                a.dataset.alifixDone = "1"; // Mark as processed to prevent other functions touching it
                return; // Do not unwrap header links
            }

            // --- Process other potential marketing links ---
            try {
                if (!a.href) { if (a && a.dataset) a.dataset.alifixDone = "1"; return; } // Skip anchors without href
                const url = new URL(a.href, location.origin);

                // Only consider anchors without productIds for unwrapping
                if (!url.searchParams.has('productIds')) {

                    // --- Structural Check: Avoid unwrapping complex/structural anchors ---
                    let hasDirectDivChild = false;
                    for (let i = 0; i < a.children.length; i++) {
                        if (a.children[i].tagName === 'DIV') {
                            hasDirectDivChild = true;
                            break;
                        }
                    }

                    if (hasDirectDivChild) {
                        // This anchor contains a direct DIV child. It might be a structural element. Let's NOT unwrap it.
                         if (a && a.dataset) a.dataset.alifixDone = "1";
                         return; // Skip unwrapping
                    }
                    // --- End of Structural Check ---

                    // If we pass the checks, proceed to unwrap
                     if (a && a.dataset) a.dataset.alifixDone = "1"; // Mark before unwrapping
                     unwrapAnchor(a); // Remove the anchor, keep children

                }
                // Anchors with productIds are handled by rewriteAnchorsWithProductIds.

            } catch (e) {
                console.error(`${ALIFIX_LOG} Error processing anchor for potential removal:`, a.href, e);
                 if (a && a.dataset) a.dataset.alifixDone = "1"; // Mark as done on error
            }
        });
    }

    /**
     * Phase 2: Rewrites anchor tags that point to marketing URLs ('/gcp/' or '/ssr/')
     * but *do* contain a 'productIds' parameter. It changes the href to point
     * directly to the standard '/item/...' product page URL.
     */
    function rewriteAnchorsWithProductIds() {
        // Select relevant anchors not yet processed
        const anchors = document.querySelectorAll('a[href*="/gcp/"]:not([data-alifix-done]), a[href*="/ssr/"]:not([data-alifix-done])');

        anchors.forEach(a => {
            if (a.dataset.alifixDone) return; // Skip already processed

            try {
                if (!a.href) { if (a && a.dataset) a.dataset.alifixDone = "1"; return; }
                const url = new URL(a.href, location.origin);
                const pidParam = url.searchParams.get('productIds');

                if (pidParam) {
                    const actualPid = pidParam.split(':')[0];
                    if (actualPid && /^\d+$/.test(actualPid)) {
                        const safeHost = getAliExpressHostForLinks(url.host);
                        const newHref = `https://${safeHost}/item/${actualPid}.html`;
                        if (a.href !== newHref) {
                            a.href = newHref;
                        }
                         if (a.dataset) a.dataset.alifixDone = "1"; // Mark as successfully processed
                    } else {
                        console.warn(`${ALIFIX_LOG} Invalid PID format found:`, pidParam, "in anchor:", a.href);
                        if (a.dataset) a.dataset.alifixDone = "1"; // Mark as processed even if PID format was invalid
                    }
                } else {
                     // Mark anchors without productIds as done here if they weren't unwrapped in phase 1
                     if (a.dataset) a.dataset.alifixDone = "1";
                }
            } catch (e) {
                console.error(`${ALIFIX_LOG} Error processing anchor for rewrite:`, a.href, e);
                 if (a && a.dataset) a.dataset.alifixDone = "1"; // Mark done on error
            }
        });
    }

   /**
     * Phase 3: Ensures that elements representing products have a functional, direct link.
     * Targets elements identified either by 'data-product-ids' attribute or specific
     * div structures (like those on Bundle Deals pages with numeric IDs, identified more robustly).
     * If a correct link doesn't exist, it creates a wrapper `<a>` tag.
     * Applies CSS `pointer-events: none` to the original inner element when wrapping,
     * to prevent interference from its original JS click handlers.
     * Attaches a custom click handler to newly created links to manage navigation reliably.
     */
    function fixOrCreateLinksForDataProducts() {
        // Select potential product elements using various known patterns, excluding already processed ones
        const productIndicators = document.querySelectorAll(
            '[data-product-ids]:not([data-alifix-done]), ' +                     // Common pattern
            '.g6_cy[data-product-ids]:not([data-alifix-done]), ' +                // Specific class often used with data-product-ids
            // --- Robust Selectors for Bundle Deals Containers ---
            '#root div[mod-name*="waterfall"] div[id][class*="productContainer"]:not([data-alifix-done]), ' + // Waterfall view
            '#root div[mod-name*="goods-slider"] div[id][class*="productContainer"]:not([data-alifix-done]), ' + // Slider view
            // --- End Robust Selectors ---
            'div.jc_bt.jc_jl[data-product-ids]:not([data-alifix-done])'          // AliExpress Business section pattern
        );

        productIndicators.forEach(element => {
            let pid;
            let isBundleDealsDiv = false; // Flag if it's a Bundle Deals div needing wrapping

            if (!element || !element.dataset || element.dataset.alifixDone) return;

            // Determine the source of the Product ID
            if (element.dataset.productIds) {
                pid = element.dataset.productIds.split(':')[0]; // Handle potential extra chars
            } else if (element.tagName === 'DIV' && element.id && /^\d+$/.test(element.id)) {
                 // Check if it matches our robust selectors for Bundle Deals divs
                 if (element.matches('#root div[mod-name*="waterfall"] div[id][class*="productContainer"], #root div[mod-name*="goods-slider"] div[id][class*="productContainer"]')) {
                     pid = element.id;
                     isBundleDealsDiv = true; // Mark it for wrapping
                 } else {
                     // It's a div with a numeric ID, but doesn't match the Bundle Deals patterns we target
                     if (element.dataset) element.dataset.alifixDone = "1";
                     return;
                 }
            } else { if (element.dataset) element.dataset.alifixDone = "1"; return; } // No valid PID source found

            // Validate the extracted/found Product ID
            if (!pid || !/^\d+$/.test(pid)) {
                console.warn(`${ALIFIX_LOG} Invalid PID found for element:`, pid, element);
                if (element.dataset) element.dataset.alifixDone = "1";
                return;
            }

            // Mark the element as processed EARLY to prevent potential infinite loops
            element.dataset.alifixDone = "1";
            const safeHost = getAliExpressHostForLinks(location.host);
            const targetHref = `https://${safeHost}/item/${pid}.html`;

            // --- Check if linking is already handled ---

            // 1. Check if correctly wrapped by a *direct* parent anchor
            const parentAnchor = element.parentNode;
             if (parentAnchor && parentAnchor.tagName === 'A') {
                  if (parentAnchor.href === targetHref) {
                      if (!parentAnchor.dataset.alifixDone) parentAnchor.dataset.alifixDone = "1";
                      return; // Already handled
                  } else if (!parentAnchor.dataset.alifixDone) {
                       parentAnchor.href = targetHref;
                       parentAnchor.dataset.alifixDone = "1";
                       return; // Handled
                  } else { return; } // Already marked done
             }

            // 2. For elements identified by `data-product-ids`, check for an *inner* anchor to fix.
            //    Skip this check if the element itself is an anchor OR if it's a BundleDealsDiv (which we intend to wrap).
            if (!isBundleDealsDiv && element.tagName !== 'A') {
                const existingInnerAnchor = element.querySelector('a:not([data-alifix-link-added]):not([id*="/^\\d+$/"])');
                if (existingInnerAnchor && !existingInnerAnchor.dataset.alifixDone) {
                     if (existingInnerAnchor.href !== targetHref) {
                        existingInnerAnchor.href = targetHref;
                     }
                     existingInnerAnchor.dataset.alifixDone = "1";
                     return; // Handled
                }
            }

            // --- Create a new wrapper link if no suitable parent/inner link was found/fixed ---
            if (!element.parentNode) {
                console.warn(`${ALIFIX_LOG} Element for PID ${pid} lost its parent before wrapping.`);
                return;
            }

            const link = document.createElement('a');
            link.href = targetHref;
            link.dataset.alifixDone = "1";
            link.dataset.alifixLinkAdded = "1";
            link.style.display = 'block';
            link.style.color = 'inherit';
            link.style.textDecoration = 'none';
            link.style.cursor = 'pointer';

            link.addEventListener('click', handleProductClick, true);

            try {
                 element.parentNode.insertBefore(link, element);
                 link.appendChild(element);
                 // Disable pointer events on the original div to override AE's JS listeners
                 element.style.setProperty('pointer-events', 'none', 'important');
            } catch (e) { console.error(`${ALIFIX_LOG} Error wrapping element PID ${pid}:`, e, element); }
        });
    }


    /**
     * Custom click handler attached ONLY to newly created wrapper anchors.
     * Prevents the anchor's default navigation and stops the event from propagating.
     * Handles opening in new tab (Ctrl/Cmd/Middle-click) or same tab manually.
     * Uses a guard flag (`isHandlingClick`) to prevent issues from rapid/double clicks.
     */
    function handleProductClick(event) {
        // Prevent re-entry if handler is already running
        if (isHandlingClick) {
            event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); return false;
        }
        isHandlingClick = true;

        // Immediately stop the default action (navigation) and prevent event propagation
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation(); // Stop other listeners on this same element too

        const link = event.currentTarget; // The anchor element we attached the listener to
        const href = link.href;

        // Double-check the link is valid before navigating
        if (!href || !href.startsWith('http') || !href.includes('/item/')) {
            console.warn(`${ALIFIX_LOG} Click handler stopped non-navigable/invalid link:`, href, "Target:", event.target);
            setTimeout(() => { isHandlingClick = false; }, 50);
            return false; // Ensure no fallback default action occurs
        }

        // Determine if a new tab is requested (Middle mouse, Ctrl+click, Cmd+click)
        const isMiddleClick = event.button === 1;
        const isCtrlClick = event.ctrlKey;
        const isMetaClick = event.metaKey; // Cmd on Mac
        const openInNewTab = isMiddleClick || isCtrlClick || isMetaClick;

        // Manually perform the navigation
        if (openInNewTab) {
             if (typeof GM_openInTab === 'function') {
                   try {
                        GM_openInTab(href, { active: isMiddleClick, insert: true });
                   } catch (gmErr) {
                       console.error(`${ALIFIX_LOG} Error using GM_openInTab:`, gmErr, "Falling back to window.open.");
                       window.open(href, '_blank'); // Fallback on GM error
                   }
             } else {
                  console.warn(`${ALIFIX_LOG} GM_openInTab not available/granted, using window.open.`);
                  window.open(href, '_blank'); // Fallback if GM function doesn't exist
             }
        } else if (event.button === 0) { // Standard left click
            window.location.href = href; // Navigate in the current tab
        }

        // Reset the re-entry guard after a short delay
        setTimeout(() => {
            isHandlingClick = false;
        }, 50);
        return false; // Standard practice to return false from handlers that prevent default
    }

    /**
     * Helper function to remove a wrapper element (typically an anchor)
     * while keeping its child nodes in the same position in the DOM.
     * @param {HTMLElement} wrapper - The element to remove.
     */
    function unwrapAnchor(wrapper) {
        const parent = wrapper.parentNode;
        if (!parent || !wrapper) return; // Safety check
        try {
            while (wrapper.firstChild) {
                parent.insertBefore(wrapper.firstChild, wrapper);
            }
            if (wrapper.parentNode === parent) {
                 parent.removeChild(wrapper);
            }
        } catch (e) { console.error(`${ALIFIX_LOG} Error unwrapping element:`, wrapper, e); }
    }

    // --- Initialization and Observation ---

     // Run the fixes once initially after the DOM is ready or loaded
     if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixLinks);
     } else {
        // DOM already loaded, run after a short delay to allow page JS to potentially settle
        setTimeout(fixLinks, 150);
     }

    // Create and start the MutationObserver to watch for dynamically loaded content
    observer = new MutationObserver(scheduleFixLinks); // Use the debounced scheduler

    // Observe the body initially. If body isn't available yet, wait.
    function startObserver() {
        if (document.body) {
             observer.observe(document.body, {
                childList: true,  // Watch for addition/removal of nodes
                subtree: true     // Watch descendants as well
             });
             console.log(`${ALIFIX_LOG_LONG} Initialized and observing.`);
        } else {
            console.warn(`${ALIFIX_LOG} Document body not ready, retrying observer start...`);
            setTimeout(startObserver, 100);
        }
    }
    startObserver();

})();
