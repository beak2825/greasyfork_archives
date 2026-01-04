// ==UserScript==
// @name			WME MapRaid Regions Turkey
// @author          Tom 'Glodenox' Puttemans
// @namespace		http://tomputtemans.com
// @description		Shows the regions in the Turkey map raid
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version			2.3
// @grant			none
// @copyright		2017 Glodenox, based on work by 2015 rickzabel, based on work by 2014 davielde
// @downloadURL https://update.greasyfork.org/scripts/33497/WME%20MapRaid%20Regions%20Turkey.user.js
// @updateURL https://update.greasyfork.org/scripts/33497/WME%20MapRaid%20Regions%20Turkey.meta.js
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
	var polygon = new OL.Geometry.Polygon([ ring ]);

	var feature = new OL.Feature.Vector(polygon, { name: name }, style);
	raidLayer.addFeatures([ feature ]);
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

	if (localStorage.MapRaidTurkeyVisible === undefined) {
		localStorage.MapRaidTurkeyVisible = true;
	}

	createLayerToggler(document.getElementById('layer-switcher-group_display').parentNode.parentNode, localStorage.MapRaidTurkeyVisible == "true", 'Map Raid: Turkey', function(checked) {
		localStorage.MapRaidTurkeyVisible = checked;
		mapLayer.setVisibility(checked);
	});

	mapLayer = new OL.Layer.Vector("Turkey MapRaid Regions", {
		uniqueName: "__TurkeyMapRaid"
	});

	addRaidPolygon(mapLayer, [
		[42.69561767578125,39.549059262117225],[43.010101318359375,39.76263058076128],[43.497716188430786,39.67894097730899],[43.43128893524408,39.204610728388005],[42.620661333203316,39.417696096875744],[42.69561767578125,39.549059262117225]
	], '#000000', 'Zone 1');
	addRaidPolygon(mapLayer, [
		[43.497716188430786,39.67894097730899],[44.004364013671875,39.5919321362032],[44.25567626953125,39.095962936305476],[44.29846487939358,38.975942418124326],[43.43128893524408,39.204610728388005],[43.497716188430786,39.67894097730899]
	], '#000000', 'Zone 2');
	addRaidPolygon(mapLayer, [
		[42.620661333203316,39.417696096875744],[43.43128893524408,39.204610728388005],[43.36888633668423,38.75509005308555],[42.38730479031801,39.00714958747274],[42.620661333203316,39.417696096875744]
	], '#000000', 'Zone 3');
	addRaidPolygon(mapLayer, [
		[43.43128893524408,39.204610728388005],[44.29846487939358,38.975942418124326],[44.35455322265625,38.81831117374662],[44.489366076886654,38.46627354266224],[43.36888633668423,38.75509005308555],[43.43128893524408,39.204610728388005]
	], '#000000', 'Zone 4');
	addRaidPolygon(mapLayer, [
		[42.38730479031801,39.00714958747274],[43.36888633668423,38.75509005308555],[43.3322748541832,38.490036313376024],[43.435463793575764,38.224909322395355],[42.12787080556154,38.54790520111358],[42.38730479031801,39.00714958747274]
	], '#000000', 'Zone 5');
	addRaidPolygon(mapLayer, [
		[43.36888633668423,38.75509005308555],[44.489366076886654,38.46627354266224],[44.53857421875,38.33734763569316],[44.32854317128658,38.00347620947195],[43.435463793575764,38.224909322395355],[43.3322748541832,38.490036313376024],[43.36888633668423,38.75509005308555]
	], '#000000', 'Zone 6');
	addRaidPolygon(mapLayer, [
		[42.12787080556154,38.54790520111358],[43.435463793575764,38.224909322395355],[43.635060377418995,37.70932128214528],[42.73123741149902,37.903477608621344],[42.60772705078125,38.06971703320484],[42.08930969238281,38.479394673276474],[42.12787080556154,38.54790520111358]
	], '#000000', 'Zone 7');
	addRaidPolygon(mapLayer, [
		[43.435463793575764,38.224909322395355],[44.32854317128658,38.00347620947195],[44.28863525390625,37.93986540897977],[44.67864990234375,37.72293542866175],[44.63932603597641,37.49316143117623],[43.635060377418995,37.70932128214528],[43.435463793575764,38.224909322395355]
	], '#000000', 'Zone 8');
	addRaidPolygon(mapLayer, [
		[42.73123741149902,37.903477608621344],[43.635060377418995,37.70932128214528],[43.846435546875,37.1570331488852],[42.762908935546875,37.32430451813815],[42.83294677734375,37.76637243960179],[42.73123741149902,37.903477608621344]
	], '#000000', 'Zone 9');
	addRaidPolygon(mapLayer, [
		[43.635060377418995,37.70932128214528],[44.63932603597641,37.49316143117623],[44.63470458984375,37.46613860234406],[44.85992431640625,37.3002752813443],[44.809112548828125,37.13842453422676],[44.636077880859375,37.16469418870222],[44.290008544921875,36.92793899776678],[44.119720458984375,37.08969207312267],[44.235076904296875,37.196424509917655],[44.034576416015625,37.289350362163624],[43.846435546875,37.1570331488852],[43.635060377418995,37.70932128214528]
	], '#000000', 'Zone 10');
	Waze.map.addLayer(mapLayer);
	mapLayer.setVisibility(localStorage.MapRaidTurkeyVisible == "true");

	var areaJumper = document.getElementById('mapraidDropdown');
	if (!areaJumper) {
		areaJumper = document.createElement('select');
		areaJumper.id = 'mapraidDropdown';
		areaJumper.style.marginTop = '4px';
		areaJumper.style.display = 'block';
		var areaPlaceholder = document.createElement('option');
		areaPlaceholder.textContent = 'Jump to Map Raid area';
		areaJumper.appendChild(areaPlaceholder);
		areaJumper.addEventListener('change', function() {
			Waze.map.setCenter(areaJumper.selectedOptions[0].centroid);
			areaJumper.selectedIndex = 0;
			areaJumper.blur();
		});
	}
	var areaJumperRegion = document.createElement('optgroup');
	areaJumperRegion.label = 'Turkey (Oct 15 - Oct 23, 2017)';
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
