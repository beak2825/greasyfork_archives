// =======================================================
// Penang MapRaid - August 2017
// created manually :: paulkok_my(6)
// =======================================================

// ==UserScript==
// @name Penang MapRaid - August 2017
// @namespace
// @description Polygon Penang MapRaid - August 2017
// @include https://www.waze.com/editor/*
// @include https://www.waze.com/*/editor/*
// @include https://editor-beta.waze.com/*
// @version 1.8
// @grant none
// @copyright 2017 - edited by paulkok(6)
// @namespace https://greasyfork.org/users/140133
// @downloadURL https://update.greasyfork.org/scripts/31376/Penang%20MapRaid%20-%20August%202017.user.js
// @updateURL https://update.greasyfork.org/scripts/31376/Penang%20MapRaid%20-%20August%202017.meta.js
// ==/UserScript==


//---------------------------------------------------------------------------------------


setTimeout(InitMapRaidOverlay, 1000);

function AddRaidPolygon(raidLayer,groupPoints,groupColor,groupNumber){
    
    var mro_Map = Waze.map;
    var mro_OL = OpenLayers;
    var raidGroupLabel = 'Penang ' + groupNumber;
    var groupName = 'RaidGroup ' + groupNumber;
    
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
		var holes = raid_mapLayer.features[i].attributes.holes;
		
        
        if(raidCenterCheck === true){

			//var str = $('#topbar-container > div > div.location-info-region > div').text();
			var str = $('#topbar-container > div > div.topbar > div.location-info-region > div.location-info').text();
			
			var n2 = str.indexOf(" - ");
			
			if(n2 > 0){
				var n = str.length;
				var res = str.substring(n2+2, n);
				var rescount = res.indexOf(" - ");
				if(rescount>0){
					var n3 = res.length;
					var res2 = res.substring(rescount+2, n3);
				}
//				var raidLocationLabel = 'Penang ' + raid_mapLayer.features[i].attributes.number + ' - ' + res2;
                var raidLocationLabel = 'Penang MapRaid ' + raid_mapLayer.features[i].attributes.number;
			} else {
				var raidLocationLabel = 'Penang MapRaid ' + raid_mapLayer.features[i].attributes.number + ' - ' + $('#topbar-container > div > div.topbar > div.location-info-region > div.location-info').text();
						
			}	
			//setTimeout(function(){$('#topbar-container > div > div.location-info-region > div').text(raidLocationLabel);},200);
			setTimeout(function(){$('#topbar-container > div > div.topbar > div.location-info-region > div.location-info').text(raidLocationLabel);},200);
			 if (holes === "false") { break; }
		}
    }
}

function InitMapRaidOverlay(){

    var mro_Map = Waze.map;
    var mro_OL = OpenLayers;

    //if (!mro_Map) return;
	
    //if (!mro_OL) return;

    var mro_mapLayers = mro_Map.getLayersBy("uniqueName","__Penang");
        
    var raid_mapLayer = new mro_OL.Layer.Vector("Penang", {
        displayInLayerSwitcher: true,
        uniqueName: "__Penang"
    });
        
    I18n.translations.en.layers.name["__Penang"] = " ";
    mro_Map.addLayer(raid_mapLayer);
    raid_mapLayer.setVisibility(true);
    

var NE_ISLAND = [{lon:'100.3582192',lat:'5.3374542'},{lon:'100.3559875',lat:'5.4287182'},{lon:'100.3367615',lat:'5.4485413'},{lon:'100.2832031',lat:'5.491603'},{lon:'100.2330781',lat:'5.4878426'},{lon:'100.2358245',lat:'5.4071856'},{lon:'100.2499008',lat:'5.3692451'},{lon:'100.2808011',lat:'5.3371139'},{lon:'100.3582192',lat:'5.3374542'}];

var SW_ISLAND = [{lon:'100.1587487',lat:'5.4840833'},{lon:'100.1855279',lat:'5.3234388'},{lon:'100.160122',lat:'5.2598529'},{lon:'100.2541924',lat:'5.2694254'},{lon:'100.278225',lat:'5.2215616'},{lon:'100.2988244',lat:'5.2796815'},{lon:'100.3623391',lat:'5.242417'},{lon:'100.3582192',lat:'5.3374542'},{lon:'100.2808011',lat:'5.3371139'},{lon:'100.2497292',lat:'5.3692439'},{lon:'100.2356529',lat:'5.4071844'},{lon:'100.2330781',lat:'5.4878426'},{lon:'100.1731682',lat:'5.4827163'},{lon:'100.1587487',lat:'5.4840833'}];

var N_MAINLAND = [{lon:'100.5441284',lat:'5.5770336'},{lon:'100.3285217',lat:'5.5893346'},{lon:'100.3312683',lat:'5.5701996'},{lon:'100.3566742',lat:'5.54628'},{lon:'100.372467',lat:'5.4321361'},{lon:'100.536232',lat:'5.4464906'},{lon:'100.5441284',lat:'5.5770336'}];

var C_MAINLAND = [{lon:'100.3559875',lat:'5.4287182'},{lon:'100.3597641',lat:'5.2878874'},{lon:'100.5406952',lat:'5.28652'},{lon:'100.5317688',lat:'5.394539'},{lon:'100.536232',lat:'5.4464906'},{lon:'100.375663',lat:'5.432769'},{lon:'100.3559875',lat:'5.4287182'}];

var S_MAINLAND = [{lon:'100.5406952',lat:'5.28652'},{lon:'100.3597641',lat:'5.2878874'},{lon:'100.3623391',lat:'5.242417'},{lon:'100.4164124',lat:'5.2106219'},{lon:'100.4122925',lat:'5.1709598'},{lon:'100.3793335',lat:'5.1244562'},{lon:'100.4143524',lat:'5.1183011'},{lon:'100.5544281',lat:'5.1353985'},{lon:'100.5406952',lat:'5.28652'}];

    AddRaidPolygon(raid_mapLayer, NE_ISLAND,"#FF00FF","NE Island"); // #7C3592
    AddRaidPolygon(raid_mapLayer, SW_ISLAND,"#33FF00","SW Island");
    AddRaidPolygon(raid_mapLayer, N_MAINLAND,"#FF0033","N Mainland");
    AddRaidPolygon(raid_mapLayer, C_MAINLAND,"#FFFF00","C Mainland");
    AddRaidPolygon(raid_mapLayer, S_MAINLAND,"#FF00FF","S Mainland");

    setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},3000);
    mro_Map.events.register("moveend", Waze.map, function(){ setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},1500);});
    mro_Map.events.register("zoomend", Waze.map, function(){ setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},1500);});
       
       
}

