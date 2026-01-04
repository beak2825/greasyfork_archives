// ==UserScript==
// @name			WME MapRaid Regions Argentina
// @author          Tom 'Glodenox' Puttemans
// @namespace		http://tomputtemans.com
// @description		Shows the regions in the Argentina map raid
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version			1.3
// @grant			none
// @copyright		2017 Glodenox, based on work by 2015 rickzabel, based on work by 2014 davielde
// @downloadURL https://update.greasyfork.org/scripts/35109/WME%20MapRaid%20Regions%20Argentina.user.js
// @updateURL https://update.greasyfork.org/scripts/35109/WME%20MapRaid%20Regions%20Argentina.meta.js
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

	if (localStorage.MapRaidArgentinaVisible === undefined) {
		localStorage.MapRaidArgentinaVisible = true;
	}

	createLayerToggler(document.getElementById('layer-switcher-group_display').parentNode.parentNode, localStorage.MapRaidArgentinaVisible == "true", 'Map Raid: Argentina', function(checked) {
		localStorage.MapRaidArgentinaVisible = checked;
		mapLayer.setVisibility(checked);
	});

	mapLayer = new OL.Layer.Vector("Argentina MapRaid Regions", {
		uniqueName: "__ArgentinaMapRaid"
	});

	addRaidPolygon(mapLayer, [
		[-65.1244054,-35.9840398],[-65.5444336,-36.8971945],[-65.9838867,-38.4277735],[-65.9454346,-38.8311498],[-65.7035267,-38.8396375],[-65.1489258,-38.8739285],[-64.2326296,-38.9212526],[-63.3529870,-39.4110044],[-63.3859486,-34.9762728],[-65.1025662,-34.9861522],[-65.1244054,-35.9840398]
	], '#000000', 'Zone 1');
	addRaidPolygon(mapLayer, [
		[-65.1244054,-35.9840398],[-68.2982267,-35.9893908],[-68.2481018,-37.5870305],[-67.9393667,-37.6304208],[-67.7619570,-37.7429024],[-67.7967641,-37.8978747],[-67.9118991,-37.9965562],[-67.6035888,-38.2281587],[-66.5980912,-38.6815413],[-66.2692228,-38.7868108],[-66.0606188,-38.8048182],[-65.9454346,-38.8311498],[-65.9838867,-38.4277735],[-65.5444336,-36.8971945],[-65.1244054,-35.9840398]
	], '#000000', 'Zone 2');
	addRaidPolygon(mapLayer, [
		[-68.2481018,-37.5870305],[-68.2982267,-35.9893908],[-66.6395128,-35.9970467],[-66.5425583,-35.8508740],[-66.5289340,-34.8982519],[-66.6510364,-34.6718415],[-66.7993086,-34.2866912],[-67.2234725,-34.2914827],[-67.9669189,-34.3842460],[-68.6163993,-34.5314030],[-69.2401760,-34.7072100],[-70.3739261,-35.0865374],[-70.5329273,-35.1945207],[-70.5830556,-35.2870604],[-70.4274509,-35.3669173],[-70.4090474,-35.5598121],[-70.3708537,-35.7400818],[-70.4291821,-35.8867310],[-70.4223633,-36.1290017],[-70.3572550,-36.3261767],[-70.2187480,-36.3796756],[-70.1866770,-36.5201851],[-70.0664651,-36.6341565],[-69.8359510,-36.8389846],[-69.8655135,-36.9602516],[-69.7961426,-37.0551771],[-69.4775391,-37.2128315],[-69.1108213,-37.1986464],[-69.0470580,-37.3412288],[-68.6999423,-37.4485361],[-68.2481018,-37.5870305]
	], '#000000', 'Zone 3');
	addRaidPolygon(mapLayer, [
		[-70.3804852,-35.0518696],[-70.3739261,-35.0865374],[-69.2401760,-34.7072100],[-68.6163993,-34.5314030],[-67.9669189,-34.3842460],[-67.2234725,-34.2914827],[-66.7993086,-34.2866912],[-66.6375732,-34.0481081],[-66.9177246,-33.7152016],[-67.1400798,-33.4301698],[-67.1539307,-33.1651454],[-67.5988770,-33.0547165],[-68.2965088,-33.0040569],[-68.6535645,-33.0731309],[-69.2358398,-33.1835367],[-69.6093750,-33.3305282],[-69.7740525,-33.3389705],[-69.8848049,-33.6865841],[-69.9046208,-33.9654696],[-69.8142744,-34.1809162],[-69.9123729,-34.2881174],[-70.0143850,-34.4032490],[-70.2129370,-34.6020535],[-70.2589826,-34.8088659],[-70.3804852,-35.0518696]
	], '#000000', 'Zone 4');
	addRaidPolygon(mapLayer, [
		[-69.7740525,-33.3389705],[-69.6093750,-33.3305282],[-69.2358398,-33.1835367],[-68.6535645,-33.0731309],[-68.2965088,-33.0040569],[-67.5988770,-33.0547165],[-67.1539307,-33.1651454],[-67.1771631,-32.7490142],[-67.3131245,-32.3496349],[-67.7223802,-32.2393502],[-67.9791971,-32.0486467],[-68.1152344,-32.0453328],[-68.4626129,-32.1045046],[-68.6466390,-32.3183070],[-68.9213072,-32.3148257],[-68.9322951,-32.0917099],[-69.1465345,-31.9543117],[-69.4760617,-32.0758716],[-69.6018012,-32.1260262],[-69.6258545,-32.2639106],[-69.7116303,-32.3350070],[-69.7041128,-32.4667422],[-70.0134868,-32.5439433],[-70.0704094,-32.6243044],[-70.1313586,-32.5656497],[-70.1731103,-32.6201363],[-70.1312256,-32.7641814],[-69.9909616,-32.9003261],[-70.0305031,-32.9696935],[-70.0948290,-33.0517040],[-70.0103760,-33.2892119],[-69.9657256,-33.3063024],[-69.8016188,-33.2908065],[-69.7740525,-33.3389705]
	], '#000000', 'Zone 5');
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
	areaJumperRegion.label = 'Argentina (Nov 20 - Nov 27, 2017)';
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
