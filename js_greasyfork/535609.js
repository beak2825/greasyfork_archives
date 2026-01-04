// ==UserScript==
// @name         WME MSN Baustellen & Traffic
// @description  WME MSN Baustellen & Traffic Overlay with Construction Info Popups and Opacity Control
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2025.10.14
// @author       vertexcode, hiwi234, su-mo,
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @connect      api.tomtom.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/535609/WME%20MSN%20Baustellen%20%20Traffic.user.js
// @updateURL https://update.greasyfork.org/scripts/535609/WME%20MSN%20Baustellen%20%20Traffic.meta.js
// ==/UserScript==

/* global W, I18n, OpenLayers, $ */
(function () {
'use strict';

const SCRIPT_ID = "msn-baustellen-traffic";
const prefix = "⛔🛣️🚧";
const version = GM_info.script.version;
const name = GM_info.script.name;
const scriptURL = GM_info.script.namespace;

// TomTom API Configuration
const TOMTOM_API_KEY = "sATA9OwG11zrMKQcCxR3eSEjj2n8Jsrg";
const TOMTOM_BASE_URL = "https://api.tomtom.com";

let iconsLayer;
let baustellenLayer;
let epsg3857, epsg4326;
let btfDiv;
let btfDivVisible = false;
let mouseInPopup = false;
let popupID = false;
let btfDivOffset = -3;
let layerCheckBoxElement;
let panelCheckBoxElement;
let language ='en';
let opacitySlider;
let MSNLayer;
// New globals for statistics and collections
let currentIncidents = [];
let currentConstructions = [];
let eventStatistics = { closure: 0, construct: 0, narrows: 0, traffic: 0, vollsperrung: 0, others: 0 };
// Map of incident id -> OpenLayers.Marker for quick focusing from table
let incidentMarkers = {};
let renderTimer = null; // debounce render for statistics/table

// Debug helpers: expose last shown POI to the console
window.__msnLastPoi = null;
window.__msnLastProps = null;
window.__msnLastElement = null;
window.msnDumpLast = function() {
    try {
        console.log('[POI]', window.__msnLastPoi);
        console.log('[props]', window.__msnLastProps);
        return window.__msnLastPoi;
    } catch(e) {
        console.error('msnDumpLast error:', e);
        return null;
    }
};

function resetStatistics() {
    eventStatistics = { closure: 0, construct: 0, narrows: 0, traffic: 0, vollsperrung: 0, others: 0 };
    currentIncidents = [];
    currentConstructions = [];
    incidentMarkers = {};
    const el = document.getElementById(`${prefix}-stats`);
    if (el) el.innerHTML = '';
}
const mtotypes = [
    { "type" : "closure", "icon" : 'https://upload.wikimedia.org/wikipedia/commons/4/46/Zeichen_250_-_Verbot_f%C3%BCr_Fahrzeuge_aller_Art%2C_StVO_1970.svg' },
    { "type" : "construct", "icon" : 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Zeichen_123_-_Arbeitsstelle%2C_StVO_2013.svg' },
    { "type" : "narrows", "icon" : 'https://upload.wikimedia.org/wikipedia/commons/0/08/Zeichen_120_-_Verengte_Fahrbahn%2C_StVO_1970.svg' },
    { "type" : "traffic", "icon" : 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Zeichen_124_-_Stau%2C_StVO_1992.svg' },
    { "type" : "vollsperrung", "icon" : 'https://upload.wikimedia.org/wikipedia/commons/4/46/Zeichen_250_-_Verbot_f%C3%BCr_Fahrzeuge_aller_Art%2C_StVO_1970.svg' },
    { "type" : "others", "icon" : 'https://upload.wikimedia.org/wikipedia/commons/0/02/Zeichen_101_-_Gefahrstelle%2C_StVO_1970.svg' }
];

function loadTranslations() {
    if (!I18n || !I18n.translations || !I18n.currentLocale) {
        setTimeout(loadTranslations, 500);
        return;
    }

    const translations = {
        en: {
            closure : 'Closures',
            construct : 'Roadworks',
            narrows : 'Lane narrowing',
            traffic : 'Traffic jam',
            vollsperrung : 'Traffic disruption',
            others : 'Others',
            baustellen : 'Construction Sites',
            enable : 'Enable',
            opacity : 'Traffic Line Opacity',
            regex : {
                closure : /closed/i,
                construct : /roadworks/i,
                narrows : /(reduced|lane|line)/i,
                traffic : /traffic/i,
                others : "",
            },
            reason : 'Reason',
            street : 'Street',
            from : 'From',
            direction : 'Direction',
            distance : 'Distance',
            at : 'At',
            till : 'Till',
            constructionSite : 'Construction Site',
            lastUpdate : 'Last Update',
            source : 'Source',
            // new UI strings
            autoRefreshLabel: 'Auto Refresh',
            refreshIntervalLabel: 'Refresh Interval (minutes):',
            iconSizeLabel: 'Icon Size',
            severity: 'Severity',
            severity_all: 'All',
            severity_high: 'High',
            severity_medium: 'Medium',
            severity_low: 'Low',
            trafficDensity: 'Traffic density',
            delay: 'Estimated delay',
            stats: 'Statistics',
            stats_incidents: 'Incidents',
            stats_constructions: 'Constructions',
            export_json: 'Export JSON',
            export_csv: 'Export CSV',
            notify_new_construction: 'Notify on new construction sites',
            minutes: 'min',
            // closures table
            closuresTableTitle: 'Full closures',
            closuresTableEmpty: 'No full closures in view',
            closures_h_road: 'Road',
            closures_h_desc: 'Description',
            closures_h_start: 'Start',
            closures_h_end: 'End',
            closures_h_sev: 'Severity',
            closures_h_len: 'Length',
            closures_h_jump: 'Go'
        },
        de: {
            closure : 'Sperrungen',
            construct : 'Baustellen',
            narrows : 'Fahrbahn Verengungen',
            traffic : 'Staus',
            vollsperrung : 'Vollsperrung',
            others : 'Sonstiges',
            baustellen : 'Baustellen',
            enable : 'Aktivieren',
            opacity : 'Verkehrslinie Deckkraft',
            regex : {
                closure : /gesperrt/i,
                construct : /Baustelle/i,
                narrows : /(vereng|Fahrstreifen)/i,
                traffic : /(Stau|Verkehr)/i,
                others : "",
            },
            reason : 'Grund',
            street : 'Straße',
            from : 'von',
            direction : 'nach',
            distance : 'Länge',
            at : 'ab',
            till : 'bis',
            constructionSite : 'Baustelle',
            lastUpdate : 'Letzte Aktualisierung',
            source : 'Quelle',
            // new UI strings
            autoRefreshLabel: 'Automatische Aktualisierung',
            refreshIntervalLabel: 'Aktualisierungsintervall (Minuten):',
            iconSizeLabel: 'Icon-Größe',
            severity: 'Schweregrad',
            severity_all: 'Alle',
            severity_high: 'Hoch',
            severity_medium: 'Mittel',
            severity_low: 'Niedrig',
            trafficDensity: 'Verkehrsdichte',
            delay: 'Geschätzte Verzögerung',
            stats: 'Statistik',
            stats_incidents: 'Vorfälle',
            stats_constructions: 'Baustellen',
            export_json: 'Export JSON',
            export_csv: 'Export CSV',
            notify_new_construction: 'Benachrichtigung bei neuen Baustellen',
            minutes: 'Min',
            // closures table
            closuresTableTitle: 'Vollsperrungen',
            closuresTableEmpty: 'Keine Vollsperrungen im Kartenausschnitt',
            closures_h_road: 'Straße',
            closures_h_desc: 'Beschreibung',
            closures_h_start: 'Beginn',
            closures_h_end: 'Ende',
            closures_h_sev: 'Schwere',
            closures_h_len: 'Länge',
            closures_h_jump: 'Gehe'
        }
    };

    // Set default translations
    I18n.translations[I18n.currentLocale()][prefix] = translations.en;

    // Override with locale-specific translations if available
    for (const locale in translations) {
        if (I18n.currentLocale().includes(locale)) {
            I18n.translations[I18n.currentLocale()][prefix] = translations[locale];
            language = locale;
            break;
        }
    }
}

function insertCSS() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        #sidepanel-${SCRIPT_ID} .mto-container { display:flex; align-items:center; margin:2px; font-weight:normal; }
        #sidepanel-${SCRIPT_ID} .mto-container img { width:1.5em; height:1.5em; margin:0 1ex; }
        #sidepanel-${SCRIPT_ID} .mto-container input[type="checkbox"] { margin:0; }
        #sidepanel-${SCRIPT_ID} .opacity-slider { width:100%; margin:10px 0; }
        #sidepanel-${SCRIPT_ID} .opacity-label { display:flex; justify-content:space-between; align-items:center; margin:5px 0; }
        #btfDiv td { white-space: nowrap; }
        .baustellen-popup { background-color: #fff3cd; border-color: #ffeaa7; }
        #sidepanel-${SCRIPT_ID} .section-title { font-weight:600; margin-top:8px; }
        #sidepanel-${SCRIPT_ID} .stats { font-size:12px; line-height:1.6; padding-left:4px; }
        .msn-toast { position: fixed; right: 16px; bottom: 16px; background:#222; color:#fff; padding:10px 12px; border-radius:8px; box-shadow: 0 6px 16px rgba(0,0,0,0.25); z-index: 10001; opacity: 0.95; }
        /* Closures table */
        #sidepanel-${SCRIPT_ID} .closures-table { width:100%; border-collapse: collapse; }
        #sidepanel-${SCRIPT_ID} .closures-table thead th { position: sticky; top: 0; background:#f7f7f7; font-weight:600; font-size:12px; text-align:left; border-bottom:1px solid #ddd; padding:6px; }
        #sidepanel-${SCRIPT_ID} .closures-table tbody td { font-size:12px; padding:6px; border-bottom:1px solid #eee; vertical-align: top; }
        #sidepanel-${SCRIPT_ID} .closures-table th.sortable { cursor: pointer; }
        #sidepanel-${SCRIPT_ID} .closures-container { max-height: 260px; overflow:auto; border:1px solid #ddd; border-radius:4px; }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
}

function convertBase(value) {
    return {
        from: function (baseFrom) {
            return {
                to: function (baseTo) {
                    return parseInt(value, baseFrom).toString(baseTo);
                }
            };
        }
    };
}

function zfill(value, length) {
    let s = value + "";
    while (s.length < length) {
        s = "0" + s;
    }
    return s;
}

function tile2key(x, y, z) {
    let x_bin = convertBase(x).from(10).to(2);
    let y_bin = convertBase(y).from(10).to(2);
    x_bin = zfill(x_bin, z);
    y_bin = zfill(y_bin, z);

    let quadkey = [];
    for (let i = 0; i < z; i++) {
        quadkey.push(y_bin.charAt(i));
        quadkey.push(x_bin.charAt(i));
    }
    quadkey = quadkey.join("");
    quadkey = convertBase(quadkey).from(2).to(4);
    quadkey = zfill(quadkey, z);
    return quadkey;
}

function addIcon() {
    if (OpenLayers.Icon) return;
    OpenLayers.Icon = OpenLayers.Class({
        url: null,
        size: null,
        offset: null,
        calculateOffset: null,
        imageDiv: null,
        px: null,

        initialize: function (url, size, offset, calculateOffset) {
            this.url = url;
            this.size = size || {w: 20, h: 20};
            this.offset = offset || {x: -(this.size.w / 2), y: -(this.size.h / 2)};
            this.calculateOffset = calculateOffset;
            const id = OpenLayers.Util.createUniqueID("OL_Icon_");
            this.imageDiv = OpenLayers.Util.createAlphaImageDiv(id);
        },

        destroy: function () {
            this.erase();
            OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);
            this.imageDiv.innerHTML = "";
            this.imageDiv = null;
        },

        clone: function () {
            return new OpenLayers.Icon(this.url, this.size, this.offset, this.calculateOffset);
        },

        setSize: function (size) {
            if (size != null) {
                this.size = size;
            }
            this.draw();
        },

        setUrl: function (url) {
            if (url != null) {
                this.url = url;
            }
            this.draw();
        },

        draw: function (px) {
            OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, this.size, this.url, "absolute");
            this.moveTo(px);
            return this.imageDiv;
        },

        erase: function () {
            if (this.imageDiv != null && this.imageDiv.parentNode != null) {
                OpenLayers.Element.remove(this.imageDiv);
            }
        },

        setOpacity: function (opacity) {
            OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null, null, null, null, null, opacity);
        },

        moveTo: function (px) {
            if (px != null) {
                this.px = px;
            }
            if (this.imageDiv != null) {
                if (this.px == null) {
                    this.display(false);
                } else {
                    if (this.calculateOffset) {
                        this.offset = this.calculateOffset(this.size);
                    }
                    OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, {
                        x: this.px.x + this.offset.x,
                        y: this.px.y + this.offset.y
                    });
                }
            }
        },

        display: function (display) {
            this.imageDiv.style.display = (display) ? "" : "none";
        },

        isDrawn: function () {
            const isDrawn = (this.imageDiv && this.imageDiv.parentNode &&
                         (this.imageDiv.parentNode.nodeType != 11));
            return isDrawn;
        },

        CLASS_NAME: "OpenLayers.Icon"
    });
}

function addQuadKeyLayer() {
    if (OpenLayers.Layer.QuadKey) return;
    OpenLayers.Layer.QuadKey = OpenLayers.Class(OpenLayers.Layer.Grid, {
        isBaseLayer: false,
        sphericalMercator: false,
        zoomOffset: 0,
        serverResolutions: null,

        initialize: function (name, url, options) {
            if (options && options.sphericalMercator || this.sphericalMercator) {
                options = OpenLayers.Util.extend({
                    projection: "EPSG:3857",
                    numZoomLevels: 19
                }, options);
            }
            OpenLayers.Layer.Grid.prototype.initialize.apply(this, [
                name || this.name, url || this.url, {}, options
            ]);
        },

        clone: function (obj) {
            if (obj == null) {
                obj = new OpenLayers.Layer.QuadKey(this.name, this.url, this.getOptions());
            }
            obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);
            return obj;
        },

        getURL: function (bounds) {
            const xyz = this.getXYZ(bounds);
            const url = this.url;

            // Check if URL contains XYZ placeholders (for TomTom) or uses QuadKey format (for Bing)
            if (url.includes('${z}') && url.includes('${x}') && url.includes('${y}')) {
                // TomTom XYZ format
                return OpenLayers.String.format(url, {z: xyz.z, x: xyz.x, y: xyz.y});
            } else {
                // Bing QuadKey format (legacy)
                const key = tile2key(xyz.x, xyz.y, xyz.z);
                return OpenLayers.String.format(url, {key: key});
            }
        },

        getXYZ: function (bounds) {
            const res = this.getServerResolution();
            let x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
            const y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
            const z = this.getServerZoom();

            if (this.wrapDateLine) {
                const limit = Math.pow(2, z);
                x = ((x % limit) + limit) % limit;
            }
            return {'x': x, 'y': y, 'z': z};
        },

        setMap: function (map) {
            OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
            if (!this.tileOrigin) {
                this.tileOrigin = new OpenLayers.LonLat(this.maxExtent.left, this.maxExtent.bottom);
            }
        },

        CLASS_NAME: "OpenLayers.Layer.QuadKey"
    });
}

