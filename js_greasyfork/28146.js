// ==UserScript==
// @name         WME RA Util
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      0.3.6
// @description  Providing basic utility for RA adjustment without the need to delete & recreate
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @author       JustinS83
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/28146/WME%20RA%20Util.user.js
// @updateURL https://update.greasyfork.org/scripts/28146/WME%20RA%20Util.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */

/*
Todo:
-diameter change


non-normal RA color:#FF8000
normal RA color:#4cc600
major axis color #fedc98
*/
(function () {

    var RAUtilWindow = null;
    var UpdateSegmentGeometry;
    var MoveNode, MultiAction;

    //var totalActions = 0;
    var _settings;

    function bootstrap(tries) {
        tries = tries || 1;

        if (window.W &&
            window.W.map &&
            window.W.model &&
            window.require &&
           WazeWrap) {

            init();

        } else if (tries < 1000) {
            setTimeout(function () { bootstrap(tries++); }, 200);
        }
    }

    bootstrap();


    function init() {

        /** Place break here **/
        /* debugger; */

        UpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry');
        MoveNode = require("Waze/Action/MoveNode");
        MultiAction = require("Waze/Action/MultiAction");

        RAUtilWindow = document.createElement('div');
        RAUtilWindow.id = "RAUtilWindow";
        RAUtilWindow.style.position = 'fixed';
        RAUtilWindow.style.visibility = 'hidden';
        RAUtilWindow.style.top = '15%';
        RAUtilWindow.style.left = '25%';
        RAUtilWindow.style.width = '244px'; //390px
        RAUtilWindow.style.zIndex = 100;
        RAUtilWindow.style.backgroundColor = '#BEDCE5';
        RAUtilWindow.style.borderWidth = '3px';
        RAUtilWindow.style.borderStyle = 'solid';
        RAUtilWindow.style.borderRadius = '10px';
        RAUtilWindow.style.boxShadow = '5px 5px 10px Silver';
        RAUtilWindow.style.padding = '4px';

        var alertsHTML = '<div id="header" style="padding: 4px; background-color:#4cc600; font-weight: bold; text-align:center;">Roundabout Utility <a data-toggle="collapse" href="#divWrappers" id="collapserLink" style="float:right"><span id="collapser" style="cursor:pointer;border:thin outset black;padding:2px;" class="fa fa-caret-square-o-up"></a></span></div>';
        alertsHTML += '<div id="divWrappers" class="collapse in">';
        alertsHTML += '<div id="contentShift" style="padding: 4px; background-color:White; display:inline-block; border-style:solid; border-width:1px; margin-right:5px;">';
        alertsHTML += 'Shift amount</br><input type="text" name="shiftAmount" id="shiftAmount" size="1" style="border: 1px solid #000000" value="1"/> meter(s)&nbsp;';

        alertsHTML += '<div id="controls" style="padding: 4px;">';

        alertsHTML += '<table style="table-layout:fixed; width:60px; height:84px; margin-left:auto;margin-right:auto;">';
        alertsHTML += '<tr style="width:20px;height:28px;">';
        alertsHTML += '<td align="center"></td>';
        alertsHTML += '<td align="center">';
        //Single Shift Buttons
        alertsHTML += '<span id="RAShiftUpBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;">';//margin-left:23px;">';
        alertsHTML += '<i class="fa fa-angle-up"> </i>';
        alertsHTML += '<span id="UpBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';
        alertsHTML += '<td align="center"></td>';
        alertsHTML += '</tr>';

        alertsHTML += '<tr style="width:20px;height:28px;">';
        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="RAShiftLeftBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;padding-right:4px;">';//position:relative;padding:2px;padding-left:3px;padding-right:3px;margin-left:0px;top:10px;">';
        alertsHTML += '<i class="fa fa-angle-left"> </i>';
        alertsHTML += '<span id="LeftBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';

        alertsHTML += '<td align="center"></td>';

        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="RAShiftRightBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;padding-left:4px;">';//position:relative;padding:2px;padding-left:3px;padding-right:3px;top:10px;margin-left:15px;">';
        alertsHTML += '<i class="fa fa-angle-right"> </i>';
        alertsHTML += '<span id="RightBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';
        alertsHTML += '</tr>';

        alertsHTML += '<tr style="width:20px;height:28px;">';
        alertsHTML += '<td align="center"></td>';

        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="RAShiftDownBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;">';//;position:relative;top:20px;margin-left:17px;">';
        alertsHTML += '<i class="fa fa-angle-down"> </i>';
        alertsHTML += '<span id="DownBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';

        alertsHTML += '<td align="center"></td>';
        alertsHTML += '</tr>';
        alertsHTML += '</table>';
        alertsHTML += '</div></div>';


        //***************** Rotation **************************
        alertsHTML += '<div id="contentRotate" style="padding: 4px; background-color:White;  display:inline-block; border-style:solid; border-width:1px; margin-right:5px;">';
        alertsHTML += 'Rotation amount</br><input type="text" name="rotationAmount" id="rotationAmount" size="1" style="border: 1px solid #000000" value="1"/> degree(s)&nbsp;';
        alertsHTML += '<div id="rotationControls" style="padding: 4px;">';
        alertsHTML += '<table style="table-layout:fixed; width:60px; height:84px; margin-left:auto; margin-right:auto;">';
        alertsHTML += '<tr style="width:20px;height:28px;">';
        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="RARotateLeftBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;">';//margin-left:23px;">';
        alertsHTML += '<i class="fa fa-undo"> </i>';
        alertsHTML += '<span id="RotateLeftBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';

        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="RARotateRightBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;">';//margin-left:23px;">';
        alertsHTML += '<i class="fa fa-repeat"> </i>';
        alertsHTML += '<span id="RotateRightBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';
        alertsHTML += '</tr></table>';
        alertsHTML += '</div></div>';

        //***************** Horizontal stretch **************************        *//
        alertsHTML += '<div id="contentLongStretch" style="padding: 4px; background-color:White; display:inline-block; border-style:solid; border-width:1px; margin-right:5px;">';
        alertsHTML += 'Horizontal stretch</br><input type="text" name="xStretchAmount" id="HorizStretchAmount" size="1" style="border: 1px solid #000000" value="1"/> meter(s)&nbsp;';

        alertsHTML += '<div id="controls" style="padding: 4px;">';

        alertsHTML += '<table style="table-layout:fixed; width:60px; height:84px; margin-left:auto;margin-right:auto;">';
        //Single Stretch Buttons

        alertsHTML += '<tr style="width:20px;height:28px;">';
        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="RAStretchHorizBtnPlus" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;padding-right:4px;">';//position:relative;padding:2px;padding-left:3px;padding-right:3px;margin-left:0px;top:10px;"+';
        alertsHTML += '<i class="fa fa-plus"> </i>';
        alertsHTML += '<span id="PlusBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';

        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="RAStretchHorizBtnMinus" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;padding-left:4px;">';//position:relative;padding:2px;padding-left:3px;padding-right:3px;top:10px;margin-left:15px;"-';
        alertsHTML += '<i class="fa fa-minus"> </i>';
        alertsHTML += '<span id="MinusBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';
        alertsHTML += '</tr>';

        alertsHTML += '</table>';
        alertsHTML += '</div></div>';


        //***************** Vertical stretch **************************        *//
        alertsHTML += '<div id="contentLatStretch" style="padding: 4px; background-color:White; display:inline-block; border-style:solid; border-width:1px; margin-right:5px;">';
        alertsHTML += 'Vertical stretch</br><input type="text" name="xStretchAmount" id="VertStretchAmount" size="1" style="border: 1px solid #000000" value="1"/> meter(s)&nbsp;';

        alertsHTML += '<div id="controls" style="padding: 4px;">';

        alertsHTML += '<table style="table-layout:fixed; width:60px; height:84px; margin-left:auto;margin-right:auto;">';
        //Single Stretch Buttons

        alertsHTML += '<tr style="width:20px;height:14px;">';
        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="RAStretchVertBtnPlus" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;padding-right:4px;">';//position:relative;padding:2px;padding-left:3px;padding-right:3px;margin-left:0px;top:10px;"+';
        alertsHTML += '<i class="fa fa-plus"> </i>';
        alertsHTML += '<span id="PlusBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';
        alertsHTML += '</tr>';

        alertsHTML += '<tr style="width:20px;height:14px;">';
        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="RAStretchVertBtnMinus" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;padding-left:4px;">';//position:relative;padding:2px;padding-left:3px;padding-right:3px;top:10px;margin-left:15px;"-';
        alertsHTML += '<i class="fa fa-minus"> </i>';
        alertsHTML += '<span id="MinusBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';
        alertsHTML += '</tr>';

        alertsHTML += '</table>';
        alertsHTML += '</div></div>';



        //********************* Diameter change ******************
        /*
        alertsHTML += '<div id="diameterChange" style="padding: 4px; padding-top:11px; background-color:White; display:inline-block; border-style:solid; border-width:1px; height:152px; text-align:center;" >';
        alertsHTML += 'Change diameter</br></br>';
        alertsHTML += '<div id="DiameterChangeControls" style="padding: 4px;">';

        alertsHTML += '<table style="table-layout:fixed; height:84px; margin-left:auto;margin-right:auto;">';
        alertsHTML += '<tr style="width:20px;height:28px;">';
        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="diameterChangeDecreaseBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;">';//margin-left:23px;">';
        alertsHTML += '<i class="fa fa-minus"> </i>';
        alertsHTML += '<span id="diameterChangeDecreaseCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';

        alertsHTML += '<td align="center" width="105">';
        alertsHTML += '<input type="text" name="diameterChangeAmount" id="diameterChangeAmount" size="1" style="border: 1px solid #000000" value="1"/> meter(s)&nbsp;';
        alertsHTML += '</td>';

        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="diameterChangeIncreaseBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;">';//margin-left:23px;">';
        alertsHTML += '<i class="fa fa-plus"> </i>';
        alertsHTML += '<span id="diameterChangeIncreaseCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';
        alertsHTML += '</tr></table>';

        alertsHTML += '</div></div>';*/
        alertsHTML += '</div></div>'; //Close divWrapers & outer div



        RAUtilWindow.innerHTML = alertsHTML;
        document.body.appendChild(RAUtilWindow);

        document.getElementById('RAShiftLeftBtn').addEventListener('click', RAShiftLeftBtnClick, false);
        document.getElementById('RAShiftRightBtn').addEventListener('click', RAShiftRightBtnClick, false);
        document.getElementById('RAShiftUpBtn').addEventListener('click', RAShiftUpBtnClick, false);
        document.getElementById('RAShiftDownBtn').addEventListener('click', RAShiftDownBtnClick, false);

        document.getElementById('RARotateLeftBtn').addEventListener('click', RARotateLeftBtnClick, false);
        document.getElementById('RARotateRightBtn').addEventListener('click', RARotateRightBtnClick, false);

        document.getElementById('RAStretchHorizBtnPlus').addEventListener('click', RAStretchHLeftBtnClick, false);
        document.getElementById('RAStretchHorizBtnMinus').addEventListener('click', RAStretchHRightBtnClick, false);

        document.getElementById('RAStretchVertBtnPlus').addEventListener('click', RAStretchVTopBtnClick, false);
        document.getElementById('RAStretchVertBtnMinus').addEventListener('click', RAStretchVBottomBtnClick, false);

        //document.getElementById('diameterChangeDecreaseBtn').addEventListener('click', diameterChangeDecreaseBtnClick, false);
        //document.getElementById('diameterChangeIncreaseBtn').addEventListener('click', diameterChangeIncreaseBtnClick, false);

        $('#shiftAmount').keypress(function (event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $('#rotationAmount').keypress(function (event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $('#collapserLink').click(function () {
            if ($('#collapser').attr('class') == "fa fa-caret-square-o-down") {
                $("#collapser").removeClass("fa-caret-square-o-down");
                $("#collapser").addClass("fa-caret-square-o-up");
            }
            else {
                $("#collapser").removeClass("fa-caret-square-o-up");
                $("#collapser").addClass("fa-caret-square-o-down");
            }
            saveSettingsToStorage();
        });

        window.Waze.selectionManager.events.register("selectionchanged", null, checkDisplayTool);
        //W.model.actionManager.events.register("afterundoaction",null, undotriggered);
        //W.model.actionManager.events.register("afterclearactions",null,actionsCleared);

        var loadedSettings = $.parseJSON(localStorage.getItem("WME_RAUtil"));
        var defaultSettings = {
            divTop: "15%",
            divLeft: "25%",
            Expanded: true
        };
        _settings = loadedSettings ? loadedSettings : defaultSettings;

        $('#RAUtilWindow').css('left', _settings.divLeft);
        $('#RAUtilWindow').css('top', _settings.divTop);

        if (!_settings.Expanded) {
            $("#divWrappers").removeClass("in");
            $("#divWrappers").addClass("collapse");
            $("#collapser").removeClass("fa-caret-square-o-up");
            $("#collapser").addClass("fa-caret-square-o-down");
        }
    }

    function saveSettingsToStorage() {
        if (localStorage) {
            var settings = {
                divTop: "15%",
                divLeft: "25%",
                Expanded: true
            };

            settings.divLeft = $('#RAUtilWindow').css('left');
            settings.divTop = $('#RAUtilWindow').css('top');
            settings.Expanded = $("#collapser").attr('class').indexOf("fa-caret-square-o-up") > -1;
            localStorage.setItem("WME_RAUtil", JSON.stringify(settings));
        }
    }

    /*
    function undotriggered(){
        checkSaveChanges();
    }

    function actionsCleared(){
        //checkSaveChanges();
        totalActions = 0;
    }
    */

    function checkDisplayTool() {
        if (W.selectionManager.hasSelectedItems() && Waze.selectionManager.selectedItems[0].model.type === 'segment') {
            if (!AllSelectedSegmentsRA() || W.selectionManager.selectedItems.length === 0)
                $('#RAUtilWindow').css({ 'visibility': 'hidden' });
            else {
                $('#RAUtilWindow').css({ 'visibility': 'visible' });
                if (typeof jQuery.ui !== 'undefined')
                    $('#RAUtilWindow').draggable({ //Gotta nuke the height setting the dragging inserts otherwise the panel cannot collapse
                        stop: function (event, ui) {
                            $('#RAUtilWindow').css("height", "");
                            saveSettingsToStorage();
                        }
                    });
                //checkSaveChanges();
                checkAllEditable(WazeWrap.Model.getAllRoundaboutSegmentsFromObj(W.selectionManager.selectedItems[0]));
            }
        }
        else {
            $('#RAUtilWindow').css({ 'visibility': 'hidden' });
            if (typeof jQuery.ui !== 'undefined')
                $('#RAUtilWindow').draggable({
                    stop: function (event, ui) {
                        $('#RAUtilWindow').css("height", "");
                        saveSettingsToStorage();
                    }
                });
        }
    }


    //var pendingChanges = false;
    /**
    Returns false if there are pending changes, true if no changes need saved.
    */
    /*function checkSaveChanges(){
        var $RASaveChanges = $('#RAUtilSaveChanges');
        if(W.model.actionManager.index >= 0 && (totalActions === 0 && (W.model.actionManager.actions.length > 0))){
            if($RASaveChanges.length === 0){
                $RASaveChanges = $('<div>', {id:'RAUtilSaveChanges', style:'color:red'});
                $RASaveChanges.text('You must save your changes before using this utility.');
                $('#RAUtilWindow').append($RASaveChanges);
                pendingChanges = true;
            }
        }
        else
        {
            $RASaveChanges.remove();
            pendingChanges = false;
        }
    }
    */

    function checkAllEditable(RASegs) {
        var $RAEditable = $('#RAEditable');
        var allEditable = true;
        var segObj, fromNode, toNode;

        for (i = 0; i < RASegs.length; i++) {
            segObj = W.model.segments.get(RASegs[i]);
            fromNode = segObj.getFromNode();
            toNode = segObj.getToNode();

            if (segObj !== "undefined") {
                if (fromNode && fromNode !== "undefined" && !fromNode.areConnectionsEditable())
                    allEditable = false;
                else if (toNode && toNode !== "undefined" && !toNode.areConnectionsEditable())
                    allEditable = false;
                var toConnected, fromConnected;

                if (toNode) {
                    toConnected = toNode.attributes.segIDs;
                    for (j = 0; j < toConnected.length; j++) {
                        if (W.model.segments.get(toConnected[j]) !== "undefined")
                            if (W.model.segments.get(toConnected[j]).hasClosures())
                                allEditable = false;
                    }
                }

                if (fromNode) {
                    fromConnected = fromNode.attributes.segIDs;
                    for (j = 0; j < fromConnected.length; j++) {
                        if (W.model.segments.get(fromConnected[j]) !== "undefined")
                            if (W.model.segments.get(fromConnected[j]).hasClosures())
                                allEditable = false;
                    }
                }
            }
        }
        if (allEditable) {
            $RAEditable.remove();
        }
        else {
            if ($RAEditable.length === 0) {
                $RAEditable = $('<div>', { id: 'RAEditable', style: 'color:red' });
                $RAEditable.text('One or more segments are locked above your rank or have a closure.');
                $('#RAUtilWindow').append($RAEditable);
            }
        }
        return allEditable;
    }

    function AllSelectedSegmentsRA() {
        for (i = 0; i < W.selectionManager.selectedItems.length; i++) {
            if (W.selectionManager.selectedItems[i].model.attributes.id < 0 || !WazeWrap.Model.isRoundaboutSegmentID(W.selectionManager.selectedItems[i].model.attributes.id))
                return false;
        }
        return true;
    }

    function ShiftSegmentNodesLat(segObj, latOffset) {
        var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj);
        if (checkAllEditable(RASegs)) {
            var gps;
            var newGeometry = segObj.geometry.clone();
            var originalLength = segObj.geometry.components.length;
            var multiaction = new MultiAction();
            multiaction.setModel(W.model);

            for (i = 0; i < RASegs.length; i++) {
                segObj = W.model.segments.get(RASegs[i]);
                newGeometry = segObj.geometry.clone();
                originalLength = segObj.geometry.components.length;
                for (j = 1; j < originalLength - 1; j++) {
                    gps = WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[j].x, segObj.geometry.components[j].y);
                    gps.lat += latOffset;
                    newGeometry.components.splice(j, 0, new OL.Geometry.Point(segObj.geometry.components[j].x, WazeWrap.Geometry.ConvertTo900913(segObj.geometry.components[j].x, gps.lat).lat));
                    newGeometry.components.splice(j + 1, 1);
                }
                newGeometry.components[0].calculateBounds();
                newGeometry.components[originalLength - 1].calculateBounds();
                multiaction.doSubAction(new UpdateSegmentGeometry(segObj, segObj.geometry, newGeometry));
                //W.model.actionManager.add(new UpdateSegmentGeometry(segObj, segObj.geometry, newGeometry));

                var node = W.model.nodes.objects[segObj.attributes.toNodeID];
                if (segObj.attributes.revDirection)
                    node = W.model.nodes.objects[segObj.attributes.fromNodeID];
                var newNodeGeometry = node.geometry.clone();
                gps = WazeWrap.Geometry.ConvertTo4326(node.attributes.geometry.x, node.attributes.geometry.y);
                gps.lat += latOffset;
                newNodeGeometry.y = WazeWrap.Geometry.ConvertTo900913(node.geometry.x, gps.lat).lat;
                newNodeGeometry.calculateBounds();

                var connectedSegObjs = {};
                var emptyObj = {};
                for (var j = 0; j < node.attributes.segIDs.length; j++) {
                    var segid = node.attributes.segIDs[j];
                    connectedSegObjs[segid] = W.model.segments.get(segid).geometry.clone();
                }
                //W.model.actionManager.add(new MoveNode(segObj, segObj.geometry, newNodeGeometry, connectedSegObjs, i));
                multiaction.doSubAction(new MoveNode(node, node.geometry, newNodeGeometry, connectedSegObjs, emptyObj));
                //W.model.actionManager.add(new MoveNode(node, node.geometry, newNodeGeometry));
                //totalActions +=2;
            }
            W.model.actionManager.add(multiaction);
        }
    }

    function ShiftSegmentsNodesLong(segObj, longOffset) {
        var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj);
        if (checkAllEditable(RASegs)) {
            var gps, newGeometry, originalLength;
            var multiaction = new MultiAction();
            multiaction.setModel(W.model);

            //Loop through all RA segments & adjust
            for (i = 0; i < RASegs.length; i++) {
                segObj = W.model.segments.get(RASegs[i]);
                newGeometry = segObj.geometry.clone();
                originalLength = segObj.geometry.components.length;
                for (j = 1; j < originalLength - 1; j++) {
                    gps = WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[j].x, segObj.geometry.components[j].y);
                    gps.lon += longOffset;
                    newGeometry.components.splice(j, 0, new OL.Geometry.Point(WazeWrap.Geometry.ConvertTo900913(gps.lon, segObj.geometry.components[j].y).lon, segObj.geometry.components[j].y));
                    newGeometry.components.splice(j + 1, 1);
                }
                newGeometry.components[0].calculateBounds();
                newGeometry.components[originalLength - 1].calculateBounds();
                //W.model.actionManager.add(new UpdateSegmentGeometry(segObj, segObj.geometry, newGeometry));
                multiaction.doSubAction(new UpdateSegmentGeometry(segObj, segObj.geometry, newGeometry));

                var node = W.model.nodes.objects[segObj.attributes.toNodeID];
                if (segObj.attributes.revDirection)
                    node = W.model.nodes.objects[segObj.attributes.fromNodeID];

                var newNodeGeometry = node.geometry.clone();
                gps = WazeWrap.Geometry.ConvertTo4326(node.attributes.geometry.x, node.attributes.geometry.y);
                gps.lon += longOffset;
                newNodeGeometry.x = WazeWrap.Geometry.ConvertTo900913(gps.lon, node.geometry.y).lon;
                newNodeGeometry.calculateBounds();

                var connectedSegObjs = {};
                var emptyObj = {};
                for (var j = 0; j < node.attributes.segIDs.length; j++) {
                    var segid = node.attributes.segIDs[j];
                    connectedSegObjs[segid] = W.model.segments.get(segid).geometry.clone();
                }
                //W.model.actionManager.add(new MoveNode(node, node.geometry, newNodeGeometry));
                multiaction.doSubAction(new MoveNode(node, node.geometry, newNodeGeometry, connectedSegObjs, emptyObj));
                //totalActions +=2;
            }
            W.model.actionManager.add(multiaction);
        }
    }

    function rotatePoints(origin, points, angle) {
        console.log("Origin: " + origin);
        console.log("Point: " + points[0]);
        var lineFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(points), null, null);
        lineFeature.geometry.rotate(angle, new OpenLayers.Geometry.Point(origin.lon, origin.lat));
        console.log(new OpenLayers.Geometry.Point(origin.lon, origin.lat).distanceTo(points[0]));
        console.log(lineFeature.geometry.components[0]);
        return lineFeature.geometry.components.clone();
    }

    function RotateRA(segObj, angle) {
        var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj);
        var raCenter = W.model.junctions.objects[segObj.model.attributes.junctionID].geometry.coordinates;

        if (checkAllEditable(RASegs)) {
            var gps, newGeometry, originalLength;
            var multiaction = new MultiAction();
            multiaction.setModel(W.model);

            //Loop through all RA segments & adjust
            for (i = 0; i < RASegs.length; i++) {
                segObj = W.model.segments.get(RASegs[i]);
                newGeometry = segObj.geometry.clone();
                originalLength = segObj.geometry.components.length;

                var center = WazeWrap.Geometry.ConvertTo900913(raCenter[0], raCenter[1]);

                //Find extreme low and high and set left and right to reverse
                var extremelow = WazeWrap.Geometry.ConvertTo900913(-180, -89);
                var extremehigh = WazeWrap.Geometry.ConvertTo900913(180, 90);

                var left = extremehigh.lon;
                var right = extremelow.lon;

                var segPoints = [];
                //Have to copy the points manually (can't use .clone()) otherwise the geometry rotation modifies the geometry of the segment itself and that hoses WME.
                for (j = 0; j < originalLength; j++) {

                    var newX = segObj.geometry.components[j].x;
                    var newY = segObj.geometry.components[j].y;

                    if (newX < left)
                        left = newX;

                    if (newX > right)
                        right = newX;

                    segPoints.push(new OL.Geometry.Point(newX, newY));
                }

                var newPoints = rotatePoints(center, segPoints, angle);

                for (j = 1; j < originalLength - 1; j++) {
                    newGeometry.components.splice(j, 0, new OL.Geometry.Point(newPoints[j].x, newPoints[j].y));
                    newGeometry.components.splice(j + 1, 1);
                }

                newGeometry.components[0].calculateBounds();
                newGeometry.components[originalLength - 1].calculateBounds();
                //W.model.actionManager.add(new UpdateSegmentGeometry(segObj, segObj.geometry, newGeometry));
                multiaction.doSubAction(new UpdateSegmentGeometry(segObj, segObj.geometry, newGeometry));

                //**************Rotate Nodes******************
                var node = W.model.nodes.objects[segObj.attributes.toNodeID];
                if (segObj.attributes.revDirection)
                    node = W.model.nodes.objects[segObj.attributes.fromNodeID];

                var nodePoints = [];
                var newNodeGeometry = node.geometry.clone();

                nodePoints.push(new OL.Geometry.Point(node.attributes.geometry.x, node.attributes.geometry.y));
                nodePoints.push(new OL.Geometry.Point(node.attributes.geometry.x, node.attributes.geometry.y)); //add it twice because lines need 2 points

                gps = rotatePoints(center, nodePoints, angle);

                newNodeGeometry.x = gps[0].x;
                newNodeGeometry.y = gps[0].y;

                newNodeGeometry.calculateBounds();
                //W.model.actionManager.add(new MoveNode(node, node.geometry, newNodeGeometry));
                multiaction.doSubAction(new MoveNode(node, node.geometry, newNodeGeometry));
                //totalActions +=2;
            }
            W.model.actionManager.add(multiaction);
        }
    }

    function StretchHorizRA(segObj, horizstretch, vertstretch) {
        var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj);
        var raCenter = W.model.junctions.objects[segObj.model.attributes.junctionID].geometry.coordinates;

        if (checkAllEditable(RASegs)) {
            var gps, newGeometry, originalLength;
            var multiaction = new MultiAction();
            multiaction.setModel(W.model);
            //Find extreme low and high and set left and right to reverse
            var extremelow = WazeWrap.Geometry.ConvertTo900913(-180, -89);
            var extremehigh = WazeWrap.Geometry.ConvertTo900913(180, 90);

            var left = extremehigh.lon;
            var right = extremelow.lon;
            var top = extremelow.lat;
            var bottom = extremehigh.lat;
            var centroidX = -1.00000000;
            var centroidY = -1.00000000;
            var longOffset = -1.00000000;
            var longOffsetFactor = -1.00000000;
            var latOffset = -1.00000000;
            var latOffsetFactor = -1.00000000;

            //loop through all RA segments to determine high and low

            for (i = 0; i < RASegs.length; i++) {
                segObj = W.model.segments.get(RASegs[i]);
                originalLength = segObj.geometry.components.length;

                for (j2 = 0; j2 < originalLength; j2++) {

                    var newX1 = segObj.geometry.components[j2].x;
                    var newY1 = segObj.geometry.components[j2].y;

                    if (newX1 < left)
                        left = newX1;

                    if (newX1 > right)
                        right = newX1;

                    if (newY1 < bottom)
                        bottom = newY1;

                    if (newY1 > top)
                        top = newY1;

                }

            }

            centroidX = (left + right) / 2;
            centroidY = (top + bottom) / 2;
            //Loop through all RA segments & adjust
            for (i = 0; i < RASegs.length; i++) {

                segObj = W.model.segments.get(RASegs[i]);
                newGeometry = segObj.geometry.clone();
                originalLength = segObj.geometry.components.length;
                for (j1 = 1; j1 < originalLength - 1; j1++) {
                    // Calculate horizontal stretch, varies on distance from center of roundbout
                    longOffsetFactor = ((segObj.geometry.components[j1].x - centroidX) / (right - centroidX));
                    latOffsetFactor = ((segObj.geometry.components[j1].y - centroidY) / (top - centroidY));
                    gps = WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[j1].x, segObj.geometry.components[j1].y);
                    gps.lon += horizstretch * longOffsetFactor / 2;
                    gps.lat += vertstretch * latOffsetFactor / 2;
                    //newGeometry.components.splice(j1,0, new OL.Geometry.Point(WazeWrap.Geometry.ConvertTo900913(gps.lon, segObj.geometry.components[j1].y).lon, segObj.geometry.components[j1].y));
                    newGeometry.components.splice(j1, 0, new OL.Geometry.Point(WazeWrap.Geometry.ConvertTo900913(gps.lon, gps.lat).lon, WazeWrap.Geometry.ConvertTo900913(gps.lon, gps.lat).lat));
                    newGeometry.components.splice(j1 + 1, 1);
                }
                newGeometry.components[0].calculateBounds();
                newGeometry.components[originalLength - 1].calculateBounds();
                //W.model.actionManager.add(new UpdateSegmentGeometry(segObj, segObj.geometry, newGeometry));
                multiaction.doSubAction(new UpdateSegmentGeometry(segObj, segObj.geometry, newGeometry));

                var node = W.model.nodes.objects[segObj.attributes.toNodeID];
                if (segObj.attributes.revDirection)
                    node = W.model.nodes.objects[segObj.attributes.fromNodeID];

                var newNodeGeometry = node.geometry.clone();
                gps = WazeWrap.Geometry.ConvertTo4326(node.attributes.geometry.x, node.attributes.geometry.y);
                gps.lon += horizstretch * longOffsetFactor / 2;
                gps.lat += vertstretch * latOffsetFactor / 2;
                newNodeGeometry.x = WazeWrap.Geometry.ConvertTo900913(gps.lon, gps.lat).lon;
                newNodeGeometry.y = WazeWrap.Geometry.ConvertTo900913(gps.lon, gps.lat).lat;
                newNodeGeometry.calculateBounds();

                var connectedSegObjs = {};
                var emptyObj = {};
                for (var j = 0; j < node.attributes.segIDs.length; j++) {
                    var segid = node.attributes.segIDs[j];
                    connectedSegObjs[segid] = W.model.segments.get(segid).geometry.clone();
                }
                //W.model.actionManager.add(new MoveNode(node, node.geometry, newNodeGeometry));
                multiaction.doSubAction(new MoveNode(node, node.geometry, newNodeGeometry, connectedSegObjs, emptyObj));
                //totalActions +=2;
            }


            W.model.actionManager.add(multiaction);
        }
    }

    function ChangeDiameter(segObj, amount) {
        var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj);
        var raCenter = W.model.junctions.objects[segObj.model.attributes.junctionID].geometry.coordinates;

        if (checkAllEditable(RASegs)) {
            var gps, newGeometry, originalLength;

            var center = WazeWrap.Geometry.ConvertTo900913(raCenter[0], raCenter[1]);
            //Loop through all RA segments & adjust
            for (i = 0; i < RASegs.length; i++) {
                segObj = W.model.segments.get(RASegs[i]);
                newGeometry = segObj.geometry.clone();
                originalLength = segObj.geometry.components.length;
                for (j = 1; j < originalLength - 1; j++) {
                    gps = WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[j].x, segObj.geometry.components[j].y);
                    var k = Math.atan2(origin.y - gps.lat, origin.x - gps.lon);

                    //gps.lon += longOffset;
                    //newGeometry.components.splice(j,0, new OL.Geometry.Point(WazeWrap.Geometry.ConvertTo900913(gps.lon, segObj.geometry.components[j].y).lon, segObj.geometry.components[j].y));
                    //newGeometry.components.splice(j+1,1);
                }
                newGeometry.components[0].calculateBounds();
                newGeometry.components[originalLength - 1].calculateBounds();
                W.model.actionManager.add(new UpdateSegmentGeometry(segObj, segObj.geometry, newGeometry));

                /*
                var node = W.model.nodes.objects[segObj.attributes.toNodeID];
                if(segObj.attributes.revDirection)
                    node = W.model.nodes.objects[segObj.attributes.fromNodeID];

                var newNodeGeometry = node.geometry.clone();
                gps = WazeWrap.Geometry.ConvertTo4326(node.attributes.geometry.x, node.attributes.geometry.y);
                gps.lon += longOffset;
                newNodeGeometry.x = WazeWrap.Geometry.ConvertTo900913(gps.lon, node.geometry.y).lon;
                newNodeGeometry.calculateBounds();
                W.model.actionManager.add(new MoveNode(node, node.geometry, newNodeGeometry));
                totalActions +=2;
                */
            }
        }
    }

    function diameterChangeDecreaseBtnClick(e) {
        e.stopPropagation();
        var segObj = W.selectionManager.selectedItems[0];
        ChangeDiameter(segObj, -$('#diameterChangeAmount').val());
    }

    function diameterChangeIncreaseBtnClick(e) {
        e.stopPropagation();
        var segObj = W.selectionManager.selectedItems[0];
        ChangeDiameter(segObj, $('#diameterChangeAmount').val());
    }

    function RARotateLeftBtnClick(e) {
        e.stopPropagation();
        var segObj = W.selectionManager.selectedItems[0];
        RotateRA(segObj, $('#rotationAmount').val());
    }

    function RARotateRightBtnClick(e) {
        e.stopPropagation();

        var segObj = W.selectionManager.selectedItems[0];
        RotateRA(segObj, -$('#rotationAmount').val());
    }

    //Horizontal stretch
    function RAStretchHLeftBtnClick(e) {
        e.stopPropagation();

        var segObj = W.selectionManager.selectedItems[0];
        var convertedCoords = WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[0].x, segObj.geometry.components[0].y);
        var gpsOffsetAmount = WazeWrap.Geometry.CalculateLongOffsetGPS($('#HorizStretchAmount').val(), convertedCoords.lon, convertedCoords.lat);

        StretchHorizRA(segObj, gpsOffsetAmount, 0);
    }

    //Horizontal contract
    function RAStretchHRightBtnClick(e) {
        e.stopPropagation();

        var segObj = W.selectionManager.selectedItems[0];
        var convertedCoords = WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[0].x, segObj.geometry.components[0].y);
        var gpsOffsetAmount = WazeWrap.Geometry.CalculateLongOffsetGPS(-$('#HorizStretchAmount').val(), convertedCoords.lon, convertedCoords.lat);

        StretchHorizRA(segObj, gpsOffsetAmount, 0);
    }

    //Verical stretch
    function RAStretchVTopBtnClick(e) {
        e.stopPropagation();

        var segObj = W.selectionManager.selectedItems[0];
        var convertedCoords = WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[0].x, segObj.geometry.components[0].y);
        var gpsOffsetAmount = WazeWrap.Geometry.CalculateLongOffsetGPS($('#VertStretchAmount').val(), convertedCoords.lon, convertedCoords.lat);

        StretchHorizRA(segObj, 0, gpsOffsetAmount);
    }

    //vertical contract
    function RAStretchVBottomBtnClick(e) {
        e.stopPropagation();

        var segObj = W.selectionManager.selectedItems[0];
        var convertedCoords = WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[0].x, segObj.geometry.components[0].y);
        var gpsOffsetAmount = WazeWrap.Geometry.CalculateLongOffsetGPS(-$('#VertStretchAmount').val(), convertedCoords.lon, convertedCoords.lat);

        StretchHorizRA(segObj, 0, gpsOffsetAmount);
    }

    //Left
    function RAShiftLeftBtnClick(e) {
        // this traps the click to prevent it falling through to the underlying area name element and potentially causing the map view to be relocated to that area...
        e.stopPropagation();

        //if(!pendingChanges){
        var segObj = W.selectionManager.selectedItems[0];
        var convertedCoords = WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[0].x, segObj.geometry.components[0].y);
        var gpsOffsetAmount = WazeWrap.Geometry.CalculateLongOffsetGPS(-$('#shiftAmount').val(), convertedCoords.lon, convertedCoords.lat);
        ShiftSegmentsNodesLong(segObj, gpsOffsetAmount);
        //}
    }
    //Right
    function RAShiftRightBtnClick(e) {
        // this traps the click to prevent it falling through to the underlying area name element and potentially causing the map view to be relocated to that area...
        e.stopPropagation();

        //if(!pendingChanges){
        var segObj = W.selectionManager.selectedItems[0];
        var convertedCoords = WazeWrap.Geometry.ConvertTo4326(segObj.model.geometry.components[0].x, segObj.model.geometry.components[0].y);
        var gpsOffsetAmount = WazeWrap.Geometry.CalculateLongOffsetGPS($('#shiftAmount').val(), convertedCoords.lon, convertedCoords.lat);
        ShiftSegmentsNodesLong(segObj, gpsOffsetAmount);
        //}
    }
    //Up
    function RAShiftUpBtnClick(e) {
        // this traps the click to prevent it falling through to the underlying area name element and potentially causing the map view to be relocated to that area...
        e.stopPropagation();

        //if(!pendingChanges){
        var segObj = W.selectionManager.selectedItems[0];
        var gpsOffsetAmount = WazeWrap.Geometry.CalculateLatOffsetGPS($('#shiftAmount').val(), WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[0].x, segObj.geometry.components[0].y));
        ShiftSegmentNodesLat(segObj, gpsOffsetAmount);
        //}
    }
    //Down
    function RAShiftDownBtnClick(e) {
        // this traps the click to prevent it falling through to the underlying area name element and potentially causing the map view to be relocated to that area...
        e.stopPropagation();

        //if(!pendingChanges){
        var segObj = W.selectionManager.selectedItems[0];
        var gpsOffsetAmount = WazeWrap.Geometry.CalculateLatOffsetGPS(-$('#shiftAmount').val(), WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[0].x, segObj.geometry.components[0].y));
        ShiftSegmentNodesLat(segObj, gpsOffsetAmount);
        //}
    }
})();

// JavaScript source code
