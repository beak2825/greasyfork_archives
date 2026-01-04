// ==UserScript==
// @name WME Select Same Type Roads
// @author buchet37
// @namespace https://greasyfork.org/users/4062
// @description This script add functionnality to select and modify roads
// @match https://world.waze.com/editor*
// @match https://www.waze.com/editor*
// @match https://world.waze.com/map-editor*
// @match https://www.waze.com/map-editor*
// @match https://*.waze.com/editor*
// @match https://*.waze.com/*/editor*
// @match https://*.waze.com/map-editor*
// @match https://*.waze.com/beta_editor*
// @match https://descarte*.waze.com/beta*
// @match https://editor-beta.waze.com*
// @version         6.0.1
// @downloadURL https://update.greasyfork.org/scripts/4715/WME%20Select%20Same%20Type%20Roads.user.js
// @updateURL https://update.greasyfork.org/scripts/4715/WME%20Select%20Same%20Type%20Roads.meta.js
// ==/UserScript==

// Based on Street to River ( http://userscripts.org/scripts/show/122049 )
// Thanks to alcolo47 (some functions are based on WME Extented Tools)
// Thanks to gdu1971, bgodette, Timbones for part of code
// Adapted by buchet37 for "Select Same Type Road"

// Mini howto:
// 1) install this script as greasemonkey script or chrome extension
// 2) Select 2 segments
// 3) Click the "Select Roads A<=>B" button
// The script will select all same type road between A and B with a limit of 50 segments

/* global require */
/* global $ */
/* global OpenLayers */
/* global W */
/* global I18n */
/* global SDK_INITIALIZED */

var WME_SSTR_version = "6.0.1" ;


// *************
// **  INIT   **
// *************

//function initScript() {
    // initialize the sdk with your script id and script name
//    const wmeSDK = getWmeSdk(
        //		  {scriptId: "your-userscript-id", scriptName: "Script Display Name"});
//        {scriptId: "SSTR", scriptName: "Select Same Type Road"});
//}

