// ==UserScript==
// @name			WME HN NavPoints CZ edition
// @version			0.4.14
// @author			MajkiiTelini
// @description		Shows navigation points of czech construction site landmarks house numbers in WME
// @match 			https://*.waze.com/*editor*
// @run-at			document-end
// @namespace		https://greasyfork.org/cs/users/135686
// @downloadURL https://update.greasyfork.org/scripts/387381/WME%20HN%20NavPoints%20CZ%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/387381/WME%20HN%20NavPoints%20CZ%20edition.meta.js
// ==/UserScript==

var W;
var OL;
var I18n;
var HNNavPointsLayer;
var HNNavPointsNumbersLayer;
var layerTogglers = {};
var oldVenuesId = [];
const maxZoom = 17;

function HNNavPoints_init() {
	W = unsafeWindow.W;
	OL = unsafeWindow.OpenLayers;
	I18n = unsafeWindow.I18n;
	HNNavPointsLayer = new OL.Layer.Vector("HN NavPoints Layer CZ", {
		displayInLayerSwitcher: true,
		uniqueName: "__HNNavPointsLayerCZ",
		styleMap: new OL.StyleMap({'default':{
			strokeColor: "${Color}",
			strokeOpacity: 1,
			strokeWidth: 3,
			fillColor: "${Color}",
			fillOpacity: 0.5,
			pointerEvents: "visiblePainted",
			label : "${distance}",
			fontSize: "12px",
			fontFamily: "Arial Black, monospace",
			fontWeight: "bold",
			labelOutlineColor: "${Color}",
			labelOutlineWidth: 3
		}})
	});
	/*HNNavPointsNumbersLayer = new OL.Layer.Vector("HN NavPoints Numbers Layer CZ", {
		displayInLayerSwitcher: true,
		uniqueName: "__HNNavPointsNumbersLayerCZ",
		styleMap: new OL.StyleMap({'default':{
			strokeColor: "${Color}",
			strokeOpacity: 1,
			strokeWidth: 3,
			fillColor: "${Color}",
			fillOpacity: 0.5,
			pointerEvents: "visiblePainted",
			label : "${hn_number}",
			fontSize: "12px",
			fontFamily: "Arial Black, monospace",
			fontWeight: "bold",
			labelOutlineColor: "${Color}",
			labelOutlineWidth: 3
		}})
	});*/
	var displayGroupSelector = document.getElementById("layer-switcher-group_display");
	if (displayGroupSelector !== null) {
		layerTogglers.hnLinesCZ = addLayerToggler(displayGroupSelector, HNNavPointsLayer, "hnLinesCZ", "HN NavPoints CZ");
		//layerTogglers.hnNumbersCZ = addLayerToggler(displayGroupSelector, HNNavPointsNumbersLayer, "hnNumbersCZ", "HN NavPoints Numbers CZ");
	}
	W.map.addLayer(HNNavPointsLayer);
	//W.map.addLayer(HNNavPointsNumbersLayer);
	function saveHNNavPointsOptions() {
		if (localStorage) {
			var options = {};
			for (var key in layerTogglers) {
				options[key] = document.getElementById(layerTogglers[key].htmlItem).checked;
			}
			localStorage.WMEHNNavPointsCZ = JSON.stringify(options);
		}
	}
	window.addEventListener("beforeunload", saveHNNavPointsOptions, false);
	if (localStorage.WMEHNNavPointsCZ) {
		var options = JSON.parse(localStorage.WMEHNNavPointsCZ);
		for (var key in layerTogglers) {
			document.getElementById(layerTogglers[key].htmlItem).checked = options[key];
			layerTogglers[key].layer.setVisibility(options[key] && !document.getElementById(layerTogglers[key].htmlItem).disabled && W.map.zoom >= maxZoom);
		}
	}
	W.map.events.register("zoomend", null, requestHNs);
	W.map.events.register("moveend", null, requestHNs);
	W.model.events.register("mergeend", null, requestHNs);
	W.map.events.register("loadend", null, requestHNs);
	W.model.actionManager.events.register("afterclearactions", null, requestHNs);
	W.model.actionManager.events.register("afteraction", null, requestHNs);
	W.model.actionManager.events.register("afterundoaction", null, requestHNs);
	W.model.actionManager.events.register("noActions", null, requestHNs);
	W.accelerators.events.register("reloadData", null, requestHNs);
	requestHNs();
}

