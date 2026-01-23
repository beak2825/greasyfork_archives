// ==UserScript==
// @name WME Multi Map Overlay
// @namespace https://greasyfork.org/de/users/863740-horst-wittlich
// @version 2025.12.08
// @description Erweiterte Version mit TopPlus, Dark Map, Basemap.de und allen DACH Geoportal Overlays - MIT GEO-LOKALISIERUNG
// @author Hiwi234
// @match https://www.waze.com/editor*
// @match https://www.waze.com/*/editor*
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @grant GM_info
// @connect sgx.geodatenzentrum.de
// @connect owsproxy.lgl-bw.de
// @connect www.wmts.nrw.de
// @connect geoservices.bayern.de
// @connect mapsneu.wien.gv.at
// @connect basemap.at
// @connect wmts.geo.admin.ch
// @connect www.geoportal.hessen.de
// @connect www.gds-srv.hessen.de
// @connect cdnjs.cloudflare.com
// @connect a.tile.openstreetmap.org
// @connect b.tile.openstreetmap.org
// @connect c.tile.openstreetmap.org
// @connect a.basemaps.cartocdn.com
// @connect b.basemaps.cartocdn.com
// @connect c.basemaps.cartocdn.com
// @connect a.tile.opentopomap.org
// @connect b.tile.opentopomap.org
// @connect c.tile.opentopomap.org
// @connect opendata.lgln.niedersachsen.de
// @connect www.gds-srv.hessen.de
// @connect gdi.berlin.de
// @connect isk.geobasis-bb.de
// @connect geodienste.hamburg.de
// @connect www.geodaten-mv.de
// @connect geo5.service24.rlp.de
// @connect geoportal.saarland.de
// @connect geodienste.sachsen.de
// @connect www.geodatenportal.sachsen-anhalt.de
// @connect dienste.gdi-sh.de
// @connect www.geoproxy.geoportal-th.de
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462482/WME%20Multi%20Map%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/462482/WME%20Multi%20Map%20Overlay.meta.js
// ==/UserScript==

