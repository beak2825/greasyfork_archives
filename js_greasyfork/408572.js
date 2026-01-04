// ==UserScript==
// @name         WME Closure Helper - Beta
// @namespace    https://greasyfork.org/en/users/673666-fourloop
// @version      ß 2025.02.14.01
// @description  A script to help out with WME closure efforts! :D
// @author       fourLoop & maintained by jm6087 fuji2086
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @connect      api.timezonedb.com
// @grant        GM.xmlHttpRequest

// @downloadURL https://update.greasyfork.org/scripts/408572/WME%20Closure%20Helper%20-%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/408572/WME%20Closure%20Helper%20-%20Beta.meta.js
// ==/UserScript==

/* global W */
/* global toastr */
/* global $ */
/* global settings */
/* global WazeWrap */
/* global OpenLayers */
/* global GM_xmlhttpRequest */
/* global xmlHttpRequest */

var G_AMOUNTOFPRESETS = 100;

(function() {
    'use strict';

    var customCSmin;
    var settings = {};
    var DateFormat = "";
    let Lang;
    var dateSeparator;
    let radio = "";

    //Bootstrap
    function bootstrap(tries = 1) {
        if (typeof W === 'object' && W.userscripts?.state?.isReady && W.map &&
            W.model && W.loginManager.user && WazeWrap.Ready) {
            log("Here we go!!! Starting program!");
            init();
        } else if (tries < 1000) {
            setTimeout(function() { bootstrap(tries++); }, 200);
        }
    }

    function init() {
        Lang = I18n.currentLocale()
        let lang_mmddyyyy = ["en-US", "en", "no", "zh"]; // mm/dd/yyyy
        let lang_ddmmyyyy = ["es-419", "es", "en-GB", "en-AU", "af", "ca", "el", "fr", "gl", "id", "it", "ms", "pt-BR", "pt-PT", "th"]; // dd/mm/yyyy
        let lang_ddmmyyyy2 = ["bg", "cs", "da", "de", "et", "fi", "hr", "lv", "pl", "ro", "ru", "sk", "sl", "tr", "uk"]; // dd.mm.yyyy
        let lang_yyyymmdd = ["eu", "lt", "sv"]; // yyyy-mm-dd
        let lang_ddmmyyyy3 = ["nl"]; // dd-mm-yyyy
        let lang_yyyymmdd2 = ["zh-TW"]; // yyyy/mm/dd
        let lang_yyyymmdd3 = ["hu"]; // yyyy.mm.dd
        if (lang_mmddyyyy.indexOf(Lang) != -1) {
            DateFormat = "mmddyyyy";
            dateSeparator = "/";
        }
        if (lang_ddmmyyyy.indexOf(Lang) != -1) {
            DateFormat = "ddmmyyyy";
            dateSeparator = "/";
        }
        if (lang_ddmmyyyy2.indexOf(Lang) != -1){
            DateFormat = "ddmmyyyy";
            dateSeparator = ".";
        }
        if (lang_yyyymmdd.indexOf(Lang) != -1){
            DateFormat = "yyyymmdd";
            dateSeparator = "-";
        }
        if (lang_ddmmyyyy3.indexOf(Lang) != -1){
            DateFormat = "ddmmyyyy"
            dateSeparator = "-";
        }
        if (lang_yyyymmdd2.indexOf(Lang) != -1){
            DateFormat = "yyyymmdd"
            dateSeparator = "/";
        }
        if (lang_yyyymmdd3.indexOf(Lang) != -1){
            DateFormat = "yyyymmdd"
            dateSeparator = ".";
            //        dateseparator2 = ".";
        }
        if (DateFormat == ""){
            DateFormat = "mmddyyyy";
            dateSeparator = "/";
        }

        var $section = $("<div>");
        var formString = '';
        var preset = 0;
        for (preset = 1; preset < (G_AMOUNTOFPRESETS + 1); preset++) {
            formString += '<div class="wmech_presetdiv" id="wmech_presetrow' + preset + '"><label class="wmech_presetlabel" style="text-align: center; width: 100%; margin-left: 0; margin-bottom: 0;" for="wmech_preset' + preset + 'name">Preset ' + preset + '</label>' +
                '<input id="wmech_preset' + preset + 'name" type="text" placeholder="Name" class="wmech_input wmech_inputpreset wmech_namepreset">' +
                '<input id="wmech_preset' + preset + 'reason" type="text" placeholder="Description" class="wmech_input wmech_inputpreset">' +
                '<input id="wmech_preset' + preset + 'timeString" type="text" placeholder="Time String (default U: 23:59)" class="wmech_input wmech_inputpreset">' +
                '<label class="wmech_presetlabel" for="wmech_preset' + preset + 'permanent">Make permanent:</label>' +
                '<i class="waze-tooltip wmech_presetpermatooltip" data-original-title="This feature will check the HOV / Service Road adjacent checkbox, meaning the closure will not listen to traffic."></i>' +
                '<input class="wmech_checkbox wmech_presetcheckbox wmech_presetsetting wmech_presetpermanent" title="Enable permanent closures by default" id="wmech_preset' + preset + 'permanent" type="checkbox">' +
                '<br><label class="wmech_presetlabel" for="wmech_preset' + preset + 'nodes">Node closures:</label>' +
                '<select class="wmech_presetsetting wmech_presetdropdown wmech_presetnodes" id="wmech_preset' + preset + 'nodes">' +
                '<option>Middle</option>' +
                '<option>All</option>' +
                '<option>Ends</option>' +
                '<option>None</option>' +
                '</select><br><label class="wmech_presetlabel" for="wmech_preset' + preset + 'direction">Direction:</label>' +
                '<select class="wmech_presetsetting wmech_presetdropdown wmech_presetdirection" id="wmech_preset' + preset + 'direction">' +
                '<option>Two Way</option>' +
                '<option>A --> B</option>' +
                '<option>B --> A</option>' +
                '</select><div><label class="wmech_presetlabel" for="wmech_preset' + preset + 'mteString">MTE:</label>' +
                '<input style="width: 50%;" id="wmech_preset' + preset + 'mteString" type="text" placeholder="MTE Search" class="wmech_input wmech_inputpreset wmech_presetsetting wmech_presetmteString"></div>' +
                '<div><label class="wmech_presetlabel" for="wmech_preset' + preset + 'color">Color:</label>' +
                '<input class="wmech_colorinput wmech_presetsetting wmech_presetcolor" type="color" id="wmech_preset' + preset + 'color"></div>' +
                '<button class="wmech_closurebutton wmech_presetdeletebutton" style="background-color: red; color: white;">Delete Preset</button>' +
                '</div>';
        }
        var tabString = '<ul class="nav nav-tabs"><li class="active"><a data-toggle="tab" href="#wmech-tab-presets">Presets</a></li>' +
            '<li><a data-toggle="tab" href="#wmech-tab-settings">Settings</a></li>' +
            '<li><a data-toggle="tab" href="#wmech-tab-format">Formatting</a></li>' +
            '<li><a data-toggle="tab" href="#wmech-tab-about">About</a></li>' +
            '</ul>';
        var settingsString = '<div class="wmech-tab-pane" id="wmech-tab-settings"><h2><center>Settings</center></h2><div id="wmech-main-settings"><div id="wmech-settings-boxes"></div></div><div id="wmech-quicksearch-settings"></div></div>';
        var formatString = '<div class="wmech-tab-pane" id="wmech-tab-format">' +
            '<h2><center>Formatting</center></h2>' +
            '<h3>Formatting Time Strings</h3>' +
            '<ul>' +
            '<li><b>No Flag:</b> Sets the closure for a specified duration. Duration string only <ul><li>"1m" = 1 Minute</li><li>"1d4h" = 1 Day, 4 Hours</li><li>"1o4d32m" = 1 Month, 4 Days, 32 Minutes</li><li>"1y" = 1 Year</ul></li>' +
            '<li><b>U Flag:</b> Sets the closure until a specified time, with an optional additional duration string.<ul>' +
            '<li>"U: 06:00" = Sets closure until the next instance of 6AM</li><li>"U: 23:59" = Sets closure until the next instance of 11:59PM</li><li>"U: 08:46, 1d" = Sets closure until 1 day after the next instance of 8:46AM' +
            '<li>"U: 12:45, 1y3m" = Sets closure until 1 year, 3 months after the next instance of 12:45PM</li>' +
            '<li>"U: 12:45, Mon" = Sets closure until 12:45PM on the next Monday (which, if today was Monday before 12:45PM, would be today)</li>' +
            '<li>"U: 12:45, Mon, 1y2o" = Sets closure until 12:45PM on the next Monday (which, if today was Monday before 12:45PM, would be today) and adds 1 year, 2 months</li></ul>' +
            '</li><li><b>D Flag:</b> Sets the closure until a specified date and time, in calendar format.' +
            '<ul><li>"D: 2024-09-30 06:00" = Sets the closure until 2024-09-30 at 6:00AM.</li><li>"D: 2020-07-08 14:15" = Sets closure until 2020-07-08 at 14:15.</li></ul></li>' +
            '</ul>' +
            '<h3>Duration Strings</h3>' +
            '<ul><li>"m" = Minute</li><li>"h" = Hour</li><li>"d" = Day</li><li>"o" = Month</li><li>"y" = Year</li><li><b>Note: </b> Weeks and other date/times are not supported</li></ul>' +
            '<h3>Name String</h3>' +
            '<ul>' +
            '<li><b>{{type}}</b> = The type of the segment</li>' +
            '<li><b>{{firstSegName}}</b> = The name of the first selected segment, in order of click</li>' +
            '<li><b>{{lastSegName}}</b> = The name of the last selected segment, in order of click</li>' +
            '</ul>' +
            '</div>';
        var aboutString = '<div class="wmech-tab-pane" id="wmech-tab-about"><h2><center>About</center></h2>' +
            '<ul>' +
            '<li>' + GM_info.script.version + '</li>' +
            '<li>Made by ' + GM_info.script.author + '</li>' +
            '<li>Documentation: <a href="https://docs.google.com/document/d/1mPE8qKezU720VCgrVCKpury7fkW5y5FbDrXzYbBpQK4/edit?usp=sharing" target="_blank">Here</a>' +
            '<li>Thanks to all of you amazing editors who make the map better every day <3' +
            '</ul>' +
            '</div>';
        formString = '<div class="wmech-tab-pane active" id="wmech-tab-presets"><label for="wmech_presetchooser">Choose a preset:</label><br><select id="wmech_presetchooser"></select>' + formString +
            '<button class="wmech_closurebutton wmech_presetsavebutton" style="background-color: blue; color: white;">Save Presets</button></div>' +
            '<div class="wmech-alert" id="wmech-save-notice">Save Successful</div>';
        $section.html(tabString + "<div class='tab-content'>" + formString + settingsString + formatString + aboutString + "</div>");

        setTimeout(function() {
            WazeWrap.Interface.Tab('CH', $section.html(), initializeSettings, 'CH');
            $(".wmech_presetdiv").hide();
            $("#wmech_presetrow1").show();
            $("#wmech_presetchooser").change(function() {
                var sel = parseInt($(this).children("option:selected").val()) + 1;
                if (sel != -1) {
                    $(".wmech_presetdiv").hide();
                    $("#wmech_presetrow" + sel).show();
                }
            });
        }, 1000);
    }

    function prepareSettings() {
        addSettingsCheckbox("Set segment list on closures to default collapsed", "wmech_settingseglistcollapse");
        addSettingsCheckbox("Direction click-saver buttons do not use directional cursors", "wmech_settingdircsdircur");
        addSettingsHeader("Time Zone Settings");
        addSettingsCheckbox("Enable time zone warning", "wmech_settingtimezonewarn");
        addSettingsInput("timezonedb.com/api Personal Key", "wmech_settingtimezoneapi");
        addSettingsHeader("Custom Minutes - Enter number of minutes (numbers only)");
        addSettingsInput("Custom time clicksaver - Enter number of minutes", "wmech_settingcustomcs");
        //         addSettingsCheckbox("Minutes", "wmech_settingcustomcsMin");
        $("#wmech_settingtimezonewarn").change(function() {
            if (!this.checked) {
                $("#wmech_settingtimezoneapi").prop('disabled', true);
            } else {
                $("#wmech_settingtimezoneapi").prop('disabled', false);
            }
        });
    }

    function addSettingsCheckbox(text, id) {
        $("#wmech-settings-boxes").append("<div class='controls-container'><input class='wmech_checkbox wmech_settingscheckbox' id='" + id + "' type='checkbox'><label class='wmechSettingsLabel' for='" + id + "'>" + text + "</label></div><br>");
    }

    function addSettingsHeader(text) {
        $("#wmech-settings-boxes").append("<p class='wmech_settingsheader'>" + text + "</p>");
    }

    function addSettingsInput(placeholder, id) {
        $("#wmech-settings-boxes").append("<input type='text' id=\"" + id + "\" placeholder='" + placeholder + "' class='wmech_input wmech_inputpreset wmech_settingsinput'>");
    }

    function initializeSettings() {
        prepareSettings();
        setUpSavePresetButton();
        setUpDeletePresetButton();
        attachObserver();

        $(".wmech_inputpreset").change(function() {
            var id = $(this)[0].id;
            var harvestIdInfoRE = new RegExp(/wmech_preset([0-9]*)(.*)/);
            var harvestIdInfo = id.match(harvestIdInfoRE);
            var presetIndex = harvestIdInfo[1];
            var prop = harvestIdInfo[2];
            if (!settings.presets[parseInt(presetIndex - 1)]) {
                settings.presets[parseInt(presetIndex - 1)] = {};
            }
            settings.presets[parseInt(presetIndex - 1)][prop] = this.value;
        });
        $(".wmech_namepreset").on('input', function() {
            var curVal = $("#wmech_presetchooser").val();
            $("#wmech_presetchooser").children().eq(curVal).text("Preset " + (parseInt(curVal) + 1) + " - " + $(this).val());
            loadDropdown();
        });
        $(".wmech_presetcheckbox").change(function() {
            var id = $(this)[0].id;
            var harvestIdInfoRE = new RegExp(/wmech_preset([0-9]*)(.*)/);
            var harvestIdInfo = id.match(harvestIdInfoRE);
            var presetIndex = harvestIdInfo[1];
            var prop = harvestIdInfo[2];
            if (!settings.presets[parseInt(presetIndex - 1)]) {
                settings.presets[parseInt(presetIndex - 1)] = {};
            }
            settings.presets[parseInt(presetIndex - 1)][prop] = this.checked;
        });
        $(".wmech_presetcolor").on("change", function() {
            var id = $(this)[0].id;
            var harvestIdInfoRE = new RegExp(/wmech_preset([0-9]*)(.*)/);
            var harvestIdInfo = id.match(harvestIdInfoRE);
            var presetIndex = harvestIdInfo[1];
            var prop = harvestIdInfo[2];
            if (!settings.presets[parseInt(presetIndex - 1)]) {
                settings.presets[parseInt(presetIndex - 1)] = {};
            }
            settings.presets[parseInt(presetIndex - 1)][prop] = this.value;
        });
        $(".wmech_presetdropdown").change(function() {
            var id = $(this)[0].id;
            var harvestIdInfoRE = new RegExp(/wmech_preset([0-9]*)(.*)/);
            var harvestIdInfo = id.match(harvestIdInfoRE);
            var presetIndex = harvestIdInfo[1];
            var prop = harvestIdInfo[2];
            if (!settings.presets[parseInt(presetIndex - 1)]) {
                settings.presets[parseInt(presetIndex - 1)] = {};
            }
            settings.presets[parseInt(presetIndex - 1)][prop] = $(this).val();
        });
        $(".wmech_settingscheckbox").change(function() {
            var id = $(this)[0].id;
            var harvestIdInfoRE = new RegExp(/wmech_setting(.*)/);
            var harvestIdInfo = id.match(harvestIdInfoRE);
            var settingName = harvestIdInfo[1];
            if (!settings.settingsCheckboxes) {
                settings.settingsCheckboxes = {};
            }
            settings.settingsCheckboxes[settingName] = $(this).is(":checked");
            saveSettings();
        });
        $(".wmech_settingsinput").on('change paste keyup input', function() {
            var id = $(this)[0].id;
            var harvestIdInfoRE = new RegExp(/wmech_setting(.*)/);
            var harvestIdInfo = id.match(harvestIdInfoRE);
            var settingName = harvestIdInfo[1];
            if (!settings.settingsInputs) {
                settings.settingsInputs = {};
            }
            settings.settingsInputs[settingName] = $(this).val();
            saveSettings();
        });
        //Added save button to eliminate the need to save settings every 6 seconds.
        /*var settingsSaver = setInterval(function() {
            saveSettings();
            // log("Save settings ran.");
        }, 60000);*/

        // Enable tooltips
        $(".wmech_presetpermatooltip").tooltip();

        setTimeout(loadSettings, 2500);
        log("Settings initialized.");
    }

    function setUpSavePresetButton() {
        $(".wmech_presetsavebutton").click(async function() {
            saveSettings();
            $('#wmech-save-notice').css("display", "block");
            setTimeout(function() { $('#wmech-save-notice').css("display", "none"); }, 5000);
        });
    }

    function setUpDeletePresetButton() {
        $(".wmech_presetdeletebutton").click(async function() {
            // Find max preset value
            var maxValue = 0;
            $("#wmech_presetchooser").find("option").each(function() {
                var curVal = $(this).val();
                if (curVal > maxValue) {
                    maxValue = curVal;
                }
            });

            // Clear information about the current preset and the last preset
            clearPreset($(this).parent());
            var curId = $("#wmech_presetchooser").val();
            $("#wmech_presetchooser").val(curId - 1).change();
            settings.presets.splice(curId, 1);

            await saveSettings();
            clearPreset($("#wmech_presetrow" + maxValue));
            if (curId == 0) {
                $("#wmech_presetrow1").show();
            }
        });
    }

    function clearPreset(el) {
        var preset = el;
        preset.find(".wmech_inputpreset").val("").change();
        preset.find(".wmech_presetpermanent").prop("checked", false).change();
        preset.find(".wmech_presetnodes").val("Middle").change();
        preset.find(".wmech_presetdirection").val("Two Way").change();
        preset.find(".wmech_presetcolor").val("#000000").change();
    }

    async function saveSettings() {
        log("Saved the settings. :D");
        if (localStorage) {
            localStorage.setItem("wmech_Settings", JSON.stringify(settings));
        }
// COMMENTED OUT BECAUASE OF WW ISSUES
//        await saveToServer();
// COMMENTED OUT BECAUASE OF WW ISSUES
        setTimeout(loadSettings, 100);
    }

    async function saveToServer() {
        // log("Attempting to save to the WazeDev server.");
        var res = await WazeWrap.Remote.SaveSettings(GM_info.script.name, settings);
        if (res == false) {
            error("Error saving settings to the WazeDev server.");
        } else if (res == null) {
            // log("Tried to save settings to WazeDev server, but you don't have a PIN set.")
        } else {
            // log("Saved settings to WazeDev server.");
        }
    }

    async function loadSettings() {
        var loadedSettings = $.parseJSON(localStorage.getItem("wmech_Settings"));
        var serverSettings = await WazeWrap.Remote.RetrieveSettings(GM_info.script.name);
        var defaultSettings = {
            enabled: true,
            presets: [{
                name: "Your first preset...",
                reason: "This is where your closure reason goes...",
                timeString: "And this is where your time string goes!",
                permanent: false,
                nodes: "Middle",
                direction: "Two Way",
                mteString: "And the MTE name",
                mteMatchIndex: 0,
                color: "#ffffff"
            }]
        };
// COMMENTED OUT BECAUASE OF WW ISSUES
//        if (serverSettings != null && serverSettings.hasOwnProperty("enabled")) {
            // log("Using settings from WazeDev server.");
//            settings = serverSettings;
//        } else
// COMMENTED OUT BECAUASE OF WW ISSUES
        if (loadedSettings != null && loadedSettings.hasOwnProperty("enabled")) {
            // log("Using settings from local settings.");
            settings = loadedSettings;
        } else {
            // log("Looks like you don't have settings yet. Using the default settings.");
            settings = defaultSettings;
        }

        // Set up presets
        var presets = settings.presets;
        for (var i = 0; i < presets.length; i++) {
            var preset = presets[i];
            if (preset == null || preset.name == "") {
                settings.presets.splice(i, 1);
                saveSettings();
            }
            for (var key in preset) {
                if (preset.hasOwnProperty(key)) {
                    // If preset has value
                    if (key == "color") {
                        $("#wmech_preset" + (i + 1) + key).val(preset[key]);
                    } else if (key == "permanent") {
                        if (preset[key]) {
                            $("#wmech_preset" + (i + 1) + key).attr("checked", "checked");
                        }
                    } else if (key == "nodes" || key == "direction") {
                        $("#wmech_preset" + (i + 1) + key).val(preset[key]);
                    } else {
                        $("#wmech_preset" + (i + 1) + key).val(preset[key]);
                    }
                }
            }
        }
        if (settings.settingsCheckboxes) {
            var settingsCBs = settings.settingsCheckboxes;
            for (var cbKey in settingsCBs) {
                if (settingsCBs[cbKey]) {
                    $("#wmech_setting" + cbKey).attr("checked", "checked");
                }
            }
        }
        if (settings.settingsInputs) {
            var settingsInputs = settings.settingsInputs;
            for (var key in settingsInputs) {
                $("#wmech_setting" + key).val(settingsInputs[key]);
            }
            if (settings.settingsInputs.hasOwnProperty('customcs')) {
                customCSmin = settings.settingsInputs.customcs;
            }
        }
        initCSS();
        loadDropdown();
    }

    function loadDropdown() {
        $("#wmech_presetchooser").find('option').remove();
        var newPresetIndex = 0,
            visibleIndex = 0;
        $(".wmech_namepreset").each(function(i, e) {
            var val = $(e).val();
            if (val.length > 0) {
                $("#wmech_presetchooser").append($('<option>', {
                    value: i,
                    text: "Preset " + (i + 1) + " - " + val
                }));
                newPresetIndex = i;
            }
            if ($("#wmech_presetchooser").children().length < 1) {
                $("#wmech_presetchooser").append($('<option>', {
                    value: 0,
                    text: "Preset 1 - "
                }));
            }
            if ($(this).is(":visible")) {
                visibleIndex = i;
            }
        });
        $("#wmech_presetchooser").append($('<option>', {
            value: newPresetIndex + 1,
            text: "Preset " + (newPresetIndex + 1 + 1) + " - Add an option..."
        }));
        $("#wmech_presetchooser").val(visibleIndex);
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Mutation is a NodeList and doesn't support forEach like an array
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var addedNode = mutation.addedNodes[i];

                // Only fire up if it's a node
                if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.className=='segment-feature-editor') {
                    var closuresPanel = addedNode.querySelector('.closures');
                    if (closuresPanel) {
                        setup();
                    }
                }
            }
        });
    });

    function attachObserver() {
        log("Observing...");
        WazeWrap.Events.unregister("selectionchanged", null, attachObserver);
        if (document.querySelector("#edit-panel")) {
            observer.observe(document.querySelector("#edit-panel"), { childList: true, subtree: true });
            // setup();
        } else {
            WazeWrap.Events.register("selectionchanged", null, attachObserver);
        }
    }

    function setup() {
        addClosureButtons();
        addPanelWatcher();
        addClosureCounter();
        formatClosureList();
//         $(".toggleHistory").click(function() {
//             setTimeout(addEnhancedClosureHistory, 1000);
//         });
    }

    function addClosureCounter() {
        // TODO In future, make this sorted by active/scheduled
        var num = $(".closure-item").length;
        var msg = "Road Closures (" + num.toString() + ")";
        if ($("#wmech-counter").length == 0)
            $(".closures-tab").append("<div id='wmech-counter'></div>");
        $("#wmech-counter").text(msg);
        setTimeout(function() {
            if ($(".closure-list").hasClass("active")) {
                addClosureCounter();
            }
        }, 1000);
    }

    function addClosureButtons() {
        var tmpButtonClicks = 0;
        var first = null;
        //alert("Appending node.");
        $(".closures-list").append("<div id='wmech-container' style='margin-top: 10px;'></div>");
        var presetCount = 1;
        for (presetCount = 1; presetCount < G_AMOUNTOFPRESETS; presetCount++) {
            var nameInput = $("#wmech_preset" + presetCount + "name").val();
            var timeInput = $("#wmech_preset" + presetCount + "timeString").val();
            var color = $(".wmech_colorinput").eq(presetCount - 1).val();
            var textColor = getTextContrastColor(color);
            if (nameInput) {
                $("#wmech-container").append(
                    $('<button>', {
                        id: ('wmechButton' + presetCount),
                        class: 'wmech_closurebutton',
                        style: ('background-color: ' + color + '; color:' + textColor)
                    }).text(nameInput).attr("data-preset-val", presetCount - 1).on("click", function() {
                        clickClosure($(this), false);
                        radio = "no";
                    }));
            }
        }
    }

    function getTextContrastColor(hex) {
        var match = hex.match(/#(.{2})(.{2})(.{2})/);
        var red = parseInt(match[1], 16);
        var green = parseInt(match[2], 16);
        var blue = parseInt(match[3], 16);
        var calc = (red * 0.299 + green * 0.587 + blue * 0.114);
        return (calc > 150) ? "black" : "white";
    }

    function formatClosureList() {
        $(".details").css("padding", "0 25px 0 15px");
        $(".direction .dir-label").css("margin", "0").css("padding", "0");
        $(".closures-list .direction").css("line-height", "15px").css("height", "20px").css("margin-left", "6px");
        $(".closure-item").css("margin-bottom", "5px").css("padding", "0");
        $(".section").css("padding", "0");
        $(".dates").css("margin-left", "10px");
        $(".closure-title").css("padding", "0").css("min-height", "19px");
        $(".buttons").css("top", "0px");
        //        $("#sidebar .tab-content").css("overflow", "visible").css("overflow-x", "visibile");
        //        $(".closures-list-items").css({"overflow-y": "visible", "padding": 0});
    }

    function addClosureCheckboxes(reason = "addPanelWatcher()") {
        makeBulkButtons();
        $("li.closure-item").each(function() {
            var $checkboxDiv = $("<div />");
            var $checkbox = $("<input />", { type: "checkbox", "class": "wmech_bulkCheckbox" }).css("height", "100%").css("margin-top", "0");
            $checkboxDiv.css("vertical-align", "middle").css("position", "relative").css("margin-left", "4px");
            $checkboxDiv.append($checkbox);
            if ($( this ).find(".wmech_bulkCheckbox").length == 0) {
                $( this ).css("display", "flex").css("margin-bottom", "5px");
                $( this ).wrapInner("<div style='margin-left: 4px; width: 90%;'></div>");
                $( this ).prepend($checkboxDiv);
            }
        });
        $(":checkbox.wmech_bulkCheckbox").click(function(e) {
            toggleBulkButtons();
            e.stopPropagation();
        });

        // Add select all closures checkbox
        //         if ($("#wmech_selectAllDiv").length > 0) {
        //             let cccc = $("#wmech_selectAllDiv").length;

        if ($(".closure-item").length > 1) {
            var holderDiv = $("<div />", { id: "wmech_selectAllDiv" }).css("margin-bottom", "4px");
            holderDiv.append(
                $("<input />", { type: "checkbox", id: "wmech_selectAllCheckbox" }).click(function() {
                    $(".wmech_bulkCheckbox").prop("checked", this.checked);
                    toggleBulkButtons();
                }));
            holderDiv.append($("<p />", { id: "wmech_selectAllText" }).text("Select all closures"));
            $(".full-closures").prepend(holderDiv);
        }
        //        }
    }

    function toggleBulkButtons() {
        if ($(":checkbox.wmech_bulkCheckbox:checked").length == 0)
            hideBulkButtons();
        else
            showBulkButtons();
        if ($(":checkbox.wmech_bulkCheckbox:checked").length == 0) {
            $("#wmech_selectAllCheckbox").prop("checked", false);
        } else if ($(":checkbox.wmech_bulkCheckbox:checked").length == $(":checkbox.wmech_bulkCheckbox").length) {
            $("#wmech_selectAllCheckbox").prop("checked", true);
        }
    }

    function makeBulkButtons() {
        var $buttonDiv = $("<div />", { id: "wmech_bulkButtonDiv" }).css("margin-bottom", "10px");
        var $deleteAllButton = $("<button />", { id: "wmech_bulkDeleteAll", "class": "wmech_closurebutton" }).css("background-color", "red").css("color", "white").text("Delete Selected Closures");
        var $xButton = $("<button />", { id: "wmech_bulkX", "class": "wmech_closurebutton" }).css("background-color", "black").css("color", "red").css("float", "right").css("width", "10%").text("X");
        var $cloneButton = $("<button />", { id: "wmech_bulkClone", "class": "wmech_closurebutton" }).css("background-color", "green").css("color", "white").text("Simple Clone");
        // var $propertiesButton = $("<button />", { id: "wmech_bulkProperties", "class": "wmech_closurebutton" }).css("background-color", "orange").css("color", "white").text("Edit Properties");
        $buttonDiv.append($xButton);
        $buttonDiv.append($deleteAllButton);
        $buttonDiv.append($cloneButton);
        // $buttonDiv.append($propertiesButton);
        $(".closures-list").prepend($buttonDiv);
        $buttonDiv.hide();
        $("#wmech_bulkX").click(function() {
            hideBulkButtons();
            $(".wmech_bulkCheckbox").prop("checked", false);
            $('#wmech_selectAllCheckbox').prop("checked", false);
        });
        $("li.closure-item, .add-closure-button").click(function() {
            $("#wmech_bulkButtonDiv").remove();
        });
        $("#wmech_bulkDeleteAll").click(deleteAllClosures);
        $("#wmech_bulkClone").click(simpleCloneClosure);
    }

    function showBulkButtons() {
        $("#wmech_bulkButtonDiv").show();
    }

    function hideBulkButtons() {
        $("#wmech_bulkButtonDiv").hide();
    }

    function harvestCloneInfo(si) {
        $(".closure-item").eq(si).click();
        var title = $("#closure_reason").val();
        var dir = $("#closure_direction").val();
        var startDate = $("#closure_startDate").val();
//        var startTime = $("#closure_startTime").val();
        var startTime = $("#edit-panel div.closures div.form-group.start-date-form-group > div.date-time-picker > wz-text-input.time-picker-input").val()
        var endDate = $("#closure_endDate").val();
//        var endTime = $("#closure_endTime").val();
        var endTime = $("#edit-panel div.closures div.form-group.end-date-form-group > div.date-time-picker > wz-text-input.time-picker-input").val()
        var waitForMTE = setInterval(function() {
            // Every 100 seconds check for late info!
            if ($(".wmech_mtelabel").length > 0) {
                clearInterval(waitForMTE);
                var mte = $(".wmech_mtelabelselected").prev().data("mte-val");
                var permanentChecked = $("#closure_permanent").attr("checked");
                var nodes = []
                $(".fromNodeClosed").each(function() {
                    if ($(this).attr("checked") == "checked") {
                        nodes.push(true);
                    } else {
                        nodes.push(false);
                    }
                });

                // Now, time to add a new closure!
                $(".cancel-button").click();
                $(".add-closure-button").click();
                $("#closure_direction wz-option[value=" + dir +"]").click();
                $("#closure_reason").val(title).change();
                changeDateField("#closure_startDate", startDate);
//                $("#closure_startDate").val(startDate).change();
                changeTimeField($("#edit-panel div.closures div.form-group.start-date-form-group > div.date-time-picker > wz-text-input.time-picker-input"),startTime);
//                $("#closure_startTime").val(startTime).change();
                $(".fromNodeClosed").each(function(i, e) {
                    if (nodes[i]) {
                        $(e).attr("checked", "checked");
                    }
                });
                if (permanentChecked) {
                    $("#closure_permanent").attr("checked", "checked").change();
                }
                addToEndStartDate(0, 1, 0, "start");
                if (mte == "") {
                    $("#closure_eventId").val("").change();
                    setTimeout(function() {
                        $("#closure_eventId").removeAttr("value");
                    }, 10);
                } else {
                    $("#closure_eventId").val(mte).change();
                }
                setTimeout(function() {
                    // Wait for default end date/time adjustment
                    changeDateField("#closure_endDate", endDate);
//                    $("#closure_endDate").val(endDate).change();
                    changeTimeField($("#edit-panel div.closures div.form-group.end-date-form-group > div.date-time-picker > wz-text-input.time-picker-input"),endTime);
//                    $("#closure_endTime").val(endTime).change();
                    addToEndStartDate(0, 1, 0);
                    addPanelWatcher();
                }, 100);
            }
        }, 100);
    }

    function chooseMTE(name) {
        if ($(".wmech_mtelabel").length > 0) {
            $("label:contains('" + name + "')").click();
        } else {
            setTimeout(function() {
                chooseMTE(name);
            }, 100);
        }
    }

    function simpleCloneClosure() {
        log("Starting simple clone.");
        var checked = getIndexOfSelectedCheckboxes();
        if (checked.length != 1) {
            return WazeWrap.Alerts.error(GM_info.script.name, "Currently, simple clone only allows you to clone one segment at a time.");
        }
        var si = checked[0];
        harvestCloneInfo(si);
        return;
    }

    function waitForPermaAndNodes() {
        if ($("#closure_permanent").length > 1 && $(".fromNodeClosed").length > 1) {
            var permanentChecked = ($("#closure_permanent").attr("checked") == "checked");
            var nodes = [];
            $(".fromNodeClosed").each(function() {
                if ($(this).attr("checked") == "checked") {
                    nodes.push(true);
                } else {
                    nodes.push(false);
                }
            });
            return [permanentChecked, nodes];
        } else {
            setTimeout(waitForPermaAndNodes, 100);
        }
    }

    function parseClosureListingDate(dateString) {
        var pattern = new RegExp(/(.{3}) (.{3}) ([0-9]{2}) ([0-9]{4})/);
        var matches = dateString.match(pattern);
        var dayOfWeek = matches[1];
        var shortMonth = matches[2];
        var day = matches[3];
        var year = matches[4];
        var monthNum = 0;
        switch (shortMonth) {
            case "Jan":
                monthNum = 1;
                break;
            case "Feb":
                monthNum = 2;
                break;
            case "Mar":
                monthNum = 3;
                break;
            case "Apr":
                monthNum = 4;
                break;
            case "May":
                monthNum = 5;
                break;
            case "Jun":
                monthNum = 6;
                break;
            case "Jul":
                monthNum = 7;
                break;
            case "Aug":
                monthNum = 8;
                break;
            case "Sep":
                monthNum = 9;
                break;
            case "Oct":
                monthNum = 10;
                break;
            case "Nov":
                monthNum = 11;
                break;
            case "Dec":
                monthNum = 12;
                break;
        }
        return {
            'month': formatTimeProp(monthNum.toString()),
            'day': formatTimeProp(day.toString()),
            'year': year,
        };
    }

    function getIndexOfSelectedCheckboxes() {
        var checked = [];
        $(".wmech_bulkCheckbox").each(function(i) {
            if ($(this).is(":checked")) { checked.push(i); }
        });
        return checked;
    }

    function deleteAllClosures() {
        var checked = getIndexOfSelectedCheckboxes();
        $("wz-menu-item.delete").on('click.wmech_bulk', function(e) {
            e.stopImmediatePropagation();
        });

        //            var _confirm = window.confirm;
        //    window.confirm = function(msg)
        //    {
        //       var cm_delete_confirm = I18n.lookup("closures.delete_confirm").split('"')[0].trimRight(1);

        //       if(msg.indexOf(cm_delete_confirm) != -1)
        //       {
        //          uroAddLog('intercepted closure delete confirmation...');
        //          if(uroConfirmClosureDelete)
        //          {
        //             return _confirm(msg);
        //          }
        //          else
        //          {
        //             return true;
        //          }
        //       }
        //       else if(typeof(msg) == 'undefined')
        //       {
        //          uroAddLog('Intercepted blank confirmation...');
        //          return true;
        //       }
        //       else
        //       {
        //          return _confirm(msg);
        //       }
        //    };
        // Override window.confirm
        var _confirm = window.confirm;
        var oldConfirm = window.confirm;
        var msg = "Delete Closure?";
        window.confirm = function(msg) {
            log(msg);
            if (msg.indexOf("Delete closure") != -1) {
                return true;
            } else {
                return oldConfirm(msg);
            }
        };
        $("wz-menu-item.delete").each(function(i) {
            if (checked.includes(i)) {
                $(this).click();
            }
        });
        $("wz-menu-item.delete").off('click.wmech_bulk');
        setTimeout(addPanelWatcher, 3000);
    }

    function timeZoneCompare() {
        if ($("#wmech_settingtimezonewarn").is(":checked")) {
            var apiVal = $("#wmech_settingtimezoneapi").val();
            var center = W.map.getCenter();
            var actualCenter = WazeWrap.Geometry.ConvertTo4326(center.lon, center.lat);
            var d = new Date();
            GM.xmlHttpRequest({
                method: "GET",
                url: "https://api.timezonedb.com/v2.1/get-time-zone?key=" + apiVal + "&format=json&by=position&lat=" + actualCenter.lat + "&lng=" + actualCenter.lon,
                responseType: "json",
                onload: resp => {
                    var newD = new Date(resp.response.formatted);
                    var diff = Math.round((newD - d) / (1000 * 60 * 60));
                    var timeZone = resp.response.abbreviation;
                    if (diff < 0) {
                        var msg = (-1 * diff) + " hour" + (diff != -1 ? "s" : "") + " behind.  Make sure to adjust your start time if you want the closure to go live now."
                        } else {
                            var msg = diff + " hour" + (diff != 1 ? "s" : "") + " ahead."
                            }
                    if (diff != 0) {
                        $(".edit-closure > form > div:nth-child(4)").after("<div class='wmech_timezonewarnmessage'><span>Warning, the times for the closure you are adding is " + msg + "</span></div>");
                    }
                }
            });
        }
    }

    function addPanelWatcher() {
        $("li.closure-item, .add-closure-button").off();
        $("li.closure-item, .add-closure-button").click(function() {
            setTimeout(addNodeClosureButtons, 5);
            setTimeout(addDirectionCS, 5);
            setTimeout(addClosureSegInfo, 5);
            setTimeout(addClosureLengthValue, 5);
            setTimeout(addMTERadios, 5);
            setTimeout(addLengthExtenders, 5);
            setTimeout(checkIfNeedToAddPanelWatcher, 5);
            setTimeout(removeClosureLines, 5);
            setTimeout(timeZoneCompare, 5);
            setTimeout(function() {
                $('.edit-closure > form > div.action-buttons > wz-button.cancel-button').click(function() {
                    $('.edit-closure > form > div.action-buttons > wz-button.cancel-button').off();
                    $('.edit-closure [class^="wmech"]').remove();
                    $('.edit-closure [id^="wmech"]').remove();
                    setTimeout(function() { setup(); }, 50);
                })
            }, 20);
        });
        formatClosureList();
        addClosureCheckboxes();
    }

    function numOfSegsSelected() {
        return W.selectionManager.getSegmentSelection().segments.length;
    }

    function getAllStreets() {
        var res1 = W.selectionManager.getSegmentSelection();
        var finalRes = [];
        for (var i = 0; i < res1.segments.length; i++) {
            var seg = res1.segments[i];
            var pID = seg.attributes.primaryStreetID;
            var pS = W.model.streets.getObjectById(pID);
            var name = pS.name;
            finalRes.push((name == null ? "No Name" : name));
        }
        return combineStreets(finalRes);
    }

    function combineStreets(arr) {
        var a = [],
            b = [],
            prev;

        arr.sort();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] !== prev) {
                a.push(arr[i]);
                b.push(1);
            } else {
                b[b.length - 1]++;
            }
            prev = arr[i];
        }

        var res = [];
        for (i = 0; i < a.length; i++) {
            res.push(a[i] + " (" + b[i] + ")");
        }
        return res;
    }

    function removeClosureLines() {
        $(".form-group").css("border-top", "0");
    }

    function addClosureSegInfo() {
        var segsLength = $(".length-attribute .value").text();
        segsLength = segsLength.replace(/m/, "m / ");
        var numOfSegs = numOfSegsSelected();
        var segLabel = numOfSegs + " segs (" + segsLength + ")";
        $(".edit-closure form").prepend('<div class="form-group">' +
                                        '<span><i class="fa fa-fw fa-chevron-down wmech_seglistchevron"></i></span>' +
                                        '<label id="wmech_seginfolabel" class="control-label" for="closure_reason" style="margin-bottom: 0;">Segments</label>' +
                                        '<label id="wmech_seginfolabel" class="control-label" style="font-weight: normal;">' + segLabel + '</label>' +
                                        '<div class="controls"><ul id="wmech_seginfonames">' + '</ul></div></div>');
        $(".edit-closure form .form-group").first().click(collapseSegList);
        if ($("#wmech_settingseglistcollapse").prop("checked")) {
//            radio = "checked"
            collapseSegList();
        }
        var streets = getAllStreets();
        for (var i = 0; i < streets.length; i++) {
            $("#wmech_seginfonames").append("<li>" + streets[i] + "</li>");
        }
    }

    function collapseSegList() {
        $(".edit-closure form .form-group").first().find("ul").toggle();
        $(".wmech_seglistchevron").toggleClass("fa-chevron-down fa-chevron-up");
    }

    function updateClosureLength() {
        $("#wmech_closurelengthval").text(closureLength());
    }

    function addClosureLengthValue() {
        $(".form-group.end-date-form-group").after('<div class="form-group">' +
                                                   '<label class="control-label" for="closure_reason">Closure Length</label>' +
                                                   '<div class="controls" style="text-align: center;">' +
                                                   '<span id="wmech_closurelengthval"></span>' +
                                                   '</div></div>');
        $("#wmech_closurelengthval").text(closureLength());
        $("#closure_startDate, " +
          "#closure_endDate, " +
          ".time-picker-input").on('change paste keyup input', function() {
            setTimeout(updateClosureLength,50);
        });
    }

    function closureLength() {
        var startDate = $("#closure_startDate").val();
//        var startTime = $("#closure_startTime").val();
        var startTime = $("#edit-panel div.closures div.form-group.start-date-form-group > div.date-time-picker > wz-text-input.time-picker-input").val()
        var endDate = $("#closure_endDate").val();
//        var endTime = $("#closure_endTime").val();
        var endTime = $("#edit-panel div.closures div.form-group.end-date-form-group > div.date-time-picker > wz-text-input.time-picker-input").val()
        //        var regex = /(.*)(\-|\.|\/)(.*)(\-|\.|\/)(.*)/;
        var regex = /(\d*)(\-|\.|\/)(\d*)(\-|\.|\/)(\d*)(.*)/;
        var startDateResult = regex.exec(startDate);
        var endDateResult = regex.exec(endDate);
        if (DateFormat == "ddmmyyyy"){
            var startYear = startDateResult[5];
            var startMonth = startDateResult[3];
            var startDay = startDateResult[1];
            var endYear = endDateResult[5];
            var endMonth = endDateResult[3];
            var endDay = endDateResult[1];
        }else{
            if (DateFormat == "yyyymmdd"){
                var startYear = startDateResult[1];
                var startMonth = startDateResult[3];
                var startDay = startDateResult[5];
                var endYear = endDateResult[1];
                var endMonth = endDateResult[3];
                var endDay = endDateResult[5];
            }else{
                var startYear = startDateResult[5];
                var startMonth = startDateResult[1];
                var startDay = startDateResult[3];
                var endYear = endDateResult[5];
                var endMonth = endDateResult[1];
                var endDay = endDateResult[3];
            }}
        var regex2 = /(.*):(.*)/;
        var startTimeResult = regex2.exec(startTime);
        var startHour = startTimeResult[1];
        var startMin = startTimeResult[2];
        var endTimeResult = regex2.exec(endTime);
        var endHour = endTimeResult[1];
        var endMin = endTimeResult[2];
        var d1 = new Date(startYear, parseInt(startMonth) - 1, startDay, startHour, startMin, 0, 0);
        var d2 = new Date(endYear, parseInt(endMonth) - 1, endDay, endHour, endMin, 0, 0);
        if (d2 - d1 < 0) {
            endDateBeforeStartDate();
            return "End date is before start date!";
        } else {
            endDateAfterStartDate();
        }
        var dif = dateDiff(d1, d2);
        var finalString = [];
        if (dif['year'] > 0) {
            finalString.push(dif['year'] + " year" + (dif['year'] != 1 ? "s" : ""));
        }
        if (dif['month'] > 0) {
            finalString.push(dif['month'] + " month" + (dif['month'] != 1 ? "s" : ""));
        }
        if (dif['week'] > 0) {
            finalString.push(dif['week'] + " week" + (dif['week'] != 1 ? "s" : ""));
        }
        if (dif['day'] > 0) {
            finalString.push(dif['day'] + " day" + (dif['day'] != 1 ? "s" : ""));
        }
        if (dif['hour'] > 0) {
            finalString.push(dif['hour'] + " hour" + (dif['hour'] != 1 ? "s" : ""));
        }
        if (dif['minute'] > 0) {
            finalString.push(dif['minute'] + " minute" + (dif['minute'] != 1 ? "s" : ""));
        }
        return finalString.join(", ");
    }

    function endDateBeforeStartDate() {
        $("#wmech_closurelengthval").css("color", "red");
        $(".edit-closure").css("background-color", "#f7b0b0");
        $(".edit-closure").find("input, select").css("background-color", "#ffd1d1");
        $(".closure-node-item").css("background-color", "#ffd1d1");
    }

    function endDateAfterStartDate() {
        $("#wmech_closurelengthval").css("color", "black");
        $(".edit-closure").css("background-color", "#eeeeee");
        $(".edit-closure").find("input, select").css("background-color", "#fff");
        $(".closure-node-item").css("background-color", "#f2f4f7");
    }

    function dateDiff(d1, d2) {
        // Thank you for this code RienNaVaPlus (https://stackoverflow.com/a/32514236)!
        var d = Math.abs(d2 - d1) / 1000; // delta
        var r = {}; // result
        var s = { // structure
            year: 31536000,
            month: 2592000,
            week: 604800, // uncomment row to ignore
            day: 86400, // feel free to add your own row
            hour: 3600,
            minute: 60,
            second: 1
        };

        Object.keys(s).forEach(function(key) {
            r[key] = Math.floor(d / s[key]);
            d -= r[key] * s[key];
        });

        return r;
    };

    function addDirectionCS() {
        var DirLen = W.selectionManager.getSelectedWMEFeatures().length
        var segDir;
        if (DirLen > 1) {
            segDir = 3
            $("#closure_direction wz-option[value='3']").click();
        }else{
            segDir = $("#closure_direction").val();
        }

        var directionalCursors = $("#wmech_settingdircsdircur").is(":checked");
        $("#closure_direction").after("<div id='wmech_dBAB' class='wmech_closureButton wmech_dirbutton'>A → B</div>" +
                                      "<div id='wmech_dBBA' class='wmech_closureButton wmech_dirbutton'>B → A</div>" +
                                      "<div id='wmech_dBTW' class='wmech_closureButton wmech_dirbutton'>Two way (⇆)</div>");
        var permDir = "";
        if ($(".heading").length > 0 && numOfSegsSelected() <= 1) {
            if ($(".letter-circle:eq(0)").text() == "A") {
                var dir = $(".heading:eq(0)").text().match(/(?<=Drive ).*(?= on)/)[0];
                $(".wmech_dirbutton:eq(0)").append("(" + dir + ")").css("cursor", (directionalCursors ? "pointer" : determineCursor(dir)));
                if (dir.length > 1) permDir = dir;
            } else {
                var dir = $(".heading:eq(0)").text().match(/(?<=Drive ).*(?= on)/)[0];
                $(".wmech_dirbutton:eq(1)").append("(" + dir + ")").css("cursor", (directionalCursors ? "pointer" : determineCursor(dir)));
                if (dir.length > 1) permDir = dir;
            }
            if ($(".letter-circle:eq(2)").text() == "A") {
                var dir = $(".heading:eq(1)").text().match(/(?<=Drive ).*(?= on)/)[0];
                $(".wmech_dirbutton:eq(0)").append("(" + dir + ")").css("cursor", (directionalCursors ? "pointer" : determineCursor(dir)));
                if (dir.length > 1) permDir = dir;
            } else if ($(".letter-circle:eq(2)").text() == "B") {
                var dir = $(".heading:eq(1)").text().match(/(?<=Drive ).*(?= on)/)[0];
                $(".wmech_dirbutton:eq(1)").append("(" + dir + ")").css("cursor", (directionalCursors ? "pointer" : determineCursor(dir)));
                if (dir.length > 1) permDir = dir;
            }
        }
        $("#wmech_dBAB").click(function() {
            $("#closure_direction wz-option[value='1']").click();
            $("#wmech_dBAB").css('background-color', '#26bae8');
            $("#wmech_dBBA").css('background-color', '#ddd');
            $("#wmech_dBTW").css('background-color', '#ddd');
        });
        $("#wmech_dBBA").click(function() {
            $("#closure_direction wz-option[value='2']").click();
            $("#wmech_dBAB").css('background-color', '#ddd');
            $("#wmech_dBBA").css('background-color', '#26bae8');
            $("#wmech_dBTW").css('background-color', '#ddd');
        });
        $("#wmech_dBTW").click(function() {
            $("#closure_direction wz-option[value='3']").click();
            $("#wmech_dBAB").css('background-color', '#ddd');
            $("#wmech_dBBA").css('background-color', '#ddd');
            $("#wmech_dBTW").css('background-color', '#26bae8');
        });
        if (segDir == 1) {
            // Segment direction is A --> B
            $("#wmech_dBBA, #wmech_dBTW").remove();
            $("#wmech_dBAB").css('background-color', '#26bae8');
        } else if (segDir == 2) {
            // Segment direction is B --> A
            $("#wmech_dBAB, #wmech_dBTW").remove();
            $("#wmech_dBBA").css('background-color', '#26bae8');
        }
        $("#wmech_dBTW").css("cursor", (directionalCursors ? "pointer" : determineCursorDouble(permDir)));
        $("#wmech_dBTW").css('background-color', '#26bae8');
    }

    function determineCursor(dir) {
        if (dir == "south") return "s-resize";
        if (dir == "north") return "n-resize";
        if (dir == "east") return "e-resize";
        if (dir == "west") return "w-resize";
        if (dir == "southeast") return "se-resize";
        if (dir == "northwest") return "nw-resize";
        if (dir == "northeast") return "ne-resize";
        if (dir == "southwest") return "sw-resize";
        if (dir.length < 1) return "help";
    }

    function determineCursorDouble(dir) {
        if (dir == "east" || dir == "west") return "ew-resize";
        if (dir == "north" || dir == "south") return "ns-resize";
        if (dir == "northeast" || dir == "southwest") return "nesw-resize";
        if (dir == "northwest" || dir == "southeast") return "nwse-resize";
    }

    function addLengthExtenders() {
        var $html = [
            '<span id="wmech_lEB1m" class="wmech_closureButton wmech_lengthExtenderButton" style="background-color: #f5ffba;">+1m</span>',
            '<span id="wmech_lEB15m" class="wmech_closureButton wmech_lengthExtenderButton" style="background-color: #f5ffba;">+15m</span>',
            '<span id="wmech_lEB1h" class="wmech_closureButton wmech_lengthExtenderButton" style="background-color: #c9ffba;">+1h</span>',
            '<span id="wmech_lEB2h" class="wmech_closureButton wmech_lengthExtenderButton" style="background-color: #c9ffba;">+2h</span>',
            '<span id="wmech_lEB1d" class="wmech_closureButton wmech_lengthExtenderButton" style="background-color: #bafff7;">+1d</span>',
            '<span id="wmech_lEB1w" class="wmech_closureButton wmech_lengthExtenderButton" style="background-color: #bdbaff;">+1w</span>',
            '<span id="wmech_lEB1mo" class="wmech_closureButton wmech_lengthExtenderButton" style="background-color: #ffbaf9;">+1mo</span>',
            '<span id="wmech_lEBcustomMin" class="wmech_closureButton wmech_lengthExtenderButton" style="background-color: #ffffff;">custom</span>',
        ].join("\n");
        $("#wmech_closurelengthval").after("<div id='wmech_timeExtenderDiv'></div>");
        $("#wmech_timeExtenderDiv").append($html);
        if (customCSmin == "") {
            $("#wmech_lEBcustomMin").css('visibility', 'hidden');
        } else {
            $("#wmech_lEBcustomMin").text(customCSmin + "m");
        }
        $("#wmech_lEB1m").click(function() { addToEndStartDate(0, 0, 1); });
        $("#wmech_lEB15m").click(function() { addToEndStartDate(0, 0, 15); });
        $("#wmech_lEB1h").click(function() { addToEndStartDate(0, 0, 60); });
        $("#wmech_lEB2h").click(function() { addToEndStartDate(0, 0, 120); });
        $("#wmech_lEB1d").click(function() { addToEndStartDate(0, 1, 0); });
        $("#wmech_lEB1w").click(function() { addToEndStartDate(0, 7, 0); });
        $("#wmech_lEB1mo").click(function() { addToEndStartDate(1, 0, 0); });
        $("#wmech_lEBcustomMin").click(function() { addToEndStartDate(0, 0, customCSmin); });
    }

    function addToEndStartDate(o, d, m, type = "end") {
        var LY;
        var finalDate;
        var finalTime;
        var endDate = $("#closure_" + type + "Date").val();
        var endTime = $("#edit-panel div.closures div.form-group." + type + "-date-form-group > div.date-time-picker > wz-text-input.time-picker-input").val();
//        var endTime = $("#closure_" + type + "Time").val();
        //            var regex = /(.*)\/(.*)\/(.*)/;
        //        var regex = /(.*)(\-|\.|\/)(.*)(\-|\.|\/)(.*)/;
        var regex = /(\d*)(\-|\.|\/)(\d*)(\-|\.|\/)(\d*)(.*)/;
        var endDateResult = regex.exec(endDate);
        if (DateFormat == "ddmmyyyy"){
            var endYear = endDateResult[5];
            var endMonth = endDateResult[3];
            var endDay = endDateResult[1];
        }else{
            if (DateFormat == "yyyymmdd"){
                var endYear = endDateResult[1];
                var endMonth = endDateResult[3];
                var endDay = endDateResult[5];
            }else{
                var endYear = endDateResult[5];
                var endMonth = endDateResult[1];
                var endDay = endDateResult[3];
            }}
        // fix for last day of month and adding 1 month with clicksaver to ensure it is actually last day of following month.
        if (endYear == "2024" || endYear == "2028" || endYear == "2032" || endYear == "2036" || endYear == "2040" || endYear == "2044" || endYear == "2048") LY = "yes";
        if (o == 1){
            if (endMonth == "04" || endMonth == "06" || endMonth == "07" || endMonth == "09" || endMonth == "11" || endMonth == "12"){
                if (endDay == "30"){
                    o = 0;
                    d = 31;
                }
            }else{
                if (endMonth == "03" || endMonth == "05" || endMonth == "08" || endMonth == "10"){
                    if (endDay == "31"){
                        o = 0;
                        d = 30;
                    }
                }else{
                    if (endMonth == "02" && endDay > "27"){
                        o = 0;
                        if (LY == "yes"){
                            d = 31;
                        }else{
                            d = 30;
                        }
                    }else{
                        if (endMonth == "01" && endDay > "27"){
                            o = 0;
                            if (LY == "yes"){
                                d = 31 - (endDay - 29);
                            }else{
                                d = 31 - (endDay - 28);
                            }
                        }
                    }
                }
            }
        }

        var regex2 = /(.*):(.*)/;
        var endTimeResult = regex2.exec(endTime);
        var endHour = endTimeResult[1];
        var endMin = endTimeResult[2];
        var res = new Date(endYear, parseInt(endMonth) - 1, endDay, endHour, endMin, 0, 0);
        res.setTime(res.getTime() + (m * 60 * 1000));
        res.setDate(res.getDate() + d);
        res.setMonth(res.getMonth() + o);
        if (DateFormat == "ddmmyyyy"){
            finalDate = formatTimeProp(formatTimeProp(res.getDate())) + dateSeparator + (parseInt(res.getMonth()) + 1) + dateSeparator + res.getFullYear();
        }else{
            if (DateFormat == "yyyymmdd"){
                finalDate = res.getFullYear() + dateSeparator + (parseInt(res.getMonth()) + 1) + dateSeparator + formatTimeProp(res.getDate());
            }else{
                finalDate = formatTimeProp(parseInt(res.getMonth()) + 1) + dateSeparator + formatTimeProp(res.getDate()) + dateSeparator + res.getFullYear();
            }}
        finalTime = formatTimeProp(res.getHours()) + ":" + formatTimeProp(res.getMinutes());
//        $("#closure_" + type + "Date").val(finalDate).change();
        changeDateField("#closure_" + type + "Date", finalDate);
//        $("#closure_" + type + "Time").val(finalTime).change();
        changeTimeField($("#edit-panel div.closures div.form-group." + type + "-date-form-group > div.date-time-picker > wz-text-input.time-picker-input"),finalTime);
    }

    function changeDateField(element, newDate) {
        const newDateObj = $(element).data('daterangepicker')
        newDateObj.setStartDate(newDate)
        $(element).trigger(
            'apply.daterangepicker',
            [newDateObj]
        )
    }

    function changeTimeField($element, newtime) {
         $element.timepicker('setTime',newtime);
    }

    function formatTimeProp(num) {
        return ("0" + num).slice(-2);
    }

    function addNodeClosureButtons() {
        $(".closure-nodes.form-group > wz-label").after("<span id='wmech_nCBNone' class='wmech_closureButton  wmech_nodeClosureButton'>None</span>" +
                                                        "<span id='wmech_nCBAll' class='wmech_closureButton wmech_nodeClosureButton'>All</span>" +
                                                        "<span id='wmech_nCBMiddle'class='wmech_closureButton wmech_nodeClosureButton'>Middle</span>" +
                                                        "<span id='wmech_nCBEnds'class='wmech_closureButton wmech_nodeClosureButton'>Ends</span>");
        $(".wmech_nodeClosureButton").unbind();
        $("#wmech_nCBNone").click(toggleNoNodes);
        $("#wmech_nCBAll").click(toggleAllNodes);
        $("#wmech_nCBMiddle").click(toggleMiddleNodes);
        $("#wmech_nCBEnds").click(toggleEndsNodes);
    }

    function toggleNoNodes(colorize = false) {
        panelToggleNodes(".fromNodeClosed", false, colorize);
        $("#wmech_nCBNone").css('background-color', '#26bae8');
        $("#wmech_nCBAll").css('background-color', '#ddd');
        $("#wmech_nCBMiddle").css('background-color', '#ddd');
        $("#wmech_nCBEnds").css('background-color', '#ddd');
    }

    function toggleAllNodes(colorize = false) {
        panelToggleNodes(".fromNodeClosed", true, colorize);
        $("#wmech_nCBNone").css('background-color', '#ddd');
        $("#wmech_nCBAll").css('background-color', '#26bae8');
        $("#wmech_nCBMiddle").css('background-color', '#ddd');
        $("#wmech_nCBEnds").css('background-color', '#ddd');
    }

    function toggleMiddleNodes(colorize = false) {
        panelToggleNodes(".fromNodeClosed", true, colorize);
        panelToggleNodes(".fromNodeClosed:first", false, colorize);
        panelToggleNodes(".fromNodeClosed:last", false, colorize);
        $("#wmech_nCBNone").css('background-color', '#ddd');
        $("#wmech_nCBAll").css('background-color', '#ddd');
        $("#wmech_nCBMiddle").css('background-color', '#26bae8');
        $("#wmech_nCBEnds").css('background-color', '#ddd');
    }

    function toggleEndsNodes(colorize = false) {
        panelToggleNodes(".fromNodeClosed", false, colorize);
        panelToggleNodes(".fromNodeClosed:first", true, colorize);
        panelToggleNodes(".fromNodeClosed:last", true, colorize);
        $("#wmech_nCBNone").css('background-color', '#ddd');
        $("#wmech_nCBAll").css('background-color', '#ddd');
        $("#wmech_nCBMiddle").css('background-color', '#ddd');
        $("#wmech_nCBEnds").css('background-color', '#26bae8');
    }

    function panelToggleNodes(selector, setting, colorize = false) {
        $(selector).each(function() {
            this.checked = setting;
            $(this).change();
            if (colorize) {
                setTimeout(function() {
                    colorizeRow(this);
                }, 20);
            }
        });
    }

    function colorizeRow(elem) {
        var root = elem; //.shadow-root;
        $(root).find(".wz-slider").css("background-color", "rgb(63, 188, 113)");
        $(elem).parent().parent().css("background-color", "rgba(63, 188, 113, 0.4)");
        $(elem).one("click", function() {
            uncolorizeRow(elem);
        });
    }

    function uncolorizeRow(button) {
        var root = button; // .shadow-root;
        $(root).find(".wz-slider").css("background-color", "");
        $(button).parent().parent().css("background-color", "rgb(242, 244, 247);");
    }

    function addMTERadios() {
        if (radio != "no"){
         $("#closure_eventId").parent().css("height", 0).css("overflow", "hidden");
        $("#closure_eventId").removeAttr("required");
        $(".label-with-tooltip").after("<div id='wmech_mteradiosdiv'><form id='wmech_mteradiosform' name='wmech_mte'></form></div>");
        var to = $("#closure_eventId").children().length - 1;
        for (var i = 0; i < to; i++) {
            var labelText = $("#closure_eventId wz-option:nth-child(" + (i + 1) + ")").text();
            var labelVal = $("#closure_eventId wz-option:nth-child(" + (i + 1) + ")").val();
            $("#wmech_mteradiosform").append('<div><input id="testButton' + i + '" type="radio" name="wmech_mte" data-mte-val="' + labelVal + '"><label for="testButton' + i + '" class="wmech_mtelabel">' + labelText + '</label></div>');
        }
        $('input[type=radio][name="wmech_mte"]').change(function() {
            if (this.id == "testButton0") {
                $("#closure_eventId").removeAttr("value");
            } else {
                $("#closure_eventId").val($(this).data("mte-val")).change();
            }
            $(".wmech_mtelabel").removeClass("wmech_mtelabelselected");
            $("label[for='" + this.id + "']").addClass("wmech_mtelabelselected");
        });
        var firstSelected = $("#closure_eventId").val();
        if (firstSelected == "") {
            $("#closure_eventId").val("").change();
            setTimeout(function() {
                $("#closure_eventId").removeAttr("value");
            }, 100);
            $("input[data-mte-val='']").click();
        } else {
            $("input[data-mte-val='" + firstSelected + "']").click();
        }
        }
        radio = ""
    }

    function checkIfNeedToAddPanelWatcher() {
        setTimeout(function() {
            if ($("#closure_permanent").length == 0) {
                addPanelWatcher();
            } else {
                checkIfNeedToAddPanelWatcher();
            }
        }, 1000);
    }

    function initCSS() {
        log("Initializing CSS.");
        $("<style id='wmechStyle'></style>").appendTo("head");
        $("#wmechStyle").html([
            ".wmechClosureDetailsDiv { background-color: rgba(63, 188, 113, 0.5); margin: 5px; padding: 5px; border-radius: 5px; }",
            ".wmechMainText { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin-bottom: 0px !important; line-height: 1; margin-left: 10px; }",
            ".wmechSettingsLabel { white-space: pre-line !important; display: inline-block; font-weight: none !important; padding-left: 5px; }",
            ".wmechSettingsDiv { position: relative; }",
            ".wmech_input { border-radius: 5px; border: 1px solid lightgray; margin: 1px; height: 25px !important;  }",
            ".wmech_input.wmech_inputregex:nth-of-type(2) { width: 40%}",
            ".wmech_input.wmech_inputregex:nth-of-type(3) { width: 20%}",
            ".wmech_input.wmech_inputregex:nth-of-type(4) { width: 30%}",
            ".wmech_inputpreset { width: 100%; text-align: center; }",
            ".wmech_presetcheckbox { margin-right: 10px !important; margin-top: 5px !important; }",
            ".wmech_closurebutton { font-weight: bold; width: 100%; height: 25px; margin: 2px 0; border-radius: 5px; background-color: white; }",
            "#wmechStringAppendSpan { font-weight: bold; }",
            "#wmechStringAppendSpan::before { content: 'String: '; }",
            ".wmech_colorinputlabel { background-color: black; width: 100%; height: 25px; border-radius: 5px; text-align: center; }",
            ".wmechClosureTrackingContainer { margin-bottom: 2px; font-family: font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border-radius: 5px; background-color: red; clear: both; padding: 5px; } ",
            ".wmechClosureTrackingContainer h2 { line-height: 20px; font-size: 16px; font-weight: bold; padding-bottom: 0px !important; color: white; }",
            ".wmechClosureTrackingContainer ul { list-style-position: inside; background-color: white; padding: 5px; margin-bottom: 0px; border-radius: 5px;} ",
            ".wmechCTCreated { color: purple; } ",
            ".wmechCTUpdated { color: blue; } ",
            ".wmechCTOpened { color: #33b300; } ",
            ".wmechCTButton { margin: 0 2px 2px 0; padding: 2px; font-weight: bold; display: inline-block; background-color: white; border-radius: 2px; font-size: 12px; line-height: 1; } ",
            ".wmechCTPL { color: blue; } ",
            ".wmechCTVisit { color: blue; } ",
            ".wmechCTOpen { background-color: #82b57f; color: white; } ",
            ".wmechCTExtend { background-color: #ffdc00; } ",
            ".wmechCTSubmitPL { background-color: #82b57f; color: white; border-radius: 5px;} ",
            ".wmech_closureButton { text-align: center; font-family: 'Rubik', 'Boing-light', sans-serif; font-weight: 700; border: 1px solid gray; background-color: #ddd; color: black; border-radius: 5px; font-size: 11px; cursor: pointer;} ",
            ".wmech_nodeClosureButton { display: inline-block; width: 23%; margin: 1%;  }",
            ".wmech_dirbutton { width: 100%; margin: 0.3em 0; }",
            ".wmech_buttonNotAllowed { background: lightgray; color: gray; cursor: not-allowed; }",
            ".wmech_colorinput { width: 20%; } ",
            "#wmech_mteradiosdiv { background-color: #f2f4f7; overflow-y: scroll; height: 100px; border: 1px solid gray; border-radius: 5px; padding: 5px; margin-bottom: 2px; } ",
            "input[name='wmech_mte'] { margin-right: 3px; } ",
            ".wmech_lengthExtenderButton { margin: 0 1px; padding: 0 4px; color: black; } ",
            "#wmech_presetchooser { width: 100%; height: 25px; }",
            ".wmech_presetlabel { margin-left: 10px; height: 25px; }",
            ".wmech_presetsetting { margin-right: 10px; float: right; }",
            ".wmech_presetdropdown { height: 25px; } ",
            ".wmech_mtelabel { font-weight: normal; font-size: 14px; }",
            ".wmech_mtelabelselected { font-weight: bold; }",
            ".wmech_seglistchevron { position: absolute; cursor: pointer; font-size: 14px; float: right; width: 100%; text-align: right; margin: 5px 5px 0 0; }",
            ".wmech_presetpermatooltip { margin-left: 10px; }",
            "#wmech_selectAllCheckbox { margin-left: 4px; } ",
            "#wmech_selectAllDiv { margin-bottom: 4px } ",
            "#wmech_selectAllText { font-weight: bold; margin-left: 4px; display: inline }",
            ".wmech_settingsheader { font-weight: bold; margin-bottom: 0 !important; }",
            ".wmech_timezonewarnmessage { text-align: center }",
            ".wmech_timezonewarnmessage span { font-weight: bold; color: black; background-color: red }",
            ".wmech_settingsinput { text-align: center; width: 100%; }",
            ".wmech-tab-pane { width: 100%; display: none; padding: 15px 0; }",
            ".wmech-tab-pane .active { width: 100%; display: block; padding: 15px 0; }",
            ".wmech-alert { background-color: #00FFFF; border-radius: 5px; display: none; }"
        ].join('\n\n'));
    }

    async function clickClosure(elem, dbl = false) {
        if (W.model.actionManager._undoStack.length > 0) {
            return WazeWrap.Alerts.error(GM_info.script.name, "Can't add closure because you have unsaved edits.");
        }
        $("wz-button.add-closure-button").click();
        await new Promise(r => setTimeout(r, 100));
        var ruleIndex = parseInt($(elem).data("preset-val"));
        var nameString = $("#wmech_preset" + (ruleIndex + 1) + "reason").val();
        $("#closure_reason").val(closureName(nameString)).change();
        if ($("#wmech_preset" + (ruleIndex + 1) + "timeString").val().length > 0) {
            var ruleParsed = parseRule($("#wmech_preset" + (ruleIndex + 1) + "timeString").val());
            changeDateField("#closure_endDate", ruleParsed[0]);
//            $("#closure_endDate").val(ruleParsed[0]).change();
            changeTimeField($("#edit-panel div.closures div.form-group.end-date-form-group > div.date-time-picker > wz-text-input.time-picker-input"), ruleParsed[1]);
//            $("#closure_endTime").val(ruleParsed[1]).change();
        }
        var permClosures = $(".wmech_presetcheckbox").eq(ruleIndex).prop("checked");
        if (permClosures) {
            setTimeout(function() {
                $("#closure_permanent").prop("checked", "checked").change();
            }, 50);
        }
        var nodeClosuresOption = $("#wmech_preset" + (ruleIndex + 1) + "nodes").val();
        if (nodeClosuresOption == "Middle") {
            setTimeout(function() {
                toggleMiddleNodes(true);
            }, 50);
        }
        if (nodeClosuresOption == "All") {
            setTimeout(function() {
                toggleAllNodes(true);
            }, 50);
        }
        if (nodeClosuresOption == "Ends") {
            setTimeout(function() {
                toggleEndsNodes(true);
            }, 50);
        }
        if (nodeClosuresOption == "None") {
            setTimeout(function() {
                toggleNoNodes(true);
            }, 50);
        }
        setTimeout(function() {
            $("#closure_reason").css("background-color", "rgba(63, 188, 113, 0.5)");
            $("#closure_endDate").css("background-color", "rgba(63, 188, 113, 0.5)");
            $("#edit-panel div.closures div.form-group.end-date-form-group > div.date-time-picker > wz-text-input.time-picker-input").css("background-color", "rgba(63, 188, 113, 0.5)");
//            $("#closure_endTime").css("background-color", "rgba(63, 188, 113, 0.5)");
            if (permClosures) {
                $(".edit-closure > form > div > #closure_permanent").css("color", "rgba(63, 188, 113, 1)");
            }
        }, 20);
        var direction = $("#wmech_preset" + (ruleIndex + 1) + "direction").val();
        var dirNumber = 3;
        if (direction == "Two Way") {
            dirNumber = 3;
            $("#wmech_dBAB").css('background-color', '#ddd');
            $("#wmech_dBBA").css('background-color', '#ddd');
            $("#wmech_dBTW").css('background-color', '#26bae8');
        } else if (direction == "A --> B") {
            dirNumber = 1;
            $("#wmech_dBAB").css('background-color', '#26bae8');
            $("#wmech_dBBA").css('background-color', '#ddd');
            $("#wmech_dBTW").css('background-color', '#ddd');
        } else if (direction == "B --> A") {
            dirNumber = 2;
            $("#wmech_dBAB").css('background-color', '#ddd');
            $("#wmech_dBBA").css('background-color', '#26bae8');
            $("#wmech_dBTW").css('background-color', '#ddd');
        }
        $("#closure_direction wz-option[value='" + dirNumber + "']").click();

        var mteRegEx = $("#wmech_preset" + (ruleIndex + 1) + "mteString").val();
        if (mteRegEx.length > 0) {
            var mteFuncResult = matchMTE(mteRegEx);
            if (mteFuncResult != false) {
                $("#closure_eventId").val(mteFuncResult.val.toString());
            }
        }else{
            document.querySelector("#closure_eventId > wz-option:nth-child(1)").shadowRoot.querySelector("div").click();
        }
    }

    function matchMTE(match) {
        var mtes = [];
        $("#closure_eventId").children().each(function() {
            var text = $(this).text();
            var val = $(this).val();
            mtes.push({ 'name': text, 'val': val });
        });
        for (var i = 0; i < mtes.length; i++) {
            if (mtes[i].name.toLowerCase() == match.toLowerCase()) {
                console.log(mtes[i]);
                return mtes[i];
            }
        }
        return false;
    }

    function closureName(reason) {
        var finalString = reason;
        var selectedType = getSelectedType(selectedType);
        // Replace with name and type
        finalString = finalString.replace("{{type}}", selectedType);

        // Replace with segs
        var selectedSegs = W.selectionManager.getSegmentSelection().segments;
        var firstSelectedSegName = W.model.streets.getObjectById(selectedSegs[0].attributes.primaryStreetID).attributes.name;
        var lastSelectedSegName = W.model.streets.getObjectById(selectedSegs[selectedSegs.length - 1].attributes.primaryStreetID).attributes.name;
        if (firstSelectedSegName == null) {
            firstSelectedSegName = "";
        }
        if (lastSelectedSegName == null) {
            lastSelectedSegName = "";
        }
        finalString = finalString.replace("{{firstSegName}}", firstSelectedSegName).replace("{{lastSegName}}", lastSelectedSegName);

        // RegEx
        // var replaceRE = new RegExp($("input.wmech_inputregex").val(), $("input.wmech_inputregex").eq(1).val());
        // finalString = finalString.replace(replaceRE, $("input.wmech_inputregex").eq(2).val());

        // Return
        return finalString;
    }

    function getSelectedType(option) {
        var SelObj = W.selectionManager.getSelectedDataModelObjects();
        var rawType = SelObj[0].attributes.roadType;
        var newType;
        switch (rawType) {
            case 8: // Off-road / Not maintained"
                newType = "Road";
                break;
            case 1: // Local Street"
                newType = "Street";
                break;
            case 2: // Primary Street"
                newType = "Primary Street";
                break;
            case 3: // Freeway (Interstate / Other)
                newType = "Freeway";
                break;
            case 6: // Major Highway
                newType = "Highway";
                break;
            case 7: //Minor Highway
                newType = "Highway";
                break;
            case 4: // Ramp
                newType = "Ramp";
                break;
            case 20: // PLR
                newType = "Parking Lot";
                break;
            case 17: // PR
                newType = "Private";
                break;
            case 15: // Ferry
                newType = "Ferry";
                break;
            default: // Other road types
                newType = "Roads";
                break;
        }
               if (SelObj.length > 1) { // If multiple segments selected, check for different road types
                   const multipleTypesSelected = SelObj.some(seg => seg.attributes.roadType !== SelObj[0].attributes.roadType);
                   if (multipleTypesSelected == true) {newType = "Multiple Road Types"};
               }
        return newType;
    }

    function parseRule(rule) {
        //alert(rule);
        var LY = "no";
        var newMon = 0;
        var newDay = 0;
        var d = new Date();
        var yr = d.getFullYear();
        var mon = d.getMonth() + 1;
        var day = d.getDate();
        var hr = d.getHours();
        var min = d.getMinutes();
        if (rule.substring(0, 1) == "U") {
            var count = (rule.match(/,/g) || []).length;
            var timeString = rule.substring(3);
            var ruleHr = parseInt(timeString.substring(0, 2));
            var ruleMin = parseInt(timeString.substring(3, 5));
            // fix for last day of month and adding 1 month with clicksaver to ensure it is actually last day of following month.
        if (yr == "2024" || yr == "2028" || yr == "2032" || yr == "2036" || yr == "2040" || yr == "2044" || yr == "2048") LY = "yes";
            if (mon == "04" || mon == "06" || mon == "07" || mon == "09" || mon == "11" || mon == "12"){
                if (day == "30"){
                    newMon = mon + 1;
                    newDay = 1;
                }else{
                    newMon = mon;
                    newDay = day + 1;
                }
            }else{
                if (mon == "03" || mon == "05" || mon == "08" || mon == "10"){
                    if (day == "31"){
                        newMon = mon + 1;
                        newDay = 1;
                    }else{
                    newMon = mon;
                    newDay = day + 1;
                }
                }else{
                    if (mon == "02" && day > "27" && LY == "no" || mon == "02" && day > "28" && LY == "yes"){
//                        if (LY == "yes" && day > "28"){
                            newMon = mon + 1;
                            newDay = 1;
                        }else{
                            newMon = mon;
                            newDay = day;
                        }
                    }
                }
//       }
            if (count == 0) {
                // (ex. "U: 05:00", "U: 23:15")
                if (ruleHr > hr || (ruleHr == hr && ruleMin > min)) { return [assembleYear([yr, mon, day]), assembleTime([ruleHr, ruleMin])]; }
                if ((ruleHr == hr && ruleMin == min) || (ruleHr == hr && ruleMin < min) || (ruleHr < hr)) { return [assembleYear([yr, newMon, newDay]), assembleTime([ruleHr, ruleMin])]; }
            } else if (count == 1) {
                timeString = rule.substring(3, 8);
                var durationString = rule.substring(rule.lastIndexOf(" ") + 1).trim();
                var newDate = new Date();
                if (durationString.match(/^[M|T|W|F|S]/) == null) {
                    var loopLength = durationString.match(/[a-z]/g).length;
                    //alert(newDate);
                    for (var i = 0; i < loopLength; i++) {
                        var nextNum = durationString.match(/[^(y|o|d|h|m)]*/)[0];
                        var nextLetter = durationString.match(/[a-z]/g)[0];
                        switch (nextLetter) {
                            case "y":
                                newDate.setFullYear(newDate.getFullYear() + parseInt(nextNum));
                                break; //newYr += parseInt(nextNum); break;
                            case "o":
                                newDate.setMonth(newDate.getMonth() + parseInt(nextNum));
                                break; //newMon += parseInt(nextNum); break;
                            case "d":
                                newDate.setDate(newDate.getDate() + parseInt(nextNum));
                                break; //newDay += parseInt(nextNum); break;
                            case "h":
                                newDate.setHours(newDate.getHours() + parseInt(nextNum));
                                break; //newHr += parseInt(nextNum); break;
                            case "m":
                                newDate.setMinutes(newDate.getMinutes() + parseInt(nextNum));
                                break; //newMin += parseInt(nextNum); break;
                        }
                        durationString = durationString.replace(durationString.substring(0, (nextNum + nextLetter).length), "");
                    }
                    if ((ruleHr == hr && ruleMin == min) || (ruleHr == hr && ruleMin < min) || (ruleHr < hr)) { newDate.setDate(newDate.getDate() + 1); }
                } else {
                    var dayOfWeek = durationString;
                    var dOWNum;
                    var dOWNDate = d;
                    if ((ruleHr == hr && ruleMin == min) || (ruleHr == hr && ruleMin < min) || (ruleHr < hr)) { dOWNDate.setDate(dOWNDate.getDate() + 1); }
                    switch (dayOfWeek) {
                        case "Sun":
                            dOWNum = 0;
                            break;
                        case "Mon":
                            dOWNum = 1;
                            break;
                        case "Tue":
                            dOWNum = 2;
                            break;
                        case "Wed":
                            dOWNum = 3;
                            break;
                        case "Thu":
                            dOWNum = 4;
                            break;
                        case "Fri":
                            dOWNum = 5;
                            break;
                        case "Sat":
                            dOWNum = 6;
                            break;
                    }
                    newDate.setDate(dOWNDate.getDate() + (dOWNum + 7 - dOWNDate.getDay()) % 7);
                    //alert(newDate);
                }
                //alert(ruleHr + ruleMin);
                return [assembleYear([newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()]), assembleTime([ruleHr, ruleMin])];
            } else if (count == 2) {
                timeString = rule.substring(3, 8);
                var dayOfWeek = rule.substring(10, 13);
                var durationString = rule.substring(rule.lastIndexOf(" ") + 1).trim();
                var newDate = d;
                var dOWNum;
                //alert(timeString + dayOfWeek + durationString);
                if ((ruleHr == hr && ruleMin == min) || (ruleHr == hr && ruleMin < min) || (ruleHr < hr)) { newDate.setDate(newDate.getDate() + 1); }
                switch (dayOfWeek) {
                    case "Sun":
                        dOWNum = 0;
                        break;
                    case "Mon":
                        dOWNum = 1;
                        break;
                    case "Tue":
                        dOWNum = 2;
                        break;
                    case "Wed":
                        dOWNum = 3;
                        break;
                    case "Thu":
                        dOWNum = 4;
                        break;
                    case "Fri":
                        dOWNum = 5;
                        break;
                    case "Sat":
                        dOWNum = 6;
                        break;
                }
                newDate.setDate(newDate.getDate() + (dOWNum + 7 - newDate.getDay()) % 7);
                var loopLength = durationString.match(/[a-z]/g).length;
                //alert(newDate);
                //alert(loopLength);
                for (var i = 0; i < loopLength; i++) {
                    var nextNum = durationString.match(/[^(y|o|d|h|m)]*/)[0];
                    var nextLetter = durationString.match(/[a-z]/g)[0];
                    switch (nextLetter) {
                        case "y":
                            newDate.setFullYear(newDate.getFullYear() + parseInt(nextNum));
                            break; //newYr += parseInt(nextNum); break;
                        case "o":
                            newDate.setMonth(newDate.getMonth() + parseInt(nextNum));
                            break; //newMon += parseInt(nextNum); break;
                        case "d":
                            newDate.setDate(newDate.getDate() + parseInt(nextNum));
                            break; //newDay += parseInt(nextNum); break;
                        case "h":
                            newDate.setHours(newDate.getHours() + parseInt(nextNum));
                            break; //newHr += parseInt(nextNum); break;
                        case "m":
                            newDate.setMinutes(newDate.getMinutes() + parseInt(nextNum));
                            break; //newMin += parseInt(nextNum); break;
                    }
                    durationString = durationString.replace(durationString.substring(0, (nextNum + nextLetter).length), "");
                }
                //alert(newDate);
                return [assembleYear([newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()]), assembleTime([ruleHr, ruleMin])];
            }
        } else if (rule.substring(0, 1) == "D") {
            // Date closure (ex. "D: 2020-03-14 03:14")
            var date = rule.substring(3, 13);
            var time = rule.substring(14, 19);
            return [assembleYear([date.substring(0, 4), date.substring(5, 7), date.substring(8, 10)]), assembleTime([time.substring(0, 2), time.substring(3, 5)])];
        } else {
            var newDate = new Date();
            var loopLength = rule.match(/[a-z]/g).length;
            for (var i = 0; i < loopLength; i++) {
                var nextNum = rule.match(/[^(y|o|d|h|m)]*/)[0];
                var nextLetter = rule.match(/[a-z]/g)[0];
                switch (nextLetter) {
                    case "y":
                        newDate.setFullYear(newDate.getFullYear() + parseInt(nextNum));
                        break; //newYr += parseInt(nextNum); break;
                    case "o":
                        newDate.setMonth(newDate.getMonth() + parseInt(nextNum));
                        break; //newMon += parseInt(nextNum); break;
                    case "d":
                        newDate.setDate(newDate.getDate() + parseInt(nextNum));
                        break; //newDay += parseInt(nextNum); break;
                    case "h":
                        newDate.setHours(newDate.getHours() + parseInt(nextNum));
                        break; //newHr += parseInt(nextNum); break;
                    case "m":
                        newDate.setMinutes(newDate.getMinutes() + parseInt(nextNum));
                        break; //newMin += parseInt(nextNum); break;
                }
                rule = rule.replace(rule.substring(0, (nextNum + nextLetter).length), "");
            }
            return [assembleYear([newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()]), assembleTime([newDate.getHours(), newDate.getMinutes()])];
        }
    }

    function assembleYear(parts) {
        // parts[0] is yr, parts[1] is mon, parts[2] is day
        //        Lang = I18n.currentLocale()
        if (DateFormat == "mmddyyyy"){
            return addZero(parts[1]) + dateSeparator + addZero(parts[2]) + dateSeparator + parts[0];
        }else{
            if (DateFormat == "yyyymmdd"){
                return parts[0] + dateSeparator + addZero(parts[1]) + dateSeparator + addZero(parts[2]);
            }else{
                if (DateFormat == "ddmmyyyy"){
                    return addZero(parts[2]) + dateSeparator + addZero(parts[1]) + dateSeparator + parts[0];
                }}}}

    function assembleTime(parts) {
        // parts[0] is hr, parts[1] is min
        return addZero(parts[0]) + ":" + addZero(parts[1]);
    }

    function getDate(prop) {
        var d = new Date();
        switch (prop) {
            case "yr":
                return d.getFullYear();
            case "mm":
                return addZero(d.getMonth());
            case "dd":
                return addZero(d.getDate());
            case "hr":
                return addZero(d.getHours());
            case "min":
                return addZero(d.getMinutes());
            case "sec":
                return d.getSeconds();
        }
    }

    function addZero(string, length = 2) {
        return ("0" + string).substr(-length);
    }

    function closureDateToString() {
        return getDate("yr") + "/" + getDate("mm") + "/" + getDate("dd") + " " + getDate("hr") + ":" + getDate("min");
    }

    function log(message) {
        console.log("WMECH: " + message);
    }

    function error(message) {
        console.log("WMECH ERROR: " + message);
    }

    bootstrap();
})();