// REMOVED - MSN traffic tile recoloring helpers no longer needed
// Map tiles now automatically show striped patterns instead of gray

function addInfoPopup() {
    btfDiv = document.createElement('div');
    btfDiv.id = "btfDiv";
    btfDiv.style.position = 'absolute';
    btfDiv.style.visibility = 'hidden';
    btfDiv.style.top = '0';
    btfDiv.style.left = '0';
    btfDiv.style.zIndex = 10000;
    btfDiv.style.backgroundColor = 'aliceblue';
    btfDiv.style.borderWidth = '3px';
    btfDiv.style.borderStyle = 'solid';
    btfDiv.style.borderRadius = '10px';
    btfDiv.style.boxShadow = '5px 5px 10px Silver';
    btfDiv.style.padding = '4px';
    document.body.appendChild(btfDiv);

    btfDiv.addEventListener("mouseenter", enterPopup, { passive: true });
    btfDiv.addEventListener("mouseleave", leavePopup, { passive: true });
}

function enterPopup(params) {
    mouseInPopup = true;
}

function leavePopup(params) {
    mouseInPopup = false;
    hidePopup();
}

function toISOLocal(d) {
    const z = n => ('0' + n).slice(-2);
    return d.getFullYear() + '-' + z(d.getMonth()+1) + '-' + z(d.getDate()) + ' ' +
           z(d.getHours()) + ':' + z(d.getMinutes()) + ':' + z(d.getSeconds());
}

function getPopupText(poi, isBaustelle = false) {
    let html = "";

    // Normalize common fields with sensible fallbacks to handle different data shapes
    const props = poi && poi.properties ? poi.properties : {};
    const fmtDate = (val) => {
        try {
            if (!val) return "";
            const d = typeof val === 'string' || typeof val === 'number' ? new Date(val) : val;
            return toISOLocal(d);
        } catch (e) { return String(val); }
    };

    // Correct access to translation bundle
    const t = (I18n && I18n.translations && typeof I18n.currentLocale === 'function')
        ? (I18n.translations[I18n.currentLocale()] && I18n.translations[I18n.currentLocale()][prefix]) || {}
        : {};

    function severityRow(sev) {
        return sev ? `<tr><td>${t.severity || 'Severity'} </td><td>${sevLabel(sev)}</td></tr>` : "";
    }
    function densityRow(sev) {
        const d = getTrafficDensity(sev);
        return d ? `<tr><td>${t.trafficDensity || 'Traffic density'} </td><td>${d}</td></tr>` : "";
    }
    function delayRow(p) {
        const mins = estimateDelayMinutes(p);
        return (mins>0) ? `<tr><td>${t.delay || 'Estimated delay'} </td><td>${mins} ${(t.minutes || 'min')}</td></tr>` : "";
    }

    if (isBaustelle) {
        const sev = getSeverity(poi, true);
        const street = poi.name || poi.r || poi.street || (props.roadNumbers && props.roadNumbers.length ? props.roadNumbers.join(', ') : "");
        const reason = poi.description || poi.c || poi.reason || "";
        const start = poi.start_date || (poi.sd ? fmtDate(poi.sd) : (props.startTime ? fmtDate(props.startTime) : ""));
        const end = poi.end_date || (poi.ed ? fmtDate(poi.ed) : (props.endTime ? fmtDate(props.endTime) : ""));
        const lastUpd = poi.last_update || (poi.lastReportTime ? fmtDate(poi.lastReportTime) : (props.lastReportTime ? fmtDate(props.lastReportTime) : ""));

        console.log('[MSN Debug] Baustelle end date:', { end, poi_end_date: poi.end_date, poi_ed: poi.ed, props_endTime: props.endTime });
        console.log('[MSN Debug] Baustelle start date:', { start, poi_start_date: poi.start_date, poi_sd: poi.sd, props_startTime: props.startTime });

        html = `<b>${t.constructionSite || 'Construction Site'}</b><br>\n`;
        html += "<table>";
        html += street ? `<tr><td>${t.street || 'Street'} </td><td>${street}</td></tr>\n` : "";
        html += reason ? `<tr><td>${t.reason || 'Reason'} </td><td>${reason}</td></tr>\n` : "";
        html += severityRow(sev);
        html += start ? `<tr><td>${t.at || 'At'} </td><td>${start}</td></tr>\n` : "";

        // Construction sites always have end dates - show actual date or "Unknown"
        const unknownMsg = language === 'de' ? 'Unbekannt' : 'Unknown';
        html += `<tr><td>${t.till || 'Till'} </td><td>${end ? end : `<i>${unknownMsg}</i>`}</td></tr>\n`;
        html += lastUpd ? `<tr><td>${t.lastUpdate || 'Last Update'} </td><td>${lastUpd}</td></tr>\n` : "";
        html += `<tr><td>${t.source || 'Source'} </td><td>${props.source || 'MSN'}</td></tr>\n`;
        html += `<tr><td>Version</td><td>${version}</td></tr>\n`;
        html += "</table>";
    } else {
        const sev = getSeverity(poi, false);
        const title = poi.d || poi.title || poi.description || '';
        const reason = poi.c || poi.description || poi.reason || '';
        const street = poi.r || poi.name || poi.street || (props.roadNumbers && props.roadNumbers.length ? props.roadNumbers.join(', ') : "");
        const fromVal = poi.f || poi.from || props.from || '';
        const toVal = poi.t || poi.to || props.to || props.direction || '';
        const lengthVal = poi.l || poi.lengthInMeters || poi.length || props.lengthInMeters || props.length || '';
        // Start/End mit Fallback auf timeValidity
        let start = poi.sd ? fmtDate(poi.sd) : (props.startTime ? fmtDate(props.startTime) : "");
        let end = poi.ed ? fmtDate(poi.ed) : (props.endTime ? fmtDate(props.endTime) : "");
        if ((!start || !end) && props.timeValidity) {
            try {
                const tv = props.timeValidity;
                if (!start && (tv.startTime || tv.validityStartTime || tv.start)) start = fmtDate(tv.startTime || tv.validityStartTime || tv.start);
                if (!end && (tv.endTime || tv.validityEndTime || tv.end)) end = fmtDate(tv.endTime || tv.validityEndTime || tv.end);
            } catch(e) { /* noop */ }
        }

        // DEBUG: Log traffic incident start/end date extraction
        console.log('[MSN Debug] Traffic incident start/end dates:', {
            start, end,
            poi_sd: poi.sd, poi_ed: poi.ed,
            props_startTime: props.startTime, props_endTime: props.endTime,
            props_timeValidity: props.timeValidity
        });

        html = `<b>${title}</b><br>\n`;
        html += "<table>";
        html += reason ? `<tr><td>${t.reason || 'Reason'} </td><td>${reason}</td></tr>\n` : "";
        // Add original description if different from standardized reason
        if (poi.description && reason && poi.description !== reason) {
            html += `<tr><td>${language==='de'?'Beschreibung':'Description'} </td><td>${poi.description}</td></tr>\n`;
        }
        html += severityRow(sev);
        html += street ? `<tr><td>${t.street || 'Street'} </td><td>${street}</td></tr>\n` : "";
        html += fromVal ? `<tr><td>${t.from || 'From'} </td><td>${fromVal}</td></tr>\n` : "";
        html += toVal ? `<tr><td>${t.direction || 'Direction'} </td><td>${toVal}</td></tr>\n` : "";
        if (lengthVal) {
            const lenNum = Number(lengthVal);
            const lenStr = !isNaN(lenNum) ? ((lenNum >= 1000) ? `${(lenNum / 1000).toFixed(1)} km` : `${lenNum} m`) : String(lengthVal);
            html += `<tr><td>${t.distance || 'Distance'} </td><td>${lenStr}</td></tr>\n`;
        }
        html += densityRow(sev);
        html += delayRow(poi);
        html += start ? `<tr><td>${t.at || 'At'} </td><td>${start}</td></tr>\n` : "";

        // Check if incident has defined duration - include TomTom traffic incidents with timeValidity
        const hasDefinedDuration = poi.type === 'construct' || poi.type === 'closure' || poi.type === 'vollsperrung' ||
                                   (poi.properties && poi.properties.endTime) || poi.ed ||
                                   (poi.properties && poi.properties.timeValidity && poi.properties.timeValidity.endTime) ||
                                   (poi.properties && poi.properties.timeValidity && poi.properties.timeValidity.validityEndTime) ||
                                   (poi.properties && poi.properties.timeValidity && poi.properties.timeValidity.end) ||
                                   (poi.timeValidity && (poi.timeValidity.endTime || poi.timeValidity.validityEndTime || poi.timeValidity.end));

        // DEBUG: Log end date detection for TomTom incidents
        if (poi.properties && poi.properties.source === 'TomTom') {
            console.log('End date detection debug:', {
                type: poi.type,
                hasDefinedDuration: hasDefinedDuration,
                endTime: poi.properties?.endTime,
                poiEd: poi.ed,
                timeValidity: poi.properties?.timeValidity,
                poiTimeValidity: poi.timeValidity,
                end: end
            });
        }

        if (hasDefinedDuration) {
            // Always show end date - either actual date or "Unknown"
            const unknownMsg = language === 'de' ? 'Unbekannt' : 'Unknown';
            html += `<tr><td>${t.till || 'Till'} </td><td>${end ? end : `<i>${unknownMsg}</i>`}</td></tr>\n`;
        }

        // Enhanced TomTom specific information
        if (poi.properties && poi.properties.source === 'TomTom') {
            html += `<tr><td colspan="2"><hr style="margin: 5px 0;"></td></tr>\n`;
            html += `<tr><td colspan="2"><b>TomTom Details</b></td></tr>\n`;

            // Traffic speed information
            if (poi.currentSpeed !== undefined || poi.freeFlowSpeed !== undefined) {
                if (poi.currentSpeed !== undefined) {
                    html += `<tr><td>Aktuelle Geschwindigkeit</td><td>${poi.currentSpeed} km/h</td></tr>\n`;
                }
                if (poi.freeFlowSpeed !== undefined) {
                    html += `<tr><td>Freie Fahrt Geschwindigkeit</td><td>${poi.freeFlowSpeed} km/h</td></tr>\n`;
                }
                if (poi.averageSpeed !== undefined) {
                    html += `<tr><td>Durchschnittsgeschwindigkeit</td><td>${poi.averageSpeed} km/h</td></tr>\n`;
                }
            }

            // Delay magnitude
            if (poi.magnitudeOfDelay !== undefined) {
                const delayLabels = ['Unbekannt', 'Gering', 'Mittel', 'Hoch', 'Sehr hoch'];
                html += `<tr><td>Verzögerungsgrad</td><td>${delayLabels[poi.magnitudeOfDelay] || poi.magnitudeOfDelay}</td></tr>\n`;
            }

            // Road closure status
            if (poi.roadClosed !== undefined) {
                html += `<tr><td>Straße gesperrt</td><td>${poi.roadClosed ? 'Ja' : 'Nein'}</td></tr>\n`;
            }

            // Probability and reports
            if (poi.probabilityOfOccurrence !== undefined) {
                html += `<tr><td>Wahrscheinlichkeit</td><td>${(poi.probabilityOfOccurrence * 100).toFixed(0)}%</td></tr>\n`;
            }
            if (poi.numberOfReports !== undefined) {
                html += `<tr><td>Anzahl Meldungen</td><td>${poi.numberOfReports}</td></tr>\n`;
            }

            // Last report time
            if (poi.lastReportTime) {
                html += `<tr><td>Letzte Meldung</td><td>${toISOLocal(new Date(poi.lastReportTime))}</td></tr>\n`;
            }

            // Length in meters (if different from poi.l)
            if (poi.lengthInMeters && poi.lengthInMeters !== poi.l) {
                html += `<tr><td>Länge (TomTom)</td><td>${(1000 <= poi.lengthInMeters) ? `${(poi.lengthInMeters / 1000).toFixed(1)} km` : `${poi.lengthInMeters} m`}</td></tr>\n`;
            }

            // Confidence level
            if (poi.confidence !== undefined) {
                html += `<tr><td>Vertrauensgrad</td><td>${(poi.confidence * 100).toFixed(0)}%</td></tr>\n`;
            }

            // Time validity
            if (poi.timeValidity) {
                html += `<tr><td>Gültigkeitszeitraum</td><td>${poi.timeValidity}</td></tr>\n`;
            }

            // Icon category
            if (poi.iconCategory !== undefined) {
                const categoryLabels = {
                    0: 'Unbekannt', 1: 'Baustelle', 2: 'Straßenarbeiten', 3: 'Sperrung',
                    4: 'Fahrstreifensperrung', 5: 'Fahrstreifenverengung', 6: 'Stau',
                    14: 'Langsamer Verkehr'
                };
                html += `<tr><td>Kategorie</td><td>${categoryLabels[poi.iconCategory] || poi.iconCategory}</td></tr>\n`;
            }

            // Cluster information
            if (poi.cluster !== undefined) {
                html += `<tr><td>Cluster</td><td>${poi.cluster ? 'Ja' : 'Nein'}</td></tr>\n`;
            }

            // Events details
            if (poi.events && poi.events.length > 0) {
                html += `<tr><td>Ereignisse</td><td>${poi.events.length} Details</td></tr>\n`;
                poi.events.forEach((event, index) => {
                    if (event.description && event.description !== poi.d) {
                        html += `<tr><td>Detail ${index + 1}</td><td>${event.description}</td></tr>\n`;
                    }
                });
            }
        }

        html += `<tr><td>${t.source || 'Source'} </td><td>${props && props.source === 'TomTom' ? 'TomTom Traffic API' : (props.source || 'MSN')}</td></tr>\n`;
        html += `<tr><td>Version</td><td>${version}</td></tr>\n`;
        html += "</table>";
    }

    return getTrustedHTML(html);
}

