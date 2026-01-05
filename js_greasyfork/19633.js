// ==UserScript==
// @name         WME POI Helper
// @namespace    https://greasyfork.org/ru/scripts/19633-wme-poi-helper
// @version      1.6.29
// @description  Information from external POI services in landmark edit panel
// @author       coilamo & skirda
// @include      https://www.waze.com/*/editor*
// @include      https://www.waze.com/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/19633/WME%20POI%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/19633/WME%20POI%20Helper.meta.js
// ==/UserScript==
// Спасибо skirda за помощь в улучшении скрипта


var WME_2gis_version = '1.6.29';

var wazeActionAddLandmark = null;
var wazefeatureVectorLandmark = null;
var wazeActionUpdateFeatureAddress = null;
var wazeActionUpdateObject = null;

var wme2GIS_debug=false;
var wme2GIS_dontselect=false;
var wme2GIS_changecat = false;
var wme2GIS_AddAddress=false;
var wme2GIS_AddressClip=false;
var wme2GIS_UserRank=-1;     // для пои
var wme2GIS_UserRankAddr=-1; // для адреса
var wme2GIS_radius=10;
var wme2GIS_apikey_yandex="";
var wme2GIS_score=0.03;
var wme2GIS_NavigationPoint=0; // размещать точки-пои рандомно, недалеко от точки входа // update: размещать по умолчанию у точки входа 2gis
var wme2GIS_HNFormat=0;
var wme2GIS_DefCategory="OTHER";
var wme2GIS_osmmap=false;
var wme2GIS_yamap=false;
var wme2GIS_2gismap=false;
var wme2GIS_gmmap=false; // TODO!!!
var wme2GIS_createall=true;

//W.selectionManager._selectedFeatures[0].model.getNavigationPoint().point


function __addtxt(s,t)
{
	if (!s)
		return t === null?'':t;
	if (s.length >= 0 && t !== '')
		s += ' ';
	s += t;
	return s;
}

function cloneConfig(obj)
{
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj)
    {
        if (obj.hasOwnProperty(attr))
        {
            copy[attr] = cloneConfig(obj[attr]);
        }
    }
    return copy;
}

function CreateID()
{
    return 'WME-2Gis-' + WME_2gis_version.replace(/\./g,"-");
}

function PtInPoly(x, y, components)
{
    npol = components.length;
    jj = npol - 1;
    var c = 0;
    for (var ii = 0; ii < npol;ii++)
    {
        if ((((components[ii].y<=y) && (y<components[jj].y)) || ((components[jj].y<=y) && (y<components[ii].y))) &&
            (x > (components[jj].x - components[ii].x) * (y - components[ii].y) / (components[jj].y - components[ii].y) + components[ii].x))
        {
            c = !c;
        }
        jj = ii;
    }
    return c;
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


function wme_2gis() {
    console.log('Starting wme_2gis');
    if (typeof Waze === "undefined")
    {
        console.log("undef Waze");
        setTimeout(wme_2gis,500);
        return;
    }
    if (typeof W.selectionManager === "undefined")
    {
        console.log("undef W.selectionManager");
        setTimeout(wme_2gis,500);
        return;
    }
    if (typeof W.model === "undefined")
    {
        console.log("undef W.model");
        setTimeout(wme_2gis,500);
        return;
    }
    if (typeof W.loginManager === "undefined")
    {
        console.log("undef W.loginManager");
        setTimeout(wme_2gis,500);
        return;
    }
    if (typeof W.loginManager.user === "undefined" || W.loginManager.user === null)
    {
        console.log("W.loginManager.user undefined OR null");
        setTimeout(wme_2gis,500);
        return;
    }

    try {
        W.selectionManager.events.register("selectionchanged", null, wme_2gis_InserHTML);
    }
    catch (err) {
        console.log('wme_2gis error: '+err.message);
    }

    wme2GIS_AddAddress = __GetLocalStorageItem("wme2GIS_AddAddress",'bool',false);

    wme2GIS_AddressClip = __GetLocalStorageItem("wme2GIS_AddressClip",'bool',false);

    wme2GIS_dontselect = __GetLocalStorageItem("wme2GIS_dontselect",'bool',false);

    wme2GIS_changecat = __GetLocalStorageItem("wme2GIS_changecat",'bool',false);

    wme2GIS_NavigationPoint = __GetLocalStorageItem("wme2GIS_NavigationPoint",'int',0);

    wme2GIS_HNFormat = __GetLocalStorageItem("wme2GIS_HNFormat",'int',0);

    wme2GIS_radius = __GetLocalStorageItem("wme2GIS_radius",'int',10);

    wme2GIS_apikey_yandex = __GetLocalStorageItem("wme2GIS_apikey_yandex",'string',"159f7bf6-6781-4c55-8d32-3516e9a38b03");

    wme2GIS_score = __GetLocalStorageItem("wme2GIS_score",'float',0.03);

    try {
        wme2GIS_UserRank = __GetLocalStorageItem("wme2GIS_UserRank",'int',1);
    }
    catch (err) {
        console.log('wme_2gis error: '+err.message);
    }

    try {
        wme2GIS_UserRankAddr = __GetLocalStorageItem("wme2GIS_UserRankAddr",'int',1);
    }
    catch (err) {
        console.log('wme_2gis error: '+err.message);
    }

    try {
        wme2GIS_DefCategory = __GetLocalStorageItem("wme2GIS_DefCategory",'arr','PROFESSIONAL_AND_PUBLIC',I18n.translations[I18n.locale].venues.categories);
    }
    catch (err) {
        console.log('wme_2gis error: '+err.message);
    }

    W.map.events.register("moveend", null, function(){wme_2gis_MoveMaps()});

    /*
    var f=$(".address-form");
    if (f.length > 0)
    {
    	f[0].action="javascript:return false;"
    }
    */

    setTimeout(wme_2gis_initBindPoi, 500);
    setTimeout(Wme2Gis_InitConfig, 500);
}

function convertHouseNumber(HouseNumber){
    HouseNumber = HouseNumber.replace(/([0-9а-иА-И]+)([к]+)([0-9]+)/g,"$1 корпус $3");
    HouseNumber = HouseNumber.replace(/([0-9а-иА-И]+)([с]+)([0-9]+)/g,"$1 строение $3");
    HouseNumber = HouseNumber.replace(/([0-9а-иА-И]+)(вл)([0-9]+)/g,"$1 владение $3");
    HouseNumber = HouseNumber.replace(/(вл)([0-9]+)/g,"владение $2");
    return HouseNumber;
}

function __copyAddressToClipboard(id,fn)
{
    fn=convertHouseNumber(fn);
	var _gm=document.getElementById(id);
	var houseNumber=_gm.getAttribute('houseNumber');
	houseNumber=convertHouseNumber(houseNumber);
    var streetName=_gm.getAttribute('streetName');
	streetName=streetName.replace(/ им\./g, '');
	streetName=streetName.replace(/ имени/g, '');
	var txt = __addtxt(__addtxt(__addtxt(fn,houseNumber),streetName),_gm.getAttribute('cityName').replace(/([^\( ]+).*/,"$1")).replace(/[№«»]/g,"");
	clipboard.copy(txt);

	//jump to link add
	$('#edit-panel').animate({
		scrollTop: $(".external-providers-view").offset().top
	}, 500);
	$(".external-providers-view .add").click();
}

function wme_2gis_MoveMaps()
{
	if (typeof map2GisMove !== "undefined" && map2GisMove)
		return;

	if (wme2GIS_debug) console.log("wme_2gis_MoveMaps()");

	if (W.selectionManager.getSelectedFeatures().length > 0 && W.selectionManager._selectedFeatures[0].model.type === "venue")
	{
	    var zoom=W.map.getZoom();
		var poiPos=W.map.getCenter();
		poiPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));

		if (document.getElementById('map_2gis') && typeof map2Gis !== "undefined")
		{
        	map2Gis.setZoom(zoom);
        	map2Gis.panTo([poiPos.lat,poiPos.lon]);
        }

		if (document.getElementById('map_ya') && typeof mapYM !== "undefined")
		{
			mapYM.setZoom(zoom);
			mapYM.setCenter([poiPos.lat, poiPos.lon]);
		}
		if (document.getElementById('map_osm') && typeof mapOSM !== "undefined")
		{
			mapOSM.setZoom(zoom);
			mapOSM.setCenter(new google.maps.LatLng(poiPos.lat, poiPos.lon));
		}

		//var divmap_Gm = document.getElementById('map_gm');
	}
}


function CreateObserver(Name,fn)
{
    // проверка изменений в панели edit-panel
    var qspObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Mutation is a NodeList and doesn't support forEach like an array
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var addedNode = mutation.addedNodes[i];

                // смотрим только узлы
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    var qspDiv = addedNode.querySelector(Name);
                    if (!qspDiv)
                        fn(qspDiv); // создадим свою панель
                }
            }
        });
    });
    qspObserver.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });
}

function wme_2gis_InserHTML() {
    if (wme2GIS_debug) console.log("wme_2gis_InserHTML()");
    if (W.selectionManager.getSelectedFeatures().length > 0 && W.selectionManager._selectedFeatures[0].model.type === "venue")
    {
    	if (document.getElementById("poihelper"))
    		return ; // панель создана, к терапевту
    	CreateObserver("div.controls.poihelper",makePOIHelperPanel);
    	makePOIHelperPanel();
    }
}

