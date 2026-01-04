// ==UserScript==
// @name			WME RRX Distancer
// @version			0.1.8
// @author			MajkiiTelini
// @description		Shows distances to closest rail and nonrail segments from RailRoad Crossing object in WME
// @match			https://*.waze.com/*editor*
// @run-at			document-end
// @namespace		https://greasyfork.org/cs/users/110192
// @downloadURL https://update.greasyfork.org/scripts/400251/WME%20RRX%20Distancer.user.js
// @updateURL https://update.greasyfork.org/scripts/400251/WME%20RRX%20Distancer.meta.js
// ==/UserScript==

var W;
var OL;
var I18n;
var RRXDistancerLayer;
var layerTogglers = {};
var oldVenuesId = [];
const maxZoom = 17;
const colorTooClose = "red";
const colorOk = "greenYellow";
const colorTooFar = "deepSkyBlue";

function RRXDistancer_init() {
	W = unsafeWindow.W;
	OL = unsafeWindow.OpenLayers;
	I18n = unsafeWindow.I18n;

	RRXDistancerLayer = new OL.Layer.Vector("RRX Distancer Layer", {
		displayInLayerSwitcher: true,
		uniqueName: "__RRXDistancerLayer",
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
	var displayGroupSelector = document.getElementById("layer-switcher-group_road");
	if (displayGroupSelector !== null) {
		layerTogglers.rrxDistancer = addLayerToggler(displayGroupSelector, RRXDistancerLayer, "rrxDistancer", "RailRoad Crossings Distancer");
	}
	W.map.addLayer(RRXDistancerLayer);
	window.addEventListener("beforeunload", function() {
		if (localStorage) {
			var options = {};
			for (var key in layerTogglers) {
				options[key] = document.getElementById(layerTogglers[key].htmlItem).checked;
			}
			localStorage.WMERRXDistancer = JSON.stringify(options);
		}
	}, false);
	if (localStorage.WMERRXDistancer) {
		var options = JSON.parse(localStorage.WMERRXDistancer);
		for (var key in layerTogglers) {
			document.getElementById(layerTogglers[key].htmlItem).checked = options[key];
			layerTogglers[key].layer.setVisibility(options[key] && !document.getElementById(layerTogglers[key].htmlItem).disabled && W.map.zoom >= maxZoom);
		}
	}
	W.map.events.register("zoomend", null, requestRRXs);
	W.map.events.register("moveend", null, requestRRXs);
	W.model.events.register("mergeend", null, requestRRXs);
	//W.map.events.register("loadend", null, requestRRXs);
	W.model.actionManager.events.register("afterclearactions", null, requestRRXs);
	W.model.actionManager.events.register("afteraction", null, requestRRXs);
	W.model.actionManager.events.register("afterundoaction", null, requestRRXs);
	W.model.actionManager.events.register("noActions", null, requestRRXs);
	W.accelerators.events.register("reloadData", null, requestRRXs);
	requestRRXs();
}

function addLayerToggler(groupCheckbox, layer, checkboxId, text) {
	var layerToggler = {};
	layerToggler.htmlItem = "layer-switcher-item_rrxdistancer_" + checkboxId;
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
		requestRRXs();
	};
}

function layerTogglerGroupEventHandler(checkbox, layer) {
	return function() {
		layer.setVisibility(this.checked && checkbox.checked && W.map.zoom >= maxZoom);
		checkbox.disabled = !this.checked;
		requestRRXs();
	};
}

function requestRRXs(e) {
	//console.warn("RRX Distancer event type: " + e.type);
	RRXDistancerLayer.setVisibility(document.getElementById(layerTogglers.rrxDistancer.htmlItem).checked && !document.getElementById(layerTogglers.rrxDistancer.htmlItem).disabled && W.map.zoom >= maxZoom);
	if (!RRXDistancerLayer.getVisibility()) {
		return;
	}
	var eg = W.userscripts.toOLGeometry(W.map.getExtentPolygon().geometry);
	var objVenues = W.model.railroadCrossings.objects;
	var actVenuesId = Object.keys(objVenues).filter(function(key) {
		if (eg.intersects(objVenues[key].getOLGeometry())) {
			return key;
		}
	}).map(function (key) {
		return key;
	});
	var releasedVenuesId = oldVenuesId.filter(function(key) {return actVenuesId.indexOf(key) < 0;});
	releasedVenuesId.forEach(function(j) {
		RRXDistancerLayer.removeFeatures(RRXDistancerLayer.getFeaturesByAttribute("rrxId", releasedVenuesId[j]));
	});
	actVenuesId.forEach(function(j) {
		drawLine(objVenues[j].attributes);
	});
	oldVenuesId = actVenuesId;
}

function drawLine(RRX) {
	RRXDistancerLayer.removeFeatures(RRXDistancerLayer.getFeaturesByAttribute("rrxId", RRX.id));
	var p = RRX.geometry;
	var closestSeg = findClosestSegment(p, true);
	if (closestSeg !== undefined) {
		var distanceFromSeg = new OL.Geometry.LineString([p, closestSeg.closestPoint]).getGeodesicLength(new OL.Projection("EPSG:3857"));
		if (distanceFromSeg < 50) {
			var color = distanceFromSeg < 4 ? colorTooClose : distanceFromSeg > 6 ? colorTooFar : colorOk;
			var lineString = new OL.Geometry.LineString([p, closestSeg.closestPoint]);
			var lineFeature = new OL.Feature.Vector(lineString, {rrxId : RRX.id}, {strokeWidth: 4, strokeColor: "black", strokeOpacity: 0.5, strokeDashstyle: "dash", strokeDashArray: "8, 8"});
			RRXDistancerLayer.addFeatures(lineFeature);
			lineString = new OL.Geometry.LineString([p, closestSeg.closestPoint]);
			lineFeature = new OL.Feature.Vector(lineString, {rrxId : RRX.id}, {strokeWidth: 2, strokeColor: color, strokeOpacity: 1, strokeDashstyle: "dash", strokeDashArray: "8, 8"});
			RRXDistancerLayer.addFeatures(lineFeature);
			RRXDistancerLayer.addFeatures(new OL.Feature.Vector(new OL.Geometry.Polygon.createRegularPolygon(new OL.Geometry.LineString([p, closestSeg.closestPoint]).getCentroid(true), 1, 20),
																{rrxId : RRX.id, distance : distanceFromSeg.toFixed(1).replace(".", ","), strokeWidth: 3, Color: color}));
			var closestSeg2 = findClosestSegment(p, false, closestSeg.attributes.level);
			if (closestSeg2 !== undefined) {
				distanceFromSeg = new OL.Geometry.LineString([p, closestSeg2.closestPoint]).getGeodesicLength(new OL.Projection("EPSG:3857"));
				if ([2, 4, 6, 7].includes(closestSeg2.attributes.roadType)) {
					color = distanceFromSeg < 9 ? colorTooClose : distanceFromSeg > 11 ? colorTooFar : colorOk;
				} else {
					color = distanceFromSeg < 5 ? colorTooClose : distanceFromSeg > 7 ? colorTooFar : colorOk;
				}
				lineString = new OL.Geometry.LineString([p, closestSeg2.closestPoint]);
				lineFeature = new OL.Feature.Vector(lineString, {rrxId : RRX.id}, {strokeWidth: 4, strokeColor: "black", strokeOpacity: 0.5, strokeDashstyle: "dash", strokeDashArray: "8, 8"});
				RRXDistancerLayer.addFeatures(lineFeature);
				lineString = new OL.Geometry.LineString([p, closestSeg2.closestPoint]);
				lineFeature = new OL.Feature.Vector(lineString, {rrxId : RRX.id}, {strokeWidth: 2, strokeColor: color, strokeOpacity: 1, strokeDashstyle: "dash", strokeDashArray: "8, 8"});
				RRXDistancerLayer.addFeatures(lineFeature);
				RRXDistancerLayer.addFeatures(new OL.Feature.Vector(new OL.Geometry.Polygon.createRegularPolygon(new OL.Geometry.LineString([p, closestSeg2.closestPoint]).getCentroid(true), 1, 20),
																	{rrxId : RRX.id, distance : distanceFromSeg.toFixed(1).replace(".", ","), strokeWidth: 3, Color: color}));
			}
		}
	}
}

function findClosestSegment(mygeometry, isRail, levelToAvoid = 0) {
	var eg = W.userscripts.toOLGeometry(W.map.getExtentPolygon().geometry);
	var segments = W.model.segments.objects;
	var onScreenSegments = [];
	for (var i in segments) {
		if (eg.intersects(segments[i].getOLGeometry())) {
			onScreenSegments.push(segments[i]);
		}
	}
	var minDistance = Infinity;
	var closestSegment = null;
	for (var s in onScreenSegments) {
		var segmentType = onScreenSegments[s].attributes.roadType;
		if (!isRail && (![1, 2, 4, 6, 7, 8, 17, 20, 22].includes(segmentType) || onScreenSegments[s].attributes.level !== levelToAvoid)) { // 1 street, 2 primary street, 4 ramp, 6 major highway, 7 minor highway, 8 dirt road, 17 private road, 20 parking lot, 22 narrow street
			continue;
		}
		if (isRail && segmentType !== 18) { // 18 railroad
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

document.addEventListener("wme-map-data-loaded", RRXDistancer_init, {once: true});