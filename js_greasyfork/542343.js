    // ==UserScript==
    // @name         Tesla Model Y HW4 Filter
    // @namespace    http://tampermonkey.net/
    // @version      4.12
    // @description  Precisely filters HW4 Model Y cars on Tesla used inventory page
    // @match        https://www.tesla.com/inventory/used/*
    // @grant        none
    // @license      MIT
    // @run-at       document-idle
    // @author		sambrears
    // @homepage	https://greasyfork.org/en/scripts/542343-tesla-model-y-hw4-filter
// @downloadURL https://update.greasyfork.org/scripts/542343/Tesla%20Model%20Y%20HW4%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/542343/Tesla%20Model%20Y%20HW4%20Filter.meta.js
    // ==/UserScript==
     
    (function () {
        'use strict';
     
        // HW4 thresholds
        const THRESHOLDS = {
            'F': 789500, // Fremont
            'A': 131200, // Austin
            'S': 380000, // Shanghai
            'B': 100000  // Berlin
        };
     
        // Model year mapping for VIN codes
        const MODEL_YEARS = {
            'N': 2022,
            'P': 2023,
            'R': 2024,
            'S': 2025
        };
     
        // Check if Model Y or Model 3 is currently selected
        function isModelYSelected() {
            // Check for Model Y radio button selection
            const modelYRadio = document.querySelector('input[name="Model"][value="my"]');
            if (modelYRadio && modelYRadio.checked) {
                return true;
            }
     
            // Fallback: check URL for Model Y
            return window.location.pathname.includes('/used/my');
        }
     
        function isModel3Selected() {
            // Check for Model 3 radio button selection
            const model3Radio = document.querySelector('input[name="Model"][value="m3"]');
            if (model3Radio && model3Radio.checked) {
                return true;
            }
     
            // Fallback: check URL for Model 3
            return window.location.pathname.includes('/used/m3');
        }
     
        function isTargetModelSelected() {
            return isModelYSelected() || isModel3Selected();
        }
     
        // Hide/show filter button based on model selection
        function toggleFilterButton() {
            const toggleBtn = document.getElementById('hw4-filter-toggle');
            if (!toggleBtn) return;
     
            if (isTargetModelSelected()) {
                toggleBtn.style.display = 'block';
                // Update button text based on selected model
                if (isModel3Selected()) {
                    const currentText = toggleBtn.textContent;
                    if (currentText.includes('HW4')) {
                        toggleBtn.textContent = currentText.replace('HW4', '2024+');
                    }
                }
            } else {
                toggleBtn.style.display = 'none';
                // Reset all vehicle displays when switching away from target models
                const allVehicles = document.querySelectorAll('.hw4-vehicle, .non-hw4-vehicle');
                allVehicles.forEach(vehicle => {
                    vehicle.style.display = 'block';
                    vehicle.style.border = '';
                    vehicle.classList.remove('hw4-vehicle', 'non-hw4-vehicle');
                    const badge = vehicle.querySelector('.hw4-badge, .year-2024-badge');
                    if (badge) badge.remove();
                });
            }
        }
        function getModelYearFromCard(card) {
            // Look for model year in various text elements
            const textSelectors = [
                '.tds-text--contrast-low',
                '.card-info-details',
                '.result-details',
                '.vehicle-year'
            ];
     
            for (const selector of textSelectors) {
                const elements = card.querySelectorAll(selector);
                for (const element of elements) {
                    const text = element.textContent.trim();
                    // Look for 4-digit year at the beginning of text
                    const yearMatch = text.match(/^(\d{4})\s/);
                    if (yearMatch) {
                        const year = parseInt(yearMatch[1], 10);
                        if (year >= 2020 && year <= 2030) { // Reasonable year range
                            return year;
                        }
                    }
                }
            }
     
            return null;
        }
     
        // Comprehensive HW4 detection logic for Model Y and 2024+ detection for Model 3
        function isHW4(vin, card) {
            if (!vin || vin.length !== 17) {
                return false;
            }
     
            // First, try to get model year from the card's displayed text
            let modelYear = getModelYearFromCard(card);
            
            // If we couldn't get it from the card, fall back to VIN decoding
            if (!modelYear) {
                const modelYearCode = vin.charAt(9);
                modelYear = MODEL_YEARS[modelYearCode] || 0;
            }
     
            // For Model 3: Only show 2024+ cars
            if (isModel3Selected()) {
                return modelYear >= 2024;
            }
     
            // For Model Y: Use HW4 detection logic
            if (isModelYSelected()) {
                // 2024+ cars are always HW4 - no VIN serial number check needed
                if (modelYear >= 2024) {
                    return true;
                }
     
                // 2022 and earlier are always HW3
                if (modelYear <= 2022) {
                    return false;
                }
     
                // For 2023, check against VIN serial number thresholds
                if (modelYear === 2023) {
                    const factoryCode = vin.charAt(10);
                    const serialNumber = parseInt(vin.substring(11), 10);
                    const threshold = THRESHOLDS[factoryCode];
                    return threshold !== undefined && serialNumber >= threshold;
                }
            }
     
            // Default to false for unknown years or models
            return false;
        }
     
        // Find VIN for a card with multiple strategies
        function findVINForCard(card) {
            const vinsToTry = [
                () => {
                    // Try finding VIN in multiple places
                    const vinSelectors = [
                        '.vin-display',
                        '[data-test="vehicle-vin"]',
                        '.inventory-details-link',
                        '.result-details-vin'
                    ];
     
                    for (const selector of vinSelectors) {
                        const vinElement = card.querySelector(selector);
                        if (vinElement) {
                            const vinText = vinElement.textContent.trim();
                            if (vinText.length === 17) {
                                return vinText;
                            }
                        }
                    }
                    return null;
                },
                () => {
                    // Try extracting VIN from card's inner HTML
                    const matches = card.innerHTML.match(/\b[A-HJ-NPR-Z0-9]{17}\b/);
                    return matches ? matches[0] : null;
                }
            ];
     
            for (const vinFinder of vinsToTry) {
                const vin = vinFinder();
                if (vin && vin.length === 17) {
                    return vin;
                }
            }
     
            return null;
        }
     
        // Filter and highlight HW4 cars (Model Y) or 2024+ cars (Model 3)
        function filterHW4Cards() {
            // Only run if target model is selected
            if (!isTargetModelSelected()) {
                return;
            }
            // More robust selector to capture cars
            const cards = document.querySelectorAll(
                '.results-container .result, ' +
                '.inventory-results .result, ' +
                '[data-test="inventory-results"] .result'
            );
     
            let hw4Count = 0;
            let totalCount = cards.length;
     
            cards.forEach((card, index) => {
                // Ensure we can process the card
                if (!card || !card.querySelector) {
                    return;
                }
     
                // Find VIN for the card
                const vin = findVINForCard(card);
     
                if (!vin) {
                    return;
                }
     
                // Pass both VIN and card to the detection function
                const isTargetVehicle = isHW4(vin, card);
     
                if (isTargetVehicle) {
                    hw4Count++;
                    card.classList.add('hw4-vehicle');
                    card.classList.remove('non-hw4-vehicle');
                    card.style.display = 'block';
                    card.style.border = '3px solid limegreen';
     
                    // Add appropriate badge based on model
                    const badgeClass = isModel3Selected() ? 'year-2024-badge' : 'hw4-badge';
                    const badgeText = isModel3Selected() ? '2024+' : 'HW4';
                    
                    let badge = card.querySelector('.hw4-badge, .year-2024-badge');
                    if (!badge) {
                        badge = document.createElement('div');
                        badge.classList.add(badgeClass);
                        badge.textContent = badgeText;
                        badge.style.position = 'absolute';
                        badge.style.top = '8px';
                        badge.style.right = '8px';
                        badge.style.background = 'limegreen';
                        badge.style.color = 'black';
                        badge.style.fontWeight = 'bold';
                        badge.style.padding = '2px 6px';
                        badge.style.borderRadius = '4px';
                        badge.style.zIndex = '10';
                        badge.style.fontSize = '12px';
                        card.style.position = 'relative';
                        card.appendChild(badge);
                    } else {
                        // Update existing badge text if model changed
                        badge.textContent = badgeText;
                        badge.className = badgeClass;
                    }
                } else {
                    card.classList.add('non-hw4-vehicle');
                    card.classList.remove('hw4-vehicle');
                    card.style.display = 'none';
                    card.style.border = '1px solid red';
     
                    // Remove any existing badge
                    const existingBadge = card.querySelector('.hw4-badge, .year-2024-badge');
                    if (existingBadge) {
                        existingBadge.remove();
                    }
                }
            });
     
            updateFilterButtonText(hw4Count, totalCount);
        }
     
        // Create filter toggle button
        function createFilterToggleButton() {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'hw4-filter-toggle';
            toggleBtn.style.position = 'fixed';
            toggleBtn.style.bottom = '20px';
            toggleBtn.style.right = '20px';
            toggleBtn.style.zIndex = '9999';
            toggleBtn.style.padding = '8px 12px';
            toggleBtn.style.backgroundColor = '#333';
            toggleBtn.style.color = 'white';
            toggleBtn.style.border = 'none';
            toggleBtn.style.cursor = 'pointer';
            toggleBtn.style.borderRadius = '4px';
     
            let showNonHW4 = false;
            toggleBtn.addEventListener('click', () => {
                showNonHW4 = !showNonHW4;
                const nonHW4Vehicles = document.querySelectorAll('.non-hw4-vehicle');
                nonHW4Vehicles.forEach(vehicle => {
                    vehicle.style.display = showNonHW4 ? 'block' : 'none';
                });
                
                const buttonPrefix = isModel3Selected() ? 'Show Only 2024+' : 'Show Only HW4';
                const buttonSuffix = isModel3Selected() ? 'Show All Cars' : 'Show All Cars';
                
                toggleBtn.textContent = showNonHW4
                    ? `${buttonSuffix} (${document.querySelectorAll('.hw4-vehicle').length}/${document.querySelectorAll('.result').length})`
                    : `${buttonPrefix} (${document.querySelectorAll('.hw4-vehicle').length}/${document.querySelectorAll('.result').length})`;
            });
     
            document.body.appendChild(toggleBtn);
            return toggleBtn;
        }
     
        // Update filter button text
        function updateFilterButtonText(hw4Count, totalCount) {
            const toggleBtn = document.getElementById('hw4-filter-toggle');
            if (toggleBtn) {
                const buttonPrefix = isModel3Selected() ? 'Show Only 2024+' : 'Show Only HW4';
                toggleBtn.textContent = `${buttonPrefix} (${hw4Count}/${totalCount})`;
            }
        }
     
        // Run after delay to allow page to settle
        setTimeout(() => {
            createFilterToggleButton();
     
            // Initial setup
            toggleFilterButton();
            filterHW4Cards();
     
            // Set up mutation observer to catch dynamic content and model changes
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        // Check if model selection changed
                        setTimeout(() => {
                            toggleFilterButton();
                            filterHW4Cards();
                        }, 500);
                        break;
                    }
                }
            });
     
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
     
            // Also listen for radio button changes directly
            document.addEventListener('change', (event) => {
                if (event.target.name === 'Model') {
                    setTimeout(() => {
                        toggleFilterButton();
                        filterHW4Cards();
                    }, 100);
                }
            });
        }, 2000);
    })();