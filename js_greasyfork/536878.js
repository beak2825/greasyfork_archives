// ==UserScript==
// @name        MusicBrainz: Add search link for barcode
// @namespace   https://musicbrainz.org/user/chaban
// @description Searches for existing releases in "Add release" edits by barcode, highlights and adds a search link on match
// @version     3.2.2
// @tag         ai-created
// @author      chaban
// @license     MIT
// @match       *://*.musicbrainz.org/edit/*
// @match       *://*.musicbrainz.org/search/edits*
// @match       *://*.musicbrainz.org/*/*/edits
// @match       *://*.musicbrainz.org/*/*/open_edits
// @match       *://*.musicbrainz.org/user/*/edits*
// @match       *://*.musicbrainz.eu/edit/*
// @match       *://*.musicbrainz.eu/search/edits*
// @match       *://*.musicbrainz.eu/*/*/edits
// @match       *://*.musicbrainz.eu/*/*/open_edits
// @match       *://*.musicbrainz.eu/user/*/edits*
// @connect     self
// @icon        https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant       GM_xmlhttpRequest
// @require https://update.greasyfork.org/scripts/552392/1703988/MusicBrainz%20API%20Module.js
// @downloadURL https://update.greasyfork.org/scripts/536878/MusicBrainz%3A%20Add%20search%20link%20for%20barcode.user.js
// @updateURL https://update.greasyfork.org/scripts/536878/MusicBrainz%3A%20Add%20search%20link%20for%20barcode.meta.js
// ==/UserScript==

/**
 * @file This script scans MusicBrainz edit pages for barcodes within "add-release" edits.
 * If a barcode is found to be associated with multiple releases on MusicBrainz,
 * the script highlights it and adds a convenient link to search for that barcode.
 */

