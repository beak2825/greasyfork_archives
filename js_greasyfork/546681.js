// ==UserScript==
// @name         WME NINA Warnungen
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2025.08.21
// @description  Zeigt NINA Warnmeldungen im Waze Map Editor Scripts-Tab an
// @author       Hiwi234
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546681/WME%20NINA%20Warnungen.user.js
// @updateURL https://update.greasyfork.org/scripts/546681/WME%20NINA%20Warnungen.meta.js
// ==/UserScript==

function addPolygonsToMap(warnings) {
        if (!warnings || warnings.length === 0) return;

        // Prüfe ob Polygone aktiviert sind
        const showPolygonsCheckbox = document.getElementById('show-polygons-checkbox');
        const showPolygons = showPolygonsCheckbox ? showPolygonsCheckbox.checked : true;

        if (!showPolygons || !W.map) return;

        try {
            let ninaPolygonLayer = W.map.getOLMap().getLayersByName('ninaPolygonLayer')[0];
            if (!ninaPolygonLayer) {
                ninaPolygonLayer = new OpenLayers.Layer.Vector('ninaPolygonLayer', {
                    displayInLayerSwitcher: false,
                    visibility: true
                });
                W.map.getOLMap().addLayer(ninaPolygonLayer);
                console.log('NINA: Polygon-Layer erstellt');
            }

            console.log(`NINA: Versuche Polygone für ${warnings.length} Warnungen zu laden`);

            warnings.forEach((warning, index) => {
                try {
                    // Laden der detaillierten Geometrie-Daten für jede Warnung
                    if (warning.id) {
                        console.log(`NINA: Lade Polygon-Details für ${warning.id}`);
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: `https://warnung.bund.de/api31/warnings/${warning.id}.json`,
                            onload: function(response) {
                                try {
                                    const detailData = JSON.parse(response.responseText);
                                    console.log(`NINA: Detail-Daten für ${warning.id}:`, detailData);

                                    if (detailData.info && detailData.info[0] && detailData.info[0].area) {
                                        console.log(`NINA: Area-Daten gefunden:`, detailData.info[0].area);
                                        createPolygonFromArea(detailData.info[0].area, warning, ninaPolygonLayer);
                                    } else {
                                        console.log(`NINA: Keine Area-Daten in ${warning.id}`);
                                        // Fallback: Erstelle Kreis um Demo-Position
                                        createFallbackPolygon(warning, ninaPolygonLayer, index);
                                    }
                                } catch (e) {
                                    console.warn('NINA: Fehler beim Parsen der Polygon-Details:', e);
                                    createFallbackPolygon(warning, ninaPolygonLayer, index);
                                }
                            },
                            onerror: function(error) {
                                console.error(`NINA: Fehler beim Laden der Details für ${warning.id}:`, error);
                                createFallbackPolygon(warning, ninaPolygonLayer, index);
                            }
                        });
                    } else {
                        console.log('NINA: Keine ID für Warnung, erstelle Fallback-Polygon');
                        createFallbackPolygon(warning, ninaPolygonLayer, index);
                    }
                } catch (e) {
                    console.error('NINA: Fehler beim Erstellen von Polygon:', e);
                }
            });
        } catch (e) {
            console.error('NINA: Fehler beim Hinzufügen der Polygone:', e);
        }
    }

    function createFallbackPolygon(warning, layer, index) {
        try {
            const locations = [
                [52.5200, 13.4050], [48.1351, 11.5820], [53.5511, 9.9937], [50.9375, 6.9603],
                [50.1109, 8.6821], [48.7758, 9.1829], [51.2277, 6.7735], [51.0504, 13.7373]
            ];

            const [lat, lon] = locations[index % locations.length];
            const radius = 5000; // 5km Radius

            // Erstelle Kreis um Position
            const centerPoint = new OpenLayers.LonLat(lon, lat).transform(
                new OpenLayers.Projection("EPSG:4326"),
                W.map.getOLMap().getProjectionObject()
            );

            const circle = OpenLayers.Geometry.Polygon.createRegularPolygon(
                new OpenLayers.Geometry.Point(centerPoint.lon, centerPoint.lat),
                radius,
                20
            );

            const color = getSeverityColor(warning.severity);
            const fillColor = color + '40'; // 25% Transparenz

            const style = new OpenLayers.Style({
                fillColor: fillColor,
                strokeColor: color,
                strokeWidth: 2,
                fillOpacity: 0.25,
                strokeOpacity: 0.8
            });

            const feature = new OpenLayers.Feature.Vector(circle, {
                warning: warning
            }, style);

            layer.addFeatures([feature]);
            console.log('NINA: Fallback-Polygon erstellt für:', warning.i18nTitle?.de || warning.id);
        } catch (e) {
            console.error('NINA: Fehler beim Erstellen des Fallback-Polygons:', e);
        }
    }

    function createPolygonFromArea(area, warning, layer) {
        if (!area || !area.polygon) return;

        try {
            // Polygon-Koordinaten parsen (Format: "lat1,lon1 lat2,lon2 ...")
            const coordString = area.polygon;
            const coordPairs = coordString.split(' ');
            const points = [];

            coordPairs.forEach(pair => {
                const [lat, lon] = pair.split(',').map(Number);
                if (!isNaN(lat) && !isNaN(lon)) {
                    const point = new OpenLayers.LonLat(lon, lat).transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        W.map.getOLMap().getProjectionObject()
                    );
                    points.push(new OpenLayers.Geometry.Point(point.lon, point.lat));
                }
            });

            if (points.length > 2) {
                // Polygon erstellen
                const ring = new OpenLayers.Geometry.LinearRing(points);
                const polygon = new OpenLayers.Geometry.Polygon([ring]);

                // Farbe basierend auf Schweregrad
                const color = getSeverityColor(warning.severity);
                const fillColor = color + '40'; // 25% Transparenz

                const style = new OpenLayers.Style({
                    fillColor: fillColor,
                    strokeColor: color,
                    strokeWidth: 2,
                    fillOpacity: 0.25,
                    strokeOpacity: 0.8
                });

                const feature = new OpenLayers.Feature.Vector(polygon, {
                    warning: warning
                }, style);

                // Click-Event für Polygon
                feature.attributes.clickHandler = function() {
                    showWarningDetails(warning);
                };

                layer.addFeatures([feature]);
                console.log('NINA: Polygon erstellt für Warnung:', warning.i18nTitle?.de || warning.id);
            }
        } catch (e) {
            console.error('NINA: Fehler beim Erstellen des Polygons:', e);
        }
    }

