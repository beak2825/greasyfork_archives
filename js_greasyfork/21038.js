// ==UserScript==
// @name        WME Show POI Components
// @namespace   https://greasyfork.org/ru/scripts/21038-wme-show-poi-components
// @description Показать компоненты выделенного ПОИ
// @include https://*.waze.com/*editor/*
// @include https://*.waze.com/*map-editor/*
// @include https://*.waze.com/*beta_editor/*
// @author skirda
// @version     1.2.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21038/WME%20Show%20POI%20Components.user.js
// @updateURL https://update.greasyfork.org/scripts/21038/WME%20Show%20POI%20Components.meta.js
// ==/UserScript==

var wmeSPC_version="1.2.0.0";
var wmeSPC_Debug=true;
var wmeSPC_Layer=null;
var wmeSPC_LayerName="wme_ShowPoiComponents";

console.log("WME Show POI Components start");

function getFeatureYOffset(){

	var yOffset = -20;
	return yOffset;
}

function XYTOLatLon(x,y)
{
	var urPos=new OpenLayers.LonLat(x,y);
	urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
	var result=	{
		lat: urPos.lat,
		lon: urPos.lon,
	};
	delete urPos;
	return result;
}

function addImage(lat, long, title, angle)
{
	var point = new OpenLayers.Geometry.Point(long,lat);
	var alertPx = Waze.map.getPixelFromLonLat(new OpenLayers.LonLat(long,lat));

	var icon='data:image/png;base64,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XlDDxAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNC0wNS0yMFQwMjozODo0NyswMDowMGfqcngAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTQtMDUtMjBUMDI6Mzg6NDcrMDA6MDAWt8rEAAAARnRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA2LjYuOS03IDIwMTQtMDMtMDYgUTE2IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3JngdOzwwAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpoZWlnaHQANTkxkQCL4wAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAA1OTFNrNhuAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE0MDA1NTM1MjcM+NMCAAAAEnRFWHRUaHVtYjo6U2l6ZQAxMDBLQkKJjk78AAAAM3RFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vdG1wL2xvY2FsY29weV8zZTAxNWYxZmU0NmYtMS5wbmfVHuuBAAAAAElFTkSuQmCC';
	//'
	//var icon='data:image/png;base64,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';
	//'

	var attributes = {
	    name: title,
		title: title,
		pixel: alertPx,
		angle: angle
	};

	var style = {
		externalGraphic: icon,
		graphicWidth: 40,
		graphicHeight: 40,
		graphicYOffset: getFeatureYOffset(),
		graphicZIndex:2,
		//fillOpacity: 1,
		//title: 'Point',
		//cursor: 'help',
		rotation:(90-angle)
  	};
  	//style={pointRadius:12,strokeOpacity:1,strokeColor:"#aaaaaa",fillColor:"#ff3300",fillOpacity:1,strokeWidth:2,externalGraphic:null};
  	//style={externalGraphic:W.imagePath+"turns-sd65f776611.png",rotation:"${angle}",graphicWidth:9,graphicHeight:5,graphicZIndex:2}
  	//style={externalGraphic:W.imagePath+"direction_arrow_drive.png",rotation:"${angle}",graphicWidth:49,graphicHeight:45,graphicZIndex:2}

	var imageFeature = new OpenLayers.Feature.Vector(point, attributes, style);

	delete point;

	//wmeSPC_Layer.addFeatures([imageFeature]);
	return imageFeature;
}

function getAngle2Point(node1, node2)
{
	var dx = node2.x - node1.x;
	var dy = node2.y - node1.y;
	try{
		var angle=Math.atan2(dy, dx);
	}catch(e){
		console.log(e);
	}
	return ((angle * 180 / Math.PI)) % 360;
}


function CalcRL(components)
{
	var count=components.length;
	var j=count-1;
	var area=0;

	for(var i=0; i < count; ++i)
	{
		area+=(components[i].y*components[j].x)-(components[i].x*components[j].y);
		j=i;
	}

	// проверяем знак получившейся площади - даст направление вращения массива
	return area < 0?1:-1; // 1 - по часовой, -1 - против часовой
}