function makePOIHelperPanel() {
        if (!document.getElementById("venue-edit-general")) return;
		if (document.getElementById("poihelper")) return ; // панель создана, к терапевту

        if (wme2GIS_debug) console.log('wme_2gis_InserHTML');
        $('#venue-edit-general').prepend(
            '<div class="form-group" id="poihelper"> \
<label class="control-label">External POI (version ' + WME_2gis_version + ')</label> \
<div class="controls poihelper"> \
<div id="2gis0"><div id="2gis"></div><div id="map_2gis"></div></div> \
<div id="gm0"><div id="gm"></div><div id="street-view"></div></div> \
<div id="ym0"><div id="ym"></div><div id="map_ya"></div></div> \
<div id="osm0"><div id="osm"></div><div id="map_osm"></div></div> \
</div> \
</div> \
</div>'
        );
        var div2gis = document.getElementById('2gis');
        var divGm = document.getElementById('gm');
        var divYm = document.getElementById('ym');
        var divOsm = document.getElementById('osm');

        document.getElementById("map_2gis").setAttribute('style',wme2GIS_2gismap?'width:275px; height:275px':'display:none;');
        document.getElementById("map_ya").setAttribute('style',wme2GIS_yamap?'width:275px; height:275px':'display:none;');
        document.getElementById("map_osm").setAttribute('style',wme2GIS_osmmap?'width:275px; height:275px':'display:none;');
        document.getElementById("street-view").setAttribute('style',wme2GIS_gmmap?'width:275px; height:275px':'display:none;');

        var countryID = W.model.getTopCountry().getID();//W.model.countries.additionalInfo.mainObjectID;
        var lang = "ru_RU";
        var countrycode = "ru";
        switch (countryID) {
            case 232:
                lang = "uk_UA";
                countrycode = "ua";
                break;
            case 37:
                lang = "ru_RU"; //lang = "be_BY";
                countrycode = "by";
                break;
            case 237:
                lang = "ru_RU";
                countrycode = "uz";
                break;
            case 117:
                lang = "kk_KZ";
                countrycode = "kz";
                break;
            case 147:
                lang = "ro_MD";
                countrycode = "md";
                break;
            case 123:
                lang = "lv_LV";
                countrycode = "lv";
                break;
            case 192:
                lang = "sr-Latn-RS";
                countrycode = "rs";
                break;
            default:
                break;
        }

        //getting lon/lat selected point
        var poi_id=W.selectionManager._selectedFeatures[0].model.attributes.id;
        //if (wme2GIS_debug) console.log(W.model.venues.get(poi_id).geometry);

        // координаты всегда берём от мыши
        var mc=document.getElementsByClassName('wz-map-ol-control-span-mouse-position')[0].textContent.split(" ");
        var x=mc[1];
        var y=mc[0];
        var poiPos=new OpenLayers.LonLat(x,y);
        var zoom=W.map.getZoom();
        if (wme2GIS_debug) console.log("https://www.waze.com/ru/editor/?env=row&lon="+poiPos.lon+"&lat="+poiPos.lat+"&zoom=7&marker=yes");


        //-- 2GIS ------------------------------------------------------
        var url = 'https://catalog.api.2gis.ru/2.0/geo/search';
        var data = {
            "point": poiPos.lon + ',' + poiPos.lat,
            "format": "json",
            "fields": "items.links",
            "key": "rubnkm7490"
        };

        $.ajax({
            dataType: "json",
            cache: false,
            url: url,
            data: data,
            error: function() {
            },
            success: function(json) {
                if(!json.result)
                {
                    document.getElementById("map_2gis").setAttribute('style','display:none;');
                    return;
                }
                if(wme2GIS_2gismap)
                {
                	if (DG)
                	{
                		DG.then(function () {
                			map2GisMove=false;
                			map2Gis = DG.map('map_2gis', {center: [poiPos.lat,poiPos.lon],zoom: zoom,fullscreenControl: false,zoomControl: false});
                            /*
                			map2Gis.on('moveend',function(e){
                				map2GisMove=true;
                				var ll=e.target.getCenter();
								var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(ll.lng, ll.lat);
								W.map.setCenter(xy);
                				map2GisMove=false;
                			});
                            */
                		});

					}
                }

                div2gis.innerHTML = '2GIS: ' + json.result.items[0].full_name + '<br/>';

                // у точки не отображаем организации, если она в пределах родителя
                var ispoint=W.selectionManager.hasSelectedFeatures() && W.selectionManager._selectedFeatures[0].model.attributes.geometry.id.indexOf("Point") >= 0;
                var found=false;
                if(ispoint)
                {
                    for(var i in W.model.venues.objects) // ищем родителя
                    {
                        var v=W.model.venues.get(i);
                        if (v.attributes.geometry.id.indexOf(".Point") < 0) // исключаем точки
                        {

                            var poiCoord=new OpenLayers.LonLat(poiPos.lon,poiPos.lat);
                            poiCoord.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
                            if (PtInPoly(poiCoord.lon,poiCoord.lat,v.attributes.geometry.components[0].components))
                            {
                                found=true;
                                break;
                            }
                        }
                        if(found)
                            break;
                    }
                }
                if (wme2GIS_debug) console.log("wme_2gis_InserHTML(): found parent="+found);
                if (!found)
                {
                    if(json.result.items.length > 0)
                    {
                        if(json.result.items[0].links && typeof (json.result.items[0].links) === "object")
                        {
                            if(typeof (json.result.items[0].links.branches) !== "undefined")
                            {
                                div2gis.innerHTML += '<div id="poi_2gis" style="width:275px;"><a href="#" id="getListPoi">Организации в здании</a></div>';
                                document.getElementById('getListPoi').onclick = getListPOI;
                                document.getElementById('getListPoi').setAttribute('building_id', json.result.items[0].id);
                                document.getElementById('getListPoi').setAttribute('lat', poiPos.lat);
                                document.getElementById('getListPoi').setAttribute('lon', poiPos.lon);
                                document.getElementById('getListPoi').setAttribute('page', 1);
                            }
                        }
                    }
                }
            }
        });


        //-- google maps -----------------------------------------------
        var gm_url = 'https://maps.googleapis.com/maps/api/geocode/json';
        var gm_data = {
            "latlng": poiPos.lat + ',' + poiPos.lon,
            "language": countrycode
        };

        $.ajax({
            dataType: "json",
            cache: false,
            url: gm_url,
            data: gm_data,
            error: function() {
            },
            success: function(json) {
            	if (wme2GIS_debug) console.log("GM, json.result=",json.results);
                if(!json.results || !json.results.length)
                {
                    document.getElementById("street-view").setAttribute('style','display:none;');
                    return;
                }
                var gm_obj = json.results[0].address_components;
                //console.log("gm_obj=",gm_obj);

                if(gm_obj[0].long_name !== 'Unnamed Road')
                {
                	var gm_addr=gm_obj[0].long_name;
                	if (gm_obj[1] && gm_obj[1].long_name !== null)
                		gm_addr += ', ' + gm_obj[1].long_name;
                    divGm.innerHTML='<a href="#" id="__clpGM" title="Копировать адрес">GM</a>: <a href="#" id="gm_storeaddress" title="Заполнить адрес">'+gm_addr+'</a>';

                    //var StreetViewPanorama=
                    new google.maps.StreetViewPanorama(
                        document.getElementById('street-view'),
                        {
                            position: {lat: poiPos.lat, lng: poiPos.lon},
                            pov: {heading: 165, pitch: 0},
                            zoom: 1
                        });
                    // StreetViewPanorama.setPov({ heading: 90, pitch: 0, zoom: 1 })

                    if (document.getElementById('gm_storeaddress'))
                    {
                    	document.getElementById('gm_storeaddress').onclick =  __ModityAddressYM;
                    	document.getElementById('gm_storeaddress').setAttribute('cityName', (gm_obj[2].long_name !== null)?gm_obj[2].long_name:'');
                	    document.getElementById('gm_storeaddress').setAttribute('streetName', (gm_obj[1].long_name !== null)?gm_obj[1].long_name:'');
            	        document.getElementById('gm_storeaddress').setAttribute('houseNumber', (gm_obj[0].long_name !== null)?gm_obj[0].long_name:'');
        	            document.getElementById('__clpGM').onclick=function(){
        	            	__copyAddressToClipboard('gm_storeaddress','');
						};
					}
                }
                else
                {
                    document.getElementById("street-view").setAttribute('style','display:none;');
                    divGm.innerHTML='GM: ЗДЕСЬ РЫБЫ НЕТ!'; //!!!!!
                }
            }
        });


        //-- yandex maps -----------------------------------------------
        var ym_url = 'https://geocode-maps.yandex.ru/1.x/';
        var ym_data = {
            "geocode": poiPos.lon + ',' + poiPos.lat,
            "format":"json",
            "lang": lang,
            "apikey": wme2GIS_apikey_yandex
        };

        $.ajax({
            dataType: "json",
            cache: false,
            url: ym_url,
            data: ym_data,
            error: function() {
            },
            success: function(json) {
                if(!json.response)
                {
                    document.getElementById("map_ya").setAttribute('style','display:none;');
                    return;
                }

                function findSomething(object, name) {
                    //if (wme2GIS_debug) console.log(object);
                    if (name in object) return object[name];
                    for (key in object) {
                        if ((typeof (object[key])) == 'object') {
                            var t = findSomething(object[key], name);
                            if (t) return t;
                        }
                    }
                    return null;
                }

                var ym_obj = null;
                try{
                	ym_obj=json.response.GeoObjectCollection.featureMember[0].GeoObject;
				}catch(e){if (wme2GIS_debug) {console.log(e);console.log(json.response);}}
				if (!ym_obj)
					return;

                var cityName = findSomething(ym_obj, "LocalityName");
                var streetName;
                if(findSomething(ym_obj, "ThoroughfareName") !== null) {
                    streetName = findSomething(ym_obj, "ThoroughfareName");
                } else if(findSomething(ym_obj, "DependentLocalityName") !== null) {
                    streetName = findSomething(ym_obj, "DependentLocalityName");
                }
                var houseNumber = findSomething(ym_obj, "PremiseNumber");

                var innerHTML=((houseNumber !== undefined && houseNumber !== null) || wme2GIS_yamap)?'<a href="#" id="__clpYM" title="Копировать адрес">YM</a>: ':'';
                if(houseNumber !== undefined && houseNumber !== null)
                    innerHTML+='<a href="#" id="ym_storeaddress" title="Заполнить адрес">' + houseNumber + ', ' + streetName + '</a>';
                divYm.innerHTML=innerHTML;

                if(houseNumber !== undefined && houseNumber !== null)
                {
                    var ym_locality = findSomething(ym_obj, "LocalityName");
                    if(typeof(ym_locality.DependentLocality) !== undefined)
                    	ym_locality = ym_locality.DependentLocality;

                    if (document.getElementById('ym_storeaddress'))
                    {
                    	document.getElementById('ym_storeaddress').onclick =  __ModityAddressYM;
                    	document.getElementById('ym_storeaddress').setAttribute('cityName', (cityName !== null && document.getElementById('ym_storeaddress'))?cityName:'');
                    	document.getElementById('ym_storeaddress').setAttribute('streetName', (streetName !== null && document.getElementById('ym_storeaddress'))?streetName:'');
                    	document.getElementById('ym_storeaddress').setAttribute('houseNumber', (houseNumber !== null && document.getElementById('ym_storeaddress'))?houseNumber:'');
						if (document.getElementById('__clpYM'))
	                    	document.getElementById('__clpYM').onclick=function(){
	                    		__copyAddressToClipboard('ym_storeaddress','');
							};
					}

                }

                if(wme2GIS_yamap)
                {
                    mapYM = new ymaps.Map("map_ya", {
                        center: [poiPos.lat, poiPos.lon],
                        zoom: zoom,
                        controls: ["zoomControl", "fullscreenControl"]
                    });
                }
            }
        });

        //-- OSM maps --------------------------------------------------
        var osm_url = 'https://nominatim.openstreetmap.org/reverse';
        var osm_data = {
            "lat": poiPos.lat,
            "lon": poiPos.lon,
            "zoom": 20,
            "format": "json",
            "addressdetails": 1,
            "countrycodes": countrycode,
            "accept-language": lang
        };

        $.ajax({
            dataType: "json",
            cache: false,
            url: osm_url,
            data: osm_data,
            error: function() {
            },
            success: function(json) {
                if(!json.address)
                {
                    document.getElementById("map_osm").setAttribute('style','display:none;');
                    return;
                }
                var osm_obj = json.address;

                if(!(osm_obj.house_number !== undefined || wme2GIS_osmmap))
                {
                    document.getElementById("map_osm").setAttribute('style','display:none;');
                    return; // лишнее не отображаем
                }

                var innerHTML=osm_obj.house_number !== undefined || wme2GIS_osmmap?'<a href="#" id="__clpOSM" title="Копировать адрес">OSM</a>: ':'';
//window.osm_obj=osm_obj;
                if(osm_obj.house_number !== undefined) {
                    var osm_street;
                    if(osm_obj.road !== undefined) osm_street = osm_obj.road;
                    else if(osm_obj.residential !== undefined) osm_street = osm_obj.residential;
                    else osm_street = "";
                    innerHTML+='<a href="#" id="osm_storeaddress" title="Заполнить адрес">'+osm_obj.house_number + ', ' + osm_street + '</a>';
                }
                divOsm.innerHTML=innerHTML;

                if(osm_obj.house_number !== undefined)
                {
                    if (document.getElementById('osm_storeaddress'))
                    {
                       document.getElementById('osm_storeaddress').onclick =  __ModityAddressYM;
                       document.getElementById('osm_storeaddress').setAttribute('cityName', osm_obj.city);
                       document.getElementById('osm_storeaddress').setAttribute('streetName', osm_street);
                       document.getElementById('osm_storeaddress').setAttribute('houseNumber', osm_obj.house_number);
						if (document.getElementById('__clpOSM'))
    	                	document.getElementById('__clpOSM').onclick=function(){
    	                		__copyAddressToClipboard('osm_storeaddress','');
							};

                    }
                }
                if(wme2GIS_osmmap)
                {
                    //Google maps API initialisation
                    var element = document.getElementById("map_osm");
                    if (element)
                    {
                        mapOSM = new google.maps.Map(element, {
                            center: new google.maps.LatLng(poiPos.lat, poiPos.lon),
                            zoom: 17,
                            mapTypeId: "OSM",
                            mapTypeControl: false,
                            streetViewControl: false
                        });

                        //Define OSM map type pointing at the OpenStreetMap tile server
                        mapOSM.mapTypes.set("OSM", new google.maps.ImageMapType({
                            getTileUrl: function(coord, zoom) {
                                return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                            },
                            tileSize: new google.maps.Size(256, 256),
                            name: "OpenStreetMap",
                            maxZoom: zoom
                        }));
                    }
                }
            }
        });


		// Скопировать для линковки
		if ($(".external-providers-view").length > 0)
		{
			// Название: Лилия, студия свадебного дизайна
			// Адрес: Волгоград, Ополчения улица, 11
			// нажали скопировать для линка с Google, в буфер считали Имя пои (Лилия) + номер дома (11) + улица (Ополченская улица) + город (Волгоград). Получили в буфере строку: Лилия 11 Оплоченская улица Волгоград. ВСЕ… Больше ничего не надо.Далее я тыкаю на Связать с Google и вставляю эту строку из буфера в поле
			var addr=W.selectionManager.getSelectedFeatures()[0].model.getAddress();
			var attr=W.selectionManager.getSelectedFeatures()[0].model.attributes;
			var objectName='';
			if (attr.name !== null && attr.name.length > 0)
				objectName=attr.name.split(",")[0].trim();

			$(".external-providers-view").after('<button class="btn-link" type="button" id="_wme2gis_clipToLink" onclick=""><i class="fa fa-link"></i>&nbsp;Скопировать для привязки</button>');
			if (document.getElementById('_wme2gis_clipToLink'))
			{
                //console.log(addr.get("houseNumber"));
				document.getElementById('_wme2gis_clipToLink').setAttribute('houseNumber',(addr.attributes.houseNumber != objectName.replace("к","-").replace("с","-").replace("вл","-") && addr.attributes.houseNumber !== null)?addr.attributes.houseNumber:'');
				document.getElementById('_wme2gis_clipToLink').setAttribute('cityName', (addr.getCity() && addr.getCity().getName() !== null)?addr.getCity().getName():'');
				document.getElementById('_wme2gis_clipToLink').setAttribute('streetName', (addr.getStreet() && addr.getStreet().name !== null)?addr.getStreet().name:'');
				document.getElementById('_wme2gis_clipToLink').setAttribute('objectName', objectName);

				$("#_wme2gis_clipToLink").attr("onclick","").click(function(e){
					__copyAddressToClipboard(e.target.id,this.getAttribute('objectName'));
				});
			}
		}
/*
        if ($(".toggle-residential").length > 0) // подмена клика - перед преобразованием в резиденталь сбросить имя
        {
            console.log("Poi Helper 1");
			$(".toggle-residential").attr("onclick",'').click(function(){
				if (!W.selectionManager._selectedFeatures[0].model.attributes.residential)
				{
                    console.log("Poi Helper 2");
					if($('wz-text-input[name="name"]').length > 1)
					{
                        console.log("Poi Helper 3");
						for(var ii=0; ii < $('wz-text-input[name="name"]').length; ++ii)
						{
							if (typeof ($($('wz-text-input[name="name"]')[ii]).attr("id")) === "undefined")
							{
								$($('wz-text-input[name="name"]')[ii]).val('').change();
								break;
							}
						}
					}
					else
					{
                        console.log("Poi Helper 4");
						$('wz-text-input[name="name"]').val('').change();
					}

					//setTimeout(function(){__reselectItem();}, 60);
				}
			});
		}
		else {
            console.log("Poi Helper 5");
			$(".attributes-form").before('<button class="btn-link toggle-residential" type="button" onclick="">Вернуть обратно публичный POI</button>');
        }*/
    return;
}

