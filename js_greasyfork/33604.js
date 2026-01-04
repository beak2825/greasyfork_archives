// ==UserScript==
// @name			WME Delimitación Comunas Santiago de Chile
// @namespace		https://greasyfork.org/es/users/48202-gaspar-mulet
// @description		Delimita zonas de Edición para Comunas Santiago de Chile
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version			3.21
// @icon            https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Coat_of_arms_of_Chile_%28c%29.svg/710px-Coat_of_arms_of_Chile_%28c%29.svg.png
// @grant			none
// @author          Gaspar Mulet
// @copyright		2017 Kahlcolimon, based on work by 2015 rickzabel, based on work by 2014 davielde
// @downloadURL https://update.greasyfork.org/scripts/33604/WME%20Delimitaci%C3%B3n%20Comunas%20Santiago%20de%20Chile.user.js
// @updateURL https://update.greasyfork.org/scripts/33604/WME%20Delimitaci%C3%B3n%20Comunas%20Santiago%20de%20Chile.meta.js
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
	
	if (localStorage.ComunasSantiagoVisible === undefined) {
		localStorage.ComunasSantiagoVisible = true;
	}

	createLayerToggler(document.getElementById('layer-switcher-group_display').parentNode.parentNode, localStorage.ComunasSantiagoVisible == "true", 'Comunas Santiago', function(checked) {
		localStorage.ComunasSantiagoVisible = checked;
		mapLayer.setVisibility(checked);
	});
	
	mapLayer = new OL.Layer.Vector("Comunas Santiago", {
		uniqueName: "__ComunasSantiago"
	});

	addRaidPolygon(mapLayer, [
		[-70.636425,-33.43640899999998],[-70.634648,-33.436510999999996],[-70.632906,-33.435936000000005],[-70.631364,-33.435188],[-70.629615,-33.434272],[-70.628171,-33.433265999999996],[-70.626723,-33.43209],[-70.624519,-33.428617],[-70.622822,-33.42496799999999],[-70.621891,-33.42421100000001],[-70.620864,-33.423712],[-70.619224,-33.42313600000001],[-70.612266,-33.42134800000001],[-70.610305,-33.419922],[-70.608749,-33.418405],[-70.607602,-33.416968000000004],[-70.605584,-33.41793400000001],[-70.603148,-33.418392],[-70.600935,-33.419872],[-70.586303,-33.432784],[-70.581313,-33.43284799999999],[-70.579414,-33.432758],[-70.579854,-33.433491],[-70.58067,-33.43531],[-70.589012,-33.44782200000001],[-70.594079,-33.44949299999999],[-70.598782,-33.44661800000001],[-70.599896,-33.446322],[-70.609039,-33.44747],[-70.611352,-33.448472],[-70.613879,-33.448955],[-70.617291,-33.44891100000001],[-70.6193,-33.44860299999999],[-70.631892,-33.451595000000005],[-70.636425,-33.43640899999998]
	], '#FFFF00', 'Providencia');
	addRaidPolygon(mapLayer, [
		[-70.477663,-33.36986099999999],[-70.478642,-33.370593],[-70.482675,-33.374497],[-70.483964,-33.377393000000005],[-70.483762,-33.3801],[-70.479465,-33.389927],[-70.477011,-33.391413],[-70.477063,-33.39453199999999],[-70.463685,-33.395315000000004],[-70.461226,-33.396592],[-70.455785,-33.397488],[-70.45385,-33.400423],[-70.454375,-33.417057],[-70.445071,-33.424446],[-70.443097,-33.425093],[-70.437406,-33.425991],[-70.43446,-33.42789700000001],[-70.432765,-33.430413],[-70.431855,-33.435415],[-70.43153,-33.445818999999986],[-70.428855,-33.449177999999996],[-70.428933,-33.453962],[-70.428264,-33.458544999999994],[-70.432568,-33.463696],[-70.435094,-33.466371],[-70.43539,-33.46927899999999],[-70.433477,-33.471408999999994],[-70.433647,-33.481672],[-70.436844,-33.481548],[-70.438922,-33.48654200000001],[-70.444271,-33.484495],[-70.45122,-33.481517],[-70.453954,-33.47865899999999],[-70.457293,-33.476641],[-70.463269,-33.476076],[-70.466539,-33.47497799999999],[-70.48304,-33.46368900000001],[-70.485945,-33.46104],[-70.4869,-33.457708],[-70.492455,-33.447396000000005],[-70.497177,-33.44260499999999],[-70.50376,-33.43828599999999],[-70.508358,-33.436111000000004],[-70.526,-33.432998],[-70.527616,-33.429022],[-70.542439,-33.42862600000001],[-70.542892,-33.430387],[-70.55488,-33.431650000000005],[-70.563149,-33.432252999999996],[-70.577032,-33.432646],[-70.579414,-33.432758],[-70.581313,-33.43284799999999],[-70.586303,-33.432784],[-70.600935,-33.419872],[-70.603148,-33.418392],[-70.605584,-33.41793400000001],[-70.607602,-33.416968000000004],[-70.606752,-33.415015000000004],[-70.606512,-33.413054],[-70.606376,-33.411177],[-70.605355,-33.408787],[-70.60402,-33.40947499999999],[-70.601822,-33.40908000000001],[-70.599209,-33.408972],[-70.587256,-33.404886000000005],[-70.550779,-33.390581],[-70.545529,-33.38902199999999],[-70.535601,-33.384835],[-70.530816,-33.380867],[-70.528323,-33.37800099999999],[-70.526026,-33.37668599999999],[-70.518136,-33.373321],[-70.513817,-33.371961000000006],[-70.510434,-33.371083999999996],[-70.504948,-33.370373],[-70.500533,-33.36823600000001],[-70.497218,-33.366439],[-70.492647,-33.36500999999999],[-70.490455,-33.36489500000001],[-70.488015,-33.364995],[-70.484052,-33.36468899999999],[-70.479581,-33.364177999999995],[-70.47817,-33.36539599999999],[-70.477663,-33.36986099999999]
	], '#A61B4A', 'Las Condes');
	addRaidPolygon(mapLayer, [
		[-70.609054,-33.40183499999999],[-70.607175,-33.399297000000004],[-70.606724,-33.39691199999999],[-70.60516,-33.39488300000001],[-70.603193,-33.393115],[-70.601425,-33.391088],[-70.600351,-33.38802799999999],[-70.599141,-33.37754],[-70.59619,-33.37202799999999],[-70.596737,-33.368518999999985],[-70.598111,-33.365769],[-70.597338,-33.36244899999999],[-70.595468,-33.36033799999999],[-70.586618,-33.354901000000005],[-70.581996,-33.351338],[-70.577725,-33.352191999999995],[-70.574519,-33.35404499999999],[-70.574216,-33.355227000000006],[-70.572299,-33.35670100000001],[-70.567741,-33.35549],[-70.564332,-33.35807],[-70.560572,-33.359204999999996],[-70.556899,-33.359161],[-70.548168,-33.366156999999994],[-70.542936,-33.369575],[-70.539936,-33.37097100000001],[-70.530976,-33.371263000000006],[-70.523709,-33.36954],[-70.521786,-33.37074200000001],[-70.51932,-33.370613000000006],[-70.519117,-33.37161300000001],[-70.518943,-33.372515],[-70.518136,-33.373321],[-70.526026,-33.37668599999999],[-70.528323,-33.37800099999999],[-70.530816,-33.380867],[-70.535601,-33.384835],[-70.545529,-33.38902199999999],[-70.550779,-33.390581],[-70.587256,-33.404886000000005],[-70.599209,-33.408972],[-70.601822,-33.40908000000001],[-70.60402,-33.40947499999999],[-70.605355,-33.408787],[-70.609363,-33.408440000000006],[-70.610745,-33.407384999999984],[-70.609159,-33.401874],[-70.609054,-33.40183499999999]
	], '#7C3592', 'Vitacura');
	

	Waze.map.addLayer(mapLayer);
	mapLayer.setVisibility(localStorage.ComunasSantiagoVisible == "true");
	
	displayCurrentRaidLocation();
	Waze.map.events.register("moveend", null, displayCurrentRaidLocation);
	Waze.map.events.register("zoomend", null, displayCurrentRaidLocation);
}