function wmeSPC_GetData()
{
	//console.log("wmeSPC_GetData()");
	if (wmeSPC_Layer)
		if(wmeSPC_Layer.hasOwnProperty("features"))
			if (wmeSPC_Layer.features.length > 0)
				wmeSPC_Layer.destroyFeatures();

	if (!(Waze.selectionManager.getSelectedFeatures().length > 0 && Waze.selectionManager.getSelectedFeatures()[0].model.type === "venue"))
		return;

	if (Waze.map.zoom < 4)
		return;

	console.log("wmeSPC_GetData(): next");

	function uniq(a) {
		var seen = {};
		return a.filter(function(item) {
			return seen.hasOwnProperty(item) ? false : (seen[item] = true);
		});
	}


	var components=uniq(Waze.selectionManager.getSelectedFeatures()[0].model.geometry.getVertices());

	var LR=CalcRL(components);

	var count=components.length;

	var feature=[];

	for( var i=0; i < count; ++i)
	{
		var lat = components[i].y;
		var long = components[i].x;
		var llz=XYTOLatLon(long,lat);

		var title = "Point "+(i+0)+" of "+(count-1)+"<br>"+
					"XY = {"+components[i].x+", "+components[i].y+"}<br>"+
					"LatLon = {"+llz.lon+", "+llz.lat+"}<br>"+
					"id = "+components[i].id+"<br>"+
					"LR = <i class='fa fa-"+(LR <0?"undo":"repeat")+"'></i>";

		var point1;
		var point2;

		if( i < components.length-1 )
		{
			point1=new OpenLayers.Geometry.Point(components[i].x,components[i].y);
			point2=new OpenLayers.Geometry.Point(components[i+1].x,components[i+1].y);
		}
		else
		{
			point1=new OpenLayers.Geometry.Point(components[i].x,components[i].y);
			point2=new OpenLayers.Geometry.Point(components[0].x,components[0].y);
		}

		var angle=getAngle2Point(point1,point2);

		delete point1;
		delete point2;

		var featureImageVector=addImage(lat,long,title,angle);
		feature.push(featureImageVector);
		delete featureImageVector;
	}

    wmeSPC_Layer.addFeatures(feature);

    delete feature;
	delete components;//.length=0;
}


