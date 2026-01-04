// ==UserScript==
// @name         Nitan Airport Flair
// @namespace    http://tampermonkey.net/
// @version      0.5.7
// @description  Enhances webpages by identifying airport and multi-airport codes, styling them, and adding interactive tooltips/hyperlinks. Dismiss reverts instances.
// @author       s5kf
// @license      CC BY-NC-ND 4.0; https://creativecommons.org/licenses/by-nc-nd/4.0/
// @match        *://www.uscardforum.com/*
// @resource     airportJsonData https://raw.githubusercontent.com/s5kf/airport_flair/main/airports_filtered.json
// @resource     multiAirportJsonData https://raw.githubusercontent.com/s5kf/airport_flair/main/multi_airport_data.json
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-idle
// @supportURL   https://github.com/s5kf/airport_flair/issues
// @downloadURL https://update.greasyfork.org/scripts/536026/Nitan%20Airport%20Flair.user.js
// @updateURL https://update.greasyfork.org/scripts/536026/Nitan%20Airport%20Flair.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let airportData = {}; // To store single airport data keyed by IATA code
    let multiAirportData = {}; // To store multi-airport area data
    let observer = null; // To store the MutationObserver instance

    // --- Constants (moved up for early initialization) ---
    const iataRegex = /\b([A-Za-z]{3})\b/g;
    const processedMark = 'airport-flair-processed';
    const flairTag = 'airport-flair-tag'; // Class for the flair span itself
    const potentialFlairClass = 'potential-airport-code'; // New class for potential flairs
    const multiAirportFlairClass = 'multi-airport-flair'; // New class for multi-airport flairs
    const COMMON_TLA_BLOCKLIST = new Set([
        "CEO", "CFO", "COO", "CTO", "CIO", // Common C-suite and department heads
        "USD", "EUR", "GBP", "JPY", "CNY", "INR", "BRL", "ARS", "MXN", "COP", "CLP", "PEN", "UYU", "PYG",// Currencies
        "BTC", "ETH", "XRP", "BCH", "LTC", "XMR", "XLM", "XEM", "XRP", "BCH", "LTC", "XMR", "XLM", "XEM", "XRP", "BCH", "LTC", "XMR", "XLM", "XEM", // Crypto
        "GDP", "GNP", "GPT", "ROI", "KPI", "ETA", "FAQ", "DIY", "AKA", // Common business & general acronyms
        "USB", "CPU", "GPU", "RAM", "SSD", "HDD", "OSX", "IOS", // Tech acronyms
        "LOL", "OMG", "BTW", "FYI", "IMO", "BRB", "BSO",// Internet slang
        "USA", "DOT", "DOJ", "DOL", "HHS", "FAA", "CAA", "FBI", "CIA", "CBP", "TSA","ICE", // Government and regulatory acronyms
        "ETA", "ETC", "INC", "LTD", "LLC", "DIY", "FAQ", "PDF", "XML", "DOC","CSV","TXT","ZIP","RAR","ISO","PPT",
        "API", "URL", "WWW", "CSS", "PHP", "SQL", "FTP","DNS", "VPN", "VPS", "TLS", "TTL",
        "ESG", "VIX", "AOC", "AND", "MVP", "OTA", "ITA", "AIR", "ADT", "JAL", "DSW",
        "CSP", "CSR", "CFU" ,"CIP", "CIU", "UAR", // User reported issues
        "ATM", "MCC", "SCO", "THE", "NOT", "GOT", "GOD", "BIZ","ECO","EQE","EQS","EQB",
        "OPT", "CPT", "PTO","SLH", "GAI", "SPG" // User reported issues
        // Add more as needed, ensure they are uppercase
    ]);

    // --- Load Data from @resource ---
    function initializeData() {
        let mainDataLoaded = false;
        let multiDataLoaded = false;

        // Load Main Airport Data
        try {
            console.log("[Airport Flair] Attempting to load main airport data from @resource...");
            const airportJsonDataString = GM_getResourceText("airportJsonData");
            if (!airportJsonDataString) {
                console.error("[Airport Flair] Failed to get main airport data. GM_getResourceText returned empty.");
            } else {
                const sanitizedJsonDataString = airportJsonDataString
                    .replace(/: Infinity,/g, ": null,")
                    .replace(/: Infinity}/g, ": null}")
                    .replace(/: NaN,/g, ": null,")
                    .replace(/: NaN}/g, ": null}");
                const data = JSON.parse(sanitizedJsonDataString);
                data.forEach(airport => {
                    if (airport.iata_code) {
                        airportData[airport.iata_code.toUpperCase()] = airport;
                    }
                });
                console.log("[Airport Flair] Main airport data loaded and processed:", Object.keys(airportData).length, "entries");
                mainDataLoaded = true;
            }
        } catch (e) {
            console.error("[Airport Flair] Error loading or parsing main airport data:", e);
            // Optional: log airportJsonDataString snippet if needed
        }

        // Load Multi-Airport Data
        try {
            console.log("[Airport Flair] Attempting to load multi-airport data from @resource...");
            const multiAirportJsonDataString = GM_getResourceText("multiAirportJsonData");
            if (!multiAirportJsonDataString) {
                console.error("[Airport Flair] Failed to get multi-airport data. GM_getResourceText returned empty.");
            } else {
                multiAirportData = JSON.parse(multiAirportJsonDataString); // Assuming this JSON is clean
                console.log("[Airport Flair] Multi-airport data loaded and processed:", Object.keys(multiAirportData).length, "entries");
                multiDataLoaded = true;
            }
        } catch (e) {
            console.error("[Airport Flair] Error loading or parsing multi-airport data:", e);
            // Optional: log multiAirportJsonDataString snippet if needed
        }

        return mainDataLoaded; // Script functionality primarily depends on main airport data for flags etc.
                               // Multi-airport data is supplementary.
    }

    // Initialize data and then process the page
    if (initializeData()) {
        processPage();
    } else {
        console.error("[Airport Flair] Script will not run effectively due to critical data loading issues (main airport data).");
    }

    // --- CSS Styles ---
    function getDynamicStyles() {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        let isLikelyDarkMode; // Undetermined initially
        let detectionMethod = "initial"; // For debugging

        // --- Helper functions for color analysis (assuming they are defined correctly elsewhere or here) ---
        function isColorActuallyDark(colorString) {
            if (!colorString || colorString === 'transparent' || colorString === 'rgba(0, 0, 0, 0)') return false;
            if (colorString === 'rgb(0, 0, 0)' || colorString === '#000000') return true;
            try {
                const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (rgbMatch) {
                    const r = parseInt(rgbMatch[1], 10);
                    const g = parseInt(rgbMatch[2], 10);
                    const b = parseInt(rgbMatch[3], 10);
                    if ((r + g + b) / 3 < 85 || (r < 110 && g < 110 && b < 110)) { // Adjusted threshold slightly
                        return true;
                    }
                }
            } catch (e) { /* ignore */ }
            return false;
        }

        function isVeryLightNonWhiteGrey(colorString) {
            if (!colorString || colorString === 'transparent' || colorString === 'rgba(0, 0, 0, 0)') return false;
            try {
                const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (rgbMatch) {
                    const r = parseInt(rgbMatch[1], 10);
                    const g = parseInt(rgbMatch[2], 10);
                    const b = parseInt(rgbMatch[3], 10);
                    if (r > 225 && g > 225 && b > 225 && !(r === 255 && g === 255 && b === 255)) { // Adjusted threshold
                        if (Math.abs(r - g) < 25 && Math.abs(g - b) < 25 && Math.abs(r - b) < 25) {
                            return true;
                        }
                    }
                }
            } catch (e) { /* ignore */ }
            return false;
        }
        // --- End Helper Functions ---

        // 1. Check for specific Discourse theme classes on <html> (Highest Priority)
        const htmlClasses = htmlElement.classList;
        if (htmlClasses.contains('theme-dark') || htmlClasses.contains('discourse-dark-theme') || htmlClasses.contains('dark-scheme')) {
            isLikelyDarkMode = true;
            detectionMethod = "html_specific_class_dark";
        } else if (htmlClasses.contains('theme-light') || htmlClasses.contains('discourse-light-theme') || htmlClasses.contains('light-scheme')) {
            isLikelyDarkMode = false;
            detectionMethod = "html_specific_class_light";
        }

        // 2. If no specific HTML classes, try computed background colors (Body highest, then HTML)
        if (typeof isLikelyDarkMode === 'undefined') {
            const bodyBgColor = getComputedStyle(bodyElement).backgroundColor;
            const htmlBgColor = getComputedStyle(htmlElement).backgroundColor;
            const bodyIsTransparent = (!bodyBgColor || bodyBgColor === 'transparent' || bodyBgColor === 'rgba(0, 0, 0, 0)');
            const htmlIsTransparent = (!htmlBgColor || htmlBgColor === 'transparent' || htmlBgColor === 'rgba(0, 0, 0, 0)');

            if (!bodyIsTransparent) {
                isLikelyDarkMode = isColorActuallyDark(bodyBgColor);
                detectionMethod = "body_bg_color_check";
            } else if (!htmlIsTransparent) {
                isLikelyDarkMode = isColorActuallyDark(htmlBgColor);
                detectionMethod = "html_bg_color_check";
            }
        }

        // 3. If still undetermined, check generic classes on <html> or <body>
        if (typeof isLikelyDarkMode === 'undefined') {
            if (htmlElement.classList.contains('dark') || bodyElement.classList.contains('dark') ||
                htmlElement.classList.contains('dark-mode') || bodyElement.classList.contains('dark-mode')) {
                isLikelyDarkMode = true;
                detectionMethod = "generic_class_dark";
            }
            // If generic dark classes are not found, we assume light by omission at this stage if still undefined.
        }

        // 4. As a final fallback, use prefers-color-scheme if still undetermined.
        if (typeof isLikelyDarkMode === 'undefined') {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            isLikelyDarkMode = prefersDark;
            detectionMethod = "prefers_color_scheme";
        }

        // Ensure isLikelyDarkMode has a boolean value. If somehow it's still undefined, default to light.
        if (typeof isLikelyDarkMode === 'undefined') {
             console.warn("[Airport Flair] Dark mode detection inconclusive, defaulting to light mode. Final detection stage:", detectionMethod);
             isLikelyDarkMode = false; // Default to light
             detectionMethod += "_defaulted_light";
        }
        // console.log(`[Airport Flair] Theme detection: ${isLikelyDarkMode ? 'Dark' : 'Light'}. Method: ${detectionMethod}`);


        // --- Determine flair background color based on isLikelyDarkMode ---
        let flairBgColor;
        let flairTextColor; // New variable for text color

        // Re-get body/html background colors here for the specific "lights out" or "very light grey" checks
        const bodyBgColorFinal = getComputedStyle(bodyElement).backgroundColor;
        const htmlBgColorFinal = getComputedStyle(htmlElement).backgroundColor;

        if (isLikelyDarkMode) {
            // Check for "lights out" (pure black bg)
            if ((bodyBgColorFinal === 'rgb(0, 0, 0)' || bodyBgColorFinal === '#000000') ||
                (htmlBgColorFinal === 'rgb(0, 0, 0)' || htmlBgColorFinal === '#000000')) {
                flairBgColor = '#202327'; // Lights out
            } else {
                flairBgColor = '#273440'; // Dim mode (default dark)
            }
            flairTextColor = '#e6c07b'; // Standard dark mode text color
        } else { // Light mode
            // Default light mode flair background
            flairBgColor = '#eff3f4';
            flairTextColor = '#c18401'; // User requested light mode text color
            // Check if the background is a very light non-white grey.
            if (isVeryLightNonWhiteGrey(bodyBgColorFinal) || isVeryLightNonWhiteGrey(htmlBgColorFinal)) {
                flairBgColor = '#e0e0e0'; // Use a slightly more distinct grey for very light grey BGs
            }
        }

        return `
            .${flairTag} {
                display: inline-flex;
                align-items: center;
                vertical-align: baseline;
                font-family: 'Fira Code', 'Roboto Mono', Arial, sans-serif; /* UPDATED FONT */
                padding: 1px 4px; /* Reduced padding */
                color: ${flairTextColor}; /* DYNAMIC TEXT COLOR */
                background-color: ${flairBgColor};
                border-radius: 3px;
                text-decoration: none; /* For the anchor tag */
                margin: 0 1px; /* Small margin to prevent touching adjacent text */
                position: relative; /* For absolute positioning of the dismiss button */
            }
            .${flairTag} img.country-flag {
                width: 16px;
                height: 12px;
                margin-left: 4px; /* Switched from margin-right and slightly increased for balance */
                vertical-align: middle;
            }
            /* Unified base styles for dismiss button in both flair types */
            .${flairTag} .dismiss-flair,
            .${multiAirportFlairClass} .dismiss-flair {
                position: absolute;
                top: -6px;
                right: -6px;
                width: 16px;
                height: 16px;
                line-height: 16px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                background-color: rgba(74, 74, 74, 0.6); /* Translucent background */
                color: #ffffff;
                border-radius: 50%;
                cursor: pointer;
                opacity: 0;
                pointer-events: none; /* Prevent interaction when hidden */
                z-index: 10;
                will-change: opacity, background-color; /* Hint for smoother transitions */
            }
            /* Removed redundant .${flairTag}:hover .dismiss-flair and .${flairTag} .dismiss-flair:hover rules
               as they are covered by the combined selectors below. */

            .${potentialFlairClass} {
                text-decoration: underline dotted rgba(128, 128, 128, 0.7);
                cursor: help;
                /* Ensure it doesn't pick up parent link styles if it's inside an <a> not yet processed */
                color: inherit;
            }
            .${potentialFlairClass}:hover {
                text-decoration-color: rgba(100, 100, 100, 1); /* Darker underline on hover */
                background-color: rgba(200, 200, 200, 0.1); /* Very subtle hover background */
            }
            /* No specific hover title CSS needed if using default browser title attribute */

            /* Styles for Multi-Airport Flairs */
            .${multiAirportFlairClass} {
                display: inline-flex;
                align-items: center;
                vertical-align: baseline;
                font-family: 'Fira Code', 'Roboto Mono', Arial, sans-serif; /* UPDATED FONT */
                padding: 1px 4px;
                /* color: #d19a66; // Default, will be overridden by theme specific below */
                /* background-color: #3a3d41; // Default, will be overridden by theme specific below */
                border-radius: 3px;
                text-decoration: none;
                margin: 0 1px;
                position: relative;
            }
            /* Dynamic background AND color for multi-airport flairs based on theme */
            /* Light mode for multi-airport */
            html:not(.dark) body:not(.dark) .${multiAirportFlairClass},
            body:not([style*="background-color: rgb(0, 0, 0)"]):not([style*="background-color: #000"]) .${multiAirportFlairClass} {
                background-color: ${isLikelyDarkMode ? '#273440' : '#e0e0e0'}; /* Lighter grey for light mode */
                color: ${isLikelyDarkMode ? '#e6c07b' : '#c18401'}; /* USER REQUESTED LIGHT MODE COLOR */
            }
            html.dark .${multiAirportFlairClass},
            body.dark .${multiAirportFlairClass},
            body[style*="background-color: rgb(0, 0, 0)"] .${multiAirportFlairClass},
            body[style*="background-color: #000"] .${multiAirportFlairClass} {
                 background-color: #273440; /* Dim mode dark */
                 color: #e6c07b; /* Revert to standard flair text color in dark mode */
            }
            /* Consider a specific lights-out color if needed, for now dim is fine */

            .${multiAirportFlairClass} img.country-flag {
                width: 16px;
                height: 12px;
                margin-left: 4px;
                vertical-align: middle;
            }
            /* No specific hover title CSS needed */

            /* Combining dismiss button hover selectors for robustness */
            .${flairTag}:hover .dismiss-flair,
            .${multiAirportFlairClass}:hover .dismiss-flair {
                opacity: 0.85;
                pointer-events: auto;
                transition: opacity 0.15s ease-in-out, background-color 0.15s ease-in-out;
            }
            .${flairTag} .dismiss-flair:hover,
            .${multiAirportFlairClass} .dismiss-flair:hover {
                opacity: 1;
                background-color: rgba(51, 51, 51, 0.85);
                transition: opacity 0.15s ease-in-out, background-color 0.15s ease-in-out;
            }
        `;
    }

    function injectStyles() {
        // Remove existing styles if they exist to update dynamic ones (like dark mode)
        const existingStyleId = 'airport-flair-styles';
        let existingStyleElement = document.getElementById(existingStyleId);
        if (existingStyleElement) {
            existingStyleElement.remove();
        }
        GM_addStyle(getDynamicStyles());
        // Add an ID to the style element for easy removal/update if needed
        const styleElements = document.head.getElementsByTagName('style');
        if(styleElements.length > 0) {
             // Assume the last style element added by GM_addStyle is ours if we don't have a direct way to ID it from GM_addStyle
            styleElements[styleElements.length - 1].id = existingStyleId;
        }
    }

    // --- DOM Interaction & Manipulation ---
    function createFlairElement(code, airportInfo, originalCasing = null) {
        const anchor = document.createElement('a');
        anchor.href = `https://www.google.com/search?q=airport+${encodeURIComponent(code)}`;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.classList.add(flairTag); // Standard flair tag
        anchor.classList.add(processedMark);

        let titleText = `${airportInfo.name} (${code})`;
        if (airportInfo.municipality) titleText += `, ${airportInfo.municipality}`;
        if (airportInfo.iso_country) titleText += `, ${airportInfo.iso_country}`;
        anchor.title = titleText;

        const codeTextNode = document.createTextNode(code);
        anchor.appendChild(codeTextNode); // Text first

        if (airportInfo.iso_country) {
            const flagImg = document.createElement('img');
            flagImg.src = `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.5/flags/4x3/${airportInfo.iso_country.toLowerCase()}.svg`;
            flagImg.alt = `${airportInfo.iso_country} flag`;
            flagImg.classList.add('country-flag');
            anchor.appendChild(flagImg); // Flag after text
        }

        // Dismiss Button for single airport flairs
        const dismissBtn = document.createElement('span');
        dismissBtn.classList.add('dismiss-flair');
        dismissBtn.innerHTML = '&times;';
        dismissBtn.dataset.code = code;
        dismissBtn.dataset.type = 'single-airport'; // Explicitly mark type

        if (originalCasing && originalCasing !== code) {
            dismissBtn.dataset.originalCasing = originalCasing;
            dismissBtn.title = `Revert to '${originalCasing}' (potential code)`;
        } else {
            dismissBtn.title = `Revert to '${code}' (potential code)`;
        }

        dismissBtn.addEventListener('click', function(event) {
            console.log("[Airport Flair] Single Airport Dismiss button clicked:", event.target.dataset.code);
            event.preventDefault();
            event.stopPropagation();

            const currentCode = event.target.dataset.code;
            const originalMixedCasing = event.target.dataset.originalCasing;
            const currentFlairElement = event.target.closest('.' + flairTag);

            const codeForPotential = originalMixedCasing || currentCode;
            const airportInfoForReversion = airportData[codeForPotential.toUpperCase()];

            if (currentFlairElement && currentFlairElement.parentNode) {
                if (airportInfoForReversion) {
                    const potentialElement = createPotentialFlairElement(codeForPotential, airportInfoForReversion, false);
                    currentFlairElement.parentNode.replaceChild(potentialElement, currentFlairElement);
                } else {
                    const revertedTextSpan = document.createElement('span');
                    revertedTextSpan.textContent = codeForPotential;
                    revertedTextSpan.classList.add(processedMark);
                    currentFlairElement.parentNode.replaceChild(revertedTextSpan, currentFlairElement);
                }
            }
        });
        anchor.appendChild(dismissBtn);
        return anchor;
    }

    // Modified createPotentialFlairElement to handle both single and multi-airport types
    function createPotentialFlairElement(originalCode, info, isMultiAirport = false) {
        const span = document.createElement('span');
        span.classList.add(potentialFlairClass);
        span.classList.add(processedMark);
        span.textContent = originalCode;

        let titleText = `Recognize ${originalCode.toUpperCase()} as an `;
        if (isMultiAirport && info && info.name) {
            titleText += `area? (${info.name})`;
        } else if (!isMultiAirport && info && info.name) {
            titleText += `airport? (${info.name})`;
        } else {
            titleText += `code?`; // Fallback
        }
        span.title = titleText;

        span.dataset.originalCode = originalCode;
        span.dataset.isMulti = isMultiAirport ? "true" : "false";

        const clickListener = function(event) {
            event.preventDefault();
            event.stopPropagation();

            const codeToConvert = event.target.dataset.originalCode;
            const wasMulti = event.target.dataset.isMulti === "true";
            const uppercaseCode = codeToConvert.toUpperCase();

            let fullFlairElement;
            if (wasMulti) {
                const maInfo = multiAirportData[uppercaseCode];
                if (maInfo) {
                    fullFlairElement = createMultiAirportFlairElement(uppercaseCode, maInfo, codeToConvert);
                }
            } else {
                const airportInfo = airportData[uppercaseCode];
                if (airportInfo) {
                    fullFlairElement = createFlairElement(uppercaseCode, airportInfo, codeToConvert);
                }
            }

            if (fullFlairElement && event.target.parentNode) {
                event.target.parentNode.replaceChild(fullFlairElement, event.target);
            }
        };
        span.addEventListener('click', clickListener, { once: true });
        return span;
    }

    function replaceTextWithFlair(textNode) {
        if (!textNode.parentNode || textNode.parentNode.classList.contains(processedMark) ||
            textNode.parentNode.closest('a, script, style, input, textarea, [contenteditable="true"], .poll-container, .option-text, .' + flairTag + ', .' + potentialFlairClass + ', .' + multiAirportFlairClass)) {
            return;
        }

        const text = textNode.nodeValue;
        let match;
        let lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let foundMatch = false;

        while ((match = iataRegex.exec(text)) !== null) {
            const originalCode = match[1];
            const uppercaseCode = originalCode.toUpperCase();

            const airportInfo = airportData[uppercaseCode];
            const maInfo = multiAirportData[uppercaseCode];

            if (COMMON_TLA_BLOCKLIST.has(uppercaseCode)) {
                if (airportInfo || maInfo) { // It's a common TLA but also a valid airport/MA code
                    foundMatch = true;
                    if (match.index > lastIndex) {
                        fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
                    }
                    // Always create potential for blocklisted items that are also airports
                    fragment.appendChild(createPotentialFlairElement(originalCode, airportInfo || maInfo, !!maInfo));
                    lastIndex = iataRegex.lastIndex;
                }
                // If it's in the blocklist and NOT an airport, we do nothing, effectively skipping it.
                // The loop will continue, and this part of the text remains unchanged.
            } else if (airportInfo || maInfo) { // Not in blocklist, but is an airport/MA code
                foundMatch = true;
                if (match.index > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
                }

                if (originalCode === uppercaseCode) { // Already all caps
                    if (airportInfo) {
                        fragment.appendChild(createFlairElement(uppercaseCode, airportInfo));
                    } else { // maInfo must be true
                        fragment.appendChild(createMultiAirportFlairElement(uppercaseCode, maInfo));
                    }
                } else { // Mixed or lowercase - create potential
                    if (airportInfo) {
                        fragment.appendChild(createPotentialFlairElement(originalCode, airportInfo, false));
                    } else { // maInfo must be true
                        fragment.appendChild(createPotentialFlairElement(originalCode, maInfo, true));
                    }
                }
                lastIndex = iataRegex.lastIndex;
            }
            // If no conditions met (not blocklisted, not airport), loop continues, text remains.
        }

        if (foundMatch) {
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
            }
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    }

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            replaceTextWithFlair(node);
        }
        else if (node.nodeType === Node.ELEMENT_NODE &&
                 !node.classList.contains(processedMark) &&
                 !node.closest('a, script, style, input, textarea, [contenteditable="true"], .poll-container, .option-text, .' + flairTag + ', .' + potentialFlairClass + ', .' + multiAirportFlairClass)) {
             Array.from(node.childNodes).forEach(child => processNode(child));
        }
    }

    function processAddedNodes(mutationList) {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    // Check if the node itself has already been processed (e.g. if it's part of a flair we just added)
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains(processedMark)) {
                        return;
                    }
                    processNode(node);
                });
            }
        }
        // After processing mutations, it's good to re-evaluate dynamic styles like dark mode
        injectStyles();
    }

    function observeDOMChanges() {
        if (observer) observer.disconnect(); // Disconnect previous observer if any

        observer = new MutationObserver(processAddedNodes);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log("MutationObserver started.");
    }

    function processPage() {
        console.log("Processing page for airport codes...");
        injectStyles();
        // Initial scan of the entire body
        processNode(document.body);
        observeDOMChanges();
    }

    // --- Cleanup ---
    window.addEventListener('unload', () => {
        if (observer) {
            observer.disconnect();
            console.log("Disconnected MutationObserver.");
        }
    });

    // --- Create Flair Elements ---
    // Function to create the actual styled flair element for MULTI-AIRPORT codes
    function createMultiAirportFlairElement(code, maInfo, originalCasing = null) {
        const anchor = document.createElement('a');
        anchor.href = `https://www.google.com/search?q=${encodeURIComponent(maInfo.name)}`; // Search for the area name
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.classList.add(multiAirportFlairClass); // Use special class
        anchor.classList.add(processedMark);

        anchor.title = `${maInfo.name} (${code})`;

        // Flag logic: use primaryAirportForFlag from maInfo to look up in airportData
        if (maInfo.primaryAirportForFlag && airportData[maInfo.primaryAirportForFlag]) {
            const primaryAirportDetails = airportData[maInfo.primaryAirportForFlag];
            if (primaryAirportDetails.iso_country) {
                const flagImg = document.createElement('img');
                flagImg.src = `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.5/flags/4x3/${primaryAirportDetails.iso_country.toLowerCase()}.svg`;
                flagImg.alt = `${primaryAirportDetails.iso_country} flag`;
                flagImg.classList.add('country-flag');
                anchor.appendChild(flagImg); // Flag first for multi-airport to differentiate?
            }
        }

        const codeTextNode = document.createTextNode(code);
        if (anchor.firstChild && anchor.firstChild.tagName === 'IMG') { // If flag was added, append text after
            anchor.appendChild(codeTextNode);
        } else { // Otherwise, text is first
            anchor.insertBefore(codeTextNode, anchor.firstChild);
        }

        // Add Dismiss Button
        const dismissBtn = document.createElement('span');
        dismissBtn.classList.add('dismiss-flair');
        dismissBtn.innerHTML = '&times;';
        dismissBtn.dataset.code = code; // Uppercase code of the flair
        dismissBtn.dataset.type = 'multi-airport'; // Mark type for potential differentiated dismiss logic

        // Determine title and if originalCasing needs to be stored for dismiss
        if (originalCasing && originalCasing !== code) {
            dismissBtn.dataset.originalCasing = originalCasing;
            dismissBtn.title = `Revert to '${originalCasing}' (potential code)`;
        } else {
            dismissBtn.title = `Revert to '${code}' (potential code)`;
        }

        dismissBtn.addEventListener('click', function(event) {
            console.log("[Airport Flair] Multi-Airport Dismiss button clicked:", event.target.dataset.code);
            event.preventDefault();
            event.stopPropagation();

            const currentCode = event.target.dataset.code;
            const originalMixedCasing = event.target.dataset.originalCasing;
            const currentFlairElement = event.target.closest('.' + multiAirportFlairClass);
            const codeForPotential = originalMixedCasing || currentCode;
            const maInfoForReversion = multiAirportData[codeForPotential.toUpperCase()];
            // Also check regular airport data in case it's an ambiguous code that got here
            const airportInfoForReversion = airportData[codeForPotential.toUpperCase()];

            if (currentFlairElement && currentFlairElement.parentNode) {
                const infoForPotential = maInfoForReversion || airportInfoForReversion; // Prefer MA info if available
                if (infoForPotential) {
                    const potentialElement = createPotentialFlairElement(codeForPotential, infoForPotential, !!maInfoForReversion);
                    currentFlairElement.parentNode.replaceChild(potentialElement, currentFlairElement);
                } else {
                    // Fallback to plain text if no info found (should be rare)
                    const revertedTextSpan = document.createElement('span');
                    revertedTextSpan.textContent = codeForPotential;
                    revertedTextSpan.classList.add(processedMark);
                    currentFlairElement.parentNode.replaceChild(revertedTextSpan, currentFlairElement);
                }
            }
        });
        anchor.appendChild(dismissBtn);
        return anchor;
    }

})();