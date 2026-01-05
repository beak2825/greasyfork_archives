// ==UserScript==
// @name         WME AltLocationInfo RE
// @namespace    https://greasyfork.org/ru/scripts/19405-wme-altlocationinfo-re
// @version      0.1.3
// @description  Alternative location info from Rosreestr
// @author       coilamo
// @include https://*.waze.com/*editor/*
// @include https://*.waze.com/*map-editor/*
// @include https://*.waze.com/*beta_editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19405/WME%20AltLocationInfo%20RE.user.js
// @updateURL https://update.greasyfork.org/scripts/19405/WME%20AltLocationInfo%20RE.meta.js
// ==/UserScript==

function bootstrapRosreestrInfo()
{
    setTimeout(initialiseRosreestrInfo, 999);
}

function initialiseRosreestrInfo()
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
    var tolerance = Math.pow(2, (13-ll.zoom));

    
    
    var url = "https://pkk5.rosreestr.ru/api/features/1";
    var text = ll.lat + " " + ll.lon;
    var data = {
        "text": text,
        "tolerance": tolerance,
        "limit": 2
	};

    $.ajax({
		dataType: "json",
		url: url,
		data: data,
		error: function(err) {
            alert("error");
		},
		success: function(json) {
                var alispan = document.createElement('span');
                var li;
                if (json.features[0] !== undefined) {
                    if (json.features[0].attrs.address !== undefined) li = json.features[0].attrs.address;
                    else if (json.features[1].attrs.address !== undefined) li = json.features[1].attrs.address;
                    else li="Нет данных";
                } else {
                    li="Нет данных";
                }

                alispan.innerHTML = "RE: " + li;
                
                $('#topbar-container .topbar .location-info-region .alt-location-info').html(alispan);
                console.log("WMEALI: location-info changed");

		}
	});
}

bootstrapRosreestrInfo();