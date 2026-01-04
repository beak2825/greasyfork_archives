// ==UserScript==
// @name			WME Thailand
// @author          Tom 'yo' Puttemans
// @namespace		http://tomputtemans.com
// @description		Shows the regions in the Thailand
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version			1.0
// @grant			none
// @copyright		2018 G, based on work by 2015 rickzabel, based on work by 2014 davielde
// @downloadURL https://update.greasyfork.org/scripts/368886/WME%20Thailand.user.js
// @updateURL https://update.greasyfork.org/scripts/368886/WME%20Thailand.meta.js
// ==/UserScript==
setTimeout(initMapRaidOverlay, 1000);
var mapLayer,
	displayedArea = false;

function convertPoints(list) {
	return list.map(function(point) {
		return new OL.Geometry.Point(point[0], point[1]).transform(new OL.Projection("EPSG:4326"), Waze.map.getProjectionObject());
	});
}

function addRaidPolygon(raidLayer, groupPoints, groupcolor, name) {
	var style = {
		strokeColor: "Pink",
		strokeOpacity: 0.8,
		strokeWidth: 3,
		fillColor: groupcolor,
        fillOpacity: 0.10,
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
			mapRaidDiv.textContent = '[Regions Manager: ' + mapLayer.features[i].attributes.name + ']';
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

	if (localStorage.MapRaidRussiaVisible === undefined) {
		localStorage.MapRaidRussiaVisible = true;
	}

	createLayerToggler(document.getElementById('layer-switcher-group_display').parentNode.parentNode, localStorage.MapRaidRussiaVisible == "true", 'Thailand Regions', function(checked) {
		localStorage.MapRaidRussiaVisible = checked;
		mapLayer.setVisibility(checked);
	});

	mapLayer = new OL.Layer.Vector("Thailand Regions", {
		uniqueName: "__Thailandregions"
	});

	addRaidPolygon(mapLayer, [
		[97.96228,20.10442],[97.59973,18.64867],[97.2865304,18.6332083],[97.90735,17.45754],[101.10162,17.48898],[101.49164,19.79937],[100.9176,19.57255],[100.3573,20.62969],[97.96228,20.10442]
	], '#EEE8AA', 'Chiang Mai - Region 1');
	addRaidPolygon(mapLayer, [
		[97.8991,17.57207],[98.77802,16.09773],[98.61597,16.19482],[98.21497,15.26996],[98.05017,15.28875],[98.5528,14.21],[101.24719,14.21],[101.24719,15.26996],[101.24719,15.30464],[101.24719,17.57207],[97.8991,17.57207]
	], '#DB4436', 'Phitsanulok - Region 2');
	addRaidPolygon(mapLayer, [
		[101.24719,14.21],[105.64296,14.19935],[105.6567,16.09605],[105.08691,16.0883],[104.64746,18.28567],[103.20825,18.47334],[102.72485,17.88535],[102.10687,18.24529],[101.2417,17.79737],[101.19775,16.10941],[101.24719,14.21]
	], '#000000', 'Udon Thani - Region 3');
	addRaidPolygon(mapLayer, [
		[100.09363,11.53513],[100.07166,14.21],[98.72377,14.21],[99.43719,11.5543],[100.09363,11.53513]
	], '#000000', 'Kanchanaburi - Region 4');
	addRaidPolygon(mapLayer, [
		[100.0616,13.43104],[100.80217,13.43104],[100.80217,14.21],[100.0616,14.21],[100.0616,13.43104]
	], '#000000', 'Bangkok - Region 5');
	addRaidPolygon(mapLayer, [
		[101.47516,12.50597],[101.47516,14.21],[100.73152,14.21],[100.73152,12.50597],[101.47516,12.50597]
	], '#000000', 'Pattaya - Region 6');
	addRaidPolygon(mapLayer, [
		[103.06218,14.21399],[101.47516,14.21],[101.48059,13.47432],[101.46136,12.1836],[102.6287842,11.6845143],[103.0379,11.60039],[102.53689,13.48122],[103.06218,14.21399]
	], '#000000', 'Nakhon Ratchasima - Region 7');
	addRaidPolygon(mapLayer, [
		[96.6741,6.91956],[100.36825,8.29163],[100.14303,11.55555],[99.28747,11.56631],[96.6741,6.91956]
	], '#000000', 'Surat Thani - Region 8');
    addRaidPolygon(mapLayer, [
		[98.61958,7.64287],[100.36812,8.29228],[101.557617,6.866439],[102.101440,6.200629],[101.821289,5.747174],[101.156616,5.610519],[100.228271,6.697343],[100.123901,6.440859],[98.61958,7.64287]
	], '#000000', 'HatYai - Region 9');
	Waze.map.addLayer(mapLayer);
	mapLayer.setVisibility(localStorage.MapRaidRussiaVisible == "true");

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
	areaJumperRegion.label = 'Thailand (Mar 2, 2018)';
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