let escapeHTMLPolicy = null;

function getTrustedHTML(htmlIn) {
    if (typeof trustedTypes === "undefined") {
        return htmlIn;
    } else {
        if (!escapeHTMLPolicy) {
            try {
                // Try to use the default policy first, which is allowed by CSP
                escapeHTMLPolicy = trustedTypes.defaultPolicy || trustedTypes.createPolicy("default", {createHTML: (to_escape) => to_escape});
            } catch (e) {
                try {
                    // If default doesn't work, try a unique name that follows CSP rules
                    const policyName = `msn-baustellen-${Date.now()}`;
                    escapeHTMLPolicy = trustedTypes.createPolicy(policyName, {createHTML: (to_escape) => to_escape});
                } catch (e2) {
                    // Final fallback: return original HTML if policy creation fails
                    console.warn('TrustedTypePolicy creation failed, using unsafe HTML:', e2);
                    return htmlIn;
                }
            }
        }
        return escapeHTMLPolicy.createHTML(htmlIn);
    }
}

function showPopup(poi, element, isBaustelle = false) {
    if (popupID && popupID !== poi.id) { return; }

    btfDiv.style.visibility = "hidden";
    btfDiv.style.top = "0px";
    btfDiv.style.left = "0px";
    btfDiv.style.height = "auto";
    btfDiv.style.width = "auto";
    btfDiv.style.overflow = "auto";

    if (isBaustelle) {
        btfDiv.className = "baustellen-popup";
    } else {
        btfDiv.className = "";
    }

    btfDiv.innerHTML = getPopupText(poi, isBaustelle);

    // Store for debugging in console
    window.__msnLastPoi = poi;
    window.__msnLastProps = (poi && poi.properties) ? poi.properties : null;
    window.__msnLastElement = element;

    let cw = parseInt(btfDiv.clientWidth);
    if(cw > (window.innerWidth * 0.45)) {
        cw = (window.innerWidth * 0.45);
        btfDiv.style.width = cw+'px';
    }

    let ch = parseInt(btfDiv.clientHeight);
    if(ch > (window.innerHeight * 0.80)) {
        ch = (window.innerHeight * 0.80);
        btfDiv.style.height = ch+'px';
        btfDiv.style.overflow = 'scroll';
    }

    const iconRect = element.getBoundingClientRect();
    const viewPortRect = iconsLayer.div.offsetParent.offsetParent.getBoundingClientRect();
    let left = iconRect.right + btfDivOffset;
    if (viewPortRect.right-10 < iconRect.right + cw) {
        left = iconRect.left - btfDivOffset - cw;
    }

    let top = iconRect.bottom + btfDivOffset;
    if (viewPortRect.bottom -100 < iconRect.bottom + ch) {
        top = iconRect.top - btfDivOffset - ch;
    }

    btfDiv.style.top = top + "px";
    btfDiv.style.left = left + "px";
    btfDiv.style.visibility = "visible";
    btfDivVisible = true;
}

function hidePopup() {
    if (!mouseInPopup) {
        btfDiv.style.visibility = "hidden";
        btfDivVisible = false;
    }
}

function checkTypeEnabled(type) {
    let myConf = {};
    try {
        const key = (typeof prefix !== 'undefined') ? prefix : 'MSN';
        const raw = localStorage[key];
        myConf = raw ? JSON.parse(raw) : {};
    } catch (e) { /* ignore */ }
    if (typeof myConf[type] === 'undefined') return true; // default enabled
    return !!myConf[type];
}

// Helper: respect severity filter stored in localStorage
function shouldShowBySeverity(severity) {
    // Always return true since severity filtering has been removed
    return true;
}

// Debounced combined render of statistics and closures table
function scheduleRender() {
    try { if (renderTimer) clearTimeout(renderTimer); } catch(e) {}
    renderTimer = setTimeout(() => {
        try { renderStatistics(); } catch(e) {}
        try { renderClosuresTable(); } catch(e) {}
    }, 250);
}

function renderClosuresTable() {
    const table = document.getElementById(`${prefix}-closures-table`);
    const container = document.getElementById(`${prefix}-closures-table-container`);
    if (!table || !container) return;

    // Only full closures
    const items = (currentIncidents || []).filter(p => p && p.type === 'closure');

    // Initialize sorting state
    let sortKey = 'start';
    let sortDir = 'asc';
    try {
        const raw = localStorage[`${prefix}-closures-sort`];
        if (raw) { const o = JSON.parse(raw); sortKey = o.key || sortKey; sortDir = o.dir || sortDir; }
    } catch (e) {}

    const th = (key, label) => `<th class="sortable" data-key="${key}">${label}${sortKey===key? (sortDir==='asc'?' ▲':' ▼'):''}</th>`;

    // Empty state with header
    if (!items.length) {
        table.innerHTML = `<thead><tr>
            ${th('road', I18n.t(`${prefix}.closures_h_road`))}
            ${th('desc', I18n.t(`${prefix}.closures_h_desc`))}
            ${th('start', I18n.t(`${prefix}.closures_h_start`))}
            ${th('end', I18n.t(`${prefix}.closures_h_end`))}
            ${th('sev', I18n.t(`${prefix}.closures_h_sev`))}
            ${th('len', I18n.t(`${prefix}.closures_h_len`))}
            <th>${I18n.t(`${prefix}.closures_h_jump`)}</th>
        </tr></thead><tbody><tr><td colspan="7" style="padding:8px;color:#666;">${I18n.t(`${prefix}.closuresTableEmpty`)}</td></tr></tbody>`;
        return;
    }

    // Sort
    const orderMap = { high: 3, medium: 2, low: 1 };
    const sorters = {
        road: (a,b)=> (a.street||'').localeCompare(b.street||''),
        desc: (a,b)=> (a.description||'').localeCompare(b.description||''),
        start: (a,b)=> new Date(a.start||0) - new Date(b.start||0),
        end: (a,b)=> new Date(a.end||0) - new Date(b.end||0),
        sev: (a,b)=> (orderMap[a.severity||'low'] - orderMap[b.severity||'low']),
        len: (a,b)=> (a.length_m||0) - (b.length_m||0)
    };
    const sk = sorters[sortKey] ? sortKey : 'start';
    items.sort((a,b)=> sorters[sk](a,b));
    if (sortDir === 'desc') items.reverse();

    // Build table
    const rows = items.map(p=>{
        const start = p.start ? toISOLocal(new Date(p.start)) : '';
        const end = p.end ? toISOLocal(new Date(p.end)) : '';
        const len = p.length_m ? (p.length_m>=1000? `${(p.length_m/1000).toFixed(1)} km` : `${p.length_m} m`) : '';
        const sev = sevLabel(p.severity||'low');
        const btn = `<button class="waze-button small" data-jump-id="${p.id}">${I18n.t(`${prefix}.closures_h_jump`)}</button>`;
        return `<tr>
            <td>${(p.street||'')}</td>
            <td>${escapeHTMLShort(p.description||'')}</td>
            <td>${start}</td>
            <td>${end}</td>
            <td>${sev}</td>
            <td>${len}</td>
            <td>${btn}</td>
        </tr>`;
    }).join('');

    table.innerHTML = `<thead><tr>
        ${th('road', I18n.t(`${prefix}.closures_h_road`))}
        ${th('desc', I18n.t(`${prefix}.closures_h_desc`))}
        ${th('start', I18n.t(`${prefix}.closures_h_start`))}
        ${th('end', I18n.t(`${prefix}.closures_h_end`))}
        ${th('sev', I18n.t(`${prefix}.closures_h_sev`))}
        ${th('len', I18n.t(`${prefix}.closures_h_len`))}
        <th>${I18n.t(`${prefix}.closures_h_jump`)}</th>
    </tr></thead><tbody>${rows}</tbody>`;

    // Sorting interactions
    table.querySelectorAll('th.sortable').forEach(thEl => {
        thEl.addEventListener('click', () => {
            const k = thEl.getAttribute('data-key');
            if (!k) return;
            let dir = 'asc';
            if (sortKey === k) dir = (sortDir === 'asc') ? 'desc' : 'asc';
            try { localStorage[`${prefix}-closures-sort`] = JSON.stringify({key:k, dir}); } catch(e){}
            scheduleRender();
        }, { passive: true });
    });

    // Jump buttons
    table.querySelectorAll('button[data-jump-id]').forEach(btn=>{
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-jump-id');
            const marker = incidentMarkers[id];
            if (!marker || !W || !W.map) return;
            try {
                const lonlat = new OpenLayers.LonLat(marker.lonlat.lon, marker.lonlat.lat);
                W.map.setCenter(lonlat, Math.max(W.map.getZoom()||10, 16));
                setTimeout(() => { if (marker.poi && marker.icon && marker.icon.imageDiv) showPopup(marker.poi, marker.icon.imageDiv); }, 250);
            } catch(e) { /* ignore */ }
        }, { passive: true });
    });
}

function escapeHTMLShort(str){
    try { const div = document.createElement('div'); div.textContent = String(str||''); return div.innerHTML; } catch(e) { return str; }
}



// REMOVED - requestClosures function completely removed to eliminate alternative data source conflicts
// This function was causing requestAutobahn errors and is not needed for TomTom functionality

// TomTom Traffic Flow API - Real-time traffic speed data
function requestTomTomTrafficFlow() {
    if (!W.map || !W.map.getExtent) return;

    const extent = W.map.getExtent();
    const bounds = extent.transform(W.map.getProjectionObject(), epsg4326);

    // TomTom Traffic Flow Tile API endpoint
    const zoom = Math.min(18, Math.max(6, W.map.getZoom()));
    const flowUrl = `${TOMTOM_BASE_URL}/traffic/services/4/flowSegmentData/absolute/${zoom}/json?key=${TOMTOM_API_KEY}&point=${bounds.getCenterLonLat().lat},${bounds.getCenterLonLat().lon}`;

    GM_xmlhttpRequest({
        method: 'GET',
        url: flowUrl,
        onload: function(response) {
            try {
                const data = JSON.parse(response.responseText);
                processTomTomTrafficFlow(data);
            } catch (e) {
                console.warn('[MSN] Error parsing TomTom Traffic Flow data:', e);
            }
        },
        onerror: function(error) {
            console.warn('[MSN] TomTom Traffic Flow API error:', error);
        }
    });
}

// TomTom Traffic Incidents API - Construction sites, closures, traffic jams
function requestTomTomTrafficIncidents() {
    if (!W.map || !W.map.getExtent) return;

    const extent = W.map.getExtent();
    const bounds = extent.transform(W.map.getProjectionObject(), epsg4326);

    // TomTom Traffic Incidents API endpoint (v5) - Updated to use correct endpoint
    // The correct endpoint is incidentDetails with proper bbox format
    const bbox = `${bounds.left},${bounds.bottom},${bounds.right},${bounds.top}`;

    // Updated to use the correct TomTom Traffic Incidents API v5 endpoint with German language
    const incidentsUrl = `${TOMTOM_BASE_URL}/traffic/services/5/incidentDetails?key=${TOMTOM_API_KEY}&bbox=${bbox}&language=de-DE&categoryFilter=0,1,2,3,4,5,6,7,8,9,10,11,14&timeValidityFilter=present`;

    console.log('[MSN] Requesting TomTom Traffic Incidents from:', incidentsUrl);
    console.log('[MSN] Bounding box:', bbox);

    GM_xmlhttpRequest({
        method: 'GET',
        url: incidentsUrl,
        onload: function(response) {
            console.log('[MSN] TomTom API Response Status:', response.status);
            console.log('[MSN] TomTom API Response Text:', response.responseText);

            if (response.status === 200) {
                try {
                    const data = JSON.parse(response.responseText);
                    console.log('[MSN] Parsed TomTom data:', data);
                    console.log('[MSN] DEBUG: Full API response structure:', JSON.stringify(data, null, 2));
                    console.log('[MSN] DEBUG: Available data keys:', Object.keys(data || {}));

                    // Check for different possible data structures
                    if (data && data.incidents) {
                        console.log('[MSN] DEBUG: Found data.incidents with', data.incidents.length, 'items');
                    }
                    if (data && data.tm && data.tm.poi) {
                        console.log('[MSN] DEBUG: Found data.tm.poi with', data.tm.poi.length, 'items');
                    }
                    if (data && Array.isArray(data)) {
                        console.log('[MSN] DEBUG: Data is direct array with', data.length, 'items');
                    }

                    processTomTomTrafficIncidents(data);
                } catch (e) {
                    console.warn('[MSN] Error parsing TomTom Traffic Incidents data:', e);
                    console.warn('[MSN] Raw response:', response.responseText);
                }
            } else {
                console.warn('[MSN] TomTom API returned error status:', response.status);
                console.warn('[MSN] Response:', response.responseText);

                // Check for common API errors
                if (response.status === 403) {
                    console.error('[MSN] API Key may be invalid or expired');
                } else if (response.status === 400) {
                    console.error('[MSN] Bad request - check parameters');
                } else if (response.status === 429) {
                    console.error('[MSN] API rate limit exceeded');
                }
            }
        },
        onerror: function(error) {
            console.warn('[MSN] TomTom Traffic Incidents API error:', error);
        }
    });
}

