// ==UserScript==
// @name         WME AltLocationInfo
// @version      0.5.8
// @description  Alternative location info from osm
// @author       coilamo
// @match     https://*.waze.com/editor/*
// @match     https://*.waze.com/*/editor/*
// @grant        none
// @namespace    https://greasyfork.org/ru/scripts/16127-wme-altlocationinfo
// @downloadURL https://update.greasyfork.org/scripts/16127/WME%20AltLocationInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/16127/WME%20AltLocationInfo.meta.js
// ==/UserScript==


function bootstrapAltLocInfo()
{
    setTimeout(initialiseAltLocInfo, 999);
}

function initialiseAltLocInfo()
{
    
    console.log("WMEALI: start");
    
    var script   = document.createElement('script');
	script.type  = "text/javascript";
	script.src   = "https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js";
	document.getElementsByTagName('head')[0].appendChild(script);
    console.log("WMEALI: add script jquery.cookie");
	    
    $('#topbar-container .topbar .loading-indicator').css("padding-right", "25px");
    
    var sw = document.createElement('div');
    sw.style.color = '#fff';
    sw.style.float = 'right';
    sw.innerHTML = '<label style="margin:0px;" id="WMEALI_enabled_label"><input type="checkbox" id="WMEALI_enabled" ' + $.cookie("WMEALI_enabled") + '/> Alt Location Info</label>';
    $('#topbar-container .topbar .area-managers-region').after(sw);
    console.log("WMEALI: add switcher");
    
    var altdiv = document.createElement('div');
    altdiv.style.color = '#fff';
    //altdiv.style.fontWeight = 'bold';
    altdiv.style.fontSize = '15px';
    altdiv.className = "alt-location-info";
    $('#topbar-container .topbar .location-info-region').append(altdiv);
    console.log("WMEALI: add alidiv");
    
    $('#topbar-container .topbar .location-info-region .location-info').css("font-weight", "normal");
    
    $("input[type='checkbox']").change(function() {
        if(this.checked) {
            $.cookie("WMEALI_enabled", "checked", {expires: 365});
        } else {
            $.removeCookie("WMEALI_enabled");
        }
        console.log("WMEALI: cookie: ", $.cookie("WMEALI_enabled"));
    });
    
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
    var enableCheckbox = $('#WMEALI_enabled');
    
    if(!enableCheckbox.prop('checked')) {
        console.log("WMEALI: disabled");
        $('#topbar-container .topbar .location-info-region .location-info').css("display", "block");
        $('#topbar-container .topbar .location-info-region .alt-location-info').css("display", "none");
        return;
    }else{
        console.log("WMEALI: enabled");
        $('#topbar-container .topbar .location-info-region .location-info').css("display", "none");
        $('#topbar-container .topbar .location-info-region .alt-location-info').css("display", "block");
    }
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
                if (ll.zoom > 0) {
                    if (json.address.city !== undefined) {
                        li = json.address.city + " / " + li;
                    }
                    if (json.address.town !== undefined) {
                        li = json.address.town + " / " + li;
                    }
                    if (json.address.village !== undefined) {
                        li = json.address.village + " / " + li;
                    }
                    if (json.address.hamlet !== undefined) {
                        li = json.address.hamlet + " / " + li;
                    }
                    if (json.address.city_district !== undefined) {
                        li = json.address.city_district + " / " + li;
                    }
                    if (json.address.suburb !== undefined) {
                        li = json.address.suburb + " / " + li;
                    }
                }
                alispan.innerHTML = li;
                
                $('#topbar-container .topbar .location-info-region .alt-location-info').html(alispan);
                console.log("WMEALI: location-info changed");
            }
		}
	});
}

bootstrapAltLocInfo();