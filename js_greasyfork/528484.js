// ==UserScript==
// @name         LATAM Flight Scraper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scrape LATAM Airlines flight information
// @author       Your Name
// @match        https://www.latamairlines.com/*/*
// @match        https://www.latamairlines.com/*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require      https://cdn.jsdelivr.net/npm/daterangepicker@3.1.0/daterangepicker.min.js
// @resource     DATERANGEPICKER_CSS https://cdn.jsdelivr.net/npm/daterangepicker@3.1.0/daterangepicker.css
// @resource     JQUERYUI_CSS https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css
// @downloadURL https://update.greasyfork.org/scripts/528484/LATAM%20Flight%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/528484/LATAM%20Flight%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Selector configuration for HTML elements
    const SELECTORS = {
        // Flight cards and information
        flightCards: {
            main: '[data-testid^="flight-card-"], [data-testid^="flight-info-"], [data-testid^="wrapper-card-flight-"]',
            clickable: '[data-testid$="-select-flight"], [data-testid$="-select-cabin"], button[data-testid*="-flight-"], [role="button"][data-testid*="-flight-"], [data-testid*="select"], [data-testid*="choose"], button[data-testid*="select"], button[data-testid*="choose"]',
            origin: {
                container: '[data-testid$="-origin"]',
                time: '.flightInfostyles__TextHourFlight-sc__sc-edlvrg-4',
                airport: '.flightInfostyles__TextIATA-sc__sc-edlvrg-5'
            },
            destination: {
                container: '[data-testid$="-destination"]',
                time: '.flightInfostyles__TextHourFlight-sc__sc-edlvrg-4',
                nextDay: '.flightInfostyles__TextDaysDifference-sc__sc-edlvrg-6',
                airport: '.flightInfostyles__TextIATA-sc__sc-edlvrg-5'
            },
            duration: '[data-testid$="-duration"] span:last-child',
            price: {
                container: '[data-testid$="-amount"]',
                amount: '.displayCurrencystyle__CurrencyAmount-sc__sc-hel5vp-2',
                description: '.displayCurrencystyle__Description-sc__sc-hel5vp-5',
                taxes: '.flightInfostyles__TaxesFeesIncludedText-sc__sc-edlvrg-10'
            }
        },
        // Tariff selection
        tariffs: {
            list: 'ol',
            item: 'li[data-brand]',
            selectButton: 'button[data-testid$="-flight-select"]'
        },
        // Page elements
        page: {
            returnTitle: '#titleSelectFlightDesktop .route-title',
            errorMessage: '.error-message, .error-title, .error-description'
        }
    };

    // Save selector configuration
    function saveSelectors() {
        GM_setValue('scraperSelectors', JSON.stringify(SELECTORS));
    }

    // Load saved selectors
    function loadSelectors() {
        const savedSelectors = GM_getValue('scraperSelectors');
        if (savedSelectors) {
            try {
                Object.assign(SELECTORS, JSON.parse(savedSelectors));
                logger.log('Loaded custom selectors', 'info');
            } catch (e) {
                logger.log('Error loading custom selectors: ' + e.message, 'error');
            }
        }
    }

    // Function to update selectors
    function updateSelectors(newSelectors) {
        try {
            Object.assign(SELECTORS, newSelectors);
            saveSelectors();
            logger.log('Updated selectors successfully', 'success');
        } catch (e) {
            logger.log('Error updating selectors: ' + e.message, 'error');
        }
    }

    // Add daterangepicker and jQuery UI CSS
    GM_addStyle(GM_getResourceText('DATERANGEPICKER_CSS'));
    GM_addStyle(GM_getResourceText('JQUERYUI_CSS'));
    
    // Add custom CSS for z-index fixes and resizable styles
    GM_addStyle(`
        .daterangepicker {
            z-index: 100000 !important;
        }
        .ui-resizable-handle {
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
        .ui-resizable-se {
            width: 12px;
            height: 12px;
            right: -5px;
            bottom: -5px;
            background-color: #fff;
            box-shadow: 0 0 3px rgba(0,0,0,0.2);
        }
        #scraper-container {
            min-width: 300px;
            min-height: 400px;
            resize: both;
            overflow: auto;
        }
        .scraper-header {
            cursor: move;
            padding: 8px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            margin: -15px -15px 15px -15px;
            border-radius: 5px 5px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .scraper-header h3 {
            margin: 0;
            font-size: 16px;
            color: #495057;
        }
        .form-content {
            overflow-y: auto;
            height: calc(100% - 50px);
            padding-right: 5px;
        }
        .form-content::-webkit-scrollbar {
            width: 8px;
        }
        .form-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        .form-content::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        .form-content::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        .status-section {
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 9999;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            width: 300px;
            font-family: Arial, sans-serif;
        }
        .status-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ccc;
        }
        .status-content {
            max-height: 200px;
            overflow-y: auto;
        }
        .status-item {
            margin: 5px 0;
            padding: 5px;
            border-radius: 3px;
        }
        .status-success {
            background-color: #d4edda;
            color: #155724;
        }
        .status-error {
            background-color: #f8d7da;
            color: #721c24;
        }
        .status-warning {
            background-color: #fff3cd;
            color: #856404;
        }
        .status-info {
            background-color: #cce5ff;
            color: #004085;
        }
        .step-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 5px;
        }
        .step-success { background-color: #28a745; }
        .step-error { background-color: #dc3545; }
        .step-pending { background-color: #ffc107; }
        .step-inactive { background-color: #6c757d; }
    `);

    // Ensure jQuery is loaded and available
    let $ = window.jQuery || unsafeWindow.jQuery;

    // Configuration object to store search parameters
    const config = {
        searches: [],
        currentSearchIndex: 0,
        currentDateIndex: 0,
        isProcessing: false,
        results: []
    };

    // Load saved state
    function loadState() {
        const savedState = GM_getValue('scraperState');
        if (savedState) {
            Object.assign(config, JSON.parse(savedState));
            logger.log('Loaded saved state', 'info');
            logger.log(`Current search: ${config.currentSearchIndex}, Current date: ${config.currentDateIndex}`);
            logger.log(`Results collected so far: ${config.results.length}`);
        }
    }

    // Save current state
    function saveState() {
        // Create a clean copy of the state without DOM elements
        const cleanState = {
            searches: config.searches.map(search => ({
                ...search,
                // Remove any potential DOM references
                selectedCard: undefined,
                element: undefined
            })),
            currentSearchIndex: config.currentSearchIndex,
            currentDateIndex: config.currentDateIndex,
            isProcessing: config.isProcessing,
            // Only save the serializable parts of the results
            results: config.results.map(result => {
                const cleanResult = { ...result };
                // Remove any DOM references or circular structures
                delete cleanResult.element;
                delete cleanResult.selectedCard;
                return cleanResult;
            })
        };

        try {
            GM_setValue('scraperState', JSON.stringify(cleanState));
            logger.log('State saved successfully', 'info');
        } catch (error) {
            logger.log(`Error saving state: ${error.message}`, 'error');
            // If there's an error, try to save a minimal state
            const minimalState = {
                currentSearchIndex: config.currentSearchIndex,
                currentDateIndex: config.currentDateIndex,
                isProcessing: config.isProcessing
            };
            try {
                GM_setValue('scraperState', JSON.stringify(minimalState));
                logger.log('Saved minimal state as fallback', 'warning');
            } catch (e) {
                logger.log('Failed to save even minimal state', 'error');
            }
        }
    }

    // Clear saved state
    function clearState() {
        GM_deleteValue('scraperState');
        Object.assign(config, {
            searches: [],
            currentSearchIndex: 0,
            currentDateIndex: 0,
            isProcessing: false,
            results: []
        });
        logger.log('State cleared', 'info');
    }

    // Logger class for tracking progress and issues
    class Logger {
        constructor() {
            this.container = null;
            this.logArea = null;
            this.maxLogs = 100;
            this.setupLogger();
        }

        setupLogger() {
            // Create logger container
            this.container = document.createElement('div');
            this.container.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                z-index: 9999;
                background: white;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                width: 400px;
                max-height: 300px;
                display: flex;
                flex-direction: column;
            `;

            // Add header
            const header = document.createElement('div');
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                border-bottom: 1px solid #ccc;
                padding-bottom: 5px;
            `;
            
            const title = document.createElement('span');
            title.textContent = 'Scraper Log';
            title.style.fontWeight = 'bold';

            const clearButton = document.createElement('button');
            clearButton.textContent = 'Clear';
            clearButton.style.cssText = `
                padding: 2px 8px;
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            `;
            clearButton.onclick = () => this.clear();

            header.appendChild(title);
            header.appendChild(clearButton);
            this.container.appendChild(header);

            // Create log area
            this.logArea = document.createElement('div');
            this.logArea.style.cssText = `
                overflow-y: auto;
                font-family: monospace;
                font-size: 12px;
                white-space: pre-wrap;
                flex-grow: 1;
            `;
            this.container.appendChild(this.logArea);

            // Add to document
            document.body.appendChild(this.container);
        }

        log(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.style.cssText = `
                margin: 2px 0;
                padding: 2px 5px;
                border-radius: 3px;
            `;

            switch(type) {
                case 'error':
                    logEntry.style.backgroundColor = '#ffebee';
                    logEntry.style.color = '#c62828';
                    break;
                case 'success':
                    logEntry.style.backgroundColor = '#e8f5e9';
                    logEntry.style.color = '#2e7d32';
                    break;
                case 'warning':
                    logEntry.style.backgroundColor = '#fff3e0';
                    logEntry.style.color = '#ef6c00';
                    break;
                default:
                    logEntry.style.backgroundColor = '#e3f2fd';
                    logEntry.style.color = '#1565c0';
            }

            logEntry.textContent = `[${timestamp}] ${message}`;
            this.logArea.appendChild(logEntry);
            this.logArea.scrollTop = this.logArea.scrollHeight;

            // Limit the number of log entries
            while (this.logArea.children.length > this.maxLogs) {
                this.logArea.removeChild(this.logArea.firstChild);
            }

            // Also log to console for debugging
            console.log(`[${type.toUpperCase()}] ${message}`);
        }

        clear() {
            while (this.logArea.firstChild) {
                this.logArea.removeChild(this.logArea.firstChild);
            }
        }
    }

    // Create logger instance
    const logger = new Logger();

    // Helper function to format dates
    function formatDate(date) {
        // Ensure we're working with a valid date string in YYYY-MM-DD format
        if (typeof date === 'string') {
            // If it's already in YYYY-MM-DD format, return as is
            if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return date;
            }
            // If it's a Date object, convert to YYYY-MM-DD
            date = new Date(date);
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Generate array of dates between start and end
    function generateDateRange(startDate, endDate) {
        const dates = [];
        const start = moment(startDate).startOf('day');
        const end = moment(endDate).endOf('day');
        
        const current = start.clone();
        while (current.isSameOrBefore(end, 'day')) {
            dates.push(current.format('YYYY-MM-DD'));
            current.add(1, 'days');
        }

        return dates;
    }

    // Generate all possible date combinations for round trips
    function generateDateCombinations(outboundDates, returnDates) {
        const combinations = [];
        
        const outboundRange = generateDateRange(outboundDates.start, outboundDates.end);
        const returnRange = generateDateRange(returnDates.start, returnDates.end);
        
        for (const outboundDate of outboundRange) {
            const outboundDateTime = new Date(outboundDate);
            outboundDateTime.setUTCHours(0, 0, 0, 0);
            
            for (const returnDate of returnRange) {
                const returnDateTime = new Date(returnDate);
                returnDateTime.setUTCHours(0, 0, 0, 0);
                
                if (returnDateTime > outboundDateTime) {
                    combinations.push({
                        outbound: outboundDate,
                        return: returnDate
                    });
                }
            }
        }
        
        combinations.sort((a, b) => {
            const dateCompare = new Date(a.outbound) - new Date(b.outbound);
            if (dateCompare === 0) {
                return new Date(a.return) - new Date(b.return);
            }
            return dateCompare;
        });

        return combinations;
    }

    // Function to check if flight cards are present
    function waitForFlightCards(maxAttempts = 10) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            
            const checkForCards = () => {
                logger.log(`Checking for flight cards (attempt ${attempts + 1}/${maxAttempts})...`, 'info');
                const flightCards = document.querySelectorAll(SELECTORS.flightCards.main);
                
                if (flightCards.length > 0) {
                    logger.log(`Found ${flightCards.length} flight cards`, 'success');
                    resolve(true);
                } else if (attempts >= maxAttempts) {
                    logger.log('Max attempts reached, no flight cards found', 'error');
                    resolve(false);
                } else {
                    attempts++;
                    logger.log('No flight cards found yet, retrying...', 'info');
                    setTimeout(checkForCards, 2000);
                }
            };
            
            checkForCards();
        });
    }

    // Helper function to parse price values
    function parsePriceValue(price) {
        if (!price) {
            logger.log('Empty price value received', 'warning');
            return Infinity;
        }
        
        logger.log(`Parsing price value: "${price}"`, 'info');
        
        if (price.includes('milhas')) {
            // Handle points format: "130.000 milhas + R$ 63,90"
            const pointsMatch = price.match(/(\d+[.,\d]*)\s*milhas/);
            if (pointsMatch) {
                const pointsValue = parseFloat(pointsMatch[1].replace(/\./g, '').replace(',', '.'));
                logger.log(`Parsed points value: ${pointsValue}`, 'info');
                return pointsValue;
            }
            logger.log('Failed to parse points value', 'warning');
            return Infinity;
        } else {
            // Handle regular price format: "R$ 2.530,90"
            const priceMatch = price.match(/R\$\s*(\d+[.,\d]*)/);
            if (priceMatch) {
                // First remove dots (thousand separators), then replace comma with dot for decimal
                const priceValue = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'));
                logger.log(`Parsed price value: ${priceValue}`, 'info');
                return priceValue;
            }
            logger.log('Failed to parse regular price value', 'warning');
            return Infinity;
        }
    }

    // Extract flight information from the page and select cheapest flight
    function extractFlightInfo() {
        try {
            logger.log('Starting flight information extraction...', 'info');
            const flightCards = document.querySelectorAll(SELECTORS.flightCards.main);
            logger.log(`Found ${flightCards.length} flight cards`, 'info');

            if (!flightCards.length) {
                logger.log('No flight cards found on the page', 'warning');
                return { flights: [], selectedCard: null, selectedCardIndex: -1 };
            }

            const flights = [];
            let selectedCard = null;
            let lowestPrice = Infinity;
            let lowestPriceIndex = -1;

            flightCards.forEach((card, index) => {
                try {
                    const priceElement = card.querySelector(SELECTORS.flightCards.price.amount);
                    if (!priceElement) {
                        logger.log(`No price element found for card ${index}`, 'warning');
                        return;
                    }

                    const priceText = priceElement.textContent.trim();
                    logger.log(`Processing card ${index} with price text: ${priceText}`, 'debug');

                    const priceValue = parsePriceValue(priceText);
                    logger.log(`Parsed price value: ${priceValue}`, 'info');

                    if (priceValue < lowestPrice) {
                        lowestPrice = priceValue;
                        selectedCard = card;
                        lowestPriceIndex = index;
                        logger.log(`New lowest price found: ${priceText} (${priceValue}) at index ${index}`, 'info');
                    }

                    // Extract other flight information
                    const originInfo = card.querySelector(SELECTORS.flightCards.origin.container);
                    const departureTime = originInfo?.querySelector(SELECTORS.flightCards.origin.time)?.textContent.trim();
                    const originAirport = originInfo?.querySelector(SELECTORS.flightCards.origin.airport)?.textContent.trim();

                    const destinationInfo = card.querySelector(SELECTORS.flightCards.destination.container);
                    const arrivalTimeElement = destinationInfo?.querySelector(SELECTORS.flightCards.destination.time);
                    let arrivalTime = arrivalTimeElement?.textContent.trim();
                    const nextDayIndicator = arrivalTimeElement?.querySelector(SELECTORS.flightCards.destination.nextDay)?.textContent.trim();
                    const destinationAirport = destinationInfo?.querySelector(SELECTORS.flightCards.destination.airport)?.textContent.trim();

                    const duration = card.querySelector(SELECTORS.flightCards.duration)?.textContent.trim();

                    const priceInfo = card.querySelector(SELECTORS.flightCards.price.container);
                    let price = '';
                    let taxInfo = '';
                    
                    if (document.getElementById('use_points')?.checked) {
                        // Points format
                        const pointsAmount = priceInfo?.querySelector(SELECTORS.flightCards.price.amount)?.textContent.trim();
                        const additionalFees = priceInfo?.querySelector(SELECTORS.flightCards.price.description)?.textContent.trim();
                        price = `${pointsAmount || ''} ${additionalFees || ''}`.trim();
                        logger.log(`Extracted points price: "${price}"`, 'info');
                    } else {
                        // Regular price format
                        price = priceInfo?.querySelector(SELECTORS.flightCards.price.amount)?.textContent.trim() || '';
                        logger.log(`Extracted regular price: "${price}"`, 'info');
                    }

                    // Get taxes info if available
                    taxInfo = priceInfo?.querySelector(SELECTORS.flightCards.price.taxes)?.textContent.trim();

                    const currentSearch = config.searches[config.currentSearchIndex];
                    const flightInfo = {
                        combination_id: `${currentSearch.origin}_${currentSearch.destination}_${currentSearch.currentDate}_${currentSearch.currentReturnDate || ''}_${document.getElementById('use_points')?.checked}_${currentSearch.trip_type}`,
                        trip_type: currentSearch.trip_type,
                        flight_type: currentSearch.trip_type === 'round_trip' ? (document.querySelector(SELECTORS.page.returnTitle)?.textContent.trim().toLowerCase() === 'voo de volta' ? 'return' : 'outbound') : 'one_way',
                        outbound_date: currentSearch.currentDate,
                        return_date: currentSearch.trip_type === 'round_trip' ? currentSearch.currentReturnDate : '',
                        date: currentSearch.trip_type === 'round_trip' ? currentSearch.currentReturnDate : currentSearch.currentDate,
                        origin: originAirport || (currentSearch.trip_type === 'round_trip' ? currentSearch.destination : currentSearch.origin),
                        destination: destinationAirport || (currentSearch.trip_type === 'round_trip' ? currentSearch.origin : currentSearch.destination),
                        departure_time: departureTime,
                        arrival_time: arrivalTime,
                        next_day: nextDayIndicator ? true : false,
                        duration: duration,
                        price: price,
                        taxes_included: taxInfo ? true : false,
                        use_points: document.getElementById('use_points')?.checked || false,
                        raw_price_value: priceValue,
                        card_index: index // Store the index instead of the DOM element
                    };

                    flights.push(flightInfo);
                } catch (e) {
                    logger.log(`Error extracting flight ${index + 1}: ${e.message}`, 'error');
                }
            });

            if (selectedCard) {
                logger.log(`Selected cheapest flight at index ${lowestPriceIndex} with price: ${lowestPrice}`, 'success');
                return { 
                    flights,
                    selectedCard,
                    selectedCardIndex: lowestPriceIndex // Return the index for reference
                };
            } else {
                logger.log('No flight cards found with valid prices', 'warning');
                return { flights: [], selectedCard: null, selectedCardIndex: -1 };
            }
        } catch (e) {
            logger.log(`Error extracting flight information: ${e.message}`, 'error');
            return { flights: [], selectedCard: null, selectedCardIndex: -1 };
        }
    }

    // Save results to CSV file
    function saveToCSV() {
        if (!config.results.length) {
            logger.log('No results to save', 'warning');
            return;
        }

        logger.log(`Preparing to save ${config.results.length} flights to CSV`);

        try {
            // Define headers for both outbound and return flights
            const headers = [
                'combination_id',
                'trip_type',
                'use_points',
                'status',
                'retries',
                'total_price',
                // Outbound flight fields
                'outbound_date',
                'outbound_origin',
                'outbound_destination',
                'outbound_departure_time',
                'outbound_arrival_time',
                'outbound_next_day',
                'outbound_duration',
                'outbound_price',
                'outbound_taxes_included',
                // Return flight fields
                'return_date',
                'return_origin',
                'return_destination',
                'return_departure_time',
                'return_arrival_time',
                'return_next_day',
                'return_duration',
                'return_price',
                'return_taxes_included'
            ];
            
            // Create CSV content with proper line endings
            let csvRows = [];
            
            // Add headers
            csvRows.push(headers.join(','));
            
            // Group flights by combination_id
            const flightGroups = {};
            config.results.forEach(flight => {
                logger.log(`Processing flight for CSV: ${JSON.stringify(flight)}`, 'info');
                
                if (!flightGroups[flight.combination_id]) {
                    flightGroups[flight.combination_id] = {
                        outbound: null,
                        return: null,
                        status: flight.status || 'success',
                        retries: flight.retries || 0,
                        trip_type: flight.trip_type,
                        use_points: flight.use_points
                    };
                }
                
                if (flight.status === 'failed') {
                    flightGroups[flight.combination_id].status = 'failed';
                    flightGroups[flight.combination_id].retries = flight.retries;
                } else if (flight.flight_type === 'outbound' || flight.flight_type === 'one_way') {
                    flightGroups[flight.combination_id].outbound = flight;
                } else if (flight.flight_type === 'return') {
                    flightGroups[flight.combination_id].return = flight;
                }
            });

            // Process each flight group into a single row
            Object.entries(flightGroups).forEach(([combinationId, group]) => {
                logger.log(`Processing group ${combinationId} for CSV: ${JSON.stringify(group)}`, 'info');
                
                const outbound = group.outbound;
                const return_flight = group.return;
                const status = group.status;
                const retries = group.retries;
                
                // Calculate total price only for successful searches
                let total_price = '';
                if (status === 'success') {
                    if (outbound?.price) {
                        if (outbound.trip_type === 'one_way') {
                            total_price = outbound.price;
                        } else if (return_flight?.price) {
                            // For round trips, combine prices if both are available
                            if (outbound.use_points) {
                                const outPoints = parsePriceValue(outbound.price);
                                const returnPoints = parsePriceValue(return_flight.price);
                                total_price = `${outPoints + returnPoints} milhas`;
                            } else {
                                const outPrice = parsePriceValue(outbound.price);
                                const returnPrice = parsePriceValue(return_flight.price);
                                total_price = `R$ ${(outPrice + returnPrice).toFixed(2)}`;
                            }
                        }
                    }
                }

                const row = [
                    combinationId,
                    group.trip_type || '',
                    group.use_points ? 'Yes' : 'No',
                    status,
                    retries,
                    total_price,
                    // Outbound flight data
                    outbound?.outbound_date || '',
                    outbound?.origin || '',
                    outbound?.destination || '',
                    outbound?.departure_time || '',
                    outbound?.arrival_time || '',
                    outbound?.next_day ? 'Yes' : 'No',
                    outbound?.duration || '',
                    outbound?.price || '',
                    outbound?.taxes_included ? 'Yes' : 'No',
                    // Return flight data
                    return_flight?.date || '',
                    return_flight?.origin || '',
                    return_flight?.destination || '',
                    return_flight?.departure_time || '',
                    return_flight?.arrival_time || '',
                    return_flight?.next_day ? 'Yes' : 'No',
                    return_flight?.duration || '',
                    return_flight?.price || '',
                    return_flight?.taxes_included ? 'Yes' : 'No'
                ].map(value => {
                    // Handle values that might contain commas or quotes
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                });

                csvRows.push(row.join(','));
            });

            // Create the final CSV content with BOM for Excel
            const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
            const csvContent = csvRows.join('\r\n');
            const blob = new Blob([BOM, csvContent], { type: 'text/csv;charset=utf-8' });
            
            // Generate filename using the first flight's information
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const firstResult = config.results[0];
            const filename = `flights_${firstResult.origin}_${firstResult.destination}_${firstResult.use_points ? 'points' : 'cash'}_${firstResult.trip_type}_${timestamp}.csv`;

            // Create object URL and trigger download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            logger.log(`Successfully saved results to ${filename}`, 'success');
        } catch (e) {
            logger.log(`Error saving CSV: ${e.message}`, 'error');
            console.error('Full error:', e);
            console.log('Results being processed:', config.results);
        }
    }

    // Process next search or date
    function processNext() {
        if (!config.isProcessing) {
            logger.log('Processing is not active', 'info');
            return;
        }

        const currentSearch = config.searches[config.currentSearchIndex];
        if (!currentSearch) {
            logger.log('All searches completed', 'success');
            config.isProcessing = false;
            saveState();
            saveToCSV();
            clearState();  // Clear state after completion
            return;
        }

        logger.log(`Processing search ${config.currentSearchIndex + 1} of ${config.searches.length}`, 'info');

        let datesToProcess;
        if (currentSearch.trip_type === 'round_trip') {
            // For round trips, generate all date combinations if not already generated
            if (!currentSearch.dateCombinations) {
                currentSearch.dateCombinations = generateDateCombinations(
                    currentSearch.outbound_dates,
                    currentSearch.return_dates
                );
                logger.log(`Generated ${currentSearch.dateCombinations.length} date combinations for round trip`, 'info');
            }
            datesToProcess = currentSearch.dateCombinations;
        } else {
            // For one-way trips, generate all dates in the range if not already generated
            if (!currentSearch.dateRange) {
                currentSearch.dateRange = generateDateRange(
                    currentSearch.outbound_dates.start,
                    currentSearch.outbound_dates.end
                );
                logger.log(`Generated ${currentSearch.dateRange.length} dates for one-way trip`, 'info');
            }
            datesToProcess = currentSearch.dateRange.map(date => ({ outbound: date }));
        }

        if (config.currentDateIndex >= datesToProcess.length) {
            logger.log(`Completed search for ${currentSearch.origin} to ${currentSearch.destination}`, 'success');
            config.currentSearchIndex++;
            config.currentDateIndex = 0;
            saveState();
            processNext();
            return;
        }

        const currentDateCombo = datesToProcess[config.currentDateIndex];
        currentSearch.currentDate = currentDateCombo.outbound;
        if (currentSearch.trip_type === 'round_trip') {
            currentSearch.currentReturnDate = currentDateCombo.return;
            logger.log(`Processing combination ${config.currentDateIndex + 1} of ${datesToProcess.length}`, 'info');
        } else {
            logger.log(`Processing date ${config.currentDateIndex + 1} of ${datesToProcess.length}`, 'info');
        }
        
        logger.log(`Processing ${currentSearch.origin} to ${currentSearch.destination}`, 'info');
        logger.log(`Outbound: ${currentSearch.currentDate}${currentSearch.trip_type === 'round_trip' ? `, Return: ${currentSearch.currentReturnDate}` : ''}`, 'info');

        // Save state before navigation
        saveState();

        // Construct URL for the current search
        const baseUrl = 'https://www.latamairlines.com/br/pt/oferta-voos';
        
        // Create params in the exact order as LATAM's website
        const params = new URLSearchParams();
        params.append('origin', currentSearch.origin);
        params.append('outbound', `${currentSearch.currentDate}T00:00:00.000Z`);
        params.append('destination', currentSearch.destination);
        
        // For round trips, add inbound date right after destination
        if (currentSearch.trip_type === 'round_trip') {
            params.append('inbound', `${currentSearch.currentReturnDate}T00:00:00.000Z`);
        }
        
        // Add remaining parameters in LATAM's order
        params.append('adt', '1');
        params.append('chd', '0');
        params.append('inf', '0');
        params.append('trip', currentSearch.trip_type === 'round_trip' ? 'RT' : 'OW');
        params.append('cabin', currentSearch.cabin_class);
        params.append('redemption', currentSearch.use_points.toString());
        params.append('sort', 'RECOMMENDED');

        const url = `${baseUrl}?${params.toString()}`;
        window.location.href = url;
    }

    // Main function to start scraping
    function startScraping(searchConfig) {
        logger.log('Starting new scraping session', 'info');
        logger.log(`Loaded ${searchConfig.searches.length} searches to process`);
        
        // Clear any existing state
        clearState();
        
        config.searches = searchConfig.searches;
        config.currentSearchIndex = 0;
        config.currentDateIndex = 0;
        config.isProcessing = true;
        config.results = [];

        // Save initial state
        saveState();
        
        processNext();
    }

    // Function to select the cheapest tariff option
    async function selectCheapestTariff() {
        return new Promise((resolve, reject) => {
            let navigationAttempts = 0;
            const maxNavigationAttempts = 20;
            let waitingForButton = true;
            let buttonCheckAttempts = 0;
            const maxButtonCheckAttempts = 10;

            const checkForTariffs = () => {
                logger.log('Checking for tariff list...', 'info');
                
                // Look for the tariff list using the correct selector
                const tariffList = document.querySelector(SELECTORS.tariffs.list);
                if (!tariffList) {
                    logger.log('Tariff list not found, retrying...', 'warning');
                    setTimeout(checkForTariffs, 1000);
                    return;
                }

                // Find all tariff items (li elements)
                const tariffItems = tariffList.querySelectorAll(SELECTORS.tariffs.item);
                logger.log(`Found ${tariffItems.length} tariff items`, 'info');
                
                if (!tariffItems.length) {
                    logger.log('No tariff options found in the list', 'error');
                    resolve(false);
                    return;
                }

                let cheapestTariff = null;
                let cheapestPrice = Infinity;
                let debugPrices = [];

                tariffItems.forEach((item, index) => {
                    // Find the price element within the tariff item
                    const priceElement = item.querySelector(SELECTORS.flightCards.price.amount);
                    if (priceElement) {
                        const priceText = priceElement.textContent.trim();
                        const priceValue = parsePriceValue(priceText);
                        debugPrices.push({ index, priceText, priceValue });
                        
                        if (priceValue < cheapestPrice) {
                            cheapestPrice = priceValue;
                            cheapestTariff = item;
                            logger.log(`New cheapest tariff found: ${priceText} (${priceValue})`, 'info');
                        }
                    } else {
                        logger.log(`No price element found for tariff item ${index}`, 'warning');
                    }
                });

                logger.log('Debug prices found:', 'info');
                debugPrices.forEach(p => {
                    logger.log(`Index ${p.index}: ${p.priceText} (${p.priceValue})`, 'info');
                });

                if (cheapestTariff) {
                    logger.log('Found cheapest tariff, attempting to click...', 'info');
                    
                    const waitForButton = () => {
                        // Log all available buttons for debugging
                        const allButtons = cheapestTariff.querySelectorAll('button');
                        logger.log(`Found ${allButtons.length} buttons in cheapest tariff`, 'info');
                        allButtons.forEach((btn, idx) => {
                            logger.log(`Button ${idx}: ${btn.textContent.trim()} (data-testid: ${btn.getAttribute('data-testid')})`, 'info');
                        });
                        
                        // Find the "Escolher" button using the correct selector
                        const selectButton = cheapestTariff.querySelector(SELECTORS.tariffs.selectButton);
                        
                        if (selectButton) {
                            logger.log('Found select button:', 'info');
                            logger.log(`Button text: ${selectButton.textContent.trim()}`, 'info');
                            logger.log(`Button visibility: ${selectButton.offsetParent !== null ? 'visible' : 'hidden'}`, 'info');
                            logger.log(`Button enabled: ${!selectButton.disabled}`, 'info');
                            
                            if (selectButton.offsetParent !== null) {  // Check if button is visible
                                logger.log('Attempting to click select button...', 'info');
                                try {
                                    selectButton.click();
                                    logger.log('Successfully clicked select button', 'success');
                                    waitingForButton = false;
                                    
                                    // After clicking, wait for return flight page to load
                                    const waitForReturnPage = () => {
                                        logger.log('Waiting for return flight page...', 'info');
                                        
                                        // Check for the specific return flight title
                                        const returnTitle = document.querySelector(SELECTORS.page.returnTitle);
                                        const hasReturnTitle = returnTitle && returnTitle.textContent.trim().toLowerCase() === 'voo de volta';
                                        logger.log(`Return title found: ${hasReturnTitle}`, 'info');
                                        
                                        // Check for return flight cards
                                        const returnCards = document.querySelectorAll(SELECTORS.flightCards.main);
                                        const hasReturnCards = returnCards.length > 0;
                                        logger.log(`Return cards found: ${hasReturnCards} (${returnCards.length} cards)`, 'info');

                                        if (hasReturnTitle && hasReturnCards) {
                                            logger.log('Return flight page loaded successfully', 'success');
                                            
                                            // Extract return flight information
                                            const { flights, selectedCard, selectedCardIndex } = extractFlightInfo();
                                            if (flights && flights.length > 0 && selectedCard) {
                                                logger.log(`Extracted ${flights.length} flights for one-way trip`);
                                                config.results.push(...flights);
                                                logger.log(`Successfully extracted ${flights.length} return flights`, 'success');
                                                saveState();
                                                
                                                // Move to next date
                                                config.currentDateIndex++;
                                                logger.log('Moving to next date after saving return flight info...');
                                                saveState();
                                                setTimeout(processNext, 2000);
                                            } else {
                                                logger.log('Failed to extract return flights, moving to next date', 'error');
                                                config.currentDateIndex++;
                                                saveState();
                                                setTimeout(processNext, 2000);
                                            }
                                            
                                            resolve(true);
                                            return;
                                        }

                                        if (navigationAttempts >= maxNavigationAttempts) {
                                            logger.log('Max attempts reached waiting for return flight page', 'error');
                                            resolve(false);
                                            return;
                                        }

                                        navigationAttempts++;
                                        setTimeout(waitForReturnPage, 1000);
                                    };
                                    
                                    setTimeout(waitForReturnPage, 1000);
                                    return;
                                } catch (error) {
                                    logger.log(`Error clicking select button: ${error.message}`, 'error');
                                }
                            } else {
                                logger.log('Select button found but not visible', 'warning');
                            }
                        } else {
                            logger.log('Select button not found in cheapest tariff', 'warning');
                        }

                        if (buttonCheckAttempts >= maxButtonCheckAttempts) {
                            logger.log('Max attempts reached waiting for "Escolher" button', 'error');
                            resolve(false);
                            return;
                        }

                        buttonCheckAttempts++;
                        setTimeout(waitForButton, 1000);
                    };

                    waitForButton();
                } else {
                    logger.log('Could not find cheapest tariff', 'error');
                    resolve(false);
                }
            };

            checkForTariffs();
        });
    }

    // Function to check if we're on the return flight page and wait for it to load
    async function waitForReturnFlightPage(maxAttempts = 20) {
        return new Promise((resolve) => {
            let attempts = 0;
            
            const checkForReturnPage = () => {
                logger.log(`Checking for return flight page (attempt ${attempts + 1}/${maxAttempts})...`, 'info');
                
                // First check for the return flight header
                const returnHeader = document.querySelector('h1, h2, h3, h4, h5, h6');
                const headerText = returnHeader?.textContent.trim() || '';
                const isReturnPage = headerText.includes('voo de volta');
                
                logger.log(`Header check - Found: ${!!returnHeader}, Text: "${headerText}", Is return page: ${isReturnPage}`, 'info');
                
                if (!isReturnPage) {
                    if (attempts >= maxAttempts) {
                        logger.log('Max attempts reached, not on return flight page', 'error');
                        resolve(false);
                        return;
                    }
                    attempts++;
                    setTimeout(checkForReturnPage, 1000);
                    return;
                }

                // Then check for flight cards
                const flightCards = document.querySelectorAll(SELECTORS.flightCards.main);
                const hasFlightCards = flightCards.length > 0;
                logger.log(`Flight cards check - Found: ${hasFlightCards}, Count: ${flightCards.length}`, 'info');

                if (hasFlightCards) {
                    logger.log('Return flight page fully loaded with flight cards', 'success');
                    resolve(true);
                    return;
                }

                if (attempts >= maxAttempts) {
                    logger.log('Return flight page elements not fully loaded after max attempts', 'error');
                    resolve(false);
                    return;
                }

                attempts++;
                setTimeout(checkForReturnPage, 1000);
            };
            
            checkForReturnPage();
        });
    }

    // Function to wait for tariff list to be fully loaded
    function waitForTariffList(maxAttempts = 20) {
        return new Promise((resolve) => {
            let attempts = 0;
            
            const checkForTariffList = () => {
                logger.log(`Checking for tariff list (attempt ${attempts + 1}/${maxAttempts})...`, 'info');
                const tariffList = document.querySelector(SELECTORS.tariffs.list);
                const tariffItems = tariffList?.querySelectorAll(SELECTORS.tariffs.item);
                
                if (tariffItems?.length > 0) {
                    logger.log(`Found ${tariffItems.length} tariff items, checking prices...`, 'info');
                    
                    // Check if all price elements are loaded
                    const priceElements = Array.from(tariffItems).map(item => ({
                        element: item.querySelector(SELECTORS.flightCards.price.amount),
                        price: item.querySelector(SELECTORS.flightCards.price.amount)?.textContent.trim()
                    }));

                    const allPricesLoaded = priceElements.every(p => p.element && p.price);
                    
                    logger.log('Price elements found:', 'info');
                    priceElements.forEach((p, idx) => {
                        logger.log(`Tariff ${idx}: Has element: ${!!p.element}, Price text: ${p.price || 'not found'}`, 'info');
                    });

                    if (allPricesLoaded) {
                        logger.log('All tariff prices loaded successfully', 'success');
                        resolve(true);
                        return;
                    } else {
                        logger.log('Not all prices are loaded yet', 'warning');
                    }
                } else {
                    logger.log(`No tariff items found yet (List found: ${!!tariffList}, Items: ${tariffItems?.length || 0})`, 'info');
                }
                
                if (attempts >= maxAttempts) {
                    logger.log('Max attempts reached waiting for tariff list', 'error');
                    resolve(false);
                    return;
                }
                
                attempts++;
                setTimeout(checkForTariffList, 1000);
            };
            
            checkForTariffList();
        });
    }

    // Create status display
    function createStatusDisplay() {
        const statusContainer = document.createElement('div');
        statusContainer.className = 'status-section';
        statusContainer.innerHTML = `
            <div class="status-header">
                <strong>Scraping Status</strong>
                <button class="minimize-status" style="padding: 2px 8px;">_</button>
            </div>
            <div class="status-content"></div>
        `;

        document.body.appendChild(statusContainer);

        // Add minimize functionality
        const minimizeBtn = statusContainer.querySelector('.minimize-status');
        const statusContent = statusContainer.querySelector('.status-content');
        let isMinimized = false;

        minimizeBtn.addEventListener('click', () => {
            if (isMinimized) {
                statusContent.style.display = 'block';
                minimizeBtn.textContent = '_';
            } else {
                statusContent.style.display = 'none';
                minimizeBtn.textContent = '□';
            }
            isMinimized = !isMinimized;
        });

        return statusContainer;
    }

    // Update status display
    function updateStatus(message, type = 'info', steps = null) {
        const statusContent = document.querySelector('.status-content');
        if (!statusContent) return;

        const statusItem = document.createElement('div');
        statusItem.className = `status-item status-${type}`;
        
        let stepsHtml = '';
        if (steps) {
            stepsHtml = '<div style="margin-top: 5px;">';
            const stepNames = ['Outbound Flight', 'Tariff Selection', 'Return Flight'];
            stepNames.forEach((step, index) => {
                const status = steps[index] === true ? 'success' : 
                             steps[index] === false ? 'error' : 
                             steps[index] === 'pending' ? 'pending' : 'inactive';
                stepsHtml += `
                    <div style="margin: 2px 0;">
                        <span class="step-indicator step-${status}"></span>
                        ${step}: ${steps[index] === true ? '✓' : 
                                 steps[index] === false ? '✗' : 
                                 steps[index] === 'pending' ? '...' : '-'}
                    </div>`;
            });
            stepsHtml += '</div>';
        }

        statusItem.innerHTML = `
            <div>${message}</div>
            ${stepsHtml}
        `;

        statusContent.appendChild(statusItem);
        statusContent.scrollTop = statusContent.scrollHeight;
    }

    // Modified handlePageLoad function with detailed logging
    async function handlePageLoad() {
        logger.log('Page load handler started', 'info');
        loadState();
        
        if (!config.isProcessing) {
            logger.log('Processing is not active, exiting handler', 'info');
            return;
        }

        logger.log('Checking for error messages...', 'info');
        // Check for error message
        const errorDiv = document.querySelector(SELECTORS.page.errorMessage);
        if (errorDiv) {
            const errorText = errorDiv.textContent.trim();
            logger.log(`Found error message: "${errorText}"`, 'warning');
            
            if (errorText.includes('Não foi possível encontrar voos')) {
                const currentSearch = config.searches[config.currentSearchIndex];
                const retryCount = currentSearch.retryCount || 0;

                logger.log(`No flights found for ${currentSearch.origin} to ${currentSearch.destination} on ${currentSearch.currentDate} (Retry ${retryCount}/3)`, 'warning');

                if (retryCount < 3) {
                    currentSearch.retryCount = retryCount + 1;
                    logger.log(`Retrying search (${retryCount + 1}/3)...`, 'info');
                    saveState();
                    setTimeout(processNext, 5000);
                    return;
                } else {
                    logger.log('Max retries reached, recording failed search', 'error');
                    const failedFlight = {
                        combination_id: `${currentSearch.origin}_${currentSearch.destination}_${currentSearch.currentDate}_${currentSearch.currentReturnDate || ''}_${currentSearch.use_points ? 'points' : 'cash'}_${currentSearch.trip_type}`,
                        trip_type: currentSearch.trip_type,
                        flight_type: currentSearch.trip_type === 'round_trip' ? 'outbound' : 'one_way',
                        outbound_date: currentSearch.currentDate,
                        return_date: currentSearch.currentReturnDate || '',
                        date: currentSearch.currentDate,
                        origin: currentSearch.origin,
                        destination: currentSearch.destination,
                        status: 'failed',
                        retries: 3,
                        use_points: currentSearch.use_points
                    };
                    
                    config.results.push(failedFlight);
                    currentSearch.retryCount = 0;
                    config.currentDateIndex++;
                    saveState();
                    setTimeout(processNext, 2000);
                    return;
                }
            }
        }

        logger.log('Waiting for flight cards to appear...', 'info');
        // Wait for flight cards to appear
        const flightCardsFound = await waitForFlightCards();
        
        if (flightCardsFound) {
            const currentSearch = config.searches[config.currentSearchIndex];
            const isRoundTrip = currentSearch.trip_type === 'round_trip';
            
            logger.log(`Processing ${isRoundTrip ? 'round trip' : 'one way'} search for ${currentSearch.origin} to ${currentSearch.destination}`, 'info');
            
            currentSearch.retryCount = 0;

            if (isRoundTrip) {
                const returnTitle = document.querySelector(SELECTORS.page.returnTitle);
                const isReturnPage = returnTitle && returnTitle.textContent.trim().toLowerCase() === 'voo de volta';

                if (isReturnPage) {
                    logger.log('Processing return flight page...', 'info');
                    updateStatus(
                        `Processing return flight for ${currentSearch.destination} to ${currentSearch.origin}`,
                        'info',
                        [true, true, 'pending']
                    );

                    await waitForFlightCards();
                    
                    let retryCount = 0;
                    const maxRetries = 3;
                    
                    while (retryCount < maxRetries) {
                        const { flights, selectedCard, selectedCardIndex } = extractFlightInfo();
                        
                        if (flights && flights.length > 0 && selectedCard) {
                            logger.log(`Successfully extracted ${flights.length} return flight(s)`, 'success');
                            config.results.push(...flights);
                            
                            try {
                                logger.log('Attempting to click return flight card...');
                                
                                // First try the specific clickable selector
                                const clickableElement = selectedCard.querySelector(SELECTORS.flightCards.clickable);
                                if (clickableElement) {
                                    logger.log('Found clickable element with specific selector', 'info');
                                    logger.log(`Clickable element text: "${clickableElement.textContent.trim()}"`, 'info');
                                    logger.log(`Clickable element data-testid: "${clickableElement.getAttribute('data-testid')}"`, 'info');
                                    
                                    // Try clicking the element
                                    clickableElement.click();
                                    logger.log('Successfully clicked return flight card', 'success');
                                    updateStatus(
                                        `Successfully extracted return flight information`,
                                        'success',
                                        [true, true, true]
                                    );
                                    saveState();
                                    config.currentDateIndex++;
                                    setTimeout(processNext, 2000);
                                    return true;
                                } else {
                                    // Fallback to finding any clickable elements
                                    const clickableElements = selectedCard.querySelectorAll('button, [role="button"], a, [tabindex="0"]');
                                    logger.log(`Found ${clickableElements.length} general clickable elements in the card`, 'info');
                                    
                                    // Try to find the most appropriate element to click
                                    let targetElement = null;
                                    
                                    // First try to find a button with "select" or "choose" text
                                    for (const element of clickableElements) {
                                        const text = element.textContent.toLowerCase().trim();
                                        if (text.includes('selecionar') || text.includes('escolher') || text.includes('select') || text.includes('choose')) {
                                            targetElement = element;
                                            logger.log(`Found select/choose button with text: ${text}`, 'info');
                                            break;
                                        }
                                    }
                                    
                                    // If no specific button found, try the first clickable element
                                    if (!targetElement && clickableElements.length > 0) {
                                        targetElement = clickableElements[0];
                                        logger.log('Using first clickable element as fallback', 'info');
                                    }
                                    
                                    // If still no target found, try clicking the card itself
                                    if (!targetElement) {
                                        targetElement = selectedCard;
                                        logger.log('Using card itself as clickable target', 'info');
                                    }

                                    if (targetElement) {
                                        // Try different click methods
                                        logger.log('Attempting click with multiple methods...', 'info');
                                        
                                        try {
                                            // Method 1: Direct click
                                            targetElement.click();
                                            logger.log('Direct click successful', 'success');
                                            updateStatus(
                                                `Successfully extracted return flight information`,
                                                'success',
                                                [true, true, true]
                                            );
                                            saveState();
                                            config.currentDateIndex++;
                                            setTimeout(processNext, 2000);
                                            return true;
                                        } catch (clickError) {
                                            logger.log(`Click attempt error: ${clickError.message}`, 'warning');
                                            // Continue to next retry
                                        }
                                    }
                                }
                            } catch (error) {
                                logger.log(`Error clicking return flight card: ${error.message}`, 'error');
                            }
                        }
                        
                        logger.log(`Return flight extraction attempt ${retryCount + 1} failed`, 'warning');
                        retryCount++;
                        if (retryCount < maxRetries) {
                            updateStatus(`Retrying search (${retryCount}/3)...`, 'warning');
                            logger.log('Waiting before retry...', 'info');
                            await sleep(2000); // Wait 2 seconds before retrying
                        }
                    }
                    
                    if (retryCount === maxRetries) {
                        logger.log('Failed to extract return flight after maximum retries', 'error');
                        updateStatus(
                            `Failed to extract return flight information`,
                            'error',
                            [true, true, false]
                        );
                        config.currentDateIndex++;
                        setTimeout(processNext, 2000);
                        return false;
                    }
                } else {
                    updateStatus(
                        `Processing outbound flight for ${currentSearch.origin} to ${currentSearch.destination}`,
                        'info',
                        [null, null, null]
                    );

                    const { flights, selectedCard, selectedCardIndex } = extractFlightInfo();
                    if (flights && selectedCard) {
                        logger.log(`Extracted ${flights.length} flights, Selected card index: ${selectedCardIndex}`, 'info');
                        config.results.push(...flights);
                        updateStatus(
                            `Successfully extracted outbound flight information`,
                            'success',
                            [true, 'pending', null]
                        );
                        saveState();

                        try {
                            logger.log(`Attempting to click flight card at index ${selectedCardIndex}...`, 'info');
                            
                            // First try the specific clickable selector
                            const clickableElement = selectedCard.querySelector(SELECTORS.flightCards.clickable);
                            if (clickableElement) {
                                logger.log('Found clickable element with specific selector', 'info');
                                logger.log(`Clickable element text: "${clickableElement.textContent.trim()}"`, 'info');
                                logger.log(`Clickable element data-testid: "${clickableElement.getAttribute('data-testid')}"`, 'info');
                                
                                // Try clicking the element with multiple methods
                                let clickSuccess = false;
                                
                                // Method 1: Direct click
                                try {
                                    clickableElement.click();
                                    logger.log('Direct click successful', 'success');
                                    clickSuccess = true;
                                } catch (e) {
                                    logger.log(`Direct click failed: ${e.message}`, 'warning');
                                }

                                // Method 2: MouseEvent if direct click failed
                                if (!clickSuccess) {
                                    try {
                                        const mouseEvent = new MouseEvent('click', {
                                            view: window,
                                            bubbles: true,
                                            cancelable: true
                                        });
                                        clickableElement.dispatchEvent(mouseEvent);
                                        logger.log('MouseEvent click successful', 'success');
                                        clickSuccess = true;
                                    } catch (e) {
                                        logger.log(`MouseEvent click failed: ${e.message}`, 'warning');
                                    }
                                }

                                // Method 3: Programmatic click if previous methods failed
                                if (!clickSuccess) {
                                    try {
                                        const dataTestId = clickableElement.getAttribute('data-testid');
                                        if (dataTestId) {
                                            const script = document.createElement('script');
                                            script.textContent = `
                                                document.querySelector('[data-testid="${dataTestId}"]')?.click();
                                            `;
                                            document.body.appendChild(script);
                                            document.body.removeChild(script);
                                            logger.log('Programmatic click successful', 'success');
                                            clickSuccess = true;
                                        }
                                    } catch (e) {
                                        logger.log(`Programmatic click failed: ${e.message}`, 'warning');
                                    }
                                }

                                if (!clickSuccess) {
                                    throw new Error('All click methods failed');
                                }
                            } else {
                                // Fallback to finding any clickable elements
                                const clickableElements = selectedCard.querySelectorAll('button, [role="button"], a, [tabindex="0"]');
                                logger.log(`Found ${clickableElements.length} general clickable elements in the card`, 'info');
                                
                                let targetElement = null;
                                
                                // First try to find a button with "select" or "choose" text
                                for (const element of clickableElements) {
                                    const text = element.textContent.toLowerCase().trim();
                                    if (text.includes('selecionar') || text.includes('escolher') || text.includes('select') || text.includes('choose')) {
                                        targetElement = element;
                                        logger.log(`Found select/choose button with text: "${text}"`, 'info');
                                        break;
                                    }
                                }
                                
                                // If no specific button found, try the first clickable element
                                if (!targetElement && clickableElements.length > 0) {
                                    targetElement = clickableElements[0];
                                    logger.log('Using first clickable element as fallback', 'info');
                                }

                                if (targetElement) {
                                    targetElement.click();
                                    logger.log('Successfully clicked fallback element', 'success');
                                } else {
                                    throw new Error('No clickable elements found');
                                }
                            }

                            // Wait for tariff list
                            logger.log('Waiting for tariff list to appear...', 'info');
                            const tariffListLoaded = await waitForTariffList();
                            if (tariffListLoaded) {
                                const tariffSelected = await selectCheapestTariff();
                                if (tariffSelected) {
                                    updateStatus(
                                        `Selected tariff successfully`,
                                        'success',
                                        [true, true, 'pending']
                                    );
                                    logger.log('Tariff selection completed successfully', 'success');
                                } else {
                                    throw new Error('Failed to select tariff');
                                }
                            } else {
                                throw new Error('Tariff list did not load');
                            }
                        } catch (error) {
                            logger.log(`Error in flight selection process: ${error.message}`, 'error');
                            const retryCount = currentSearch.retryCount || 0;
                            if (retryCount < 3) {
                                currentSearch.retryCount = retryCount + 1;
                                logger.log(`Scheduling retry attempt ${retryCount + 1}/3`, 'warning');
                                updateStatus(`Retrying search (${retryCount + 1}/3)...`, 'warning');
                                setTimeout(processNext, 5000);
                            } else {
                                logger.log('Maximum retry attempts reached, moving to next date', 'warning');
                                config.currentDateIndex++;
                                setTimeout(processNext, 2000);
                            }
                        }
                    }
                }
            } else {
                updateStatus(
                    `Processing one-way flight for ${currentSearch.origin} to ${currentSearch.destination}`,
                    'info',
                    [null, null, null]
                );

                const { flights } = extractFlightInfo();
                if (flights && flights.length) {
                    config.results.push(...flights);
                    updateStatus(
                        `Successfully extracted flight information`,
                        'success',
                        [true, null, null]
                    );
                    saveState();
                } else {
                    updateStatus(
                        `Failed to extract flight information`,
                        'error',
                        [false, null, null]
                    );
                    const retryCount = currentSearch.retryCount || 0;
                    if (retryCount < 3) {
                        currentSearch.retryCount = retryCount + 1;
                        updateStatus(`Retrying search (${retryCount + 1}/3)...`, 'warning');
                        setTimeout(processNext, 5000);
                        return;
                    }
                }

                config.currentDateIndex++;
                setTimeout(processNext, 2000);
            }
        } else {
            const currentSearch = config.searches[config.currentSearchIndex];
            updateStatus(
                `No flight cards found for ${currentSearch.origin} to ${currentSearch.destination}`,
                'error',
                [false, null, null]
            );

            const retryCount = currentSearch.retryCount || 0;
            if (retryCount < 3) {
                currentSearch.retryCount = retryCount + 1;
                updateStatus(`Retrying search (${retryCount + 1}/3)...`, 'warning');
                setTimeout(processNext, 5000);
            } else {
                config.currentDateIndex++;
                setTimeout(processNext, 2000);
            }
        }
    }

    // Add UI elements
    function addUI() {
        const container = document.createElement('div');
        container.id = 'scraper-container';
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            width: 350px;
            height: 600px;
            font-family: Arial, sans-serif;
        `;

        // Add draggable header
        const header = document.createElement('div');
        header.className = 'scraper-header';
        header.innerHTML = `
            <h3>LATAM Flight Scraper</h3>
            <div class="header-buttons">
                <button class="minimize-btn" style="padding: 2px 8px; margin-left: 5px;">_</button>
                <button class="close-btn" style="padding: 2px 8px; margin-left: 5px;">×</button>
            </div>
        `;
        container.appendChild(header);

        // Create content wrapper for scrolling
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'form-content';
        container.appendChild(contentWrapper);

        // Create tabs
        const tabContainer = document.createElement('div');
        tabContainer.style.cssText = `
            display: flex;
            margin-bottom: 15px;
            border-bottom: 1px solid #ccc;
        `;

        const formTab = document.createElement('div');
        const jsonTab = document.createElement('div');
        [formTab, jsonTab].forEach(tab => {
            tab.style.cssText = `
                padding: 8px 15px;
                cursor: pointer;
                border-radius: 5px 5px 0 0;
                margin-right: 5px;
            `;
        });
        formTab.textContent = 'Form Input';
        jsonTab.textContent = 'JSON Input';

        // Content containers
        const formContent = document.createElement('div');
        const jsonContent = document.createElement('div');

        // Function to switch tabs
        function switchTab(activeTab, activeContent, inactiveTab, inactiveContent) {
            activeTab.style.backgroundColor = '#007bff';
            activeTab.style.color = 'white';
            activeContent.style.display = 'block';
            inactiveTab.style.backgroundColor = '#f8f9fa';
            inactiveTab.style.color = '#333';
            inactiveContent.style.display = 'none';
        }

        formTab.onclick = () => switchTab(formTab, formContent, jsonTab, jsonContent);
        jsonTab.onclick = () => switchTab(jsonTab, jsonContent, formTab, formContent);

        // Create form content
        const form = document.createElement('form');
        form.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        // Basic flight info section
        const basicInfoSection = document.createElement('div');
        basicInfoSection.className = 'form-section';
        basicInfoSection.innerHTML = `
            <h4>Flight Information</h4>
            <div class="input-group-vertical">
                <div class="input-field">
                    <label for="origin">Origin Airport</label>
                    <input type="text" id="origin" placeholder="e.g., GRU" required>
                </div>
                <div class="input-field">
                    <label for="destination">Destination Airport</label>
                    <input type="text" id="destination" placeholder="e.g., MAD" required>
                </div>
            </div>
        `;
        form.appendChild(basicInfoSection);

        // Trip type radio buttons
        const tripTypeContainer = document.createElement('div');
        tripTypeContainer.className = 'form-section';
        tripTypeContainer.innerHTML = `
            <h4>Trip Type</h4>
            <div class="radio-group">
                <label class="radio-label">
                    <input type="radio" name="trip_type" value="one_way" checked>
                    <span>One Way</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="trip_type" value="round_trip">
                    <span>Round Trip</span>
                </label>
            </div>
        `;
        form.appendChild(tripTypeContainer);

        // Cabin class radio buttons
        const cabinClassContainer = document.createElement('div');
        cabinClassContainer.className = 'form-section';
        cabinClassContainer.innerHTML = `
            <h4>Cabin Class</h4>
            <div class="radio-group">
                <label class="radio-label">
                    <input type="radio" name="cabin_class" value="Economy" checked>
                    <span>Economy</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="cabin_class" value="Business">
                    <span>Business</span>
                </label>
            </div>
        `;
        form.appendChild(cabinClassContainer);

        // Outbound dates section
        const outboundSection = document.createElement('div');
        outboundSection.className = 'form-section';
        outboundSection.innerHTML = `
            <h4>Outbound Flight</h4>
            <div class="date-range">
                <div class="input-field">
                    <label for="outbound_date">Select Dates</label>
                    <input type="text" id="outbound_dates" class="daterangepicker-input" placeholder="Select date range" required>
                </div>
            </div>
        `;
        form.appendChild(outboundSection);

        // Return dates section (hidden by default)
        const returnSection = document.createElement('div');
        returnSection.className = 'form-section return-section';
        returnSection.style.display = 'none';
        returnSection.innerHTML = `
            <h4>Return Flight</h4>
            <div class="date-range">
                <div class="input-field">
                    <label for="return_date">Select Dates</label>
                    <input type="text" id="return_dates" class="daterangepicker-input" placeholder="Select date range">
                </div>
            </div>
        `;
        form.appendChild(returnSection);

        // Points checkbox
        const pointsContainer = document.createElement('div');
        pointsContainer.className = 'form-section';
        pointsContainer.innerHTML = `
            <div class="checkbox-field">
                <label class="checkbox-label">
                    <input type="checkbox" id="use_points">
                    <span>Search using points</span>
                </label>
            </div>
        `;
        form.appendChild(pointsContainer);

        // Add event listener for trip type change
        const tripTypeRadios = form.querySelectorAll('input[name="trip_type"]');
        tripTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                returnSection.style.display = e.target.value === 'round_trip' ? 'block' : 'none';
                // Toggle required attribute for return date inputs
                const returnInputs = returnSection.querySelectorAll('input[type="date"]');
                returnInputs.forEach(input => {
                    input.required = e.target.value === 'round_trip';
                });
            });
        });

        // Create JSON content
        const jsonInput = document.createElement('textarea');
        jsonInput.placeholder = 'Paste your JSON configuration here or use the "Load JSON File" button';
        jsonInput.style.cssText = `
            width: 100%;
            height: 200px;
            margin-bottom: 10px;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-family: monospace;
        `;

        // File input for JSON
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';

        const fileButton = document.createElement('button');
        fileButton.textContent = 'Load JSON File';
        fileButton.style.cssText = `
            padding: 5px 10px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-bottom: 10px;
            width: 100%;
        `;

        fileButton.onclick = (e) => {
            e.preventDefault();
            fileInput.click();
        };

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const json = JSON.parse(e.target.result);
                        jsonInput.value = JSON.stringify(json, null, 2);
                    } catch (error) {
                        alert('Invalid JSON file');
                    }
                };
                reader.readAsText(file);
            }
        };

        // Action buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 15px;
        `;

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Scraping';
        startButton.style.cssText = `
            padding: 8px 15px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            flex: 1;
            font-weight: bold;
        `;

        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop Scraping';
        stopButton.style.cssText = `
            padding: 8px 15px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            flex: 1;
            font-weight: bold;
        `;

        startButton.onclick = (e) => {
            e.preventDefault();
            let searchConfig;

            if (jsonContent.style.display === 'block') {
                // Use JSON input
                try {
                    searchConfig = JSON.parse(jsonInput.value);
                } catch (e) {
                    alert('Invalid JSON configuration: ' + e.message);
                    return;
                }
            } else {
                // Use form input
                const tripType = form.querySelector('input[name="trip_type"]:checked').value;
                const outboundDates = document.getElementById('outbound_dates').value.split(' - ');
                const outboundStartDate = outboundDates[0];
                const outboundEndDate = outboundDates[1];

                if (!outboundStartDate || !outboundEndDate) {
                    alert('Please select outbound date range.');
                    return;
                }

                const origin = document.getElementById('origin').value.toUpperCase();
                const destination = document.getElementById('destination').value.toUpperCase();

                if (!origin || !destination) {
                    alert('Please fill in both origin and destination airports.');
                    return;
                }

                const search = {
                    origin: origin,
                    destination: destination,
                    trip_type: tripType,
                    outbound_dates: {
                        start: outboundStartDate,
                        end: outboundEndDate
                    },
                    use_points: document.getElementById('use_points').checked
                };

                // Add return dates if round trip is selected
                if (tripType === 'round_trip') {
                    const returnDates = document.getElementById('return_dates').value.split(' - ');
                    const returnStartDate = returnDates[0];
                    const returnEndDate = returnDates[1];
                    
                    if (!returnStartDate || !returnEndDate) {
                        alert('Please select return date range for round trip flights.');
                        return;
                    }

                    search.return_dates = {
                        start: returnStartDate,
                        end: returnEndDate
                    };
                }

                // Add cabin class to the search configuration
                search.cabin_class = form.querySelector('input[name="cabin_class"]:checked').value;

                // Create proper search configuration
                searchConfig = {
                    searches: [search]
                };

                // Log the search configuration for debugging
                logger.log(`Starting search with configuration: ${JSON.stringify(searchConfig)}`, 'info');
            }

            // Clear any existing state before starting
            clearState();
            startScraping(searchConfig);
        };

        stopButton.onclick = () => {
            clearState();
            logger.log('Scraping stopped by user', 'warning');
            window.location.reload();
        };

        // Assemble the UI
        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(stopButton);

        jsonContent.appendChild(fileButton);
        jsonContent.appendChild(jsonInput);

        formContent.appendChild(form);

        tabContainer.appendChild(formTab);
        tabContainer.appendChild(jsonTab);

        // Move all content into the wrapper
        contentWrapper.appendChild(tabContainer);
        contentWrapper.appendChild(formContent);
        contentWrapper.appendChild(jsonContent);
        contentWrapper.appendChild(buttonContainer);

        document.body.appendChild(container);

        // Initialize draggable and resizable
        $(container).draggable({
            handle: '.scraper-header',
            containment: 'window'
        }).resizable({
            handles: 'all',
            minWidth: 300,
            minHeight: 400,
            containment: 'window'
        });

        // Add minimize/maximize functionality
        let isMinimized = false;
        const originalHeight = container.style.height;
        const minimizeBtn = container.querySelector('.minimize-btn');
        const closeBtn = container.querySelector('.close-btn');

        minimizeBtn.addEventListener('click', () => {
            if (isMinimized) {
                contentWrapper.style.display = 'block';
                container.style.height = originalHeight;
                minimizeBtn.textContent = '_';
            } else {
                contentWrapper.style.display = 'none';
                container.style.height = 'auto';
                minimizeBtn.textContent = '□';
            }
            isMinimized = !isMinimized;
        });

        closeBtn.addEventListener('click', () => {
            container.remove();
        });

        // Save position and size
        function saveUIState() {
            const state = {
                position: $(container).position(),
                size: {
                    width: $(container).width(),
                    height: $(container).height()
                },
                isMinimized
            };
            GM_setValue('uiState', JSON.stringify(state));
        }

        // Load saved position and size
        const savedState = GM_getValue('uiState');
        if (savedState) {
            const state = JSON.parse(savedState);
            container.style.left = state.position.left + 'px';
            container.style.top = state.position.top + 'px';
            container.style.width = state.size.width + 'px';
            container.style.height = state.size.height + 'px';
            if (state.isMinimized) {
                contentWrapper.style.display = 'none';
                container.style.height = 'auto';
                minimizeBtn.textContent = '□';
                isMinimized = true;
            }
        }

        // Save state when dragged or resized
        $(container).on('dragstop resizestop', saveUIState);
    }

    // Initialize date pickers
    function initializeDatePickers() {
        try {
            const commonOptions = {
                autoApply: true,
                locale: {
                    format: 'YYYY-MM-DD'
                },
                opens: 'left',
                showDropdowns: true,
                minDate: moment(),
                maxDate: moment().add(1, 'year'),
                parentEl: 'body'
            };

            if ($('#outbound_dates').length) {
                $('#outbound_dates').daterangepicker(commonOptions);
            }

            if ($('#return_dates').length) {
                $('#return_dates').daterangepicker(commonOptions);
            }

            $('#outbound_dates').on('apply.daterangepicker', function(ev, picker) {
                const returnPicker = $('#return_dates').data('daterangepicker');
                if (returnPicker) {
                    returnPicker.minDate = picker.endDate;
                    returnPicker.startDate = picker.endDate.clone().add(1, 'day');
                    returnPicker.endDate = picker.endDate.clone().add(7, 'days');
                    $('#return_dates').val(
                        returnPicker.startDate.format('YYYY-MM-DD') + ' - ' + 
                        returnPicker.endDate.format('YYYY-MM-DD')
                    );
                }
            });
        } catch (error) {
            console.error('Error initializing date pickers:', error);
        }
    }

    // Initialize
    window.addEventListener('load', () => {
        // Load saved selectors first
        loadSelectors();
        
        // Wait for jQuery to be properly loaded
        const checkJQuery = setInterval(() => {
            if (window.jQuery && window.moment && window.jQuery.fn.daterangepicker) {
                clearInterval(checkJQuery);
                addUI();
                createStatusDisplay();
                handlePageLoad();
                setTimeout(initializeDatePickers, 500);
            }
        }, 100);

        // Set a timeout to prevent infinite checking
        setTimeout(() => {
            clearInterval(checkJQuery);
            if (!window.jQuery || !window.moment || !window.jQuery.fn.daterangepicker) {
                updateStatus('Failed to initialize required libraries', 'error');
            }
        }, 10000);
    });
})(); 