(function() {
'use strict';

const SCRIPT_NAME = 'WME Multi Overlay';
const SCRIPT_ID = 'wme-multi-overlay';
const DEFAULT_OPACITY = 0.64;
const DEFAULT_ZINDEX = 2010;
const STORAGE_KEY = 'wme-overlay-settings';
const COLLAPSED_STATE_KEY = 'wme-overlay-collapsed-groups';
const GEO_FILTER_KEY = 'wme-overlay-geo-filter-enabled';

// Layer storage
const layers = {};
const layerMetadata = {};
let collapsedGroups = {};

// Layer-Status-Tracking
const layerStatus = {};  // { layerId: { status: 'ok'|'loading'|'error'|'offline', message: '', retries: 0 } }
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 Sekunden

// Globaler Ein/Aus-Schalter
let scriptEnabled = true;
const ENABLED_KEY = 'wme-overlay-enabled';

// ============================================
// GEO-LOKALISIERUNG SYSTEM
// ============================================

// Geo-Filter aktiviert/deaktiviert
let geoFilterEnabled = true;

// Aktuelle erkannte Region
let currentRegion = {
    country: null,      // 'DE', 'AT', 'CH' oder null
    state: null,        // Bundesland-Code (z.B. 'BY', 'NW', 'HE') oder null
    stateName: null     // Voller Name des Bundeslandes
};

// Mapping von WME State-Namen zu Bundesland-Codes
const stateNameToCode = {
    // Deutschland
    'Baden-Württemberg': 'BW',
    'Bayern': 'BY',
    'Berlin': 'BE',
    'Brandenburg': 'BB',
    'Bremen': 'HB',
    'Hamburg': 'HH',
    'Hessen': 'HE',
    'Mecklenburg-Vorpommern': 'MV',
    'Niedersachsen': 'NDS',
    'Nordrhein-Westfalen': 'NW',
    'Rheinland-Pfalz': 'RP',
    'Saarland': 'SL',
    'Sachsen': 'SN',
    'Sachsen-Anhalt': 'ST',
    'Schleswig-Holstein': 'SH',
    'Thüringen': 'TH',
    // Englische Varianten
    'Bavaria': 'BY',
    'Lower Saxony': 'NDS',
    'North Rhine-Westphalia': 'NW',
    'Rhineland-Palatinate': 'RP',
    'Saxony': 'SN',
    'Saxony-Anhalt': 'ST',
    'Thuringia': 'TH',
    'Mecklenburg-Western Pomerania': 'MV'
};

// Mapping von Länder-Namen zu Codes
const countryNameToCode = {
    'Germany': 'DE',
    'Deutschland': 'DE',
    'Austria': 'AT',
    'Österreich': 'AT',
    'Switzerland': 'CH',
    'Schweiz': 'CH',
    'Suisse': 'CH',
    'Svizzera': 'CH'
};

// Layer-Regionen-Zuordnung
const layerRegions = {
    // Basis Layer - überall in DACH verfügbar
    'basemap-de': { countries: ['DE'] },
    'basemap-de-grau': { countries: ['DE'] },
    'topplus': { countries: ['DE'] },
    'topplus-grau': { countries: ['DE'] },

    // Liegenschaftskarten - bundeslandspezifisch
    'alkis-by': { countries: ['DE'], states: ['BY'] },
    'alkis-be': { countries: ['DE'], states: ['BE'] },
    'alkis-bw': { countries: ['DE'], states: ['BW'] },
    'alkis-bb': { countries: ['DE'], states: ['BB'] },
    'alkis-hb': { countries: ['DE'], states: ['HB', 'NDS'] }, // Bremen nutzt NDS-Server
    'alkis-hh': { countries: ['DE'], states: ['HH'] },
    'alkis-he': { countries: ['DE'], states: ['HE'] },
    'alkis-mv': { countries: ['DE'], states: ['MV'] },
    'alkis-nds': { countries: ['DE'], states: ['NDS', 'HB'] },
    'alkis-nw': { countries: ['DE'], states: ['NW'] },
    'alkis-nw-grau': { countries: ['DE'], states: ['NW'] },
    'alkis-rp': { countries: ['DE'], states: ['RP'] },
    'alkis-sl': { countries: ['DE'], states: ['SL'] },
    'alkis-sn': { countries: ['DE'], states: ['SN'] },
    'alkis-st': { countries: ['DE'], states: ['ST'] },
    'alkis-sh': { countries: ['DE'], states: ['SH'] },
    'alkis-th': { countries: ['DE'], states: ['TH'] },

    // GeoOverlays DE - bundeslandspezifisch
    'geoportal-nrw': { countries: ['DE'], states: ['NW'] },
    'geoportal-nrw-overlay': { countries: ['DE'], states: ['NW'] },
    'geoportal-by': { countries: ['DE'], states: ['BY'] },
    'dop-nrw': { countries: ['DE'], states: ['NW'] },
    'dop-by': { countries: ['DE'], states: ['BY'] },
    'dop-nds': { countries: ['DE'], states: ['NDS', 'HB'] },
    'vg25-de': { countries: ['DE'] },
    'vg25-li-de': { countries: ['DE'] },
    'truedop-hessen': { countries: ['DE'], states: ['HE'] },

    // Österreich
    'basemap-at': { countries: ['AT'] },
    'overlay-at': { countries: ['AT'] },

    // Schweiz
    'swiss-strassen': { countries: ['CH'] },
    'swiss-basis': { countries: ['CH'] },
    'swiss-luft': { countries: ['CH'] },

    // Nicht amtliche Karten - überall verfügbar
    'osm-standard': { countries: ['DE', 'AT', 'CH'], global: true },
    'darkmap': { countries: ['DE', 'AT', 'CH'], global: true },
    'opentopomap': { countries: ['DE', 'AT', 'CH'], global: true }
};

// Ermittle aktuelle Region aus WME
function detectCurrentRegion() {
    try {
        // Methode 1: Über W.model.getTopCountry() und W.model.getTopState()
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

        // Methode 2: Fallback über Kartenzentrums-Koordinaten
        if (!currentRegion.country && W && W.map) {
            const center = W.map.getCenter();
            if (center) {
                // Grobe Koordinaten-basierte Erkennung
                const lon = center.lon;
                const lat = center.lat;

                // Transformiere von Web Mercator zu WGS84 falls nötig
                let wgs84Lon = lon, wgs84Lat = lat;
                if (Math.abs(lon) > 180 || Math.abs(lat) > 90) {
                    // Web Mercator -> WGS84
                    wgs84Lon = (lon / 20037508.34) * 180;
                    wgs84Lat = (Math.atan(Math.exp(lat * Math.PI / 20037508.34)) * 360 / Math.PI) - 90;
                }

                // Grobe Ländererkennung basierend auf Koordinaten
                if (wgs84Lon >= 5.8 && wgs84Lon <= 15.1 && wgs84Lat >= 47.2 && wgs84Lat <= 55.1) {
                    currentRegion.country = 'DE';
                    // Grobe Bundesland-Erkennung
                    currentRegion.state = detectGermanStateByCoords(wgs84Lon, wgs84Lat);
                } else if (wgs84Lon >= 9.5 && wgs84Lon <= 17.2 && wgs84Lat >= 46.3 && wgs84Lat <= 49.0) {
                    currentRegion.country = 'AT';
                } else if (wgs84Lon >= 5.9 && wgs84Lon <= 10.5 && wgs84Lat >= 45.8 && wgs84Lat <= 47.8) {
                    currentRegion.country = 'CH';
                }
            }
        }

        return currentRegion;
    } catch (error) {
        console.warn(SCRIPT_NAME + ': Fehler bei Region-Erkennung:', error);
        return currentRegion;
    }
}

// Grobe Bundesland-Erkennung basierend auf Koordinaten
function detectGermanStateByCoords(lon, lat) {
    // Vereinfachte Bounding Boxes für deutsche Bundesländer
    const stateBounds = {
        'SH': { minLon: 8.3, maxLon: 11.4, minLat: 53.3, maxLat: 55.1 },
        'HH': { minLon: 9.7, maxLon: 10.3, minLat: 53.4, maxLat: 53.7 },
        'MV': { minLon: 10.6, maxLon: 14.5, minLat: 53.1, maxLat: 54.7 },
        'HB': { minLon: 8.5, maxLon: 9.0, minLat: 53.0, maxLat: 53.6 },
        'NDS': { minLon: 6.6, maxLon: 11.6, minLat: 51.3, maxLat: 53.9 },
        'BE': { minLon: 13.1, maxLon: 13.8, minLat: 52.3, maxLat: 52.7 },
        'BB': { minLon: 11.3, maxLon: 14.8, minLat: 51.4, maxLat: 53.6 },
        'ST': { minLon: 10.5, maxLon: 13.2, minLat: 50.9, maxLat: 53.0 },
        'NW': { minLon: 5.8, maxLon: 9.5, minLat: 50.3, maxLat: 52.6 },
        'HE': { minLon: 7.8, maxLon: 10.3, minLat: 49.4, maxLat: 51.7 },
        'TH': { minLon: 9.9, maxLon: 12.7, minLat: 50.2, maxLat: 51.6 },
        'SN': { minLon: 11.9, maxLon: 15.1, minLat: 50.2, maxLat: 51.7 },
        'RP': { minLon: 6.1, maxLon: 8.5, minLat: 48.9, maxLat: 50.9 },
        'SL': { minLon: 6.4, maxLon: 7.4, minLat: 49.1, maxLat: 49.7 },
        'BW': { minLon: 7.5, maxLon: 10.5, minLat: 47.5, maxLat: 49.8 },
        'BY': { minLon: 8.9, maxLon: 13.9, minLat: 47.3, maxLat: 50.6 }
    };

    // Prüfe jedes Bundesland (Reihenfolge wichtig für überlappende Bereiche)
    const checkOrder = ['BE', 'HH', 'HB', 'SL', 'SH', 'MV', 'BB', 'ST', 'TH', 'SN', 'NW', 'HE', 'RP', 'BW', 'BY', 'NDS'];

    for (const state of checkOrder) {
        const bounds = stateBounds[state];
        if (lon >= bounds.minLon && lon <= bounds.maxLon &&
            lat >= bounds.minLat && lat <= bounds.maxLat) {
            return state;
        }
    }

    return null;
}

// Prüfe ob ein Layer für die aktuelle Region relevant ist
function isLayerRelevantForRegion(layerId) {
    // Wenn Geo-Filter deaktiviert, zeige alle Layer
    if (!geoFilterEnabled) return true;

    const regionConfig = layerRegions[layerId];

    // Wenn keine Region-Config, zeige Layer immer
    if (!regionConfig) return true;

    // Globale Layer immer anzeigen
    if (regionConfig.global) return true;

    // Prüfe Land
    if (regionConfig.countries && currentRegion.country) {
        if (!regionConfig.countries.includes(currentRegion.country)) {
            return false;
        }
    }

    // Prüfe Bundesland (nur wenn definiert)
    if (regionConfig.states && currentRegion.state) {
        if (!regionConfig.states.includes(currentRegion.state)) {
            return false;
        }
    } else if (regionConfig.states && !currentRegion.state) {
        // Wenn Layer bundeslandspezifisch ist aber kein Bundesland erkannt wurde,
        // zeige Layer trotzdem an (bessere UX)
        return true;
    }

    return true;
}

// Speichere Geo-Filter-Einstellung
function saveGeoFilterState() {
    try {
        localStorage.setItem(GEO_FILTER_KEY, JSON.stringify(geoFilterEnabled));
    } catch (e) {}
}

// Lade Geo-Filter-Einstellung
function loadGeoFilterState() {
    try {
        const saved = localStorage.getItem(GEO_FILTER_KEY);
        if (saved !== null) {
            geoFilterEnabled = JSON.parse(saved);
        }
    } catch (e) {
        geoFilterEnabled = true;
    }
}

// ============================================
// ENDE GEO-LOKALISIERUNG SYSTEM
// ============================================

function updateAllLayersVisibilityFromEnabled() {
    const settings = loadSettings();
    Object.keys(layers).forEach(layerId => {
        const layer = layers[layerId];
        if (!layer) return;
        const layerSettings = (settings.layers || {})[layerId] || {};
        const visible = !!layerSettings.visible;
        layer.setVisibility(scriptEnabled && visible);
    });
}

function setScriptEnabled(enabled, silent = false) {
    scriptEnabled = !!enabled;
    try { localStorage.setItem(ENABLED_KEY, JSON.stringify(scriptEnabled)); } catch (e) {}
    updateAllLayersVisibilityFromEnabled();
    const btn = document.getElementById('wme-overlay-toggle-btn');
    if (btn) {
        btn.textContent = scriptEnabled ? '🟢 Overlays AN' : '🔴 Overlays AUS';
        btn.setAttribute('aria-pressed', String(scriptEnabled));
    }
    document.dispatchEvent(new CustomEvent('wme-overlay-enabled-changed', { detail: { enabled: scriptEnabled } }));
}

function loadEnabledState() {
    let saved = null;
    try { saved = localStorage.getItem(ENABLED_KEY); } catch (e) {}
    if (saved !== null) {
        try { setScriptEnabled(JSON.parse(saved), true); return; } catch (e) {}
    }
    setScriptEnabled(true, true);
}

function toggleScriptEnabled() {
    setScriptEnabled(!scriptEnabled);
}

function createGlobalToggleUI() {
    let layerSidebarCheckbox = null;

    function buildSideItem() {
        const item = document.createElement('wz-checkbox');
        item.id = 'wme-overlay-side-toggle';
        item.checked = scriptEnabled;
        item.textContent = 'Multi Map';

        item.addEventListener('change', () => {
            toggleScriptEnabled();
            updateLayerSidebarCheckboxState();
        });

        layerSidebarCheckbox = item;

        document.addEventListener('wme-overlay-enabled-changed', (ev) => {
            updateLayerSidebarCheckboxState();
        });

        return item;
    }

    function updateLayerSidebarCheckboxState() {
        if (layerSidebarCheckbox) {
            layerSidebarCheckbox.checked = scriptEnabled;
        }
    }

    function findRightPanelInsertionPoint() {
        const sat = Array.from(document.querySelectorAll('label,div,span,button'))
            .find(el => /^\s*Satellitenbild\s*$/i.test((el.textContent||'')));
        if (sat) return { parent: sat.parentElement, mode: 'after' };

        const otherHeader = Array.from(document.querySelectorAll('h3,h4,button,div'))
            .find(el => /\bAndere Daten\b|\bOther Data\b|\bOther layers\b/i.test((el.textContent||'')));
        if (otherHeader) {
            const section = otherHeader.closest('section') || otherHeader.parentElement;
            const list = section && (section.querySelector('ul') || section.querySelector('div[role="group"],div'));
            if (list) return { parent: list, mode: 'prepend' };
        }

        const rightPanel = document.querySelector('[aria-label="Karten-Ebenen"],[data-testid="layers-panel"],.layers-panel,.panel-right');
        if (rightPanel) return { parent: rightPanel, mode: 'append' };
        return null;
    }

    function mountInPanel() {
        const target = findRightPanelInsertionPoint();
        if (!target) return false;
        if (document.getElementById('wme-overlay-side-toggle')) return true;
        const item = buildSideItem();
        if (target.mode === 'after' && target.parent) {
            target.parent.insertAdjacentElement('afterend', item);
        } else if (target.mode === 'prepend' && target.parent) {
            target.parent.insertBefore(item, target.parent.firstChild);
        } else if (target.parent) {
            target.parent.appendChild(item);
        } else {
            return false;
        }
        return true;
    }

    const mounted = mountInPanel();

    if (!mounted) {
        const observer = new MutationObserver(() => {
            if (mountInPanel()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    document.addEventListener('keydown', (ev) => {
        if (ev.altKey && (ev.key === 'o' || ev.key === 'O')) {
            ev.preventDefault();
            toggleScriptEnabled();
            updateLayerSidebarCheckboxState();
        }
    });

    window.updateLayerSidebarCheckbox = updateLayerSidebarCheckboxState;
}

// Settings Management
function saveSettings() {
    const settings = {
        version: GM_info.script.version,
        layers: {}
    };

    Object.keys(layers).forEach(layerId => {
        const layer = layers[layerId];
        if (layer) {
            const metadata = layerMetadata[layerId] || {};
            settings.layers[layerId] = {
                visible: layer.getVisibility(),
                opacity: layer.opacity || DEFAULT_OPACITY,
                zIndex: metadata.zIndex || layer.getZIndex() || DEFAULT_ZINDEX
            };
        }
    });

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Fehler beim Speichern der Settings:', error);
    }
}

function saveCollapsedState() {
    try {
        localStorage.setItem(COLLAPSED_STATE_KEY, JSON.stringify(collapsedGroups));
    } catch (error) {
        console.error('Fehler beim Speichern des Collapsed State:', error);
    }
}

function loadCollapsedState() {
    try {
        const saved = localStorage.getItem(COLLAPSED_STATE_KEY);
        if (saved) {
            collapsedGroups = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Fehler beim Laden der Collapsed State:', error);
        collapsedGroups = {};
    }
}

function saveGlobalFilters() {
    try {
        localStorage.setItem('wme-overlay-global-filters', JSON.stringify(globalFilters));
    } catch (error) {
        console.error('Fehler beim Speichern der globalen Filter:', error);
    }
}

// ============================================
// LAYER-STATUS-SYSTEM
// ============================================

// Setze Layer-Status und aktualisiere UI
function setLayerStatus(layerId, status, message = '') {
    layerStatus[layerId] = layerStatus[layerId] || { status: 'ok', message: '', retries: 0 };
    layerStatus[layerId].status = status;
    layerStatus[layerId].message = message;

    // UI aktualisieren
    updateLayerStatusUI(layerId);
}

// Aktualisiere Status-Anzeige in der UI
function updateLayerStatusUI(layerId) {
    const statusEl = document.querySelector(`[data-layer-status="${layerId}"]`);
    if (!statusEl) return;

    const info = layerStatus[layerId];
    if (!info) {
        statusEl.style.display = 'none';
        return;
    }

    statusEl.style.display = 'inline-block';

    switch (info.status) {
        case 'loading':
            statusEl.innerHTML = '⏳';
            statusEl.title = 'Wird geladen...';
            statusEl.style.color = '#ff9800';
            break;
        case 'error':
            statusEl.innerHTML = '⚠️';
            statusEl.title = info.message || 'Fehler beim Laden';
            statusEl.style.color = '#f44336';
            break;
        case 'offline':
            statusEl.innerHTML = '📡';
            statusEl.title = info.message ? `${info.message} - Klicken zum erneuten Versuch` : 'Server nicht erreichbar - Klicken zum erneuten Versuch';
            statusEl.style.color = '#9e9e9e';
            statusEl.style.cursor = 'pointer';
            break;
        case 'retrying':
            const retries = info.retries || 0;
            statusEl.innerHTML = '🔄';
            statusEl.title = `Verbindungsversuch ${retries}/${MAX_RETRIES}...`;
            statusEl.style.color = '#ff9800';
            break;
        default:
            statusEl.style.display = 'none';
    }
}

// Zeige Toast-Benachrichtigung
function showLayerToast(message, type = 'info') {
    // Validiere Nachricht - zeige keine leeren oder unverständlichen Meldungen
    if (!message || message.trim().length === 0) {
        return; // Keine leeren Toasts
    }

    // Entferne alte Toasts
    const oldToast = document.querySelector('.layer-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'layer-toast';

    const colors = {
        'error': { bg: '#ffebee', border: '#f44336', icon: '⚠️' },
        'warning': { bg: '#fff3e0', border: '#ff9800', icon: '⏳' },
        'success': { bg: '#e8f5e9', border: '#4caf50', icon: '✅' },
        'info': { bg: '#e3f2fd', border: '#2196f3', icon: 'ℹ️' }
    };
    const style = colors[type] || colors.info;

    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${style.bg};
        border: 1px solid ${style.border};
        border-left: 4px solid ${style.border};
        padding: 12px 16px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 13px;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;

    toast.innerHTML = `${style.icon} ${message}`;
    document.body.appendChild(toast);

    // Auto-hide nach 5 Sekunden
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function loadGlobalFilters() {
    try {
        const saved = localStorage.getItem('wme-overlay-global-filters');
        if (saved) {
            const filters = JSON.parse(saved);
            globalFilters = { ...globalFilters, ...filters };
        }
    } catch (error) {
        console.error('Fehler beim Laden der globalen Filter:', error);
    }
}

function loadSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Fehler beim Laden der Settings:', error);
    }
    return { layers: {} };
}

function applySettingsToLayer(layerId, layer) {
    const settings = loadSettings();
    const layerSettings = settings.layers[layerId];

    if (layerSettings) {
        if (!layerMetadata[layerId]) {
            layerMetadata[layerId] = {};
        }

        const shouldBeVisible = scriptEnabled && (layerSettings.visible || false);
        layer.setVisibility(shouldBeVisible);
        layer.setOpacity(layerSettings.opacity || DEFAULT_OPACITY);

        const zIndex = layerSettings.zIndex || DEFAULT_ZINDEX;
        layer.setZIndex(zIndex);
        layerMetadata[layerId].zIndex = zIndex;
    } else {
        if (!layerMetadata[layerId]) {
            layerMetadata[layerId] = {};
        }
        layer.setZIndex(DEFAULT_ZINDEX);
        layerMetadata[layerId].zIndex = DEFAULT_ZINDEX;
    }
}

// Filter-Updates
function updateAllLayerFilters() {
    const brightness = globalFilters.brightness;
    const contrast = globalFilters.contrast;
    const saturation = globalFilters.saturation;
    const sharpness = globalFilters.sharpness;

    let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    if (sharpness < 100) {
        const blurAmount = (100 - sharpness) / 100 * 2;
        filterString += ` blur(${blurAmount}px)`;
    } else if (sharpness > 100) {
        const extraContrast = 100 + (sharpness - 100) * 0.5;
        filterString += ` contrast(${extraContrast}%)`;
    }

    setTimeout(() => {
        const resetElems = document.querySelectorAll('#map canvas, #WazeMap canvas, .olLayerDiv');
        resetElems.forEach(el => {
            el.style.filter = '';
            el.style.webkitFilter = '';
        });

        Object.keys(layers).forEach(layerId => {
            const layer = layers[layerId];
            if (layer && layer.div) {
                layer.div.style.filter = filterString;
                layer.div.style.webkitFilter = filterString;
            }
        });

        const layerElements = document.querySelectorAll('.olLayerDiv');
        layerElements.forEach(element => {
            element.style.filter = filterString;
            element.style.webkitFilter = filterString;
        });

        const canvasElements = document.querySelectorAll('#map canvas, #WazeMap canvas');
        canvasElements.forEach(canvas => {
            canvas.style.filter = filterString;
            canvas.style.webkitFilter = filterString;
        });
    }, 100);
}


// Neu organisierte Layer-Konfiguration mit Region-Info
const layerGroups = {
    basic: {
        name: "🔧 Basis Layer",
        layers: [
            {
                id: 'basemap-de',
                name: 'Basemap.de',
                type: 'wms',
                url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
                params: {
                    layers: 'de_basemapde_web_raster_farbe',
                    format: 'image/png',
                    transparent: true
                },
                attribution: '© <a href="https://www.basemap.de">basemap.de</a>',
                region: { countries: ['DE'] }
            },
            {
                id: 'basemap-de-grau',
                name: 'Basemap.de Grau',
                type: 'wms',
                url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
                params: {
                    layers: 'de_basemapde_web_raster_grau',
                    format: 'image/png',
                    transparent: true
                },
                attribution: '© <a href="https://www.basemap.de">basemap.de</a>',
                region: { countries: ['DE'] }
            },
            {
                id: 'topplus',
                name: 'TopPlus WMS',
                type: 'wms',
                url: 'https://sgx.geodatenzentrum.de/wms_topplus_web_open',
                params: {
                    layers: 'web',
                    format: 'image/png',
                    transparent: true
                },
                attribution: '© BKG',
                region: { countries: ['DE'] }
            },
            {
                id: 'topplus-grau',
                name: 'TopPlus Grau',
                type: 'wms',
                url: 'https://sgx.geodatenzentrum.de/wms_topplus_web_open',
                params: {
                    layers: 'web_grau',
                    format: 'image/png',
                    transparent: true
                },
                attribution: '© BKG',
                region: { countries: ['DE'] }
            }
        ]
    },
    cadastre: {
        name: "📐 Liegenschaftskarten",
        layers: [
            {
                id: "alkis-by",
                name: "Liegenschaftskarte Bayern",
                type: "wmts",
                source: "https://geoservices.bayern.de/od/wmts/geobasis/v1/1.0.0/WMTSCapabilities.xml",
                layerName: "by_webkarte",
                matrixSet: "smerc",
                attribution: 'Bayerische Vermessungsverwaltung, GeoBasis-DE / BKG',
                region: { countries: ['DE'], states: ['BY'] }
            },
            {
                id: 'alkis-be',
                name: 'Liegenschaftskarte Berlin',
                type: 'wms',
                url: 'https://gdi.berlin.de/services/wms/alkis?SERVICE=wms',
                params: {
                    layers: 'a_alkis_raster',
                    format: 'image/png',
                    version: '1.3.0'
                },
                region: { countries: ['DE'], states: ['BE'] }
            },
            {
                id: 'alkis-bw',
                name: 'Liegenschaftskarte BW',
                type: 'wms',
                url: 'https://owsproxy.lgl-bw.de/owsproxy/ows/WMS_LGL-BW_ALKIS_Basis_Vertrieb?service=WMS',
                params: {
                    layers: 'nora:ALKIS_Basis_Vertrieb,nora:ALKIS_Beschriftung',
                    format: 'image/png',
                    version: '1.3.0'
                },
                attribution: 'LGL-BW',
                region: { countries: ['DE'], states: ['BW'] }
            },
            {
                id: 'alkis-bb',
                name: 'Liegenschaftskarte BB',
                type: 'wms',
                url: 'https://isk.geobasis-bb.de/ows/alkis_wms?service=WMS',
                params: {
                    layers: 'adv_alkis_gewaesser,adv_alkis_vegetation,adv_alkis_verkehr,adv_alkis_siedlung,adv_alkis_gebaeude,adv_alkis_flurstuecke',
                    format: 'image/png',
                    version: '1.3.0'
                },
                attribution: 'GeoBasis-DE/LGB',
                region: { countries: ['DE'], states: ['BB'] }
            },
            {
                id: 'alkis-hb',
                name: 'Liegenschaftskarte Bremen',
                type: 'wms',
                url: 'https://opendata.lgln.niedersachsen.de/doorman/noauth/alkishb_wms',
                params: {
                    layers: 'ALKIS',
                    styles: 'Farbe',
                    format: 'image/png',
                    version: '1.3.0'
                },
                attribution: 'Landesamt GeoInformation Bremen',
                region: { countries: ['DE'], states: ['HB'] }
            },
            {
                id: 'alkis-hh',
                name: 'Liegenschaftskarte Hamburg',
                type: 'wms',
                url: 'https://geodienste.hamburg.de/HH_WMS_ALKIS_Basiskarte?SERVICE=WMS',
                params: {
                    layers: '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,27,25,23,29,30',
                    format: 'image/png',
                    version: '1.3.0'
                },
                attribution: 'Freie und Hansestadt Hamburg, Landesbetrieb Geoinformation und Vermessung, 2014',
                region: { countries: ['DE'], states: ['HH'] }
            },
            {
                id: 'alkis-he',
                name: 'Liegenschaftskarte Hessen',
                type: 'wms',
                url: 'https://www.gds-srv.hessen.de/cgi-bin/lika-services/ogc-free-maps.ows',
                params: {
                    layers: 'he_alk',
                    format: 'image/png',
                    transparent: true,
                    version: '1.3.0'
                },
                attribution: 'Hessische Verwaltung für Bodenmanagement und Geoinformation',
                region: { countries: ['DE'], states: ['HE'] }
            },
            {
                id: 'alkis-mv',
                name: 'Liegenschaftskarte MV',
                type: 'wms',
                url: 'https://www.geodaten-mv.de/dienste/alkis_wms',
                params: {
                    layers: 'adv_alkis_tatsaechliche_nutzung,adv_alkis_gebaeude,adv_alkis_flurstuecke',
                    format: 'image/png',
                    version: '1.3.0'
                },
                attribution: 'GeoBasis-DE/M-V',
                region: { countries: ['DE'], states: ['MV'] }
            },
            {
                id: 'alkis-nds',
                name: 'Liegenschaftskarte NDS',
                type: 'wms',
                url: 'https://opendata.lgln.niedersachsen.de/doorman/noauth/alkis_wms',
                params: {
                    layers: 'ALKIS',
                    styles: 'Farbe',
                    format: 'image/png',
                    transparent: true,
                    version: '1.3.0'
                },
                attribution: 'GeoBasis-DE/LGLN',
                region: { countries: ['DE'], states: ['NDS'] }
            },
            {
                id: "alkis-nw",
                name: "Liegenschaftskarte NRW (Farbe)",
                type: "wmts",
                source: "https://www.wmts.nrw.de/geobasis/wmts_nw_alkis/1.0.0/WMTSCapabilities.xml",
                layerName: "nw_alkis",
                matrixSet: "EPSG_3857_16",
                region: { countries: ['DE'], states: ['NW'] }
            },
            {
                id: "alkis-nw-grau",
                name: "Liegenschaftskarte NRW (Grau)",
                type: "wmts",
                source: "https://www.wmts.nrw.de/geobasis/wmts_nw_alkis/1.0.0/WMTSCapabilities.xml",
                layerName: "nw_alkis_grau",
                matrixSet: "EPSG_3857_16",
                region: { countries: ['DE'], states: ['NW'] }
            },
            {
                id: 'alkis-rp',
                name: 'Liegenschaftskarte RLP',
                type: 'wms',
                url: 'https://geo5.service24.rlp.de/wms/liegenschaften_rp.fcgi',
                params: {
                    layers: 'Nutzung,GebaeudeBauwerke,Flurstueck,Lagebezeichnungen',
                    format: 'image/png',
                    version: '1.3.0'
                },
                attribution: 'GeoBasis-DE / LVermGeoRP',
                region: { countries: ['DE'], states: ['RP'] }
            },
            {
                id: 'alkis-sl',
                name: 'Liegenschaftskarte Saarland',
                type: 'wms',
                url: 'https://geoportal.saarland.de/geobasisdaten/mapserv?map=/mapfiles/geobasisdaten/Internet/alkis.map&SERVICE=WMS',
                params: {
                    layers: 'adv_alkis',
                    format: 'image/png',
                    version: '1.1.1'
                },
                attribution: 'GeoBasis DE/LVGL-SL',
                region: { countries: ['DE'], states: ['SL'] }
            },
            {
                id: 'alkis-sn',
                name: 'Liegenschaftskarte Sachsen',
                type: 'wms',
                url: 'https://geodienste.sachsen.de/wms_geosn_alkis-adv/guest',
                params: {
                    layers: 'adv_alkis_tatsaechliche_nutzung,adv_alkis_gebaeude,adv_alkis_flurstuecke,adv_alkis_fgp',
                    format: 'image/png'
                },
                attribution: 'Geodaten Sachsen',
                region: { countries: ['DE'], states: ['SN'] }
            },
            {
                id: 'alkis-st',
                name: 'Liegenschaftskarte ST',
                type: 'wms',
                url: 'https://www.geodatenportal.sachsen-anhalt.de/wss/service/ST_LVermGeo_ALKIS_WMS_AdV_konform_App/guest',
                params: {
                    layers: 'adv_alkis_tatsaechliche_nutzung,adv_alkis_gebaeude,st_alkis_flurstuecke',
                    format: 'image/png'
                },
                attribution: 'GeoBasis DE/LVermGeo ST',
                region: { countries: ['DE'], states: ['ST'] }
            },
            {
                id: 'alkis-sh',
                name: 'Liegenschaftskarte SH',
                type: 'wms',
                url: 'https://dienste.gdi-sh.de/WMS_SH_ALKIS_OpenGBD',
                params: {
                    layers: 'SH_ALKIS',
                    format: 'image/png'
                },
                attribution: 'GeoBasis-DE/LVermGeo SH',
                region: { countries: ['DE'], states: ['SH'] }
            },
            {
                id: 'alkis-th',
                name: 'Liegenschaftskarte Thüringen',
                type: 'wms',
                url: 'https://www.geoproxy.geoportal-th.de/geoproxy/services/adv_alkis_wms_th',
                params: {
                    layers: 'adv_alkis_gewaesser,adv_alkis_siedlung,adv_alkis_vegetation,adv_alkis_verkehr,adv_alkis_flurstuecke,adv_alkis_gebaeude',
                    format: 'image/png',
                    version: '1.3.0'
                },
                attribution: 'GDI-Th',
                region: { countries: ['DE'], states: ['TH'] }
            }
        ]
    },
    germany: {
        name: "🇩🇪 GeoOverlays DE",
        layers: [
            {
                id: "geoportal-nrw",
                name: "GeoPortal NRW",
                type: "wmts",
                source: "https://www.wmts.nrw.de/geobasis/wmts_nw_dtk/1.0.0/WMTSCapabilities.xml",
                layerName: "nw_dtk_col",
                matrixSet: "EPSG_3857_16",
                region: { countries: ['DE'], states: ['NW'] }
            },
            {
                id: "geoportal-nrw-overlay",
                name: "GeoPortal NRW Overlay",
                type: "wmts",
                source: "https://www.wmts.nrw.de/geobasis/wmts_nw_dop_overlay/1.0.0/WMTSCapabilities.xml",
                layerName: "nw_dop_overlay",
                matrixSet: "EPSG_3857_16",
                region: { countries: ['DE'], states: ['NW'] }
            },
            {
                id: "geoportal-by",
                name: "GeoPortal BY",
                type: "wmts",
                source: "https://geoservices.bayern.de/od/wmts/geobasis/v1/1.0.0/WMTSCapabilities.xml",
                layerName: "by_webkarte",
                matrixSet: "smerc",
                region: { countries: ['DE'], states: ['BY'] }
            },
            {
                id: "dop-nrw",
                name: "Luftbild NRW",
                type: "wmts",
                source: "https://www.wmts.nrw.de/geobasis/wmts_nw_dop/1.0.0/WMTSCapabilities.xml",
                layerName: "nw_dop",
                matrixSet: "EPSG_3857_16",
                region: { countries: ['DE'], states: ['NW'] }
            },
            {
                id: "dop-by",
                name: "Luftbild BY",
                type: "wmts",
                source: "https://geoservices.bayern.de/od/wmts/geobasis/v1/1.0.0/WMTSCapabilities.xml",
                layerName: "by_dop",
                matrixSet: "smerc",
                region: { countries: ['DE'], states: ['BY'] }
            },
            {
                id: 'dop-nds',
                name: 'Luftbild NDS',
                type: 'wms',
                url: 'https://opendata.lgln.niedersachsen.de/doorman/noauth/dop_wms',
                params: {
                    layers: 'ni_dop20',
                    format: 'image/png',
                    transparent: false,
                    version: '1.3.0',
                    crs: 'EPSG:3857'
                },
                attribution: '© LGLN 2024',
                region: { countries: ['DE'], states: ['NDS'] }
            },
            {
                id: 'vg25-de',
                name: 'Verwaltungsgebiete DE 1:25.000',
                type: 'wms',
                url: 'https://sg.geodatenzentrum.de/wms_vg25',
                params: {
                    layers: 'vg25',
                    format: 'image/png',
                    transparent: true
                },
                attribution: '© BKG',
                region: { countries: ['DE'] }
            },
            {
                id: 'vg25-li-de',
                name: 'Grenzlinien DE 1:25.000',
                type: 'wms',
                url: 'https://sg.geodatenzentrum.de/wms_vg25',
                params: {
                    layers: 'vg25_li',
                    format: 'image/png',
                    transparent: true
                },
                attribution: '© BKG',
                region: { countries: ['DE'] }
            },
            {
                id: 'truedop-hessen',
                name: 'TrueDOP Hessen (Luftbild)',
                type: 'wms',
                url: 'https://www.gds-srv.hessen.de/cgi-bin/lika-services/de-viewer/access/ogc-free-images.ows',
                params: {
                    layers: 'he_dop20_rgb',
                    format: 'image/jpeg',
                    transparent: false,
                    version: '1.3.0',
                    crs: 'EPSG:3857'
                },
                attribution: '© Hessische Verwaltung für Bodenmanagement und Geoinformation',
                region: { countries: ['DE'], states: ['HE'] }
            }
        ]
    },
    austria: {
        name: "🇦🇹 GeoOverlays AT",
        layers: [
            {
                id: "basemap-at",
                name: "Basemap AT",
                type: "wmts",
                source: "https://mapsneu.wien.gv.at/basemapneu/1.0.0/WMTSCapabilities.xml",
                layerName: "geolandbasemap",
                matrixSet: "google3857",
                region: { countries: ['AT'] }
            },
            {
                id: "overlay-at",
                name: "Overlay AT",
                type: "wmts",
                source: "https://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml",
                layerName: "bmapoverlay",
                matrixSet: "google3857",
                region: { countries: ['AT'] }
            }
        ]
    },
    switzerland: {
        name: "🇨🇭 GeoOverlays CH",
        layers: [
            {
                id: "swiss-strassen",
                name: "Strassenkarte",
                type: "wmts",
                source: "https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml",
                layerName: "ch.swisstopo.swisstne-base",
                matrixSet: "3857_18",
                region: { countries: ['CH'] }
            },
            {
                id: "swiss-basis",
                name: "Basisnetz",
                type: "wmts",
                source: "https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml",
                layerName: "ch.swisstopo.swisstlm3d-strassen",
                matrixSet: "3857_18",
                region: { countries: ['CH'] }
            },
            {
                id: "swiss-luft",
                name: "Luftbild",
                type: "wmts",
                source: "https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml",
                layerName: "ch.swisstopo.swissimage-product",
                matrixSet: "3857_20",
                region: { countries: ['CH'] }
            }
        ]
    },
    unofficial: {
        name: "🌍 Nicht Amtliche Karten",
        layers: [
            {
                id: 'osm-standard',
                name: 'OpenStreetMap Standard',
                type: 'xyz',
                urls: [
                    'https://a.tile.openstreetmap.org/${z}/${x}/${y}.png',
                    'https://b.tile.openstreetmap.org/${z}/${x}/${y}.png',
                    'https://c.tile.openstreetmap.org/${z}/${x}/${y}.png'
                ],
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                region: { global: true }
            },
            {
                id: 'darkmap',
                name: 'OSM Dark Matter',
                type: 'xyz',
                urls: [
                    'https://a.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}@2x.png',
                    'https://b.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}@2x.png',
                    'https://c.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}@2x.png'
                ],
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
                region: { global: true }
            },
            {
                id: 'opentopomap',
                name: 'OpenTopoMap',
                type: 'xyz',
                urls: [
                    'https://a.tile.opentopomap.org/${z}/${x}/${y}.png',
                    'https://b.tile.opentopomap.org/${z}/${x}/${y}.png',
                    'https://c.tile.opentopomap.org/${z}/${x}/${y}.png'
                ],
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
                region: { global: true }
            }
        ]
    }
};


// Hilfsfunktionen für OpenLayers Patches
function loadOLScript(filename) {
    const version = OpenLayers.VERSION_NUMBER.replace(/Release /, "");
    const url = `https://cdnjs.cloudflare.com/ajax/libs/openlayers/${version}/${filename}.js`;
    console.info("Loading openlayers/" + version + "/" + filename + ".js");
    const nonceEl = document.querySelector('script[nonce]');
    const nonce = nonceEl ? (nonceEl.nonce || nonceEl.getAttribute('nonce')) : null;

    try {
        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: (response) => {
                if (!response || typeof response.responseText !== 'string' || response.status !== 200) {
                    console.error(SCRIPT_NAME + ': Fehler beim Laden von', url, response && response.status);
                    return;
                }
                const script = document.createElement('script');
                script.type = 'text/javascript';
                if (nonce) script.setAttribute('nonce', nonce);
                script.textContent = response.responseText;
                document.head.appendChild(script);
            },
            onerror: (err) => {
                console.error(SCRIPT_NAME + ': Netzwerkfehler beim Laden von', url, err);
            }
        });
    } catch (e) {
        console.error(SCRIPT_NAME + ': Ausnahme beim Laden von', url, e);
    }
}

function patchOpenLayers() {
    if (!OpenLayers.VERSION_NUMBER.match(/^Release [0-9.]*$/)) {
        console.error("OpenLayers version mismatch - cannot apply patch");
        return;
    }

    const scripts = [
        "lib/OpenLayers/Format/XML",
        "lib/OpenLayers/Format/XML/VersionedOGC",
        "lib/OpenLayers/Layer/WMTS",
        "lib/OpenLayers/Format/OWSCommon",
        "lib/OpenLayers/Format/OWSCommon/v1",
        "lib/OpenLayers/Format/OWSCommon/v1_1_0",
        "lib/OpenLayers/Format/WMSCapabilities",
        "lib/OpenLayers/Format/WMSCapabilities/v1",
        "lib/OpenLayers/Format/WMSCapabilities/v1_3",
        "lib/OpenLayers/Format/WMSCapabilities/v1_3_0",
        "lib/OpenLayers/Format/WMTSCapabilities",
        "lib/OpenLayers/Format/WMTSCapabilities/v1_0_0"
    ];

    scripts.forEach((script, index) => {
        setTimeout(() => {
            loadOLScript(script);
        }, index * 50);
    });

    setTimeout(() => {
        const hasWMTS = typeof OpenLayers.Layer.WMTS === 'function';
        const hasCaps = typeof OpenLayers.Format.WMTSCapabilities === 'function';
        if (!hasWMTS || !hasCaps) {
            console.warn(SCRIPT_NAME + ': WMTS Komponenten nicht vollständig geladen, versuche erneut...');
            [
                "lib/OpenLayers/Layer/WMTS",
                "lib/OpenLayers/Format/WMTSCapabilities",
                "lib/OpenLayers/Format/WMTSCapabilities/v1_0_0"
            ].forEach((m, i) => setTimeout(() => loadOLScript(m), i * 50));
        } else {
            console.info(SCRIPT_NAME + ': WMTS Komponenten bereit.');
        }
    }, scripts.length * 50 + 600);
}

// Warte auf WMTS-Komponenten mit Timeout und Retry
async function waitForWMTSComponents(maxWaitMs = 10000) {
    const startTime = Date.now();
    const checkInterval = 200; // Prüfe alle 200ms
    
    return new Promise((resolve) => {
        const check = () => {
            const hasWMTS = typeof OpenLayers.Layer.WMTS === 'function';
            const hasCaps = typeof OpenLayers.Format.WMTSCapabilities === 'function';
            
            if (hasWMTS && hasCaps) {
                console.info(SCRIPT_NAME + ': WMTS-Komponenten verfügbar');
                resolve(true);
                return;
            }
            
            const elapsed = Date.now() - startTime;
            if (elapsed >= maxWaitMs) {
                console.warn(SCRIPT_NAME + ': WMTS-Komponenten nach ' + (maxWaitMs/1000) + 's nicht vollständig geladen');
                resolve(false);
                return;
            }
            
            setTimeout(check, checkInterval);
        };
        
        // Starte erste Prüfung nach kurzer Verzögerung
        setTimeout(check, 500);
    });
}

// Basis Layer erstellen
function createBasicLayer(config) {
    const olMap = W.map.getOLMap();
    let layer;

    switch (config.type) {
        case 'wms':
            layer = new OpenLayers.Layer.WMS(
                config.name,
                config.url,
                config.params,
                {
                    transitionEffect: 'resize',
                    attribution: config.attribution,
                    isBaseLayer: false,
                    visibility: false,
                    opacity: DEFAULT_OPACITY,
                    projection: new OpenLayers.Projection("EPSG:3857"),
                    displayInLayerSwitcher: false,
                    alwaysInRange: true,
                    zIndex: DEFAULT_ZINDEX
                }
            );
            break;

        case 'xyz':
            if (config.id === 'opentopomap') {
                layer = new OpenLayers.Layer.XYZ(
                    config.name,
                    config.urls,
                    {
                        attribution: config.attribution,
                        transitionEffect: 'resize',
                        isBaseLayer: false,
                        visibility: false,
                        opacity: DEFAULT_OPACITY,
                        displayInLayerSwitcher: false,
                        alwaysInRange: true,
                        sphericalMercator: true,
                        projection: new OpenLayers.Projection("EPSG:3857"),
                        zIndex: DEFAULT_ZINDEX,
                        getURL: function(bounds) {
                            var res = this.getServerResolution();
                            var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                            var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                            var z = this.getServerZoom();
                            var path = z + "/" + x + "/" + y + ".png";
                            var url = this.url;
                            if (OpenLayers.Util.isArray(url)) {
                                url = this.selectUrl(path, url);
                            }
                            return url.replace(/\$\{z\}/g, z).replace(/\$\{x\}/g, x).replace(/\$\{y\}/g, y);
                        }
                    }
                );
            } else {
                layer = new OpenLayers.Layer.XYZ(
                    config.name,
                    config.urls,
                    {
                        attribution: config.attribution,
                        transitionEffect: 'resize',
                        isBaseLayer: false,
                        visibility: false,
                        opacity: DEFAULT_OPACITY,
                        displayInLayerSwitcher: false,
                        alwaysInRange: true,
                        sphericalMercator: true,
                        projection: new OpenLayers.Projection("EPSG:3857"),
                        zIndex: DEFAULT_ZINDEX
                    }
                );
            }
            break;
    }

    if (layer) {
        layer.setOpacity(DEFAULT_OPACITY);
        olMap.addLayer(layer);
        layers[config.id] = layer;
        layerMetadata[config.id] = { zIndex: DEFAULT_ZINDEX };
        applySettingsToLayer(config.id, layer);
    }
}

// WMTS Layer erstellen mit Retry-Logik
function createWMTSLayer(layerConfig, retryCount = 0) {
    return new Promise((resolve, reject) => {
        // Prüfe ob Layer bereits erfolgreich geladen wurde (verhindert Race Conditions)
        if (layers[layerConfig.id] && layerStatus[layerConfig.id]?.status === 'ok') {
            console.log(`✓ ${layerConfig.name} bereits geladen, überspringe...`);
            resolve(layers[layerConfig.id]);
            return;
        }

        if (typeof OpenLayers.Format.WMTSCapabilities !== 'function') {
            console.warn(`⚠ WMTSCapabilities not available for ${layerConfig.name}, skipping...`);
            setLayerStatus(layerConfig.id, 'error', 'WMTS nicht verfügbar');
            reject(new Error("WMTSCapabilities constructor not available"));
            return;
        }

        // Status auf "loading" setzen
        if (retryCount === 0) {
            setLayerStatus(layerConfig.id, 'loading');
        } else {
            layerStatus[layerConfig.id] = layerStatus[layerConfig.id] || {};
            layerStatus[layerConfig.id].retries = retryCount;
            setLayerStatus(layerConfig.id, 'retrying', `Versuch ${retryCount}/${MAX_RETRIES}`);
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: layerConfig.source,
            timeout: 15000, // 15 Sekunden Timeout
            onload: (response) => {
                try {
                    // Prüfe HTTP-Status
                    if (response.status >= 400) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    // Prüfe ob Antwort leer ist
                    if (!response.responseText || response.responseText.trim().length === 0) {
                        throw new Error("Leere Server-Antwort");
                    }

                    let responseXML = response.responseXML;
                    if (!responseXML) {
                        responseXML = new DOMParser().parseFromString(response.responseText, "text/xml");
                    }

                    if (!responseXML || !(responseXML instanceof XMLDocument)) {
                        throw new Error("Ungültige XML-Antwort");
                    }

                    // Prüfe auf XML-Parser-Fehler
                    const parserError = responseXML.querySelector('parsererror');
                    if (parserError) {
                        throw new Error("XML-Parsing fehlgeschlagen");
                    }

                    // Prüfe ob WMTS-Format verfügbar ist
                    if (typeof OpenLayers.Format.WMTSCapabilities !== 'function') {
                        throw new Error("WMTS-Komponenten noch nicht geladen");
                    }
                    
                    const format = new OpenLayers.Format.WMTSCapabilities();
                    let capabilities;
                    try {
                        capabilities = format.read(responseXML);
                    } catch (parseError) {
                        console.warn(`WMTS-Parse-Fehler für ${layerConfig.name}:`, parseError);
                        // Prüfe ob es ein bekanntes Problem ist
                        if (parseError.message && parseError.message.includes('contents')) {
                            throw new Error("Server-Antwort unvollständig");
                        }
                        throw new Error("WMTS-Format nicht lesbar");
                    }

                    if (!capabilities) {
                        throw new Error("Leere Capabilities-Antwort");
                    }
                    
                    // Prüfe ob Contents vorhanden sind
                    if (!capabilities.contents || !capabilities.contents.layers) {
                        console.warn(`Keine Layer in Capabilities für ${layerConfig.name}`);
                        throw new Error("Keine Layer im Dienst gefunden");
                    }

                    let layer;
                    try {
                        layer = format.createLayer(capabilities, {
                            layer: layerConfig.layerName,
                            matrixSet: layerConfig.matrixSet,
                            opacity: DEFAULT_OPACITY,
                            isBaseLayer: false,
                            requestEncoding: layerConfig.requestEncoding || "REST",
                            visibility: false,
                            zIndex: DEFAULT_ZINDEX
                        });
                    } catch (layerError) {
                        console.warn(`Layer-Erstellung fehlgeschlagen für ${layerConfig.name}:`, layerError);
                        // Prüfe ob der Layer-Name existiert
                        const availableLayers = capabilities.contents.layers.map(l => l.identifier).join(', ');
                        console.info(`Verfügbare Layer: ${availableLayers}`);
                        throw new Error(`Layer "${layerConfig.layerName}" nicht gefunden`);
                    }

                    if (layer && layer.url && layer.url.length) {
                        const olMap = W.map.getOLMap();
                        olMap.addLayer(layer);
                        olMap.setLayerIndex(layer, 9);

                        layers[layerConfig.id] = layer;
                        layerMetadata[layerConfig.id] = { zIndex: DEFAULT_ZINDEX };
                        applySettingsToLayer(layerConfig.id, layer);

                        // Erfolg - Status zurücksetzen
                        setLayerStatus(layerConfig.id, 'ok');
                        if (retryCount > 0) {
                            showLayerToast(`${layerConfig.name} erfolgreich geladen`, 'success');
                        }

                        resolve(layer);
                    } else {
                        throw new Error("Keine gültigen Tile-URLs");
                    }

                } catch (error) {
                    console.error(`✗ Fehler beim Laden von ${layerConfig.name}:`, error);
                    handleLayerError(layerConfig, error, retryCount, resolve, reject);
                }
            },
            onerror: (error) => {
                console.error(`✗ Netzwerkfehler für ${layerConfig.name}:`, error);
                // Versuche mehr Details aus dem Error-Objekt zu extrahieren
                let errorMsg = "Netzwerkfehler";
                if (error && error.status) {
                    errorMsg = `HTTP ${error.status}`;
                } else if (error && error.message) {
                    errorMsg = error.message;
                }
                handleLayerError(layerConfig, new Error(errorMsg), retryCount, resolve, reject);
            },
            ontimeout: () => {
                console.error(`✗ Zeitüberschreitung für ${layerConfig.name}`);
                handleLayerError(layerConfig, new Error("Zeitüberschreitung (15s)"), retryCount, resolve, reject);
            }
        });
    });
}

// Fehlerbehandlung mit Retry-Logik
function handleLayerError(layerConfig, error, retryCount, resolve, reject) {
    // Prüfe ob Layer in der Zwischenzeit erfolgreich geladen wurde
    if (layers[layerConfig.id] && layerStatus[layerConfig.id]?.status === 'ok') {
        console.log(`✓ ${layerConfig.name} wurde in der Zwischenzeit geladen, ignoriere Fehler`);
        resolve(layers[layerConfig.id]);
        return;
    }

    const nextRetry = retryCount + 1;
    const errorMsg = error?.message || '';
    
    // Bei WMTS-Komponenten-Fehler länger warten
    const isComponentError = errorMsg.includes('Komponenten') || errorMsg.includes('nicht geladen');
    const retryDelay = isComponentError ? RETRY_DELAY * 2 : RETRY_DELAY;

    if (nextRetry <= MAX_RETRIES) {
        // Retry nach Verzögerung
        console.log(`🔄 Retry ${nextRetry}/${MAX_RETRIES} für ${layerConfig.name} in ${retryDelay/1000}s...`);
        setLayerStatus(layerConfig.id, 'retrying', `Versuch ${nextRetry}/${MAX_RETRIES}`);

        setTimeout(() => {
            createWMTSLayer(layerConfig, nextRetry).then(resolve).catch(reject);
        }, retryDelay);
    } else {
        // Alle Versuche fehlgeschlagen - bessere Fehlermeldung generieren
        const readableMsg = getReadableErrorMessage(error);
        setLayerStatus(layerConfig.id, 'offline', readableMsg);
        showLayerToast(`${layerConfig.name}: ${readableMsg}`, 'error');
        reject(error);
    }
}

// Generiere lesbare Fehlermeldung aus Error-Objekt
function getReadableErrorMessage(error) {
    // Wenn kein Error-Objekt
    if (!error) {
        return 'Verbindungsfehler';
    }

    // Wenn String
    if (typeof error === 'string') {
        return translateErrorMessage(error);
    }

    // Wenn Error-Objekt mit Message
    if (error.message) {
        return translateErrorMessage(error.message);
    }

    // Wenn Error-Objekt mit Status (HTTP-Fehler)
    if (error.status) {
        return getHttpErrorMessage(error.status);
    }

    // Wenn Error-Objekt mit statusText
    if (error.statusText) {
        return translateErrorMessage(error.statusText);
    }

    // Fallback: Versuche toString
    try {
        const str = String(error);
        if (str && str !== '[object Object]') {
            return translateErrorMessage(str);
        }
    } catch (e) {}

    return 'Verbindungsfehler';
}

// Übersetze englische Fehlermeldungen ins Deutsche
function translateErrorMessage(msg) {
    if (!msg) return 'Verbindungsfehler';

    const translations = {
        'No valid URLs found': 'Keine gültigen URLs gefunden',
        'Invalid XML response': 'Ungültige Server-Antwort',
        'Network error': 'Netzwerkfehler',
        'Timeout': 'Zeitüberschreitung',
        'timeout': 'Zeitüberschreitung',
        'Netzwerkfehler': 'Netzwerkfehler',
        'Zeitüberschreitung': 'Zeitüberschreitung',
        'Failed to fetch': 'Server nicht erreichbar',
        'NetworkError': 'Netzwerkfehler',
        'AbortError': 'Anfrage abgebrochen',
        'CORS': 'Zugriff verweigert (CORS)',
        'cors': 'Zugriff verweigert (CORS)'
    };

    // Exakte Übereinstimmung
    if (translations[msg]) {
        return translations[msg];
    }

    // Teilweise Übereinstimmung
    for (const [key, value] of Object.entries(translations)) {
        if (msg.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }

    // HTTP-Fehler erkennen
    const httpMatch = msg.match(/HTTP\s*(\d{3})/i);
    if (httpMatch) {
        return getHttpErrorMessage(parseInt(httpMatch[1]));
    }

    // Wenn Nachricht kurz genug, direkt zurückgeben
    if (msg.length < 50) {
        return msg;
    }

    return 'Server-Fehler';
}

// HTTP-Statuscode in lesbare Meldung umwandeln
function getHttpErrorMessage(status) {
    const httpErrors = {
        400: 'Ungültige Anfrage',
        401: 'Nicht autorisiert',
        403: 'Zugriff verweigert',
        404: 'Dienst nicht gefunden',
        408: 'Zeitüberschreitung',
        429: 'Zu viele Anfragen',
        500: 'Server-Fehler',
        502: 'Server nicht erreichbar',
        503: 'Dienst nicht verfügbar',
        504: 'Gateway-Zeitüberschreitung'
    };

    return httpErrors[status] || `HTTP-Fehler ${status}`;
}

// Manueller Retry für einen Layer
function retryLayerLoad(layerId) {
    // Finde Layer-Config
    let layerConfig = null;
    for (const group of Object.values(layerGroups)) {
        if (group.layers) {
            layerConfig = group.layers.find(l => l.id === layerId);
            if (layerConfig) break;
        }
    }

    if (!layerConfig) {
        console.error(`Layer-Config für ${layerId} nicht gefunden`);
        return;
    }

    // Reset Retry-Counter
    if (layerStatus[layerId]) {
        layerStatus[layerId].retries = 0;
    }

    showLayerToast(`${layerConfig.name} wird neu geladen...`, 'info');

    // Starte neuen Ladeversuch
    if (layerConfig.type === 'wmts') {
        createWMTSLayer(layerConfig, 0).catch(() => {
            // Fehler wird bereits in handleLayerError behandelt
        });
    } else {
        createBasicLayer(layerConfig);
        setLayerStatus(layerId, 'ok');
    }
}

// Update Notification System
function showUpdateNotification() {
    const lastShown = localStorage.getItem('wme-overlay-update-shown');
    const currentVersion = GM_info.script.version;

    if (lastShown === currentVersion) {
        return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'update-notification-overlay';
    overlay.innerHTML = `
        <div class="update-notification">
            <div class="update-header">
                <h2>WME Multi Map Overlay</h2>
                <div class="header-right">
                    <span class="version-badge">v${currentVersion}</span>
                    <button class="close-btn" id="header-close-btn">×</button>
                </div>
            </div>
            <div class="update-content">
                <h3>NEU: Geo-Filter & Verbindungsverbesserungen!</h3>
                <div class="new-features">
                    <div class="feature-group">
                        <h4>Geo-Filter:</h4>
                        <ul>
                            <li><strong>Automatische Regionserkennung</strong> - Erkennt Land und Bundesland</li>
                            <li><strong>Relevante Karten</strong> - Zeigt nur Karten fuer deine Region</li>
                            <li><strong>Kartenanzahl</strong> - Zeigt wie viele Karten verfuegbar sind</li>
                            <li><strong>Ein/Aus-Schalter</strong> - Filter kann deaktiviert werden</li>
                        </ul>
                    </div>
                    <div class="feature-group">
                        <h4>Verbindungsverbesserungen:</h4>
                        <ul>
                            <li><strong>Automatische Wiederholung</strong> - Bis zu 3 Versuche bei Fehlern</li>
                            <li><strong>Timeout-Erkennung</strong> - Erkennt langsame Server</li>
                            <li><strong>Status-Anzeige</strong> - Zeigt Ladestatus pro Karte</li>
                            <li><strong>Benachrichtigungen</strong> - Info bei Verbindungsproblemen</li>
                        </ul>
                    </div>
                </div>
                <div class="feature-info">
                    <p><strong>Tipp:</strong> Bei Verbindungsproblemen auf das Status-Symbol klicken zum erneuten Laden.</p>
                </div>
            </div>
            <div class="update-actions">
                <button class="btn-primary" id="explore-maps-btn">Los geht's!</button>
            </div>
        </div>
    `;

    const updateStyle = document.createElement('style');
    updateStyle.textContent = `
        .update-notification-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .update-notification {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: scale(0.9) translateY(-20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .update-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px 12px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .header-right {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .close-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .close-btn:hover { background: rgba(255, 255, 255, 0.3); }
        .update-header h2 { margin: 0; font-size: 24px; font-weight: 600; }
        .version-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
        }
        .update-content { padding: 24px; }
        .update-content h3 { margin: 0 0 20px 0; color: #333; font-size: 20px; }
        .new-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
        }
        .feature-group {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .feature-group h4 { margin: 0 0 12px 0; color: #333; font-size: 16px; font-weight: 600; }
        .feature-group ul { margin: 0; padding-left: 0; list-style: none; }
        .feature-group li { margin: 6px 0; color: #555; font-size: 14px; }
        .feature-info {
            background: #e3f2fd;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #2196f3;
        }
        .feature-info p { margin: 0; color: #1565c0; font-size: 14px; }
        .feature-info strong { font-weight: 600; }
        .update-actions {
            padding: 20px 24px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
        .btn-primary {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            background: #667eea;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .btn-primary:hover { background: #5a6fd8; transform: translateY(-1px); }
    `;
    document.head.appendChild(updateStyle);
    document.body.appendChild(overlay);

    overlay.querySelector('#explore-maps-btn').addEventListener('click', function() {
        overlay.remove();
        localStorage.setItem('wme-overlay-update-shown', currentVersion);
    });

    overlay.querySelector('#header-close-btn').addEventListener('click', function() {
        overlay.remove();
        localStorage.setItem('wme-overlay-update-shown', currentVersion);
    });

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
            localStorage.setItem('wme-overlay-update-shown', currentVersion);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.contains(overlay)) {
            overlay.remove();
            localStorage.setItem('wme-overlay-update-shown', currentVersion);
        }
    });
}

// Drag & Drop Funktionalität für Hauptmenüs/Kategorien
function makeGroupDraggable(container, groupKey) {
    container.dataset.groupKey = groupKey;

    const header = container.querySelector('.group-header');
    if (!header) return;

    const dragHandle = document.createElement('span');
    dragHandle.className = 'group-drag-handle';
    dragHandle.innerHTML = '⋮⋮';
    dragHandle.title = 'Kategorie verschieben';
    dragHandle.draggable = true;

    header.appendChild(dragHandle);

    dragHandle.addEventListener('dragstart', (e) => {
        container.classList.add('group-dragging');
        e.dataTransfer.setData('text/plain', groupKey);
        e.dataTransfer.effectAllowed = 'move';
        e.stopPropagation();
    });

    dragHandle.addEventListener('dragend', () => {
        container.classList.remove('group-dragging');
        document.querySelectorAll('.layer-group').forEach(el => {
            el.classList.remove('group-drop-target-above', 'group-drop-target-below');
        });
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const draggingElement = document.querySelector('.group-dragging');
        if (draggingElement && draggingElement !== container) {
            const rect = container.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;

            container.classList.remove('group-drop-target-above', 'group-drop-target-below');

            if (e.clientY < midY) {
                container.classList.add('group-drop-target-above');
            } else {
                container.classList.add('group-drop-target-below');
            }
        }
    });

    container.addEventListener('dragleave', (e) => {
        if (!container.contains(e.relatedTarget)) {
            container.classList.remove('group-drop-target-above', 'group-drop-target-below');
        }
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedGroupKey = e.dataTransfer.getData('text/plain');
        const draggedElement = document.querySelector(`[data-group-key="${draggedGroupKey}"]`);

        if (draggedElement && draggedElement !== container) {
            const rect = container.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            const parent = container.parentNode;

            if (e.clientY < midY) {
                parent.insertBefore(draggedElement, container);
            } else {
                parent.insertBefore(draggedElement, container.nextSibling);
            }

            saveGroupOrder();
        }

        container.classList.remove('group-drop-target-above', 'group-drop-target-below');
    });

    dragHandle.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });
}

