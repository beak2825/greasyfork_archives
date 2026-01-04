// ==UserScript==
// @name			WME MapRaid Uttar Pradesh (India)
// @author          Tom 'Glodenox' Puttemans
// @namespace		http://tomputtemans.com
// @description		Shows the editing area involved in the Uttar Pradesh Map Raid in India
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version			1.0
// @grant			none
// @copyright		2018 Glodenox, based on work by 2015 rickzabel, based on work by 2014 davielde
// @downloadURL https://update.greasyfork.org/scripts/40651/WME%20MapRaid%20Uttar%20Pradesh%20%28India%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40651/WME%20MapRaid%20Uttar%20Pradesh%20%28India%29.meta.js
// ==/UserScript==
setTimeout(initMapRaidOverlay, 1000);
var mapLayer,
	displayedArea = false;

function convertPoints(list) {
	return list.map(function(point) {
		return new OL.Geometry.Point(point[0], point[1]).transform(new OL.Projection("EPSG:4326"), Waze.map.getProjectionObject());
	});
}

function addRaidPolygon(raidLayer, groupPoints, color, name) {
	var style = {
		strokeColor: "Pink",
		strokeOpacity: 0.8,
		strokeWidth: 3,
		fillColor: '#FFFFFF', // Doesn't matter, opacity is set to 0
		fillOpacity: 0,
		label: name,
		labelOutlineColor: "Black",
		labelOutlineWidth: 3,
		fontSize: 14,
		fontColor: "Pink",
		fontOpacity: 0.85,
		fontWeight: "bold"
	};

	var ring = new OL.Geometry.LinearRing(convertPoints(groupPoints));
	var polygon = new OL.Geometry.Polygon([ring]);

	var feature = new OL.Feature.Vector(polygon, { name: name }, style);
	raidLayer.addFeatures([feature]);
}

function createLayerToggler(parentGroup, checked, name, toggleCallback) {
	var normalizedName = name.toLowerCase().replace(/\s/g, '');
	var group = document.createElement('li');
	var groupToggler = document.createElement('div');
	groupToggler.className = 'controls-container toggler';
	var groupSwitch = document.createElement('input');
	groupSwitch.id = 'layer-switcher-group_' + normalizedName;
	groupSwitch.className = 'layer-switcher-group_' + normalizedName + ' toggle';
	groupSwitch.type = 'checkbox';
	groupSwitch.checked = checked;
	groupSwitch.addEventListener('click', function() { toggleCallback(groupSwitch.checked); });
	groupToggler.appendChild(groupSwitch);
	var groupLabel = document.createElement('label');
	groupLabel.htmlFor = groupSwitch.id;
	groupLabel.style.display = 'block';
	var groupLabelText = document.createElement('div');
	groupLabelText.className = 'label-text';
	groupLabelText.style.textOverflow = 'ellipsis';
	groupLabelText.style.overflowX = 'hidden';
	groupLabelText.appendChild(document.createTextNode(name));
	groupLabel.appendChild(groupLabelText);
	groupToggler.appendChild(groupLabel);
	group.appendChild(groupToggler);
	if (parentGroup !== null) {
		parentGroup.querySelector('input.toggle').addEventListener('click', function(e) {
			groupSwitch.disabled = !e.target.checked;
			if (toggleCallback) {
				toggleCallback(groupSwitch.checked && e.target.checked);
			}
		});
		parentGroup.querySelector('ul.children').appendChild(group);
	} else {
		group.className = 'group';
		groupToggler.classList.add('main');
		var groupChildren = document.createElement('ul');
		groupChildren.className = 'children';
		group.appendChild(groupChildren);
		document.querySelector('.list-unstyled.togglers').appendChild(group);
	}
	return group;
}

function displayCurrentRaidLocation() {
	var raidMapCenter = Waze.map.getCenter();
	var raidCenterPoint = new OL.Geometry.Point(raidMapCenter.lon, raidMapCenter.lat);
	var locationDiv = document.querySelector('#topbar-container > div > div > div.location-info-region > div');
	var mapRaidDiv = locationDiv.querySelector('strong');
	if (mapRaidDiv === null) {
		mapRaidDiv = document.createElement('strong');
		mapRaidDiv.style.marginLeft = '5px';
		locationDiv.appendChild(mapRaidDiv);
	}

	for (i = 0; i < mapLayer.features.length; i++) {
		if (mapLayer.features[i].geometry.components[0].containsPoint(raidCenterPoint)) {
			mapRaidDiv.textContent = '[MapRaid Region: ' + mapLayer.features[i].attributes.name + ']';
			displayedArea = true;
			return;
		}
	}
	if (displayedArea) {
		mapRaidDiv.textContent = '';
		displayedArea = false;
	}
}

