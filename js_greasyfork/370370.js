// ==UserScript==
// @name			WME Departamento Del Cauca (Colombia)
// @namespace		https://greasyfork.org/es/scripts/370370-wme-departamento-del-cauca-colombia
// @description		Area Comprendida del Deparatmento Del Cauca
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version			2.6
// @icon            https://ia801507.us.archive.org/24/items/FlagOfCauca.svg/Flag_of_Cauca.svg.png
// @grant			none
// @author          Walter-Bravo
// @copyright		2018 Walter-Bravo, based on work by 2015 rickzabel, based on work by 2014 davielde
// @downloadURL https://update.greasyfork.org/scripts/370370/WME%20Departamento%20Del%20Cauca%20%28Colombia%29.user.js
// @updateURL https://update.greasyfork.org/scripts/370370/WME%20Departamento%20Del%20Cauca%20%28Colombia%29.meta.js
// ==/UserScript==
setTimeout(initMapRaidOverlay, 1000);
var mapLayer;

function convertPoints(list) {
	return list.map(function(point) {
		return new OL.Geometry.Point(point[0], point[1]).transform(new OL.Projection("EPSG:4326"), Waze.map.getProjectionObject());
	});
}

function addRaidPolygon(raidLayer, groupPoints, color, name) {
	var style = {
		strokeColor: color,
		strokeOpacity: 0.8,
		strokeWidth: 3,
		fillColor: color,
		fillOpacity: 0.1,
		label: name,
		labelOutlineColor: "Black",
		labelOutlineWidth: 3,
		fontSize: 14,
		fontColor: color,
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
			mapRaidDiv.textContent = '[' + mapLayer.features[i].attributes.name + ']';
			return;
		}
	}
	mapRaidDiv.textContent = '';
}

function initMapRaidOverlay() {
	if (typeof Waze === 'undefined' || typeof Waze.map === 'undefined' || !document.querySelector('#topbar-container > div > div > div.location-info-region > div') || !document.getElementById('layer-switcher-group_display')) {
    setTimeout(initMapRaidOverlay, 800);
    return;
  }
	
	if (localStorage.MapRaidCaucaVisible === undefined) {
		localStorage.MapRaidCaucaVisible = true;
	}

	createLayerToggler(document.getElementById('layer-switcher-group_display').parentNode.parentNode, localStorage.MapRaidCaucaVisible == "true", 'Departamento del Cauca', function(checked) {
		localStorage.MapRaidCaucaVisible = checked;
		mapLayer.setVisibility(checked);
	});
	
	mapLayer = new OL.Layer.Vector("Cauca MapRaid Regions", {
		uniqueName: "__CaucaMapRaid"
	});

	addRaidPolygon(mapLayer, [
		[-77.9067993,2.6344167],[-77.853241,2.1912381],[-77.7680969,2.1308563],[-77.518158,2.1637921],[-77.4385071,2.2337784],[-77.3258972,2.2228004],[-77.3286438,2.0581205],[-77.2077942,1.9579318],[-77.34375,1.6806671],[-77.1295166,1.6559584],[-76.9372559,1.7259657],[-76.8301392,1.6120309],[-76.9125366,1.5035811],[-76.782074,1.425329],[-76.6680908,1.472006],[-76.5856934,1.4019902],[-76.5403748,1.2235093],[-76.574707,1.0862081],[-76.4414978,0.9489007],[-76.0762024,1.0051975],[-76.0638428,1.0601202],[-76.2602234,1.1246531],[-76.2986755,1.2138984],[-76.2176514,1.3100055],[-76.1448669,1.5420196],[-76.4250183,1.6243856],[-76.423645,1.7479283],[-76.4785767,1.9030314],[-76.5843201,1.8659726],[-76.5870667,2.0938026],[-76.5527344,2.1404626],[-76.4442444,2.1239946],[-76.3742065,2.2749452],[-76.1668396,2.1912381],[-76.0968018,2.2324061],[-76.1517334,2.3051335],[-76.1132812,2.3902061],[-76.0501099,2.3847177],[-75.9745789,2.5027133],[-75.861969,2.4217639],[-75.8097839,2.4821334],[-75.8345032,2.5521037],[-75.7466125,2.7318135],[-76.0295105,2.9361835],[-76.0707092,3.2145598],[-76.466217,3.3215023],[-76.5335083,3.1144624],[-76.7601013,3.1350312],[-76.8617249,3.0609818],[-77.0594788,3.180281],[-77.2970581,3.1651979],[-77.4810791,3.3091634],[-77.9067993,2.6344167]
	], '#FFFF00', 'Departamento Del Cauca');
	

	Waze.map.addLayer(mapLayer);
	mapLayer.setVisibility(localStorage.MapRaidCaucaVisible == "true");
	
	displayCurrentRaidLocation();
	Waze.map.events.register("moveend", null, displayCurrentRaidLocation);
	Waze.map.events.register("zoomend", null, displayCurrentRaidLocation);
}