function __reselectItem()
{
	var savedItem=W.selectionManager._selectedFeatures[0].model;
	W.selectionManager.unselectAll();
	setTimeout(function() {W.selectionManager._selectedFeatures[0].select([savedItem]);}, 60);
}

function GetControlName(id)
{
    var beta = (location.hostname == "beta.waze.com"?true:false);
    switch(id)
    {
        case 'form':
            return beta?".full-address":".full-address";
        case 'cityname':
            return beta?'.city-name':'.city-name';
        case 'citynamecheck':
            return beta?".empty-city":".empty-city";
        case 'streetname':
            return beta?'.street-name':'.street-name';
        case 'streetnamecheck':
            return beta?".empty-street":".empty-street";
        case 'housenumber':
            return beta?'.house-number':'.house-number';
        case 'save':
            return beta?'.save-button':'.save-button';
        case 'cancel':
            return beta?'.cancel-button':'.cancel-button';
        case 'name':
            return "name";
    }
    return '';
}

function __ModityAddressYM()
{
    var cityName=this.getAttribute('cityname');
    if (wme2GIS_debug) console.log(cityName);
    var streetName=this.getAttribute('streetname');
    if (wme2GIS_debug) console.log(streetName);
    var houseNumber=this.getAttribute('housenumber');
    if (wme2GIS_debug) console.log(houseNumber);
    var mod=false;

    // удаляем пробелы
    houseNumber=houseNumber.replace(/\s+/g, '');
    // сокращаем
    houseNumber=houseNumber.replace(/корпус/g, 'к');
    houseNumber=houseNumber.replace(/строение/g, 'с');
    houseNumber=houseNumber.replace(/владение/g, 'вл');

    var addaltname=false;
    var houseNumber2=convertHouseNumber(houseNumber); // для alt name

	if (houseNumber2 != houseNumber)
		addaltname=true;

    if (wme2GIS_AddressClip)
    {
		var streetName2=streetName.replace(/ им\./g, '');
		streetName2=streetName2.replace(/ имени/g, '');
		var txt = __addtxt(__addtxt(__addtxt('',houseNumber2),streetName2),cityName.replace(/([^\( ]+).*/,"$1")).replace(/[№«»]/g,"");
		clipboard.copy(txt);
	}

    $(".alias-name").each(function(indx, element){
        if($(element).val() === houseNumber2)
           addaltname=false;
    });

    if (addaltname)
    {

        $(".aliases-view").find(".add").click()
        if ($(".alias-name").length > 0)
        {
            $($(".alias-name")[$(".alias-name").length-1]).val(houseNumber2).change();
        }
    }


    // кликаем кнопку изменение адреса
    $(GetControlName('form')).click();

    // открылась форма
    setTimeout(function() {
        var res=null;

        // ** обработка номера дома **
        if(houseNumber && houseNumber !== "")
        {
            switch(wme2GIS_HNFormat){
                case 0:
                    // коррекция в соответствии с 2gis
                    houseNumber=houseNumber.toLowerCase();
                    if (houseNumber.indexOf("б") > -1) // "Б" делаем большим
                        houseNumber=houseNumber.toUpperCase();
                    break;
                case 1:
                    // коррекция в соответствии с yandex
                    houseNumber=houseNumber.toUpperCase();
                    if (houseNumber.indexOf("К") > -1) houseNumber=houseNumber.substring(0,houseNumber.lastIndexOf("К")) + houseNumber.substring(houseNumber.lastIndexOf("К"), houseNumber.lastIndexOf("К")+1).toLowerCase() + houseNumber.slice(houseNumber.lastIndexOf("К")+1);
                    if (houseNumber.indexOf("С") > -1) houseNumber=houseNumber.substring(0,houseNumber.lastIndexOf("С")) + houseNumber.substring(houseNumber.lastIndexOf("С"), houseNumber.lastIndexOf("С")+1).toLowerCase() + houseNumber.slice(houseNumber.lastIndexOf("С")+1);
                    if (houseNumber.indexOf("ВЛ") > -1) houseNumber=houseNumber.substring(0,houseNumber.lastIndexOf("ВЛ")) + houseNumber.substring(houseNumber.lastIndexOf("ВЛ"), houseNumber.lastIndexOf("ВЛ")+2).toLowerCase() + houseNumber.slice(houseNumber.lastIndexOf("ВЛ")+2);
                    if (houseNumber.indexOf("ДВ") > -1) houseNumber=houseNumber.substring(0,houseNumber.lastIndexOf("ДВ")) + houseNumber.substring(houseNumber.lastIndexOf("ДВ"), houseNumber.lastIndexOf("ДВ")+2).toLowerCase() + houseNumber.slice(houseNumber.lastIndexOf("ДВ")+2);
                    break;
                case 2:
                    // коррекция в соответствии с BY
                    houseNumber=houseNumber.toUpperCase();
                    houseNumber=houseNumber.replace('К', '/');
                    break;
                case 3:
                    // коррекция для UK
                    houseNumber=houseNumber.toUpperCase();
                    if (houseNumber.indexOf("І") > -1) houseNumber=houseNumber.substring(0,houseNumber.lastIndexOf("І")) + houseNumber.substring(houseNumber.lastIndexOf("І"), houseNumber.lastIndexOf("І")+1).toLowerCase() + houseNumber.slice(houseNumber.lastIndexOf("І")+1);
                    if (houseNumber.indexOf("З") > -1) houseNumber=houseNumber.substring(0,houseNumber.lastIndexOf("З")) + houseNumber.substring(houseNumber.lastIndexOf("З"), houseNumber.lastIndexOf("З")+1).toLowerCase() + houseNumber.slice(houseNumber.lastIndexOf("З")+1);
                    if (houseNumber.indexOf("О") > -1) houseNumber=houseNumber.substring(0,houseNumber.lastIndexOf("О")) + houseNumber.substring(houseNumber.lastIndexOf("О"), houseNumber.lastIndexOf("О")+1).toLowerCase() + houseNumber.slice(houseNumber.lastIndexOf("О")+1);
                    if (houseNumber.indexOf("К") > -1) houseNumber=houseNumber.substring(0,houseNumber.lastIndexOf("К")) + houseNumber.substring(houseNumber.lastIndexOf("К"), houseNumber.lastIndexOf("К")+1).toLowerCase() + houseNumber.slice(houseNumber.lastIndexOf("К")+1);
                    break;
                default:
                    break;
            }

            // валидация


            // выносим номер дома в название (если пусто)
            if($('wz-text-input[name="name"]').length > 1)
            {
                for(var ii=0; ii < $('wz-text-input[name="name"]').length; ++ii)
                {
                    if (typeof ($($('wz-text-input[name="name"]')[ii]).attr("id")) === "undefined" && !$($('wz-text-input[name="name"]')[ii]).val())
                    {
                        //манёвр с focus нужен чтобы редактор не потерял housenumber
                        $($('wz-text-input[name="name"]')[ii]).focus();
                        $($('wz-text-input[name="name"]')[ii]).val(houseNumber).change();
                        $($('wz-text-input[name="name"]')[ii]).blur();
                        break;
                    }
                }
            }
            else
            {
                //манёвр с focus нужен чтобы редактор не потерял housenumber
                $('wz-text-input[name="name"]').focus();
                if(!$('wz-text-input[name="name"]').val())
                    $('wz-text-input[name="name"]').val(houseNumber).change();
                else if($('wz-text-input[name="name"]').val() !== houseNumber) {
                    if(confirm ("Изменить Название POI "+$('wz-text-input[name="name"]').val()+"->"+houseNumber+"?")) {
                        $('wz-text-input[name="name"]').val(houseNumber).change();
                    }
                }
                $('wz-text-input[name="name"]').blur();
            }

            //ставим лок
            if (wme2GIS_debug) console.log("__ModityAddressYM(): userRank="+wme2GIS_UserRank);
            if (wme2GIS_debug) console.log("__ModityAddressYM(): userRankAddr="+wme2GIS_UserRankAddr);

            if($('input[name="lockRank"]').val() !== wme2GIS_UserRankAddr)
                $('input[name="lockRank"]').val(wme2GIS_UserRankAddr).change();

            // если ХН пусто или не совпадает с новым
            if(!$(GetControlName('housenumber')).val() || $(GetControlName('housenumber')).val() !== houseNumber)
            {
                var houseNumber3=""; // для адреса с корпусами ХН ставим "-"

                houseNumber3=houseNumber.replace(/([0-9])([к]+)([0-9]+)/g,"$1-$3");
                houseNumber3=houseNumber3.replace(/([0-9]+)([с]+)([0-9]+)/g,"$1-$3");
                houseNumber3=houseNumber3.replace(/([0-9]+)(вл)([0-9]+)/g,"$1-$3");
                // ... допустимо только " 'цифр в количестве от 1 до 6' И_ВОЗМОЖНО ('буквы' ИЛИ '/буквы' ИЛИ '/цифры') "
                if(/^\d{1,6}(([а-яА-Я]*)|((\/|\-){1}(([а-яА-Я]+)|([0-9]+))))$/.test(houseNumber3))
                {
                    // можно ставить ХН
                    $(GetControlName('housenumber')).val(houseNumber3).change();
                    mod=true;
                }
            }
        }

        // ** обработка имени НП **
        if (wme2GIS_debug) console.log("cityName="+cityName)
        if(cityName && cityName !== "")
        {
        	if (wme2GIS_debug) console.log("start CITYS");
            //блок по преобразованию имени сити к нашему виду.
            var wmeCityName;
            var citys=[];
            var i=0;
            for(i in W.model.cities.objects)
            {
            	var name_c=W.model.cities.objects[i].attributes.name;
                if (wme2GIS_debug) console.log("W.model.cities.objects["+i+"].attributes.name="+name_c);
                //if (name_c)
                	citys.push({"name": name_c, "id": W.model.cities.objects[i].attributes.id});
            }

            if (wme2GIS_debug) { console.log("citys:"); console.log(citys); }
            var options = {
                caseSensitive: false,
                includeScore: false,
                shouldSort: true,
                tokenize: true,
                threshold: 0.6,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                keys: ["name"]
            };
            var f = new Fuse(citys, options);
            wmeCityName = f.search(cityName);
            if (wmeCityName && wmeCityName.length > 0)
            {
            	if (wme2GIS_debug) console.log("wmeCityName[0].name="+wmeCityName[0].name);
                
				if($(GetControlName('cityname')).val() !== wmeCityName[0].name) {

            	    // если чекед ("без НП") - сделать uncheck (разлочить строку ввода)
            	    if ($(GetControlName('citynamecheck'))[0].checked)
            	        $(GetControlName('citynamecheck')).click();
            	    //если имя не пустое, сообщаем, что мы его меняем
            	    if($(GetControlName('cityname')).val().length) {
            	        if(confirm('Изменить НП ' + $(GetControlName('cityname')).val() + ' -> ' + wmeCityName[0].name + '?'))
            	        {
            	            // ставим имя стрита в адрес
            	            $(GetControlName('cityname')).val({"id": wmeCityName[0].id, "text": wmeCityName[0].name}).change();
            	            mod=true;
            	        }
            	    }else{
            	        // ставим имя стрита в адрес
            	        $(GetControlName('cityname')).val({"id": wmeCityName[0].id, "text": wmeCityName[0].name}).change();
            	        mod=true;
            	    }
            	}
			}
        }

        // ** обработка имени стрита **
        if(streetName && streetName !== "")
        {
            if (W.model.countries.top.name === "Ukraine") {
                var shortings = {
                    "(^| )проїзд( |$)": "$1пр.$2",
                    "(^| )вулиця( |$)": "$1вул.$2",
                    "(^| )станція( |$)": "$1cт.$2",
                    "(^| )бульвар( |$)": "$1б-р$2",
                    "(^| )мікрорайон( |$)": "$1мкрн.$2",
                    "(^| )набережна( |$)": "$1наб.$2",
                    "(^| )провулок( |$)": "$1пров.$2",
                    "(^| )проспект( |$)": "$1просп.$2"
                };

                Object.keys(shortings).forEach(function(key) {
                    var re = new RegExp(key, 'i');
                    if (re.test(streetName))
                        streetName = streetName.replace(re, shortings[key]);
                });
            };

            function simplifyStreetName(streetName) {
                streetName = streetName.normalize('NFC');
                streetName = streetName.replace(/([0-9]+)([\-])([гоаяйлети]+)/g,"$1");
                streetName = streetName.replace(/(^| )летия( |$)/, '$1$2');
                streetName = streetName.replace(/(^| )имени( |$)/, '$1$2');
                streetName = streetName.replace(/(^| )лет( |$)/, '$1$2');
                //streetName = streetName.replace(/[ё]/, 'е');
                return streetName.replace(/\s{2,}/g, ' ');
            }

            //блок по преобразованию имени стрита к нашему виду.
            var sts=['аллея', 'бульвар', 'линия', 'набережная', 'переулок', 'площадь', 'проезд', 'проспект', 'спуск', 'тупик', 'улица', 'шоссе', 'вул.', 'дор.', 'ст.', 'б-р.', 'мкрн.', 'наб.', 'пров.', 'просп.'];
            var wmeStreetName;
            var streets=[];
            var i=0;
            for(i in W.model.streets.objects) {
                if (wme2GIS_debug) console.log("W.model.streets.objects["+i+"].name="+W.model.streets.objects[i].name);
                if (W.model.streets.objects[i].name) {
                    var name=W.model.streets.objects[i].name;
                    var st="";
                    var j=0;
                    for (j of sts) {
                        if (name.indexOf(j) + 1) {
                            st = j.replace(/\s{2,}/g, ' ');
                        }
                        name = simplifyStreetName(name.replace(j,'').trim());
                    }
                    streets.push({"fullname": W.model.streets.objects[i].name, "name-st": name + ' ' + st, "st-name": st + ' ' + name, "name": name, "id": W.model.streets.objects[i].id});
                }
            }

            if (wme2GIS_debug) {console.log("streets:");console.log(streets);}
            var options = {
                shouldSort: true,
                includeScore: true,
                threshold: 0.6,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [{
                    name: 'name-st',
                    weight: 0.4
                }, {
                    name: 'st-name',
                    weight: 0.4
                }, {
                    name: 'name',
                    weight: 0.2
                }]
            };
            var f = new Fuse(streets, options);
            if (wme2GIS_debug) console.log(simplifyStreetName(streetName));
            wmeStreetName = f.search(simplifyStreetName(streetName));
            if (wme2GIS_debug) console.log('found: ', wmeStreetName);

            if (wme2GIS_debug) console.log('score', wmeStreetName[0].score);
            if (wme2GIS_debug) console.log('wme2GIS_score', wme2GIS_score);

            if($(GetControlName('streetname')).val() !== wmeStreetName[0].item.fullname) {
            //Если вхождение недостаточно точное, сообщаем, что такой улицы возможно нет на карте вейза
                if(wmeStreetName[0].score > wme2GIS_score) {
                    alert('В WME не нашлось достоточно похожей улицы на \'' + streetName + '\'. Проверьте, есть ли такая улица в вейзе или настройте параметр \'Приемлемый результат совпадения улиц\'');
                }else{
                    // если чекед ("без улицы") - сделать uncheck (разлочить строку ввода)
                    if ($(GetControlName('streetnamecheck'))[0].checked)
                        $(GetControlName('streetnamecheck')).click();
                    //если имя не пустое, сообщаем, что мы его меняем

                    var wzStreetName = document.querySelector(GetControlName('streetname'));
                    var shadow1;
                    var wzTextInput;
                    var wzMenu;
                    var streetId = wmeStreetName[0].item.id.toString();

                    if($(GetControlName('streetname')).val().text !== '' && $(GetControlName('streetname')).val().text !== wmeStreetName[0].item.fullname) {
                        if(confirm('Изменить улицу ' + $(GetControlName('streetname')).val().text + ' -> ' + wmeStreetName[0].item.fullname + '?'))
                        {
                            // ставим имя стрита в адрес
                            $(GetControlName('streetname')).val({"id": streetId, "text": wmeStreetName[0].item.fullname});
                            shadow1 = wzStreetName.shadowRoot;
                            wzTextInput =  $(shadow1).find("#text-input");
                            $(wzTextInput).val(wmeStreetName[0].item.fullname).change();
                            $(wzTextInput).focus();

                            wzMenu =  $(shadow1).find("wz-menu");
                            setTimeout(function() {
                                $(wzMenu).find("wz-menu-item[item-id=" + streetId + "]").click();
                            }, 60);
                            mod=true;
                        }
                    }else{
                        // ставим имя стрита в адрес
                        $(GetControlName('streetname')).val({"id": streetId, "text": wmeStreetName[0].item.fullname});
                        shadow1 = wzStreetName.shadowRoot;
                        wzTextInput = $(shadow1).find("#text-input");
                        $(wzTextInput).val(wmeStreetName[0].item.fullname).change();
                        $(wzTextInput).focus();

                        wzMenu = $(shadow1).find("wz-menu");
                        setTimeout(function() {
                            $(wzMenu).find("wz-menu-item[item-id=" + streetId + "]").click();
                        }, 60);
                        mod=true;
                    }
                }
            }
        }


        if (wme2GIS_debug) console.log("GetControlName('save')="+GetControlName('save'));
        setTimeout(function() {
            $((mod ?GetControlName('save'):GetControlName('cancel'))).click();
        }, 120);
        //__reselectItem();
    }, 60);

    // Меняем категорию на по умолчанию
	if (wme2GIS_debug) console.log("$('wz-checkable-chip[checked]').val()="+ $('wz-checkable-chip[checked]').val() +", wme2GIS_DefCategory="+ wme2GIS_DefCategory +", wme2GIS_changecat="+ wme2GIS_changecat)
    if($('wz-checkable-chip[checked]').val() !== "OTHER"/*wme2GIS_DefCategory*/ && wme2GIS_changecat) {
        if(confirm('Изменить тип пои с ' + $('wz-checkable-chip[checked]').val() + ' на ' + "OTHER"/*wme2GIS_DefCategory*/)) {
            $('.selected-category-chip-remove').each(function(o){this.click();}); //сначала удаляем что есть
            $('wz-image-chip:contains("Other")').click();
        }
    }
    //если тип пои лендмарк, нажимаем Добавить выход
    if(W.selectionManager.hasSelectedFeatures() && W.selectionManager._selectedFeatures[0].model.attributes.geometry.id.indexOf("Polygon") >= 0) {
        $('.add-button').click();
        console.log('.add-button clicked', W.selectionManager._selectedFeatures[0].model.attributes.geometry.id);
    }
}

function getListPOI(){
    if (wme2GIS_debug) console.log("getListPOI()");
    var building_id=this.getAttribute('building_id');
    var lonc=this.getAttribute('lon');
    var latc=this.getAttribute('lat');
    var page=this.getAttribute('page');

    var url = 'https://catalog.api.2gis.ru/2.0/catalog/branch/list';
    var data = {
        "building_id": building_id,
        "fields": "items.point",
        "page_size": 50,
        "page": page,
        "key": "rubnkm7490"
    };

    $.ajax({
        dataType: "json",
        cache: false,
        url: url,
        data: data,
        error: function() {
        },
        success: function(json) {
            if (wme2GIS_debug) console.log(json);
            if(json.meta.error === undefined) {
                var total = parseInt(json.result.total);
                var poi_list='';
                for (var i = 0; i < total; i++)
                {
                    if(json.result.items[i] === undefined) break;
                    if(__GetLocalStorageItem("wme2GIS_id_" + json.result.items[i].id.split("_")[0],'bool',false)) poi_list+='<a href="#" style="padding-right:5px;" class="fa fa-check-square" poi="' + json.result.items[i].id.split("_")[0] + '"></a>';
                    else poi_list+='<a href="#" style="padding-right:5px;display:none;" class="fa fa-check-square" poi="' + json.result.items[i].id.split("_")[0] + '"></a>';
                    poi_list = poi_list + (i+1+(page-1)*50) + '.'
                        +' <a href="#"'
                        +' class="create-poi"'
                        +' lon="' + json.result.items[i].point.lon + '"'
                        +' lat="' + json.result.items[i].point.lat + '"'
                        +' poi_id="' + json.result.items[i].id + '"'
                        +' lonc="' + lonc + '"'
                        +' latc="' + latc + '"'
                        +'>' + json.result.items[i].name + '</a><br/>';
                }
                if(total > 50 && Math.floor(total/50) >= page)
                    poi_list+='<a href="#" id="nextListPoi">Следующие</a><hr/>';
                else
                    poi_list+='<hr/>';
                if (wme2GIS_createall)
                {
					poi_list+='<a href="#" id="create_all_poi">Создать всё</a><hr/>';
                }

                $("#poi_2gis").html(poi_list);

                if (wme2GIS_createall)
                {
                	document.getElementById('create_all_poi').onclick = function(){
	                	var cpa=$("#poi_2gis").find(".create-poi");
	                	for(var i=0; i <= cpa.length; ++i)
	                	{
			                var poiCoord=new OpenLayers.LonLat(cpa[i].getAttribute('lon'),cpa[i].getAttribute('lat'));
            			    poiCoord.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
                			createPOI({
                    			x: poiCoord.lon,
                    			y: poiCoord.lat,
                    			poi_id: cpa[i].getAttribute('poi_id'),
                    			lat: cpa[i].getAttribute('latc'),
                    			lon: cpa[i].getAttribute('lonc')
                			});
	                	}
					};
                }
                if(total > 50 && Math.floor(total/50) >= page) {
                    document.getElementById('nextListPoi').onclick = getListPOI;
                    document.getElementById('nextListPoi').setAttribute('building_id', building_id);
                    document.getElementById('nextListPoi').setAttribute('lat', latc);
                    document.getElementById('nextListPoi').setAttribute('lon', lonc);
                    document.getElementById('nextListPoi').setAttribute('page', parseInt(page)+1);
                }
                $('.fa-check-square').click(function(){
                    localStorage.setItem('wme2GIS_id_' + this.getAttribute('poi'), 0);
                    //console.log('wme2GIS_id_' + this.getAttribute('poi'));
                    this.remove();
                });
            }else{
                $("#poi_2gis").html(json.meta.error.message);
            }

            $('.create-poi').click(function(){
                //if (wme2GIS_debug) console.log(this.getAttribute('name') + '/' + this.getAttribute('lon') + '/' + this.getAttribute('lat'));
                var poiCoord=new OpenLayers.LonLat(this.getAttribute('lon'),this.getAttribute('lat'));
                poiCoord.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
                if (wme2GIS_debug) console.log('[' + poiCoord.lon + '/' + poiCoord.lat + '], [' + this.getAttribute('latc') + '/' + this.getAttribute('lonc') + ']');
                createPOI({
                    x: poiCoord.lon,
                    y: poiCoord.lat,
                    poi_id: this.getAttribute('poi_id'),
                    lat: this.getAttribute('latc'),
                    lon: this.getAttribute('lonc')
                });
            });
        }
    });
}


function createPOI (poiobject) {
    if (wme2GIS_debug) console.log("createPOI("+JSON.stringify(poiobject)+")");
    /*
        poiobject:
            x, y - координаты (2гис)
            lat,lon - координаты клика мыши (WME)
            poi_id - это уникальный идентификатор создаваемого ПОИ (2гис)
    */
    var url = 'https://catalog.api.2gis.ru/2.0/catalog/branch/get';
    var data = {
        "id": poiobject.poi_id,
        "format": "json",
        "fields": "items.adm_div,items.region_id,items.reviews,items.point,items.links,items.name_ex,items.org,items.group,items.see_also,items.dates,items.external_content,items.flags,items.ads.options,items.email_for_sending.allowed,hash,search_attributes",
        "key": "rubnkm7490"
    };

    $.ajax({
        dataType: "json",
        cache: false,
        async: false,
        url: url,
        data: data,
        error: function() {
        },
        success: function(json) {
        	if (wme2GIS_debug) console.log(json);
        	var parent_poi=W.selectionManager._selectedFeatures[0].model;

            var json_poi = json.result.items[0];
            var poi = new wazefeatureVectorLandmark();
            var geometry = new OpenLayers.Geometry.Point();
            var rnd_meter=wme2GIS_radius;

            switch(wme2GIS_NavigationPoint)
            {
                case 0: // около точки входа (rnd_meter - в пределах скольки метров)
                    //geometry.x=parent_poi.getNavigationPoint().point.x+((Math.random()*10) & 1 ?+1:-1)*(Math.random()*rnd_meter);
                    //geometry.y=parent_poi.getNavigationPoint().point.y+((Math.random()*10) & 1 ?+1:-1)*(Math.random()*rnd_meter);
                    //break;

                    //отказываемся от "точки врода" из-за внедреннием в редактор мультипоитов, по умолчанию делаем точку 2gis

                    // около точки входа 2GIS
                    var entrance_2gis = [];
                    if (json_poi.links !== null)
                        entrance_2gis = json_poi.links.entrances[0].geometry.points[0].replace(/.*\(([0-9\.]+) ([0-9\.]+)\)/,"$1 $2").split(" ");
                    else
                    {
                        entrance_2gis.push(json_poi.point.lon);
                        entrance_2gis.push(json_poi.point.lat);
                    }
                    var entrancePos=new OpenLayers.LonLat(entrance_2gis[0], entrance_2gis[1]);
                    // здесь требуется преобразование координат
                    entrancePos.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
                    geometry.x=entrancePos.lon+((Math.random()*10) & 1 ?+1:-1)*(Math.random()*rnd_meter);
                    geometry.y=entrancePos.lat+((Math.random()*10) & 1 ?+1:-1)*(Math.random()*rnd_meter);
                    break;
                case 1: // там, где кликнули мышкой
                    var poiPos=new OpenLayers.LonLat(poiobject.lon,poiobject.lat);
                    // здесь требуется преобразование координат
                    poiPos.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
                    geometry.x = poiPos.lon;
                    geometry.y = poiPos.lat;
                    break;

                case 2: // рандомно, в пределах родиетльского ПОИ
                    while(1) // BUGBUG!!!
                    {
                        geometry.x = poiobject.x+((Math.random()*10) & 1 ?+1:-1)*(Math.random()*100);
                        geometry.y = poiobject.y+((Math.random()*10) & 1 ?+1:-1)*(Math.random()*100);
                        if (PtInPoly(geometry.x,geometry.y,parent_poi.attributes.geometry.components[0].components))
                            break;
                    }
                    break;
            }

            if (wme2GIS_debug) console.log("geometry="+JSON.stringify(geometry));
            poi.geometry = geometry;
            poi.attributes.categories=parent_poi.attributes.categories;
            poi.attributes.categories.length=0;

            // --------------------------
            if(json_poi.rubrics !== undefined && typeof wme2Gis_categories2[json_poi.rubrics[0].alias] !== "undefined") //ищем категорию в нашем массиве
            {
            	for(var ic=0; ic < wme2Gis_categories2[json_poi.rubrics[0].alias].length; ++ic)
                	poi.attributes.categories.push(wme2Gis_categories2[json_poi.rubrics[0].alias][ic]);
                if (wme2GIS_debug) console.log('Subrubric found');
            }
            else if(json_poi.rubrics !== undefined && typeof wme2Gis_categories2[rubricAlias=getRubricAlias(json_poi.rubrics[0].parent_id)] !== "undefined") //ищем категорию родителя в нашем массиве
            {
            	for(var ic=0; ic < wme2Gis_categories2[rubricAlias].length; ++ic)
	                poi.attributes.categories.push(wme2Gis_categories2[rubricAlias][ic]);
                if (wme2GIS_debug) console.log('Rubric found, ');
            }
            else {
                poi.attributes.categories.push(wme2GIS_DefCategory);
            }
            // --------------------------

            if (wme2GIS_debug) console.log(json_poi.rubrics);
            if (wme2GIS_debug) console.log("json_poi.rubrics[0].alias="+json_poi.rubrics[0].alias);
            var poi_name = json_poi.name;
            for (var key in wme2Gis_replacement) {
                poi_name = poi_name.replace(new RegExp(key,'ig'), wme2Gis_replacement[key]);
                if (wme2GIS_debug) console.log("replace '"+key+"'=>'"+wme2Gis_replacement[key]+"'");
            }
            poi.attributes.name = poi_name;

            var address=parent_poi.getAddress().attributes;

		    if (wme2GIS_AddressClip)
    		{
   				var txt = __addtxt(__addtxt(__addtxt(poi_name.split(",")[0],address.houseNumber),address.street.name),address.city.attributes.name.replace(/([^\( ]+).*/,"$1")).replace(/[№«»]/g,"");
				clipboard.copy(txt);
				//console.log(txt);
			}
            /* var description=((typeof json_poi.name_ex.extension !== "undefined")?json_poi.name_ex.extension:"");
            if(description.length > 0)
                description+=', '
            */
            var description=wme2GIS_AddAddress?json_poi.address_name:"";
            description+=((typeof json_poi.address_comment !== "undefined")?(description.length > 0?", ":"") + json_poi.address_comment:"");
            poi.attributes.description=description;
            poi.attributes.lockRank=wme2GIS_UserRank;
            poi.attributes.houseNumber=address.houseNumber;

            var poi_al=new wazeActionAddLandmark(poi);
            W.model.actionManager.add(poi_al);

            if (wme2GIS_debug) window.poi0=poi;    // для анализа :-)
            if (wme2GIS_debug) window.poi1=poi_al; // для анализа :-)

            // корректировка стрита - по другому пока никак :-(
            var newAddressAtts={
            	streetName: address.street.name,
            	emptyStreet: false,
            	cityName: address.city.attributes.name,
            	emptyCity: false,
            	stateID: address.state.id,
            	countryID: address.country.id
            };

            W.model.actionManager.add(new wazeActionUpdateFeatureAddress(poi, newAddressAtts, {streetIDField: 'streetID'} ));

            //var attr={lockRank:wme2GIS_UserRank};
            //W.model.actionManager.add(new wazeActionUpdateObject(poi, attr));

            // обеспечим автовыделение вновь созданного пои
            if (!wme2GIS_dontselect) W.selectionManager.setSelectedModels([poi_al.landmark]);
            if (wme2GIS_debug) console.log(json_poi.rubrics);
            // сохраним информацию о пои в локальное хранилище
            localStorage.setItem("wme2GIS_id_" + json_poi.id, 1);
            // ставим галочку
            $('[poi='+json_poi.id+']').css("display","inline-block");
        }
    });
}

function getRubricAlias(rubric_id) {
    var rubricAlias;
    var url = 'https://catalog.api.2gis.ru/2.0/catalog/rubric/get';
    var data = {
        "id": rubric_id,
        "key": "rubnkm7490"
    };

    $.ajax({
        dataType: "json",
        cache: false,
        async: false,
        url: url,
        data: data,
        error: function() {
        },
        success: function(json) {
            if(json.result.items[0].parent_id === undefined) {
                //console.log(json.result.items[0].alias);
                rubricAlias = json.result.items[0].alias;
            }else{
                //console.log('trying getRubricAlias');
                getRubricAlias(json.result.items[0].parent_id);
            }
        }
    });

    return rubricAlias;
}


//******************************************************
function Wme2Gis_InitConfig()
{
    if (wme2GIS_debug) console.log("Wme2Gis_InitConfig(): "+document.getElementById(CreateID()));

    if(!document.getElementById(CreateID()))
    {
        var srsCtrl = document.createElement('section');
        srsCtrl.id = CreateID();

        var userTabs = document.getElementById('user-info');
        if (typeof userTabs !== "undefined")
        {
            var navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0];
            if (typeof navTabs !== "undefined")
            {
                var tabContent = document.getElementsByClassName('tab-content', userTabs)[0];
                if (typeof tabContent !== "undefined")
                {
                    newtab = document.createElement('li');
                    // fa ==> http://fontawesome.io/cheatsheet/
                    newtab.innerHTML = '<a href="#' + CreateID() + '" id="pwme2gis" data-toggle="tab"><span class="fa fa-map-marker"></span>&nbsp;PH</a>';

                    navTabs.appendChild(newtab);

                    //srsCtrl.id = "sidepanel-???";
                    srsCtrl.className = "tab-pane";

                    var padding="padding:5px 9px";

                    // ------------------------------------------------------------
                    var srsCtrlinnerHTML = ''
                        +'<div class="side-panel-section">'
                        +'<h4>WME POI Helper <sup>' + WME_2gis_version + '</sup>&nbsp;<sub><a href="https://greasyfork.org/ru/scripts/19633-wme-poi-helper" title="Link" target="_blank"><span class="fa fa-external-link"></span></a></sub></h4>'
                        +'<form class="attributes-form side-panel-section" action="javascript:return false;">'
/*
                        +'<div class="form-group">'
                        +'<label class="control-label">Категории:</label>'
                        +'<div class="controls">'
                        +'<textarea id="wme2gis_cfg_categories" style="width:100%;height:200px;font-size:8pt" wrap="off"></textarea>'
                        +'<small>Сопоставление: 2gis=WME, каждая пара в отдельной строке.</small>'
                        +'</div>'
                        +'</div>'
*/
                        +'<div class="form-group">'
                        +'<div class="controls">'
                        +'<label class="control-label" title="В какую позицию ставить новый POI">Расстановка</label>'
                        +'<div class="controls">'
                        +'<select class="form-control" data-type="numeric" id="wme2gis_cfg_NavigationPoint"><option value="0">Точка 2gis</option><option value="1">В точке клика</option><option value="2">В пределах родителя</option></select>'
                        +'</div>'
                        +'<label class="control-label" title="Формат номера дома">Формат номера дома</label>'
                        +'<div class="controls">'
                        +'<select class="form-control" data-type="numeric" id="wme2gis_cfg_HNFormat"><option value="0">2GIS (2а, 2ак1, 2Б)</option><option value="1">Yandex (2А, 2Ак1, 2Б)</option><option value="2">BY (2А, 2А/1, 2Б)</option><option value="3">UA (2А, 2Аі1, 2Б)</option></select>'
                        +'</div>'
                        +'<div class="controls">'
                        +'<label class="control-label" title="В пределах скольки метров ставить новый POI относительно настройки Расстановка">Радиус (м):</label>'
                        +'<input name="wme2gis_cfg_radius" class="form-control" autocomplete="off" value="" id="wme2gis_cfg_radius" type="text" size="13">'
                        +'</div>'
                        +'<div class="controls">'
                        +'<label class="control-label" title="Приемлемый результат совпадения при сопоставлении улиц из WME и источника внешних данных. Оценка 0 указывает на идеальное совпадение, в то время как оценка 1 указывает на полное несоответствие.">Приемлемый результат совпадения улиц:</label>'
                        +'<input name="wme2gis_cfg_score" class="form-control" autocomplete="off" value="" id="wme2gis_cfg_score" type="text" size="13">'
                        +'</div>'
                        +'</div>'
                        +'</div>'

                        +'<div class="form-group">'
                        +'<div class="controls">'
                        +'<label class="control-label">Категория по умолчанию</label>'
                        +'<div class="controls">'
                        +'<select class="form-control" id="wme2gis_cfg_defcategory">'
                        +'';

                        for(var i in I18n.translations[I18n.locale].venues.categories)
                        {
                            srsCtrlinnerHTML += '<option value="'+i+'">'+I18n.translations[I18n.locale].venues.categories[i]+'</option>';
                        }

                    srsCtrlinnerHTML += ''
                        +'</select>'
                        +'</div>'
                        +'</div>'
                        +'</div>'

                        +'<div class="form-group">'
                        +'<div class="controls">'
                        +'<label class="control-label" title="Уровень блокировки POI">Блокировка POI</label>'
                        +'<div class="controls">'
                        +'<select class="form-control" data-type="numeric" id="wme2gis_cfg_UserRank"><option value="0">1</option><option value="1">2</option><option value="2">3</option><option value="3">4</option><option value="4">5</option></select>'
                        +'</div>'
                        +'</div>'
                        +'</div>'

                        +'<div class="form-group">'
                        +'<div class="controls">'
                        +'<label class="control-label" title="Уровень блокировки Адресов">Блокировка Адресов</label>'
                        +'<div class="controls">'
                        +'<select class="form-control" data-type="numeric" id="wme2gis_cfg_UserRankAddr"><option value="0">1</option><option value="1">2</option><option value="2">3</option><option value="3">4</option><option value="4">5</option></select>'
                        +'</div>'
                        +'</div>'
                        +'</div>'

                        +'<div class="form-group">'
                        +'<div class="controls">'
                        +'<label class="control-label" title="Какие карты показывать">Показать карты</label>'
                        +'<div class="controls">'
                        +'<input name="wme2gis_cfg_2gismap" value="" id="wme2gis_cfg_2gismap" type="checkbox"><label for="wme2gis_cfg_2gismap" title="Показывать карту 2gis">&nbsp;Карта 2GIS</label><br/>'
                        +'</div>'
                        +'<div class="controls">'
                        +'<input name="wme2gis_cfg_yamap" value="" id="wme2gis_cfg_yamap" type="checkbox"><label for="wme2gis_cfg_yamap" title="Показывать карту Yandex">&nbsp;Карта Yandex</label><br/>'
                        +'</div>'
                        +'<div class="controls">'
                        +'<input name="wme2gis_cfg_osmmap" value="" id="wme2gis_cfg_osmmap" type="checkbox"><label for="wme2gis_cfg_osmmap" title="Показывать карту OSM">&nbsp;Карта OSM</label><br/>'
                        +'</div>'
                        +'</div>'
                        +'</div>'

                        +'<div class="controls">'
                        +'<label class="control-label" title="Apikey yandex. Получить можно тут https://developer.tech.yandex.ru/">Apikey yandex:</label>'
                        +'<input name="wme2gis_cfg_apikey_yandex" class="form-control" autocomplete="off" value="" id="wme2gis_cfg_apikey_yandex" type="text" size="13">'
                        +'</div>'

                        +'<div class="controls">'
                        +'<label class="control-label">Дополнительные настройки</label>'
                        +'<div class="controls">'
                        +'<input name="wme2gis_cfg_addaddress" value="" id="wme2gis_cfg_addaddress" type="checkbox"><label for="wme2gis_cfg_addaddress" title="Для вновь созданной точки в поле Описание добавлять адрес.">&nbsp;Добавить адрес в описание</label><br/>'
                        +'</div>'
                        +'<div class="controls">'
                        +'<input name="wme2gis_cfg_addressclip" value="" id="wme2gis_cfg_addressclip" type="checkbox"><label for="wme2gis_cfg_addressclip" title="При модификации также копировать арес в Буфер Обмена">&nbsp;Копировать адрес в Буфер Обмена</label><br/>'
                        +'</div>'
                        +'<div class="controls">'
                        +'<input name="wme2gis_cfg_createall" value="" id="wme2gis_cfg_createall" type="checkbox"><label for="wme2gis_cfg_createall" title="Создать все организации (ОПАСНО!)">&nbsp;Создать все организации</label><br/>'
                        +'</div>'
                        +'<div class="controls">'
                        +'<input name="wme2gis_cfg_dontselect" value="" id="wme2gis_cfg_dontselect" type="checkbox"><label for="wme2gis_cfg_dontselect" title="Не переключаться на новое POI.">&nbsp;Не выделять новое POI</label><br/>'
                        +'</div>'
                        +'<div class="controls">'
                        +'<input name="wme2gis_cfg_changecat" value="" id="wme2gis_cfg_changecat" type="checkbox"><label for="wme2gis_cfg_changecat" title="Изменять категорию POI на категорию по умолчанию при модификации свойств POI">&nbsp;Изменять категорию</label><br/>'
                        +'</div>'
                        +'<div class="controls">'
                        +'<input name="wme2gis_cfg_debug" value="" id="wme2gis_cfg_debug" type="checkbox"><label for="wme2gis_cfg_debug" title="Включить логирование">&nbsp;Debug script</label><br/>'
                        +'</div>'
                        +'</div>'

                        +'</form>'
                        +'</div>'
                        '';
                    // ------------------------------------------------------------
                    srsCtrl.innerHTML=srsCtrlinnerHTML;
                    tabContent.appendChild(srsCtrl);
                }
                else
                    srsCtrl.id='';
            }
            else
                srsCtrl.id='';
        }
        else
            srsCtrl.id='';

        if(srsCtrl.id != '')
        {
            document.getElementById("wme2gis_cfg_debug").checked = wme2GIS_debug;
            document.getElementById("wme2gis_cfg_debug").onclick = function(){wme2GIS_debug=this.checked;localStorage.setItem("wme2GIS_debug",wme2GIS_debug?"1":"0");};

            document.getElementById("wme2gis_cfg_osmmap").checked = wme2GIS_osmmap;
            document.getElementById("wme2gis_cfg_osmmap").onclick = function(){wme2GIS_osmmap=this.checked;localStorage.setItem("wme2GIS_osmmap",wme2GIS_osmmap?"1":"0");};

            document.getElementById("wme2gis_cfg_yamap").checked = wme2GIS_yamap;
            document.getElementById("wme2gis_cfg_yamap").onclick = function(){wme2GIS_yamap=this.checked;localStorage.setItem("wme2GIS_yamap",wme2GIS_yamap?"1":"0");if(wme2GIS_yamap) wme_2gis_init_script('ymap');};

            document.getElementById("wme2gis_cfg_2gismap").checked = wme2GIS_2gismap;
            document.getElementById("wme2gis_cfg_2gismap").onclick = function(){wme2GIS_2gismap=this.checked;localStorage.setItem("wme2GIS_2gismap",wme2GIS_2gismap?"1":"0");if(wme2GIS_2gismap) wme_2gis_init_script('2gis');};

            document.getElementById("wme2gis_cfg_addaddress").checked = wme2GIS_AddAddress;
            document.getElementById("wme2gis_cfg_addaddress").onclick = function(){wme2GIS_AddAddress=this.checked;localStorage.setItem("wme2GIS_AddAddress",wme2GIS_AddAddress?"1":"0");};

            document.getElementById("wme2gis_cfg_addressclip").checked = wme2GIS_AddressClip;
            document.getElementById("wme2gis_cfg_addressclip").onclick = function(){wme2GIS_AddressClip=this.checked;localStorage.setItem("wme2GIS_AddressClip",wme2GIS_AddressClip?"1":"0");};

            document.getElementById("wme2gis_cfg_dontselect").checked = wme2GIS_dontselect;
            document.getElementById("wme2gis_cfg_dontselect").onclick = function(){wme2GIS_dontselect=this.checked;localStorage.setItem("wme2GIS_dontselect",wme2GIS_dontselect?"1":"0");};

            document.getElementById("wme2gis_cfg_changecat").checked = wme2GIS_changecat;
            document.getElementById("wme2gis_cfg_changecat").onclick = function(){wme2GIS_changecat=this.checked;localStorage.setItem("wme2GIS_changecat",wme2GIS_changecat?"1":"0");};

            document.getElementById("wme2gis_cfg_createall").checked = wme2GIS_createall;
            document.getElementById("wme2gis_cfg_createall").onclick = function(){wme2GIS_createall=this.checked;localStorage.setItem("wme2GIS_createall",wme2GIS_createall?"1":"0");};

            document.getElementById("wme2gis_cfg_UserRank").selectedIndex = wme2GIS_UserRank;
            document.getElementById("wme2gis_cfg_UserRank").onchange = function(){wme2GIS_UserRank=this.value;localStorage.setItem("wme2GIS_UserRank",wme2GIS_UserRank);};

            document.getElementById("wme2gis_cfg_UserRankAddr").selectedIndex = wme2GIS_UserRankAddr;
            document.getElementById("wme2gis_cfg_UserRankAddr").onchange = function(){wme2GIS_UserRankAddr=this.value;localStorage.setItem("wme2GIS_UserRankAddr",wme2GIS_UserRankAddr);};

            document.getElementById("wme2gis_cfg_apikey_yandex").value = wme2GIS_apikey_yandex;
            document.getElementById("wme2gis_cfg_apikey_yandex").onchange = function(){wme2GIS_apikey_yandex=this.value;localStorage.setItem("wme2GIS_apikey_yandex",wme2GIS_apikey_yandex);};


            document.getElementById("wme2gis_cfg_radius").value = wme2GIS_radius;
            document.getElementById("wme2gis_cfg_radius").onchange = function(){wme2GIS_radius=parseInt(this.value);localStorage.setItem("wme2GIS_radius",wme2GIS_radius);};

            document.getElementById("wme2gis_cfg_score").value = wme2GIS_score;
            document.getElementById("wme2gis_cfg_score").onchange = function(){wme2GIS_score=parseFloat(this.value);localStorage.setItem("wme2GIS_score",wme2GIS_score);};

            // категории для выбора умолчания сортируем по названию
            function sortSelect(selElem, checkElem)
            {
                var tmpAry = new Array();
                for (var i=0;i<selElem.options.length;i++) {
                    tmpAry[i] = new Array();
                    tmpAry[i][0] = selElem.options[i].text;
                    tmpAry[i][1] = selElem.options[i].value;
                }
                tmpAry.sort();
                while (selElem.options.length > 0) {
                    selElem.options[0] = null;
                }
                for (var i=0;i<tmpAry.length;i++) {
                    var op = new Option(tmpAry[i][0], tmpAry[i][1]);
                    selElem.options[i] = op;
                    if(tmpAry[i][1] === checkElem)
                    {
                        selElem.options[i].selected=true;
                    }
                }
            }
            sortSelect(document.getElementById("wme2gis_cfg_defcategory"),wme2GIS_DefCategory);
            document.getElementById("wme2gis_cfg_defcategory").onchange = function(){wme2GIS_DefCategory=this.value;localStorage.setItem("wme2GIS_DefCategory",wme2GIS_DefCategory);};


            document.getElementById("wme2gis_cfg_NavigationPoint").selectedIndex = wme2GIS_NavigationPoint;
            document.getElementById("wme2gis_cfg_NavigationPoint").onchange = function(){wme2GIS_NavigationPoint=parseInt(this.value);console.log('wme2gis_cfg_NavigationPoint='+this.value);localStorage.setItem("wme2GIS_NavigationPoint",wme2GIS_NavigationPoint);};

            document.getElementById("wme2gis_cfg_HNFormat").selectedIndex = wme2GIS_HNFormat;
            document.getElementById("wme2gis_cfg_HNFormat").onchange = function(){wme2GIS_HNFormat=parseInt(this.value);console.log('wme2gis_cfg_HNFormat='+this.value);localStorage.setItem("wme2GIS_HNFormat",wme2GIS_HNFormat);};
            // формируем сопоставления 2гис=ВМЕ
            /*
            cat='';
            for(var i in wme2Gis_categories)
            {
                if(cat.length > 0)
                    cat+='\n';
                cat+= i+"="+wme2Gis_categories[i];
            }
            document.getElementById("wme2gis_cfg_categories").value=cat;
            document.getElementById("wme2gis_cfg_categories").onchange = function(){
                var a1=this.value.split('\n');
                var cfg={};
                for(var i=0; i < a1.length; ++i)
                {
                    var a2=a1[i].split('=');
                    cfg[a2[0]]=a2[1];
                }
                localStorage.setItem('wme2GIS_Categories', JSON.stringify(cfg));
                for(var i in wme2Gis_categories)    { delete wme2Gis_categories[i]; }
                wme2Gis_categories = cloneConfig(cfg);
            };
            */
        }

    }
    else
        if (wme2GIS_debug) console.log("Wme2Gis_InitConfig(): found '"+CreateID()+"'");
}

//******************************************************
function WMEGetInfo2Gis_HandCreatePOI()
{
    if ((typeof arguments[0]) === "object")
    {
    	if ((typeof (arguments[0].poiType)) === "string")
        {
			if (arguments[0].poiType === "parking")
				$('.toolbar-group-venues').find('.dropdown-menu').find('.WazeControlDrawFeature').eq(arguments[0].poiCat).click();
			else
				$('.toolbar-group-venues').find('.dropdown-menu').find('.drawing-controls').eq(arguments[0].poiCat).find(arguments[0].poiType).click();
		}
    }
}

function wme_2gis_initBindPoi() {
    if (wme2GIS_debug) console.log("wme_2gis_initBindPoi()");
    var Config =[
        {handler: 'WMEGetInfo2Gis_Point',  title: "Создать точку (другое)",    func: WMEGetInfo2Gis_HandCreatePOI, key:-1, arg:{poiType:'.point',poiCat:6}},
        {handler: 'WMEGetInfo2Gis_Area',   title: "Создать лэндмарк (другое)", func: WMEGetInfo2Gis_HandCreatePOI, key:-1, arg:{poiType:'.polygon',poiCat:6}},
        {handler: 'WMEGetInfo2Gis_AreaNat',title: "Создать лэндмарк (природа)",func: WMEGetInfo2Gis_HandCreatePOI, key:-1, arg:{poiType:'.polygon',poiCat:9}},
        {handler: 'WMEGetInfo2Gis_Parking',title: "Создать парковку",          func: WMEGetInfo2Gis_HandCreatePOI, key:-1, arg:{poiType:'parking',poiCat:10}},
    ];
    for(var i=0; i < Config.length; ++i)
    {
        WMEKSRegisterKeyboardShortcut('WME-POI-Helper', 'WME-POI-Helper', Config[i].handler, Config[i].title, Config[i].func, Config[i].key, Config[i].arg);
    }

    WMEKSLoadKeyboardShortcuts('WME-POI-Helper');

    window.addEventListener("beforeunload", function() {
        WMEKSSaveKeyboardShortcuts('WME-POI-Helper');
    }, false);

}


// подгрузка скриптов
function wme_2gis_init_script(t)
{
     if (wme2GIS_debug) console.log("wme_2gis_init_script("+t+")");
    switch(t)
    {
        case '2gis':
        {
            if (!document.getElementById('wme2GIS_2gismap'))
            {
                // 1. создаём контейнер с ID
                var script2gisDiv= document.createElement('div');
                script2gisDiv.id = "wme2GIS_2gismap";
                script2gisDiv.setAttribute('style','display:none;');
                document.getElementsByTagName('body')[0].appendChild(script2gisDiv);

                // 2. ...в него сюём скрипт
                var script2gis   = document.createElement('script');
                script2gis.type  = "text/javascript";
                script2gis.src   = "https://maps.api.2gis.ru/2.0/loader.js?pkg=basic";
                document.getElementById('wme2GIS_2gismap').appendChild(script2gis);
            }
            break;
        }
        case 'ymap':
        {
            if (!document.getElementById('wme2GIS_yamap'))
            {
                var scriptyamapDiv= document.createElement('div');
                scriptyamapDiv.id = "wme2GIS_yamap";
                scriptyamapDiv.setAttribute('style','display:none;');
                document.getElementsByTagName('body')[0].appendChild(scriptyamapDiv);

                var scriptyamap   = document.createElement('script');
                scriptyamap.type  = "text/javascript";
                scriptyamap.src   = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
                document.getElementById('wme2GIS_yamap').appendChild(scriptyamap);
            }
            break;
        }

        //....
    }
}

//******************************************************
function wme_2gis_init() {
    if (wme2GIS_debug) console.log("wme_2gis_init()");
    if (typeof require === "undefined")
    {
        setTimeout(wme_2gis_init,500);
        return;
    }

	wazeActionAddLandmark = require("Waze/Action/AddLandmark");
	wazefeatureVectorLandmark = require("Waze/Feature/Vector/Landmark");
	wazeActionUpdateFeatureAddress = require("Waze/Action/UpdateFeatureAddress");
	wazeActionUpdateObject = require("Waze/Action/UpdateObject");

    wme2GIS_debug = __GetLocalStorageItem("wme2GIS_debug",'bool',false);

    wme2GIS_osmmap = __GetLocalStorageItem("wme2GIS_osmmap",'bool',false);

    wme2GIS_yamap = __GetLocalStorageItem("wme2GIS_yamap",'bool',false);

    wme2GIS_2gismap = __GetLocalStorageItem("wme2GIS_2gismap",'bool',false);

    wme2GIS_createall = __GetLocalStorageItem("wme2GIS_createall",'bool',false);

    if(wme2GIS_2gismap) // потом подгрузим, если что, из настроек
        wme_2gis_init_script('2gis');

    if(wme2GIS_yamap) // потом подгрузим, если что, из настроек
        wme_2gis_init_script('ymap');

    var scriptMy   = document.createElement('script');
    scriptMy.type  = "text/javascript";
    scriptMy.src   = "https://bobalus.ru/additional-vars.js";
    document.getElementsByTagName('head')[0].appendChild(scriptMy);

	var script22   = document.createElement('div');
	script22.id="map_2gis_script";
	var s22 = document.getElementsByTagName('head')[0].appendChild(script22);

		var script2   = document.createElement('script');
		script2.type  = "text/javascript";
		var s = s22.appendChild(script2);
		s.innerHTML= "" +
			"var map2Gis, map2GisMove=false;" +
			"var mapYM, mapYMMove=false;"
			"var mapOSM, mapOSMMove=false;"
		;



    setTimeout(wme_2gis, 500);
}

function __GetLocalStorageItem(Name,Type,Def,Arr)
{
     if (wme2GIS_debug) console.log("__GetLocalStorageItem(): Name="+Name+",Type="+Type+",Def="+Def+",Arr="+Arr);

    var tmp0=localStorage.getItem(Name);
    if (tmp0)
    {
        switch(Type)
        {
            case 'bool':
                tmp0=(tmp0 === "true" || tmp0 === "1")?true:false;
                break;
            case 'int':
                tmp0=!isNaN(parseInt(tmp0))?parseInt(tmp0):0;
                break;
            case 'float':
                tmp0=!isNaN(parseFloat(tmp0))?parseFloat(tmp0):0.03;
                break;
            case 'arr':
                if (tmp0.length > 0)
                    if(!Arr[tmp0])
                        tmp0=Def;
                break;
        }
    }
    else
        tmp0=Def;
    return tmp0;
}


wme_2gis_init();

/*
var DLscript = document.createElement("script");
DLscript.textContent = wme_2gis_init.toString() + ' \n' + 'wme_2gis_init();';
DLscript.setAttribute("type", "application/javascript");
document.body.appendChild(DLscript);
*/


/*!
 * Fuse.js v3.0.5 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2012-2017 Kirollos Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Fuse",[],t):"object"==typeof exports?exports.Fuse=t():e.Fuse=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=8)}([function(e,t,n){"use strict";e.exports=function(e){return"[object Array]"===Object.prototype.toString.call(e)}},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(5),s=n(7),a=n(4),c=function(){function e(t,n){var o=n.location,i=void 0===o?0:o,s=n.distance,c=void 0===s?100:s,h=n.threshold,l=void 0===h?.6:h,u=n.maxPatternLength,f=void 0===u?32:u,v=n.isCaseSensitive,d=void 0!==v&&v,p=n.tokenSeparator,g=void 0===p?/ +/g:p,m=n.findAllMatches,y=void 0!==m&&m,k=n.minMatchCharLength,x=void 0===k?1:k;r(this,e),this.options={location:i,distance:c,threshold:l,maxPatternLength:f,isCaseSensitive:d,tokenSeparator:g,findAllMatches:y,minMatchCharLength:x},this.pattern=this.options.isCaseSensitive?t:t.toLowerCase(),this.pattern.length<=f&&(this.patternAlphabet=a(this.pattern))}return o(e,[{key:"search",value:function(e){if(this.options.isCaseSensitive||(e=e.toLowerCase()),this.pattern===e)return{isMatch:!0,score:0,matchedIndices:[[0,e.length-1]]};var t=this.options,n=t.maxPatternLength,r=t.tokenSeparator;if(this.pattern.length>n)return i(e,this.pattern,r);var o=this.options,a=o.location,c=o.distance,h=o.threshold,l=o.findAllMatches,u=o.minMatchCharLength;return s(e,this.pattern,this.patternAlphabet,{location:a,distance:c,threshold:h,findAllMatches:l,minMatchCharLength:u})}}]),e}();e.exports=c},function(e,t,n){"use strict";var r=n(0),o=function e(t,n,o){if(n){var i=n.indexOf("."),s=n,a=null;-1!==i&&(s=n.slice(0,i),a=n.slice(i+1));var c=t[s];if(null!==c&&void 0!==c)if(a||"string"!=typeof c&&"number"!=typeof c)if(r(c))for(var h=0,l=c.length;h<l;h+=1)e(c[h],a,o);else a&&e(c,a,o);else o.push(c)}else o.push(t);return o};e.exports=function(e,t){return o(e,t,[])}},function(e,t,n){"use strict";e.exports=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=[],r=-1,o=-1,i=0,s=e.length;i<s;i+=1){var a=e[i];a&&-1===r?r=i:a||-1===r||(o=i-1,o-r+1>=t&&n.push([r,o]),r=-1)}return e[i-1]&&i-r>=t&&n.push([r,i-1]),n}},function(e,t,n){"use strict";e.exports=function(e){for(var t={},n=e.length,r=0;r<n;r+=1)t[e.charAt(r)]=0;for(var o=0;o<n;o+=1)t[e.charAt(o)]|=1<<n-o-1;return t}},function(e,t,n){"use strict";e.exports=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:/ +/g,r=new RegExp(t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&").replace(n,"|")),o=e.match(r),i=!!o,s=[];if(i)for(var a=0,c=o.length;a<c;a+=1){var h=o[a];s.push([e.indexOf(h),h.length-1])}return{score:i?.5:1,isMatch:i,matchedIndices:s}}},function(e,t,n){"use strict";e.exports=function(e,t){var n=t.errors,r=void 0===n?0:n,o=t.currentLocation,i=void 0===o?0:o,s=t.expectedLocation,a=void 0===s?0:s,c=t.distance,h=void 0===c?100:c,l=r/e.length,u=Math.abs(a-i);return h?l+u/h:u?1:l}},function(e,t,n){"use strict";var r=n(6),o=n(3);e.exports=function(e,t,n,i){for(var s=i.location,a=void 0===s?0:s,c=i.distance,h=void 0===c?100:c,l=i.threshold,u=void 0===l?.6:l,f=i.findAllMatches,v=void 0!==f&&f,d=i.minMatchCharLength,p=void 0===d?1:d,g=a,m=e.length,y=u,k=e.indexOf(t,g),x=t.length,S=[],M=0;M<m;M+=1)S[M]=0;if(-1!==k){var b=r(t,{errors:0,currentLocation:k,expectedLocation:g,distance:h});if(y=Math.min(b,y),-1!==(k=e.lastIndexOf(t,g+x))){var _=r(t,{errors:0,currentLocation:k,expectedLocation:g,distance:h});y=Math.min(_,y)}}k=-1;for(var L=[],w=1,C=x+m,A=1<<x-1,F=0;F<x;F+=1){for(var O=0,P=C;O<P;){r(t,{errors:F,currentLocation:g+P,expectedLocation:g,distance:h})<=y?O=P:C=P,P=Math.floor((C-O)/2+O)}C=P;var j=Math.max(1,g-P+1),z=v?m:Math.min(g+P,m)+x,I=Array(z+2);I[z+1]=(1<<F)-1;for(var T=z;T>=j;T-=1){var E=T-1,K=n[e.charAt(E)];if(K&&(S[E]=1),I[T]=(I[T+1]<<1|1)&K,0!==F&&(I[T]|=(L[T+1]|L[T])<<1|1|L[T+1]),I[T]&A&&(w=r(t,{errors:F,currentLocation:E,expectedLocation:g,distance:h}))<=y){if(y=w,(k=E)<=g)break;j=Math.max(1,2*g-k)}}if(r(t,{errors:F+1,currentLocation:g,expectedLocation:g,distance:h})>y)break;L=I}return{isMatch:k>=0,score:0===w?.001:w,matchedIndices:o(S,p)}}},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(1),s=n(2),a=n(0),c=function(){function e(t,n){var o=n.location,i=void 0===o?0:o,a=n.distance,c=void 0===a?100:a,h=n.threshold,l=void 0===h?.6:h,u=n.maxPatternLength,f=void 0===u?32:u,v=n.caseSensitive,d=void 0!==v&&v,p=n.tokenSeparator,g=void 0===p?/ +/g:p,m=n.findAllMatches,y=void 0!==m&&m,k=n.minMatchCharLength,x=void 0===k?1:k,S=n.id,M=void 0===S?null:S,b=n.keys,_=void 0===b?[]:b,L=n.shouldSort,w=void 0===L||L,C=n.getFn,A=void 0===C?s:C,F=n.sortFn,O=void 0===F?function(e,t){return e.score-t.score}:F,P=n.tokenize,j=void 0!==P&&P,z=n.matchAllTokens,I=void 0!==z&&z,T=n.includeMatches,E=void 0!==T&&T,K=n.includeScore,$=void 0!==K&&K,R=n.verbose,q=void 0!==R&&R;r(this,e),this.options={location:i,distance:c,threshold:l,maxPatternLength:f,isCaseSensitive:d,tokenSeparator:g,findAllMatches:y,minMatchCharLength:x,id:M,keys:_,includeMatches:E,includeScore:$,shouldSort:w,getFn:A,sortFn:O,verbose:q,tokenize:j,matchAllTokens:I},this.setCollection(t)}return o(e,[{key:"setCollection",value:function(e){return this.list=e,e}},{key:"search",value:function(e){this._log('---------\nSearch pattern: "'+e+'"');var t=this._prepareSearchers(e),n=t.tokenSearchers,r=t.fullSearcher,o=this._search(n,r),i=o.weights,s=o.results;return this._computeScore(i,s),this.options.shouldSort&&this._sort(s),this._format(s)}},{key:"_prepareSearchers",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=[];if(this.options.tokenize)for(var n=e.split(this.options.tokenSeparator),r=0,o=n.length;r<o;r+=1)t.push(new i(n[r],this.options));return{tokenSearchers:t,fullSearcher:new i(e,this.options)}}},{key:"_search",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1],n=this.list,r={},o=[];if("string"==typeof n[0]){for(var i=0,s=n.length;i<s;i+=1)this._analyze({key:"",value:n[i],record:i,index:i},{resultMap:r,results:o,tokenSearchers:e,fullSearcher:t});return{weights:null,results:o}}for(var a={},c=0,h=n.length;c<h;c+=1)for(var l=n[c],u=0,f=this.options.keys.length;u<f;u+=1){var v=this.options.keys[u];if("string"!=typeof v){if(a[v.name]={weight:1-v.weight||1},v.weight<=0||v.weight>1)throw new Error("Key weight has to be > 0 and <= 1");v=v.name}else a[v]={weight:1};this._analyze({key:v,value:this.options.getFn(l,v),record:l,index:c},{resultMap:r,results:o,tokenSearchers:e,fullSearcher:t})}return{weights:a,results:o}}},{key:"_analyze",value:function(e,t){var n=e.key,r=e.value,o=e.record,i=e.index,s=t.tokenSearchers,c=void 0===s?[]:s,h=t.fullSearcher,l=void 0===h?[]:h,u=t.resultMap,f=void 0===u?{}:u,v=t.results,d=void 0===v?[]:v;if(void 0!==r&&null!==r){var p=!1,g=-1,m=0;if("string"==typeof r){this._log("\nKey: "+(""===n?"-":n));var y=l.search(r);if(this._log('Full text: "'+r+'", score: '+y.score),this.options.tokenize){for(var k=r.split(this.options.tokenSeparator),x=[],S=0;S<c.length;S+=1){var M=c[S];this._log('\nPattern: "'+M.pattern+'"');for(var b=!1,_=0;_<k.length;_+=1){var L=k[_],w=M.search(L),C={};w.isMatch?(C[L]=w.score,p=!0,b=!0,x.push(w.score)):(C[L]=1,this.options.matchAllTokens||x.push(1)),this._log('Token: "'+L+'", score: '+C[L])}b&&(m+=1)}g=x[0];for(var A=x.length,F=1;F<A;F+=1)g+=x[F];g/=A,this._log("Token score average:",g)}var O=y.score;g>-1&&(O=(O+g)/2),this._log("Score average:",O);var P=!this.options.tokenize||!this.options.matchAllTokens||m>=c.length;if(this._log("\nCheck Matches: "+P),(p||y.isMatch)&&P){var j=f[i];j?j.output.push({key:n,score:O,matchedIndices:y.matchedIndices}):(f[i]={item:o,output:[{key:n,score:O,matchedIndices:y.matchedIndices}]},d.push(f[i]))}}else if(a(r))for(var z=0,I=r.length;z<I;z+=1)this._analyze({key:n,value:r[z],record:o,index:i},{resultMap:f,results:d,tokenSearchers:c,fullSearcher:l})}}},{key:"_computeScore",value:function(e,t){this._log("\n\nComputing score:\n");for(var n=0,r=t.length;n<r;n+=1){for(var o=t[n].output,i=o.length,s=0,a=1,c=0;c<i;c+=1){var h=o[c].score,l=e?e[o[c].key].weight:1,u=h*l;1!==l?a=Math.min(a,u):(o[c].nScore=u,s+=u)}t[n].score=1===a?s/i:a,this._log(t[n])}}},{key:"_sort",value:function(e){this._log("\n\nSorting...."),e.sort(this.options.sortFn)}},{key:"_format",value:function(e){var t=[];this._log("\n\nOutput:\n\n",e);var n=[];this.options.includeMatches&&n.push(function(e,t){var n=e.output;t.matches=[];for(var r=0,o=n.length;r<o;r+=1){var i=n[r],s={indices:i.matchedIndices};i.key&&(s.key=i.key),t.matches.push(s)}}),this.options.includeScore&&n.push(function(e,t){t.score=e.score});for(var r=0,o=e.length;r<o;r+=1){var i=e[r];if(this.options.id&&(i.item=this.options.getFn(i.item,this.options.id)[0]),n.length){for(var s={item:i.item},a=0,c=n.length;a<c;a+=1)n[a](i,s);t.push(s)}else t.push(i.item)}return t}},{key:"_log",value:function(){if(this.options.verbose){var e;(e=console).log.apply(e,arguments)}}}]),e}();e.exports=c}])});
// from: https://greasyfork.org/en/users/5920-rickzabel
/*
when adding shortcuts each shortcut will need a uniuque name
the command to add links is WMERegisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
    ScriptName: This is the name of your script used to track all of your shortcuts on load and save.
    ScriptName: replace 'WMEAwesome' with your scripts name such as 'SomeOtherScript'
    ShortcutsHeader: this is the header that will show up in the keyboard editor
    NewShortcut: This is the name of the shortcut and needs to be uniuque from all of the other shortcuts, from other scripts, and WME
    ShortcutDescription: This wil show up as the text next to your shortcut
    FunctionToCall: this is the name of your function that will be called when the keyboard shortcut is presses
    ShortcutKeysObj: the is the object representing the keys watched set this to '-1' to let the users specify their own shortcuts.
    ShortcutKeysObj: The alt, shift, and ctrl keys are A=alt, S=shift, C=ctrl. for short cut to use "alt shift ctrl and l" the object would be 'ASC+l'
*/
function WMEKSRegisterKeyboardShortcut(a,b,c,d,e,f,g){try{I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members.length}catch(c){W.accelerators.Groups[a]=[],W.accelerators.Groups[a].members=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[a]=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].description=b,I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members=[]}if(e&&"function"==typeof e){I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members[c]=d,W.accelerators.addAction(c,{group:a});var i="-1",j={};j[i]=c,W.accelerators._registerShortcuts(j),null!==f&&(j={},j[f]=c,W.accelerators._registerShortcuts(j)),W.accelerators.events.register(c,null,function(){e(g)})}else alert("The function "+e+" has not been declared")}function WMEKSLoadKeyboardShortcuts(a){if(console.log("WMEKSLoadKeyboardShortcuts("+a+")"),localStorage[a+"KBS"])for(var b=JSON.parse(localStorage[a+"KBS"]),c=0;c<b.length;c++)try{W.accelerators._registerShortcuts(b[c])}catch(a){console.log(a)}}function WMEKSSaveKeyboardShortcuts(a){console.log("WMEKSSaveKeyboardShortcuts("+a+")");var b=[];for(var c in W.accelerators.Actions){var d="";if(W.accelerators.Actions[c].group==a){W.accelerators.Actions[c].shortcut?(W.accelerators.Actions[c].shortcut.altKey===!0&&(d+="A"),W.accelerators.Actions[c].shortcut.shiftKey===!0&&(d+="S"),W.accelerators.Actions[c].shortcut.ctrlKey===!0&&(d+="C"),""!==d&&(d+="+"),W.accelerators.Actions[c].shortcut.keyCode&&(d+=W.accelerators.Actions[c].shortcut.keyCode)):d="-1";var e={};e[d]=W.accelerators.Actions[c].id,b[b.length]=e}}localStorage[a+"KBS"]=JSON.stringify(b)}


