// ==UserScript==
// @name         WME Lookaround
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2025.11.17
// @description  Integriert Apple Lookaround direkt in den Waze Map Editor
// @author       Hiwi234
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537929/WME%20Lookaround.user.js
// @updateURL https://update.greasyfork.org/scripts/537929/WME%20Lookaround.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ID = 'wme-lookaround-integration';
    const SCRIPT_NAME = 'WME Lookaround';

    let tabLabel, tabPane;
    let currentLat = null;
    let currentLon = null;
    let mapClickHandler = null;
    let overlayWindow = null;
    let crosshairStyleElement = null;

    // Koordinaten-Transformation (Web Mercator zu WGS84) - Verbesserte Version
    function webMercatorToWGS84(x, y) {
        // Korrigierte Transformation für WME-Koordinaten
        const lon = (x * 180) / 20037508.342789244;
        let lat = (y * 180) / 20037508.342789244;

        // Korrekte Mercator-Umkehrung
        lat = (Math.atan(Math.exp(lat * (Math.PI / 180))) * 360) / Math.PI - 90;

        return { lat: lat, lon: lon };
    }

    // Apple Lookaround Coverage Overlay - Mit echten Coverage-Daten
    function createLookaroundOverlay() {
        if (coverageLayer) {
            // Toggle: Wenn bereits aktiv, entfernen
            W.map.removeLayer(coverageLayer);
            coverageLayer = null;
            console.log('Lookaround coverage overlay removed');
            return false;
        }

        try {
            console.log('Creating Lookaround coverage overlay with real data...');

            // Erstelle Vector Layer mit Styling
            coverageLayer = new OpenLayers.Layer.Vector("Apple Lookaround Coverage", {
                displayInLayerSwitcher: false,
                styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        fillColor: "#1E90FF",      // Blaue Füllung für Lookaround
                        fillOpacity: 0.25,
                        strokeColor: "#0066CC",
                        strokeWidth: 1,
                        strokeOpacity: 0.8
                    })
                })
            });

            // Lade echte Coverage-Daten
            loadRealCoverageData();

            return true;

        } catch (error) {
            console.log('Error creating Lookaround overlay:', error);
            return false;
        }
    }

    // Lade echte Apple Lookaround Coverage-Daten
    function loadRealCoverageData() {
        // URL zu den echten Coverage-Daten (basierend auf sk-zk Projekt)
        const coverageDataUrl = 'https://raw.githubusercontent.com/sk-zk/lookaround-map/main/coverage-data/coverage.json';

        try {
            fetch(coverageDataUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Coverage data not available, using fallback');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Real coverage data loaded:', data);
                    processCoverageData(data);
                })
                .catch(error => {
                    console.log('Could not load real coverage data:', error);
                    // Fallback zu bekannten Städten mit echten Lookaround-Daten
                    loadKnownLookaroundCities();
                });
        } catch (fetchError) {
            console.log('Fetch not available, using fallback data');
            loadKnownLookaroundCities();
        }
    }

    // Verarbeite echte Coverage-Daten
    function processCoverageData(data) {
        if (data.features) {
            data.features.forEach(feature => {
                try {
                    const geometry = feature.geometry;
                    if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
                        const olFeature = createFeatureFromGeoJSON(geometry);
                        if (olFeature) {
                            coverageLayer.addFeatures([olFeature]);
                        }
                    }
                } catch (featureError) {
                    console.log('Error processing feature:', featureError);
                }
            });
        }

        W.map.addLayer(coverageLayer);
        console.log('Real coverage data overlay created');
    }

    // Konvertiere GeoJSON zu OpenLayers Feature
    function createFeatureFromGeoJSON(geometry) {
        try {
            const format = new OpenLayers.Format.GeoJSON();
            const feature = format.read({
                type: "Feature",
                geometry: geometry
            });

            if (feature && feature[0]) {
                // Transformiere Koordinaten
                feature[0].geometry.transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    W.map.getProjectionObject()
                );
                return feature[0];
            }
        } catch (conversionError) {
            console.log('Error converting GeoJSON:', conversionError);
        }
        return null;
    }

    // Fallback: Bekannte Städte mit echter Lookaround-Abdeckung
    function loadKnownLookaroundCities() {
        console.log('Loading known Lookaround cities...');

        // Echte Städte mit bestätigter Lookaround-Abdeckung (kleinere, präzisere Gebiete)
        const confirmedCities = [
            // Deutschland
            { name: "Berlin Mitte", lat: 52.520, lon: 13.405, radius: 0.02 },
            { name: "München Zentrum", lat: 48.137, lon: 11.575, radius: 0.015 },
            { name: "Hamburg Zentrum", lat: 53.550, lon: 9.993, radius: 0.015 },
            { name: "Köln Zentrum", lat: 50.937, lon: 6.960, radius: 0.012 },
            { name: "Frankfurt Zentrum", lat: 50.110, lon: 8.682, radius: 0.010 },
            { name: "Düsseldorf", lat: 51.225, lon: 6.776, radius: 0.010 },
            { name: "Stuttgart", lat: 48.775, lon: 9.182, radius: 0.010 },

            // USA (bestätigte Gebiete)
            { name: "San Francisco", lat: 37.774, lon: -122.419, radius: 0.025 },
            { name: "Los Angeles", lat: 34.052, lon: -118.244, radius: 0.030 },
            { name: "New York Manhattan", lat: 40.758, lon: -73.985, radius: 0.020 },
            { name: "Chicago", lat: 41.878, lon: -87.630, radius: 0.015 },
            { name: "Seattle", lat: 47.606, lon: -122.332, radius: 0.015 },

            // International
            { name: "London", lat: 51.507, lon: -0.127, radius: 0.020 },
            { name: "Paris", lat: 48.856, lon: 2.352, radius: 0.015 },
            { name: "Tokyo", lat: 35.676, lon: 139.650, radius: 0.020 },
            { name: "Sydney", lat: -33.868, lon: 151.207, radius: 0.015 }
        ];

        confirmedCities.forEach(city => {
            try {
                // Erstelle Kreis um jede Stadt
                const center = new OpenLayers.LonLat(city.lon, city.lat).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    W.map.getProjectionObject()
                );

                // Approximiere Kreis mit Polygon (16 Punkte)
                const points = [];
                const numPoints = 16;
                const radius = city.radius * 111320; // Grad zu Meter (ungefähr)

                for (let i = 0; i < numPoints; i++) {
                    const angle = (i / numPoints) * 2 * Math.PI;
                    const x = center.lon + Math.cos(angle) * radius;
                    const y = center.lat + Math.sin(angle) * radius;
                    points.push(new OpenLayers.Geometry.Point(x, y));
                }
                points.push(points[0]); // Schließe den Kreis

                const linearRing = new OpenLayers.Geometry.LinearRing(points);
                const polygon = new OpenLayers.Geometry.Polygon([linearRing]);
                const feature = new OpenLayers.Feature.Vector(polygon);
                feature.attributes = { name: city.name };

                coverageLayer.addFeatures([feature]);

            } catch (cityError) {
                console.log('Error creating city coverage:', city.name, cityError);
            }
        });

        W.map.addLayer(coverageLayer);
        console.log('Known cities coverage overlay created with', confirmedCities.length, 'cities');
    }
    function generateAppleLookAroundLink(lat, lon, callback) {
        // Versuche Adresse über Nominatim zu ermitteln (falls CSP erlaubt)
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=de`;

        // Fallback Link
        const basicLink = `https://maps.apple.com/look-around?z=17&coordinate=${lat}%2C${lon}`;

        try {
            fetch(nominatimUrl)
                .then(response => response.json())
                .then(data => {
                    if (data && data.address) {
                        const address = data.address;
                        let addressString = '';
                        let nameString = '';

                        // Adresse zusammenbauen
                        if (address.house_number && address.road) {
                            addressString = `${address.road} ${address.house_number}`;
                            nameString = `${address.road} ${address.house_number}`;
                        } else if (address.road) {
                            addressString = address.road;
                            nameString = address.road;
                        } else if (address.neighbourhood || address.suburb) {
                            addressString = address.neighbourhood || address.suburb;
                            nameString = address.neighbourhood || address.suburb;
                        }

                        if (address.suburb && addressString !== address.suburb) {
                            addressString += `, ${address.suburb}`;
                        }

                        if (address.postcode) {
                            addressString += `, ${address.postcode}`;
                        }

                        if (address.city || address.town || address.village) {
                            addressString += ` ${address.city || address.town || address.village}`;
                        }

                        if (address.country) {
                            addressString += `, ${address.country}`;
                        }

                        // URL-encode die Adresse
                        const encodedAddress = encodeURIComponent(addressString);
                        const encodedName = encodeURIComponent(nameString);

                        // Generiere _mvs Parameter (Base64-kodierte Koordinaten)
                        const mvsCoords = btoa(`${lat},${lon},17`);

                        const fullLink = `https://maps.apple.com/look-around?z=17&address=${encodedAddress}&coordinate=${lat}%2C${lon}&name=${encodedName}&_mvs=${mvsCoords}`;

                        console.log('Generated Apple Look Around link with address:', fullLink);
                        callback(fullLink);

                    } else {
                        console.log('No address data, using basic link');
                        callback(basicLink);
                    }
                })
                .catch(error => {
                    console.log('Geocoding failed, using basic link:', error);
                    callback(basicLink);
                });
        } catch (error) {
            console.log('Fetch not available, using basic link:', error);
            callback(basicLink);
        }
    }
    function isLookaroundRegion(lat, lon) {
        const supportedRegions = [
            { minLat: 24, maxLat: 49, minLon: -125, maxLon: -66 }, // USA
            { minLat: 41, maxLat: 70, minLon: -141, maxLon: -52 }, // Kanada
            { minLat: 49, maxLat: 61, minLon: -11, maxLon: 2 }, // UK & Irland
            { minLat: 47, maxLat: 55, minLon: 5, maxLon: 15 }, // Deutschland & Zentraleuropa
            { minLat: 24, maxLat: 46, minLon: 129, maxLon: 146 }, // Japan
            { minLat: -38, maxLat: -10, minLon: 113, maxLon: 154 } // Australien
        ];

        return supportedRegions.some(region =>
            lat >= region.minLat && lat <= region.maxLat &&
            lon >= region.minLon && lon <= region.maxLon
        );
    }

    // Aktuelle Position aus WME abrufen - Verbesserte Version
    function getCurrentMapPosition() {
        try {
            if (W && W.map && W.map.getCenter) {
                const center = W.map.getCenter();

                // Debug-Ausgabe für Fehlersuche
                console.log('WME map center (Web Mercator):', center.lon, center.lat);

                const coords = webMercatorToWGS84(center.lon, center.lat);

                // Debug-Ausgabe für transformierte Koordinaten
                console.log('Transformed center (WGS84):', coords.lat, coords.lon);

                return coords;
            }
        } catch (error) {
            console.log('Error getting map position:', error);
        }
        return null;
    }

    // Automatische Position beim Start ermitteln
    function autoUpdatePosition() {
        const position = getCurrentMapPosition();
        if (position) {
            currentLat = position.lat;
            currentLon = position.lon;
            updateCoordinatesDisplay();
            console.log('Auto-detected position:', currentLat.toFixed(6), currentLon.toFixed(6));
        }
    }

    // Position bei Kartenänderungen aktualisieren
    function setupMapListeners() {
        if (W && W.map) {
            W.map.events.register('moveend', W.map, autoUpdatePosition);
            W.map.events.register('zoomend', W.map, autoUpdatePosition);
        }
    }

    // Map Click Handler - Mit automatischem Fenster öffnen und Event-Interception
    function handleMapClick(event) {
        // Stoppe Event-Propagation sofort, damit WME es nicht verarbeitet
        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();

        if (!event.xy) return false;

        try {
            // WME's getLonLatFromPixel gibt bereits WGS84-Koordinaten zurück!
            const mapCoords = W.map.getLonLatFromPixel(event.xy);

            // Debug-Ausgabe für Fehlersuche
            console.log('Map click coords (already WGS84):', mapCoords.lon, mapCoords.lat);

            // Keine Transformation nötig - sind bereits WGS84!
            currentLat = mapCoords.lat;
            currentLon = mapCoords.lon;

            // Debug-Ausgabe für finale Koordinaten
            console.log('Final coords for Lookmap:', currentLat, currentLon);

            updateCoordinatesDisplay();
            toggleMapClick(); // Automatisch deaktivieren nach Auswahl

            // Automatisch Lookmap öffnen nach Position-Auswahl
            setTimeout(() => {
                openLookmap();
            }, 200); // Kurze Verzögerung damit der Nutzer das Update sieht

        } catch (error) {
            console.log('Error handling map click:', error);
        }

        return false; // Verhindere weitere Event-Verarbeitung
    }

    // CSS-Styles für Crosshair-Cursor injizieren
    function injectCrosshairCSS() {
        if (crosshairStyleElement) return;

        crosshairStyleElement = document.createElement('style');
        crosshairStyleElement.id = 'wme-lookaround-crosshair';
        crosshairStyleElement.textContent = `
            .wme-lookaround-crosshair-mode * {
                cursor: crosshair !important;
            }
            .wme-lookaround-crosshair-mode #map,
            .wme-lookaround-crosshair-mode #map *,
            .wme-lookaround-crosshair-mode .olMapViewport,
            .wme-lookaround-crosshair-mode .olMapViewport *,
            .wme-lookaround-crosshair-mode .OpenLayers_Map,
            .wme-lookaround-crosshair-mode .OpenLayers_Map * {
                cursor: crosshair !important;
            }
        `;
        document.head.appendChild(crosshairStyleElement);
    }

    // CSS-Styles für Crosshair-Cursor entfernen
    function removeCrosshairCSS() {
        if (crosshairStyleElement) {
            crosshairStyleElement.remove();
            crosshairStyleElement = null;
        }
    }

    // Toggle Map Click Mode - Mit höherer Event-Priorität
    function toggleMapClick() {
        const button = document.getElementById('map-click-toggle');
        if (!button) return;

        if (mapClickHandler) {
            // Deaktivieren
            W.map.events.unregister('click', W.map, mapClickHandler);
            mapClickHandler = null;
            button.textContent = '🎯 Karte anklicken: AUS';
            button.style.background = '#FF9500';

            // CSS-Klasse entfernen und Styles zurücksetzen
            document.body.classList.remove('wme-lookaround-crosshair-mode');
            removeCrosshairCSS();

            console.log('Map click mode deactivated');
        } else {
            // Aktivieren mit höherer Priorität
            mapClickHandler = handleMapClick;
            // Registriere mit priority, damit unser Handler VOR WME's Handlern läuft
            W.map.events.register('click', W.map, mapClickHandler, { priority: 1000 });
            button.textContent = '🎯 Karte anklicken: EIN';
            button.style.background = '#FF3B30';

            // CSS injizieren und Klasse setzen
            injectCrosshairCSS();
            document.body.classList.add('wme-lookaround-crosshair-mode');

            console.log('Map click mode activated with high priority - crosshair should be visible everywhere');
        }
    }

    // Koordinaten-Anzeige aktualisieren
    function updateCoordinatesDisplay() {
        const statusEl = document.getElementById('lookaround-status');
        const coordsEl = document.getElementById('lookaround-coords');

        if (currentLat && currentLon && coordsEl && statusEl) {
            coordsEl.textContent = 'Position: ' + currentLat.toFixed(6) + ', ' + currentLon.toFixed(6);

            if (isLookaroundRegion(currentLat, currentLon)) {
                statusEl.textContent = '✅ Region wird unterstützt';
                statusEl.style.color = '#34C759';
            } else {
                statusEl.textContent = '⚠️ Region möglicherweise nicht verfügbar';
                statusEl.style.color = '#FF9500';
            }
        }
    }

    // Position manuell aktualisieren
    function updateCurrentPosition() {
        const statusEl = document.getElementById('lookaround-status');
        if (statusEl) {
            statusEl.textContent = '🔄 Position wird aktualisiert...';
            statusEl.style.color = '#007AFF';
        }

        const position = getCurrentMapPosition();
        if (!position) {
            if (statusEl) {
                statusEl.textContent = '❌ Fehler beim Abrufen der Position';
                statusEl.style.color = '#FF3B30';
            }
            return;
        }

        currentLat = position.lat;
        currentLon = position.lon;
        updateCoordinatesDisplay();
    }

    // Lookaround-Services öffnen
    function openLookaroundService(serviceIndex) {
        if (!currentLat || !currentLon) {
            alert('Bitte wähle zuerst eine Position!');
            return;
        }

        // Nur noch Lookmap.eu
        if (serviceIndex === 0) {
            const url = 'https://lookmap.eu.pythonanywhere.com/#c=17/' + currentLat + '/' + currentLon + '&p=' + currentLat + '/' + currentLon + '&a=0.00/0.00';
            const windowFeatures = 'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=yes,status=no,left=' + (screen.width - 800 - 20) + ',top=' + (screen.height - 600 - 100);
            window.open(url, 'lookaround_Lookmap_eu', windowFeatures);
        }
    }

    // Lookmap öffnen
    function openLookmap() {
        if (!currentLat || !currentLon) {
            alert('Bitte wähle zuerst eine Position!');
            return;
        }

        const url = 'https://lookmap.eu.pythonanywhere.com/#c=17/' + currentLat + '/' + currentLon + '&p=' + currentLat + '/' + currentLon + '&a=0.00/0.00';
        const windowFeatures = 'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=yes,status=no,left=' + (screen.width - 800 - 20) + ',top=' + (screen.height - 600 - 100);
        window.open(url, 'lookaround_Lookmap_eu', windowFeatures);
    }

    // Einfaches Overlay-Fenster erstellen
    function createSimpleOverlay() {
        if (overlayWindow) {
            overlayWindow.remove();
        }

        overlayWindow = document.createElement('div');
        overlayWindow.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;';

        const container = document.createElement('div');
        container.style.cssText = 'background:white;border-radius:12px;padding:30px;max-width:400px;text-align:center;';

        const title = document.createElement('h2');
        title.textContent = '🎯 Lookmap.eu';
        title.style.cssText = 'margin:0 0 20px 0;color:#34C759;';

        const positionInfo = document.createElement('div');
        positionInfo.textContent = 'Position: ' + (currentLat ? currentLat.toFixed(6) + ', ' + currentLon.toFixed(6) : 'Nicht verfügbar');
        positionInfo.style.cssText = 'margin-bottom:20px;color:#666;';

        const lookmapButton = document.createElement('button');
        lookmapButton.textContent = '🎯 Lookmap.eu öffnen';
        lookmapButton.style.cssText = 'padding:15px 20px;background:#34C759;color:white;border:none;border-radius:8px;cursor:pointer;font-size:16px;font-weight:bold;margin:10px;transition:all 0.3s ease;transform:scale(1);';
        lookmapButton.addEventListener('click', () => {
            openLookmap();
            closeOverlay();
        });

        // Hover-Effekte für Overlay-Lookmap-Button
        lookmapButton.addEventListener('mouseenter', () => {
            lookmapButton.style.transform = 'scale(1.08)';
            lookmapButton.style.background = '#4ADA69';
            lookmapButton.style.boxShadow = '0 6px 20px rgba(52, 199, 89, 0.5)';
        });

        lookmapButton.addEventListener('mouseleave', () => {
            lookmapButton.style.transform = 'scale(1)';
            lookmapButton.style.background = '#34C759';
            lookmapButton.style.boxShadow = 'none';
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = '✕ Schließen';
        closeButton.style.cssText = 'padding:10px 20px;background:#ccc;color:#333;border:none;border-radius:8px;cursor:pointer;margin-top:15px;transition:all 0.3s ease;transform:scale(1);';
        closeButton.addEventListener('click', closeOverlay);

        // Hover-Effekte für Schließen-Button
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.transform = 'scale(1.05)';
            closeButton.style.background = '#e0e0e0';
            closeButton.style.boxShadow = '0 4px 12px rgba(204, 204, 204, 0.4)';
            closeButton.style.color = '#000';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.transform = 'scale(1)';
            closeButton.style.background = '#ccc';
            closeButton.style.boxShadow = 'none';
            closeButton.style.color = '#333';
        });

        container.appendChild(title);
        container.appendChild(positionInfo);
        container.appendChild(lookmapButton);
        container.appendChild(closeButton);
        overlayWindow.appendChild(container);
        document.body.appendChild(overlayWindow);

        // ESC-Taste zum Schließen
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape' && overlayWindow) {
                closeOverlay();
                document.removeEventListener('keydown', escapeHandler);
            }
        });

        overlayWindow.addEventListener('click', (e) => {
            if (e.target === overlayWindow) {
                closeOverlay();
            }
        });
    }

    // Overlay schließen
    function closeOverlay() {
        if (overlayWindow) {
            overlayWindow.remove();
            overlayWindow = null;
        }
    }

    // Sidebar-Interface erstellen
    function createSidebarInterface() {
        const container = document.createElement('div');
        container.style.cssText = 'padding:15px;font-family:Arial,sans-serif;';

const title = document.createElement('h4');
title.textContent = '🎯 WME Look Around';
title.style.cssText = `
  margin: 0 0 15px 0;
  color: #0099FF;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

        const coordsDisplay = document.createElement('div');
        coordsDisplay.id = 'lookaround-coords';
        coordsDisplay.textContent = 'Position: Wird geladen...';
        coordsDisplay.style.cssText = 'font-size:12px;color:#666;margin-bottom:8px;';

        const statusDisplay = document.createElement('div');
        statusDisplay.id = 'lookaround-status';
        statusDisplay.textContent = 'Bereit';
        statusDisplay.style.cssText = 'font-size:12px;color:#666;margin-bottom:15px;';

        // Map-Click-Button wieder hinzufügen
        const mapClickButton = document.createElement('button');
        mapClickButton.id = 'map-click-toggle';
        mapClickButton.textContent = '🎯 Karte anklicken: AUS';
        mapClickButton.style.cssText = 'padding:10px;background:#FF9500;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;width:100%;margin-bottom:15px;transition:all 0.3s ease;transform:scale(1);';
        mapClickButton.addEventListener('click', toggleMapClick);

        // Hover-Effekte für Map-Click-Button
        mapClickButton.addEventListener('mouseenter', () => {
            mapClickButton.style.transform = 'scale(1.05)';
            mapClickButton.style.boxShadow = '0 4px 12px rgba(255, 149, 0, 0.4)';
            if (mapClickHandler) {
                mapClickButton.style.background = '#FF1A1A'; // Helleres Rot beim Hover wenn aktiv
            } else {
                mapClickButton.style.background = '#FFB84D'; // Helleres Orange beim Hover wenn inaktiv
            }
        });

        mapClickButton.addEventListener('mouseleave', () => {
            mapClickButton.style.transform = 'scale(1)';
            mapClickButton.style.boxShadow = 'none';
            if (mapClickHandler) {
                mapClickButton.style.background = '#FF3B30'; // Original Rot
            } else {
                mapClickButton.style.background = '#FF9500'; // Original Orange
            }
        });

        // Schnellzugriff-Button
        const quickContainer = document.createElement('div');
        quickContainer.style.cssText = 'margin-top:15px;';

        const quickTitle = document.createElement('div');
        quickTitle.textContent = 'Schnellzugriff:';
        quickTitle.style.cssText = 'font-size:12px;font-weight:bold;margin-bottom:8px;';

        const directButton = document.createElement('button');
        directButton.textContent = 'Direkt öffnen';
        directButton.style.cssText = 'padding:8px 12px;background:#34C759;color:white;border:none;border-radius:4px;cursor:pointer;font-size:11px;width:100%;transition:all 0.3s ease;transform:scale(1);';
        directButton.addEventListener('click', openLookmap);

        // Hover-Effekte für Direkt-öffnen-Button
        directButton.addEventListener('mouseenter', () => {
            directButton.style.transform = 'scale(1.05)';
            directButton.style.background = '#4ADA69'; // Helleres Grün
            directButton.style.boxShadow = '0 4px 12px rgba(52, 199, 89, 0.4)';
        });

        directButton.addEventListener('mouseleave', () => {
            directButton.style.transform = 'scale(1)';
            directButton.style.background = '#34C759'; // Original Grün
            directButton.style.boxShadow = 'none';
        });

        quickContainer.appendChild(quickTitle);
        quickContainer.appendChild(directButton);

        container.appendChild(title);
        container.appendChild(coordsDisplay);
        container.appendChild(statusDisplay);
        container.appendChild(mapClickButton);
        container.appendChild(quickContainer);

        return container;
    }

    // Cleanup map click handler - Verbesserte Version
    function cleanupMapClick() {
        if (mapClickHandler && W && W.map) {
            try {
                W.map.events.unregister('click', W.map, mapClickHandler);
                mapClickHandler = null;

                // CSS-Klasse und Styles entfernen
                document.body.classList.remove('wme-lookaround-crosshair-mode');
                removeCrosshairCSS();

            } catch (error) {
                console.log('Error cleaning up map click handler:', error);
            }
        }
    }

    // Script initialisieren
    function initializeScript() {
        try {
            console.log('Initializing WME Lookaround Integration...');

            const result = W.userscripts.registerSidebarTab(SCRIPT_ID);
            tabLabel = result.tabLabel;
            tabPane = result.tabPane;

            tabLabel.textContent = 'LA';
            tabLabel.title = SCRIPT_NAME;
            tabLabel.style.cssText = 'background:linear-gradient(135deg,#007AFF,#34C759);color:white;font-weight:bold;border-radius:3px;text-align:center;';

            const sidebarInterface = createSidebarInterface();
            tabPane.appendChild(sidebarInterface);

            setTimeout(() => {
                autoUpdatePosition();
                setupMapListeners();
            }, 1000);

            console.log('WME Lookaround Integration initialized successfully');

        } catch (error) {
            console.error('Error initializing WME Lookaround Integration:', error);
        }
    }

    // Cleanup function
    function cleanup() {
        try {
            cleanupMapClick();
            closeOverlay();

            if (W && W.map) {
                W.map.events.unregister('moveend', W.map, autoUpdatePosition);
                W.map.events.unregister('zoomend', W.map, autoUpdatePosition);
            }

            if (W.userscripts && W.userscripts.removeSidebarTab) {
                W.userscripts.removeSidebarTab(SCRIPT_ID);
            }
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }

    window.addEventListener('beforeunload', cleanup);

    if (W?.userscripts?.state?.isReady) {
        initializeScript();
    } else {
        document.addEventListener('wme-ready', initializeScript, { once: true });
    }

    console.log('WME Lookaround Integration userscript loaded');

})();