function saveGroupOrder() {
    const overlayTab = document.querySelector('.overlay-tab');
    if (!overlayTab) return;

    const groupElements = overlayTab.querySelectorAll('.layer-group[data-group-key]');
    const order = Array.from(groupElements).map(el => el.dataset.groupKey);

    try {
        localStorage.setItem('wme-overlay-group-order', JSON.stringify(order));
    } catch (error) {
        console.error('Fehler beim Speichern der Gruppenreihenfolge:', error);
    }
}

function loadGroupOrder() {
    try {
        const saved = localStorage.getItem('wme-overlay-group-order');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Fehler beim Laden der Gruppenreihenfolge:', error);
    }
    return ['basic', 'cadastre', 'germany', 'austria', 'switzerland', 'unofficial'];
}


// Layer Control erstellen mit Geo-Filter-Unterstützung
function createLayerControl(layerId, name, isGroup = false, groupKey = null) {
    const container = document.createElement('div');
    container.className = isGroup ? 'layer-group' : 'layer-control';

    if (isGroup) {
        const header = document.createElement('div');
        header.className = 'group-header';
        header.style.cursor = 'pointer';

        const toggleButton = document.createElement('span');
        toggleButton.className = 'toggle-button';
        const shouldBeOpenByDefault = (
            groupKey === 'basic' ||
            groupKey === 'global-filters' ||
            groupKey === 'geo-settings' ||
            (typeof name === 'string' && name.indexOf('Karten Einstellungen') !== -1)
        );
        const isCollapsed = shouldBeOpenByDefault ? (collapsedGroups[groupKey] === false) : (collapsedGroups[groupKey] !== true);
        toggleButton.innerHTML = isCollapsed ? '▶' : '▼';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'group-title';
        titleSpan.textContent = name;

        header.appendChild(toggleButton);
        header.appendChild(titleSpan);

        const content = document.createElement('div');
        content.className = 'group-content';
        content.style.display = isCollapsed ? 'none' : 'block';

        header.addEventListener('click', () => {
            const isCurrentlyCollapsed = content.style.display === 'none';
            content.style.display = isCurrentlyCollapsed ? 'block' : 'none';
            toggleButton.innerHTML = isCurrentlyCollapsed ? '▼' : '▶';

            collapsedGroups[groupKey] = isCurrentlyCollapsed;
            saveCollapsedState();
        });

        container.appendChild(header);
        container.appendChild(content);
        container.content = content;

        makeGroupDraggable(container, groupKey);

        return container;
    }

    const layer = layers[layerId];
    if (!layer) return container;

    // Sichtbarkeits-Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = layer.getVisibility();
    checkbox.addEventListener('change', () => {
        layer.setVisibility(checkbox.checked);
        saveSettings();
    });

    const label = document.createElement('label');
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(name));

    // Status-Indikator für Layer
    const statusIndicator = document.createElement('span');
    statusIndicator.className = 'layer-status-indicator';
    statusIndicator.dataset.layerStatus = layerId;
    statusIndicator.style.cssText = 'margin-left: 6px; font-size: 12px; display: none;';

    // Klick auf Offline-Status startet Retry
    statusIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        const status = layerStatus[layerId];
        if (status && status.status === 'offline') {
            retryLayerLoad(layerId);
        }
    });

    label.appendChild(statusIndicator);

    // Initial Status anzeigen
    updateLayerStatusUI(layerId);

    // Transparenz-Slider
    const opacityContainer = document.createElement('div');
    opacityContainer.className = 'slider-container';

    const opacityLabel = document.createElement('span');
    opacityLabel.textContent = 'Transparenz: ';

    const opacityValue = document.createElement('span');
    opacityValue.className = 'slider-value';
    opacityValue.textContent = Math.round((layer.opacity || DEFAULT_OPACITY) * 100) + '%';

    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.min = '0';
    opacitySlider.max = '100';
    opacitySlider.step = '1';
    opacitySlider.value = Math.round((layer.opacity || DEFAULT_OPACITY) * 100);

    opacitySlider.addEventListener('input', () => {
        const value = parseInt(opacitySlider.value) / 100;
        layer.setOpacity(value);
        layer.opacity = value;
        opacityValue.textContent = opacitySlider.value + '%';
        saveSettings();
    });

    opacityContainer.appendChild(opacityLabel);
    opacityContainer.appendChild(opacitySlider);
    opacityContainer.appendChild(opacityValue);

    // Z-Index-Slider
    const zIndexContainer = document.createElement('div');
    zIndexContainer.className = 'slider-container';

    const zIndexLabel = document.createElement('span');
    zIndexLabel.textContent = 'Ebene: ';

    const zIndexValue = document.createElement('span');
    zIndexValue.className = 'slider-value';

    const currentZIndex = layerMetadata[layerId]?.zIndex || layer.getZIndex() || DEFAULT_ZINDEX;
    zIndexValue.textContent = currentZIndex;

    const zIndexSlider = document.createElement('input');
    zIndexSlider.type = 'range';
    zIndexSlider.min = '1900';
    zIndexSlider.max = '2500';
    zIndexSlider.step = '5';
    zIndexSlider.value = currentZIndex;

    zIndexSlider.addEventListener('input', () => {
        const zIndex = parseInt(zIndexSlider.value);
        layer.setZIndex(zIndex);

        if (!layerMetadata[layerId]) {
            layerMetadata[layerId] = {};
        }
        layerMetadata[layerId].zIndex = zIndex;

        zIndexValue.textContent = zIndex;
        saveSettings();
    });

    zIndexContainer.appendChild(zIndexLabel);
    zIndexContainer.appendChild(zIndexSlider);
    zIndexContainer.appendChild(zIndexValue);

    container.appendChild(label);
    container.appendChild(opacityContainer);
    container.appendChild(zIndexContainer);

    // Legende-Buttons für Basemap.de
    if (layerId === 'basemap-de') {
        const legendContainer = document.createElement('div');
        legendContainer.className = 'legend-container';
        legendContainer.style.cssText = 'margin-top: 6px; display: flex; gap: 3px;';

        const legendButton = createSmallButton('📋 Legende', '#4CAF50', '#45a049', () => {
            window.open('https://basemap.de/produkte-und-dienste/web-raster/legende-web-raster-farbe/', '_blank');
        });

        const kartenstadButton = createSmallButton('📅 Kartenstand', '#2196F3', '#1976D2', () => {
            window.open('https://basemap.de/data/produkte/web_raster/meta/bm_web_raster_datenaktualitaet.html', '_blank');
        });

        legendContainer.appendChild(legendButton);
        legendContainer.appendChild(kartenstadButton);
        container.appendChild(legendContainer);
    }

    // Legende-Buttons für TopPlus WMS
    if (layerId === 'topplus') {
        const legendContainer = document.createElement('div');
        legendContainer.className = 'legend-container';
        legendContainer.style.cssText = 'margin-top: 6px; display: flex; gap: 3px;';

        const legendButton = createSmallButton('📋 Legende', '#4CAF50', '#45a049', () => {
            window.open('https://sgx.geodatenzentrum.de/web_public/gdz/dokumentation/deu/topplusopen.pdf', '_blank');
        });

        const kartenstadButton = createSmallButton('📅 Kartenstand', '#2196F3', '#1976D2', () => {
            window.open('https://sgx.geodatenzentrum.de/web_public/gdz/datenquellen/datenquellen_topplusopen.pdf', '_blank');
        });

        legendContainer.appendChild(legendButton);
        legendContainer.appendChild(kartenstadButton);
        container.appendChild(legendContainer);
    }

    return container;
}

