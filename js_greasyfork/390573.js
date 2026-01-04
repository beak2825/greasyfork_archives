// ==UserScript==
// @name            WME HN NavPoints (beta)
// @namespace       https://greasyfork.org/users/166843
// @description     Shows navigation points of all house numbers in WME
// @version         2024.08.18.01
// @author          dBsooner
// @grant           GM_xmlhttpRequest
// @connect         greasyfork.org
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license         GPLv3
// @match           http*://*.waze.com/*editor*
// @exclude         http*://*.waze.com/user/editor*
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/390573/WME%20HN%20NavPoints%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/390573/WME%20HN%20NavPoints%20%28beta%29.meta.js
// ==/UserScript==

/* global _, GM_info, GM_xmlhttpRequest, OpenLayers, W, WazeWrap */

/*
 * Original concept and code for WME HN NavPoints was written by MajkiiTelini. After version 0.6.6, this
 * script is maintained by the WazeDev team. Special thanks is definitely given to MajkiiTelini for his
 * hard work and dedication to the original script.
 *
 */

(function () {
    'use strict';

    // eslint-disable-next-line no-nested-ternary
    const _SCRIPT_SHORT_NAME = `HN NavPoints${(/beta/.test(GM_info.script.name) ? ' β' : /\(DEV\)/i.test(GM_info.script.name) ? ' Ω' : '')}`,
        _SCRIPT_LONG_NAME = GM_info.script.name,
        _IS_ALPHA_VERSION = /[Ω]/.test(_SCRIPT_SHORT_NAME),
        _IS_BETA_VERSION = /[β]/.test(_SCRIPT_SHORT_NAME),
        _PROD_DL_URL = 'https://greasyfork.org/scripts/390565-wme-hn-navpoints/code/WME%20HN%20NavPoints.user.js',
        _FORUM_URL = 'https://www.waze.com/forum/viewtopic.php?f=819&t=269397',
        _SETTINGS_STORE_NAME = 'WMEHNNavPoints',
        _BETA_DL_URL = 'YUhSMGNITTZMeTluY21WaGMzbG1iM0pyTG05eVp5OXpZM0pwY0hSekx6TTVNRFUzTXkxM2JXVXRhRzR0Ym1GMmNHOXBiblJ6TFdKbGRHRXZZMjlrWlM5WFRVVWxNakJJVGlVeU1FNWhkbEJ2YVc1MGN5VXlNQ2hpWlhSaEtTNTFjMlZ5TG1weg==',
        _ALERT_UPDATE = true,
        _SCRIPT_VERSION = GM_info.script.version.toString(),
        _SCRIPT_VERSION_CHANGES = ['CHANGE: WME beta release v2.242 compatibility.'],
        _DEBUG = /[βΩ]/.test(_SCRIPT_SHORT_NAME),
        _LOAD_BEGIN_TIME = performance.now(),
        _elems = {
            div: document.createElement('div'),
            h4: document.createElement('h4'),
            h6: document.createElement('h6'),
            form: document.createElement('form'),
            i: document.createElement('i'),
            label: document.createElement('label'),
            li: document.createElement('li'),
            p: document.createElement('p'),
            svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            svgText: document.createElementNS('http://www.w3.org/2000/svg', 'text'),
            ul: document.createElement('ul'),
            'wz-checkbox': document.createElement('wz-checkbox'),
            'wz-text-input': document.createElement('wz-text-input')
        },
        _spinners = {
            destroyAllHNs: false,
            drawHNs: false,
            processSegs: false
        },
        _timeouts = {
            checkMarkersEvents: {},
            hideTooltip: undefined,
            onWmeReady: undefined,
            saveSettingsToStorage: undefined,
            stripTooltipHTML: undefined
        },
        dec = (s = '') => atob(atob(s));

    let _settings = {},
        _scriptActive = false,
        _saveButtonObserver,
        _HNNavPointsLayer,
        _HNNavPointsNumbersLayer,
        _processedSegments = [],
        _segmentsToProcess = [],
        _segmentsToRemove = [],
        _hnNavPointsTooltipDiv,
        _popup = {
            inUse: false,
            hnNumber: -1,
            segmentId: -1
        };

    function log(message, data = '') { console.log(`${_SCRIPT_SHORT_NAME}:`, message, data); }
    function logError(message, data = '') { console.error(`${_SCRIPT_SHORT_NAME}:`, new Error(message), data); }
    // function logWarning(message, data = '') { console.warn(`${_SCRIPT_SHORT_NAME}:`, message, data); }
    function logDebug(message, data = '') {
        if (_DEBUG)
            log(message, data);
    }

    function $extend(...args) {
        const extended = {},
            deep = Object.prototype.toString.call(args[0]) === '[object Boolean]' ? args[0] : false,
            merge = function (obj) {
                Object.keys(obj).forEach((prop) => {
                    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]')
                            extended[prop] = $extend(true, extended[prop], obj[prop]);
                        else if ((obj[prop] !== undefined) && (obj[prop] !== null))
                            extended[prop] = obj[prop];
                    }
                });
            };
        for (let i = deep ? 1 : 0, { length } = args; i < length; i++) {
            if (args[i])
                merge(args[i]);
        }
        return extended;
    }

    function createElem(type = '', attrs = {}, eventListener = []) {
        const el = _elems[type]?.cloneNode(false) || _elems.div.cloneNode(false),
            applyEventListeners = function ([evt, cb]) {
                return this.addEventListener(evt, cb);
            };
        Object.keys(attrs).forEach((attr) => {
            if ((attrs[attr] !== undefined) && (attrs[attr] !== 'undefined') && (attrs[attr] !== null) && (attrs[attr] !== 'null')) {
                if ((attr === 'disabled') || (attr === 'checked') || (attr === 'selected') || (attr === 'textContent') || (attr === 'innerHTML'))
                    el[attr] = attrs[attr];
                else
                    el.setAttribute(attr, attrs[attr]);
            }
        });
        if (eventListener.length > 0) {
            eventListener.forEach((obj) => {
                Object.entries(obj).map(applyEventListeners.bind(el));
            });
        }
        return el;
    }

    async function loadSettingsFromStorage() {
        const defaultSettings = {
                disableBelowZoom: 17,
                enableTooltip: true,
                hnLines: true,
                hnNumbers: true,
                keepHNLayerOnTop: true,
                toggleHNNavPointsShortcut: '',
                toggleHNNavPointsNumbersShortcut: '',
                lastSaved: 0,
                lastVersion: undefined
            },
            loadedSettings = JSON.parse(localStorage.getItem(_SETTINGS_STORE_NAME));
        _settings = $extend(true, {}, defaultSettings, loadedSettings);
        const serverSettings = await WazeWrap.Remote.RetrieveSettings(_SETTINGS_STORE_NAME);
        if (serverSettings?.lastSaved > _settings.lastSaved)
            _settings = $extend(true, _settings, serverSettings);
        if (_settings.disableBelowZoom < 11)
            _settings.disableBelowZoom += 12;
        _timeouts.saveSettingsToStorage = window.setTimeout(saveSettingsToStorage, 5000);

        return Promise.resolve();
    }

    function saveSettingsToStorage() {
        checkTimeout({ timeout: 'saveSettingsToStorage' });
        if (localStorage) {
            ['toggleHNNavPointsShortcut', 'toggleHNNavPointsNumbersShortcut'].forEach((k) => {
                let keys = '';
                const { shortcut } = W.accelerators.Actions[k];
                if (shortcut) {
                    if (shortcut.altKey)
                        keys += 'A';
                    if (shortcut.shiftKey)
                        keys += 'S';
                    if (shortcut.ctrlKey)
                        keys += 'C';
                    if (keys !== '')
                        keys += '+';
                    if (shortcut.keyCode)
                        keys += shortcut.keyCode;
                }
                _settings[k] = keys;
            });
            _settings.lastVersion = _SCRIPT_VERSION;
            _settings.lastSaved = Date.now();
            localStorage.setItem(_SETTINGS_STORE_NAME, JSON.stringify(_settings));
            WazeWrap.Remote.SaveSettings(_SETTINGS_STORE_NAME, _settings);
            logDebug('Settings saved.');
        }
    }
    function showScriptInfoAlert() {
        if (_ALERT_UPDATE && (_SCRIPT_VERSION !== _settings.lastVersion)) {
            const divElemRoot = createElem('div');
            divElemRoot.appendChild(createElem('p', { textContent: 'What\'s New:' }));
            const ulElem = createElem('ul');
            if (_SCRIPT_VERSION_CHANGES.length > 0) {
                for (let idx = 0, { length } = _SCRIPT_VERSION_CHANGES; idx < length; idx++)
                    ulElem.appendChild(createElem('li', { innerHTML: _SCRIPT_VERSION_CHANGES[idx] }));
            }
            else {
                ulElem.appendChild(createElem('li', { textContent: 'Nothing major.' }));
            }
            divElemRoot.appendChild(ulElem);
            WazeWrap.Interface.ShowScriptUpdate(_SCRIPT_SHORT_NAME, _SCRIPT_VERSION, divElemRoot.innerHTML, (_IS_BETA_VERSION ? dec(_BETA_DL_URL) : _PROD_DL_URL).replace(/code\/.*\.js/, ''), _FORUM_URL);
        }
    }

    function checkTimeout(obj) {
        if (obj.toIndex) {
            if (_timeouts[obj.timeout]?.[obj.toIndex]) {
                window.clearTimeout(_timeouts[obj.timeout][obj.toIndex]);
                delete (_timeouts[obj.timeout][obj.toIndex]);
            }
        }
        else {
            if (_timeouts[obj.timeout])
                window.clearTimeout(_timeouts[obj.timeout]);
            _timeouts[obj.timeout] = undefined;
        }
    }

    function doSpinner(spinnerName = '', spin = true) {
        const btn = document.getElementById('hnNPSpinner');
        if (!spin) {
            _spinners[spinnerName] = false;
            if (!Object.values(_spinners).some((a) => a === true)) {
                if (btn) {
                    btn.classList.remove('fa-spin');
                    document.getElementById('divHnNPSpinner').style.display = 'none';
                }
                else {
                    const topBar = document.querySelector('#topbar-container .topbar'),
                        divElem = createElem('div', {
                            id: 'divHnNPSpinner', title: 'WME HN NavPoints is currently processing house numbers.', style: 'font-size:20px;background:white;float:left;display:none;'
                        });
                    divElem.appendChild(createElem('i', { id: 'hnNPSpinner', class: 'fa fa-spinner' }));
                    topBar.insertBefore(divElem, topBar.firstChild);
                }
            }
        }
        else {
            _spinners[spinnerName] = true;
            if (!btn) {
                _spinners[spinnerName] = true;
                const topBar = document.querySelector('#topbar-container .topbar'),
                    divElem = createElem('div', {
                        id: 'divHnNPSpinner', title: 'WME HN NavPoints is currently processing house numbers.', style: 'font-size:20px;background:white;float:left;'
                    });
                divElem.appendChild(createElem('i', { id: 'hnNPSpinner', class: 'fa fa-spinner fa-spin' }));
                topBar.insertBefore(divElem, topBar.firstChild);
            }
            else if (!btn.classList.contains('fa-spin')) {
                btn.classList.add('fa-spin');
                document.getElementById('divHnNPSpinner').style.display = '';
            }
        }
    }

    // eslint-disable-next-line default-param-last
    function processSegmentsToRemove(force = false, segmentsArr) {
        const segmentsToProcess = segmentsArr || _segmentsToRemove;
        if (segmentsToProcess.length > 0) {
            let linesToRemove = [],
                hnsToRemove = [];
            const filterMarkers = function (marker) { return marker?.segmentId === this; },
                processFilterMarkers = (marker) => hnsToRemove.push(marker);
            for (let i = segmentsToProcess.length - 1; i > -1; i--) {
                const segId = segmentsToProcess[i];
                if (!W.model.segments.getObjectById(segId) || force) {
                    segmentsToProcess.splice(i, 1);
                    linesToRemove = linesToRemove.concat(_HNNavPointsLayer.getFeaturesByAttribute('segmentId', segId));
                    if (!_settings.enableTooltip)
                        hnsToRemove = hnsToRemove.concat(_HNNavPointsNumbersLayer.getFeaturesByAttribute('segmentId', segId));
                    else
                        _HNNavPointsNumbersLayer.markers.filter(filterMarkers.bind(segId)).forEach(processFilterMarkers);
                }
            }
            if (linesToRemove.length > 0)
                _HNNavPointsLayer.removeFeatures(linesToRemove);
            if (hnsToRemove.length > 0) {
                if (!_settings.enableTooltip)
                    _HNNavPointsNumbersLayer.removeFeatures(hnsToRemove);
                else
                    hnsToRemove.forEach((marker) => _HNNavPointsNumbersLayer.removeMarker(marker));
            }
        }
    }

    async function hnLayerToggled(checked) {
        _HNNavPointsLayer.setVisibility(checked);
        _settings.hnLines = checked;
        saveSettingsToStorage();
        if (checked) {
            if (!_scriptActive)
                await initBackgroundTasks('enable');
            processSegs('hnLayerToggled', W.model.segments.getObjectArray().filter((o) => o.getAttribute('hasHNs')));
        }
        else if (!_settings.hnNumbers && _scriptActive) {
            initBackgroundTasks('disable');
        }
    }

    async function hnNumbersLayerToggled(checked) {
        _HNNavPointsNumbersLayer.setVisibility(checked);
        _settings.hnNumbers = checked;
        saveSettingsToStorage();
        if (checked) {
            if (!_scriptActive)
                await initBackgroundTasks('enable');
            processSegs('hnNumbersLayerToggled', W.model.segments.getObjectArray().filter((o) => o.getAttribute('hasHNs')));
        }
        else if (!_settings.hnLines && _scriptActive) {
            initBackgroundTasks('disable');
        }
    }

    function observeHNLayer() {
        if (W.editingMediator.get('editingHouseNumbers')) {
            _segmentsToProcess = W.selectionManager.getSegmentSelection().segments.map((o) => o.getID());
            _segmentsToRemove = [];
        }
        else {
            W.model.segmentHouseNumbers.clear();
            processSegmentsToRemove(true, [..._segmentsToProcess]);
            processSegs('exithousenumbers', W.model.segments.getByIds([..._segmentsToProcess]), true);
            _segmentsToProcess = [];
            _segmentsToRemove = [];
            _timeouts.checkMarkersEvents = {};
        }
        _saveButtonObserver.disconnect();
        _saveButtonObserver.observe(document.getElementById('save-button'), {
            childList: false, attributes: true, attributeOldValue: true, characterData: false, characterDataOldValue: false, subtree: false
        });
    }

    function removeHNs(objArr) {
        let linesToRemove = [],
            hnsToRemove = [];
        const filterMarkers = function (marker) { return marker?.featureId === this.attributes.id; },
            processFilterMarkers = (marker) => {
                hnsToRemove.push(marker);
            };
        objArr.forEach((hnObj) => {
            linesToRemove = linesToRemove.concat(_HNNavPointsLayer.getFeaturesByAttribute('featureId', hnObj.getID()));
            if (!_settings.enableTooltip)
                hnsToRemove = hnsToRemove.concat(_HNNavPointsNumbersLayer.getFeaturesByAttribute('featureId', hnObj.getID()));
            else
                _HNNavPointsNumbersLayer.markers.filter(filterMarkers.bind(hnObj)).forEach(processFilterMarkers);
        });
        if (linesToRemove.length > 0)
            _HNNavPointsLayer.removeFeatures(linesToRemove);
        if (hnsToRemove.length > 0) {
            if (!_settings.enableTooltip)
                _HNNavPointsNumbersLayer.removeFeatures(hnsToRemove);
            else
                hnsToRemove.forEach((marker) => _HNNavPointsNumbersLayer.removeMarker(marker));
        }
    }

    function drawHNs(houseNumberArr) {
        if (houseNumberArr.length === 0)
            return;
        doSpinner('drawHNs', true);
        let svg,
            svgText,
            hnsToRemove = [],
            linesToRemove = [];
        const lineFeatures = [],
            numberFeatures = [],
            invokeTooltip = _settings.enableTooltip ? (evt) => { showTooltip(evt); } : undefined,
            mapFeatureId = (marker) => marker.featureId;
        if (_settings.enableTooltip) {
            svg = createElem('svg', { xlink: 'http://www.w3.org/1999/xlink', xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 40 14' });
            svgText = createElem('svgText', { 'text-anchor': 'middle', x: '20', y: '10' });
        }
        for (let i = 0, { length } = houseNumberArr; i < length; i++) {
            const hnObj = houseNumberArr[i],
                segmentId = hnObj.getSegmentId();
            if (W.model.segments.getObjectById(segmentId)) {
                const featureId = hnObj.getID(),
                    markerIdx = _settings.enableTooltip ? _HNNavPointsNumbersLayer.markers.map(mapFeatureId).indexOf(featureId) : undefined,
                    // eslint-disable-next-line no-nested-ternary
                    hnToRemove = _settings.enableTooltip ? (markerIdx > -1) ? _HNNavPointsNumbersLayer.markers[markerIdx] : [] : _HNNavPointsNumbersLayer.getFeaturesByAttribute('featureId', featureId),
                    rtlChar = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/mg,
                    textDir = (hnObj.getNumber().match(rtlChar) !== null) ? 'rtl' : 'ltr';
                linesToRemove = linesToRemove.concat(_HNNavPointsLayer.getFeaturesByAttribute('featureId', featureId));
                if (hnToRemove.length > 0) {
                    if (!_settings.enableTooltip)
                        hnsToRemove = hnsToRemove.concat(_HNNavPointsNumbersLayer.getFeaturesByAttribute('featureId', featureId));
                    else
                        hnsToRemove.push(hnToRemove);
                }
                //Fix this mess once WME beta v2.188 is released to production.
                const betaFractionPoint = (hnObj.getFractionPoint().coordinates)
                        ? WazeWrap.Geometry.ConvertTo900913(hnObj.getFractionPoint().coordinates[0], hnObj.getFractionPoint().coordinates[1])
                        : undefined,
                    fractionX = betaFractionPoint ? betaFractionPoint.lon : hnObj.getFractionPoint().x,
                    fractionY = betaFractionPoint ? betaFractionPoint.lat : hnObj.getFractionPoint().y,
                    geometryX = hnObj.getOLGeometry ? hnObj.getOLGeometry().x : hnObj.getGeometry().x,
                    geometryY = hnObj.getOLGeometry ? hnObj.getOLGeometry().y : hnObj.getGeometry().y,
                    p1 = new OpenLayers.Geometry.Point(fractionX, fractionY),
                    p2 = new OpenLayers.Geometry.Point(geometryX, geometryY),
                    // eslint-disable-next-line no-nested-ternary
                    strokeColor = (hnObj.isForced()
                        ? (!hnObj.getUpdatedBy()) ? 'red' : 'orange'
                        : (!hnObj.getUpdatedBy()) ? 'yellow' : 'white'
                    );
                let lineString = new OpenLayers.Geometry.LineString([p1, p2]),
                    lineFeature = new OpenLayers.Feature.Vector(
                        lineString,
                        { segmentId, featureId },
                        {
                            strokeWidth: 4, strokeColor: 'black', strokeOpacity: 0.5, strokeDashstyle: 'dash', strokeDashArray: '8, 8'
                        }
                    );
                lineFeatures.push(lineFeature);
                lineString = new OpenLayers.Geometry.LineString([p1, p2]);
                lineFeature = new OpenLayers.Feature.Vector(
                    lineString,
                    { segmentId, featureId },
                    {
                        strokeWidth: 2, strokeColor, strokeOpacity: 1, strokeDashstyle: 'dash', strokeDashArray: '8, 8'
                    }
                );
                lineFeatures.push(lineFeature);
                if (_settings.enableTooltip) {
                    svg.setAttribute('style', `text-shadow:0 0 3px ${strokeColor},0 0 3px ${strokeColor},0 0 3px ${strokeColor},0 0 3px ${strokeColor},0 0 3px ${strokeColor},0 0 3px ${strokeColor};font-size:14px;font-weight:bold;font-family:"Open Sans", "Arial Unicode MS", "sans-serif";direction:${textDir}`);
                    svgText.textContent = hnObj.getNumber();
                    svg.replaceChildren(svgText);
                    const svgIcon = new WazeWrap.Require.Icon(`data:image/svg+xml,${svg.outerHTML}`, { w: 40, h: 18 }),
                        markerFeature = new OpenLayers.Marker(new OpenLayers.LonLat(p2.x, p2.y), svgIcon);
                    markerFeature.events.register('mouseover', null, invokeTooltip);
                    markerFeature.events.register('mouseout', null, hideTooltipDelay);
                    markerFeature.featureId = featureId;
                    markerFeature.segmentId = segmentId;
                    markerFeature.hnNumber = hnObj.getNumber() || '';
                    numberFeatures.push(markerFeature);
                }
                else {
                // eslint-disable-next-line new-cap
                    numberFeatures.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon.createRegularPolygon(p2, 1, 20), {
                        segmentId, featureId, hNumber: hnObj.getNumber(), strokeWidth: 3, Color: strokeColor, textDir
                    }));
                }
            }
        }
        if (linesToRemove.length > 0)
            _HNNavPointsLayer.removeFeatures(linesToRemove);
        if (hnsToRemove.length > 0) {
            if (!_settings.enableTooltip)
                _HNNavPointsNumbersLayer.removeFeatures(hnsToRemove);
            else
                hnsToRemove.forEach((marker) => _HNNavPointsNumbersLayer.removeMarker(marker));
        }
        if (lineFeatures.length > 0)
            _HNNavPointsLayer.addFeatures(lineFeatures);
        if (numberFeatures.length > 0) {
            if (!_settings.enableTooltip)
                _HNNavPointsNumbersLayer.addFeatures(numberFeatures);
            else
                numberFeatures.forEach((marker) => _HNNavPointsNumbersLayer.addMarker(marker));
        }
        doSpinner('drawHNs', false);
    }

    function destroyAllHNs() {
        doSpinner('destroyAllHNs', true);
        _HNNavPointsLayer.destroyFeatures();
        if (_settings.enableTooltip)
            _HNNavPointsNumbersLayer.clearMarkers();
        else
            _HNNavPointsNumbersLayer.destroyFeatures();
        _processedSegments = [];
        doSpinner('destroyAllHNs', false);
        Promise.resolve();
    }

    function getOLMapExtent() {
        let extent = W.map.getExtent();
        if (Array.isArray(extent)) {
            extent = new OpenLayers.Bounds(extent);
            extent.transform('EPSG:4326', 'EPSG:3857');
        }
        return extent;
    }

    function processSegs(action, arrSegObjs, processAll = false, retry = 0) {
    /* As of 2020.06.08 (sometime before this date) updatedOn does not get updated when updating house numbers. Looking for a new
     * way to track which segments have been updated most recently to prevent a total refresh of HNs after an event.
     * Changed to using a global to keep track of segmentIds touched during HN edit mode.
     */
        if ((action === 'settingChanged') && (W.map.getOLMap().getZoom() < _settings.disableBelowZoom)) {
            destroyAllHNs();
            return;
        }
        if (!arrSegObjs || (arrSegObjs.length === 0) || (W.map.getOLMap().getZoom() < _settings.disableBelowZoom) || preventProcess())
            return;
        doSpinner('processSegs', true);
        const eg = getOLMapExtent().toGeometry(),
            findObjIndex = (array, fldName, value) => array.map((a) => a[fldName]).indexOf(value),
            processError = (err, chunk) => {
                logDebug(`Retry: ${retry}`);
                if (retry < 5)
                    processSegs(action, chunk, true, ++retry);
                else
                    logError(`Get HNs for ${chunk.length} segments failed. Code: ${err.status} - Text: ${err.responseText}`);
            },
            processJSON = (jsonData) => {
                if ((jsonData?.error === undefined) && (typeof jsonData?.segmentHouseNumbers?.objects !== 'undefined'))
                    drawHNs(jsonData.segmentHouseNumbers.objects);
            },
            mapHouseNumbers = (segObj) => segObj.getID(),
            invokeProcessError = function (err) { return processError(err, this); };
        if ((action === 'objectsremoved')) {
            if (arrSegObjs?.length > 0) {
                const removedSegIds = [];
                let hnNavPointsToRemove = [],
                    hnNavPointsNumbersToRemove = [];
                arrSegObjs.forEach((segObj) => {
                    const segmentId = segObj.getID();
                    if (!eg.intersects(segObj.getAttribute('geometry')) && (segmentId > 0)) {
                        hnNavPointsToRemove = hnNavPointsToRemove.concat(_HNNavPointsLayer.getFeaturesByAttribute('segmentId', segmentId));
                        if (!_settings.enableTooltip)
                            hnNavPointsNumbersToRemove = hnNavPointsNumbersToRemove.concat(_HNNavPointsNumbersLayer.getFeaturesByAttribute('segmentId', segmentId));
                        else
                            removedSegIds.push(segmentId);
                        const segIdx = findObjIndex(_processedSegments, 'segId', segmentId);
                        if (segIdx > -1)
                            _processedSegments.splice(segIdx, 1);
                    }
                });
                if (hnNavPointsToRemove.length > 0)
                    _HNNavPointsLayer.removeFeatures(hnNavPointsToRemove);
                if (hnNavPointsNumbersToRemove.length > 0)
                    _HNNavPointsNumbersLayer.removeFeatures(hnNavPointsNumbersToRemove);
                if (removedSegIds.length > 0) {
                    _HNNavPointsNumbersLayer.markers.filter((marker) => removedSegIds.includes(marker.segmentId)).forEach((marker) => {
                        _HNNavPointsNumbersLayer.removeMarker(marker);
                    });
                }
            }
        }
        else { // action = 'objectsadded', 'zoomend', 'init', 'exithousenumbers', 'hnLayerToggled', 'hnNumbersLayerToggled', 'settingChanged', 'afterSave', 'afterclearactions'
            let i = arrSegObjs.length;
            while (i--) {
                if (arrSegObjs[i].getID() < 0) {
                    arrSegObjs.splice(i, 1);
                }
                else {
                    const segIdx = findObjIndex(_processedSegments, 'segId', arrSegObjs[i].getID());
                    if (segIdx > -1) {
                        if (arrSegObjs[i].getUpdatedOn() > _processedSegments[segIdx].updatedOn)
                            _processedSegments[segIdx].updatedOn = arrSegObjs[i].getUpdatedOn();
                        else if (!processAll)
                            arrSegObjs.splice(i, 1);
                    }
                    else {
                        _processedSegments.push({ segId: arrSegObjs[i].getID(), updatedOn: arrSegObjs[i].getUpdatedOn() });
                    }
                }
            }
            while (arrSegObjs.length > 0) {
                let chunk;
                if (retry === 1)
                    chunk = arrSegObjs.splice(0, 250);
                else if (retry === 2)
                    chunk = arrSegObjs.splice(0, 125);
                else if (retry === 3)
                    chunk = arrSegObjs.splice(0, 100);
                else if (retry === 4)
                    chunk = arrSegObjs.splice(0, 50);
                else
                    chunk = arrSegObjs.splice(0, 500);
                try {
                    W.controller.descartesClient.getHouseNumbers(chunk.map(mapHouseNumbers)).then(processJSON).catch(invokeProcessError.bind(chunk));
                }
                catch (error) {
                    processError(error, [...chunk]);
                }
            }
        }
        doSpinner('processSegs', false);
    }

    function preventProcess() {
        if (!_settings.hnLines && !_settings.hnNumbers) {
            if (_scriptActive)
                initBackgroundTasks('disable');
            destroyAllHNs();
            return true;
        }
        if (W.map.getOLMap().getZoom() < _settings.disableBelowZoom) {
            destroyAllHNs();
            return true;
        }
        return false;
    }

    function segmentsEvent(evt) {
        if (!evt || preventProcess())
            return;
        if ((this.action === 'objectssynced') || (this.action === 'objectsremoved'))
            processSegmentsToRemove();
        if (this.action === 'objectschanged-id') {
            const oldSegmentId = evt.oldID,
                newSegmentID = evt.newID;
            _HNNavPointsLayer.getFeaturesByAttribute('segmentId', oldSegmentId).forEach((feature) => { feature.attributes.segmentId = newSegmentID; });
            if (_settings.enableTooltip)
                _HNNavPointsNumbersLayer.markers.filter((marker) => marker.segmentId === oldSegmentId).forEach((marker) => { marker.segmentId = newSegmentID; });
            else
                _HNNavPointsNumbersLayer.getFeaturesByAttribute('segmentId', oldSegmentId).forEach((feature) => { feature.attributes.segmentId = newSegmentID; });
        }
        else if (this.action === 'objects-state-deleted') {
            evt.forEach((obj) => {
                if (!_segmentsToRemove.includes(obj.getID()))
                    _segmentsToRemove.push(obj.getID());
            });
        }
        else {
            processSegs(this.action, evt.filter((o) => o.getAttribute('hasHNs')));
        }
    }

    function objectsChangedIdHNs(evt) {
        if (!evt || preventProcess())
            return;
        const oldFeatureId = evt.oldID,
            newFeatureId = evt.newID;
        _HNNavPointsLayer.getFeaturesByAttribute('featureId', oldFeatureId).forEach((feature) => { feature.attributes.featureId = newFeatureId; });
        if (_settings.enableTooltip)
            _HNNavPointsNumbersLayer.markers.filter((marker) => marker.featureId === oldFeatureId).forEach((marker) => { marker.featureId = newFeatureId; });
        else
            _HNNavPointsNumbersLayer.getFeaturesByAttribute('featureId', oldFeatureId).forEach((feature) => { feature.attributes.featureId = newFeatureId; });
    }

    function objectsChangedHNs(evt) {
        if (!evt || preventProcess())
            return;
        if ((evt.length === 1) && evt[0].getSegmentId() && !_segmentsToProcess.includes(evt[0].getSegmentId()))
            _segmentsToProcess.push(evt[0].getSegmentId());
    }

    function objectsStateDeletedHNs(evt) {
        if (!evt || preventProcess())
            return;
        if ((evt.length === 1) && evt[0].getSegmentId() && !_segmentsToProcess.includes(evt[0].getSegmentId()))
            _segmentsToProcess.push(evt[0].getSegmentId());
        removeHNs(evt);
    }

    function objectsAddedHNs(evt) {
        if (!evt || preventProcess())
            return;
        if ((evt.length === 1) && evt[0].getSegmentId() && !_segmentsToProcess.includes(evt[0].getSegmentId()))
            _segmentsToProcess.push(evt[0].getSegmentId());
    }

    function zoomEndEvent() {
        if (preventProcess())
            return;
        if ((W.map.getOLMap().getZoom() < _settings.disableBelowZoom))
            destroyAllHNs();
        if ((W.map.getOLMap().getZoom() > (_settings.disableBelowZoom - 1)) && (_processedSegments.length === 0))
            processSegs('zoomend', W.model.segments.getObjectArray().filter((o) => o.getAttribute('hasHNs')), true);
    }

    function afterActionsEvent(evt) {
        if (!evt || preventProcess())
            return;
        if ((evt.type === 'afterclearactions') || (evt.type === 'noActions')) {
            processSegmentsToRemove(true, [..._segmentsToProcess]);
            processSegs('afterclearactions', W.model.segments.getByIds([..._segmentsToProcess]), true);
        }
        else if (evt.action?._description?.includes('Deleted house number')) {
            if (evt.type === 'afterundoaction')
                drawHNs([evt.action.object]);
            else
                removeHNs([evt.action.object]);
        }
        else if (evt.action?._description?.includes('Updated house number')) {
            const tempEvt = _.cloneDeep(evt);
            if (evt.type === 'afterundoaction') {
                if (tempEvt.action.newAttributes?.number)
                    tempEvt.action.attributes.number = tempEvt.action.newAttributes.number;
            }
            else if (evt.type === 'afteraction') {
                if (tempEvt.action.oldAttributes?.number)
                    tempEvt.action.attributes.number = tempEvt.action.oldAttributes.number;
            }
            removeHNs([tempEvt.action.object]);
            drawHNs([evt.action.object]);
        }
        else if (evt.action?._description?.includes('Added house number')) {
            if (evt.type === 'afterundoaction')
                removeHNs([evt.action.houseNumber]);
            else
                drawHNs([evt.action.houseNumber]);
        }
        else if (evt.action?._description?.includes('Moved house number')) {
            drawHNs([evt.action.newHouseNumber]);
        }
        else if (evt.action?.houseNumber) {
            drawHNs((evt.action.newHouseNumber ? [evt.action.newHouseNumber] : [evt.action.houseNumber]));
        }
    }

    async function reloadClicked() {
        if (preventProcess() || document.querySelector('wz-button.overlay-button.reload-button').classList.contains('disabled'))
            return;
        await destroyAllHNs();
        processSegs('reload', W.model.segments.getObjectArray().filter((o) => o.getAttribute('hasHNs')));
    }

    function initBackgroundTasks(status) {
        if (status === 'enable') {
            _saveButtonObserver = new MutationObserver((mutationsList) => {
                if ((W.model.actionManager._redoStack.length === 0)
                    && mutationsList.some((mutation) => ((mutation.attributeName === 'disabled')
                            && (mutation.oldValue === 'true')
                            && (mutation.target.disabled === true)))
                ) {
                    if (W.editingMediator.get('editingHouseNumbers'))
                        processSegs('afterSave', W.model.segments.getByIds([..._segmentsToProcess]), true);
                    else
                        processSegmentsToRemove();
                }
            });
            _saveButtonObserver.observe(document.getElementById('save-button'), {
                childList: false, attributes: true, attributeOldValue: true, characterData: false, characterDataOldValue: false, subtree: false
            });
            _saveButtonObserver.observing = true;
            W.accelerators.events.on({ reloadData: destroyAllHNs });
            document.querySelector('wz-button.overlay-button.reload-button').addEventListener('click', reloadClicked);
            W.model.segments.on('objectsadded', segmentsEvent, { action: 'objectsadded' });
            W.model.segments.on('objectsremoved', segmentsEvent, { action: 'objectsremoved' });
            W.model.segments.on('objectssynced', segmentsEvent, { action: 'objectssynced' });
            W.model.segments.on('objects-state-deleted', segmentsEvent, { action: 'objects-state-deleted' });
            W.model.segments.on('objectschanged-id', segmentsEvent, { action: 'objectschanged-id' });
            W.model.segmentHouseNumbers.on({
                objectsadded: objectsAddedHNs,
                objectschanged: objectsChangedHNs,
                'objectschanged-id': objectsChangedIdHNs,
                'objects-state-deleted': objectsStateDeletedHNs
            });
            W.editingMediator.on({ 'change:editingHouseNumbers': observeHNLayer });
            W.map.events.on({
                zoomend: zoomEndEvent, addlayer: checkLayerIndex, removelayer: checkLayerIndex
            });
            WazeWrap.Events.register('afterundoaction', this, afterActionsEvent);
            WazeWrap.Events.register('afteraction', this, afterActionsEvent);
            WazeWrap.Events.register('afterclearactions', this, afterActionsEvent);
            _scriptActive = true;
        }
        else if (status === 'disable') {
            _saveButtonObserver = undefined;
            W.accelerators.events.on('reloadData', null, destroyAllHNs);
            document.querySelector('wz-button.overlay-button.reload-button').removeEventListener('click', reloadClicked);
            W.model.segments.off('objectsadded', segmentsEvent, { action: 'objectsadded' });
            W.model.segments.off('objectsremoved', segmentsEvent, { action: 'objectsremoved' });
            W.model.segments.off('objectschanged', segmentsEvent, { action: 'objectschanged' });
            W.model.segments.off('objects-state-deleted', segmentsEvent, { action: 'objects-state-deleted' });
            W.model.segments.off('objectschanged-id', segmentsEvent, { action: 'objectschanged-id' });
            W.model.segmentHouseNumbers.off({
                objectsadded: objectsAddedHNs,
                objectschanged: objectsChangedHNs,
                'objectschanged-id': objectsChangedIdHNs,
                'objects-state-deleted': objectsStateDeletedHNs,
                objectsremoved: removeHNs
            });
            W.editingMediator.off({ 'change:editingHouseNumbers': observeHNLayer });
            W.map.events.unregister('zoomend', null, zoomEndEvent);
            W.map.events.unregister('addlayer', null, checkLayerIndex);
            W.map.events.unregister('removelayer', null, checkLayerIndex);
            WazeWrap.Events.unregister('afterundoaction', this, afterActionsEvent);
            WazeWrap.Events.unregister('afteraction', this, afterActionsEvent);
            _scriptActive = false;
        }
        return Promise.resolve();
    }

    function enterHNEditMode(segment, moveMap) {
        if (segment) {
            if (moveMap)
                W.map.setCenter({ lon: segment.getCenter().x, lat: segment.getCenter().y }, W.map.getOLMap().getZoom());
            W.selectionManager.setSelectedModels(segment);
            document.querySelector('#segment-edit-general .edit-house-numbers').dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
    }

    function showTooltip(evt) {
        if ((W.map.getOLMap().getZoom() < 16) || W.editingMediator.get('editingHouseNumbers') || !_settings.enableTooltip)
            return;
        if (evt?.object?.featureId) {
            checkTooltip();
            let moveMap = false;
            const { segmentId, hnNumber } = evt.object;
            if (_popup.inUse && (_popup.hnNumber === hnNumber) && (_popup.segmentId === segmentId))
                return;
            const segment = W.model.segments.getObjectById(segmentId),
                street = W.model.streets.getObjectById(segment.getPrimaryStreetID()),
                popupPixel = W.map.getPixelFromLonLat(evt.object.lonlat),
                divElemRoot = createElem('div', {
                    id: 'hnNavPointsTooltipDiv-tooltip',
                    class: 'tippy-box',
                    'data-state': 'hidden',
                    tabindex: '-1',
                    'data-theme': 'light-border',
                    'data-animation': 'fade',
                    role: 'tooltip',
                    'data-placement': 'top',
                    style: 'max-width: 350px; transition-duration:300ms;'
                }),
                invokeEnterHNEditMode = () => enterHNEditMode(segment, moveMap),
                divElemRootDivDiv = createElem('div', { class: 'house-number-marker-tooltip' });
            divElemRootDivDiv.appendChild(createElem('div', { class: 'title', dir: 'auto', textContent: `${hnNumber} ${(street ? street.getName() : '')}` }));
            divElemRootDivDiv.appendChild(createElem('div', {
                id: 'hnNavPointsTooltipDiv-edit', class: 'edit-button fa fa-pencil', style: segment.canEditHouseNumbers() ? '' : 'display:none;'
            }, [{ click: invokeEnterHNEditMode }]));
            const divElemRootDiv = createElem('div', {
                id: 'hnNavPointsTooltipDiv-content', class: 'tippy-content', 'data-state': 'hidden', style: 'transition-duration: 300ms;'
            });
            divElemRootDiv.appendChild(divElemRootDivDiv);
            divElemRoot.appendChild(divElemRootDiv);
            divElemRoot.appendChild(createElem('div', {
                id: 'hnNavPointsTooltipDiv-arrow', class: 'tippy-arrow', style: 'position: absolute; left: 0px;'
            }));
            _hnNavPointsTooltipDiv.replaceChildren(divElemRoot);
            popupPixel.origX = popupPixel.x;
            const popupWidthHalf = (_hnNavPointsTooltipDiv.clientWidth / 2);
            let arrowOffset = (popupWidthHalf - 15),
                dataPlacement = 'top';
            popupPixel.x = ((popupPixel.x - popupWidthHalf + 5) > 0) ? (popupPixel.x - popupWidthHalf + 5) : 10;
            if (popupPixel.x === 10)
                arrowOffset = popupPixel.origX - 22;
            if ((popupPixel.x + (popupWidthHalf * 2)) > W.map.getEl()[0].clientWidth) {
                popupPixel.x = (popupPixel.origX - _hnNavPointsTooltipDiv.clientWidth + 8);
                arrowOffset = (_hnNavPointsTooltipDiv.clientWidth - 30);
                moveMap = true;
            }
            if (popupPixel.y - [..._hnNavPointsTooltipDiv.children].reduce((height, elem) => height + elem.getBoundingClientRect().height, 0) < 0) {
                popupPixel.y += 14;
                dataPlacement = 'bottom';
            }
            else {
                popupPixel.y -= ([..._hnNavPointsTooltipDiv.children].reduce((height, elem) => height + elem.getBoundingClientRect().height, 0) + 14);
            }
            _hnNavPointsTooltipDiv.style.transform = `translate(${Math.round(popupPixel.x)}px, ${Math.round(popupPixel.y)}px)`;
            _hnNavPointsTooltipDiv.querySelector('#hnNavPointsTooltipDiv-arrow').style.transform = `translate(${Math.max(0, Math.round(arrowOffset))}px, 0px)`;
            _hnNavPointsTooltipDiv.querySelector('#hnNavPointsTooltipDiv-tooltip').setAttribute('data-placement', dataPlacement);
            _hnNavPointsTooltipDiv.querySelector('#hnNavPointsTooltipDiv-tooltip').setAttribute('data-state', 'visible');
            _hnNavPointsTooltipDiv.querySelector('#hnNavPointsTooltipDiv-content').setAttribute('data-state', 'visible');
            _popup = { segmentId, hNumber: hnNumber, inUse: true };
        }
    }

    function stripTooltipHTML() {
        checkTimeout({ timeout: 'stripTooltipHTML' });
        _hnNavPointsTooltipDiv.replaceChildren();
        _popup = { segmentId: -1, hnNumber: -1, inUse: false };
    }

    function hideTooltip() {
        checkTimeout({ timeout: 'hideTooltip' });
        _hnNavPointsTooltipDiv.querySelector('#hnNavPointsTooltipDiv-content')?.setAttribute('data-state', 'hidden');
        _hnNavPointsTooltipDiv.querySelector('#hnNavPointsTooltipDiv-tooltip')?.setAttribute('data-state', 'hidden');
        _timeouts.stripTooltipHTML = window.setTimeout(stripTooltipHTML, 400);
    }

    function hideTooltipDelay(evt) {
        if (!evt)
            return;
        checkTimeout({ timeout: 'hideTooltip' });
        const parentsArr = evt.toElement?.offsetParent ? [evt.toElement.offsetParent, evt.toElement.offsetParent.offSetParent] : [];
        if (evt.toElement && (parentsArr.includes(_HNNavPointsNumbersLayer?.div) || parentsArr.includes(_hnNavPointsTooltipDiv)))
            return;
        _timeouts.hideTooltip = window.setTimeout(hideTooltip, 100, evt);
    }

    function checkTooltip() {
        checkTimeout({ timeout: 'hideTooltip' });
    }

    function checkLayerIndex() {
        const layerIdx = W.map.layers.map((a) => a.uniqueName).indexOf('__HNNavPointsNumbersLayer');
        let properIdx;
        if (_settings.keepHNLayerOnTop) {
            const layersIndexes = [],
                layersLoaded = W.map.layers.map((a) => a.uniqueName);
            ['wmeGISLayersDefault', '__HNNavPointsLayer'].forEach((layerUniqueName) => {
                if (layersLoaded.indexOf(layerUniqueName) > 0)
                    layersIndexes.push(layersLoaded.indexOf(layerUniqueName));
            });
            properIdx = (Math.max(...layersIndexes) + 1);
        }
        else {
            properIdx = (W.map.layers.map((a) => a.uniqueName).indexOf('__HNNavPointsLayer') + 1);
        }
        if (layerIdx !== properIdx) {
            W.map.layers.splice(properIdx, 0, W.map.layers.splice(layerIdx, 1)[0]);
            W.map.getOLMap().resetLayersZIndex();
        }
    }

    function checkHnNavpointsVersion() {
        if (_IS_ALPHA_VERSION)
            return;
        let updateMonitor;
        try {
            updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(_SCRIPT_LONG_NAME, _SCRIPT_VERSION, (_IS_BETA_VERSION ? dec(_BETA_DL_URL) : _PROD_DL_URL), GM_xmlhttpRequest);
            updateMonitor.start();
        }
        catch (err) {
            logError('Upgrade version check:', err);
        }
    }

    async function onWazeWrapReady() {
        log('Initializing.');
        checkHnNavpointsVersion();
        const navPointsNumbersLayersOptions = {
                displayInLayerSwitcher: true,
                uniqueName: '__HNNavPointsNumbersLayer',
                selectable: true,
                labelSelect: true,
                rendererOptions: { zIndexing: true },
                styleMap: new OpenLayers.StyleMap({
                    default: new OpenLayers.Style({
                        strokeColor: '${Color}',
                        strokeOpacity: 1,
                        strokeWidth: 3,
                        fillColor: '${Color}',
                        fillOpacity: 0.5,
                        pointerEvents: 'visiblePainted',
                        label: '${hNumber}',
                        fontSize: '12px',
                        fontFamily: 'Rubik, Boing-light, sans-serif;',
                        fontWeight: 'bold',
                        direction: '${textDir}',
                        labelOutlineColor: '${Color}',
                        labelOutlineWidth: 3,
                        labelSelect: true
                    })
                })
            },
            handleCheckboxToggle = function () {
                const settingName = this.id.substring(14);
                if (settingName === 'enableTooltip') {
                    if (!this.checked)
                        _HNNavPointsNumbersLayer.clearMarkers();
                    else
                        _HNNavPointsNumbersLayer.destroyFeatures();
                    W.map.removeLayer(_HNNavPointsNumbersLayer);
                    if (this.checked)
                        _HNNavPointsNumbersLayer = new OpenLayers.Layer.Markers('HN NavPoints Numbers Layer', navPointsNumbersLayersOptions);
                    else
                        _HNNavPointsNumbersLayer = new OpenLayers.Layer.Vector('HN NavPoints Numbers Layer', navPointsNumbersLayersOptions);
                    W.map.addLayer(_HNNavPointsNumbersLayer);
                    _HNNavPointsNumbersLayer.setVisibility(_settings.hnNumbers);
                }
                _settings[settingName] = this.checked;
                if (settingName === 'keepHNLayerOnTop')
                    checkLayerIndex();
                saveSettingsToStorage();
                if ((settingName === 'enableTooltip') && (W.map.getOLMap().getZoom() > (_settings.disableBelowZoom - 1)) && (_settings.hnLines || _settings.hnNumbers))
                    processSegs('settingChanged', W.model.segments.getObjectArray().filter((o) => o.getAttribute('hasHNs')), true, 0);
            },
            handleTextboxChange = function () {
                const newVal = Math.min(22, Math.max(16, +this.value));
                if ((newVal !== _settings.disableBelowZoom) || (+this.value !== newVal)) {
                    if (newVal !== +this.value)
                        this.value = newVal;
                    _settings.disableBelowZoom = newVal;
                    saveSettingsToStorage();
                    if ((W.map.getOLMap().getZoom() < newVal) && (_settings.hnLines || _settings.hnNumbers))
                        processSegs('settingChanged', null, true, 0);
                    else if (_settings.hnLines || _settings.hnNumbers)
                        processSegs('settingChanged', W.model.segments.getObjectArray().filter((o) => o.getAttribute('hasHNs')), true, 0);
                }
            },
            buildCheckbox = (id = '', textContent = '', checked = true, title = '', disabled = false) => createElem('wz-checkbox', {
                id, title, disabled, checked, textContent
            }, [{ change: handleCheckboxToggle }]),
            buildTextBox = (id = '', label = '', value = '', placeholder = '', maxlength = 0, autocomplete = 'off', title = '', disabled = false) => createElem('wz-text-input', {
                id, label, value, placeholder, maxlength, autocomplete, title, disabled
            }, [{ change: handleTextboxChange }]),
            toggleHNNavPoints = () => document.getElementById('layer-switcher-item_hn_navpoints').dispatchEvent(new MouseEvent('click', { bubbles: true })),
            toggleHNNavPointsNumbers = () => document.getElementById('layer-switcher-item_hn_navpoints_numbers').dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await loadSettingsFromStorage();
        WazeWrap.Interface.AddLayerCheckbox('display', 'HN NavPoints', _settings.hnLines, hnLayerToggled);
        WazeWrap.Interface.AddLayerCheckbox('display', 'HN NavPoints Numbers', _settings.hnNumbers, hnNumbersLayerToggled);

        _HNNavPointsLayer = new OpenLayers.Layer.Vector('HN NavPoints Layer', {
            displayInLayerSwitcher: true,
            uniqueName: '__HNNavPointsLayer'
        });
        _HNNavPointsNumbersLayer = _settings.enableTooltip
            ? new OpenLayers.Layer.Markers('HN NavPoints Numbers Layer', navPointsNumbersLayersOptions)
            : new OpenLayers.Layer.Vector('HN NavPoints Numbers Layer', navPointsNumbersLayersOptions);
        W.map.addLayers([_HNNavPointsLayer, _HNNavPointsNumbersLayer]);
        _HNNavPointsLayer.setVisibility(_settings.hnLines);
        _HNNavPointsNumbersLayer.setVisibility(_settings.hnNumbers);
        window.addEventListener('beforeunload', saveSettingsToStorage, false);
        new WazeWrap.Interface.Shortcut(
            'toggleHNNavPointsShortcut',
            'Toggle HN NavPoints layer',
            'layers',
            'layersToggleHNNavPoints',
            _settings.toggleHNNavPointsShortcut,
            toggleHNNavPoints,
            null
        ).add();
        new WazeWrap.Interface.Shortcut(
            'toggleHNNavPointsNumbersShortcut',
            'Toggle HN NavPoints Numbers layer',
            'layers',
            'layersToggleHNNavPointsNumbers',
            _settings.toggleHNNavPointsNumbersShortcut,
            toggleHNNavPointsNumbers,
            null
        ).add();
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab('HN-NavPoints');
        tabLabel.appendChild(createElem('i', { class: 'w-icon w-icon-location', style: 'font-size:15px;padding-top:4px;' }));
        tabLabel.title = _SCRIPT_SHORT_NAME;
        const docFrags = document.createDocumentFragment();
        docFrags.appendChild(createElem('h4', { style: 'font-weight:bold;', textContent: _SCRIPT_LONG_NAME }));
        docFrags.appendChild(createElem('h6', { style: 'margin-top:0px;', textContent: _SCRIPT_VERSION }));
        let divElemRoot = createElem('div', { class: 'form-group' });
        divElemRoot.appendChild(buildTextBox(
            'HNNavPoints_disableBelowZoom',
            'Disable when zoom level is (<) less than:',
            _settings.disableBelowZoom,
            '',
            2,
            'off',
            'Disable NavPoints and house numbers when zoom level is less than specified number.\r\nMinimum: 16\r\nDefault: 17',
            false
        ));
        divElemRoot.appendChild(buildCheckbox(
            'HNNavPoints_cbenableTooltip',
            'Enable tooltip',
            _settings.enableTooltip,
            'Enable tooltip when mousing over house numbers.\r\nWarning: This may cause performance issues.',
            false
        ));
        divElemRoot.appendChild(buildCheckbox('HNNavPoints_cbkeepHNLayerOnTop', 'Keep HN layer on top', _settings.keepHNLayerOnTop, 'Keep house numbers layer on top of all other layers.', false));
        const formElem = createElem('form', { class: 'attributes-form side-panel-section' });
        formElem.appendChild(divElemRoot);
        docFrags.appendChild(formElem);
        docFrags.appendChild(createElem('label', { class: 'control-label', textContent: 'Color legend' }));
        divElemRoot = createElem('div', { style: 'margin:0 10px 0 10px; width:130px; text-align:center; font-size:12px; background:black; font-weight:600;' });
        divElemRoot.appendChild(createElem('div', {
            style: 'text-shadow:0 0 3px white,0 0 3px white,0 0 3px white,0 0 3px white,0 0 3px white,0 0 3px white,0 0 3px white,0 0 3px white,0 0 3px white,0 0 3px white;', textContent: 'Touched'
        }));
        divElemRoot.appendChild(createElem('div', {
            style: 'text-shadow:0 0 3px orange,0 0 3px orange,0 0 3px orange,0 0 3px orange,0 0 3px orange,0 0 3px orange,0 0 3px orange,0 0 3px orange,0 0 3px orange,0 0 3px orange;',
            textContent: 'Touched forced'
        }));
        divElemRoot.appendChild(createElem('div', {
            style: 'text-shadow:0 0 3px yellow,0 0 3px yellow,0 0 3px yellow, 0 0 3px yellow,0 0 3px yellow,0 0 3px yellow,0 0 3px yellow,0 0 3px yellow,0 0 3px yellow,0 0 3px yellow;',
            textContent: 'Untouched'
        }));
        divElemRoot.appendChild(createElem('div', {
            style: 'text-shadow:0 0 3px red,0 0 3px red,0 0 3px red,0 0 3px red,0 0 3px red,0 0 3px red,0 0 3px red,0 0 3px red,0 0 3px red,0 0 3px red;', textContent: 'Untouched forced'
        }));
        docFrags.appendChild(divElemRoot);
        tabPane.appendChild(docFrags);
        tabPane.id = 'sidepanel-hn-navpoints';
        await W.userscripts.waitForElementConnected(tabPane);
        if (!_hnNavPointsTooltipDiv) {
            _hnNavPointsTooltipDiv = createElem('div', {
                id: 'hnNavPointsTooltipDiv',
                style: 'z-index:9999; visibility:visible; position:absolute; inset: auto auto 0px 0px; margin: 0px; top: 0px; left: 0px;',
                'data-tippy-root': false
            }, [{ mouseenter: checkTooltip }, { mouseleave: hideTooltipDelay }]);
            W.map.getEl()[0].appendChild(_hnNavPointsTooltipDiv);
        }
        await initBackgroundTasks('enable');
        checkLayerIndex();
        log(`Fully initialized in ${Math.round(performance.now() - _LOAD_BEGIN_TIME)} ms.`);
        showScriptInfoAlert();
        if (_scriptActive)
            processSegs('init', W.model.segments.getObjectArray().filter((o) => o.getAttribute('hasHNs')));
        setTimeout(saveSettingsToStorage, 10000);
    }

    function onWmeReady(tries = 1) {
        if (typeof tries === 'object')
            tries = 1;
        checkTimeout({ timeout: 'onWmeReady' });
        if (WazeWrap?.Ready) {
            logDebug('WazeWrap is ready. Proceeding with initialization.');
            onWazeWrapReady();
        }
        else if (tries < 1000) {
            logDebug(`WazeWrap is not in Ready state. Retrying ${tries} of 1000.`);
            _timeouts.onWmeReady = window.setTimeout(onWmeReady, 200, ++tries);
        }
        else {
            logError(new Error('onWmeReady timed out waiting for WazeWrap Ready state.'));
        }
    }

    function onWmeInitialized() {
        if (W.userscripts?.state?.isReady) {
            logDebug('W is ready and already in "wme-ready" state. Proceeding with initialization.');
            onWmeReady(1);
        }
        else {
            logDebug('W is ready, but state is not "wme-ready". Adding event listener.');
            document.addEventListener('wme-ready', onWmeReady, { once: true });
        }
    }

    function bootstrap() {
        if (!W) {
            logDebug('W is not available. Adding event listener.');
            document.addEventListener('wme-initialized', onWmeInitialized, { once: true });
        }
        else {
            onWmeInitialized();
        }
    }

    bootstrap();
}
)();
