// ==UserScript==
// @name         MasteringPhysics Extractor
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Extract problems from MasteringPhysics (single or full assignment) with progress bar and save as JSON
// @author       You & AI Assistant
// @match        https://session.physics-mastering.pearson.com/myct/itemView*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530885/MasteringPhysics%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/530885/MasteringPhysics%20Extractor.meta.js
// ==/UserScript==

/**
 * MasteringPhysics Extractor - Extract problems into a JSON file
 *
 * Features:
 * - Extract single problems or entire assignments
 * - Properly handles MathJax and scientific notation
 * - Preserves figures and complex question types (MCQ, ranking)
 * - Includes progress tracking with cancellation option
 * - Robust error handling and navigation
 * - User-configurable options
 *
 * @version 3.0.0
 */
(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        // Data storage keys
        STORAGE_KEY: 'masteringPhysicsExtractionData',
        EXTRACTION_IN_PROGRESS_KEY: 'masteringPhysicsExtractionInProgress',
        CONFIG_STORAGE_KEY: 'masteringPhysicsExtractorConfig',

        // UI identifiers
        PROGRESS_BAR_ID: 'mp-extractor-progress-bar',
        BUTTON_CONTAINER_ID: 'mp-extractor-button-container',

        // Default settings (can be overridden by user)
        defaults: {
            debugMode: false,                 // Enable verbose logging
            navigationTimeout: 15000,         // Max wait time for navigation elements (ms)
            extractionDelay: 500,             // Delay between extraction steps (ms)
            buttonPosition: 'bottom-right',   // Position of control buttons
            showProgressText: true,           // Show detailed progress text
            downloadFormat: 'json',           // Download format (only json for now)
            theme: {                          // UI theme colors
                extractButton: '#007bff',
                assignmentButton: '#28a745',
                cancelButton: '#dc3545',
                progressBar: '#4CAF50',
                progressBackground: '#555'
            }
        },

        // Version information
        VERSION: '3.0.0',
        DATA_FORMAT_VERSION: '1.0'
    };

    // --- Logger ---
    const Logger = {
        _enabled: true,
        _debugMode: CONFIG.defaults.debugMode,

        /**
         * Initialize logger with settings
         * @param {boolean} enabled - Enable/disable logging
         * @param {boolean} debugMode - Enable verbose debug logs
         */
        init(enabled = true, debugMode = false) {
            this._enabled = enabled;
            this._debugMode = debugMode;
            this.log('Logger initialized', { enabled, debugMode });
        },

        /**
         * Log a message to console
         * @param {string} message - Message to log
         * @param {*} [data] - Optional data to log
         */
        log(message, data) {
            if (!this._enabled) return;
            if (data !== undefined) {
                console.log(`MP Extractor: ${message}`, data);
            } else {
                console.log(`MP Extractor: ${message}`);
            }
        },

        /**
         * Log a debug message (only shown in debug mode)
         * @param {string} message - Message to log
         * @param {*} [data] - Optional data to log
         */
        debug(message, data) {
            if (!this._enabled || !this._debugMode) return;
            if (data !== undefined) {
                console.debug(`MP Extractor [DEBUG]: ${message}`, data);
            } else {
                console.debug(`MP Extractor [DEBUG]: ${message}`);
            }
        },

        /**
         * Log a warning message
         * @param {string} message - Message to log
         * @param {*} [data] - Optional data to log
         */
        warn(message, data) {
            if (!this._enabled) return;
            if (data !== undefined) {
                console.warn(`MP Extractor [WARNING]: ${message}`, data);
            } else {
                console.warn(`MP Extractor [WARNING]: ${message}`);
            }
        },

        /**
         * Log an error message
         * @param {string} message - Message to log
         * @param {Error|*} [error] - Optional error to log
         */
        error(message, error) {
            if (!this._enabled) return;
            if (error !== undefined) {
                console.error(`MP Extractor [ERROR]: ${message}`, error);
            } else {
                console.error(`MP Extractor [ERROR]: ${message}`);
            }
        }
    };

    // --- Storage Service ---
    const StorageService = {
        /**
         * Get an item from storage
         * @param {string} key - Storage key
         * @param {*} defaultValue - Default value if not found
         * @returns {Promise<*>} - Stored value or default
         */
        async getItem(key, defaultValue = null) {
            try {
                const value = await GM_getValue(key, defaultValue);
                Logger.debug(`Retrieved from storage: ${key}`, value);
                return value;
            } catch (error) {
                Logger.error(`Failed to get item from storage: ${key}`, error);
                return defaultValue;
            }
        },

        /**
         * Save an item to storage
         * @param {string} key - Storage key
         * @param {*} value - Value to store
         * @returns {Promise<boolean>} - Success status
         */
        async setItem(key, value) {
            try {
                await GM_setValue(key, value);
                Logger.debug(`Saved to storage: ${key}`, value);
                return true;
            } catch (error) {
                Logger.error(`Failed to save item to storage: ${key}`, error);
                return false;
            }
        },

        /**
         * Remove an item from storage
         * @param {string} key - Storage key
         * @returns {Promise<boolean>} - Success status
         */
        async removeItem(key) {
            try {
                await GM_deleteValue(key);
                Logger.debug(`Removed from storage: ${key}`);
                return true;
            } catch (error) {
                Logger.error(`Failed to remove item from storage: ${key}`, error);
                return false;
            }
        },

        /**
         * Save JSON data to storage
         * @param {string} key - Storage key
         * @param {Object} data - Object to store as JSON
         * @returns {Promise<boolean>} - Success status
         */
        async setJSON(key, data) {
            try {
                const jsonString = JSON.stringify(data);
                return await this.setItem(key, jsonString);
            } catch (error) {
                Logger.error(`Failed to save JSON to storage: ${key}`, error);
                return false;
            }
        },

        /**
         * Get JSON data from storage
         * @param {string} key - Storage key
         * @param {Object} defaultValue - Default value if not found or invalid
         * @returns {Promise<Object>} - Parsed object or default
         */
        async getJSON(key, defaultValue = {}) {
            try {
                const jsonString = await this.getItem(key);
                if (!jsonString) return defaultValue;
                return JSON.parse(jsonString);
            } catch (error) {
                Logger.error(`Failed to parse JSON from storage: ${key}`, error);
                return defaultValue;
            }
        }
    };

    // --- DOM Utilities ---
    const DOMUtils = {
        /**
         * Wait for an element to be available and ready in the DOM
         * @param {string} selector - CSS selector for element
         * @param {number} timeout - Max wait time in ms
         * @returns {Promise<Element>} - Found element
         */
        async waitForElement(selector, timeout = CONFIG.defaults.navigationTimeout) {
            return new Promise((resolve, reject) => {
                const intervalTime = 100;
                let elapsedTime = 0;

                // Check if element already exists
                const existingElement = document.querySelector(selector);
                if (existingElement && existingElement.offsetParent !== null &&
                    !existingElement.disabled && !existingElement.classList.contains('disabled')) {
                    return resolve(existingElement);
                }

                const interval = setInterval(() => {
                    const element = document.querySelector(selector);
                    if (element && element.offsetParent !== null &&
                        !element.disabled && !element.classList.contains('disabled')) {
                        clearInterval(interval);
                        resolve(element);
                    } else {
                        elapsedTime += intervalTime;
                        if (elapsedTime >= timeout) {
                            clearInterval(interval);
                            reject(new Error(`Element "${selector}" not found/ready within ${timeout}ms`));
                        }
                    }
                }, intervalTime);
            });
        },

        /**
         * Get the current navigation state of the app
         * @returns {Object} Navigation state object
         */
        getNavigationState() {
            const navPosElement = document.querySelector('#navigation .pos');
            const nextLink = document.querySelector('#next-item-link');
            const prevLinkDisabled = document.querySelector('#navigation .nav-circle.prev.disabled');

            let current = 0, total = 0, isLast = true, isFirst = true, hasNext = false;

            if (navPosElement) {
                const posText = navPosElement.textContent.trim();
                const match = posText.match(/(\d+)\s+of\s+(\d+)/);

                if (match) {
                    current = parseInt(match[1], 10);
                    total = parseInt(match[2], 10);
                    hasNext = !!nextLink && !nextLink.classList.contains('disabled');
                    isLast = current === total || !hasNext;
                    isFirst = current === 1 || !!prevLinkDisabled;
                } else {
                    Logger.warn("Could not parse navigation position:", posText);
                    current = 1;
                    total = 1;
                }
            } else {
                Logger.warn("Navigation position element not found.");
                current = 1;
                total = 1;
            }

            return { current, total, isLast, isFirst, hasNext };
        },

        /**
         * Create an HTML element with properties
         * @param {string} tag - Element tag name
         * @param {Object} props - Element properties
         * @param {Object} styles - CSS styles to apply
         * @param {HTMLElement[]} children - Child elements to append
         * @returns {HTMLElement} Created element
         */
        createElement(tag, props = {}, styles = {}, children = []) {
            const element = document.createElement(tag);

            // Apply properties
            Object.entries(props).forEach(([key, value]) => {
                if (key === 'textContent') {
                    element.textContent = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value;
                } else if (key === 'className') {
                    element.className = value;
                } else if (key === 'events') {
                    Object.entries(value).forEach(([event, handler]) => {
                        element.addEventListener(event, handler);
                    });
                } else {
                    element.setAttribute(key, value);
                }
            });

            // Apply styles
            Object.assign(element.style, styles);

            // Append children
            children.forEach(child => element.appendChild(child));

            return element;
        }
    };

    // --- Text Processing Utilities ---
    const TextUtils = {
        /**
         * Process scientific notation in an element
         * @param {HTMLElement} element - Element to process
         */
        processScientificNotation(element) {
            if (!element) return;

            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
            const nodesToProcess = [];
            let currentNode;

            // Find text nodes with scientific notation
            while ((currentNode = walker.nextNode())) {
                if (currentNode.textContent.match(/\d+(\.\d+)?\s*[×xX]\s*10/)) {
                    nodesToProcess.push(currentNode);
                }
            }

            // Process each text node
            nodesToProcess.forEach(node => {
                let nextElement = node.nextSibling;

                // Find the next element sibling
                while (nextElement && nextElement.nodeType !== Node.ELEMENT_NODE) {
                    nextElement = nextElement.nextSibling;
                }

                // Handle superscript exponent
                if (nextElement && nextElement.tagName === 'SUP') {
                    const exponent = nextElement.textContent.trim();
                    const text = node.textContent;
                    const match = text.match(/(\d+(?:\.\d+)?)\s*[×xX]\s*10$/);

                    if (match) {
                        const newText = text.replace(/(\d+(?:\.\d+)?)\s*[×xX]\s*10$/, `$1 × 10^{${exponent}}`);
                        node.textContent = newText;

                        if (nextElement.parentNode) {
                            try {
                                nextElement.parentNode.removeChild(nextElement);
                            } catch (e) {
                                Logger.warn("Could not remove sup element:", e);
                            }
                        }
                    }
                } else {
                    // Normalize existing notation
                    const text = node.textContent;
                    const newText = text.replace(/(\d+(?:\.\d+)?)\s*[×xX]\s*10\^\{(-?\d+)\}/g, '$1 × 10^{$2}');

                    if (newText !== text) {
                        node.textContent = newText;
                    }
                }
            });
        },

        /**
         * Process MathJax elements and replace with LaTeX
         * @param {HTMLElement} element - Element containing MathJax
         * @returns {string} - Processed text with LaTeX notations
         */
        processMathJax(element) {
            if (!element) return '';

            const mathMap = new Map();
            const mathScripts = element.querySelectorAll('script[type="math/tex"]');

            // Map placeholders to LaTeX content
            mathScripts.forEach((script, index) => {
                const placeholder = `__MATH_PLACEHOLDER_${index}__`;
                mathMap.set(placeholder, script.textContent.trim());

                const span = document.createElement('span');
                span.textContent = placeholder;

                try {
                    if (script.parentNode) {
                        script.parentNode.replaceChild(span, script);
                    }
                } catch(e) {
                    Logger.warn("Could not replace MathJax script:", e);
                }
            });

            // Remove MathJax rendered elements
            const mathJaxElements = element.querySelectorAll('.MathJax_Preview, .MathJax');
            mathJaxElements.forEach(el => el.remove());

            // Extract text content and replace placeholders with LaTeX
            let text = element.textContent || '';

            mathMap.forEach((latex, placeholder) => {
                const regex = new RegExp(placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
                text = text.replace(regex, `$${latex}$`);
            });

            // Clean up text formatting
            text = text
                .replace(/(\d+(?:\.\d+)?)\s*[×xX]\s*10\s*\^\s*\{(-?\d+)\}/g, '$1 × 10^{$2}')
                .replace(/(\d+(?:\.\d+)?)\s*[×xX]\s*10\s*\^\s*(-?\d+)/g, '$1 × 10^{$2}')
                .replace(/\s{2,}/g, ' ')
                .trim();

            return text;
        },

        /**
         * Extract text with proper MathJax/LaTeX handling
         * @param {HTMLElement} element - Element to extract text from
         * @returns {string} - Extracted text with LaTeX
         */
        extractTextWithMathJax(element) {
            if (!element) return '';

            const clone = element.cloneNode(true);
            this.processScientificNotation(clone);
            return this.processMathJax(clone);
        }
    };

    // --- Content Extractors ---
    const ContentExtractors = {
        /**
         * Extract the introduction text
         * @returns {string} - Extracted introduction
         */
        extractIntroduction() {
            const introElement = document.querySelector('.introduction.edible');
            return introElement ? TextUtils.extractTextWithMathJax(introElement) : "";
        },

        /**
         * Extract figures from the problem
         * @returns {Array<Object>} - Array of figure objects
         */
        extractFigures() {
            const figures = [];
            const flipperElement = document.querySelector('.flipper');

            if (!flipperElement) return figures;

            const figureCountText = flipperElement.querySelector('#itemcount')?.textContent;
            const figureCount = figureCountText ? parseInt(figureCountText.trim(), 10) : 0;
            const mediaElements = flipperElement.querySelectorAll('.media');

            mediaElements.forEach((media, index) => {
                const imageElement = media.querySelector('img');

                if (imageElement) {
                    figures.push({
                        index: index + 1,
                        totalFigures: figureCount,
                        src: imageElement.getAttribute('src') || '',
                        alt: imageElement.getAttribute('alt') || '',
                        title: imageElement.getAttribute('title') || ''
                    });
                }
            });

            return figures;
        },

        /**
         * Extract ranking items from a problem
         * @param {HTMLElement} problemElement - Problem container element
         * @returns {Object|null} - Ranking items data or null if not present
         */
        extractRankingItems(problemElement) {
            const rankingElement = problemElement.querySelector('.solutionAppletRanking');

            if (!rankingElement) return null;

            const items = [];
            const rankItems = problemElement.querySelectorAll('.rank-item');

            rankItems.forEach(item => {
                const mathScript = item.querySelector('script[type="math/tex"]');

                if (mathScript && mathScript.textContent) {
                    items.push({ text: `$${mathScript.textContent.trim()}$` });
                } else {
                    items.push({ text: TextUtils.extractTextWithMathJax(item).trim() });
                }
            });

            let largestText = 'Largest', smallestText = 'Smallest';
            const preText = problemElement.querySelector('.rank-pre-text');
            const postText = problemElement.querySelector('.rank-post-text');

            if (preText) largestText = TextUtils.extractTextWithMathJax(preText).trim();
            if (postText) smallestText = TextUtils.extractTextWithMathJax(postText).trim();

            return { items, directions: { largest: largestText, smallest: smallestText } };
        },

        /**
         * Extract multiple choice options from a problem
         * @param {HTMLElement} problemElement - Problem container element
         * @returns {Array<Object>|null} - Multiple choice options or null if not present
         */
        extractMultipleChoice(problemElement) {
            const multipleChoiceElement = problemElement.querySelector('.solutionMultipleChoiceRadio');

            if (!multipleChoiceElement) return null;

            const choices = [];
            const optionContainers = multipleChoiceElement.querySelectorAll('table.tidy-options > tbody > tr.grouper');

            if (optionContainers.length === 0) {
                // Fallback for simpler layouts
                const simpleOptions = multipleChoiceElement.querySelectorAll('.option-label');

                if (simpleOptions.length > 0) {
                    Logger.debug("Using fallback MC extractor for simple options.");

                    simpleOptions.forEach((option, index) => {
                        choices.push({
                            index: index + 1,
                            text: TextUtils.extractTextWithMathJax(option).trim()
                        });
                    });

                    return choices.length > 0 ? choices : null;
                } else {
                    return null;
                }
            }

            // Process table rows for complex layouts
            optionContainers.forEach((container, index) => {
                const choiceData = { index: index + 1 };
                const label = container.querySelector('label.option-label');

                if (!label) {
                    Logger.warn("MC option container missing label:", container);
                    return;
                }

                // Extract figure if present
                const imageElement = label.querySelector('img');
                if (imageElement) {
                    choiceData.figure = {
                        src: imageElement.getAttribute('src') || '',
                        alt: imageElement.getAttribute('alt') || '',
                        title: imageElement.getAttribute('title') || ''
                    };
                }

                // Extract text (excluding figure)
                const labelClone = label.cloneNode(true);
                const imageInClone = labelClone.querySelector('img');

                if (imageInClone) {
                    imageInClone.remove();
                }

                const textContent = TextUtils.extractTextWithMathJax(labelClone).trim();

                if (textContent) {
                    choiceData.text = textContent;
                }

                // Add choice if it has either text or figure
                if (choiceData.figure || choiceData.text) {
                    choices.push(choiceData);
                } else {
                    Logger.warn("MC option label yielded no text or figure:", label);
                }
            });

            return choices.length > 0 ? choices : null;
        },

        /**
         * Extract units from a problem
         * @param {HTMLElement} problemElement - Problem container element
         * @returns {string} - Unit text
         */
        extractUnit(problemElement) {
            const postTextDiv = problemElement.querySelector('.postTextDiv');
            return postTextDiv ? TextUtils.extractTextWithMathJax(postTextDiv).trim() : '';
        },

        /**
         * Extract data for a single problem part
         * @param {HTMLElement} problemElement - Problem part container
         * @returns {Object} - Problem part data
         */
        extractProblemPart(problemElement) {
            const partLabel = problemElement.querySelector('.autolabel')?.textContent.trim() || 'Unknown Part';
            const questionElement = problemElement.querySelector('.text.edible');
            const questionText = questionElement
                ? TextUtils.extractTextWithMathJax(questionElement)
                : 'No question text found';

            const instructionsElement = problemElement.querySelector('.instructions.edible');
            const instructions = instructionsElement
                ? TextUtils.extractTextWithMathJax(instructionsElement)
                : '';

            const equationLabel = problemElement.querySelector('.preTextDiv');
            const equationText = equationLabel
                ? TextUtils.extractTextWithMathJax(equationLabel)
                : '';

            const unit = this.extractUnit(problemElement);
            const multipleChoiceOptions = this.extractMultipleChoice(problemElement);
            const rankingItems = this.extractRankingItems(problemElement);

            const partData = { part: partLabel, question: questionText };

            if (instructions) partData.instructions = instructions;
            if (equationText) partData.equation = equationText;
            if (unit) partData.unit = unit;
            if (multipleChoiceOptions) partData.multipleChoiceOptions = multipleChoiceOptions;
            if (rankingItems) partData.rankingItems = rankingItems;

            return partData;
        },

        /**
         * Extract all problem parts from the current page
         * @returns {Array<Object>} - Array of problem part data
         */
        extractAllProblemParts() {
            const partSections = document.querySelectorAll('.section.part');

            if (partSections.length === 0) {
                const mainProblemArea = document.querySelector('.problem-view');

                if (mainProblemArea) {
                    const singlePart = this.extractProblemPart(mainProblemArea);

                    if (singlePart.question && singlePart.question !== 'No question text found') {
                        if (singlePart.part === 'Unknown Part') singlePart.part = "Part A";
                        return [singlePart];
                    }
                }

                return [];
            }

            return Array.from(partSections).map(section => this.extractProblemPart(section));
        },

        /**
         * Extract all data from the current page
         * @returns {Object} - Complete page data
         */
        extractCurrentPageData() {
            const url = window.location.href;
            const timestamp = new Date().toISOString();
            const navState = DOMUtils.getNavigationState();
            const currentPosition = navState.current > 0 ? navState.current : 'N/A';
            const totalItems = navState.total > 0 ? navState.total : 'N/A';

            return {
                pageUrl: url,
                extractedAt: timestamp,
                position: currentPosition,
                totalItemsInAssignment: totalItems,
                introduction: this.extractIntroduction(),
                figures: this.extractFigures(),
                problemParts: this.extractAllProblemParts()
            };
        }
    };

    // --- Data Export Service ---
    const DataExporter = {
        /**
         * Download data as JSON file
         * @param {Object} data - Data to download
         * @param {string} filename - Filename for the download
         * @returns {Promise<boolean>} - Success status
         */
        async downloadAsJSON(data, filename) {
            try {
                // Add extractor version to metadata
                if (data && typeof data === 'object') {
                    if (!data.metadata) data.metadata = {};
                    data.metadata.extractorVersion = CONFIG.VERSION;
                    data.metadata.dataFormatVersion = CONFIG.DATA_FORMAT_VERSION;
                }

                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.style.display = 'none';

                document.body.appendChild(a);
                a.click();

                Logger.log(`Downloading data as ${filename}`);

                // Clean up
                return new Promise(resolve => {
                    setTimeout(() => {
                        try {
                            if (a.parentNode) document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            Logger.debug("Download link revoked.");
                            resolve(true);
                        } catch(cleanupError) {
                            Logger.warn("Error during download link cleanup:", cleanupError);
                            resolve(false);
                        }
                    }, 200);
                });
            } catch (error) {
                Logger.error("Error during JSON download:", error);
                alert("Error creating download file.");
                return false;
            }
        }
    };

    // --- UI Components ---
    const UI = {
        /**
         * Progress bar component
         */
        ProgressBar: {
            element: null,
            textElement: null,
            barElement: null,
            cancelButton: null,
            controller: null,

            /**
             * Initialize progress bar
             * @param {Object} controller - App controller reference
             * @param {Object} theme - Theme colors
             */
            init(controller, theme) {
                this.controller = controller;
                this.theme = theme;
            },

            /**
             * Show the progress bar
             * @param {number} current - Current progress
             * @param {number} total - Total items
             */
            show(current = 0, total = 1) {
                if (!this.element) this.create();
                this.update(current, total);
                this.element.style.display = 'flex';
                this.controller.setButtonsDisabled(true);
            },

            /**
             * Create the progress bar DOM elements
             */
            create() {
                this.element = DOMUtils.createElement('div',
                    { id: CONFIG.PROGRESS_BAR_ID },
                    {
                        position: 'fixed',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80%',
                        maxWidth: '600px',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        zIndex: '10001',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        fontSize: '14px'
                    }
                );

                this.textElement = DOMUtils.createElement('span',
                    {},
                    { flexGrow: '1', marginRight: '15px' }
                );

                const barContainer = DOMUtils.createElement('div',
                    {},
                    {
                        width: '100px',
                        height: '10px',
                        backgroundColor: this.theme.progressBackground || '#555',
                        borderRadius: '5px',
                        overflow: 'hidden',
                        marginRight: '15px'
                    }
                );

                this.barElement = DOMUtils.createElement('div',
                    {},
                    {
                        width: '0%',
                        height: '100%',
                        backgroundColor: this.theme.progressBar || '#4CAF50',
                        transition: 'width 0.3s ease-in-out'
                    }
                );

                this.cancelButton = DOMUtils.createElement('button',
                    {
                        textContent: 'Cancel',
                        events: { click: () => this.controller.cancelAssignmentExtraction() }
                    },
                    {
                        padding: '5px 10px',
                        backgroundColor: this.theme.cancelButton || '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    }
                );

                barContainer.appendChild(this.barElement);
                this.element.appendChild(this.textElement);
                this.element.appendChild(barContainer);
                this.element.appendChild(this.cancelButton);

                document.body.appendChild(this.element);
            },

            /**
             * Update progress bar status
             * @param {number} current - Current progress
             * @param {number} total - Total items
             */
            update(current, total) {
                if (!this.element || !this.textElement || !this.barElement) return;

                const percentage = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
                this.textElement.textContent = `Extracting Item ${current} of ${total}... (${percentage}%)`;
                this.barElement.style.width = `${percentage}%`;
            },

            /**
             * Hide the progress bar
             */
            hide() {
                if (this.element) this.element.style.display = 'none';
                this.controller.setButtonsDisabled(false);
            },

            /**
             * Remove the progress bar from DOM
             */
            remove() {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                    this.element = null;
                    this.textElement = null;
                    this.barElement = null;
                    this.cancelButton = null;
                }

                this.controller.setButtonsDisabled(false);
            }
        },

        /**
         * Settings dialog component
         */
        SettingsDialog: {
            element: null,
            controller: null,

            /**
             * Initialize settings dialog
             * @param {Object} controller - App controller reference
             */
            init(controller) {
                this.controller = controller;
            },

            /**
             * Show the settings dialog
             */
            show() {
                if (!this.element) this.create();
                this.element.style.display = 'block';
            },

            /**
             * Create the settings dialog DOM elements
             */
            create() {
                // Implementation would go here
                // Creates a dialog with settings options from CONFIG.defaults
                // For brevity, not fully implemented in this version
                alert("Settings functionality will be added in a future version");
            },

            /**
             * Hide the settings dialog
             */
            hide() {
                if (this.element) this.element.style.display = 'none';
            }
        }
    };

    // --- App Controller ---
    class AppController {
        constructor() {
            this.config = { ...CONFIG.defaults };
            this.initialButtons = {};
            this.init();
        }

        /**
         * Initialize the app controller
         */
        async init() {
            Logger.log("Initializing...");

            try {
                // Load user configuration
                const storedConfig = await StorageService.getJSON(CONFIG.CONFIG_STORAGE_KEY);
                if (storedConfig && Object.keys(storedConfig).length > 0) {
                    this.config = { ...this.config, ...storedConfig };
                    Logger.debug("Loaded stored configuration", this.config);
                }

                // Initialize logger with config settings
                Logger.init(true, this.config.debugMode);

                // Initialize UI components
                UI.ProgressBar.init(this, this.config.theme);

                // Register menu commands
                this.registerMenuCommands();

                // Add control buttons
                this.addInitialButtons();

                // Check for ongoing extraction
                setTimeout(async () => {
                    try {
                        const isInProgress = await StorageService.getItem(CONFIG.EXTRACTION_IN_PROGRESS_KEY) === 'true';

                        if (isInProgress) {
                            Logger.log("Continuing assignment extraction...");
                            await this.handleExtractionStep();
                        } else {
                            Logger.log("Ready.");
                            UI.ProgressBar.remove();
                            this.setButtonsDisabled(false);
                        }
                    } catch (error) {
                        Logger.error("Error during init check:", error);
                        alert("Error during script initialization.");
                        await StorageService.removeItem(CONFIG.EXTRACTION_IN_PROGRESS_KEY);
                        UI.ProgressBar.remove();
                        this.setButtonsDisabled(false);
                    }
                }, this.config.extractionDelay);

            } catch (error) {
                Logger.error("Initialization error:", error);
                alert("Failed to initialize MasteringPhysics Extractor.");
            }
        }

        /**
         * Register Tampermonkey menu commands
         */
        registerMenuCommands() {
            if (typeof GM_registerMenuCommand !== 'undefined') {
                GM_registerMenuCommand('Extract Current Problem', () => this.extractSingleProblem());
                GM_registerMenuCommand('Extract Full Assignment', () => this.startAssignmentExtraction());
                GM_registerMenuCommand('About MasteringPhysics Extractor', () => {
                    alert(
                        `MasteringPhysics Extractor v${CONFIG.VERSION}\n\n` +
                        `Extract problems from MasteringPhysics to JSON format.\n\n` +
                        `Use the buttons in the bottom-right corner to extract the current problem or the entire assignment.`
                    );
                });
            }
        }

        /**
         * Add control buttons to the page
         */
        addInitialButtons() {
            if (document.getElementById(CONFIG.BUTTON_CONTAINER_ID)) {
                Logger.log("Buttons already added.");
                return;
            }

            // Container for buttons
            const buttonContainer = DOMUtils.createElement('div',
                { id: CONFIG.BUTTON_CONTAINER_ID },
                {
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: '10000',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }
            );

            // Helper to create a button
            const createButton = (text, color, onClick) => {
                return DOMUtils.createElement('button',
                    {
                        textContent: text,
                        events: { click: onClick }
                    },
                    {
                        padding: '8px 12px',
                        backgroundColor: color,
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13px'
                    }
                );
            };

            // Create and add buttons
            this.initialButtons.single = createButton(
                'Extract This Item',
                this.config.theme.extractButton,
                () => this.extractSingleProblem()
            );

            this.initialButtons.assignment = createButton(
                'Extract Full Assignment',
                this.config.theme.assignmentButton,
                () => this.startAssignmentExtraction()
            );

            buttonContainer.appendChild(this.initialButtons.single);
            buttonContainer.appendChild(this.initialButtons.assignment);

            document.body.appendChild(buttonContainer);
            Logger.log("Extractor buttons added to page.");
        }

        /**
         * Enable/disable control buttons
         * @param {boolean} disabled - Whether buttons should be disabled
         */
        setButtonsDisabled(disabled) {
            Object.values(this.initialButtons).forEach(button => {
                if (button) button.disabled = disabled;
            });
        }

        /**
         * Extract the current problem
         */
        async extractSingleProblem() {
            Logger.log("Extracting single item...");

            try {
                const problemData = ContentExtractors.extractCurrentPageData();

                // Construct metadata for single item download
                const singleItemOutput = {
                    metadata: {
                        url: problemData.pageUrl,
                        extractedAt: problemData.extractedAt,
                        type: 'MasteringPhysics Single Item',
                        position: problemData.position,
                        totalItemsInAssignment: problemData.totalItemsInAssignment,
                        extractorVersion: CONFIG.VERSION,
                        dataFormatVersion: CONFIG.DATA_FORMAT_VERSION
                    },
                    item: problemData
                };

                const filename = `mastering_item_${problemData.position || Date.now()}.json`;
                await DataExporter.downloadAsJSON(singleItemOutput, filename);

                Logger.log("Single item extracted.");
            } catch (error) {
                Logger.error("Error extracting single problem:", error);
                alert("Failed to extract the current problem.");
            }
        }

        /**
         * Start extracting the full assignment
         */
        async startAssignmentExtraction() {
            Logger.log("Starting assignment extraction...");

            try {
                // Check if extraction already in progress
                if (await StorageService.getItem(CONFIG.EXTRACTION_IN_PROGRESS_KEY) === 'true') {
                    alert("An extraction is already in progress.");
                    return;
                }

                // Confirm with user
                if (!confirm("This will navigate through all problems in the assignment. Continue?")) {
                    Logger.log("Assignment extraction cancelled by user.");
                    return;
                }

                // Show progress
                const navState = DOMUtils.getNavigationState();
                UI.ProgressBar.show(navState.current, navState.total);

                // Initialize extraction state
                const initialState = {
                    metadata: {
                        startUrl: window.location.href,
                        extractedAt: new Date().toISOString(),
                        type: 'MasteringPhysics Assignment',
                        extractorVersion: CONFIG.VERSION,
                        dataFormatVersion: CONFIG.DATA_FORMAT_VERSION
                    },
                    items: []
                };

                // Save initial state
                await StorageService.setJSON(CONFIG.STORAGE_KEY, initialState);
                await StorageService.setItem(CONFIG.EXTRACTION_IN_PROGRESS_KEY, 'true');

                Logger.log("Extraction state initialized.");

                // Start extraction
                await this.handleExtractionStep();
            } catch (error) {
                Logger.error("Error starting assignment extraction:", error);
                alert("Failed to initialize extraction. Aborting.");
                UI.ProgressBar.remove();
            }
        }

        /**
         * Handle a single step in the extraction process
         */
        async handleExtractionStep() {
            try {
                // Check if extraction still in progress
                const extractionState = await StorageService.getItem(CONFIG.EXTRACTION_IN_PROGRESS_KEY);

                if (extractionState !== 'true') {
                    Logger.log("Extraction not in progress flag found. Stopping.");
                    UI.ProgressBar.remove();
                    return;
                }

                // Get current navigation state
                const navState = DOMUtils.getNavigationState();
                UI.ProgressBar.show(navState.current, navState.total);

                Logger.log(`Handling extraction step for item: ${navState.current}/${navState.total}`);

                // Extract data from current page
                const currentPageData = ContentExtractors.extractCurrentPageData();
                Logger.log(`Extracted data for item ${currentPageData.position}`);

                // Get and update stored data
                let assignmentData = await StorageService.getJSON(CONFIG.STORAGE_KEY, { metadata: {}, items: [] });

                // Check if this item is already stored
                const exists = assignmentData.items.some(item =>
                    item.position === currentPageData.position &&
                    item.pageUrl === currentPageData.pageUrl
                );

                if (!exists) {
                    assignmentData.items.push(currentPageData);
                    await StorageService.setJSON(CONFIG.STORAGE_KEY, assignmentData);
                    Logger.log(`Added item ${currentPageData.position}. Total stored: ${assignmentData.items.length}`);
                } else {
                    Logger.log(`Item ${currentPageData.position} already stored. Skipping add.`);
                }

                // Re-check navigation state after processing
                const currentNavState = DOMUtils.getNavigationState();
                UI.ProgressBar.update(currentNavState.current, currentNavState.total);

                // Decide next action
                if (!currentNavState.isLast && currentNavState.hasNext) {
                    Logger.log("Attempting navigation...");

                    try {
                        const nextButton = await DOMUtils.waitForElement('#next-item-link', this.config.navigationTimeout);
                        Logger.log("Next button ready. Clicking.");
                        nextButton.click();
                    } catch (navError) {
                        Logger.error("Failed to find/click next button:", navError);
                        alert("Error navigating. Extraction stopped.");
                        await this.finalizeExtraction();
                    }
                } else {
                    Logger.log("Last item reached or cannot navigate.");
                    await this.finalizeExtraction();
                }
            } catch (error) {
                Logger.error("Error in extraction step:", error);
                alert("Error during extraction process. Stopping.");
                await this.finalizeExtraction();
            }
        }

        /**
         * Finalize the extraction process
         */
        async finalizeExtraction() {
            Logger.log("Finalizing extraction...");

            let finalData = null;
            let initialMetadata = {};

            try {
                // Get stored data
                const storedDataString = await StorageService.getItem(CONFIG.STORAGE_KEY);

                if (storedDataString) {
                    finalData = JSON.parse(storedDataString);

                    // Preserve initial metadata
                    if (finalData && finalData.metadata) {
                        initialMetadata = {
                            startUrl: finalData.metadata.startUrl,
                            extractedAt: finalData.metadata.extractedAt,
                            type: finalData.metadata.type,
                            extractorVersion: finalData.metadata.extractorVersion,
                            dataFormatVersion: finalData.metadata.dataFormatVersion
                        };
                    } else {
                        Logger.warn("Metadata missing from stored data during finalization.");

                        if (!finalData) finalData = { items: [] };
                        finalData.metadata = {};
                    }
                }
            } catch (parseError) {
                Logger.error("Failed to parse final stored data. Cannot generate final file.", parseError);
                alert("Error reading final data. Extraction cannot be saved.");

                // Cleanup even on error
                await StorageService.removeItem(CONFIG.STORAGE_KEY);
                await StorageService.removeItem(CONFIG.EXTRACTION_IN_PROGRESS_KEY);
                UI.ProgressBar.remove();
                return;
            }

            // Check if we have items to save
            if (!finalData || !finalData.items || finalData.items.length === 0) {
                Logger.error("Finalizing, but no items found in data!");
                alert("Extraction finished, but no items were collected.");
            } else {
                // Update metadata with final information
                const finalMetadata = {
                    ...initialMetadata,
                    totalItemsExtracted: finalData.items.length,
                    extractionFinishedAt: new Date().toISOString()
                };

                finalData.metadata = finalMetadata;

                // Download the file
                const filename = `mastering_assignment_${Date.now()}.json`;
                await DataExporter.downloadAsJSON(finalData, filename);

                Logger.log(`Download initiated for ${finalData.items.length} items.`);
            }

            // Clean up
            try {
                await StorageService.removeItem(CONFIG.STORAGE_KEY);
                await StorageService.removeItem(CONFIG.EXTRACTION_IN_PROGRESS_KEY);
                Logger.log("Storage cleaned up.");
            } catch (cleanupError) {
                Logger.error("Error cleaning storage after finalization:", cleanupError);
            } finally {
                UI.ProgressBar.remove();

                if (finalData && finalData.items && finalData.items.length > 0) {
                    alert(`Assignment extraction complete! ${finalData.items.length} items processed.`);
                }
            }
        }

        /**
         * Cancel the ongoing assignment extraction
         * @param {boolean} confirmFirst - Whether to ask for confirmation
         */
        async cancelAssignmentExtraction(confirmFirst = true) {
            Logger.log("Attempting to cancel extraction...");

            if (confirmFirst && !confirm("Cancel the ongoing assignment extraction?")) {
                Logger.log("Cancellation aborted by user.");
                return;
            }

            try {
                await StorageService.removeItem(CONFIG.STORAGE_KEY);
                await StorageService.removeItem(CONFIG.EXTRACTION_IN_PROGRESS_KEY);

                Logger.log("Assignment extraction cancelled and storage cleaned.");

                if (confirmFirst) {
                    alert("Assignment extraction cancelled.");
                }
            } catch (error) {
                Logger.error("Error cleaning up storage during cancellation:", error);
                alert("Error during cancellation cleanup.");
            } finally {
                UI.ProgressBar.remove();
            }
        }
    }

    // --- Script Initialization ---
    window.addEventListener('load', () => {
        // Check if required Tampermonkey functions are available
        if (typeof GM_setValue === 'undefined' ||
            typeof GM_getValue === 'undefined' ||
            typeof GM_deleteValue === 'undefined') {

            console.error("MP Extractor: GM_* functions not available. Check @grant in userscript header.");
            alert("MP Extractor Error: Tampermonkey API functions not found. Make sure you've installed this script correctly.");
            return;
        }

        // Initialize the controller
        new AppController();
    });
})();