// Hilfsfunktion für kleine Buttons
function createSmallButton(text, bgColor, hoverColor, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
        background: linear-gradient(135deg, ${bgColor}, ${hoverColor});
        color: white;
        border: none;
        padding: 0px 6px;
        border-radius: 4px;
        font-size: 10px;
        line-height: 1;
        height: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        flex: 1;
    `;

    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-1px)';
        button.style.boxShadow = '0 2px 3px rgba(0,0,0,0.15)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
    });

    button.addEventListener('click', onClick);
    return button;
}

// Globale Filter-Einstellungen
let globalFilters = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 100
};

function createGlobalFilterControls() {
    const container = createLayerControl(null, '🎨 Karten Einstellungen', true, 'global-filters');
    const content = container.content;

    // Helligkeit-Slider
    content.appendChild(createFilterSlider('Helligkeit', globalFilters.brightness, (value) => {
        globalFilters.brightness = value;
        updateAllLayerFilters();
        saveGlobalFilters();
    }));

    // Kontrast-Slider
    content.appendChild(createFilterSlider('Kontrast', globalFilters.contrast, (value) => {
        globalFilters.contrast = value;
        updateAllLayerFilters();
        saveGlobalFilters();
    }));

    // Sättigung-Slider
    content.appendChild(createFilterSlider('Sättigung', globalFilters.saturation, (value) => {
        globalFilters.saturation = value;
        updateAllLayerFilters();
        saveGlobalFilters();
    }));

    // Schärfe-Slider
    content.appendChild(createFilterSlider('Schärfe', globalFilters.sharpness, (value) => {
        globalFilters.sharpness = value;
        updateAllLayerFilters();
        saveGlobalFilters();
    }));

    return container;
}

function createFilterSlider(label, initialValue, onChange) {
    const container = document.createElement('div');
    container.className = 'slider-container global-filter';

    const labelSpan = document.createElement('span');
    labelSpan.textContent = label + ': ';

    const valueSpan = document.createElement('span');
    valueSpan.className = 'slider-value';
    valueSpan.textContent = initialValue + '%';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '300';
    slider.step = '1';
    slider.value = initialValue;

    slider.addEventListener('input', () => {
        const value = parseInt(slider.value);
        valueSpan.textContent = value + '%';
        onChange(value);
    });

    container.appendChild(labelSpan);
    container.appendChild(slider);
    container.appendChild(valueSpan);

    return container;
}

// ============================================
// GEO-FILTER UI (Kompakt)
// ============================================

// Erstelle kompakte Geo-Filter Sektion
function createGeoSettingsControls() {
    const container = document.createElement('div');
    container.className = 'layer-group geo-filter-section';
    container.dataset.groupKey = 'geo-settings';

    // Funktion zum Aktualisieren des Styles (aktiv = grün, inaktiv = normal)
    const updateContainerStyle = (isActive) => {
        if (isActive) {
            container.classList.add('geo-filter-active');
        } else {
            container.classList.remove('geo-filter-active');
        }
    };

    // Collapsed State laden
    const isCollapsed = collapsedGroups['geo-settings'] === true;

    // Header mit Toggle (wie group-header)
    const header = document.createElement('div');
    header.className = 'geo-filter-header group-header';
    header.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
    `;

    const leftSide = document.createElement('div');
    leftSide.style.cssText = 'display: flex; align-items: center; gap: 6px;';

    // Toggle-Pfeil für Ein-/Ausklappen
    const toggleArrow = document.createElement('span');
    toggleArrow.className = 'toggle-button';
    toggleArrow.innerHTML = isCollapsed ? '▶' : '▼';
    toggleArrow.style.cssText = 'font-size: 10px; color: #666; width: 12px;';

    const icon = document.createElement('span');
    icon.textContent = '📍';
    icon.style.fontSize = '14px';

    const title = document.createElement('span');
    title.textContent = 'Geo-Filter';
    title.style.cssText = 'font-weight: 600; font-size: 13px; color: #333;';

    leftSide.appendChild(toggleArrow);
    leftSide.appendChild(icon);
    leftSide.appendChild(title);

    // Aktiv-Checkbox rechts (mit Abstand für Drag-Handle)
    const rightSide = document.createElement('div');
    rightSide.style.cssText = 'display: flex; align-items: center; gap: 5px; margin-right: 24px;';
    rightSide.addEventListener('click', (e) => e.stopPropagation());

    const toggleLabel = document.createElement('label');
    toggleLabel.htmlFor = 'geo-filter-toggle';
    toggleLabel.textContent = 'Aktiv';
    toggleLabel.style.cssText = 'cursor: pointer; font-size: 13px; color: #555;';

    const toggleCheckbox = document.createElement('input');
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.id = 'geo-filter-toggle';
    toggleCheckbox.checked = geoFilterEnabled;
    toggleCheckbox.style.cssText = 'width: 14px; height: 14px; cursor: pointer; margin: 0; accent-color: auto;';

    rightSide.appendChild(toggleLabel);
    rightSide.appendChild(toggleCheckbox);

    header.appendChild(leftSide);
    header.appendChild(rightSide);
    container.appendChild(header);

    // Content (Region-Anzeige)
    const content = document.createElement('div');
    content.className = 'geo-filter-content group-content';
    content.id = 'geo-status-display';
    content.style.cssText = `
        padding: 8px 10px;
        font-size: 12px;
        color: #555;
        display: ${isCollapsed ? 'none' : 'block'};
    `;
    updateGeoStatusDisplay(content);
    container.appendChild(content);
    container.content = content;

    // Initial Style setzen
    updateContainerStyle(geoFilterEnabled);

    // Toggle Event für Checkbox
    toggleCheckbox.addEventListener('change', () => {
        geoFilterEnabled = toggleCheckbox.checked;
        updateContainerStyle(geoFilterEnabled);
        saveGeoFilterState();
        updateGeoStatusDisplay(content);
        refreshLayerUI();
    });

    // Klick auf Header klappt ein/aus
    header.addEventListener('click', () => {
        const isCurrentlyCollapsed = content.style.display === 'none';
        content.style.display = isCurrentlyCollapsed ? 'block' : 'none';
        toggleArrow.innerHTML = isCurrentlyCollapsed ? '▼' : '▶';

        // Speichere Collapsed State
        collapsedGroups['geo-settings'] = !isCurrentlyCollapsed;
        saveCollapsedState();
    });

    // Drag & Drop aktivieren
    makeGroupDraggable(container, 'geo-settings');

    return container;
}

