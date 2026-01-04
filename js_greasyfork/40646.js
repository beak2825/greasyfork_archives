/// <reference path="../typescript-typings/globals/openlayers/index.d.ts" />
/// <reference path="../typescript-typings/I18n.d.ts" />
/// <reference path="../typescript-typings/waze.d.ts" />
/// <reference path="../typescript-typings/globals/jquery/index.d.ts" />
/// <reference path="WME Wide-Angle Lens.user.ts" />
/// <reference path="../typescript-typings/greasyfork.d.ts" />
// ==UserScript==
// @name                WME Wide-Angle Lens Streets
// @namespace           https://greasyfork.org/en/users/19861-vtpearce
// @description         Find streets that match filter criteria
// @author              vtpearce and crazycaveman
// @match               https://*.waze.com/*editor*
// @exclude             https://*.waze.com/user/editor*
// @exclude             https://www.waze.com/discuss/*
// @version             2025.07.07.001
// @grant               GM_xmlhttpRequest
// @copyright           2020 vtpearce
// @license             CC BY-SA 4.0
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @connect             greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/40646/WME%20Wide-Angle%20Lens%20Streets.user.js
// @updateURL https://update.greasyfork.org/scripts/40646/WME%20Wide-Angle%20Lens%20Streets.meta.js
// ==/UserScript==
// @updateURL           https://greasyfork.org/en/scripts/418292-wme-wide-angle-lens-streets-beta/code/WME%20Wide-Angle%20Lens%20Streets.meta.js
// @downloadURL         https://greasyfork.org/en/scripts/418292-wme-wide-angle-lens-streets-beta/code/WME%20Wide-Angle%20Lens%20Streets.user.js
/*global W, OL, $, WazeWrap, WMEWAL, OpenLayers, I18n */
var WMEWAL_Streets;
(function (WMEWAL_Streets) {
    const SCRIPT_NAME = GM_info.script.name;
    const SCRIPT_VERSION = GM_info.script.version.toString();
    const DOWNLOAD_URL = GM_info.script.downloadURL;
    const updateText = '<ul>'
        + '<li>Enables road closures if hasRoadClosure is checked.</li>'
        + '</ul>';
    const greasyForkPage = 'https://greasyfork.org/scripts/40646';
    const wazeForumThread = 'https://www.waze.com/forum/viewtopic.php?t=206376';
    const ctlPrefix = "_wmewalStreets";
    const minimumWALVersionRequired = "2025.04.10.001";
    let Direction;
    (function (Direction) {
        Direction[Direction["OneWay"] = 1] = "OneWay";
        Direction[Direction["TwoWay"] = 2] = "TwoWay";
        Direction[Direction["Unknown"] = 3] = "Unknown";
    })(Direction || (Direction = {}));
    let Operation;
    (function (Operation) {
        Operation[Operation["Equal"] = 1] = "Equal";
        Operation[Operation["NotEqual"] = 2] = "NotEqual";
        Operation[Operation["LessThan"] = 3] = "LessThan";
        Operation[Operation["LessThanOrEqual"] = 4] = "LessThanOrEqual";
        Operation[Operation["GreaterThan"] = 5] = "GreaterThan";
        Operation[Operation["GreaterThanOrEqual"] = 6] = "GreaterThanOrEqual";
    })(Operation || (Operation = {}));
    let HasOrMissing;
    (function (HasOrMissing) {
        HasOrMissing[HasOrMissing["Missing"] = 0] = "Missing";
        HasOrMissing[HasOrMissing["Has"] = 1] = "Has";
    })(HasOrMissing || (HasOrMissing = {}));
    let IncomingOrOutgoing;
    (function (IncomingOrOutgoing) {
        IncomingOrOutgoing[IncomingOrOutgoing["Incoming"] = 0] = "Incoming";
        IncomingOrOutgoing[IncomingOrOutgoing["Outgoing"] = 1] = "Outgoing";
    })(IncomingOrOutgoing || (IncomingOrOutgoing = {}));
    let PrimaryOrAlt;
    (function (PrimaryOrAlt) {
        PrimaryOrAlt[PrimaryOrAlt["PrimaryOnly"] = 0] = "PrimaryOnly";
        PrimaryOrAlt[PrimaryOrAlt["AltOnly"] = 1] = "AltOnly";
        PrimaryOrAlt[PrimaryOrAlt["Either"] = 2] = "Either";
        PrimaryOrAlt[PrimaryOrAlt["Both"] = 3] = "Both";
    })(PrimaryOrAlt || (PrimaryOrAlt = {}));
    let Issue;
    (function (Issue) {
        Issue[Issue["NoSpeedLimit"] = 1] = "NoSpeedLimit";
        Issue[Issue["TimeBasedRestrictions"] = 2] = "TimeBasedRestrictions";
        Issue[Issue["TimeBasedTurnRestrictions"] = 4] = "TimeBasedTurnRestrictions";
        Issue[Issue["RestrictedJunctionArrows"] = 8] = "RestrictedJunctionArrows";
        Issue[Issue["UTurn"] = 16] = "UTurn";
        Issue[Issue["SoftTurns"] = 32] = "SoftTurns";
        Issue[Issue["UnnecessaryJunctionNode"] = 64] = "UnnecessaryJunctionNode";
        Issue[Issue["Elevation"] = 128] = "Elevation";
        Issue[Issue["SegmentLength"] = 256] = "SegmentLength";
        Issue[Issue["NoName"] = 512] = "NoName";
        Issue[Issue["NoCity"] = 1024] = "NoCity";
        Issue[Issue["RoutingPreference"] = 2048] = "RoutingPreference";
        Issue[Issue["UnknownDirection"] = 4096] = "UnknownDirection";
        Issue[Issue["NoHN"] = 8192] = "NoHN";
        Issue[Issue["RampWithSL"] = 16384] = "RampWithSL";
        Issue[Issue["Plus1RoutingPreference"] = 32768] = "Plus1RoutingPreference";
        Issue[Issue["Minus1RoutingPreference"] = 65536] = "Minus1RoutingPreference";
        Issue[Issue["NewlyPaved"] = 131072] = "NewlyPaved";
        Issue[Issue["OneWay"] = 262144] = "OneWay";
        Issue[Issue["HasClosures"] = 524288] = "HasClosures";
        Issue[Issue["HasTIO"] = 1048576] = "HasTIO";
        Issue[Issue["Loop"] = 2097152] = "Loop";
        Issue[Issue["Shield"] = 4194304] = "Shield";
        Issue[Issue["ShieldDirection"] = 8388608] = "ShieldDirection";
        Issue[Issue["TI"] = 16777216] = "TI";
        Issue[Issue["TITTS"] = 33554432] = "TITTS";
        Issue[Issue["TIExit"] = 67108864] = "TIExit";
        Issue[Issue["HouseNumbersWithNoCity"] = 134217728] = "HouseNumbersWithNoCity";
        Issue[Issue["RedRoad"] = 268435456] = "RedRoad";
        Issue[Issue["ExpiredRestrictions"] = 536870912] = "ExpiredRestrictions";
    })(Issue || (Issue = {}));
    let Unit;
    (function (Unit) {
        Unit[Unit["Metric"] = 1] = "Metric";
        Unit[Unit["Imperial"] = 2] = "Imperial";
    })(Unit || (Unit = {}));
    let TIO;
    (function (TIO) {
        TIO["Continue"] = "CONTINUE";
        TIO["ExitLeft"] = "EXIT_LEFT";
        TIO["ExitRight"] = "EXIT_RIGHT";
        TIO["KeepLeft"] = "KEEP_LEFT";
        TIO["KeepRight"] = "KEEP_RIGHT";
        TIO["None"] = "NONE";
        TIO["TurnLeft"] = "TURN_LEFT";
        TIO["TurnRight"] = "TURN_RIGHT";
        TIO["UTurn"] = "UTURN";
        TIO["Any"] = "ANY";
    })(TIO || (TIO = {}));
    let pluginName = "WMEWAL-Streets";
    WMEWAL_Streets.Title = "Streets";
    WMEWAL_Streets.SupportsSegments = true;
    WMEWAL_Streets.SupportsVenues = false;
    WMEWAL_Streets.SupportsSuggestedSegments = true;
    WMEWAL_Streets.SupportsClosures = false;
    const settingsKey = "WMEWALStreetsSettings";
    const savedSettingsKey = "WMEWALStreetsSavedSettings";
    let settings = null;
    let savedSettings = [];
    let streets = null;
    let state;
    let stateName;
    let lastModifiedBy;
    let lastModifiedByName;
    let nameRegex = null;
    let cityRegex = null;
    let shieldTextRegex = null;
    let shieldDirectionRegex = null;
    let viRegex = null;
    let towardsRegex = null;
    let ttsRegex = null;
    let intersectingNameRegex = null;
    let roundabouts = null;
    let detectIssues = false;
    let initCount = 0;
    let createdBy;
    let createdByName;
    let savedSegments;
    let segmentLengthMultiplier;
    let segmentLengthFilterMultipier;
    const mToFt = 3.28084;
    let isImperial;
    let includeShields;
    function onWmeReady() {
        initCount++;
        if (WazeWrap && WazeWrap.Ready && typeof (WMEWAL) !== 'undefined' && WMEWAL && WMEWAL.RegisterPlugIn) {
            log('debug', 'WazeWrap and WMEWAL ready.');
            init();
        }
        else {
            if (initCount < 60) {
                log('debug', 'WazeWrap or WMEWAL not ready. Trying again...');
                setTimeout(onWmeReady, 1000);
            }
            else {
                log('error', 'WazeWrap or WMEWAL not ready. Giving up.');
            }
        }
    }
    function bootstrap() {
        if (W?.userscripts?.state.isReady) {
            onWmeReady();
        }
        else {
            document.addEventListener('wme-ready', onWmeReady, { once: true });
        }
    }
    async function init() {
        // Check to see if WAL is at the minimum verson needed
        if (!(typeof WMEWAL.IsAtMinimumVersion === "function" && WMEWAL.IsAtMinimumVersion(minimumWALVersionRequired))) {
            log('debug', "WAL not at required minimum version.");
            WazeWrap.Alerts.info(GM_info.script.name, "Cannot load plugin because WAL is not at the required minimum version.&nbsp;" +
                "You might need to manually update it from <a href='https://greasyfork.org/scripts/40641' target='_blank'>Greasy Fork</a>.", true, false);
            return;
        }
        if (typeof Storage !== "undefined") {
            if (localStorage[settingsKey]) {
                settings = JSON.parse(localStorage[settingsKey]);
            }
            if (localStorage[savedSettingsKey]) {
                try {
                    savedSettings = JSON.parse(WMEWAL.LZString.decompressFromUTF16(localStorage[savedSettingsKey]));
                }
                catch (e) { }
                if (typeof savedSettings === "undefined" || savedSettings === null || savedSettings.length === 0) {
                    log('debug', "decompressFromUTF16 failed, attempting decompress");
                    localStorage[savedSettingsKey + "Backup"] = localStorage[savedSettingsKey];
                    try {
                        savedSettings = JSON.parse(WMEWAL.LZString.decompress(localStorage[savedSettingsKey]));
                    }
                    catch (e) { }
                    if (typeof savedSettings === "undefined" || savedSettings === null) {
                        log('warn', "decompress failed, savedSettings unrecoverable. Using blank");
                        savedSettings = [];
                    }
                    updateSavedSettings();
                }
            }
        }
        isImperial = W.prefs.attributes.isImperial;
        if (settings == null) {
            initSettings();
        }
        else {
            if (updateProperties()) {
                updateSettings();
            }
        }
        log('log', "Initialized");
        WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, SCRIPT_VERSION, updateText, greasyForkPage, wazeForumThread);
        WMEWAL.RegisterPlugIn(WMEWAL_Streets);
    }
    function GetTab() {
        let html = "<table style='border-collapse: separate; border-spacing:0px 1px;'>";
        html += "<tbody>";
        html += "<tr><td class='wal-heading'>Saved Filters</td></tr>";
        html += "<tr><td class='wal-indent' style='padding-bottom: 8px'>" +
            `<select id='${ctlPrefix}SavedSettings'></select><br/>` +
            `<button class='btn btn-primary' id='${ctlPrefix}LoadSetting' title='Load'>Load</button>` +
            `<button class='btn btn-primary' style='margin-left: 4px;' id='${ctlPrefix}SaveSetting' title='Save'>Save</button>` +
            `<button class='btn btn-primary' style='margin-left: 4px;' id='${ctlPrefix}DeleteSetting' title='Delete'>Delete</button></td></tr>`;
        html += `<tr><td style='border-top: 1px solid'><button class='btn btn-primary' style='margin-top: 6px;margin-bottom: 6px' id='${ctlPrefix}Reset' title='Reset'>Reset</button></td></tr>`;
        html += "<tr><td class='wal-heading' style='border-top: 1px solid'>Output Options</td></tr>";
        html += `<tr><td class='wal-indent'><input type='checkbox' id='${ctlPrefix}IncludeAlt' class='wal-check'>` +
            `<label for='${ctlPrefix}IncludeAlt' class='wal-label'>Include Alt Names</label></td></tr>`;
        html += `<tr><td class='wal-indent'><input type='checkbox' id='${ctlPrefix}IncludeASC' class='wal-check'>` +
            `<label for='${ctlPrefix}IncludeASC' class='wal-label'>Include Avg Speed Cams</label></td></tr>`;
        // Filters
        html += "<tr><td class='wal-heading' style='border-top: 1px solid; padding-top: 4px'>Filters (All of these)</td></tr>";
        html += "<tr><td><b>Lock Level:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<select id='${ctlPrefix}LockLevelOp'>` +
            `<option value='${Operation.Equal}' selected='selected'>=</option>` +
            `<option value='${Operation.NotEqual}'>&lt;&gt;</option></select>` +
            `<select id='${ctlPrefix}LockLevel'>` +
            "<option value=''></option>" +
            "<option value='1'>1</option>" +
            "<option value='2'>2</option>" +
            "<option value='3'>3</option>" +
            "<option value='4'>4</option>" +
            "<option value='5'>5</option>" +
            "<option value='6'>6</option>" +
            "<option value='7'>7</option>" +
            "</select></td></tr>";
        html += "<tr><td><b>Name RegEx:</b></td></tr>";
        html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}Name' class='wal-textbox'/><br/>` +
            `<input id='${ctlPrefix}IgnoreCase' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}IgnoreCase' class='wal-label'>Ignore case</label></td></tr>`;
        html += "<tr><td><b>City RegEx:</b></td></tr>";
        html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}City' class='wal-textbox'/><br/>` +
            `<input id='${ctlPrefix}CityIgnoreCase' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}CityIgnoreCase' class='wal-label'>Ignore case</label></td></tr>`;
        html += "<tr><td><b>State:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<select id='${ctlPrefix}StateOp'>` +
            `<option value='${Operation.Equal}' selected='selected'>=</option>` +
            `<option value='${Operation.NotEqual}'>&lt;&gt;</option></select>` +
            `<select id='${ctlPrefix}State'></select></td></tr>`;
        html += "<tr><td><span style='color:red'>*</span><b>Direction:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<select id='${ctlPrefix}Direction'>` +
            "<option value=''></option>" +
            `<option value='${Direction.OneWay}'>One way</option>` +
            `<option value='${Direction.TwoWay}'>Two way</option>` +
            `<option value='${Direction.Unknown}'>Unknown</option></select></td></tr>`;
        html += "<tr><td><b>Created By:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<select id='${ctlPrefix}CreatedBy'></select></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Created' type='checkbox' class='wal-check'/>` +
            `<label for=${ctlPrefix}Created' class='wal-label'>Date Created:</label> ` +
            `<select id='${ctlPrefix}CreatedOp'>` +
            `<option value='${Operation.LessThan}'>&lt;</option>` +
            `<option value='${Operation.LessThanOrEqual}'>&lt;=</option>` +
            `<option value='${Operation.GreaterThanOrEqual}' selected='selected'>&gt;=</option>` +
            `<option value='${Operation.GreaterThan}'>&gt;</option></select>` +
            "</td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<input id='${ctlPrefix}CreatedDate' type='date'/> <input id='${ctlPrefix}CreatedTime' type='time'/></td></tr>`;
        html += "<tr><td><span style='color:red'>*</span><b>Last Updated By:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<select id='${ctlPrefix}LastModifiedBy'></select></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Updated' type='checkbox' class='wal-check'/>` +
            `<label for=${ctlPrefix}Updated' class='wal-label'><span style='color:red'>*</span>Date Updated:</label> ` +
            `<select id='${ctlPrefix}UpdatedOp'>` +
            `<option value='${Operation.LessThan}'>&lt;</option>` +
            `<option value='${Operation.LessThanOrEqual}'>&lt;=</option>` +
            `<option value='${Operation.GreaterThanOrEqual}' selected='selected'>&gt;=</option>` +
            `<option value='${Operation.GreaterThan}'>&gt;</option></select>` +
            "</td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<input id='${ctlPrefix}UpdatedDate' type='date'/> <input id='${ctlPrefix}UpdatedTime' type='time'/></td></tr>`;
        html += "<tr><td><b>Shield Text RegEx:</b></td></tr>";
        html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}ShieldTextRegex' class='wal-textbox'/><br/>` +
            `<input id='${ctlPrefix}ShieldTextIgnoreCase' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}ShieldTextIgnoreCase' class='wal-label'>Ignore case</label></td></tr>`;
        html += "<tr><td><b>Shield Direction RegEx:</b></td></tr>";
        html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}ShieldDirectionRegex' class='wal-textbox'/><br/>` +
            `<input id='${ctlPrefix}ShieldDirectionIgnoreCase' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}ShieldDirectionIgnoreCase' class='wal-label'>Ignore case</label></td></tr>`;
        html += "<tr><td><b>Visual Instruction RegEx:</b></td></tr>";
        html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}VIRegex' class='wal-textbox'/><br/>` +
            `<input id='${ctlPrefix}VIIgnoreCase' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}VIIgnoreCase' class='wal-label'>Ignore case</label></td></tr>`;
        html += "<tr><td><b>Towards RegEx:</b></td></tr>";
        html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}TowardsRegex' class='wal-textbox'/><br/>` +
            `<input id='${ctlPrefix}TowardsIgnoreCase' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}TowardsIgnoreCase' class='wal-label'>Ignore case</label></td></tr>`;
        html += "<tr><td><b>TTS RegEx:</b></td></tr>";
        html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}TTSRegex' class='wal-textbox'/><br/>` +
            `<input id='${ctlPrefix}TTSIgnoreCase' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}TTSIgnoreCase' class='wal-label'>Ignore case</label></td></tr>`;
        html += "<tr><td><b>Intersecting Name RegEx:</b></td></tr>";
        html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}IntersectingNameRegex' class='wal-textbox'/><br/>` +
            `<input id='${ctlPrefix}IntersectingNameIgnoreCase' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}IntersectingNameIgnoreCase' class='wal-label'>Ignore case</label></td></tr>`;
        html += "<tr><td><span style='color:red'>*</span><b>Road Type:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<button id='${ctlPrefix}RoadTypeAny' class='btn btn-primary' style='margin-right: 8px' title='Any'>Any</button>` +
            `<button id='${ctlPrefix}RoadTypeClear' class='btn btn-primary' title='Clear'>Clear</button>` +
            `<div><input type='checkbox' checked='checked' id='${ctlPrefix}RoadTypeFreeway' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Freeway}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypeFreeway' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Freeway))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypeRamp' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Ramp}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypeRamp' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Ramp))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypeMajorHighway' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.MajorHighway}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypeMajorHighway' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.MajorHighway))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypeMinorHighway' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.MinorHighway}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypeMinorHighway' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.MinorHighway))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypePrimary' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.PrimaryStreet}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypePrimary' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.PrimaryStreet))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypeStreet' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Street}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypeStreet' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Street))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypeAlley' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Alley}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypeAlley' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Alley))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypeUnpaved' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Unpaved}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypeUnpaved' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Unpaved))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypePLR' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.ParkingLotRoad}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypePLR' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.ParkingLotRoad))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypePrivate' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.PrivateRoad}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypePrivate' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.PrivateRoad))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypeFerry' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Ferry}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypeFerry' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Ferry))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypeWT' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.WalkingTrail}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypeWT' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.WalkingTrail))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypePB' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.PedestrianBoardwalk}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypePB' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.PedestrianBoardwalk))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypeStairway' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Stairway}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypeStairway' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Stairway))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypeRR' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Railroad}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypeRR' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Railroad))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}RoadTypeRT' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.RunwayTaxiway}' class='wal-check'/>` +
            `<label for='${ctlPrefix}RoadTypeRT' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.RunwayTaxiway))}</label></div>` +
            "</td></tr>";
        html += "<tr><td><b>Suggested Segments</b></td></tr>";
        html += '<tr><td class="wal-indent"><small><span style="color:red">*</span> Only filters marked with an asterisk apply to suggested segments</small></td></tr>';
        html += `<tr><td class='wal-indent'><select id='${ctlPrefix}SuggestedSegmentsOperation' style='margin-right: 0px'>` +
            `<option value='0'>Only</option>` +
            `<option value='1'>Include</option>` +
            `<option value='2'>Exclude</option></select><label for='${ctlPrefix}SuggestedSegmentsOperation' class='wal-label'>` +
            ` suggested segments</label></td></tr>`;
        html += `<tr><td class='wal-indent'><input id='${ctlPrefix}SuggestedSegments' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}SuggestedSegments' class='wal-label'>` +
            ` Status: </label>&nbsp;` +
            `<select id='${ctlPrefix}SuggestedSegmentsStatus' style='margin-right: 0px'>` +
            `<option value='0'>Open</option>` +
            `<option value='1'>Rejected</option></select></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Editable' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}Editable' class='wal-label'><span style='color:red'>*</span>Editable by me</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Roundabouts' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}Roundabouts' class='wal-label'>`;
        html += `<select id='${ctlPrefix}RoundaboutsOp' style='margin-right: 0px'>` +
            "<option value='0'>Exclude</option>" +
            "<option value='1'>Only</option>" +
            "</select> Roundabouts</label></td></tr>";
        html += `<tr><td><input id='${ctlPrefix}ExcludeJunctionBoxes' type='checkbox' checked='checked' class='wal-check'/>` +
            `<label for='${ctlPrefix}ExcludeJunctionBoxes' class='wal-label'>Exclude Junction Boxes</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Unpaved' type='checkbox' checked='checked' class='wal-check'/>` +
            `<label for='${ctlPrefix}Unpaved' class='wal-label'>` + I18n.t("edit.segment.fields.unpaved") + "</label></td></tr>";
        html += `<tr><td><input id='${ctlPrefix}Tunnel' type='checkbox' checked='checked' class='wal-check'/>` +
            `<label for='${ctlPrefix}Tunnel' class='wal-label'>` + I18n.t("edit.segment.fields.tunnel") + "</label></td></tr>";
        html += `<tr><td><input id='${ctlPrefix}HeadlightsRequired' type='checkbox' checked='checked' class='wal-check'/>` +
            `<label for='${ctlPrefix}HeadlightsRequired' class='wal-label'>` + I18n.t("edit.segment.fields.headlights") + "</label></td></tr>";
        html += `<tr><td><input id='${ctlPrefix}NearHOV' type='checkbox' checked='checked' class='wal-check'/>` +
            `<label for='${ctlPrefix}NearHOV' class='wal-label'>` + I18n.t("edit.segment.fields.nearbyHOV") + "</label></td></tr>";
        html += `<tr><td><input id='${ctlPrefix}Toll' type='checkbox' checked='checked' class='wal-check'/>` +
            `<label for='${ctlPrefix}Toll' class='wal-label'>${I18n.t("edit.segment.fields.toll_road")}</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Beacons' type='checkbox' checked='checked' class='wal-check'/>` +
            `<label for='${ctlPrefix}Beacons' class='wal-label'>` + I18n.t("edit.segment.fields.beacons") + "</label></td></tr>";
        html += `<tr><td><input id='${ctlPrefix}LaneGuidance' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}LaneGuidance' class='wal-label'>`;
        html += `<select id='${ctlPrefix}LaneGuidanceOp' style='margin-right: 0px'>` +
            "<option value='0'>Has</option>" +
            "<option value='1'>Missing</option>" +
            "</select> Lane guidance</label></td></tr>";
        html += `<tr><td><input id='${ctlPrefix}SegmentLengthFilter' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}SegmentLengthFilter' class='wal-label'>Segment length</label>&nbsp;` +
            `<select id='${ctlPrefix}SegmentLengthFilterOperation' style='margin-right: 0px'>` +
            `<option value='${Operation.LessThan}'>&lt;</option>` +
            `<option value='${Operation.LessThanOrEqual}'>&lt;=</option>` +
            `<option value='${Operation.GreaterThan}'>&gt;</option>` +
            `<option value='${Operation.GreaterThanOrEqual}'>&gt;=</option></select>` +
            `<input type='text' id='${ctlPrefix}SegmentLengthFilterValue' class='wal-textbox' style='width: 40px'/> ` +
            `<select id='${ctlPrefix}SegmentLengthFilterUnit' style='margin-right: 0px'>` +
            `<option value='${Unit.Metric}'>m</option>` +
            `<option value='${Unit.Imperial}'>ft</option></select>` +
            "</td></tr>";
        // Issues
        html += "<tr><td class='wal-heading' style='border-top: 1px solid; padding-top: 4px'>Issues (Any of these)</td></tr>";
        html += `<tr><td><input id='${ctlPrefix}NoSpeedLimit' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}NoSpeedLimit' class='wal-label'>No speed limit</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}HasRestrictions' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}HasRestrictions' class='wal-label'>Has time-based restrictions</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}HasTurnRestrictions' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}HasTurnRestrictions' class='wal-label'>Has time-based turn restrictions</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}UnknownDirection' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}UnknownDirection' class='wal-label'>Unknown Direction</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}OneWay' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}OneWay' class='wal-label'>One way</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}HasRestrictedJunctionArrow' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}HasRestrictedJunctionArrow' class='wal-label'>Has restricted junction arrow</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}HasUTurn' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}HasUTurn' class='wal-label'>Has U-turn</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}HasSoftTurns' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}HasSoftTurns' class='wal-label'>Has soft turns</label></td></tr>`;
        // html += `<tr><td><input id='${ctlPrefix}HasExtraJunctionNode' type='checkbox' class='wal-check'/>` +
        //     `<label for='${ctlPrefix}HasExtraJunctionNode' class='wal-label'>Has unnecessary junction node</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Elevation' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}Elevation' class='wal-label'>Elevation</label>&nbsp;` +
            `<select id='${ctlPrefix}ElevationOperation'>` +
            `<option value='${Operation.LessThan}'>&lt;</option>` +
            `<option value='${Operation.NotEqual}'>!=</option>` +
            `<option value='${Operation.GreaterThan}'>&gt;</option>` +
            "</select>0" +
            "</td></tr>";
        html += `<tr><td><input id='${ctlPrefix}SegmentLength' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}SegmentLength' class='wal-label'>Segment length</label>&nbsp;` +
            `<select id='${ctlPrefix}SegmentLengthOperation' style='margin-right: 0px'>` +
            `<option value='${Operation.LessThan}'>&lt;</option>` +
            `<option value='${Operation.LessThanOrEqual}'>&lt;=</option>` +
            `<option value='${Operation.GreaterThan}'>&gt;</option>` +
            `<option value='${Operation.GreaterThanOrEqual}'>&gt;=</option></select>` +
            `<input type='text' id='${ctlPrefix}SegmentLengthValue' class='wal-textbox' style='width: 40px'/> ` +
            `<select id='${ctlPrefix}SegmentLengthUnit' style='margin-right: 0px'>` +
            `<option value='${Unit.Metric}'>m</option>` +
            `<option value='${Unit.Imperial}'>ft</option></select>` +
            "</td></tr>";
        html += `<tr><td><input id='${ctlPrefix}HasNoName' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}HasNoName' class='wal-label'>Has no name</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}HasNoCity' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}HasNoCity' class='wal-label'>Has no city</label>&nbsp;` +
            `<select id='${ctlPrefix}HasNoCityOperation'>` +
            `<option value=${PrimaryOrAlt.PrimaryOnly}>Primary Only</option>` +
            `<option value=${PrimaryOrAlt.AltOnly}'>Alt Only</option>` +
            `<option value=${PrimaryOrAlt.Either}>Either</option>` +
            `<option value=${PrimaryOrAlt.Both}>Both</option>` +
            '</select>' +
            '</td></tr>';
        html += `<tr><td><input id='${ctlPrefix}NoHN' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}NoHN' class='wal-label'>Has no house numbers</label></td></tr>`;
        //        html += `<tr><td><input id='${ctlPrefix}NonNeutralRoutingPreference' type='checkbox' class='wal-check'/>` +
        //            `<label for='${ctlPrefix}NonNeutralRoutingPreference' class='wal-label'>Non-neutral routing preference</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Minus1RoutingPreference' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}Minus1RoutingPreference' class='wal-label'>-1 routing preference</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Plus1RoutingPreference' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}Plus1RoutingPreference' class='wal-label'>+1 routing preference</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}RampWithSL' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}RampWithSL' class='wal-label'>Ramp with speed limit</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}NewlyPaved' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}NewlyPaved' class='wal-label'>Newly paved</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}HasClosures' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}HasClosures' class='wal-label'>Has closures</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Loop' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}Loop' class='wal-label'>Loop</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Shield' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}Shield' class='wal-label'>` +
            `<select id='${ctlPrefix}ShieldOperation' style='margin-right: 0px'>` +
            `<option value='${HasOrMissing.Missing}'>Missing</option>` +
            `<option value='${HasOrMissing.Has}'>Has</option>` +
            `</select> Shield</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}ShieldDirection' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}ShieldDirection' class='wal-label'>` +
            `<select id='${ctlPrefix}ShieldDirectionOperation' style='margin-right: 0px'>` +
            `<option value='${HasOrMissing.Missing}'>Missing</option>` +
            `<option value='${HasOrMissing.Has}'>Has</option>` +
            `</select> Shield Direction</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}HouseNumbersWithNoCity' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}HouseNumbersWithNoCity' class='wal-label'>Has house numbers but no city</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}RedRoad' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}RedRoad' class='wal-label'>Red road</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}ExpiredRestrictions' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}ExpiredRestrictions' class='wal-label'>Has expired restrictions</label></td></tr>`;
        html += '<tr><td style="font-size: 1.1em; font-weight: bold">Turn Guidance</td></tr>';
        html += `<tr><td><select id='${ctlPrefix}TIDirection'>` +
            `<option value='${IncomingOrOutgoing.Incoming}'>Incoming</option>` +
            `<option value='${IncomingOrOutgoing.Outgoing}'>Outgoing</option>` +
            '</select></td></tr>';
        html += `<tr><td><input id='${ctlPrefix}TI' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}TI' class='wal-label'>` +
            `<select id='${ctlPrefix}TIOperation' style='margin-right: 0px'>` +
            `<option value='${HasOrMissing.Missing}'>Missing</option>` +
            `<option value='${HasOrMissing.Has}'>Has</option>` +
            `</select> Instruction (visual, toward)</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}TIExit' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}TIExit' class='wal-label'>` +
            `<select id='${ctlPrefix}TIExitOperation' style='margin-right: 0px'>` +
            `<option value='${HasOrMissing.Missing}'>Missing</option>` +
            `<option value='${HasOrMissing.Has}'>Has</option>` +
            `</select> Exit sign(s)</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}HasTIO' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}HasTIO' class='wal-label'>Has voice prompt:</label>&nbsp;` +
            `<select id='${ctlPrefix}TIO'>` +
            `<option value='${TIO.Any}'>Any</option>` +
            `<option value='${TIO.None}'>${I18n.t('turn_tooltip.instruction_override.opcodes.NONE')}</option>` +
            `<option value='${TIO.TurnLeft}'>${I18n.t('turn_tooltip.instruction_override.opcodes.TURN_LEFT')}</option>` +
            `<option value='${TIO.TurnRight}'>${I18n.t('turn_tooltip.instruction_override.opcodes.TURN_RIGHT')}</option>` +
            `<option value='${TIO.KeepLeft}'>${I18n.t('turn_tooltip.instruction_override.opcodes.KEEP_LEFT')}</option>` +
            `<option value='${TIO.KeepRight}'>${I18n.t('turn_tooltip.instruction_override.opcodes.KEEP_RIGHT')}</option>` +
            `<option value='${TIO.Continue}'>${I18n.t('turn_tooltip.instruction_override.opcodes.CONTINUE')}</option>` +
            `<option value='${TIO.ExitLeft}'>${I18n.t('turn_tooltip.instruction_override.opcodes.EXIT_LEFT')}</option>` +
            `<option value='${TIO.ExitRight}'>${I18n.t('turn_tooltip.instruction_override.opcodes.EXIT_RIGHT')}</option>` +
            `<option value='${TIO.UTurn}'>${I18n.t('turn_tooltip.instruction_override.opcodes.UTURN')}</option>` +
            '</select>' +
            '</td></tr>';
        html += `<tr><td><input id='${ctlPrefix}TITTS' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}TITTS' class='wal-label'>` +
            `<select id='${ctlPrefix}TITTSOperation' style='margin-right: 0px'>` +
            `<option value='${HasOrMissing.Missing}'>Missing</option>` +
            `<option value='${HasOrMissing.Has}'>Has</option>` +
            `</select> TTS</label></td></tr>`;
        html += "</tbody></table>";
        return html;
    }
    WMEWAL_Streets.GetTab = GetTab;
    function TabLoaded() {
        loadScriptUpdateMonitor();
        updateStates();
        updateUsers($(`#${ctlPrefix}LastModifiedBy`));
        updateUsers($(`#${ctlPrefix}CreatedBy`));
        updateUI();
        updateSavedSettingsList();
        $(`#${ctlPrefix}State`).on("focus", updateStates);
        $(`#${ctlPrefix}LastModifiedBy`).on("focus", function () {
            updateUsers($(`#${ctlPrefix}LastModifiedBy`));
        });
        $(`#${ctlPrefix}CreatedBy`).on("focus", function () {
            updateUsers($(`#${ctlPrefix}CreatedBy`));
        });
        $(`#${ctlPrefix}RoadTypeAny`).on("click", function () {
            $(`input[data-group=${ctlPrefix}RoadType]`).prop("checked", true);
        });
        $(`#${ctlPrefix}RoadTypeClear`).on("click", function () {
            $(`input[data-group=${ctlPrefix}RoadType]`).prop("checked", false);
        });
        $(`#${ctlPrefix}LoadSetting`).on("click", loadSetting);
        $(`#${ctlPrefix}SaveSetting`).on("click", saveSetting);
        $(`#${ctlPrefix}DeleteSetting`).on("click", deleteSetting);
        $(`#${ctlPrefix}Reset`).on("click", reset);
    }
    WMEWAL_Streets.TabLoaded = TabLoaded;
    function reset() {
        initSettings();
        updateUI();
    }
    function updateStates() {
        const selectState = $(`#${ctlPrefix}State`);
        // Preserve current selection
        const currentId = selectState.val();
        selectState.empty();
        const stateObjs = [];
        stateObjs.push({ id: null, name: "" });
        for (let s in W.model.states.objects) {
            if (W.model.states.objects.hasOwnProperty(s)) {
                const st = W.model.states.getObjectById(parseInt(s));
                if (st.getAttribute('id') !== 1 && st.getAttribute('name') !== "") {
                    stateObjs.push({ id: st.getAttribute('id'), name: st.getAttribute('name') });
                }
            }
        }
        stateObjs.sort(function (a, b) {
            if (a.id == null) {
                return -1;
            }
            else {
                return a.name.localeCompare(b.name);
            }
        });
        for (let ix = 0; ix < stateObjs.length; ix++) {
            const so = stateObjs[ix];
            const stateOption = $("<option/>").text(so.name).attr("value", so.id);
            if (currentId != null && so.id == null) {
                stateOption.attr("selected", "selected");
            }
            selectState.append(stateOption);
        }
    }
    function updateUsers(selectUsernameList) {
        // Preserve current selection
        const currentId = parseInt(selectUsernameList.val());
        selectUsernameList.empty();
        const userObjs = [];
        userObjs.push({ id: null, name: "" });
        for (let uo in W.model.users.objects) {
            if (W.model.users.objects.hasOwnProperty(uo)) {
                const u = W.model.users.getObjectById(parseInt(uo));
                if (u.type === "user" && u.getAttribute('userName') !== null && typeof u.getAttribute('userName') !== "undefined") {
                    userObjs.push({ id: u.getAttribute('id'), name: u.getAttribute('userName') });
                }
            }
        }
        userObjs.sort(function (a, b) {
            if (a.id == null) {
                return -1;
            }
            else {
                return a.name.localeCompare(b.name);
            }
        });
        for (let ix = 0; ix < userObjs.length; ix++) {
            const o = userObjs[ix];
            const userOption = $("<option/>").text(o.name).attr("value", o.id);
            if (currentId != null && o.id == null) {
                userOption.attr("selected", "selected");
            }
            selectUsernameList.append(userOption);
        }
    }
    function updateSavedSettingsList() {
        const s = $(`#${ctlPrefix}SavedSettings`);
        s.empty();
        for (let ixSaved = 0; ixSaved < savedSettings.length; ixSaved++) {
            const opt = $("<option/>").attr("value", ixSaved).text(savedSettings[ixSaved].Name);
            s.append(opt);
        }
    }
    function updateUI() {
        // $(`#${ctlPrefix}OutputTo`).val(settings.OutputTo);
        $(`#${ctlPrefix}IncludeAlt`).prop("checked", settings.IncludeAltNames);
        $(`#${ctlPrefix}IncludeASC`).prop("checked", settings.IncludeASC);
        $(`#${ctlPrefix}LockLevel`).val(settings.LockLevel);
        $(`#${ctlPrefix}LockLevelOp`).val(settings.LockLevelOperation || Operation.Equal.toString());
        $(`#${ctlPrefix}Name`).val(settings.Regex ?? "");
        $(`#${ctlPrefix}IgnoreCase`).prop("checked", settings.RegexIgnoreCase);
        $(`#${ctlPrefix}City`).val(settings.CityRegex ?? "");
        $(`#${ctlPrefix}CityIgnoreCase`).prop("checked", settings.CityRegexIgnoreCase);
        $(`#${ctlPrefix}State`).val(settings.State);
        $(`#${ctlPrefix}StateOp`).val(settings.StateOperation || Operation.Equal.toString());
        $(`#${ctlPrefix}RoadTypeFreeway`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.Freeway);
        $(`#${ctlPrefix}RoadTypeRamp`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.Ramp);
        $(`#${ctlPrefix}RoadTypeMajorHighway`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.MajorHighway);
        $(`#${ctlPrefix}RoadTypeMinorHighway`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.MinorHighway);
        $(`#${ctlPrefix}RoadTypePrimary`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.PrimaryStreet);
        $(`#${ctlPrefix}RoadTypeStreet`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.Street);
        $(`#${ctlPrefix}RoadTypeAlley`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.Alley);
        $(`#${ctlPrefix}RoadTypeUnpaved`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.Unpaved);
        $(`#${ctlPrefix}RoadTypePLR`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.ParkingLotRoad);
        $(`#${ctlPrefix}RoadTypePrivate`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.PrivateRoad);
        $(`#${ctlPrefix}RoadTypeFerry`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.Ferry);
        $(`#${ctlPrefix}RoadTypeWT`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.WalkingTrail);
        $(`#${ctlPrefix}RoadTypePB`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.PedestrianBoardwalk);
        $(`#${ctlPrefix}RoadTypeStairway`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.Stairway);
        $(`#${ctlPrefix}RoadTypeRR`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.Railroad);
        $(`#${ctlPrefix}RoadTypeRT`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.RunwayTaxiway);
        $(`#${ctlPrefix}Editable`).prop("checked", settings.EditableByMe);
        $(`#${ctlPrefix}NoSpeedLimit`).prop("checked", settings.NoSpeedLimit);
        $(`#${ctlPrefix}Roundabouts`).prop("checked", settings.Roundabouts);
        $(`#${ctlPrefix}RoundaboutsOp`).val(settings.RoundaboutsOperation);
        $(`#${ctlPrefix}ExcludeJunctionBoxes`).prop("checked", settings.ExcludeJunctionBoxes);
        $(`#${ctlPrefix}Direction`).val(settings.Direction);
        $(`#${ctlPrefix}UnknownDirection`).prop("checked", settings.UnknownDirection);
        $(`#${ctlPrefix}HasRestrictions`).prop("checked", settings.HasTimeBasedRestrictions);
        $(`#${ctlPrefix}HasTurnRestrictions`).prop("checked", settings.HasTimeBasedTurnRestrictions);
        $(`#${ctlPrefix}HasRestrictedJunctionArrow`).prop("checked", settings.HasRestrictedJunctionArrow);
        $(`#${ctlPrefix}HasUTurn`).prop("checked", settings.HasUTurn);
        $(`#${ctlPrefix}HasSoftTurns`).prop("checked", settings.HasSoftTurns);
        // $(`#${ctlPrefix}HasExtraJunctionNode`).prop("checked", settings.HasUnnecessaryJunctionNode);
        $(`#${ctlPrefix}Elevation`).prop("checked", settings.Elevation);
        $(`#${ctlPrefix}ElevationOperation`).val(settings.ElevationOperation || Operation.LessThan.toString());
        $(`#${ctlPrefix}SegmentLength`).prop("checked", settings.SegmentLength);
        $(`#${ctlPrefix}SegmentLengthOperation`).val(settings.SegmentLengthOperation || Operation.LessThan.toString());
        $(`#${ctlPrefix}SegmentLengthValue`).val(settings.SegmentLengthValue ?? "");
        $(`#${ctlPrefix}SegmentLengthUnit`).val(settings.SegmentLengthUnit || Unit.Metric.toString());
        $(`#${ctlPrefix}LastModifiedBy`).val(settings.LastModifiedBy);
        $(`#${ctlPrefix}HasNoName`).prop("checked", settings.HasNoName);
        $(`#${ctlPrefix}HasNoCity`).prop("checked", settings.HasNoCity);
        $(`#${ctlPrefix}HasNoCityOperation`).val(settings.HasNoCityOperation || PrimaryOrAlt.Either.toString());
        $(`#${ctlPrefix}NoHN`).prop("checked", settings.NoHN);
        // $(`#${ctlPrefix}NonNeutralRoutingPreference`).prop("checked", settings.NonNeutralRoutingPreference);
        $(`#${ctlPrefix}Minus1RoutingPreference`).prop("checked", settings.Minus1RoutingPreference);
        $(`#${ctlPrefix}Plus1RoutingPreference`).prop("checked", settings.Plus1RoutingPreference);
        $(`#${ctlPrefix}RampWithSL`).prop("checked", settings.RampWithSL);
        $(`#${ctlPrefix}Unpaved`).prop("checked", settings.Unpaved);
        $(`#${ctlPrefix}Tunnel`).prop("checked", settings.Tunnel);
        $(`#${ctlPrefix}HeadlightsRequired`).prop("checked", settings.HeadlightsRequired);
        $(`#${ctlPrefix}NearHOV`).prop("checked", settings.NearHOV);
        $(`#${ctlPrefix}Toll`).prop("checked", settings.Toll);
        $(`#${ctlPrefix}Beacons`).prop("checked", settings.Beacons);
        $(`#${ctlPrefix}CreatedBy`).val(settings.CreatedBy);
        $(`#${ctlPrefix}LaneGuidance`).prop("checked", settings.LaneGuidance);
        $(`#${ctlPrefix}LaneGuidanceOp`).val(settings.LaneGuidanceOperation);
        $(`#${ctlPrefix}Created`).prop("checked", settings.Created);
        $(`#${ctlPrefix}CreatedOp`).val(settings.CreatedOperation);
        if (settings.CreatedDate != null) {
            const createdDateTime = new Date(settings.CreatedDate);
            $(`#${ctlPrefix}CreatedDate`).val(createdDateTime.getFullYear().toString().padStart(4, "0") + "-" +
                (createdDateTime.getMonth() + 1).toString().padStart(2, "0") + "-" + createdDateTime.getDate().toString().padStart(2, "0"));
            $(`#${ctlPrefix}CreatedTime`).val(createdDateTime.getHours().toString().padStart(2, "0") + ":" +
                createdDateTime.getMinutes().toString().padStart(2, "0"));
        }
        else {
            $(`#${ctlPrefix}CreatedDate`).val("");
            $(`#${ctlPrefix}CreatedTime`).val("");
        }
        $(`#${ctlPrefix}Updated`).prop("checked", settings.Updated);
        $(`#${ctlPrefix}UpdatedOp`).val(settings.UpdatedOperation);
        if (settings.UpdatedDate != null) {
            const updatedDateTime = new Date(settings.UpdatedDate);
            $(`#${ctlPrefix}UpdatedDate`).val(updatedDateTime.getFullYear().toString().padStart(4, "0") + "-" +
                (updatedDateTime.getMonth() + 1).toString().padStart(2, "0") + "-" + updatedDateTime.getDate().toString().padStart(2, "0"));
            $(`#${ctlPrefix}UpdatedTime`).val(updatedDateTime.getHours().toString().padStart(2, "0") + ":" +
                updatedDateTime.getMinutes().toString().padStart(2, "0"));
        }
        else {
            $(`#${ctlPrefix}UpdatedDate`).val("");
            $(`#${ctlPrefix}UpdatedTime`).val("");
        }
        $(`#${ctlPrefix}NewlyPaved`).prop("checked", settings.NewlyPaved);
        $(`#${ctlPrefix}SegmentLengthFilter`).prop("checked", settings.SegmentLengthFilter);
        $(`#${ctlPrefix}SegmentLengthFilterOperation`).val(settings.SegmentLengthFilterOperation || Operation.LessThan.toString());
        $(`#${ctlPrefix}SegmentLengthFilterValue`).val(settings.SegmentLengthFilterValue ?? "");
        $(`#${ctlPrefix}SegmentLengthFilterUnit`).val(settings.SegmentLengthFilterUnit || Unit.Metric.toString());
        $(`#${ctlPrefix}OneWay`).prop("checked", settings.OneWay);
        $(`#${ctlPrefix}HasClosures`).prop("checked", settings.HasClosures);
        $(`#${ctlPrefix}HasTIO`).prop("checked", settings.HasTIO);
        $(`#${ctlPrefix}TIO`).val(settings.TIO);
        $(`#${ctlPrefix}Loop`).prop("checked", settings.Loop);
        $(`#${ctlPrefix}ShieldTextRegex`).val(settings.ShieldTextRegex ?? "");
        $(`#${ctlPrefix}ShieldTextIgnoreCase`).prop("checked", settings.ShieldTextRegexIgnoreCase);
        $(`#${ctlPrefix}ShieldDirectionRegex`).val(settings.ShieldDirectionRegex ?? "");
        $(`#${ctlPrefix}ShieldDirectionIgnoreCase`).prop("checked", settings.ShieldDirectionRegexIgnoreCase);
        $(`#${ctlPrefix}Shield`).prop("checked", settings.Shield);
        $(`#${ctlPrefix}ShieldOperation`).val(settings.ShieldOperation);
        $(`#${ctlPrefix}ShieldDirection`).prop("checked", settings.ShieldDirection);
        $(`#${ctlPrefix}ShieldDirectionOperation`).val(settings.ShieldDirectionOperation);
        $(`#${ctlPrefix}TI`).prop('checked', settings.TI);
        $(`#${ctlPrefix}TIOperation`).val(settings.TIOperation);
        $(`#${ctlPrefix}TITTS`).prop('checked', settings.TITTS);
        $(`#${ctlPrefix}TITTSOperation`).val(settings.TITTSOperation);
        $(`#${ctlPrefix}TIExit`).prop('checked', settings.TIExit);
        $(`#${ctlPrefix}TIExitOperation`).val(settings.TIExitOperation);
        $(`#${ctlPrefix}TIDirection`).val(settings.TIDirection);
        $(`#${ctlPrefix}VIRegex`).val(settings.VIRegex ?? '');
        $(`#${ctlPrefix}VIIgnoreCase`).prop('checked', settings.VIRegexIgnoreCase);
        $(`#${ctlPrefix}TowardsRegex`).val(settings.TowardsRegex ?? '');
        $(`#${ctlPrefix}TowardsIgnoreCase`).prop('checked', settings.TowardsRegexIgnoreCase);
        $(`#${ctlPrefix}TTSRegex`).val(settings.TTSRegex ?? '');
        $(`#${ctlPrefix}TTSIgnoreCase`).prop('checked', settings.TTSRegexIgnoreCase);
        $(`#${ctlPrefix}IntersectingNameRegex`).val(settings.IntersectingNameRegex ?? '');
        $(`#${ctlPrefix}IntersectingNameIgnoreCase`).prop('checked', settings.IntersectingNameRegexIgnoreCase);
        $(`#${ctlPrefix}HouseNumbersWithNoCity`).prop('checked', settings.HouseNumbersWithNoCity);
        $(`#${ctlPrefix}RedRoad`).prop('checked', settings.RedRoad);
        $(`#${ctlPrefix}ExpiredRestrictions`).prop('checked', settings.ExpiredRestrictions);
        $(`#${ctlPrefix}SuggestedSegmentsOperation`).val(settings.SuggestedSegmentsOperation);
        $(`#${ctlPrefix}SuggestedSegments`).prop('checked', settings.SuggestedSegments);
        $(`#${ctlPrefix}SuggestedSegmentsStatus`).val(settings.SuggestedSegmentsStatus);
    }
    function loadSetting() {
        const selectedSetting = parseInt($(`#${ctlPrefix}SavedSettings`).val());
        if (selectedSetting == null || isNaN(selectedSetting) || selectedSetting < 0 || selectedSetting > savedSettings.length) {
            return;
        }
        initSettings();
        const savedSetting = savedSettings[selectedSetting].Setting;
        for (let name in savedSetting) {
            if (settings.hasOwnProperty(name)) {
                settings[name] = savedSetting[name];
            }
        }
        updateProperties();
        updateUI();
    }
    function validateSettings() {
        function addMessage(error) {
            message += ((message.length > 0 ? "\n" : "") + error);
        }
        let message = "";
        const s = getSettings();
        if (s.RoadTypeMask === 0) {
            addMessage("Please select at least one road type");
        }
        const selectedState = $(`#${ctlPrefix}State`).val();
        if (nullif(selectedState, "") !== null && s.State === null) {
            addMessage("Invalid state selection");
        }
        const selectedModifiedUser = $(`#${ctlPrefix}LastModifiedBy`).val();
        if (nullif(selectedModifiedUser, "") !== null && s.LastModifiedBy === null) {
            addMessage("Invalid last modified user");
        }
        const selectedCreatedUser = $(`#${ctlPrefix}CreatedBy`).val();
        if (nullif(selectedCreatedUser, "") !== null && s.CreatedBy === null) {
            addMessage("Invalid created user");
        }
        let r;
        if (nullif(s.Regex, "") !== null) {
            try {
                r = new RegExp(s.Regex, 'u');
            }
            catch (error) {
                addMessage("Name RegEx is invalid");
            }
        }
        if (nullif(s.CityRegex, "")) {
            try {
                r = new RegExp(s.CityRegex, 'u');
            }
            catch (error) {
                addMessage("City RegEx is invalid");
            }
        }
        if (s.SegmentLength) {
            const val = $(`#${ctlPrefix}SegmentLengthValue`).val();
            const numVal = parseInt(val);
            if (isNaN(numVal) || val.trim() !== numVal.toString()) {
                addMessage("Invalid segment length (issue)");
            }
        }
        if (s.SegmentLengthFilter) {
            const val = $(`#${ctlPrefix}SegmentLengthFilterValue`).val();
            const numVal = parseInt(val);
            if (isNaN(numVal) || val.trim() !== numVal.toString()) {
                addMessage("Invalid segment length (filter)");
            }
        }
        if (s.RampWithSL && !(s.RoadTypeMask & WMEWAL.RoadType.Ramp)) {
            addMessage("If checking for ramps with SL, the Ramp road type needs to be checked");
        }
        if (s.Created && s.CreatedDate === null) {
            addMessage("Select a created date on which to filter");
        }
        if (s.Updated && s.UpdatedDate === null) {
            addMessage("Select an updated date on which to filter");
        }
        if (nullif(s.ShieldTextRegex, "")) {
            try {
                r = new RegExp(s.ShieldTextRegex, 'u');
            }
            catch (error) {
                addMessage("Shield Text RegEx is invalid");
            }
        }
        if (nullif(s.ShieldDirectionRegex, "")) {
            try {
                r = new RegExp(s.ShieldDirectionRegex, 'u');
            }
            catch (error) {
                addMessage("Shield Direction RegEx is invalid");
            }
        }
        if (nullif(s.VIRegex, '')) {
            try {
                r = new RegExp(s.VIRegex, 'u');
            }
            catch (error) {
                addMessage('Visual Instruction RegEx is invalid');
            }
        }
        if (nullif(s.TowardsRegex, '')) {
            try {
                r = new RegExp(s.TowardsRegex, 'u');
            }
            catch (error) {
                addMessage('Towards RegEx is invalid');
            }
        }
        if (nullif(s.TTSRegex, '')) {
            try {
                r = new RegExp(s.TTSRegex, 'u');
            }
            catch (error) {
                addMessage('TTS RegEx is invalid');
            }
        }
        if (nullif(s.IntersectingNameRegex, '')) {
            try {
                r = new RegExp(s.IntersectingNameRegex, 'u');
            }
            catch (error) {
                addMessage('Intersecting Name RegEx is invalid');
            }
        }
        if (s.SuggestedSegments && s.SuggestedSegmentsOperation == 2) {
            addMessage('Suggested segments must be included to filter on status');
        }
        if (message.length > 0) {
            alert(pluginName + ": " + message);
            return false;
        }
        return true;
    }
    function saveSetting() {
        if (validateSettings()) {
            const s = getSettings();
            const sName = prompt("Enter a name for this setting");
            if (sName == null) {
                return;
            }
            // Check to see if there is already a name that matches this
            for (let ixSetting = 0; ixSetting < savedSettings.length; ixSetting++) {
                if (savedSettings[ixSetting].Name === sName) {
                    if (confirm("A setting with this name already exists. Overwrite?")) {
                        savedSettings[ixSetting].Setting = s;
                        updateSavedSettings();
                    }
                    else {
                        alert("Please pick a new name.");
                    }
                    return;
                }
            }
            const savedSetting = {
                Name: sName,
                Setting: s
            };
            savedSettings.push(savedSetting);
            updateSavedSettings();
        }
    }
    function getSettings() {
        const s = {
            RoadTypeMask: 0,
            State: null,
            StateOperation: parseInt($(`#${ctlPrefix}StateOp`).val()),
            LockLevel: null,
            LockLevelOperation: parseInt($(`#${ctlPrefix}LockLevelOp`).val()),
            Regex: null,
            RegexIgnoreCase: $(`#${ctlPrefix}IgnoreCase`).prop("checked"),
            ExcludeJunctionBoxes: $(`#${ctlPrefix}ExcludeJunctionBoxes`).prop("checked"),
            Roundabouts: $(`#${ctlPrefix}Roundabouts`).prop("checked"),
            RoundaboutsOperation: parseInt($(`#${ctlPrefix}RoundaboutsOp`).val()),
            EditableByMe: $(`#${ctlPrefix}Editable`).prop("checked"),
            NoSpeedLimit: $(`#${ctlPrefix}NoSpeedLimit`).prop("checked"),
            IncludeAltNames: $(`#${ctlPrefix}IncludeAlt`).prop("checked"),
            IncludeASC: $(`#${ctlPrefix}IncludeASC`).prop("checked"),
            Direction: null,
            CityRegex: null,
            CityRegexIgnoreCase: $(`#${ctlPrefix}CityIgnoreCase`).prop("checked"),
            HasTimeBasedRestrictions: $(`#${ctlPrefix}HasRestrictions`).prop("checked"),
            HasTimeBasedTurnRestrictions: $(`#${ctlPrefix}HasTurnRestrictions`).prop("checked"),
            HasRestrictedJunctionArrow: $(`#${ctlPrefix}HasRestrictedJunctionArrow`).prop("checked"),
            UnknownDirection: $(`#${ctlPrefix}UnknownDirection`).prop("checked"),
            HasUTurn: $(`#${ctlPrefix}HasUTurn`).prop("checked"),
            HasSoftTurns: $(`#${ctlPrefix}HasSoftTurns`).prop("checked"),
            HasUnnecessaryJunctionNode: false,
            // HasUnnecessaryJunctionNode: $(`#${ctlPrefix}HasExtraJunctionNode`).prop("checked"),
            Elevation: $(`#${ctlPrefix}Elevation`).prop("checked"),
            ElevationOperation: parseInt($(`#${ctlPrefix}ElevationOperation`).val()),
            SegmentLength: $(`#${ctlPrefix}SegmentLength`).prop("checked"),
            SegmentLengthOperation: parseInt($(`#${ctlPrefix}SegmentLengthOperation`).val()),
            SegmentLengthValue: null,
            SegmentLengthUnit: parseInt($(`#${ctlPrefix}SegmentLengthUnit`).val()),
            LastModifiedBy: null,
            HasNoName: $(`#${ctlPrefix}HasNoName`).prop("checked"),
            HasNoCity: $(`#${ctlPrefix}HasNoCity`).prop("checked"),
            HasNoCityOperation: parseInt($(`#${ctlPrefix}HasNoCityOperation`).val()),
            NoHN: $(`#${ctlPrefix}NoHN`).prop("checked"),
            // NonNeutralRoutingPreference: $(`#${ctlPrefix}NonNeutralRoutingPreference`).prop("checked"),
            NonNeutralRoutingPreference: null,
            RampWithSL: $(`#${ctlPrefix}RampWithSL`).prop("checked"),
            Unpaved: $(`#${ctlPrefix}Unpaved`).prop("checked"),
            Tunnel: $(`#${ctlPrefix}Tunnel`).prop("checked"),
            HeadlightsRequired: $(`#${ctlPrefix}HeadlightsRequired`).prop("checked"),
            NearHOV: $(`#${ctlPrefix}NearHOV`).prop("checked"),
            Toll: $(`#${ctlPrefix}Toll`).prop("checked"),
            Beacons: $(`#${ctlPrefix}Beacons`).prop("checked"),
            CreatedBy: null,
            LaneGuidance: $(`#${ctlPrefix}LaneGuidance`).prop("checked"),
            LaneGuidanceOperation: parseInt($(`#${ctlPrefix}LaneGuidanceOp`).val()),
            Created: $(`#${ctlPrefix}Created`).prop("checked"),
            CreatedOperation: parseInt($(`#${ctlPrefix}CreatedOp`).val()),
            CreatedDate: null,
            Updated: $(`#${ctlPrefix}Updated`).prop("checked"),
            UpdatedOperation: parseInt($(`#${ctlPrefix}UpdatedOp`).val()),
            UpdatedDate: null,
            Minus1RoutingPreference: $(`#${ctlPrefix}Minus1RoutingPreference`).prop("checked"),
            Plus1RoutingPreference: $(`#${ctlPrefix}Plus1RoutingPreference`).prop("checked"),
            NewlyPaved: $(`#${ctlPrefix}NewlyPaved`).prop("checked"),
            SegmentLengthFilter: $(`#${ctlPrefix}SegmentLengthFilter`).prop("checked"),
            SegmentLengthFilterOperation: parseInt($(`#${ctlPrefix}SegmentLengthFilterOperation`).val()),
            SegmentLengthFilterValue: null,
            SegmentLengthFilterUnit: parseInt($(`#${ctlPrefix}SegmentLengthFilterUnit`).val()),
            OneWay: $(`#${ctlPrefix}OneWay`).prop('checked'),
            HasClosures: $(`#${ctlPrefix}HasClosures`).prop('checked'),
            HasTIO: $(`#${ctlPrefix}HasTIO`).prop("checked"),
            TIO: $(`#${ctlPrefix}TIO`).val(),
            Loop: $(`#${ctlPrefix}Loop`).prop('checked'),
            ShieldTextRegex: null,
            ShieldTextRegexIgnoreCase: $(`#${ctlPrefix}ShieldTextIgnoreCase`).prop("checked"),
            ShieldDirectionRegex: null,
            ShieldDirectionRegexIgnoreCase: $(`#${ctlPrefix}ShieldDirectionIgnoreCase`).prop("checked"),
            Shield: $(`#${ctlPrefix}Shield`).prop('checked'),
            ShieldOperation: parseInt($(`#${ctlPrefix}ShieldOperation`).val()),
            ShieldDirection: $(`#${ctlPrefix}ShieldDirection`).prop('checked'),
            ShieldDirectionOperation: parseInt($(`#${ctlPrefix}ShieldDirectionOperation`).val()),
            TI: $(`#${ctlPrefix}TI`).prop('checked'),
            TIOperation: parseInt($(`#${ctlPrefix}TIOperation`).val()),
            TITTS: $(`#${ctlPrefix}TITTS`).prop('checked'),
            TITTSOperation: parseInt($(`#${ctlPrefix}TITTSOperation`).val()),
            TIExit: $(`#${ctlPrefix}TIExit`).prop('checked'),
            TIExitOperation: parseInt($(`#${ctlPrefix}TIExitOperation`).val()),
            TIDirection: parseInt($(`#${ctlPrefix}TIDirection`).val()),
            VIRegex: null,
            VIRegexIgnoreCase: $(`#${ctlPrefix}VIIgnoreCase`).prop('checked'),
            TowardsRegex: null,
            TowardsRegexIgnoreCase: $(`#${ctlPrefix}TowardsIgnoreCase`).prop('checked'),
            TTSRegex: null,
            TTSRegexIgnoreCase: $(`#${ctlPrefix}TTSIgnoreCase`).prop('checked'),
            IntersectingNameRegex: null,
            IntersectingNameRegexIgnoreCase: $(`#${ctlPrefix}IntersectingNameIgnoreCase`).prop('checked'),
            HouseNumbersWithNoCity: $(`#${ctlPrefix}HouseNumbersWithNoCity`).prop('checked'),
            RedRoad: $(`#${ctlPrefix}RedRoad`).prop('checked'),
            ExpiredRestrictions: $(`#${ctlPrefix}ExpiredRestrictions`).prop('checked'),
            SuggestedSegmentsOperation: parseInt($(`#${ctlPrefix}SuggestedSegmentsOperation`).val()),
            SuggestedSegments: $(`#${ctlPrefix}SuggestedSegments`).prop('checked'),
            SuggestedSegmentsStatus: parseInt($(`#${ctlPrefix}SuggestedSegmentsStatus`).val())
        };
        $(`input[data-group=${ctlPrefix}RoadType]:checked`).each(function (ix, e) {
            s.RoadTypeMask = s.RoadTypeMask | parseInt(e.value);
        });
        const selectedState = $(`#${ctlPrefix}State`).val();
        if (nullif(selectedState, "") !== null) {
            const state = W.model.states.getObjectById(parseInt(selectedState));
            if (state != null) {
                s.State = state.getID();
            }
        }
        const selectedUpdateUser = $(`#${ctlPrefix}LastModifiedBy`).val();
        if (nullif(selectedUpdateUser, "") !== null) {
            const u = W.model.users.getObjectById(parseInt(selectedUpdateUser));
            if (u != null) {
                s.LastModifiedBy = u.getAttribute('id');
            }
        }
        const selectedCreateUser = $(`#${ctlPrefix}CreatedBy`).val();
        if (nullif(selectedCreateUser, "") !== null) {
            const u = W.model.users.getObjectById(parseInt(selectedCreateUser));
            if (u != null) {
                s.CreatedBy = u.getAttribute('id');
            }
        }
        let pattern = $(`#${ctlPrefix}Name`).val();
        if (nullif(pattern, "") !== null) {
            s.Regex = pattern;
        }
        pattern = $(`#${ctlPrefix}City`).val();
        if (nullif(pattern, "") !== null) {
            s.CityRegex = pattern;
        }
        const selectedLockLevel = $(`#${ctlPrefix}LockLevel`).val();
        if (selectedLockLevel != null && selectedLockLevel.length > 0) {
            s.LockLevel = parseInt(selectedLockLevel);
        }
        const selectedDirection = $(`#${ctlPrefix}Direction`).val();
        if (selectedDirection != null && selectedDirection.length > 0) {
            s.Direction = parseInt(selectedDirection);
        }
        let segmentLengthValue = $(`#${ctlPrefix}SegmentLengthValue`).val();
        if (segmentLengthValue != null && segmentLengthValue.length > 0 && !isNaN(parseInt(segmentLengthValue))) {
            s.SegmentLengthValue = parseInt(segmentLengthValue);
        }
        segmentLengthValue = $(`#${ctlPrefix}SegmentLengthFilterValue`).val();
        if (segmentLengthValue != null && segmentLengthValue.length > 0 && !isNaN(parseInt(segmentLengthValue))) {
            s.SegmentLengthFilterValue = parseInt(segmentLengthValue);
        }
        let createdDate = $(`#${ctlPrefix}CreatedDate`).val();
        if (nullif(createdDate, "") !== null) {
            const createdTime = $(`#${ctlPrefix}CreatedTime`).val();
            if (createdTime && createdTime.length > 0) {
                createdDate += ` ${createdTime}`;
            }
            else {
                createdDate += ' 00:00';
            }
            s.CreatedDate = (new Date(createdDate)).getTime();
        }
        let updatedDate = $(`#${ctlPrefix}UpdatedDate`).val();
        if (nullif(updatedDate, "") !== null) {
            const updatedTime = $(`#${ctlPrefix}UpdatedTime`).val();
            if (updatedTime && updatedTime.length > 0) {
                updatedDate += ` ${updatedTime}`;
            }
            else {
                updatedDate += ' 00:00';
            }
            s.UpdatedDate = (new Date(updatedDate)).getTime();
        }
        pattern = $(`#${ctlPrefix}ShieldTextRegex`).val();
        if (nullif(pattern, "") !== null) {
            s.ShieldTextRegex = pattern;
        }
        pattern = $(`#${ctlPrefix}ShieldDirectionRegex`).val();
        if (nullif(pattern, "") !== null) {
            s.ShieldDirectionRegex = pattern;
        }
        pattern = $(`#${ctlPrefix}VIRegex`).val();
        if (nullif(pattern, '') !== null) {
            s.VIRegex = pattern;
        }
        pattern = $(`#${ctlPrefix}TowardsRegex`).val();
        if (nullif(pattern, '') !== null) {
            s.TowardsRegex = pattern;
        }
        pattern = $(`#${ctlPrefix}TTSRegex`).val();
        if (nullif(pattern, '') !== null) {
            s.TTSRegex = pattern;
        }
        pattern = $(`#${ctlPrefix}IntersectingNameRegex`).val();
        if (nullif(pattern, '') !== null) {
            s.IntersectingNameRegex = pattern;
        }
        return s;
    }
    function deleteSetting() {
        const selectedSetting = parseInt($(`#${ctlPrefix}SavedSettings`).val());
        if (selectedSetting == null || isNaN(selectedSetting) || selectedSetting < 0 || selectedSetting > savedSettings.length) {
            return;
        }
        if (confirm("Are you sure you want to delete this saved setting?")) {
            savedSettings.splice(selectedSetting, 1);
            updateSavedSettings();
        }
    }
    function ScanStarted() {
        streets = [];
        roundabouts = [];
        savedSegments = [];
        const allOk = validateSettings();
        if (allOk) {
            settings = getSettings();
            if (settings.State !== null) {
                state = W.model.states.getObjectById(settings.State);
                stateName = state.getAttribute('name');
            }
            else {
                state = null;
                stateName = null;
            }
            if (settings.LastModifiedBy !== null) {
                lastModifiedBy = W.model.users.getObjectById(settings.LastModifiedBy);
                lastModifiedByName = lastModifiedBy.getAttribute('userName');
            }
            else {
                lastModifiedBy = null;
                lastModifiedByName = null;
            }
            if (settings.CreatedBy !== null) {
                createdBy = W.model.users.getObjectById(settings.CreatedBy);
                createdByName = createdBy.getAttribute('userName');
            }
            else {
                createdBy = null;
                createdByName = null;
            }
            if (settings.Regex !== null) {
                nameRegex = (settings.RegexIgnoreCase ? new RegExp(settings.Regex, 'iu') : new RegExp(settings.Regex, 'u'));
            }
            else {
                nameRegex = null;
            }
            if (settings.CityRegex !== null) {
                cityRegex = (settings.CityRegexIgnoreCase ? new RegExp(settings.CityRegex, 'iu') : new RegExp(settings.CityRegex, 'u'));
            }
            else {
                cityRegex = null;
            }
            if (settings.RoadTypeMask & ~(WMEWAL.RoadType.Freeway | WMEWAL.RoadType.MajorHighway | WMEWAL.RoadType.MinorHighway | WMEWAL.RoadType.PrimaryStreet | WMEWAL.RoadType.Ramp)) {
                WMEWAL_Streets.MinimumZoomLevel = 16;
            }
            else {
                // Still need to zoom to 16 if searching for anything related to turn instructions
                if (nullif(settings.TTSRegex, '') !== null ||
                    nullif(settings.TowardsRegex, '') !== null ||
                    nullif(settings.VIRegex, '') !== null ||
                    settings.TI || settings.TIExit || settings.HasTIO || settings.TITTS) {
                    WMEWAL_Streets.MinimumZoomLevel = 16;
                }
                else {
                    WMEWAL_Streets.MinimumZoomLevel = 14;
                }
            }
            log('info', `Minimum zoom level set to ${WMEWAL_Streets.MinimumZoomLevel}`);
            segmentLengthFilterMultipier = settings.SegmentLengthFilter ? (settings.SegmentLengthFilterUnit == Unit.Metric ? 1.0 : mToFt) : 0.0;
            segmentLengthMultiplier = settings.SegmentLength ? (settings.SegmentLengthUnit == Unit.Metric ? 1.0 : mToFt) : 0.0;
            if (settings.ShieldTextRegex !== null) {
                shieldTextRegex = (settings.ShieldTextRegexIgnoreCase ? new RegExp(settings.ShieldTextRegex, 'iu') : new RegExp(settings.ShieldTextRegex, 'u'));
            }
            else {
                shieldTextRegex = null;
            }
            if (settings.ShieldDirectionRegex !== null) {
                shieldDirectionRegex = (settings.ShieldDirectionRegexIgnoreCase ? new RegExp(settings.ShieldDirectionRegex, 'iu') : new RegExp(settings.ShieldDirectionRegex, 'u'));
            }
            else {
                shieldDirectionRegex = null;
            }
            if (shieldTextRegex != null || shieldDirectionRegex != null || settings.Shield || settings.ShieldDirection) {
                includeShields = true;
            }
            else {
                includeShields = false;
            }
            if (settings.VIRegex !== null) {
                viRegex = (settings.VIRegexIgnoreCase ? new RegExp(settings.VIRegex, 'iu') : new RegExp(settings.VIRegex, 'u'));
            }
            else {
                viRegex = null;
            }
            if (settings.TowardsRegex !== null) {
                towardsRegex = (settings.TowardsRegexIgnoreCase ? new RegExp(settings.TowardsRegex, 'iu') : new RegExp(settings.TowardsRegex, 'u'));
            }
            else {
                towardsRegex = null;
            }
            if (settings.TTSRegex !== null) {
                ttsRegex = (settings.TTSRegexIgnoreCase ? new RegExp(settings.TTSRegex, 'iu') : new RegExp(settings.TTSRegex, 'u'));
            }
            else {
                ttsRegex = null;
            }
            if (settings.IntersectingNameRegex !== null) {
                intersectingNameRegex = (settings.IntersectingNameRegex ? new RegExp(settings.IntersectingNameRegex, 'iu') : new RegExp(settings.IntersectingNameRegex, 'u'));
            }
            else {
                intersectingNameRegex = null;
            }
            WMEWAL_Streets.SupportsSuggestedSegments = (settings.SuggestedSegmentsOperation == 0 || settings.SuggestedSegmentsOperation == 1);
            WMEWAL_Streets.SupportsSegments = (settings.SuggestedSegmentsOperation == 1 || settings.SuggestedSegmentsOperation == 2);
            WMEWAL_Streets.SupportsClosures = settings.HasClosures;
            detectIssues = settings.NoSpeedLimit
                || settings.HasTimeBasedRestrictions
                || settings.HasTimeBasedTurnRestrictions
                || settings.HasRestrictedJunctionArrow
                || settings.UnknownDirection
                || settings.HasUTurn
                || settings.HasSoftTurns
                || settings.SegmentLength
                || settings.Elevation
                || settings.HasNoName
                || settings.HasNoCity
                //                || settings.NonNeutralRoutingPreference
                || settings.NoHN
                || settings.RampWithSL
                || settings.Minus1RoutingPreference
                || settings.Plus1RoutingPreference
                || settings.NewlyPaved
                || settings.OneWay
                || settings.HasClosures
                || settings.HasTIO
                || settings.Loop
                || settings.Shield
                || settings.ShieldDirection
                || settings.TI
                || settings.TITTS
                || settings.TIExit
                || settings.HouseNumbersWithNoCity
                || settings.RedRoad
                || settings.ExpiredRestrictions;
            updateSettings();
        }
        return allOk;
    }
    WMEWAL_Streets.ScanStarted = ScanStarted;
    function ScanExtent(segments, venues, suggestedSegments) {
        return new Promise(resolve => {
            setTimeout(function () {
                let streets = scan(segments, venues, suggestedSegments);
                resolve({ ID: 'S', count: streets });
            }, 0);
        });
    }
    WMEWAL_Streets.ScanExtent = ScanExtent;
    function scan(segments, venues, suggestedSegments) {
        const extentStreets = [];
        let segment;
        let suggestedSegment;
        let directions;
        const outputFields = WMEWAL.outputFields ?? ['CreatedEditor', 'LastEditor', 'LockLevel', 'Lat', 'Lon'];
        const includeLockLevel = outputFields.indexOf('LockLevel') > -1 || settings.LockLevel !== null;
        const includeLastEditor = outputFields.indexOf('LastEditor') > -1 || settings.LastModifiedBy !== null;
        const includeCreatedEditor = outputFields.indexOf('CreatedEditor') > -1 || settings.CreatedBy !== null;
        function determineDirection(s) {
            return (s.getAttribute('fwdDirection') ? (s.getAttribute('revDirection') ? Direction.TwoWay : Direction.OneWay) : (s.getAttribute('revDirection') ? Direction.OneWay : Direction.Unknown));
        }
        function addSegment(s, rId, issues, newSegment) {
            // Don't add this segment if we've already scanned it
            if (savedSegments.indexOf(s.getID()) === -1) {
                savedSegments.push(s.getID());
                const sid = s.getAttribute('primaryStreetID');
                const lastEditorID = s.getUpdatedBy() ?? s.getCreatedBy();
                const lastEditor = W.model.users.getObjectById(lastEditorID);
                const createdEditorID = s.getCreatedBy();
                const createdEditor = W.model.users.getObjectById(createdEditorID);
                const address = s.getAddress(W.model);
                let thisStreet = null;
                const ps = includeShields ? W.model.streets.getObjectById(sid) : null;
                if (sid != null && !newSegment) {
                    thisStreet = extentStreets.find(function (e) {
                        let matches = (e.id === sid && e.roundaboutId === rId &&
                            e.roadType === s.getAttribute('roadType') && e.issues === issues &&
                            (ps == null || (e.shieldText === (ps.getAttribute('signText') || '') && e.shieldDirection === (ps.getAttribute('direction') || ''))));
                        if (includeLockLevel) {
                            matches &&= (e.lockLevel === (s.getAttribute('lockRank') | 0) + 1);
                        }
                        if (includeLastEditor) {
                            matches &&= e.lastEditor === (lastEditor?.getAttribute('userName') ?? 'WMEWALNotFound');
                        }
                        if (includeCreatedEditor) {
                            matches &&= e.createdEditor === (createdEditor?.getAttribute('userName') ?? 'WMEWALNotFound');
                        }
                        if (matches && settings.IncludeAltNames) {
                            // Test for alt names
                            for (let ixAlt = 0; ixAlt < e.altStreets.length && matches; ixAlt++) {
                                matches = false;
                                for (let ixSegAlt = 0; ixSegAlt < s.getAttribute('streetIDs').length && !matches; ixSegAlt++) {
                                    if (e.altStreets[ixAlt].id === s.getAttribute('streetIDs')[ixSegAlt]) {
                                        matches = true;
                                    }
                                }
                                if (matches && settings.Direction) {
                                    matches = (e.direction === determineDirection(s));
                                }
                            }
                        }
                        return matches;
                    });
                }
                if (thisStreet == null) {
                    thisStreet = {
                        id: sid,
                        city: ((address && !address.attributes.isEmpty && address.attributes.city.hasName()) ? address.attributes.city.getAttribute('name') : "No City"),
                        state: ((address && !address.attributes.isEmpty) ? address.attributes.state.getAttribute('name') : "No State"),
                        name: ((address && !address.attributes.isEmpty && !address.attributes.street.getAttribute('isEmpty')) ? address.attributes.street.getAttribute('name') : null),
                        geometries: new OpenLayers.Geometry.Collection(),
                        lockLevel: (s.getAttribute('lockRank') || 0) + 1,
                        segments: [],
                        roundaboutId: rId,
                        altStreets: [],
                        roadType: s.getAttribute('roadType'),
                        direction: determineDirection(s),
                        issues: issues,
                        length: s.getAttribute('length') * (isImperial ? mToFt : 1.0),
                        lastEditor: (lastEditor && lastEditor.getAttribute('userName')) || "",
                        asc: (s.getFlagAttribute('fwdSpeedCamera') || s.getFlagAttribute('revSpeedCamera') ? 'Yes' : 'No'),
                        createdEditor: (createdEditor && createdEditor.getAttribute('userName')) || "",
                        shieldText: ps != null ? ps.getAttribute('signText') || '' : '',
                        shieldDirection: ps != null ? ps.getAttribute('direction') || '' : '',
                        type: 'segment',
                        rejectionReason: null
                    };
                    if (settings.IncludeAltNames) {
                        if (s.getAttribute('streetIDs') != null) {
                            for (let ixAlt = 0; ixAlt < s.getAttribute('streetIDs').length; ixAlt++) {
                                if (s.getAttribute('streetIDs')[ixAlt] != null) {
                                    const altStreet = W.model.streets.getObjectById(s.getAttribute('streetIDs')[ixAlt]);
                                    if (altStreet != null) {
                                        let altCityName = null;
                                        if (altStreet.getAttribute('cityID') != null) {
                                            let altCity = W.model.cities.getObjectById(altStreet.getAttribute('cityID'));
                                            if (altCity != null) {
                                                altCityName = altCity.hasName() ? altCity.getAttribute('name') : "No city";
                                            }
                                        }
                                        thisStreet.altStreets.push({
                                            id: s.getAttribute('streetIDs')[ixAlt],
                                            name: altStreet.getAttribute('name'),
                                            city: altCityName,
                                            type: 'segment'
                                        });
                                    }
                                }
                            }
                        }
                    }
                    extentStreets.push(thisStreet);
                }
                thisStreet.segments.push({
                    id: s.getAttribute('id'),
                    center: s.getAttribute('geometry').getCentroid(),
                    type: 'segment'
                });
                thisStreet.geometries.addComponents([s.getAttribute('geometry').clone()]);
            }
        }
        function addSuggestedSegment(s) {
            // Don't add this segment if we've already scanned it
            if (savedSegments.indexOf(s.getID()) === -1) {
                savedSegments.push(s.getID());
                const sid = s.getID();
                const lastEditorID = s.getUpdatedBy() ?? s.getCreatedBy();
                const lastEditor = W.model.users.getObjectById(lastEditorID);
                const createdEditorID = s.getCreatedBy();
                const createdEditor = W.model.users.getObjectById(createdEditorID);
                let thisStreet = null;
                thisStreet = {
                    id: sid,
                    city: 'No City',
                    state: 'No State',
                    name: s.getAttribute('streetName'),
                    geometries: new OpenLayers.Geometry.Collection(),
                    lockLevel: null,
                    segments: [],
                    roundaboutId: null,
                    altStreets: [],
                    roadType: s.getAttribute('roadType'),
                    direction: determineDirection(s),
                    issues: null,
                    length: null,
                    lastEditor: lastEditor?.getAttribute('userName') ?? '',
                    asc: null,
                    createdEditor: createdEditor?.getAttribute('userName') ?? '',
                    shieldText: '',
                    shieldDirection: '',
                    type: 'suggestedsegment',
                    rejectionReason: s.getAttribute('rejectionReason')
                };
                thisStreet.segments.push({
                    id: s.getID(),
                    center: s.getAttribute('geometry').getCentroid(),
                    type: 'suggestedsegment'
                });
                thisStreet.geometries.addComponents([s.getAttribute('geometry').clone()]);
                extentStreets.push(thisStreet);
            }
        }
        const graph = W.model.getTurnGraph();
        if (settings.SuggestedSegmentsOperation != 0) {
            for (let ix = 0; ix < segments.length; ix++) {
                segment = segments[ix];
                if (segment != null) {
                    const attr = segment.getFlagAttributes();
                    if ((WMEWAL.WazeRoadTypeToRoadTypeBitmask(segment.getAttribute('roadType')) & settings.RoadTypeMask) &&
                        (settings.LockLevel == null ||
                            (settings.LockLevelOperation === Operation.Equal && (segment.getAttribute('lockRank') || 0) + 1 === settings.LockLevel) ||
                            (settings.LockLevelOperation === Operation.NotEqual && (segment.getAttribute('lockRank') || 0) + 1 !== settings.LockLevel)) &&
                        (!settings.EditableByMe || segment.arePropertiesEditable()) &&
                        (!settings.ExcludeJunctionBoxes || !segment.isInBigJunction()) &&
                        (settings.Direction == null || determineDirection(segment) === settings.Direction) &&
                        (!settings.Unpaved || attr.unpaved) &&
                        (!settings.Tunnel || attr.tunnel) &&
                        (!settings.HeadlightsRequired || attr.headlights) &&
                        (!settings.NearHOV || attr.nearbyHOV) &&
                        (!settings.Beacons || attr.beacons) &&
                        (!settings.Toll || segment.isTollRoad()) &&
                        (!settings.LaneGuidance || (settings.LaneGuidanceOperation === 0 && (segment.isLanesEnabled(0) || segment.isLanesEnabled(1))) || (settings.LaneGuidanceOperation === 1 && !segment.isLanesEnabled(0) && !segment.isLanesEnabled(1))) &&
                        (!settings.Created ||
                            (settings.CreatedOperation === Operation.LessThan && segment.getAttribute('createdOn') < settings.CreatedDate) ||
                            (settings.CreatedOperation === Operation.LessThanOrEqual && segment.getAttribute('createdOn') <= settings.CreatedDate) ||
                            (settings.CreatedOperation === Operation.GreaterThan && segment.getAttribute('createdOn') > settings.CreatedDate) ||
                            (settings.CreatedOperation === Operation.GreaterThanOrEqual && segment.getAttribute('createdOn') >= settings.CreatedDate)) &&
                        (!settings.Updated ||
                            (settings.UpdatedOperation === Operation.LessThan && segment.getAttribute('updatedOn') < settings.UpdatedDate) ||
                            (settings.UpdatedOperation === Operation.LessThanOrEqual && segment.getAttribute('updatedOn') <= settings.UpdatedDate) ||
                            (settings.UpdatedOperation === Operation.GreaterThan && segment.getAttribute('updatedOn') > settings.UpdatedDate) ||
                            (settings.UpdatedOperation === Operation.GreaterThanOrEqual && segment.getAttribute('updatedOn') >= settings.UpdatedDate)) &&
                        (!settings.SegmentLengthFilter ||
                            (settings.SegmentLengthFilterOperation === Operation.LessThan && (segment.getAttribute('length') * segmentLengthFilterMultipier) < settings.SegmentLengthFilterValue) ||
                            (settings.SegmentLengthFilterOperation === Operation.LessThanOrEqual && (segment.getAttribute('length') * segmentLengthFilterMultipier) <= settings.SegmentLengthFilterValue) ||
                            (settings.SegmentLengthFilterOperation === Operation.GreaterThan && (segment.getAttribute('length') * segmentLengthFilterMultipier) > settings.SegmentLengthFilterValue) ||
                            (settings.SegmentLengthFilterOperation === Operation.GreaterThanOrEqual && (segment.getAttribute('length') * segmentLengthFilterMultipier) >= settings.SegmentLengthFilterValue)) &&
                        ((settings.CreatedBy === null) ||
                            (segment.getCreatedBy() === settings.CreatedBy)) &&
                        ((settings.LastModifiedBy === null) ||
                            ((segment.getUpdatedBy() ?? segment.getCreatedBy()) === settings.LastModifiedBy))) {
                        if (!WMEWAL.IsSegmentInArea(segment)) {
                            continue;
                        }
                        let newSegment = false;
                        let primaryStreet = null;
                        const primaryStreetID = segment.getAttribute('primaryStreetID');
                        if (primaryStreetID !== null) {
                            primaryStreet = W.model.streets.getObjectById(primaryStreetID);
                        }
                        let issues = 0;
                        const address = segment.getAddress(W.model);
                        if (state != null) {
                            if (!(address?.attributes?.isEmpty ?? true) && address.attributes.state != null) {
                                if (settings.StateOperation === Operation.Equal && address.attributes.state.getAttribute('id') !== state.getAttribute('id') ||
                                    settings.StateOperation === Operation.NotEqual && address.attributes.state.getAttribute('id') === state.getAttribute('id')) {
                                    continue;
                                }
                            }
                            else if (settings.StateOperation === Operation.Equal) {
                                continue;
                            }
                        }
                        let primaryAddrMatches = true;
                        let altAddrMatches = [];
                        const hasAltNames = segment.getAttribute('streetIDs')?.length ?? 0 > 0;
                        if (nameRegex != null || cityRegex != null) {
                            let anyNameMatched = true;
                            if (nameRegex != null) {
                                anyNameMatched = !(address?.attributes?.isEmpty ?? true) && !(address.attributes.street?.getAttribute('isEmpty') ?? true) && nameRegex.test(address.attributes.street.getAttribute('name'));
                            }
                            if (cityRegex != null) {
                                anyNameMatched = anyNameMatched && (address.attributes.city?.hasName() ?? false) && cityRegex.test(address.attributes.city.getAttribute('name'));
                            }
                            primaryAddrMatches = anyNameMatched;
                            if (settings.IncludeAltNames && hasAltNames) {
                                for (let streetIx = 0; streetIx < segment.getAttribute('streetIDs').length; streetIx++) {
                                    let altMatched = true;
                                    if (segment.getAttribute('streetIDs')[streetIx] != null) {
                                        const street = W.model.streets.getObjectById(segment.getAttribute('streetIDs')[streetIx]);
                                        if (!(street?.attributes?.isEmpty ?? true)) {
                                            if (nameRegex != null) {
                                                altMatched = nameRegex.test(street.getAttribute('name'));
                                            }
                                            if (cityRegex != null) {
                                                if (street.getAttribute('cityID') != null) {
                                                    const city = W.model.cities.getObjectById(street.getAttribute('cityID'));
                                                    altMatched = altMatched && (city?.hasName() ?? false) && cityRegex.test(city.getAttribute('name'));
                                                }
                                                else {
                                                    altMatched = false;
                                                }
                                            }
                                        }
                                        else {
                                            altMatched = false;
                                        }
                                    }
                                    else {
                                        altMatched = false;
                                    }
                                    altAddrMatches.push(altMatched);
                                    anyNameMatched = anyNameMatched || altMatched;
                                }
                            }
                            if (!anyNameMatched) {
                                continue;
                            }
                        }
                        else if (settings.IncludeAltNames && hasAltNames) {
                            altAddrMatches = new Array(segment.getAttribute('streetIDs').length).fill(true);
                        }
                        if (intersectingNameRegex !== null) {
                            directions = [];
                            if (segment.getAttribute('fwdDirection')) {
                                directions.push('to');
                            }
                            if (segment.getAttribute('revDirection')) {
                                directions.push('from');
                            }
                            let anyConnectedNameMatched = false;
                            for (let ixDir = 0; ixDir < directions.length && !anyConnectedNameMatched; ixDir++) {
                                const connectedSegments = segment.getConnectedSegmentsByDirection(W.model, directions[ixDir]);
                                for (let ixSeg = 0; ixSeg < connectedSegments.length && !anyConnectedNameMatched; ixSeg++) {
                                    // Don't look at segments that have the same primary street ID
                                    if (connectedSegments[ixSeg].getAttribute('primaryStreetID') != primaryStreetID) {
                                        const connectedSegment = W.model.segments.getObjectById(connectedSegments[ixSeg].getAttribute('id'));
                                        const connectedAddress = connectedSegment?.getAddress(W.model);
                                        anyConnectedNameMatched = anyConnectedNameMatched || !(connectedAddress?.attributes?.isEmpty ?? true) && !(connectedAddress.attributes.street?.getAttribute('isEmpty') ?? true) && intersectingNameRegex.test(connectedAddress.attributes.street.getAttribute('name'));
                                        if (settings.IncludeAltNames && (connectedSegment.getAttribute('streetIDs')?.length ?? 0) > 0) {
                                            for (let streetIx = 0; streetIx < connectedSegment.getAttribute('streetIDs').length && !anyConnectedNameMatched; streetIx++) {
                                                let altMatched = true;
                                                if (connectedSegment.getAttribute('streetIDs')[streetIx] != null) {
                                                    let street = W.model.streets.getObjectById(connectedSegment.getAttribute('streetIDs')[streetIx]);
                                                    if (!(street?.attributes?.isEmpty ?? true)) {
                                                        altMatched = intersectingNameRegex.test(street.getAttribute('name'));
                                                    }
                                                    else {
                                                        altMatched = false;
                                                    }
                                                }
                                                else {
                                                    altMatched = false;
                                                }
                                                anyConnectedNameMatched = anyConnectedNameMatched || altMatched;
                                            }
                                        }
                                    }
                                }
                            }
                            if (!anyConnectedNameMatched) {
                                continue;
                            }
                        }
                        let primaryShieldMatches = true;
                        let altShieldMatches = [];
                        if (shieldTextRegex != null || shieldDirectionRegex != null) {
                            let anyShieldMatches = true;
                            if (shieldTextRegex != null) {
                                anyShieldMatches = primaryStreet?.attributes?.signText != null && shieldTextRegex.test(primaryStreet.getAttribute('signText'));
                            }
                            if (shieldDirectionRegex != null) {
                                anyShieldMatches = anyShieldMatches && primaryStreet?.attributes?.direction != null && shieldDirectionRegex.test(primaryStreet.getAttribute('direction'));
                            }
                            primaryShieldMatches = anyShieldMatches;
                            if (settings.IncludeAltNames && hasAltNames) {
                                for (let streetIx = 0; streetIx < segment.getAttribute('streetIDs').length; streetIx++) {
                                    let altMatched = true;
                                    if (segment.getAttribute('streetIDs')[streetIx] != null) {
                                        const street = W.model.streets.getObjectById(segment.getAttribute('streetIDs')[streetIx]);
                                        if (shieldTextRegex != null) {
                                            altMatched = street?.attributes?.signText != null && shieldTextRegex.test(street.getAttribute('signText'));
                                        }
                                        if (shieldDirectionRegex != null) {
                                            altMatched = altMatched && street?.attributes?.direction != null && shieldDirectionRegex.test(street.getAttribute('direction'));
                                        }
                                    }
                                    else {
                                        altMatched = false;
                                    }
                                    altShieldMatches.push(altMatched);
                                    anyShieldMatches = anyShieldMatches || altMatched;
                                }
                            }
                            if (!anyShieldMatches) {
                                continue;
                            }
                        }
                        else if (settings.IncludeAltNames && hasAltNames) {
                            altShieldMatches = new Array(segment.getAttribute('streetIDs').length).fill(true);
                        }
                        if (viRegex !== null || towardsRegex !== null || ttsRegex !== null) {
                            let instructionMatches = false;
                            directions = [];
                            if (segment.getAttribute('fwdDirection')) {
                                directions.push('to');
                            }
                            if (segment.getAttribute('revDirection')) {
                                directions.push('from');
                            }
                            for (let ixDir = 0; ixDir < directions.length && !instructionMatches; ixDir++) {
                                const node = segment.getNodeByDirection(directions[ixDir]);
                                const connectedSegments = segment.getConnectedSegmentsByDirection(W.model, directions[ixDir]);
                                for (let ixSeg = 0; ixSeg < connectedSegments.length && !instructionMatches; ixSeg++) {
                                    if (settings.EditableByMe && !connectedSegments[ixSeg].arePropertiesEditable()) {
                                        continue;
                                    }
                                    const turn = graph.getTurnThroughNode(node, segment, connectedSegments[ixSeg]).getTurnData();
                                    if (turn.hasTurnGuidance()) {
                                        const tg = turn.getTurnGuidance();
                                        if (viRegex !== null && nullif(tg.getVisualInstruction(), '') !== null && viRegex.test(getInstruction(tg, tg.getVisualInstruction()))) {
                                            instructionMatches = true;
                                        }
                                        if (towardsRegex !== null && nullif(tg.getTowards(), '') !== null && towardsRegex.test(getInstruction(tg, tg.getTowards()))) {
                                            instructionMatches = true;
                                        }
                                        if (ttsRegex !== null && nullif(tg.getTTS(), '') !== null && ttsRegex.test(tg.getTTS())) {
                                            instructionMatches = true;
                                        }
                                    }
                                }
                            }
                            if (!instructionMatches) {
                                continue;
                            }
                            newSegment = true;
                        }
                        let noPrimaryCity = true;
                        if (address && !address.isEmpty() && !address.getCity().isEmpty() && address.getCity().hasName()) {
                            noPrimaryCity = false;
                        }
                        let noAltCity = true;
                        if (hasAltNames) {
                            for (let ixAlt = 0; ixAlt < segment.getAttribute('streetIDs').length; ixAlt++) {
                                if (segment.getAttribute('streetIDs')[ixAlt] != null) {
                                    const altStreet = W.model.streets.getObjectById(segment.getAttribute('streetIDs')[ixAlt]);
                                    if (altStreet != null && altStreet.getAttribute('cityID') != null) {
                                        const altCity = W.model.cities.getObjectById(altStreet.getAttribute('cityID'));
                                        if (altCity != null && !altCity.isEmpty() && altCity.hasName()) {
                                            noAltCity = false;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (settings.NoSpeedLimit &&
                            ((segment.getAttribute('fwdDirection') && (segment.getAttribute('fwdMaxSpeed') == null || segment.getAttribute('fwdMaxSpeedUnverified'))) ||
                                (segment.getAttribute('revDirection') && (segment.getAttribute('revMaxSpeed') == null || segment.getAttribute('revMaxSpeedUnverified'))))) {
                            issues = issues | Issue.NoSpeedLimit;
                        }
                        let hasExpiredRestrictions = false;
                        if ((settings.HasTimeBasedRestrictions || settings.ExpiredRestrictions) && segment.getDrivingRestrictionCount() > 0) {
                            if (settings.HasTimeBasedRestrictions) {
                                issues = issues | Issue.TimeBasedRestrictions;
                            }
                            if (settings.ExpiredRestrictions) {
                                for (const r of segment.getDrivingRestrictions()) {
                                    hasExpiredRestrictions = r.isExpired() && !r.isRepeatsYearly();
                                    if (hasExpiredRestrictions) {
                                        break;
                                    }
                                }
                            }
                        }
                        if (settings.HasTimeBasedTurnRestrictions || (settings.ExpiredRestrictions && !hasExpiredRestrictions)) {
                            directions = ["from", "to"];
                            let hasTurnRestrictions = false;
                            for (const direction of directions) {
                                const node = segment.getNodeByDirection(direction);
                                const connSegments = segment.getConnectedSegmentsByDirection(W.model, direction);
                                for (const connSegment of connSegments) {
                                    const turn = graph.getTurnThroughNode(node, segment, connSegment);
                                    if ((turn?.getTurnData()?.getRestrictions()?.length ?? 0) > 0) {
                                        hasTurnRestrictions = true;
                                        if (settings.ExpiredRestrictions && !hasExpiredRestrictions) {
                                            for (const r of turn.getTurnData().getRestrictions()) {
                                                hasExpiredRestrictions = r.isExpired();
                                                if (hasExpiredRestrictions) {
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (hasTurnRestrictions && settings.HasTimeBasedTurnRestrictions) {
                                issues = issues | Issue.TimeBasedTurnRestrictions;
                                newSegment = true;
                            }
                        }
                        if (settings.ExpiredRestrictions && hasExpiredRestrictions) {
                            issues |= Issue.ExpiredRestrictions;
                            newSegment = true;
                        }
                        if (settings.HasRestrictedJunctionArrow) {
                            directions = ["from", "to"];
                            let hasRestrictedTurns = false;
                            for (let ixDir = 0; ixDir < directions.length && !hasRestrictedTurns; ixDir++) {
                                const node = segment.getNodeByDirection(directions[ixDir]);
                                if (node) {
                                    const keys = node.allConnectionKeys();
                                    for (let ixLegal = 0; ixLegal < keys.legal.length && !hasRestrictedTurns; ixLegal++) {
                                        if (keys.legal[ixLegal].from.getAttribute('id') === segment.getAttribute('id') &&
                                            keys.legal[ixLegal].to.isDrivable() &&
                                            !segment.isTurnAllowed(W.model, keys.legal[ixLegal].to, node)) {
                                            hasRestrictedTurns = true;
                                        }
                                    }
                                }
                            }
                            if (hasRestrictedTurns) {
                                issues = issues | Issue.RestrictedJunctionArrows;
                                newSegment = true;
                            }
                        }
                        if (settings.UnknownDirection && determineDirection(segment) === Direction.Unknown) {
                            issues = issues | Issue.UnknownDirection;
                            newSegment = true;
                        }
                        if (settings.OneWay && determineDirection(segment) == Direction.OneWay) {
                            issues |= Issue.OneWay;
                        }
                        if (settings.HasUTurn
                            || settings.HasSoftTurns) {
                            directions = ["from", "to"];
                            let hasUTurn = false;
                            let hasSoftTurns = false;
                            // let hasUnnecessaryJunctionNode = false;
                            for (let ixDir = 0; ixDir < directions.length; ixDir++) {
                                const node = segment.getNodeByDirection(directions[ixDir]);
                                if (node) {
                                    hasUTurn = hasUTurn || (node.connectionsExist() && segment.isTurnAllowed(W.model, segment, node));
                                    hasSoftTurns = hasSoftTurns || (node.connectionsExist() && !segment.areTurnsLocked(node));
                                }
                            }
                            if (hasUTurn && settings.HasUTurn) {
                                issues = issues | Issue.UTurn;
                                newSegment = true;
                            }
                            if (hasSoftTurns && settings.HasSoftTurns) {
                                issues = issues | Issue.SoftTurns;
                                newSegment = true;
                            }
                        }
                        if (settings.Elevation) {
                            if ((settings.ElevationOperation === Operation.LessThan && segment.getAttribute('level') < 0) ||
                                (settings.ElevationOperation === Operation.GreaterThan && segment.getAttribute('level') > 0) ||
                                (settings.ElevationOperation === Operation.NotEqual && segment.getAttribute('level') !== 0)) {
                                issues = issues | Issue.Elevation;
                            }
                        }
                        if (settings.SegmentLength) {
                            if ((settings.SegmentLengthOperation === Operation.LessThan && (segment.getAttribute('length') * segmentLengthMultiplier) < settings.SegmentLengthValue) ||
                                (settings.SegmentLengthOperation === Operation.LessThanOrEqual && (segment.getAttribute('length') * segmentLengthMultiplier) <= settings.SegmentLengthValue) ||
                                (settings.SegmentLengthOperation === Operation.GreaterThan && (segment.getAttribute('length') * segmentLengthMultiplier) > settings.SegmentLengthValue) ||
                                (settings.SegmentLengthOperation === Operation.GreaterThanOrEqual && (segment.getAttribute('length') * segmentLengthMultiplier) >= settings.SegmentLengthValue)) {
                                issues = issues | Issue.SegmentLength;
                                newSegment = true;
                            }
                        }
                        if (settings.HasNoName) {
                            if (!address || !address.attributes || address.attributes.isEmpty || !address.attributes.street || address.attributes.street.getAttribute('isEmpty') ||
                                address.attributes.street.getAttribute('name') === null || address.attributes.street.getAttribute('name').trim().length === 0) {
                                issues = issues | Issue.NoName;
                            }
                        }
                        if (settings.HasNoCity) {
                            if (settings.HasNoCityOperation == PrimaryOrAlt.PrimaryOnly && noPrimaryCity) {
                                issues |= Issue.NoCity;
                            }
                            else if (settings.HasNoCityOperation == PrimaryOrAlt.AltOnly && hasAltNames && noAltCity) {
                                issues |= Issue.NoCity;
                            }
                            else if (settings.HasNoCityOperation == PrimaryOrAlt.Either && (noPrimaryCity || (hasAltNames && noAltCity))) {
                                issues |= Issue.NoCity;
                            }
                            else if (settings.HasNoCityOperation == PrimaryOrAlt.Both && noPrimaryCity && noAltCity) {
                                issues |= Issue.NoCity;
                            }
                        }
                        if ((settings.Minus1RoutingPreference || settings.Plus1RoutingPreference) && segment.getAttribute('routingRoadType') !== null) {
                            const originalRoutingPreference = WMEWAL.WazeRoadTypeToRoutingPreference(segment.getAttribute('roadType'));
                            const routingRoadTypePreference = WMEWAL.WazeRoadTypeToRoutingPreference(segment.getAttribute('routingRoadType'));
                            if (settings.Minus1RoutingPreference && originalRoutingPreference > routingRoadTypePreference) {
                                issues |= Issue.Minus1RoutingPreference;
                            }
                            if (settings.Plus1RoutingPreference && originalRoutingPreference < routingRoadTypePreference) {
                                issues |= Issue.Plus1RoutingPreference;
                            }
                            // if (segment.getAttribute('routingRoadType') != null && segment.getAttribute('routingRoadType') != segment.getAttribute('roadType')) {
                            //     issues = issues | Issue.RoutingPreference;
                            // }
                        }
                        if (settings.NoHN && !segment.getAttribute('hasHNs')) {
                            issues |= Issue.NoHN;
                        }
                        if (settings.HouseNumbersWithNoCity && segment.getAttribute('hasHNs') && noPrimaryCity && noAltCity) {
                            issues |= Issue.HouseNumbersWithNoCity;
                        }
                        if (settings.RampWithSL && WMEWAL.WazeRoadTypeToRoadTypeBitmask(segment.getAttribute('roadType')) == WMEWAL.RoadType.Ramp &&
                            ((segment.getAttribute('fwdDirection') && segment.getAttribute('fwdMaxSpeed') != null) ||
                                (segment.getAttribute('revDirection') && segment.getAttribute('revMaxSpeed') != null))) {
                            issues |= Issue.RampWithSL;
                        }
                        if (settings.NewlyPaved && segment.getAttribute('validated') === false) {
                            issues |= Issue.NewlyPaved;
                        }
                        if (settings.HasClosures && segment.getAttribute('hasClosures')) {
                            issues |= Issue.HasClosures;
                        }
                        if (settings.RedRoad && segment.getAttribute('primaryStreetID') === null) {
                            issues |= Issue.RedRoad;
                        }
                        if (settings.HasTIO || settings.TI || settings.TITTS || settings.TIExit || viRegex !== null || towardsRegex !== null) {
                            let hasTIO = false;
                            let hasTI = false;
                            let hasTTS = false;
                            let hasExit = false;
                            let anyConnectedSegments = false;
                            const dirs = [];
                            if (segment.getAttribute('fwdDirection')) {
                                if (viRegex !== null || towardsRegex !== null) {
                                    dirs.push('to');
                                }
                                dirs.push(settings.TIDirection === IncomingOrOutgoing.Outgoing ? 'to' : 'from');
                            }
                            if (segment.getAttribute('revDirection')) {
                                if (viRegex !== null || towardsRegex !== null) {
                                    dirs.push('from');
                                }
                                dirs.push(settings.TIDirection === IncomingOrOutgoing.Outgoing ? 'from' : 'to');
                            }
                            let directions = [...new Set(dirs)];
                            for (let ixDir = 0; ixDir < directions.length; ixDir++) {
                                const node = segment.getNodeByDirection(directions[ixDir]);
                                const connectedSegments = segment.getConnectedSegmentsByDirection(W.model, directions[ixDir]);
                                for (let ixSeg = 0; ixSeg < connectedSegments.length && !hasTIO; ixSeg++) {
                                    const connectedSegment = connectedSegments[ixSeg];
                                    if (settings.EditableByMe && !connectedSegment.arePropertiesEditable()) {
                                        continue;
                                    }
                                    anyConnectedSegments = true;
                                    let turn;
                                    if (settings.TIDirection === IncomingOrOutgoing.Outgoing) {
                                        turn = graph.getTurnThroughNode(node, segment, connectedSegment).getTurnData();
                                    }
                                    else {
                                        turn = graph.getTurnThroughNode(node, connectedSegment, segment).getTurnData();
                                    }
                                    if (settings.HasTIO && turn.hasInstructionOpcode() && (settings.TIO == TIO.Any || turn.getInstructionOpcode() == settings.TIO)) {
                                        hasTIO = true;
                                    }
                                    if ((settings.TI || settings.TITTS || settings.TIExit) && turn.hasTurnGuidance()) {
                                        const tg = turn.getTurnGuidance();
                                        if (settings.TI &&
                                            nullif(tg.getVisualInstruction(), '') !== null ||
                                            nullif(tg.getTowards(), '') !== null) {
                                            hasTI = true;
                                        }
                                        if (settings.TITTS &&
                                            nullif(tg.getTTS(), '') !== null) {
                                            hasTTS = true;
                                        }
                                        if (settings.TIExit &&
                                            tg.getExitSigns().length > 0) {
                                            hasExit = true;
                                        }
                                    }
                                }
                            }
                            if (settings.HasTIO && hasTIO) {
                                issues |= Issue.HasTIO;
                                newSegment = true;
                            }
                            if (settings.TI) {
                                if (settings.TIOperation === HasOrMissing.Missing && !hasTI && anyConnectedSegments) {
                                    issues |= Issue.TI;
                                    newSegment = true;
                                }
                                else if (settings.TIOperation === HasOrMissing.Has && hasTI) {
                                    issues |= Issue.TI;
                                    newSegment = true;
                                }
                            }
                            if (settings.TITTS) {
                                if (settings.TITTSOperation === HasOrMissing.Missing && !hasTTS && anyConnectedSegments) {
                                    issues |= Issue.TITTS;
                                    newSegment = true;
                                }
                                else if (settings.TITTSOperation === HasOrMissing.Has && hasTTS) {
                                    issues |= Issue.TITTS;
                                    newSegment = true;
                                }
                            }
                            if (settings.TIExit) {
                                if (settings.TIExitOperation === HasOrMissing.Missing && !hasExit && anyConnectedSegments) {
                                    issues |= Issue.TIExit;
                                    newSegment = true;
                                }
                                else if (settings.TIExitOperation === HasOrMissing.Has && hasExit) {
                                    issues |= Issue.TIExit;
                                    newSegment = true;
                                }
                            }
                        }
                        if (settings.Loop && !segment.isInRoundabout()) {
                            const fromSegments = segment.getConnectedSegmentsByDirection(W.model, "from");
                            const toSegments = segment.getConnectedSegmentsByDirection(W.model, "to");
                            let hasLoop = false;
                            for (let ixFrom = 0; ixFrom < fromSegments.length && !hasLoop; ixFrom++) {
                                for (let ixTo = 0; ixTo < toSegments.length && !hasLoop; ixTo++) {
                                    if (fromSegments[ixFrom].getAttribute('id') == toSegments[ixTo].getAttribute('id') ||
                                        fromSegments[ixFrom].getAttribute('id') == segment.getAttribute('id')) {
                                        issues |= Issue.Loop;
                                        hasLoop = true;
                                    }
                                }
                            }
                        }
                        if (settings.Shield) {
                            if (settings.ShieldOperation === HasOrMissing.Missing) {
                                let missingShield = primaryAddrMatches &&
                                    (primaryStreet?.attributes?.signType == null ||
                                        nullif(primaryStreet?.attributes?.signText, '') == null);
                                if (settings.IncludeAltNames && hasAltNames) {
                                    for (let streetIx = 0; streetIx < segment.getAttribute('streetIDs').length && !missingShield; streetIx++) {
                                        if (altAddrMatches[streetIx] && segment.getAttribute('streetIDs')[streetIx] != null) {
                                            const street = W.model.streets.getObjectById(segment.getAttribute('streetIDs')[streetIx]);
                                            missingShield = street?.attributes?.signType == null || nullif(street?.attributes?.signText, '') == null;
                                        }
                                    }
                                }
                                if (missingShield) {
                                    issues |= Issue.Shield;
                                }
                            }
                            else if (settings.ShieldOperation === HasOrMissing.Has) {
                                let hasShield = primaryAddrMatches && primaryShieldMatches && primaryStreet?.attributes?.signType != null && nullif(primaryStreet?.attributes?.signText, '') != null;
                                if (settings.IncludeAltNames && hasAltNames) {
                                    for (let streetIx = 0; streetIx < segment.getAttribute('streetIDs').length && !hasShield; streetIx++) {
                                        if (altAddrMatches[streetIx] && altShieldMatches[streetIx] && segment.getAttribute('streetIDs')[streetIx] != null) {
                                            const street = W.model.streets.getObjectById(segment.getAttribute('streetIDs')[streetIx]);
                                            hasShield = street?.attributes?.signType != null &&
                                                nullif(street?.attributes?.signText, '') != null;
                                        }
                                    }
                                }
                                if (hasShield) {
                                    issues |= Issue.Shield;
                                }
                            }
                        }
                        if (settings.ShieldDirection) {
                            if (settings.ShieldDirectionOperation === HasOrMissing.Missing) {
                                let missingDirection = primaryAddrMatches && primaryStreet?.attributes?.signType != null && nullif(primaryStreet?.attributes?.direction, '') == null;
                                if (settings.IncludeAltNames && hasAltNames) {
                                    for (let streetIx = 0; streetIx < segment.getAttribute('streetIDs').length && !missingDirection; streetIx++) {
                                        if (altAddrMatches[streetIx] && segment.getAttribute('streetIDs')[streetIx] != null) {
                                            const street = W.model.streets.getObjectById(segment.getAttribute('streetIDs')[streetIx]);
                                            missingDirection = street?.attributes?.signType != null && nullif(street?.attributes?.direction, '') == null;
                                        }
                                    }
                                }
                                if (missingDirection) {
                                    issues |= Issue.ShieldDirection;
                                }
                            }
                            else if (settings.ShieldDirectionOperation === HasOrMissing.Has) {
                                let hasDirection = nullif(primaryStreet?.attributes?.direction, '') != null;
                                if (settings.IncludeAltNames && hasAltNames) {
                                    for (let streetIx = 0; streetIx < segment.getAttribute('streetIDs').length && !hasDirection; streetIx++) {
                                        if (altAddrMatches[streetIx] && altShieldMatches[streetIx] && segment.getAttribute('streetIDs')[streetIx] != null) {
                                            const street = W.model.streets.getObjectById(segment.getAttribute('streetIDs')[streetIx]);
                                            hasDirection = nullif(street?.attributes?.direction, '') != null;
                                        }
                                    }
                                }
                                if (hasDirection) {
                                    issues |= Issue.ShieldDirection;
                                }
                            }
                        }
                        if (detectIssues && issues === 0) {
                            // If at least one issue was chosen and this segment doesn't have any issues, then skip it
                            continue;
                        }
                        if (!settings.Roundabouts) {
                            addSegment(segment, (!segment.isInRoundabout() ? null : segment.getRoundabout().getAttribute('id')), issues, newSegment);
                        }
                        else if (!segment.isInRoundabout() && settings.RoundaboutsOperation === 0) {
                            addSegment(segment, null, issues, newSegment);
                        }
                        else if (segment.isInRoundabout() && settings.RoundaboutsOperation === 1) {
                            let r = segment.getRoundabout().attributes;
                            addSegment(segment, r.id, issues, newSegment);
                        }
                    }
                }
            }
        }
        if (settings.SuggestedSegmentsOperation != 2) {
            for (let ix = 0; ix < suggestedSegments.length; ix++) {
                suggestedSegment = suggestedSegments[ix];
                if (suggestedSegment != null) {
                    if ((WMEWAL.WazeRoadTypeToRoadTypeBitmask(suggestedSegment.getAttribute('roadType')) & settings.RoadTypeMask) &&
                        (!settings.EditableByMe || suggestedSegment.arePropertiesEditable()) &&
                        (settings.Direction == null || determineDirection(suggestedSegment) === settings.Direction) &&
                        (!settings.Updated ||
                            (settings.UpdatedOperation === Operation.LessThan && suggestedSegment.getAttribute('updatedOn') < settings.UpdatedDate) ||
                            (settings.UpdatedOperation === Operation.LessThanOrEqual && suggestedSegment.getAttribute('updatedOn') <= settings.UpdatedDate) ||
                            (settings.UpdatedOperation === Operation.GreaterThan && suggestedSegment.getAttribute('updatedOn') > settings.UpdatedDate) ||
                            (settings.UpdatedOperation === Operation.GreaterThanOrEqual && suggestedSegment.getAttribute('updatedOn') >= settings.UpdatedDate)) &&
                        ((settings.LastModifiedBy === null) ||
                            ((suggestedSegment.getUpdatedBy() ?? suggestedSegment.getCreatedBy()) === settings.LastModifiedBy))) {
                        if (!WMEWAL.IsSegmentInArea(suggestedSegment)) {
                            continue;
                        }
                        if (settings.SuggestedSegments) {
                            if (settings.SuggestedSegmentsStatus == 0 && suggestedSegment.getStatus() != 'OPEN') {
                                continue;
                            }
                            if (settings.SuggestedSegmentsStatus == 1 && suggestedSegment.getStatus() != 'REJECTED') {
                                continue;
                            }
                        }
                        addSuggestedSegment(suggestedSegment);
                    }
                }
            }
        }
        for (let ix = 0; ix < extentStreets.length; ix++) {
            extentStreets[ix].center = extentStreets[ix].geometries.getCentroid(true);
            delete extentStreets[ix].geometries;
            streets.push(extentStreets[ix]);
        }
        return streets.length;
    }
    function translateDirection(d) {
        switch (d) {
            case Direction.OneWay:
                return "One way";
            case Direction.TwoWay:
                return "Two way";
            default:
                return "Unknown";
        }
    }
    function ScanComplete() {
        roundabouts = null;
        if (streets.length === 0) {
            alert(pluginName + ": No streets found.");
        }
        else {
            streets.sort(function (a, b) {
                let cmp = getStreetName(a).localeCompare(getStreetName(b));
                if (cmp !== 0) {
                    return cmp;
                }
                cmp = a.state.localeCompare(b.state);
                if (cmp !== 0) {
                    return cmp;
                }
                cmp = a.city.localeCompare(b.city);
                if (cmp !== 0) {
                    return cmp;
                }
                if (a.lockLevel < b.lockLevel) {
                    return -1;
                }
                else if (a.lockLevel > b.lockLevel) {
                    return 1;
                }
                return 0;
            });
            const isCSV = (WMEWAL.outputTo & WMEWAL.OutputTo.CSV);
            const isTab = (WMEWAL.outputTo & WMEWAL.OutputTo.Tab);
            const addBOM = WMEWAL.addBOM ?? false;
            const includeAltNames = settings.IncludeAltNames;
            const includeASC = settings.IncludeASC;
            const includeDirection = (settings.Direction != null);
            const includeLength = settings.SegmentLength || settings.SegmentLengthFilter;
            const outputFields = WMEWAL.outputFields ?? ['CreatedEditor', 'LastEditor', 'LockLevel', 'Lat', 'Lon'];
            const includeLockLevel = outputFields.indexOf('LockLevel') > -1 || settings.LockLevel !== null;
            const includeCreatedBy = outputFields.indexOf('CreatedEditor') > -1 || settings.CreatedBy !== null;
            const includeLastUpdatedBy = outputFields.indexOf('LastEditor') > -1 || settings.LastModifiedBy !== null;
            const includeLat = outputFields.indexOf('Lat') > -1;
            const includeLon = outputFields.indexOf('Lon') > -1;
            const includeRejectionReason = settings.SuggestedSegmentsOperation != 2 &&
                (!settings.SuggestedSegments || settings.SuggestedSegmentsStatus == 1);
            let lineArray;
            let columnArray;
            let w;
            let fileName;
            if (isCSV) {
                lineArray = [];
                columnArray = ["Name"];
                if (includeAltNames) {
                    columnArray.push("Alt Names");
                }
                if (includeASC) {
                    columnArray.push("Has ASC");
                }
                columnArray.push("City", "State", "Road Type");
                if (includeLockLevel) {
                    columnArray.push('Lock Level');
                }
                if (includeDirection) {
                    columnArray.push("Direction");
                }
                if (includeLength) {
                    columnArray.push(`Length (${isImperial ? 'ft' : 'm'})`);
                }
                if (includeShields) {
                    columnArray.push('Shield Text', 'Shield Direction');
                }
                if (detectIssues) {
                    columnArray.push("Issues");
                }
                if (includeCreatedBy) {
                    columnArray.push('Created By');
                }
                if (includeLastUpdatedBy) {
                    columnArray.push('Last Updated By');
                }
                if (includeLat) {
                    columnArray.push('Latitude');
                }
                if (includeLon) {
                    columnArray.push('Longitude');
                }
                if (includeRejectionReason) {
                    columnArray.push('Rejection reason');
                }
                columnArray.push("Permalink");
                lineArray.push(columnArray);
                fileName = "Streets_" + WMEWAL.areaName;
                let RTMask = settings.RoadTypeMask;
                for (let rt in WMEWAL.RoadType) {
                    if (WMEWAL.RoadType.hasOwnProperty(rt)) {
                        const mask = parseInt(rt);
                        if (!isNaN(mask)) {
                            if (RTMask === 65535) {
                                fileName += "_AllRoads";
                                break;
                            }
                            else if (RTMask === (RTMask | 60)) { // All highways
                                fileName += "_" + I18n.t("segment.categories.highways").replace(/\s+/g, "_");
                                RTMask = RTMask & (65535 - 60);
                            }
                            else if (RTMask === (RTMask | 32771)) { // All local roads (PS, St, Alley)
                                fileName += "_" + I18n.t("segment.categories.streets").replace(/\s+/g, "_");
                                RTMask = RTMask & (65535 - 32771);
                            }
                            else if (RTMask === (RTMask | 17728)) { // Other drivable roads
                                fileName += "_" + I18n.t("segment.categories.other_drivable").replace(/\s+/g, "_");
                                RTMask = RTMask & (65535 - 17728);
                            }
                            else if (RTMask === (RTMask | 14976)) { // Non-drivable roads, including pedestrian paths
                                fileName += "_" + I18n.t("segment.categories.non_drivable").replace(/\s+/g, "_");
                                RTMask = RTMask & (65535 - 14976);
                            }
                            else if (RTMask & mask) {
                                fileName += "_" + WMEWAL.RoadType[mask.toString()];
                            }
                        }
                    }
                }
                fileName += ".csv";
            }
            if (isTab) {
                w = window.open();
                w.document.write("<html><head><title>Streets</title></head><body>");
                w.document.write("<h3>Area: " + WMEWAL.areaName + "</h3>");
                w.document.write("<h4>Filters</h4>");
                w.document.write("<div>Road Type: ");
                let comma = "";
                for (let rt in WMEWAL.RoadType) {
                    if (WMEWAL.RoadType.hasOwnProperty(rt)) {
                        const mask = parseInt(rt);
                        if (!isNaN(mask) && settings.RoadTypeMask & mask) {
                            w.document.write(comma + WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(mask)));
                            comma = ", ";
                        }
                    }
                }
                w.document.write('</div>');
                if (settings.LockLevel != null) {
                    w.document.write("<div>Lock level " + (settings.LockLevelOperation === Operation.NotEqual ? "does not equal " : "equals ") + settings.LockLevel.toString() + '</div>');
                }
                if (settings.Direction != null) {
                    w.document.write("<div>Direction " + translateDirection(settings.Direction) + '</div>');
                }
                if (cityRegex != null) {
                    w.document.write("<div>City Name matches " + cityRegex.source);
                    if (settings.CityRegexIgnoreCase) {
                        w.document.write(" (ignoring case)");
                    }
                    w.document.write('</div>');
                }
                if (settings.State != null) {
                    w.document.write("<div>State " + (settings.StateOperation === Operation.NotEqual ? "does not equal " : "equals ") + stateName + '</div>');
                }
                if (nameRegex != null) {
                    w.document.write("<div>Name matches " + nameRegex.source);
                    if (settings.RegexIgnoreCase) {
                        w.document.write(" (ignoring case)");
                    }
                    w.document.write('</div>');
                }
                if (settings.Roundabouts) {
                    w.document.write(`<div>Roundabouts ${settings.RoundaboutsOperation === 0 ? 'excluded' : 'only'}</div>`);
                }
                if (settings.ExcludeJunctionBoxes) {
                    w.document.write("<div>Junction boxes excluded</div>");
                }
                if (settings.EditableByMe) {
                    w.document.write("<div>Editable by me</div>");
                }
                if (settings.CreatedBy != null) {
                    w.document.write("<div>Created by " + createdByName + '</div>');
                }
                if (settings.LastModifiedBy != null) {
                    w.document.write("<div>Last updated by " + lastModifiedByName + '</div>');
                }
                if (settings.Unpaved) {
                    w.document.write("<div>" + I18n.t("edit.segment.fields.unpaved") + '</div>');
                }
                if (settings.Tunnel) {
                    w.document.write("<div>" + I18n.t("edit.segment.fields.tunnel") + '</div>');
                }
                if (settings.HeadlightsRequired) {
                    w.document.write("<div>" + I18n.t("edit.segment.fields.headlights") + '</div>');
                }
                if (settings.NearHOV) {
                    w.document.write("<div>" + I18n.t("edit.segment.fields.nearbyHOV") + '</div>');
                }
                if (settings.Toll) {
                    w.document.write("<div>" + I18n.t("edit.segment.fields.toll_road") + '</div>');
                }
                if (settings.Beacons) {
                    w.document.write("<div>" + I18n.t("edit.segment.fields.beacons") + '</div>');
                }
                if (settings.LaneGuidance) {
                    w.document.write(`<div>${(settings.LaneGuidanceOperation === 0 ? "Has" : "Missing")} lane guidance</div>`);
                }
                if (settings.Created) {
                    w.document.write("<div>Created ");
                    switch (settings.CreatedOperation) {
                        case Operation.GreaterThan:
                            w.document.write("after");
                            break;
                        case Operation.GreaterThanOrEqual:
                            w.document.write("on or after");
                            break;
                        case Operation.LessThan:
                            w.document.write("before");
                            break;
                        case Operation.LessThanOrEqual:
                            w.document.write("on or before");
                            break;
                        default:
                            break;
                    }
                    w.document.write(` ${new Date(settings.CreatedDate).toString()}</div>`);
                }
                if (settings.Updated) {
                    w.document.write("<div>Updated ");
                    switch (settings.UpdatedOperation) {
                        case Operation.GreaterThan:
                            w.document.write("after");
                            break;
                        case Operation.GreaterThanOrEqual:
                            w.document.write("on or after");
                            break;
                        case Operation.LessThan:
                            w.document.write("before");
                            break;
                        case Operation.LessThanOrEqual:
                            w.document.write("on or before");
                            break;
                        default:
                            break;
                    }
                    w.document.write(` ${new Date(settings.UpdatedDate).toString()}</div>`);
                }
                if (settings.SegmentLengthFilter) {
                    w.document.write("<div>Segment length ");
                    switch (settings.SegmentLengthFilterOperation) {
                        case Operation.LessThan:
                            w.document.write("&lt;");
                            break;
                        case Operation.LessThanOrEqual:
                            w.document.write("&lt;=");
                            break;
                        case Operation.GreaterThan:
                            w.document.write("&gt;");
                            break;
                        case Operation.GreaterThanOrEqual:
                            w.document.write("&gt;=");
                            break;
                        default:
                            break;
                    }
                    w.document.write(` ${settings.SegmentLengthFilterValue} ${settings.SegmentLengthFilterUnit == Unit.Metric ? 'm' : 'ft'}</div>`);
                }
                if (shieldTextRegex != null) {
                    w.document.write("<div>Shield Text matches " + shieldTextRegex.source);
                    if (settings.ShieldTextRegexIgnoreCase) {
                        w.document.write(" (ignoring case)");
                    }
                    w.document.write('</div>');
                }
                if (shieldDirectionRegex != null) {
                    w.document.write("<div>Shield Direction matches " + shieldDirectionRegex.source);
                    if (settings.ShieldDirectionRegexIgnoreCase) {
                        w.document.write(" (ignoring case)");
                    }
                    w.document.write('</div>');
                }
                if (viRegex !== null) {
                    w.document.write(`<div>Visual Instruction matches ${viRegex.source}`);
                    if (settings.VIRegexIgnoreCase) {
                        w.document.write(' (ignoring case)');
                    }
                    w.document.write('</div>');
                }
                if (towardsRegex !== null) {
                    w.document.write(`<div>Towards matches ${towardsRegex.source}`);
                    if (settings.TowardsRegexIgnoreCase) {
                        w.document.write(' (ignoring case)');
                    }
                    w.document.write('</div>');
                }
                if (ttsRegex !== null) {
                    w.document.write(`<div>TTS matches ${ttsRegex.source}`);
                    if (settings.TTSRegexIgnoreCase) {
                        w.document.write(' (ignoring case)');
                    }
                    w.document.write('</div>');
                }
                if (intersectingNameRegex !== null) {
                    w.document.write(`<div>Intersecting Name matches ${intersectingNameRegex.source}`);
                    if (settings.IntersectingNameRegexIgnoreCase) {
                        w.document.write(' (ignoring case)');
                    }
                    w.document.write('</div>');
                }
                w.document.write('<div>Suggested segments: ');
                switch (settings.SuggestedSegmentsOperation) {
                    case 0:
                        w.document.write('Only');
                        break;
                    case 1:
                        w.document.write('Included');
                        break;
                    case 2:
                        w.document.write('Excluded');
                        break;
                    default:
                        break;
                }
                w.document.write('</div>');
                if (settings.SuggestedSegments) {
                    w.document.write(`<div>Suggested segments status: `);
                    switch (settings.SuggestedSegmentsStatus) {
                        case 0:
                            w.document.write('Open');
                            break;
                        case 1:
                            w.document.write('Rejected');
                            break;
                        default:
                            break;
                    }
                    w.document.write('</div>');
                }
                if (detectIssues) {
                    w.document.write("<h4>Issues</h4>");
                }
                if (settings.NoSpeedLimit) {
                    w.document.write("<div>Missing speed limit</div>");
                }
                if (settings.HasTimeBasedRestrictions) {
                    w.document.write("<div>Has time-based restrictions</div>");
                }
                if (settings.HasTimeBasedTurnRestrictions) {
                    w.document.write("<div>Has time-based turn restrictions</div>");
                }
                if (settings.HasRestrictedJunctionArrow) {
                    w.document.write("<div>Has restricted junction arrows (red arrows)</div>");
                }
                if (settings.UnknownDirection) {
                    w.document.write("<div>Unknown direction</div>");
                }
                if (settings.OneWay) {
                    w.document.write("<div>One way</div>");
                }
                if (settings.HasUTurn) {
                    w.document.write("<div>Has u-turn</div>");
                }
                if (settings.HasSoftTurns) {
                    w.document.write("<div>Has soft turns</div>");
                }
                if (settings.HasUnnecessaryJunctionNode) {
                    w.document.write("<div>Has unnecessary junction node</div>");
                }
                if (settings.Elevation) {
                    w.document.write("<div>Elevation ");
                    switch (settings.ElevationOperation) {
                        case Operation.LessThan:
                            w.document.write("&lt;");
                            break;
                        case Operation.GreaterThan:
                            w.document.write("&gt;");
                            break;
                        case Operation.NotEqual:
                            w.document.write("!=");
                            break;
                        default:
                            break;
                    }
                    w.document.write(" 0</div>");
                }
                if (settings.SegmentLength) {
                    w.document.write("<div>Segment length ");
                    switch (settings.SegmentLengthOperation) {
                        case Operation.LessThan:
                            w.document.write("&lt;");
                            break;
                        case Operation.LessThanOrEqual:
                            w.document.write("&lt;=");
                            break;
                        case Operation.GreaterThan:
                            w.document.write("&gt;");
                            break;
                        case Operation.GreaterThanOrEqual:
                            w.document.write("&gt;=");
                            break;
                        default:
                            break;
                    }
                    w.document.write(` ${settings.SegmentLengthValue} ${settings.SegmentLengthUnit == Unit.Metric ? 'm' : 'ft'}</div>`);
                }
                if (settings.HasNoName) {
                    w.document.write("<div>Has no name</div>");
                }
                if (settings.HasNoCity) {
                    w.document.write('<div>Has no city (');
                    switch (settings.HasNoCityOperation) {
                        case PrimaryOrAlt.PrimaryOnly:
                            w.document.write('Primary');
                            break;
                        case PrimaryOrAlt.AltOnly:
                            w.document.write('Alt');
                            break;
                        case PrimaryOrAlt.Either:
                            w.document.write('Primary or Alt');
                            break;
                        case PrimaryOrAlt.Both:
                            w.document.write('Primary and all Alt');
                            break;
                    }
                    w.document.write(')</div>');
                }
                if (settings.NoHN) {
                    w.document.write("<div>Has no house numbers</div>");
                }
                if (settings.Minus1RoutingPreference) {
                    w.document.write("<div>-1 routing preference</div>");
                }
                if (settings.Plus1RoutingPreference) {
                    w.document.write("<div>+1 routing preference</div>");
                }
                // if (settings.NonNeutralRoutingPreference) {
                //     w.document.write("<br/>Non-neutral routing preference");
                // }
                if (settings.RampWithSL) {
                    w.document.write("<div>Ramp with speed limit</div>");
                }
                if (settings.NewlyPaved) {
                    w.document.write("<div>Newly paved</div>");
                }
                if (settings.HasClosures) {
                    w.document.write("<div>Has closures</div>");
                }
                if (settings.TI) {
                    if (settings.TIOperation === HasOrMissing.Missing) {
                        w.document.write(`<div>Does not have ${settings.TIDirection === IncomingOrOutgoing.Outgoing ? 'outgoing' : 'incoming'} TI (visual instruction, toward)</div>`);
                    }
                    else {
                        w.document.write(`<div>Has ${settings.TIDirection === IncomingOrOutgoing.Outgoing ? 'outgoing' : 'incoming'} TI (visual instruction, toward)</div>`);
                    }
                }
                if (settings.TIExit) {
                    if (settings.TIExitOperation === HasOrMissing.Missing) {
                        w.document.write(`<div>Does not have ${settings.TIDirection === IncomingOrOutgoing.Outgoing ? 'outgoing' : 'incoming'} TI Exit sign(s)</div>`);
                    }
                    else {
                        w.document.write(`<div>Has ${settings.TIDirection === IncomingOrOutgoing.Outgoing ? 'outgoing' : 'incoming'} TI Exit sign(s)</div>`);
                    }
                }
                if (settings.HasTIO) {
                    w.document.write(`<div>Has ${settings.TIDirection === IncomingOrOutgoing.Outgoing ? 'outgoing' : 'incoming'} TI voice prompt${settings.TIO == TIO.Any ? "" : ": " + I18n.t("turn_tooltip.instruction_override.opcodes." + settings.TIO)}</div>`);
                }
                if (settings.TITTS) {
                    if (settings.TITTSOperation === HasOrMissing.Missing) {
                        w.document.write(`<div>Does not have ${settings.TIDirection === IncomingOrOutgoing.Outgoing ? 'outgoing' : 'incoming'} TI TTS</div>`);
                    }
                    else {
                        w.document.write(`<div>Has ${settings.TIDirection === IncomingOrOutgoing.Outgoing ? 'outgoing' : 'incoming'} TI TTS</div>`);
                    }
                }
                if (settings.Loop) {
                    w.document.write("<div>Loop</div>");
                }
                if (settings.Shield) {
                    if (settings.ShieldOperation === HasOrMissing.Missing) {
                        w.document.write('<div>Does not have shield</div>');
                    }
                    else {
                        w.document.write('<div>Has shield</div>');
                    }
                }
                if (settings.ShieldDirection) {
                    if (settings.ShieldDirectionOperation === HasOrMissing.Missing) {
                        w.document.write('<div>Does not have shield direction</div>');
                    }
                    else {
                        w.document.write('<div>Has shield direction</div>');
                    }
                }
                if (settings.HouseNumbersWithNoCity) {
                    w.document.write('<div>Has house numbers but no city on primary or any alt name</div>');
                }
                if (settings.RedRoad) {
                    w.document.write('<div>Red road</div>');
                }
                if (settings.ExpiredRestrictions) {
                    w.document.write('<div>Has expired restrictions</div>');
                }
                w.document.write("<table style='border-collapse: separate; border-spacing: 8px 0px'><tr><th>Name</th>");
                if (includeAltNames) {
                    w.document.write("<th>Alt Names</th>");
                }
                if (includeASC) {
                    w.document.write("<th>Has ASC</th>");
                }
                w.document.write("<th>City</th><th>State</th>");
                w.document.write("<th>Road Type</th>");
                if (includeLockLevel) {
                    w.document.write('<th>Lock Level</th>');
                }
                if (includeDirection) {
                    w.document.write("<th>Direction</th>");
                }
                if (includeLength) {
                    w.document.write(`<th>Length (${isImperial ? 'ft' : 'm'})</th>`);
                }
                if (includeShields) {
                    w.document.write('<th>Shield Text</th><th>Shield Direction</th>');
                }
                if (detectIssues) {
                    w.document.write("<th>Issues</th>");
                }
                if (includeCreatedBy) {
                    w.document.write('<th>Created By</th>');
                }
                if (includeLastUpdatedBy) {
                    w.document.write('<th>Last Updated By</th>');
                }
                if (includeLat) {
                    w.document.write('<th>Latitude</th>');
                }
                if (includeLon) {
                    w.document.write('<th>Longitude</th>');
                }
                if (includeRejectionReason) {
                    w.document.write('<th>Rejection reason</th>');
                }
                w.document.write("<th>Permalink</th></tr>");
            }
            for (let ixStreet = 0; ixStreet < streets.length; ixStreet++) {
                const street = streets[ixStreet];
                const roadTypeText = WMEWAL.TranslateRoadType(street.roadType);
                if (street.name == null && street.roundaboutId == null) {
                    for (let ixSeg = 0; ixSeg < street.segments.length; ixSeg++) {
                        const segment = street.segments[ixSeg];
                        const latlon = OpenLayers.Layer.SphericalMercator.inverseMercator(segment.center.x, segment.center.y);
                        const plSeg = getSegmentPL(segment);
                        if (isCSV) {
                            columnArray = [getStreetName(street)];
                            if (includeAltNames) {
                                columnArray.push('');
                            }
                            if (includeASC) {
                                columnArray.push(street.asc);
                            }
                            columnArray.push(`"${street.city}"`);
                            columnArray.push(`"${street.state}"`);
                            columnArray.push(`"${roadTypeText}"`);
                            if (includeLockLevel) {
                                columnArray.push(`${street.lockLevel ?? ''}`);
                            }
                            if (includeDirection) {
                                columnArray.push(`"${translateDirection(street.direction)}"`);
                            }
                            if (includeLength) {
                                columnArray.push(`${street.length ?? ''}`);
                            }
                            if (includeShields) {
                                columnArray.push(`"${street.shieldText}","${street.shieldDirection}"`);
                            }
                            if (detectIssues) {
                                columnArray.push(`"${getIssues(street.issues)}"`);
                            }
                            if (includeCreatedBy) {
                                columnArray.push(`"${street.createdEditor ?? ''}"`);
                            }
                            if (includeLastUpdatedBy) {
                                columnArray.push(`"${street.lastEditor ?? ''}"`);
                            }
                            if (includeLat) {
                                columnArray.push(`${latlon.lat}`);
                            }
                            if (includeLon) {
                                columnArray.push(`${latlon.lon}`);
                            }
                            if (includeRejectionReason) {
                                columnArray.push(`"${translateRejectionReason(street.rejectionReason)}"`);
                            }
                            columnArray.push(`"${plSeg}"`);
                            lineArray.push(columnArray);
                        }
                        if (isTab) {
                            w.document.write(`<tr><td>${getStreetName(street)}</td>`);
                            if (includeAltNames) {
                                w.document.write('<td>&nbsp;</td>');
                            }
                            if (includeASC) {
                                w.document.write(`<td>${street.asc}</td>`);
                            }
                            w.document.write(`<td>${street.city}</td>`);
                            w.document.write(`<td>${street.state}</td>`);
                            w.document.write(`<td>${roadTypeText}</td>`);
                            if (includeLockLevel) {
                                w.document.write(`<td>${street.lockLevel ?? ''}</td>`);
                            }
                            if (includeDirection) {
                                w.document.write(`<td>${translateDirection(street.direction)}</td>`);
                            }
                            if (includeLength) {
                                w.document.write(`<td>${street.length ?? ''}</td>`);
                            }
                            if (includeShields) {
                                w.document.write(`<td>${street.shieldText}</td><td>${street.shieldDirection}</td>`);
                            }
                            if (detectIssues) {
                                w.document.write(`<td>${getIssues(street.issues)}</td>`);
                            }
                            if (includeCreatedBy) {
                                w.document.write(`<td>${street.createdEditor ?? ''}</td>`);
                            }
                            if (includeLastUpdatedBy) {
                                w.document.write(`<td>${street.lastEditor ?? ''}</td>`);
                            }
                            if (includeLat) {
                                w.document.write(`<td>${latlon.lat}</td>`);
                            }
                            if (includeLon) {
                                w.document.write(`<td>${latlon.lon}</td>`);
                            }
                            if (includeRejectionReason) {
                                w.document.write(`<td>${translateRejectionReason(street.rejectionReason)}</td>`);
                            }
                            w.document.write(`<td><a href='${plSeg}' target='_blank'>Permalink</a></td></tr>`);
                        }
                    }
                }
                else {
                    const latlon = OpenLayers.Layer.SphericalMercator.inverseMercator(street.center.x, street.center.y);
                    const plStreet = getStreetPL(street);
                    let altNames = "";
                    for (let ixAlt = 0; ixAlt < street.altStreets.length; ixAlt++) {
                        if (ixAlt > 0) {
                            altNames += "; ";
                        }
                        altNames += street.altStreets[ixAlt].name;
                        if (street.altStreets[ixAlt].city != null) {
                            altNames += ", " + street.altStreets[ixAlt].city;
                        }
                    }
                    if (isCSV) {
                        columnArray = [`"${getStreetName(street)}"`];
                        if (includeAltNames) {
                            columnArray.push(`"${altNames}"`);
                        }
                        if (includeASC) {
                            columnArray.push(street.asc);
                        }
                        columnArray.push(`"${street.city}"`);
                        columnArray.push(`"${street.state}"`);
                        columnArray.push(`"${roadTypeText}"`);
                        if (includeLockLevel) {
                            columnArray.push(`${street.lockLevel ?? ''}`);
                        }
                        if (includeDirection) {
                            columnArray.push(`"${translateDirection(street.direction)}"`);
                        }
                        if (includeLength) {
                            columnArray.push(`${street.length ?? ''}`);
                        }
                        if (includeShields) {
                            columnArray.push(`"${street.shieldText}"`, `"${street.shieldDirection}"`);
                        }
                        if (detectIssues) {
                            columnArray.push(`"${getIssues(street.issues)}"`);
                        }
                        if (includeCreatedBy) {
                            columnArray.push(`"${street.createdEditor ?? ''}"`);
                        }
                        if (includeLastUpdatedBy) {
                            columnArray.push(`"${street.lastEditor ?? ''}"`);
                        }
                        if (includeLat) {
                            columnArray.push(`${latlon.lat}`);
                        }
                        if (includeLon) {
                            columnArray.push(`${latlon.lon}`);
                        }
                        if (includeRejectionReason) {
                            columnArray.push(`"${translateRejectionReason(street.rejectionReason)}"`);
                        }
                        columnArray.push(`"${plStreet}"`);
                        lineArray.push(columnArray);
                    }
                    if (isTab) {
                        w.document.write(`<tr><td>${getStreetName(street)}</td>`);
                        if (includeAltNames) {
                            w.document.write(`<td>${altNames}</td>`);
                        }
                        if (includeASC) {
                            w.document.write(`<td>${street.asc}</td>`);
                        }
                        w.document.write(`<td>${street.city}</td>`);
                        w.document.write(`<td>${street.state}</td>`);
                        w.document.write(`<td>${roadTypeText}</td>`);
                        if (includeLockLevel) {
                            w.document.write(`<td>${street.lockLevel ?? ''}</td>`);
                        }
                        if (includeDirection) {
                            w.document.write(`<td>${translateDirection(street.direction)}</td>`);
                        }
                        if (includeLength) {
                            w.document.write(`<td>${street.length ?? ''}</td>`);
                        }
                        if (includeShields) {
                            w.document.write(`<td>${street.shieldText}</td><td>${street.shieldDirection}</td>`);
                        }
                        if (detectIssues) {
                            w.document.write(`<td>${getIssues(street.issues)}</td>`);
                        }
                        if (includeCreatedBy) {
                            w.document.write(`<td>${street.createdEditor ?? ''}</td>`);
                        }
                        if (includeLastUpdatedBy) {
                            w.document.write(`<td>${street.lastEditor ?? ''}</td>`);
                        }
                        if (includeLat) {
                            w.document.write(`<td>${latlon.lat}</td>`);
                        }
                        if (includeLon) {
                            w.document.write(`<td>${latlon.lon}</td>`);
                        }
                        if (includeRejectionReason) {
                            w.document.write(`<td>${translateRejectionReason(street.rejectionReason)}</td>`);
                        }
                        w.document.write(`<td><a href='${plStreet}' target='_blank'>Permalink</a></td></tr>`);
                    }
                }
            }
            if (isCSV) {
                const csvContent = lineArray.join("\n") + "\n" + WMEWAL.getErrCsvText();
                const blobContent = [];
                if (addBOM) {
                    blobContent.push('\uFEFF');
                }
                blobContent.push(csvContent);
                const blob = new Blob(blobContent, { type: "data:text/csv;charset=utf-8" });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                const node = document.body.appendChild(link);
                link.click();
                document.body.removeChild(node);
            }
            if (isTab) {
                WMEWAL.writeErrText(w);
                w.document.write("</table></body></html>");
                w.document.close();
                w = null;
            }
        }
        streets = null;
        savedSegments = null;
    }
    WMEWAL_Streets.ScanComplete = ScanComplete;
    function ScanCancelled() {
        ScanComplete();
    }
    WMEWAL_Streets.ScanCancelled = ScanCancelled;
    function translateRejectionReason(rejectionReason) {
        if (rejectionReason == null) {
            return '';
        }
        else {
            switch (rejectionReason) {
                case 0:
                    return 'Road does not exist';
                case 1:
                    return 'Road is permanently closed';
                case 2:
                    return 'Road exists but Waze does not map such (Other) roads';
                case 3:
                    return 'Road already exists. Suggested geometry is wrong';
                case 4:
                    return 'Road already exists. Suggested geometry is more accurate';
                case 5:
                    return 'Road is under construction or temporarily moved';
                case 6:
                    return 'Road already exists. Nearly identical to Waze. Looks like a bug';
                case 7:
                    return "Road exists but Waze doesn't map Non-Drivable roads (pedestrian path, bike lane, etc.)";
                case 8:
                    return "Road exists but Waze doesn't map Private/Military Base roads";
                case 9:
                    return "Road exists but Waze doesn't map Unpaved/4x4 roads";
                case 10:
                    return "Road exists but Waze doesn't map Back Alley roads";
                default:
                    return 'Unknown';
            }
        }
    }
    function getStreetPL(street) {
        const latlon = OpenLayers.Layer.SphericalMercator.inverseMercator(street.center.x, street.center.y);
        let url = WMEWAL.GenerateBasePL(latlon.lat, latlon.lon, WMEWAL.zoomLevel) + '&' + (street.type == 'suggestedsegment' ? 'segmentSuggestions' : 'segments') + '=';
        for (let ix = 0; ix < street.segments.length; ix++) {
            if (ix > 0) {
                url += ",";
            }
            url += street.segments[ix].id;
        }
        return url;
    }
    function getSegmentPL(segment) {
        const latlon = OpenLayers.Layer.SphericalMercator.inverseMercator(segment.center.x, segment.center.y);
        return WMEWAL.GenerateBasePL(latlon.lat, latlon.lon, 5) + "&" + (segment.type == 'suggestedsegment' ? 'segmentSuggestions' : 'segments') + '=' + segment.id;
    }
    function getStreetName(street) {
        return street.name || "No street";
    }
    function getIssues(issues) {
        const issuesList = [];
        if (issues & Issue.NoSpeedLimit) {
            issuesList.push("No Speed Limit");
        }
        if (issues & Issue.RestrictedJunctionArrows) {
            issuesList.push("Restricted junction arrows (red arrows)");
        }
        if (issues & Issue.TimeBasedRestrictions) {
            issuesList.push("Time-based restrictions");
        }
        if (issues & Issue.TimeBasedTurnRestrictions) {
            issuesList.push("Time-based turn restrictions");
        }
        if (issues & Issue.UTurn) {
            issuesList.push("U-turn");
        }
        if (issues & Issue.SoftTurns) {
            issuesList.push("Soft turns");
        }
        if (issues & Issue.UnnecessaryJunctionNode) {
            issuesList.push("Unnecessary junction node");
        }
        if (issues & Issue.Elevation) {
            issuesList.push("Elevation");
        }
        if (issues & Issue.SegmentLength) {
            issuesList.push("Segment length");
        }
        if (issues & Issue.NoName) {
            issuesList.push("No name");
        }
        if (issues & Issue.NoCity) {
            issuesList.push("No city");
        }
        if (issues & Issue.NoHN) {
            issuesList.push("No house numbers");
        }
        // if (issues & Issue.RoutingPreference) {
        //     issuesList.push("Non-neutral routing preference");
        // }
        if (issues & Issue.Minus1RoutingPreference) {
            issuesList.push("-1 routing preference");
        }
        if (issues & Issue.Plus1RoutingPreference) {
            issuesList.push("+1 routing preference");
        }
        if (issues & Issue.UnknownDirection) {
            issuesList.push("Unknown direction");
        }
        if (issues & Issue.RampWithSL) {
            issuesList.push("Ramp with speed limit");
        }
        if (issues & Issue.NewlyPaved) {
            issuesList.push("Newly paved");
        }
        if (issues & Issue.OneWay) {
            issuesList.push("One way");
        }
        if (issues & Issue.HasClosures) {
            issuesList.push("Has closures");
        }
        if (issues & Issue.HasTIO) {
            issuesList.push('Has TI voice prompt');
        }
        if (issues & Issue.TI) {
            issuesList.push('TI (visual, toward)');
        }
        if (issues & Issue.TITTS) {
            issuesList.push('TI TTS');
        }
        if (issues & Issue.TIExit) {
            issuesList.push('TI Exit sign(s)');
        }
        if (issues & Issue.Loop) {
            issuesList.push("Loop");
        }
        if (issues & Issue.Shield) {
            issuesList.push("Shield");
        }
        if (issues & Issue.ShieldDirection) {
            issuesList.push("Shield Direction");
        }
        if (issues & Issue.HouseNumbersWithNoCity) {
            issuesList.push('House numbers with no city');
        }
        if (issues & Issue.RedRoad) {
            issuesList.push('Red road');
        }
        if (issues & Issue.ExpiredRestrictions) {
            issuesList.push('Has expired restrictions');
        }
        if (issuesList.length === 0) {
            return "None";
        }
        else {
            return issuesList.join(", ");
        }
    }
    function initSettings() {
        settings = {
            RoadTypeMask: WMEWAL.RoadType.Street,
            State: null,
            StateOperation: Operation.Equal,
            LockLevel: null,
            LockLevelOperation: Operation.Equal,
            Regex: null,
            RegexIgnoreCase: true,
            Roundabouts: false,
            RoundaboutsOperation: 0,
            ExcludeJunctionBoxes: true,
            EditableByMe: true,
            NoSpeedLimit: false,
            IncludeAltNames: false,
            Direction: null,
            CityRegex: null,
            CityRegexIgnoreCase: true,
            HasTimeBasedRestrictions: false,
            HasTimeBasedTurnRestrictions: false,
            HasRestrictedJunctionArrow: false,
            UnknownDirection: false,
            HasUTurn: false,
            HasSoftTurns: false,
            HasUnnecessaryJunctionNode: false,
            Elevation: false,
            ElevationOperation: Operation.LessThan,
            SegmentLength: false,
            SegmentLengthOperation: Operation.LessThan,
            SegmentLengthValue: null,
            SegmentLengthUnit: isImperial ? Unit.Imperial : Unit.Metric,
            LastModifiedBy: null,
            HasNoName: false,
            HasNoCity: false,
            HasNoCityOperation: PrimaryOrAlt.Either,
            NonNeutralRoutingPreference: false,
            IncludeASC: false,
            NoHN: false,
            RampWithSL: false,
            Unpaved: false,
            Tunnel: false,
            HeadlightsRequired: false,
            NearHOV: false,
            Toll: false,
            Beacons: false,
            CreatedBy: null,
            LaneGuidance: false,
            LaneGuidanceOperation: 0,
            Created: false,
            CreatedOperation: Operation.GreaterThanOrEqual,
            CreatedDate: null,
            Updated: false,
            UpdatedOperation: Operation.GreaterThanOrEqual,
            UpdatedDate: null,
            Minus1RoutingPreference: false,
            Plus1RoutingPreference: false,
            NewlyPaved: false,
            SegmentLengthFilter: false,
            SegmentLengthFilterOperation: Operation.LessThan,
            SegmentLengthFilterValue: null,
            SegmentLengthFilterUnit: isImperial ? Unit.Imperial : Unit.Metric,
            OneWay: false,
            HasClosures: false,
            HasTIO: false,
            TIO: TIO.Any,
            Loop: false,
            Shield: false,
            ShieldOperation: 0,
            ShieldDirection: false,
            ShieldDirectionOperation: 0,
            ShieldTextRegex: null,
            ShieldTextRegexIgnoreCase: true,
            ShieldDirectionRegex: null,
            ShieldDirectionRegexIgnoreCase: true,
            TI: false,
            TIOperation: 0,
            TITTS: false,
            TITTSOperation: 0,
            TIExit: false,
            TIExitOperation: 0,
            TIDirection: IncomingOrOutgoing.Outgoing,
            VIRegex: null,
            VIRegexIgnoreCase: true,
            TowardsRegex: null,
            TowardsRegexIgnoreCase: true,
            TTSRegex: null,
            TTSRegexIgnoreCase: true,
            IntersectingNameRegex: null,
            IntersectingNameRegexIgnoreCase: true,
            HouseNumbersWithNoCity: false,
            RedRoad: false,
            ExpiredRestrictions: false,
            SuggestedSegmentsOperation: 2,
            SuggestedSegments: false,
            SuggestedSegmentsStatus: 2
        };
    }
    function updateProperties() {
        let upd = false;
        if (settings !== null) {
            if (!settings.hasOwnProperty("Elevation")) {
                settings.Elevation = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("ElevationOperation")) {
                settings.ElevationOperation = Operation.LessThan;
                upd = true;
            }
            if (!settings.hasOwnProperty("LastModifiedBy")) {
                settings.LastModifiedBy = null;
                upd = true;
            }
            if (!settings.hasOwnProperty("HasNoName")) {
                settings.HasNoName = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("HasNoCity")) {
                settings.HasNoCity = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("HasNoCityOperation")) {
                settings.HasNoCityOperation = PrimaryOrAlt.Either;
                upd = true;
            }
            if (!settings.hasOwnProperty("Minus1RoutingPreference")) {
                settings.Minus1RoutingPreference = settings.NonNeutralRoutingPreference;
                upd = true;
            }
            if (!settings.hasOwnProperty("Plus1RoutingPreference")) {
                settings.Plus1RoutingPreference = settings.NonNeutralRoutingPreference;
                upd = true;
            }
            // if (!settings.hasOwnProperty("NonNeutralRoutingPreference")) {
            //     settings.NonNeutralRoutingPreference = false;
            //     upd = true;
            // }
            if (!settings.hasOwnProperty("UnknownDirection")) {
                settings.UnknownDirection = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("IncludeASC")) {
                settings.IncludeASC = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("Roundabouts")) {
                settings.Roundabouts = (settings["ExcludeRoundabouts"] || false);
                upd = true;
            }
            if (!settings.hasOwnProperty("NoHN")) {
                settings.NoHN = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("RampWithSL")) {
                settings.RampWithSL = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("Unpaved")) {
                settings.Unpaved = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("Tunnel")) {
                settings.Tunnel = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("HeadlightsRequired")) {
                settings.HeadlightsRequired = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("NearHOV")) {
                settings.NearHOV = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("Toll")) {
                settings.Toll = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("Beacons")) {
                settings.Beacons = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("CreatedBy")) {
                settings.CreatedBy = null;
                upd = true;
            }
            if (!settings.hasOwnProperty("LaneGuidance")) {
                settings.LaneGuidance = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("LaneGuidanceOperation")) {
                settings.LaneGuidanceOperation = 0;
                upd = true;
            }
            if (!settings.hasOwnProperty("CreatedDate")) {
                settings.CreatedDate = null;
                upd = true;
            }
            if (!settings.hasOwnProperty("Created")) {
                settings.Created = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("CreatedOperation")) {
                settings.CreatedOperation = Operation.GreaterThanOrEqual;
                upd = true;
            }
            if (!settings.hasOwnProperty("UpdatedDate")) {
                settings.UpdatedDate = null;
                upd = true;
            }
            if (!settings.hasOwnProperty("Updated")) {
                settings.Updated = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("UpdatedOperation")) {
                settings.UpdatedOperation = Operation.GreaterThanOrEqual;
                upd = true;
            }
            if (!settings.hasOwnProperty("NewlyPaved")) {
                settings.NewlyPaved = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("SegmentLengthUnit") || settings.SegmentLengthUnit == null) {
                if (settings.SegmentLength != null) {
                    settings.SegmentLengthUnit = Unit.Metric;
                }
                else {
                    settings.SegmentLengthUnit = isImperial ? Unit.Imperial : Unit.Metric;
                }
                upd = true;
            }
            if (!settings.hasOwnProperty("SegmentLengthFilter")) {
                settings.SegmentLengthFilter = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("SegmentLengthFilterOperation")) {
                settings.SegmentLengthFilterOperation = Operation.LessThan;
                upd = true;
            }
            if (!settings.hasOwnProperty("SegmentLengthFilterValue")) {
                settings.SegmentLengthFilterValue = null;
                upd = true;
            }
            if (!settings.hasOwnProperty("SegmentLengthFilterUnit")) {
                settings.SegmentLengthFilterUnit = isImperial ? Unit.Imperial : Unit.Metric;
                upd = true;
            }
            if (!settings.hasOwnProperty("OneWay")) {
                settings.OneWay = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("HasClosures")) {
                settings.HasClosures = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("HasTIO")) {
                settings.HasTIO = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("TIO")) {
                settings.TIO = TIO.Any;
                upd = true;
            }
            if (!settings.hasOwnProperty("Loop")) {
                settings.Loop = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("Shield")) {
                settings.Shield = false;
                settings.ShieldOperation = HasOrMissing.Missing;
                upd = true;
            }
            if (!settings.hasOwnProperty("ShieldOperation")) {
                settings.ShieldOperation = HasOrMissing.Missing;
                upd = true;
            }
            if (!settings.hasOwnProperty("ShieldDirection")) {
                settings.ShieldDirection = false;
                settings.ShieldDirectionOperation = HasOrMissing.Missing;
                upd = true;
            }
            if (!settings.hasOwnProperty("ShieldDirectionOperation")) {
                settings.ShieldDirectionOperation = HasOrMissing.Missing;
                upd = true;
            }
            if (!settings.hasOwnProperty("ShieldTextRegex")) {
                settings.ShieldTextRegex = null;
                settings.ShieldTextRegexIgnoreCase = true;
                upd = true;
            }
            if (!settings.hasOwnProperty("ShieldTextRegexIgnoreCase")) {
                settings.ShieldTextRegexIgnoreCase = true;
                upd = true;
            }
            if (!settings.hasOwnProperty("ShieldDirectionRegex")) {
                settings.ShieldDirectionRegex = null;
                settings.ShieldDirectionRegexIgnoreCase = true;
                upd = true;
            }
            if (!settings.hasOwnProperty("ShieldDirectionRegexIgnoreCase")) {
                settings.ShieldDirectionRegexIgnoreCase = true;
                upd = true;
            }
            if (!settings.hasOwnProperty("TI")) {
                settings.TI = false;
                settings.TIOperation = HasOrMissing.Missing;
                upd = true;
            }
            if (!settings.hasOwnProperty("TIOperation")) {
                settings.TIOperation = HasOrMissing.Missing;
                upd = true;
            }
            if (!settings.hasOwnProperty("TITTS")) {
                settings.TITTS = false;
                settings.TITTSOperation = HasOrMissing.Missing;
                upd = true;
            }
            if (!settings.hasOwnProperty("TITTSOperation")) {
                settings.TITTSOperation = HasOrMissing.Missing;
                upd = true;
            }
            if (!settings.hasOwnProperty("TIExit")) {
                settings.TIExit = false;
                settings.TIExitOperation = HasOrMissing.Missing;
                upd = true;
            }
            if (!settings.hasOwnProperty("TIExitOperation")) {
                settings.TIExitOperation = HasOrMissing.Missing;
                upd = true;
            }
            if (!settings.hasOwnProperty("TIDirection")) {
                settings.TIDirection = IncomingOrOutgoing.Outgoing;
                upd = true;
            }
            if (!settings.hasOwnProperty("VIRegex")) {
                settings.VIRegex = null;
                settings.VIRegexIgnoreCase = true;
                upd = true;
            }
            if (!settings.hasOwnProperty('VIRegexIgnoreCase')) {
                settings.VIRegexIgnoreCase = true;
                upd = true;
            }
            if (!settings.hasOwnProperty("TowardsRegex")) {
                settings.TowardsRegex = null;
                settings.TowardsRegexIgnoreCase = true;
                upd = true;
            }
            if (!settings.hasOwnProperty('TowardsRegexIgnoreCase')) {
                settings.TowardsRegexIgnoreCase = true;
                upd = true;
            }
            if (!settings.hasOwnProperty("TTSRegex")) {
                settings.TTSRegex = null;
                settings.TTSRegexIgnoreCase = true;
                upd = true;
            }
            if (!settings.hasOwnProperty('TTSRegexIgnoreCase')) {
                settings.TTSRegexIgnoreCase = true;
                upd = true;
            }
            if (!settings.hasOwnProperty("IntersectingNameRegex")) {
                settings.IntersectingNameRegex = null;
                settings.IntersectingNameRegexIgnoreCase = true;
                upd = true;
            }
            if (!settings.hasOwnProperty('IntersectingNameRegexIgnoreCase')) {
                settings.IntersectingNameRegexIgnoreCase = true;
                upd = true;
            }
            if (!settings.hasOwnProperty('HouseNumbersWithNoCity')) {
                settings.HouseNumbersWithNoCity = false;
                upd = true;
            }
            if (!settings.hasOwnProperty('RedRoad')) {
                settings.RedRoad = false;
                upd = true;
            }
            if (!settings.hasOwnProperty('ExpiredRestrictions')) {
                settings.ExpiredRestrictions = false;
                upd = true;
            }
            if (!settings.hasOwnProperty('SuggestedSegmentsOperation')) {
                settings.SuggestedSegmentsOperation = 2;
                upd = true;
            }
            if (!settings.hasOwnProperty('SuggestedSegments')) {
                settings.SuggestedSegments = false;
                settings.SuggestedSegmentsStatus = 2;
                upd = true;
            }
            if (!settings.hasOwnProperty('SuggestedSegmentsStatus')) {
                settings.SuggestedSegmentsStatus = 2;
                upd = true;
            }
            if (settings.hasOwnProperty("OutputTo")) {
                delete settings["OutputTo"];
                upd = true;
            }
            if (settings.hasOwnProperty("Version")) {
                delete settings["Version"];
                upd = true;
            }
            if (settings.hasOwnProperty("ExcludeRoundabouts")) {
                delete settings["ExcludeRoundabouts"];
                upd = true;
            }
        }
        return upd;
    }
    function updateSavedSettings() {
        if (typeof Storage !== "undefined") {
            localStorage[savedSettingsKey] = WMEWAL.LZString.compressToUTF16(JSON.stringify(savedSettings));
        }
        updateSavedSettingsList();
    }
    function updateSettings() {
        if (typeof Storage !== "undefined") {
            localStorage[settingsKey] = JSON.stringify(settings);
        }
    }
    function log(level, ...args) {
        switch (level.toLocaleLowerCase()) {
            case "debug":
            case "verbose":
                console.debug(`${SCRIPT_NAME}:`, ...args);
                break;
            case "info":
            case "information":
                console.info(`${SCRIPT_NAME}:`, ...args);
                break;
            case "warning":
            case "warn":
                console.warn(`${SCRIPT_NAME}:`, ...args);
                break;
            case "error":
                console.error(`${SCRIPT_NAME}:`, ...args);
                break;
            case "log":
                console.log(`${SCRIPT_NAME}:`, ...args);
                break;
            default:
                break;
        }
    }
    function nullif(s, nullVal) {
        if (s !== null && s === nullVal) {
            return null;
        }
        return s;
    }
    function getInstruction(tg, instruction) {
        let finalInstruction = instruction;
        const shields = tg.getRoadShields();
        for (let rs in shields) {
            if (Object.prototype.hasOwnProperty.call(shields, rs)) {
                let rsText = shields[rs].text;
                if (nullif(shields[rs].direction, '') !== null) {
                    rsText += ` ${shields[rs].direction}`;
                }
                finalInstruction = finalInstruction.replace(`$${rs}`, rsText);
            }
        }
        return finalInstruction;
    }
    function loadScriptUpdateMonitor() {
        let updateMonitor;
        try {
            updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(SCRIPT_NAME, SCRIPT_VERSION, DOWNLOAD_URL, GM_xmlhttpRequest);
            updateMonitor.start();
        }
        catch (ex) {
            log('error', ex);
        }
    }
    bootstrap();
})(WMEWAL_Streets || (WMEWAL_Streets = {}));
