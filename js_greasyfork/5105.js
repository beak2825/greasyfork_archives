// ==UserScript==
// @name            geoportal.gov.pl layers for WME without translating PROXY
// @version         0.2.10.1forked
// @description     Displays layers from geoportal.gov.pl in WME
// @grant 			none
// @grant 			GM_info
// @include         https://*.waze.com/*/editor/*
// @include         https://*.waze.com/editor/*
// @include         https://*.waze.com/map-editor/*
// @include         https://*.waze.com/beta_editor/*
// @include         https://editor-beta.waze.com/*
// @require			http://cdnjs.cloudflare.com/ajax/libs/proj4js/2.2.2/proj4.js
// @copyright		2013,2014+, Patryk Ściborek, Paweł Pyrczak, Bogusz Jagoda
// @run-at 			document-end
// @namespace https://greasyfork.org/users/5378
// @downloadURL https://update.greasyfork.org/scripts/5105/geoportalgovpl%20layers%20for%20WME%20without%20translating%20PROXY.user.js
// @updateURL https://update.greasyfork.org/scripts/5105/geoportalgovpl%20layers%20for%20WME%20without%20translating%20PROXY.meta.js
// ==/UserScript==


function GEOPORTAL_bootstrap()
{
	var bGreasemonkeyServiceDefined = false;
	
	try {
		var ver = window.navigator.appVersion.match(/Chrome\/(.*?) /)[1];
	} catch(err) {
		var ver = null;
	}
	if (null !== ver) {
		var itschrome = true;
		///ver = "27.0.1438.7"; // last old working version
		// example: 32.0.1700.107
		// [0] - major versin
		// [2] - minor version
		ver = ver.split(".");
		ver[0] = parseInt(ver[0]);
		ver[2] = parseInt(ver[2]);
		if (ver[0] > 27) {
			var newmethod = true;
		} else if (ver[0] == 27) {
			if (ver[2] <= 1438) {
				var newmethod = false;
			} else {
				var newmethod = true;
			}
		} else {
			var newmethod = false;	
		}
	} else {
		var itschrome = false;
		var newmethod = false;
	}


	try
	{
		if ("object" === typeof Components.interfaces.gmIGreasemonkeyService)  // Firefox tells that "Components" is deprecated
		{
			bGreasemonkeyServiceDefined = true;
		}
    }	catch (err) { };

	try
	{
		if  ("object" === typeof GM_info)
		{
			bGreasemonkeyServiceDefined = true;
		}
    }	catch (err) { };    

    
	if ( "undefined" === typeof unsafeWindow  ||  ! bGreasemonkeyServiceDefined)
	{
		try {
			unsafeWindow    = ( function ()
			{
				var dummyElem   = document.createElement('p');
				dummyElem.setAttribute ('onclick', 'return window;');
				return dummyElem.onclick ();
			} ) ();
		} 
		catch (err)
		{
			//Ignore.
		}
	}

	//And check again for new chrome, and no tamper(grease)monkey
	if ( itschrome && newmethod &&  !bGreasemonkeyServiceDefined)
	{
		console.log("Geoportal: no Tampermonkey/Greasemonkey found - injecting code to page.");
		//use "dirty" but effective method with injection to document
		var DLscript = document.createElement("script");
		DLscript.textContent =''+
		geoportal_run.toString()+'unsafeWindow=window; \n'+
		'geoportal_run() \n';
		DLscript.setAttribute("type", "application/javascript");
		document.body.appendChild(DLscript);
        
        // proj4js inclusion
		//var proj4js_inc = document.createElement('script');
		//proj4js_inc.src = 'http://cdnjs.cloudflare.com/ajax/libs/proj4js/2.2.2/proj4.js';
	    //document.head.appendChild(proj4js_inc);
        //console.log('Geoportal: proj4js included...');

	} else {  
        // proj4js inclusion
		//var proj4js_inc = document.createElement('script');
		//proj4js_inc.src = 'http://cdnjs.cloudflare.com/ajax/libs/proj4js/2.2.2/proj4.js';
	    //document.head.appendChild(proj4js_inc);
		//console.log('Geoportal: proj4js included...');        
        
		/* begin running the code! */
		console.log("Geoportal: unsafeWindow found - runing code.");
		setTimeout(geoportal_run,100);
	}		
}

