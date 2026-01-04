// ==UserScript==
// @name         Reddit Multi Code Decoder for obfuscated content
// @namespace    freebee9@tuta.io
// @version      0.3.2
// @description  Detects obfuscated text in Reddit comments as: binary and NATO (usually in NSFW); convert it back to human readable string. Implement a text selection popup for Google search.
// @author       freebee9@tuta.io
// @license      MIT
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538805/Reddit%20Multi%20Code%20Decoder%20for%20obfuscated%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/538805/Reddit%20Multi%20Code%20Decoder%20for%20obfuscated%20content.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== COMMON =====
    // Centralized comment selectors for both selection popup and binary decoder
    const COMMENT_SELECTORS = [
        // New Reddit
        '[data-testid="comment"]',
        'shreddit-comment',
        '.Comment',
        '[data-click-id="text"]',

        // Old Reddit
        '.usertext-body',
        '.md',

        // Generic fallbacks
        '.comment',
        '[class*="comment"]'
    ];

    // Centralized search provider configuration
    const SEARCH_CONFIG = {
        // Default search provider templates
        providers: {
            google: {
                name: "Google",
                webSearch: "https://www.google.com/search?q={{QUERY}}",
                imageSearch: "https://www.google.com/search?q={{QUERY}}&tbm=isch",
                videoSearch: "https://www.google.com/search?q={{QUERY}}&tbm=vid"
            },
            bing: {
                name: "Bing",
                webSearch: "https://www.bing.com/search?q={{QUERY}}",
                imageSearch: "https://www.bing.com/images/search?q={{QUERY}}"
            },
            duckduckgo: {
                name: "DuckDuckGo",
                webSearch: "https://duckduckgo.com/?q={{QUERY}}",
                imageSearch: "https://duckduckgo.com/?q={{QUERY}}&iax=images&ia=images"
            }
        },

        // Active configuration
        active: {
            provider: "google",
            defaultSearchType: "imageSearch"  // Default to images as specified
        }
    };

    // Search utility functions
    function buildSearchURL(query, searchType = null) {
        try {
            const provider = SEARCH_CONFIG.providers[SEARCH_CONFIG.active.provider];
            if (!provider) {
                // Fallback to Google if current provider is invalid
                SEARCH_CONFIG.active.provider = "google";
                const fallbackProvider = SEARCH_CONFIG.providers.google;
                const type = searchType || SEARCH_CONFIG.active.defaultSearchType;
                const template = fallbackProvider[type] || fallbackProvider.webSearch;
                return template.replace('{{QUERY}}', encodeURIComponent(query));
            }

            const type = searchType || SEARCH_CONFIG.active.defaultSearchType;
            const template = provider[type] || provider.webSearch;

            return template.replace('{{QUERY}}', encodeURIComponent(query));
        } catch (error) {
            // Ultimate fallback to Google web search
            return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }

    function validateProvider(providerName) {
        return SEARCH_CONFIG.providers.hasOwnProperty(providerName);
    }

    function setSearchProvider(providerName) {
        if (validateProvider(providerName)) {
            SEARCH_CONFIG.active.provider = providerName;
            return true;
        }
        return false;
    }

    // NATO phonetic alphabet mapping
    const NATO_ALPHABET = {
        'apple': 'A', 'alpha': 'A', 'alfa': 'A', 'bravo': 'B', 'charlie': 'C', 'delta': 'D',
        'echo': 'E', 'foxtrot': 'F', 'golf': 'G', 'hotel': 'H', 'india': 'I',
        'juliet': 'J', 'kilo': 'K', 'lima': 'L', 'mike': 'M', 'mira': 'M', 'november': 'N',
        'oscar': 'O', 'papa': 'P', 'quebec': 'Q', 'romeo': 'R', 'sierra': 'S',
        'tango': 'T', 'uniform': 'U', 'victor': 'V', 'whiskey': 'W',
        'xray': 'X', 'x-ray': 'X', 'yankee': 'Y', 'zulu': 'Z', 'space': ' '
    };

    // NATO phonetic pattern: sequences of NATO words with optional separators
    const natoPattern = new RegExp(
        `\\b(?:${Object.keys(NATO_ALPHABET).join('|')})(?:[\\s,.-]+(?:${Object.keys(NATO_ALPHABET).join('|')}))*\\b`,
        'gi'
    );

    // Function to convert NATO phonetic string to text
    function natoToText(natoString) {
        try {
            // First, normalize the string to handle x-ray properly
            let normalizedString = natoString.toLowerCase();

            // Create a list of NATO words sorted by length (descending) to match longer words first
            const natoWords = Object.keys(NATO_ALPHABET).sort((a, b) => b.length - a.length);

            let result = '';
            let position = 0;
            let validWordsCount = 0;

            while (position < normalizedString.length) {
                // Skip whitespace and separators
                while (position < normalizedString.length && /[\s,.-]/.test(normalizedString[position])) {
                    position++;
                }

                if (position >= normalizedString.length) break;

                let matched = false;

                // Try to match each NATO word starting from current position
                for (const word of natoWords) {
                    if (normalizedString.substr(position, word.length) === word) {
                        // Check if this is a complete word (not part of a larger word)
                        const nextChar = normalizedString[position + word.length];
                        if (!nextChar || /[\s,.-]/.test(nextChar)) {
                            result += NATO_ALPHABET[word];
                            position += word.length;
                            validWordsCount++;
                            matched = true;
                            break;
                        }
                    }
                }

                if (!matched) {
                    // Skip the current character if no NATO word was found
                    position++;
                }
            }

            // Only return result if we have at least 2 valid NATO words
            if (validWordsCount >= 2) {
                return result;
            }

            return null;
        } catch (e) {
            return null;
        }
    }

    // ===== TEXT SELECTION POPUP FEATURE =====
    let selectionPopup = null;

    function createSelectionPopup() {
        const popup = document.createElement('div');
        popup.id = 'text-selection-popup';
        popup.style.cssText = `
            position: fixed;
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 8px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            display: none;
            max-width: 200px;
        `;

        const searchButton = document.createElement('button');
        searchButton.textContent = '🔍 Search on Google';
        searchButton.style.cssText = `
            background: #4285f4;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            width: 100%;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        `;

        searchButton.onmouseover = () => searchButton.style.backgroundColor = '#3367d6';
        searchButton.onmouseout = () => searchButton.style.backgroundColor = '#4285f4';

        popup.appendChild(searchButton);
        document.body.appendChild(popup);

        return { popup, searchButton };
    }

    function hideSelectionPopup() {
        if (selectionPopup && selectionPopup.popup) {
            selectionPopup.popup.style.display = 'none';
        }
    }

    function showSelectionPopup(x, y, selectedText) {
        if (!selectionPopup) {
            selectionPopup = createSelectionPopup();
        }

        const { popup, searchButton } = selectionPopup;

        // Update button click handler with current selected text
        searchButton.onclick = () => {
            const searchURL = buildSearchURL(selectedText.trim());
            window.open(searchURL, '_blank');
            hideSelectionPopup();
        };

        // Position popup near mouse cursor (using clientX/clientY with fixed positioning)
        popup.style.left = `${x + 10}px`;
        popup.style.top = `${y + 10}px`;
        popup.style.display = 'block';

        // Adjust position if popup goes off screen
        const rect = popup.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (rect.right > viewportWidth) {
            popup.style.left = `${x - rect.width - 10}px`;
        }
        if (rect.bottom > viewportHeight) {
            popup.style.top = `${y - rect.height - 10}px`;
        }
    }

    // Check if the target element is within a comment
    function isWithinComment(element) {
        return COMMENT_SELECTORS.some(selector => element.closest(selector));
    }

    // Handle text selection events
    document.addEventListener('mouseup', (e) => {
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();

            if (selectedText.length > 0 && isWithinComment(e.target)) {
                // Use clientX/clientY with fixed positioning for proper viewport positioning
                showSelectionPopup(e.clientX, e.clientY, selectedText);
            } else {
                hideSelectionPopup();
            }
        }, 10);
    });

    // Hide popup when clicking elsewhere or on escape
    document.addEventListener('mousedown', (e) => {
        if (selectionPopup && selectionPopup.popup && !selectionPopup.popup.contains(e.target)) {
            hideSelectionPopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideSelectionPopup();
        }
    });

    // ===== BINARY DECODER FUNCTIONALITY =====

    // Binary pattern: sequences of 0s and 1s, typically in groups of 8 (bytes)
    // Matches patterns like: 01001000 01100101 01101100 01101100 01101111
    const binaryPattern = /(?:\b[01]{8}\b[\s]*){2,}/g;

    // Function to convert binary string to text
    function binaryToText(binaryString) {
        try {
            // Remove all whitespace and split into 8-bit chunks
            const cleanBinary = binaryString.replace(/\s/g, '');
            if (cleanBinary.length % 8 !== 0) {
                return null; // Invalid binary string
            }

            let result = '';
            for (let i = 0; i < cleanBinary.length; i += 8) {
                const byte = cleanBinary.substr(i, 8);
                const charCode = parseInt(byte, 2);

                // Only convert printable ASCII characters (32-126) and common whitespace
                if ((charCode >= 32 && charCode <= 126) || charCode === 9 || charCode === 10 || charCode === 13) {
                    result += String.fromCharCode(charCode);
                } else {
                    return null; // Contains non-printable characters, probably not text
                }
            }
            return result;
        } catch (e) {
            return null;
        }
    }

    // Function to create translation component for multiple decoder types
    function createTranslationComponent(type, originalText, translatedText) {
        const container = document.createElement('div');
        container.style.cssText = `
            margin: 8px 0;
            padding: 12px;
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-family: monospace;
            font-size: 14px;
            position: relative;
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            font-weight: bold;
            color: #1a73e8;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            flex-shrink: 0;
        `;

        // Set header text based on decoder type
        if (type === 'nato') {
            header.textContent = '📻 NATO:';
        } else {
            header.textContent = '🔢 Binary:';
        }

        const translationDiv = document.createElement('div');
        translationDiv.style.cssText = `
            background: #e8f5e8;
            padding: 8px;
            border-radius: 4px;
            font-weight: bold;
            color: #2d5a2d;
            flex-grow: 1;
        `;
        translationDiv.textContent = `${translatedText}`;

        const searchLink = document.createElement('a');
        searchLink.href = buildSearchURL(translatedText);
        searchLink.target = '_blank';
        searchLink.rel = 'noopener noreferrer';
        searchLink.style.cssText = `
            background: #4285f4;
            color: white;
            padding: 6px 8px;
            border-radius: 4px;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            flex-shrink: 0;
            transition: background-color 0.2s;
        `;
        searchLink.onmouseover = () => searchLink.style.backgroundColor = '#3367d6';
        searchLink.onmouseout = () => searchLink.style.backgroundColor = '#4285f4';

        // Search icon (SVG)
        const searchIcon = document.createElement('span');
        searchIcon.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
        `;

        searchLink.appendChild(searchIcon);
        searchLink.appendChild(document.createTextNode('Search'));

        container.appendChild(header);
        container.appendChild(translationDiv);
        container.appendChild(searchLink);

        return container;
    }

    // Function to process text nodes and detect binary and NATO patterns
    function processTextNode(textNode) {
        const text = textNode.textContent;
        let hasTranslations = false;

        // Check for binary patterns
        const binaryMatches = text.match(binaryPattern);
        if (binaryMatches) {
            binaryMatches.forEach(match => {
                const translated = binaryToText(match);
                if (translated && translated.trim().length > 0) {
                    if (!hasTranslations) {
                        // Create a wrapper for the original text node
                        const wrapper = document.createElement('span');
                        textNode.parentNode.insertBefore(wrapper, textNode);
                        wrapper.appendChild(textNode);
                        hasTranslations = true;
                    }

                    // Add binary translation component after the text
                    const translationComponent = createTranslationComponent('binary', match, translated);
                    textNode.parentNode.insertBefore(translationComponent, textNode.nextSibling);
                }
            });
        }

        // Check for NATO phonetic patterns and combine consecutive sequences
        const natoMatches = text.match(natoPattern);
        if (natoMatches) {
            // Combine all NATO matches into a single sequence
            const allNatoWords = natoMatches.join(' ');
            const combinedTranslated = natoToText(allNatoWords);

            if (combinedTranslated && combinedTranslated.trim().length > 0) {
                if (!hasTranslations) {
                    // Create a wrapper for the original text node
                    const wrapper = document.createElement('span');
                    textNode.parentNode.insertBefore(wrapper, textNode);
                    wrapper.appendChild(textNode);
                    hasTranslations = true;
                }

                // Add single NATO translation component for all matches
                const translationComponent = createTranslationComponent('nato', allNatoWords, combinedTranslated);
                textNode.parentNode.insertBefore(translationComponent, textNode.nextSibling);
            }
        }
    }

    // Function to scan for decodable patterns in comments
    function scanForPatterns() {
        // Create selectors for paragraph elements within comments
        const commentParagraphSelectors = COMMENT_SELECTORS.map(selector => `${selector} p`);

        commentParagraphSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Skip if already processed
                if (element.hasAttribute('data-processed')) return;
                element.setAttribute('data-processed', 'true');

                // Process all text nodes in the element
                const walker = document.createTreeWalker(
                    element,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );

                const textNodes = [];
                let node;
                while (node = walker.nextNode()) {
                    textNodes.push(node);
                }

                textNodes.forEach(processTextNode);
            });
        });
    }

    // Initial scan
    setTimeout(scanForPatterns, 1000);

    // Watch for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the added node contains comments using centralized selectors
                    if (node.querySelector && COMMENT_SELECTORS.some(selector =>
                        node.querySelector(selector) || node.matches(selector)
                    )) {
                        shouldScan = true;
                    }
                }
            });
        });

        if (shouldScan) {
            setTimeout(scanForPatterns, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Scan when comments are expanded or loaded
    document.addEventListener('click', (e) => {
        // Check for comment expansion buttons
        if (e.target.matches('[aria-expanded]') ||
            e.target.closest('[aria-expanded]') ||
            e.target.textContent.includes('more replies') ||
            e.target.textContent.includes('comments')) {
            setTimeout(scanForPatterns, 1000);
        }
    });

    console.log('Reddit Binary Decoder v0.3.1 loaded');
})();
