// ==UserScript==
// @name                WME MR Boyacá Colombia 2016 Overlay
// @namespace           https://greasyfork.org/en/users/8063-mo
// @description         Crea Polígono para el MapRaid Boyacá Colombia 2016
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             4.2
// @icon                http://files.rimajues0.webnode.es/200000136-f0808f17b7/Bandera-colombia2.gif
// @grant               none
// @author              RIMAJUES
// @copyright           2016
// @downloadURL https://update.greasyfork.org/scripts/20211/WME%20MR%20Boyac%C3%A1%20Colombia%202016%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/20211/WME%20MR%20Boyac%C3%A1%20Colombia%202016%20Overlay.meta.js
// ==/UserScript==


//---------------------------------------------------------------------------------------


//RZ RaidName will be replaced by the name of the layer in your KML file
//RZ RaidNameNoSpaces will be replaced by the name of the layer in your KML file
//RZ AreaPoints will be replaced by the names, colors, and area points from your KML file

setTimeout(InitMapRaidOverlay, 1000);

function AddRaidPolygon(raidLayer,groupPoints,groupColor,groupNumber){
    
    var mro_Map = Waze.map;
    var mro_OL = OpenLayers;
    var raidGroupLabel = ' MR ' + groupNumber;
    var groupName = 'MR' + groupNumber;
    
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

    var mro_mapLayers = mro_Map.getLayersBy("uniqueName","__MRBoyacáColombia2016");
        
    var raid_mapLayer = new mro_OL.Layer.Vector("MR Boyacá Colombia 2016", {
        displayInLayerSwitcher: true,
        uniqueName: "__MRBoyacáColombia2016"
    });
        
    I18n.translations.en.layers.name["__MRBoyacáColombia2016"] = "MR Boyacá Colombia 2016";
    mro_Map.addLayer(raid_mapLayer);
    raid_mapLayer.setVisibility(true);
    

var V1 = [{lon:'-74.528844',lat:'6.270027'},{lon:'-74.366885',lat:'6.046403'},{lon:'-74.284726',lat:'6.081027'},{lon:' -74.220842',lat:'5.952568'},{lon:' -74.279565',lat:'5.862378'},{lon:' -74.229032',lat: '5.832497'},{lon:' -74.177142',lat: '5.908865'},{lon:' -74.100169',lat: '5.875583'},{lon:' -73.978092',lat: '5.723621'},{lon:' -73.715513',lat: '5.778991'},{lon:' -73.645288',lat:'5.714806'},{lon:'-73.633856',lat:'5.909774'},{lon:'-73.502390',lat:'6.111169'},{lon:'-73.368473',lat:'5.991803 '},{lon:' -73.474626',lat:'5.817173'},{lon:' -73.389704',lat:'5.752993'},{lon:' -73.199444',lat:'6.001548'},{lon:' -73.010002',lat:'5.967439'},{lon:' -72.768373',lat:'6.563949'},{lon:' -72.488221',lat:'6.910356'},{lon:' -71.980104',lat:'6.989422'},{lon:' -72.399592',lat:'6.268009'},{lon:' -72.327734',lat:'6.076417'},{lon:' -72.464917',lat:'5.858764'},{lon:' -72.255340',lat:'5.700496'},{lon:' -72.322231',lat:'5.511026'},{lon:' -72.419337',lat:'5.570950'},{lon:' -72.703469',lat:'5.275677'},{lon:' -72.810439',lat:'5.382997'},{lon:' -72.981565',lat:'5.148954'},{lon:' -72.929258',lat:'5.032476'},{lon:' -73.032145',lat:'4.981229'},{lon:' -73.054587',lat:'4.738571'},{lon:' -73.142477',lat:'4.666031'},{lon:' -73.396536',lat:'4.875417'},{lon:' -73.539358',lat:'4.905519'},{lon:' -73.478311',lat:'5.142743'},{lon:' -73.593791',lat:'5.393424'},{lon:' -73.803964',lat:'5.570450'},{lon:' -74.030303',lat:'5.368131'},{lon:' -74.309764',lat:'5.616421'},{lon:' -74.339789',lat:'5.825547'},{lon:' -74.653893',lat:'5.754315'},{lon:'-74.614029',lat:'5.966961'},{lon:' -74.607110',lat:'6.131361'}];
AddRaidPolygon(raid_mapLayer, V1,"#7C3592","Boyacá Colombia 2016");

    
	
	
    setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},3000);
    mro_Map.events.register("moveend", Waze.map, function(){ setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},1500);});
    mro_Map.events.register("zoomend", Waze.map, function(){ setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},1500);});
       

}