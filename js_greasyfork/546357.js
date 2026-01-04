// ==UserScript==
// @name         Autobahn Traffic Overlay
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2025.08.18
// @description  Displays German Autobahn traffic information in Waze Map Editor
// @author       Hiwi234
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        GM_xmlhttpRequest
// @connect      verkehr.autobahn.de
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license MIT
// Calculate distance between two points in kilometers
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
// @downloadURL https://update.greasyfork.org/scripts/546357/Autobahn%20Traffic%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/546357/Autobahn%20Traffic%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ID = 'vz-deutschland-overlay';
    const SCRIPT_NAME = 'VZ Deutschland Traffic';
    const API_BASE = 'https://verkehr.autobahn.de/o/autobahn';
    
    // List of all German Autobahns
    const AUTOBAHNS = [
        'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10',
        'A11', 'A12', 'A13', 'A14', 'A15', 'A17', 'A19', 'A20', 'A21', 'A23',
        'A24', 'A25', 'A26', 'A27', 'A28', 'A29', 'A30', 'A31', 'A33', 'A36',
        'A37', 'A38', 'A39', 'A40', 'A42', 'A43', 'A44', 'A45', 'A46', 'A48',
        'A49', 'A52', 'A57', 'A59', 'A60', 'A61', 'A62', 'A63', 'A64', 'A65',
        'A66', 'A67', 'A70', 'A71', 'A72', 'A73', 'A81', 'A92', 'A93', 'A94',
        'A95', 'A96', 'A98', 'A99', 'A100', 'A103', 'A111', 'A113', 'A114', 'A115'
    ];
    
    let isOverlayVisible = false;
    let overlayLayer = null;
    let vectorLayer = null; // For line segments
    let tabPane = null;
    let trafficMarkers = [];
    let trafficFeatures = []; // For line features
    let updateInterval = null;
    let currentRequests = [];
    let lastUpdateTime = null;
    let currentEventsData = []; // Store current events data for re-sorting
    let mapMoveTimeout = null; // For debouncing map movement updates
    let lastMapCenter = null; // Track last map center
    let lastMapZoom = null; // Track last map zoom
    let currentTooltip = null; // Track current hover tooltip

    // Initialize the userscript when WME is ready
    function initializeScript() {
        console.log(`${SCRIPT_NAME}: Initializing...`);
        
        try {
            // Register sidebar tab
            const { tabLabel, tabPane: pane } = W.userscripts.registerSidebarTab(SCRIPT_ID);
            tabPane = pane;
            
            // Set up tab label
            tabLabel.innerHTML = '<i class="fa fa-road" style="font-size: 16px;"></i>';
            tabLabel.title = SCRIPT_NAME;
            tabLabel.style.cursor = 'pointer';
            
            // Wait for tab pane to be connected to DOM
            W.userscripts.waitForElementConnected(tabPane).then(() => {
                setupTabContent();
                createOverlayLayer();
                
                // Auto-enable overlay after setup
                setTimeout(() => {
                    const overlayToggle = document.getElementById('vzOverlayToggle');
                    if (overlayToggle && overlayToggle.checked) {
                        showOverlay();
                    }
                }, 500);
            });
            
            console.log(`${SCRIPT_NAME}: Successfully initialized`);
            
        } catch (error) {
            console.error(`${SCRIPT_NAME}: Failed to initialize:`, error);
        }
    }

    // Create OpenLayers overlay layer
    function createOverlayLayer() {
        if (!W.map) return;

        // Create layer for point markers
        overlayLayer = new OpenLayers.Layer.Markers("German Autobahn Traffic", {
            displayInLayerSwitcher: false,
            uniqueName: "__autobahnTraffic"
        });

        // Create vector layer for line segments (affected road sections) with WME compatible styling
        vectorLayer = new OpenLayers.Layer.Vector("German Autobahn Sections", {
            displayInLayerSwitcher: false,
            uniqueName: "__autobahnSections",
            renderers: ["SVG", "VML", "Canvas"], // Ensure compatibility
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    strokeColor: "#ff4444",
                    strokeWidth: 4,
                    strokeOpacity: 0.8,
                    strokeDasharray: "10,5",
                    fillOpacity: 0
                })
            })
        });

        overlayLayer.setZIndex(2000);
        vectorLayer.setZIndex(1999); // Behind markers but above map
    }

    // Setup the content of the sidebar tab
    function setupTabContent() {
        tabPane.innerHTML = `
            <div style="padding: 10px;">
                <h3 style="margin-top: 0;">German Autobahn Traffic</h3>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="vzOverlayToggle" checked style="margin-right: 5px;">
                        Show Traffic Overlay
                    </label>
                    <label style="display: block; margin-bottom: 5px; margin-left: 20px;">
                        <input type="checkbox" id="showAffectedSections" checked style="margin-right: 5px;">
                        Show affected road sections as lines
                    </label>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <h4>Data Types:</h4>
                    <label style="display: block; margin-bottom: 3px;">
                        <input type="checkbox" class="vz-source" data-source="roadworks" checked style="margin-right: 5px;">
                        🚧 Construction Sites (Baustellen)
                    </label>
                    <label style="display: block; margin-bottom: 3px;">
                        <input type="checkbox" class="vz-source" data-source="warning" checked style="margin-right: 5px;">
                        ⚠️ Traffic Warnings (Verkehrsmeldungen)
                    </label>
                    <label style="display: block; margin-bottom: 3px;">
                        <input type="checkbox" class="vz-source" data-source="closure" checked style="margin-right: 5px;">
                        🚫 Road Closures (Sperrungen)
                    </label>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="autoUpdateEnabled" checked style="margin-right: 5px;">
                        Enable automatic updates
                    </label>
                    <div id="updateIntervalContainer" style="margin-left: 20px;">
                        <label style="display: block; margin-bottom: 5px;">
                            Update Interval: <span id="intervalValue">120</span>s
                        </label>
                        <input type="range" id="intervalSlider" min="30" max="600" step="30" value="120" style="width: 100%;">
                        <div style="font-size: 11px; color: #666; margin-top: 3px;">
                            Range: 30s - 10min (Map movement updates: Smart filtering)
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <button id="refreshOverlay" style="padding: 5px 10px; margin-right: 5px;">
                        🔄 Refresh Data
                    </button>
                    <button id="clearCache" style="padding: 5px 10px;">
                        🗑️ Clear Cache
                    </button>
                </div>
                
                <div id="statusDisplay" style="margin-top: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 3px; background: #f9f9f9; font-size: 12px;">
                    Status: Ready to load traffic data
                </div>
                
                <div id="statisticsDisplay" style="margin-top: 10px; padding: 8px; border: 1px solid #ddd; border-radius: 3px; background: #f0f8ff; font-size: 11px;">
                    <strong>Statistics:</strong><br>
                    Last Update: Never<br>
                    Total Events: 0<br>
                    Active Requests: 0
                </div>
                
                <!-- Traffic Events List -->
                <div id="eventsListContainer" style="margin-top: 15px; border-top: 2px solid #ddd; padding-top: 10px;">
                    <h4 style="margin: 0 0 10px 0; display: flex; justify-content: space-between; align-items: center;">
                        Traffic Events
                        <span id="eventsCount" style="font-size: 12px; background: #007cba; color: white; padding: 2px 6px; border-radius: 3px;">
                            0
                        </span>
                    </h4>
                    
                    <!-- Sorting Controls -->
                    <div style="margin-bottom: 10px; padding: 5px; background: #f0f8ff; border-radius: 3px; border: 1px solid #ddd;">
                        <label style="font-size: 11px; margin-right: 10px;">
                            <strong>Sortierung:</strong>
                        </label>
                        <label style="font-size: 11px; margin-right: 15px;">
                            <input type="radio" name="sortBy" value="distance" checked style="margin-right: 3px;">
                            Entfernung
                        </label>
                        <label style="font-size: 11px; margin-right: 15px;">
                            <input type="radio" name="sortBy" value="date" style="margin-right: 3px;">
                            Datum (neu→alt)
                        </label>
                        <label style="font-size: 11px; margin-right: 15px;">
                            <input type="radio" name="sortBy" value="dateOld" style="margin-right: 3px;">
                            Datum (alt→neu)
                        </label>
                        <label style="font-size: 11px;">
                            <input type="radio" name="sortBy" value="future" style="margin-right: 3px;">
                            Zukünftige Ereignisse
                        </label>
                    </div>
                    
                    <div id="eventsList" style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; border-radius: 3px; background: #fafafa;">
                        <div style="padding: 10px; text-align: center; color: #666; font-size: 12px;">
                            No events loaded yet
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 10px; font-size: 11px; color: #666;">
                    <p><strong>Real Data Source:</strong> verkehr.autobahn.de</p>
                    <p>Shows live traffic information from German Federal Highways. Data updates automatically based on your current map view.</p>
                    <p><strong>Tooltip:</strong> Hover over markers to see details. Click on markers to show persistent popup.</p>
                </div>
            </div>
        `;
        
        setupEventListeners();
    }

    // Setup event listeners for the controls
    function setupEventListeners() {
        const overlayToggle = document.getElementById('vzOverlayToggle');
        const intervalSlider = document.getElementById('intervalSlider');
        const intervalValue = document.getElementById('intervalValue');
        const refreshButton = document.getElementById('refreshOverlay');
        const clearCacheButton = document.getElementById('clearCache');
        const sourceCheckboxes = document.querySelectorAll('.vz-source');
        const autoUpdateCheckbox = document.getElementById('autoUpdateEnabled');
        const intervalContainer = document.getElementById('updateIntervalContainer');

        overlayToggle.addEventListener('change', function() {
            if (this.checked) {
                showOverlay();
            } else {
                hideOverlay();
            }
        });

        intervalSlider.addEventListener('input', function() {
            intervalValue.textContent = this.value;
            if (updateInterval && autoUpdateCheckbox.checked) {
                clearInterval(updateInterval);
                startAutoUpdate(parseInt(this.value) * 1000);
            }
        });

        // Auto-update toggle
        autoUpdateCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Enable auto-update
                intervalContainer.style.opacity = '1';
                intervalContainer.style.pointerEvents = 'auto';
                if (isOverlayVisible) {
                    const interval = parseInt(intervalSlider.value) * 1000;
                    startAutoUpdate(interval);
                }
                updateStatus('Automatic updates enabled');
            } else {
                // Disable auto-update
                intervalContainer.style.opacity = '0.5';
                intervalContainer.style.pointerEvents = 'none';
                if (updateInterval) {
                    clearInterval(updateInterval);
                    updateInterval = null;
                }
                updateStatus('Automatic updates disabled - manual refresh only');
            }
        });

        refreshButton.addEventListener('click', function() {
            if (isOverlayVisible) {
                updateTrafficData();
            }
        });

        clearCacheButton.addEventListener('click', function() {
            clearMarkers();
            clearFeatures();
            updateEventsList([]);
            updateStatus('Cache cleared');
        });

        sourceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (isOverlayVisible) {
                    updateTrafficData();
                }
            });
        });

        // Add event listeners for sorting radio buttons and section display
        document.addEventListener('change', function(e) {
            if (e.target.name === 'sortBy') {
                // Re-sort and update the events list
                const currentEvents = getCurrentEventsData();
                if (currentEvents && currentEvents.length > 0) {
                    updateEventsList(currentEvents);
                }
            } else if (e.target.id === 'showAffectedSections') {
                // Toggle road sections display
                if (isOverlayVisible) {
                    const currentEvents = getCurrentEventsData();
                    if (currentEvents && currentEvents.length > 0) {
                        clearFeatures(); // Clear existing features
                        const bounds = W.map.getExtent();
                        const displayData = currentEvents.filter(item => isItemInBounds(item, bounds));
                        displayData.forEach(item => {
                            addTrafficMarker(item);
                            if (e.target.checked) {
                                addRoadSection(item);
                            }
                        });
                    }
                }
            }
        });

        // Listen for map movement events with debouncing
        if (W.map && W.map.events) {
            W.map.events.register('moveend', null, function() {
                if (isOverlayVisible) {
                    handleMapMovement();
                }
            });

            W.map.events.register('zoomend', null, function() {
                if (isOverlayVisible) {
                    handleMapMovement();
                }
            });
        }
    }

    // Show the traffic overlay
    function showOverlay() {
        if (!overlayLayer || !vectorLayer || !W.map) return;

        W.map.addLayer(vectorLayer); // Add vector layer first (behind markers)
        W.map.addLayer(overlayLayer);

        // Add vector layer interaction controls
        setupVectorLayerEvents();
        
        isOverlayVisible = true;
        updateTrafficData();
        
        // Only start auto-update if enabled
        const autoUpdateEnabled = document.getElementById('autoUpdateEnabled')?.checked;
        if (autoUpdateEnabled) {
            const interval = parseInt(document.getElementById('intervalSlider').value) * 1000;
            startAutoUpdate(interval);
        }
        
        updateStatus('Overlay enabled - Loading traffic data...');
    }

    // Setup vector layer events for road sections
    function setupVectorLayerEvents() {
        if (!vectorLayer) return;

        console.log('Setting up vector layer events...');

        // Use WME-compatible event handling approach
        const selectControl = new OpenLayers.Control.SelectFeature(vectorLayer, {
            onSelect: function(feature) {
                console.log('Feature selected:', feature);
                if (feature.eventData) {
                    const bounds = feature.geometry.getBounds();
                    const centerPoint = bounds.getCenterLonLat();
                    
                    // Create a mouse event for tooltip positioning
                    const mockEvent = {
                        clientX: window.innerWidth / 2,
                        clientY: window.innerHeight / 2
                    };
                    
                    const tooltipContent = createTooltipContent(feature.eventData);
                    showTooltip(mockEvent, tooltipContent);
                }
            },
            onUnselect: function(feature) {
                // Optional: handle unselect
            }
        });

        // Add and activate the control
        W.map.addControl(selectControl);
        selectControl.activate();

        // Store reference for cleanup
        vectorLayer.selectControl = selectControl;
        
        console.log('Vector layer events set up successfully');
    }

    // Hide the traffic overlay
    function hideOverlay() {
        if (overlayLayer && W.map) {
            W.map.removeLayer(overlayLayer);
        }
        if (vectorLayer && W.map) {
            // Remove select control if exists
            if (vectorLayer.selectControl) {
                W.map.removeControl(vectorLayer.selectControl);
                vectorLayer.selectControl = null;
            }
            W.map.removeLayer(vectorLayer);
        }
        isOverlayVisible = false;
        
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
        
        // Cancel pending requests and map movement timeouts
        currentRequests.forEach(request => {
            if (request.abort) request.abort();
        });
        currentRequests = [];
        
        if (mapMoveTimeout) {
            clearTimeout(mapMoveTimeout);
            mapMoveTimeout = null;
        }
        
        // Hide any tooltip
        hideTooltip();
        
        updateStatus('Overlay disabled');
        updateStatistics();
    }

    // Start automatic updates (only if enabled)
    function startAutoUpdate(interval) {
        if (updateInterval) {
            clearInterval(updateInterval);
        }
        
        const autoUpdateEnabled = document.getElementById('autoUpdateEnabled')?.checked;
        if (!autoUpdateEnabled) {
            updateStatus('Automatic updates disabled');
            return;
        }
        
        updateInterval = setInterval(() => {
            if (isOverlayVisible && autoUpdateEnabled) {
                updateTrafficData();
            }
        }, interval);
        
        updateStatus(`Automatic updates enabled - every ${interval/1000} seconds`);
    }

    // Main function to update traffic data
    function updateTrafficData() {
        if (!overlayLayer || !W.map) return;

        const zoom = W.map.getZoom();
        if (zoom < 8) {
            updateStatus('Zoom in to see traffic data (minimum zoom level 8)');
            return;
        }

        updateStatus('Fetching traffic data from autobahn.de...');
        
        // Cancel any pending requests
        currentRequests.forEach(request => {
            if (request.abort) request.abort();
        });
        currentRequests = [];

        // Clear existing markers and features
        clearMarkers();
        clearFeatures();

        const selectedSources = getSelectedSources();
        if (selectedSources.length === 0) {
            updateStatus('No data types selected');
            return;
        }

        // Get relevant autobahns for current view
        const relevantAutobahns = getRelevantAutobahns();
        
        updateStatus(`Loading data for ${relevantAutobahns.length} autobahns...`);
        
        let completedRequests = 0;
        let totalRequests = relevantAutobahns.length * selectedSources.length;
        let allData = [];

        // Fetch data for each autobahn and data type
        relevantAutobahns.forEach(autobahn => {
            selectedSources.forEach(dataType => {
                fetchAutobahnData(autobahn, dataType)
                    .then(data => {
                        if (data && data.length > 0) {
                            allData = allData.concat(data.map(item => ({...item, autobahn, dataType})));
                        }
                        completedRequests++;
                        
                        if (completedRequests === totalRequests) {
                            // All requests completed
                            processTrafficData(allData);
                            lastUpdateTime = new Date();
                            updateStatus(`Data loaded successfully - ${allData.length} events found`);
                            updateStatistics();
                        } else {
                            updateStatus(`Loading... ${completedRequests}/${totalRequests} requests completed`);
                        }
                    })
                    .catch(error => {
                        console.error(`Error fetching ${dataType} for ${autobahn}:`, error);
                        completedRequests++;
                        
                        if (completedRequests === totalRequests) {
                            processTrafficData(allData);
                            lastUpdateTime = new Date();
                            updateStatus(`Data loaded with errors - ${allData.length} events found`);
                            updateStatistics();
                        }
                    });
            });
        });

        updateStatistics();
    }

    // Fetch data from autobahn API
    function fetchAutobahnData(autobahn, dataType) {
        return new Promise((resolve, reject) => {
            const url = `${API_BASE}/${autobahn}/services/${dataType}`;
            
            const request = GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'WME VZ Deutschland Overlay'
                },
                timeout: 15000,
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            resolve(data[dataType] || []);
                        } else {
                            console.warn(`HTTP ${response.status} for ${autobahn}/${dataType}`);
                            resolve([]);
                        }
                    } catch (error) {
                        console.error(`Parse error for ${autobahn}/${dataType}:`, error);
                        resolve([]);
                    }
                    
                    // Remove from active requests
                    const index = currentRequests.indexOf(request);
                    if (index > -1) currentRequests.splice(index, 1);
                },
                onerror: function(error) {
                    console.error(`Request error for ${autobahn}/${dataType}:`, error);
                    reject(error);
                    
                    // Remove from active requests
                    const index = currentRequests.indexOf(request);
                    if (index > -1) currentRequests.splice(index, 1);
                },
                ontimeout: function() {
                    console.warn(`Timeout for ${autobahn}/${dataType}`);
                    resolve([]);
                    
                    // Remove from active requests
                    const index = currentRequests.indexOf(request);
                    if (index > -1) currentRequests.splice(index, 1);
                }
            });
            
            currentRequests.push(request);
        });
    }

    // Get autobahns relevant for current map view
    function getRelevantAutobahns() {
        // Get current map bounds in WGS84
        const bounds = W.map.getExtent();
        const center = bounds.getCenterLonLat().transform(
            new OpenLayers.Projection("EPSG:3857"), 
            new OpenLayers.Projection("EPSG:4326")
        );
        
        console.log('Current center coordinates:', center.lat, center.lon);
        
        // More comprehensive autobahn selection based on geographic regions
        let relevantAutobahns = [];
        
        // Check if we're in Germany at all (rough bounds)
        if (center.lat < 47.3 || center.lat > 55.1 || center.lon < 5.9 || center.lon > 15.0) {
            // Outside Germany - use major autobahns
            relevantAutobahns = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'];
        } else {
            // Within Germany - regional selection
            if (center.lat > 53.5) {
                // Schleswig-Holstein, Hamburg
                relevantAutobahns = ['A1', 'A7', 'A20', 'A21', 'A23', 'A24', 'A25'];
            } else if (center.lat > 52.5) {
                // Lower Saxony, Bremen, Mecklenburg-Vorpommern
                relevantAutobahns = ['A1', 'A2', 'A7', 'A14', 'A19', 'A20', 'A24', 'A27', 'A28', 'A29', 'A30', 'A31'];
            } else if (center.lat > 51.5) {
                // North Rhine-Westphalia, Saxony-Anhalt, Brandenburg
                relevantAutobahns = ['A1', 'A2', 'A3', 'A4', 'A30', 'A31', 'A33', 'A37', 'A38', 'A39', 'A40', 'A42', 'A43', 'A44', 'A45', 'A46'];
            } else if (center.lat > 50.0) {
                // Hesse, Thuringia, Saxony, parts of Rhineland-Palatinate
                relevantAutobahns = ['A3', 'A4', 'A5', 'A6', 'A7', 'A9', 'A38', 'A40', 'A44', 'A45', 'A48', 'A60', 'A61', 'A66', 'A67', 'A71', 'A72', 'A73'];
            } else if (center.lat > 48.5) {
                // Baden-Württemberg, Bavaria (north)
                relevantAutobahns = ['A3', 'A5', 'A6', 'A7', 'A8', 'A9', 'A60', 'A61', 'A63', 'A65', 'A67', 'A70', 'A73', 'A81'];
            } else {
                // Bavaria (south), parts of Baden-Württemberg
                relevantAutobahns = ['A3', 'A5', 'A6', 'A8', 'A9', 'A70', 'A92', 'A93', 'A94', 'A95', 'A96', 'A99'];
            }
        }
        
        console.log('Selected autobahns for region:', relevantAutobahns);
        return relevantAutobahns;
    }

    // Process and display traffic data
    function processTrafficData(allData) {
        if (!allData || allData.length === 0) {
            updateStatus('No traffic events found for current area');
            updateEventsList([]);
            return;
        }

        console.log('Processing', allData.length, 'total events');
        
        // Log some sample data to understand structure
        if (allData.length > 0) {
            console.log('Sample event:', allData[0]);
        }

        // Get current map bounds
        const bounds = W.map.getExtent();
        console.log('Current map bounds (Web Mercator):', bounds);
        
        // Transform bounds to WGS84 for logging
        const boundsWGS84 = bounds.clone().transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));
        console.log('Current map bounds (WGS84):', boundsWGS84);

        // Calculate center for distance calculations
        const center = bounds.getCenterLonLat().transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));

        // Add distance and process timestamps for all events
        const allDataWithDistance = allData
            .filter(item => item.coordinate && item.coordinate.lat && item.coordinate.long)
            .map(item => {
                const distance = calculateDistance(center.lat, center.lon, item.coordinate.lat, item.coordinate.long);
                
                // Process timestamp for sorting
                let timestamp = null;
                let formattedDate = 'Unbekannt';
                
                if (item.startTimestamp) {
                    try {
                        timestamp = new Date(item.startTimestamp);
                        formattedDate = timestamp.toLocaleDateString('de-DE') + ' ' + timestamp.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
                    } catch (e) {
                        console.warn('Invalid timestamp for event:', item.identifier, item.startTimestamp);
                    }
                }
                
                return { 
                    ...item, 
                    distance,
                    timestamp,
                    formattedDate
                };
            });

        // Store current data for re-sorting
        currentEventsData = allDataWithDistance;

        // Filter data based on current map bounds
        const filteredData = allDataWithDistance.filter(item => {
            return isItemInBounds(item, bounds);
        });

        console.log('Filtered to', filteredData.length, 'events in current view');

        // If no events in current bounds, show nearby events
        let displayData = filteredData;
        if (filteredData.length === 0 && allDataWithDistance.length > 0) {
            displayData = allDataWithDistance.slice(0, 10); // Show 10 closest events
            console.log('Showing 10 nearest events instead');
            updateStatus(`No events in current view. Showing ${displayData.length} nearest events (closest: ${displayData[0]?.distance?.toFixed(1)}km away)`);
        } else {
            updateStatus(`Displaying ${filteredData.length} of ${allData.length} traffic events in current view`);
        }

        // Add markers and road sections for display data
        const showSections = document.getElementById('showAffectedSections')?.checked || false;
        displayData.forEach(item => {
            addTrafficMarker(item);
            if (showSections) {
                addRoadSection(item);
            }
        });

        // Update events list with all data (sorted according to current selection)
        updateEventsList(allDataWithDistance);
    }

    // Get current events data for re-sorting
    function getCurrentEventsData() {
        return currentEventsData;
    }

    // Sort events based on selected criteria
    function sortEvents(events, sortBy) {
        const sorted = [...events];
        
        switch (sortBy) {
            case 'distance':
                return sorted.sort((a, b) => a.distance - b.distance);
            
            case 'date':
                // Newest first (newest dates have higher timestamp values)
                return sorted.sort((a, b) => {
                    if (!a.timestamp && !b.timestamp) return 0;
                    if (!a.timestamp) return 1; // Events without date go to the end
                    if (!b.timestamp) return -1;
                    return b.timestamp - a.timestamp; // Newest first
                });
            
            case 'dateOld':
                // Oldest first (oldest dates have lower timestamp values)
                return sorted.sort((a, b) => {
                    if (!a.timestamp && !b.timestamp) return 0;
                    if (!a.timestamp) return 1; // Events without date go to the end
                    if (!b.timestamp) return -1;
                    return a.timestamp - b.timestamp; // Oldest first
                });
            
            case 'future':
                // Future events first, then by distance
                return sorted.sort((a, b) => {
                    // First sort by future status
                    if (a.future && !b.future) return -1;
                    if (!a.future && b.future) return 1;
                    
                    // If both have same future status, sort by distance
                    return a.distance - b.distance;
                });
            
            default:
                return sorted;
        }
    }

    // Update the events list in the sidebar
    function updateEventsList(events) {
        const eventsList = document.getElementById('eventsList');
        const eventsCount = document.getElementById('eventsCount');
        
        if (!eventsList) return;

        if (!events || events.length === 0) {
            eventsList.innerHTML = `
                <div style="padding: 10px; text-align: center; color: #666; font-size: 12px;">
                    No events loaded yet
                </div>
            `;
            if (eventsCount) eventsCount.textContent = '0';
            return;
        }

        // Get selected sorting method
        const sortBy = document.querySelector('input[name="sortBy"]:checked')?.value || 'distance';
        const sortedEvents = sortEvents(events, sortBy);

        if (eventsCount) eventsCount.textContent = events.length;

        const typeNames = {
            roadworks: '🚧 Baustelle',
            warning: '⚠️ Verkehrsmeldung',
            closure: '🚫 Sperrung'
        };

        const typeColors = {
            roadworks: '#ff9800',
            warning: '#f44336',
            closure: '#9c27b0'
        };

        let listHTML = '';
        sortedEvents.slice(0, 1000).forEach((event, index) => { // Increased limit to 1000 events
            const typeName = typeNames[event.dataType] || event.dataType;
            const typeColor = typeColors[event.dataType] || '#2196f3';
            const title = event.title || 'Keine Beschreibung';
            const autobahn = event.autobahn || 'Unbekannt';
            const distance = event.distance ? `${event.distance.toFixed(1)} km` : 'Unbekannt';
            const dateInfo = event.formattedDate || 'Unbekannt';
            
            // Add visual indicator for future events
            const futureIndicator = event.future ? ' style="background: #d1ecf1; border-left-color: #17a2b8 !important;"' : '';
            const futureIcon = event.future ? ' 🔮' : '';
            
            // Create secondary info based on sort order
            let secondaryInfo = '';
            if (sortBy === 'distance') {
                secondaryInfo = `<span>Entfernung: ${distance}</span><span>Datum: ${dateInfo}</span>`;
            } else if (sortBy === 'future') {
                const futureStatus = event.future ? '🔮 Zukünftig' : '📅 Aktuell';
                secondaryInfo = `<span>${futureStatus}</span><span>Entfernung: ${distance}</span>`;
            } else {
                secondaryInfo = `<span>Datum: ${dateInfo}</span><span>Entfernung: ${distance}</span>`;
            }
            
            listHTML += `
                <div class="event-item" data-event-id="${event.identifier}" style="
                    padding: 8px; 
                    border-bottom: 1px solid #ddd; 
                    cursor: pointer; 
                    background: white;
                    border-left: 4px solid ${typeColor};
                    ${futureIndicator.slice(7, -1)} // Remove 'style="' and '"'
                " onmouseover="this.style.background='#f0f8ff'" onmouseout="this.style.background='${event.future ? '#d1ecf1' : 'white'}'">
                    <div style="font-weight: bold; font-size: 12px; color: #333; margin-bottom: 3px;">
                        ${typeName}${futureIcon} - ${autobahn}
                    </div>
                    <div style="font-size: 11px; color: #666; margin-bottom: 3px;">
                        ${title}
                    </div>
                    <div style="font-size: 10px; color: #999; display: flex; justify-content: space-between;">
                        ${secondaryInfo}
                    </div>
                    <div style="font-size: 9px; color: #007cba; text-align: right; margin-top: 2px;">
                        Zur Position springen →
                    </div>
                </div>
            `;
        });

        if (events.length > 1000) {
            listHTML += `
                <div style="padding: 8px; text-align: center; color: #666; font-size: 11px; background: #f5f5f5;">
                    ... und ${events.length - 1000} weitere Events (nur die ersten 1000 werden angezeigt)
                </div>
            `;
        }

        eventsList.innerHTML = listHTML;

        // Add click event listeners to event items
        eventsList.querySelectorAll('.event-item').forEach(item => {
            item.addEventListener('click', function() {
                const eventId = this.dataset.eventId;
                jumpToEvent(eventId, sortedEvents);
            });
        });
    }

    // Jump to specific event on map (simplified - no popup)
    function jumpToEvent(eventId, events) {
        const event = events.find(e => e.identifier === eventId);
        if (!event || !event.coordinate) {
            console.error('Event not found or has no coordinates:', eventId);
            return;
        }

        try {
            // Transform coordinates to map projection
            const lonLat = new OpenLayers.LonLat(event.coordinate.long, event.coordinate.lat)
                .transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:3857"));

            // Center map on event
            W.map.setCenter(lonLat, Math.max(W.map.getZoom(), 12));

            updateStatus(`Jumped to ${event.dataType}: ${event.title || event.identifier}`);
        } catch (error) {
            console.error('Error jumping to event:', error);
            updateStatus('Error jumping to event');
        }
    }

    // Handle map movement with intelligent updates
    function handleMapMovement() {
        // Clear any pending update
        if (mapMoveTimeout) {
            clearTimeout(mapMoveTimeout);
        }

        try {
            // Get current map state
            const currentCenter = W.map.getCenter();
            const currentZoom = W.map.getZoom();

            // Check if we need to update based on movement distance and zoom
            const shouldUpdate = checkIfUpdateNeeded(currentCenter, currentZoom);
            
            if (shouldUpdate) {
                // Only auto-update if enabled
                const autoUpdateEnabled = document.getElementById('autoUpdateEnabled')?.checked;
                if (autoUpdateEnabled) {
                    // Debounce the update - wait 3 seconds after movement stops
                    mapMoveTimeout = setTimeout(() => {
                        updateStatus('Map moved significantly - updating traffic data...');
                        lastMapCenter = new OpenLayers.LonLat(currentCenter.lon, currentCenter.lat);
                        lastMapZoom = currentZoom;
                        updateTrafficData();
                    }, 3000);
                } else {
                    // Just update tracking without data fetch
                    lastMapCenter = new OpenLayers.LonLat(currentCenter.lon, currentCenter.lat);
                    lastMapZoom = currentZoom;
                    mapMoveTimeout = setTimeout(() => {
                        updateStatus('Map moved - automatic updates disabled (use refresh button)');
                        refilterExistingData();
                    }, 1000);
                }
            } else {
                // Just re-filter existing data for new viewport
                mapMoveTimeout = setTimeout(() => {
                    updateStatus('Re-filtering existing traffic data for new view...');
                    refilterExistingData();
                }, 1000);
            }
        } catch (error) {
            console.error('Error in handleMapMovement:', error);
            updateStatus('Error handling map movement');
        }
    }

    // Check if update is needed based on movement distance
    function checkIfUpdateNeeded(currentCenter, currentZoom) {
        try {
            // Always update on first load
            if (!lastMapCenter || !lastMapZoom) {
                return true;
            }

            // Always update if zoom changed significantly
            if (Math.abs(currentZoom - lastMapZoom) >= 2) {
                return true;
            }

            // Calculate movement distance in map units
            const distance = Math.sqrt(
                Math.pow(currentCenter.lon - lastMapCenter.lon, 2) + 
                Math.pow(currentCenter.lat - lastMapCenter.lat, 2)
            );

            // Update threshold based on zoom level (more movement needed at higher zooms)
            const updateThreshold = 100000 / Math.pow(2, currentZoom - 10); // Adjust threshold by zoom
            
            return distance > updateThreshold;
        } catch (error) {
            console.error('Error in checkIfUpdateNeeded:', error);
            return true; // Safe fallback: allow update
        }
    }

    // Re-filter existing data for new viewport without fetching new data
    function refilterExistingData() {
        if (!currentEventsData || currentEventsData.length === 0) {
            return;
        }

        try {
            // Clear current markers and features
            clearMarkers();
            clearFeatures();

            // Get current map bounds
            const bounds = W.map.getExtent();
            
            // Filter existing data for current bounds
            const filteredData = currentEventsData.filter(item => {
                return isItemInBounds(item, bounds);
            });

            // If no events in current bounds, show nearby events
            let displayData = filteredData;
            if (filteredData.length === 0 && currentEventsData.length > 0) {
                // Recalculate distances for current center
                const center = bounds.getCenterLonLat().transform(
                    new OpenLayers.Projection("EPSG:3857"), 
                    new OpenLayers.Projection("EPSG:4326")
                );
                
                const eventsWithNewDistances = currentEventsData.map(item => ({
                    ...item,
                    distance: calculateDistance(center.lat, center.lon, item.coordinate.lat, item.coordinate.long)
                })).sort((a, b) => a.distance - b.distance);
                
                displayData = eventsWithNewDistances.slice(0, 10);
                updateStatus(`No events in current view. Showing ${displayData.length} nearest events (using cached data)`);
            } else {
                updateStatus(`Re-filtered to ${filteredData.length} events in current view (using cached data)`);
            }

            // Add markers and road sections for display data
            const showSections = document.getElementById('showAffectedSections')?.checked || false;
            displayData.forEach(item => {
                addTrafficMarker(item);
                if (showSections) {
                    addRoadSection(item);
                }
            });

            updateStatistics();
        } catch (error) {
            console.error('Error in refilterExistingData:', error);
            updateStatus('Error re-filtering data');
        }
    }

    // Check if item is within current map bounds
    function isItemInBounds(item, bounds) {
        if (!item.coordinate || (!item.coordinate.lat && item.coordinate.lat !== 0) || (!item.coordinate.long && item.coordinate.long !== 0)) {
            console.log('Invalid coordinates for item:', item.identifier, item.coordinate);
            return false;
        }

        try {
            // Transform bounds to WGS84 for comparison
            const boundsWGS84 = bounds.clone().transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));
            
            // Check if item coordinates are within bounds
            const lat = parseFloat(item.coordinate.lat);
            const lng = parseFloat(item.coordinate.long);
            
            if (isNaN(lat) || isNaN(lng)) {
                console.log('Invalid coordinate values:', lat, lng, 'for item:', item.identifier);
                return false;
            }
            
            const isInBounds = lat >= boundsWGS84.bottom && lat <= boundsWGS84.top && 
                              lng >= boundsWGS84.left && lng <= boundsWGS84.right;
            
            if (!isInBounds) {
                console.log('Item outside bounds:', item.identifier, 'coords:', lat, lng, 'bounds:', boundsWGS84);
            }
            
            return isInBounds;
        } catch (error) {
            console.error('Error checking bounds for item:', item.identifier, error);
            return false;
        }
    }

    // Add a traffic marker to the map with FIXED event handling
    function addTrafficMarker(item) {
        if (!item.coordinate || (!item.coordinate.lat && item.coordinate.lat !== 0) || (!item.coordinate.long && item.coordinate.long !== 0)) {
            console.log('Skipping item with invalid coordinates:', item.identifier);
            return;
        }

        try {
            const lat = parseFloat(item.coordinate.lat);
            const lng = parseFloat(item.coordinate.long);
            
            if (isNaN(lat) || isNaN(lng)) {
                console.log('Skipping item with NaN coordinates:', item.identifier, lat, lng);
                return;
            }

            const lonLat = new OpenLayers.LonLat(lng, lat)
                .transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:3857"));

            // Create marker icon based on data type
            const size = new OpenLayers.Size(24, 24);
            const offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
            const iconUrl = createMarkerIcon(item.dataType);
            const icon = new OpenLayers.Icon(iconUrl, size, offset);

            const marker = new OpenLayers.Marker(lonLat, icon);
            
            // FIXED: Simplified event handling - hover shows tooltip, click shows persistent popup
            marker.events.register('mouseover', marker, function(e) {
                const tooltipContent = createTooltipContent(item);
                const mouseEvent = e.originalEvent || e;
                showHoverTooltip(mouseEvent, tooltipContent);
            });
            
            marker.events.register('mouseout', marker, function(e) {
                hideHoverTooltip();
            });
            
            marker.events.register('click', marker, function(e) {
                const tooltipContent = createTooltipContent(item);
                const mouseEvent = e.originalEvent || e;
                showPersistentPopup(mouseEvent, tooltipContent);
                // Don't stop propagation - let click pass through to WME
            });

            // Store marker data
            marker.trafficData = item;

            overlayLayer.addMarker(marker);
            trafficMarkers.push({marker, data: item});
            
            console.log('Added marker for:', item.identifier, 'at', lat, lng);
        } catch (error) {
            console.error('Error adding marker for item:', item.identifier, error);
        }
    }

    // Parse event description for structured information with enhanced closure details
    function parseEventDescription(description, eventType) {
        const info = {
            begin: '',
            end: '',
            measure: '',
            restrictions: '',
            situation: '',
            location: '',
            additional: '',
            closureType: '',
            affectedVehicles: '',
            landmark: '',
            closedSection: '',
            alternativeRoute: '',
            closureReason: '',
            detour: '',
            sectionLength: 0
        };

        if (!Array.isArray(description)) {
            return info;
        }

        let additionalLines = [];
        let inRestrictions = false;

        description.forEach((line, index) => {
            const trimmedLine = line.trim();
            
            if (!trimmedLine) return; // Skip empty lines

            if (trimmedLine.startsWith('Beginn:')) {
                info.begin = trimmedLine;
            } else if (trimmedLine.startsWith('Ende:')) {
                info.end = trimmedLine;
            } else if (trimmedLine.startsWith('Art der Maßnahme:')) {
                info.measure = trimmedLine.replace('Art der Maßnahme:', '').trim();
            } else if (trimmedLine.startsWith('Einschränkungen:')) {
                info.restrictions = trimmedLine.replace('Einschränkungen:', '').trim().replace(/\\n/g, '<br>');
                inRestrictions = true;
            } else if (inRestrictions && !trimmedLine.includes(':') && !trimmedLine.includes('gesperrt')) {
                // Continue restrictions on next lines
                info.restrictions += '<br>' + trimmedLine.replace(/\\n/g, '<br>');
            } else if (trimmedLine.includes('zwischen ') || trimmedLine.includes('bei ') || trimmedLine.includes('von ') || trimmedLine.includes('bis ')) {
                // Location information - enhanced for closures
                info.location = trimmedLine;
                
                // Extract specific closure section details
                if (eventType === 'closure' || eventType === 'roadworks') {
                    // Try to extract closed section from location
                    const sectionMatch = trimmedLine.match(/(zwischen|von)\s+([^-]+)\s*-?\s*(bis|und)?\s*([^,]*)/i);
                    if (sectionMatch) {
                        const start = sectionMatch[2]?.trim();
                        const end = sectionMatch[4]?.trim();
                        if (start && end) {
                            info.closedSection = `${start} → ${end}`;
                        } else if (start) {
                            info.closedSection = start;
                        }
                    }
                }
                inRestrictions = false;
            } else if ((eventType === 'closure' || eventType === 'roadworks') && (
                trimmedLine.includes('gesperrt') || 
                trimmedLine.includes('Sperrung') ||
                trimmedLine.includes('Vollsperrung') ||
                trimmedLine.includes('blockiert') ||
                trimmedLine.includes('Baustelle')
            )) {
                // Enhanced closure type analysis
                info.closureType = trimmedLine;
                
                // Extract closure reason
                if (trimmedLine.includes('Unfall')) {
                    info.closureReason = 'Verkehrsunfall';
                } else if (trimmedLine.includes('Baustelle')) {
                    info.closureReason = 'Bauarbeiten';
                } else if (trimmedLine.includes('Bergung')) {
                    info.closureReason = 'Bergungsarbeiten';
                } else if (trimmedLine.includes('Defekt') || trimmedLine.includes('Panne')) {
                    info.closureReason = 'Fahrzeugpanne';
                } else if (trimmedLine.includes('Wetter') || trimmedLine.includes('Glätte') || trimmedLine.includes('Schnee')) {
                    info.closureReason = 'Witterungsbedingungen';
                } else if (trimmedLine.includes('Kontrolle') || trimmedLine.includes('Polizei')) {
                    info.closureReason = 'Polizeikontrolle';
                }
                
                // Extract affected vehicles with more detail
                if (trimmedLine.includes('LKW')) {
                    info.affectedVehicles = 'LKW';
                    if (trimmedLine.includes('über 3,5 t')) {
                        info.affectedVehicles += ' über 3,5t';
                    }
                } else if (trimmedLine.includes('PKW')) {
                    info.affectedVehicles = 'PKW';
                } else if (trimmedLine.includes('allen Fahrzeugen') || trimmedLine.includes('beide Richtungen')) {
                    info.affectedVehicles = 'Alle Fahrzeuge';
                } else if (trimmedLine.includes('Fahrbahn')) {
                    if (trimmedLine.includes('eine Fahrbahn')) {
                        info.affectedVehicles = 'Eine Fahrbahn';
                    } else if (trimmedLine.includes('beide Fahrbahnen')) {
                        info.affectedVehicles = 'Beide Fahrbahnen';
                    }
                }
                
                // Extract direction if specified
                if (trimmedLine.includes('Richtung ')) {
                    const directionMatch = trimmedLine.match(/Richtung\s+([^\s,]+)/i);
                    if (directionMatch) {
                        info.affectedVehicles += ` (Richtung ${directionMatch[1]})`;
                    }
                }
                
                inRestrictions = false;
            } else if (trimmedLine.includes('Umleitung') || trimmedLine.includes('Ausweichroute') || trimmedLine.includes('Alternative')) {
                // Extract detour information
                info.detour = trimmedLine;
                inRestrictions = false;
            } else if (eventType === 'warning' && (
                trimmedLine.includes('Stau') || 
                trimmedLine.includes('Verengung') || 
                trimmedLine.includes('Verkehrsführung') ||
                trimmedLine.includes('gesperrt') ||
                trimmedLine.includes('Gefahr')
            )) {
                // Traffic situation for warnings
                info.situation = trimmedLine.replace(/\\n/g, '<br>');
                inRestrictions = false;
            } else if (trimmedLine.includes('Maximale Durchfahrsbreite:') || trimmedLine.includes('Höhenbegrenzung:')) {
                // Add to restrictions
                if (info.restrictions) {
                    info.restrictions += '<br>' + trimmedLine;
                } else {
                    info.restrictions = trimmedLine;
                }
                inRestrictions = false;
            } else if ((eventType === 'closure' || eventType === 'roadworks') && (
                trimmedLine.includes('Brücke') || 
                trimmedLine.includes('Tunnel') ||
                trimmedLine.includes('Kreuz') ||
                trimmedLine.includes('Dreieck') ||
                trimmedLine.includes('Anschlussstelle') ||
                trimmedLine.includes('Auffahrt') ||
                trimmedLine.includes('Abfahrt')
            )) {
                // Enhanced landmark information for closures
                info.landmark = trimmedLine;
                inRestrictions = false;
            } else if (trimmedLine.includes('AS ') || trimmedLine.includes('AK ') || trimmedLine.includes('AD ')) {
                // Autobahn junction/interchange codes
                if (!info.landmark) {
                    info.landmark = trimmedLine;
                } else {
                    info.landmark += ' • ' + trimmedLine;
                }
                inRestrictions = false;
            } else if (index > 2 && !trimmedLine.includes(':')) {
                // Additional information (skip first few lines which are usually structured)
                additionalLines.push(trimmedLine.replace(/\\n/g, '<br>'));
                inRestrictions = false;
            }
        });

        if (additionalLines.length > 0) {
            info.additional = additionalLines.join('<br>');
        }

        return info;
    }

    // Calculate section length from extent coordinates
    function calculateSectionLength(item) {
        if (!item.extent) {
            return 0;
        }

        try {
            // Parse extent: "lon1,lat1,lon2,lat2"
            const extentParts = item.extent.split(',').map(parseFloat);
            if (extentParts.length !== 4) {
                return 0;
            }

            const [lon1, lat1, lon2, lat2] = extentParts;
            
            // Calculate distance between start and end points
            const distance = calculateDistance(lat1, lon1, lat2, lon2);
            return distance;
        } catch (error) {
            console.error('Error calculating section length:', error);
            return 0;
        }
    }

    // Format length for display
    function formatSectionLength(lengthKm) {
        if (lengthKm === 0) return '';
        
        if (lengthKm < 1) {
            return `${Math.round(lengthKm * 1000)} m`;
        } else if (lengthKm < 10) {
            return `${lengthKm.toFixed(1)} km`;
        } else {
            return `${Math.round(lengthKm)} km`;
        }
    }

    // Create visual length indicator
    function createLengthIndicator(lengthKm, eventType) {
        if (lengthKm === 0) return '';

        // Determine color based on event type and length
        let color = '#007cba';
        let severity = 'normal';
        
        if (eventType === 'closure') {
            color = '#dc3545';
            severity = lengthKm > 5 ? 'severe' : lengthKm > 2 ? 'moderate' : 'normal';
        } else if (eventType === 'roadworks') {
            color = '#ff9800';
            severity = lengthKm > 10 ? 'severe' : lengthKm > 5 ? 'moderate' : 'normal';
        } else if (eventType === 'warning') {
            color = '#ffc107';
            severity = lengthKm > 3 ? 'moderate' : 'normal';
        }

        // Create visual bar indicator
        const maxWidth = 120; // Max width in pixels
        const width = Math.min(maxWidth, Math.max(20, lengthKm * 8)); // Scale factor
        
        const severityText = {
            'severe': 'Lange Strecke',
            'moderate': 'Mittlere Strecke', 
            'normal': 'Kurze Strecke'
        };

        return `
            <div style="margin: 4px 0; padding: 4px; background: rgba(0,0,0,0.05); border-radius: 3px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
                    <span style="font-size: 10px; font-weight: bold;">Streckenlänge:</span>
                    <span style="font-size: 11px; color: ${color}; font-weight: bold;">${formatSectionLength(lengthKm)}</span>
                </div>
                <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="
                        background: ${color}; 
                        height: 100%; 
                        width: ${width}px; 
                        border-radius: 4px;
                        transition: width 0.3s ease;
                        background-image: repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 5px,
                            rgba(255,255,255,0.2) 5px,
                            rgba(255,255,255,0.2) 10px
                        );
                    "></div>
                </div>
                <div style="font-size: 9px; color: #666; margin-top: 2px;">${severityText[severity]}</div>
            </div>
        `;
    }

    // Create tooltip content with full details
    function createTooltipContent(item) {
        const typeNames = {
            roadworks: '🚧 Baustelle',
            warning: '⚠️ Verkehrsmeldung',
            closure: '🚫 Sperrung'
        };

        const displayTypeInfo = getDisplayTypeInfo(item.display_type);
        const typeName = displayTypeInfo.name || typeNames[item.dataType] || item.dataType;
        const typeIcon = displayTypeInfo.icon || (typeNames[item.dataType] ? typeNames[item.dataType].split(' ')[0] : '📍');

        const title = item.title || 'Keine Beschreibung';
        const subtitle = item.subtitle || '';
        const autobahn = item.autobahn || 'Unbekannt';
        const distance = item.distance ? `${item.distance.toFixed(1)} km` : '';

        // Extract detailed info from description with enhanced closure parsing
        let beginInfo = '';
        let endInfo = '';
        let measureInfo = '';
        let restrictionInfo = '';
        let additionalInfo = '';
        let closedSection = '';
        let closureReason = '';
        let affectedVehicles = '';
        let detour = '';

        if (item.description && Array.isArray(item.description)) {
            const parsedInfo = parseEventDescription(item.description, item.dataType);
            beginInfo = parsedInfo.begin;
            endInfo = parsedInfo.end;
            measureInfo = parsedInfo.measure;
            restrictionInfo = parsedInfo.restrictions;
            additionalInfo = parsedInfo.additional;
            closedSection = parsedInfo.closedSection;
            closureReason = parsedInfo.closureReason;
            affectedVehicles = parsedInfo.affectedVehicles;
            detour = parsedInfo.detour;
        }

        // Calculate section length
        const sectionLength = calculateSectionLength(item);
        const lengthIndicator = createLengthIndicator(sectionLength, item.dataType);

        const startTime = item.startTimestamp ? new Date(item.startTimestamp).toLocaleString('de-DE') : '';

        return {
            icon: typeIcon,
            type: typeName,
            autobahn: autobahn,
            title: title,
            subtitle: subtitle,
            distance: distance,
            begin: beginInfo || (startTime ? `Beginn: ${startTime}` : ''),
            end: endInfo,
            measure: measureInfo,
            restrictions: restrictionInfo,
            additional: additionalInfo,
            isBlocked: item.isBlocked && item.isBlocked !== 'false',
            isFuture: item.future,
            identifier: item.identifier || '',
            closedSection: closedSection,
            closureReason: closureReason,
            affectedVehicles: affectedVehicles,
            detour: detour,
            sectionLength: sectionLength,
            lengthIndicator: lengthIndicator
        };
    }

    // Show hover tooltip (simple, follows mouse)
    function showHoverTooltip(event, content) {
        hideHoverTooltip(); // Clear any existing hover tooltip
        
        const tooltip = document.createElement('div');
        tooltip.id = 'traffic-hover-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            z-index: 10002;
            pointer-events: none;
            max-width: 300px;
            line-height: 1.3;
        `;

        tooltip.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">
                ${content.icon} ${content.type} - ${content.autobahn}
            </div>
            <div style="font-size: 11px;">
                ${content.title}
            </div>
            ${content.distance ? `<div style="font-size: 10px; margin-top: 4px; opacity: 0.8;">Entfernung: ${content.distance}</div>` : ''}
            ${content.sectionLength > 0 ? `<div style="font-size: 10px; margin-top: 2px; opacity: 0.9; color: #ffc107;">Länge: ${formatSectionLength(content.sectionLength)}</div>` : ''}
        `;

        document.body.appendChild(tooltip);
        currentTooltip = tooltip;

        // Position tooltip
        const x = event.clientX + 15;
        const y = event.clientY - 10;
        
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';

        // Adjust if tooltip goes off screen
        setTimeout(() => {
            const rect = tooltip.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                tooltip.style.left = (event.clientX - rect.width - 15) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                tooltip.style.top = (event.clientY - rect.height - 15) + 'px';
            }
        }, 10);
    }

    // Hide hover tooltip
    function hideHoverTooltip() {
        if (currentTooltip) {
            currentTooltip.remove();
            currentTooltip = null;
        }
    }

    // Show persistent popup with full details (on click)
    function showPersistentPopup(event, content) {
        // Don't create multiple popups for the same event
        const existingPopup = document.getElementById(`traffic-popup-${content.identifier}`);
        if (existingPopup) {
            // Just bring existing popup to front
            existingPopup.style.zIndex = '10001';
            return;
        }
        
        const popup = document.createElement('div');
        popup.id = `traffic-popup-${content.identifier}`;
        popup.className = 'traffic-persistent-popup';
        popup.style.cssText = `
            position: fixed;
            background: white;
            border: 2px solid #007cba;
            border-radius: 8px;
            padding: 12px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            min-width: 280px;
            opacity: 0;
            transition: opacity 0.2s ease;
            line-height: 1.4;
            user-select: text;
            cursor: default;
        `;

        // Create close button
        const closeButton = document.createElement('div');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            width: 20px;
            height: 20px;
            background: #ff4444;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
            z-index: 1;
        `;
        
        closeButton.addEventListener('click', function(e) {
            e.stopPropagation();
            popup.remove();
        });

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.innerHTML = '⋮⋮';
        dragHandle.style.cssText = `
            position: absolute;
            top: 8px;
            right: 32px;
            width: 20px;
            height: 20px;
            background: #007cba;
            color: white;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: move;
            font-weight: bold;
            font-size: 10px;
            z-index: 1;
        `;

        let popupHTML = `
            <div style="margin-bottom: 8px; font-weight: bold; color: #007cba; border-bottom: 1px solid #eee; padding-bottom: 6px; padding-right: 60px; font-size: 13px;">
                ${content.icon} ${content.type} - ${content.autobahn}
            </div>
            <div style="margin-bottom: 6px;">
                <strong>📍 Strecke:</strong><br>
                <span style="font-size: 11px; user-select: text;">${content.title}</span>
            </div>
        `;

        if (content.subtitle) {
            popupHTML += `
            <div style="margin-bottom: 6px;">
                <strong>🚗 Richtung:</strong> <span style="font-size: 11px; user-select: text;">${content.subtitle}</span>
            </div>`;
        }

        if (content.measure) {
            popupHTML += `
            <div style="margin-bottom: 6px;">
                <strong>🔧 Maßnahme:</strong> <span style="font-size: 11px; user-select: text;">${content.measure}</span>
            </div>`;
        }

        // Enhanced closure information display
        if (content.closedSection) {
            popupHTML += `
            <div style="margin-bottom: 6px; padding: 6px; background: #fff3cd; border-left: 3px solid #dc3545; border-radius: 3px;">
                <strong>🚧 Gesperrter Streckenabschnitt:</strong><br>
                <span style="font-size: 12px; font-weight: bold; color: #721c24; user-select: text;">${content.closedSection}</span>
            </div>`;
        }

        // Add visual length indicator
        if (content.lengthIndicator) {
            popupHTML += content.lengthIndicator;
        }

        if (content.closureReason) {
            popupHTML += `
            <div style="margin-bottom: 6px;">
                <strong>❓ Sperrungsgrund:</strong> <span style="font-size: 11px; user-select: text;">${content.closureReason}</span>
            </div>`;
        }

        if (content.affectedVehicles) {
            popupHTML += `
            <div style="margin-bottom: 6px;">
                <strong>🚛 Betroffene Fahrzeuge:</strong> <span style="font-size: 11px; user-select: text;">${content.affectedVehicles}</span>
            </div>`;
        }

        if (content.detour) {
            popupHTML += `
            <div style="margin-bottom: 6px; padding: 6px; background: #d4edda; border-left: 3px solid #28a745; border-radius: 3px;">
                <strong>🛣️ Umleitung:</strong><br>
                <span style="font-size: 11px; user-select: text;">${content.detour}</span>
            </div>`;
        }

        if (content.begin || content.end) {
            popupHTML += `
            <div style="margin-bottom: 6px;">
                <strong>📅 Zeitraum:</strong><br>
                <span style="font-size: 11px; user-select: text;">
                    ${content.begin}<br>
                    ${content.end || 'Ende: Unbekannt'}
                </span>
            </div>`;
        }

        if (content.restrictions) {
            popupHTML += `
            <div style="margin-bottom: 6px; padding: 6px; background: #fff3cd; border-left: 3px solid #ffc107; border-radius: 3px;">
                <strong>⚠️ Einschränkungen:</strong><br>
                <span style="font-size: 11px; user-select: text;">${content.restrictions}</span>
            </div>`;
        }

        if (content.additional) {
            popupHTML += `
            <div style="margin-bottom: 6px; padding: 6px; background: #e8f4fd; border-left: 3px solid #007cba; border-radius: 3px;">
                <strong>ℹ️ Information:</strong><br>
                <span style="font-size: 11px; user-select: text;">${content.additional}</span>
            </div>`;
        }

        if (content.isFuture) {
            popupHTML += `
            <div style="margin-bottom: 6px; padding: 4px; background: #d1ecf1; border-radius: 3px; font-size: 11px; color: #0c5460;">
                <strong>🔮 Zukünftiges Ereignis</strong>
            </div>`;
        }

        if (content.isBlocked) {
            popupHTML += `
            <div style="margin-bottom: 6px; padding: 4px; background: #f8d7da; border-radius: 3px; font-size: 11px; color: #721c24;">
                <strong>🚫 Blockiert</strong>
            </div>`;
        }

        if (content.distance) {
            popupHTML += `
            <div style="margin-bottom: 6px;">
                <strong>📏 Entfernung:</strong> <span style="user-select: text;">${content.distance}</span>
            </div>`;
        }

        popupHTML += `
            <div style="font-size: 10px; color: #666; border-top: 1px solid #eee; padding-top: 6px; margin-top: 8px;">
                <strong>ID:</strong> <span style="user-select: text;">${content.identifier}</span>
            </div>
            <div style="margin-top: 8px; text-align: center;">
                <button class="copy-id-btn" style="padding: 4px 8px; font-size: 10px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px;">
                    📋 Copy ID
                </button>
                <button class="copy-all-btn" style="padding: 4px 8px; font-size: 10px; background: #007cba; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    📄 Copy All Info
                </button>
            </div>
        `;

        popup.innerHTML = popupHTML;
        popup.appendChild(closeButton);
        popup.appendChild(dragHandle);
        
        // Add event listeners for copy buttons
        const copyIdBtn = popup.querySelector('.copy-id-btn');
        const copyAllBtn = popup.querySelector('.copy-all-btn');
        
        copyIdBtn.addEventListener('click', function() {
            copyToClipboard(content.identifier, popup);
        });
        
        copyAllBtn.addEventListener('click', function() {
            copyAllInfo(content, popup);
        });
        
        document.body.appendChild(popup);
        
        // Position popup
        let x = event.clientX + 15;
        let y = event.clientY - 10;
        
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        
        // Show with fade-in
        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);
        
        // Adjust position if popup goes off screen
        setTimeout(() => {
            const rect = popup.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                x = event.clientX - rect.width - 15;
                popup.style.left = x + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                y = event.clientY - rect.height - 10;
                popup.style.top = y + 'px';
            }
            if (rect.top < 0) {
                popup.style.top = '10px';
            }
            if (x < 0) {
                popup.style.left = '10px';
            }
        }, 20);

        // Make popup draggable
        makeDraggable(popup, dragHandle);

        // Store content for copy functions
        popup.contentData = content;
    }

    // Hide tooltip (now hides all popups and hover tooltips)
    function hideTooltip() {
        hideHoverTooltip();
        const popups = document.querySelectorAll('.traffic-persistent-popup');
        popups.forEach(popup => popup.remove());
    }

    // Make popup draggable
    function makeDraggable(popup, handle) {
        let isDragging = false;
        let startX, startY;
        let popupStartX, popupStartY;

        handle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            e.preventDefault();
            isDragging = true;
            
            // Get the current popup position
            const rect = popup.getBoundingClientRect();
            popupStartX = rect.left;
            popupStartY = rect.top;
            
            // Get mouse position
            startX = e.clientX;
            startY = e.clientY;
            
            popup.style.zIndex = '10001'; // Bring to front when dragging
            popup.style.transition = 'none'; // Disable transition during drag
            
            // Add dragging class for visual feedback
            popup.style.opacity = '0.9';
            handle.style.background = '#005a9b';
        }

        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            // Calculate the new position
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newX = popupStartX + deltaX;
            const newY = popupStartY + deltaY;
            
            // Apply constraints to keep popup on screen
            const maxX = window.innerWidth - popup.offsetWidth;
            const maxY = window.innerHeight - popup.offsetHeight;
            
            const constrainedX = Math.max(0, Math.min(newX, maxX));
            const constrainedY = Math.max(0, Math.min(newY, maxY));
            
            popup.style.left = constrainedX + 'px';
            popup.style.top = constrainedY + 'px';
        }

        function dragEnd(e) {
            if (!isDragging) return;
            
            isDragging = false;
            
            // Restore visual feedback
            popup.style.opacity = '1';
            popup.style.transition = 'opacity 0.2s ease';
            handle.style.background = '#007cba';
        }
    }

    // Copy functions
    function copyToClipboard(identifier, popup) {
        navigator.clipboard.writeText(identifier).then(() => {
            // Show brief confirmation
            if (popup) {
                const originalBorder = popup.style.border;
                popup.style.border = '2px solid #28a745';
                setTimeout(() => {
                    popup.style.border = originalBorder;
                }, 300);
            }
        }).catch(err => {
            console.error('Failed to copy ID:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = identifier;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                if (popup) {
                    const originalBorder = popup.style.border;
                    popup.style.border = '2px solid #28a745';
                    setTimeout(() => {
                        popup.style.border = originalBorder;
                    }, 300);
                }
            } catch (fallbackErr) {
                console.error('Fallback copy failed:', fallbackErr);
            }
            document.body.removeChild(textArea);
        });
    }

    function copyAllInfo(content, popup) {
        let copyText = `${content.type} - ${content.autobahn}\n`;
        copyText += `Strecke: ${content.title}\n`;
        if (content.subtitle) copyText += `Richtung: ${content.subtitle}\n`;
        if (content.measure) copyText += `Maßnahme: ${content.measure}\n`;
        if (content.begin) copyText += `${content.begin}\n`;
        if (content.end) copyText += `${content.end}\n`;
        if (content.restrictions) copyText += `Einschränkungen: ${content.restrictions}\n`;
        if (content.additional) copyText += `Information: ${content.additional}\n`;
        if (content.distance) copyText += `Entfernung: ${content.distance}\n`;
        copyText += `ID: ${content.identifier}`;

        navigator.clipboard.writeText(copyText).then(() => {
            // Show brief confirmation
            if (popup) {
                const originalBorder = popup.style.border;
                popup.style.border = '2px solid #28a745';
                setTimeout(() => {
                    popup.style.border = originalBorder;
                }, 300);
            }
        }).catch(err => {
            console.error('Failed to copy info:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = copyText;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                if (popup) {
                    const originalBorder = popup.style.border;
                    popup.style.border = '2px solid #28a745';
                    setTimeout(() => {
                        popup.style.border = originalBorder;
                    }, 300);
                }
            } catch (fallbackErr) {
                console.error('Fallback copy failed:', fallbackErr);
            }
            document.body.removeChild(textArea);
        });
    }

    // Create marker icon based on data type
    function createMarkerIcon(dataType) {
        const iconConfig = {
            roadworks: { emoji: '🚧', color: '#ff9800' },
            warning: { emoji: '⚠️', color: '#f44336' },
            closure: { emoji: '🚫', color: '#9c27b0' }
        };

        const config = iconConfig[dataType] || { emoji: '📍', color: '#2196f3' };

        const svg = `
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="${config.color}" stroke="white" stroke-width="2" opacity="0.9"/>
                <text x="12" y="16" text-anchor="middle" font-size="12" fill="white">${config.emoji}</text>
            </svg>
        `;
        
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    // Get display type specific information
    function getDisplayTypeInfo(displayType) {
        const displayTypes = {
            'ROADWORKS': {
                name: 'Baustelle',
                icon: '🚧',
                description: 'Bauarbeiten im Gange',
                color: '#fff3cd'
            },
            'WEBCAM': {
                name: 'Webcam',
                icon: '📹',
                description: 'Verkehrskamera verfügbar',
                color: '#e8f4fd'
            },
            'PARKING': {
                name: 'Rastplatz',
                icon: '🅿️',
                description: 'Parkplatz/Rastanlage',
                color: '#d4edda'
            },
            'WARNING': {
                name: 'Verkehrsmeldung',
                icon: '⚠️',
                description: 'Aktuelle Verkehrswarnung',
                color: '#fff3cd'
            },
            'WEIGHT_LIMIT_35': {
                name: 'Gewichtsbeschränkung',
                icon: '⚖️',
                description: 'Sperrung für Fahrzeuge über 3,5t',
                color: '#f8d7da'
            },
            'CLOSURE': {
                name: 'Sperrung',
                icon: '🚫',
                description: 'Vollsperrung der Fahrbahn',
                color: '#f8d7da'
            },
            'CLOSURE_ENTRY_EXIT': {
                name: 'Anschlussstellen-Sperrung',
                icon: '🚫',
                description: 'Ein-/Ausfahrt gesperrt',
                color: '#f8d7da'
            },
            'STRONG_ELECTRIC_CHARGING_STATION': {
                name: 'Schnellladestation',
                icon: '⚡',
                description: 'Elektrische Schnellladestation',
                color: '#d1ecf1'
            }
        };

        return displayTypes[displayType] || {};
    }

    // Add a road section line based on extent data with length labels
    function addRoadSection(item) {
        if (!item.extent || !vectorLayer) {
            return;
        }

        try {
            // Parse extent: "lon1,lat1,lon2,lat2"
            const extentParts = item.extent.split(',').map(parseFloat);
            if (extentParts.length !== 4) {
                console.log('Invalid extent format for item:', item.identifier);
                return;
            }

            const [lon1, lat1, lon2, lat2] = extentParts;

            // Create line geometry from extent corners
            const points = [
                new OpenLayers.Geometry.Point(lon1, lat1).transform(
                    new OpenLayers.Projection("EPSG:4326"), 
                    new OpenLayers.Projection("EPSG:3857")
                ),
                new OpenLayers.Geometry.Point(lon2, lat2).transform(
                    new OpenLayers.Projection("EPSG:4326"), 
                    new OpenLayers.Projection("EPSG:3857")
                )
            ];

            const lineGeometry = new OpenLayers.Geometry.LineString(points);

            // Calculate section length for display
            const sectionLength = calculateSectionLength(item);
            const lengthText = formatSectionLength(sectionLength);

            // Create style based on event type
            const style = getRoadSectionStyle(item.dataType);
            
            const lineFeature = new OpenLayers.Feature.Vector(lineGeometry, {
                eventId: item.identifier,
                eventType: item.dataType,
                title: item.title,
                autobahn: item.autobahn,
                sectionLength: lengthText
            }, style);

            // Store item data for events
            lineFeature.eventData = item;

            vectorLayer.addFeatures([lineFeature]);
            trafficFeatures.push({feature: lineFeature, data: item});

            // Add length label as separate feature if length is available
            if (sectionLength > 0) {
                addSectionLengthLabel(lineGeometry, lengthText, item.dataType, item.identifier);
            }

            console.log('Added road section for:', item.identifier, 'extent:', item.extent, 'length:', lengthText);
        } catch (error) {
            console.error('Error adding road section for item:', item.identifier, error);
        }
    }

    // Add length label on the road section using OpenLayers 2 compatible method
    function addSectionLengthLabel(lineGeometry, lengthText, eventType, identifier) {
        try {
            // Calculate midpoint of the line
            const bounds = lineGeometry.getBounds();
            const centerPoint = bounds.getCenterLonLat();

            // Create point geometry for label
            const labelPoint = new OpenLayers.Geometry.Point(centerPoint.lon, centerPoint.lat);

            // Style for the length label - simplified for OpenLayers 2
            const labelStyle = new OpenLayers.Style({
                label: lengthText,
                fontColor: "#ffffff",
                fontSize: "11px",
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                labelAlign: "cm",
                labelXOffset: 0,
                labelYOffset: 0,
                labelOutlineColor: "#000000",
                labelOutlineWidth: 2,
                pointRadius: 8,
                fillColor: getEventTypeColor(eventType),
                fillOpacity: 0.9,
                strokeColor: "#ffffff",
                strokeWidth: 1,
                strokeOpacity: 1
            });

            const labelFeature = new OpenLayers.Feature.Vector(labelPoint, {
                eventId: identifier + '_label',
                isLabel: true,
                lengthText: lengthText
            }, labelStyle);

            vectorLayer.addFeatures([labelFeature]);
            trafficFeatures.push({feature: labelFeature, data: {identifier: identifier + '_label', isLabel: true}});

            console.log('Added length label:', lengthText, 'for event:', identifier);

        } catch (error) {
            console.error('Error adding section label:', error);
        }
    }

    // Get event type color for labels
    function getEventTypeColor(eventType) {
        const colors = {
            roadworks: "#ff9800",
            warning: "#f44336", 
            closure: "#9c27b0"
        };
        return colors[eventType] || "#2196f3";
    }

    // Get style for road section based on event type
    function getRoadSectionStyle(dataType) {
        const styleConfig = {
            roadworks: {
                strokeColor: "#ff9800",
                strokeWidth: 6,
                strokeOpacity: 0.8,
                strokeDasharray: "15,10"
            },
            warning: {
                strokeColor: "#f44336", 
                strokeWidth: 5,
                strokeOpacity: 0.7,
                strokeDasharray: "10,5"
            },
            closure: {
                strokeColor: "#9c27b0",
                strokeWidth: 7,
                strokeOpacity: 0.9,
                strokeDasharray: "20,5"
            }
        };

        const config = styleConfig[dataType] || {
            strokeColor: "#2196f3",
            strokeWidth: 4,
            strokeOpacity: 0.6,
            strokeDasharray: "8,8"
        };

        return config; // Return plain style object
    }

    // Clear all vector features (road sections)
    function clearFeatures() {
        if (vectorLayer) {
            vectorLayer.removeAllFeatures();
        }
        trafficFeatures = [];
    }

    // Clear all markers
    function clearMarkers() {
        if (overlayLayer) {
            overlayLayer.clearMarkers();
        }
        trafficMarkers = [];
    }

    // Get selected data sources
    function getSelectedSources() {
        const sources = [];
        document.querySelectorAll('.vz-source:checked').forEach(checkbox => {
            sources.push(checkbox.dataset.source);
        });
        return sources;
    }

    // Update status display
    function updateStatus(message) {
        const statusDisplay = document.getElementById('statusDisplay');
        if (statusDisplay) {
            const timestamp = new Date().toLocaleTimeString('de-DE');
            statusDisplay.innerHTML = `[${timestamp}] ${message}`;
        }
        console.log(`${SCRIPT_NAME}: ${message}`);
    }

    // Update statistics display
    function updateStatistics() {
        const statisticsDisplay = document.getElementById('statisticsDisplay');
        if (statisticsDisplay) {
            const lastUpdate = lastUpdateTime ? lastUpdateTime.toLocaleString('de-DE') : 'Never';
            const totalEvents = trafficMarkers.length;
            const activeRequests = currentRequests.length;
            
            statisticsDisplay.innerHTML = `
                <strong>Statistics:</strong><br>
                Last Update: ${lastUpdate}<br>
                Total Events: ${totalEvents}<br>
                Active Requests: ${activeRequests}
            `;
        }
    }

    // Main initialization logic
    function bootstrap() {
        if (W?.userscripts?.state.isReady) {
            initializeScript();
        } else if (W?.userscripts?.state.isInitialized) {
            document.addEventListener("wme-ready", initializeScript, { once: true });
        } else {
            document.addEventListener("wme-initialized", function() {
                if (W?.userscripts?.state.isReady) {
                    initializeScript();
                } else {
                    document.addEventListener("wme-ready", initializeScript, { once: true });
                }
            }, { once: true });
        }
    }

    // Start the script
    bootstrap();

    // Cleanup function
    window.addEventListener('beforeunload', function() {
        try {
            if (updateInterval) {
                clearInterval(updateInterval);
            }
            currentRequests.forEach(request => {
                if (request.abort) request.abort();
            });
            if (overlayLayer && W.map) {
                W.map.removeLayer(overlayLayer);
            }
            if (vectorLayer && W.map) {
                W.map.removeLayer(vectorLayer);
            }
            hideTooltip(); // Clean up any tooltips
            W.userscripts.removeSidebarTab(SCRIPT_ID);
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    });

})();