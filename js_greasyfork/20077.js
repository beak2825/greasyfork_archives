// ==UserScript==
// @name                WME Fix UI
// @namespace           https://greasyfork.org/en/users/46070
// @description         Allows alterations to the WME UI to fix things screwed up or ignored by Waze
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/editor*
// @include             https://beta.waze.com/*/editor*
// @exclude             https://www.waze.com/*user/editor/*
// @supportURL          https://www.waze.com/forum/viewtopic.php?f=819&t=191178
// @version             2.57
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/20077/WME%20Fix%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/20077/WME%20Fix%20UI.meta.js
// ==/UserScript==

// Thanks to (in no particular order)
//    Bellhouse, Twister-UK, Timbones, Dave2084, Rickzabel, Glodenox,
//    JJohnston84, SAR85, Cardyin, JustinS83, berestovskyy, Sebiseba,
//    The_Cre8r, ABelter

/* eslint-env jquery */
/* global I18n,W,OpenLayers */
// jshint esversion: 6

// Notes
//new idea: hide Parking lot payment types when cost is FREE
//new idea: red notification icon
//

(function ()
{
// global variables
var wmefu_version = "2.57";
var oldVersion;
var prefix = "WMEFU";
var tabAttempts = 0;
var wmeFUAddon;
var debug = false;
var wmeFUinitialising = true;
var kineticDragParams;
var yslider;
var layersButton,refreshButton,shareButton;
//Mutation Observer for daterangepicker in Restrictions
var RestrictionObserver = new MutationObserver(function(mutations) {
	if (getById('_cbMondayFirst').checked || getById('_cbISODates').checked) {
		mutations.forEach(function(mutation) {
			if ($(mutation.target).hasClass('modal-content')) {
				if (mutation.addedNodes.length > 0) {
					if ($(".datepicker").length > 0) {
						var DRP = $(".datepicker")[0];
						if (getById('_cbMondayFirst').checked && getById('_cbISODates').checked) {
							$(DRP).data("daterangepicker").locale.firstDay = 1;
							$(DRP).data("daterangepicker").locale.daysOfWeek = ['Mo','Tu','We','Th','Fr','Sa','Su'];
							$(DRP).data("daterangepicker").locale.format = "YYYY-MM-DD";
							DRP.value = $(DRP).data("daterangepicker").startDate._i + " - " + $(DRP).data("daterangepicker").endDate._i;
						} else if (getById('_cbMondayFirst').checked) {
							$(DRP).data("daterangepicker").locale.firstDay = 1;
							$(DRP).data("daterangepicker").locale.daysOfWeek = ['Mo','Tu','We','Th','Fr','Sa','Su'];
						} else if (getById('_cbISODates').checked) {
							$(DRP).data("daterangepicker").locale.format = "YYYY-MM-DD";
							DRP.value = $(DRP).data("daterangepicker").startDate._i + " - " + $(DRP).data("daterangepicker").endDate._i;
						}
					}
				}
			}
		});
	}
});
//Mutation Observer for daterangepicker in Closures
var ClosureObserver = new MutationObserver(function(mutations) {
	if (getById('_cbMondayFirst').checked) {
		mutations.forEach(function(mutation) {
			if (mutation.target.className == "closures") {
				if (mutation.addedNodes.length > 0) {
					if (mutation.addedNodes[0].firstChild.classList.contains("edit-closure")) {
						$(".end-date").data("daterangepicker").locale.firstDay = 1;
						$(".end-date").data("daterangepicker").locale.daysOfWeek = ['Mo','Tu','We','Th','Fr','Sa','Su'];
						$(".start-date").data("daterangepicker").locale.firstDay = 1;
						$(".start-date").data("daterangepicker").locale.daysOfWeek = ['Mo','Tu','We','Th','Fr','Sa','Su'];
					}
				}
			}
		});
	}
});
//Fix for date/time formats in WME released Oct/Nov 2016 - provided by Glodenox
I18n.translations[I18n.currentLocale()].time = {};
I18n.translations[I18n.currentLocale()].time.formats = {};
I18n.translations[I18n.currentLocale()].time.formats.long = "%a %b %d %Y, %H:%M";
I18n.translations[I18n.currentLocale()].date.formats = {};
I18n.translations[I18n.currentLocale()].date.formats.long = "%a %b %d %Y, %H:%M";
I18n.translations[I18n.currentLocale()].date.formats.default = "%a %b %d %Y";
if (I18n.currentLocale() == 'en-GB') {
  I18n.translations['en-GB'].update_requests.panel.reported = 'Reported on: %{date}';
}

function init1() {
	console.group(prefix + ": initialising...");
	console.time(prefix + ": initialisation time");
	logit("Starting init1","debug");
	// go round again if map container isn't there yet
	if(!window.W.map) {
		logit("waiting for WME...","warning");
		setTimeout(init1, 200);
		return;
	}
	// create tab content and store it
	wmeFUAddon = createAddon();
	// insert the content as a tab
	addMyTab(null,0);
	//pass control to init2
	init2();
}

function init2() {
	logit("Starting init2","debug");
	//go round again if my tab isn't there yet
	if (!getById('sidepanel-FixUI')) {
		logit("Waiting for my tab to appear...","warning");
		setTimeout(init2, 200);
		return;
	}
	// setup event handlers for my controls:
	getById('_cbMoveZoomBar').onclick = createZoomBar;
	getById('_cbFixExternalProviders').onclick = fixExternalProviders;
	getById('_cbMoveChatIcon').onclick = moveChatIcon;
	getById('_cbHighlightInvisible').onclick = highlightInvisible;
	getById('_cbDarkenSaveLayer').onclick = darkenSaveLayer;
	getById('_cbSwapRoadsGPS').onclick = swapRoadsGPS;
	getById('_cbShowMapBlockers').onclick = showMapBlockers;
	getById('_cbHideLinks').onclick = hideLinks;
	getById('_cbShrinkTopBars').onclick = shrinkTopBars;
	getById('_cbCompressSegmentTab').onclick = compressSegmentTab;
	getById('_cbCompressLayersMenu').onclick = compressLayersMenu;
	getById('_cbLayersColumns').onclick = compressLayersMenu;
	getById('_cbRestyleReports').onclick = restyleReports;
	getById('_cbEnhanceChat').onclick = enhanceChat;
	getById('_cbNarrowSidePanel').onclick = narrowSidePanel;
	getById('_inpUICompression').onchange = applyEnhancements;
	getById('_inpUIContrast').onchange = applyEnhancements;
	getById('_inpASX').onchange = shiftAerials;
	getById('_inpASX').onwheel = shiftAerials;
	getById('_inpASY').onchange = shiftAerials;
	getById('_inpASY').onwheel = shiftAerials;
	getById('_inpASO').onchange = shiftAerials;
	getById('_inpASO').onwheel = shiftAerials;
	getById('_resetAS').onclick = function() {
		getById('_inpASX').value = 0;
		getById('_inpASY').value = 0;
		shiftAerials();
		};
	getById('_inpGSVContrast').onchange = adjustGSV;
	getById('_inpGSVBrightness').onchange = adjustGSV;
	getById('_cbGSVInvert').onchange = adjustGSV;
	getById('_inpGSVWidth').onchange = GSVWidth;
	getById('_cbDisableBridgeButton').onchange = disableBridgeButton;
	getById('_btnKillNode').onclick = killNode;
	getById('_cbDisableKinetic').onclick = disableKinetic;
	getById('_cbDisableScrollZoom').onclick = disableScrollZoom;
	getById('_cbDisableSaveBlocker').onclick = disableSaveBlocker;
	getById('_cbColourBlindTurns').onclick = colourBlindTurns;
	getById('_cbHideMenuLabels').onclick = hideMenuLabels;
	getById('_cbUnfloatButtons').onclick = unfloatButtons;
	getById('_cbMoveUserInfo').onclick = moveUserInfo;
	getById('_cbHackGSVHandle').onclick = hackGSVHandle;
	getById('street-view-drag-handle').ondblclick = GSVWidthReset;
	getById('_cbEnlargeGeoNodes').onclick = enlargeGeoNodes;
	getById('_inpEnlargeGeoNodes').onchange = enlargeGeoNodes;
	getById('_cbEnlargeGeoHandlesFU').onclick = enlargeGeoHandles;
	getById('_inpEnlargeGeoHandles').onchange = enlargeGeoHandles;

	//REGISTER WAZE EVENT HOOKS
	// event to recreate my tab after changing WME units
	W.prefs.on('change:isImperial', function() {
		tabAttempts = 0;
		tabsLooper();
		createDSASection();
		if (getById('_cbUnfloatButtons').checked) unfloat();
	});
	// events for Aerial Shifter
	W.map.events.register("zoomend", null, shiftAerials);
	W.map.events.register("moveend", null, shiftAerials);
	W.map.getOLMap().baseLayer.events.register("loadend", null, shiftAerials);
	// events to change menu bar color based on map comments checkbox
	W.map.events.register("zoomend", null, warnCommentsOff);
	W.map.events.register("moveend", null, warnCommentsOff);
	// event to re-hack my zoom bar if it's there
	W.map.getOLMap().baseLayer.events.register("loadend", null, ZLI);
	//window resize event to resize chat
	window.addEventListener('resize', enhanceChat, true);
	//window resize event to resize layers menu
	window.addEventListener('resize', compressLayersMenu, true);
	//event to re-hack toolbar buttons on exiting HN mode
	W.editingMediator.on('change:editingHouseNumbers', function() {
		if (getById('_cbUnfloatButtons').checked) {
			if (W.editingMediator.attributes.editingHouseNumbers) unfloat();
			if (W.editingMediator.attributes.editingEnabled) unfloat();
		}
	});
	
	//create Aerial Shifter warning div
	var ASwarning = document.createElement('div');
	ASwarning.id = "WMEFU_AS";
	ASwarning.innerHTML = "Aerials Shifted";
	ASwarning.setAttribute('style','top:20px; left:0px; width:100%; position:absolute; z-index:10000; font-size:100px; font-weight:900; color:rgba(255, 255, 0, 0.4); text-align:center; pointer-events:none; display:none;');
	getById("WazeMap").appendChild(ASwarning);

	loadSettings();
	// Add an extra checkbox so I can test segment panel changes easily
	if (W.loginManager.user.userName == 'iainhouse') {
		logit("creating segment detail debug checkbox","info");
		var extraCBSection = document.createElement('p');
		extraCBSection.innerHTML = '<input type="checkbox" id="_cbextraCBSection" />';
		getById('left-app-head').appendChild(extraCBSection);
		getById('_cbextraCBSection').onclick = FALSEcompressSegmentTab;
		getById('_cbextraCBSection').checked = getById('_cbCompressSegmentTab').checked;
	}
	//create Panel Swap div
	var WMEPS_div = document.createElement('div');
	var WMEPS_div_sub = document.createElement('div');
	WMEPS_div.id = "WMEFUPS";
	WMEPS_div.setAttribute('style','color: lightgrey; margin-left: 5px; font-size: 20px;');
	WMEPS_div.title = "Panel Swap: when map elements are selected, this lets you\nswap between the edit panel and the other tabs.";
	WMEPS_div_sub.innerHTML = '<i class="fa fa-sticky-note"></i>';
	WMEPS_div.appendChild(WMEPS_div_sub);
	insertNodeBeforeNode(WMEPS_div,getById('mode-switcher-region'));
	getById("WMEFUPS").onclick = PSclicked;
	W.selectionManager.events.register("selectionchanged", null, PSicon);
	//create Permalink Count div
	var WMEPC_div = document.createElement('div');
	var WMEPC_div_sub = document.createElement('div');
	WMEPC_div.id = "WMEFUPC";
	WMEPC_div.classList.add("toolbar-button","toolbar-button-with-icon");
	WMEPC_div.title = "Number of selectable map objects in the URL\nClick to reselect them.";
	WMEPC_div_sub.classList.add("item-container","WMEFU-toolbar-button");
	var totalItems;
	if (location.search.match("segments")) totalItems = window.location.search.match(new RegExp("[?&]segments?=([^&]*)"))[1].split(',').length;
	else if (location.search.match("venues")) totalItems = window.location.search.match(new RegExp("[?&]venues?=([^&]*)"))[1].split(',').length;
	else if (location.search.match("nodes")) totalItems = Math.min(1,window.location.search.match(new RegExp("[?&]nodes?=([^&]*)"))[1].split(',').length);
	else if (location.search.match("mapComments")) totalItems = Math.min(1,window.location.search.match(new RegExp("[?&]mapComments?=([^&]*)"))[1].split(',').length);
	else if (location.search.match("cameras")) totalItems = Math.min(1,window.location.search.match(new RegExp("[?&]cameras?=([^&]*)"))[1].split(',').length);
	else totalItems = 0;
	WMEPC_div_sub.innerHTML = '<span class="item-icon" style="display:inline-flex"><i style="margin-top:8px" class="fa fa-link WMEFUPCicon"></i>&nbsp;' + totalItems +'</span>';
	WMEPC_div.appendChild(WMEPC_div_sub);
	insertNodeBeforeNode(WMEPC_div,getById('search'));
	WMEPC_div.onclick = PCclicked;
	//Create Turn Popup Blocker div
	var WMETPB_div = document.createElement('div');
	var WMETPB_div_sub = document.createElement('div');
	WMETPB_div.id = "WMEFUTPB";
	WMETPB_div.classList.add("toolbar-button","toolbar-button-with-icon");
	WMETPB_div.title = "Disable/enable the turn arrow popup dialogue";
	WMETPB_div_sub.classList.add('item-container',"WMEFU-toolbar-button");
	WMETPB_div_sub.innerHTML = '<span class="item-icon fa-stack fa-2x" style="display:inline-flex; font-size:10px !important"><i class="fa fa-comment fa-stack-2x"></i><i class="fa fa-arrow-up fa-inverse fa-stack-1x"></i></span>';
	WMETPB_div.appendChild(WMETPB_div_sub);
	insertNodeBeforeNode(WMETPB_div,getById('search'));
	WMETPB_div.onclick = killTurnPopup;
	addGlobalStyle('.WMEFU-toolbar-button { padding: 0px !important; }');
	//Create layer pin div
	var WMEPin_div = document.createElement('div');
	var WMEPin_div_sub = document.createElement('div');
	WMEPin_div.id = "WMEFUPIN";
	WMEPin_div.style.opacity = '0.2';
	WMEPin_div.style.display = 'none';
	WMEPin_div.onclick = pinLayers;
	WMEPin_div_sub.classList.add('pinned','text-checkbox');
	WMEPC_div_sub.setAttribute('style','margin: 0px; font-size: 24px;');
	WMEPin_div_sub.innerHTML = '<input id="layer-switcher-pinned-input" type="checkbox" name="pinned" style="display:none"><label for="layer-switcher-pinned-input" title="Pin layer switcher"><i class="waze-icon-pin pin-label"></i></label>';
	WMEPin_div.appendChild(WMEPin_div_sub);
	insertNodeBeforeNode(WMEPin_div,getByClass('js-close-layer-switcher')[0]);
	addGlobalStyle('.pin-label { margin: 0; font-size: 18px; line-height: 18px } #WMEFUPIN label { margin-bottom: 0 }');
	// overload the window unload function to save my settings
	window.addEventListener("beforeunload", saveSettings, false);
	if (!W.selectionManager.getSelectedFeatures) {
		W.selectionManager.getSelectedFeatures = W.selectionManager.getSelectedItems;
	}
	// Alert to new version
	if (oldVersion != wmefu_version) {
		alert("WME Fix UI has been updated to version " + wmefu_version + "\n" +
		ChromeWarning() +
		"\n" +
		"Version 2.57 - 2021-07-25\n" +
		"* Updates for background changes in WME map model\n" +
		"\n" +
		"Previous highlights (in the last 6 months):\n" +
		"* 2.56 New feature: Adjust size of geo/junction nodes\n" +
		"* 2.56 New feature: Adjust size of geo handles\n" +
		"* 2.52 New feature: Auto-expanded element history items\n" +
		"");
		saveSettings();
	}
	// fix for sidebar display problem in Safari, requested by edsonajj
	var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	if (isSafari) {
		addGlobalStyle('.flex-parent { height: 99% !important; }');
	}
	// stop wobbling status bar
	addGlobalStyle('.WazeControlMousePosition { font-family: monospace }');
	// move closed node icon below node markers
	// apply the settings
	shiftAerials();
	// attempt to make liveuser names show
	setTimeout(applyAllSettings, 1000);
	W.model.liveUsers.users.on("add", function() {
		try {
			liveUserAdded.apply(this, arguments);
		} catch (e) {
			logit(e,"error");
		}
	});
	addGlobalStyle('.live-user-marker { pointer-events: none; }');
	// auto-expand all history 
	addGlobalStyle('.element-history-item.closed .tx-content { display: block; }');
	logit("Initialisation complete");
	console.timeEnd(prefix + ": initialisation time");
	console.groupEnd();
}

function createAddon() {
	//create the contents of my side-panel tab
	var addon = document.createElement('section');
	var section = document.createElement('p');
	addon.id = "sidepanel-FixUI";
	section.style.paddingTop = "4px";
	section.style.lineHeight = "11px";
	section.style.fontSize = "11px";
	section.id = "fuContent";
	section.innerHTML = "";
	section.innerHTML += '<b title="Shift aerial images layer to match GPS tracks and reduce image opacity">Aerial Shifter</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	section.innerHTML += '<span class="fa fa-power-off" id="_resetAS" title="Clear X/Y offsets"></span><br>';
	section.innerHTML += '<div style="display:inline-block"><input type="number" id="_inpASX" title="horizontal shift" max=100 min=-100 step=5 style="height:20px; width:40px;text-align:right;"/><b>m</b><span class="fa fa-arrow-right"></span></div>';
	section.innerHTML += '<div id="as2" style="display:inline-block;padding:0 5px;"><input type="number" id="_inpASY" title="vertical shift" max=100 min=-100 step=5 style="height:20px; width:40px;text-align:right;"/><b>m</b><span class="fa fa-arrow-up"></span></div>';
	section.innerHTML += '<div id="as3" style="display:inline-block"><input type="number" id="_inpASO" title="opacity" max=100 min=10 step=10 style="height:20px; width:40px;text-align:right;"/><b>%</b><span class="fa fa-adjust"></span></div>';
	section.innerHTML += '<br>';
	section.innerHTML += '<br>';

	section.innerHTML += '<b title="Adjust contrast, brightness, colours & width for Google Street View images">GSV image adjust</b><br>';
	section.innerHTML += '<span title="Contrast"><input type="number" id="_inpGSVContrast" max=200 min=25 step=25 style="height:20px; width:42px;text-align:right;"/><b>%</b><span class="fa fa-adjust"></span></span>&nbsp;&nbsp;';
	section.innerHTML += '<span title="Brightness"><input type="number" id="_inpGSVBrightness" max=200 min=25 step=25 style="height:20px; width:42px;text-align:right;"/><b>%</b><span class="fa fa-sun-o"></span></span>&nbsp;&nbsp;';
	section.innerHTML += '<span title="Invert colours"><input type="checkbox" id="_cbGSVInvert"/><span class="fa fa-tint"></span></span>&nbsp;&nbsp;';
	section.innerHTML += '<span title="Default width"><input type="number" id="_inpGSVWidth" max=90 min=10 step=10 style="height:20px; width:36px;text-align:right;"/><b>%</b><span class="fa fa-arrows-h"></span></span>&nbsp;&nbsp;&nbsp;';
	section.innerHTML += '<br>';
	section.innerHTML += '<br>';
	section.innerHTML += '<b>UI Enhancements</b><br>';
	section.innerHTML += '<input type="checkbox" id="_cbShrinkTopBars" /> ' +
			'<span title="Because we can\'t afford to waste screen space, particularly on\nstuff we didn\'t ask for and don\'t want, like the black bar.\nAnd why does the reload button have a re-do icon?!">Compress/enhance bars above the map</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbCompressSegmentTab" /> ' +
			'<span title="Because I\'m sick of having to scroll the side panel because of oversized fonts and wasted space">Compress/enhance side panel contents</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbCompressLayersMenu" /> ' +
			'<span title="Because it\'s already too big for small screens and Waze only plan to make it bigger">Compress/enhance layers menu</span><br>';
	section.innerHTML += '<span id="layersColControls"><input type="checkbox" id="_cbLayersColumns" /> ' +
			'<span title="Widen the layers menu to 2 columns - particulary for netbook users\nWon\'t work without some compression turned on">Two-column layers menu</span><br></span>';
	section.innerHTML += '<input type="checkbox" id="_cbRestyleReports" /> ' +
			'<span title="Another UI element configured for developers with massive screens instead of normal users">Compress/enhance report panels (UR/MP)</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbEnhanceChat" /> ' +
			'<span title="A perfect example of the new WME UI. Looks very stylish,\nbut destroys usability and utterly ignores small-screen users.">Compress/enhance Chat panel</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbNarrowSidePanel" /> ' +
			'<span title="If you have a netbook, Waze isn\'t interested in your experience.\nYou need every bit of map space you can get - so have a present from me!">Reduce width of the side panel</span><span title="This will definitely interfere with scripts that rely on a fixed width for their tab contents." style="font-size: 16px; color: red;">&#9888</span><br>';
	section.innerHTML += '<br>';
	section.innerHTML += '<b title="Control the amount of compression/enhancment">UI Enhancement controls<br>';
	section.innerHTML += '<div style="display:inline-block"><select id="_inpUICompression" title="Compression enhancement" style="height:20px; padding:0px; border-radius=0px;"><option value="2">High</option><option value="1">Low</option><option value="0">None</option></select><span class="fa fa-compress"></span></div>&nbsp;&nbsp;&nbsp;&nbsp;';
	section.innerHTML += '<div style="display:inline-block"><select id="_inpUIContrast" title="Contrast enhancement" style="height:20px; padding:0px; border-radius=0px;"><option value="2">High</option><option value="1">Low</option><option value="0">None</option></select><span class="fa fa-adjust"></span></div>';
	section.innerHTML += '<br>';
	section.innerHTML += '<button id="_btnKillNode" style = "height: 18px; margin-top: 5px;" title="Hide the junction nodes layer to allow access to Map Comments hidden under nodes.\nThis stays in effect until the page is zoomed/panned/refreshed.">Hide junction nodes</button>&nbsp;&nbsp;';
	section.innerHTML += '<br><br>';
	section.innerHTML += '<b>UI Fixes/changes</b><br>';
	section.innerHTML += '<input type="checkbox" id="_cbMoveZoomBar" /> ' +
			'<span title="Because nobody likes a pointless UI change that breaks your workflow,\nimposed by idiots who rarely use the editor and don\'t listen to feedback.\nNO MATTER HOW HARD THEY TRY, I WILL BRING IT BACK!">Re-create zoom bar & move map controls</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbFixExternalProviders" /> ' +
			'<span title="The External Providers interface has a dexcription box that will only show one live of text.\nThis fixes that.">Expand External Provider details for places</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbMoveChatIcon" /> ' +
			'<span title="Here\'s a truly outstanding example of making a stupid change to the UI in order to\ndeal with another stupid change to the UI!\nBecause HQ couldn\'t make the new layers menu auto-hide, they moved the chat icon.\nTick this box to put it back where it belongs.">Move Chat icon back to right</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbHighlightInvisible" /> ' +
			'<span title="Typical WME design - the chat icon changes when you\'re invisible,\nbut the change is practically invisible!\nThis option provides a more obvious highlight.">Highlight invisible mode</span></span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbLayersMenuMoreOptions" /> ' +
			'<span title="This function shows all options in the Layers menu at all times.\nNote that changing this only updates when the page loads.">Show all options in Layers menu</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbDarkenSaveLayer" /> ' +
			'<span title="It\'s not bad enough they\'ve removed all the contrast to give you eyestrain,\nbut then they blind you every time you save. ">Darken screen overlay when saving</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbSwapRoadsGPS" /> ' +
			'<span title="Guess what? Waze thinks the GPS layer should now be over the segments layer.\nWhy should you have any choice about that?">Move GPS layer below segments layer</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbShowMapBlockers" /> ' +
			'<span title="Some WME elements block access to the map layers. These problems have been reported as bugs.\nUntil they\'re fixed, this functions makes them visible.">Show map-blocking WME bugs</span></span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbHideLinks" /> ' +
			'<span title="Hide the small Links bar at the bottom of the side panel,\nto give more usable space there.">Hide Links panel</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbDisableBridgeButton" /> ' +
			'<span title="The Bridge button is rarely useful, but often used incorrectly.\nIt\'s best to keep it disabled unless you need it.">Disable Bridge button</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbMondayFirst" /> ' +
			'<span title="Requests to have calendar items localised with Monday as the first day of the week\ngo back a while. Now you don\'t have to wait for Waze.">Start calendars on Monday</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbISODates" /> ' +
			'<span title="Dates in the Restrictions dialogues are all in American format - MM/DD/YY\nFine if you\' American, confusing as hell for the rest of us!\nThis changes the dates to ISO format, matching the Closures dialogue">ISO dates in Restrictions</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbDisableKinetic" /> ' +
			'<span title="Kinetic panning is a new WME feature: if you release the mouse whilst dragging the map,\nthe map will keep moving. It can be very useful for panning large distances.\nIt can also be very annoying. Now YOU have control.">Disable Kinetic Panning</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbDisableScrollZoom" /> ' +
			'<span title="Zooming with the scroll wheel can be problematic when using an Apple Magic Mouse, which\nscrolls on touch. This will disable scroll-to-zoom.">Disable scroll-to-zoom</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbDisableSaveBlocker" /> ' +
			'<span title="When you hit Save, WME places a blocking element over the map until the save is complete\nThis disables that element, allowing you to pan the map and use GSV whilst a slow save is in progress.">Disable map blocking during save</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbColourBlindTurns" /> ' +
			'<span title="Change green turn arrows blue in order to make them more visible\nfor users with the most common type of colour blindness.">Change green turn arrows to blue</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbHideMenuLabels" /> ' +
			'<span title="Hide the text labels on the toolbar menus to save space on small screens">Hide menu labels</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbUnfloatButtons" /> ' +
			'<span title="Move Layers/Refresh buttons back into the toolbar and Share button into the\nfooter.\nWaze put little enough effort into giving us enough map area to work with,\nand then they drop little button turds all over it!">Remove floating buttons from map area</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbMoveUserInfo" /> ' +
			'<span title="The new user info button is very useful, but it\'s not a map editing control,\nso it shouldn\'t be in the toolbar. The same goes for the notification button.\nThis function moves them both to a sensible location.">Move user info/notification buttons</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbHackGSVHandle" /> ' +
			'<span title="Whilst being able to adjust the GSV width is useful, the drag handle\ninvisibly covers 30 pixels of map and is very easy to drag accidentally.\nThis function transforms it to a button drag control that\'s much less\nlikely to be used by accident.">Minimise GSV drag handle</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbEnlargeGeoNodes" /> ' +
			'<span title="If you\'re getting old, like me, grabbing those little circles is a pain!\nThis control lets you enlarge the geo nodes (and junction nodes for segments),\nwhich define the shapes of segments and place boundaries.">Enlarge geo/junction nodes</span><div style="display:inline-block">&nbsp;&nbsp;<input type="number" id="_inpEnlargeGeoNodes" title="radius (default=6)" max=12 min=8 step=2 style="height:16px; padding:0 0 0 2px;; border:1px solid; width:37px;"/></div><span style = "color: red; font-weight: bold;">&nbsp;&nbsp;--- NEW</span><br>';
	section.innerHTML += '<input type="checkbox" id="_cbEnlargeGeoHandlesFU" /> ' +
			'<span title="If you\'re getting old, like me, grabbing those little circles is a pain!\nThis control lets you enlarge the geo handles, used to add geo nodes to segments and place boundaries.">Enlarge geo handles</span><div style="display:inline-block">&nbsp;&nbsp;<input type="number" id="_inpEnlargeGeoHandles" title="radius (default=4)" max=10 min=6 step=2 style="height:16px; padding:0 0 0 2px;; border:1px solid; width:37px;"/></div><span style = "color: red; font-weight: bold;">&nbsp;&nbsp;--- NEW</span><br>';
	section.innerHTML += '<br>';
	section.innerHTML += '<b><a href="https://www.waze.com/forum/viewtopic.php?f=819&t=191178" title="Forum topic" target="_blank"><u>' +
			'WME Fix UI</u></a></b> &nbsp; v' + wmefu_version;
	// Text for end of line for new features
	// <span style = "color: red; font-weight: bold;">--- NEW</span>
	// Same text for forum topic
	// [b][color=#BF0000]--- NEW[/color][/b]
	addon.appendChild(section);
	addon.className = "tab-pane";
	return addon;
}

function addMyTab(model,modeID) {
	// if (getById('_cbUnfloatButtons').checked) float();
	if (modeID === 0) {
		logit("entering default mode, so creating tab");
		tabAttempts = 0;
		tabsLooper();
		createDSASection();
	} else {
		logit("entering event mode, so not initialising");
		return;
	}
}

function tabsLooper() {
	tabAttempts += 1;
	if (tabAttempts > 20) {
		// tried 20 times to create tab without luck
		logit("unable to create my tab after 20 attempts","error");
		return;
	}
	var userTabs = getById('user-info');
	var navTabs = getByClass('nav-tabs', userTabs)[0];
	if (typeof navTabs === "undefined") {
		//the basic tabs aren't there yet, so I can't add mine
		logit("waiting for NavTabs","warning");
		setTimeout(tabsLooper, 200);
	} else{
		var tabContent = getByClass('tab-content', userTabs)[0];
		var newtab = document.createElement('li');
		newtab.innerHTML = '<a href="#sidepanel-FixUI" data-toggle="tab" title="Fix UI">FU</a>';
		navTabs.appendChild(newtab);
		tabContent.appendChild(wmeFUAddon);
	}
}

function loadSettings() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	// Remove old V1 settings if they're still hanging around
	if (localStorage.WMEFixUI) {
		localStorage.removeItem("WMEFixUI");
	}
	var options;
	if (localStorage.WMEFUSettings) {
		options = JSON.parse(localStorage.WMEFUSettings);
	} else {
		options = {};
	}
	oldVersion = (options.oldVersion !== undefined ? options.oldVersion : "0.0");
	getById('_cbMoveZoomBar').checked = (options.moveZoomBar !== undefined ? options.moveZoomBar : true);
	getById('_cbShrinkTopBars').checked = (options.shrinkTopBars !== undefined ? options.shrinkTopBars : true);
	getById('_cbCompressSegmentTab').checked = ( options.restyleSidePanel !== undefined ? options.restyleSidePanel : true);
	getById('_cbRestyleReports').checked = ( options.restyleReports !== undefined ? options.restyleReports : true);
	getById('_cbEnhanceChat').checked = ( options.enhanceChat !== undefined ? options.enhanceChat : true);
	getById('_cbNarrowSidePanel').checked = ( options.narrowSidePanel !== undefined ? options.narrowSidePanel : false);
	getById('_inpASX').value = ( options.aerialShiftX !== undefined ? options.aerialShiftX : 0);
	getById('_inpASY').value = ( options.aerialShiftY !== undefined ? options.aerialShiftY : 0);
	getById('_inpASO').value = ( options.aerialOpacity !== undefined ? options.aerialOpacity : 100);
	getById('_cbFixExternalProviders').checked = ( options.fixExternalProviders !== undefined ? options.fixExternalProviders : true);
	getById('_inpGSVContrast').value = ( options.GSVContrast !== undefined ? options.GSVContrast : 100);
	getById('_inpGSVBrightness').value = ( options.GSVBrightness !== undefined ? options.GSVBrightness : 100);
	getById('_cbGSVInvert').checked = ( options.GSVInvert !== undefined ? options.GSVInvert : false);
	getById('_inpGSVWidth').value = ( options.GSVWidth !== undefined ? options.GSVWidth : 50);
	getById('_cbCompressLayersMenu').checked = ( options.restyleLayersMenu !== undefined ? options.restyleLayersMenu : true);
	getById('_cbLayersColumns').checked = ( options.layers2Cols !== undefined ? options.layers2Cols : false);
	getById('_cbMoveChatIcon').checked = ( options.moveChatIcon !== undefined ? options.moveChatIcon : true);
	getById('_cbHighlightInvisible').checked = ( options.highlightInvisible !== undefined ? options.highlightInvisible : true);
	getById('_cbDarkenSaveLayer').checked = ( options.darkenSaveLayer !== undefined ? options.darkenSaveLayer : true);
	getById('_cbLayersMenuMoreOptions').checked = ( options.layersMenuMore !== undefined ? options.layersMenuMore : true);
	getById('_inpUIContrast').value = ( options.UIContrast !== undefined ? options.UIContrast : 1);
	getById('_inpUICompression').value = ( options.UICompression !== undefined ? options.UICompression : 1);
	getById('_cbSwapRoadsGPS').checked = ( options.swapRoadsGPS !== undefined ? options.swapRoadsGPS : true);
	getById('_cbShowMapBlockers').checked = ( options.showMapBlockers !== undefined ? options.showMapBlockers : true);
	getById('_cbHideLinks').checked = ( options.hideLinks !== undefined ? options.hideLinks : false);
	getById('_cbDisableBridgeButton').checked = ( options.disableBridgeButton !== undefined ? options.disableBridgeButton : true);
	getById('_cbISODates').checked = ( options.ISODates !== undefined ? options.ISODates : true);
	getById('_cbMondayFirst').checked = ( options.mondayFirst !== undefined ? options.mondayFirst : false);
	getById('_cbDisableKinetic').checked = ( options.disableKinetic !== undefined ? options.disableKinetic : false);
	getById('_cbDisableScrollZoom').checked = ( options.disableScrollZoom !== undefined ? options.disableScrollZoom : false);
	getById('_cbDisableSaveBlocker').checked = ( options.disableSaveBlocker !== undefined ? options.disableSaveBlocker : false);
	getById('_cbColourBlindTurns').checked = ( options.colourBlindTurns !== undefined ? options.colourBlindTurns : false);
	getById('_cbHideMenuLabels').checked = ( options.hideMenuLabels !== undefined ? options.hideMenuLabels : false);
	getById('_cbUnfloatButtons').checked = ( options.unfloatButtons !== undefined ? options.unfloatButtons : false);
	getById('_cbMoveUserInfo').checked = ( options.moveUserInfo !== undefined ? options.moveUserInfo : false);
	getById('_cbHackGSVHandle').checked = ( options.hackGSVHandle !== undefined ? options.hackGSVHandle : false);
	getById('_cbEnlargeGeoNodes').checked = ( options.enlargeGeoNodes !== undefined ? options.enlargeGeoNodes : false);
	getById('_inpEnlargeGeoNodes').value = ( options.geoNodeSize !== undefined ? options.geoNodeSize : 8);
	getById('_cbEnlargeGeoHandlesFU').checked = ( options.enlargeGeoHandles !== undefined ? options.enlargeGeoHandles : false);
	getById('_inpEnlargeGeoHandles').value = ( options.geoHandleSize !== undefined ? options.geoHandleSize : 6);
}

function saveSettings() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (localStorage) {
		logit("saving options to local storage");
		var options = {};
		options.oldVersion = wmefu_version;
		options.moveZoomBar = getById('_cbMoveZoomBar').checked;
		options.shrinkTopBars = getById('_cbShrinkTopBars').checked;
		options.restyleSidePanel = getById('_cbCompressSegmentTab').checked;
		options.restyleReports = getById('_cbRestyleReports').checked;
		options.enhanceChat = getById('_cbEnhanceChat').checked;
		options.narrowSidePanel = getById('_cbNarrowSidePanel').checked;
		options.aerialShiftX = getById('_inpASX').value;
		options.aerialShiftY = getById('_inpASY').value;
		options.aerialOpacity = getById('_inpASO').value;
		options.fixExternalProviders = getById('_cbFixExternalProviders').checked;
		options.GSVContrast = getById('_inpGSVContrast').value;
		options.GSVBrightness = getById('_inpGSVBrightness').value;
		options.GSVInvert = getById('_cbGSVInvert').checked;
		options.GSVWidth = getById('_inpGSVWidth').value;
		options.restyleLayersMenu = getById('_cbCompressLayersMenu').checked;
		options.layers2Cols = getById('_cbLayersColumns').checked;
		options.moveChatIcon = getById('_cbMoveChatIcon').checked;
		options.highlightInvisible = getById('_cbHighlightInvisible').checked;
		options.darkenSaveLayer = getById('_cbDarkenSaveLayer').checked;
		options.layersMenuMore = getById('_cbLayersMenuMoreOptions').checked;
		options.UIContrast = getById('_inpUIContrast').value;
		options.UICompression = getById('_inpUICompression').value;
		options.swapRoadsGPS = getById('_cbSwapRoadsGPS').checked;
		options.showMapBlockers = getById('_cbShowMapBlockers').checked;
		options.hideLinks = getById('_cbHideLinks').checked;
		options.disableBridgeButton = getById('_cbDisableBridgeButton').checked;
		options.ISODates = getById('_cbISODates').checked;
		options.mondayFirst = getById('_cbMondayFirst').checked;
		options.disableKinetic = getById('_cbDisableKinetic').checked;
		options.disableScrollZoom = getById('_cbDisableScrollZoom').checked;options.disableSaveBlocker = getById('_cbDisableSaveBlocker').checked;
		options.colourBlindTurns = getById('_cbColourBlindTurns').checked;
		options.hideMenuLabels = getById('_cbHideMenuLabels').checked;
		options.unfloatButtons = getById('_cbUnfloatButtons').checked;
		options.moveUserInfo = getById('_cbMoveUserInfo').checked;
		options.hackGSVHandle = getById('_cbHackGSVHandle').checked;
		options.enlargeGeoNodes = getById('_cbEnlargeGeoNodes').checked;
		options.geoNodeSize = getById('_inpEnlargeGeoNodes').value;
		options.enlargeGeoHandles = getById('_cbEnlargeGeoHandlesFU').checked;
		// alert(options.enlargeGeoHandles);
		options.geoHandleSize = getById('_inpEnlargeGeoHandles').value;
		localStorage.WMEFUSettings = JSON.stringify(options);
	}
}