(function() {
    'use strict';

    /**
     * Configuration object to centralize all constants.
     * @readonly
     * @namespace
     * @property {RegExp} BARCODE_REGEX - Regular expression to identify barcodes in text.
     * @property {string} TARGET_SELECTOR - CSS selector for the tables containing release information.
     * @property {string} USER_AGENT - The base user agent string for API requests.
     * @property {string} SEARCH_LINK_CLASS - CSS class for the generated search links.
     * @property {string} PROCESSED_BARCODE_SPAN_CLASS - CSS class for the spans that wrap found barcodes.
     */
    const Config = {
        BARCODE_REGEX: /(\b\d{8,14}\b)/g,
        TARGET_SELECTOR: '.add-release',
        USER_AGENT: 'UserJS.BarcodeLink',
        SEARCH_LINK_CLASS: 'mb-barcode-search-link',
        PROCESSED_BARCODE_SPAN_CLASS: 'mb-barcode-processed',
    };

    /**
     * Scans the DOM for barcode elements, wraps them in spans, and stores their references.
     * @namespace
     */
    const DOMScanner = {
        /**
         * A map where keys are barcode strings and values are arrays of the span elements that contain them.
         * @private
         * @type {Map<string, HTMLSpanElement[]>}
         */
        _barcodeToSpansMap: new Map(),

        /**
         * A set of all unique barcode strings found on the page.
         * @private
         * @type {Set<string>}
         */
        _uniqueBarcodes: new Set(),

        /**
         * Recursively finds barcodes in text nodes within a given node,
         * wraps them in spans, and stores references for later use.
         * @param {Node} node - The DOM node to process.
         */
        collectBarcodesAndCreateSpans: function(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                // Skip nodes that are already part of a processed span
                if (node.parentNode?.classList.contains(Config.PROCESSED_BARCODE_SPAN_CLASS)) return;

                const originalText = node.textContent;
                const matches = [...originalText.matchAll(Config.BARCODE_REGEX)];
                if (matches.length === 0) return;

                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                for (const match of matches) {
                    const barcode = match[0];
                    // Append any text that came before the barcode match
                    if (match.index > lastIndex) {
                        fragment.appendChild(document.createTextNode(originalText.substring(lastIndex, match.index)));
                    }

                    // Create a span for the barcode
                    const barcodeSpan = document.createElement('span');
                    barcodeSpan.textContent = barcode;
                    barcodeSpan.classList.add(Config.PROCESSED_BARCODE_SPAN_CLASS);

                    // Store a reference to the span for this barcode
                    this._barcodeToSpansMap.has(barcode) ? this._barcodeToSpansMap.get(barcode).push(barcodeSpan) : this._barcodeToSpansMap.set(barcode, [barcodeSpan]);
                    this._uniqueBarcodes.add(barcode);

                    fragment.appendChild(barcodeSpan);
                    lastIndex = match.index + barcode.length;
                }

                // Append any remaining text after the last barcode match
                if (lastIndex < originalText.length) {
                    fragment.appendChild(document.createTextNode(originalText.substring(lastIndex)));
                }
                // Replace the original text node with the new fragment
                node.parentNode.replaceChild(fragment, node);

            } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE'].includes(node.tagName)) {
                // Recursively process child nodes
                Array.from(node.childNodes).forEach(child => this.collectBarcodesAndCreateSpans(child));
            }
        },

        /**
         * Returns the set of unique barcodes found on the page.
         * @returns {Set<string>} A set of unique barcode strings.
         */
        getUniqueBarcodes: function() { return this._uniqueBarcodes; },

        /**
         * Returns a map of barcodes to their corresponding span elements.
         * @returns {Map<string, HTMLSpanElement[]>}
         */
        getBarcodeSpansMap: function() { return this._barcodeToSpansMap; }
    };

    /**
     * Main application logic for the userscript.
     * @namespace
     */
    const BarcodeLinkerApp = {
        /**
         * Initializes the application by starting the main processing function.
         */
        init: function() {
            this.processAddReleaseTables();
        },

        /**
         * Scans all "Add release" tables, finds barcodes, queries the MusicBrainz API,
         * and updates the DOM to highlight duplicates and add search links.
         */
        processAddReleaseTables: async function() {
            // 1. Scan the DOM for barcodes
            document.querySelectorAll(Config.TARGET_SELECTOR).forEach(table => DOMScanner.collectBarcodesAndCreateSpans(table));

            const uniqueBarcodes = DOMScanner.getUniqueBarcodes();
            if (uniqueBarcodes.size === 0) return;

            // 2. Prepare and execute the API search
            const mbApi = new MusicBrainzAPI({
                user_agent: `${Config.USER_AGENT}/${GM.info.script.version} ( ${GM.info.script.namespace} )`
            });
            const combinedQuery = Array.from(uniqueBarcodes).map(b => `barcode:${b}`).join(' OR ');

            try {
                // Fetch all matching releases in a single, paginated request
                const allReleases = await mbApi.search('release', combinedQuery, 100, [], true);

                if (allReleases.length > 0) {
                    // 3. Group the API results by barcode
                    const releasesByBarcode = new Map();
                    allReleases.forEach(release => {
                        if (release.barcode) {
                            releasesByBarcode.has(release.barcode) ? releasesByBarcode.get(release.barcode).push(release) : releasesByBarcode.set(release.barcode, [release]);
                        }
                    });

                    // 4. Update the DOM for barcodes with multiple releases
                    for (const [barcode, releases] of releasesByBarcode.entries()) {
                        if (releases.length > 1) {
                            const spans = DOMScanner.getBarcodeSpansMap().get(barcode);
                            if (spans) {
                                const searchUrl = `//musicbrainz.org/search?type=release&method=advanced&query=barcode:${barcode}`;
                                spans.forEach(span => {
                                    span.style.backgroundColor = 'yellow';
                                    span.title = `Multiple MusicBrainz releases found for barcode: ${barcode}`;
                                    const link = document.createElement('a');
                                    link.href = searchUrl;
                                    link.target = '_blank';
                                    link.textContent = 'Search';
                                    link.className = Config.SEARCH_LINK_CLASS;
                                    // Append the link in parentheses after the barcode text
                                    span.append(' (', link, ')');
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`[${GM.info.script.name}] Failed to fetch barcode data:`, error);
            }
        }
    };

    // Run the script
    BarcodeLinkerApp.init();

})();