// from https://github.com/lgarron/clipboard.js/blob/master/clipboard.min.js
// АХТУНГ!!! если вызов в $.ajax, то ставим параметр "async: false,"
(function(f,c){"undefined"!==typeof module?module.exports=c():"function"===typeof define&&"object"===typeof define.amd?define(c):this[f]=c()})("clipboard",function(){if(!document.addEventListener)return null;var f={};f.copy=function(){function c(){d=!1;b=null;e&&window.getSelection().removeAllRanges();e=!1}var d=!1,b=null,e=!1;document.addEventListener("copy",function(c){if(d){for(var e in b)c.clipboardData.setData(e,b[e]);c.preventDefault()}});return function(g){return new Promise(function(k,f){d=!0;b="string"===typeof g?{"text/plain":g}:g instanceof Node?{"text/html":(new XMLSerializer).serializeToString(g)}:g;try{var n=document.getSelection();if(!document.queryCommandEnabled("copy")&&n.isCollapsed){var l=document.createRange();l.selectNodeContents(document.body);n.addRange(l);e=!0}if(document.execCommand("copy"))c(),k();else throw Error("Unable to copy. Perhaps it's not available in your browser?");}catch(p){c(),f(p)}})}}();f.paste=function(){var c=!1,d,b;document.addEventListener("paste",function(e){if(c){c=!1;e.preventDefault();var g=d;d=null;g(e.clipboardData.getData(b))}});return function(e){return new Promise(function(g,f){c=!0;d=g;b=e||"text/plain";try{document.execCommand("paste")||(c=!1,f(Error("Unable to paste. Pasting only works in Internet Explorer at the moment.")))}catch(m){c=!1,f(Error(m))}})}}();"undefined"===typeof ClipboardEvent&&"undefined"!==typeof window.clipboardData&&"undefined"!==typeof window.clipboardData.setData&&(function(c){function d(a,b){return function(){a.apply(b,arguments)}}function b(a){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof a)throw new TypeError("not a function");this._value=this._state=null;this._deferreds=[];l(a,d(f,this),d(k,this))}function e(a){var b=this;return null===this._state?void this._deferreds.push(a):void p(function(){var c=b._state?a.onFulfilled:a.onRejected;if(null===c)return void(b._state?a.resolve:a.reject)(b._value);var h;try{h=c(b._value)}catch(d){return void a.reject(d)}a.resolve(h)})}function f(a){try{if(a===this)throw new TypeError("A promise cannot be resolved with itself.");if(a&&("object"==typeof a||"function"==typeof a)){var b=a.then;if("function"==typeof b)return void l(d(b,a),d(f,this),d(k,this))}this._state=!0;this._value=a;m.call(this)}catch(c){k.call(this,c)}}function k(a){this._state=!1;this._value=a;m.call(this)}function m(){for(var a=0,b=this._deferreds.length;b>a;a++)e.call(this,this._deferreds[a]);this._deferreds=null}function n(a,b,c,h){this.onFulfilled="function"==typeof a?a:null;this.onRejected="function"==typeof b?b:null;this.resolve=c;this.reject=h}function l(a,b,c){var h=!1;try{a(function(a){h||(h=!0,b(a))},function(a){h||(h=!0,c(a))})}catch(d){h||(h=!0,c(d))}}var p=b.immediateFn||"function"==typeof setImmediate&&setImmediate||function(a){setTimeout(a,1)},q=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)};b.prototype["catch"]=function(a){return this.then(null,a)};b.prototype.then=function(a,c){var d=this;return new b(function(b,f){e.call(d,new n(a,c,b,f))})};b.all=function(){var a=Array.prototype.slice.call(1===arguments.length&&q(arguments[0])?arguments[0]:arguments);return new b(function(b,c){function d(e,g){try{if(g&&("object"==typeof g||"function"==typeof g)){var k=g.then;if("function"==typeof k)return void k.call(g,function(a){d(e,a)},c)}a[e]=g;0===--f&&b(a)}catch(l){c(l)}}if(0===a.length)return b([]);for(var f=a.length,e=0;e<a.length;e++)d(e,a[e])})};b.resolve=function(a){return a&&"object"==typeof a&&a.constructor===b?a:new b(function(b){b(a)})};b.reject=function(a){return new b(function(b,c){c(a)})};b.race=function(a){return new b(function(b,c){for(var d=0,e=a.length;e>d;d++)a[d].then(b,c)})};"undefined"!=typeof module&&module.exports?module.exports=b:c.Promise||(c.Promise=b)}(this),f.copy=function(c){return new Promise(function(d,b){if("string"!==typeof c&&!("text/plain"in c))throw Error("You must provide a text/plain type.");window.clipboardData.setData("Text","string"===typeof c?c:c["text/plain"])?d():b(Error("Copying was rejected."))})},f.paste=function(){return new Promise(function(c,d){var b=window.clipboardData.getData("Text");b?c(b):d(Error("Pasting was rejected."))})});return f});
/* ********************************************************** */