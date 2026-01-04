// ==UserScript==
// @name                WME Argentina MR Regiones 9
// @author          Tom 'Glodenox' Puttemans, alter by fermario73
// @description		Shows the regions in the Argentina map raid
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version			5.6
// @grant			none
// @copyright		2017 Glodenox, based on work by 2015 rickzabel, based on work by 2014 davielde
// @namespace https://greasyfork.org/users/116669
// @downloadURL https://update.greasyfork.org/scripts/372221/WME%20Argentina%20MR%20Regiones%209.user.js
// @updateURL https://update.greasyfork.org/scripts/372221/WME%20Argentina%20MR%20Regiones%209.meta.js
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
        [-60.6848369541226,-32.865342038408485],[-60.72311744118315,-32.87082096288858],[-60.77169761086088,-32.88394016905173],[-60.784400552755415,-32.93625349995137],[-60.75229987526518,-33.00307729902979],[-60.67264899635893,-33.02150255160279],[-60.594371408468305,-33.015745073721845],[-60.525706857687055,-33.09516504852664],[-60.468028635030805,-33.15152121578987],[-60.37052497292143,-33.179111036963654],[-60.31833991432768,-33.177961634436144],[-60.284007638937055,-33.2078411995905],[-60.29911384010893,-33.23885918673831],[-60.26066169167143,-33.26297668262634],[-60.468028635030805,-33.63423001638802],[-60.53707339106995,-33.64254989294752],[-60.84331728755433,-33.539593368897165],[-60.91020684286616,-33.6324569844139],[-61.75470034505878,-34.41586838552505],[-62.32304422645825,-34.417800417167335],[-62.813309119036376,-34.418203327439976],[-62.951148445835145,-34.42079691155829],[-61.92121552330548,-33.10900724991379],[-61.80380116123035,-33.000504399121496],[-61.8120409073241,-32.76061927412322],[-61.96701006585772,-32.66805931261374],[-61.927934441006926,-32.495122670589986],[-62.05756244150922,-32.26664415982286],[-62.21137103525922,-32.12253904839186],[-62.256358112585815,-31.688750684119903],[-62.13215325543388,-31.59136880762208],[-61.83387586027891,-30.673521306926812],[-61.99592420012266,-30.643988012249203],[-61.98631116301328,-30.599080128222035],[-62.03025647551328,-30.590805351296215],[-62.13566373180987,-30.480077312095847],[-61.71403838110814,-27.98416658362685],[-58.84376809063116,-27.99132879927581],[-58.93973757319236,-28.131563067504363],[-59.04960085444236,-28.131563067504363],[-59.10453249506736,-28.24776174141735],[-59.05509401850486,-28.462878540051598],[-59.10727907709861,-28.59318599284976],[-59.093333974943334,-28.68870396741621],[-59.225169912443334,-29.061495235913235],[-59.362499014005834,-29.15268464788972],[-59.384471670255834,-29.203044106594536],[-59.513561025724584,-29.260567492195086],[-59.529229569945414,-29.3664461969475],[-59.586907792601664,-29.428662053557694],[-59.622613359007914,-29.779703045977907],[-59.672051835570414,-29.858339914315362],[-59.608880448851664,-29.917872089886462],[-59.581414628539164,-30.02494033287998],[-59.631391629810594,-30.14232579716282],[-59.59509430918564,-30.43633765411683],[-59.55389557871689,-30.329715752222494],[-59.03858124885869,-30.216593663083113],[-58.60736786995244,-30.15249096287827],[-58.255416451940846,-30.242548110405043],[-58.052169381628346,-30.432186560836556],[-57.950545846472096,-30.638000611941933],[-57.805149857115566,-30.72232631993596],[-57.815832693014386,-30.915740696544553],[-57.898230153951886,-30.95579039558022],[-57.859778005514386,-31.035839427675548],[-57.91751628161546,-31.153678428697525],[-57.91202311755296,-31.21712006943263],[-57.96894977866532,-31.39594155215928],[-58.06629804473869,-31.4592603787666],[-58.00510889652537,-31.528369426207266],[-57.97210214068002,-31.587100056857317],[-58.06543815827217,-31.8233258848113],[-58.19717855283142,-31.865762980062087],[-58.12571964854851,-32.004669916984355],[-58.16961718957816,-32.16196947857202],[-58.07893221107656,-32.25630673964934],[-58.12148034682576,-32.37073693425483],[-58.172966817044085,-32.38615875576312],[-58.19149430288746,-32.50355516795405],[-58.137201536299926,-32.61835957476194],[-58.09938826189989,-32.949931822462815],[-58.15559765059976,-33.090845668433126],[-58.40132119945588,-33.118888343775815],[-58.38328481200824,-33.244797307576086],[-58.48609803393555,-33.60874827864113],[-58.35664146997772,-34.00481367004661],[-58.61326328565508,-34.028202246349224],[-59.611462249769886,-33.686702109754336],[-60.07682429982219,-33.396596337487026],[-60.282039504535874,-33.15235642835613],[-60.44732646001114,-33.110746915053724],[-60.568668102986464,-32.99082607766746],[-60.6848369541226,-32.865342038408485]
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
	areaJumperRegion.label = 'Argentina (Oct 22 - Oct 29, 2018)';
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
