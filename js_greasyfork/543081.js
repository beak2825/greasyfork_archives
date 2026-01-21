// ==UserScript==
// @name         WME Level Highlighter
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2026.01.21
// @description  Level highlighter for Waze Map Editor with multi-level selection and statistics
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

    var SCRIPT_VERSION = "2026.01.21";
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
        selectedLevels: 'wme_level_highlighter_levels', // Changed to support multiple levels
        daysOld: 'wme_level_highlighter_days',
        colorMode: 'wme_level_highlighter_color_mode',
        customColor: 'wme_level_highlighter_custom_color',
        autoRefresh: 'wme_level_highlighter_auto_refresh',
        showStatistics: 'wme_level_highlighter_show_stats'
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

    // NEW: Get selected levels (supports multiple)
    function getSelectedLevels() {
        var levels = [];
        for (var i = 1; i <= 6; i++) {
            var checkbox = getId('_cbLevel' + i);
            if (checkbox && checkbox.checked) {
                levels.push(i - 1); // Convert to internal level (0-based)
            }
        }
        return levels.length > 0 ? levels : [0]; // Default to level 1 if none selected
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
                var line = null;

                // Try to use the new Waze API for getting feature elements
                if (window.W && window.W.userscripts && window.W.userscripts.getFeatureElementByDataModel) {
                    line = window.W.userscripts.getFeatureElementByDataModel(segment);
                } else {
                    // Fallback to old method
                    line = W.userscripts.getFeatureElementByDataModel(segment);
                }

                if (line) {
                    line.removeAttribute("stroke");
                    line.removeAttribute("stroke-opacity");
                    line.removeAttribute("stroke-width");
                    line.removeAttribute("stroke-dasharray");
                    resetCount++;
                }
            } catch (e) {
                console.warn("Error resetting segment", seg, ":", e);
            }
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

    // NEW: Calculate statistics
    function calculateStatistics(segments) {
        var stats = {
            totalSegments: segments.length,
            editorCount: {},
            levelDistribution: {}
        };

        segments.forEach(function(seg) {
            // Editor statistics
            if (!stats.editorCount[seg.editorName]) {
                stats.editorCount[seg.editorName] = 0;
            }
            stats.editorCount[seg.editorName]++;

            // Level distribution
            if (!stats.levelDistribution[seg.editorLevel]) {
                stats.levelDistribution[seg.editorLevel] = 0;
            }
            stats.levelDistribution[seg.editorLevel]++;
        });

        return stats;
    }

    // NEW: Update statistics display
    function updateStatisticsDisplay() {
        var statsElement = getId('_statisticsDisplay');
        if (!statsElement || foundSegmentsList.length === 0) return;

        var stats = calculateStatistics(foundSegmentsList);

        var html = '<div style="background: #f9f9f9; padding: 10px; border-radius: 4px; margin-top: 10px;">';
        html += '<h4 style="margin: 0 0 10px 0;">📊 Statistics</h4>';

        // Top editors
        var topEditors = Object.keys(stats.editorCount)
            .map(function(editor) {
                return [editor, stats.editorCount[editor]];
            })
            .sort(function(a, b) {
                return b[1] - a[1];
            })
            .slice(0, 5);

        html += '<div style="margin-bottom: 10px;"><strong>Top Editors:</strong><br>';
        topEditors.forEach(function(editorData) {
            html += '<span style="margin-left: 10px;">' + editorData[0] + ': ' + editorData[1] + ' segments</span><br>';
        });
        html += '</div>';

        // Level distribution
        html += '<div><strong>Level Distribution:</strong><br>';
        Object.keys(stats.levelDistribution)
            .map(function(level) {
                return [level, stats.levelDistribution[level]];
            })
            .sort(function(a, b) {
                return parseInt(a[0]) - parseInt(b[0]);
            })
            .forEach(function(levelData) {
                html += '<span style="margin-left: 10px;">Level ' + levelData[0] + ': ' + levelData[1] + ' segments</span><br>';
            });
        html += '</div>';

        html += '</div>';

        statsElement.innerHTML = html;
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
            var segmentsContainer = document.createElement('div');

            for (var m = 0; m < segments.length; m++) {
                var seg = segments[m];
                var editDate = new Date(seg.editDate);
                var daysAgo = Math.floor((new Date() - editDate) / 86400000);

                var segmentDiv = document.createElement('div');
                segmentDiv.style.color = '#888';
                segmentDiv.style.marginLeft = '15px';
                segmentDiv.style.marginTop = '3px';
                segmentDiv.style.fontSize = '12px';

                // Hide segments beyond maxShow initially
                if (m >= maxShow) {
                    segmentDiv.style.display = 'none';
                    segmentDiv.className = 'hidden-segment';
                }

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
                segmentsContainer.appendChild(segmentDiv);
            }

            editorDiv.appendChild(segmentsContainer);

            if (segments.length > maxShow) {
                var toggleDiv = document.createElement('div');
                toggleDiv.style.color = '#2196F3';
                toggleDiv.style.marginLeft = '15px';
                toggleDiv.style.cursor = 'pointer';
                toggleDiv.style.textDecoration = 'underline';
                toggleDiv.style.fontSize = '12px';
                toggleDiv.style.marginTop = '5px';
                toggleDiv.style.fontWeight = 'bold';
                toggleDiv.textContent = '▼ Show ' + (segments.length - maxShow) + ' more segments';
                toggleDiv.title = 'Click to show/hide additional segments';

                var isExpanded = false;
                toggleDiv.addEventListener('click', function() {
                    var hiddenSegments = segmentsContainer.querySelectorAll('.hidden-segment');

                    if (!isExpanded) {
                        // Show all segments
                        for (var i = 0; i < hiddenSegments.length; i++) {
                            hiddenSegments[i].style.display = 'block';
                        }
                        toggleDiv.textContent = '▲ Hide ' + (segments.length - maxShow) + ' segments';
                        isExpanded = true;
                    } else {
                        // Hide segments beyond maxShow
                        for (var i = 0; i < hiddenSegments.length; i++) {
                            hiddenSegments[i].style.display = 'none';
                        }
                        toggleDiv.textContent = '▼ Show ' + (segments.length - maxShow) + ' more segments';
                        isExpanded = false;
                    }
                });

                editorDiv.appendChild(toggleDiv);
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

        var selectedLevels = getSelectedLevels(); // NEW: Multi-level support
        var daysInput = getId('_txtDaysOld');
        var customColorPicker = getId('_customColorPicker');

        var daysOld = daysInput ? parseInt(daysInput.value) || 30 : 30;
        var colorMode = getColorMode();
        var customColor = customColorPicker ? customColorPicker.value : HIGHLIGHT_ORANGE;

        // Save current settings to localStorage
        saveToLocalStorage(STORAGE_KEYS.selectedLevels, JSON.stringify(selectedLevels.map(l => l + 1)));
        if (daysInput) {
            saveToLocalStorage(STORAGE_KEYS.daysOld, daysInput.value);
        }
        saveToLocalStorage(STORAGE_KEYS.colorMode, colorMode);
        if (customColorPicker) {
            saveToLocalStorage(STORAGE_KEYS.customColor, customColorPicker.value);
        }

        var autoRefreshCheckbox = getId('_cbAutoRefresh');
        if (autoRefreshCheckbox) {
            saveToLocalStorage(STORAGE_KEYS.autoRefresh, autoRefreshCheckbox.checked.toString());
        }

        console.log("Levels:", selectedLevels.map(l => l + 1), "Days:", daysOld);

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
                if (selectedLevels.indexOf(userInternalLevel) === -1) continue; // NEW: Check multiple levels

                matchingSegments++;

                var segmentInfo = {
                    segmentId: seg,
                    editorName: user.attributes.userName,
                    editorLevel: userInternalLevel + 1,
                    editDate: editDate
                };
                foundSegmentsList.push(segmentInfo);

                try {
                    var line = null;

                    // Try to use the new Waze API for getting feature elements
                    if (window.W && window.W.userscripts && window.W.userscripts.getFeatureElementByDataModel) {
                        line = window.W.userscripts.getFeatureElementByDataModel(segment);
                    } else {
                        // Fallback to old method
                        line = W.userscripts.getFeatureElementByDataModel(segment);
                    }

                    if (line) {
                        var highlightColor = getHighlightColor(colorMode, customColor);
                        line.setAttribute("stroke", highlightColor);
                        line.setAttribute("stroke-opacity", HIGHLIGHT_OPACITY);
                        line.setAttribute("stroke-width", 8);
                        line.setAttribute("stroke-dasharray", "none");
                        highlightedSegments++;
                        highlightedSegmentIds.push(seg);
                    }
                } catch (e) {
                    console.warn("Error highlighting segment", seg, ":", e);
                }

            } catch (userError) {
                console.warn("Error accessing user", updatedBy, userError);
            }
        }

        var counterElement = getId('_highlightCounter');
        if (counterElement) {
            var counterText = '<strong>Found ' + matchingSegments + ' segments by Level ' + selectedLevels.map(l => l + 1).join(', ') + ' editors</strong><br>' +
                '<strong>Highlighted ' + highlightedSegments + ' segments</strong><br>' +
                '<span style="color: #888;">(' + totalSegments + ' total segments checked)</span>';

            counterElement.innerHTML = counterText;
        }

        updateEditorsDisplay();

        // NEW: Update statistics if enabled
        var showStatsCheckbox = getId('_cbShowStats');
        if (showStatsCheckbox && showStatsCheckbox.checked) {
            updateStatisticsDisplay();
        }

        console.log("Found:", matchingSegments, "Highlighted:", highlightedSegments);
    }

    function createUI() {
        console.log("=== CREATING UI ===");

        // Try to use the new Waze API first
        if (window.W && window.W.userscripts && window.W.userscripts.registerSidebarTab) {
            try {
                console.log("Using new Waze API for tab registration");
                var result = window.W.userscripts.registerSidebarTab("wme-level-highlighter");
                var tabLabel = result.tabLabel;
                var tabPane = result.tabPane;

                // Set tab label
                tabLabel.textContent = "LH " + levelIcon;
                tabLabel.title = "Level Highlighter";

                // Wait for tab pane to be connected to DOM
                if (window.W.userscripts.waitForElementConnected) {
                    window.W.userscripts.waitForElementConnected(tabPane).then(function() {
                        console.log("Tab pane connected to DOM via new API");
                        createUIContent(tabPane);
                    });
                } else {
                    // Fallback if waitForElementConnected is not available
                    tabPane.addEventListener("element-connected", function() {
                        console.log("Tab pane connected to DOM via event listener");
                        createUIContent(tabPane);
                    }, { once: true });
                }

                console.log("Successfully registered tab using new Waze API");
                return;

            } catch (error) {
                console.log("Failed to use new Waze API, falling back to old method:", error);
            }
        }

        // Fallback to old method if new API not available
        console.log("Using fallback method for tab creation");
        createUIFallback();
    }

    function createUIFallback() {
        var userTabs = getId('user-info');
        if (!userTabs) {
            setTimeout(createUIFallback, 1000);
            return;
        }

        var navTabs = userTabs.querySelector('.nav-tabs');
        var tabContentContainer = userTabs.querySelector('.tab-content');

        if (!navTabs || !tabContentContainer) {
            setTimeout(createUIFallback, 1000);
            return;
        }

        // Remove existing tab if it exists
        var existingTab = navTabs.querySelector('a[href="#levelPanel"]');
        if (existingTab) {
            existingTab.parentElement.remove();
        }
        var existingPane = getId('levelPanel');
        if (existingPane) {
            existingPane.remove();
        }

        var newtab = document.createElement('li');
        var tabLink = document.createElement('a');
        tabLink.title = "Level Highlighter";
        tabLink.href = "#levelPanel";
        tabLink.setAttribute('data-toggle', 'tab');
        tabLink.textContent = "LH " + levelIcon;
        newtab.appendChild(tabLink);

        // Add our tab at the end initially
        navTabs.appendChild(newtab);
        console.log("Added LH tab using fallback method");

        var tabPane = document.createElement('div');
        tabPane.id = "levelPanel";
        tabPane.className = "tab-pane";
        tabContentContainer.appendChild(tabPane);

        // Continue with UI creation...
        createUIContent(tabPane);
    }

    function createUIContent(tabPane) {

        var section = document.createElement('div');
        section.style.padding = "15px";
        section.style.fontFamily = "Arial, sans-serif";

        // Title
        var titleDiv = document.createElement('div');
        titleDiv.style.marginBottom = "20px";
        titleDiv.innerHTML = '<h3 style="margin: 0; color: #333;">' + levelIcon + ' Level Highlighter</h3>';
        section.appendChild(titleDiv);

        // Load saved values or use defaults
        var savedLevels = JSON.parse(loadFromLocalStorage(STORAGE_KEYS.selectedLevels, '[1]'));
        var savedDays = loadFromLocalStorage(STORAGE_KEYS.daysOld, '30');
        var savedColorMode = loadFromLocalStorage(STORAGE_KEYS.colorMode, 'orange');
        var savedCustomColor = loadFromLocalStorage(STORAGE_KEYS.customColor, HIGHLIGHT_ORANGE);
        var savedAutoRefresh = loadFromLocalStorage(STORAGE_KEYS.autoRefresh, 'false') === 'true';
        var savedShowStats = loadFromLocalStorage(STORAGE_KEYS.showStatistics, 'false') === 'true';

        // NEW: Multi-level selection
        var levelDiv = document.createElement('div');
        levelDiv.style.marginBottom = "20px";

        var levelLabel = document.createElement('div');
        levelLabel.style.fontSize = "14px";
        levelLabel.style.marginBottom = "8px";
        levelLabel.innerHTML = '<strong>Find segments edited by Level:</strong>';
        levelDiv.appendChild(levelLabel);

        var levelCheckboxes = document.createElement('div');
        levelCheckboxes.style.display = "grid";
        levelCheckboxes.style.gridTemplateColumns = "repeat(3, 1fr)";
        levelCheckboxes.style.gap = "8px";
        levelCheckboxes.style.marginBottom = "10px";

        for (var i = 1; i <= 6; i++) {
            var checkboxLabel = document.createElement('label');
            checkboxLabel.style.display = "flex";
            checkboxLabel.style.alignItems = "center";
            checkboxLabel.style.gap = "5px";
            checkboxLabel.style.cursor = "pointer";

            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.id = "_cbLevel" + i;
            checkbox.checked = savedLevels.includes(i);

            var labelText = document.createElement('span');
            labelText.textContent = "Level " + i;

            checkboxLabel.appendChild(checkbox);
            checkboxLabel.appendChild(labelText);
            levelCheckboxes.appendChild(checkboxLabel);
        }

        levelDiv.appendChild(levelCheckboxes);

        var inputGroup = document.createElement('div');
        inputGroup.style.display = "flex";
        inputGroup.style.alignItems = "center";
        inputGroup.style.gap = "8px";

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

        levelDiv.appendChild(inputGroup);
        section.appendChild(levelDiv);

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

        // Auto-refresh option
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

        // NEW: Statistics option
        var statsDiv = document.createElement('div');
        statsDiv.style.marginBottom = "20px";

        var statsCheckbox = document.createElement('input');
        statsCheckbox.type = "checkbox";
        statsCheckbox.id = "_cbShowStats";
        statsCheckbox.checked = savedShowStats;
        statsCheckbox.style.marginRight = "8px";

        var statsLabel = document.createElement('label');
        statsLabel.style.fontSize = "14px";
        statsLabel.style.cursor = "pointer";
        statsLabel.appendChild(statsCheckbox);
        statsLabel.appendChild(document.createTextNode('Show statistics'));

        statsDiv.appendChild(statsLabel);
        section.appendChild(statsDiv);

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

        // NEW: Statistics display
        var statisticsDisplay = document.createElement('div');
        statisticsDisplay.id = "_statisticsDisplay";
        section.appendChild(statisticsDisplay);

        // Version
        var versionDiv = document.createElement('div');
        versionDiv.style.fontSize = "12px";
        versionDiv.style.color = "#999";
        versionDiv.style.textAlign = "center";
        versionDiv.textContent = 'Level Highlighter v' + SCRIPT_VERSION;
        section.appendChild(versionDiv);

        tabPane.appendChild(section);

        // Event handlers
        runButton.addEventListener('click', function() {
            // If auto-refresh is on, toggle it off when clicking the button
            if (autoRefreshEnabled) {
                var autoRefreshCheckbox = getId('_cbAutoRefresh');
                if (autoRefreshCheckbox) {
                    autoRefreshCheckbox.checked = false;
                    toggleAutoRefresh();
                }
            } else {
                // Normal run highlighter
                runHighlighter();
            }
        });

        resetButton.addEventListener('click', function() {
            resetAllHighlights();
            var counterElement = getId('_highlightCounter');
            if (counterElement) {
                counterElement.innerHTML = "All highlights cleared";
            }
        });

        selectButton.addEventListener('click', selectHighlightedSegments);

        // Save settings when changed
        for (var i = 1; i <= 6; i++) {
            getId('_cbLevel' + i).addEventListener('change', function() {
                var selectedLevels = getSelectedLevels().map(l => l + 1);
                saveToLocalStorage(STORAGE_KEYS.selectedLevels, JSON.stringify(selectedLevels));
            });
        }

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

        // NEW: Statistics checkbox
        statsCheckbox.addEventListener('change', function() {
            saveToLocalStorage(STORAGE_KEYS.showStatistics, this.checked.toString());
            if (this.checked && foundSegmentsList.length > 0) {
                updateStatisticsDisplay();
            } else {
                getId('_statisticsDisplay').innerHTML = '';
            }
        });

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
        console.log("=== INITIALIZING WME Level Highlighter ===");

        // Use the new Waze API events for proper initialization
        if (window.W && window.W.userscripts && window.W.userscripts.state) {
            if (window.W.userscripts.state.isReady) {
                console.log("WME is already ready, creating UI immediately");
                createUI();
            } else {
                console.log("Waiting for wme-ready event");
                document.addEventListener("wme-ready", function() {
                    console.log("wme-ready event received, creating UI");
                    createUI();
                }, { once: true });
            }
        } else {
            // Fallback for older WME versions
            console.log("Using fallback initialization method");
            if (!window.W) {
                setTimeout(initialize, 1000);
                return;
            }

            // Wait for Waze to load, then create UI
            setTimeout(createUI, 3000);
        }
    }

    setTimeout(initialize, 1000);

})();