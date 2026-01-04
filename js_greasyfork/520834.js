// ==UserScript==
// @name         Sniffies Location Spoofer
// @namespace    https://sniffies.com/
// @version      4.1
// @description  Integrated location spoofing for Sniffies
// @author       JH
// @match        https://sniffies.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/520834/Sniffies%20Location%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/520834/Sniffies%20Location%20Spoofer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Constants
    const STORAGE_KEY = 'sniffiesLocationSpoofer';
    const PRESETS_KEY = 'sniffiesLocationPresets';
    const GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/search';
    const REVERSE_GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/reverse';
    const MODAL_ID = 'spoofModalOverlay';
    const TRAVEL_MODE_ICON_SELECTOR = 'i[data-testid="travelModeIcon"]';
    const INDICATOR_ID = 'locationSpoofingIndicator'; // New ID for the indicator

    // Default Preset Locations
    const DEFAULT_PRESET_LOCATIONS = [
        { name: 'New York, USA', latitude: 40.7128, longitude: -74.0060 },
        { name: 'London, UK', latitude: 51.5074, longitude: -0.1278 },
        { name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503 },
        { name: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093 },
        { name: 'Paris, France', latitude: 48.8566, longitude: 2.3522 },
        { name: 'Berlin, Germany', latitude: 52.5200, longitude: 13.4050 },
    ];

    // Default Location Data
    const DEFAULT_LOCATION = {
        enabled: false,
        locationName: '',
        latitude: null,
        longitude: null,
    };

    // Global variables
    let activeWatchId = null;
    let originalTravelModeButton = null;
    let originalTravelModeIconClasses = [];
    let isUserscriptDisabled = false;

    /**
     * Retrieves stored location data from localStorage.
     * @returns {Object} Stored location data or default if none exists.
     */
    function getStoredLocation() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : { ...DEFAULT_LOCATION };
        } catch (error) {
            console.error('Error retrieving stored location:', error);
            return { ...DEFAULT_LOCATION };
        }
    }

    /**
     * Saves location data to localStorage.
     * @param {Object} locationData - The location data to store.
     */
    function setStoredLocation(locationData) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(locationData));
        } catch (error) {
            console.error('Error setting stored location:', error);
        }
    }

    /**
     * Clears stored location data from localStorage.
     */
    function clearStoredLocation() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing stored location:', error);
        }
    }

    /**
     * Retrieves preset locations from localStorage.
     * @returns {Array} Array of preset location objects.
     */
    function getPresetLocations() {
        try {
            const data = localStorage.getItem(PRESETS_KEY);
            return data ? JSON.parse(data) : [...DEFAULT_PRESET_LOCATIONS];
        } catch (error) {
            console.error('Error retrieving preset locations:', error);
            return [...DEFAULT_PRESET_LOCATIONS];
        }
    }

    /**
     * Saves preset locations to localStorage.
     * @param {Array} presets - Array of preset location objects.
     */
    function setPresetLocations(presets) {
        try {
            localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
        } catch (error) {
            console.error('Error setting preset locations:', error);
        }
    }

    /**
     * Geocodes a location name to latitude and longitude using Nominatim.
     * @param {string} locationName - The location name to geocode.
     * @returns {Promise<Object>} A promise that resolves to an object containing latitude and longitude.
     */
    async function geocodeLocation(locationName) {
        const params = new URLSearchParams({
            q: locationName,
            format: 'json',
            limit: 1,
        });

        try {
            const response = await fetch(`${GEOCODING_API_URL}?${params.toString()}`, {
                headers: {
                    'User-Agent': 'SniffiesLocationSpoofer/1.0 (+https://yourwebsite.com/)',
                },
            });

            if (!response.ok) {
                throw new Error(`Geocoding API error: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.length === 0) {
                throw new Error('Location not found. Please try a different query.');
            }

            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
            };
        } catch (error) {
            console.error(`Failed to geocode location: ${error.message}`);
            throw new Error('Failed to fetch location. Please try again later.');
        }
    }

    /**
     * Reverse geocodes latitude and longitude to a human-readable location name using Nominatim.
     * @param {number} latitude - The latitude to reverse geocode.
     * @param {number} longitude - The longitude to reverse geocode.
     * @returns {Promise<string>} A promise that resolves to the location name.
     */
    async function reverseGeocodeLocation(latitude, longitude) {
        const params = new URLSearchParams({
            lat: latitude,
            lon: longitude,
            format: 'json',
        });

        try {
            const response = await fetch(`${REVERSE_GEOCODING_API_URL}?${params.toString()}`, {
                headers: {
                    'User-Agent': 'SniffiesLocationSpoofer/1.0 (+https://yourwebsite.com/)',
                },
            });

            if (!response.ok) {
                throw new Error(`Reverse geocoding API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.display_name || 'Unknown Location';
        } catch (error) {
            console.error(`Failed to reverse geocode location: ${error.message}`);
            return 'Unknown Location';
        }
    }

    /**
     * Overrides the navigator.geolocation object with spoofed coordinates.
     * @param {Object} spoofedLocation - The spoofed latitude and longitude.
     */
    function overrideGeolocation(spoofedLocation) {
        // Store the original navigator.geolocation if not already stored
        if (!window.__originalGeolocation) {
            window.__originalGeolocation = navigator.geolocation;
        }

        const spoofedGeolocation = {
            getCurrentPosition: function (success, error, options) {
                if (!spoofedLocation.latitude || !spoofedLocation.longitude) {
                    error && error(new Error('Spoofed location is invalid.'));
                    return;
                }

                success && success({
                    coords: {
                        latitude: spoofedLocation.latitude,
                        longitude: spoofedLocation.longitude,
                        accuracy: 100,
                        altitude: null,
                        altitudeAccuracy: null,
                        heading: null,
                        speed: null,
                    },
                    timestamp: Date.now(),
                });
            },
            watchPosition: function (success, error, options) {
                if (!spoofedLocation.latitude || !spoofedLocation.longitude) {
                    error && error(new Error('Spoofed location is invalid.'));
                    return;
                }

                // Return a mock watch ID and store the interval
                activeWatchId = setInterval(() => {
                    success && success({
                        coords: {
                            latitude: spoofedLocation.latitude,
                            longitude: spoofedLocation.longitude,
                            accuracy: 100,
                            altitude: null,
                            altitudeAccuracy: null,
                            heading: null,
                            speed: null,
                        },
                        timestamp: Date.now(),
                    });
                }, 1000);

                return activeWatchId;
            },
            clearWatch: function (id) {
                if (id === activeWatchId) {
                    clearInterval(id);
                    activeWatchId = null;
                }
            },
            // Other geolocation methods can be added if necessary
        };

        // Override the navigator.geolocation
        Object.defineProperty(navigator, 'geolocation', {
            get: () => spoofedGeolocation,
            configurable: true,
        });
    }

    /**
     * Restores the original navigator.geolocation object.
     */
    function restoreOriginalGeolocation() {
        if (window.__originalGeolocation) {
            Object.defineProperty(navigator, 'geolocation', {
                value: window.__originalGeolocation,
                writable: true,
                configurable: true,
            });
            delete window.__originalGeolocation;
        }
    }

    /**
     * Waits for the bottom nav to load and then adds the location spoofer button.
     */
    function waitForBottomNav() {
        const bottomNav = document.querySelector('.bottom-menu .nav.bottom');
        const plusButton = document.querySelector('[data-testid="plusIcon"]');
        
        if (bottomNav && plusButton) {
            // Hide the plus button immediately to prevent it from showing
            plusButton.style.display = 'none';
            initializeLocationSpooferButton(bottomNav);
        } else {
            // Use requestAnimationFrame for immediate retry without delay
            requestAnimationFrame(waitForBottomNav);
        }
    }

    /**
     * Initializes the location spoofer button and adds it to the bottom nav.
     */
    function initializeLocationSpooferButton(bottomNav) {
        // Check if button already exists
        if (document.querySelector('.sniffies-location-spoofer-btn')) {
            return;
        }

        // Find the plus button container (the middle nav-button div)
        const plusButtonContainer = bottomNav.querySelector('[data-testid="plusIcon"]')?.parentElement;
        if (plusButtonContainer) {
            // Replace the plus button with our location spoofer button
            plusButtonContainer.innerHTML = '';
            
            // Create the button (following Sniffies' exact pattern)
            const button = document.createElement('button');
            button.className = 'sniffies-location-spoofer-btn ng-tns-c1518730176-7';
            button.type = 'button';
            button.title = 'Location Spoofer';
            button.innerHTML = '<i class="fa fa-map-marker-alt navicon ng-tns-c1518730176-7"></i><i class="fa fa-circle bright sub-icon ng-tns-c1518730176-7 ng-star-inserted sniffies-location-indicator" style="display: none;"></i>';

            // Add click handler
            button.addEventListener('click', () => {
                const modal = document.getElementById(MODAL_ID);
                if (modal) {
                    modal.style.display = 'flex';
                }
            });

            // Add button to the existing container
            plusButtonContainer.appendChild(button);

            // Update the button indicator after the button is added to the DOM
            updateButtonIndicator();

        } else {
            // If plus button not found, try again immediately
            requestAnimationFrame(() => {
                if (!document.querySelector('.sniffies-location-spoofer-btn')) {
                    waitForBottomNav();
                }
            });
            return;
        }

        // Set up observer to re-add button if removed
        const observer = new MutationObserver((mutations) => {
            if (!document.querySelector('.sniffies-location-spoofer-btn')) {
                // Re-initialize if button was removed
                requestAnimationFrame(() => waitForBottomNav());
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    /**
     * Creates and returns the spoofing modal element with enhanced dark mode styling and customizable presets.
     * Implements responsive design for dynamic sizing and formatting.
     * @returns {HTMLElement} The modal overlay element.
     */
    function createModal() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = MODAL_ID;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(11, 17, 31, 0.85);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            overflow: auto;
        `;

        // Create modal container
        const modal = document.createElement('div');
        modal.style.cssText = `
            background-color: #111d33;
            border-radius: 8px;
            padding: 20px 25px;
            width: 90%;
            max-width: 500px;
            position: relative;
            box-shadow: 0 4px 16px rgba(0,0,0,0.5);
            font-family: Arial, sans-serif;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
        `;

        // Close button
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.style.cssText = `
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 24px;
            cursor: pointer;
            color: #ffffff;
            transition: color 0.3s;
        `;
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.color = '#304065';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.color = '#ffffff';
        });
        closeButton.addEventListener('click', () => {
            overlay.style.display = 'none';
        });

        // Modal title
        const title = document.createElement('h2');
        title.textContent = 'Location Spoofer';
        title.style.cssText = `
            margin: 0;
            margin-bottom: 15px;
            color: #ffffff;
            font-size: 20px;
            text-align: left;
        `;

        // Spoofing Indicator Container
        const spoofingIndicatorContainer = document.createElement('div');
        spoofingIndicatorContainer.id = INDICATOR_ID;
        spoofingIndicatorContainer.style.cssText = `
            margin-bottom: 20px;
            padding: 10px 15px;
            background-color: #1e2a4a;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            transition: background-color 0.3s;
            flex-wrap: wrap;
        `;
        spoofingIndicatorContainer.title = 'Click to toggle spoofing';

        const indicatorStatus = document.createElement('span');
        indicatorStatus.id = 'indicatorStatusText';
        indicatorStatus.style.cssText = `
            font-weight: bold;
            font-size: 16px;
        `;
        indicatorStatus.textContent = 'Disabled';

        const locationInfo = document.createElement('span');
        locationInfo.id = 'locationInfoText';
        locationInfo.style.cssText = `
            font-size: 16px;
        `;
        locationInfo.textContent = '';

        spoofingIndicatorContainer.appendChild(indicatorStatus);
        spoofingIndicatorContainer.appendChild(locationInfo);

        // Event listener to toggle spoofing on indicator click
        spoofingIndicatorContainer.addEventListener('click', () => {
            const storedLocation = getStoredLocation();
            if (storedLocation.enabled) {
                resetSpoofing();
                window.location.reload();
            } else {
                overlay.style.display = 'flex';
            }
        });

        // Preset Locations Container
        const presetsContainer = document.createElement('div');
        presetsContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: flex-start;
            margin-bottom: 15px;
        `;

        // Add Preset Button
        const addPresetButton = document.createElement('button');
        addPresetButton.innerHTML = '+';
        addPresetButton.title = 'Add Preset';
        addPresetButton.style.cssText = `
            padding: 6px 12px;
            background-color: #304065;
            color: #ffffff;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
        `;
        addPresetButton.addEventListener('mouseover', () => {
            addPresetButton.style.backgroundColor = '#1e2a4a';
        });
        addPresetButton.addEventListener('mouseout', () => {
            addPresetButton.style.backgroundColor = '#304065';
        });
        addPresetButton.addEventListener('click', () => {
            const presetName = prompt('Enter the name of the new preset location:');
            if (presetName) {
                addNewPreset(presetName.trim());
            }
        });

        presetsContainer.appendChild(addPresetButton);

        /**
         * Adds a new preset location.
         * @param {string} presetName - The name of the preset location.
         */
        async function addNewPreset(presetName) {
            if (!presetName) return;

            const currentPresets = getPresetLocations();
            if (currentPresets.some(p => p.name.toLowerCase() === presetName.toLowerCase())) {
                return;
            }

            try {
                const coords = await geocodeLocation(presetName);
                const newPreset = {
                    name: presetName,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                };

                currentPresets.push(newPreset);
                setPresetLocations(currentPresets);

                const newPresetButton = createPresetButton(newPreset);
                presetsContainer.insertBefore(newPresetButton, addPresetButton);

                console.log(`Preset "${presetName}" added successfully.`);
            } catch (error) {
                console.error(error.message);
            }
        }

        /**
         * Removes a preset location by name.
         * @param {string} presetName - The name of the preset to remove.
         */
        function removePreset(presetName) {
            const currentPresets = getPresetLocations();
            const updatedPresets = currentPresets.filter(p => p.name !== presetName);
            setPresetLocations(updatedPresets);

            const allPresetButtons = presetsContainer.querySelectorAll('button');
            allPresetButtons.forEach(button => {
                if (button.textContent.startsWith(presetName)) {
                    button.remove();
                }
            });

            console.log(`Preset "${presetName}" removed successfully.`);
        }

        /**
         * Function to create a preset button.
         * @param {Object} preset - The preset location object.
         * @returns {HTMLElement} The created preset button element.
         */
        function createPresetButton(preset) {
            const presetButton = document.createElement('button');
            presetButton.textContent = preset.name;
            presetButton.style.cssText = `
                padding: 6px 12px;
                background-color: #304065;
                color: #ffffff;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s;
                display: flex;
                align-items: center;
                gap: 5px;
            `;

            presetButton.addEventListener('mouseover', () => {
                presetButton.style.backgroundColor = '#1e2a4a';
            });
            presetButton.addEventListener('mouseout', () => {
                presetButton.style.backgroundColor = '#304065';
            });
            presetButton.addEventListener('click', () => {
                setStoredLocation({
                    enabled: true,
                    locationName: preset.name,
                    latitude: preset.latitude,
                    longitude: preset.longitude,
                });
                overrideGeolocation({
                    latitude: preset.latitude,
                    longitude: preset.longitude,
                });
                updateSpoofingIndicator();
                console.log(`Location spoofed to ${preset.name}.`);
                window.location.reload();
            });

            return presetButton;
        }

        // Load and display preset buttons
        const presets = getPresetLocations();
        presets.forEach(preset => {
            const presetButton = createPresetButton(preset);
            presetsContainer.insertBefore(presetButton, addPresetButton);
        });

        // Location Input
        const locationInput = document.createElement('input');
        locationInput.type = 'text';
        locationInput.id = 'locationInput';
        locationInput.placeholder = 'Where to?';
        locationInput.style.cssText = `
            width: 100%;
            padding: 10px 15px;
            margin: 10px 0;
            border: none;
            border-radius: 4px;
            background-color: #0b111f;
            color: #ffffff;
            font-size: 16px;
            box-sizing: border-box;
        `;
        locationInput.addEventListener('focus', () => {
            locationInput.style.backgroundColor = '#304065';
            locationInput.style.outline = 'none';
        });
        locationInput.addEventListener('blur', () => {
            locationInput.style.backgroundColor = '#0b111f';
        });

        // Action Buttons Container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttonsContainer';
        buttonsContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
        `;

        // Apply Button
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply';
        applyButton.style.cssText = `
            flex: 1;
            padding: 10px 0;
            background-color: #304065;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
            min-width: 100px;
        `;
        applyButton.addEventListener('mouseover', () => {
            applyButton.style.backgroundColor = '#1e2a4a';
        });
        applyButton.addEventListener('mouseout', () => {
            applyButton.style.backgroundColor = '#304065';
        });
        applyButton.addEventListener('click', async () => {
            const locationName = locationInput.value.trim();
            if (!locationName) return;

            try {
                const coords = await geocodeLocation(locationName);
                setStoredLocation({
                    enabled: true,
                    locationName,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
                overrideGeolocation({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
                updateSpoofingIndicator();
                console.log('Location spoofing applied.');
                window.location.reload();
            } catch (error) {
                console.error(error.message);
            }
        });

        // Reset Button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.cssText = `
            flex: 1;
            padding: 10px 0;
            background-color: #dc3545;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
            min-width: 100px;
        `;
        resetButton.addEventListener('mouseover', () => {
            resetButton.style.backgroundColor = '#a71d2a';
        });
        resetButton.addEventListener('mouseout', () => {
            resetButton.style.backgroundColor = '#dc3545';
        });
        resetButton.addEventListener('click', () => {
            resetSpoofing();
            window.location.reload();
        });

        // Append buttons to buttons container
        buttonsContainer.appendChild(resetButton);
        buttonsContainer.appendChild(applyButton);

        // Append elements to modal
        modal.appendChild(closeButton);
        modal.appendChild(title);
        modal.appendChild(spoofingIndicatorContainer);
        modal.appendChild(presetsContainer);
        modal.appendChild(locationInput);
        modal.appendChild(buttonsContainer);

        // Append modal to overlay
        overlay.appendChild(modal);

        // Append overlay to body
        document.body.appendChild(overlay);

        // Dismiss modal when clicking outside the modal box
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });

        return overlay;
    }

    /**
     * Updates the spoofing indicator within the modal based on spoofing status.
     * Shows spoofed location if enabled, otherwise hides the indicator.
     */
    async function updateSpoofingIndicator() {
        const storedLocation = getStoredLocation();
        const indicatorContainer = document.getElementById(INDICATOR_ID);
        const statusText = document.getElementById('indicatorStatusText');
        const locationInfo = document.getElementById('locationInfoText');

        if (storedLocation.enabled && storedLocation.locationName) {
            // Spoofing is active - show the indicator
            indicatorContainer.style.display = 'flex';
            indicatorContainer.style.backgroundColor = '#1e2a4a';
            indicatorContainer.style.borderLeft = '5px solid #28a745';
            statusText.textContent = 'Enabled';
            statusText.style.color = '#28a745';
            locationInfo.textContent = `📍 ${storedLocation.locationName}`;
        } else {
            // Spoofing is inactive - hide the indicator
            indicatorContainer.style.display = 'none';
        }

        // Update the button indicator
        updateButtonIndicator();
    }

    /**
     * Updates the green indicator dot on the location spoofer button.
     */
    function updateButtonIndicator() {
        const button = document.querySelector('.sniffies-location-spoofer-btn');
        if (button) {
            const indicator = button.querySelector('.sniffies-location-indicator');
            const storedLocation = getStoredLocation();
            
            if (indicator) {
                if (storedLocation.enabled && storedLocation.locationName) {
                    indicator.style.display = 'inline';
                } else {
                    indicator.style.display = 'none';
                }
            }
        } else {
            // If button doesn't exist yet, try again immediately
            requestAnimationFrame(() => {
                updateButtonIndicator();
            });
        }
    }

    /**
     * Resets the spoofing by restoring original geolocation and removing all spoofing effects.
     */
    function resetSpoofing() {
        // Set the disabled flag
        isUserscriptDisabled = true;

        // Clear stored location data
        clearStoredLocation();

        // Restore the original geolocation
        restoreOriginalGeolocation();

        // Clear any active watch intervals
        if (activeWatchId) {
            navigator.geolocation.clearWatch(activeWatchId);
        }

        // Update spoofing indicator
        updateSpoofingIndicator();

        // Hide the modal if it's open
        const overlay = document.getElementById(MODAL_ID);
        if (overlay) {
            overlay.style.display = 'none';
        }

        console.log('Location reset to actual position. The userscript has been disabled.');
    }

    /**
     * Overrides the Geolocation API if spoofing is enabled and the userscript is not disabled.
     */
    function initSpoofing() {
        if (isUserscriptDisabled) return;

        const storedLocation = getStoredLocation();
        if (storedLocation.enabled && storedLocation.latitude && storedLocation.longitude) {
            overrideGeolocation({
                latitude: storedLocation.latitude,
                longitude: storedLocation.longitude,
            });
            updateSpoofingIndicator();
            console.log(`Location spoofed to: ${storedLocation.locationName} (${storedLocation.latitude}, ${storedLocation.longitude})`);
        } else {
            // Ensure the original Geolocation API is restored
            restoreOriginalGeolocation();
            updateSpoofingIndicator();
        }
    }

    /**
     * Attaches the spoofing modal to the Travel Mode button.
     */
    function attachModalToTravelMode() {
        const overlay = createModal();

        // Function to handle Travel Mode button clicks
        const handleTravelModeClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            overlay.style.display = 'flex';
        };

        // Wait for the Travel Mode icon to be available in the DOM
        const observer = new MutationObserver((mutations, obs) => {
            const travelModeIcon = document.querySelector(TRAVEL_MODE_ICON_SELECTOR);
            if (travelModeIcon) {
                // Find the closest clickable parent (assuming it's a button or clickable element)
                const travelModeButton = travelModeIcon.closest('button, a, div');
                if (travelModeButton) {
                    // Store references to original elements and classes
                    originalTravelModeButton = travelModeButton;
                    originalTravelModeIconClasses = [...travelModeIcon.classList];

                    // Remove existing event listeners by cloning the node
                    const newTravelModeButton = travelModeButton.cloneNode(true);
                    travelModeButton.parentNode.replaceChild(newTravelModeButton, travelModeButton);

                    // Attach new event listener
                    newTravelModeButton.addEventListener('click', handleTravelModeClick);

                    // Optionally, change the icon to indicate spoofing functionality
                    // Example: Change plane icon to a location pin
                    travelModeIcon.classList.remove('fa-plane');
                    travelModeIcon.classList.add('fa-map-marker-alt'); // Ensure FontAwesome supports this class
                }
                obs.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }


    /**
     * Gets the real geolocation of the user.
     * @returns {Promise<GeolocationPosition>} Promise resolving to the user's real geolocation.
     */
    function getRealPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            });
        });
    }



    /**
     * Initializes the userscript by setting up the UI and spoofing functionality.
     */
    function init() {
        if (isUserscriptDisabled) return;

        // Add CSS for green indicator
        addIndicatorStyles();

        // Hide plus button immediately to prevent flash
        hidePlusButton();

        // Wait for bottom nav to load, then add our button
        waitForBottomNav();

        // Create the modal
        createModal();

        // Initialize spoofing
        initSpoofing();
    }

    /**
     * Hides the plus button immediately to prevent it from showing.
     */
    function hidePlusButton() {
        const hideButton = () => {
            const plusButton = document.querySelector('[data-testid="plusIcon"]');
            if (plusButton) {
                plusButton.style.display = 'none';
            } else {
                // If not found, try again immediately
                requestAnimationFrame(hideButton);
            }
        };
        hideButton();
    }

    /**
     * Adds CSS styles for the green location indicator and hides the plus button.
     */
    function addIndicatorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .sniffies-location-indicator {
                color: #28a745 !important;
            }
            [data-testid="plusIcon"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Wait for the DOM to be fully loaded before initializing
    window.addEventListener('DOMContentLoaded', init);
})();