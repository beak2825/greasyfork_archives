// ==UserScript==
// @id             iitc-plugin-popden
// @name           IITC plugin: popden
// @category       -
// @version        0.3
// @description    population density layer coloring by 2.5 arcminute cells
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @grant          none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/398456/IITC%20plugin%3A%20popden.user.js
// @updateURL https://update.greasyfork.org/scripts/398456/IITC%20plugin%3A%20popden.meta.js
// ==/UserScript==


/*
 * PLUGIN:
 * This plugin overlays population density color coding on your IITC
 * map.  The smallest data unit is arbitrarily called a population
 * "cell".  At maximum zoom (z=10), each cell is 2.5 arc-minutes on each
 * edge; that is 24 cell slices per degree of longitude or of latitude.
 * Cells are aggregated into "tiles" of 24x24 = 576 cells.  At z=10,
 * this is one square degree per tile.  At z=4, the minimum zoom level,
 * it is 24 square degrees per tile.  This aggregation is a performance
 * optimization.  You can zoom further out, but you get the same tiles
 * as at z=4, and performance drops a bit.  Likewise you can zoom in
 * beyond z=10, but performance is already good at this point, and it's
 * already using the smallest available granularity of population data.
 *
 * COLORS/LEGEND:
 * Coloration is done using a color gradient computed with gaussian
 * curves over r, g, b vectors.  The fixed points of the gradient are
 * in the "heatmap" array below.  By default it's [dk gray, blue, red,
 * yellow, white].
 *
 * Worldwide the single-cell maximum population is around 1.5 million.
 * In the United States the maximum cell population is around 460,000.
 * The worldwide mean is 204, and the worldwide median is 0.  In order
 * to keep the color legend meaningful, therefore, there is NO ABSOLUTE
 * DEFINITION of color/population correspondence.  Instead, for each map
 * view, the maximum cell population among all visible cells is used
 * as the baseline, and all other cells are colored according to their
 * percentage of this viewport maximum.  Drag the map or change zoom and
 * you will probably see colors shift accordingly.
 *
 * DATA:
 * Data is loaded on demand over the network, and cached in your
 * browser.  The data files were created by the author of this plugin
 * through a reduction of the standard GPWv3 world population data
 * (see citation/copyright below).  Original source data is simply
 * an array of [8640, 3432] representing population within each 2.5
 * arc-minute cell.  It has been broken out into aggregated tiles based
 * on zoom level (see above), with further per-tile metadata inserted
 * and the whole converted to JSON. The expected format of data is not
 * documented except implicitly by this code.
 */

/*
 * Details concerning the Gridded Population of the World Version 3
 * (GPWv3) Population Grids data:
 *
 * CITATION:
 * Center for International Earth Science Information Network (CIESIN),
 * Columbia University; and Centro Internacional de Agricultura
 * Tropical (CIAT). 2005.  Gridded Population of the World Version 3
 * (GPWv3): Population Grids. Palisades, NY: Socioeconomic Data and
 * Applications Center (SEDAC), Columbia University.  Available at
 * http://sedac.ciesin.columbia.edu/gpw. (date of download).
 *
 * COPYRIGHT:
 * The Trustees of Columbia University in the City of New York and the
 * Centro Internacional de Agricultura Tropical (CIAT) hold the copyright
 * of this dataset.
 */

