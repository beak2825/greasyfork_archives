// ==UserScript==
// @name			WME San Luis Cordoba
// @author          Tom 'Glodenox' Puttemans
// @namespace		http://tomputtemans.com
// @description		Shows the regions in the Argentina map raid
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version			5.1
// @grant			none
// @copyright		2017 Glodenox, based on work by 2015 rickzabel, based on work by 2014 davielde
// @downloadURL https://update.greasyfork.org/scripts/368888/WME%20San%20Luis%20Cordoba.user.js
// @updateURL https://update.greasyfork.org/scripts/368888/WME%20San%20Luis%20Cordoba.meta.js
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
		strokeWidth: 7,
		fillColor: groupcolor,
		fillOpacity: 0.25,
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

	if (localStorage.MapRaidArgentinaVisible === undefined) {
		localStorage.MapRaidArgentinaVisible = true;
	}

	createLayerToggler(document.getElementById('layer-switcher-group_display').parentNode.parentNode, localStorage.MapRaidArgentinaVisible == "true", 'Map Raid: San Luis-Cordoba', function(checked) {
		localStorage.MapRaidArgentinaVisible = checked;
		mapLayer.setVisibility(checked);
	});

	mapLayer = new OL.Layer.Vector("San Luis-Cordoba", {
		uniqueName: "__San Luis-Cordoba"
	});

	addRaidPolygon(mapLayer, [
		[-61.732,-33.02],[-62.897,-34.422],[-63.405,-34.42],[-63.391,-35.032],[-65.102,-34.994],[-65.109,-33.804],[-64.294,-31.486],[-64.095,-31.488],[-64.094,-31.34],[-64.292,-31.341],[-64.294,-31.486],[-65.109,-33.804],[-65.102,-34.906],[-65.096,-35.993],[-66.622,-36.008],[-66.543,-35.114],[-67.159,-33.43],[-67.219,-32.737],[-67.338,-32.36],[-67.396,-31.869],[-66.815,-31.9],[-66.312,-31.935],[-65.779,-31.878],[-65.769,-31.022],[-65.553,-30.508],[-65.415,-30.119],[-65.13,-30.057],[-64.907,-29.903],[-64.975,-29.575],[-64.328,-29.493],[-63.803,-29.566],[-63.467,-29.661],[-63.444,-29.766],[-62.781,-29.807],[-62.402,-30.297],[-62.181,-30.319],[-62.119,-30.479],[-61.98,-30.591],[-61.817,-30.673],[-62.121,-31.601],[-62.239,-31.686],[-61.732,-33.02]
	], '#FFEFD5', 'Zona 1');
	addRaidPolygon(mapLayer, [
		[-64.29264528259603,-31.338988335704652],[-64.0935180853304,-31.340747721571347],[-64.09489137634603,-31.489589638955376],[-64.19376832947103,-31.487247502769353],[-64.29333192810384,-31.486661959559815],[-64.29264528259603,-31.338988335704652]
	], '#000000', 'ZONA EXCLUIDA NO EDITAR');
    Waze.map.addLayer(mapLayer);
	mapLayer.setVisibility(localStorage.MapRaidArgentinaVisible == "true");

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
	areaJumperRegion.label = 'San Luis-Cordoba (May, 2018)';
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