function addLayerToggler(groupCheckbox, layer, checkboxId, text) {
	var layerToggler = {};
	layerToggler.htmlItem = "layer-switcher-item_hnnavpoints_" + checkboxId;
	layerToggler.layer = layer;
	var displayGroup = groupCheckbox.parentNode.parentNode.getElementsByTagName("UL")[0];
	var toggler = document.createElement("li");
	var checkbox = document.createElement("wz-checkbox");
	checkbox.id = layerToggler.htmlItem;
	checkbox.className = "hydrated";
	checkbox.disabled = !groupCheckbox.checked;
	checkbox.appendChild(document.createTextNode(text));
	toggler.appendChild(checkbox);
	displayGroup.appendChild(toggler);
	checkbox.addEventListener("click", layerTogglerEventHandler(layer));
	groupCheckbox.addEventListener("click", layerTogglerGroupEventHandler(checkbox, layer));
	registerKeyShortcut(text, layerKeyShortcutEventHandler(groupCheckbox, checkbox), text.replace(/\s+/g, ''));
	return layerToggler;
}

function registerKeyShortcut(actionName, callback, keyName) {
	I18n.translations[I18n.locale].keyboard_shortcuts.groups.default.members[keyName] = actionName;
	W.accelerators.addAction(keyName, {group: "default"});
	W.accelerators.events.register(keyName, null, callback);
	W.accelerators._registerShortcuts({["name"]: keyName});
}

function layerKeyShortcutEventHandler(groupCheckbox, checkbox) {
	return function() {
		if (!groupCheckbox.disabled) {
			checkbox.click();
		}
	};
}

function layerTogglerEventHandler(layer) {
	return function() {
		layer.setVisibility(this.checked && W.map.zoom >= maxZoom);
		requestHNs();
	};
}

function layerTogglerGroupEventHandler(checkbox, layer) {
	return function() {
		layer.setVisibility(this.checked && checkbox.checked && W.map.zoom >= maxZoom);
		checkbox.disabled = !this.checked;
		requestHNs();
	};
}

function requestHNs() {
	HNNavPointsLayer.setVisibility(document.getElementById(layerTogglers.hnLinesCZ.htmlItem).checked && !document.getElementById(layerTogglers.hnLinesCZ.htmlItem).disabled && W.map.zoom >= maxZoom);
	//HNNavPointsNumbersLayer.setVisibility(document.getElementById(layerTogglers.hnNumbersCZ.htmlItem).checked && !document.getElementById(layerTogglers.hnNumbersCZ.htmlItem).disabled && W.map.zoom >= maxZoom);
	if (!HNNavPointsLayer.getVisibility() /*&& !HNNavPointsNumbersLayer.getVisibility()*/) {
		return;
	}
	var eg = W.map.getExtent().toGeometry();
	var objVenues = W.model.venues.objects;
	var actVenuesId = Object.keys(objVenues).filter(function(key) {
		if (objVenues[key].attributes.categories.includes("CONSTRUCTION_SITE") && eg.intersects(objVenues[key].getOLGeometry())) {return key;}
	}).map(function (key) {
		return key;
	});
	var releasedVenuesId = oldVenuesId.filter(function(key) {return actVenuesId.indexOf(key) < 0;});
	releasedVenuesId.forEach(function(j) {
		HNNavPointsLayer.removeFeatures(HNNavPointsLayer.getFeaturesByAttribute("placeId", releasedVenuesId[j]));
	});
	actVenuesId.forEach(function(j) {
		drawHNLine(objVenues[j]);
	});
	oldVenuesId = actVenuesId;
}