// Process TomTom Traffic Flow data
function processTomTomTrafficFlow(data) {
    if (!data || !data.flowSegmentData) return;

    const flowData = data.flowSegmentData;

    // Create traffic flow visualization on map
    if (flowData.coordinates && flowData.coordinates.coordinate) {
        const coords = flowData.coordinates.coordinate;
        const currentSpeed = flowData.currentSpeed || 0;
        const freeFlowSpeed = flowData.freeFlowSpeed || currentSpeed;
        const confidence = flowData.confidence || 0;

        // Calculate traffic condition based on speed ratio
        const speedRatio = freeFlowSpeed > 0 ? currentSpeed / freeFlowSpeed : 1;
        let trafficColor = '#00FF00'; // Green for free flow

        if (speedRatio < 0.3) trafficColor = '#FF0000'; // Red for heavy traffic
        else if (speedRatio < 0.6) trafficColor = '#FFA500'; // Orange for moderate traffic
        else if (speedRatio < 0.8) trafficColor = '#FFFF00'; // Yellow for light traffic

        console.log('[MSN] Traffic Flow - Speed:', currentSpeed, 'Free Flow:', freeFlowSpeed, 'Ratio:', speedRatio, 'Color:', trafficColor);

        // Add traffic flow marker or line to map
        addTrafficFlowVisualization(coords, trafficColor, currentSpeed, freeFlowSpeed, confidence);
    }
}

// Process TomTom Traffic Incidents data
function processTomTomTrafficIncidents(data) {
    console.log('[MSN] Raw TomTom API response:', data);
    console.log('[MSN] DEBUG: processTomTomTrafficIncidents called with data type:', typeof data);

    // TomTom API v5 returns data with 'incidents' array as the main structure
    let incidents = [];

    // Check for the correct TomTom API v5 format
    if (data && data.incidents && Array.isArray(data.incidents)) {
        incidents = data.incidents;
        console.log('[MSN] DEBUG: Using data.incidents format (TomTom API v5), found', incidents.length, 'incidents');
    } else if (data && data.tm && data.tm.poi) {
        // Legacy format - convert tm.poi to incidents format
        incidents = data.tm.poi.map(poi => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [poi.p.x, poi.p.y]
            },
            properties: {
                id: poi.id,
                iconCategory: poi.ic,
                events: [{ description: poi.d || 'Traffic incident' }],
                magnitudeOfDelay: poi.dl || 0
            }
        }));
        console.log('[MSN] DEBUG: Using data.tm.poi format (legacy), converted', incidents.length, 'incidents');
    } else if (data && Array.isArray(data)) {
        // Direct array format
        incidents = data;
        console.log('[MSN] DEBUG: Using direct array format, found', incidents.length, 'incidents');
    } else {
        console.warn('[MSN] DEBUG: Unknown data format, available keys:', Object.keys(data || {}));
        console.warn('[MSN] DEBUG: Full data structure:', JSON.stringify(data, null, 2));

        // Try alternative locations
        if (data && data.results && Array.isArray(data.results)) {
            incidents = data.results;
            console.log('[MSN] DEBUG: Using data.results format, found', incidents.length, 'incidents');
        } else if (data && data.data && Array.isArray(data.data)) {
            incidents = data.data;
            console.log('[MSN] DEBUG: Using data.data format, found', incidents.length, 'incidents');
        }
    }

    if (!incidents || incidents.length === 0) {
        console.warn('[MSN] No incidents data found in TomTom API response');
        console.warn('[MSN] Available data keys:', Object.keys(data || {}));
        if (data) {
            console.warn('[MSN] DEBUG: Sample data structure:', JSON.stringify(data, null, 2).substring(0, 1000) + '...');
        }
        return;
    }

    console.log('[MSN] Processing TomTom Traffic Incidents:', incidents.length, 'incidents found');

    // Clear existing TomTom markers before adding new ones
    if (window.tomtomIncidentsLayer) {
        window.tomtomIncidentsLayer.clearMarkers();
    }

    let processedCount = 0;
    let skippedCount = 0;

    incidents.forEach((incident, index) => {
        console.log('[MSN] DEBUG: Processing incident', index, ':', JSON.stringify(incident, null, 2));

        let coords, properties;

        // Handle different coordinate formats
        if (incident.geometry && incident.geometry.coordinates) {
            coords = incident.geometry.coordinates;
            properties = incident.properties || {};
            console.log('[MSN] DEBUG: Using geometry.coordinates format');
        } else if (incident.p) {
            // Alternative format with p.x, p.y
            coords = [incident.p.x, incident.p.y];
            properties = incident;
            console.log('[MSN] DEBUG: Using p.x, p.y format');
        } else {
            console.warn('[MSN] Incident', index, 'missing geometry:', incident);
            console.warn('[MSN] DEBUG: Available incident keys:', Object.keys(incident));
            skippedCount++;
            return;
        }

        console.log('[MSN] DEBUG: Extracted coords:', coords, 'properties:', Object.keys(properties));

        const events = properties.events || [];

        console.log('[MSN] Processing incident', index, '- Coords:', coords, 'Properties:', properties);

        // Determine incident type and icon
        let incidentType = 'others';
        let iconUrl = mtotypes.find(t => t.type === 'others')?.icon || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRkE1MDAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRkE1MDAiLz4KPHN2Zz4=';

        const iconCategory = properties.iconCategory || properties.ic;
        if (iconCategory) {
            switch (iconCategory) {
                case 1: // Construction
                case 2: // Road works
                case 9: // Roadworks (based on TomTom API documentation)
                    incidentType = 'construct';
                    iconUrl = mtotypes.find(t => t.type === 'construct')?.icon || iconUrl;
                    break;
                case 3: // Closure
                case 4: // Lane closure
                case 7: // Lane closed
                    incidentType = 'closure';
                    iconUrl = mtotypes.find(t => t.type === 'closure')?.icon || iconUrl;
                    break;
                case 6: // Traffic jam
                case 14: // Slow traffic
                    incidentType = 'traffic';
                    iconUrl = mtotypes.find(t => t.type === 'traffic')?.icon || iconUrl;
                    break;
                case 5: // Lane restriction
                    incidentType = 'narrows';
                    iconUrl = mtotypes.find(t => t.type === 'narrows')?.icon || iconUrl;
                    break;
                case 8: // Traffic disruption/Verkehrsstörung - map to 'vollsperrung'
                    incidentType = 'vollsperrung';
                    iconUrl = mtotypes.find(t => t.type === 'vollsperrung')?.icon || iconUrl;
                    break;
                case 10: // Weather conditions - map to 'others' since no specific filter exists
                case 11: // Hazard - map to 'others' since no specific filter exists
                default: // Any other category
                    incidentType = 'others';
                    iconUrl = mtotypes.find(t => t.type === 'others')?.icon || iconUrl;
                    break;
            }
        }

        console.log('[MSN] DEBUG: iconCategory:', iconCategory, '-> incidentType:', incidentType);

        // Create incident description with comprehensive fallback handling
        let description = 'Traffic incident';

        console.log('[MSN] Extracting description from incident:', {
            events: events,
            properties: properties,
            incident: incident
        });

        console.log('[MSN] DEBUG: Raw incident data structure:', JSON.stringify(incident, null, 2));
        console.log('[MSN] DEBUG: Raw properties data structure:', JSON.stringify(properties, null, 2));
        console.log('[MSN] DEBUG: Raw events data structure:', JSON.stringify(events, null, 2));

        // Try multiple sources for description in order of preference
        if (events && events.length > 0) {
            // Use events descriptions
            const eventDescriptions = events.map(e => {
                return e.description || e.d || e.text || e.c || e.details || e.message;
            }).filter(d => d && d !== 'Traffic incident');

            if (eventDescriptions.length > 0) {
                description = eventDescriptions.join('; ');
                console.log('[MSN] Description from events:', description);
            }
        }

        // If still default, try properties
        if (description === 'Traffic incident') {
            const propDesc = properties.d || properties.description || properties.summary ||
                           properties.text || properties.c || properties.details ||
                           properties.message || properties.reason || properties.cause;
            if (propDesc && propDesc !== 'Traffic incident') {
                description = propDesc;
                console.log('[MSN] Description from properties:', description);
            }
        }

        // If still default, try incident directly
        if (description === 'Traffic incident') {
            const incDesc = incident.d || incident.description || incident.summary ||
                          incident.text || incident.c || incident.details ||
                          incident.message || incident.reason || incident.cause;
            if (incDesc && incDesc !== 'Traffic incident') {
                description = incDesc;
                console.log('[MSN] Description from incident:', description);
            }
        }

        // Generate description based on incident type if still default
        if (description === 'Traffic incident') {
            switch (incidentType) {
                case 'construct':
                    description = language === 'de' ? 'Baustelle' : 'Construction work';
                    break;
                case 'closure':
                    description = language === 'de' ? 'Straßensperrung' : 'Road closure';
                    break;
                case 'traffic':
                    description = language === 'de' ? 'Verkehrsstau' : 'Traffic jam';
                    break;
                case 'narrows':
                    description = language === 'de' ? 'Fahrbahnverengung' : 'Lane restriction';
                    break;
                default:
                    description = language === 'de' ? 'Verkehrsstörung' : 'Traffic disruption';
            }
            console.log('[MSN] Generated type-based description:', description);
        }

        console.log('[MSN] Final description:', description);

        // Add more detailed information if available
        if (properties.roadNumbers && properties.roadNumbers.length > 0) {
            description += ` (${properties.roadNumbers.join(', ')})`;
        } else if (properties.road) {
            description += ` (${properties.road})`;
        }

        // Add location context if available
        if (properties.from && properties.to) {
            description += ` - von ${properties.from} nach ${properties.to}`;
        } else if (properties.from) {
            description += ` - ab ${properties.from}`;
        } else if (properties.to) {
            description += ` - bis ${properties.to}`;
        }

        console.log('[MSN] Adding TomTom incident:', incidentType, 'at', coords, 'description:', description);

        // Add incident to map and statistics
        try {
            addTomTomIncidentMarker(coords, incidentType, iconUrl, description, properties);
            processedCount++;
            console.log('[MSN] DEBUG: Successfully added marker for incident', index);
        } catch (e) {
            console.error('[MSN] DEBUG: Failed to add marker for incident', index, ':', e);
            skippedCount++;
        }

        // Update statistics
        eventStatistics[incidentType]++;

        // Add to incidents collection
        currentIncidents.push({
            id: `tomtom_${properties.id || Date.now()}_${Math.random()}`,
            type: incidentType,
            description: description,
            coordinates: coords,
            properties: { ...properties, source: 'TomTom' },
            source: 'TomTom'
        });
    });

    console.log('[MSN] TomTom incidents processed. Processed:', processedCount, 'Skipped:', skippedCount, 'Total markers:', Object.keys(incidentMarkers).length);

    // Apply TomTom marker filters after adding new markers
    applyTomTomMarkerFilters();

    // Schedule render update
    scheduleRender();
}

// Add traffic flow visualization to map
function addTrafficFlowVisualization(coords, color, currentSpeed, freeFlowSpeed, confidence) {
    if (!iconsLayer || !coords || coords.length < 2) return;

    try {
        console.log('[MSN] Adding traffic flow visualization with color:', color, 'coords:', coords.length);

        // Convert coordinates to map projection
        const points = coords.map(coord => {
            const lonlat = new OpenLayers.LonLat(coord.longitude, coord.latitude);
            return lonlat.transform(epsg4326, W.map.getProjectionObject());
        });

        // Create line feature for traffic flow
        const lineString = new OpenLayers.Geometry.LineString(points.map(p => new OpenLayers.Geometry.Point(p.lon, p.lat)));
        const lineFeature = new OpenLayers.Feature.Vector(lineString, {
            type: 'traffic_flow',
            currentSpeed: currentSpeed,
            freeFlowSpeed: freeFlowSpeed,
            confidence: confidence
        });

        // Create proper style map for the line
        const styleMap = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                strokeColor: color,
                strokeWidth: 4,
                strokeOpacity: 0.8,
                strokeDasharray: "none"
            })
        });

        // Add to appropriate layer (create if needed)
        if (!window.tomtomTrafficLayer) {
            window.tomtomTrafficLayer = new OpenLayers.Layer.Vector("TomTom Traffic Flow", {
                displayInLayerSwitcher: false,
                visibility: true,
                styleMap: styleMap
            });
            W.map.addLayer(window.tomtomTrafficLayer);
        } else {
            // Update the existing layer's style map
            window.tomtomTrafficLayer.styleMap = styleMap;
        }

        // Apply style directly to feature as fallback
        lineFeature.style = {
            strokeColor: color,
            strokeWidth: 4,
            strokeOpacity: 0.8,
            strokeDasharray: "none"
        };

        window.tomtomTrafficLayer.addFeatures([lineFeature]);
        console.log('[MSN] Traffic flow line added with color:', color);

    } catch (e) {
        console.warn('[MSN] Error adding traffic flow visualization:', e);
    }
}

