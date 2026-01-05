/// <reference path="../typescript-typings/globals/openlayers/index.d.ts" />
/// <reference path="../typescript-typings/I18n.d.ts" />
/// <reference path="../typescript-typings/waze.d.ts" />
/// <reference path="../typescript-typings/globals/jquery/index.d.ts" />
/// <reference path="WME Wide-Angle Lens.user.ts" />
/// <reference path="../typescript-typings/greasyfork.d.ts" />
// ==UserScript==
// @name                WME Wide-Angle Lens Places
// @namespace           https://greasyfork.org/en/users/19861-vtpearce
// @description         Find place that match filter criteria
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
// @downloadURL https://update.greasyfork.org/scripts/40645/WME%20Wide-Angle%20Lens%20Places.user.js
// @updateURL https://update.greasyfork.org/scripts/40645/WME%20Wide-Angle%20Lens%20Places.meta.js
// ==/UserScript==
// @updateURL           https://greasyfork.org/scripts/418293-wme-wide-angle-lens-places-beta/code/WME%20Wide-Angle%20Lens%20Places.meta.js
// @downloadURL         https://greasyfork.org/scripts/418293-wme-wide-angle-lens-places-beta/code/WME%20Wide-Angle%20Lens%20Places.user.js
/*global W, OL, I18n, $, WazeWrap, WMEWAL, OpenLayers */
var WMEWAL_Places;
(function (WMEWAL_Places) {
    const SCRIPT_NAME = GM_info.script.name;
    const SCRIPT_VERSION = GM_info.script.version.toString();
    const DOWNLOAD_URL = GM_info.script.downloadURL;
    const updateText = '<ul>'
        + '<li>Update for plugin status.</li>'
        + '</ul>';
    const greasyForkPage = 'https://greasyfork.org/scripts/40645';
    const wazeForumThread = 'https://www.waze.com/forum/viewtopic.php?t=206376';
    const ctlPrefix = "_wmewalPlaces";
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
        Issue[Issue["MissingHouseNumber"] = 1] = "MissingHouseNumber";
        Issue[Issue["MissingStreet"] = 2] = "MissingStreet";
        Issue[Issue["AdLocked"] = 4] = "AdLocked";
        Issue[Issue["HasUpdateRequests"] = 8] = "HasUpdateRequests";
        Issue[Issue["PendingApproval"] = 16] = "PendingApproval";
        Issue[Issue["UndefStreet"] = 32] = "UndefStreet";
        Issue[Issue["NoExternalProviders"] = 64] = "NoExternalProviders";
        Issue[Issue["NoHours"] = 128] = "NoHours";
        Issue[Issue["NoEntryExitPoints"] = 256] = "NoEntryExitPoints";
        Issue[Issue["MissingBrand"] = 512] = "MissingBrand";
        Issue[Issue["NoPhoneNumber"] = 1024] = "NoPhoneNumber";
        Issue[Issue["BadPhoneNumberFormat"] = 2048] = "BadPhoneNumberFormat";
        Issue[Issue["NoWebsite"] = 4096] = "NoWebsite";
        Issue[Issue["NoCity"] = 8192] = "NoCity";
        Issue[Issue["NoName"] = 16384] = "NoName";
    })(Issue || (Issue = {}));
    const pluginName = "WMEWAL-Places";
    WMEWAL_Places.Title = "Places";
    WMEWAL_Places.MinimumZoomLevel = 17;
    WMEWAL_Places.SupportsSegments = false;
    WMEWAL_Places.SupportsVenues = true;
    const settingsKey = "WMEWALPlacesSettings";
    const savedSettingsKey = "WMEWALPlacesSavedSettings";
    let settings = null;
    let savedSettings = [];
    let places;
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
    let savedVenues;
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
        WMEWAL.RegisterPlugIn(WMEWAL_Places);
    }
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
        html += "<tr><td class='wal-heading' style='border-top: 1px solid'>Output Options</td></tr>";
        html += `<tr><td class='wal-indent'><input type='checkbox' id='${ctlPrefix}IncludeAlt' class='wal-check' name='${ctlPrefix}IncludeAlt'>` +
            `<label for='${ctlPrefix}IncludeAlt' class='wal-label'>Include Alt Names</label></td></tr>`;
        html += "<tr><td class='wal-heading' style='border-top: 1px solid; padding-top: 4px'><b>Filters (All of these)</b></td></tr>";
        html += "<tr><td><b>Category:</b></td></tr>";
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
        html += "<tr><td><b>Lock Level:</b></td></tr>" +
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
            "</select></td></tr>";
        html += "<tr><td><b>Name RegEx</b></td></tr>";
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
        html += "<tr><td><b>State:</b></td></tr>";
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
        html += `<tr><td><input id='${ctlPrefix}Editable' class='wal-check' type='checkbox'/>` +
            `<label for='${ctlPrefix}Editable' class='wal-label'>Editable by me</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}ParkingLotType' class='wal-check' type='checkbox'/>` +
            `<label for='${ctlPrefix}ParkingLotType' class='wal-label'>`;
        html += `Parking Lot Type: <select id='${ctlPrefix}ParkingLotTypeFilter'>` +
            "<option value='PRIVATE'>" + I18n.t("edit.venue.parking.types.parkingType.PRIVATE") + "</option>" +
            "<option value='PUBLIC'>" + I18n.t("edit.venue.parking.types.parkingType.PUBLIC") + "</option>" +
            "<option value='RESTRICTED'>" + I18n.t("edit.venue.parking.types.parkingType.RESTRICTED") + "</option>" +
            "</select></label></td></tr>";
        html += "<tr><td class='wal-heading' style='border-top: 1px solid; padding-top: 4px'>Issues (Any of these)</td></tr>";
        html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}NoName'/>` +
            `<label for='${ctlPrefix}NoName' class='wal-label'>No Name</label></td></tr>`;
        html += `<tr><td><input class='wal-check' type='checkbox' id='${ctlPrefix}NoHouseNumber'/>` +
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
        html += "</tbody></table>";
        return html;
    }
    WMEWAL_Places.GetTab = GetTab;
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
        $(`#${ctlPrefix}LoadSetting`).on("click", loadSetting);
        $(`#${ctlPrefix}SaveSetting`).on("click", saveSetting);
        $(`#${ctlPrefix}DeleteSetting`).on("click", deleteSetting);
        $(`#${ctlPrefix}Reset`).on('click', reset);
    }
    WMEWAL_Places.TabLoaded = TabLoaded;
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
        $(`#${ctlPrefix}CategoryOp`).val(settings.CategoryOperation || Operation.Equal);
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
        $(`#${ctlPrefix}LastModifiedBy`).val(settings.LastModifiedBy);
        $(`#${ctlPrefix}CreatedBy`).val(settings.CreatedBy);
        $(`#${ctlPrefix}NoExternalProviders`).prop("checked", settings.NoExternalProviders);
        $(`#${ctlPrefix}NoHours`).prop("checked", settings.NoHours);
        $(`#${ctlPrefix}NoPhoneNumber`).prop("checked", settings.NoPhoneNumber);
        $(`#${ctlPrefix}BadPhoneNumberFormat`).prop("checked", settings.BadPhoneNumberFormat);
        $(`#${ctlPrefix}NoWebsite`).prop("checked", settings.NoWebsite);
        $(`#${ctlPrefix}NoEntryExitPoints`).prop("checked", settings.NoEntryExitPoints);
        $(`#${ctlPrefix}ParkingLotType`).prop("checked", settings.ParkingLotType);
        $(`#${ctlPrefix}ParkingLotTypeFilter`).val(settings.ParkingLotTypeFilter);
        $(`#${ctlPrefix}MissingBrand`).prop("checked", settings.MissingBrand);
        $(`#${ctlPrefix}IncludeAlt`).prop("checked", settings.IncludeAlt);
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
        $(`#${ctlPrefix}Website`).val(settings.WebsiteRegex || "");
        $(`#${ctlPrefix}WebsiteIgnoreCase`).prop("checked", settings.WebsiteRegexIgnoreCase);
        $(`#${ctlPrefix}Street`).val(settings.StreetRegex || "");
        $(`#${ctlPrefix}StreetIgnoreCase`).prop("checked", settings.StreetRegexIgnoreCase);
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
        if (nullif(s.WebsiteRegex, "") !== null) {
            try {
                r = (s.WebsiteRegexIgnoreCase ? new RegExp(s.WebsiteRegex, "i") : new RegExp(s.WebsiteRegex));
            }
            catch (error) {
                addMessage("Website RegEx is invalid");
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
        if (s.ParkingLotType) {
            if (nullif(s.ParkingLotTypeFilter, "") === null) {
                addMessage("Please select a parking lot type");
            }
            if (cat !== "" && cat !== "PARKING_LOT") {
                addMessage("When filtering on parking lot type, category must be parking lot.");
            }
        }
        if (s.MissingBrand && cat !== "" && cat !== "GAS_STATION" && cat !== "CAR_SERVICES") {
            addMessage("Invalid category selected if checking for missing gas station brand");
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
            NoName: $(`#${ctlPrefix}NoName`).prop("checked"),
            Regex: null,
            RegexIgnoreCase: $(`#${ctlPrefix}IgnoreCase`).prop("checked"),
            CategoryOperation: parseInt($(`#${ctlPrefix}CategoryOp`).val()),
            Category: null,
            NoHouseNumber: $(`#${ctlPrefix}NoHouseNumber`).prop("checked"),
            State: null,
            StateOperation: parseInt($(`#${ctlPrefix}StateOp`).val()),
            LockLevel: null,
            LockLevelOperation: parseInt($(`#${ctlPrefix}LockLevelOp`).val()),
            EditableByMe: $(`#${ctlPrefix}Editable`).prop("checked"),
            AdLocked: $(`#${ctlPrefix}AdLocked`).prop("checked"),
            UndefStreet: $(`#${ctlPrefix}UndefStreet`).prop("checked"),
            UpdateRequests: $(`#${ctlPrefix}UpdateRequests`).prop("checked"),
            PlaceType: null,
            PendingApproval: $(`#${ctlPrefix}PendingApproval`).prop("checked"),
            CityRegex: null,
            CityRegexIgnoreCase: $(`#${ctlPrefix}CityIgnoreCase`).prop("checked"),
            NoStreet: $(`#${ctlPrefix}NoStreet`).prop("checked"),
            NoCity: $(`#${ctlPrefix}NoCity`).prop("checked"),
            LastModifiedBy: null,
            CreatedBy: null,
            NoExternalProviders: $(`#${ctlPrefix}NoExternalProviders`).prop("checked"),
            NoHours: $(`#${ctlPrefix}NoHours`).prop("checked"),
            NoPhoneNumber: $(`#${ctlPrefix}NoPhoneNumber`).prop("checked"),
            BadPhoneNumberFormat: $(`#${ctlPrefix}BadPhoneNumberFormat`).prop("checked"),
            NoWebsite: $(`#${ctlPrefix}NoWebsite`).prop("checked"),
            NoEntryExitPoints: $(`#${ctlPrefix}NoEntryExitPoints`).prop("checked"),
            ParkingLotType: $(`#${ctlPrefix}ParkingLotType`).prop("checked"),
            ParkingLotTypeFilter: $(`#${ctlPrefix}ParkingLotTypeFilter`).val(),
            MissingBrand: $(`#${ctlPrefix}MissingBrand`).prop("checked"),
            IncludeAlt: $(`#${ctlPrefix}IncludeAlt`).prop("checked"),
            Created: $(`#${ctlPrefix}Created`).prop("checked"),
            CreatedOperation: parseInt($(`#${ctlPrefix}CreatedOp`).val()),
            CreatedDate: null,
            Updated: $(`#${ctlPrefix}Updated`).prop("checked"),
            UpdatedOperation: parseInt($(`#${ctlPrefix}UpdatedOp`).val()),
            UpdatedDate: null,
            WebsiteRegex: null,
            WebsiteRegexIgnoreCase: $(`#${ctlPrefix}WebsiteIgnoreCase`).prop("checked"),
            StreetRegex: null,
            StreetRegexIgnoreCase: $(`#${ctlPrefix}StreetIgnoreCase`).prop("checked")
        };
        s.Regex = nullif($(`#${ctlPrefix}Name`).val(), "");
        s.CityRegex = nullif($(`#${ctlPrefix}City`).val(), "");
        s.WebsiteRegex = nullif($(`#${ctlPrefix}Website`).val(), "");
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
        const selectedLockLevel = $(`#${ctlPrefix}LockLevel`).val();
        if (selectedLockLevel != null && selectedLockLevel.length > 0) {
            s.LockLevel = parseInt(selectedLockLevel);
        }
        s.PlaceType = nullif($(`#${ctlPrefix}Type`).val(), "");
        s.Category = nullif($(`#${ctlPrefix}Category`).val(), "");
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
        places = [];
        savedVenues = [];
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
            if (nullif(settings.WebsiteRegex, "") !== null) {
                websiteRegex = (settings.WebsiteRegexIgnoreCase ? new RegExp(settings.WebsiteRegex, "i") : new RegExp(settings.WebsiteRegex));
            }
            else {
                websiteRegex = null;
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
                settings.NoHouseNumber ||
                settings.NoStreet ||
                settings.NoCity ||
                settings.AdLocked ||
                settings.UpdateRequests ||
                settings.PendingApproval ||
                settings.UndefStreet ||
                settings.NoExternalProviders ||
                settings.NoHours ||
                settings.NoPhoneNumber ||
                settings.BadPhoneNumberFormat ||
                settings.NoWebsite ||
                settings.NoEntryExitPoints ||
                settings.MissingBrand;
            updateSettings();
        }
        return allOk;
    }
    WMEWAL_Places.ScanStarted = ScanStarted;
    function ScanExtent(segments, venues) {
        return new Promise(resolve => {
            setTimeout(function () {
                const count = scan(segments, venues);
                resolve({ ID: 'P', count });
            });
        });
    }
    WMEWAL_Places.ScanExtent = ScanExtent;
    function scan(segments, venues) {
        function checkCategory(categories, category, operation) {
            const match = categories.find(function (e) {
                return e.localeCompare(category) === 0;
            });
            if (typeof match === "undefined" || match == null || match.length === 0) {
                return operation === Operation.NotEqual;
            }
            return operation === Operation.Equal;
        }
        const validPhoneRegex = new RegExp("\\(\\d\\d\\d\\) \\d\\d\\d-\\d\\d\\d\\d");
        for (let ix = 0; ix < venues.length; ix++) {
            const venue = venues[ix];
            if (venue != null) {
                const categories = venue.getAttribute('categories');
                const address = venue.getAddress(W.model);
                if (venue.getAttribute('streetID') && address && address.getCountry() == null) {
                    log("warn", "no address for streetID " + venue.getAttribute('streetID') + ", venue " + venue.getAttribute('name') + " " + venue.getID());
                }
                const houseNum = venue.getAttribute('houseNumber') ?? "";
                if ((settings.LockLevel == null ||
                    (settings.LockLevelOperation === Operation.Equal && (venue.getAttribute('lockRank') || 0) + 1 === settings.LockLevel) ||
                    (settings.LockLevelOperation === Operation.NotEqual && (venue.getAttribute('lockRank') || 0) + 1 !== settings.LockLevel)) &&
                    (!settings.EditableByMe || venue.arePropertiesEditable() || venue.areUpdateRequestsEditable()) &&
                    (settings.PlaceType == null || (settings.PlaceType === "point" && venue.isPoint() && !venue.is2D()) || (settings.PlaceType === "area" && !venue.isPoint() && venue.is2D())) &&
                    (nameRegex == null || nameRegex.test(venue.getAttribute('name'))) &&
                    (!settings.Created ||
                        (settings.CreatedOperation === Operation.LessThan && venue.getAttribute('createdOn') < settings.CreatedDate) ||
                        (settings.CreatedOperation === Operation.LessThanOrEqual && venue.getAttribute('createdOn') <= settings.CreatedDate) ||
                        (settings.CreatedOperation === Operation.GreaterThanOrEqual && venue.getAttribute('createdOn') >= settings.CreatedDate) ||
                        (settings.CreatedOperation === Operation.GreaterThan && venue.getAttribute('createdOn') > settings.CreatedDate)) &&
                    (!settings.Updated ||
                        (settings.UpdatedOperation === Operation.LessThan && (venue.getAttribute('updatedOn') || venue.getAttribute('createdOn')) < settings.UpdatedDate) ||
                        (settings.UpdatedOperation === Operation.LessThanOrEqual && (venue.getAttribute('updatedOn') || venue.getAttribute('createdOn')) <= settings.UpdatedDate) ||
                        (settings.UpdatedOperation === Operation.GreaterThanOrEqual && (venue.getAttribute('updatedOn') || venue.getAttribute('createdOn')) >= settings.UpdatedDate) ||
                        (settings.UpdatedOperation === Operation.GreaterThan && (venue.getAttribute('updatedOn') || venue.getAttribute('createdOn')) > settings.UpdatedDate)) &&
                    ((settings.CreatedBy === null) ||
                        (venue.getCreatedBy() === settings.CreatedBy)) &&
                    ((settings.LastModifiedBy === null) ||
                        ((venue.getUpdatedBy() ?? venue.getCreatedBy()) === settings.LastModifiedBy)) &&
                    (websiteRegex === null ||
                        websiteRegex.test(venue.getAttribute('url')))) {
                    let issues = 0;
                    if (state != null) {
                        if (address && !address.isEmpty() && address.attributes.state) {
                            if (settings.StateOperation === Operation.Equal && address.attributes.state.getAttribute('id') !== state.getAttribute('id') ||
                                settings.StateOperation === Operation.NotEqual && address.attributes.state.getAttribute('id') === state.getAttribute('id')) {
                                continue;
                            }
                        }
                        else if (settings.StateOperation === Operation.Equal) {
                            continue;
                        }
                    }
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
                    if (settings.Category != null) {
                        if (!checkCategory(categories, settings.Category, settings.CategoryOperation)) {
                            continue;
                        }
                    }
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
                    if (settings.ParkingLotType) {
                        // Don't pay attention if we don't have a parking lot type
                        if (!venue.getAttribute('categoryAttributes').PARKING_LOT ||
                            venue.getAttribute('categoryAttributes').PARKING_LOT.parkingType !== settings.ParkingLotTypeFilter) {
                            continue;
                        }
                    }
                    if (settings.NoName && !venue.getAttribute('name')) {
                        issues |= Issue.NoName;
                    }
                    if (settings.NoHouseNumber && houseNum == '') {
                        issues |= Issue.MissingHouseNumber;
                    }
                    if (settings.AdLocked && venue.getAttribute('adLocked')) {
                        issues |= Issue.AdLocked;
                    }
                    if (settings.UndefStreet && typeof W.model.streets.objects[venue.getAttribute('streetID')] === 'undefined') {
                        issues |= Issue.UndefStreet;
                    }
                    if (settings.UpdateRequests && venue.hasOpenUpdateRequests()) {
                        issues |= Issue.HasUpdateRequests;
                    }
                    if (settings.PendingApproval && !venue.isApproved()) {
                        issues |= Issue.PendingApproval;
                    }
                    if (settings.NoStreet && (!address || address.isEmpty() || address.isEmptyStreet())) {
                        issues |= Issue.MissingStreet;
                    }
                    if (settings.NoCity && (!address || address.isEmpty() || !address.getCity() || address.getCity().isEmpty())) {
                        issues |= Issue.NoCity;
                    }
                    if (settings.NoExternalProviders && (!venue.getAttribute('externalProviderIDs') || venue.getAttribute('externalProviderIDs').length === 0)) {
                        issues |= Issue.NoExternalProviders;
                    }
                    if (settings.NoHours && (!venue.getAttribute('openingHours') || venue.getAttribute('openingHours').length === 0)) {
                        issues |= Issue.NoHours;
                    }
                    if (settings.NoPhoneNumber && !venue.getAttribute('phone')) {
                        issues |= Issue.NoPhoneNumber;
                    }
                    if (settings.BadPhoneNumberFormat && (venue.getAttribute('phone') && !validPhoneRegex.test(venue.getAttribute('phone')))) {
                        issues |= Issue.BadPhoneNumberFormat;
                    }
                    if (settings.NoWebsite && !venue.getAttribute('url')) {
                        issues |= Issue.NoWebsite;
                    }
                    if (settings.NoEntryExitPoints && (!venue.getAttribute('entryExitPoints') || venue.getAttribute('entryExitPoints').length === 0)) {
                        issues |= Issue.NoEntryExitPoints;
                    }
                    if (settings.MissingBrand && checkCategory(categories, "GAS_STATION", Operation.Equal) && venue.getAttribute('brand') === null) {
                        issues |= Issue.MissingBrand;
                    }
                    if (detectIssues && issues === 0) {
                        // If at least one issue was chosen and this segment doesn't have any issues, then skip it
                        continue;
                    }
                    if (!WMEWAL.IsVenueInArea(venue)) {
                        continue;
                    }
                    // Don't add it if we've already done so
                    if (savedVenues.indexOf(venue.getID()) === -1) {
                        savedVenues.push(venue.getID());
                        const lastEditorID = venue.getUpdatedBy() ?? venue.getCreatedBy();
                        const lastEditor = W.model.users.getObjectById(lastEditorID);
                        const createdByID = venue.getCreatedBy();
                        const createdBy = W.model.users.getObjectById(createdByID);
                        const place = {
                            id: venue.getAttribute('id'),
                            mainCategory: venue.getMainCategory(),
                            name: venue.getAttribute('name'),
                            lockLevel: venue.getLockRank() + 1,
                            pointGeometry: venue.getOLGeometry().getCentroid(),
                            // navigationPoint: venue.getNavigationPoint(),
                            categories: categories,
                            streetID: venue.getAttribute('streetID'),
                            placeType: ((venue.isPoint() && !venue.is2D()) ? I18n.t("edit.venue.type.point") : I18n.t("edit.venue.type.area")),
                            isApproved: venue.isApproved(),
                            city: ((address && !address.isEmpty() && address.attributes.city && !address.attributes.city.isEmpty() && address.attributes.city.hasName()) ? address.attributes.city.getAttribute('name') : "No City"),
                            state: ((address && !address.isEmpty() && address.attributes.state) ? address.attributes.state.getAttribute('name') : "No State"),
                            houseNumber: houseNum,
                            streetName: ((address && !address.isEmpty() && !address.isEmptyStreet()) ? address.attributes.street.getAttribute('name') : "") || "",
                            lastEditor: lastEditor?.getAttribute('userName') ?? '',
                            createdBy: createdBy?.getAttribute('userName') ?? '',
                            url: venue.getAttribute('url') ?? "",
                            phone: venue.getAttribute('phone') ?? "",
                            issues: issues,
                            parkingLotType: (venue.getAttribute('categoryAttributes').PARKING_LOT && venue.getAttribute('categoryAttributes').PARKING_LOT.parkingType && I18n.t("edit.venue.parking.types.parkingType." + venue.getAttribute('categoryAttributes').PARKING_LOT.parkingType)) || "",
                            altNames: [...venue.getAttribute('aliases')]
                        };
                        places.push(place);
                    }
                }
            }
        }
        return places.length;
    }
    function ScanComplete() {
        if (places.length === 0) {
            alert(pluginName + ": No places found.");
        }
        else {
            places.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
            const isCSV = (WMEWAL.outputTo & WMEWAL.OutputTo.CSV);
            const isTab = (WMEWAL.outputTo & WMEWAL.OutputTo.Tab);
            const addBOM = WMEWAL.addBOM ?? false;
            const outputFields = WMEWAL.outputFields ?? ['CreatedEditor', 'LastEditor', 'LockLevel', 'Lat', 'Lon'];
            const includeCreatedBy = outputFields.indexOf('CreatedEditor') > -1 || settings.CreatedBy !== null;
            const includeLastUpdatedBy = outputFields.indexOf('LastEditor') > -1 || settings.LastModifiedBy !== null;
            const includeLockLevel = outputFields.indexOf('LockLevel') > -1 || settings.LockLevel !== null;
            const includeLat = outputFields.indexOf('Lat') > -1;
            const includeLon = outputFields.indexOf('Lon') > -1;
            let lineArray;
            let columnArray;
            let w;
            let fileName;
            if (isCSV) {
                lineArray = [];
                // (settings.undefStreet ? "Street ID," : "")
                columnArray = ["Name"];
                if (settings.IncludeAlt) {
                    columnArray.push("Alt Names");
                }
                columnArray.push("Categories", "City", "State");
                if (includeLockLevel) {
                    columnArray.push("Lock Level");
                }
                columnArray.push("Type", "Street", "House Number");
                if (detectIssues) {
                    columnArray.push("Issues");
                }
                columnArray.push("Website", "Phone Number", "Parking Lot Type");
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
                fileName = "Places_" + WMEWAL.areaName;
                fileName += ".csv";
            }
            function getOperationText(operation) {
                return operation === Operation.NotEqual ? "does not equal " : "equals ";
            }
            if (isTab) {
                w = window.open();
                w.document.write("<html><head><title>Places</title></head><body>");
                w.document.write("<h3>Area: " + WMEWAL.areaName + "</h3>");
                w.document.write("<h4>Filters</h4>");
                if (settings.Category != null) {
                    w.document.write(`<div>Category: ${getOperationText(settings.CategoryOperation)}${I18n.t("venues.categories." + settings.Category)}</div>`);
                }
                if (settings.LockLevel != null) {
                    w.document.write(`<div>Lock Level ${getOperationText(settings.LockLevelOperation)}${settings.LockLevel.toString()}</div>`);
                }
                if (settings.Regex != null) {
                    w.document.write(`<div>Name matches: ${settings.Regex}`);
                    if (settings.RegexIgnoreCase) {
                        w.document.write(" (ignoring case)");
                    }
                    w.document.write('</div>');
                }
                if (streetRegex != null) {
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
                if (stateName != null) {
                    w.document.write(`<div>State ${getOperationText(settings.StateOperation)}${stateName}</div>`);
                }
                if (settings.PlaceType != null) {
                    w.document.write(`<div>Type ${I18n.t("edit.venue.type." + settings.PlaceType)}</div>`);
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
                if (settings.ParkingLotType) {
                    w.document.write(`<div>Parking lot type: ${settings.ParkingLotTypeFilter}</div>`);
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
                if (settings.NoHouseNumber) {
                    w.document.write("<div>Missing house number</div>");
                }
                if (settings.NoStreet) {
                    w.document.write("<div>Missing street</div>");
                }
                if (settings.NoCity) {
                    w.document.write("<div>Missing city</div>");
                }
                if (settings.AdLocked) {
                    w.document.write("<div>Ad locked</div>");
                }
                if (settings.UpdateRequests) {
                    w.document.write("<div>Has update requests</div>");
                }
                if (settings.PendingApproval) {
                    w.document.write("<div>Pending approval</div>");
                }
                if (settings.UndefStreet) {
                    w.document.write("<div>Undefined street ID</div>");
                }
                if (settings.NoExternalProviders) {
                    w.document.write("<div>No external provider links</div>");
                }
                if (settings.NoHours) {
                    w.document.write("<div>No hours</div>");
                }
                if (settings.NoPhoneNumber) {
                    w.document.write("<div>No phone number</div>");
                }
                if (settings.BadPhoneNumberFormat) {
                    w.document.write("<div>Bad phone number format</div>");
                }
                if (settings.NoWebsite) {
                    w.document.write("<div>No website</div>");
                }
                if (settings.NoEntryExitPoints) {
                    w.document.write("<div>No entry/exit points</div>");
                }
                if (settings.MissingBrand) {
                    w.document.write("<div>Missing brand</div>");
                }
                w.document.write("<table style='border-collapse: separate; border-spacing: 8px 0px'><thead><tr><th>Name</th>");
                if (settings.IncludeAlt) {
                    w.document.write("<th>Alt Names</th>");
                }
                w.document.write("<th>Categories</th><th>City</th><th>State</th>");
                if (includeLockLevel) {
                    w.document.write("<th>Lock Level</th>");
                }
                w.document.write("<th>Type</th><th>Street</th><th>House Number</th>");
                if (detectIssues) {
                    w.document.write("<th>Issues</th>");
                }
                w.document.write("<th>Website</th><th>Phone Number</th><th>Parking Lot Type</th>");
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
            for (let ixPlace = 0; ixPlace < places.length; ixPlace++) {
                const place = places[ixPlace];
                const plPlace = getPlacePL(place);
                const latlon = OpenLayers.Layer.SphericalMercator.inverseMercator(place.pointGeometry.x, place.pointGeometry.y);
                let categories = "";
                for (let ixCategory = 0; ixCategory < place.categories.length; ixCategory++) {
                    if (ixCategory > 0) {
                        categories += ", ";
                    }
                    categories += I18n.t("venues.categories." + place.categories[ixCategory]);
                }
                if (isCSV) {
                    // (settings.undefStreet ? `${place.streetID},` : "")
                    // columnArray = [`"${place.name}"`, `"${categories}"`, `"${place.city}"`, `"${place.state}"`, place.lockLevel.toString(),
                    //     place.placeType, (place.adLocked ? "Yes" : "No"), (place.hasOpenUpdateRequests ? "Yes" : "No"), (place.isApproved ? "No" : "Yes"),
                    //     `"${place.streetName}"`, `"${place.houseNumber}"`, (place.hasExternalProvider ? "Yes" : "No"), `"${place.url}"`, `"${place.phone}"`,
                    //     (place.hasHours ? "Yes" : "No"), `"${place.lastEditor}"`, latlon.lat.toString(), latlon.lon.toString(), `"${plPlace}"`];
                    columnArray = [`"${place.name}"`];
                    if (settings.IncludeAlt) {
                        columnArray.push(`"${place.altNames.join(',')}"`);
                    }
                    columnArray.push(`"${categories}"`, `"${place.city}"`, `"${place.state}"`);
                    if (includeLockLevel) {
                        columnArray.push(place.lockLevel.toString());
                    }
                    columnArray.push(place.placeType, `"${place.streetName}"`, `"${place.houseNumber}"`);
                    if (detectIssues) {
                        columnArray.push(`"${getIssues(place.issues)}"`);
                    }
                    columnArray.push(`"${place.url}"`, `"${place.phone}"`, `"${place.parkingLotType}"`);
                    if (includeCreatedBy) {
                        columnArray.push(`"${place.createdBy}"`);
                    }
                    if (includeLastUpdatedBy) {
                        columnArray.push(`"${place.lastEditor}"`);
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
                    w.document.write(`<tr><td>${place.name}</td>`);
                    if (settings.IncludeAlt) {
                        w.document.write(`<td>${place.altNames.join(", ")}</td>`);
                    }
                    w.document.write(`<td>${categories}</td>`);
                    w.document.write(`<td>${place.city}</td>`);
                    w.document.write(`<td>${place.state}</td>`);
                    if (includeLockLevel) {
                        w.document.write(`<td>${place.lockLevel.toString()}</td>`);
                    }
                    w.document.write(`<td>${place.placeType}</td>`);
                    w.document.write(`<td>${place.streetName}</td>`);
                    w.document.write(`<td>${place.houseNumber}</td>`);
                    if (detectIssues) {
                        w.document.write(`<td>${getIssues(place.issues)}</td>`);
                    }
                    // w.document.write(`<td>${place.adLocked ? "Yes" : "No"}</td>`);
                    // w.document.write(`<td>${place.hasOpenUpdateRequests ? "Yes" : "No"}</td>`);
                    // w.document.write(`<td>${place.isApproved ? "No" : "Yes"}</td>`);
                    w.document.write(`<td>${place.url === "" ? place.url : `<a href="${/^http/.test(place.url) ? '' : 'http://'}${place.url}">${place.url}</a>`}</td>`);
                    w.document.write(`<td>${place.phone}</td>`);
                    w.document.write(`<td>${place.parkingLotType}</td>`);
                    if (includeCreatedBy) {
                        w.document.write(`<td>${place.createdBy}</td>`);
                    }
                    if (includeLastUpdatedBy) {
                        w.document.write(`<td>${place.lastEditor}</td>`);
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
        places = null;
        savedVenues = null;
    }
    WMEWAL_Places.ScanComplete = ScanComplete;
    function ScanCancelled() {
        ScanComplete();
    }
    WMEWAL_Places.ScanCancelled = ScanCancelled;
    function initSettings() {
        settings = {
            NoName: false,
            Regex: null,
            RegexIgnoreCase: true,
            Category: null,
            CategoryOperation: Operation.Equal,
            NoHouseNumber: false,
            State: null,
            StateOperation: Operation.Equal,
            LockLevel: null,
            LockLevelOperation: Operation.Equal,
            EditableByMe: true,
            AdLocked: false,
            UpdateRequests: false,
            PlaceType: null,
            PendingApproval: false,
            CityRegex: null,
            CityRegexIgnoreCase: true,
            NoStreet: false,
            NoCity: false,
            LastModifiedBy: null,
            CreatedBy: null,
            UndefStreet: false,
            NoExternalProviders: false,
            NoHours: false,
            NoPhoneNumber: false,
            BadPhoneNumberFormat: false,
            NoWebsite: false,
            NoEntryExitPoints: false,
            ParkingLotType: false,
            ParkingLotTypeFilter: null,
            MissingBrand: false,
            IncludeAlt: false,
            Created: false,
            CreatedOperation: Operation.GreaterThanOrEqual,
            CreatedDate: null,
            Updated: false,
            UpdatedOperation: Operation.GreaterThanOrEqual,
            UpdatedDate: null,
            WebsiteRegex: null,
            WebsiteRegexIgnoreCase: true,
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
            if (!settings.hasOwnProperty("NoExternalProviders")) {
                settings.NoExternalProviders = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("NoHours")) {
                settings.NoHours = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("NoPhoneNumber")) {
                settings.NoPhoneNumber = false;
            }
            if (!settings.hasOwnProperty("BadPhoneNumberFormat")) {
                settings.BadPhoneNumberFormat = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("NoWebsite")) {
                settings.NoWebsite = false;
            }
            if (!settings.hasOwnProperty("NoEntryExitPoints")) {
                settings.NoEntryExitPoints = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("ParkingLotType")) {
                settings.ParkingLotType = false;
                upd = true;
            }
            if (!settings.hasOwnProperty("ParkingLotTypeFilter")) {
                settings.ParkingLotTypeFilter = null;
                upd = true;
            }
            if (!settings.hasOwnProperty("MissingBrand")) {
                settings.MissingBrand = false;
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
            if (!settings.hasOwnProperty("WebsiteRegex")) {
                settings.WebsiteRegex = null;
                upd = true;
            }
            if (!settings.hasOwnProperty("WebsiteRegexIgnoreCase")) {
                settings.WebsiteRegexIgnoreCase = true;
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
    function getPlacePL(place) {
        const latlon = OpenLayers.Layer.SphericalMercator.inverseMercator(place.pointGeometry.x, place.pointGeometry.y);
        return WMEWAL.GenerateBasePL(latlon.lat, latlon.lon, 5) + "&mode=0&venues=" + place.id;
    }
    function getIssues(issues) {
        const issuesList = [];
        if (issues & Issue.NoName) {
            issuesList.push("No name");
        }
        if (issues & Issue.AdLocked) {
            issuesList.push("Ad locked");
        }
        if (issues & Issue.HasUpdateRequests) {
            issuesList.push("Has update requests");
        }
        if (issues & Issue.MissingHouseNumber) {
            issuesList.push("Missing house number");
        }
        if (issues & Issue.MissingStreet) {
            issuesList.push("Missing street");
        }
        if (issues & Issue.NoCity) {
            issuesList.push("No City");
        }
        if (issues & Issue.NoExternalProviders) {
            issuesList.push("No external provider IDs");
        }
        if (issues & Issue.PendingApproval) {
            issuesList.push("Pending approval");
        }
        if (issues & Issue.UndefStreet) {
            issuesList.push("Undefined street ID");
        }
        if (issues & Issue.NoHours) {
            issuesList.push("No hours");
        }
        if (issues & Issue.NoPhoneNumber) {
            issuesList.push("No phone number");
        }
        if (issues & Issue.BadPhoneNumberFormat) {
            issuesList.push("Bad phone number format");
        }
        if (issues & Issue.NoHours) {
            issuesList.push("No website");
        }
        if (issues & Issue.NoEntryExitPoints) {
            issuesList.push("No entry/exit points");
        }
        if (issues & Issue.MissingBrand) {
            issuesList.push("Missing brand");
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
})(WMEWAL_Places || (WMEWAL_Places = {}));
