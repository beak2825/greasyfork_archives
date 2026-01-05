// ==UserScript==
// @name                WME Barrio Maria Occidente Overlay
// @namespace           https://greasyfork.org/en/users/8063-mo
// @description         Crea Polígono para el MapRaid Barrio Maria Occidente Colombia 2016
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             4.0
// @icon                http://files.rimajues.webnode.es/200000144-89d088bc73/Area-Manager.gif
// @grant               none
// @author              RIMAJUES
// @copyright           2016
// @downloadURL https://update.greasyfork.org/scripts/20204/WME%20Barrio%20Maria%20Occidente%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/20204/WME%20Barrio%20Maria%20Occidente%20Overlay.meta.js
// ==/UserScript==


//---------------------------------------------------------------------------------------


//RZ RaidName will be replaced by the name of the layer in your KML file
//RZ RaidNameNoSpaces will be replaced by the name of the layer in your KML file
//RZ AreaPoints will be replaced by the names, colors, and area points from your KML file

setTimeout(InitMapRaidOverlay, 1000);

function AddRaidPolygon(raidLayer,groupPoints,groupColor,groupNumber){
    
    var mro_Map = Waze.map;
    var mro_OL = OpenLayers;
    var raidGroupLabel = ' Barrio ' + groupNumber;
    var groupName = 'MO' + groupNumber;
    
    var style = {
        strokeColor: groupColor,
        strokeOpacity: .8,
        strokeWidth: 3,
        fillColor: groupColor,
        fillOpacity: 0.15,
        label: raidGroupLabel,
        labelOutlineColor: "black",
        labelOutlineWidth: 3,
        fontSize: 14,
        fontColor: groupColor,
        fontOpacity: .85,
        fontWeight: "bold"  
    };
    
    var attributes = {
        name: groupName,
        number: groupNumber
    };
    
    var pnt= [];
    for(i=0;i<groupPoints.length;i++){
        convPoint = new OpenLayers.Geometry.Point(groupPoints[i].lon,groupPoints[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), mro_Map.getProjectionObject());
        //console.log('MapRaid: ' + JSON.stringify(groupPoints[i]) + ', ' + groupPoints[i].lon + ', ' + groupPoints[i].lat);
        pnt.push(convPoint);
    }
		       
    var ring = new mro_OL.Geometry.LinearRing(pnt);
    var polygon = new mro_OL.Geometry.Polygon([ring]);
    
    var feature = new mro_OL.Feature.Vector(polygon,attributes,style);
    raidLayer.addFeatures([feature]);

}

function CurrentRaidLocation(raid_mapLayer){
    var mro_Map = Waze.map;

    for(i=0;i<raid_mapLayer.features.length;i++){
        var raidMapCenter = mro_Map.getCenter();
        var raidCenterPoint = new OpenLayers.Geometry.Point(raidMapCenter.lon,raidMapCenter.lat);
        var raidCenterCheck = raid_mapLayer.features[i].geometry.components[0].containsPoint(raidCenterPoint);
		var holes = raid_mapLayer.features[i].attributes.holes
		
        
        if(raidCenterCheck === true){

			var str = $('#topbar-container > div > div > div.location-info-region > div').text();
			
			var n2 = str.indexOf(" - ");
			
			if(n2 > 0){
				var n = str.length;
				var res = str.substring(n2+2, n);
				var rescount = res.indexOf(" - ");
				if(rescount>0){
					var n3 = res.length;
					var res2 = res.substring(rescount+2, n3);
				}
				var raidLocationLabel = '[Raid Group - ' + raid_mapLayer.features[i].attributes.number + '] - ' + res2;

			} else {
				var raidLocationLabel = '[Raid Group - ' + raid_mapLayer.features[i].attributes.number + '] - ' + $('#topbar-container > div > div > div.location-info-region > div').text();
						
			}	
			setTimeout(function(){$('#topbar-container > div > div > div.location-info-region > div').text(raidLocationLabel);},200);
			 if (holes === "false") { break; }
		}
    }
}

function InitMapRaidOverlay(){

    var mro_Map = Waze.map;
    var mro_OL = OpenLayers;

    //if (!mro_Map) return;
	
    //if (!mro_OL) return;

    var mro_mapLayers = mro_Map.getLayersBy("uniqueName","__MRBarrioMariaOccidente2016");
        
    var raid_mapLayer = new mro_OL.Layer.Vector("MR Barrio Maria Occidente 2016", {
        displayInLayerSwitcher: true,
        uniqueName: "__MRBarrioMariaOccidente2016"
    });
        
    I18n.translations.en.layers.name["__MRBarrioMariaOccidente2016"] = "MR Barrio Maria Occidente 2016";
    mro_Map.addLayer(raid_mapLayer);
    raid_mapLayer.setVisibility(true);
    

var V1 = [{lon:'-76.634229',lat:'2.453928'},{lon:'-76.632759',lat:'2.456758'},{lon:'-76.630131',lat:'2.453918'},{lon:'-76.631976',lat:'2.452728'}];
AddRaidPolygon(raid_mapLayer, V1,"#7C3592"," Maria Occidente");

    
	
	
    setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},3000);
    mro_Map.events.register("moveend", Waze.map, function(){ setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},1500);});
    mro_Map.events.register("zoomend", Waze.map, function(){ setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},1500);});
       

}