function SSTR_bootstrap() {
    if (typeof unsafeWindow === "undefined") {
        unsafeWindow = ( function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }

    /* begin running the code! */
    //    log("starting");
    selectSameTypeRoad();
}

function selectSameTypeRoad() {
    if (W && W.map && W.model && SDK_INITIALIZED && 'undefined' != typeof require ) {
        //       alert ("le SDK n'est pas encore chargé");
        //        window.SDK_INITIALIZED.then(initScript);
        unsafeWindow.SDK_INITIALIZED.then(start_selectSameTypeRoad);
    }
    else { setTimeout(selectSameTypeRoad , 1000); }
}

function start_selectSameTypeRoad() {
    const wmeSDK = getWmeSdk({scriptId: "SSTR", scriptName: "Select Same Type Road"});
    var defaultWidth = "15 m"; //Default Width is equal to 15m

    // *****************   COMPATIBILITY WITH NEW EDITOR     ***********
    //  var WazeActionAddLandmark = require("Waze/Action/AddLandmark");
    //  var WazeActionAddOrGetCity = require("Waze/Action/AddOrGetCity");
    //  var WazeActionAddOrGetStreet = require("Waze/Action/AddOrGetStreet");
    //  var WazeActionCreateObject = require("Waze/Action/CreateObject");
    //  var WazeActionCreateRoundabout = require ("Waze/Action/CreateRoundabout");
    //  var WazeActionDeleteSegment = require ("Waze/Action/DeleteSegment");
    //  var WazeActionModifyConnection = require ("Waze/Action/ModifyConnection");
    var WazeActionMultiAction = require ("Waze/Action/MultiAction");
    // var WazeActionUpdateObject = require("Waze/Action/UpdateObject");
    var WazeActionUpdateSegmentGeometry = require("Waze/Action/UpdateSegmentGeometry");
    //  var WazeFeatureVectorLandmark = require("Waze/Feature/Vector/Landmark");
    var WazeActionMoveNode = require("Waze/Action/MoveNode");

    // *****************************************************************

    setTimeout (function () {insertButton();}, 4001);		//tempo

    function insertButton() {
        if(document.getElementById('WME_SSTR_All') != null) return;
        var WME_SSTR_ALL1 = create_WME_SSTR_ALL ();

        // ******* Mise en place des buttons ****
        var WME_SSTR_ALL_Flag = false, myDialogBoxFlag = false;

        function put_WME_SSTR_ALL() { // wait for 'sidebar'
            if (document.getElementById('segment-edit-general')!=null) {
                $("#segment-edit-general").append(WME_SSTR_ALL1);
                WME_SSTR_ALL_Flag = true;
            }
            else {
                setTimeout (function () {put_WME_SSTR_ALL();}, 1001);
            }
        }

        put_WME_SSTR_ALL();

        function start_init_WME_SSTR() { // si tous les boutons sont chargés on démarre le script
            if (WME_SSTR_ALL_Flag) {
                init_WME_SSTR();
            }
            else {setTimeout(function () {start_init_WME_SSTR();}, 501);}
        }
        start_init_WME_SSTR();
        return;
    }

    function put_WME_SSTR_button () {
        if(document.getElementById('WME_SSTR_All') != null) return ;
        var selectedItems = getSelectedSegmentsIds();
        if (selectedItems.length != 0) { // s'il y aune selection de segment active
            var WME_SSTR_ALL1 = create_WME_SSTR_ALL ();
            if (document.getElementById('segment-edit-general')!=null) {
                $("#segment-edit-general").append(WME_SSTR_ALL1); //on met le menu et on intilise les check box
                if (localStorage['WME_SSTR_enable']=='true') {	// restaure old Values (if exist)
                    document.getElementById ('WME_SSTR_enable').checked = 1;}
                if (localStorage['WME_SSTR_Smth']=='true') {
                    document.getElementById ('WME_SSTR_SmthRvr').checked = 1;}
            }
            else {
                setTimeout (function () {put_WME_SSTR_button();}, 1001); //autrement on attend
            }
        }
        return;
    }

    function create_WME_SSTR_ALL () {
        var chk1 = $('<Label style="font-weight:normal"><input type="checkbox"; style="vertical-align: middle;margin:0px;" id="WME_SSTR_enable"	title="Enable or Disable WME SSTR">On-Off    </input></Label>');
        var chk2 = $('<Label style="font-weight:normal;margin:0px 5px 0px 0px"><input type="checkbox"; style="vertical-align: middle;margin:0px;" id="WME_SSTR_SmthRvr" title="Check for smoothing">Smooth</input></Label>');
        var url1 = $('<div style="font-size:12px;display: inline;"> <u><i><a href="https://greasyfork.org/scripts/4715-wme-select-same-type-roads" target="_blank">Select Same Type Road ' + WME_SSTR_version+ '</a></i></u>');

        var btn1 = $('<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px;" title="Select 1 or more segments and click this button">Select Same Type Roads</button>');
        var btn2 = $('<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px; margin-right:5px;" title="Select adjacent segment from node A">A =></button>');
        var btn3 = $('<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px;" title="Select adjacent segment from node B">B =></button>');
        var btn4 = $('<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px;" title="Start from segment 1 to join Segment 2 (if possible)">1 => 2</button>');
        var btn7 = $('<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px; margin-right:5px; " title="Create a River from Street Geometry">Street => River</button>');
        var btn8 = $('<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px;" title="Select road(s) to make an Overall Landmark">Do Landmark</button>');
        var btn10= $('<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px; margin:2px;width:250px;" title="Make a new roundabout from 1 segment of an old one">Redo Roundabout</button>');
        var btn12= $('<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px; margin-right:5px; " title="click this button to suppress road geometry">Clear Road Geometry</button>');
        var btn14= $('<button class="waze-btn waze-btn-small waze-btn-white" style="font-size:20px; padding:0px 6px; height:auto; margin: 2px;" >&#11013</button>');
        var btn15= $('<button class="waze-btn waze-btn-small waze-btn-white" style="font-size:20px; padding:0px 6px; height:auto; margin: 2px;" >&#10145</button>');
        var btn16= $('<button class="waze-btn waze-btn-small waze-btn-white" style="font-size:20px; padding:0px 6px; height:auto; margin: 2px;" >&#11015</button>');
        var btn17= $('<button class="waze-btn waze-btn-small waze-btn-white" style="font-size:20px; padding:0px 6px; height:auto; margin: 2px;" >&#11014</button>');
        var btn18= $('<button class="waze-btn waze-btn-small waze-btn-white" style="font-size:20px; padding:0px 6px; height:auto; margin: 2px;" > -- </button>');
        var btn19= $('<button class="waze-btn waze-btn-small waze-btn-white" style="font-size:20px; padding:0px 6px; height:auto; margin: 2px;" > ++ </button>');
        var btn20= $('<button class="waze-btn waze-btn-small waze-btn-white" style="font-size:20px; padding:0px 6px; height:auto; margin: 2px;" >&#11119</button>');
        var btn21= $('<button class="waze-btn waze-btn-small waze-btn-white" style="font-size:20px; padding:0px 6px; height:auto; margin: 2px;" >&#11118</button>');

        btn1.click	(select_same_type_roads);
        btn2.click	(Side_A);
        btn3.click	(Side_B);
        btn4.click	(select_AB);
        btn7.click	(Street_River);
        btn8.click	(Roads_to_Interchange);
        btn12.click (Clear_Road_Geometry);
        chk1.click  (manage_WME_SSTR);
        chk2.click  (manageSmoothRiver);
        btn14.click (Redo_Rdt_Xmoins);btn15.click (Redo_Rdt_Xplus);btn16.click (Redo_Rdt_Ymoins);btn17.click (Redo_Rdt_Yplus);
        btn18.click (Redo_Rdt_Rmoins);btn19.click (Redo_Rdt_Rplus);btn20.click (Redo_Rdt_Rotmoins);btn21.click (Redo_Rdt_Rotplus);

        var WME_SSTR_ALL = $ ('<div id="WME_SSTR_All"  style="height: auto;  padding:2px 2px 2px 5px;margin:5px 0px 0px -5px;width:295px; border-width:3px; border-style:double;border-color: SkyBlue; border-radius:10px"/>');

        var cnt0 = $('<section id="WME_SSTR_lnk" 	style="padding-top:2px; margin:2px;"/>'); cnt0.append(chk1);cnt0.append(" ");cnt0.append(url1);
        var cnt1 = $('<section id="WME_SSTR"		style="padding-top:2px; margin:2px; display:inline;"/>'); cnt1.append(btn1);
        var cnt2 = $('<section id="WME_SSTR_Side"	style="padding-top:2px; margin:2px;"/>'); cnt2.append(btn2);cnt2.append(btn3);
        var cnt3 = $('<section id="WME_SSTR_12"		style="padding-top:2px; margin:2px;"/>'); cnt3.append(btn4);
        var cnt4 = $('<section id="WME_SSTR_River"	style="padding-top:2px; margin:2px;"/>'); cnt4.append(btn7); cnt4.append(chk2);
        var cnt6 = $('<section id="WME_SSTR_Ldmk"	style="padding-top:2px; margin:2px;"/>'); cnt6.append(btn8);
        var cnt7_1 = $('<div style="padding-top:2px; margin:2px;"/>'); cnt7_1.append("&ensp;Move&emsp;",btn14,btn15,btn16,btn17);
        var cnt7_2 = $('<div style="padding-top:2px; margin:2px;"/>'); cnt7_2.append("&ensp;Strech&ensp;",btn18,btn19,btn20,btn21);
        var cnt7 = $('<section id="WME_SSTR_Rdt"	style="padding-top:2px; margin:2px;border-width:1px; border-style:solid;border-color: SkyBlue; border-radius:6px; background-color:#ebebeb"/>');
        cnt7.append(cnt7_1,cnt7_2);
        var cnt8 = $('<section id="WME_SSTR_CrgAds"	style="padding-top:2px; margin:2px;"/>'); cnt8.append(btn12);

        WME_SSTR_ALL.append(cnt0);
        WME_SSTR_ALL.append(cnt1);
        WME_SSTR_ALL.append(cnt2);
        WME_SSTR_ALL.append(cnt3);
        WME_SSTR_ALL.append(cnt4);
        WME_SSTR_ALL.append(cnt6);
        WME_SSTR_ALL.append(cnt7);
        WME_SSTR_ALL.append(cnt8);

        return WME_SSTR_ALL;
    }

    function Clear_Road_Geometry(ev) {    // ******* PASS TO SDK ********
        var selectedItems = getSelectedSegmentsIds();
        if (selectedItems.length!=0) {
            if (confirm ("Do you want to clear the geometry for selected segments") ) {
                for (var i = 0; i < selectedItems.length; i++) {
                    var seg = getRoadFromId(selectedItems[i]);
                    var geo = clone(seg.geometry);
                    geo.coordinates.splice(1,geo.coordinates.length-2); // on garde le 1er et le dernier point
                    wmeSDK.DataModel.Segments.updateSegment ({geometry: geo, segmentId:seg.id});}
            }
        }
    }

    function areTwice (myArray) {
        var myNewArray = [];
        if (myArray.length > 0) {
            for (var i = 0; i < myArray.length-1; i++) {
                for (var j = i+1; j < myArray.length; j++) {
                    if (myArray [i] == myArray[j]) {
                        myNewArray.push(myArray [i]);
                    }
                }
            }
            return delete_multi_Ids(myNewArray);
        }
        else {
            return (myArray);
        }
    }

    function Redo_Rdt_Xmoins (ev) {moveRoundAbout(-1, 0, 0, 0)};
    function Redo_Rdt_Xplus (ev)  {moveRoundAbout( 1, 0, 0, 0)};
    function Redo_Rdt_Ymoins (ev) {moveRoundAbout( 0,-1, 0, 0)};
    function Redo_Rdt_Yplus (ev)  {moveRoundAbout( 0, 1, 0, 0)};
    function Redo_Rdt_Rmoins (ev) {moveRoundAbout( 0, 0,-1, 0)};
    function Redo_Rdt_Rplus (ev)  {moveRoundAbout( 0, 0, 1, 0)};
    function Redo_Rdt_Rotmoins(ev){moveRoundAbout( 0, 0, 0, 1)};
    function Redo_Rdt_Rotplus (ev){moveRoundAbout( 0, 0, 0,-1)};

    function moveRoundAbout(xdecal,ydecal,rstr,rot) { // ******* PASS TO SDK ********
        var rdt = getOldRdt();
        if (rdt) {
            var multiaction = new WazeActionMultiAction();
            var decal_X = xdecal * 0.05 * rdt.width;
            var decal_Y = ydecal * 0.05 * rdt.height;
            for (var i = 0; i < rdt.nodes.length; i++) { // on decale les noeuds
                var node = getNodeFromId(rdt.nodes[i]);
                var geo = clone(node.geometry);
                var decal_R = decalageRadial(geo.coordinates[0],geo.coordinates[1],rdt,rstr,rot); // décalage radial (etire - repli
                geo.coordinates[0]= decal_R.x + decal_X;
                geo.coordinates[1]= decal_R.y + decal_Y;

                multiaction.doSubAction (W.model,oldMoveNode(rdt.nodes[i],geo));  // conservation du mode multiaction
                //   wmeSDK.DataModel.Nodes.moveNode({geometry: geo, id: node.id }); // ready for SDK (with many unique actions )
            }
            for (var j = 0; j < rdt.segs.length; j++) { // on decale les segments
                var seg = getRoadFromId(rdt.segs[j]);
                var geo1 = clone(seg.geometry);
                for (var k = 1; k < geo1.coordinates.length-1; k++){
                    var decal_R1 = decalageRadial(geo1.coordinates[k][0],geo1.coordinates[k][1],rdt,rstr,rot); // décalage radial (etire - repli
                    geo1.coordinates[k][0]= decal_R1.x + decal_X;
                    geo1.coordinates[k][1]= decal_R1.y + decal_Y;
                }

                 multiaction.doSubAction (W.model,oldMoveSeg(rdt.segs[j],geo1));
               // wmeSDK.DataModel.Segments.updateSegment({geometry: geo1, segmentId:rdt.segs[j]});
            }
            W.model.actionManager.add (multiaction);
        }
    }

    function oldMoveNode(nodeID,newGeo) {
        var node = W.model.nodes.objects[nodeID];
        var connectedSegs = [];
        for(let m=0;m<node.attributes.segIDs.length;m++){
            var segID = node.attributes.segIDs[m];
            connectedSegs[segID] = wmeSDK.DataModel.Segments.getById({segmentId: segID}).geometry;
        }
        return new WazeActionMoveNode (node, node.getGeometry(), newGeo, connectedSegs,{});
    }

    function oldMoveSeg (segID,newGeo){
        var seg = W.model.segments.objects[segID];
        return new WazeActionUpdateSegmentGeometry (seg,seg.getGeometry(),newGeo)
    }

    function decalageRadial (x,y,rdt,rstr,rot) { // avec passage en projection linéaire pour non deformation
        var center = openLayerTransform (rdt.center.x,rdt.center.y,"EPSG:4326","EPSG:900913");
        var point = openLayerTransform (x,y,"EPSG:4326","EPSG:900913");
        var deltaX = point.lon - center.lon;
        var deltaY = point.lat - center.lat;
        var angle = angleDeg (deltaX,deltaY) + 5 * rot; // rotation de +-5 °
        var oldRayon = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        var newRayon = oldRayon + oldRayon * 0.05 * rstr; // etirement ou contraction
        var newPt = {};
        newPt.lon = center.lon + newRayon * Math.cos(convertDegRad(angle));
        newPt.lat = center.lat + newRayon * Math.sin(convertDegRad(angle));
        var point2 = openLayerTransform (newPt.lon,newPt.lat,"EPSG:900913","EPSG:4326");
        var pt = {}; pt.x = point2.lon; pt.y = point2.lat;
        return pt;
    }

    function openLayerTransform (x,y,from,to) {
        var point = new OpenLayers.LonLat(x,y);
        var projFrom = new OpenLayers.Projection(from);
        var projTo = new OpenLayers.Projection(to);
        return point.transform(projFrom, projTo);
    }

    function getOldRdt() { // ******* PASS TO SDK ********
        var selectedItems = getSelectedSegmentsIds();
        if (selectedItems.length==0) {return null;}
        var junctionID = [];
        for (var i = 0; i < selectedItems.length; i++) {
            var road = getRoadFromId(selectedItems[i]);
            if (road.junctionId !=null) {
                junctionID.push(road.junctionId);
            }
        }
        junctionID = delete_multi_Ids(junctionID);
        if (junctionID.length!=1) {return null;} // il ya un rdt et un seul de selectionné
        var rdt ={}
        rdt.junctionID = junctionID[0];
        rdt.nodes = [];
        rdt.center = {};
        rdt.maxX = rdt.maxY = -10000000000000;
        rdt.minX = rdt.minY = 10000000000000;
        var junc = getJunctionFromId(rdt.junctionID);
        rdt.segs = junc.segmentIds;
        for (var j = 0; j < rdt.segs.length; j++) {
            var seg = getRoadFromId(rdt.segs[j]);
            rdt.nodes.push(seg.fromNodeId);
            rdt.nodes.push(seg.toNodeId);
            var geo = seg.geometry.coordinates;
            for (var k = 0; k < geo.length; k++) { // recup geométrie
                if (geo[k][0] > rdt.maxX) {rdt.maxX = geo[k][0];}
                if (geo[k][1] > rdt.maxY) {rdt.maxY = geo[k][1];}
                if (geo[k][0] < rdt.minX) {rdt.minX = geo[k][0];}
                if (geo[k][1] < rdt.minY) {rdt.minY = geo[k][1];}
            }
        }
        rdt.nodes = delete_multi_Ids(rdt.nodes);
        rdt.width = rdt.maxX - rdt.minX;
        rdt.height= rdt.maxY - rdt.minY;
        rdt.center.x = (rdt.maxX + rdt.minX)/2;
        rdt.center.y = (rdt.maxY + rdt.minY)/2;
        return rdt;
    }

    function Roads_to_Interchange(ev) {
        var foundSelectedSegment = false;
        var selectedItems = getSelectedSegmentsIds();
        var selectedGood = (selectedItems.length>0);
        var roadIds = [];
        for (var i = 0; i<selectedItems.length;i++) { 					// Test if selection are segment
            var sel1 = getRoadFromId(selectedItems[i]);
            if ((selectedGood) && (sel1.junctionId!=null)) {	// if it is a roundabout we add all Rdt segs
                var junc = getJunctionFromId(sel1.junctionId);
                roadIds.push.apply (roadIds,junc.segmentIds);	// we add all segment of the roundabout
            }
            if (selectedGood) {roadIds.push (sel1.id);}			// stocke les segments
        }

        if ((selectedGood) && (roadIds.length != 0)) {
            roadIds = delete_multi_Ids (roadIds);						// delete double roads
            var totalPoints = [];
            var name;
            var leftEnv = [];
            var rightEnv = [];
            var typeLandmak;
            leftEnv.push ({x: 100000000000000,y:2000000000});
            var yMax = -100000000000;

            for (var k = 0; k<roadIds.length;k++) {
                var sel = getRoadFromId(roadIds[k]);
                if (name == null) {name = getStreetName(sel.id);}
                if (typeLandmak == null) {
                    switch (sel.roadType) {
                        case 1: //"Streets"
                        case 2: //"Primary Street"
                        case 3: //"Freeways"
                        case 4: //"Ramps"
                        case 6: //"Major Highway"
                        case 7: //"Minor Highway"
                            typeLandmak = "JUNCTION_INTERCHANGE"; break;// Jonction/interchange
                        case 8: //"Dirt roads"
                        case 18: //"Railroad"
                        case 19: //"Runway/Taxiway"
                        case 20: //"Parking Lot Road"
                            typeLandmak = "PARKING_LOT"; break;						// ParkingLot
                        case 5: //"Walking Trails"
                        case 10: //"Pedestrian Bw"
                        case 16: //"Stairway"
                        case 17: //"Private Road"
                        case 21: //"Service Road"
                            typeLandmak = "PARK"; break;												// Park
                    }
                }
                var newGeo = transformGpsToLinear(sel);
                for (var j = 0; j < newGeo.length;j++) {
                    totalPoints.push (clone(newGeo[j]));
                    if (leftEnv[0].y > newGeo[j].y) {									// Stocke le Y mini
                        leftEnv[0] = clone(newGeo[j]);
                        rightEnv[0] = clone(newGeo[j]);;
                    }
                    if (newGeo[j].y > yMax) { yMax = newGeo[j].y;}
                }
            }

            while ( rightEnv[rightEnv.length-1].y <yMax) {												// traitement de la voie droite
                var anglemin = 190;
                for (var i = 0; i<totalPoints.length;i++) {
                    if (totalPoints[i].y > rightEnv[rightEnv.length-1].y) {
                        var deltaX = totalPoints[i].x - rightEnv[rightEnv.length-1].x;
                        if (deltaX !=0) {
                            var deltaY = totalPoints[i].y - rightEnv[rightEnv.length-1].y;
                            var angle = angleDeg( deltaX , deltaY);
                            if (angle < anglemin) {
                                anglemin = angle;
                                var iMin = i;
                            }
                        }
                    }
                }
                rightEnv.push (totalPoints[iMin]);
            }

            while ( leftEnv[leftEnv.length-1].y <yMax) {													// traitement de la voie droite
                var anglemax = 0;
                for (var i = 0; i<totalPoints.length;i++) {
                    if (totalPoints[i].y > leftEnv[leftEnv.length-1].y) {
                        var deltaX = totalPoints[i].x - leftEnv[leftEnv.length-1].x;
                        if (deltaX !=0) {
                            var deltaY = totalPoints[i].y - leftEnv[leftEnv.length-1].y;
                            var angle = angleDeg( deltaX , deltaY);
                            if (angle > anglemax) {
                                anglemax = angle;
                                var iMax = i;
                            }
                        }
                    }
                }
                leftEnv.push (totalPoints[iMax]);
            }

            leftEnv.shift(); leftEnv.pop();											//On ote le premier et le dernier point( communs avec droite)
            rightEnv.push.apply (rightEnv,leftEnv.reverse ());						//on ajoute la partie Gauche
            var dummy = doLandmark (rightEnv,name,typeLandmak);						// make the landmark
            alert("Successfully created Landmark");}
        else {
            alert("Incorrect Selection : \n\nOne segment must be selected \nOr It is not RoundAbout Segment");
        }
    }

    function transformGpsToLinear (sel) {
        var geo = [];
        var coord = sel.geometry.coordinates;
        for (var i = 0; i<coord.length;i++) {
            var point = openLayerTransform (coord[i][0],coord[i][1],"EPSG:4326","EPSG:900913");
            geo[i] = {}; geo[i].x = point.lon; geo[i].y = point.lat;
        }
        return geo;
    }

    function doLandmark (geometry,nameLandmak,typeLandmark) {
        var newGeo = transformLinearToGps (geometry); // on repasse en coordonnées GPS
        newGeo.coordinates[0].push(newGeo.coordinates[0][0]); // on ferme le polygone en reportant le point 0
        newGeo.type= 'Polygon';
        var newLdmkId = ''+ wmeSDK.DataModel.Venues.addVenue ({category: typeLandmark, geometry: newGeo});
        if (nameLandmak!="" && nameLandmak!= undefined) {wmeSDK.DataModel.Venues.updateVenue ({name: nameLandmak, venueId: newLdmkId});} //nommage du ldmk
        activateLayer ('layer-switcher-group_places',true);
        switch (typeLandmark) { // active les layers correspondants
            case 'JUNCTION_INTERCHANGE': activateLayer ('layer-switcher-item_venues', true);break;
            case 'PARKING_LOT': activateLayer ('layer-switcher-item_parking_places', true); break;
            case 'PARK': activateLayer ('layer-switcher-item_venues', true);break
            case 'RIVER_STREAM': activateLayer ('layer-switcher-item_natural_features', true);break;
        }
        return true;
    }

    function activateLayer (layerName, flag) {
        var layer = document.getElementById (layerName);
        var layerState = layer.checked;
        if (layerState == false && flag == true) {layer.click();};
        if (layerState == true && flag == false) {layer.click();};
    }
    function transformLinearToGps (geo) {
        var newGeo = {};
        newGeo.coordinates = [];
        newGeo.coordinates[0] = [];
        for (var i = 0; i < geo.length;i++) {
            var point = openLayerTransform (geo[i].x,geo[i].y,"EPSG:900913","EPSG:4326");
            newGeo.coordinates[0][i] = [];
            newGeo.coordinates[0][i][0] = point.lon;
            newGeo.coordinates[0][i][1] = point.lat;
        }
        return newGeo
    }

    function Street_River (ev) {
        var selectedItems = getSelectedSegmentsIds();
        var selectedGood = (selectedItems.length==1);
        var sel = getRoadFromId(selectedItems[0]);
        selectedGood = selectedGood && (sel.roadType != "18");
        if (selectedGood) {
            var offset = getDisplacement();							// valeur en mètres
            if (offset == null) {
                return;}
            var name = getStreetName(sel.id);
            var points = StreetToLandmark (sel, offset);
            var dummy = doLandmark (points,name,"RIVER_STREAM");	// river
            alert("Successfully created a River Landmark");}
        else {
            alert("Incorrect Selection : \n\nOne segment must be selected \nOr It is not Street Segment");
        }
    }

    function getDisplacement() {
        var scale = 1;				// Scale mètres => coordonnées waze
        var width = prompt("Enter new Width or leave it to old value ",defaultWidth);
        if (width == null) {
            return null; }
        else {
            if (width.match("m","g")) {
                width =parseInt(width);
                if (width < 1) {width = 1;} //minimum width equal to 1m
                if (width >100) {width = 100;} //maximum width equal to 100m
                defaultWidth=width+" m";
                return width * scale / 2;
            }
            if (width.match("ft","g")) {
                width =parseInt(width);
                if (width < 3) {width =3;}					//minimum width equal to 3 ft
                if (width > 300) {width =300;}			//maximum width equal to 300 ft
                defaultWidth=width+" ft";
                return width * 0.3048 * scale /2;
            }
            width=15;
            defaultWidth="15 m";
            return width * scale / 2;
        }
    }

    function StreetToLandmark (seg,offset) {
        var newGeo = transformGpsToLinear(seg);
        var decal = decalage (newGeo, offset);
        if (document.getElementById ('WME_SSTR_SmthRvr').checked == 1) {
            decal.dir = optGeometry (decal.dir);
            decal.sym = optGeometry (decal.sym);
            decal.dir = b_spline (decal.dir);												// creation des B - splines X & Y
            decal.sym = b_spline (decal.sym);
            decal.dir = sup_unneed (decal.dir);											// delete aligned points
            decal.sym = sup_unneed (decal.sym);											// delete aligned points
        }
        decal.dir.push.apply(decal.dir,decal.sym.reverse());		// on rajoute le trajet retour
        return decal.dir;
    }

    function sup_unneed (decal) {
        for (var phase = 0; phase < 3; phase ++) {
            var decal1 = [];
            decal1 [0] = decal [0];
            for (var i = 1; i< decal.length-2; i++) {
                if ((decal1[decal1.length-1].x != decal[i+1].x) && (decal[i+1].x != decal[i+2].x)) {															// non vertical => can calculate Atan
                    var angle1 = ((decal1[decal1.length-1].y - decal[i+1].y) / (decal1[decal1.length-1].x - decal[i+1].x));
                    var angle2 = ((decal[i+1].y - decal[i+2].y) / (decal[i+1].x - decal[i+2].x));
                    var length1 = longueur (decal1[decal1.length-1].x,decal1[decal1.length-1].y,decal[i+1].x,decal[i+1].y);
                    if (testUnneed (angle1,angle2,length1,phase)) {
                        decal1.push (decal[i+1]);
                    }
                }
                else {
                    decal1.push (decal[i+1]);
                }
            }
            decal1.push (decal[decal.length-1]);
            decal = decal1;
        }
        return decal1;
    }

    function testUnneed (angle1,angle2,longueur,phase) {
        var deltaAngle = Math.abs (AtanDeg (angle1) - AtanDeg (angle2));
        switch (phase) {
            case 0: if ((deltaAngle < 45) && (longueur < 10))	{return false;}; break;
            case 1: if ((deltaAngle < 1 ) && (longueur >= 10) && (longueur < 250)) {return false;}; break;
            case 2: if ((deltaAngle < 2 ) && (longueur >= 10) && (longueur < 50 )) {return false;}; break;
        }
        return true;
    }

    function optGeometry ( line) {
        var opt = [];
        opt[0] = clone(line[0]);
        for (var i = 1; i< line.length; i++) {
            var deltaX = line[i].x-line[i-1].x;
            var deltaY = line[i].y-line[i-1].y;
            opt.push ({x: line[i-1].x + deltaX * 0.33, y: line[i-1].y + deltaY * 0.33}); // add 2 extra control points
            opt.push ({x: line[i-1].x + deltaX * 0.66, y: line[i-1].y + deltaY * 0.66});
            opt.push ({x: line[i].x, y: line[i].y});
        }
        return opt;
    }

    function decalage (geom,offset) {
        var decal = {};
        decal.dir = [];															// décalage d'un coté
        decal.sym = [];															// décalage de l'autre
        decal.dir[0] = clone(geom[0]);
        decal.sym[0] = clone(geom[0]);
        if (Math.abs(geom[1].x - geom[0].x) < 0.1) {geom[1].x = geom[0].x+0.1;}	// traitement de la verticalité
        var deltaX = geom[1].x - geom[0].x;
        var deltaY = geom[1].y - geom[0].y;
        var angle = Math.atan (deltaY/deltaX);
        decal.dir[0].x = geom[0].x - sign (deltaX) * offset * Math.sin (angle);
        decal.dir[0].y = geom[0].y + sign (deltaX) * offset * Math.cos (angle);
        decal.sym[0].x = geom[0].x + sign (deltaX) * offset * Math.sin (angle);
        decal.sym[0].y = geom[0].y - sign (deltaX) * offset * Math.cos (angle);

        var aprev = deltaY / deltaX;
        var b = geom[0].y - aprev * geom[0].x;									// y = ax+b

        var off1 = sign(deltaX) * offset / Math.cos (angle);
        var bprev = b + off1;	var bprev1 = b - off1;
        for (var i = 1; i < geom.length-1; i++) {
            if (Math.abs(geom[i+1].x - geom[i].x)< 0.1) {geom[i+1].x = geom[i].x+0.1;}	// traitement de la verticalité
            deltaX = geom[i+1].x - geom[i].x;
            deltaY = geom[i+1].y - geom[i].y;
            var anext = deltaY / deltaX;
            b = geom[i].y - anext * geom[i].x;
            angle = Math.atan (deltaY/deltaX);
            off1 = sign(deltaX) * offset / Math.cos (angle);
            var bnext = b + off1;	var bnext1 = b - off1;

            var x1 = -(bprev - bnext) / (aprev - anext);
            var x2 = -(bprev1 - bnext1) / (aprev - anext);
            decal.dir.push ({x: x1, y: (aprev * x1 + bprev)}); // décalage d'un coté
            decal.sym.push ({x: x2, y: (aprev * x2 + bprev1)}); // décalage de l'autre coté

            aprev = anext;
            bprev = bnext;	bprev1 = bnext1;
        }
        // derniers point
        decal.dir.push ({x: (geom[i].x - sign(deltaX) * offset * Math.sin (angle)),y: (geom[i].y + sign(deltaX) * offset * Math.cos (angle))});
        decal.sym.push ({x: (geom[i].x + sign(deltaX) * offset * Math.sin (angle)),y: (geom[i].y - sign(deltaX) * offset * Math.cos (angle))});
        return decal;
    }

    function b_spline (ligne) {
        var ligne1 = [];
        ligne1 [0] = ligne [0];
        for (var j = 1; j < ligne.length-2;j++) {
            var t = 4; 									// nombre de sous-segments
            for (var i = 0; i < 1;i+=1/t) {
                var x1 = ((1-i)*(1-i)*(1-i)*ligne[j-1].x + (3*i*i*i -6*i*i +4)*ligne[j].x + (-3*i*i*i +3*i*i +3*i +1)*ligne[j+1].x + i*i*i*ligne[j+2].x)/6;
                var y1 = ((1-i)*(1-i)*(1-i)*ligne[j-1].y + (3*i*i*i -6*i*i +4)*ligne[j].y + (-3*i*i*i +3*i*i +3*i +1)*ligne[j+1].y + i*i*i*ligne[j+2].y)/6;
                ligne1.push ({x: (x1), y: (y1)});
            }
        }
        ligne1.push(ligne[ligne.length-1] );
        return ligne1;
    }

    function select_same_type_roads(ev) {
        var selectedItems = getSelectedSegmentsIds(); //  Récupère les Ids des segments sélectionnés
        var nbRoad = selectedItems.length;
        var selectedGood = true;				// selection must have 1 or 2 items
        var select_IDs =[];                     					//tableau de stockage des Routes electionnées
        for (var j = 0; j < nbRoad; j++) {
            var sel = getRoadFromId(selectedItems[j]);
            if (sel.junctionId!=null) {					            // It's un roundabout
                var junc = getJunctionFromId(sel.junctionId);       // On récupère la junction
                select_IDs.push.apply(select_IDs,junc.segmentIds);} // Add to pervious selected Ids
            else {
                var nodeFrom = getNodeFromId(sel.fromNodeId);
                var segList = searchRoad(nodeFrom,sel,"0");
                select_IDs.push.apply(select_IDs,segList.IDs);		// Add to pervious selected Ids
                var nodeTo = getNodeFromId(sel.toNodeId); // recherche à partir du deuxième noeud
                var segList1 = searchRoad(nodeTo,sel,"0");
                select_IDs.push.apply(select_IDs,segList1.IDs);		// Add to pervious selected Ids
            }
            select (select_IDs);
        }
        if (!selectedGood) {alert("You must select road(s)");}
    }

    function Side_A(ev) {
        var selectedItems = getSelectedSegmentsIds(); // Récupère les Ids des segments sélectionnés
        if ((selectedItems.length == 1) ) {
            var sel = getRoadFromId(selectedItems[0]);
            var nodeFrom = getNodeFromId(sel.fromNodeId); // Recherche à partir du noeud A
            var segList = searchRoad(nodeFrom,sel,"0");
            select (segList.IDs);
        }
        else {alert("One segment (and only one)\nmust be selected");}
    }

    function pseudoNode (nodeID) { // debug function which add old attributes
        var node = wmeSDK.DataModel.Nodes.getById({nodeId: nodeID});
        node.attributes = {};
        node.attributes.segIDs = node.connectedSegmentIds;
        node.getID = function() {return node.id;};
        var point2 = openLayerTransform (node.geometry.coordinates[0],node.geometry.coordinates[1],"EPSG:4326","EPSG:900913");
        node.attributes.geometry = {};
        node.geometry.x = point2.lon;
        node.geometry.y = point2.lat;
        node.getGeometry = function() {return (node.geometry)};
        // node.attributes.geometry.x = node.geometry.coordinates[0];
        // node.attributes.geometry.y = node.geometry.coordinates[1];
        // node.geometry.x = node.geometry.coordinates[0];
        // node.geometry.y = node.geometry.coordinates[1];
        return node;
    }

    function pseudoRoad (roadId) { // debug function which add old attributes
        var sel = wmeSDK.DataModel.Segments.getById({segmentId: roadId});
        sel.attributes = {};
        sel.attributes.roadType = sel.roadType;
        sel.attributes.fromNodeID = sel.fromNodeId;
        sel.attributes.toNodeID = sel.toNodeId;
        sel.getID = function() {return sel.id;};
        sel.attributes.junctionID = sel.junctionId;
        sel.type = "segment";
        sel.pseudoGeo = {};
        sel.pseudoGeo.components = [];
        for (var i = 0; i < sel.geometry.coordinates.length;i++) {
            var point = openLayerTransform (sel.geometry.coordinates[i][0],sel.geometry.coordinates[i][1],"EPSG:4326","EPSG:900913");
            sel.pseudoGeo.components[i] = {};
            sel.pseudoGeo.components[i] = point.lon;
            sel.pseudoGeo.components[i] = point.lat;
        }
        return sel;
    }

    function Side_B(ev) {
        var selectedItems = getSelectedSegmentsIds(); //  Récupère les Ids des segments sélectionnés
        if ((selectedItems.length == 1) ) {
            var sel = getRoadFromId(selectedItems[0]);
            var nodeTo = getNodeFromId(sel.toNodeId); // recherche à partir du noeud B
            var segList = searchRoad(nodeTo,sel,"0");
            select (segList.IDs);}
        else {alert ("One segment (and only one)\nmust be selected");}
    }

    function select_AB(ev) {
        var selectedItems = getSelectedSegmentsIds(); //  Récupère les Ids des segments sélectionnés
        var nbRoad = selectedItems.length;															// **** Validate selection *****
        var selectedGood = (nbRoad == 2);															// selection must have 2 items
        if (selectedGood) {
            var sel = getRoadFromId(selectedItems[0]);
            var sel1= getRoadFromId(selectedItems[1]);
            selectedGood = ((selectedGood) && (sel.roadType == sel1.roadType));	// Test if selection have same road Type
        }
        if (selectedGood) {
            var lengthMin = 1000000;
            var goodTrip = [];
            var select1 = select_12(sel,sel1);
            if (select1[select1.length-1] == sel1.id) { // on a trouvé un chemin dans ce sens
                goodTrip = select1;
                lengthMin = lengthTrip (select1);
            }
            var select2 = select_12(sel1,sel);

            if ((select2[select2.length-1] == sel.id) && (lengthTrip (select2) < lengthMin)){	// on a trouvé un chemin dans ce sens
                goodTrip = select2;
                lengthMin = lengthTrip (select2);
            }
            var nodeTrip1 = nodeFromTrip (select1);	// ******* search for Common Nodes
            var nodeTrip2 = nodeFromTrip (select2);
            var CommonNode = [];
            for (var m = 0; m < nodeTrip1.length; m++) {
                if (isInArray (nodeTrip1[m],nodeTrip2)) {
                    CommonNode.push (nodeTrip1[m]);
                }
            }

            if (CommonNode.length !=0) {
                for (var i = 0; i < CommonNode.length; i++) {
                    var select3 = [];
                    var road = getRoadFromId(select1[0]);
                    for (var j = 0; ((road.fromNodeId != CommonNode[i]) && (road.toNodeId != CommonNode[i])); j++) {
                        select3.push (road.id);
                        road = getRoadFromId(select1[j]);
                    }
                    select3.push (road.id);
                    road = getRoadFromId(select2[0]);
                    for (var k = 0; ((road.fromNodeId != CommonNode[i]) && (road.toNodeId != CommonNode[i])); k++) {
                        select3.push (road.id);
                        road = getRoadFromId(select2[k]);
                    }
                    select3.push (road.id);
                    select3 = delete_multi_Ids (select3);
                    if (lengthTrip (select3) <lengthMin) {
                        goodTrip = select3;
                        lengthMin = lengthTrip (goodTrip);
                    }
                }
            }

            if (lengthMin != 1000000) {								// a path was found
                goodTrip = addRoundabout (goodTrip);				// Add roundabout segments
                goodTrip = addAlternativePaths (goodTrip);			// add alternative simple way like fork in roundabaout
                select (goodTrip);}		// make the selection
            else {
                alert("No Path found");
            }
        }
        else { alert("You must select 2 roads \nwith the same type");
             }
    }

    function addAlternativePaths (trip) { // ******* PASS TO SDK ********
        var alternativeSegs = [];
        var listNodeIDs = nodeFromTrip (trip);																			// list of nodesIds of the trip
        var road = getRoadFromId(trip[0]);
        var roadtype = road.roadType;
        for (var i = 0; i < listNodeIDs.length;i++) {
            var node = getNodeFromId(listNodeIDs[i]);
            var nodeSegIdList = node.connectedSegmentIds;
            for (var j = 0; j < nodeSegIdList.length;j++) {
                var road1 = getRoadFromId(nodeSegIdList[j]);
                if ((road1 != null) && (road1.roadType == roadtype) && (isInArray (road1.fromNodeId,listNodeIDs)) && (isInArray (road1.toNodeId,listNodeIDs))) {
                    alternativeSegs.push (road1.id);
                }
            }
        }
        if (alternativeSegs.length != 0 ) {
            trip.push.apply(trip,alternativeSegs);
            trip = delete_multi_Ids (trip);
        }
        return trip;
    }

    function addRoundabout (trip) { // ******* PASS TO SDK ********
        var roundaboutSegs = [];
        for (var i = 0; i < trip.length;i++) {
            var road = getRoadFromId(trip[i]);
            if (road.junctionId!=null) {// It's un roundabout
                var junc = getJunctionFromId(road.junctionId);
                roundaboutSegs.push.apply(roundaboutSegs,junc.segmentIds);	// on ajoute les segments du RP
            }
        }
        if (roundaboutSegs.length != 0 ) {
            trip.push.apply(trip,roundaboutSegs);
            trip = delete_multi_Ids (trip);
        }
        return trip;
    }


    function nodeFromTrip (trip) {
        var node =[];
        for (var i = 0; i < trip.length; i++) {
            var road = getRoadFromId(trip[i]);
            node.push (road.fromNodeId);
            node.push (road.toNodeId);
        }
        node = delete_multi_Ids (node);
        return node;
    }

    function lengthTrip (listRoadID) {
        var length= 0;
        for (var i = 0; i < listRoadID.length;i++) {
            var road = getRoadFromId(listRoadID[i]);
            length = length + road.length;
        }
        return length;
    }

    function select_12(startRoad,endRoad) {
        var select_IDs =[];													//tableau de stockage des Routes electionnées
        var endRoadFrom;
        var endRoadTo;
        if (endRoad.fromNodeId != null) {endRoadFrom = getNodeFromId(endRoad.fromNodeId);}	// Validate node for End Road
        else {endRoadFrom = getNodeFromId(endRoad.toNodeId);}
        if (endRoad.toNodeId != null) {endRoadTo = getNodeFromId(endRoad.toNodeId);}
        else {endRoadTo = getNodeFromId (endRoad.fromNodeId);}
        var node = choiceStartNode (startRoad,endRoadFrom,endRoadTo);		        // Choix du node de depart
        var segList = searchRoad(node,startRoad,endRoad.id)
        select_IDs.push.apply(select_IDs,segList.IDs);
        while ((segList.stop == "multiRoads") && (segList.roads.length >"1") && (select_IDs.length < 50)) {	// Manage jonctions with same type road
            var BestNextNode = searchBestNextNode (segList.node, segList.roads, endRoad);
            if ( BestNextNode.id != segList.node.id ) {					// search road with best node
                for (var i = 0; i < segList.roads.length;i++) {
                    var road = getRoadFromId (segList.roads[i]);
                    if ((BestNextNode.id == road.fromNodeId) || (BestNextNode.id == road.toNodeId)) {
                        var bestRoad = road;
                    }
                }
                var segList = searchRoad (BestNextNode, bestRoad, endRoad.id);
                select_IDs.push.apply(select_IDs, segList.IDs);}
            else {
                segList.stop = "none";
            }
        }
        return (select_IDs);
    }

    function searchBestNextNode (startNode,listRoadID,endRoad) {
        var endNode,endNode1,endNode2 ;
        endNode1 = getNodeFromId(endRoad.fromNodeId);
        endNode2 = getNodeFromId(endRoad.toNodeId);
        if (distance1(startNode,endNode2) > distance1(startNode,endNode1)) {endNode = endNode1;} // determine de noeud de référence de fin
        else {endNode = endNode2;}
        var angleEnd = angle_1(startNode, endNode);
        var angleMin = 360;
        var bestNode;

        for (var i = 0; i < listRoadID.length;i++) {
            var road = getRoadFromId( listRoadID[i]);
            if (road.fromNodeId == startNode.id) {												// determine de noeud à tester pour la fin du segment
                var node = getNodeFromId(road.toNodeId);}
            else {var node = getNodeFromId(road.fromNodeId);}
            var angle1 = Math.abs(angle_1 (startNode,node) - angleEnd);
            if (angle1 > 180 ) { angle1= 360 - angle1;}															// angle complémentaire
            if ( angle1 < angleMin ) {
                angleMin = angle1;
                bestNode = node;
            }
        }
        return bestNode;
    }
    //        **** Math functions *****
    function sign (x) {return (x < 0) ? (-1) : (1);}
    function AtanDeg ( x) {return ( 180 * Math.atan (x) / Math.PI );}
    function convertDegRad (angledeg) {return (Math.PI * (angledeg) / 180 );}

    function angle (node1,node2) {
        //var deltaX = (node2.geometry.x - node1.geometry.x);
        //var deltaY = (node2.geometry.y - node1.geometry.y);
        //return angleDeg (deltaX,deltaY);
        return angleDeg ((node2.geometry.x - node1.geometry.x),(node2.geometry.y - node1.geometry.y));
    }

    function angle_1 (node1,node2) { // *** SDK ***
        var point1 = openLayerTransform (node1.geometry.coordinates[0],node1.geometry.coordinates[1],"EPSG:4326","EPSG:900913");
        var point2 = openLayerTransform (node2.geometry.coordinates[0],node2.geometry.coordinates[1],"EPSG:4326","EPSG:900913");
        return angleDeg ((point2.lon - point1.lon),(point2.lat - point1.lat));
    }

    function angleDeg (deltaX,deltaY) {
        if (deltaX == 0) { return ( sign( deltaY ) * 90);}
        if (deltaX > 0 ) { return (AtanDeg( deltaY / deltaX));}
        else { return ((sign( deltaY )* 180) + AtanDeg( deltaY / deltaX));}
    }
    function longueur (x1,y1,x2,y2) {
        return (Math.sqrt (((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2))));
    }
    //        **********************

    function select (select_IDs) {
        select_IDs = delete_multi_Ids (select_IDs);	// suppression des doublons
        wmeSDK.Editing.setSelection({selection: {ids: select_IDs, objectType: 'segment'}});

    }

    function delete_multi_Ids (myArray) {
        var myNewArray = [];
        if (myArray.length >0) {
            myNewArray[0]= myArray [0];
            for (var i = 0; i < myArray.length; i++) {
                if (notInArray (myArray [i],myNewArray)) {
                    myNewArray.push(myArray [i]);
                }
            }
        }
        return myNewArray;
    }

    function minInArray (array) {
        if (array.length > 0) {
            var minimum = array [0];
            for (var i = 1; i < array.length; i++) {
                minimum = Math.min (minimum,array [i]);
            }
            return minimum;
        }
        else {return null;}
    }

    function isInArray (item,array) {return array.indexOf(item) !== -1;}
    function notInArray (item,array) {return array.indexOf(item) === -1;}

    function searchRoad(node,roadStart,roadEndID) {
        var roadtype = roadStart.roadType;
        var roadID = roadStart.id;
        var foundSegs = {};												// object for return parameters
        foundSegs.IDs = [];
        foundSegs.roads = [];												//init array
        foundSegs.stop = "none";											//init Stop cause
        foundSegs.IDs.push(roadID);
        var nbSeg = 1;														//Number of searched segments
        while ((nbSeg < 50) && (roadID != roadEndID)) {
            var nodeSegIdList = node.connectedSegmentIds;						// list of road connected to node
            var sameTypeRoad = [];
            for (var i = 0; i < nodeSegIdList.length;i++) {
                var segID = nodeSegIdList [i];
                var seg1 = getRoadFromId(segID);
                if (seg1 == null ) return foundSegs;						// le segment n'est pas chargé en mémoire
                else {
                    if ((seg1.roadType == roadtype) && (seg1.id != roadID)) {
                        sameTypeRoad.push(segID);
                    }
                }
            }

            if (sameTypeRoad.length !=1) {
                if (isInArray (roadEndID,sameTypeRoad)) {			// End Road is in the fork
                    foundSegs.IDs.push(roadEndID);					// We add it and go away
                    return foundSegs;
                }
                sameTypeRoad = validate (sameTypeRoad);				// delete cul-de-sac
            }

            if (sameTypeRoad.length !=1) {							// not an unique segment (0,2 or more)
                foundSegs.stop = "multiRoads";
                foundSegs.roads = sameTypeRoad;
                foundSegs.node = node;
                return foundSegs;}									// on retourne le tableau d'Ids s
            else {
                var roadID = sameTypeRoad[0];
                if (isInArray (roadID,foundSegs.IDs)) return foundSegs;		// we are in a lopp : we go away
                foundSegs.IDs.push(roadID);
                nbSeg = nbSeg + 1;
                var seg2 = getRoadFromId(roadID);
                if (node.id == seg2.fromNodeId) {var nodeID = seg2.toNodeId;}
                else {var nodeID = seg2.fromNodeId;}
                var node = getNodeFromId(nodeID);
                if (node == null ) {return foundSegs;}											// It's a cul-de-sac : we go away
            }
        }
        return foundSegs;
    }

    function validate (sameTypeRoad) { // *** SDK ***
        var myNewSameTypeRoad = [];
        for (var i = 0; i < sameTypeRoad.length; i++) {
            var sel = getRoadFromId(sameTypeRoad[i]);
            if ((sel.fromNodeId !=null) && (sel.toNodeId !=null)) { //it is not a cul-de-sac
                myNewSameTypeRoad.push (sameTypeRoad[i]);
            }
        }
        return myNewSameTypeRoad;
    }

    function choiceStartNode (road1,node3,node4) {
        var node1,node2;
        if (road1.fromNodeId != null) {node1 = getNodeFromId(road1.fromNodeId);}	// test of cul-de-sac & change node if it is
        else {node1 = getNodeFromId(road1.toNodeId);}
        if (road1.toNodeId != null) { node2 = getNodeFromId(road1.toNodeId);}
        else {node2 = getNodeFromId(road1.fromNodeId);}
        var nodeStart = node1;
        var dist_min = distance1 (node1,node3);
        var dist = distance1 (node1,node4);
        if (dist < dist_min ) {dist_min=dist;}
        dist = distance1 (node2,node3);
        if (dist < dist_min ) { dist_min = dist; nodeStart = node2;}
        dist = distance1 (node2,node4);
        if (dist < dist_min ) { dist_min = dist; nodeStart = node2;}
        return nodeStart;
    }

    //    function distance (node1 , node2) {
    //        var dist = (node1.geometry.x - node2.geometry.x)*(node1.geometry.x - node2.geometry.x);
    //        dist = dist + (node1.geometry.y - node2.geometry.y)*(node1.geometry.y - node2.geometry.y);
    //       return Math.sqrt(dist);
    //    }

    function distance1 (node1 , node2) { // *** SDK ***
        var point1 = openLayerTransform (node1.geometry.coordinates[0],node1.geometry.coordinates[1],"EPSG:4326","EPSG:900913");
        var point2 = openLayerTransform (node2.geometry.coordinates[0],node2.geometry.coordinates[1],"EPSG:4326","EPSG:900913");
        var dist = (point1.lon-point2.lon)*(point1.lon-point2.lon)+(point1.lat-point2.lat)*(point1.lat-point2.lat);
        return Math.sqrt(dist);
    }

    function manage_WME_SSTR(ev) {
        put_WME_SSTR_button();
        if(document.getElementById('WME_SSTR_All') != null) {
            localStorage['WME_SSTR_enable'] = document.getElementById ('WME_SSTR_enable').checked == 1;
            var road = [];
            var selectedItems = getSelectedSegmentsIds() //  Récupère les Ids des segments sélectionnés
            for (var i = 0; i<selectedItems.length;i++) {
                var seg= getRoadFromId (selectedItems[i]);
                if (seg != null) {road.push(seg);}
            }
            effaceMenu ();
            if(document.getElementById ('WME_SSTR_enable').checked == 1) {
                if (road.length == 1) {
                    document.getElementById ('WME_SSTR_Side').style.display = "inline";
                    document.getElementById ('WME_SSTR_River').style.display = "block";}
                if (road.length >= 1) {
                    document.getElementById ('WME_SSTR').style.display = "inline";
                    document.getElementById ('WME_SSTR_Ldmk').style.display = "block";
                    if (road[0].junctionId !=null) {
                        document.getElementById ('WME_SSTR_Rdt').style.display = "block";
                    }
                    if (getUserRank() >= 2) {
                        document.getElementById ('WME_SSTR_CrgAds').style.display = "block";}
                }
                if (road.length == 2) {
                    document.getElementById ('WME_SSTR_12').style.display = "inline";
                }
            }
        }
        return;
    }

    function effaceMenu () {
        document.getElementById ('WME_SSTR').style.display = "none";
        document.getElementById ('WME_SSTR_Side').style.display = "none";
        document.getElementById ('WME_SSTR_12').style.display = "none";
        document.getElementById ('WME_SSTR_River').style.display = "none";
        document.getElementById ('WME_SSTR_Ldmk').style.display = "none";
        document.getElementById ('WME_SSTR_Rdt').style.display = "none";
        document.getElementById ('WME_SSTR_CrgAds').style.display = "none";
    }

    function manageSmoothRiver () {
        localStorage['WME_SSTR_Smth'] = document.getElementById ('WME_SSTR_SmthRvr').checked == 1;
        return;
    }

    function init_WME_SSTR() {
        if (localStorage['WME_SSTR_enable']=='true') {document.getElementById ('WME_SSTR_enable').checked = 1;}	// restaure old Values (if exist)
        if (localStorage['WME_SSTR_Smth']=='true') {document.getElementById ('WME_SSTR_SmthRvr').checked = 1;}
        wmeSDK.Events.on({eventHandler: manage_WME_SSTR1 ,eventName : "wme-selection-changed"});
        effaceMenu();
        manage_WME_SSTR();
        console_log("Select Same Type Roads initialized");
    }

    function manage_WME_SSTR1 () {
        setTimeout(manage_WME_SSTR, 1001);
    }

    function endAlert() {
        var myMessage = document.getElementById ('WME_JCB_AlertTxt').innerHTML;
        var line = myMessage.split("<br>");
        line.shift();
        document.getElementById ('WME_JCB_AlertTxt').innerHTML = line.join ("<br>");
        if (line.length ==0){
            document.getElementById ('WME_JCB_AlertBox').style.display = "none";
        }
    }

    function getSelectedSegmentsIds() { //  Récupère les Ids des segments sélectionnés
        var selectedItems = wmeSDK.Editing.getSelection();
        var segmentIds = [];
        if (selectedItems && selectedItems.objectType == "segment" && selectedItems.localizedTypeName == "Segment") {segmentIds = selectedItems.ids}
        return segmentIds ;
    }

    function getStreetName(rId) {return wmeSDK.DataModel.Segments.getAddress({segmentId: rId}).street.name;}
    function getRoadFromId(rId) {return wmeSDK.DataModel.Segments.getById({segmentId: rId});}
    function getNodeFromId(nId) {return wmeSDK.DataModel.Nodes.getById({nodeId: nId});}
    function getJunctionFromId(jId) {return wmeSDK.DataModel.Junctions.getById({junctionId: jId});}
    function getUserRank() {return wmeSDK.State.getUserInfo().rank;}
    function clone(objet) {return JSON.parse(JSON.stringify(objet));}
    function console_log(msg) {if (console) {console.log(msg);}}
    function afficheObjet (objet) {for (var e in objet) {alert("objet["+e+"] ="+ objet[e]+" !");}}
}

SSTR_bootstrap();
