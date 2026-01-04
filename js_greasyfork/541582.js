// ==UserScript==
// @name         Show youtube custom emoji/loyalty badge Alt Text as Tooltip
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Show alt text as tooltips for YouTube emojis and badges (including inside shadow DOM), with throttled scanning and smart logging.
// @author       Aonnymous
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541582/Show%20youtube%20custom%20emojiloyalty%20badge%20Alt%20Text%20as%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/541582/Show%20youtube%20custom%20emojiloyalty%20badge%20Alt%20Text%20as%20Tooltip.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === CONFIGURABLE CONSTANTS ===
    const SCAN_INTERVAL_MS = 5000;           // Throttle interval for processing image tooltips
    const ENABLE_EMOJI_TOOLTIP = true;       // Whether to apply tooltips to emojis in spans/shadow roots
    const DEBUG_LOGGING = true;              // Toggle console debug logging
    const LOG_THROTTLE_MS = 5000;            // Minimum delay between repeated log summaries

    // === INTERNAL STATE ===
    const pendingImages = new Set();
    let totalProcessed = 0;

    // Throttled log queue
    let queuedImageCount = 0;
    let queuedNodeCount = 0;
    let lastQueuedLogTime = 0;

    /** Utility log wrapper */
    function log(msg, ...args) {
        if (DEBUG_LOGGING) console.log(`[AltTooltip] ${msg}`, ...args);
    }

    /** Applies alt text to the title of an <img> */
    function setAltAsTitle(img) {
        try {
            if (img.alt) {
                img.title = img.alt;
                totalProcessed++;
            }
        } catch (error) {
            console.error('[AltTooltip] Failed to apply title to image:', img, error);
        }
    }

    /** Whether this image should be handled (e.g., emoji in span/shadow) */
    function isCustomEmoji(img) {
        return ENABLE_EMOJI_TOOLTIP;
    }

    /** Process and apply tooltips to queued images */
    function processImages() {
        const countBefore = pendingImages.size;
        if (countBefore === 0) {
            log('No new items to process.');
            return;
        }

        let actuallyProcessed = 0;

        for (const img of pendingImages) {
            if (img.isConnected && img.alt && !img.title && isCustomEmoji(img)) {
                setAltAsTitle(img);
                if (img.title === img.alt) {
                    actuallyProcessed++;
                }
            }
        }

        pendingImages.clear();
        log(`Processed ${countBefore} images, applied tooltip to ${actuallyProcessed}. Total processed: ${totalProcessed}`);
    }

    /** Add eligible images to queue */
    function collectImages(root) {
        try {
            const images = root.querySelectorAll?.('img[alt]:not([title])');
            if (images) {
                let added = 0;
                images.forEach(img => {
                    pendingImages.add(img);
                    added++;
                });

                // Track for grouped log output
                queuedImageCount += added;
                queuedNodeCount++;

                const now = Date.now();
                if (now - lastQueuedLogTime >= LOG_THROTTLE_MS && queuedImageCount > 0) {
                    log(`Queued ${queuedImageCount} image(s) from ${queuedNodeCount} node(s).`);
                    queuedImageCount = 0;
                    queuedNodeCount = 0;
                    lastQueuedLogTime = now;
                }
            }
        } catch (error) {
            console.error('[AltTooltip] Error collecting images from:', root, error);
        }
    }

    /** Walk through a root and all shadow roots to find images */
    function walkDOMAndShadow(root) {
        collectImages(root);
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            if (node.shadowRoot) {
                walkDOMAndShadow(node.shadowRoot);
            }
        }
    }

    /** Handle a new added node and its descendants */
    function handleNodeAndDescendants(node) {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'IMG' && node.alt && !node.title) {
            pendingImages.add(node);
        } else {
            walkDOMAndShadow(node);
        }

        if (node.shadowRoot) {
            observeShadowRoot(node.shadowRoot);
        }
    }

    /** Attach MutationObserver to a shadow root */
    function observeShadowRoot(shadowRoot) {
        try {
            const shadowObserver = new MutationObserver(mutations => {
                mutations.forEach(m => m.addedNodes.forEach(handleNodeAndDescendants));
            });
            shadowObserver.observe(shadowRoot, { childList: true, subtree: true });
            walkDOMAndShadow(shadowRoot);
            log('Attached observer to shadowRoot.');
        } catch (e) {
            console.error('[AltTooltip] Failed to observe shadowRoot:', e);
        }
    }

    /** Main MutationObserver handler */
    function handleMutations(mutations) {
        mutations.forEach(m => {
            m.addedNodes.forEach(handleNodeAndDescendants);
        });
    }

    /** Initial scan of document and shadow roots */
    function scanInitialPage() {
        try {
            walkDOMAndShadow(document);
            log('Initial scan complete.');
        } catch (error) {
            console.error('[AltTooltip] Initial scan failed:', error);
        }
    }

    // === MAIN LOGIC ===

    setInterval(processImages, SCAN_INTERVAL_MS);
    log(`Running. Processing every ${SCAN_INTERVAL_MS / 1000}s. Emoji tooltips: ${ENABLE_EMOJI_TOOLTIP}`);

    scanInitialPage();

    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });
    log('Observer attached to document.body');
})();
