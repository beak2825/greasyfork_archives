// ==UserScript==
// @name         WME RA Util
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2025.12.30.01
// @description  Providing basic utility for RA adjustment without the need to delete & recreate
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js
// @connect      greasyfork.org
// @author       JustinS83
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      GPLv3
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/23616/WME%20RA%20Util.user.js
// @updateURL https://update.greasyfork.org/scripts/23616/WME%20RA%20Util.meta.js
// ==/UserScript==

/* global getWmeSdk */
/* global WazeWrap */
/* global turf */
/* global $ */
/* global jQuery */
/* global I18n */
/* eslint curly: ["warn", "multi-or-nest"] */

(function () {
    const SCRIPT_VERSION = GM_info.script.version.toString();
    const SCRIPT_NAME = GM_info.script.name;
    const DOWNLOAD_URL = GM_info.scriptUpdateURL;

    const DIRECTION = {
        NORTH: 0,
        EAST: 90,
        SOUTH: 180,
        WEST: 270
    };
    const COLOR = {
        NORMAL_LINES: '#0040FF',
        NON_NORMAL_LINES: '#002080',
        NORMAL_ANGLES: '#004000',
        NON_NORMAL_ANGLES: '#FF0000',
        AVOID_ANGLES: '#FFC000'
    };

    let sdk;
    let roundaboutPopup = null;
    let _settings;

    const updateMessage = 'Conversion to WME SDK. Now uses turf for calculations and geometry.  Thank you to lacmac for undertaking this conversion, and the others that have reviewed and added their insight.';

    function waitUntil(callback, interval = 200, timeout = 60000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                if (callback()) {
                    clearInterval(timer);
                    resolve();
                } else if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject(new Error(`${SCRIPT_NAME} timeout waiting for object`));
                }
            }, interval);
        });
    }

    async function bootstrap() {
        await unsafeWindow.SDK_INITIALIZED;

        sdk = getWmeSdk({ scriptId: 'wme-ra-util', scriptName: 'WME RA Util' });
        await sdk.Events.once({ eventName: 'wme-ready' });

        await waitUntil(() => WazeWrap?.Ready);
        
        loadScriptUpdateMonitor();
        init();
    }
    bootstrap();

    function loadScriptUpdateMonitor() {
        try {
            const updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(SCRIPT_NAME, SCRIPT_VERSION, DOWNLOAD_URL, GM_xmlhttpRequest);
            updateMonitor.start();
        } catch (ex) {
            // Report, but don't stop if ScriptUpdateMonitor fails.
            console.error(`${SCRIPT_NAME}:`, ex);
        }
    }

    function init() {
        console.log('RA UTIL', GM_info.script);
        injectCss();

        sdk.Map.addLayer({
            layerName: '__DrawRoundaboutAngles',
            styleRules: styleConfig.styleRules,
            styleContext: styleConfig.styleContext
        });
        sdk.Map.setLayerVisibility({ layerName: '__DrawRoundaboutAngles', visibility: true });

        roundaboutPopup = document.createElement('div');
        roundaboutPopup.id = 'RAUtilWindow';
        roundaboutPopup.style.position = 'fixed';
        roundaboutPopup.style.visibility = 'hidden';
        roundaboutPopup.style.top = '15%';
        roundaboutPopup.style.left = '25%';
        roundaboutPopup.style.width = '510px';
        roundaboutPopup.style.zIndex = 100;
        roundaboutPopup.style.backgroundColor = '#FFFFFE';
        roundaboutPopup.style.borderWidth = '0px';
        roundaboutPopup.style.borderStyle = 'solid';
        roundaboutPopup.style.borderRadius = '10px';
        roundaboutPopup.style.boxShadow = '5px 5px 10px Silver';
        roundaboutPopup.style.padding = '4px';

        let roundaboutPopupHTML = '<div id="header" style="padding: 4px; background-color:#92C3D3; border-radius: 5px;-moz-border-radius: 5px;-webkit-border-radius: 5px; color: white; font-weight: bold; text-align:center; letter-spacing: 1px;text-shadow: black 0.1em 0.1em 0.2em;"><img src="https://storage.googleapis.com/wazeopedia-files/1/1e/RA_Util.png" style="float:left"></img> Roundabout Utility <a data-toggle="collapse" href="#divWrappers" id="collapserLink" style="float:right"><span id="collapser" style="cursor:pointer;padding:2px;color:white;" class="fa fa-caret-square-o-up"></a></span></div>';
        // start collapse // I put it al the beginning
        roundaboutPopupHTML += '<div id="divWrappers" class="collapse in">';
        //***************** Round About Angles **************************
        roundaboutPopupHTML += '<p style="margin: 10px 0px 0px 20px;"><input type="checkbox" id="chkRARoundaboutAngles">&nbsp;Enable Roundabout Angles</p>';
        //***************** Shift Amount **************************
        // Define BOX
        roundaboutPopupHTML += '<div id="contentShift" style="text-align:center;float:left; width: 120px;max-width: 24%;height: 170px;margin: 1em 5px 0px 0px;opacity:1;border-radius: 2px;-moz-border-radius: 2px;-webkit-border-radius: 4px;border-width:1px;border-style:solid;border-color:#92C3D3;padding:2px;}">';
        roundaboutPopupHTML += '<b>Shift amount</b></br><input type="text" name="shiftAmount" id="shiftAmount" size="1" style="float: left; text-align: center;font: inherit; line-height: normal; width: 30px; height: 20px; margin: 5px 4px; box-sizing: border-box; display: block; padding-left: 0; border-bottom-color: rgba(black,.3); background: transparent; outline: none; color: black;" value="1"/> <div style="margin: 5px 4px;">Meter(s)';
        // Shift amount controls
        roundaboutPopupHTML += '<div id="controls" style="text-align:center; padding:06px 4px;width=100px; height=100px;margin: 5px 0px;border-style:solid; border-width: 2px;border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1);-moz-box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1);-webkit-box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1); background:#92C3D3;align:center;">';
        //Single Shift Up Button
        roundaboutPopupHTML += '<span id="RAShiftUpBtn" style="cursor:pointer;font-size:14px;">';
        roundaboutPopupHTML += '<i class="fa fa-angle-double-up fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; vertical-align: top;"> </i>';
        roundaboutPopupHTML += '<span id="UpBtnCaption" style="font-weight: bold;"></span>';
        roundaboutPopupHTML += '</span><br>';
        //Single Shift Left Button
        roundaboutPopupHTML += '<span id="RAShiftLeftBtn" style="cursor:pointer;font-size:14px;margin-left:-40px;">';
        roundaboutPopupHTML += '<i class="fa fa-angle-double-left fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; vertical-align: middle"> </i>';
        roundaboutPopupHTML += '<span id="LeftBtnCaption" style="font-weight: bold;"></span>';
        roundaboutPopupHTML += '</span>';
        //Single Shift Right Button
        roundaboutPopupHTML += '<span id="RAShiftRightBtn" style="float: right;cursor:pointer;font-size:14px;margin-right:5px;">';
        roundaboutPopupHTML += '<i class="fa fa-angle-double-right fa-2x" style="color: white;text-shadow: black 0.1em 0.1em 0.2em;  vertical-align: middle"> </i>';
        roundaboutPopupHTML += '<span id="RightBtnCaption" style="font-weight: bold;"></span>';
        roundaboutPopupHTML += '</span><br>';
        //Single Shift Down Button
        roundaboutPopupHTML += '<span id="RAShiftDownBtn" style="cursor:pointer;font-size:14px;margin-top:0px;">';
        roundaboutPopupHTML += '<i class="fa fa-angle-double-down fa-2x" style="color: white;text-shadow: black 0.1em 0.1em 0.2em;  vertical-align: middle"> </i>';
        roundaboutPopupHTML += '<span id="DownBtnCaption" style="font-weight: bold;"></span>';
        roundaboutPopupHTML += '</span>';
        roundaboutPopupHTML += '</div></div></div>';
        //***************** Rotation **************************
        // Define BOX
        roundaboutPopupHTML += '<div id="contentRotate" style="float:left; text-align: center;width: 120px;max-width: 24%;max-height:145px;margin: 1em auto;opacity:1;border-radius: 2px;-moz-border-radius: 2px;-webkit-border-radius: 4px;border-width:1px;border-style:solid;border-color:#92C3D3;padding:2px;  display:inline-block; border-style:solid; border-width:1px; height:152px;  margin-right:5px;">';
        roundaboutPopupHTML += '<b>Rotation amount</b></br><input type="text" name="rotationAmount" id="rotationAmount" size="1" style="float: left; text-align: center;font: inherit; line-height: normal; width: 30px; height: 20px; margin: 5px 4px; box-sizing: border-box; display: block; padding-left: 0; border-bottom-color: rgba(black,.3); background: transparent; outline: none; color: black;" value="1"/> <div style="margin: 5px 4px;">Degree(s)';
        // Rotation controls
        roundaboutPopupHTML += '<div id="rotationControls" style="padding: 6px 4px;width=100px; margin: 20px 0px 50px 0px;align:center;">';
        // Rotate Button on the Left
        roundaboutPopupHTML += '<span id="RARotateLeftBtn" class="btnRotate" style="float: left;">';
        roundaboutPopupHTML += '<i class="fa fa-undo fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; padding:2px;"> </i>';
        roundaboutPopupHTML += '<span id="RotateLeftBtnCaption" style="font-weight: bold;"></span>';
        roundaboutPopupHTML += '</span>';
        // Rotate button on the Right
        roundaboutPopupHTML += '<span id="RARotateRightBtn" class="btnRotate" style="float: right;">';
        roundaboutPopupHTML += '<i class="fa fa-repeat fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; padding:2px;"> </i>';
        roundaboutPopupHTML += '<span id="RotateRightBtnCaption" style="font-weight: bold;"></span>';
        roundaboutPopupHTML += '</div></div></div>';
        //********************* Diameter change ******************
        // Define BOX
        roundaboutPopupHTML += '<div id="diameterChange" style="float:left; text-align: center;width: 120px;max-width: 24%;max-height:145px;margin: 1em auto;opacity:1;border-radius: 2px;-moz-border-radius: 2px;-webkit-border-radius: 4px;border-width:1px;border-style:solid;border-color:#92C3D3;padding:2px;  display:inline-block; border-style:solid; border-width:1px; height:152px;  margin-right:5px;">';
        roundaboutPopupHTML += '<b>Change diameter</b></br></br>';
        // Diameter Change controls
        roundaboutPopupHTML += '<div id="DiameterChangeControls" style="padding: 6px 4px;width=100px; margin: 5px 7px 50px 7px;align:center;">';
        // Decrease Button
        roundaboutPopupHTML += '<span id="diameterChangeDecreaseBtn" style="float: left; width=45px; height=45px; background-color:#92C3D3; cursor:pointer; padding: 5px; font-size:14px; border:thin outset black; border-style:solid; border-width: 1px;border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);-moz-box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);-webkit-box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);">';
        roundaboutPopupHTML += '<i class="fa fa-compress fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; padding:2px;;"> </i>';
        roundaboutPopupHTML += '<span id="diameterChangeDecreaseCaption" style="font-weight: bold;"></span>';
        roundaboutPopupHTML += '</span>';
        // Increase Button
        roundaboutPopupHTML += '<span id="diameterChangeIncreaseBtn" style="float: right; width=45px; height=45px; background-color:#92C3D3; cursor:pointer; padding: 5px; font-size:14px; border:thin outset black; border-style:solid; border-width: 1px;border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);-moz-box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);-webkit-box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);">';
        roundaboutPopupHTML += '<i class="fa fa-arrows-alt fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; padding:2px;"> </i>';
        roundaboutPopupHTML += '<span id="diameterChangeIncreaseCaption" style="font-weight: bold;"></span>';
        roundaboutPopupHTML += '</span>';
        roundaboutPopupHTML += '</div></div>';
        //***************** Bump nodes **********************
        // Define BOX
        roundaboutPopupHTML += '<div id="bumpNodes" style="float:left; text-align: center;width: 120px;max-width: 24%;max-height:145px;margin: 1em auto 0px auto;opacity:1;border-radius: 2px;-moz-border-radius: 2px;-webkit-border-radius: 4px;border-width:1px;border-style:solid;border-color:#92C3D3;padding:2px;  display:inline-block; border-style:solid; border-width:1px; height:152px;  margin-right:5px;">';
        roundaboutPopupHTML += '<b>Move nodes</b></br>';
        // Move Nodes controls
        roundaboutPopupHTML += '<div id="MoveNodesControls" style="padding: 2px;">';
        // Button A
        roundaboutPopupHTML += '<div style="text-align:center; font-size:18px;">A Node';
        // Move node IN
        roundaboutPopupHTML += '<p><span id="btnMoveANodeIn" class="btnMoveNode" style="color: white; font-size: 0.875em; text-shadow: black 0.1em 0.1em 0.2em; padding:3px 15px 3px 15px; margin:3px; user-select:none;">in</span>';
        // Move node OUT
        roundaboutPopupHTML += '<span id="btnMoveANodeOut" class="btnMoveNode" class="btnMoveNode" style="color: white; font-size: 0.875em; text-shadow: black 0.1em 0.1em 0.2em; padding:3px 10px 3px 10px; margin:3px; user-select:none;">out</span>';
        roundaboutPopupHTML += '</div>';
        // Button B
        roundaboutPopupHTML += '<div style="text-align:center; font-size:18px;">B Node';
        // Move node IN
        roundaboutPopupHTML += '<p><span id="btnMoveBNodeIn" class="btnMoveNode" style="color: white; font-size: 0.875em; text-shadow: black 0.1em 0.1em 0.2em; padding:3px 15px 3px 15px; margin:3px; user-select:none;">in</span>';
        // Move node OUT
        roundaboutPopupHTML += '<span id="btnMoveBNodeOut" class="btnMoveNode" class="btnMoveNode" style="color: white; font-size: 0.875em; text-shadow: black 0.1em 0.1em 0.2em; padding:3px 10px 3px 10px; margin:3px; user-select:none;">out</span>';
        roundaboutPopupHTML += '</div>';
        roundaboutPopupHTML += '</div></div></div>';

        roundaboutPopup.innerHTML = roundaboutPopupHTML;
        document.body.appendChild(roundaboutPopup);

        $('#RAShiftLeftBtn').click(handleShiftLeftClick);
        $('#RAShiftRightBtn').click(handleShiftRightClick);
        $('#RAShiftUpBtn').click(handleShiftUpClick);
        $('#RAShiftDownBtn').click(handleShiftDownClick);

        $('#RARotateLeftBtn').click(handleRotateLeftClick);
        $('#RARotateRightBtn').click(handleRotateRightClick);

        $('#diameterChangeDecreaseBtn').click(handleDiameterDecreaseClick);
        $('#diameterChangeIncreaseBtn').click(handleDiameterIncreaseClick);

        $('#btnMoveANodeIn').click(handleNodeAInClick);
        $('#btnMoveANodeOut').click(handleNodeAOutClick);
        $('#btnMoveBNodeIn').click(handleNodeBInClick);
        $('#btnMoveBNodeOut').click(handleNodeBOutClick);

        $('#shiftAmount').keypress(function (event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) event.preventDefault();
        });

        $('#rotationAmount').keypress(function (event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) event.preventDefault();
        });

        $('#collapserLink').click(function () {
            $('#divWrappers').slideToggle('fast');
            if ($('#collapser').attr('class') == 'fa fa-caret-square-o-down') {
                $('#collapser').removeClass('fa-caret-square-o-down');
                $('#collapser').addClass('fa-caret-square-o-up');
            } else {
                $('#collapser').removeClass('fa-caret-square-o-up');
                $('#collapser').addClass('fa-caret-square-o-down');
            }
            saveSettingsToStorage();
        });

        const loadedSettings = JSON.parse(localStorage.getItem('WME_RAUtil'));
        const defaultSettings = {
            divTop: '15%',
            divLeft: '25%',
            Expanded: true,
            RoundaboutAngles: true
        };
        _settings = loadedSettings ?? defaultSettings;

        $('#RAUtilWindow').css('left', _settings.divLeft);
        $('#RAUtilWindow').css('top', _settings.divTop);
        $('#chkRARoundaboutAngles').prop('checked', _settings.RoundaboutAngles);
        $('#chkRARoundaboutAngles').prop('checked', _settings.RoundaboutAngles);

        if (!_settings.Expanded) {
            $('#divWrappers').hide();
            $('#collapser').removeClass('fa-caret-square-o-up');
            $('#collapser').addClass('fa-caret-square-o-down');
        }

        sdk.Events.on({ eventName: 'wme-selection-changed', eventHandler: checkDisplayTool });
        $('#chkRARoundaboutAngles').click(function () {
            saveSettingsToStorage();

            if ($('#chkRARoundaboutAngles').is(':checked')) {
                sdk.Events.on({ eventName: 'wme-map-zoom-changed', eventHandler: drawRoundaboutAngles });
                sdk.Events.on({ eventName: 'wme-map-move-end', eventHandler: drawRoundaboutAngles });
                sdk.Map.setLayerVisibility({ layerName: '__DrawRoundaboutAngles', visibility: true });
                drawRoundaboutAngles();
            } else {
                sdk.Events.off({ eventName: 'wme-map-zoom-changed', eventHandler: drawRoundaboutAngles });
                sdk.Events.off({ eventName: 'wme-map-move-end', eventHandler: drawRoundaboutAngles });
                sdk.Map.setLayerVisibility({ layerName: '__DrawRoundaboutAngles', visibility: false });
            }
        });

        if (_settings.RoundaboutAngles) {
            sdk.Events.on({ eventName: 'wme-map-zoom-changed', eventHandler: drawRoundaboutAngles });
            sdk.Events.on({ eventName: 'wme-map-move-end', eventHandler: drawRoundaboutAngles });
            drawRoundaboutAngles();
        }

        WazeWrap.Interface.ShowScriptUpdate('WME RA Util', GM_info.script.version, updateMessage, 'https://greasyfork.org/en/scripts/23616-wme-ra-util', 'https://www.waze.com/forum/viewtopic.php?f=819&t=211079');
    }

    function saveSettingsToStorage() {
        if (localStorage) {
            _settings.divLeft = $('#RAUtilWindow').css('left');
            _settings.divTop = $('#RAUtilWindow').css('top');
            _settings.Expanded = $('#collapser').attr('class').indexOf('fa-caret-square-o-up') > -1;
            _settings.RoundaboutAngles = $('#chkRARoundaboutAngles').is(':checked');
            localStorage.setItem('WME_RAUtil', JSON.stringify(_settings));
        }
    }

    function checkDisplayTool() {
        if (sdk.Editing.getSelection()?.objectType === 'segment') {
            if (!allRoundaboutSegmentsSelected()) {
                $('#RAUtilWindow').css({ visibility: 'hidden' });
            } else {
                $('#RAUtilWindow').css({ visibility: 'visible' });
                if (typeof jQuery.ui !== 'undefined') {
                    $('#RAUtilWindow').draggable({
                        //Gotta nuke the height setting the dragging inserts otherwise the panel cannot collapse
                        stop: () => {
                            $('#RAUtilWindow').css('height', '');
                            saveSettingsToStorage();
                        }
                    });
                }
                const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
                const junction = sdk.DataModel.Junctions.getById({ junctionId: segment.junctionId });
                const connectedSegments = getSegmentsFromIds(junction.segmentIds);
                checkAndDisplaySegmentEditability(connectedSegments);
            }
        } else {
            $('#RAUtilWindow').css({ visibility: 'hidden' });
            if (typeof jQuery.ui !== 'undefined') {
                $('#RAUtilWindow').draggable({
                    stop: () => {
                        $('#RAUtilWindow').css('height', '');
                        saveSettingsToStorage();
                    }
                });
            }
        }
    }

    function getSegmentsFromIds(segmentIds) {
        return segmentIds.map((segmentId) => sdk.DataModel.Segments.getById({ segmentId }));
    }

    function checkAndDisplaySegmentEditability(segments) {
        const errorElement = $('#RAEditable');
        let allEditable = true;

        for (let segment of segments) {
            const fromNode = sdk.DataModel.Nodes.getById({ nodeId: segment.fromNodeId });
            const toNode = sdk.DataModel.Nodes.getById({ nodeId: segment.toNodeId });
            const userRank = sdk.State.getUserInfo().rank;

            if (segment) {
                if (toNode) {
                    let toConnectedSegments = getSegmentsFromIds(toNode.connectedSegmentIds);
                    for (let toConnectedSegment of toConnectedSegments) {
                        if ((toConnectedSegment && toConnectedSegment.hasClosures) || toConnectedSegment.lockRank > userRank) {
                            allEditable = false;
                        }
                    }
                }

                if (fromNode) {
                    let fromConnectedSegments = getSegmentsFromIds(fromNode.connectedSegmentIds);
                    for (let fromConnectedSegment of fromConnectedSegments) {
                        if ((fromConnectedSegment && fromConnectedSegment.hasClosures) || fromConnectedSegment.lockRank > userRank) {
                            allEditable = false;
                        }
                    }
                }
            }
        }

        if (allEditable) {
            errorElement.remove();
        } else {
            if (errorElement.length === 0) {
                errorElement = $('<div>', { id: 'RAEditable', style: 'color:red' });
                errorElement.text('One or more segments are locked above your rank or have a closure.');
                $('#RAUtilWindow').append(errorElement);
            }
        }
        return allEditable;
    }

    function allRoundaboutSegmentsSelected() {
        for (const segmentId of sdk.Editing.getSelection().ids) {
            if (segmentId < 0 || !sdk.DataModel.Segments.getById({ segmentId: segmentId }).junctionId) {
                return false;
            }
        }
        return true;
    }

    function handleShiftUpClick(e) {
        e.stopPropagation();

        const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
        shiftRoundaboutLat(segment, $('#shiftAmount').val());
    }

    function handleShiftDownClick(e) {
        e.stopPropagation();
        const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
        shiftRoundaboutLat(segment, -$('#shiftAmount').val());
    }

    function shiftRoundaboutLat(segment, offset) {
        const segmentIds = sdk.DataModel.Junctions.getById({ junctionId: segment.junctionId }).segmentIds;
        const segments = getSegmentsFromIds(segmentIds);

        if (checkAndDisplaySegmentEditability(segments)) {
            for (const segmentId of segmentIds) {
                // Fetch new segment data, as we can be changing other segments by moving nodes
                const segment = sdk.DataModel.Segments.getById({ segmentId });
                // Move all segment points
                let newGeometry = structuredClone(segment.geometry);
                const originalLength = segment.geometry.coordinates.length;
                for (let i = 1; i < originalLength - 1; i++) {
                    const bearing = offset > 0 ? DIRECTION.NORTH : DIRECTION.SOUTH;
                    const distance = Math.abs(offset);
                    const currentPoint = segment.geometry.coordinates[i];
                    const newPoint = turf.destination(currentPoint, distance, bearing, { units: 'meters' });
                    newGeometry.coordinates[i] = newPoint.geometry.coordinates;
                }
                sdk.DataModel.Segments.updateSegment({ segmentId: segment.id, geometry: newGeometry });

                //Move node
                const nodeId = segment.isAtoB ? segment.toNodeId : segment.fromNodeId;
                const node = sdk.DataModel.Nodes.getById({ nodeId });
                let newNodeGeometry = structuredClone(node.geometry);

                const nodeBearing = offset > 0 ? DIRECTION.NORTH : DIRECTION.SOUTH;
                const nodeDistance = Math.abs(offset);
                const currentNodePoint = node.geometry.coordinates;
                const newNodePoint = turf.destination(currentNodePoint, nodeDistance, nodeBearing, { units: 'meters' });
                newNodeGeometry.coordinates = newNodePoint.geometry.coordinates;

                sdk.DataModel.Nodes.moveNode({ id: node.id, geometry: newNodeGeometry });
            }
        }
    }

    function handleShiftLeftClick(e) {
        e.stopPropagation();
        const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
        shiftRoundaboutLon(segment, -$('#shiftAmount').val());
    }

    function handleShiftRightClick(e) {
        e.stopPropagation();
        const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
        shiftRoundaboutLon(segment, $('#shiftAmount').val());
    }

    function shiftRoundaboutLon(segment, longOffset) {
        const segmentIds = sdk.DataModel.Junctions.getById({ junctionId: segment.junctionId }).segmentIds;
        const segments = getSegmentsFromIds(segmentIds);

        if (checkAndDisplaySegmentEditability(segments)) {
            for (const segmentId of segmentIds) {
                // Fetch new segment data, as we can be changing other segments by moving nodes
                const segment = sdk.DataModel.Segments.getById({ segmentId });
                // Move segment
                let newGeometry = structuredClone(segment.geometry);
                const originalLength = segment.geometry.coordinates.length;
                for (let i = 1; i < originalLength - 1; i++) {
                    const bearing = longOffset > 0 ? DIRECTION.EAST : DIRECTION.WEST;
                    const distance = Math.abs(longOffset);
                    const currentPoint = segment.geometry.coordinates[i];
                    const newPoint = turf.destination(currentPoint, distance, bearing, { units: 'meters' });
                    newGeometry.coordinates[i] = newPoint.geometry.coordinates;
                }
                sdk.DataModel.Segments.updateSegment({ segmentId: segment.id, geometry: newGeometry });

                // Move node
                const nodeId = segment.isAtoB ? segment.toNodeId : segment.fromNodeId;
                const node = sdk.DataModel.Nodes.getById({ nodeId });
                let newNodeGeometry = structuredClone(node.geometry);

                const nodeBearing = longOffset > 0 ? DIRECTION.EAST : DIRECTION.WEST;
                const nodeDistance = Math.abs(longOffset);
                const currentNodePoint = node.geometry.coordinates;
                const newNodePoint = turf.destination(currentNodePoint, nodeDistance, nodeBearing, { units: 'meters' });
                newNodeGeometry.coordinates = newNodePoint.geometry.coordinates;

                sdk.DataModel.Nodes.moveNode({ id: node.id, geometry: newNodeGeometry });
            }
        }
    }

    function handleRotateLeftClick(e) {
        e.stopPropagation();
        const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
        rotateRoundabout(segment, $('#rotationAmount').val());
    }

    function handleRotateRightClick(e) {
        e.stopPropagation();
        const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
        rotateRoundabout(segment, -$('#rotationAmount').val());
    }

    function rotateRoundabout(segment, angle) {
        const junction = sdk.DataModel.Junctions.getById({ junctionId: segment.junctionId });
        const segmentIds = junction.segmentIds;
        const centerCoordinates = junction.geometry.coordinates;

        let segments = getSegmentsFromIds(segmentIds);
        if (checkAndDisplaySegmentEditability(segments)) {
            for (const segmentId of segmentIds) {
                // Fetch new segment data, as we can be changing other segments by moving nodes
                const segment = sdk.DataModel.Segments.getById({ segmentId });
                // Rotate segment
                let newGeometry = structuredClone(segment.geometry);
                const originalLength = segment.geometry.coordinates.length;
                for (let i = 1; i < originalLength - 1; i++) {
                    const currentPoint = segment.geometry.coordinates[i];
                    const rotatedPoint = rotatePointAroundCenter(currentPoint, centerCoordinates, angle);
                    newGeometry.coordinates[i] = rotatedPoint.geometry.coordinates;
                }
                sdk.DataModel.Segments.updateSegment({ segmentId: segment.id, geometry: newGeometry });

                // Rotate nodes
                const nodeId = segment.isAtoB ? segment.toNodeId : segment.fromNodeId;
                const node = sdk.DataModel.Nodes.getById({ nodeId });
                let newNodeGeometry = structuredClone(node.geometry);
                const currentNodePoint = node.geometry.coordinates;
                const rotatedNodePoint = rotatePointAroundCenter(currentNodePoint, centerCoordinates, angle);
                newNodeGeometry.coordinates = rotatedNodePoint.geometry.coordinates;
                sdk.DataModel.Nodes.moveNode({ id: node.id, geometry: newNodeGeometry });
            }

            if (_settings.RoundaboutAngles) {
                drawRoundaboutAngles();
            }
        }
    }

    function rotatePointAroundCenter(point, center, angleDegrees) {
        const distance = turf.distance(center, point, { units: 'meters' });
        const currentBearing = turf.bearing(center, point);
        const newBearing = currentBearing - angleDegrees;

        return turf.destination(center, distance, newBearing, { units: 'meters' });
    }

    function handleDiameterDecreaseClick(e) {
        e.stopPropagation();
        const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
        changeRoundaboutDiameter(segment, -1);
    }

    function handleDiameterIncreaseClick(e) {
        e.stopPropagation();
        const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
        changeRoundaboutDiameter(segment, 1);
    }

    function changeRoundaboutDiameter(segment, amount) {
        const junction = sdk.DataModel.Junctions.getById({ junctionId: segment.junctionId });
        const segmentIds = junction.segmentIds;
        const centerCoordinates = junction.geometry.coordinates;

        let segments = getSegmentsFromIds(segmentIds);
        if (checkAndDisplaySegmentEditability(segments)) {
            for (const segmentId of segmentIds) {
                // Fetch new segment data, as we can be changing other segments by moving nodes
                const segment = sdk.DataModel.Segments.getById({ segmentId });
                // Modify segment
                let newGeometry = structuredClone(segment.geometry);
                const originalLength = segment.geometry.coordinates.length;
                for (let i = 1; i < originalLength - 1; i++) {
                    const currentPoint = segment.geometry.coordinates[i];
                    const currentDistance = turf.distance(centerCoordinates, currentPoint, { units: 'meters' });
                    const newDistance = currentDistance + amount;
                    let bearing = turf.bearing(centerCoordinates, currentPoint);
                    let newPoint = turf.destination(centerCoordinates, newDistance, bearing, { units: 'meters' });
                    newGeometry.coordinates[i] = newPoint.geometry.coordinates;
                }
                sdk.DataModel.Segments.updateSegment({ segmentId: segment.id, geometry: newGeometry });

                // Move node
                const nodeId = segment.isAtoB ? segment.toNodeId : segment.fromNodeId;
                const node = sdk.DataModel.Nodes.getById({ nodeId });
                let newNodeGeometry = structuredClone(node.geometry);
                const currentNodeDistance = turf.distance(centerCoordinates, newNodeGeometry.coordinates, { units: 'meters' });
                const newNodeDistance = currentNodeDistance + amount;
                const nodeBearing = turf.bearing(centerCoordinates, newNodeGeometry.coordinates);
                const newNodePoint = turf.destination(centerCoordinates, newNodeDistance, nodeBearing, { units: 'meters' });
                newNodeGeometry.coordinates = newNodePoint.geometry.coordinates;
                sdk.DataModel.Nodes.moveNode({ id: node.id, geometry: newNodeGeometry });
            }

            if (_settings.RoundaboutAngles) {
                drawRoundaboutAngles();
            }
        }
    }

    function handleNodeAInClick(e) {
        e.stopPropagation();
        const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
        moveNodeIn(segment, segment.fromNodeId);
    }

    function handleNodeBInClick(e) {
        e.stopPropagation();
        const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
        moveNodeIn(segment, segment.toNodeId);
    }

    function moveNodeIn(segment, nodeId) {
        let isANode = true;
        // Segment needs at least 3 coords (A node, one geonode and B node)
        if (segment.geometry.coordinates.length > 2) {
            if (nodeId === segment.toNodeId) {
                isANode = false;
            }

            // Find the other segment on the roundabout connected to the node
            const node = sdk.DataModel.Nodes.getById({ nodeId: nodeId });
            let nodeSegmentIds = node.connectedSegmentIds.filter((segmentId) => segmentId !== segment.id);
            const nodeSegments = getSegmentsFromIds(nodeSegmentIds);

            let otherSegment;
            for (const nodeSegment of nodeSegments) {
                if (nodeSegment.junctionId) {
                    otherSegment = nodeSegment;
                    break;
                }
            }

            // Copy the coordinate of the geonode to be replaced with a node
            const newNodeGeometry = {
                type: 'Point',
                coordinates: structuredClone(segment.geometry.coordinates[isANode ? 1 : segment.geometry.coordinates.length - 2])
            };

            // Update the segment (remove a geonode)
            let newSegmentGeometry = structuredClone(segment.geometry);
            newSegmentGeometry.coordinates.splice(isANode ? 1 : newSegmentGeometry.coordinates.length - 2, 1);
            sdk.DataModel.Segments.updateSegment({ segmentId: segment.id, geometry: newSegmentGeometry });

            // Move node
            sdk.DataModel.Nodes.moveNode({ id: node.id, geometry: newNodeGeometry });

            // The other segment will be the opposite of A or B
            if ((otherSegment.isBtoA && !segment.isBtoA) || (!otherSegment.isBtoA && segment.isBtoA)) {
                isANode = !isANode;
            }

            // Update the other segment (add a geonode)
            let newOtherSegmentGeometry = structuredClone(otherSegment.geometry);
            newOtherSegmentGeometry.coordinates.splice(isANode ? newOtherSegmentGeometry.coordinates.length : 0, 0, newNodeGeometry.coordinates);
            sdk.DataModel.Segments.updateSegment({ segmentId: otherSegment.id, geometry: newOtherSegmentGeometry });

            if (_settings.RoundaboutAngles) {
                drawRoundaboutAngles();
            }
        }
    }

    function handleNodeAOutClick(e) {
        e.stopPropagation();
        const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
        moveNodeOut(segment, segment.fromNodeId);
    }

    function handleNodeBOutClick(e) {
        e.stopPropagation();
        const segment = sdk.DataModel.Segments.getById({ segmentId: sdk.Editing.getSelection().ids[0] });
        moveNodeOut(segment, segment.toNodeId);
    }

    function moveNodeOut(segment, nodeId) {
        let isANode = true;
        if (nodeId === segment.toNodeId) {
            isANode = false;
        }

        // Find the other segment on the roundabout connected to the node
        const node = sdk.DataModel.Nodes.getById({ nodeId: nodeId });
        let nodeSegmentIds = node.connectedSegmentIds.filter((segmentId) => segmentId !== segment.id);
        const nodeSegments = getSegmentsFromIds(nodeSegmentIds);

        let otherSegment;
        for (const nodeSegment of nodeSegments) {
            if (nodeSegment.junctionId) {
                otherSegment = nodeSegment;
                break;
            }
        }

        // The other segment needs at least 3 coords (A node, one geonode and B node)
        if (otherSegment.geometry.coordinates.length > 2) {
            // Update the segment (add a geonode)
            let newSegmentGeometry = structuredClone(segment.geometry);
            newSegmentGeometry.coordinates.splice(isANode ? 1 : newSegmentGeometry.coordinates.length - 1, 0, node.geometry.coordinates);
            sdk.DataModel.Segments.updateSegment({ segmentId: segment.id, geometry: newSegmentGeometry });

            // The other segment will be the opposite of A or B
            if ((otherSegment.isBtoA && !segment.isBtoA) || (!otherSegment.isBtoA && segment.isBtoA)) {
                isANode = !isANode;
            }

            // Update the other segment (remove a geonode)
            let newOtherSegmentGeometry = structuredClone(otherSegment.geometry);
            newOtherSegmentGeometry.coordinates.splice(isANode ? -2 : 1, 1);
            sdk.DataModel.Segments.updateSegment({ segmentId: otherSegment.id, geometry: newOtherSegmentGeometry });

            // Move the node
            const newNodeGeometry = {
                type: 'Point',
                coordinates: structuredClone(otherSegment.geometry.coordinates[isANode ? otherSegment.geometry.coordinates.length - 2 : 1])
            };
            sdk.DataModel.Nodes.moveNode({ id: node.id, geometry: newNodeGeometry });

            if (_settings.RoundaboutAngles) {
                drawRoundaboutAngles();
            }
        }
    }

    //*************** Roundabout Angles **********************
    function drawRoundaboutAngles() {
        if (sdk.Map.isLayerVisible({ layerName: '__DrawRoundaboutAngles' }) == false) {
            sdk.Map.removeAllFeaturesFromLayer({ layerName: '__DrawRoundaboutAngles' });
            return;
        }

        if (sdk.Map.getZoomLevel() < 15) {
            sdk.Map.removeAllFeaturesFromLayer({ layerName: '__DrawRoundaboutAngles' });
            return;
        }

        //---------collect all roundabouts first
        let segmentsByJunctionId = {};
        for (const segment of sdk.DataModel.Segments.getAll()) {
            let junctionId = segment.junctionId;

            if (junctionId) {
                if (!segmentsByJunctionId[junctionId]) {
                    segmentsByJunctionId[junctionId] = [];
                }
                segmentsByJunctionId[junctionId].push(segment);
            }
        }

        let layerFeatures = [];

        //-------for each roundabout do...
        for (const junctionId in segmentsByJunctionId) {
            const junctionSegments = segmentsByJunctionId[junctionId];
            let nodes = junctionSegments.map((segment) => segment.fromNodeId); //get from nodes
            nodes.push(...junctionSegments.map((segment) => segment.toNodeId));
            nodes = [...new Set(nodes)]; //remove duplicates
            const nodeCoordinates = nodes.map((nodeId) => sdk.DataModel.Nodes.getById({ nodeId }).geometry.coordinates);

            let radius = -1;
            const nodeCount = nodeCoordinates.length;

            if (nodeCount >= 1) {
                const junction = sdk.DataModel.Junctions.getById({ junctionId: parseInt(junctionId) });
                let centerCoordinate = junction.geometry.coordinates;

                let angles = [];
                for (const nodeCoordinate of nodeCoordinates) {
                    let currentRadius = turf.distance(centerCoordinate, nodeCoordinate, { units: 'meters' });
                    if (radius < currentRadius) {
                        radius = currentRadius;
                    }

                    let angle = turf.bearing(centerCoordinate, nodeCoordinate);
                    angles.push(angle);
                }

                //---------sorting angles for calulating angle difference between two segments
                angles = angles.sort(function (a, b) {
                    return a - b;
                });
                angles.push(angles[0] + 360.0);
                angles = angles.sort(function (a, b) {
                    return a - b;
                });

                let strokeColor = nodeCount <= 4 ? COLOR.NORMAL_LINES : COLOR.NON_NORMAL_LINES;

                let circle = turf.circle(centerCoordinate, radius, { units: 'meters', steps: sdk.Map.getZoomLevel() * 5 });
                let circleFeature = turf.polygon(
                    circle.geometry.coordinates,
                    {
                        styleName: 'roundaboutCircleStyle',
                        layerName: '__DrawRoundaboutAngles',
                        style: {
                            strokeColor
                        }
                    },
                    { id: `polygon_${centerCoordinate.toString()}_${radius}` }
                );
                layerFeatures.push(circleFeature);

                if (nodeCount >= 2 && nodeCount <= 4) {
                    //Normal roundabouts
                    for (let nodeCoordinate of nodeCoordinates) {
                        let lineFeature = turf.lineString(
                            [centerCoordinate, nodeCoordinate],
                            {
                                styleName: 'roundaboutLineStyle',
                                layerName: '__DrawRoundaboutAngles',
                                style: { strokeColor }
                            },
                            { id: `line_${[centerCoordinate, nodeCoordinate].toString()}` }
                        );
                        layerFeatures.push(lineFeature);
                    }

                    let anglesFloat = [];
                    let anglesSum = 0;
                    for (let i = 0; i < angles.length - 1; i++) {
                        // Find the angle between the two nodes
                        let angle = angles[i + 1] - angles[i + 0];
                        if (angle < 0) {
                            angle += 360.0;
                        }
                        if (angle < 0) {
                            angle += 360.0;
                        }

                        // Is the angle closer to 90 or 180, how many degrees off?
                        if (angle < 135.0) {
                            angle = angle - 90.0;
                        } else {
                            angle = angle - 180.0;
                        }

                        anglesSum += parseInt(angle);
                        anglesFloat.push(angle);
                    }

                    if (nodeCount == 2) {
                        anglesFloat[1] = -anglesFloat[0];
                    }

                    for (let i = 0; i < angles.length - 1; i++) {
                        let labelDistance = radius / 2;
                        let angleMidpoint = (angles[i + 0] + angles[i + 1]) * 0.5;
                        let labelPoint = turf.destination(centerCoordinate, labelDistance, angleMidpoint, { units: 'meters' });

                        //*** Angle Display Rounding ***
                        let angleRounded = Math.round(anglesFloat[i] * 100) / 100;

                        let labelColor = COLOR.NORMAL_ANGLES;
                        if (angleRounded <= -15 || angleRounded >= 15) {
                            labelColor = COLOR.NON_NORMAL_ANGLES;
                        } else if (angleRounded <= -13 || angleRounded >= 13) {
                            labelColor = COLOR.AVOID_ANGLES;
                        }

                        let angleLabelFeature = turf.point(
                            labelPoint.geometry.coordinates,
                            {
                                styleName: 'roundaboutLabelStyle',
                                layerName: '__DrawRoundaboutAngles',
                                style: {
                                    labelText: angleRounded + '°',
                                    labelColor: labelColor
                                }
                            },
                            { id: `label_${labelPoint.geometry.coordinates.toString()}` }
                        );
                        layerFeatures.push(angleLabelFeature);
                    }
                } else {
                    // Non-normal roundabouts
                    for (let nodeCoordinate of nodeCoordinates) {
                        let lineFeature = turf.lineString(
                            [centerCoordinate, nodeCoordinate],
                            {
                                styleName: 'roundaboutLineStyle',
                                layerName: '__DrawRoundaboutAngles',
                                style: { strokeColor }
                            },
                            { id: `line_${[centerCoordinate, nodeCoordinates].toString()}` }
                        );
                        layerFeatures.push(lineFeature);
                    }
                }

                let centerLabelFeature = turf.point(
                    centerCoordinate,
                    {
                        styleName: 'roundaboutLabelStyle',
                        layerName: '__DrawRoundaboutAngles',
                        style: {
                            labelText: (radius * 2.0).toFixed(0) + 'm',
                            labelColor: '#000000'
                        }
                    },
                    { id: `centerLabel_${centerCoordinate.toString()}` }
                );
                layerFeatures.push(centerLabelFeature);
            }
        }

        sdk.Map.removeAllFeaturesFromLayer({ layerName: '__DrawRoundaboutAngles' });
        sdk.Map.addFeaturesToLayer({ layerName: '__DrawRoundaboutAngles', features: layerFeatures });
    }

    function injectCss() {
        const css = ['.btnMoveNode {width=25px; height=25px; background-color:#92C3D3; cursor:pointer; padding:5px; font-size:14px; border:thin outset black; border-style:solid; border-width: 1px;border-radius:50%; -moz-border-radius:50%; -webkit-border-radius:50%; box-shadow:inset 0px 0px 20px -14px rgba(0,0,0,1); -moz-box-shadow:inset 0px 0px 20px -14px rgba(0,0,0,1); -webkit-box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);}', '.btnRotate { width=45px; height=45px; background-color:#92C3D3; cursor:pointer; padding: 5px; font-size:14px; border:thin outset black; border-style:solid; border-width: 1px;border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);-moz-box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);-webkit-box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);}'].join(' ');
        $('<style type="text/css">' + css + '</style>').appendTo('head');
    }

    function applyRoundaboutCircleStyle(properties) {
        return properties.styleName === 'roundaboutCircleStyle' && properties.layerName === '__DrawRoundaboutAngles';
    }

    function applyRoundaboutLineStyle(properties) {
        return properties.styleName === 'roundaboutLineStyle' && properties.layerName === '__DrawRoundaboutAngles';
    }

    function applyRoundaboutLabelStyle(properties) {
        return properties.styleName === 'roundaboutLabelStyle' && properties.layerName === '__DrawRoundaboutAngles';
    }

    const styleConfig = {
        styleContext: {
            labelText: (context) => {
                return context?.feature?.properties?.style?.labelText;
            },
            strokeColor: (context) => {
                return context?.feature?.properties?.style?.strokeColor;
            },
            strokeWidth: (context) => {
                return context?.feature?.properties?.style?.strokeWidth;
            },
            labelColor: (context) => {
                return context?.feature?.properties?.style?.labelColor;
            }
        },
        styleRules: [
            {
                predicate: applyRoundaboutCircleStyle,
                style: {
                    fillOpacity: 0.0,
                    strokeWidth: 10,
                    strokeColor: '${strokeColor}',
                    pointRadius: 0
                }
            },
            {
                predicate: applyRoundaboutLineStyle,
                style: {
                    strokeWidth: 2,
                    strokeColor: '${strokeColor}',
                    pointRadius: 0
                }
            },
            {
                predicate: applyRoundaboutLabelStyle,
                style: {
                    label: '${labelText}',
                    labelOutlineColor: '#FFFFFF',
                    labelOutlineWidth: 3,
                    fontFamily: 'Tahoma, Courier New',
                    fontWeight: 'bold',
                    fontColor: '${labelColor}',
                    fontSize: '10px'
                }
            }
        ]
    };
})();
