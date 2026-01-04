// ==UserScript==
// @name			WME Center Crosshair
// @version			0.1.8
// @author			MajkiiTelini
// @description		Shows crosshair in the middle of WME map
// @match 			https://*.waze.com/*editor*
// @icon			data:image/png;base64,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
// @namespace		https://greasyfork.org/cs/users/110192
// @downloadURL https://update.greasyfork.org/scripts/384700/WME%20Center%20Crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/384700/WME%20Center%20Crosshair.meta.js
// ==/UserScript==

var W;
var OL;
var CrosshairLayer;

function Crosshair_init() {
	W = unsafeWindow.W;
	OL = unsafeWindow.OpenLayers;
	CrosshairLayer = new OL.Layer.Vector("Crosshair Layer", {
		uniqueName: "__CrosshairLayer",
		isBaseLayer: false,
		visibility: true,
		opacity: 1,
	});
	W.map.addLayer(CrosshairLayer);
	W.map.events.register("zoomend", null, drawCrosshair);
	W.map.events.register("moveend", null, drawCrosshair);
	W.map.events.register("move", null, drawCrosshair);
	W.map.events.register("loadend", null, drawCrosshair);
	W.map.events.register("addlayer", null, setZIndex);
	W.map.events.register("removelayer", null, setZIndex);
	drawCrosshair();
}

function drawCrosshair() {
	var point = new OL.Geometry.Point(W.map.getCenter().lon, W.map.getCenter().lat);
	var style = {
		externalGraphic: GM_info.script.icon,
		graphicWidth: 80,
		graphicHeight: 80
	};
	var imageFeature = new OL.Feature.Vector(point, undefined, style);
	CrosshairLayer.destroyFeatures();
	CrosshairLayer.addFeatures([imageFeature]);
	CrosshairLayer.setZIndex(650);
}

function setZIndex() {
	return function() {
		CrosshairLayer.setZIndex(650);
	};
}

document.addEventListener("wme-logged-in", Crosshair_init, {once: true});