// ==UserScript==
// @name                WME BeenHere
// @namespace           https://greasyfork.org/en/users/5920-rickzabel
// @description         This lets you drop orange boxes around the map to help visualize where you have been editing
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://beta.waze.com/*
// @version             0.0.93
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/11682/WME%20BeenHere.user.js
// @updateURL https://update.greasyfork.org/scripts/11682/WME%20BeenHere.meta.js
// ==/UserScript==
//---------------------------------------------------------------------------------------

setTimeout(InitMapRaidOverlay, 1000);

function AddRaidPolygon(raidLayer, groupPoints, groupColor, groupNumber) {

    groupNumber = "me";
    var point = Waze.map.getExtent();
    groupColor = 'orange';

    groupPoints = [{
        lon: point.left,
        lat: point.top
    }, {
        lon: point.left,
        lat: point.bottom
    }, {
        lon: point.right,
        lat: point.bottom
    }, {
        lon: point.right,
        lat: point.top
    }, {
        lon: point.left,
        lat: point.top
    }];

    var mro_Map = Waze.map;
    var mro_OL = OpenLayers;
    var raidGroupLabel = "";
    var groupName = "";

    var style = {
        strokeColor: "orange",
        strokeOpacity: 0.8,
        strokeWidth: 8,
        fillColor: groupColor,
        fillOpacity: 0.0,
        label: raidGroupLabel,
        labelOutlineColor: "black",
        labelOutlineWidth: 3,
        fontSize: 14,
        fontColor: groupColor,
        fontOpacity: 0.85,
        fontWeight: "bold"
    };
    var attributes = {
        name: groupName
    };

    var pnt = [];
    for (i = 0; i < groupPoints.length; i++) {
        convPoint = new OpenLayers.Geometry.Point(groupPoints[i].lon, groupPoints[i].lat);
        //console.log('MapRaid: ' + JSON.stringify(groupPoints[i]) + ', ' + groupPoints[i].lon + ', ' + groupPoints[i].lat);
        pnt.push(convPoint);
    }

    var ring = new mro_OL.Geometry.LinearRing(pnt);
    var polygon = new mro_OL.Geometry.Polygon([ring]);
    var feature = new mro_OL.Feature.Vector(polygon, attributes, style);
    raidLayer.addFeatures([feature]);

}


function NewBox(mapLayers) {
    return function() {
        AddRaidPolygon(mapLayers);
    };
}

function RemoveLastBox(mapLayers) {
    return function() {
        //alert("RemoveLastBox");

        var mro_Map = Waze.map;
        var mro_mapLayers = mro_Map.getLayersBy("uniqueName", "__BeenHere");

        var mro_mapLayers_mapLayerLength = mro_mapLayers[0].features.length;
        if (mro_mapLayers_mapLayerLength > 0) {
            mro_mapLayers[0].features[mro_mapLayers_mapLayerLength - 1].destroy();
        }

    };
}


function RemoveAllBoxes(mapLayers) {
    return function() {
        //alert("RemoveLastBox");

        var mro_Map = Waze.map;
        var mro_mapLayers = mro_Map.getLayersBy("uniqueName", "__BeenHere");

        var mro_mapLayers_mapLayerLength = mro_mapLayers[0].features.length;
        if (mro_mapLayers_mapLayerLength > 0) {
            mro_mapLayers[0].destroyFeatures();
        }

    };
}


function InitMapRaidOverlay() {


    mapLayers = new OpenLayers.Layer.Vector("Been Here", {
        displayInLayerSwitcher: true,
        uniqueName: "__BeenHere"
    });

    Waze.map.addLayer(mapLayers);
    mapLayers.setVisibility(true);

    var mro_Map = Waze.map;
    var mro_OL = OpenLayers;

    if (mro_Map === null) return;
    if (mro_OL === null) return;

    //append our css to the head

	//background-position: 0 0;
	//background-image: url("//www.waze.com/assets-editor/images/toolbar-sb40be77eac.png");
	//background-repeat: no-repeat;

	var g = '#RemoveLastBox {font-size:30px; color:#59899e;}';
	g = g + ' #NewBox {font-size:30px; color:#59899e;}';
	g = g + ' #TrashBox {font-size:30px;color:#59899e;}';

    $("head").append($('<style type="text/css">' + g + '</style>'));

    //add controls to the map
    var c = '<div id="BeenHere" style="position: absolute; top:280px; left: 6px; z-index: 1040 !important; border-radius: 5px; padding: 4px; background-color: #000000;);"><div id="NewBox" class="waze-icon-plus_neg" style="display:block;" title="Draw a box around the visible area"></div><div id="RemoveLastBox" class="waze-icon-undo" style="display:block;" title="Remove last box"></div><div id="TrashBox" class="waze-icon-trash" style="display:block;" title="Remove all boxes"></div></div>';
    
	$("#WazeMap").append(c);

    //set up listeners
    $("#NewBox").click(NewBox(mapLayers));
    $("#RemoveLastBox").click(RemoveLastBox(mapLayers));
	$("#TrashBox").click(RemoveAllBoxes(mapLayers));

}