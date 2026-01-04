"use strict";
// ==UserScript==
/** biome-ignore-all assist/source/organizeImports: <explanation> */
// @name                WME MagicWand (Mapomatic Fork)
// @namespace           http://en.advisor.travel/wme-magic-wand
// @description         The very same thing as same tool in graphic editor: select "similar" colored area and create landmark out of it
// @include             https://beta.waze.com/*
// @version             2025.08.09.002
// @require             https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js
// @require             https://cdn.jsdelivr.net/npm/proj4@2.16.2/dist/proj4.min.js
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant               GM_xmlhttpRequest
// @grant               unsafeWindow
// @license             MIT
// @copyright           2018 Vadim Istratov <wpoi@ya.ru>
// @downloadURL https://update.greasyfork.org/scripts/545225/WME%20MagicWand%20%28Mapomatic%20Fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545225/WME%20MagicWand%20%28Mapomatic%20Fork%29.meta.js
// ==/UserScript==
/**
// Special thanks goes to:
// https://github.com/AndriiHeonia/hull
// https://gist.github.com/tixxit/252222
// http://blog.cedric.ws/draw-the-convex-hull-with-canvas-and-javascript
// http://www.iis.sinica.edu.tw/page/jise/2012/201205_10.pdf
// http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment?page=1&tab=active#tab-top
// http://jsfromhell.com/math/is-point-in-poly
// https://gist.github.com/robgaston/8855489
// https://github.com/predein
 */
/*

Copyright (c) 2018 Vadim I.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
/**
 * Contributors: justins83, MapOMatic (2023-?)
 * Karlsosha (2025-)
 */