function applyAllSettings() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	console.group(prefix + ": applying all settings");
		kineticDragParams = W.map.controls.find(control => control.dragPan).dragPan.kinetic;
		shrinkTopBars();
		compressSegmentTab();
		restyleReports();
		enhanceChat();
		narrowSidePanel();
		fixExternalProviders();
		warnCommentsOff();
		adjustGSV();
		GSVWidth();
		compressLayersMenu();
		moveChatIcon();
		highlightInvisible();
		darkenSaveLayer();
		swapRoadsGPS();
		showMapBlockers();
		hideLinks();
		disableBridgeButton();
		disableKinetic();
		disableScrollZoom();
		disableSaveBlocker();
		colourBlindTurns();
		hideMenuLabels();
		createZoomBar();
		unfloatButtons();
		moveUserInfo();
		hackGSVHandle();
		enlargeGeoNodes();
		enlargeGeoHandles();
	console.groupEnd();
	RestrictionObserver.observe(getById('dialog-container'), { childList: true, subtree: true });
	ClosureObserver.observe(getById('edit-panel'), { childList: true, subtree: true });
	if (getById('_cbLayersMenuMoreOptions').checked === true) {
		$("#layer-switcher-region > div > div > div.more-options-toggle > label > div").click();
		Array.from(getByClass('upside-down',getById('layer-switcher-region'))).forEach(function(item){item.click();});
	}
	wmeFUinitialising = false;
	saveSettings();
}