(function() {
    'use strict';

    let initialized = false;
    let ninaTab = null;
    let tabPane = null;

    // Globale Variablen
    const NINA_DATA = {
        warnings: [],
        markers: [],
        polygons: [],
        showMarkersOnMap: true,
        showPolygonsOnMap: true,
        activeFilters: {
            sources: { mowas: true, dwd: true, katwarn: true, biwapp: true, lhp: true },
            severities: { extreme: true, severe: true, moderate: true, minor: true, unknown: true },
            types: { alert: true, update: true, cancel: true }
        }
    };

    // CSS hinzufügen
    GM_addStyle(`
        .nina-tab-content { padding: 10px; font-family: Arial, sans-serif; height: 100%; overflow-y: auto; }
        .nina-header { background: #ff6b35; color: white; padding: 10px; margin: -10px -10px 10px -10px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .nina-stats { background: #f8f9fa; padding: 8px; border-radius: 4px; margin-bottom: 10px; font-size: 0.9em; color: #495057; }
        .nina-controls { background: #f8f9fa; padding: 8px; border-radius: 4px; margin-bottom: 10px; }
        .nina-control-section { margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #dee2e6; }
        .nina-control-section:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .nina-control-title { font-weight: bold; margin-bottom: 5px; font-size: 0.9em; color: #495057; }
        .nina-checkbox-group { display: flex; flex-wrap: wrap; gap: 8px; }
        .nina-checkbox { display: flex; align-items: center; gap: 5px; font-size: 0.85em; white-space: nowrap; }
        .nina-checkbox input[type="checkbox"] { margin: 0; }
        .nina-source-filter { padding: 2px 6px; border-radius: 3px; color: white; font-weight: bold; }
        .nina-source-mowas { background: #ff6b35; }
        .nina-source-dwd { background: #2196F3; }
        .nina-source-katwarn { background: #f44336; }
        .nina-source-biwapp { background: #9c27b0; }
        .nina-source-lhp { background: #00bcd4; }
        .nina-warning { border-left: 4px solid #ff6b35; padding: 8px; margin-bottom: 10px; background: #fff5f2; cursor: pointer; border-radius: 4px; transition: all 0.2s ease; }
        .nina-warning:hover { background: #ffe8e0; transform: translateX(2px); box-shadow: 2px 2px 8px rgba(0,0,0,0.1); }
        .nina-warning-title { font-weight: bold; color: #d63031; margin-bottom: 4px; font-size: 0.95em; line-height: 1.3; }
        .nina-warning-meta { color: #636e72; font-size: 0.9em; margin-bottom: 6px; line-height: 1.4; }
        .nina-warning-type { background: #ff6b35; color: white; padding: 2px 6px; border-radius: 12px; font-size: 0.8em; display: inline-block; margin-right: 4px; }
        .nina-refresh { cursor: pointer; margin-right: 10px; padding: 4px 8px; background: rgba(255,255,255,0.2); border-radius: 4px; transition: background 0.2s; }
        .nina-refresh:hover { background: rgba(255,255,255,0.3); }
        .nina-loading { text-align: center; padding: 20px; color: #636e72; }
        .nina-empty { text-align: center; padding: 30px; color: #636e72; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
        .nina-source-badge { background: #6c757d; color: white; padding: 1px 4px; border-radius: 2px; font-size: 0.7em; margin-left: 4px; }
        .nina-goto-btn { float: right; background: #007bff; color: white; border: none; padding: 2px 6px; border-radius: 3px; font-size: 0.8em; cursor: pointer; margin-left: 8px; }
        .nina-goto-btn:hover { background: #0056b3; }
    `);

    function waitForWME(callback) {
        if (typeof W !== 'undefined' && W.userscripts && W.userscripts.registerSidebarTab && W.map && W.map.getOLMap) {
            callback();
        } else {
            setTimeout(() => waitForWME(callback), 250);
        }
    }

    function initNINAScript() {
        if (initialized) return;
        initialized = true;

        try {
            const result = W.userscripts.registerSidebarTab("nina-warnings");
            if (!result) {
                console.error('NINA: Konnte Tab nicht registrieren');
                return;
            }

            const { tabLabel, tabPane: pane } = result;
            tabPane = pane;

            tabLabel.innerHTML = 'NINA';
            tabLabel.title = 'NINA Warnmeldungen';
            tabLabel.style.fontSize = '16px';

            W.userscripts.waitForElementConnected(tabPane).then(() => {
                setupTabContent();
                loadNINAWarnings();
                setInterval(loadNINAWarnings, 300000);
            });

        } catch (error) {
            console.error('NINA: Fehler beim Registrieren des Tabs:', error);
        }
    }

    function setupTabContent() {
        if (!tabPane) return;

        tabPane.innerHTML = `
            <div class="nina-tab-content">
                <div class="nina-header">
                    <span>NINA Warnungen</span>
                    <span class="nina-refresh" id="nina-refresh-btn">Aktualisieren</span>
                </div>
                <div class="nina-stats" id="nina-stats">Lade Warnungen...</div>
                <div class="nina-controls">
                    <div class="nina-control-section">
                        <div class="nina-control-title">Kartenanzeige</div>
                        <div class="nina-checkbox">
                            <input type="checkbox" id="show-markers-checkbox" checked>
                            <label for="show-markers-checkbox">Icons auf Karte anzeigen</label>
                        </div>
                    </div>
                    <div class="nina-control-section">
                        <div class="nina-control-title">Warnquellen</div>
                        <div class="nina-checkbox-group">
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-mowas" checked>
                                <label for="filter-mowas"><span class="nina-source-filter nina-source-mowas">MoWaS</span></label>
                            </div>
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-dwd" checked>
                                <label for="filter-dwd"><span class="nina-source-filter nina-source-dwd">DWD</span></label>
                            </div>
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-katwarn" checked>
                                <label for="filter-katwarn"><span class="nina-source-filter nina-source-katwarn">KatWarn</span></label>
                            </div>
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-biwapp" checked>
                                <label for="filter-biwapp"><span class="nina-source-filter nina-source-biwapp">BiWapp</span></label>
                            </div>
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-lhp" checked>
                                <label for="filter-lhp"><span class="nina-source-filter nina-source-lhp">LHP</span></label>
                            </div>
                        </div>
                    </div>
                    <div class="nina-control-section">
                        <div class="nina-control-title">Anzeige</div>
                        <div class="nina-checkbox-group">
                            <div class="nina-checkbox">
                                <input type="checkbox" id="show-polygons-checkbox" checked>
                                <label for="show-polygons-checkbox">Warngebiete als Flaechen</label>
                            </div>
                        </div>
                    </div>
                    <div class="nina-control-section">
                        <div class="nina-control-title">Schweregrad</div>
                        <div class="nina-checkbox-group">
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-extreme" checked>
                                <label for="filter-extreme" style="color: #8B0000; font-weight: bold;">Extrem</label>
                            </div>
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-severe" checked>
                                <label for="filter-severe" style="color: #FF0000; font-weight: bold;">Schwer</label>
                            </div>
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-moderate" checked>
                                <label for="filter-moderate" style="color: #FF8C00; font-weight: bold;">Mittel</label>
                            </div>
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-minor" checked>
                                <label for="filter-minor" style="color: #FFD700; font-weight: bold;">Gering</label>
                            </div>
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-unknown" checked>
                                <label for="filter-unknown" style="color: #999;">Unbekannt</label>
                            </div>
                        </div>
                    </div>
                    <div class="nina-control-section">
                        <div class="nina-control-title">Status</div>
                        <div class="nina-checkbox-group">
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-alert" checked>
                                <label for="filter-alert">Aktive Warnungen</label>
                            </div>
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-update" checked>
                                <label for="filter-update">Updates</label>
                            </div>
                            <div class="nina-checkbox">
                                <input type="checkbox" id="filter-cancel">
                                <label for="filter-cancel">Entwarnungen</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="nina-warnings-content" class="nina-loading">
                    <div>Verbinde mit NINA API...</div>
                </div>
            </div>
        `;

        setupEventListeners();
    }

    function setupEventListeners() {
        const refreshBtn = document.getElementById('nina-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', loadNINAWarnings);
        }

        const showMarkersCheckbox = document.getElementById('show-markers-checkbox');
        if (showMarkersCheckbox) {
            showMarkersCheckbox.addEventListener('change', toggleMapMarkers);
        }

        const showPolygonsCheckbox = document.getElementById('show-polygons-checkbox');
        if (showPolygonsCheckbox) {
            showPolygonsCheckbox.addEventListener('change', toggleMapPolygons);
        }

        // Alle Filter-Event-Listener
        ['mowas', 'dwd', 'katwarn', 'biwapp', 'lhp'].forEach(source => {
            const checkbox = document.getElementById(`filter-${source}`);
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    NINA_DATA.activeFilters.sources[source] = checkbox.checked;
                    applyFilters();
                });
            }
        });

        ['extreme', 'severe', 'moderate', 'minor', 'unknown'].forEach(severity => {
            const checkbox = document.getElementById(`filter-${severity}`);
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    NINA_DATA.activeFilters.severities[severity] = checkbox.checked;
                    applyFilters();
                });
            }
        });

        ['alert', 'update', 'cancel'].forEach(type => {
            const checkbox = document.getElementById(`filter-${type}`);
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    NINA_DATA.activeFilters.types[type] = checkbox.checked;
                    applyFilters();
                });
            }
        });
    }

    function loadNINAWarnings() {
        console.log('NINA: Lade Warnungen...');
        updateStats('Lade Warnungen...');

        const sources = ['mowas', 'biwapp', 'katwarn', 'dwd', 'lhp'];
        let allWarnings = [];
        let loadedCount = 0;

        sources.forEach(source => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://warnung.bund.de/api31/${source}/mapData.json`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && Array.isArray(data) && data.length > 0) {
                            console.log(`NINA: Gefunden ${data.length} Warnungen von ${source}`);
                            data.forEach(warning => warning.source = source);
                            allWarnings = allWarnings.concat(data);
                        }
                    } catch (e) {
                        console.warn(`NINA: Fehler beim Laden von ${source}:`, e);
                    }

                    loadedCount++;
                    if (loadedCount === sources.length) {
                        console.log(`NINA: Insgesamt ${allWarnings.length} Warnungen geladen`);
                        processWarnings(allWarnings);
                    }
                },
                onerror: function(error) {
                    console.error(`NINA: Fehler beim Laden von ${source}:`, error);
                    loadedCount++;
                    if (loadedCount === sources.length) {
                        processWarnings(allWarnings);
                    }
                }
            });
        });
    }

    function processWarnings(warnings) {
        console.log('NINA: Verarbeite', warnings.length, 'Warnungen');

        warnings.sort((a, b) => {
            const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
            const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
            return dateB - dateA;
        });

        NINA_DATA.warnings = warnings;
        updateDisplay(warnings);
    }

    function applyFilters() {
        const filteredWarnings = NINA_DATA.warnings.filter(warning => {
            const source = warning.source || 'unknown';
            const severity = (warning.severity || 'unknown').toLowerCase();
            const type = (warning.type || 'Alert').toLowerCase();

            return NINA_DATA.activeFilters.sources[source] &&
                   NINA_DATA.activeFilters.severities[severity] &&
                   NINA_DATA.activeFilters.types[type];
        });

        updateDisplay(filteredWarnings);
    }

    function updateDisplay(warnings) {
        clearMarkers();
        clearPolygons();

        const showMarkersCheckbox = document.getElementById('show-markers-checkbox');
        const showPolygonsCheckbox = document.getElementById('show-polygons-checkbox');

        if (showMarkersCheckbox && showMarkersCheckbox.checked) {
            addMarkersToMap(warnings);
        }
        if (showPolygonsCheckbox && showPolygonsCheckbox.checked) {
            addPolygonsToMap(warnings);
        }
        updateTabContent(warnings);
    }

    function clearMarkers() {
        try {
            const ninaLayer = W.map.getOLMap().getLayersByName('ninaLayer')[0];
            if (ninaLayer) {
                ninaLayer.clearMarkers();
            }
        } catch (e) {
            console.warn('NINA: Fehler beim Entfernen der Marker:', e);
        }
    }

    function clearPolygons() {
        try {
            const ninaPolygonLayer = W.map.getOLMap().getLayersByName('ninaPolygonLayer')[0];
            if (ninaPolygonLayer) {
                ninaPolygonLayer.removeAllFeatures();
            }
        } catch (e) {
            console.warn('NINA: Fehler beim Entfernen der Polygone:', e);
        }
    }

    function addMarkersToMap(warnings) {
        // Nur hinzufügen wenn Checkbox aktiviert ist
        const showMarkersCheckbox = document.getElementById('show-markers-checkbox');
        const showMarkers = showMarkersCheckbox ? showMarkersCheckbox.checked : true;

        if (!showMarkers || !W.map) return;

        try {
            let ninaLayer = W.map.getOLMap().getLayersByName('ninaLayer')[0];
            if (!ninaLayer) {
                ninaLayer = new OpenLayers.Layer.Markers('ninaLayer');
                W.map.getOLMap().addLayer(ninaLayer);
            }

            const locations = [
                [52.5200, 13.4050], [48.1351, 11.5820], [53.5511, 9.9937], [50.9375, 6.9603],
                [50.1109, 8.6821], [48.7758, 9.1829], [51.2277, 6.7735], [51.0504, 13.7373]
            ];

            warnings.forEach((warning, index) => {
                const [lat, lon] = locations[index % locations.length];
                warning.demoCoords = { lat, lon };

                try {
                    const lonLat = new OpenLayers.LonLat(lon, lat).transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        W.map.getOLMap().getProjectionObject()
                    );

                    const iconUrl = getWarningIcon(warning);
                    const size = new OpenLayers.Size(24, 24);
                    const offset = new OpenLayers.Pixel(-12, -12);
                    const icon = new OpenLayers.Icon(iconUrl, size, offset);
                    const marker = new OpenLayers.Marker(lonLat, icon);

                    marker.events.register('click', marker, function() {
                        showWarningDetails(warning);
                    });

                    ninaLayer.addMarker(marker);
                } catch (e) {
                    console.error('NINA: Fehler beim Erstellen von Marker:', e);
                }
            });
        } catch (e) {
            console.error('NINA: Fehler beim Hinzufügen der Marker:', e);
        }
    }

    function getWarningIcon(warning) {
        let color = '#ff6b35';
        if (warning.severity) {
            switch(warning.severity.toLowerCase()) {
                case 'extreme': color = '#8B0000'; break;
                case 'severe': color = '#FF0000'; break;
                case 'moderate': color = '#FF8C00'; break;
                case 'minor': color = '#FFD700'; break;
            }
        }

        let symbol = '!';
        if (warning.source) {
            switch(warning.source) {
                case 'dwd': symbol = 'W'; break;
                case 'mowas': symbol = '!'; break;
                case 'katwarn': symbol = 'K'; break;
                case 'biwapp': symbol = 'B'; break;
                case 'lhp': symbol = 'H'; break;
            }
        }

        const svgContent = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="${color}" stroke="#ffffff" stroke-width="2"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold" font-family="Arial">${symbol}</text>
        </svg>`;

        try {
            return `data:image/svg+xml;base64,${btoa(svgContent)}`;
        } catch (e) {
            return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
        }
    }

    function updateTabContent(warnings) {
        updateStats();

        const content = document.getElementById('nina-warnings-content');
        if (!content) return;

        if (!warnings || warnings.length === 0) {
            content.innerHTML = `
                <div class="nina-empty">
                    <div style="font-size: 2em; margin-bottom: 10px;">✓</div>
                    <div style="font-weight: bold; margin-bottom: 5px;">Keine aktuellen Warnungen</div>
                    <div style="font-size: 0.9em;">Alle Systeme normal</div>
                </div>
            `;
            return;
        }

        const warningsHtml = warnings.map((warning, index) => {
            const title = warning.i18nTitle?.de || warning.headline || warning.title || 'Warnung';
            const source = warning.source || 'Unbekannt';
            const severity = warning.severity || 'Unbekannt';
            const urgency = warning.urgency || '';
            const type = warning.type || 'Alert';
            const isCancel = type === 'Cancel';

            // Zeitinformationen formatieren
            const startDate = warning.startDate ? new Date(warning.startDate).toLocaleString('de-DE') : '';
            const expiresDate = warning.expiresDate ? new Date(warning.expiresDate).toLocaleString('de-DE') : '';
            const ageHours = warning.startDate ? Math.floor((Date.now() - new Date(warning.startDate)) / (1000 * 60 * 60)) : 0;
            const ageText = ageHours < 1 ? 'Neu' : ageHours < 24 ? `${ageHours}h alt` : `${Math.floor(ageHours / 24)}d alt`;

            return `
                <div class="nina-warning" data-warning-index="${index}" style="${isCancel ? 'opacity: 0.6; border-left-color: #95a5a6;' : ''}">
                    <div class="nina-warning-title">
                        ${isCancel ? 'Entwarnung: ' : ''}${title}
                        <button class="nina-goto-btn" data-goto-index="${index}">Zur Karte</button>
                    </div>
                                            <div class="nina-warning-meta">
                        Quelle: ${source.toUpperCase()}<span class="nina-source-badge">${getSourceSymbol(source)}</span>
                        <br>Alter: ${ageText}
                        ${startDate ? `<br>Gueltig seit: ${startDate}` : ''}
                        ${expiresDate ? `<br>Gueltig bis: ${expiresDate}` : ''}
                    </div>
                    <div>
                        <span class="nina-warning-type" style="background: ${getSeverityColor(severity)}">${severity}</span>
                        ${urgency ? `<span class="nina-warning-type" style="background: #e74c3c; margin-left: 5px;">${urgency}</span>` : ''}
                        ${isCancel ? '<span class="nina-warning-type" style="background: #27ae60; margin-left: 5px;">Entwarnung</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');

        content.innerHTML = warningsHtml;

        content.querySelectorAll('.nina-warning').forEach(warningEl => {
            const index = parseInt(warningEl.dataset.warningIndex);
            warningEl.addEventListener('click', () => showWarningDetails(NINA_DATA.warnings[index]));
        });

        content.querySelectorAll('.nina-goto-btn').forEach(btn => {
            const index = parseInt(btn.dataset.gotoIndex);
            btn.addEventListener('click', (event) => {
                event.stopPropagation();
                gotoWarning(index);
            });
        });
    }

    function getSourceSymbol(source) {
        switch(source) {
            case 'dwd': return 'W';
            case 'mowas': return '!';
            case 'katwarn': return 'K';
            case 'biwapp': return 'B';
            case 'lhp': return 'H';
            default: return '?';
        }
    }

    function getSeverityColor(severity) {
        switch(severity?.toLowerCase()) {
            case 'extreme': return '#8B0000';
            case 'severe': return '#FF0000';
            case 'moderate': return '#FF8C00';
            case 'minor': return '#FFD700';
            default: return '#ff6b35';
        }
    }

    function translateSeverity(severity) {
        switch(severity?.toLowerCase()) {
            case 'extreme': return 'Extrem';
            case 'severe': return 'Schwer';
            case 'moderate': return 'Mittel';
            case 'minor': return 'Gering';
            case 'unknown': return 'Unbekannt';
            default: return severity || 'Unbekannt';
        }
    }

    function translateUrgency(urgency) {
        switch(urgency?.toLowerCase()) {
            case 'immediate': return 'Sofort';
            case 'expected': return 'Erwartet';
            case 'future': return 'Zukunft';
            case 'past': return 'Vergangen';
            case 'unknown': return 'Unbekannt';
            default: return urgency || '';
        }
    }

    function translateType(type) {
        switch(type?.toLowerCase()) {
            case 'alert': return 'Warnung';
            case 'update': return 'Update';
            case 'cancel': return 'Entwarnung';
            case 'test': return 'Test';
            default: return type || 'Warnung';
        }
    }

    function updateStats(message) {
        const statsEl = document.getElementById('nina-stats');
        if (!statsEl) return;

        if (typeof message === 'string') {
            statsEl.innerHTML = message;
        } else {
            const total = NINA_DATA.warnings.length;

            // Gefilterte Anzahl berechnen
            const filteredCount = NINA_DATA.warnings.filter(warning => {
                const source = warning.source || 'unknown';
                const severity = (warning.severity || 'unknown').toLowerCase();
                const type = (warning.type || 'Alert').toLowerCase();

                return NINA_DATA.activeFilters.sources[source] &&
                       NINA_DATA.activeFilters.severities[severity] &&
                       NINA_DATA.activeFilters.types[type];
            }).length;

            const sources = {};
            NINA_DATA.warnings.forEach(w => {
                sources[w.source] = (sources[w.source] || 0) + 1;
            });

            const sourceStats = Object.entries(sources)
                .map(([source, count]) => `${source.toUpperCase()}: ${count}`)
                .join(' | ');

            const filterInfo = filteredCount < total ? ` | Gefiltert: ${filteredCount}` : '';

            statsEl.innerHTML = `Gesamt: <strong>${total}</strong> Warnungen${filterInfo} | ${sourceStats} | ${new Date().toLocaleTimeString('de-DE')}`;
        }
    }

    function showWarningDetails(warning) {
        if (!warning) return;

        const title = warning.i18nTitle?.de || warning.headline || warning.title || 'Warnung';
        const description = warning.description || warning.info?.[0]?.description || 'Keine Details verfügbar';
        const source = warning.source ? warning.source.toUpperCase() : 'Unbekannte Quelle';
        const severity = translateSeverity(warning.severity);
        const urgency = translateUrgency(warning.urgency);
        const type = warning.type || 'Alert';
        const startDate = warning.startDate ? new Date(warning.startDate).toLocaleString('de-DE') : 'Unbekannt';
        const expiresDate = warning.expiresDate ? new Date(warning.expiresDate).toLocaleString('de-DE') : 'Unbekannt';

        const isCancel = type === 'Cancel';
        const statusText = isCancel ? 'ENTWARNUNG' : 'AKTIVE WARNUNG';

        const detailText = `${statusText}

${title}

Quelle: ${source}
Schweregrad: ${severity}
Dringlichkeit: ${urgency}

Gueltig seit: ${startDate}
Gueltig bis: ${expiresDate}

Details:
${description}`;

        alert(detailText);
    }

    function gotoWarning(index) {
        const warning = NINA_DATA.warnings[index];
        if (!warning || !warning.demoCoords || !W.map) return;

        const { lat, lon } = warning.demoCoords;

        try {
            const lonLat = new OpenLayers.LonLat(lon, lat).transform(
                new OpenLayers.Projection("EPSG:4326"),
                W.map.getOLMap().getProjectionObject()
            );

            W.map.getOLMap().setCenter(lonLat);

            if (W.map.getOLMap().getZoom() < 5) {
                W.map.getOLMap().zoomTo(5);
            }

            console.log(`NINA: Springe zur Warnung: ${warning.i18nTitle?.de || warning.id}`);
        } catch (e) {
            console.error('NINA: Fehler beim Navigieren:', e);
        }
    }

    function toggleMapPolygons() {
        const checkbox = document.getElementById('show-polygons-checkbox');
        const showPolygons = checkbox ? checkbox.checked : true;

        if (showPolygons) {
            console.log('NINA: Aktiviere Warngebiets-Polygone');
            // Lade aktuelle Warnungen neu
            loadNINAWarnings();
        } else {
            console.log('NINA: Deaktiviere Warngebiets-Polygone');
            clearPolygons();
        }
    }

    function toggleMapMarkers() {
        const checkbox = document.getElementById('show-markers-checkbox');
        const showMarkers = checkbox ? checkbox.checked : true;

        if (showMarkers) {
            console.log('NINA: Aktiviere Karten-Marker');
            // Lade aktuelle Warnungen neu
            loadNINAWarnings();
        } else {
            console.log('NINA: Deaktiviere Karten-Marker');
            clearMarkers();
        }
    }

    // Script starten
    console.log('NINA: Script gestartet');
    waitForWME(initNINAScript);

})();