function geoportal_run() {

GEOPORTAL = { ver: "0.2.9" };

GEOPORTAL.init = function(w)
{
 console.log('Geoportal: start init '); 
    
 //wms_service="http://sdi.geoportal.gov.pl/wms_orto/wmservice.aspx?"; // layer: ORTOFOTO,ORTOFOTO_ISOK
 wms_service_orto="http://mapy.geoportal.gov.pl/wss/service/img/guest/ORTO/MapServer/WMSServer?"; // layer: Raster
 //wms_service_orto_2="http://mapproxy.sciborek.com/service?"; // layer: geoportal_orto
 wms_service_orto_2="http://sdi.geoportal.gov.pl/wms_orto/wmservice.aspx?"; // layer: ORTOFOTO,ORTOFOTO_ISOK
 wms_service_prng="http://mapy.geoportal.gov.pl/wss/service/pub/guest/G2_PRNG_WMS/MapServer/WMSServer?"; // nazwy
 wms_service_bud="http://mapy.geoportal.gov.pl/wss/service/pub/guest/G2_BDOT_BUD_2010/MapServer/WMSServer?"; // budynki
    
 wms_service_topo_1="http://mapy.geoportal.gov.pl/wss/service/pub/guest/kompozycjaG2_TBD_WMS/MapServer/WMSServer?";	// topo

    var my_wazeMap = w;
    if (typeof my_wazeMap == undefined) my_wazeMap = unsafeWindow.Waze.map;
       
        var epsg900913 = new unsafeWindow.OpenLayers.Projection("EPSG:900913");
    	var epsg3857 = new unsafeWindow.OpenLayers.Projection("EPSG:3857");
		var epsg4326 =  new unsafeWindow.OpenLayers.Projection("EPSG:4326");
    	var epsg2180 =  new unsafeWindow.OpenLayers.Projection("EPSG:2180");		// najlepsze dla geoportalu (nie musi robić wewnętrznej konwersji współrzędnych projekcji)
		var tileSizeG = new unsafeWindow.OpenLayers.Size(512,512);
        
        getUrl4326 = function (bounds) {
			/* this function is modified Openlayer WMS CLASS part */
			/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
			* full list of contributors). Published under the 2-clause BSD license.
			* See license.txt in the OpenLayers distribution or repository for the
			* full text of the license. */
			bounds = bounds.clone(); // Zrobione dlatego że tranformacja była dziedziczona do parenta i się sypało aż niemiło

			bounds = this.adjustBounds(bounds);
			
			var imageSize = this.getImageSize(bounds);
			var newParams = {};
			bounds.transform(this.epsg900913,this.epsg4326);
			// WMS 1.3 introduced axis order
			var reverseAxisOrder = this.reverseAxisOrder();
			newParams.BBOX = this.encodeBBOX ?
				bounds.toBBOX(null, reverseAxisOrder) :
				bounds.toArray(reverseAxisOrder);
			newParams.WIDTH = imageSize.w;
			newParams.HEIGHT = imageSize.h;
			var requestString = this.getFullRequestString(newParams);
			//this.setZIndex(3);
			//this.map.getLayersBy("uniqueName","satellite_imagery").first().setZIndex(1);
			return requestString;
        };
    
        getUrlTopo = function (bounds) {
			/* this function is modified Openlayer WMS CLASS part */
			/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
			* full list of contributors). Published under the 2-clause BSD license.
			* See license.txt in the OpenLayers distribution or repository for the
			* full text of the license. */
			bounds = bounds.clone(); // Zrobione dlatego że tranformacja była dziedziczona do parenta i się sypało aż niemiło

			bounds = this.adjustBounds(bounds);
			
			var imageSize = this.getImageSize(bounds);
			var newParams = {};
            proj4.defs("EPSG:2180", "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
            var proj_dst = proj4('EPSG:2180');      
      		//var proj_src = proj4('EPSG:4326');
            var proj_src = proj4('EPSG:3857');
            
            //proj4(proj_src,proj_dst,[19.31596, 50.57271])
        	var lt = [bounds.left,bounds.top];
            var rb = [bounds.right,bounds.bottom];
			//bounds.transform(this.epsg2180,this.epsg4326);
            lt = proj4(proj_src,proj_dst,lt);
            rb = proj4(proj_src,proj_dst,rb);
            bounds.left = lt[0];
            bounds.top = lt[1];
            bounds.right = rb[0];
            bounds.bottom = rb[1];
			// WMS 1.3 introduced axis order
			var reverseAxisOrder = this.reverseAxisOrder();
			newParams.BBOX = bounds.toArray(true);
			newParams.WIDTH = imageSize.w;
			newParams.HEIGHT = imageSize.h;
			var requestString = this.getFullRequestString(newParams);
			return requestString;
        };

    
    	getUrl2180 = function (bounds) {
			bounds = bounds.clone(); 

			bounds = this.adjustBounds(bounds);
			
			var imageSize = this.getImageSize(bounds);
			var newParams = {};
			bounds.transform(this.epsg2180,this.epsg4326);
			// WMS 1.3 introduced axis order
			var reverseAxisOrder = this.reverseAxisOrder();
			newParams.BBOX = this.encodeBBOX ?
                bounds.toBBOX(null, reverseAxisOrder) :
				bounds.toArray(reverseAxisOrder);            
			newParams.WIDTH = imageSize.w;
			newParams.HEIGHT = imageSize.h;
            
			var requestString = this.getFullRequestString(newParams);
			return requestString;            
    	};
        
        getFullRequestString4326 = function(newParams, altUrl) {
			/* this function is modified Openlayer WMS CLASS part */
			/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
			* full list of contributors). Published under the 2-clause BSD license.
			* See license.txt in the OpenLayers distribution or repository for the
			* full text of the license. */
			var mapProjection = this.map.getProjectionObject();
			var projectionCode = this.projection.getCode();
			var value = (projectionCode == "none") ? null : projectionCode;
			if (parseFloat(this.params.VERSION) >= 1.3) {
                this.params.CRS = value;
			} else {
				this.params.SRS = "EPSG:4326"; //na sztywno najlepiej
			}
			
			if (typeof this.params.TRANSPARENT == "boolean") {
				newParams.TRANSPARENT = this.params.TRANSPARENT ? "TRUE" : "FALSE";
			}

			return unsafeWindow.OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(
														this, arguments);
		};
    
        getFullRequestStringTopo = function(newParams, altUrl) {
			/* this function is modified Openlayer WMS CLASS part */
			/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
			* full list of contributors). Published under the 2-clause BSD license.
			* See license.txt in the OpenLayers distribution or repository for the
			* full text of the license. */
			var mapProjection = this.map.getProjectionObject();
			var projectionCode = this.projection.getCode();
			var value = (projectionCode == "none") ? null : projectionCode;
			if (parseFloat(this.params.VERSION) >= 1.3) {
                this.params.CRS = "EPSG:2180";
			} else {
				this.params.SRS = "EPSG:4326"; //na sztywno najlepiej
			}
			
			if (typeof this.params.TRANSPARENT == "boolean") {
				newParams.TRANSPARENT = this.params.TRANSPARENT ? "TRUE" : "FALSE";
			}

			return unsafeWindow.OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(
														this, arguments);
		};
    
        
    var geop_orto = new unsafeWindow.OpenLayers.Layer.WMS("Geoportal - orto#1",
			wms_service_orto,
            {
                layers: "Raster",
                format: "image/jpeg"
            },{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				transitionEffect: "resize",
				uniqueName: "orto1",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				getFullRequestString: getFullRequestString4326
			});
			
		I18n.translations.en.layers.name["orto1"] = "Geoportal - orto#1";

        
       var  geop_orto2 = new OpenLayers.Layer.WMS("Geoportal - orto#2",
			wms_service_orto_2,
            {
                layers: "ORTOFOTO,ORTOFOTO_ISOK",
                format: "image/jpeg"
          },{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				transitionEffect: "resize",
				uniqueName: "orto2",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				getFullRequestString: getFullRequestString4326
			})
        I18n.translations.en.layers.name["orto2"] = "Geoportal - orto#2";

    	// geoportal
        var  geop_topo1 = new OpenLayers.Layer.WMS("Geoportal - topo#1",
			wms_service_topo_1,
            {
                layers: "LasZadrz_A,Kolej_L,Zabudowa_A,NazUl_L,Bud_A,PktAdr_P,Autost_L,Tunel_L,DrEksp_L,DrGl_L,DrZb_L,DrLokUtw_L,Gmina,Woda_A,KomplKom_A,Przem_gosp_A,Plac_A,DrDoj_L,DrLokGr_L,DrLokNieutw_L",
                format: "image/jpeg",
                transparent: "false",                
                version: "1.3.0"
          },{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
              	opacity: 0.3,
				transitionEffect: "resize",
				uniqueName: "topo1",
				//epsg900913: epsg3857,
              	epsg2180: epsg2180,
				epsg4326: epsg4326,
              	//epsg2180: epsg2180,
				getURL: getUrlTopo,
				//getFullRequestString: getFullRequestString4326
                getFullRequestString: getFullRequestStringTopo
			})
        I18n.translations.en.layers.name["topo1"] = "Geoportal - topo#1";

        
        //geoportal_prng
        var geop_prng = new OpenLayers.Layer.WMS("Geoportal - nazwy",
			wms_service_prng,
			{
				layers: "Wies,Miasto,Drogi",
                transparent: "true",
                format: "image/png"
			},{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				uniqueName: "nazwy",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				getFullRequestString: getFullRequestString4326
			});
        I18n.translations.en.layers.name["nazwy"] = "Geoportal - nazwy";
        
        var geop_adresy = new OpenLayers.Layer.WMS("Geoportal - adresy",
			wms_service_bud,
			{
				layers: "12,11,10,9,8,7,6,5,4,3,2,1,0",
				transparent: "true",
				format: "image/png"
			},{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				uniqueName: "adresy",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				getFullRequestString: getFullRequestString4326
			});
		I18n.translations.en.layers.name["adresy"] = "Geoportal - adresy";
   
    console.log('Geoportal: adding layers');
	if(my_wazeMap.getLayersByName("Geoportal - orto").length == 0)
	{       
		my_wazeMap.addLayer(geop_orto);
		my_wazeMap.addLayer(geop_orto2);
        my_wazeMap.addLayer(geop_topo1);
		my_wazeMap.addLayer(geop_prng);
		my_wazeMap.addLayer(geop_adresy);

		console.log('Geoportal: layers added');
		this.OrtoTimer();
	}

}