function wrapper(plugin_info) {
	// ensure plugin framework is there, even if iitc is not yet loaded
	if(typeof window.plugin !== 'function') window.plugin = function() {};


// PLUGIN START

// use own namespace for plugin
window.plugin.popden = function() {};
var popden = window.plugin.popden;

popden.log = function (obj) {
	console.log('popden: ' + obj);
};

// define color gradient
var heatmap = [
	[0.0, [0.25, 0.25, 0.25]],	// dk gray
	[0.25, [0.25, 0.25, 0.75]], // blue
	[0.50, [0.75, 0.25, 0.25]], // red
	[0.75, [0.75, 0.75, 0.25]], // yellow
	[1.00, [1.0, 1.0, 1.0]],	// white
];

// Map data constants
var dataversion = "0.2.2";
var latmin = -58;
var lngmin = -180;
var maxzoom = 10;
var minzoom = 4;

// draw boundaries around population cells?
//var drawborders = false;
var drawborders = true;

function getlocalstorage () {
	try {
		return 'localStorage' in window && window.localStorage || null;
	} catch (e) {
		return null;
	}
}

// load leaflet label plugin
function loadJS(urilist, onload) {
	var scripts = 0;
	function _() {
		scripts--;
	}
	for (var i = 0; i < urilist.length; i++) {
		var script = document.createElement("script");
		scripts++;
		script.type = "text/javascript";
		script.src = urilist[i];
		script.onreadystatechange = _;
		script.onload = _;
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	var timer = setInterval(function () {
		if (scripts === 0) {
			popden.log('loadJS: all scripts loaded');
			clearInterval(timer);
			onload();
		}
	}, 100);
}

function loadstorage() {
	var storage = getlocalstorage();
	if (storage === null)
		return {};
    if (storage['plugin-popden']) {
		var data = JSON.parse(storage['plugin-popden']);
        if (data.version != dataversion) {
            // invalidate cached data
            popden.log('invalidating data: v' + data.version + ' -> v' + dataversion);
            return {version: dataversion};
        }
        return data;
    }
	return {};
}

function savestorage(data) {
	var storage = getlocalstorage();
	if (storage === null)
		return;
	storage['plugin-popden'] = JSON.stringify(data);
	return;
}

var _old_heatmap = [
	[0.0, [0, 0, 0]],
	[0.20, [0, 0, 0.5]],
	[0.40, [0, 0.5, 0]],
	[0.60, [0.5, 0, 0]],
	[0.80, [0.75, 0.75, 0]],
	[0.90, [1.0, 0.75, 0]],
	[1.00, [1.0, 1.0, 1.0]],
];

// computes a multi-stage gaussian color gradient across each color point in map.
// spread is a multiplier on the x axis of the gaussian curve. width is how many
// sampled color points to return.
function gradient(map, spread, width) {
	if (spread === null)
		spread = 1;
	if (width === null)
		width = 100;

	function gaussian(x, a, b, c) {
		d = 0;
		return a * Math.exp(-Math.pow(x - b, 2) / (2 * Math.pow(c, 2))) + d;
	}

	function apply(x, f) {
		var sum = 0;
		for (var i = 0; i < map.length; i++) {
			point = map[i];
			sum += gaussian(x, f(point[1]), point[0] * width,
							width/(spread * map.length));
		}
		return sum;
	}

	function interval(x) {
		r = apply(x, function(point) {return point[0];});
		g = apply(x, function(point) {return point[1];});
		b = apply(x, function(point) {return point[2];});
		return [Math.min(1.0, r), Math.min(1.0, g), Math.min(1.0, b)];
	}

	function rgbtohex(r,g,b) {
		return Number(0x1000000 + r*0x10000 + g*0x100 + b).toString(16).substring(1);
	}

	var colors = [];
	for (var i = 0; i < width; i++) {
		rgb = interval(i);
		rgb = [parseInt(rgb[0] * 255), parseInt(rgb[1] * 255), parseInt(rgb[2] * 255)];
		rgb = '#' + rgbtohex(rgb[0], rgb[1], rgb[2]);
		colors.push(rgb);
	}
	return colors;
}
var colors = gradient(heatmap, 1, 100);

var _setup = function () {
	var plugin = window.plugin.popden;

	plugin.isSelected = false;
	plugin.storage = loadstorage();
	if (!plugin.storage.tiles)
		plugin.storage.tiles = {};

	plugin.baseURL = "https://d2s5zx5h5rs73.cloudfront.net/popden/" + dataversion + "/celldata-z";

	plugin.layergroup = new L.LayerGroup();
	window.addLayerGroup('Population Cells', plugin.layergroup, true);

    $("<style>")
    .prop("type", "text/css")
    .html(".plugin-popden-data {\
             font-size: 13px;\
             color: #000;\
             opacity: 0.7;\
             text-align: center;\
             pointer-events: none;\
          }")
  .appendTo("head");

    // Create a div for population density info, and attach it above the update status area
    plugin.info = $('<div id="popden">');
    $('#updatestatus').prepend(plugin.info);
    plugin.info.html('<b>Population Cell</b>:<br/><b>Population</b>:');

    // #updatestatus isn't really prepared for more inner divs - it expects only #innerstatus.
    // Fix this.
    var css = $('<style type="text/css">');
    css.html('#updatestatus > div { padding: 4px; border-bottom: 1px solid #20A8B1; } #updatestatus {padding: inherit;}');
    css.appendTo("head");

	function update () {
		popden.log("all tiles loaded; updating viewport");
		plugin.layergroup.clearLayers();

		// set viewport max to 0, then calculate vmax across all visible cells
		// this probably gets a bit wonky around the international date line.
		var vmax = 0;
        var vmin = Math.pow(2,31);
		for (var tile = 0; tile < plugin.tiledata.length; tile++) {
			data = plugin.tiledata[tile];
			for (y = 0; y < data.data.length; y++) {
				for (x = 0; x < data.data[0].length; x++) {
					var south = data.bottom + (y * data.incr);
					var west = data.left + (x * data.incr);
					var north = data.bottom + ((y+1) * data.incr);
					var east = data.left + ((x+1) * data.incr);
					// is this cell outside visible area?
					if (east < plugin.west)
						continue;
					if (west > plugin.east)
						continue;
					if (north < plugin.south)
						continue;
					if (south > plugin.north)
						continue;
					// cell must overlap viewport at least partially
					vmax = Math.max(vmax, data.lmax);
					vmin = Math.min(vmin, data.lmin);
				}
			}
		}

		for (var tile = 0; tile < plugin.tiledata.length; tile++) {
			data = plugin.tiledata[tile];
			for (y = 0; y < data.data.length; y++) {
				for (x = 0; x < data.data[0].length; x++) {
					var bounds = [
						[data.bottom + (y * data.incr), data.left + (x * data.incr)],
						[data.bottom + ((y+1) * data.incr), data.left + ((x+1) * data.incr)],
					];

					var popratio = parseInt(100 * ((data.data[y][x]-vmin)/(vmax-vmin)));

					var options = {
						fill: true,
						fillColor: colors[popratio-1],
						fillOpacity: 0.30,
						//color: '#fff',
						//opacity: 0.20,
						color: colors[popratio-1],
						opacity: 0.50,
						weight: 1,
						stroke: drawborders,
					};
					var rect = L.rectangle(bounds, options).addTo(plugin.layergroup);
					var lat = data.bottom + (y * data.incr);
					var lng = data.left + (x * data.incr);
					var latlng = sprintf("%.2f, %.2f", lat, lng);
					//var label = sprintf("Coordinates: %s<br/>Population: %d/%d (%d%%)<br/>", latlng, data.data[y][x], vmax, popratio);
					//rect.bindLabel(label);
                    var center = L.latLng((bounds[0][0] + bounds[1][0])/2, (bounds[0][1] + bounds[1][1])/2);
                    var marker = L.marker(center, {
                        icon: L.divIcon({
                        className: 'plugin-popden-data',
                        iconAnchor: [100,5],
                        iconSize: [200,10],
                        html: data.data[y][x],
                        })
                    });
                    plugin.layergroup.addLayer(marker);
                    var label = sprintf("<b>Population Cell</b>: %s<br/><b>Population</b>: %s (highest %s; %d%%)", latlng, data.data[y][x].toLocaleString(), vmax.toLocaleString(), popratio);
                    var f = (function (label) {
                        rect.on({mouseover: function (e) {
                            $('#popden').html(label);
                        }});
                    })(label);
				}
			}
		}
	}

	function _addtile (data) {
		// called when a tile's data is available
		//popden.log(data);
		plugin.tiledata.push(data);
		plugin.vmax = Math.max(plugin.vmax, data.lmax);

		// if we have all tiles now, update the map
		if (plugin.tiledata.length >= Object.keys(plugin.tilenames).length)
			update();
		else
			popden.log("loaded " + plugin.tiledata.length + "/" + Object.keys(plugin.tilenames).length + " tiles");
	}

	// chunksz is how many 2.5-minute slices are aggregated into one cell
	// at the given zoom level. Because all tiles are 24 cells square, and
	// because 24 x 2.5 min = 1 deg, chunksz is -also- the number of degrees
	// in one tile.
	function chunksz(zoom) {
		if (zoom == 10) return 1;
		if (zoom == 9) return 2;
		if (zoom == 8) return 3;
		if (zoom == 7) return 6;
		if (zoom == 6) return 8;
		if (zoom == 5) return 12;
		if (zoom == 4) return 24;
	}

	function tilename(lat, lng, zoom) {
		if (zoom > maxzoom)
			zoom = maxzoom;
		if (zoom < minzoom)
			zoom = minzoom;
		var chunk = chunksz(zoom);
		lat = Math.floor((lat - latmin) / chunk) * chunk + latmin;
		lng = Math.floor((lng - lngmin) / chunk) * chunk + lngmin;
		return sprintf("%d/%d,%d", zoom, lat, lng);
	}

	function addpoptile (name) {
		if (name in plugin.storage.tiles) {
			popden.log('tile ' + name + ' from storage');
			return _addtile(plugin.storage.tiles[name]);
		}
		//popden.log('retrieving tile ' + name);
		jQuery.ajax({
			url: plugin.baseURL + name + ".json",
			dataType: "json",
			success: function (data) {
				popden.log('tile ' + name + ' from http');
				plugin.storage.tiles[name] = data;
				savestorage(plugin.storage);
				_addtile(data);
			},
		});
	}

	function reposition () {
		popden.log('repositioning');
		plugin.zoom = parseInt(map.getZoom());
		if (plugin.zoom < minzoom)
			plugin.zoom = minzoom;
		if (plugin.zoom > maxzoom)
			plugin.zoom = maxzoom;

		plugin.bounds = window.map.getBounds();
		plugin.tilenames = {};
		plugin.tiledata = [];
		plugin.vmax = 0;  /* max pop in viewport tiles */
		plugin.north = Math.floor(plugin.bounds.getNorth());
		plugin.south = Math.floor(plugin.bounds.getSouth());
		plugin.west = Math.floor(plugin.bounds.getWest());
		plugin.east = Math.floor(plugin.bounds.getEast());
		for (var lat = plugin.south; lat <= plugin.north; lat++) {
			for (var lng = plugin.west; lng <= plugin.east; lng++) {
				var name = tilename(lat, lng, plugin.zoom);
				plugin.tilenames[name] = 1;
			}
		}
		for (var name in plugin.tilenames)
			addpoptile(name);
	}
	window.addHook('mapDataRefreshStart', reposition);

	return;
}


var setup = function() {
	loadJS(['https://cdn.rawgit.com/alexei/sprintf.js/master/dist/sprintf.min.js',
            // Not currently using Leaflet Labels ...
	        //'https://cdn.rawgit.com/Leaflet/Leaflet.label/master/src/Label.js',
			//'https://cdn.rawgit.com/Leaflet/Leaflet.label/master/src/BaseMarkerMethods.js',
			//'https://cdn.rawgit.com/Leaflet/Leaflet.label/master/src/Marker.Label.js',
			//'https://cdn.rawgit.com/Leaflet/Leaflet.label/master/src/CircleMarker.Label.js',
			//'https://cdn.rawgit.com/Leaflet/Leaflet.label/master/src/Path.Label.js',
			//'https://cdn.rawgit.com/Leaflet/Leaflet.label/master/src/Map.Label.js',
			//'https://cdn.rawgit.com/Leaflet/Leaflet.label/master/src/FeatureGroup.Label.js',
           ],
	       _setup);
};

// PLUGIN END


	//add the script info data to the function as a property
	setup.info = plugin_info;

	if (!window.bootPlugins) window.bootPlugins = [];
	window.bootPlugins.push(setup);

	// if IITC has already booted,	immediately run the 'setup' function
	if (window.iitcLoaded && typeof setup === 'function') setup();
}; // wrapper end

// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script)
	info.script = {
		version: GM_info.script.version,
		name: GM_info.script.name,
		description: GM_info.script.description
	};
	script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);