// Add TomTom incident marker to map
function addTomTomIncidentMarker(coords, type, iconUrl, description, properties) {
    if (!iconsLayer || !coords) {
        console.warn('[MSN] Cannot add TomTom marker: missing layer or coordinates');
        return;
    }

    // Ensure projections are initialized
    if (!epsg3857) {
        try {
            epsg3857 = new OpenLayers.Projection("EPSG:3857");
        } catch(e) {
            console.warn('[MSN] Failed to initialize EPSG:3857 projection:', e);
            return;
        }
    }
    if (!epsg4326) {
        try {
            epsg4326 = new OpenLayers.Projection("EPSG:4326");
        } catch(e) {
            console.warn('[MSN] Failed to initialize EPSG:4326 projection:', e);
            return;
        }
    }

    try {
        let lon, lat;

        // Handle different coordinate formats from TomTom API v5
        if (Array.isArray(coords)) {
            if (coords.length >= 2) {
                // GeoJSON format: [longitude, latitude] or [[longitude, latitude], ...]
                if (Array.isArray(coords[0])) {
                    // LineString or MultiPoint - use first coordinate
                    lon = coords[0][0];
                    lat = coords[0][1];
                } else {
                    // Point format: [longitude, latitude]
                    lon = coords[0];
                    lat = coords[1];
                }
            }
        } else if (coords.longitude !== undefined && coords.latitude !== undefined) {
            // Object format: {longitude: x, latitude: y}
            lon = coords.longitude;
            lat = coords.latitude;
        }

        if (!lon || !lat || isNaN(lon) || isNaN(lat)) {
            console.warn('[MSN] Invalid coordinates for TomTom incident:', coords);
            return;
        }

        console.log('[MSN] Creating marker at:', lon, lat, 'in EPSG:4326');

        // TomTom API returns coordinates in WGS84 (EPSG:4326)
        // Waze Map Editor uses Web Mercator (EPSG:3857)
        const lonlat = new OpenLayers.LonLat(lon, lat);

        // Transform from EPSG:4326 (WGS84) to the map's projection (EPSG:3857)
        const mapCoord = lonlat.transform(epsg4326, W.map.getProjectionObject());

        console.log('[MSN] Transformed coordinates:', mapCoord.lon, mapCoord.lat, 'in', W.map.getProjectionObject().getCode());

        // Create marker
        const size = new OpenLayers.Size(24, 24);
        const offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        const icon = new OpenLayers.Icon(iconUrl, size, offset);

        const marker = new OpenLayers.Marker(mapCoord, icon);

        // Add popup functionality
        marker.events.register('click', marker, function(e) {
            console.log('[MSN] DEBUG: Marker clicked - description:', description);
            showTomTomIncidentPopup(e, {
                type: type,
                description: description,
                properties: properties,
                coordinates: [lon, lat]
            });
        });

        // Add hover functionality - use a timeout to allow click events to take precedence
        let hoverTimeout;
        marker.events.register('mouseover', marker, function(e) {
            hoverTimeout = setTimeout(() => {
                const incident = {
                    type: type,
                    description: description,
                    properties: properties,
                    coordinates: [lon, lat]
                };
                showTomTomIncidentHover(incident, marker.icon.imageDiv);
            }, 150); // 150ms delay to allow click events to fire first
        });

        marker.events.register('mouseout', marker, function(e) {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }
            hidePopup();
        });

        // Store marker reference with type information
        const markerId = `tomtom_${type}_${Date.now()}_${Math.random()}`;
        marker.tomtomType = type; // Store type directly on marker for easier filtering
        incidentMarkers[markerId] = marker;

        iconsLayer.addMarker(marker);

        console.log('[MSN] TomTom marker added successfully:', markerId);

    } catch (e) {
        console.error('[MSN] Error adding TomTom incident marker:', e);
    }
}

// Show TomTom incident popup
function showTomTomIncidentPopup(event, incident) {
    console.log('[MSN] Showing TomTom incident popup for:', incident);
    console.log('[MSN] DEBUG: showTomTomIncidentPopup called with description:', incident.description);

    // Create POI object using unified logic
    const poi = createTomTomPOI(incident);

    console.log('[MSN] Created POI object for popup:', poi);

    // Für TomTom-Vorfälle KEIN Baustellen-Template verwenden
    showPopup(poi, event.target || event.element, false);
}

// Show TomTom incident hover popup
function showTomTomIncidentHover(incident, element) {
    // Create POI object using unified logic
    const poi = createTomTomPOI(incident);

    // Use the standard (non-Baustellen) popup template for TomTom incidents
    showPopup(poi, element, false);
}

// Unified function to create POI object from TomTom incident data
function createTomTomPOI(incident) {
    // Create better titles and descriptions based on incident type
    let title = incident.description;
    let reason = '';

    // Enhanced titles and reasons based on incident type
    switch(incident.type) {
        case 'construct':
            title = 'Baustelle';
            reason = 'Bauarbeiten auf der Fahrbahn';
            break;
        case 'closure':
            title = 'Straßensperrung';
            reason = 'Vollsperrung der Fahrbahn';
            break;
        case 'vollsperrung':
            title = 'Vollsperrung';
            reason = 'Vollsperrung der Fahrbahn';
            break;
        case 'traffic':
            title = 'Verkehrsstörung';
            reason = 'Erhöhtes Verkehrsaufkommen';
            break;
        case 'accident':
            title = 'Unfall';
            reason = 'Verkehrsunfall auf der Fahrbahn';
            break;
        case 'weather':
            title = 'Wetterbedingte Störung';
            reason = 'Beeinträchtigung durch Wetterverhältnisse';
            break;
        case 'hazard':
            title = 'Gefahrenstelle';
            reason = 'Gefährliche Situation auf der Fahrbahn';
            break;
        case 'narrows':
            title = 'Fahrstreifenverengung';
            reason = 'Verengung der verfügbaren Fahrstreifen';
            break;
        default:
            title = incident.description || 'Verkehrsereignis';
            reason = 'Verkehrsbehinderung';
    }

    // Create a POI-like object for the existing popup system
    const poi = {
        id: `tomtom_${incident.type}_${Date.now()}`,
        d: title,
        c: reason,
        description: incident.description, // Add original description for display
        type: incident.type,
        properties: { ...(incident.properties || {}), source: 'TomTom' }
    };

    // DEBUG: Log TomTom incident data structure
    console.log('TomTom incident debug:', {
        type: incident.type,
        hasProperties: !!incident.properties,
        startTime: incident.properties?.startTime,
        endTime: incident.properties?.endTime,
        timeValidity: incident.properties?.timeValidity,
        fullIncident: incident
    });

    // DEBUG: Log the original TomTom incident before processing
    console.log('Original TomTom incident before POI creation:', incident);

    // DEBUG: Log what gets mapped to POI fields
    console.log('TomTom POI mapping debug - BEFORE mapping:', {
        'incident.properties.startTime': incident.properties?.startTime,
        'incident.properties.endTime': incident.properties?.endTime,
        'incident.properties.timeValidity': incident.properties?.timeValidity
    });

    // Add enhanced properties from TomTom incident
    if (incident.properties) {
        // Road information
        if (incident.properties.roadNumbers && incident.properties.roadNumbers.length > 0) {
            poi.r = incident.properties.roadNumbers.join(', ');
        }

        // Location information
        if (incident.properties.from) poi.f = incident.properties.from;
        if (incident.properties.to) poi.t = incident.properties.to;
        // Some TomTom payloads use a generic 'direction' field instead of 'to'
        if (!poi.t && incident.properties.direction) poi.t = incident.properties.direction;
        // Occasionally street name may be provided separately
        if (!poi.r && incident.properties.street) poi.r = incident.properties.street;
        if (!poi.r && incident.properties.road) poi.r = incident.properties.road;

        // Physical properties
        if (incident.properties.lengthInMeters) {
            poi.lengthInMeters = incident.properties.lengthInMeters;
            poi.l = poi.l || incident.properties.lengthInMeters;
        }
        if (incident.properties.length) poi.l = incident.properties.length;
        if (incident.properties.delay) poi.delay = incident.properties.delay;

        // Time information
        if (incident.properties.startTime) poi.sd = incident.properties.startTime;
        if (incident.properties.endTime) poi.ed = incident.properties.endTime;
        // Some feeds provide times in the 'timeValidity' object
        if ((!poi.sd || !poi.ed) && incident.properties.timeValidity) {
            try {
                const tv = incident.properties.timeValidity;
                if (!poi.sd && (tv.startTime || tv.validityStartTime || tv.start)) poi.sd = tv.startTime || tv.validityStartTime || tv.start;
                if (!poi.ed && (tv.endTime || tv.validityEndTime || tv.end)) poi.ed = tv.endTime || tv.validityEndTime || tv.end;
            } catch (e) { /* ignore parsing issues */ }
        }

        // DEBUG: Log what got mapped to POI fields
        console.log('TomTom POI mapping debug - AFTER mapping:', {
            'poi.sd': poi.sd,
            'poi.ed': poi.ed,
            'poi.start_date': poi.start_date,
            'poi.end_date': poi.end_date
        });
        // Last update/report time
        if (incident.properties.lastReportTime && !poi.last_update) poi.last_update = incident.properties.lastReportTime;

        // Additional TomTom specific data
        if (incident.properties.iconCategory) poi.iconCategory = incident.properties.iconCategory;
        if (incident.properties.magnitudeOfDelay) poi.magnitudeOfDelay = incident.properties.magnitudeOfDelay;
        if (incident.properties.events) poi.events = incident.properties.events;
        if (incident.properties.cluster) poi.cluster = incident.properties.cluster;
        if (incident.properties.roadClosed) poi.roadClosed = incident.properties.roadClosed;
        if (incident.properties.timeValidity) poi.timeValidity = incident.properties.timeValidity;
        if (incident.properties.probabilityOfOccurrence) poi.probabilityOfOccurrence = incident.properties.probabilityOfOccurrence;
        if (incident.properties.numberOfReports) poi.numberOfReports = incident.properties.numberOfReports;
        if (incident.properties.lastReportTime) poi.lastReportTime = incident.properties.lastReportTime;
        if (incident.properties.lengthInMeters) poi.lengthInMeters = incident.properties.lengthInMeters;
        if (incident.properties.averageSpeed) poi.averageSpeed = incident.properties.averageSpeed;
        if (incident.properties.freeFlowSpeed) poi.freeFlowSpeed = incident.properties.freeFlowSpeed;
        if (incident.properties.currentSpeed) poi.currentSpeed = incident.properties.currentSpeed;
        if (incident.properties.confidence) poi.confidence = incident.properties.confidence;
    }

    // Enhanced fallbacks when TomTom provides minimal data (like iconCategory-only responses)
    if (!poi.r && !poi.f && !poi.t && !poi.l) {
        console.log('[MSN] Applying enhanced fallbacks for minimal TomTom data');

        // Handle Point geometry (single coordinate) - most common for TomTom incidents
        if (incident.coordinates && Array.isArray(incident.coordinates) && incident.coordinates.length === 2) {
            console.log('[MSN] Processing Point geometry with coordinates:', incident.coordinates);

            // Set a default distance for point incidents
            poi.l = 100; // 100 meters default
            poi.lengthInMeters = 100;
            console.log('[MSN] Set default distance for point incident:', poi.l, 'meters');

            // Set direction based on incident type and location context
            poi.t = 'Beide Richtungen';
            console.log('[MSN] Set direction for point incident:', poi.t);
        }
        // Calculate approximate distance from geometry if it's a LineString
        else if (incident.geometry && incident.geometry.type === 'LineString' && incident.geometry.coordinates && incident.geometry.coordinates.length > 1) {
            const coords = incident.geometry.coordinates;
            let totalDistance = 0;

            // Simple distance calculation between consecutive points
            for (let i = 1; i < coords.length; i++) {
                const [lon1, lat1] = coords[i-1];
                const [lon2, lat2] = coords[i];

                // Haversine formula for distance calculation
                const R = 6371000; // Earth's radius in meters
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                         Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                         Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                totalDistance += R * c;
            }

            if (totalDistance > 0) {
                poi.l = Math.round(totalDistance);
                poi.lengthInMeters = Math.round(totalDistance);
                console.log('[MSN] Calculated distance from geometry:', poi.l, 'meters');
            }

            // Set generic direction info based on coordinates
            const [startLon, startLat] = coords[0];
            const [endLon, endLat] = coords[coords.length - 1];

            // Simple cardinal direction calculation
            const deltaLon = endLon - startLon;
            const deltaLat = endLat - startLat;

            if (Math.abs(deltaLon) > Math.abs(deltaLat)) {
                poi.t = deltaLon > 0 ? 'Richtung Osten' : 'Richtung Westen';
            } else {
                poi.t = deltaLat > 0 ? 'Richtung Norden' : 'Richtung Süden';
            }
            console.log('[MSN] Set direction from geometry:', poi.t);
        }

        // Only set road info if we have actual road data from TomTom
        // Don't set generic fallback names as they are misleading
        if (!poi.r) {
            console.log('[MSN] No road information available from TomTom API');
        }

        // Set current time as fallback for start time
        if (!poi.sd) {
            poi.sd = new Date().toISOString();
            console.log('[MSN] Set current time as start time:', poi.sd);
        }

        // Set generic "from" location
        if (!poi.f) {
            poi.f = 'Verkehrsbereich';
            console.log('[MSN] Set generic from location:', poi.f);
        }
    }

    return poi;
}

// Create incident popup content
function createIncidentPopup(incident) {
    const t = I18n.translations[I18n.currentLocale()][prefix];
    const props = incident.properties || {};

    let content = `<div class="baustellen-popup">`;
    content += `<h3>${t[incident.type] || incident.type}</h3>`;
    content += `<p><strong>${t.reason || 'Reason'}:</strong> ${incident.description}</p>`;

    if (props.roadNumbers && props.roadNumbers.length > 0) {
        content += `<p><strong>${t.street || 'Street'}:</strong> ${props.roadNumbers.join(', ')}</p>`;
    }

    if (props.from) {
        content += `<p><strong>${t.from || 'From'}:</strong> ${props.from}</p>`;
    }

    if (props.to) {
        content += `<p><strong>${t.direction || 'To'}:</strong> ${props.to}</p>`;
    }

    if (props.length) {
        content += `<p><strong>${t.distance || 'Length'}:</strong> ${props.length}m</p>`;
    }

    if (props.delay) {
        content += `<p><strong>${t.delay || 'Delay'}:</strong> ${Math.round(props.delay/60)} ${t.minutes || 'min'}</p>`;
    }

    if (props.startTime) {
        const startDate = new Date(props.startTime);
        content += `<p><strong>${t.at || 'Start'}:</strong> ${startDate.toLocaleString()}</p>`;
    }

    if (props.endTime) {
        const endDate = new Date(props.endTime);
        content += `<p><strong>${t.till || 'End'}:</strong> ${endDate.toLocaleString()}</p>`;
    }

    content += `<p><strong>${t.source || 'Source'}:</strong> TomTom Traffic API</p>`;
    content += `</div>`;

    return content;
}

// TomTom Routing API - Route calculations, ETAs, and alternative routes
function requestTomTomRouting(startCoords, endCoords, routeType = 'fastest') {
    if (!startCoords || !endCoords) return;

    const routingUrl = `${TOMTOM_BASE_URL}/routing/1/calculateRoute/${startCoords.lat},${startCoords.lon}:${endCoords.lat},${endCoords.lon}/json?key=${TOMTOM_API_KEY}&routeType=${routeType}&traffic=true&travelMode=car&maxAlternatives=2&computeBestOrder=false&instructionsType=text&language=de-DE&computeTravelTimeFor=all`;

    GM_xmlhttpRequest({
        method: 'GET',
        url: routingUrl,
        onload: function(response) {
            try {
                const data = JSON.parse(response.responseText);
                processTomTomRouting(data, startCoords, endCoords);
            } catch (e) {
                console.warn('[MSN] Error parsing TomTom Routing data:', e);
            }
        },
        onerror: function(error) {
            console.warn('[MSN] TomTom Routing API error:', error);
        }
    });
}