function applyEnhancements() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	shrinkTopBars();
	compressSegmentTab();
	restyleReports();
	enhanceChat();
	compressLayersMenu();
	hideLinks();
	moveUserInfo();
}

function createZoomBar() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (getById('_cbMoveZoomBar').checked) {
		yslider = new OpenLayers.Control.PanZoomBar({zoomStopHeight:9 , panIcons:false});
		yslider.position.x = 10;
		yslider.position.y = 35;
		yslider.id = 'WMEFUzoom';
		W.map.addControl(yslider);
		getById('WMEFUzoom').appendChild(getByClass('bottom overlay-buttons-container')[0]);
		var styles = "";
		//Overall bar
		styles += '.olControlPanZoomBar { left: 10px; top: 35px; height: 158px; border: 1px solid #f0f2f2; background-color: #f0f2f2; border-radius: 30px; width: 24px; box-sizing: initial; }';
		styles += '#WMEFUzoom { z-index: 1200 !important; }';
		//zoom in/out buttons
		styles += '.olButton { background-color: white; border-radius: 30px; width: 24px; height: 24px; cursor: pointer; }';
		styles += '.olControlZoomButton { padding: 3px 5px; font-size: 18px; }';
		//slider stops
		styles += '.yslider-stops { width: 24px; height: 110px; background-color: #f3f3f3; background-image: linear-gradient(90deg, transparent 45%, #dedede 45%, #dedede 55%, transparent 55%), linear-gradient(#dedede 1px, transparent 1px); background-size: 50% 8px; background-repeat: repeat-y; background-position: 6px; }';
		//slider
		styles += '.slider { position: absolute; font-size: 15px; font-weight: 900; line-height: 1; text-align: center; width: 24px; height: 18px; margin-top: -29px; padding-top: 1px; border: 1px solid lightgrey; border-radius: 10px; background-color: white; cursor: ns-resize; }';
		// kill new zoom buttons
		styles += '.zoom-bar-region { display: none; }';
		// shift UR/MP panel to the right
		styles += '.panel.show { margin-left: 55px; }';
		// if gsv control is moved
		styles += '.bottom.overlay-buttons-container { position: absolute; top: 170px; }';
		styles += '.street-view-region { margin-bottom: 8px; }';
		addStyle(prefix + fname,styles);
		W.map.events.register("zoomend", null, ZLI);
		getById('WMEFUzoom').appendChild(getByClass('bottom overlay-buttons-container')[0]);
		ZLI();
		getById('WMEFUzoom').appendChild(getByClass('bottom overlay-buttons-container')[0]);
	} else {
		if (yslider) {
			getById('overlay-buttons').appendChild(getByClass('bottom overlay-buttons-container')[0]);
			yslider.destroy();
		}
		W.map.events.unregister("zoomend", null, ZLI);
		removeStyle(prefix + fname);
		removeStyle('WMEMTU');
	}	
}

function ZLI() {
	if (yslider) {
		//Need to reset the OpenLayers-created settings from the zoom bar when it's redrawn
		//Overall bar
		yslider.div.style.left = "";
		yslider.div.style.top = "";
		//zoom in/out buttons
		yslider.buttons[0].style = "";
		yslider.buttons[0].innerHTML = "<div class='olControlZoomButton fa fa-plus' ></div>";
		yslider.buttons[1].style = "";
		yslider.buttons[1].innerHTML = "<div class='olControlZoomButton fa fa-minus' ></div>";
		//slider stops
		yslider.zoombarDiv.classList.add("yslider-stops");
		yslider.zoombarDiv.classList.remove("olButton");
		yslider.zoombarDiv.style="";
		//slider
		yslider.slider.innerHTML = "";
		yslider.slider.style = "";
		yslider.slider.classList.add("slider");
		yslider.moveZoomBar();
		//Actually set the ZLI
		yslider.slider.innerText = W.map.getZoom();
		yslider.slider.title = "Zoom level indicator by WMEFU";
		switch (W.map.getZoom()) {
			case 0:
			case 1:
				yslider.slider.style.background = '#ef9a9a';
				yslider.slider.title += "\nCannot permalink any segments at this zoom level";
				break;
			case 2:
			case 3:
				yslider.slider.style.background = '#ffe082';
				yslider.slider.title += "\nCan only permalink primary or higher at this zoom level";
				break;
			default:
				yslider.slider.style.background = '#ffffff';
				yslider.slider.title += "\nCan permalink any segments at this zoom level";
				break;
		}
	}
}

