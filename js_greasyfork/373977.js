// ==UserScript==
// @name         WME Segment Shifter
// @namespace    https://greasyfork.org/en/users/181566-jeffrey-draaijer
// @version      2019-03-01-05
// @description  Providing basic utility for segment shifting
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @author       JDraaijer
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/373977/WME%20Segment%20Shifter.user.js
// @updateURL https://update.greasyfork.org/scripts/373977/WME%20Segment%20Shifter.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */

(function() {

    var SegmentUtilWindow = null;
    var UpdateSegmentGeometry;
    var MoveNode, MultiAction;
    var drc_layer;

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
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }

    bootstrap();


    function init(){
        UpdateSegmentGeometry = require("Waze/Action/UpdateSegmentGeometry");
        MoveNode = require("Waze/Action/MoveNode");
        MultiAction = require("Waze/Action/MultiAction");

        SegmentUtilWindow = document.createElement('div');
        SegmentUtilWindow.id = "SegmentUtilWindow";
        SegmentUtilWindow.style.position = 'fixed';
        SegmentUtilWindow.style.visibility = 'hidden';
        SegmentUtilWindow.style.top = '15%';
        SegmentUtilWindow.style.left = '25%';
        SegmentUtilWindow.style.width = 'auto'; //390px
        SegmentUtilWindow.style.zIndex = 100;
        SegmentUtilWindow.style.backgroundColor = '#BEDCE5';
        SegmentUtilWindow.style.borderWidth = '3px';
        SegmentUtilWindow.style.borderStyle = 'solid';
        SegmentUtilWindow.style.borderRadius = '10px';
        SegmentUtilWindow.style.boxShadow = '5px 5px 10px Silver';
        SegmentUtilWindow.style.padding = '4px';

        var alertsHTML = '<div id="segmentHeader" style="padding: 4px; background-color:#4cc600; font-weight: bold; text-align:center;">Segment Utility <a data-toggle="collapse" href="#divSegmentWrappers" id="collapserSegmentLink" style="float:right"><span id="collapserSegment" style="cursor:pointer;border:thin outset black;padding:2px;" class="fa fa-caret-square-o-up"></a></span></div>';
        alertsHTML += '<div id="divSegmentWrappers" class="collapse in">';
        alertsHTML += '<div id="contentSegmentShift" style="padding: 4px; background-color:White; display:inline-block; border-style:solid; border-width:1px; margin-right:5px;">';
        alertsHTML += 'Shift amount</br><input type="text" name="moveAmount" id="moveAmount" size="1" style="border: 1px solid #000000" value="1"/> meter(s)&nbsp;';

        alertsHTML += '<div id="controlsSegment" style="padding: 4px;">';

        alertsHTML += '<table style="table-layout:fixed; width:60px; height:84px; margin-left:auto;margin-right:auto;">';
        alertsHTML += '<tr style="width:20px;height:28px;">';
        alertsHTML += '<td align="center"></td>';
        alertsHTML += '<td align="center">';
        //Single Shift Buttons
        alertsHTML += '<span id="SegmentShiftUpBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;">';
        alertsHTML += '<i class="fa fa-angle-up"> </i>';
        alertsHTML += '<span id="SegmentUpBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';
        alertsHTML += '<td align="center"></td>';
        alertsHTML += '</tr>';

        alertsHTML += '<tr style="width:20px;height:28px;">';
        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="SegmentShiftLeftBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;padding-right:4px;">';
        alertsHTML += '<i class="fa fa-angle-left"> </i>';
        alertsHTML += '<span id="SegmentLeftBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';

        alertsHTML += '<td align="center"></td>';

        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="SegmentShiftRightBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;padding-left:4px;">';
        alertsHTML += '<i class="fa fa-angle-right"> </i>';
        alertsHTML += '<span id="SegmentRightBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';
        alertsHTML += '</tr>';

        alertsHTML += '<tr style="width:20px;height:28px;">';
        alertsHTML += '<td align="center"></td>';

        alertsHTML += '<td align="center">';
        alertsHTML += '<span id="SegmentShiftDownBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px;">';
        alertsHTML += '<i class="fa fa-angle-down"> </i>';
        alertsHTML += '<span id="SegmentDownBtnCaption" style="font-weight: bold;"></span>';
        alertsHTML += '</span>';
        alertsHTML += '</td>';

        alertsHTML += '<td align="center"></td>';
        alertsHTML += '</tr>';
        alertsHTML += '</table>';
        alertsHTML += '</div></div>';
        alertsHTML += '</div></div>'; //Close divWrapers & outer div

        SegmentUtilWindow.innerHTML = alertsHTML;
        document.body.appendChild(SegmentUtilWindow);

        document.getElementById('SegmentShiftLeftBtn').addEventListener('click', SegmentShiftLeftBtnClick, false);
        document.getElementById('SegmentShiftRightBtn').addEventListener('click', SegmentShiftRightBtnClick, false);
        document.getElementById('SegmentShiftUpBtn').addEventListener('click', SegmentShiftUpBtnClick, false);
        document.getElementById('SegmentShiftDownBtn').addEventListener('click', SegmentShiftDownBtnClick, false);

        $('#moveAmount').keypress(function(event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $('#collapserSegmentLink').click(function(){
            if($('#collapserSegment').attr('class') == "fa fa-caret-square-o-down"){
                $("#collapserSegment").removeClass("fa-caret-square-o-down");
                $("#collapserSegment").addClass("fa-caret-square-o-up");
            }
            else{
                $("#collapserSegment").removeClass("fa-caret-square-o-up");
                $("#collapserSegment").addClass("fa-caret-square-o-down");
            }
            saveSettingsToStorage();
        });

        W.selectionManager.events.register("selectionchanged", null, checkSegmentDisplayTool);

        var loadedSettings = $.parseJSON(localStorage.getItem("WME_SegmentUtil"));
        var defaultSettings = {
            divTop: "15%",
            divLeft: "25%",
            Expanded: true
        };
        _settings = loadedSettings ? loadedSettings : defaultSettings;

        $('#SegmentUtilWindow').css('left', _settings.divLeft);
        $('#SegmentUtilWindow').css('top', _settings.divTop);

        if(!_settings.Expanded){
            $("#divWrappers").removeClass("in");
            $("#divWrappers").addClass("collapse");
            $("#collapserSegment").removeClass("fa-caret-square-o-up");
            $("#collapserSegment").addClass("fa-caret-square-o-down");
        }


    }

    function saveSettingsToStorage() {
        if (localStorage) {
            var settings = {
                divTop: "15%",
                divLeft: "25%",
                Expanded: true
            };

            settings.divLeft = $('#SegmentUtilWindow').css('left');
            settings.divTop = $('#SegmentUtilWindow').css('top');
            settings.Expanded = $("#collapserSegment").attr('class').indexOf("fa-caret-square-o-up") > -1;
            localStorage.setItem("WME_SegmentUtil", JSON.stringify(settings));
        }
    }

    function checkSegmentDisplayTool(){
        if(WazeWrap.hasSelectedFeatures() && WazeWrap.getSelectedFeatures()[0].model.type === 'segment'){
            if(!AllSelectedSegmentsNotRA() || WazeWrap.getSelectedFeatures().length === 0){
                $('#SegmentUtilWindow').css({'visibility': 'hidden'});
            }else{
                $('#SegmentUtilWindow').css({'visibility': 'visible'});
                if(typeof jQuery.ui !== 'undefined'){
                    $('#SegmentUtilWindow' ).draggable({ //Gotta nuke the height setting the dragging inserts otherwise the panel cannot collapse
                        stop: function(event, ui) {
                            $('#SegmentUtilWindow').css("height", "");
                            saveSettingsToStorage();
                        }
                    });
                }
                //checkSaveChanges();
                checkAllEditable(WazeWrap.getSelectedFeatures()[0]);
            }
        }
        else{
            $('#SegmentUtilWindow').css({'visibility': 'hidden'});
            if(typeof jQuery.ui !== 'undefined'){
                $('#SegmentUtilWindow' ).draggable({
                    stop: function(event, ui) {
                        $('#SegmentUtilWindow').css("height", "");
                        saveSettingsToStorage();
                    }
                });
            }
        }
    }

    function checkAllEditable(Segs){
        var $SegmentEditable = $('#SegmentEditable');
        var allEditable = true;
        var segObj, fromNode, toNode;

        segObj = W.model.segments.getObjectById(Segs.model.getID());
        fromNode = segObj.getFromNode();
        toNode = segObj.getToNode();

        if(segObj !== "undefined"){
            if(fromNode && fromNode !== "undefined" && !fromNode.isAllowedToMoveNode()) {
                allEditable = false;
            } else if(toNode && toNode !== "undefined" && !toNode.isAllowedToMoveNode()) {
                allEditable = false;
            }
            var toConnected, fromConnected;

            if(toNode){
                toConnected = toNode.attributes.segIDs;
                for(let j=0;j<toConnected.length;j++){
                    if(W.model.segments.getObjectById(toConnected[j]) !== "undefined") {
                        if(W.model.segments.getObjectById(toConnected[j]).hasClosures()) {
                            allEditable = false;
                        }
                    }
                }
            }

            if(fromNode){
                fromConnected = fromNode.attributes.segIDs;
                for(let j=0;j<fromConnected.length;j++){
                    if(W.model.segments.getObjectById(fromConnected[j]) !== "undefined") {
                        if(W.model.segments.getObjectById(fromConnected[j]).hasClosures()) {
                            allEditable = false;
                        }
                    }
                }
            }
        }
        if(allEditable) {
            $SegmentEditable.remove();
        }else{
            if($SegmentEditable.length === 0){
                $SegmentEditable = $('<div>', {id:'SegmentEditable', style:'color:red'});
                $SegmentEditable.text('One or more segments are locked above your rank or have a closure.');
                $('#SegmentUtilWindow').append($SegmentEditable);
            }
        }
        return allEditable;
    }

    function AllSelectedSegmentsNotRA(){
        for (let i = 0; i < WazeWrap.getSelectedFeatures().length; i++){
            if(WazeWrap.getSelectedFeatures()[i].model.attributes.id < 0 || WazeWrap.Model.isRoundaboutSegmentID(WazeWrap.getSelectedFeatures()[i].model.attributes.id)) {
                return false;
            }
        }
        return true;
    }

    function ShiftSegmentNodesLat(segObj, latOffset, prevSegObj){
        var Segs = segObj;
        var prevSeg = prevSegObj;
        if(checkAllEditable(Segs)){
            var gps;
            var newGeometry = segObj.geometry.clone();
            var originalLength = segObj.geometry.components.length;
            var multiaction = new MultiAction();
            multiaction.setModel(W.model);

            segObj = W.model.segments.getObjectById(Segs.model.getID());
            newGeometry = segObj.geometry.clone();
            originalLength = segObj.geometry.components.length;
            for(j=1; j < originalLength-1; j++){
                gps = WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[j].x, segObj.geometry.components[j].y);
                gps.lat += latOffset;
                newGeometry.components.splice(j,0, new OL.Geometry.Point(segObj.geometry.components[j].x, WazeWrap.Geometry.ConvertTo900913(segObj.geometry.components[j].x,gps.lat).lat));
                newGeometry.components.splice(j+1,1);
            }
            newGeometry.components[0].calculateBounds();
            newGeometry.components[originalLength-1].calculateBounds();
            multiaction.doSubAction(new UpdateSegmentGeometry(segObj, segObj.geometry, newGeometry));

            var nodes = [];
            if (prevSegObj && prevSegObj !== "undefined") {
            	prevSegObj = W.model.segments.getObjectById(prevSeg.model.getID());
                if (segObj.attributes.toNodeID !== prevSegObj.attributes.toNodeID && segObj.attributes.toNodeID !== prevSegObj.attributes.fromNodeID) {
                    nodes.push(W.model.nodes.objects[segObj.attributes.toNodeID]);
                }
            } else {
                nodes.push(W.model.nodes.objects[segObj.attributes.toNodeID]);
            }
            if (prevSegObj && prevSegObj !== "undefined") {
            	prevSegObj = W.model.segments.getObjectById(prevSeg.model.getID());
                if (segObj.attributes.fromNodeID !== prevSegObj.attributes.fromNodeID && segObj.attributes.fromNodeID !== prevSegObj.attributes.toNodeID) {
                    nodes.push(W.model.nodes.objects[segObj.attributes.fromNodeID]);
                }
            } else {
                nodes.push(W.model.nodes.objects[segObj.attributes.fromNodeID]);
            }

            for(let i=0;i<nodes.length;i++){
                var node = nodes[i];
                var newNodeGeometry = node.geometry.clone();
                gps = WazeWrap.Geometry.ConvertTo4326(node.attributes.geometry.x, node.attributes.geometry.y);
                gps.lat += latOffset;
                newNodeGeometry.y = WazeWrap.Geometry.ConvertTo900913(node.geometry.x, gps.lat).lat;
                newNodeGeometry.calculateBounds();

                var connectedSegObjs = {};
                var emptyObj = {};
                for(var j=0;j<node.attributes.segIDs.length;j++){
                    var segid = node.attributes.segIDs[j];
                    connectedSegObjs[segid] = W.model.segments.getObjectById(segid).geometry.clone();
                }
                multiaction.doSubAction(new MoveNode(node, node.geometry, newNodeGeometry,connectedSegObjs,emptyObj));
            }
            W.model.actionManager.add(multiaction);
        }
    }

    function ShiftSegmentsNodesLong(segObj, longOffset, prevSegObj){
        var Segs = segObj;
        var prevSeg = prevSegObj;
        if(checkAllEditable(Segs)){
            var gps, newGeometry, originalLength;
            var multiaction = new MultiAction();
            multiaction.setModel(W.model);
            segObj = W.model.segments.getObjectById(Segs.model.getID());
            newGeometry = segObj.geometry.clone();
            originalLength = segObj.geometry.components.length;
            for(let j=1; j < originalLength-1; j++){
                gps = WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[j].x, segObj.geometry.components[j].y);
                gps.lon += longOffset;
                newGeometry.components.splice(j,0, new OL.Geometry.Point(WazeWrap.Geometry.ConvertTo900913(gps.lon, segObj.geometry.components[j].y).lon, segObj.geometry.components[j].y));
                newGeometry.components.splice(j+1,1);
            }
            newGeometry.components[0].calculateBounds();
            newGeometry.components[originalLength-1].calculateBounds();
            multiaction.doSubAction(new UpdateSegmentGeometry(segObj, segObj.geometry, newGeometry));

            var nodes = [];
            if (prevSegObj && prevSegObj !== 'undefined') {
            	prevSegObj = W.model.segments.getObjectById(prevSeg.model.getID());
                if (segObj.attributes.toNodeID != prevSegObj.attributes.toNodeID && segObj.attributes.toNodeID !== prevSegObj.attributes.fromNodeID) {
                    nodes.push(W.model.nodes.objects[segObj.attributes.toNodeID]);
                }
            } else {
                nodes.push(W.model.nodes.objects[segObj.attributes.toNodeID]);
            }
            if (prevSegObj && prevSegObj !== 'undefined') {
            	prevSegObj = W.model.segments.getObjectById(prevSeg.model.getID());
                if (segObj.attributes.fromNodeID != prevSegObj.attributes.fromNodeID && segObj.attributes.fromNodeID !== prevSegObj.attributes.toNodeID) {
                    nodes.push(W.model.nodes.objects[segObj.attributes.fromNodeID]);
                }
            } else {
                nodes.push(W.model.nodes.objects[segObj.attributes.fromNodeID]);
            }

            for(let i=0;i<nodes.length;i++){
                var node = nodes[i];
                var newNodeGeometry = node.geometry.clone();
                gps = WazeWrap.Geometry.ConvertTo4326(node.attributes.geometry.x, node.attributes.geometry.y);
                gps.lon += longOffset;
                newNodeGeometry.x = WazeWrap.Geometry.ConvertTo900913(gps.lon, node.geometry.y).lon;
                newNodeGeometry.calculateBounds();

                var connectedSegObjs = {};
                var emptyObj = {};
                for(let j=0;j<node.attributes.segIDs.length;j++){
                    var segid = node.attributes.segIDs[j];
                    connectedSegObjs[segid] = W.model.segments.getObjectById(segid).geometry.clone();
                }
                multiaction.doSubAction(new MoveNode(node, node.geometry, newNodeGeometry, connectedSegObjs, emptyObj));
            }
            W.model.actionManager.add(multiaction);
        }
    }


    //Left
    function SegmentShiftLeftBtnClick(e){
        // this traps the click to prevent it falling through to the underlying area name element and potentially causing the map view to be relocated to that area...
        e.stopPropagation();

        var Segs = WazeWrap.getSelectedFeatures();
        //Loop through all segments & adjust
        for(let i=0; i<Segs.length; i++){
            var prevSegObj;
            if (i > 0) {
                prevSegObj = WazeWrap.getSelectedFeatures()[i-1];
            }
            var segObj = WazeWrap.getSelectedFeatures()[i];
            var shiftAmount = -$('#moveAmount').val();
            var convertedCoords = WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[0].x, segObj.geometry.components[0].y);
            var gpsOffsetAmount = WazeWrap.Geometry.CalculateLongOffsetGPS(shiftAmount, convertedCoords.lon, convertedCoords.lat);
            ShiftSegmentsNodesLong(segObj, gpsOffsetAmount,prevSegObj);
        }
        //}
    }
    //Right
    function SegmentShiftRightBtnClick(e){
        // this traps the click to prevent it falling through to the underlying area name element and potentially causing the map view to be relocated to that area...
        e.stopPropagation();

        var Segs = WazeWrap.getSelectedFeatures();
        //Loop through all segments & adjust
        for(let i=0; i<Segs.length; i++){
            var prevSegObj;
            if (i > 0) {
                prevSegObj = WazeWrap.getSelectedFeatures()[i-1];
            }
            var segObj = WazeWrap.getSelectedFeatures()[i];
            var shiftAmount = $('#moveAmount').val();
            var convertedCoords = WazeWrap.Geometry.ConvertTo4326(segObj.model.geometry.components[0].x, segObj.model.geometry.components[0].y);
            var gpsOffsetAmount = WazeWrap.Geometry.CalculateLongOffsetGPS(shiftAmount, convertedCoords.lon, convertedCoords.lat);
            ShiftSegmentsNodesLong(segObj, gpsOffsetAmount,prevSegObj);
        }
    }
    //Up
    function SegmentShiftUpBtnClick(e){
        // this traps the click to prevent it falling through to the underlying area name element and potentially causing the map view to be relocated to that area...
        e.stopPropagation();

        var Segs = WazeWrap.getSelectedFeatures();
        //Loop through all segments & adjust
        for(let i=0; i<Segs.length; i++){
            var prevSegObj;
            if (i > 0) {
                prevSegObj = WazeWrap.getSelectedFeatures()[i-1];
            }
            var segObj = WazeWrap.getSelectedFeatures()[i];
            var shiftAmount = $('#moveAmount').val();
            var gpsOffsetAmount = WazeWrap.Geometry.CalculateLatOffsetGPS(shiftAmount, WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[0].x, segObj.geometry.components[0].y));
            ShiftSegmentNodesLat(segObj, gpsOffsetAmount,prevSegObj);
        }
    }
    //Down
    function SegmentShiftDownBtnClick(e){
        // this traps the click to prevent it falling through to the underlying area name element and potentially causing the map view to be relocated to that area...
        e.stopPropagation();

        var Segs = WazeWrap.getSelectedFeatures();
        //Loop through all segments & adjust
        for(let i=0; i<Segs.length; i++){
            var prevSegObj;
            if (i > 0) {
                prevSegObj = WazeWrap.getSelectedFeatures()[i-1];
            }
            var segObj = WazeWrap.getSelectedFeatures()[i];
            var shiftAmount = -$('#moveAmount').val();
            var gpsOffsetAmount = WazeWrap.Geometry.CalculateLatOffsetGPS(shiftAmount, WazeWrap.Geometry.ConvertTo4326(segObj.geometry.components[0].x, segObj.geometry.components[0].y));
            ShiftSegmentNodesLat(segObj, gpsOffsetAmount,prevSegObj);
        }
    }

})();