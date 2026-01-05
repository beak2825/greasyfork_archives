// ==UserScript==
// @name			    WME Live User View Overlay Plus
// @description 		Displays an editor's view area, editing status, and auto-follows.
// @include 			https://www.waze.com/editor/*
// @include 			https://www.waze.com/*/editor/*
// @include 			https://editor-beta.waze.com/*
// @version 			0.3.2-b
// @grant				GM_xmlhttpRequest
// @namespace			https://greasyfork.org/en/scripts/10918-wme-live-user-view-overlay-plus
// @downloadURL https://update.greasyfork.org/scripts/10918/WME%20Live%20User%20View%20Overlay%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/10918/WME%20Live%20User%20View%20Overlay%20Plus.meta.js
// ==/UserScript==

// Please do not share this below the SM level.
// Read the instructions on the sidebar tab.
// Please do not modify this script.
// Send all questions or update requests to okladriver
// Script is based off of SuperMedic's Live User View Overlay script
// Thanks to the developers of the other popular scripts for setting an example of how it's done.
// Minor glitches to be addressed in next beta version.

var luvoPlus_version = '0.3.2-b';
var SavedSettings = [];
var fillCol = "#F4EB37";
var fillOp = "15";
var strokeCol = "#000000";
var userStates = [];                 

function getId(node)
{
	return document.getElementById(node);
}

function getElementsByClassName(classname, node)
{
	if(!node) {
		node = document.getElementsByTagName("body")[0];
	}
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++) {
		if (re.test(els[i].className)) {
			 a.push(els[i]);
		 }
	 }
	return a;
}

function saveLUVOOptions()
{
	var currentSettings = {
		fillCol: getId("luvoOverlayColorPicker").value,
		fillOp: getId("luvoOpacity").value,
		strokeCol: getId("luvoStrokeColorPicker").value
	};
	localStorage.WMELUVOPlus = JSON.stringify(currentSettings);
}

function followUser()
{
	var selectedUser = getId('luvoSelectUser');
	var cbFollow = getId('luvoFollow');
	if (cbFollow.checked)
	{
		for (var i = 0; i < Waze.model.chat.users.models.length; i++)
		{
			if (Waze.model.chat.users.models[i].attributes.id == parseInt(selectedUser.value))
			{
				var userCoords = Waze.model.chat.users.models[i].attributes.center;
				var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(userCoords.lon, userCoords.lat);
				Waze.map.setCenter(xy);
				break;
			}
		}
	}
}

// populate drop-down list of editors
function updateUserList() 
{
	var selectUser = getId('luvoSelectUser');
	var numUsers = Waze.model.chat.users.models.length;
	if (numUsers === 0)
	{
		return;
	}
	// preserve current selection
	var currentId = null;
	if (selectUser.selectedIndex >= 0)
	{
		currentId = selectUser.options[selectUser.selectedIndex].value;
	}
	
	var editorIds = [];
	for (var i = 0; i < Waze.model.chat.users.models.length; i++) 
	{
		var chatUser = Waze.model.chat.users.models[i];
		editorIds.push(chatUser);
	}
	
	if (editorIds.length === 0)
		return;
	  
	selectUser.innerHTML = '';
	editorIds.sort(function(a,b)
	{
		return a.attributes.name.toUpperCase() < b.attributes.name.toUpperCase() ? -1 : a.attributes.name.toUpperCase() > b.attributes.name.toUpperCase() ? 1 : 0;
	});
	
	for (var i = 0; i < editorIds.length; i++) 
	{
		var id = editorIds[i].attributes.id;
		var usrOption = document.createElement('option');
		var usrRank = editorIds[i].attributes.rank + 1;
		var usrName = editorIds[i].attributes.name;
		var usrText = document.createTextNode(usrName + " (" + usrRank + ")");
		usrOption.setAttribute('value',id);
		if (currentId !== null && id == currentId)
			usrOption.setAttribute('selected',true);
		usrOption.appendChild(usrText);
		selectUser.appendChild(usrOption);
	}
}

function AddViewPolygon(overlayLayer,groupPoints,groupNumber,status){

    var groupName = groupNumber;

    var statusColor;
    if (status == false)
    {
        statusColor = "#00FF44";
    }
    else
    {
        statusColor = "#FF0044";
    }

    var style = {
        strokeColor: getId("luvoStrokeColorPicker").value,
        strokeOpacity: .8,
        strokeWidth: 3,
        fillColor: getId("luvoOverlayColorPicker").value,
        fillOpacity: getId("luvoOpacity").value / 100,
        label: groupName,
        labelOutlineColor: "black",
        labelOutlineWidth: 3,
        fontSize: 14,
        fontColor: statusColor,
        fontOpacity: .85,
        fontWeight: "bold"
    };

    var attributes = {
        name: groupName
    };

    var pnt = [];
    for(i = 0; i < groupPoints.length; i++)
    {
        convPoint = new OpenLayers.Geometry.Point(groupPoints[i].lon,groupPoints[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), Waze.map.getProjectionObject());
        pnt.push(convPoint);
    }

    var ring = new OpenLayers.Geometry.LinearRing(pnt);
    var polygon = new OpenLayers.Geometry.Polygon([ring]);

    var feature = new OpenLayers.Feature.Vector(polygon,attributes,style);
    overlayLayer.addFeatures([feature]);

}

