/// <reference path="../typescript-typings/globals/openlayers/index.d.ts" />
/// <reference path="../typescript-typings/waze.d.ts" />
/// <reference path="../typescript-typings/globals/jquery/index.d.ts" />
/// <reference path="WME Wide-Angle Lens.user.ts" />
/// <reference path="../typescript-typings/greasyfork.d.ts" />
// ==UserScript==
// @name                WME Wide-Angle Lens Cities Beta
// @namespace           https://greasyfork.org/en/users/19861-vtpearce
// @description         Find streets whose city doesn't match the boundaries of a polygon layer
// @author              vtpearce and crazycaveman
// @include             https://www.waze.com/editor
// @include             /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version             1.3.0
// @grant               none
// @copyright           2020 vtpearce
// @license             CC BY-SA 4.0
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/418296/WME%20Wide-Angle%20Lens%20Cities%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/418296/WME%20Wide-Angle%20Lens%20Cities%20Beta.meta.js
// ==/UserScript==
/*global W, OL, $, WazeWrap, WMEWAL, OpenLayers */
var WMEWAL_Cities;
(function (WMEWAL_Cities) {
    const scrName = GM_info.script.name;
    const Version = GM_info.script.version;
    const updateText = '<ul>' +
        '<li>Return count of streets found</li>' +
        '</ul>';
    const greasyForkPage = 'https://greasyfork.org/scripts/40642';
    const wazeForumThread = 'https://www.waze.com/forum/viewtopic.php?t=206376';
    const ctlPrefix = "_wmewalCities";
    const minimumWALVersionRequired = "1.5.3";
    let Operation;
    (function (Operation) {
        Operation[Operation["Equal"] = 1] = "Equal";
        Operation[Operation["NotEqual"] = 2] = "NotEqual";
    })(Operation || (Operation = {}));
    let pluginName = "WMEWAL-Cities";
    WMEWAL_Cities.Title = "Cities";
    WMEWAL_Cities.MinimumZoomLevel = 14;
    WMEWAL_Cities.SupportsSegments = true;
    WMEWAL_Cities.SupportsVenues = false;
    let settingsKey = "WMEWALCitiesSettings";
    let savedSettingsKey = "WMEWALCitiesSavedSettings";
    let settings = null;
    let savedSettings = [];
    let streets = null;
    let state;
    let stateName;
    let cityRegex = null;
    let cityPolygons = null;
    let initCount = 0;
    let savedSegments;
    function GetTab() {
        let html = "<table style='border-collapse: separate; border-spacing:0px 1px;'>";
        html += "<tbody>";
        html += "<tr><td class='wal-heading'><b>Saved Filters</b></td></tr>";
        html += "<tr><td class='wal-indent' style='padding-bottom: 8px'>" +
            `<select id='${ctlPrefix}SavedSettings'></select><br/>` +
            `<button class='btn btn-primary' id='${ctlPrefix}LoadSetting' title='Load'>Load</button>` +
            `<button class='btn btn-primary' style='margin-left: 4px;' id='${ctlPrefix}SaveSetting' title='Save'>Save</button>` +
            `<button class='btn btn-primary' style='margin-left: 4px;' id='${ctlPrefix}DeleteSetting' title='Delete'>Delete</button></td></tr>`;
        html += "<tr><td class='wal-heading' style='border-top: 1px solid'>Output Options</td></tr>";
        html += `<tr><td class='wal-indent'><input type='checkbox' class='wal-check' id='${ctlPrefix}IncludeAlt'>` +
            `<label for='${ctlPrefix}IncludeAlt' class='wal-label'>Include Alt Names</label></td></tr>`;
        html += "<tr><td class='wal-heading' style='border-top: 1px solid; padding-top: 4px;'><b>Settings</b></td></tr>";
        html += "<tr><td><b>Polygon Layer:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<select id='${ctlPrefix}Layer'></select>` +
            "</td></tr>";
        html += `<tr><td><input id='${ctlPrefix}IgnoreAlt' type='checkbox' class='wal-check' checked='checked'/>` +
            `<label for='${ctlPrefix}IgnoreAlt' class='wal-label'>Only check primary name</label></td></tr>`;
        html += "<tr><td class='wal-heading' style='border-top: 1px solid; padding-top: 4px;'><b>Filters</b></td></tr>";
        html += "<tr><td><b>City RegEx:</b></td></tr>";
        html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}City' class='wal-textbox'/><br/>` +
            `<input id='${ctlPrefix}CityIgnoreCase' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}CityIgnoreCase' class='wal-label'>Ignore case</label></td></tr>`;
        html += "<tr><td><b>State:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<select id='${ctlPrefix}StateOp'>` +
            "<option value='" + Operation.Equal.toString() + "' selected='selected'>=</option>" +
            "<option value='" + Operation.NotEqual.toString() + "'>&lt;&gt;</option></select>" +
            `<select id='${ctlPrefix}State'></select></td></tr>`;
        html += "<tr><td><b>Road Type:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<button id='${ctlPrefix}RoadTypeAny' class='btn btn-primary' style='margin-right: 8px' title='Any'>Any</button>` +
            `<button id='${ctlPrefix}RoadTypeClear' class='btn btn-primary' title='Clear'>Clear</button>` +
            `<div><input type='checkbox' class='wal-check' checked='checked' id='${ctlPrefix}RoadTypeFreeway' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Freeway}'/>` +
            `<label for='${ctlPrefix}RoadTypeFreeway' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Freeway))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeRamp' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Ramp}'/>` +
            `<label for='${ctlPrefix}RoadTypeRamp' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Ramp))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeMajorHighway' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.MajorHighway}'/>` +
            `<label for='${ctlPrefix}RoadTypeMajorHighway' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.MajorHighway))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeMinorHighway' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.MinorHighway}'/>` +
            `<label for='${ctlPrefix}RoadTypeMinorHighway' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.MinorHighway))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypePrimary' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.PrimaryStreet}'/>` +
            `<label for='${ctlPrefix}RoadTypePrimary' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.PrimaryStreet))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeStreet' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Street}'/>` +
            `<label for='${ctlPrefix}RoadTypeStreet' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Street))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeAlley' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Alley}'/>` +
            `<label for='${ctlPrefix}RoadTypeAlley' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Alley))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeUnpaved' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Unpaved}'/>` +
            `<label for='${ctlPrefix}RoadTypeUnpaved' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Unpaved))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypePLR' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.ParkingLotRoad}'/>` +
            `<label for='${ctlPrefix}RoadTypePLR' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.ParkingLotRoad))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypePrivate' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.PrivateRoad}'/>` +
            `<label for='${ctlPrefix}RoadTypePrivate' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.PrivateRoad))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeFerry' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Ferry}'/>` +
            `<label for='${ctlPrefix}RoadTypeFerry' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Ferry))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeWT' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.WalkingTrail}'/>` +
            `<label for='${ctlPrefix}RoadTypeWT' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.WalkingTrail))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypePB' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.PedestrianBoardwalk}'/>` +
            `<label for='${ctlPrefix}RoadTypePB' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.PedestrianBoardwalk))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeStairway' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Stairway}'/>` +
            `<label for='${ctlPrefix}RoadTypeStairway' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Stairway))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeRR' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.Railroad}'/>` +
            `<label for='${ctlPrefix}RoadTypeRR' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.Railroad))}</label></div>` +
            `<div><input type='checkbox' class='wal-check' id='${ctlPrefix}RoadTypeRT' data-group='${ctlPrefix}RoadType' value='${WMEWAL.RoadType.RunwayTaxiway}'/>` +
            `<label for='${ctlPrefix}RoadTypeRT' class='wal-label'>${WMEWAL.TranslateRoadType(WMEWAL.RoadTypeBitmaskToWazeRoadType(WMEWAL.RoadType.RunwayTaxiway))}</label></div>` +
            "</td></tr>";
        html += `<tr><td><input id='${ctlPrefix}Editable' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}Editable' class='wal-label'>Editable by me</label></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}ExcludeJunctionBoxes' type='checkbox' class='wal-check' checked='checked'/>` +
            `<label for='${ctlPrefix}ExcludeJunctionBoxes' class='wal-label'>Exclude Junction Boxes</label></td></tr>`;
        html += "</tbody></table>";
        return html;
    }
    WMEWAL_Cities.GetTab = GetTab;
    function TabLoaded() {
        updateStates();
        updateLayers();
        updateUI();
        updateSavedSettingsList();
        $(`#${ctlPrefix}State`).on("focus", updateStates);
        $(`#${ctlPrefix}Layer`).on("focus", updateLayers);
        $(`#${ctlPrefix}RoadTypeAny`).on("click", function () {
            $(`input[data-group=${ctlPrefix}RoadType]`).prop("checked", true);
        });
        $(`#${ctlPrefix}RoadTypeClear`).on("click", function () {
            $(`input[data-group=${ctlPrefix}RoadType]`).prop("checked", false);
        });
        $(`#${ctlPrefix}LoadSetting`).on("click", loadSetting);
        $(`#${ctlPrefix}SaveSetting`).on("click", saveSetting);
        $(`#${ctlPrefix}DeleteSetting`).on("click", deleteSetting);
    }
    WMEWAL_Cities.TabLoaded = TabLoaded;
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
    function updateLayers() {
        let selectLayer = $(`#${ctlPrefix}Layer`);
        let currentLayer = selectLayer.val();
        selectLayer.empty();
        let layers = [];
        for (let ixLayer = 0; ixLayer < W.map.layers.length; ixLayer++) {
            let layer = W.map.layers[ixLayer];
            if (layer.CLASS_NAME === "OL.Layer.Vector" || layer.CLASS_NAME === "OpenLayers.Layer.Vector") {
                let vectorLayer = layer;
                if (vectorLayer.features && vectorLayer.features.length > 0) {
                    layers.push({
                        uniqueName: vectorLayer.uniqueName,
                        name: vectorLayer.name
                    });
                }
            }
        }
        layers.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        for (let ix = 0; ix < layers.length; ix++) {
            let l = layers[ix];
            let layerOption = $("<option/>").text(l.name).attr("value", l.uniqueName);
            if (currentLayer != null && currentLayer === l.uniqueName) {
                layerOption.attr("selected", "selected");
            }
            selectLayer.append(layerOption);
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
        $(`#${ctlPrefix}City`).val(settings.CityRegex || "");
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
        $(`#${ctlPrefix}ExcludeJunctionBoxes`).prop("checked", settings.ExcludeJunctionBoxes);
        $(`#${ctlPrefix}Layer`).val(settings.PolygonLayerUniqueName);
        $(`#${ctlPrefix}IgnoreAlt`).prop("checked", settings.IgnoreAlt);
        $(`#${ctlPrefix}IncludeAlt`).prop("checked", settings.IncludeAltNames);
    }
    function loadSetting() {
        let selectedSetting = parseInt($(`#${ctlPrefix}SavedSettings`).val());
        if (selectedSetting == null || isNaN(selectedSetting) || selectedSetting < 0 || selectedSetting > savedSettings.length) {
            return;
        }
        let savedSetting = savedSettings[selectedSetting].Setting;
        for (let name in savedSetting) {
            if (settings.hasOwnProperty(name)) {
                settings[name] = savedSetting[name];
            }
        }
        updateUI();
    }
    function validateSettings(checkArea = true) {
        function addMessage(error) {
            message += ((message.length > 0 ? "\n" : "") + error);
        }
        let message = "";
        let s = getSettings();
        let mask = 0;
        $(`input[data-group=${ctlPrefix}RoadType]:checked`).each(function (ix, e) {
            mask = mask | parseInt(e.value);
        });
        if (mask === 0) {
            addMessage("Please select at least one road type");
        }
        let selectedState = $(`#${ctlPrefix}State`).val();
        if (nullif(selectedState, "") !== null && s.State === null) {
            addMessage("Invalid state selection");
        }
        let r = null;
        if (nullif(s.CityRegex, "") !== null) {
            try {
                r = (s.CityRegexIgnoreCase ? new RegExp(s.CityRegex, "i") : new RegExp(s.CityRegex));
            }
            catch (error) {
                addMessage("City RegEx is invalid");
                r == null;
            }
        }
        let layerUniqueName = $(`#${ctlPrefix}Layer`).val();
        if (nullif(layerUniqueName, "") !== null) {
            let layers = W.map.getLayersBy("uniqueName", layerUniqueName);
            if (layers.length === 0) {
                addMessage("Could not find layer.");
            }
            else if (layers.length > 1) {
                addMessage("More than one layer found");
            }
            else if (checkArea) {
                cityPolygons = [];
                for (let ixFeature = 0; ixFeature < layers[0].features.length; ixFeature++) {
                    let feature = layers[0].features[ixFeature];
                    let featureName = null;
                    if (feature.style && nullif(feature.style.label, "") !== null) {
                        featureName = feature.style.label;
                    }
                    else if (feature.attributes) {
                        if (nullif(feature.attributes.name, "") !== null) {
                            featureName = feature.attributes.name;
                        }
                        else if (nullif(feature.attributes.labelText, "") !== null) {
                            featureName = feature.attributes.labelText;
                        }
                    }
                    if (featureName !== null) {
                        if (r !== null) {
                            log("info", "Checking to see if " + featureName + " matches the city regex.");
                            if (!r.test(featureName)) {
                                continue;
                            }
                        }
                        log("info", "Checking to see if " + featureName + " is in area");
                        if (feature.geometry.intersects(WMEWAL.areaToScan)) {
                            cityPolygons.push({
                                name: featureName,
                                geometry: feature.geometry.clone(),
                                compressedName: featureName.replace(/\s/g, "")
                            });
                        }
                    }
                }
                if (cityPolygons.length === 0) {
                    addMessage("No features in the layer have an appropriate label to use as City Name and are in the scanned area");
                }
            }
        }
        else {
            addMessage("Please select a layer containing City polygons");
        }
        if (message.length > 0) {
            alert(pluginName + ": " + message);
            return false;
        }
        return true;
    }
    function saveSetting() {
        if (validateSettings(false)) {
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
            RoadTypeMask: 0,
            State: null,
            StateOperation: parseInt($(`#${ctlPrefix}StateOp`).val()),
            ExcludeJunctionBoxes: $(`#${ctlPrefix}ExcludeJunctionBoxes`).prop("checked"),
            EditableByMe: $(`#${ctlPrefix}Editable`).prop("checked"),
            CityRegex: null,
            CityRegexIgnoreCase: $(`#${ctlPrefix}CityIgnoreCase`).prop("checked"),
            PolygonLayerUniqueName: $(`#${ctlPrefix}Layer`).val(),
            IgnoreAlt: $(`#${ctlPrefix}IgnoreAlt`).prop("checked"),
            IncludeAltNames: $(`#${ctlPrefix}IncludeAlt`).prop("checked")
        };
        $(`input[data-group=${ctlPrefix}RoadType]:checked`).each(function (ix, e) {
            s.RoadTypeMask = s.RoadTypeMask | parseInt(e.value);
        });
        let selectedState = $(`#${ctlPrefix}State`).val();
        if (nullif(selectedState, "") !== null) {
            let state = W.model.states.getObjectById(selectedState);
            if (state !== null) {
                s.State = state.id;
            }
        }
        let pattern = $(`#${ctlPrefix}City`).val();
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
        log("debug", "ScanStarted started.");
        savedSegments = [];
        streets = [];
        let allOk = validateSettings(true);
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
            if (settings.CityRegex !== null) {
                cityRegex = (settings.CityRegexIgnoreCase ? new RegExp(settings.CityRegex, "i") : new RegExp(settings.CityRegex));
            }
            if (settings.RoadTypeMask & ~(WMEWAL.RoadType.Freeway | WMEWAL.RoadType.MajorHighway | WMEWAL.RoadType.MinorHighway | WMEWAL.RoadType.PrimaryStreet | WMEWAL.RoadType.Ramp)) {
                WMEWAL_Cities.MinimumZoomLevel = 16;
            }
            else {
                WMEWAL_Cities.MinimumZoomLevel = 14;
            }
            updateSettings();
        }
        return allOk;
    }
    WMEWAL_Cities.ScanStarted = ScanStarted;
    function ScanExtent(segments, venues) {
        log("debug", "ScanExtent: started.");
        return new Promise(resolve => {
            setTimeout(function () {
                let count = scan(segments);
                resolve({ Streets: count, Places: null, MapComments: null });
            }, 0);
        });
    }
    WMEWAL_Cities.ScanExtent = ScanExtent;
    function scan(segments) {
        log("debug", "scan: started.");
        let extentStreets = [];
        let segment;
        let spaceRegex = /\s/g;
        function addSegment(s, incorrectCity, cityShouldBe, rId) {
            if (savedSegments.indexOf(s.getID()) === -1) {
                savedSegments.push(s.getID());
                let sid = s.attributes.primaryStreetID;
                let address = s.getAddress();
                let thisStreet = null;
                if (sid != null) {
                    thisStreet = extentStreets.find(function (e) {
                        let matches = (e.id === sid && (e.lockLevel === (s.attributes.lockRank | 0) + 1) && e.roundaboutId === rId && e.roadType === s.attributes.roadType);
                        if (matches) {
                            // Test for alt names
                            for (let ixAlt = 0; ixAlt < e.altStreets.length && matches; ixAlt++) {
                                matches = false;
                                for (let ixSegAlt = 0; ixSegAlt < s.attributes.streetIDs.length && !matches; ixSegAlt++) {
                                    if (e.altStreets[ixAlt].id === s.attributes.streetIDs[ixSegAlt]) {
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
                        state: ((address && !address.attributes.isEmpty) ? address.attributes.state.name : "No State"),
                        name: ((address && !address.attributes.isEmpty && !address.attributes.street.isEmpty) ? address.attributes.street.name : "No street"),
                        geometries: new OpenLayers.Geometry.Collection(),
                        lockLevel: (s.attributes.lockRank || 0) + 1,
                        segments: [],
                        roundaboutId: rId,
                        altStreets: [],
                        roadType: s.attributes.roadType,
                        incorrectCity: incorrectCity,
                        cityShouldBe: cityShouldBe,
                        city: null
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
        // Possibly change this
        for (let ix = 0; ix < segments.length; ix++) {
            segment = segments[ix];
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
                    let altCityNames = [];
                    if (!settings.IgnoreAlt) {
                        if (segment.attributes.streetIDs != null) {
                            for (let streetIx = 0; streetIx < segment.attributes.streetIDs.length; streetIx++) {
                                if (segment.attributes.streetIDs[streetIx] != null) {
                                    let street = W.model.streets.getObjectById(segment.attributes.streetIDs[streetIx]);
                                    if (street != null) {
                                        if (street.cityID != null) {
                                            let city = W.model.cities.getObjectById(street.cityID);
                                            if (city != null) {
                                                altCityNames.push({
                                                    hasName: city.hasName(),
                                                    name: city.hasName() ? city.attributes.name : null,
                                                    compressedName: city.hasName() ? city.attributes.name.replace(spaceRegex, "") : null
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (cityRegex != null) {
                        let nameMatched = false;
                        if (address.attributes != null && !address.attributes.isEmpty) {
                            if (address.attributes.city != null && address.attributes.city.hasName()) {
                                nameMatched = cityRegex.test(address.attributes.city.attributes.name);
                            }
                            if (!nameMatched) {
                                for (let altIx = 0; altIx < altCityNames.length && !nameMatched; altIx++) {
                                    if (altCityNames[altIx].hasName) {
                                        nameMatched = cityRegex.test(altCityNames[altIx].name);
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
                    let cityMatches = true;
                    let cityNames = [];
                    let cityShouldBe = "";
                    let incorrectCity = "";
                    let anyBlankCity = false;
                    if (address.attributes != null && address.attributes.city && address.attributes.city.hasName()) {
                        cityNames.push({
                            hasName: true,
                            name: address.attributes.city.attributes.name,
                            compressedName: address.attributes.city.attributes.name.replace(spaceRegex, "")
                        });
                    }
                    else {
                        anyBlankCity = true;
                    }
                    for (let ixAlt = 0; ixAlt < altCityNames.length; ixAlt++) {
                        if (altCityNames[ixAlt].hasName) {
                            if (cityNames.find(function (c) {
                                return c.compressedName === altCityNames[ixAlt].compressedName;
                            })) {
                                cityNames.push({
                                    hasName: true,
                                    name: altCityNames[ixAlt].name,
                                    compressedName: altCityNames[ixAlt].name.replace(spaceRegex, "")
                                });
                            }
                        }
                        else {
                            anyBlankCity = true;
                        }
                    }
                    if (cityNames.length > 0) {
                        // Check to see if it's in any of the city polygons that are referenced
                        for (let ixCityName = 0; ixCityName < cityNames.length && cityMatches; ixCityName++) {
                            let foundAny = false;
                            for (let ixCity = 0; ixCity < cityPolygons.length && cityMatches; ixCity++) {
                                if (cityNames[ixCityName].compressedName === cityPolygons[ixCity].compressedName) {
                                    foundAny = true;
                                    if (!cityPolygons[ixCity].geometry.intersects(segment.geometry)) {
                                        incorrectCity = cityNames[ixCityName].name;
                                        cityShouldBe = "No City";
                                        cityMatches = false;
                                    }
                                }
                            }
                            if (!foundAny) {
                                incorrectCity = cityNames[ixCityName].name;
                                cityShouldBe = "No matching city polygon";
                                cityMatches = false;
                            }
                        }
                    }
                    if (anyBlankCity && cityMatches) {
                        // No city names listed, so check to see if it's inside any of the city polygons
                        for (let ixCity = 0; ixCity < cityPolygons.length && cityMatches; ixCity++) {
                            if (cityPolygons[ixCity].geometry.intersects(segment.geometry)) {
                                incorrectCity = "No City";
                                cityShouldBe = cityPolygons[ixCity].name;
                                cityMatches = false;
                            }
                        }
                    }
                    if (cityMatches) {
                        continue;
                    }
                    if (!segment.isInRoundabout()) {
                        addSegment(segment, incorrectCity, cityShouldBe, null);
                    }
                    else {
                        let r = segment.getRoundabout().attributes;
                        for (let rIx = 0; rIx < r.segIDs.length; rIx++) {
                            addSegment(W.model.segments.getObjectById(r.segIDs[rIx]), incorrectCity, cityShouldBe, r.id);
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
        log("debug", "scan: done");
        return streets.length;
    }
    function ScanComplete() {
        log("debug", "ScanComplete: started.");
        cityPolygons = null;
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
                columnArray.push("State");
                columnArray.push("Road Type");
                columnArray.push("Lock Level");
                columnArray.push("Incorrect City");
                columnArray.push("City Should Be");
                columnArray.push("Latitude");
                columnArray.push("Longitude");
                columnArray.push("Permalink");
                lineArray.push(columnArray);
                fileName = "Cities_" + WMEWAL.areaName + ".csv";
            }
            if (isTab) {
                w = window.open();
                w.document.write("<html><head><title>Cities</title></head><body>");
                w.document.write("<h3>Area: " + WMEWAL.areaName + "</h3>");
                w.document.write("<b>Filters</b>");
                if (cityRegex != null) {
                    w.document.write("<br/>City Name matches " + cityRegex.source);
                    if (settings.CityRegexIgnoreCase) {
                        w.document.write(" (ignoring case)");
                    }
                }
                if (stateName != null) {
                    w.document.write("<br/>State " + (settings.StateOperation === Operation.NotEqual ? "does not equal " : "equals ") + stateName);
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
                w.document.write("<th>State</th>");
                w.document.write("<th>Road Type</th><th>Lock Level</th>");
                w.document.write("<th>Incorrect City</th><th>City Should Be</th>");
                w.document.write("<th>Latitude</th><th>Longitude</th><th>Permalink</th></tr>");
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
                            columnArray.push("\"" + street.state + "\"");
                            columnArray.push("\"" + roadTypeText + "\"");
                            columnArray.push(street.lockLevel.toString());
                            columnArray.push("\"" + street.incorrectCity + "\"");
                            columnArray.push("\"" + street.cityShouldBe + "\"");
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
                            w.document.write("<td>" + street.state + "</td>");
                            w.document.write("<td>" + roadTypeText + "</td><td>" + street.lockLevel + "</td>");
                            w.document.write("<td>" + street.incorrectCity + "</td><td>" + street.cityShouldBe + "</td>");
                            w.document.write("<td>" + latlon.lat.toString() + "</td><td>" + latlon.lon.toString() + "</td>" +
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
                        columnArray.push("\"" + street.state + "\"");
                        columnArray.push("\"" + roadTypeText + "\"");
                        columnArray.push(street.lockLevel.toString());
                        columnArray.push("\"" + street.incorrectCity + "\"");
                        columnArray.push("\"" + street.cityShouldBe + "\"");
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
                        w.document.write("<td>" + street.state + "</td>");
                        w.document.write("<td>" + roadTypeText + "</td><td>" + street.lockLevel + "</td>");
                        w.document.write("<td>" + street.incorrectCity + "</td><td>" + street.cityShouldBe + "</td>");
                        w.document.write("<td>" + latlon.lat.toString() + "</td><td>" + latlon.lon.toString() + "</td>" +
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
        streets = null;
        savedSegments = null;
    }
    WMEWAL_Cities.ScanComplete = ScanComplete;
    function ScanCancelled() {
        log("debug", "ScanCancelled: started.");
        ScanComplete();
    }
    WMEWAL_Cities.ScanCancelled = ScanCancelled;
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
        return WMEWAL.GenerateBasePL(latlon.lat, latlon.lon, 5) + "&segments=" + segment.id;
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
                window.setTimeout(Init, 1000);
            }
            else {
                console.error("Giving up on initialization");
            }
            console.groupEnd();
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
                        log("debug", "decompress failed, savedSetting unrecoverable. Using blank");
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
                StateOperation: Operation.Equal,
                ExcludeJunctionBoxes: true,
                EditableByMe: true,
                CityRegex: null,
                CityRegexIgnoreCase: true,
                PolygonLayerUniqueName: null,
                IgnoreAlt: false,
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
        WMEWAL.RegisterPlugIn(WMEWAL_Cities);
    }
    function updateProperties() {
        let upd = false;
        if (settings !== null) {
            if (!settings.hasOwnProperty("IgnoreAlt")) {
                settings.IgnoreAlt = false;
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
})(WMEWAL_Cities || (WMEWAL_Cities = {}));
