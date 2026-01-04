/// <reference path="../typescript-typings/globals/openlayers/index.d.ts" />
/// <reference path="../typescript-typings/I18n.d.ts" />
/// <reference path="../typescript-typings/waze.d.ts" />
/// <reference path="../typescript-typings/globals/jquery/index.d.ts" />
/// <reference path="WME Wide-Angle Lens.user.ts" />
/// <reference path="../typescript-typings/greasyfork.d.ts" />
// ==UserScript==
// @name                WME Wide-Angle Lens Hazards
// @namespace           https://greasyfork.org/en/users/19861-vtpearce
// @description         Find permanent hazards
// @author              DaveaCincy  (based on Places plugin by vtpearce and crazycaveman)
// @match               https://*.waze.com/*editor*
// @exclude             https://*.waze.com/user/editor*
// @exclude             https://www.waze.com/discuss/*
// @version             2025.07.07.001
// @grant               GM_xmlhttpRequest
// @copyright           2020 vtpearce
// @license             CC BY-SA 4.0
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @connect             greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/532474/WME%20Wide-Angle%20Lens%20Hazards.user.js
// @updateURL https://update.greasyfork.org/scripts/532474/WME%20Wide-Angle%20Lens%20Hazards.meta.js
// ==/UserScript==
/*global W, OL, I18n, $, WazeWrap, WMEWAL, OpenLayers */
var WMEWAL_Hazards;
(function (WMEWAL_Hazards) {
    const SCRIPT_NAME = GM_info.script.name;
    const SCRIPT_VERSION = GM_info.script.version.toString();
    const DOWNLOAD_URL = GM_info.script.downloadURL;
    const updateText = '<ul>'
        + '<li>New plugin.</li>'
        + '</ul>';
    const greasyForkPage = 'https://greasyfork.org/scripts/40645';
    const wazeForumThread = 'https://www.waze.com/forum/viewtopic.php?t=206376';
    const ctlPrefix = "_wmewalHazards";
    const minimumWALVersionRequired = "2025.04.10.001";
    let Operation;
    (function (Operation) {
        Operation[Operation["Equal"] = 1] = "Equal";
        Operation[Operation["NotEqual"] = 2] = "NotEqual";
        Operation[Operation["LessThan"] = 3] = "LessThan";
        Operation[Operation["LessThanOrEqual"] = 4] = "LessThanOrEqual";
        Operation[Operation["GreaterThan"] = 5] = "GreaterThan";
        Operation[Operation["GreaterThanOrEqual"] = 6] = "GreaterThanOrEqual";
    })(Operation || (Operation = {}));
    let Issue;
    (function (Issue) {
        Issue[Issue["MissingStreet"] = 1] = "MissingStreet";
        Issue[Issue["NoCity"] = 2] = "NoCity";
        Issue[Issue["NoName"] = 4] = "NoName";
    })(Issue || (Issue = {}));
    let HazardType;
    (function (HazardType) {
        HazardType[HazardType["Unknown"] = 0] = "Unknown";
        HazardType[HazardType["Speedbump"] = 1] = "Speedbump";
        HazardType[HazardType["Topes"] = 2] = "Topes";
        HazardType[HazardType["Tollbooth"] = 4] = "Tollbooth";
        HazardType[HazardType["SharpCurve"] = 8] = "SharpCurve";
        HazardType[HazardType["ComplexIntersection"] = 16] = "ComplexIntersection";
        HazardType[HazardType["ForkinRoad"] = 32] = "ForkinRoad";
        HazardType[HazardType["LanesMerging"] = 64] = "LanesMerging";
        HazardType[HazardType["PedCrossing"] = 128] = "PedCrossing";
        HazardType[HazardType["SchoolZone"] = 256] = "SchoolZone";
        HazardType[HazardType["Cameras"] = 512] = "Cameras";
        HazardType[HazardType["RRCrossing"] = 1024] = "RRCrossing";
    })(HazardType = WMEWAL_Hazards.HazardType || (WMEWAL_Hazards.HazardType = {}));
    const pluginName = "WMEWAL-Hazards";
    WMEWAL_Hazards.Title = "Hazards";
    WMEWAL_Hazards.MinimumZoomLevel = 15;
    WMEWAL_Hazards.SupportsSegments = false;
    WMEWAL_Hazards.SupportsVenues = true;
    const settingsKey = "WMEWALHazardsSettings";
    const savedSettingsKey = "WMEWALHazardsSavedSettings";
    let settings = null;
    let savedSettings = [];
    //let places: Array<IPlace>;
    let hazards;
    let nameRegex = null;
    let cityRegex = null;
    let websiteRegex = null;
    let streetRegex = null;
    let state;
    let stateName;
    let lastModifiedBy;
    let lastModifiedByName;
    let createdBy;
    let createdByName;
    let initCount = 0;
    let detectIssues = false;
    let haveNames = false;
    let haveSpeeds = false;
    let haveSubtypes = false;
    let haveScheds = false;
    let haveStreets = false;
    //let savedVenues: Array<string>
    let savedHazards;
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
            log('log', "WAL not at required minimum version.");
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
        WMEWAL.RegisterPlugIn(WMEWAL_Hazards);
    }
    function TranslateHazardType(wazeHazardType) {
        return I18n.t("permanent_hazards.type." + wazeHazardType.toString());
    }
    WMEWAL_Hazards.TranslateHazardType = TranslateHazardType;
    function HazardTypeBitmaskToWazeHazardType(hazardType) {
        switch (hazardType) {
            case HazardType.Speedbump:
                return 1;
            case HazardType.Topes:
                return 2;
            case HazardType.Tollbooth:
                return 3;
            case HazardType.SharpCurve:
                return 4;
            case HazardType.ComplexIntersection:
                return 5;
            case HazardType.ForkinRoad:
                return 6;
            case HazardType.LanesMerging:
                return 7;
            case HazardType.PedCrossing:
                return 8;
            case HazardType.SchoolZone:
                return 9;
            case HazardType.Cameras:
                return 10;
            case HazardType.RRCrossing:
                return 11;
            default:
                return 0;
        }
    }
    WMEWAL_Hazards.HazardTypeBitmaskToWazeHazardType = HazardTypeBitmaskToWazeHazardType;
    function WazeHazardTypeToHazardTypeBitmask(hazardType) {
        switch (hazardType) {
            case 1:
                return HazardType.Speedbump;
            case 2:
                return HazardType.Topes;
            case 3:
                return HazardType.Tollbooth;
            case 4:
                return HazardType.SharpCurve;
            case 5:
                return HazardType.ComplexIntersection;
            case 6:
                return HazardType.ForkinRoad;
            case 7:
                return HazardType.LanesMerging;
            case 8:
                return HazardType.PedCrossing;
            case 9:
                return HazardType.SchoolZone;
            case 10:
                return HazardType.Cameras;
            case 11:
                return HazardType.RRCrossing;
            default:
                return HazardType.Unknown;
        }
    }
    WMEWAL_Hazards.WazeHazardTypeToHazardTypeBitmask = WazeHazardTypeToHazardTypeBitmask;
    function GetTab() {
        const rpp = "RESIDENCE_HOME";
        let html = "<table style='border-collapse:separate;border-spacing:0px 1px;'>";
        html += "<tbody>";
        html += "<tr><td class='wal-heading'><b>Saved Filters</b></td></tr>";
        html += "<tr><td class='wal-indent' style='padding-bottom: 8px'>" +
            `<select id='${ctlPrefix}SavedSettings'></select><br/>` +
            `<button class='btn btn-primary' id='${ctlPrefix}LoadSetting' title='Load'>Load</button>` +
            `<button class='btn btn-primary' style='margin-left: 4px;' id='${ctlPrefix}SaveSetting' title='Save'>Save</button>` +
            `<button class='btn btn-primary' style='margin-left: 4px;' id='${ctlPrefix}DeleteSetting' title='Delete'>Delete</button></td></tr>`;
        html += `<tr><td style='border-top: 1px solid'><button class='btn btn-primary' style='margin-top: 6px;margin-bottom: 6px' id='${ctlPrefix}Reset' title='Reset'>Reset</button></td></tr>`;
        /*        html += "<tr><td class='wal-heading' style='border-top: 1px solid'>Output Options</td></tr>";
                html += `<tr><td class='wal-indent'><input type='checkbox' id='${ctlPrefix}IncludeAlt' class='wal-check' name='${ctlPrefix}IncludeAlt'>` +
                    `<label for='${ctlPrefix}IncludeAlt' class='wal-label'>Include Alt Names</label></td></tr>`
                    */
        html += "<tr><td class='wal-heading' style='border-top: 1px solid; padding-top: 4px'><b>Filters (All of these)</b></td></tr>";
        /*        html += "<tr><td><b>Category:</b></td></tr>";
                html += `<tr><td class='wal-indent'><select id='${ctlPrefix}CategoryOp'>` +
                    "<option value='" + Operation.Equal.toString() + "' selected='selected'>=</option>" +
                    "<option value='" + Operation.NotEqual.toString() + "'>&lt;&gt;</option>" +
                    "</select>";
                html += `<select id='${ctlPrefix}Category'>` +
                    "<option value=''></option>";
        
                for (let topIx = 0; topIx < W.Config.venues.categories.length; topIx++) {
                    const topCategory = W.Config.venues.categories[topIx];
                    html += ("<option value='" + topCategory + "'>" + I18n.t("venues.categories." + topCategory) + "</option>");
                    const subCategories = W.Config.venues.subcategories[topCategory];
                    for (let subIx = 0; subIx < subCategories.length; subIx++) {
                        const subCategory = W.Config.venues.subcategories[topCategory][subIx];
                        html += ("<option value='" + subCategory + "'>--" + I18n.t("venues.categories." + subCategory) + "</option>");
                    }
                }
        
                html += "<option value='" + rpp + "'>" + I18n.t("venues.categories." + rpp) + "</option>";
                html += "</select></td></tr>";
                */
        /*Speedbump = 1,
        Topes = 2,
        Tollbooth = 4,
        SharpCurve = 8,
        ComplexIntersection = 16,
        ForkinRoad = 32,
        LanesMerging = 64,
        PedCrossing = 128,
        SchoolZone = 256,
        Cameras = 512,
        RRCrossing = 1024,*/
        html += "<tr><td class='wal-indent'>" +
            `<button id='${ctlPrefix}HazardTypeAny' class='btn btn-primary' style='margin-right: 8px' title='Any'>Any</button>` +
            `<button id='${ctlPrefix}HazardTypeClear' class='btn btn-primary' title='Clear'>Clear</button>` +
            `<div><input type='checkbox' checked='checked' id='${ctlPrefix}HazardTypeSpeedbump' data-group='${ctlPrefix}HazardType' value='${HazardType.Speedbump}' class='wal-check'/>` +
            `<label for='${ctlPrefix}HazardTypeSpeedbump' class='wal-label'>${TranslateHazardType(HazardTypeBitmaskToWazeHazardType(HazardType.Speedbump))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}HazardTypeTopes' data-group='${ctlPrefix}HazardType' value='${HazardType.Topes}' class='wal-check'/>` +
            `<label for='${ctlPrefix}HazardTypeTopes' class='wal-label'>${TranslateHazardType(HazardTypeBitmaskToWazeHazardType(HazardType.Topes))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}HazardTypeTollbooth' data-group='${ctlPrefix}HazardType' value='${HazardType.Tollbooth}' class='wal-check'/>` +
            `<label for='${ctlPrefix}HazardTypeTollbooth' class='wal-label'>${TranslateHazardType(HazardTypeBitmaskToWazeHazardType(HazardType.Tollbooth))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}HazardTypeSharpCurve' data-group='${ctlPrefix}HazardType' value='${HazardType.SharpCurve}' class='wal-check'/>` +
            `<label for='${ctlPrefix}HazardTypeSharpCurve' class='wal-label'>${TranslateHazardType(HazardTypeBitmaskToWazeHazardType(HazardType.SharpCurve))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}HazardTypeComplexIntersection' data-group='${ctlPrefix}HazardType' value='${HazardType.ComplexIntersection}' class='wal-check'/>` +
            `<label for='${ctlPrefix}HazardTypeComplexIntersection' class='wal-label'>${TranslateHazardType(HazardTypeBitmaskToWazeHazardType(HazardType.ComplexIntersection))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}HazardTypeForkinRoad' data-group='${ctlPrefix}HazardType' value='${HazardType.ForkinRoad}' class='wal-check'/>` +
            `<label for='${ctlPrefix}HazardTypeForkinRoad' class='wal-label'>${TranslateHazardType(HazardTypeBitmaskToWazeHazardType(HazardType.ForkinRoad))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}HazardTypeLanesMerging' data-group='${ctlPrefix}HazardType' value='${HazardType.LanesMerging}' class='wal-check'/>` +
            `<label for='${ctlPrefix}HazardTypeLanesMerging' class='wal-label'>${TranslateHazardType(HazardTypeBitmaskToWazeHazardType(HazardType.LanesMerging))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}HazardTypePedCrossing' data-group='${ctlPrefix}HazardType' value='${HazardType.PedCrossing}' class='wal-check'/>` +
            `<label for='${ctlPrefix}HazardTypePedCrossing' class='wal-label'>${TranslateHazardType(HazardTypeBitmaskToWazeHazardType(HazardType.PedCrossing))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}HazardTypeSchoolZone' data-group='${ctlPrefix}HazardType' value='${HazardType.SchoolZone}' class='wal-check'/>` +
            `<label for='${ctlPrefix}HazardTypeSchoolZone' class='wal-label'>${TranslateHazardType(HazardTypeBitmaskToWazeHazardType(HazardType.SchoolZone))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}HazardTypeCameras' data-group='${ctlPrefix}HazardType' value='${HazardType.Cameras}' class='wal-check'/>` +
            `<label for='${ctlPrefix}HazardTypeCameras' class='wal-label'>${TranslateHazardType(HazardTypeBitmaskToWazeHazardType(HazardType.Cameras))}</label></div>` +
            `<div><input type='checkbox' id='${ctlPrefix}HazardTypeRRCrossing' data-group='${ctlPrefix}HazardType' value='${HazardType.RRCrossing}' class='wal-check'/>` +
            `<label for='${ctlPrefix}HazardTypeRRCrossing' class='wal-label'>${TranslateHazardType(HazardTypeBitmaskToWazeHazardType(HazardType.RRCrossing))}</label></div>` +
            "</td></tr>";
        /*html += "<tr><td><b>Lock Level:</b></td></tr>" +
            "<tr><td class='wal-indent'>" +
            `<select id='${ctlPrefix}LockLevelOp'>` +
            "<option value='" + Operation.Equal.toString() + "' selected='selected'>=</option>" +
            "<option value='" + Operation.NotEqual.toString() + "'>&lt;&gt;</option></select>" +
            `<select id='${ctlPrefix}LockLevel'>` +
            "<option value=''></option>" +
            "<option value='1'>1</option>" +
            "<option value='2'>2</option>" +
            "<option value='3'>3</option>" +
            "<option value='4'>4</option>" +
            "<option value='5'>5</option>" +
            "<option value='6'>6</option>" +
            "<option value='7'>7</option>" +
            "</select></td></tr>"; */
        /*        html += "<tr><td><b>Name RegEx</b></td></tr>";
                html += "<tr><td class='wal-indent'>" +
                    `<input type='text' id='${ctlPrefix}Name' class='wal-textbox'/><br/>` +
                    `<input id='${ctlPrefix}IgnoreCase' class='wal-check' type='checkbox'/>` +
                    `<label for='${ctlPrefix}IgnoreCase' class='wal-indent'>Ignore case</label></td>`;
                html += "<tr><td><b>Street RegEx</b></td></tr>";
                html += "<tr><td class='wal-indent'>" +
                    `<input type='text' id='${ctlPrefix}Street' class='wal-textbox'/><br/>` +
                    `<input id='${ctlPrefix}StreetIgnoreCase' class='wal-check' type='checkbox'/>` +
                    `<label for='${ctlPrefix}StreetIgnoreCase' class='wal-indent'>Ignore case</label></td>`;
                html += "<tr><td><b>City RegEx:</b></td></tr>";
                html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}City' class='wal-textbox'/><br/>` +
                    `<input id='${ctlPrefix}CityIgnoreCase' class='wal-check' type='checkbox'/>` +
                    `<label for='${ctlPrefix}CityIgnoreCase' style='margin-left: 8px'>Ignore case</label></td></tr>`;
                html += "<tr><td><b>Website RegEx:</b></td></tr>";
                html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}Website' class='wal-textbox'/><br/>` +
                    `<input id='${ctlPrefix}WebsiteIgnoreCase' class='wal-check' type='checkbox'/>` +
                    `<label for='${ctlPrefix}WebsiteIgnoreCase' style='margin-left: 8px'>Ignore case</label></td></tr>`;
                    */
        /*        html += "<tr><td><b>State:</b></td></tr>";
                html += "<tr><td style='padding-left:20px'>" +
                    `<select id='${ctlPrefix}StateOp'>` +
                    "<option value='" + Operation.Equal.toString() + "' selected='selected'>=</option>" +
                    "<option value='" + Operation.NotEqual.toString() + "'>&lt;&gt;</option></select>" +
                    `<select id='${ctlPrefix}State'></select>`;
                html += "<tr><td><b>Type:</b></td></tr>" +
                    `<tr><td class='wal-indent'><select id='${ctlPrefix}Type'>` +
                    "<option value=''></option>" +
                    "<option value='area'>" + I18n.t("edit.venue.type.area") + "</option>" +
                    "<option value='point'>" + I18n.t("edit.venue.type.point") + "</option>" +
                    "</select></td></tr>";
                    */
        html += "<tr><td><b>Created By:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<select id='${ctlPrefix}CreatedBy'></select></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Created' class='wal-check' type='checkbox' />` +
            `<label for=${ctlPrefix}Created' class='wal-label'>Date Created:</label> ` +
            `<select id='${ctlPrefix}CreatedOp'>` +
            `<option value='${Operation.LessThan}'>&lt;</option>` +
            `<option value='${Operation.LessThanOrEqual}'>&lt;=</option>` +
            `<option value='${Operation.GreaterThanOrEqual}' selected='selected'>&gt;=</option>` +
            `<option value='${Operation.GreaterThan}'>&gt;</option></select>` +
            "</td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<input id='${ctlPrefix}CreatedDate' type='date'/> <input id='${ctlPrefix}CreatedTime' type='time'/></td></tr>`;
        html += "<tr><td><b>Last Updated By:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<select id='${ctlPrefix}LastModifiedBy'></select></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Updated' class='wal-check' type='checkbox' />` +
            `<label for=${ctlPrefix}Updated' class='wal-label'>Date Updated:</label> ` +
            `<select id='${ctlPrefix}UpdatedOp'>` +
            `<option value='${Operation.LessThan}'>&lt;</option>` +
            `<option value='${Operation.LessThanOrEqual}'>&lt;=</option>` +
            `<option value='${Operation.GreaterThanOrEqual}' selected='selected'>&gt;=</option>` +
            `<option value='${Operation.GreaterThan}'>&gt;</option></select>` +
            "</td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<input id='${ctlPrefix}UpdatedDate' type='date'/> <input id='${ctlPrefix}UpdatedTime' type='time'/></td></tr>`;
        /*html += `<tr><td><input id='${ctlPrefix}Editable' class='wal-check' type='checkbox'/>` +
            `<label for='${ctlPrefix}Editable' class='wal-label'>Editable by me</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}ParkingLotType' class='wal-check' type='checkbox'/>` +
            `<label for='${ctlPrefix}ParkingLotType' class='wal-label'>`;
        html += `Parking Lot Type: <select id='${ctlPrefix}ParkingLotTypeFilter'>` +
            "<option value='PRIVATE'>" + I18n.t("edit.venue.parking.types.parkingType.PRIVATE") + "</option>" +
            "<option value='PUBLIC'>" + I18n.t("edit.venue.parking.types.parkingType.PUBLIC") + "</option>" +
            "<option value='RESTRICTED'>" + I18n.t("edit.venue.parking.types.parkingType.RESTRICTED") + "</option>" +
            "</select></label></td></tr>"; */
        html += "<tr><td class='wal-heading' style='border-top: 1px solid; padding-top: 4px'>Issues (Any of these)</td></tr>";
        html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}NoName'/>` +
            `<label for='${ctlPrefix}NoName' class='wal-label'>No Name</label></td></tr>`;
        /*        html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}NoHouseNumber'/>` +
                    `<label for='${ctlPrefix}NoHouseNumber' class='wal-label'>Missing House Number</label></td></tr>`;
                html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}NoStreet'/>` +
                    `<label for='${ctlPrefix}NoStreet' class='wal-label'>Missing Street</label></td></tr>`;
                html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}NoCity'/>` +
                    `<label for='${ctlPrefix}NoCity' class='wal-label'>Missing City</label></td></tr>`;
                html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}AdLocked'/>` +
                    `<label for='${ctlPrefix}AdLocked' class='wal-label'>Ad Locked</label></td></tr>`;
                html += `<tr><td ><input class='wal-check' type='checkbox' id='${ctlPrefix}UpdateRequests'/>` +
                    `<label for='${ctlPrefix}UpdateRequests' class='wal-label'>Has Update Requests</label></td></tr>`;
                html += `<tr><td ><input class='wal-check' type='checkbox' id='${ctlPrefix}PendingApproval'/>` +
                    `<label for='${ctlPrefix}PendingApproval' class='wal-label'>Pending Approval</label></td></tr>`;
                html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}UndefStreet' />` +
                    `<label for='${ctlPrefix}UndefStreet' class='wal-label' title='Street ID not found in W.model.streets.objects, possibly as a result of a cities form Merge or Delete'>Undefined Street ID</label></td></tr>`;
                html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}NoExternalProviders' />` +
                    `<label for='${ctlPrefix}NoExternalProviders' class='wal-label'>No External Provider Links</label></td></tr>`;
                html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}NoHours' />` +
                    `<label for='${ctlPrefix}NoHours' class='wal-label'>No Hours</label></td></tr>`;
                    html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}NoWebsite' />` +
                    `<label for='${ctlPrefix}NoWebsite' class='wal-label'>No Website</label></td></tr>`;
                html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}NoPhoneNumber' />` +
                    `<label for='${ctlPrefix}NoPhoneNumber' class='wal-label'>No Phone Number</label></td></tr>`;
                html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}BadPhoneNumberFormat' />` +
                    `<label for='${ctlPrefix}BadPhoneNumberFormat' class='wal-label'>Bad Phone Number Format</label></td></tr>`;
                html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}NoEntryExitPoints' />` +
                    `<label for='${ctlPrefix}NoEntryExitPoints' class='wal-label'>No Entry/Exit Points</label></td></tr>`;
                html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}MissingBrand' />` +
                    `<label for='${ctlPrefix}MissingBrand' class='wal-label'>Missing Brand (GS)</label></td></tr>`;
                    */
        html += "</tbody></table>";
        return html;
    }
    WMEWAL_Hazards.GetTab = GetTab;
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
        $(`#${ctlPrefix}HazardTypeAny`).on("click", function () {
            $(`input[data-group=${ctlPrefix}HazardType]`).prop("checked", true);
        });
        $(`#${ctlPrefix}HazardTypeClear`).on("click", function () {
            $(`input[data-group=${ctlPrefix}HazardType]`).prop("checked", false);
        });
        $(`#${ctlPrefix}LoadSetting`).on("click", loadSetting);
        $(`#${ctlPrefix}SaveSetting`).on("click", saveSetting);
        $(`#${ctlPrefix}DeleteSetting`).on("click", deleteSetting);
        $(`#${ctlPrefix}Reset`).on('click', reset);
    }
    WMEWAL_Hazards.TabLoaded = TabLoaded;
    function reset() {
        initSettings();
        updateUI();
    }
    function updateStates() {
        const selectState = $(`#${ctlPrefix}State`);
        // Preserve current selection
        const currentId = parseInt(selectState.val());
        selectState.empty();
        const stateObjs = [];
        stateObjs.push({ id: null, name: "" });
        for (let s in W.model.states.objects) {
            if (W.model.states.objects.hasOwnProperty(s)) {
                const st = W.model.states.getObjectById(parseInt(s));
                if (st.getAttribute('id') !== 1 && st.getAttribute('name').length !== 0) {
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
            const stateOption = $("<option/>").text(so.name).attr("value", so.id ?? "");
            if (currentId != null && so.id === currentId) {
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
            let opt = $("<option/>").attr("value", ixSaved).text(savedSettings[ixSaved].Name);
            s.append(opt);
        }
    }
    function updateUI() {
        // $(`#${ctlPrefix}OutputTo`).val(settings.OutputTo);
        $(`#${ctlPrefix}HazardTypeSpeedbump`).prop("checked", settings.HazardTypeMask & HazardType.Speedbump);
        $(`#${ctlPrefix}HazardTypeTopes`).prop("checked", settings.HazardTypeMask & HazardType.Topes);
        $(`#${ctlPrefix}HazardTypeTollbooth`).prop("checked", settings.HazardTypeMask & HazardType.Tollbooth);
        $(`#${ctlPrefix}HazardTypeSharpCurve`).prop("checked", settings.HazardTypeMask & HazardType.SharpCurve);
        $(`#${ctlPrefix}HazardTypeComplexIntersection`).prop("checked", settings.HazardTypeMask & HazardType.ComplexIntersection);
        $(`#${ctlPrefix}HazardTypeForkinRoad`).prop("checked", settings.HazardTypeMask & HazardType.ForkinRoad);
        $(`#${ctlPrefix}HazardTypeLanesMerging`).prop("checked", settings.HazardTypeMask & HazardType.LanesMerging);
        $(`#${ctlPrefix}HazardTypePedCrossing`).prop("checked", settings.HazardTypeMask & HazardType.PedCrossing);
        $(`#${ctlPrefix}HazardTypeSchoolZone`).prop("checked", settings.HazardTypeMask & HazardType.SchoolZone);
        $(`#${ctlPrefix}HazardTypeCameras`).prop("checked", settings.HazardTypeMask & HazardType.Cameras);
        $(`#${ctlPrefix}HazardTypeRRCrossing`).prop("checked", settings.HazardTypeMask & HazardType.RRCrossing);
        /*        $(`#${ctlPrefix}CategoryOp`).val(settings.CategoryOperation || Operation.Equal);
                $(`#${ctlPrefix}Category`).val(settings.Category);
                $(`#${ctlPrefix}LockLevel`).val(settings.LockLevel);
                $(`#${ctlPrefix}LockLevelOp`).val(settings.LockLevelOperation || Operation.Equal);
                $(`#${ctlPrefix}NoName`).prop("checked", settings.NoName);
                $(`#${ctlPrefix}Name`).val(settings.Regex || "");
                $(`#${ctlPrefix}IgnoreCase`).prop("checked", settings.RegexIgnoreCase);
                $(`#${ctlPrefix}City`).val(settings.CityRegex || "");
                $(`#${ctlPrefix}CityIgnoreCase`).prop("checked", settings.CityRegexIgnoreCase);
                $(`#${ctlPrefix}State`).val(settings.State);
                $(`#${ctlPrefix}StateOp`).val(settings.StateOperation || Operation.Equal);
                $(`#${ctlPrefix}Type`).val(settings.PlaceType);
                $(`#${ctlPrefix}Editable`).prop("checked", settings.EditableByMe);
                $(`#${ctlPrefix}NoHouseNumber`).prop("checked", settings.NoHouseNumber);
                $(`#${ctlPrefix}UndefStreet`).prop("checked", settings.UndefStreet);
                $(`#${ctlPrefix}AdLocked`).prop("checked", settings.AdLocked);
                $(`#${ctlPrefix}UpdateRequests`).prop("checked", settings.UpdateRequests);
                $(`#${ctlPrefix}PendingApproval`).prop("checked", settings.PendingApproval);
                $(`#${ctlPrefix}NoStreet`).prop("checked", settings.NoStreet);
                $(`#${ctlPrefix}NoCity`).prop("checked", settings.NoCity);
                */
        $(`#${ctlPrefix}LastModifiedBy`).val(settings.LastModifiedBy);
        $(`#${ctlPrefix}CreatedBy`).val(settings.CreatedBy);
        /*        $(`#${ctlPrefix}NoExternalProviders`).prop("checked", settings.NoExternalProviders);
                $(`#${ctlPrefix}NoHours`).prop("checked", settings.NoHours);
                $(`#${ctlPrefix}NoPhoneNumber`).prop("checked", settings.NoPhoneNumber);
                $(`#${ctlPrefix}BadPhoneNumberFormat`).prop("checked", settings.BadPhoneNumberFormat);
                $(`#${ctlPrefix}NoWebsite`).prop("checked", settings.NoWebsite);
                $(`#${ctlPrefix}NoEntryExitPoints`).prop("checked", settings.NoEntryExitPoints);
                $(`#${ctlPrefix}ParkingLotType`).prop("checked", settings.ParkingLotType);
                $(`#${ctlPrefix}ParkingLotTypeFilter`).val(settings.ParkingLotTypeFilter);
                $(`#${ctlPrefix}MissingBrand`).prop("checked", settings.MissingBrand);
                $(`#${ctlPrefix}IncludeAlt`).prop("checked", settings.IncludeAlt);
                */
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
        /*        $(`#${ctlPrefix}Website`).val(settings.WebsiteRegex || "");
                $(`#${ctlPrefix}WebsiteIgnoreCase`).prop("checked", settings.WebsiteRegexIgnoreCase);
                $(`#${ctlPrefix}Street`).val(settings.StreetRegex || "");
                $(`#${ctlPrefix}StreetIgnoreCase`).prop("checked", settings.StreetRegexIgnoreCase);
                */
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
        updateUI();
    }
    function validateSettings() {
        function addMessage(error) {
            message += ((message.length > 0 ? "\n" : "") + error);
        }
        let message = "";
        const s = getSettings();
        const cat = $(`#${ctlPrefix}Category`).val();
        let r;
        if (nullif(s.Regex, "") !== null) {
            try {
                r = (s.RegexIgnoreCase ? new RegExp(s.Regex, "i") : new RegExp(s.Regex));
            }
            catch (error) {
                addMessage("Name RegEx is invalid");
            }
        }
        if (nullif(s.CityRegex, "") !== null) {
            try {
                r = (s.CityRegexIgnoreCase ? new RegExp(s.CityRegex, "i") : new RegExp(s.CityRegex));
            }
            catch (error) {
                addMessage("City RegEx is invalid");
            }
        }
        if (nullif(s.StreetRegex, "") !== null) {
            try {
                r = (s.StreetRegexIgnoreCase ? new RegExp(s.StreetRegex, "i") : new RegExp(s.StreetRegex));
            }
            catch (error) {
                addMessage("Street RegEx is invalid");
            }
        }
        /*        const selectedState = $(`#${ctlPrefix}State`).val();
                if (nullif(selectedState, "") !== null && s.State === null) {
                    addMessage("Invalid state selection");
                } */
        const selectedModifiedUser = $(`#${ctlPrefix}LastModifiedBy`).val();
        if (nullif(selectedModifiedUser, "") !== null && s.LastModifiedBy === null) {
            addMessage("Invalid last modified user");
        }
        const selectedCreatedUser = $(`#${ctlPrefix}CreatedBy`).val();
        if (nullif(selectedCreatedUser, "") !== null && s.CreatedBy === null) {
            addMessage("Invalid created user");
        }
        if (s.Created && s.CreatedDate === null) {
            addMessage("Select a created date on which to filter.");
        }
        if (s.Updated && s.UpdatedDate === null) {
            addMessage("Select an updated date on which to filter.");
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
            HazardTypeMask: 0,
            NoName: $(`#${ctlPrefix}NoName`).prop("checked"),
            Regex: null,
            RegexIgnoreCase: $(`#${ctlPrefix}IgnoreCase`).prop("checked"),
            State: null,
            StateOperation: parseInt($(`#${ctlPrefix}StateOp`).val()),
            EditableByMe: $(`#${ctlPrefix}Editable`).prop("checked"),
            CityRegex: null,
            CityRegexIgnoreCase: $(`#${ctlPrefix}CityIgnoreCase`).prop("checked"),
            NoStreet: $(`#${ctlPrefix}NoStreet`).prop("checked"),
            NoCity: $(`#${ctlPrefix}NoCity`).prop("checked"),
            LastModifiedBy: null,
            CreatedBy: null,
            IncludeAlt: $(`#${ctlPrefix}IncludeAlt`).prop("checked"),
            Created: $(`#${ctlPrefix}Created`).prop("checked"),
            CreatedOperation: parseInt($(`#${ctlPrefix}CreatedOp`).val()),
            CreatedDate: null,
            Updated: $(`#${ctlPrefix}Updated`).prop("checked"),
            UpdatedOperation: parseInt($(`#${ctlPrefix}UpdatedOp`).val()),
            UpdatedDate: null,
            StreetRegex: null,
            StreetRegexIgnoreCase: $(`#${ctlPrefix}StreetIgnoreCase`).prop("checked")
        };
        $(`input[data-group=${ctlPrefix}HazardType]:checked`).each(function (ix, e) {
            s.HazardTypeMask = s.HazardTypeMask | parseInt(e.value);
        });
        s.Regex = nullif($(`#${ctlPrefix}Name`).val(), "");
        s.CityRegex = nullif($(`#${ctlPrefix}City`).val(), "");
        s.StreetRegex = nullif($(`#${ctlPrefix}Street`).val(), "");
        const selectedState = $(`#${ctlPrefix}State`).val();
        if (nullif(selectedState, "") !== null) {
            const state = W.model.states.getObjectById(parseInt(selectedState));
            if (state !== null) {
                s.State = state.getAttribute('id');
            }
        }
        const selectedModifiedUser = $(`#${ctlPrefix}LastModifiedBy`).val();
        if (nullif(selectedModifiedUser, "") !== null) {
            const u = W.model.users.getObjectById(selectedModifiedUser);
            if (u !== null) {
                s.LastModifiedBy = u.getAttribute('id');
            }
        }
        const selectedCreatedUser = $(`#${ctlPrefix}CreatedBy`).val();
        if (nullif(selectedCreatedUser, "") !== null) {
            const u = W.model.users.getObjectById(selectedCreatedUser);
            if (u !== null) {
                s.CreatedBy = u.getAttribute('id');
            }
        }
        let createdDate = $(`#${ctlPrefix}CreatedDate`).val();
        if (createdDate && createdDate.length > 0) {
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
        if (updatedDate && updatedDate.length > 0) {
            const updatedTime = $(`#${ctlPrefix}UpdatedTime`).val();
            if (updatedTime && updatedTime.length > 0) {
                updatedDate += ` ${updatedTime}`;
            }
            else {
                updatedDate += ' 00:00';
            }
            s.UpdatedDate = (new Date(updatedDate)).getTime();
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
        let allOk = validateSettings();
        hazards = [];
        savedHazards = [];
        haveNames = false;
        haveSpeeds = false;
        haveSubtypes = false;
        haveScheds = false;
        haveStreets = false;
        if (allOk) {
            settings = getSettings();
            if (nullif(settings.Regex, "") !== null) {
                nameRegex = (settings.RegexIgnoreCase ? new RegExp(settings.Regex, "i") : new RegExp(settings.Regex));
            }
            else {
                nameRegex = null;
            }
            if (nullif(settings.CityRegex, "") !== null) {
                cityRegex = (settings.CityRegexIgnoreCase ? new RegExp(settings.CityRegex, "i") : new RegExp(settings.CityRegex));
            }
            else {
                cityRegex = null;
            }
            if (nullif(settings.StreetRegex, "") !== null) {
                streetRegex = (settings.StreetRegexIgnoreCase ? new RegExp(settings.StreetRegex, "i") : new RegExp(settings.StreetRegex));
            }
            else {
                streetRegex = null;
            }
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
            detectIssues = settings.NoName ||
                settings.NoStreet ||
                settings.NoCity;
            updateSettings();
        }
        return allOk;
    }
    WMEWAL_Hazards.ScanStarted = ScanStarted;
    function ScanExtent(segments, venues) {
        return new Promise(resolve => {
            setTimeout(function () {
                const count = scan(segments, venues);
                resolve({ ID: 'PH', count });
            });
        });
    }
    WMEWAL_Hazards.ScanExtent = ScanExtent;
    function scan(segments, venues) {
        for (let h in W.model.permanentHazards.objects) {
            const phazard = W.model.permanentHazards.getObjectById(Number(h));
            if (phazard != null) {
                if ((WazeHazardTypeToHazardTypeBitmask(phazard.getAttribute('type')) & settings.HazardTypeMask) &&
                    //(!settings.EditableByMe || phazard.arePropertiesEditable() || phazard.areUpdateRequestsEditable()) &&
                    (nameRegex == null || nameRegex.test(phazard.getAttribute('name'))) &&
                    (!settings.Created ||
                        (settings.CreatedOperation === Operation.LessThan && phazard.getAttribute('createdOn') < settings.CreatedDate) ||
                        (settings.CreatedOperation === Operation.LessThanOrEqual && phazard.getAttribute('createdOn') <= settings.CreatedDate) ||
                        (settings.CreatedOperation === Operation.GreaterThanOrEqual && phazard.getAttribute('createdOn') >= settings.CreatedDate) ||
                        (settings.CreatedOperation === Operation.GreaterThan && phazard.getAttribute('createdOn') > settings.CreatedDate)) &&
                    (!settings.Updated ||
                        (settings.UpdatedOperation === Operation.LessThan && (phazard.getAttribute('updatedOn') || phazard.getAttribute('createdOn')) < settings.UpdatedDate) ||
                        (settings.UpdatedOperation === Operation.LessThanOrEqual && (phazard.getAttribute('updatedOn') || phazard.getAttribute('createdOn')) <= settings.UpdatedDate) ||
                        (settings.UpdatedOperation === Operation.GreaterThanOrEqual && (phazard.getAttribute('updatedOn') || phazard.getAttribute('createdOn')) >= settings.UpdatedDate) ||
                        (settings.UpdatedOperation === Operation.GreaterThan && (phazard.getAttribute('updatedOn') || phazard.getAttribute('createdOn')) > settings.UpdatedDate)) &&
                    ((settings.CreatedBy === null) ||
                        (phazard.getCreatedBy() === settings.CreatedBy)) &&
                    ((settings.LastModifiedBy === null) ||
                        ((phazard.getUpdatedBy() ?? phazard.getCreatedBy()) === settings.LastModifiedBy))) {
                    let issues = 0;
                    /*
                                        if (state != null) {
                                            if (address && !address.isEmpty() && address.attributes.state) {
                                                if (settings.StateOperation === Operation.Equal && address.attributes.state.getAttribute('id') !== state.getAttribute('id') ||
                                                    settings.StateOperation === Operation.NotEqual && address.attributes.state.getAttribute('id') === state.getAttribute('id')) {
                                                    continue;
                                                }
                                            } else if (settings.StateOperation === Operation.Equal) {
                                                continue;
                                            }
                                        }
                    */
                    // if (settings.LastModifiedBy != null) {
                    //     if (venue.getAttribute('updatedBy') != null) {
                    //         if (venue.getAttribute('updatedBy') !== settings.LastModifiedBy) {
                    //             continue;
                    //         }
                    //     } else if (venue.getAttribute('createdBy') !== settings.LastModifiedBy) {
                    //         continue;
                    //     }
                    // }
                    // if (settings.CreatedBy != null) {
                    //     if (venue.getAttribute('createdBy') !== settings.CreatedBy) {
                    //         continue;
                    //     }
                    // }
                    /*
                                        let regExMatched = false;
                                        if (cityRegex != null) {
                                            regExMatched = false;
                                            if (address && !address.isEmpty() && address.attributes.city && !address.attributes.city.isEmpty() && address.attributes.city.hasName()) {
                                                regExMatched = cityRegex.test(address.attributes.city.getAttribute('name'));
                                            }
                                            if (!regExMatched) {
                                                continue;
                                            }
                                        }
                    
                                        if (streetRegex != null) {
                                            regExMatched = false;
                                            if (address && !address.isEmpty() && !address.isEmptyStreet()) {
                                                regExMatched = streetRegex.test(address.attributes.street.getAttribute('name'));
                                            }
                                            if (!regExMatched) {
                                                continue;
                                            }
                                        }
                    
                                        if (settings.NoName && !venue.getAttribute('name')) {
                                            issues |= Issue.NoName;
                                        }
                    
                                        if (detectIssues && issues === 0) {
                                            // If at least one issue was chosen and this segment doesn't have any issues, then skip it
                                            continue;
                                        }
                    
                    */
                    // Don't add it if we've already done so
                    if (savedHazards.indexOf(phazard.getID()) === -1) {
                        savedHazards.push(phazard.getID());
                        const lastEditorID = phazard.getUpdatedBy() ?? phazard.getCreatedBy();
                        const lastEditor = W.model.users.getObjectById(lastEditorID);
                        const createdByID = phazard.getCreatedBy();
                        const createdBy = W.model.users.getObjectById(createdByID);
                        const direction = phazard.getAttribute('direction');
                        var speedLimit = phazard.getAttribute('speedLimit');
                        if (W.model.isImperial) {
                            speedLimit = Math.round(speedLimit * 0.621371);
                        }
                        const scheduleId = phazard.getAttribute('scheduleId');
                        var scheduleText = '';
                        if (scheduleId) {
                            const sch = W.model.schedules.getObjectById(scheduleId);
                            // It appears the schedules are not automatically loaded into the model when the map is moved.
                            // So this seems to not usually get any data. It possible to request a specific schedule, not sure if that will be added here.
                            if (sch) {
                                scheduleText = sch.attributes.type;
                                if (scheduleText == 'PUBLIC') {
                                    scheduleText = sch.attributes.name;
                                }
                            }
                            else {
                                scheduleText = scheduleId.substring(scheduleId.length - 12);
                            }
                        }
                        const subTypes = phazard.getAttribute('subTypes');
                        var subTypeList = '';
                        if (subTypes.length > 0) {
                            subTypeList = subTypes.join().replace("_LANE", "").replace("MOBILE_", "");
                        }
                        const segmentId = phazard.getAttribute('segmentId');
                        var streetName = '';
                        var cityName = '';
                        if (segmentId) {
                            const s = W.model.segments.getObjectById(segmentId);
                            const address = s.getAddress(W.model);
                            streetName = (address && !address.isEmpty() && !address.isEmptyStreet()) ? address.attributes.street.getAttribute('name') : "";
                            cityName = (address && !address.isEmpty()) ? address.getCityName() : "";
                            if (address.getCity().isEmpty()) {
                                const alt = address.attributes.altStreets;
                                for (var i = 0; i < alt.length; i++) {
                                    const a = alt[i];
                                    if (!a.getCity().isEmpty()) {
                                        cityName = a.getCityName();
                                        break;
                                    }
                                }
                            }
                        }
                        const phTypeNum = phazard.getAttribute('type');
                        const hazard = {
                            id: phazard.getAttribute('id'),
                            phTypeNum,
                            phType: I18n.t("permanent_hazards.type." + phTypeNum.toString()),
                            direction,
                            speedLimit,
                            scheduleId,
                            scheduleText,
                            subTypes,
                            subTypeList,
                            streetName,
                            cityName,
                            name: phazard.getAttribute('name'),
                            pointGeometry: phazard.getOLGeometry().getCentroid(),
                            segmentId,
                            lastEditor: lastEditor?.getAttribute('userName') ?? '',
                            createdBy: createdBy?.getAttribute('userName') ?? '',
                            //issues: issues,
                        };
                        if (hazard.name)
                            haveNames = true;
                        if (hazard.speedLimit > 0)
                            haveSpeeds = true;
                        if (hazard.subTypes.length > 0)
                            haveSubtypes = true;
                        if (hazard.scheduleId)
                            haveScheds = true;
                        if (hazard.streetName)
                            haveStreets = true;
                        hazards.push(hazard);
                    }
                }
            }
        }
        return hazards.length;
    }
    function ScanComplete() {
        if (hazards.length === 0) {
            alert(pluginName + ": No hazards found.");
        }
        else {
            hazards.sort(function (a, b) {
                return a.phType.localeCompare(b.phType);
            });
            const isCSV = (WMEWAL.outputTo & WMEWAL.OutputTo.CSV);
            const isTab = (WMEWAL.outputTo & WMEWAL.OutputTo.Tab);
            const addBOM = WMEWAL.addBOM ?? false;
            const outputFields = WMEWAL.outputFields ?? ['CreatedEditor', 'LastEditor', 'LockLevel', 'Lat', 'Lon'];
            const includeCreatedBy = outputFields.indexOf('CreatedEditor') > -1 || settings.CreatedBy !== null;
            const includeLastUpdatedBy = outputFields.indexOf('LastEditor') > -1 || settings.LastModifiedBy !== null;
            //const includeLockLevel = outputFields.indexOf('LockLevel') > -1 || settings.LockLevel !== null;
            const includeLat = outputFields.indexOf('Lat') > -1;
            const includeLon = outputFields.indexOf('Lon') > -1;
            let lineArray;
            let columnArray;
            let w;
            let fileName;
            if (isCSV) {
                lineArray = [];
                columnArray = ["Type"];
                if (haveNames) {
                    columnArray.push("Name");
                }
                if (detectIssues) {
                    columnArray.push("Issues");
                }
                if (haveSubtypes) {
                    columnArray.push("SubTypes");
                }
                if (haveSpeeds) {
                    columnArray.push("Speed");
                }
                if (haveScheds) {
                    columnArray.push("Sched ID");
                }
                if (haveStreets) {
                    columnArray.push("Street");
                }
                if (haveStreets) {
                    columnArray.push("City");
                }
                if (includeCreatedBy) {
                    columnArray.push("Created By");
                }
                if (includeLastUpdatedBy) {
                    columnArray.push("Last Updated By");
                }
                if (includeLat) {
                    columnArray.push("Latitude");
                }
                if (includeLon) {
                    columnArray.push("Longitude");
                }
                columnArray.push("Permalink");
                lineArray.push(columnArray);
                fileName = "Hazards_" + WMEWAL.areaName;
                fileName += ".csv";
            }
            function getOperationText(operation) {
                return operation === Operation.NotEqual ? "does not equal " : "equals ";
            }
            if (isTab) {
                w = window.open();
                w.document.write("<html><head><title>Hazards</title></head><body>");
                w.document.write("<h3>Area: " + WMEWAL.areaName + "</h3>");
                w.document.write("<h4>Filters</h4>");
                w.document.write("<div>Hazard Type: ");
                let comma = "";
                for (let rt in HazardType) {
                    if (HazardType.hasOwnProperty(rt)) {
                        const mask = parseInt(rt);
                        if (!isNaN(mask) && settings.HazardTypeMask & mask) {
                            w.document.write(comma + TranslateHazardType(HazardTypeBitmaskToWazeHazardType(mask)));
                            comma = ", ";
                        }
                    }
                }
                w.document.write('</div>');
                if (settings.Regex != null) {
                    w.document.write(`<div>Name matches: ${settings.Regex}`);
                    if (settings.RegexIgnoreCase) {
                        w.document.write(" (ignoring case)");
                    }
                    w.document.write('</div>');
                }
                /*                if (streetRegex != null) {
                                    w.document.write(`<div>Street Name matches: ${settings.StreetRegex}`);
                                    if (settings.StreetRegexIgnoreCase) {
                                        w.document.write(" (ignoring case)");
                                    }
                                    w.document.write('</div>');
                                }
                                if (cityRegex != null) {
                                    w.document.write(`<div>City Name matches: ${settings.CityRegex}`);
                                    if (settings.CityRegexIgnoreCase) {
                                        w.document.write(" (ignoring case)");
                                    }
                                    w.document.write('</div>');
                                }
                                    */
                if (stateName != null) {
                    w.document.write(`<div>State ${getOperationText(settings.StateOperation)}${stateName}</div>`);
                }
                if (settings.LastModifiedBy != null) {
                    w.document.write(`<div>Last modified by ${lastModifiedByName}</div>`);
                }
                if (settings.CreatedBy != null) {
                    w.document.write(`<div>Created by ${createdByName}</div>`);
                }
                if (settings.EditableByMe) {
                    w.document.write('<div>Editable by me</div>');
                }
                if (settings.Created) {
                    w.document.write('<div>Created ');
                    switch (settings.CreatedOperation) {
                        case Operation.GreaterThan:
                            w.document.write('after');
                            break;
                        case Operation.GreaterThanOrEqual:
                            w.document.write('on or after');
                            break;
                        case Operation.LessThan:
                            w.document.write('before');
                            break;
                        case Operation.LessThanOrEqual:
                            w.document.write('on or before');
                            break;
                        default:
                            break;
                    }
                    w.document.write(` ${new Date(settings.CreatedDate).toString()}</div>`);
                }
                if (settings.Updated) {
                    w.document.write('<div>Updated ');
                    switch (settings.UpdatedOperation) {
                        case Operation.GreaterThan:
                            w.document.write('after');
                            break;
                        case Operation.GreaterThanOrEqual:
                            w.document.write('on or after');
                            break;
                        case Operation.LessThan:
                            w.document.write('before');
                            break;
                        case Operation.LessThanOrEqual:
                            w.document.write('on or before');
                            break;
                        default:
                            break;
                    }
                    w.document.write(` ${new Date(settings.UpdatedDate).toString()}</div>`);
                }
                if (detectIssues) {
                    w.document.write("<h4>Issues</h4>");
                }
                if (settings.NoName) {
                    w.document.write("<div>No Name</div>");
                }
                w.document.write("<table style='border-collapse: separate; border-spacing: 8px 0px'><thead><tr><th>Type</th>");
                if (haveNames) {
                    w.document.write("<th>Name</th>");
                }
                if (detectIssues) {
                    w.document.write("<th>Issues</th>");
                }
                if (haveSubtypes) {
                    w.document.write("<th>SubTypes</th>");
                }
                if (haveSpeeds) {
                    w.document.write("<th>Speed</th>");
                }
                if (haveScheds) {
                    w.document.write("<th>Sched ID</th>");
                }
                if (haveStreets) {
                    w.document.write("<th>Street</th><th>City</th>");
                }
                if (includeCreatedBy) {
                    w.document.write("<th>Created By</th>");
                }
                if (includeLastUpdatedBy) {
                    w.document.write("<th>Last Updated By</th>");
                }
                if (includeLat) {
                    w.document.write("<th>Latitude</th>");
                }
                if (includeLon) {
                    w.document.write("<th>Longitude</th>");
                }
                w.document.write("<th>Permalink</th></tr><thead><tbody>");
            }
            for (let ixHazard = 0; ixHazard < hazards.length; ixHazard++) {
                const ahazard = hazards[ixHazard];
                const plPlace = getHazardPL(ahazard);
                const latlon = OpenLayers.Layer.SphericalMercator.inverseMercator(ahazard.pointGeometry.x, ahazard.pointGeometry.y);
                const tName = (ahazard.name == null) ? "" : ahazard.name;
                const tSpeed = (ahazard.speedLimit > 0) ? ahazard.speedLimit.toString() : "";
                if (isCSV) {
                    columnArray = [`"${ahazard.phType}"`];
                    if (haveNames) {
                        columnArray.push(tName);
                    }
                    if (detectIssues) {
                        //columnArray.push(`"${getIssues(ahazard.issues)}"`);
                    }
                    if (haveSubtypes) {
                        columnArray.push(ahazard.subTypeList);
                    }
                    if (haveSpeeds) {
                        columnArray.push(tSpeed);
                    }
                    if (haveScheds) {
                        columnArray.push(ahazard.scheduleText);
                    }
                    if (haveStreets) {
                        columnArray.push(ahazard.streetName);
                        columnArray.push(ahazard.cityName);
                    }
                    if (includeCreatedBy) {
                        columnArray.push(`"${ahazard.createdBy}"`);
                    }
                    if (includeLastUpdatedBy) {
                        columnArray.push(`"${ahazard.lastEditor}"`);
                    }
                    if (includeLat) {
                        columnArray.push(latlon.lat.toString());
                    }
                    if (includeLon) {
                        columnArray.push(latlon.lon.toString());
                    }
                    columnArray.push(`"${plPlace}"`);
                    lineArray.push(columnArray);
                }
                if (isTab) {
                    w.document.write(`<tr><td>${ahazard.phType}</td>`);
                    if (haveNames) {
                        w.document.write(`<td>${tName}</td>`);
                    }
                    if (detectIssues) {
                        //w.document.write(`<td>${getIssues(ahazard.issues)}</td>`);
                    }
                    if (haveSubtypes) {
                        w.document.write(`<td>${ahazard.subTypeList}</td>`);
                    }
                    if (haveSpeeds) {
                        w.document.write(`<td>${tSpeed}</td>`);
                    }
                    if (haveScheds) {
                        w.document.write(`<td>${ahazard.scheduleText}</td>`);
                    }
                    if (haveStreets) {
                        w.document.write(`<td>${ahazard.streetName}</td>`);
                        w.document.write(`<td>${ahazard.cityName}</td>`);
                    }
                    if (includeCreatedBy) {
                        w.document.write(`<td>${ahazard.createdBy}</td>`);
                    }
                    if (includeLastUpdatedBy) {
                        w.document.write(`<td>${ahazard.lastEditor}</td>`);
                    }
                    if (includeLat) {
                        w.document.write(`<td>${latlon.lat.toString()}</td>`);
                    }
                    if (includeLon) {
                        w.document.write(`<td>${latlon.lon.toString()}</td>`);
                    }
                    w.document.write(`<td><a href='${plPlace}' target='_blank'>Permalink</a></td></tr>`);
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
                w.document.write("</tbody></table></body></html>");
                w.document.close();
                w = null;
            }
        }
        hazards = null;
        savedHazards = null;
    }
    WMEWAL_Hazards.ScanComplete = ScanComplete;
    function ScanCancelled() {
        ScanComplete();
    }
    WMEWAL_Hazards.ScanCancelled = ScanCancelled;
    function initSettings() {
        settings = {
            HazardTypeMask: 2047,
            NoName: false,
            Regex: null,
            RegexIgnoreCase: true,
            State: null,
            StateOperation: Operation.Equal,
            EditableByMe: true,
            CityRegex: null,
            CityRegexIgnoreCase: true,
            NoStreet: false,
            NoCity: false,
            LastModifiedBy: null,
            CreatedBy: null,
            IncludeAlt: false,
            Created: false,
            CreatedOperation: Operation.GreaterThanOrEqual,
            CreatedDate: null,
            Updated: false,
            UpdatedOperation: Operation.GreaterThanOrEqual,
            UpdatedDate: null,
            StreetRegex: null,
            StreetRegexIgnoreCase: true
        };
    }
    function updateProperties() {
        let upd = false;
        if (settings !== null) {
            if (!settings.hasOwnProperty("NoName")) {
                settings.NoName = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("NoStreet")) {
                settings.NoStreet = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("NoCity")) {
                settings.NoCity = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("LastModifiedBy")) {
                settings.LastModifiedBy = null;
                upd = true;
            }
            if (!settings.hasOwnProperty("IncludeAlt")) {
                settings.IncludeAlt = false;
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
            if (!settings.hasOwnProperty("StreetRegex")) {
                settings.StreetRegex = null;
                upd = true;
            }
            if (!settings.hasOwnProperty("StreetRegexIgnoreCase")) {
                settings.StreetRegexIgnoreCase = true;
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
        }
        return upd;
    }
    //https://waze.com/en-US/editor?env=usa&lat=41.12872&lon=-81.87867&zoomLevel=18&permanentHazards=140620
    function getHazardPL(haz) {
        const latlon = OpenLayers.Layer.SphericalMercator.inverseMercator(haz.pointGeometry.x, haz.pointGeometry.y);
        return WMEWAL.GenerateBasePL(latlon.lat, latlon.lon, 18) + "&permanentHazards=" + haz.id;
    }
    function getIssues(issues) {
        const issuesList = [];
        if (issues & Issue.NoName) {
            issuesList.push("No name");
        }
        if (issues & Issue.MissingStreet) {
            issuesList.push("Missing street");
        }
        if (issues & Issue.NoCity) {
            issuesList.push("No City");
        }
        if (issuesList.length === 0) {
            return "None";
        }
        else {
            return issuesList.join(", ");
        }
    }
    function updateSettings() {
        if (typeof Storage !== "undefined") {
            localStorage[settingsKey] = JSON.stringify(settings);
        }
    }
    function updateSavedSettings() {
        if (typeof Storage !== "undefined") {
            localStorage[savedSettingsKey] = WMEWAL.LZString.compressToUTF16(JSON.stringify(savedSettings));
        }
        updateSavedSettingsList();
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
})(WMEWAL_Hazards || (WMEWAL_Hazards = {}));