function WmeSPC_CreateLayer()
{
	console.log("WmeSPC_CreateLayer()");
	if (wmeSPC_Layer)
	{
		console.log("WmeSPC_CreateLayer(): found wmeSPC_Layer");
		wmeSPC_GetData();
		return;
	}

	var lmaoVisibility = true;

	I18n.translations[I18n.locale].layers.name[wmeSPC_LayerName] = "Show POI Components";
	if (I18n.translations.hasOwnProperty("ru"))
		I18n.translations.ru.layers.name[wmeSPC_LayerName] = "Показать компоненты ПОИ";

	// создаём слой
	wmeSPC_Layer = new OpenLayers.Layer.Vector(I18n.translations[I18n.locale].layers.name[wmeSPC_LayerName],{
			rendererOptions: { zIndexing: true },
			displayInLayerSwitcher: true,
			className: "Show-POI-Components",
			uniqueName: 'wme_ShowPoiComponents'
	});

	console.log("WmeSPC_CreateLayer(): wmeSPC_Layer=",wmeSPC_Layer);

	// restore saved settings
	if (localStorage.WMEShowPoiComponents) {
		//console.log("WME RE: loading options");
		var options = JSON.parse(localStorage.getItem("WMEShowPoiComponents"));
		lmaoVisibility = options[0];
	}

	// overload the WME exit function
	saveREOptions = function() {
		if (localStorage) {
			//console.log("WME RE: saving options");
			var options = [];

			lmaoVisibility = wmeSPC_Layer.visibility;
			options[0] = lmaoVisibility;

			localStorage.setItem("WMEShowPoiComponents", JSON.stringify(options));
		}
	};
	window.addEventListener("beforeunload", saveREOptions, false);


	 function showAlertPopup(f){
		console.log("showAlertPopup()");

		//shift popup if UR or MP panel is visible
		try{
			var urPanel = document.getElementById('update-request-panel');
			var mpPanel = document.getElementById('problem-edit-panel');
			var conversationPanel = urPanel.children[5];
			if (urPanel.className == 'top-panel panel-shown collapsed' && conversationPanel.style.display == 'block'){
				divWmeSPC.style.left = '635px';
			}
			else if (urPanel.className == 'top-panel panel-shown' && conversationPanel.style.display == 'block'){
				divWmeSPC.style.top = '325px';
				divWmeSPC.style.left = '635px';
			}
			else if (urPanel.className == 'top-panel panel-shown' || mpPanel.className == 'top-panel panel-shown'){
				divWmeSPC.style.top = '325px';
			}
			else{
				divWmeSPC.style.top = '175px';
				divWmeSPC.style.left = '375px';
			}
		}
		catch(e){
			;
		}

		var attributes = f.attributes;



		var reportDetail = attributes.title;
		document.getElementById("divWmeSPC").innerHTML = reportDetail;
		divWmeSPC.style.visibility = 'visible';
	};

	function hideAlertPopup()
	{
		divWmeSPC.style.visibility = 'hidden';
		divWmeSPC.style.top = '175px';
		divWmeSPC.style.left = '375px';
	};


	wmeSPC_Layer.setZIndex(9999);
	Waze.map.addLayer(wmeSPC_Layer);
	var drawFeature=new OpenLayers.Control.DrawFeature(wmeSPC_Layer, OpenLayers.Handler.Path);
	Waze.map.addControl(drawFeature);
	delete drawFeature;

	// <from WME Junction Angle Info>
	var togglers = document.querySelector('.togglers');
	console.log("WmeSPC_CreateLayer(): togglers=",togglers);
	if (document.querySelector('.layer-switcher-group_scripts') === null)
	{
      var newScriptsToggler = document.createElement('li');
      newScriptsToggler.className = 'group';
      newScriptsToggler.innerHTML = ''
      	+'<div class="controls-container toggler">'
		+'<input class="layer-switcher-group_scripts toggle" id="layer-switcher-group_scripts" type="checkbox">'
		+'<label for="layer-switcher-group_scripts">'
		+'<span class="label-text">Scripts</span>'
		+'</label>'
		+'</div>'
		+'<ul class="children">'
		+'</ul>';
      togglers.appendChild(newScriptsToggler);
	}

    var newToggler = document.createElement('li');
    newToggler.innerHTML = ''
    	+'<div class="controls-container toggler">'
        +'<input class="layer-switcher-item_SPC toggle" id="layer-switcher-item_SPC" type="checkbox">'
        +'<label for="layer-switcher-item_SPC">'
        +'<span class="label-text">'+I18n.translations[I18n.locale].layers.name[wmeSPC_LayerName]+'</span>'
        +'</label>'
        +'</div>';
    var groupScripts = document.querySelector('.layer-switcher-group_scripts').parentNode.parentNode;
    var newScriptsChildren = groupScripts.getElementsByClassName("children")[0];
    // insert JAI toggler at the end of children of "group_scripts"
    newScriptsChildren.appendChild(newToggler);

    var toggler = document.getElementById('layer-switcher-item_SPC');
    var groupToggler = document.getElementById('layer-switcher-group_scripts');

    // restore old state
    groupToggler.checked = (typeof(localStorage.groupScriptsToggler) !=="undefined" ?
    	JSON.parse(localStorage.groupScriptsToggler) : true);

    //Set toggler according to user preference
    //toggler.checked = ja_getOption("defaultOn");
    toggler.disabled = !groupToggler.checked;

    // togglers events
    toggler.addEventListener('click', function(e) {
        wmeSPC_Layer.setVisibility(e.target.checked);
    });

    groupToggler.addEventListener('click', function(e) {
        toggler.disabled = !e.target.checked;
        wmeSPC_Layer.setVisibility(toggler.checked ? e.target.checked : toggler.checked);
        localStorage.setItem('groupScriptsToggler', e.target.checked);
    });

    wmeSPC_Layer.setVisibility(toggler.checked ? groupToggler.checked : toggler.checked);
	// </from WME Junction Angle Info>

	//wmeSPC_Layer.setVisibility(lmaoVisibility);

	var divPopupCheck = document.getElementById('divWmeSPC');
	if (divPopupCheck == null){
		divWmeSPC = document.createElement('div');
		divWmeSPC.id = "divWmeSPC";
		divWmeSPC.style.position = 'absolute';
		divWmeSPC.style.visibility = 'hidden';
		divWmeSPC.style.top = '175px';
		divWmeSPC.style.left = '375px';
		divWmeSPC.style.zIndex = 1000;
		divWmeSPC.style.backgroundColor = 'aliceblue';
		divWmeSPC.style.borderWidth = '3px';
		divWmeSPC.style.borderStyle = 'ridge';
		divWmeSPC.style.borderRadius = '10px';
		divWmeSPC.style.boxShadow = '5px 5px 10px Silver';
		divWmeSPC.style.padding = '4px';
		document.body.appendChild(divWmeSPC);
	}

	//clear existing RE features
	wmeSPC_Layer.destroyFeatures();

	function WmeSPC_CheckLayerNum()
	{
		var reLayer = null;
		for(i=0; i<Waze.map.layers.length; i++)
		{
			if(Waze.map.layers[i].uniqueName == 'wme_ShowPoiComponents') reLayer = i;
		}
    	//console.log('WME RE: layer number = ' + reLayer);
		return reLayer;
	}


	var reLayer = WmeSPC_CheckLayerNum();

	Waze.map.events.register("mousemove", Waze.map, function(e) {
		hideAlertPopup();
		var position = this.events.getMousePosition(e);
		var reLayer = WmeSPC_CheckLayerNum();
		if(Waze.map.layers[reLayer].features.length > 0)
		{
			var alertFeatures = Waze.map.layers[reLayer];
			for(j=0; j<Waze.map.layers[reLayer].features.length; j++){

				if (typeof alertFeatures.features[j].attributes === "undefined")
					continue;
				if (typeof alertFeatures.features[j].attributes.pixel === "undefined")
					continue;

				var reLayerVisibility = wmeSPC_Layer.getVisibility();
				var alertX = alertFeatures.features[j].attributes.pixel.x;
				var alertY = alertFeatures.features[j].attributes.pixel.y + getFeatureYOffset();
				if(reLayerVisibility == true && position.x > alertX - 10 && position.x < alertX + 10 && position.y > alertY - 10 && position.y < alertY + 20)
				{
					showAlertPopup(alertFeatures.features[j]);
				}
			}
		}
	});

	//refresh if user moves map
	Waze.map.events.register("moveend", Waze.map, wmeSPC_GetData);

	window.setTimeout(wmeSPC_GetData(), 500);

}