// Zähle verfügbare Layer für aktuelle Region
function countVisibleLayers() {
    let total = 0;
    let visible = 0;

    Object.values(layerGroups).forEach(group => {
        if (group.layers) {
            group.layers.forEach(layerConfig => {
                if (layerConfig.id && layers[layerConfig.id]) {
                    total++;
                    if (isLayerRelevantForRegion(layerConfig.id)) {
                        visible++;
                    }
                }
            });
        }
    });

    return { total, visible };
}

// Aktualisiere Geo-Status-Anzeige (kompakt)
function updateGeoStatusDisplay(element) {
    if (!element) {
        element = document.getElementById('geo-status-display');
    }
    if (!element) return;

    detectCurrentRegion();

    let statusHTML = '';

    // Bundesland-Badge immer anzeigen wenn erkannt
    let regionText = '';
    if (currentRegion.stateName) {
        regionText = `🗺️ ${currentRegion.stateName}`;
    } else if (currentRegion.country) {
        const countryNames = { 'DE': 'Deutschland', 'AT': 'Österreich', 'CH': 'Schweiz' };
        regionText = `🗺️ ${countryNames[currentRegion.country] || currentRegion.country}`;
    }

    if (regionText) {
        statusHTML = `<span style="background:#fff;padding:3px 8px;border-radius:4px;border:1px solid #ddd;display:inline-block;">${regionText}</span>`;
    } else {
        statusHTML = '<span style="color:#999;font-style:italic;">Region wird erkannt...</span>';
    }

    // Zusatzinfo je nach Filter-Status
    if (geoFilterEnabled) {
        const counts = countVisibleLayers();
        statusHTML += `<div style="color:#666;font-size:11px;margin-top:4px;">${counts.visible} von ${counts.total} Karten</div>`;
    } else {
        statusHTML += '<div style="color:#888;font-style:italic;font-size:11px;margin-top:4px;">Alle Layer werden angezeigt (Filter deaktiviert).</div>';
    }

    element.innerHTML = statusHTML;
}