/* global W */
// import * as turf from "@turf/turf";
// import type { WmeSDK, Venue, VenueCategory, VenueCategoryId, SelectionWithLocalizedTypeName, Segment } from "wme-sdk-typings";
// import proj4 from "proj4";
// import WazeWrap from "https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js";
let sdk;
unsafeWindow.SDK_INITIALIZED.then(() => {
    if (!unsafeWindow.getWmeSdk) {
        throw new Error("SDK is not installed");
    }
    sdk = unsafeWindow.getWmeSdk({
        scriptId: "wme-magicwand",
        scriptName: "WME Magic Wand",
    });
    console.log(`SDK v ${sdk.getSDKVersion()} on ${sdk.getWMEVersion()} initialized`);
    sdk.Events.once({ eventName: "wme-ready" }).then(magicwand);
});
function magicwand() {
    if (!WazeWrap.Ready) {
        setTimeout(() => {
            magicwand();
        }, 100);
        return;
    }
    let DEBUG_LEVEL;
    (function (DEBUG_LEVEL) {
        DEBUG_LEVEL[DEBUG_LEVEL["NONE"] = 0] = "NONE";
        DEBUG_LEVEL[DEBUG_LEVEL["ERROR"] = 1] = "ERROR";
        DEBUG_LEVEL[DEBUG_LEVEL["WARN"] = 2] = "WARN";
        DEBUG_LEVEL[DEBUG_LEVEL["INFO"] = 3] = "INFO";
        DEBUG_LEVEL[DEBUG_LEVEL["DEBUG"] = 4] = "DEBUG";
        DEBUG_LEVEL[DEBUG_LEVEL["TRACE"] = 5] = "TRACE";
    })(DEBUG_LEVEL || (DEBUG_LEVEL = {}));
    ;
    const LOGGING_LEVEL = DEBUG_LEVEL.INFO; // Set the logging level for the script
    const MIN_ZOOM_LEVEL = 17;
    let storedClickCanvasX;
    let storedClickCanvasY;
    let storedViewOffsetX;
    let storedViewOffsetY;
    let MWSettings;
    let lastSaveTime = 0;
    let magic_wand_process = false;
    let magicwand_processing_allowed = false;
    let landmark_dialog = null;
    const MW_VERSION = `${GM_info.script.version}`;
    const GF_LINK = "https://greasyfork.org/en/scripts/398965-wme-magicwand";
    const DOWNLOAD_URL = "https://greasyfork.org/en/scripts/545225-wme-magicwand-mapomatic-fork";
    const FORUM_LINK = "https://www.waze.com/discuss/t/script-wme-magicwand/73830";
    const MW_UPDATE_NOTES = `
<H1>BETA VERSION</H1>
    -<b>WME MagicWand</b> is currently in BETA testing phase.<br>
    -<b>DO NOT USE IT ON PRODUCTION WME</b>.<br><br>
NEW:<br>
    - Conversion to WME SDK<br>
`;
    /* helper function */
    function getElClass(classname, node) {
        if (!node)
            node = document.getElementsByTagName("body")[0];
        const a = [];
        const re = new RegExp(`\\b${classname}\\b`);
        const els = node.getElementsByTagName("*");
        for (let i = 0, j = els.length; i < j; i++)
            if (re.test(els[i].className))
                a.push(els[i]);
        return a;
    }
    function getElId(node) {
        return document.getElementById(node);
    }
    /* =========================================================================== */
    function startScriptUpdateMonitor() {
        try {
            const updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(GM_info.script.name, MW_VERSION, DOWNLOAD_URL, GM_xmlhttpRequest, DOWNLOAD_URL);
            updateMonitor.start();
        }
        catch (ex) {
            // Report, but don't stop if ScriptUpdateMonitor fails.
            console.error("WME Magic Wand:", ex);
        }
    }
    function toggleMagicWandProcessing(id, zoomTrigger = false) {
        let status;
        let bgColor;
        let btnText;
        if (MWSettings._enabled) {
            if (sdk.Map.getZoomLevel() < MIN_ZOOM_LEVEL) {
                bgColor = "black";
                btnText = "ZOOM DISABLED";
                status = "Disabled";
                magicwand_processing_allowed = false;
                $(id).prop("disabled", true);
            }
            else {
                if (!zoomTrigger && !magicwand_processing_allowed) {
                    bgColor = "red";
                    btnText = "STOP MAGIC WAND";
                    status = "Waiting for click";
                }
                else {
                    bgColor = "green";
                    btnText = "START MAGIC WAND";
                    status = "Disabled";
                }
                if (!zoomTrigger)
                    magicwand_processing_allowed = !magicwand_processing_allowed;
            }
            $(id).css("background-color", bgColor);
            $(id).text(btnText);
            updateStatus(status);
        }
    }
    async function initializeMagicWand() {
        startScriptUpdateMonitor();
        // const userInfo = getElId("user-info");
        const userTabs = getElId("user-tabs");
        if (!getElClass("nav-tabs", userTabs)[0]) {
            setTimeout(initializeMagicWand, 1000);
            return;
        }
        // const navTabs = getElClass("nav-tabs", userTabs)[0];
        // const tabContent = getElClass("tab-content", userInfo)[0];
        console.log("WME MagicWand init");
        // add new box to left of the map
        const addon = [
            `
            <div class='mw-header' style='display:block;'>
                <label class='mw-header mw-header-script-name' style='font-weight:bold'><span>WME Magic Wand</span></label>
                <span class="mw-header mw-header-version">v${GM_info.script.version}</span>
            </div>
            <div style='border-bottom:2px double grey'>
                <div class='mw-option-container' style='display:block'>
                    <input type=checkbox class='mw-checkbox  mw-Settings' id='mw-ScriptEnabled' />
                    <label class='mw-label mw-Settings' for='mw-ScriptEnabled'>Enable Script<span class='mw-trans-enabled'></span></label>
                </div>
            </div>
            <div class='mw-advanced-options' id='magicwand-advanced' style='display:block;padding-top:8px;border-bottom:2px double grey'>
                <div class='mw-advanced-options mw-advanced-options-label'>
                    <div class='mw-advance-options mw-advanced-options-title'><span class='mw-advanced-options-title' style='font-weight:bold'>Advanced Editor Options</span></div>
                    <div class='mw-advanced-options mw-advanced-obtions-angle-threshold'>
                        <label class='mw-advanced-options mw-advanced-obtions-angle-threshold mw-advanced-obtions-angle-threshold-label' for='_cMagicWandAngleThreshold'><span>Angle Threshold:</span></label>
                        <input type="text" id="_cMagicWandAngleThreshold" name="_cMagicWandAngleThreshold" class="mw-Settings" value="12" size="3" maxlength="2" />
                    </div>
                </div>
            </div>
            <div class='mw-controls'>
                <div class='mw-script-controls' style='border-bottom:2px double grey;padding-top:8px'>
                    <div class='mw-script-controls mw-script-controls-wrapper'>
                        <div class='magicwand_common magicwand_common_button' style='display:block;'>
                            <label class="magicwand_common magicwand_common_button_label" for='_bMagicWandProcessClick' style='font-weight:bold'><span class='magicwand_common magicwand_common_button_label'>Magic Wand Control:</span></label>
                            <button type="button" class="mw-common-process-click" id="_bMagicWandProcessClick" name="_bMagicWandProcessClick" style="color:white; background-color: green">START MAGIC WAND</button>
                        </div>
                        <div class='magicwand_common magicwand_common_status' style='display:block;'>
                            <label class="magicwand_common_status magicwand_common_status_label" for='_sMagicWandStatus' style='font-weight:bold'>Status: </label>
                            <span id="_sMagicWandStatus">Disabled</span>
                        </div>
                        <div class='magicwand_common magicwand_common_layer' style='display:block;'>
                            <label class="magicwand_common_layer magicwand_common_layer_label" for='_sMagicWandUsedLayer' style='font-weight:bold'>Layer:</label>
                            <span id="_sMagicWandUsedLayer"></span>
                        </div>
                        <div class='magicwand_common magicwand_color_to_match' style='display:block;'>
                            <label class="magicwand_common_color_to_match magicwand_common_color_to_match_label" for='_dMagicWandColorpicker' style='font-weight:bold'>Clicked pixel color to match:</label>
                            <div id="_dMagicWandColorpicker" style="width: 20px; height: 20px; border: 1px solid black;margin-left: 10px;"></div>
                        </div>
                    </div>
                </div>
                <div class='mw-options' style='display:block;border-bottom:2px double grey;padding-top:8px'>
                    <div class='mw-options mw-options-color-algorithm' id='magicwand_advanced' style='display:grid'>
                        <label class='mw-options mw-options-color-algorithm mw-options-color-algorithm-label' for='_rMagicWandColorAlgorithm_color' style='font-weight:bold'><span>Color match algorithm:</span></label>
                        <div class='mw-options mw-options-color-algorithm mw-options-color-algorithm-distance' style='display:block'>
                            <input type="radio" class="mw-Settings" id="_rMagicWandColorAlgorithm_color" name="_rMagicWandColorAlgorithm" value="1" checked="checked" />
                            <label class='mw-options mw-options-color-algorithm mw-options-color-algorithm-distance' for='_rMagicWandColorAlgorithm_color'><span>Color Distance<span></label>
                        </div>
                        <div class='mw-options mw-options-color-algorithm mw-options-color-algorithm-lab' style='display:block'>
                            <input type="radio" class="mw-Settings" id="_rMagicWandColorAlgorithm_lab" name="_rMagicWandColorAlgorithm" value="2" />
                            <label class='mw-options mw-options-color-algorithm mw-options-color-algorithm-distance' for='_rMagicWandColorAlgorithm_lab'><span>Human-eye Similarity</span></label>
                        </div>
                    </div>
                    <div class='mw-options mw-options-color-tolerance'>
                        <table>
                            <tr>
                                <td style="padding-left:4px"><label for="_cMagicWandSimilarity">Tolerance:</label></td>
                                <td style="padding-left:4px"><input type="number" id="_cMagicWandSimilarity" name="_cMagicWandSimilarity" value="8" min="4" max="100" step="1" /></td>
                                <td style="padding-left:4px"><span style="text-wrap:balanced">Around 4-10, >20 very slow</span></td>
                            </tr>
                        </table>
                    </div>
                    <div class='mw-options mw-options-color-sampling' style='display:block'>
                        <table>
                            <tr>
                                <td style="padding-left:4px"><label class='mw-options mw-options-color-sampling' for="_cMagicWandSampling">Sampling mask size</label></td>
                                <td style="padding-left:4px"><input type="number" id="_cMagicWandSampling" name="_cMagicWandSampling" value="3" min="1" max="9" step="1" /></td>
                                <td style="padding-left:4px"><span style="text-wrap:balanced">Usually 1-3, larger - smoother and more greedy</span></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class='mw-landmark-options' style='display:block;border-bottom:2px double grey;padding-top:8px'>
                    <div class='mw-landmark-options mw-landmark-options-wrapper'>
                        <div class='mw-landmark-options mw-landmark-options-plr-container'>
                            <input type=checkbox class='mw-landmark-options mw-checkbox' id='mw-ignorePLR' />
                            <label class='mw-label' for='mw-ignorePLR'><span class='mw-ignorePLR'>Ignore PLR for Address</span></label>
                        </div>
                        <div class='mw-landmark-options mw-landmark-options-pr-container'>
                            <input type=checkbox class='mw-landmark-options mw-checkbox' id='mw-ignoreunnamePR' />
                            <label class='mw-label' for='mw-ignoreunnamePR'><span class='mw-ignoreunnamePR'>Ignore Unnamed PR for Address</span></label>
                        </div>

                    </div>
                </div>
            </div>
        `,
        ].join(" ");
        // const newtab = document.createElement("li");
        // newtab.innerHTML = '<a href="#sidepanel-magicwand" data-toggle="tab">MagicWand</a>';
        // navTabs.appendChild(newtab);
        // addon.id = "sidepanel-magicwand";
        // addon.className = "tab-pane";
        // tabContent.appendChild(addon);
        sdk.Sidebar.registerScriptTab().then((r) => {
            r.tabLabel.innerHTML = "MagicWand";
            r.tabPane.innerHTML = addon;
            loadWMEMagicWandSettings().then(() => {
                landmark_dialog = populateLandmarks();
                $("#mw-ScriptEnabled").on("click", (e) => {
                    MWSettings._enabled = e.target.checked;
                });
                document.getElementById("mw-ScriptEnabled").checked = MWSettings._enabled;
                toggleMagicWandProcessing("#_bMagicWandProcessClick", true);
            });
            // UI listeners
            $(".mw-common-process-click").on("click", (e) => {
                toggleMagicWandProcessing("#" + e.target.id);
            });
            $(".mw-checkbox").on("click", function () {
                const settingName = $(this)[0].id.substring(3);
                MWSettings[settingName] = this.checked;
                saveWMEMagicWandOptions();
            });
        });
        // Hotkeys
        registerKeyShortcut("WMEMagicWand_HighlightLandmark", "Highlight Landmarks", highlightLandmarks, "C+k");
        WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, GM_info.script.version, MW_UPDATE_NOTES, GF_LINK, FORUM_LINK);
        // Start extension
        WMELandmarkMagicWand();
    }
    async function loadWMEMagicWandSettings() {
        console.log("WME MagicWand: loading options");
        const defaultOptions = {
            _enabled: false,
            _sMagicWandLandmark: "",
            _cMagicWandSimilarity: 0,
            _cMagicWandSampling: 0,
            _cMagicWandAngleThreshold: 0,
            lastSaveAction: 0,
            ignorePLR: true, // Parking Lot Road
            ignoreUnnamedPR: true, // Ignore Unnamed Private Road
        };
        const storedOptions = localStorage.getItem("WMEMagicWandScript");
        const options = !storedOptions ? null : JSON.parse(storedOptions);
        const serverSettings = await WazeWrap.Remote.RetrieveSettings("WMEMagicWandScript");
        if (!serverSettings) {
            console.log("Unable to Retrieve Settings from Server");
        }
        MWSettings = $.extend({}, defaultOptions, options);
        if (serverSettings && serverSettings.lastSaveAction > MWSettings.lastSaveAction) {
            $.extend(MWSettings, serverSettings);
        }
        else {
            console.log("MagicWand: local settings are used");
        }
        if (MWSettings.ignorePLR) {
            $("#mw-ignorePLR").trigger("click");
        }
        if (MWSettings.ignoreUnnamedPR) {
            $("#mw-ignoreunnamePR").trigger("click");
        }
        // for (let i = 0; i < getElId("_sMagicWandLandmark")?.options.length; i++) {
        //     if (getElId("_sMagicWandLandmark")?.options[i].value === options[2]) {
        //         MWSettings._sMagicWandLandmark = true;
        //         break;
        //     }
        // }
        // getElId("_cMagicWandSimilarity")?.value = typeof options[3] !== "undefined" ? options[3] : 9;
        // // getElId('_cMagicWandSimplification').value = typeof options[4] !== 'undefined' ? options[4] : 4;
        // getElId("_cMagicWandSampling").value = typeof options[5] !== "undefined" ? options[5] : 3;
        // getElId("_cMagicWandAngleThreshold").value = typeof options[6] !== "undefined" ? options[6] : 12;
    }
    function registerKeyShortcut(action_name, annotation, callback, key_map) {
        sdk.Shortcuts.createShortcut({
            callback: callback,
            description: annotation,
            shortcutId: action_name,
            shortcutKeys: key_map,
        });
        // W.accelerators.addAction(action_name, { group: "default" });
        // W.accelerators.events.register(action_name, null, callback);
        // W.accelerators._registerShortcuts(key_map);
    }
    function saveWMEMagicWandOptions() {
        const currentTime = Date.now();
        if (localStorage && currentTime - lastSaveTime > 5000 /* Check if last Save was more than 5 seconds ago */) {
            console.log("WME MagicWand: saving options");
            localStorage.setItem("WMEMagicWandScript", JSON.stringify(MWSettings));
            WazeWrap.Remote.SaveSettings("WMEMagicWandScript", MWSettings);
            lastSaveTime = currentTime;
        }
    }
    const highlightLandmarks = () => {
        if (!$("#_cMagicWandHighlight").prop("checked")) {
            return;
        }
        const venues = sdk.DataModel.Venues.getAll();
        // const venues = W.model.venues.getObjectArray();
        for (const mark of venues) {
            // const mark: Venue = venues[i];
            // const SelectedLandmark = W.model.venues.get(mark);
            if (mark.geometry.type === "Point") {
                continue;
            }
            const SelectedLandmark = sdk.DataModel.Venues.getById({ venueId: mark.id });
            if (!SelectedLandmark || SelectedLandmark.geometry.type === "Point") {
                continue;
            }
            const editingSelection = sdk.Editing.getSelection();
            // check that WME hasn't highlighted this object already
            if (!editingSelection ||
                mark.venueUpdateRequests.length > 0 ||
                editingSelection.objectType !== "venue" ||
                mark.id !== editingSelection.ids[0]) {
                continue;
            }
            // if already highlighted by us or by WME Color Hightlight, avoid conflict and skip
            if (poly && poly.getAttribute("stroke-opacity") === "0.987") {
                continue;
            }
            // if highlighted by mouse over, skip this one
            if (poly && poly.getAttribute("fill") === poly.getAttribute("stroke")) {
                continue;
            }
            // flag this venue as highlighted so we don't update it next time
            poly.setAttribute("stroke-opacity", 0.987);
            const newWay = OrthogonalizeId(SelectedLandmark?.geometry.coordinates);
            for (let j = 0; j < newWay.length; j++) {
                if (newWay[j] === false ||
                    Math.abs(SelectedLandmark.geometry.components[0].components[j].x - newWay[j].x) > 2 ||
                    Math.abs(SelectedLandmark.geometry.components[0].components[j].y - newWay[j].y) > 2) {
                    highlightAPlace(SelectedLandmark, "#FFC138", "#FFD38D");
                    break;
                }
            }
        }
    };
    // WME Color Highlights by Timbones
    function highlightAPlace(venue, fg, bg) {
        if (venue.geometry.type !== "Polygon") {
            poly.setAttribute("fill", fg);
        }
        else {
            // area
            poly.setAttribute("stroke", fg);
            poly.setAttribute("fill", bg);
        }
    }
    // Point class
    class MagicPoint {
        x;
        y;
        static distance(pt1, pt2) {
            return pt1.distance(pt2);
        }
        static interpolate(pt1, pt2, f) {
            return pt1.interpolate(pt2, f);
        }
        static subtractPoints(pt1, pt2) {
            return pt1.subtract(pt2);
        }
        constructor(position) {
            if (position.length !== 2) {
                throw new Error("Logic Error.  Position has to have just X and Y Coordinates");
            }
            this.x = position[0];
            this.y = position[1];
        }
        toString() {
            return `(x=${this.x}, y=${this.y})`;
        }
        rotateRight(p1, p2) {
            // cross product, + is counterclockwise, - is clockwise
            return p2.x * this.y - p2.y * this.x - (p1.x * this.y - p1.y * this.x) + (p1.x * p2.y - p1.y * p2.x) < 0;
        }
        add(v) {
            return new MagicPoint([this.x + v.x, this.y + v.y]);
        }
        clone() {
            return new MagicPoint([this.x, this.y]);
        }
        degreesTo(v) {
            const dx = this.x - v.x;
            const dy = this.y - v.y;
            const angle = Math.atan2(dy, dx); // radians
            return angle * (180 / Math.PI); // degrees
        }
        distance(v) {
            const x = this.x - v.x;
            const y = this.y - v.y;
            return Math.sqrt(x * x + y * y);
        }
        equals(toCompare) {
            return this.x === toCompare.x && this.y === toCompare.y;
        }
        interpolate(v, f) {
            return new MagicPoint([(this.x + v.x) * f, (this.y + v.y) * f]);
        }
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        normalize(thickness) {
            const l = this.length();
            this.x = (this.x / l) * thickness;
            this.y = (this.y / l) * thickness;
        }
        orbit(origin, arcWidth, arcHeight, degrees) {
            const radians = degrees * (Math.PI / 180);
            this.x = origin.x + arcWidth * Math.cos(radians);
            this.y = origin.y + arcHeight * Math.sin(radians);
        }
        offset(dx, dy) {
            this.x += dx;
            this.y += dy;
        }
        subtract(v) {
            return new MagicPoint([this.x - v.x, this.y - v.y]);
        }
        polar(len, angle) {
            return new MagicPoint([len * Math.cos(angle), len * Math.sin(angle)]);
        }
        toPosition() {
            return [this.x, this.y];
        }
    }
    const OrthogonalizeId = (geometry, threshold = 12) => {
        const nomthreshold = threshold, // degrees within right or straight to alter
        lowerThreshold = Math.cos(((90 - nomthreshold) * Math.PI) / 180), upperThreshold = Math.cos((nomthreshold * Math.PI) / 180);
        function Orthogonalize() {
            if (!geometry || geometry.length === 0) {
                return [];
            }
            let nodes = structuredClone(geometry[0]), points = nodes.slice(0, -1).map((n) => {
                const p = [...n];
                p[1] = lat2latp(p[1]);
                return p;
            }), corner = { i: 0, dotp: 1 }, epsilon = 1e-4, motions = [], score = 0;
            // Triangle
            if (points.length === 4) {
                for (let i = 0; i < 1000; i++) {
                    motions = points.map(calcMotion);
                    const tmp = addPoints(points[corner.i], motions[corner.i]);
                    points[corner.i][0] = tmp[0];
                    points[corner.i][1] = tmp[1];
                    score = corner.dotp;
                    if (score < epsilon)
                        break;
                }
                const n = points[corner.i];
                n[1] = latp2lat(n[1]);
                const pp = n;
                const id = nodes[corner.i].toString();
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].toString() !== id)
                        continue;
                    nodes[i][0] = pp[0];
                    nodes[i][1] = pp[1];
                }
                return nodes;
            }
            const originalPoints = nodes.slice(0, -1).map((n) => {
                const p = [...n];
                p[1] = lat2latp(p[1]);
                return p;
            });
            score = Number.POSITIVE_INFINITY;
            for (let i = 0; i < 1000 && !(score < epsilon); i++) {
                motions = points.map(calcMotion);
                for (let j = 0; j < motions.length; j++) {
                    const tmp = addPoints(points[j], motions[j]);
                    points[j][0] = tmp[0];
                    points[j][1] = tmp[1];
                }
                const newScore = squareness(points);
                if (newScore < score) {
                    // best = [].concat(points);
                    score = newScore;
                }
                // if (score < epsilon)
                //     break;
            }
            // points = best;
            for (let i = 0; i < points.length; i++) {
                // only move the points that actually moved
                if (originalPoints[i][0] !== points[i][0] || originalPoints[i][1] !== points[i][1]) {
                    const n = points[i];
                    n[1] = latp2lat(n[1]);
                    const pp = n;
                    const id = nodes[i].toString();
                    for (let j = 0; j < nodes.length; j++) {
                        if (nodes[j].toString() !== id)
                            continue;
                        nodes[j][0] = pp[0];
                        nodes[j][1] = pp[1];
                    }
                }
            }
            // remove empty nodes on straight sections
            for (let i = 0; i < points.length; i++) {
                const dotp = normalizedDotProduct(i, points);
                if (dotp < -1 + epsilon) {
                    const id = nodes[i].toString();
                    for (let j = 0; j < nodes.length; j++) {
                        if (nodes[j].toString() !== id)
                            continue;
                        nodes[j] = [];
                    }
                }
            }
            return nodes.filter((item) => item.length > 0);
            function calcMotion(b, i, array) {
                let a = array[(i - 1 + array.length) % array.length], c = array[(i + 1) % array.length], p = subtractPoints(a, b), q = subtractPoints(c, b);
                const scale = 2 * Math.min(euclideanDistance(p, [0, 0]), euclideanDistance(q, [0, 0]));
                p = normalizePoint(p, 1.0);
                q = normalizePoint(q, 1.0);
                let dotp = filterDotProduct(p[0] * q[0] + p[1] * q[1]);
                // nasty hack to deal with almost-straight segments (angle is closer to 180 than to 90/270).
                if (array.length > 3) {
                    if (dotp < -Math.SQRT1_2)
                        dotp += 1.0;
                }
                else if (dotp && Math.abs(dotp) < corner.dotp) {
                    corner.i = i;
                    corner.dotp = Math.abs(dotp);
                }
                return normalizePoint(addPoints(p, q), 0.1 * dotp * scale);
            }
        }
        function lat2latp(lat) {
            return (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (lat * (Math.PI / 180)) / 2));
        }
        function latp2lat(a) {
            return (180 / Math.PI) * (2 * Math.atan(Math.exp((a * Math.PI) / 180)) - Math.PI / 2);
        }
        function squareness(points) {
            return points.reduce((sum, _val, i, array) => {
                let dotp = normalizedDotProduct(i, array);
                dotp = filterDotProduct(dotp);
                return sum + 2.0 * Math.min(Math.abs(dotp - 1.0), Math.min(Math.abs(dotp), Math.abs(dotp + 1)));
            }, 0);
        }
        function normalizedDotProduct(i, points) {
            let a = points[(i - 1 + points.length) % points.length], b = points[i], c = points[(i + 1) % points.length], p = subtractPoints(a, b), q = subtractPoints(c, b);
            p = normalizePoint(p, 1.0);
            q = normalizePoint(q, 1.0);
            return p[0] * q[0] + p[1] * q[1];
        }
        function subtractPoints(a, b) {
            return [a[0] - b[0], a[1] - b[1]];
        }
        function addPoints(a, b) {
            return [a[0] + b[0], a[1] + b[1]];
        }
        function euclideanDistance(a, b) {
            const x = a[0] - b[0], y = a[1] - b[1];
            return Math.sqrt(x * x + y * y);
        }
        function normalizePoint(point, scale) {
            const vector = [0, 0];
            const length = Math.sqrt(point[0] * point[0] + point[1] * point[1]);
            if (length !== 0) {
                vector[0] = point[0] / length;
                vector[1] = point[1] / length;
            }
            vector[0] *= scale;
            vector[1] *= scale;
            return vector;
        }
        function filterDotProduct(dotp) {
            if (lowerThreshold > Math.abs(dotp) || Math.abs(dotp) > upperThreshold)
                return dotp;
            return 0;
        }
        return Orthogonalize();
    };
    function updateStatus(status) {
        $("#_sMagicWandStatus").html(status);
        $("#magicwand_common").hide().show();
    }
    function populateLandmarks() {
        // Shamelessly copied from WME PIE - Karlsosha
        const $places = $("<div>", { style: "padding:8px 16px" });
        function _getCategorySubCategoryOptions() {
            const venueAllCategories = sdk.DataModel.Venues.getAllVenueCategories();
            const mainCategories = new Map();
            const nameSet = new Set();
            const res = [];
            const venueCategories = sdk.DataModel.Venues.getVenueMainCategories();
            for (const vc of venueCategories) {
                mainCategories.set(vc.id, { localizedName: vc.localizedName, processed: false });
                nameSet.add(vc.localizedName);
            }
            const venueSubCategories = sdk.DataModel.Venues.getVenueSubCategories();
            for (const vsc of venueSubCategories) {
                const mc = mainCategories.get(vsc.categoryId);
                nameSet.add(vsc.localizedName);
                if (mc !== null) {
                    if (!mc.processed) {
                        res.push(`<option value="${vsc.categoryId}" data-icon="${vsc.categoryId.toLowerCase().replaceAll("_", "-")}" style="font-weight:bold;">${mc.localizedName}</option>`);
                        mc.processed = true;
                    }
                    res.push(`<option value="${vsc.subCategoryId}" data-icon="${vsc.categoryId.toLowerCase().replaceAll("_", "-")}"">${vsc.localizedName}</option>`);
                }
            }
            for (const vac of venueAllCategories) {
                if (nameSet.has(vac.localizedName))
                    continue; // already processed
                nameSet.add(vac.localizedName);
                res.push(`<option value="${vac.id}" data-icon="${vac.id.toLowerCase().replaceAll("_", "-")}"">${vac.localizedName}</option>`);
            }
            return res;
        }
        const categories = _getCategorySubCategoryOptions();
        const htmlItems = [
            `<div id="mwLandmarkSelection" style="padding:8px 16px; position:fixed; border-radius:10px; box-shadow:5px 5px 10px silver; top:25%; left:30%; background-color:white; min-width:100px; min-height:100px;">`,
            `<label class='mw-options mw-options-landmark mw-options-landmark-label' id='mw-options-landmark-label' for='_sMagicWandLandmark'><span>Landmark type:</span></label>`,
            `<select id="_sMagicWandLandmark" name="_sMagicWandLandmark" class="mw-Settings" style="width: 95%">`
        ];
        htmlItems.push(...categories);
        htmlItems.push("</select>", '<button id="mwLandmarkSelectedButton">Apply</button>', '<button id="mwLandmarkCancelButton">Cancel</button>', "</div>");
        $places.html(htmlItems.join(" "));
        return $places;
    }
    function WMELandmarkMagicWand() {
        const MAX_CONCAVE_ANGLE_COS = Math.cos(90 / (180 / Math.PI)); // angle = 90 deg
        const MAX_SEARCH_BBOX_SIZE_PERCENT = 0.6;
        // const { W } = window;
        let layer;
        let canvas;
        let draw_canvas;
        let total_tiles;
        let clickCanvasX;
        let clickCanvasY;
        let viewOffsetX;
        let viewOffsetY;
        let context;
        let color_sensitivity;
        let color_distance;
        let color_algorithm;
        let sampling = 3;
        let waited_for = 0;
        let is_reload_tiles = false;
        // $(document).on('click', ".mw-Settings", () => {
        //     saveWMEMagicWandOptions();
        // });
        $(document).on("change", ".mw-Settings", () => {
            saveWMEMagicWandOptions();
        });
        sdk.Events.on({
            eventName: "wme-map-move-end",
            eventHandler: () => {
                is_reload_tiles = true;
            },
        });
        sdk.Events.on({
            eventName: "wme-map-zoom-changed",
            eventHandler: () => {
                is_reload_tiles = true;
                toggleMagicWandProcessing("#_bMagicWandProcessClick", true);
                if (sdk.Map.getZoomLevel() < MIN_ZOOM_LEVEL) {
                    resetProcessState();
                }
                else {
                    $("#_bMagicWandProcessClick").prop("disabled", false);
                }
            },
        });
        // W.map.events.register("changebaselayer", null, () => {
        //     is_reload_tiles = true;
        // });
        sdk.Events.on({
            eventName: "wme-map-mouse-up",
            eventHandler(pixel) {
                try {
                    if (!MWSettings._enabled || !magicwand_processing_allowed || magic_wand_process) {
                        return;
                    }
                    magic_wand_process = true;
                    // Get current active layer to process
                    layer = null;
                    const is_imagery_enabled = W.layerSwitcherController.getTogglerState("ITEM_SATELLITE_IMAGERY");
                    if (is_imagery_enabled) {
                        $("#_sMagicWandUsedLayer").html("ITEM_SATELLITE_IMAGERY");
                        layer = W.map.getLayerByUniqueName("satellite_imagery");
                        // for(const l of visible_layers) {
                        //     console.log(`Layer Name: ${l.name}`)
                        //     if(l.name === "satellite_imagery") { layer = l; break; }
                        // }
                    }
                    else {
                        resetProcessState();
                        alert("Please make of the base layers active (default to Google)");
                        return;
                    }
                    // simplify_param = parseInt(getElId('_cMagicWandSimplification').value, 10);
                    color_sensitivity = Number.parseInt(getElId("_cMagicWandSimilarity").value, 10);
                    color_distance = Number.parseInt(getElId("_cMagicWandSimilarity").value, 10);
                    color_algorithm = getElId("_rMagicWandColorAlgorithm_lab").checked
                        ? "LAB"
                        : "sensitivity";
                    sampling = Number.parseInt(getElId("_cMagicWandSampling").value, 10);
                    const LatLon = sdk.Map.getLonLatFromPixel(pixel);
                    const olProj = proj4("EPSG:4326", "EPSG:3857", [LatLon.lon, LatLon.lat]);
                    const olLatLon = {
                        lon: olProj[0],
                        lat: olProj[1],
                    };
                    // const pt: GeoJSON.Point = turf.point([LatLon.lon, LatLon.lat]);
                    // const olLatLon = W.userscripts.toOLGeometry(pt);
                    // LatLon = { lon: olLatLon.x, lat: olLatLon.y };
                    const tile_size = layer.grid[0][0].size;
                    updateStatus("Creating canvas");
                    if (canvas && context !== undefined) {
                        if (is_reload_tiles) {
                            canvas.width = tile_size.h * layer.grid[0].length;
                            canvas.height = tile_size.w * layer.grid.length;
                            context?.clearRect(0, 0, canvas.width, canvas.height);
                        }
                    }
                    else {
                        canvas = document.createElement("canvas");
                        canvas.width = tile_size.h * layer.grid[0].length;
                        canvas.height = tile_size.w * layer.grid.length;
                        context = canvas.getContext("2d");
                    }
                    if (!draw_canvas) {
                        draw_canvas = document.createElement("canvas");
                    }
                    draw_canvas.width = canvas.width;
                    draw_canvas.height = canvas.height;
                    total_tiles = layer.grid.length * layer.grid[0].length;
                    waited_for = 0;
                    let clientX;
                    let clientY;
                    let offsetX;
                    let offsetY;
                    let imageX;
                    let imageY;
                    let tile;
                    let img;
                    let location;
                    updateStatus("Pre-processing tiles");
                    for (let tilerow = 0; tilerow < layer.grid.length; tilerow++) {
                        for (let tilei = 0; tilei < layer.grid[tilerow].length; tilei++) {
                            tile = layer.grid[tilerow][tilei];
                            if (tile.bounds.containsLonLat(olLatLon, false)) {
                                // Click position on div image
                                clientX = pixel.x;
                                clientY = pixel.y;
                                offsetX = $(tile.imgDiv).position().left;
                                offsetY = $(tile.imgDiv).position().top;
                                imageX = clientX - offsetX;
                                imageY = clientY - offsetY;
                                clickCanvasX = tile_size.w * tilei + imageX;
                                clickCanvasY = tile_size.h * tilerow + imageY;
                                viewOffsetX = pixel.viewportX - clickCanvasX;
                                viewOffsetY = pixel.viewportY - clickCanvasY;
                            }
                            // No need to reload tiles
                            if (!is_reload_tiles &&
                                !($("img[data-default_url]").length > 0 && $("img[data-coords]").length > 0)) {
                                continue;
                            }
                            updateStatus("Loading tiles");
                            // Have to recreate image - image should have crossOrigin attribute set to "anonymous"
                            img = document.createElement("img");
                            $(img).data("tilei", tilei).data("tilerow", tilerow).attr("crossOrigin", "anonymous");
                            img.onload = function onload() {
                                const tilei1 = $(this).data("tilei");
                                const tilerow1 = $(this).data("tilerow");
                                // Add tile to canvas
                                context?.drawImage(this, tile_size.w * tilei1, tile_size.h * tilerow1, this.width, this.height);
                                total_tiles--;
                            };
                            img.onerror = function onerror(e1) {
                                console.log("WME MagicWand: Cannot load tile: ", e1);
                            };
                            let img_url = tile.url;
                            // Experimental support for Map Overlays extension
                            // DO NOT USE FOR EDITS
                            const alt_img = $(`img[data-default_url="${img_url}"]`);
                            if (alt_img.length > 0) {
                                img_url = alt_img[0].src;
                            }
                            location = getLocation(img_url);
                            img.src = `${img_url + (typeof location.search === "undefined" || location.search === "" ? "?" : "&")}dummy=wmemagicwand`;
                        }
                    }
                    if (is_reload_tiles) {
                        waitForLoad();
                    }
                    else {
                        if (LOGGING_LEVEL >= DEBUG_LEVEL.DEBUG) {
                            if (!storedClickCanvasX || !storedClickCanvasY || !storedViewOffsetX || !storedViewOffsetY) {
                                storedClickCanvasX = clickCanvasX;
                                storedClickCanvasY = clickCanvasY;
                                storedViewOffsetX = viewOffsetX;
                                storedViewOffsetY = viewOffsetY;
                            }
                            else {
                                clickCanvasX = storedClickCanvasX;
                                clickCanvasY = storedClickCanvasY;
                                viewOffsetX = storedViewOffsetX;
                                viewOffsetY = storedViewOffsetY;
                            }
                            console.debug(`WME MagicWand: clickCanvasX=${clickCanvasX}, clickCanvasY=${clickCanvasY}, viewOffsetX=${viewOffsetX}, viewOffsetY=${viewOffsetY}`);
                        }
                        process();
                    }
                }
                catch (ex) {
                    console.log(ex);
                }
                finally {
                    magic_wand_process = false;
                }
            },
        });
        function waitForLoad() {
            waited_for++;
            if (total_tiles > 0) {
                if (waited_for > 25) {
                    alert(`Waiting too long for tiles to be reloaded, tiles left to load: ${total_tiles}`);
                    resetProcessState();
                    return;
                }
                setTimeout(waitForLoad, 200);
            }
            else {
                is_reload_tiles = false;
                process();
            }
        }
        function getPixelInfo(canvas_data, x, y) {
            const offset = (y * canvas.width + x) * 4;
            return [canvas_data[offset], canvas_data[offset + 1], canvas_data[offset + 2], canvas_data[offset + 3]];
        }
        function getPixelAverageSample(canvas_data, x, y) {
            let sample_info = [];
            const average = [0, 0, 0, 0];
            let total_samples = 0;
            for (let xi = x - sampling; xi < x + sampling; xi++) {
                for (let yi = y - sampling; yi < y + sampling; yi++) {
                    if (xi < 0 || yi < 0 || xi >= canvas.width || yi >= canvas.height) {
                        continue;
                    }
                    total_samples++;
                    sample_info = getPixelInfo(canvas_data, xi, yi);
                    average[0] += sample_info[0];
                    average[1] += sample_info[1];
                    average[2] += sample_info[2];
                    average[3] += sample_info[3];
                }
            }
            return [
                average[0] / total_samples,
                average[1] / total_samples,
                average[2] / total_samples,
                average[3] / total_samples,
            ];
        }
        function process() {
            let canvas_data = context?.getImageData(0, 0, canvas.width, canvas.height, {}).data;
            if (!canvas_data) {
                resetProcessState("Canvas data is not available");
                return;
            }
            const ref_pixel = getPixelInfo(canvas_data, clickCanvasX, clickCanvasY);
            const draw_canvas_context = draw_canvas.getContext("2d");
            draw_canvas_context?.drawImage(canvas, 0, 0);
            $("#_dMagicWandColorpicker").css("background-color", `rgb(${ref_pixel[0]},${ref_pixel[1]},${ref_pixel[2]})`);
            $("#magicwand_common").hide().show();
            let current_pixel;
            let processed_pixels = {};
            const polyPixels = [];
            let g = 0;
            const stack = [[clickCanvasX, clickCanvasY]];
            let x;
            let y;
            let c_pixel;
            updateStatus("Processing tiles image");
            const id = draw_canvas_context?.createImageData(1, 1);
            const d = id?.data;
            if (!d) {
                resetProcessState("Canvas data is not available");
                return;
            }
            d[0] = 255;
            d[1] = 0;
            d[2] = 0;
            d[3] = 255; // red
            while (stack.length > 0 && g < 1500000) {
                g++;
                current_pixel = stack.pop();
                if (!current_pixel) {
                    continue;
                }
                // Already processed before
                if (processed_pixels[`${current_pixel[0]},${current_pixel[1]}`]) {
                    continue;
                }
                else {
                    processed_pixels[`${current_pixel[0]},${current_pixel[1]}`] = true;
                }
                if (current_pixel[0] < 0 || current_pixel[0] >= canvas.width)
                    continue;
                if (current_pixel[1] < 0 || current_pixel[1] >= canvas.height)
                    continue;
                x = current_pixel[0];
                y = current_pixel[1];
                c_pixel = getPixelAverageSample(canvas_data, x, y);
                if ((color_algorithm === "sensitivity" && !colorDistance(c_pixel, ref_pixel)) ||
                    (color_algorithm === "LAB" && calcColorDistance(c_pixel, ref_pixel) < color_distance)) {
                    // Outer pixel found
                    polyPixels.push([x + viewOffsetX, y + viewOffsetY]);
                    // Inner point, add neighboring points to the stack
                    if (!processed_pixels[`${current_pixel[0] - 1},${current_pixel[1]}`]) {
                        stack.push([current_pixel[0] - 1, current_pixel[1]]);
                    }
                    if (!processed_pixels[`${current_pixel[0] + 1},${current_pixel[1]}`]) {
                        stack.push([current_pixel[0] + 1, current_pixel[1]]);
                    }
                    if (!processed_pixels[`${current_pixel[0]},${current_pixel[1] - 1}`]) {
                        stack.push([current_pixel[0], current_pixel[1] - 1]);
                    }
                    if (!processed_pixels[`${current_pixel[0]},${current_pixel[1] + 1}`]) {
                        stack.push([current_pixel[0], current_pixel[1] + 1]);
                    }
                    // Experimental: with diagonal pixels
                    if (!processed_pixels[`${current_pixel[0] + 1},${current_pixel[1] + 1}`]) {
                        stack.push([current_pixel[0] + 1, current_pixel[1] + 1]);
                    }
                    if (!processed_pixels[`${current_pixel[0] + 1},${current_pixel[1] - 1}`]) {
                        stack.push([current_pixel[0] + 1, current_pixel[1] - 1]);
                    }
                    if (!processed_pixels[`${current_pixel[0] - 1},${current_pixel[1] + 1}`]) {
                        stack.push([current_pixel[0] - 1, current_pixel[1] + 1]);
                    }
                    if (!processed_pixels[`${current_pixel[0] - 1},${current_pixel[1] - 1}`]) {
                        stack.push([current_pixel[0] - 1, current_pixel[1] - 1]);
                    }
                }
            }
            // Clear unnecessary data
            processed_pixels = {};
            current_pixel = [];
            canvas_data = [];
            let points = [];
            if (polyPixels.length > 2) {
                updateStatus("Computing convex hull");
                for (let j = 0; j < polyPixels.length; j++) {
                    points.push(new MagicPoint([polyPixels[j][0], polyPixels[j][1]]));
                }
                const convolutionHull = hull(points, 40, true);
                createLandmark(convolutionHull /* , simplify_param */);
            }
            else {
                points = [];
                resetProcessState("Please, try again, no useful points found");
                return;
            }
            points = [];
            resetProcessState();
            toggleMagicWandProcessing("#_bMagicWandProcessClick");
        }
        function resetProcessState(status_msg = null) {
            status_msg = !status_msg ? "Waiting for click" : status_msg;
            magic_wand_process = false;
            updateStatus(status_msg);
        }
        function colorDistance(c_pixel, ref_pixel) {
            const within_sensitivity = Math.abs(c_pixel[0] - ref_pixel[0]) <= color_sensitivity &&
                Math.abs(c_pixel[1] - ref_pixel[1]) <= color_sensitivity &&
                Math.abs(c_pixel[2] - ref_pixel[2]) <= color_sensitivity &&
                Math.abs(c_pixel[3] - ref_pixel[3]) <= color_sensitivity;
            return !within_sensitivity;
        }
        /**
         * Finds the closest on-screen drivable segment to the given point, ignoring PLR and PR segments if the options are set
         * Similar to WazeWrap.Util just using turf.
         * @function WazeWrap.Geometry.findSDKClosestSegment
         * @param {GeoJSON.Point} The given point to find the closest segment to
         * @param {boolean} If true, Parking Lot Road segments will be ignored when finding the closest segment
         * @param {boolean} If true, Private Road segments will be ignored when finding the closest segment
         * @returns {Object} Returns an Object containing the Segment and Closest Point on the Segment
         **/
        function findClosestSegment(myPoint) {
            let minDistance = Number.POSITIVE_INFINITY;
            let closestSegment = null;
            for (const s of sdk.DataModel.Segments.getAll()) {
                const segmentType = s.roadType;
                if (segmentType === 10 ||
                    segmentType === 16 ||
                    segmentType === 18 ||
                    segmentType === 19 ||
                    (MWSettings.ignorePLR && segmentType === 20))
                    continue;
                if (MWSettings.ignoreUnnamedPR && segmentType === 17) {
                    const primaryStreetId = s.primaryStreetId;
                    if (!primaryStreetId)
                        continue;
                    const nm = sdk.DataModel.Streets.getById({ streetId: primaryStreetId })?.name;
                    if (!nm || nm === null || nm.trim().length === 0)
                        //PR
                        continue;
                }
                const distanceToSegment = turf.pointToLineDistance(myPoint, s.geometry);
                if (distanceToSegment < minDistance) {
                    minDistance = distanceToSegment;
                    closestSegment = s;
                }
            }
            return closestSegment;
        }
        function createLandmark(points /* , simplify */) {
            if (points.length < 3) {
                resetProcessState("Please, try again, not enough points found");
                return;
            }
            const polyPoints = points.map((p) => {
                if (p instanceof MagicPoint)
                    return p.toPosition();
                return p;
            });
            for (let k = 0; k < polyPoints.length; k++) {
                const o = polyPoints[k];
                const point_lonlat = sdk.Map.getLonLatFromPixel({ x: o[0], y: o[1] });
                polyPoints[k] = [point_lonlat.lon, point_lonlat.lat];
            }
            // const LineString = new OpenLayers.Geometry.LineString(polyPoints);
            // if (simplify > 0) {
            //     LineString = LineString.simplify(simplify);
            // }
            const polygon = turf.polygon([polyPoints]);
            if (!turf.booleanValid(polygon)) {
                resetProcessState("Please, try again, polygon is not valid");
            }
            const centeroid = turf.centroid(polygon);
            const segment = findClosestSegment(centeroid.geometry);
            if (landmark_dialog !== null) {
                $("#WazeMap").append(landmark_dialog.html());
                let landmark_type = "AIRPORT";
                $("#mwLandmarkSelectedButton").on("click", () => {
                    landmark_type = $("#_sMagicWandLandmark").find(":selected").val();
                    const v = sdk.DataModel.Venues.addVenue({ category: landmark_type, geometry: polygon.geometry });
                    if (segment?.primaryStreetId) {
                        sdk.DataModel.Venues.updateAddress({ streetId: segment.primaryStreetId, venueId: v.toString() });
                    }
                    $("#mwLandmarkSelection").remove();
                });
                $("#mwLandmarkCancelButton").on("click", () => {
                    $("#mwLandmarkSelection").remove();
                });
            }
            // const WazefeatureVectorLandmark = require("Waze/Feature/Vector/Landmark");
            // const WazeActionAddLandmark = require("Waze/Action/AddLandmark");
            // const landmark = new WazefeatureVectorLandmark({ geoJSONGeometry: polygon });
            // landmark.attributes.categories = [landmark_type];
            // W.model.actionManager.add(new WazeActionAddLandmark(landmark));
        }
        //
        // Human-eye Similarity algorithm below
        //
        function calcColorDistance(c_pixel, r_pixel) {
            let xyz = rgbToXyz(c_pixel[0], c_pixel[1], c_pixel[2]);
            const lab = xyzToLab(xyz[0], xyz[1], xyz[2]);
            xyz = rgbToXyz(r_pixel[0], r_pixel[1], r_pixel[2]);
            const target_lab = xyzToLab(xyz[0], xyz[1], xyz[2]);
            return cie1994(lab, target_lab, false);
        }
        // Convert RGB to XYZ
        function rgbToXyz(r, g, b) {
            let _r = r / 255;
            let _g = g / 255;
            let _b = b / 255;
            if (_r > 0.04045) {
                _r = ((_r + 0.055) / 1.055) ** 2.4;
            }
            else {
                _r /= 12.92;
            }
            if (_g > 0.04045) {
                _g = ((_g + 0.055) / 1.055) ** 2.4;
            }
            else {
                _g /= 12.92;
            }
            if (_b > 0.04045) {
                _b = ((_b + 0.055) / 1.055) ** 2.4;
            }
            else {
                _b /= 12.92;
            }
            _r *= 100;
            _g *= 100;
            _b *= 100;
            const X = _r * 0.4124 + _g * 0.3576 + _b * 0.1805;
            const Y = _r * 0.2126 + _g * 0.7152 + _b * 0.0722;
            const Z = _r * 0.0193 + _g * 0.1192 + _b * 0.9505;
            return [X, Y, Z];
        }
        // Convert XYZ to LAB
        function xyzToLab(x, y, z) {
            const ref_X = 95.047;
            const ref_Y = 100.0;
            const ref_Z = 108.883;
            let _X = x / ref_X;
            let _Y = y / ref_Y;
            let _Z = z / ref_Z;
            if (_X > 0.008856) {
                _X **= 1 / 3;
            }
            else {
                _X = 7.787 * _X + 16 / 116;
            }
            if (_Y > 0.008856) {
                _Y **= 1 / 3;
            }
            else {
                _Y = 7.787 * _Y + 16 / 116;
            }
            if (_Z > 0.008856) {
                _Z **= 1 / 3;
            }
            else {
                _Z = 7.787 * _Z + 16 / 116;
            }
            const CIE_L = 116 * _Y - 16;
            const CIE_a = 500 * (_X - _Y);
            const CIE_b = 200 * (_Y - _Z);
            return [CIE_L, CIE_a, CIE_b];
        }
        function getLocation(href) {
            const l = document.createElement("a");
            l.href = href;
            return l;
        }
        // Finally, use cie1994 to get delta-e using LAB
        function cie1994(pointX, pointY, isTextiles) {
            const x = { l: pointX[0], a: pointX[1], b: pointX[2] };
            const y = { l: pointY[0], a: pointY[1], b: pointY[2] };
            let k2;
            let k1;
            let kl;
            const kh = 1;
            const kc = 1;
            if (isTextiles) {
                k2 = 0.014;
                k1 = 0.048;
                kl = 2;
            }
            else {
                k2 = 0.015;
                k1 = 0.045;
                kl = 1;
            }
            const c1 = Math.sqrt(x.a * x.a + x.b * x.b);
            const c2 = Math.sqrt(y.a * y.a + y.b * y.b);
            const sh = 1 + k2 * c1;
            const sc = 1 + k1 * c1;
            const sl = 1;
            const da = x.a - y.a;
            const db = x.b - y.b;
            const dc = c1 - c2;
            const dl = x.l - y.l;
            const dh = Math.sqrt(da * da + db * db - dc * dc);
            return Math.sqrt((dl / (kl * sl)) ** 2 + (dc / (kc * sc)) ** 2 + (dh / (kh * sh)) ** 2);
        }
        // intersect.js
        function ccw(x1, y1, x2, y2, x3, y3) {
            const cw = (y3 - y1) * (x2 - x1) - (y2 - y1) * (x3 - x1);
            return cw > 0 ? true : !(cw < 0); // colinear
        }
        function intersect(seg1, seg2) {
            const x1 = seg1[0][0];
            const y1 = seg1[0][1];
            const x2 = seg1[1][0];
            const y2 = seg1[1][1];
            const x3 = seg2[0][0];
            const y3 = seg2[0][1];
            const x4 = seg2[1][0];
            const y4 = seg2[1][1];
            return (ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) &&
                ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4));
        }
        // grid.js
        class Grid {
            _cellSize;
            _cells;
            constructor(points, cellSize) {
                this._cells = [];
                this._cellSize = cellSize;
                points.forEach(function gridPoint(point) {
                    const cellXY = this.point2CellXY(point);
                    const x = cellXY[0];
                    const y = cellXY[1];
                    if (this._cells[x] === undefined) {
                        this._cells[x] = [];
                    }
                    if (this._cells[x][y] === undefined) {
                        this._cells[x][y] = [];
                    }
                    this._cells[x][y].push(point);
                }, this);
            }
            cellPoints(x, y) {
                // (Number, Number) -> Array
                return this._cells[x] !== undefined && this._cells[x][y] !== undefined ? this._cells[x][y] : [];
            }
            rangePoints(bbox) {
                // (Array) -> Array
                const tlCellXY = this.point2CellXY([bbox[0], bbox[1]]);
                const brCellXY = this.point2CellXY([bbox[2], bbox[3]]);
                let points = [];
                for (let x = tlCellXY[0]; x <= brCellXY[0]; x++) {
                    for (let y = tlCellXY[1]; y <= brCellXY[1]; y++) {
                        points = points.concat(this.cellPoints(x, y));
                    }
                }
                return points;
            }
            removePoint(point) {
                // (Array) -> Array
                const cellXY = this.point2CellXY(point);
                const cell = this._cells[cellXY[0]][cellXY[1]];
                let pointIdxInCell;
                for (let i = 0; i < cell.length; i++) {
                    if (cell[i][0] === point[0] && cell[i][1] === point[1]) {
                        pointIdxInCell = i;
                        break;
                    }
                }
                cell.splice(pointIdxInCell, 1);
                return cell;
            }
            point2CellXY(point) {
                // (Array) -> Array
                const x = Math.floor(point[0] / this._cellSize);
                const y = Math.floor(point[1] / this._cellSize);
                return [x, y];
            }
            extendBbox(bbox, scaleFactor) {
                // (Array, Number) -> Array
                return [
                    bbox[0] - scaleFactor * this._cellSize,
                    bbox[1] - scaleFactor * this._cellSize,
                    bbox[2] + scaleFactor * this._cellSize,
                    bbox[3] + scaleFactor * this._cellSize,
                ];
            }
        }
        function grid(points, cellSize) {
            return new Grid(points, cellSize);
        }
        // format.js
        const formatUtil = {
            toPosition(pointset, format = false) {
                if (!format) {
                    return pointset.slice();
                }
                return pointset.map((pt) => { if (pt instanceof MagicPoint)
                    return pt.toPosition(); return pt; });
            },
            toMagicPoint(pointset, format = false) {
                if (format === undefined) {
                    return pointset.slice();
                }
                return pointset.map((pt) => { return new MagicPoint(pt); });
            },
        };
        // convex.js
        function _cross(o, a, b) {
            return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
        }
        function _upperTangent(pointset) {
            const lower = [];
            for (let l = 0; l < pointset.length; l++) {
                while (lower.length >= 2 &&
                    _cross(lower[lower.length - 2], lower[lower.length - 1], pointset[l]) <= 0) {
                    lower.pop();
                }
                lower.push(pointset[l]);
            }
            lower.pop();
            return lower;
        }
        function _lowerTangent(pointset) {
            const reversed = pointset.reverse();
            const upper = [];
            for (let u = 0; u < reversed.length; u++) {
                while (upper.length >= 2 &&
                    _cross(upper[upper.length - 2], upper[upper.length - 1], reversed[u]) <= 0) {
                    upper.pop();
                }
                upper.push(reversed[u]);
            }
            upper.pop();
            return upper;
        }
        // pointset has to be sorted by X
        function convex(pointset) {
            const upper = _upperTangent(pointset);
            const lower = _lowerTangent(pointset);
            const result = lower.concat(upper);
            result.push(pointset[0]);
            return result;
        }
        // hull.js
        function _filterDuplicates(pointset) {
            let filteredPointset = pointset.filter((el, idx, arr) => {
                const prevEl = arr[idx - 1];
                return idx === 0 || !(prevEl[0] === el[0] && prevEl[1] === el[1]);
            });
            if (filteredPointset.length > 0 && filteredPointset[0] instanceof MagicPoint) {
                filteredPointset = formatUtil.toPosition(filteredPointset, true);
            }
            return filteredPointset;
        }
        function _sortByX(pointset) {
            return pointset.sort((a, b) => {
                if (a[0] === b[0]) {
                    return a[1] - b[1];
                }
                return a[0] - b[0];
            });
        }
        function _sqLength(a, b) {
            return (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2;
        }
        function _cos(o, a, b) {
            const aShifted = [a[0] - o[0], a[1] - o[1]];
            const bShifted = [b[0] - o[0], b[1] - o[1]];
            const sqALen = _sqLength(o, a);
            const sqBLen = _sqLength(o, b);
            const dot = aShifted[0] * bShifted[0] + aShifted[1] * bShifted[1];
            return dot / Math.sqrt(sqALen * sqBLen);
        }
        function _intersect(segment, pointset) {
            for (let i = 0; i < pointset.length - 1; i++) {
                const seg = [pointset[i], pointset[i + 1]];
                if ((segment[0][0] === seg[0][0] && segment[0][1] === seg[0][1]) ||
                    (segment[0][0] === seg[1][0] && segment[0][1] === seg[1][1])) {
                    continue;
                }
                if (intersect(segment, seg)) {
                    return true;
                }
            }
            return false;
        }
        function _occupiedArea(pointset) {
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;
            for (let i = pointset.length - 1; i >= 0; i--) {
                if (pointset[i][0] < minX) {
                    minX = pointset[i][0];
                }
                if (pointset[i][1] < minY) {
                    minY = pointset[i][1];
                }
                if (pointset[i][0] > maxX) {
                    maxX = pointset[i][0];
                }
                if (pointset[i][1] > maxY) {
                    maxY = pointset[i][1];
                }
            }
            return [
                maxX - minX, // width
                maxY - minY, // height
            ];
        }
        function _bBoxAround(edge) {
            return [
                Math.min(edge[0][0], edge[1][0]), // left
                Math.min(edge[0][1], edge[1][1]), // top
                Math.max(edge[0][0], edge[1][0]), // right
                Math.max(edge[0][1], edge[1][1]), // bottom
            ];
        }
        // let MAX_CONCAVE_ANGLE_COS; // angle = 90 deg
        // let MAX_SEARCH_BBOX_SIZE_PERCENT;
        function _midPoint(edge, innerPoints, convex1) {
            let point = null;
            let angle1Cos = MAX_CONCAVE_ANGLE_COS;
            let angle2Cos = MAX_CONCAVE_ANGLE_COS;
            let a1Cos;
            let a2Cos;
            for (let i = 0; i < innerPoints.length; i++) {
                a1Cos = _cos(edge[0], edge[1], innerPoints[i]);
                a2Cos = _cos(edge[1], edge[0], innerPoints[i]);
                if (a1Cos > angle1Cos &&
                    a2Cos > angle2Cos &&
                    !_intersect([edge[0], innerPoints[i]], convex1) &&
                    !_intersect([edge[1], innerPoints[i]], convex1)) {
                    angle1Cos = a1Cos;
                    angle2Cos = a2Cos;
                    point = innerPoints[i];
                }
            }
            return point;
        }
        function _concave(convex1, maxSqEdgeLen, maxSearchArea, grid1, edgeSkipList) {
            let edge;
            let keyInSkipList;
            let scaleFactor;
            let midPoint = null;
            let bBoxAround;
            let bBoxWidth;
            let bBoxHeight;
            let midPointInserted = false;
            for (let i = 0; i < convex1.length - 1; i++) {
                edge = [convex1[i], convex1[i + 1]];
                keyInSkipList = `${edge[0].join()},${edge[1].join()}`;
                if (_sqLength(edge[0], edge[1]) < maxSqEdgeLen || edgeSkipList[keyInSkipList] === true) {
                    continue;
                }
                scaleFactor = 0;
                bBoxAround = _bBoxAround(edge);
                do {
                    bBoxAround = grid1.extendBbox(bBoxAround, scaleFactor);
                    bBoxWidth = bBoxAround[2] - bBoxAround[0];
                    bBoxHeight = bBoxAround[3] - bBoxAround[1];
                    midPoint = _midPoint(edge, grid1.rangePoints(bBoxAround), convex1);
                    scaleFactor++;
                } while (midPoint === null && (maxSearchArea[0] > bBoxWidth || maxSearchArea[1] > bBoxHeight));
                if (bBoxWidth >= maxSearchArea[0] && bBoxHeight >= maxSearchArea[1]) {
                    edgeSkipList[keyInSkipList] = true;
                }
                if (midPoint !== null) {
                    convex1.splice(i + 1, 0, midPoint);
                    grid1.removePoint(midPoint);
                    midPointInserted = true;
                }
            }
            if (midPointInserted) {
                return _concave(convex1, maxSqEdgeLen, maxSearchArea, grid1, edgeSkipList);
            }
            return convex1;
        }
        function hull(pointset, concavity, format = false) {
            const maxEdgeLen = concavity || 20;
            if (pointset.length < 4) {
                return pointset.slice();
            }
            const points = _filterDuplicates(_sortByX(formatUtil.toPosition(pointset, format)));
            const occupiedArea = _occupiedArea(points);
            const maxSearchArea = [
                occupiedArea[0] * MAX_SEARCH_BBOX_SIZE_PERCENT,
                occupiedArea[1] * MAX_SEARCH_BBOX_SIZE_PERCENT,
            ];
            const convex1 = convex(points);
            const innerPoints = points.filter((pt) => convex1.indexOf(pt) < 0);
            const cellSize = Math.ceil(1 / (points.length / (occupiedArea[0] * occupiedArea[1])));
            const concave = _concave(convex1, maxEdgeLen ** 2, maxSearchArea, grid(innerPoints, cellSize), {});
            return formatUtil.toMagicPoint(concave, format);
        }
    }
    initializeMagicWand();
}