function WmeSPC_Initialize()
{
	console.log("WmeSPC_Initialize()");
	WmeSPC_CreateLayer();
	Waze.selectionManager.events.register("selectionchanged", null, WmeSPC_Main);
}

function WmeSPC_Main()
{
	console.log ("Waze.selectionManager.getSelectedFeatures().length="+Waze.selectionManager.getSelectedFeatures().length);
	if (wmeSPC_Layer)
		wmeSPC_Layer.destroyFeatures();

	if (Waze.selectionManager.getSelectedFeatures().length > 0)
	{
		if (Waze.selectionManager.getSelectedFeatures()[0].model.type === "venue")
		{
			WmeSPC_CreateLayer();
		}
	}
}

function bootstrapWmeSPC()
{
	console.log("bootstrapWmeSPC()");
	if (typeof Waze === "undefined")
	{
		setTimeout(bootstrapWmeSPC, 500);
		return;
	}
	if (typeof Waze.map === "undefined")
	{
		setTimeout(bootstrapWmeSPC, 500);
		return;
	}
	if (typeof Waze.selectionManager === "undefined")
	{
		setTimeout(bootstrapWmeSPC, 500);
		return;
	}
	if (typeof I18n === "undefined")
	{
		setTimeout(bootstrapWmeSPC, 500);
		return;
	}
	if (typeof I18n.translations === "undefined")
	{
		setTimeout(bootstrapWmeSPC, 500);
		return;
	}
	if (document.getElementsByClassName('nav-tabs')[0] === null)
	{
		setTimeout(bootstrapWmeSPC,3000);
		return;
	}
	if (document.getElementsByClassName('tab-content')[0] === null)
	{
		setTimeout(bootstrapWmeSPC,3000);
		return;
	}
	if (document.getElementById('user-info') === null)
	{
		setTimeout(bootstrapWmeSPC,3000);
		return;
	}


	WmeSPC_Initialize();
}

