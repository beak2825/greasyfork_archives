// ==UserScript==
// @name               Google Search Better Favicons
// @namespace          https://greasyfork.org/en/users/1467948-stonedkhajiit
// @version            0.1.0
// @description        Replaces low-resolution favicons in Google search results with higher-quality versions.
// @author             StonedKhajiit
// @icon               https://www.google.com/s2/favicons?sz=64&domain=google.com
// @match              https://www.google.tld/search*
// @exclude            /^https?:\/\/([a-z0-9-]+\.)*google\.[a-z.]+\/search.*(udm=2|udm=7|udm=28|udm=36|udm=39)/
// @run-at             document-end
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_registerMenuCommand
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/544972/Google%20Search%20Better%20Favicons.user.js
// @updateURL https://update.greasyfork.org/scripts/544972/Google%20Search%20Better%20Favicons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---[ 1. CONFIGURATION & STATE ]---

    const GSBF_FAVICON_SHAPE_KEY = 'gsbf_favicon_shape';
    const GSBF_SQUARE_FILL_KEY = 'gsbf_square_fill';
    const GSBF_MENU_COMMAND_SHAPE_ID = 'gsbf_toggle_favicon_shape';
    const GSBF_MENU_COMMAND_FILL_ID = 'gsbf_toggle_square_fill';

    const SELECTORS = {
        // Selector for result items on the "News" tab, used for style exclusions.
        newsSearchResult: '.SoaBEf',
        // The primary selector for containers that are treated as a single search result.
        searchResultItem: '.MjjYud, .SoaBEf, .m7jPZ, .A6K0A',
        // Selects the element that directly contains the favicon image within a result.
        faviconContainer: 'span.DDKf1c, span.H9lube, g-img.QyR1Ze',
        // Selects the main link within various result item structures.
        linkElement: '.yuRUbf a[href], .xe8e1b a[href], a.WlydOe[href], .a-no-hover-decoration[href], .h4kbcd[href]'
    };

    // ---[ 2. STYLES ]---

    const STYLES = `
        /* gsbf-processed-favicon: Base class for all script-handled icons. */
        /* gsbf-upgraded-favicon: Added only after a successful HQ replacement to trigger the fill effect. */

        /* Style the image directly for .DDKf1c containers. */
        body.gsbf-square-favicons :is(.MjjYud, .m7jPZ, .A6K0A):not(:has(.SoaBEf)) .DDKf1c.gsbf-processed-favicon img {
            border-radius: 4px !important;
        }

        /* Style the container for .H9lube containers to create a mask. */
        body.gsbf-square-favicons :is(.MjjYud, .m7jPZ, .A6K0A):not(:has(.SoaBEf)) .H9lube.gsbf-processed-favicon {
            border-radius: 4px !important;
            overflow: hidden !important;
        }

        /* Ensure the image inside a styled .H9lube container remains a true square. */
        body.gsbf-square-favicons :is(.MjjYud, .m7jPZ, .A6K0A):not(:has(.SoaBEf)) .H9lube.gsbf-processed-favicon img {
            border-radius: 0 !important;
        }

        /* Enlarge the icon to fill its container if it was successfully upgraded. */
        body.gsbf-square-favicons.gsbf-square-fill-enabled :is(.MjjYud, .m7jPZ, .A6K0A):not(:has(.SoaBEf)) .H9lube.gsbf-upgraded-favicon img.XNo5Ab {
            width: 26px !important;
            height: 26px !important;
        }

        /* Add a transition effect for smoothness. */
        .gsbf-processed-favicon,
        .gsbf-processed-favicon img {
             transition: border-radius 0.2s ease-in-out, width 0.2s ease-in-out, height 0.2s ease-in-out;
        }
    `;

    // ---[ 3. CORE LOGIC ]---

    /**
     * Reads all stored preferences and applies the corresponding CSS classes to the document body.
     */
    function applyPreferences() {
        // Apply shape preference, with "square" as the new default.
        const shape = GM_getValue(GSBF_FAVICON_SHAPE_KEY, 'square');
        document.body.classList.toggle('gsbf-square-favicons', shape === 'square');

        // Apply square fill preference
        const fill = GM_getValue(GSBF_SQUARE_FILL_KEY, true); // Default to true (enabled)
        document.body.classList.toggle('gsbf-square-fill-enabled', fill);

        updateMenuCommands();
    }

    /**
     * Registers and updates the state of all toggleable menu commands.
     */
    function updateMenuCommands() {
        // Command 1: Toggle favicon shape
        const currentShape = GM_getValue(GSBF_FAVICON_SHAPE_KEY, 'square');
        const isSquare = currentShape === 'square';
        const shapeMenuText = `${isSquare ? '[✓]' : '[  ]'} Use Square Favicons`;

        GM_registerMenuCommand(shapeMenuText, () => {
            GM_setValue(GSBF_FAVICON_SHAPE_KEY, isSquare ? 'circle' : 'square');
            applyPreferences();
        }, { id: GSBF_MENU_COMMAND_SHAPE_ID });

        // Command 2: Toggle fill effect for square icons
        const currentFill = GM_getValue(GSBF_SQUARE_FILL_KEY, true);
        const fillMenuText = `  ${currentFill ? '[✓]' : '[  ]'} Enlarge HQ Square Icons to Fill`;

        GM_registerMenuCommand(fillMenuText, () => {
            GM_setValue(GSBF_SQUARE_FILL_KEY, !currentFill);
            applyPreferences();
        }, { id: GSBF_MENU_COMMAND_FILL_ID });
    }


    /**
     * Enhances a single favicon by replacing it with a high-quality version if available.
     * @param {HTMLElement} faviconContainer - The DOM element containing the favicon.
     * @param {string} domain - The domain of the search result.
     */
    function enhanceResultFavicon(faviconContainer, domain) {
        if (!faviconContainer || !domain) return;

        // Immediately add the 'processed' class to apply basic styles.
        faviconContainer.classList.add('gsbf-processed-favicon');

        const existingImg = faviconContainer.querySelector('img');
        const existingSvg = faviconContainer.querySelector('svg');

        // If Google shows a generic SVG placeholder, skip network request.
        if (existingSvg) {
            return;
        }

        // Proceed only if there is an actual image to potentially replace.
        if (!existingImg) {
            return;
        }

        const targetSize = 96;
        const highQualityUrl = `https://www.google.com/s2/favicons?sz=${targetSize}&domain=${domain}`;

        const newImg = new Image();
        newImg.onload = () => {
            // Replace the icon only if the new one is higher resolution.
            if (newImg.naturalWidth > (existingImg.naturalWidth || 16)) {
                existingImg.src = highQualityUrl;
                // Add the 'upgraded' class only AFTER successful replacement.
                faviconContainer.classList.add('gsbf-upgraded-favicon');
            }
        };
        newImg.onerror = () => { /* Graceful failure */ };
        newImg.src = highQualityUrl;
    }

    /**
     * Processes a single search result DOM node to find and enhance its favicon.
     * @param {HTMLElement} resultNode - The container element of a single search result.
     */
    function processResultItem(resultNode) {
        if (resultNode.dataset.gsbfProcessed) return;
        resultNode.dataset.gsbfProcessed = 'true';

        const faviconContainer = resultNode.querySelector(SELECTORS.faviconContainer);
        const linkElement = resultNode.querySelector(SELECTORS.linkElement);
        if (!faviconContainer || !linkElement) return;

        try {
            let targetUrl;
            const href = linkElement.href;

            // Handle Google's redirect links.
            if (href && href.startsWith(window.location.origin + '/url?q=')) {
                targetUrl = new URL(href).searchParams.get('q');
            } else {
                targetUrl = href;
            }

            const domain = new URL(targetUrl).hostname;

            enhanceResultFavicon(faviconContainer, domain);
        } catch(e) {
            // Ignore nodes that don't have a valid URL structure.
        }
    }

    /**
     * Sets up the MutationObserver and initializes the script.
     */
    function main() {
        GM_addStyle(STYLES);
        applyPreferences();

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.nodeType === 1) {
                        if (addedNode.matches(SELECTORS.searchResultItem)) {
                            processResultItem(addedNode);
                        }
                        addedNode.querySelectorAll(SELECTORS.searchResultItem).forEach(processResultItem);
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Process results already on the page at script load.
        document.querySelectorAll(SELECTORS.searchResultItem).forEach(processResultItem);
    }

    main();

})();