function drawHNLine(HnPlace) {
	HNNavPointsLayer.removeFeatures(HNNavPointsLayer.getFeaturesByAttribute("placeId", HnPlace.attributes.id));
	if (HnPlace.attributes.entryExitPoints.length > 0) {
		var lineString = new OL.Geometry.LineString([HnPlace.getOLGeometry(), W.userscripts.toOLGeometry(HnPlace.attributes.entryExitPoints[0]._point)]);
		var lineFeature = new OL.Feature.Vector(lineString, {placeId : HnPlace.attributes.id}, {strokeWidth: 4, strokeColor: "black", strokeOpacity: 0.5, strokeDashstyle: "dash", strokeDashArray: "8, 8"});
		HNNavPointsLayer.addFeatures(lineFeature);
		lineString = new OL.Geometry.LineString([HnPlace.getOLGeometry(), W.userscripts.toOLGeometry(HnPlace.attributes.entryExitPoints[0]._point)]);
		lineFeature = new OL.Feature.Vector(lineString, {placeId : HnPlace.attributes.id}, {strokeWidth: 2, strokeColor: "white", strokeOpacity: 1, strokeDashstyle: "dash", strokeDashArray: "8, 8"});
		HNNavPointsLayer.addFeatures(lineFeature);
	}
	var p = HnPlace.attributes.entryExitPoints.length > 0 ? W.userscripts.toOLGeometry(HnPlace.attributes.entryExitPoints[0]._point) : HnPlace.getOLGeometry();
	var closestSeg = findClosestSegment(p);
	if (closestSeg !== undefined) {
		var distanceFromSeg = new OL.Geometry.LineString([p, closestSeg.closestPoint]).getGeodesicLength(new OL.Projection("EPSG:3857"));
		var color = distanceFromSeg < 8 ? "red" : HnPlace.attributes.entryExitPoints.length > 0 ? "yellow" : "orange";
		lineString = new OL.Geometry.LineString([p, closestSeg.closestPoint]);
		lineFeature = new OL.Feature.Vector(lineString, {placeId : HnPlace.attributes.id}, {strokeWidth: 4, strokeColor: "black", strokeOpacity: 0.5, strokeDashstyle: "dash", strokeDashArray: "8, 8"});
		HNNavPointsLayer.addFeatures(lineFeature);
		lineString = new OL.Geometry.LineString([p, closestSeg.closestPoint]);
		lineFeature = new OL.Feature.Vector(lineString, {placeId : HnPlace.attributes.id}, {strokeWidth: 2, strokeColor: color, strokeOpacity: 1, strokeDashstyle: "dash", strokeDashArray: "8, 8"});
		HNNavPointsLayer.addFeatures(lineFeature);
		if (distanceFromSeg < 8) {
			HNNavPointsLayer.addFeatures(new OL.Feature.Vector(new OL.Geometry.Polygon.createRegularPolygon(new OL.Geometry.LineString([p, closestSeg.closestPoint]).getCentroid(true), 1, 20), {placeId : HnPlace.attributes.id, distance : distanceFromSeg.toFixed(1).replace(".", ","), strokeWidth: 3, Color: color}));
		}
	}
}

function findClosestSegment(mygeometry) {
	var eg = W.map.getExtent().toGeometry();
	var segments = W.model.segments.objects;
	var onScreenSegments = [];
	for (var i in segments) {
		if (eg.intersects(segments[i].getOLGeometry())) {
			onScreenSegments.push(segments[i]);
		}
	}
	var minDistance = Infinity;
	var closestSegment;
	for (var s in onScreenSegments) {
		var segmentType = onScreenSegments[s].attributes.roadType;
		if (segmentType === 10 || segmentType === 16 || segmentType === 18 || segmentType === 19) { //10 ped boardwalk, 16 stairway, 18 railroad, 19 runway
			continue;
		}
		var distanceToSegment = mygeometry.distanceTo(onScreenSegments[s].getOLGeometry(), { details: true });
		if (distanceToSegment.distance < minDistance) {
			minDistance = distanceToSegment.distance;
			closestSegment = onScreenSegments[s];
			closestSegment.closestPoint = new OL.Geometry.Point(distanceToSegment.x1, distanceToSegment.y1);
		}
	}
	return closestSegment;
}

document.addEventListener("wme-map-data-loaded", HNNavPoints_init, {once: true});