// Aktualisiere Layer-UI basierend auf Geo-Filter
function refreshLayerUI() {
    const overlayTab = document.querySelector('.overlay-tab');
    if (!overlayTab) return;

    // Entferne alte Layer-Gruppen (außer Einstellungen)
    const oldGroups = overlayTab.querySelectorAll('.layer-group:not([data-group-key="global-filters"]):not([data-group-key="geo-settings"])');
    oldGroups.forEach(g => g.remove());

    // Füge Layer-Gruppen neu hinzu
    const savedGroupOrder = loadGroupOrder();
    const geoSettingsGroup = overlayTab.querySelector('[data-group-key="geo-settings"]');
    const insertBefore = geoSettingsGroup || overlayTab.querySelector('[data-group-key="global-filters"]');

    savedGroupOrder.forEach(groupKey => {
        if (layerGroups[groupKey]) {
            const group = layerGroups[groupKey];

            // Filtere Layer basierend auf Region
            const relevantLayers = group.layers.filter(layerConfig => {
                if (!layerConfig.id) return false;
                return isLayerRelevantForRegion(layerConfig.id);
            });

            // Überspringe leere Gruppen
            if (relevantLayers.length === 0) return;

            const groupContainer = createLayerControl(null, group.name, true, groupKey);

            relevantLayers.forEach(layerConfig => {
                if (layers[layerConfig.id]) {
                    groupContainer.content.appendChild(createLayerControl(layerConfig.id, layerConfig.name));
                }
            });

            if (insertBefore) {
                overlayTab.insertBefore(groupContainer, insertBefore);
            } else {
                overlayTab.appendChild(groupContainer);
            }
        }
    });
}