// TomTom Geocoding API - Address to coordinates conversion
function requestTomTomGeocoding(address, callback) {
    if (!address) return;

    const geocodingUrl = `${TOMTOM_BASE_URL}/search/2/geocode/${encodeURIComponent(address)}.json?key=${TOMTOM_API_KEY}&limit=5&countrySet=DE&language=de-DE`;

    GM_xmlhttpRequest({
        method: 'GET',
        url: geocodingUrl,
        onload: function(response) {
            try {
                const data = JSON.parse(response.responseText);
                processTomTomGeocoding(data, callback);
            } catch (e) {
                console.warn('[MSN] Error parsing TomTom Geocoding data:', e);
                if (callback) callback(null);
            }
        },
        onerror: function(error) {
            console.warn('[MSN] TomTom Geocoding API error:', error);
            if (callback) callback(null);
        }
    });
}

// TomTom Search API - POI search and fuzzy address lookup
function requestTomTomSearch(query, category = '', callback) {
    if (!query) return;

    let searchUrl = `${TOMTOM_BASE_URL}/search/2/search/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&limit=10&countrySet=DE&language=de-DE`;

    if (category) {
        searchUrl += `&categorySet=${category}`;
    }

    // Add current map bounds for local search
    if (W.map && W.map.getExtent) {
        const extent = W.map.getExtent();
        const bounds = extent.transform(W.map.getProjectionObject(), epsg4326);
        const center = bounds.getCenterLonLat();
        searchUrl += `&lat=${center.lat}&lon=${center.lon}&radius=50000`;
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: searchUrl,
        onload: function(response) {
            try {
                const data = JSON.parse(response.responseText);
                processTomTomSearch(data, callback);
            } catch (e) {
                console.warn('[MSN] Error parsing TomTom Search data:', e);
                if (callback) callback(null);
            }
        },
        onerror: function(error) {
            console.warn('[MSN] TomTom Search API error:', error);
            if (callback) callback(null);
        }
    });
}

// Process TomTom Routing data
function processTomTomRouting(data, startCoords, endCoords) {
    if (!data || !data.routes || data.routes.length === 0) return;

    data.routes.forEach((route, index) => {
        const summary = route.summary || {};
        const legs = route.legs || [];

        // Extract route information
        const routeInfo = {
            distance: summary.lengthInMeters || 0,
            travelTime: summary.travelTimeInSeconds || 0,
            trafficDelay: summary.trafficDelayInSeconds || 0,
            departureTime: summary.departureTime,
            arrivalTime: summary.arrivalTime,
            isAlternative: index > 0
        };

        // Process route geometry
        if (legs.length > 0) {
            legs.forEach(leg => {
                if (leg.points && leg.points.length > 0) {
                    addTomTomRouteVisualization(leg.points, routeInfo, index);
                }
            });
        }

        // Show route summary popup
        if (index === 0) { // Main route
            showTomTomRoutePopup(routeInfo, startCoords, endCoords);
        }
    });
}

// Process TomTom Geocoding data
function processTomTomGeocoding(data, callback) {
    if (!data || !data.results || data.results.length === 0) {
        if (callback) callback(null);
        return;
    }

    const results = data.results.map(result => ({
        address: result.address ? result.address.freeformAddress : '',
        coordinates: result.position ? {
            lat: result.position.lat,
            lon: result.position.lon
        } : null,
        score: result.score || 0,
        type: result.type || 'Point Address'
    }));

    if (callback) callback(results);
}

// Process TomTom Search data
function processTomTomSearch(data, callback) {
    if (!data || !data.results || data.results.length === 0) {
        if (callback) callback(null);
        return;
    }

    const results = data.results.map(result => ({
        name: result.poi ? result.poi.name : result.address.freeformAddress,
        address: result.address ? result.address.freeformAddress : '',
        coordinates: result.position ? {
            lat: result.position.lat,
            lon: result.position.lon
        } : null,
        category: result.poi ? result.poi.categories : [],
        score: result.score || 0,
        distance: result.dist || 0
    }));

    if (callback) callback(results);
}

// Add TomTom route visualization to map
function addTomTomRouteVisualization(points, routeInfo, routeIndex) {
    if (!points || points.length === 0) return;

    try {
        // Convert points to map projection
        const mapPoints = points.map(point => {
            const lonlat = new OpenLayers.LonLat(point.longitude, point.latitude);
            return lonlat.transform(epsg4326, W.map.getProjectionObject());
        });

        // Create line geometry
        const lineString = new OpenLayers.Geometry.LineString(
            mapPoints.map(p => new OpenLayers.Geometry.Point(p.lon, p.lat))
        );

        const lineFeature = new OpenLayers.Feature.Vector(lineString, {
            type: 'tomtom_route',
            routeInfo: routeInfo,
            routeIndex: routeIndex
        });

        // Style based on route type
        const isAlternative = routeInfo.isAlternative;
        const style = new OpenLayers.Style({
            strokeColor: isAlternative ? '#888888' : '#0066CC',
            strokeWidth: isAlternative ? 3 : 5,
            strokeOpacity: isAlternative ? 0.6 : 0.8,
            strokeDashstyle: isAlternative ? 'dash' : 'solid'
        });

        lineFeature.style = style;

        // Add to route layer (create if needed)
        if (!window.tomtomRouteLayer) {
            window.tomtomRouteLayer = new OpenLayers.Layer.Vector("TomTom Routes", {
                displayInLayerSwitcher: false,
                visibility: true
            });
            W.map.addLayer(window.tomtomRouteLayer);
        }

        window.tomtomRouteLayer.addFeatures([lineFeature]);

    } catch (e) {
        console.warn('[MSN] Error adding route visualization:', e);
    }
}

// Show TomTom route popup
function showTomTomRoutePopup(routeInfo, startCoords, endCoords) {
    const t = I18n.translations[I18n.currentLocale()][prefix];

    const distanceKm = (routeInfo.distance / 1000).toFixed(1);
    const travelTimeMin = Math.round(routeInfo.travelTime / 60);
    const trafficDelayMin = Math.round(routeInfo.trafficDelay / 60);

    let content = `<div class="tomtom-route-popup">`;
    content += `<h3>TomTom Route</h3>`;
    content += `<p><strong>${t.distance || 'Distance'}:</strong> ${distanceKm} km</p>`;
    content += `<p><strong>${t.duration || 'Duration'}:</strong> ${travelTimeMin} ${t.minutes || 'min'}</p>`;

    if (trafficDelayMin > 0) {
        content += `<p><strong>${t.delay || 'Traffic Delay'}:</strong> ${trafficDelayMin} ${t.minutes || 'min'}</p>`;
    }

    if (routeInfo.departureTime) {
        const depTime = new Date(routeInfo.departureTime);
        content += `<p><strong>${t.departure || 'Departure'}:</strong> ${depTime.toLocaleTimeString()}</p>`;
    }

    if (routeInfo.arrivalTime) {
        const arrTime = new Date(routeInfo.arrivalTime);
        content += `<p><strong>${t.arrival || 'Arrival'}:</strong> ${arrTime.toLocaleTimeString()}</p>`;
    }

    content += `<p><strong>${t.source || 'Source'}:</strong> TomTom Routing API</p>`;
    content += `</div>`;

    // Create popup at start coordinates
    const startLonLat = new OpenLayers.LonLat(startCoords.lon, startCoords.lat);
    const mapCoord = startLonLat.transform(epsg4326, W.map.getProjectionObject());

    const popup = new OpenLayers.Popup.FramedCloud(
        "tomtom-route",
        mapCoord,
        null,
        content,
        null,
        true
    );

    W.map.addPopup(popup);

    // Auto-close after 10 seconds
    setTimeout(() => {
        if (popup && W.map) {
            W.map.removePopup(popup);
        }
    }, 10000);
}

// TomTom Map Display API - Enhanced raster/vector map tiles
function addTomTomMapLayer() {
    if (!W.map) return;

    try {
        // TomTom Raster Map Layer
        const tomtomRasterLayer = new OpenLayers.Layer.XYZ(
            "TomTom Map",
            `${TOMTOM_BASE_URL}/map/1/tile/basic/main/\${z}/\${x}/\${y}.png?key=${TOMTOM_API_KEY}`,
            {
                sphericalMercator: true,
                wrapDateLine: true,
                numZoomLevels: 19,
                displayInLayerSwitcher: true,
                visibility: false,
                attribution: "© TomTom"
            }
        );

        // TomTom Traffic Layer
        const tomtomTrafficTileLayer = new OpenLayers.Layer.XYZ(
            "TomTom Traffic",
            `${TOMTOM_BASE_URL}/traffic/map/4/tile/flow/absolute/\${z}/\${x}/\${y}.png?key=${TOMTOM_API_KEY}`,
            {
                sphericalMercator: true,
                wrapDateLine: true,
                numZoomLevels: 19,
                displayInLayerSwitcher: true,
                visibility: false,
                isBaseLayer: false,
                opacity: 0.7,
                attribution: "© TomTom Traffic"
            }
        );

        // TomTom Incidents Layer
        const tomtomIncidentsTileLayer = new OpenLayers.Layer.XYZ(
            "TomTom Incidents",
            `${TOMTOM_BASE_URL}/traffic/map/4/tile/incidents/s3/\${z}/\${x}/\${y}.png?key=${TOMTOM_API_KEY}`,
            {
                sphericalMercator: true,
                wrapDateLine: true,
                numZoomLevels: 19,
                displayInLayerSwitcher: true,
                visibility: false,
                isBaseLayer: false,
                opacity: 0.8,
                attribution: "© TomTom Incidents"
            }
        );

        // Add layers to map
        W.map.addLayers([tomtomRasterLayer, tomtomTrafficTileLayer, tomtomIncidentsTileLayer]);

        // Store references for later control
        window.tomtomMapLayers = {
            raster: tomtomRasterLayer,
            traffic: tomtomTrafficTileLayer,
            incidents: tomtomIncidentsTileLayer
        };

    } catch (e) {
        console.warn('[MSN] Error adding TomTom map layers:', e);
    }
}

// Enhanced TomTom integration controls - REMOVED
// The floating control panel has been removed as checkboxes are now integrated into the left panel

// Show TomTom search results
function showTomTomSearchResults(results) {
    // Clear previous search markers
    if (window.tomtomSearchMarkers) {
        window.tomtomSearchMarkers.forEach(marker => {
            if (iconsLayer) iconsLayer.removeMarker(marker);
        });
    }
    window.tomtomSearchMarkers = [];

    results.forEach((result, index) => {
        if (!result.coordinates) return;

        const lonlat = new OpenLayers.LonLat(result.coordinates.lon, result.coordinates.lat);
        const mapCoord = lonlat.transform(epsg4326, W.map.getProjectionObject());

        // Create search result marker
        const size = new OpenLayers.Size(20, 20);
        const offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        const icon = new OpenLayers.Icon('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOCIgZmlsbD0iIzAwNjZDQyIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjwvdGV4dD4KPC9zdmc+', size, offset);

        const marker = new OpenLayers.Marker(mapCoord, icon);

        // Add click handler for search result
        marker.events.register('click', marker, function(e) {
            showTomTomSearchPopup(e, result);
        });

        window.tomtomSearchMarkers.push(marker);
        if (iconsLayer) iconsLayer.addMarker(marker);
    });

    // Zoom to first result
    if (results.length > 0 && results[0].coordinates) {
        const firstResult = results[0];
        const lonlat = new OpenLayers.LonLat(firstResult.coordinates.lon, firstResult.coordinates.lat);
        const mapCoord = lonlat.transform(epsg4326, W.map.getProjectionObject());
        W.map.setCenter(mapCoord, Math.max(W.map.getZoom(), 14));
    }
}

// Show TomTom search popup
function showTomTomSearchPopup(event, result) {
    let content = `<div class="tomtom-search-popup">`;
    content += `<h3>${result.name}</h3>`;
    content += `<p><strong>Address:</strong> ${result.address}</p>`;

    if (result.category && result.category.length > 0) {
        content += `<p><strong>Category:</strong> ${result.category.join(', ')}</p>`;
    }

    if (result.distance > 0) {
        const distanceKm = (result.distance / 1000).toFixed(1);
        content += `<p><strong>Distance:</strong> ${distanceKm} km</p>`;
    }

    content += `<p><strong>Score:</strong> ${(result.score * 100).toFixed(0)}%</p>`;
    content += `<p><strong>Source:</strong> TomTom Search API</p>`;
    content += `</div>`;

    showPopup(event, content);
}

// Show TomTom route dialog
function showTomTomRouteDialog() {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 2px solid #ccc;
        border-radius: 10px;
        padding: 20px;
        z-index: 10000;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;

    dialog.innerHTML = `
        <h3>TomTom Route Planning</h3>
        <p>Start Address:</p>
        <input type="text" id="route-start" style="width: 100%; margin-bottom: 10px;" placeholder="Enter start address">
        <p>End Address:</p>
        <input type="text" id="route-end" style="width: 100%; margin-bottom: 10px;" placeholder="Enter end address">
        <p>Route Type:</p>
        <select id="route-type" style="width: 100%; margin-bottom: 10px;">
            <option value="fastest">Fastest</option>
            <option value="shortest">Shortest</option>
            <option value="eco">Eco</option>
        </select>
        <br><br>
        <button id="calculate-route" style="margin-right: 10px;">Calculate Route</button>
        <button id="cancel-route">Cancel</button>
    `;

    document.body.appendChild(dialog);

    document.getElementById('calculate-route').addEventListener('click', function() {
        const startAddr = document.getElementById('route-start').value.trim();
        const endAddr = document.getElementById('route-end').value.trim();
        const routeType = document.getElementById('route-type').value;

        if (startAddr && endAddr) {
            // Geocode addresses first
            requestTomTomGeocoding(startAddr, function(startResults) {
                if (startResults && startResults.length > 0) {
                    requestTomTomGeocoding(endAddr, function(endResults) {
                        if (endResults && endResults.length > 0) {
                            const startCoords = startResults[0].coordinates;
                            const endCoords = endResults[0].coordinates;
                            requestTomTomRouting(startCoords, endCoords, routeType);
                        }
                    });
                }
            });
        }

        document.body.removeChild(dialog);
    }, { passive: true });

    document.getElementById('cancel-route').addEventListener('click', function() {
        document.body.removeChild(dialog);
    }, { passive: true });
}

