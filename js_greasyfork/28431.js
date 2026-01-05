/// <reference path="../typescript-typings/globals/openlayers/index.d.ts" />
/// <reference path="../typescript-typings/I18n.d.ts" />
/// <reference path="../typescript-typings/waze.d.ts" />
/// <reference path="../typescript-typings/globals/jquery/index.d.ts" />
/// <reference path="WME Wide-Angle Lens.user.ts" />
/// <reference path="../typescript-typings/greasyfork.d.ts" />
// ==UserScript==
// @name                WME Wide-Angle Lens Map Comments
// @namespace           https://greasyfork.org/en/users/19861-vtpearce
// @description         Find map comments that match filter criteria
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
// @downloadURL https://update.greasyfork.org/scripts/40644/WME%20Wide-Angle%20Lens%20Map%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/40644/WME%20Wide-Angle%20Lens%20Map%20Comments.meta.js
// ==/UserScript==
// @updateURL           https://greasyfork.org/scripts/418294-wme-wide-angle-lens-map-comments-beta/code/WME%20Wide-Angle%20Lens%20Map%20Comments.meta.js
// @downloadURL         https://greasyfork.org/scripts/418294-wme-wide-angle-lens-map-comments-beta/code/WME%20Wide-Angle%20Lens%20Map%20Comments.user.js
/*global W, OL, $, WazeWrap, WMEWAL, OpenLayers, I18n */
var WMEWAL_MapComments;
(function (WMEWAL_MapComments) {
    const SCRIPT_NAME = GM_info.script.name;
    const SCRIPT_VERSION = GM_info.script.version.toString();
    const DOWNLOAD_URL = GM_info.script.downloadURL;
    const updateText = '<ul>'
        + '<li>Update for plugin status.</li>'
        + '</ul>';
    const greasyForkPage = 'https://greasyfork.org/scripts/40644';
    const wazeForumThread = 'https://www.waze.com/forum/viewtopic.php?t=206376';
    const ctlPrefix = "_wmewalMapComments";
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
    const pluginName = "WMEWAL-MapComments";
    WMEWAL_MapComments.Title = "Map Comments";
    WMEWAL_MapComments.MinimumZoomLevel = 12;
    WMEWAL_MapComments.SupportsSegments = false;
    WMEWAL_MapComments.SupportsVenues = false;
    const settingsKey = "WMEWALMapCommentsSettings";
    const savedSettingsKey = "WMEWALMapCommentsSavedSettings";
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
                    if (typeof savedSettings === "undefined" || savedSettings === null || savedSettings.length === 0) {
                        log('warn', "decompress failed, savedSettings unrecoverable. Using blank");
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
        log('log', "Initialized");
        WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, SCRIPT_VERSION, updateText, greasyForkPage, wazeForumThread);
        WMEWAL.RegisterPlugIn(WMEWAL_MapComments);
    }
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
            const expirationDate = new Date(settings.ExpirationDate);
            $(`#${ctlPrefix}ExpirationDate`).val(expirationDate.getFullYear().toString().padStart(4, "0") + "-" +
                (expirationDate.getMonth() + 1).toString().padStart(2, "0") + "-" + expirationDate.getDate().toString().padStart(2, "0"));
        }
        else {
            $(`#${ctlPrefix}ExpirationDate`).val("");
        }
        $(`#${ctlPrefix}GeometryType`).val(settings.GeometryType);
    }
    function loadSetting() {
        const selectedSetting = parseInt($(`#${ctlPrefix}SavedSettings`).val());
        if (selectedSetting == null || isNaN(selectedSetting) || selectedSetting < 0 || selectedSetting > savedSettings.length) {
            return;
        }
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
        const selectedUpdateUser = $(`#${ctlPrefix}LastModifiedBy`).val();
        if (nullif(selectedUpdateUser, "") !== null && s.LastModifiedBy === null) {
            addMessage("Invalid last updated user");
        }
        const selectedCreateUser = $(`#${ctlPrefix}CreatedBy`).val();
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
        const selectedUpdateUser = $(`#${ctlPrefix}LastModifiedBy`).val();
        if (nullif(selectedUpdateUser, "") !== null) {
            s.LastModifiedBy = W.model.users.getObjectById(selectedUpdateUser).getAttribute('id');
        }
        const selectedCreateUser = $(`#${ctlPrefix}CreatedBy`).val();
        if (nullif(selectedCreateUser, "") !== null) {
            s.CreatedBy = W.model.users.getObjectById(selectedCreateUser).getAttribute('id');
        }
        let pattern = $(`#${ctlPrefix}Title`).val();
        if (nullif(pattern, "") !== null) {
            s.TitleRegex = pattern;
        }
        pattern = $(`#${ctlPrefix}Comments`).val();
        if (nullif(pattern, "") !== null) {
            s.CommentRegex = pattern;
        }
        const selectedLockLevel = $(`#${ctlPrefix}LockLevel`).val();
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
        if (allOk) {
            mapComments = [];
            mc = [];
            settings = getSettings();
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
                resolve({ ID: 'MC', count });
            }, 0);
        });
    }
    WMEWAL_MapComments.ScanExtent = ScanExtent;
    function scan(segments, venues) {
        for (let c in W.model.mapComments.objects) {
            if (mc.indexOf(c) === -1) {
                const mapComment = W.model.mapComments.getObjectById(c);
                if (mapComment != null) {
                    mc.push(c);
                    if ((settings.LockLevel == null ||
                        (settings.LockLevelOperation === Operation.Equal && (mapComment.getAttribute('lockRank') || 0) + 1 === settings.LockLevel) ||
                        (settings.LockLevelOperation === Operation.NotEqual && (mapComment.getAttribute('lockRank') || 0) + 1 !== settings.LockLevel)) &&
                        (!settings.EditableByMe || mapComment.arePropertiesEditable()) &&
                        (settings.GeometryType == null || (settings.GeometryType === "point" && mapComment.isPoint()) || (settings.GeometryType === "area" && !mapComment.isPoint())) &&
                        (titleRegex == null || titleRegex.test(mapComment.getAttribute('subject'))) &&
                        ((settings.LastModifiedBy === null) ||
                            ((mapComment.getUpdatedBy() ?? mapComment.getCreatedBy()) === settings.LastModifiedBy)) &&
                        ((settings.CreatedBy === null) ||
                            (mapComment.getCreatedBy() === settings.CreatedBy))) {
                        if (settings.Expiration) {
                            if (mapComment.getAttribute('endDate') === null) {
                                // If map comment doesn't have an end date, it automatically matches any greater than (or equal) filter
                                // and automatically fails any less than (or equal) filter
                                if (settings.ExpirationOperation === Operation.LessThan || settings.ExpirationOperation === Operation.LessThanOrEqual) {
                                    continue;
                                }
                            }
                            else {
                                const endDateNumber = Date.parse(mapComment.getAttribute('endDate'));
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
                        //     if (mapComment.getAttribute('updatedBy') != null) {
                        //         if (mapComment.getAttribute('updatedBy') !== settings.LastModifiedBy) {
                        //             continue;
                        //         }
                        //     } else if (mapComment.getAttribute('createdBy') !== settings.LastModifiedBy) {
                        //         continue;
                        //     }
                        // }
                        if (settings.CommentRegex != null) {
                            let match = commentRegex.test(mapComment.getAttribute('body'));
                            const comments = mapComment.getComments();
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
                        const lastEditorID = mapComment.getUpdatedBy() ?? mapComment.getCreatedBy();
                        const lastEditor = W.model.users.getObjectById(lastEditorID);
                        let endDate = null;
                        const expirationDate = mapComment.getAttribute('endDate');
                        if (expirationDate != null) {
                            endDate = Date.parse(expirationDate);
                            if (isNaN(endDate)) {
                                endDate = null;
                            }
                        }
                        const mComment = {
                            id: mapComment.getAttribute('id'),
                            geometryType: ((mapComment.isPoint()) ? I18n.t("edit.venue.type.point") : I18n.t("edit.venue.type.area")),
                            lastEditor: lastEditor?.getAttribute('userName') ?? '',
                            title: mapComment.getAttribute('subject'),
                            lockLevel: mapComment.getAttribute('lockRank') + 1,
                            expirationDate: endDate,
                            center: mapComment.getAttribute('geometry').getCentroid(),
                            createdOn: mapComment.getAttribute('createdOn'),
                            updatedOn: mapComment.getAttribute('updatedOn')
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
            const isCSV = (WMEWAL.outputTo & WMEWAL.OutputTo.CSV);
            const isTab = (WMEWAL.outputTo & WMEWAL.OutputTo.Tab);
            const addBOM = WMEWAL.addBOM ?? false;
            const outputFields = WMEWAL.outputFields ?? ['CreatedEditor', 'LastEditor', 'LockLevel', 'Lat', 'Lon'];
            const includeLockLevel = outputFields.indexOf('LockLevel') > -1 || settings.LockLevel !== null;
            const includeLastEditor = outputFields.indexOf('Last Editor') > -1 || settings.LastModifiedBy !== null;
            const includeLat = outputFields.indexOf('Lat') > -1;
            const includeLon = outputFields.indexOf('Lon') > -1;
            let lineArray;
            let columnArray;
            let w;
            let fileName;
            if (isCSV) {
                lineArray = [];
                columnArray = ["Title"];
                if (includeLockLevel) {
                    columnArray.push('Lock Level');
                }
                columnArray.push("Geometry Type", 'Expiration Date');
                if (includeLastEditor) {
                    columnArray.push('Last Editor');
                }
                columnArray.push('Created On', 'Updated On');
                if (includeLat) {
                    columnArray.push('Latitude');
                }
                if (includeLon) {
                    columnArray.push('Longitude');
                }
                columnArray.push('Permalink');
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
                w.document.write("<table style='border-collapse: separate; border-spacing: 8px 0px'><thead><tr><th>Title</th>");
                if (includeLockLevel) {
                    w.document.write("<th>Lock Level</th>");
                }
                w.document.write("<th>Geometry Type</th><th>Expiration Date</th>");
                if (includeLastEditor) {
                    w.document.write("<th>Last Editor</th>");
                }
                w.document.write("<th>Created On</th><th>Updated On</th>");
                if (includeLat) {
                    w.document.write("<th>Latitude</th>");
                }
                if (includeLon) {
                    w.document.write("<th>Longitude</th>");
                }
                w.document.write("<th>Permalink</th></tr><thead><tbody>");
            }
            for (let ixmc = 0; ixmc < mapComments.length; ixmc++) {
                const mapComment = mapComments[ixmc];
                const lonlat = OpenLayers.Layer.SphericalMercator.inverseMercator(mapComment.center.x, mapComment.center.y);
                const pl = getPL(mapComment, lonlat);
                let expirationDate = "";
                if (mapComment.expirationDate != null) {
                    expirationDate = new Date(mapComment.expirationDate).toLocaleString();
                }
                if (isCSV) {
                    columnArray = [`"${mapComment.title}"`];
                    if (includeLockLevel) {
                        columnArray.push(mapComment.lockLevel.toString());
                    }
                    columnArray.push(mapComment.geometryType, `"${expirationDate}"`);
                    if (includeLastEditor) {
                        columnArray.push(`"${mapComment.lastEditor}"`);
                    }
                    columnArray.push(mapComment.createdOn ? new Date(mapComment.createdOn).toLocaleString() : "", mapComment.updatedOn ? new Date(mapComment.updatedOn).toLocaleString() : "");
                    if (includeLat) {
                        columnArray.push(lonlat.lat.toString());
                    }
                    if (includeLon) {
                        columnArray.push(lonlat.lon.toString());
                    }
                    columnArray.push(`"${pl}"`);
                    lineArray.push(columnArray);
                }
                if (isTab) {
                    w.document.write(`<tr><td>${mapComment.title}</td>`);
                    if (includeLockLevel) {
                        w.document.write(`<td>${mapComment.lockLevel.toString()}</td>`);
                    }
                    w.document.write("<td>" + mapComment.geometryType + "</td>");
                    w.document.write("<td>" + expirationDate + "</td>");
                    if (includeLastEditor) {
                        w.document.write("<td>" + mapComment.lastEditor + "</td>");
                    }
                    w.document.write("<td>" + (mapComment.createdOn ? new Date(mapComment.createdOn).toLocaleString() : "&nbsp;") + "</td>");
                    w.document.write("<td>" + (mapComment.updatedOn ? new Date(mapComment.updatedOn).toLocaleString() : "&nbsp;") + "</td>");
                    if (includeLat) {
                        w.document.write("<td>" + lonlat.lat.toString() + "</td>");
                    }
                    if (includeLon) {
                        w.document.write("<td>" + lonlat.lon.toString() + "</td>");
                    }
                    w.document.write("<td><a href=\'" + pl + "\' target=\'_blank\'>Permalink</a></td></tr>");
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
        mapComments = null;
        mc = null;
    }
    WMEWAL_MapComments.ScanComplete = ScanComplete;
    function ScanCancelled() {
        ScanComplete();
    }
    WMEWAL_MapComments.ScanCancelled = ScanCancelled;
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
})(WMEWAL_MapComments || (WMEWAL_MapComments = {}));
