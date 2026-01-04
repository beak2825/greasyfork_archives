// ==UserScript==
// @name         WME Segment Completer
// @namespace    http://tampermonkey.net/
// @version      2.7.5
// @description  Highlights completed WME segments on a separate map layer with a toggle. Repopulates layer on map change.
// @author       Stephen Wilmot-Doxey (iDroidGuy)
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @require      https://greasyfork.org/scripts/443221-wazewrap/code/WazeWrap.js?version=1235688 // Included for timing, not switcher add
// @downloadURL https://update.greasyfork.org/scripts/534850/WME%20Segment%20Completer.user.js
// @updateURL https://update.greasyfork.org/scripts/534850/WME%20Segment%20Completer.meta.js
// ==/UserScript==

/* globals $, W, WazeWrap, OpenLayers */
/* eslint-disable no-undef, camelcase, prefer-const */

(function() {
    'use strict';

    // --- Configuration ---
    const STORAGE_PREFIX = 'WMEComplete_';
    const COMPLETED_SEGMENTS_KEY = STORAGE_PREFIX + 'completedSegments';
    const COMPLETED_COLOR_KEY = STORAGE_PREFIX + 'completedColor';
    const LAYER_VISIBLE_KEY = STORAGE_PREFIX + 'layerVisible'; // Persist visibility state
    const DEFAULT_COMPLETED_COLOR = '#00FF00'; // Default highlight: bright green
    const LAYER_NAME = 'Completed Segments'; // Layer name in panel
    const UNIQUE_LAYER_NAME = '__SegmentCompleterLayer'; // Internal ID for WME
    const SELECTION_DELAY = 100; // ms delay before processing selection change
    const REPOPULATE_DELAY = 500; // ms delay before repopulating layer after map move/zoom

    // --- Globals ---
    let completedSegments = {}; // { segmentId: true }
    let completedColor = DEFAULT_COMPLETED_COLOR;
    let completionLayer = null; // Our custom OpenLayers Vector layer
    let currentApplicableSegments = []; // Currently selected segment object(s) for the panel checkbox
    let isEntireStreetSelected = false; // Flag if selection is a whole street
    let selectionTimeout = null; // Debounce timer for selection changes
    let repopulateTimeout = null; // Debounce timer for layer repopulation
    let featureMap = {}; // Map WME segment ID -> OL feature ID on our layer
    let isLayerInitiallyVisible = true; // Default visibility

    // --- Styles ---
    // Basic CSS for the settings panel and toggle button
    GM_addStyle(`
        #wme-complete-settings-panel {
            position: fixed; top: 100px; right: 20px; background-color: white;
            border: 1px solid #ccc; border-radius: 8px; padding: 15px;
            z-index: 1001; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            font-family: sans-serif; display: none; cursor: move; min-width: 220px;
        }
        #wme-complete-settings-panel h3 {
            margin-top: 0; margin-bottom: 10px; font-size: 16px;
            border-bottom: 1px solid #eee; padding-bottom: 5px; cursor: move;
        }
        #wme-complete-settings-panel label { display: block; margin-bottom: 5px; font-size: 14px; }
        #wme-complete-color-input, #wme-complete-hex-input {
            padding: 5px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;
        }
        #wme-complete-color-input { width: 50px; vertical-align: middle; }
        #wme-complete-hex-input { width: 80px; margin-left: 5px; vertical-align: middle; }
        #wme-complete-save-button {
            padding: 5px 10px; background-color: #007bff; color: white; border: none;
            border-radius: 4px; cursor: pointer; font-size: 14px;
            vertical-align: middle; margin-left: 10px;
        }
        #wme-complete-save-button:hover { background-color: #0056b3; }
        #wme-complete-toggle-button {
            position: fixed; top: 65px; right: 20px; z-index: 1000; padding: 8px 12px;
            background-color: #f8f9fa; border: 1px solid #ccc; border-radius: 4px;
            cursor: pointer; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        #wme-complete-toggle-button:hover { background-color: #e2e6ea; }
        #wme-complete-checkbox-area, #wme-complete-visibility-area {
            margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;
        }
        #wme-complete-checkbox-area label, #wme-complete-visibility-area label {
             display: flex; align-items: center; cursor: pointer; font-weight: bold; font-size: 14px;
        }
        #wme-complete-checkbox-area input[type="checkbox"], #wme-complete-visibility-area input[type="checkbox"] {
             margin-right: 8px; width: 16px; height: 16px; vertical-align: middle;
        }
        #wme-complete-no-segment-msg { font-style: italic; color: #888; font-size: 13px; }
    `);

    // --- Initialization ---
    function initialize() {
        console.log("WME Segment Completer: Initializing (v2.7.5 - Revert Viewport Opt)...");
        loadSettings();
        createSettingsPanel();
        createToggleButton();
        waitForWME();
        console.log("WME Segment Completer: Initialized.");
    }

    function loadSettings() {
        // Load data from Tampermonkey storage
        const savedSegments = GM_getValue(COMPLETED_SEGMENTS_KEY, '{}');
        try {
            completedSegments = JSON.parse(savedSegments);
            if (typeof completedSegments !== 'object' || completedSegments === null) { completedSegments = {}; }
        } catch (e) {
            console.error("WME Segment Completer: Error parsing saved segments.", e);
            completedSegments = {};
        }
        completedColor = GM_getValue(COMPLETED_COLOR_KEY, DEFAULT_COMPLETED_COLOR);
        isLayerInitiallyVisible = GM_getValue(LAYER_VISIBLE_KEY, true); // Default to visible
        console.log(`WME Segment Completer: Loaded ${Object.keys(completedSegments).length} completed segments, color ${completedColor}, visibility ${isLayerInitiallyVisible}`);
    }

    function saveSettings(saveVisibility = true) {
        // Save data to Tampermonkey storage
        try {
            GM_setValue(COMPLETED_SEGMENTS_KEY, JSON.stringify(completedSegments));
            GM_setValue(COMPLETED_COLOR_KEY, completedColor);
            // Only save visibility if requested (e.g., not during cleanup in populate)
            if (saveVisibility && completionLayer) {
                GM_setValue(LAYER_VISIBLE_KEY, completionLayer.getVisibility());
            }
        } catch (e) {
            console.error("WME Segment Completer: Error saving settings.", e);
        }
    }

    // --- UI Creation ---
    function createSettingsPanel() {
        // Build the floating panel HTML
        const panel = document.createElement('div');
        panel.id = 'wme-complete-settings-panel';
        panel.innerHTML = `
            <h3>Segment Completer</h3>
            <div>
                <label for="wme-complete-color-input" style="display: inline-block; margin-bottom: 10px;">Highlight Color:</label><br>
                <input type="color" id="wme-complete-color-input" value="${completedColor}">
                <input type="text" id="wme-complete-hex-input" value="${completedColor}" size="7" maxlength="7" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$">
                <button id="wme-complete-save-button">Save</button>
            </div>
            <div id="wme-complete-checkbox-area">
                <span id="wme-complete-no-segment-msg">Select a segment or entire street</span>
            </div>
            <div id="wme-complete-visibility-area">
                </div>
        `;
        document.body.appendChild(panel);

        // Make panel draggable via its header
        try { $(panel).draggable({ handle: "h3" }); }
        catch(e) { console.error("WME Segment Completer: Failed to make panel draggable.", e); }

        // Sync color picker and text input
        const colorInput = panel.querySelector('#wme-complete-color-input');
        const hexInput = panel.querySelector('#wme-complete-hex-input');
        colorInput.addEventListener('input', (e) => { hexInput.value = e.target.value; });
        hexInput.addEventListener('input', (e) => {
             if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(e.target.value)) { colorInput.value = e.target.value; }
        });

        // Handle color save button click
        panel.querySelector('#wme-complete-save-button').addEventListener('click', () => {
            const newColor = hexInput.value;
             if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor)) {
                completedColor = newColor;
                saveSettings(); // Save new color
                updateCompletionLayerStyles(); // Apply new color to the layer
                alert('Color saved!');
             } else { alert('Invalid Hex color format.'); }
        });

        updateCheckboxArea(); // Set initial state for the "Mark as Complete" checkbox area
    }

    function addVisibilityToggle() {
        // Adds the "Show Highlights Layer" checkbox to the settings panel
        const visibilityArea = document.getElementById('wme-complete-visibility-area');
        if (!visibilityArea || !completionLayer) {
            console.error("WME Segment Completer: Cannot add visibility toggle - area or layer missing.");
            return;
        }

        visibilityArea.innerHTML = ''; // Clear potential placeholder

        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'wme-complete-visibility-checkbox';
        checkbox.checked = completionLayer.getVisibility(); // Sync with current layer state

        // Toggle layer visibility on change and save the state
        checkbox.addEventListener('change', () => {
            completionLayer.setVisibility(checkbox.checked);
            // If turning layer on, repopulate immediately to show current view
            if (checkbox.checked) {
                populateCompletionLayer();
            }
            saveSettings(); // Save the new visibility state
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' Show Highlights Layer'));
        visibilityArea.appendChild(label);
        console.log("WME Segment Completer: Added visibility toggle to settings panel.");
    }


    function createToggleButton() {
        // Button to show/hide the settings panel
         const button = document.createElement('button');
        button.id = 'wme-complete-toggle-button';
        button.textContent = 'Completer Settings';
        button.addEventListener('click', () => {
            const panel = document.getElementById('wme-complete-settings-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
        document.body.appendChild(button);
    }

    // --- WME Integration ---

    function waitForWME() {
        // Wait until WME essentials and OpenLayers are ready
         const interval = setInterval(() => {
            // Check for WME core objects and OpenLayers library
             const wazeWrapReady = (typeof WazeWrap !== 'undefined' && WazeWrap.Ready);
             if (typeof W !== 'undefined' && W && W.map && W.model && W.selectionManager && typeof OpenLayers !== 'undefined' && (wazeWrapReady || typeof WazeWrap === 'undefined') ) {
                clearInterval(interval);
                console.log("WME Segment Completer: WME Ready. Setting up...");
                createCompletionLayer();
                setupEventHandlers(); // Setup selection AND map change handlers
                populateCompletionLayer(); // Initial population
                addVisibilityToggle(); // Add toggle after layer exists
                setTimeout(handleSelectionChange, SELECTION_DELAY); // Check initial selection
            }
        }, 500);
    }

    function createCompletionLayer() {
        // Create the custom OpenLayers Vector layer for highlights
        if (!OpenLayers || !W || !W.map) {
             console.error("WME Segment Completer: OpenLayers or W.map not available to create layer.");
             return;
        }
        completionLayer = new OpenLayers.Layer.Vector(LAYER_NAME, {
            displayInLayerSwitcher: true, // Let WME try to handle it
            visibility: isLayerInitiallyVisible, // Use loaded visibility state
            uniqueName: UNIQUE_LAYER_NAME,
            styleMap: new OpenLayers.StyleMap({ 'default': getCompletionStyle() })
        });
        W.map.addLayer(completionLayer);
        console.log(`WME Segment Completer: Created and added '${LAYER_NAME}' layer. Initial visibility: ${isLayerInitiallyVisible}`);
    }

    function setupEventHandlers() {
        // Listen for selection changes in WME
        if (W && W.selectionManager && W.selectionManager.events && typeof W.selectionManager.events.register === 'function') {
            W.selectionManager.events.register("selectionchanged", null, delayedHandleSelectionChange);
            console.log("WME Segment Completer: Registered selection change handler.");
        } else {
            console.error("WME Segment Completer: Could not register selection change handler.");
        }

        // Listen for map movement and zoom changes to trigger repopulation
        if (W && W.map && W.map.events && typeof W.map.events.register === 'function') {
            W.map.events.register("moveend", null, delayedRepopulateLayer);
            W.map.events.register("zoomend", null, delayedRepopulateLayer);
            console.log("WME Segment Completer: Registered map move/zoom handlers.");
        } else {
             console.error("WME Segment Completer: Could not register map event handlers.");
        }
    }

    // Debounce selection changes
    function delayedHandleSelectionChange() {
        if (selectionTimeout) { clearTimeout(selectionTimeout); }
        selectionTimeout = setTimeout(() => { handleSelectionChange(); }, SELECTION_DELAY);
    }

    // Debounce layer repopulation on map changes
    function delayedRepopulateLayer() {
         if (repopulateTimeout) { clearTimeout(repopulateTimeout); }
         repopulateTimeout = setTimeout(() => {
             // Don't repopulate if layer is hidden
             if (completionLayer && completionLayer.getVisibility()) {
                 populateCompletionLayer();
             }
         }, REPOPULATE_DELAY);
    }


    // Process the current selection to update the panel checkbox state
    function handleSelectionChange() {
        if (!W || !W.selectionManager || !W.model || !W.model.segments) { return; }

        const selectedFeatures = W.selectionManager.getSelectedWMEFeatures();
        // Filter only for actual segment features returned by the new method
        const selectedSegments = selectedFeatures.filter(f => f && f.featureType === 'segment' && f.id != null);

        currentApplicableSegments = []; // Reset list for the panel checkbox
        isEntireStreetSelected = false;

        if (selectedSegments.length === 1) {
            // Single segment selected
            currentApplicableSegments = selectedSegments;
            isEntireStreetSelected = false;
        } else if (selectedSegments.length > 1) {
            // Multiple segments - check if they belong to the same street
            const firstSegmentId = selectedSegments[0].id;
            const firstSegmentModel = W.model.segments.get(firstSegmentId); // Get WME model object

            if (firstSegmentModel && firstSegmentModel.attributes) {
                const firstSegmentStreetId = firstSegmentModel.attributes.primaryStreetID;
                // Only proceed if the first segment has a name (street ID)
                if (firstSegmentStreetId != null) {
                    // Check if all other selected segments have the same street ID
                    const allMatch = selectedSegments.every(seg => {
                        const segModel = W.model.segments.get(seg.id);
                        return segModel && segModel.attributes && segModel.attributes.primaryStreetID === firstSegmentStreetId;
                    });
                    if (allMatch) {
                        currentApplicableSegments = selectedSegments;
                        isEntireStreetSelected = true;
                    }
                }
            }
        }
        // Update the "Mark as Complete" checkbox based on the analysis
        updateCheckboxArea();
    }

    function updateCheckboxArea() {
        // Update the "Mark as Complete" checkbox area in the settings panel
        const checkboxArea = document.getElementById('wme-complete-checkbox-area');
        if (!checkboxArea) { return; }
        checkboxArea.innerHTML = ''; // Clear previous content

        if (currentApplicableSegments.length > 0) {
            // Check if all currently selected applicable segments are in our completed list
            const allComplete = currentApplicableSegments.every(seg => {
                return seg && seg.id != null && !!completedSegments[seg.id];
            });

            // Create and add the checkbox
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `wme-complete-checkbox-dynamic`;
            checkbox.checked = allComplete;

            checkbox.addEventListener('change', (event) => {
                handleCheckboxChange(event.target.checked, currentApplicableSegments);
            });

            label.appendChild(checkbox);
            const labelText = isEntireStreetSelected ? ' Mark Street as Complete' : ' Mark Segment as Complete';
            label.appendChild(document.createTextNode(labelText));
            checkboxArea.appendChild(label);
        } else {
            // Show placeholder message if no valid segment/street is selected
            const msgSpan = document.createElement('span');
            msgSpan.id = 'wme-complete-no-segment-msg';
            msgSpan.textContent = 'Select a segment or entire street';
            checkboxArea.appendChild(msgSpan);
        }
    }


    function handleCheckboxChange(isChecked, segmentFeatures) {
        // Add/remove segments from the completed list and update the layer
        if (!completionLayer) {
            console.error("WME Segment Completer: Completion layer not available.");
            return;
        }
        if (!segmentFeatures || segmentFeatures.length === 0) { return; }

        console.log(`WME Segment Completer: Setting ${segmentFeatures.length} segments to complete=${isChecked}`);

        segmentFeatures.forEach(segmentFeature => {
            if (segmentFeature && segmentFeature.id != null) {
                const segmentId = segmentFeature.id;
                if (isChecked) {
                    // Add segment if it's not already marked
                    if (!completedSegments[segmentId]) {
                        completedSegments[segmentId] = true;
                        // Add feature to the layer immediately
                        addFeatureToCompletionLayer(segmentId);
                    }
                } else {
                    // Remove segment if it is currently marked
                    if (completedSegments[segmentId]) {
                        delete completedSegments[segmentId];
                        // Always try to remove feature
                        removeFeatureFromCompletionLayer(segmentId);
                    }
                }
            }
        });
        saveSettings(); // Save completion status changes
    }

    // --- Completion Layer Management ---

    function addFeatureToCompletionLayer(segmentId) {
        // Adds a visual highlight feature to our custom layer
        // *** Reverted: No bounds check here ***
        if (!completionLayer || !W || !W.model || !W.model.segments) return;

        const segmentModel = W.model.segments.get(segmentId);
        const geometry = segmentModel?.getOLGeometry ? segmentModel.getOLGeometry()?.clone() : segmentModel?.geometry?.clone();

        if (!geometry) {
            console.warn(`WME Segment Completer: Could not find segment model or geometry for ID ${segmentId} when adding feature.`);
            return;
        }

        // Create the OL feature, storing the WME ID for reference
        const feature = new OpenLayers.Feature.Vector(geometry, { wmeSegmentId: segmentId });

        completionLayer.addFeatures([feature]);
        // Map the WME ID to the new OL feature ID (assigned on add)
        if(feature.id) { featureMap[segmentId] = feature.id; }
        else { console.warn(`WME Segment Completer: Feature added for segment ${segmentId} but missing OL feature ID.`); }
    }

    function removeFeatureFromCompletionLayer(segmentId) {
        // Removes the highlight feature from our custom layer
        if (!completionLayer) return;

        const featureId = featureMap[segmentId]; // Look up OL feature ID from WME ID
        if (featureId) {
            const feature = completionLayer.getFeatureById(featureId);
            if (feature) { completionLayer.removeFeatures([feature], { silent: true }); } // Remove if found
            delete featureMap[segmentId]; // Clean up map entry
        } else {
             // Fallback if mapping is lost (e.g., after WME refresh/redraw)
             const featuresToRemove = completionLayer.features.filter(f => f.attributes && f.attributes.wmeSegmentId === segmentId);
             if (featuresToRemove.length > 0) {
                 completionLayer.removeFeatures(featuresToRemove, { silent: true });
                 // console.log(`WME Segment Completer: Removed ${featuresToRemove.length} features via attribute search for segment ${segmentId}.`);
             }
        }
    }

    function populateCompletionLayer() {
        // Draw highlights for completed segments currently loaded in W.model
        // *** Reverted: No bounds check here ***
        if (!completionLayer || !W || !W.model || !W.model.segments) {
            return;
        }
        console.log("WME Segment Completer: Populating completion layer...");
        completionLayer.removeAllFeatures({ silent: true }); // Clear layer first
        featureMap = {}; // Reset mapping

        let segmentsNotFound = 0;
        const segmentsToAdd = [];

        for (const segmentIdStr in completedSegments) {
            if (completedSegments.hasOwnProperty(segmentIdStr)) {
                const segmentId = parseInt(segmentIdStr, 10);
                const segmentModel = W.model.segments.get(segmentId);
                const geometry = segmentModel?.getOLGeometry ? segmentModel.getOLGeometry()?.clone() : segmentModel?.geometry?.clone();

                if (geometry) {
                    // Create feature if segment model and geometry exist in current W.model
                    const feature = new OpenLayers.Feature.Vector(geometry, { wmeSegmentId: segmentId });
                    segmentsToAdd.push(feature);
                } else {
                    // Segment ID is saved, but not found in the current W.model data
                    // This is normal if it's off-screen. DO NOT delete it from completedSegments here.
                    segmentsNotFound++;
                }
            }
        }

        // Add all valid features found in the current W.model at once
        if (segmentsToAdd.length > 0) {
            completionLayer.addFeatures(segmentsToAdd);
            // Create the ID map after features are added and get their OL IDs
            segmentsToAdd.forEach(f => {
                if (f.attributes && f.attributes.wmeSegmentId && f.id) {
                    featureMap[f.attributes.wmeSegmentId] = f.id;
                }
            });
            console.log(`WME Segment Completer: Added ${segmentsToAdd.length} features to completion layer.`);
        }

        if (segmentsNotFound > 0) {
             console.log(`WME Segment Completer: ${segmentsNotFound} completed segments not found in current W.model (likely off-screen).`);
        }

        if (segmentsToAdd.length === 0 && segmentsNotFound === 0) {
             console.log("WME Segment Completer: No completed segments found to populate layer.");
        }
    }

    function updateCompletionLayerStyles() {
        // Update the style definition for the entire layer
        if (!completionLayer || !completionLayer.styleMap) return;

        const newStyle = getCompletionStyle();
        // Update the actual style object used by the layer
        completionLayer.styleMap.styles.default.defaultStyle = newStyle;
        completionLayer.redraw(); // Force redraw to apply changes
        console.log("WME Segment Completer: Updated completion layer style.");
    }


    function getCompletionStyle() {
        // Define the OpenLayers style for the highlight layer
        return {
            strokeColor: completedColor,
            strokeWidth: 8, // Thicker than default segments
            strokeOpacity: 0.6, // Slightly transparent
            strokeLinecap: "round",
            strokeDashstyle: "solid",
        };
    }

    // --- Start the script ---
    // Use DOMContentLoaded listener for reliability
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize);
    }

})();