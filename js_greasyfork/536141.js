// ==UserScript==
// @name         WME Chat Plus
// @name:en      WME Chat Plus
// @version      2026.01.19
// @description  Chat-Erweiterung: Auto-Sichtbarkeit, Bundesland-Navigation, Spracheingabe
// @description:en  Chat enhancement: Auto-visibility, region navigation, speech-to-text
// @description:es  Mejora del chat: Auto-visibilidad, navegación regional, voz a texto
// @author       Hiwi234
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @downloadURL https://update.greasyfork.org/scripts/536141/WME%20Chat%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/536141/WME%20Chat%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = {
        AUTO: 'wme-quick-zoom-auto',
        ZOOM: 'wme-quick-zoom-level',
        VISIBILITY: 'wme-auto-visibility',
        SELECTED_REGION: 'wme-chat-plus-region',
        DRAFT_MESSAGE: 'wme-chat-plus-draft',
        AUTO_REGION: 'wme-chat-plus-auto-region',
        SHOW_FLOATING_BUTTON: 'wme-chat-plus-show-floating-button'
    };

    // ============================================
    // REGION DATA - DACH Bundesländer/Kantone
    // ============================================
    const regionData = {
        // DACH Gesamt
        'DACH': { name: '🇩🇪🇦🇹🇨🇭 DACH (Gesamt)', country: 'DACH', bbox: [5.87, 45.82, 17.16, 55.06] },
        
        // Deutschland
        'DE': { name: 'Deutschland (Gesamt)', country: 'DE', bbox: [5.87, 47.27, 15.04, 55.06] },
        'BY': { name: 'Bayern', country: 'DE', bbox: [8.98, 47.27, 13.84, 50.56] },
        'NDS': { name: 'Niedersachsen', country: 'DE', bbox: [6.65, 51.30, 11.60, 53.89] },
        'BW': { name: 'Baden-Württemberg', country: 'DE', bbox: [7.51, 47.53, 10.50, 49.79] },
        'NW': { name: 'Nordrhein-Westfalen', country: 'DE', bbox: [5.87, 50.32, 9.46, 52.53] },
        'BB': { name: 'Brandenburg', country: 'DE', bbox: [11.27, 51.36, 14.77, 53.56] },
        'MV': { name: 'Mecklenburg-Vorpommern', country: 'DE', bbox: [10.59, 53.11, 14.41, 54.69] },
        'HE': { name: 'Hessen', country: 'DE', bbox: [7.77, 49.39, 10.24, 51.66] },
        'ST': { name: 'Sachsen-Anhalt', country: 'DE', bbox: [10.56, 50.94, 13.19, 53.04] },
        'RP': { name: 'Rheinland-Pfalz', country: 'DE', bbox: [6.11, 48.97, 8.51, 50.94] },
        'SN': { name: 'Sachsen', country: 'DE', bbox: [11.87, 50.17, 15.04, 51.68] },
        'TH': { name: 'Thüringen', country: 'DE', bbox: [9.88, 50.20, 12.65, 51.65] },
        'SH': { name: 'Schleswig-Holstein', country: 'DE', bbox: [8.31, 53.36, 11.31, 55.06] },
        'SL': { name: 'Saarland', country: 'DE', bbox: [6.36, 49.11, 7.41, 49.64] },
        'BE': { name: 'Berlin', country: 'DE', bbox: [13.09, 52.34, 13.76, 52.68] },
        'HH': { name: 'Hamburg', country: 'DE', bbox: [9.73, 53.39, 10.33, 53.74] },
        'HB': { name: 'Bremen', country: 'DE', bbox: [8.48, 53.01, 8.99, 53.61] },
        
        // Österreich
        'AT': { name: 'Österreich (Gesamt)', country: 'AT', bbox: [9.53, 46.37, 17.16, 49.02] },
        'AT-3': { name: 'Niederösterreich', country: 'AT', bbox: [14.45, 47.42, 17.07, 49.02] },
        'AT-6': { name: 'Steiermark', country: 'AT', bbox: [13.56, 46.61, 16.17, 47.83] },
        'AT-7': { name: 'Tirol', country: 'AT', bbox: [10.10, 46.65, 12.97, 47.74] },
        'AT-4': { name: 'Oberösterreich', country: 'AT', bbox: [12.75, 47.46, 14.99, 48.77] },
        'AT-2': { name: 'Kärnten', country: 'AT', bbox: [12.65, 46.37, 15.05, 47.13] },
        'AT-5': { name: 'Salzburg', country: 'AT', bbox: [12.04, 46.90, 14.01, 47.85] },
        'AT-1': { name: 'Burgenland', country: 'AT', bbox: [16.02, 46.84, 17.16, 48.12] },
        'AT-8': { name: 'Vorarlberg', country: 'AT', bbox: [9.53, 46.84, 10.24, 47.59] },
        'AT-9': { name: 'Wien', country: 'AT', bbox: [16.18, 48.12, 16.58, 48.32] },
        
        // Schweiz
        'CH': { name: 'Schweiz (Gesamt)', country: 'CH', bbox: [5.96, 45.82, 10.49, 47.81] },
        'CH-GR': { name: 'Graubünden', country: 'CH', bbox: [8.65, 46.17, 10.49, 47.06] },
        'CH-BE': { name: 'Bern', country: 'CH', bbox: [6.86, 46.33, 8.46, 47.35] },
        'CH-VS': { name: 'Wallis', country: 'CH', bbox: [6.77, 45.87, 8.47, 46.66] },
        'CH-VD': { name: 'Waadt', country: 'CH', bbox: [6.06, 46.20, 7.24, 46.98] },
        'CH-TI': { name: 'Tessin', country: 'CH', bbox: [8.38, 45.82, 9.17, 46.64] },
        'CH-SG': { name: 'St. Gallen', country: 'CH', bbox: [8.80, 46.87, 9.68, 47.53] },
        'CH-AG': { name: 'Aargau', country: 'CH', bbox: [7.71, 47.14, 8.46, 47.62] },
        'CH-ZH': { name: 'Zürich', country: 'CH', bbox: [8.36, 47.16, 8.99, 47.70] },
        'CH-LU': { name: 'Luzern', country: 'CH', bbox: [7.85, 46.77, 8.51, 47.27] },
        'CH-GE': { name: 'Genf', country: 'CH', bbox: [5.96, 46.13, 6.31, 46.37] },
        'CH-BS': { name: 'Basel-Stadt', country: 'CH', bbox: [7.56, 47.52, 7.68, 47.59] }
    };

    // Aktuelle erkannte Region
    let currentRegion = { country: null, state: null, stateName: null };

    // Mapping von WME State-Namen zu Codes
    const stateNameToCode = {
        'Baden-Württemberg': 'BW', 'Bayern': 'BY', 'Berlin': 'BE', 'Brandenburg': 'BB',
        'Bremen': 'HB', 'Hamburg': 'HH', 'Hessen': 'HE', 'Mecklenburg-Vorpommern': 'MV',
        'Niedersachsen': 'NDS', 'Nordrhein-Westfalen': 'NW', 'Rheinland-Pfalz': 'RP',
        'Saarland': 'SL', 'Sachsen': 'SN', 'Sachsen-Anhalt': 'ST', 'Schleswig-Holstein': 'SH',
        'Thüringen': 'TH', 'Bavaria': 'BY', 'Lower Saxony': 'NDS', 'North Rhine-Westphalia': 'NW',
        'Rhineland-Palatinate': 'RP', 'Saxony': 'SN', 'Saxony-Anhalt': 'ST', 'Thuringia': 'TH'
    };

    const countryNameToCode = {
        'Germany': 'DE', 'Deutschland': 'DE', 'Austria': 'AT', 'Österreich': 'AT',
        'Switzerland': 'CH', 'Schweiz': 'CH', 'Suisse': 'CH', 'Svizzera': 'CH'
    };

    const translations = {
        'de': {
            buttonText: 'Quick Zoom',
            buttonTooltip: 'Temporär auf Zoomstufe zoomen',
            sliderLabel: 'Maximale Zoomstufe:',
            autoLoadLabel: 'Quick Zoom beim Laden',
            autoRegionLabel: 'Region automatisch laden',
            visibilityLabel: 'Immer sichtbar bleiben',
            showFloatingButtonLabel: 'QZ Button anzeigen',
            regionLabel: 'Region auswählen:',
            regionButtonText: '🎯 Sichtbar für Region',
            regionButtonTooltip: 'Zoomt zur Region um für alle Editoren dort sichtbar zu sein',
            currentRegionLabel: 'Aktuelle Region:',
            detectRegionBtn: '📍 Erkennen'
        },
        'en': {
            buttonText: 'Quick Zoom',
            buttonTooltip: 'Temporarily zoom to level',
            sliderLabel: 'Maximum zoom level:',
            autoLoadLabel: 'Quick Zoom on load',
            autoRegionLabel: 'Auto-load region',
            visibilityLabel: 'Always stay visible',
            showFloatingButtonLabel: 'Show QZ button',
            regionLabel: 'Select region:',
            regionButtonText: '🎯 Visible for Region',
            regionButtonTooltip: 'Zooms to region to be visible for all editors there',
            currentRegionLabel: 'Current region:',
            detectRegionBtn: '📍 Detect'
        },
        'es': {
            buttonText: 'Zoom Rápido',
            buttonTooltip: 'Zoom temporal al nivel',
            sliderLabel: 'Nivel máximo de zoom:',
            autoLoadLabel: 'Quick Zoom al cargar',
            autoRegionLabel: 'Cargar región automáticamente',
            visibilityLabel: 'Permanecer siempre visible',
            showFloatingButtonLabel: 'Mostrar botón QZ',
            regionLabel: 'Seleccionar región:',
            regionButtonText: '🎯 Visible para Región',
            regionButtonTooltip: 'Zoom a la región para ser visible para todos los editores',
            currentRegionLabel: 'Región actual:',
            detectRegionBtn: '📍 Detectar'
        }
    };

    // State management
    let isZooming = false;
    let visibilityObserver = null;
    let visibilityInterval = null;

    function getLanguage() {
        const lang = navigator.language.split('-')[0];
        return translations[lang] ? lang : 'en';
    }

    // ============================================
    // STORAGE FUNCTIONS
    // ============================================
    function getAutoZoomSetting() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY.AUTO);
            return stored === null ? true : stored === 'true';
        } catch (e) { return true; }
    }

    function setAutoZoomSetting(value) {
        try { localStorage.setItem(STORAGE_KEY.AUTO, String(value)); } catch (e) {}
    }

    function getVisibilitySetting() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY.VISIBILITY);
            return stored === null ? true : stored === 'true';
        } catch (e) { return true; }
    }

    function setVisibilitySetting(value) {
        try { localStorage.setItem(STORAGE_KEY.VISIBILITY, String(value)); } catch (e) {}
    }

    function getZoomLevel() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY.ZOOM);
            return stored ? parseInt(stored) : 7;
        } catch (e) { return 7; }
    }

    function setZoomLevel(value) {
        try { localStorage.setItem(STORAGE_KEY.ZOOM, String(value)); } catch (e) {}
    }

    function getSelectedRegion() {
        try { return localStorage.getItem(STORAGE_KEY.SELECTED_REGION) || ''; } catch (e) { return ''; }
    }

    function setSelectedRegion(value) {
        try { localStorage.setItem(STORAGE_KEY.SELECTED_REGION, value); } catch (e) {}
    }

    function getAutoRegionSetting() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY.AUTO_REGION);
            return stored === null ? false : stored === 'true';
        } catch (e) { return false; }
    }

    function setAutoRegionSetting(value) {
        try { localStorage.setItem(STORAGE_KEY.AUTO_REGION, String(value)); } catch (e) {}
    }

    function getShowFloatingButtonSetting() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY.SHOW_FLOATING_BUTTON);
            return stored === null ? true : stored === 'true';
        } catch (e) { return true; }
    }

    function setShowFloatingButtonSetting(value) {
        try { localStorage.setItem(STORAGE_KEY.SHOW_FLOATING_BUTTON, String(value)); } catch (e) {}
    }

    // ============================================
    // GEO-LOKALISIERUNG
    // ============================================
    function detectCurrentRegion() {
        try {
            if (W && W.model) {
                const topCountry = W.model.getTopCountry && W.model.getTopCountry();
                const topState = W.model.getTopState && W.model.getTopState();

                if (topCountry) {
                    const countryName = topCountry.name || topCountry.attributes?.name;
                    currentRegion.country = countryNameToCode[countryName] || null;
                }

                if (topState) {
                    const stateName = topState.name || topState.attributes?.name;
                    currentRegion.stateName = stateName;
                    currentRegion.state = stateNameToCode[stateName] || null;
                }
            }

            // Fallback über Koordinaten
            if (!currentRegion.country && W && W.map) {
                const center = W.map.getCenter();
                if (center) {
                    let lon = center.lon, lat = center.lat;
                    if (Math.abs(lon) > 180 || Math.abs(lat) > 90) {
                        lon = (lon / 20037508.34) * 180;
                        lat = (Math.atan(Math.exp(lat * Math.PI / 20037508.34)) * 360 / Math.PI) - 90;
                    }

                    if (lon >= 5.8 && lon <= 15.1 && lat >= 47.2 && lat <= 55.1) {
                        currentRegion.country = 'DE';
                        currentRegion.state = detectGermanStateByCoords(lon, lat);
                    } else if (lon >= 9.5 && lon <= 17.2 && lat >= 46.3 && lat <= 49.0) {
                        currentRegion.country = 'AT';
                    } else if (lon >= 5.9 && lon <= 10.5 && lat >= 45.8 && lat <= 47.8) {
                        currentRegion.country = 'CH';
                    }
                }
            }
            return currentRegion;
        } catch (error) {
            console.warn('[WME Chat Plus] Region detection error:', error);
            return currentRegion;
        }
    }

    function detectGermanStateByCoords(lon, lat) {
        const stateBounds = {
            'BE': { minLon: 13.1, maxLon: 13.8, minLat: 52.3, maxLat: 52.7 },
            'HH': { minLon: 9.7, maxLon: 10.3, minLat: 53.4, maxLat: 53.7 },
            'HB': { minLon: 8.5, maxLon: 9.0, minLat: 53.0, maxLat: 53.6 },
            'SL': { minLon: 6.4, maxLon: 7.4, minLat: 49.1, maxLat: 49.7 },
            'SH': { minLon: 8.3, maxLon: 11.4, minLat: 53.3, maxLat: 55.1 },
            'MV': { minLon: 10.6, maxLon: 14.5, minLat: 53.1, maxLat: 54.7 },
            'BB': { minLon: 11.3, maxLon: 14.8, minLat: 51.4, maxLat: 53.6 },
            'ST': { minLon: 10.5, maxLon: 13.2, minLat: 50.9, maxLat: 53.0 },
            'TH': { minLon: 9.9, maxLon: 12.7, minLat: 50.2, maxLat: 51.6 },
            'SN': { minLon: 11.9, maxLon: 15.1, minLat: 50.2, maxLat: 51.7 },
            'NW': { minLon: 5.8, maxLon: 9.5, minLat: 50.3, maxLat: 52.6 },
            'HE': { minLon: 7.8, maxLon: 10.3, minLat: 49.4, maxLat: 51.7 },
            'RP': { minLon: 6.1, maxLon: 8.5, minLat: 48.9, maxLat: 50.9 },
            'BW': { minLon: 7.5, maxLon: 10.5, minLat: 47.5, maxLat: 49.8 },
            'BY': { minLon: 8.9, maxLon: 13.9, minLat: 47.3, maxLat: 50.6 },
            'NDS': { minLon: 6.6, maxLon: 11.6, minLat: 51.3, maxLat: 53.9 }
        };

        const checkOrder = ['BE', 'HH', 'HB', 'SL', 'SH', 'MV', 'BB', 'ST', 'TH', 'SN', 'NW', 'HE', 'RP', 'BW', 'BY', 'NDS'];
        for (const state of checkOrder) {
            const bounds = stateBounds[state];
            if (lon >= bounds.minLon && lon <= bounds.maxLon && lat >= bounds.minLat && lat <= bounds.maxLat) {
                return state;
            }
        }
        return null;
    }

    // WGS84 zu Web Mercator
    function wgs84ToMercator(lon, lat) {
        const x = lon * 20037508.34 / 180;
        const y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;
        return { x, y };
    }

    // Berechne optimalen Zoom-Level für eine Bounding Box
    function calculateZoomForBbox(bbox) {
        const [minLon, minLat, maxLon, maxLat] = bbox;
        const lonDiff = maxLon - minLon;
        const latDiff = maxLat - minLat;
        const maxDiff = Math.max(lonDiff, latDiff * 1.5);
        
        let zoom;
        if (maxDiff > 8) zoom = 7;
        else if (maxDiff > 5) zoom = 8;
        else if (maxDiff > 3) zoom = 9;
        else if (maxDiff > 2) zoom = 10;
        else if (maxDiff > 1) zoom = 11;
        else if (maxDiff > 0.5) zoom = 12;
        else if (maxDiff > 0.2) zoom = 13;
        else zoom = 14;
        
        return zoom;
    }

    // ============================================
    // REGION ZOOM
    // ============================================
    let isRegionZooming = false;
    async function zoomToRegionForVisibility(regionCode) {
        if (isRegionZooming) return;

        const region = regionData[regionCode];
        if (!region || !W?.map?.olMap) return;

        isRegionZooming = true;
        const olMap = W.map.olMap;
        const originalZoom = olMap.getZoom();
        const originalCenter = olMap.getCenter();

        try {
            const bbox = region.bbox;
            const [minLon, minLat, maxLon, maxLat] = bbox;
            const centerLon = (minLon + maxLon) / 2;
            const centerLat = (minLat + maxLat) / 2;
            const center = wgs84ToMercator(centerLon, centerLat);
            const targetCenter = new OpenLayers.LonLat(center.x, center.y);
            const targetZoom = calculateZoomForBbox(bbox);

            console.log(`[WME Chat Plus] Zooming to ${region.name} at zoom ${targetZoom}`);
            olMap.setCenter(targetCenter, targetZoom);
            await new Promise(resolve => setTimeout(resolve, 2000));
            olMap.setCenter(originalCenter, originalZoom);
            console.log(`[WME Chat Plus] Region zoom complete`);
        } catch (error) {
            console.error('[WME Chat Plus] Region zoom error:', error);
            try { olMap.setCenter(originalCenter, originalZoom); } catch (e) {}
        } finally {
            isRegionZooming = false;
        }
    }

    // ============================================
    // VISIBILITY MANAGEMENT
    // ============================================
    function ensureVisibility() {
        if (!getVisibilitySetting()) return;

        try {
            console.log('[WME Chat Plus] Checking visibility...');
            
            const visibilityLabel = document.querySelector('span.editor-visibility.label');
            if (visibilityLabel) {
                const labelText = visibilityLabel.textContent.toLowerCase().trim();
                if (labelText.includes('unsichtbar') || labelText.includes('invisible')) {
                    const tooltipButton = visibilityLabel.closest('wz-list-item')?.querySelector('wz-button[color="clear-icon"]');
                    if (tooltipButton) {
                        tooltipButton.click();
                        console.log('[WME Chat Plus] Set to visible');
                        return true;
                    }
                }
            }

            const alternativeSelectors = [
                'wz-button[color="clear-icon"][size="md"]',
                'button.wz-button.clear-icon.md.icon-only'
            ];

            for (const selector of alternativeSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    const elementText = element.textContent?.toLowerCase() || '';
                    const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || '';
                    
                    if (elementText.includes('unsichtbar') || elementText.includes('invisible') ||
                        ariaLabel.includes('unsichtbar') || ariaLabel.includes('invisible')) {
                        element.click();
                        console.log('[WME Chat Plus] Set to visible via', selector);
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            console.warn('[WME Chat Plus] Visibility error:', error);
            return false;
        }
    }

    function startVisibilityMonitoring() {
        if (!getVisibilitySetting()) return;

        console.log('[WME Chat Plus] Starting visibility monitoring...');
        
        // Initial check
        setTimeout(ensureVisibility, 3000);
        
        // Check every 15 seconds
        if (visibilityInterval) clearInterval(visibilityInterval);
        visibilityInterval = setInterval(ensureVisibility, 15000);

        // Check on focus
        window.addEventListener('focus', () => {
            setTimeout(ensureVisibility, 1000);
        }, { passive: true });
    }

    function stopVisibilityMonitoring() {
        if (visibilityInterval) {
            clearInterval(visibilityInterval);
            visibilityInterval = null;
        }
    }

    // ============================================
    // AUTO-REGION FUNCTIONALITY
    // ============================================
    async function performAutoRegionZoom() {
        if (!getAutoRegionSetting()) return;
        
        console.log('[WME Chat Plus] Auto-region zoom starting...');
        
        // Wait a bit for WME to fully load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Detect current region
        detectCurrentRegion();
        
        let regionToZoom = null;
        if (currentRegion.state && regionData[currentRegion.state]) {
            regionToZoom = currentRegion.state;
        } else if (currentRegion.country && regionData[currentRegion.country]) {
            regionToZoom = currentRegion.country;
        }
        
        if (regionToZoom) {
            console.log(`[WME Chat Plus] Auto-zooming to region: ${regionData[regionToZoom].name}`);
            await zoomToRegionForVisibility(regionToZoom);
            
            // Update UI to reflect the auto-selected region
            const regionSelect = document.querySelector('#wme-chat-plus-region-select');
            if (regionSelect) {
                regionSelect.value = regionToZoom;
                setSelectedRegion(regionToZoom);
            }
        } else {
            console.log('[WME Chat Plus] No suitable region found for auto-zoom');
        }
    }
    async function performQuickZoom() {
        if (isZooming || !window.W?.map?.olMap) return;

        try {
            isZooming = true;
            const originalZoom = W.map.olMap.getZoom();
            const targetZoom = getZoomLevel();
            
            console.log(`[WME Chat Plus] Quick zoom ${originalZoom} → ${targetZoom}`);
            W.map.olMap.zoomTo(targetZoom);

            return new Promise(resolve => {
                setTimeout(() => {
                    try {
                        if (window.W?.map?.olMap) {
                            W.map.olMap.zoomTo(originalZoom);
                            console.log(`[WME Chat Plus] Restored zoom to ${originalZoom}`);
                        }
                    } catch (error) {
                        console.error('[WME Chat Plus] Error restoring zoom:', error);
                    } finally {
                        isZooming = false;
                        resolve();
                    }
                }, 2000);
            });
        } catch (error) {
            console.error('[WME Chat Plus] Quick zoom error:', error);
            isZooming = false;
        }
    }

    // ============================================
    // QUICK ZOOM
    // ============================================
    let speechRecognition = null;
    let isListening = false;

    function isSpeechSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    function createSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return null;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = navigator.language || 'de-DE';
        return recognition;
    }

    function addSpeechButton(inputElement) {
        if (!isSpeechSupported()) return;

        const parent = inputElement.parentElement;
        if (!parent || parent.querySelector('.wme-chat-plus-speech-btn')) return;

        const speechBtn = document.createElement('button');
        speechBtn.className = 'wme-chat-plus-speech-btn';
        speechBtn.innerHTML = '🎤';
        speechBtn.title = 'Spracheingabe';
        speechBtn.type = 'button';
        speechBtn.style.cssText = `
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            cursor: pointer;
            font-size: 16px;
            margin-left: 5px;
            transition: all 0.2s;
        `;

        speechBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSpeechRecognition(inputElement, speechBtn);
        });

        if (parent.style.display !== 'flex') {
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
        }
        inputElement.style.flex = '1';
        parent.appendChild(speechBtn);
    }

    function toggleSpeechRecognition(inputElement, button) {
        if (isListening) {
            stopSpeechRecognition(button);
            return;
        }

        if (!speechRecognition) {
            speechRecognition = createSpeechRecognition();
            if (!speechRecognition) {
                alert('Spracheingabe wird nicht unterstützt.');
                return;
            }
        }

        speechRecognition.onstart = () => {
            isListening = true;
            button.innerHTML = '🔴';
            button.style.background = '#ffebee';
            button.style.borderColor = '#f44336';
            button.title = 'Aufnahme läuft...';
        };

        speechRecognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }

            if (finalTranscript) {
                const currentValue = inputElement.value;
                const newValue = currentValue + (currentValue ? ' ' : '') + finalTranscript;
                inputElement.value = newValue;
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            }
        };

        speechRecognition.onerror = (event) => {
            console.warn('[WME Chat Plus] Speech error:', event.error);
            stopSpeechRecognition(button);
        };

        speechRecognition.onend = () => {
            stopSpeechRecognition(button);
        };

        try {
            speechRecognition.start();
        } catch (e) {
            console.error('[WME Chat Plus] Speech start error:', e);
            stopSpeechRecognition(button);
        }
    }

    function stopSpeechRecognition(button) {
        isListening = false;
        if (button) {
            button.innerHTML = '🎤';
            button.style.background = '#f0f0f0';
            button.style.borderColor = '#ccc';
            button.title = 'Spracheingabe';
        }
        
        if (speechRecognition) {
            try { speechRecognition.stop(); } catch (e) {}
        }
    }

    // ============================================
    // SPEECH-TO-TEXT
    // ============================================
    function saveDraft(text) {
        try { localStorage.setItem(STORAGE_KEY.DRAFT_MESSAGE, text); } catch (e) {}
    }

    function loadDraft() {
        try { return localStorage.getItem(STORAGE_KEY.DRAFT_MESSAGE) || ''; } catch (e) { return ''; }
    }

    function clearDraft() {
        try { localStorage.removeItem(STORAGE_KEY.DRAFT_MESSAGE); } catch (e) {}
    }

    function setupDraftSaving() {
        const findChatInput = () => {
            return document.querySelector(
                'textarea[data-testid="message-box-textarea"], ' +
                'textarea[name="message"], ' +
                'textarea[placeholder*="Nachricht"], ' +
                'textarea[placeholder*="message"]'
            );
        };

        const checkInput = () => {
            const input = findChatInput();
            if (!input || input.dataset.draftSetup) return;

            input.dataset.draftSetup = 'true';

            // Load draft
            const draft = loadDraft();
            if (draft && !input.value) {
                input.value = draft;
                console.log('[WME Chat Plus] Draft restored');
            }

            // Save on input
            input.addEventListener('input', () => {
                saveDraft(input.value);
            }, { passive: true });

            // Clear on send
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    setTimeout(() => {
                        clearDraft();
                        input.value = '';
                    }, 100);
                }
            });

            // Add speech button
            addSpeechButton(input);
        };

        setInterval(checkInput, 2000);
        checkInput();
    }

    // ============================================
    // DRAFT SAVING
    // ============================================
    function createStyles() {
        if (document.getElementById('wme-chat-plus-styles')) return;

        const style = document.createElement('style');
        style.id = 'wme-chat-plus-styles';
        style.textContent = `
            .chat-plus-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px;
            }
            .chat-plus-slider-container {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            .chat-plus-checkbox-container {
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 2px 0;
            }
            .chat-plus-checkbox-container input[type="checkbox"] {
                margin: 0;
                vertical-align: middle;
            }
            .chat-plus-checkbox-container label {
                margin: 0;
                vertical-align: middle;
                cursor: pointer;
            }
            .chat-plus-label {
                font-size: 12px;
                color: inherit;
            }
            .chat-plus-slider {
                width: 100%;
            }
            .chat-plus-floating-button {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 1000;
                background-color: #ffffff;
                border: 1px solid #cccccc;
                padding: 8px 15px;
                border-radius: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
                transition: all 0.3s ease;
            }
            .chat-plus-floating-button:hover {
                background-color: #f0f0f0;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // UI CREATION
    // ============================================
    async function initializeScript() {
        try {
            if (!window.W?.userscripts?.registerSidebarTab) {
                setTimeout(initializeScript, 1000);
                return;
            }

            console.log('[WME Chat Plus] Initializing...');
            const i18n = translations[getLanguage()];
            createStyles();

            // Register sidebar tab
            const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wme-chat-plus");
            tabLabel.innerText = 'Chat +';
            tabLabel.title = i18n.buttonText;

            // Create container
            const container = document.createElement('div');
            container.className = 'chat-plus-container';

            // Sidebar button
            const sidebarButton = document.createElement('button');
            sidebarButton.className = 'waze-btn waze-btn-small';
            sidebarButton.innerText = i18n.buttonText;
            sidebarButton.title = `${i18n.buttonTooltip} ${getZoomLevel()}`;
            sidebarButton.type = 'button';

            // Floating button
            const floatingButton = document.createElement('button');
            floatingButton.innerText = 'QZ';
            floatingButton.title = `${i18n.buttonTooltip} ${getZoomLevel()}`;
            floatingButton.className = 'chat-plus-floating-button';
            floatingButton.type = 'button';

            // Zoom slider
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'chat-plus-slider-container';

            const sliderLabel = document.createElement('label');
            sliderLabel.textContent = i18n.sliderLabel;
            sliderLabel.className = 'chat-plus-label';

            const sliderValue = document.createElement('span');
            sliderValue.className = 'chat-plus-label';
            sliderValue.textContent = getZoomLevel();

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '4';
            slider.max = '12';
            slider.value = getZoomLevel();
            slider.className = 'chat-plus-slider';

            // Event handlers
            const zoomHandler = (event) => {
                event.preventDefault();
                if (!isZooming) {
                    performQuickZoom().catch(console.error);
                }
            };

            const sliderHandler = (event) => {
                const value = event.target.value;
                sliderValue.textContent = value;
                setZoomLevel(value);
                const tooltip = `${i18n.buttonTooltip} ${value}`;
                sidebarButton.title = tooltip;
                floatingButton.title = tooltip;
            };

            slider.addEventListener('input', sliderHandler, { passive: true });
            sidebarButton.addEventListener('click', zoomHandler);
            floatingButton.addEventListener('click', zoomHandler);

            // Auto-zoom checkbox
            const autoCheckboxContainer = document.createElement('div');
            autoCheckboxContainer.className = 'chat-plus-checkbox-container';

            const autoCheckbox = document.createElement('input');
            autoCheckbox.type = 'checkbox';
            autoCheckbox.id = 'auto-zoom-' + Date.now();
            autoCheckbox.checked = getAutoZoomSetting();
            autoCheckbox.style.cssText = 'margin: 0; vertical-align: middle;';

            const autoLabel = document.createElement('label');
            autoLabel.htmlFor = autoCheckbox.id;
            autoLabel.textContent = i18n.autoLoadLabel;
            autoLabel.className = 'chat-plus-label';
            autoLabel.style.cssText = 'margin: 0; cursor: pointer; vertical-align: middle;';

            autoCheckbox.addEventListener('change', (event) => {
                setAutoZoomSetting(event.target.checked);
            }, { passive: true });

            // Visibility checkbox
            const visibilityCheckboxContainer = document.createElement('div');
            visibilityCheckboxContainer.className = 'chat-plus-checkbox-container';

            const visibilityCheckbox = document.createElement('input');
            visibilityCheckbox.type = 'checkbox';
            visibilityCheckbox.id = 'visibility-' + Date.now();
            visibilityCheckbox.checked = getVisibilitySetting();
            visibilityCheckbox.style.cssText = 'margin: 0; vertical-align: middle;';

            const visibilityLabel = document.createElement('label');
            visibilityLabel.htmlFor = visibilityCheckbox.id;
            visibilityLabel.textContent = i18n.visibilityLabel;
            visibilityLabel.className = 'chat-plus-label';
            visibilityLabel.style.cssText = 'margin: 0; cursor: pointer; vertical-align: middle;';

            visibilityCheckbox.addEventListener('change', (event) => {
                setVisibilitySetting(event.target.checked);
                if (event.target.checked) {
                    setTimeout(startVisibilityMonitoring, 500);
                } else {
                    stopVisibilityMonitoring();
                }
            }, { passive: true });

            // Auto-region checkbox
            const autoRegionCheckboxContainer = document.createElement('div');
            autoRegionCheckboxContainer.className = 'chat-plus-checkbox-container';

            const autoRegionCheckbox = document.createElement('input');
            autoRegionCheckbox.type = 'checkbox';
            autoRegionCheckbox.id = 'auto-region-' + Date.now();
            autoRegionCheckbox.checked = getAutoRegionSetting();
            autoRegionCheckbox.style.cssText = 'margin: 0; vertical-align: middle;';

            const autoRegionLabel = document.createElement('label');
            autoRegionLabel.htmlFor = autoRegionCheckbox.id;
            autoRegionLabel.textContent = i18n.autoRegionLabel;
            autoRegionLabel.className = 'chat-plus-label';
            autoRegionLabel.style.cssText = 'margin: 0; cursor: pointer; vertical-align: middle;';

            autoRegionCheckbox.addEventListener('change', (event) => {
                setAutoRegionSetting(event.target.checked);
            }, { passive: true });

            // Show floating button checkbox
            const showFloatingButtonCheckboxContainer = document.createElement('div');
            showFloatingButtonCheckboxContainer.className = 'chat-plus-checkbox-container';

            const showFloatingButtonCheckbox = document.createElement('input');
            showFloatingButtonCheckbox.type = 'checkbox';
            showFloatingButtonCheckbox.id = 'show-floating-button-' + Date.now();
            showFloatingButtonCheckbox.checked = getShowFloatingButtonSetting();
            showFloatingButtonCheckbox.style.cssText = 'margin: 0; vertical-align: middle;';

            const showFloatingButtonLabel = document.createElement('label');
            showFloatingButtonLabel.htmlFor = showFloatingButtonCheckbox.id;
            showFloatingButtonLabel.textContent = i18n.showFloatingButtonLabel;
            showFloatingButtonLabel.className = 'chat-plus-label';
            showFloatingButtonLabel.style.cssText = 'margin: 0; cursor: pointer; vertical-align: middle;';

            showFloatingButtonCheckbox.addEventListener('change', (event) => {
                setShowFloatingButtonSetting(event.target.checked);
                if (event.target.checked) {
                    floatingButton.style.display = 'block';
                } else {
                    floatingButton.style.display = 'none';
                }
            }, { passive: true });

            // Region section
            const regionSectionLabel = document.createElement('div');
            regionSectionLabel.className = 'chat-plus-label';
            regionSectionLabel.style.cssText = 'margin-top: 15px; padding-top: 10px; border-top: 1px solid #ddd; font-weight: bold;';
            regionSectionLabel.textContent = '🗺️ ' + i18n.regionLabel;

            // Region dropdown
            const regionSelect = document.createElement('select');
            regionSelect.id = 'wme-chat-plus-region-select';
            regionSelect.style.cssText = 'width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; margin-top: 5px;';

            const placeholderOpt = document.createElement('option');
            placeholderOpt.value = '';
            placeholderOpt.textContent = '-- Region wählen --';
            regionSelect.appendChild(placeholderOpt);

            // Group regions by country
            const countries = [
                { code: 'DACH', name: '🌍 DACH Gesamt', regions: ['DACH'] },
                { code: 'DE', name: '🇩🇪 Deutschland', regions: ['DE', 'BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NDS', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'] },
                { code: 'AT', name: '🇦🇹 Österreich', regions: ['AT', 'AT-1', 'AT-2', 'AT-3', 'AT-4', 'AT-5', 'AT-6', 'AT-7', 'AT-8', 'AT-9'] },
                { code: 'CH', name: '🇨🇭 Schweiz', regions: ['CH', 'CH-ZH', 'CH-BE', 'CH-LU', 'CH-AG', 'CH-SG', 'CH-GE', 'CH-BS', 'CH-TI', 'CH-VD', 'CH-VS', 'CH-GR'] }
            ];

            countries.forEach(country => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = country.name;
                country.regions.forEach(code => {
                    if (regionData[code]) {
                        const opt = document.createElement('option');
                        opt.value = code;
                        opt.textContent = regionData[code].name;
                        optgroup.appendChild(opt);
                    }
                });
                regionSelect.appendChild(optgroup);
            });

            // Load saved region
            const savedRegion = getSelectedRegion();
            if (savedRegion && regionData[savedRegion]) {
                regionSelect.value = savedRegion;
            }

            regionSelect.addEventListener('change', () => {
                setSelectedRegion(regionSelect.value);
            });

            // Current region display
            const currentRegionDisplay = document.createElement('div');
            currentRegionDisplay.className = 'chat-plus-label';
            currentRegionDisplay.style.cssText = 'margin-top: 5px; padding: 4px 8px; background: #f5f5f5; border-radius: 4px; font-size: 11px;';

            function updateCurrentRegionDisplay() {
                detectCurrentRegion();
                let text = i18n.currentRegionLabel + ' ';
                if (currentRegion.stateName) {
                    text += currentRegion.stateName;
                } else if (currentRegion.country) {
                    const names = { 'DE': 'Deutschland', 'AT': 'Österreich', 'CH': 'Schweiz' };
                    text += names[currentRegion.country] || currentRegion.country;
                } else {
                    text += 'Unbekannt';
                }
                currentRegionDisplay.textContent = text;

                if (currentRegion.state && regionData[currentRegion.state]) {
                    regionSelect.value = currentRegion.state;
                    setSelectedRegion(currentRegion.state);
                } else if (currentRegion.country && regionData[currentRegion.country]) {
                    regionSelect.value = currentRegion.country;
                    setSelectedRegion(currentRegion.country);
                }
            }

            // Detect button
            const detectButton = document.createElement('button');
            detectButton.className = 'waze-btn waze-btn-small';
            detectButton.textContent = i18n.detectRegionBtn;
            detectButton.title = 'Aktuelle Region erkennen';
            detectButton.type = 'button';
            detectButton.style.cssText = 'margin-top: 5px; margin-right: 5px;';
            detectButton.addEventListener('click', (e) => {
                e.preventDefault();
                updateCurrentRegionDisplay();
            });

            // Region zoom button
            const regionZoomButton = document.createElement('button');
            regionZoomButton.className = 'waze-btn waze-btn-small';
            regionZoomButton.textContent = i18n.regionButtonText;
            regionZoomButton.title = i18n.regionButtonTooltip;
            regionZoomButton.type = 'button';
            regionZoomButton.style.cssText = 'margin-top: 5px; background: linear-gradient(135deg, #4CAF50, #45a049); color: white;';

            regionZoomButton.addEventListener('click', async (e) => {
                e.preventDefault();
                const selectedRegion = regionSelect.value;
                if (!selectedRegion) {
                    alert('Bitte wähle zuerst eine Region aus!');
                    return;
                }
                regionZoomButton.disabled = true;
                regionZoomButton.textContent = '⏳ Zooming...';
                try {
                    await zoomToRegionForVisibility(selectedRegion);
                } finally {
                    regionZoomButton.disabled = false;
                    regionZoomButton.textContent = i18n.regionButtonText;
                }
            });

            // Button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; gap: 5px; flex-wrap: wrap;';
            buttonContainer.appendChild(detectButton);
            buttonContainer.appendChild(regionZoomButton);

            // Build DOM
            sliderContainer.appendChild(sliderLabel);
            sliderContainer.appendChild(slider);
            sliderContainer.appendChild(sliderValue);
            
            autoCheckboxContainer.appendChild(autoCheckbox);
            autoCheckboxContainer.appendChild(autoLabel);
            
            visibilityCheckboxContainer.appendChild(visibilityCheckbox);
            visibilityCheckboxContainer.appendChild(visibilityLabel);
            
            autoRegionCheckboxContainer.appendChild(autoRegionCheckbox);
            autoRegionCheckboxContainer.appendChild(autoRegionLabel);
            
            showFloatingButtonCheckboxContainer.appendChild(showFloatingButtonCheckbox);
            showFloatingButtonCheckboxContainer.appendChild(showFloatingButtonLabel);
            
            container.appendChild(sidebarButton);
            container.appendChild(sliderContainer);
            container.appendChild(visibilityCheckboxContainer);
            container.appendChild(autoCheckboxContainer);
            container.appendChild(autoRegionCheckboxContainer);
            container.appendChild(showFloatingButtonCheckboxContainer);
            container.appendChild(regionSectionLabel);
            container.appendChild(regionSelect);
            container.appendChild(currentRegionDisplay);
            container.appendChild(buttonContainer);
            
            tabPane.appendChild(container);
            document.body.appendChild(floatingButton);

            // Set initial floating button visibility
            if (!getShowFloatingButtonSetting()) {
                floatingButton.style.display = 'none';
            }

            // Wait for tab connection
            await W.userscripts.waitForElementConnected(tabPane);

            // Auto-zoom if enabled
            if (getAutoZoomSetting()) {
                setTimeout(() => {
                    performQuickZoom().catch(console.error);
                }, 2000);
            }

            // Auto-region if enabled
            if (getAutoRegionSetting()) {
                setTimeout(() => {
                    performAutoRegionZoom().catch(console.error);
                }, 2000);
            }

            // Start visibility monitoring
            setTimeout(() => {
                startVisibilityMonitoring();
            }, 1000);

            // Initial region detection
            setTimeout(() => {
                updateCurrentRegionDisplay();
            }, 2000);

            // Setup draft saving
            setTimeout(() => {
                setupDraftSaving();
            }, 3000);

            console.log('[WME Chat Plus] Successfully initialized');

        } catch (error) {
            console.error('[WME Chat Plus] Initialization error:', error);
        }
    }

    // Cleanup
    window.addEventListener('beforeunload', () => {
        stopVisibilityMonitoring();
    }, { passive: true });

    // Initialize
    function initialize() {
        try {
            if (window.W?.userscripts?.state?.isReady) {
                initializeScript();
            } else if (window.W?.userscripts) {
                document.addEventListener("wme-ready", initializeScript, { once: true, passive: true });
            } else {
                let attempts = 0;
                const maxAttempts = 60;
                
                const checkWME = () => {
                    attempts++;
                    if (window.W?.userscripts) {
                        if (window.W.userscripts.state?.isReady) {
                            initializeScript();
                        } else {
                            document.addEventListener("wme-ready", initializeScript, { once: true, passive: true });
                        }
                    } else if (attempts < maxAttempts) {
                        setTimeout(checkWME, 500);
                    } else {
                        console.error('[WME Chat Plus] WME could not be loaded after', maxAttempts * 500, 'ms');
                    }
                };
                checkWME();
            }
        } catch (error) {
            console.error('[WME Chat Plus] Setup error:', error);
        }
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true, passive: true });
    } else {
        initialize();
    }

})();