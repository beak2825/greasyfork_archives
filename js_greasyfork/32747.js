// =======================================================
// Klang Valley MapRaid
// created manually :: paulkok_my(6)
// =======================================================

// ==UserScript==
// @name Klang Valley MapRaid
// @namespace
// @description Polygon Klang MapRaid
// @include https://www.waze.com/editor/*
// @include https://www.waze.com/*/editor/*
// @include https://editor-beta.waze.com/*
// @version 1.3
// @grant none
// @copyright 2017 - edited by paulkok(6)
// @namespace https://greasyfork.org/users/140133
// @downloadURL https://update.greasyfork.org/scripts/32747/Klang%20Valley%20MapRaid.user.js
// @updateURL https://update.greasyfork.org/scripts/32747/Klang%20Valley%20MapRaid.meta.js
// ==/UserScript==


//---------------------------------------------------------------------------------------


setTimeout(InitMapRaidOverlay, 1000);

function AddRaidPolygon(raidLayer,groupPoints,groupColor,groupNumber){
    
    var mro_Map = Waze.map;
    var mro_OL = OpenLayers;
    var raidGroupLabel = 'KlangValley ' + groupNumber;
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
//				var raidLocationLabel = 'Klang Valley ' + raid_mapLayer.features[i].attributes.number + ' - ' + res2;
                var raidLocationLabel = 'Klang Valley MapRaid ' + raid_mapLayer.features[i].attributes.number;
			} else {
				var raidLocationLabel = 'Klang Valley MapRaid ' + raid_mapLayer.features[i].attributes.number + ' - ' + $('#topbar-container > div > div.topbar > div.location-info-region > div.location-info').text();
						
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

    var mro_mapLayers = mro_Map.getLayersBy("uniqueName","__KlangValley");
        
    var raid_mapLayer = new mro_OL.Layer.Vector("KlangValley", {
        displayInLayerSwitcher: true,
        uniqueName: "__KlangValley"
    });
        
    I18n.translations.en.layers.name["__KlangValley"] = " ";
    mro_Map.addLayer(raid_mapLayer);
    raid_mapLayer.setVisibility(true);
    

var area0106 = [{lon:'101.1087226',lat:'3.4606472'},{lon:'101.1869245',lat:'3.3451503'},{lon:'101.2953186',lat:'3.2502086'},{lon:'101.2980652',lat:'3.2299849'},{lon:'101.3025284',lat:'3.1946782'},{lon:'101.3020135',lat:'3.1717109'},{lon:'101.3049317',lat:'3.1497719'},{lon:'101.3084508',lat:'3.1311745'},{lon:'101.1791039',lat:'3.0021844'},{lon:'101.2437255',lat:'2.8169539'},{lon:'101.4833945',lat:'2.7860408'},{lon:'101.6238447',lat:'2.8021227'},{lon:'101.5253448',lat:'3.1240613'},{lon:'101.4814854',lat:'3.3082208'},{lon:'101.4381899',lat:'3.4985549'},{lon:'101.3749694',lat:'3.490804'},{lon:'101.3296509',lat:'3.4860065'},{lon:'101.2541199',lat:'3.4784673'},{lon:'101.1087226',lat:'3.4606472'}];
var area0207 = [{lon:'101.4359583',lat:'3.4988976'},{lon:'101.5217399',lat:'3.1321173'},{lon:'101.6216131',lat:'2.8022942'},{lon:'101.7615509',lat:'2.8298881'},{lon:'101.7164656',lat:'2.9757142'},{lon:'101.66792',lat:'3.1325'},{lon:'101.653607',lat:'3.2007857'},{lon:'101.6317388',lat:'3.3115745'},{lon:'101.5976143',lat:'3.4865205'},{lon:'101.5463736',lat:'3.4878068'},{lon:'101.5658569',lat:'3.4877198'},{lon:'101.5035439',lat:'3.4889192'},{lon:'101.4359583',lat:'3.4988976'}];
var area0508 = [{lon:'101.7581177',lat:'2.8288594'},{lon:'101.953125',lat:'2.8525196'},{lon:'101.9421387',lat:'3.0157269'},{lon:'101.9634247',lat:'3.0849799'},{lon:'101.9586182',lat:'3.1624555'},{lon:'101.941452',lat:'3.234441'},{lon:'101.9071198',lat:'3.2735167'},{lon:'101.8460083',lat:'3.2995663'},{lon:'101.832962',lat:'3.3235588'},{lon:'101.811676',lat:'3.3420669'},{lon:'101.7965699',lat:'3.3660583'},{lon:'101.7855835',lat:'3.3969035'},{lon:'101.7828369',lat:'3.4277478'},{lon:'101.7725373',lat:'3.503826'},{lon:'101.714859',lat:'3.496287'},{lon:'101.7869568',lat:'3.2577495'},{lon:'101.8219757',lat:'3.1124055'},{lon:'101.7519379',lat:'3.0644102'},{lon:'101.6908264',lat:'3.0465828'},{lon:'101.7581177',lat:'2.8288594'}];
var area0304 = [{lon:'101.5919495',lat:'3.4873772'},{lon:'101.6613007',lat:'3.1432586'},{lon:'101.6860199',lat:'3.0410973'},{lon:'101.7539978',lat:'3.0602962'},{lon:'101.8281555',lat:'3.1076061'},{lon:'101.7230988',lat:'3.4949163'},{lon:'101.5919495',lat:'3.4873772'}];

    AddRaidPolygon(raid_mapLayer, area0106,'#FF4000','Area 01 & 06'); // #7C3592  #00688b  #FF0040  #FF4000
    AddRaidPolygon(raid_mapLayer, area0207,'#33FF00','Area 02 & 07');
    AddRaidPolygon(raid_mapLayer, area0508,'#FF0033','Area 05 & 08');
    AddRaidPolygon(raid_mapLayer, area0304,'#FFFF00','Area 03 & 04');

    setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},3000);
    mro_Map.events.register("moveend", Waze.map, function(){ setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},1500);});
    mro_Map.events.register("zoomend", Waze.map, function(){ setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},1500);});
       
       
}

