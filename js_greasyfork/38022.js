// ==UserScript==
// @name			WME MapRaid Regions Russia
// @author          Tom 'Glodenox' Puttemans
// @namespace		http://tomputtemans.com
// @description		Shows the regions in the Russia
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version			1.0
// @grant			none
// @copyright		2018 Glodenox, based on work by 2015 rickzabel, based on work by 2014 davielde
// @downloadURL https://update.greasyfork.org/scripts/38022/WME%20MapRaid%20Regions%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/38022/WME%20MapRaid%20Regions%20Russia.meta.js
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

	if (localStorage.MapRaidRussiaVisible === undefined) {
		localStorage.MapRaidRussiaVisible = true;
	}

	createLayerToggler(document.getElementById('layer-switcher-group_display').parentNode.parentNode, localStorage.MapRaidRussiaVisible == "true", 'Map Raid: Russia', function(checked) {
		localStorage.MapRaidRussiaVisible = checked;
		mapLayer.setVisibility(checked);
	});

	mapLayer = new OL.Layer.Vector("Russia MapRaid Regions", {
		uniqueName: "__RussiaMapRaid"
	});

	addRaidPolygon(mapLayer, [
		[42.87287,51.23134],[45.04958,51.12365],[45.22818,50.58844],[45.81067,50.77359],[47.44603,50.36826],[46.77511,49.33255],[47.1143,49.18197],[46.62019,48.6696],[46.03247,48.8689],[45.10457,48.28153],[45.30063,48.09768],[44.49383,48.06096],[44.38905,47.86827],[43.66713,47.44599],[42.95534,47.51033],[42.50896,48.004],[42.02062,48.03748],[42.07788,48.41126],[42.74512,48.80472],[41.97929,49.18717],[42.17875,49.68622],[41.33252,50.15622],[41.52577,50.59867],[41.16579,50.77752],[41.85494,51.18856],[42.87287,51.23134]
	], '#000000', 'Volgograd - Group 1');
	addRaidPolygon(mapLayer, [
		[43.47075,54.04044],[44.55566,53.66135],[44.68226,53.96112],[45.79155,54.00389],[46.9059,53.33532],[46.92128,52.57508],[45.04524,52.32089],[42.97156,52.42704],[43.2099,52.69921],[41.89234,53.76953],[43.47075,54.04044]
	], '#000000', 'Penza - Group 2');
	addRaidPolygon(mapLayer, [
		[54.32064,56.34483],[57.45014,56.21198],[59.29605,56.13089],[59.3456,55.63834],[59.64135,55.56534],[58.81567,55.02486],[58.32808,55.00345],[58.00083,54.91673],[57.9862,55.21726],[57.51797,55.33404],[57.13691,55.09214],[57.86149,54.47334],[59.99117,54.9156],[59.729,54.13866],[58.92336,53.93516],[59.02764,53.01496],[58.72368,52.64506],[58.83975,52.4413],[58.5669,51.78335],[56.78013,51.5922],[56.62169,52.1238],[56.19092,52.17268],[56.4279,52.59514],[55.53576,52.38869],[54.9266,53.21954],[53.65991,53.74628],[53.34778,54.38159],[53.64275,54.89993],[53.14676,55.14656],[54.23093,55.69247],[53.19771,55.92067],[54.32064,56.34483]
	], '#000000', 'Bashkortostan - Group 3');
	addRaidPolygon(mapLayer, [
		[48.12842,60.99382],[48.43427,60.85969],[48.75375,60.36722],[48.45733,60.18651],[48.50756,59.71512],[49.67999,59.51839],[49.98303,59.77155],[51.53311,59.94921],[52.26347,60.45393],[53.7029,60.01107],[53.20578,59.364],[53.87654,59.0928],[53.80491,58.44232],[51.79615,58.3613],[51.85836,57.63948],[51.11557,57.30508],[51.54045,56.88299],[51.13789,56.50012],[50.08321,56.6164],[49.7079,57.07249],[49.26379,57.04833],[48.58494,57.15988],[47.49884,56.85333],[46.71274,56.94019],[46.74901,57.52186],[47.4046,57.57005],[47.69271,57.92949],[46.27768,58.04682],[46.59305,58.56061],[47.54831,58.95872],[46.94209,59.48028],[46.92288,60.00915],[46.32122,60.11866],[46.29838,60.29098],[46.74953,60.26113],[47.16705,61.09192],[48.12842,60.99382]
	], '#000000', 'Kirov - Group 4');
	addRaidPolygon(mapLayer, [
		[51.79615,58.3613],[53.70466,58.59498],[54.39981,57.04288],[53.84935,56.62843],[54.32064,56.34483],[53.19771,55.92067],[53.564,56.18107],[53.0493,56.13603],[53.08661,56.52567],[52.56199,56.25943],[52.83422,56.0943],[51.78178,55.88755],[50.08321,56.6164],[51.13789,56.50012],[51.54045,56.88299],[51.11557,57.30508],[51.85836,57.63948],[51.79615,58.3613]
	], '#000000', 'Udmurt - Group 5');
	addRaidPolygon(mapLayer, [
		[52.51497,54.32583],[53.34778,54.38159],[53.65991,53.74628],[54.9266,53.21954],[55.53576,52.38869],[56.4279,52.59514],[56.19092,52.17268],[56.62169,52.1238],[56.78013,51.5922],[58.5669,51.78335],[58.83975,52.4413],[59.80961,52.49685],[60.14861,52.42052],[60.08576,51.93348],[61.66366,51.2584],[61.32435,50.66414],[60.03374,50.69627],[59.52281,50.47465],[58.05512,51.06699],[57.46763,50.8585],[56.47834,51.07303],[55.68075,50.49475],[54.63825,51.02769],[54.72044,50.56005],[54.32712,50.50043],[53.40731,51.48417],[52.54582,51.45952],[52.30779,51.77454],[51.30424,51.47164],[50.92479,51.66805],[51.41519,52.10271],[52.48468,54.05851],[52.20367,54.29865],[52.51497,54.32583]
	], '#000000', 'Orenburg - Group 6');
	addRaidPolygon(mapLayer, [
		[51.39679,54.65206],[52.51497,54.32583],[52.20367,54.29865],[52.48468,54.05851],[51.41519,52.10271],[50.92479,51.66805],[48.43697,52.78045],[47.94853,53.35868],[48.47314,53.7699],[50.03429,53.82633],[50.51209,54.32966],[51.39679,54.65206]
	], '#000000', 'Samara - Group 7');
	addRaidPolygon(mapLayer, [
		[48.43697,52.78045],[50.92479,51.66805],[48.67119,50.47938],[48.88568,50.01989],[48.42989,49.80967],[47.44603,50.36826],[45.81067,50.77359],[45.22818,50.58844],[45.04958,51.12365],[42.87287,51.23134],[42.48922,51.6077],[42.97156,52.42704],[45.04524,52.32089],[46.92128,52.57508],[48.43697,52.78045]
	], '#000000', 'Saratov - Group 8');
	addRaidPolygon(mapLayer, [
		[50.08321,56.6164],[51.78178,55.88755],[52.83422,56.0943],[52.56199,56.25943],[53.08661,56.52567],[53.0493,56.13603],[53.564,56.18107],[53.19771,55.92067],[54.23093,55.69247],[53.14676,55.14656],[53.64275,54.89993],[53.34778,54.38159],[52.51497,54.32583],[51.39679,54.65206],[50.51209,54.32966],[49.28395,54.88523],[47.2419,54.67772],[48.08464,55.15054],[47.62959,55.26709],[49.09151,56.39175],[50.08321,56.6164]
	], '#000000', 'Tatarstan - Group 9');
	addRaidPolygon(mapLayer, [
		[49.28395,54.88523],[50.51209,54.32966],[50.03429,53.82633],[48.47314,53.7699],[47.94853,53.35868],[48.43697,52.78045],[46.92128,52.57508],[46.9059,53.33532],[45.79155,54.00389],[46.67588,54.34454],[46.36451,54.77839],[47.2419,54.67772],[49.28395,54.88523]
	], '#000000', 'Ul\'yanovsk - Group 10');
	addRaidPolygon(mapLayer, [
		[58.98858,59.92776],[58.31089,59.46278],[59.17399,59.16838],[59.08273,58.76933],[59.42393,58.69278],[59.44972,58.42586],[58.6718,58.10144],[58.90457,57.74285],[57.98776,57.48488],[58.07194,57.05063],[57.36399,56.88209],[57.45014,56.21198],[54.32064,56.34483],[53.91165,56.36351],[53.84935,56.62843],[54.39981,57.04288],[53.70466,58.59498],[53.87654,59.0928],[53.20578,59.364],[53.7029,60.01107],[52.26347,60.45393],[51.77424,60.6056],[51.89547,60.8799],[52.87649,61.09384],[54.72623,60.88874],[56.67575,61.52234],[59.34866,61.68218],[59.49656,60.79603],[58.98858,59.92776]
	], '#000000', 'Perm - Group 11');

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
	areaJumperRegion.label = 'Russia (Feb 18 - Mar 2, 2018)';
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