function moveUserInfo() {
	// Now functioning correctly for prod & beta
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbMoveUserInfo').checked) {
		// styles += '#user-box-region { margin-left: 5px; }';
		styles += '.notifications-button { display: flex; }';
		styles += '#app-head aside #left-app-head .waze-logo { width: 50px; }';
		styles += '#user-toolbar .notifications-button { padding: 0 4px; }';
		styles += '#user-toolbar .notifications-button .counter { left: ' + ['84px','76px','68px'][getById('_inpUICompression').value] + '; }';
		addStyle(prefix + fname,styles);
		// insertNodeAfterNode(getById('notifications-button-region'),getByClass('waze-logo')[0]);
		// insertNodeAfterNode(getById('user-box-region'),getByClass('waze-logo')[0]);
		insertNodeAfterNode(getById('user-toolbar'),getByClass('waze-logo')[0]);
		//Fix to move control button of Invalidated Camera Mass Eraser
		if (getById("_UCME_btn")) {
			getById("advanced-tools").appendChild(getById("_UCME_btn"));
			document.getElementById('UCME_btn').parentNode.removeChild(document.getElementById('UCME_btn'));
		}
	} else {
		removeStyle(prefix + fname);
		// insertNodeAfterNode(getById('user-box-region'),getById('edit-buttons'));
		// insertNodeAfterNode(getById('notifications-button-region'),getById('user-box-region'));
		insertNodeAfterNode(getById('user-toolbar'),getById('edit-buttons'));
	}
}

function shrinkTopBars() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	var levelIcon;
	if (getById('_cbShrinkTopBars').checked) {
		//always do this stuff
		//event mode button
		styles += '#mode-switcher-region .title-button .icon { font-size: 13px; font-weight: bold; color: black; }';
		//black bar
		styles += '#topbar-container { pointer-events: none; }';
		styles += '#map #topbar-container .topbar > div { pointer-events: initial; }';
		//change toolbar buttons - from JustinS83
		$('#mode-switcher-region .title-button .icon').removeClass('w-icon-caret-down');
		$('#mode-switcher-region .title-button .icon').addClass('fa fa-calendar');
		// HN editing tweaks
		styles += '#map-lightbox .content { pointer-events: none; }';
		styles += '#map-lightbox .content > div { pointer-events: initial; }';
		styles += '#map-lightbox .content .header { pointer-events: none !important; }';
		styles += '.toolbar .toolbar-button.add-house-number { background-color: #61cbff; float: right; font-weight: bold; }';
		styles += '.waze-icon-exit { background-color: #61cbff; font-weight: bold; }';
		// event mode button
		styles += '.toolbar.toolbar-mte .add-button { background-color: orange; font-weight: bold; }';
		var contrast = getById('_inpUIContrast').value;
		var compress = getById('_inpUICompression').value;
		// fix for narrow windows and new toolbar
		var nbuttons = 3 + (getById('_cbUnfloatButtons').checked ? 2 : 0);
		var minW = nbuttons * ([58,49,33][compress]) + [80,65,55][compress];
		styles += '#edit-buttons { min-width: ' + minW + 'px; }';
		if (compress > 0) {
			//overall menu bar
			styles += '#app-head aside #left-app-head { height: ' + ['','35px','24px'][compress] + '; padding-left: ' + ['','9px','2px'][compress] + '; }';
			styles += '#app-head { height: ' + ['','35px','24px'][compress] + '; }';
			styles += '#app-head aside .short-title { font-size: ' + ['','13px','12px'][compress] + '; margin-right: 4px; }';
			styles += '#app-head aside #debug { padding-right: ' + ['','10px','6px'][compress] + '; line-height: ' + ['','15px','12px'][compress] + '; white-space: nowrap; }';
			styles += '.mode-switcher-view .title-button .icon { line-height: ' + ['','35px','24px'][compress] + '; }';
			styles += '.mode-switcher-view .dropdown-menu { top: ' + ['','35px','24px'][compress] + '; }';
			styles += '.toolbar { font-size: ' + ['','13px','12px'][compress] + '; }';
			styles += '.toolbar { height: ' + ['','35px','24px'][compress] + '; }';
			//search box
			styles += '#search { padding-top: ' + ['','3px','1px'][compress] + '; }';
			styles += '.form-search { height: ' + ['','27px','22px'][compress] + '; }';
			styles += '.form-search .search-query { height: ' + ['','27px','22px'][compress] + '; font-size: ' + ['','13px','12px'][compress] + '; }';
			styles += '.form-search .input-wrapper .search-icon { top: ' + ['','4px','3px'][compress] + '; font-size: ' + ['','18px','16px'][compress] + '; left: ' + ['','9px','6px'][compress] + '; }';
			styles += '.form-search .search-query { padding-left: ' + ['','34px','24px'][compress] + ';; }';
			//edit-buttons section
			styles += '#edit-buttons { margin-right: ' + ['','9px','2px'][compress] + '; }';
			//toolbar dropdowns
			styles += '.toolbar .toolbar-group { margin-right: ' + ['','14px','8px'][compress] + '; padding-top: 0px; }';
			styles += '.toolbar .toolbar-icon { width: ' + ['','31px','22px'][compress] + '; height: ' + ['','34px','22px'][compress] + '; line-height: ' + ['','34px','22px'][compress] + '; margin-top: 0px; }';
			styles += '.toolbar .group-title { height: ' + ['','34px','24px'][compress] + '; line-height: ' + ['','34px','24px'][compress] + '; margin-left: ' + ['','31px','22px'][compress] + '; margin-top: ' + ['','1px','0px'][compress] + '; }';
			styles += '.toolbar .dropdown-menu { top: ' + ['','34px','24px'][compress] + ' !important; left: ' + ['','7px','4px'][compress] + ' !important; }';
			//toolbar buttons
			styles += '.toolbar .toolbar-button { margin-top: ' + ['','3px','1px'][compress] + '; margin-left: 3px; padding-left: ' + ['','10px','5px'][compress] + '; padding-right: ' + ['','10px','5px'][compress] + '; height: ' + ['','27px','22px'][compress] + '; line-height: ' + ['','27px','22px'][compress] + '; }';
			styles += '.toolbar .toolbar-button { padding-left: ' + ['','2px','2px'][compress] + '; padding-right: ' + ['','2px','2px'][compress] + '; }';
			styles += '.toolbar .toolbar-button .item-container { padding-left: ' + ['','9px','2px'][compress] + '; padding-right: ' + ['','9px','2px'][compress] + '; }';
			styles += '.toolbar .item-icon { font-size: ' + ['','22px','20px'][compress] + ' !important; }';
			//keep save button wide enough for counter
			styles += '.toolbar .toolbar-button.waze-icon-save { padding-right: 15px !important; width: ' + ['','62px','52px'][compress] + '; margin-left: 3px; }';
			styles += '.toolbar .toolbar-button.waze-icon-save .counter { top: ' + ['','-3px','-1px'][compress] + '; }';
			styles += '.toolbar .toolbar-button > .item-icon { top: ' + ['','5px','2px'][compress] + '; }';
			styles += '.toolbar .toolbar-separator { height: ' + ['','34px','22px'][compress] + '; }';
			//extra hack for my Permalink Counter button
			styles += '.WMEFUPCicon { margin-top: ' + ['','4px !important','2px !important'][compress] + '; }';
			//floating buttons
			styles += '.overlay-button { height: ' + ['','33px','26px'][compress] + '; width: ' + ['','33px','26px'][compress] + '; font-size: ' + ['','22px','20px'][compress] + '; padding: ' + ['','3px','1px'][compress] + '; }';
			styles += '#Info_div { height: ' + ['','33px','26px'][compress] + ' !important; width: ' + ['','33px','26px'][compress] + ' !important; }';
			styles += '.zoom-bar-container {width: ' + ['','33px','26px'][compress] + ' !important; }';
			styles += '.zoom-bar-container .overlay-button {height: ' + ['','33px','26px'][compress] + ' !important; }';
			styles += '#overlay-buttons .overlay-buttons-container > div:last-child { margin-bottom: 0; }';
			//layers menu
			// styles += '.layer-switcher .toolbar-button { margin-top: ' + ['','1px','0px'][compress] + ' !important; font-size: ' + ['','22px','20px'][compress] + ' !important; height: ' + ['','32px','24px'][compress] + '; }';
			//user button
			styles += '#user-box-region { margin-right: ' + ['','8px','2px'][compress] + '; }';
			styles += '.user-box-avatar { height: ' + ['','32px','23px'][compress] + ' !important; font-size: ' + ['','22px','20px'][compress] + '; }';
			styles += '.app .level-icon { width: ' + ['','32px','23px'][compress] + ' !important;  height: ' + ['','32px','23px'][compress] + ' !important;}';
			levelIcon = getByClass('user-box-avatar')[0].firstElementChild;
			levelIcon.classList.remove('level-icon','level-icon-' + (W.loginManager.user.rank+1));
			styles += '#user-box-region .user-box-avatar .user-box-avatar-container img { display: none; }';
			levelIcon.classList.add('item-icon','w-icon','w-icon-user');
			//new save menu
			styles += '.changes-log-region { top: ' + ['','26px','21px'][compress] + '; }';
			// fix for WME Edit Count Monitor
			// no longer needed - it's calculating it's own position!
			//styles += '#edit-buttons > div > div:nth-child(10) { margin-top: ' + ['','3px','1px'][compress] + ' !important; }';
			//black bar
			styles += '.topbar { height: ' + ['','24px','18px'][compress] + '; line-height: ' + ['','24px','18px'][compress] + '; }';
			//fix for WME Presets button
			styles += '#WMEPresetsDiv > i { height: 100%;}';
		} else {
			levelIcon = getByClass('user-box-avatar')[0].firstElementChild;
			levelIcon.classList.add('level-icon','level-icon-' + (W.loginManager.user.rank+1));
			levelIcon.classList.remove('item-icon','w-icon','w-icon-user');
		}
		if (contrast > 0) {
			//toolbar dropdown menus
			styles += '.toolbar .group-title { color: black; }';
			styles += '.toolbar .toolbar-button { border-radius: 8px; border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; color: black; }';
			//layers icon - until Waze fix it
			styles += '.layer-switcher .waze-icon-layers.toolbar-button{ background-color: white; }';
		}
//		//fix for buttons of WME GIS script
//		styles += '.btn-group-sm { text-shadow: initial; background: white; }';
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
		levelIcon = getByClass('user-box-avatar')[0].firstElementChild;
		//change toolbar buttons - from JustinS83
		$('#mode-switcher-region .title-button .icon').removeClass('fa fa-calendar');
		$('#mode-switcher-region .title-button .icon').addClass('fa fa-angle-down');
		levelIcon = getByClass('user-box-avatar')[0].firstElementChild;
		levelIcon.classList.add('level-icon','level-icon-' + (W.loginManager.user.rank+1));
		levelIcon.classList.remove('item-icon','w-icon','w-icon-user');
}
	window.dispatchEvent(new Event('resize'));
}

function FALSEcompressSegmentTab() {
	getById('_cbCompressSegmentTab').checked = getById('_cbextraCBSection').checked;
	compressSegmentTab();
}

