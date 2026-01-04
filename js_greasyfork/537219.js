"use strict";
// ==UserScript==
// @name         WME LaneTools
// @namespace    https://github.com/SkiDooGuy/WME-LaneTools
// @version      2025.11.16.001
// @description  Adds highlights and tools to WME to supplement the lanes feature
// @author       SkiDooGuy, Click Saver by HBiede, Heuristics by kndcajun, assistance by jm6087
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      greasyfork.org
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/537219/WME%20LaneTools.user.js
// @updateURL https://update.greasyfork.org/scripts/537219/WME%20LaneTools.meta.js
// ==/UserScript==
/* global W */
/* global WazeWrap */
// import type { KeyboardShortcut, Node, Pixel, Segment, Selection, Turn, UserSession, WmeSDK, SegmentLaneGuidanceDirection } from "wme-sdk-typings";
// import type { Position } from "geojson";
// import _ from "underscore";
// import * as turf from "@turf/turf";
// import WazeWrap from "https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js";
let sdk;
unsafeWindow.SDK_INITIALIZED.then(() => {
    if (!unsafeWindow.getWmeSdk) {
        throw new Error("SDK is not installed");
    }
    sdk = unsafeWindow.getWmeSdk({
        scriptId: "wme-lane-tools",
        scriptName: "WME LaneTools",
    });
    console.log(`SDK v ${sdk.getSDKVersion()} on ${sdk.getWMEVersion()} initialized`);
    sdk.Events.once({ eventName: "wme-ready" }).then(ltInit);
});
function ltInit() {
    let Direction;
    (function (Direction) {
        Direction[Direction["REVERSE"] = -1] = "REVERSE";
        Direction[Direction["ANY"] = 0] = "ANY";
        Direction[Direction["FORWARD"] = 1] = "FORWARD";
    })(Direction || (Direction = {}));
    let VERBOSITY;
    (function (VERBOSITY) {
        VERBOSITY[VERBOSITY["INFO"] = 0] = "INFO";
        VERBOSITY[VERBOSITY["DEBUG"] = 1] = "DEBUG";
        VERBOSITY[VERBOSITY["VERBOSE"] = 2] = "VERBOSE";
        VERBOSITY[VERBOSITY["TRACE"] = 3] = "TRACE";
    })(VERBOSITY || (VERBOSITY = {}));
    const verbosity_mnemonic = ["INFO", "DEBUG", "VERBOSE", "TRACE"];
    let LT_ROAD_TYPE;
    (function (LT_ROAD_TYPE) {
        // Streets
        LT_ROAD_TYPE[LT_ROAD_TYPE["NARROW_STREET"] = 22] = "NARROW_STREET";
        LT_ROAD_TYPE[LT_ROAD_TYPE["STREET"] = 1] = "STREET";
        LT_ROAD_TYPE[LT_ROAD_TYPE["PRIMARY_STREET"] = 2] = "PRIMARY_STREET";
        // Highways
        LT_ROAD_TYPE[LT_ROAD_TYPE["RAMP"] = 4] = "RAMP";
        LT_ROAD_TYPE[LT_ROAD_TYPE["FREEWAY"] = 3] = "FREEWAY";
        LT_ROAD_TYPE[LT_ROAD_TYPE["MAJOR_HIGHWAY"] = 6] = "MAJOR_HIGHWAY";
        LT_ROAD_TYPE[LT_ROAD_TYPE["MINOR_HIGHWAY"] = 7] = "MINOR_HIGHWAY";
        // Other drivable
        LT_ROAD_TYPE[LT_ROAD_TYPE["DIRT_ROAD"] = 8] = "DIRT_ROAD";
        LT_ROAD_TYPE[LT_ROAD_TYPE["FERRY"] = 14] = "FERRY";
        LT_ROAD_TYPE[LT_ROAD_TYPE["PRIVATE_ROAD"] = 17] = "PRIVATE_ROAD";
        LT_ROAD_TYPE[LT_ROAD_TYPE["PARKING_LOT_ROAD"] = 20] = "PARKING_LOT_ROAD";
        // Non-drivable
        LT_ROAD_TYPE[LT_ROAD_TYPE["WALKING_TRAIL"] = 5] = "WALKING_TRAIL";
        LT_ROAD_TYPE[LT_ROAD_TYPE["PEDESTRIAN_BOARDWALK"] = 10] = "PEDESTRIAN_BOARDWALK";
        LT_ROAD_TYPE[LT_ROAD_TYPE["STAIRWAY"] = 16] = "STAIRWAY";
        LT_ROAD_TYPE[LT_ROAD_TYPE["RAILROAD"] = 18] = "RAILROAD";
        LT_ROAD_TYPE[LT_ROAD_TYPE["RUNWAY"] = 19] = "RUNWAY";
    })(LT_ROAD_TYPE || (LT_ROAD_TYPE = {}));
    const MIN_DISPLAY_LEVEL = 14;
    const MIN_ZOOM_NON_FREEWAY = 17;
    // const DisplayLevels = {
    //     MIN_ZOOM_ALL: 14,
    //     MIN_ZOOM_NONFREEWAY: 17,
    // };
    let HeuristicsCandidate;
    (function (HeuristicsCandidate) {
        HeuristicsCandidate[HeuristicsCandidate["ERROR"] = -2] = "ERROR";
        HeuristicsCandidate[HeuristicsCandidate["FAIL"] = -1] = "FAIL";
        HeuristicsCandidate[HeuristicsCandidate["NONE"] = 0] = "NONE";
        HeuristicsCandidate[HeuristicsCandidate["PASS"] = 1] = "PASS";
    })(HeuristicsCandidate || (HeuristicsCandidate = {}));
    if (!WazeWrap.Ready) {
        setTimeout(() => {
            ltInit();
        }, 100);
        return;
    }
    const LANETOOLS_VERSION = `${GM_info.script.version}`;
    const GF_LINK = "https://greasyfork.org/en/scripts/537219-wme-lanetools";
    const DOWNLOAD_URL = "https://greasyfork.org/en/scripts/537219-wme-lanetools";
    const FORUM_LINK = "https://www.waze.com/discuss/t/script-wme-lanetools/53136";
    const LT_UPDATE_NOTES = `NEW:<br>
UPDATES:<br>
    - Move Lane Deletion to SDK Native<br>
    - Fix issues with Selection and Reselection when Lane Tabs is open.<br>
KNOWN ISSUE:<br>
TODO:<br>
`;
    let LANETOOLS_DEBUG_LEVEL = 0; // 0=Info, 1=Debug, 2=Trace, 3=Trace Verbose
    const configArray = {};
    const RBSArray = { failed: false };
    const IsBeta = location.href.indexOf("beta.waze.com") !== -1;
    const env = IsBeta ? "beta" : "production";
    const TAB_TRANSLATIONS = {
        // Default english values
        default: {
            enabled: "Enabled",
            disabled: "Disabled",
            toggleShortcut: "Toggle Shortcut",
            UIEnhance: "Tab UI Enhancements",
            autoWidth: "Auto-open road width",
            autoOpen: "Auto-open lanes tab",
            autoExpand: "Auto-expand lane editor",
            autoFocus: "Auto-focus lane input",
            reOrient: "Re-orient lane icons",
            enClick: "Enable ClickSaver",
            clickStraight: "All straight lanes",
            clickTurn: "Turn lanes",
            mapHighlight: "Map Highlights",
            laneLabel: "Lane labels",
            nodeHigh: "Node highlights",
            LAOHigh: "Lane angle overrides",
            CSOHigh: "Continue straight overrides",
            heuristics: "Lane heuristics candidates",
            posHeur: "Positive heuristics candidate",
            negHeur: "Negative heuristics candidate",
            highColor: "Highlight Colors",
            colTooltip: "Click to toggle color inputs",
            selAllTooltip: "Click on turn name to toggle all lane associations",
            fwdCol: "Fwd (A>B)",
            revCol: "Rev (B>A)",
            labelCol: "Labels",
            errorCol: "Lane errors",
            laneNodeCol: "Nodes with lanes",
            nodeTIOCol: "Nodes with TIOs",
            LAOCol: "Segs with TIOs",
            viewCSCol: "View only CS",
            hearCSCol: "View and hear CS",
            heurPosCol: "Lane heuristics likely",
            heurNegCol: "Lane heuristics - not qualified",
            advTools: "Advanced Tools",
            debugMsg: "Debug Logging Level (Beta Only)",
            quickTog: "Quick toggle all lanes",
            showRBS: "Use RBS heuristics",
            delFwd: "Delete FWD Lanes",
            delRev: "Delete Rev Lanes",
            delOpp: "This segment is one-way but has lanes set in the opposite direction. Click here to delete them",
            csIcons: "Highlight CS Icons",
            highlightOverride: "Only highlight if segment layer active",
            addTIO: "Include TIO in lanes tab",
            labelTIO: "TIO",
            defaultTIO: "Waze Selected",
            noneTIO: "None",
            tlTIO: "Turn Left",
            trTIO: "Turn Right",
            klTIO: "Keep Left",
            krTIO: "Keep Right",
            conTIO: "Continue",
            elTIO: "Exit Left",
            erTIO: "Exit Right",
            uturnTIO: "U-Turn",
            enIcons: "Display lane icons on map",
            IconsRotate: "Rotate map icons with segment direction",
            DebugLevel: "Debug",
            InfoLevel: "Info",
            TraceLevel: "Trace",
            VerboseLevel: "Verbose",
        },
        "en-us": {
            enabled: "Enabled",
            disabled: "Disabled",
            toggleShortcut: "Toggle Shortcut",
            UIEnhance: "Tab UI Enhancements",
            autoWidth: "Auto-open road width",
            autoOpen: "Auto-open lanes tab",
            autoExpand: "Auto-expand lane editor",
            autoFocus: "Auto-focus lane input",
            reOrient: "Re-orient lane icons",
            enClick: "Enable ClickSaver",
            clickStraight: "All straight lanes",
            clickTurn: "Turn lanes",
            mapHighlight: "Map Highlights",
            laneLabel: "Lane labels",
            nodeHigh: "Node highlights",
            LAOHigh: "Lane angle overrides",
            CSOHigh: "Continue straight overrides",
            heuristics: "Lane heuristics candidates",
            posHeur: "Positive heuristics candidate",
            negHeur: "Negative heuristics candidate",
            highColor: "Highlight Colors",
            colTooltip: "Click to toggle color inputs",
            selAllTooltip: "Click on turn name to toggle all lane associations",
            fwdCol: "Fwd (A>B)",
            revCol: "Rev (B>A)",
            labelCol: "Labels",
            errorCol: "Lane errors",
            laneNodeCol: "Nodes with lanes",
            nodeTIOCol: "Nodes with TIOs",
            LAOCol: "Segs with TIOs",
            viewCSCol: "View only CS",
            hearCSCol: "View and hear CS",
            heurPosCol: "Lane heuristics likely",
            heurNegCol: "Lane heuristics - not qualified",
            advTools: "Advanced Tools",
            debugMsg: "Debug Logging Level (Beta Only)",
            quickTog: "Quick toggle all lanes",
            showRBS: "Use RBS heuristics",
            delFwd: "Delete FWD Lanes",
            delRev: "Delete Rev Lanes",
            delOpp: "This segment is one-way but has lanes set in the opposite direction. Click here to delete them",
            csIcons: "Highlight CS Icons",
            highlightOverride: "Only highlight if segment layer active",
            addTIO: "Include TIO in lanes tab",
            labelTIO: "TIO",
            defaultTIO: "Waze Selected",
            noneTIO: "None",
            tlTIO: "Turn Left",
            trTIO: "Turn Right",
            klTIO: "Keep Left",
            krTIO: "Keep Right",
            conTIO: "Continue",
            elTIO: "Exit Left",
            erTIO: "Exit Right",
            uturnTIO: "U-Turn",
            enIcons: "Display lane icons on map",
            IconsRotate: "Rotate map icons with segment direction",
            DebugLevel: "Debug",
            InfoLevel: "Info",
            TraceLevel: "Trace",
            VerboseLevel: "Verbose",
        },
    };
    let MAX_LEN_HEUR; // Maximum length of segment where lane heuristics applied (Specified in Wiki).
    let MAX_PERP_DIF; // Updated 2020-09, based on experiments
    let MAX_PERP_DIF_ALT; // New 2020-09, based on experiments
    let MAX_PERP_TO_CONSIDER; // Don't even consider perp angles outside of this tolerance
    let MAX_STRAIGHT_TO_CONSIDER; // Don't even consider straight angles inside of this tolerance
    let MAX_STRAIGHT_DIF; // IN TESTING;  updated 2020-09
    let lt_scanArea_recursive = 0;
    let LtSettings;
    let strings;
    // let _turnInfo = [];
    let _turnData = {};
    let laneCount = 0;
    const LTHighlightLayer = { name: "LT Highlights Layer" };
    const LTNamesLayer = { name: "LT Names Layer" };
    const LTLaneGraphics = { name: "LT Lane Graphics" };
    let _pickleColor;
    let UpdateObj;
    let MultiAction;
    let SetTurn;
    let shortcutsDisabled = false;
    let isRBS = false;
    let allowCpyPst = false;
    let langLocality = "default";
    let LANG;
    let seaPickle;
    function applyNodeHightlightStyle(properties) {
        return properties.styleName === "nodeStyle" && properties.layerName === LTHighlightLayer.name;
    }
    function applyVectorHightlightStyle(properties) {
        return properties.styleName === "vectorStyle" && properties.layerName === LTHighlightLayer.name;
    }
    function applyBoxStyle(properties) {
        return properties.styleName === "boxStyle" && properties.layerName === LTLaneGraphics.name;
    }
    function applyIconBoxStyle(properties) {
        return properties.styleName === "iconBoxStyle" && properties.layerName === LTLaneGraphics.name;
    }
    function applyIconStyle(properties) {
        return properties.styleName === "iconStyle" && properties.layerName === LTLaneGraphics.name;
    }
    function applyStartPointStyle(properties) {
        return properties.styleName === "startPointStyle" && properties.layerName === LTLaneGraphics.name;
    }
    const styleConfig = {
        styleContext: {
            nameStyleLabelColor: (context) => {
                return LtSettings.LabelColor;
            },
            nameStyleLaneNum: (context) => {
                return context?.feature?.properties?.style?.laneNumLabel;
            },
            highlightStrokeColor: (context) => {
                return context?.feature?.properties?.style?.stroke;
            },
            hightlightStrokeWidth: (context) => {
                return context?.feature?.properties?.style?.strokeWidth;
            },
            hightlightStrokeOpacity: (context) => {
                return context?.feature?.properties?.style?.strokeOpacity;
            },
            hightlightStrokeDashStyle: (context) => {
                return context?.feature?.properties?.style?.strokeDashstyle;
            },
            highlightFillColor: (context) => {
                return context?.feature?.properties?.style?.fillColor;
            },
            highlightPointRadius: (context) => {
                return context?.feature?.properties?.style?.pointRadius;
            },
            externalGraphic: (context) => {
                return context?.feature?.properties?.style?.externalGraphic;
            },
            graphicHeight: (context) => {
                return context?.feature?.properties?.style?.graphicHeight;
            },
            graphicWidth: (context) => {
                return context?.feature?.properties?.style?.graphicWidth;
            },
            rotation: (context) => {
                return context?.feature?.properties?.style?.rotation;
            },
            backgroundGraphic: (context) => {
                return context?.feature?.properties?.style?.backgroundGraphic;
            },
            backgroundHeight: (context) => {
                return context?.feature?.properties?.style?.backgroundHeight;
            },
            backgroundWidth: (context) => {
                return context?.feature?.properties?.style?.backgroundWidth;
            },
            backgroundXOffset: (context) => {
                return context?.feature?.properties?.style?.backgroundXOffset;
            },
            backgroundYOffset: (context) => {
                return context?.feature?.properties?.style?.backgroundYOffset;
            },
        },
        styleRules: [
            {
                predicate: (properties) => {
                    return properties.layerName === LTNamesLayer.name;
                },
                style: {
                    fontFamily: "Open Sans, Alef, helvetica, sans-serif, monospace",
                    labelColor: "${nameStyleLabelColor}",
                    labelText: "${nameStyleLaneNum}",
                    labelOutlineColor: "black",
                    fontColor: "${nameStyleLabelColor}",
                    fontSize: "16",
                    labelXOffset: 15,
                    labelYOffset: -15,
                    labelOutlineWidth: "3",
                    label: "${nameStyleLaneNum}",
                    angle: "",
                    labelAlign: "cm",
                    strokeWidth: 0,
                    pointRadius: 0,
                },
            },
            {
                predicate: applyNodeHightlightStyle,
                style: {
                    fillColor: "${highlightFillColor}",
                    pointRadius: "${highlightPointRadius}",
                    fillOpacity: 0.9,
                    strokeWidth: 0,
                },
            },
            {
                predicate: applyStartPointStyle,
                style: {
                    fillColor: "red",
                    pointRadius: 6,
                    fillOpacity: 1,
                    strokeWidth: 0,
                },
            },
            {
                predicate: applyVectorHightlightStyle,
                style: {
                    strokeColor: "${highlightStrokeColor}",
                    stroke: "${highlightStrokeColor}",
                    strokeWidth: "${hightlightStrokeWidth}",
                    strokeOpacity: "${hightlightStrokeOpacity}",
                    strokeDashstyle: "${hightlightStrokeDashStyle}",
                },
            },
            {
                predicate: applyBoxStyle,
                style: {
                    strokeColor: "#ffffff",
                    strokeOpacity: 1,
                    strokeWidth: 8,
                    fillColor: "#ffffff",
                },
            },
            {
                predicate: applyIconBoxStyle,
                style: {
                    strokeColor: "#000000",
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    fillColor: "#26bae8",
                },
            },
            {
                predicate: applyIconStyle,
                style: {
                    externalGraphic: "${externalGraphic}",
                    graphicHeight: "${graphicHeight}",
                    graphicWidth: "${graphicWidth}",
                    fillColor: "#26bae8",
                    fillOpacity: 1,
                    backgroundColor: "#26bae8",
                    strokeColor: "#26bae8",
                    rotation: "${rotation}",
                    backgroundGraphic: "${backgroundGraphic}",
                    backgroundHeight: "${backgroundHeight}",
                    backgroundWidth: "${backgroundWidth}",
                    backgroundXOffset: "${backgroundXOffset}",
                    backgroundYOffset: "${backgroundYOffset}",
                },
            },
        ],
    };
    console.log("LaneTools: initializing...");
    function laneToolsBootstrap(tries = 0) {
        console.log("Lane Tools: Initializing...");
        initLaneTools();
        console.log("Lane Tools: Initialization Finished.");
    }
    function initLaneTools() {
        startScriptUpdateMonitor();
        seaPickle = sdk.State.getUserInfo();
        UpdateObj = require("Waze/Action/UpdateObject");
        MultiAction = require("Waze/Action/MultiAction");
        SetTurn = require("Waze/Model/Graph/Actions/SetTurn");
        const ltCss = [
            '.lt-wrapper {position:relative;width:100%;font-size:12px;font-family:"Rubik", "Boing-light", sans-serif;user-select:none;}',
            ".lt-section-wrapper {display:block;width:100%;padding:4px;}",
            ".lt-section-wrapper.border {border-bottom:1px solid grey;margin-bottom:5px;}",
            ".lt-option-container {padding:3px;}",
            ".lt-option-container.color {text-decoration:none;}",
            'input[type="checkbox"].lt-checkbox {position:relative;top:3px;vertical-align:top;margin:0;}',
            'input[type="text"].lt-color-input {position:relative;width:70px;padding:3px;border:2px solid black;border-radius:6px;}',
            'input[type="text"].lt-color-input:focus {outline-width:0;}',
            "label.lt-label {position:relative;max-width:90%;font-weight:normal;padding-left:5px}",
            ".lt-Toolbar-Container {display:none;position:absolute;background-color:orange;border-radius:6px;border:1.5px solid;box-size:border-box;z-index:1050;}",
            ".lt-Toolbar-Wrapper {position:relative;padding:3px;}",
            ".lt-toolbar-button-container {display:inline-block;padding:5px;}",
            ".lt-toolbar-button {position:relative;display:block;width:60px;height:25px;border-radius:6px;font-size:12px;}",
            ".lt-add-Width {display:inline-block;width:15px;height:15px;border:1px solid black;border-radius:8px;margin:0 3px 0 3px;line-height: 1.5;text-align:center;font-size:10px;}",
            ".lt-add-Width:hover {border:1px solid #26bae8;background-color:#26bae8;cursor:pointer;}",
            ".lt-add-lanes {display:inline-block;width:15px;height:15px;border:1px solid black;border-radius:8px;margin:0 3px 0 3px;line-height: 1.5;text-align:center;font-size:10px;}",
            ".lt-add-lanes:hover {border:1px solid #26bae8;background-color:#26bae8;cursor:pointer;}",
            ".lt-chkAll-lns {display:inline-block;width:20px;height:20px;text-decoration:underline;font-weight:bold;font-size:10px;padding-left:3px;cursor:pointer;}",
            ".lt-tio-select {max-width:80%;color:rgb(32, 33, 36);background-color:rgb(242, 243, 244);border:0px;border-radius:6px;padding:0 16px 0 10px;cursor:pointer;}",
            "#lt-color-title {display:block;width:100%;padding:5px 0 5px 0;font-weight:bold;text-decoration:underline;cursor:pointer;}",
        ].join(" ");
        const $ltTab = $("<div>");
        $ltTab.html = [
            `<div class='lt-wrapper' id='lt-tab-wrapper'>
            <div class='lt-section-wrapper' id='lt-tab-body'>
                <div class='lt-section-wrapper border' style='border-bottom:2px double grey;'>
                    <a href='https://www.waze.com/forum/viewtopic.php?f=819&t=301158' style='font-weight:bold;font-size:12px;text-decoration:underline;'  target='_blank'>LaneTools - v${LANETOOLS_VERSION}</a>
                    <div>
                        <div style='display:inline-block;'><span class='lt-trans-tglshcut'></span>:<span id='lt-EnableShortcut' style='padding-left:10px;'></span></div>
                        <div class='lt-option-container' style='float:right;'>
                            <input type=checkbox class='lt-checkbox' id='lt-ScriptEnabled' />
                            <label class='lt-label' for='lt-ScriptEnabled'><span class='lt-trans-enabled'></span></label>
                        </div>
                    </div>
                </div>
                <div class='lt-section-wrapper' id='lt-LaneTabFeatures'>
                    <div class='lt-section-wrapper border'>
                        <span style='font-weight:bold;'><span id='lt-trans-uiEnhance'></span></span>
                        <div class='lt-option-container' style='float:right;'>
                            <input type=checkbox class='lt-checkbox' id='lt-UIEnable' />
                            <label class='lt-label' for='lt-UIEnable'><span class='lt-trans-enabled'></span></label>
                        </div>
                    </div>
                    <div id='lt-UI-wrapper'>
                        <div class='lt-option-container' style='margin-bottom:5px;'>
                            <div style='display:inline-block;'><span class='lt-trans-tglshcut'></span>:<span id='lt-UIEnhanceShortcut' style='padding-left:10px;'></span></div>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-AutoOpenWidth' />
                            <label class='lt-label' for='lt-AutoOpenWidth'><span id='lt-trans-autoWidth'></span></label>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-AutoLanesTab' />
                            <label class='lt-label' for='lt-AutoLanesTab'><span id='lt-trans-autoTab'></span></label>
                        </div>
                        <div class='lt-option-container' style='display:none;'>
                            <input type=checkbox class='lt-checkbox' id='lt-AutoExpandLanes' />
                            <label class='lt-label' for='lt-AutoExpandLanes'><span title="Feature disabled as of Aug 27, 2022 to prevent flickering issue" id='lt-trans-autoExpand'></span></label>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-AutoFocusLanes' />
                            <label class='lt-label' for='lt-AutoFocusLanes'><span id='lt-trans-autoFocus'></span></label>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-highlightCSIcons' />
                            <label class='lt-label' for='lt-highlightCSIcons'><span id='lt-trans-csIcons'></span></label>
                        </div>
                        <div class='lt-option-container' style='display:none;'>
                            <input type=checkbox class='lt-checkbox' id='lt-ReverseLanesIcon' />
                            <label class='lt-label' for='lt-ReverseLanesIcon'><span title="Feature disabled as of July 21, 2023 because lanes displayed wrong" id='lt-trans-orient'></span></label>
                        </div>
                        <div class='lt-option-container' style='display:none;'>
                            <input type=checkbox class='lt-checkbox' id='lt-AddTIO' />
                            <label class='lt-label' for='lt-AddTIO'><span id='lt-trans-AddTIO'></span></label>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-ClickSaveEnable' />
                            <label class='lt-label' for='lt-ClickSaveEnable'><span id='lt-trans-enClick'></span></label>
                        </div>
                        <div class='lt-option-container clk-svr' style='padding-left:10%;'>
                            <input type=checkbox class='lt-checkbox' id='lt-ClickSaveStraight' />
                            <label class='lt-label' for='lt-ClickSaveStraight'><span id='lt-trans-straClick'></span></label>
                        </div>
                        <div class='lt-option-container clk-svr' style='padding-left:10%;'>
                            <input type=checkbox class='lt-checkbox' id='lt-ClickSaveTurns' />
                            <label class='lt-label' for='lt-ClickSaveTurns'><span id='lt-trans-turnClick'></span></label>
                        </div>
                    </div>
                </div>
                <div class='lt-section-wrapper'>
                    <div class='lt-section-wrapper border'>
                        <span style='font-weight:bold;'><span id='lt-trans-mapHigh'></span></span>
                        <div class='lt-option-container' style='float:right;'>
                            <input type=checkbox class='lt-checkbox' id='lt-HighlightsEnable' />
                            <label class='lt-label' for='lt-HighlightsEnable'><span class='lt-trans-enabled'></span></label>
                        </div>
                    </div>
                    <div id='lt-highlights-wrapper'>
                        <div class='lt-option-container' style='margin-bottom:5px;'>
                            <div style='display:inline-block;'><span class='lt-trans-tglshcut'></span>:<span id='lt-HighlightShortcut' style='padding-left:10px;'></span></div>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-IconsEnable' />
                            <label class='lt-label' for='lt-IconsEnable'><span id='lt-trans-enIcons'></span></label>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-IconsRotate' />
                            <label class='lt-label' for='lt-IconsRotate'><span id='lt-trans-IconsRotate'></span></label>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-LabelsEnable' />
                            <label class='lt-label' for='lt-LabelsEnable'><span id='lt-trans-lnLabel'></span></label>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-NodesEnable' />
                            <label class='lt-label' for='lt-NodesEnable'><span id='lt-trans-nodeHigh'></span></label>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-LIOEnable' />
                            <label class='lt-label' for='lt-LIOEnable'><span id='lt-trans-laOver'></span></label>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-CSEnable' />
                            <label class='lt-label' for='lt-CSEnable'><span id='lt-trans-csOver'></span></label>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-highlightOverride' />
                            <label class='lt-label' for='lt-highlightOverride'><span id='lt-trans-highOver'></span></label>
                        </div>
                    </div>
                </div>
                <div class='lt-section-wrapper'>
                    <div class='lt-section-wrapper border'>
                        <span style='font-weight:bold;'><span id='lt-trans-heurCan'></span></span>
                        <div class='lt-option-container' style='float:right;'>
                            <input type=checkbox class='lt-checkbox' id='lt-LaneHeuristicsChecks' />
                            <label class='lt-label' for='lt-LaneHeuristicsChecks'><span class='lt-trans-enabled'></span></label>
                        </div>
                    </div>
                    <div id='lt-heur-wrapper'>
                        <div class='lt-option-container' style='margin-bottom:5px;'>
                            <div style='display:inline-block;'><span class='lt-trans-tglshcut'></span>:<span id='lt-LaneHeurChecksShortcut' style='padding-left:10px;'></span></div>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-LaneHeurPosHighlight' />
                            <label class='lt-label' for='lt-LaneHeurPosHighlight'><span id='lt-trans-heurPos'></span></label>
                        </div>
                        <div class='lt-option-container'>
                            <input type=checkbox class='lt-checkbox' id='lt-LaneHeurNegHighlight' />
                            <label class='lt-label' for='lt-LaneHeurNegHighlight'><span id='lt-trans-heurNeg'></span></label>
                        </div>
                    </div>
                </div>
                <div class='lt-section-wrapper'>
                    <div class='lt-section-wrapper'>
                        <span id='lt-color-title' data-original-title='${TAB_TRANSLATIONS[langLocality].colTooltip}'><span id='lt-trans-highCol'></span>:</span>
                        <div id='lt-color-inputs' style='display:none;'>
                            <div class='lt-option-container color'>
                                <input type=color class='lt-color-input' id='lt-ABColor' />
                                <label class='lt-label' for='lt-ABColor' id='lt-ABColorLabel'><span id='lt-trans-fwdCol'></span></label>
                            </div>
                            <div class='lt-option-container color'>
                                <input type=color class='lt-color-input' id='lt-BAColor' />
                                <label class='lt-label' for='lt-BAColor' id='lt-BAColorLabel'><span id='lt-trans-revCol'></span></label>
                            </div>
                            <div class='lt-option-container color'>
                                <input type=color class='lt-color-input' id='lt-LabelColor' />
                                <label class='lt-label' for='lt-LabelColor' id='lt-LabelColorLabel'><span id='lt-trans-labelCol'></span></label>
                            </div>
                            <div class='lt-option-container color'>
                                <input type=color class='lt-color-input' id='lt-ErrorColor' />
                                <label class='lt-label' for='lt-ErrorColor' id='lt-ErrorColorLabel'><span id='lt-trans-errorCol'></span></label>
                            </div>
                            <div class='lt-option-container color'>
                                <input type=color class='lt-color-input' id='lt-NodeColor' />
                                <label class='lt-label' for='lt-NodeColor' id='lt-NodeColorLabel'><span id='lt-trans-nodeCol'></span></label>
                            </div>
                            <div class='lt-option-container color'>
                                <input type=color class='lt-color-input' id='lt-TIOColor' />
                                <label class='lt-label' for='lt-TIOColor' id='lt-TIOColorLabel'><span id='lt-trans-tioCol'></span></label>
                            </div>
                            <div class='lt-option-container color'>
                                <input type=color class='lt-color-input' id='lt-LIOColor' />
                                <label class='lt-label' for='lt-TIOColor' id='lt-LIOColorLabel'><span id='lt-trans-laoCol'></span></label>
                            </div>
                            <div class='lt-option-container color'>
                                <input type=color class='lt-color-input' id='lt-CS1Color' />
                                <label class='lt-label' for='lt-CS1Color' id='lt-CS1ColorLabel'><span id='lt-trans-viewCol'></span></label>
                            </div>
                            <div class='lt-option-container color'>
                                <input type=color class='lt-color-input' id='lt-CS2Color' />
                                <label class='lt-label' for='lt-CS2Color' id='lt-CS2ColorLabel'><span id='lt-trans-hearCol'></span></label>
                            </div>
                            <div class='lt-option-container color'>
                                <input type=color class='lt-color-input' id='lt-HeurColor' />
                                <label class='lt-label' for='lt-HeurColor' id='lt-HeurColorLabel'><span id='lt-trans-posCol'></span></label>
                            </div>
                            <div class='lt-option-container color'>
                                <input type=color class='lt-color-input' id='lt-HeurFailColor' />
                                <label class='lt-label' for='lt-HeurFailColor' id='lt-HeurFailColorLabel'><span id='lt-trans-negCol'></span></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='lt-section-wrapper' id='lt-adv-tools' style='display:none;'>
                    <div class='lt-section-wrapper border'>
                        <span style='font-weight:bold;'><span id='lt-trans-advTools'></span></span>
                    </div>
                    <div class='lt-option-container'>
                        <input type=checkbox class='lt-checkbox' id='lt-SelAllEnable' />
                        <label class='lt-label' for='lt-SelAllEnable' ><span id='lt-trans-quickTog'></span></label>
                    </div>
                    <div class='lt-option-container' id='lt-serverSelectContainer' style='display:none;'>
                        <input type=checkbox class='lt-checkbox' id='lt-serverSelect' />
                        <label class='lt-label' for='lt-serverSelect'><span id='lt-trans-heurRBS'></span></label>
                    </div>
                    <div class='lt-option-container' id='lt-cpy-pst' style='display:none;'>
                        <input type=checkbox class='lt-checkbox' id='lt-CopyEnable' />
                        <label class='lt-label' for='lt-CopyEnable'>Copy/Paste Lanes</label>
                        <span style='font-weight: bold;'>(**Caution** - double check results, feature still in Dev)</span>
                    </div>
                    <div id='lt-sheet-link' style='display:none;'>
                        <a href='https://docs.google.com/spreadsheets/d/1_3sF09sMOid_us37j5CQqJZlBGGr1vI_3Rrmp5K-KCQ/edit?usp=sharing' target='_blank'>LT Config Sheet</a>
                    </div>
                </div>
                <div class='lt-section-wrapper' id='lt-debug-msg' style='display:none;'>
                    <div class='lt-section-wrapper border'>
                        <span style='font-weight:bold;'><span id='lt-trans-debugMsg'></span></span>
                    </div>
                    <div class='lt-option-container sub'>
                        <input type=radio class='lt-checkbox' value='0' name='VerbosityLevel' id='lt-InfoLevel' checked/>
                        <label class='lt-label' for='lt-InfoLevel'><span id='lt-trans-InfoLevel'></span></label>
                    </div>
                    <div class='lt-option-container sub'>
                        <input type=radio class='lt-checkbox' value='1' name='VerbosityLevel' id='lt-DebugLevel' />
                        <label class='lt-label' for='lt-DebugLevel'><span id='lt-trans-DebugLevel'></span></label>
                    </div>
                    <div class='lt-option-container sub'>
                        <input type=radio class='lt-checkbox' value='2' name='VerbosityLevel' id='lt-TraceLevel' />
                        <label class='lt-label' for='lt-TraceLevel'><span id='lt-trans-TraceLevel'></span></label>
                    </div>
                    <div class='lt-option-container sub'>
                        <input type=radio class='lt-checkbox' value='3' name='VerbosityLevel' id='lt-VerboseLevel' />
                        <label class='lt-label' for='lt-VerboseLevel'><span id='lt-trans-VerboseLevel'></span></label>
                    </div>
                </div>
            </div>
        </div>`,
        ].join(" ");
        const $ltButtons = $("<div>");
        $ltButtons.html([
            `<div class='lt-Toolbar-Container' id="lt-toolbar-container">
            <div class='lt-Toolbar-Wrapper'>
                <div class='lt-toolbar-button-container'>
                    <button type='button' class='lt-toolbar-button' id='copyA-button'>Copy A</button>
                </div>
                <div class='lt-toolbar-button-container'>
                    <button type='button' class='lt-toolbar-button' id='copyB-button'>Copy B</button>
                </div>
                <div class='lt-toolbar-button-container'>
                    <button type='button' class='lt-toolbar-button' id='pasteA-button'>Paste A</button>
                </div>
                <div class='lt-toolbar-button-container'>
                    <button type='button' class='lt-toolbar-button' id='pasteB-button'>Paste B</button>
                </div>
            </div>
        </div>`,
        ].join(" "));
        _pickleColor = seaPickle?.rank;
        const proceedReady = _pickleColor && _pickleColor >= 0;
        if (proceedReady) {
            // WazeWrap.Interface.Tab("LT", $ltTab.html, setupOptions, "LT");
            sdk.Sidebar.registerScriptTab().then((r) => {
                r.tabLabel.innerHTML = "LT";
                r.tabPane.innerHTML = $ltTab.html;
                setupOptions().then(() => {
                    scanArea();
                    lanesTabSetup();
                    displayLaneGraphics();
                });
            });
            $(`<style type="text/css">${ltCss}</style>`).appendTo("head");
            $("#map").append($ltButtons.html());
            WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, GM_info.script.version, LT_UPDATE_NOTES, GF_LINK, FORUM_LINK);
            console.log("LaneTools: loaded");
        }
        else {
            console.error("LaneTools: loading error....");
        }
    }
    function startScriptUpdateMonitor() {
        try {
            const updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(GM_info.script.name, GM_info.script.version, DOWNLOAD_URL, GM_xmlhttpRequest, DOWNLOAD_URL);
            updateMonitor.start();
        }
        catch (ex) {
            // Report, but don't stop if ScriptUpdateMonitor fails.
            console.error("WME LaneTools:", ex);
        }
    }
    async function setupOptions() {
        function setOptionStatus() {
            // Set check boxes based on last use
            setChecked("lt-ScriptEnabled", LtSettings.ScriptEnabled);
            setChecked("lt-UIEnable", LtSettings.UIEnable);
            setChecked("lt-AutoOpenWidth", LtSettings.AutoOpenWidth);
            setChecked("lt-AutoExpandLanes", LtSettings.AutoExpandLanes);
            setChecked("lt-AutoLanesTab", LtSettings.AutoLanesTab);
            setChecked("lt-HighlightsEnable", LtSettings.HighlightsEnable);
            setChecked("lt-LabelsEnable", LtSettings.LabelsEnable);
            setChecked("lt-NodesEnable", LtSettings.NodesEnable);
            setChecked("lt-LIOEnable", LtSettings.LIOEnable);
            setChecked("lt-CSEnable", LtSettings.CSEnable);
            setChecked("lt-highlightOverride", LtSettings.highlightOverride);
            setChecked("lt-CopyEnable", LtSettings.CopyEnable);
            setChecked("lt-SelAllEnable", LtSettings.SelAllEnable);
            setChecked("lt-serverSelect", LtSettings.serverSelect);
            setChecked("lt-AutoFocusLanes", LtSettings.AutoFocusLanes);
            setChecked("lt-ReverseLanesIcon", LtSettings.ReverseLanesIcon);
            setChecked("lt-ClickSaveEnable", LtSettings.ClickSaveEnable);
            setChecked("lt-ClickSaveStraight", LtSettings.ClickSaveStraight);
            setChecked("lt-ClickSaveTurns", LtSettings.ClickSaveTurns);
            setChecked("lt-LaneHeurPosHighlight", LtSettings.LaneHeurPosHighlight);
            setChecked("lt-LaneHeurNegHighlight", LtSettings.LaneHeurNegHighlight);
            setChecked("lt-LaneHeuristicsChecks", LtSettings.LaneHeuristicsChecks);
            setChecked("lt-highlightCSIcons", LtSettings.highlightCSIcons);
            setChecked("lt-AddTIO", LtSettings.AddTIO);
            setChecked("lt-IconsEnable", LtSettings.IconsEnable);
            setChecked("lt-IconsRotate", LtSettings.IconsRotate);
            setValue("lt-ABColor", LtSettings.ABColor);
            setValue("lt-BAColor", LtSettings.BAColor);
            setValue("lt-LabelColor", LtSettings.LabelColor);
            setValue("lt-ErrorColor", LtSettings.ErrorColor);
            setValue("lt-NodeColor", LtSettings.NodeColor);
            setValue("lt-TIOColor", LtSettings.TIOColor);
            setValue("lt-LIOColor", LtSettings.LIOColor);
            setValue("lt-CS1Color", LtSettings.CS1Color);
            setValue("lt-CS2Color", LtSettings.CS2Color);
            setValue("lt-HeurColor", LtSettings.HeurColor);
            setValue("lt-HeurFailColor", LtSettings.HeurFailColor);
            if (!getId("lt-ClickSaveEnable")?.checked) {
                $(".lt-option-container.clk-svr").hide();
            }
            if (!getId("lt-UIEnable")?.checked) {
                $("#lt-UI-wrapper").hide();
            }
            if (!getId("lt-HighlightsEnable")?.checked) {
                $("#lt-highlights-wrapper").hide();
            }
            if (!getId("lt-LaneHeuristicsChecks")?.checked) {
                $("#lt-heur-wrapper").hide();
            }
            if (IsBeta) {
                $("#lt-debug-msg").show();
            }
            else {
                $("#lt-debug-msg").hide();
            }
            $("input[type=radio][name=VerbosityLevel]").on("change", () => {
                if ($("#lt-InfoLevel").is(":checked")) {
                    LtSettings.VerbosityLevel = VERBOSITY.INFO;
                    LANETOOLS_DEBUG_LEVEL = VERBOSITY.INFO;
                    lt_log("Info level messages enabled.", VERBOSITY.INFO);
                }
                else if ($("#lt-DebugLevel").is(":checked")) {
                    LtSettings.VerbosityLevel = VERBOSITY.DEBUG;
                    LANETOOLS_DEBUG_LEVEL = VERBOSITY.DEBUG;
                    lt_log("DEBUG level messages enabled.", VERBOSITY.DEBUG);
                }
                else if ($("#lt-TraceLevel").is(":checked")) {
                    LtSettings.VerbosityLevel = VERBOSITY.TRACE;
                    LANETOOLS_DEBUG_LEVEL = VERBOSITY.TRACE;
                    lt_log("Trace level messages enabled.", VERBOSITY.TRACE);
                }
                else if ($("#lt-VerboseLevel").is(":checked")) {
                    LtSettings.VerbosityLevel = VERBOSITY.VERBOSE;
                    LANETOOLS_DEBUG_LEVEL = VERBOSITY.VERBOSE;
                    lt_log("VERBOSE level messages enabled.", VERBOSITY.VERBOSE);
                }
            });
            function setChecked(checkboxId, checked) {
                $(`#${checkboxId}`).prop("checked", checked);
            }
            function setValue(inputId, color) {
                const inputElem = $(`#${inputId}`);
                inputElem.attr("value", color);
                inputElem.css("border", `2px solid ${color}`);
            }
        }
        await loadSettings();
        await loadSpreadsheet();
        initLaneGuidanceClickSaver();
        // Layer for highlights
        sdk.Map.addLayer({
            layerName: LTHighlightLayer.name,
            styleRules: styleConfig.styleRules,
            zIndexing: true,
            styleContext: styleConfig.styleContext,
        });
        sdk.LayerSwitcher.addLayerCheckbox(LTHighlightLayer);
        sdk.Map.setLayerVisibility({
            layerName: LTHighlightLayer.name,
            visibility: LtSettings.highlightsVisible && LtSettings.HighlightsEnable,
        });
        sdk.Map.addLayer({
            layerName: LTLaneGraphics.name,
            styleRules: styleConfig.styleRules,
            zIndexing: true,
            styleContext: styleConfig.styleContext,
        });
        sdk.LayerSwitcher.addLayerCheckbox(LTLaneGraphics);
        sdk.Map.setLayerVisibility({
            layerName: LTLaneGraphics.name,
            visibility: LtSettings.ltGraphicsVisible,
        });
        sdk.Events.on({
            eventName: "wme-layer-checkbox-toggled",
            eventHandler: (payload) => {
                sdk.Map.setLayerVisibility({
                    layerName: payload.name,
                    visibility: payload.checked,
                });
                if (payload.name === LTLaneGraphics.name) {
                    LtSettings.ltGraphicsVisible = payload.checked;
                }
                else if (payload.name === LTHighlightLayer.name) {
                    LtSettings.highlightsVisible = payload.checked;
                }
                else if (payload.name === LTNamesLayer.name) {
                    LtSettings.ltNamesVisible = payload.checked;
                }
                saveSettings();
                if (payload.checked)
                    scanArea();
            },
        });
        sdk.Events.on({
            eventName: "wme-save-finished",
            eventHandler: (payload) => {
                if (payload.success) {
                    scanArea();
                    lanesTabSetup();
                    displayLaneGraphics();
                }
            },
        });
        sdk.Map.addLayer({
            layerName: LTNamesLayer.name,
            styleRules: styleConfig.styleRules,
            zIndexing: true,
            styleContext: styleConfig.styleContext,
        });
        // Layer for lane text
        sdk.LayerSwitcher.addLayerCheckbox(LTNamesLayer);
        sdk.Map.setLayerVisibility({
            layerName: LTNamesLayer.name,
            visibility: LtSettings.ltNamesVisible,
        });
        sdk.LayerSwitcher.setLayerCheckboxChecked({
            name: LTLaneGraphics.name,
            isChecked: LtSettings.ltGraphicsVisible,
        });
        sdk.LayerSwitcher.setLayerCheckboxChecked({
            name: LTHighlightLayer.name,
            isChecked: LtSettings.highlightsVisible,
        });
        sdk.LayerSwitcher.setLayerCheckboxChecked({ name: LTNamesLayer.name, isChecked: LtSettings.ltNamesVisible });
        sdk.Events.on({
            eventName: "wme-map-move-end",
            eventHandler: () => {
                scanArea();
                lanesTabSetup();
                displayLaneGraphics();
            },
        });
        sdk.Events.on({
            eventName: "wme-map-zoom-changed",
            eventHandler: () => {
                scanArea();
                displayLaneGraphics();
            },
        });
        sdk.Events.on({
            eventName: "wme-selection-changed",
            eventHandler: () => {
                const selected = sdk.Editing.getSelection();
                if (selected === null)
                    return;
                scanArea();
                lanesTabSetup();
                displayLaneGraphics();
            },
        });
        // Add keyboard shortcuts
        try {
            const enableHighlightsShortcut = {
                shortcutId: "enableHighlights",
                description: "Toggle lane highlights",
                callback: toggleHighlights,
                shortcutKeys: "",
            };
            sdk.Shortcuts.createShortcut(enableHighlightsShortcut);
            const enableUIEnhancementsShortcut = {
                callback: toggleUIEnhancements,
                shortcutId: "enableUIEnhancements",
                description: "Toggle UI Enhancements",
                shortcutKeys: "",
            };
            sdk.Shortcuts.createShortcut(enableUIEnhancementsShortcut);
            const enableHeuristicsShortcut = {
                callback: toggleLaneHeuristicsChecks,
                shortcutId: "enableHeuristics",
                description: "Toggle heuristic highlights",
                shortcutKeys: "",
            };
            sdk.Shortcuts.createShortcut(enableHeuristicsShortcut);
            const enableScriptShortcut = {
                shortcutId: "enableScript",
                description: "Toggle script",
                callback: toggleScript,
                shortcutKeys: "",
            };
            sdk.Shortcuts.createShortcut(enableScriptShortcut);
        }
        catch (e) {
            console.log("LT: Error creating shortcuts. This feature will be disabled.");
            $("#lt-EnableShortcut").text(`${TAB_TRANSLATIONS[langLocality].disabled}`);
            $("#lt-HighlightShortcut").text(`${TAB_TRANSLATIONS[langLocality].disabled}`);
            $("#lt-UIEnhanceShortcut").text(`${TAB_TRANSLATIONS[langLocality].disabled}`);
            $("#lt-LaneHeurChecksShortcut").text(`${TAB_TRANSLATIONS[langLocality].disabled}`);
            shortcutsDisabled = true;
        }
        // Setup user options now that the settings are loaded
        const highlights = $("#lt-HighlightsEnable");
        const colorTitle = $("#lt-color-title");
        const heurChecks = $("#lt-LaneHeuristicsChecks");
        setOptionStatus();
        setTimeout(() => {
            updateShortcutLabels();
        }, 50);
        setHeuristics();
        setLocalisation();
        if (_pickleColor && _pickleColor > 0) {
            let featureList = "LaneTools: The following special access features are enabled: ";
            $("#lt-adv-tools").css("display", "block");
            const quickTog = $("#lt-trans-quickTog");
            quickTog.attr("data-original-title", `${strings.selAllTooltip}`);
            quickTog.tooltip();
            _.each(RBSArray, (u) => {
                if (seaPickle !== null && u[0] === seaPickle.userName) {
                    if (u[1] === "1") {
                        isRBS = true;
                    }
                    if (u[2] === "1") {
                        allowCpyPst = true;
                    }
                }
            });
            if (isRBS) {
                $("#lt-serverSelectContainer").css("display", "block");
                featureList += "RBS Heuristics";
            }
            if (allowCpyPst) {
                $("#lt-sheet-link").css({
                    display: "block",
                    margin: "2px",
                });
                const ltSheetLinkAnchor = $("#lt-sheet-link > a");
                ltSheetLinkAnchor.css({
                    padding: "2px",
                    border: "2px solid black",
                    "border-radius": "6px",
                    "text-decoration": "none",
                });
                ltSheetLinkAnchor
                    .on("mouseenter", function () {
                    $(this).css("background-color", "orange");
                })
                    .on("mouseleave", function () {
                    $(this).css("background-color", "#eeeeee");
                });
                // $('#lt-cpy-pst').css('display', 'block');
                // $('.lt-Toolbar-Container').draggable({ containment: 'parent', zIndex: '100' });
                // WazeWrap.Events.register('selectionchanged', null, displayToolbar);
                $(".lt-toolbar-button").on("click", function () {
                    if ($(this)[0].id === "copyA-button") {
                        copyLaneInfo("A");
                    }
                    if ($(this)[0].id === "copyB-button") {
                        copyLaneInfo("B");
                    }
                    if ($(this)[0].id === "pasteA-button") {
                        pasteLaneInfo("A");
                    }
                    if ($(this)[0].id === "pasteB-button") {
                        pasteLaneInfo("B");
                    }
                });
                featureList = isRBS ? `${featureList}, Copy/Paste` : `${featureList}Copy/Paste`;
            }
            if (isRBS || allowCpyPst) {
                console.log(featureList);
            }
        }
        else {
            $("#lt-LaneTabFeatures").css("display", "none");
        }
        $(".lt-checkbox").on("click", function () {
            const settingName = $(this)[0].id.substring(3);
            LtSettings[settingName] = this.checked;
            saveSettings();
        });
        $(".lt-color-input").on("change", function () {
            const settingName = $(this)[0].id.substring(3);
            LtSettings[settingName] = this.value;
            saveSettings();
            $(`#lt-${settingName}`).css("border", `2px solid ${this.value}`);
            removeHighlights();
            scanArea();
        });
        $("#lt-ScriptEnabled").on("click", () => {
            if (LtSettings.ScriptEnabled) {
                scanArea();
            }
            else {
                removeHighlights();
                removeLaneGraphics();
            }
        });
        highlights.on("click", () => {
            if (LtSettings.HighlightsEnable) {
                scanArea();
            }
            else {
                removeHighlights();
            }
            scanArea();
        });
        $("#lt-LabelsEnable").on("click", () => {
            if (LtSettings.LabelsEnable) {
                scanArea();
            }
            else {
                removeHighlights();
                scanArea();
            }
        });
        $("#lt-NodesEnable").on("click", () => {
            if (LtSettings.NodesEnable) {
                scanArea();
            }
            else {
                removeHighlights();
                scanArea();
            }
        });
        $("#lt-LIOEnable").on("click", () => {
            if (getId("lt-LIOEnable")?.checked) {
                scanArea();
            }
            else {
                removeHighlights();
                scanArea();
            }
        });
        $("#lt-IconsEnable").on("click", () => {
            if (LtSettings.IconsEnable) {
                displayLaneGraphics();
            }
            else {
                removeLaneGraphics();
            }
        });
        $("#lt-highlightOverride").on("click", () => {
            if (LtSettings.highlightOverride) {
                scanArea();
            }
            else {
                removeHighlights();
                scanArea();
            }
        });
        colorTitle.on("click", () => {
            $("#lt-color-inputs").toggle();
        });
        $("#lt-ClickSaveEnable").on("click", () => {
            $(".lt-option-container.clk-svr").toggle();
        });
        $("#lt-UIEnable").on("click", () => {
            $("#lt-UI-wrapper").toggle();
            removeLaneGraphics();
        });
        highlights.on("click", () => {
            $("#lt-highlights-wrapper").toggle();
        });
        heurChecks.on("click", () => {
            $("#lt-heur-wrapper").toggle();
        });
        heurChecks.on("click", () => {
            if (getId("lt-LaneHeuristicsChecks")?.checked) {
                scanArea();
            }
            else {
                removeHighlights();
                scanArea();
            }
        });
        $("#lt-LaneHeurPosHighlight").on("click", () => {
            if (LtSettings.LaneHeurPosHighlight) {
                scanArea();
            }
            else {
                removeHighlights();
                scanArea();
            }
        });
        $("#lt-LaneHeurNegHighlight").on("click", () => {
            if (LtSettings.LaneHeurNegHighlight) {
                scanArea();
            }
            else {
                removeHighlights();
                scanArea();
            }
        });
        $("#lt-serverSelect").on("click", () => {
            setHeuristics();
            removeHighlights();
            scanArea();
        });
        // Watches for the shortcut dialog to close and updates UI
        const el = $.fn.hide;
        $.fn.hide = function () {
            this.trigger("hide");
            return el.apply(this, arguments);
        };
        $("#keyboard-dialog").on("hide", () => {
            checkShortcutsChanged();
        });
        colorTitle.tooltip();
    }
    async function loadSettings() {
        const localSettings = JSON.parse(localStorage.getItem("LT_Settings"));
        const serverSettings = await WazeWrap.Remote.RetrieveSettings("LT_Settings");
        if (!serverSettings) {
            console.error("LaneTools: Error communicating with WW settings server");
        }
        const defaultSettings = {
            lastSaveAction: 0,
            ScriptEnabled: true,
            UIEnable: true,
            AutoOpenWidth: false,
            AutoExpandLanes: false,
            AutoLanesTab: false,
            HighlightsEnable: true,
            LabelsEnable: true,
            NodesEnable: true,
            ABColor: "#990033",
            BAColor: "#0033cc",
            LabelColor: "#FFAD08",
            ErrorColor: "#F50E0E",
            NodeColor: "#66ccff",
            TIOColor: "#ff9900",
            LIOColor: "#ff9900",
            CS1Color: "#04E6F6",
            CS2Color: "#8F47FA",
            HeurColor: "#00aa00",
            HeurFailColor: "#E804F6",
            CopyEnable: false,
            SelAllEnable: false,
            serverSelect: false,
            LIOEnable: true,
            CSEnable: true,
            AutoFocusLanes: true,
            ReverseLanesIcon: false,
            ClickSaveEnable: true,
            ClickSaveStraight: false,
            ClickSaveTurns: true,
            enableScript: "",
            enableHighlights: "",
            enableUIEnhancements: "",
            enableHeuristics: "",
            LaneHeurNegHighlight: false,
            LaneHeurPosHighlight: false,
            LaneHeuristicsChecks: false,
            highlightCSIcons: false,
            highlightOverride: true,
            AddTIO: false,
            IconsEnable: true,
            IconsRotate: true,
            highlightsVisible: false,
            ltGraphicsVisible: false,
            ltNamesVisible: false,
        };
        LtSettings = $.extend({}, defaultSettings, localSettings);
        if (serverSettings && serverSettings.lastSaveAction > LtSettings.lastSaveAction) {
            $.extend(LtSettings, serverSettings);
            // console.log('LaneTools: server settings used');
        }
        else {
            // console.log('LaneTools: local settings used');
        }
    }
    async function saveSettings() {
        const { ScriptEnabled, HighlightsEnable, LabelsEnable, NodesEnable, UIEnable, AutoLanesTab, AutoOpenWidth, AutoExpandLanes, ABColor, BAColor, LabelColor, ErrorColor, NodeColor, TIOColor, LIOColor, CS1Color, CS2Color, CopyEnable, SelAllEnable, serverSelect, LIOEnable, CSEnable, AutoFocusLanes, ReverseLanesIcon, ClickSaveEnable, ClickSaveStraight, ClickSaveTurns, enableScript, enableHighlights, enableUIEnhancements, enableHeuristics, HeurColor, HeurFailColor, LaneHeurPosHighlight, LaneHeurNegHighlight, LaneHeuristicsChecks, highlightCSIcons, highlightOverride, AddTIO, IconsEnable, IconsRotate, highlightsVisible, ltGraphicsVisible, ltNamesVisible, } = LtSettings;
        const localSettings = {
            lastSaveAction: Date.now(),
            ScriptEnabled,
            HighlightsEnable,
            LabelsEnable,
            NodesEnable,
            UIEnable,
            AutoOpenWidth,
            AutoLanesTab,
            AutoExpandLanes,
            ABColor,
            BAColor,
            LabelColor,
            ErrorColor,
            NodeColor,
            TIOColor,
            LIOColor,
            CS1Color,
            CS2Color,
            CopyEnable,
            SelAllEnable,
            serverSelect,
            LIOEnable,
            CSEnable,
            AutoFocusLanes,
            ReverseLanesIcon,
            ClickSaveEnable,
            ClickSaveStraight,
            ClickSaveTurns,
            enableScript,
            enableHighlights,
            enableUIEnhancements,
            enableHeuristics,
            HeurColor,
            HeurFailColor,
            LaneHeurPosHighlight,
            LaneHeurNegHighlight,
            LaneHeuristicsChecks,
            highlightCSIcons,
            highlightOverride,
            AddTIO,
            IconsEnable,
            IconsRotate,
            highlightsVisible,
            ltGraphicsVisible,
            ltNamesVisible,
        };
        // Grab keyboard shortcuts and store them for saving
        // for (const name in W.accelerators.Actions) {
        //     const { shortcut, group } = W.accelerators.Actions[name];
        //     if (group === "wmelt") {
        for (const shortcut of sdk.Shortcuts.getAllShortcuts()) {
            if (shortcut.shortcutKeys !== null)
                localSettings[shortcut.shortcutId] = shortcut.shortcutKeys;
        }
        // Required for the instant update of changes to the keyboard shortcuts on the UI
        LtSettings = localSettings;
        if (localStorage) {
            localStorage.setItem("LT_Settings", JSON.stringify(localSettings));
        }
        const serverSave = await WazeWrap.Remote.SaveSettings("LT_Settings", localSettings);
        if (serverSave === null) {
            console.warn("LaneTools: User PIN not set in WazeWrap tab");
        }
        else {
            if (serverSave === false) {
                console.error("LaneTools: Unable to save settings to server");
            }
        }
    }
    async function loadSpreadsheet() {
        let connected = false;
        const apiKey = "AIzaSyDZjmkSx5xWc-86hsAIzedgDgRgy8vB7BQ";
        const settingsFailFunc = (jqXHR, _textStatus, errorThrown) => {
            console.error("LaneTools: Error loading settings:", errorThrown);
        };
        const rbsFailFunc = (_jqXHR, _textStatus, errorThrown) => {
            console.error("LaneTools: Error loading RBS:", errorThrown);
            if (!RBSArray.failed) {
                WazeWrap.Alerts.error(GM_info.script.name, "Unable to load heuristics data for LG. This feature will not be available");
                RBSArray.failed = true;
            }
        };
        const translationsFailFunc = (jqXHR, textStatus, errorThrown) => {
            console.error("LaneTools: Error loading trans:", errorThrown);
        };
        try {
            await $.getJSON(`https://sheets.googleapis.com/v4/spreadsheets/1_3sF09sMOid_us37j5CQqJZlBGGr1vI_3Rrmp5K-KCQ/values/Translations!A2:C?key=${apiKey}`)
                .done(async (transArray) => {
                if (transArray.values.length > 0) {
                    _.each(transArray.values, (t) => {
                        if (!TAB_TRANSLATIONS[t[1]] && Number.parseInt(t[2], 10) === 1) {
                            TAB_TRANSLATIONS[t[1]] = JSON.parse(t[0]);
                        }
                    });
                }
                else {
                    translationsFailFunc(null, null, "Failed to get any translations");
                }
            })
                .fail(translationsFailFunc);
        }
        catch (e) {
            translationsFailFunc(null, null, e);
        }
        try {
            await $.getJSON(`https://sheets.googleapis.com/v4/spreadsheets/1_3sF09sMOid_us37j5CQqJZlBGGr1vI_3Rrmp5K-KCQ/values/Angles!A2:B?key=${apiKey}`)
                .done((serverSettings) => {
                if (serverSettings.values.length > 0) {
                    _.each(serverSettings.values, (v) => {
                        if (!configArray[v[1]]) {
                            configArray[v[1]] = JSON.parse(v[0]);
                        }
                    });
                    connected = true;
                }
                else {
                    settingsFailFunc();
                }
            })
                .fail(settingsFailFunc);
        }
        catch (e) {
            settingsFailFunc(null, null, e);
        }
        try {
            await $.getJSON(`https://sheets.googleapis.com/v4/spreadsheets/1_3sF09sMOid_us37j5CQqJZlBGGr1vI_3Rrmp5K-KCQ/values/RBS_Access!A2:C?key=${apiKey}`)
                .done((allowedRBS) => {
                if (allowedRBS.values.length > 0) {
                    for (let i = 0; i < allowedRBS.values.length; i++) {
                        RBSArray[i] = allowedRBS.values[i];
                    }
                    RBSArray.failed = false;
                }
                else {
                    rbsFailFunc();
                }
            })
                .fail(rbsFailFunc);
        }
        catch (e) {
            rbsFailFunc(null, null, e);
        }
        if (connected) {
            _.each(configArray, (serverKey) => {
                for (const k in serverKey) {
                    if (serverKey.hasOwnProperty(k)) {
                        const keyValue = serverKey[k];
                        serverKey[k] = Number.parseFloat(keyValue);
                    }
                }
            });
        }
    }
    function setLocalisation() {
        // langLocality = I18n.currentLocale().toLowerCase();
        const locale = sdk.Settings.getLocale();
        LANG = locale.localeCode.toLowerCase();
        if (!(LANG in TAB_TRANSLATIONS))
            langLocality = "en-us";
        else
            langLocality = LANG;
        if (!(langLocality in TAB_TRANSLATIONS)) {
            langLocality = "en";
        }
        if (TAB_TRANSLATIONS[langLocality]) {
            strings = TAB_TRANSLATIONS[langLocality];
        }
        else if (langLocality.includes("-") && TAB_TRANSLATIONS[langLocality.split("-")[0]]) {
            strings = TAB_TRANSLATIONS[langLocality.split("-")[0]];
        }
        // If there is no value set in any of the translated strings then use the defaults
        for (const transString of Object.keys(strings)) {
            if (strings[transString] === "") {
                strings[transString] = TAB_TRANSLATIONS.default[transString];
            }
        }
        $(".lt-trans-enabled").text(strings.enabled);
        $(".lt-trans-tglshcut").text(strings.toggleShortcut);
        $("#lt-trans-uiEnhance").text(strings.UIEnhance);
        $("#lt-trans-autoTab").text(strings.autoOpen);
        $("#lt-trans-autoWidth").text(strings.autoWidth);
        $("#lt-trans-autoExpand").text(strings.autoExpand);
        $("#lt-trans-autoFocus").text(strings.autoFocus);
        $("#lt-trans-orient").text(strings.reOrient);
        $("#lt-trans-enClick").text(strings.enClick);
        $("#lt-trans-straClick").text(strings.clickStraight);
        $("#lt-trans-turnClick").text(strings.clickTurn);
        $("#lt-trans-mapHigh").text(strings.mapHighlight);
        $("#lt-trans-lnLabel").text(strings.laneLabel);
        $("#lt-trans-nodeHigh").text(strings.nodeHigh);
        $("#lt-trans-laOver").text(strings.LAOHigh);
        $("#lt-trans-csOver").text(strings.CSOHigh);
        $("#lt-trans-heurCan").text(strings.heuristics);
        $("#lt-trans-heurPos").text(strings.posHeur);
        $("#lt-trans-heurNeg").text(strings.negHeur);
        $("#lt-trans-highCol").text(strings.highColor);
        $("#lt-trans-fwdCol").text(strings.fwdCol);
        $("#lt-trans-revCol").text(strings.revCol);
        $("#lt-trans-labelCol").text(strings.labelCol);
        $("#lt-trans-errorCol").text(strings.errorCol);
        $("#lt-trans-nodeCol").text(strings.laneNodeCol);
        $("#lt-trans-tioCol").text(strings.nodeTIOCol);
        $("#lt-trans-laoCol").text(strings.LAOCol);
        $("#lt-trans-viewCol").text(strings.viewCSCol);
        $("#lt-trans-hearCol").text(strings.hearCSCol);
        $("#lt-trans-posCol").text(strings.heurPosCol);
        $("#lt-trans-negCol").text(strings.heurNegCol);
        $("#lt-trans-advTools").text(strings.advTools);
        $("#lt-trans-quickTog").text(strings.quickTog);
        $("#lt-trans-heurRBS").text(strings.showRBS);
        $("#lt-trans-csIcons").text(strings.csIcons);
        $("#lt-trans-highOver").text(strings.highlightOverride);
        $("#lt-trans-AddTIO").text(strings.addTIO);
        $("#lt-trans-enIcons").text(strings.enIcons);
        $("#lt-trans-IconsRotate").text(strings.IconsRotate);
        $("#lt-trans-debugMsg").text(strings.debugMsg);
        $("#lt-trans-InfoLevel").text(strings.InfoLevel);
        $("#lt-trans-DebugLevel").text(strings.DebugLevel);
        $("#lt-trans-TraceLevel").text(strings.TraceLevel);
        $("#lt-trans-VerboseLevel").text(strings.VerboseLevel);
        $("#lt-color-title").attr("data-original-title", strings.colTooltip);
        if (shortcutsDisabled) {
            $("#lt-EnableShortcut").text(`${strings.disabled}`);
            $("#lt-HighlightShortcut").text(`${strings.disabled}`);
            $("#lt-UIEnhanceShortcut").text(`${strings.disabled}`);
            $("#lt-LaneHeurChecksShortcut").text(`${strings.disabled}`);
        }
    }
    function setHeuristics() {
        if (RBSArray.failed) {
            return;
        }
        const angles = isRBS && LtSettings.serverSelect ? configArray.RBS : configArray.RPS;
        MAX_LEN_HEUR = angles.MAX_LEN_HEUR;
        MAX_PERP_DIF = angles.MAX_PERP_DIF;
        MAX_PERP_DIF_ALT = angles.MAX_PERP_DIF_ALT;
        MAX_PERP_TO_CONSIDER = angles.MAX_PERP_TO_CONSIDER;
        MAX_STRAIGHT_TO_CONSIDER = angles.MAX_STRAIGHT_TO_CONSIDER;
        MAX_STRAIGHT_DIF = angles.MAX_STRAIGHT_DIF;
    }
    // Checks the WME value of a shortcut (from the shortcut menu) against the scripts value and saves if they are different
    function checkShortcutsChanged() {
        let triggerSave = false;
        for (const shortcut of sdk.Shortcuts.getAllShortcuts()) {
            if (LtSettings[shortcut.shortcutId] !== shortcut.shortcutKeys) {
                triggerSave = true;
                console.log(`LaneTools: Stored shortcut ${name}: ${LtSettings[shortcut.shortcutId]} changed to ${shortcut.shortcutKeys}`);
                break;
            }
        }
        if (triggerSave) {
            saveSettings();
            setTimeout(() => {
                updateShortcutLabels();
            }, 200);
        }
    }
    // Pulls the keyboard shortcuts from the script and returns a machine value
    function getKeyboardShortcut(shortcut) {
        if (shortcut === null)
            return null;
        const keys = LtSettings[shortcut];
        if (typeof keys !== "string")
            return null;
        let val = "";
        if (keys.indexOf("+") > -1) {
            const specialKeys = keys.split("+")[0];
            for (let i = 0; i < specialKeys.length; i++) {
                if (val.length > 0) {
                    val += "+";
                }
                if (specialKeys[i] === "C") {
                    val += "Ctrl";
                }
                if (specialKeys[i] === "S") {
                    val += "Shift";
                }
                if (specialKeys[i] === "A") {
                    val += "Alt";
                }
            }
            if (val.length > 0) {
                val += "+";
            }
            let num = Number.parseInt(keys.split("+")[1]);
            if (num >= 96 && num <= 105) {
                // Numpad keys
                num -= 48;
                val += "[num pad]";
            }
            val += String.fromCharCode(num);
        }
        else {
            let num = Number.parseInt(keys, 10);
            if (num >= 96 && num <= 105) {
                // Numpad keys
                num -= 48;
                val += "[num pad]";
            }
            val += String.fromCharCode(num);
        }
        return val;
    }
    // Updates the UI tab with the shortcut values
    function updateShortcutLabels() {
        if (!shortcutsDisabled) {
            $("#lt-EnableShortcut").text(getKeyboardShortcut("enableScript") || "");
            $("#lt-HighlightShortcut").text(getKeyboardShortcut("enableHighlights") || "");
            $("#lt-UIEnhanceShortcut").text(getKeyboardShortcut("enableUIEnhancements") || "");
            $("#lt-LaneHeurChecksShortcut").text(getKeyboardShortcut("enableHeuristics") || "");
        }
    }
    // function getLegacySegObj(id) {
    //     return W.model.segments.getObjectById(id);
    // }
    function getSegObj(id) {
        if (!id)
            return null;
        return sdk.DataModel.Segments.getById({ segmentId: id });
    }
    function getNodeObj(id) {
        if (id === null)
            return null;
        return sdk.DataModel.Nodes.getById({ nodeId: id });
    }
    // function getLegacyNodeObj(id) {
    //     return W.model.nodes.getObjectById(id);
    // }
    function lanesTabSetup() {
        // hook into edit panel on the left
        if (getId("edit-panel")?.getElementsByTagName("wz-tabs").length === 0) {
            setTimeout(lanesTabSetup, 500);
            //console.log('Edit panel not yet loaded.');
            return;
        }
        // const selSeg = W.selectionManager.getSelectedWMEFeatures();
        const selection = sdk.Editing.getSelection();
        let fwdDone = false;
        let revDone = false;
        let isRotated = false;
        let expandEditTriggered = false;
        // Highlights junction node when hovering over left panel
        function hoverNodeTo() {
            // W.model.nodes.getObjectById(W.selectionManager.getSegmentSelection().segments[0].attributes.toNodeID)
            //     .attributes.geometry;
            //        W.model.nodes.get(W.selectionManager.getSegmentSelection().segments[0].attributes.toNodeID).attributes.geometry
            const selSeg = isSegmentSelected(selection)
                ? sdk.DataModel.Segments.getById({ segmentId: selection?.ids[0] })
                : null;
            const nodeB = selSeg?.toNodeId ? sdk.DataModel.Nodes.getById({ nodeId: selSeg.toNodeId }) : null;
            nodeB && document.getElementById(nodeB?.id.toString());
            // document.getElementById(
            //     W.model.nodes.getObjectById(W.selectionManager.getSegmentSelection().segments[0].attributes.toNodeID)
            //         .attributes.geometry.id
            // );
            //        document.getElementById(W.model.nodes.get(W.selectionManager.getSegmentSelection().segments[0].attributes.toNodeID).attributes.geometry.id)
            console.log("hovering to B");
        }
        function hoverNodeFrom() {
            // W.model.nodes.getObjectById(W.selectionManager.getSegmentSelection().segments[0].attributes.fromNodeID)
            //     .attributes.geometry;
            const selSeg = isSegmentSelected(selection)
                ? sdk.DataModel.Segments.getById({ segmentId: selection?.ids[0] })
                : null;
            const nodeA = selSeg?.fromNodeId ? sdk.DataModel.Nodes.getById({ nodeId: selSeg.fromNodeId }) : null;
            nodeA && document.getElementById(nodeA?.id.toString());
            //        W.model.nodes.get(W.selectionManager.getSegmentSelection().segments[0].attributes.fromNodeID).attributes.geometry
            // document.getElementById(
            //     W.model.nodes.getObjectById(W.selectionManager.getSegmentSelection().segments[0].attributes.fromNodeID)
            //         .attributes.geometry.id
            // );
            //        document.getElementById(W.model.nodes.get(W.selectionManager.getSegmentSelection().segments[0].attributes.fromNodeID).attributes.geometry.id)
            console.log("hovering to A");
        }
        function showAddLaneGuidance(laneDir) {
            insertSelAll(laneDir);
            addLnsBtns(laneDir);
            adjustSpace();
            focusEle();
            applyButtonListeners();
            // if (getId("lt-AddTIO")?.checked) addTIOUI(laneDir);
        }
        function updateUI(waitToFinish = true) {
            // if (eventInfo !== null) {
            //     eventInfo.stopPropagation();
            // }
            //        if (getId('lt-ReverseLanesIcon').checked && !isRotated) {
            //            rotateArrows();
            //        }
            if (waitToFinish) {
                waitForElementLoaded(".fwd-lanes > div.lane-instruction.lane-instruction-to > div.instruction > div.lane-edit > .edit-lane-guidance").then((elem) => {
                    $(elem).off("click");
                    $(elem).on("click", () => {
                        showAddLaneGuidance("fwd");
                    });
                    updateUI(false);
                });
                waitForElementLoaded(".rev-lanes > div.lane-instruction.lane-instruction-to > div.instruction > div.lane-edit > .edit-lane-guidance").then((elem) => {
                    $(elem).off("click");
                    $(elem).on("click", () => {
                        showAddLaneGuidance("rev");
                    });
                    updateUI(false);
                });
                return;
            }
            if (LtSettings.highlightCSIcons) {
                colorCSDir();
            }
            // Add delete buttons and preselected lane number buttons to UI
            if (_pickleColor && _pickleColor >= 1) {
                const selSeg = isSegmentSelected(selection)
                    ? sdk.DataModel.Segments.getById({ segmentId: selection?.ids[0] })
                    : null;
                if (getId("li-del-opp-btn"))
                    $("#li-del-opp-btn").remove();
                if (getId("li-del-fwd-btn"))
                    $("#li-del-fwd-btn").remove();
                if (getId("li-del-rev-btn"))
                    $("#li-del-rev-btn").remove();
                const $fwdButton = $(`<button type="button" id="li-del-fwd-btn" style="height:20px;background-color:white;border:1px solid grey;border-radius:8px;">${strings.delFwd}</button>`);
                const $revButton = $(`<button type="button" id="li-del-rev-btn" style="height:20px;background-color:white;border:1px solid grey;border-radius:8px;">${strings.delRev}</button>`);
                const $oppButton = $(`<button type="button" id="li-del-opp-btn" style="height:auto;background-color:orange;border:1px solid grey;border-radius:8px; margin-bottom:5px;">${strings.delOpp}</button>`);
                const $btnCont1 = $('<div style="display:inline-block;position:relative;" />');
                const $btnCont2 = $('<div style="display:inline-block;position:relative;" />');
                const $btnCont3 = $('<div style="display:inline-block;position:relative;" />');
                $fwdButton.appendTo($btnCont1);
                $revButton.appendTo($btnCont2);
                $oppButton.appendTo($btnCont3);
                const delFwd = $("#li-del-fwd-btn");
                const delRev = $("#li-del-rev-btn");
                const delOpp = $("#li-del-opp-btn");
                delFwd.off();
                delRev.off();
                delOpp.off();
                if (!getId("li-del-rev-btn") && !revDone && selSeg?.toNodeLanesCount && selSeg.toNodeLanesCount > 0) {
                    if ($(".rev-lanes > div.lane-instruction.lane-instruction-from > div.instruction").length > 0) {
                        $btnCont2.prependTo(".rev-lanes > div.lane-instruction.lane-instruction-from > div.instruction");
                        $(".rev-lanes > div.lane-instruction.lane-instruction-from > div.instruction").css("border-bottom", `4px dashed ${LtSettings.BAColor}`);
                    }
                    else if (selSeg.isAtoB) {
                        //jm6087
                        $oppButton.prop("title", "rev");
                        $oppButton.prependTo("#edit-panel > div > div > div > div.segment-edit-section > wz-tabs > wz-tab.lanes-tab");
                    }
                }
                else {
                    $(".rev-lanes > div.lane-instruction.lane-instruction-from > div.instruction").css("border-bottom", `4px dashed ${LtSettings.BAColor}`);
                }
                if (!getId("li-del-fwd-btn") &&
                    !fwdDone &&
                    selSeg?.fromNodeLanesCount &&
                    selSeg.fromNodeLanesCount > 0) {
                    if ($(".fwd-lanes > div.lane-instruction.lane-instruction-from > div.instruction").length > 0) {
                        $btnCont1.prependTo(".fwd-lanes > div.lane-instruction.lane-instruction-from > div.instruction");
                        $(".fwd-lanes > div.lane-instruction.lane-instruction-from > div.instruction").css("border-bottom", `4px dashed ${LtSettings.ABColor}`);
                    }
                    else if (selSeg.isBtoA) {
                        //jm6087
                        $oppButton.prop("title", "fwd");
                        $oppButton.prependTo("#edit-panel > div > div > div > div.segment-edit-section > wz-tabs > wz-tab.lanes-tab");
                    }
                }
                else {
                    $(".fwd-lanes > div.lane-instruction.lane-instruction-from > div.instruction").css("border-bottom", `4px dashed ${LtSettings.ABColor}`);
                }
                $("#li-del-fwd-btn").on("click", () => {
                    delLanes("fwd");
                    fwdDone = true;
                    setTimeout(() => {
                        updateUI();
                    }, 200);
                });
                $("#li-del-rev-btn").on("click", () => {
                    delLanes("rev");
                    revDone = true;
                    setTimeout(() => {
                        updateUI();
                    }, 200);
                });
                $("#li-del-opp-btn").on("click", function () {
                    const dir = $(this).prop("title");
                    delLanes(dir);
                    if (dir === "rev") {
                        revDone = true;
                    }
                    else {
                        fwdDone = true;
                    }
                    updateUI();
                });
            }
            if (!fwdDone && !revDone && !expandEditTriggered) {
                expandEdit();
            }
            adjustSpace();
        }
        function applyButtonListeners() {
            $(".apply-button.waze-btn.waze-btn-blue").off();
            $(".cancel-button").off();
            const fwdLanes = $(".fwd-lanes");
            const revLanes = $(".rev-lanes");
            fwdLanes.find(".apply-button.waze-btn.waze-btn-blue").on("click", () => {
                fwdDone = true;
                updateUI();
            });
            revLanes.find(".apply-button.waze-btn.waze-btn-blue").on("click", () => {
                revDone = true;
                updateUI();
            });
            fwdLanes.find(".cancel-button").on("click", () => {
                fwdDone = true;
                updateUI();
            });
            revLanes.find(".cancel-button").on("click", () => {
                revDone = true;
                updateUI();
            });
        }
        function expandEdit() {
            expandEditTriggered = true;
            if (LtSettings.AutoExpandLanes) {
                if (!fwdDone) {
                }
                if (!revDone) {
                }
            }
            if (LtSettings.AutoOpenWidth) {
                if (!fwdDone) {
                    $(".fwd-lanes").find(".set-road-width > wz-button").trigger("click"); // ADDED
                }
                if (!revDone) {
                    $(".rev-lanes").find(".set-road-width > wz-button").trigger("click"); // ADDED
                }
            }
        }
        function adjustSpace() {
            $(".fwd-lanes > div > .direction-lanes").css({ padding: "5px 5px 10px", "margin-bottom": "10px" });
            $(".rev-lanes > div > .direction-lanes").css({ padding: "5px 5px 10px", margin: "0px" });
            $(".fwd-lanes > div > .lane-instruction.lane-instruction-to > .instruction > .lane-edit > .edit-region > div > .controls.direction-lanes-edit").css("padding-top", "10px");
            $(".rev-lanes > div > .lane-instruction.lane-instruction-to > .instruction > .lane-edit > .edit-region > div > .controls.direction-lanes-edit").css("padding-top", "10px");
            $(".fwd-lanes > div.lane-instruction.lane-instruction-to > div.instruction > div.edit-region > div > div > div:nth-child(1)").css("margin-bottom", "4px");
            $(".rev-lanes > div.lane-instruction.lane-instruction-to > div.instruction > div.edit-region > div > div > div:nth-child(1)").css("margin-bottom", "4px");
        }
        function getLaneItems(count, class_names_list) {
            const itemsList = [];
            const classString = class_names_list.join(" ");
            const idStringBase = class_names_list.join("-");
            for (let i = 1; i <= count; ++i) {
                const idString = `${idStringBase}-${i.toString()}`;
                const selectorString = `<div class="${classString}" id="${idString}">${i.toString()}</div>`;
                const newItem = $(selectorString).css({
                    padding: "1px 1px 1px 1px",
                    margin: "0 3px 0 3px",
                    border: "1px solid black",
                    "border-radius": "8px",
                    "border-color": "black",
                    height: "15px",
                    width: "15px",
                    "text-align": "center",
                    "line-height": "1.5",
                    "font-size": "10px",
                    display: "inline-block",
                });
                $(selectorString).on("hover", function () {
                    $(this).css({
                        border: "1px solid #26bae8",
                        "background-color": "#26bae8",
                        cursor: "pointer",
                    });
                });
                itemsList.push(newItem);
            }
            return itemsList;
        }
        function setupLaneCountControls(parentSelector, classNamesList) {
            const jqueryClassSelector = `.${classNamesList.join(".")}`;
            $(jqueryClassSelector).on("click", function () {
                $(jqueryClassSelector).css({ "background-color": "transparent", color: "black" });
                $(this).css({ "background-color": "navy", color: "white" });
            });
        }
        function addLnsBtns(laneDir) {
            // Add predetermined lane values
            if (laneDir !== "fwd" && laneDir !== "rev") {
                throw new Error(`Direction ${laneDir} is not supported`);
            }
            const dirLanesClass = `.${laneDir}-lanes`;
            const addLanesTag = `lt-${laneDir}-add-lanes`;
            const addWidthTag = `lt-${laneDir}-add-Width`;
            const lanes = $(dirLanesClass);
            if (lanes.find(".lane-instruction-to").children().length > 0x0 && !getId(addLanesTag)) {
                const addLanesItem = $(`<div style="display:inline-flex;flex-direction:row;justify-content:space-around;margin-top:4px;position:relative;" id="${addLanesTag}" />`);
                const classNamesList = ["lt-add-lanes", laneDir];
                const laneCountsToAppend = getLaneItems(10, classNamesList);
                for (let idx = 0; idx < laneCountsToAppend.length; ++idx) {
                    addLanesItem.append(laneCountsToAppend[idx]);
                }
                const prependSelector = `${dirLanesClass} > div.lane-instruction.lane-instruction-to > div.instruction > div.edit-region > div`;
                // let prependSelector = dirLanesClass + "> div > div > div.lane-instruction.lane-instruction-to > div.instruction > div.edit-region > div.controls.direction-lanes-edit > div.form-group > div.controls-container";
                waitForElementLoaded(prependSelector).then((elm) => {
                    const prependElement = $(prependSelector);
                    prependElement.prepend(addLanesItem);
                    setupLaneCountControls(lanes, classNamesList);
                    $(".lt-add-lanes").on("click", function () {
                        const numAddStr = $(this).text();
                        const numAdd = Number.parseInt(numAddStr, 10);
                        if ($(this).hasClass(`lt-add-lanes ${laneDir}`)) {
                            // As of React >=15.6.  Triggering change or input events on the input form cannot be
                            // done via jquery selectors.  Which means that they have to be triggered via
                            // React native calls.
                            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                            const inputForm = document.querySelector(`wz-card${dirLanesClass} input[name=laneCount]`);
                            nativeInputValueSetter.call(inputForm, numAdd);
                            const inputEvent = new Event("input", { bubbles: true });
                            inputForm?.dispatchEvent(inputEvent);
                            const changeEvent = new Event("change", { bubbles: true });
                            inputForm?.dispatchEvent(changeEvent);
                        }
                    });
                });
            }
            $(".lt-add-Width").on("click", function () {
                const numAddStr = $(this).text();
                const numAdd = Number.parseInt(numAddStr, 10);
                if ($(this).hasClass(`lt-add-Width ${laneDir}`)) {
                    const lanes = $(dirLanesClass);
                    lanes.find("#number-of-lanes").val(numAdd);
                    lanes.find("#number-of-lanes").trigger("change");
                    lanes.find("#number-of-lanes").trigger("focus");
                }
                // if ($(this).hasClass('lt-add-Width rev')) {
                //     const revLanes = $('.rev-lanes');
                //     revLanes.find('#number-of-lanes').val(numAdd);
                //     revLanes.find('#number-of-lanes').trigger("change");
                //     revLanes.find('#number-of-lanes').trigger("focus");
                // }
            });
        }
        function focusEle() {
            // Places the focus on the relevant lanes # input if the direction exists
            const autoFocusLanes = LtSettings.AutoFocusLanes;
            if (autoFocusLanes) {
                const fwdLanes = $(".fwd-lanes");
                const revLanes = $(".rev-lanes");
                if (fwdLanes.find(".edit-region").children().length > 0 && !fwdDone) {
                    fwdLanes.find(".form-control").trigger("focus");
                }
                else if (revLanes.find(".edit-region").children().length > 0 && !revDone) {
                    revLanes.find(".form-control").trigger("focus");
                }
            }
        }
        function insertSelAll(dir) {
            const setAllEnable = LtSettings.SelAllEnable;
            if (setAllEnable) {
                $(".street-name").css("user-select", "none");
                const inputDirection = dir === "fwd" ? $(".fwd-lanes").find(".form-control")[0] : $(".rev-lanes").find(".form-control")[0];
                const startVal = $(inputDirection).val();
                // Toggles all checkboxes in turns row
                $(inputDirection).on("change", function () {
                    let boxDirection;
                    if ($(this).parents(".fwd-lanes").length) {
                        boxDirection = $(".fwd-lanes").find(".controls-container.turns-region");
                    }
                    else if ($(this).parents(".rev-lanes").length) {
                        boxDirection = $(".rev-lanes").find(".controls-container.turns-region");
                    }
                    boxDirection = $(".street-name", boxDirection);
                    for (let p = 0; p < boxDirection.length; p++) {
                        $(boxDirection[p]).off();
                        $(boxDirection[p]).on("click", function () {
                            const secParent = $(this).get(0);
                            const contParent = secParent.parentElement;
                            const chkBxs = $(".checkbox-large.checkbox-white", contParent);
                            const firstCheckInv = !getId(chkBxs[0].id)?.checked;
                            for (let i = 0; i < chkBxs.length; i++) {
                                const checkBox = $(`#${chkBxs[i].id}`);
                                checkBox.prop("checked", firstCheckInv);
                                checkBox.change();
                            }
                        });
                    }
                });
                if (startVal > 0) {
                    $(inputDirection).trigger("change");
                }
            }
        }
        function colorCSDir() {
            const selSeg = isSegmentSelected(selection) && selection?.objectType === "segment"
                ? sdk.DataModel.Segments.getById({ segmentId: selection.ids[0] })
                : null;
            if (!selSeg)
                return;
            const fwdNode = getNodeObj(selSeg?.toNodeId);
            const revNode = getNodeObj(selSeg?.fromNodeId);
            const fwdConfig = checkLanesConfiguration(selSeg, fwdNode, fwdNode ? fwdNode.connectedSegmentIds : [], selSeg?.toNodeLanesCount);
            const revConfig = checkLanesConfiguration(selSeg, revNode, revNode ? revNode.connectedSegmentIds : [], selSeg?.fromNodeLanesCount);
            if (fwdConfig.csMode > 0) {
                const csColor = fwdConfig.csMode === 1 ? LtSettings.CS1Color : LtSettings.CS2Color;
                const arrowDiv = $("#segment-edit-lanes > div > div > div.fwd-lanes > div.lane-instruction.lane-instruction-to > div.instruction > div.lane-arrows > div").children();
                for (let i = 0; i < arrowDiv.length; i++) {
                    if (arrowDiv[i].title === fwdConfig.csStreet) {
                        $(arrowDiv[i]).css("background-color", csColor);
                    }
                }
            }
            if (revConfig.csMode > 0) {
                const csColor = revConfig.csMode === 1 ? LtSettings.CS1Color : LtSettings.CS2Color;
                const arrowDiv = $("#segment-edit-lanes > div > div > div.rev-lanes > div.lane-instruction.lane-instruction-to > div.instruction > div.lane-arrows > div").children();
                for (let i = 0; i < arrowDiv.length; i++) {
                    if (arrowDiv[i].title === revConfig.csStreet) {
                        $(arrowDiv[i]).css("background-color", csColor);
                    }
                }
            }
        }
        // Rotates lane display arrows in lane tab for South directions
        // Function written by Dude495 and modified by SkiDooGuy to fit into LaneTools better
        function rotateArrows() {
            const direction = document.getElementsByClassName("heading");
            const boxDiv = $(".lane-arrows > div").get();
            for (let i = 0; i < direction.length; i++) {
                if (direction[i]?.textContent?.includes("south")) {
                    const arrows = $(boxDiv[i]).children();
                    $(arrows).css("transform", "rotate(180deg)");
                    $(boxDiv[i]).append(arrows.get().reverse());
                }
            }
            isRotated = true;
        }
        // Begin lanes tab enhancements
        if (LtSettings.UIEnable && LtSettings.ScriptEnabled) {
            if (isSegmentSelected(selection)) {
                // Check to ensure that there is only one segment object selected, then setup click event
                waitForElementLoaded(".lanes-tab").then((elm) => {
                    formatLanesTab(LtSettings.AutoLanesTab || elm.isActive);
                });
                //$('.lanes-tab').on("click",(event) => {
                //    fwdDone = false;
                //    revDone = false;
                //    updateUI(event);
                //});
            }
            else if (selection && selection.ids.length === 2) {
                // We have exactly TWO features selected.  Check heuristics and highlight
                scanHeuristicsCandidates(selection);
            }
        }
        function formatLanesTab(clickTab = false, tries = 0) {
            if ($(".tabs-labels > div:nth-child(3)", $(".segment-edit-section > wz-tabs")[0].shadowRoot?.getRootNode()).length > 0) {
                fwdDone = false;
                revDone = false;
                $(".tabs-labels > div:nth-child(3)", $(".segment-edit-section > wz-tabs")[0].shadowRoot?.getRootNode()).on("click", () => {
                    fwdDone = false;
                    revDone = false;
                    updateUI();
                });
                if (clickTab) {
                    // If the auto open lanes option is enabled, initiate a click event on the Lanes tab element
                    $(".tabs-labels > div:nth-child(3)", $(".segment-edit-section > wz-tabs")[0].shadowRoot?.getRootNode()).trigger("click");
                }
            }
            else if (tries < 500) {
                setTimeout(() => {
                    formatLanesTab(clickTab, tries + 1);
                }, 200);
            }
            else {
                console.error("LaneTools: Failed to click lanes tab");
            }
        }
    }
    // Toggles parts of script when the keyboard shortcut is used
    function toggleScript() {
        $("#lt-ScriptEnabled").trigger("click");
    }
    function toggleHighlights() {
        $("#lt-HighlightsEnable").trigger("click");
    }
    function toggleUIEnhancements() {
        $("#lt-UIEnable").trigger("click");
    }
    function toggleLaneHeuristicsChecks() {
        $("#lt-LaneHeuristicsChecks").trigger("click");
    }
    function displayToolbar() {
        const objSelected = sdk.Editing.getSelection();
        const scriptEnabled = LtSettings.ScriptEnabled;
        const copyEnable = LtSettings.CopyEnable;
        if (scriptEnabled && copyEnable && copyEnable && objSelected && objSelected.ids.length === 1) {
            if (objSelected.objectType === "segment") {
                const map = sdk.Map.getMapViewportElement();
                $("#lt-toolbar-container").css({
                    display: "block",
                    left: map.width() * 0.1,
                    top: map.height() * 0.1,
                });
            }
        }
        else {
            $("#lt-toolbar-container").css("display", "none");
        }
    }
    function getId(ele) {
        return document.getElementById(ele);
    }
    function isSegment(obj) {
        return obj && "roadType" in obj;
    }
    function isSegmentSelected(selection) {
        return (selection && selection !== null && selection.objectType === "segment") || false;
    }
    // returns true if object is within window  bounds and above zoom threshold
    function onScreen(obj, curZoomLevel) {
        if (!obj || !obj.geometry) {
            return false;
        }
        // Either FREEWAY or Zoom >=4
        if (curZoomLevel >= MIN_ZOOM_NON_FREEWAY || (isSegment(obj) && obj.roadType === LT_ROAD_TYPE.FREEWAY)) {
            // var ext = W.map.getOLExtent();
            var ext = sdk.Map.getMapExtent();
            return true;
        }
        return false;
    }
    // borrowed from JAI
    function getAzimuthAngle(nodeId, segment) {
        if (nodeId == null || segment == null) {
            return null;
        }
        // let ja_dx: number | undefined;
        // let ja_dy: number | undefined;
        // if (segment.fromNodeId === nodeId) {
        //     const sp: Position | undefined = lt_get_second_point(segment);
        //     const fp: Position | undefined = lt_get_first_point(segment);
        //     if (!sp || !fp) return null;
        //     ja_dx = sp[0] - fp[0];
        //     ja_dy = sp[1] - fp[1];
        // } else {
        //     const next_to_last: Position | undefined = lt_get_next_to_last_point(segment);
        //     const last_point: Position | undefined = lt_get_last_point(segment);
        //     if (!next_to_last || !last_point) return null;
        //     ja_dx = next_to_last[0] - last_point[0];
        //     ja_dy = next_to_last[1] - last_point[1];
        // }
        // const angle_rad = Math.atan2(ja_dy, ja_dx);
        // let angle_deg = ((angle_rad * 180) / Math.PI) % 360;
        // if (angle_deg < 0) angle_deg = angle_deg + 360;
        // // console.log('Cardinal: ' + Math.round(angle_deg));
        // return Math.round(angle_deg);
        let bearing = null;
        if (segment.fromNodeId === nodeId) {
            const sp = lt_get_second_point(segment);
            const fp = lt_get_first_point(segment);
            if (!sp || !fp)
                return null;
            bearing = turf.bearing(turf.point(fp), turf.point(sp));
        }
        else {
            const next_to_last = lt_get_next_to_last_point(segment);
            const last_point = lt_get_last_point(segment);
            if (!next_to_last || !last_point)
                return null;
            bearing = turf.bearing(turf.point(last_point), turf.point(next_to_last));
        }
        return turf.bearingToAzimuth(bearing);
    }
    // borrowed from JAI
    function lt_get_first_point(segment) {
        return segment?.geometry.coordinates[0];
        //    return segment.geometry.components[0];
    }
    // borrowed from JAI
    function lt_get_last_point(segment) {
        return segment?.geometry.coordinates.at(-1);
        //    return segment.geometry.components[segment.geometry.components.length - 1];
    }
    // borrowed from JAI
    function lt_get_second_point(segment) {
        return segment?.geometry.coordinates[1];
        //    return segment.geometry.components[1];
    }
    // borrowed from JAI
    function lt_get_next_to_last_point(segment) {
        return segment?.geometry.coordinates.at(-2);
        //    return segment.geometry.components[segment.geometry.components.length - 2];
    }
    function delLanes(dir) {
        // const selObjs = W.selectionManager.getSelectedWMEFeatures();
        // const selSeg = selObjs[0]._wmeObject;
        // const turnGraph = W.model.getTurnGraph();
        // const mAction = new MultiAction();
        const selection = sdk.Editing.getSelection();
        const selSeg = isSegmentSelected(selection)
            ? sdk.DataModel.Segments.getById({ segmentId: selection?.ids[0] })
            : null;
        if (selSeg === null)
            return;
        // let node;
        // let conSegs;;
        // let turns: Turn[] | null = null;
        let laneDirection;
        //    mAction.setModel(W.model);
        if (dir === "fwd") {
            laneDirection = "A_TO_B";
            // updates.fwdLaneCount = 0;
            // node = getLegacyNodeObj(selSeg.attributes.toNodeID);
            // conSegs = node.getSegmentIds();
            // if(selSeg.toNodeId === null){
            //     lt_log("Segment has no toNodeId, cannot delete forward lanes", VERBOSITY.INFO);
            //     return;
            // }
            // turns = sdk.DataModel.Turns.getTurnsThroughNode({nodeId: selSeg.toNodeId});
            // const fwdLanes = $('.fwd-lanes');
            // fwdLanes.find('.form-control').val(0);
            // fwdLanes.find('.form-control').trigger("change");
        }
        if (dir === "rev") {
            laneDirection = "B_TO_A";
            // if(selSeg.fromNodeId === null){
            //     lt_log("Segment has no toNodeId, cannot delete forward lanes", VERBOSITY.INFO);
            //     return;
            // }
            // turns = sdk.DataModel.Turns.getTurnsThroughNode({nodeId: selSeg.fromNodeId});
            // updates.revLaneCount = 0;
            // node = getLegacyNodeObj(selSeg.attributes.fromNodeID);
            // conSegs = node.getSegmentIds();
            // const revLanes = $('.rev-lanes');
            // revLanes.find('.form-control').val(0);
            // revLanes.find('.form-control').trigger("change");
        }
        if (!laneDirection) {
            lt_log("Invalid lane direction for deleting lanes", VERBOSITY.INFO);
            return;
        }
        // mAction.doSubAction(W.model, new UpdateObj(selSeg, updates));
        sdk.DataModel.Turns.setSegmentTurnsLaneCount({
            laneCount: 0,
            laneDirection: laneDirection,
            segmentId: selSeg.id,
        });
        // for (const turn of turns) {
        //     turn.
        //     let turnStatus = turnGraph.getTurnThroughNode(node, selSeg, getLegacySegObj(conSegs[i]));
        //     let turnData = turnStatus.getTurnData();
        //     if (turnData.hasLanes()) {
        //         turnData = turnData.withLanes();
        //         turnStatus = turnStatus.withTurnData(turnData);
        //         mAction.doSubAction(W.model, new SetTurn(turnGraph, turnStatus));
        //     }
        // }
        // mAction._description = "Deleted lanes and turn associations";
        // W.model.actionManager.add(mAction);
    }
    function removeHighlights() {
        sdk.Map.removeAllFeaturesFromLayer({ layerName: LTHighlightLayer.name });
        sdk.Map.removeAllFeaturesFromLayer({ layerName: LTNamesLayer.name });
    }
    function removeLaneGraphics() {
        sdk.Map.removeAllFeaturesFromLayer({ layerName: LTLaneGraphics.name });
    }
    function applyName(geo, fwdLnsCount, revLnsCount) {
        // if (!fwdLnsCount) fwdLnsCount = 0;
        // if (!revLnsCount) revLnsCount = 0;
        const laneNum = `${fwdLnsCount} / ${revLnsCount}`;
        const lnLabel = turf.point(geo, { styleName: "nameStyle", layerName: LTNamesLayer.name, style: { laneNumLabel: laneNum } }, { id: `point_${geo.toString()}` });
        sdk.Map.addFeatureToLayer({ feature: lnLabel, layerName: LTNamesLayer.name });
    }
    function highlightSegment(objGeo, direction, applyDash, applyLabels, fwdLnsCount, revLnsCount, applyLioHighlight, csMode, isBad, heur, heurOverHighlight) {
        const VectorStyle = {
            DASH_THIN: 1,
            DASH_THICK: 2,
            HIGHLIGHT: 10,
            OVER_HIGHLIGHT: 20,
        };
        // fwdLnsCount = !fwdLnsCount ? 0 : fwdLnsCount;
        // revLnsCount = !revLnsCount ? 0 : revLnsCount;
        // const geo = objGeo.clone();
        const applyCSHighlight = LtSettings.CSEnable;
        // Need to rework this to account for segment length, cause of geo adjustment and such
        if (objGeo.length > 2) {
            const geoLength = objGeo.length;
            const geoMiddle = geoLength / 2;
            const fwdPoint = geoLength % 2 ? Math.ceil(geoMiddle) - 1 : Math.ceil(geoMiddle);
            const revPoint = geoLength % 2 ? Math.floor(geoMiddle) + 1 : Math.floor(geoMiddle);
            if (direction === Direction.FORWARD) {
                const newString = buildGeoComponentString(objGeo, fwdPoint, geoLength);
                if (applyDash) {
                    createVector(newString, LtSettings.ABColor, VectorStyle.DASH_THIN);
                } // draw dashed line
                drawHighlight(newString, applyLioHighlight, isBad, heur, heurOverHighlight); // draw highlight
            }
            else if (direction === Direction.REVERSE) {
                const newString = buildGeoComponentString(objGeo, 0, revPoint);
                if (applyDash) {
                    createVector(newString, LtSettings.BAColor, VectorStyle.DASH_THIN);
                }
                drawHighlight(newString, applyLioHighlight, isBad, heur, heurOverHighlight);
            }
            // Add the label only on the forward pass, or reverse if there are no forward lanes
            if (applyLabels && (direction === Direction.FORWARD || fwdLnsCount === 0)) {
                if (geoLength % 2) {
                    applyName(objGeo[fwdPoint], fwdLnsCount, revLnsCount);
                }
                else {
                    const p0 = objGeo[revPoint - 1];
                    const p1 = objGeo[fwdPoint];
                    const newPoint = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
                    //                let newPoint = new OpenLayers.getOLGeometry().Point((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
                    // let newPoint = new OpenLayers.Geometry.Point((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
                    // var newPoint = {
                    //     id: "pointNode_" + (p0[0] + p1[0]) / 2 + " " + (p0[1] + p1[1]) / 2,
                    //     geometry: {
                    //         coordinates: [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2],
                    //         type: "Point",
                    //     },
                    //     type: "Feature",
                    //     properties: { styleName: "styleNode", layerName: LTHighlightLayer.name },
                    // };
                    applyName(newPoint, fwdLnsCount, revLnsCount);
                }
            }
        }
        else {
            const p0 = objGeo[0];
            const p1 = objGeo[1];
            //        let point1 = new OpenLayers.getOLGeometry().Point((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
            // let point1 = new OpenLayers.Geometry.Point((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
            const p1C = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
            const pVector = [p1C];
            // var point1 = {
            //     id: "pointNode_" + (p0[0] + p1[0]) / 2 + " " + (p0[1] + p1[1]) / 2,
            //     geometry: {
            //         coordinates: p1C,
            //         type: "Point",
            //     },
            //     type: "Feature",
            //     properties: { styleName: "vectorStyle", layerName: LTHighlightLayer.name },
            // };
            if (direction === Direction.FORWARD) {
                const p2C = [objGeo[1][0], objGeo[1][1]];
                pVector.push(p2C);
                const newString = turf.lineString(pVector, { styleName: "vectorStyle", layerName: LTHighlightLayer.name }, { id: `line_${pVector.toString()}` });
                if (applyDash) {
                    createVector(newString, LtSettings.ABColor, VectorStyle.DASH_THIN);
                }
                drawHighlight(newString, applyLioHighlight, isBad, heur, heurOverHighlight);
            }
            else if (direction === Direction.REVERSE) {
                const p2C = [objGeo[0][0], objGeo[0][1]];
                pVector.push(p2C);
                const newString = turf.lineString(pVector, { styleName: "vectorStyle", layerName: LTHighlightLayer.name }, { id: `line_${pVector.toString()}` });
                if (applyDash) {
                    createVector(newString, LtSettings.BAColor, VectorStyle.DASH_THIN);
                }
                drawHighlight(newString, applyLioHighlight, isBad, heur, heurOverHighlight);
            }
            // Add the label only on the forward pass, or reverse if there are no forward lanes
            if (applyLabels && (direction === Direction.FORWARD || fwdLnsCount === 0)) {
                applyName(p1C, fwdLnsCount, revLnsCount);
            }
        }
        function buildGeoComponentString(geometry, from, to) {
            const components = [];
            let cIdx = 0;
            for (let i = from; i < to; i++) {
                components[cIdx++] = geometry[i];
            }
            return turf.lineString(components, { styleName: "vectorStyle", layerName: LTHighlightLayer.name }, { id: `line_${components.toString()}` });
        }
        function drawHighlight(newString, lio, bad, heurNom, heurOverHighlight = false) {
            if (bad) {
                createVector(newString, LtSettings.ErrorColor, VectorStyle.OVER_HIGHLIGHT);
                return;
            }
            if (lio) {
                createVector(newString, LtSettings.LIOColor, VectorStyle.HIGHLIGHT);
            }
            if (csMode === 1 && applyCSHighlight) {
                createVector(newString, LtSettings.CS1Color, VectorStyle.HIGHLIGHT);
            }
            if (csMode === 2 && applyCSHighlight) {
                createVector(newString, LtSettings.CS2Color, VectorStyle.HIGHLIGHT);
            }
            if (heurNom === HeuristicsCandidate.PASS) {
                createVector(newString, LtSettings.HeurColor, heurOverHighlight ? VectorStyle.OVER_HIGHLIGHT : VectorStyle.HIGHLIGHT);
            }
            else if (heurNom === HeuristicsCandidate.FAIL) {
                createVector(newString, LtSettings.HeurFailColor, heurOverHighlight ? VectorStyle.OVER_HIGHLIGHT : VectorStyle.HIGHLIGHT);
            }
        }
        function createVector(geoCom, lineColor, style) {
            // let newVector = new OpenLayers.Feature.Vector(geoCom, {}, {});
            // LTHighlightLayer.addFeatures([newVector]);
            const stroke = lineColor;
            let strokeOpacity = 1;
            let strokeWidth = 15;
            let strokeDashArray = [];
            switch (style) {
                case VectorStyle.DASH_THICK:
                    strokeWidth = 8;
                    strokeDashArray = [8, 10];
                    break;
                case VectorStyle.DASH_THIN:
                    strokeWidth = 4;
                    strokeDashArray = [10, 10];
                    break;
                case VectorStyle.HIGHLIGHT:
                    strokeWidth = 15;
                    strokeOpacity = 0.6;
                    break;
                case VectorStyle.OVER_HIGHLIGHT:
                    strokeWidth = 18;
                    strokeOpacity = 0.85;
                    break;
                default:
                    break;
            }
            geoCom.properties = geoCom.properties ? geoCom.properties : {};
            geoCom.properties.style = {
                strokeColor: stroke,
                stroke: stroke,
                strokeWidth: strokeWidth,
                strokeOpacity: strokeOpacity,
                strokeDashstyle: strokeDashArray.join(" "),
            };
            sdk.Map.addFeatureToLayer({ feature: geoCom, layerName: LTHighlightLayer.name });
        }
        // LTHighlightLayer.setZIndex(2880);
    }
    function highlightNode(objGeo, color, overSized = false) {
        // const geo = objGeo.clone();
        // const highlight = new OpenLayers.Feature.Vector(geo, {});
        if (!objGeo)
            return;
        const newString = {
            id: `Node_${objGeo.toString()}`,
            geometry: {
                type: "Point",
                coordinates: objGeo,
            },
            type: "Feature",
            properties: {
                styleName: "nodeStyle",
                layerName: LTHighlightLayer.name,
                style: {
                    fillColor: color,
                    pointRadius: overSized ? 18 : 10,
                },
            },
        };
        // let nodeStyle = {
        //     fillColor: color,
        //     pointRadius: overSized ? 18 : 10,
        //     fillOpacity: 0.9,
        //     strokeWidth: 0,
        // };
        // Object.assign(styleRules.nodeHighlightStyle.style, nodeStyle);
        // LTHighlightLayer.addFeatures([highlight]);
        sdk.Map.addFeatureToLayer({ feature: newString, layerName: LTHighlightLayer.name });
        // const node = document.getElementById(geo.id);
        // if (node) {
        //     node.setAttribute("fill", color);
        //     node.setAttribute("r", overSized ? "18" : "10");
        //     node.setAttribute("fill-opacity", "0.9");
        //     node.setAttribute("stroke-width", "0");
        // }
    }
    const lt_scanArea_timer = {
        timeoutID: -1,
        start: function () {
            this.cancel();
            this.timeoutID = window.setTimeout(() => {
                this.calculate();
            }, 500);
        },
        calculate: function () {
            scanArea_real();
            this.timeoutID = -1;
        },
        cancel: function () {
            if (typeof this.timeoutID === "number") {
                window.clearTimeout(this.timeoutID);
                this.timeoutID = -1;
                lt_scanArea_recursive = 0;
            }
        },
    };
    function scanArea() {
        // Use a delay timer to ensure the DOM is settled
        lt_scanArea_recursive = 3;
        scanArea_real();
    }
    function scanArea_real() {
        const isEnabled = LtSettings.ScriptEnabled;
        const mapHighlights = LtSettings.HighlightsEnable;
        const heurChecks = LtSettings.LaneHeuristicsChecks;
        // const zoomLevel = W.map.getZoom() != null ? W.map.getZoom() : 16;
        const zoomLevel = sdk.Map.getZoomLevel();
        const highOverride = LtSettings.highlightOverride;
        const layerCheck = W.layerSwitcherController.getTogglerState("ITEM_ROAD") ||
            W.layerSwitcherController.getTogglerState("ITEM_ROAD_V2"); //jm6087
        removeHighlights();
        // console.log(zoomLevel);
        if (zoomLevel < MIN_DISPLAY_LEVEL) {
            return;
        }
        // If segment layer is checked (true) or (segment layer is not checked (false) and highlight override is set to show only when segment layer on - not checked (false)
        if (layerCheck || (!layerCheck && !highOverride)) {
            //jm6087
            if (isEnabled && (mapHighlights || heurChecks)) {
                scanSegments(sdk.DataModel.Segments.getAll(), false);
            }
            if (isEnabled && heurChecks) {
                // const selFeat = W.selectionManager.getSelectedWMEFeatures();
                const selectedFeat = sdk.Editing.getSelection();
                if (selectedFeat?.objectType === "segment")
                    scanHeuristicsCandidates(selectedFeat);
            }
        } //jm6087
    }
    // Given two features, checks if they are segments, and their path qualifies for heuristics; then highlight
    function scanHeuristicsCandidates(selection) {
        const segs = [];
        let count = 0;
        for (let idx = 0; selection && idx < selection.ids.length; ++idx) {
            if (typeof selection.ids[idx] === "string") {
                lt_log(`Segment ID: ${selection.ids[idx]} reported as Segment ID incorrectly`, VERBOSITY.DEBUG);
            }
            const seg = sdk.DataModel.Segments.getById({ segmentId: selection.ids[idx] });
            if (!seg)
                continue;
            count = segs.push(seg);
        }
        // _.each(features, (f) => {
        //     if (f && f._wmeObject && f._wmeObject.type === "segment") {
        //         count = segs.push(f._wmeObject);
        //     }
        // });
        scanSegments(segs, true);
        return count;
    }
    // Check all given segments for heuristics qualification
    function scanSegments(segments, selectedSegsOverride = false) {
        const heurChecks = LtSettings.LaneHeuristicsChecks ?? false;
        const heurScan_PosHighlight = heurChecks && (LtSettings.LaneHeurPosHighlight ?? false);
        const heurScan_NegHighlight = heurChecks && (LtSettings.LaneHeurNegHighlight ?? false);
        const mapHighlights = LtSettings.HighlightsEnable ?? false;
        const applyLioHighlight = mapHighlights && (LtSettings.LIOEnable ?? false);
        const applyLabels = mapHighlights && (LtSettings.LabelsEnable ?? false);
        const zoomLevel = sdk.Map.getZoomLevel();
        // const turnGraph = W.model.getTurnGraph();
        // console.log(zoomLevel);
        _.each(segments, (s) => {
            if (onScreen(s, zoomLevel)) {
                // const sAtts = s.getAttributes();
                const tryRedo = false;
                const segLength = s.length; //lt_segment_length(s);
                // FORWARD
                tryRedo || scanSegment_Inner(s, Direction.FORWARD, segLength, tryRedo);
                // If errors encountered, scan again. (Usually this is an issue with first loading of DOM after zoom or long pan)
                if (tryRedo && lt_scanArea_recursive > 0) {
                    lt_log("LT errors found, scanning again", VERBOSITY.TRACE);
                    removeHighlights();
                    lt_scanArea_recursive--;
                    lt_scanArea_timer.start();
                    return;
                }
                tryRedo || scanSegment_Inner(s, Direction.REVERSE, segLength, tryRedo);
                // If errors encountered, scan again. (Usually this is an issue with first loading of DOM after zoom or long pan)
                if (tryRedo && lt_scanArea_recursive > 0) {
                    lt_log("LT errors found, scanning again", VERBOSITY.TRACE);
                    removeHighlights();
                    lt_scanArea_recursive--;
                    lt_scanArea_timer.start();
                }
            }
        });
        function scanSegment_Inner(seg, direction, segLength, tryRedo) {
            const fwdLaneCount = seg.fromNodeLanesCount;
            const revLaneCount = seg.toNodeLanesCount;
            if (fwdLaneCount + revLaneCount === 0)
                return;
            let node = getNodeObj(seg.toNodeId);
            let oppNode = getNodeObj(seg.fromNodeId);
            let laneCount = fwdLaneCount;
            let oppLaneCount = revLaneCount;
            if (direction !== Direction.FORWARD) {
                node = getNodeObj(seg.fromNodeId);
                oppNode = getNodeObj(seg.toNodeId);
                laneCount = revLaneCount;
                oppLaneCount = fwdLaneCount;
            }
            let tlns = false;
            let tio = false;
            let badLn = false;
            let lio = false;
            let csMode = 0;
            let heurCand = HeuristicsCandidate.NONE;
            let entrySeg = null;
            const entrySegRef = {
                seg: 0,
                direction: Direction.ANY,
            };
            // CHECK LANES & HEURISTICS
            if (node !== null && onScreen(node, zoomLevel)) {
                const nodeSegs = node.connectedSegmentIds;
                if (laneCount && laneCount > 0) {
                    const config = checkLanesConfiguration(seg, node, nodeSegs, laneCount);
                    tlns = config.tlns;
                    tio = config.tio;
                    lio = config.lio;
                    badLn = config.badLn;
                    csMode = config.csMode;
                    tryRedo = badLn || tryRedo;
                }
                // 1/1/21: Only check for heuristics on segments <50m. IMPORTANT because now we're checking segments regardless of lanes
                if (heurChecks && segLength <= MAX_LEN_HEUR) {
                    // Check Heuristics regardless of heurChecks, because we want to report Errors even if Heur highlights are off
                    heurCand = isHeuristicsCandidate(seg, node, nodeSegs, oppNode, laneCount, segLength, entrySegRef);
                    if (heurCand === HeuristicsCandidate.ERROR) {
                        // fwdHeurCand = HeuristicsCandidate.NONE;
                        badLn = true;
                    }
                    if (!heurChecks) {
                        heurCand = HeuristicsCandidate.NONE;
                    }
                    else if (heurCand !== HeuristicsCandidate.NONE) {
                        entrySeg = { ...entrySegRef };
                    }
                }
            }
            // HIGHLIGHTS
            if (!selectedSegsOverride) {
                // Full scan highlights
                let heur = HeuristicsCandidate.NONE;
                if ((heurScan_PosHighlight && heurCand === HeuristicsCandidate.PASS) ||
                    (heurScan_NegHighlight && heurCand === HeuristicsCandidate.FAIL)) {
                    heur = heurCand;
                }
                if (laneCount && (laneCount > 0 || heur !== null || badLn)) {
                    highlightSegment(seg.geometry.coordinates, direction, mapHighlights, applyLabels, fwdLaneCount, revLaneCount, lio && applyLioHighlight, csMode, badLn, heur, false);
                }
                // Nodes highlights
                if (mapHighlights && LtSettings.NodesEnable) {
                    if (tlns) {
                        highlightNode(node?.geometry.coordinates, LtSettings.NodeColor);
                        //                    highlightNode(node.geometry, `${LtSettings.NodeColor}`);
                    }
                    if (tio) {
                        highlightNode(node?.geometry.coordinates, LtSettings.TIOColor);
                        //                    highlightNode(node.geometry, `${LtSettings.TIOColor}`);
                    }
                }
            }
            else {
                // Selected segment highlights
                lt_log(`candidate(f):${heurCand}`);
                if (heurCand !== HeuristicsCandidate.NONE) {
                    if (entrySeg && segments.findIndex((element) => element.id === entrySeg.seg) > -1) {
                        const nodeColor = heurCand === HeuristicsCandidate.PASS ? LtSettings.NodeColor : LtSettings.HeurFailColor;
                        highlightSegment(seg.geometry.coordinates, direction, false, false, 0, 0, false, csMode, badLn, heurCand, true);
                        const eSeg = sdk.DataModel.Segments.getById({ segmentId: entrySeg.seg });
                        if (eSeg) {
                            highlightSegment(eSeg?.geometry.coordinates, entrySeg.direction, false, false, 0, 0, false, 0, false, heurCand, true);
                        }
                        highlightNode(node?.geometry.coordinates, nodeColor, true);
                        highlightNode(oppNode?.geometry.coordinates, nodeColor, true);
                    }
                }
            }
            return tryRedo;
        }
    }
    function checkLanesConfiguration(s, node, segs, numLanes) {
        const laneConfig = {
            tlns: false,
            tio: false,
            badLn: false,
            lio: false,
            csMode: 0,
            csStreet: null,
        };
        const turnLanes = [];
        // const turnGraph = W.model.getTurnGraph();
        // const pturns = turnGraph.getAllPathTurns();
        const fromTurns = sdk.DataModel.Turns.getTurnsFromSegment({ segmentId: s.id });
        const toTurns = sdk.DataModel.Turns.getTurnsToSegment({ segmentId: s.id });
        const pturns = fromTurns.filter((t) => t.isPathTurn);
        pturns.push(...toTurns.filter((t) => t.isPathTurn));
        const jpturns = fromTurns.filter((t) => t.isJunctionBoxTurn);
        jpturns.push(...toTurns.filter((t) => t.isJunctionBoxTurn));
        const zoomLevel = sdk.Map.getZoomLevel();
        function addTurns(fromLns, toLns) {
            if (toLns === undefined || fromLns === undefined)
                return;
            for (let k = fromLns; k < toLns + 1; k++) {
                let newValue = true;
                for (let j = 0; j < turnLanes.length; j++) {
                    if (turnLanes[j] === k) {
                        newValue = false;
                    }
                }
                if (newValue) {
                    turnLanes.push(k);
                }
            }
        }
        for (let i = 0; i < segs.length; i++) {
            if (segs[i] === s.id)
                continue;
            const seg2 = getSegObj(segs[i]);
            const turnsThrough = !node ? [] : sdk.DataModel.Turns.getTurnsThroughNode({ nodeId: node?.id });
            for (let idx = 0; idx < turnsThrough.length; ++idx) {
                const t = turnsThrough[idx];
                if (t.isUTurn || (t.fromSegmentId !== s.id && t.toSegmentId !== segs[i]))
                    continue;
                // const turnData = turnGraph.getTurnThroughNode(node, s, seg2).getTurnData();
                if (t.isAllowed) {
                    // Check for turn instruction override
                    if (t.instructionOpCode !== null) {
                        laneConfig.tio = true;
                    }
                    // Check for lanes
                    if (t.lanes !== null) {
                        laneConfig.tlns = true;
                        // Check for lane angle override
                        if (t.lanes.angleOverride !== null) {
                            laneConfig.lio = true;
                        }
                        // Check for Continue Straight override
                        // 1 is for view only, 2 is for view and hear
                        const primaryStreetId = seg2?.primaryStreetId;
                        if (primaryStreetId && primaryStreetId !== null && s.primaryStreetId === primaryStreetId) {
                            if (t.lanes.guidanceMode === "display") {
                                laneConfig.csMode = 1;
                                laneConfig.csStreet = sdk.DataModel.Streets.getById({
                                    streetId: primaryStreetId,
                                })?.name;
                            }
                            else if (t.lanes.guidanceMode === "display-and-voice") {
                                laneConfig.csMode = 2;
                                laneConfig.csStreet = sdk.DataModel.Streets.getById({
                                    streetId: primaryStreetId,
                                })?.name;
                            }
                        }
                        const fromLns = t.lanes.fromLaneIndex;
                        const toLns = t.lanes.toLaneIndex;
                        addTurns(fromLns, toLns);
                    }
                }
            }
        }
        // check paths
        for (let i = 0; i < pturns.length; i++) {
            if (pturns[i].lanes !== null) {
                const fromLns = pturns[i].lanes?.fromLaneIndex;
                const toLns = pturns[i].lanes?.toLaneIndex;
                addTurns(fromLns, toLns);
            }
        }
        // check turns in JBs
        // const jb = W.model.bigJunctions.getObjectArray();
        for (let t = 0; t < jpturns.length; t++) {
            const tdat = jpturns[t].lanes;
            if (tdat) {
                addTurns(tdat.fromLaneIndex, tdat.toLaneIndex);
            }
        }
        turnLanes.sort();
        for (let z = 0; z < turnLanes.length; z++) {
            if (turnLanes[z] !== z) {
                laneConfig.badLn = true;
            }
        }
        if (numLanes && turnLanes.length < numLanes && onScreen(node, zoomLevel)) {
            laneConfig.badLn = true;
        }
        return laneConfig;
    }
    function setTurns(direction) {
        const clickSaveEnabled = LtSettings.ClickSaveEnable;
        if (!clickSaveEnabled) {
            return;
        }
        const lanesPane = document.getElementsByClassName(direction)[0];
        if (!lanesPane)
            return;
        const left = lanesPane.getElementsByClassName("angle--135").length > 0
            ? "angle--135"
            : lanesPane.getElementsByClassName("angle--90").length > 0
                ? "angle--90"
                : "angle--45";
        const right = lanesPane.getElementsByClassName("angle-135").length > 0
            ? "angle-135"
            : lanesPane.getElementsByClassName("angle-90").length > 0
                ? "angle-90"
                : "angle-45";
        const turnSections = lanesPane.getElementsByClassName("turn-lane-edit-container");
        let setLeft = false;
        let setRight = false;
        const alreadySet = [].slice
            .call(turnSections)
            .reduce((acc, turn) => acc +
            [].slice
                .call(turn.getElementsByTagName("input"))
                .reduce((acc, input) => (input.checked === true ? acc + 1 : acc), 0), 0);
        if (alreadySet === 0) {
            for (let i = 0; i < turnSections.length; i++) {
                const turnSection = turnSections[i];
                // Check if the lanes are already set. If already set, don't change anything.
                const laneCheckboxes = turnSection.getElementsByTagName("wz-checkbox");
                if (laneCheckboxes && laneCheckboxes.length > 0) {
                    if (LtSettings.ClickSaveTurns) {
                        if (turnSection.getElementsByClassName(left).length > 0 &&
                            laneCheckboxes[0].checked !== undefined &&
                            laneCheckboxes[0].checked === false) {
                            setLeft = true;
                            laneCheckboxes[0].click();
                        }
                        else if (turnSection.getElementsByClassName(right).length > 0 &&
                            laneCheckboxes[laneCheckboxes.length - 1].checked !== undefined &&
                            laneCheckboxes[laneCheckboxes.length - 1].checked === false) {
                            setRight = true;
                            laneCheckboxes[laneCheckboxes.length - 1].click();
                        }
                    }
                }
            }
            for (let i = 0; i < turnSections.length; i++) {
                const turnSection = turnSections[i];
                const laneCheckboxes = turnSection.getElementsByTagName("wz-checkbox");
                if (setRight) {
                    // Clear All Lanes Except the Right most for right turn
                    if (turnSection.getElementsByClassName(right).length > 0) {
                        for (let j = 0; j < laneCheckboxes.length - 1; ++j) {
                            waitForElementLoaded("input[type='checkbox']", laneCheckboxes[j].shadowRoot);
                            if (laneCheckboxes[j].checked)
                                laneCheckboxes[j].click();
                        }
                    }
                }
                if (setLeft) {
                    // Clear all Lanes except left most for left turn
                    if (turnSection.getElementsByClassName(left).length > 0) {
                        for (let j = 1; j < laneCheckboxes.length; ++j) {
                            waitForElementLoaded("input[type='checkbox']", laneCheckboxes[j].shadowRoot);
                            if (laneCheckboxes[j].checked)
                                laneCheckboxes[j].click();
                        }
                    }
                }
                if (turnSection.getElementsByClassName("angle-0").length > 0) {
                    // Set all lanes for straight turns
                    for (let j = 0; j < laneCheckboxes.length; j++) {
                        waitForElementLoaded("input[type='checkbox']", laneCheckboxes[j].shadowRoot);
                        if (laneCheckboxes[j].checked === false) {
                            if (j === 0 && (LtSettings.ClickSaveStraight || setLeft === false)) {
                                laneCheckboxes[j].click();
                            }
                            else if (j === laneCheckboxes.length - 1 &&
                                (LtSettings.ClickSaveStraight || setRight === false)) {
                                laneCheckboxes[j].click();
                            }
                            else if (j !== 0 && j !== laneCheckboxes.length - 1) {
                                laneCheckboxes[j].click();
                            }
                        }
                    }
                }
            }
        }
    }
    function waitForElementLoaded(selector, root = undefined) {
        return new Promise((resolve) => {
            if (!root) {
                if (document.querySelector(selector)) {
                    return resolve(document.querySelector(selector));
                }
                const observer = new MutationObserver((mutations) => {
                    if (document.querySelector(selector)) {
                        observer.disconnect();
                        resolve(document.querySelector(selector));
                    }
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                });
            }
            else {
                if (root.querySelector(selector)) {
                    return resolve(root.querySelector(selector));
                }
                const observer = new MutationObserver((mutations) => {
                    if (root.querySelector(selector)) {
                        observer.disconnect();
                        resolve(root.querySelector(selector));
                    }
                });
                observer.observe(root, {
                    childList: true,
                    subtree: true,
                });
            }
        });
    }
    function processLaneNumberChange() {
        const parent = $(this).parents().eq(8);
        const elem = parent[0];
        const className = elem.className;
        const numLanes = Number.parseInt($(this).val(), 10);
        waitForElementLoaded(".turn-lane-checkbox").then((elem) => {
            setTurns(className, numLanes);
        });
        const laneCountNums = $(this).parents().find(".lt-add-lanes");
        if (laneCountNums.length > 0) {
            const counterClassName = laneCountNums[0].className;
            const selectorClassName = `.${counterClassName.replace(" ", ".")}`;
            const counterClassToSelectName = `#${counterClassName.replace(" ", "-")}-${numLanes.toString()}`;
            $(selectorClassName).css({ "background-color": "transparent", color: "black" });
            $(counterClassToSelectName).css({ "background-color": "navy", color: "white" });
        }
    }
    function initLaneGuidanceClickSaver() {
        const laneObserver = new MutationObserver((mutations) => {
            // if (
            //     W.selectionManager.getSelectedWMEFeatures()[0] &&
            //     W.selectionManager.getSelectedWMEFeatures()[0].featureType === "segment" &&
            //     getId("lt-ScriptEnabled").checked
            // )
            const selection = sdk.Editing.getSelection();
            if (selection?.objectType === "segment" && LtSettings.ScriptEnabled) {
                const laneCountElement = document.getElementsByName("laneCount");
                for (let idx = 0; idx < laneCountElement.length; idx++) {
                    laneCountElement[idx].addEventListener("keyup", processLaneNumberChange, false);
                    laneCountElement[idx].addEventListener("change", processLaneNumberChange, false);
                }
            }
        });
        laneObserver.observe(document.getElementById("edit-panel"), {
            childList: true,
            subtree: true,
        });
        // console.log('LaneTools: Click Saver Module loaded');
    }
    function isHeuristicsCandidate(segCandidate, curNodeExit, nodeExitSegIds, curNodeEntry, laneCount, segLength, inSegRef) {
        // CRITERIA FOR HEURISTICS, as described on the wiki: https://wazeopedia.waze.com/wiki/USA/User:Nzahn1/Lanes#Mapping_lanes_on_divided_roadways
        // 1. Both left and right turns are possible at the intersection;
        // 2. The two portions of the divided roadway are essentially parallel to each other;
        // 3. The two intersecting roads are more or less perpendicular to each other;
        // 4. The median segment in question is 50 m or shorter; and
        // 5. The number of lanes entering the intersection is equal to the total number of lanes exiting the intersection
        //      (total number of lanes exiting intersection = number of lanes on the median segment +
        //         number of right-turn only lanes on the entry segment --  other words, no new lanes are added in the median).
        // MY OBSERVATIONS
        // 11. We must have an incoming segment supplemenatary to outgoing segment 1.  (alt-incoming)
        // 12. That alt-incoming segment must be within perpendicular tolerance to BOTH the median segment and the incoming segment.
        if (nodeExitSegIds == null || curNodeEntry == null || laneCount == null || inSegRef == null) {
            lt_log("isHeuristicsCandidate received bad argument (null)", VERBOSITY.DEBUG);
            return HeuristicsCandidate.NONE;
        }
        let outSeg2 = null;
        let outTurnAngle2 = null;
        let outSeg2IsHeurFail = 0;
        let inSeg = null;
        let inAzm = null;
        let inTurnAngle = null;
        let inSegIsHeurFail = 0;
        let altIncomingSeg = null;
        let altInAzm = null;
        let altInIsHeurFail = 0;
        let inNumLanesThrough = 0;
        // #4 first: Check the length (and get outta' here if not)
        //  1/1/21: This is now redundant with outer loop. But leaving it in just in case...
        if (segLength > MAX_LEN_HEUR) {
            return HeuristicsCandidate.NONE;
        }
        // Get current segment heading at the node
        const segId = segCandidate.id;
        const segEndAzm = lt_getBearing(curNodeExit.id, segCandidate, true);
        const segBeginAzm = lt_getBearing(curNodeEntry.id, segCandidate);
        let out1TargetAngle = -90.0; // For right-hand side of the road countries  (right-turn)
        let out2TargetAngle = 90.0; // (left-turn)
        const segAddress = sdk.DataModel.Segments.getAddress({ segmentId: segCandidate.id });
        if (segAddress.street === null) {
            lt_log(`Unable to process Heuristics on Segment: ${segCandidate.id} as it has no Primary Street Set`, VERBOSITY.DEBUG);
            return HeuristicsCandidate.NONE;
        }
        if (segAddress.country?.isLeftHandTraffic) {
            out1TargetAngle = 90.0; // left turn
            out2TargetAngle = -90.0; // right turn
        }
        lt_log("==================================================================================", VERBOSITY.TRACE);
        lt_log(`Checking heuristics candidate: seg ${segId} node ${curNodeExit.id} azm ${segEndAzm} nodeExitSegIds:${nodeExitSegIds.length}`, VERBOSITY.TRACE);
        // Find the incoming segment, and validate angle to cursegment
        const nodeEntrySegIds = curNodeEntry.connectedSegmentIds;
        for (let ii = 0; ii < nodeEntrySegIds.length; ii++) {
            let thisTimeFail = 0;
            if (nodeEntrySegIds[ii] === segId) {
                continue;
            } // ignore same segment as our original
            const is = getSegObj(nodeEntrySegIds[ii]);
            // Check turn from this seg to candidate seg
            if (is !== null && !lt_is_turn_allowed(is, curNodeEntry, segCandidate)) {
                continue;
            }
            const ia = lt_getBearing(curNodeEntry.id, is, true); // absolute math azimuth
            // const ita: number | null = lt_turn_angle(ia, segBeginAzm); // turn angle
            const ita = lt_turn_angle_seg_to_seg(is, curNodeEntry, segCandidate);
            lt_log(`Turn angle from inseg ${nodeEntrySegIds[ii]}: ${ita}(${ia},${segBeginAzm})`, VERBOSITY.VERBOSE);
            if (ita !== null && Math.abs(ita) > MAX_STRAIGHT_DIF) {
                // tolerance met?
                if (Math.abs(ita) > MAX_STRAIGHT_TO_CONSIDER) {
                    continue;
                }
                lt_log(`   Not eligible as inseg: ${ita}`, VERBOSITY.TRACE);
                thisTimeFail = HeuristicsCandidate.FAIL;
            }
            // const turnsThrough = turnGraph.getTurnThroughNode(curNodeEntry, is, segCandidate);
            // const turnData = turnsThrough.getTurnData();
            // const turnsThrough = sdk.DataModel.Turns.getTurnsThroughNode({ nodeId: curNodeEntry.id });
            // let turnData = turnsThrough[tidx];
            function getMatchingTurn(node, from, to) {
                const turns = sdk.DataModel.Turns.getTurnsThroughNode({ nodeId: node.id });
                if (from !== null) {
                    for (let idx = 0; idx < turns.length; ++idx) {
                        if (turns[idx].fromSegmentId === from.id && turns[idx].toSegmentId === to.id)
                            return turns[idx];
                    }
                }
                return null;
            }
            const turnData = getMatchingTurn(curNodeEntry, is, segCandidate);
            if (turnData === null || !turnData.lanes) {
                lt_log(`Straight turn has no lanes:${nodeEntrySegIds[ii]} to ${segId}`, VERBOSITY.VERBOSE);
                continue; // No lanes? Don't even think about it. (Not a candidate)
            }
            // #5 Ensure this (straight) turn motion has lanes, and lane count matches; otherwise ERROR
            //  1/1/21: One exception. If laneCount is 0, and there is exactly 1 straight incoming lane, then treat it as equal. (Conversation with @jm6087)
            const nl = turnData.lanes.toLaneIndex - turnData.lanes.fromLaneIndex + 1;
            if (nl !== laneCount && !(laneCount === 0 && nl === 1)) {
                lt_log("Straight turn lane count does not match", VERBOSITY.TRACE);
                thisTimeFail = HeuristicsCandidate.ERROR; // Failed lane match should give us an ERROR
            }
            // Only one segment allowed  // TBD ???    For now, don't allow more than one.
            if (inSeg !== null && thisTimeFail >= inSegIsHeurFail) {
                if (inSegIsHeurFail === 0 && thisTimeFail === 0) {
                    lt_log(`Error: >1 qualifying entry segment for ${segCandidate.id}: ${inSeg.id},${is?.id}`, VERBOSITY.TRACE);
                    lt_log("==================================================================================", VERBOSITY.TRACE);
                    return 0; // just stop here
                }
            }
            inSeg = is;
            inAzm = ia;
            inTurnAngle = ita;
            inNumLanesThrough = nl;
            inSegIsHeurFail = thisTimeFail;
            if (!inSegRef) {
                const newSegRef = {
                    seg: 0,
                    direction: Direction.ANY,
                };
                inSegRef = newSegRef;
            }
            if (inSeg)
                inSegRef.seg = inSeg.id;
            inSegRef.direction = inSeg?.toNodeId === curNodeEntry.id ? Direction.FORWARD : Direction.REVERSE;
        }
        if (inSeg === null) {
            lt_log("== No inseg found ==================================================================", VERBOSITY.TRACE);
            return 0; // otherwise wait for later
        }
        lt_log(`Found inseg candidate: ${inSeg.id} ${inSegIsHeurFail === 0 ? "" : "(failed)"}`, VERBOSITY.TRACE);
        // #3(a) Determine the outgoing segment 2 (the 2nd turn) and validate turn angle
        for (let ii = 0; ii < nodeExitSegIds.length; ii++) {
            let thisTimeFail = 0;
            if (nodeExitSegIds[ii] === segId) {
                continue;
            } // ignore same segment as our original
            const os = getSegObj(nodeExitSegIds[ii]);
            // Check turn from candidate seg to this seg
            if (!lt_is_turn_allowed(segCandidate, curNodeExit, os)) {
                continue;
            }
            const oa = lt_getBearing(curNodeExit.id, os); // absolute math azimuth
            const ota = lt_turn_angle_seg_to_seg(segCandidate, curNodeExit, os); // turn angle
            lt_log(`Turn angle to outseg2 ${nodeExitSegIds[ii]}: ${ota}(${segEndAzm},${oa})`, VERBOSITY.TRACE);
            // Just to be sure, we can't do Heuristics if there's a chance to turn right (RH)
            if (ota !== null && Math.abs(out1TargetAngle - ota) < MAX_PERP_TO_CONSIDER) {
                // tolerance met?
                return HeuristicsCandidate.NONE;
            }
            // Ok now check our turn angle
            if (ota !== null && Math.abs(out2TargetAngle - ota) > MAX_PERP_DIF) {
                // tolerance met?
                if (Math.abs(out2TargetAngle - ota) > MAX_PERP_TO_CONSIDER) {
                    continue;
                } // too far out of tolerance to care (don't consider it a candidate at all)
                lt_log(`   Not eligible as outseg2: ${ota}`, 2);
                thisTimeFail = HeuristicsCandidate.FAIL;
            }
            // Only one segment allowed  // TBD ???    For now, don't allow more than one.
            if (outSeg2 !== null && thisTimeFail >= outSeg2IsHeurFail) {
                if (outSeg2IsHeurFail === 0 && thisTimeFail === 0) {
                    lt_log(`Error: >1 qualifying exit2 segment for ${segCandidate.id}: ${outSeg2.id},${os?.id}`, VERBOSITY.TRACE);
                    lt_log("==================================================================================", VERBOSITY.TRACE);
                    return 0; // just stop here
                }
            }
            outSeg2 = os;
            outTurnAngle2 = ota;
            outSeg2IsHeurFail = thisTimeFail;
        }
        if (outSeg2 === null) {
            lt_log("== No Outseg2 found ==================================================================", VERBOSITY.TRACE);
            return 0;
        }
        lt_log(`Found outseg2 candidate: ${outSeg2.id} ${outSeg2IsHeurFail === 0 ? "" : "(failed)"}`, VERBOSITY.TRACE);
        // #11 & 12: The Segment 1 that matters is the incoming (parallel to outgoing seg2)
        for (let ii = 0; ii < nodeEntrySegIds.length; ii++) {
            if (nodeEntrySegIds[ii] === segId || nodeEntrySegIds[ii] === inSeg.id) {
                // ignore same segment as our original
                continue;
            }
            const ai1 = getSegObj(nodeEntrySegIds[ii]);
            let thisTimeFail = 0;
            // Ensure the segment is one-way TOWARD the node (incoming direction)
            const sourceSegment = (ai1?.isBtoA && ai1.fromNodeId === curNodeEntry.id) ||
                (ai1?.isAtoB && ai1.toNodeId === curNodeEntry.id);
            if ((ai1?.isAtoB && ai1.toNodeId !== curNodeEntry.id) ||
                (ai1?.isBtoA && ai1.fromNodeId !== curNodeEntry.id)) {
                continue;
            }
            // Check turn from this seg to our segment
            const ia = lt_getBearing(curNodeEntry.id, ai1, true); // absolute math azimuth
            // 12. Check angle from inseg to this seg (se)
            //  Since we already have azm of this seg TOWARD the node, just check the supplementary turn angle. Must also be within tolerance. (See Geometry proof :)
            // const tta: number | null = lt_turn_angle(inAzm, ia);
            let tta;
            if (sourceSegment) {
                tta = lt_turn_angle_seg_to_seg(ai1, curNodeEntry, inSeg);
            }
            else
                tta = lt_turn_angle_seg_to_seg(inSeg, curNodeEntry, ai1);
            lt_log(`Turn angle from inseg (supplementary) ${nodeEntrySegIds[ii]}: ${tta}(${inAzm},${ia})`, VERBOSITY.VERBOSE);
            if (tta !== null && Math.abs(out1TargetAngle - tta) > MAX_PERP_DIF_ALT) {
                // tolerance met?
                if (Math.abs(out1TargetAngle - tta) > MAX_PERP_TO_CONSIDER) {
                    // too far out of tolerance to care (don't consider it a candidate at all)
                    continue;
                }
                lt_log(`   Not eligible as altIn1: ${tta}`, VERBOSITY.VERBOSE);
                thisTimeFail = HeuristicsCandidate.FAIL;
            }
            // Only one segment allowed  // TBD ???    For now, don't allow more than one.
            if (altIncomingSeg !== null) {
                // If the new candidate is worse than what we already have, just move on
                if (thisTimeFail < altInIsHeurFail) {
                    continue;
                }
                // If they both are good, then error
                if (altInIsHeurFail === 0 && thisTimeFail === 0) {
                    lt_log(`Error: >1 qualifying segment for ${segCandidate.id}: ${altIncomingSeg.id},${ai1?.id}`, VERBOSITY.TRACE);
                    lt_log("==================================================================================", VERBOSITY.TRACE);
                    return HeuristicsCandidate.FAIL;
                }
            } // If the new candidate is better than the old, then assign our candidate to the new one (below)
            altIncomingSeg = ai1;
            altInAzm = ia;
            altInIsHeurFail = thisTimeFail;
        }
        if (altIncomingSeg === null) {
            lt_log("== No alt incoming-1 segment found ==================================================================", VERBOSITY.TRACE);
            return 0;
        }
        lt_log(`Alt incoming-1 segment found: ${altIncomingSeg.id} ${altInIsHeurFail === 0 ? "" : "(failed)"}`, VERBOSITY.TRACE);
        // Have we found a failure candidate?
        if (inSegIsHeurFail < 0 || altInIsHeurFail < 0 || outSeg2IsHeurFail < 0) {
            lt_log(`Found a failed candidate for ${segId} ( ${Math.min(inSegIsHeurFail, altInIsHeurFail, outSeg2IsHeurFail)})`, VERBOSITY.TRACE);
            // NOTE: IF any seg is a FAIL, then return FAIL (not Error)
            if (inSegIsHeurFail === HeuristicsCandidate.FAIL ||
                altInIsHeurFail === HeuristicsCandidate.FAIL ||
                outSeg2IsHeurFail === HeuristicsCandidate.FAIL) {
                return HeuristicsCandidate.FAIL;
            }
            return HeuristicsCandidate.ERROR;
        }
        // We have a winner!!!
        lt_log(`Found a heuristics candidate! ${segId} to ${outSeg2.id} at ${outTurnAngle2}`, VERBOSITY.TRACE);
        return 1;
        ////////////////////////////////////////////// end of func /////////////////////////////////////////////////////////
        // get the absolute angle for a segment at an end point - borrowed from JAI
        function lt_getBearing(nodeId, segment, toNode = false) {
            if (nodeId === null || segment === null) {
                return null;
            }
            // let ja_dx: number;
            // let ja_dy: number;
            let startPos, endPos;
            if (segment.fromNodeId === nodeId) {
                const secondPoint = lt_get_second_point(segment);
                const firstPoint = lt_get_first_point(segment);
                if (!secondPoint || !firstPoint) {
                    throw new Error("Missing Start and end Point of the Segment");
                }
                // ja_dx = secondPoint[0] - firstPoint[0];
                // ja_dy = secondPoint[1] - firstPoint[1];
                if (toNode) {
                    startPos = secondPoint;
                    endPos = firstPoint;
                }
                else {
                    startPos = firstPoint;
                    endPos = secondPoint;
                }
            }
            else {
                const nextToLastPoint = lt_get_next_to_last_point(segment);
                const lastPoint = lt_get_last_point(segment);
                if (!nextToLastPoint || !lastPoint) {
                    throw new Error("Missing Points at the End of the Segment");
                }
                // ja_dx = nextToLastPoint[0] - lastPoint[0];
                // ja_dy = nextToLastPoint[1] - lastPoint[1];
                if (toNode) {
                    endPos = lastPoint;
                    startPos = nextToLastPoint;
                }
                else {
                    startPos = lastPoint;
                    endPos = nextToLastPoint;
                }
            }
            // const angle_rad = Math.atan2(ja_dy, ja_dx);
            // const angle_deg = ((angle_rad * 180) / Math.PI) % 360;
            const angle_deg = turf.bearing(startPos, endPos);
            lt_log(`Azm from node ${nodeId} / ${segment.id}: ${angle_deg}`, VERBOSITY.VERBOSE);
            return angle_deg;
        }
        // function lt_getBearing_to_node(nodeId: number | null, segment: Segment | null) {
        //     if (!nodeId || !segment) return null;
        //     const fromAzm = lt_getBearing(nodeId, segment);
        //     if (fromAzm === null) return null;
        //     let toAzm = fromAzm + 180.0;
        //     if (toAzm >= 180.0) {
        //         toAzm -= 360.0;
        //     }
        //     lt_log(`Azm to node ${nodeId} / ${segment.id}: ${toAzm}`, 3);
        //     return toAzm;
        // }
        /** Get absolute angle between 2 inputs.
         * @param aIn absolute s_in angle (to node)
         * @param aOut absolute s_out angle (from node)
         * @returns {number}
         */
        function lt_turn_angle(aIn, aOut) {
            if (aIn === null || aOut === null)
                return null;
            let angleInAdjusted = aIn;
            let angleOutAdjusted = aOut;
            while (aOut > 180.0) {
                angleOutAdjusted -= 360.0;
            }
            while (aOut < -180.0) {
                angleOutAdjusted += 360.0;
            }
            while (aIn > 180.0) {
                angleInAdjusted -= 360.0;
            }
            while (aIn < -180.0) {
                angleInAdjusted += 360.0;
            }
            let a = angleOutAdjusted - angleInAdjusted;
            a += a > 180 ? -360 : a < -180 ? 360 : 0;
            lt_log(`Turn ${angleInAdjusted},${angleOutAdjusted}: ${a}`, VERBOSITY.VERBOSE);
            return a;
        }
        function lt_turn_angle_seg_to_seg(inSeg, connectorNode, outSeg) {
            let inPoint;
            let outPoint;
            if (inSeg.fromNodeId === connectorNode.id) {
                inPoint = lt_get_second_point(inSeg);
            }
            else if (inSeg.toNodeId === connectorNode.id) {
                inPoint = lt_get_next_to_last_point(inSeg);
            }
            if (outSeg.fromNodeId === connectorNode.id) {
                outPoint = lt_get_second_point(outSeg);
            }
            else if (outSeg.toNodeId === connectorNode.id) {
                outPoint = lt_get_next_to_last_point(outSeg);
            }
            if (!inPoint || !outPoint)
                return null;
            let turnAngle = turf.angle(inPoint, connectorNode.geometry.coordinates, outPoint);
            turnAngle -= turnAngle > 180 ? 360 : 0;
            turnAngle = turnAngle > 0 ? 180 - turnAngle : -180 - turnAngle;
            return turnAngle;
        }
        function lt_is_turn_allowed(s_from, via_node, s_to) {
            const turnsThrough = sdk.DataModel.Turns.getTurnsThroughNode({ nodeId: via_node.id });
            function isTurnAllowedBySegDirections(from, to) {
                const result = {
                    allowedBySegDirections: false,
                    allowed: false,
                };
                if (from !== null && to !== null) {
                    for (let tidx = 0; tidx < turnsThrough.length; ++tidx) {
                        if (turnsThrough[tidx].fromSegmentId === from.id && turnsThrough[tidx].toSegmentId === to.id) {
                            result.allowed = turnsThrough[tidx].isAllowed;
                            result.allowedBySegDirections = true;
                            break;
                        }
                    }
                }
                return result;
            }
            const permissions = isTurnAllowedBySegDirections(s_from, s_to);
            lt_log(`Allow from ${s_from.id} to ${s_to !== null ? s_to.id : 0} via ${via_node.id}? ${permissions.allowedBySegDirections} | ${permissions.allowed}`, VERBOSITY.VERBOSE);
            // Is there a driving direction restriction?
            if (!permissions.allowedBySegDirections) {
                lt_log("Driving direction restriction applies", VERBOSITY.VERBOSE);
                return false;
            }
            // Is turn allowed by other means (e.g. turn restrictions)?
            if (!permissions.allowed) {
                lt_log("Other restriction applies", VERBOSITY.VERBOSE);
                return false;
            }
            // TBD: Do we need to consider restrictions?
            /*if(s_to.attributes.fromNodeID === via_node.attributes.id) {
            lt_log("FWD direction",3);
            return ja_is_car_allowed_by_restrictions(s_to.attributes.fwdRestrictions);
        } else {
            lt_log("REV direction",3);
            return ja_is_car_allowed_by_restrictions(s_to.attributes.revRestrictions);
        } */
            return true;
        }
    }
    // Segment Length - borrowed from JAI
    // function lt_segment_length(segment: Segment) {
    //     // let len = segment.geometry.getGeodesicLength(W.map.olMap.projection);
    //     // let len = olSphere.getLength(segment.geometry);
    //     const len = 0;
    //     //    let len = segment.geometry.getGeodesicLength(W.map.olMap.projection);
    //     lt_log(`segment: ${segment.id} computed len: ${len} `, 3);
    //     return len;
    // }
    function lt_log(lt_log_msg, verbosity_level = VERBOSITY.INFO) {
        // ##NO_FF_START##
        // Firefox addons should not use console.(log|error|debug), so these lines
        // are removed by the FF addon packaging script.
        if (verbosity_level <= LANETOOLS_DEBUG_LEVEL) {
            console.log(`LaneTools ${verbosity_mnemonic[verbosity_level]} Dev Msg: `, lt_log_msg);
        }
        // ##NO_FF_END##
    }
    function copyLaneInfo(side) {
        _turnInfo = [];
        const selFeatures = sdk.Editing.getSelection();
        const seg = selFeatures[0]._wmeObject;
        const segAtt = seg.getFeatureAttributes();
        const segGeo = seg.geometry.components;
        const nodeID = side === "A" ? segAtt.fromNodeID : segAtt.toNodeID;
        laneCount = side === "A" ? segAtt.revLaneCount : segAtt.fwdLaneCount;
        console.log(laneCount);
        const node = getNodeObj(nodeID);
        const conSegs = node.getSegmentIds();
        // const turnGraph = W.model.getTurnGraph();
        let geoPoint1;
        if (side === "A") {
            geoPoint1 = segGeo[1];
        }
        else {
            geoPoint1 = segGeo[segGeo.length - 2];
        }
        let ja_dx = geoPoint1.x - node.geometry.x;
        let ja_dy = geoPoint1.y - node.geometry.y;
        let angleRad = Math.atan2(ja_dy, ja_dx);
        const angleDeg = ((angleRad * 180) / Math.PI) % 360;
        for (let i = 0; i < conSegs.length; i++) {
            const seg2 = getSegObj(conSegs[i]);
            const seg2Att = seg2?.getFeatureAttributes();
            const seg2Geo = seg2?.geometry.components;
            let geoPoint2;
            let seg2Dir;
            const turnInfo = turnGraph.getTurnThroughNode(node, seg, seg2).getTurnData();
            if (turnInfo.state === 1 && turnInfo.lanes) {
                if (seg2Att.fromNodeID === nodeID) {
                    seg2Dir = "A";
                }
                else {
                    seg2Dir = "B";
                }
                if (seg2Dir === "A") {
                    geoPoint2 = seg2Geo[1];
                }
                else {
                    geoPoint2 = seg2Geo[seg2Geo.length - 2];
                }
                ja_dx = geoPoint2.x - node.geometry.x;
                ja_dy = geoPoint2.y - node.geometry.y;
                angleRad = Math.atan2(ja_dy, ja_dx);
                let tempAngle = ((angleRad * 180) / Math.PI) % 360;
                if (angleDeg < 0)
                    tempAngle = angleDeg - tempAngle;
                _turnData = {};
                let laneData = turnInfo.getLaneData();
                _turnData.id = seg2.attributes.id;
                _turnData.order = tempAngle;
                _turnData.lanes = laneData;
                _turnInfo.push(_turnData);
            }
            _turnInfo.sort((a, b) => (a.order > b.order ? 1 : -1));
        }
        console.log(_turnInfo);
    }
    function pasteLaneInfo(side) {
        const mAction = new MultiAction();
        //    mAction.setModel(W.model);
        const selFeatures = W.selectionManager.getSelectedWMEFeatures();
        const seg = selFeatures[0]._wmeObject;
        const segGeo = seg.geometry.components;
        const segAtt = seg.getFeatureAttributes();
        const nodeID = side === "A" ? segAtt.fromNodeID : segAtt.toNodeID;
        // let sortA = _cpyDir == side ? 1 : -1;
        // let sortB = _cpyDir == side ? -1 : 1;
        let geoPoint1;
        const node = getNodeObj(nodeID);
        const conSegs = node.getSegmentIds();
        // const turnGraph = W.model.getTurnGraph();
        let pasteData = {};
        const pasteInfo = [];
        if (side === "A") {
            geoPoint1 = segGeo[1];
        }
        else {
            geoPoint1 = segGeo[segGeo.length - 2];
        }
        let ja_dx = geoPoint1.x - node.geometry.x;
        let ja_dy = geoPoint1.y - node.geometry.y;
        let angleRad = Math.atan2(ja_dy, ja_dx);
        const angleDeg = ((angleRad * 180) / Math.PI) % 360;
        for (let i = 0; i < conSegs.length; i++) {
            const seg2 = getSegObj(conSegs[i]);
            const seg2Att = seg2.attributes;
            const seg2Geo = seg2.geometry.components;
            let geoPoint2 = {};
            let seg2Dir;
            const turnInfo = turnGraph.getTurnThroughNode(node, seg, seg2).getTurnData();
            if (seg2Att.fromNodeID === nodeID) {
                seg2Dir = "A";
            }
            else {
                seg2Dir = "B";
            }
            if (seg2Dir === "A") {
                geoPoint2 = seg2Geo[1];
            }
            else {
                geoPoint2 = seg2Geo[seg2Geo.length - 2];
            }
            if (turnInfo.state === 1) {
                pasteData = {};
                ja_dx = geoPoint2.x - node.geometry.x;
                ja_dy = geoPoint2.y - node.geometry.y;
                angleRad = Math.atan2(ja_dy, ja_dx);
                let tempAngle = ((angleRad * 180) / Math.PI) % 360;
                if (angleDeg < 0)
                    tempAngle = angleDeg - tempAngle;
                pasteData.id = seg2Att.id;
                pasteData.order = tempAngle;
                pasteInfo.push(pasteData);
            }
            pasteInfo.sort((a, b) => (a.order > b.order ? 1 : -1));
        }
        console.log(pasteInfo);
        if (_turnInfo.length === pasteInfo.length) {
            if (side === "A") {
                mAction.doSubAction(W.model, new UpdateObj(seg, { revLaneCount: laneCount }));
            }
            else {
                mAction.doSubAction(W.model, new UpdateObj(seg, { fwdLaneCount: laneCount }));
            }
            for (let k = 0; k < pasteInfo.length; k++) {
                const pasteTurn = {};
                // Copy turn data into temp object
                for (let q = 0; q < _turnInfo.length; q++) {
                    pasteTurn[q] = _turnInfo[q];
                }
                // If pasting in the opposite direction, reverse the lane associations
                /* if (_cpyDir != side) {
                for (let z=0;z < pasteTurn.length; z++) {
                    pasteTurn[z].lanes.arrowAngle = pasteTurn[z].lanes.arrowAngle * -1;
                }
            } */
                const toSeg = getSegObj(pasteInfo[k].id);
                let turnStatus = turnGraph.getTurnThroughNode(node, seg, toSeg);
                let turnData = turnStatus.getTurnData();
                turnData = turnData.withLanes(pasteTurn[k].lanes);
                turnStatus = turnStatus.withTurnData(turnData);
                mAction.doSubAction(W.model, new SetTurn(turnGraph, turnStatus));
            }
            mAction._description = "Pasted some lane stuff";
            W.model.actionManager.add(mAction);
            lanesTabSetup.formatLanesTab(true);
        }
        else {
            WazeWrap.Alerts.warning(GM_info.script.name, "There are a different number of enabled turns on this segment/node");
        }
    }
    function getIcons(dir) {
        const tempEle = [];
        let svgcount = 0;
        for (let i = 0; i < dir.length; i++) {
            //if (dir[i].id !== "") {
            const temp = {
                uturn: false,
                miniuturn: false,
                svg: [],
            };
            const uTurnDisplay = $(dir[i])
                .find(".uturn")
                .css("display");
            const miniUturnDisplay = $(dir[i])
                .find(".small-uturn")
                .css("display");
            temp.uturn = uTurnDisplay && uTurnDisplay !== "none";
            temp.miniuturn = miniUturnDisplay && miniUturnDisplay !== "none";
            temp.svg = $(dir[i])
                .find("svg")
                .map(function () {
                return this;
            })
                .get();
            if (temp.svg.length > 0) {
                svgcount++;
            }
            tempEle[i] = temp;
        }
        return svgcount > 0 ? tempEle : false;
    }
    function convertToBase64(svgs) {
        const serial = new XMLSerializer();
        _.each(svgs, (obj) => {
            try {
                const svg = obj.svg[0];
                const tmp = serial.serializeToString(svg);
                obj.svg = `data:image/svg+xml;base64,${window.btoa(tmp)}`;
            }
            catch (e) {
                // console.log(e);
            }
        });
        return svgs;
    }
    function getStartPoints(node, featDis, numIcons, sign, isLeftDrive) {
        const start = !featDis || !featDis.start ? 0 : featDis.start;
        const boxheight = !featDis || !featDis.boxheight ? 0 : featDis.boxheight;
        const boxincwidth = !featDis || !featDis.boxincwidth ? 0 : featDis.boxincwidth;
        let nodePos = sdk.Map.getPixelFromLonLat({
            lonLat: { lon: node.geometry.coordinates[0], lat: node.geometry.coordinates[1] },
        });
        const leftDriveModifier = isLeftDrive ? -1 : 1;
        const leftOffset = isLeftDrive ? featDis.leftOffset : 0;
        switch (sign) {
            case 0:
                nodePos.x += leftDriveModifier * start * 2 - leftOffset;
                nodePos.y += boxheight;
                break;
            case 1:
                nodePos.x -=
                    leftDriveModifier * (start + (leftDriveModifier > 0 ? boxincwidth * numIcons : 2 * leftOffset));
                nodePos.y -= start + boxheight;
                break;
            case 2:
                nodePos.x += start;
                nodePos.y -=
                    leftDriveModifier *
                        (start + (leftDriveModifier > 0 ? boxincwidth * numIcons : boxincwidth * numIcons));
                break;
            case 3:
                nodePos.x -= start + boxheight;
                nodePos.y +=
                    leftDriveModifier * (start + (leftDriveModifier > 0 ? boxincwidth : boxincwidth * numIcons));
                break;
            case 4:
                nodePos.x +=
                    leftDriveModifier *
                        (start + (leftDriveModifier > 0 ? boxincwidth : boxincwidth * numIcons + leftOffset * 2));
                nodePos.y += start;
                break;
            case 5:
                nodePos.x -= leftDriveModifier * (start + (leftDriveModifier > 0 ? boxincwidth * numIcons : 0));
                nodePos.y += leftDriveModifier > 0 ? start : leftDriveModifier * (boxheight * 2 + start);
                break;
            case 6:
                nodePos.x -= leftDriveModifier > 0 ? start : boxincwidth * numIcons + start + leftOffset;
                nodePos.y += leftDriveModifier * (start + boxheight);
                break;
            case 7:
                nodePos.x +=
                    leftDriveModifier *
                        (start + (leftDriveModifier > 0 ? boxincwidth / 2 : boxincwidth * numIcons + leftOffset * 2));
                nodePos.y -= leftDriveModifier * (start + boxheight);
                break;
            case 8:
                nodePos.x -= leftDriveModifier * (start + boxincwidth * numIcons);
                nodePos.y -= leftDriveModifier * (start + boxheight);
                break;
            case 9:
                nodePos.x -=
                    leftDriveModifier *
                        (start + (leftDriveModifier > 0 ? boxincwidth * numIcons * 1.25 : 2 * leftOffset));
                nodePos.y -= start + boxheight;
                break;
            default:
                return [];
        }
        const lonLatRes = sdk.Map.getLonLatFromPixel(nodePos);
        return [lonLatRes.lon, lonLatRes.lat];
    }
    function getFeatDistance() {
        const label_distance = {
            start: 10,
            boxheight: 39.0,
            boxincwidth: 28.0,
            iconbordermargin: 1.0,
            iconborderheight: 38.0,
            iconborderwidth: 27.0,
            graphicHeight: 42,
            graphicWidth: 25,
            leftOffset: 12,
        };
        // switch (sdk.Map.getZoomLevel()) {
        //     case 22:
        //         label_distance.start = 10;
        //         label_distance.boxheight = 39.0;
        //         label_distance.boxincwidth = 28.0;
        //         label_distance.iconbordermargin = 1.0;
        //         label_distance.iconborderheight = 38.0;
        //         label_distance.iconborderwidth = 27.0;
        //         label_distance.graphicHeight = 42;
        //         label_distance.graphicWidth = 25;
        //         label_distance.leftOffset = 8;
        //         break;
        //     case 21:
        //         label_distance.start = 10;
        //         label_distance.boxheight = 39.0;
        //         label_distance.boxincwidth = 28.0;
        //         label_distance.iconbordermargin = 1.0;
        //         label_distance.iconborderheight = 38.0;
        //         label_distance.iconborderwidth = 27.0;
        //         label_distance.graphicHeight = 42;
        //         label_distance.graphicWidth = 25;
        //         label_distance.leftOffset = 8;
        //         break;
        //     case 20:
        //         label_distance.start = 10;
        //         label_distance.boxheight = 39.0;
        //         label_distance.boxincwidth = 28.0;
        //         label_distance.iconbordermargin = 1.0;
        //         label_distance.iconborderheight = 38.0;
        //         label_distance.iconborderwidth = 27.0;
        //         label_distance.graphicHeight = 42;
        //         label_distance.graphicWidth = 25;
        //         label_distance.leftOffset = 8;
        //         break;
        //     case 19:
        //         label_distance.start = 10;
        //         label_distance.boxheight = 39.0;
        //         label_distance.boxincwidth = 28.0;
        //         label_distance.iconbordermargin = 1.0;
        //         label_distance.iconborderheight = 38.0;
        //         label_distance.iconborderwidth = 27.0;
        //         label_distance.graphicHeight = 42;
        //         label_distance.graphicWidth = 25;
        //         label_distance.leftOffset = 8;
        //         break;
        //     case 18:
        //         label_distance.start = 10;
        //         label_distance.boxheight = 39.0;
        //         label_distance.boxincwidth = 28.0;
        //         label_distance.iconbordermargin = 1;
        //         label_distance.iconborderheight = 38;
        //         label_distance.iconborderwidth = 27;
        //         label_distance.graphicHeight = 42;
        //         label_distance.graphicWidth = 25;
        //         label_distance.leftOffset = 8;
        //         break;
        //     case 17:
        //         label_distance.start = 10;
        //         label_distance.boxheight = 39.0;
        //         label_distance.boxincwidth = 28.0;
        //         label_distance.iconbordermargin = 1.0;
        //         label_distance.iconborderheight = 38.0;
        //         label_distance.iconborderwidth = 27.0;
        //         label_distance.graphicHeight = 42;
        //         label_distance.graphicWidth = 25;
        //         label_distance.leftOffset = 8;
        //         break;
        //     case 16:
        //         label_distance.start = 10;
        //         label_distance.boxheight = 39.0;
        //         label_distance.boxincwidth = 28.0;
        //         label_distance.iconbordermargin = 1.0;
        //         label_distance.iconborderheight = 38.0;
        //         label_distance.iconborderwidth = 27.0;
        //         label_distance.graphicHeight = 42;
        //         label_distance.graphicWidth = 25;
        //         label_distance.leftOffset = 8;
        //         break;
        //     case 15:
        //         label_distance.start = 2;
        //         label_distance.boxheight = 120.0;
        //         label_distance.boxincwidth = 90;
        //         label_distance.iconbordermargin = 3.0;
        //         label_distance.iconborderheight = 117.0;
        //         label_distance.iconborderwidth = 87;
        //         label_distance.graphicHeight = 42;
        //         label_distance.graphicWidth = 25;
        //         label_distance.leftOffset = 32;
        //         break;
        //     case 14:
        //         label_distance.start = 2;
        //         label_distance.boxheight = 5.2;
        //         label_distance.boxincwidth = 3.8;
        //         label_distance.iconbordermargin = 0.3;
        //         label_distance.iconborderheight = 4.9;
        //         label_distance.iconborderwidth = 3.5;
        //         label_distance.graphicHeight = 42;
        //         label_distance.graphicWidth = 25;
        //         label_distance.leftOffset = 32;
        //         break;
        //     // case 13:
        //     //     label_distance.start = 2;
        //     //     label_distance.boxheight = 5.2;
        //     //     label_distance.boxincwidth = 3.8;
        //     //     label_distance.iconbordermargin = .3;
        //     //     label_distance.iconborderheight = 4.9;
        //     //     label_distance.iconborderwidth = 3.5;
        //     //     label_distance.graphicHeight = 42;
        //     //     label_distance.graphicWidth = 25;
        //     //     break;
        // }
        return label_distance;
    }
    function drawIcons(seg, node, imgs, isLeftDrive = false) {
        if (!seg || !node)
            return;
        const featDis = getFeatDistance();
        let deg = getAzimuthAngle(node.id, seg);
        if (!deg)
            return;
        const points = [];
        let operatorSign = 0;
        const numIcons = imgs.length;
        // Rotate in the style is clockwise, the rotate() func is counterclockwise
        if (deg === 0) {
            deg += 180;
            operatorSign = 1;
        }
        else if (deg > 0 && deg <= 30) {
            deg += 90; //2 * (90 - deg);
            // console.log('Math stuff2: ' + deg);
            operatorSign = 1;
        }
        else if (deg >= 330 && deg <= 360) {
            deg -= 270; // 180 - 2 * (360 - deg);
            // console.log('Math stuff2: ' + deg);
            operatorSign = 9;
        }
        else if (deg > 30 && deg < 60) {
            deg += 90; // - 2 * (360 - deg);
            // console.log('Math stuff3: ' + deg);
            operatorSign = 8;
        }
        else if (deg >= 60 && deg <= 120) {
            deg += 90; // - 2 * (360 - deg);
            // console.log('Math stuff4: ' + deg);
            operatorSign = 2;
        }
        else if (deg > 120 && deg < 150) {
            deg += 90; //- 2 * (360 - deg);
            // console.log('Math stuff5: ' + deg);
            operatorSign = 7;
        }
        else if (deg >= 150 && deg <= 210) {
            // deg = 180 - deg;
            deg += 90; // - 2 * (360 - deg);
            // console.log('Math stuff6: ' + deg);
            operatorSign = 4;
        }
        else if (deg > 210 && deg < 240) {
            deg -= 270; // - 2 * (360 - deg);
            // console.log('Math stuff7: ' + deg);
            operatorSign = 6;
        }
        else if (deg >= 240 && deg <= 300) {
            deg -= 270; //- 2 * (360 - deg);
            // console.log('Math stuff8: ' + deg);
            operatorSign = 3;
        }
        else if (deg > 300 && deg < 330) {
            // deg -= 180 - 2 * (360 - deg);
            deg -= 270;
            // console.log('Math stuff9: ' + deg);
            operatorSign = 5;
        }
        else {
            console.log("LT: icon angle is out of bounds");
        }
        // Orient all icons straight up if the rotate option isn't enabled
        let iconRotate = deg > 315 ? deg : deg + 90;
        let boxRotate = 360 - iconRotate;
        if (!LtSettings.IconsRotate) {
            iconRotate += 180;
            boxRotate += 180;
        }
        // console.log(deg);
        // console.log(operatorSign);
        // Determine start point respective to node based on segment angle
        // let boxRotate = deg * -1;
        const startPoint = getStartPoints(node, featDis, numIcons, operatorSign, isLeftDrive);
        // Box coords
        // var boxPoint1 = new OpenLayers.Geometry.Point(startPoint.x, startPoint.y + featDis.boxheight);
        // var boxPoint2 = new OpenLayers.Geometry.Point(
        //     startPoint.x + featDis.boxincwidth * numIcons,
        //     startPoint.y + featDis.boxheight
        // );
        // var boxPoint3 = new OpenLayers.Geometry.Point(startPoint.x + featDis.boxincwidth * numIcons, startPoint.y);
        // var boxPoint4 = new OpenLayers.Geometry.Point(startPoint.x, startPoint.y);
        const startPointCoords = sdk.Map.getPixelFromLonLat({ lonLat: { lon: startPoint[0], lat: startPoint[1] } });
        let boxPoint1 = structuredClone(startPointCoords);
        boxPoint1.y += !featDis ? 0 : featDis.boxheight;
        const boxPoint1LonLat = sdk.Map.getLonLatFromPixel(boxPoint1);
        let boxPoint2 = structuredClone(startPointCoords);
        boxPoint2.x += !featDis ? 0 : featDis.boxincwidth * numIcons;
        boxPoint2.y += !featDis ? 0 : featDis.boxheight;
        const boxPoint2LonLat = sdk.Map.getLonLatFromPixel(boxPoint2);
        let boxPoint3 = structuredClone(startPointCoords);
        boxPoint3.x += !featDis ? 0 : featDis.boxincwidth * numIcons;
        const boxPoint3LonLat = sdk.Map.getLonLatFromPixel(boxPoint3);
        points.push([boxPoint1LonLat.lon, boxPoint1LonLat.lat], [boxPoint2LonLat.lon, boxPoint2LonLat.lat], [boxPoint3LonLat.lon, boxPoint3LonLat.lat], startPoint, [boxPoint1LonLat.lon, boxPoint1LonLat.lat]);
        // Object.assign(styleRules.boxStyle.style, {
        //     strokeColor: "#ffffff",
        //     strokeOpacity: 1,
        //     strokeWidth: 8,
        //     fillColor: "#ffffff",
        //     // rotate: boxRotate
        // });
        // let boxRing = new OpenLayers.Geometry.LinearRing(points);
        // centerPoint = boxRing.getCentroid();
        // boxRing.rotate(boxRotate, centerPoint);
        // let boxVector = new OpenLayers.Feature.Vector(boxRing, null, boxStyle);
        let turfBoxRing = turf.polygon([points]);
        turfBoxRing = turf.transformRotate(turfBoxRing, -1 * boxRotate);
        const centerPoint = turf.centroid(turfBoxRing);
        const boxRing = turf.polygon(turfBoxRing.geometry.coordinates, { styleName: "boxStyle", layerName: LTLaneGraphics.name }, { id: `polygon_${points.toString()}` });
        const startPointFeature = turf.point(startPoint, { styleName: "startPointStyle", layerName: LTLaneGraphics.name }, { id: `point_${startPoint.toString()}` });
        // LTLaneGraphics.addFeatures([boxVector]);
        sdk.Map.addFeatureToLayer({ feature: boxRing, layerName: LTLaneGraphics.name });
        // sdk.Map.addFeatureToLayer({ feature: startPointFeature, layerName: LTLaneGraphics.name });
        let num = 0;
        const startPointPixel = sdk.Map.getPixelFromLonLat({ lonLat: { lon: startPoint[0], lat: startPoint[1] } });
        _.each(imgs, (img) => {
            // Icon Background
            // var iconPoint1 = new OpenLayers.Geometry.Point(
            //     startPoint.x + featDis.boxincwidth * num + featDis.iconbordermargin,
            //     startPoint.y + featDis.iconborderheight
            // );
            let iconPoint1Pixel = structuredClone(startPointPixel);
            iconPoint1Pixel.x += !featDis
                ? 0
                : (!featDis.boxincwidth ? 0 : featDis.boxincwidth) * num +
                    (!featDis.iconbordermargin ? 0 : featDis.iconbordermargin);
            iconPoint1Pixel.y += !featDis || !featDis.iconborderheight ? 0 : featDis.iconborderheight;
            const iconPoint1 = sdk.Map.getLonLatFromPixel(iconPoint1Pixel);
            // var iconPoint2 = new OpenLayers.Geometry.Point(
            //     startPoint.x + featDis.boxincwidth * num + featDis.iconborderwidth,
            //     startPoint.y + featDis.iconborderheight
            // );
            let iconPoint2Pixel = structuredClone(startPointPixel);
            iconPoint2Pixel.x += !featDis
                ? 0
                : (!featDis.boxincwidth ? 0 : featDis.boxincwidth) * num +
                    (!featDis.iconborderwidth ? 0 : featDis.iconborderwidth);
            iconPoint2Pixel.y += !featDis || !featDis.iconborderheight ? 0 : featDis.iconborderheight;
            const iconPoint2 = sdk.Map.getLonLatFromPixel(iconPoint2Pixel);
            let iconPoint3Pixel = structuredClone(startPointPixel);
            iconPoint3Pixel.x += !featDis
                ? 0
                : (!featDis.boxincwidth ? 0 : featDis.boxincwidth) * num +
                    (!featDis.iconborderwidth ? 0 : featDis.iconborderwidth);
            iconPoint3Pixel.y += !featDis || !featDis.iconbordermargin ? 0 : featDis.iconbordermargin;
            const iconPoint3 = sdk.Map.getLonLatFromPixel(iconPoint3Pixel);
            // var iconPoint4 = new OpenLayers.Geometry.Point(
            //     startPoint.x + featDis.boxincwidth * num + featDis.iconbordermargin,
            //     startPoint.y + featDis.iconbordermargin
            // );
            let iconPoint4Pixel = structuredClone(startPointPixel);
            iconPoint4Pixel.x += !featDis
                ? 0
                : (!featDis.boxincwidth ? 0 : featDis.boxincwidth) * num +
                    (!featDis.iconbordermargin ? 0 : featDis.iconbordermargin);
            iconPoint4Pixel.y += !featDis || !featDis.iconbordermargin ? 0 : featDis.iconbordermargin;
            const iconPoint4 = sdk.Map.getLonLatFromPixel(iconPoint4Pixel);
            const iconPoints = [
                [iconPoint1.lon, iconPoint1.lat],
                [iconPoint2.lon, iconPoint2.lat],
                [iconPoint3.lon, iconPoint3.lat],
                [iconPoint4.lon, iconPoint4.lat],
                [iconPoint1.lon, iconPoint1.lat],
            ];
            // Object.assign(styleRules.iconBoxStyle.style, {
            //     strokeColor: "#000000",
            //     strokeOpacity: 1,
            //     strokeWidth: 1,
            //     fillColor: "#26bae8",
            //     // rotate: boxRotate
            // });
            // let iconBoxRing = new OpenLayers.Geometry.LinearRing(iconPoints);
            let turfIconBoxRing = turf.polygon([iconPoints]);
            turfIconBoxRing = turf.transformRotate(turfIconBoxRing, -1 * boxRotate, { pivot: centerPoint.geometry });
            const iconBoxRing = turf.polygon(turfIconBoxRing.geometry.coordinates, { styleName: "iconBoxStyle", layerName: LTLaneGraphics.name }, { id: `polygon_${iconPoints.toString()}` });
            // iconBoxRing.rotate(boxRotate, centerPoint);
            // let iconBoxVector = new OpenLayers.Feature.Vector(iconBoxRing, null, iconBoxStyle);
            // LTLaneGraphics.addFeatures([iconBoxVector]);
            sdk.Map.addFeatureToLayer({ feature: iconBoxRing, layerName: LTLaneGraphics.name });
            // Icon coords
            const arrowOrigin = turf.centroid(turfIconBoxRing);
            // let iconStart = new OpenLayers.Geometry.Point(arrowOrigin.x, arrowOrigin.y);
            let ulabel = "";
            const usize = {
                x: undefined,
                y: undefined,
            };
            const uoffset = {
                x: undefined,
                y: undefined,
            };
            if (img.uturn === true) {
                ulabel = `https://web-assets.waze.com/webapps/wme/${sdk.getWMEVersion()}-${env}/font/989fe58ac11ed7d3/u-turn-small.svg`;
                usize.x = 0.6;
                usize.y = 0.6;
                uoffset.x = -7;
                uoffset.y = -12;
            }
            if (img.miniuturn === true) {
                ulabel = `https://web-assets.waze.com/webapps/wme/${sdk.getWMEVersion()}-${env}/font/989fe58ac11ed7d3/u-turn-small.svg`;
                usize.x = 0.3;
                usize.y = 0.25;
                uoffset.x = -8;
                uoffset.y = 4;
            }
            const iconStart = turf.point(arrowOrigin.geometry.coordinates, {
                styleName: "iconStyle",
                layerName: LTLaneGraphics.name,
                style: {
                    externalGraphic: img.svg,
                    graphicHeight: featDis.graphicHeight,
                    graphicWidth: featDis.graphicWidth,
                    fillColor: "#26bae8",
                    fillOpacity: 1,
                    backgroundColor: "#26bae8",
                    strokeColor: "#26bae8",
                    rotation: iconRotate,
                    backgroundGraphic: ulabel,
                    backgroundHeight: !featDis || !featDis.graphicHeight || !usize.y
                        ? undefined
                        : featDis.graphicHeight * usize.y,
                    backgroundWidth: !featDis || !featDis.graphicWidth || !usize.x ? undefined : featDis.graphicWidth * usize.x,
                    backgroundXOffset: uoffset.x,
                    backgroundYOffset: uoffset.y,
                },
            }, { id: `point_${iconPoints.toString()}` });
            sdk.Map.addFeatureToLayer({ layerName: LTLaneGraphics.name, feature: iconStart });
            num++;
        });
        // LTLaneGraphics.setZIndex(2890);
    }
    function displayLaneGraphics() {
        removeLaneGraphics();
        const selection = sdk.Editing.getSelection();
        if (!LtSettings.ScriptEnabled ||
            !LtSettings.UIEnable ||
            selection == null ||
            selection?.objectType !== "segment" ||
            (selection.ids && selection.ids.length !== 1))
            return;
        const seg = sdk.DataModel.Segments.getById({ segmentId: selection.ids[0] });
        if (!seg)
            return;
        const zoomLevel = sdk.Map.getZoomLevel();
        if (zoomLevel < 15 ||
            (seg.roadType !== (LT_ROAD_TYPE.FREEWAY || LT_ROAD_TYPE.MAJOR_HIGHWAY || LT_ROAD_TYPE.MINOR_HIGHWAY) &&
                zoomLevel < 16))
            return;
        let isLeftDrive = false;
        if (seg.primaryStreetId) {
            let primaryStreet = sdk.DataModel.Streets.getById({ streetId: seg.primaryStreetId });
            if (primaryStreet?.cityId) {
                let city = sdk.DataModel.Cities.getById({ cityId: primaryStreet.cityId });
                if (city?.countryId) {
                    let country = sdk.DataModel.Countries.getById({ countryId: city.countryId });
                    isLeftDrive = country?.isLeftHandTraffic || false;
                }
            }
        }
        waitForElementLoaded(".lanes-tab > .lanes > div > .direction-lanes").then(() => {
            const fwdEle = seg?.fromNodeLanesCount && seg.fromNodeLanesCount > 0
                ? getIcons($(".fwd-lanes")
                    .find(".lane-arrow")
                    .map(function () {
                    return this;
                })
                    .get())
                : false;
            const revEle = seg?.toNodeLanesCount && seg.toNodeLanesCount > 0
                ? getIcons($(".rev-lanes")
                    .find(".lane-arrow")
                    .map(function () {
                    return this;
                })
                    .get())
                : false;
            const fwdImgs = fwdEle !== false ? convertToBase64(fwdEle) : false;
            const revImgs = revEle !== false ? convertToBase64(revEle) : false;
            if (fwdEle) {
                if (fwdEle.length === 0) {
                    // setTimeout(displayLaneGraphics, 200);
                    return;
                }
                drawIcons(seg, !seg || !seg.toNodeId ? null : sdk.DataModel.Nodes.getById({ nodeId: seg?.toNodeId }), fwdImgs, isLeftDrive);
            }
            if (revEle) {
                if (revEle.length === 0) {
                    // setTimeout(displayLaneGraphics, 200);
                    return;
                }
                drawIcons(seg, !seg || !seg.fromNodeId ? null : sdk.DataModel.Nodes.getById({ nodeId: seg?.fromNodeId }), revImgs, isLeftDrive);
            }
        });
        // There are now 23 zoom levels where 22 is fully zoomed and currently 14 is where major road types load data and 16 loads the rest
    }
    laneToolsBootstrap();
}
