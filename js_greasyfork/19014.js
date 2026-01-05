// ==UserScript==
// @name         WME AltLocationInfo Special version
// @version      0.5.8sv
// @description  Alternative location info from osm
// @author       coilamo
// @match     https://*.waze.com/editor/*
// @match     https://*.waze.com/*/editor/*
// @grant        none
// @namespace    https://greasyfork.org/ru/scripts/19014-wme-altlocationinfo-special-version
// @downloadURL https://update.greasyfork.org/scripts/19014/WME%20AltLocationInfo%20Special%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/19014/WME%20AltLocationInfo%20Special%20version.meta.js
// ==/UserScript==


function bootstrapAltLocInfo()
{
    setTimeout(initialiseAltLocInfo, 999);
}

function initialiseAltLocInfo()
{
    
    console.log("WMEALI: start");
    
    var altdiv = document.createElement('div');
    altdiv.style.color = '#fff';
    //altdiv.style.fontWeight = 'bold';
    altdiv.style.fontSize = '15px';
    altdiv.className = "alt-location-info";
    $('#topbar-container .topbar .location-info-region').append(altdiv);
    $('#topbar-container .topbar .location-info-region .location-info').css("font-weight", "normal");
    
    Waze.map.events.register("zoomend", null, function(){ShowLocationInfo()});
    Waze.map.events.register("moveend", null, function(){ShowLocationInfo()});
    $("#WMEALI_enabled_label").on("click", function(){ShowLocationInfo()});
}

function GetLatLonZoom()
{
    var urPos=new OpenLayers.LonLat(Waze.map.center.lon,Waze.map.center.lat);
    urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
    return {
        lat: urPos.lat,
        lon: urPos.lon,
       zoom: Waze.map.zoom
    };
}

function ShowLocationInfo () 
{
    var locationInfoText = $('#topbar-container .topbar .location-info-region .location-info').text();
    var wmeCity = locationInfoText.substr(0, locationInfoText.indexOf(',')); 
    
    $('#topbar-container .topbar .location-info-region .location-info').css("display", "none");
    $('#topbar-container .topbar .location-info-region .alt-location-info').css("display", "block");
    
    
    var ll = GetLatLonZoom();
    var zoom = ll.zoom + 7;
    var url = 'https://nominatim.openstreetmap.org/reverse';
    var data = {
        "lat": ll.lat,
        "lon": ll.lon,
        "zoom": zoom,
		"format": "json",
		"addressdetails": 1,
        "countrycodes": "ru",
        "accept-language": "Ru_ru"
	};
    
    $.ajax({
		dataType: "json",
		cache: false,
		url: url,
		data: data,
		error: function() {
		},
		success: function(json) {
            if (json.display_name !== undefined) {
                var alispan = document.createElement('span');
                var li = json.address.state;
                if (json.address.region !== undefined) {
                    li = json.address.region + " / " + li;
                }
                if (json.address.county !== undefined) {
                    li = json.address.county + " / " + li;
                }
                if (wmeCity !== '') {
                    li = wmeCity + " / " + li;
                }
                
                alispan.innerHTML = li;
                
                $('#topbar-container .topbar .location-info-region .alt-location-info').html(alispan);
            }
		}
	});
}

bootstrapAltLocInfo();