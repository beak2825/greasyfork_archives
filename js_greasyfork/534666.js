// ==UserScript==
// @name         Torn Item Safety
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @license      GNU GPLv3
// @description  Displays effects of items in Torn's various item shops with hover tooltips and disables items with warnings when toggle is active.
// @author       Vassilios [2276659]
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/bigalgunshop.php*
// @match        https://www.torn.com/shops.php?step=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/534666/Torn%20Item%20Safety.user.js
// @updateURL https://update.greasyfork.org/scripts/534666/Torn%20Item%20Safety.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Register Tampermonkey menu command to enter API key
    GM_registerMenuCommand('Enter API key.', () => {
        const newApiKey = prompt('Please enter your Torn API key:', '');
        if (newApiKey && newApiKey.trim() !== '') {
            localStorage.setItem(CONFIG.STORAGE_KEYS.API_KEY, newApiKey.trim());
            // Clear cached data to force a fresh fetch with the new key
            localStorage.removeItem(CONFIG.STORAGE_KEYS.ITEM_DATA);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.LAST_REQUEST_TIME);
            // Trigger a refresh of item data
            ItemEffectsApp.init();
        }
    });

    // =====================================================================
    // CONFIGURATION
    // =====================================================================

    const CONFIG = {
        getApiKey: () => localStorage.getItem('tornItemEffects_apiKey') || "", // Dynamically retrieve API key
        API_BASE_URL: 'https://api.torn.com/v2/torn/items',
        ITEM_CATEGORIES: ['Tool', 'Enhancer'],
        CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        OBSERVER_CONFIG: { childList: true, subtree: true },
        ELEMENT_IDS: {
            WARNINGS_TOGGLE: 'warnings-toggle',
            WARNINGS_STATUS: 'warnings-status'
        },
        SELECTORS: {
            ALL_ITEMS: '#all-items',
            SELL_ITEMS_WRAP: '.sell-items-wrap',
            CONTENT_TITLE_LINKS: '.content-title-links',
            ITEM_NAME: '.name',
            WARNING_SIGN: '.warning-sign'
        },
        STORAGE_KEYS: {
            WARNING_STATE: 'tornItemEffects_warningState',
            ITEM_DATA: 'tornItemEffects_itemData',
            LAST_REQUEST_TIME: 'tornItemEffects_lastRequestTime',
            API_KEY: 'tornItemEffects_apiKey'
        },
        STYLES: {
            WARNING_SIGN: {
                color: '#ff9900',
                fontWeight: 'bold',
                marginLeft: '5px',
                cursor: 'help'
            },
            TOOLTIP: {
                position: 'absolute',
                backgroundColor: '#191919',
                color: '#F7FAFC',
                padding: '6px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                zIndex: '9999999',
                display: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                maxWidth: '250px',
                textAlign: 'left',
                fontFamily: 'Segoe UI, Arial, sans-serif',
                lineHeight: '1.3',
                border: '1px solid #4A5568',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
            },
            STATUS_INDICATOR: {
                ON: { text: 'ON', color: '#4CAF50' },
                OFF: { text: 'OFF', color: '#F44336' }
            }
        }
    };

    // =====================================================================
    // STATE MANAGEMENT
    // =====================================================================

    const State = {
        itemData: [],
        observers: { items: null, body: null, disabledInputs: null },
        disabledInputs: new Map() // Store references to disabled inputs
    };

    // =====================================================================
    // API INTERFACE
    // =====================================================================

    const ApiService = {
        fetchItemCategory: function(category) {
            return new Promise((resolve, reject) => {
                if (typeof GM_xmlhttpRequest === 'undefined') {
                    console.error('GM_xmlhttpRequest is not available');
                    reject(new Error('GM_xmlhttpRequest is not defined'));
                    return;
                }

                const apiKey = CONFIG.getApiKey();
                const url = `${CONFIG.API_BASE_URL}?cat=${category}&sort=ASC`;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `ApiKey ${apiKey}`
                    },
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data && data.items) {
                                resolve(data.items);
                            } else {
                                console.error('API response does not contain items:', response.responseText);
                                reject(new Error('Invalid data format from API'));
                            }
                        } catch (error) {
                            console.error('Error parsing API response:', response.responseText, error);
                            reject(error);
                        }
                    },
                    onerror: function(error) {
                        console.error('GM_xmlhttpRequest error:', error);
                        reject(error);
                    }
                });
            });
        },

        fetchAllItemData: function() {
            // Check if API key is set
            const apiKey = CONFIG.getApiKey();
            if (!apiKey) {
                const cachedData = localStorage.getItem(CONFIG.STORAGE_KEYS.ITEM_DATA);
                if (cachedData) {
                    try {
                        State.itemData = JSON.parse(cachedData);
                        return Promise.resolve(State.itemData);
                    } catch (error) {
                        console.error('Error parsing cached data:', error);
                        return Promise.resolve([]);
                    }
                }
                return Promise.resolve([]);
            }

            // Check for cached data
            const cachedData = localStorage.getItem(CONFIG.STORAGE_KEYS.ITEM_DATA);
            const lastRequestTime = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_REQUEST_TIME);
            const currentTime = Date.now();

            if (cachedData && lastRequestTime && cachedData !== "[]") {
                const timeSinceLastRequest = currentTime - parseInt(lastRequestTime, 10);
                if (timeSinceLastRequest < CONFIG.CACHE_DURATION) {
                    try {
                        State.itemData = JSON.parse(cachedData);
                        return Promise.resolve(State.itemData);
                    } catch (error) {
                        console.error('Error parsing cached data:', error);
                    }
                }
            }

            // Fetch new data
            const fetchPromises = CONFIG.ITEM_CATEGORIES.map(category =>
                this.fetchItemCategory(category)
                    .then(items => {
                        const simplifiedItems = items.map(item => ({
                            name: item.name,
                            effect: item.effect
                        }));
                        State.itemData = [...State.itemData, ...simplifiedItems];
                        return simplifiedItems;
                    })
                    .catch(error => {
                        console.error(`Error fetching ${category} items:`, error);
                        return [];
                    })
            );

            return Promise.all(fetchPromises).then(() => {
                // Save to localStorage
                try {
                    localStorage.setItem(CONFIG.STORAGE_KEYS.ITEM_DATA, JSON.stringify(State.itemData));
                    localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_REQUEST_TIME, currentTime.toString());
                } catch (error) {
                    console.error('Error saving to localStorage:', error);
                }
                return State.itemData;
            });
        }
    };

    // =====================================================================
    // DOM UTILITIES
    // =====================================================================

    const DomUtils = {
        find: {
            itemContainers: function() {
                const containers = [];
                const allItemsList = document.querySelector(CONFIG.SELECTORS.ALL_ITEMS);
                if (allItemsList) containers.push(allItemsList);
                const sellItemsWrap = document.querySelector(CONFIG.SELECTORS.SELL_ITEMS_WRAP);
                if (sellItemsWrap) containers.push(sellItemsWrap);
                return containers;
            },

            listItems: function() {
                const containers = this.itemContainers();
                let items = [];
                containers.forEach(container => {
                    const containerItems = Array.from(container.getElementsByTagName('li'));
                    items = [...items, ...containerItems];
                });
                return items;
            },

            navigationContainer: function() {
                return document.querySelector(CONFIG.SELECTORS.CONTENT_TITLE_LINKS);
            }
        },

        create: {
            warningSign: function(effectText) {
                const warningSign = document.createElement('span');
                warningSign.className = 'warning-sign';
                Object.assign(warningSign.style, CONFIG.STYLES.WARNING_SIGN);
                warningSign.innerHTML = '⚠️';

                const tooltip = this.tooltip(effectText);
                warningSign.appendChild(tooltip);

                warningSign.addEventListener('mouseenter', function() {
                    tooltip.style.display = 'block';
                    const rect = warningSign.getBoundingClientRect();
                    const isLongText = (tooltip.textContent || '').length > 50;
                    tooltip.style.left = '0px';
                    tooltip.style.top = isLongText ? '-45px' : '-30px';

                    setTimeout(() => {
                        const tooltipRect = tooltip.getBoundingClientRect();
                        if (tooltipRect.left < 0) tooltip.style.left = '5px';
                        if (tooltipRect.top < 0) tooltip.style.top = '20px';
                    }, 0);
                });

                warningSign.addEventListener('mouseleave', function() {
                    tooltip.style.display = 'none';
                });

                return warningSign;
            },

            tooltip: function(content) {
                const tooltip = document.createElement('div');
                tooltip.className = 'item-effect-tooltip';
                tooltip.setAttribute('role', 'tooltip');
                Object.assign(tooltip.style, CONFIG.STYLES.TOOLTIP);
                tooltip.textContent = content;
                return tooltip;
            },

            toggleButton: function() {
                const toggleButton = document.createElement('a');
                toggleButton.id = CONFIG.ELEMENT_IDS.WARNINGS_TOGGLE;
                toggleButton.className = 'warnings-toggle t-clear h c-pointer m-icon line-h24 right';
                toggleButton.setAttribute('aria-labelledby', 'warnings-toggle-label');

                const savedState = localStorage.getItem(CONFIG.STORAGE_KEYS.WARNING_STATE);
                const isActive = savedState !== null ? savedState === 'true' : true;

                if (isActive) {
                    toggleButton.classList.add('top-page-link-button--active');
                    toggleButton.classList.add('active');
                }

                toggleButton.innerHTML = `
                    <span class="icon-wrap svg-icon-wrap">
                        <span class="link-icon-svg warnings-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16">
                                <defs>
                                    <style>.cls-1{opacity:0.35;}.cls-2{fill:#fff;}.cls-3{fill:#777;}</style>
                                </defs>
                                <g>
                                    <g>
                                        <g class="cls-1">
                                            <path class="cls-2" d="M7.5,1 L15,15 L0,15 Z"></path>
                                        </g>
                                        <path class="cls-3" d="M7.5,0 L15,14 L0,14 Z"></path>
                                        <path class="cls-3" d="M7,6 L8,6 L8,10 L7,10 Z" style="fill:#fff"></path>
                                        <circle class="cls-3" cx="7.5" cy="12" r="1" style="fill:#fff"></circle>
                                    </g>
                                </g>
                            </svg>
                        </span>
                    </span>
                    <span id="warnings-toggle-label">Item Safety:</span>
                `;

                const statusIndicator = document.createElement('span');
                statusIndicator.id = CONFIG.ELEMENT_IDS.WARNINGS_STATUS;
                statusIndicator.style.marginLeft = '5px';
                statusIndicator.style.fontWeight = 'bold';
                statusIndicator.textContent = isActive ? CONFIG.STYLES.STATUS_INDICATOR.ON.text : CONFIG.STYLES.STATUS_INDICATOR.OFF.text;
                statusIndicator.style.color = isActive ? CONFIG.STYLES.STATUS_INDICATOR.ON.color : CONFIG.STYLES.STATUS_INDICATOR.OFF.color;
                toggleButton.appendChild(statusIndicator);

                return toggleButton;
            }
        }
    };

    // =====================================================================
    // INPUT PROTECTION FUNCTIONALITY
    // =====================================================================

    const InputProtection = {
        setupDisabledInputsObserver: function() {
            // Create a MutationObserver to watch for changes to disabled inputs
            const observerConfig = {
                attributes: true,
                attributeFilter: ['disabled', 'value'],
                subtree: true
            };

            State.observers.disabledInputs = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    const element = mutation.target;

                    // Check if warnings are enabled before applying protection
                    const warningsEnabled = localStorage.getItem(CONFIG.STORAGE_KEYS.WARNING_STATE) !== 'false';
                    if (!warningsEnabled) return;

                    // Handle disabled attribute changes
                    if (mutation.attributeName === 'disabled') {
                        if (!element.disabled && element.dataset.disabledByWarning === 'true') {
                            // Element was disabled by our script but something tried to enable it
                            // Re-disable it
                            element.disabled = true;
                        }
                    }

                    // Handle value changes on disabled inputs
                    if (mutation.attributeName === 'value' && element.disabled && element.dataset.disabledByWarning === 'true') {
                        // Reset value to 0 if it was changed while disabled
                        if (element.value !== '0') {
                            element.value = '0';
                        }
                    }
                });
            });

            document.addEventListener('input', function(e) {
                // Check if warnings are enabled before applying protection
                const warningsEnabled = localStorage.getItem(CONFIG.STORAGE_KEYS.WARNING_STATE) !== 'false';
                if (!warningsEnabled) return;

                // For any input events on disabled inputs
                if (e.target.disabled && e.target.dataset.disabledByWarning === 'true') {
                    e.preventDefault();
                    e.stopPropagation();
                    e.target.value = '0';
                }
            }, true);

            // Start observing the entire document
            State.observers.disabledInputs.observe(document.documentElement, observerConfig);
        },

        // Proxy for input properties to intercept changes to disabled inputs
        setupInputPropertyProxy: function() {
            // Store original property descriptors
            const originalValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
            const originalDisabledDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'disabled');

            // Override the value property
            Object.defineProperty(HTMLInputElement.prototype, 'value', {
                set: function(newValue) {
                    // Check if warnings are enabled before applying protection
                    const warningsEnabled = localStorage.getItem(CONFIG.STORAGE_KEYS.WARNING_STATE) !== 'false';

                    if (warningsEnabled && this.disabled && this.dataset.disabledByWarning === 'true') {
                        originalValueDescriptor.set.call(this, '0');
                        return '0';
                    } else {
                        return originalValueDescriptor.set.call(this, newValue);
                    }
                },
                get: function() {
                    return originalValueDescriptor.get.call(this);
                },
                configurable: true
            });

            // Override the disabled property
            Object.defineProperty(HTMLInputElement.prototype, 'disabled', {
                set: function(value) {
                    // Check if warnings are enabled before applying protection
                    const warningsEnabled = localStorage.getItem(CONFIG.STORAGE_KEYS.WARNING_STATE) !== 'false';

                    if (warningsEnabled && !value && this.dataset.disabledByWarning === 'true') {
                        return originalDisabledDescriptor.set.call(this, true);
                    } else {
                        return originalDisabledDescriptor.set.call(this, value);
                    }
                },
                get: function() {
                    return originalDisabledDescriptor.get.call(this);
                },
                configurable: true
            });
        },

        // Method to track new disabled inputs
        trackDisabledInput: function(input) {
            if (input.type === 'text' || input.type === 'number') {
                // Store original value
                input.dataset.originalValue = input.value || '';

                // Set value to 0 for numerical inputs
                if (input.type === 'number' || !isNaN(parseFloat(input.value))) {
                    input.value = '0';
                }
            }

            // Add to our tracking map
            State.disabledInputs.set(input, {
                originalDisabled: input.disabled,
                originalValue: input.dataset.originalValue
            });
        },

        // Method to untrack and restore inputs when warnings are disabled
        restoreInput: function(input) {
            // Restore original value if it exists
            if (input.dataset.originalValue !== undefined) {
                input.value = input.dataset.originalValue;
                delete input.dataset.originalValue;
            }

            // Restore original state
            input.disabled = false;
            input.style.opacity = '';
            input.style.cursor = '';

            delete input.dataset.disabledByWarning;

            if (input.type === 'text' && input.dataset.originalBg !== undefined) {
                input.style.backgroundColor = input.dataset.originalBg;
                delete input.dataset.originalBg;
            }

            // Remove from tracking
            State.disabledInputs.delete(input);
        },

        // Initialize input protection
        init: function() {
            this.setupDisabledInputsObserver();
            this.setupInputPropertyProxy();
        }
    };

    // =====================================================================
    // CORE FUNCTIONALITY
    // =====================================================================

    const ItemEffectsApp = {
        init: function() {
            this.initializeToggleButton();

            // Initialize input protection first
            InputProtection.init();

            ApiService.fetchAllItemData()
                .then(() => {
                    this.processItems();
                    this.setupObservers();
                    this.applyWarningState();  // Changed from applyInitialWarningState to be more general
                })
                .catch(error => {
                    console.error('Failed to fetch item data:', error);
                    this.processItems();
                    this.setupObservers();
                    this.applyWarningState();  // Changed from applyInitialWarningState to be more general
                });
        },

        applyWarningState: function() {
            const savedState = localStorage.getItem(CONFIG.STORAGE_KEYS.WARNING_STATE);
            const isActive = savedState !== null ? savedState === 'true' : true;
            const warningElements = document.querySelectorAll(CONFIG.SELECTORS.WARNING_SIGN);

            warningElements.forEach(warning => {
                const listItem = warning.closest('li[data-item]');
                if (!listItem) return;

                const isItemPage = window.location.href.includes('item.php');

                if (isItemPage) {
                    const deleteButtons = listItem.querySelectorAll('.option-delete');
                    deleteButtons.forEach(button => {
                        if (isActive) {
                            button.disabled = true;
                            button.style.opacity = '0.5';
                            button.style.cursor = 'not-allowed';
                            button.dataset.disabledByWarning = 'true';
                        } else {
                            button.disabled = false;
                            button.style.opacity = '';
                            button.style.cursor = '';
                            delete button.dataset.disabledByWarning;
                        }
                    });
                } else {
                    const inputElements = listItem.querySelectorAll('input, button, select, textarea, a.buy');
                    inputElements.forEach(input => {
                        if (isActive) {
                            if (input.tagName.toLowerCase() === 'a') {
                                input.dataset.originalHref = input.href;
                                input.href = 'javascript:void(0)';
                                input.style.opacity = '0.5';
                                input.style.pointerEvents = 'none';
                            } else {
                                // Store original value before disabling
                                if (input.type === 'text' || input.type === 'number') {
                                    input.dataset.originalValue = input.value || '';
                                }

                                input.disabled = true;
                                input.style.opacity = '0.5';
                                input.style.cursor = 'not-allowed';
                                input.dataset.disabledByWarning = 'true';

                                // Track and protect this disabled input
                                InputProtection.trackDisabledInput(input);

                                if (input.type === 'text') {
                                    input.dataset.originalBg = input.style.backgroundColor;
                                    input.style.backgroundColor = '#e0e0e0';
                                }
                            }
                        } else {
                            if (input.tagName.toLowerCase() === 'a') {
                                if (input.dataset.originalHref) {
                                    input.href = input.dataset.originalHref;
                                }
                                input.style.opacity = '';
                                input.style.pointerEvents = '';
                            } else {
                                // Use the dedicated restore method
                                InputProtection.restoreInput(input);
                            }
                        }
                    });
                }
            });
        },

        processItems: function() {
            const listItems = DomUtils.find.listItems();

            if (listItems.length === 0) return;

            listItems.forEach(item => this.processItemElement(item));

            // After processing items, apply the warning state based on toggle setting
            setTimeout(() => this.applyWarningState(), 0);
        },

        processItemElement: function(itemElement) {
            const nameElement = itemElement.querySelector(CONFIG.SELECTORS.ITEM_NAME);
            if (!nameElement || !nameElement.textContent) return;

            const itemName = nameElement.textContent.trim();
            const matchingItem = State.itemData.find(item => item.name === itemName);

            if (matchingItem && matchingItem.effect && !nameElement.querySelector(CONFIG.SELECTORS.WARNING_SIGN)) {
                const warningSign = DomUtils.create.warningSign(matchingItem.effect);
                nameElement.appendChild(warningSign);
            }
        },

        initializeToggleButton: function() {
            if (document.getElementById(CONFIG.ELEMENT_IDS.WARNINGS_TOGGLE)) {
                return;
            }

            const navContainer = DomUtils.find.navigationContainer();
            if (!navContainer) {
                if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
                    document.addEventListener('DOMContentLoaded', () => this.initializeToggleButton());
                }
                return;
            }

            const toggleButton = DomUtils.create.toggleButton();
            toggleButton.addEventListener('click', this.toggleWarnings);
            navContainer.appendChild(toggleButton);
        },

        toggleWarnings: function() {
            this.classList.toggle('top-page-link-button--active');
            this.classList.toggle('active');

            const warningsEnabled = this.classList.contains('active');
            localStorage.setItem(CONFIG.STORAGE_KEYS.WARNING_STATE, warningsEnabled);

            const statusIndicator = document.getElementById(CONFIG.ELEMENT_IDS.WARNINGS_STATUS);
            statusIndicator.textContent = warningsEnabled ? CONFIG.STYLES.STATUS_INDICATOR.ON.text : CONFIG.STYLES.STATUS_INDICATOR.OFF.text;
            statusIndicator.style.color = warningsEnabled ? CONFIG.STYLES.STATUS_INDICATOR.ON.color : CONFIG.STYLES.STATUS_INDICATOR.OFF.color;

            // Use the general applyWarningState method instead of duplicating logic here
            ItemEffectsApp.applyWarningState();
        },

        setupObservers: function() {
            const itemContainers = DomUtils.find.itemContainers();
            State.observers.items = new MutationObserver(mutations => {
                let newItemsAdded = false;
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        newItemsAdded = true;
                    }
                });
                if (newItemsAdded) {
                    this.processItems();
                    // Apply warning state after new items are processed
                    this.applyWarningState();
                }
            });

            if (itemContainers.length > 0) {
                itemContainers.forEach(container => {
                    State.observers.items.observe(container, CONFIG.OBSERVER_CONFIG);
                });
            } else {
                this.setupBodyObserver();
            }
        },

        setupBodyObserver: function() {
            State.observers.body = new MutationObserver(mutations => {
                const itemContainers = DomUtils.find.itemContainers();
                if (itemContainers.length > 0) {
                    itemContainers.forEach(container => {
                        State.observers.items.observe(container, CONFIG.OBSERVER_CONFIG);
                    });
                    this.processItems();
                    this.initializeToggleButton();
                    // Apply warning state after container is found
                    this.applyWarningState();
                    State.observers.body.disconnect();
                }
            });
            State.observers.body.observe(document.body, CONFIG.OBSERVER_CONFIG);
        }
    };

    // =====================================================================
    // INITIALIZATION
    // =====================================================================

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        ItemEffectsApp.init();
    } else {
        document.addEventListener('DOMContentLoaded', () => ItemEffectsApp.init());
    }

    window.TornItemEffects = {
        processItems: () => ItemEffectsApp.processItems(),
        toggleWarnings: () => {
            const warningToggleButton = document.getElementById(CONFIG.ELEMENT_IDS.WARNINGS_TOGGLE);
            if (warningToggleButton) warningToggleButton.click();
        }
    };
})();