function requestAll() {
    // reset collections and stats before fresh fetch
    resetStatistics();
    // requestClosures(); // REMOVED - Alternative data source removed to prevent conflicts
    // requestTomTomTrafficFlow(); // REMOVED - Traffic Flow functionality disabled to prevent duplicates
    requestTomTomTrafficIncidents();
}

function getCheckbox(idSuffix, iconURL, labelText, title, divCss = {}, labelCss = {}) {
    const id = `${prefix}-${idSuffix}`;
    const fallbackIcon = (mtotypes.find(t => t.type === idSuffix)?.icon) || 'https://upload.wikimedia.org/wikipedia/commons/0/02/Zeichen_101_-_Gefahrstelle%2C_StVO_1970.svg';
    const inlineFallback = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="%23f39c12" stroke="%23222" stroke-width="4"/><rect x="14" y="30" width="36" height="8" fill="%23222"/></svg>';
    const $img = $(`<img src="${iconURL}">`);
    $img.on('error', function() {
        if (this.src !== fallbackIcon) {
            this.src = fallbackIcon;
        } else if (this.src !== inlineFallback) {
            this.src = inlineFallback;
        }
    });
    return $('<div>').append(
        $('<label>', { class: "mto-container" }).append(
            $('<input>', { id: id, type: 'checkbox', title: title, class: `${prefix}Checkbox` }),
            $img,
            document.createTextNode(labelText)
        ).css(labelCss)
    ).css(divCss);
}

function checkboxChanged(evt) {
    let myConf = JSON.parse(localStorage[prefix]);
    myConf[ evt.target.id.replace(`${prefix}-`,'') ] = evt.target.checked;
    localStorage[prefix] = JSON.stringify(myConf);
    // link panel-checkbox with layer-checkbox
    if (evt.target == panelCheckBoxElement) {
        $(layerCheckBoxElement).click();
    }
    // Update stats/table for any filter toggles
    scheduleRender();
}

function opacityChanged(evt) {
    const rawVal = evt && evt.target && typeof evt.target.value !== 'undefined' ? evt.target.value : 64;
    const pct = parseFloat(rawVal);
    const clampedPct = isNaN(pct) ? 64 : Math.max(0, Math.min(100, pct));
    const opacity = clampedPct / 100;

    if (MSNLayer && typeof MSNLayer.setOpacity === 'function') {
        MSNLayer.setOpacity(opacity);
    }

    let myConf;
    try {
        myConf = JSON.parse(localStorage[prefix] || '{}');
    } catch (e) {
        myConf = {};
    }
    myConf.opacity = opacity;
    try {
        localStorage[prefix] = JSON.stringify(myConf);
    } catch (e) { /* ignore storage errors */ }

    const valEl = document.getElementById(`${prefix}-opacity-value`);
    if (valEl) {
        valEl.textContent = `${Math.round(opacity * 100)}%`;
    }
}



