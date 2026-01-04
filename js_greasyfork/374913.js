// ==UserScript==
// @name                WME Argentina MR Regiones 11
// @author          Tom 'Glodenox' Puttemans, alter by fermario73
// @description		Shows the regions in the Argentina map raid
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version			6.0
// @grant			none
// @copyright		2017 Glodenox, based on work by 2015 rickzabel, based on work by 2014 davielde
// @namespace https://greasyfork.org/users/116669
// @downloadURL https://update.greasyfork.org/scripts/374913/WME%20Argentina%20MR%20Regiones%2011.user.js
// @updateURL https://update.greasyfork.org/scripts/374913/WME%20Argentina%20MR%20Regiones%2011.meta.js
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

	createLayerToggler(document.getElementById('layer-switcher-group_display').parentNode.parentNode, localStorage.MapRaidArgentinaVisible == "true", 'MapRaid 11: Argentina', function(checked) {
		localStorage.MapRaidArgentinaVisible = checked;
		mapLayer.setVisibility(checked);
	});

	mapLayer = new OL.Layer.Vector("Argentina MapRaid Regions", {
		uniqueName: "__ArgentinaMapRaid"
	});

	addRaidPolygon(mapLayer, [
        [-58.19991010164921,-34.733016850910985],[-58.17038434481327,-34.74571253928007],[-58.11011264559761,-34.74996578246687],[-57.96626041171089,-34.78734088443475],[-57.822064855070266,-34.81891463690074],[-57.52613976555682,-34.990072470967455],[-57.20266718168034,-35.2541407777024],[-57.114032899651306,-35.428748271621835],[-57.141498719963806,-35.504804884110975],[-57.33787933519818,-35.74034572571724],[-57.36480207316288,-35.85539622130982],[-57.28652448527225,-36.08546237405425],[-57.05993146769413,-36.28497426578499],[-56.77154035441288,-36.28165323340346],[-56.70406817038622,-36.31435992802086],[-56.635967262976465,-36.88290943477543],[-57.50676922647915,-38.119381889922096],[-57.91890956322948,-38.391781275504925],[-59.326408642450474,-38.82243471504715],[-60.972908045364875,-39.03129455619529],[-61.7778836401867,-39.04587342357463],[-62.05923626066698,-40.7146815420823],[-62.362925898540425,-40.95353124209222],[-62.755687129009175,-41.0799442404005],[-63.024852168071675,-40.80816832491873],[-63.417920849814664,-40.71242373741648],[-63.4118013613662,-34.402527855411485],[-61.7633174967479,-34.39814563464676],[-60.86211766301898,-33.507091331575204],[-60.50231541692523,-33.61237399485637],[-60.28808201848773,-33.26169896902926],[-60.23040379583148,-33.25480883434629],[-59.62233528718605,-33.62243683149809],[-59.4657801114048,-33.64073161777776],[-59.148389490366014,-33.730808255838916],[-59.115430505991014,-33.815282407118175],[-58.857251795053514,-33.8951136842027],[-58.68009725403789,-33.98454994585461],[-58.615552576303514,-34.02724109995663],[-58.428784998178514,-33.993089893400544],[-58.35307796341226,-34.005924613314505],[-58.31737239700601,-34.14242631830251],[-58.20270259720132,-34.185037967835555],[-58.49933345657632,-34.452146824264865],[-58.670308188021636,-34.35810356629894],[-58.821370199740386,-34.44761704404985],[-58.8330431733732,-34.64838940276503],[-58.57020909902059,-34.85995642818346],[-58.34361608144246,-34.858266126721816],[-58.19991010164921,-34.733016850910985]
	], '#FFFF00', 'Area 1');

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
	areaJumperRegion.label = 'Argentina (Dic 16 - Dic 23, 2018)';
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
