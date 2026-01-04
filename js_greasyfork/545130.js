// ==UserScript==
// @name                WME Route Speeds (MapOMatic fork)extrainfo July2025
// @description         Shows segment speeds in a route.
// @include             /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @version             2025.07.09.000.tm
// @grant               GM_xmlhttpRequest
// @namespace           https://greasyfork.org/en/scripts/369630-wme-route-speeds-mapomatic-fork
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @author              wlodek76 (forked by MapOMatic)
// @copyright           2014, 2015 wlodek76
// @contributor         2014, 2015 FZ69617
// @connect             greasyfork.org
// @connect             waze.com
// @downloadURL https://update.greasyfork.org/scripts/545130/WME%20Route%20Speeds%20%28MapOMatic%20fork%29extrainfo%20July2025.user.js
// @updateURL https://update.greasyfork.org/scripts/545130/WME%20Route%20Speeds%20%28MapOMatic%20fork%29extrainfo%20July2025.meta.js
// ==/UserScript==

/* global W */
/* global OpenLayers */

/* eslint-disable */
(function () {
    "use strict";

    const DOWNLOAD_URL = 'https://update.greasyfork.org/scripts/369630/WME%20Route%20Speeds%20%28MapOMatic%20fork%29.user.js';
    const SCRIPT_VERSION = GM_info.script.version.toString();
    const SCRIPT_NAME = GM_info.script.name;

    const KM_PER_MILE = 1.609344;

    const SAVED_OPTIONS_KEY = "RouteSpeedsOptions";
    const options = {
        enableScript: true,
        showLabels: true,
        showSpeeds: true,
        useMiles: false,
        showRouteText: false,
        getAlternatives: true,
        maxRoutes: 3,
        liveTraffic: true,
        routingOrder: true,
        useRBS: false,
        routeType: 1,
        vehicleType: 'PRIVATE',
        avoidTolls: false,
        avoidFreeways: false,
        avoidDifficult: false,
        avoidFerries: false,
        avoidUnpaved: true,
        avoidLongUnpaved: false,
        allowUTurns: true,
        extraInfo: false,
        includeCrossTime: true,
        includePenalty: false,
        freeFlow: false,
        passes: []
    };

    let countryPassList = [];

    var wmech_version = GM_info.script.version;

    var epsg900913;
    var epsg4326;

    var selected = 0;

    var routesReceived = [];
    var routesShown = [];

    var routewait = 0;
    var routeSelected = 0;
    var routeSelectedLast = -1;

    var markerA;
    var markerB;
    var markerA_offset_click = [0, 0];
    var markerB_offset_click = [0, 0];

    var lastmapcenter = [0, 0];
    var panningX = 0;
    var panningY = 0;
    var acceleration = 1.6;
    var accelerationmin = 10;
    var accelerationmax = 200;
    var accelerationmargin = 30;
    var accelerationbackstop = 3;

    const INVALID_SPEED_COLOR = '#808080';
    const METRIC_SPEED_COLORS = [
        '#2e131c', // < 5.5 km/h
        '#711422', // < 10.5 km/h
        '#af0b26', // < 15.5 km/h
        '#e9052a', // < 20.5 km/h
        '#ff632a', // < 30.5 km/h
        '#ffab20', // < 40.5 km/h
        '#ffd60f', // < 50.5 km/h
        '#9ce30b', // < 60.5 km/h
        '#23bf4c', // < 70.5 km/h
        '#32c6c2', // < 80.5 km/h
        '#09d7ff', // < 90.5 km/h
        '#09a9ff', // < 100.5 km/h
        '#1555fe', // < 110.5 km/h
        '#5e00e0', // < 120.5 km/h
        '#a504cd', // < 130.5 km/h
        '#851680', // < 140.5 km/h
        '#531947'  // >= 140.5 km/h
    ];
    const IMPERIAL_SPEED_COLORS = [
        '#2e131c', // < 3.5 mph
        '#711422', // < 6.5 mph
        '#af0b26', // < 9.5 mph
        '#e9052a', // < 12.5 mph
        '#ff492a', // < 15.5 mph
        '#ff7b28', // < 20.5 mph
        '#ffab20', // < 25.5 mph
        '#ffd60f', // < 30.5 mph
        '#9ce30b', // < 35.5 mph
        '#04d02e', // < 40.5 mph
        '#2cae60', // < 45.5 mph
        '#32c6c2', // < 50.5 mph
        '#09d7ff', // < 55.5 mph
        '#09a9ff', // < 60.5 mph
        '#0d75ff', // < 65.5 mph
        '#1b2fff', // < 70.5 mph
        '#5e00e0', // < 75.5 mph
        '#a504cd', // < 80.5 mph
        '#851680', // < 85.5 mph
        '#531947'  // >= 85.5 mph
    ];

    const ROUTE_COLORS = [
        '#4d4dcd', // route 1
        '#d34f8a', // route 2
        '#188984', // route 3
        '#cafa27', // route 4
        '#ffca3f', // route 5
        '#39e440', // route 6
        '#a848e2', // route 7
        '#cbbf00', // route 8
        '#2994f3', // route 9
        '#ff3d1e', // route 10
        '#b0b7f8', // route 11
        '#ffb0ba', // route 12
        '#71ded2', // route 13
        '#86c211', // route 14
        '#ff8500', // route 15
        '#00a842', // route 16
        '#ecd4ff', // route 17
        '#7c00ff', // route 18
        '#caeeff', // route 19
        '#ffdab8'  // route 20
    ];

    var jqueryinfo = 0;
    var tabswitched = 0;
    var leftHand = false;

    const SCRIPT_LAYERS_TO_COVER = ["_LTHighlightLayer", "LTLaneGraphics", "LTNamesLayer"];
    const WME_LAYERS_TO_MOVE = ["closures", "turn_closure", "closure_nodes"];
    let layersMoved = [];
    let originalZIndexes = [];
    let baseZIndex = 0;
    let z17_reached = 0;

    function log(msg) {
        console.log('WME Route Speeds:', msg);
    }

    async function onWmeReady(tries = 0) {
        if (WazeWrap && WazeWrap.Ready) {
            startScriptUpdateMonitor();
            log('Initializing...');
            await initialiseWMERouteSpeeds();
            log(wmech_version + " loaded.");
        } else {
            if (tries === 0) {
                log('Waiting for WazeWrap...');
            } else if (tries === 300) {
                console.error('WME Route Speeds:', 'WazeWrap loading failed. Giving up.');
                return;
            }
            setTimeout(onWmeReady, 100, ++tries);
        }
    }

    function startScriptUpdateMonitor() {
        log('Checking for script updates...');
        let updateMonitor;
        try {
            updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(SCRIPT_NAME, SCRIPT_VERSION, DOWNLOAD_URL, GM_xmlhttpRequest);
            updateMonitor.start();
        } catch (ex) {
            // Report, but don't stop if ScriptUpdateMonitor fails.
            console.error(SCRIPT_NAME, ex);
        }
    }

    function bootstrap() {
        log('Waiting for WME...');
        if (typeof W === 'object' && W.userscripts?.state.isReady) {
            onWmeReady();
        } else {
            document.addEventListener('wme-ready', onWmeReady, { once: true });
        }
    }

    //------------------------------------------------------------------------------------------------
    function panningWMERouteSpeeds() {
        var WM = W.map;

        //var operationPending = W.vent._events.listeners.operationPending[0];
        //if (operationPending == undefined) return;
        //var pending = operationPending.obj.pending[0];

        //var lastcenterX = lastmapcenter[0];
        //var lastcenterY = lastmapcenter[1];
        //var centerX = WM.getCenter().lon;
        //var centerY = WM.getCenter().lat;

        //if (lastcenterX == 0) lastcenterX = centerX;
        //if (lastcenterY == 0) lastcenterY = centerY;

        //if ( lastcenterX==centerX && lastcenterY==centerY && pending == undefined ) {
        if (panningX || panningY) {
            var accelX = panningX;
            var accelY = panningY;

            if (accelX < 0) accelX = -Math.pow(Math.abs(accelX), acceleration) - accelerationmin;
            if (accelX > 0) accelX = Math.pow(Math.abs(accelX), acceleration) + accelerationmin;

            if (accelY < 0) accelY = -Math.pow(Math.abs(accelY), acceleration) - accelerationmin;
            if (accelY > 0) accelY = Math.pow(Math.abs(accelY), acceleration) + accelerationmin;

            if (accelX < -accelerationmax) accelX = -accelerationmax;
            if (accelY < -accelerationmax) accelY = -accelerationmax;
            if (accelX > accelerationmax) accelX = accelerationmax;
            if (accelY > accelerationmax) accelY = accelerationmax;

            WM.getOLMap().pan(accelX, accelY);
        }
        //}
    }
    //------------------------------------------------------------------------------------------------
    function saveRouteSpeedsOptions() {

        localStorage.setItem(SAVED_OPTIONS_KEY, JSON.stringify(options));

    }
    //---------------------------------------------------------------------------------------
    function loadRouteSpeedsOptions() {

        try {
            Object.assign(options, JSON.parse(localStorage.getItem(SAVED_OPTIONS_KEY)));
        } catch {
            log("Error loading saved options. Using defaults.");
        }

        getId('routespeeds-enablescript').checked = options.enableScript;
        getId('routespeeds-showLabels').checked = options.showLabels;
        getId('routespeeds-showSpeeds').checked = options.showSpeeds;
        getId('routespeeds-usemiles').checked = options.useMiles;
        getId('routespeeds-routetext').checked = options.showRouteText;
        getId('routespeeds-getalternatives').checked = options.getAlternatives;
        getId('routespeeds-maxroutes').value = options.maxRoutes;
        getId('routespeeds-livetraffic').checked = options.liveTraffic;
        getId('routespeeds-avoidtolls').checked = options.avoidTolls;
        getId('routespeeds-avoidfreeways').checked = options.avoidFreeways;
        getId('routespeeds-avoidunpaved').checked = options.avoidUnpaved;
        getId('routespeeds-avoidlongunpaved').checked = options.avoidLongUnpaved;
        getId('routespeeds-routetype').value = options.routeType;
        getId('routespeeds-allowuturns').checked = options.allowUTurns;
        getId('routespeeds-routingorder').checked = options.routingOrder;
        getId('routespeeds-userbs').checked = options.useRBS;
        getId('routespeeds-avoiddifficult').checked = options.avoidDifficult;
        getId('routespeeds-avoidferries').checked = options.avoidFerries;
        getId('routespeeds-vehicletype').value = options.vehicleType;
        getId('routespeeds-extrainfo').checked = options.extraInfo;
        getId('routespeeds-includecrosstime').checked = options.includeCrossTime;
        getId('routespeeds-includepenalty').checked = options.includePenalty;
        getId('routespeeds-freeflow').checked = options.freeFlow;
    }
    //---------------------------------------------------------------------------------------
    function getRoutingManager() {
        if (W.model.countries.getObjectById(235) || W.model.countries.getObjectById(40) || W.model.countries.getObjectById(182)) { // US, Canada, & PR
            return 'https://routing-livemap-am.waze.com/RoutingManager/routingRequest';
        } else if (W.model.countries.getObjectById(106)) { // Israel
            return 'https://routing-livemap-il.waze.com/RoutingManager/routingRequest';
        } else {
            return 'https://routing-livemap-row.waze.com/RoutingManager/routingRequest'; // ROW
        }
    }
    //------------------------------------------------------------------------------------------------
    function getSegmentMidPoint(seg, end) {

        var points, p1, p2, dx, dy, x, y;
        var olGeo = W.userscripts.toOLGeometry(seg.getGeometry());
        points = olGeo.components.length;

        if (points == 2) {
            p1 = olGeo.components[0];
            p2 = olGeo.components[1];

            x = p1.x + (p2.x - p1.x) * 0.5;
            y = p1.y + (p2.y - p1.y) * 0.5;
            return OpenLayers.Layer.SphericalMercator.inverseMercator(x, y);
        }

        var length = 0;
        for (var i = 0; i < points - 1; i++) {
            p1 = olGeo.components[i + 0];
            p2 = olGeo.components[i + 1];
            dx = p2.x - p1.x;
            dy = p2.y - p1.y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        var midlen = length / 2.0;

        var length1 = 0;
        var length2 = 0;
        for (i = 0; i < points - 1; i++) {
            p1 = olGeo.components[i + 0];
            p2 = olGeo.components[i + 1];
            dx = p2.x - p1.x;
            dy = p2.y - p1.y;
            length1 = length2;
            length2 = length2 + Math.sqrt(dx * dx + dy * dy);

            if (midlen >= length1 && midlen < length2) {
                var proc = (midlen - length1) / (length2 - length1);
                x = p1.x + (p2.x - p1.x) * proc;
                y = p1.y + (p2.y - p1.y) * proc;
                return OpenLayers.Layer.SphericalMercator.inverseMercator(x, y);
            }
        }

        if (end === 0) {
            p1 = olGeo.components[0];
            p2 = olGeo.components[1];
        }
        else {
            p1 = olGeo.components[points - 2];
            p2 = olGeo.components[points - 1];
        }

        x = p1.x + (p2.x - p1.x) * 0.5;
        y = p1.y + (p2.y - p1.y) * 0.5;
        return OpenLayers.Layer.SphericalMercator.inverseMercator(x, y);
    }
    //------------------------------------------------------------------------------------------------
    function getLabelTime(segmentInfo) {
        let time = 0;
        if (options.includeCrossTime) {
            if (options.freeFlow) {
                time += segmentInfo.crossTimeFreeFlow;
            } else {
        if (options.liveTraffic) time += segmentInfo.crossTime;
        else time += segmentInfo.crossTimeWithoutRealTime;
            }
        }
        if (options.includePenalty) {
            time += segmentInfo.penalty;
        }
        return time;
    }
    //------------------------------------------------------------------------------------------------
    function getFreeFlowLimitType(segmentInfo) {
        const roadTypeSpeeds = {1: 30, 2: 50, 7: 65, 6: 75, 3: 100, 4: 65, 17: 20};
        if (!(segmentInfo.roadType in roadTypeSpeeds)) return '';
        if (3.6 * segmentInfo.length / (segmentInfo.crossTimeFreeFlow + 0.5) < roadTypeSpeeds[segmentInfo.roadType] * 0.55) {
            return 'lower';
        } else if (3.6 * segmentInfo.length / (segmentInfo.crossTimeFreeFlow - 0.5) > roadTypeSpeeds[segmentInfo.roadType] + 50) {
            return 'upper';
        } else {
            return '';
        }
    }
    //------------------------------------------------------------------------------------------------
    function getLabelWeight(segmentInfo) {
        if (options.freeFlow) {
            if (getFreeFlowLimitType(segmentInfo)) return 'bold';
        else return 'normal';
        } else if (options.liveTraffic && segmentInfo.crossTime != segmentInfo.crossTimeWithoutRealTime) {
            return 'bold';
        } else {
            return 'normal';
        }
    }
    //------------------------------------------------------------------------------------------------
    function getLabelColor(segmentInfo) {
        if (options.freeFlow) {
            if (getFreeFlowLimitType(segmentInfo)) return (getFreeFlowLimitType(segmentInfo) == 'lower') ? '#ff9900' : '#99ee00';
            else return '#f8f8f8';
        } else if (options.liveTraffic) {
            if (segmentInfo.crossTime != segmentInfo.crossTimeWithoutRealTime) {
                let ratio = segmentInfo.crossTime / segmentInfo.crossTimeWithoutRealTime;
                if (ratio > 2) return '#ff0000';
                if (ratio > 1.25) return '#ff9900';
                if (ratio >= 0.8) return '#ffff00';
                if (ratio >= 0.5) return '#99ee00';
                else return '#00bb33';
            } else {
                return '#f8f8f8';
            }
        } else {
            return '#f8f8f8';
        }
    }
    //------------------------------------------------------------------------------------------------
    function getSpeed(length_m, time_s) {
        if (time_s == 0) return 0;
        if (options.useMiles) return 3.6 * length_m / (time_s * KM_PER_MILE);
        else return 3.6 * length_m / time_s;
    }
    //-----------------------------------------------------------------------------------------------
    function getSpeedColor(speed) {
        if (speed === 0) return INVALID_SPEED_COLOR;
        let s = Math.round(speed);
        if (options.useMiles) {
            if (s <= 15) return IMPERIAL_SPEED_COLORS[Math.min(Math.ceil(s / 3) - 1, IMPERIAL_SPEED_COLORS.length - 1)];
            else return IMPERIAL_SPEED_COLORS[Math.min(Math.ceil(s / 5) + 1, IMPERIAL_SPEED_COLORS.length - 1)];
        } else {
            if (s <= 20) return METRIC_SPEED_COLORS[Math.min(Math.ceil(s / 5) - 1, METRIC_SPEED_COLORS.length - 1)];
            else return METRIC_SPEED_COLORS[Math.min(Math.ceil(s / 10) + 1, METRIC_SPEED_COLORS.length - 1)];
        }
    }
    //-----------------------------------------------------------------------------------------------
    function getRouteColor(routeNo) {
        let i = routeNo % ROUTE_COLORS.length;
        return ROUTE_COLORS[i];
    }
    //-----------------------------------------------------------------------------------------------
    function getTimeText(time_s) {
        let seconds = time_s % 60;
        let minutes = Math.floor((time_s % 3600) / 60);
        let hours = Math.floor(time_s / 3600);
        return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }
    //-----------------------------------------------------------------------------------------------
    function updatePassesLabel() {
        let count = countryPassList.filter(pass => options.passes.indexOf(pass.key) > -1).length;
        $('#routespeeds-passes-label').text(`Passes & Permits (${count} of ${countryPassList.length})`);
    }
    //------------------------------------------------------------------------------------------------
    function addLabel(lines, segmentInfo) {

        let labelText;
        if (options.showSpeeds) {
            let speed = getSpeed(segmentInfo.length, getLabelTime(segmentInfo));
            if (speed >= 1) labelText = Math.round(speed);
            else if (speed == 0) labelText = '?';
            else labelText = '<1';
        } else {
            labelText = getLabelTime(segmentInfo) + 's';
        }

        var p1, p2, pt, textFeature, k, sx, sy;
        var numlines = lines.length;
        if (numlines >= 2) {
            var line;
            var ps = parseInt(numlines) >> 1;
            p1 = lines[ps].components[0];
            p2 = lines[ps].components[1];
            var proc = 0.5;

            var dist = [];
            var dsum = 0;
            for (k = 0; k < numlines; k++) {
                line = lines[k];
                var d = line.getGeodesicLength(epsg900913);
                dsum += d;
                dist.push(d);
            }
            var dmid = dsum / 2.0;
            var d1 = 0;
            var d2 = 0;
            for (k = 0; k < numlines; k++) {
                line = lines[k];
                d1 = d2;
                d2 += dist[k];
                if (dmid >= d1 && dmid < d2) {
                    p1 = lines[k].components[0];
                    p2 = lines[k].components[1];
                    proc = (dmid - d1) / (d2 - d1);
                }
            }

            sx = p1.x + (p2.x - p1.x) * proc;
            sy = p1.y + (p2.y - p1.y) * proc;

            pt = new OpenLayers.Geometry.Point(sx, sy);
            textFeature = new OpenLayers.Feature.Vector(pt, { labelText: labelText, fontWeight: getLabelWeight(segmentInfo), fontColor: getLabelColor(segmentInfo), pointRadius: 0, segmentID: segmentInfo.path.segmentId });
            return textFeature;
        }
        else if (numlines == 1) {
            p1 = lines[0].components[0];
            p2 = lines[0].components[1];

            sx = (p1.x + p2.x) * 0.5;
            sy = (p1.y + p2.y) * 0.5;

            pt = new OpenLayers.Geometry.Point(sx, sy);
            textFeature = new OpenLayers.Feature.Vector(pt, { labelText: labelText, fontWeight: getLabelWeight(segmentInfo), fontColor: getLabelColor(segmentInfo), pointRadius: 0, segmentID: segmentInfo.path.segmentId });
            return textFeature;
        }
        else return null;
    }
    //------------------------------------------------------------------------------------------------
    function panmap(draggingobj, x, y) {
        let viewPortDiv = draggingobj.map.getViewport();
        let maxX = viewPortDiv.clientWidth;
        let maxY = viewPortDiv.clientHeight;
        let lastx = draggingobj.last.x;
        let lasty = draggingobj.last.y;
        let mx = x - lastx;
        let my = y - lasty;

        if (x < accelerationmargin) {
            if (mx < 0) panningX = x - accelerationmargin;
            if (mx > accelerationbackstop) panningX = 0;
        }
        else if (x > maxX - accelerationmargin) {
            if (mx > 0) panningX = x - (maxX - accelerationmargin);
            if (mx < -accelerationbackstop) panningX = 0;
        }
        else panningX = 0;

        if (y < accelerationmargin) {
            if (my < 0) panningY = y - (accelerationmargin);
            if (my > accelerationbackstop) panningY = 0;
        }
        else if (y > maxY - accelerationmargin - 25) {
            if (my > 0) panningY = y - (maxY - accelerationmargin - 25);
            if (my < -accelerationbackstop) panningY = 0;
        }
        else panningY = 0;
    }
    //------------------------------------------------------------------------------------------------
    function createMarkers(lon1, lat1, lon2, lat2, disp) {

        var WM = W.map;

        var mlayers = WM.getLayersBy("uniqueName", "__DrawRouteSpeedsMarkers");
        var markerLayer = mlayers[0];
        var p1, p2, lonlat;

        if (markerA === undefined && markerB === undefined) {
            var di = WazeWrap.Require.DivIcon;
            var iconA = new di("routespeedsmarkerA");
            var iconB = new di("routespeedsmarkerB");

            p1 = new OpenLayers.Geometry.Point(lon1, lat1).transform(epsg4326, epsg900913);
            p2 = new OpenLayers.Geometry.Point(lon2, lat2).transform(epsg4326, epsg900913);

            var lonlatA = new OpenLayers.LonLat(p1.x, p1.y);
            var lonlatB = new OpenLayers.LonLat(p2.x, p2.y);

            markerA = new OpenLayers.Marker(lonlatA, iconA);
            markerB = new OpenLayers.Marker(lonlatB, iconB);

            var wh = WazeWrap.Require.DragElement();//require("Waze/Handler/DragElement");
            markerA.dragging = new wh(WM);
            markerB.dragging = new wh(WM);

            markerA.dragging.down = function (e) {
                lonlat = this.map.getOLMap().getLonLatFromViewPortPx(e.xy ?? e);
                if (lonlat === null) return;
                markerA_offset_click[0] = markerA.lonlat.lon - lonlat.lon;
                markerA_offset_click[1] = markerA.lonlat.lat - lonlat.lat;
            };
            markerB.dragging.down = function (e) {
                lonlat = this.map.getOLMap().getLonLatFromViewPortPx(e.xy ?? e);
                if (lonlat === null) return;
                markerB_offset_click[0] = markerB.lonlat.lon - lonlat.lon;
                markerB_offset_click[1] = markerB.lonlat.lat - lonlat.lat;
            };

            markerA.dragging.move = function (e) {
                lonlat = this.map.getOLMap().getLonLatFromViewPortPx(e.xy);
                markerA.lonlat.lon = lonlat.lon + markerA_offset_click[0];
                markerA.lonlat.lat = lonlat.lat + markerA_offset_click[1];
                markerLayer.drawMarker(markerA);
                panmap(this, e.xy.x, e.xy.y);
            };
            markerB.dragging.move = function (e) {
                lonlat = this.map.getOLMap().getLonLatFromViewPortPx(e.xy);
                markerB.lonlat.lon = lonlat.lon + markerB_offset_click[0];
                markerB.lonlat.lat = lonlat.lat + markerB_offset_click[1];
                markerLayer.drawMarker(markerB);
                panmap(this, e.xy.x, e.xy.y);
            };

            markerA.dragging.done = function (e) {

                if (!options.enableScript) return;

                panningX = 0;
                panningY = 0;

                var lonlatA = new OpenLayers.LonLat(markerA.lonlat.lon, markerA.lonlat.lat).transform(epsg900913, epsg4326);
                var lonlatB = new OpenLayers.LonLat(markerB.lonlat.lon, markerB.lonlat.lat).transform(epsg900913, epsg4326);

                lon1 = parseInt(lonlatA.lon * 1000000.0 + 0.5) / 1000000.0;
                lat1 = parseInt(lonlatA.lat * 1000000.0 + 0.5) / 1000000.0;
                lon2 = parseInt(lonlatB.lon * 1000000.0 + 0.5) / 1000000.0;
                lat2 = parseInt(lonlatB.lat * 1000000.0 + 0.5) / 1000000.0;

                if (getId('sidepanel-routespeeds-a') !== undefined) {
                    getId('sidepanel-routespeeds-a').value = lon1 + ", " + lat1;
                    getId('sidepanel-routespeeds-b').value = lon2 + ", " + lat2;
                }

                var objprog1 = getId('routespeeds-button-livemap');
                if (objprog1.style.backgroundColor === '') objprog1.style.backgroundColor = '#FF8000';

                requestRouteFromLiveMap(lon1, lat1, lon2, lat2);
            };
            markerB.dragging.done = function (e) {

                if (!options.enableScript) return;

                panningX = 0;
                panningY = 0;

                var lonlatA = new OpenLayers.LonLat(markerA.lonlat.lon, markerA.lonlat.lat).transform(epsg900913, epsg4326);
                var lonlatB = new OpenLayers.LonLat(markerB.lonlat.lon, markerB.lonlat.lat).transform(epsg900913, epsg4326);

                lon1 = parseInt(lonlatA.lon * 1000000.0 + 0.5) / 1000000.0;
                lat1 = parseInt(lonlatA.lat * 1000000.0 + 0.5) / 1000000.0;
                lon2 = parseInt(lonlatB.lon * 1000000.0 + 0.5) / 1000000.0;
                lat2 = parseInt(lonlatB.lat * 1000000.0 + 0.5) / 1000000.0;

                if (getId('sidepanel-routespeeds-a') !== undefined) {
                    getId('sidepanel-routespeeds-a').value = lon1 + ", " + lat1;
                    getId('sidepanel-routespeeds-b').value = lon2 + ", " + lat2;
                }

                var objprog1 = getId('routespeeds-button-livemap');
                if (objprog1.style.backgroundColor === '') objprog1.style.backgroundColor = '#FF8000';

                requestRouteFromLiveMap(lon1, lat1, lon2, lat2);
            };

            markerA.dragging.activate(iconA.$div);
            markerB.dragging.activate(iconB.$div);

            markerA.display(disp);
            markerB.display(disp);

            markerLayer.addMarker(markerA);
            markerLayer.addMarker(markerB);
        }
        else {
            p1 = new OpenLayers.Geometry.Point(lon1, lat1).transform(epsg4326, epsg900913);
            p2 = new OpenLayers.Geometry.Point(lon2, lat2).transform(epsg4326, epsg900913);

            markerA.lonlat.lon = p1.x;
            markerA.lonlat.lat = p1.y;
            markerB.lonlat.lon = p2.x;
            markerB.lonlat.lat = p2.y;

            markerA.display(disp);
            markerB.display(disp);

            markerLayer.drawMarker(markerA);
            markerLayer.drawMarker(markerB);
        }

        markerA.created = disp;
        markerB.created = disp;
    }
    //------------------------------------------------------------------------------------------------
    function showRouteLayer(disp) {
        var routeLayer = W.map.getLayersBy("uniqueName", "__DrawRouteSpeedsLines")[0];
        if (routeLayer === undefined) return;
        routeLayer.setVisibility(disp);
    }
    //--------------------------------------------------------------------------------------------------------
    function showMarkers(disp) {
        var WM = W.map;

        var mlayers = WM.getLayersBy("uniqueName", "__DrawRouteSpeedsMarkers");
        var markerLayer = mlayers[0];

        if (markerLayer === undefined) return false;
        if (markerA === undefined) return false;
        if (markerB === undefined) return false;

        if (markerA.created) markerA.display(disp);
        if (markerB.created) markerB.display(disp);

        return (markerA.created && markerB.created);
    }
    //------------------------------------------------------------------------------------------------
    function reverseMarkers() {
        var WM = W.map;

        var mlayers = WM.getLayersBy("uniqueName", "__DrawRouteSpeedsMarkers");
        var markerLayer = mlayers[0];

        if (markerLayer === undefined) return;
        if (markerA === undefined || !markerA.created) return;
        if (markerB === undefined || !markerB.created) return;

        var copy = markerA.lonlat;
        markerA.lonlat = markerB.lonlat;
        markerB.lonlat = copy;

        markerLayer.drawMarker(markerA);
        markerLayer.drawMarker(markerB);
    }
    //------------------------------------------------------------------------------------------------
    function loopWMERouteSpeeds() {

        if (!options.enableScript) return;

        var tabOpen = $('#routespeeds-tab-label').parent().parent().attr('aria-expanded') == "true";
        if (!tabOpen) {
            if (tabswitched !== 1) {
                tabswitched = 1;
                showRouteLayer(false);
                showMarkers(false);
                reorderLayers(0);
            }
            return;
        }
        else {
            if (tabswitched !== 2) {
                tabswitched = 2;
                showRouteLayer(true);
                showMarkers(true);
                reorderLayers(1);
            }
        }

        //var routespeedsbutton = getId('routespeeds-button-livemap');
        //if (routespeedsbutton == 'undefined') return;
        //var routespeedsbutton_ofsW = routespeedsbutton.offsetWidth;
        //var routespeedsbutton_ofsH = routespeedsbutton.offsetHeight;
        //console.log(routespeedsbutton_ofsW, routespeedsbutton_ofsH);
        //if (routespeedsbutton_ofsW == 0 || routespeedsbutton_ofsH==0) return;


        var WM = W.map;

        var rlayers = WM.getLayersBy("uniqueName", "__DrawRouteSpeedsLines");
        if (rlayers.length === 0) {

            var drc_style = new OpenLayers.Style({
                strokeDashstyle: 'solid',
                strokeColor: "${strokeColor}",
                strokeOpacity: 1.0,
                strokeWidth: "${strokeWidth}",
                fillColor: '#0040FF',
                fillOpacity: 1.0,
                pointRadius: "${pointRadius}",
                label: "${labelText}",
                fontFamily: "Tahoma, Courier New",
                fontWeight: "${fontWeight}",
                labelOutlineColor: '#404040',
                labelOutlineWidth: 2,
                fontColor: "${fontColor}",
                fontOpacity: 1.0,
                fontSize: "10px",
                display: 'block'
            });

            var drc_mapLayer = new OpenLayers.Layer.Vector("Route Speeds Lines", {
                displayInLayerSwitcher: true,
                uniqueName: "__DrawRouteSpeedsLines",
                styleMap: new OpenLayers.StyleMap(drc_style)
            });

            I18n.translations[I18n.currentLocale()].layers.name["__DrawRouteSpeedsLines"] = "Route Speeds Lines";
            drc_mapLayer.setVisibility(true);
            WM.addLayer(drc_mapLayer);

            return;
        }

        var mlayers = WM.getLayersBy("uniqueName", "__DrawRouteSpeedsMarkers");
        if (mlayers.length === 0) {

            var drc_mapLayer = new OpenLayers.Layer.Markers("Route Speeds Markers", {
                displayInLayerSwitcher: false,
                uniqueName: "__DrawRouteSpeedsMarkers"
            });

            I18n.translations[I18n.currentLocale()].layers.name["__DrawRouteSpeedsMarkers"] = "Route Speeds Markers";
            WM.addLayer(drc_mapLayer);
            drc_mapLayer.setVisibility(true);

            createMarkers(16, 52, 17, 53, false);

            return;
        }

        if (jqueryinfo === 1) {
            jqueryinfo = 2;
            console.log('WME Route Speeds: jQuery reloaded ver. ' + jQuery.fn.jquery);
        }
        if (jqueryinfo === 0) {
            if (typeof jQuery === 'undefined') {
                console.log('WME Route Speeds: jQuery current ver. ' + jQuery.fn.jquery);

                var script = document.createElement('script');
                script.type = "text/javascript";
                script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js";
                //script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js";
                document.getElementsByTagName('head')[0].appendChild(script);
                jqueryinfo = 1;
            }
        }


        var rlayers = WM.getLayersBy("uniqueName", "__DrawRouteSpeedsLines");
        var routeLayer = rlayers[0];
        if (routeLayer === undefined) return;

        var numSelected = WazeWrap.getSelectedDataModelObjects().length;
        var seg1 = WazeWrap.getSelectedDataModelObjects()[0];
        var seg2 = WazeWrap.getSelectedDataModelObjects()[1];

        if (seg1 !== undefined && seg2 !== undefined) {
            if (!selected) {
                selected = 1;

                var coords1 = getSegmentMidPoint(seg1, 0);
                var coords2 = getSegmentMidPoint(seg2, 1);

                var lon1 = parseInt(coords1.lon * 1000000.0 + 0.5) / 1000000.0;
                var lat1 = parseInt(coords1.lat * 1000000.0 + 0.5) / 1000000.0;
                var lon2 = parseInt(coords2.lon * 1000000.0 + 0.5) / 1000000.0;
                var lat2 = parseInt(coords2.lat * 1000000.0 + 0.5) / 1000000.0;

                if (getId('sidepanel-routespeeds-a') !== undefined) {
                    getId('sidepanel-routespeeds-a').value = lon1 + ", " + lat1;
                    getId('sidepanel-routespeeds-b').value = lon2 + ", " + lat2;
                }

                createMarkers(lon1, lat1, lon2, lat2, true);

                leftHand = false;
                if (W.model.isLeftHand) leftHand = true;
                if (W.model.isLeftHand) leftHand = true;

                requestRouteFromLiveMap(lon1, lat1, lon2, lat2);
            }
        }
        else {
            if (seg1 !== undefined || seg2 !== undefined) {
                if (selected) {
                    selected = 0;

                    routeLayer.removeAllFeatures();

                    getId('routespeeds-summaries').style.visibility = 'hidden';
                }
            }
        }

        if (!z17_reached) {
            if (W.map.getZoom() >= 17) {
                z17_reached = 1;
                switchRoute();
            }
        }
    }
    //--------------------------------------------------------------------------------------------------------
    function createRouteFeatures(id, routewsp, routeodc) {

        var WM = W.map;

        var rlayers = WM.getLayersBy("uniqueName", "__DrawRouteSpeedsLines");
        var routeLayer = rlayers[0];
        if (routeLayer === undefined) return;

        var lineFeatures = [];
        var labelFeatures = [];
        var lines = [];
        var outlinepoints = [];

        var segmentID = 0;
        var odc = 0;

        segmentID = routeodc[odc].path.segmentId;
        var odclen = routeodc[odc].length;
        var odctime = getLabelTime(routeodc[odc]);
        var odcx = 0;
        var odcy = 0;
        if (odc + 1 < routeodc.length) {
            odcx = routeodc[odc + 1].path.x;
            odcy = routeodc[odc + 1].path.y;
        }

        var speedColor = getSpeedColor(getSpeed(odclen, odctime));

        var ptA = new OpenLayers.Geometry.Point(0, 0);
        var ptB = new OpenLayers.Geometry.Point(0, 0);

        var doubletraffic = false;
        var p1 = null;
        var p2 = null;
        var doublepoints = {};
        var wsp1, wsp2, dlon, dlat, dx, dy, label, len, i;


        //wykrycie czy trasa przechodzi dwa razy przez te same punkty, jeżeli tak to rysowanie trasy z odstępem, aby był widoczny przebieg trasy
        //(detection whether the route passes through the same points twice, if so drawing the route with a gap to make the route visible)
        for (i = 0; i < routewsp.length - 1; i++) {
            wsp1 = routewsp[i + 0];
            wsp2 = routewsp[i + 1];

            dlon = Math.abs(wsp1.x - wsp2.x);
            dlat = Math.abs(wsp1.y - wsp2.y);

            if (dlon < 0.0000001 && dlat < 0.0000001) continue;

            var s1 = parseInt(wsp1.x * 10000000 + 0.5) + ',' + parseInt(wsp1.y * 10000000 + 0.5);
            var s2 = parseInt(wsp2.x * 10000000 + 0.5) + ',' + parseInt(wsp2.y * 10000000 + 0.5);

            if (s1 === s2) continue;

            if (doublepoints[s1] === undefined) doublepoints[s1] = 0;
            if (doublepoints[s2] === undefined) doublepoints[s2] = 0;
            doublepoints[s1]++;
            doublepoints[s2]++;

            if (doublepoints[s2] >= 2) {
                doubletraffic = true;
                break;
            }
        }

        var doubletrafficoffset = 0;
        if (doubletraffic) {
            doubletrafficoffset = 11 * Math.pow(2.0, 17 - W.map.getZoom());
        }


        for (i = 0; i < routewsp.length - 1; i++) {
            wsp1 = routewsp[i + 0];
            wsp2 = routewsp[i + 1];

            if (i === 0) {
                ptA.x = wsp1.x;
                ptA.y = wsp1.y;
                ptA = ptA.transform(epsg4326, epsg900913);
                //var p = new drc_OpenLayers.Geometry.Point(wsp1.x, wsp1.y).transform(epsg4326, epsg900913);
                //var pt = new drc_OpenLayers.Geometry.Point(p.x, p.y);
                //var textFeature = new drc_OpenLayers.Feature.Vector( ptA, {labelText: "A", pointRadius: 8, fontColor: '#FFFFFF' } );
                //labelFeatures.push(textFeature);
            }
            if (i === routewsp.length - 2) {
                ptB.x = wsp2.x;
                ptB.y = wsp2.y;
                ptB = ptB.transform(epsg4326, epsg900913);
                //var p = new drc_OpenLayers.Geometry.Point(wsp2.x, wsp2.y).transform(epsg4326, epsg900913);
                //var pt = new drc_OpenLayers.Geometry.Point(p.x, p.y);
                //var textFeature = new drc_OpenLayers.Feature.Vector( ptB, {labelText: "B", pointRadius: 8, fontColor: '#FFFFFF' } );
                //labelFeatures.push(textFeature);
            }

            dx = Math.abs(wsp1.x - odcx);
            dy = Math.abs(wsp1.y - odcy);

            //console.log(wsp1, odcx, odcy, dx, dy);

            if (dx < 0.000001 && dy < 0.000001) {

                if (options.showLabels && (routeSelected == id || routeSelected == -1)) {
                    label = addLabel(lines, routeodc[odc]);
                    if (label !== null) {
                        if (routeSelected == -1) routeLayer.removeFeatures(routeLayer.getFeaturesByAttribute("segmentID", segmentID));
                        labelFeatures.push(label);
                    }
                }
                while (lines.length > 0) lines.pop();

                if (odc + 1 < routeodc.length) {
                    odc++;
                    segmentID = routeodc[odc].path.segmentId;
                    odclen = routeodc[odc].length;
                    odctime = getLabelTime(routeodc[odc]);
                    if (odc + 1 < routeodc.length) {
                        odcx = routeodc[odc + 1].path.x;
                        odcy = routeodc[odc + 1].path.y;
                    }

                    speedColor = getSpeedColor(getSpeed(odclen, odctime));

                }
            }

            dlon = Math.abs(wsp1.x - wsp2.x);
            dlat = Math.abs(wsp1.y - wsp2.y);

            if (dlon < 0.0000001 && dlat < 0.0000001) continue;

            var p3 = new OpenLayers.Geometry.Point(wsp1.x, wsp1.y).transform(epsg4326, epsg900913);
            var p4 = new OpenLayers.Geometry.Point(wsp2.x, wsp2.y).transform(epsg4326, epsg900913);

            if (doubletraffic) {
                dx = p4.x - p3.x;
                dy = p4.y - p3.y;
                var r = Math.sqrt(dx * dx + dy * dy);
                var angle = Math.acos(dx / r);
                if (dy < 0) angle = -angle;
                angle = angle - 0.5 * Math.PI;
                if (leftHand) angle += Math.PI;

                p3.x += doubletrafficoffset * Math.cos(angle) * 0.6;
                p3.y += doubletrafficoffset * Math.sin(angle) * 0.6;
                p4.x += doubletrafficoffset * Math.cos(angle) * 0.6;
                p4.y += doubletrafficoffset * Math.sin(angle) * 0.6;

                if (p1 !== null && p2 !== null) {

                    var Ax = p1.x;
                    var Ay = p1.y;
                    var Bx = p2.x;
                    var By = p2.y;
                    var Cx = p3.x;
                    var Cy = p3.y;
                    var Dx = p4.x;
                    var Dy = p4.y;

                    dx = Cx - Bx;
                    dy = Cy - By;

                    var delta = Math.sqrt(dx * dx + dy * dy);

                    var mx = ((By - Ay) * (Dx - Cx) - (Dy - Cy) * (Bx - Ax));
                    var my = ((Dy - Cy) * (Bx - Ax) - (By - Ay) * (Dx - Cx));

                    if (Math.abs(mx) > 0.000000001 && Math.abs(my) > 0.000000001 && delta > 0.1) {

                        var x = ((Bx - Ax) * (Dx * Cy - Dy * Cx) - (Dx - Cx) * (Bx * Ay - By * Ax)) / mx;
                        var y = ((Dy - Cy) * (Bx * Ay - By * Ax) - (By - Ay) * (Dx * Cy - Dy * Cx)) / my;

                        var dx2 = x - Bx;
                        var dy2 = y - By;
                        var delta2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                        if (delta2 < 1000) {      // checking if point of crossing is close to segments

                            len = lineFeatures.length;
                            if (len > 0) {
                                var lf = lineFeatures[len - 1];
                                lf.geometry.components[1].x = x;
                                lf.geometry.components[1].y = y;
                            }

                            p3.x = x;
                            p3.y = y;
                        }
                    }
                }
            }

            outlinepoints.push(p3);
            outlinepoints.push(p4);

            let points = [];
            points.push(p3);
            points.push(p4);

            let line = new OpenLayers.Geometry.LineString(points);
            lines.push(line);

            let lineFeature;
            if (routeSelected == id || routeSelected == -1) {
                lineFeature = new OpenLayers.Feature.Vector(line, {labelText: '', strokeWidth: 10, strokeColor: speedColor });
            } else {
                lineFeature = new OpenLayers.Feature.Vector(line, {labelText: '', strokeWidth: 5, strokeColor: getRouteColor(id) });
            }

            lineFeatures.push(lineFeature);

            p1 = p3;
            p2 = p4;
        }

        if (options.showLabels && (routeSelected == id || routeSelected == -1)) {
            label = addLabel(lines, routeodc[odc]);
            if (label !== null) {
                if (routeSelected == -1) routeLayer.removeFeatures(routeLayer.getFeaturesByAttribute("segmentID", segmentID));
                labelFeatures.push(label);
            }
        }
        while (lines.length > 0) lines.pop();

        let outlinestring = new OpenLayers.Geometry.LineString(outlinepoints);
        let outlineFeature = new OpenLayers.Feature.Vector(outlinestring, { labelText: '', strokeWidth: 12, strokeColor: '#404040' });
        if (routeSelected == id || routeSelected == -1) routeLayer.addFeatures(outlineFeature);

        routeLayer.addFeatures(lineFeatures);
        routeLayer.addFeatures(labelFeatures);
        //showRouteLayer(true);
    }
    //--------------------------------------------------------------------------------------------------------
    function getElementsByClassName(classname, node) {
        if (!node) node = document.getElementsByTagName("body")[0];
        var a = [];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName("*");
        for (var i = 0, j = els.length; i < j; i++)
            if (re.test(els[i].className)) a.push(els[i]);
        return a;
    }
    //--------------------------------------------------------------------------------------------------------
    function getId(node) {
        return document.getElementById(node);
    }
    //--------------------------------------------------------------------------------------------------------
    function getnowtoday() {
        let hour = getId('routespeeds-hour').value;
        let day = getId('routespeeds-day').value;
        if (hour === '---') hour = 'now';
        if (day === '---') day = 'today';
        if (hour === '') hour = 'now';
        if (day === '') day = 'today';

        let t = new Date();
        let thour = (t.getHours() * 60) + t.getMinutes();
        let tnow = (t.getDay() * 1440) + thour;
        let tsel = tnow;

        if (hour === 'now') {
            if (day === "0") tsel = (parseInt(day) * 1440) + thour;
            if (day === "1") tsel = (parseInt(day) * 1440) + thour;
            if (day === "2") tsel = (parseInt(day) * 1440) + thour;
            if (day === "3") tsel = (parseInt(day) * 1440) + thour;
            if (day === "4") tsel = (parseInt(day) * 1440) + thour;
            if (day === "5") tsel = (parseInt(day) * 1440) + thour;
            if (day === "6") tsel = (parseInt(day) * 1440) + thour;
        }
        else {
            if (day === "today") tsel = (t.getDay() * 1440) + parseInt(hour);
            if (day === "0") tsel = (parseInt(day) * 1440) + parseInt(hour);
            if (day === "1") tsel = (parseInt(day) * 1440) + parseInt(hour);
            if (day === "2") tsel = (parseInt(day) * 1440) + parseInt(hour);
            if (day === "3") tsel = (parseInt(day) * 1440) + parseInt(hour);
            if (day === "4") tsel = (parseInt(day) * 1440) + parseInt(hour);
            if (day === "5") tsel = (parseInt(day) * 1440) + parseInt(hour);
            if (day === "6") tsel = (parseInt(day) * 1440) + parseInt(hour);
        }

        //console.log(tsel, tnow, tsel-tnow);

        return tsel - tnow;
    }
    //--------------------------------------------------------------------------------------------------------
    function requestRouteFromLiveMap(x1, y1, x2, y2) {
        var atTime = getnowtoday();
        var numRoutes = options.getAlternatives ? 3 : 1;
        var routeType = (options.routeType === 3) ? "TIME" : "HISTORIC_TIME";
        var avoidTollRoads = options.avoidTolls;
        var avoidPrimaries = options.avoidFreeways;
        var avoidTrails = options.avoidUnpaved;
        var avoidLongTrails = options.avoidLongUnpaved;
        var allowUTurns = options.allowUTurns;
        var avoidDifficult = options.avoidDifficult;
        var avoidFerries = options.avoidFerries;
        var vehType = options.vehicleType;

        var opt = {
            data: [],
            add: function (name, value, defaultValue) {
                if (value !== defaultValue) {
                    this.data.push(name + (value ? ":t" : ":f"));
                }
            },
            put: function (name, value) {
                this.data.push(name + (value ? ":t" : ":f"));
            },
            get: function () {
                return this.data.join(",");
            }
        };

        opt.add("AVOID_TOLL_ROADS", avoidTollRoads, false);
        opt.add("AVOID_PRIMARIES", avoidPrimaries, false);
        opt.add("AVOID_DANGEROUS_TURNS", avoidDifficult, false);
        opt.add("AVOID_FERRIES", avoidFerries, false);
        opt.add("ALLOW_UTURNS", allowUTurns, true);

        if (avoidLongTrails) { opt.put("AVOID_LONG_TRAILS", true); }
        else if (avoidTrails) { opt.put("AVOID_TRAILS", true); }
        else { opt.put("AVOID_LONG_TRAILS", false); }

        var url = getRoutingManager();
        let expressPass = options.passes.map(key => key);
        var data = {
            from: "x:" + x1 + " y:" + y1,
            to: "x:" + x2 + " y:" + y2,
            returnJSON: true,
            returnGeometries: true,
            returnInstructions: true,
            timeout: 60000,
            at: atTime,
            type: routeType,
            nPaths: numRoutes,
            clientVersion: '4.0.0',
            options: opt.get(),
            vehicleType: vehType,
            subscription: expressPass
        };
        if (options.useRBS) data.id = "beta";

        routewait = 1;
        getId('routespeeds-error').innerHTML = "";
        console.time('WME Route Speeds: routing time');

        GM_xmlhttpRequest({
            method: "GET",
            url: url + "?" + jQuery.param(data),
            headers: {
                "Content-Type": "application/json"
            },
            nocache: true,
            responseType: "json",
            onerror: function(response) {
                let str = "Route request failed" + (response.status !== null ? " with error " + response.status : "") + "!<br>";
                handleRouteRequestError(str);
                console.timeEnd('WME Route Speeds: routing time');
                routewait = 0;
            },
            onload: function(response) {
                if (response.response.error !== undefined) {
                    let str = response.response.error;
                    str = str.replace("|", "<br>");
                    handleRouteRequestError(str);
                } else {
                    if (response.response.coords !== undefined) {
                        log("1 route received (" + numRoutes + " requested)");

                        if (routeSelected > 0) routeSelected = 0;

                        routesReceived = [response.response];
                    }
                    if (response.response.alternatives !== undefined) {
                        log(response.response.alternatives.length + " routes received (" + numRoutes + " requested)");
                        routesReceived = response.response.alternatives;
                    }
                    getId('routespeeds-routecount').innerHTML = 'Received <b>' + routesReceived.length + '</b> route' + (routesReceived.length == 1 ? '' : "s") + ' from the server';
                    sortRoutes();
                }

                getId('routespeeds-button-livemap').style.backgroundColor = '';
                getId('routespeeds-button-reverse').style.backgroundColor = '';
                switchRoute()
                console.timeEnd('WME Route Speeds: routing time');
                routewait = 0;
            },
        });
    }
    //--------------------------------------------------------------------------------------------------------
    function sortRoutes() {
        routesShown = [...routesReceived];
        if (!options.routingOrder) {
            let sortByField = (options.routeType === 2) ? "length" : options.liveTraffic ? "crossTime" : "crossTimeWithoutRealTime";
            routesShown.sort(function (a, b) {
                let valField = "total_" + sortByField;
                let val = function (r) {
                    if (r[valField] !== undefined) return r[valField];
                    let val = 0;
                    for (let i = 0; i < r.results.length; ++i) {
                        val += r.results[i][sortByField];
                    }
                    return r[valField] = val;
                };
                return val(a.response) - val(b.response);
            });
        }
        if (routesShown.length > options.maxRoutes) {
            routesShown = routesShown.slice(0, options.maxRoutes);
        }
        if (routeSelectedLast != -1) routeSelected = routeSelectedLast;
        if (routeSelected >= routesShown.length) routeSelected = routesShown.length - 1;
        createSummaries();
        drawRoutes();
    }
    //--------------------------------------------------------------------------------------------------------
    function createSummaries() {
        var summaryDiv = getId('routespeeds-summaries');
        summaryDiv.innerHTML = '';
        let lengthUnit = options.useMiles ? "miles" : "km";
        let speedUnit = options.useMiles ? "mph" : "km/h";
        for (let i = 0; i < routesShown.length; i++) {
            summaryDiv.innerHTML += '<div id=routespeeds-summary-' + i + ' class=routespeeds_summary_classA></div>';
        }
        for (let i = 0; i < routesShown.length; i++) {
            let routeDiv = getId('routespeeds-summary-' + i);
            routeDiv.onclick = function(){ toggleRoute(i) };
            if (routeSelected == i) routeDiv.className = 'routespeeds_summary_classB';

            let html = '<div class=routespeeds_header style="background: ' + getRouteColor(i) + '; color:#e0e0e0; "></div>' + '<div style="min-width:24px; display:inline-block; font-size:14px; color:#404040; text-align:right;"><b>' + (i+1) + '.</b></div>';

            let lengthM = 0;
            for (let s = 0; s < routesShown[i].response.results.length; s++) {
                lengthM += routesShown[i].response.results[s].length;
            }
            let length = lengthM / 1000;
            if (options.useMiles) length /= KM_PER_MILE;
            let lengthText = length.toFixed(2);

            let time = options.liveTraffic ? routesShown[i].response.totalRouteTime : routesShown[i].response.totalRouteTimeWithoutRealtime;
            let timeText = getTimeText(time);

            html += '<div style="min-width:57px; display:inline-block; font-size:14px; text-align:right;">' + lengthText + '</div>' + '<span style="color:#404040;"> ' + lengthUnit + '</span>';
            html += '<div style="min-width:75px; display:inline-block; font-size:14px; text-align:right;"><b>' + timeText + '</b></div>';

            let avgSpeed = getSpeed(lengthM, time);
            html += '<div style="min-width:48px; display:inline-block; font-size:14px; text-align:right;" >' + avgSpeed.toFixed(1) + '</div><span style="color:#404040;"> ' + speedUnit + '</span>';

            if (options.extraInfo) {
                let total_penalty = 0;
                for (let s = 0; s < routesShown[i].response.results.length; s++) {
                    total_penalty += routesShown[i].response.results[s].penalty;
                }
                let traffic_plus_penalty = (options.liveTraffic ? routesShown[i].response.totalRouteTime : routesShown[i].response.totalRouteTimeWithoutRealtime) + total_penalty;
                let freeflow_plus_penalty = routesShown[i].response.totalRouteTimeFreeFlow + total_penalty;

                html += '<br><div style="display:inline-block;">' + getTimeText(total_penalty) + '</div><span style="color:#404040;"> P</span>';
                html += '<div style="min-width:55px; display:inline-block; text-align:right;">' + getTimeText(freeflow_plus_penalty) + '</div><span style="color:#404040;"> FP</span>';
                html += '<div style="min-width:55px; display:inline-block; text-align:right;">' + getTimeText(traffic_plus_penalty) + '</div><span style="color:#404040;"> TP</span>';
                html += '<div style="min-width:49px; display:inline-block; text-align:right;">' + routesShown[i].response.astarVisited + '</div><span style="color:#404040;"> V</span>';
            }

            if (options.showRouteText) {
                let maxWidth = options.useMiles ? 277 : 270;
                let laneTypes = [];
                if (routesShown[i].response.routeAttr.includes('Toll')) laneTypes.push('Toll');
                laneTypes.push(...routesShown[i].response.laneTypes);
                let separator = '';
                if (routesShown[i].response.minPassengers) separator += " (" + routesShown[i].response.minPassengers + "+)";
                if (laneTypes.length) separator += ': ';
                html += '<div style="max-width:' + maxWidth + 'px; white-space:normal; line-height:normal; font-variant-numeric:normal;">' + laneTypes.join(', ') + separator + routesShown[i].response.routeName + '</div>';
            }

            routeDiv.innerHTML = html;
            routeDiv.style.visibility = 'visible';
        }

        summaryDiv.style.visibility = 'visible';
    }
    //--------------------------------------------------------------------------------------------------------
    function handleRouteRequestError(message) {
        console.log("WME Route Speeds: route request error: " + message.replace("<br>", "\n"));

        getId('routespeeds-button-livemap').style.backgroundColor = '';
        getId('routespeeds-button-reverse').style.backgroundColor = '';

        getId('routespeeds-summaries').style.visibility = 'hidden';
        getId('routespeeds-summaries').innerHTML = '';

        routesReceived = [];
        sortRoutes();

        getId('routespeeds-error').innerHTML = "<br>" + message;
        getId('routespeeds-routecount').innerHTML = '';
    }
    //--------------------------------------------------------------------------------------------------------
    function livemapRouteClick() {
        routeSelected = 0;
        routeSelectedLast = -1;

        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function get_coords_from_livemap_link(link) {
        let lon1 = '';
        let lat1 = '';
        let lon2 = '';
        let lat2 = '';

        let opt = link.split('&');
        for (let i = 0; i < opt.length; i++) {
            let o = opt[i];

            if (o.indexOf('from_lon=') === 0) lon1 = o.substring(9, 30);
            if (o.indexOf('from_lat=') === 0) lat1 = ', ' + o.substring(9, 30);
            if (o.indexOf('to_lon=') === 0) lon2 = o.substring(7, 30);
            if (o.indexOf('to_lat=') === 0) lat2 = ', ' + o.substring(7, 30);
        }

        getId('sidepanel-routespeeds-a').value = lon1 + lat1;
        getId('sidepanel-routespeeds-b').value = lon2 + lat2;
    }
    //--------------------------------------------------------------------------------------------------------
    function livemapRoute() {

        if (!options.enableScript) return;
        if (routewait) return;

        let stra = getId('sidepanel-routespeeds-a').value;
        let strb = getId('sidepanel-routespeeds-b').value;

        let pastedlink = false;

        //sprawdzenie czy wklejono link z LiveMap, jeżeli tak to sparsowanie i przeformatowanie współrzędnych oraz przeniesienie widoku mapy na miejsce wklejonej trasy
        //(checking if the link from LiveMap has been pasted, if yes, paring and reformatting the coordinates and moving the map view to the location of the pasted route)
        if (stra.indexOf('livemap?') >= 0 || stra.indexOf('livemap/?') >= 0) {
            get_coords_from_livemap_link(stra);
            stra = getId('sidepanel-routespeeds-a').value;
            strb = getId('sidepanel-routespeeds-b').value;
            pastedlink = true;
        }
        else if (strb.indexOf('livemap?') >= 0 || strb.indexOf('livemap/?') >= 0) {
            get_coords_from_livemap_link(strb);
            stra = getId('sidepanel-routespeeds-a').value;
            strb = getId('sidepanel-routespeeds-b').value;
            pastedlink = true;
        }

        stra = getId('sidepanel-routespeeds-a').value;
        strb = getId('sidepanel-routespeeds-b').value;
        if (stra === "") return;
        if (strb === "") return;

        let p1 = stra.split(",");
        let p2 = strb.split(",");

        if (p1.length < 2) return;
        if (p2.length < 2) return;

        let x1 = p1[0].trim();
        let y1 = p1[1].trim();
        let x2 = p2[0].trim();
        let y2 = p2[1].trim();

        x1 = parseFloat(x1);
        y1 = parseFloat(y1);
        x2 = parseFloat(x2);
        y2 = parseFloat(y2);

        if (isNaN(x1)) return;
        if (isNaN(y1)) return;
        if (isNaN(x2)) return;
        if (isNaN(y2)) return;

        if (x1 < -180 || x1 > 180) x1 = 0;
        if (x2 < -180 || x2 > 180) x2 = 0;
        if (y1 < -90 || y1 > 90) y1 = 0;
        if (y2 < -90 || y2 > 90) y2 = 0;

        let objprog1 = getId('routespeeds-button-livemap');
        objprog1.style.backgroundColor = '#FF8000';

        createMarkers(x1, y1, x2, y2, true);

        if (pastedlink) {
            clickA();
        }

        requestRouteFromLiveMap(x1, y1, x2, y2);
    }
    //--------------------------------------------------------------------------------------------------------
    function reverseRoute() {

        if (!options.enableScript) return;
        if (routewait) return;

        let stra = getId('sidepanel-routespeeds-b').value;
        let strb = getId('sidepanel-routespeeds-a').value;
        if (stra === "") return;
        if (strb === "") return;

        getId('sidepanel-routespeeds-a').value = stra;
        getId('sidepanel-routespeeds-b').value = strb;

        let p1 = stra.split(",");
        let p2 = strb.split(",");

        if (p1.length < 2) return;
        if (p2.length < 2) return;

        let x1 = p1[0].trim();
        let y1 = p1[1].trim();
        let x2 = p2[0].trim();
        let y2 = p2[1].trim();

        x1 = parseFloat(x1);
        y1 = parseFloat(y1);
        x2 = parseFloat(x2);
        y2 = parseFloat(y2);

        if (isNaN(x1)) return;
        if (isNaN(y1)) return;
        if (isNaN(x2)) return;
        if (isNaN(y2)) return;

        if (x1 < -180 || x1 > 180) x1 = 0;
        if (x2 < -180 || x2 > 180) x2 = 0;
        if (y1 < -90 || y1 > 90) y1 = 0;
        if (y2 < -90 || y2 > 90) y2 = 0;

        let objprog2 = getId('routespeeds-button-reverse');
        objprog2.style.backgroundColor = '#FF8000';

        createMarkers(x1, y1, x2, y2, true);

        requestRouteFromLiveMap(x1, y1, x2, y2);
    }
    //--------------------------------------------------------------------------------------------------------
    function resetOptions() {

        getId('routespeeds-getalternatives').checked = options.getAlternatives = true;
        getId('routespeeds-maxroutes').value = options.maxRoutes = 3;

        getId('routespeeds-livetraffic').checked = options.liveTraffic = false;

        getId('routespeeds-routetype').value = options.routeType = 1;

        getId('routespeeds-avoidtolls').checked = options.avoidTolls = false;
        getId('routespeeds-avoidfreeways').checked = options.avoidFreeways = false;
        getId('routespeeds-avoidunpaved').checked = options.avoidUnpaved = true;
        getId('routespeeds-avoidlongunpaved').checked = options.avoidLongUnpaved = false;
        getId('routespeeds-allowuturns').checked = options.allowUTurns = true;
        getId('routespeeds-routingorder').checked = options.routingOrder = true;
        getId('routespeeds-userbs').checked = options.useRBS = false;
        getId('routespeeds-avoiddifficult').checked = options.avoidDifficult = false;
        getId('routespeeds-avoidferries').checked = options.avoidFerries = false;
        getId('routespeeds-vehicletype').value = options.vehicleType = 'PRIVATE';
        getId('routespeeds-extrainfo').checked = options.extraInfo = false;
        getId('routespeeds-includecrosstime').checked = options.includeCrossTime = true;
        getId('routespeeds-includepenalty').checked = options.includePenalty = false;
        getId('routespeeds-freeflow').checked = options.freeFlow = false;
    }
    //--------------------------------------------------------------------------------------------------------
    function resetOptionsToLivemapRouteClick() {
        if (routewait) return;

        resetOptions();

        $(`.routespeeds-pass-checkbox`).prop( "checked", false );;
        options.passes = [];

        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function hourChange() {

        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function dayChange() {

        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickA() { gotoMarker(markerA); }
    function clickB() { gotoMarker(markerB); }
    //--------------------------------------------------------------------------------------------------------
    function gotoMarker(marker) {

        if (!options.enableScript || marker === undefined || !marker.created) return;

        let pt = marker.lonlat;
        let zoom = W.map.getZoom();

        W.map.getOLMap().setCenter([pt.lon, pt.lat], zoom);
    }
    //--------------------------------------------------------------------------------------------------------
    function clickEnableScript() {
        var WM = W.map;

        options.enableScript = (getId('routespeeds-enablescript').checked === true);

        if (!options.enableScript) {
            getId('sidepanel-routespeeds').style.color = "#A0A0A0";

            getId('routespeeds-summaries').style.visibility = 'hidden';

            let rlayers = WM.getLayersBy("uniqueName", "__DrawRouteSpeedsLines");
            let routeLayer = rlayers[0];
            if (routeLayer !== undefined) routeLayer.removeAllFeatures();

            showMarkers(false);
            reorderLayers(0);
        }
        else {
            getId('sidepanel-routespeeds').style.color = "";

            if (showMarkers(true)) drawRoutes();
            reorderLayers(1);
        }
    }
    //--------------------------------------------------------------------------------------------------------
    function clickShowLabels() {
        options.showLabels = (getId('routespeeds-showLabels').checked === true);
        drawRoutes();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickShowSpeeds() {
        options.showSpeeds = (getId('routespeeds-showSpeeds').checked === true);
        drawRoutes();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickUseMiles() {
        options.useMiles = (getId('routespeeds-usemiles').checked === true);
        createSummaries();
        drawRoutes();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickShowRouteText() {
        options.showRouteText = (getId('routespeeds-routetext').checked === true);
        createSummaries();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickGetAlternatives() {
        routeSelected = 0;
        routeSelectedLast = -1;

        options.getAlternatives = (getId('routespeeds-getalternatives').checked === true);
        if (options.getAlternatives && routesReceived.length < options.maxRoutes) {
            livemapRoute();
        } else {
            sortRoutes();
        }
    }
    //--------------------------------------------------------------------------------------------------------
    function clickMaxRoutes() {
        options.getAlternatives = (getId('routespeeds-getalternatives').checked === true);

        options.maxRoutes = parseInt(getId('routespeeds-maxroutes').value);
        if (options.getAlternatives && routesReceived.length < options.maxRoutes) {
            livemapRoute();
        } else {
            sortRoutes();
        }
    }
    //--------------------------------------------------------------------------------------------------------
    function clickLiveTraffic() {
        options.liveTraffic = (getId('routespeeds-livetraffic').checked === true);
        sortRoutes();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickAvoidTolls() {
        options.avoidTolls = (getId('routespeeds-avoidtolls').checked === true);
        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickAvoidFreeways() {
        options.avoidFreeways = (getId('routespeeds-avoidfreeways').checked === true);
        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickAvoidUnpaved() {
        options.avoidUnpaved = (getId('routespeeds-avoidunpaved').checked === true);

        options.avoidLongUnpaved = false;
        getId('routespeeds-avoidlongunpaved').checked = false;

        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickAvoidLongUnpaved() {
        options.avoidLongUnpaved = (getId('routespeeds-avoidlongunpaved').checked === true);

        options.avoidUnpaved = false;
        getId('routespeeds-avoidunpaved').checked = false;

        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickRouteType() {
        options.routeType = parseInt(getId('routespeeds-routetype').value);
        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickAllowUTurns() {
        options.allowUTurns = (getId('routespeeds-allowuturns').checked === true);
        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickRoutingOrder() {
        options.routingOrder = (getId('routespeeds-routingorder').checked === true);
        sortRoutes();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickUseRBS() {
        options.useRBS = (getId('routespeeds-userbs').checked === true);
        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickAvoidDifficult() {
        options.avoidDifficult = (getId('routespeeds-avoiddifficult').checked === true);
        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickAvoidFerries() {
        options.avoidFerries = (getId('routespeeds-avoidferries').checked === true);
        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickVehicleType() {
        options.vehicleType = (getId('routespeeds-vehicletype').value);
        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickExtraInfo() {
        options.extraInfo = (getId('routespeeds-extrainfo').checked === true);
        sortRoutes();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickCrossTime() {
        options.includeCrossTime = (getId('routespeeds-includecrosstime').checked === true);
        sortRoutes();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickPenalty() {
        options.includePenalty = (getId('routespeeds-includepenalty').checked === true);
        sortRoutes();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickFreeFlow() {
        options.freeFlow = (getId('routespeeds-freeflow').checked === true);
        sortRoutes();
    }
    //--------------------------------------------------------------------------------------------------------
    function clickPassOption() {
        let passKey = $(this).data('pass-key');
        if (this.checked) {
            options.passes.push(passKey);
        } else {
            options.passes = options.passes.filter(key => key !== passKey)
        }
        updatePassesLabel();
        livemapRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function toggleRoute(routeNo) {
        if (routeSelected === routeNo) routeNo = -1;
        routeSelectedLast = routeSelected = routeNo;
        switchRoute();
    }
    //--------------------------------------------------------------------------------------------------------
    function switchRoute() {
        for (let i = 0; i < routesShown.length; i++) {
            let summary = getId('routespeeds-summary-' + i);
            summary.className = (routeSelected == i) ? 'routespeeds_summary_classB' : 'routespeeds_summary_classA';
        }

        let rlayers = W.map.getLayersBy("uniqueName", "__DrawRouteSpeedsLines");
        let routeLayer = rlayers[0];
        if (routeLayer === undefined) return;

        for (let name of SCRIPT_LAYERS_TO_COVER) {
            let layer = W.map.getLayerByName(name);
            if (layer === undefined) continue;
            baseZIndex = Math.max(baseZIndex, layer.getZIndex());
        }
        if (routeLayer.getZIndex() < baseZIndex) {
            routeLayer.setZIndex(baseZIndex + 1);
        } else {
            baseZIndex = routeLayer.getZIndex();
        }
        reorderLayers(1);

        drawRoutes();
    }
    //--------------------------------------------------------------------------------------------------------
    function reorderLayers(mode) {
        if (baseZIndex == 0) return;
        for (let i = 0; i < WME_LAYERS_TO_MOVE.length; i++) {
            if (layersMoved[i] === undefined) {
                let layer = W.map.getLayersBy("name", WME_LAYERS_TO_MOVE[i])[0];
                if (layer === undefined) continue;
                layersMoved[i] = layer;
                originalZIndexes[i] = layer.getZIndex();
            }
            if (mode) {
                layersMoved[i].setZIndex(baseZIndex - WME_LAYERS_TO_MOVE.length + i);
            } else {
                layersMoved[i].setZIndex(originalZIndexes[i]);
            }
            layersMoved[i].redraw();
        }
    }
    //--------------------------------------------------------------------------------------------------------
    function drawRoutes() {

        var routeLayer = W.map.getLayersBy("uniqueName", "__DrawRouteSpeedsLines")[0];
        if (routeLayer !== undefined) routeLayer.removeAllFeatures();

        for (let i = routesShown.length - 1; i >= 0; i--) {
            if (i == routeSelected) continue;
            createRouteFeatures(i, routesShown[i].coords, routesShown[i].response.results)
        }
        if (routeSelected != -1 && routesShown.length) {
            createRouteFeatures(routeSelected, routesShown[routeSelected].coords, routesShown[routeSelected].response.results)
        }
    }
    //--------------------------------------------------------------------------------------------------------
    function enterAB(ev) {
        if (ev.keyCode === 13) {
            livemapRoute();
        }
    }
    //--------------------------------------------------------------------------------------------------------
    function getCheckboxHtml(idSuffix, text, title, divCss = {}, labelCss = {}) {
        let id = 'routespeeds-' + idSuffix;
        return $('<div>', { class: 'controls-container' }).append(
            $('<input>', { id: id, type: 'checkbox' }),
            $('<label>', { for: id, title: title }).text(text).css(labelCss)
        ).css(divCss)[0].outerHTML;
    }
    //--------------------------------------------------------------------------------------------------------
    async function initialiseWMERouteSpeeds() {
        var line_div_break = '<br>';
        line_div_break += '</div>';
        line_div_break += '<div style="margin-left:55px">';

        if (W.loginManager !== null && W.loginManager.user) {
            var user = W.loginManager.user;
            //console.log(user);

            //wlodek76: I prefer more condensed lines for avoid options, so I've added a personal switch here
            if (user !== null) {
                if (user.userName === "wlodek76" && user.id === 203457007) {
                    line_div_break = '';
                }
            }
        }

        epsg900913 = new OpenLayers.Projection("EPSG:900913");
        epsg4326 = new OpenLayers.Projection("EPSG:4326");

        var addon = document.createElement('section');
        addon.id = "routespeeds-addon";
        addon.innerHTML = '' +
            '<div id="sidepanel-routespeeds" style="margin: 0px 8px; width: auto;">' +
            '<div style="margin-bottom:4px; padding:0px;"><a href="https://greasyfork.org/en/scripts/369630-wme-route-speeds-mapomatic-fork" target="_blank">' +
            '<span style="font-weight:bold; text-decoration:underline">WME Route Speeds xi</span></a><span style="margin-left:6px; color:#888; font-size:11px;">v' + wmech_version + '</span>' +
            '</div>' +
            '<style>\n' +
            '#sidepanel-routespeeds select { margin-left:20px; font-size:12px; height:22px; border:1px solid; border-color:rgb(169, 169, 169); border-radius:4px; border: 1px solid; border-color: rgb(169, 169, 169); -webkit-border-radius:4px; -moz-border-radius:4px; }\n' +
            '#sidepanel-routespeeds select, #sidepanel-routespeeds input { margin-top:2px; margin-bottom:2px; width:initial; }\n' +
            '#sidepanel-routespeeds input[type="checkbox"] { margin-bottom:0px; }\n' +
            '#sidepanel-routespeeds label ~ label, #sidepanel-routespeeds span label { margin-left:20px; }\n' +
            '#sidepanel-routespeeds .controls-container { padding:0px; }\n' +
            '#sidepanel-routespeeds label { font-weight:normal; }\n' +
            '</style>' +
            '<div style="float:left; display:inline-block;">' +
            '<a id="routespeeds-button-A" onclick="return false;" style="cursor:pointer; width:20px; display:inline-block; vertical-align:middle;" title="Center map on A marker">A:</a>' +
            '<input id="sidepanel-routespeeds-a" class="form-control" style="width:165px; padding:6px; margin:0px; display:inline; height:24px" type="text" name=""/>' +
            '<br><div style="height: 4px;"></div>' +
            '<a id="routespeeds-button-B" onclick="return false;" style="cursor:pointer; width:20px; display:inline-block; vertical-align:middle;" title="Center map on B marker">B:</a>' +
            '<input id="sidepanel-routespeeds-b" class="form-control" style="width:165px; padding:6px; margin:0px; display:inline; height:24px" type="text" name=""/>' +
            '</div>' +
            '<div style="float:right; padding-right:20px; padding-top:6%; ">' +
            '<button id=routespeeds-button-reverse class="waze-btn waze-btn-blue waze-btn-smaller" style="padding-left:15px; padding-right:15px;" title="Calculate reverse route" >A &#8596; B</button></div>' +
            '<div style="clear:both; "></div>' +

            '<div style="margin-top:8px;">' +
            '<select id=routespeeds-hour>' +
            '<option value="now">Now</option>' +
            '<option value="0"  >00:00</option>' +
            '<option value="30" >00:30</option>' +
            '<option value="60" >01:00</option>' +
            '<option value="90" >01:30</option>' +
            '<option value="120">02:00</option>' +
            '<option value="150">02:30</option>' +
            '<option value="180">03:00</option>' +
            '<option value="210">03:30</option>' +
            '<option value="240">04:00</option>' +
            '<option value="270">04:30</option>' +
            '<option value="300">05:00</option>' +
            '<option value="330">05:30</option>' +
            '<option value="360">06:00</option>' +
            '<option value="390">06:30</option>' +
            '<option value="420">07:00</option>' +
            '<option value="450">07:30</option>' +
            '<option value="480">08:00</option>' +
            '<option value="510">08:30</option>' +
            '<option value="540">09:00</option>' +
            '<option value="570">09:30</option>' +
            '<option value="600">10:00</option>' +
            '<option value="630">10:30</option>' +
            '<option value="660">11:00</option>' +
            '<option value="690">11:30</option>' +
            '<option value="720">12:00</option>' +
            '<option value="750">12:30</option>' +
            '<option value="780">13:00</option>' +
            '<option value="810">13:30</option>' +
            '<option value="840">14:00</option>' +
            '<option value="870">14:30</option>' +
            '<option value="900">15:00</option>' +
            '<option value="930">15:30</option>' +
            '<option value="960">16:00</option>' +
            '<option value="990">16:30</option>' +
            '<option value="1020">17:00</option>' +
            '<option value="1050">17:30</option>' +
            '<option value="1080">18:00</option>' +
            '<option value="1110">18:30</option>' +
            '<option value="1140">19:00</option>' +
            '<option value="1170">19:30</option>' +
            '<option value="1200">20:00</option>' +
            '<option value="1230">20:30</option>' +
            '<option value="1260">21:00</option>' +
            '<option value="1290">21:30</option>' +
            '<option value="1320">22:00</option>' +
            '<option value="1350">22:30</option>' +
            '<option value="1380">23:00</option>' +
            '<option value="1410">23:30</option>' +
            '</select>' +
            '<select id=routespeeds-day style="margin-left:5px;" >' +
            '<option value="today">Today</option>' +
            '<option value="1">Monday</option>' +
            '<option value="2">Tuesday</option>' +
            '<option value="3">Wednesday</option>' +
            '<option value="4">Thursday</option>' +
            '<option value="5">Friday</option>' +
            '<option value="6">Saturday</option>' +
            '<option value="0">Sunday</option>' +
            '</select>' +
            '</div>' +

            '<div style="padding-top:8px; padding-bottom:6px;">' +
            '<button id=routespeeds-button-livemap class="waze-btn waze-btn-blue waze-btn-smaller" style="width:100%;">Calculate Route</button>' +
            '</div>' +
            '<b><div id=routespeeds-error style="color:#FF0000"></div></b>' +
            '<div id=routespeeds-routecount></div>' +

            '<div id=routespeeds-summaries style="font-size:11px; font-variant-numeric:tabular-nums;"></div>' +

            '<div style="margin-bottom:4px;">' +
            '<b>Options:</b>' +
            '<a id="routespeeds-reset-options-to-livemap-route" onclick="return false;" style="cursor:pointer; float:right; margin-right:20px;" title="Reset routing options to the Livemap Route equivalents">Reset to Livemap Route</a>' +
            '</div>' +

            getCheckboxHtml('enablescript', 'Enable script') +
            getCheckboxHtml('showLabels', 'Show segment labels') +
            '<div id="routespeeds-crosstime-span" style="display:inline;">' +
            getCheckboxHtml('includecrosstime', 'Include cross time', '', { marginLeft: '10px' }) +
            '</div>' +
            '<div id="routespeeds-penalty-span" style="display:inline;">' +
            getCheckboxHtml('includepenalty', 'Include penalties', '', { marginLeft: '10px' }) +
            '</div>' +
            getCheckboxHtml('freeflow', 'Use free flow speed') +
            getCheckboxHtml('livetraffic', 'Use real-time traffic', 'Note: this only seems to affect routes within the last 30-60 minutes, up to Now') +
            getCheckboxHtml('showSpeeds', 'Show speed on labels') +
            getCheckboxHtml('usemiles', 'Use miles and mph') +
            getCheckboxHtml('extrainfo', 'Show extra routing information') +
            getCheckboxHtml('routetext', 'Show route descriptions') +

            '<div>' +
            getCheckboxHtml('getalternatives', 'Alternative routes: show', '', { display: 'inline-block' }) +
            '<select id=routespeeds-maxroutes style="margin-left:-4px; display:inline-block;" >' +
            '<option id=routespeeds-maxroutes value="1">1</option>' +
            '<option id=routespeeds-maxroutes value="2">2</option>' +
            '<option id=routespeeds-maxroutes value="3">3</option>' +
            '<option id=routespeeds-maxroutes value="4">4</option>' +
            '<option id=routespeeds-maxroutes value="5">5</option>' +
            '<option id=routespeeds-maxroutes value="6">6</option>' +
            '<option id=routespeeds-maxroutes value="8">8</option>' +
            '<option id=routespeeds-maxroutes value="10">10</option>' +
            '<option id=routespeeds-maxroutes value="12">12</option>' +
            '<option id=routespeeds-maxroutes value="15">15</option>' +
            '<option id=routespeeds-maxroutes value="40">all</option>' +

            '</select>' +
            '</div>' +

            getCheckboxHtml('routingorder', 'Use Routing Order', 'Sorts routes in the same order they would appear in the app or livemap') +

            getCheckboxHtml('userbs', 'Use Routing Beta Server (RBS)', '', { display: window.location.hostname.includes('beta') ? 'inline' : 'none' }) +

            '<div>' +
            '<label class="" style="display:inline-block;">' +
            'Route type:<select id=routespeeds-routetype style="margin-left:10px;" >' +
            '<option value="1">Fastest</option>' +
            '<option value="3">Fastest (no history)</option>' +
            '</select>' +
            '<br>' +
            'Vehicle type:<select id=routespeeds-vehicletype style="margin-left:10px;" >' +
            '<option id=routespeeds-vehicletype value="PRIVATE">Private</option>' +
            '<option id=routespeeds-vehicletype value="TAXI">Taxi</option>' +
            '<option id=routespeeds-vehicletype value="MOTORCYCLE">Motorcycle</option>' +
            '</select>' +
            '</div>' +

            '<table><tbody><tr><td style="vertical-align:top; padding-right:4px;"><b>Avoid:</b></td><td>' +
            getCheckboxHtml('avoidtolls', 'Tolls') +
            getCheckboxHtml('avoidfreeways', 'Freeways') +
            getCheckboxHtml('avoiddifficult', 'Difficult turns') +
            getCheckboxHtml('avoidferries', 'Ferries') +
            getCheckboxHtml('avoidunpaved', 'Unpaved') +
            '<div id="routespeeds-avoidunpaved-span" style="display:inline;">' +
            getCheckboxHtml('avoidlongunpaved', 'Long unpaved roads', '', { marginLeft: '10px' }) +
            '</div>' +
            '</td></tr></tbody></table>' +

            '<table style="margin-top:3px;"><tbody><tr><td style="vertical-align:top; padding-right:4px;"><b>Allow:</b></td><td>' +
            getCheckboxHtml('allowuturns', 'U-Turns') +
            '</td></tr></tbody></table>' +
            '<div id="routespeeds-passes-container"></div>' +
            '<style>' +
            '.routespeedsmarkerA                  { display:block; width:27px; height:36px; margin-left:-13px; margin-top:-34px; }' +
            '.routespeedsmarkerB                  { display:block; width:27px; height:36px; margin-left:-13px; margin-top:-34px; }' +
            //+ '.routespeedsmarkerA                  { background:url("http://341444cc-a-62cb3a1a-s-sites.googlegroups.com/site/wazeaddons/routespeeds_marker_a.png"); }'
            //+ '.routespeedsmarkerB                  { background:url("http://341444cc-a-62cb3a1a-s-sites.googlegroups.com/site/wazeaddons/routespeeds_marker_b.png"); }'
            '.routespeedsmarkerA                  { background-image:url(data:image/png;base64,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); }' +
            '.routespeedsmarkerB                  { background-image:url(data:image/png;base64,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); }' +
            '.routespeedsmarkerA:hover            { cursor:move }' +
            '.routespeedsmarkerB:hover            { cursor:move }' +
            '.routespeeds_summary_classA          { visibility:hidden; display:inline-block; color:#000000; margin:2px 0px 2px 0px; padding:2px 6px 2px 4px; border:1px solid #c0c0c0; background:#F8F8F8; border-radius:4px; vertical-align:middle; white-space:nowrap; }' +
            '.routespeeds_summary_classB          { visibility:hidden; display:inline-block; color:#000000; margin:2px 0px 2px 0px; padding:2px 6px 2px 4px; border:1px solid #c0c0c0; background:#d0fffe; border-radius:4px; vertical-align:middle; white-space:nowrap; }' +
            '.routespeeds_summary_classA:hover    { cursor:pointer; border:1px solid #808080; xbackground:#a0fffd; }' +
            '.routespeeds_summary_classB:hover    { cursor:pointer; border:1px solid #808080; xbackground:#a0fffd; }' +
            '.routespeeds_header                  { display:inline-block; width:14px; height:14px; text-align:center; border-radius:2px; margin-right:2px; position:relative; top:2px; }' +
            '</style>' +
            '</div>';

        /*var userTabs = getId('user-info');
	var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
	var tabContent = getElementsByClassName('tab-content', userTabs)[0];

	newtab = document.createElement('li');
	newtab.innerHTML = '<a id=sidepanel-routespeeds href="#sidepanel-routespeeds" data-toggle="tab" style="" >Route Speeds</a>';
	navTabs.appendChild(newtab);

	addon.id = "sidepanel-routespeeds";
	addon.className = "tab-pane";
	tabContent.appendChild(addon);*/

        $('head').append([
            '<style>',
            'label[for^="routespeeds-"] { margin-right: 10px;padding-left: 19px; }',
            '.hidden { display:none; }',
            '</style>'
        ].join('\n'));

        WazeWrap.Interface.Tab('Route Speeds', addon.innerHTML, init, '<span id="routespeeds-tab-label">Route Speeds</span>');

        window.addEventListener("beforeunload", saveRouteSpeedsOptions, true);
    }

    let _lastTopCountryId;
    function buildPassesDiv() {
        $('#routespeeds-passes-container').empty();
        let passesObj = W.model.getTopCountry().attributes.restrictionSubscriptions;
        if (passesObj) {
            countryPassList = Object.keys(passesObj).map(key => { return { key: key, name: passesObj[key] } }).sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                } else if (a.name < b.name) {
                    return -1;
                }
                return 0;
            });
        } else {
            countryPassList = [];
        }

        if (countryPassList.length) {
            $('#routespeeds-passes-container').append(
                '<fieldset style="border:1px solid silver;padding:8px;border-radius:4px;-webkit-padding-before: 0;">' +
                '  <legend id="routespeeds-passes-legend" style="margin-bottom:0px;border-bottom-style:none;width:auto;">' +
                '    <i class="fa fa-fw fa-chevron-down" style="cursor: pointer;font-size: 12px;margin-right: 4px"></i>' +
                '    <span id="routespeeds-passes-label" style="font-size:14px;font-weight:600; cursor: pointer">Passes & Permits</span>' +
                '  </legend>' +
                '  <div id="routespeeds-passes-internal-container" style="padding-top:0px;">' +
                countryPassList.map((pass, i) => {
                    //let id = 'routespeeds-pass-' + pass.key;
                    return '    <div class="controls-container" style="padding-top:2px;display:block;">' +
                        '      <input id="routespeeds-pass-' + i + '" type="checkbox" class="routespeeds-pass-checkbox" data-pass-key = "' + pass.key + '">' +
                        '      <label for="routespeeds-pass-' + i + '" style="white-space:pre-line">' + pass.name + '</label>' +
                        '    </div>';
                }).join(' ') +
                '  </div>' +
                '</fieldset>'
            );

            $('.routespeeds-pass-checkbox').click(clickPassOption);

            $('#routespeeds-passes-legend').click(function () {
                let $this = $(this);
                let $chevron = $($this.children()[0]);
                $chevron
                    .toggleClass('fa fa-fw fa-chevron-down')
                    .toggleClass('fa fa-fw fa-chevron-right');
                let collapse = $chevron.hasClass('fa-chevron-right');
                let checkboxDivs = $('input.routespeeds-pass-checkbox:not(:checked)').parent();
                if (collapse) {
                    checkboxDivs.css('display', 'none');
                } else {
                    checkboxDivs.css('display', 'block');
                }
                // $($this.children()[0])
                // 	.toggleClass('fa fa-fw fa-chevron-down')
                // 	.toggleClass('fa fa-fw fa-chevron-right');
                // $($this.siblings()[0]).toggleClass('collapse');
            })

            $('.routespeeds-pass-checkbox').each((i, elem) => {
                const $elem = $(elem);
                const passKey = $elem.data('pass-key');
                $elem.prop('checked', options.passes.includes(passKey));
            });
            updatePassesLabel();
        }
    }


    function onModelMergeEnd() {
        // Detect when the "top" country changes and update the list of passes.
        try {
            const topCountry = W.model.getTopCountry();
            if (topCountry && topCountry.attributes.id !== _lastTopCountryId) {
                _lastTopCountryId = topCountry.attributes.id;
                buildPassesDiv();
            }
        } catch (ex) {
            console.error('WME Route Speeds error: ', ex);
        }
    }

    function init() {
        resetOptions();
        loadRouteSpeedsOptions();

        if (!options.enableScript) getId('sidepanel-routespeeds').style.color = "#A0A0A0";
        else getId('sidepanel-routespeeds').style.color = "";

        getId('routespeeds-maxroutes').value = options.maxRoutes;
        getId('routespeeds-routetype').value = options.routeType;
        getId('routespeeds-vehicletype').value = options.vehicleType;
        getId('routespeeds-userbs').onclick = clickUseRBS;

        getId('routespeeds-enablescript').onclick = clickEnableScript;
        getId('routespeeds-showLabels').onclick = clickShowLabels;
        getId('routespeeds-showSpeeds').onclick = clickShowSpeeds;
        getId('routespeeds-usemiles').onclick = clickUseMiles;
        getId('routespeeds-routetext').onclick = clickShowRouteText;
        getId('routespeeds-getalternatives').onclick = clickGetAlternatives;
        getId('routespeeds-maxroutes').onchange = clickMaxRoutes;
        getId('routespeeds-livetraffic').onclick = clickLiveTraffic;
        getId('routespeeds-avoidtolls').onclick = clickAvoidTolls;
        getId('routespeeds-avoidfreeways').onclick = clickAvoidFreeways;
        getId('routespeeds-avoidunpaved').onclick = clickAvoidUnpaved;
        getId('routespeeds-avoidlongunpaved').onclick = clickAvoidLongUnpaved;
        getId('routespeeds-routetype').onchange = clickRouteType;
        getId('routespeeds-allowuturns').onclick = clickAllowUTurns;
        getId('routespeeds-routingorder').onclick = clickRoutingOrder;
        getId('routespeeds-avoiddifficult').onclick = clickAvoidDifficult;
        getId('routespeeds-avoidferries').onclick = clickAvoidFerries;
        getId('routespeeds-vehicletype').onchange = clickVehicleType;
        getId('routespeeds-extrainfo').onclick = clickExtraInfo;
        getId('routespeeds-includecrosstime').onclick = clickCrossTime;
        getId('routespeeds-includepenalty').onclick = clickPenalty;
        getId('routespeeds-freeflow').onclick = clickFreeFlow;

        getId('sidepanel-routespeeds-a').onkeydown = enterAB;
        getId('sidepanel-routespeeds-b').onkeydown = enterAB;

        getId('routespeeds-button-livemap').onclick = livemapRouteClick;
        getId('routespeeds-button-reverse').onclick = reverseRoute;
        getId('routespeeds-reset-options-to-livemap-route').onclick = resetOptionsToLivemapRouteClick;

        getId('routespeeds-hour').onchange = hourChange;
        getId('routespeeds-day').onchange = dayChange;

        getId('routespeeds-button-A').onclick = clickA;
        getId('routespeeds-button-B').onclick = clickB;

        const topCountry = W.model.getTopCountry();
        if (topCountry) {
            _lastTopCountryId = topCountry.attributes.id;
            buildPassesDiv();
        }

        //WazeWrap.Events.register('zoomend', null, drawRoutes);
        W.model.events.register('mergeend', null, onModelMergeEnd);

        window.setInterval(loopWMERouteSpeeds, 500);
        window.setInterval(panningWMERouteSpeeds, 100);
    }
    //--------------------------------------------------------------------------------------------------------------
    bootstrap();
})();
