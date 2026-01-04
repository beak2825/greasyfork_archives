// ==UserScript==
// @name         WAZEPT Segments Mod for NP
// @version      2025.12.28.01
// @description  Facilitates the standardisation of segments for left-hand traffic AKA right-hand-driving
// @author       kid4rm90s
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/560385/code/WazeToastr.js
// @namespace https://greasyfork.org/users/1087400
/* 
Original Author Thanks : J0N4S13 (jonathanserrario@gmail.com)
*/
// @downloadURL https://update.greasyfork.org/scripts/491466/WAZEPT%20Segments%20Mod%20for%20NP.user.js
// @updateURL https://update.greasyfork.org/scripts/491466/WAZEPT%20Segments%20Mod%20for%20NP.meta.js
// ==/UserScript==
/* Changelog
 Patch for multiple segments unable to be connected together after the split
*/

(function () {
    'use strict';
  const updateMessage = `<strong>Fixed :</strong><br> - Added segment distance options 12m, 40m, 42m, 45m.<br><br> <em>Happy Mapping!</em>`;
  const scriptName = GM_info.script.name;
  const scriptVersion = GM_info.script.version;
  const downloadUrl = GM_info.script.downloadURL;
  const forumURL = 'https://greasyfork.org/en/scripts/491466-wazept-segments-mod-for-np/feedback';

    var roads_id = [3,4,6,7,2,1,22,8,20,17,15,18,19];
    var pedonal_id = [5,10,16];
    // var array_config_country = {};
    var language = {
        btnSplit: "Split the segments",
        strMeters: "m",
        strDistance: "Distance between the two parallel segments:",
        strSelMoreSeg: "Since you have more than 1 segment selected, to use this function make sure that you have selected segments sequentially (from one end to the other) and after executing the script, VERIFY the result obtained."
    };
    // var indexselected = "";
    // var array_roads = {};
    var last_node_A = null;
    var last_node_B = null;
    var last_coord_left_first = null;
    var last_coord_left_last = null;
    var last_coord_right_first = null;
    var last_coord_right_last = null;
    var sentido_base = null;

    function bootstrap() {
        if (typeof W === 'object' && W.userscripts?.state.isReady) {
            init();
        } else {
            document.addEventListener('wme-ready', init, { once: true });
        }
    }

    function init() {
        setTimeout(() => {
            W.selectionManager.events.register('selectionchanged', null, selectedFeature);
            selectedFeature();
        }, 250);

    }

    function selectedFeature(){
        var typeData = null;
        setTimeout(() => {
            if(typeof W.selectionManager.getSelectedFeatures()[0] != 'undefined')
                typeData = W.selectionManager.getSelectedFeatures()[0]._wmeObject.type;
            if (typeData == "segment")
            {
                myTimer();
                if(W.loginManager.getUserRank() >= 3)
                    insertButtons();
            }
        }, 100)
    }

/*
    function getConfigsCountry(link) {
        let timeout = 0;
        return new Promise(resolve => {

            fetch(link)
                .then(res => res.text())
                .then(text => {
                const json = JSON.parse(text.substr(47).slice(0, -2))

                $(json.table.rows).each(function(){
                    if(verifyNull(this["c"][0]) == true)
                    {
                        var elem = [verifyNull(this["c"][4]), verifyNull(this["c"][5]), verifyNull(this["c"][6]), verifyNull(this["c"][7]), verifyNull(this["c"][8])];
                        array_config_country[verifyNull(this["c"][1])] = elem;
                        array_roads[verifyNull(this["c"][1])] = [verifyNull(this["c"][2]), verifyNull(this["c"][3])];
                    }
                });
            })

            var timer = setInterval(check_data, 100);

            function check_data() {
                if(Object.keys(array_config_country).length > 0 || timeout >= 20)
                {
                    clearInterval(timer);
                    resolve('true');
                }
                timeout = timeout + 1;
            }
        });
    }
*/


    function myTimer() {

        var n_bloqueio;
        var nivel;
        var lvl_atual;
        var lvl_max;

            if (!$("#signsroad").length) {
                var signsroad = document.createElement("div");
                signsroad.id = 'signsroad';

                
                var btnAB = document.createElement("button");
                btnAB.innerHTML = 'A->B';
                btnAB.id = 'btnAB';
                btnAB.style.cssText = 'height: 20px;font-size:11px';

                btnAB.onclick = function() {
                    let myRoad = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes;
                    if(myRoad.fwdDirection == true) //A to B
                    {
                        let center = new OpenLayers.LonLat(W.map.getCenter().lon, W.map.getCenter().lat)
                        .transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
                        var $temp = $("<input>");
                        $("body").append($temp);
                        $temp.val(center.lon.toString().slice(0,8) + "," + center.lat.toString().slice(0,8) + "|" + W.selectionManager.getSelectedFeatures()[0]["attributes"]["wazeFeature"]["_wmeObject"]["attributes"]["attributes"]["id"] + "|" + "TRUE" + "|" + getPermalink() + "|" + myRoad.fromNodeID + "|" + myRoad.toNodeID).select();
                        document.execCommand("copy");
                        $temp.remove();
                    }
                }

                var btnBA = document.createElement("button");
                btnBA.innerHTML = 'B->A';
                btnBA.id = 'btnBA';
                btnBA.style.cssText = 'height: 20px;font-size:11px';

                btnBA.onclick =  function() {
                    let myRoad = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes;
                    if(myRoad.revDirection == true) //B to A
                    {
                        let center = new OpenLayers.LonLat(W.map.getCenter().lon, W.map.getCenter().lat)
                        .transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
                        var $temp = $("<input>");
                        $("body").append($temp);
                        $temp.val(center.lon.toString().slice(0,8) + "," + center.lat.toString().slice(0,8) + "|" + W.selectionManager.getSelectedFeatures()[0]["attributes"]["wazeFeature"]["_wmeObject"]["attributes"]["id"] + "|" + "FALSE" + "|" + getPermalink() + "|" + myRoad.toNodeID + "|" + myRoad.fromNodeID).select();
                        document.execCommand("copy");
                        $temp.remove();
                    }
                }

                var divSentidos = document.createElement("div");
                divSentidos.id = 'divSentidos';
                divSentidos.appendChild(btnAB);
                divSentidos.appendChild(btnBA);

                var divLandmarkScript = document.createElement("div");
                divLandmarkScript.id = 'divLandmarkScript';
                divLandmarkScript.style.cssText = 'float:left;';
                divLandmarkScript.appendChild(signsroad);
                divLandmarkScript.appendChild(divSentidos);

                $("div #segment-edit-general").prepend(divLandmarkScript);
                $( "#divSentidos" ).hide();
            }
    }

    // function defineSpeed (segment, speed) {
    //     let UpdateObject= require("Waze/Action/UpdateObject");
    //     if(segment.attributes.fwdMaxSpeed == null && segment.attributes.fwdMaxSpeed == null)
    //         W.model.actionManager.add(new UpdateObject(segment, {'fwdMaxSpeed': speed, 'revMaxSpeed': speed}));
    //     else if(segment.attributes.fwdMaxSpeed == null)
    //         W.model.actionManager.add(new UpdateObject(segment, {'fwdMaxSpeed': speed}));
    //     else if(segment.attributes.fwdMaxSpeed == null)
    //         W.model.actionManager.add(new UpdateObject(segment, {'revMaxSpeed': speed}));
    // }

    // function defineRoadType (segment, type) {
    //     let UpdateObject= require("Waze/Action/UpdateObject");
    //     W.model.actionManager.add(new UpdateObject(segment, {'roadType': type}));
    // }

    // function defineLockRankRoad (segment, rank) {
    //     let UpdateObject= require("Waze/Action/UpdateObject");
    //     rank--;
    //     var bloquear;
    //     if(W.loginManager.user.rank >= rank)
    //         bloquear = rank;
    //     else
    //         bloquear = W.loginManager.user.rank;
    //     let lock = segment.attributes.lockRank;
    //     if(lock < bloquear)
    //         W.model.actionManager.add(new UpdateObject(segment, {'lockRank': bloquear}));
    // }


    // function convertSegmentType(segment) {
    //     let AddSegment = require("Waze/Action/AddSegment");
    //     let FeatureVectorSegment = require("Waze/Feature/Vector/Segment");
    //     let DeleteSegment = require("Waze/Action/DeleteSegment");
    //     let ModifyAllConnections = require("Waze/Action/ModifyAllConnections");
    //     let UpdateObject = require("Waze/Action/UpdateObject");
    //     let ConnectSegment = require("Waze/Action/ConnectSegment");

    //     var newseg1=new FeatureVectorSegment({geoJSONGeometry:W.userscripts.toGeoJSONGeometry(segment.attributes.geometry)});

    //     newseg1.copyAttributes(segment);

    //     newseg1.attributes.roadType=parseInt(array_config_country[indexselected][2]);
    //     newseg1.attributes.lockRank=null;
    //     newseg1.setID(null);

    //     W.model.actionManager.add(new DeleteSegment(segment));

    //     let action = new AddSegment(newseg1);
    //     W.model.actionManager.add(action);

    //     let seg = W.model.segments.getObjectById(action.segment.attributes.id);
    //     if(roads_id.includes(seg.attributes.roadType))
    //     {
    //         W.model.actionManager.add(new UpdateObject(seg,{fwdTurnsLocked:true,revTurnsLocked:true}))
    //         if(seg.getFromNode() != null)
    //             W.model.actionManager.add(new ConnectSegment(seg.getFromNode(),newseg1));
    //         if(seg.getToNode() != null)
    //             W.model.actionManager.add(new ConnectSegment(seg.getToNode(),newseg1));
    //         if(seg.getFromNode() != null)
    //             W.model.actionManager.add(new ModifyAllConnections(seg.getFromNode(),true));
    //         if(seg.getToNode() != null)
    //             W.model.actionManager.add(new ModifyAllConnections(seg.getToNode(),true));
    //     }

    //     return seg;
    // }

    // Split Segments

    function insertButtons() {

        if (typeof W.loginManager != 'undefined' && !W.loginManager.isLoggedIn()) {
            return;
        }

        if (W.selectionManager.getSelectedFeatures().length === 0)
            return;

        let exit = false;
        $.each(W.selectionManager.getSelectedFeatures(), function(i, segment) {
            if(segment._wmeObject.attributes.fwdLaneCount != 0 || segment._wmeObject.attributes.revLaneCount != 0)
                exit = true;
            if(segment._wmeObject.attributes.fwdDirection == false || segment._wmeObject.attributes.revDirection == false)
                exit = true;
            if(pedonal_id.includes(segment._wmeObject.attributes.roadType))
                exit = true;
        });

        if(exit)
            return;

        try {
            if (document.getElementById('split-segment') !== null)
                return;
        } catch (e) {}

        var btn1 = $('<wz-button color="secondary" size="sm" style="float:right;margin-top: 5px;">' + language.btnSplit + '</wz-button>');
        btn1.click(mainSplitSegments);

        var strMeters = language.strMeters;

        var selSegmentsDistance = $('<wz-select id="segmentsDistance" data-type="numeric" value="5" style="width: 45%;float:left;" />');
        selSegmentsDistance.append($('<wz-option value="5">5 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="7">7 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="9">9 ' + strMeters + '</wz-option>'));
		selSegmentsDistance.append($('<wz-option value="10">10 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="11">11 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="12">12 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="13">13 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="14">14 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="15">15 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="17">17 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="19">19 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="21">21 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="23">23 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="25">25 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="37">37 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="40">40 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="42">42 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="45">45 ' + strMeters + '</wz-option>'));

        var cnt = $('<div id="split-segment" class="form-group" style="display: flex;" />');

        var divGroup1 = $('<div/>');
        divGroup1.append($('<wz-label>' + language.strDistance + '</wz-label>'));
        divGroup1.append(selSegmentsDistance);
        divGroup1.append(btn1);
        //var divControls1 = $('<div class="controls-container" />');
        //divGroup1.append(divControls1);
        cnt.append(divGroup1);

        /*var divGroup2 = $('<div/>');
        var divControls2 = $('<div class="btn-toolbar" />');
        divControls2.append(btn1);
        divGroup2.append(divControls2);
        cnt.append(divGroup2);*/
		
//creates form at edit panel side

        $(cnt).insertAfter("#segment-edit-general .attributes-form");

        $("#segmentsDistance").val(localStorage.getItem("metersSplitSegment"));

        $('#segmentsDistance').change(function(){
            localStorage.setItem("metersSplitSegment", $("#segmentsDistance").val());
        });
    }

    function orderSegments() {
        var segmentosOrdenados = [];
        var nos = [];
        var noSeguinte = null;
        $.each(W.selectionManager.getSelectedFeatures(), function(i1, segment) {
            if(nos.length > 0)
            {
                let fromExiste = false;
                let toExiste = false;
                $.each(nos, function(i2, no1) {
                    let no = null;
                    if(no1[0] == segment._wmeObject.attributes.fromNodeID)
                    {
                        no1[1] = 2;
                        fromExiste = true;
                    }

                    if(no1[0] == segment._wmeObject.attributes.toNodeID)
                    {
                        no1[1] = 2;
                        toExiste = true;
                    }
                });
                if(!fromExiste)
                    nos.push([segment._wmeObject.attributes.fromNodeID,1]);
                if(!toExiste)
                    nos.push([segment._wmeObject.attributes.toNodeID,1]);
            }
            else
            {
                nos.push([segment._wmeObject.attributes.fromNodeID,1]);
                nos.push([segment._wmeObject.attributes.toNodeID,1]);
            }
        });

        let segmentos = W.selectionManager.getSelectedFeatures().length;

        $.each(nos, function(i, no) {
            if(no[1] == 1)
            {
                noSeguinte = no[0];
                return false;
            }
        });

        while(segmentos > 0)
        {
            $.each(W.selectionManager.getSelectedFeatures(), function(i, segment) {
                if(segment._wmeObject.attributes.fromNodeID == noSeguinte)
                {
                    segmentosOrdenados.push(segment._wmeObject.attributes.id);
                    noSeguinte = segment._wmeObject.attributes.toNodeID;
                    segmentos--;
                }
                else if(segment._wmeObject.attributes.toNodeID == noSeguinte)
                {
                    segmentosOrdenados.push(segment._wmeObject.attributes.id);
                    noSeguinte = segment._wmeObject.attributes.fromNodeID;
                    segmentos--;
                }
            });
        }

        return segmentosOrdenados;
    }

    function mainSplitSegments() {

        if (W.selectionManager.getSelectedFeatures().length > 1) {
            WazeToastr.Alerts.confirm(
                scriptName,
                language.strSelMoreSeg,
                function() { executeSplit(); },
                function() { return; },
                "Continue",
                "Cancel"
            );
            return;
        }

        executeSplit();
    }

    function executeSplit() {
        var AddNode= require("Waze/Action/AddNode");
        var UpdateObject= require("Waze/Action/UpdateObject");
        var ModifyAllConnections= require("Waze/Action/ModifyAllConnections");
        var distancia = $("#segmentsDistance").val();
        var no = null;
        var seg_left = [];
        var seg_right = [];

        last_node_A = null;
        last_node_B = null;
        last_coord_left_first = null;
        last_coord_left_last = null;
        last_coord_right_first = null;
        last_coord_right_last = null;
        sentido_base = null;

        let segmentosOrdenados = orderSegments();
        let actionsToAdd = []; // Collect all actions first

        // Create a custom action wrapper to delay getAffectedUniqueIds calls
        function AddNodeWrapper(point, segments, options) {
            var AddNode = require("Waze/Action/AddNode");
            var baseAction = new AddNode(point, segments, options);
            
            // Override getAffectedUniqueIds to delay its execution
            var originalGetAffectedUniqueIds = baseAction.getAffectedUniqueIds;
            baseAction.getAffectedUniqueIds = function(dataModel) {
                if (this.node) {
                    return originalGetAffectedUniqueIds.call(this, dataModel);
                } else {
                    // Return empty array if node hasn't been created yet
                    return [];
                }
            };
            
            return baseAction;
        }

        $.each(segmentosOrdenados, function(i, idsegment) {
            var segment = W.model.segments.getObjectById(idsegment);
            let action_left = null;
            let action_right = null;
            if(last_node_A != null && last_node_B != null)
            {
                if(last_node_A == segment.getToNode())
                    no = "AB";
                if(last_node_B == segment.getFromNode())
                    no = "BA";
                if(last_node_A == segment.getFromNode())
                    no = "AA";
                if(last_node_B == segment.getToNode())
                    no = "BB";
                if(i == 1)
                {
                    if(no == "AB" || no == "AA")
                        sentido_base = "BA";
                    if(no == "BA" || no == "BB")
                        sentido_base = "AB";
                }
            }
            if(no == "AA" || no == "BB")
            {
                last_node_A = segment.getToNode();
                last_node_B = segment.getFromNode();
            }
            else
            {
                last_node_A = segment.getFromNode();
                last_node_B = segment.getToNode();
            }
            var segments = createSegments(segment, distancia, no);

            if(i > 0)
            {
                if(no == "BA")
                {
                    // BA: left uses first point, right uses last point (reversed geometry)
                    action_left = AddNodeWrapper(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[0]).attributes.geometry.components[0]),[W.model.segments.getObjectById(seg_left[seg_left.length - 1]), W.model.segments.getObjectById(segments[0])]);
                    actionsToAdd.push(action_left);

                    action_right = AddNodeWrapper(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[1]).attributes.geometry.components[W.model.segments.getObjectById(segments[1]).attributes.geometry.components.length - 1]),[W.model.segments.getObjectById(seg_right[seg_right.length - 1]), W.model.segments.getObjectById(segments[1])]);
                    actionsToAdd.push(action_right);
                }
                if(no == "BB")
                {
                    // BB: After swap, connect like BA
                    action_left = AddNodeWrapper(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[0]).attributes.geometry.components[0]),[W.model.segments.getObjectById(seg_left[seg_left.length - 1]), W.model.segments.getObjectById(segments[0])]);
                    actionsToAdd.push(action_left);

                    action_right = AddNodeWrapper(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[1]).attributes.geometry.components[W.model.segments.getObjectById(segments[1]).attributes.geometry.components.length - 1]),[W.model.segments.getObjectById(seg_right[seg_right.length - 1]), W.model.segments.getObjectById(segments[1])]);
                    actionsToAdd.push(action_right);
                }
                if(no == "AB")
                {
                    // AB: left uses last point, right uses first point (reversed geometry)
                    action_left = AddNodeWrapper(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[0]).attributes.geometry.components[W.model.segments.getObjectById(segments[0]).attributes.geometry.components.length - 1]),[W.model.segments.getObjectById(seg_left[seg_left.length - 1]), W.model.segments.getObjectById(segments[0])]);
                    actionsToAdd.push(action_left);

                    action_right = AddNodeWrapper(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[1]).attributes.geometry.components[0]),[W.model.segments.getObjectById(seg_right[seg_right.length - 1]), W.model.segments.getObjectById(segments[1])]);
                    actionsToAdd.push(action_right);
                }
                if(no == "AA")
                {
                    // AA: After swap, connect like AB
                    action_left = AddNodeWrapper(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[0]).attributes.geometry.components[W.model.segments.getObjectById(segments[0]).attributes.geometry.components.length - 1]),[W.model.segments.getObjectById(seg_left[seg_left.length - 1]), W.model.segments.getObjectById(segments[0])]);
                    actionsToAdd.push(action_left);

                    action_right = AddNodeWrapper(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[1]).attributes.geometry.components[0]),[W.model.segments.getObjectById(seg_right[seg_right.length - 1]), W.model.segments.getObjectById(segments[1])]);
                    actionsToAdd.push(action_right);
                }
            }
            actionsToAdd.push(new UpdateObject(W.model.segments.getObjectById(segments[0]),{fwdTurnsLocked:true,revTurnsLocked:true}));
            actionsToAdd.push(new UpdateObject(W.model.segments.getObjectById(segments[1]),{fwdTurnsLocked:true,revTurnsLocked:true}));
            seg_left.push(segments[0]);
            seg_right.push(segments[1]);
        });

        // Add all actions
        actionsToAdd.forEach(function(action) {
            W.model.actionManager.add(action);
        });

        let additionalActions = []; // New array for remaining actions	

        // Modify connections for all left segments		
        $.each(seg_left, function(i, segmentos_left) {
                let segment = W.model.segments.getObjectById(segmentos_left)
            if(segment) {
                // Allow turns at both ends of each segment
                if(segment.getFromNode() != null)
                    additionalActions.push(new ModifyAllConnections(segment.getFromNode(),true));
                if(segment.getToNode() != null)
                    additionalActions.push(new ModifyAllConnections(segment.getToNode(),true));
            }
        });
        
        // Modify connections for all right segments
        $.each(seg_right, function(i, segmentos_right) {
                let segment = W.model.segments.getObjectById(segmentos_right)
            if(segment) {
                // Allow turns at both ends of each segment
                if(segment.getFromNode() != null)
                    additionalActions.push(new ModifyAllConnections(segment.getFromNode(),true));
                if(segment.getToNode() != null)
                    additionalActions.push(new ModifyAllConnections(segment.getToNode(),true));
            }
        });

        // Add the remaining actions
        additionalActions.forEach(function(action) {
            W.model.actionManager.add(action);
        });

        // Show success message
        WazeToastr.Alerts.success(scriptName, `Successfully split ${seg_left.length} segment${seg_left.length > 1 ? 's' : ''} with ${distancia}m gap!`);
    }

    function createSegments(sel, displacement, no) {
        var wazefeatureVectorSegment = require("Waze/Feature/Vector/Segment");
        var UpdateSegmentGeometry= require("Waze/Action/UpdateSegmentGeometry");
        var UpdateObject= require("Waze/Action/UpdateObject");

        var streetVertices = sel.geometry.simplify(0.001).getVertices();
        var leftPoints = null;
        var rightPoints = null;

        var i;
        var leftPa,
            rightPa,
            leftPb,
            rightPb;
        var prevLeftEq,
            prevRightEq;

        var first = 0;

        for (i = first; i < streetVertices.length - 1; i++) {
            var pa = streetVertices[i];
            var pb = streetVertices[i + 1];

            var points = [pa, pb];
            var ls = new OpenLayers.Geometry.LineString(points);
            var len = ls.getGeodesicLength(W.map.getProjectionObject());
            var scale = (len + displacement / 2) / len;

            leftPa = pa.clone();
            leftPa.resize(scale, pb, 1);
            rightPa = leftPa.clone();
            // Swap rotations for left-handed drive (driving on the left)
            leftPa.rotate(-90, pa);  // Was 90, now -90
            rightPa.rotate(90, pa);  // Was -90, now 90

            leftPb = pb.clone();
            leftPb.resize(scale, pa, 1);
            rightPb = leftPb.clone();
            leftPb.rotate(90, pb);   // Was -90, now 90
            rightPb.rotate(-90, pb); // Was 90, now -90

            var leftEq = getEquation({
                'x1': leftPa.x,
                'y1': leftPa.y,
                'x2': leftPb.x,
                'y2': leftPb.y
            });
            var rightEq = getEquation({
                'x1': rightPa.x,
                'y1': rightPa.y,
                'x2': rightPb.x,
                'y2': rightPb.y
            });
            if (leftPoints === null && rightPoints === null) {
                leftPoints = [leftPa];
                rightPoints = [rightPa];
            } else {
                var li = intersectX(leftEq, prevLeftEq);
                var ri = intersectX(rightEq, prevRightEq);
                if (li && ri) {
                    if (i >= 0) {
                        leftPoints.unshift(li);
                        rightPoints.push(ri);

                        if (i == 0) {
                            leftPoints = [li];
                            rightPoints = [ri];
                        }
                    }
                } else {
                    if (i >= 0) {
                        leftPoints.unshift(leftPb.clone());
                        rightPoints.push(rightPb.clone());

                        if (i == 0) {
                            leftPoints = [leftPb];
                            rightPoints = [rightPb];
                        }
                    }
                }
            }

            prevLeftEq = leftEq;
            prevRightEq = rightEq;

        }
        leftPoints.push(leftPb);
        rightPoints.push(rightPb);

        leftPoints.unshift(leftPoints[leftPoints.length-1]);
        leftPoints.pop();

        var newSegEsq = sel.attributes.geometry.clone();
        var newSegDir = sel.attributes.geometry.clone();

        var segmentos = SplitSegment(sel);

        leftPoints = leftPoints.reverse();

        // Reverse right points so both segments flow in the same direction (A->B)
        rightPoints = rightPoints.reverse();

        // For left-handed drive with rotation swap, AA/BB need different handling
        if(no == "AA" || no == "BB")
        {
            // Swap left and right (already reversed, so just swap without additional reversal)
            let aux = leftPoints;
            leftPoints = rightPoints;
            rightPoints = aux;
        }

        if(last_coord_left_first != null && last_coord_left_last != null && last_coord_right_last != null && last_coord_right_first != null)
        {
            if(no == "AB")
            {
                // AB: segments flow in same direction
                leftPoints.pop();
                leftPoints.push(last_coord_left_first);
                // Right segment is reversed, so we connect the beginning (first element after reversal) to previous end
                rightPoints.shift();
                rightPoints.unshift(last_coord_right_last);
            }
            if(no == "BA")
            {
                // BA: segments flow in same direction but from opposite end
                leftPoints.shift();
                leftPoints.unshift(last_coord_left_last);
                // Right segment is reversed, so we connect the end (last element after reversal) to previous beginning
                rightPoints.pop();
                rightPoints.push(last_coord_right_first);
            }
            if(no == "AA")
            {
                // AA: second segment connects at start nodes (flipped)
                // After swap, left and right are swapped, so we need opposite connection
                leftPoints.pop();
                leftPoints.push(last_coord_left_first);
                rightPoints.shift();
                rightPoints.unshift(last_coord_right_last);
            }
            if(no == "BB")
            {
                // BB: second segment connects at end nodes (flipped)
                // After swap, left and right are swapped, so we need opposite connection
                leftPoints.shift();
                leftPoints.unshift(last_coord_left_last);
                rightPoints.pop();
                rightPoints.push(last_coord_right_first);
            }
        }

        newSegEsq.components = leftPoints;
        newSegDir.components = rightPoints;

        // Cache coordinates - right segment is reversed, so first/last are swapped
        last_coord_left_first = leftPoints[0];
        last_coord_left_last = leftPoints[leftPoints.length - 1];
        // For right segment: reversed geometry means first point is at index 0 (which is the "end"), 
        // and last point is at length-1 (which is the "beginning")
        last_coord_right_first = rightPoints[0];  // This is actually the end of the original right segment
        last_coord_right_last = rightPoints[rightPoints.length - 1];  // This is actually the start

        var leftsegment = W.model.segments.getObjectById(segmentos[0]);
        var rightsegment = W.model.segments.getObjectById(segmentos[1]);

        W.model.actionManager.add(new UpdateSegmentGeometry(leftsegment,leftsegment.attributes.geoJSONGeometry,W.userscripts.toGeoJSONGeometry(newSegEsq)));
        W.model.actionManager.add(new UpdateSegmentGeometry(rightsegment,rightsegment.attributes.geoJSONGeometry,W.userscripts.toGeoJSONGeometry(newSegDir)));

        // Both segments now flow in the same direction (A->B)
        // Left segment: forward only (A->B)
        // Right segment: forward only (A->B, geometry already reversed)
        if(no == "AA" || no == "BB")
        {
            W.model.actionManager.add(new UpdateObject(rightsegment, {'revDirection': false, 'fwdMaxSpeed': rightsegment.attributes.revMaxSpeed, 'revMaxSpeed': rightsegment.attributes.fwdMaxSpeed}));
            W.model.actionManager.add(new UpdateObject(leftsegment, {'revDirection': false, 'fwdMaxSpeed': leftsegment.attributes.revMaxSpeed, 'revMaxSpeed': leftsegment.attributes.fwdMaxSpeed}));
        }
        else
        {
            W.model.actionManager.add(new UpdateObject(rightsegment, {'revDirection': false}));
            W.model.actionManager.add(new UpdateObject(leftsegment, {'revDirection': false}));
        }

        return segmentos;

    }

    function getEquation(segment) {
        if (segment.x2 == segment.x1)
            return {
                'x': segment.x1
            };

        var slope = (segment.y2 - segment.y1) / (segment.x2 - segment.x1);
        var offset = segment.y1 - (slope * segment.x1);
        return {
            'slope': slope,
            'offset': offset
        };
    }


    function intersectX(eqa, eqb, defaultPoint) {
        if ("number" == typeof eqa.slope && "number" == typeof eqb.slope) {
            if (eqa.slope == eqb.slope)
                return null;

            var ix = (eqb.offset - eqa.offset) / (eqa.slope - eqb.slope);
            var iy = eqa.slope * ix + eqa.offset;
            return new OpenLayers.Geometry.Point(ix, iy);
        } else if ("number" == typeof eqa.x) {
            return new OpenLayers.Geometry.Point(eqa.x, eqb.slope * eqa.x + eqb.offset);
        } else if ("number" == typeof eqb.y) {
            return new OpenLayers.Geometry.Point(eqb.x, eqa.slope * eqb.x + eqa.offset);
        }
        return null;
    }


    function SplitSegment(road)
    {
        let SplitSegments= require("Waze/Action/SplitSegments");
        let UpdateSegmentGeometry= require("Waze/Action/UpdateSegmentGeometry");

        if(road.arePropertiesEditable())
        {
            var geo=road.geometry.clone();
            var action=null;
            if(geo.components.length<2)
            {
                return undefined;
            }
            if(geo.components.length==2)
            {
                geo.components.splice(1,0,new OpenLayers.Geometry.Point(((geo.components[1].x+geo.components[0].x)/2),((geo.components[1].y+geo.components[0].y)/2)));
                W.model.actionManager.add(new UpdateSegmentGeometry(road,road.attributes.geoJSONGeometry,W.userscripts.toGeoJSONGeometry(geo)));
            }
            action=new SplitSegments(road,{splitAtPoint:W.userscripts.toGeoJSONGeometry(road.attributes.geometry.components[Math.ceil(road.attributes.geometry.components.length/2-1)])});
            W.model.actionManager.add(action);
            var RoadIds=new Array();
            if(action.splitSegmentPair!==null)
            {
                for(var i=0;i<action.splitSegmentPair.length;i++)
                {
                    RoadIds.push(action.splitSegmentPair[i].attributes.id);
                }
            }
            return RoadIds;
        }
    }

    
    // function verifyNull(variable)
    // {
    //     if(variable === null)
    //         return "";
    //     return variable["v"];
    // }

    function scriptupdatemonitor() {
      if (WazeToastr?.Ready) {
        // Create and start the ScriptUpdateMonitor
        const updateMonitor = new WazeToastr.Alerts.ScriptUpdateMonitor(scriptName, scriptVersion, downloadUrl, GM_xmlhttpRequest);
        updateMonitor.start(2, true); // Check every 2 hours, check immediately

        // Show the update dialog for the current version
        WazeToastr.Interface.ShowScriptUpdate(scriptName, scriptVersion, updateMessage, downloadUrl, forumURL);
      } else {
        setTimeout(scriptupdatemonitor, 250);
      }
    }
    scriptupdatemonitor();
    
    bootstrap();
})();
