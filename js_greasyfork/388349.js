// ==UserScript==
// @name        WME Straighten Up!
// @namespace   https://greasyfork.org/users/166843
// @version     2024.01.31.01
// @description Straighten selected WME segment(s) by aligning along straight line between two end points and removing geometry nodes.
// @author      dBsooner
// @match       http*://*.waze.com/*editor*
// @exclude     http*://*.waze.com/user/editor*
// @require     https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant       GM_xmlhttpRequest
// @connect     greasyfork.org
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/388349/WME%20Straighten%20Up%21.user.js
// @updateURL https://update.greasyfork.org/scripts/388349/WME%20Straighten%20Up%21.meta.js
// ==/UserScript==

// Original credit to jonny3D and impulse200

/* global I18n, GM_info, GM_xmlhttpRequest, W, WazeWrap */

(function () {
    'use strict';

    // eslint-disable-next-line no-nested-ternary
    const _SCRIPT_SHORT_NAME = `WME SU!${(/beta/.test(GM_info.script.name) ? ' β' : /\(DEV\)/i.test(GM_info.script.name) ? ' Ω' : '')}`,
        _SCRIPT_LONG_NAME = GM_info.script.name,
        _IS_ALPHA_VERSION = /[Ω]/.test(_SCRIPT_SHORT_NAME),
        _IS_BETA_VERSION = /[β]/.test(_SCRIPT_SHORT_NAME),
        // SCRIPT_AUTHOR = GM_info.script.author,
        _PROD_DL_URL = 'https://greasyfork.org/scripts/388349-wme-straighten-up/code/WME%20Straighten%20Up!.user.js',
        _FORUM_URL = 'https://www.waze.com/forum/viewtopic.php?f=819&t=289116',
        _SETTINGS_STORE_NAME = 'WMESU',
        _BETA_DL_URL = 'YUhSMGNITTZMeTluY21WaGMzbG1iM0pyTG05eVp5OXpZM0pwY0hSekx6TTRPRE0xTUMxM2JXVXRjM1J5WVdsbmFIUmxiaTExY0MxaVpYUmhMMk52WkdVdlYwMUZKVEl3VTNSeVlXbG5hSFJsYmlVeU1GVndJU1V5TUNoaVpYUmhLUzUxYzJWeUxtcHo=',
        _ALERT_UPDATE = true,
        _SCRIPT_VERSION = GM_info.script.version.toString(),
        _SCRIPT_VERSION_CHANGES = ['BUGFIX: Check for micro dog leg (mDL)'],
        _DEBUG = /[βΩ]/.test(_SCRIPT_SHORT_NAME),
        _LOAD_BEGIN_TIME = performance.now(),
        _elems = {
            b: document.createElement('b'),
            br: document.createElement('br'),
            div: document.createElement('div'),
            li: document.createElement('li'),
            ol: document.createElement('ol'),
            option: document.createElement('option'),
            p: document.createElement('p'),
            select: document.createElement('select'),
            'wz-button': document.createElement('wz-button'),
            'wz-card': document.createElement('wz-card')
        },
        _timeouts = { onWmeReady: undefined, saveSettingsToStorage: undefined };
    let _settings = {};

    function log(message, data = '') { console.log(`${_SCRIPT_SHORT_NAME}:`, message, data); }
    function logError(message, data = '') { console.error(`${_SCRIPT_SHORT_NAME}:`, new Error(message), data); }
    function logWarning(message, data = '') { console.warn(`${_SCRIPT_SHORT_NAME}:`, message, data); }
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

    function createTextNode(str = '') {
        return document.createTextNode(str);
    }

    function dec(s = '') {
        return atob(atob(s));
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

    async function loadSettingsFromStorage() {
        const defaultSettings = {
                conflictingNames: 'warning',
                longJnMove: 'warning',
                microDogLegs: 'warning',
                nonContinuousSelection: 'warning',
                sanityCheck: 'warning',
                runStraightenUpShortcut: '',
                lastSaved: 0,
                lastVersion: undefined
            },
            loadedSettings = JSON.parse(localStorage.getItem(_SETTINGS_STORE_NAME));
        _settings = $extend(true, {}, defaultSettings, loadedSettings);
        const serverSettings = await WazeWrap.Remote.RetrieveSettings(_SETTINGS_STORE_NAME);
        if (serverSettings?.lastSaved > _settings.lastSaved)
            $extend(_settings, serverSettings);
        _timeouts.saveSettingsToStorage = window.setTimeout(saveSettingsToStorage, 5000);
        return Promise.resolve();
    }

    function saveSettingsToStorage() {
        checkTimeout({ timeout: 'saveSettingsToStorage' });
        if (localStorage) {
            _settings.lastVersion = _SCRIPT_VERSION;
            _settings.lastSaved = Date.now();
            localStorage.setItem(_SETTINGS_STORE_NAME, JSON.stringify(_settings));
            WazeWrap.Remote.SaveSettings(_SETTINGS_STORE_NAME, _settings);
            logDebug('Settings saved.');
        }
    }

    function checkShortcutChanged() {
        let keys = '';
        const { shortcut } = W.accelerators.Actions.runStraightenUpShortcut;
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
        else {
            keys = '';
        }
        if (_settings.runStraightenUpShortcut !== keys) {
            _settings.runStraightenUpShortcut = keys;
            saveSettingsToStorage();
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

    // рассчитаем пересчечение перпендикуляра точки с наклонной прямой
    // Calculate the intersection of the perpendicular point with an inclined line
    function getIntersectCoord(a, b, c, d) {
    // второй вариант по-проще: http://rsdn.ru/forum/alg/2589531.hot
        const r = [2];
        // eslint-disable-next-line no-mixed-operators
        r[1] = -1.0 * (c * b - a * d) / (a * a + b * b);
        r[0] = (-r[1] * (b + a) - c + d) / (a - b);
        return { x: r[0], y: r[1] };
    }

    // определим направляющие
    // Define guides
    function getDeltaDirect(a, b) {
        let d = 0.0;
        if (a < b)
            d = 1.0;
        else if (a > b)
            d = -1.0;
        return d;
    }

    function checkNameContinuity(segmentSelectionArr = []) {
        const streetIds = [],
            streetIdsForEach = (streetId) => { streetIds.push(streetId); };
        for (let idx = 0, { length } = segmentSelectionArr; idx < length; idx++) {
            if (idx > 0) {
                if ((segmentSelectionArr[idx].getPrimaryStreetID() > 0) && streetIds.includes(segmentSelectionArr[idx].getPrimaryStreetID()))
                // eslint-disable-next-line no-continue
                    continue;
                if (segmentSelectionArr[idx].getAttribute('streetIDs').length > 0) {
                    let included = false;
                    for (let idx2 = 0, len = segmentSelectionArr[idx].getAttribute('streetIDs').length; idx2 < len; idx2++) {
                        included = streetIds.includes(segmentSelectionArr[idx].getAttribute('streetIDs')[idx2]);
                        if (included)
                            break;
                    }
                    if (included === true)
                    // eslint-disable-next-line no-continue
                        continue;
                    else
                        return false;
                }
                return false;
            }
            if (idx === 0) {
                if (segmentSelectionArr[idx].getPrimaryStreetID() > 0)
                    streetIds.push(segmentSelectionArr[idx].getPrimaryStreetID());
                if (segmentSelectionArr[idx].getAttribute('streetIDs').length > 0)
                    segmentSelectionArr[idx].getAttribute('streetIDs').forEach(streetIdsForEach);
            }
        }
        return true;
    }

    function distanceBetweenPoints(lon1, lat1, lon2, lat2, measurement) {
    // eslint-disable-next-line no-nested-ternary
        const multiplier = measurement === 'meters' ? 1000 : measurement === 'miles' ? 0.621371192237334 : measurement === 'feet' ? 3280.8398950131 : 1;
        const R = 6371; // KM
        const φ1 = lat1 * (Math.PI / 180);
        const φ2 = lat2 * (Math.PI / 180);
        const Δφ = (lat2 - lat1) * (Math.PI / 180);
        const Δλ = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d * multiplier;
    }

    function checkForMicroDogLegs(distinctNodes, singleSegmentId) {
        if (!distinctNodes || (distinctNodes.length < 1))
            return false;
        const nodesChecked = [],
            nodesObjArr = W.model.nodes.getByIds(distinctNodes);
        if (!nodesObjArr || (nodesObjArr.length < 1))
            return false;
        const checkGeoComp = function (geoComp) {
            const testNode4326 = { lon: geoComp[0], lat: geoComp[1] };
            if ((this.lon !== testNode4326.lon) || (this.lat !== testNode4326.lat)) {
                if (distanceBetweenPoints(this.lon, this.lat, testNode4326.lon, testNode4326.lat, 'meters') < 2)
                    return false;
            }
            return true;
        };
        for (let idx = 0, { length } = nodesObjArr; idx < length; idx++) {
            if (!nodesChecked.includes(nodesObjArr[idx])) {
                nodesChecked.push(nodesObjArr[idx]);
                const segmentsObjArr = W.model.segments.getByIds(nodesObjArr[idx].getSegmentIds()) || [],
                    node4326 = {
                        lon: nodesObjArr[idx].getGeometry().coordinates[0],
                        lat: nodesObjArr[idx].getGeometry().coordinates[1]
                    };
                for (let idx2 = 0, len = segmentsObjArr.length; idx2 < len; idx2++) {
                    const segObj = segmentsObjArr[idx2];
                    if (!singleSegmentId
                    || (singleSegmentId && (segObj.getID() === singleSegmentId))) {
                        if (!segObj.getGeometry().coordinates.every(checkGeoComp.bind(node4326)))
                            return true;
                    }
                }
            }
        }
        return false;
    }

    function doStraightenSegments(sanityContinue, nonContinuousContinue, conflictingNamesContinue, microDogLegsContinue, longJnMoveContinue, passedObj) {
        const segmentSelection = W.selectionManager.getSegmentSelection();
        if (longJnMoveContinue && passedObj) {
            const {
                segmentsToRemoveGeometryArr, nodesToMoveArr, distinctNodes, endPointNodeIds
            } = passedObj;
            logDebug(`${I18n.t('wmesu.log.StraighteningSegments')}: ${distinctNodes.join(', ')} (${distinctNodes.length})`);
            logDebug(`${I18n.t('wmesu.log.EndPoints')}: ${endPointNodeIds.join(' & ')}`);
            if (segmentsToRemoveGeometryArr?.length > 0) {
                const UpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry');
                segmentsToRemoveGeometryArr.forEach((obj) => {
                    W.model.actionManager.add(new UpdateSegmentGeometry(obj.segment, obj.geometry, obj.newGeo));
                    logDebug(`${I18n.t('wmesu.log.RemovedGeometryNodes')} # ${obj.segment.getID()}`);
                });
            }
            if (nodesToMoveArr?.length > 0) {
                const MoveNode = require('Waze/Action/MoveNode');
                let straightened = false;
                nodesToMoveArr.forEach((node) => {
                    if ((Math.abs(node.geometry.coordinates[0] - node.nodeGeo.coordinates[0]) > 0.00000001) || (Math.abs(node.geometry.coordinates[1] - node.nodeGeo.coordinates[1]) > 0.00000001)) {
                        logDebug(`${I18n.t('wmesu.log.MovingJunctionNode')} # ${node.node.getID()} `
                        + `- ${I18n.t('wmesu.common.From')}: ${node.geometry.coordinates[0]},${node.geometry.coordinates[1]} - `
                        + `${I18n.t('wmesu.common.To')}: ${node.nodeGeo.coordinates[0]},${node.nodeGeo.coordinates[1]}`);
                        W.model.actionManager.add(new MoveNode(node.node, node.geometry, node.nodeGeo, node.connectedSegObjs, {}));
                        straightened = true;
                    }
                });
                if (!straightened) {
                    logDebug(I18n.t('wmesu.log.AllNodesStraight'));
                    WazeWrap.Alerts.info(_SCRIPT_SHORT_NAME, I18n.t('wmesu.log.AllNodesStraight'));
                }
            }
        }
        else if (segmentSelection.segments.length > 1) {
            const segmentsToRemoveGeometryArr = [],
                nodesToMoveArr = [];
            if ((segmentSelection.segments.length > 10) && !sanityContinue) {
                if (_settings.sanityCheck === 'error') {
                    WazeWrap.Alerts.error(_SCRIPT_SHORT_NAME, I18n.t('wmesu.error.TooManySegments'));
                    return;
                }
                if (_settings.sanityCheck === 'warning') {
                    WazeWrap.Alerts.confirm(
                        _SCRIPT_SHORT_NAME,
                        I18n.t('wmesu.prompts.SanityCheckConfirm'),
                        () => { doStraightenSegments(true, false, false, false, false, undefined); },
                        () => { },
                        I18n.t('wmesu.common.Yes'),
                        I18n.t('wmesu.common.No')
                    );
                    return;
                }
            }
            sanityContinue = true;
            if ((segmentSelection.multipleConnectedComponents === true) && !nonContinuousContinue) {
                if (_settings.nonContinuousSelection === 'error') {
                    WazeWrap.Alerts.error(_SCRIPT_SHORT_NAME, I18n.t('wmesu.error.NonContinuous'));
                    return;
                }
                if (_settings.nonContinuousSelection === 'warning') {
                    WazeWrap.Alerts.confirm(
                        _SCRIPT_SHORT_NAME,
                        I18n.t('wmesu.prompts.NonContinuousConfirm'),
                        () => { doStraightenSegments(sanityContinue, true, false, false, false, undefined); },
                        () => { },
                        I18n.t('wmesu.common.Yes'),
                        I18n.t('wmesu.common.No')
                    );
                    return;
                }
            }
            nonContinuousContinue = true;
            if (_settings.conflictingNames !== 'nowarning') {
                const continuousNames = checkNameContinuity(segmentSelection.segments);
                if (!continuousNames && !conflictingNamesContinue && (_settings.conflictingNames === 'error')) {
                    WazeWrap.Alerts.error(_SCRIPT_SHORT_NAME, I18n.t('wmesu.error.ConflictingNames'));
                    return;
                }
                if (!continuousNames && !conflictingNamesContinue && (_settings.conflictingNames === 'warning')) {
                    WazeWrap.Alerts.confirm(
                        _SCRIPT_SHORT_NAME,
                        I18n.t('wmesu.prompts.ConflictingNamesConfirm'),
                        () => { doStraightenSegments(sanityContinue, nonContinuousContinue, true, false, false, undefined); },
                        () => { },
                        I18n.t('wmesu.common.Yes'),
                        I18n.t('wmesu.common.No')
                    );
                    return;
                }
            }
            conflictingNamesContinue = true;
            const allNodeIds = [],
                dupNodeIds = [];
            let endPointNodeIds,
                longMove = false;
            for (let idx = 0, { length } = segmentSelection.segments; idx < length; idx++) {
                allNodeIds.push(segmentSelection.segments[idx].getFromNode().getID());
                allNodeIds.push(segmentSelection.segments[idx].getToNode().getID());
                if (segmentSelection.segments[idx].type === 'segment') {
                    const newGeo = structuredClone(segmentSelection.segments[idx].getGeometry());
                    // Remove the geometry nodes
                    if (newGeo.coordinates.length > 2) {
                        newGeo.coordinates.splice(1, newGeo.coordinates.length - 2);
                        segmentsToRemoveGeometryArr.push({ segment: segmentSelection.segments[idx], geometry: segmentSelection.segments[idx].getGeometry(), newGeo });
                    }
                }
            }
            allNodeIds.forEach((nodeId, idx) => {
                if (allNodeIds.indexOf(nodeId, idx + 1) > -1) {
                    if (!dupNodeIds.includes(nodeId))
                        dupNodeIds.push(nodeId);
                }
            });
            const distinctNodes = [...new Set(allNodeIds)];
            if (!microDogLegsContinue && (checkForMicroDogLegs(distinctNodes, undefined) === true)) {
                if (_settings.microDogLegs === 'error') {
                    WazeWrap.Alerts.error(_SCRIPT_SHORT_NAME, I18n.t('wmesu.error.MicroDogLegs'));
                    return;
                }
                if (_settings.microDogLegs === 'warning') {
                    WazeWrap.Alerts.confirm(
                        _SCRIPT_SHORT_NAME,
                        I18n.t('wmesu.prompts.MicroDogLegsConfirm'),
                        () => { doStraightenSegments(sanityContinue, nonContinuousContinue, conflictingNamesContinue, true, false, undefined); },
                        () => { },
                        I18n.t('wmesu.common.Yes'),
                        I18n.t('wmesu.common.No')
                    );
                    return;
                }
            }
            microDogLegsContinue = true;
            if (segmentSelection.multipleConnectedComponents === false)
                endPointNodeIds = distinctNodes.filter((nodeId) => !dupNodeIds.includes(nodeId));
            else
                endPointNodeIds = [segmentSelection.segments[0].getFromNode().getID(), segmentSelection.segments[(segmentSelection.segments.length - 1)].getToNode().getID()];
            const endPointNodeObjs = W.model.nodes.getByIds(endPointNodeIds),
                endPointNode1Geo = structuredClone(endPointNodeObjs[0].getGeometry()),
                endPointNode2Geo = structuredClone(endPointNodeObjs[1].getGeometry());
            if (getDeltaDirect(endPointNode1Geo.coordinates[0], endPointNode2Geo.coordinates[0]) < 0) {
                let [t] = endPointNode1Geo.coordinates;
                [endPointNode1Geo.coordinates[0]] = endPointNode2Geo.coordinates;
                endPointNode2Geo.coordinates[0] = t;
                [, t] = endPointNode1Geo.coordinates;
                [, endPointNode1Geo.coordinates[1]] = endPointNode2Geo.coordinates;
                endPointNode2Geo.coordinates[1] = t;
                endPointNodeIds.push(endPointNodeIds[0]);
                endPointNodeIds.splice(0, 1);
                endPointNodeObjs.push(endPointNodeObjs[0]);
                endPointNodeObjs.splice(0, 1);
            }
            const a = endPointNode2Geo.coordinates[1] - endPointNode1Geo.coordinates[1],
                b = endPointNode1Geo.coordinates[0] - endPointNode2Geo.coordinates[0],
                c = endPointNode2Geo.coordinates[0] * endPointNode1Geo.coordinates[1] - endPointNode1Geo.coordinates[0] * endPointNode2Geo.coordinates[1];
            distinctNodes.forEach((nodeId) => {
                if (!endPointNodeIds.includes(nodeId)) {
                    const node = W.model.nodes.getObjectById(nodeId),
                        nodeGeo = structuredClone(node.getGeometry());
                    const d = nodeGeo.coordinates[1] * a - nodeGeo.coordinates[0] * b,
                        r1 = getIntersectCoord(a, b, c, d);
                    nodeGeo.coordinates[0] = r1.x;
                    nodeGeo.coordinates[1] = r1.y;
                    const connectedSegObjs = {};
                    for (let idx = 0, { length } = node.getAttribute('segIDs'); idx < length; idx++) {
                        const segId = node.getAttribute('segIDs')[idx];
                        connectedSegObjs[segId] = structuredClone(W.model.segments.getObjectById(segId).getGeometry());
                    }
                    const fromNodeLonLat = { x: node.getGeometry().coordinates[0], y: node.getGeometry().coordinates[1] },
                        toNodeLonLat = r1;
                    if (distanceBetweenPoints(fromNodeLonLat.x, fromNodeLonLat.y, toNodeLonLat.x, toNodeLonLat.y, 'meters') > 10)
                        longMove = true;
                    nodesToMoveArr.push({
                        node, geometry: node.getGeometry(), nodeGeo, connectedSegObjs
                    });
                }
            });
            if (longMove && (_settings.longJnMove === 'error')) {
                WazeWrap.Alerts.error(_SCRIPT_SHORT_NAME, I18n.t('wmesu.error.LongJnMove'));
                return;
            }
            if (longMove && (_settings.longJnMove === 'warning')) {
                WazeWrap.Alerts.confirm(
                    _SCRIPT_SHORT_NAME,
                    I18n.t('wmesu.prompts.LongJnMoveConfirm'),
                    () => {
                        doStraightenSegments(sanityContinue, nonContinuousContinue, conflictingNamesContinue, microDogLegsContinue, true, {
                            segmentsToRemoveGeometryArr, nodesToMoveArr, distinctNodes, endPointNodeIds
                        });
                    },
                    () => { },
                    I18n.t('wmesu.common.Yes'),
                    I18n.t('wmesu.common.No')
                );
                return;
            }
            doStraightenSegments(sanityContinue, nonContinuousContinue, conflictingNamesContinue, microDogLegsContinue, true, {
                segmentsToRemoveGeometryArr, nodesToMoveArr, distinctNodes, endPointNodeIds
            });
        }
        else if (segmentSelection.segments.length === 1) {
            const seg = segmentSelection.segments[0];
            if (seg.type === 'segment') {
                if (!microDogLegsContinue && (checkForMicroDogLegs([seg.getFromNode().getID(), seg.getToNode().getID()], seg.getID()) === true)) {
                    if (_settings.microDogLegs === 'error') {
                        WazeWrap.Alerts.error(_SCRIPT_SHORT_NAME, I18n.t('wmesu.error.MicroDogLegs'));
                        return;
                    }
                    if (_settings.microDogLegs === 'warning') {
                        WazeWrap.Alerts.confirm(
                            _SCRIPT_SHORT_NAME,
                            I18n.t('wmesu.prompts.MicroDogLegsConfirm'),
                            () => { doStraightenSegments(sanityContinue, nonContinuousContinue, conflictingNamesContinue, true, false, undefined); },
                            () => { },
                            I18n.t('wmesu.common.Yes'),
                            I18n.t('wmesu.common.No')
                        );
                        return;
                    }
                }
                microDogLegsContinue = true;
                const newGeo = structuredClone(seg.getGeometry());
                // Remove the geometry nodes
                if (newGeo.coordinates.length > 2) {
                    const UpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry');
                    newGeo.coordinates.splice(1, newGeo.coordinates.length - 2);
                    W.model.actionManager.add(new UpdateSegmentGeometry(seg, seg.getGeometry(), newGeo, { createNodes: true, snappedFeatures: undefined }));
                    logDebug(`${I18n.t('wmesu.log.RemovedGeometryNodes')} # ${seg.getID()}`);
                }
            }
        }
        else {
            logWarning(I18n.t('wmesu.log.NoSegmentsSelected'));
        }
    }

    function insertSimplifyStreetGeometryButtons() {
        const wmeSuDiv = document.getElementById('WME-SU-div'),
            elem = document.getElementById('segment-edit-general');
        if (!elem)
            return;
        const docFrags = document.createDocumentFragment();
        if (!wmeSuDiv) {
            const contentDiv = createElem('div', { style: 'align-items:center; cursor:pointer; display:flex; font-size:13px; gap:8px; justify-content:flex-start;', textContent: I18n.t('wmesu.StraightenUp') });
            contentDiv.appendChild(createElem('wz-button', {
                id: 'WME-SU', color: 'secondary', size: 'xs', textContent: I18n.t('wmesu.common.DoIt'), title: I18n.t('wmesu.StraightenUpTitle')
            }, [{ click: doStraightenSegments }]));
            const wzCard = createElem('wz-card', { style: '--wz-card-padding:4px 8px; --wz-card-margin:0; --wz-card-width:auto; display:block; margin-bottom:8px;' });
            wzCard.appendChild(contentDiv);
            const divElemRoot = createElem('div', { id: 'WME-SU-div' });
            divElemRoot.appendChild(wzCard);
            docFrags.appendChild(divElemRoot);
        }
        if (docFrags.firstChild)
            elem.insertBefore(docFrags, elem.firstChild);
    }

    function loadTranslations() {
        return new Promise((resolve) => {
            const translations = {
                    en: {
                        StraightenUp: 'Straighten Up!',
                        StraightenUpTitle: 'Click here to straighten the selected segment(s) by removing geometry nodes and moving junction nodes as needed.',
                        common: {
                            DoIt: 'Do It',
                            From: 'from',
                            Help: 'Help',
                            No: 'No',
                            Note: 'Note',
                            NothingMajor: 'Nothing major.',
                            To: 'to',
                            Warning: 'Warning',
                            WhatsNew: 'What\'s new',
                            Yes: 'Yes'
                        },
                        error: {
                            ConflictingNames: 'You selected segments that do not share at least one name in common amongst all the segments and have the conflicting names setting set to error. '
                            + 'Segments not straightened.',
                            LongJnMove: 'One or more of the junction nodes that were to be moved would have been moved further than 10m and you have the long junction node move setting set to '
                            + 'give error. Segments not straightened.',
                            MicroDogLegs: 'One or more of the junctions nodes in the selection have a geonode within 2 meters. This is usually the sign of a micro dog leg (mDL).<br><br>'
                            + 'You have the setting for possibe micro doglegs set to give error. Segments not straightened.',
                            NonContinuous: 'You selected segments that are not all connected and have the non-continuous selected segments setting set to give error. Segments not straightened.',
                            TooManySegments: 'You selected too many segments and have the sanity check setting set to give error. Segments not straightened.'
                        },
                        help: {
                            Note01: 'This script uses the action manager, so changes can be undone before saving.',
                            Warning01: 'Enabling (Give warning, No warning) any of these settings can cause unexpected results. Use with caution!',
                            Step01: 'Select the starting segment.',
                            Step02: 'ALT+click the ending segment.',
                            Step02note: 'If the segments you wanted to straighten are not all selected, unselect them and start over using CTRL+click to select each segment instead.',
                            Step03: 'Click "Straighten up!" button in the sidebar.'
                        },
                        log: {
                            AllNodesStraight: 'All junction nodes that would be moved are already considered \'straight\'. No junction nodes were moved.',
                            EndPoints: 'End points',
                            MovingJunctionNode: 'Moving junction node',
                            NoSegmentsSelected: 'No segments selected.',
                            RemovedGeometryNodes: 'Removed geometry nodes for segment',
                            Segment: I18n.t('objects.segment.name'),
                            StraighteningSegments: 'Straightening segments'
                        },
                        prompts: {
                            ConflictingNamesConfirm: 'You selected segments that do not share at least one name in common amongst all the segments. Are you sure you wish to continue straightening?',
                            LongJnMoveConfirm: 'One or more of the junction nodes that are to be moved would be moved further than 10m. Are you sure you wish to continue straightening?',
                            MicroDogLegsConfirm: 'One or more of the junction nodes in the selection have a geonode within 2 meters. This is usually the sign of a micro dog leg (mDL).<br>'
                        + 'This geonode could exist on any segment connected to the junction nodes, not just the segments you selected.<br><br>'
                        + '<b>You should not continue until you are certain there are no micro dog legs.<b><br><br>'
                        + 'Are you sure you wish to continue straightening?',
                            NonContinuousConfirm: 'You selected segments that do not all connect. Are you sure you wish to continue straightening?',
                            SanityCheckConfirm: 'You selected many segments. Are you sure you wish to continue straightening?'
                        },
                        settings: {
                            GiveError: 'Give error',
                            GiveWarning: 'Give warning',
                            NoWarning: 'No warning',
                            ConflictingNames: 'Segments with conflicting names',
                            ConflictingNamesTitle: 'Select what to do if the selected segments do not share at least one name among their primary and alternate names (based on name, city and state).',
                            LongJnMove: 'Long junction node moves',
                            LongJnMoveTitle: 'Select what to do if one or more of the junction nodes would move further than 10m.',
                            MicroDogLegs: 'Possible micro doglegs (mDL)',
                            MicroDogLegsTitle: 'Select what to do if one or more of the junction nodes in the selection have a geometry node within 2m of itself, which is a possible micro dogleg (mDL).',
                            NonContinuousSelection: 'Non-continuous selected segments',
                            NonContinuousSelectionTitle: 'Select what to do if the selected segments are not continuous.',
                            SanityCheck: 'Sanity check',
                            SanityCheckTitle: 'Select what to do if you selected a many segments.'
                        }
                    },
                    ru: {
                        StraightenUp: 'Выпрямить сегменты!',
                        StraightenUpTitle: 'Нажмите, чтобы выпрямить выбранные сегменты, удалив лишние геометрические точки и переместив узлы перекрёстков в ровную линию.',
                        common: {
                            DoIt: 'Сделай это',
                            From: 'с',
                            Help: 'Помощь',
                            No: 'Нет',
                            Note: 'Примечание',
                            NothingMajor: 'Не критично.',
                            To: 'до',
                            Warning: 'Предупреждение',
                            WhatsNew: 'Что нового',
                            Yes: 'Да'
                        },
                        error: {
                            ConflictingNames: 'Вы выбрали сегменты, которые не имеют хотя бы одного общего названия улицы среди выделенных.'
                            + 'Сегменты не были выпрямлены.',
                            LongJnMove: 'Для выпрямления сегментов, их узлы должны быть перемещены более чем на 10 м, но в настройках у вас установлено ограничение перемещения на такое большое '
                            + 'расстояние. Сегменты не были выпрямлены.',
                            MicroDogLegs: 'Один или несколько узлов выбранных сегментов имеют точку в пределах 2 метров. Обычно это признак “<a href=”https://wazeopedia.waze.com/wiki/Benelux/Junction_Arrows” target=”blank”>микроискривления</a>”.<br><br>'
                            + 'В настройках для возможных микроискривлений у вас выставлено ограничение, чтобы выдать ошибку. Сегменты не были выпрямлены.',
                            NonContinuous: 'Вы выбрали сегменты, которые не соединены между собой, но в настройках у вас установлено ограничение для работы с такими сегментами. Сегменты не были '
                            + 'выпрямлены.',
                            TooManySegments: 'Вы выбрали слишком много сегментов, но в настройках у вас включено ограничение на количество одновременно обрабатываемых сегментов. Сегменты не были '
                            + 'выпрямлены.'
                        },
                        help: {
                            Note01: 'Этот скрипт использует историю действий, поэтому перед их сохранением изменения можно отменить.',
                            Warning01: 'Настройка любого из этих параметров в положение (Выдать предупреждение, Не предупреждать) может привести к неожиданным результатам. Используйте с осторожностью!',
                            Step01: 'Выделите начальный сегмент.',
                            Step02: 'При помощи Alt-кнопки, выделите конечный сегмент.',
                            Step02note: 'Если выделены не все нужные вам сегменты, при помощи Ctrl-кнопки можно дополнительно выделить или снять выделения сегментов.',
                            Step03: 'Нажмите ‘Выпрямить сегменты!’ на левой панели.'
                        },
                        log: {
                            AllNodesStraight: 'Все узлы, которые нужно было выпрямить, уже выровнены в линию. Сегменты оставлены без изменений.',
                            EndPoints: 'конечные точки',
                            MovingJunctionNode: 'Перемещение узла',
                            NoSegmentsSelected: 'Сегменты не выделены.',
                            RemovedGeometryNodes: 'Удалены лишние точки сегмента',
                            Segment: I18n.t('objects.segment.name'),
                            StraighteningSegments: 'Выпрямление сегментов'
                        },
                        prompts: {
                            ConflictingNamesConfirm: 'Вы выбрали сегменты, которые не имеют хотя бы одного общего названия среди всех сегментов. Вы уверены, что хотите продолжить выпрямление?',
                            LongJnMoveConfirm: 'Один или несколько узлов будут перемещены более, чем на 10 метров. Вы уверены, что хотите продолжить выпрямление?',
                            MicroDogLegsConfirm: 'Один или несколько узлов выбранных сегментов имеют точки в пределах 2 метров. Обычно это признак “<a href=”https://wazeopedia.waze.com/wiki/Benelux/Junction_Arrows” target=”blank”>микроискривления</a>”.<br>'
                        + 'Такая точка может находиться в любом сегменте, соединенном с выбранными вами сегментами и узлами, а не только на них самих.<br><br>'
                        + '<b>Вы не должны продолжать до тех пор, пока не убедитесь, что у вас нет “микроискривлений”.<b><br><br>'
                        + 'Вы уверены,что готовы продолжать выпрямление?',
                            NonContinuousConfirm: 'Вы выбрали сегменты, которые не соединяются друг с другом. Вы уверены, что хотите продолжить выпрямление?',
                            SanityCheckConfirm: 'Вы выбрали слишком много сегментов. Вы уверены, что хотите продолжить выпрямление?'
                        },
                        settings: {
                            GiveError: 'Выдать ошибку',
                            GiveWarning: 'Выдать предупреждение',
                            NoWarning: 'Не предупреждать',
                            ConflictingNames: 'Сегменты с разными названиями',
                            ConflictingNamesTitle: 'Выберите, что делать, если выбранные сегменты не содержат хотя бы одно название среди своих основных и альтернативных названий (на основе улицы, '
                            + 'города и района).',
                            LongJnMove: 'Перемещение узлов на большие расстояния',
                            LongJnMoveTitle: 'Выберите, что делать, если один или несколько узлов будут перемещаться дальше, чем на 10 метров.',
                            MicroDogLegs: 'Допускать “<a href=”https://wazeopedia.waze.com/wiki/Benelux/Junction_Arrows” target=”blank”>микроискривления</a>”',
                            MicroDogLegsTitle: 'Выберите, что делать, если один или несколько узлов соединения в выделении имеют точку в пределах 2 м от себя, что является возможным “микроискривлением”.',
                            NonContinuous: 'Не соединённые сегменты',
                            NonContinuousTitle: 'Выберите, что делать, если выбранные сегменты не соединены друг с другом.',
                            SanityCheck: 'Ограничение нагрузки',
                            SanityCheckTitle: 'Выберите, что делать, если вы выбрали слишком много сегментов.'
                        }
                    }
                },
                locale = I18n.currentLocale();
            I18n.translations[locale].wmesu = translations.en;
            translations['en-US'] = { ...translations.en };
            I18n.translations[locale].wmesu = $extend(true, {}, translations.en, translations[locale]);
            resolve();
        });
    }

    function checkSuVersion() {
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
        checkSuVersion();
        if (W.loginManager.getUserRank() < 2)
            return;
        await loadSettingsFromStorage();
        await loadTranslations();
        const onSelectionChange = function () {
                const setting = this.id.substr(6);
                if (this.value.toLowerCase() !== _settings[setting]) {
                    _settings[setting] = this.value.toLowerCase();
                    saveSettingsToStorage();
                }
            },
            buildSelections = (selected) => {
                const docFrags = document.createDocumentFragment();
                docFrags.appendChild(createElem('option', { value: 'nowarning', selected: selected === 'nowarning', textContent: I18n.t('wmesu.settings.NoWarning') }));
                docFrags.appendChild(createElem('option', { value: 'warning', selected: selected === 'warning', textContent: I18n.t('wmesu.settings.GiveWarning') }));
                docFrags.appendChild(createElem('option', { value: 'error', selected: selected === 'error', textContent: I18n.t('wmesu.settings.GiveError') }));
                return docFrags;
            },
            buildSection = (section) => {
                const selectElem = createElem('select', {
                    id: `WMESU-${section}`,
                    style: 'font-size:11px;height:22px;',
                    title: I18n.t(`wmesu.settings.${section.charAt(0).toUpperCase()}${section.slice(1)}Title`)
                }, [{ change: onSelectionChange }]);
                selectElem.appendChild(buildSelections(_settings[section]));
                const divElemDiv = createElem('div', { id: `WMESU-div-${section}`, class: 'controls-container' });
                divElemDiv.appendChild(selectElem);
                const divElemDivDiv = createElem('div', { style: 'display:inline-block;font-size:11px;', textContent: I18n.t(`wmesu.settings.${section.charAt(0).toUpperCase()}${section.slice(1)}`) });
                divElemDiv.appendChild(divElemDivDiv);
                return divElemDiv;
            },
            tabContent = () => {
                const docFrags = document.createDocumentFragment();
                docFrags.appendChild(createElem('div', { style: 'margin-bottom:0px;font-size:13px;font-weight:600;', textContent: _SCRIPT_SHORT_NAME }));
                docFrags.appendChild(createElem('div', { style: 'margin-top:0px;font-size:11px;font-weight:600;color:#aaa;', textContent: _SCRIPT_VERSION }));
                docFrags.appendChild(buildSection('conflictingNames'));
                docFrags.appendChild(buildSection('longJnMove'));
                docFrags.appendChild(buildSection('microDogLegs'));
                docFrags.appendChild(buildSection('nonContinuousSelection'));
                docFrags.appendChild(buildSection('sanityCheck'));
                const divElemDiv = createElem('div', { style: 'margin-top:20px;' });
                divElemDiv.appendChild(createElem('div', { style: 'font-size:14px;font-weight:600;', textContent: I18n.t('wmesu.common.Help') }));
                let liElem = createElem('li');
                liElem.appendChild(createElem('p', { style: 'font-weight:100;margin-bottom:0px;', textContent: I18n.t('wmesu.help.Step01') }));
                const olElem = createElem('ol', { style: 'font-weight:600;' });
                olElem.appendChild(liElem);
                const pElem = createElem('p', { style: 'font-weight:100;margin-bottom:0px;' });
                pElem.appendChild(createTextNode(I18n.t('wmesu.help.Step02')));
                pElem.appendChild(createElem('br'));
                pElem.appendChild(createElem('b', { textContent: `${I18n.t('wmesu.common.Note')}:` }));
                pElem.appendChild(createTextNode(` ${I18n.t('wmesu.help.Step02note')}`));
                liElem = createElem('li');
                liElem.appendChild(pElem);
                olElem.appendChild(liElem);
                liElem = createElem('li');
                liElem.appendChild(createElem('p', { style: 'font-weight:100;margin-bottom:0px;', textContent: I18n.t('wmesu.help.Step03') }));
                olElem.appendChild(liElem);
                const divElemDivDiv = createElem('div');
                divElemDivDiv.appendChild(olElem);
                divElemDiv.appendChild(divElemDivDiv);
                divElemDiv.appendChild(createElem('b', { textContent: `${I18n.t('wmesu.common.Warning')}:` }));
                divElemDiv.appendChild(createTextNode(` ${I18n.t('wmesu.help.Warning01')}`));
                divElemDiv.appendChild(createElem('br'));
                divElemDiv.appendChild(createElem('br'));
                divElemDiv.appendChild(createElem('b', { textContent: `${I18n.t('wmesu.common.Note')}:` }));
                divElemDiv.appendChild(createTextNode(` ${I18n.t('wmesu.help.Note01')}`));
                docFrags.appendChild(divElemDiv);
                return docFrags;
            };
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab('SU!');
        tabLabel.textContent = 'SU!';
        tabLabel.title = _SCRIPT_LONG_NAME;
        tabPane.appendChild(tabContent());
        tabPane.id = 'WMESUSettings';
        await W.userscripts.waitForElementConnected(tabPane);
        logDebug('Enabling MOs.');
        W.selectionManager.events.register('selectionchanged', null, insertSimplifyStreetGeometryButtons);
        if (W.selectionManager.getSegmentSelection().segments.length > 0)
            insertSimplifyStreetGeometryButtons();
        window.addEventListener('beforeunload', () => { checkShortcutChanged(); }, false);
        new WazeWrap.Interface.Shortcut(
            'runStraightenUpShortcut',
            'Run straighten up',
            'editing',
            'Straighten Up',
            _settings.runStraightenUpShortcut,
            () => document.getElementById('WME-SU')?.dispatchEvent(new MouseEvent('click', { bubbles: true })),
            null
        ).add();
        showScriptInfoAlert();
        log(`Fully initialized in ${Math.round(performance.now() - _LOAD_BEGIN_TIME)} ms.`);
        setTimeout(checkShortcutChanged, 10000);
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
            logError('onWmeReady timed out waiting for WazeWrap Ready state.');
        }
    }

    function onWmeInitialized() {
        if (W.userscripts?.state?.isReady) {
            logDebug('W is ready and already in "wme-ready" state. Proceeding with initialization.');
            onWmeReady();
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