// hack for require
// hack for require
function PathRequery()
{
	if(typeof WMEAPI !== "undefined") {console.log("Found WMEAPI!");return;}
	function patch() {if(typeof require !== "undefined") return; var WMEAPI={};for(WMEAPI.scripts=document.getElementsByTagName("script"),WMEAPI.url=null,i=0;i<WMEAPI.scripts.length;i++)if(WMEAPI.scripts[i].src.indexOf("/assets-editor/js/app")!=-1){WMEAPI.url=WMEAPI.scripts[i].src;break}if(null==WMEAPI.url)throw new Error("WME Hack: can't detect WME main JS");WMEAPI.require=function(a){return WMEAPI.require.define.modules.hasOwnProperty(a)?WMEAPI.require.define.modules[a]:(console.error("Require failed on "+a,WMEAPI.require.define.modules),null)},WMEAPI.require.define=function(a){0==WMEAPI.require.define.hasOwnProperty("modules")&&(WMEAPI.require.define.modules={});for(var b in a)WMEAPI.require.define.modules[b]=a[b]},WMEAPI.tmp=window.webpackJsonp,WMEAPI.t=function(a){if(WMEAPI.s[a])return WMEAPI.s[a].exports;var b=WMEAPI.s[a]={exports:{},id:a,loaded:!1};return WMEAPI.e[a].call(b.exports,b,b.exports,WMEAPI.t),b.loaded=!0,b.exports},WMEAPI.e=[],window.webpackJsonp=function(a,b){for(var d,e,c={},f=0,g=[];f<a.length;f++)e=a[f],WMEAPI.r[e]&&g.push.apply(g,WMEAPI.r[e]),WMEAPI.r[e]=0;var i,j,h=0;for(d in b)WMEAPI.e[d]=b[d],j=b[d].toString(),i=j.match(/CLASS_NAME:\"([^\"]*)\"/),i?c[i[1].replace(/\./g,"/").replace(/^W\//,"Waze/")]={index:d,func:WMEAPI.e[d]}:(c["Waze/Unknown/"+h]={index:d,func:WMEAPI.e[d]},h++);for(;g.length;)g.shift().call(null,WMEAPI.t);WMEAPI.s[0]=0;var l,k={};h=0;for(d in b)if(j=b[d].toString(),i=j.match(/CLASS_NAME:\"([^\"]*)\"/))k={},l=i[1].replace(/\./g,"/").replace(/^W\//,"Waze/"),k[l]=WMEAPI.t(c[l].index),WMEAPI.require.define(k);else{var m=j.match(/SEGMENT:"segment",/);m&&(k={},l="Waze/Model/ObjectType",k[l]=WMEAPI.t(c["Waze/Unknown/"+h].index),WMEAPI.require.define(k)),h++}window.webpackJsonp=WMEAPI.tmp,window.require=WMEAPI.require},WMEAPI.s={},WMEAPI.r={0:0},WMEAPI.WMEHACK_Injected_script=document.createElement("script"),WMEAPI.WMEHACK_Injected_script.setAttribute("type","application/javascript"),WMEAPI.WMEHACK_Injected_script.src=WMEAPI.url,document.body.appendChild(WMEAPI.WMEHACK_Injected_script);window.WMEAPI=WMEAPI;}
	var RPscript = document.createElement("script");
	RPscript.textContent =  patch.toString() + ';\n' + 'patch();';
	RPscript.setAttribute("type", "application/javascript");
	document.body.appendChild(RPscript);
}
PathRequery();

bootstrapWmeSPC();
