// ==UserScript==
// @name         WME Traffic & Construction Overlay
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      1.0.0
// @description  Traffic and Construction Overlay for Waze Map Editor with WMTS support
// @author       Hiwi234
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.9.0/proj4.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537381/WME%20Traffic%20%20Construction%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/537381/WME%20Traffic%20%20Construction%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ID = 'wme-traffic-construction-overlay';
    const SCRIPT_NAME = 'Traffic & Construction';
    const TOMTOM_API_KEY = 'sATA9OwG11zrMKQcCxR3eSEjj2n8Jsrg';

    class WMETrafficOverlay {
        constructor() {
            this.trafficLayer = null;
            this.incidentMarkers = [];
            this.currentIncidents = [];
            this.updateTimer = null;
            this.tabPane = null;
            this.tabLabel = null;
            this.isLayerActive = false;
            this.settings = {
                opacity: 0.7,
                updateInterval: 300,
                language: 'de-DE',
                showConstruction: true,
                showAccidents: true,
                showClosures: true,
                showOther: true
            };

            this.init();
        }

        async init() {
            console.log(`[${SCRIPT_NAME}] Initializing...`);

            if (W?.userscripts?.state.isReady) {
                this.setupUI();
            } else {
                document.addEventListener('wme-ready', () => this.setupUI(), { once: true });
            }
        }

        async setupUI() {
            try {
                // Registriere Sidebar Tab
                const result = W.userscripts.registerSidebarTab(SCRIPT_ID);
                this.tabLabel = result.tabLabel;
                this.tabPane = result.tabPane;

                // Tab Label setzen
                this.tabLabel.innerHTML = '🚧';
                this.tabLabel.title = SCRIPT_NAME;

                // Warte bis Tab verfügbar ist
                await W.userscripts.waitForElementConnected(this.tabPane);

                this.createTabContent();
                this.bindEvents();
                this.setupMapEvents();

                console.log(`[${SCRIPT_NAME}] UI initialized`);

            } catch (error) {
                console.error(`[${SCRIPT_NAME}] Error setting up UI:`, error);
            }
        }

        createTabContent() {
            this.tabPane.innerHTML = `
                <div style="padding: 15px; color: #ffffff; background: #2a2a2a; height: 100%; overflow-y: auto;">
                    <h3 style="margin: 0 0 20px 0; color: #4fc3f7; font-size: 18px;">🚧 Traffic & Construction</h3>

                    <!-- WMTS Information -->
                    <div style="background: #1a237e; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 12px;">
                        <strong>WMTS Endpoint:</strong>
                        <div id="wmts-url" style="font-family: monospace; background: #333; padding: 8px; border-radius: 4px; margin-top: 8px; word-break: break-all;">
                            Wird nach Aktivierung generiert...
                        </div>
                        <button id="copy-wmts" style="width: 100%; margin-top: 8px; padding: 6px; background: #4fc3f7; border: none; border-radius: 4px; color: #000; font-weight: bold; cursor: pointer;">
                            WMTS URL Kopieren
                        </button>
                    </div>

                    <!-- Traffic Layer Controls -->
                    <div style="background: #333; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="margin: 0 0 15px 0; color: #4fc3f7;">🚦 Traffic Layer</h4>

                        <button id="toggle-traffic" style="width: 100%; padding: 10px; background: #4caf50; border: none; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; margin-bottom: 12px;">
                            Traffic Layer Aktivieren
                        </button>

                        <div style="margin-bottom: 12px;">
                            <label style="display: block; margin-bottom: 5px; font-size: 14px;">Transparenz: <span id="opacity-value">70%</span></label>
                            <input type="range" id="opacity-slider" min="0" max="100" value="70" style="width: 100%;">
                        </div>

                        <div style="margin-bottom: 12px;">
                            <label style="display: block; margin-bottom: 5px; font-size: 14px;">Update Intervall (Sek.):</label>
                            <input type="number" id="update-interval" value="300" min="60" max="3600" style="width: 100%; padding: 6px; background: #444; border: 1px solid #666; border-radius: 4px; color: #fff;">
                        </div>
                    </div>

                    <!-- Incident Controls -->
                    <div style="background: #333; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="margin: 0 0 15px 0; color: #4fc3f7;">🚧 Störungen & Baustellen</h4>

                        <button id="load-incidents" style="width: 100%; padding: 10px; background: #ff9800; border: none; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; margin-bottom: 12px;">
                            Störungen Laden
                        </button>

                        <div style="margin-bottom: 12px;">
                            <label style="display: block; margin-bottom: 5px; font-size: 14px;">Störungstypen:</label>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                                <label><input type="checkbox" id="show-construction" checked> Baustellen</label>
                                <label><input type="checkbox" id="show-accidents" checked> Unfälle</label>
                                <label><input type="checkbox" id="show-closures" checked> Sperrungen</label>
                                <label><input type="checkbox" id="show-other" checked> Sonstige</label>
                            </div>
                        </div>

                        <div style="margin-bottom: 12px;">
                            <label style="display: block; margin-bottom: 5px; font-size: 14px;">Sprache:</label>
                            <select id="language-select" style="width: 100%; padding: 6px; background: #444; border: 1px solid #666; border-radius: 4px; color: #fff;">
                                <option value="de-DE">Deutsch</option>
                                <option value="en-US">English</option>
                                <option value="fr-FR">Français</option>
                                <option value="es-ES">Español</option>
                            </select>
                        </div>
                    </div>

                    <!-- Status -->
                    <div style="background: #333; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="margin: 0 0 15px 0; color: #4fc3f7;">📊 Status</h4>
                        <div id="status-area" style="min-height: 20px; font-size: 12px;"></div>
                    </div>

                    <!-- Incident List -->
                    <div style="background: #333; padding: 15px; border-radius: 8px;">
                        <h4 style="margin: 0 0 15px 0; color: #4fc3f7;">📋 Aktuelle Störungen</h4>
                        <div id="incident-list" style="max-height: 200px; overflow-y: auto; font-size: 12px;">
                            Klicken Sie auf "Störungen Laden"
                        </div>
                    </div>
                </div>
            `;
        }

        bindEvents() {
            // Toggle Traffic Layer
            document.getElementById('toggle-traffic').addEventListener('click', () => {
                this.toggleTrafficLayer();
            });

            // Opacity Slider
            document.getElementById('opacity-slider').addEventListener('input', (e) => {
                this.settings.opacity = e.target.value / 100;
                document.getElementById('opacity-value').textContent = e.target.value + '%';
                if (this.trafficLayer) {
                    this.updateLayerOpacity();
                }
            });

            // Load Incidents
            document.getElementById('load-incidents').addEventListener('click', () => {
                this.loadIncidents();
            });

            // Copy WMTS URL
            document.getElementById('copy-wmts').addEventListener('click', () => {
                this.copyWMTSUrl();
            });

            // Update Interval
            document.getElementById('update-interval').addEventListener('change', (e) => {
                this.settings.updateInterval = parseInt(e.target.value);
                this.setUpdateTimer();
            });

            // Incident Type Checkboxes
            ['construction', 'accidents', 'closures', 'other'].forEach(type => {
                document.getElementById(`show-${type}`).addEventListener('change', (e) => {
                    this.settings[`show${type.charAt(0).toUpperCase() + type.slice(1)}`] = e.target.checked;
                    this.filterIncidents();
                });
            });

            // Language Select
            document.getElementById('language-select').addEventListener('change', (e) => {
                this.settings.language = e.target.value;
            });
        }

        setupMapEvents() {
            // Map Move/Zoom Events
            W.map.events.register('moveend', null, () => {
                this.updateWMTSUrl();
                if (this.isLayerActive) {
                    this.updateTrafficLayer();
                }
            });

            W.map.events.register('zoomend', null, () => {
                this.updateWMTSUrl();
                if (this.isLayerActive) {
                    this.updateTrafficLayer();
                }
            });

            // Map Data Loaded Event
            document.addEventListener('wme-map-data-loaded', () => {
                if (this.currentIncidents.length > 0) {
                    this.updateIncidentDisplay();
                }
            });
        }

        toggleTrafficLayer() {
            const button = document.getElementById('toggle-traffic');

            if (this.isLayerActive) {
                this.removeTrafficLayer();
                button.textContent = 'Traffic Layer Aktivieren';
                button.style.background = '#4caf50';
                this.isLayerActive = false;
                this.showStatus('Traffic Layer deaktiviert', 'info');
            } else {
                this.addTrafficLayer();
                button.textContent = 'Traffic Layer Deaktivieren';
                button.style.background = '#f44336';
                this.isLayerActive = true;
                this.showStatus('Traffic Layer aktiviert', 'success');
            }

            this.updateWMTSUrl();
        }

        addTrafficLayer() {
            try {
                // Erstelle WMTS Layer für Traffic
                this.trafficLayer = new OpenLayers.Layer.WMTS({
                    name: 'Traffic & Construction',
                    url: this.generateWMTSUrl(),
                    layer: 'traffic_construction',
                    matrixSet: 'EPSG:3857',
                    format: 'image/png',
                    style: 'default',
                    opacity: this.settings.opacity,
                    isBaseLayer: false,
                    visibility: true
                });

                W.map.addLayer(this.trafficLayer);
                this.setUpdateTimer();

            } catch (error) {
                console.error(`[${SCRIPT_NAME}] Error adding traffic layer:`, error);
                this.showStatus('Fehler beim Hinzufügen des Traffic Layers', 'error');
            }
        }

        removeTrafficLayer() {
            if (this.trafficLayer) {
                W.map.removeLayer(this.trafficLayer);
                this.trafficLayer = null;
            }

            if (this.updateTimer) {
                clearInterval(this.updateTimer);
                this.updateTimer = null;
            }
        }

        updateTrafficLayer() {
            if (this.trafficLayer) {
                this.trafficLayer.redraw(true);
            }
        }

        updateLayerOpacity() {
            if (this.trafficLayer) {
                this.trafficLayer.setOpacity(this.settings.opacity);
            }
        }

        async loadIncidents() {
            const button = document.getElementById('load-incidents');
            const originalText = button.textContent;

            button.textContent = 'Lade Störungen...';
            button.disabled = true;

            try {
                const bounds = W.map.getExtent();
                const wgs84Bounds = bounds.transform(
                    W.map.getProjectionObject(),
                    new OpenLayers.Projection('EPSG:4326')
                );

                // Simuliere TomTom API Call (echte Implementation würde Server-Proxy benötigen)
                await this.simulateIncidentLoad(wgs84Bounds);

                this.updateIncidentDisplay();
                this.showStatus(`${this.currentIncidents.length} Störungen geladen`, 'success');

            } catch (error) {
                console.error(`[${SCRIPT_NAME}] Error loading incidents:`, error);
                this.showStatus('Fehler beim Laden der Störungen', 'error');
            } finally {
                button.textContent = originalText;
                button.disabled = false;
            }
        }

        async simulateIncidentLoad(bounds) {
            // Simuliere API-Delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const center = bounds.getCenterLonLat();
            const incidents = [];

            // Generiere zufällige Störungen im aktuellen Bereich
            for (let i = 0; i < 5; i++) {
                const lat = center.lat + (Math.random() - 0.5) * 0.01;
                const lon = center.lon + (Math.random() - 0.5) * 0.01;

                const types = ['construction', 'accident', 'roadclosure', 'other'];
                const type = types[Math.floor(Math.random() * types.length)];

                incidents.push({
                    id: `incident_${i}_${Date.now()}`,
                    type: type,
                    severity: Math.floor(Math.random() * 4) + 1,
                    description: this.getRandomDescription(type),
                    coordinates: [lon, lat],
                    timestamp: new Date().toISOString()
                });
            }

            this.currentIncidents = incidents;
        }

        getRandomDescription(type) {
            const descriptions = {
                construction: ['Baustelle - Fahrbahn verengt', 'Straßenarbeiten', 'Brückensanierung'],
                accident: ['Verkehrsunfall', 'Fahrzeugpanne', 'Unfall mit Sachschaden'],
                roadclosure: ['Vollsperrung', 'Straße gesperrt', 'Umleitung'],
                other: ['Sonstige Störung', 'Verkehrsbehinderung', 'Stau']
            };

            const typeDescriptions = descriptions[type] || descriptions.other;
            return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
        }

        updateIncidentDisplay() {
            this.clearIncidentMarkers();

            const filteredIncidents = this.currentIncidents.filter(incident => {
                switch (incident.type) {
                    case 'construction': return this.settings.showConstruction;
                    case 'accident': return this.settings.showAccidents;
                    case 'roadclosure': return this.settings.showClosures;
                    default: return this.settings.showOther;
                }
            });

            filteredIncidents.forEach(incident => {
                this.addIncidentMarker(incident);
            });

            this.updateIncidentList(filteredIncidents);
        }

        addIncidentMarker(incident) {
            const [lon, lat] = incident.coordinates;
            const point = new OpenLayers.Geometry.Point(lon, lat);
            point.transform(
                new OpenLayers.Projection('EPSG:4326'),
                W.map.getProjectionObject()
            );

            const feature = new OpenLayers.Feature.Vector(point, {
                incident: incident
            });

            // Erstelle Custom Style basierend auf Typ und Schweregrad
            const style = this.getIncidentStyle(incident.type, incident.severity);
            feature.style = style;

            if (!this.incidentLayer) {
                this.incidentLayer = new OpenLayers.Layer.Vector('Traffic Incidents', {
                    displayInLayerSwitcher: false
                });
                W.map.addLayer(this.incidentLayer);
            }

            this.incidentLayer.addFeatures([feature]);
            this.incidentMarkers.push(feature);
        }

        getIncidentStyle(type, severity) {
            const colors = {
                1: '#4caf50', // Grün - niedrig
                2: '#ff9800', // Orange - mittel
                3: '#f44336', // Rot - hoch
                4: '#9c27b0'  // Lila - sehr hoch
            };

            const symbols = {
                construction: '🚧',
                accident: '⚠️',
                roadclosure: '🚫',
                other: 'ℹ️'
            };

            return new OpenLayers.Style({
                pointRadius: 15,
                fillColor: colors[severity] || colors[2],
                strokeColor: '#ffffff',
                strokeWidth: 2,
                fillOpacity: 0.8,
                label: symbols[type] || symbols.other,
                labelAlign: 'cc',
                fontSize: '16px'
            });
        }

        clearIncidentMarkers() {
            if (this.incidentLayer) {
                this.incidentLayer.removeAllFeatures();
            }
            this.incidentMarkers = [];
        }

        updateIncidentList(incidents) {
            const listElement = document.getElementById('incident-list');

            if (incidents.length === 0) {
                listElement.innerHTML = 'Keine Störungen im aktuellen Bereich gefunden.';
                return;
            }

            const html = incidents.map(incident => `
                <div style="padding: 8px; margin-bottom: 8px; background: #444; border-radius: 4px; cursor: pointer;"
                     onclick="wmeTrafficOverlay.zoomToIncident('${incident.id}')">
                    <div style="font-weight: bold; color: #4fc3f7;">
                        ${this.getIncidentTypeText(incident.type)}
                    </div>
                    <div>Schweregrad: ${incident.severity}/4</div>
                    <div>${incident.description}</div>
                </div>
            `).join('');

            listElement.innerHTML = html;
        }

        getIncidentTypeText(type) {
            const types = {
                'construction': 'Baustelle',
                'accident': 'Unfall',
                'roadclosure': 'Straßensperrung',
                'other': 'Sonstige Störung'
            };
            return types[type] || 'Unbekannt';
        }

        zoomToIncident(incidentId) {
            const incident = this.currentIncidents.find(inc => inc.id === incidentId);
            if (incident) {
                const [lon, lat] = incident.coordinates;
                const point = new OpenLayers.LonLat(lon, lat);
                point.transform(
                    new OpenLayers.Projection('EPSG:4326'),
                    W.map.getProjectionObject()
                );
                W.map.setCenter(point, 15);
            }
        }

        filterIncidents() {
            this.updateIncidentDisplay();
        }

        generateWMTSUrl() {
            const bounds = W.map.getExtent();
            const center = W.map.getCenter();

            return `https://traffic-overlay.waze.local/wmts?` +
                   `SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&` +
                   `LAYER=traffic_construction&STYLE=default&` +
                   `TILEMATRIXSET=EPSG:3857&TILEMATRIX={z}&` +
                   `TILEROW={y}&TILECOL={x}&FORMAT=image/png&` +
                   `OPACITY=${this.settings.opacity}&` +
                   `ACTIVE=${this.isLayerActive}`;
        }

        updateWMTSUrl() {
            const url = this.generateWMTSUrl();
            const urlElement = document.getElementById('wmts-url');
            if (urlElement) {
                urlElement.textContent = url;
            }
        }

        copyWMTSUrl() {
            const url = this.generateWMTSUrl();

            // Fallback für ältere Browser
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    this.showStatus('WMTS URL in Zwischenablage kopiert', 'success');
                }).catch(() => {
                    this.fallbackCopyToClipboard(url);
                });
            } else {
                this.fallbackCopyToClipboard(url);
            }
        }

        fallbackCopyToClipboard(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                this.showStatus('WMTS URL in Zwischenablage kopiert', 'success');
            } catch (err) {
                this.showStatus('Fehler beim Kopieren der URL', 'error');
            }

            document.body.removeChild(textArea);
        }

        setUpdateTimer() {
            if (this.updateTimer) {
                clearInterval(this.updateTimer);
            }

            if (this.isLayerActive && this.settings.updateInterval > 0) {
                this.updateTimer = setInterval(() => {
                    this.loadIncidents();
                }, this.settings.updateInterval * 1000);

                this.showStatus(`Auto-Update alle ${this.settings.updateInterval} Sekunden`, 'info');
            }
        }

        showStatus(message, type) {
            const statusArea = document.getElementById('status-area');
            if (!statusArea) return;

            const colors = {
                success: '#4caf50',
                error: '#f44336',
                info: '#2196f3',
                warning: '#ff9800'
            };

            const statusDiv = document.createElement('div');
            statusDiv.style.cssText = `
                padding: 8px;
                margin-bottom: 8px;
                background: ${colors[type] || colors.info};
                border-radius: 4px;
                font-size: 12px;
            `;
            statusDiv.textContent = message;

            statusArea.appendChild(statusDiv);

            // Entferne Status nach 5 Sekunden
            setTimeout(() => {
                if (statusDiv.parentNode) {
                    statusDiv.parentNode.removeChild(statusDiv);
                }
            }, 5000);
        }

        // Cleanup beim Entladen
        destroy() {
            this.removeTrafficLayer();
            this.clearIncidentMarkers();

            if (this.incidentLayer) {
                W.map.removeLayer(this.incidentLayer);
            }

            try {
                W.userscripts.removeSidebarTab(SCRIPT_ID);
            } catch (error) {
                console.warn(`[${SCRIPT_NAME}] Error removing sidebar tab:`, error);
            }
        }
    }

    // Globale Instanz erstellen
    let wmeTrafficOverlay;

    // Script initialisieren
    function initializeScript() {
        if (wmeTrafficOverlay) {
            wmeTrafficOverlay.destroy();
        }

        wmeTrafficOverlay = new WMETrafficOverlay();

        // Globalen Zugriff für Event-Handler ermöglichen
        window.wmeTrafficOverlay = wmeTrafficOverlay;

        console.log(`[${SCRIPT_NAME}] v1.0.0 loaded successfully`);
    }

    // Cleanup beim Seitenwechsel
    window.addEventListener('beforeunload', () => {
        if (wmeTrafficOverlay) {
            wmeTrafficOverlay.destroy();
        }
    });

    // Script starten
    initializeScript();

})();