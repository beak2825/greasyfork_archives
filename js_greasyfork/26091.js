// ==UserScript==
// @name         WME Route Speeds (MapOMatic fork)
// @description  Shows segment speeds in a route.
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @version      2025.11.24.0
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/en/scripts/369630-wme-route-speeds-mapomatic-fork
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js
// @author       wlodek76 (forked by MapOMatic)
// @copyright    2014, 2015 wlodek76
// @contributor  2014, 2015 FZ69617
// @connect      greasyfork.org
// @connect      waze.com
// @downloadURL https://update.greasyfork.org/scripts/369630/WME%20Route%20Speeds%20%28MapOMatic%20fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369630/WME%20Route%20Speeds%20%28MapOMatic%20fork%29.meta.js
// ==/UserScript==

/* global getWmeSdk, $, jQuery, WazeWrap, turf */
(function () {
    "use strict";

    //--------------------------------------------------------------------------
    // Constants and global variables

    const DOWNLOAD_URL = 'https://update.greasyfork.org/scripts/369630/WME%20Route%20Speeds%20%28MapOMatic%20fork%29.user.js';
    const SCRIPT_NAME = GM_info.script.name;
    const SCRIPT_VERSION = GM_info.script.version.toString();
    const SCRIPT_SHORT_NAME = "Route Speeds";
    const SCRIPT_ID = "routespeeds";

    const MARKER_LAYER_NAME = SCRIPT_SHORT_NAME + ": Markers";
    const MARKER_A_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAkCAYAAAB4+EEtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD/mlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjajZTPbxRlGMc/u/POrAk4B1MBi8GJP4CQQrZgkAZBd7vLtlDLZtti25iY7ezb3bHT2fGd2fIjPXHRG6h/gIocPJh4MsFfES7AQQMJQUNsSEw4lPgjRBIuhtTDTHcHaMX39Mzzfp/v9/s875OBzOdV33fTFsx6oaqU8tb4xKSVuUGaZ1hDN2uqduDnyuUhgKrvuzxy7v1MCuDa9pXv//OsqcnAhtQTQLMW2LOQOga6a/sqBOMWsOdo6IeQeRboUuMTk5DJAl31KC4AXVNRPA50qdFKP2RcwLQb1Rpk5oGeqUS+nogjDwB0laQnlWNblVLeKqvmtOPKhN3HXP/PM+u2lvU2AWuDmZFDwFZIHWuogUocf2JXiyPAi5C67If5CrAZUn+0ZsZywDZIPzWtDoxF+PSrJxqjbwLrIF1zwsHROH/Cmxo+HNWmz8w0D1VizGU76J8Enof0zYYcHIr8aNRkoQj0gLap0RqI+bWDwdxIcZnnRKN/OOLR1DvVg2WgG7T3VbNyOPKsnZFuqRLxaxf9sBx70BY9d3go4hSmDIojy/mwMToQ1YrdoRqNa8XktHNgMMbP+255KPImzqpWZSzGXK2qYiniEX9Lbyzm1DfUqoVDwA7Q93MkVUXSZAqJjcd9LCqUyGPho2gyjYNLCYmHROGknmQGZxVcGYmK4w6ijsRjEYWDvQomUrgdY5pivciKXSIr9oohsU/sEX1Y4jXxutgvCiIr+sTedm05oW9R53ab511aSCwqHCF/uru1taN3Ur3t2FdO3XmguvmIZ7nsJzkBAmbayO3J/i/Nf7ehw3FdnHvr2tpL8xx+3Hz1W/qifl2/pd/QFzoI/Vd9QV/Qb5DDxaWOZBaJg4ckSDhI9nABl5AqLr/h0UzgHlCc9k53d27sK6fuyPeG7w1zsqeTzf6S/TN7Pftp9mz294emvOKUtI+0r7Tvta+1b7QfsbTz2gXtB+2i9qX2beKtVt+P9tuTS3Qr8VactcQ18+ZG8wWzYD5nvmQOdfjM9WavOWBuMQvmxva7JfWSvThM4LanurJWhBvDw+EoEkVAFReP4w/tf1wtNoleMfjQ1u4Re0XbpVE0CkYOy9hm9Bm9xkEj1/FnbDEKRp+xxSg+sHX2Kh3IBCrZ53amkATMoHCYQ+ISIEN5LATob/rHlVNvhNbObPYVK+f7rrQGPXtHj1V1XUs59UYYWEoGUs3J2g7GJyat6Bd9t0IKSK270smFb8C+v0C72slNtuCLANa/3Mlt7YanP4Zzu+2Wmov/+anUTxBM79oZfa3Ng35zaenuZsh8CPc/WFr658zS0v3PQFuA8+6/WQBxeLnbzNAAAAAgY0hSTQAAbZgAAHOOAADyewAAhNoAAG6UAADlGgAAMycAABkXmUkcfwAABp1JREFUeNqsV11Mm9cZfj7bTYlHzK+BENlgbBlsL6wZFAkuQlBg/FXtRUdvyqTtopWouEHqBVVRtqzqZEC9qyzKDdwUOZSC1EijpUSMWjUZmubUtj40BTPbMcJQPnD4cQv54NmFYaMMHEj6SkdH3/nOOc953vOc9z1HwFOMpArAJQDpADQA1ABUAGQAcQAbAGIANgVBkJPNpUoC8iKArJWVFUMgELi2sLBwbXl52bC1tZUly/IFlUq1m5qaKuXl5QWLioo8RqPRQ3IBgCQIws6ZwEgqAFwKh8NXA4FAndfrveF2u0tcLlfW0tKS8nj/3Nzcverq6leqqqrmSktL/2Y0Gr8m6Ttgup/MZQqSWp/P94bD4bjb3Ny8DoBWq5W3bt2iy+ViJBIhSUYiEbpcLt6+fZtWq5UA2NzcvO5wOO76fL43SGoPFn4ikEAyy+v1vmm327/NycmR9Xo9nU4n90mGV8mvHpB9E+Qf7yTqrx4k2vdJOp1O6vV65uTkyHa7/Vuv1/smySySwklgl7xe72s9PT3faDSaverqasZiMS6tkR/dJW/eJg3vkJd+R+K3idrwTqL9o7vk4hoZi8VYXV1NjUaz19PT843X632N5KXjQC+sr69fGxwcvFNQUPCkoqKC8Xicf39INv2FzPpDAuC0kvn7RL+Zf5HxeJwVFRUsKCh4Mjg4eGd9ff0ayRcA4NCnacFg8Pr09PR1SZJUo6OjCEoX8adh4K//BKTN5MdjbSvR788jQFC6iNHRUUiSpJqenr4eDAavA0g7Cpbr9/tvjIyM5HZ2diI75wp6vwAmvjtFSJ+d3D7xHdD7BZCdcwWdnZ0YGRnJ9fv9NwDkAoCCpCoSieh9Pp8tHo8LbW1tmPQB/wgAe/s4l+3tJ8ZN+oC2tjbE43HB5/PZIpGInqRKAUAdCoWMoihmV1ZWIj0jE5NewBc+nZXQcjo7XxiY9ALpGZmorKyEKIrZoVDICECtAKBeWVm5Eg6HLxYXF+PxNhD6Hs9loe+Bx9tAcXExQqHQxZWVlSuHYMqdnR319va2QqvVYmsH2PghOSsgObuNH4CtHSAvLw/b29vK3d3dXwBQKQA8UavVG2lpaXI0GoVSASgVz8fscI7FxUVkZGTIKSkpGwB2VQC2L1++vGA2mzdnZ2fV6gtAakqSLPDZ08FSUwD1BWB2dhalpaUb+fn5AQDbCgA/FhYWzlut1ogoilhefAh99ukuPF5OAtdnA8uLDyGKIqxWa6SwsHAewI8KQRD2tFrtksVi8et0Orn/kz5UWwGb7tlcaNMBNb8E+j/pg06nky0Wi1+r1S4JgrB3uDurJSUl9+vq6laHhobwm1/t42UjIBwJoYfCOG5H2wUBeNkI1F7dx9DQEOrq6lZLSkruA1g9GkE29Xq9p7y8XIxGo/h8+FO8+yrQ8NL5WDW8BLz7KvD58KeIRqMoLy8X9Xq9B8Dmf8EEQdjTaDRhm83mampqemy322HTAV2vA02/BtLUyUHS1Il+Xa8n3Gi329HU1PTYZrO5NBpNWBCEvaPMAEAym83TNTU1flEUMTY2hqpioO9t4FYLcPMqYMj5n1JTUxLfN68m/ve9DVQVA2NjYxBFETU1NX6z2TwNQDotgeZPTEx8WFtbu1FWVsZDO5o8HV8mkqfjy58mz0MrKytjbW3txsTExIck85NdC14MhUK1vb29bgB0Op08jzmdTgJgb2+vOxQK1R5cmpJe3fKnpqY+aGxsjJlMJsqyfCYgWZZpMpnY2NgYm5qa+uAkVicFJslkMt1raGh4MD8/j/7+/jMpsb+/H/Pz82hoaHhgMpnunbpXJ7DLdbvd77W0tKxmZmZSkqSkrCRJYmZmJltaWlbdbvd7JHNPmve0kLteVFQ0VV9ff1+WZXZ1dSVdXFdXF2RZZn19/f2ioqIpAOvnOqAkM+bm5t5qb28PK5VKejyeE1l5PB4qlUq2t7eH5+bm3iKZce4YR1JJ0jI8PDxgsVh2Kioq/k8ssiyzsrKSFotlZ3h4eICkhaTymYIqSbUois3d3d0zAOhwOH4C5nA4CIDd3d0zc3Nzr5BUP1ciJJk3MzPz/nGxHBXFzMzM+yTznjbXWXLymsFguHdcLEdFYTAY7gFYw89hh2Lp6OgIKpVKDgwMUKlUsqOjI/jMoniaWMbHxz9ubW2Nms3m3dbW1uj4+PjH5xGFcB6xPHr0yBoIBGpjsZghPT3930ajcVKn04mCIMR/VrADwAsHz131wRM3JgjC7lnH/2cAaAhugF+X4J8AAAAASUVORK5CYII=";
    const MARKER_B_IMAGE = "data:image/png;base64,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";

    const ROUTE_LAYER_NAME = SCRIPT_SHORT_NAME + ": Routes";
    const ROUTE_COLORS = [
        '#4d4dcd', // route 1
        '#d34f8a', // route 2
        '#188984', // route 3
        '#c8fe0a', // route 4
        '#ff9f0e', // route 5
        '#4fdc52', // route 6
        '#8567bb', // route 7
        '#f03239', // route 8
        '#bfb0ff', // route 1 HOV
        '#ffb2d0', // route 2 HOV
        '#9dd3d0', // route 3 HOV
        '#e7ff8c', // route 4 HOV
        '#ffd389', // route 5 HOV
        '#aef7a4', // route 6 HOV
        '#d3bdf3', // route 7 HOV
        '#ffa99b', // route 8 HOV
    ];
    function getRouteColor(displayNumber) {
        return ROUTE_COLORS[(displayNumber - 1) % ROUTE_COLORS.length];
    }

    const KM_PER_MILE = 1.609344;

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
        '#531947', // >= 140.5 km/h
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
        '#531947', // >= 85.5 mph
    ];
    function getSpeedColor(speed) {
        if (speed === 0) return INVALID_SPEED_COLOR;
        let speedRounded = Math.round(speed);
        if (options.useMiles) {
            if (speedRounded <= 15) return IMPERIAL_SPEED_COLORS[Math.ceil(speedRounded / 3) - 1];
            else return IMPERIAL_SPEED_COLORS[Math.min(Math.ceil(speedRounded / 5) + 1, IMPERIAL_SPEED_COLORS.length - 1)];
        } else {
            if (speedRounded <= 20) return METRIC_SPEED_COLORS[Math.ceil(speedRounded / 5) - 1];
            else return METRIC_SPEED_COLORS[Math.min(Math.ceil(speedRounded / 10) + 1, METRIC_SPEED_COLORS.length - 1)];
        }
    }

    const WME_LAYERS_TO_MOVE = ["closures", "turn_closure", "closure_nodes"];
    const SCRIPT_LAYERS_TO_COVER = ["LT Highlights Layer", "LT Names Layer", "LT Lane Graphics"];

    const SAVED_OPTIONS_KEY = "RouteSpeedsOptions";
    const options = {
        enableScript: true,
        rememberEnabled: "remember",
        requireTab: false,
        clearSelection: false,
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
        avoidDifficult: true,
        avoidFerries: false,
        avoidUnpaved: true,
        avoidLongUnpaved: false,
        allowUTurns: true,
        sortBy: 'time',
        passes: []
    };

    let sdk;

    let topCountry = {id: null};

    let markerMoving = "none";
    let startFirstClickRegistered = false;
    let mouseMoveHandler;

    let pointA = {};
    let pointB = {};

    let tabStatus = 0;
    let jQueryStatus = 0;

    let z17_reached = false;
    let baseZIndex = -1;
    let originalZIndices = [];
    let alreadyReportedWMELayer = false;

    let twoSegmentsSelected = false;

    let normalRoutesReceived = 0;
    let routesReceived = [];
    let routesShown = [];

    let waitingForRoute = false;
    let routeSelected = 0;
    let routeSelectedLast = -1;

    let storedFeatures = [];

    //--------------------------------------------------------------------------
    // Script startup functions

    function onSDKInitialized() {
        sdk = getWmeSdk({scriptId: SCRIPT_ID, scriptName: SCRIPT_SHORT_NAME});
        if (sdk.State.isReady()) {
            onWMEReady();
        } else {
            log("Waiting for WME...");
            sdk.Events.once({ eventName: "wme-ready" }).then(onWMEReady);
        }
    }

    function onWMEReady() {
        log("Initializing...");
        initializeScript();
        log(SCRIPT_VERSION + " loaded.");
        startScriptUpdateMonitor();
    }

    function startScriptUpdateMonitor(tries = 0) {
        if (WazeWrap && WazeWrap.Ready) {
            log("Checking for script updates...");
            try {
                let updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(SCRIPT_NAME, SCRIPT_VERSION, DOWNLOAD_URL, GM_xmlhttpRequest);
                updateMonitor.start();
            } catch (ex) {
                error(ex);
            }
        } else {
            if (tries == 0) {
                log("Waiting for WazeWrap...");
            } else if (tries >= 60) {
                warn("WazeWrap loading failed after 60 tries. Script updates will not be detected.");
                return;
            }
            setTimeout(startScriptUpdateMonitor, 500, tries + 1);
        }
    }

    function initializeScript() {
        let addon = document.createElement('section');
        addon.id = SCRIPT_ID + "-addon";
        addon.innerHTML = '<div id="' + SCRIPT_ID + '-sidepanel" style="margin:0px; width:auto; position:relative; z-index:6;">' +
            '<div style="margin-bottom:4px; padding:0px;"><a href="https://greasyfork.org/en/scripts/369630" target="_blank"><span style="font-weight:bold; text-decoration:underline">WME Route Speeds</span></a>' +
            '<span style="margin-left:6px; color:#888; font-size:11px;">v' + SCRIPT_VERSION + '</span>' +
            '</div>' +

            '<style>\n' +
            '#' + SCRIPT_ID + '-sidepanel select { margin-left:20px; font-size:12px; height:22px; border:1px solid; border-color:rgb(169, 169, 169); border-radius:4px; border: 1px solid; border-color: rgb(169, 169, 169); -webkit-border-radius:4px; -moz-border-radius:4px; }\n' +
            '#' + SCRIPT_ID + '-sidepanel select, #' + SCRIPT_ID + '-sidepanel input { margin-top:2px; margin-bottom:2px; width:initial; }\n' +
            '#' + SCRIPT_ID + '-sidepanel input[type="checkbox"] { margin-bottom:0px; }\n' +
            '#' + SCRIPT_ID + '-sidepanel label ~ label, #' + SCRIPT_ID + '-sidepanel span label { margin-left:20px; }\n' +
            '#' + SCRIPT_ID + '-sidepanel .controls-container { padding:0px; }\n' +
            '#' + SCRIPT_ID + '-sidepanel label { font-weight:normal; }\n' +
            '</style>' +

            '<div style="float:left; display:inline-block;">' +
            '<a id="' + SCRIPT_ID + '-button-A" onclick="return false;" style="cursor:pointer; width:20px; display:inline-block; vertical-align:middle;" title="Center map on A marker">A:</a>' +
            '<input id="' + SCRIPT_ID + '-sidepanel-a" class="form-control" style="width:180px; padding:6px; margin:0px; display:inline; height:24px" type="text" name=""/>' +
            '<br><div style="height: 4px;"></div>' +
            '<a id="' + SCRIPT_ID + '-button-B" onclick="return false;" style="cursor:pointer; width:20px; display:inline-block; vertical-align:middle;" title="Center map on B marker">B:</a>' +
            '<input id="' + SCRIPT_ID + '-sidepanel-b" class="form-control" style="width:180px; padding:6px; margin:0px; display:inline; height:24px" type="text" name=""/>' +
            '</div>' +
            '<div style="float:right; padding-right:20px; padding-top:11px;">' +
            '<button id=' + SCRIPT_ID + '-button-reverse class="waze-btn waze-btn-blue waze-btn-smaller" style="padding-left:15px; padding-right:15px;" title="Calculate reverse route" >A &#8596; B</button></div>' +
            '<div style="clear:both; "></div>' +
            '<div id="' + SCRIPT_ID + '-marker-click-explanation" style="font-size:11px; color:#404040; line-height:1.1; display:none;">Click the A or B marker on the map to move it. Click again to finish moving the marker.</div>' +

            '<div style="margin-top:5px;">' +
            '<select id=' + SCRIPT_ID + '-hour>' +
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
            '<select id=' + SCRIPT_ID + '-day style="margin-left:5px;" >' +
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
            '<button id=' + SCRIPT_ID + '-button-livemap class="waze-btn waze-btn-blue waze-btn-smaller" style="width:100%;">Calculate Route</button>' +
            '</div>' +
            '<b><div id=' + SCRIPT_ID + '-error style="color:#FF0000"></div></b>' +
            '<div id=' + SCRIPT_ID + '-routecount style="font-size:11px;"></div>' +

            '<div id=' + SCRIPT_ID + '-summaries style="font-size:11px; font-variant-numeric:tabular-nums;"></div>' +

            '<div style="padding-top:4px;"><b>Script Options:</b></div>' +
            getCheckboxHtml('enablescript', 'Enable script') +
            '<div>' +
            'When WME loads:<select id=' + SCRIPT_ID + '-remember-enabled style="margin-left:6px;" >' +
            '<option value="enable">Enable script</option>' +
            '<option value="disable">Disable script</option>' +
            '<option value="remember">Remember previous state</option>' +
            '</select>' +
            '<br>' +
            getCheckboxHtml('require-tab', 'Require open script tab for routing') +
            getCheckboxHtml('clear-selection', 'Deselect segments after routing') +
            '</div>' +

            '<div style="padding-top:4px;"><b>Route Display Options:</b></div>' +
            getCheckboxHtml('showLabels', 'Show segment cross time labels') +
            getCheckboxHtml('showSpeeds', 'Show cross times as speeds', '', { marginLeft: '12px' }) +
            getCheckboxHtml('usemiles', 'Use miles and mph') +
            getCheckboxHtml('routetext', 'Show route descriptions') +
            getCheckboxHtml('livetraffic', 'Use live traffic', 'Routes for times close to the current time can be displayed with or without live traffic information') +
            '<div>' +
            getCheckboxHtml('sortresults', 'Sort routes: by', 'If unchecked, routes are shown in the order they are received from the server. If 3 routes are requested, this will also be the order they would appear in the app or live map.', { display: 'inline-block' }) +
            '<select id=' + SCRIPT_ID + '-sortby style="margin-left:-4px; display:inline-block;" >' +
            '<option id=' + SCRIPT_ID + '-sortby value="time">total time</option>' +
            '<option id=' + SCRIPT_ID + '-sortby value="length">total length</option>' +
            '</select>' +
            '</div>' +

            '<div style="padding-top:4px;"><b>Routing Options:</b>' +
            '<a id="' + SCRIPT_ID + '-reset-routing-options" onclick="return false;" style="cursor:pointer; float:right; padding-right:8px;">Reset to App Defaults</a>' +
            '</div>' +
            getCheckboxHtml('userbs', 'Use Routing Beta Server (RBS)', '', { display: window.location.hostname.includes('beta') ? 'inline' : 'none' }) +

            '<div>' +
            getCheckboxHtml('getalternatives', 'Alternative routes: show', '', { display: 'inline-block' }) +
            '<select id=' + SCRIPT_ID + '-maxroutes style="margin-left:-4px; display:inline-block;" >' +
            '<option id=' + SCRIPT_ID + '-maxroutes value="1">1</option>' +
            '<option id=' + SCRIPT_ID + '-maxroutes value="2">2</option>' +
            '<option id=' + SCRIPT_ID + '-maxroutes value="3">3</option>' +
            '<option id=' + SCRIPT_ID + '-maxroutes value="4">4</option>' +
            '<option id=' + SCRIPT_ID + '-maxroutes value="5">5</option>' +
            '<option id=' + SCRIPT_ID + '-maxroutes value="6">6</option>' +
            '<option id=' + SCRIPT_ID + '-maxroutes value="7">7</option>' +
            '<option id=' + SCRIPT_ID + '-maxroutes value="40">all</option>' +
            '</select>' +
            '</div>' +

            '<div>' +
            'Route type:<select id=' + SCRIPT_ID + '-routetype style="margin-left:10px;" >' +
            '<option value="1">Fastest</option>' +
            '<option value="3">Fastest (no history)</option>' +
            '</select>' +
            '<br>' +
            'Vehicle type:<select id=' + SCRIPT_ID + '-vehicletype style="margin-left:10px;" >' +
            '<option id=' + SCRIPT_ID + '-vehicletype value="PRIVATE">Private</option>' +
            '<option id=' + SCRIPT_ID + '-vehicletype value="EV">Electric</option>' +
            '<option id=' + SCRIPT_ID + '-vehicletype value="TAXI">Taxi</option>' +
            '<option id=' + SCRIPT_ID + '-vehicletype value="MOTORCYCLE">Motorcycle</option>' +
            '</select>' +
            '</div>' +

            '<table><tbody><tr><td style="vertical-align:top; padding-right:4px;">Avoid:</td><td>' +
            getCheckboxHtml('avoidtolls', 'Tolls') +
            getCheckboxHtml('avoidferries', 'Ferries') +
            getCheckboxHtml('avoidfreeways', 'Freeways') +
            getCheckboxHtml('avoiddifficult', 'Difficult turns') +
            '</td></tr></tbody></table>' +

            'Unpaved roads:<select id=' + SCRIPT_ID + '-unpaved-rule style="margin-left:10px;">' +
            '<option id=' + SCRIPT_ID + '-unpaved-rule value="2">Allow</option>' +
            '<option id=' + SCRIPT_ID + '-unpaved-rule value="0">Don\'t allow</option>' +
            '<option id=' + SCRIPT_ID + '-unpaved-rule value="1">Avoid long ones</option>' +
            '</select>' +
            getCheckboxHtml('allowuturns', 'Allow U-turns', 'The app allows U-turns, but the live map avoids them.') +

            '<div id="' + SCRIPT_ID + '-passes-container"></div>' +

            '<style>' +
            '.' + SCRIPT_ID + 'markerA                      { display:block; width:27px; height:36px; margin-left:-13px; margin-top:-34px; }' +
            '.' + SCRIPT_ID + 'markerB                      { display:block; width:27px; height:36px; margin-left:-13px; margin-top:-34px; }' +
            '.' + SCRIPT_ID + 'markerA                      { background-image:url(data:image/png;base64,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); }' +
            '.' + SCRIPT_ID + 'markerB                      { background-image:url(data:image/png;base64,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); }' +
            '.' + SCRIPT_ID + 'markerA:hover                { cursor:move }' +
            '.' + SCRIPT_ID + 'markerB:hover                { cursor:move }' +
            '.' + SCRIPT_ID + '_summary_normal              { visibility:hidden; display:block; color:#000000; line-height:1.4; margin:4px 0px 4px 0px; padding:2px 4px 2px 4px; border:1px solid #c0c0c0; background:#f6f6f6; border-radius:4px; vertical-align:middle; position:relative; }' +
            '.' + SCRIPT_ID + '_summary_selected            { visibility:hidden; display:block; color:#000000; line-height:1.4; margin:4px 0px 4px 0px; padding:2px 4px 2px 4px; border:1px solid #c0c0c0; background:#c8fcff; border-radius:4px; vertical-align:middle; position:relative; }' +
            '.' + SCRIPT_ID + '_summary_hov                 { visibility:hidden; display:block; color:#282828; line-height:1.4; margin:-10px 1px 4px 1px; padding:7px 4px 2px 4px; border:1px solid #c0c0c0; background:#fdfdfd; border-radius:4px; vertical-align:middle; position:relative; }' +
            '.' + SCRIPT_ID + '_summary_hov_selected        { visibility:hidden; display:block; color:#282828; line-height:1.4; margin:-10px 1px 4px 1px; padding:7px 4px 2px 4px; border:1px solid #c0c0c0; background:#d8fdff; border-radius:4px; vertical-align:middle; position:relative; }' +
            '.' + SCRIPT_ID + '_summary_normal:hover        { cursor:pointer; border:1px solid #808080; xbackground:#a0fffd; }' +
            '.' + SCRIPT_ID + '_summary_selected:hover      { cursor:pointer; border:1px solid #808080; xbackground:#a0fffd; }' +
            '.' + SCRIPT_ID + '_summary_hov:hover           { cursor:pointer; border:1px solid #808080; xbackground:#a0fffd; }' +
            '.' + SCRIPT_ID + '_summary_hov_selected:hover  { cursor:pointer; border:1px solid #808080; xbackground:#a0fffd; }' +
            '.' + SCRIPT_ID + '_header                      { display:inline-block; width:14px; height:14px; text-align:center; border-radius:2px; margin-right:2px; position:relative; top:2px; }' +
            '.' + SCRIPT_ID + '_header_hov                  { display:inline-block; width:12px; height:12px; text-align:center; border-radius:2px; margin-right:3px; position:relative; top:2px; }' +
            '</style>' +
            '</div>';

        /* var userTabs = getId('user-info');
        var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
        var tabContent = getElementsByClassName('tab-content', userTabs)[0];

        newtab = document.createElement('li');
        newtab.innerHTML = '<a id=sidepanel-routespeeds href="#sidepanel-routespeeds" data-toggle="tab" style="" >Route Speeds</a>';
        navTabs.appendChild(newtab);

        addon.id = "sidepanel-routespeeds";
        addon.className = "tab-pane";
        tabContent.appendChild(addon); */

        $('head').append([
            '<style>',
            'label[for^="' + SCRIPT_ID + '-"] { margin-right: 10px;padding-left: 19px; }',
            '.hidden { display:none; }',
            '</style>'
        ].join('\n'));

        sdk.Sidebar.registerScriptTab().then((tab) => {
            tab.tabLabel.innerHTML = '<span id="' + SCRIPT_ID + '-tab-label">' + SCRIPT_SHORT_NAME + '</span>';
            tab.tabPane.innerHTML = addon.innerHTML;
            onTabCreated();
        });

        window.addEventListener("beforeunload", saveRouteSpeedsOptions, true);
    }

    function getCheckboxHtml(idSuffix, text, title, divCss = {}, labelCss = {}) {
        let id = SCRIPT_ID + '-' + idSuffix;
        return $('<div>', { class: 'controls-container' }).append(
            $('<input>', { id: id, type: 'checkbox' }),
            $('<label>', { for: id, title: title }).text(text).css(labelCss)
        ).css(divCss)[0].outerHTML;
    }

    function saveRouteSpeedsOptions() {
        localStorage.setItem(SAVED_OPTIONS_KEY, JSON.stringify(options));
    }

    function resetRoutingOptions() {
        getByID('getalternatives').checked = options.getAlternatives = true;
        getByID('maxroutes').value = options.maxRoutes = 3;
        getByID('routetype').value = options.routeType = 1;
        getByID('avoidtolls').checked = options.avoidTolls = false;
        getByID('avoidfreeways').checked = options.avoidFreeways = false;
        options.avoidUnpaved = true;
        options.avoidLongUnpaved = false;
        getByID('unpaved-rule').value = 0;
        getByID('allowuturns').checked = options.allowUTurns = true;
        getByID('userbs').checked = options.useRBS = false;
        getByID('avoiddifficult').checked = options.avoidDifficult = true;
        getByID('avoidferries').checked = options.avoidFerries = false;
        getByID('vehicletype').value = options.vehicleType = 'PRIVATE';
    }

    function loadRouteSpeedsOptions() {
        try {
            Object.assign(options, JSON.parse(localStorage.getItem(SAVED_OPTIONS_KEY)));
        } catch {
            warn("Saved options could not be loaded. Using defaults.");
        }
        getByID('remember-enabled').value = options.rememberEnabled;
        if (options.rememberEnabled == "enable") options.enableScript = true;
        else if (options.rememberEnabled == "disable") options.enableScript = false;
        getByID('enablescript').checked = options.enableScript;
        getByID('require-tab').checked = options.requireTab;
        getByID('clear-selection').checked = options.clearSelection;
        getByID('showLabels').checked = options.showLabels;
        getByID('showSpeeds').checked = options.showSpeeds;
        getByID('usemiles').checked = options.useMiles;
        getByID('routetext').checked = options.showRouteText;
        getByID('getalternatives').checked = options.getAlternatives;
        getByID('maxroutes').value = options.maxRoutes;
        getByID('livetraffic').checked = options.liveTraffic;
        getByID('avoidtolls').checked = options.avoidTolls;
        getByID('avoidfreeways').checked = options.avoidFreeways;
        if (options.avoidUnpaved) getByID('unpaved-rule').value = 0;
        else if (options.avoidLongUnpaved) getByID('unpaved-rule').value = 1;
        else getByID('unpaved-rule').value = 2;
        getByID('routetype').value = options.routeType;
        getByID('allowuturns').checked = options.allowUTurns;
        getByID('sortresults').checked = !options.routingOrder;
        getByID('userbs').checked = options.useRBS;
        getByID('avoiddifficult').checked = options.avoidDifficult;
        getByID('avoidferries').checked = options.avoidFerries;
        getByID('vehicletype').value = options.vehicleType;
        getByID('sortby').value = options.sortBy;
    }

    function onTabCreated() {
        resetRoutingOptions();
        loadRouteSpeedsOptions();

        if (!options.enableScript) getByID('sidepanel').style.color = "#A0A0A0";
        else getByID('sidepanel').style.color = "";

        getByID('enablescript').onclick = clickEnableScript;
        getByID('remember-enabled').onclick = changeRememberEnabled;
        getByID('require-tab').onclick = clickRequireTab;
        getByID('clear-selection').onclick = clickClearSelection;
        getByID('showLabels').onclick = clickShowLabels;
        getByID('showSpeeds').onclick = clickShowSpeeds;
        getByID('usemiles').onclick = clickUseMiles;
        getByID('routetext').onclick = clickShowRouteText;
        getByID('getalternatives').onclick = clickGetAlternatives;
        getByID('maxroutes').onchange = clickMaxRoutes;
        getByID('livetraffic').onclick = clickLiveTraffic;
        getByID('avoidtolls').onclick = clickAvoidTolls;
        getByID('avoidfreeways').onclick = clickAvoidFreeways;
        getByID('unpaved-rule').onchange = changeUnpavedRule;
        getByID('routetype').onchange = clickRouteType;
        getByID('allowuturns').onclick = clickAllowUTurns;
        getByID('sortresults').onclick = clickSortResults;
        getByID('userbs').onclick = clickUseRBS;
        getByID('avoiddifficult').onclick = clickAvoidDifficult;
        getByID('avoidferries').onclick = clickAvoidFerries;
        getByID('vehicletype').onchange = clickVehicleType;
        getByID('sortby').onchange = changeSortBy;

        getByID('sidepanel-a').onkeydown = enterAB;
        getByID('sidepanel-b').onkeydown = enterAB;

        getByID('button-livemap').onclick = livemapRouteClick;
        getByID('button-reverse').onclick = clickReverseRoute;
        getByID('reset-routing-options').onclick = resetRoutingOptionsClick;

        getByID('hour').onchange = hourChange;
        getByID('day').onchange = dayChange;

        getByID('button-A').onclick = clickA;
        getByID('button-B').onclick = clickB;

        updateTopCountry();
        sdk.Events.on({
            eventName: "wme-map-data-loaded",
            eventHandler: onMapDataLoaded
        });

        sdk.Map.addLayer({
            layerName: MARKER_LAYER_NAME,
            styleRules: [
                {
                    style: {
                        graphicWidth: 27,
                        graphicHeight: 36,
                        graphicXOffset: -13.5,
                        graphicYOffset: -33.5,
                        graphicOpacity: 1,
                        cursor: "pointer"
                    }
                },
                {
                    predicate: (featureProperties) => featureProperties.A,
                    style: {
                        externalGraphic: MARKER_A_IMAGE
                    },
                },
                {
                    predicate: (featureProperties) => !featureProperties.A,
                    style: {
                        externalGraphic: MARKER_B_IMAGE
                    },
                },
            ],
        });
        sdk.Events.trackLayerEvents({layerName: MARKER_LAYER_NAME});
        sdk.Events.on({
            eventName: "wme-layer-feature-mouse-enter",
            eventHandler: mouseEnterHandler
        });
        sdk.Events.on({
            eventName: "wme-layer-feature-mouse-leave",
            eventHandler: mouseLeaveHandler
        });

        sdk.Map.addLayer({
            layerName: ROUTE_LAYER_NAME,
            styleRules: [{
                style: {
                    strokeWidth: "${getStrokeWidth}",
                    strokeColor: "${getStrokeColor}",
                    pointRadius: 0,
                    label: "${getLabelText}",
                    fontSize: "10px",
                    fontFamily: "Tahoma, Courier New",
                    fontWeight: "${getFontWeight}",
                    fontColor: "${getFontColor}",
                    labelOutlineWidth: 2,
                    labelOutlineColor: "#404040"
                }
            }],
            styleContext: {
                getStrokeWidth: ({feature}) => feature.properties.strokeWidth,
                getStrokeColor: ({feature}) => feature.properties.strokeColor,
                getLabelText: ({feature}) => feature.properties.labelText,
                getFontWeight: ({feature}) => feature.properties.fontWeight,
                getFontColor: ({feature}) => feature.properties.fontColor
            }
        });
        sdk.Events.on({
            eventName: "wme-map-move-end",
            eventHandler: onMapMoveEnd
        });

        window.setInterval(loopWMERouteSpeeds, 500);
    }

    function updateTopCountry() {
        let newTopCountry = sdk.DataModel.Countries.getTopCountry();
        if (newTopCountry && newTopCountry.id != topCountry.id) {
            topCountry = newTopCountry;
            buildPassesDiv();
        }
    }

    function buildPassesDiv() {
        $('#' + SCRIPT_ID + '-passes-container').empty();
        if (topCountry.restrictionSubscriptions.length == 0) return;
        $('#' + SCRIPT_ID + '-passes-container').append(
            '<fieldset style="border:1px solid silver;padding:8px;border-radius:4px;-webkit-padding-before: 0;">' +
            '  <legend id="' + SCRIPT_ID + '-passes-legend" style="margin-bottom:0px;border-bottom-style:none;width:auto;">' +
            '    <i class="fa fa-fw fa-chevron-down" style="cursor: pointer;font-size: 12px;margin-right: 4px"></i>' +
            '    <span id="' + SCRIPT_ID + '-passes-label" style="font-size:14px;font-weight:600; cursor: pointer">Passes & Permits</span>' +
            '  </legend>' +
            '  <div id="' + SCRIPT_ID + '-passes-internal-container" style="padding-top:0px;">' +
            topCountry.restrictionSubscriptions.map((pass, i) => {
                //let id = 'routespeeds-pass-' + pass.key;
                return '    <div class="controls-container" style="padding-top:2px;display:block;">' +
                    '      <input id="' + SCRIPT_ID + '-pass-' + i + '" type="checkbox" class="' + SCRIPT_ID + '-pass-checkbox" data-pass-key = "' + pass.id + '">' +
                    '      <label for="' + SCRIPT_ID + '-pass-' + i + '" style="white-space:pre-line">' + pass.name + '</label>' +
                    '    </div>';
            }).join(' ') +
            '  </div>' +
            '</fieldset>'
        );

        $('.' + SCRIPT_ID + '-pass-checkbox').click(clickPassOption);

        $('#' + SCRIPT_ID + '-passes-legend').click(function () {
            let $this = $(this);
            let $chevron = $($this.children()[0]);
            $chevron
                .toggleClass('fa fa-fw fa-chevron-down')
                .toggleClass('fa fa-fw fa-chevron-right');
            let collapse = $chevron.hasClass('fa-chevron-right');
            let checkboxDivs = $('input.' + SCRIPT_ID + '-pass-checkbox:not(:checked)').parent();
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

        $('.' + SCRIPT_ID + '-pass-checkbox').each((i, elem) => {
            const $elem = $(elem);
            const passKey = $elem.data('pass-key');
            $elem.prop('checked', options.passes.includes(passKey));
        });
        updatePassesLabel();
    }

    function updatePassesLabel() {
        let count = topCountry.restrictionSubscriptions.filter(pass => options.passes.indexOf(pass.id) > -1).length;
        $('#' + SCRIPT_ID + '-passes-label').text(`Passes & Permits (${count} of ${topCountry.restrictionSubscriptions.length})`);
    }

    //--------------------------------------------------------------------------
    // Main loop function

    function loopWMERouteSpeeds() {
        if (!options.enableScript) return;

        let tabOpenedOnce = $('#user-tabs #' + SCRIPT_ID + '-tab-label').parent().parent().attr('aria-expanded') == "true";
        let tabOpen = $('#user-tabs #' + SCRIPT_ID + '-tab-label').parent().parent().parent().hasClass("active");
        if (tabOpenedOnce) {
            if (tabStatus !== 2) {
                tabStatus = 2;
                sdk.Map.setLayerVisibility({layerName: MARKER_LAYER_NAME, visibility: true});
                sdk.Map.setLayerVisibility({layerName: ROUTE_LAYER_NAME, visibility: true});
                reorderLayers(1);
            }
        } else {
            if (tabStatus !== 1) {
                tabStatus = 1;
                sdk.Map.setLayerVisibility({layerName: MARKER_LAYER_NAME, visibility: false});
                sdk.Map.setLayerVisibility({layerName: ROUTE_LAYER_NAME, visibility: false});
                reorderLayers(0);
            }
            return;
        }

        if (jQueryStatus === 1) {
            jQueryStatus = 2;
            log('jQuery reloaded ver. ' + jQuery.fn.jquery);
        }
        if (jQueryStatus === 0) {
            if (typeof jQuery === 'undefined') {
                log('jQuery current ver. ' + jQuery.fn.jquery);
                let script = document.createElement('script');
                script.type = "text/javascript";
                script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js";
                //script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js";
                document.getElementsByTagName('head')[0].appendChild(script);
                jQueryStatus = 1;
            }
        }

        let selection = sdk.Editing.getSelection();
        let selectedIDs = [];
        if (selection !== null && selection.objectType == "segment") selectedIDs = selection.ids;
        if (selectedIDs.length == 2 && (tabOpen || !options.requireTab)) {
            if (!twoSegmentsSelected) {
                twoSegmentsSelected = true;
                let midpointA = getSegmentMidpoint(selectedIDs[0]);
                let midpointB = getSegmentMidpoint(selectedIDs[selectedIDs.length - 1]);
                if (getByID('sidepanel-a') !== undefined) {
                    getByID('sidepanel-a').value = midpointA[0].toFixed(6) + ", " + midpointA[1].toFixed(6);
                    getByID('sidepanel-b').value = midpointB[0].toFixed(6) + ", " + midpointB[1].toFixed(6);
                }
                createMarkers(midpointA[0], midpointA[1], midpointB[0], midpointB[1]);
                requestRouteFromLiveMap(options.clearSelection);
            }
        } else if (selectedIDs.length == 1) {
            if (twoSegmentsSelected) {
                twoSegmentsSelected = false;
                sdk.Map.removeAllFeaturesFromLayer({layerName: ROUTE_LAYER_NAME});
                getByID('summaries').style.visibility = 'hidden';
            }
        }

        if (!z17_reached) {
            if (sdk.Map.getZoomLevel() >= 17) {
                z17_reached = true;
                switchRoute();
            }
        }
    }

    //--------------------------------------------------------------------------
    // Routing and helper functions

    function log(msg) {
        console.log(SCRIPT_SHORT_NAME + ":", msg);
    };
    function warn(msg) {
        console.warn(SCRIPT_SHORT_NAME + ":", msg);
    };
    function error(msg) {
        console.error(SCRIPT_SHORT_NAME + ":", msg);
    };

    function getRoutingManager() {
        let region = sdk.Settings.getRegionCode();
        if (region == "usa") {
            return 'https://routing-livemap-am.waze.com/RoutingManager/routingRequest';
        } else if (region == "il") {
            return 'https://routing-livemap-il.waze.com/RoutingManager/routingRequest';
        } else {
            return 'https://routing-livemap-row.waze.com/RoutingManager/routingRequest';
        }
    }

    function getSegmentMidpoint(id) {
        let geometry = sdk.DataModel.Segments.getById({segmentId: id}).geometry;
        return turf.along(geometry, turf.length(geometry) / 2).geometry.coordinates;
    }

    function getLabelTime(segmentInfo) {
        let time = 0;
        if (options.liveTraffic) time += segmentInfo.crossTime;
        else time += segmentInfo.crossTimeWithoutRealTime;
        return time;
    }

    function getLabelWeight(segmentInfo) {
        if (options.liveTraffic && segmentInfo.crossTime != segmentInfo.crossTimeWithoutRealTime) return 'bold';
        else return 'normal';
    }

    function getLabelColor(segmentInfo) {
        if (options.liveTraffic) {
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

    function getSpeed(length_m, time_s) {
        if (time_s == 0) return 0;
        if (options.useMiles) return 3.6 * length_m / (time_s * KM_PER_MILE);
        else return 3.6 * length_m / time_s;
    }

    function getTimeText(time_s) {
        let seconds = time_s % 60;
        let minutes = Math.floor(time_s / 60) % 60;
        let hours = Math.floor(time_s / 3600);
        if (hours == 0) return minutes + ':' + String(seconds).padStart(2, '0');
        else return hours + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    function createMarkers(lon1, lat1, lon2, lat2) {
        sdk.Map.removeAllFeaturesFromLayer({layerName: MARKER_LAYER_NAME});
        placeMarker("A", lon1, lat1);
        placeMarker("B", lon2, lat2);
        sdk.Map.setLayerVisibility({layerName: MARKER_LAYER_NAME, visibility: true});
        getByID("marker-click-explanation").style.display = "block";
    }

    function placeMarker(id, lon, lat) {
        if (id == "A") {
            pointA.lon = lon;
            pointA.lat = lat;
        } else {
            pointB.lon = lon;
            pointB.lat = lat;
        }
        sdk.Map.addFeatureToLayer({
            layerName: MARKER_LAYER_NAME,
            feature: {
                id: id,
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [lon, lat],
                },
                properties: {
                    A: id == "A",
                },
            }
        });
    }

    function moveMarker(id, lon, lat) {
        sdk.Map.removeFeatureFromLayer({layerName: MARKER_LAYER_NAME, featureId: id});
        placeMarker(id, lon, lat);
    }

    function routeRevisitsAnyNode(routeIndex) {
        let nodes = {};
        for (let i = 0; i < routesShown[routeIndex].response.results.length; i++) {
            let nodeIDString = routesShown[routeIndex].response.results[i].path.nodeId.toString();
            if (nodes[nodeIDString] === undefined) {
                nodes[nodeIDString] = 1;
            } else {
                return true;
            }
        }
        return false;
    }

    function getRouteFeature(routeIndex, segmentIndex, geometry, mode) {
        let feature = {};
        if (mode == "label") {
            feature = turf.along(geometry, turf.length(geometry) / 2);
            let labelText = routesShown[routeIndex].response.results[segmentIndex].useHovLane ? "\u2662\n" : "";
            if (options.showSpeeds) {
                let speed = getSpeed(routesShown[routeIndex].response.results[segmentIndex].length, getLabelTime(routesShown[routeIndex].response.results[segmentIndex]));
                if (speed >= 1) labelText += Math.round(speed);
                else if (speed == 0) labelText += '?';
                else labelText += '<1';
            } else {
                labelText += getLabelTime(routesShown[routeIndex].response.results[segmentIndex]) + 's';
            }
            if (routesShown[routeIndex].response.results[segmentIndex].useHovLane) labelText += "\n";
            feature.properties = {
                labelText: labelText,
                fontWeight: getLabelWeight(routesShown[routeIndex].response.results[segmentIndex]),
                fontColor: getLabelColor(routesShown[routeIndex].response.results[segmentIndex])
            };
        } else {
            feature.type = "Feature";
            feature.geometry = geometry;
            feature.properties = {labelText: ""};
            if (mode == "simple") {
                feature.properties.strokeWidth = 5;
                feature.properties.strokeColor = getRouteColor(routesShown[routeIndex].displayNumber);
            } else if (mode == "outline") {
                feature.properties.strokeWidth = 12;
                feature.properties.strokeColor = "#404040";
            } else {
                feature.properties.strokeWidth = 10;
                feature.properties.strokeColor = getSpeedColor(getSpeed(routesShown[routeIndex].response.results[segmentIndex].length,
                                                                        getLabelTime(routesShown[routeIndex].response.results[segmentIndex])));
            }
        }
        feature.id = "route " + routeIndex + ", segment " + segmentIndex + ": " + mode;
        return feature;
    }

    function splitGeometryIntoSegments(routeIndex) {
        let offset = 0;
        if (routeRevisitsAnyNode(routeIndex)) {
            offset = topCountry.isLeftHandTraffic ? -0.01 : 0.01;
        }
        let geometries = [];
        let currentSegmentIndex = 0;
        let currentSegmentCoords = [[routesShown[routeIndex].coords[0].x, routesShown[routeIndex].coords[0].y]];
        let startNextSegment = [0, 0];
        if (routesShown[routeIndex].response.results.length > 1) {
            startNextSegment = [routesShown[routeIndex].response.results[1].path.x, routesShown[routeIndex].response.results[1].path.y];
        }
        if (Math.abs(currentSegmentCoords[0][0] - startNextSegment[0]) < 10 ** -8 && Math.abs(currentSegmentCoords[0][1] - startNextSegment[1]) < 10 ** -8) {
            currentSegmentCoords.push(currentSegmentCoords[0]);
            let currentGeometry = {
                type: "LineString",
                coordinates: currentSegmentCoords
            };
            if (offset) {
                currentGeometry = turf.lineOffset(currentGeometry, offset).geometry;
            }
            geometries.push(currentGeometry);
            currentSegmentIndex++;
            currentSegmentCoords = [currentSegmentCoords[0]];
            if (currentSegmentIndex + 1 < routesShown[routeIndex].response.results.length) {
                startNextSegment = [routesShown[routeIndex].response.results[currentSegmentIndex + 1].path.x, routesShown[routeIndex].response.results[currentSegmentIndex + 1].path.y];
            } else {
                startNextSegment = [0, 0];
            }
        }
        for (let i = 1; i < routesShown[routeIndex].coords.length; i++) {
            let currentPoint = [routesShown[routeIndex].coords[i].x, routesShown[routeIndex].coords[i].y];
            currentSegmentCoords.push(currentPoint);
            if (Math.abs(currentPoint[0] - startNextSegment[0]) < 10 ** -8 && Math.abs(currentPoint[1] - startNextSegment[1]) < 10 ** -8) {
                let currentGeometry = {
                    type: "LineString",
                    coordinates: currentSegmentCoords
                };
                if (offset) {
                    currentGeometry = turf.lineOffset(currentGeometry, offset).geometry;
                }
                geometries.push(currentGeometry);
                currentSegmentIndex++;
                currentSegmentCoords = [];
                if (currentSegmentIndex + 1 < routesShown[routeIndex].response.results.length) {
                    startNextSegment = [routesShown[routeIndex].response.results[currentSegmentIndex + 1].path.x, routesShown[routeIndex].response.results[currentSegmentIndex + 1].path.y];
                } else {
                    startNextSegment = [0, 0];
                }
            }
        }
        let lastGeometry = {
            type: "LineString",
            coordinates: currentSegmentCoords
        };
        if (offset) {
            lastGeometry = turf.lineOffset(lastGeometry, offset).geometry;
        }
        geometries.push(lastGeometry);
        if (offset) {
            cleanOffsetGeometries(geometries);
        }
        return geometries;
    }

    function cleanOffsetGeometries(geometries) {
        if (geometries.length < 2) return;
        for (let i = 1; i < geometries.length; i++) {
            let intersections = turf.lineIntersect(geometries[i - 1], geometries[i]).features;
            for (let j = 0; j < intersections.length; j++) {
                if (turf.distance(intersections[j], getFirstPoint(geometries[i])) < 0.0201) {
                    geometries[i - 1] = turf.cleanCoords(turf.lineSlice(getFirstPoint(geometries[i - 1]), intersections[j].geometry, geometries[i - 1]).geometry);
                    geometries[i] = turf.cleanCoords(turf.lineSlice(intersections[j].geometry, getLastPoint(geometries[i]), geometries[i]).geometry);
                    break;
                }
            }
            if (!turf.booleanEqual(getLastPoint(geometries[i - 1]), getFirstPoint(geometries[i]))) {
                geometries[i - 1].coordinates.push(getFirstPoint(geometries[i]).coordinates);
            }
        }
    }

    function getFirstPoint(geometry) {
        return {
            type: "Point",
            coordinates: geometry.coordinates[0]
        };
    }
    function getLastPoint(geometry) {
        return {
            type: "Point",
            coordinates: geometry.coordinates[geometry.coordinates.length - 1]
        };
    }

    function createRouteFeatures(routeIndex) {
        let geometries = splitGeometryIntoSegments(routeIndex);
        if (routeSelected == routeIndex || routeSelected == -1) {
            for (let i = 0; i < geometries.length; i++) {
                storedFeatures.push(getRouteFeature(routeIndex, i, geometries[i], "outline"));
            }
            for (let i = 0; i < geometries.length; i++) {
                storedFeatures.push(getRouteFeature(routeIndex, i, geometries[i], "main"));
            }
            if (options.showLabels) {
                for (let i = 0; i < geometries.length; i++) {
                    storedFeatures.push(getRouteFeature(routeIndex, i, geometries[i], "label"));
                }
            }
        } else {
            for (let i = 0; i < geometries.length; i++) {
                storedFeatures.push(getRouteFeature(routeIndex, i, geometries[i], "simple"));
            }
        }
    }

    function getElementsByClassName(classname, node) {
        if (!node) node = document.getElementsByTagName("body")[0];
        var a = [];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName("*");
        for (var i = 0, j = els.length; i < j; i++) {
            if (re.test(els[i].className)) a.push(els[i]);
        }
        return a;
    }

    function getByID(node) {
        return document.getElementById(SCRIPT_ID + "-" + node);
    }

    function getnowtoday() {
        let hour = getByID('hour').value;
        let day = getByID('day').value;
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

    function requestRouteFromLiveMap(clearSelection) {
        var atTime = getnowtoday();
        var numRoutes = Math.min(10, options.getAlternatives ? options.maxRoutes : 1);
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
            from: "x:" + pointA.lon + " y:" + pointA.lat,
            to: "x:" + pointB.lon + " y:" + pointB.lat,
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

        waitingForRoute = true;
        getByID('error').innerHTML = "";

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
                waitingForRoute = false;
                if (clearSelection) sdk.Editing.clearSelection();
            },
            onload: function(response) {
                if (response.response.error !== undefined) {
                    let str = response.response.error;
                    str = str.replace("|", "<br>");
                    handleRouteRequestError(str);
                } else {
                    if (response.response.coords !== undefined) {
                        if (routeSelected > 0) routeSelected = 0;
                        routesReceived = [response.response];
                    }
                    if (response.response.alternatives !== undefined) {
                        routesReceived = response.response.alternatives;
                    }
                    updateRouteCount();
                    sortRoutes();
                }

                getByID('button-livemap').style.backgroundColor = '';
                getByID('button-reverse').style.backgroundColor = '';
                switchRoute();
                waitingForRoute = false;
                if (clearSelection) sdk.Editing.clearSelection();
            },
        });
    }

    function updateRouteCount() {
        let hovCount = 0;
        for (let i = 0; i < routesReceived.length; i++) {
            if (routesReceived[i].response.hovIndex != -1) hovCount++;
        }
        normalRoutesReceived = routesReceived.length - hovCount;
        getByID('routecount').innerHTML = 'Received <b>' + normalRoutesReceived + '</b> route' + (normalRoutesReceived == 1 ? '' : "s") + (hovCount ? ' (and ' + hovCount + ' HOV option' + (hovCount == 1 ? '' : 's') + ')' : '') + ' from the server';
    }

    function sortRoutes() {
        let hovRoutes = routesReceived.filter(r => r.response.hovIndex != -1);
        routesShown = routesReceived.filter(r => r.response.hovIndex == -1);
        if (!options.routingOrder) {
            let comparisonFunction;
            if (options.sortBy == "length") {
                comparisonFunction = (a, b) => getFieldTotal(a, "length") - getFieldTotal(b, "length");
            } else {
                let sortField = options.liveTraffic ? "totalRouteTime" : "totalRouteTimeWithoutRealtime";
                comparisonFunction = (a, b) => a.response[sortField] - b.response[sortField];
            }
            routesShown.sort(comparisonFunction);
        }
        for (let i = 0; i < routesShown.length; i++) {
            routesShown[i].displayNumber = i + 1;
        }
        for (let i = 0; i < hovRoutes.length; i++) {
            let parentIndex = routesShown.findIndex(r => r.response.uid == hovRoutes[i].response.hovIndex);
            routesShown.splice(parentIndex + 1, 0, hovRoutes[i]);
            routesShown[parentIndex + 1].displayNumber = routesShown[parentIndex].displayNumber + 8;
        }
        if (normalRoutesReceived > Math.min(options.maxRoutes, 10)) routesShown = routesShown.slice(0, routesShown.findIndex(r => r.displayNumber == Math.min(options.maxRoutes, 10) + 1));
        if (routeSelectedLast != -1) routeSelected = routeSelectedLast;
        if (routeSelected >= routesShown.length) routeSelected = routesShown.length - 1;
        createSummaries();
        drawRoutes(true);
    }

    function getFieldTotal(route, field) {
        let total = 0;
        for (let i = 0; i < route.response.results.length; i++) {
            total += route.response.results[i][field];
        }
        return total;
    }

    function switchRoute() {
        for (let i = 0; i < routesShown.length; i++) {
            let summary = getByID('summary-' + i);
            summary.className = (routeSelected == i) ? SCRIPT_ID + (routesShown[i].response.hovIndex == -1 ? '_summary_selected' : '_summary_hov_selected') : SCRIPT_ID + (routesShown[i].response.hovIndex == -1 ? '_summary_normal' : '_summary_hov');
        }

        let z;
        for (let name of SCRIPT_LAYERS_TO_COVER) {
            try {
                baseZIndex = Math.max(baseZIndex, sdk.Map.getLayerZIndex({layerName: name}));
            } catch (ex) {}
        }
        let routeLayerZIndex = sdk.Map.getLayerZIndex({layerName: ROUTE_LAYER_NAME});
        if (routeLayerZIndex < baseZIndex) {
            sdk.Map.setLayerZIndex({layerName: ROUTE_LAYER_NAME, zIndex: baseZIndex + 1});
        } else {
            baseZIndex = routeLayerZIndex;
        }
        reorderLayers(1);

        drawRoutes(true);
    }

    function reorderLayers(mode) {
        if (baseZIndex == -1) return;
        if (originalZIndices.length == 0) {
            for (let i = 0; i < WME_LAYERS_TO_MOVE.length; i++) {
                originalZIndices[i] = -1;
            }
        }
        for (let i = 0; i < WME_LAYERS_TO_MOVE.length; i++) {
            let z = -1;
            try {
                z = sdk.Map.getLayerZIndex({layerName: WME_LAYERS_TO_MOVE[i]});
                if (mode) {
                    if (originalZIndices[i] == -1) {
                        originalZIndices[i] = z;
                    }
                    if (z != baseZIndex - WME_LAYERS_TO_MOVE.length + i) {
                        sdk.Map.setLayerZIndex({layerName: WME_LAYERS_TO_MOVE[i], zIndex: baseZIndex - WME_LAYERS_TO_MOVE.length + i});
                        sdk.Map.redrawLayer({layerName: WME_LAYERS_TO_MOVE[i]});
                    }
                } else {
                    if (z != originalZIndices[i]) {
                        sdk.Map.setLayerZIndex({layerName: WME_LAYERS_TO_MOVE[i], zIndex: originalZIndices[i]});
                        sdk.Map.redrawLayer({layerName: WME_LAYERS_TO_MOVE[i]});
                    }
                }
            } catch (ex) {
                if (!alreadyReportedWMELayer) {
                    error("WME layer " + WME_LAYERS_TO_MOVE[i] + " not found: " + ex);
                    alreadyReportedWMELayer = true;
                }
            }
        }
    }

    function drawRoutes(recreate) {
        sdk.Map.removeAllFeaturesFromLayer({layerName: ROUTE_LAYER_NAME});
        if (recreate) {
            storedFeatures = [];
            for (let i = routesShown.length - 1; i >= 0; i--) {
                if (i == routeSelected) continue;
                createRouteFeatures(i)
            }
            if (routeSelected != -1 && routesShown.length) {
                createRouteFeatures(routeSelected)
            }
        }
        sdk.Map.addFeaturesToLayer({
            layerName: ROUTE_LAYER_NAME,
            features: storedFeatures
        });
    }

    function createSummaries() {
        var summaryDiv = getByID('summaries');
        summaryDiv.innerHTML = '';
        let lengthUnit = options.useMiles ? "miles" : "km";
        let speedUnit = options.useMiles ? "mph" : "km/h";
        for (let i = 0; i < routesShown.length; i++) {
            summaryDiv.innerHTML += '<div id=' + SCRIPT_ID + '-summary-' + i + ' class=' + SCRIPT_ID + (routesShown[i].response.hovIndex == -1 ? '_summary_normal' : '_summary_hov') + ' style="z-index:' + (20 - i) + ';"></div>';
        }
        for (let i = 0; i < routesShown.length; i++) {
            let routeDiv = getByID('summary-' + i);
            routeDiv.onclick = function(){ toggleRoute(i) };

            let hov = (routesShown[i].response.hovIndex != -1);
            if (routeSelected == i) routeDiv.className = SCRIPT_ID + (hov ? '_summary_hov_selected' : '_summary_selected');

            let html = '<div class=' + SCRIPT_ID + '_header' + (hov ? '_hov' : '') + ' style="background: ' + getRouteColor(routesShown[i].displayNumber) + '; color:#e0e0e0; "></div>';
            html += '<div style="min-width:24px; display:inline-block; font-size:' + (hov ? '11px' : '14px') + '; color:' + (hov ? '#686868' : '#404040') + '; padding-right:' + (hov ? '5px' : '0px') + '; text-align:right;"><b>' + (hov ? '&#x2662;' : routesShown[i].displayNumber + '.') + '</b></div>';

            let lengthM = 0;
            for (let s = 0; s < routesShown[i].response.results.length; s++) {
                lengthM += routesShown[i].response.results[s].length;
            }
            let length = lengthM / 1000;
            if (options.useMiles) length /= KM_PER_MILE;
            let lengthText = length.toFixed(2);

            let time = options.liveTraffic ? routesShown[i].response.totalRouteTime : routesShown[i].response.totalRouteTimeWithoutRealtime;
            let timeText = getTimeText(time);

            html += '<div style="min-width:57px; display:inline-block; font-size:' + (hov ? '11px' : '14px') + '; padding-right:' + (hov ? '4px' : '0px') + '; text-align:right;">' + lengthText + '</div>';
            html += '<span style="color:' + (hov ? '#686868' : '#404040') + ';"> ' + lengthUnit + '</span>';
            html += '<div style="min-width:75px; display:inline-block; font-size:' + (hov ? '11px' : '14px') + '; padding-right:' + (hov ? '5px' : '0px') + '; font-weight:' + (hov ? 500 : 700) + '; text-align:right;">' + timeText + '</div>';

            let avgSpeed = getSpeed(lengthM, time);
            html += '<div style="min-width:48px; display:inline-block; font-size:' + (hov ? '11px' : '14px') + '; padding-right:' + (hov ? '2px' : '0px') + '; text-align:right;">' + avgSpeed.toFixed(1) + '</div>';
            html += '<span style="color:' + (hov ? '#686868' : '#404040') + ';"> ' + speedUnit + '</span>';

            if (options.showRouteText) {
                let laneTypes = [];
                if (routesShown[i].response.routeAttr.includes('Toll')) {
                    if (routesShown[i].response.tollPrice) {
                        laneTypes.push('Toll (' + routesShown[i].response.tollPrice + ')');
                    } else {
                        laneTypes.push('Toll');
                    }
                }
                laneTypes.push(...routesShown[i].response.laneTypes);
                let separator = '';
                if (routesShown[i].response.minPassengers) separator += " (" + routesShown[i].response.minPassengers + "+)";
                if (laneTypes.length) separator += ': ';
                html += '<div style="color:' + (hov ? '#404040' : '#000000') + '; line-height:normal; font-variant-numeric:normal;">' + laneTypes.join(', ') + separator + routesShown[i].response.routeName + '</div>';
            }

            routeDiv.innerHTML = html;
            routeDiv.style.visibility = 'visible';
        }

        summaryDiv.style.visibility = 'visible';
    }

    function handleRouteRequestError(message) {
        warn("route request error: " + message.replace("<br>", "\n"));

        getByID('button-livemap').style.backgroundColor = '';
        getByID('button-reverse').style.backgroundColor = '';

        getByID('summaries').style.visibility = 'hidden';
        getByID('summaries').innerHTML = '';

        routesReceived = [];
        sortRoutes();

        getByID('error').innerHTML = "<br>" + message;
        getByID('routecount').innerHTML = '';
    }

    function livemapRouteClick() {
        routeSelected = 0;
        routeSelectedLast = -1;

        livemapRoute();
    }

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

        getByID('sidepanel-a').value = lon1 + lat1;
        getByID('sidepanel-b').value = lon2 + lat2;
    }

    function livemapRoute() {

        if (!options.enableScript) return;
        if (waitingForRoute) return;

        let stra = getByID('sidepanel-a').value;
        let strb = getByID('sidepanel-b').value;

        let pastedlink = false;

        //sprawdzenie czy wklejono link z LiveMap, jeżeli tak to sparsowanie i przeformatowanie współrzędnych oraz przeniesienie widoku mapy na miejsce wklejonej trasy
        //(checking if the link from LiveMap has been pasted, if yes, paring and reformatting the coordinates and moving the map view to the location of the pasted route)
        if (stra.indexOf('livemap?') >= 0 || stra.indexOf('livemap/?') >= 0) {
            get_coords_from_livemap_link(stra);
            stra = getByID('sidepanel-a').value;
            strb = getByID('sidepanel-b').value;
            pastedlink = true;
        }
        else if (strb.indexOf('livemap?') >= 0 || strb.indexOf('livemap/?') >= 0) {
            get_coords_from_livemap_link(strb);
            stra = getByID('sidepanel-a').value;
            strb = getByID('sidepanel-b').value;
            pastedlink = true;
        }

        stra = getByID('sidepanel-a').value;
        strb = getByID('sidepanel-b').value;
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

        let objprog1 = getByID('button-livemap');
        objprog1.style.backgroundColor = '#FF8000';

        createMarkers(x1, y1, x2, y2);

        if (pastedlink) {
            clickA();
        }

        requestRouteFromLiveMap(false);
    }

    //--------------------------------------------------------------------------
    // Map event handlers

    function onMapDataLoaded(event) {
        if (!options.enableScript) return;
        updateTopCountry();
    }

    function onMapMoveEnd(event) {
        if (!options.enableScript) return;
        drawRoutes(false);
    }

    function mouseEnterHandler(event) {
        if (!startFirstClickRegistered) {
            sdk.Events.on({
                eventName: "wme-map-mouse-down",
                eventHandler: startFirstClick
            });
            startFirstClickRegistered = true;
        }
        if (markerMoving != event.featureId) {
            markerMoving = event.featureId;
        }
    }

    function mouseLeaveHandler(event) {
        if (startFirstClickRegistered) {
            sdk.Events.off({
                eventName: "wme-map-mouse-down",
                eventHandler: startFirstClick
            });
            startFirstClickRegistered = false;
        }
        markerMoving = "none";
    }

    function startFirstClick(event) {
        sdk.Events.on({
            eventName: "wme-map-mouse-up",
            eventHandler: onFirstClick
        });
        sdk.Events.on({
            eventName: "wme-map-mouse-move",
            eventHandler: cancelFirstClick
        });
    }

    function cancelFirstClick(event) {
        sdk.Events.off({
            eventName: "wme-map-mouse-up",
            eventHandler: onFirstClick
        });
        sdk.Events.off({
            eventName: "wme-map-mouse-move",
            eventHandler: cancelFirstClick
        });
    }

    function onFirstClick(event) {
        sdk.Events.stopLayerEventsTracking({layerName: MARKER_LAYER_NAME});
        sdk.Events.off({
            eventName: "wme-map-mouse-down",
            eventHandler: startFirstClick
        });
        startFirstClickRegistered = false;
        cancelFirstClick(event);
        sdk.Events.on({
            eventName: "wme-map-mouse-down",
            eventHandler: startSecondClick
        });
        let markerLocationPixel = sdk.Map.getMapPixelFromLonLat({
            lonLat: {
                lon: markerMoving == "A" ? pointA.lon : pointB.lon,
                lat: markerMoving == "A" ? pointA.lat : pointB.lat
            }
        });
        let offsetX = markerLocationPixel.x - event.x;
        let offsetY = markerLocationPixel.y - event.y;
        mouseMoveHandler = ({x, y}) => onMouseMoveWithMarker(markerMoving, x + offsetX, y + offsetY);
        sdk.Events.on({
            eventName: "wme-map-mouse-move",
            eventHandler: mouseMoveHandler
        });
    }

    function onMouseMoveWithMarker(id, x, y) {
        let newLocation = sdk.Map.getLonLatFromMapPixel({x: x, y: y});
        moveMarker(id, newLocation.lon, newLocation.lat);
    }

    function startSecondClick(event) {
        sdk.Events.off({
            eventName: "wme-map-mouse-move",
            eventHandler: mouseMoveHandler
        });
        sdk.Events.on({
            eventName: "wme-map-mouse-up",
            eventHandler: onSecondClick
        });
        sdk.Events.on({
            eventName: "wme-map-mouse-move",
            eventHandler: cancelSecondClick
        });
    }

    function cancelSecondClick(event) {
        sdk.Events.off({
            eventName: "wme-map-mouse-up",
            eventHandler: onSecondClick
        });
        sdk.Events.off({
            eventName: "wme-map-mouse-move",
            eventHandler: cancelSecondClick
        });
        sdk.Events.on({
            eventName: "wme-map-mouse-move",
            eventHandler: mouseMoveHandler
        });
    }

    function onSecondClick(event) {
        sdk.Events.off({
            eventName: "wme-map-mouse-down",
            eventHandler: startSecondClick
        });
        sdk.Events.off({
            eventName: "wme-map-mouse-up",
            eventHandler: onSecondClick
        });
        sdk.Events.off({
            eventName: "wme-map-mouse-move",
            eventHandler: cancelSecondClick
        });
        mouseEnterHandler({featureId: markerMoving});
        sdk.Events.trackLayerEvents({layerName: MARKER_LAYER_NAME});

        let lon1 = parseInt(pointA.lon * 1000000.0 + 0.5) / 1000000.0;
        let lat1 = parseInt(pointA.lat * 1000000.0 + 0.5) / 1000000.0;
        let lon2 = parseInt(pointB.lon * 1000000.0 + 0.5) / 1000000.0;
        let lat2 = parseInt(pointB.lat * 1000000.0 + 0.5) / 1000000.0;
        if (getByID('sidepanel-a') !== undefined) {
            getByID('sidepanel-a').value = lon1 + ", " + lat1;
            getByID('sidepanel-b').value = lon2 + ", " + lat2;
        }
        var objprog1 = getByID('button-livemap');
        if (objprog1.style.backgroundColor === '') objprog1.style.backgroundColor = '#FF8000';

        requestRouteFromLiveMap(true);
    }

    //--------------------------------------------------------------------------
    // Sidebar event handlers

    function changeRememberEnabled() {
        options.rememberEnabled = getByID('remember-enabled').value;
    }

    function clickRequireTab() {
        options.requireTab = (getByID('require-tab').checked === true);
    }

    function clickClearSelection() {
        options.clearSelection = (getByID('clear-selection').checked === true);
    }

    function resetRoutingOptionsClick() {
        if (waitingForRoute) return;

        resetRoutingOptions();

        $(`.` + SCRIPT_ID + `-pass-checkbox`).prop( "checked", false );;
        options.passes = [];

        livemapRoute();
    }

    function hourChange() {

        livemapRoute();
    }

    function dayChange() {

        livemapRoute();
    }

    function clickA() {
        if (pointA.lon !== undefined) sdk.Map.setMapCenter({lonLat: pointA});
    }
    function clickB() {
        if (pointB.lon !== undefined) sdk.Map.setMapCenter({lonLat: pointB});
    }

    function clickEnableScript() {
        options.enableScript = (getByID('enablescript').checked === true);

        if (!options.enableScript) {
            getByID('sidepanel').style.color = "#A0A0A0";

            getByID('summaries').style.visibility = 'hidden';

            sdk.Map.setLayerVisibility({layerName: MARKER_LAYER_NAME, visibility: false});
            sdk.Map.removeAllFeaturesFromLayer({layerName: ROUTE_LAYER_NAME});
            reorderLayers(0);
        }
        else {
            getByID('sidepanel').style.color = "";
            sdk.Map.setLayerVisibility({layerName: MARKER_LAYER_NAME, visibility: true});
            if (routesShown.length > 0) drawRoutes(false);
            reorderLayers(1);
        }
    }

    function clickReverseRoute() {
        if (!options.enableScript || waitingForRoute) return;
        let newA = [pointB.lon, pointB.lat];
        let newB = [pointA.lon, pointA.lat];
        if (getByID('sidepanel-a') !== undefined) {
            getByID('sidepanel-a').value = newA[0].toFixed(6) + ", " + newA[1].toFixed(6);
            getByID('sidepanel-b').value = newB[0].toFixed(6) + ", " + newB[1].toFixed(6);
        }
        createMarkers(newA[0], newA[1], newB[0], newB[1]);
        requestRouteFromLiveMap(false);
    }

    function clickShowLabels() {
        options.showLabels = (getByID('showLabels').checked === true);
        drawRoutes(true);
    }

    function clickShowSpeeds() {
        options.showSpeeds = (getByID('showSpeeds').checked === true);
        drawRoutes(true);
    }

    function clickUseMiles() {
        options.useMiles = (getByID('usemiles').checked === true);
        createSummaries();
        drawRoutes(options.showLabels && options.showSpeeds);
    }

    function clickShowRouteText() {
        options.showRouteText = (getByID('routetext').checked === true);
        createSummaries();
    }

    function clickGetAlternatives() {
        routeSelected = 0;
        routeSelectedLast = -1;

        options.getAlternatives = (getByID('getalternatives').checked === true);
        if (options.getAlternatives && normalRoutesReceived < options.maxRoutes) {
            livemapRoute();
        } else {
            sortRoutes();
        }
    }

    function clickMaxRoutes() {
        options.getAlternatives = (getByID('getalternatives').checked === true);

        options.maxRoutes = parseInt(getByID('maxroutes').value);
        if (options.getAlternatives && normalRoutesReceived < options.maxRoutes) {
            livemapRoute();
        } else {
            sortRoutes();
        }
    }

    function clickLiveTraffic() {
        options.liveTraffic = (getByID('livetraffic').checked === true);
        sortRoutes();
    }

    function clickAvoidTolls() {
        options.avoidTolls = (getByID('avoidtolls').checked === true);
        livemapRoute();
    }

    function clickAvoidFreeways() {
        options.avoidFreeways = (getByID('avoidfreeways').checked === true);
        livemapRoute();
    }

    function changeUnpavedRule() {
        let rule = parseInt(getByID('unpaved-rule').value);
        if (rule == 0) {
            options.avoidUnpaved = true;
            options.avoidLongUnpaved = false;
        } else if (rule == 1) {
            options.avoidUnpaved = false;
            options.avoidLongUnpaved = true;
        } else {
            options.avoidUnpaved = false;
            options.avoidLongUnpaved = false;
        }
        livemapRoute();
    }

    function clickRouteType() {
        options.routeType = parseInt(getByID('routetype').value);
        livemapRoute();
    }

    function clickAllowUTurns() {
        options.allowUTurns = (getByID('allowuturns').checked === true);
        livemapRoute();
    }

    function clickSortResults() {
        options.routingOrder = !(getByID('sortresults').checked === true);
        sortRoutes();
    }

    function changeSortBy() {
        options.sortBy = getByID('sortby').value;
        sortRoutes();
    }

    function clickUseRBS() {
        options.useRBS = (getByID('userbs').checked === true);
        livemapRoute();
    }

    function clickAvoidDifficult() {
        options.avoidDifficult = (getByID('avoiddifficult').checked === true);
        livemapRoute();
    }

    function clickAvoidFerries() {
        options.avoidFerries = (getByID('avoidferries').checked === true);
        livemapRoute();
    }

    function clickVehicleType() {
        options.vehicleType = (getByID('vehicletype').value);
        livemapRoute();
    }

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

    function toggleRoute(routeIndex) {
        if (routeSelected == routeIndex) routeIndex = -1;
        routeSelected = routeIndex;
        routeSelectedLast = routeIndex;
        switchRoute();
    }

    function enterAB(ev) {
        if (ev.keyCode === 13) {
            livemapRoute();
        }
    }

    //--------------------------------------------------------------------------
    // Code execution starts here
    unsafeWindow.SDK_INITIALIZED.then(onSDKInitialized);

})();
