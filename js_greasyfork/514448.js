// ==UserScript==
// @name         Phoning Session
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  Scraper intégré avec toolbar, gestion de session et création de contacts
// @author       CLAUDE.AI & Vincent
// @match        https://www.mixdata.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/514448/Phoning%20Session.user.js
// @updateURL https://update.greasyfork.org/scripts/514448/Phoning%20Session.meta.js
// ==/UserScript==
 
/*
 * LICENCE PROPRIÉTAIRE
 * 
 * Copyright (c) 2024 CLAUDE.AI & Vincent. Tous droits réservés.
 * 
 * Ce logiciel est la propriété exclusive de ses auteurs. Toute utilisation,
 * reproduction, modification ou distribution de ce logiciel, en tout ou en partie,
 * sans l'autorisation écrite expresse des auteurs est strictement interdite.
 * 
 * CE LOGICIEL EST FOURNI "TEL QUEL", SANS GARANTIE D'AUCUNE SORTE, EXPRESSE OU
 * IMPLICITE, Y COMPRIS, MAIS SANS S'Y LIMITER, LES GARANTIES DE QUALITÉ MARCHANDE,
 * D'ADÉQUATION À UN USAGE PARTICULIER ET DE NON-VIOLATION DES DROITS DE PROPRIÉTÉ
 * INTELLECTUELLE. EN AUCUN CAS LES AUTEURS NE SERONT RESPONSABLES DE TOUT DOMMAGE
 * DIRECT, INDIRECT, ACCESSOIRE, SPÉCIAL, EXEMPLAIRE OU CONSÉCUTIF (Y COMPRIS,
 * MAIS SANS S'Y LIMITER, L'ACQUISITION DE BIENS OU SERVICES DE SUBSTITUTION,
 * LA PERTE D'UTILISATION, DE DONNÉES OU DE PROFITS, OU L'INTERRUPTION D'ACTIVITÉ)
 * QUELLE QU'EN SOIT LA CAUSE ET SELON TOUTE THÉORIE DE RESPONSABILITÉ, QUE CE
 * SOIT CONTRACTUELLE, STRICTE OU DÉLICTUELLE (Y COMPRIS LA NÉGLIGENCE OU AUTRE)
 * DÉCOULANT DE QUELQUE MANIÈRE QUE CE SOIT DE L'UTILISATION DE CE LOGICIEL,
 * MÊME SI INFORMÉ DE LA POSSIBILITÉ DE TELS DOMMAGES.
 */
 
