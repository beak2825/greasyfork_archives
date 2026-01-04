// ==UserScript==
// @name			WME MapRaid Regions Zambia
// @author          Tom 'Glodenox' Puttemans
// @namespace		http://tomputtemans.com
// @description		Shows the regions in the Zambia map raid
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version			1.3
// @grant			none
// @copyright		2017 Glodenox, based on work by 2015 rickzabel, based on work by 2014 davielde
// @downloadURL https://update.greasyfork.org/scripts/34421/WME%20MapRaid%20Regions%20Zambia.user.js
// @updateURL https://update.greasyfork.org/scripts/34421/WME%20MapRaid%20Regions%20Zambia.meta.js
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

	if (localStorage.MapRaidZambiaVisible === undefined) {
		localStorage.MapRaidZambiaVisible = true;
	}

	createLayerToggler(document.getElementById('layer-switcher-group_display').parentNode.parentNode, localStorage.MapRaidZambiaVisible == "true", 'Map Raid: Zambia', function(checked) {
		localStorage.MapRaidZambiaVisible = checked;
		mapLayer.setVisibility(checked);
	});

	mapLayer = new OL.Layer.Vector("Zambia MapRaid Regions", {
		uniqueName: "__ZambiaMapRaid"
	});

	addRaidPolygon(mapLayer, [
		[21.9774628,-13.6886878],[21.980896,-16.2087405],[22.1031189,-16.5177327],[23.3239746,-17.696362],[24.2468262,-17.5288207],[24.9389648,-17.5890487],[25.501266,-14.584431],[21.9774628,-13.6886878]
	], '#000000', 'Western');
	addRaidPolygon(mapLayer, [
		[21.9774628,-13.6886878],[25.501266,-14.584431],[26.9494629,-14.4187204],[26.861868,-13.719105],[27.0291138,-12.3319523],[27.6223755,-12.2031268],[27.2543335,-11.5365433],[27.0620728,-11.4880994],[26.8395996,-11.9264778],[25.6503296,-11.6979623],[25.3701782,-11.1541506],[23.9035034,-10.8440963],[23.8897705,-12.9898385],[21.9863892,-12.9940202],[21.9774628,-13.6886878]
	], '#000000', 'North Western');
	addRaidPolygon(mapLayer, [
		[24.9389648,-17.5890487],[25.1717377,-17.7725547],[25.2489853,-17.7898816],[25.269928,-17.8068799],[25.3475189,-17.8650542],[25.9311676,-18.0081209],[26.6693115,-18.1014764],[27.0977783,-17.9735081],[27.6498413,-17.4921503],[29.163208,-16.6361919],[28.861084,-16.4071052],[28.9421082,-15.9454843],[26.789955,-15.324404],[25.3674316,-15.3030615],[24.9389648,-17.5890487]
	], '#000000', 'Southern');
	addRaidPolygon(mapLayer, [
		[28.9421082,-15.9454843],[29.5834351,-15.6865096],[30.4293823,-15.6627096],[30.4595947,-15.5912931],[30.235344,-14.991406],[30.017141,-14.649424],[27.7130127,-15.2338398],[27.6745605,-15.582695],[28.9421082,-15.9454843]
	], '#000000', 'Lusaka');
	addRaidPolygon(mapLayer, [
		[25.3674316,-15.3030615],[26.789955,-15.324404],[27.6745605,-15.582695],[27.7130127,-15.2338398],[30.017141,-14.649424],[30.2206421,-13.9154061],[30.853283,-13.923629],[31.429016,-13.428279],[31.304735,-12.9587],[29.809536,-12.160899],[29.809221,-13.174631],[29.5861816,-13.1864681],[29.021582,-13.416817],[28.671686,-13.822161],[26.861868,-13.719105],[26.9494629,-14.4187204],[25.501266,-14.584431],[25.3674316,-15.3030615]
	], '#000000', 'Central');
	addRaidPolygon(mapLayer, [
		[27.6223755,-12.2031268],[27.0291138,-12.3319523],[26.861868,-13.719105],[28.671686,-13.822161],[29.022789,-13.4173392],[28.8267517,-12.9684273],[28.5548401,-12.6229176],[28.3550262,-12.4211538],[27.9135132,-12.2306417],[27.6223755,-12.2031268]
	], '#000000', 'Copperbelt');
	addRaidPolygon(mapLayer, [
		[30.2391815,-15.0071372],[33.1567383,-14.0300145],[32.7227783,-13.6032781],[32.8710938,-13.5231786],[33.0358887,-13.2158821],[33.022049,-12.90315],[32.9782104,-12.7823394],[33.5769653,-12.358783],[33.26004,-12.128209],[33.3544922,-11.829718],[33.3229065,-11.6448389],[32.5023651,-12.1172082],[32.2888184,-12.2252731],[32.1322632,-12.3963414],[31.429016,-13.428279],[30.853283,-13.923629],[30.2206421,-13.9154061],[30.017141,-14.649424],[30.2391815,-15.0071372]
	], '#000000', 'Eastern');
	addRaidPolygon(mapLayer, [
		[28.8853455,-8.4682973],[28.3273315,-9.2945963],[28.6047363,-9.8227419],[28.3520508,-11.4934825],[28.4207153,-11.8431589],[29.0441894,-12.4124362],[29.4871346,-12.4821913],[29.808863,-12.159746],[30.462111,-11.503463],[29.666409,-10.747635],[29.92337,-9.846412],[29.196692,-9.160225],[29.5829773,-8.3636927],[28.8853455,-8.4682973]
	], '#000000', 'Luapula');
	addRaidPolygon(mapLayer, [
		[30.462111,-11.503463],[31.204912,-10.735242],[32.381157,-9.761847],[32.2521973,-9.0966727],[31.3787842,-8.5647258],[31.0249329,-8.5429976],[30.770874,-8.1951795],[29.5829773,-8.3636927],[29.19072,-9.154538],[29.920424,-9.843025],[29.660294,-10.744324],[30.462111,-11.503463]
	], '#000000', 'Northern');
	addRaidPolygon(mapLayer, [
		[29.808863,-12.159746],[31.298077,-12.953815],[31.429016,-13.428279],[32.1322632,-12.3963414],[32.2888184,-12.2252731],[33.3229065,-11.6448389],[33.2693481,-11.4827163],[33.4259033,-11.1568453],[33.3036804,-10.9034362],[33.7184143,-10.5890714],[33.563236,-10.237119],[33.3311462,-10.0513461],[33.3874512,-9.9025686],[33.2006836,-9.5885632],[32.953499,-9.401408],[32.4440002,-9.1102326],[32.2537994,-9.1143005],[32.379585,-9.756032],[31.202549,-10.736465],[30.462111,-11.503463],[29.808863,-12.159746]
	], '#000000', 'Muchinga');
	Waze.map.addLayer(mapLayer);
	mapLayer.setVisibility(localStorage.MapRaidZambiaVisible == "true");

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
	areaJumperRegion.label = 'Zambia (Nov 1 - Nov 14, 2017)';
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