GEOPORTAL.OrtoTimer = function() {
		setTimeout(function(){
			var a = unsafeWindow.Waze.map.getLayersBy("uniqueName","orto1");
			if (a[0]) a[0].setZIndex(1);
			var b = unsafeWindow.Waze.map.getLayersBy("uniqueName","orto2");
			if (b[0]) b[0].setZIndex(2);            
   			var c = unsafeWindow.Waze.map.getLayersBy("uniqueName","topo1");
			if (c[0]) c[0].setZIndex(3);
			unsafeWindow.Waze.map.getLayersBy("uniqueName","satellite_imagery").first().setZIndex(1); // mapy Googla
			GEOPORTAL.OrtoTimer();
		},500);
}


GEOPORTAL.initBootstrap = function() {
	try {
		if (undefined != typeof unsafeWindow.Waze.map.getLayersByName) {
			this.init(unsafeWindow.Waze.map);
		} else {
		console.log("Geoportal: WME not initialized yet, trying again later.");
			setTimeout(function(){
				GEOPORTAL.initBootstrap();
			},700);				
		}
	} catch (err) {
		console.log("Geoportal: WME not initialized yet, trying again later.");
		setTimeout(function(){
			GEOPORTAL.initBootstrap();
		},700);			
	}
}

GEOPORTAL.initBootstrap();

}

GEOPORTAL_bootstrap();