function compressSegmentTab() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbCompressSegmentTab').checked) {
		var contrast = getById('_inpUIContrast').value;
		var compress = getById('_inpUICompression').value;
		//Neuter the top gradient
		styles += '#sidebar .tab-scroll-gradient { pointer-events: none; }';
		//Nuke the bottom gradient
		styles += '#sidebar #links:before { display: none; }';
		// Make map comment text always visible
		styles += '.map-comment-name-editor .edit-button { display: block !important; }';
		//remove Waze font from side panel
		styles += '#sidebar { font-family: sans-serif; }';
		if (compress > 0) {
			//general compression enhancements
			styles += '#sidebar { line-height: ' + ['','18px','16px'][compress] + ';}';
			styles += '#sidebar .tab-content .tab-pane { padding: ' + ['','8px','1px'][compress] + '; }';
			styles += '#sidebar #sidebarContent { font-size: ' + ['','13px','12px'][compress] + '; }';
			styles += '#sidebar #advanced-tools { padding: ' + ['','0 9px','0 4px'][compress] + '; }';
			styles += '#sidebar .waze-staff-tools { margin-bottom: ' + ['','9px','4px'][compress] + '; height: ' + ['','25px','20px'][compress] + '; }';
			styles += '#sidebar .tab-content { padding: ' + ['','9px','4px'][compress] + '; padding-top: ' + ['','4px','0px'][compress] + '; }';
			//Tabs
			styles += '#sidebar .nav-tabs { padding-bottom: ' + ['','3px','2px'][compress] + '; }';
			styles += '#sidebar #user-info #user-tabs { padding: ' + ['','0 9px','0 4px'][compress] + '; }';
			styles += '#sidebar .tabs-container { padding: ' + ['','0 9px','0 4px'][compress] + '; }';
			styles += '#sidebar .nav-tabs li a { margin-top: ' + ['','2px','1px'][compress] + '; margin-left: ' + ['','3px','1px'][compress] + '; padding: ' + ['','0 6px','0 2px'][compress] + '; line-height: ' + ['','24px','21px'][compress] + '; height: ' + ['','24px','21px'][compress] + '; }';
			styles += '#sidebar .nav-tabs li { flex-grow: 0; }';
			//Feed
			styles += '.feed-item { margin-bottom: ' + ['','3px','1px'][compress] + '; }';
			styles += '.feed-item .inner { padding: ' + ['','5px','0px'][compress] + '; }';
			styles += '.feed-item .content .title { margin-bottom: ' + ['','1px','0px'][compress] + '; }';
			styles += '.feed-item .motivation { margin-bottom: ' + ['','2px','0px'][compress] + '; }';
			//Drives & Areas
			styles += '#sidebar .message { margin-bottom: ' + ['','6px','2px'][compress] + '; }';
			styles += '#sidebar .result-list .result { padding: ' + ['','6px 17px','2px 9px'][compress] + '; margin-bottom: ' + ['','3px','1px'][compress] + '; }';
			styles += '#sidebar .result-list .session { background-color: lightgrey; }';
			styles += '#sidebar .result-list .session-available { background-color: white; }';
			styles += '#sidebar .result-list .result.selected { background-color: lightgreen; }';
			styles += 'div#sidepanel-drives { height: auto !important; }';
			//SEGMENT EDIT PANEL
			//general changes
			//checkbox groups
			styles += '#sidebar .controls-container { padding-top: ' + ['','4px','1px'][compress] + '; display: inline-block; font-size: ' + ['','12px','11px'][compress] + '; }';
			styles += '.controls-container input[type="checkbox"] + label { padding-left: ' + ['','21px','17px'][compress] + ' !important; } }';
			//form groups
			styles += '#sidebar .form-group { margin-bottom: ' + ['','5px','0px'][compress] + '; }';
			//dropdown inputs
			styles += '#sidebar .form-control { height: ' + ['','27px','19px'][compress] + '; padding-top: ' + ['','4px','0px'][compress] + '; padding-bottom: ' + ['','4px','0px'][compress] + '; font-size: ' + ['','13px','12px'][compress] + '; color: black; }';
			//buttons
			styles += '#edit-panel .waze-btn { padding-top: 0px !important; padding-bottom: ' + ['','3px','1px'][compress] + '; height: ' + ['','20px','18px'][compress] + ' !important; line-height: ' + ['','20px','18px'][compress] + ' !important; font-size: ' + ['','13px','12px'][compress] + '; }';
//			styles += '#edit-panel .waze-btn { padding-top: ' + ['','3px','0px'][compress] + ' !important; padding-bottom: ' + ['','3px','1px'][compress] + '; height: ' + ['','20px','18px'][compress] + ' !important; line-height: ' + ['','20px','18px'][compress] + ' !important; font-size: ' + ['','13px','12px'][compress] + '; }';
			//radio button controls
			styles += '.waze-radio-container label { height: ' + ['','19px','16px'][compress] + '; width: ' + ['','19px','16px'][compress] + '; line-height: ' + ['','19px','16px'][compress] + '; font-size: ' + ['','13px','12px'][compress] + '; margin-bottom: ' + ['','3px','1px'][compress] + '; }';
			styles += '.waze-radio-container label { width: auto; padding-left: ' + ['','6px','3px'][compress] + ' !important; padding-right: ' + ['','6px','3px'][compress] + ' !important; }';
			//text input areas
			styles += '#sidebar textarea.form-control { height: auto; }';
			styles += '#sidebar textarea { max-width: unset; }';
			//specific changes
			//Selected segments info
			styles += '#edit-panel .selection { padding-top: ' + ['','8px','2px'][compress] + '; padding-bottom: ' + ['','8px','4px'][compress] + '; }';
			styles += '#edit-panel .segment .direction-message { margin-bottom: ' + ['','9px','3px'][compress] + '; }';
			//Segment details (closure warning)
			styles += '#edit-panel .segment .segment-details { padding: ' + ['','10px','5px'][compress] + '; padding-top: 0px; }';
			//All control labels
			styles += '#edit-panel .control-label { font-size: ' + ['','11px','10px'][compress] + '; margin-bottom: ' + ['','4px','1px'][compress] + '; }';
			//Address input
			styles += '#edit-panel .address-edit-view { cursor: pointer; margin-bottom: ' + ['','6px','2px'][compress] + '!important; }';
			styles += '#edit-panel .address-edit-input { padding: ' + ['','4px','1px'][compress] + '; font-size: ' + ['','13px','12px'][compress] + '; }';
			styles += '.tts-button { height: ' + ['','28px','21px'][compress] + '; }';
			//alt names
			styles += '.alt-street-list { margin-bottom: ' + ['','4px','0px'][compress] + '; }';
			styles += '#edit-panel .add-alt-street-form .alt-street { padding-top: ' + ['','13px','3px'][compress] + '; padding-bottom: ' + ['','13px','3px'][compress] + '; }';
			styles += '#edit-panel .add-alt-street-form .alt-street .alt-street-delete { top: ' + ['','12px','4px'][compress] + '; }';
			styles += '#edit-panel .segment .address-edit-view .address-form .action-buttons { padding-top: ' + ['','11px','6px'][compress] + '; padding-bottom: ' + ['','11px','6px'][compress] + '; margin-top: ' + ['','5px','0px'][compress] + '; height: ' + ['','45px','28px'][compress] + '; }';
			styles += '#edit-panel .add-alt-street-form .new-alt-street { padding-top: ' + ['','8px','3px'][compress] + '; padding-bottom: ' + ['','8px','3px'][compress] + '; }';
			//restrictions control
			styles += '#edit-panel .restriction-list { margin-bottom: ' + ['','5px','0px'][compress] + '; }';
			//speed limit controls
			styles += '#edit-panel .clearfix.controls.speed-limit { margin-top: ' + ['','0px','-5px'][compress] + '; }';
			styles += '#edit-panel .segment .speed-limit label { margin-bottom: ' + ['','3px','1px'][compress] + '; }';
			styles += '#edit-panel .segment .speed-limit .form-control { height: ' + ['','23px','19px'][compress] + '; padding-top: ' + ['','4px','2px'][compress] + '; font-size: ' + ['','13px','12px'][compress] + '; width: 5em; margin-left: 0px; }';
			styles += '#edit-panel .segment .speed-limit .direction-label { font-size: ' + ['','12px','11px'][compress] + '; line-height: ' + ['','2.0em','1.8em'][compress] + '; }';
			styles += '#edit-panel .segment .speed-limit .unit-label { font-size: ' + ['','12px','11px'][compress] + '; line-height: ' + ['','2.0em','1.8em'][compress] + '; margin-left: 0px;}';
			styles += '#edit-panel .segment .speed-limit .average-speed-camera { margin-left: 40px; }';
			styles += '#edit-panel .segment .speed-limit .average-speed-camera .camera-icon { vertical-align: top; }';
			styles += '#edit-panel .segment .speed-limit .verify-buttons { margin-bottom: ' + ['','5px','0px'][compress] + '; }';
			//more actions section
			styles += '#edit-panel .more-actions { padding-top: ' + ['','6px','2px'][compress] + '; }';
			styles += '#edit-panel .more-actions .waze-btn.waze-btn-white { padding-left: 0px; padding-right: 0px; }';
			//get more-actions buttons on one line
			styles += '#edit-panel .more-actions { display: inline-flex; }';
			styles += '#edit-panel .action-button { width: 155px; overflow: hidden; }';
			styles += '#edit-panel .action-button:before { margin-right: 0px !important; }';
			styles += '#edit-panel .more-actions .edit-house-numbers-btn-wrapper { margin-top: 0px; }';
			//additional attributes
			styles += '#edit-panel .additional-attributes { margin-bottom: ' + ['','3px','1px'][compress] + '; }';
			//history items
			styles += '.toggleHistory { padding: ' + ['','7px','3px'][compress] + '; }';
			styles += '.element-history-item:not(:last-child) { margin-bottom: ' + ['','3px','1px'][compress] + '; }';
			styles += '.element-history-item .tx-header { padding: ' + ['','6px','2px'][compress] + '; }';
			styles += '.element-history-item .tx-header .tx-author-date { margin-bottom: ' + ['','3px','1px'][compress] + '; }';
			styles += '.element-history-item .tx-content { padding: ' + ['','7px 7px 7px 22px','4px 4px 4px 22px'][compress] + '; }';
			styles += '.loadMoreContainer { padding: ' + ['','5px 0px','3px 0px'][compress] + '; }';
			//closures tab
			styles += 'wz-button { transform: scale(' + ['','0.9','0.8'][compress] + '); }';
			styles += '.closures > div:not(.closures-list) { padding: ' + ['','0px','0px'][compress] + '; }';
			styles += 'body { --wz-text-input-height: ' + ['','30px','20px'][compress] + '; }';
			styles += 'body { --wz-select-height: ' + ['','30px','20px'][compress] + '; }';
			styles += 'input.wz-text-input { height: ' + ['','30px','20px'][compress] + '; }';
			styles += '.edit-closure .closure-nodes .closure-node-item .closure-node-control { padding: ' + ['','7px','2px'][compress] + '; }';
			//closures list
			styles += '.closures-list .add-closure-button { line-height: ' + ['','20px','18px'][compress] + '; }';
			styles += '.closures-list .closure-item:not(:last-child) { margin-bottom: ' + ['','6px','2px'][compress] + '; }';
			styles += '.closures-list .closure-item .details { padding: ' + ['','5px','0px'][compress] + '; font-size: ' + ['','12px','11px'][compress] + '; }';
			styles += '.closures-list .closure-item .buttons { top: ' + ['','7px','4px'][compress] + '; }';
			//tweak for Junction Box button
			styles += '#edit-panel .junction-actions > button { width: inherit; }';
			//PLACE DETAILS
			//alert
			styles += '#edit-panel .header-alert { margin-bottom: ' + ['','6px','2px'][compress] + '; padding: ' + ['','6px 32px','2px 32px'][compress] + '; }';
			//address input
			styles += '#edit-panel .full-address { padding-top: ' + ['','4px','1px'][compress] + '; padding-bottom: ' + ['','4px','1px'][compress] + '; font-size: ' + ['','13px','12px'][compress] + '; }';
			//alt names
			styles += '#edit-panel .aliases-view .list li { margin: ' + ['','12px 0','4px 0'][compress] + '; }';
			styles += '#edit-panel .aliases-view .delete { line-height: inherit; }';
			//categories
			styles += '#edit-panel .categories .select2-search-choice .category { margin: ' + ['','2px 0 2px 4px','1px 0 1px 3px'][compress] + '; height: ' + ['','18px','15px'][compress] + '; line-height: ' + ['','18px','15px'][compress] + '; }';
			styles += '#edit-panel .categories .select2-search-field input { height: ' + ['','18px','17px'][compress] + '; }';
			styles += '#edit-panel .categories .select2-choices { min-height: ' + ['','26px','19px'][compress] + '; }';
			styles += '#edit-panel .categories .select2-container { margin-bottom: 0px; }';
			//entry/exit points
			styles += '#edit-panel .navigation-point-view .navigation-point-list-item .preview { padding: ' + ['','3px 7px','0px 4px'][compress] + '; font-size: ' + ['','13px','12px'][compress] + '; }';
			styles += '#edit-panel .navigation-point-view .add-button { height: ' + ['','28px','18px'][contrast] + '; line-height: ' + ['','17px','16px'][contrast] + '; font-size: ' + ['','13px','12px'][compress] + '; }';
			//type buttons
			styles += '#sidebar .area-btn, #sidebar .point-btn { height: ' + ['','19px','16px'][compress] + '; line-height: ' + ['','19px','16px'][compress] + '; font-size: ' + ['','13px','12px'][compress] + '; }';
			// { height: ' + ['','19px','16px'][compress] + '; width: ' + ['','19px','16px'][compress] + '; line-height: ' + ['','19px','16px'][compress] + '; font-size: ' + ['','13px','12px'][compress] + '; margin-bottom: ' + ['','3px','1px'][compress] + '; }';
			//external providers
			styles += '.select2-container { font-size: ' + ['','13px','12px'][compress] + '; }';
			styles += '#edit-panel .external-providers-view .external-provider-item { margin-bottom: ' + ['','6px','2px'][compress] + '; }';
			styles += '.external-providers-view > div > ul { margin-bottom: ' + ['','4px','0px'][compress] + '; }';
			styles += '#edit-panel .external-providers-view .add { padding: ' + ['','3px 12px','1px 9px'][compress] + '; }';
			styles += '#edit-panel .waze-btn.waze-btn-smaller { line-height: ' + ['','26px','21px'][compress] + '; }';
			//residential toggle
			styles += '#edit-panel .toggle-residential { height: ' + ['','27px','22px'][compress] + '; }';
			//more info
			styles += '.service-checkbox { font-size: ' + ['','13px','12px'][compress] + '; }';
			//PARKING LOT SPECIFIC
			styles += '.parking-type-option{ display: inline-block; }';
			styles += '.payment-checkbox { display: inline-block; min-width: ' + ['','48%','31%'][compress] + '; }';
			styles += '.service-checkbox { display: inline-block; min-width: 49%; font-size: ' + ['','12px','11px'][compress] + '; }';
			styles += '.lot-checkbox { display: inline-block; min-width: 49%; }';
			//MAP COMMENTS
			styles += '.map-comment-name-editor { padding: ' + ['','10px','5px'][compress] + '; }';
			styles += '.map-comment-name-editor .edit-button { margin-top: 0px; font-size: ' + ['','13px','12px'][compress] + '; padding-top: ' + ['','3px','1px'][compress] + '; }';
			styles += '.conversation-view .no-comments { padding: ' + ['','10px 15px','5px 15px'][compress] + '; }';
			styles += '.map-comment-feature-editor .conversation-view .comment-list { padding-top: ' + ['','8px','1px'][compress] + '; padding-bottom: ' + ['','8px','1px'][compress] + '; }';
			styles += '.map-comment-feature-editor .conversation-view .comment-list .comment .comment-content { padding: ' + ['','6px 0px','2px 0px'][compress] + '; }';
			styles += '.conversation-view .comment .text { padding: ' + ['','6px 9px','3px 4px'][compress] + '; font-size: ' + ['','13px','12px'][compress] + '; }';
			styles += '.conversation-view .new-comment-form { padding-top: ' + ['','10px','5px'][compress] + '; }';
			styles += '.map-comment-feature-editor .clear-btn { height: ' + ['','26px','19px'][compress] + '; line-height: ' + ['','26px','19px'][compress] + '; }';
			//Compression for WME Speedhelper
			styles += '.clearfix.controls.speed-limit { margin-top: ' + ['','-4px','-8px'][compress] + '; }';
			//Compression for WME Clicksaver
			styles += '.rth-btn-container { margin-bottom: ' + ['','2px','-1px'][compress] + '; }';
			styles += '#csRoutingTypeContainer { height: ' + ['','23px','16px'][compress] + ' !important; margin-top: ' + ['','-2px','-4px'][compress] + '; }';
			styles += '#csElevationButtonsContainer { margin-bottom: ' + ['','2px','-1px'][compress] + ' !important; }';
			//tweak for WME Clicksaver tab controls
			styles += '#sidepanel-clicksaver .controls-container { width: 100%; }';
			//tweak for JAI tab controls
			styles += '#sidepanel-ja .controls-container { width: 100%; }';
			//tweaks for UR-MP Tracker
			styles += '#sidepanel-urt { margin-left: ' + ['','-5px','0px'][compress] + ' !important; }';
			styles += '#urt-main-title { margin-top: ' + ['','-5px','0px'][compress] + ' !important; }';
			//tweaks for my own panel
			styles += '#fuContent { line-height: ' + ['','10px','9px'][compress] + ' !important; }';
		}
		if (contrast > 0) {
			//contrast enhancements
			//general
			styles += '#sidebar .form-group { border-top: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			//text colour
			styles += '#sidebar { color: black; }';
			//advanced tools section
			styles += '#sidebar waze-staff-tools { background-color: #c7c7c7; }';
			//Tabs
			styles += '#sidebar .nav-tabs { border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '#sidebar .nav-tabs li a { border: 1px solid ' + ['','lightgrey','grey'][contrast] + ' !important; }';
			//Fix the un-noticeable feed refresh button
			styles += 'span.fa.fa-repeat.feed-refresh.nav-tab-icon { width: 19px; color: orangered; }';
			styles += 'span.fa.fa-repeat.feed-refresh.nav-tab-icon:hover { color: red; font-weight: bold; font-size: 15px; }';
			//Feed
			styles += '.feed-item { border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '.feed-issue .content .title .type { color: ' + ['','black','black'][contrast] + '; font-weight: bold; }';
			styles += '.feed-issue .content .timestamp { color: ' + ['','dimgrey','black'][contrast] + '; }';
			styles += '.feed-issue .content .subtext { color: ' + ['','dimgrey','black'][contrast] + '; }';
			styles += '.feed-item .motivation { font-weight: bold; }';
			//Drives & Areas
			styles += '#sidebar .result-list .result { border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			//Segment edit panel
			styles += '#edit-panel .selection { font-size: 13px; }';
			styles += '#edit-panel .segment .direction-message { color: orangered; }';
			styles += '#edit-panel .address-edit-input { color: black; border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '#sidebar .form-control { border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			//radio buttons when disabled
			styles += '.waze-radio-container input[type="radio"]:disabled:checked + label { color: black; opacity: 0.7; font-weight:600; }';
			//override border for lock levels
			styles += '#sidebar .waze-radio-container { border: 0 none !important; }';
			styles += '#edit-panel .waze-btn { color: black; border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '.waze-radio-container label  { border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			//history items
			styles += '.toggleHistory { color: black; text-align: center; }';
			styles += '.element-history-item .tx-header { color: black; }';
			styles += '.element-history-item.closed .tx-header { border-radius: 8px; border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '.loadMoreHistory { border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			//closures list
			styles += '.closures-list .closure-item .details { border-radius: 8px; border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '.closures-list .closure-item .dates { color: black; }';
			styles += '.closures-list .closure-item .dates .date-label { opacity: 1; }';
			//Place details
			//alert
			styles += '#edit-panel .alert-danger { color: red; }';
			//address input
			styles += '#edit-panel .full-address { color: black; border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '#edit-panel a.waze-link { font-weight: bold; }';
			//categories
			styles += '#edit-panel .categories .select2-search-choice .category { text-transform: inherit; font-weight: bold; background: gray; }';
			//entry/exit points
			styles += '#edit-panel .navigation-point-view .navigation-point-list-item .preview { border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '#edit-panel .navigation-point-view .add-button { border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; margin-top: 2px; padding: 0 5px; }';
			//type buttons
			styles += '#sidebar .point-btn { color: black; border: 1px solid ' + ['','lightgrey','grey'][contrast] + ' !important; }';
			//external providers
			styles += '.select2-container { color: teal; border: 1px solid ' + ['','lightgrey','grey'][contrast] + ' !important; }';
			styles += '.select2-container .select2-choice { color: black; }';
			//residential toggle
			styles += '#edit-panel .toggle-residential { font-weight: bold; }';
			//COMMENTS
			styles += '.map-comment-name-editor { border-color: ' + ['','darkgrey','grey'][contrast] + '; }';
		}
		// hide headlight required control if not valid for this country
		// need to delay, as topCountry is taking too long to appear
		setTimeout(hideHeadlights,5000);
		//fix for buttons of WME Image Overlay script
		styles += '#sidepanel-imageoverlays > div.result-list button { height: 24px; }';
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
		removeStyle(prefix + 'hideHeadlights');
	}
}

