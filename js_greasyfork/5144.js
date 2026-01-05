// ==UserScript==
// @name				WME LiveMap closures
// @description 		Shows road closures from Waze Live map in WME
// @match 				https://www.waze.com/*editor*
// @match 				https://beta.waze.com/*editor*
// @version 			1.16.12
// @copyright			2014-2025, pvo11
// @namespace			https://greasyfork.org/scripts/5144-wme-road-closures
// @downloadURL https://update.greasyfork.org/scripts/5144/WME%20LiveMap%20closures.user.js
// @updateURL https://update.greasyfork.org/scripts/5144/WME%20LiveMap%20closures.meta.js
// ==/UserScript==


var epsg900913;
var epsg4326;
var closuresLayer;

var uOpenLayers;
var uWaze;

var lineWidth = [
	[4, 5],
	[5, 6],
	[6, 7],
	[7, 8],
	[8, 9],
	[10, 12],
	[12, 14],
	[14, 16],
	[15, 17],
	[16, 18],
	[17, 19]
];


function drawLine(line) {
	var linePoints = [];

	var zoom = uWaze.map.getZoom() - 12;
	if (zoom >= lineWidth.length) {
		zoom = lineWidth.length - 1;
	}

	var p = new uOpenLayers.Geometry.Point(line[0].x, line[0].y).transform(epsg4326, epsg900913);
	linePoints.push(p);
	for(var i = 1; i < line.length-1; i++) {
		var lp1 = line[i];
		var lp2 = line[i + 1];

		var dif_lon = Math.abs(lp1.x - lp2.x);
		var dif_lat = Math.abs(lp1.y - lp2.y);

		if (dif_lon < 0.0000001 && dif_lat < 0.0000001) continue;
		p = new uOpenLayers.Geometry.Point(lp1.x, lp1.y).transform(epsg4326, epsg900913);
		linePoints.push(p);
	}
	p = new uOpenLayers.Geometry.Point(line[line.length-1].x, line[line.length-1].y).transform(epsg4326, epsg900913);
	linePoints.push(p);
	var lineString = new uOpenLayers.Geometry.LineString(linePoints);
	var lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#000000', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: lineWidth[zoom][1]} );
	closuresLayer.addFeatures(lineFeature);
	lineString = new uOpenLayers.Geometry.LineString(linePoints);
	lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#FF0000', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: lineWidth[zoom][0] } );
	closuresLayer.addFeatures(lineFeature);
	lineString = new uOpenLayers.Geometry.LineString(linePoints);
	lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#FFFFFF', strokeDashstyle: 'dot', strokeLinecap: 'square', strokeWidth: lineWidth[zoom][0] } );
	closuresLayer.addFeatures(lineFeature);
}


function getRoutingURL(){
	var server;
	if (typeof (uWaze.location) === 'undefined') {
		server = uWaze.app.getAppRegionCode();
	} else {
		server = uWaze.location.code;
	}
	var routingURL = 'https://www.waze.com';
	if (~document.URL.indexOf('https://beta.waze.com')) {
        routingURL = 'https://beta.waze.com';
    }

	routingURL += '/live-map/api/georss';

	return routingURL;
}


function requestClosures()
{
	var zoom = uWaze.map.getZoom() - 12;
	var env = uWaze.app.getAppRegionCode();
	if (env == 'usa') {
		env = 'na';
	}
	if (zoom >= 0) {
		if (closuresLayer.getVisibility()) {
			var extent = uWaze.map.getExtent();
			var data;
			data = {
				env: env,
				ma: "600",
				mj: "100",
				mu: "100",
				types: "traffic",
				left: extent[0],
				top: extent[1],
				right: extent[2],
				bottom: extent[3]
			};
			var url = getRoutingURL();

			$.ajax({
					dataType: "json",
					url: url,
					data: data,
					success: function(json) {
						if (json.error != undefined) {
						} else {
							closuresLayer.destroyFeatures();
							var ids = [];
							if ("undefined" !== typeof(json.jams)) {
								var numjams = json.jams.length;
								for (var i = 0; i < numjams; i++) {
									var jam = json.jams[i];
									if (jam.delay === -1){
										drawLine(jam.line);
									}
								}
							}
						}
				}
			});
		}
	}
}


function changeLayer()
{
	localStorage.DrawLiveMapClosures = closuresLayer.getVisibility();
	requestClosures();
}


function liveMapClosures_init()
{
	uWaze = unsafeWindow.W;
	uOpenLayers = unsafeWindow.OpenLayers;

	epsg900913 = new uOpenLayers.Projection("EPSG:900913");
	epsg4326 = new uOpenLayers.Projection("EPSG:4326");

	closuresLayer = new uOpenLayers.Layer.Vector("LiveMap closures", {
			displayInLayerSwitcher: true,
		});
	uWaze.map.addLayer(closuresLayer);
	if (localStorage.DrawLiveMapClosures) {
		closuresLayer.setVisibility(localStorage.DrawLiveMapClosures == "true");
	} else {
		closuresLayer.setVisibility(true);
	}
	var roadGroupSelector = document.getElementById('layer-switcher-group_road');
	if (roadGroupSelector != null) {
		var roadGroup = roadGroupSelector.parentNode.parentNode.getElementsByTagName("UL")[0];
		var toggler = document.createElement('li');
		var checkbox = document.createElement("wz-checkbox");
		checkbox.id = 'layer-switcher-item_livemap_closures';
		checkbox.className = "hydrated";
		checkbox.disabled = !roadGroupSelector.checked;
		checkbox.checked = closuresLayer.getVisibility();
		checkbox.appendChild(document.createTextNode("LiveMap closures"));
		toggler.appendChild(checkbox);
		roadGroup.appendChild(toggler);
		checkbox.addEventListener('click', function(e) {
			closuresLayer.setVisibility(e.target.checked);
		});
		roadGroupSelector.addEventListener('click', function(e) {
			closuresLayer.setVisibility(e.target.checked && checkbox.checked);
			checkbox.disabled = !e.target.checked;
		});
	}

	var alertsLayer = uWaze.map.getLayerByName('Livemap Alerts');
	if (typeof(alertsLayer) !== "undefined") {
		var closuresLayerZIdx = closuresLayer.getZIndex();
			var alertsLayerZIdx = alertsLayer.getZIndex();
		if (closuresLayerZIdx > alertsLayerZIdx) {
			closuresLayer.setZIndex(alertsLayerZIdx);
			alertsLayer.setZIndex(closuresLayerZIdx);
		}
	}

	uWaze.map.events.register("zoomend", null, requestClosures);
	uWaze.map.events.register("moveend", null, requestClosures);
	uWaze.map.events.register("changelayer", null, changeLayer);
	requestClosures();

}


document.addEventListener("wme-map-data-loaded", liveMapClosures_init, {once: true});

