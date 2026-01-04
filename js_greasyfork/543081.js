// ==UserScript==
// @name         WME Level Highlighter
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2025.07.22
// @description  Level highlighter for Waze Map Editor
// @icon         https://i.ibb.co/ckSvk59/waze-icon.png
// @author       Assistant
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543081/WME%20Level%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/543081/WME%20Level%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("=== WME Level Highlighter LOADING ===");
    
    var SCRIPT_VERSION = "2025.07.22";
    var highlightedSegmentIds = [];
    var foundSegmentsList = [];
    var autoRefreshInterval = null;
    var autoRefreshEnabled = false;
    
    var HIGHLIGHT_ORANGE = "#ff5000";
    var HIGHLIGHT_MAGENTA = "#ff00dd";
    var HIGHLIGHT_OPACITY = 0.7;
    var levelIcon = '🔎';

    // Local storage keys
    var STORAGE_KEYS = {
        selectedLevel: 'wme_level_highlighter_level',
        daysOld: 'wme_level_highlighter_days',
        colorMode: 'wme_level_highlighter_color_mode',
        customColor: 'wme_level_highlighter_custom_color',
        autoRefresh: 'wme_level_highlighter_auto_refresh'
    }

    function toggleAutoRefresh() {
        var autoRefreshCheckbox = getId('_cbAutoRefresh');
        if (!autoRefreshCheckbox) return;

        autoRefreshEnabled = autoRefreshCheckbox.checked;
        saveToLocalStorage(STORAGE_KEYS.autoRefresh, autoRefreshEnabled.toString());

        if (autoRefreshEnabled) {
            console.log("Auto-refresh enabled (5 seconds)");
            autoRefreshInterval = setInterval(function() {
                console.log("Auto-refresh: Running highlighter...");
                runHighlighter();
            }, 5000); // 5 seconds
            
            // Update button text
            var runButton = getId('_btnRunHighlighter');
            if (runButton) {
                runButton.style.background = "#FF9800";
                runButton.textContent = "AUTO REFRESH ON";
            }
        } else {
            console.log("Auto-refresh disabled");
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
                autoRefreshInterval = null;
            }
            
            // Reset button text
            var runButton = getId('_btnRunHighlighter');
            if (runButton) {
                runButton.style.background = "#4CAF50";
                runButton.textContent = "RUN HIGHLIGHTER";
            }
        }
    };

    // Local storage functions
    function saveToLocalStorage(key, value) {
        try {
            localStorage.setItem(key, value);
            console.log("Saved:", key, "=", value);
        } catch (e) {
            console.log("Could not save to localStorage:", e);
        }
    }

    function loadFromLocalStorage(key, defaultValue) {
        try {
            var value = localStorage.getItem(key);
            console.log("Loaded:", key, "=", value || defaultValue);
            return value !== null ? value : defaultValue;
        } catch (e) {
            console.log("Could not load from localStorage:", e);
            return defaultValue;
        }
    }

    function getId(node) {
        return document.getElementById(node);
    }

    function getColorMode() {
        var orange = getId('_rbHilightOrange');
        var magenta = getId('_rbHilightMagenta');
        var custom = getId('_rbHilightCustom');
        
        if (orange && orange.checked) return 'orange';
        if (magenta && magenta.checked) return 'magenta';
        if (custom && custom.checked) return 'custom';
        return 'orange';
    }

    function getHighlightColor(mode, customColor) {
        if (mode === 'orange') return HIGHLIGHT_ORANGE;
        if (mode === 'magenta') return HIGHLIGHT_MAGENTA;
        if (mode === 'custom') return customColor;
        return HIGHLIGHT_ORANGE;
    }

    function updateCustomColorVisibility() {
        var customRadio = getId('_rbHilightCustom');
        var colorPicker = getId('_customColorPicker');
        if (customRadio && colorPicker) {
            colorPicker.style.display = customRadio.checked ? 'inline-block' : 'none';
        }
    }

    function resetAllHighlights() {
        console.log("=== RESETTING ALL HIGHLIGHTS ===");
        
        if (!window.W || !window.W.model || !window.W.model.segments) return;

        var resetCount = 0;
        for (var seg in W.model.segments.objects) {
            var segment = W.model.segments.getObjectById(seg);
            if (!segment || !segment.attributes) continue;
            
            try {
                var line = W.userscripts.getFeatureElementByDataModel(segment);
                if (line) {
                    line.removeAttribute("stroke");
                    line.removeAttribute("stroke-opacity");
                    line.removeAttribute("stroke-width");
                    line.removeAttribute("stroke-dasharray");
                    resetCount++;
                }
            } catch (e) {}
        }
        
        console.log("Reset highlights on", resetCount, "segments");
        highlightedSegmentIds = [];
        foundSegmentsList = [];
        updateEditorsDisplay();
    }

    function selectSegmentById(segmentId) {
        if (!window.W || !window.W.model || !window.W.model.segments || !window.W.selectionManager) return;

        try {
            var segment = W.model.segments.getObjectById(segmentId);
            if (segment) {
                W.selectionManager.unselectAll();
                W.selectionManager.setSelectedModels([segment]);
                
                // Try to zoom to segment using modern APIs
                setTimeout(function() {
                    try {
                        // Method 1: Try WME's built-in zoom to selection (modern API)
                        if (W.selectionManager.getSelectedWMEFeatures && W.selectionManager.getSelectedWMEFeatures().length > 0) {
                            if (W.map && W.map.zoomToSelection) {
                                W.map.zoomToSelection();
                                return;
                            }
                        }
                        
                        // Method 2: Try using modern geometry API
                        if (segment.getOLGeometry) {
                            var olGeometry = segment.getOLGeometry();
                            if (olGeometry && olGeometry.getExtent) {
                                var extent = olGeometry.getExtent();
                                var olMap = W.map.getOLMap();
                                if (olMap && olMap.getView) {
                                    var view = olMap.getView();
                                    if (view.fit) {
                                        view.fit(extent, {
                                            padding: [100, 100, 100, 100],
                                            maxZoom: 6,
                                            duration: 500
                                        });
                                        return;
                                    }
                                }
                            }
                        }
                        
                        // Method 3: Try using OpenLayers center
                        if (segment.getOLGeometry) {
                            var olGeometry = segment.getOLGeometry();
                            if (olGeometry && olGeometry.getCoordinates) {
                                var coords = olGeometry.getCoordinates();
                                if (coords && coords.length > 0) {
                                    var centerCoord = Array.isArray(coords[0]) ? coords[Math.floor(coords.length/2)] : coords;
                                    if (centerCoord && centerCoord.length >= 2) {
                                        var olMap = W.map.getOLMap();
                                        if (olMap && olMap.getView) {
                                            var view = olMap.getView();
                                            view.setCenter([centerCoord[0], centerCoord[1]]);
                                            view.setZoom(Math.max(view.getZoom(), 5));
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Method 4: Fallback - try legacy geometry (only if modern fails)
                        if (segment.geometry && segment.geometry.getCentroid) {
                            var centroid = segment.geometry.getCentroid();
                            if (centroid && centroid.x && centroid.y && W.map.setCenter) {
                                W.map.setCenter(new OpenLayers.LonLat(centroid.x, centroid.y));
                                if (W.map.getZoom() < 5) {
                                    W.map.zoomTo(5);
                                }
                            }
                        }
                        
                        console.log("Successfully zoomed to segment:", segmentId);
                        
                    } catch (zoomError) {
                        console.log("Zoom failed for segment", segmentId, ":", zoomError);
                    }
                }, 100);
            }
        } catch (error) {
            console.error("Error selecting segment:", error);
        }
    }

    function selectSegmentsByEditor(editorName) {
        if (!window.W || !window.W.model || !window.W.model.segments || !window.W.selectionManager) return;

        try {
            var editorSegments = [];
            for (var i = 0; i < foundSegmentsList.length; i++) {
                if (foundSegmentsList[i].editorName === editorName) {
                    editorSegments.push(foundSegmentsList[i]);
                }
            }
            
            if (editorSegments.length === 0) return;
            
            W.selectionManager.unselectAll();
            
            var segmentsToSelect = [];
            for (var j = 0; j < editorSegments.length; j++) {
                var segment = W.model.segments.getObjectById(editorSegments[j].segmentId);
                if (segment) {
                    segmentsToSelect.push(segment);
                }
            }
            
            if (segmentsToSelect.length > 0) {
                W.selectionManager.setSelectedModels(segmentsToSelect);
            }
            
        } catch (error) {
            console.error("Error selecting segments by editor:", error);
        }
    }

    function updateEditorsDisplay() {
        var editorsElement = getId('_editorsDisplay');
        if (!editorsElement) return;

        while (editorsElement.firstChild) {
            editorsElement.removeChild(editorsElement.firstChild);
        }

        if (foundSegmentsList.length === 0) {
            return;
        }

        var editorGroups = {};
        for (var i = 0; i < foundSegmentsList.length; i++) {
            var segInfo = foundSegmentsList[i];
            if (!editorGroups[segInfo.editorName]) {
                editorGroups[segInfo.editorName] = [];
            }
            editorGroups[segInfo.editorName].push(segInfo);
        }

        var containerDiv = document.createElement('div');
        containerDiv.style.maxHeight = '200px';
        containerDiv.style.overflowY = 'auto';
        containerDiv.style.border = '1px solid #ddd';
        containerDiv.style.padding = '10px';
        containerDiv.style.background = '#f9f9f9';
        containerDiv.style.borderRadius = '4px';
        containerDiv.style.marginBottom = '15px';
        
        var editorNames = Object.keys(editorGroups);
        for (var k = 0; k < editorNames.length; k++) {
            var editorName = editorNames[k];
            var segments = editorGroups[editorName];
            
            var editorDiv = document.createElement('div');
            editorDiv.style.marginBottom = '15px';
            
            var editorNameSpan = document.createElement('span');
            editorNameSpan.style.color = '#2196F3';
            editorNameSpan.style.cursor = 'pointer';
            editorNameSpan.style.textDecoration = 'underline';
            editorNameSpan.style.fontWeight = 'bold';
            editorNameSpan.style.fontSize = '14px';
            editorNameSpan.textContent = editorName;
            editorNameSpan.title = 'Click to select all segments by ' + editorName;
            
            (function(name) {
                editorNameSpan.addEventListener('click', function() {
                    selectSegmentsByEditor(name);
                });
            })(editorName);
            
            var segmentCountSpan = document.createElement('span');
            segmentCountSpan.style.color = '#666';
            segmentCountSpan.style.marginLeft = '8px';
            segmentCountSpan.textContent = '(' + segments.length + ' segments)';
            
            editorDiv.appendChild(editorNameSpan);
            editorDiv.appendChild(segmentCountSpan);
            editorDiv.appendChild(document.createElement('br'));
            
            var maxShow = 4;
            for (var m = 0; m < Math.min(maxShow, segments.length); m++) {
                var seg = segments[m];
                var editDate = new Date(seg.editDate);
                var daysAgo = Math.floor((new Date() - editDate) / 86400000);
                
                var segmentDiv = document.createElement('div');
                segmentDiv.style.color = '#888';
                segmentDiv.style.marginLeft = '15px';
                segmentDiv.style.marginTop = '3px';
                segmentDiv.style.fontSize = '12px';
                
                var idLabel = document.createTextNode('ID: ');
                segmentDiv.appendChild(idLabel);
                
                var segmentIdSpan = document.createElement('span');
                segmentIdSpan.style.color = '#2196F3';
                segmentIdSpan.style.cursor = 'pointer';
                segmentIdSpan.style.textDecoration = 'underline';
                segmentIdSpan.style.fontWeight = 'bold';
                segmentIdSpan.textContent = seg.segmentId;
                segmentIdSpan.title = 'Click to select segment ' + seg.segmentId;
                
                (function(segId) {
                    segmentIdSpan.addEventListener('click', function() {
                        selectSegmentById(segId);
                    });
                })(seg.segmentId);
                
                var daysLabel = document.createTextNode(' - ' + daysAgo + ' days ago');
                
                segmentDiv.appendChild(segmentIdSpan);
                segmentDiv.appendChild(daysLabel);
                editorDiv.appendChild(segmentDiv);
            }
            
            if (segments.length > maxShow) {
                var moreDiv = document.createElement('div');
                moreDiv.style.color = '#888';
                moreDiv.style.marginLeft = '15px';
                moreDiv.style.fontStyle = 'italic';
                moreDiv.style.fontSize = '12px';
                moreDiv.style.marginTop = '3px';
                moreDiv.textContent = '... and ' + (segments.length - maxShow) + ' more segments';
                editorDiv.appendChild(moreDiv);
            }
            
            containerDiv.appendChild(editorDiv);
        }
        
        editorsElement.appendChild(containerDiv);
    }

    function selectHighlightedSegments() {
        if (!window.W || !window.W.model || !window.W.model.segments || !window.W.selectionManager) return;

        if (highlightedSegmentIds.length === 0) {
            return;
        }

        try {
            W.selectionManager.unselectAll();
            
            var segmentsToSelect = [];
            for (var i = 0; i < highlightedSegmentIds.length; i++) {
                var segment = W.model.segments.getObjectById(highlightedSegmentIds[i]);
                if (segment) {
                    segmentsToSelect.push(segment);
                }
            }
            
            if (segmentsToSelect.length > 0) {
                W.selectionManager.setSelectedModels(segmentsToSelect);
            }
            
        } catch (error) {
            console.error("Error selecting segments:", error);
        }
    }

    function runHighlighter() {
        console.log("=== RUNNING HIGHLIGHTER ===");
        
        if (!window.W || !window.W.model || !window.W.model.segments) {
            console.log("W.model not ready, retrying...");
            setTimeout(runHighlighter, 2000);
            return;
        }

        resetAllHighlights();

        var selectedLevel = getId('_selectEditorLevel');
        var daysInput = getId('_txtDaysOld');
        var customColorPicker = getId('_customColorPicker');
        var opacitySlider = getId('_opacitySlider');

        var selectedDisplayLevel = selectedLevel ? parseInt(selectedLevel.value) || 1 : 1;
        var selectedInternalLevel = selectedDisplayLevel - 1;
        var daysOld = daysInput ? parseInt(daysInput.value) || 30 : 30;
        var colorMode = getColorMode();
        var customColor = customColorPicker ? customColorPicker.value : HIGHLIGHT_ORANGE;
        var opacity = opacitySlider ? parseFloat(opacitySlider.value) || 0.7 : 0.7;

        // Save current settings to localStorage
        if (selectedLevel) {
            saveToLocalStorage(STORAGE_KEYS.selectedLevel, selectedLevel.value);
        }
        if (daysInput) {
            saveToLocalStorage(STORAGE_KEYS.daysOld, daysInput.value);
        }
        saveToLocalStorage(STORAGE_KEYS.colorMode, colorMode);
        if (customColorPicker) {
            saveToLocalStorage(STORAGE_KEYS.customColor, customColorPicker.value);
        }
        if (opacitySlider) {
            saveToLocalStorage(STORAGE_KEYS.opacity, opacitySlider.value);
        }
        
        var autoRefreshCheckbox = getId('_cbAutoRefresh');
        if (autoRefreshCheckbox) {
            saveToLocalStorage(STORAGE_KEYS.autoRefresh, autoRefreshCheckbox.checked.toString());
        }

        console.log("Level:", selectedDisplayLevel, "Days:", daysOld);

        var totalSegments = 0;
        var matchingSegments = 0;
        var highlightedSegments = 0;
        var today = new Date();

        for (var seg in W.model.segments.objects) {
            var segment = W.model.segments.getObjectById(seg);
            if (!segment || !segment.attributes) continue;
            
            totalSegments++;
            var attributes = segment.attributes;
            var updatedBy = attributes.updatedBy || attributes.createdBy;
            
            if (!updatedBy) continue;
            
            var editDate = attributes.updatedOn || attributes.createdOn;
            var editDays = editDate ? (today.getTime() - editDate) / 86400000 : 9999;
            
            if (editDays > daysOld) continue;
            
            try {
                var user = W.model.users.getObjectById(parseInt(updatedBy));
                if (!user || !user.attributes || !user.attributes.userName || user.attributes.userName === 'Inactive User') continue;
                
                var userInternalLevel = user.attributes.rank;
                if (userInternalLevel !== selectedInternalLevel) continue;
                
                matchingSegments++;
                
                var segmentInfo = {
                    segmentId: seg,
                    editorName: user.attributes.userName,
                    editorLevel: userInternalLevel + 1,
                    editDate: editDate
                };
                foundSegmentsList.push(segmentInfo);
                
                try {
                    var line = W.userscripts.getFeatureElementByDataModel(segment);
                    if (line) {
                        var highlightColor = getHighlightColor(colorMode, customColor);
                        line.setAttribute("stroke", highlightColor);
                        line.setAttribute("stroke-opacity", HIGHLIGHT_OPACITY);
                        line.setAttribute("stroke-width", 8);
                        line.setAttribute("stroke-dasharray", "none");
                        highlightedSegments++;
                        highlightedSegmentIds.push(seg);
                    }
                } catch (e) {}
                
            } catch (userError) {
                console.warn("Error accessing user", updatedBy, userError);
            }
        }

        var counterElement = getId('_highlightCounter');
        if (counterElement) {
            counterElement.innerHTML = 
                '<strong>Found ' + matchingSegments + ' segments by Level ' + selectedDisplayLevel + ' editors</strong><br>' +
                '<strong>Highlighted ' + highlightedSegments + ' segments</strong><br>' +
                '<span style="color: #888;">(' + totalSegments + ' total segments checked)</span>';
        }

        updateEditorsDisplay();

        console.log("Found:", matchingSegments, "Highlighted:", highlightedSegments);
    }

    function createUI() {
        console.log("=== CREATING UI ===");
        
        var userTabs = getId('user-info');
        if (!userTabs) {
            setTimeout(createUI, 1000);
            return;
        }
        
        var navTabs = userTabs.querySelector('.nav-tabs');
        var tabContentContainer = userTabs.querySelector('.tab-content');
        
        if (!navTabs || !tabContentContainer) {
            setTimeout(createUI, 1000);
            return;
        }
        
        var newtab = document.createElement('li');
        var tabLink = document.createElement('a');
        tabLink.title = "Level Highlighter";
        tabLink.href = "#levelPanel";
        tabLink.setAttribute('data-toggle', 'tab');
        tabLink.textContent = "LH " + levelIcon;
        newtab.appendChild(tabLink);
        navTabs.appendChild(newtab);
        
        var tabPane = document.createElement('div');
        tabPane.id = "levelPanel";
        tabPane.className = "tab-pane";
        tabContentContainer.appendChild(tabPane);

        var section = document.createElement('div');
        section.style.padding = "15px";
        section.style.fontFamily = "Arial, sans-serif";
        
        // Title
        var titleDiv = document.createElement('div');
        titleDiv.style.marginBottom = "20px";
        titleDiv.innerHTML = '<h3 style="margin: 0; color: #333;">' + levelIcon + ' Level Highlighter</h3>';
        section.appendChild(titleDiv);
        
        // Controls
        var controlsDiv = document.createElement('div');
        controlsDiv.style.marginBottom = "20px";
        
        var controlsLabel = document.createElement('div');
        controlsLabel.style.fontSize = "14px";
        controlsLabel.style.marginBottom = "8px";
        controlsLabel.innerHTML = '<strong>Find segments edited by Level:</strong>';
        controlsDiv.appendChild(controlsLabel);
        
        var inputGroup = document.createElement('div');
        inputGroup.style.display = "flex";
        inputGroup.style.alignItems = "center";
        inputGroup.style.gap = "8px";
        
        var selectElement = document.createElement('select');
        selectElement.id = "_selectEditorLevel";
        selectElement.style.padding = "5px";
        selectElement.style.border = "1px solid #ccc";
        selectElement.style.borderRadius = "3px";
        selectElement.style.fontSize = "14px";
        
        // Load saved values or use defaults
        var savedLevel = loadFromLocalStorage(STORAGE_KEYS.selectedLevel, '1');
        var savedDays = loadFromLocalStorage(STORAGE_KEYS.daysOld, '30');
        var savedColorMode = loadFromLocalStorage(STORAGE_KEYS.colorMode, 'orange');
        var savedCustomColor = loadFromLocalStorage(STORAGE_KEYS.customColor, HIGHLIGHT_ORANGE);
        var savedAutoRefresh = loadFromLocalStorage(STORAGE_KEYS.autoRefresh, 'false') === 'true';
        var savedOpacity = loadFromLocalStorage(STORAGE_KEYS.opacity, '0.7');
        
        for (var i = 1; i <= 6; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.text = i;
            if (i.toString() === savedLevel) option.selected = true;
            selectElement.appendChild(option);
        }
        
        inputGroup.appendChild(selectElement);
        
        var withinLabel = document.createElement('span');
        withinLabel.textContent = 'within the last';
        withinLabel.style.fontSize = "14px";
        inputGroup.appendChild(withinLabel);
        
        var daysInput = document.createElement('input');
        daysInput.type = "number";
        daysInput.min = "0";
        daysInput.max = "9999";
        daysInput.step = "1";
        daysInput.style.width = "80px";
        daysInput.style.padding = "5px";
        daysInput.style.border = "1px solid #ccc";
        daysInput.style.borderRadius = "3px";
        daysInput.style.fontSize = "14px";
        daysInput.id = "_txtDaysOld";
        daysInput.value = savedDays;
        
        inputGroup.appendChild(daysInput);
        
        var daysLabel = document.createElement('span');
        daysLabel.textContent = 'days';
        daysLabel.style.fontSize = "14px";
        inputGroup.appendChild(daysLabel);
        
        controlsDiv.appendChild(inputGroup);
        section.appendChild(controlsDiv);
        
        // Status
        var statusDiv = document.createElement('div');
        statusDiv.id = "_highlightCounter";
        statusDiv.style.padding = "12px";
        statusDiv.style.background = "#f5f5f5";
        statusDiv.style.border = "1px solid #ddd";
        statusDiv.style.borderRadius = "4px";
        statusDiv.style.marginBottom = "15px";
        statusDiv.style.fontSize = "14px";
        statusDiv.innerHTML = 'Ready to search for segments';
        section.appendChild(statusDiv);
        
        // Results
        var resultsDiv = document.createElement('div');
        resultsDiv.id = "_editorsDisplay";
        section.appendChild(resultsDiv);
        
        // Color section
        var colorDiv = document.createElement('div');
        colorDiv.style.marginBottom = "20px";
        
        var colorLabel = document.createElement('div');
        colorLabel.style.fontSize = "14px";
        colorLabel.style.marginBottom = "8px";
        colorLabel.innerHTML = '<strong>Color:</strong>';
        colorDiv.appendChild(colorLabel);
        
        var radioGroup = document.createElement('div');
        radioGroup.style.display = "flex";
        radioGroup.style.flexDirection = "column";
        radioGroup.style.gap = "5px";
        
        // Orange
        var orangeDiv = document.createElement('div');
        var orangeRadio = document.createElement('input');
        orangeRadio.type = "radio";
        orangeRadio.name = "colour";
        orangeRadio.checked = (savedColorMode === 'orange');
        orangeRadio.id = "_rbHilightOrange";
        var orangeLabel = document.createElement('label');
        orangeLabel.style.marginLeft = "8px";
        orangeLabel.style.fontSize = "14px";
        orangeLabel.textContent = 'Orange';
        orangeDiv.appendChild(orangeRadio);
        orangeDiv.appendChild(orangeLabel);
        radioGroup.appendChild(orangeDiv);
        
        // Magenta
        var magentaDiv = document.createElement('div');
        var magentaRadio = document.createElement('input');
        magentaRadio.type = "radio";
        magentaRadio.name = "colour";
        magentaRadio.checked = (savedColorMode === 'magenta');
        magentaRadio.id = "_rbHilightMagenta";
        var magentaLabel = document.createElement('label');
        magentaLabel.style.marginLeft = "8px";
        magentaLabel.style.fontSize = "14px";
        magentaLabel.textContent = 'Magenta';
        magentaDiv.appendChild(magentaRadio);
        magentaDiv.appendChild(magentaLabel);
        radioGroup.appendChild(magentaDiv);
        
        // Custom
        var customDiv = document.createElement('div');
        customDiv.style.display = "flex";
        customDiv.style.alignItems = "center";
        var customRadio = document.createElement('input');
        customRadio.type = "radio";
        customRadio.name = "colour";
        customRadio.checked = (savedColorMode === 'custom');
        customRadio.id = "_rbHilightCustom";
        var customLabel = document.createElement('label');
        customLabel.style.marginLeft = "8px";
        customLabel.style.fontSize = "14px";
        customLabel.textContent = 'Custom:';
        var colorPicker = document.createElement('input');
        colorPicker.type = "color";
        colorPicker.id = "_customColorPicker";
        colorPicker.value = savedCustomColor;
        colorPicker.style.marginLeft = "8px";
        colorPicker.style.width = "40px";
        colorPicker.style.height = "25px";
        colorPicker.style.display = (savedColorMode === 'custom') ? 'inline-block' : 'none';
        customDiv.appendChild(customRadio);
        customDiv.appendChild(customLabel);
        customDiv.appendChild(colorPicker);
        radioGroup.appendChild(customDiv);
        
        colorDiv.appendChild(radioGroup);
        section.appendChild(colorDiv);
        
        // Auto-refresh option (moved here)
        var autoRefreshDiv = document.createElement('div');
        autoRefreshDiv.style.marginBottom = "20px";
        
        var autoRefreshCheckbox = document.createElement('input');
        autoRefreshCheckbox.type = "checkbox";
        autoRefreshCheckbox.id = "_cbAutoRefresh";
        autoRefreshCheckbox.checked = savedAutoRefresh;
        autoRefreshCheckbox.style.marginRight = "8px";
        
        var autoRefreshLabel = document.createElement('label');
        autoRefreshLabel.style.fontSize = "14px";
        autoRefreshLabel.style.cursor = "pointer";
        autoRefreshLabel.appendChild(autoRefreshCheckbox);
        autoRefreshLabel.appendChild(document.createTextNode('Auto-refresh every 5 seconds'));
        
        autoRefreshDiv.appendChild(autoRefreshLabel);
        section.appendChild(autoRefreshDiv);
        
        // Opacity section
        var opacityDiv = document.createElement('div');
        opacityDiv.style.marginBottom = "20px";
        
        var opacityLabel = document.createElement('div');
        opacityLabel.style.fontSize = "14px";
        opacityLabel.style.marginBottom = "8px";
        opacityLabel.innerHTML = '<strong>Opacity:</strong>';
        opacityDiv.appendChild(opacityLabel);
        
        var opacityGroup = document.createElement('div');
        opacityGroup.style.display = "flex";
        opacityGroup.style.alignItems = "center";
        opacityGroup.style.gap = "10px";
        
        var opacitySlider = document.createElement('input');
        opacitySlider.type = "range";
        opacitySlider.id = "_opacitySlider";
        opacitySlider.min = "0.1";
        opacitySlider.max = "1.0";
        opacitySlider.step = "0.01";
        opacitySlider.value = savedOpacity;
        opacitySlider.style.flex = "1";
        opacitySlider.style.height = "20px";
        
        var opacityValue = document.createElement('span');
        opacityValue.id = "_opacityValue";
        opacityValue.style.fontSize = "14px";
        opacityValue.style.minWidth = "40px";
        opacityValue.style.textAlign = "center";
        opacityValue.textContent = Math.round(parseFloat(savedOpacity) * 100) + '%';
        
        opacityGroup.appendChild(opacitySlider);
        opacityGroup.appendChild(opacityValue);
        opacityDiv.appendChild(opacityGroup);
        section.appendChild(opacityDiv);
        
        // Buttons
        var buttonGroup = document.createElement('div');
        buttonGroup.style.display = "flex";
        buttonGroup.style.gap = "10px";
        buttonGroup.style.marginBottom = "20px";
        
        var runButton = document.createElement('button');
        runButton.id = "_btnRunHighlighter";
        runButton.style.padding = "10px 20px";
        runButton.style.background = savedAutoRefresh ? "#FF9800" : "#4CAF50";
        runButton.style.color = "white";
        runButton.style.border = "none";
        runButton.style.borderRadius = "4px";
        runButton.style.fontSize = "14px";
        runButton.style.fontWeight = "bold";
        runButton.style.cursor = "pointer";
        runButton.textContent = savedAutoRefresh ? "AUTO REFRESH ON" : "RUN HIGHLIGHTER";
        buttonGroup.appendChild(runButton);
        
        var resetButton = document.createElement('button');
        resetButton.style.padding = "10px 20px";
        resetButton.style.background = "#f44336";
        resetButton.style.color = "white";
        resetButton.style.border = "none";
        resetButton.style.borderRadius = "4px";
        resetButton.style.fontSize = "14px";
        resetButton.style.cursor = "pointer";
        resetButton.textContent = "RESET";
        buttonGroup.appendChild(resetButton);
        
        section.appendChild(buttonGroup);
        
        var selectButton = document.createElement('button');
        selectButton.style.padding = "8px 16px";
        selectButton.style.background = "#2196F3";
        selectButton.style.color = "white";
        selectButton.style.border = "none";
        selectButton.style.borderRadius = "4px";
        selectButton.style.fontSize = "14px";
        selectButton.style.cursor = "pointer";
        selectButton.style.marginBottom = "20px";
        selectButton.textContent = "SELECT HIGHLIGHTED";
        section.appendChild(selectButton);
        
        // Version
        var versionDiv = document.createElement('div');
        versionDiv.style.fontSize = "12px";
        versionDiv.style.color = "#999";
        versionDiv.style.textAlign = "center";
        versionDiv.textContent = 'Level Highlighter v' + SCRIPT_VERSION;
        section.appendChild(versionDiv);

        tabPane.appendChild(section);
        
        // Event handlers
        runButton.addEventListener('click', runHighlighter);
        
        resetButton.addEventListener('click', function() {
            resetAllHighlights();
            var counterElement = getId('_highlightCounter');
            if (counterElement) {
                counterElement.innerHTML = "All highlights cleared";
            }
        });
        
        selectButton.addEventListener('click', selectHighlightedSegments);
        
        // Save settings when changed
        selectElement.addEventListener('change', function() {
            saveToLocalStorage(STORAGE_KEYS.selectedLevel, this.value);
        });
        
        daysInput.addEventListener('change', function() {
            saveToLocalStorage(STORAGE_KEYS.daysOld, this.value);
        });
        
        orangeRadio.addEventListener('change', function() {
            if (this.checked) {
                saveToLocalStorage(STORAGE_KEYS.colorMode, 'orange');
                updateCustomColorVisibility();
            }
        });
        
        magentaRadio.addEventListener('change', function() {
            if (this.checked) {
                saveToLocalStorage(STORAGE_KEYS.colorMode, 'magenta');
                updateCustomColorVisibility();
            }
        });
        
        customRadio.addEventListener('change', function() {
            if (this.checked) {
                saveToLocalStorage(STORAGE_KEYS.colorMode, 'custom');
                updateCustomColorVisibility();
            }
        });
        
        colorPicker.addEventListener('change', function() {
            saveToLocalStorage(STORAGE_KEYS.customColor, this.value);
        });
        
        // Auto-refresh checkbox
        autoRefreshCheckbox.addEventListener('change', toggleAutoRefresh);
        
        // Opacity slider
        opacitySlider.addEventListener('input', function() {
            var value = parseFloat(this.value);
            var percentage = Math.round(value * 100);
            var opacityValueElement = getId('_opacityValue');
            if (opacityValueElement) {
                opacityValueElement.textContent = percentage + '%';
            }
            saveToLocalStorage(STORAGE_KEYS.opacity, this.value);
            
            // Update existing highlights with new opacity
            updateHighlightOpacity(value);
        });
        
        // Update highlight opacity function
        function updateHighlightOpacity(newOpacity) {
            if (!window.W || !window.W.model || !window.W.model.segments) return;
            
            for (var i = 0; i < highlightedSegmentIds.length; i++) {
                var segId = highlightedSegmentIds[i];
                var segment = W.model.segments.getObjectById(segId);
                if (!segment) continue;
                
                try {
                    var line = W.userscripts.getFeatureElementByDataModel(segment);
                    if (line && line.getAttribute("stroke")) {
                        line.setAttribute("stroke-opacity", newOpacity);
                    }
                } catch (e) {
                    // Ignore errors
                }
            }
            console.log("Updated opacity for", highlightedSegmentIds.length, "highlights to", Math.round(newOpacity * 100) + "%");
        }

        // Global functions for clicking
        window.selectSegmentById = selectSegmentById;
        window.selectSegmentsByEditor = selectSegmentsByEditor;

        console.log("=== UI CREATED ===");
        
        // Apply saved custom color visibility
        updateCustomColorVisibility();
        
        // Initialize auto-refresh if enabled
        if (savedAutoRefresh) {
            autoRefreshEnabled = true;
            autoRefreshInterval = setInterval(function() {
                console.log("Auto-refresh: Running highlighter...");
                runHighlighter();
            }, 5000);
            console.log("Auto-refresh initialized from saved settings");
        }
        
        setTimeout(runHighlighter, 2000);
    }

    function initialize() {
        if (!window.W) {
            setTimeout(initialize, 1000);
            return;
        }
        
        setTimeout(createUI, 2000);
    }

    setTimeout(initialize, 1000);

})();