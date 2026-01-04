// ==UserScript==
// @name                WME Argentina MR Regiones 10
// @author          Tom 'Glodenox' Puttemans, alter by fermario73
// @description		Shows the regions in the Argentina map raid
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version			5.7
// @grant			none
// @copyright		2017 Glodenox, based on work by 2015 rickzabel, based on work by 2014 davielde
// @namespace https://greasyfork.org/users/116669
// @downloadURL https://update.greasyfork.org/scripts/374300/WME%20Argentina%20MR%20Regiones%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/374300/WME%20Argentina%20MR%20Regiones%2010.meta.js
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

	createLayerToggler(document.getElementById('layer-switcher-group_display').parentNode.parentNode, localStorage.MapRaidArgentinaVisible == "true", 'MapRaid 9: Argentina', function(checked) {
		localStorage.MapRaidArgentinaVisible = checked;
		mapLayer.setVisibility(checked);
	});

	mapLayer = new OL.Layer.Vector("Argentina MapRaid Regions", {
		uniqueName: "__ArgentinaMapRaid"
	});

	addRaidPolygon(mapLayer, [
        [-69.094836991953,-27.749641718898825],[-68.85039119117175,-27.761794536371195],[-68.53728083960925,-27.693721295228258],[-68.457629960703,-27.7374875451054],[-68.37797908179675,-27.999715372058148],[-67.88548878697839,-28.113634475476324],[-67.80583790807214,-28.324186792262857],[-67.60533741979089,-28.283077041193195],[-67.37475074985679,-28.3555018621474],[-67.17974342563804,-28.350667670511736],[-67.04516090610679,-28.215221036465476],[-66.55763236818251, -28.30667001706675],[-66.41755668458876,-28.66636277303744],[-66.29945365724501,-28.73622736438678],[-66.37086479005751,-28.84695128667117],[-66.14564506349501,-28.87822150410869],[-65.7958702477091,-29.179923215857634],[-65.8013634117716,-29.22787243218766],[-65.71072620474035,-29.290172859888447],[-65.39032019726437,-30.132957673303043],[-65.76609533084303,-31.043574739631744],[-65.76334874881178,-31.89037376820669],[-65.9655449220615,-31.91013414958465],[-66.07266162128025, -31.977723192989124],[-66.311614257999,-31.963743332176442],[-66.35281298846775,-32.02197870255817],[-66.85269091815525,-31.91013414958465],[-67.35796234913403,-31.888508273576154],[-67.27831147022778,-32.36301665148831],[-67.49254486866528,-32.34445502373024],[-67.54198334522778,-32.27481500762975],[-67.84728943362427,-32.238621118035645],[-67.98736511721802,-32.089817833883785],[-68.35815369143677,-32.15029847640286],[-68.45428406253052,-32.13169331703745],[-68.67965478042333, -32.346140857051296],[-68.94607323745458,-32.325254862317756],[-68.94332665542333,-32.10217141103161],[-69.01199120620458,-32.12776080445417],[-69.14932030776708,-31.978776592105906],[-69.30038231948583,-32.09053749752727],[-69.57838935190983,-32.149507621131846],[-69.68825263315983,-32.553232083191205],[-70.00685614878483,-32.58795143979027],[-70.08101386362858,-32.66428669285936],[-70.15517157847233,-32.56943612208424],[-70.34743232065983,-32.240154172302866],[-70.39240449681597, -32.011621927210534],[-70.27704805150347,-32.011621927210534],[-70.23859590306597,-31.955710367360204],[-70.28528779759722,-31.89043717415649],[-70.39515107884722,-31.892769157219494],[-70.47754853978472,-31.843785113870002],[-70.48304170384722,-31.720043048930588],[-70.5802377270702,-31.596589419289526],[-70.56650481691395,-31.388148303431024],[-70.50058684816395,-31.08520313943767],[-70.43466887941395,-31.06873649459236],[-70.39072356691395,-31.148690611549505],[-70.20944915285145, -30.476411942556027],[-70.14353118410145,-30.437845230806015],[-70.17099700441395,-30.33833660990589],[-70.1243051098827,-30.324112822959552],[-70.04465423097645,-30.38099557083169],[-69.92929778566395,-30.33833660990589],[-69.8880990551952,-30.193631927123267],[-69.85239348878895,-30.198379723016483],[-69.8496469067577,-30.139015825361987],[-69.9814828442577,-30.11050846000563],[-69.91076467480872,-29.720774774895357],[-70.03710744824622,-29.343195724886048],[-69.94647024121497, -29.15627759392955],[-69.80639455762122,-29.110694581831762],[-69.67995715818955,-28.42239900337918],[-69.44375110350205,-28.156359474019954],[-69.094836991953,-27.749641718898825]
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
	areaJumperRegion.label = 'Argentina (Nov 19 - Nov 26, 2018)';
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