function initMapRaidOverlay() {
	if (typeof Waze === 'undefined' || typeof Waze.map === 'undefined' || typeof Waze.loginManager === 'undefined' || !document.querySelector('#topbar-container > div > div > div.location-info-region > div') || !document.getElementById('layer-switcher-group_display')) {
		setTimeout(initMapRaidOverlay, 800);
		return;
	}
	if (!Waze.loginManager.user) {
		Waze.loginManager.events.register("login", null, initMapRaidOverlay);
		Waze.loginManager.events.register("loginStatus", null, initMapRaidOverlay);
		if (!Waze.loginManager.user) {
			return;
		}
	}

	if (localStorage.MapRaidUttarPradeshVisible === undefined) {
		localStorage.MapRaidUttarPradeshVisible = true;
	}

	createLayerToggler(document.getElementById('layer-switcher-group_display').parentNode.parentNode, localStorage.MapRaidUttarPradeshVisible == "true", 'Map Raid: Uttar Pradesh (India)', function(checked) {
		localStorage.MapRaidUttarPradeshVisible = checked;
		mapLayer.setVisibility(checked);
	});

	mapLayer = new OL.Layer.Vector("Uttar Pradesh (India) MapRaid Regions", {
		uniqueName: "__UttarPradeshMapRaid"
	});

	addRaidPolygon(mapLayer, [
		[77.83146,29.6599],[77.96654,29.72441],[78.15495,29.67498],[78.15306,29.93679],[78.22147,29.96314],[78.94837,29.39947],[78.7671,29.29816],[78.93838,29.13399],[79.05588,29.15176],[79.46208,28.90173],[79.81263,28.87687],[79.972,28.73287],[80.08186,28.81935],[80.43544,28.6022],[80.51797,28.69788],[81.1697,28.36132],[81.85565,27.85094],[82.00261,27.93891],[82.40193,27.67717],[82.68915,27.70387],[82.75214,27.49496],[83.13279,27.44422],[83.4249,27.51401],[83.85981,27.35652],[84.07056,26.9236],[84.2261,26.90287],[84.4072,26.64874],[83.96225,26.51008],[84.18621,26.39462],[84.18559,26.28486],[83.98808,26.20856],[84.63319,25.78335],[84.52417,25.70021],[84.27602,25.64148],[84.14342,25.69456],[83.34595,25.19898],[83.35484,24.87505],[83.52362,24.74635],[83.5231,24.52967],[83.39835,24.49331],[83.45158,24.35368],[83.21563,23.92582],[82.93268,23.9126],[82.66817,24.14058],[82.73441,24.55163],[82.81803,24.5894],[82.71457,24.71777],[82.40968,24.63563],[82.30705,24.63201],[81.57789,25.08454],[81.26312,25.12787],[81.13031,24.9105],[80.76172,24.98331],[80.82026,25.12686],[80.51608,25.01266],[80.29715,25.01207],[80.25471,25.08292],[80.38792,25.17273],[80.28361,25.41447],[79.84043,25.24068],[79.87652,25.14567],[79.33306,25.06921],[79.33065,25.15103],[78.84334,25.18618],[78.95997,25.42654],[78.72753,25.34639],[78.58211,25.40674],[78.54577,25.26201],[78.7237,24.84872],[78.73113,24.6564],[78.8673,24.64656],[78.99509,24.43393],[78.80979,24.22023],[78.34584,24.3189],[78.22389,24.51923],[78.27226,24.62444],[78.15586,24.87114],[78.32486,25.00217],[78.35684,25.20115],[78.25117,25.39783],[78.37054,25.55268],[78.74758,25.64272],[78.72468,25.77086],[78.93043,26.07571],[78.92301,26.23756],[79.06084,26.35508],[78.90713,26.70623],[78.20012,26.82358],[78.16058,26.89731],[77.6788,26.89231],[77.38636,26.7616],[77.39492,26.8787],[77.65295,26.99875],[77.4807,27.08615],[77.62134,27.18567],[77.3221,27.56764],[77.28069,27.80944],[77.47435,27.92979],[77.47997,28.26388],[77.29785,28.56939],[77.33381,28.64443],[77.13203,29.07661],[77.13683,29.41871],[77.06561,29.42485],[77.03545,29.50815],[77.22994,29.97665],[77.61139,30.42474],[77.95554,30.23023],[77.7464,29.97734],[77.83146,29.6599]
	], '#000000', 'Uttar Pradesh');

	Waze.map.addLayer(mapLayer);
	mapLayer.setVisibility(localStorage.MapRaidUttarPradeshVisible == "true");

	var areaJumper = document.getElementById('mapraidDropdown');
	if (!areaJumper) {
		areaJumper = document.createElement('select');
		areaJumper.id = 'mapraidDropdown';
		areaJumper.style.marginTop = '4px';
		areaJumper.style.display = 'block';
		var areaPlaceholder = document.createElement('option');
		areaPlaceholder.textContent = 'Jump to area';
		areaJumper.appendChild(areaPlaceholder);
		areaJumper.addEventListener('change', function() {
			Waze.map.setCenter(areaJumper.selectedOptions[0].centroid);
			areaJumper.selectedIndex = 0;
			areaJumper.blur();
		});
	}
	var areaJumperRegion = document.createElement('optgroup');
	areaJumperRegion.label = 'Uttar Pradesh (Apr 22 - May 6, 2018)';
	mapLayer.features.forEach(function(feature) {
		var area = document.createElement('option');
		area.textContent = feature.attributes.name;
		area.centroid = feature.geometry.getCentroid().toLonLat();
		areaJumperRegion.appendChild(area);
	});
	areaJumper.appendChild(areaJumperRegion);

	if (!document.getElementById('mapraidDropdown')) {
		// Deal with new layout
		if (window.getComputedStyle(document.getElementById('edit-buttons').parentNode).display == 'flex') {
			var areaJumperContainer = document.createElement('div');
			areaJumperContainer.style.flexGrow = '1';
			areaJumperContainer.style.paddingTop = '6px';
			areaJumper.style.width = '80%';
			areaJumper.style.margin = '0 auto';
			areaJumperContainer.appendChild(areaJumper);
			document.getElementById('edit-buttons').parentNode.insertBefore(areaJumperContainer, document.getElementById('edit-buttons'));
		} else {
			document.getElementById('edit-buttons').parentNode.insertBefore(areaJumper, document.getElementById('edit-buttons'));
		}
	}

	displayCurrentRaidLocation();
	Waze.map.events.register("moveend", null, displayCurrentRaidLocation);
	Waze.map.events.register("zoomend", null, displayCurrentRaidLocation);
}
