"use strict";
// ==UserScript==
// @name         Wanikani: Settings Exporter & Importer
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Imports and exports your WKOF settings
// @author       Kumirei
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441772/Wanikani%3A%20Settings%20Exporter%20%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/441772/Wanikani%3A%20Settings%20Exporter%20%20Importer.meta.js
// ==/UserScript==
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// These lines are necessary to make sure that TSC does not put any exports in the
// compiled js, which causes the script to crash
var module = {};
;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    function init() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                wkof.include('Menu,Settings,Jquery');
                wkof.ready('Jquery,Menu,Settings').then(install_menu).then(install_css);
                return [2 /*return*/];
            });
        });
    }
    // Makes sure that WKOF is installed
    function confirm_wkof() {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                if (!wkof) {
                    response = confirm("".concat(script_name, " requires WaniKani Open Framework.\nClick \"OK\" to be forwarded to installation instructions."));
                    if (response) {
                        window.location.href =
                            'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
                    }
                }
                return [2 /*return*/];
            });
        });
    }
    // Installs the options button in the menu
    function install_menu() {
        var config = {
            name: script_id,
            submenu: 'Open',
            title: script_name,
            on_click: open_settings
        };
        wkof.Menu.insert_script_link(config);
    }
    // Opens settings dialogue when button is pressed
    function open_settings() {
        porter.available_scripts = get_script_ids();
        var config = {
            script_id: script_id,
            title: script_name,
            pre_open: settings_pre_open,
            content: {
                "export": {
                    type: 'page',
                    label: 'Export',
                    content: {
                        select_scripts_export: {
                            type: 'list',
                            "default": {},
                            multi: true,
                            full_width: true,
                            size: 10,
                            label: 'Select Scripts',
                            hover_tip: "Choose which scripts' settings to export",
                            content: Object.fromEntries(porter.available_scripts.map(function (id) { return [id, prettify_script_id(id)]; })),
                            on_change: export_settings
                        },
                        settings_string: {
                            type: 'html',
                            html: "<div class=\"row full\">" +
                                "   <div class=\"left\"><label>Settings string</label></div>" +
                                "   <div class=\"right\">" +
                                "       <textarea disabled id=\"exported_script_settings\" placeholder=\"Your exported settings will appear here\"></textarea>" +
                                "   </div>" +
                                "</div>"
                        },
                        buttons: {
                            type: 'html',
                            html: "<div class=\"porter_buttons\">" +
                                "    <button type=\"button\" action=\"copy\" class=\"ui-button ui-corner-all ui-widget\" title=\"Copy the settings string to your clipboard\">COPY</button>" +
                                "    <button type=\"button\" action=\"save\" class=\"ui-button ui-corner-all ui-widget\" title=\"Save the settings to a file\">SAVE</button>" +
                                "</div>"
                        }
                    }
                },
                "import": {
                    type: 'page',
                    label: 'Import',
                    content: {
                        settings_string: {
                            type: 'html',
                            html: "<div class=\"row full\">" +
                                "   <div class=\"left\"><label>Settings string</label></div>" +
                                "   <div class=\"right\">" +
                                "       <textarea id=\"import_script_settings\" placeholder=\"Paste your exported settings here or load settings from a file below\"></textarea>" +
                                "   </div>" +
                                "</div>"
                        },
                        load_button: {
                            type: 'html',
                            html: "<div class=\"row full\">" +
                                "   <div class=\"left\"><label>(or) Load from file</label></div>" +
                                "   <div class=\"right\"><input type=\"file\" action=\"load\" id=\"import_file\"></div" +
                                "</div>"
                        },
                        import_error: {
                            type: 'html',
                            html: "<div class=\"row full\">" +
                                "   <div id=\"import_error\">There was an error reading the settings</div>" +
                                "</div>"
                        },
                        select_scripts_import: {
                            type: 'list',
                            "default": {},
                            multi: true,
                            size: 10,
                            full_width: true,
                            label: 'Select Scripts',
                            hover_tip: "Choose which scripts' settings to import",
                            content: {}
                        },
                        import_button: {
                            type: 'html',
                            html: "<div class=\"porter_buttons\"><span class=\"success hidden\">Success!</span><button type=\"button\" action=\"import\" class=\"ui-button ui-corner-all ui-widget\" title=\"WARNING: This will override any existing settings for the selected scripts\">IMPORT</button></div>"
                        }
                    }
                }
            }
        };
        var settings_dialog = new wkof.Settings(config);
        settings_dialog.open();
    }
    // Retrieves a list of the available script
    function get_script_ids() {
        return Object.keys(wkof.file_cache.dir)
            .filter(function (key) { return /^wkof.settings..+/.test(key); })
            .map(function (name) { return name.replace('wkof.settings.', ''); });
    }
    // Makes the script ids a bit more user friendly
    function prettify_script_id(id) {
        return id
            .split(/[._]/)
            .map(function (word) { return word[0].toUpperCase() + word.substring(1); })
            .join(' ');
    }
    // Add functionality to buttons and pasting settings
    function settings_pre_open(dialog) {
        porter.dialog = dialog;
        dialog.on('click', 'button', handle_button_press);
        dialog.on('keyup', '#import_script_settings', handle_settings_paste);
        dialog.on('change', '#import_file', import_from_file);
    }
    // Handles the button actions
    function handle_button_press(e) {
        var action = e.currentTarget.attributes.action.value;
        switch (action) {
            case 'copy':
                navigator.clipboard.writeText(porter.exported_settings);
                break;
            case 'save':
                download(porter.exported_settings, "WKOF_settings_export_".concat(new Date().toDateString(), ".txt"));
                break;
            case 'import':
                var selected = porter.dialog.find('[name="select_scripts_import"] :selected');
                var scripts_1 = [];
                // @ts-ignore
                selected.each(function (i, elem) { return scripts_1.push(elem.value); });
                import_settings(scripts_1);
                break;
        }
    }
    // Reads the settings into WKOF
    function import_settings(scripts) {
        for (var _i = 0, scripts_2 = scripts; _i < scripts_2.length; _i++) {
            var script = scripts_2[_i];
            wkof.file_cache.save("wkof.settings.".concat(script), porter.imported_settings[script]);
        }
        // Show success message
        porter.dialog.find('span.success').removeClass('hidden');
    }
    // Lets the user select a file to read for import
    function import_from_file(e) {
        var file = e.currentTarget.files[0];
        if (file.type !== 'text/plain')
            toggle_error_message(true);
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            var _a;
            import_from_text((_a = reader.result) !== null && _a !== void 0 ? _a : '');
        };
        reader.onerror = function () {
            toggle_error_message(true);
        };
    }
    // Parses the the imported settings string
    function handle_settings_paste(e) {
        import_from_text(e.currentTarget.value);
    }
    // Imports from text
    function import_from_text(text) {
        var settings;
        try {
            settings = JSON.parse(text);
            toggle_error_message(false);
            populate_import_selection(settings);
            porter.imported_settings = settings;
        }
        catch (error) {
            toggle_error_message(true);
            return populate_import_selection({});
        }
    }
    // Shows or hides the error message
    function toggle_error_message(on) {
        porter.dialog.attr('import_error', String(on));
    }
    // Populates the selection of which script settings to import
    function populate_import_selection(settings) {
        var elem = porter.dialog.find('[name="select_scripts_import"]');
        var html = '';
        for (var _i = 0, _a = Object.keys(settings); _i < _a.length; _i++) {
            var script = _a[_i];
            html += "<option value=\"".concat(script, "\" selected>").concat(prettify_script_id(script), "</option>");
        }
        elem.html(html);
    }
    // Exports the selected setting to a string and puts them in the textarea
    function export_settings(name, scripts) {
        return __awaiter(this, void 0, void 0, function () {
            var to_export, settings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        to_export = Object.entries(scripts)
                            .filter(function (_a) {
                            var script = _a[0], selected = _a[1];
                            return selected;
                        })
                            .map(function (_a) {
                            var script = _a[0];
                            return script;
                        });
                        return [4 /*yield*/, load_script_settings(to_export)];
                    case 1:
                        settings = _a.sent();
                        porter.exported_settings = JSON.stringify(settings);
                        $('#exported_script_settings').val(porter.exported_settings);
                        return [2 /*return*/];
                }
            });
        });
    }
    // Loads the settings of a list of scripts
    function load_script_settings(scripts) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, _i, scripts_3, script, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        settings = {};
                        _i = 0, scripts_3 = scripts;
                        _c.label = 1;
                    case 1:
                        if (!(_i < scripts_3.length)) return [3 /*break*/, 4];
                        script = scripts_3[_i];
                        _a = settings;
                        _b = script;
                        return [4 /*yield*/, wkof.Settings.load(script)];
                    case 2:
                        _a[_b] = _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, settings];
                }
            });
        });
    }
    // Starts a download for a file
    function download(text, name) {
        var c = document.createElement('a');
        c.download = name;
        var file = new Blob([text], { type: 'text/plain' });
        c.href = window.URL.createObjectURL(file);
        c.click();
    }
    // Installs the css
    function install_css() {
        var css = "\n#wkof_ds #wkofs_settings_exporter .porter_buttons {\n    display: flex;\n    justify-content: right;\n    gap: 0.4em;\n}\n\n#wkof_ds #wkofs_settings_exporter #import_error {\n    line-height: 1em;\n    margin-top: 0.4em;\n    color: red;\n    display: none;\n}\n\n\n#wkof_ds #wkofs_settings_exporter .success {\n    line-height: 1.5em;\n    color: green;\n}\n\n\n#wkof_ds #wkofs_settings_exporter textarea { \n    min-height: 5em;\n    max-width: 100%;\n}\n\n#wkof_ds #wkofs_settings_exporter .porter_buttons_top { margin-bottom: 0.4em; }\n#wkof_ds [aria-describedby=\"wkofs_settings_exporter\"] .ui-dialog-buttonpane { display: none; }\n#wkof_ds #wkofs_settings_exporter[import_error=\"true\"] #import_error { display: block; }\n#wkof_ds #wkofs_settings_exporter #import_file { padding-left: 0; }\n#wkof_ds #wkofs_settings_exporter select { overflow: auto; }\n";
        $('head').append("<style id=\"import-export-css\">".concat(css, "</style>"));
    }
    var script_id, script_name, wkof, porter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                script_id = 'settings_exporter';
                script_name = 'Settings Exporter';
                wkof = window.wkof;
                // Init
                confirm_wkof();
                window.addEventListener('turbo:load', function () {
                    setTimeout(init, 0);
                });
                wkof.include('Jquery');
                return [4 /*yield*/, wkof.ready('Jquery')];
            case 1:
                _a.sent();
                porter = {
                    available_scripts: [],
                    exported_settings: '{}',
                    imported_settings: {},
                    dialog: $()
                };
                return [2 /*return*/];
        }
    });
}); })();
module.exports = null;
