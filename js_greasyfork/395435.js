// ==UserScript==
// @name            WME MapRaid Xingyi - Chine
// @author          Modif Xsvn
// @namespace       https://greasyfork.org/fr/scripts/395435-wme-mapraid-xingyi-chine
// @description     Creates polygons for Regions in the Xingyi - Chine map raid
// @include         https://www.waze.com/editor*
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com
// @version         0.1
// @grant           none
// @copyright       2020
// @downloadURL https://update.greasyfork.org/scripts/395435/WME%20MapRaid%20Xingyi%20-%20Chine.user.js
// @updateURL https://update.greasyfork.org/scripts/395435/WME%20MapRaid%20Xingyi%20-%20Chine.meta.js
// ==/UserScript==

// Grep replacements to find-and-replace convert WKT to JSON areas:
// ".+\(" -> "" (empty string)
// "\(" -> "{lon: '"
// "\)\)" -> "'}" (“0\)\)” for 3D generated WKTs)
// "([0-9])\s([0-9])" -> "\1', lat: '\2"
// "," -> "'}, {lon: '" (“[[:space::]]0,” for 3D generated WKTs)

// To Change for New Raids:
const mapRaidName            = "Chine MapRaid";
const mapraidId              = "mapraidChine";
const overlayColorFill       = 0.2; // Set to a number between 0 and 1 to adjust the opacity of the color fill for the overlay
const defaultZoomLevel       = 1; // Default zoom level for when a new region is selected from the dropdown. Set to -1 to leave the zoom level unchanged
const polygonStrokeWidth     = 5; // Set the width of the line used to delimit one region from another
const overlayFillOnByDefault = false;


setTimeout(initMapRaidOverlay, 1000);
var mapLayer;


function convertPoints(list) {
    return list.map(function(point) {
        return new OL.Geometry.Point(point.lon, point.lat).transform(new OL.Projection("EPSG:4326"), W.map.getProjectionObject());
    });
}

function addRaidPolygon(raidLayer, dataList) {
    var style = {
        strokeColor: dataList.color,
        strokeOpacity: 0.8,
        strokeWidth: 5,
        fillColor: dataList.color,
        fillOpacity: (localStorage.MapRaidKSMOFill == "true" ? overlayColorFill : 0),
        label: name,
    };

    var polygon = new OL.Geometry.Polygon(new OL.Geometry.LinearRing(convertPoints(dataList.points)));
    var vector = new OL.Feature.Vector(polygon, { name: dataList.name, fullName: dataList.fullName, zoom: (dataList.zoom ? dataList.zoom : defaultZoomLevel), centerPoint: (dataList.centerPoint ? new OL.Geometry.Point(dataList.centerPoint.lon, dataList.centerPoint.lat).transform(new OL.Projection("EPSG:4326"), W.map.getProjectionObject()) : polygon.getCentroid()) }, style);
    raidLayer.addFeatures([ vector ]);
}