async function addSidepanel() {
    const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(SCRIPT_ID);

    tabLabel.innerText = prefix;
    tabLabel.title = name;

    // Wait for the tab pane to be connected to the DOM
    await W.userscripts.waitForElementConnected(tabPane);

    const $tabPane = $(tabPane);
    $tabPane.html(`
        <div id="sidepanel-${SCRIPT_ID}">
            <div style="margin-bottom: 0.5em">
                <a href="${scriptURL}" target="_blank">${name} V${version}</a>
            </div>
        </div>
    `);

    const sidepanel = $(`#sidepanel-${SCRIPT_ID}`);

    // Add enable-box
    sidepanel.append(
        getCheckbox(`enable`, "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", I18n.t(`${prefix}.enable`),"",{margin:"0.5em 0"})
    );
    panelCheckBoxElement = document.getElementById(`${prefix}-enable`);

    // Add opacity slider
    sidepanel.append(
        $("<hr>", {style: "margin: 1em 0"}),
        $('<div>', {class: 'opacity-label'}).append(
            $('<span>').text(I18n.t(`${prefix}.opacity`)),
            $('<span>', {id: `${prefix}-opacity-value`}).text('64%')
        ),
        $('<input>', {
            type: 'range',
            class: 'opacity-slider',
            id: `${prefix}-opacity-slider`,
            min: 0,
            max: 100,
            value: 64,
            step: 1
        })
    );





    // TomTom Marker Filter Section
    sidepanel.append(
        $("<hr>", {style: "margin: 1em 0"}),
        $('<div>', { class: 'section-title'}).text('Marker Filter'),
        $('<div>', { style: 'margin: 6px 0; display:flex; align-items:center; gap:8px;' }).append(
            getCheckbox('tomtom-construction', mtotypes.find(t => t.type === 'construct')?.icon || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", 'Baustellen (Kategorie 1,2)', 'Zeige/Verstecke Baustellen und Straßenarbeiten')
        ),
        $('<div>', { style: 'margin: 6px 0; display:flex; align-items:center; gap:8px;' }).append(
            getCheckbox('tomtom-closure', mtotypes.find(t => t.type === 'closure')?.icon || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", 'Sperrungen (Kategorie 3,4)', 'Zeige/Verstecke Straßensperrungen und Fahrstreifensperrungen')
        ),
        $('<div>', { style: 'margin: 6px 0; display:flex; align-items:center; gap:8px;' }).append(
            getCheckbox('tomtom-narrowing', mtotypes.find(t => t.type === 'narrows')?.icon || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", 'Verengungen (Kategorie 5)', 'Zeige/Verstecke Fahrstreifenverengungen')
        ),
        $('<div>', { style: 'margin: 6px 0; display:flex; align-items:center; gap:8px;' }).append(
            getCheckbox('tomtom-traffic', mtotypes.find(t => t.type === 'traffic')?.icon || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", 'Staus (Kategorie 6,14)', 'Zeige/Verstecke Staus und langsamen Verkehr')
        ),
        $('<div>', { style: 'margin: 6px 0; display:flex; align-items:center; gap:8px;' }).append(
            getCheckbox('tomtom-others', mtotypes.find(t => t.type === 'others')?.icon || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", 'Sonstige (Andere)', 'Zeige/Verstecke sonstige Verkehrsereignisse')
        ),
        $('<div>', { style: 'margin: 6px 0; display:flex; align-items:center; gap:8px;' }).append(
            getCheckbox('tomtom-vollsperrung', mtotypes.find(t => t.type === 'vollsperrung')?.icon || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", 'Vollsperrung (Kategorie 8)', 'Zeige/Verstecke Vollsperrungen')
        ),
        $('<div>', { style: 'margin: 6px 0; display:flex; align-items:center; gap:8px;' }).append(
            getCheckbox('tomtom-traffic-tiles', "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", 'Traffic Tiles Average', 'Zeige/Verstecke TomTom Traffic Tiles')
        ),
        $('<div>', { style: 'margin: 6px 0; display:flex; align-items:center; gap:8px;' }).append(
            getCheckbox('tomtom-incident-tiles', "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", 'Incident Tiles', 'Zeige/Verstecke TomTom Incident Tiles')
        )
        // REMOVED: Buggy "Alle anzeigen/Alle ausblenden" buttons that don't work correctly with Incident Tiles
    );

    opacitySlider = document.getElementById(`${prefix}-opacity-slider`);
    opacitySlider.addEventListener('input', opacityChanged, { passive: true });

    // Add event listeners for new controls

    // Add event listeners for merged Traffic Tiles and Incident Tiles checkboxes
    document.getElementById(`${prefix}-tomtom-traffic-tiles`).addEventListener('change', function(e) {
        if (window.tomtomMapLayers && window.tomtomMapLayers.traffic) {
            window.tomtomMapLayers.traffic.setVisibility(e.target.checked);
        }
    }, { passive: true });

    document.getElementById(`${prefix}-tomtom-incident-tiles`).addEventListener('change', function(e) {
        if (window.tomtomMapLayers && window.tomtomMapLayers.incidents) {
            window.tomtomMapLayers.incidents.setVisibility(e.target.checked);
        }
    }, { passive: true });




    // Load configuration
    const myConf = JSON.parse(localStorage[prefix]);
    const boxes = $(`.${prefix}Checkbox`).each(function () {
        const id = $(this).attr("id").replace(`${prefix}-`,'');
        $(this)
            .prop("checked", myConf[id])
            .change(checkboxChanged);
    });

    // Set opacity slider to saved value
    if (myConf.opacity !== undefined) {
        opacitySlider.value = myConf.opacity * 100;
        document.getElementById(`${prefix}-opacity-value`).textContent = `${Math.round(myConf.opacity * 100)}%`;
    }





    // REMOVED: TomTom Filter Event Listeners for buggy "Alle anzeigen/Alle ausblenden" buttons

    // Initialize filter states from configuration
    const tomtomFilters = {
        'tomtom-construction': myConf['tomtom-construction'] !== false,
        'tomtom-closure': myConf['tomtom-closure'] !== false,
        'tomtom-narrowing': myConf['tomtom-narrowing'] !== false,
        'tomtom-traffic': myConf['tomtom-traffic'] !== false,
        'tomtom-others': myConf['tomtom-others'] !== false,
        'tomtom-vollsperrung': myConf['tomtom-vollsperrung'] !== false,
        'tomtom-incident-tiles': myConf['tomtom-incident-tiles'] !== false
    };

    // Set checkbox states - use the correct IDs with prefix
    Object.keys(tomtomFilters).forEach(filterId => {
        const checkbox = document.getElementById(`${prefix}-${filterId}`);
        if (checkbox) {
            checkbox.checked = tomtomFilters[filterId];
            checkbox.addEventListener('change', function() {
                tomtomFilters[filterId] = this.checked;
                saveTomTomFilterConfig(filterId, this.checked);

                // Special handling for incident tiles checkbox
                if (filterId === 'tomtom-incident-tiles') {
                    if (window.tomtomMapLayers && window.tomtomMapLayers.incidents) {
                        window.tomtomMapLayers.incidents.setVisibility(this.checked);
                    }
                } else {
                    debouncedApplyTomTomMarkerFilters();
                }
            }, { passive: true });
        }
    });

    // Apply initial filter state
    applyTomTomMarkerFilters();
}

// Inject a toggle into WME right side Layers panel under category "Straßen" (or "Roads")
function injectLayerPanelToggle() {
    try {
        // Try to find a category header containing 'Straßen' or 'Roads'
        const candidates = Array.from(document.querySelectorAll('div, h3, h4, h5, h6, span'));
        const header = candidates.find(el => {
            const txt = (el.textContent || '').trim();
            return /^(Straßen|Straße|Roads)$/i.test(txt);
        });
        if (!header) {
            // Schedule another attempt later if UI not ready
            setTimeout(injectLayerPanelToggle, 1000);
            return;
        }

        // Try to find a container below the header to append our item
        let container = header.nextElementSibling;
        // If the next sibling isn't a list-like container, search nearby
        if (!container || !(container instanceof HTMLElement)) {
            container = header.parentElement;
        }

        if (!container) {
            setTimeout(injectLayerPanelToggle, 1000);
            return;
        }

        // Avoid duplicating the checkbox
        if (container.querySelector(`#${prefix}-layers-toggle`)) return;

        // Build a compact checkbox row
        const row = document.createElement('label');
        row.className = 'mto-container';
        row.title = 'MSN Baustellen & Traffic Overlay';
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.id = `${prefix}-layers-toggle`;
        chk.className = `${prefix}Checkbox`;
        const txtNode = document.createTextNode('MSN Traffic Overlay');

        row.appendChild(chk);
        row.appendChild(txtNode);

        const wrapper = document.createElement('div');
        wrapper.appendChild(row);

        container.appendChild(wrapper);

        // Initialize checked state from config
        let myConf;
        try { myConf = JSON.parse(localStorage[prefix] || '{}'); } catch(e) { myConf = {}; }
        if (typeof myConf.enable === 'undefined') myConf.enable = true;
        chk.checked = !!myConf.enable;

        // Save reference and wire handler
        layerCheckBoxElement = chk;
        chk.addEventListener('change', function(evt) {
            myConf.enable = evt.target.checked;
            try { localStorage[prefix] = JSON.stringify(myConf); } catch(e) {}
            // Toggle layers
            if (MSNLayer) MSNLayer.setVisibility(evt.target.checked);
            if (iconsLayer) iconsLayer.setVisibility(evt.target.checked);
            if (baustellenLayer) {
                const cfg2 = JSON.parse(localStorage[prefix] || '{}');
                baustellenLayer.setVisibility(evt.target.checked && !!cfg2.baustellen);
            }
            // Keep sidepanel checkbox in sync
            if (panelCheckBoxElement) {
                panelCheckBoxElement.checked = evt.target.checked;
            }
            // Trigger data load when enabling
            if (evt.target.checked) {
                try { requestAll(); } catch(e) {}
            }
        }, { passive: true });

        // Keep the layer checkbox synced if sidepanel changes
        if (panelCheckBoxElement) {
            panelCheckBoxElement.addEventListener('change', function(e){
                try { layerCheckBoxElement.checked = e.target.checked; } catch(_) {}
            }, { passive: true });
        }
    } catch (e) {
        // Retry on failure; UI may rebuild later
        setTimeout(injectLayerPanelToggle, 1500);
    }
}

// Add Layer Switcher checkbox for MSN Traffic Overlay
function addLayerSwitcherCheckbox() {
    try {
        let roadGroupSelector = document.getElementById('layer-switcher-group_road');
        if (roadGroupSelector != null) {
            let roadGroup = roadGroupSelector.parentNode.parentNode.getElementsByTagName("UL")[0];

            // Check if checkbox already exists
            if (document.getElementById('layer-switcher-MSN-traffic')) {
                return;
            }

            let toggler = document.createElement('li');
            let checkbox = document.createElement("wz-checkbox");
            checkbox.id = 'layer-switcher-MSN-traffic';
            checkbox.className = "hydrated";
            checkbox.disabled = !roadGroupSelector.checked;

            // Get current visibility state
            let myConf;
            try { myConf = JSON.parse(localStorage[prefix] || '{}'); } catch(e) { myConf = {}; }
            if (typeof myConf.enable === 'undefined') myConf.enable = true;

            checkbox.checked = MSNLayer ? MSNLayer.getVisibility() : myConf.enable;
            checkbox.appendChild(document.createTextNode("MSN Traffic Overlay"));
            toggler.appendChild(checkbox);
            roadGroup.appendChild(toggler);

            checkbox.addEventListener('change', function (e) {
                toggleLayer(e, checkbox, MSNLayer, iconsLayer);
            });

            roadGroupSelector.addEventListener('change', function (e) {
                toggleLayer(e, checkbox, MSNLayer, iconsLayer);
                checkbox.disabled = !e.target.checked;
            });

            layerCheckBoxElement = checkbox;
        } else {
            // Retry if layer switcher not ready yet
            setTimeout(addLayerSwitcherCheckbox, 1000);
        }
    } catch (e) {
        console.warn('[MSN] Error adding layer switcher checkbox:', e);
        setTimeout(addLayerSwitcherCheckbox, 1000);
    }
}

// Toggle function for layer switcher
function toggleLayer(e, checkbox, MSNLayer, iconsLayer) {
    let myConf = JSON.parse(localStorage[prefix]);
    MSNLayer.setVisibility(e.target.checked && checkbox.checked);
    iconsLayer.setVisibility(e.target.checked && checkbox.checked);
    myConf.enable = checkbox.checked;
    localStorage[prefix] = JSON.stringify(myConf);
    // sync sidepanel checkbox
    panelCheckBoxElement.checked = checkbox.checked;
}

// Save TomTom filter configuration
function saveTomTomFilterConfig(filterId, value) {
    try {
        const cfg = JSON.parse(localStorage[prefix] || '{}');
        cfg[filterId] = value;
        localStorage[prefix] = JSON.stringify(cfg);
    } catch (e) {
        console.warn('[MSN] Error saving TomTom filter config:', e);
    }
}

// Cache DOM elements to avoid repeated queries
let cachedFilterElements = null;
let filterDebounceTimer = null;

// Debounced version of applyTomTomMarkerFilters
function debouncedApplyTomTomMarkerFilters() {
    if (filterDebounceTimer) {
        clearTimeout(filterDebounceTimer);
    }
    filterDebounceTimer = setTimeout(() => {
        applyTomTomMarkerFilters();
        filterDebounceTimer = null;
    }, 50); // 50ms debounce delay
}

// Apply TomTom marker filters (optimized)
function applyTomTomMarkerFilters() {
    if (!incidentMarkers) return;

    // Cache DOM elements on first call
    if (!cachedFilterElements) {
        cachedFilterElements = {
            construct: document.getElementById(`${prefix}-tomtom-construction`),
            closure: document.getElementById(`${prefix}-tomtom-closure`),
            narrows: document.getElementById(`${prefix}-tomtom-narrowing`),
            traffic: document.getElementById(`${prefix}-tomtom-traffic`),
            others: document.getElementById(`${prefix}-tomtom-others`),
            vollsperrung: document.getElementById(`${prefix}-tomtom-vollsperrung`)
        };
    }

    // Get current filter states using cached elements
    const filters = {
        construct: cachedFilterElements.construct?.checked !== false,
        closure: cachedFilterElements.closure?.checked !== false,
        narrows: cachedFilterElements.narrows?.checked !== false,
        traffic: cachedFilterElements.traffic?.checked !== false,
        others: cachedFilterElements.others?.checked !== false,
        vollsperrung: cachedFilterElements.vollsperrung?.checked !== false
    };

    // Batch DOM updates for better performance
    const markersToUpdate = [];

    // Collect markers that need updates
    Object.keys(incidentMarkers).forEach(markerId => {
        const marker = incidentMarkers[markerId];
        if (!marker || !markerId.startsWith('tomtom_')) return;

        const markerType = marker.tomtomType || 'others';
        const shouldShow = filters[markerType];

        markersToUpdate.push({ marker, shouldShow });
    });

    // Apply updates in a single batch
    markersToUpdate.forEach(({ marker, shouldShow }) => {
        if (marker.display) {
            marker.display(shouldShow);
        } else if (marker.icon && marker.icon.imageDiv) {
            marker.icon.imageDiv.style.display = shouldShow ? 'block' : 'none';
        }
    });
}

function initLocalStorage() {
    if (undefined == localStorage[prefix]) {
        let myConf = {};
        // Removed: mtotypes checkbox initialization as they are non-functional

        // Integrate old config
        if (localStorage.DrawMSNTrafficOverlay) {
            myConf.enable = localStorage.DrawMSNTrafficOverlay;
            delete localStorage.DrawMSNTrafficOverlay;
        } else {
            myConf.enable = true;
        }

        myConf.iconSize = 32;
        myConf.opacity = 0.64;
        localStorage[prefix] = JSON.stringify(myConf);
    } else {
        // Update existing config with new options
        let myConf = JSON.parse(localStorage[prefix]);
        let updated = false;
        if (myConf.iconSize === undefined) { myConf.iconSize = 32; updated = true; }
        if (myConf.opacity === undefined) { myConf.opacity = 0.64; updated = true; }
        if (updated) localStorage[prefix] = JSON.stringify(myConf);
    }
}

async function init() {
    // Initialize storage
    initLocalStorage();

    // Load translations
    loadTranslations();

    // Insert CSS
    insertCSS();

    // Add OpenLayers extensions
    addQuadKeyLayer();
    addIcon();

    // Load configuration with safe defaults
    const myConf = JSON.parse(localStorage[prefix] || '{}');
    if (typeof myConf.enable === 'undefined') myConf.enable = true;
    if (typeof myConf.opacity === 'undefined') myConf.opacity = 0.64;
    localStorage[prefix] = JSON.stringify(myConf);

    // Setup projections
    epsg3857 = new OpenLayers.Projection("EPSG:3857");
    epsg4326 = new OpenLayers.Projection("EPSG:4326");

    // Create MSN Traffic layer using TomTom Traffic Flow API
    MSNLayer = new OpenLayers.Layer.QuadKey("MSN Traffic", `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/\${z}/\${x}/\${y}.png?key=${TOMTOM_API_KEY}`, {
        isBaseLayer: false,
        uniqueName: '__DrawMSNTraffic',
        tileSize: new OpenLayers.Size(256, 256),
        transitionEffect: 'resize',
        displayInLayerSwitcher: false,
        opacity: myConf.opacity || 0.64,
        visibility: false,
        tileOptions: { crossOriginKeyword: 'anonymous' }
    });

    // Create marker layers with improved settings
    iconsLayer = new OpenLayers.Layer.Markers("MSN Traffic Icons", {
        displayInLayerSwitcher: false,
        uniqueName: "__DrawMSNTrafficIcons",
        visibility: true,
        isBaseLayer: false
    });

    baustellenLayer = new OpenLayers.Layer.Markers("Baustellen", {
        displayInLayerSwitcher: false,
        uniqueName: "__DrawBaustellen",
        visibility: true,
        isBaseLayer: false
    });

    // Add info popup div
    addInfoPopup();

    // Add layers to map
    W.map.addLayer(MSNLayer);
    W.map.addLayer(iconsLayer);
    W.map.addLayer(baustellenLayer);

    // Ensure marker layers appear above tiles/overlays with better error handling
    try {
        if (typeof iconsLayer.setZIndex === 'function') {
            iconsLayer.setZIndex(10000);
        }
        if (typeof baustellenLayer.setZIndex === 'function') {
            baustellenLayer.setZIndex(10001);
        }
    } catch (e) {
    }

    // Set initial visibility
    MSNLayer.setVisibility(myConf.enable);
    iconsLayer.setVisibility(myConf.enable);
    baustellenLayer.setVisibility(false);

    // Force visibility check
    setTimeout(() => {
    }, 1000);

    // Add sidebar panel (non-fatal if not available)
    try {
        await addSidepanel();
    } catch (e) {
    }

    // Add toggle to the built-in Layers panel (Straßen/Roads)
    try {
        setTimeout(injectLayerPanelToggle, 1000);
    } catch (e) {
    }

    // Add Layer Switcher checkbox for MSN Traffic Overlay
    addLayerSwitcherCheckbox();

    // Register map events
    W.map.events.register("zoomend", null, requestAll);
    W.map.events.register("moveend", null, requestAll);

    // Initial data request with delay to ensure map is fully loaded
    setTimeout(() => {
        if (W && W.map && typeof W.map.getExtent === 'function') {
            requestAll();
        } else {
            setTimeout(requestAll, 2000);
        }
    }, 1000);

    // Show debug toast with counts
    try {
        setTimeout(function(){
            const s = eventStatistics || {};
            const total = Object.values(s).reduce((a,b)=>a+b,0);
            showNotification(`MSN: ${total} Events (closures:${s.closure||0}, works:${s.construct||0}, narrows:${s.narrows||0}, traffic:${s.traffic||0}, others:${s.others||0})`);
        }, 1200);
    } catch (e) { /* ignore */ }

    // Start auto-refresh if enabled

    // Initialize TomTom API features
    try {
        addTomTomMapLayer();
        // addTomTomControls(); // REMOVED - floating control panel no longer needed
    } catch (e) {
        console.warn('[MSN] Error initializing TomTom features:', e);
    }
}

// Bootstrap function using new WME API
function bootstrap() {
    if (W?.userscripts?.state?.isReady) {
        init();
    } else {
        document.addEventListener("wme-ready", init, { once: true });
    }
}

// Start bootstrap
bootstrap();

})();

// Severity & metrics helpers
function sevLabel(sev){
    const currentPrefix = (typeof prefix !== 'undefined') ? prefix : '⛔🛣️🚧';
    switch(sev){
        case 'high': return I18n.t(`${currentPrefix}.severity_high`);
        case 'medium': return I18n.t(`${currentPrefix}.severity_medium`);
        case 'low': return I18n.t(`${currentPrefix}.severity_low`);
        default: return I18n.t(`${currentPrefix}.severity_low`);
    }
}
function getSeverity(poi, isBaustelle=false){
    try {
        if (isBaustelle) {
            const txt = `${poi.name||''} ${poi.description||''}`.toLowerCase();
            if (/vollsperrung|gesperrt|umleitung/.test(txt)) return 'high';
            if (/einspurig|fahrstreifen|vereng/.test(txt)) return 'medium';
            return 'low';
        } else {
            const txt = `${poi.d||''} ${poi.c||''}`.toLowerCase();
            const len = poi.l || 0;
            if (/closed|closure|gesperrung|vollsperrung|accident|unfall/.test(txt)) return 'high';
            if (/traffic|jam|stau|lane|fahrstreifen|narrows|einspurig/.test(txt)) {
                if (len >= 3000) return 'high';
                return 'medium';
            }
            if (len >= 5000) return 'medium';
            return 'low';
        }
    } catch(e) { return 'low'; }
}
function getTrafficDensity(sev){
    const lang = (typeof language !== 'undefined') ? language : 'en';
    if (sev==='high') return lang==='de' ? 'hoch' : 'high';
    if (sev==='medium') return lang==='de' ? 'mittel' : 'medium';
    return lang==='de' ? 'gering' : 'low';
}
function estimateDelayMinutes(poi){
    try {
        const len = poi.l || 0; // meters
        if (!len) return 0;
        const sev = getSeverity(poi, false);
        // Assume base free-flow 80 km/h, jam speed depending on severity
        const base = 80; // km/h
        const speed = (sev==='high') ? 15 : (sev==='medium') ? 30 : 50; // km/h
        const hoursFree = (len/1000) / base;
        const hoursCong = (len/1000) / speed;
        const deltaH = Math.max(0, hoursCong - hoursFree);
        return Math.round(deltaH * 60);
    } catch(e) { return 0; }
}
function renderStatistics(){
    const el = document.getElementById(`${prefix}-stats`);
    if (!el) return;
    const totalInc = (eventStatistics.closure + eventStatistics.construct + eventStatistics.narrows + eventStatistics.traffic + eventStatistics.others);
    el.innerHTML = `
        <div>${I18n.t(prefix).stats_incidents}: ${totalInc}
            <ul style="margin:4px 0 0 16px;">
                <li>${I18n.t(prefix).closure}: ${eventStatistics.closure}</li>
                <li>${I18n.t(prefix).traffic}: ${eventStatistics.traffic}</li>
                <li>${I18n.t(prefix).narrows}: ${eventStatistics.narrows}</li>
                <li>${I18n.t(prefix).construct}: ${eventStatistics.construct}</li>
                <li>${I18n.t(prefix).others}: ${eventStatistics.others}</li>
            </ul>
        </div>
    `;
}
function buildExportPayload(){
    return {
        meta: { generatedAt: new Date().toISOString(), locale: language, version },
        statistics: eventStatistics,
        incidents: currentIncidents,
        constructions: currentConstructions
    };
}
function buildCSV(){
    const rows = [];
    rows.push(['kind','type','severity','description','reason','street','from','to','length_m','start','end','last_update','lon','lat'].join(','));
    currentIncidents.forEach(p=>{
        rows.push([
            'incident', p.type||'', p.severity||'', JSON.stringify(p.description||''), JSON.stringify(p.cause||''), JSON.stringify(p.street||''), JSON.stringify(p.from||''), JSON.stringify(p.to||''), p.length_m||'', p.start||'', p.end||'', '', p.lon||'', p.lat||''
        ].join(','));
    });
    currentConstructions.forEach(p=>{
        rows.push([
            'construction', 'construct', getSeverity(p,true)||'', JSON.stringify(p.name||''), JSON.stringify(p.description||''), JSON.stringify(p.name||''), '', '', '', p.start_date||'', p.end_date||'', p.last_update||'', p.lon||'', p.lat||''
        ].join(','));
    });
    return rows.join('\n');
}
function download(filename, text, mime){
    const blob = new Blob([text], {type: mime||'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 0);
}
function showNotification(message){
    const div = document.createElement('div');
    div.className = 'msn-toast';
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(()=>{ div.style.transition='opacity .4s'; div.style.opacity='0'; }, 2500);
    setTimeout(()=>{ if (div && div.parentNode) div.parentNode.removeChild(div); }, 3000);
}