(function () {
    'use strict';
 
    /**
     * Utility class for DOM manipulation
     * Provides static methods for creating, modifying and managing DOM elements
     */
    class DOMUtils {
        /**
         * Creates a DOM element with attributes and content
         * @param {string} tag - HTML tag name
         * @param {Object} attributes - Attributes to apply to the element
         * @param {string|HTMLElement} content - Content to insert into the element
         * @returns {HTMLElement} The created element
         * @throws {Error} If tag is invalid or creation fails
         */
        static createElement(tag, attributes = {}, content = '') {
            if (!tag || typeof tag !== 'string') {
                throw new Error('Tag name invalide');
            }
 
            try {
                const element = document.createElement(tag);
 
                // Process attributes
                Object.entries(attributes).forEach(([key, value]) => {
                    if (key === 'style' && typeof value === 'object') {
                        Object.assign(element.style, this.processStyleObject(value));
                    } else if (['class', 'className'].includes(key)) {
                        // Unified CSS class handling
                        element.className = Array.isArray(value) ? value.join(' ') : value;
                    } else {
                        element.setAttribute(key, value);
                    }
                });
 
                // Handle content
                if (content instanceof HTMLElement) {
                    element.appendChild(content);
                } else if (content) {
                    element.textContent = String(content);
                }
 
                return element;
            } catch (error) {
                throw new Error(`Échec de la création de l'élément: ${error.message}`);
            }
        }
 
        /**
         * Converts a style object into valid CSS properties
         * @param {Object} styleObject - Object containing styles
         * @returns {Object} Processed style object
         * @private
         */
        static processStyleObject(styleObject) {
            return Object.entries(styleObject).reduce((styles, [prop, value]) => {
                // Convert camelCase to kebab-case for CSS
                const cssProperty = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
                styles[cssProperty] = value;
                return styles;
            }, {});
        }
 
        /**
         * Creates an element with event handlers attached
         * @param {string} tag - HTML tag name
         * @param {Object} attributes - Attributes to apply
         * @param {Object} events - Events to attach {eventName: handler}
         * @param {string|HTMLElement} content - Content to insert
         * @returns {HTMLElement} Created element with attached events
         */
        static createElementWithEvents(tag, attributes = {}, events = {}, content = '') {
            const element = this.createElement(tag, attributes, content);
 
            Object.entries(events)
                .filter(([_, handler]) => typeof handler === 'function')
                .forEach(([event, handler]) => element.addEventListener(event, handler));
 
            return element;
        }
 
        /**
         * Safely removes an element from the DOM
         * @param {HTMLElement} element - Element to remove
         * @returns {boolean} true if element was removed, false otherwise
         */
        static removeElement(element) {
            return !!(element?.parentNode?.removeChild(element));
        }
 
        /**
         * Checks if an element is visible in the viewport
         * @param {HTMLElement} element - Element to check
         * @returns {boolean} true if element is visible
         */
        static isElementVisible(element) {
            if (!element) return false;
 
            const rect = element.getBoundingClientRect();
            const viewHeight = window.innerHeight || document.documentElement.clientHeight;
            const viewWidth = window.innerWidth || document.documentElement.clientWidth;
 
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= viewHeight &&
                rect.right <= viewWidth
            );
        }
    }
 
    /**
     * Manages and tracks statistics for phoning sessions
     * Handles saving, loading, and displaying session metrics
     */
    class SessionStats {
        /**
         * Initialize session statistics with default values
         * Loads existing stats if available
         */
        constructor() {
            this.stats = {
                startTime: null,
                endTime: null,
                date: null,
                success: 0,
                recall: 0,
                failed: 0
            };
 
            // Label IDs for different call outcomes
            this.LABEL_IDS = {
                SUCCESS: "5b70eac0-93c2-11ef-b9e9-835b97d1b293",
                RECALL: "5ebba8f0-93c2-11ef-b9e9-835b97d1b293",
                FAILED: "62990a30-93c2-11ef-b9e9-835b97d1b293"
            };
 
            this.loadStats();
        }
 
        /**
         * Loads saved statistics from persistent storage
         * @private
         */
        loadStats() {
            const savedStats = GM_getValue('currentSessionStats', null);
            if (savedStats) {
                this.stats = JSON.parse(savedStats);
            }
        }
 
        /**
         * Saves current statistics to persistent storage
         * @private
         */
        saveStats() {
            GM_setValue('currentSessionStats', JSON.stringify(this.stats));
        }
 
        /**
         * Initializes a new session with start time and date
         * @param {number} startTime - Session start timestamp
         */
        initialize(startTime) {
            this.stats.startTime = startTime;
            this.stats.date = new Date().toLocaleDateString();
            this.saveStats();
        }
 
        /**
         * Increments statistics based on call outcome
         * @param {string} labelId - ID corresponding to call outcome
         */
        incrementStatByLabelId(labelId) {
            switch (labelId) {
                case this.LABEL_IDS.SUCCESS:
                    this.stats.success++;
                    break;
                case this.LABEL_IDS.RECALL:
                    this.stats.recall++;
                    break;
                case this.LABEL_IDS.FAILED:
                    this.stats.failed++;
                    break;
                default:
                    console.warn('Unrecognized label ID:', labelId);
                    return;
            }
            this.saveStats();
        }
 
        /**
         * Ends the current session and cleans up
         * @param {number} endTime - Session end timestamp
         */
        endSession(endTime) {
            this.stats.endTime = endTime;
            this.saveStats();
            GM_setValue('currentSessionStats', null);
        }
 
        /**
         * Calculates and formats the session duration
         * @returns {string} Formatted duration string (HH:mm:ss)
         */
        getFormattedDuration() {
            const duration = Math.floor((this.stats.endTime - this.stats.startTime) / 1000);
            return PhoningSession.formatDuration(duration);
        }
 
        /**
         * Displays session statistics and sends them to Slack
         * @async
         * @returns {Promise<void>}
         */
        async displayStats() {
            console.group('📊 Session Statistics Display');
 
            try {
                // Get salesperson information
                const currentSalesperson = SettingsDialog.getCurrentSalesperson();
                const salespersonName = currentSalesperson?.name || 'Inconnu';
 
                // Log statistics for debugging
                this.logDebugStats(salespersonName);
 
                // Send stats to Slack
                await this.sendStatsToSlack(salespersonName);
 
            } catch (error) {
                console.error('❌ Error displaying stats:', error);
                if (window.phoningApp?.toolbar) {
                    window.phoningApp.toolbar.showNotification(
                        `Erreur lors de l'affichage des statistiques: ${error.message}`,
                        'error'
                    );
                }
            }
 
            console.groupEnd();
        }
 
        /**
         * Logs debug statistics to console
         * @private
         * @param {string} salespersonName - Name of the salesperson
         */
        logDebugStats(salespersonName) {
            console.log('Complete Statistics:', {
                salesperson: salespersonName,
                date: this.stats.date,
                duration: this.getFormattedDuration(),
                success: this.stats.success,
                recall: this.stats.recall,
                failed: this.stats.failed
            });
        }
 
        /**
         * Sends session statistics to Slack
         * @private
         * @async
         * @param {string} salespersonName - Name of the salesperson
         * @throws {Error} If Slack notification fails
         */
        async sendStatsToSlack(salespersonName) {
            console.log('🎯 Preparing Slack message...');
            const formattedMessage = SlackNotifier.formatSessionStats(this, salespersonName);
 
            console.log('📤 Attempting to send to Slack...');
            const slackResponse = await SlackNotifier.sendToSlack(formattedMessage);
 
            if (slackResponse) {
                console.log('✅ Slack sending successful');
                if (window.phoningApp?.toolbar) {
                    window.phoningApp.toolbar.showNotification(
                        'Statistiques envoyées avec succès à Slack! 🎉',
                        'success'
                    );
                }
            } else {
                throw new Error('Échec de l\'envoi à Slack');
            }
        }
    }
 
    /**
     * Handles scraping and processing of company data from web pages
     * Manages data validation and Pipedrive integration
     */
    class CompanyDataScraper {
        /**
         * Configuration constants for the scraper
         * @private
         */
        static CONFIG = {
            SELECTORS: {
                COMPANY_NAME: '.top-left-company-name .searchResult.enterprise',
                WEBSITE: '.similar_website .website_img a#_thumb-url',
                XPATH_QUERIES: {
                    ADDRESS: "//div[div[contains(text(),'Adresse')]]/div[2]",
                    POSTAL_CODE: "//div[div[contains(text(),'Code postal')]]/div[2]",
                    CITY: "//div[div[contains(text(),'Ville')]]/div[2]",
                    SIRET: "//div[div[contains(text(),'Siret')]]/div[2]",
                    CMS: "//div[@class='in_techno-ecommerce']/span[contains(text(),'CMS')]/following-sibling::text()[1]",
                    NAF: "//div[div[contains(text(),'NAF')]]/div[2]"
                }
            },
            PIPEDRIVE: {
                API_URL: 'https://api.pipedrive.com/v1/organizations',
                CUSTOM_FIELDS: {
                    SIRET: "280a03eec5c78ca581a5841097bc0a662663222b",
                    WEBSITE: "e99cc8642b43e114a922f06dd816279b64ad4d45",
                    CMS: "efc4da119de1131a5d3b94fbd97fc4c00d5fead5",
                    NAF: "b402b8f86f9f51899aee9bec52037239c69cf61d"
                }
            },
            DEFAULT_VALUES: {
                VISIBILITY: "3"
            },
            RATE_LIMIT: {
                MIN_INTERVAL: 1000
            }
        };
 
        /**
         * Initialize the scraper with toolbar and configurations
         * @param {PhoningSessionToolbar} toolbar - Reference to the main toolbar
         */
        constructor(toolbar) {
            this.toolbar = toolbar;
            this.rateLimiter = {
                lastRequest: 0,
                minInterval: CompanyDataScraper.CONFIG.RATE_LIMIT.MIN_INTERVAL
            };
        }
 
        /**
         * Retrieves the Pipedrive API token from local storage
         * @private
         * @async
         * @returns {Promise<string|null>} The API token or null if not found
         */
        async getApiToken() {
            const token = localStorage.getItem('pipedriveApiKey');
            if (!token) {
                this.toolbar.showNotification(
                    'API Key manquante. Veuillez configurer vos paramètres.',
                    'error'
                );
                return null;
            }
            return token;
        }
 
        /**
         * Validates required company data fields
         * @private
         * @param {Object} data - Company data to validate
         * @returns {boolean} True if data is valid
         * @throws {Error} If validation fails
         */
        validateCompanyData(data) {
            const requiredFields = ['companyName', 'siret'];
            const missingFields = requiredFields.filter(field => !data[field]);
 
            if (missingFields.length > 0) {
                throw new Error(`Champs requis manquants: ${missingFields.join(', ')}`);
            }
 
            if (!/^\d{14}$/.test(data.siret.replace(/\s/g, ''))) {
                throw new Error('Format SIRET invalide');
            }
 
            return true;
        }
 
        /**
         * Sanitizes company data for safety and consistency
         * @private
         * @param {Object} data - Raw company data
         * @returns {Object} Sanitized company data
         */
        sanitizeData(data) {
            return {
                companyName: this.sanitizeString(data.companyName).toUpperCase(),
                address: this.sanitizeString(data.address),
                siret: this.sanitizeString(data.siret).replace(/\s/g, ''),
                website: this.sanitizeUrl(data.website),
                cms: this.sanitizeString(data.cms),
                naf: this.sanitizeString(data.naf)
            };
        }
 
        /**
         * Sanitizes a string by trimming and removing HTML
         * @private
         * @param {string} str - String to sanitize
         * @returns {string} Sanitized string
         */
        sanitizeString(str) {
            return str ? str.trim().replace(/[<>]/g, '').substring(0, 255) : '';
        }
 
        /**
         * Sanitizes and validates a URL
         * @private
         * @param {string} url - URL to sanitize
         * @returns {string} Sanitized URL or empty string if invalid
         */
        sanitizeUrl(url) {
            if (!url) return '';
            try {
                return new URL(url).toString();
            } catch {
                return '';
            }
        }
 
        /**
         * Implements rate limiting for API requests
         * @private
         * @async
         * @param {string} url - Request URL
         * @param {Object} options - Fetch options
         * @returns {Promise<Response>} Fetch response
         * @throws {Error} If request fails
         */
        async rateLimitedRequest(url, options) {
            const waitTime = Math.max(0,
                this.rateLimiter.lastRequest + this.rateLimiter.minInterval - Date.now()
            );
            await new Promise(resolve => setTimeout(resolve, waitTime));
            this.rateLimiter.lastRequest = Date.now();
 
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response;
        }
 
        /**
         * Gets element by XPath query
         * @private
         * @param {string} xpath - XPath query
         * @returns {Element|null} Found element or null
         */
        getElementByXPath(xpath) {
            try {
                const result = document.evaluate(
                    xpath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                );
                return result.singleNodeValue;
            } catch (error) {
                console.warn(`XPath error for: ${xpath}`, error);
                return null;
            }
        }
 
        /**
         * Safely extracts text content from an element
         * @private
         * @param {Element} element - DOM element
         * @returns {string} Extracted text content or empty string
         */
        extractTextContent(element) {
            return element ? element.textContent.trim() : '';
        }
 
 
        /**
     * Formats full address from components
     * @private
     * @param {string} address - Street address
     * @param {string} postalCode - Postal code
     * @param {string} city - City name
     * @returns {string} Formatted full address
     */
        formatFullAddress(address, postalCode, city) {
            return [address, postalCode, city]
                .filter(part => part?.trim())
                .join(' ');
        }
 
        /**
         * Extracts NAF code from text
         * @private
         * @param {string} nafText - Raw NAF text
         * @returns {string} Extracted NAF code
         */
        extractNafCode(nafText) {
            if (!nafText) return '';
            const match = nafText.match(/\(([^)]+)\)/);
            return match ? match[1] : nafText.trim();
        }
 
        /**
         * Extracts website URL from the page
         * @private
         * @returns {string} Website URL or empty string
         */
        extractWebsite() {
            const websiteElement = document.querySelector(CompanyDataScraper.CONFIG.SELECTORS.WEBSITE);
            return websiteElement?.href?.trim() || '';
        }
 
        /**
         * Scrapes company data from the current page
         * @returns {Object|null} Scraped company data or null if failed
         */
        scrapeData() {
            try {
                const { XPATH_QUERIES } = CompanyDataScraper.CONFIG.SELECTORS;
 
                // Extract address components
                const rawAddress = this.extractTextContent(this.getElementByXPath(XPATH_QUERIES.ADDRESS));
                const postalCode = this.extractTextContent(this.getElementByXPath(XPATH_QUERIES.POSTAL_CODE));
                const city = this.extractTextContent(this.getElementByXPath(XPATH_QUERIES.CITY));
                const nafText = this.extractTextContent(this.getElementByXPath(XPATH_QUERIES.NAF));
 
                const companyData = {
                    companyName: this.extractTextContent(
                        document.querySelector(CompanyDataScraper.CONFIG.SELECTORS.COMPANY_NAME)
                    ).toUpperCase(), // Ajout du toUpperCase()
                    address: this.formatFullAddress(rawAddress, postalCode, city),
                    siret: this.extractTextContent(this.getElementByXPath(XPATH_QUERIES.SIRET)),
                    website: this.extractWebsite(),
                    cms: this.extractTextContent(this.getElementByXPath(XPATH_QUERIES.CMS)),
                    naf: this.extractNafCode(nafText)
                };
 
                // Debug logging
                this.logScrapedData(companyData);
 
                return companyData;
            } catch (error) {
                this.handleError('Échec de la récupération des données', error);
                return null;
            }
        }
 
        /**
         * Sends company data to Pipedrive
         * @async
         * @param {Object} data - Company data to send
         * @param {string} [labelId] - Optional label ID for the organization
         * @returns {Promise<Object>} Pipedrive API response
         * @throws {Error} If sending fails
         */
        async sendToPipedrive(data, labelId) {
            try {
                const apiToken = await this.getApiToken();
                if (!apiToken) {
                    throw new Error('Token API manquant');
                }
 
                const sanitizedData = this.sanitizeData(data);
                this.validateCompanyData(sanitizedData);
 
                const organizationData = this.formatPipedriveData(sanitizedData, labelId);
                const response = await this.sendPipedriveRequest(organizationData, apiToken);
 
                this.handlePipedriveSuccess(response);
                await this.createContactForm(response.data.id, labelId, sanitizedData);
 
                return response;
 
            } catch (error) {
                this.handleError('Échec de l\'envoi à Pipedrive', error);
                throw error;
            }
        }
 
        /**
         * Formats data for Pipedrive API
         * @private
         * @param {Object} data - Sanitized company data
         * @param {string} labelId - Label ID
         * @returns {Object} Formatted Pipedrive data
         */
        formatPipedriveData(data, labelId) {
            const { CUSTOM_FIELDS } = CompanyDataScraper.CONFIG.PIPEDRIVE;
 
            return {
                name: data.companyName.toUpperCase(), // Ajout du toUpperCase()
                visible_to: CompanyDataScraper.CONFIG.DEFAULT_VALUES.VISIBILITY,
                owner_id: parseInt(localStorage.getItem('pipedriveOwnerId'), 10),
                address: data.address,
                [CUSTOM_FIELDS.SIRET]: data.siret,
                [CUSTOM_FIELDS.WEBSITE]: data.website,
                [CUSTOM_FIELDS.CMS]: data.cms,
                [CUSTOM_FIELDS.NAF]: data.naf,
                label_ids: labelId ? [labelId] : []
            };
        }
 
        /**
         * Sends request to Pipedrive API
         * @private
         * @async
         * @param {Object} data - Formatted organization data
         * @param {string} apiToken - Pipedrive API token
         * @returns {Promise<Object>} API response
         */
        async sendPipedriveRequest(data, apiToken) {
            const response = await this.rateLimitedRequest(
                `${CompanyDataScraper.CONFIG.PIPEDRIVE.API_URL}?api_token=${apiToken}`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            );
 
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Échec de la création dans Pipedrive');
            }
 
            return result;
        }
 
        /**
         * Creates and displays contact form after successful organization creation
         * @private
         * @async
         * @param {string} orgId - Organization ID
         * @param {string} labelId - Label ID
         * @param {Object} data - Company data
         */
        async createContactForm(orgId, labelId, data) {
            const contactForm = new ContactForm(
                orgId,
                labelId,
                data.companyName,
                this
            );
            contactForm.setCompanyData(data);
            contactForm.createFormOverlay();
        }
 
        /**
         * Handles successful Pipedrive response
         * @private
         * @param {Object} response - Pipedrive API response
         */
        handlePipedriveSuccess(response) {
            this.toolbar.showNotification(
                'Organisation créée dans Pipedrive!',
                'success'
            );
        }
 
        /**
         * Logs scraped data for debugging
         * @private
         * @param {Object} data - Scraped company data
         */
        logScrapedData(data) {
            console.group('Informations de l\'entreprise');
            Object.entries(data).forEach(([key, value]) => {
                console.log(`${key} =>`, value);
            });
            console.groupEnd();
        }
 
        /**
         * Handles and logs errors
         * @private
         * @param {string} context - Error context
         * @param {Error} error - Error object
         */
        handleError(context, error) {
            console.error(`${context}:`, error);
            this.toolbar.showNotification(
                `Erreur: ${error.message || 'Opération échouée'}`,
                'error'
            );
        }
 
        /**
         * Main method to scrape and send data
         * @async
         */
        async scrapeAndSend() {
            try {
                const companyData = this.scrapeData();
                if (companyData) {
                    await this.sendToPipedrive(companyData);
                }
            } catch (error) {
                this.handleError('Échec de la récupération ou de l\'envoi', error);
            }
        }
 
    }
 
    /**
     * Manages phoning session lifecycle and timing
     * Handles starting, stopping, and tracking session duration
     */
    class PhoningSession {
        /**
         * Session storage keys
         * @private
         * @static
         */
        static STORAGE_KEYS = {
            SESSION_START: 'phoningSessionStart'
        };
 
        /**
         * Timer update interval in milliseconds
         * @private
         * @static
         */
        static TIMER_INTERVAL = 1000;
 
        /**
         * Static class properties
         */
        static timerInterval = null;
        static startTime = null;
        static sessionStats = null;
 
        /**
         * Initializes the phoning session system
         * @static
         */
        static init() {
            console.log('🚀 Initializing PhoningSession...');
            this.sessionStats = new SessionStats();
 
            const savedStartTime = localStorage.getItem(this.STORAGE_KEYS.SESSION_START);
            if (savedStartTime) {
                this.restoreSession(parseInt(savedStartTime, 10));
            }
        }
 
        /**
         * Restores a previously saved session
         * @private
         * @static
         * @param {number} startTime - Timestamp of session start
         */
        static restoreSession(startTime) {
            this.startTime = startTime;
            this.sessionStats.initialize(this.startTime);
            this.updateTimer();
            this.startTimerInterval();
        }
 
        /**
         * Starts the timer interval
         * @private
         * @static
         */
        static startTimerInterval() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
            this.timerInterval = setInterval(() => this.updateTimer(), this.TIMER_INTERVAL);
        }
 
        /**
         * Starts a new phoning session
         * @static
         */
        static start() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
 
            this.startTime = Date.now();
            this.sessionStats = new SessionStats();
            this.sessionStats.initialize(this.startTime);
 
            localStorage.setItem(this.STORAGE_KEYS.SESSION_START, this.startTime.toString());
            this.updateTimer();
            this.startTimerInterval();
        }
 
        /**
         * Stops the current phoning session
         * @static
         * @async
         */
        static async stop() {
            console.group('🔴 Session Stop');
            console.log('Initial state:', {
                hasTimer: !!this.timerInterval,
                hasStats: !!this.sessionStats,
                startTime: this.startTime
            });
 
            try {
                if (this.timerInterval) {
                    await this.handleSessionStop();
                }
            } catch (error) {
                console.error('❌ Error during session stop:', error);
            } finally {
                this.cleanup();
            }
 
            console.groupEnd();
        }
 
        /**
         * Handles the session stop process
         * @private
         * @static
         * @async
         */
        static async handleSessionStop() {
            const endTime = Date.now();
 
            if (this.sessionStats) {
                try {
                    this.logSessionStats();
                    this.sessionStats.endSession(endTime);
                    await this.sessionStats.displayStats();
                    this.showSessionSummary();
                } catch (error) {
                    console.error('❌ Error processing session statistics:', error);
                    throw error;
                }
            } else {
                console.warn('⚠️ No statistics available for session');
            }
        }
 
        /**
         * Logs current session statistics
         * @private
         * @static
         */
        static logSessionStats() {
            console.log('Session Statistics:', {
                success: this.sessionStats.stats.success,
                recall: this.sessionStats.stats.recall,
                failed: this.sessionStats.stats.failed,
                date: this.sessionStats.stats.date
            });
        }
 
        /**
         * Shows session summary notification
         * @private
         * @static
         */
        static showSessionSummary() {
            if (window.phoningApp?.toolbar) {
                const summary = [
                    'Session terminée!',
                    `Appels réussis: ${this.sessionStats.stats.success}`,
                    `À recontacter: ${this.sessionStats.stats.recall}`,
                    `Échoués: ${this.sessionStats.stats.failed}`
                ].join('\n');
 
                window.phoningApp.toolbar.showNotification(summary, 'info');
            }
        }
 
        /**
         * Cleans up session data and UI
         * @private
         * @static
         */
        static cleanup() {
            clearInterval(this.timerInterval);
            localStorage.removeItem(this.STORAGE_KEYS.SESSION_START);
            GM_setValue('currentSessionStats', null);
 
            this.timerInterval = null;
            this.startTime = null;
 
            const timerDisplay = document.getElementById('timer-display');
            if (timerDisplay) {
                timerDisplay.remove();
            }
        }
 
        /**
         * Updates the session timer display
         * @static
         */
        static updateTimer() {
            if (!this.startTime) return;
 
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
            const formattedTime = this.formatDuration(elapsedTime);
 
            const app = window.phoningApp;
            if (app?.toolbar?.topbar) {
                app.toolbar.topbar.updateTimer(formattedTime);
            }
        }
 
        /**
         * Formats duration in seconds to HH:MM:SS
         * @static
         * @param {number} seconds - Duration in seconds
         * @returns {string} Formatted duration string
         */
        static formatDuration(seconds) {
            const hrs = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
 
            return [hrs, mins, secs]
                .map(val => val.toString().padStart(2, '0'))
                .join(':');
        }
    }
 
    /**
     * Handles contact form creation and management for Pipedrive integration
     * Manages form display, validation, and data submission
     */
    class ContactForm {
        /**
         * Form configuration constants
         * @private
         * @static
         */
        static CONFIG = {
            PHONE_REGEX: /^\+33[1-9][0-9]{8}$/,
            VISIBILITY: "3",
            CUSTOM_FIELDS: {
                ROLE: "b8877dbc4831a986842e909be66d0396fc630362",
                IS_DECIDER: "1d6b6a09496fc536aa5bf8828de51b8bb7ce2565"
            },
            STYLES: {
                OVERLAY: {
                    position: 'fixed',
                    top: '65px',
                    right: '20px',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '400px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    zIndex: 10001,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                },
                FORM: {
                    background: 'white',
                    borderRadius: '8px'
                },
                TITLE: {
                    margin: '-20px -20px 20px -20px',
                    padding: '15px 20px',
                    color: '#333',
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#f8f9fa',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    fontSize: '16px'
                },
                SUBTITLE: {
                    fontSize: '13px',
                    color: '#666',
                    marginTop: '5px'
                },
                FIELD_CONTAINER: {
                    marginBottom: '15px'
                },
                LABEL: {
                    display: 'block',
                    marginBottom: '5px',
                    color: '#666'
                },
                INPUT: {
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                },
                BUTTON_CONTAINER: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '20px'
                }
            }
        };
 
        /**
         * Initialize the contact form
         * @param {string} organizationId - Pipedrive organization ID
         * @param {string} labelId - Label ID for the contact
         * @param {string} organizationName - Organization name
         * @param {CompanyDataScraper} scraper - Reference to the scraper instance
         */
        constructor(organizationId, labelId, organizationName, scraper) {
            this.organizationId = organizationId;
            this.labelId = labelId;
            this.organizationName = organizationName ? organizationName.toUpperCase() : null;
            this.companyData = null;
            this.scraper = scraper;
 
            this.config = {
                ownerId: parseInt(localStorage.getItem('pipedriveOwnerId'), 10),
                visibility: ContactForm.CONFIG.VISIBILITY,
                originId: localStorage.getItem('pipedriveOriginId'),
                customFields: ContactForm.CONFIG.CUSTOM_FIELDS
            };
        }
 
        /**
         * Sets company data for the form
         * @param {Object} data - Company data
         */
        setCompanyData(data) {
            this.companyData = data;
        }
 
        /**
         * Closes the form overlay
         * @param {HTMLElement} overlay - Overlay element to close
         * @returns {boolean} True if successfully closed
         */
        closeOverlay(overlay) {
            console.log('Attempting to close overlay', {
                overlayExists: !!overlay,
                hasParent: !!(overlay?.parentNode),
                overlayClass: overlay?.className
            });
 
            try {
                // Verify overlay element
                if (!overlay) {
                    console.error('Undefined overlay');
                    return false;
                }
 
                // Find correct overlay element
                if (!overlay.classList.contains('contact-form-overlay')) {
                    overlay = overlay.closest('.contact-form-overlay');
                    if (!overlay) {
                        console.error('Cannot find parent overlay');
                        return false;
                    }
                }
 
                // Remove overlay
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                    return true;
                }
 
                console.error('No parent node for overlay');
                return false;
 
            } catch (error) {
                console.error('Error removing overlay:', error);
                return false;
            }
        }
 
        /**
         * Removes all form overlays from the page
         */
        removeAllOverlays() {
            document.querySelectorAll('.contact-form-overlay')
                .forEach(overlay => this.closeOverlay(overlay));
        }
 
        /**
         * Validates a phone number against French format
         * @private
         * @param {string} phone - Phone number to validate
         * @returns {string} Formatted phone number
         * @throws {Error} If phone number is invalid
         */
        validatePhoneNumber(phone) {
            let cleanPhone = phone.replace(/[^0-9+]/g, '');
 
            if (!cleanPhone.startsWith('+')) {
                cleanPhone = cleanPhone.startsWith('0')
                    ? '+33' + cleanPhone.substring(1)
                    : '+33' + cleanPhone;
            }
 
            if (!ContactForm.CONFIG.PHONE_REGEX.test(cleanPhone)) {
                throw new Error('Format de numéro de téléphone invalide. Utilisez le format +33XXXXXXXXX');
            }
 
            return cleanPhone;
        }
 
        /**
     * Creates and displays the form overlay
     */
        createFormOverlay() {
            const overlay = DOMUtils.createElement('div', {
                class: 'contact-form-overlay',
                id: 'contact-form-overlay-' + Date.now(),
                style: ContactForm.CONFIG.STYLES.OVERLAY
            });
 
            const form = this.createForm();
            overlay.appendChild(form);
            document.body.appendChild(overlay);
        }
 
        /**
         * Creates the main form structure
         * @private
         * @returns {HTMLElement} The created form element
         */
        createForm() {
            const form = DOMUtils.createElement('form', {
                class: 'contact-form',
                style: ContactForm.CONFIG.STYLES.FORM
            });
 
            const formElements = [
                this.createTitle(),
                ...this.createFormFields(),
                this.createButtonContainer()
            ];
 
            formElements.forEach(element => form.appendChild(element));
 
            form.addEventListener('submit', async (e) => {
                console.log('Form submission triggered');
                const overlay = e.target.closest('.contact-form-overlay');
                await this.handleSubmit(e, overlay);
            });
 
            return form;
        }
 
        /**
         * Creates the form title section
         * @private
         * @returns {HTMLElement} Title container element
         */
        createTitle() {
            const container = DOMUtils.createElement('h2', {
                style: ContactForm.CONFIG.STYLES.TITLE
            }, 'Ajouter les informations du contact');
 
            // Ajout du statut selon le labelId
            const statusText = this.getStatusText();
            const statusDiv = DOMUtils.createElement('div', {
                style: {
                    ...ContactForm.CONFIG.STYLES.SUBTITLE,
                    fontWeight: 'bold',
                    color: this.getStatusColor()
                }
            }, statusText);
 
            const subtitle = DOMUtils.createElement('div', {
                style: ContactForm.CONFIG.STYLES.SUBTITLE
            }, 'Si le lead est intéressé ou à recontacter, ces informations doivent obligatoirement être remplies.');
 
            container.appendChild(statusDiv);
            container.appendChild(subtitle);
            return container;
        }
 
        // Ajoute ces nouvelles méthodes à la classe ContactForm
        getStatusText() {
            switch (this.labelId) {
                case "5b70eac0-93c2-11ef-b9e9-835b97d1b293":
                    return "✅ Prospect Qualifié";
                case "5ebba8f0-93c2-11ef-b9e9-835b97d1b293":
                    return "🔄 Prospect à Recontacter";
                case "62990a30-93c2-11ef-b9e9-835b97d1b293":
                    return "❌ Prospect Perdu";
                default:
                    return "Nouveau Prospect";
            }
        }
 
        getStatusColor() {
            switch (this.labelId) {
                case "5b70eac0-93c2-11ef-b9e9-835b97d1b293":
                    return "#2ecc71"; // Vert pour qualifié
                case "5ebba8f0-93c2-11ef-b9e9-835b97d1b293":
                    return "#f39c12"; // Orange pour à recontacter
                case "62990a30-93c2-11ef-b9e9-835b97d1b293":
                    return "#e74c3c"; // Rouge pour perdu
                default:
                    return "#666";
            }
        }
 
        /**
         * Creates all form fields
         * @private
         * @returns {Array<HTMLElement>} Array of form field elements
         */
        createFormFields() {
            return [
                this.createField('Prénom', 'firstName', 'text'),
                this.createField('Nom', 'lastName', 'text'),
                this.createField('Email', 'email', 'email'),
                this.createPhoneField(),
                this.createField('Poste dans l\'entreprise', 'role', 'text'),
                this.createDeciderField(),
                this.createCommentField()
            ];
        }
 
        createField(label, name, type, placeholder = '') {
            const container = DOMUtils.createElement('div', {
                style: ContactForm.CONFIG.STYLES.FIELD_CONTAINER
            });
 
            const labelElement = DOMUtils.createElement('label', {
                style: ContactForm.CONFIG.STYLES.LABEL
            }, label);
 
            const input = DOMUtils.createElement('input', {
                type,
                name,
                placeholder,
                style: ContactForm.CONFIG.STYLES.INPUT,
                required: true
            });
 
            // Ajout du gestionnaire d'événement pour le champ lastName
            if (name === 'lastName') {
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.toUpperCase();
                });
                // Pour gérer aussi le cas du copier-coller
                input.addEventListener('paste', (e) => {
                    setTimeout(() => {
                        e.target.value = e.target.value.toUpperCase();
                    }, 0);
                });
            }
 
            container.append(labelElement, input);
            return container;
        }
 
        /**
         * Creates the phone number field with validation
         * @private
         * @returns {HTMLElement} Phone field container
         */
        createPhoneField() {
            const container = DOMUtils.createElement('div', {
                style: ContactForm.CONFIG.STYLES.FIELD_CONTAINER
            });
 
            const labelElement = DOMUtils.createElement('label', {
                style: ContactForm.CONFIG.STYLES.LABEL
            }, 'Téléphone');
 
            const input = DOMUtils.createElement('input', {
                type: 'tel',
                name: 'phone',
                placeholder: '+33XXXXXXXXX',
                style: ContactForm.CONFIG.STYLES.INPUT,
                required: true
            });
 
            input.addEventListener('input', (e) => this.handlePhoneInput(e));
 
            container.append(labelElement, input);
            return container;
        }
 
        /**
         * Handles phone input validation
         * @private
         * @param {Event} e - Input event
         */
        handlePhoneInput(e) {
            const input = e.target;
            try {
                const validPhone = this.validatePhoneNumber(input.value);
                input.value = validPhone;
                input.style.borderColor = '#ddd';
                input.setCustomValidity('');
            } catch (error) {
                input.style.borderColor = '#e74c3c';
                input.setCustomValidity(error.message);
            }
        }
 
        /**
         * Creates the decision maker checkbox field
         * @private
         * @returns {HTMLElement} Decider field container
         */
        createDeciderField() {
            const container = DOMUtils.createElement('div', {
                style: ContactForm.CONFIG.STYLES.FIELD_CONTAINER
            });
 
            const label = DOMUtils.createElement('label', {
                style: {
                    ...ContactForm.CONFIG.STYLES.LABEL,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }
            });
 
            const checkbox = DOMUtils.createElement('input', {
                type: 'checkbox',
                name: 'decideur'
            });
 
            label.append(checkbox, document.createTextNode('S\'agit-il du décideur ?'));
            container.appendChild(label);
            return container;
        }
 
        /**
         * Creates the comment textarea field
         * @private
         * @returns {HTMLElement} Comment field container
         */
        createCommentField() {
            const container = DOMUtils.createElement('div', {
                style: ContactForm.CONFIG.STYLES.FIELD_CONTAINER
            });
 
            const labelElement = DOMUtils.createElement('label', {
                style: ContactForm.CONFIG.STYLES.LABEL
            }, 'Commentaire');
 
            const textarea = DOMUtils.createElement('textarea', {
                name: 'comment',
                placeholder: 'Ajoutez vos commentaires ici...',
                style: {
                    ...ContactForm.CONFIG.STYLES.INPUT,
                    minHeight: '100px',
                    resize: 'vertical'
                }
            });
 
            container.append(labelElement, textarea);
            return container;
        }
 
        /**
     * Creates button container with submit and no-info buttons
     * @private
     * @returns {HTMLElement} Button container element
     */
        createButtonContainer() {
            const container = DOMUtils.createElement('div', {
                style: ContactForm.CONFIG.STYLES.BUTTON_CONTAINER
            });
 
            const noInfoButton = this.createButton('Je n\'ai pas ces informations', '#e74c3c');
            const submitButton = this.createButton('Envoyer', '#2ecc71', 'submit');
 
            noInfoButton.addEventListener('click', async () => {
                const overlay = container.closest('form').parentElement;
                await this.handleNoInfo();
                this.closeOverlay(overlay);
            });
 
            container.append(noInfoButton, submitButton);
            return container;
        }
 
        /**
         * Creates a styled button
         * @private
         * @param {string} text - Button text
         * @param {string} backgroundColor - Button background color
         * @param {string} [type='button'] - Button type
         * @returns {HTMLElement} Button element
         */
        createButton(text, backgroundColor, type = 'button') {
            return DOMUtils.createElement('button', {
                type,
                style: {
                    padding: '8px 15px',
                    background: backgroundColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }
            }, text);
        }
 
        /**
         * Handles form submission
         * @async
         * @param {Event} event - Submit event
         * @param {HTMLElement} overlay - Form overlay element
         */
        async handleSubmit(event, overlay) {
            event.preventDefault();
            console.log('Processing form submission...');
 
            try {
                await this.validateForm(event.target);
                const formData = new FormData(event.target);
 
                // Create organization and contact in Pipedrive
                const organizationResponse = await this.createOrganization();
                if (!organizationResponse?.success) {
                    throw new Error('Échec de la création de l\'organisation');
                }
 
                this.organizationId = organizationResponse.data.id;
                const personResponse = await this.createPerson(formData);
                if (!personResponse?.success) {
                    throw new Error('Échec de la création du contact');
                }
 
                const leadResponse = await this.createLead(personResponse.data.id);
                if (!leadResponse?.success) {
                    throw new Error('Échec de la création du lead');
                }
 
                await this.addCommentIfPresent(formData, leadResponse.data.id);
                this.updateSessionStats();
                await this.cleanupAndNotify(overlay);
 
            } catch (error) {
                console.error('Submission error:', error);
                this.showNotification(`Erreur: ${error.message}`, 'error');
            }
        }
 
        /**
         * Validates form data
         * @private
         * @async
         * @param {HTMLFormElement} form - Form element
         * @throws {Error} If validation fails
         */
        async validateForm(form) {
            const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'role'];
            const missingFields = requiredFields.filter(field => !form[field]?.value);
 
            if (missingFields.length > 0) {
                throw new Error(`Champs requis manquants: ${missingFields.join(', ')}`);
            }
 
            this.validatePhoneNumber(form['phone'].value);
        }
 
        /**
         * Creates organization in Pipedrive
         * @private
         * @async
         * @returns {Promise<Object>} Pipedrive API response
         */
        async createOrganization() {
            return await this.scraper.sendToPipedrive(this.companyData, this.labelId);
        }
 
        /**
         * Creates person in Pipedrive
         * @private
         * @async
         * @param {FormData} formData - Form data
         * @returns {Promise<Object>} Pipedrive API response
         */
        async createPerson(formData) {
            const phoneNumber = this.validatePhoneNumber(formData.get('phone'));
            const personData = this.formatPersonData(formData, phoneNumber);
            return await this.sendToPipedrive('persons', personData);
        }
 
        /**
         * Formats person data for Pipedrive
         * @private
         * @param {FormData} formData - Form data
         * @param {string} phoneNumber - Validated phone number
         * @returns {Object} Formatted person data
         */
        formatPersonData(formData, phoneNumber) {
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName').toUpperCase(); // Force en majuscules
 
            return {
                name: `${firstName} ${lastName}`,
                owner_id: this.config.ownerId,
                org_id: this.organizationId,
                email: [{ value: formData.get('email'), primary: true, label: 'Work' }],
                phone: [{ value: phoneNumber, primary: true, label: 'Work' }],
                visible_to: this.config.visibility,
                [this.config.customFields.ROLE]: formData.get('role'),
                [this.config.customFields.IS_DECIDER]: formData.get('decideur') ? 'Yes' : 'No'
            };
        }
 
        /**
         * Prépare les données communes pour la création d'un lead
         * @private
         * @param {string|null} personId - ID de la personne si disponible
         * @returns {Object} Données formatées pour la création du lead
         */
        prepareLead(personId = null) {
            return {
                title: `LEAD - ${(this.organizationName || 'Entreprise inconnue').toUpperCase()}`,
                owner_id: this.config.ownerId,
                organization_id: this.organizationId,
                visible_to: this.config.visibility,
                origin_id: this.config.originId,
                label_ids: this.labelId ? [this.labelId] : [],
                ...(personId && { person_id: personId })
            };
        }
 
        /**
         * Crée un lead dans Pipedrive
         * @private
         * @async
         * @param {string} personId - ID de la personne dans Pipedrive
         * @returns {Promise<Object>} Réponse de l'API Pipedrive
         */
        async createLead(personId) {
            return await this.sendToPipedrive('leads', this.prepareLead(personId));
        }
 
        /**
         * Adds comment to lead if present
         * @private
         * @async
         * @param {FormData} formData - Form data
         * @param {string} leadId - Lead ID in Pipedrive
         */
        async addCommentIfPresent(formData, leadId) {
            const comment = formData.get('comment')?.trim();
            if (comment) {
                await this.sendToPipedrive('notes', {
                    content: comment,
                    lead_id: leadId
                });
            }
        }
 
        /**
         * Updates session statistics
         * @private
         */
        updateSessionStats() {
            if (PhoningSession.sessionStats && this.labelId) {
                PhoningSession.sessionStats.incrementStatByLabelId(this.labelId);
            }
        }
 
        /**
         * Cleans up form and shows success notification
         * @private
         * @async
         * @param {HTMLElement} overlay - Form overlay element
         */
        async cleanupAndNotify(overlay) {
            await this.removeAllModals();
            this.showNotification(
                'Informations correctement envoyées à PipeDrive. Courage pour la suite de ta session !',
                'success',
                {   // Ajout d'un objet de style personnalisé
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '5px',
                    zIndex: 10000,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    maxWidth: '300px',
                    wordWrap: 'break-word',
                    opacity: '1',
                    transition: 'opacity 0.5s ease-out'
                }
            );
        }
 
        /**
         * Gère le cas où aucune information n'est disponible
         * @async
         */
        async handleNoInfo() {
            try {
                await this.removeAllOverlays();
 
                const organizationResponse = await this.scraper.sendToPipedrive(
                    this.companyData,
                    this.labelId
                );
 
                if (!organizationResponse?.success) {
                    throw new Error('Échec de la création de l\'organisation');
                }
 
                this.organizationId = organizationResponse.data.id;
 
                const leadResponse = await this.sendToPipedrive('leads', this.prepareLead());
 
                if (leadResponse?.success) {
                    this.updateSessionStats();
                    await this.removeAllModals();
                    this.showNotification('Lead créé sans contact dans Pipedrive', 'success');
                } else {
                    throw new Error('Échec de la création du lead');
                }
 
            } catch (error) {
                console.error('handleNoInfo error:', error);
                this.showNotification(`Erreur: ${error.message}`, 'error');
            }
        }
 
        /**
         * Sends request to Pipedrive API
         * @private
         * @async
         * @param {string} endpoint - API endpoint
         * @param {Object} data - Request data
         * @returns {Promise<Object>} API response
         */
        async sendToPipedrive(endpoint, data) {
            const apiToken = localStorage.getItem('pipedriveApiKey');
            if (!apiToken) {
                throw new Error('Token API manquant');
            }
 
            const response = await fetch(
                `https://api.pipedrive.com/v1/${endpoint}?api_token=${apiToken}`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            );
 
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
 
            return await response.json();
        }
 
        /**
         * Shows notification message
         * @param {string} message - Notification message
         * @param {string} [type='info'] - Notification type
         * @param {Object} [customStyle=null] - Custom style object
         */
        showNotification(message, type = 'info', customStyle = null) {
            const colors = {
                success: '#2ecc71',
                error: '#e74c3c',
                info: '#3498db'
            };
 
            const defaultStyle = {
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                backgroundColor: colors[type] || colors.info,
                color: 'white',
                padding: '15px',
                borderRadius: '5px',
                zIndex: 10000,
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                maxWidth: '300px',
                wordWrap: 'break-word',
                opacity: '1',
                transition: 'opacity 0.5s ease-out'
            };
 
            const notification = DOMUtils.createElement('div', {
                style: customStyle || defaultStyle
            }, message);
 
            document.body.appendChild(notification);
 
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }, 3000);
        }
 
        /**
         * Removes all modal windows from the page
         * @private
         * @returns {Promise<void>}
         */
        async removeAllModals() {
            const allModals = document.querySelectorAll('.contact-form-overlay');
            allModals.forEach(modal => {
                try {
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
                } catch (e) {
                    console.error('Error during modal cleanup:', e);
                }
            });
        }
 
    }
 
    /**
     * Manages persistent status buttons for call outcomes
     * Handles button creation, display, and interactions
     */
    class PersistentStatusButtons {
        /**
         * Configuration constants
         * @private
         * @static
         */
        static CONFIG = {
            LABELS: {
                QUALIFIED: {
                    id: "5b70eac0-93c2-11ef-b9e9-835b97d1b293",
                    text: "Qualifié",
                    color: "#2ecc71"
                },
                RECALL: {
                    id: "5ebba8f0-93c2-11ef-b9e9-835b97d1b293",
                    text: "Relançable",
                    color: "#f39c12"
                },
                LOST: {
                    id: "62990a30-93c2-11ef-b9e9-835b97d1b293",
                    text: "Perdu",
                    color: "#e74c3c"
                }
            },
            STYLES: {
                BUTTON: {
                    padding: '8px 15px',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'opacity 0.3s ease'
                }
            }
        };
 
        /**
         * Static class properties
         * @static
         */
        static container = null;
        static buttons = {};
        static scraper = null;
 
        /**
         * Displays status buttons
         * @static
         * @param {CompanyDataScraper} scraper - Scraper instance
         */
        static show(scraper) {
            console.log('Initializing status buttons...');
            this.scraper = scraper;
 
            const container = scraper.toolbar.topbar.getStatusButtonsContainer();
            if (container) {
                this.container = container;
                this.createButtons();
            } else {
                console.error('Status buttons container not found');
            }
        }
 
        /**
         * Hides and cleans up status buttons
         * @static
         */
        static hide() {
            if (this.container) {
                this.cleanupButtons();
                Object.keys(this.buttons).forEach(key => {
                    this.buttons[key] = null;
                });
            }
        }
 
        /**
         * Removes all buttons from container
         * @private
         * @static
         */
        static cleanupButtons() {
            while (this.container?.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
        }
 
        /**
         * Creates status buttons
         * @private
         * @static
         */
        static createButtons() {
            if (!this.validateContainer()) return;
 
            Object.entries(PersistentStatusButtons.CONFIG.LABELS).forEach(([key, config]) => {
                this.createButton(key.toLowerCase(), config);
            });
        }
 
        /**
         * Validates container existence
         * @private
         * @static
         * @returns {boolean} True if container exists
         */
        static validateContainer() {
            if (!this.container) {
                console.error('Container not initialized');
                return false;
            }
            return true;
        }
 
        /**
         * Creates a single status button
         * @private
         * @static
         * @param {string} key - Button identifier
         * @param {Object} config - Button configuration
         */
        static createButton(key, config) {
            if (!this.buttons[key]) {
                this.buttons[key] = DOMUtils.createElement('button', {
                    style: {
                        ...PersistentStatusButtons.CONFIG.STYLES.BUTTON,
                        backgroundColor: config.color
                    }
                }, config.text);
 
                this.attachButtonEvents(this.buttons[key], key, config);
                this.container.appendChild(this.buttons[key]);
            }
        }
 
        /**
         * Attaches events to a button
         * @private
         * @static
         * @param {HTMLElement} button - Button element
         * @param {string} key - Button identifier
         * @param {Object} config - Button configuration
         */
        static attachButtonEvents(button, key, config) {
            button.addEventListener('click', () => this.handleButtonClick(key));
 
            // Hover effects
            button.addEventListener('mouseenter', () => {
                button.style.opacity = '0.8';
            });
 
            button.addEventListener('mouseleave', () => {
                button.style.opacity = '1';
            });
        }
 
        /**
         * Handles button click events
         * @private
         * @static
         * @async
         * @param {string} key - Button identifier
         */
        static async handleButtonClick(key) {
            console.log(`Status button clicked: ${key}`);
 
            if (!this.validateScraper()) return;
 
            try {
                const companyData = this.scraper.scrapeData();
                if (companyData) {
                    await this.createContactForm(key, companyData);
                }
            } catch (error) {
                console.error('Error handling button click:', error);
                this.scraper.toolbar.showNotification(
                    `Erreur: ${error.message}`,
                    'error'
                );
            }
        }
 
        /**
         * Validates scraper existence
         * @private
         * @static
         * @returns {boolean} True if scraper exists
         */
        static validateScraper() {
            if (!this.scraper) {
                console.error('Scraper not initialized');
                return false;
            }
            return true;
        }
 
        /**
         * Creates contact form for selected status
         * @private
         * @static
         * @async
         * @param {string} key - Button identifier
         * @param {Object} companyData - Scraped company data
         */
        static async createContactForm(key, companyData) {
            const config = PersistentStatusButtons.CONFIG.LABELS[key.toUpperCase()];
            if (!config) {
                console.error(`Invalid button key: ${key}`);
                return;
            }
 
            const contactForm = new ContactForm(
                null,
                config.id,
                companyData.companyName,
                this.scraper
            );
 
            contactForm.setCompanyData(companyData);
            contactForm.createFormOverlay();
        }
    }
 
    /**
     * Manages application settings dialog and configuration
     * Handles settings UI, storage, and validation
     */
    class SettingsDialog {
        /**
         * Configuration constants
         * @private
         * @static
         */
        static CONFIG = {
            STORAGE_KEYS: {
                API_KEY: 'pipedriveApiKey',
                SALESPERSON: 'selectedSalesperson',
                OWNER_ID: 'pipedriveOwnerId',
                ORIGIN_ID: 'pipedriveOriginId',
                SLACK_WEBHOOK: 'slackWebhookUrl'
            },
            STYLES: {
                OVERLAY: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10001
                },
                CONTAINER: {
                    background: 'white',
                    padding: '20px',
                    borderRadius: '5px',
                    minWidth: '350px'
                },
                FORM_GROUP: {
                    marginBottom: '15px'
                },
                LABEL: {
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold'
                },
                INPUT: {
                    width: '100%',
                    padding: '8px',
                    marginBottom: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                },
                SELECT: {
                    width: '100%',
                    padding: '8px',
                    marginBottom: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                },
                BUTTON_CONTAINER: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px'
                },
                BUTTON: {
                    padding: '8px 15px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: 'white'
                },
                TITLE: {
                    marginTop: 0,
                    fontWeight: 'bold',
                    fontSize: '1.5em',
                    marginBottom: '25px'
                }
            }
        };
 
        /**
         * Salespeople configuration
         * @static
         */
        static SALESPEOPLE = {
            olivier: {
                name: 'Olivier',
                ownerId: 15164497,
                originId: 'Oliver',
                active: true
            },
            cyril: {
                name: 'Cyril',
                ownerId: 15115305,
                originId: 'Cyril',
                active: true
            },
            gabriel: {
                name: 'Gabriel',
                ownerId: 22426147,
                originId: 'Gabriel',
                active: true
            },
            valentin: {
                name: 'Valentin',
                ownerId: 22719154,
                originId: 'Valentin',
                active: true
            }
        };
 
        /**
         * Opens settings dialog
         * @static
         */
        static open() {
            const { overlay, container } = this.createDialogElements();
            const content = this.createContent();
 
            container.append(...Object.values(content));
            overlay.appendChild(container);
            document.body.appendChild(overlay);
 
            this.attachEvents(overlay, content);
        }
 
        /**
         * Creates main dialog elements
         * @private
         * @static
         * @returns {Object} Dialog elements
         */
        static createDialogElements() {
            const overlay = DOMUtils.createElement('div', {
                style: this.CONFIG.STYLES.OVERLAY
            });
 
            const container = DOMUtils.createElement('div', {
                style: this.CONFIG.STYLES.CONTAINER
            });
 
            return { overlay, container };
        }
 
        /**
         * Creates dialog content
         * @private
         * @static
         * @returns {Object} Content elements
         */
        static createContent() {
            return {
                title: this.createTitle(),
                apiKeyGroup: this.createApiKeyGroup(),
                salesGroup: this.createSalesGroup(),
                slackGroup: this.createSlackGroup(),
                buttonContainer: this.createButtonContainer()
            };
        }
 
        /**
         * Creates dialog title
         * @private
         * @static
         * @returns {HTMLElement} Title element
         */
        static createTitle() {
            return DOMUtils.createElement('h1', {
                style: this.CONFIG.STYLES.TITLE
            }, 'Paramètres');
        }
 
        /**
         * Creates API key input group
         * @private
         * @static
         * @returns {HTMLElement} API key group element
         */
        static createApiKeyGroup() {
            const group = this.createFormGroup('Pipedrive API Key:');
            const input = this.createInput('text');
            input.value = localStorage.getItem(this.CONFIG.STORAGE_KEYS.API_KEY) || '';
            group.appendChild(input);
            return group;
        }
 
        /**
         * Creates sales person selection group
         * @private
         * @static
         * @returns {HTMLElement} Sales group element
         */
        static createSalesGroup() {
            const group = this.createFormGroup('Je suis:');
            const select = this.createSelect();
 
            Object.entries(this.SALESPEOPLE)
                .filter(([_, data]) => data.active)
                .forEach(([key, data]) => {
                    const option = DOMUtils.createElement('option', {
                        value: key
                    }, data.name);
                    select.appendChild(option);
                });
 
            select.value = localStorage.getItem(this.CONFIG.STORAGE_KEYS.SALESPERSON) || 'olivier';
            group.appendChild(select);
            return group;
        }
 
        /**
         * Creates Slack webhook input group
         * @private
         * @static
         * @returns {HTMLElement} Slack group element
         */
        static createSlackGroup() {
            const group = this.createFormGroup('Slack Webhook URL:');
            const input = this.createInput('text', 'https://hooks.slack.com/services/...');
            input.value = localStorage.getItem(this.CONFIG.STORAGE_KEYS.SLACK_WEBHOOK) || '';
            group.appendChild(input);
            return group;
        }
 
        /**
         * Creates a form group with label
         * @private
         * @static
         * @param {string} labelText - Label text
         * @returns {HTMLElement} Form group element
         */
        static createFormGroup(labelText) {
            const group = DOMUtils.createElement('div', {
                style: this.CONFIG.STYLES.FORM_GROUP
            });
 
            const label = DOMUtils.createElement('label', {
                style: this.CONFIG.STYLES.LABEL
            }, labelText);
 
            group.appendChild(label);
            return group;
        }
 
        /**
         * Creates an input element
         * @private
         * @static
         * @param {string} type - Input type
         * @param {string} [placeholder=''] - Input placeholder
         * @returns {HTMLElement} Input element
         */
        static createInput(type, placeholder = '') {
            return DOMUtils.createElement('input', {
                type,
                style: this.CONFIG.STYLES.INPUT,
                placeholder
            });
        }
 
        /**
         * Creates a select element
         * @private
         * @static
         * @returns {HTMLElement} Select element
         */
        static createSelect() {
            return DOMUtils.createElement('select', {
                style: this.CONFIG.STYLES.SELECT
            });
        }
 
        /**
         * Creates button container with actions
         * @private
         * @static
         * @returns {HTMLElement} Button container element
         */
        static createButtonContainer() {
            const container = DOMUtils.createElement('div', {
                style: this.CONFIG.STYLES.BUTTON_CONTAINER
            });
 
            const saveButton = DOMUtils.createElement('button', {
                style: { ...this.CONFIG.STYLES.BUTTON, background: '#2ecc71' }
            }, 'Enregistrer');
 
            const closeButton = DOMUtils.createElement('button', {
                style: { ...this.CONFIG.STYLES.BUTTON, background: '#95a5a6' }
            }, 'Fermer');
 
            container.append(saveButton, closeButton);
            return container;
        }
 
        /**
         * Attaches event handlers to dialog elements
         * @private
         * @static
         * @param {HTMLElement} overlay - Dialog overlay
         * @param {Object} content - Dialog content elements
         */
        static attachEvents(overlay, content) {
            const [saveButton, closeButton] = content.buttonContainer.querySelectorAll('button');
            const apiKeyInput = content.apiKeyGroup.querySelector('input');
            const salesSelect = content.salesGroup.querySelector('select');
            const slackInput = content.slackGroup.querySelector('input');
 
            saveButton.addEventListener('click', () => {
                this.saveSettings(apiKeyInput.value, salesSelect.value, slackInput.value);
                this.closeDialog(overlay);
            });
 
            closeButton.addEventListener('click', () => this.closeDialog(overlay));
 
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeDialog(overlay);
                }
            });
        }
 
        /**
         * Saves settings to local storage
         * @static
         * @param {string} apiKey - Pipedrive API key
         * @param {string} selectedSalesperson - Selected salesperson identifier
         * @param {string} slackWebhookUrl - Slack webhook URL
         */
        static saveSettings(apiKey, selectedSalesperson, slackWebhookUrl) {
            const { STORAGE_KEYS } = this.CONFIG;
 
            localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
            localStorage.setItem(STORAGE_KEYS.SALESPERSON, selectedSalesperson);
            localStorage.setItem(STORAGE_KEYS.SLACK_WEBHOOK, slackWebhookUrl);
 
            const salesperson = this.SALESPEOPLE[selectedSalesperson];
            if (salesperson) {
                localStorage.setItem(STORAGE_KEYS.OWNER_ID, salesperson.ownerId?.toString() || '');
                localStorage.setItem(STORAGE_KEYS.ORIGIN_ID, salesperson.originId);
            }
 
            this.showSaveNotification();
        }
 
        /**
         * Shows save success notification
         * @private
         * @static
         */
        static showSaveNotification() {
            const notification = DOMUtils.createElement('div', {
                style: {
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '5px',
                    zIndex: 10000,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }
            }, 'Paramètres enregistrés avec succès !');
 
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
 
        /**
         * Closes settings dialog
         * @private
         * @static
         * @param {HTMLElement} overlay - Dialog overlay
         */
        static closeDialog(overlay) {
            document.body.removeChild(overlay);
        }
 
        /**
         * Gets current salesperson information
         * @static
         * @returns {Object} Current salesperson data
         */
        static getCurrentSalesperson() {
            const selectedSalesperson = localStorage.getItem(this.CONFIG.STORAGE_KEYS.SALESPERSON) || 'olivier';
            return this.SALESPEOPLE[selectedSalesperson];
        }
    }
 
    /**
     * Handles Slack notifications for session statistics
     * Manages message formatting and webhook communication
     */
 
    class SlackNotifier {
        /**
         * Configuration constants
         * @private
         * @static
         */
        static CONFIG = {
            STORAGE_KEYS: {
                WEBHOOK_URL: 'slackWebhookUrl'
            },
            MESSAGE_BLOCKS: {
                HEADER: {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "📊 Résumé de la Session Phoning",
                        emoji: true
                    }
                }
            },
            EMOJIS: {
                QUALIFIED: ':large_green_circle:',
                RECALL: ':large_orange_circle:',
                LOST: ':red_circle:',
                CHART: ':chart_with_upwards_trend:'
            },
            TIME_OPTIONS: {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Europe/Paris'
            }
        };
 
        /**
         * Sends statistics to Slack
         * @static
         * @async
         * @param {string} message - Formatted message to send
         * @returns {Promise<boolean>} Success status
         */
        static async sendToSlack(message) {
            console.group('🚀 Slack Notification Attempt');
 
            try {
                const webhookUrl = this.getWebhookUrl();
                if (!webhookUrl) {
                    console.warn('⚠️ Slack webhook URL not configured');
                    console.groupEnd();
                    return false;
                }
 
                const payload = this.createPayload(message);
                console.log('Payload prepared:', JSON.stringify(payload, null, 2));
 
                const success = await this.sendRequest(webhookUrl, payload);
                this.handleResponse(success);
 
                console.groupEnd();
                return success;
 
            } catch (error) {
                this.handleError(error);
                console.groupEnd();
                throw error;
            }
        }
 
        /**
         * Gets webhook URL from storage
         * @private
         * @static
         * @returns {string|null} Webhook URL
         */
        static getWebhookUrl() {
            return localStorage.getItem(this.CONFIG.STORAGE_KEYS.WEBHOOK_URL);
        }
 
        /**
         * Creates message payload for Slack
         * @private
         * @static
         * @param {string} message - Message content
         * @returns {Object} Formatted payload
         */
        static createPayload(message) {
            return {
                blocks: [
                    this.CONFIG.MESSAGE_BLOCKS.HEADER,
                    {
                        type: "section",
                        fields: [{
                            type: "mrkdwn",
                            text: message
                        }]
                    }
                ]
            };
        }
 
        /**
         * Sends request to Slack webhook
         * @private
         * @static
         * @async
         * @param {string} webhookUrl - Slack webhook URL
         * @param {Object} payload - Message payload
         * @returns {Promise<boolean>} Success status
         */
        static async sendRequest(webhookUrl, payload) {
            console.log('📤 Sending request to Slack...');
 
            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload),
                    mode: 'no-cors'
                });
 
                return true;
            } catch (error) {
                console.error('Failed to send request:', error);
                return false;
            }
        }
 
        /**
         * Handles successful response
         * @private
         * @static
         * @param {boolean} success - Success status
         */
        static handleResponse(success) {
            if (success) {
                console.log('✅ Message sent to Slack');
                if (window.phoningApp?.toolbar) {
                    window.phoningApp.toolbar.showNotification(
                        'Statistiques envoyées avec succès à Slack! 🎉',
                        'success'
                    );
                }
            }
        }
 
        /**
         * Handles error in Slack communication
         * @private
         * @static
         * @param {Error} error - Error object
         */
        static handleError(error) {
            console.error('❌ Slack sending error:', error);
            if (window.phoningApp?.toolbar) {
                window.phoningApp.toolbar.showNotification(
                    `Impossible d'envoyer les stats à Slack: ${error.message}. Vérifiez la configuration.`,
                    'error'
                );
            }
        }
 
        /**
         * Formats session statistics for Slack message
         * @static
         * @param {SessionStats} stats - Session statistics
         * @param {string} salespersonName - Name of salesperson
         * @returns {string} Formatted message
         */
        static formatSessionStats(stats, salespersonName) {
            const totals = this.calculateTotals(stats);
            const percentages = this.calculatePercentages(stats, totals);
            const times = this.formatTimes(stats);
 
            return this.buildMessage(stats, salespersonName, percentages, times);
        }
 
        /**
         * Calculates total results
         * @private
         * @static
         * @param {SessionStats} stats - Session statistics
         * @returns {number} Total results
         */
        static calculateTotals(stats) {
            return stats.stats.success + stats.stats.recall + stats.stats.failed;
        }
 
        /**
         * Calculates result percentages
         * @private
         * @static
         * @param {SessionStats} stats - Session statistics
         * @param {number} total - Total results
         * @returns {Object} Result percentages
         */
        static calculatePercentages(stats, total) {
            if (!total) return { success: 0, recall: 0, failed: 0 };
 
            return {
                success: Math.round((stats.stats.success / total) * 100),
                recall: Math.round((stats.stats.recall / total) * 100),
                failed: Math.round((stats.stats.failed / total) * 100)
            };
        }
 
        /**
         * Formats session times
         * @private
         * @static
         * @param {SessionStats} stats - Session statistics
         * @returns {Object} Formatted times
         */
        static formatTimes(stats) {
            const startTime = new Date(stats.stats.startTime);
            const endTime = new Date(stats.stats.endTime);
 
            return {
                start: startTime.toLocaleTimeString('fr-FR', this.CONFIG.TIME_OPTIONS),
                end: endTime.toLocaleTimeString('fr-FR', this.CONFIG.TIME_OPTIONS)
            };
        }
 
        /**
         * Builds formatted Slack message
         * @private
         * @static
         * @param {SessionStats} stats - Session statistics
         * @param {string} salespersonName - Name of salesperson
         * @param {Object} percentages - Result percentages
         * @param {Object} times - Formatted times
         * @returns {string} Formatted message
         */
        static buildMessage(stats, salespersonName, percentages, times) {
            const { EMOJIS } = this.CONFIG;
 
            return [
                `${EMOJIS.CHART} ${salespersonName} vient de terminer une session.`,
                `*Date :* ${stats.stats.date}`,
                `*Durée de la session :* de ${times.start} à ${times.end}`,
                '\n*Résultats :*',
                `• ${EMOJIS.QUALIFIED} Qualifiés: ${stats.stats.success} (${percentages.success}%)`,
                `• ${EMOJIS.RECALL} À recontacter: ${stats.stats.recall} (${percentages.recall}%)`,
                `• ${EMOJIS.LOST} Perdus: ${stats.stats.failed} (${percentages.failed}%)`,
                '\nBravo pour cette session ! 🎉'
            ].join('\n');
        }
    }
 
    /**
     * Manages the top toolbar of the application
     * Handles UI elements, session controls, and status display
     */
    class TopBar {
        /**
         * CSS styles configuration
         * @private
         * @static
         */
        static STYLES = {
            TOPBAR: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '98%',
                height: '50px',
                backgroundColor: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px',
                zIndex: '10000'
            },
            SECTION: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            },
            WELCOME_TEXT: {
                color: '#333',
                fontSize: '14px',
                fontWeight: '500'
            },
            CENTER_TEXT: {
                color: '#666',
                fontSize: '14px',
                textAlign: 'center'
            },
            BUTTONS_CONTAINER: {
                display: 'flex',
                gap: '10px'
            },
            BUTTON: {
                padding: '8px 15px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                color: 'white',
                backgroundColor: '#2ecc71'
            }
        };
 
        /**
         * Initialize the top bar
         */
        constructor() {
            /**
             * DOM elements references
             * @private
             */
            this.elements = {
                topbar: null,
                leftSection: null,
                centerSection: null,
                rightSection: null,
                welcomeText: null,
                timerText: null,
                statusButtons: null
            };
 
            this.createTopBar();
            this.adjustBodyMargin();
        }
 
        /**
         * Creates the top bar structure
         * @private
         */
        createTopBar() {
            // Main topbar container
            this.elements.topbar = DOMUtils.createElement('div', {
                style: TopBar.STYLES.TOPBAR
            });
 
            // Left section with welcome message
            this.createLeftSection();
 
            // Center section with timer/status
            this.createCenterSection();
 
            // Right section with controls
            this.createRightSection();
 
            // Add sections to topbar
            this.elements.topbar.append(
                this.elements.leftSection,
                this.elements.centerSection,
                this.elements.rightSection
            );
 
            // Add topbar to document
            document.body.insertBefore(this.elements.topbar, document.body.firstChild);
        }
 
        /**
         * Creates the left section with welcome message
         * @private
         */
        createLeftSection() {
            this.elements.leftSection = DOMUtils.createElement('div', {
                style: TopBar.STYLES.SECTION
            });
 
            this.elements.welcomeText = DOMUtils.createElement('span', {
                style: TopBar.STYLES.WELCOME_TEXT
            });
 
            this.elements.leftSection.appendChild(this.elements.welcomeText);
        }
 
        /**
         * Creates the center section with status/timer
         * @private
         */
        createCenterSection() {
            this.elements.centerSection = DOMUtils.createElement('div', {
                style: TopBar.STYLES.CENTER_TEXT
            });
        }
 
        /**
         * Creates the right section with buttons
         * @private
         */
        createRightSection() {
            this.elements.rightSection = DOMUtils.createElement('div', {
                style: TopBar.STYLES.SECTION
            });
        }
 
        /**
         * Adjusts body margin to accommodate topbar
         * @private
         */
        adjustBodyMargin() {
            document.body.style.marginTop = '50px';
        }
 
        /**
         * Updates the welcome message based on session state
         * @param {boolean} isSessionStarted - Whether a session is in progress
         */
        updateWelcomeMessage(isSessionStarted = false) {
            const currentSalesperson = SettingsDialog.getCurrentSalesperson();
            const message = isSessionStarted
                ? `Bon courage ${currentSalesperson.name} ! 💰`
                : `Bonjour ${currentSalesperson.name}, prêt à lancer une session ? 💰`;
            this.elements.welcomeText.textContent = message;
        }
 
        /**
         * Updates the center message based on configuration and session state
         * @param {boolean} isSessionStarted - Whether a session is in progress
         */
        updateCenterMessage(isSessionStarted = false) {
            const missingElements = this.checkMissingConfiguration();
 
            if (missingElements.length > 0) {
                this.elements.centerSection.textContent =
                    `Configuration incomplète - Éléments manquants : ${missingElements.join(', ')}`;
                return;
            }
 
            if (isSessionStarted) {
                this.elements.timerText = this.elements.timerText || DOMUtils.createElement('span');
                this.elements.centerSection.textContent = 'Session commencée depuis : ';
                this.elements.centerSection.appendChild(this.elements.timerText);
            } else {
                this.elements.centerSection.textContent = 'Session non commencée';
            }
        }
 
        /**
         * Checks for missing configuration elements
         * @private
         * @returns {Array<string>} List of missing elements
         */
        checkMissingConfiguration() {
            const missingElements = [];
            const apiKey = localStorage.getItem('pipedriveApiKey');
            const salesperson = localStorage.getItem('selectedSalesperson');
            const slackWebhook = localStorage.getItem('slackWebhookUrl');
 
            if (!apiKey) missingElements.push('API Key Pipedrive');
            if (!salesperson) missingElements.push('Commercial');
            if (!slackWebhook) missingElements.push('Webhook Slack');
 
            return missingElements;
        }
 
        /**
         * Updates the timer display
         * @param {string} time - Formatted time string
         */
        updateTimer(time) {
            if (!this.elements.timerText) {
                this.elements.timerText = DOMUtils.createElement('span');
                this.elements.centerSection.appendChild(this.elements.timerText);
            }
            this.elements.timerText.textContent = time;
        }
 
        /**
         * Updates the right section based on session state
         * @param {boolean} isSessionStarted - Whether a session is in progress
         * @returns {Object} References to created buttons
         */
        updateRightSection(isSessionStarted = false) {
            this.elements.rightSection.innerHTML = '';
 
            const buttonsContainer = DOMUtils.createElement('div', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }
            });
 
            if (isSessionStarted) {
                this.createStatusButtonsContainer(buttonsContainer);
            }
 
            const { sessionButton, settingsButton } = this.createControlButtons(isSessionStarted);
            buttonsContainer.append(sessionButton, settingsButton);
            this.elements.rightSection.appendChild(buttonsContainer);
 
            return { sessionButton, settingsButton };
        }
 
        /**
         * Creates status buttons container
         * @private
         * @param {HTMLElement} container - Parent container
         */
        createStatusButtonsContainer(container) {
            this.elements.statusButtons = DOMUtils.createElement('div', {
                style: {
                    display: 'flex',
                    gap: '10px',
                    marginRight: '10px'
                }
            });
            container.appendChild(this.elements.statusButtons);
        }
 
        /**
         * Creates control buttons
         * @private
         * @param {boolean} isSessionStarted - Whether a session is in progress
         * @returns {Object} References to created buttons
         */
        createControlButtons(isSessionStarted) {
            const sessionButton = DOMUtils.createElement('button', {
                style: TopBar.STYLES.BUTTON
            }, isSessionStarted ? 'Arrêter la session' : 'Commencer une session');
 
            const settingsButton = DOMUtils.createElement('button', {
                style: { ...TopBar.STYLES.BUTTON, backgroundColor: '#95a5a6' }
            }, 'Paramètres');
 
            settingsButton.addEventListener('click', () => SettingsDialog.open());
 
            return { sessionButton, settingsButton };
        }
 
        /**
         * Gets the status buttons container
         * @returns {HTMLElement} Status buttons container
         */
        getStatusButtonsContainer() {
            return this.elements.statusButtons;
        }
    }
 
    /**
    * Manages the main toolbar functionality and session control
    * Coordinates between TopBar, Scraper, and Session management
    */
    class PhoningSessionToolbar {
        /**
         * Configuration constants
         * @private
         * @static
         */
        static CONFIG = {
            REQUIRED_SETTINGS: {
                API_KEY: 'pipedriveApiKey',
                SALESPERSON: 'selectedSalesperson',
                SLACK_WEBHOOK: 'slackWebhookUrl'
            },
            NOTIFICATION_COLORS: {
                success: '#2ecc71',
                error: '#e74c3c',
                info: '#3498db'
            }
        };
 
        /**
         * Initialize the toolbar and its components
         */
        constructor() {
            /**
             * TopBar instance
             * @type {TopBar}
             */
            this.topbar = new TopBar();
 
            /**
             * Scraper instance
             * @type {CompanyDataScraper}
             */
            this.scraper = null;
 
            this.initializeScraper();
            this.addEventListeners();
        }
 
        /**
         * Initializes the data scraper
         * @private
         */
        initializeScraper() {
            this.scraper = new CompanyDataScraper(this);
        }
 
        /**
         * Adds event listeners to session controls
         * @private
         */
        addEventListeners() {
            const { sessionButton } = this.topbar.updateRightSection(false);
            sessionButton.addEventListener('click', () => this.toggleSession());
        }
 
        /**
         * Toggles the session state between started and stopped
         * @private
         */
        toggleSession() {
            const isSessionStarted = PhoningSession.startTime !== null;
            if (!isSessionStarted) {
                this.startSession();
            } else {
                this.confirmAndStopSession();
            }
        }
 
        /**
         * Starts a new phoning session
         * @private
         */
        startSession() {
            if (!this.validateConfiguration()) {
                this.showNotification(
                    'Veuillez configurer tous les paramètres requis avant de démarrer une session',
                    'error'
                );
                return;
            }
 
            this.initializeSession();
            this.updateUIForStartedSession();
        }
 
        /**
         * Validates required configuration settings
         * @private
         * @returns {boolean} True if all required settings are present
         */
        validateConfiguration() {
            const { REQUIRED_SETTINGS } = PhoningSessionToolbar.CONFIG;
            return Object.values(REQUIRED_SETTINGS)
                .every(key => localStorage.getItem(key));
        }
 
        /**
         * Initializes session state and components
         * @private
         */
        initializeSession() {
            PhoningSession.start();
        }
 
        /**
         * Updates UI elements for started session
         * @private
         */
        updateUIForStartedSession() {
            this.topbar.updateWelcomeMessage(true);
            this.topbar.updateCenterMessage(true);
            const { sessionButton } = this.topbar.updateRightSection(true);
            sessionButton.addEventListener('click', () => this.toggleSession());
            PersistentStatusButtons.show(this.scraper);
        }
 
        /**
         * Confirms and stops the current session
         * @private
         */
        confirmAndStopSession() {
            if (confirm('Es-tu vraiment sûr de vouloir arrêter la session ? ')) {
                this.stopSession();
            }
        }
 
        /**
         * Stops the current session and updates UI
         * @private
         */
        stopSession() {
            PhoningSession.stop();
            this.updateUIForStoppedSession();
        }
 
        /**
         * Updates UI elements for stopped session
         * @private
         */
        updateUIForStoppedSession() {
            this.topbar.updateWelcomeMessage(false);
            this.topbar.updateCenterMessage(false);
            const { sessionButton } = this.topbar.updateRightSection(false);
            sessionButton.addEventListener('click', () => this.toggleSession());
            PersistentStatusButtons.hide();
        }
 
        /**
         * Shows a notification message
         * @param {string} message - Message to display
         * @param {string} [type='info'] - Notification type (success, error, info)
         */
        showNotification(message, type = 'info') {
            const notification = DOMUtils.createElement('div', {
                style: {
                    position: 'fixed',
                    bottom: '20px', // Changé de top à bottom
                    left: '20px',   // Changé de right à left
                    backgroundColor: PhoningSessionToolbar.CONFIG.NOTIFICATION_COLORS[type],
                    color: 'white',
                    padding: '15px',
                    borderRadius: '5px',
                    zIndex: 10000,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    maxWidth: '300px',
                    wordWrap: 'break-word',
                    opacity: '1',
                    transition: 'opacity 0.5s ease-out'
                }
            }, message);
 
            document.body.appendChild(notification);
 
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }, 3000);
        }
    }
 
    /**
     * Main application entry point
     * Coordinates initialization and management of all application components
     */
    const App = {
        /**
         * Reference to the main toolbar
         * @type {PhoningSessionToolbar}
         */
        toolbar: null,
 
        /**
         * Initializes the application
         */
        init() {
            try {
                console.log('🚀 Initializing Application...');
                this.assignGlobalReference();
                this.setupErrorHandling();
                this.initializeComponents();
                this.restoreSession();
                this.setupEventListeners();
            } catch (error) {
                console.error('❌ Application initialization failed:', error);
                this.handleInitializationError(error);
            }
        },
 
        /**
         * Assigns the app instance to window for global access
         * @private
         */
        assignGlobalReference() {
            window.phoningApp = this;
        },
 
        /**
         * Sets up global error handling
         * @private
         */
        setupErrorHandling() {
            window.onerror = (msg, url, line, col, error) => {
                console.error('Global error:', {
                    message: msg,
                    url,
                    line,
                    column: col,
                    error,
                    timestamp: new Date().toISOString()
                });
                return false;
            };
        },
 
        /**
         * Initializes main application components
         * @private
         */
        initializeComponents() {
            try {
                console.log('⚙️ Initializing components...');
                PhoningSession.init();
                this.toolbar = new PhoningSessionToolbar();
            } catch (error) {
                console.error('❌ Component initialization failed:', error);
                throw error;
            }
        },
 
        /**
         * Restores previous session if exists
         * @private
         */
        restoreSession() {
            console.log('🔄 Checking for previous session...');
            const savedStartTime = localStorage.getItem('phoningSessionStart');
 
            if (savedStartTime && this.toolbar) {
                this.restoreSessionState(parseInt(savedStartTime, 10));
            }
        },
 
        /**
         * Restores specific session state
         * @private
         * @param {number} startTime - Session start timestamp
         */
        restoreSessionState(startTime) {
            try {
                PhoningSession.startTime = startTime;
                this.updateUIForRestoredSession();
                this.startSessionTimer();
                PersistentStatusButtons.show(this.toolbar.scraper);
            } catch (error) {
                console.error('❌ Session restoration failed:', error);
                this.handleSessionRestorationError(error);
            }
        },
 
        /**
         * Updates UI elements for restored session
         * @private
         */
        updateUIForRestoredSession() {
            const { sessionButton } = this.toolbar.topbar.updateRightSection(true);
            sessionButton.addEventListener('click', () => this.toolbar.toggleSession());
            this.toolbar.topbar.updateWelcomeMessage(true);
            this.toolbar.topbar.updateCenterMessage(true);
        },
 
        /**
         * Starts the session timer
         * @private
         */
        startSessionTimer() {
            PhoningSession.updateTimer();
            PhoningSession.timerInterval = setInterval(
                () => PhoningSession.updateTimer(),
                1000
            );
        },
 
        /**
         * Sets up application-wide event listeners
         * @private
         */
        setupEventListeners() {
            console.log('🎯 Setting up event listeners...');
 
            window.addEventListener('unload', () => {
                if (PhoningSession.timerInterval) {
                    clearInterval(PhoningSession.timerInterval);
                }
            });
 
            // Add additional event listeners as needed
        },
 
        /**
         * Handles initialization errors
         * @private
         * @param {Error} error - Error object
         */
        handleInitializationError(error) {
            // Add any specific error handling for initialization
            if (this.toolbar) {
                this.toolbar.showNotification(
                    'Erreur d\'initialisation de l\'application',
                    'error'
                );
            }
        },
 
        /**
         * Handles session restoration errors
         * @private
         * @param {Error} error - Error object
         */
        handleSessionRestorationError(error) {
            console.warn('⚠️ Session restoration failed, starting fresh...');
            localStorage.removeItem('phoningSessionStart');
            if (this.toolbar) {
                this.toolbar.showNotification(
                    'Impossible de restaurer la session précédente',
                    'error'
                );
            }
        }
    };
 
    // Initialize the application when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }
})();