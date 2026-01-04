/// <reference path="../typescript-typings/globals/openlayers/index.d.ts" />
/// <reference path="../typescript-typings/waze.d.ts" />
/// <reference path="../typescript-typings/globals/jquery/index.d.ts" />
/// <reference path="WME Wide-Angle Lens.user.ts" />
/// <reference path="../typescript-typings/greasyfork.d.ts" />
// ==UserScript==
// @name                WME Wide-Angle Lens Locks Beta
// @namespace           https://greasyfork.org/en/users/19861-vtpearce
// @description         Find segments that don't match lock levels
// @author              vtpearce and crazycaveman
// @include             https://www.waze.com/editor
// @include             /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version             1.4.0
// @grant               none
// @copyright           2020 vtpearce
// @license             CC BY-SA 4.0
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/418295/WME%20Wide-Angle%20Lens%20Locks%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/418295/WME%20Wide-Angle%20Lens%20Locks%20Beta.meta.js
// ==/UserScript==
/*global W, OL, $, WazeWrap, WMEWAL, OpenLayers */
var WMEWAL_Locks;
(function (WMEWAL_Locks) {
    const scrName = GM_info.script.name;
    const Version = GM_info.script.version;
    const updateText = '<ul>' +
        '<li>Return count of streets found</li>' +
        '</ul>';
    const greasyForkPage = 'https://greasyfork.org/scripts/40643';
    const wazeForumThread = 'https://www.waze.com/forum/viewtopic.php?t=206376';
    const ctlPrefix = `_wmewalLocks`;
    const minimumWALVersionRequired = "1.5.3";
    let IncludeInOutput;
    (function (IncludeInOutput) {
        IncludeInOutput[IncludeInOutput["Low"] = 1] = "Low";
        IncludeInOutput[IncludeInOutput["High"] = 2] = "High";
    })(IncludeInOutput || (IncludeInOutput = {}));
    let Operation;
    (function (Operation) {
        Operation[Operation["Equal"] = 1] = "Equal";
        Operation[Operation["NotEqual"] = 2] = "NotEqual";
    })(Operation || (Operation = {}));
    let pluginName = "WMEWAL-Locks";
    WMEWAL_Locks.Title = "Locks";
    WMEWAL_Locks.MinimumZoomLevel = 14;
    WMEWAL_Locks.SupportsSegments = true;
    WMEWAL_Locks.SupportsVenues = false;
    let settingsKey = "WMEWALLocksSettings";
    let savedSettingsKey = "WMEWALLocksSavedSettings";
    let settings = null;
    let savedSettings = [];
    let streets = null;
    let state;
    let stateName;
    let nameRegex = null;
    let cityRegex = null;
    let initCount = 0;
    let savedSegments;
    function GetTab() {
        let html = "<table style='border-collapse: separate; border-spacing:0px 1px;'>";
        html += "<tbody>";
        html += "<tr><td class='wal-heading'>Saved Filters</td></tr>";
        html += "<tr><td class='wal-indent' style='padding-bottom: 8px'>" +
            `<select id='${ctlPrefix}SavedSettings'></select><br/>` +
            `<button class='btn btn-primary' id='${ctlPrefix}LoadSetting' title='Load'>Load</button>` +
            `<button class='btn btn-primary' style='margin-left: 4px;' id='${ctlPrefix}SaveSetting' title='Save'>Save</button>` +
            `<button class='btn btn-primary' style='margin-left: 4px;' id='${ctlPrefix}DeleteSetting' title='Delete'>Delete</button></td></tr>`;
        html += "<tr><td class='wal-heading' style='border-top: 1px solid'>Output Options</td></tr>";
        html += `<tr><td class='wal-indent'><input type='checkbox' class='wal-check' id='${ctlPrefix}IncludeAlt' name='${ctlPrefix}IncludeAlt'>` +
            `<label for='${ctlPrefix}IncludeAlt' class='wal-label'>Include Alt Names</label></td></tr>`;
        html += "<tr><td class='wal-indent'><b>Include:</b>" +
            `<select id='${ctlPrefix}IncludeInOutput'>` +
            `<option value='${IncludeInOutput.Low}'>Locked too low</option>` +
            `<option value='${IncludeInOutput.High}'>Locked too high</option>` +
            `<option value='${(IncludeInOutput.Low | IncludeInOutput.High)}'>Locked incorrectly</option></select></td></tr>`;
        html += "<tr><td class='wal-heading' style='border-top: 1px solid; padding-top: 4px;'><b>Lock Levels</b></td></tr>";
        html += "<tr><td><table style='border-collapse: separate; border-spacing: 0px'>";
        html += `<tr><td>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Street))}</td><td><select id='${ctlPrefix}Street'>` +
            "<option value='1' selected='selected'>1</option>" +
            "<option value='2'>2</option>" +
            "<option value='3'>3</option>" +
            "<option value='4'>4</option>" +
            "<option value='5'>5</option>" +
            "<option value='6'>6</option></select>" +
            `<br/><input id='${ctlPrefix}PlusOneWayStreet' type='checkbox' class='wal-check'/><label for='${ctlPrefix}PlusOneWayStreet' class='wal-label'>+1 for One-Way</label>` +
            "</td></tr>";
        html += `<tr><td>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.PrimaryStreet))}</td><td><select id='${ctlPrefix}PrimaryStreet'>` +
            "<option value='1'>1</option>" +
            "<option value='2' selected='selected'>2</option>" +
            "<option value='3'>3</option>" +
            "<option value='4'>4</option>" +
            "<option value='5'>5</option>" +
            "<option value='6'>6</option></select>" +
            `<br/><input id='${ctlPrefix}PlusOneWayPS' type='checkbox' class='wal-check'/><label for='${ctlPrefix}PlusOneWayPS' class='wal-label'>+1 for One-Way</label></td></tr>`;
        html += `<tr><td>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.MinorHighway))}</td><td><select id='${ctlPrefix}MinorHighway'>` +
            "<option value='1'>1</option>" +
            "<option value='2'>2</option>" +
            "<option value='3' selected='selected'>3</option>" +
            "<option value='4'>4</option>" +
            "<option value='5'>5</option>" +
            "<option value='6'>6</option></select>" +
            `<br/><input id='${ctlPrefix}PlusOneWayMinorH' type='checkbox' class='wal-check'/><label for='${ctlPrefix}PlusOneWayMinorH' class='wal-label'>+1 for One-Way</label></td></tr>`;
        html += `<tr><td>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.MajorHighway))}</td><td><select id='${ctlPrefix}MajorHighway'>` +
            "<option value='1'>1</option>" +
            "<option value='2'>2</option>" +
            "<option value='3'>3</option>" +
            "<option value='4' selected='selected'>4</option>" +
            "<option value='5'>5</option>" +
            "<option value='6'>6</option></select>" +
            `<br/><input id='${ctlPrefix}PlusOneWayMajorH' type='checkbox' class='wal-check'/><label for='${ctlPrefix}PlusOneWayMajorH' class='wal-label'>+1 for One-Way</label></td></tr>`;
        html += `<tr><td>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Freeway))}</td><td><select id='${ctlPrefix}Freeway'>` +
            "<option value='1'>1</option>" +
            "<option value='2'>2</option>" +
            "<option value='3'>3</option>" +
            "<option value='4'>4</option>" +
            "<option value='5' selected='selected'>5</option>" +
            "<option value='6'>6</option></select>" +
            `<br/><input id='${ctlPrefix}PlusOneWayFW' type='checkbox' class='wal-check'/><label for='${ctlPrefix}PlusOneWayFW' class='wal-label'>+1 for One-Way</label></td></tr>`;
        html += `<tr><td>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Ramp))}</td><td><select id='${ctlPrefix}Ramp'>` +
            "<option value='7' selected='selected'>Highest connection</option>" +
            "<option value='1'>1</option>" +
            "<option value='2'>2</option>" +
            "<option value='3'>3</option>" +
            "<option value='4'>4</option>" +
            "<option value='5'>5</option>" +
            "<option value='6'>6</option></select>" +
            `<br/><input id='${ctlPrefix}PlusOneWayRamp' type='checkbox' class='wal-check'/><label for='${ctlPrefix}PlusOneWayRamp' class='wal-label'>+1 for One-Way</label></td></tr>`;
        html += `<tr><td>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Railroad))}</td><td><select id='${ctlPrefix}Railroad'>` +
            "<option value='1'>1</option>" +
            "<option value='2' selected='selected'>2</option>" +
            "<option value='3'>3</option>" +
            "<option value='4'>4</option>" +
            "<option value='5'>5</option>" +
            "<option value='6'>6</option></select>" +
            "</td></tr>";
        html += "</table></td></tr>";
        html += "<tr><td class='wal-heading' style='border-top: 1px solid; padding-top: 4px;'><b>Filters</b></td></tr>";
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
        html += "<tr><td><b>Road Type:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<button id='${ctlPrefix}RoadTypeAny' class='btn btn-primary' style='margin-right: 8px' title='Any'>Any</button>` +
            `<button id='${ctlPrefix}RoadTypeClear' class='btn btn-primary' title='Clear'>Clear</button><br/>` +
            `<input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeStreet' name='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Street}'/>` +
            `<label for='${ctlPrefix}RoadTypeStreet' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Street))}</label><br/>` +
            `<input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypePrimary' name='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.PrimaryStreet}'/>` +
            `<label for='${ctlPrefix}RoadTypePrimary' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.PrimaryStreet))}</label><br/>` +
            `<input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeMinorHighway' name='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.MinorHighway}'/>` +
            `<label for='${ctlPrefix}RoadTypeMinorHighway' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.MinorHighway))}</label><br/>` +
            `<input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeMajorHighway' name='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.MajorHighway}'/>` +
            `<label for='${ctlPrefix}RoadTypeMajorHighway' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.MajorHighway))}</label><br/>` +
            `<input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeRamp' name='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Ramp}'/>` +
            `<label for='${ctlPrefix}RoadTypeRamp' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Ramp))}</label><br/>` +
            `<input type='checkbox' class='wal-check' checked='checked' id='${ctlPrefix}RoadTypeFreeway' name='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Freeway}'/>` +
            `<label for='${ctlPrefix}RoadTypeFreeway' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Freeway))}</label><br/>` +
            `<input type='checkbox' class='wal-check' checked='checked' id='${ctlPrefix}RoadTypeRailroad' name='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Railroad}'/>` +
            `<label for='${ctlPrefix}RoadTypeRailroad' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Railroad))}</label>` +
            "</td></tr>";
        html += `<tr><td><input id='${ctlPrefix}Editable' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}Editable' class='wal-label'>Editable by me</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}ExcludeRoundabouts' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}ExcludeRoundabouts' class='wal-label'>Exclude Roundabouts</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}ExcludeJunctionBoxes' type='checkbox' class='wal-check' checked='checked'/>` +
            `<label for='${ctlPrefix}ExcludeJunctionBoxes' class='wal-label'>Exclude Junction Boxes</label></td></tr>`;
        html += "</tbody></table>";
        return html;
    }
    WMEWAL_Locks.GetTab = GetTab;
    function TabLoaded() {
        updateStates();
        updateUI();
        updateSavedSettingsList();
        $(`#${ctlPrefix}State`).on("focus", updateStates);
        $(`#${ctlPrefix}RoadTypeAny`).on("click", function () {
            $(`input[name=${ctlPrefix}RoadType]`).prop("checked", true);
        });
        $(`#${ctlPrefix}RoadTypeClear`).on("click", function () {
            $(`input[name=${ctlPrefix}RoadType]`).prop("checked", false);
        });
        $(`#${ctlPrefix}LoadSetting`).on("click", loadSetting);
        $(`#${ctlPrefix}SaveSetting`).on("click", saveSetting);
        $(`#${ctlPrefix}DeleteSetting`).on("click", deleteSetting);
    }
    WMEWAL_Locks.TabLoaded = TabLoaded;
    function updateStates() {
        let selectState = $(`#${ctlPrefix}State`);
        // Preserve current selection
        let currentId = parseInt(selectState.val());
        selectState.empty();
        let stateObjs = [];
        stateObjs.push({ id: null, name: "" });
        for (let s in W.model.states.objects) {
            if (W.model.states.objects.hasOwnProperty(s)) {
                let st = W.model.states.getObjectById(parseInt(s));
                if (st.id !== 1 && st.name.length > 0) {
                    stateObjs.push({ id: st.id, name: st.name });
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
            let so = stateObjs[ix];
            let stateOption = $("<option/>").text(so.name).attr("value", so.id);
            if (currentId != null && so.id === currentId) {
                stateOption.attr("selected", "selected");
            }
            selectState.append(stateOption);
        }
    }
    function updateSavedSettingsList() {
        let s = $(`#${ctlPrefix}SavedSettings`);
        s.empty();
        for (let ixSaved = 0; ixSaved < savedSettings.length; ixSaved++) {
            let opt = $("<option/>").attr("value", ixSaved).text(savedSettings[ixSaved].Name);
            s.append(opt);
        }
    }
    function updateUI() {
        // $(`#${ctlPrefix}OutputTo`).val(settings.OutputTo);
        $(`#${ctlPrefix}IncludeInOutput`).val(settings.IncludeInOutput);
        $(`#${ctlPrefix}Street`).val(settings.StreetLockLevel);
        $(`#${ctlPrefix}PrimaryStreet`).val(settings.PrimaryStreetLockLevel);
        $(`#${ctlPrefix}MinorHighway`).val(settings.MinorHighwayLockLevel);
        $(`#${ctlPrefix}MajorHighway`).val(settings.MajorHighwayLockLevel);
        $(`#${ctlPrefix}Freeway`).val(settings.FreewayLockLevel);
        $(`#${ctlPrefix}Ramp`).val(settings.RampLockLevel);
        $(`#${ctlPrefix}Railroad`).val(settings.RailroadLockLevel);
        $(`#${ctlPrefix}Name`).val(settings.Regex || "");
        $(`#${ctlPrefix}IgnoreCase`).prop("checked", settings.RegexIgnoreCase);
        $(`#${ctlPrefix}City`).val(settings.CityRegex || "");
        $(`#${ctlPrefix}CityIgnoreCase`).prop("checked", settings.CityRegexIgnoreCase);
        $(`#${ctlPrefix}State`).val(settings.State);
        $(`#${ctlPrefix}RoadTypeStreet`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.Street);
        $(`#${ctlPrefix}RoadTypePrimary`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.PrimaryStreet);
        $(`#${ctlPrefix}RoadTypeMinorHighway`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.MinorHighway);
        $(`#${ctlPrefix}RoadTypeMajorHighway`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.MajorHighway);
        $(`#${ctlPrefix}RoadTypeRamp`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.Ramp);
        $(`#${ctlPrefix}RoadTypeFreeway`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.Freeway);
        $(`#${ctlPrefix}RoadTypeRailroad`).prop("checked", settings.RoadTypeMask & WMEWAL.RoadType.Railroad);
        $(`#${ctlPrefix}Editable`).prop("checked", settings.EditableByMe);
        $(`#${ctlPrefix}ExcludeRoundabouts`).prop("checked", settings.ExcludeRoundabouts);
        $(`#${ctlPrefix}ExcludeJunctionBoxes`).prop("checked", settings.ExcludeJunctionBoxes);
        $(`#${ctlPrefix}PlusOneWayStreet`).prop("checked", settings.PlusOneWayMask & WMEWAL.RoadType.Street);
        $(`#${ctlPrefix}PlusOneWayPS`).prop("checked", settings.PlusOneWayMask & WMEWAL.RoadType.PrimaryStreet);
        $(`#${ctlPrefix}PlusOneWayMinorH`).prop("checked", settings.PlusOneWayMask & WMEWAL.RoadType.MinorHighway);
        $(`#${ctlPrefix}PlusOneWayMajorH`).prop("checked", settings.PlusOneWayMask & WMEWAL.RoadType.MajorHighway);
        $(`#${ctlPrefix}PlusOneWayFW`).prop("checked", settings.PlusOneWayMask & WMEWAL.RoadType.Freeway);
        $(`#${ctlPrefix}PlusOneWayRamp`).prop("checked", settings.PlusOneWayMask & WMEWAL.RoadType.Ramp);
        $(`#${ctlPrefix}StateOp`).val(settings.StateOperation || Operation.Equal.toString());
        $(`#${ctlPrefix}IncludeAlt`).prop("checked", settings.IncludeAltNames);
    }
    function loadSetting() {
        let selectedSetting = parseInt($(`#${ctlPrefix}SavedSettings`).val());
        if (selectedSetting == null || isNaN(selectedSetting) || selectedSetting < 0 || selectedSetting > savedSettings.length) {
            return;
        }
        let savedSetting = savedSettings[selectedSetting].Setting;
        // settings.OutputTo = $(`#${ctlPrefix}OutputTo`).val();
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
        let s = getSettings();
        let mask = 0;
        $(`input[name=${ctlPrefix}RoadType]:checked`).each(function (ix, e) {
            mask = mask | parseInt(e.value);
        });
        if (mask === 0) {
            addMessage("Please select at least one road type.");
        }
        let selectedState = $(`#${ctlPrefix}State`).val();
        if (nullif(selectedState, "") !== null && s.State === null) {
            addMessage("Invalid state selection");
        }
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
        if (message.length > 0) {
            alert(pluginName + ": " + message);
            return false;
        }
        return true;
    }
    function saveSetting() {
        if (validateSettings()) {
            let s = getSettings();
            let sName = prompt("Enter a name for this setting");
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
            let savedSetting = {
                Name: sName,
                Setting: s
            };
            savedSettings.push(savedSetting);
            updateSavedSettings();
        }
    }
    function getSettings() {
        let s = {
            RoadTypeMask: null,
            State: null,
            Regex: null,
            RegexIgnoreCase: $(`#${ctlPrefix}IgnoreCase`).prop("checked"),
            ExcludeJunctionBoxes: $(`#${ctlPrefix}ExcludeJunctionBoxes`).prop("checked"),
            ExcludeRoundabouts: $(`#${ctlPrefix}ExcludeRoundabouts`).prop("checked"),
            EditableByMe: $(`#${ctlPrefix}Editable`).prop("checked"),
            StreetLockLevel: parseInt($(`#${ctlPrefix}Street`).val()),
            PrimaryStreetLockLevel: parseInt($(`#${ctlPrefix}PrimaryStreet`).val()),
            MinorHighwayLockLevel: parseInt($(`#${ctlPrefix}MinorHighway`).val()),
            MajorHighwayLockLevel: parseInt($(`#${ctlPrefix}MajorHighway`).val()),
            FreewayLockLevel: parseInt($(`#${ctlPrefix}Freeway`).val()),
            RampLockLevel: parseInt($(`#${ctlPrefix}Ramp`).val()),
            IncludeInOutput: parseInt($(`#${ctlPrefix}IncludeInOutput`).val()),
            PlusOneWayMask: 0,
            CityRegex: null,
            CityRegexIgnoreCase: $(`#${ctlPrefix}CityIgnoreCase`).prop("checked"),
            StateOperation: parseInt($(`#${ctlPrefix}StateOp`).val()),
            RailroadLockLevel: parseInt($(`#${ctlPrefix}Railroad`).val()),
            IncludeAltNames: $(`#${ctlPrefix}IncludeAlt`).prop("checked")
        };
        s.RoadTypeMask = 0;
        $(`input[name=${ctlPrefix}RoadType]:checked`).each(function (ix, e) {
            s.RoadTypeMask = s.RoadTypeMask | parseInt(e.value);
        });
        if ($(`#${ctlPrefix}PlusOneWayStreet`).prop("checked")) {
            s.PlusOneWayMask = s.PlusOneWayMask | WMEWAL.RoadType.Street;
        }
        if ($(`#${ctlPrefix}PlusOneWayPS`).prop("checked")) {
            s.PlusOneWayMask = s.PlusOneWayMask | WMEWAL.RoadType.PrimaryStreet;
        }
        if ($(`#${ctlPrefix}PlusOneWayMinorH`).prop("checked")) {
            s.PlusOneWayMask = s.PlusOneWayMask | WMEWAL.RoadType.MinorHighway;
        }
        if ($(`#${ctlPrefix}PlusOneWayMajorH`).prop("checked")) {
            s.PlusOneWayMask = s.PlusOneWayMask | WMEWAL.RoadType.MajorHighway;
        }
        if ($(`#${ctlPrefix}PlusOneWayFW`).prop("checked")) {
            s.PlusOneWayMask = s.PlusOneWayMask | WMEWAL.RoadType.Freeway;
        }
        if ($(`#${ctlPrefix}PlusOneWayRamp`).prop("checked")) {
            s.PlusOneWayMask = s.PlusOneWayMask | WMEWAL.RoadType.Ramp;
        }
        let selectedState = $(`#${ctlPrefix}State`).val();
        if (nullif(selectedState, "") !== null) {
            let state = W.model.states.getObjectById(parseInt(selectedState));
            if (state !== null) {
                s.State = state.getID();
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
        return s;
    }
    function deleteSetting() {
        let selectedSetting = parseInt($(`#${ctlPrefix}SavedSettings`).val());
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
        streets = [];
        savedSegments = [];
        if (allOk) {
            settings = getSettings();
            if (settings.State !== null) {
                state = W.model.states.getObjectById(settings.State);
                stateName = state.name;
            }
            else {
                state = null;
                stateName = null;
            }
            if (settings.Regex !== null) {
                nameRegex = (settings.RegexIgnoreCase ? new RegExp(settings.Regex, "i") : new RegExp(settings.Regex));
            }
            else {
                nameRegex = null;
            }
            if (settings.CityRegex !== null) {
                cityRegex = (settings.CityRegexIgnoreCase ? new RegExp(settings.CityRegex, "i") : new RegExp(settings.CityRegex));
            }
            else {
                cityRegex = null;
            }
            if (settings.RoadTypeMask & 1 || settings.RoadTypeMask & 4096) {
                WMEWAL_Locks.MinimumZoomLevel = 16;
            }
            else {
                WMEWAL_Locks.MinimumZoomLevel = 14;
            }
            updateSettings();
        }
        return allOk;
    }
    WMEWAL_Locks.ScanStarted = ScanStarted;
    function isOneWay(segment) {
        return segment.attributes.fwdDirection !== segment.attributes.revDirection && (segment.attributes.fwdDirection || segment.attributes.revDirection);
    }
    function ScanExtent(segments, venues) {
        return new Promise(resolve => {
            setTimeout(function () {
                let count = scan(segments);
                resolve({ Streets: count, Places: null, MapComments: null });
            });
        });
    }
    WMEWAL_Locks.ScanExtent = ScanExtent;
    function scan(segments) {
        let extentStreets = [];
        function addSegment(s, rId) {
            if (savedSegments.indexOf(s.getID()) === -1) {
                savedSegments.push(s.getID());
                let sid = s.attributes.primaryStreetID;
                let address = s.getAddress();
                let thisStreet = null;
                if (sid != null) {
                    // let street = W.model.streets.getObjectById(sid);
                    thisStreet = extentStreets.find(function (e) {
                        let matches = (e.id === sid && (e.lockLevel === (s.attributes.lockRank || 0) + 1) && e.roundaboutId === rId && e.roadType === s.attributes.roadType);
                        if (matches && (nameRegex != null || cityRegex != null)) {
                            // Test for alt names
                            for (let ixAlt = 0; ixAlt < e.altStreets.length && matches; ixAlt++) {
                                matches = false;
                                for (let ixSegAlt = 0; ixSegAlt < address.attributes.altStreets.length && !matches; ixSegAlt++) {
                                    if (e.altStreets[ixAlt].id === address.attributes.altStreets[ixSegAlt].id) {
                                        matches = true;
                                    }
                                }
                            }
                        }
                        return matches;
                    });
                }
                if (thisStreet == null) {
                    thisStreet = {
                        id: sid,
                        city: ((address && !address.attributes.isEmpty && address.attributes.city.hasName()) ? address.attributes.city.attributes.name : "No City"),
                        state: ((address && !address.attributes.isEmpty) ? address.attributes.state.name : "No State"),
                        name: ((address && !address.attributes.isEmpty && !address.attributes.street.isEmpty) ? address.attributes.street.name : "No street"),
                        geometries: new OpenLayers.Geometry.Collection(),
                        lockLevel: (s.attributes.lockRank || 0) + 1,
                        segments: [],
                        roundaboutId: rId,
                        altStreets: [],
                        roadType: s.attributes.roadType
                    };
                    if (settings.IncludeAltNames) {
                        if (s.attributes.streetIDs != null) {
                            for (let ixAlt = 0; ixAlt < s.attributes.streetIDs.length; ixAlt++) {
                                if (s.attributes.streetIDs[ixAlt] != null) {
                                    let altStreet = W.model.streets.getObjectById(s.attributes.streetIDs[ixAlt]);
                                    if (altStreet != null) {
                                        let altCityName = null;
                                        if (altStreet.cityID != null) {
                                            let altCity = W.model.cities.getObjectById(altStreet.cityID);
                                            if (altCity != null) {
                                                altCityName = altCity.hasName() ? altCity.attributes.name : "No city";
                                            }
                                        }
                                        thisStreet.altStreets.push({
                                            id: s.attributes.streetIDs[ixAlt],
                                            name: altStreet.name,
                                            city: altCityName
                                        });
                                    }
                                }
                            }
                        }
                    }
                    extentStreets.push(thisStreet);
                }
                thisStreet.segments.push({
                    id: s.attributes.id,
                    center: s.attributes.geometry.getCentroid()
                });
                thisStreet.geometries.addComponents([s.attributes.geometry.clone()]);
            }
        }
        for (let ix = 0; ix < segments.length; ix++) {
            let segment = segments[ix];
            if (segment != null) {
                if ((WMEWAL.WazeRoadTypeToRoadTypeBitmask(segment.attributes.roadType) & settings.RoadTypeMask) &&
                    (!settings.EditableByMe || segment.arePropertiesEditable()) &&
                    (!settings.ExcludeJunctionBoxes || !segment.isInBigJunction())) {
                    let address = segment.getAddress();
                    if (state != null) {
                        if (address != null && address.attributes != null && !address.attributes.isEmpty && address.attributes.state != null) {
                            if (settings.StateOperation === Operation.Equal && address.attributes.state.id !== state.id ||
                                settings.StateOperation === Operation.NotEqual && address.attributes.state.id === state.id) {
                                continue;
                            }
                        }
                        else if (settings.StateOperation === Operation.Equal) {
                            continue;
                        }
                    }
                    let plusOne = (isOneWay(segment) && (WMEWAL.WazeRoadTypeToRoadTypeBitmask(segment.attributes.roadType) & settings.PlusOneWayMask)) ? 1 : 0;
                    let incorrectLock = false;
                    let expectedLockRank = 0;
                    switch (segment.attributes.roadType) {
                        case 1:
                            if ((settings.IncludeInOutput & IncludeInOutput.Low && (segment.attributes.lockRank || 0) + 1 < settings.StreetLockLevel + plusOne) ||
                                (settings.IncludeInOutput & IncludeInOutput.High && (segment.attributes.lockRank || 0) + 1 > settings.StreetLockLevel + plusOne)) {
                                incorrectLock = true;
                            }
                            break;
                        case 2:
                            if ((settings.IncludeInOutput & IncludeInOutput.Low && (segment.attributes.lockRank || 0) + 1 < settings.PrimaryStreetLockLevel + plusOne) ||
                                (settings.IncludeInOutput & IncludeInOutput.High && (segment.attributes.lockRank || 0) + 1 > settings.PrimaryStreetLockLevel + plusOne)) {
                                incorrectLock = true;
                            }
                            break;
                        case 3:
                            if ((settings.IncludeInOutput & IncludeInOutput.Low && (segment.attributes.lockRank || 0) + 1 < settings.FreewayLockLevel + plusOne) ||
                                (settings.IncludeInOutput & IncludeInOutput.High && (segment.attributes.lockRank || 0) + 1 > settings.FreewayLockLevel + plusOne)) {
                                incorrectLock = true;
                            }
                            break;
                        case 4:
                            expectedLockRank = 0;
                            if (settings.RampLockLevel === 7) {
                                // Find lock rank of every connected segment
                                let fromSegments = segment.getConnectedSegments("from");
                                for (let ix = 0; ix < fromSegments.length; ix++) {
                                    if (fromSegments[ix].attributes.id !== segment.attributes.id && (fromSegments[ix].attributes.lockRank || 0) + 1 > expectedLockRank) {
                                        expectedLockRank = (fromSegments[ix].attributes.lockRank || 0) + 1;
                                    }
                                }
                                let toSegments = segment.getConnectedSegments("to");
                                for (let ix = 0; ix < toSegments.length; ix++) {
                                    if (toSegments[ix].attributes.id !== segment.attributes.id && (toSegments[ix].attributes.lockRank || 0) + 1 > expectedLockRank) {
                                        expectedLockRank = (toSegments[ix].attributes.lockRank || 0) + 1;
                                    }
                                }
                            }
                            else {
                                expectedLockRank = settings.RampLockLevel;
                            }
                            expectedLockRank += plusOne;
                            if ((settings.IncludeInOutput & IncludeInOutput.Low && (segment.attributes.lockRank || 0) + 1 < expectedLockRank) ||
                                (settings.IncludeInOutput & IncludeInOutput.High && (segment.attributes.lockRank || 0) + 1 > expectedLockRank)) {
                                incorrectLock = true;
                            }
                            break;
                        case 6:
                            if ((settings.IncludeInOutput & IncludeInOutput.Low && (segment.attributes.lockRank || 0) + 1 < settings.MajorHighwayLockLevel + plusOne) ||
                                (settings.IncludeInOutput & IncludeInOutput.High && (segment.attributes.lockRank || 0) + 1 > settings.MajorHighwayLockLevel + plusOne)) {
                                incorrectLock = true;
                            }
                            break;
                        case 7:
                            if ((settings.IncludeInOutput & IncludeInOutput.Low && (segment.attributes.lockRank || 0) + 1 < settings.MinorHighwayLockLevel + plusOne) ||
                                (settings.IncludeInOutput & IncludeInOutput.High && (segment.attributes.lockRank || 0) + 1 > settings.MinorHighwayLockLevel + plusOne)) {
                                incorrectLock = true;
                            }
                            break;
                        case 18:
                            if ((settings.IncludeInOutput & IncludeInOutput.Low && (segment.attributes.lockRank || 0) + 1 < settings.RailroadLockLevel + plusOne) ||
                                (settings.IncludeInOutput & IncludeInOutput.High && (segment.attributes.lockRank || 0) + 1 > settings.RailroadLockLevel + plusOne)) {
                                incorrectLock = true;
                            }
                            break;
                        default:
                            break;
                    }
                    if (!incorrectLock) {
                        continue;
                    }
                    if (nameRegex != null || cityRegex != null) {
                        let nameMatched = false;
                        if (address != null && address.attributes != null && !address.attributes.isEmpty) {
                            if (nameRegex != null && address.attributes.street != null) {
                                nameMatched = nameRegex.test(address.attributes.street.name);
                            }
                            if (!nameMatched && cityRegex != null && address.attributes.city != null && address.attributes.city.hasName()) {
                                nameMatched = cityRegex.test(address.attributes.city.attributes.name);
                            }
                            if (!nameMatched && segment.attributes.streetIDs != null) {
                                for (let streetIx = 0; streetIx < segment.attributes.streetIDs.length && !nameMatched; streetIx++) {
                                    if (segment.attributes.streetIDs[streetIx] != null) {
                                        let street = W.model.streets.getObjectById(segment.attributes.streetIDs[streetIx]);
                                        if (street != null) {
                                            if (nameRegex != null) {
                                                nameMatched = nameRegex.test(street.name);
                                            }
                                            if (!nameMatched && cityRegex != null && street.cityID != null) {
                                                let city = W.model.cities.getObjectById(street.cityID);
                                                if (city != null && city.hasName()) {
                                                    nameMatched = cityRegex.test(city.attributes.name);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (!nameMatched) {
                            continue;
                        }
                    }
                    if (!WMEWAL.IsSegmentInArea(segment)) {
                        continue;
                    }
                    if (!segment.isInRoundabout()) {
                        addSegment(segment, null);
                    }
                    else if (!settings.ExcludeRoundabouts) {
                        let r = segment.getRoundabout().attributes;
                        for (let rIx = 0; rIx < r.segIDs.length; rIx++) {
                            addSegment(W.model.segments.getObjectById(r.segIDs[rIx]), r.id);
                        }
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
    function ScanComplete() {
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
            let isCSV = (WMEWAL.outputTo & WMEWAL.OutputTo.CSV);
            let isTab = (WMEWAL.outputTo & WMEWAL.OutputTo.Tab);
            let addBOM = WMEWAL.addBOM ?? false;
            let lineArray;
            let columnArray;
            let w;
            let fileName;
            if (isCSV) {
                lineArray = [];
                columnArray = ["Name"];
                if (settings.IncludeAltNames) {
                    columnArray.push("Alt Names");
                }
                columnArray.push("City");
                columnArray.push("State");
                columnArray.push("Road Type");
                columnArray.push("Lock Level");
                columnArray.push("Latitude");
                columnArray.push("Longitude");
                columnArray.push("Permalink");
                lineArray.push(columnArray);
                fileName = "Locks_" + WMEWAL.areaName;
                for (let rt in WMEWAL.RoadType) {
                    if (WMEWAL.RoadType.hasOwnProperty(rt)) {
                        let mask = parseInt(rt);
                        if (!isNaN(mask) && settings.RoadTypeMask & mask) {
                            fileName += "_" + WMEWAL.RoadType[mask.toString()];
                        }
                    }
                }
                fileName += ".csv";
            }
            if (isTab) {
                w = window.open();
                w.document.write("<html><head><title>Locks</title></head><body>");
                w.document.write("<h3>Area: " + WMEWAL.areaName + "</h3>");
                w.document.write("<b>Filters</b>");
                w.document.write("<br/>Road Type(s): ");
                let comma = "";
                for (let rt in WMEWAL.RoadType) {
                    if (WMEWAL.RoadType.hasOwnProperty(rt)) {
                        let mask = parseInt(rt);
                        if (!isNaN(mask) && settings.RoadTypeMask & mask) {
                            w.document.write(comma + WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(mask)));
                            if (settings.PlusOneWayMask & mask) {
                                w.document.write(" (+1 for one-way)");
                            }
                            comma = ", ";
                        }
                    }
                }
                if (stateName != null) {
                    w.document.write("<br/>State " + (settings.StateOperation === Operation.NotEqual ? "does not equal " : "equals ") + stateName);
                }
                if (nameRegex != null) {
                    w.document.write("<br/>Name matches " + nameRegex.source);
                    if (settings.RegexIgnoreCase) {
                        w.document.write(" (ignoring case)");
                    }
                }
                if (cityRegex != null) {
                    w.document.write("</br/>City name matches " + cityRegex.source);
                    if (settings.CityRegexIgnoreCase) {
                        w.document.write(" (ignoring case)");
                    }
                }
                if (settings.ExcludeRoundabouts) {
                    w.document.write("<br/>Roundabouts excluded");
                }
                if (settings.ExcludeJunctionBoxes) {
                    w.document.write("<br/>Junction boxes excluded");
                }
                if (settings.EditableByMe) {
                    w.document.write("<br/>Editable by me");
                }
                w.document.write("</p><table style='border-collapse: separate; border-spacing: 8px 0px'><tr><th>Name</th>");
                if (settings.IncludeAltNames) {
                    w.document.write("<th>Alt Names</th>");
                }
                w.document.write("<th>City</th><th>State</th>");
                w.document.write("<th>Road Type</th><th>Lock Level</th><th>Latitude</th><th>Longitude</th><th>Permalink</th></tr>");
            }
            for (let ixStreet = 0; ixStreet < streets.length; ixStreet++) {
                let street = streets[ixStreet];
                let roadTypeText = WMEWAL.TranslateRoadType(street.roadType);
                if (street.name == null && street.roundaboutId == null) {
                    for (let ixSeg = 0; ixSeg < street.segments.length; ixSeg++) {
                        let segment = street.segments[ixSeg];
                        let latlon = OpenLayers.Layer.SphericalMercator.inverseMercator(segment.center.x, segment.center.y);
                        let plSeg = getSegmentPL(segment);
                        if (isCSV) {
                            columnArray = [getStreetName(street)];
                            if (settings.IncludeAltNames) {
                                columnArray.push("");
                            }
                            columnArray.push("\"" + street.city + "\"");
                            columnArray.push("\"" + street.state + "\"");
                            columnArray.push("\"" + roadTypeText + "\"");
                            columnArray.push(street.lockLevel.toString());
                            columnArray.push(latlon.lat.toString());
                            columnArray.push(latlon.lon.toString());
                            columnArray.push("\"" + plSeg + "\"");
                            lineArray.push(columnArray);
                        }
                        if (isTab) {
                            w.document.write("<tr><td>" + getStreetName(street) + "</td>");
                            if (settings.IncludeAltNames) {
                                w.document.write("<td>&nbsp;</td>");
                            }
                            w.document.write("<td>" + street.city + "</td>");
                            w.document.write("<td>" + street.state + "</td>");
                            w.document.write("<td>" + roadTypeText + "</td><td>" + street.lockLevel + "</td>" +
                                "<td>" + latlon.lat.toString() + "</td><td>" + latlon.lon.toString() + "</td>" +
                                "<td><a href=\'" + plSeg + "\' target=\'_blank\'>Permalink</a></td></tr>");
                        }
                    }
                }
                else {
                    let latlon = OpenLayers.Layer.SphericalMercator.inverseMercator(street.center.x, street.center.y);
                    let plStreet = getStreetPL(street);
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
                        columnArray = ["\"" + getStreetName(street) + "\""];
                        if (settings.IncludeAltNames) {
                            columnArray.push("\"" + altNames + "\"");
                        }
                        columnArray.push("\"" + street.city + "\"");
                        columnArray.push("\"" + street.state + "\"");
                        columnArray.push("\"" + roadTypeText + "\"");
                        columnArray.push(street.lockLevel.toString());
                        columnArray.push(latlon.lat.toString());
                        columnArray.push(latlon.lon.toString());
                        columnArray.push("\"" + plStreet + "\"");
                        lineArray.push(columnArray);
                    }
                    if (isTab) {
                        w.document.write("<tr><td>" + getStreetName(street) + "</td>");
                        if (settings.IncludeAltNames) {
                            w.document.write("<td>" + altNames + "</td>");
                        }
                        w.document.write("<td>" + street.city + "</td>");
                        w.document.write("<td>" + street.state + "</td>");
                        w.document.write("<td>" + roadTypeText + "</td><td>" + street.lockLevel + "</td>" +
                            "<td>" + latlon.lat.toString() + "</td><td>" + latlon.lon.toString() + "</td>" +
                            "<td><a href=\'" + plStreet + "\' target=\'_blank\'>Permalink</a></td></tr>");
                    }
                }
            }
            if (isCSV) {
                let csvContent = lineArray.join("\n");
                let blobContent = [];
                if (addBOM) {
                    blobContent.push('\uFEFF');
                }
                blobContent.push(csvContent);
                let blob = new Blob(blobContent, { type: "data:text/csv;charset=utf-8" });
                let link = document.createElement("a");
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                let node = document.body.appendChild(link);
                link.click();
                document.body.removeChild(node);
            }
            if (isTab) {
                w.document.write("</table></body></html>");
                w.document.close();
                w = null;
            }
        }
        savedSegments = null;
        streets = null;
    }
    WMEWAL_Locks.ScanComplete = ScanComplete;
    function ScanCancelled() {
        ScanComplete();
    }
    WMEWAL_Locks.ScanCancelled = ScanCancelled;
    function getStreetPL(street) {
        let latlon = OpenLayers.Layer.SphericalMercator.inverseMercator(street.center.x, street.center.y);
        let url = WMEWAL.GenerateBasePL(latlon.lat, latlon.lon, WMEWAL.zoomLevel) + "&segments=";
        for (let ix = 0; ix < street.segments.length; ix++) {
            if (ix > 0) {
                url += ",";
            }
            url += street.segments[ix].id;
        }
        return url;
    }
    function getSegmentPL(segment) {
        let latlon = OpenLayers.Layer.SphericalMercator.inverseMercator(segment.center.x, segment.center.y);
        return WMEWAL.GenerateBasePL(latlon.lat, latlon.lon, 5) + segment.id;
    }
    function getStreetName(street) {
        return street.name || "No street";
    }
    function Init() {
        console.group(pluginName + ": Initializing");
        initCount++;
        let allOK = true;
        let objectToCheck = [
            "W.app",
            "W.model.states",
            "OpenLayers",
            "WMEWAL.RegisterPlugIn",
            "WazeWrap.Ready"
        ];
        for (let i = 0; i < objectToCheck.length; i++) {
            let path = objectToCheck[i].split(".");
            let object = window;
            let ok = true;
            for (let j = 0; j < path.length; j++) {
                object = object[path[j]];
                if (typeof object === "undefined" || object == null) {
                    console.warn(objectToCheck[i] + " NOT OK");
                    ok = false;
                    break;
                }
            }
            if (ok) {
                console.log(objectToCheck[i] + " OK");
            }
            else {
                allOK = false;
            }
        }
        if (!allOK) {
            if (initCount < 60) {
                console.groupEnd();
                window.setTimeout(Init, 1000);
            }
            else {
                console.error("Giving up on initialization");
                console.groupEnd();
            }
            return;
        }
        // Check to see if WAL is at the minimum verson needed
        if (!(typeof WMEWAL.IsAtMinimumVersion === "function" && WMEWAL.IsAtMinimumVersion(minimumWALVersionRequired))) {
            log("log", "WAL not at required minimum version.");
            console.groupEnd();
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
                    log("debug", "decompressFromUTF16 failed, attempting decompress");
                    localStorage[savedSettingsKey + "Backup"] = localStorage[savedSettingsKey];
                    try {
                        savedSettings = JSON.parse(WMEWAL.LZString.decompress(localStorage[savedSettingsKey]));
                    }
                    catch (e) { }
                    if (typeof savedSettings === "undefined" || savedSettings === null) {
                        log("debug", "decompress failed, savedSettings unrecoverable. Using blank");
                        savedSettings = [];
                    }
                    updateSavedSettings();
                }
            }
        }
        if (settings == null) {
            settings = {
                RoadTypeMask: WMEWAL.RoadType.Freeway,
                State: null,
                Regex: null,
                RegexIgnoreCase: true,
                ExcludeRoundabouts: false,
                ExcludeJunctionBoxes: true,
                EditableByMe: true,
                StreetLockLevel: 1,
                PrimaryStreetLockLevel: 2,
                MinorHighwayLockLevel: 3,
                MajorHighwayLockLevel: 4,
                FreewayLockLevel: 5,
                RampLockLevel: 7,
                IncludeInOutput: IncludeInOutput.Low | IncludeInOutput.High,
                PlusOneWayMask: 0,
                CityRegex: null,
                CityRegexIgnoreCase: true,
                StateOperation: Operation.Equal,
                RailroadLockLevel: 2,
                IncludeAltNames: false
            };
        }
        else {
            if (updateProperties()) {
                updateSettings();
            }
        }
        console.log("Initialized");
        console.groupEnd();
        WazeWrap.Interface.ShowScriptUpdate(scrName, Version, updateText, greasyForkPage, wazeForumThread);
        WMEWAL.RegisterPlugIn(WMEWAL_Locks);
    }
    function updateProperties() {
        let upd = false;
        if (settings !== null) {
            if (!settings.hasOwnProperty("RailroadLockLevel")) {
                settings.RailroadLockLevel = 2;
                upd = true;
            }
            if (!settings.hasOwnProperty("IncludeAltNames")) {
                settings.IncludeAltNames = false;
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
    function log(level, message) {
        let t = new Date();
        switch (level.toLocaleLowerCase()) {
            case "debug":
            case "verbose":
                console.debug(`${scrName} ${t.toISOString()}: ${message}`);
                break;
            case "info":
            case "information":
                console.info(`${scrName} ${t.toISOString()}: ${message}`);
                break;
            case "warning":
            case "warn":
                console.warn(`${scrName} ${t.toISOString()}: ${message}`);
                break;
            case "error":
                console.error(`${scrName} ${t.toISOString()}: ${message}`);
                break;
            case "log":
                console.log(`${scrName} ${t.toISOString()}: ${message}`);
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
    Init();
})(WMEWAL_Locks || (WMEWAL_Locks = {}));
