// ==UserScript==
// @name         JanitorAI FMG
// @namespace    FauxFire.FMG.Userscripts
// @version      1.2.4
// @description  Fixes my gripes
// @author       FauxFire
// @match        https://janitorai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=janitorai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544346/JanitorAI%20FMG.user.js
// @updateURL https://update.greasyfork.org/scripts/544346/JanitorAI%20FMG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================
    // UNICODE CHARACTER RANGES
    // =================================

    // Defines Unicode ranges as [start, end] of box-drawing, block, geometric, dingbats, and emoji-like Unicode symbols
    const nonsenseRanges = [
        [0x2030, 0x205E], // General punctuation, including per mille, per ten thousand, etc.
        [0x2070, 0x209F], // Superscripts, subscripts, and modifiers
        [0x20A0, 0x20CF], // Currency symbols
        [0x2100, 0x214F], // Letterlike symbols, including script letters and numbers
        // [0x2150, 0x218F], // Number forms, including fractions and Roman numerals
        [0x2190, 0x21FF], // Arrows
        // [0x2200, 0x22FF], // Mathematical operators and symbols
        // [0x2300, 0x23FF], // Miscellaneous technical symbols
        // [0x2400, 0x243F], // Control pictures
        // [0x2440, 0x245F], // Optical character recognition symbols
        [0x2460, 0x24FF], // Enclosed alphanumerics (including circled letters and numbers)
        [0x2500, 0x257F], // Box drawing characters
        [0x2580, 0x259F], // Block elements
        [0x25A0, 0x25FF], // Geometric shapes
        // [0x2600, 0x26FF], // Miscellaneous symbols (but not emoji)
        [0x2700, 0x27BF], // Dingbats (but not emoji)
        [0x2B50, 0x2B54], // Star symbols (not emoji)
        // [0x00A1, 0x00A7], // Inverted punctuation and section sign
        [0x00A8, 0x00AF], // Spacing modifier letters
        [0x00B0, 0x00B1], // Degree and plus-minus signs
        [0x00B4, 0x00B6], // Acute accent and micro sign
        // [0x00B7, 0x00BF], // Middle dot and inverted question mark
        [0x2020, 0x2021], // Dagger and double dagger
    ];

    // Fancy character ranges for mathematical formatting that should be normalized to regular ASCII
    const fancyRanges = [
        // Mathematical Bold, Italic, Script, Fraktur, Double-struck, Sans-serif, Monospace
        [0x1D400, 0x1D419, 0x41], // 𝐀-𝐙 => A-Z
        [0x1D41A, 0x1D433, 0x61], // 𝐚-𝐳 => a-z
        [0x1D434, 0x1D44D, 0x41], // 𝑨-𝑿 => A-Z
        [0x1D44E, 0x1D467, 0x61], // 𝒂-𝒛 => a-z
        [0x1D468, 0x1D481, 0x41], // 𝑨-𝑿 => A-Z (bold italic)
        [0x1D482, 0x1D49B, 0x61], // 𝒂-𝒛 => a-z (bold italic)
        [0x1D49C, 0x1D4B5, 0x41], // 𝓐-𝓩 => A-Z (script)
        [0x1D4B6, 0x1D4CF, 0x61], // 𝓪-𝔃 => a-z (script)
        [0x1D504, 0x1D51C, 0x41], // 𝔄-𝔜 => A-Z (fraktur)
        [0x1D51E, 0x1D537, 0x61], // 𝔞-𝔷 => a-z (fraktur)
        [0x1D5A0, 0x1D5B9, 0x41], // 𝗔-𝗭 => A-Z (sans-serif)
        [0x1D5BA, 0x1D5D3, 0x61], // 𝗮-𝗭 => a-z (sans-serif)
        [0x1D5D4, 0x1D5ED, 0x41], // 𝘈-𝘡 => A-Z (sans-serif bold)
        [0x1D5EE, 0x1D607, 0x61], // 𝘢-𝘻 => a-z (sans-serif bold)
        [0x1D608, 0x1D621, 0x41], // 𝘈-𝘡 => A-Z (sans-serif italic)
        [0x1D622, 0x1D63B, 0x61], // 𝘢-𝘻 => a-z (sans-serif italic)
        [0x1D63C, 0x1D655, 0x41], // 𝘈-𝘡 => A-Z (sans-serif bold italic)
        [0x1D656, 0x1D66F, 0x61], // 𝘢-𝘻 => a-z (sans-serif bold italic)
        [0x1D670, 0x1D689, 0x41], // 𝘈-𝘡 => A-Z (monospace)
        [0x1D68A, 0x1D6A3, 0x61], // 𝘢-𝘻 => a-z (monospace)
        [0x1D552, 0x1D56B, 0x30], // 𝕒-𝕫 => 0-9 (double-struck digits)
        [0x1D7CE, 0x1D7D7, 0x30], // 𝟎-𝟗 => 0-9 (math bold digits)
        [0x1D7D8, 0x1D7E1, 0x30], // 𝟘-𝟡 => 0-9 (math double-struck digits)
    ];

    // =================================
    // UTILITY FUNCTIONS
    // =================================

    // Pre-compile ranges into lookup tables for O(1) access
    const nonsenseCharMap = new Set();
    const fancyCharMap = new Map();

    (function buildLookupTables() {
        for (const [start, end] of nonsenseRanges) {
            for (let code = start; code <= end; code++) {
                nonsenseCharMap.add(code);
            }
        }

        for (const [start, end, base] of fancyRanges) {
            for (let code = start; code <= end; code++) {
                fancyCharMap.set(code, String.fromCharCode(base + (code - start)));
            }
        }
    })();

    // =================================
    // TEXT CLEANUP FUNCTIONS
    // =================================

    function removeNonsenseFromString(str) {
        if (!str || typeof str !== 'string') return str;

        const lines = str.split('\n');
        const processedLines = [];
        let hasChanges = false;

        for (const line of lines) {
            if (!line.trim()) continue;

            let result = '';
            let lineChanged = false;

            for (let i = 0; i < line.length;) {
                const code = line.codePointAt(i);
                const char = String.fromCodePoint(code);

                if (nonsenseCharMap.has(code)) {
                    lineChanged = hasChanges = true;
                } else if (fancyCharMap.has(code)) {
                    result += fancyCharMap.get(code);
                    lineChanged = hasChanges = true;
                } else {
                    result += char;
                }

                i += (code > 0xFFFF) ? 2 : 1;
            }

            if (result.trim()) {
                processedLines.push(result);
            }
        }

        return hasChanges ? processedLines.join('\n') : str;
    }

    function removeNonsense() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    const text = node.nodeValue;
                    return text?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const textNodes = [];
        let node;
        while ((node = walker.nextNode())) {
            textNodes.push(node);
        }

        // Process in batches to avoid blocking
        let processed = 0;
        const batchSize = 50;

        function processBatch() {
            const end = Math.min(processed + batchSize, textNodes.length);

            for (let i = processed; i < end; i++) {
                const textNode = textNodes[i];
                const cleaned = removeNonsenseFromString(textNode.nodeValue);
                if (cleaned !== textNode.nodeValue) {
                    textNode.nodeValue = cleaned;
                }
            }

            processed = end;

            if (processed < textNodes.length) {
                requestAnimationFrame(processBatch);
            }
        }

        if (textNodes.length > 0) {
            processBatch();
        }
    }

    function removeColorFromSpans() {
        const spans = document.querySelectorAll('span[style*="color:"]');

        for (const span of spans) {
            const style = span.getAttribute('style');
            if (!style) continue;

            // Remove color properties from the style attribute
            const cleanedStyle = style
                .split(';')
                .filter(rule => {
                    const trimmedRule = rule.trim();
                    return trimmedRule && !trimmedRule.toLowerCase().startsWith('color:');
                })
                .join(';');

            // If no styles remain, remove the style attribute entirely
            if (!cleanedStyle.trim() || cleanedStyle.trim() === '') {
                span.removeAttribute('style');
            } else {
                span.setAttribute('style', cleanedStyle);
            }
        }
    }

    function cleanupAboutMe() {
        const aboutMeDiv = document.querySelector('div[class^="pp-uc-about-me"]');
        if (!aboutMeDiv) return;

        // Remove text decoration and alteration styles from all elements within
        const elementsWithStyle = aboutMeDiv.querySelectorAll('*[style]');

        for (const element of elementsWithStyle) {
            const style = element.getAttribute('style');
            if (!style) continue;

            // Remove text decoration, transformation, and styling properties
            const cleanedStyle = style
                .split(';')
                .filter(rule => {
                    const trimmedRule = rule.trim().toLowerCase();
                    if (!trimmedRule) return false;

                    // Remove color
                    return !trimmedRule.startsWith('color');
                })
                .join(';');

            // If no styles remain, remove the style attribute entirely
            if (!cleanedStyle.trim()) {
                element.removeAttribute('style');
            } else {
                element.setAttribute('style', cleanedStyle);
            }
        }

        // Convert images to small thumbnails
        const images = aboutMeDiv.querySelectorAll('img');
        images.forEach(img => {
            // Set thumbnail styles
            Object.assign(img.style, {
                maxWidth: '60px',
                maxHeight: '60px',
                width: 'auto',
                height: 'auto',
                objectFit: 'cover',
                border: '1px solid #ccc',
                borderRadius: '4px',
                margin: '2px',
                display: 'inline-block',
                verticalAlign: 'middle'
            });

            // Remove any existing size attributes
            img.removeAttribute('width');
            img.removeAttribute('height');

            // Add a click handler to show full-size image if needed
            if (!img.hasAttribute('data-fmp-thumbnail-processed')) {
                img.setAttribute('data-fmp-thumbnail-processed', 'true');
                img.style.cursor = 'pointer';
                img.title = 'Click to view full size';

                img.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    // Create a modal-like overlay to show full image
                    const overlay = document.createElement('div');
                    Object.assign(overlay.style, {
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: '10000',
                        cursor: 'pointer'
                    });

                    const fullImg = document.createElement('img');
                    fullImg.src = img.src;
                    fullImg.alt = img.alt;
                    Object.assign(fullImg.style, {
                        maxWidth: '90%',
                        maxHeight: '90%',
                        objectFit: 'contain',
                        border: '2px solid white',
                        borderRadius: '8px'
                    });

                    overlay.appendChild(fullImg);
                    document.body.appendChild(overlay);

                    // Close on click
                    overlay.addEventListener('click', () => {
                        document.body.removeChild(overlay);
                    });

                    // Close on escape key
                    const escHandler = (e) => {
                        if (e.key === 'Escape') {
                            document.body.removeChild(overlay);
                            document.removeEventListener('keydown', escHandler);
                        }
                    };
                    document.addEventListener('keydown', escHandler);
                });
            }
        });
    }

    // Debounced cleanup
    let debounceTimeout;
    const debouncedRemoveNonsense = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            removeNonsense();
            removeColorFromSpans();
        }, 100);
    };

    // =================================
    // ELEMENT CLONING FUNCTIONS
    // =================================

    function cloneElementWithFunctionality(originalElement) {
        const clone = originalElement.cloneNode(true);

        // Make IDs unique
        function makeIdsUnique(element, suffix = '-clone') {
            if (element.id) element.id += suffix;
            if (element.getAttribute?.('for')) {
                element.setAttribute('for', element.getAttribute('for') + suffix);
            }
            Array.from(element.children).forEach(child => makeIdsUnique(child, suffix));
        }
        makeIdsUnique(clone);

        // Forward clicks to original element
        clone.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            const clickedElement = event.target;
            const cloneElements = Array.from(clone.querySelectorAll('*'));
            const originalElements = Array.from(originalElement.querySelectorAll('*'));
            const cloneIndex = cloneElements.indexOf(clickedElement);

            if (cloneIndex >= 0 && originalElements[cloneIndex]) {
                originalElements[cloneIndex].click();
            } else if (clickedElement === clone) {
                originalElement.click();
            }
        });

        return clone;
    }

    function synchronizePaginationElements(element1, element2) {
        const observer = new MutationObserver(() => {
            if (element2.innerHTML !== element1.innerHTML) {
                element2.innerHTML = element1.innerHTML;
            }
        });

        observer.observe(element1, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true
        });

        return { disconnect: () => observer.disconnect() };
    }

    // =================================
    // CHARACTERS PAGE FUNCTIONALITY
    // =================================

    const CHARACTERS_SELECTOR = 'div#root > div > main > div.chakra-stack > div > div > div > div.chakra-stack > div.chakra-stack';

    function handleCharactersPage(retryCount = 0) {
        const targetElement = document.querySelector(CHARACTERS_SELECTOR);

        if (!targetElement) {
            if (retryCount < 2) {
                // Retry with observer
                new Promise((resolve) => {
                    const timeoutId = setTimeout(resolve, 2000);
                    const observer = new MutationObserver((mutations) => {
                        for (const mutation of mutations) {
                            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                const element = document.querySelector(CHARACTERS_SELECTOR);
                                if (element) {
                                    clearTimeout(timeoutId);
                                    observer.disconnect();
                                    resolve();
                                    return;
                                }
                            }
                        }
                    });

                    const mainElement = document.querySelector('main');
                    if (mainElement) {
                        observer.observe(mainElement, { childList: true, subtree: true });
                    }

                    setTimeout(() => observer.disconnect(), 2000);
                }).then(() => handleCharactersPage(retryCount + 1));

                return;
            }
            return; // Give up after 3 attempts
        }

        // Check if already processed
        if (targetElement.getAttribute('data-fmp-proxy-processed') === 'true') return;
        targetElement.setAttribute('data-fmp-proxy-processed', 'true');

        // Search for proxy text
        const walker = document.createTreeWalker(
            targetElement,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    return node.nodeValue?.toUpperCase().includes('PROXY ALLOWED')
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const proxyTextNode = walker.nextNode();
        const proxyAllowedElement = proxyTextNode?.parentElement;

        if (proxyAllowedElement) {
            // Style existing "proxy allowed" element
            Object.assign(proxyAllowedElement.style, {
                fontSize: '3rem',
                color: '#22c55e',
                fontWeight: 'bold',
                marginTop: '1rem',
                padding: '0.5rem',
                textAlign: 'center',
                textTransform: 'uppercase',
                cssText: proxyAllowedElement.style.cssText + ' !important'
            });
        } else {
            // Create "NO PROXY" element
            const noProxyDiv = document.createElement('div');
            noProxyDiv.textContent = 'NO PROXY';
            Object.assign(noProxyDiv.style, {
                fontSize: '3rem',
                color: '#ef4444',
                fontWeight: 'bold',
                marginTop: '1rem',
                marginBottom: '1rem',
                padding: '0.5rem',
                textAlign: 'center'
            });
            noProxyDiv.setAttribute('data-fmp-no-proxy', 'true');
            targetElement.insertBefore(noProxyDiv, targetElement.firstChild);
        }
    }

    function setupCharactersPageObserver() {
        let observerTimeout;
        const charactersObserver = new MutationObserver(mutations => {
            clearTimeout(observerTimeout);
            observerTimeout = setTimeout(() => {
                const hasRelevantMutation = mutations.some(mutation =>
                    mutation.type === 'childList' &&
                    (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
                );

                if (hasRelevantMutation) {
                    const targetElement = document.querySelector(CHARACTERS_SELECTOR);
                    if (targetElement && !targetElement.getAttribute('data-fmp-proxy-processed')) {
                        handleCharactersPage();
                    }
                }
            }, 100);
        });

        const observeTarget = document.querySelector('main') || document.body;
        if (observeTarget) {
            charactersObserver.observe(observeTarget, {
                childList: true,
                subtree: true
            });
        }

        return charactersObserver;
    }

    // =================================
    // PROFILES PAGE FUNCTIONALITY
    // =================================

    function handleProfilesPage() {
        // Always clean up about-me text decoration first
        cleanupAboutMe();

        const targetContainer = document.querySelector('div#tabs-profile-tabs--tabpanel-0 > div > div');
        if (!targetContainer) return;

        const childCount = targetContainer.children.length;

        // Check if clone already exists
        if (childCount === 4) {
            const secondChild = targetContainer.children[1];
            if (secondChild?.getAttribute('data-fmp-clone') === 'true') return;
        }

        // Verify exactly 3 children before proceeding
        if (childCount !== 3) return;

        const paginationControl = targetContainer.lastElementChild;
        if (!paginationControl) return;

        // Create and insert clone
        const paginationClone = cloneElementWithFunctionality(paginationControl);
        paginationClone.setAttribute('data-fmp-clone', 'true');

        const secondChild = targetContainer.children[1];
        targetContainer.insertBefore(paginationClone, secondChild);

        // Set up synchronization
        const syncController = synchronizePaginationElements(paginationControl, paginationClone);

        if (!window.profileSyncObservers) window.profileSyncObservers = [];
        window.profileSyncObservers.push(syncController);
    }

    function setupProfilesPageObserver() {
        const profilesObserver = new MutationObserver(mutations => {
            // Check for clone removal
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    for (const node of mutation.removedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE &&
                            node.getAttribute?.('data-fmp-clone') === 'true') {
                            waitForDOMStability().then(() => handleProfilesPage());
                            return;
                        }
                    }
                }
            }
        });

        const observeTarget = document.querySelector('main') || document.body;
        if (observeTarget) {
            profilesObserver.observe(observeTarget, {
                childList: true,
                subtree: true
            });
        }

        return profilesObserver;
    }

    // =================================
    // UTILITY FUNCTIONS
    // =================================

    function waitForDOMStability() {
        return new Promise((resolve) => {
            let stabilityTimer;
            const startTime = Date.now();
            const STABILITY_THRESHOLD = 1000;
            const MAX_WAIT = 10000;

            const stabilityObserver = new MutationObserver(() => {
                clearTimeout(stabilityTimer);

                if (Date.now() - startTime > MAX_WAIT) {
                    stabilityObserver.disconnect();
                    resolve();
                    return;
                }

                stabilityTimer = setTimeout(() => {
                    stabilityObserver.disconnect();
                    resolve();
                }, STABILITY_THRESHOLD);
            });

            const observeTarget = document.querySelector('main') || document.body;

            if (observeTarget) {
                stabilityObserver.observe(observeTarget, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });

                stabilityTimer = setTimeout(() => {
                    stabilityObserver.disconnect();
                    resolve();
                }, STABILITY_THRESHOLD);
            } else {
                resolve();
            }
        });
    }

    // =================================
    // INITIALIZATION
    // =================================

    // Track current page and observers
    let currentPage = window.location.href;
    let activeObservers = {
        characters: null,
        profiles: null,
        textCleanup: null
    };

    function cleanupPreviousPageElements() {
        // Remove character page elements
        const noProxyElements = document.querySelectorAll('[data-fmp-no-proxy="true"]');
        noProxyElements.forEach(el => el.remove());

        // Remove processed attributes from character elements
        const processedCharacterElements = document.querySelectorAll('[data-fmp-proxy-processed="true"]');
        processedCharacterElements.forEach(el => el.removeAttribute('data-fmp-proxy-processed'));

        // Remove profile page clones
        const profileClones = document.querySelectorAll('[data-fmp-clone="true"]');
        profileClones.forEach(el => el.remove());

        // Clean up profile sync observers
        if (window.profileSyncObservers) {
            window.profileSyncObservers.forEach(observer => {
                if (observer.disconnect) observer.disconnect();
            });
            window.profileSyncObservers = [];
        }
    }

    function initializePageFeatures() {
        const url = window.location.href;

        // Clean up existing observers
        if (activeObservers.characters?.disconnect) {
            activeObservers.characters.disconnect();
            activeObservers.characters = null;
        }
        if (activeObservers.profiles?.disconnect) {
            activeObservers.profiles.disconnect();
            activeObservers.profiles = null;
        }

        // Clean up elements from previous pages
        cleanupPreviousPageElements();

        // Initialize page-specific features
        if (url.includes('/characters')) {
            waitForDOMStability().then(() => {
                handleCharactersPage();
                activeObservers.characters = setupCharactersPageObserver();
            });
        }

        if (url.includes('/profiles')) {
            waitForDOMStability().then(() => {
                handleProfilesPage();
                activeObservers.profiles = setupProfilesPageObserver();
            });
        }

        // Re-run text cleanup
        setTimeout(debouncedRemoveNonsense, 100);
    }

    function setupNavigationObserver() {
        // Monitor URL changes
        setInterval(() => {
            if (window.location.href !== currentPage) {
                currentPage = window.location.href;
                setTimeout(initializePageFeatures, 500);
            }
        }, 100);

        // Listen for browser navigation
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                if (window.location.href !== currentPage) {
                    currentPage = window.location.href;
                    initializePageFeatures();
                }
            }, 100);
        });

        // Listen for SPA navigation clicks
        document.addEventListener('click', (event) => {
            const target = event.target.closest('a');
            if (target?.href && target.href !== window.location.href) {
                setTimeout(() => {
                    if (window.location.href !== currentPage) {
                        currentPage = window.location.href;
                        initializePageFeatures();
                    }
                }, 100);
            }
        });
    }

    function setupMainTextCleanupObserver() {
        if (activeObservers.textCleanup) {
            activeObservers.textCleanup.disconnect();
        }

        const textCleanupObserver = new MutationObserver(mutations => {
            const needsCleanup = mutations.some(mutation =>
                mutation.type === 'characterData' || mutation.type === 'childList'
            );
            if (needsCleanup) debouncedRemoveNonsense();
        });

        const observeTarget = document.querySelector('main') || document.body;
        if (observeTarget) {
            textCleanupObserver.observe(observeTarget, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }

        activeObservers.textCleanup = textCleanupObserver;

        // Performance optimization: stop observing on user interaction
        function disconnectTextObserver() {
            if (activeObservers.textCleanup) {
                activeObservers.textCleanup.disconnect();
                activeObservers.textCleanup = null;
            }
            window.removeEventListener('mousedown', disconnectTextObserver, true);
            window.removeEventListener('keydown', disconnectTextObserver, true);
        }

        window.addEventListener('mousedown', disconnectTextObserver, true);
        window.addEventListener('keydown', disconnectTextObserver, true);

        return textCleanupObserver;
    }

    window.addEventListener('load', function() {
        // Initialize text cleanup functionality
        debouncedRemoveNonsense();

        // Set up main text cleanup observer
        setupMainTextCleanupObserver();

        // Initialize features for current page
        initializePageFeatures();

        // Set up navigation monitoring for SPA routing
        setupNavigationObserver();
    });
})();