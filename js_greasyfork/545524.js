// ==UserScript==
// @name         SVG Country Flag Emoji --Q
// @namespace    Violentmonkey Scripts
// @version      2025-08-16_23-50
// @description  Replace all flag emojis with SVG images, initially started as a way to fix the 🇦🇺 being rendered as AU in Chrome in particular, although I now have a better solution - see https://github.com/quarrel/broken-flag-emojis-win11-twemoji.
// @author       Quarrel
// @homepage     https://github.com/quarrel/country-flags-emoji
// @match        *://*/*
// @run-at       document-start
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/@twemoji/api@16.0.1/dist/twemoji.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545524/SVG%20Country%20Flag%20Emoji%20--Q.user.js
// @updateURL https://update.greasyfork.org/scripts/545524/SVG%20Country%20Flag%20Emoji%20--Q.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the Unicode range for Regional Indicator Symbols (used for flags)
    // Regional Indicator Symbol Letter A (🇦) is U+1F1E6
    // Regional Indicator Symbol Letter Z (🇿) is U+1F1FF
    const REGIONAL_INDICATOR_START = 0x1F1E6;
    const REGIONAL_INDICATOR_END = 0x1F1FF;
    const BASE_URL = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@16.0.1/assets/svg/';
    const UNIQUE_EMOJI_CLASS = 'Q93EMOJIQ';
    const CACHE_KEY = 'Q_twemoji_flag_cache';
    const CACHE_EXPIRATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
    const DEBOUNCE_THRESHOLD = 50; // Process mutations immediately up to this count
    const DEBOUNCE_DELAY_MS = 10; // don't hog the processing
    const TRANSPARENT_GIF_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    const svgBlobUrlCache = new Map();
    const pendingSvgRequests = new Map();

    const blobToBase64 = (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    const base64ToBlob = (base64) => {
        const parts = base64.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
    };

    GM_addStyle(`
        img.${UNIQUE_EMOJI_CLASS}, img.P-${UNIQUE_EMOJI_CLASS} {
            height: 1em !important;
            width: 1em !important;
            vertical-align: -0.1em !important;
            margin: 0 .05em 0 .1em !important;
        }
    `);

    let persistentCache = {};

    const flagsTwemojiCallback = (icon, options) => {
        const parts = icon.split('-');
        if (parts.length === 2) {
            const part1 = parseInt(parts[0], 16);
            const part2 = parseInt(parts[1], 16);
            if (part1 >= REGIONAL_INDICATOR_START && part1 <= REGIONAL_INDICATOR_END &&
                part2 >= REGIONAL_INDICATOR_START && part2 <= REGIONAL_INDICATOR_END) {
                //console.log('Found flag: ' + icon)
                if (svgBlobUrlCache.has(icon) || persistentCache[icon]) {
                    const url = svgBlobUrlCache.get(icon) || URL.createObjectURL(base64ToBlob(persistentCache[icon].data));
                    if (!svgBlobUrlCache.has(icon)) {
                        svgBlobUrlCache.set(icon, url); // Cache the blob URL for this session
                    }
                    return url;
                }
                //return ''.concat(options.base, options.size, '/', icon, options.ext); // a fallback in case our svg fetch fails, theirs might not
                //I think the url is the better option on most sites, but the gif works better when a CSP policy is a problem for us, and we can't tell the CSP from js
                //I could use GM_addElement to add the element, and avoid the CSP, but then I'd need to ditch the library .. tempting. could solve shadowDom issues etc if doing it all myself.
                return TRANSPARENT_GIF_PLACEHOLDER;
            }
        }
        // For non-flags, don't change anything
        return false;
    };

    // Lazy load the svgs
    const loadAndCacheSvg = (icon, originalText) => {
        const promise = (async () => {
            try {
                console.log(`Downloading SVG for ${icon}.`);
                const url = BASE_URL + icon + '.svg';
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'blob',
                        onload: resolve,
                        onerror: reject
                    });
                }).catch(err => console.error(`GM_xmlhttpRequest failed for ${url}`, err));

                if (response && response.status === 200) {
                    const base64 = await blobToBase64(response.response);
                    persistentCache[icon] = { data: base64, timestamp: Date.now() };
                    GM_setValue(CACHE_KEY, persistentCache); // this is async. could consider debouncing it, but probably not an issue in reality?
                    const blobUrl = URL.createObjectURL(response.response);
                    svgBlobUrlCache.set(icon, blobUrl);

                    // Update all images for this icon
                    const allImagesForThisIcon = document.querySelectorAll(`img.${UNIQUE_EMOJI_CLASS}[alt="${originalText}"]`);
                    for (const imageToUpdate of allImagesForThisIcon) {
                        imageToUpdate.src = blobUrl;
                        imageToUpdate.className = 'P-' + UNIQUE_EMOJI_CLASS;
                    }
                } else {
                    console.error(`Failed to load SVG for ${icon}`);
                }
            } finally {
                // The request is complete, remove it from the pending map.
                pendingSvgRequests.delete(icon);
            }
        })();

        pendingSvgRequests.set(icon, promise);
    };

    let parsed = 0;

    const processAddedNode = async (node) => {
        if (!document.body || !document.body.contains(node)) {
            return;
        }

        const parent = node.nodeType === 1 ? node : node.parentNode;
        if (!parent) {
          console.error('No parent on node.');
          return;
        }

        twemoji.parse(node, {
            folder: 'svg',
            ext: '.svg',
            callback: flagsTwemojiCallback,
            className: UNIQUE_EMOJI_CLASS
        });

        parsed++;
        console.log('parsed: ' + parsed);

        // After twemoji.parse modifies the DOM, query for the newly added emoji images within the processed node.
        const emojiImages = parent.getElementsByClassName(UNIQUE_EMOJI_CLASS);
        for (const img of emojiImages) {

            console.log('Processing flag: ' + img.alt);

            const originalText = img.alt;
            const iconCode = originalText.codePointAt(0).toString(16) + '-' + originalText.codePointAt(2).toString(16);

            // If the flag is already in the in-memory cache, but we got it from the persistentCache in the callBack, we need to update it rather than fetch it.
            if (svgBlobUrlCache.has(iconCode)) {
                // The url should have already been updated in the Callback, but we'll set it just in case.
                img.src = svgBlobUrlCache.get(iconCode);
                img.className = 'P-' + UNIQUE_EMOJI_CLASS;
                continue;
            }

            // If a download for this icon is already pending, we don't need to re-initiate it
            if (pendingSvgRequests.has(iconCode)) {
                continue;
            }

            // We need to download the flag to our local cache
            loadAndCacheSvg(iconCode, originalText);
        }
    };

    let observerCount = 0;
    let debouncedNodes = new Set();
    let debouncedTimeout = null;

    const getNodesFromMutations = (mutationsList) => {
        const nodes = new Set();
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                nodes.add(mutation.target);
            } else if (mutation.type === 'characterData' || mutation.type === 'attributes') {
                nodes.add(mutation.target);
            }
        }
        return nodes;
    };

    const observer = new MutationObserver((mutationsList) => {
        observerCount++;

        // Process initial mutations immediately for responsiveness
        if (observerCount <= DEBOUNCE_THRESHOLD) {
            const nodesToProcess = getNodesFromMutations(mutationsList);
            nodesToProcess.forEach(node => processAddedNode(node));
            return;
        }

        if (debouncedTimeout) {
            clearTimeout(debouncedTimeout);
        }

        const newNodesFromMutations = getNodesFromMutations(mutationsList);
        newNodesFromMutations.forEach(newNode => {
            if (newNode.nodeType !== Node.ELEMENT_NODE) {
                debouncedNodes.add(newNode);
                return;
            }
            
            for (const existingNode of debouncedNodes) {
                if (existingNode.nodeType === Node.ELEMENT_NODE && existingNode.contains(newNode)) {
                    //console.log('Avoided redundant mutation.');
                    return; // If redundant, stop processing this newNode and move to the next
                }
            }

            const nodesToRemove = [];
            for (const existingNode of debouncedNodes) {
                if (existingNode.nodeType === Node.ELEMENT_NODE && newNode.contains(existingNode)) {
                    nodesToRemove.push(existingNode);
                }
            }
            nodesToRemove.forEach(node => debouncedNodes.delete(node));

            debouncedNodes.add(newNode);
        });

        // Schedule the processing of the entire batch
        debouncedTimeout = setTimeout(() => {
            //console.log(`Processing debounced batch of ${debouncedNodes.size} nodes.`);
            debouncedNodes.forEach(node => processAddedNode(node));
            debouncedNodes.clear();
            debouncedTimeout = null;
        }, DEBOUNCE_DELAY_MS);
    });

    const loadPersistentCache = async () => {
        const startTime = performance.now();
        persistentCache = await GM_getValue(CACHE_KEY, {});
        const expirationTime = Date.now() - CACHE_EXPIRATION_MS;
        let updated = false;
        for (const icon in persistentCache) {
            if (persistentCache[icon].timestamp < expirationTime) {
                delete persistentCache[icon];
                updated = true;
            }
        }

        if (updated) {
            GM_setValue(CACHE_KEY, persistentCache);
        }
        const endTime = performance.now();
        const timeTaken = endTime - startTime;

        console.log(`Persistent cache loaded in ${timeTaken.toFixed(2)} ms with ${Object.keys(persistentCache).length} flags.`);
    };

    const main = async () => {
        await loadPersistentCache();

        observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: false });

        if (document.body) {
            processAddedNode(document.body);
        }
    };

    main();

})();