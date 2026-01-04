// ==UserScript==
// @name         DEOVRContentFilter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filter videos by channel/keyword, with dropdown "Block Channel" button and menu commands to manage filter lists, plus import/export functionality.
// @author       Twine1481
// @match        https://deovr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deovr.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531321/DEOVRContentFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/531321/DEOVRContentFilter.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const SCRIPT_PREFIX = "[DEOVRContentFilter]";
    console.log(`${SCRIPT_PREFIX} Script starting up...`);

    // -------------------------------------------------------------------------
    // 1) CONFIGURATION
    // -------------------------------------------------------------------------

    // Storage keys for persistence
    const STORAGE = {
        CHANNELS: "filteredChannels",
        KEYWORDS: "filteredKeywords"
    };

    // Default filter lists (content-agnostic)
    const DEFAULT_CONFIG = {
        // Add your default filtered channels here
        filteredChannels: [
            // Empty by default
        ],

        // Add your default filtered keywords here
        filteredKeywords: [
            // Empty by default
        ]
    };

    // -------------------------------------------------------------------------
    // 2) STATE MANAGEMENT
    // -------------------------------------------------------------------------

    /**
     * State management object for filter lists
     */
    const FilterState = {
        // Current filter lists
        filteredChannels: [],
        filteredKeywords: [],

        /**
         * Initialize filter state from storage
         */
        initialize() {
            // Load stored channels
            const storedChannels = GM_getValue(STORAGE.CHANNELS);
            const normalizedStoredChannels = Array.isArray(storedChannels)
                ? storedChannels.map(ch => ch.toLowerCase())
                : [];

            // Load stored keywords
            const storedKeywords = GM_getValue(STORAGE.KEYWORDS);
            const normalizedStoredKeywords = Array.isArray(storedKeywords)
                ? storedKeywords.map(kw => kw.toLowerCase())
                : [];

            // Merge default with stored values (removing duplicates)
            this.filteredChannels = [...new Set([
                ...DEFAULT_CONFIG.filteredChannels.map(ch => ch.toLowerCase()),
                ...normalizedStoredChannels
            ])];

            this.filteredKeywords = [...new Set([
                ...DEFAULT_CONFIG.filteredKeywords.map(kw => kw.toLowerCase()),
                ...normalizedStoredKeywords
            ])];

            // Log state
            this._logState();
        },

        /**
         * Add a channel to the filter list
         * @param {string} channel - Channel name to add
         * @returns {boolean} - Whether the channel was added
         */
        addChannel(channel) {
            if (!channel || typeof channel !== 'string') return false;

            const normalizedChannel = channel.toLowerCase().trim();
            if (!normalizedChannel) return false;

            if (this.filteredChannels.includes(normalizedChannel)) {
                return false; // Already in the list
            }

            this.filteredChannels.push(normalizedChannel);
            this._persistChannels();
            return true;
        },

        /**
         * Remove a channel from the filter list
         * @param {string} channel - Channel name to remove
         * @returns {boolean} - Whether the channel was removed
         */
        removeChannel(channel) {
            if (!channel || typeof channel !== 'string') return false;

            const normalizedChannel = channel.toLowerCase().trim();
            if (!normalizedChannel) return false;

            const initialLength = this.filteredChannels.length;
            this.filteredChannels = this.filteredChannels.filter(ch => ch !== normalizedChannel);

            if (this.filteredChannels.length !== initialLength) {
                this._persistChannels();
                return true;
            }

            return false;
        },

        /**
         * Add a keyword to the filter list
         * @param {string} keyword - Keyword to add
         * @returns {boolean} - Whether the keyword was added
         */
        addKeyword(keyword) {
            if (!keyword || typeof keyword !== 'string') return false;

            const normalizedKeyword = keyword.toLowerCase().trim();
            if (!normalizedKeyword) return false;

            if (this.filteredKeywords.includes(normalizedKeyword)) {
                return false; // Already in the list
            }

            this.filteredKeywords.push(normalizedKeyword);
            this._persistKeywords();
            return true;
        },

        /**
         * Remove a keyword from the filter list
         * @param {string} keyword - Keyword to remove
         * @returns {boolean} - Whether the keyword was removed
         */
        removeKeyword(keyword) {
            if (!keyword || typeof keyword !== 'string') return false;

            const normalizedKeyword = keyword.toLowerCase().trim();
            if (!normalizedKeyword) return false;

            const initialLength = this.filteredKeywords.length;
            this.filteredKeywords = this.filteredKeywords.filter(kw => kw !== normalizedKeyword);

            if (this.filteredKeywords.length !== initialLength) {
                this._persistKeywords();
                return true;
            }

            return false;
        },

        /**
         * Check if content should be filtered based on current filters
         * @param {string} text - Text content to check
         * @returns {Object} - Result with match details
         */
        shouldFilter(text) {
            if (!text || typeof text !== 'string') {
                return { shouldFilter: false };
            }

            const normalizedText = text.toLowerCase();

            // Check for channel match
            const channelMatch = this.filteredChannels.some(channel =>
                normalizedText.includes(channel));

            // Check for keyword match
            const keywordMatch = this.filteredKeywords.some(keyword =>
                normalizedText.includes(keyword));

            return {
                shouldFilter: channelMatch || keywordMatch,
                channelMatch,
                keywordMatch
            };
        },

        /**
         * Persist channels to storage
         * @private
         */
        _persistChannels() {
            GM_setValue(STORAGE.CHANNELS, this.filteredChannels);
        },

        /**
         * Persist keywords to storage
         * @private
         */
        _persistKeywords() {
            GM_setValue(STORAGE.KEYWORDS, this.filteredKeywords);
        },

        /**
         * Log current state to console
         * @private
         */
        _logState() {
            console.log(`${SCRIPT_PREFIX} Filtered Channels:`, this.filteredChannels);
            console.log(`${SCRIPT_PREFIX} Filtered Keywords:`, this.filteredKeywords);
        }
    };

    // -------------------------------------------------------------------------
    // 3) DOM INTERACTION
    // -------------------------------------------------------------------------

    /**
     * DOM utilities for filtering content and UI modifications
     */
    const DOMManager = {
        /**
         * Filter videos based on current filter state
         */
        filterContent() {
            console.log(`${SCRIPT_PREFIX} Filtering content...`);

            const articles = document.querySelectorAll("article");
            console.log(`${SCRIPT_PREFIX} Found ${articles.length} items to check.`);

            let filteredCount = 0;
            articles.forEach(article => {
                const articleText = article.textContent;
                const result = FilterState.shouldFilter(articleText);

                if (result.shouldFilter) {
                    article.style.display = "none";
                    filteredCount++;

                    console.log(
                        `${SCRIPT_PREFIX} Filtered item:`,
                        article,
                        `channelMatch=${result.channelMatch}`,
                        `keywordMatch=${result.keywordMatch}`
                    );
                }
            });

            console.log(`${SCRIPT_PREFIX} Filtered ${filteredCount} of ${articles.length} items.`);
        },

        /**
         * Inject "Block Channel" button into dropdown menu
         * @param {HTMLElement} dropdownMenu - The dropdown menu element
         */
        injectBlockButton(dropdownMenu) {
            // Avoid duplicates
            if (dropdownMenu.querySelector(".filter-option")) return;

            const listItem = document.createElement("li");
            listItem.classList.add("filter-option");
            listItem.innerHTML = `
                <div class="u-cursor--pointer u-fs--fo u-p--four u-lh--one u-block u-nowrap u-transition--base js-m-dropdown" data-qa="block-channel" style="display: flex; align-items: center;">
                    <span class="o-icon u-mr--three u-dg" style="width:18px;">
                        <svg class="o-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"
                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"></path>
                        </svg>
                    </span>
                    <span class="u-inline-block u-align-y--m u-mr--four u-ug u-fw--semibold u-uppercase hover:u-bl">Block Channel</span>
                </div>
            `;

            // Add click handler
            listItem.addEventListener("click", () => this._handleBlockChannelClick(dropdownMenu));

            // Add to dropdown
            dropdownMenu.appendChild(listItem);
            console.log(`${SCRIPT_PREFIX} Block button added to dropdown menu:`, dropdownMenu);
        },

        /**
         * Scan existing dropdowns for adding block buttons
         */
        scanExistingDropdowns() {
            console.log(`${SCRIPT_PREFIX} Scanning for existing dropdown menus...`);

            const dropdowns = document.querySelectorAll(
                "#content .m-dropdown.m-dropdown--grid-item .m-dropdown-content ul.u-list.u-l"
            );

            console.log(`${SCRIPT_PREFIX} Found ${dropdowns.length} existing dropdown menu(s).`);
            dropdowns.forEach(dropdown => this.injectBlockButton(dropdown));
        },

        /**
         * Set up observer for dynamically added dropdowns
         */
        setupDynamicObserver() {
            const contentElement = document.querySelector("#content") || document.body;

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the added node is a dropdown menu
                            if (node.matches && node.matches(".m-dropdown-content ul.u-list.u-l")) {
                                this.injectBlockButton(node);
                            } else {
                                // Check for dropdown menus within the added node
                                const nestedDropdowns = node.querySelectorAll ?
                                    node.querySelectorAll(".m-dropdown-content ul.u-list.u-l") :
                                    [];

                                nestedDropdowns.forEach(dropdown => this.injectBlockButton(dropdown));
                            }
                        }
                    });
                });
            });

            observer.observe(contentElement, { childList: true, subtree: true });
            console.log(`${SCRIPT_PREFIX} Dynamic observer set up for new dropdown menus.`);
        },

        /**
         * Handle click on "Block Channel" button
         * @private
         * @param {HTMLElement} dropdownMenu - The dropdown menu element
         */
        _handleBlockChannelClick(dropdownMenu) {
            console.log(`${SCRIPT_PREFIX} Block Channel button clicked.`);

            // Find parent article
            const article = dropdownMenu.closest("article");
            if (!article) {
                console.warn(`${SCRIPT_PREFIX} Could not find parent article.`);
                return;
            }

            // Find channel link
            const channelLink = article.querySelector('a[href^="/channel/"]');
            if (!channelLink) {
                console.warn(`${SCRIPT_PREFIX} No channel link found.`);
                return;
            }

            // Get channel name
            let channelName = channelLink.dataset.amplitudePropsChannel;
            if (!channelName || !channelName.trim()) {
                channelName = channelLink.textContent.trim();
            }
            channelName = channelName.toLowerCase();

            // Validate channel name
            if (channelName.length < 2) {
                if (!confirm(`Channel name is "${channelName}" (very short). Block anyway?`)) {
                    return;
                }
            }

            // Add to filter list
            if (FilterState.addChannel(channelName)) {
                alert(`Channel "${channelName}" added to block list.\nFiltering matching content...`);
                this.filterContent();
            } else {
                alert(`Channel "${channelName}" is already blocked.`);
            }
        }
    };

    // -------------------------------------------------------------------------
    // 4) USER INTERFACE - MENU COMMANDS
    // -------------------------------------------------------------------------

    /**
     * User interface for managing filter lists
     */
    const UserInterface = {
        /**
         * Register all Tampermonkey menu commands
         */
        registerMenuCommands() {
            GM_registerMenuCommand("Add Blocked Channel", () => this.addChannel());
            GM_registerMenuCommand("Remove Blocked Channel", () => this.removeChannel());
            GM_registerMenuCommand("Add Blocked Keyword", () => this.addKeyword());
            GM_registerMenuCommand("Remove Blocked Keyword", () => this.removeKeyword());
            GM_registerMenuCommand("Export Filter Lists", () => this.exportFilters());
            GM_registerMenuCommand("Import Filter Lists", () => this.importFilters());

            console.log(`${SCRIPT_PREFIX} Menu commands registered.`);
        },

        /**
         * Prompt user to add a channel to the filter list
         */
        addChannel() {
            const newChannel = prompt("Enter channel name to block:").trim();
            if (!newChannel) return;

            if (FilterState.addChannel(newChannel)) {
                alert(`Channel "${newChannel}" added. Reload the page to update.`);
            } else {
                alert(`Channel "${newChannel}" is already blocked.`);
            }
        },

        /**
         * Prompt user to remove a channel from the filter list
         */
        removeChannel() {
            if (FilterState.filteredChannels.length === 0) {
                alert("No blocked channels.");
                return;
            }

            const listStr = FilterState.filteredChannels.join("\n");
            const toRemove = prompt("Blocked channels:\n" + listStr + "\n\nEnter channel name to remove:");
            if (!toRemove) return;

            if (FilterState.removeChannel(toRemove)) {
                alert(`Channel "${toRemove}" removed. Reload the page to update.`);
            } else {
                alert(`Channel "${toRemove}" not found.`);
            }
        },

        /**
         * Prompt user to add a keyword to the filter list
         */
        addKeyword() {
            const newKeyword = prompt("Enter a keyword to block:").trim();
            if (!newKeyword) return;

            if (FilterState.addKeyword(newKeyword)) {
                alert(`Keyword "${newKeyword}" added. Reload the page to update.`);
            } else {
                alert(`Keyword "${newKeyword}" is already blocked.`);
            }
        },

        /**
         * Prompt user to remove a keyword from the filter list
         */
        removeKeyword() {
            if (FilterState.filteredKeywords.length === 0) {
                alert("No blocked keywords.");
                return;
            }

            const listStr = FilterState.filteredKeywords.join("\n");
            const toRemove = prompt("Blocked keywords:\n" + listStr + "\n\nEnter keyword to remove:");
            if (!toRemove) return;

            if (FilterState.removeKeyword(toRemove)) {
                alert(`Keyword "${toRemove}" removed. Reload the page to update.`);
            } else {
                alert(`Keyword "${toRemove}" not found.`);
            }
        },

        /**
         * Export filter lists to JSON file
         */
        exportFilters() {
            const data = {
                filteredChannels: FilterState.filteredChannels,
                filteredKeywords: FilterState.filteredKeywords
            };

            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = "deovr_filter_lists.json";
            downloadLink.click();

            URL.revokeObjectURL(url);
        },

        /**
         * Import filter lists from JSON file
         * Uses a modal dialog approach to avoid browser security restrictions
         */
        importFilters() {
            console.log(`${SCRIPT_PREFIX} Starting import process with modal dialog...`);

            // Create modal container
            const modalOverlay = document.createElement('div');
            modalOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
            `;

            // Create modal dialog
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            `;

            // Create heading
            const heading = document.createElement('h2');
            heading.textContent = 'Import Filter Lists';
            heading.style.cssText = `
                margin-top: 0;
                margin-bottom: 15px;
                font-size: 18px;
            `;

            // Create description
            const description = document.createElement('p');
            description.textContent = 'Select a JSON file containing filter lists.';
            description.style.marginBottom = '20px';

            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'application/json';
            fileInput.style.display = 'block';
            fileInput.style.marginBottom = '15px';
            fileInput.style.width = '100%';

            // Create buttons container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            `;

            // Create cancel button
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.cssText = `
                padding: 8px 16px;
                background-color: #f1f1f1;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;

            // Create import button
            const importButton = document.createElement('button');
            importButton.textContent = 'Import';
            importButton.style.cssText = `
                padding: 8px 16px;
                background-color: #4285f4;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;
            importButton.disabled = true;

            // Add event listener to enable import button when file is selected
            fileInput.addEventListener('change', () => {
                importButton.disabled = !fileInput.files || fileInput.files.length === 0;
            });

            // Add cancel button functionality
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(modalOverlay);
            });

            // Add import button functionality
            importButton.addEventListener('click', () => {
                const file = fileInput.files[0];
                if (!file) return;

                console.log(`${SCRIPT_PREFIX} Reading file: ${file.name}`);

                const reader = new FileReader();

                // Handle file reading errors
                reader.onerror = error => {
                    console.error(`${SCRIPT_PREFIX} Error reading file:`, error);
                    alert(`Error reading file: ${error.message || "Unknown error"}`);
                    document.body.removeChild(modalOverlay);
                };

                // Process file contents when loaded
                reader.onload = e => {
                    console.log(`${SCRIPT_PREFIX} File read complete, processing content...`);

                    try {
                        const imported = JSON.parse(e.target.result);
                        console.log(`${SCRIPT_PREFIX} Parsed JSON:`, imported);

                        let updated = false;

                        // Support both new and old property names for backward compatibility

                        // Check for channels (new property name)
                        if (imported.filteredChannels && Array.isArray(imported.filteredChannels)) {
                            console.log(`${SCRIPT_PREFIX} Importing filtered channels:`, imported.filteredChannels);
                            FilterState.filteredChannels = imported.filteredChannels.map(ch => ch.toLowerCase());
                            FilterState._persistChannels();
                            updated = true;
                        }
                        // Check for channels (old property name from original script)
                        else if (imported.blockedChannels && Array.isArray(imported.blockedChannels)) {
                            console.log(`${SCRIPT_PREFIX} Importing blocked channels (legacy format):`, imported.blockedChannels);
                            FilterState.filteredChannels = imported.blockedChannels.map(ch => ch.toLowerCase());
                            FilterState._persistChannels();
                            updated = true;
                        }

                        // Check for keywords (new property name)
                        if (imported.filteredKeywords && Array.isArray(imported.filteredKeywords)) {
                            console.log(`${SCRIPT_PREFIX} Importing filtered keywords:`, imported.filteredKeywords);
                            FilterState.filteredKeywords = imported.filteredKeywords.map(kw => kw.toLowerCase());
                            FilterState._persistKeywords();
                            updated = true;
                        }
                        // Check for keywords (old property name from original script)
                        else if (imported.blockedWords && Array.isArray(imported.blockedWords)) {
                            console.log(`${SCRIPT_PREFIX} Importing blocked words (legacy format):`, imported.blockedWords);
                            FilterState.filteredKeywords = imported.blockedWords.map(kw => kw.toLowerCase());
                            FilterState._persistKeywords();
                            updated = true;
                        }

                        document.body.removeChild(modalOverlay);

                        if (updated) {
                            alert("Filter lists imported successfully. Reload the page to update.");
                        } else {
                            alert("No valid filter lists found in the imported file.");
                        }
                    } catch (error) {
                        console.error(`${SCRIPT_PREFIX} JSON parsing error:`, error);
                        alert(`Error importing JSON: ${error.message}`);
                        document.body.removeChild(modalOverlay);
                    }
                };

                // Start reading the file as text
                reader.readAsText(file);
            });

            // Assemble the modal
            buttonsContainer.appendChild(cancelButton);
            buttonsContainer.appendChild(importButton);

            modalContent.appendChild(heading);
            modalContent.appendChild(description);
            modalContent.appendChild(fileInput);
            modalContent.appendChild(buttonsContainer);

            modalOverlay.appendChild(modalContent);

            // Add modal to the page
            document.body.appendChild(modalOverlay);

            // Add click handler to close when clicking outside the modal
            modalOverlay.addEventListener('click', (event) => {
                if (event.target === modalOverlay) {
                    document.body.removeChild(modalOverlay);
                }
            });
        }
    };

    // -------------------------------------------------------------------------
    // 5) INITIALIZATION
    // -------------------------------------------------------------------------

    /**
     * Initialize the script
     */
    function initialize() {
        // Initialize state
        FilterState.initialize();

        // Register menu commands
        UserInterface.registerMenuCommands();

        // Initial content filtering
        DOMManager.filterContent();

        // Set up UI
        DOMManager.scanExistingDropdowns();
        DOMManager.setupDynamicObserver();

        console.log(`${SCRIPT_PREFIX} Script fully initialized!`);
    }

    // Start the script
    initialize();
})();