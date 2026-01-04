// ==UserScript==
// @id             iitc-plugin-waypoints
// @name           IITC plugin: Waypoints
// @category       Layer
// @version        0.0.1
// @author         Nobody
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @description    Creates paths of waypoints to plan ingress actions in more detail
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/35561/IITC%20plugin%3A%20Waypoints.user.js
// @updateURL https://update.greasyfork.org/scripts/35561/IITC%20plugin%3A%20Waypoints.meta.js
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = function () {};

    // PLUGIN START ////////////////////////////////////////////////////////

	window.plugin.waypoints = function () {};

	window.plugin.waypoints.portalAdded = function (data) {
		// Marker is in data.portal
		// Adding the on click callback for recording the clicks on making the waypoint map
		data.portal.on('click', function (marker) {
			window.plugin.waypoints.onPortalClick(marker);
		});
	}

	window.plugin.waypoints.onPortalClick = function(marker) {
		if (false == window.plugin.waypoints.recording) {
			// Skipping, only interesting when we record
			return;
		}

		// Saving the relevant data in out own store, so the user can move the map, zoom how they want and
		// keep all the data present
		//console.log(marker);

		var guid = marker.target.options.guid;
		var data = marker.target.options.data;

		if (!window.plugin.waypoints.pointData[guid]) {
			// Not yet added
			window.plugin.waypoints.pointData[guid] = data;
		}

		// This is an array, so we keep them this way to preserve the order The object is just to keep the data
		window.plugin.waypoints.points.push(guid);

		//console.log('Added waypoint ' + data.title);

		window.plugin.waypoints.updateWaypointLayer();
	}

	window.plugin.waypoints.updateWaypointLayer = function() {
		var count = window.plugin.waypoints.points.length;

		if (count == 0) {
			return; // nothing to do
		}

		var latlngs = [];
		for (var i = 0; i < count; ++i) {
			var guid = window.plugin.waypoints.points[i];
			var data = window.plugin.waypoints.pointData[guid];
			var latlng = new L.LatLng((data.latE6 / 1E6), (data.lngE6 / 1E6));

			latlngs.push(latlng);
		}

		if (null != window.plugin.waypoints.waypointsLayer) {
			// Remove it
			window.map.removeLayer(window.plugin.waypoints.waypointsLayer);
			window.plugin.waypoints.waypointsLayer = null;
		}

		var options = {
			lineCap: 'round',
			clickable: false,
			opacity: 0.8,
			weight: 6,
			color: '#FF0000'
		};

		window.plugin.waypoints.waypointsLayer = L.polyline(latlngs, options).addTo(map);
		window.plugin.waypoints.waypointsLayer.addTo(window.plugin.waypoints.waypointsLayerGroup);
	}

	window.plugin.waypoints.controls = L.Control.extend({
		options: {
			position: 'topleft'
		},
		initialize: function (foo, options) {
			L.Util.setOptions(this, options);
		},
		onAdd: function (map) {
			// Container
			var container = L.DomUtil.create('div', window.plugin.waypoints.CONTROLS_CONTAINER);

			var controls = '<button id="' + window.plugin.waypoints.CONTROLS_RECORD + '" onclick="window.plugin.waypoints.record();return false;">Record</button> <button onclick="window.plugin.waypoints.dump();return false;">Dump</button> <button onclick="window.plugin.waypoints.clear();return false;">Clear</button>';
			$(container).html(controls);

			return container;
		}
	});

	window.plugin.waypoints.toggleControl = function () {
		if (map.hasLayer(window.plugin.waypoints.waypointsLayerGroup)) {
			$('.' + window.plugin.waypoints.CONTROLS_CONTAINER).show();
		} else {
			window.plugin.waypoints.recording = false; // Disable recording when hiding layer
			$('.' + window.plugin.waypoints.CONTROLS_CONTAINER).hide();
		}
	}

	window.plugin.waypoints.record = function () {
		if (true == window.plugin.waypoints.recording) {
			// We are recording, so now this means, stop recording
			window.plugin.waypoints.recording = false;
			$('#' + window.plugin.waypoints.CONTROLS_RECORD).html('Record');
		} else {
			// Not recording, so now we DO record
			window.plugin.waypoints.recording = true;
			$('#' + window.plugin.waypoints.CONTROLS_RECORD).html('Stop');
		}
	}

	window.plugin.waypoints.dump = function () {
		var points = [];
		var count = window.plugin.waypoints.points.length;

		for (var i = 0; i < count; ++i) {
			var guid = window.plugin.waypoints.points[i];
			var data = window.plugin.waypoints.pointData[guid];
			var point = { "longitude": data.lngE6 / 1E6, "latitude": data.latE6 / 1E6, "name": data.title };

			points.push(point);
		}

		alert(JSON.stringify(points));
	}

    window.plugin.waypoints.clear = function () {
        window.plugin.waypoints.pointData = {};
        window.plugin.waypoints.points = [];

        if (null != window.plugin.waypoints.waypointsLayer) {
            // Remove it
            window.map.removeLayer(window.plugin.waypoints.waypointsLayer);
            window.plugin.waypoints.waypointsLayer = null;
        }
    }

    // Setup, is run by IITC at start of the script
    var setup = function () {
	    // Constants
	    window.plugin.waypoints.CONTROLS_CONTAINER = 'nbdy-waypoints-control-container';
	    window.plugin.waypoints.CONTROLS_RECORD = 'nbdy-waypoints-control-record';

	    // Variables
	    window.plugin.waypoints.recording = false;
	    window.plugin.waypoints.waypointsLayer = null;

	    window.plugin.waypoints.waypointsLayerGroup = new L.LayerGroup();
	    window.addLayerGroup('Waypoints', window.plugin.waypoints.waypointsLayerGroup, false);

	    // Add the controls
	    window.map.addControl(new window.plugin.waypoints.controls('bar'));
	    window.map.on('overlayadd overlayremove', window.plugin.waypoints.toggleControl);
	    // Make sure its visible, or not.
	    window.plugin.waypoints.toggleControl();

	    window.plugin.waypoints.clear();

	    // When portals are added to hte map, this hook will capture the click, so it can be used on recording points
	    window.addHook('portalAdded', window.plugin.waypoints.portalAdded);
    };
    // PLUGIN END //////////////////////////////////////////////////////////

    setup.info = plugin_info;
    //add the script info data to the function as a property
    if (!window.bootPlugins) window.bootPlugins = [
    ];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function') setup();
}
// wrapper end
// inject code into site context

var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
};
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);