function hideHeadlights() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (W.model.getTopCountry()) {
		if (W.model.getTopCountry().allowHeadlightsReminderRank === null) {
			styles += '.headlights-reminder { display: none !important; }';
			addStyle(prefix + fname,styles);
		}
	}
}

function compressLayersMenu() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	removeStyle(prefix + fname);
	var styles = "";
	if (getById('_cbCompressLayersMenu').checked) {
		getById('layersColControls').style.opacity = '1';
		var contrast = getById('_inpUIContrast').value;
		var compress = getById('_inpUICompression').value;
		if (compress > 0) {
			//VERTICAL CHANGES
			//change menu to autoheight - not working
			// styles += '.layer-switcher .menu { height: auto; width: auto; max-height: calc(100% - 26px); overflow-y: scroll }';
			//change menu to auto-width
			styles += '.layer-switcher .menu { width: auto }';
			styles += '.layer-switcher .menu.hide-layer-switcher { left: 100% }';
			//menu title
			styles += '.layer-switcher .menu > .title { font-size: ' + ['','14px','12px'][compress] + '; padding-bottom: ' + ['','7px','2px'][compress] + '; padding-top: ' + ['','7px','2px'][compress] + ' }';
			styles += '.layer-switcher .menu > .title .w-icon-x { font-size: ' + ['','21px','18px'][compress] + ' }';
			styles += '.layer-switcher .scrollable { height: calc(100% - ' + ['','39px','29px'][compress] + ') }';
			//menu group headers
			styles += '.layer-switcher .layer-switcher-toggler-tree-category { padding: ' + ['','5px','2px'][compress] + ' 0; height: ' + ['','30px','20px'][compress] + ' }';
			//menu items
			styles += '.layer-switcher li { line-height: ' + ['','20px','16px'][compress] + '}';
			styles += '.layer-switcher .togglers ul li .wz-checkbox { margin-bottom: ' + ['','3px','0px'][compress] + ' }';
			styles += '.wz-checkbox { min-height: ' + ['','20px','16px'][compress] + ' }';
			styles += '.wz-checkbox input[type="checkbox"] + label { line-height: ' + ['','20px','16px'][compress] + '; font-size: ' + ['','12px','11px'][compress] + ' }';
			styles += '.wz-checkbox input[type="checkbox"] + label:before { font-size: ' + ['','13px','10px'][compress] + '; height: ' + ['','16px','14px'][compress] + '; width: ' + ['','16px','14px'][compress] + '; line-height: ' + ['','12px','11px'][compress] + ' }';
			//HORIZONTAL CHANGES
			styles += '.layer-switcher .togglers ul { padding-left: ' + ['','19px','12px'][compress] + '; }';
			styles += '.layer-switcher .togglers .group { padding: ' + ['','0 8px 0 4px','0 4px 0 2px'][compress] + ' }';
			if (getById('_cbLayersColumns').checked) {
				//2 column stuff
				styles += '.layer-switcher .scrollable { columns: 2; }';
				styles += 'li.group { break-inside: avoid; page-break-inside: avoid; }';
				//prevent city names showing up when it should be hidden
				styles += ' .layer-switcher ul[class^="collapsible"].collapse-layer-switcher-group { visibility: collapse }';
				styles += '.layer-switcher .menu { overflow-x: hidden; overflow-y: scroll; height: auto; max-height: calc(100% - ' + ['','39px','29px'][compress] + ') }';
				styles += '.layer-switcher .scrollable { overflow-x: hidden; overflow-y: hidden; height: unset }';
			}
			// fix from ABelter for layers menu
			styles += ' .layer-switcher ul[class^="collapsible"] { max-height: none; }';
		} else {
			//2-columns not available without compression
			getById('layersColControls').style.opacity = '0.5';
		}
		if (contrast > 0) {
			styles += '.controls-container.main.toggler { color: white; background: dimgray }';
			styles += '.layer-switcher .toggler.main .label-text { text-transform: inherit }';
			//labels
			styles += '.layer-switcher .layer-switcher-toggler-tree-category > .label-text { color: black }';
			styles += '.wz-checkbox input[type="checkbox"] + label { WME: FU; color: black }';
			//group separator
			styles += '.layer-switcher .togglers .group { border-bottom: 1px solid ' + ['','lightgrey','grey'][contrast] + ' }';
			//column rule
			styles += '.layer-switcher .scrollable { column-rule: 1px solid ' + ['','lightgrey','grey'][contrast] + ' }';
		}
		if (getById('_cbLayersMenuMoreOptions').checked === true) {
			styles += '.layer-switcher ul[class^="collapsible"].collapse-layer-switcher-group { visibility: inherit; max-height: inherit }';
			styles += '.layer-switcher i.toggle-category { visibility: hidden; width: 0 }';
		}
		addStyle(prefix + fname,styles);
	} else {
		getById('layersColControls').style.opacity = '0.5';
		removeStyle(prefix + fname);
	}
}

function restyleReports() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbRestyleReports').checked) {
		var contrast = getById('_inpUIContrast').value;
		var compress = getById('_inpUICompression').value;
		if (compress > 0) {
			//report header
			styles += '#panel-container .header { padding: ' + ['','9px 36px','1px 36px'][compress] + '; line-height: ' + ['','19px','17px'][compress] + '; }';
			styles += '#panel-container .header .dot { top: ' + ['','15px','7px'][compress] + '; }';
			//special treatment for More Information checkboxes (with legends)
			styles += '#panel-container .problem-edit .more-info .legend { left: 20px; top: 3px; }';
			styles += '#panel-container .more-info input[type="checkbox"] + label { padding-left: 33px !important; }';
			//report body
			styles += '#panel-container .body { line-height: ' + ['','15px','13px'][compress] + '; font-size: ' + ['','13px','12px'][compress] + '; }';
			//problem description
			styles += '#panel-container div.description.section > div.collapsible.content { padding: ' + ['','9px','3px'][compress] + '; }';
			//comments
			styles += '#panel-container .conversation-view .comment .comment-content { padding: ' + ['','6px 9px','2px 3px'][compress] + '; }';
			styles += '#panel-container .comment .text { padding: ' + ['','7px 9px','4px 4px'][compress] + '; }';
			//new comment entry
			styles += '#panel-container .conversation-view .new-comment-form { padding: ' + ['','8px 9px 6px 9px','1px 3px 2px 3px'][compress] + '; }';
			//send button
			styles += '#panel-container .conversation-view .send-button { padding: ' + ['','4px 16px','2px 12px'][compress] + '; box-shadow: ' + ['','3px 3px 4px 0 #def7ff','3px 2px 4px 0 #def7ff'][compress] + '; }';
			//lower buttons
			styles += '#panel-container > div > div > div.actions > div > div { padding-top: ' + ['','6px','3px'][compress] + '; }';
			styles += '#panel-container .close-details.section { font-size: ' + ['','13px','12px'][compress] + '; line-height: ' + ['','13px','9px'][compress] + '; }';
			styles += '#panel-container .problem-edit .actions .controls-container label { height: ' + ['','28px','21px'][compress] + '; line-height: ' + ['','28px','21px'][compress] + '; margin-bottom: ' + ['','5px','2px'][compress] + '; }';
			styles += '#panel-container .waze-plain-btn { height: ' + ['','30px','20px'][compress] + '; line-height: ' + ['','30px','20px'][compress] + '; }';
			styles += '.panel .navigation { margin-top: ' + ['','6px','2px'][compress] + '; }';
			//WMEFP All PM button
			styles += '#WMEFP-UR-ALLPM { top: ' + ['','5px','0px'][compress] + ' !important; }';
		}
		if (contrast > 0) {
			styles += '#panel-container .section { border-bottom: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '#panel-container .close-panel { border-color: ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '#panel-container .main-title { font-weight: 900; }';
			styles += '#panel-container .reported { color: ' + ['','dimgrey','black'][contrast] + '; }';
			styles += '#panel-container .date { color: ' + ['','#6d6d6d','#3d3d3d'][contrast] + '; }';
			styles += '#panel-container .comment .text { border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '#panel-container .comment-content.reporter .username { color: ' + ['','#159dc6','#107998'][contrast] + '; }';
			styles += '#panel-container .conversation-view .new-comment-form textarea { border: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '#panel-container .top-section { border-bottom: 1px solid ' + ['','lightgrey','grey'][contrast] + '; }';
			styles += '#panel-container .waze-plain-btn { font-weight: 800; color: ' + ['','#159dc6','#107998'][contrast] + '; }';
		}
		addStyle(prefix + fname,styles);
		if (wmeFUinitialising) {
			setTimeout(draggablePanel, 5000);
		} else {
			draggablePanel();
		}
	} else {
		removeStyle(prefix + fname);
		if (jQuery.ui) {
			if ( $("#panel-container").hasClass('ui-draggable') ) {
				$("#panel-container").draggable("destroy");
			}
			getById("panel-container").style = "";
		}
	}
	window.dispatchEvent(new Event('resize'));
}

function draggablePanel() {
	if (jQuery.ui) {
		if ($("#panel-container").draggable) {
			$("#panel-container").draggable({ handle: ".header" });
		}
	}
}

function enhanceChat() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbEnhanceChat').checked) {
		removeStyle(prefix + fname);
		var contrast = getById('_inpUIContrast').value;
		var compress = getById('_inpUICompression').value;
		var mapY = getById('map').clientHeight;
		var chatY = Math.floor( mapY * 0.5);
		var chatHeaderY = [50,35,20][compress];
		var chatMessageInputY = [39,31,23][compress];
		var chatMessagesY = chatY - chatHeaderY - chatMessageInputY;
		var chatUsersY = chatY - chatHeaderY;
		//change chat width to 35% of whole window
		styles += '#chat .messages { width: calc(25vw); min-width: 200px;}';
		styles += '#map.street-view-mode #chat .messages { width: calc(25vw); }';
		styles += '#chat .messages .message-list { margin-bottom: 0px; }';
		styles += '#chat .messages .new-message { position: inherit; width: unset; }';
		styles += '#map.street-view-mode #chat .messages .new-message { position: inherit; width: unset; }';
		styles += '#chat .users { width: calc(10vw); min-width: 120px; }';
		styles += '#chat .messages .message-list .message.normal-message { max-width: unset; }';
		//change chat height to 50% of map view
		styles += '#chat .messages .message-list { min-height: ' + chatMessagesY + 'px; }';
		styles += '#chat .users { max-height: ' + chatUsersY + 'px; }';
		