// Event-Listener für Kartenverschiebung
function setupMapMoveListener() {
    if (W && W.map) {
        // Debounce für Performance
        let moveTimeout = null;

        W.map.events.register('moveend', null, () => {
            if (moveTimeout) clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                const oldState = currentRegion.state;
                const oldCountry = currentRegion.country;

                detectCurrentRegion();

                // Nur UI aktualisieren wenn sich Region geändert hat
                if (oldState !== currentRegion.state || oldCountry !== currentRegion.country) {
                    updateGeoStatusDisplay();
                    if (geoFilterEnabled) {
                        refreshLayerUI();
                    }
                }
            }, 500);
        });
    }
}


// ============================================
// INITIALISIERUNG
// ============================================

async function initializeScript() {
    try {
        // Registriere Script-Info
        W.userscripts[SCRIPT_ID] = {
            name: SCRIPT_NAME,
            author: 'Hiwi234',
            version: GM_info.script.version
        };

        // Lade gespeicherte Zustände
        loadCollapsedState();
        loadGeoFilterState();

        // Globaler Overlayschalter: Zustand laden und UI erstellen
        loadEnabledState();
        createGlobalToggleUI();

        // Patche OpenLayers für WMTS Support
        patchOpenLayers();

        // Warte auf WMTS-Komponenten mit Prüfung
        await waitForWMTSComponents();

        // Erkenne initiale Region
        detectCurrentRegion();
        console.info(SCRIPT_NAME + ': Region erkannt -', currentRegion.country, currentRegion.state);

        // Erstelle alle Layer
        const wmtsPromises = [];

        Object.keys(layerGroups).forEach(groupKey => {
            const group = layerGroups[groupKey];
            group.layers.forEach(layerConfig => {
                if (!layerConfig.id) return;

                if (layerConfig.type === 'wmts') {
                    wmtsPromises.push(createWMTSLayer(layerConfig));
                } else {
                    createBasicLayer(layerConfig);
                }
            });
        });

        // Warte auf alle WMTS Layer
        await Promise.allSettled(wmtsPromises);

        // Wende globalen Ein/Aus-Zustand auf alle Layer an
        setScriptEnabled(scriptEnabled, true);

        // Erstelle Sidebar Tab
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(SCRIPT_ID);
        tabLabel.textContent = 'Multi Map 🗺️';
        tabLabel.title = 'Erweiterte Karten-Overlays mit Geo-Lokalisierung';

        await W.userscripts.waitForElementConnected(tabPane);

        // Erstelle Content Container
        const content = document.createElement('div');
        content.className = 'overlay-tab';

        // Lade globale Filter-Einstellungen
        loadGlobalFilters();

        // Füge alle Gruppen in der gespeicherten Reihenfolge hinzu (gefiltert nach Region)
        const savedGroupOrder = loadGroupOrder();
        savedGroupOrder.forEach(groupKey => {
            if (layerGroups[groupKey]) {
                const group = layerGroups[groupKey];

                // Filtere Layer basierend auf Region
                const relevantLayers = group.layers.filter(layerConfig => {
                    if (!layerConfig.id) return false;
                    return isLayerRelevantForRegion(layerConfig.id);
                });

                // Überspringe leere Gruppen
                if (relevantLayers.length === 0) return;

                const groupContainer = createLayerControl(null, group.name, true, groupKey);

                relevantLayers.forEach(layerConfig => {
                    if (layers[layerConfig.id]) {
                        groupContainer.content.appendChild(createLayerControl(layerConfig.id, layerConfig.name));
                    }
                });
                content.appendChild(groupContainer);
            }
        });

        // Füge Geo-Filter über Karten Einstellungen hinzu
        content.appendChild(createGeoSettingsControls());

        // Füge globale Filter-Kontrollen am Ende hinzu
        content.appendChild(createGlobalFilterControls());

        tabPane.appendChild(content);

        // Füge Reset-Button hinzu
        const resetContainer = document.createElement('div');
        resetContainer.className = 'reset-container';

        const resetButton = document.createElement('button');
        resetButton.textContent = '🔄 Alles zurücksetzen';
        resetButton.className = 'reset-button';
        resetButton.addEventListener('click', () => {
            if (confirm('Alle Einstellungen zurücksetzen?')) {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem('wme-overlay-global-filters');
                localStorage.removeItem(COLLAPSED_STATE_KEY);
                localStorage.removeItem('wme-overlay-group-order');
                localStorage.removeItem(GEO_FILTER_KEY);
                location.reload();
            }
        });

        resetContainer.appendChild(resetButton);
        tabPane.appendChild(resetContainer);

        // Füge Styles hinzu
        addStyles();

        // Zeige Update-Benachrichtigung
        showUpdateNotification();

        // Initiale Anwendung der globalen Filter
        setTimeout(() => {
            updateAllLayerFilters();
        }, 2000);

        // Setup Map Move Listener für dynamische Region-Updates
        setupMapMoveListener();

        console.info(SCRIPT_NAME + ': Initialisierung abgeschlossen');

    } catch (error) {
        console.error(SCRIPT_NAME + ': Fehler bei der Initialisierung:', error);
    }
}