function addLiveUserData()
{

    if (Waze.map == null) 
    {
        console.log('Unable to get map layer');
        return;
    }
    if (OpenLayers == null) 
    {
        console.log('Unable to get open layers');
        return;
    }
    
	mapLayers.removeAllFeatures();

	if (!getId("luvoEnable").checked)
	{
		return;
	}
	
	for(var i=0;i<Waze.model.liveUsers.users.models.length;i++) 
	{
		var name = Waze.model.liveUsers.users.models[i].attributes.name;

		var point = Waze.model.liveUsers.users.models[i].attributes.viewArea;

		var viewPoints = [{lon:point.left,lat:point.top},{lon:point.left,lat:point.bottom},{lon:point.right,lat:point.bottom},{lon:point.right,lat:point.top},{lon:point.left,lat:point.top}];

        var editingStatus = Waze.model.liveUsers.users.models[i].attributes.editing;     

		AddViewPolygon(mapLayers,viewPoints,name, editingStatus);
	}
}

function luvoPlus_init()
{
	if (localStorage.WMELUVOPlus) 
	{
		SavedSettings = JSON.parse(localStorage.WMELUVOPlus);
	}
	
	if(SavedSettings != null)
	{
		fillCol = SavedSettings.fillCol;
		fillOp = SavedSettings.fillOp;
		strokeCol = SavedSettings.strokeCol;
	}

	if (typeof Waze == 'undefined')              Waze = window.Waze;
	if (typeof Waze.loginManager == 'undefined') Waze.loginManager = window.Waze.loginManager;
	if (typeof Waze.loginManager == 'undefined') Waze.loginManager = window.loginManager;
	if (Waze.loginManager !== null && Waze.loginManager.isLoggedIn()) {
		var user = Waze.loginManager.user;
	}

	window.mapLayers = new OL.Layer.Vector("LUVO+", 
													{
														displayInLayerSwitcher: false,
														uniqueName: "__LUVOPlus"
													});
	Waze.map.addLayer(window.mapLayers);
	window.mapLayers.setVisibility(true);
    console.info('LUVO+ : Creating tab.');

	var addon       = document.createElement('section');
	addon.id        = "luvoPlus-addon";
	addon.innerHTML = ''
						+ '<b style="margin:0px; padding:0px;"><u>WME Live User View Overlay+</u></b> &nbsp; v' + luvoPlus_version + '<br>'
						+ 'Original script by SuperMedic.<br>'
						+ 'Do not share below SM level.';
    
	section = document.createElement('p');
	section.style.paddingTop = "10px";
	section.id = "luvoPlusOptions";
	section.innerHTML  = '<font size=3><b>Overlay Options:</b></font><br>'
						+ '<input type="checkbox" id="luvoEnable" checked /> '
						+ 'Enable Overlay<br>'
						+ '<input type="checkbox" id="luvoFollow" /> '
						+ 'Follow '
						+ '<select id="luvoSelectUser"></select><br>'
						+ 'Outline Color: <input type="color" id="luvoStrokeColorPicker" class="form-control" value=' + strokeCol + ' style="width:50px">'
						+ 'Fill Color: <input type = "color" id="luvoOverlayColorPicker" class="form-control" value=' + fillCol + ' style="width:50px"><br>'
						+ 'Fill Opacity (1 - 100): <input type = "number" id="luvoOpacity" value = ' + fillOp + ' min="1" max="100"><br>';
	addon.appendChild(section);
    
	section = document.createElement('p');
	section.style.paddingTop = "0px";
	section.id = "luvoPlusNotes";
	section.innerHTML  = '<font size=3><b>Usage:</b></font><br>'
						+ 'Username will be red with unsaved geometry changes, green with no edits pending save.<br><br>'
						+ 'If using follow mode, it is recommended that you be invisible or you will always be in the center of the user\'s screen.<br>'
						+ '(Offset mode to be included in update.)';
	addon.appendChild(section);
	
	var userTabs = getId('user-info');
	var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
	var tabContent = getElementsByClassName('tab-content', userTabs)[0];

	newtab = document.createElement('li');
	newtab.innerHTML = '<a id=sidepanel-luvoPlus-tab href="#sidepanel-luvoPlus" data-toggle="tab" style="" >LUVO+</a>';
	navTabs.appendChild(newtab);

	addon.id = "sidepanel-luvoPlus";
	addon.className = "tab-pane";
	
	tabContent.appendChild(addon);
	getId('luvoSelectUser').onfocus = updateUserList;
    console.info('LUVO+ : Should be all setup!');

	window.addEventListener("beforeunload", saveLUVOOptions, false);
	window.setInterval(addLiveUserData, 250);
	window.setInterval(followUser, 250);
}

function luvoPlus_wait()
{
	if ((typeof(Waze.model.countries.objects) === 'undefined') || (Object.keys(Waze.model.countries.objects).length === 0)) {
		console.info('LUVO+ Still waiting...');
        setTimeout(luvoPlus_wait, 500);
	} else {
		hasStates = Waze.model.hasStates();
        console.info('LUVO+ Okay, let\'s go!');
		luvoPlus_init();
	}
}

function luvoPlus_bootstrap()
{
    console.info('Starting LUVO+ Bootstrap');
    
	var bGreasemonkeyServiceDefined 	= false;

	try
	{
		bGreasemonkeyServiceDefined = ("object" === typeof Components.interfaces.gmIGreasemonkeyService)
	}
	catch (err)
	{ /* Ignore */ }

	if ( "undefined" === typeof unsafeWindow  ||  ! bGreasemonkeyServiceDefined)
	{
		unsafeWindow	= ( function ()
		{
			var dummyElem	= document.createElement('p');
			dummyElem.setAttribute ('onclick', 'return window;');
			return dummyElem.onclick ();
		} ) ();
	}
	
    console.info('LUVO+ Boostrap mostly complete. Waiting for service.');
	setTimeout(luvoPlus_wait, 1500);
}

luvoPlus_bootstrap();