//		#chat .messages .unread-messages-notification width=70%, bottom64px>
		if (compress > 0) {
			//do compression
			//header
			styles += '#chat .header { line-height: ' + chatHeaderY + 'px; }';
			
			styles += '#chat .header .dropdown .dropdown-toggle { line-height: ' + ['','30px','22px'][compress] + '; }';
			styles += '#chat .header button { line-height: ' + ['','20px','19px'][compress] + '; font-size: ' + ['','13px','11px'][compress] + '; height: ' + ['','20px','19px'][compress] + '; }';
			//message list
			styles += '#chat .messages .message-list { padding: ' + ['','9px','3px'][compress] + '; }';
			styles += '#chat .messages .message-list .message.normal-message { padding: ' + ['','6px','2px'][compress] + '; }';
			styles += '#chat .messages .message-list .message { margin-bottom: ' + ['','8px','2px'][compress] + '; line-height: ' + ['','16px','14px'][compress] + '; font-size: ' + ['','12px','11px'][compress] + '; }';
			styles += '#chat .messages .new-message input { height: ' + chatMessageInputY + 'px; }';
			//user list
			styles += '#chat .users { padding: ' + ['','8px','1px'][compress] + '; }';
			styles += '#chat ul.user-list a.user { padding: ' + ['','2px','1px'][compress] + '; }';
			styles += '#chat ul.user-list a.user .rank { width: ' + ['','25px','20px'][compress] + '; height: ' + ['','20px','16px'][compress] + '; margin-right: ' + ['','3px','1px'][compress] + '; }';
			styles += '#chat ul.user-list a.user .username { line-height: ' + ['','21px','17px'][compress] + '; }';
			styles += '#chat ul.user-list a.user:hover .crosshair { margin-top: ' + ['','3px','1px'][compress] + '; right: ' + ['','3px','1px'][compress] + '; }';
			//fix for WME Chat Addon
			styles += '#chat .users > ul > li > a { margin: 0px !important; }';
		}
		if (contrast > 0) {
			//header
			styles += '#chat .header { color: black; background-color: ' + ['','#d9d9d9','#bfbfbf'][contrast] + '; }';
			styles += '#chat .messages .message-list { background-color: ' + ['','#e8e8e8','lightgrey'][contrast] + '; }';
			styles += '#chat .messages .message-list .message.normal-message { color: black; float: left; }';
			styles += '#chat .messages .message-list .message.normal-message .from { color: dimgrey; font-weight: bold; font-style: italic; }';
			styles += '#chat .messages .message-list .message.own-message .from { color: black; background-color: #a1dcf5; }';
			//user message timestamps
			styles += '#chat > div.chat-body > div.messages > div.message-list > div > div.from > span { color: ' + ['','dimgrey','black'][contrast] + ' !important; }';
			//system message timestamps
			styles += '#chat > div.chat-body > div.messages > div.message-list > div > div.body > div > span { color: ' + ['','dimgrey','black'][contrast] + ' !important; }';
			//fix for WME Chat Addon
			styles += '#chat .body > div { color: black !important; }';
		}
		//fix for Chat Addon timestamps running up against names
		styles += '#chat > div.chat-body > div.messages > div.message-list > div > div.from > span { margin-left: 5px; }';
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
	}
}

function narrowSidePanel() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbNarrowSidePanel').checked) {
		//sidebar width
		styles += '.row-fluid #sidebar { width: 250px; }';
		//map width
		styles += '.show-sidebar .row-fluid .fluid-fixed { margin-left: 250px; }';
		//user info tweaks
		styles += '#sidebar #user-info #user-box { padding: 0 0 5px 0; }';
		styles += '#sidebar #user-details { width: 250px; }';
		styles += '#sidebar #user-details .user-profile .level-icon { margin: 0; }';
		styles += '#sidebar #user-details .user-profile .user-about { max-width: 161px; }';
		//gradient bars
		styles += '#sidebar .tab-scroll-gradient { width: 220px; }';
		styles += '#sidebar #links:before { width: 236px; }';
		//feed
		styles += '.feed-item .content { max-width: 189px; }';
		//segment edit panel
		styles += '#edit-panel .more-actions .waze-btn.waze-btn-white { width: 122px; }';
		//tweak for WME Bookmarks
		styles += '#divBookmarksContent .divName { max-width: 164px; }';
		//tweak for WME PH buttons
		styles += '#WMEPH_runButton .btn { font-size: 11px; padding: 2px !important; }';
		addStyle(prefix + fname, styles);
	} else {
		removeStyle(prefix + fname);
	}
	compressSegmentTab();
	window.dispatchEvent(new Event('resize'));
}

function shiftAerials() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	// calculate meters/pixel for current map view
	var ipu = OpenLayers.INCHES_PER_UNIT;
	var metersPerPixel = W.map.getResolution() * ipu.m / ipu[W.map.getOLMap().getUnits()];
	// Apply the shift and opacity
	W.map.getOLMap().baseLayer.div.style.left = Math.round(getById("_inpASX").value / metersPerPixel) + 'px';
	W.map.getOLMap().baseLayer.div.style.top = Math.round(- getById("_inpASY").value / metersPerPixel) + 'px';
	if (getById('_inpASO').value < 10) getById('_inpASO').value = 10;
	W.map.getOLMap().baseLayer.div.style.opacity = getById("_inpASO").value/100;
	if (getById("_inpASX").value != 0 || getById("_inpASY").value != 0) {
		getById("WMEFU_AS").style.display = "block";
	} else {
		getById("WMEFU_AS").style.display = "none";
	}
	//turn off Enhance Chat if WME Chat Fix is loaded
	if (document.getElementById('WMEfixChat-setting')) {
		if (getById('_cbEnhanceChat').checked === true) {
			alert("WME FixUI: Enhance Chat disabled because WME Chat UI Fix detected");
		}
		getById('_cbEnhanceChat').checked = false;
	}
}

function fixExternalProviders () {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbFixExternalProviders').checked) {
		//enlarge external provider boxes
		styles += '#edit-panel .external-providers-view .select2-container { width: 90%; margin-bottom: 2px; }';
		styles += '.select2-container .select2-choice { height: inherit; line-height: 16px; }';
		styles += '.select2-container .select2-choice>.select2-chosen { white-space: normal; }';
		styles += '.placeId { padding-bottom: 5px; }';
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
	}
}

function warnCommentsOff() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (W.map.getLayerByUniqueName('mapComments').visibility === false) {
		removeStyle(prefix + fname);
		addStyle(prefix + fname, '.toolbar { background-color: #FFC107; }');
	} else {
		removeStyle(prefix + fname);
	}
	// extra bit because killNodeLayer will be inactive
	// getId("_btnKillNode").innerHTML = "Hide junction nodes";
	getById("_btnKillNode").style.backgroundColor = "";
}

function adjustGSV() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	var C = getById('_inpGSVContrast');
	var B = getById('_inpGSVBrightness');
	var I = getById('_cbGSVInvert');
	if (C.value < 10) C.value = 10;
	if (B.value < 10) B.value = 10;
	styles += '.gm-style { filter: contrast(' + C.value + '%) ';
	styles += 'brightness(' + B.value + '%) ';
	if (I.checked) {
		styles += 'invert(1); }';
	} else {
		styles += 'invert(0); }';
	}
	removeStyle(prefix + fname);
	if ((C.value != 100) || (B.value !=100) || I.checked) addStyle(prefix + fname, styles);
}

function GSVWidth() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	removeStyle(prefix + fname);
	var w = getById('_inpGSVWidth').value;
	if (w != 50) {
		var styles = "";
		styles += '#editor-container #map.street-view-mode #waze-map-container { width: ' + (100-w) + '%; }';
		styles += '#editor-container #street-view-container { width: ' + w + '%; }';
		styles += '#editor-container #map #street-view-drag-handle { left: ' + (100-w) + '%; }';
		addStyle(prefix + fname, styles);
	}
	window.dispatchEvent(new Event('resize'));
}

function GSVWidthReset() {
	getById('waze-map-container').style = null;
	getById('street-view-container').style = null;
	getById('street-view-drag-handle').style = null;
	// Check for WME Street View Availability
	// This can be removed soon - WME SVA no longer remembers GSV width
	if (localStorage.WMEStreetViewWidth) {
		localStorage.WMEStreetViewWidth = '';
	}
	window.dispatchEvent(new Event('resize'));
}

function moveChatIcon() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbMoveChatIcon').checked) {
		styles += '#chat-overlay { left: inherit !important; right: 60px !important;}';
		styles += '#chat-overlay #chat-toggle { right: 0px !important; }';
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
	}
}

function highlightInvisible() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbHighlightInvisible').checked) {
		styles += '#chat-overlay.visible-false #chat-toggle button { filter: none; background-color: #ff0000c0; }';
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
	}
}

function darkenSaveLayer() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbDarkenSaveLayer').checked) {
		//don't publish without alteration!
		styles += '#popup-overlay { background-color: dimgrey !important; }';
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
	}
}

function swapRoadsGPS() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbSwapRoadsGPS').checked) {
		var roadLayerId = W.map.getLayerByUniqueName("roads").id;
		var GPSLayerId = W.map.getLayerByUniqueName("gps_points").id;
		var roadLayerZ = W.map.getLayerByUniqueName("roads").getZIndex();
		var GPSLayerZ = W.map.getLayerByUniqueName("gps_points").getZIndex();
		logit("Layers identified\n\tRoads: " + roadLayerId + "," + roadLayerZ + "\n\tGPS: " + GPSLayerId + "," + GPSLayerZ, "info");
		styles += '#' + roadLayerId.replace(/\./g,"\\2e") + ' { z-index: ' + GPSLayerZ + ' !important; }';
		styles += '#' + GPSLayerId.replace(/\./g,"\\2e") + ' { z-index: ' + roadLayerZ + ' !important; }';
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
	}
}

function killNode() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	getById(W.map.getLayerByUniqueName("nodes").id + "_root").style.display = "none";
	getById("_btnKillNode").style.backgroundColor = "yellow";
	// getId("_btnKillNode").innerHTML = "Junction nodes hidden!";
}

function killTurnPopup() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (getById("WMEFUTPB").style.backgroundColor == "red") {
		getById("WMEFUTPB").style.backgroundColor = "inherit";
		removeStyle(prefix + fname);
	} else {
		getById("WMEFUTPB").style.backgroundColor = "red";
		addStyle(prefix + fname,'#big-tooltip-region { display: none !important; }');
	}
}

function showMapBlockers() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbShowMapBlockers').checked) {
		styles += '.street-view-layer { background-color: rgba(255,0,0,0.3); }';
		// styles += '.live-user-marker { background-color: rgba(255,0,0,0.3); }';
		styles += '.overlay-buttons-container.top { background-color: rgba(255,0,0,0.3); }';
		styles += '.overlay-buttons-container.bottom { background-color: rgba(255,0,0,0.3); }';
		styles += '#street-view-drag-handle { background-color: rgba(255,0,0,0.3); }';
		addStyle(prefix + fname,styles);
		fixNodeClosureIcons();
	} else {
		removeStyle(prefix + fname);
	}
}

function fixNodeClosureIcons() {
	var closureNodesId = W.map.getLayerByUniqueName('closure_nodes').id;
	var SVPinId = W.map.getLayersByName('streetViewPin')[0].id;
	addGlobalStyle('div#' + closureNodesId + ' { z-index: 725 !important }');
	insertNodeBeforeNode(getById(closureNodesId), getById(SVPinId));
}

function disableBridgeButton() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbDisableBridgeButton').checked) {
		styles += '.add-bridge { pointer-events: none; opacity: 0.4; }';
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
	}
}

function hideLinks() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	var compress = getById('_inpUICompression').value;
	if (getById('_cbHideLinks').checked) {
		//Nuke the links at the bottom of the side panel
		styles += '.waze-links { display: none; }';
		//extend side panel to the bottom
		if (getById('_cbShrinkTopBars').checked) {
			styles += '.edit-area { height: calc(100% ' + ['- 30px','- 9px','+ 2px'][compress] + '); }';
		} else {
			styles += '.edit-area { height: calc(100% - 30px); }';
		}
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
	}
}

function disableKinetic() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (getById('_cbDisableKinetic').checked) {
		W.map.controls.find(control => control.dragPan).dragPan.kinetic = null;
	} else {
		W.map.controls.find(control => control.dragPan).dragPan.kinetic = kineticDragParams;
	}
}

function disableScrollZoom() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var controller = null;
	if (W.map.navigationControl) {
		controller = W.map.navigationControl;
	} else if (W.map.controls.find(control => control.CLASS_NAME == 'OpenLayers.Control.Navigation')) {
		controller = W.map.controls.find(control => control.CLASS_NAME == 'OpenLayers.Control.Navigation');
	} else {
		logit('Cannot find zoom wheel controls - please alert iainhouse','error');
	}
	if (controller !== null) {
		if (getById('_cbDisableScrollZoom').checked) {
			controller.disableZoomWheel();
		} else {
			controller.enableZoomWheel();
		}
	}
}

function PSclicked(event) {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (event.ctrlKey) alert('CTRL');
	if (W.selectionManager.getSelectedFeatures().length > 0) {
		if (getById("user-info").style.display == "none") {
			getById("user-info").style.display = "block";
			getById("edit-panel").style.display = "none";
		} else {
			getById("user-info").style.display = "none";
			getById("edit-panel").style.display = "block";
		}
	}
}

function PSicon() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (W.selectionManager.getSelectedFeatures().length > 0) {
		getById("WMEFUPS").style.color = "red";
	} else {
		getById("WMEFUPS").style.color = "lightgrey";
	}
}

function PCclicked() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (location.search.match("segments")) reselectItems('segments',true);
	else if (location.search.match("venues")) reselectItems('venues',true);
	else if (location.search.match("nodes")) reselectItems('nodes',false);
	else if (location.search.match("mapComments")) reselectItems('mapComments',false);
	else if (location.search.match("cameras")) reselectItems('cameras',false);
}

function reselectItems ( typeDesc, isArray) {
	var parameter, IDArray, objectArray, i, object;
	parameter = location.search.match(new RegExp("[?&]" + typeDesc + "?=([^&]*)"));
	if (parameter) {
		IDArray=parameter[1].split(',');
		objectArray=[];
		for (i=0;i<IDArray.length;i++) {
			object=W.model[typeDesc].objects[IDArray[i]];
			if (typeof object!='undefined') objectArray.push(object);
		}
		if (isArray) {
			W.selectionManager.setSelectedModels(objectArray);
		} else {
			W.selectionManager.setSelectedModels(objectArray[0]);
		}
	}
}

function createDSASection() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var settingsDiv = document.querySelector("#sidepanel-prefs > div > div > form");
	if (!settingsDiv) {
		logit("WME Settings div not there yet - looping...","warning");
		setTimeout(createDSASection,500);
		return;
	}
	if (localStorage.dontShowAgain) {
		var dontShowAgain = JSON.parse(localStorage.dontShowAgain);
		var DSGroup = document.createElement('div');
		DSGroup.classList = "form-group";
		var DSLabel = document.createElement('label');
		DSLabel.classList = "control-label";
		DSLabel.innerHTML = "Disabled WME warnings";
		DSLabel.title = "This section will not update if you disable a warning\n";
		DSLabel.title += "from a WME pop-up. Re-load the page if you need\n";
		DSLabel.title += "to re-enable a warning you have just disabled.\n\n";
		DSLabel.title += "SECTION ADDED BY WME Fix UI.";
		DSGroup.appendChild(DSLabel);
		DSGroup.appendChild(document.createElement('br'));
		var DSCC = document.createElement('div');
		DSCC.classList = "controls-container";
		var DSInput;
		for (var property in dontShowAgain) {
			DSInput = document.createElement('input');
			DSInput.type = "checkbox";
			DSInput.id = "WMEFUDScb_" + property.toString();
			DSInput.setAttribute("orig", property.toString());
			DSInput.checked = dontShowAgain[property];
			DSLabel = document.createElement('label');
			DSLabel.setAttribute("for", DSInput.id);
			DSLabel.innerText = property.toString();
			DSCC.appendChild(DSInput);
			DSCC.appendChild(DSLabel);
			DSCC.appendChild(document.createElement('br'));
			DSInput.onclick = DSIclicked;
		}
		DSGroup.appendChild(DSCC);
		settingsDiv.appendChild(DSGroup);
	}
}

