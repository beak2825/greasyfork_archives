/// <reference path="../typescript-typings/globals/openlayers/index.d.ts" />
/// <reference path="../typescript-typings/I18n.d.ts" />
/// <reference path="../typescript-typings/waze.d.ts" />
/// <reference path="../typescript-typings/globals/jquery/index.d.ts" />
/// <reference path="WME Wide-Angle Lens.user.ts" />
/// <reference path="../typescript-typings/greasyfork.d.ts" />
// ==UserScript==
// @name                WME Wide-Angle Lens Map Comments Beta
// @namespace           https://greasyfork.org/en/users/19861-vtpearce
// @description         Find map comments that match filter criteria
// @author              vtpearce and crazycaveman
// @include             https://www.waze.com/editor
// @include             /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version             1.1.0
// @grant               none
// @copyright           2020 vtpearce
// @license             CC BY-SA 4.0
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/418294/WME%20Wide-Angle%20Lens%20Map%20Comments%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/418294/WME%20Wide-Angle%20Lens%20Map%20Comments%20Beta.meta.js
// ==/UserScript==
/*global W, OL, $, WazeWrap, WMEWAL, OpenLayers, I18n */
var WMEWAL_MapComments;
(function (WMEWAL_MapComments) {
    const scrName = GM_info.script.name;
    const Version = GM_info.script.version;
    const updateText = '<ul>' +
        '<li>Return count of map comments found</li>' +
        '</ul>';
    const greasyForkPage = 'https://greasyfork.org/scripts/40644';
    const wazeForumThread = 'https://www.waze.com/forum/viewtopic.php?t=206376';
    const ctlPrefix = "_wmewalMapComments";
    const minimumWALVersionRequired = "1.5.3";
    let Operation;
    (function (Operation) {
        Operation[Operation["Equal"] = 1] = "Equal";
        Operation[Operation["NotEqual"] = 2] = "NotEqual";
        Operation[Operation["LessThan"] = 3] = "LessThan";
        Operation[Operation["LessThanOrEqual"] = 4] = "LessThanOrEqual";
        Operation[Operation["GreaterThan"] = 5] = "GreaterThan";
        Operation[Operation["GreaterThanOrEqual"] = 6] = "GreaterThanOrEqual";
    })(Operation || (Operation = {}));
    let pluginName = "WMEWAL-MapComments";
    WMEWAL_MapComments.Title = "Map Comments";
    WMEWAL_MapComments.MinimumZoomLevel = 12;
    WMEWAL_MapComments.SupportsSegments = false;
    WMEWAL_MapComments.SupportsVenues = false;
    let settingsKey = "WMEWALMapCommentsSettings";
    let savedSettingsKey = "WMEWALMapCommentsSavedSettings";
    let settings = null;
    let savedSettings = [];
    let mapComments;
    let titleRegex = null;
    let commentRegex = null;
    let lastModifiedBy;
    let lastModifiedByName;
    let createdBy;
    let createdByName;
    let mc = null;
    let initCount = 0;
    function GetTab() {
        let html = "<table style='border-collapse: separate; border-spacing:0px 1px;'>";
        html += "<tbody>";
        // html += "<tr><td class='wal-heading'>Output To:</td></tr>";
        // html += "<tr><td style='padding-left:20px'>" +
        //     `<select id='${ctlPrefix}OutputTo'>` +
        //     "<option value='csv'>CSV File</option>" +
        //     "<option value='tab'>Browser Tab</option>" +
        //     "<option value='both'>Both CSV File and Browser Tab</option></select></td></tr>";
        html += "<tr><td class='wal-heading'>Saved Filters</td></tr>";
        html += "<tr><td class='wal-indent' style='padding-bottom: 8px'>" +
            `<select id='${ctlPrefix}SavedSettings'></select><br/>` +
            `<button class='btn btn-primary' id='${ctlPrefix}LoadSetting' title='Load'>Load</button>` +
            `<button class='btn btn-primary' style='margin-left: 4px;' id='${ctlPrefix}SaveSetting' title='Save'>Save</button>` +
            `<button class='btn btn-primary' style='margin-left: 4px;' id='${ctlPrefix}DeleteSetting' title='Delete'>Delete</button></td></tr>`;
        html += "<tr><td class='wal-heading' style='border-top: 1px solid; padding-top: 4px'>Filters (All Of These)</td></tr>";
        html += "<tr><td><b>Lock Level:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
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
            "<option value='6'>6</option></select></td></tr>";
        html += "<tr><td><b>Title RegEx:</b></td></tr>";
        html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}Title' class='wal-textbox'/><br/>` +
            `<input id='${ctlPrefix}TitleIgnoreCase' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}TitleIgnoreCase' class='wal-label'>Ignore case</label></td></tr>`;
        html += "<tr><td><b>Comments RegEx:</b></td></tr>";
        html += `<tr><td class='wal-indent'><input type='text' id='${ctlPrefix}Comments' class='wal-textbox'/><br/>` +
            `<input id='${ctlPrefix}CommentsIgnoreCase' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}CommentsIgnoreCase' class='wal-label'>Ignore case</label></td></tr>`;
        html += "<tr><td><b>Created By:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<select id='${ctlPrefix}CreatedBy'></select></td></tr>`;
        html += "<tr><td><b>Last Updated By:</b></td></tr>";
        html += "<tr><td class='wal-indent'>" +
            `<select id='${ctlPrefix}LastModifiedBy'></select></td></tr>`;
        html += "<tr><td><b>Geometry Type:</b></td></tr>" +
            `<tr><td class='wal-indent'><select id='${ctlPrefix}GeometryType'>` +
            "<option value=''></option>" +
            "<option value='area'>" + I18n.t("edit.venue.type.area") + "</option>" +
            "<option value='point'>" + I18n.t("edit.venue.type.point") + "</option>" +
            "</select></td></tr>";
        html += `<tr><td><input id='${ctlPrefix}Expiration' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}Expiration' class='wal-label'>Expires:</label> ` +
            `<select id='${ctlPrefix}ExpirationOp'>` +
            `<option value='${Operation.LessThan}'>&lt;</option>` +
            `<option value='${Operation.LessThanOrEqual}'>&lt;=</option>` +
            `<option value='${Operation.GreaterThanOrEqual}'>&gt;=</option>` +
            `<option value='${Operation.GreaterThan}'>&gt;</option></select></td></tr>`;
        html += `<tr><td class='wal-indent'><input type='date' id='${ctlPrefix}ExpirationDate' class='wal-textbox'/></td></tr>`;
        html += `<tr><td><input id='${ctlPrefix}Editable' type='checkbox' class='wal-check'/>` +
            `<label for='${ctlPrefix}Editable' class='wal-label'>Editable by me</label></td></tr>`;
        html += "</tbody></table>";
        return html;
    }
    WMEWAL_MapComments.GetTab = GetTab;
    function TabLoaded() {
        updateUsers($(`#${ctlPrefix}LastModifiedBy`));
        updateUsers($(`#${ctlPrefix}CreatedBy`));
        updateUI();
        updateSavedSettingsList();
        $(`#${ctlPrefix}LastModifiedBy`).on("focus", function () {
            updateUsers($(`#${ctlPrefix}LastModifiedBy`));
        });
        $(`#${ctlPrefix}CreatedBy`).on("focus", function () {
            updateUsers($(`#${ctlPrefix}CreatedBy`));
        });
        $(`#${ctlPrefix}LoadSetting`).on("click", loadSetting);
        $(`#${ctlPrefix}SaveSetting`).on("click", saveSetting);
        $(`#${ctlPrefix}DeleteSetting`).on("click", deleteSetting);
    }
    WMEWAL_MapComments.TabLoaded = TabLoaded;
    function updateUsers(selectUsernameList) {
        // Preserve current selection
        let currentId = parseInt(selectUsernameList.val());
        selectUsernameList.empty();
        let userObjs = [];
        userObjs.push({ id: null, name: "" });
        for (let uo in W.model.users.objects) {
            if (W.model.users.objects.hasOwnProperty(uo)) {
                let u = W.model.users.getObjectById(parseInt(uo));
                if (u.type === "user" && u.userName !== null && typeof u.userName !== "undefined") {
                    userObjs.push({ id: u.id, name: u.userName });
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
            let o = userObjs[ix];
            let userOption = $("<option/>").text(o.name).attr("value", o.id);
            if (currentId != null && o.id == null) {
                userOption.attr("selected", "selected");
            }
            selectUsernameList.append(userOption);
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
        $(`#${ctlPrefix}LockLevel`).val(settings.LockLevel);
        $(`#${ctlPrefix}LockLevelOp`).val(settings.LockLevelOperation || Operation.Equal.toString());
        $(`#${ctlPrefix}Title`).val(settings.TitleRegex || "");
        $(`#${ctlPrefix}TitleIgnoreCase`).prop("checked", settings.TitleRegexIgnoreCase);
        $(`#${ctlPrefix}Comments`).val(settings.CommentRegex || "");
        $(`#${ctlPrefix}CommentsIgnoreCase`).prop("checked", settings.CommentRegexIgnoreCase);
        $(`#${ctlPrefix}Editable`).prop("checked", settings.EditableByMe);
        $(`#${ctlPrefix}LastModifiedBy`).val(settings.LastModifiedBy);
        $(`#${ctlPrefix}CreatedBy`).val(settings.CreatedBy);
        $(`#${ctlPrefix}Expiration`).prop("checked", settings.Expiration);
        $(`#${ctlPrefix}ExpirationOp`).val(settings.ExpirationOperation);
        if (settings.ExpirationDate != null) {
            let expirationDate = new Date(settings.ExpirationDate);
            $(`#${ctlPrefix}ExpirationDate`).val(expirationDate.getFullYear().toString().padStart(4, "0") + "-" +
                (expirationDate.getMonth() + 1).toString().padStart(2, "0") + "-" + expirationDate.getDate().toString().padStart(2, "0"));
        }
        else {
            $(`#${ctlPrefix}ExpirationDate`).val("");
        }
        $(`#${ctlPrefix}GeometryType`).val(settings.GeometryType);
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
    function validateSettings() {
        function addMessage(error) {
            message += ((message.length > 0 ? "\n" : "") + error);
        }
        let message = "";
        let s = getSettings();
        let selectedUpdateUser = $(`#${ctlPrefix}LastModifiedBy`).val();
        if (nullif(selectedUpdateUser, "") !== null && s.LastModifiedBy === null) {
            addMessage("Invalid last updated user");
        }
        let selectedCreateUser = $(`#${ctlPrefix}CreatedBy`).val();
        if (nullif(selectedCreateUser, "") !== null && s.CreatedBy === null) {
            addMessage("Invalid created by user");
        }
        let r;
        if (nullif(s.TitleRegex, "") !== null) {
            try {
                r = (s.TitleRegexIgnoreCase ? new RegExp(s.TitleRegex, "i") : new RegExp(s.TitleRegex));
            }
            catch (error) {
                addMessage("Title RegEx is invalid");
            }
        }
        if (nullif(s.CommentRegex, "") !== null) {
            try {
                r = (s.CommentRegexIgnoreCase ? new RegExp(s.CommentRegex, "i") : new RegExp(s.CommentRegex));
            }
            catch (error) {
                addMessage("Comments RegEx is invalid");
            }
        }
        if (s.Expiration && s.ExpirationDate === null) {
            addMessage("Select an expiration date on which to filter");
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
            LockLevel: null,
            LockLevelOperation: parseInt($(`#${ctlPrefix}LockLevelOp`).val()),
            TitleRegex: null,
            TitleRegexIgnoreCase: $(`#${ctlPrefix}TitleIgnoreCase`).prop("checked"),
            CommentRegex: null,
            CommentRegexIgnoreCase: $(`#${ctlPrefix}CommentsIgnoreCase`).prop("checked"),
            EditableByMe: $(`#${ctlPrefix}Editable`).prop("checked"),
            LastModifiedBy: null,
            GeometryType: nullif($(`#${ctlPrefix}GeometryType`).val(), ""),
            Expiration: $(`#${ctlPrefix}Expiration`).prop("checked"),
            ExpirationOperation: parseInt($(`#${ctlPrefix}ExpirationOp`).val()),
            ExpirationDate: null,
            CreatedBy: null
        };
        let selectedUpdateUser = $(`#${ctlPrefix}LastModifiedBy`).val();
        if (nullif(selectedUpdateUser, "") !== null) {
            s.LastModifiedBy = W.model.users.getObjectById(selectedUpdateUser).id;
        }
        let selectedCreateUser = $(`#${ctlPrefix}CreatedBy`).val();
        if (nullif(selectedCreateUser, "") !== null) {
            s.CreatedBy = W.model.users.getObjectById(selectedCreateUser).id;
        }
        let pattern = $(`#${ctlPrefix}Title`).val();
        if (nullif(pattern, "") !== null) {
            s.TitleRegex = pattern;
        }
        pattern = $(`#${ctlPrefix}Comments`).val();
        if (nullif(pattern, "") !== null) {
            s.CommentRegex = pattern;
        }
        let selectedLockLevel = $(`#${ctlPrefix}LockLevel`).val();
        if (nullif(selectedLockLevel, "") !== null) {
            s.LockLevel = parseInt(selectedLockLevel);
        }
        let expirationDate = $(`#${ctlPrefix}ExpirationDate`).val();
        if (nullif(expirationDate, "") !== null) {
            switch (s.ExpirationOperation) {
                case Operation.LessThan:
                case Operation.GreaterThanOrEqual:
                    expirationDate += " 00:00";
                    break;
                case Operation.LessThanOrEqual:
                case Operation.GreaterThan:
                    expirationDate += " 23:59:59";
                    break;
            }
            s.ExpirationDate = new Date(expirationDate).getTime();
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
        if (allOk) {
            mapComments = [];
            mc = [];
            settings = getSettings();
            if (settings.LastModifiedBy !== null) {
                lastModifiedBy = W.model.users.getObjectById(settings.LastModifiedBy);
                lastModifiedByName = lastModifiedBy.userName;
            }
            else {
                lastModifiedBy = null;
                lastModifiedByName = null;
            }
            if (settings.CreatedBy !== null) {
                createdBy = W.model.users.getObjectById(settings.CreatedBy);
                createdByName = createdBy.userName;
            }
            else {
                createdBy = null;
                createdByName = null;
            }
            if (settings.TitleRegex !== null) {
                titleRegex = (settings.TitleRegexIgnoreCase ? new RegExp(settings.TitleRegex, "i") : new RegExp(settings.TitleRegex));
            }
            else {
                titleRegex = null;
            }
            if (settings.CommentRegex !== null) {
                commentRegex = (settings.CommentRegexIgnoreCase ? new RegExp(settings.CommentRegex, "i") : new RegExp(settings.CommentRegex));
            }
            else {
                commentRegex = null;
            }
            updateSettings();
        }
        return allOk;
    }
    WMEWAL_MapComments.ScanStarted = ScanStarted;
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
    function getPL(mapComment, lonlat) {
        return WMEWAL.GenerateBasePL(lonlat.lat, lonlat.lon, 5) + "&mode=0&mapComments=" + mapComment.id;
    }
    function ScanExtent(segments, venues) {
        return new Promise(resolve => {
            setTimeout(function () {
                let count = scan(segments, venues);
                resolve({ Streets: null, Places: null, MapComments: count });
            }, 0);
        });
    }
    WMEWAL_MapComments.ScanExtent = ScanExtent;
    function scan(segments, venues) {
        for (let c in W.model.mapComments.objects) {
            if (mc.indexOf(c) === -1) {
                let mapComment = W.model.mapComments.getObjectById(c);
                if (mapComment != null) {
                    mc.push(c);
                    if ((settings.LockLevel == null ||
                        (settings.LockLevelOperation === Operation.Equal && (mapComment.attributes.lockRank || 0) + 1 === settings.LockLevel) ||
                        (settings.LockLevelOperation === Operation.NotEqual && (mapComment.attributes.lockRank || 0) + 1 !== settings.LockLevel)) &&
                        (!settings.EditableByMe || mapComment.arePropertiesEditable()) &&
                        (settings.GeometryType == null || (settings.GeometryType === "point" && mapComment.isPoint()) || (settings.GeometryType === "area" && !mapComment.isPoint())) &&
                        (titleRegex == null || titleRegex.test(mapComment.attributes.subject)) &&
                        ((settings.LastModifiedBy === null) ||
                            ((mapComment.getUpdatedBy() ?? mapComment.getCreatedBy()) === settings.LastModifiedBy)) &&
                        ((settings.CreatedBy === null) ||
                            (mapComment.getCreatedBy() === settings.CreatedBy))) {
                        if (settings.Expiration) {
                            if (mapComment.attributes.endDate === null) {
                                // If map comment doesn't have an end date, it automatically matches any greater than (or equal) filter
                                // and automatically fails any less than (or equal) filter
                                if (settings.ExpirationOperation === Operation.LessThan || settings.ExpirationOperation === Operation.LessThanOrEqual) {
                                    continue;
                                }
                            }
                            else {
                                let endDateNumber = Date.parse(mapComment.attributes.endDate);
                                if (isNaN(endDateNumber)) {
                                    continue;
                                }
                                let expirationMatches;
                                switch (settings.ExpirationOperation) {
                                    case Operation.LessThan:
                                        expirationMatches = (endDateNumber < settings.ExpirationDate);
                                        break;
                                    case Operation.LessThanOrEqual:
                                        expirationMatches = (endDateNumber <= settings.ExpirationDate);
                                        break;
                                    case Operation.GreaterThanOrEqual:
                                        expirationMatches = (endDateNumber >= settings.ExpirationDate);
                                        break;
                                    case Operation.GreaterThan:
                                        expirationMatches = (endDateNumber > settings.ExpirationDate);
                                        break;
                                    default:
                                        expirationMatches = false;
                                        break;
                                }
                                if (!expirationMatches) {
                                    continue;
                                }
                            }
                        }
                        // if (settings.LastModifiedBy != null) {
                        //     if (mapComment.attributes.updatedBy != null) {
                        //         if (mapComment.attributes.updatedBy !== settings.LastModifiedBy) {
                        //             continue;
                        //         }
                        //     } else if (mapComment.attributes.createdBy !== settings.LastModifiedBy) {
                        //         continue;
                        //     }
                        // }
                        if (settings.CommentRegex != null) {
                            let match = false;
                            match = commentRegex.test(mapComment.attributes.body);
                            let comments = mapComment.getComments();
                            for (let ixComment = 0; ixComment < comments.length; ixComment++ && !match) {
                                match = commentRegex.test(comments.models[ixComment].attributes.text);
                            }
                            if (!match) {
                                continue;
                            }
                        }
                        if (!WMEWAL.IsMapCommentInArea(mapComment)) {
                            continue;
                        }
                        let lastEditorID = mapComment.getUpdatedBy() ?? mapComment.getCreatedBy();
                        let lastEditor = W.model.users.getObjectById(lastEditorID) ?? { userName: 'Not found' };
                        let endDate = null;
                        let expirationDate = mapComment.attributes.endDate;
                        if (expirationDate != null) {
                            endDate = Date.parse(expirationDate);
                            if (isNaN(endDate)) {
                                endDate = null;
                            }
                        }
                        let mComment = {
                            id: mapComment.attributes.id,
                            geometryType: ((mapComment.isPoint()) ? I18n.t("edit.venue.type.point") : I18n.t("edit.venue.type.area")),
                            lastEditor: (lastEditor && lastEditor.userName) || "",
                            title: mapComment.attributes.subject,
                            lockLevel: mapComment.attributes.lockRank + 1,
                            expirationDate: endDate,
                            center: mapComment.attributes.geometry.getCentroid(),
                            createdOn: mapComment.attributes.createdOn,
                            updatedOn: mapComment.attributes.updatedOn
                        };
                        mapComments.push(mComment);
                    }
                }
            }
        }
        return mapComments.length;
    }
    function ScanComplete() {
        if (mapComments.length === 0) {
            alert(pluginName + ": No map comments found.");
        }
        else {
            mapComments.sort(function (a, b) {
                return a.title.localeCompare(b.title);
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
                columnArray = ["Title,Lock Level,Geometry Type,Expiration Date,Last Editor,Created On,Updated On,Latitude,Longitude,Permalink"];
                lineArray.push(columnArray);
                fileName = "MapComments" + WMEWAL.areaName;
                fileName += ".csv";
            }
            if (isTab) {
                w = window.open();
                w.document.write("<html><head><title>Map Comments</title></head><body>");
                w.document.write("<h2>Area: " + WMEWAL.areaName + "</h2>");
                w.document.write("<b>Filters</b>");
                if (settings.LockLevel != null) {
                    w.document.write("<br/>Lock Level " + (settings.LockLevelOperation === Operation.NotEqual ? "does not equal " : "equals ") + settings.LockLevel.toString());
                }
                if (settings.TitleRegex != null) {
                    w.document.write("<br/>Title matches " + settings.TitleRegex);
                    if (settings.TitleRegexIgnoreCase) {
                        w.document.write(" (ignoring case)");
                    }
                }
                if (settings.CommentRegex != null) {
                    w.document.write("<br/>Comment matches " + settings.CommentRegex);
                    if (settings.CommentRegexIgnoreCase) {
                        w.document.write(" (ignoring case)");
                    }
                }
                if (settings.GeometryType != null) {
                    w.document.write("<br/>Geometry type is " + I18n.t("edit.landmark.type." + settings.GeometryType));
                }
                if (settings.Expiration) {
                    w.document.write("Expires ");
                    switch (settings.ExpirationOperation) {
                        case Operation.LessThan:
                            w.document.write("before");
                            break;
                        case Operation.LessThanOrEqual:
                            w.document.write("on or before");
                            break;
                        case Operation.GreaterThanOrEqual:
                            w.document.write("on or after");
                            break;
                        case Operation.GreaterThan:
                            w.document.write("after");
                            break;
                    }
                    w.document.write(` ${new Date(settings.ExpirationDate).toString()}`);
                }
                if (settings.CreatedBy != null) {
                    w.document.write("<br/>Created by " + createdByName);
                }
                if (settings.LastModifiedBy != null) {
                    w.document.write("<br/>Last updated by " + lastModifiedByName);
                }
                if (settings.EditableByMe) {
                    w.document.write("<br/>Editable by me");
                }
                w.document.write("<table style='border-collapse: separate; border-spacing: 8px 0px'><thead><tr><th>Title</th><th>Lock Level</th><th>Geometry Type</th><th>Expiration Date</th>");
                w.document.write("<th>Last Editor</th><th>Created On</th><th>Updated On</th><th>Latitude</th><th>Longitude</th><th>Permalink</th></tr><thead><tbody>");
            }
            for (let ixmc = 0; ixmc < mapComments.length; ixmc++) {
                let mapComment = mapComments[ixmc];
                let lonlat = OpenLayers.Layer.SphericalMercator.inverseMercator(mapComment.center.x, mapComment.center.y);
                let pl = getPL(mapComment, lonlat);
                let expirationDate = "";
                if (mapComment.expirationDate != null) {
                    expirationDate = new Date(mapComment.expirationDate).toLocaleString();
                }
                if (isCSV) {
                    columnArray = ["\"" + mapComment.title + "\"", mapComment.lockLevel.toString(), mapComment.geometryType, "\"" + expirationDate + "\"", "\"" + mapComment.lastEditor + "\"",
                        mapComment.createdOn ? new Date(mapComment.createdOn).toLocaleString() : "",
                        mapComment.updatedOn ? new Date(mapComment.updatedOn).toLocaleString() : "",
                        lonlat.lat.toString(), lonlat.lon.toString(), "\"" + pl + "\""];
                    lineArray.push(columnArray);
                }
                if (isTab) {
                    w.document.write("<tr><td>" + mapComment.title + "</td><td>" + mapComment.lockLevel.toString() + "</td>");
                    w.document.write("<td>" + mapComment.geometryType + "</td>");
                    w.document.write("<td>" + expirationDate + "</td>");
                    w.document.write("<td>" + mapComment.lastEditor + "</td>");
                    w.document.write("<td>" + (mapComment.createdOn ? new Date(mapComment.createdOn).toLocaleString() : "&nbsp;") + "</td>");
                    w.document.write("<td>" + (mapComment.updatedOn ? new Date(mapComment.updatedOn).toLocaleString() : "&nbsp;") + "</td>");
                    w.document.write("<td>" + lonlat.lat.toString() + "</td>");
                    w.document.write("<td>" + lonlat.lon.toString() + "</td>");
                    w.document.write("<td><a href=\'" + pl + "\' target=\'_blank\'>Permalink</a></td></tr>");
                }
            }
            if (isCSV) {
                let csvContent = lineArray.join("\n");
                let blobContent = [];
                if (addBOM) {
                    blobContent.push('\uFEFF');
                }
                blobContent.push(csvContent);
                var blob = new Blob(blobContent, { type: "data:text/csv;charset=utf-8" });
                let link = document.createElement("a");
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                let node = document.body.appendChild(link);
                link.click();
                document.body.removeChild(node);
            }
            if (isTab) {
                w.document.write("</tbody></table></body></html>");
                w.document.close();
                w = null;
            }
        }
        mapComments = null;
        mc = null;
    }
    WMEWAL_MapComments.ScanComplete = ScanComplete;
    function ScanCancelled() {
        ScanComplete();
    }
    WMEWAL_MapComments.ScanCancelled = ScanCancelled;
    function Init() {
        console.group(pluginName + ": Initializing");
        initCount++;
        let allOK = true;
        let objectToCheck = ["OpenLayers",
            "W.app",
            "WMEWAL.RegisterPlugIn",
            "WazeWrap.Ready"];
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
                    if (typeof savedSettings === "undefined" || savedSettings === null || savedSettings.length === 0) {
                        log("debug", "decompress failed, savedSettings unrecoverable. Using blank");
                        savedSettings = [];
                    }
                    updateSavedSettings();
                }
            }
        }
        if (settings == null) {
            settings = {
                TitleRegex: null,
                TitleRegexIgnoreCase: true,
                CommentRegex: null,
                CommentRegexIgnoreCase: true,
                GeometryType: null,
                ExpirationDate: null,
                LockLevel: null,
                LockLevelOperation: Operation.Equal,
                LastModifiedBy: null,
                EditableByMe: true,
                Expiration: false,
                ExpirationOperation: Operation.GreaterThanOrEqual,
                CreatedBy: null
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
        WMEWAL.RegisterPlugIn(WMEWAL_MapComments);
    }
    function updateProperties() {
        let upd = false;
        if (settings !== null) {
            if (!settings.hasOwnProperty("CreatedBy")) {
                settings.CreatedBy = null;
                upd = true;
            }
            if (!settings.hasOwnProperty("ExpirationOperation")) {
                settings.ExpirationOperation = Operation.GreaterThanOrEqual;
                upd = true;
            }
            if (!settings.hasOwnProperty("Expiration")) {
                settings.Expiration = (settings.ExpirationDate !== null);
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
    function nullif(s, nullVal) {
        if (s !== null && s === nullVal) {
            return null;
        }
        return s;
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
    Init();
})(WMEWAL_MapComments || (WMEWAL_MapComments = {}));