function createLayerToggler(parentGroup, checked, checked2, name, toggleCallback, toggleCallback2) {
    var normalizedName = name.toLowerCase().replace(/\s/g, '');
    var group = document.createElement('li');
    var groupToggler = document.createElement('div');
    groupToggler.className = 'controls-container toggler';

    // Main selector
    var groupSwitch = document.createElement('input');
    groupSwitch.id = 'layer-switcher-group_' + normalizedName;
    groupSwitch.className = 'layer-switcher-group_' + normalizedName + '_toggle';
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

    // Overlay fill selector
    var group2Div = document.createElement('div');
    group2Div.className = 'controls-container toggler';
    group2Div.style.paddingLeft = "20px";
    var groupSwitch2 = document.createElement('input');
    groupSwitch2.id = 'layer-switcher-group_' + normalizedName + '_fill';
    groupSwitch2.className = 'layer-switcher-group_' + normalizedName + '_fill_toggle';
    groupSwitch2.type = 'checkbox';
    groupSwitch2.checked = checked2;
    groupSwitch2.disabled = !checked;
    groupSwitch2.addEventListener('click', function() { toggleCallback2(groupSwitch2.checked); });
    group2Div.appendChild(groupSwitch2);
    var groupLabel2 = document.createElement('label');
    groupLabel2.htmlFor = groupSwitch2.id;
    groupLabel2.style.display = 'block';
    var groupLabelText2 = document.createElement('div');
    groupLabelText2.className = 'label-text';
    groupLabelText2.style.textOverflow = 'ellipsis';
    groupLabelText2.style.overflowX = 'hidden';
    groupLabelText2.appendChild(document.createTextNode("Fill area"));
    groupLabel2.appendChild(groupLabelText2);
    group2Div.appendChild(groupLabel2);
    groupToggler.appendChild(group2Div);

    group.appendChild(groupToggler);
    if (parentGroup !== null) {
        parentGroup.querySelector('input.toggle').addEventListener('click', function(e) {
            groupSwitch.disabled = !e.target.checked;
            if (toggleCallback) {
                toggleCallback(groupSwitch.checked && e.target.checked);
            }
        });
        parentGroup.querySelector('input.toggle').addEventListener('click', function(e) {
            groupSwitch2.disabled = !e.target.checked;
            if (toggleCallback2) {
                toggleCallback2(groupSwitch2.checked && e.target.checked);
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
}

function displayCurrentRaidLocation() {
    var raidMapCenter = W.map.getCenter();
	var raidCenterPoint = new OL.Geometry.Point(raidMapCenter.lon, raidMapCenter.lat);
	var locationDiv = document.querySelector('#topbar-container > div > div > div.location-info-region > div');
	var mapRaidDiv = locationDiv.querySelector('strong');
	if (mapRaidDiv === null) {
		mapRaidDiv = document.createElement('strong');
		mapRaidDiv.setAttribute("id", mapraidId + "LocationDisplay");
		mapRaidDiv.style.marginLeft = '5px';
		locationDiv.appendChild(mapRaidDiv);
	}
    if (localStorage.MapRaidKSMOVisible == "true") {
		var i;
		for (i = 0; i < mapLayer.features.length; i++) {
			if (mapLayer.features[i].geometry.components[0].containsPoint(raidCenterPoint)) {
				mapRaidDiv.textContent = '[' + mapRaidName + ' Region: ' + mapLayer.features[i].attributes.fullName + ']';
				mapRaidDiv.style.color = (mapLayer.features[i].style.fillColor && localStorage.MapRaidKSMOFill == "true" ? mapLayer.features[i].style.fillColor : "#FFF"); // color the top bar text with the region color if area fill is enabled
				return;
			}
		}
    }
    mapRaidDiv.textContent = '';
}

function initMapRaidOverlay() {
    if (typeof W === 'undefined' || typeof W.map === 'undefined' || typeof W.loginManager === 'undefined' || !document.querySelector('#topbar-container > div > div > div.location-info-region > div') || !document.getElementById('layer-switcher-group_display')) {
        setTimeout(initMapRaidOverlay, 800);
        return;
    }
    if (!W.loginManager.user) {
        // init on login for non-logged in users
        W.loginManager.events.register("login", null, initMapRaidOverlay);
        W.loginManager.events.register("loginStatus", null, initMapRaidOverlay);
        if (!W.loginManager.user) {
            return;
        }
    }

    // establish stored variables to track checked status of the display toggle switches
    if (localStorage.MapRaidKSMOVisible === undefined) {
        localStorage.MapRaidKSMOVisible = true;
    }
    if (localStorage.MapRaidKSMOFill === undefined) {
        localStorage.MapRaidKSMOFill = overlayFillOnByDefault;
    }

    mapLayer = new OL.Layer.Vector(mapRaidName + " Regions", {
        uniqueName: mapraidId
    });

    //replace groupPoints with custom coordinates, add or remove groups as needed (centerPoint and zoom can be set to choose where the dropdown moves the map to, else will be set to the centroid of the polygon and defaultZoomLevel respectively)
    let groupsData  =   [{
                            name: "Group 1",
                            fullName: "Xingyi",
                            color: "#F4B400",
                            points: [{lon: '104.527351800000005', lat: '24.7342753'}, {lon: '104.538882599999994', lat: '24.732324599999998'}, {lon: '104.552186300000002', lat: '24.731934800000001'}, {lon: '104.556992800000003', lat: '24.731077200000001'}, {lon: '104.570811599999999', lat: '24.717199900000001'}, {lon: '104.587891900000002', lat: '24.714938799999999'}, {lon: '104.594930000000005', lat: '24.711586100000002'}, {lon: '104.598105700000005', lat: '24.699733999999999'}, {lon: '104.620078399999997', lat: '24.674856500000001'}, {lon: '104.630635600000005', lat: '24.661596899999999'}, {lon: '104.6623929', lat: '24.660504899999999'}, {lon: '104.696124400000002', lat: '24.652704400000001'}, {lon: '104.702389999999994', lat: '24.6469317'}, {lon: '104.695523600000001', lat: '24.6354635'}, {lon: '104.711316400000001', lat: '24.6246185'}, {lon: '104.727710099999996', lat: '24.620717200000001'}, {lon: '104.740327199999996', lat: '24.6242284'}, {lon: '104.747279500000005', lat: '24.638272199999999'}, {lon: '104.747451100000006', lat: '24.647945799999999'}, {lon: '104.761870700000003', lat: '24.660426900000001'}, {lon: '104.823709600000001', lat: '24.674487899999999'}, {lon: '104.840532300000007', lat: '24.679947299999998'}, {lon: '104.847913800000001', lat: '24.691645399999999'}, {lon: '104.8578701', lat: '24.702406499999999'}, {lon: '104.865251599999993', lat: '24.737335099999999'}, {lon: '104.903703699999994', lat: '24.758692700000001'}, {lon: '104.952283800000004', lat: '24.768045300000001'}, {lon: '104.985586100000006', lat: '24.7752151'}, {lon: '105.010992000000002', lat: '24.789086000000001'}, {lon: '105.030904699999994', lat: '24.7912678'}, {lon: '105.030883799999998', lat: '24.797309899999998'}, {lon: '105.024553299999994', lat: '24.821808900000001'}, {lon: '105.035367899999997', lat: '24.838167200000001'}, {lon: '105.036872900000006', lat: '24.8775558'}, {lon: '105.064941399999995', lat: '24.899267200000001'}, {lon: '105.072113000000002', lat: '24.919475599999998'}, {lon: '105.065526300000002', lat: '24.914563999999999'}, {lon: '105.059591600000005', lat: '24.9160775'}, {lon: '105.0525308', lat: '24.9182992'}, {lon: '105.0433302', lat: '24.914909600000001'}, {lon: '105.042214999999999', lat: '24.918383800000001'}, {lon: '105.042901000000001', lat: '24.924161999999999'}, {lon: '105.040662400000002', lat: '24.929010999999999'}, {lon: '105.030970499999995', lat: '24.933286200000001'}, {lon: '105.030486699999997', lat: '24.944648900000001'}, {lon: '105.036620600000006', lat: '24.948333000000002'}, {lon: '105.037407599999995', lat: '24.9522245'}, {lon: '105.034434500000003', lat: '24.957371800000001'}, {lon: '105.030166699999995', lat: '24.959552899999998'}, {lon: '105.027548699999997', lat: '24.956601299999999'}, {lon: '105.023280299999996', lat: '24.954339600000001'}, {lon: '105.015476699999994', lat: '24.955517199999999'}, {lon: '105.010089300000004', lat: '24.958260800000001'}, {lon: '105.009330399999996', lat: '24.961586400000002'}, {lon: '105.011489299999994', lat: '24.9675847'}, {lon: '105.0049286', lat: '24.9691078'}, {lon: '105.002214899999998', lat: '24.9727064'}, {lon: '105.000897600000002', lat: '24.9754945'}, {lon: '104.997560100000001', lat: '24.979653599999999'}, {lon: '104.996395399999997', lat: '24.982841700000002'}, {lon: '104.9963628', lat: '24.9889312'}, {lon: '105.002499999999998', lat: '24.993805399999999'}, {lon: '105.004402200000001', lat: '25.000144899999999'}, {lon: '105.009216199999997', lat: '25.002389900000001'}, {lon: '105.011489699999998', lat: '25.0021399'}, {lon: '105.014976200000007', lat: '24.998668899999998'}, {lon: '105.018737700000003', lat: '24.996110900000001'}, {lon: '105.021751199999997', lat: '24.995164899999999'}, {lon: '105.023780700000003', lat: '24.996291899999999'}, {lon: '105.025833199999994', lat: '24.999023399999999'}, {lon: '105.029403700000003', lat: '25.001739400000002'}, {lon: '105.034233200000003', lat: '25.004670900000001'}, {lon: '105.0398177', lat: '25.008289399999999'}, {lon: '105.047431700000004', lat: '25.012111399999998'}, {lon: '105.053520199999994', lat: '25.014802899999999'}, {lon: '105.057853699999995', lat: '25.017738399999999'}, {lon: '105.066490200000004', lat: '25.023385900000001'}, {lon: '105.070053200000004', lat: '25.024955899999998'}, {lon: '105.075591700000004', lat: '25.024902399999998'}, {lon: '105.079643200000007', lat: '25.025317900000001'}, {lon: '105.084701199999998', lat: '25.026874400000001'}, {lon: '105.089027200000004', lat: '25.029580899999999'}, {lon: '105.091827199999997', lat: '25.031389399999998'}, {lon: '105.094619699999996', lat: '25.0329649'}, {lon: '105.097427199999998', lat: '25.036374899999998'}, {lon: '105.0989912', lat: '25.039571899999999'}, {lon: '105.099533199999996', lat: '25.0427724'}, {lon: '105.101112200000003', lat: '25.048028899999998'}, {lon: '105.103973199999999', lat: '25.0548784'}, {lon: '105.103561200000001', lat: '25.062446399999999'}, {lon: '105.104736799999998', lat: '25.070033299999999'}, {lon: '105.105476199999998', lat: '25.0748064'}, {lon: '105.108146700000006', lat: '25.0860114'}, {lon: '105.109718200000003', lat: '25.0910394'}, {lon: '105.111556699999994', lat: '25.096751900000001'}, {lon: '105.112632700000006', lat: '25.101096399999999'}, {lon: '105.112922699999999', lat: '25.1045324'}, {lon: '105.114598900000004', lat: '25.111400100000001'}, {lon: '105.117634199999998', lat: '25.113793600000001'}, {lon: '105.120637500000001', lat: '25.118117699999999'}, {lon: '105.122222699999995', lat: '25.121860900000001'}, {lon: '105.131523099999995', lat: '25.128404499999998'}, {lon: '105.132058599999993', lat: '25.1314192'}, {lon: '105.138171499999999', lat: '25.1379682'}, {lon: '105.142268599999994', lat: '25.139567199999998'}, {lon: '105.1470597', lat: '25.1415237'}, {lon: '105.154786700000002', lat: '25.1509447'}, {lon: '105.162512000000007', lat: '25.1581227'}, {lon: '105.162162699999996', lat: '25.164083399999999'}, {lon: '105.164270200000004', lat: '25.167020999999998'}, {lon: '105.173617500000006', lat: '25.167546099999999'}, {lon: '105.178736400000005', lat: '25.168252800000001'}, {lon: '105.181015900000006', lat: '25.169253999999999'}, {lon: '105.181599500000004', lat: '25.170765599999999'}, {lon: '105.176654099999993', lat: '25.172336099999999'}, {lon: '105.174224800000005', lat: '25.173828'}, {lon: '105.172923400000002', lat: '25.173984999999998'}, {lon: '105.172576300000003', lat: '25.1752413'}, {lon: '105.173527000000007', lat: '25.175404100000002'}, {lon: '105.1742402', lat: '25.1797769'}, {lon: '105.1757092', lat: '25.1835451'}, {lon: '105.177329700000001', lat: '25.184099400000001'}, {lon: '105.178224499999999', lat: '25.187653399999999'}, {lon: '105.177194499999999', lat: '25.189604899999999'}, {lon: '105.182190000000006', lat: '25.192308100000002'}, {lon: '105.181336000000002', lat: '25.195113200000002'}, {lon: '105.179291699999993', lat: '25.1962683'}, {lon: '105.176498199999997', lat: '25.1976339'}, {lon: '105.175522200000003', lat: '25.200395400000001'}, {lon: '105.172523200000001', lat: '25.2024899'}, {lon: '105.167968700000003', lat: '25.202539399999999'}, {lon: '105.164672699999997', lat: '25.202113900000001'}, {lon: '105.159858700000001', lat: '25.2010194'}, {lon: '105.1563187', lat: '25.2008264'}, {lon: '105.149513200000001', lat: '25.2018144'}, {lon: '105.142967200000001', lat: '25.2039449'}, {lon: '105.139961200000002', lat: '25.2064989'}, {lon: '105.136962699999998', lat: '25.208822399999999'}, {lon: '105.134986699999999', lat: '25.213425900000001'}, {lon: '105.134300699999997', lat: '25.2182484'}, {lon: '105.133628700000003', lat: '25.2253629'}, {lon: '105.133689700000005', lat: '25.229945900000001'}, {lon: '105.134498699999995', lat: '25.234065900000001'}, {lon: '105.137351699999996', lat: '25.239536399999999'}, {lon: '105.139137199999993', lat: '25.241811899999998'}, {lon: '105.141197199999993', lat: '25.244540900000001'}, {lon: '105.143020699999994', lat: '25.2481899'}, {lon: '105.142303200000001', lat: '25.2509479'}, {lon: '105.137298700000002', lat: '25.255584899999999'}, {lon: '105.134567200000006', lat: '25.2601984'}, {lon: '105.134353700000005', lat: '25.262035399999998'}, {lon: '105.133132700000004', lat: '25.266174400000001'}, {lon: '105.1336972', lat: '25.270980900000001'}, {lon: '105.134757699999994', lat: '25.2748679'}, {lon: '105.1383972', lat: '25.2823964'}, {lon: '105.140708700000005', lat: '25.285352899999999'}, {lon: '105.145461699999998', lat: '25.2927629'}, {lon: '105.140403699999993', lat: '25.293882400000001'}, {lon: '105.132560699999999', lat: '25.2926939'}, {lon: '105.120422199999993', lat: '25.2919409'}, {lon: '105.105010699999994', lat: '25.289104399999999'}, {lon: '105.092887700000006', lat: '25.286971900000001'}, {lon: '105.081237700000003', lat: '25.2898864'}, {lon: '105.075157200000007', lat: '25.290534900000001'}, {lon: '105.067306200000004', lat: '25.291179400000001'}, {lon: '105.060752699999995', lat: '25.289308399999999'}, {lon: '105.054222199999998', lat: '25.283080900000002'}, {lon: '105.046623199999999', lat: '25.284181400000001'}, {lon: '105.045341199999996', lat: '25.2873819'}, {lon: '105.045303200000006', lat: '25.291965399999999'}, {lon: '105.047256200000007', lat: '25.301603400000001'}, {lon: '105.045936699999999', lat: '25.310075900000001'}, {lon: '105.042617699999994', lat: '25.314409399999999'}, {lon: '105.034522699999997', lat: '25.3159654'}, {lon: '105.023857199999995', lat: '25.319566900000002'}, {lon: '105.016532699999999', lat: '25.3183744'}, {lon: '105.010467199999994', lat: '25.317189899999999'}, {lon: '105.005439699999997', lat: '25.313951400000001'}, {lon: '105.006233199999997', lat: '25.309142900000001'}, {lon: '105.010566699999998', lat: '25.303439900000001'}, {lon: '105.013900699999994', lat: '25.297502399999999'}, {lon: '105.014701700000003', lat: '25.2922364'}, {lon: '105.013961699999996', lat: '25.2899399'}, {lon: '105.0104367', lat: '25.2864799'}, {lon: '105.005401699999993', lat: '25.2843859'}, {lon: '104.999603199999996', lat: '25.282056900000001'}, {lon: '104.993797200000003', lat: '25.280414400000002'}, {lon: '104.982673700000007', lat: '25.280343899999998'}, {lon: '104.970268200000007', lat: '25.281638900000001'}, {lon: '104.959648200000004', lat: '25.281568400000001'}, {lon: '104.947273199999998', lat: '25.279882400000002'}, {lon: '104.939697199999998', lat: '25.277767399999998'}, {lon: '104.929359199999993', lat: '25.274260900000002'}, {lon: '104.917968700000003', lat: '25.275556399999999'}, {lon: '104.910087700000005', lat: '25.280086399999998'}, {lon: '104.908279199999996', lat: '25.284658400000001'}, {lon: '104.909428199999994', lat: '25.2887588'}, {lon: '104.910414099999997', lat: '25.2924547'}, {lon: '104.907904099999996', lat: '25.2960259'}, {lon: '104.906149600000006', lat: '25.2987176'}, {lon: '104.902359000000004', lat: '25.3050788'}, {lon: '104.903846200000004', lat: '25.3081587'}, {lon: '104.903846200000004', lat: '25.310393900000001'}, {lon: '104.905208599999995', lat: '25.313423799999999'}, {lon: '104.903763799999993', lat: '25.315385800000001'}, {lon: '104.904441800000001', lat: '25.3194199'}, {lon: '104.900430999999998', lat: '25.322209900000001'}, {lon: '104.895806100000001', lat: '25.324027900000001'}, {lon: '104.890115199999997', lat: '25.323229999999999'}, {lon: '104.888434000000004', lat: '25.325294299999999'}, {lon: '104.882911899999996', lat: '25.325741300000001'}, {lon: '104.881922900000006', lat: '25.3287212'}, {lon: '104.892280999999997', lat: '25.332833699999998'}, {lon: '104.890572599999999', lat: '25.340616799999999'}, {lon: '104.886634999999998', lat: '25.3440768'}, {lon: '104.885853699999998', lat: '25.3458006'}, {lon: '104.886950400000003', lat: '25.349205699999999'}, {lon: '104.887572500000005', lat: '25.351902200000001'}, {lon: '104.890329600000001', lat: '25.352557399999998'}, {lon: '104.891071299999993', lat: '25.3545683'}, {lon: '104.889917499999996', lat: '25.354791800000001'}, {lon: '104.887444900000006', lat: '25.353823500000001'}, {lon: '104.890925100000004', lat: '25.362086600000001'}, {lon: '104.881510800000001', lat: '25.360824399999998'}, {lon: '104.870330699999997', lat: '25.362268400000001'}, {lon: '104.863124099999993', lat: '25.360928999999999'}, {lon: '104.858032300000005', lat: '25.3640553'}, {lon: '104.851604899999998', lat: '25.366962999999998'}, {lon: '104.846601500000006', lat: '25.368319400000001'}, {lon: '104.841397000000001', lat: '25.371768100000001'}, {lon: '104.837664200000006', lat: '25.3708782'}, {lon: '104.835579999999993', lat: '25.3632195'}, {lon: '104.831573800000001', lat: '25.351941799999999'}, {lon: '104.819732799999997', lat: '25.344976299999999'}, {lon: '104.809867800000006', lat: '25.344442300000001'}, {lon: '104.796737800000002', lat: '25.3411328'}, {lon: '104.7813108', lat: '25.340095300000002'}, {lon: '104.765357800000004', lat: '25.342031299999999'}, {lon: '104.752441300000001', lat: '25.343303800000001'}, {lon: '104.738777799999994', lat: '25.342275300000001'}, {lon: '104.721862799999997', lat: '25.3398453'}, {lon: '104.717048800000001', lat: '25.339805299999998'}, {lon: '104.707946800000002', lat: '25.337896300000001'}, {lon: '104.702667300000002', lat: '25.335559799999999'}, {lon: '104.697128300000003', lat: '25.3327618'}, {lon: '104.690063300000006', lat: '25.331557799999999'}, {lon: '104.685463299999995', lat: '25.336100800000001'}, {lon: '104.685638299999994', lat: '25.343208300000001'}, {lon: '104.688102799999996', lat: '25.3507918'}, {lon: '104.686241300000006', lat: '25.358339300000001'}, {lon: '104.681617799999998', lat: '25.365634799999999'}, {lon: '104.674476299999995', lat: '25.370614799999998'}, {lon: '104.667838799999998', lat: '25.376518300000001'}, {lon: '104.662216799999996', lat: '25.380822800000001'}, {lon: '104.657203800000005', lat: '25.3773403'}, {lon: '104.653762799999996', lat: '25.367685300000002'}, {lon: '104.652526800000004', lat: '25.3630903'}, {lon: '104.649071000000006', lat: '25.360751499999999'}, {lon: '104.646745800000005', lat: '25.362221099999999'}, {lon: '104.642760300000006', lat: '25.359578500000001'}, {lon: '104.6451931', lat: '25.347217199999999'}, {lon: '104.6451043', lat: '25.3391907'}, {lon: '104.643772100000007', lat: '25.334775799999999'}, {lon: '104.644749099999999', lat: '25.3293976'}, {lon: '104.643505700000006', lat: '25.318800899999999'}, {lon: '104.649304299999997', lat: '25.314523099999999'}, {lon: '104.650701400000003', lat: '25.306918899999999'}, {lon: '104.637732900000003', lat: '25.3021815'}, {lon: '104.637288799999993', lat: '25.2986486'}, {lon: '104.642528799999994', lat: '25.295517100000001'}, {lon: '104.648829500000005', lat: '25.2936756'}, {lon: '104.654518499999995', lat: '25.292144499999999'}, {lon: '104.659047900000004', lat: '25.287808299999998'}, {lon: '104.662600400000002', lat: '25.2874871'}, {lon: '104.666685799999996', lat: '25.2898961'}, {lon: '104.667485099999993', lat: '25.2951959'}, {lon: '104.680007700000004', lat: '25.296400299999998'}, {lon: '104.686224499999994', lat: '25.2986486'}, {lon: '104.692263800000006', lat: '25.298487999999999'}, {lon: '104.696171500000005', lat: '25.2966412'}, {lon: '104.696882000000002', lat: '25.295597399999998'}, {lon: '104.698658300000005', lat: '25.2952762'}, {lon: '104.701500300000006', lat: '25.2987289'}, {lon: '104.704431099999994', lat: '25.298327400000002'}, {lon: '104.705756500000007', lat: '25.299539599999999'}, {lon: '104.7055857', lat: '25.297122999999999'}, {lon: '104.706384999999997', lat: '25.294392899999998'}, {lon: '104.708427700000001', lat: '25.292626299999998'}, {lon: '104.707450699999995', lat: '25.2847568'}, {lon: '104.716775999999996', lat: '25.2821067'}, {lon: '104.737716599999999', lat: '25.268926499999999'}, {lon: '104.741998800000005', lat: '25.270140600000001'}, {lon: '104.743064599999997', lat: '25.266687099999999'}, {lon: '104.7465282', lat: '25.2677312'}, {lon: '104.752745099999999', lat: '25.2672493'}, {lon: '104.752745099999999', lat: '25.279135400000001'}, {lon: '104.764568600000004', lat: '25.2796631'}, {lon: '104.7700636', lat: '25.276324599999999'}, {lon: '104.774326599999995', lat: '25.275200300000002'}, {lon: '104.777434999999997', lat: '25.2731925'}, {lon: '104.782989799999996', lat: '25.264766300000002'}, {lon: '104.789602299999999', lat: '25.256888100000001'}, {lon: '104.7950199', lat: '25.2563259'}, {lon: '104.804452800000007', lat: '25.2658849'}, {lon: '104.814114599999996', lat: '25.265321700000001'}, {lon: '104.818645399999994', lat: '25.2573267'}, {lon: '104.825926699999997', lat: '25.239858600000002'}, {lon: '104.814885899999993', lat: '25.236927099999999'}, {lon: '104.808075299999999', lat: '25.235118799999999'}, {lon: '104.804789299999996', lat: '25.229414800000001'}, {lon: '104.806414399999994', lat: '25.219585200000001'}, {lon: '104.810029200000002', lat: '25.2065959'}, {lon: '104.8134929', lat: '25.201935200000001'}, {lon: '104.806299100000004', lat: '25.1926132'}, {lon: '104.807453699999996', lat: '25.1882734'}, {lon: '104.812427200000002', lat: '25.181763499999999'}, {lon: '104.820775499999996', lat: '25.174127899999998'}, {lon: '104.820686699999996', lat: '25.1726007'}, {lon: '104.8135817', lat: '25.168340600000001'}, {lon: '104.813215799999995', lat: '25.166690599999999'}, {lon: '104.816512500000002', lat: '25.162874599999999'}, {lon: '104.813315299999999', lat: '25.1596592'}, {lon: '104.810739699999999', lat: '25.1643215'}, {lon: '104.802924200000007', lat: '25.165044999999999'}, {lon: '104.799491000000003', lat: '25.167078'}, {lon: '104.785339300000004', lat: '25.182567200000001'}, {lon: '104.775747600000003', lat: '25.188835999999998'}, {lon: '104.771129299999998', lat: '25.198077900000001'}, {lon: '104.764024300000003', lat: '25.2086851'}, {lon: '104.757363400000003', lat: '25.212702799999999'}, {lon: '104.752113199999997', lat: '25.217246899999999'}, {lon: '104.745296100000004', lat: '25.217432800000001'}, {lon: '104.740933100000007', lat: '25.213988400000002'}, {lon: '104.738535100000007', lat: '25.209488700000001'}, {lon: '104.736137200000002', lat: '25.2076405'}, {lon: '104.732229399999994', lat: '25.209006500000001'}, {lon: '104.728913300000002', lat: '25.207277600000001'}, {lon: '104.725834899999995', lat: '25.2020959'}, {lon: '104.722015999999996', lat: '25.198319000000001'}, {lon: '104.722044999999994', lat: '25.194568799999999'}, {lon: '104.730916300000004', lat: '25.188736599999999'}, {lon: '104.732046699999998', lat: '25.1844176'}, {lon: '104.732674700000004', lat: '25.175778999999999'}, {lon: '104.731921099999994', lat: '25.173051000000001'}, {lon: '104.726771499999998', lat: '25.1696408'}, {lon: '104.7237571', lat: '25.163843199999999'}, {lon: '104.717221699999996', lat: '25.156557599999999'}, {lon: '104.716095499999994', lat: '25.144288700000001'}, {lon: '104.711573900000005', lat: '25.142355800000001'}, {lon: '104.711699499999995', lat: '25.139058500000001'}, {lon: '104.702138700000006', lat: '25.1330642'}, {lon: '104.699492899999996', lat: '25.130613400000001'}, {lon: '104.697736800000001', lat: '25.129314099999998'}, {lon: '104.696295699999993', lat: '25.126794100000001'}, {lon: '104.693702299999998', lat: '25.125632400000001'}, {lon: '104.695718400000004', lat: '25.121969499999999'}, {lon: '104.692974300000003', lat: '25.1185747'}, {lon: '104.690781599999994', lat: '25.104446500000002'}, {lon: '104.688094800000002', lat: '25.1029643'}, {lon: '104.684098700000007', lat: '25.098701899999998'}, {lon: '104.683385999999999', lat: '25.0895844'}, {lon: '104.683560200000002', lat: '25.079487400000001'}, {lon: '104.678320200000002', lat: '25.078039499999999'}, {lon: '104.672619900000001', lat: '25.076220299999999'}, {lon: '104.663220899999999', lat: '25.076058199999999'}, {lon: '104.651476299999999', lat: '25.070916'}, {lon: '104.6418666', lat: '25.0691503'}, {lon: '104.625414000000006', lat: '25.068140199999998'}, {lon: '104.616920300000004', lat: '25.065222899999998'}, {lon: '104.613931100000002', lat: '25.061869900000001'}, {lon: '104.617246399999999', lat: '25.060702599999999'}, {lon: '104.622429100000005', lat: '25.061279200000001'}, {lon: '104.624580199999997', lat: '25.060908000000001'}, {lon: '104.629925400000005', lat: '25.058169299999999'}, {lon: '104.633311000000006', lat: '25.0577842'}, {lon: '104.6384714', lat: '25.058554399999998'}, {lon: '104.643051200000002', lat: '25.058610000000002'}, {lon: '104.651402899999994', lat: '25.061772900000001'}, {lon: '104.654972999999998', lat: '25.061930700000001'}, {lon: '104.660023499999994', lat: '25.0608264'}, {lon: '104.665509299999997', lat: '25.061930700000001'}, {lon: '104.672562499999998', lat: '25.061141899999999'}, {lon: '104.674046200000006', lat: '25.059973299999999'}, {lon: '104.683098799999996', lat: '25.056724599999999'}, {lon: '104.6874526', lat: '25.050413899999999'}, {lon: '104.692561299999994', lat: '25.046447000000001'}, {lon: '104.698859600000006', lat: '25.039763900000001'}, {lon: '104.698250099999996', lat: '25.0354247'}, {lon: '104.702342700000003', lat: '25.028244999999998'}, {lon: '104.702952199999999', lat: '25.022485199999998'}, {lon: '104.704834099999999', lat: '25.012291300000001'}, {lon: '104.710701999999998', lat: '25.006229900000001'}, {lon: '104.711659900000001', lat: '25.000390100000001'}, {lon: '104.710963300000003', lat: '24.999048500000001'}, {lon: '104.705564499999994', lat: '24.9963652'}, {lon: '104.702255600000001', lat: '24.996680900000001'}, {lon: '104.698424200000005', lat: '24.998180399999999'}, {lon: '104.695986099999999', lat: '24.995654900000002'}, {lon: '104.692590100000004', lat: '24.992498099999999'}, {lon: '104.687974999999994', lat: '24.992498099999999'}, {lon: '104.683387699999997', lat: '24.988634000000001'}, {lon: '104.682227999999995', lat: '24.984289799999999'}, {lon: '104.684317800000002', lat: '24.9816851'}, {lon: '104.685449800000001', lat: '24.979396099999999'}, {lon: '104.684753200000003', lat: '24.977580700000001'}, {lon: '104.672562499999998', lat: '24.9743444'}, {lon: '104.667686200000006', lat: '24.970397599999998'}, {lon: '104.664986799999994', lat: '24.970476600000001'}, {lon: '104.661560800000004', lat: '24.967759300000001'}, {lon: '104.662785299999996', lat: '24.955685500000001'}, {lon: '104.655321299999997', lat: '24.948609000000001'}, {lon: '104.650793300000004', lat: '24.9450562'}, {lon: '104.649487199999996', lat: '24.943871900000001'}, {lon: '104.651054599999995', lat: '24.941266299999999'}, {lon: '104.650483600000001', lat: '24.9390541'}, {lon: '104.649061099999997', lat: '24.936057300000002'}, {lon: '104.646124200000003', lat: '24.930238500000002'}, {lon: '104.643400499999998', lat: '24.928797899999999'}, {lon: '104.641637900000006', lat: '24.926159699999999'}, {lon: '104.637644800000004', lat: '24.920578200000001'}, {lon: '104.636164500000007', lat: '24.913154800000001'}, {lon: '104.633552199999997', lat: '24.910232799999999'}, {lon: '104.634335899999996', lat: '24.907389599999998'}, {lon: '104.626568000000006', lat: '24.902966800000002'}, {lon: '104.622799200000003', lat: '24.899536900000001'}, {lon: '104.617864900000001', lat: '24.897617799999999'}, {lon: '104.612485500000005', lat: '24.897304099999999'}, {lon: '104.607041100000004', lat: '24.896588999999999'}, {lon: '104.605306299999995', lat: '24.893996900000001'}, {lon: '104.594349699999995', lat: '24.887564600000001'}, {lon: '104.587676999999999', lat: '24.879832799999999'}, {lon: '104.580759200000003', lat: '24.867051199999999'}, {lon: '104.5773382', lat: '24.862019100000001'}, {lon: '104.575099499999993', lat: '24.860369899999998'}, {lon: '104.573791700000001', lat: '24.860088399999999'}, {lon: '104.572740499999995', lat: '24.857783300000001'}, {lon: '104.574343799999994', lat: '24.855696099999999'}, {lon: '104.570218499999996', lat: '24.847259600000001'}, {lon: '104.564553799999999', lat: '24.8439072'}, {lon: '104.560415399999997', lat: '24.842743200000001'}, {lon: '104.558992000000003', lat: '24.838589599999999'}, {lon: '104.552424000000002', lat: '24.8322289'}, {lon: '104.550392099999996', lat: '24.829490799999999'}, {lon: '104.547043900000006', lat: '24.828478700000002'}, {lon: '104.543494800000005', lat: '24.8250429'}, {lon: '104.542757199999997', lat: '24.821499500000002'}, {lon: '104.538200799999998', lat: '24.816805200000001'}, {lon: '104.538398900000004', lat: '24.8153635'}, {lon: '104.539354000000003', lat: '24.812320499999998'}, {lon: '104.540364299999993', lat: '24.807944500000001'}, {lon: '104.539482599999999', lat: '24.806853799999999'}, {lon: '104.537746200000001', lat: '24.804876799999999'}, {lon: '104.535936599999999', lat: '24.801856900000001'}, {lon: '104.536168900000007', lat: '24.796460799999998'}, {lon: '104.539849599999997', lat: '24.793258399999999'}, {lon: '104.539695300000005', lat: '24.787126399999998'}, {lon: '104.538667200000006', lat: '24.785638899999999'}, {lon: '104.5388138', lat: '24.784415500000001'}, {lon: '104.540951699999994', lat: '24.782050399999999'}, {lon: '104.543519799999999', lat: '24.7806958'}, {lon: '104.543808999999996', lat: '24.777638799999998'}, {lon: '104.538963800000005', lat: '24.770914600000001'}, {lon: '104.538111799999996', lat: '24.768960100000001'}, {lon: '104.540381300000007', lat: '24.762963599999999'}, {lon: '104.540191100000001', lat: '24.7582998'}, {lon: '104.533398099999999', lat: '24.751400700000001'}, {lon: '104.530394700000002', lat: '24.746207699999999'}, {lon: '104.526867600000003', lat: '24.739657099999999'}, {lon: '104.527351800000005', lat: '24.7342753'}]
                        },
                        {
                            name: "Group 2",
                            fullName: "Zone",
                            color: "#EE9C96",
                            points: [{lon: '104.88724', lat: '25.10532'}, {lon: '104.92786', lat: '25.10532'}, {lon: '104.92786', lat: '25.08500'}, {lon: '104.88724', lat: '25.08500'}]
                        }];

    groupsData.forEach(function(groupData) {
    	addRaidPolygon(mapLayer, groupData);
    });

    W.map.addLayer(mapLayer);
    mapLayer.setVisibility(localStorage.MapRaidKSMOVisible == "true");

    createLayerToggler(document.getElementById('layer-switcher-group_display').parentNode.parentNode, localStorage.MapRaidKSMOVisible == "true", localStorage.MapRaidKSMOFill == "true", mapRaidName, function(checked) {
        localStorage.MapRaidKSMOVisible = checked;
        var fillCheckBox = document.getElementById('layer-switcher-group_' + mapRaidName.toLowerCase().replace(/\s/g, '') + '_fill');
        if (fillCheckBox) fillCheckBox.disabled = !checked;
        var areaJumper = document.getElementById(mapraidId + "Dropdown");
        areaJumper.style.width = (checked ? "80%" : 0);
        areaJumper.style.visibility = (checked ? "" : "hidden");
        if (areaJumper.parentNode) {
            areaJumper.parentNode.style.flexGrow = (checked ? "1" : "");
        }
        mapLayer.setVisibility(checked);
        displayCurrentRaidLocation();
    }, function(checked) {
        localStorage.MapRaidKSMOFill = checked;
        console.log(mapLayer.features);
        var newFeatures = [];
        mapLayer.features.forEach(function(feature) {
            var newFeature = feature.clone();
            newFeature.style.fillOpacity = (checked ? overlayColorFill : 0);
            newFeatures.push(newFeature);
        });
        mapLayer.destroyFeatures();
        mapLayer.addFeatures(newFeatures);
        displayCurrentRaidLocation();
    });

    var areaJumper = document.getElementById(mapraidId + "Dropdown");
    if (!areaJumper) {
        areaJumper = document.createElement('select');
        areaJumper.id = mapraidId + "Dropdown";
        areaJumper.style.marginTop = '4px';
        areaJumper.style.display = 'block';
        var areaPlaceholder = document.createElement('option');
        areaPlaceholder.textContent = 'Jump to..';
        areaJumper.appendChild(areaPlaceholder);
        areaJumper.addEventListener('change', function() {
            W.map.setCenter(areaJumper.selectedOptions[0].centroid);
            if (areaJumper.selectedOptions[0].zoom != -1) W.map.zoomTo(areaJumper.selectedOptions[0].zoom);
            areaJumper.selectedIndex = 0;
            areaJumper.blur();
        });
    }
	var areaJumperRegion = document.createElement('optgroup');
	areaJumperRegion.label = mapRaidName + " Regions:";
	mapLayer.features.forEach(function(feature) {
		var area = document.createElement('option');
		area.textContent = feature.attributes.name;
		area.centroid = [feature.attributes.centerPoint.x, feature.attributes.centerPoint.y];
		area.zoom = feature.attributes.zoom;
		areaJumperRegion.appendChild(area);
	});
	areaJumper.appendChild(areaJumperRegion);

	if (!document.getElementById(mapraidId + "Dropdown")) {
		if (window.getComputedStyle(document.getElementById('edit-buttons').parentNode).display == 'flex') {
			var areaJumperContainer = document.createElement('div');
			areaJumperContainer.style.flexGrow = (localStorage.MapRaidKSMOVisible == "true" ? "1" : "");
			areaJumperContainer.style.paddingTop = '6px';
			areaJumper.style.width = (localStorage.MapRaidKSMOVisible == "true" ? "80%" : 0);
			areaJumper.style.visibility = (localStorage.MapRaidKSMOVisible == "true" ? "" : "hidden");
			areaJumper.style.margin = '0 auto';
			areaJumperContainer.appendChild(areaJumper);
			document.getElementById('edit-buttons').parentNode.insertBefore(areaJumperContainer, document.getElementById('edit-buttons'));
		} else {
			document.getElementById('edit-buttons').parentNode.insertBefore(areaJumper, document.getElementById('edit-buttons'));
		}
	}

    displayCurrentRaidLocation();
    W.map.events.register("moveend", null, displayCurrentRaidLocation);
}