// ==UserScript==
// @name            WME BeenThere-dev
// @namespace       https://greasyfork.org/users/30701-justins83-waze
// @description     This lets you drop boxes around the map to help visualize where you have been editing
// @include         https://www.waze.com/editor*
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com/*
// @exclude         https://www.waze.com/user/*editor/*
// @exclude         https://www.waze.com/*/user/*editor/*
// @require         https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js
// @require         https://update.greasyfork.org/scripts/28502/187735/jQuery%20UI%20-%20v1114.js
// @require         https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js
// @version         2026.01.13.01
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/538122/WME%20BeenThere-dev.user.js
// @updateURL https://update.greasyfork.org/scripts/538122/WME%20BeenThere-dev.meta.js
// ==/UserScript==
//---------------------------------------------------------------------------------------

/* ecmaVersion 2017 */
/* global $ */
/* global Clipboard */
/* global turf */
/* jslint esversion: 11 */

(function () {
    'use strict';

    unsafeWindow.SDK_INITIALIZED.then( function () {

        console.log("WME BeenThere: loading");
        const WME = unsafeWindow.getWmeSdk({scriptId: "WMEBT", scriptName: "BeenThere"});
        let btSettings = [];
        const btMapLayer = "BeenThere_";
        const btDrawingLayer = "BeenThereUserDrawing";
        let btFeatures = {};
        let layerFuture = [];
        let clickCount = 0;
        let userRectPoint1 = null;
        let userCircleCenter = null;
        let currColor;
        const updateMessage = "Rewritten to use WME SDK: restored ability to draw boxes and circles. Color pickers replaced by hard-coded colors.";

        function AddExtent() {
            const bbox = WME.Map.getMapExtent();
            const groupPoints = {
                topLeft : [bbox[0], bbox[3]],
                botLeft : [bbox[0], bbox[1]],
                botRight: [bbox[2], bbox[1]],
                topRight: [bbox[2], bbox[3]],
                color: currColor,
                type: "rectangle",
                radius: null
            };
            btSettings.Groups[btSettings.CurrentGroup].push(groupPoints);
            DrawFeature(groupPoints);
        }

        function DrawFeature(obj) {
            const pnt = [];
            let feature;
            if (obj.type === "rectangle") {
                pnt.push(obj.topLeft);
                pnt.push(obj.botLeft);
                pnt.push(obj.botRight);
                pnt.push(obj.topRight);
                pnt.push(obj.topLeft);
                feature = turf.polygon([pnt]);
            } else { //circle
                feature = turf.circle(obj.centerPoint, obj.radius);
            }
            feature.properties = {color: obj.color};
            feature.id = "bt" + Object.keys(btFeatures).length;
            WME.Map.addFeatureToLayer({layerName: btMapLayer, feature: feature});
            btFeatures[feature.id] = feature;
            updateTotalRectCount();
        }

        function updateTotalRectCount(){
            $('#rectCount')[0].innerHTML = Object.keys(btFeatures).length;
        }

        function NewBox(e) {
            e.stopPropagation();
            AddExtent();
            saveSettings();
        }

        function NewUserRect(e) {
            e.stopPropagation();
            EndUserCircleMode();
            clickCount = 0;
            userRectPoint1 = null;
            WME.Events.on({eventName: 'wme-map-mouse-move', eventHandler: MouseMoveHandlerRect});
            WME.Events.on({eventName: 'wme-map-mouse-up', eventHandler: ClickHandlerRect});
            document.addEventListener('keyup', keyUpHandler);
        }

        function NewUserCircle(e) {
            e.stopPropagation();
            EndUserRectMode();
            clickCount = 0;
            userCircleCenter = null;
            WME.Events.on({eventName: 'wme-map-mouse-move', eventHandler: MouseMoveHandlerCircle});
            WME.Events.on({eventName: 'wme-map-mouse-up', eventHandler: ClickHandlerCircle});
            document.addEventListener('keyup', keyUpHandler);
        }

        function ClickHandlerCircle(e) {
            if (clickCount === 0) {
                userCircleCenter = turf.point([e.lon, e.lat]);
                clickCount++;
            } else {
                const point2 = turf.point([e.lon, e.lat]);
                const radius = turf.distance(userCircleCenter, point2);
                const circleData = {
                    centerPoint: userCircleCenter.geometry.coordinates,
                    radius: radius,
                    color: currColor,
                    type: "circle"
                };
                btSettings.Groups[btSettings.CurrentGroup].push(circleData);
                saveSettings();
                DrawFeature(circleData);
                EndUserCircleMode();
            }
        }

        function ClickHandlerRect(e) {
            if (clickCount === 0) { //first point chosen - draw rectangle as the mouse moves
                userRectPoint1 = turf.point([e.lon, e.lat]);
                clickCount++;
            } else { //second point chosen - take both coordinates and draw a rectangle on the BeenThere layer
                const p1 = {};
                [ p1.lon, p1.lat ] = userRectPoint1.geometry.coordinates;
                const groupPoints = {
                    topLeft : [p1.lon, p1.lat],
                    botLeft : [p1.lon, e.lat],
                    botRight: [e.lon, e.lat],
                    topRight: [e.lon, p1.lat],
                    color: currColor,
                    type: "rectangle"
                };
                btSettings.Groups[btSettings.CurrentGroup].push(groupPoints);
                saveSettings();
                DrawFeature(groupPoints);
                EndUserRectMode();
            }
        }

        function MouseMoveHandlerRect(e) {
            clearLayer();
            let currMousePos = turf.point([e.lon, e.lat]);
            drawPointer(currMousePos, false);
            if (clickCount > 0) {
                drawRect(userRectPoint1, currMousePos);
            }
        }

        function MouseMoveHandlerCircle(e) {
            clearLayer();
            let currMousePos = turf.point([e.lon, e.lat]);
            drawPointer(currMousePos, true);
            if (clickCount > 0) {
                let radius = turf.distance(userCircleCenter, currMousePos);
                drawCircle(userCircleCenter, radius);
            }
        }

        function clearLayer() {
            WME.Map.removeAllFeaturesFromLayer({layerName: btDrawingLayer});
        }

        function drawRect(point1, point2) {
            if (point1 !== null && point2 !== null) {
                const polygon = turf.polygon([
                    [
                        point1.geometry.coordinates,
                        [point1.geometry.coordinates[0], point2.geometry.coordinates[1]],
                        point2.geometry.coordinates,
                        [point2.geometry.coordinates[0], point1.geometry.coordinates[1]],
                        point1.geometry.coordinates
                    ]
                ]);
                polygon.id = "btrect";
                polygon.properties = { drawingType: "rectangle" };
                WME.Map.addFeatureToLayer({feature: polygon, layerName: btDrawingLayer});
            }
        }

        function drawCircle(center, radius) {
            if (center !== null) {
                const circle = turf.circle(center, radius);
                circle.id = "btcirc";
                circle.properties = { drawingType: "circle" };
                WME.Map.addFeatureToLayer({feature: circle, layerName: btDrawingLayer});
            }
        }

        function drawPointer(point, circle) {
            point.id = "btpointer";
            point.properties = {objectType: circle ? "pointer-circle" : "pointer-rect"};
            WME.Map.addFeatureToLayer({feature: point, layerName: btDrawingLayer});
        }

        function keyUpHandler(e) {
            if (e.keyCode == 27){
                EndUserRectMode();
                EndUserCircleMode();
            }
        }

        function EndUserRectMode() {
            try {
                WME.Events.off({eventName: 'wme-map-mouse-move', eventHandler: MouseMoveHandlerRect});
                WME.Events.off({eventName: 'wme-map-mouse-up', eventHandler: ClickHandlerRect});
            } catch {
                // ignore error
            }
            clearLayer();
            document.removeEventListener('keyup', keyUpHandler);
            clickCount = 0;
            userRectPoint1 = null;
        }

        function EndUserCircleMode() {
            try {
                WME.Events.off({eventName: 'wme-map-mouse-move', eventHandler: MouseMoveHandlerCircle});
                WME.Events.off({eventName: 'wme-map-mouse-up', eventHandler: ClickHandlerCircle});
            } catch {
                // ignore error
            }
            clearLayer();
            document.removeEventListener('keyup', keyUpHandler);
            clickCount = 0;
            userCircleCenter = null;
        }

        function RemoveLastBox() {
            if (Object.keys(btFeatures).length > 0) {
                const last = Object.keys(btFeatures).sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2))).slice(-1);
                const feature = btFeatures[last];
                WME.Map.removeFeatureFromLayer({layerName: btMapLayer, featureId: feature.id});
                delete btFeatures[last];
                if (btSettings.Groups[btSettings.CurrentGroup].length > 0) {
                    layerFuture.push(btSettings.Groups[btSettings.CurrentGroup].pop());
                }
                saveSettings();
                updateTotalRectCount();
            }
        }

        function RedoLastBox() {
            if (layerFuture.length >0){
                var rect = layerFuture.pop();
                btSettings.Groups[btSettings.CurrentGroup].push(rect);
                DrawFeature(rect);
            }
        }

        function RemoveAllBoxes() {
            if (btSettings.Groups[btSettings.CurrentGroup].length > 0) {
                if (confirm("Clearing all boxes cannot be undone.\nPress OK to clear all boxes.")) {
                    WME.Map.removeAllFeaturesFromLayer({layerName: btMapLayer});
                    btFeatures = {};
                    btSettings.Groups[btSettings.CurrentGroup] = [];
                    layerFuture = [];
                    saveSettings();
                    updateTotalRectCount();
                }
            }
        }

        function LayerToggled(event) {
            if (event.name === "Been There") {
                WME.Map.setLayerVisibility({layerName: btMapLayer, visibility: event.checked});
                WME.Map.setLayerVisibility({layerName: btDrawingLayer, visibility: event.checked});
                btSettings.layerVisible = event.checked;
                saveSettings();
            }
        }

        /*
            Takes the settings loaded into the settings obj and loads them into the interface and draws any features that were saved
        */
        function LoadSettings(){
            loadGroup(btSettings.CurrentGroup);
        }

        function loadGroup(group){
            for (var i=0; i<btSettings.Groups[group].length; i++) {
                DrawFeature(btSettings.Groups[group][i]);
            }
        }

        function BuildSettingsInterface(){
            var $section = $("<div>", {style:"padding:8px 16px", id:"WMEBeenThereSettings"});
            $section.html([
                `<div id="BeenThereSettings" style="visibility:hidden; position:fixed; top:${btSettings.SettingsLocTop}; left:${btSettings.SettingsLocLeft}; z-index:1000; background-color:white; border-width:3px; border-style:solid; border-radius:10px; padding:4px;">`,
                '<div>', //top div - split left/right
                '<div style="width:328px; height:240px; display:inline-block; float:left;">', //left side div
                '<div><h3>Drawing</h3>',
                '<input type="radio" name="DrawOptions" class="btOptions" id="chkBTShapeBorder">Draw shape border</br>',
                '<input type="radio" name="DrawOptions" class="btOptions" id="chkBTShapeFill">Fill shape</br>',
                '</div></br>',//close drawing div
                '<div><h3>Export/Import</h3>',
                '<div><button class="fa fa-upload fa-2x" aria-hidden="true" id="btnBTCopySettings" style="cursor:pointer;border: 1; background: none; box-shadow:none;" title="Copy BeenThere settings to the clipboard" data-clipboard-target="#BTSettings"></button>',
                '<textarea rows="4" cols="30" readonly id="BTSettings" style="resize:none;"></textarea>',
                '</div>',//end export div
                '<div>', // import div
                '<button class="fa fa-download fa-2x" aria-hidden="true" id="btnBTImportSettings" style="cursor:pointer;border: 1; background: none; box-shadow:none;" title="Import copied settings"></button>',
                '<textarea rows="4" cols="30" id="txtBTImportSettings" style="resize:none;"></textarea>',
                '</div>',//end import div
                '</div>',//close import/export div
                '</div>', //close left side div

                '<div style="display:inline-block; height:240px;">', //right side div
                '<h3>Groups</h3>',
                '<div id="BeenThereGroups">',
                '<div id="BeenThereGroupsList">',
                '</div>',
                '<div style="float:left;">',//textboxes div
                '<label for="btGroupName" style="display:inline-block; width:40px;">Name </label><input type="text" id="btGroupName" size="10" style="border: 1px solid #000000; height:20px;"/></br>',
                '</div>', //End textboxes div

                '<div style="float:right; text-align:center;">',//button div
                '<button id="btAddGroup">Add</button>',
                '</div>',//close button div
                '</div>', //close BeenThereGroups
                '</div>', //close right side div
                '</div>', //close top div

                '<div style="float: right; top:10px;">', //save/cancel buttons
                '<button id="BeenThereSettingsClose" class="btn btn-default">Close</button>',
                '</div>',//end save/cancel buttons
                '</div>'
            ].join(' '));

            $("#WazeMap").append($section.html());

            $('.btOptions').on("change", function() {
                btSettings.DrawShapeBorder = isChecked('chkBTShapeBorder');
                btSettings.FillShape = isChecked('chkBTShapeFill');
                saveSettings();
            });

            $("#BeenThereSettingsClose").on("click", function() {
                $('#BeenThereSettings').css({'visibility':'hidden'}); //hide the settings window
            });

            $('#btnBTImportSettings').on("click", function() {
                const newText = $('#txtBTImportSettings')[0].value;
                if (newText !== "") {
                    try {
                        const newSettings = JSON.parse(newText);
                    } catch {
                        // SyntaxError if not valid JSON
                        alert("Settings text is not valid JSON object.");
                        $('#txtBTImportSettings')[0].value = "";
                        return;
                    }
                    localStorage.WME_BeenThere = newText;
                    LoadSettingsObj();
                    LoadSettings();
                }
            });

            LoadCustomGroups();

            $('#btAddGroup').on("click", function() {
                if ($('#btGroupName').val() !== ""){
                    let name = $('#btGroupName').val();
                    let exists = btSettings.Groups[name];
                    if (!exists) {
                        btSettings.Groups[name] = [];
                        $('#btGroupName').val("");
                        LoadCustomGroups();
                        saveSettings();
                    }
                }
            });

            new Clipboard('#btnBTCopySettings');
        }

        function LoadCustomGroups(){
            $('#BeenThereGroupsList').empty();
            var groups = "";
            $.each(btSettings.Groups, function(k, v){
                groups += '<div style="position:relative;">' + k + '<i id="BTGroupsClose' + k + '" style="position:absolute; right:0; top:0;" class="fa fa-times" title="Remove group"></i></div>';
            });

            groups += 'Current group: <select id="btCurrGroup">';
            $.each(btSettings.Groups, function(val, obj){
                groups += `<option value="${val}">${val}</option>`;
            });
            groups += '</select>';

            $('#BeenThereGroupsList').prepend(groups);

            $('#btCurrGroup')[0].value = btSettings.CurrentGroup;

            $('#btCurrGroup').change(function() {
                btSettings.CurrentGroup = $(this)[0].value;
                clearLayer();
                btMapLayer.removeAllFeatures();
                loadGroup(btSettings.CurrentGroup);
                saveSettings();
            });

            $('[id^="BTGroupsClose"]').on("click",function() {
                if (getObjectPropertyCount(btSettings.Groups) > 1) {
                    delete btSettings.Groups[this.id.replace('BTGroupsClose','')];
                    saveSettings();
                    LoadCustomGroups();
                } else {
                    alert("There must be at least one group");
                }
            });
        }

        function isChecked(checkboxId) {
            return $('#' + checkboxId).is(':checked');
        }

        function setChecked(checkboxId, checked) {
            $('#' + checkboxId).prop('checked', checked);
        }

        function getObjectPropertyCount(object){
            let count = 0;
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) {
                    count++;
                }
            }
            return count;
        }

        function convertCoords(settings) {
            // convert OL coordinates to GeoJSON standard
            const groups = settings.Groups;
            $.each(groups, (index, g) =>
                g.forEach(item => {
                    if (item.type === "rectangle") {
                        ['botLeft', 'topLeft', 'botRight', 'topRight'].forEach(corner => {
                            const pt = turf.point([item[corner].lon, item[corner].lat]);
                            item[corner] = turf.toWgs84(pt).geometry.coordinates;
                        });
                    } else { // circle
                        const cp = turf.point([item.centerPoint.lon, item.centerPoint.lat]);
                        item.centerPoint = turf.toWgs84(cp).geometry.coordinates;
                    }
                })
            );
        }

        async function LoadSettingsObj() {
            let loadedSettings;
            loadedSettings = JSON.parse(localStorage.getItem("WME_BeenThere")) ??
                             JSON.parse(localStorage.getItem("beenThere_Settings"));
            if (loadedSettings && !loadedSettings.hasOwnProperty("converted")) {
                convertCoords(loadedSettings);
            }

            const defaultSettings = {
                converted: true,
                layerHistory: [],
                LocLeft: "6px",
                LocTop: "280px",
                CP1: "#FDA400",
                CP2: "#FD0303",
                CP3: "#1303FD",
                CP4: "#00FD22",
                DrawShapeBorder: true,
                FillShape: false,
                NewBoxShortcut: null,
                NewUserRectShortcut: null,
                NewUserCircleShortcut: null,
                RemoveLastShapeShortcut: null,
                RedoLastShapeShortcut: null,
                RemoveAllShapesShortcut: null,
                SettingsLocTop: "40%",
                SettingsLocLeft: "50%",
                Groups: {"default": []},
                CurrentGroup: "default",
                layerVisible: true,
                lastSaved: 0
            };
            btSettings = $.extend({}, defaultSettings, loadedSettings);

            if (parseInt(btSettings.LocLeft.replace('px', '')) < 0) {
                btSettings.LocLeft = "6px";
            }
            if (parseInt(btSettings.LocTop.replace('px','')) < 0) {
                btSettings.LocTop = "280px";
            }
            ['NewBoxShortcut', 'NewUserRectShortcut', 'NewUserCircleShortcut',
             'RemoveLastShapeShortcut', 'RedoLastShapeShortcut', 'RemoveAllShapesShortcut'].forEach(
                shortcut => {
                    if (btSettings[shortcut] !== null) {
                        if (btSettings[shortcut] === "" || btSettings[shortcut] === "-1" || btSettings[shortcut].match(/0,-\d/) !== null) {
                            btSettings[shortcut] = null;
                        }
                    }
                }
            );

            currColor = btSettings.CP1;

            if (btSettings.layerHistory.length > 0) { //move our old layers into the default group
                btSettings.Groups.default = [...btSettings.layerHistory];
                btSettings.layerHistory = [];
                saveSettings();
            }
        }

        function saveSettings() {
            if (localStorage) {
                var localsettings = {
                    converted: true,
                    layerHistory: btSettings.layerHistory,
                    LocLeft: btSettings.LocLeft,
                    LocTop: btSettings.LocTop,
                    CP1: btSettings.CP1,
                    CP2: btSettings.CP2,
                    CP3: btSettings.CP3,
                    CP4: btSettings.CP4,
                    DrawShapeBorder: btSettings.DrawShapeBorder,
                    FillShape: btSettings.FillShape,
                    NewBoxShortcut: btSettings.NewBoxShortcut,
                    NewUserRectShortcut: btSettings.NewUserRectShortcut,
                    NewUserCircleShortcut: btSettings.NewUserCircleShortcut,
                    RemoveLastShapeShortcut: btSettings.RemoveLastShapeShortcut,
                    RedoLastShapeShortcut: btSettings.RedoLastShapeShortcut,
                    RemoveAllShapesShortcut: btSettings.RemoveAllShapesShortcut,
                    SettingsLocTop: btSettings.SettingsLocTop,
                    SettingsLocLeft: btSettings.SettingsLocLeft,
                    Groups: btSettings.Groups,
                    CurrentGroup: btSettings.CurrentGroup,
                    layerVisible: btSettings.layerVisible,
                    lastSaved: Date.now()
                };
                if (parseInt(localsettings.LocLeft.replace('px', '')) < 0) {
                    localsettings.LocLeft = "6px";
                }
                if (parseInt(localsettings.LocTop.replace('px','')) < 0) {
                    localsettings.LocTop = "280px";
                }

                WME.Shortcuts.getAllShortcuts().forEach(shortcut => {
                    const name = shortcut.shortcutId;
                    const keys = shortcut.shortcutKeys;
                    localsettings[name] = keys;
                });

                localStorage.setItem("WME_BeenThere", JSON.stringify(localsettings));
            }
        }

        function checkShortcutsChanged(){
            let triggerSave = false;
            WME.Shortcuts.getAllShortcuts().forEach(shortcut => {
                const name = shortcut.shortcutId;
                const keys = shortcut.shortcutKeys;
                if (btSettings[name] !== keys) {
                    btSettings[name] = keys;
                    triggerSave = true;
                }
            });
            if (triggerSave) {
                saveSettings();
            }
        }

        // Startup procedure

        WME.Events.once({ eventName: "wme-ready" }).then(async () => {

            await LoadSettingsObj();

            WME.Map.addLayer({layerName: btMapLayer,
                              styleContext: {
                                  getFillOpacity: () => (btSettings.FillShape ? 1 : 0),
                                  getObjColor: ({ feature, zoomLevel }) => feature.properties.color,
                                  getStrokeOpacity: () => (btSettings.DrawShapeBorder ? 1 : 0),
                              },
                              styleRules: [
                                  {
                                      style: {
                                          fillColor: "${getObjColor}",
                                          fillOpacity: "${getFillOpacity}",
                                          fontColor: "orange",
                                          fontOpacity: 1,
                                          fontSize: 14,
                                          fontWeight: "bold",
                                          label: "",
                                          labelOutlineColor: "black",
                                          labelOutlineWidth: 3,
                                          strokeColor: "${getObjColor}",
                                          strokeOpacity: "${getStrokeOpacity}",
                                          strokeWidth: 5,
                                      },
                                  },
                              ]
            });
            WME.Map.setLayerOpacity({layerName: btMapLayer, opacity:0.6});
            WME.Map.setLayerVisibility({layerName: btMapLayer, visibility: btSettings.layerVisible});

            WME.Map.addLayer({layerName: btDrawingLayer,
                              styleContext: {
                                  getCurrColor: () => currColor,
                                  getFill: () => (btSettings.FillShape),
                                  getFillOpacity: () => (btSettings.FillShape ? 1 : 0),
                                  getStrokeOpacity: () => (btSettings.DrawShapeBorder ? 1 : 0),
                              },
                              styleRules: [
                                  { style: {
                                          fill: "${getFill}",
                                          fillColor: "${getCurrColor}",
                                          fillOpacity: "${getFillOpacity}",
                                          fontColor: "orange",
                                          fontOpacity: 0.85,
                                          fontSize: 14,
                                          fontWeight: "bold",
                                          label: "",
                                          labelOutlineColor: "black",
                                          labelOutlineWidth: 3,
                                          strokeColor: "${getCurrColor}",
                                          strokeOpacity: "${getStrokeOpacity}",
                                          strokeWidth: 5,
                                      },
                                  },
                                  { predicate: props => (props.objectType === "pointer-rect"),
                                    style: {
                                          fill: "${getFill}",
                                          fillColor: "${getCurrColor}",
                                          fillOpacity: 0,
                                          fontColor: "orange",
                                          fontOpacity: 0.85,
                                          fontSize: 14,
                                          fontWeight: "bold",
                                          label: "",
                                          labelOutlineColor: "black",
                                          labelOutlineWidth: 3,
                                          pointRadius: 3,
                                          strokeColor: '#00ece3',
                                          strokeLinecap: 'round',
                                          strokeOpacity: "${getStrokeOpacity}",
                                          strokeWidth: 2,
                                      },
                                  },
                                  { predicate: props => (props.objectType === "pointer-circle"),
                                    style: {
                                          fill: "${getFill}",
                                          fillColor: "${getCurrColor}",
                                          fillOpacity: 1,
                                          fontColor: "orange",
                                          fontOpacity: 0.85,
                                          fontSize: 14,
                                          fontWeight: "bold",
                                          label: "",
                                          labelOutlineColor: "black",
                                          labelOutlineWidth: 3,
                                          pointRadius: 3,
                                          strokeColor: '#00ece3',
                                          strokeLinecap: 'round',
                                          strokeOpacity: "${getStrokeOpacity}",
                                          strokeWidth: 2,
                                      },
                                  },
                              ]
            });
            WME.Map.setLayerOpacity({layerName: btDrawingLayer, opacity: 0.6});
            WME.Map.setLayerVisibility({layerName: btDrawingLayer, visibility: btSettings.layerVisible});

            WME.LayerSwitcher.addLayerCheckbox({name: "Been There"});
            WME.LayerSwitcher.setLayerCheckboxChecked({name: "Been There", isChecked: btSettings.layerVisible});
            WME.Events.on({ eventName: 'wme-layer-checkbox-toggled', eventHandler: LayerToggled });

            //append our css to the head
            let g = ['.beenThereButtons {font-size:26px; color:#59899e; cursor:pointer;}',
                     '.flex-container {display: -webkit-flex; display: flex; background-color:black;}',
                     '.btColorPicker {float:right;width:15px; height:15px;border:2px solid black;}'].join(' ');
            $("head").append($('<style type="text/css">' + g + '</style>'));

            //add controls to the map
            const $section = $("<div>", {style:"padding:8px 16px", id:"WMEBeenThere"});
            $section.html([
                '<div id="beenThere" class="flex-container" style="width:65px; position: absolute;top:' + btSettings.LocTop + '; left: ' + btSettings.LocLeft + '; z-index: 1040 !important; border-radius: 5px; padding: 4px; background-color: #000000;">',
                '<div class="flex-container" style="width:32px; flex-wrap:wrap;" >',//left side container
                '<div id="NewBox" class="waze-icon-plus_neg beenThereButtons" style="margin-top:-10px; display:block; float:left;" title="Draw a box around the visible area"></div>',
                '<div id="UserRect" class="fa fa-pencil-square-o" style="display:block; float:left; padding-top:4px; margin-left:3px; color:#59899e; cursor:pointer; font-size:25px;"></div>',
                '<div id="UserCirc" class="fa-stack" style="margin-top:10px; display:block; float:left; color:#59899e; cursor:pointer;"><span class="fa fa-circle-thin fa-stack-2x"></span><span class="fa fa-pencil" style="font-size:20px; margin-left:8px;"></span></div>',
                '<div id="RemoveLastBox" class="waze-icon-undo beenThereButtons" style="display:block;padding-top:4px;margin-bottom:-10px;" title="Remove last shape"></div>',
                '<div id="Redo" class="waze-icon-redo beenThereButtons" style="display:block;padding-top:4px;margin-bottom:-10px;" title="Redo last shape"></div>',
                '<div id="TrashBox" class="waze-icon-trash beenThereButtons" style="padding-top:4px; margin-bottom:-5px; display:block;" title="Remove all shapes">',
                '<span id="rectCount" style="position:absolute; top:160px; right:16px;font-size:12px;">0</span></div>',
                '<div id="Settings" class="fa fa-cog" style="display:block; float:left; padding-top:4px; margin-left:3px; color:#59899e; cursor:pointer; font-size:20px;"></div>',
                '</div>',//close left side container
                '<div class="flex-container" style="width:30px; height:90px; flex-wrap:wrap; justify-content:flex-start;">', //right side container
                '<input type="radio" name="currColor" value="CP1" style="width:10px;" checked="checked">',
                '<button class="btColorPicker" style="background-color:' + btSettings.CP1 + ';" id="btcolorPicker1"></button>', // add background-color to style
                '<input type="radio" name="currColor" value="CP2" style="width:10px;">',
                '<button class="btColorPicker" style="background-color:' + btSettings.CP2 + ';" id="btcolorPicker2"></button>',
                '<input type="radio" name="currColor" value="CP3" style="width:10px;">',
                '<button class="btColorPicker" style="background-color:' + btSettings.CP3 + ';" id="btcolorPicker3"></button>',
                '<input type="radio" name="currColor" value="CP4" style="width:10px;">',
                '<button class="btColorPicker" style="background-color:' + btSettings.CP4 + ';" id="btcolorPicker4"></button>',
                '</div>', //close right side container
                '</div>'
            ].join(' '));

            $("#WazeMap").append($section.html());

            BuildSettingsInterface();

            //set up listeners
            $("#NewBox").on("click", NewBox);
            $('#UserRect').on("click", NewUserRect);
            $('#UserCirc').on("click", NewUserCircle);
            $("#RemoveLastBox").on("click", RemoveLastBox);
            $('#Redo').on("click", RedoLastBox);
            $("#TrashBox").on("click", RemoveAllBoxes);
            $('#Settings').on("click", function() {
                $('#BTSettings')[0].innerHTML = JSON.stringify(btSettings);
                setChecked('chkBTShapeBorder', btSettings.DrawShapeBorder);
                setChecked('chkBTShapeFill', btSettings.FillShape);
                $('#BeenThereSettings').css({'visibility':'visible'});
            });
            //register shortcuts
            WME.Shortcuts.createShortcut({shortcutId:'NewBoxShortcut', description:'Draw a box around the visible area', shortcutKeys: btSettings.NewBoxShortcut, callback: NewBox});
            WME.Shortcuts.createShortcut({shortcutId:'NewUserRectShortcut', description:'Draw a rectangle', shortcutKeys: btSettings.NewUserRectShortcut, callback: NewUserRect});
            WME.Shortcuts.createShortcut({shortcutId:'NewUserCircleShortcut', description:'Draw a circle', shortcutKeys: btSettings.NewUserCircleShortcut, callback: NewUserCircle});
            WME.Shortcuts.createShortcut({shortcutId:'RemoveLastShapeShortcut', description:'Remove last shape', shortcutKeys: btSettings.RemoveLastShapeShortcut, callback: RemoveLastBox});
            WME.Shortcuts.createShortcut({shortcutId:'RedoLastShapeShortcut', description:'Redo last shape', shortcutKeys: btSettings.RedoLastShapeShortcut, callback: RedoLastBox});
            WME.Shortcuts.createShortcut({shortcutId:'RemoveAllShapesShortcut', description:'Remove all shapes', shortcutKeys: btSettings.RemoveAllShapesShortcut, callback: RemoveAllBoxes});

            //necessary to catch changes to the keyboard shortcuts
            window.onbeforeunload = function() {
                checkShortcutsChanged();
            };

            $('[name="currColor"]').on("change", function() {
                currColor = btSettings[this.value];
            });

            if ($.ui){
                $('#beenThere').draggable({
                    stop: function(event, ui) {
                        btSettings.LocLeft = $('#beenThere').css('left');
                        btSettings.LocTop = $('#beenThere').css('top');
                        saveSettings();
                    }
                });

                $('#BeenThereSettings').draggable({
                    stop: function(event, ui) {
                        btSettings.SettingsLocLeft = $('#BeenThereSettings').css('left');
                        btSettings.SettingsLocTop = $('#BeenThereSettings').css('top');
                        saveSettings();
                    }
                });
            }

            LoadSettings();

            console.log("WME BeenThere: loaded!");
        });
    });
})();