function DSIclicked (e) {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var DSA = JSON.parse(localStorage.dontShowAgain);
	DSA[e.target.getAttribute("orig")] = e.target.checked;
	localStorage.dontShowAgain = JSON.stringify(DSA);
}

function disableSaveBlocker() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbDisableSaveBlocker').checked) {
		styles += '#popup-overlay { display: none !important; }';
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
	}
}

function colourBlindTurns() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbColourBlindTurns').checked) {
		styles += '.turn-arrow-state-open { filter: hue-rotate(90deg); }';
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
	}
}

function hideMenuLabels() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbHideMenuLabels').checked) {
		styles += '.toolbar .group-title { width: 0; overflow: hidden; }';
		styles += '.toolbar .toolbar-button.toolbar-button-with-label.toolbar-button-with-icon .menu-title { width: 0; overflow: hidden; }';
		addStyle(prefix + fname,styles);
	} else {
		removeStyle(prefix + fname);
	}
}

function unfloatButtons() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	layersButton = getByClass('layers-switcher-region')[0];
	refreshButton = getByClass('reload-button-region')[0];
	shareButton  = getByClass('share-location-button-region')[0];
	if (getById('_cbUnfloatButtons').checked) {
		unfloat();
		//restore mouseover opening for layers menu
		layersButton.onmouseover = unfloat_showmenu;
		// getByClass('waze-icon-save')[0].onmouseover = unfloat_hidemenu;
		// getById('user-box-or-login-button-region').onmouseover = unfloat_hidemenu;
		document.body.onmouseleave = unfloat_hidemenu;
		//extra needed because layers no longer autohides
		getById('layer-switcher-region').onmouseleave = unfloat_hidemenu;
		//move layers menu div so it doesn't get moved by GSV
		insertNodeBeforeNode(getById('layer-switcher-region'),getById('waze-map-container'));
		var styles = '';
		styles += '.layer-switcher .menu { z-index: 4; }';
		styles += '.layer-switcher .menu > .title .w-icon-x { display: none }';
		addStyle(prefix + fname,styles);
		getById('WMEFUPIN').style.display = 'inherit';
		//hacks for other scripts
		if (getById('Info_div')) {
			getByClass('bottom overlay-buttons-container')[0].appendChild(getById('Info_div'));
			getById('Info_div').style.marginTop = '8px';
		}
		if (getById('BeenHere')) getById('BeenHere').style.top = '310px';
		//temporary hack for new button arrangements Map Nav Historic
		if (getById('prevIcon')) insertNodeBeforeNode(getById('prevIcon').parentNode,getById('nextIcon').parentNode);
		if ( wmeFUinitialising) setTimeout(unfloat,5000);
	} else {
		if (!wmeFUinitialising) {
			float();
			layersButton.onmouseover = null;
			// getByClass('waze-icon-save')[0].onmouseover = null;
			// getById('user-box-region').onmouseover = null;
			document.body.onmouseleave = null;
			getById('layer-switcher-region').onmouseleave = null;
			removeStyle(prefix + fname);
			getById('WMEFUPIN').style.display = 'none';
			getById('layer-switcher-pinned-input').checked = false;
			unfloat_hidemenu();
			pinLayers();
			if (getById('Info_div')) {
				getByClass('overlay-buttons-container top')[0].appendChild(getById('Info_div'));
				getById('Info_div').style.marginTop = '';
			}
			if (getById('BeenHere')) getById('BeenHere').style.top = '280px';
		}
	}
}

function unfloat_showmenu () {
	getByClass('menu',getById('layer-switcher-region'))[0].classList.remove('hide-layer-switcher');
}

function unfloat_hidemenu () {
	//This fails in Beta - the pin no longer exists
	if (getById('layer-switcher-pinned-input').checked == false) {
	getByClass('menu',getById('layer-switcher-region'))[0].classList.add('hide-layer-switcher');
	}
}

function unfloat () {
	getByClass('waze-icon-save')[0].onmouseover = unfloat_hidemenu;
	if (getById('user-toolbar') !== null) {
		getById('user-toolbar').onmouseover = unfloat_hidemenu;
	} else if (getById('user-box-region') !== null) {
		getById('user-box-region').onmouseover = unfloat_hidemenu;
	} else logit('Problem with User box ID','error');
	insertNodeAfterNode(layersButton,getById('save-button'));
	layersButton.classList.add('toolbar-button');
	layersButton.firstChild.classList.add('item-container');
	layersButton.firstChild.firstChild.classList.add('item-icon','w-icon','w-icon-layers');
	layersButton.firstChild.firstChild.classList.remove('overlay-button');
	layersButton.firstChild.firstChild.firstElementChild.classList.remove('w-icon','w-icon-layers');
	insertNodeBeforeNode(refreshButton,getById('undo-button'));
	refreshButton.classList.add('toolbar-button');
	refreshButton.firstChild.classList.add('item-container');
	refreshButton.firstChild.firstChild.classList.add('item-icon','w-icon','w-icon-refresh');
	refreshButton.firstChild.firstChild.classList.remove('overlay-button');
	refreshButton.firstChild.firstChild.firstElementChild.classList.remove('w-icon','w-icon-refresh');
	var styles = '';
	styles += '#edit-buttons .overlay-button-disabled { opacity: 0.5; cursor: not-allowed; }';
	styles += '#tippy-1 { top: -170px !important; }';
	styles += '.share-location-button-region { display: inline-block; }';
	styles += 'div.WazeControlPermalink > div > div > div { width: 26px; height: 22px; padding: 1px; }';
	styles += 'div.share-location-button-region > div > div > i { line-height: 18px; }';
	styles += 'a.w-icon.w-icon-link { line-height:17px; font-size: 20px; }';
	addStyle(prefix + 'unfloatButtons2',styles);
	insertNodeAfterNode(shareButton,getByClass('livemap-link')[0]);
	if (shareButton.firstChild.firstChild.innerHTML != '<i class="w-icon w-icon-link"></i>') {
		if (wmeFUinitialising) logit("Share button link has changed. Please let iainhouse know!","error");
	} else {
		shareButton.firstChild.firstChild.innerHTML = '<a class="w-icon w-icon-link"></a>';
	}
}

function float () {
	getByClass('overlay-buttons-container top')[0].appendChild(layersButton);
	layersButton.classList.remove('toolbar-button');
	layersButton.firstChild.classList.remove('item-container');
	layersButton.firstChild.firstChild.classList.remove('item-icon','w-icon','w-icon-layers');
	layersButton.firstChild.firstChild.classList.add('overlay-button');
	layersButton.firstChild.firstChild.firstElementChild.classList.add('w-icon','w-icon-layers');
	getByClass('overlay-buttons-container top')[0].appendChild(refreshButton);
	refreshButton.classList.remove('toolbar-button');
	refreshButton.firstChild.classList.remove('item-container');
	refreshButton.firstChild.firstChild.classList.remove('item-icon','w-icon','w-icon-refresh');
	refreshButton.firstChild.firstChild.classList.add('overlay-button');
	refreshButton.firstChild.firstChild.firstElementChild.classList.add('w-icon','w-icon-refresh');
	getByClass('overlay-buttons-container top')[0].appendChild(shareButton);
	shareButton.firstChild.firstChild.innerHTML = '<i class="w-icon w-icon-link"></i>';
	removeStyle(prefix + 'unfloatButtons2');
}

function pinLayers () {
	if (getById('layer-switcher-pinned-input').checked) {
		getById('WMEFUPIN').style.opacity = '1';
	} else {
		getById('WMEFUPIN').style.opacity = '0.2';
	}
}

function hackGSVHandle () {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var styles = "";
	if (getById('_cbHackGSVHandle').checked) {
		styles += '#editor-container #map.street-view-mode #street-view-drag-handle { height: 29px; background: lightgrey; font-size: 24px; border-radius: 8px; text-align: center; padding-top: 2px; border: 1px black solid; }';
		addStyle(prefix + fname,styles);
		getById('street-view-drag-handle').classList.add('w-icon','w-icon-round-trip');
		getById('street-view-drag-handle').title = 'Double-click to reset\ndefault width.';
	} else {
		removeStyle(prefix + fname);
		getById('street-view-drag-handle').removeAttribute('class');
		getById('street-view-drag-handle').removeAttribute('title');
	}
}

function enlargeGeoNodes () {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	removeStyle(prefix + fname);
	var styles = "";
	if (getById('_inpEnlargeGeoNodes').value < 6) getById('_inpEnlargeGeoNodes').value = 6;
	if (getById('_cbEnlargeGeoNodes').checked) {
		styles += '#' + W.map.getLayersByName('sketch')[0].id + '_vroot [id^="OpenLayers_Geometry_Point_"][fill-opacity="1"] { r: ' + getById('_inpEnlargeGeoNodes').value + '; }';
		styles += '#' + W.map.getLayerByUniqueName('venues').id + '_vroot [id^="OpenLayers_Geometry_Point_"][fill-opacity="1"] { r: ' + getById('_inpEnlargeGeoNodes').value + '; }';
		addStyle(prefix + fname,styles);
	}
}

function enlargeGeoHandles () {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	removeStyle(prefix + fname);
	var styles = "";
	if (getById('_inpEnlargeGeoHandles').value < 4) getById('_inpEnlargeGeoHandles').value = 4;
	if (getById('_cbEnlargeGeoHandlesFU').checked) {
		styles += '#' + W.map.getLayersByName('sketch')[0].id + '_vroot [id^="OpenLayers_Geometry_Point_"][fill-opacity="0.6"] { r: ' + getById('_inpEnlargeGeoHandles').value + '; }';
		styles += '#' + W.map.getLayerByUniqueName('venues').id + '_vroot [id^="OpenLayers_Geometry_Point_"][fill-opacity="0.6"] { r: ' + getById('_inpEnlargeGeoHandles').value + '; }';
		addStyle(prefix + fname,styles);
	}
}

function liveUserAdded(u) {
	var usrRank = u.attributes.rank;
	if (usrRank == null) {
		window.setTimeout(function() {
			liveUserAdded(u);
		}, 500);
		logit("User not loaded yet. Wait and try later...","info");
		return;
	} else {
		usrRank++;
	}
	var nameMarker = document.createElement("div");
	nameMarker.className = "tooltip fade top in";
	nameMarker.style.top = "-19px";
	nameMarker.style.backgroundColor = "black";
	nameMarker.style.color = "white";
	nameMarker.style.borderRadius = "5px";
	nameMarker.style.padding = "0px";
	nameMarker.style.zIndex = 3;
	nameMarker.style.pointerEvents = "none";
	nameMarker.innerHTML = u.attributes.name.replace(/-/gi, "&#x2011;") + "&nbsp;(" + usrRank + ')<div style="top: 17px;" class="tooltip-arrow"></div>';
	var marker = W.map.getLayerByUniqueName("live_users").markers.find(function(e) {
		return e.model.attributes.name == u.attributes.name;
	});
	if (typeof marker != "undefined") {
		marker.icon.$div[0].appendChild(nameMarker);
		marker.icon.$div[0].onmouseover = mouseOverLiveUser;
		// var d = new Date;
		// if (d.getDate() == 1 && d.getMonth() == 3) {
		// 	marker.icon.$div.css("background-image", 'url("data:image/png;base64,' + specialEventIcon + '")');
		// }
	}
	nameMarker.style.left = parseInt(u._events.moved[0].ctx.icon.$div[0].offsetWidth / 2 - nameMarker.offsetWidth / 2) + "px";
}

function mouseOverLiveUser() {
	var n = this.nextElementSibling;
	if (n.className == "tooltip fade top in") {
		n.style.display = "none";
	}
}

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) {
		return;
	}
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

function addStyle(ID, css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) {
		return;
	}
	removeStyle(ID); // in case it is already there
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	style.id = ID;
	head.appendChild(style);
}

function removeStyle(ID) {
	var style = document.getElementById(ID);
	if (style) { style.parentNode.removeChild(style); }
}

function getByClass(classname, node) {
	if(!node) { node = document.getElementsByTagName("body")[0]; }
	return node.getElementsByClassName(classname);
	// var a = [];
	// var re = new RegExp('\\b' + classname + '\\b');
	// var els = node.getElementsByTagName("*");
	// for (var i=0,j=els.length; i<j; i++) {
	// 	if (re.test(els[i].className)) { a.push(els[i]); }
	// }
	// return a;
}

function getById(node) {
	return document.getElementById(node);
}

function insertNodeBeforeNode (insertNode, beforeNode) {
	beforeNode.parentNode.insertBefore(insertNode,beforeNode);
}

function insertNodeAfterNode (insertNode, afterNode) {
	insertNodeBeforeNode (insertNode, afterNode);
	insertNodeBeforeNode (afterNode,insertNode);
}

function ChromeWarning () {
	var m = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
	var CV = ( m ? parseInt(m[2], 10) : false);
	if (CV) {
		if (CV <62) {
			return '\nWARNING: OUTDATED CHROME VERSION ' + CV + ' DETECTED.\nSettings saving may not work properly and update notice\nwill probably appear every time WME FixUI runs.\n';
		} else {
			return '';
		}
	} else {
		return '';
	}
}

function logit(msg, typ) {
	if (!typ) {
		console.log(prefix + ": " + msg);
	} else {
		switch(typ) {
			case "error":
				console.error(prefix + ": " + msg);
				break;
			case "warning":
				console.warn(prefix + ": " + msg);
				break;
			case "info":
				console.info(prefix + ": " + msg);
				break;
			case "debug":
				if (debug) {
					console.warn(prefix + ": " + msg);
				}
				break;
			default:
				console.log(prefix + " unknown message type: " + msg);
				break;
		}
	}
}

// eslint-disable-next-line no-unused-vars
function versionGreaterThan(major, minor) {
	var v = W.version.substring(1).replace("-",".").split(".");
	if (v[0] > major) return true;
	if (v[1] > minor) return true;
	return false;
}

// Start it running
setTimeout(init1, 200);
})();