function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .overlay-tab {
            padding: 6px;
            max-height: 70vh;
            overflow-y: auto;
        }

        .master-toggle-container {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 1px solid #dee2e6;
            border-radius: 6px;
            padding: 8px;
            margin-bottom: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .master-toggle-label {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            gap: 8px;
            user-select: none;
        }

        .master-toggle-checkbox {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #4CAF50;
        }

        .master-toggle-text {
            transition: color 0.3s ease;
            font-weight: 600;
        }

        .layer-group {
            margin-bottom: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow: hidden;
        }

        .group-header {
            background: #f5f5f5;
            padding: 6px 10px;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: background-color 0.2s ease;
            position: relative;
        }

        .group-header:hover {
            background: #e8e8e8;
        }

        .group-drag-handle {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            cursor: grab;
            color: #999;
            font-size: 13px;
            user-select: none;
            padding: 3px 5px;
            border-radius: 3px;
            transition: all 0.2s ease;
            background: rgba(255,255,255,0.8);
            border: 1px solid #ddd;
        }

        .group-drag-handle:hover {
            background: rgba(0,0,0,0.1);
            color: #666;
            border-color: #999;
        }

        .toggle-button {
            font-size: 11px;
            color: #666;
            transition: transform 0.2s ease;
            display: inline-block;
            width: 14px;
            text-align: center;
        }

        .group-title {
            font-size: 13px;
            flex: 1;
        }

        .group-content {
            transition: all 0.3s ease;
            overflow: hidden;
        }

        .layer-control {
            margin: 0;
            padding: 8px;
            border-bottom: 1px solid #eee;
        }

        .layer-control:last-child {
            border-bottom: none;
        }

        .layer-control label {
            display: block;
            margin-bottom: 4px;
            font-weight: 500;
            cursor: pointer;
        }

        .layer-control input[type="checkbox"] {
            margin-right: 6px;
        }

        .slider-container {
            margin: 4px 0;
            display: flex;
            align-items: center;
        }

        .global-filter {
            padding: 6px 10px;
            border-bottom: 1px solid #eee;
        }

        .global-filter:last-child {
            border-bottom: none;
        }

        .layer-group[data-group-key="global-filters"] .group-title {
            font-weight: 700;
        }
        .global-filter span {
            font-weight: 700;
        }

        .slider-container span {
            display: inline-block;
            width: 78px;
            font-size: 11px;
            color: #666;
        }

        .slider-container input[type="range"] {
            flex: 1;
            margin: 0 6px;
        }

        .slider-value {
            width: 40px !important;
            text-align: right;
            font-weight: 500;
            color: #333 !important;
        }

        .reset-container {
            margin-top: 10px;
            padding: 10px;
            border-top: 1px solid #ddd;
            text-align: center;
        }

        .reset-button {
            background: #f44336;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            transition: background 0.2s;
        }

        .reset-button:hover {
            background: #d32f2f;
        }

        /* Drag & Drop Styles für Gruppen */
        .layer-group[draggable="true"] {
            transition: all 0.2s ease;
        }

        .layer-group.group-dragging {
            opacity: 0.6;
            transform: rotate(1deg);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 1000;
            border: 2px dashed #666;
        }

        .layer-group.group-drop-target-above {
            border-top: 4px solid #4CAF50;
            margin-top: 4px;
        }

        .layer-group.group-drop-target-below {
            border-bottom: 4px solid #4CAF50;
            margin-bottom: 4px;
        }

        .group-drag-handle[draggable="true"]:active {
            cursor: grabbing;
        }

        /* Geo-Lokalisierung Styles */
        .geo-status {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .geo-toggle-container {
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
        }

        /* Geo-Settings Gruppe - aktiv = grün, inaktiv = normal */
        .layer-group[data-group-key="geo-settings"].geo-filter-active {
            border-color: #c8e6c9;
            background: linear-gradient(to bottom, #e8f5e9, #fff);
        }

        .layer-group[data-group-key="geo-settings"].geo-filter-active .geo-filter-header {
            background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
        }

        /* Layer-Status-Indikator */
        .layer-status-indicator {
            cursor: default;
            vertical-align: middle;
        }

        .layer-status-indicator[title*="Klicken"] {
            cursor: pointer;
        }

        .layer-status-indicator:hover[title*="Klicken"] {
            transform: scale(1.2);
        }

        /* Toast-Benachrichtigungen */
        .layer-toast {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Starte Initialisierung wenn WME bereit ist
if (W?.userscripts?.state.isReady) {
    initializeScript();
} else {
    document.addEventListener('wme-ready', initializeScript, { once: true });
}

})();