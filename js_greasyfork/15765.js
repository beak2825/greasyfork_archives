/* global I18n */
/* global OpenLayers */
/* global $ */
/* global W */
/* global GM_info */
/* global require */
/* global performance */
/* global OL */
/* global _ */
// ==UserScript==
// @name		 Place Harmonizer Beta
// @namespace 	 https://greasyfork.org/en/users/19426-bmtg
// @version		1.1.31
// @description  Harmonizes, formats, and locks a selected place
// @author	   WMEPH development group
// @include         https://editor-beta.waze.com/*editor/*
// @include         https://www.waze.com/*editor/*
// @exclude          https://www.waze.com/*user/editor/*
// @grant	   none

// @downloadURL https://update.greasyfork.org/scripts/15765/Place%20Harmonizer%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/15765/Place%20Harmonizer%20Beta.meta.js
// ==/UserScript==
(function () {
	// item = W.selectionManager.selectedItems[0].model
	var WMEPHversion = GM_info.script.version.toString(); // pull version from header
	var WMEPHversionMeta = WMEPHversion.match(/(\d+\.\d+)/i)[1];  // get the X.X version
	var majorNewFeature = false;  // set to true to make an alert pop up after script update with new feature
	var scriptName = GM_info.script.name.toString();
	var isDevVersion = (scriptName.match(/Beta/i) !== null);  //  enables dev messages and unique DOM options if the script is called "... Beta"
	var USA_PNH_DATA, USA_PNH_NAMES = [], USA_CH_DATA, USA_STATE_DATA, USA_CH_NAMES = [];  // Storage for PNH and Category data
	var CAN_PNH_DATA, CAN_PNH_NAMES = [];  // var CAN_CH_DATA, CAN_CH_NAMES = [] not used for now
	var hospitalPartMatch, hospitalFullMatch, animalPartMatch, animalFullMatch, schoolPartMatch, schoolFullMatch;  // vars for cat-name checking
	var WMEPHdevList, WMEPHbetaList;  // Userlists
	var devVersStr='', devVersStrSpace='', devVersStrDash='';  // strings to differentiate DOM elements between regular and beta script
	var devVersStringMaster = "Beta";
	var dataReadyCounter = 0;
	var betaDataDelay = 10;
	if (isDevVersion) { 
		devVersStr = devVersStringMaster; devVersStrSpace = " " + devVersStr; devVersStrDash = "-" + devVersStr; 
		betaDataDelay = 20;
	}
	var WMEServicesArray = ["VALLET_SERVICE","DRIVETHROUGH","WI_FI","RESTROOMS","CREDIT_CARDS","RESERVATIONS","OUTSIDE_SEATING","AIR_CONDITIONING","PARKING_FOR_CUSTOMERS","DELIVERIES","TAKE_AWAY","WHEELCHAIR_ACCESSIBLE"];
	var collegeAbbreviations = 'USF|USFSP|UF|UCF|UA|UGA|FSU|UM|SCP|FAU|FIU';
	var defaultKBShortcut,shortcutParse, modifKey = 'Alt+';
	var forumMsgInputs;
	var venueWhitelist, venueWhitelistStr, WLSToMerge, wlKeyName, wlButtText = 'WL';  // Whitelisting vars
	var WLlocalStoreName = 'WMEPH-venueWhitelistNew';
	var WLlocalStoreNameCompressed = 'WMEPH-venueWhitelistCompressed';
	var compressedWLLS;
	var WMEPH_NameLayer, nameLayer, dupeIDList = [], dupeHNRangeList, dupeHNRangeIDList, dupeHNRangeDistList;
	// Web search Window forming:
	var searchResultsWindowSpecs = '"resizable=yes, top='+ Math.round(window.screen.height*0.1) +', left='+ Math.round(window.screen.width*0.3) +', width='+ Math.round(window.screen.width*0.7) +', height='+ Math.round(window.screen.height*0.8) +'"';
	var searchResultsWindowName = '"WMEPH Search Results"';
	var WMEPHmousePosition;
	var useState = true;
	var cloneMaster = null;
	var bannButt, bannButt2, bannServ, bannDupl, bannButtHL;  // Banner Buttons objects
	var RPPLockString = 'Lock?';
	var panelFields = {};  // the fields for the sidebar
	
	// Array prototype extensions (for Firefox fix)
	Array.prototype.toSet = function () {
		return this.reduce(function (e, t) {return e[t] = !0, e;}, {});
	};
	Array.prototype.first = function () {
		return this[0];
	};
	Array.prototype.isEmpty = function () {
		return 0 === this.length;
	};
	
	/* ****** Pull PNH and Userlist data ****** */
	setTimeout(function() {
		// Pull USA PNH Data
		setTimeout(function() {
			$.ajax({
				type: 'GET',
				url: 'https://spreadsheets.google.com/feeds/list/1-f-JTWY5UnBx-rFTa4qhyGMYdHBZWNirUTOgn222zMY/o6q7kx/public/values',
				jsonp: 'callback', data: { alt: 'json-in-script' }, dataType: 'jsonp',
				success: function(response) {
					USA_PNH_DATA = [];
					for (var i = 0; i < response.feed.entry.length; i++) {
						USA_PNH_DATA.push(response.feed.entry[i].gsx$pnhdata.$t);
					}
				}
			});
		}, 0);
		// Pull Category Data ( Includes CAN for now )
		setTimeout(function() {
			$.ajax({
				type: 'GET',
				url: 'https://spreadsheets.google.com/feeds/list/1-f-JTWY5UnBx-rFTa4qhyGMYdHBZWNirUTOgn222zMY/ov3dubz/public/values',
				jsonp: 'callback', data: { alt: 'json-in-script' }, dataType: 'jsonp',
				success: function(response) {
					USA_CH_DATA = [];
					for (var i = 0; i < response.feed.entry.length; i++) {
						USA_CH_DATA.push(response.feed.entry[i].gsx$pcdata.$t);
					}
				}
			});
		}, 20);
		// Pull State-based Data (includes CAN for now)
		setTimeout(function() {
			$.ajax({
				type: 'GET',
				url: 'https://spreadsheets.google.com/feeds/list/1-f-JTWY5UnBx-rFTa4qhyGMYdHBZWNirUTOgn222zMY/os2g2ln/public/values',
				jsonp: 'callback', data: { alt: 'json-in-script' }, dataType: 'jsonp',
				success: function(response) {
					USA_STATE_DATA = [];
					for (var i = 0; i < response.feed.entry.length; i++) {
						USA_STATE_DATA.push(response.feed.entry[i].gsx$psdata.$t);
					}
				}
			});
		}, 40);
		// Pull CAN PNH Data
		setTimeout(function() {
			$.ajax({
				type: 'GET',
				url: 'https://spreadsheets.google.com/feeds/list/1TIxQZVLUbAJ8iH6LPTkJsvqFb_DstrHpKsJbv1W1FZs/o4ghhas/public/values',
				jsonp: 'callback', data: { alt: 'json-in-script' }, dataType: 'jsonp',
				success: function(response) {
					CAN_PNH_DATA = [];
					for (var i = 0; i < response.feed.entry.length; i++) {
						CAN_PNH_DATA.push(response.feed.entry[i].gsx$pnhdata.$t);
					}
				}
			});
		}, 60);
		// Pull name-category lists
		setTimeout(function() {
			$.ajax({
				type: 'GET',
				url: 'https://spreadsheets.google.com/feeds/list/1qPjzDu7ZWcpz9xrWYgU7BFLVdbk9ycqgPK9f2mydYlA/op17piq/public/values',
				jsonp: 'callback', data: { alt: 'json-in-script' }, dataType: 'jsonp',
				success: function(response) {
					hospitalPartMatch = response.feed.entry[0].gsx$hmchp.$t;
					hospitalFullMatch = response.feed.entry[0].gsx$hmchf.$t;
					animalPartMatch = response.feed.entry[0].gsx$hmcap.$t;
					animalFullMatch = response.feed.entry[0].gsx$hmcaf.$t;
					schoolPartMatch = response.feed.entry[0].gsx$schp.$t;
					schoolFullMatch = response.feed.entry[0].gsx$schf.$t;
					hospitalPartMatch = hospitalPartMatch.toLowerCase().replace(/ \|/g,'|').replace(/\| /g,'|').split("|");
					hospitalFullMatch = hospitalFullMatch.toLowerCase().replace(/ \|/g,'|').replace(/\| /g,'|').split("|");	
					animalPartMatch = animalPartMatch.toLowerCase().replace(/ \|/g,'|').replace(/\| /g,'|').split("|");	
					animalFullMatch = animalFullMatch.toLowerCase().replace(/ \|/g,'|').replace(/\| /g,'|').split("|");
					schoolPartMatch = schoolPartMatch.toLowerCase().replace(/ \|/g,'|').replace(/\| /g,'|').split("|");	
					schoolFullMatch = schoolFullMatch.toLowerCase().replace(/ \|/g,'|').replace(/\| /g,'|').split("|");
				}
			});
		}, 80);
		// Pull dev and beta UserList Data
		setTimeout(function() {
			$.ajax({
				type: 'GET',
				url: 'https://spreadsheets.google.com/feeds/list/1L82mM8Xg-MvKqK3WOfsMhFEGmVM46lA8BVcx8qwgmA8/ofblgob/public/values',
				jsonp: 'callback', data: { alt: 'json-in-script' }, dataType: 'jsonp',
				success: function(response) {
					var WMEPHuserList = response.feed.entry[0].gsx$phuserlist.$t;
					WMEPHuserList = WMEPHuserList.split("|");
					var betaix = WMEPHuserList.indexOf('BETAUSERS');
					WMEPHdevList = [];
					WMEPHbetaList = [];
					for (var ulix=1; ulix<betaix; ulix++) {
						WMEPHdevList.push(WMEPHuserList[ulix].toLowerCase());
					}
					for (ulix=betaix+1; ulix<WMEPHuserList.length; ulix++) {
						WMEPHbetaList.push(WMEPHuserList[ulix].toLowerCase());
					}
				}
			});
		}, 100);
	}, betaDataDelay);
	
	function placeHarmonizer_bootstrap() {
		if ( "undefined" !== typeof W.loginManager && "undefined" !== typeof W.map) {
			setTimeout(dataReady,200);  //  Run the code to check for data return from the Sheets
			// Create duplicatePlaceName layer
			var rlayers = W.map.getLayersBy("uniqueName","__DuplicatePlaceNames");
			if(rlayers.length === 0) {
				var lname = "WMEPH Duplicate Names";
				var style = new OpenLayers.Style({ label : "${labelText}", labelOutlineColor: '#333', labelOutlineWidth: 3, labelAlign: '${labelAlign}', 
					fontColor: "${fontColor}", fontOpacity: 1.0, fontSize: "20px", labelYOffset: -30, labelXOffset: 0, fontWeight: "bold",
					fill: false, strokeColor: "${strokeColor}", strokeWidth: 10, pointRadius: "${pointRadius}" });
				nameLayer = new OpenLayers.Layer.Vector(lname, { displayInLayerSwitcher: false, uniqueName: "__DuplicatePlaceNames", styleMap: new OpenLayers.StyleMap(style) });
				nameLayer.setVisibility(false);
				W.map.addLayer(nameLayer);
				WMEPH_NameLayer = nameLayer;
			} else {
				WMEPH_NameLayer = rlayers[0];
			}
		} else {
			phlog("Waiting for WME map and login...");
			setTimeout(function () { placeHarmonizer_bootstrap(); }, 50);
		}
	}
	
	function dataReady() {
		// If the data has returned, then start the script, otherwise wait a bit longer
		if ("undefined" !== typeof CAN_PNH_DATA && "undefined" !== typeof USA_PNH_DATA && "undefined" !== typeof USA_CH_DATA && 
			"undefined" !== typeof WMEPHdevList && "undefined" !== typeof WMEPHbetaList && "undefined" !== typeof hospitalPartMatch ) {	
			setTimeout(function(){ // Build the name search lists
				USA_PNH_NAMES = makeNameCheckList(USA_PNH_DATA);
				USA_CH_NAMES = makeCatCheckList(USA_CH_DATA);
				CAN_PNH_NAMES = makeNameCheckList(CAN_PNH_DATA);
				// CAN using USA_CH_NAMES at the moment
			}, 10);
			setTimeout(loginReady, 20);  //  start the main code
		} else {
			if (dataReadyCounter % 20 === 0) {
				var waitMessage = 'Waiting for ';
				if ("undefined" === typeof CAN_PNH_DATA) {
					waitMessage = waitMessage + "CAN PNH Data; ";
				} 
				if ("undefined" === typeof USA_PNH_DATA) {
					waitMessage = waitMessage + "USA PNH Data; ";
				}
				if ("undefined" === typeof hospitalPartMatch) {
					waitMessage = waitMessage + "Cat-Name Data; ";
				}
				if ("undefined" === typeof WMEPHdevList) {
					waitMessage = waitMessage + "User List Data;";
				}
				phlog(waitMessage);
			}
			if (dataReadyCounter<200) {
				dataReadyCounter++;
				setTimeout(function () { dataReady(); }, 100);
			} else {
				phlog("Data load took too long, reload WME...");
			}
		}
	}
	
	function loginReady() {
		dataReadyCounter = 0;
		if ( W.loginManager.user !== null) {
			setTimeout(runPH, 10);  //  start the main code
		} else {
			if (dataReadyCounter<50) {
				dataReadyCounter++;
				phlog("Waiting for WME login...");
				setTimeout(function () { dataReady(); }, 200);
			} else {
				phlog("Login failed...?  Reload WME.");
			}
			
		}
	}
	
	function runPH() {
		// Script update info
		var WMEPHWhatsNewList = [  // New in this version
			'1.1.31: NV phone format fix',
			'1.1.31: Hours message fix',
			'1.1.31: Highlighter fix',
			'1.1.30: Cardyin fixes',
			'1.1.29: Missing HN can be entered in the banner',
			'1.1.29: RPPs with street address but no city are blue now',
			'1.1.29: Hours, HL, and WL tweaks, fixes',
			'1.1.28: Bug fix',
			'1.1.27: Autoremove dashes for HNs in Queens, NY',
			'1.1.27: Autosplits Sun,Mon hours because of WME display bug',
			'1.1.26: Bug fix',
			'1.1.25: Fields changed by the script are highlighted in green',
			'1.1.25: Option to auto-run the script when a place is selected (R3+)',
		];
		var WMEPHWhatsNewMetaList = [  // New in this major version
			'1.1: Built-in place highlighter shows which places on the map need work',
		];  
		var newSep = '\n - ', listSep = '<li>';  // joiners for script and html messages
		var WMEPHWhatsNew = WMEPHWhatsNewList.join(newSep);
		var WMEPHWhatsNewMeta = WMEPHWhatsNewMetaList.join(newSep);
		var WMEPHWhatsNewHList = WMEPHWhatsNewList.join(listSep);
		var WMEPHWhatsNewMetaHList = WMEPHWhatsNewMetaList.join(listSep);
		WMEPHWhatsNew = 'WMEPH v. ' + WMEPHversion + '\nUpdates:' + newSep + WMEPHWhatsNew;
		WMEPHWhatsNewMeta = 'WMEPH v. ' + WMEPHversionMeta + '\nMajor features:' + newSep + WMEPHWhatsNewMeta;
		if ( localStorage.getItem('WMEPH-featuresExamined'+devVersStr) === null ) {
			localStorage.setItem('WMEPH-featuresExamined'+devVersStr, '0');  // Storage for whether the User has pressed the button to look at updates
		}
		var thisUser = W.loginManager.user;
		var UpdateObject = require("Waze/Action/UpdateObject");
		
		// Whitelist initialization
		compressedWLLS = false;
		if ( validateWLS( LZString.decompressFromUTF16(localStorage.getItem(WLlocalStoreNameCompressed)) ) === false ) {  // If no compressed WL string exists
			if ( validateWLS(localStorage.getItem(WLlocalStoreName)) === false ) {  // If no regular WL exists
				venueWhitelist = { '1.1.1': { Placeholder: {  } } }; // Populate with a dummy place
				saveWL_LS(compressedWLLS);
				compressedWLLS = true;
				saveWL_LS(compressedWLLS);
			} else {  // if regular WL string exists, then transfer to compressed version
				localStorage.setItem('WMEPH-OneTimeWLBU', localStorage.getItem(WLlocalStoreName));
				loadWL_LS(compressedWLLS);
				compressedWLLS = true;
				saveWL_LS(compressedWLLS);
				alert('Whitelists are being converted to a compressed format.  If you have trouble with your WL, please submit an error report.');
			}
		} else {
			compressedWLLS = true;
			loadWL_LS(compressedWLLS);
		}
		
		if (W.loginManager.user.userName === 'ggrane') {
			searchResultsWindowSpecs = '"resizable=yes, top='+ Math.round(window.screen.height*0.1) +', left='+ Math.round(window.screen.width*0.3) +', width='+ Math.round(window.screen.width*0.86) +', height='+ Math.round(window.screen.height*0.8) +'"';
		}
	
		// Initialize the WL Object
		var currentWL = {};
		
		// If the editor installs for the 1st time, alert with the new elements
		if ( localStorage.getItem('WMEPHversionMeta'+devVersStr) === null ) {
			alert(WMEPHWhatsNewMeta);
			localStorage.setItem('WMEPHversionMeta'+devVersStr, WMEPHversionMeta);
			localStorage.setItem('WMEPHversion'+devVersStr, WMEPHversion);
			localStorage.setItem(GLinkWarning, '0');  // Reset warnings
			localStorage.setItem(SFURLWarning, '0');
			localStorage.setItem('WMEPH-featuresExamined'+devVersStr, '1');  // disable the button
		} else if (localStorage.getItem('WMEPHversionMeta'+devVersStr) !== WMEPHversionMeta) { // If the editor installs a newer MAJOR version, alert with the new elements
			alert(WMEPHWhatsNewMeta);
			localStorage.setItem('WMEPHversionMeta'+devVersStr, WMEPHversionMeta);
			localStorage.setItem('WMEPHversion'+devVersStr, WMEPHversion);
			localStorage.setItem(GLinkWarning, '0');  // Reset warnings
			localStorage.setItem(SFURLWarning, '0');
			localStorage.setItem('WMEPH-featuresExamined'+devVersStr, '1');  // disable the button
		} else if (localStorage.getItem('WMEPHversion'+devVersStr) !== WMEPHversion) {  // If MINOR version....
			if (majorNewFeature) {  //  with major feature update, then alert
				alert(WMEPHWhatsNew);
				localStorage.setItem('WMEPH-featuresExamined'+devVersStr, '1');  // disable the button
			} else {  //  if not major feature update, then keep the button
				localStorage.setItem('WMEPH-featuresExamined'+devVersStr, '0');
			}
			localStorage.setItem('WMEPHversion'+devVersStr, WMEPHversion);  // store last installed version in localstorage
		}
		
		// Settings setup
		var GLinkWarning = 'GLinkWarning';  // Warning message for first time using Google search to not to use the Google info itself.
		if (!localStorage.getItem(GLinkWarning)) {  // store settings so the warning is only given once
			localStorage.setItem(GLinkWarning, '0');
		}
		var SFURLWarning = 'SFURLWarning';  // Warning message for first time using localized storefinder URL.
		if (!localStorage.getItem(SFURLWarning)) {  // store settings so the warning is only given once
			localStorage.setItem(SFURLWarning, '0');
		}
		
		setTimeout(add_PlaceHarmonizationSettingsTab, 50);  // initialize the settings tab
		
		// Event listeners
		W.selectionManager.events.registerPriority("selectionchanged", this, checkSelection);
		if ( W.model.venues.hasOwnProperty('events') ) {
			W.model.venues.events.registerPriority('objectschanged', this, deleteDupeLabel);
		} else if ( W.model.venues.hasOwnProperty('on') ) {
			W.model.venues.on('objectschanged', deleteDupeLabel);
		}
		W.accelerators.events.registerPriority('save', null, destroyDupeLabels);
		var WMEPHurl = 'https://www.waze.com/forum/posting.php?mode=reply&f=819&t=164962';  // WMEPH Forum thread URL
		var USAPNHMasURL = 'https://docs.google.com/spreadsheets/d/1-f-JTWY5UnBx-rFTa4qhyGMYdHBZWNirUTOgn222zMY/edit#gid=0';  // Master USA PNH link
		var placesWikiURL = 'https://wiki.waze.com/wiki/Places';  // WME Places wiki
		var restAreaWikiURL = 'https://wiki.waze.com/wiki/Rest_areas#Adding_a_Place';  // WME Places wiki
		var betaUser, devUser;
		if (WMEPHbetaList.length === 0 || "undefined" === typeof WMEPHbetaList) {
			if (isDevVersion) {
				alert('Beta user list access issue.  Please post in the GHO or PM/DM bmtg about this message.  Script should still work.');
			}
			betaUser = false;
			devUser = false;
		} else {
			devUser = (WMEPHdevList.indexOf(thisUser.userName.toLowerCase()) > -1);
			betaUser = (WMEPHbetaList.indexOf(thisUser.userName.toLowerCase()) > -1);
		}
		if (devUser) {
			betaUser = true; // dev users are beta users
			if (thisUser.userName !== 'bmtg') { debugger; }
		}  
		var usrRank = thisUser.normalizedLevel;  // get editor's level (actual level)
		var userLanguage = 'en';
		
		// lock levels are offset by one
		var lockLevel1 = 0, lockLevel2 = 1, lockLevel3 = 2, lockLevel4 = 3, lockLevel5 = 4;
		var defaultLockLevel = lockLevel2, PNHLockLevel;
		var PMUserList = { // user names and IDs for PM functions
			SER: {approvalActive: true, modID: '16941753', modName: 't0cableguy'},
			WMEPH: {approvalActive: true, modID: '17027620', modName: 'bmtg'}
		};
		var severityButt=0;  // error tracking to determine banner color (action buttons)
		var duplicateName = '';
		var catTransWaze2Lang = I18n.translations[userLanguage].venues.categories;  // pulls the category translations
		var item, itemID, newName, optionalAlias, newURL, tempPNHURL = '', newPhone;
		var newAliases = [], newAliasesTemp = [], newCategories = [];
		var numAttempts = 0;
		
		// Split out state-based data (USA_STATE_DATA)
		var USA_STATE_HEADERS = USA_STATE_DATA[0].split("|");
		var ps_state_ix = USA_STATE_HEADERS.indexOf('ps_state');
		var ps_state2L_ix = USA_STATE_HEADERS.indexOf('ps_state2L');
		var ps_region_ix = USA_STATE_HEADERS.indexOf('ps_region');
		var ps_gFormState_ix = USA_STATE_HEADERS.indexOf('ps_gFormState');
		var ps_defaultLockLevel_ix = USA_STATE_HEADERS.indexOf('ps_defaultLockLevel');
		//var ps_requirePhone_ix = USA_STATE_HEADERS.indexOf('ps_requirePhone');
		//var ps_requireURL_ix = USA_STATE_HEADERS.indexOf('ps_requireURL');
		var ps_areacode_ix = USA_STATE_HEADERS.indexOf('ps_areacode');
		var stateDataTemp, areaCodeList = '800,822,833,844,855,866,877,888';  //  include toll free non-geographic area codes
		var ixBank, ixATM, ixOffices;
						
		// Set up Run WMEPH button once place is selected
		bootstrapRunButton();
		
		/**
		 * Generates highlighting rules and applies them to the map.
		 */
		var layer = W.map.landmarkLayer;
		function initializeHighlights() {
			var ruleGenerator = function(value, symbolizer) {
				return new W.Rule({
					filter: new OL.Filter.Comparison({
						type: '==',
						value: value,
						evaluate: function(venue) {
							return venue && venue.model && venue.model.attributes.wmephSeverity === this.value;
						}
					}),
					symbolizer: symbolizer
				});
			};
			
			var severity0 = ruleGenerator(0, {
				'pointRadius': '5',
				'strokeWidth': '4',
				'strokeColor': '#24ff14'
			});
			
			var severityLock = ruleGenerator('lock', {
				'pointRadius': '5',
				'strokeColor': '#24ff14',
				'strokeLinecap': '1',
				'strokeDashstyle': '7 2',
				'strokeWidth': '5'
			});
			if (thisUser.userName === 'bmtg') {
				severityLock = ruleGenerator('lock', {
					'pointRadius': '8',
					'strokeColor': '#24ff14',
					'strokeLinecap': '1',
					'strokeDashstyle': '7 2',
					'strokeWidth': '11'
				});
			}
			
			var severity1 = ruleGenerator(1, {
				'strokeColor': '#0099ff',
				'strokeWidth': '4',
				'pointRadius': '7'
			});
			
			var severityLock1 = ruleGenerator('lock1', {
				'pointRadius': '5',
				'strokeColor': '#0099ff',
				'strokeLinecap': '1',
				'strokeDashstyle': '7 2',
				'strokeWidth': '5'
			});
			if (thisUser.userName === 'bmtg') {
				severityLock1 = ruleGenerator('lock1', {
					'pointRadius': '8',
					'strokeColor': '#0099ff',
					'strokeLinecap': '1',
					'strokeDashstyle': '7 2',
					'strokeWidth': '11'
				});
			}
			
			var severity2 = ruleGenerator(2, {
				'strokeColor': '#ff0000',
				'strokeWidth': '4',
				'pointRadius': '8'
			});
			
			var severity3 = ruleGenerator(3, {
				'strokeColor': '#ff0000',
				'strokeWidth': '4',
				'pointRadius': '8'
			});
			
			var severity4 = ruleGenerator(4, {
				'fillColor': 'black',
				'fillOpacity': '0.35',
				'strokeColor': '#f42',
				'strokeLinecap': '1',
				'strokeWidth': '13',
				'strokeDashstyle': '4 2'
			});
			
			var severityHigh = ruleGenerator(5, {
				'pointRadius': '12',
				'fillColor': 'black',
				'fillOpacity': '0.4',
				'strokeColor': '#f4a',
				'strokeLinecap': '1',
				'strokeWidth': '10',
				'strokeDashstyle': '4 2'
			});
			
			var severityAdLock = ruleGenerator('adLock', {
				'pointRadius': '12',
				'fillColor': 'yellow',
				'fillOpacity': '0.4',
				'strokeColor': '#000',
				'strokeLinecap': '1',
				'strokeWidth': '10',
				'strokeDashstyle': '4 2'
			});
			
			
			
			Array.prototype.push.apply(layer.styleMap.styles['default'].rules, [severity0, severityLock, severity1, severityLock1, severity2, severity3, severity4, severityHigh, severityAdLock]);
			// to make Google Script linter happy ^^^ Array.prototype.push.apply(layer.styleMap.styles.default.rules, [severity0, severityLock, severity1, severity2, severity3, severity4, severityHigh]);
			/* Can apply to normal view or selection/highlight views as well.
			_.each(layer.styleMap.styles, function(style) {
				style.rules = style.rules.concat([severity0, severityLock, severity1, severity2, severity3, severity4, severityHigh]);
			});
			*/
		}
		
		/**
		 * To highlight a place, set the wmephSeverity attribute to the desired highlight level.
		 */
		function applyHighlightsTest(venues) {
			venues = venues ? _.isArray(venues) ? venues : [venues] : [];
			var currentVenue = false;
			var storedBannButt = bannButt, storedBannServ = bannServ, storedBannButt2 = bannButt2;
			var t0 = performance.now();  // Speed check start
			
			_.each(venues, function (venue) {
				if (venue.CLASS_NAME === 'Waze.Feature.Vector.Landmark' &&
					venue.attributes) {
					// Highlighting logic would go here
					// Severity can be: 0, 'lock', 1, 2, 3, 4, or 'high'. Set to 
					// anything else to use default WME style.
					if ( $("#WMEPH-ColorHighlighting" + devVersStr).prop('checked') ) {
						try {
							venue.attributes.wmephSeverity = harmonizePlaceGo(venue,'highlight');
						} catch (err) {
							phlogdev("getCentroid error occurred.");
						}
					} else {
						venue.attributes.wmephSeverity = 'default';
					}
					
				}
			});
			if (W.selectionManager.selectedItems.length === 1) {
				var venue = W.selectionManager.selectedItems[0].model;
				if (venue.type === "venue") { 
					venue.attributes.wmephSeverity = harmonizePlaceGo(venue,'highlight');
					bannButt = storedBannButt;
					bannServ = storedBannServ;
					bannButt2 = storedBannButt2;
				}
			}
			layer.redraw();
			var t1 = performance.now();  // log search time
			phlogdev("Ran highlighter in " + (t1 - t0) + " milliseconds.");
			
		}
		
		// Setup highlight colors
		initializeHighlights();
		
		// Set up CH loop
		function bootstrapWMEPH_CH() {
			if ( $("#WMEPH-ColorHighlighting" + devVersStr).prop('checked') ) {
				// Turn off place highlighting in WMECH if it's on.
				if ( $("#_cbHighlightPlaces").prop('checked') ) {
					$("#_cbHighlightPlaces").trigger('click');
				}
				// Add listeners
				W.model.venues.on('objectschanged', function (e) {
					applyHighlightsTest(e);
				});

				W.model.venues.on('objectsadded', function (e) {
					applyHighlightsTest(e);
				});

				// Apply the colors
				applyHighlightsTest(W.model.venues.getObjectArray());

				//setTimeout(bootstrapWMEPH_CH,500);  // Refresh the Highlights periodically
			} else {
				// reset the colors to default
				applyHighlightsTest(W.model.venues.getObjectArray());
				//updateWMEPH_CH(false);
			}
		}
		
		// used for phone reformatting
		if (!String.plFormat) {
			String.plFormat = function(format) {
				var args = Array.prototype.slice.call(arguments, 1);
				return format.replace(/{(\d+)}/g, function(name, number) {
					return typeof args[number] !== "undefined" ? args[number] : null;
				});
			};
		}
		
		// Change place.name to title case
		var ignoreWords = "an|and|as|at|by|for|from|hhgregg|in|into|of|on|or|the|to|with".split('|');
		var capWords = "3M|AAA|AMC|AOL|AT&T|ATM|BBC|BLT|BMV|BMW|BP|CBS|CCS|CGI|CISCO|CJ|CNN|CVS|DHL|DKNY|DMV|DSW|EMS|ER|ESPN|FCU|FCUK|FDNY|GNC|H&M|HP|HSBC|IBM|IHOP|IKEA|IRS|JBL|JCPenney|KFC|LLC|MBNA|MCA|MCI|NBC|NYPD|PDQ|PNC|TCBY|TNT|TV|UPS|USA|USPS|VW|XYZ|ZZZ".split('|');
		var specWords = "d'Bronx|iFix".split('|');
		
		function toTitleCase(str) {
			if (!str) {
				return str;
			}
			var allCaps = (str === str.toUpperCase());
			// Cap first letter of each word
			str = str.replace(/([A-Za-z\u00C0-\u017F][^\s-\/]*) */g, function(txt) {
				return ((txt === txt.toUpperCase()) && !allCaps) ? txt : txt.charAt(0).toUpperCase() + txt.substr(1);
			});
			// Cap O'Reilley's, L'Amour, D'Artagnan as long as 5+ letters
			str = str.replace(/[oOlLdD]'[A-Za-z']{3,}/g, function(txt) {
				return ((txt === txt.toUpperCase()) && !allCaps) ? txt : txt.charAt(0).toUpperCase() + txt.charAt(1) + txt.charAt(2).toUpperCase() + txt.substr(3);
			});
			// Cap McFarley's, as long as 5+ letters long
			str = str.replace(/[mM][cC][A-Za-z']{3,}/g, function(txt) {
				return ((txt === txt.toUpperCase()) && !allCaps) ? txt : txt.charAt(0).toUpperCase() + txt.charAt(1).toLowerCase() + txt.charAt(2).toUpperCase() + txt.substr(3);
			});
			// anything with an "&" sign, cap the character after &
			str = str.replace(/&.+/g, function(txt) {
				return ((txt === txt.toUpperCase()) && !allCaps) ? txt : txt.charAt(0) + txt.charAt(1).toUpperCase() + txt.substr(2);
			});
			// lowercase any from the ignoreWords list
			str = str.replace(/[^ ]+/g, function(txt) {
				var txtLC = txt.toLowerCase();
				return (ignoreWords.indexOf(txtLC) > -1) ? txtLC : txt;
			});
			// uppercase any from the capWords List
			str = str.replace(/[^ ]+/g, function(txt) {
				var txtUC = txt.toUpperCase();
				return (capWords.indexOf(txtUC) > -1) ? txtUC : txt;
			});
			// preserve any specific words 
			str = str.replace(/[^ ]+/g, function(txt) {
				//var txtAC = txt.toUpperCase();
				for (var swix=0; swix<specWords.length; swix++) {
					if ( txt.toUpperCase() === specWords[swix].toUpperCase() ) {
						return specWords[swix];
					}
				}
				return txt;
			});
			// Fix 1st, 2nd, 3rd, 4th, etc. to lowercase
			str = str.replace(/\b(\d*1)st\b/gi, '$1st');
			str = str.replace(/\b(\d*2)nd\b/gi, '$1nd');
			str = str.replace(/\b(\d*3)rd\b/gi, '$1rd');
			str = str.replace(/\b(\d+)th\b/gi, '$1th');
			// Cap first letter of entire name
			str = str.charAt(0).toUpperCase() + str.substr(1);
			return str;
		}
	
		// Change place.name to title case
		function toTitleCaseStrong(str) {
			if (!str) {
				return str;
			}
			var allCaps = (str === str.toUpperCase());
			// Cap first letter of each word
			str = str.replace(/([A-Za-z\u00C0-\u017F][^\s-\/]*) */g, function(txt) {
				return ((txt === txt.toUpperCase()) && !allCaps) ? txt : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
			// Cap O'Reilley's, L'Amour, D'Artagnan as long as 5+ letters
			str = str.replace(/[oOlLdD]'[A-Za-z']{3,}/g, function(txt) {
				return ((txt === txt.toUpperCase()) && !allCaps) ? txt : txt.charAt(0).toUpperCase() + txt.charAt(1) + txt.charAt(2).toUpperCase() + txt.substr(3).toLowerCase();
			});
			// Cap McFarley's, as long as 5+ letters long
			str = str.replace(/[mM][cC][A-Za-z']{3,}/g, function(txt) {
				return ((txt === txt.toUpperCase()) && !allCaps) ? txt : txt.charAt(0).toUpperCase() + txt.charAt(1).toLowerCase() + txt.charAt(2).toUpperCase() + txt.substr(3).toLowerCase();
			});
			// anything sith an "&" sign, cap the word after &
			str = str.replace(/&\w+/g, function(txt) {
				return ((txt === txt.toUpperCase()) && !allCaps) ? txt : txt.charAt(0) + txt.charAt(1).toUpperCase() + txt.substr(2);
			});
			// lowercase any from the ignoreWords list
			str = str.replace(/[^ ]+/g, function(txt) {
				var txtLC = txt.toLowerCase();
				return (ignoreWords.indexOf(txtLC) > -1) ? txtLC : txt;
			});
			// uppercase any from the capWords List
			str = str.replace(/[^ ]+/g, function(txt) {
				var txtLC = txt.toUpperCase();
				return (capWords.indexOf(txtLC) > -1) ? txtLC : txt;
			});
			// Fix 1st, 2nd, 3rd, 4th, etc.
			str = str.replace(/\b(\d*1)st\b/gi, '$1st');
			str = str.replace(/\b(\d*2)nd\b/gi, '$1nd');
			str = str.replace(/\b(\d*3)rd\b/gi, '$1rd');
			str = str.replace(/\b(\d+)th\b/gi, '$1th');
			// Cap first letter of entire name
			str = str.charAt(0).toUpperCase() + str.substr(1);
			return str;
		}
		
		// normalize phone
		function normalizePhone(s, outputFormat, returnType) {
			if ( !s && returnType === 'existing' ) {
				bannButt.phoneMissing.active = true;
				if (currentWL.phoneWL) {
					bannButt.phoneMissing.WLactive = false;
				}
				return s;
			}
			s = s.replace(/(\d{3}.*)extension.*/i, '$1');
			s = s.replace(/(\d{3}.*)ext.*/i, '$1');
			s = s.replace(/(\d{3}.*) xt\.? \d.*/i, '$1');
			s = s.replace(/(\d{3}.*) x\.? \d.*/i, '$1');
			var s1 = s.replace(/\D/g, '');  // remove non-number characters
			var m = s1.match(/^1?([2-9]\d{2})([2-9]\d{2})(\d{4})$/);  // Ignore leading 1, and also don't allow area code or exchange to start with 0 or 1 (***USA/CAN specific)
			if (!m) {  // then try alphanumeric matching
				s1 = s.replace(/[^0-9A-Z]/g, '').replace(/^\D*(\d)/,'$1').replace(/^1?([2-9][0-9]{2}[0-9A-Z]{7})/g,'$1');
				s1 = replaceLetters(s1);
				m = s1.match(/^([2-9]\d{2})([2-9]\d{2})(\d{4})$/);  // Ignore leading 1, and also don't allow area code or exchange to start with 0 or 1 (***USA/CAN specific)
				if (!m) {	
					if ( returnType === 'inputted' ) {
						return 'badPhone';
					} else {
						bannButt.phoneInvalid.active = true;
						return s;
					}
				} else {
					return String.plFormat(outputFormat, m[1], m[2], m[3]);
				}
			} else {
				return String.plFormat(outputFormat, m[1], m[2], m[3]);
			}
		}
		
		// Alphanumeric phone conversion
		function replaceLetters(number) {
			var conversionMap = _({
				2: /A|B|C/,
				3: /D|E|F/,
				4: /G|H|I/,
				5: /J|K|L/,
				6: /M|N|O/,
				7: /P|Q|R|S/,
				8: /T|U|V/,
				9: /W|X|Y|Z/
			});
			number = typeof number === 'string' ? number.toUpperCase() : '';
			return number.replace(/[A-Z]/g, function(match, offset, string) {
				return conversionMap.findKey(function(re) {
					return re.test(match);
				});
			});
		}
		
		// Normalize url
		function normalizeURL(s, lc) {
			if (!s) {  // Notify that url is missing and provide web search to find website and gather data (provided for all editors)
				bannButt.urlMissing.active = true;
				if (currentWL.urlWL) {
					bannButt.urlMissing.WLactive = false;
				}
				bannButt.webSearch.active = true;  // Activate websearch button
				return s;
			}
			s = s.replace(/ \(.*/g, '');  // remove anything with parentheses after it
			s = s.replace(/ /g, '');  // remove any spaces
			var m = s.match(/^http:\/\/(.*)$/i);  // remove http:// 
			if (m) { s = m[1]; } 
			if (lc) {  // lowercase the entire domain
				s = s.replace(/[^\/]+/i, function(txt) { // lowercase the domain
					return (txt === txt.toLowerCase()) ? txt : txt.toLowerCase();
				});
			} else {  // lowercase only the www and com
				s = s.replace(/www\./i, 'www.');
				s = s.replace(/\.com/i, '.com');
			}
			m = s.match(/^(.*)\/pages\/welcome.aspx$/i);  // remove unneeded terms
			if (m) { s = m[1]; }
			m = s.match(/^(.*)\/pages\/default.aspx$/i);  // remove unneeded terms
			if (m) { s = m[1]; }
			m = s.match(/^(.*)\/index.html$/i);  // remove unneeded terms
			if (m) { s = m[1]; }
			m = s.match(/^(.*)\/index.htm$/i);  // remove unneeded terms
			if (m) { s = m[1]; }
			m = s.match(/^(.*)\/index.php$/i);  // remove unneeded terms
			if (m) { s = m[1]; }
			m = s.match(/^(.*)\/$/i);  // remove final slash
			if (m) { s = m[1]; }
			return s;
		}  // END normalizeURL function
	
		// Only run the harmonization if a venue is selected
		function harmonizePlace() {
			// Script is only for R2+ editors
			if (!betaUser && usrRank < 2) {
				alert("Script is currently available for editors of Rank 2 and up.");
				return;
			}
			// Beta version for approved users only
			if (isDevVersion && !betaUser) {
				alert("Please sign up to beta-test this script version.\nSend a PM or Slack-DM to bmtg, or post in the WMEPH forum thread. Thanks.");
				return;	
			}
			// Only run if a single place is selected
			if (W.selectionManager.selectedItems.length === 1) {
				var item = W.selectionManager.selectedItems[0].model;
				if (item.type === "venue") { 
					blurAll();  // focus away from current cursor position
					harmonizePlaceGo(item,'harmonize'); 
				} else {  // Remove duplicate labels
					WMEPH_NameLayer.destroyFeatures();
				}
			} else {  // Remove duplicate labels
				WMEPH_NameLayer.destroyFeatures();
			}
		}
	
		// Main script
		function harmonizePlaceGo(item, useFlag) {
			var hpMode = {
				harmFlag: false,
				hlFlag: false,
				scanFlag: false
			};
			
			if ( useFlag.indexOf('harmonize') > -1 ) {
				hpMode.harmFlag = true;
				phlog('Running script on selected place...');
			}
			if ( useFlag.indexOf('highlight') > -1 ) {
				hpMode.hlFlag = true;
			}
			if ( useFlag.indexOf('scan') > -1 ) {
				hpMode.scanFlag = true;
			}
			var placePL = getItemPL();  //  set up external post div and pull place PL
			// https://www.waze.com/editor/?env=usa&lon=-80.60757&lat=28.17850&layers=1957&zoom=4&segments=86124344&update_requestsFilter=false&problemsFilter=false&mapProblemFilter=0&mapUpdateRequestFilter=0&venueFilter=1
			placePL = placePL.replace(/\&layers=[^\&]+(\&?)/g, '$1');  // remove Permalink Layers
			placePL = placePL.replace(/\&update_requestsFilter=[^\&]+(\&?)/g, '$1');  // remove Permalink Layers
			placePL = placePL.replace(/\&problemsFilter=[^\&]+(\&?)/g, '$1');  // remove Permalink Layers
			placePL = placePL.replace(/\&mapProblemFilter=[^\&]+(\&?)/g, '$1');  // remove Permalink Layers
			placePL = placePL.replace(/\&mapUpdateRequestFilter=[^\&]+(\&?)/g, '$1');  // remove Permalink Layers
			placePL = placePL.replace(/\&venueFilter=[^\&]+(\&?)/g, '$1');  // remove Permalink Layers
			var region, state2L, newPlaceURL, approveRegionURL, servID, useState = true;
			var gFormState = "";
			var PNHOrderNum = '', PNHNameTemp = '', PNHNameTempWeb = '';
			severityButt = 0;
			var customStoreFinder = false;  // switch indicating place-specific custom store finder url
			var customStoreFinderLocal = false;  // switch indicating place-specific custom store finder url with localization option (GPS/addr)
			var customStoreFinderURL = "";  // switch indicating place-specific custom store finder url
			var customStoreFinderLocalURL = "";  // switch indicating place-specific custom store finder url with localization option (GPS/addr)
			var fieldUpdateObject = {name: false, aliases: false, categories: false, brand: false, description: false, lockRank: false, address: false, url: false, phone: false, openingHours: false, 
				services: { VALLET_SERVICE: false, DRIVETHROUGH: false, WI_FI: false, RESTROOMS: false, CREDIT_CARDS: false, RESERVATIONS: false,
					OUTSIDE_SEATING: false, AIR_CONDITIONING: false, PARKING_FOR_CUSTOMERS: false, DELIVERIES: false, TAKE_AWAY: false, WHEELCHAIR_ACCESSIBLE: false }
			};
			// Whitelist: reset flags
			currentWL = {
				dupeWL: [], 
				restAreaName: false,
				restAreaSpec: false,
				unmappedRegion: false,
				gasMismatch: false,
				hotelMkPrim: false,
				changeHMC2Office: false,
				changeHMC2PetVet: false,
				changeSchool2Offices: false,
				pointNotArea: false,
				areaNotPoint: false,
				HNWL: false,
				hnNonStandard: false,
				HNRange: false,
				parentCategory: false,
				suspectDesc: false,
				resiTypeName: false,
				longURL: false,
				gasNoBrand: false,
				subFuel: false,
				hotelLocWL: false,
				localizedName: false,
				urlWL: false,
				phoneWL: false,
				aCodeWL: false,
				noHours: false
			};
				
			// **** Set up banner action buttons.  Structure:
			// active: false until activated in the script 
			// severity: determines the color of the banners and whether locking occurs
			// message: The text before the button option
			// value: button text
			// title: tooltip text
			// action: The action that happens if the button is pressed
			// WL terms are for whitelisting
			bannButt = {  
				hnDashRemoved: { 
					active: false, severity: 0, message: "Dash removed from house number. Verify"
				},
				
				fullAddressInference: {  // no WL
					active: false, severity: 3, message: 'Missing address was inferred from nearby segments. Verify the address and run script again.' 
				},
				
				nameMissing: {  // no WL
					active: false, severity: 3, message: 'Name is missing.'
				},
				
				hoursOverlap: {  // no WL
					active: false, severity: 3, message: 'Overlapping hours of operation. Place might not save.'
				},
				
				unmappedRegion: {
					active: false, severity: 3, message: 'This category is usually not mapped in this region.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist unmapped category',
					WLaction: function() {
						wlKeyName = 'unmappedRegion';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				restAreaName: {
					active: false, severity: 3, message: 'Rest area name is out of spec. Use the Rest Area wiki button below to view formats.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist rest area name',
					WLaction: function() {
						wlKeyName = 'restAreaName';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				restAreaGas: { // no WL
					active: false, severity: 3, message: 'Gas stations at Rest Areas should be separate area places.'
				},
				
				restAreaSpec: {  // if the gas brand and name don't match
					active: false, severity: 3, message: "Is this a rest area?", value: "Yes", title: 'Update with proper categories and services.',
					action: function() {
						// update categories according to spec
						newCategories = insertAtIX(newCategories,"TRANSPORTATION",0);  // Insert/move Gas category in the first position
						newCategories = insertAtIX(newCategories,"SCENIC_LOOKOUT_VIEWPOINT",1);  // Insert/move Gas category in the first position
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						fieldUpdateObject.categories='#dfd';
						// make it 24/7
						W.model.actionManager.add(new UpdateObject(item, { openingHours: [{days: [1,2,3,4,5,6,0], fromHour: "00:00", toHour: "00:00"}] }));
						fieldUpdateObject.openingHours='#dfd';
						//higlightChangedFields(fieldUpdateObject,hpMode);
						
						bannServ.add247.checked = true;
						bannServ.addParking.actionOn();  // add parking service
						bannServ.addWheelchair.actionOn();  // add parking service
						bannButt.restAreaSpec.active = false;  // reset the display flag
						
						harmonizePlaceGo(item,'harmonize');
					},
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist place',
					WLaction: function() {
						wlKeyName = 'restAreaSpec';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				gasMismatch: {  // if the gas brand and name don't match
					active: false, severity: 3, message: "Gas name and brand don't match.  Move brand to name?", value: "Yes", title: 'Change the primary name to the brand and make the current name the alt-name.',
					action: function() {
						newAliases = insertAtIX(newAliases, newName, 0);
						for (var naix=0; naix<newAliases.length; naix++) {
							newAliases[naix] = toTitleCase(newAliases[naix]);
						}
						newName = item.attributes.brand;
						newAliases = removeSFAliases(newName, newAliases);
						W.model.actionManager.add(new UpdateObject(item, { name: newName, aliases: newAliases }));
						fieldUpdateObject.name='#dfd';
						fieldUpdateObject.aliases='#dfd';
						higlightChangedFields(fieldUpdateObject,hpMode);
						bannButt.gasMismatch.active = false;  // reset the display flag
					},
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist gas brand mismatch',
					WLaction: function() {
						wlKeyName = 'gasMismatch';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				gasUnbranded: {  // no WL
					active: false, severity: 3, message: '"Unbranded" should not be used for the station brand. Change to correct brand or use the blank entry at the top of the brand list.'
				},
				
				gasMkPrim: {  // no WL
					active: false, severity: 3,  message: "Gas Station is not the primary category", value: "Fix", title: 'Make the Gas Station category the primary category.',
					action: function() {
						newCategories = insertAtIX(newCategories,"GAS_STATION",0);  // Insert/move Gas category in the first position
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						fieldUpdateObject.categories='#dfd';
						bannButt.gasMkPrim.active = false;  // reset the display flag
						harmonizePlaceGo(item,'harmonize');
					}
				},
				 
				hotelMkPrim: {
					active: false, severity: 3, message: "Hotel category is not first", value: "Fix", title: 'Make the Hotel category the primary category.',
					action: function() {
						newCategories = insertAtIX(newCategories,"HOTEL",0);  // Insert/move Hotel category in the first position
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						fieldUpdateObject.categories='#dfd';
						bannButt.hotelMkPrim.active = false;  // reset the display flag
						harmonizePlaceGo(item,'harmonize');
					},
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist hotel as secondary category',
					WLaction: function() {
						wlKeyName = 'hotelMkPrim';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				changeHMC2Office: {
					active: false, severity: 3, message: "This doesn't look like a hospital or urgent care location.", value: "Change to Offices", title: 'Change to Office Category',
					action: function() {
						newCategories[newCategories.indexOf('HOSPITAL_MEDICAL_CARE')] = "OFFICES";
						//phlogdev(newCategories);
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						fieldUpdateObject.categories='#dfd';
						bannButt.changeHMC2Office.active = false;  // reset the display flag
						harmonizePlaceGo(item,'harmonize');  // Rerun the script to update fields and lock
					},
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist Hospital category',  
					WLaction: function() {
						wlKeyName = 'changeHMC2Office';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				changeHMC2PetVet: {
					active: false, severity: 3, message: "This looks like it should be a Pet/Veterinarian category. Change?", value: "Yes", title: 'Change to Pet/Veterinarian Category',
					action: function() {
						newCategories[newCategories.indexOf('HOSPITAL_MEDICAL_CARE')] = "PET_STORE_VETERINARIAN_SERVICES";
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						fieldUpdateObject.categories='#dfd';
						bannButt.changeHMC2PetVet.active = false;  // reset the display flag
						harmonizePlaceGo(item,'harmonize');  // Rerun the script to update fields and lock
					},
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist PetVet category',  
					WLaction: function() {
						wlKeyName = 'changeHMC2PetVet';
						whitelistAction(itemID, wlKeyName);
					}
				}, 
				
				changeSchool2Offices: {
					active: false, severity: 3, message: "This doesn't look like it should be School category.", value: "Change to Office", title: 'Change to Offices Category',
					action: function() {
						newCategories[newCategories.indexOf('SCHOOL')] = "OFFICES";
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						fieldUpdateObject.categories='#dfd';
						bannButt.changeSchool2Offices.active = false;  // reset the display flag
						harmonizePlaceGo(item,'harmonize');  // Rerun the script to update fields and lock
					},
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist School category',  
					WLaction: function() {
						wlKeyName = 'changeSchool2Offices';
						whitelistAction(itemID, wlKeyName);
					}
				}, 
				
				pointNotArea: {  // Area 2 Point button
					active: false, severity: 3, message: "This category should be a point place.", value: "Change to point", title: 'Change to point place',
					action: function() {
						// If a stop point is set, use it for the point, else use Centroid
						var newGeometry;
						if (item.attributes.entryExitPoints.length > 0) {
							newGeometry = item.attributes.entryExitPoints[0].point;
						} else {
							newGeometry = item.geometry.getCentroid();
						}
						updateFeatureGeometry (item, newGeometry);
						bannButt.pointNotArea.active = false;
					},
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist point (not area)',  
					WLaction: function() {
						wlKeyName = 'pointNotArea';
						whitelistAction(itemID, wlKeyName);
					}
				}, 
				
				areaNotPoint: {  // Point 2 Area button
					active: false, severity: 3, message: "This category should be an area place.", value: "Change to area", title: 'Change to Area',
					action: function() {
						// If a stop point is set, use it for the point, else use Centroid
						updateFeatureGeometry (item, item.getPolygonGeometry());
						bannButt.areaNotPoint.active = false;
					},
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist area (not point)',  
					WLaction: function() {
						wlKeyName = 'areaNotPoint';
						whitelistAction(itemID, wlKeyName);
					}
				}, 
				
				hnMissing: { 
					active: false, severity: 3, message: 'No HN: <input type="text" id="WMEPH-HNAdd'+devVersStr+'" autocomplete="off" style="width:100px;padding-left:3px;color:#000;background-color:#FDD">',
					value: "Add", title: 'Add HN to place',
					action: function() {
						var newHN = $('#WMEPH-HNAdd'+devVersStr).val();
						newHN = newHN.replace(/ +/g, '');
						phlogdev(newHN);
						var hnTemp = newHN.replace(/[^\d]/g, '');
						var hnTempDash = newHN.replace(/[^\d-]/g, '');
						if (hnTemp > 0 && hnTemp < 1000000) {
							W.model.actionManager.add(new UpdateObject(item, { houseNumber: hnTempDash }));
							fieldUpdateObject.address='#dfd';
							bannButt.hnMissing.active = false;
						} else {
							$('#WMEPH-HNAdd'+devVersStr)[0].style="background-color: pink";
						}
						
					}, 
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist empty HN',  
					WLaction: function() {
						wlKeyName = 'HNWL';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				hnNonStandard: {
					active: false, severity: 3, message: 'House number is non-standard.', 
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist non-standard HN',  
					WLaction: function() {
						wlKeyName = 'hnNonStandard';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				HNRange: { 
					active: false, severity: 2, message: 'House number seems out of range for the street name. Verify.', value: '',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist HN range',  
					WLaction: function() {
						wlKeyName = 'HNRange';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				streetMissing: {  // no WL
					active: false, severity: 3, message: 'Street missing.'
				},
				
				cityMissing: {  // no WL
					active: false, severity: 3, message: 'City missing.'
				},
				
				bankType1: {   // no WL
					active: false, severity: 3, message: 'Clarify the type of bank: the name has ATM but the primary category is Offices' 
				},
				
				bankBranch: {  // no WL
					active: false, severity: 1, message: "Is this a bank branch office? ", value: "Yes", title: "Is this a bank branch?",
					action: function() {
						newCategories = ["BANK_FINANCIAL","ATM"];  // Change to bank and atm cats
						newName = newName.replace(/[\- (]*ATM[\- )]*/g, ' ').replace(/^ /g,'').replace(/ $/g,'');	 // strip ATM from name if present
						W.model.actionManager.add(new UpdateObject(item, { name: newName, categories: newCategories }));
						fieldUpdateObject.name='#dfd';
						fieldUpdateObject.categories='#dfd';
						higlightChangedFields(fieldUpdateObject,hpMode);
						bannButt.bankCorporate.active = false;   // reset the bank Branch display flag
						bannButt.bankBranch.active = false;   // reset the bank Branch display flag
						bannButt.standaloneATM.active = false;   // reset the standalone ATM display flag
						bannButt.bankType1.active = false;  // remove bank type warning
					}
				},
				
				standaloneATM: { // no WL
					active: false, severity: 2, message: "Or is this a standalone ATM? ", value: "Yes", title: "Is this a standalone ATM with no bank branch?",
					action: function() {
						if (newName.indexOf("ATM") === -1) {
							newName = newName + ' ATM';	
						}
						newCategories = ["ATM"];  // Change to ATM only
						W.model.actionManager.add(new UpdateObject(item, { name: newName, categories: newCategories }));
						fieldUpdateObject.name='#dfd';
						fieldUpdateObject.categories='#dfd';
						higlightChangedFields(fieldUpdateObject,hpMode);
						bannButt.bankCorporate.active = false;   // reset the bank Branch display flag
						bannButt.bankBranch.active = false;   // reset the bank Branch display flag
						bannButt.standaloneATM.active = false;   // reset the standalone ATM display flag
						bannButt.bankType1.active = false;  // remove bank type warning
					}
				},
				
				bankCorporate: {  // no WL
					active: false, severity: 1, message: "Or is this the bank's corporate offices?", value: "Yes", title: "Is this the bank's corporate offices?",
					action: function() {
						newCategories = ["OFFICES"];  // Change to offices category
						newName = newName.replace(/[\- (]*atm[\- )]*/ig, ' ').replace(/^ /g,'').replace(/ $/g,'').replace(/ {2,}/g,' ');	 // strip ATM from name if present
						W.model.actionManager.add(new UpdateObject(item, { name: newName + ' - Corporate Offices', categories: newCategories }));
						fieldUpdateObject.name='#dfd';
						fieldUpdateObject.categories='#dfd';
						higlightChangedFields(fieldUpdateObject,hpMode);
						bannButt.bankCorporate.active = false;   // reset the bank Branch display flag
						bannButt.bankBranch.active = false;   // reset the bank Branch display flag
						bannButt.standaloneATM.active = false;   // reset the standalone ATM display flag
						bannButt.bankType1.active = false;  // remove bank type warning
					}
				},
				
				catPostOffice: {  // no WL
					active: false, severity: 2, message: 'If this is not a USPS post office, change the category, as "Post Office" is only used for USPS locations.'
				},
				
				ignEdited: {  // no WL
					active: false, severity: 2, message: 'Last edited by an IGN editor'
				},
				
				wazeBot: {  // no WL
					active: false, severity: 2, message: 'Last edited by waze-bot-maint'
				},
				
				parentCategory: {
					active: false, severity: 2, message: 'This parent category is usually not mapped in this region.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist parent Category',  
					WLaction: function() {
						wlKeyName = 'parentCategory';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				checkDescription: {  // no WL
					active: false, severity: 2, message: 'Description field already contained info; PNH description was added in front of existing. Check for inconsistency or duplicate info.'
				},
				
				overlapping: {  // no WL
					active: false, severity: 2, message: 'Place points are stacked up.'
				},
				
				suspectDesc: {  // no WL
					active: false, severity: 2, message: 'Description field might contain copyrighted info.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist description',  
					WLaction: function() {
						wlKeyName = 'suspectDesc';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				resiTypeName: {
					active: false, severity: 2, message: 'The place name suggests a residential place or personalized place of work.  Please verify.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist Residential-type name',  
					WLaction: function() {
						wlKeyName = 'resiTypeName';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				mismatch247: {  // no WL
					active: false, severity: 2, message: 'Hours of operation listed as open 24hrs but not for all 7 days.'
				},
				
				phoneInvalid: {  // no WL
					active: false, severity: 2, message: 'Phone invalid.'
				},
				
				areaNotPointMid: {
					active: false, severity: 2, message: 'This category is usually an area place, but can be a point in some cases. Verify if point is appropriate.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist area (not point)',  
					WLaction: function() {
						wlKeyName = 'areaNotPoint';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				pointNotAreaMid: {
					active: false, severity: 2, message: 'This category is usually a point place, but can be a area in some cases. Verify if area is appropriate.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist point (not area)',  
					WLaction: function() {
						wlKeyName = 'pointNotArea';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				longURL: {
					active: false, severity: 1, message: 'Existing URL doesn\'t match the suggested PNH URL. Use the Place Website button below to verify. If existing URL is invalid:', value: "Use PNH URL", title: "Change URL to the PNH standard",
					action: function() {
						if (tempPNHURL !== '') {
							W.model.actionManager.add(new UpdateObject(item, { url: tempPNHURL }));
							fieldUpdateObject.url='#dfd';
							higlightChangedFields(fieldUpdateObject,hpMode);
							bannButt.longURL.active = false;
							updateURL = true;
						} else {
							if (confirm('WMEPH: URL Matching Error!\nClick OK to report this error') ) {  // if the category doesn't translate, then pop an alert that will make a forum post to the thread
								forumMsgInputs = {
									subject: 'Re: WMEPH URL comparison Error report',
									message: 'Error report: URL comparison failed for "' + item.attributes.name + '"\nPermalink: ' + placePL,
								};
								WMEPH_errorReport(forumMsgInputs);
							}
						}
					},
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist existing URL',  
					WLaction: function() {
						wlKeyName = 'longURL';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				gasNoBrand: {
					active: false, severity: 1, message: 'Verify that gas station has no brand.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist no gas brand',  
					WLaction: function() {
						wlKeyName = 'gasNoBrand';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				subFuel: {
					active: false, severity: 1, message: 'Make sure this place is for the gas station itself and not the main store building.  Otherwise undo and check the categories.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist no gas brand',  
					WLaction: function() {
						wlKeyName = 'subFuel';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				areaNotPointLow: {
					active: false, severity: 1, message: 'This category is usually an area place, but can be a point in some cases. Verify if point is appropriate.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist area (not point)',  
					WLaction: function() {
						wlKeyName = 'areaNotPoint';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				pointNotAreaLow: {
					active: false, severity: 1, message: 'This category is usually a point place, but can be a area in some cases. Verify if area is appropriate.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist point (not area)',  
					WLaction: function() {
						wlKeyName = 'pointNotArea';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				formatUSPS: {  // ### needs WL or not?
					active: false, severity: 1, message: 'Localize the post office according to this region\'s standards for USPS locations (e.g., "USPS - Tampa")'
				},
				
				catHotel: { 
					active: false, severity: 1, message: 'Check hotel website for any name localization (e.g. Hilton - Tampa Airport)',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist hotel localization',
					WLaction: function() {
						wlKeyName = 'hotelLocWL';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				localizedName: { 
					active: false, severity: 1, message: 'Place needs localization information',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist localization',
					WLaction: function() {
						wlKeyName = 'localizedName';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				specCaseMessage: {  // no WL
					active: false, severity: 1, message: 'WMEPH: placeholder (please report this error if you see this message)'
				},
				
				pnhCatMess: {  // no WL
					active: false, severity: 0, message: 'WMEPH: placeholder (please report this error if you see this message)'
				},
				
				specCaseMessageLow: {  // no WL
					active: false, severity: 0, message: 'WMEPH: placeholder (please report this error if you see this message)'
				},
				
				urlMissing: { 
					active: false, severity: 1, message: "URL missing", 
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist empty URL',
					WLaction: function() {
						wlKeyName = 'urlWL';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				phoneMissing: { 
					active: false, severity: 1, message: 'No phone: <input type="text" id="WMEPH-PhoneAdd'+devVersStr+'" autocomplete="off" style="width:120px;padding-left:3px;color:#000;background-color:#DDF">',
					value: "Add", title: 'Add phone to place',
					action: function() {
						var newPhoneVal = $('#WMEPH-PhoneAdd'+devVersStr).val();
						var newPhone = normalizePhone(newPhoneVal, outputFormat, 'inputted');
						if (newPhone === 'badPhone') {
							// bad input
							$('#WMEPH-PhoneAdd'+devVersStr)[0].style="background-color: pink";
						} else {
							phlogdev(newPhone);
							if (countryCode === "USA" || countryCode === "CAN") {
								if (newPhone !== null && newPhone.match(/[2-9]\d{2}/) !== null) {
									var areaCode = newPhone.match(/[2-9]\d{2}/)[0];
									if ( areaCodeList.indexOf(areaCode) === -1 ) {
										bannButt.badAreaCode.active = true;
										if (currentWL.aCodeWL) {
											bannButt.badAreaCode.WLactive = false;
										}
									}
								}
							}
							W.model.actionManager.add(new UpdateObject(item, { phone: newPhone }));
							fieldUpdateObject.phone='#dfd';
							bannButt.phoneMissing.active = false;
						} 
						
					}, 
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist empty phone',
					WLaction: function() {
						wlKeyName = 'phoneWL';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				badAreaCode: { 
					active: false, severity: 1, message: "Area Code mismatch ", 
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist the area code',
					WLaction: function() {
						wlKeyName = 'aCodeWL';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				noHours: {  
					active: false, severity: 1, message: 'No hours: <input type="text" value="Paste Hours Here" id="WMEPH-HoursPaste'+devVersStr+'" autocomplete="off" style="width:170px;padding-left:3px;color:#AAA">',
					value: "Add hours", title: 'Add pasted hours to existing',
					action: function() {
						var pasteHours = $('#WMEPH-HoursPaste'+devVersStr).val();
						phlogdev(pasteHours);
						$('.nav-tabs a[href="#landmark-edit-more-info"]').tab('show');
						pasteHours = pasteHours + ',' + getOpeningHours(item).join(',');
						var hoursObjectArray = parseHours(pasteHours);
						if (hoursObjectArray !== false) {
							phlogdev(hoursObjectArray);
							W.model.actionManager.add(new UpdateObject(item, { openingHours: hoursObjectArray }));
							fieldUpdateObject.openingHours='#dfd';
							higlightChangedFields(fieldUpdateObject,hpMode);
							bannButt.noHours.value = 'Add hours';
							bannButt.noHours.severity = 0;
							bannButt.noHours.WLactive = false;
							bannButt.noHours.message = 'Hours: <input type="text" value="Paste Hours Here" id="WMEPH-HoursPaste'+devVersStr+'" style="width:170px;padding-left:3px;color:#AAA">';
							
						} else {
							phlog('Can\'t parse those hours');
							bannButt.noHours.severity = 1;
							bannButt.noHours.WLactive = true;
							bannButt.noHours.message = 'Hours: <input type="text" value="Can\'t parse, try again" id="WMEPH-HoursPaste'+devVersStr+'" style="width:170px;padding-left:3px;color:#AAA">';
						}
					}, 
					value2: "Replace all hours", title2: 'Replace existing hours with pasted hours',
					action2: function() {
						var pasteHours = $('#WMEPH-HoursPaste'+devVersStr).val();
						phlogdev(pasteHours);
						$('.nav-tabs a[href="#landmark-edit-more-info"]').tab('show');
						var hoursObjectArray = parseHours(pasteHours);
						if (hoursObjectArray !== false) {
							phlogdev(hoursObjectArray);
							item.attributes.openingHours.push.apply(item.attributes.openingHours, hoursObjectArray);
							W.model.actionManager.add(new UpdateObject(item, { openingHours: hoursObjectArray }));
							fieldUpdateObject.openingHours='#dfd';
							higlightChangedFields(fieldUpdateObject,hpMode);
							bannButt.noHours.value2 = 'Replace hours';
							bannButt.noHours.severity = 0;
							bannButt.noHours.WLactive = false;
							bannButt.noHours.message = 'Hours: <input type="text" value="Paste Hours Here" id="WMEPH-HoursPaste'+devVersStr+'" style="width:170px;padding-left:3px;color:#AAA">';
						} else {
							phlog('Can\'t parse those hours');
							bannButt.noHours.severity = 1;
							bannButt.noHours.WLactive = true;
							bannButt.noHours.message = 'Hours: <input type="text" value="Can\'t parse, try again" id="WMEPH-HoursPaste'+devVersStr+'" style="width:170px;padding-left:3px;color:#AAA">';
						}
						
					}, 
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist no Hours',
					WLaction: function() {
						wlKeyName = 'noHours';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				resiTypeNameSoft: {  // no WL
					active: false, severity: 0, message: 'The place name suggests a residential place or personalized place of work.  Please verify.'
				},
				
				localURL: {  // no WL
					active: false, severity: 0, message: 'Some locations for this business have localized URLs, while others use the primary corporate site. Check if a local URL applies to this location.'
				},
				
				babiesRUs: {  // no WL
					active: false, severity: 0, message: 'If there is a Toys R Us at this location, make it the primary name and Babies R Us the alt name and rerun the script.'
				},
				
				lockRPP: {    // no WL
					active: false, severity: 0, message: 'Lock this residential point?', value: "Lock", title: 'Lock the residential point',
					action: function() {
						var RPPlevelToLock = $("#RPPLockLevel :selected").val() || defaultLockLevel + 1;
						phlogdev('RPPlevelToLock: '+ RPPlevelToLock);
						
						RPPlevelToLock = RPPlevelToLock -1 ;
						W.model.actionManager.add(new UpdateObject(item, { lockRank: RPPlevelToLock }));
						// no field highlight here
						bannButt.lockRPP.message = 'Current lock: '+ (parseInt(item.attributes.lockRank)+1) +'. '+RPPLockString+' ?';
					}
				},
				
				addAlias: {    // no WL
					active: false, severity: 0, message: "Is " + optionalAlias + " at this location?", value: "Yes", title: 'Add ' + optionalAlias,
					action: function() {
						newAliases = insertAtIX(newAliases,optionalAlias,0);
						if (specCases.indexOf('altName2Desc') > -1 &&  item.attributes.description.toUpperCase().indexOf(optionalAlias.toUpperCase()) === -1 ) {
							newDescripion = optionalAlias + '\n' + newDescripion;
							W.model.actionManager.add(new UpdateObject(item, { description: newDescripion }));
							fieldUpdateObject.description='#dfd';
							higlightChangedFields(fieldUpdateObject,hpMode);
						}
						newAliases = removeSFAliases(newName, newAliases);
						W.model.actionManager.add(new UpdateObject(item, { aliases: newAliases }));
						fieldUpdateObject.aliases='#dfd';
						higlightChangedFields(fieldUpdateObject,hpMode);
						bannButt.addAlias.active = false;  // reset the display flag
					}
				},
				
				addCat2: {   // no WL
					active: false, severity: 0, message: "Is there a " + newCategories[0] + " at this location?", value: "Yes", title: 'Add ' + newCategories[0],
					action: function() {
						newCategories.push.apply(newCategories,altCategories);
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						fieldUpdateObject.categories='#dfd';
						higlightChangedFields(fieldUpdateObject,hpMode);
						bannButt.addCat2.active = false;  // reset the display flag
					}
				},
				
				addPharm: {   // no WL
					active: false, severity: 0, message: "Is there a Pharmacy at this location?", value: "Yes", title: 'Add Pharmacy category',
					action: function() {
						newCategories = insertAtIX(newCategories, 'PHARMACY', 1);
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						fieldUpdateObject.categories='#dfd';
						higlightChangedFields(fieldUpdateObject,hpMode);
						bannButt.addPharm.active = false;  // reset the display flag
					}
				},
				
				addSuper: {   // no WL
					active: false, severity: 0, message: "Does this location have a supermarket?", value: "Yes", title: 'Add Supermarket category',
					action: function() {
						newCategories = insertAtIX(newCategories, 'SUPERMARKET_GROCERY', 1);
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						fieldUpdateObject.categories='#dfd';
						higlightChangedFields(fieldUpdateObject,hpMode);
						bannButt.addSuper.active = false;  // reset the display flag
					}
				},
				
				appendAMPM: {   // no WL
					active: false, severity: 0, message: "Is there an ampm at this location?", id: "appendAMPM", value: "Yes", title: 'Add ampm to the place',
					action: function() {
						newCategories = insertAtIX(newCategories, 'CONVENIENCE_STORE', 1);
						newName = 'ARCO ampm';
						newURL = 'ampm.com';
						W.model.actionManager.add(new UpdateObject(item, { name: newName, url: newURL, categories: newCategories }));
						fieldUpdateObject.name='#dfd';
						fieldUpdateObject.url='#dfd';
						fieldUpdateObject.categories='#dfd';
						higlightChangedFields(fieldUpdateObject,hpMode);
						bannButt.appendAMPM.active = false;  // reset the display flag
						bannButt.addConvStore.active = false;  // also reset the addConvStore display flag
					}
				},
				
				addATM: {    // no WL
					active: false, severity: 0, message: "ATM at location? ", value: "Yes", title: "Add the ATM category to this place",
					action: function() {
						newCategories = insertAtIX(newCategories,"ATM",1);  // Insert ATM category in the second position
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						fieldUpdateObject.categories='#dfd';
						higlightChangedFields(fieldUpdateObject,hpMode);
						bannButt.addATM.active = false;   // reset the display flag
					}
				},
				
				addConvStore: {  // no WL
					active: false, severity: 0, message: "Add convenience store category? ", value: "Yes", title: "Add the Convenience Store category to this place",
					action: function() {
						newCategories = insertAtIX(newCategories,"CONVENIENCE_STORE",1);  // Insert C.S. category in the second position
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						fieldUpdateObject.categories='#dfd';
						higlightChangedFields(fieldUpdateObject,hpMode);
						bannButt.addConvStore.active = false;   // reset the display flag
					}
				},
				
				isitUSPS: {  // no WL
					active: false, severity: 0, message: "Is this a USPS location? ", value: "Yes", title: "Is this a USPS location?",
					action: function() {
						bannServ.addAC.actionOn();
						bannServ.addCreditCards.actionOn();
						bannServ.addParking.actionOn();
						bannServ.addDeliveries.actionOn();
						bannServ.addWheelchair.actionOn();
						W.model.actionManager.add(new UpdateObject(item, { url: "usps.com" }));
						fieldUpdateObject.url='#dfd';
						higlightChangedFields(fieldUpdateObject,hpMode);
						if (region === 'SER') {
							W.model.actionManager.add(new UpdateObject(item, { aliases: ["United States Postal Service"] }));
							fieldUpdateObject.aliases='#dfd';
							higlightChangedFields(fieldUpdateObject,hpMode);
						}
						bannButt.isitUSPS.active = false;
					}
				},
				
				STC: {    // no WL
					active: false, severity: 0, message: "Force Title Case: ", value: "Yes", title: "Force Title Case to InterNal CaPs",
					action: function() {
						newName = toTitleCaseStrong(item.attributes.name);  // Get the Strong Title Case name
						if (newName !== item.attributes.name) {  // if they are not equal
							W.model.actionManager.add(new UpdateObject(item, { name: newName }));
							fieldUpdateObject.name='#dfd';
							higlightChangedFields(fieldUpdateObject,hpMode);
						}
						bannButt.STC.active = false;  // reset the display flag
					}
				},
				
				sfAliases: {    // no WL
					active: false, severity: 0, message: 'Unnecessary aliases were removed.'
				},
				
				placeMatched: {    // no WL
					active: false, severity: 0, message: 'Place matched from PNH data.'
				},
				
				placeLocked: {    // no WL
					active: false, severity: 0, message: 'Place locked.'
				},
				
				PlaceWebsite: {    // no WL
					active: false, severity: 0, message: "", value: "Place Website", title: "Direct link to place website",
					action: function() {
						var openPlaceWebsiteURL, linkProceed = true;
						if (updateURL) {
							openPlaceWebsiteURL = 'http:\/\/' + newURL;
							// replace WME url with storefinder URLs if they are in the PNH data
							if (customStoreFinder) {
								openPlaceWebsiteURL = customStoreFinderURL;
							} else if (customStoreFinderLocal) {
								openPlaceWebsiteURL = customStoreFinderLocalURL;
							}
							// If the user has 'never' opened a localized store finder URL, then warn them (just once)
							if (localStorage.getItem(SFURLWarning) === '0' && customStoreFinderLocal) {
								linkProceed = false;
								if (confirm('***Localized store finder sites often show multiple nearby results. Please make sure you pick the right location.\nClick OK to agree and continue.') ) {  // if the category doesn't translate, then pop an alert that will make a forum post to the thread
									localStorage.setItem(SFURLWarning, '1');  // prevent future warnings
									linkProceed = true;
								}
							} 
						} else {
							openPlaceWebsiteURL = 'http:\/\/' + item.attributes.url;
						}
						// open the link depending on new window setting
						if (linkProceed) {
							if ( $("#WMEPH-WebSearchNewTab" + devVersStr).prop('checked') ) {
									window.open(openPlaceWebsiteURL);
							} else {
									window.open(openPlaceWebsiteURL, searchResultsWindowName, searchResultsWindowSpecs);
							}
						}
					}
				},
				
				webSearch: {  // no WL
					active: false, severity: 0, message: "", value: "Web Search", title: "Search the web for this place.  Do not copy info from 3rd party sources!",
					action: function() {
						if (localStorage.getItem(GLinkWarning) !== '1') {
							if (confirm('***Please DO NOT copy info from Google or third party sources.*** This link is to help you find the business webpage.\nClick OK to agree and continue.') ) {  // if the category doesn't translate, then pop an alert that will make a forum post to the thread
								localStorage.setItem(GLinkWarning, '1');
							}
						}
						if (localStorage.getItem(GLinkWarning) === '1') {
							if ( $("#WMEPH-WebSearchNewTab" + devVersStr).prop('checked') ) {
									window.open(buildGLink(newName,addr,item.attributes.houseNumber));
							} else {
									window.open(buildGLink(newName,addr,item.attributes.houseNumber), searchResultsWindowName, searchResultsWindowSpecs);
							}
						}
					}
				},
				
				NewPlaceSubmit: {    // no WL
					active: false, severity: 0, message: "No PNH match. If it's a chain: ", value: "Submit new chain data", title: "Submit info for a new chain through the linked form",
					action: function() {
						window.open(newPlaceURL);
					}
				},
				
				ApprovalSubmit: {  // no WL
					active: false, severity: 0, message: "PNH data exists but is not approved for this region: ", value: "Request approval", title: "Request region/country approval of this place",
					action: function() {
						if ( PMUserList.hasOwnProperty(region) && PMUserList[region].approvalActive ) {
							var forumPMInputs = {
								subject: 'PNH approval for "' + PNHNameTemp + '"',
								message: 'Please approve "' + PNHNameTemp + '" for the ' + region + ' region.  Thanks\n \nPNH order number: ' + PNHOrderNum + '\n \nExample Permalink: ' + placePL + '\n \nPNH Link: ' + USAPNHMasURL,
								preview: 'Preview', attach_sig: 'on' 
							};
							forumPMInputs['address_list[u]['+PMUserList[region].modID+']'] = 'to';  // Sends a PM to the regional mod instead of the submission form
							WMEPH_newForumPost('https://www.waze.com/forum/ucp.php?i=pm&mode=compose', forumPMInputs);
						} else {
							window.open(approveRegionURL);
						}
					}
				}
			};  // END bannButt definitions
			
			bannButtHL = bannButt;
			
			bannButt2 = {  
				placesWiki: {
					active: true, severity: 0, message: "", value: "Places wiki", title: "Open the places wiki page",
					action: function() {
						window.open(placesWikiURL);
					}
				},
				restAreaWiki: {
					active: false, severity: 0, message: "", value: "Rest Area wiki", title: "Open the Rest Area wiki page",
					action: function() {
						window.open(restAreaWikiURL);
					}
				},
				clearWL: {
					active: false, severity: 0, message: "", value: "Clear Place whitelist", title: "Clear all Whitelisted fields for this place",
					action: function() {
						if (confirm('Are you sure you want to clear all whitelisted fields for this place?') ) {  // misclick check
							delete venueWhitelist[itemID];
							saveWL_LS(compressedWLLS);
							harmonizePlaceGo(item,'harmonize');  // rerun the script to check all flags again
						}
					}
				},  // END placesWiki definition
				PlaceErrorForumPost: {
					active: true, severity: 0, message: "", value: "Report script error", title: "Report a script error",
					action: function() {
						var forumMsgInputs = {
							subject: 'Re: WMEPH Bug report',
							message: 'Script version: ' + WMEPHversion + devVersStr + '\nPermalink: ' + placePL + '\nPlace name: ' + item.attributes.name + '\nCountry: ' + addr.country.name + '\n--------\nDescribe the error:  \n ',
						};
						WMEPH_errorReport(forumMsgInputs);
					}
				},
				whatsNew: {
					active: false, severity: 0, message: "", value: "*Recent script updates*", title: "Open a list of recent script updates",
					action: function() {
						alert(WMEPHWhatsNew);
						localStorage.setItem('WMEPH-featuresExamined'+devVersStr, '1');
						bannButt2.whatsNew.active = false;
					}
				}
			};  // END bannButt2 definitions
			
			// set up banner action buttons.  Structure:
			// active: false until activated in the script 
			// checked: whether the service is already set on the place. Determines grey vs white icon color 
			// icon: button icon name
			// value: button text  (Not used for Icons, keep as backup
			// title: tooltip text
			// action: The action that happens if the button is pressed
			bannServ = {  
				addValet: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-valet", w2hratio: 50/50, value: "Valet", title: 'Valet',
					action: function() {
						servID = WMEServicesArray[0];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addValet.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addValet.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[0];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addValet.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addValet.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[0];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addValet.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addValet.active = false;
					}
				}, 
				addDriveThru: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-drivethru", w2hratio: 78/50, value: "DriveThru", title: 'Drive-Thru',
					action: function() {
						servID = WMEServicesArray[1];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addDriveThru.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addDriveThru.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[1];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addDriveThru.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addDriveThru.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[1];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addDriveThru.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addDriveThru.active = false;
					}
				}, 
				addWiFi: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-wifi", w2hratio: 67/50, value: "WiFi", title: 'WiFi',
					action: function() {
						servID = WMEServicesArray[2];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addWiFi.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addWiFi.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[2];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addWiFi.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addWiFi.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[2];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addWiFi.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addWiFi.active = false;
					}
				}, 
				addRestrooms: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-restrooms", w2hratio: 49/50, value: "Restroom", title: 'Restrooms',
					action: function() {
						servID = WMEServicesArray[3];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addRestrooms.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addRestrooms.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[3];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addRestrooms.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addRestrooms.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[3];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addRestrooms.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addRestrooms.active = false;
					}
				}, 
				addCreditCards: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-credit", w2hratio: 73/50, value: "CC", title: 'Credit Cards',
					action: function() {
						servID = WMEServicesArray[4];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addCreditCards.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addCreditCards.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[4];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addCreditCards.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addCreditCards.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[4];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addCreditCards.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addCreditCards.active = false;
					}
				}, 
				addReservations: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-reservations", w2hratio: 55/50, value: "Reserve", title: 'Reservations',
					action: function() {
						servID = WMEServicesArray[5];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addReservations.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addReservations.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[5];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addReservations.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addReservations.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[5];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addReservations.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addReservations.active = false;
					}
				}, 
				addOutside: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-outdoor", w2hratio: 73/50, value: "OusideSeat", title: 'Outside Seating',
					action: function() {
						servID = WMEServicesArray[6];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addOutside.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addOutside.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[6];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addOutside.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addOutside.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[6];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addOutside.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addOutside.active = false;
					}
				}, 
				addAC: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-ac", w2hratio: 50/50, value: "AC", title: 'AC',
					action: function() {
						servID = WMEServicesArray[7];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addAC.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addAC.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[7];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addAC.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addAC.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[7];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addAC.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addAC.active = false;
					}
				},  
				addParking: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-parking", w2hratio: 46/50, value: "Parking", title: 'Parking',
					action: function() {
						servID = WMEServicesArray[8];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addParking.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addParking.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[8];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addParking.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addParking.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[8];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addParking.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addParking.active = false;
					}
				}, 
				addDeliveries: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-deliveries", w2hratio: 86/50, value: "Delivery", title: 'Deliveries',
					action: function() {
						servID = WMEServicesArray[9];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addDeliveries.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addDeliveries.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[9];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addDeliveries.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addDeliveries.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[9];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addDeliveries.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addDeliveries.active = false;
					}
				}, 
				addTakeAway: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-takeaway", w2hratio: 34/50, value: "TakeOut", title: 'Take Out',
					action: function() {
						servID = WMEServicesArray[10];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addTakeAway.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addTakeAway.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[10];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addTakeAway.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addTakeAway.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[10];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addTakeAway.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addTakeAway.active = false;
					}
				}, 
				addWheelchair: {  // add service
					active: false, checked: false, icon: "serv-wheelchair", w2hratio: 50/50, value: "WhCh", title: 'Wheelchair Accessible',
					action: function() {
						servID = WMEServicesArray[11];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addWheelchair.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addWheelchair.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[11];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addWheelchair.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addWheelchair.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[11];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							fieldUpdateObject.services[servID] = '#dfd';
							bannServ.addWheelchair.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addWheelchair.active = false;
					}
				},
				add247: {  // add 24/7 hours
					active: false, checked: false, icon: "serv-247", w2hratio: 73/50, value: "247", title: 'Hours: Open 24\/7',
					action: function() {
						if (!bannServ.add247.checked) {
							W.model.actionManager.add(new UpdateObject(item, { openingHours: [{days: [1,2,3,4,5,6,0], fromHour: "00:00", toHour: "00:00"}] }));
							fieldUpdateObject.openingHours='#dfd';
							higlightChangedFields(fieldUpdateObject,hpMode);
							bannServ.add247.checked = true;
							bannButt.noHours.active = false;
						}
					}
				}
			};  // END bannServ definitions
			
			if (hpMode.harmFlag) {
				// Update icons to reflect current WME place services
				updateServicesChecks(bannServ);
				
				// Turn on New Features Button if not looked at yet
				if (localStorage.getItem('WMEPH-featuresExamined'+devVersStr) === '0') {
					bannButt2.whatsNew.active = true;
				}
				//Setting switch for the Places Wiki button
				if ( $("#WMEPH-HidePlacesWiki" + devVersStr).prop('checked') ) {
					bannButt2.placesWiki.active = false;
				}
				// provide Google search link to places
				if (devUser || betaUser || usrRank > 1) {  // enable the link for all places, for R2+ and betas
					 bannButt.webSearch.active = true;
				}
				// reset PNH lock level
				PNHLockLevel = -1;
				
			}
			
			
			// get GPS lat/long coords from place, call as itemGPS.lat, itemGPS.lon
			var itemGPS = OpenLayers.Layer.SphericalMercator.inverseMercator(item.attributes.geometry.getCentroid().x,item.attributes.geometry.getCentroid().y);
			var lockOK = true;  // if nothing goes wrong, then place will be locked
			var categories = item.attributes.categories;
			newCategories = categories.slice(0);
			newName = item.attributes.name;
			newName = toTitleCase(newName);
			// var nameShort = newName.replace(/[^A-Za-z]/g, '');  // strip non-letters for PNH name searching
			// var nameNumShort = newName.replace(/[^A-Za-z0-9]/g, ''); // strip non-letters/non-numbers for PNH name searching
			newAliases = item.attributes.aliases.slice(0);
			for (var naix=0; naix<newAliases.length; naix++) {
				newAliases[naix] = toTitleCase(newAliases[naix]);
			}
			var brand = item.attributes.brand;
			var newDescripion = item.attributes.description;
			newURL = item.attributes.url;
			var newURLSubmit = "";
			if (newURL !== null && newURL !== '') {
				newURLSubmit = newURL;
			}
			newPhone = item.attributes.phone;
			var addr = item.getAddress();
			if ( addr.hasOwnProperty('attributes') ) {
				addr = addr.attributes;
			}
			var PNHNameRegMatch;
			
			// Some user submitted places have no data in the country, state and address fields.
			if (!addr.state || !addr.country) {
				if (hpMode.harmFlag) {
					if (W.map.getZoom() < 4 ) {
						if ( $("#WMEPH-EnableIAZoom" + devVersStr).prop('checked') ) {
							W.map.moveTo(W.selectionManager.selectedItems[0].model.geometry.getCentroid().toLonLat(), 5);
							return;
						} else {
							alert("No address and the state cannot be determined. Please zoom in and rerun the script. You can enable autozoom for this type of case in the options.");
							return;  //  don't run the rest of the script
						}
					} else {
						var inferredAddress = WMEPH_inferAddress(7);  // Pull address info from nearby segments
						
						if (inferredAddress.state && inferredAddress.country ) {
							addr = inferredAddress;
							if ( $("#WMEPH-AddAddresses" + devVersStr).prop('checked') ) {  // update the item's address if option is enabled
								updateAddress(item, addr);
								fieldUpdateObject.address='#dfd';
								if (item.attributes.houseNumber && item.attributes.houseNumber.replace(/[^0-9A-Za-z]/g,'').length > 0 ) {
									bannButt.fullAddressInference.active = true;
									lockOK = false;
								}
							} else {
								bannButt.streetMissing.active = true;
								bannButt.cityMissing.active = true;
								lockOK = false;
							}
						} else {  //  if the inference doesn't work...
							alert("Place has no address data. Please set the address and rerun the script.");
							return;  //  don't run the rest of the script
						}
					}
				} else if (hpMode.hlFlag) {
					if ( item.attributes.adLocked ) {
						return 'adLock';
					} else if ( item.attributes.categories.indexOf("PARKING_LOT") > -1 && item.attributes.lockRank < levelToLock ) {
						return 4;
					} else if ( item.isPoint() && (item.attributes.categories.indexOf("HOSPITAL_MEDICAL_CARE") > -1 || item.attributes.categories.indexOf("GAS_STATION") > -1) ) {
						return 5;
						phlogdev('Unaddressed HMC/GS');
					} else {
						return 3;
					}
					
				}
			} else if (hpMode.harmFlag && $('.editing').length === 1 ) {
				$('.save-button').click();  // apply any address changes
			}
			
			// Whitelist breakout if place exists on the Whitelist and the option is enabled
			itemID = item.attributes.id; 
			var WLMatch = false;
			if ( venueWhitelist.hasOwnProperty(itemID) ) {
				if ( hpMode.harmFlag || ( hpMode.hlFlag && !$("#WMEPH-DisableWLHL" + devVersStr).prop('checked')  ) ) {
					WLMatch = true;
					// Enable the clear WL button if any property is true
					for (var WLKey in venueWhitelist[itemID]) {  // loop thru the venue WL keys
						if ( venueWhitelist[itemID].hasOwnProperty(WLKey) && (venueWhitelist[itemID][WLKey].active || false) ) {
							bannButt2.clearWL.active = true;
							currentWL[WLKey] = venueWhitelist[itemID][WLKey];  // update the currentWL settings
						}
					}
					if (venueWhitelist[itemID].hasOwnProperty('dupeWL') && venueWhitelist[itemID].dupeWL.length > 0) {
						bannButt2.clearWL.active = true;
						currentWL.dupeWL = venueWhitelist[itemID].dupeWL;
					}
					// Update address and GPS info for the place
					venueWhitelist[itemID].city = addr.city.name;  // Store city for the venue
					venueWhitelist[itemID].state = addr.state.name;  // Store state for the venue
					venueWhitelist[itemID].country = addr.country.name;  // Store country for the venue
					venueWhitelist[itemID].gps = itemGPS;  // Store GPS coords for the venue
				}
			}
			
			// Country restrictions
			var countryCode;
			if (addr.country.name === "United States") {
				countryCode = "USA";
			} else if (addr.country.name === "Canada") {
				countryCode = "CAN";
			} else if (addr.country.name === "American Samoa") {
				countryCode = "USA";
				useState = false;
			} else if (addr.country.name === "Guam") {
				countryCode = "USA";
				useState = false;
			} else if (addr.country.name === "Northern Mariana Islands") {
				countryCode = "USA";
				useState = false;
			} else if (addr.country.name === "Puerto Rico") {
				countryCode = "USA";
				useState = false;
			} else if (addr.country.name === "Virgin Islands (U.S.)") {
				countryCode = "USA";
				useState = false;
			} else {
				if (hpMode.harmFlag) {
					alert("At present this script is not supported in this country.");
				}
				return 3;
			}
			
			// Parse state-based data
			state2L = "Unknown"; region = "Unknown";
			for (var usdix=1; usdix<USA_STATE_DATA.length; usdix++) {
				stateDataTemp = USA_STATE_DATA[usdix].split("|");
				if (addr.state.name === stateDataTemp[ps_state_ix]) {
					state2L = stateDataTemp[ps_state2L_ix];
					region = stateDataTemp[ps_region_ix];
					gFormState = stateDataTemp[ps_gFormState_ix];
					if (stateDataTemp[ps_defaultLockLevel_ix].match(/[1-5]{1}/) !== null) {
						defaultLockLevel = stateDataTemp[ps_defaultLockLevel_ix] - 1;  // normalize by -1
					} else {
						if (hpMode.harmFlag) {
							alert('Lock level sheet data is not correct');
						} else if (hpMode.hlFlag) {
							return '3';
						}
					}
					areaCodeList = areaCodeList+','+stateDataTemp[ps_areacode_ix];
					break;
				}
				// If State is not found, then use the country
				if (addr.country.name === stateDataTemp[ps_state_ix]) {
					state2L = stateDataTemp[ps_state2L_ix];
					region = stateDataTemp[ps_region_ix];
					gFormState = stateDataTemp[ps_gFormState_ix];
					if (stateDataTemp[ps_defaultLockLevel_ix].match(/[1-5]{1}/) !== null) {
						defaultLockLevel = stateDataTemp[ps_defaultLockLevel_ix] - 1;  // normalize by -1
					} else {
						if (hpMode.harmFlag) {
							alert('Lock level sheet data is not correct');
						} else if (hpMode.hlFlag) {
							return '3';
						}
					}
					areaCodeList = areaCodeList+','+stateDataTemp[ps_areacode_ix];
					break;
				}
				
			}
			if (state2L === "Unknown" || region === "Unknown") {	// if nothing found:
				if (hpMode.harmFlag) {
					if (confirm('WMEPH: Localization Error!\nClick OK to report this error') ) {  // if the category doesn't translate, then pop an alert that will make a forum post to the thread
						forumMsgInputs = {
							subject: 'Re: WMEPH Localization Error report',
							message: 'Error report: Localization match failed for "' + addr.state.name + '".',
						};
						WMEPH_errorReport(forumMsgInputs);
					}
				}
				return 3;
			}
			
			// Clear attributes from residential places
			if (item.attributes.residential) {
				if (hpMode.harmFlag) {
					if ( !$("#WMEPH-AutoLockRPPs" + devVersStr).prop('checked') ) {
						lockOK = false;
					}
					if (item.attributes.name !== '') {  // Set the residential place name to the address (to clear any personal info)
						phlogdev("Residential Name reset");
						W.model.actionManager.add(new UpdateObject(item, {name: ''}));
						// no field HL
					}
					newCategories = ["RESIDENCE_HOME"];
					// newDescripion = null;
					if (item.attributes.description !== null && item.attributes.description !== "") {  // remove any description
						phlogdev("Residential description cleared");
						W.model.actionManager.add(new UpdateObject(item, {description: null}));
						// no field HL
					}
					// newPhone = null;
					if (item.attributes.phone !== null && item.attributes.phone !== "") {  // remove any phone info
						phlogdev("Residential Phone cleared");
						W.model.actionManager.add(new UpdateObject(item, {phone: null}));
						// no field HL
					}
					// newURL = null;
					if (item.attributes.url !== null && item.attributes.url !== "") {  // remove any url
						phlogdev("Residential URL cleared");
						W.model.actionManager.add(new UpdateObject(item, {url: null}));
						// no field HL
					}
					if (item.attributes.services.length > 0) {
						phlogdev("Residential services cleared");
						W.model.actionManager.add(new UpdateObject(item, {services: [] }));
						// no field HL
					}
				}
				if (item.is2D()) {
					bannButt.pointNotArea.active = true;
				}
			} else if (item.attributes.name !== "" && item.attributes.name !== " " && item.attributes.name !== null) {  // for non-residential places
				// Place Harmonization 
				var PNHMatchData;
				if (hpMode.harmFlag) {
					PNHMatchData = harmoList(newName,state2L,region,countryCode,newCategories);  // check against the PNH list
				} else if (hpMode.hlFlag) {
					PNHMatchData = ['Highlight'];
					//PNHMatchData = harmoList(newName,state2L,region,countryCode,newCategories);  // check against the PNH list
				}
				PNHNameRegMatch = false;
				if (PNHMatchData[0] !== "NoMatch" && PNHMatchData[0] !== "ApprovalNeeded" && PNHMatchData[0] !== "Highlight" ) { // *** Replace place data with PNH data
					PNHNameRegMatch = true;
					var showDispNote = true;
					var updatePNHName = true;
					// Break out the data headers
					var PNH_DATA_headers;
					if (countryCode === "USA") {
						PNH_DATA_headers = USA_PNH_DATA[0].split("|");
					} else if (countryCode === "CAN") {
						PNH_DATA_headers = CAN_PNH_DATA[0].split("|");
					}
					var ph_name_ix = PNH_DATA_headers.indexOf("ph_name");
					var ph_aliases_ix = PNH_DATA_headers.indexOf("ph_aliases");
					var ph_category1_ix = PNH_DATA_headers.indexOf("ph_category1");
					var ph_category2_ix = PNH_DATA_headers.indexOf("ph_category2");
					var ph_description_ix = PNH_DATA_headers.indexOf("ph_description");
					var ph_url_ix = PNH_DATA_headers.indexOf("ph_url");
					var ph_order_ix = PNH_DATA_headers.indexOf("ph_order");
					// var ph_notes_ix = PNH_DATA_headers.indexOf("ph_notes");
					var ph_speccase_ix = PNH_DATA_headers.indexOf("ph_speccase");
					var ph_sfurl_ix = PNH_DATA_headers.indexOf("ph_sfurl");
					var ph_sfurllocal_ix = PNH_DATA_headers.indexOf("ph_sfurllocal");
					// var ph_forcecat_ix = PNH_DATA_headers.indexOf("ph_forcecat");
					var ph_displaynote_ix = PNH_DATA_headers.indexOf("ph_displaynote");
					
					// Retrieve the data from the PNH line(s)
					var nsMultiMatch = false, orderList = [];
					//phlogdev('Number of PNH matches: ' + PNHMatchData.length);
					if (PNHMatchData.length > 1) { // If multiple matches, then 
						var brandParent = -1, pmdTemp, pmdSpecCases, PNHMatchDataHold = PNHMatchData[0].split('|');
						for (var pmdix=0; pmdix<PNHMatchData.length; pmdix++) {  // For each of the matches, 
							pmdTemp = PNHMatchData[pmdix].split('|');  // Split the PNH data line
							orderList.push(pmdTemp[ph_order_ix]);  // Add Order number to a list
							if (pmdTemp[ph_speccase_ix].match(/brandParent(\d{1})/) !== null) {  // If there is a brandParent flag, prioritize by highest match
								pmdSpecCases = pmdTemp[ph_speccase_ix].match(/brandParent(\d{1})/)[1];
								if (pmdSpecCases > brandParent) {  // if the match is more specific than the previous ones:
									brandParent = pmdSpecCases;  // Update the brandParent level
									PNHMatchDataHold = pmdTemp;  // Update the PNH data line
									//phlogdev('pmdSpecCases: ' + pmdSpecCases);
								}
							} else {  // if any item has no brandParent structure, use highest brandParent match but post an error
								nsMultiMatch = true;
							}
						}
						PNHMatchData = PNHMatchDataHold;
					} else {
						PNHMatchData = PNHMatchData[0].split('|');  // Single match just gets direct split
					}
					
							
					
					var priPNHPlaceCat = catTranslate(PNHMatchData[ph_category1_ix]);  // translate primary category to WME code
					
					// if the location has multiple matches, then pop an alert that will make a forum post to the thread
					if (nsMultiMatch) {
						if (confirm('WMEPH: Multiple matches found!\nDouble check the script changes.\nClick OK to report this situation.') ) {  
							forumMsgInputs = {
								subject: 'Re: WMEPH Multiple match report',
								message: 'Error report: PNH Order Nos. "' + orderList.join(', ') + '" are ambiguous multiple matches.',
							};
							WMEPH_errorReport(forumMsgInputs);
						}
					}
					
					// Check special cases
					var specCases, scFlag, localURLcheck = '';
					if (ph_speccase_ix > -1) {  // If the special cases column exists
						specCases = PNHMatchData[ph_speccase_ix];  // pulls the speccases field from the PNH line
						if (specCases !== "0" && specCases !== "") {
							specCases = specCases.replace(/, /g, ",").split(",");  // remove spaces after commas and split by comma
						}
						for (var scix = 0; scix < specCases.length; scix++) { 
							// find any button/message flags in the special case (format: buttOn_xyzXyz, etc.)
							if ( specCases[scix].match(/^buttOn_/g) !== null ) {  
								scFlag = specCases[scix].match(/^buttOn_(.+)/i)[1];
								bannButt[scFlag].active = true;
							} else if ( specCases[scix].match(/^buttOff_/g) !== null ) {
								scFlag = specCases[scix].match(/^buttOff_(.+)/i)[1];
								bannButt[scFlag].active = false;
							} else if ( specCases[scix].match(/^messOn_/g) !== null ) {
								scFlag = specCases[scix].match(/^messOn_(.+)/i)[1];
								bannButt[scFlag].active = true;
							} else if ( specCases[scix].match(/^messOff_/g) !== null ) {
								scFlag = specCases[scix].match(/^messOff_(.+)/i)[1];
								bannButt[scFlag].active = false;
							} else if ( specCases[scix].match(/^psOn_/g) !== null ) {
								scFlag = specCases[scix].match(/^psOn_(.+)/i)[1];
								bannServ[scFlag].actionOn();
								bannServ[scFlag].pnhOverride = true;
							} else if ( specCases[scix].match(/^psOff_/g) !== null ) {
								scFlag = specCases[scix].match(/^psOff_(.+)/i)[1];
								bannServ[scFlag].actionOff();
								bannServ[scFlag].pnhOverride = true;
							}
							// parseout localURL data if exists (meaning place can have a URL distinct from the chain URL
							if ( specCases[scix].match(/^localURL_/g) !== null ) {
								localURLcheck = specCases[scix].match(/^localURL_(.+)/i)[1];
							}
							// parse out optional alt-name
							if ( specCases[scix].match(/^optionAltName<>(.+)/g) !== null ) {
								optionalAlias = specCases[scix].match(/^optionAltName<>(.+)/i)[1];
								if (newAliases.indexOf(optionalAlias) === -1) {
									bannButt.addAlias.active = true;
								}
							}
							// Gas Station forceBranding
							if ( ["GAS_STATION"].indexOf(priPNHPlaceCat) > -1 && specCases[scix].match(/^forceBrand<>(.+)/i) !== null ) {
								var forceBrand = specCases[scix].match(/^forceBrand<>(.+)/i)[1];
								if (item.attributes.brand !== forceBrand) {
									W.model.actionManager.add(new UpdateObject(item, { brand: forceBrand }));
									fieldUpdateObject.brand='#dfd';
									phlogdev('Gas brand updated from PNH');
								}
							}
							// Check Localization
							if ( specCases[scix].match(/^checkLocalization<>(.+)/i) !== null ) {
								updatePNHName = false;
								var baseName = specCases[scix].match(/^checkLocalization<>(.+)/i)[1];
								var baseNameRE = new RegExp(baseName, 'g');
								if ( newName.match(baseNameRE) === null ) {
									bannButt.localizedName.active = true;
									if (currentWL.localizedName) {
										bannButt.localizedName.WLactive = false;
									}
									bannButt.PlaceWebsite.value = 'Place Website';
									if (ph_displaynote_ix > -1 && PNHMatchData[ph_displaynote_ix] !== '0' && PNHMatchData[ph_displaynote_ix] !== '') {
										bannButt.localizedName.message = PNHMatchData[ph_displaynote_ix];
									}
								}
								showDispNote = false;
							}
							
							// Prevent name change
							if ( specCases[scix].match(/keepName/g) !== null ) {
								updatePNHName = false;
							}
							
						}
					}
					
					// If it's a place that also sells fuel, enable the button
					if ( PNHMatchData[ph_speccase_ix] === 'subFuel' && newName.toUpperCase().indexOf('GAS') === -1 && newName.toUpperCase().indexOf('FUEL') === -1 ) {  
						bannButt.subFuel.active = true;
						if (currentWL.subFuel) {
							bannButt.subFuel.WLactive = false;
						}
					}
					
					// Display any notes for the specific place
					if (showDispNote && ph_displaynote_ix > -1 && PNHMatchData[ph_displaynote_ix] !== '0' && PNHMatchData[ph_displaynote_ix] !== '' ) {
						if ( containsAny(specCases,['pharmhours']) ) {
							if ( item.attributes.description.toUpperCase().indexOf('PHARMACY') === -1 || ( item.attributes.description.toUpperCase().indexOf('HOURS') === -1 && item.attributes.description.toUpperCase().indexOf('HRS') === -1 ) ) {
								bannButt.specCaseMessage.active = true;
								bannButt.specCaseMessage.message = PNHMatchData[ph_displaynote_ix];
							}
						} else if ( containsAny(specCases,['drivethruhours']) ) {
							if ( item.attributes.description.toUpperCase().indexOf('DRIVE') === -1 || ( item.attributes.description.toUpperCase().indexOf('HOURS') === -1 && item.attributes.description.toUpperCase().indexOf('HRS') === -1 ) ) {
								if ( $("#service-checkbox-"+'DRIVETHROUGH').prop('checked') ) {
									bannButt.specCaseMessage.active = true;
									bannButt.specCaseMessage.message = PNHMatchData[ph_displaynote_ix];
								} else {
									bannButt.specCaseMessageLow.active = true;
									bannButt.specCaseMessageLow.message = PNHMatchData[ph_displaynote_ix];
								}
							}
						} else {
							bannButt.specCaseMessageLow.active = true;
							bannButt.specCaseMessageLow.message = PNHMatchData[ph_displaynote_ix];
						}
					}
					
					// Localized Storefinder code:
					if (ph_sfurl_ix > -1) {  // if the sfurl column exists...
						if ( ph_sfurllocal_ix > -1 && PNHMatchData[ph_sfurllocal_ix] !== "" && PNHMatchData[ph_sfurllocal_ix] !== "0" ) {
							if ( !bannButt.localizedName.active ) {
								bannButt.PlaceWebsite.value = "Store Locator (L)";
							}
							var tempLocalURL = PNHMatchData[ph_sfurllocal_ix].replace(/ /g,'').split("<>");
							var searchStreet = "", searchCity = "", searchState = "";
							if ("string" === typeof addr.street.name) {
								searchStreet = addr.street.name;
							}
							var searchStreetPlus = searchStreet.replace(/ /g, "+");
							searchStreet = searchStreet.replace(/ /g, "%20");
							if ("string" === typeof addr.city.name) {
								searchCity = addr.city.name;
							}
							var searchCityPlus = searchCity.replace(/ /g, "+");
							searchCity = searchCity.replace(/ /g, "%20");
							if ("string" === typeof addr.state.name) {
								searchState = addr.state.name;
							}
							var searchStatePlus = searchState.replace(/ /g, "+");
							searchState = searchState.replace(/ /g, "%20");
							
							for (var tlix = 1; tlix<tempLocalURL.length; tlix++) {
								if (tempLocalURL[tlix] === 'ph_streetName') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + searchStreet;
								} else if (tempLocalURL[tlix] === 'ph_streetNamePlus') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + searchStreetPlus;
								} else if (tempLocalURL[tlix] === 'ph_cityName') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + searchCity;
								} else if (tempLocalURL[tlix] === 'ph_cityNamePlus') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + searchCityPlus;
								} else if (tempLocalURL[tlix] === 'ph_stateName') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + searchState;
								} else if (tempLocalURL[tlix] === 'ph_stateNamePlus') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + searchStatePlus;
								} else if (tempLocalURL[tlix] === 'ph_state2L') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + state2L;
								} else if (tempLocalURL[tlix] === 'ph_latitudeEW') {
									//customStoreFinderLocalURL = customStoreFinderLocalURL + itemGPS[0];
								} else if (tempLocalURL[tlix] === 'ph_longitudeNS') {
									//customStoreFinderLocalURL = customStoreFinderLocalURL + itemGPS[1];
								} else if (tempLocalURL[tlix] === 'ph_latitudePM') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + itemGPS.lat;
								} else if (tempLocalURL[tlix] === 'ph_longitudePM') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + itemGPS.lon;
								} else if (tempLocalURL[tlix] === 'ph_latitudePMBuffMin') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + (itemGPS.lat-0.15).toString();
								} else if (tempLocalURL[tlix] === 'ph_longitudePMBuffMin') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + (itemGPS.lon-0.15).toString();
								} else if (tempLocalURL[tlix] === 'ph_latitudePMBuffMax') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + (itemGPS.lat+0.15).toString();
								} else if (tempLocalURL[tlix] === 'ph_longitudePMBuffMax') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + (itemGPS.lon+0.15).toString();
								} else if (tempLocalURL[tlix] === 'ph_houseNumber') {
									customStoreFinderLocalURL = customStoreFinderLocalURL + item.attributes.houseNumber;
								} else {
									customStoreFinderLocalURL = customStoreFinderLocalURL + tempLocalURL[tlix];
								}
							}
							if ( customStoreFinderLocalURL.indexOf('http') !== 0 ) {
								customStoreFinderLocalURL = 'http:\/\/' + customStoreFinderLocalURL;
							}
							customStoreFinderLocal = true;
						} else if (PNHMatchData[ph_sfurl_ix] !== "" && PNHMatchData[ph_sfurl_ix] !== "0") {
							if ( !bannButt.localizedName.active ) {
								bannButt.PlaceWebsite.value = "Store Locator";
							}
							customStoreFinderURL = PNHMatchData[ph_sfurl_ix];
							if ( customStoreFinderURL.indexOf('http') !== 0 ) {
								customStoreFinderURL = 'http:\/\/' + customStoreFinderURL;
							}
							customStoreFinder = true;
						}
					}
					
					// Category translations						
					var altCategories = PNHMatchData[ph_category2_ix];
					if (altCategories !== "0" && altCategories !== "") {  //  translate alt-cats to WME code
						altCategories = altCategories.replace(/,[^A-Za-z0-9]*/g, ",").split(",");  // tighten and split by comma
						for (var catix = 0; catix<altCategories.length; catix++) {  
							var newAltTemp = catTranslate(altCategories[catix]);  // translate altCats into WME cat codes
							if (newAltTemp === "ERROR") {  // if no translation, quit the loop
								phlog('Category ' + altCategories[catix] + 'cannot be translated.');
								return;
							} else {
								altCategories[catix] = newAltTemp;  // replace with translated element
							}
						}
					}
					
					// name parsing with category exceptions
					var splix;
					if (["HOTEL"].indexOf(priPNHPlaceCat) > -1) { 
						if (newName.toUpperCase() === PNHMatchData[ph_name_ix].toUpperCase()) {  // If no localization
							bannButt.catHotel.message = 'Check hotel website for any name localization (e.g. '+ PNHMatchData[ph_name_ix] +' - Tampa Airport).';
							bannButt.catHotel.active = true;
							newName = PNHMatchData[ph_name_ix];
						} else {
							// Replace PNH part of name with PNH name
							splix = newName.toUpperCase().replace(/[-\/]/g,' ').indexOf(PNHMatchData[ph_name_ix].toUpperCase().replace(/[-\/]/g,' ') );
							if (splix>-1) {
								newName = newName.slice(0,splix) + ' ' + PNHMatchData[ph_name_ix] + ' ' + newName.slice(splix+PNHMatchData[ph_name_ix].length);
								newName = newName.replace(/ {2,}/g,' ');
							}
						}
						if ( altCategories !== "0" && altCategories !== "" ) {  // if PNH alts exist
							insertAtIX(newCategories, altCategories, 1);  //  then insert the alts into the existing category array after the GS category
						}
						if ( newCategories.indexOf('HOTEL') !== 0 ) {  // If no GS category in the primary, flag it
							bannButt.hotelMkPrim.active = true;
							if (currentWL.hotelMkPrim) {
								bannButt.hotelMkPrim.WLactive = false;
							} else {
								lockOK = false;
							}
						}
					} else if ( ["BANK_FINANCIAL"].indexOf(priPNHPlaceCat) > -1 && PNHMatchData[ph_speccase_ix].indexOf('notABank') === -1 ) {
						// PNH Bank treatment
						ixBank = item.attributes.categories.indexOf("BANK_FINANCIAL");
						ixATM = item.attributes.categories.indexOf("ATM");
						ixOffices = item.attributes.categories.indexOf("OFFICES");
						// if the name contains ATM in it
						if ( newName.match(/\batm\b/ig) !== null ) {
							if ( ixOffices === 0 ) {
								bannButt.bankType1.active = true;
								bannButt.bankBranch.active = true;
								bannButt.standaloneATM.active = true;
								bannButt.bankCorporate.active = true;
							} else if ( ixBank === -1 && ixATM === -1 ) {
								bannButt.bankBranch.active = true;
								bannButt.standaloneATM.active = true;
							} else if ( ixATM === 0 && ixBank > 0 ) {
								bannButt.bankBranch.active = true;
							} else if ( ixBank > -1 ) {
								bannButt.bankBranch.active = true;
								bannButt.standaloneATM.active = true;
							}
							newName = PNHMatchData[ph_name_ix] + ' ATM';
							newCategories = insertAtIX(newCategories, 'ATM', 0);
							// Net result: If the place has ATM cat only and ATM in the name, then it will be green and renamed Bank Name ATM
						} else if (ixBank > -1  || ixATM > -1) {  // if no ATM in name but with a banking category:
							if ( ixOffices === 0 ) {
								bannButt.bankBranch.active = true;
							} else if ( ixBank > -1  && ixATM === -1 ) {
								bannButt.addATM.active = true;
							} else if ( ixATM === 0 && ixBank === -1 ) {
								bannButt.bankBranch.active = true;
								bannButt.standaloneATM.active = true;
							} else if ( ixBank > 0 && ixATM > 0 ) {
								bannButt.bankBranch.active = true;
								bannButt.standaloneATM.active = true;
							}
							newName = PNHMatchData[ph_name_ix];
							// Net result: If the place has Bank category first, then it will be green with PNH name replaced
						} else {  // for PNH match with neither bank type category, make it a bank
							newCategories = insertAtIX(newCategories, 'BANK_FINANCIAL', 1);
							bannButt.standaloneATM.active = true;
							bannButt.bankCorporate.active = true;
						}// END PNH bank treatment
					} else if ( ["GAS_STATION"].indexOf(priPNHPlaceCat) > -1 ) {  // for PNH gas stations, don't replace existing sub-categories
						if ( altCategories !== "0" && altCategories !== "" ) {  // if PNH alts exist
							insertAtIX(newCategories, altCategories, 1);  //  then insert the alts into the existing category array after the GS category
						}
						if ( newCategories.indexOf('GAS_STATION') !== 0 ) {  // If no GS category in the primary, flag it
							bannButt.gasMkPrim.active = true;
							lockOK = false;
						} else {
							newName = PNHMatchData[ph_name_ix];
						}
					} else if (updatePNHName) {  // if not a special category then update the name
						newName = PNHMatchData[ph_name_ix];
						newCategories = [priPNHPlaceCat];
						if (altCategories !== "0" && altCategories !== "") {
							newCategories.push.apply(newCategories,altCategories);
						}
					}
					
					// *** need to add a section above to allow other permissible categories to remain? (optional)
					
					// Parse URL data
					var localURLcheckRE;
					if ( localURLcheck !== '') {
						if (newURL !== null || newURL !== '') {
							localURLcheckRE = new RegExp(localURLcheck, "i");
							if ( newURL.match(localURLcheckRE) !== null ) {
								newURL = normalizeURL(newURL,false);
							} else {
								newURL = normalizeURL(PNHMatchData[ph_url_ix],false);
								bannButt.localURL.active = true;
							}
						} else {
							newURL = normalizeURL(PNHMatchData[ph_url_ix],false);
							bannButt.localURL.active = true;
						}
					} else {
						newURL = normalizeURL(PNHMatchData[ph_url_ix],false);
					}
					// Parse PNH Aliases
					newAliasesTemp = PNHMatchData[ph_aliases_ix].match(/([^\(]*)/i)[0];
					if (newAliasesTemp !== "0" && newAliasesTemp !== "") {  // make aliases array
						newAliasesTemp = newAliasesTemp.replace(/,[^A-za-z0-9]*/g, ",");  // tighten up commas if more than one alias.
						newAliasesTemp = newAliasesTemp.split(",");  // split by comma
					}
					if ( specCases.indexOf('noUpdateAlias') === -1 && (!containsAll(newAliases,newAliasesTemp) && newAliasesTemp !== "0" && newAliasesTemp !== "" && specCases.indexOf('optionName2') === -1 ))  {
						newAliases = insertAtIX(newAliases,newAliasesTemp,0);
					}
					// Enable optional alt-name button
					if (bannButt.addAlias.active) {
						bannButt.addAlias.message = "Is there a " + optionalAlias + " at this location?";
						bannButt.addAlias.title = 'Add ' + optionalAlias;
					}
					// update categories if different and no Cat2 option
					if ( !matchSets( uniq(item.attributes.categories),uniq(newCategories) ) ) {
						if ( specCases.indexOf('optionCat2') === -1 && specCases.indexOf('buttOn_addCat2') === -1 ) {
							phlogdev("Categories updated" + " with " + newCategories);
							W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
							fieldUpdateObject.categories='#dfd';
						} else {  // if second cat is optional
							phlogdev("Primary category updated" + " with " + priPNHPlaceCat);
							W.model.actionManager.add(new UpdateObject(item, { categories: [priPNHPlaceCat] }));
							fieldUpdateObject.categories='#dfd';
						}
						// Enable optional 2nd category button
						if (specCases.indexOf('buttOn_addCat2') > -1 && newCategories.indexOf(catTransWaze2Lang[altCategories[0]]) === -1 ) {
							bannButt.addCat2.message = "Is there a " + catTransWaze2Lang[altCategories[0]] + " at this location?";
							bannButt.addCat2.title = 'Add ' + catTransWaze2Lang[altCategories[0]];
						}
					}
					
					// Description update
					newDescripion = PNHMatchData[ph_description_ix];
					if (newDescripion !== null && newDescripion !== "0" && item.attributes.description.toUpperCase().indexOf(newDescripion.toUpperCase()) === -1 ) {
						if ( item.attributes.description !== "" && item.attributes.description !== null && item.attributes.description !== ' ' ) {
							bannButt.checkDescription.active = true;
						}
						phlogdev("Description updated");
						newDescripion = newDescripion + '\n' + item.attributes.description;
						W.model.actionManager.add(new UpdateObject(item, { description: newDescripion }));
						fieldUpdateObject.description='#dfd';
					}
					
					// Special Lock by PNH
					if (specCases.indexOf('lockAt5') > -1 ) {
						PNHLockLevel = 4;
					}
					
					
				} else {  // if no PNH match found
					if (PNHMatchData[0] === "ApprovalNeeded") {
						//PNHNameTemp = PNHMatchData[1].join(', ');
						PNHNameTemp = PNHMatchData[1][0];  // Just do the first match
						PNHNameTempWeb = PNHNameTemp.replace(/\&/g, "%26");
						PNHNameTempWeb = PNHNameTemp.replace(/\#/g, "%23");
						PNHNameTempWeb = PNHNameTempWeb.replace(/\//g, "%2F");
						PNHOrderNum = PNHMatchData[2].join(',');
					}
					
					// Strong title case option for non-PNH places
					if (newName !== toTitleCaseStrong(newName)) {
						bannButt.STC.active = true;
					}
					
					newURL = normalizeURL(newURL,true);  // Normalize url
					
					// Generic Hotel Treatment
					if ( newCategories.indexOf("HOTEL") > -1  && newName.indexOf(' - ') === -1 && newName.indexOf(': ') === -1) {
						bannButt.catHotel.active = true;
						if (currentWL.hotelLocWL) {
							bannButt.catHotel.WLactive = false;
						}
					}
				
					// Generic Bank treatment
					ixBank = item.attributes.categories.indexOf("BANK_FINANCIAL");
					ixATM = item.attributes.categories.indexOf("ATM");
					ixOffices = item.attributes.categories.indexOf("OFFICES");
					// if the name contains ATM in it
					if ( newName.match(/\batm\b/ig) !== null ) {
						if ( ixOffices === 0 ) {
							bannButt.bankType1.active = true;
							bannButt.bankBranch.active = true;
							bannButt.standaloneATM.active = true;
							bannButt.bankCorporate.active = true;
						} else if ( ixBank === -1 && ixATM === -1 ) {
							bannButt.bankBranch.active = true;
							bannButt.standaloneATM.active = true;
						} else if ( ixATM === 0 && ixBank > 0 ) {
							bannButt.bankBranch.active = true;
						} else if ( ixBank > -1 ) {
							bannButt.bankBranch.active = true;
							bannButt.standaloneATM.active = true;
						}
						// Net result: If the place has ATM cat only and ATM in the name, then it will be green
					} else if (ixBank > -1  || ixATM > -1) {  // if no ATM in name:
						if ( ixOffices === 0 ) {
							bannButt.bankBranch.active = true;
						} else if ( ixBank > -1  && ixATM === -1 ) {
							bannButt.addATM.active = true;
						} else if ( ixATM === 0 && ixBank === -1 ) {
							bannButt.bankBranch.active = true;
							bannButt.standaloneATM.active = true;
						} else if ( ixBank > 0 && ixATM > 0 ) {
							bannButt.bankBranch.active = true;
							bannButt.standaloneATM.active = true;
						}
						// Net result: If the place has Bank category first, then it will be green
					} // END generic bank treatment
					
				}  // END PNH match/no-match updates
				
				// Strip/add suffixes
				if ( hpMode.harmFlag && thisUser.userName === 'bmtg' )  {
					var suffixStr = ' - ZQXWCEVRBT';
					var suffixStrRE = new RegExp(suffixStr, 'i');
					if ( newName.indexOf(suffixStr) > -1 ) {
						//newName = newName.replace(suffixStrRE, '');
					}
					if ( newName.indexOf(suffixStr) === -1 ) {
						//newName = newName + suffixStr;
					}
				}
				
				// Update name:
				if (hpMode.harmFlag && newName !== item.attributes.name) {
					phlogdev("Name updated");
					W.model.actionManager.add(new UpdateObject(item, { name: newName }));
					fieldUpdateObject.name='#dfd';
				}
						
				// Update aliases
				newAliases = removeSFAliases(newName, newAliases);
				for (naix=0; naix<newAliases.length; naix++) {
					newAliases[naix] = toTitleCase(newAliases[naix]);
				}
				if (hpMode.harmFlag && newAliases !== item.attributes.aliases && newAliases.length !== item.attributes.aliases.length) {
					phlogdev("Alt Names updated");
					W.model.actionManager.add(new UpdateObject(item, { aliases: newAliases }));
					fieldUpdateObject.aliases='#dfd';
				}
				
				// Gas station treatment (applies to all including PNH)
				if (newCategories[0] === 'GAS_STATION') {
					// Brand checking
					if ( !item.attributes.brand || item.attributes.brand === null || item.attributes.brand === "" ) {
						bannButt.gasNoBrand.active = true;
						if (currentWL.gasNoBrand) {
							bannButt.gasNoBrand.WLactive = false;
						}
					} else if (item.attributes.brand === 'Unbranded' ) {  //  Unbranded is not used per wiki
						bannButt.gasUnbranded.active = true;
						lockOK = false;
					} else {
						var brandNameRegEx = new RegExp('\\b'+item.attributes.brand.toUpperCase().replace(/[ '-]/g,''), "i");
						if ( newName.toUpperCase().replace(/[ '-]/g,'').match(brandNameRegEx) === null ) {
							bannButt.gasMismatch.active = true;
							if (currentWL.gasMismatch) {
								bannButt.gasMismatch.WLactive = false;
							} else {
								lockOK = false;
							}
						}
					}
					// Add convenience store category to station
					if (newCategories.indexOf("CONVENIENCE_STORE") === -1 && !bannButt.subFuel.active) {
						if ( hpMode.harmFlag && $("#WMEPH-ConvenienceStoreToGasStations" + devVersStr).prop('checked') ) {  // Automatic if user has the setting checked
							newCategories = insertAtIX(newCategories, "CONVENIENCE_STORE", 1);  // insert the C.S. category
							W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
							fieldUpdateObject.categories='#dfd';
							phlogdev('Conv. store category added');
						} else {  // If not checked, then it will be a banner button
							bannButt.addConvStore.active = true;
						}
					}
				}  // END Gas Station Checks
				
				// Make PNH submission links
				var regionFormURL = '';
				var newPlaceAddon = '';
				var approvalAddon = '';
				var approvalMessage = 'Submitted via WMEPH. PNH order number ' + PNHOrderNum;
				var tempSubmitName = newName.replace(/\&/g,'%26').replace(/\//g, "%2F").replace(/\#/g, "%23");
				if (hpMode.harmFlag) {
					switch (region) {
						case "NWR": regionFormURL = 'https://docs.google.com/forms/d/1hv5hXBlGr1pTMmo4n3frUx1DovUODbZodfDBwwTc7HE/viewform';
							newPlaceAddon = '?entry.925969794='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.925969794='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState;
							break;
						case "SWR": regionFormURL = 'https://docs.google.com/forms/d/1Qf2N4fSkNzhVuXJwPBJMQBmW0suNuy8W9itCo1qgJL4/viewform';
							newPlaceAddon = '?entry.1497446659='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.1497446659='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState; 
							break;
						case "HI": regionFormURL = 'https://docs.google.com/forms/d/1K7Dohm8eamIKry3KwMTVnpMdJLaMIyDGMt7Bw6iqH_A/viewform';
							newPlaceAddon = '?entry.1497446659='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.1497446659='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState; 
							break;
						case "PLN": regionFormURL = 'https://docs.google.com/forms/d/1ycXtAppoR5eEydFBwnghhu1hkHq26uabjUu8yAlIQuI/viewform';
							newPlaceAddon = '?entry.925969794='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.925969794='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState; 
							break;
						case "SCR": regionFormURL = 'https://docs.google.com/forms/d/1KZzLdlX0HLxED5Bv0wFB-rWccxUp2Mclih5QJIQFKSQ/viewform';
							newPlaceAddon = '?entry.925969794='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.925969794='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState; 
							break;
						case "TX": regionFormURL = 'https://docs.google.com/forms/d/1x7VM7ofPOKVnWOaX7d70OWXpnVKf6Mkadn4dgYxx4ic/viewform';
							newPlaceAddon = '?entry.925969794='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.925969794='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState; 
							break;
						case "GLR": regionFormURL = 'https://docs.google.com/forms/d/19btj-Qt2-_TCRlcS49fl6AeUT95Wnmu7Um53qzjj9BA/viewform';
							newPlaceAddon = '?entry.925969794='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.925969794='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState; 
							break;
						case "SAT": regionFormURL = 'https://docs.google.com/forms/d/1bxgK_20Jix2ahbmUvY1qcY0-RmzUBT6KbE5kjDEObF8/viewform';
							newPlaceAddon = '?entry.2063110249='+tempSubmitName+'&entry.2018912633='+newURLSubmit+'&entry.1924826395='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.2063110249='+PNHNameTempWeb+'&entry.123778794='+approvalMessage+'&entry.1924826395='+thisUser.userName+gFormState; 
							break;
						case "SER": regionFormURL = 'https://docs.google.com/forms/d/1jYBcxT3jycrkttK5BxhvPXR240KUHnoFMtkZAXzPg34/viewform';
							newPlaceAddon = '?entry.822075961='+tempSubmitName+'&entry.1422079728='+newURLSubmit+'&entry.1891389966='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.822075961='+PNHNameTempWeb+'&entry.607048307='+approvalMessage+'&entry.1891389966='+thisUser.userName+gFormState; 
							break;
						case "TER": regionFormURL = 'https://docs.google.com/forms/d/1v7JhffTfr62aPSOp8qZHA_5ARkBPldWWJwDeDzEioR0/viewform';
							newPlaceAddon = '?entry.925969794='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.925969794='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState; 
							break;
						case "NEW": regionFormURL = 'https://docs.google.com/forms/d/1UgFAMdSQuJAySHR0D86frvphp81l7qhEdJXZpyBZU6c/viewform';
							newPlaceAddon = '?entry.925969794='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.925969794='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState; 
							break;
						case "NOR": regionFormURL = 'https://docs.google.com/forms/d/1iYq2rd9HRd-RBsKqmbHDIEBGuyWBSyrIHC6QLESfm4c/viewform';
							newPlaceAddon = '?entry.925969794='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.925969794='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState; 
							break;
						case "MAR": regionFormURL = 'https://docs.google.com/forms/d/1PhL1iaugbRMc3W-yGdqESoooeOz-TJIbjdLBRScJYOk/viewform';
							newPlaceAddon = '?entry.925969794='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.925969794='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState; 
							break;
						case "CA_EN": regionFormURL = 'https://docs.google.com/forms/d/13JwXsrWPNmCdfGR5OVr5jnGZw-uNGohwgjim-JYbSws/viewform';
							newPlaceAddon = '?entry_839085807='+tempSubmitName+'&entry_1067461077='+newURLSubmit; 
							approvalAddon = '?entry_839085807='+PNHNameTempWeb+'&entry_1125435193='+approvalMessage; 
							break;
						case "QC": regionFormURL = 'https://docs.google.com/forms/d/13JwXsrWPNmCdfGR5OVr5jnGZw-uNGohwgjim-JYbSws/viewform';
							newPlaceAddon = '?entry_839085807='+tempSubmitName+'&entry_1067461077='+newURLSubmit; 
							approvalAddon = '?entry_839085807='+PNHNameTempWeb+'&entry_1125435193='+approvalMessage; 
							break;
						default: regionFormURL = "";
					}
					newPlaceURL = regionFormURL + newPlaceAddon;
					approveRegionURL = regionFormURL + approvalAddon;	
				}
				
				// Category/Name-based Services, added to any existing services:
				var CH_DATA, CH_NAMES;
				if (countryCode === "USA") {
					CH_DATA = USA_CH_DATA;
					CH_NAMES = USA_CH_NAMES;
				} else if (countryCode === "CAN") {
					CH_DATA = USA_CH_DATA;   // #### CAN shares the USA sheet, can eventually can be split to new sheet if needed
					CH_NAMES = USA_CH_NAMES;
				}
				var CH_DATA_headers = CH_DATA[0].split("|");
				var CH_DATA_keys = CH_DATA[1].split("|");
				var CH_DATA_list = CH_DATA[2].split("|");
				
				var servHeaders = [], servKeys = [], servList = [], servHeaderCheck;
				for (var jjj=0; jjj<CH_DATA_headers.length; jjj++) {
					servHeaderCheck = CH_DATA_headers[jjj].match(/^ps_/i);  // if it's a service header
					if (servHeaderCheck) { 
						servHeaders.push(jjj); 
						servKeys.push(CH_DATA_keys[jjj]); 
						servList.push(CH_DATA_list[jjj]); 
					}
				}
					
				var CH_DATA_Temp;
				for (var iii=0; iii<CH_NAMES.length; iii++) {
					if (newCategories.indexOf(CH_NAMES[iii]) > -1 ) {
						CH_DATA_Temp = CH_DATA[iii].split("|");
						for (var psix=0; psix<servHeaders.length; psix++) {
							if ( !bannServ[servKeys[psix]].pnhOverride ) {
								if (CH_DATA_Temp[servHeaders[psix]] === '1') {  // These are automatically added to all countries/regions (if auto setting is on)
									bannServ[servKeys[psix]].active = true;
									if ( hpMode.harmFlag && $("#WMEPH-EnableServices" + devVersStr).prop('checked')  ) {
										// Automatically enable new services
										bannServ[servKeys[psix]].actionOn();
									}
								} else if (CH_DATA_Temp[servHeaders[psix]] === '2') {  // these are never automatically added but shown
									bannServ[servKeys[psix]].active = true;
								} else if (CH_DATA_Temp[servHeaders[psix]] !== '') {  // check for state/region auto add
									bannServ[servKeys[psix]].active = true;
									if ( hpMode.harmFlag && $("#WMEPH-EnableServices" + devVersStr).prop('checked')) {
										var servAutoRegion = CH_DATA_Temp[servHeaders[psix]].replace(/,[^A-za-z0-9]*/g, ",").split(",");
										// if the sheet data matches the state, region, or username then auto add
										if ( servAutoRegion.indexOf(state2L) > -1 || servAutoRegion.indexOf(region) > -1 || servAutoRegion.indexOf(thisUser.userName) > -1 ) {
											bannServ[servKeys[psix]].actionOn();
										}
									}
								}
							}
						}
					}
				}
				
				// PNH specific Services:
				
				
				
				// ### remove unnecessary parent categories (Restaurant doesn't need food and drink)
				if ( hpMode.harmFlag && newCategories.indexOf('FOOD_AND_DRINK') > -1 ) {
					if (newCategories.indexOf('RESTAURANT') > -1 || newCategories.indexOf('FAST_FOOD') > -1 ) {
						newCategories.splice(newCategories.indexOf('FOOD_AND_DRINK'),1);  // remove Food/Drink Cat
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						fieldUpdateObject.categories='#dfd';
					}
				}
			
			
				// Area vs. Place checking, Category locking, and category-based messaging
				var pvaPoint, pvaArea, regPoint, regArea, pc_message, pc_lockTemp, pc_rare, pc_parent;
				for (iii=0; iii<CH_NAMES.length; iii++) {
					if (newCategories.indexOf(CH_NAMES[iii]) === 0 ) {  // Primary category
						CH_DATA_Temp = CH_DATA[iii].split("|");
						// CH_DATA_headers
						//pc_point	pc_area	pc_regpoint	pc_regarea	pc_lock1	pc_lock2	pc_lock3	pc_lock4	pc_lock5	pc_rare	pc_parent	pc_message
						pvaPoint = CH_DATA_Temp[CH_DATA_headers.indexOf('pc_point')];
						pvaArea = CH_DATA_Temp[CH_DATA_headers.indexOf('pc_area')];
						regPoint = CH_DATA_Temp[CH_DATA_headers.indexOf('pc_regpoint')].replace(/,[^A-za-z0-9]*/g, ",").split(",");
						regArea = CH_DATA_Temp[CH_DATA_headers.indexOf('pc_regarea')].replace(/,[^A-za-z0-9]*/g, ",").split(",");
						if (regPoint.indexOf(state2L) > -1 || regPoint.indexOf(region) > -1 || regPoint.indexOf(countryCode) > -1) {
							pvaPoint = '1';
							pvaArea = '';
						} else if (regArea.indexOf(state2L) > -1 || regArea.indexOf(region) > -1 || regArea.indexOf(countryCode) > -1) {
							pvaPoint = '';
							pvaArea = '1';
						}
						if (item.isPoint()) {
							if (pvaPoint === '' || pvaPoint === '0') {
								bannButt.areaNotPoint.active = true;
								if (currentWL.areaNotPoint) {
									bannButt.areaNotPoint.WLactive = false;
								} else {
									lockOK = false;
								}
							} else if (pvaPoint === '2') {
								bannButt.areaNotPointLow.active = true;
								if (currentWL.areaNotPoint) {
									bannButt.areaNotPointLow.WLactive = false;
								}
							} else if (pvaPoint === '3') {
								bannButt.areaNotPointMid.active = true;
								if (currentWL.areaNotPoint) {
									bannButt.areaNotPointMid.WLactive = false;
								} else {
									lockOK = false;
								}
							} else if (pvaPoint === 'hosp' && newName.toUpperCase().match(/\bER\b/g) === null && newName.toUpperCase().match(/\bEMERGENCY ROOM\b/g) === null ) {
								// hopsitals get flagged high unless ER or Emergency Room in the name
								bannButt.areaNotPoint.active = true;
								if (currentWL.areaNotPoint) {
									bannButt.areaNotPoint.WLactive = false;
								} else {
									lockOK = false;
								}
							}
						} else if (item.is2D()) {
							if (pvaArea === '' || pvaArea === '0') {
								bannButt.pointNotArea.active = true;
								if (currentWL.pointNotArea) {
									bannButt.pointNotArea.WLactive = false;
								} else {
									lockOK = false;
								}
							} else if (pvaArea === '2') {
								bannButt.pointNotAreaLow.active = true;
								if (currentWL.pointNotArea) {
									bannButt.pointNotAreaLow.WLactive = false;
								}
							} else if (pvaArea === '3') {
								bannButt.pointNotAreaMid.active = true;
								if (currentWL.pointNotArea) {
									bannButt.pointNotAreaMid.WLactive = false;
								} else {
									lockOK = false;
								}
							}
						}
						// display any messaged regarding the category
						pc_message = CH_DATA_Temp[CH_DATA_headers.indexOf('pc_message')];
						if (pc_message !== '0' && pc_message !== '' && pc_message === null) {
							bannButt.pnhCatMess.active = true;
							bannButt.pnhCatMess.message = pc_message;
						}
						// Unmapped categories
						pc_rare	 = CH_DATA_Temp[CH_DATA_headers.indexOf('pc_rare')].replace(/,[^A-Za-z0-9}]+/g, ",").split(',');
						if (pc_rare.indexOf(state2L) > -1 || pc_rare.indexOf(region) > -1 || pc_rare.indexOf(countryCode) > -1) {
								bannButt.unmappedRegion.active = true;
								if (currentWL.unmappedRegion) {
									bannButt.unmappedRegion.WLactive = false;
								} else {
									lockOK = false;
								}
						}
						// Parent Category
						pc_parent	 = CH_DATA_Temp[CH_DATA_headers.indexOf('pc_parent')].replace(/,[^A-Za-z0-9}]+/g, ",").split(',');
						if (pc_parent.indexOf(state2L) > -1 || pc_parent.indexOf(region) > -1 || pc_parent.indexOf(countryCode) > -1) {
								bannButt.parentCategory.active = true;
								if (currentWL.parentCategory) {
									bannButt.parentCategory.WLactive = false;
								}
						}
						// Set lock level
						for (var lockix=1; lockix<6; lockix++) {
							pc_lockTemp = CH_DATA_Temp[CH_DATA_headers.indexOf('pc_lock'+lockix)].replace(/,[^A-Za-z0-9}]+/g, ",").split(',');
							if (pc_lockTemp.indexOf(state2L) > -1 || pc_lockTemp.indexOf(region) > -1 || pc_lockTemp.indexOf(countryCode) > -1) {
								defaultLockLevel = lockix - 1;  // Offset by 1 since lock ranks start at 0
								break;
							}
						}
					break;  // If only looking at primary category, then break
					}
				}
				
				var anpNone = collegeAbbreviations.split('|'), anpNoneRE;
				for (var cii=0; cii<anpNone.length; cii++) {
					anpNoneRE = new RegExp('\\b'+anpNone[cii]+'\\b', 'g');
					if ( newName.match( anpNoneRE) !== null ) {
						bannButt.areaNotPointLow.severity = 0;
						bannButt.areaNotPointLow.WLactive = false;
					}
				}
				
				
				
				// Check for missing hours field 
				if (item.attributes.openingHours.length === 0) {  // if no hours...
					if (!containsAny(newCategories,["STADIUM_ARENA","CEMETERY","MILITARY","TRANSPORTATION","FERRY_PIER","SUBWAY_STATION",
					"BRIDGE","TUNNEL","JUNCTION_INTERCHANGE","ISLAND","SEA_LAKE_POOL","RIVER_STREAM","FOREST_GROVE","CANAL","SWAMP_MARSH","DAM"]) ) {
						bannButt.noHours.active = true;
						if (currentWL.noHours) {
							bannButt.noHours.WLactive = false;
						}
						if ( containsAny(newCategories,["SCHOOL","CONVENTIONS_EVENT_CENTER","CAMPING_TRAILER_PARK","COTTAGE_CABIN","COLLEGE_UNIVERSITY","GOLF_COURSE","SPORTS_COURT","MOVIE_THEATER","SHOPPING_CENTER","RELIGIOUS_CENTER","PARKING_LOT","PARK","PLAYGROUND","AIRPORT","FIRE_DEPARTMENT","POLICE_STATION","SEAPORT_MARINA_HARBOR","FARM"]) ) {
							bannButt.noHours.severity = 0;
							bannButt.noHours.WLactive = false;
						}
					}
					if (hpMode.hlFlag && $("#WMEPH-DisableHoursHL" + devVersStr).prop('checked')) {
						bannButt.noHours.severity = 0;
					}
				} else if (item.attributes.openingHours.length === 1) {  // if one set of hours exist, check for partial 24hrs setting
					if (item.attributes.openingHours[0].days.length < 7 && item.attributes.openingHours[0].fromHour==='00:00' && 
					(item.attributes.openingHours[0].toHour==='00:00' || item.attributes.openingHours[0].toHour==='23:59' ) ) {
						bannButt.mismatch247.active = true;
					}
				}
				if ( !checkHours(item.attributes.openingHours) ) {
					//phlogdev('Overlapping hours');
					bannButt.hoursOverlap.active = true;
					bannButt.noHours.active = true;
				} else {
					var tempHours = item.attributes.openingHours.slice(0);
					for ( var ohix=0; ohix<item.attributes.openingHours.length; ohix++ ) {
						if ( tempHours[ohix].days.length === 2 && tempHours[ohix].days[0] === 1 && tempHours[ohix].days[1] === 0) {
							// separate hours
							phlogdev('Correcting M-S entry...');
							tempHours.push({days: [0], fromHour: tempHours[ohix].fromHour, toHour: tempHours[ohix].toHour});
							tempHours[ohix].days = [1];
							W.model.actionManager.add(new UpdateObject(item, { openingHours: tempHours }));
						}
					}
				}
				
				// Highlight 24/7 button if hours are set that way, and add button for all places
				if ( item.attributes.openingHours.length === 1 && item.attributes.openingHours[0].days.length === 7 && item.attributes.openingHours[0].fromHour === '00:00' && item.attributes.openingHours[0].toHour ==='00:00' ) {
					bannServ.add247.checked = true;
				}
				bannServ.add247.active = true;
				
				// URL updating
				var updateURL = true;
				if (newURL !== item.attributes.url && newURL !== "" && newURL !== "0") {
					if ( PNHNameRegMatch && item.attributes.url !== null && item.attributes.url !== '' ) {  // for cases where there is an existing URL in the WME place, and there is a PNH url on queue:
						var newURLTemp = normalizeURL(newURL,true);  // normalize
						var itemURL = normalizeURL(item.attributes.url,true);
						newURLTemp = newURLTemp.replace(/^www\.(.*)$/i,'$1');  // strip www
						var itemURLTemp = itemURL.replace(/^www\.(.*)$/i,'$1');  // strip www
						if ( newURLTemp !== itemURLTemp ) { // if formatted URLs don't match, then alert the editor to check the existing URL
							bannButt.longURL.active = true;
							if (currentWL.longURL) {
								bannButt.longURL.WLactive = false;
							}
							bannButt.PlaceWebsite.value = "Place Website";
							if (hpMode.harmFlag && updateURL && itemURL !== item.attributes.url) {  // Update the URL
								phlogdev("URL formatted");
								W.model.actionManager.add(new UpdateObject(item, { url: itemURL }));
								fieldUpdateObject.url='#dfd';
							}
							updateURL = false;
							tempPNHURL = newURL;
						}
					}
					if (hpMode.harmFlag && updateURL && newURL !== item.attributes.url) {  // Update the URL
						phlogdev("URL updated");
						W.model.actionManager.add(new UpdateObject(item, { url: newURL }));
						fieldUpdateObject.url='#dfd';
					}
				}
				
				// Phone formatting		
				var outputFormat = "({0}) {1}-{2}";
				if ( containsAny(["CA","CO"],[region,state2L]) && (/^\d{3}-\d{3}-\d{4}$/.test(item.attributes.phone))) {
					outputFormat = "{0}-{1}-{2}";
				} else if (region === "SER" && thisUser.userName === 't0cableguy') {
					outputFormat = "{0}-{1}-{2}";
				} else if (region === "SER" && !(/^\(\d{3}\) \d{3}-\d{4}$/.test(item.attributes.phone))) {
					outputFormat = "{0}-{1}-{2}";
				} else if (region === "GLR") {
					outputFormat = "{0}-{1}-{2}";
				} else if (state2L === "NV") {
					outputFormat = "{0}-{1}-{2}";
				} else if (countryCode === "CAN") {
					outputFormat = "+1-{0}-{1}-{2}";
				}
				newPhone = normalizePhone(item.attributes.phone, outputFormat, 'existing');
				
				// Check if valid area code  #LOC# USA and CAN only
				if (countryCode === "USA" || countryCode === "CAN") {
					if (newPhone !== null && newPhone.match(/[2-9]\d{2}/) !== null) {
						var areaCode = newPhone.match(/[2-9]\d{2}/)[0];
						if ( areaCodeList.indexOf(areaCode) === -1 ) {
							bannButt.badAreaCode.active = true;
							if (currentWL.aCodeWL) {
								bannButt.badAreaCode.WLactive = false;
							}
						}
					}
				}
				if (hpMode.harmFlag && newPhone !== item.attributes.phone) {
					phlogdev("Phone updated");
					W.model.actionManager.add(new UpdateObject(item, {phone: newPhone}));
					fieldUpdateObject.phone='#dfd';
				}
			
				// Post Office cat check
				if (newCategories.indexOf("POST_OFFICE") > -1 && countryCode === "USA" ) {
					var USPSStrings = ['USPS','POSTOFFICE','USPOSTALSERVICE','UNITEDSTATESPOSTALSERVICE','USPO','USPOSTOFFICE','UNITEDSTATESPOSTOFFICE','UNITEDSTATESPOSTALOFFICE'];
					var USPSMatch = false;
					for (var uspix=0; uspix<USPSStrings.length; uspix++) {
						if ( newName.toUpperCase().replace(/[ \/\-\.]/g,'').indexOf(USPSStrings[uspix]) > -1 ) {  // If it already has a USPS type term in the name, don't add the option
							USPSMatch = true;
							customStoreFinderURL = "https://tools.usps.com/go/POLocatorAction.action";
							customStoreFinder = true;
							if (hpMode.harmFlag && region === 'SER' && item.attributes.aliases.indexOf("United States Postal Service") === -1) {
								W.model.actionManager.add(new UpdateObject(item, { aliases: ["United States Postal Service"], url: 'www.usps.com' }));
								fieldUpdateObject.aliases='#dfd';
								fieldUpdateObject.url='#dfd';
								phlogdev('USPS alt name added');
							}
							if ( newName.indexOf(' - ') === -1 && newName.indexOf(': ') === -1 ) {
								bannButt.formatUSPS.active = true;
							}
							break;
						}
					}
					if (!USPSMatch) {
						lockOK = false;
						bannButt.isitUSPS.active = true;
						bannButt.catPostOffice.active = true;
					}
				}  // END Post Office category check
				
			}  // END if (!residential && has name)
			
			// Name check
			if ( !item.attributes.residential && ( !item.attributes.name || item.attributes.name.replace(/[^A-Za-z0-9]/g,'').length === 0 )) {
				if ( 'ISLAND|FOREST_GROVE|SEA_LAKE_POOL|RIVER_STREAM|CANAL'.split('|').indexOf(item.attributes.categories[0]) === -1 ) {
					bannButt.nameMissing.active = true;
					lockOK = false;
				}
			}
					
			// House number check
			if (!item.attributes.houseNumber || item.attributes.houseNumber.replace(/\D/g,'').length === 0 ) {
				if ( 'BRIDGE|ISLAND|FOREST_GROVE|SEA_LAKE_POOL|RIVER_STREAM|CANAL|DAM|TUNNEL'.split('|').indexOf(item.attributes.categories[0]) === -1 ) {
					if (state2L === 'PR') {
						bannButt.hnMissing.active = true;
						bannButt.hnMissing.severity = 0;
					} else {
						bannButt.hnMissing.active = true;
						if (currentWL.HNWL) {
							bannButt.hnMissing.WLactive = false;
						} else {
							lockOK = false;
						}
					}
				}
			} else if (item.attributes.houseNumber) {
				var hnOK = false, updateHNflag = false;
				var hnTemp = item.attributes.houseNumber.replace(/[^\d]/g, '');  // Digits only
				var hnTempDash = item.attributes.houseNumber.replace(/[^\d-]/g, '');  // Digits and dashes only
				if ( hnTemp < 1000000 && state2L === "NY" && addr.city.name === 'Queens' && hnTempDash.match(/^\d{1,4}-\d{1,4}$/g) !== null ) {
					updateHNflag = true;
					hnOK = true;
				}
				if (hnTemp === item.attributes.houseNumber && hnTemp < 1000000) {  //  general check that HN is 6 digits or less, & that it is only [0-9]
					hnOK = true;
				}
				if (state2L === "HI" && hnTempDash.match(/^\d{1,2}-\d{1,4}$/g) !== null) {
					if (hnTempDash === hnTempDash.match(/^\d{1,2}-\d{1,4}$/g)[0]) {
						hnOK = true;
					}
				}
				
				if (!hnOK) {
					bannButt.hnNonStandard.active = true;
					if (currentWL.hnNonStandard) {
						bannButt.hnNonStandard.WLactive = false;
					} else {
						lockOK = false;
					}
				}
				if ( updateHNflag ) {
					bannButt.hnDashRemoved.active = true;
					if (hpMode.harmFlag) {
						W.model.actionManager.add(new UpdateObject(item, { houseNumber: hnTemp }));
						fieldUpdateObject.address='#dfd';
					} else if (hpMode.hlFlag) {
						if (item.attributes.residential) {
							bannButt.hnDashRemoved.severity = 3;
						} else {
							bannButt.hnDashRemoved.severity = 1;
						}
					}
				}
			}

			if ((!addr.street || addr.street.isEmpty) && 'BRIDGE|ISLAND|FOREST_GROVE|SEA_LAKE_POOL|RIVER_STREAM|CANAL|DAM|TUNNEL'.split('|').indexOf(item.attributes.categories[0]) === -1 ) {
				bannButt.streetMissing.active = true;
				lockOK = false;
			}
			if ((!addr.city || addr.city.isEmpty) && 'BRIDGE|ISLAND|FOREST_GROVE|SEA_LAKE_POOL|RIVER_STREAM|CANAL|DAM|TUNNEL'.split('|').indexOf(item.attributes.categories[0]) === -1 ) {
				bannButt.cityMissing.active = true;
				if (item.attributes.residential && hpMode.hlFlag) {
					bannButt.cityMissing.severity = 1;
				}
				lockOK = false;
			}
			
			// CATEGORY vs. NAME checks
			var testName = newName.toLowerCase().replace(/[^a-z]/g,' ');
			var testNameWords = testName.split(' ');
			// Hopsital vs. Name filter
			if (newCategories.indexOf("HOSPITAL_MEDICAL_CARE") > -1 && hospitalPartMatch.length > 0) {
				var hpmMatch = false;
				if (containsAny(testNameWords,animalFullMatch)) {
					bannButt.changeHMC2PetVet.active = true;
					if (currentWL.changeHMC2PetVet) {
						bannButt.changeHMC2PetVet.WLactive = false;
					} else {
						lockOK = false;
					}
					bannButt.pnhCatMess.active = false;
				} else if (containsAny(testNameWords,hospitalFullMatch)) {
					bannButt.changeHMC2Office.active = true;
					if (currentWL.changeHMC2Office) {
						bannButt.changeHMC2Office.WLactive = false;
					} else {
						lockOK = false;
					}
					bannButt.pnhCatMess.active = false;
				} else {
					for (var apmix=0; apmix<animalPartMatch.length; apmix++) {
						if (testName.indexOf(animalPartMatch[apmix]) > -1) {
							bannButt.changeHMC2PetVet.active = true;
							if (currentWL.changeHMC2PetVet) {
								bannButt.changeHMC2PetVet.WLactive = false;
							} else {
								lockOK = false;
							}
							hpmMatch = true;  // don't run the human check if animal is found.
							bannButt.pnhCatMess.active = false;
							break;
						}
					}
					if (!hpmMatch) {  // don't run the human check if animal is found.
						for (var hpmix=0; hpmix<hospitalPartMatch.length; hpmix++) {
							if (testName.indexOf(hospitalPartMatch[hpmix]) > -1) {
								bannButt.changeHMC2Office.active = true;
								if (currentWL.changeHMC2Office) {
									bannButt.changeHMC2Office.WLactive = false;
								} else {
									lockOK = false;
								}
								bannButt.pnhCatMess.active = false;
								break;
							}
						}
					}
				}
			}  // END HOSPITAL/Name check
			
			// School vs. Name filter
			if (newCategories.indexOf("SCHOOL") > -1 && schoolPartMatch.length>0) {
				if (containsAny(testNameWords,schoolFullMatch)) {
					bannButt.changeSchool2Offices.active = true;
					if (currentWL.changeSchool2Offices) {
						bannButt.changeSchool2Offices.WLactive = false;
					} else {
						lockOK = false;
					}
					bannButt.pnhCatMess.active = false;
				} else {
					for (var schix=0; schix<schoolPartMatch.length; schix++) {
						if (testName.indexOf(schoolPartMatch[schix]) > -1) {
							bannButt.changeSchool2Offices.active = true;
							if (currentWL.changeSchool2Offices) {
								bannButt.changeSchool2Offices.WLactive = false;
							} else {
								lockOK = false;
							}
							bannButt.pnhCatMess.active = false;
							break;
						}
					}
				}
			}  // END SCHOOL/Name check
			
			// Some cats don't need PNH messages and url/phone severities
			if ( 'BRIDGE|FOREST_GROVE|DAM|TUNNEL|CEMETERY'.split('|').indexOf(item.attributes.categories[0]) > -1 ) {
				bannButt.NewPlaceSubmit.active = false;
				bannButt.phoneMissing.severity = 0;
				bannButt.phoneMissing.WLactive = false;
				bannButt.urlMissing.severity = 0;
				bannButt.urlMissing.WLactive = false;
			}
			// Some cats don't need PNH messages and url/phone messages
			if ( 'ISLAND|SEA_LAKE_POOL|RIVER_STREAM|CANAL'.split('|').indexOf(item.attributes.categories[0]) > -1 ) {
				bannButt.NewPlaceSubmit.active = false;
				bannButt.phoneMissing.active = false;
				bannButt.urlMissing.active = false;
			}
			
			
			// *** Rest Area parsing
			// check rest area name against standard formats or if has the right categories
			if ( (newName.toLowerCase().indexOf('rest area') > -1 || newName.toLowerCase().indexOf('rest stop') > -1 || newName.toLowerCase().indexOf('service plaza') > -1) ||
			( categories.indexOf('TRANSPORTATION') > -1 && categories.indexOf('SCENIC_LOOKOUT_VIEWPOINT') > -1 ) ) {
				if ( categories.indexOf('TRANSPORTATION') === 0 && categories.indexOf('SCENIC_LOOKOUT_VIEWPOINT') === 1) {
					if ( item.isPoint() ) {  // needs to be area point
						bannButt.areaNotPoint.active = true;
					}
					bannButt.pointNotArea.active = false;
					bannButt.unmappedRegion.active = false;
					
					if ( categories.indexOf('GAS_STATION') > -1 ) {
						bannButt.restAreaGas.active = true;				
					}
					if ( newName.match(/^Rest Area.* \- /) === null ) {
						bannButt.restAreaName.active = true;
						if (currentWL.restAreaName) {
							bannButt.restAreaName.WLactive = false;
						}
					} else {
						newName = newName.replace(/Mile/i, 'mile');
						if (newName !== item.attributes.name) {  // if they are not equal
							W.model.actionManager.add(new UpdateObject(item, { name: newName }));
							fieldUpdateObject.name='#dfd';
							phlogdev('Lower case "mile"');
						}
					}
					
					// switch to rest area wiki button
					bannButt2.restAreaWiki.active = true;
					bannButt2.placesWiki.active = false;
					
					// missing address ok 
					bannButt.streetMissing.active = false;
					bannButt.cityMissing.active = false;
					bannButt.hnMissing.active = false;
					bannButt.urlMissing.severity = 0;
					bannButt.phoneMissing.severity = 0;
					//assembleBanner();
					
					
				} else {
					bannButt.restAreaSpec.active = true;
					if (currentWL.restAreaName) {
						bannButt.restAreaSpec.WLactive = false;
					} else {
						bannButt.pointNotArea.active = false;
					}
				}
			}
			
			// update Severity for banner messages
			for (var bannKey in bannButt) {
				if (bannButt.hasOwnProperty(bannKey) && bannButt[bannKey].active) {
					severityButt = Math.max(bannButt[bannKey].severity, severityButt);
				}
			}
			
			if (hpMode.harmFlag) {
				phlogdev('Severity: '+severityButt+'; lockOK: '+lockOK);
			}
			// Place locking
			// final formatting of desired lock levels
			var hlLockFlag = false, levelToLock;
			if (PNHLockLevel !== -1 && hpMode.harmFlag) {
				phlogdev('PNHLockLevel: '+PNHLockLevel);
				levelToLock = PNHLockLevel;
			} else {
				levelToLock = defaultLockLevel;
			}
			if (region === "SER") {
				if (newCategories.indexOf("COLLEGE_UNIVERSITY") > -1 && newCategories.indexOf("PARKING_LOT") > -1) {
					levelToLock = lockLevel4;
				} else if ( item.isPoint() && newCategories.indexOf("COLLEGE_UNIVERSITY") > -1 && newCategories.indexOf("HOSPITAL_MEDICAL_CARE") === -1 ) {
					levelToLock = lockLevel4;
				}
			}
			
			if (levelToLock > (usrRank - 1)) {levelToLock = (usrRank - 1);}  // Only lock up to the user's level
			if ( lockOK && severityButt < 2) {
				// Campus project exceptions
				if ( item.attributes.lockRank < levelToLock) {
					if (hpMode.harmFlag) {
						phlogdev("Venue locked!");
						W.model.actionManager.add(new UpdateObject(item, { lockRank: levelToLock }));
						fieldUpdateObject.lockRank='#dfd';
					} else if (hpMode.hlFlag) {
						hlLockFlag = true;
					}
				}
				bannButt.placeLocked.active = true;
			}
			
			//IGN check
			if (!item.attributes.residential && item.attributes.updatedBy && W.model.users.get(item.attributes.updatedBy) && 
			W.model.users.get(item.attributes.updatedBy).userName && W.model.users.get(item.attributes.updatedBy).userName.match(/^ign_/i) !== null) {
				bannButt.ignEdited.active = true;
			}
			
			//waze_maint_bot check
			if (!item.attributes.residential && item.attributes.updatedBy && W.model.users.get(item.attributes.updatedBy) && 
			W.model.users.get(item.attributes.updatedBy).userName && W.model.users.get(item.attributes.updatedBy).userName.match(/^waze-maint-bot/i) !== null) {
				bannButt.wazeBot.active = true;
			}
			
			// RPP Locking option for R3+
			if (item.attributes.residential) {   
				if (devUser || betaUser || usrRank > 2) {  // Allow residential point locking by R3+
					RPPLockString = 'Lock at <select id="RPPLockLevel">';
					var ddlSelected = false;
					for (var llix=1; llix<6; llix++) {
						if (llix < usrRank+1) {
							if ( !ddlSelected && (defaultLockLevel === llix - 1 || llix === usrRank) ) {
								RPPLockString += '<option value="'+llix+'" selected="selected">'+llix+'</option>';
								ddlSelected = true;
							} else {
								RPPLockString += '<option value="'+llix+'">'+llix+'</option>';
							}
						}
					}
					RPPLockString += '</select>';
					bannButt.lockRPP.message = 'Current lock: '+ (parseInt(item.attributes.lockRank)+1) +'. '+RPPLockString+' ?';
					bannButt.lockRPP.active = true;
				}
			}
			
			// Turn off unnecessary buttons
			if (item.attributes.categories.indexOf('PHARMACY') > -1) {
				bannButt.addPharm.active = false;
			}
			if (item.attributes.categories.indexOf('SUPERMARKET_GROCERY') > -1) {
				bannButt.addSuper.active = false;
			}
			
			// Final alerts for non-severe locations
			if ( !item.attributes.residential && severityButt < 3) {
				var nameShortSpace = newName.toUpperCase().replace(/[^A-Z \']/g, '');
				if ( nameShortSpace.indexOf("'S HOUSE") > -1 || nameShortSpace.indexOf("'S HOME") > -1 || nameShortSpace.indexOf("'S WORK") > -1) {
					if ( !containsAny(newCategories,['RESTAURANT','DESSERT','BAR']) && !PNHNameRegMatch ) {
						bannButt.resiTypeNameSoft.active = true; 
					}
				}
				if ( ["HOME","MY HOME","HOUSE","MY HOUSE","PARENTS HOUSE","CASA","MI CASA","WORK","MY WORK","MY OFFICE","MOMS HOUSE","DADS HOUSE","MOM","DAD"].indexOf( nameShortSpace ) > -1 ) {
					bannButt.resiTypeName.active = true;
					if (currentWL.resiTypeName) {
						bannButt.resiTypeName.WLactive = false;
					}
					bannButt.resiTypeNameSoft.active = false;
				}
				if ( item.attributes.description.toLowerCase().indexOf('google') > -1 || item.attributes.description.toLowerCase().indexOf('yelp') > -1 ) {
					bannButt.suspectDesc.active = true;
					if (currentWL.suspectDesc) {
						bannButt.suspectDesc.WLactive = false;
					}
				}
				
				// ### Review the ones below here
				/*
				if (newName === "UPS") {
					sidebarMessageOld.push("If this is a 'UPS Store' location, please change the name to The UPS Store and run the script again.");
					severity = Math.max(1, severity);
				}
				if (newName === "FedEx") {
					sidebarMessageOld.push("If this is a FedEx Office location, please change the name to FedEx Office and run the script again.");
					severity = Math.max(1, severity);
				}
				*/
				
			}
			
			// Return severity for highlighter (no dupe run))
			if (hpMode.hlFlag) {
				// get severities from the banners
				severityButt = 0;
				for ( var tempKey in bannButt ) {  
					if ( bannButt.hasOwnProperty(tempKey) && bannButt[tempKey].hasOwnProperty('active') && bannButt[tempKey].active ) {  //  If the particular message is active
						if ( bannButt[tempKey].hasOwnProperty('WLactive') ) {
							if ( bannButt[tempKey].WLactive ) {  // If there's a WL option, enable it
								severityButt = Math.max(bannButt[tempKey].severity, severityButt);
//								if ( bannButt[tempKey].severity > 0) {
//									phlogdev('Issue with '+item.attributes.name+': '+tempKey);
//									phlogdev('Severity: '+bannButt[tempKey].severity);
//								}
							}
						} else {
							severityButt = Math.max(bannButt[tempKey].severity, severityButt);
//							if ( bannButt[tempKey].severity > 0) {
//								phlogdev('Issue with '+item.attributes.name+': '+tempKey);
//								phlogdev('Severity: '+bannButt[tempKey].severity);
//							}
						} 
					}
					
				}
				//phlogdev('calculated in harmGo: ' +severityButt + '; ' + item.attributes.name);
				
				// Special case flags
				if ( item.attributes.categories.indexOf("PARKING_LOT") > -1 && item.attributes.lockRank < levelToLock ) {
					severityButt = 4;
				}
				if ( item.isPoint() && item.attributes.lockRank < levelToLock && (item.attributes.categories.indexOf("HOSPITAL_MEDICAL_CARE") > -1 || item.attributes.categories.indexOf("GAS_STATION") > -1) ) {
					severityButt = 5;
				}
				
				if ( severityButt === 0 && hlLockFlag ) {
					severityButt = 'lock';
				}
				if ( severityButt === 1 && hlLockFlag ) {
					severityButt = 'lock1';
				}
				if ( item.attributes.adLocked ) {
					severityButt = 'adLock';
				}
				
				return severityButt;
			}
			
			// *** Below here is for harmonization only.  HL ends in previous step.
			
			// Run nearby duplicate place finder function
			var dupeBannMess = '', dupesFound = false;
			dupeHNRangeList = [];
			bannDupl = {};
			if (newName.replace(/[^A-Za-z0-9]/g,'').length > 0 && !item.attributes.residential) {
				if ( $("#WMEPH-DisableDFZoom" + devVersStr).prop('checked') ) {  // don't zoom and pan for results outside of FOV
					duplicateName = findNearbyDuplicate(newName, newAliases, item, false);
				} else {
					duplicateName = findNearbyDuplicate(newName, newAliases, item, true);
				}
				if (duplicateName[1]) {
					bannButt.overlapping.active = true;
				}
				duplicateName = duplicateName[0];
				if (duplicateName.length > 0) {
					if (duplicateName.length+1 !== dupeIDList.length && devUser) {  // If there's an issue with the data return, allow an error report
						if (confirm('WMEPH: Dupefinder Error!\nClick OK to report this') ) {  // if the category doesn't translate, then pop an alert that will make a forum post to the thread
							forumMsgInputs = {
								subject: 'Re: WMEPH Bug report',
								message: 'Script version: ' + WMEPHversion + devVersStr + '\nPermalink: ' + placePL + '\nPlace name: ' + item.attributes.name + '\nCountry: ' + addr.country.name + '\n--------\nDescribe the error:\nDupeID mismatch with dupeName list',
							};
							WMEPH_errorReport(forumMsgInputs);
						}
					} else { 
						dupesFound = true;
						dupeBannMess = 'Possible duplicate: ';
						if (duplicateName.length > 1) {
							dupeBannMess = 'Possible duplicates: ';
						}
						for (var ijx=1; ijx<duplicateName.length+1; ijx++) {
							bannDupl[dupeIDList[ijx]] = {
								active: true, severity: 2, message: "&nbsp-- " + duplicateName[ijx-1],
								WLactive: false, WLvalue: wlButtText, WLtitle: 'Whitelist Duplicate',
								WLaction: function(dID) {
									wlKeyName = 'dupeWL';
									if (!venueWhitelist.hasOwnProperty(itemID)) {  // If venue is NOT on WL, then add it.
										venueWhitelist[itemID] = { dupeWL: [] };
									}
									if (!venueWhitelist[itemID].hasOwnProperty(wlKeyName)) {  // If dupeWL key is not in venue WL, then initialize it.
										venueWhitelist[itemID][wlKeyName] = [];
									}
									venueWhitelist[itemID].dupeWL.push(dID);  // WL the id for the duplicate venue
									venueWhitelist[itemID].dupeWL = uniq(venueWhitelist[itemID].dupeWL);
									// Make an entry for the opposite item
									if (!venueWhitelist.hasOwnProperty(dID)) {  // If venue is NOT on WL, then add it.
										venueWhitelist[dID] = { dupeWL: [] };
									}
									if (!venueWhitelist[dID].hasOwnProperty(wlKeyName)) {  // If dupeWL key is not in venue WL, then initialize it.
										venueWhitelist[dID][wlKeyName] = [];
									}
									venueWhitelist[dID].dupeWL.push(itemID);  // WL the id for the duplicate venue
									venueWhitelist[dID].dupeWL = uniq(venueWhitelist[dID].dupeWL);
									saveWL_LS(compressedWLLS);  // Save the WL to local storage
									WMEPH_WLCounter();
									bannButt2.clearWL.active = true;
									bannDupl[dID].active = false;
									harmonizePlaceGo(item,'harmonize');
								}
							};
							if ( venueWhitelist.hasOwnProperty(itemID) && venueWhitelist[itemID].hasOwnProperty('dupeWL') && venueWhitelist[itemID].dupeWL.indexOf(dupeIDList[ijx]) > -1 ) {  // if the dupe is on the whitelist then remove it from the banner
								bannDupl[dupeIDList[ijx]].active = false;
							} else {  // Otherwise, activate the WL button
								bannDupl[dupeIDList[ijx]].WLactive = true;
							}
						}  // END loop for duplicate venues
					}
				}
			}
			
			// Check HN range (this depends on the returned dupefinder data, so has to run after it)
			if (dupeHNRangeList.length > 3) {
				var dhnix, dupeHNRangeListSorted = [];
				sortWithIndex(dupeHNRangeDistList);
				for (dhnix = 0; dhnix < dupeHNRangeList.length; dhnix++) {
					dupeHNRangeListSorted.push(dupeHNRangeList[ dupeHNRangeDistList.sortIndices[dhnix] ]);
				}
				// Calculate HN/distance ratio with other venues
				// var sumHNRatio = 0;
				var arrayHNRatio = [];
				for (dhnix = 0; dhnix < dupeHNRangeListSorted.length; dhnix++) {
					arrayHNRatio.push(Math.abs( (parseInt(item.attributes.houseNumber) - dupeHNRangeListSorted[dhnix]) / dupeHNRangeDistList[dhnix] ));
				}
				sortWithIndex(arrayHNRatio);
				// Examine either the median or the 8th index if length is >16
				var arrayHNRatioCheckIX = Math.min(Math.round(arrayHNRatio.length/2), 8);  
				if (arrayHNRatio[arrayHNRatioCheckIX] > 1.4) {
					bannButt.HNRange.active = true;
					if (currentWL.HNRange) {
						bannButt.HNRange.WLactive = false;
					}
					if (arrayHNRatio[arrayHNRatioCheckIX] > 5) {
						bannButt.HNRange.severity = 3;
					}
					// show stats if HN out of range
					phlogdev('HNs: ' + dupeHNRangeListSorted);
					phlogdev('Distances: ' + dupeHNRangeDistList);
					phlogdev('arrayHNRatio: ' + arrayHNRatio);
					phlogdev('HN Ratio Score: ' + arrayHNRatio[Math.round(arrayHNRatio.length/2)]);
				}
			}
			
			// Turn on website linking button if there is a url
			if (newURL !== null && newURL !== "") {
				bannButt.PlaceWebsite.active = true;
			}
			
			
			// Highlight the changes made
			higlightChangedFields(fieldUpdateObject,hpMode);
			
			// Assemble the banners
			assembleBanner();  // Make Messaging banners
				
			
			
		}  // END harmonizePlaceGo function
		
		// **** vvv Function definitions vvv ****
		
		// highlight changed fields
		function higlightChangedFields(fieldUpdateObject,hpMode) {
			
			if (hpMode.harmFlag) {
				//var panelFields = {};
				getPanelFields();
				var tab1HL = false;
				var tab2HL = false;
				//phlogdev(fieldUpdateObject);
				if (fieldUpdateObject.name) {
					$('.form-control')[panelFields.name].style="background-color:"+fieldUpdateObject.name;
					tab1HL = true;
				}
				if (fieldUpdateObject.aliases) {
					$('.alias-name')[0].style="background-color:"+fieldUpdateObject.aliases;
					tab1HL = true;
				}
				if (fieldUpdateObject.categories) {
					$('.select2-choices')[0].style="background-color:"+fieldUpdateObject.categories;
					tab1HL = true;
				}
				if (fieldUpdateObject.brand) {
					$('.form-control')[panelFields.brand].style="background-color:"+fieldUpdateObject.brand;
					tab1HL = true;
				}
				if (fieldUpdateObject.description) {
					$('.form-control')[panelFields.description].style="background-color:"+fieldUpdateObject.description;
					tab1HL = true;
				}
				if (fieldUpdateObject.lockRank) {
					$('.form-control')[panelFields.lockRank].style="background-color:"+fieldUpdateObject.lockRank;
					tab1HL = true;
				}
				if (fieldUpdateObject.address) {
					$('.address-edit')[0].style='background-color:'+fieldUpdateObject.address;
					tab1HL = true;
				}
				
				if (fieldUpdateObject.url) {
					$('.form-control')[panelFields.url].style="background-color:"+fieldUpdateObject.url;
					tab2HL = true;
				}
				if (fieldUpdateObject.phone) {
					$('.form-control')[panelFields.phone].style="background-color:"+fieldUpdateObject.phone;
					tab2HL = true;
				}
				if (fieldUpdateObject.openingHours) {
					$('.opening-hours')[0].style="background-color:#dfd";
					tab2HL = true;
				}
				if (fieldUpdateObject.services.VALLET_SERVICE) {
					$('.service-checkbox')[0].style="background-color:#dfd";
					tab2HL = true;
				}
				if (fieldUpdateObject.services.DRIVETHROUGH) {
					$('.service-checkbox')[1].style="background-color:#dfd";
					tab2HL = true;
				}
				if (fieldUpdateObject.services.WI_FI) {
					$('.service-checkbox')[2].style="background-color:#dfd";
					tab2HL = true;
				}
				if (fieldUpdateObject.services.RESTROOMS) {
					$('.service-checkbox')[3].style="background-color:#dfd";
					tab2HL = true;
				}
				if (fieldUpdateObject.services.CREDIT_CARDS) {
					$('.service-checkbox')[4].style="background-color:#dfd";
					tab2HL = true;
				}
				if (fieldUpdateObject.services.RESERVATIONS) {
					$('.service-checkbox')[5].style="background-color:#dfd";
					tab2HL = true;
				}
				if (fieldUpdateObject.services.OUTSIDE_SEATING) {
					$('.service-checkbox')[6].style="background-color:#dfd";
					tab2HL = true;
				}
				if (fieldUpdateObject.services.AIR_CONDITIONING) {
					$('.service-checkbox')[7].style="background-color:#dfd";
					tab2HL = true;
				}
				if (fieldUpdateObject.services.PARKING_FOR_CUSTOMERS) {
					$('.service-checkbox')[8].style="background-color:#dfd";
					tab2HL = true;
				}
				if (fieldUpdateObject.services.DELIVERIES) {
					$('.service-checkbox')[9].style="background-color:#dfd";
					tab2HL = true;
				}
				if (fieldUpdateObject.services.TAKE_AWAY) {
					$('.service-checkbox')[10].style="background-color:#dfd";
					tab2HL = true;
				}
				if (fieldUpdateObject.services.WHEELCHAIR_ACCESSIBLE) {
					$('.service-checkbox')[11].style="background-color:#dfd";
					tab2HL = true;
				}
				
				var placeNavTabs = $('.nav');
				for (pfix=0; pfix<placeNavTabs.length; pfix++) {
					pfa = placeNavTabs[pfix].innerHTML;
					if (pfa.indexOf('landmark-edit') > -1) {
						panelFieldsList = placeNavTabs[pfix].children;
						panelFields.navTabsIX = pfix;
						break;
					}
				}
				for (pfix=0; pfix<panelFieldsList.length; pfix++) {
					pfa = panelFieldsList[pfix].innerHTML;
					if (pfa.indexOf('landmark-edit-general') > -1) {
						panelFields.navTabGeneral = pfix;
					}
					if (pfa.indexOf('landmark-edit-more') > -1) {
						panelFields.navTabMore = pfix;
					}
				}
				
				if (tab1HL) {
					$('.nav')[panelFields.navTabsIX].children[panelFields.navTabGeneral].children[0].style='background-color:#dfd';
				}
				if (tab2HL) {
					$('.nav')[panelFields.navTabsIX].children[panelFields.navTabMore].children[0].style='background-color:#dfd';
				}
				
				
				
			}
		}
		
		
		// Set up banner messages
		function assembleBanner() {
			phlogdev('Building banners');
			// push together messages from active banner messages
			var sidebarMessage = [], sidebarTools = [];  // Initialize message array
			var tempKey, strButt1, dupesFound = false;
			severityButt = 0;
			
			// Setup duplicates banners
			strButt1 = 'Possible duplicates: ';
			for ( tempKey in bannDupl ) {
				if (bannDupl.hasOwnProperty(tempKey) && bannDupl[tempKey].hasOwnProperty('active') && bannDupl[tempKey].active) {
					dupesFound = true;
					strButt1 += '<br>' + bannDupl[tempKey].message;
					if (bannDupl[tempKey].hasOwnProperty('action')) {
						// Nothing happening here yet.
					} 
					if (bannDupl[tempKey].hasOwnProperty('WLactive') && bannDupl[tempKey].WLactive && bannDupl[tempKey].hasOwnProperty('WLaction') ) {  // If there's a WL option, enable it
						severityButt = Math.max(bannDupl[tempKey].severity, severityButt);
						strButt1 += ' <input class="btn btn-success btn-xs wmephwl-btn" id="WMEPH_WL' + tempKey + '" title="' + bannDupl[tempKey].WLtitle + '" type="button" value="' + bannDupl[tempKey].WLvalue + '">';
					}
				}
			}
			if (dupesFound) {  // if at least 1 dupe
				sidebarMessage.push(strButt1);
			}
			
			// Build banners above the Services 
			for ( tempKey in bannButt ) {  
				if ( bannButt.hasOwnProperty(tempKey) && bannButt[tempKey].hasOwnProperty('active') && bannButt[tempKey].active ) {  //  If the particular message is active
					strButt1 = bannButt[tempKey].message;
					if (bannButt[tempKey].hasOwnProperty('action')) {
						strButt1 += ' <input class="btn btn-default btn-xs wmeph-btn" id="WMEPH_' + tempKey + '" title="' + bannButt[tempKey].title + '" type="button" value="' + bannButt[tempKey].value + '"></input>';
						if (tempKey === 'noHours') {
							strButt1 += ' <input class="btn btn-default btn-xs wmeph-btn" id="WMEPH_' + tempKey + 'A2" title="' + bannButt[tempKey].title2 + '" type="button" value="' + bannButt[tempKey].value2 + '"></input>';
						}
					} 
					if ( bannButt[tempKey].hasOwnProperty('WLactive') ) {
						if ( bannButt[tempKey].WLactive && bannButt[tempKey].hasOwnProperty('WLaction') ) {  // If there's a WL option, enable it
							severityButt = Math.max(bannButt[tempKey].severity, severityButt);
							strButt1 += bannButt[tempKey].WLmessage + ' <input class="btn btn-success btn-xs wmephwl-btn" id="WMEPH_WL' + tempKey + '" title="' + bannButt[tempKey].WLtitle + '" type="button" value="WL">';
							//strButt1 += bannButt[tempKey].WLmessage + ' <input class="fa fa-check-square" id="WMEPH_WL' + tempKey + '" title="' + bannButt[tempKey].WLtitle + '" type="button" style="color:green;" >';
							//strButt1 += bannButt[tempKey].WLmessage + ' <button class="btn btn-default btn-xs wmephwl-btn" id="WMEPH_WL' + tempKey + '" title="' + bannButt[tempKey].WLtitle + '" type="button" ><i class="fa fa-check-square" style="color:green;></i></button>';
						}
					} else {
						severityButt = Math.max(bannButt[tempKey].severity, severityButt);
					} 
					sidebarMessage.push(strButt1);
				}
			}
			if ( $("#WMEPH-ColorHighlighting" + devVersStr).prop('checked') ) {
				item = W.selectionManager.selectedItems[0].model;
				item.attributes.wmephSeverity = severityButt;
			}
			
			// setup Add Service Buttons for suggested services
			var sidebarServButts = '', servButtHeight = '27', greyOption;
			for ( tempKey in bannServ ) {  
				if ( bannServ.hasOwnProperty(tempKey) && bannServ[tempKey].hasOwnProperty('active') && bannServ[tempKey].active ) {  //  If the particular service is active
					if ( bannServ[tempKey].checked ) {
						greyOption = '';
					} else {
						greyOption = '-webkit-filter: opacity(.25);filter: opacity(.25);';
						//greyOption = '-webkit-filter: brightness(3); filter: brightness(3);';
					}
					//strButt1 = '&nbsp<input class="servButton" id="WMEPH_' + tempKey + '" title="' + bannServ[tempKey].title + '" type="image" style="height:' + servButtHeight + 
					//	'px;background:none;border-color: none;border-style: none;" src="https://openmerchantaccount.com/img2/' + bannServ[tempKey].icon + greyOption + '.png">';
					strButt1 = '&nbsp<input class="'+bannServ[tempKey].icon+'" id="WMEPH_' + tempKey + '" type="button" title="' + bannServ[tempKey].title + 
						'" style="border:0;background-size: contain; height:' + servButtHeight + 'px;width: '+Math.ceil(servButtHeight*bannServ[tempKey].w2hratio).toString()+'px;'+greyOption+'">';
					sidebarServButts += strButt1;
				}
			}
			if (sidebarServButts.length>0) {
				sidebarTools.push('Add services:<br>' + sidebarServButts);
			}
			
			//  Build general banners (below the Services)
			for ( tempKey in bannButt2 ) {  
				if ( bannButt2.hasOwnProperty(tempKey) && bannButt2[tempKey].hasOwnProperty('active') && bannButt2[tempKey].active ) {  //  If the particular message is active
					strButt1 = bannButt2[tempKey].message;
					if (bannButt2[tempKey].hasOwnProperty('action')) {
						strButt1 += ' <input class="btn btn-info btn-xs wmeph-btn" id="WMEPH_' + tempKey + '" title="' + bannButt2[tempKey].title + '" style="" type="button" value="' + bannButt2[tempKey].value + '">';
					} 
					sidebarTools.push(strButt1);
					severityButt = Math.max(bannButt2[tempKey].severity, severityButt);
				}
			}
			
			// Add banner indicating that it's the beta version
			if (isDevVersion) {
				sidebarTools.push('WMEPH Beta');
			} 
			
			// Post the banners to the sidebar
			displayTools( sidebarTools.join("<li>") );
			displayBanners(sidebarMessage.join("<li>"), severityButt );
			
			// Set up Duplicate onclicks
			if ( dupesFound ) {
				setupButtons(bannDupl);
			}
			// Setup bannButt onclicks
			setupButtons(bannButt);
			// Setup bannServ onclicks
			setupButtons(bannServ);
			// Setup bannButt2 onclicks
			setupButtons(bannButt2);
			
			if (bannButt.noHours.active) {
				var button = document.getElementById('WMEPH_noHoursA2');
				button.onclick = function() {
					bannButt.noHours.action2();
					assembleBanner();
				};
			}
			
			// If pressing enter in the HN entry box, add the HN
			$("#WMEPH-HNAdd"+devVersStr).keyup(function(event){
				if( event.keyCode === 13 && $('#WMEPH-HNAdd'+devVersStr).val() !== '' ){
					$("#WMEPH_hnMissing").click();
				}
			});
			
			// If pressing enter in the phone entry box, add the HN
			$("#WMEPH-PhoneAdd"+devVersStr).keyup(function(event){
				if( event.keyCode === 13 && $('#WMEPH-PhoneAdd'+devVersStr).val() !== '' ){
					$("#WMEPH_phoneMissing").click();
				}
			});
			
			// If pressing enter in the hours entry box, parse the entry
			$("#WMEPH-HoursPaste"+devVersStr).keyup(function(event){
				if( event.keyCode === 13 && $('#WMEPH-HoursPaste'+devVersStr).val() !== '' ){
					$("#WMEPH_noHours").click();
				}
			});
			$("#WMEPH-HoursPaste"+devVersStr).click(function(){
				if (this.value === 'Paste Hours Here' || this.value === 'Can\'t parse, try again') {
					this.value = '';
				}
				this.style.color = 'black';
			}).blur(function(){
				if ( this.value === '') {
					this.value = 'Paste Hours Here';
					this.style.color = '#999';
				}
			});
		}  // END assemble Banner function
		
		// Button onclick event handler
		function setupButtons(b) {
			for ( var tempKey in b ) {  // Loop through the banner possibilities
				if ( b.hasOwnProperty(tempKey) && b[tempKey].active ) {  //  If the particular message is active
					if (b[tempKey].hasOwnProperty('action')) {  // If there is an action, set onclick 
						buttonAction(b, tempKey);
					}
					// If there's a WL option, set up onclick
					if ( b[tempKey].hasOwnProperty('WLactive') && b[tempKey].WLactive && b[tempKey].hasOwnProperty('WLaction') ) {  
						buttonWhitelist(b, tempKey);
					}
				}
			}
		}  // END setupButtons function
		
		function buttonAction(b,bKey) {
			var button = document.getElementById('WMEPH_'+bKey);
			button.onclick = function() {
				b[bKey].action();
				assembleBanner();
			};
			return button;
		}
		function buttonWhitelist(b,bKey) {
			var button = document.getElementById('WMEPH_WL'+bKey);
			button.onclick = function() {
				if ( bKey.match(/^\d{5,}/) !== null ) {
					b[bKey].WLaction(bKey);
				} else {
					b[bKey].WLaction();
				}
				b[bKey].WLactive = false;
				b[bKey].severity = 0;
				assembleBanner();
			};
			return button;
		}
		
		
		// Setup div for banner messages and color 
		function displayBanners(sbm,sev) {
			if ($('#WMEPH_banner').length === 0 ) {
				$('<div id="WMEPH_banner">').css({"width": "100%", "background-color": "#fff", "color": "white", "font-size": "15px", "font-weight": "bold", "padding": "3px", "margin-left": "auto", "margin-right": "auto"}).prependTo(".contents");
			} else {
				$('#WMEPH_banner').empty();
			}
			if (sev === 0) {
				$('#WMEPH_banner').css({"background-color": "rgb(36, 172, 36)"});
			}
			if (sev === 1) {
				$('#WMEPH_banner').css({"background-color": "rgb(50, 50, 230)"});
			}
			if (sev === 2) {
				$('#WMEPH_banner').css({"background-color": "rgb(217, 173, 42)"});
			}
			if (sev === 3) {
				$('#WMEPH_banner').css({"background-color": "rgb(211, 48, 48)"});
			}
			sbm = "<li>" + sbm;
			$("#WMEPH_banner").append(sbm);
			$('#select2-drop').css({display:'none'});
		}  // END displayBanners funtion
		
		// Setup div for banner messages and color 
		function displayTools(sbm) {
			if ($('#WMEPH_tools').length === 0 ) {
				$('<div id="WMEPH_tools">').css({"width": "100%", "background-color": "#eee", "color": "black", "font-size": "15px", "font-weight": "bold", "padding": "3px", "margin-left": "auto", "margin-right": "auto"}).prependTo(".contents");
			} else {
				$('#WMEPH_tools').empty();
			}
			sbm = "<li>" + sbm;
			$("#WMEPH_tools").append(sbm);
			$('#select2-drop').css({display:'none'});
		}  // END displayBanners funtion
		
		// CSS setups
		var cssCode = [
			".btn.wmeph-btn {padding: 0px 3px}",
			".btn.wmephwl-btn {padding: 0px 1px}"
			];
		for (var cssix=0; cssix<cssCode.length; cssix++) {
			insertCss(cssCode[cssix]);
		}
		
		// Display run button on place sidebar 
		function displayRunButton() {
			var betaDelay = 0;
			if (isDevVersion) { betaDelay = 30; }
			setTimeout(function() {
				if ($('#WMEPH_runButton').length === 0 ) {
					$('<div id="WMEPH_runButton">').css({"padding-bottom": "6px", "padding-top": "3px", "width": "290", "background-color": "#FFF", "color": "black", "font-size": "15px", "font-weight": "bold", "margin-left": "auto", "margin-right": "auto"}).prependTo(".contents");
				} 
				if ($('#runWMEPH'+devVersStr).length === 0 ) {
					var strButt1 = '<input class="btn btn-primary" id="runWMEPH'+devVersStr+'" title="Run WMEPH'+devVersStrSpace+' on Place" type="button" value="Run WMEPH'+devVersStrSpace+'">';
					$("#WMEPH_runButton").append(strButt1);
				}
				var btn = document.getElementById("runWMEPH"+devVersStr); 
				if (btn !== null) {
					btn.onclick = function() {
						harmonizePlace();
					};
				} else {
					setTimeout(bootstrapRunButton,100);
				}
				if ( W.selectionManager.selectedItems.length === 1 ) {
					item = W.selectionManager.selectedItems[0].model;
					if ( item.attributes.categories.length === 1 && item.attributes.categories[0] === 'SHOPPING_AND_SERVICES' ) {
						$('.suggested-categories').remove();
					}
				}
			}, betaDelay);
		}  // END displayRunButton funtion
		
		// WMEPH Clone Tool 
		function displayCloneButton() {
			var betaDelay = 80;
			if (isDevVersion) { betaDelay = 300; }
			setTimeout(function() {
				if ($('#WMEPH_runButton').length === 0 ) {
					$('<div id="WMEPH_runButton">').css({"padding-bottom": "6px", "padding-top": "3px", "width": "290", "background-color": "#FFF", "color": "black", "font-size": "15px", "font-weight": "bold", "margin-left": "auto", "margin-right": "auto"}).prependTo(".contents");
				} 
				var strButt1, btn;
				item = W.selectionManager.selectedItems[0].model;
				var openPlaceWebsiteURL = item.attributes.url;
							
				if (openPlaceWebsiteURL !== null && openPlaceWebsiteURL.replace(/[^A-Za-z0-9]/g,'').length > 2 && (thisUser.userName === 't0cableguy' || thisUser.userName === 'bmtg') ) {
					if ($('#WMEPHurl').length === 0 ) {
						strButt1 = '<br><input class="btn btn-success btn-xs" id="WMEPHurl" title="Open place URL" type="button" value="Open URL">';
						$("#WMEPH_runButton").append(strButt1);
					}
					btn = document.getElementById("WMEPHurl"); 
					if (btn !== null) {
						btn.onclick = function() {
							if (openPlaceWebsiteURL.match(/^http/i) === null) {
								openPlaceWebsiteURL = 'http:\/\/'+openPlaceWebsiteURL;
							}
							if ( $("#WMEPH-WebSearchNewTab" + devVersStr).prop('checked') ) {
									window.open(openPlaceWebsiteURL);
							} else {
									window.open(openPlaceWebsiteURL, searchResultsWindowName, searchResultsWindowSpecs);
							}
						};
					} else {
						setTimeout(bootstrapRunButton,100);
					}
				}
				if ($('#clonePlace').length === 0 ) {
					strButt1 = '<div style="margin-bottom: 3px;"></div><input class="btn btn-warning btn-xs wmeph-btn" id="clonePlace" title="Copy place info" type="button" value="Copy">'+
						' <input class="btn btn-warning btn-xs wmeph-btn" id="pasteClone" title="Apply the Place info. (Ctrl-Alt-O)" type="button" value="Paste (for checked boxes):"><br>';
					$("#WMEPH_runButton").append(strButt1);
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPhn', 'HN');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPstr', 'Str');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPcity', 'City');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPurl', 'URL');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPph', 'Ph');
					$("#WMEPH_runButton").append('<br>');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPdesc', 'Desc');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPserv', 'Serv');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPhrs', 'Hrs');
					strButt1 = '<input class="btn btn-info btn-xs wmeph-btn" id="checkAllClone" title="Check all" type="button" value="All">'+
						' <input class="btn btn-info btn-xs wmeph-btn" id="checkAddrClone" title="Check Address" type="button" value="Addr">'+
						' <input class="btn btn-info btn-xs wmeph-btn" id="checkNoneClone" title="Check none" type="button" value="None"><br>';
					$("#WMEPH_runButton").append(strButt1);
				}
				btn = document.getElementById("clonePlace"); 
				if (btn !== null) {
					btn.onclick = function() {
						item = W.selectionManager.selectedItems[0].model;
						cloneMaster = {};
						cloneMaster.addr = item.getAddress();
						if ( cloneMaster.addr.hasOwnProperty('attributes') ) {
							cloneMaster.addr = cloneMaster.addr.attributes;
						}
						cloneMaster.houseNumber = item.attributes.houseNumber;
						cloneMaster.url = item.attributes.url;
						cloneMaster.phone = item.attributes.phone;
						cloneMaster.description = item.attributes.description;
						cloneMaster.services = item.attributes.services;
						cloneMaster.openingHours = item.attributes.openingHours;
						phlogdev('Place Cloned');
					};
				} else {
					setTimeout(bootstrapRunButton,100);
					return;
				}
				btn = document.getElementById("pasteClone"); 
				if (btn !== null) {
					btn.onclick = function() {
						clonePlace();
					};
				} else {
					setTimeout(bootstrapRunButton,100);
				}
				btn = document.getElementById("checkAllClone"); 
				if (btn !== null) {
					btn.onclick = function() {
						if ( !$("#WMEPH_CPhn").prop('checked') ) { $("#WMEPH_CPhn").trigger('click'); }
						if ( !$("#WMEPH_CPstr").prop('checked') ) { $("#WMEPH_CPstr").trigger('click'); }
						if ( !$("#WMEPH_CPcity").prop('checked') ) { $("#WMEPH_CPcity").trigger('click'); }
						if ( !$("#WMEPH_CPurl").prop('checked') ) { $("#WMEPH_CPurl").trigger('click'); }
						if ( !$("#WMEPH_CPph").prop('checked') ) { $("#WMEPH_CPph").trigger('click'); }
						if ( !$("#WMEPH_CPserv").prop('checked') ) { $("#WMEPH_CPserv").trigger('click'); }
						if ( !$("#WMEPH_CPdesc").prop('checked') ) { $("#WMEPH_CPdesc").trigger('click'); }
						if ( !$("#WMEPH_CPhrs").prop('checked') ) { $("#WMEPH_CPhrs").trigger('click'); }
					};
				} else {
					setTimeout(bootstrapRunButton,100);
				}
				btn = document.getElementById("checkAddrClone"); 
				if (btn !== null) {
					btn.onclick = function() {
						if ( !$("#WMEPH_CPhn").prop('checked') ) { $("#WMEPH_CPhn").trigger('click'); }
						if ( !$("#WMEPH_CPstr").prop('checked') ) { $("#WMEPH_CPstr").trigger('click'); }
						if ( !$("#WMEPH_CPcity").prop('checked') ) { $("#WMEPH_CPcity").trigger('click'); }
						if ( $("#WMEPH_CPurl").prop('checked') ) { $("#WMEPH_CPurl").trigger('click'); }
						if ( $("#WMEPH_CPph").prop('checked') ) { $("#WMEPH_CPph").trigger('click'); }
						if ( $("#WMEPH_CPserv").prop('checked') ) { $("#WMEPH_CPserv").trigger('click'); }
						if ( $("#WMEPH_CPdesc").prop('checked') ) { $("#WMEPH_CPdesc").trigger('click'); }
						if ( $("#WMEPH_CPhrs").prop('checked') ) { $("#WMEPH_CPhrs").trigger('click'); }
					};
				} else {
					setTimeout(bootstrapRunButton,100);
				}
				btn = document.getElementById("checkNoneClone"); 
				if (btn !== null) {
					btn.onclick = function() {
						if ( $("#WMEPH_CPhn").prop('checked') ) { $("#WMEPH_CPhn").trigger('click'); }
						if ( $("#WMEPH_CPstr").prop('checked') ) { $("#WMEPH_CPstr").trigger('click'); }
						if ( $("#WMEPH_CPcity").prop('checked') ) { $("#WMEPH_CPcity").trigger('click'); }
						if ( $("#WMEPH_CPurl").prop('checked') ) { $("#WMEPH_CPurl").trigger('click'); }
						if ( $("#WMEPH_CPph").prop('checked') ) { $("#WMEPH_CPph").trigger('click'); }
						if ( $("#WMEPH_CPserv").prop('checked') ) { $("#WMEPH_CPserv").trigger('click'); }
						if ( $("#WMEPH_CPdesc").prop('checked') ) { $("#WMEPH_CPdesc").trigger('click'); }
						if ( $("#WMEPH_CPhrs").prop('checked') ) { $("#WMEPH_CPhrs").trigger('click'); }
					};
				} else {
					setTimeout(bootstrapRunButton,100);
				}
			}, betaDelay);
		}  // END displayCloneButton funtion
		
		
		
		// Catch PLs and reloads that have a place selected already and limit attempts to about 10 seconds
		function bootstrapRunButton() {
			if (numAttempts < 10) {
				numAttempts++;
				if (W.selectionManager.selectedItems.length === 1) {
					if (W.selectionManager.selectedItems[0].model.type === "venue") {
						displayRunButton();
						getPanelFields();
						if (localStorage.getItem("WMEPH-EnableCloneMode" + devVersStr) === '1') {
							displayCloneButton();
						}
					}
					
					
				} else {
					setTimeout(bootstrapRunButton,1000);
				}
			}
		}
		
		// Find field divs
		function getPanelFields() {
			var panelFieldsList = $('.form-control'), pfa;
			for (var pfix=0; pfix<panelFieldsList.length; pfix++) {
				pfa = panelFieldsList[pfix].name;
				if (pfa === 'name') {
					panelFields.name = pfix;
				}
				if (pfa === 'lockRank') {
					panelFields.lockRank = pfix;
				}
				if (pfa === 'description') {
					panelFields.description = pfix;
				}
				if (pfa === 'url') {
					panelFields.url = pfix;
				}
				if (pfa === 'phone') {
					panelFields.phone = pfix;
				}
				if (pfa === 'brand') {
					panelFields.brand = pfix;
				}
			}
			var placeNavTabs = $('.nav');
			for (pfix=0; pfix<placeNavTabs.length; pfix++) {
				pfa = placeNavTabs[pfix].innerHTML;
				if (pfa.indexOf('landmark-edit') > -1) {
					panelFieldsList = placeNavTabs[pfix].children;
					panelFields.navTabsIX = pfix;
					break;
				}
			}
			for (pfix=0; pfix<panelFieldsList.length; pfix++) {
				pfa = panelFieldsList[pfix].innerHTML;
				if (pfa.indexOf('landmark-edit-general') > -1) {
					panelFields.navTabGeneral = pfix;
				}
				if (pfa.indexOf('landmark-edit-more') > -1) {
					panelFields.navTabMore = pfix;
				}
			}
			
			
		}
		
		// Catch PLs and reloads that have a place selected already and limit attempts to about 10 seconds
		numAttempts = 0;
		function bootstrapInferAddress() {
			if (numAttempts < 20) {
				numAttempts++;
				var inferredAddress = WMEPH_inferAddress(7);
				if (!inferredAddress) {
					setTimeout(bootstrapInferAddress,500);
				} else {
					return inferredAddress;
				}
			}
		}
		
		// Function to clone info from a place
		function clonePlace() {
			phlog('Cloning info...');
			var UpdateObject = require("Waze/Action/UpdateObject");
			if (cloneMaster !== null && cloneMaster.hasOwnProperty('url')) {
				item = W.selectionManager.selectedItems[0].model;
				var cloneItems = {};
				var updateItem = false;
				if ( $("#WMEPH_CPhn").prop('checked') ) {
					cloneItems.houseNumber = cloneMaster.houseNumber;
					updateItem = true;
				}
				if ( $("#WMEPH_CPurl").prop('checked') ) {
					cloneItems.url = cloneMaster.url;
					updateItem = true;
				}
				if ( $("#WMEPH_CPph").prop('checked') ) {
					cloneItems.phone = cloneMaster.phone;
					updateItem = true;
				}
				if ( $("#WMEPH_CPdesc").prop('checked') ) {
					cloneItems.description = cloneMaster.description;
					updateItem = true;
				}
				if ( $("#WMEPH_CPserv").prop('checked') ) {
					cloneItems.services = cloneMaster.services;
					updateItem = true;
				}
				if ( $("#WMEPH_CPhrs").prop('checked') ) {
					cloneItems.openingHours = cloneMaster.openingHours;
					updateItem = true;
				}
				if (updateItem) {
					W.model.actionManager.add(new UpdateObject(item, cloneItems) );
					phlogdev('Item details cloned');
				}
				if ( $("#WMEPH_CPstr").prop('checked') ) {
					var itemStreetRepl = item.getAddress();
					itemStreetRepl.street = cloneMaster.addr.street;
					updateAddress(item, itemStreetRepl);
					phlogdev('Item street cloned');
				}
				if ( $("#WMEPH_CPcity").prop('checked') ) {
					var itemCityRepl = item.getAddress();
					itemCityRepl.city = cloneMaster.addr.city;
					itemCityRepl.state = cloneMaster.addr.state;
					updateAddress(item, itemCityRepl);
					phlogdev('Item city & state cloned');
				}
				
			} else {
				phlog('Please copy a place');
			}
		}
		
		// Pull natural text from opening hours
		function getOpeningHours(venue) {
			var formatOpeningHour = require('Waze/ViewHelpers').formatOpeningHour;
			return venue && venue.getOpeningHours && venue.getOpeningHours().map(formatOpeningHour);
		}
		// Parse hours paste for hours object array
		function parseHours(inputHours) {
			var daysOfTheWeek = {
				SS: ['saturdays', 'saturday', 'satur', 'sat', 'sa'],
				UU: ['sundays', 'sunday', 'sun', 'su'],
				MM: ['mondays', 'monday', 'mondy', 'mon', 'mo'],
				TT: ['tuesdays', 'tuesday', 'tues', 'tue', 'tu'],
				WW: ['wednesdays', 'wednesday', 'weds', 'wed', 'we'],
				RR: ['thursdays', 'thursday', 'thurs', 'thur', 'thu', 'th'],
				FF: ['fridays', 'friday', 'fri', 'fr']
			};
			var monthsOfTheYear = {
				JAN: ['january', 'jan'],
				FEB: ['february', 'febr', 'feb'],
				MAR: ['march', 'mar'],
				APR: ['april', 'apr'],
				MAY: ['may', 'may'],
				JUN: ['june', 'jun'],
				JUL: ['july', 'jul'],
				AUG: ['august', 'aug'],
				SEP: ['september', 'sept', 'sep'],
				OCT: ['october', 'oct'],
				NOV: ['november', 'nov'],
				DEC: ['december', 'dec']
			};
			var dayCodeVec = ['MM','TT','WW','RR','FF','SS','UU','MM','TT','WW','RR','FF','SS','UU','MM','TT','WW','RR','FF'];
			var tfHourTemp, tfDaysTemp, newDayCodeVec = [];
			var tempRegex, twix, tsix;
			var inputHoursParse = inputHours.toLowerCase();
			inputHoursParse = inputHoursParse.replace(/paste hours here/i, "");  // make sure something is pasted
			phlogdev(inputHoursParse);
			inputHoursParse = inputHoursParse.replace(/can\'t parse\, try again/i, "");  // make sure something is pasted
			if (inputHoursParse === '' || inputHoursParse === ',') {
				phlogdev('No hours');
				return false;
			}
			inputHoursParse = inputHoursParse.replace(/\u2013|\u2014/g, "-");  // long dash replacing
			inputHoursParse = inputHoursParse.replace(/[^a-z0-9\:\-\. ~]/g, ' ');  // replace unnecessary characters with spaces
			inputHoursParse = inputHoursParse.replace(/\:{2,}/g, ':');  // remove extra colons
			inputHoursParse = inputHoursParse.replace(/closed/g, '99:99-99:99').replace(/not open/g, '99:99-99:99');  // parse 'closed'
			inputHoursParse = inputHoursParse.replace(/by appointment only/g, '99:99-99:99').replace(/by appointment/g, '99:99-99:99');  // parse 'appointment only'
			inputHoursParse = inputHoursParse.replace(/weekdays/g, 'mon-fri').replace(/weekends/g, 'sat-sun');  // convert weekdays and weekends to days
			inputHoursParse = inputHoursParse.replace(/12:00 noon/g, "12:00").replace(/12:00 midnight/g, "00:00");  // replace 'noon', 'midnight'
			inputHoursParse = inputHoursParse.replace(/12 noon/g, "12:00").replace(/12 midnight/g, "00:00");  // replace 'noon', 'midnight'
			inputHoursParse = inputHoursParse.replace(/noon/g, "12:00").replace(/midnight/g, "00:00");  // replace 'noon', 'midnight'
			inputHoursParse = inputHoursParse.replace(/every day/g, "mon-sun");  // replace 'seven days a week'
			inputHoursParse = inputHoursParse.replace(/seven days a week/g, "mon-sun");  // replace 'seven days a week'
			inputHoursParse = inputHoursParse.replace(/7 days a week/g, "mon-sun");  // replace 'seven days a week'
			inputHoursParse = inputHoursParse.replace(/daily/g, "mon-sun");  // replace 'open daily'
			inputHoursParse = inputHoursParse.replace(/open 24 ?ho?u?rs?/g, "00:00-00:00");  // replace 'open 24 hour or similar'
			inputHoursParse = inputHoursParse.replace(/open twenty\-? ?four ho?u?rs?/g, "00:00-00:00");  // replace 'open 24 hour or similar'
			inputHoursParse = inputHoursParse.replace(/24 ?ho?u?rs?/g, "00:00-00:00");  // replace 'open 24 hour or similar'
			inputHoursParse = inputHoursParse.replace(/twenty\-? ?four ho?u?rs?/g, "00:00-00:00");  // replace 'open 24 hour or similar'
			inputHoursParse = inputHoursParse.replace(/(\D:)([^ ])/g, "$1 $2");  // space after colons after words
			// replace thru type words with dashes
			var thruWords = 'through|thru|to|until|till|til|-|~'.split("|");
			for (twix=0; twix<thruWords.length; twix++) {
				tempRegex = new RegExp(thruWords[twix], "g");
				inputHoursParse = inputHoursParse.replace(tempRegex,'-');
			}
			inputHoursParse = inputHoursParse.replace(/\-{2,}/g, "-");  // replace any duplicate dashes
			phlogdev('Initial parse: ' + inputHoursParse);
			
			// kill extra words
			var killWords = 'paste|here|business|operation|times|time|walk-ins|walk ins|welcome|dinner|lunch|brunch|breakfast|regular|weekday|weekend|opening|open|now|from|hours|hour|our|are|EST|and|&'.split("|");
			for (twix=0; twix<killWords.length; twix++) {
				tempRegex = new RegExp('\\b'+killWords[twix]+'\\b', "g");
				inputHoursParse = inputHoursParse.replace(tempRegex,'');
			}
			phlogdev('After kill terms: ' + inputHoursParse);
			
			// replace day terms with double caps
			for (var dayKey in daysOfTheWeek) {
				if (daysOfTheWeek.hasOwnProperty(dayKey)) {
					var tempDayList = daysOfTheWeek[dayKey];
					for (var tdix=0; tdix<tempDayList.length; tdix++) {
						tempRegex = new RegExp(tempDayList[tdix]+'(?!a-z)', "g");
						inputHoursParse = inputHoursParse.replace(tempRegex,dayKey);
					}
				}
			}
			phlogdev('Replace day terms: ' + inputHoursParse);
			
			// Replace dates
			for (var monthKey in monthsOfTheYear) {
				if (monthsOfTheYear.hasOwnProperty(monthKey)) {
					var tempMonthList = monthsOfTheYear[monthKey];
					for (var tmix=0; tmix<tempMonthList.length; tmix++) {
						tempRegex = new RegExp(tempMonthList[tmix]+'\\.? ?\\d{1,2}\\,? ?201\\d{1}', "g");
						inputHoursParse = inputHoursParse.replace(tempRegex,' ');
						tempRegex = new RegExp(tempMonthList[tmix]+'\\.? ?\\d{1,2}', "g");
						inputHoursParse = inputHoursParse.replace(tempRegex,' ');
					}
				}
			}
			phlogdev('Replace month terms: ' + inputHoursParse);
			
			// replace any periods between hours with colons
			inputHoursParse = inputHoursParse.replace(/(\d{1,2})\.(\d{2})/g, '$1:$2');
			// remove remaining periods
			inputHoursParse = inputHoursParse.replace(/\./g, '');
			// remove any non-hour colons between letters and numbers and on string ends
			inputHoursParse = inputHoursParse.replace(/(\D+)\:(\D+)/g, '$1 $2').replace(/^ *\:/g, ' ').replace(/\: *$/g, ' ');
			// replace am/pm with AA/PP
			inputHoursParse = inputHoursParse.replace(/ *pm/g,'PP').replace(/ *am/g,'AA');
			inputHoursParse = inputHoursParse.replace(/ *p\.m\./g,'PP').replace(/ *a\.m\./g,'AA');
			inputHoursParse = inputHoursParse.replace(/ *p\.m/g,'PP').replace(/ *a\.m/g,'AA');
			inputHoursParse = inputHoursParse.replace(/ *p/g,'PP').replace(/ *a/g,'AA');
			// tighten up dashes
			inputHoursParse = inputHoursParse.replace(/\- {1,}/g,'-').replace(/ {1,}\-/g,'-');
			inputHoursParse = inputHoursParse.replace(/^(00:00-00:00)$/g,'MM-UU$1');
			phlogdev('AMPM parse: ' + inputHoursParse);
			
			//  Change all MTWRFSU to doubles, if any other letters return false
			if (inputHoursParse.match(/[bcdeghijklnoqvxyz]/g) !== null) {
				phlogdev('Extra words in the string');
				return false;
			} else {
				inputHoursParse = inputHoursParse.replace(/m/g,'MM').replace(/t/g,'TT').replace(/w/g,'WW').replace(/r/g,'RR');
				inputHoursParse = inputHoursParse.replace(/f/g,'FF').replace(/s/g,'SS').replace(/u/g,'UU');
			}
			phlogdev('MM/TT format: ' + inputHoursParse);
			
			// tighten up spaces
			inputHoursParse = inputHoursParse.replace(/ {2,}/g,' ');
			inputHoursParse = inputHoursParse.replace(/ {1,}AA/g,'AA');
			inputHoursParse = inputHoursParse.replace(/ {1,}PP/g,'PP');
			// Expand hours into XX:XX format
			for (var asdf=0; asdf<5; asdf++) {  // repeat a few times to catch any skipped regex matches
				inputHoursParse = inputHoursParse.replace(/([^0-9\:])(\d{1})([^0-9\:])/g, '$10$2:00$3');
				inputHoursParse = inputHoursParse.replace(/^(\d{1})([^0-9\:])/g, '0$1:00$2');
				inputHoursParse = inputHoursParse.replace(/([^0-9\:])(\d{1})$/g, '$10$2:00');
				
				inputHoursParse = inputHoursParse.replace(/([^0-9\:])(\d{2})([^0-9\:])/g, '$1$2:00$3');
				inputHoursParse = inputHoursParse.replace(/^(\d{2})([^0-9\:])/g, '$1:00$2');
				inputHoursParse = inputHoursParse.replace(/([^0-9\:])(\d{2})$/g, '$1$2:00');
				
				inputHoursParse = inputHoursParse.replace(/(\D)(\d{1})(\d{2}\D)/g, '$10$2:$3');
				inputHoursParse = inputHoursParse.replace(/^(\d{1})(\d{2}\D)/g, '0$1:$2');
				inputHoursParse = inputHoursParse.replace(/(\D)(\d{1})(\d{2})$/g, '$10$2:$3');
				
				inputHoursParse = inputHoursParse.replace(/(\D\d{2})(\d{2}\D)/g, '$1:$2');
				inputHoursParse = inputHoursParse.replace(/^(\d{2})(\d{2}\D)/g, '$1:$2');
				inputHoursParse = inputHoursParse.replace(/(\D\d{2})(\d{2})$/g, '$1:$2');
				
				inputHoursParse = inputHoursParse.replace(/(\D)(\d{1}\:)/g, '$10$2');
				inputHoursParse = inputHoursParse.replace(/^(\d{1}\:)/g, '0$1');
			}
			
			// replace 12AM range with 00
			inputHoursParse = inputHoursParse.replace( /12(\:\d{2}AA)/g, '00$1');
			// Change PM hours to 24hr time
			while (inputHoursParse.match(/\d{2}\:\d{2}PP/) !== null) {
				tfHourTemp = inputHoursParse.match(/(\d{2})\:\d{2}PP/)[1];
				tfHourTemp = parseInt(tfHourTemp) % 12 + 12;
				inputHoursParse = inputHoursParse.replace(/\d{2}(\:\d{2})PP/,tfHourTemp.toString()+'$1');
			}
			// kill the AA
			inputHoursParse = inputHoursParse.replace( /AA/g, '');
			phlogdev('XX:XX format: ' + inputHoursParse);
			
			// Side check for tabular input
			var inputHoursParseTab = inputHoursParse.replace( /[^A-Z0-9\:-]/g, ' ').replace( / {2,}/g, ' ');
			inputHoursParseTab = inputHoursParseTab.replace( /^ +/g, '').replace( / {1,}$/g, '');
			if (inputHoursParseTab.match(/[A-Z]{2}\:?\-? [A-Z]{2}\:?\-? [A-Z]{2}\:?\-? [A-Z]{2}\:?\-? [A-Z]{2}\:?\-?/g) !== null) {
				inputHoursParseTab = inputHoursParseTab.split(' ');
				var reorderThree = [0,7,14,1,8,15,2,9,16,3,10,17,4,11,18,5,12,19,6,13,20];
				var reorderTwo = [0,7,1,8,2,9,3,10,4,11,5,12,6,13];
				var inputHoursParseReorder = [], reix;
				if (inputHoursParseTab.length === 21) {
					for (reix=0; reix<21; reix++) {
						inputHoursParseReorder.push(inputHoursParseTab[reorderThree[reix]]);
					}
				} else if (inputHoursParseTab.length === 18) {
					for (reix=0; reix<18; reix++) {
						inputHoursParseReorder.push(inputHoursParseTab[reorderThree[reix]]);
					}
				} else if (inputHoursParseTab.length === 15) {
					for (reix=0; reix<15; reix++) {
						inputHoursParseReorder.push(inputHoursParseTab[reorderThree[reix]]);
					}
				} else if (inputHoursParseTab.length === 14) {
					for (reix=0; reix<14; reix++) {
						inputHoursParseReorder.push(inputHoursParseTab[reorderTwo[reix]]);
					}
				} else if (inputHoursParseTab.length === 12) {
					for (reix=0; reix<12; reix++) {
						inputHoursParseReorder.push(inputHoursParseTab[reorderTwo[reix]]);
					}
				} else if (inputHoursParseTab.length === 10) {
					for (reix=0; reix<10; reix++) {
						inputHoursParseReorder.push(inputHoursParseTab[reorderTwo[reix]]);
					}
				} 
				//phlogdev('inputHoursParseTab: ' + inputHoursParseTab);
				phlogdev('inputHoursParseReorder: ' + inputHoursParseReorder);
				if (inputHoursParseReorder.length > 9) {
					inputHoursParseReorder = inputHoursParseReorder.join(' ');
					inputHoursParseReorder = inputHoursParseReorder.replace(/(\:\d{2}) (\d{2}\:)/g, '$1-$2');
					inputHoursParse = inputHoursParseReorder;
				}
				
			}
			
			
			// remove colons after Days field
			inputHoursParse = inputHoursParse.replace(/(\D+)\:/g, '$1 ');
			
			// Find any double sets
			inputHoursParse = inputHoursParse.replace(/([A-Z \-]{2,}) *(\d{2}\:\d{2} *\-{1} *\d{2}\:\d{2}) *(\d{2}\:\d{2} *\-{1} *\d{2}\:\d{2})/g, '$1$2$1$3');
			inputHoursParse = inputHoursParse.replace(/(\d{2}\:\d{2}) *(\d{2}\:\d{2})/g, '$1-$2');
			phlogdev('Add dash: ' + inputHoursParse);
			
			// remove all spaces
			inputHoursParse = inputHoursParse.replace( / */g, '');
			
			// Remove any dashes acting as Day separators for 3+ days ("M-W-F")
			inputHoursParse = inputHoursParse.replace( /([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})/g, '$1$2$3$4$5$6$7');
			inputHoursParse = inputHoursParse.replace( /([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})/g, '$1$2$3$4$5$6');
			inputHoursParse = inputHoursParse.replace( /([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})/g, '$1$2$3$4$5');
			inputHoursParse = inputHoursParse.replace( /([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})/g, '$1$2$3$4');
			inputHoursParse = inputHoursParse.replace( /([A-Z]{2})-([A-Z]{2})-([A-Z]{2})/g, '$1$2$3');
			
			// parse any 'through' type terms on the day ranges (MM-RR --> MMTTWWRR)
			while (inputHoursParse.match(/[A-Z]{2}\-[A-Z]{2}/) !== null) {
				tfDaysTemp = inputHoursParse.match(/([A-Z]{2})\-([A-Z]{2})/);
				var startDayIX = dayCodeVec.indexOf(tfDaysTemp[1]);
				newDayCodeVec = [tfDaysTemp[1]];
				for (var dcvix=startDayIX+1; dcvix<startDayIX+7; dcvix++) {
					newDayCodeVec.push(dayCodeVec[dcvix]);
					if (tfDaysTemp[2] === dayCodeVec[dcvix]) {
						break;
					}
				}
				newDayCodeVec = newDayCodeVec.join('');
				inputHoursParse = inputHoursParse.replace(/[A-Z]{2}\-[A-Z]{2}/,newDayCodeVec);
			}
			
			// split the string between numerical and letter characters
			inputHoursParse = inputHoursParse.replace(/([A-Z])\-?\:?([0-9])/g,'$1|$2');
			inputHoursParse = inputHoursParse.replace(/([0-9])\-?\:?([A-Z])/g,'$1|$2');
			inputHoursParse = inputHoursParse.replace(/(\d{2}\:\d{2})\:00/g,'$1');  // remove seconds
			inputHoursParse = inputHoursParse.split("|");
			phlogdev('Split: ' + inputHoursParse);
			
			var daysVec = [], hoursVec = [];
			for (tsix=0; tsix<inputHoursParse.length; tsix++) {
				if (inputHoursParse[tsix][0].match(/[A-Z]/) !== null) {
					daysVec.push(inputHoursParse[tsix]);
				} else if (inputHoursParse[tsix][0].match(/[0-9]/) !== null) {
					hoursVec.push(inputHoursParse[tsix]);
				} else {
					phlogdev('Filtering error');
					return false;
				}
			}
			
			// check that the dayArray and hourArray lengths correspond
			if ( daysVec.length !== hoursVec.length ) {
				phlogdev('Hour and Day arrays are not matched');
				return false;
			}
			
			// Combine days with the same hours in the same vector
			var newDaysVec = [], newHoursVec = [], hrsIX;
			for (tsix=0; tsix<daysVec.length; tsix++) {
				if (hoursVec[tsix] !== '99:99-99:99') {  // Don't add the closed days
					hrsIX = newHoursVec.indexOf(hoursVec[tsix]);
					if (hrsIX > -1) {
						newDaysVec[hrsIX] = newDaysVec[hrsIX] + daysVec[tsix];
					} else {
						newDaysVec.push(daysVec[tsix]);
						newHoursVec.push(hoursVec[tsix]);
					}
				}
			}
			
			var hoursObjectArray = [], hoursObjectArrayMinDay = [], hoursObjectArraySorted = [], hoursObjectAdd, daysObjArray, toFromSplit;
			for (tsix=0; tsix<newDaysVec.length; tsix++) {
				hoursObjectAdd = {};
				daysObjArray = [];
				toFromSplit = newHoursVec[tsix].match(/(\d{2}\:\d{2})\-(\d{2}\:\d{2})/);
				if (toFromSplit === null) {
					phlogdev('Hours in wrong format');
					return false;
				} else {  // Check for hours outside of 0-23 and 0-59
					var hourCheck = toFromSplit[1].match(/(\d{2})\:/)[1];
					if (hourCheck>23 || hourCheck < 0) {
						phlogdev('Not a valid time');
						return false;
					}
					hourCheck = toFromSplit[2].match(/(\d{2})\:/)[1];
					if (hourCheck>23 || hourCheck < 0) {
						phlogdev('Not a valid time');
						return false;
					}
					hourCheck = toFromSplit[1].match(/\:(\d{2})/)[1];
					if (hourCheck>59 || hourCheck < 0) {
						phlogdev('Not a valid time');
						return false;
					}
					hourCheck = toFromSplit[2].match(/\:(\d{2})/)[1];
					if (hourCheck>59 || hourCheck < 0) {
						phlogdev('Not a valid time');
						return false;
					}
				}
				// Make the days object
				if ( newDaysVec[tsix].indexOf('MM') > -1 ) {
					daysObjArray.push(1);
				}
				if ( newDaysVec[tsix].indexOf('TT') > -1 ) {
					daysObjArray.push(2);
				} 
				if ( newDaysVec[tsix].indexOf('WW') > -1 ) {
					daysObjArray.push(3);
				} 
				if ( newDaysVec[tsix].indexOf('RR') > -1 ) {
					daysObjArray.push(4);
				} 
				if ( newDaysVec[tsix].indexOf('FF') > -1 ) {
					daysObjArray.push(5);
				} 
				if ( newDaysVec[tsix].indexOf('SS') > -1 ) {
					daysObjArray.push(6);
				} 
				if ( newDaysVec[tsix].indexOf('UU') > -1 ) {
					daysObjArray.push(0);
				}
				// build the hours object
				hoursObjectAdd.fromHour = toFromSplit[1];
				hoursObjectAdd.toHour = toFromSplit[2];
				hoursObjectAdd.days = daysObjArray.sort();
				hoursObjectArray.push(hoursObjectAdd);
				// track the order
				if (hoursObjectAdd.days.length > 1 && hoursObjectAdd.days[0] === 0) {
					hoursObjectArrayMinDay.push( hoursObjectAdd.days[1] * 100 + parseInt(toFromSplit[1][0])*10 + parseInt(toFromSplit[1][1]) );
				} else {
					hoursObjectArrayMinDay.push( (((hoursObjectAdd.days[0]+6)%7)+1) * 100 + parseInt(toFromSplit[1][0])*10 + parseInt(toFromSplit[1][1]) );
				}
			}
			sortWithIndex(hoursObjectArrayMinDay);
			for (var hoaix=0; hoaix < hoursObjectArrayMinDay.length; hoaix++) {
				hoursObjectArraySorted.push(hoursObjectArray[hoursObjectArrayMinDay.sortIndices[hoaix]]);
			}
			if ( !checkHours(hoursObjectArraySorted) ) {
				phlogdev('Overlapping hours');
				return false;
			} else {
				for ( var ohix=0; ohix<hoursObjectArraySorted.length; ohix++ ) {
					phlogdev(hoursObjectArraySorted[ohix]);
					if ( hoursObjectArraySorted[ohix].days.length === 2 && hoursObjectArraySorted[ohix].days[0] === 0 && hoursObjectArraySorted[ohix].days[1] === 1) {
						// separate hours
						phlogdev('Splitting M-S entry...');
						hoursObjectArraySorted.push({days: [0], fromHour: hoursObjectArraySorted[ohix].fromHour, toHour: hoursObjectArraySorted[ohix].toHour});
						hoursObjectArraySorted[ohix].days = [1];
					}
				}	
			}
			return hoursObjectArraySorted;
		}
		
		// function to check overlapping hours
		function checkHours(hoursObj) {
			if (hoursObj.length === 1) {
				return true;
			}
			var daysObj, fromHourTemp, toHourTemp;
			for (var day2Ch=0; day2Ch<7; day2Ch++) {  // Go thru each day of the week 
				daysObj = [];
				for ( var hourSet = 0; hourSet < hoursObj.length; hourSet++ ) {  // For each set of hours
					if (hoursObj[hourSet].days.indexOf(day2Ch) > -1) {  // pull out hours that are for the current day, add 2400 if it goes past midnight, and store
						fromHourTemp = hoursObj[hourSet].fromHour.replace(/\:/g,'');
						toHourTemp = hoursObj[hourSet].toHour.replace(/\:/g,'');
						if (toHourTemp < fromHourTemp) {
							toHourTemp = parseInt(toHourTemp) + 2400;
						}
						daysObj.push([fromHourTemp, toHourTemp]);
					}
				}
				if (daysObj.length > 1) {  // If there's multiple hours for the day, check them for overlap
					for ( var hourSetCheck2 = 1; hourSetCheck2 < daysObj.length; hourSetCheck2++ ) {
						for ( var hourSetCheck1 = 0; hourSetCheck1 < hourSetCheck2; hourSetCheck1++ ) {
							if ( daysObj[hourSetCheck2][0] > daysObj[hourSetCheck1][0] && daysObj[hourSetCheck2][0] < daysObj[hourSetCheck1][1] ) {
								return false;
							}
							if ( daysObj[hourSetCheck2][1] > daysObj[hourSetCheck1][0] && daysObj[hourSetCheck2][1] < daysObj[hourSetCheck1][1] ) {
								return false;
							}
						}
					}
				}
			}
			return true;
		}
		
		// Duplicate place finder  ###bmtg
		function findNearbyDuplicate(itemName, itemAliases, item, recenterOption) {
			dupeIDList = [item.attributes.id];
			dupeHNRangeList = [];
			dupeHNRangeIDList = [];
			dupeHNRangeDistList = [];
			var venueList = W.model.venues.objects, currNameList = [], testNameList = [], testVenueAtt, testName, testNameNoNum, itemNameRF, aliasNameRF, aliasNameNoNum;
			var t0, t1, wlDupeMatch = false, wlDupeList = [], nameMatch = false, altNameMatch = -1, aliix, cnlix, tnlix, randInt = 100;
			var outOfExtent = false, mapExtent = W.map.getExtent(), padFrac = 0.15;  // how much to pad the zoomed window
			// Initialize the cooridnate extents for duplicates
			var minLon = item.geometry.getCentroid().x, minLat = item.geometry.getCentroid().y;
			var maxLon = minLon, maxLat = minLat;
			// genericterms to skip if it's all that remains after stripping numbers
			var noNumSkip = 'BANK|ATM|HOTEL|MOTEL|STORE|MARKET|SUPERMARKET|GYM|GAS|GASOLINE|GASSTATION|CAFE|OFFICE|OFFICES|CARRENTAL|RENTALCAR|RENTAL|SALON|BAR|BUILDING|LOT';
			noNumSkip = noNumSkip + '|'+ collegeAbbreviations;
			noNumSkip = noNumSkip.split('|');
			// Make the padded extent
			mapExtent.left = mapExtent.left + padFrac * (mapExtent.right-mapExtent.left);
			mapExtent.right = mapExtent.right - padFrac * (mapExtent.right-mapExtent.left);
			mapExtent.bottom = mapExtent.bottom + padFrac * (mapExtent.top-mapExtent.bottom);
			mapExtent.top = mapExtent.top - padFrac * (mapExtent.top-mapExtent.bottom);
			
			var allowedTwoLetters = ['BP','DQ','BK','BW','LQ','QT','DB','PO'];
				
			var labelFeatures = [], dupeNames = [], labelText, labelTextReformat, pt, textFeature, labelColorIX = 0;
			var labelColorList = ['#3F3'];
			// Name formatting for the WME place name 
			itemNameRF = itemName.toUpperCase().replace(/ AND /g, '').replace(/^THE /g, '').replace(/[^A-Z0-9]/g, '');  // Format name
			if ( itemNameRF.length>2 || allowedTwoLetters.indexOf(itemNameRF) > -1 ) {
				currNameList.push(itemNameRF);
			} else {
				currNameList.push('PRIMNAMETOOSHORT_PJZWX');
			}
			var itemNameNoNum = itemNameRF.replace(/[^A-Z]/g, '');  // Clear non-letter characters for alternate match ( HOLLYIVYPUB23 --> HOLLYIVYPUB )
			if ( ((itemNameNoNum.length>2 && noNumSkip.indexOf(itemNameNoNum) === -1) || allowedTwoLetters.indexOf(itemNameNoNum) > -1) && item.attributes.categories.indexOf('PARKING_LOT') === -1 ) {  //  only add de-numbered name if anything remains
				currNameList.push(itemNameNoNum);
			}
			if (itemAliases.length > 0) {
				for (aliix=0; aliix<itemAliases.length; aliix++) {
					aliasNameRF = itemAliases[aliix].toUpperCase().replace(/ AND /g, '').replace(/^THE /g, '').replace(/[^A-Z0-9]/g, '');  // Format name
					if ( (aliasNameRF.length>2 && noNumSkip.indexOf(aliasNameRF) === -1) || allowedTwoLetters.indexOf(aliasNameRF) > -1 ) {  //  only add de-numbered name if anything remains
						currNameList.push(aliasNameRF);
					}
					aliasNameNoNum = aliasNameRF.replace(/[^A-Z]/g, '');  // Clear non-letter characters for alternate match ( HOLLYIVYPUB23 --> HOLLYIVYPUB ) 
					if ( ((aliasNameNoNum.length>2 && noNumSkip.indexOf(aliasNameNoNum) === -1) || allowedTwoLetters.indexOf(aliasNameNoNum) > -1) && item.attributes.categories.indexOf('PARKING_LOT') === -1 ) {  //  only add de-numbered name if anything remains
						currNameList.push(aliasNameNoNum);
					}
				}
			}
			currNameList = uniq(currNameList);  //  remove duplicates
			
			// Remove any previous search labels and move the layer above the places layer	
			WMEPH_NameLayer.destroyFeatures();
			var vecLyrPlaces = W.map.getLayersBy("uniqueName","landmarks")[0];
			WMEPH_NameLayer.setZIndex(parseInt(vecLyrPlaces.getZIndex())+3);  // Move layer to just on top of Places layer
			
			if ( venueWhitelist.hasOwnProperty(item.attributes.id) ) {
				if ( venueWhitelist[item.attributes.id].hasOwnProperty('dupeWL') ) {
					wlDupeList = venueWhitelist[item.attributes.id].dupeWL;
				}
			}
			
			if (devUser) {
				t0 = performance.now();  // Speed check start
			}
			var numVenues = 0, overlappingFlag = false;
			var addrItem = item.getAddress(), itemCompAddr = false;
			if ( addrItem.hasOwnProperty('attributes') ) {
				addrItem = addrItem.attributes;
			}
			if (addrItem.street !== null && addrItem.street.name !== null && item.attributes.houseNumber && item.attributes.houseNumber.match(/\d/g) !== null) {
				itemCompAddr = true;
			}
			
				
			for (var venix in venueList) {  // for each place on the map:
				if (venueList.hasOwnProperty(venix)) {  // hOP filter
					numVenues++;
					nameMatch = false;
					altNameMatch = -1;
					testVenueAtt = venueList[venix].attributes;
					var pt2ptDistance =  item.geometry.getCentroid().distanceTo(venueList[venix].geometry.getCentroid());
					if ( pt2ptDistance < 2 && item.attributes.id !== testVenueAtt.id ) {
						overlappingFlag = true;
					}
					wlDupeMatch = false;
					if (wlDupeList.length>0 && wlDupeList.indexOf(testVenueAtt.id) > -1) {
						wlDupeMatch = true;
					}
					
					// get HNs for places on same street
					var addrDupe = venueList[venix].getAddress();
					if ( addrDupe.hasOwnProperty('attributes') ) {
						addrDupe = addrDupe.attributes;
					}
					if (itemCompAddr && addrDupe.street !== null && addrDupe.street.name !== null && testVenueAtt.houseNumber && testVenueAtt.houseNumber !== '' && 
					venix !== item.attributes.id && addrItem.street.name === addrDupe.street.name && testVenueAtt.houseNumber < 1000000) {
						dupeHNRangeList.push(parseInt(testVenueAtt.houseNumber));
						dupeHNRangeIDList.push(testVenueAtt.id);
						dupeHNRangeDistList.push(pt2ptDistance);
					}
					
					
					// Check for duplicates
					if ( !wlDupeMatch && dupeIDList.length<6 && pt2ptDistance < 800 && !testVenueAtt.residential && venix !== item.attributes.id && 'string' === typeof testVenueAtt.id && testVenueAtt.name !== null && testVenueAtt.name.length>1 ) {  // don't do res, the point itself, new points or no name
						// If item has a complete address and test venue does, and they are different, then no dupe
						var suppressMatch = false;  
						if ( itemCompAddr && addrDupe.street !== null && addrDupe.street.name !== null && testVenueAtt.houseNumber && testVenueAtt.houseNumber.match(/\d/g) !== null ) {
							if ( item.attributes.lockRank > 0 && testVenueAtt.lockRank > 0 ) {
								if ( item.attributes.houseNumber !== testVenueAtt.houseNumber || addrItem.street.name !== addrDupe.street.name ) {
									suppressMatch = true;
								}
							} else { 
								if ( item.attributes.houseNumber !== testVenueAtt.houseNumber && addrItem.street.name !== addrDupe.street.name ) {
									suppressMatch = true;
								}
							}
						}
						
						
						if ( !suppressMatch ) {
							//Reformat the testPlace name
							testName = testVenueAtt.name.toUpperCase().replace(/ AND /g, '').replace(/^THE /g, '').replace(/[^A-Z0-9]/g, '');  // Format test name
							if (  (testName.length>2 && noNumSkip.indexOf(testName) === -1) || allowedTwoLetters.indexOf(testName) > -1  ) {
								testNameList = [testName];
							} else {
								testNameList = ['TESTNAMETOOSHORTQZJXS'+randInt];
								randInt++;
							}
							
							testNameNoNum = testName.replace(/[^A-Z]/g, '');  // Clear non-letter characters for alternate match
							if ( ((testNameNoNum.length>2 && noNumSkip.indexOf(testNameNoNum) === -1) || allowedTwoLetters.indexOf(testNameNoNum) > -1) && testVenueAtt.categories.indexOf('PARKING_LOT') === -1 ) {  //  only add de-numbered name if at least 2 chars remain
								testNameList.push(testNameNoNum);
							}
							// primary name matching loop
							
							for (tnlix=0; tnlix < testNameList.length; tnlix++) {
								for (cnlix=0; cnlix < currNameList.length; cnlix++) {
									if ( (testNameList[tnlix].indexOf(currNameList[cnlix]) > -1 || currNameList[cnlix].indexOf(testNameList[tnlix]) > -1) ) {
										nameMatch = true;
										break;
									}
								}
								if (nameMatch) {break;}  // break if a match found
							}
							if (!nameMatch && testVenueAtt.aliases.length > 0) {
								for (aliix=0; aliix<testVenueAtt.aliases.length; aliix++) {
									aliasNameRF = testVenueAtt.aliases[aliix].toUpperCase().replace(/ AND /g, '').replace(/^THE /g, '').replace(/[^A-Z0-9]/g, '');  // Format name
									if ( (aliasNameRF.length>2 && noNumSkip.indexOf(aliasNameRF) === -1) || allowedTwoLetters.indexOf(aliasNameRF) > -1  ) {
										testNameList = [aliasNameRF];
									} else {
										testNameList = ['ALIASNAMETOOSHORTQOFUH'+randInt];
										randInt++;
									}
									aliasNameNoNum = aliasNameRF.replace(/[^A-Z]/g, '');  // Clear non-letter characters for alternate match ( HOLLYIVYPUB23 --> HOLLYIVYPUB ) 
									if (((aliasNameNoNum.length>2 && noNumSkip.indexOf(aliasNameNoNum) === -1) || allowedTwoLetters.indexOf(aliasNameNoNum) > -1) && testVenueAtt.categories.indexOf('PARKING_LOT') === -1) {  //  only add de-numbered name if at least 2 characters remain
										testNameList.push(aliasNameNoNum);
									} else {
										testNameList.push('111231643239'+randInt);  //  just to keep track of the alias in question, always add something.
										randInt++;
									}
								}
								for (tnlix=0; tnlix < testNameList.length; tnlix++) {
									for (cnlix=0; cnlix < currNameList.length; cnlix++) {
										if ( (testNameList[tnlix].indexOf(currNameList[cnlix]) > -1 || currNameList[cnlix].indexOf(testNameList[tnlix]) > -1) ) {
											// get index of that match (half of the array index with floor)
											altNameMatch = Math.floor(tnlix/2);  
											break;
										}
									}
									if (altNameMatch > -1) {break;}  // break from the rest of the alts if a match found
								}
							}
							// If a match was found:
							if ( nameMatch || altNameMatch > -1 ) {
								dupeIDList.push(testVenueAtt.id);  // Add the item to the list of matches
								WMEPH_NameLayer.setVisibility(true);  // If anything found, make visible the dupe layer
								if (nameMatch) {
									labelText = testVenueAtt.name;  // Pull duplicate name
								} else {
									labelText = testVenueAtt.aliases[altNameMatch] + ' (Alt)';  // Pull duplicate alt name
								}
								phlogdev('Possible duplicate found. WME place: ' + itemName + ' / Nearby place: ' + labelText);
								
								// Reformat the name into multiple lines based on length
								var startIX=0, endIX=0, labelTextBuild = [], maxLettersPerLine = Math.round(2*Math.sqrt(labelText.replace(/ /g,'').length/2));
								maxLettersPerLine = Math.max(maxLettersPerLine,4);
								while (endIX !== -1) {
									endIX = labelText.indexOf(' ', endIX+1);
									if (endIX - startIX > maxLettersPerLine) {
										labelTextBuild.push( labelText.substr(startIX,endIX-startIX) );
										startIX = endIX+1;
									}
								}
								labelTextBuild.push( labelText.substr(startIX) );  // Add last line
								labelTextReformat = labelTextBuild.join('\n');
								// Add photo icons
								if (testVenueAtt.images.length > 0 ) {
									labelTextReformat = labelTextReformat + ' ';
									for (var phix=0; phix<testVenueAtt.images.length; phix++) {
										if (phix===3) {
											labelTextReformat = labelTextReformat + '+';
											break;
										}
										//labelTextReformat = labelTextReformat + '\u25A3';  // add photo icons
										labelTextReformat = labelTextReformat + '\u25A3';  // add photo icons
									}
								}
								
								pt = venueList[venix].geometry.getCentroid();
								if ( !mapExtent.containsLonLat(pt.toLonLat()) ) {
									outOfExtent = true;
								}
								minLat = Math.min(minLat, pt.y); minLon = Math.min(minLon, pt.x);
								maxLat = Math.max(maxLat, pt.y); maxLon = Math.max(maxLon, pt.x);
								
								textFeature = new OpenLayers.Feature.Vector( pt, {labelText: labelTextReformat, fontColor: '#fff', 
									strokeColor: labelColorList[labelColorIX%labelColorList.length], labelAlign: 'cm', pointRadius: 25 , dupeID: testVenueAtt.id } );
								labelFeatures.push(textFeature);
								//WMEPH_NameLayer.addFeatures(labelFeatures);
								dupeNames.push(labelText);
							}
							labelColorIX++;
						}
					}
				}
			}
			// Add a marker for the working place point if any dupes were found
			//phlogdev('dupeIDList: ' + dupeIDList);
			if (dupeIDList.length>1) {
				pt = item.geometry.getCentroid();
				if ( !mapExtent.containsLonLat(pt.toLonLat()) ) {
					outOfExtent = true;
				}
				minLat = Math.min(minLat, pt.y); minLon = Math.min(minLon, pt.x);
				maxLat = Math.max(maxLat, pt.y); maxLon = Math.max(maxLon, pt.x);
				// Add photo icons
				var currentLabel = 'Current';
				if (item.attributes.images.length > 0 ) {
					for (var ciix=0; ciix<item.attributes.images.length; ciix++) {
						currentLabel = currentLabel + ' ';
						if (ciix===3) {
							currentLabel = currentLabel + '+';
							break;
						}
						currentLabel = currentLabel + '\u25A3';  // add photo icons
					}
				}
				textFeature = new OpenLayers.Feature.Vector( pt, {labelText: currentLabel, fontColor: '#fff', strokeColor: '#fff', labelAlign: 'cm', pointRadius: 25 , dupeID: item.attributes.id} );
				labelFeatures.push(textFeature);
				WMEPH_NameLayer.addFeatures(labelFeatures);
			}
			if (devUser) {
				t1 = performance.now();  // log search time
				//phlogdev("Ran dupe search on " + numVenues + " nearby venues in " + (t1 - t0) + " milliseconds.");
			}
			if (recenterOption && dupeNames.length>0 && outOfExtent) {  // then rebuild the extent to include the duplicate
				var padMult = 1.0;
				mapExtent.left = minLon - (padFrac*padMult) * (maxLon-minLon);
				mapExtent.right = maxLon + (padFrac*padMult) * (maxLon-minLon);
				mapExtent.bottom = minLat - (padFrac*padMult) * (maxLat-minLat);
				mapExtent.top = maxLat + (padFrac*padMult) * (maxLat-minLat);
				W.map.zoomToExtent(mapExtent);
			}
			return [dupeNames, overlappingFlag];
		}  // END Dupefinder function
		
		// On selection of new item:
		function checkSelection() {
			if (W.selectionManager.selectedItems.length > 0) {
				var newItem = W.selectionManager.selectedItems[0].model;
				if (newItem.type === "venue") {
					displayRunButton();
					getPanelFields();
					if ( $("#WMEPH-EnableCloneMode" + devVersStr).prop('checked') ) {
						displayCloneButton();
					}
					if (localStorage.getItem("WMEPH-AutoRunOnSelect" + devVersStr) === '1') {
						setTimeout(harmonizePlace,200);
					}
					for (var dvtix=0; dvtix<dupeIDList.length; dvtix++) {
						if (newItem.attributes.id === dupeIDList[dvtix]) {  // If the user selects a place in the dupe list, don't clear the labels yet
							return;
						}
					}
				}
				// If the selection is anything else, clear the labels
				WMEPH_NameLayer.destroyFeatures();
				WMEPH_NameLayer.setVisibility(false);
			}
		}  // END checkSelection function
		
		// Functions to infer address from nearby segments
		function WMEPH_inferAddress(MAX_RECURSION_DEPTH) {
			'use strict';
			var distanceToSegment,
				foundAddresses = [],
				i,
				// Ignore pedestrian boardwalk, stairways, runways, and railroads
				IGNORE_ROAD_TYPES = [10, 16, 18, 19],
				inferredAddress = {
					country: null,
					city: null,
					state: null,
					street: null
				},
				//MAX_RECURSION_DEPTH = 8,
				n,
				orderedSegments = [],
				segments = W.model.segments.getObjectArray(),
				selectedItem,
				stopPoint,
				wmeSelectedItems = W.selectionManager.selectedItems;
		
			var findClosestNode = function () {
				var closestSegment = orderedSegments[0].segment,
					distanceA,
					distanceB,
					nodeA = W.model.nodes.get(closestSegment.attributes.fromNodeID),
					nodeB = W.model.nodes.get(closestSegment.attributes.toNodeID);
				if (nodeA && nodeB) {
					distanceA = stopPoint.distanceTo(nodeA.attributes.geometry);
					distanceB = stopPoint.distanceTo(nodeB.attributes.geometry);
					return distanceA < distanceB ?
						nodeA.attributes.id : nodeB.attributes.id;
				}
			};
		
			var findConnections = function (startingNodeID, recursionDepth) {
				var connectedSegments,
					k,
					newNode;
			
				// Limit search depth to avoid problems.
				if (recursionDepth > MAX_RECURSION_DEPTH) {
					//console.debug('Max recursion depth reached');
					return;
				}
			
				// Populate variable with segments connected to starting node.
				connectedSegments = _.where(orderedSegments, {
					fromNodeID: startingNodeID
				});
				connectedSegments = connectedSegments.concat(_.where(orderedSegments, {
					toNodeID: startingNodeID
				}));
			
				//console.debug('Looking for connections at node ' + startingNodeID);
			
				// Check connected segments for address info.
				for (k in connectedSegments) {
					if (connectedSegments.hasOwnProperty(k)) {
						if (hasStreetName(connectedSegments[k].segment)) {
							// Address found, push to array.
							/*
							console.debug('Address found on connnected segment ' +
							connectedSegments[k].segment.attributes.id +
							'. Recursion depth: ' + recursionDepth);
							*/
							foundAddresses.push({
								depth: recursionDepth,
								distance: connectedSegments[k].distance,
								segment: connectedSegments[k].segment
							});
							break;
						} else {
							// If not found, call function again starting from the other node on this segment.
							//console.debug('Address not found on connected segment ' + connectedSegments[k].segment.attributes.id);
							newNode = connectedSegments[k].segment.attributes.fromNodeID === startingNodeID ?
								connectedSegments[k].segment.attributes.toNodeID :
								connectedSegments[k].segment.attributes.fromNodeID;
							findConnections(newNode, recursionDepth + 1);
						}
					}
				}
			};
		
			var getFCRank = function (FC) {
				var typeToFCRank = {
					3: 0, // freeway
					6: 1, // major
					7: 2, // minor
					2: 3, // primary
					1: 4, // street
					20: 5, // PLR
					8: 6, // dirt
				};
				if (FC && !isNaN(FC)) {
					return typeToFCRank[FC] || 100;
				}
			};
		
			var hasStreetName = function (segment) {
				return segment && segment.type === 'segment' && segment.getAddressDetails().streetName !== 'No street';
			};
			
			// phlogdev("No address data, gathering ", 2);
		  
			// Make sure a place is selected and segments are loaded.
			if (wmeSelectedItems.length > 0 && segments.length > 0 &&
				wmeSelectedItems[0].model.type === 'venue') {
				selectedItem = W.selectionManager.selectedItems[0];
			} else {
				return;
			}
		
			stopPoint = selectedItem.model.isPoint() ? selectedItem.geometry :
				W.geometryEditing.editors.venue.navigationPoint.lonlat.toPoint();
		  
			// Go through segment array and calculate distances to segments.
			for (i = 0, n = segments.length; i < n; i++) {
				// Make sure the segment is not an ignored roadType.
				if (IGNORE_ROAD_TYPES.indexOf(segments[i].attributes.roadType) === -1) {
					distanceToSegment = stopPoint.distanceTo(segments[i].geometry);
					// Add segment object and its distanceTo to an array.
					orderedSegments.push({
						distance: distanceToSegment,
						fromNodeID: segments[i].attributes.fromNodeID,
						segment: segments[i],
						toNodeID: segments[i].attributes.toNodeID
					});
				}
			}
		
			// Sort the array with segments and distance.
			orderedSegments = _.sortBy(orderedSegments, 'distance');
		
			// Check closest segment for address first.
			if (hasStreetName(orderedSegments[0].segment)) {
				inferredAddress = orderedSegments[0].segment.getAddress();
			} else {
				// If address not found on closest segment, try to find address through branching method.
				findConnections(findClosestNode(), 1);
				if (foundAddresses.length > 0) {
					// If more than one address found at same recursion depth, look at FC of segments.
					if (foundAddresses.length > 1) {
						_.each(foundAddresses, function (element) {
							element.fcRank = getFCRank(
								element.segment.attributes.roadType);
						});
						foundAddresses = _.sortBy(foundAddresses, 'fcRank');
						foundAddresses = _.filter(foundAddresses, {
							fcRank: foundAddresses[0].fcRank
						});
					}
					
					// If multiple segments with same FC, Use address from segment with address that is closest by connectivity.
					if (foundAddresses.length > 1) {
						foundAddresses = _.sortBy(foundAddresses, 'depth');
						foundAddresses = _.filter(foundAddresses, {
							depth: foundAddresses[0].depth
						});
					}
					
					// If more than one of the closest segments by connectivity has the same FC, look for
					// closest segment geometrically.
					if (foundAddresses.length > 1) {
						foundAddresses = _.sortBy(foundAddresses, 'distance');
					}
					console.debug(foundAddresses[0].streetName, foundAddresses[0].depth);
					inferredAddress = foundAddresses[0].segment.getAddress();
				} else {
					// Default to closest if branching method fails.
					// Go through sorted segment array until a country, state, and city have been found.
					inferredAddress = _.find(orderedSegments, function (element) {
						return hasStreetName(element.segment);
					}).segment.getAddress() || inferredAddress;
				}
			}
			return inferredAddress;
		}  // END inferAddress function
		
		/**
		 * Updates the address for a place.
		 * @param feature {WME Venue Object} The place to update.
		 * @param address {Object} An object containing the country, state, city, and street
		 * objects.
		 */
		function updateAddress(feature, address) {
			'use strict';
			var newAttributes, 
				UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
				feature = feature || item;
			if (feature && address && address.state && address.country) {
				newAttributes = {
					countryID: address.country.id,
					stateID: address.state.id,
					cityName: address.city.name,
					emptyCity: address.city.name ? null : true,
					streetName: address.street.name,
					emptyStreet: address.street.name ? null : true
				};
				W.model.actionManager.add(new UpdateFeatureAddress(feature, newAttributes));
				phlogdev('Address inferred and updated');
			}
		} // END updateAddress function

		// Build a Google search url based on place name and address
		function buildGLink(searchName,addr,HN) {
			var searchHN = "", searchStreet = "", searchCity = "";
			searchName = searchName.replace(/&/g, "%26");
			searchName = searchName.replace(/[ \/]/g, "%20");
			if ("string" === typeof addr.street.name && addr.street.name !== null && addr.street.name !== '') {
				searchStreet = addr.street.name + ",%20";
			}
			searchStreet = searchStreet.replace(/ /g, "%20");
			searchStreet = searchStreet.replace(/CR-/g, "County%20Rd%20");
			searchStreet = searchStreet.replace(/SR-/g, "State%20Hwy%20");
			searchStreet = searchStreet.replace(/US-/g, "US%20Hwy%20");
			searchStreet = searchStreet.replace(/ CR /g, "%20County%20Rd%20");
			searchStreet = searchStreet.replace(/ SR /g, "%20State%20Hwy%20");
			searchStreet = searchStreet.replace(/ US /g, "%20US%20Hwy%20");
			searchStreet = searchStreet.replace(/$CR /g, "County%20Rd%20");
			searchStreet = searchStreet.replace(/$SR /g, "State%20Hwy%20");
			searchStreet = searchStreet.replace(/$US /g, "US%20Hwy%20");
			if ("string" === typeof HN && searchStreet !== "") {
				searchHN = HN + "%20";
			}
			if ("string" === typeof addr.city.name && addr.city.name !== '') {
				searchCity = addr.city.name + ",%20";
			}
			searchCity = searchCity.replace(/ /g, "%20");
			
			return "http://www.google.com/search?q=" + searchName + ",%20" + searchHN + searchStreet + searchCity + addr.state.name;
		} // END buildGLink function
		
		// WME Category translation from Natural language to object language  (Bank / Financial --> BANK_FINANCIAL)
		function catTranslate(natCategories) {
			//console.log(natCategories);
			var natCategoriesRepl = natCategories.toUpperCase().replace(/ AND /g, "").replace(/[^A-Z]/g, "");
			if (natCategoriesRepl.indexOf('PETSTORE') > -1) {
				return "PET_STORE_VETERINARIAN_SERVICES";
			}
			for(var keyCat in catTransWaze2Lang){
				if ( natCategoriesRepl ===  catTransWaze2Lang[keyCat].toUpperCase().replace(/ AND /g, "").replace(/[^A-Z]/g, "")) {
					return keyCat;
				}
			}
			// if the category doesn't translate, then pop an alert that will make a forum post to the thread
			// Generally this means the category used in the PNH sheet is not close enough to the natural language categories used inside the WME translations
			if (confirm('WMEPH: Category Error!\nClick OK to report this error') ) {  
				forumMsgInputs = {
					subject: 'Re: WMEPH Bug report',
					message: 'Error report: Category "' + natCategories + '" is not translatable.',
				};
				WMEPH_errorReport(forumMsgInputs);
			}
			return "ERROR";
		}  // END catTranslate function
		
		// compares two arrays to see if equal, regardless of order
		function matchSets(array1, array2) {
			if (array1.length !== array2.length) {return false;}  // compare lengths
			for (var i = 0; i < array1.length; i++) {
				if (array2.indexOf(array1[i]) === -1) { 
					return false;   
				}           
			}       
			return true;
		}
		
		// function that checks if all elements of target are in array:source
		function containsAll(source,target) {
			if (typeof(target) === "string") { target = [target]; }  // if a single string, convert to an array
			for (var ixx = 0; ixx < target.length; ixx++) {
				if ( source.indexOf(target[ixx]) === -1 ) {
					return false; 
				}
			}
			return true;  
		}
		
		// function that checks if any element of target are in source
		function containsAny(source,target) {
			if (typeof(source) === "string") { source = [source]; }  // if a single string, convert to an array
			if (typeof(target) === "string") { target = [target]; }  // if a single string, convert to an array
			var result = source.filter(function(tt){ return target.indexOf(tt) > -1; });   
			return (result.length > 0);  
		}
		
		// Function that inserts a string or a string array into another string array at index ix and removes any duplicates
		function insertAtIX(array1, array2, ix) {  // array1 is original string, array2 is the inserted string, at index ix
			var arrayNew = array1.slice(0);  // slice the input array so it doesn't change
			if (typeof(array2) === "string") { array2 = [array2]; }  // if a single string, convert to an array
			if (typeof(array2) === "object") {  // only apply to inserted arrays
				var arrayTemp = arrayNew.splice(ix);  // split and hold the first part
				arrayNew.push.apply(arrayNew, array2);  // add the insert
				arrayNew.push.apply(arrayNew, arrayTemp);  // add the tail end of original
			}
			return uniq(arrayNew);  // remove any duplicates (so the function can be used to move the position of a string)
		}
		
		// Function to remove unnecessary aliases
		function removeSFAliases(nName, nAliases) {
			var newAliasesUpdate = [];
			nName = nName.toUpperCase().replace(/'/g,'').replace(/-/g,' ').replace(/\/ /g,' ').replace(/ \//g,' ').replace(/ {2,}/g,' ');
			for (var naix=0; naix<nAliases.length; naix++) {
				if ( !nName.startsWith( nAliases[naix].toUpperCase().replace(/'/g,'').replace(/-/g,' ').replace(/\/ /g,' ').replace(/ \//g,' ').replace(/ {2,}/g,' ') ) ) {
					newAliasesUpdate.push(nAliases[naix]);
				} else {
					//phlogdev('Unnecessary alias removed: ' + nAliases[naix]);
					bannButt.sfAliases.active = true;
				}
			}
			return newAliasesUpdate;
		}
		
		// settings tab
		function add_PlaceHarmonizationSettingsTab() {
			//Create Settings Tab
			var phTabHtml = '<li><a href="#sidepanel-ph' + devVersStr + '" data-toggle="tab" id="PlaceHarmonization' + devVersStr + '">WMEPH' + devVersStrSpace + '</a></li>';
			$("#user-tabs ul.nav-tabs:first").append(phTabHtml);
		
			//Create Settings Tab Content
			var phContentHtml = '<div class="tab-pane" id="sidepanel-ph' + devVersStr + '"><div id="PlaceHarmonizer' + devVersStr + '">WMEPH' + 
				devVersStrSpace + ' v. ' + WMEPHversion + '</div></div>';
			$("#user-info div.tab-content:first").append(phContentHtml);
			
			var c = '<div id="wmephtab" class="active" style="padding-top: 5px;">' + 
			'<ul class="nav nav-tabs"><li class="active"><a data-toggle="tab" href="#sidepanel-harmonizer' + devVersStr + '">Harmonize</a></li>' + 
			'<li><a data-toggle="tab" href="#sidepanel-highlighter' + devVersStr + '">HL \/ Scan</a></li>' +
			'<li><a data-toggle="tab" href="#sidepanel-wltools' + devVersStr + '">WL Tools</a></li></ul>' + 
			'<div class="tab-content"><div class="tab-pane active" id="sidepanel-harmonizer' + devVersStr + '"></div>' +
			'<div class="tab-pane" id="sidepanel-highlighter' + devVersStr + '"></div>' +
			'<div class="tab-pane" id="sidepanel-wltools' + devVersStr + '"></div></div></div>';
	
			//add the sub tabs to the scripts main tab
			$("#sidepanel-ph"+devVersStr).append(c);
			
			// Enable certain settings by default if not set by the user:
			if (localStorage.getItem('WMEPH-ColorHighlighting'+devVersStr) === null) {
				localStorage.setItem('WMEPH-ColorHighlighting'+devVersStr, '1');
			}
			
			//Create Settings Checkboxes and Load Data
			//example condition:  if ( $("#WMEPH-DisableDFZoom" + devVersStr).prop('checked') ) { }
			createSettingsCheckbox("sidepanel-harmonizer" + devVersStr, "WMEPH-WebSearchNewTab" + devVersStr,"Open URL & Search Results in new tab instead of new window");
			createSettingsCheckbox("sidepanel-harmonizer" + devVersStr, "WMEPH-DisableDFZoom" + devVersStr,"Disable zoom & center for duplicates");
			createSettingsCheckbox("sidepanel-harmonizer" + devVersStr, "WMEPH-EnableIAZoom" + devVersStr,"Enable zoom & center for places with no address");
			createSettingsCheckbox("sidepanel-harmonizer" + devVersStr, "WMEPH-HidePlacesWiki" + devVersStr,"Hide 'Places Wiki' button in results banner");
			if (devUser || betaUser || usrRank > 1) {
				createSettingsCheckbox("sidepanel-harmonizer" + devVersStr, "WMEPH-EnableServices" + devVersStr,"Enable automatic addition of common services");
			}
			if (devUser || betaUser || usrRank > 2) {
				createSettingsCheckbox("sidepanel-harmonizer" + devVersStr, "WMEPH-ConvenienceStoreToGasStations" + devVersStr,'Automatically add "Convenience Store" category to gas stations');
				createSettingsCheckbox("sidepanel-harmonizer" + devVersStr, "WMEPH-AddAddresses" + devVersStr,"Add detected address fields to places with no address");
				createSettingsCheckbox("sidepanel-harmonizer" + devVersStr, "WMEPH-EnableCloneMode" + devVersStr,"Enable place cloning tools");
				createSettingsCheckbox("sidepanel-harmonizer" + devVersStr, "WMEPH-AutoLockRPPs" + devVersStr,"Lock residential place points to region default");
				createSettingsCheckbox("sidepanel-harmonizer" + devVersStr, "WMEPH-AutoRunOnSelect" + devVersStr,'Automatically run the script when selecting a place');
			}
			
			// Highlighter settings
			var phDevContentHtml = '<p>Highlighter Settings:</p>';
			$("#sidepanel-highlighter" + devVersStr).append(phDevContentHtml);
			createSettingsCheckbox("sidepanel-highlighter" + devVersStr, "WMEPH-ColorHighlighting" + devVersStr,"Enable color highlighting of map to indicate places needing work");
			createSettingsCheckbox("sidepanel-highlighter" + devVersStr, "WMEPH-DisableHoursHL" + devVersStr,"Disable highlighting for missing hours");
			createSettingsCheckbox("sidepanel-highlighter" + devVersStr, "WMEPH-DisableWLHL" + devVersStr,"Disable Whitelist highlighting (shows all missing info regardless of WL)");
			if (devUser || betaUser || usrRank > 2) {
				//createSettingsCheckbox("sidepanel-highlighter" + devVersStr, "WMEPH-UnlockedRPPs" + devVersStr,"Highlight unlocked residential place points");
			}
			var phHRContentHtml = '<hr align="center" width="90%">';
			$("#sidepanel-highlighter" + devVersStr).append(phHRContentHtml);
			phHRContentHtml = '<p>Scanner Settings (coming soon)</p>';
			$("#sidepanel-highlighter" + devVersStr).append(phHRContentHtml);
			
			// Scanner settings
			//createSettingsCheckbox("sidepanel-highlighter" + devVersStr, "WMEPH-PlaceScanner" + devVersStr,"Placeholder, under development!");
			
			// Whitelist settings
			
			phHRContentHtml = '<hr align="center" width="90%">';
			$("#sidepanel-harmonizer" + devVersStr).append(phHRContentHtml);
			
			// User pref for KB Shortcut:
			// Set defaults
			if (isDevVersion) {
				if (thisUser.userName.toLowerCase() === 't0cableguy') {
					defaultKBShortcut = 'p';
				} else {
					defaultKBShortcut = 'S';
				}
			} else {
				defaultKBShortcut = 'A';
			}
			// Set local storage to default if none
			if (localStorage.getItem('WMEPH-KeyboardShortcut'+devVersStr) === null) {
				localStorage.setItem('WMEPH-KeyboardShortcut'+devVersStr, defaultKBShortcut);
			}
			
			// Add Letter input box
			var phKBContentHtml = $('<div id="PlaceHarmonizerKB' + devVersStr + 
				'"><div id="PlaceHarmonizerKBWarn' + devVersStr + '"></div>Shortcut Letter (a-Z): <input type="text" maxlength="1" id="WMEPH-KeyboardShortcut'+devVersStr+
				'" style="width: 30px;padding-left:8px"><div id="PlaceHarmonizerKBCurrent' + devVersStr + '"></div></div>');
        	$("#sidepanel-harmonizer" + devVersStr).append(phKBContentHtml);
			createSettingsCheckbox("PlaceHarmonizerKB" + devVersStr, "WMEPH-KBSModifierKey" + devVersStr, "Use Ctrl instead of Alt"); // Add Alt-->Ctrl checkbox
			if ( localStorage.getItem('WMEPH-KBSModifierKey'+devVersStr) === '1' ) {  // Change modifier key code if checked
				modifKey = 'Ctrl+';
			} 
			$('#WMEPH-KeyboardShortcut'+devVersStr).val(localStorage.getItem('WMEPH-KeyboardShortcut'+devVersStr));  // Load letter key value from local storage
			if ($('#WMEPH-KeyboardShortcut'+devVersStr).val().match(/^[a-z]{1}$/i) === null) { 
            	$('#WMEPH-KeyboardShortcut'+devVersStr).val(defaultKBShortcut);
				$(localStorage.setItem('WMEPH-KeyboardShortcut'+devVersStr, $('#WMEPH-KeyboardShortcut'+devVersStr).val()));
			}
			shortcutParse = parseKBSShift($('#WMEPH-KeyboardShortcut'+devVersStr).val());
			// Check for KBS conflict on Beta script load
			if (isDevVersion) {  
				if (checkWMEPH_KBSconflict(shortcutParse)) {
					alert('You have the same shortcut for the Beta version and the Production version of the script. The Beta version is disabled until you change the Beta shortcut');
				} else {
					shortcut.add(modifKey + shortcutParse, function() { harmonizePlace(); });
					phKBContentHtml = $('<span style="font-weight:bold">Current shortcut: '+modifKey+shortcutParse+'</span>');
        			$("#PlaceHarmonizerKBCurrent" + devVersStr).append(phKBContentHtml);
				}
			} else {  // Prod version always loads
				shortcut.add(modifKey + shortcutParse, function() { harmonizePlace(); });
				phKBContentHtml = $('<span style="font-weight:bold">Current shortcut: '+modifKey+shortcutParse+'</span>');
        		$("#PlaceHarmonizerKBCurrent" + devVersStr).append(phKBContentHtml);
			}
			
			// Modifier on-click changes
			var modifKeyNew;
			$("#WMEPH-KBSModifierKey" + devVersStr).click(function() {
				$("#PlaceHarmonizerKBWarn" + devVersStr).empty();  // remove any warning
				if ($("#WMEPH-KBSModifierKey" + devVersStr).prop('checked')) {
					modifKeyNew = 'Ctrl+';
				} else {
					modifKeyNew = 'Alt+';
				}
				shortcutParse = parseKBSShift($('#WMEPH-KeyboardShortcut'+devVersStr).val());
				
				if (checkWMEPH_KBSconflict(shortcutParse)) {
					$("#WMEPH-KBSModifierKey" + devVersStr).trigger('click');
					phKBContentHtml = '<p style="color:red">Shortcut conflict with other WMEPH version<p>';
					$("#PlaceHarmonizerKBWarn" + devVersStr).append(phKBContentHtml);
				} else {
					shortcut.remove(modifKey + shortcutParse);
					modifKey = modifKeyNew;
					shortcut.add(modifKey + shortcutParse, function() { harmonizePlace(); });
				}
				
				$("#PlaceHarmonizerKBCurrent" + devVersStr).empty();
				phKBContentHtml = $('<span style="font-weight:bold">Current shortcut: '+modifKey+shortcutParse+'</span>');
        		$("#PlaceHarmonizerKBCurrent" + devVersStr).append(phKBContentHtml);
			});
			
			// Upon change of the KB letter:
			var shortcutParseNew;
			$("#WMEPH-KeyboardShortcut"+devVersStr).change(function() {
				if ($('#WMEPH-KeyboardShortcut'+devVersStr).val().match(/^[a-z]{1}$/i) !== null) {  // If a single letter...
					$("#PlaceHarmonizerKBWarn" + devVersStr).empty();  // remove old warning
					// remove previous
					shortcutParse = parseKBSShift(localStorage.getItem('WMEPH-KeyboardShortcut'+devVersStr));
					shortcutParseNew = parseKBSShift($('#WMEPH-KeyboardShortcut'+devVersStr).val());
					
					if (checkWMEPH_KBSconflict(shortcutParseNew)) {
						$('#WMEPH-KeyboardShortcut'+devVersStr).val(localStorage.getItem('WMEPH-KeyboardShortcut'+devVersStr));
						//$("#PlaceHarmonizerKBWarn" + devVersStr).empty();
						phKBContentHtml = '<p style="color:red">Shortcut conflict with other WMEPH version<p>';
						$("#PlaceHarmonizerKBWarn" + devVersStr).append(phKBContentHtml);
					} else {
						shortcut.remove(modifKey + shortcutParse);
						shortcutParse = shortcutParseNew;
						shortcut.add(modifKey + shortcutParse, function() { harmonizePlace(); });
						$(localStorage.setItem('WMEPH-KeyboardShortcut'+devVersStr, $('#WMEPH-KeyboardShortcut'+devVersStr).val()) );
					}
					$("#PlaceHarmonizerKBCurrent" + devVersStr).empty();
					phKBContentHtml = $('<span style="font-weight:bold">Current shortcut: '+modifKey+shortcutParse+'</span>');
					$("#PlaceHarmonizerKBCurrent" + devVersStr).append(phKBContentHtml);
				} else {  // if not a letter then reset and flag
					$('#WMEPH-KeyboardShortcut'+devVersStr).val(localStorage.getItem('WMEPH-KeyboardShortcut'+devVersStr));
					$("#PlaceHarmonizerKBWarn" + devVersStr).empty();
					phKBContentHtml = '<p style="color:red">Only letters are allowed<p>';
					$("#PlaceHarmonizerKBWarn" + devVersStr).append(phKBContentHtml);
				}
			});
			
			
			if (devUser) {  // Override script regionality (devs only)
				phDevContentHtml = '<hr align="center" width="90%"><p>Dev Only Settings:</p>';
				$("#sidepanel-harmonizer" + devVersStr).append(phDevContentHtml);
				createSettingsCheckbox("sidepanel-harmonizer" + devVersStr, "WMEPH-RegionOverride" + devVersStr,"Disable Region Specificity");
			
			}
			
			// *** Whitelisting section
			if (localStorage.getItem('WMEPH_WLAddCount') === null) {
				localStorage.setItem('WMEPH_WLAddCount', 2);  // Counter to remind of WL backups
			}
			var phWLContentHtml = $('<div id="PlaceHarmonizerWLTools' + devVersStr + '">Whitelist string: <input onClick="this.select();" type="text" id="WMEPH-WLInput'+devVersStr+
				'" style="width: 200px;padding-left:1px"><br>'+
				'<input class="btn btn-success btn-xs" id="WMEPH-WLMerge'+ devVersStr +'" title="Merge the string into your existing Whitelist" type="button" value="Merge">'+
				'<br><input class="btn btn-success btn-xs" id="WMEPH-WLPull'+ devVersStr +'" title="Pull your existing Whitelist for backup or sharing" type="button" value="Pull">'+
				'<br><input class="btn btn-success btn-xs" id="WMEPH-WLShare'+ devVersStr +'" title="Share your Whitelist to a public Google sheet" type="button" value="Share your WL">'+
				'<br><input class="btn btn-info btn-xs" id="WMEPH-WLStats'+ devVersStr +'" title="Display WL stats" type="button" value="Stats">'+
				'<br><input class="btn btn-danger btn-xs" id="WMEPH-WLStateFilter'+ devVersStr +'" title="Remove all WL items for a state" type="button" value="Remove data for 1 State">'+
				'</div><div id="PlaceHarmonizerWLToolsMsg' + devVersStr + '"></div>');
        	$("#sidepanel-wltools" + devVersStr).append(phWLContentHtml);
			
			$("#WMEPH-WLMerge" + devVersStr).click(function() {
				$("#PlaceHarmonizerWLToolsMsg" + devVersStr).empty();
				if ($('#WMEPH-WLInput'+devVersStr).val() === 'resetWhitelist') {
					if (confirm('***Do you want to reset all Whitelist data?\nClick OK to erase.') ) {  // if the category doesn't translate, then pop an alert that will make a forum post to the thread
						venueWhitelist = { '1.1.1': { Placeholder: {  } } }; // Populate with a dummy place
						saveWL_LS(compressedWLLS);
					}
				} else {  // try to merge uncompressed WL data
					WLSToMerge = validateWLS($('#WMEPH-WLInput'+devVersStr).val());
					if (WLSToMerge) {
						phlog('Whitelists merged!');
						venueWhitelist = mergeWL(venueWhitelist,WLSToMerge);
						saveWL_LS(compressedWLLS);
						phWLContentHtml = '<p style="color:green">Whitelist data merged<p>';
						$("#PlaceHarmonizerWLToolsMsg" + devVersStr).append(phWLContentHtml);
						$('#WMEPH-WLInputBeta').val('');
					} else {  // try compressed WL
						WLSToMerge = validateWLS( LZString.decompressFromUTF16($('#WMEPH-WLInput'+devVersStr).val()) );
						if (WLSToMerge) {
							phlog('Whitelists merged!');
							venueWhitelist = mergeWL(venueWhitelist,WLSToMerge);
							saveWL_LS(compressedWLLS);
							phWLContentHtml = '<p style="color:green">Whitelist data merged<p>';
							$("#PlaceHarmonizerWLToolsMsg" + devVersStr).append(phWLContentHtml);
							$('#WMEPH-WLInputBeta').val('');
						} else {
							phWLContentHtml = '<p style="color:red">Invalid Whitelist data<p>';
							$("#PlaceHarmonizerWLToolsMsg" + devVersStr).append(phWLContentHtml);
						}
					}
				}
			});
			
			// Pull the data to the text field
			$("#WMEPH-WLPull" + devVersStr).click(function() {
				$("#PlaceHarmonizerWLToolsMsg" + devVersStr).empty();
				if (compressedWLLS) {
					//$('#WMEPH-WLInput'+devVersStr).val(localStorage.getItem(WLlocalStoreNameCompressed));
					$('#WMEPH-WLInput'+devVersStr).val( LZString.decompressFromUTF16(localStorage.getItem(WLlocalStoreNameCompressed)) );
				} else {
					$('#WMEPH-WLInput'+devVersStr).val(localStorage.getItem(WLlocalStoreName));
				}
				phWLContentHtml = '<p style="color:green">To backup the data, copy & paste the text in the box to a safe location.<p>';
				$("#PlaceHarmonizerWLToolsMsg" + devVersStr).append(phWLContentHtml);
				localStorage.setItem('WMEPH_WLAddCount', 1);
			});
			
			// WL Stats
			$("#WMEPH-WLStats" + devVersStr).click(function() {
				$("#PlaceHarmonizerWLToolsMsg" + devVersStr).empty();
				$('#WMEPH-WLInputBeta').val('');
				var currWLData;
				if (compressedWLLS) {
					//$('#WMEPH-WLInput'+devVersStr).val(localStorage.getItem(WLlocalStoreNameCompressed));
					currWLData = JSON.parse( LZString.decompressFromUTF16( localStorage.getItem(WLlocalStoreNameCompressed) ) );
				} else {
					currWLData = JSON.parse( localStorage.getItem(WLlocalStoreName) );
				}
				//var WLSize = _.size(currWLData);
				var countryWL = {};
				var stateWL = {};
				var itemCount = 0;
				for (var venueKey in currWLData) {
					if (currWLData.hasOwnProperty(venueKey)) {
						if (venueKey !== '1.1.1') {  // Don't count the place holder
							itemCount++;
							if ( currWLData[venueKey].hasOwnProperty('country') ) {
								if ( countryWL.hasOwnProperty(currWLData[venueKey].country) ) {
									countryWL[currWLData[venueKey].country]++;
								} else {
									countryWL[currWLData[venueKey].country] = 1;
								}
							} else {
								if ( countryWL.hasOwnProperty('None') ) {
									countryWL.None++;
								} else {
									countryWL.None = 1;
								}
							}
							if ( currWLData[venueKey].hasOwnProperty('state') ) {
								if ( stateWL.hasOwnProperty(currWLData[venueKey].state) ) {
									stateWL[currWLData[venueKey].state]++;
								} else {
									stateWL[currWLData[venueKey].state] = 1;
								}
							} else {
								if ( stateWL.hasOwnProperty('None') ) {
									stateWL.None++;
								} else {
									stateWL.None = 1;
								}
							}
						}
					}
				}
				
				var countryString = '';
				for (var countryKey in countryWL) {
					countryString = countryString + '<br>' + countryKey + ': ' + countryWL[countryKey];
				}
				var stateString = '';
				for (var stateKey in stateWL) {
					stateString = stateString + '<br>' + stateKey + ': ' + stateWL[stateKey];
				}
				
				phWLContentHtml = '<p style="color:black">Number of WL places: '+ itemCount +'</p><p>States:'+ stateString +'</p><p>Countries:'+ countryString + '<p>';
				$("#PlaceHarmonizerWLToolsMsg" + devVersStr).append(phWLContentHtml);
				//localStorage.setItem('WMEPH_WLAddCount', 1);
			});
			
			// WL State Filter
			$("#WMEPH-WLStateFilter" + devVersStr).click(function() {
				$("#PlaceHarmonizerWLToolsMsg" + devVersStr).empty();
				stateToRemove = $('#WMEPH-WLInput'+devVersStr).val();
				if ( stateToRemove.length < 2 ) {
					phWLContentHtml = '<p style="color:red">Invalid state<p>';
					$("#PlaceHarmonizerWLToolsMsg" + devVersStr).append(phWLContentHtml);
				} else {
					var currWLData, venueToRemove = [];
					if (compressedWLLS) {
						//$('#WMEPH-WLInput'+devVersStr).val(localStorage.getItem(WLlocalStoreNameCompressed));
						currWLData = JSON.parse( LZString.decompressFromUTF16( localStorage.getItem(WLlocalStoreNameCompressed) ) );
					} else {
						currWLData = JSON.parse( localStorage.getItem(WLlocalStoreName) );
					}
					//var WLSize = _.size(currWLData);
					
					for (var venueKey in currWLData) {
						if (currWLData.hasOwnProperty(venueKey)) {
							if (venueKey !== '1.1.1') {  // Don't examine the place holder
								if ( currWLData[venueKey].hasOwnProperty('state') ) {
									if ( currWLData[venueKey].state === stateToRemove ) {
										venueToRemove.push(venueKey);
									}
								} 
							}
						}
					}
					//phlogdev(venueToRemove.length);
					if (venueToRemove.length > 0) {
						if (localStorage.WMEPH_WLAddCount === '1') {
							if (confirm('Are you sure you want to clear all whitelist data for '+stateToRemove+'? This CANNOT be undone. Press OK to delete, cancel to preserve the data.') ) {  // misclick check
								backupWL_LS(compressedWLLS);
								for (var ixwl=0; ixwl<venueToRemove.length; ixwl++) {
									delete venueWhitelist[venueToRemove[ixwl]];
									//phlogdev(venueWhitelist[venueToRemove[ixwl]]);
								}
								saveWL_LS(compressedWLLS);
								phWLContentHtml = '<p style="color:green">'+venueToRemove.length+' items removed from WL<p>';
								$("#PlaceHarmonizerWLToolsMsg" + devVersStr).append(phWLContentHtml);
								$('#WMEPH-WLInputBeta').val('');
							} else {
								phWLContentHtml = '<p style="color:blue">No changes made<p>';
								$("#PlaceHarmonizerWLToolsMsg" + devVersStr).append(phWLContentHtml);
							}
						} else {
							phWLContentHtml = '<p style="color:red">Please backup your WL using the Pull button before removing state data<p>';
							$("#PlaceHarmonizerWLToolsMsg" + devVersStr).append(phWLContentHtml);
							//phlogdev('Please backup your WL using the Pull button before removing state data');
						}
					} else {
						phWLContentHtml = '<p style="color:red">No data for that state. Use the state name exactly as listed in the Stats<p>';
						$("#PlaceHarmonizerWLToolsMsg" + devVersStr).append(phWLContentHtml);
						//phlogdev('No data for that state. Use the state name exactly as listed in the Stats');
					}
				}
			});
			
			// Share the data to a Google Form post
			$("#WMEPH-WLShare" + devVersStr).click(function() {
				var submitWLURL = 'https://docs.google.com/forms/d/1k_5RyOq81Fv4IRHzltC34kW3IUbXnQqDVMogwJKFNbE/viewform?entry.1173700072='+thisUser.userName;
				window.open(submitWLURL);
			});
			
			var feedbackString = 'Submit script feedback & suggestions';
			var placesWikiStr = 'Open the WME Places Wiki page';
			var phContentHtml2 = '<hr align="center" width="95%"><p><a href="' + 
				placesWikiURL + '" target="_blank" title="'+placesWikiStr+'">'+placesWikiStr+'</a><p><a href="' + 
				WMEPHurl + '" target="_blank" title="'+feedbackString+'">'+feedbackString+'</a></p><hr align="center" width="95%">Major features for v. ' + 
				WMEPHversionMeta+':<ul><li>'+WMEPHWhatsNewMetaHList+'</ul>Recent updates:<ul><li>'+WMEPHWhatsNewHList+'</ul>';
			$("#sidepanel-harmonizer" + devVersStr).append(phContentHtml2);
			
			W.map.events.register("mousemove", W.map, function (e) {            
				WMEPHmousePosition = W.map.getLonLatFromPixel( W.map.events.getMousePosition(e) ); 
			});
			
			// Add zoom shortcut
			shortcut.add("Control+Alt+Z", function() {
				zoomPlace();
			});	
			
			if (thisUser.userName === 't0cableguy' || thisUser.userName === 'bmtg') {
				shortcut.add("Control+Alt+E", function() {
					clonePlace();
				});
			}	
			
			// Color highlighting
			$("#WMEPH-ColorHighlighting" + devVersStr).click( function() {
				bootstrapWMEPH_CH();
			});
			$("#WMEPH-DisableHoursHL" + devVersStr).click( function() {
				bootstrapWMEPH_CH();
			});
			$("#WMEPH-DisableWLHL" + devVersStr).click( function() {
				bootstrapWMEPH_CH();
			});
			if ( $("#WMEPH-ColorHighlighting" + devVersStr).prop('checked') ) {
				phlog('Starting Highlighter');
				bootstrapWMEPH_CH();
			}
			
			
			// Add Color Highlighting shortcut
			shortcut.add("Control+Alt+h", function() {
				$("#WMEPH-ColorHighlighting" + devVersStr).trigger('click');
			});	
			
			// Add Autorun shortcut
			if (thisUser.userName === 'bmtg') {
				shortcut.add("Control+Alt+u", function() {
					$("#WMEPH-AutoRunOnSelect" + devVersStr).trigger('click');
				});	
			}
			
			// $("#user-info div.tab-content:first").append(phContentHtml2);
			phlog('Ready...!');
		} // END Settings Tab
	
		// This routine will create a checkbox in the #PlaceHarmonizer tab and will load the setting
		//		settingID:  The #id of the checkbox being created.  
		//  textDescription:  The description of the checkbox that will be use
		function createSettingsCheckbox(divID, settingID, textDescription) {
			//Create settings checkbox and append HTML to settings tab
			var phTempHTML = '<input type="checkbox" id="' + settingID + '">'+ textDescription +'</input><br>';
			$("#" + divID).append(phTempHTML);
			//Associate click event of new checkbox to call saveSettingToLocalStorage with proper ID
			$("#" + settingID).click(function() {saveSettingToLocalStorage(settingID);});
			//Load Setting for Local Storage, if it doesn't exist set it to NOT checked.
			//If previously set to 1, then trigger "click" event.
			if (!localStorage.getItem(settingID))
			{
				//phlogdev(settingID + ' not found.');
			} else if (localStorage.getItem(settingID) === "1") {
				$("#" + settingID).trigger('click');
			}
		}
		
		function createCloneCheckbox(divID, settingID, textDescription) {
			//Create settings checkbox and append HTML to settings tab
			var phTempHTML = '<input type="checkbox" id="' + settingID + '">'+ textDescription +'</input>&nbsp&nbsp';
			$("#" + divID).append(phTempHTML);
			//Associate click event of new checkbox to call saveSettingToLocalStorage with proper ID
			$("#" + settingID).click(function() {saveSettingToLocalStorage(settingID);});
			//Load Setting for Local Storage, if it doesn't exist set it to NOT checked.
			//If previously set to 1, then trigger "click" event.
			if (!localStorage.getItem(settingID))
			{
				//phlogdev(settingID + ' not found.');
			} else if (localStorage.getItem(settingID) === "1") {
				$("#" + settingID).trigger('click');
			}
		}
		
		//Function to add Shift+ to upper case KBS
		function parseKBSShift(kbs) {
			if (kbs.match(/^[A-Z]{1}$/g) !== null) { // If upper case, then add a Shift+
				kbs = 'Shift+' + kbs;
			}
			return kbs;
		}
		
		// Function to check shortcut conflict
		function checkWMEPH_KBSconflict(KBS) {
			var LSString = '';
			if (!isDevVersion) {
				LSString = devVersStringMaster;
			} 
			if ( localStorage.getItem('WMEPH-KeyboardShortcut'+LSString) === null || localStorage.getItem('WMEPH-KBSModifierKey'+LSString) === null ) {
				return false;
			} else if ( parseKBSShift(localStorage.getItem('WMEPH-KeyboardShortcut'+LSString)) === KBS && localStorage.getItem('WMEPH-KBSModifierKey'+devVersStringMaster) === localStorage.getItem('WMEPH-KBSModifierKey') ) {
				return true;
			} else {
				return false;
			}
		}
		
		// Save settings prefs
		function saveSettingToLocalStorage(settingID) {
			if ($("#" + settingID).prop('checked')) {
				localStorage.setItem(settingID, '1');
			} else {
				localStorage.setItem(settingID, '0');
			}	
		}
		
		// This function validates that the inputted text is a JSON
		function validateWLS(jsonString) {
			"use strict";
			try {
				var objTry = JSON.parse(jsonString);
				if (objTry && typeof objTry === "object" && objTry !== null) {
					return objTry;
				}
			}
			catch (e) { }
			return false;
		}

		// This function merges and updates venues from object vWL_2 into vWL_1
		function mergeWL(vWL_1,vWL_2) {
			"use strict";
			var venueKey, WLKey, vWL_1_Venue, vWL_2_Venue;
			for (venueKey in vWL_2) {
				if (vWL_2.hasOwnProperty(venueKey)) {  // basic filter
					if (vWL_1.hasOwnProperty(venueKey)) {  // if the vWL_2 venue is in vWL_1, then update any keys
						vWL_1_Venue = vWL_1[venueKey];
						vWL_2_Venue = vWL_2[venueKey];
						for (WLKey in vWL_2_Venue) {  // loop thru the venue WL keys
							if (vWL_2_Venue.hasOwnProperty(WLKey) && vWL_2_Venue[WLKey].active) {  // Only update if the vWL_2 key is active
								if ( vWL_1_Venue.hasOwnProperty(WLKey) && vWL_1_Venue[WLKey].active ) {  // if the key is in the vWL_1 venue and it is active, then push any array data onto the key
									if (vWL_1_Venue[WLKey].hasOwnProperty('WLKeyArray')) {
										vWL_1[venueKey][WLKey].WLKeyArray = insertAtIX(vWL_1[venueKey][WLKey].WLKeyArray,vWL_2[venueKey][WLKey].WLKeyArray,100);
									}
								} else {  // if the key isn't in the vWL_1 venue, or if it's inactive, then copy the vWL_2 key across
									vWL_1[venueKey][WLKey] = vWL_2[venueKey][WLKey];
								}
							} 
						} // END subLoop for venue keys
					} else {  // if the venue doesn't exist in vWL_1, then add it
						vWL_1[venueKey] = vWL_2[venueKey];
					}
				}
			}
			return vWL_1;
		}
		
		// Get services checkbox status
		function getServicesChecks() {
			var servArrayCheck = [];
			for (var wsix=0; wsix<WMEServicesArray.length; wsix++) {
				if ($("#service-checkbox-" + WMEServicesArray[wsix]).prop('checked')) {
					servArrayCheck[wsix] = true;
				} else {
					servArrayCheck[wsix] = false;
				}
			}
			return servArrayCheck;
		}
		
		function updateServicesChecks(bannServ) {
			var servArrayCheck = getServicesChecks(), wsix=0;
			for (var keys in bannServ) {
				if (bannServ.hasOwnProperty(keys)) {
					bannServ[keys].checked = servArrayCheck[wsix];  // reset all icons to match any checked changes
					bannServ[keys].active = bannServ[keys].active || servArrayCheck[wsix];  // display any manually checked non-active icons
					wsix++;
				}
			}
		}
				
		// Focus away from the current cursor focus, to set text box changes
		function blurAll() {
			var tmp = document.createElement("input");
			document.body.appendChild(tmp);
			tmp.focus();
			document.body.removeChild(tmp);
		}
		
		// Pulls the item PL
		function getItemPL() {
			// Append a form div if it doesn't exist yet:
			if ( $('#WMEPH_formDiv').length ===0 ) {
				var tempDiv = document.createElement('div');
				tempDiv.id = 'WMEPH_formDiv';
				tempDiv.style.display = 'inline';
				$(".WazeControlPermalink").append(tempDiv);
			}
			// Return the current PL
			if ($(".WazeControlPermalink").length === 0) {
				phlog("Waiting for PL div");
				setTimeout(getItemPL, 500);
				return;
			}
			if ( $(".WazeControlPermalink").children(".icon-link").length > 0 ) {
				return $(".WazeControlPermalink").children(".icon-link")[0].href;
			} else if ( $(".WazeControlPermalink").children(".fa-link").length > 0 ) {
				return $(".WazeControlPermalink").children(".fa-link")[0].href;
			}
			return  '';
		}
		
		// Sets up error reporting
		function WMEPH_errorReport(data) {
			data.preview = 'Preview';
			data.attach_sig = 'on';
			if (PMUserList.hasOwnProperty('WMEPH') && PMUserList.WMEPH.approvalActive) {
				data['address_list[u]['+PMUserList.WMEPH.modID+']'] = 'to'; 
				WMEPH_newForumPost('https://www.waze.com/forum/ucp.php?i=pm&mode=compose', data);
			} else {
				data.addbbcode20 = 'to';
				data.notify = 'on';
				WMEPH_newForumPost(WMEPHurl + '#preview', data);
			}	
		}  // END WMEPH_errorReport function
		
		// Make a populated post on a forum thread
		function WMEPH_newForumPost(url, data) {
			var form = document.createElement('form');
			form.target = '_blank';
			form.action = url;
			form.method = 'post';
			form.style.display = 'none';
			for (var k in data) {
				if (data.hasOwnProperty(k)) {
					var input;
					if (k === 'message') {
						input = document.createElement('textarea');
					} else if (k === 'username') {
						input = document.createElement('username_list');
					} else {
						input = document.createElement('input');
					}
					input.name = k;
					input.value = data[k];
					input.type = 'hidden';
					form.appendChild(input);
				}
			}
			document.getElementById('WMEPH_formDiv').appendChild(form);
			form.submit();
			document.getElementById('WMEPH_formDiv').removeChild(form);
			return true;
		}  // END WMEPH_newForumPost function

		/**
		 * Updates the geometry of a place.
		 * @param place {Waze venue object} The place to update.
		 * @param newGeometry {OL.Geometry} The new geometry for the place.
		 */
		function updateFeatureGeometry(place, newGeometry) {
			var oldGeometry,
				model = W.model.venues,
				wmeUpdateFeatureGeometry = require('Waze/Action/UpdateFeatureGeometry');
			if (place && place.CLASS_NAME === 'Waze.Feature.Vector.Landmark' &&
				newGeometry && (newGeometry instanceof OL.Geometry.Point || 
				newGeometry instanceof OL.Geometry.Polygon)) {
				oldGeometry = place.attributes.geometry;
				W.model.actionManager.add(
					new wmeUpdateFeatureGeometry(place, model, oldGeometry, newGeometry));
				}
		}
		
		// Function that checks current place against the Harmonization Data.  Returns place data or "NoMatch"		
		function harmoList(itemName,state2L,region3L,country,itemCats) {
			var PNH_DATA_headers;
			var ixendPNH_NAMES;
			if (country === 'USA') {
				PNH_DATA_headers = USA_PNH_DATA[0].split("|");  // pull the data header names
				ixendPNH_NAMES = USA_PNH_NAMES.length;
			} else if (country === 'CAN') {
				PNH_DATA_headers = CAN_PNH_DATA[0].split("|");  // pull the data header names
				ixendPNH_NAMES = CAN_PNH_NAMES.length;
			} else {
					alert("No PNH data exists for this country.");
					return ["NoMatch"];
			}
			var ph_name_ix = PNH_DATA_headers.indexOf("ph_name");
			var ph_category1_ix = PNH_DATA_headers.indexOf("ph_category1");
			var ph_forcecat_ix = PNH_DATA_headers.indexOf("ph_forcecat");  // Force the category match
			var ph_region_ix = PNH_DATA_headers.indexOf("ph_region");  // Find the index for regions
			var ph_order_ix = PNH_DATA_headers.indexOf("ph_order");
			var ph_speccase_ix = PNH_DATA_headers.indexOf("ph_speccase");
			var ph_searchnameword_ix = PNH_DATA_headers.indexOf("ph_searchnameword");
			var nameComps;  // filled with search names to compare against place name
			var PNHPriCat;  // Primary category of PNH data
			var PNHForceCat;  // Primary category of PNH data
			var approvedRegions;  // filled with the regions that are approved for the place, when match is found
			var matchPNHData = [];  // array of matched data
			var matchPNHRegionData = [];  // array of matched data with regional approval
			var currMatchData, PNHMatchData, specCases, nmix, allowMultiMatch = false;
			var currMatchNum = 0;  // index for multiple matches, currently returns on first match
			var PNHOrderNum = [];
			var PNHNameTemp = [];
			var PNHNameMatch = false;  // tracks match status
			var PNHStringMatch = false;  // compares name string match 
			var PNHMatchProceed;  // tracks match status
			itemName = itemName.toUpperCase();  // UpperCase the current place name (The Holly And Ivy Pub #23 --> THE HOLLY AND IVY PUB #23 )
			itemName = itemName.replace(/ AND /g, ' ');  // Clear the word " AND " from the name (THE HOLLY AND IVY PUB #23 --> THE HOLLY IVY PUB #23 )
			itemName = itemName.replace(/^THE /g, '');  // Clear the word "THE " from the start of the name ( THE HOLLYIVY PUB #23 -- > HOLLY IVY PUB #23 )
			var itemNameSpace = itemName.replace(/[^A-Z0-9 ]/g, ' ');  // Clear all non-letter and non-number characters except spaces ( HOLLYIVY PUB #23 -- > HOLLY IVY PUB  23 )
			itemNameSpace = ' '+itemNameSpace.replace(/ {2,}/g, ' ')+' ';  // Make double spaces into singles ( HOLLY IVY PUB  23 -- > HOLLY IVY PUB 23 )
			itemName = itemName.replace(/[^A-Z0-9]/g, '');  // Clear all non-letter and non-number characters ( HOLLYIVY PUB #23 -- > HOLLYIVYPUB23 )
			var itemNameNoNum = itemName.replace(/[^A-Z]/g, '');  // Clear non-letter characters for alternate match ( HOLLYIVYPUB23 --> HOLLYIVYPUB ) 
			
			// Search performance stats
			var t0; var t1;
			if (devUser) {
				t0 = performance.now();  // Speed check start
			}
			
			// for each place on the PNH list (skipping headers at index 0)
			// phlogdev(ixendPNH_NAMES);
			for (var phnum=1; phnum<ixendPNH_NAMES; phnum++) { 
				PNHMatchProceed = false; 
				PNHStringMatch = false;
				if (country === 'USA') {
					nameComps = USA_PNH_NAMES[phnum].split("|");  // splits all possible search names for the current PNH entry
					PNHMatchData = USA_PNH_DATA[phnum];
				} else if (country === 'CAN') {
					nameComps = CAN_PNH_NAMES[phnum].split("|");  // splits all possible search names for the current PNH entry
					PNHMatchData = CAN_PNH_DATA[phnum];
				}
				currMatchData = PNHMatchData.split("|");  // Split the PNH place data into string array
				// Name Matching
				specCases = currMatchData[ph_speccase_ix];
				if (specCases.indexOf('strMatchAny') > -1 || currMatchData[ph_category1_ix] === 'Hotel') {  // Match any part of WME name with either the PNH name or any spaced names
					allowMultiMatch = true;
					var spaceMatchList = [];
					spaceMatchList.push( currMatchData[ph_name_ix].toUpperCase().replace(/ AND /g, ' ').replace(/^THE /g, '').replace(/[^A-Z0-9 ]/g, ' ').replace(/ {2,}/g, ' ') );
					if (currMatchData[ph_searchnameword_ix] !== '') {
						spaceMatchList.push.apply( spaceMatchList,currMatchData[ph_searchnameword_ix].toUpperCase().replace(/, /g,',').split(',') );
					}
					for (nmix=0; nmix<spaceMatchList.length; nmix++) {
						if ( itemNameSpace.includes(' '+spaceMatchList[nmix]+' ') ) {
							PNHStringMatch = true;
						}
					}
				} else if (specCases.indexOf('strMatchStart') > -1) {  //  Match the beginning part of WME name with any search term
					for (nmix=0; nmix<nameComps.length; nmix++) {
						if ( itemName.startsWith(nameComps[nmix]) || itemNameNoNum.startsWith(nameComps[nmix]) ) {
							PNHStringMatch = true;
						}
					}
				} else if (specCases.indexOf('strMatchEnd') > -1) {  //  Match the end part of WME name with any search term
					for (nmix=0; nmix<nameComps.length; nmix++) {
						if ( itemName.endsWith(nameComps[nmix]) || itemNameNoNum.endsWith(nameComps[nmix]) ) {
							PNHStringMatch = true;
						}
					}
				} else {  // full match of any term only
					if ( nameComps.indexOf(itemName) > -1 || nameComps.indexOf(itemNameNoNum) > -1 ) {
						PNHStringMatch = true;
					}
				}
				// if a match was found:
				if ( PNHStringMatch ) {  // Compare WME place name to PNH search name list
					console.log('Matched PNH Order No.: '+currMatchData[ph_order_ix]);
					
					PNHPriCat = catTranslate(currMatchData[ph_category1_ix]);
					PNHForceCat = currMatchData[ph_forcecat_ix];
					if (itemCats[0] === "GAS_STATION") {  // Gas stations only harmonized if the WME place category is already gas station (prevents Costco Gas becoming Costco Store) 
						PNHForceCat = "1";
					}
					if ( PNHForceCat === "1" && itemCats.indexOf(PNHPriCat) === 0 ) {  // Name and primary category match
						PNHMatchProceed = true; 
					} else if ( PNHForceCat === "2" && itemCats.indexOf(PNHPriCat) > -1 ) {  // Name and any category match
						PNHMatchProceed = true; 
					} else if ( PNHForceCat === "0" || PNHForceCat === "") {  // Name only match
						PNHMatchProceed = true; 
					}
					
					if (PNHMatchProceed) {
						approvedRegions = currMatchData[ph_region_ix].replace(/ /g, '').toUpperCase().split(",");  // remove spaces, upper case the approved regions, and split by commas
						if (approvedRegions.indexOf(state2L) > -1 || approvedRegions.indexOf(region3L) > -1 ||  // if the WME-selected item matches the state, region
						approvedRegions.indexOf(country) > -1 ||  //  OR if the country code is in the data then it is approved for all regions therein 
						$("#WMEPH-RegionOverride" + devVersStr).prop('checked')) {  // OR if region override is selected (dev setting
							if (devUser) {
								t1 = performance.now();  // log search time
								//phlogdev("Found place in " + (t1 - t0) + " milliseconds.");
							}
							matchPNHRegionData.push(PNHMatchData);
							bannButt.placeMatched.active = true;
							if (!allowMultiMatch) {
								return matchPNHRegionData;  // Return the PNH data string array to the main script
							} 
						} else {
							PNHNameMatch = true;  // PNH match found (once true, stays true)
							//matchPNHData.push(PNHMatchData);  // Pull the data line from the PNH data table.  (**Set in array for future multimatch features)
							PNHNameTemp.push(currMatchData[ph_name_ix]);  // temp name for approval return
							PNHOrderNum.push(currMatchData[ph_order_ix]);  // temp order number for approval return
						}
						
						currMatchNum++;  // *** Multiple matches for future work
					}
				} 
			}  // END loop through PNH places
			
			// If NO (name & region) match was found:
			if (bannButt.placeMatched.active) {
				return matchPNHRegionData;
			} else if (PNHNameMatch) {  // if a name match was found but not for region, prod the user to get it approved
				bannButt.ApprovalSubmit.active = true;
				//phlogdev("PNH data exists but not approved for this area.");	
				if (devUser) {
					t1 = performance.now();  // log search time
					//phlogdev("Searched all PNH entries in " + (t1 - t0) + " milliseconds.");
				}
				return ["ApprovalNeeded", PNHNameTemp, PNHOrderNum];
			} else {  // if no match was found, suggest adding the place to the sheet if it's a chain
				bannButt.NewPlaceSubmit.active = true;
				//phlogdev("Place not found in the " + country + " PNH list.");	
				if (devUser) {
					t1 = performance.now();  // log search time
					//phlogdev("Searched all PNH entries in " + (t1 - t0) + " milliseconds.");
				}
				return ["NoMatch"];
			}
		} // END harmoList function
		
		// KB Shortcut object
		var shortcut = {
			'all_shortcuts': {}, //All the shortcuts are stored in this array
			'add': function(shortcut_combination, callback, opt) {
				//Provide a set of default options
				var default_options = { 'type': 'keydown', 'propagate': false, 'disable_in_input': false, 'target': document, 'keycode': false };
				if (!opt) {opt = default_options;}
				else {
					for (var dfo in default_options) {
						if (typeof opt[dfo] === 'undefined') {opt[dfo] = default_options[dfo];}
					}
				}
				var ele = opt.target;
				if (typeof opt.target === 'string') {ele = document.getElementById(opt.target);}
				// var ths = this;
				shortcut_combination = shortcut_combination.toLowerCase();
				//The function to be called at keypress
				var func = function(e) {
					e = e || window.event;
					if (opt.disable_in_input) { //Don't enable shortcut keys in Input, Textarea fields
						var element;
						if (e.target) {element = e.target;}
						else if (e.srcElement) {element = e.srcElement;}
						if (element.nodeType === 3) {element = element.parentNode;}
						if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {return;}
					}
					//Find Which key is pressed
					var code;
					if (e.keyCode) {code = e.keyCode;}
					else if (e.which) {code = e.which;}
					var character = String.fromCharCode(code).toLowerCase();
					if (code === 188) {character = ",";} //If the user presses , when the type is onkeydown
					if (code === 190) {character = ".";} //If the user presses , when the type is onkeydown
					var keys = shortcut_combination.split("+");
					//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
					var kp = 0;
					//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
					var shift_nums = { "`": "~","1": "!","2": "@","3": "#","4": "$","5": "%","6": "^","7": "&",
							"8": "*","9": "(","0": ")","-": "_","=": "+",";": ":","'": "\"",",": "<",".": ">","/": "?","\\": "|" };
						//Special Keys - and their codes
					var special_keys = { 'esc': 27,'escape': 27,'tab': 9,'space': 32,'return': 13,'enter': 13,'backspace': 8,'scrolllock': 145,
						'scroll_lock': 145,'scroll': 145,'capslock': 20,'caps_lock': 20,'caps': 20,'numlock': 144,'num_lock': 144,'num': 144,
						'pause': 19,'break': 19,'insert': 45,'home': 36,'delete': 46,'end': 35,'pageup': 33,'page_up': 33,'pu': 33,'pagedown': 34,
						'page_down': 34,'pd': 34,'left': 37,'up': 38,'right': 39,'down': 40,'f1': 112,'f2': 113,'f3': 114,'f4': 115,'f5': 116,
						'f6': 117,'f7': 118,'f8': 119,'f9': 120,'f10': 121,'f11': 122,'f12': 123 };
					var modifiers = {
						shift: { wanted: false, pressed: false },
						ctrl: { wanted: false, pressed: false },
						alt: { wanted: false, pressed: false },
						meta: { wanted: false, pressed: false } //Meta is Mac specific
					};
					if (e.ctrlKey) {modifiers.ctrl.pressed = true;}
					if (e.shiftKey) {modifiers.shift.pressed = true;}
					if (e.altKey) {modifiers.alt.pressed = true;}
					if (e.metaKey) {modifiers.meta.pressed = true;}
					var k;
					for (var i = 0; k = keys[i], i < keys.length; i++) {
						//Modifiers
						if (k === 'ctrl' || k === 'control') {
							kp++;
							modifiers.ctrl.wanted = true;
						} else if (k === 'shift') {
							kp++;
							modifiers.shift.wanted = true;
						} else if (k === 'alt') {
							kp++;
							modifiers.alt.wanted = true;
						} else if (k === 'meta') {
							kp++;
							modifiers.meta.wanted = true;
						} else if (k.length > 1) { //If it is a special key
							if (special_keys[k] === code) {kp++;}
						} else if (opt.keycode) {
							if (opt.keycode === code) {kp++;}
						} else { //The special keys did not match
							if (character === k) {kp++;}
							else {
								if (shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
									character = shift_nums[character];
									if (character === k) {kp++;}
								}
							}
						}
					}
	
					if (kp === keys.length && modifiers.ctrl.pressed === modifiers.ctrl.wanted && modifiers.shift.pressed === modifiers.shift.wanted && 
						modifiers.alt.pressed === modifiers.alt.wanted && modifiers.meta.pressed === modifiers.meta.wanted) {
						callback(e);
						if (!opt.propagate) { //Stop the event
							//e.cancelBubble is supported by IE - this will kill the bubbling process.
							e.cancelBubble = true;
							e.returnValue = false;
							//e.stopPropagation works in Firefox.
							if (e.stopPropagation) {
								e.stopPropagation();
								e.preventDefault();
							}
							return false;
						}
					}
				};
				this.all_shortcuts[shortcut_combination] = { 'callback': func, 'target': ele, 'event': opt.type };
				//Attach the function with the event
				if (ele.addEventListener) {ele.addEventListener(opt.type, func, false);}
				else if (ele.attachEvent) {ele.attachEvent('on' + opt.type, func);}
				else {ele['on' + opt.type] = func;}
			},
			//Remove the shortcut - just specify the shortcut and I will remove the binding
			'remove': function(shortcut_combination) {
				shortcut_combination = shortcut_combination.toLowerCase();
				var binding = this.all_shortcuts[shortcut_combination];
				delete(this.all_shortcuts[shortcut_combination]);
				if (!binding) {return;}
				var type = binding.event;
				var ele = binding.target;
				var callback = binding.callback;
				if (ele.detachEvent) {ele.detachEvent('on' + type, callback);}
				else if (ele.removeEventListener) {ele.removeEventListener(type, callback, false);}
				else {ele['on' + type] = false;}
			}
		};  // END Shortcut function
		
		function phlogdev(m) {
			if ('object' === typeof m) {
				m = JSON.stringify(m);
			}
			if (devUser) {
				console.log('WMEPH' + devVersStrDash + ': ' + m);
			}
		}
	} // END runPH Function
		
	
	// This function runs at script load, and splits the category dataset into the searchable categories.
	function makeCatCheckList(CH_DATA) {  // Builds the list of search names to match to the WME place name
		var CH_CATS = [];
		var CH_DATA_headers = CH_DATA[0].split("|");  // split the data headers out
		var pc_wmecat_ix = CH_DATA_headers.indexOf("pc_wmecat");  // find the indices needed for the function
		var chEntryTemp;
		for (var chix=0; chix<CH_DATA.length; chix++) {  // loop through all PNH places
			chEntryTemp = CH_DATA[chix].split("|");  // split the current PNH data line 
			CH_CATS.push(chEntryTemp[pc_wmecat_ix]);
		}
		return CH_CATS;
	} // END makeCatCheckList function
	
	// This function runs at script load, and builds the search name dataset to compare the WME selected place name to.
	function makeNameCheckList(PNH_DATA) {  // Builds the list of search names to match to the WME place name
		var PNH_NAMES = [];
		var PNH_DATA_headers = PNH_DATA[0].split("|");  // split the data headers out
		var ph_name_ix = PNH_DATA_headers.indexOf("ph_name");  // find the indices needed for the function
		var ph_aliases_ix = PNH_DATA_headers.indexOf("ph_aliases");
		var ph_category1_ix = PNH_DATA_headers.indexOf("ph_category1");
		var ph_searchnamebase_ix = PNH_DATA_headers.indexOf("ph_searchnamebase");
		var ph_searchnamemid_ix = PNH_DATA_headers.indexOf("ph_searchnamemid");
		var ph_searchnameend_ix = PNH_DATA_headers.indexOf("ph_searchnameend");
		var ph_disable_ix = PNH_DATA_headers.indexOf("ph_disable");
		var ph_speccase_ix = PNH_DATA_headers.indexOf("ph_speccase");
			
		var t0 = performance.now(); // Speed check start
		var newNameListLength;  // static list length
		
		for (var pnhix=0; pnhix<PNH_DATA.length; pnhix++) {  // loop through all PNH places
			var pnhEntryTemp = PNH_DATA[pnhix].split("|");  // split the current PNH data line 
			if (pnhEntryTemp[ph_disable_ix] !== "1" || pnhEntryTemp[ph_speccase_ix].indexOf('betaEnable') > -1 ) {
				var newNameList = pnhEntryTemp[ph_name_ix].toUpperCase();  // pull out the primary PNH name & upper case it
				newNameList = newNameList.replace(/ AND /g, '');  // Clear the word "AND" from the name
				newNameList = newNameList.replace(/^THE /g, '');  // Clear the word "THE" from the start of the name
				newNameList = [newNameList.replace(/[^A-Z0-9]/g, '')];  // Clear non-letter and non-number characters, store in array
				
				if (pnhEntryTemp[ph_disable_ix] !== "altName") {
					// Add any aliases
					var tempAliases = pnhEntryTemp[ph_aliases_ix].toUpperCase();
					if ( tempAliases !== '' && tempAliases !== '0' && tempAliases !== '') {
						tempAliases = tempAliases.replace(/,[^A-za-z0-9]*/g, ",").split(",");  // tighten and split aliases
						for (var alix=0; alix<tempAliases.length; alix++) {
							newNameList.push( tempAliases[alix].replace(/ AND /g, '').replace(/^THE /g, '').replace(/[^A-Z0-9]/g, '') );
						}
					}
				}
				
				// The following code sets up alternate search names as outlined in the PNH dataset.  
				// Formula, with P = PNH primary; A1, A2 = PNH aliases; B1, B2 = base terms; M1, M2 = mid terms; E1, E2 = end terms
				// Search list will build: P, A, B, PM, AM, BM, PE, AE, BE, PME, AME, BME.  
				// Multiple M terms are applied singly and in pairs (B1M2M1E2).  Multiple B and E terms are applied singly (e.g B1B2M1 not used).
				// Any doubles like B1E2=P are purged at the end to eliminate redundancy.
				if (pnhEntryTemp[ph_searchnamebase_ix] !== "0" || pnhEntryTemp[ph_searchnamebase_ix] !== "") {   // If base terms exist, otherwise only the primary name is matched
					var pnhSearchNameBase = pnhEntryTemp[ph_searchnamebase_ix].replace(/[^A-Za-z0-9,]/g, '');  // clear non-letter and non-number characters (keep commas)
					pnhSearchNameBase = pnhSearchNameBase.toUpperCase().split(",");  // upper case and split the base-name  list
					newNameList.push.apply(newNameList,pnhSearchNameBase);   // add them to the search base list
					
					if (pnhEntryTemp[ph_searchnamemid_ix] !== "0" || pnhEntryTemp[ph_searchnamemid_ix] !== "") {  // if middle search term add-ons exist
						var pnhSearchNameMid = pnhEntryTemp[ph_searchnamemid_ix].replace(/[^A-Za-z0-9,]/g, '');  // clear non-letter and non-number characters
						pnhSearchNameMid = pnhSearchNameMid.toUpperCase().split(",");  // upper case and split
						if (pnhSearchNameMid.length > 1) {  // if there are more than one mid terms, it adds a permutation of the first 2
							pnhSearchNameMid.push.apply( pnhSearchNameMid,[ pnhSearchNameMid[0]+pnhSearchNameMid[1],pnhSearchNameMid[1]+pnhSearchNameMid[0] ] );
						}
						newNameListLength = newNameList.length;
						for (var extix=1; extix<newNameListLength; extix++) {  // extend the list by adding Mid terms onto the SearchNameBase names
							for (var altix=0; altix<pnhSearchNameMid.length; altix++) {
								newNameList.push(newNameList[extix]+pnhSearchNameMid[altix] );
							}
						}
					}
					
					if (pnhEntryTemp[ph_searchnameend_ix] !== "0" || pnhEntryTemp[ph_searchnameend_ix] !== "") {  // if end search term add-ons exist
						var pnhSearchNameEnd = pnhEntryTemp[ph_searchnameend_ix].replace(/[^A-Za-z0-9,]/g, '');  // clear non-letter and non-number characters
						pnhSearchNameEnd = pnhSearchNameEnd.toUpperCase().split(",");  // upper case and split
						newNameListLength = newNameList.length;
						for (var exetix=1; exetix<newNameListLength; exetix++) {  // extend the list by adding End terms onto all the SearchNameBase & Base+Mid names
							for (var aletix=0; aletix<pnhSearchNameEnd.length; aletix++) {
								newNameList.push(newNameList[exetix]+pnhSearchNameEnd[aletix] );
							}
						}
					}
				}
				// Clear out any empty entries
				var newNameListTemp = [];
				for ( catix=0; catix<newNameList.length; catix++) {  // extend the list by adding Hotel to all items
					if (newNameList[catix].length > 1) {
						newNameListTemp.push(newNameList[catix]);
					}
				}
				newNameList = newNameListTemp;
				// Next, add extensions to the search names based on the WME place category
				newNameListLength = newNameList.length;
				var catix;
				if (pnhEntryTemp[ph_category1_ix].toUpperCase().replace(/[^A-Za-z0-9]/g, '') === "HOTEL") {
					for ( catix=0; catix<newNameListLength; catix++) {  // extend the list by adding Hotel to all items
						newNameList.push(newNameList[catix]+"HOTEL");
					}
				} else if (pnhEntryTemp[ph_category1_ix].toUpperCase().replace(/[^A-Za-z0-9]/g, '') === "BANKFINANCIAL") {
					for ( catix=0; catix<newNameListLength; catix++) {  // extend the list by adding Bank and ATM to all items
						newNameList.push(newNameList[catix]+"BANK");
						newNameList.push(newNameList[catix]+"ATM");
					}
				} else if (pnhEntryTemp[ph_category1_ix].toUpperCase().replace(/[^A-Za-z0-9]/g, '') === "SUPERMARKETGROCERY") {
					for ( catix=0; catix<newNameListLength; catix++) {  // extend the list by adding Supermarket to all items
						newNameList.push(newNameList[catix]+"SUPERMARKET");
					}
				} else if (pnhEntryTemp[ph_category1_ix].toUpperCase().replace(/[^A-Za-z0-9]/g, '') === "GYMFITNESS") {
					for ( catix=0; catix<newNameListLength; catix++) {  // extend the list by adding Gym to all items
						newNameList.push(newNameList[catix]+"GYM");
					}
				} else if (pnhEntryTemp[ph_category1_ix].toUpperCase().replace(/[^A-Za-z0-9]/g, '') === "GASSTATION") {
					for ( catix=0; catix<newNameListLength; catix++) {  // extend the list by adding Gas terms to all items
						newNameList.push(newNameList[catix]+"GAS");
						newNameList.push(newNameList[catix]+"GASOLINE");
						newNameList.push(newNameList[catix]+"FUEL");
						newNameList.push(newNameList[catix]+"STATION");
						newNameList.push(newNameList[catix]+"GASSTATION");
					}
				} else if (pnhEntryTemp[ph_category1_ix].toUpperCase().replace(/[^A-Za-z0-9]/g, '') === "CARRENTAL") {
					for ( catix=0; catix<newNameListLength; catix++) {  // extend the list by adding Car Rental terms to all items
						newNameList.push(newNameList[catix]+"RENTAL");
						newNameList.push(newNameList[catix]+"RENTACAR");
						newNameList.push(newNameList[catix]+"CARRENTAL");
						newNameList.push(newNameList[catix]+"RENTALCAR");
					}
				} 
				newNameList = uniq(newNameList);  // remove any duplicate search names
				newNameList = newNameList.join("|");  // join the list with |
				newNameList = newNameList.replace(/\|{2,}/g, '|');
				newNameList = newNameList.replace(/\|+$/g, '');
				PNH_NAMES.push(newNameList);  // push the list to the master search list
			} else { // END if valid line
				PNH_NAMES.push('00');
			}
		}
		var t1 = performance.now();  // log search time
		//phlog("Built search list of " + PNH_DATA.length + " PNH places in " + (t1 - t0) + " milliseconds.");
		return PNH_NAMES;
	}  // END makeNameCheckList
	
	// Whitelist stringifying and parsing
	function saveWL_LS(compress) {
		venueWhitelistStr = JSON.stringify(venueWhitelist);
		if (compress) {
			if (venueWhitelistStr.length < 4800000 ) {  // Also save to regular storage as a back up
				localStorage.setItem(WLlocalStoreName, venueWhitelistStr);
			}
			venueWhitelistStr = LZString.compressToUTF16(venueWhitelistStr);
			localStorage.setItem(WLlocalStoreNameCompressed, venueWhitelistStr);
		} else {
			localStorage.setItem(WLlocalStoreName, venueWhitelistStr);
		}
 	}
	function loadWL_LS(decompress) {
		if (decompress) {
			venueWhitelistStr = localStorage.getItem(WLlocalStoreNameCompressed);
			venueWhitelistStr = LZString.decompressFromUTF16(venueWhitelistStr);
		} else {
			venueWhitelistStr = localStorage.getItem(WLlocalStoreName);
		}
		venueWhitelist = JSON.parse(venueWhitelistStr);
	}
	function backupWL_LS(compress) {
		venueWhitelistStr = JSON.stringify(venueWhitelist);
		if (compress) {
			venueWhitelistStr = LZString.compressToUTF16(venueWhitelistStr);
			localStorage.setItem(WLlocalStoreNameCompressed+Math.floor(Date.now() / 1000), venueWhitelistStr);
		} else {
			localStorage.setItem(WLlocalStoreName+Math.floor(Date.now() / 1000), venueWhitelistStr);
		}
 	}
	
	// Removes duplicate strings from string array
	function uniq(a) {
		"use strict";
		var seen = {};
		return a.filter(function(item) {
			return seen.hasOwnProperty(item) ? false : (seen[item] = true);
		});
	}  // END uniq function
	
	function phlog(m) {
		if ('object' === typeof m) {
			//m = JSON.stringify(m);
		}
        console.log('WMEPH' + devVersStrDash + ': ' + m);
    }
	
	function zoomPlace() {
		if (W.selectionManager.selectedItems.length === 1 && W.selectionManager.selectedItems[0].model.type === "venue") {
			W.map.moveTo(W.selectionManager.selectedItems[0].model.geometry.getCentroid().toLonLat(), 7);
		} else {
			W.map.moveTo(WMEPHmousePosition, 5);
		}
	}
	
	function sortWithIndex(toSort) {
		for (var i = 0; i < toSort.length; i++) {
			toSort[i] = [toSort[i], i];
		}
		toSort.sort(function(left, right) {
			return left[0] < right[0] ? -1 : 1;
		});
		toSort.sortIndices = [];
		for (var j = 0; j < toSort.length; j++) {
			toSort.sortIndices.push(toSort[j][1]);
			toSort[j] = toSort[j][0];
		}
		return toSort;
	}
	
	function destroyDupeLabels(){
		WMEPH_NameLayer.destroyFeatures();
		WMEPH_NameLayer.setVisibility(false);
	}
	
	// When a dupe is deleted, delete the dupe label
	function deleteDupeLabel(){
		//phlog('Clearing dupe label...');
		setTimeout(function() {
			var actionsList = W.model.actionManager.actions;
			var lastAction = actionsList[actionsList.length-1];
			if ( 'undefined' !== typeof lastAction && lastAction.hasOwnProperty('object') && lastAction.object.hasOwnProperty('state') && lastAction.object.state === 'Delete' ) {
				if ( dupeIDList.indexOf(lastAction.object.attributes.id) > -1 ) {
					if (dupeIDList.length === 2) {
						WMEPH_NameLayer.destroyFeatures();
						WMEPH_NameLayer.setVisibility(false);
					} else {
						var deletedDupe = WMEPH_NameLayer.getFeaturesByAttribute('dupeID', lastAction.object.attributes.id) ;
						WMEPH_NameLayer.removeFeatures(deletedDupe);
						dupeIDList.splice(dupeIDList.indexOf(lastAction.object.attributes.id),1);
					}
					phlog('Deleted a dupe');
				}
			} 
			/*
			else if ('undefined' !== typeof lastAction && lastAction.hasOwnProperty('feature') && lastAction.feature.hasOwnProperty('state') && lastAction.object.state === 'Update' &&
			lastAction.hasOwnProperty('newGeometry') ) {
				// update position of marker
			}
			*/
		},20);
	}
	
	//  Whitelist an item
	function whitelistAction(itemID, wlKeyName) {
		'use strict';
		var item = W.selectionManager.selectedItems[0].model;
		var addressTemp = item.getAddress();
		if ( addressTemp.hasOwnProperty('attributes') ) {
			addressTemp = addressTemp.attributes;
		}
		var itemGPS = OpenLayers.Layer.SphericalMercator.inverseMercator(item.attributes.geometry.getCentroid().x,item.attributes.geometry.getCentroid().y);
		if (!venueWhitelist.hasOwnProperty(itemID)) {  // If venue is NOT on WL, then add it.
			venueWhitelist[itemID] = { };
		}
		venueWhitelist[itemID][wlKeyName] = {active: true};  // WL the flag for the venue
		venueWhitelist[itemID].city = addressTemp.city.name;  // Store city for the venue
		venueWhitelist[itemID].state = addressTemp.state.name;  // Store state for the venue
		venueWhitelist[itemID].country = addressTemp.country.name;  // Store country for the venue
		venueWhitelist[itemID].gps = itemGPS;  // Store GPS coords for the venue
		saveWL_LS(compressedWLLS);  // Save the WL to local storage
		WMEPH_WLCounter();
		bannButt2.clearWL.active = true;
	}
	
	// Keep track of how many whitelists have been added since the last pull, alert if over a threshold (100?)
	function WMEPH_WLCounter() {
		localStorage.WMEPH_WLAddCount = parseInt(localStorage.WMEPH_WLAddCount)+1;
		if (localStorage.WMEPH_WLAddCount > 50) {
			alert('Don\'t forget to periodically back up your Whitelist data using the Pull option in the WMEPH settings tab.');
			localStorage.WMEPH_WLAddCount = 2;
		}
	}
	
	// Run the script...
	placeHarmonizer_bootstrap();
			
	
	function insertCss( code ) {
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = code;
		document.head.appendChild( style );
	}  // END insertCss funtion
	
	var cssServButts =[
		'.serv-247 { width: 73px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
		'.serv-ac { width: 50px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
		'.serv-credit { width: 73px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
		'.serv-deliveries { width: 86px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
		'.serv-drivethru { width: 78px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
		'.serv-outdoor { width: 73px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
		'.serv-parking { width: 46px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
		'.serv-reservations { width: 55px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
		'.serv-restrooms { width: 49px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
		'.serv-takeaway { width: 34px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
		'.serv-valet { width: 50px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
		'.serv-wheelchair { width: 50px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
		'.serv-wifi { width: 67px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }'
		];
	
	
	for (var cssix=0; cssix<cssServButts.length; cssix++) {
		insertCss(cssServButts[cssix]);
	}
	
	// LZ Compressor
	// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
	// This work is free. You can redistribute it and/or modify it
	// under the terms of the WTFPL, Version 2
	// LZ-based compression algorithm, version 1.4.4
	var LZString = (function() {
		// private property
		var f = String.fromCharCode;
		var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
		var baseReverseDic = {};
	
		function getBaseValue(alphabet, character) {
			if (!baseReverseDic[alphabet]) {
				baseReverseDic[alphabet] = {};
				for (var i = 0; i < alphabet.length; i++) {
					baseReverseDic[alphabet][alphabet.charAt(i)] = i;
				}
			}
			return baseReverseDic[alphabet][character];
		}
		var LZString = {
			compressToBase64: function(input) {
				if (input === null) return "";
				var res = LZString._compress(input, 6, function(a) {
					return keyStrBase64.charAt(a);
				});
				switch (res.length % 4) { // To produce valid Base64
					default: // When could this happen ?
						case 0:
						return res;
					case 1:
							return res + "===";
					case 2:
							return res + "==";
					case 3:
							return res + "=";
				}
			},
			decompressFromBase64: function(input) {
				if (input === null) return "";
				if (input === "") return null;
				return LZString._decompress(input.length, 32, function(index) {
					return getBaseValue(keyStrBase64, input.charAt(index));
				});
			},
			compressToUTF16: function(input) {
				if (input === null) return "";
				return LZString._compress(input, 15, function(a) {
					return f(a + 32);
				}) + " ";
			},
			decompressFromUTF16: function(compressed) {
				if (compressed === null) return "";
				if (compressed === "") return null;
				return LZString._decompress(compressed.length, 16384, function(index) {
					return compressed.charCodeAt(index) - 32;
				});
			},
			
			compress: function(uncompressed) {
				return LZString._compress(uncompressed, 16, function(a) {
					return f(a);
				});
			},
			_compress: function(uncompressed, bitsPerChar, getCharFromInt) {
				if (uncompressed === null) return "";
				var i, value,
					context_dictionary = {},
					context_dictionaryToCreate = {},
					context_c = "",
					context_wc = "",
					context_w = "",
					context_enlargeIn = 2, // Compensate for the first entry which should not count
					context_dictSize = 3,
					context_numBits = 2,
					context_data = [],
					context_data_val = 0,
					context_data_position = 0,
					ii;
				for (ii = 0; ii < uncompressed.length; ii += 1) {
					context_c = uncompressed.charAt(ii);
					if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
						context_dictionary[context_c] = context_dictSize++;
						context_dictionaryToCreate[context_c] = true;
					}
					context_wc = context_w + context_c;
					if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
						context_w = context_wc;
					} else {
						if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
							if (context_w.charCodeAt(0) < 256) {
								for (i = 0; i < context_numBits; i++) {
									context_data_val = (context_data_val << 1);
									if (context_data_position === bitsPerChar - 1) {
										context_data_position = 0;
										context_data.push(getCharFromInt(context_data_val));
										context_data_val = 0;
									} else {
										context_data_position++;
									}
								}
								value = context_w.charCodeAt(0);
								for (i = 0; i < 8; i++) {
									context_data_val = (context_data_val << 1) | (value & 1);
									if (context_data_position === bitsPerChar - 1) {
										context_data_position = 0;
										context_data.push(getCharFromInt(context_data_val));
										context_data_val = 0;
									} else {
										context_data_position++;
									}
									value = value >> 1;
								}
							} else {
								value = 1;
								for (i = 0; i < context_numBits; i++) {
									context_data_val = (context_data_val << 1) | value;
									if (context_data_position === bitsPerChar - 1) {
										context_data_position = 0;
										context_data.push(getCharFromInt(context_data_val));
										context_data_val = 0;
									} else {
										context_data_position++;
									}
									value = 0;
								}
								value = context_w.charCodeAt(0);
								for (i = 0; i < 16; i++) {
									context_data_val = (context_data_val << 1) | (value & 1);
									if (context_data_position === bitsPerChar - 1) {
										context_data_position = 0;
										context_data.push(getCharFromInt(context_data_val));
										context_data_val = 0;
									} else {
										context_data_position++;
									}
									value = value >> 1;
								}
							}
							context_enlargeIn--;
							if (context_enlargeIn == 0) {
								context_enlargeIn = Math.pow(2, context_numBits);
								context_numBits++;
							}
							delete context_dictionaryToCreate[context_w];
						} else {
							value = context_dictionary[context_w];
							for (i = 0; i < context_numBits; i++) {
								context_data_val = (context_data_val << 1) | (value & 1);
								if (context_data_position === bitsPerChar - 1) {
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else {
									context_data_position++;
								}
								value = value >> 1;
							}
						}
						context_enlargeIn--;
						if (context_enlargeIn === 0) {
							context_enlargeIn = Math.pow(2, context_numBits);
							context_numBits++;
						}
						// Add wc to the dictionary.
						context_dictionary[context_wc] = context_dictSize++;
						context_w = String(context_c);
					}
				}
				// Output the code for w.
				if (context_w !== "") {
					if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
						if (context_w.charCodeAt(0) < 256) {
							for (i = 0; i < context_numBits; i++) {
								context_data_val = (context_data_val << 1);
								if (context_data_position === bitsPerChar - 1) {
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else {
									context_data_position++;
								}
							}
							value = context_w.charCodeAt(0);
							for (i = 0; i < 8; i++) {
								context_data_val = (context_data_val << 1) | (value & 1);
								if (context_data_position === bitsPerChar - 1) {
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else {
									context_data_position++;
								}
								value = value >> 1;
							}
						} else {
							value = 1;
							for (i = 0; i < context_numBits; i++) {
								context_data_val = (context_data_val << 1) | value;
								if (context_data_position === bitsPerChar - 1) {
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else {
									context_data_position++;
								}
								value = 0;
							}
							value = context_w.charCodeAt(0);
							for (i = 0; i < 16; i++) {
								context_data_val = (context_data_val << 1) | (value & 1);
								if (context_data_position === bitsPerChar - 1) {
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else {
									context_data_position++;
								}
								value = value >> 1;
							}
						}
						context_enlargeIn--;
						if (context_enlargeIn === 0) {
							context_enlargeIn = Math.pow(2, context_numBits);
							context_numBits++;
						}
						delete context_dictionaryToCreate[context_w];
					} else {
						value = context_dictionary[context_w];
						for (i = 0; i < context_numBits; i++) {
							context_data_val = (context_data_val << 1) | (value & 1);
							if (context_data_position === bitsPerChar - 1) {
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else {
								context_data_position++;
							}
							value = value >> 1;
						}
					}
					context_enlargeIn--;
					if (context_enlargeIn === 0) {
						context_enlargeIn = Math.pow(2, context_numBits);
						context_numBits++;
					}
				}
				// Mark the end of the stream
				value = 2;
				for (i = 0; i < context_numBits; i++) {
					context_data_val = (context_data_val << 1) | (value & 1);
					if (context_data_position === bitsPerChar - 1) {
						context_data_position = 0;
						context_data.push(getCharFromInt(context_data_val));
						context_data_val = 0;
					} else {
						context_data_position++;
					}
					value = value >> 1;
				}
				// Flush the last char
				while (true) {
					context_data_val = (context_data_val << 1);
					if (context_data_position === bitsPerChar - 1) {
						context_data.push(getCharFromInt(context_data_val));
						break;
					} else context_data_position++;
				}
				return context_data.join('');
			},
			decompress: function(compressed) {
				if (compressed === null) return "";
				if (compressed === "") return null;
				return LZString._decompress(compressed.length, 32768, function(index) {
					return compressed.charCodeAt(index);
				});
			},
			_decompress: function(length, resetValue, getNextValue) {
				var dictionary = [],
					next,
					enlargeIn = 4,
					dictSize = 4,
					numBits = 3,
					entry = "",
					result = [],
					i,
					w,
					bits, resb, maxpower, power,
					c,
					data = {
						val: getNextValue(0),
						position: resetValue,
						index: 1
					};
				for (i = 0; i < 3; i += 1) {
					dictionary[i] = i;
				}
				bits = 0;
				maxpower = Math.pow(2, 2);
				power = 1;
				while (power != maxpower) {
					resb = data.val & data.position;
					data.position >>= 1;
					if (data.position === 0) {
						data.position = resetValue;
						data.val = getNextValue(data.index++);
					}
					bits |= (resb > 0 ? 1 : 0) * power;
					power <<= 1;
				}
				switch (next = bits) {
					case 0:
						bits = 0;
						maxpower = Math.pow(2, 8);
						power = 1;
						while (power != maxpower) {
							resb = data.val & data.position;
							data.position >>= 1;
							if (data.position == 0) {
								data.position = resetValue;
								data.val = getNextValue(data.index++);
							}
							bits |= (resb > 0 ? 1 : 0) * power;
							power <<= 1;
						}
						c = f(bits);
						break;
					case 1:
						bits = 0;
						maxpower = Math.pow(2, 16);
						power = 1;
						while (power != maxpower) {
							resb = data.val & data.position;
							data.position >>= 1;
							if (data.position == 0) {
								data.position = resetValue;
								data.val = getNextValue(data.index++);
							}
							bits |= (resb > 0 ? 1 : 0) * power;
							power <<= 1;
						}
						c = f(bits);
						break;
					case 2:
						return "";
				}
				dictionary[3] = c;
				w = c;
				result.push(c);
				while (true) {
					if (data.index > length) {
						return "";
					}
					bits = 0;
					maxpower = Math.pow(2, numBits);
					power = 1;
					while (power != maxpower) {
						resb = data.val & data.position;
						data.position >>= 1;
						if (data.position == 0) {
							data.position = resetValue;
							data.val = getNextValue(data.index++);
						}
						bits |= (resb > 0 ? 1 : 0) * power;
						power <<= 1;
					}
					switch (c = bits) {
						case 0:
							bits = 0;
							maxpower = Math.pow(2, 8);
							power = 1;
							while (power != maxpower) {
								resb = data.val & data.position;
								data.position >>= 1;
								if (data.position == 0) {
									data.position = resetValue;
									data.val = getNextValue(data.index++);
								}
								bits |= (resb > 0 ? 1 : 0) * power;
								power <<= 1;
							}
							dictionary[dictSize++] = f(bits);
							c = dictSize - 1;
							enlargeIn--;
							break;
						case 1:
							bits = 0;
							maxpower = Math.pow(2, 16);
							power = 1;
							while (power != maxpower) {
								resb = data.val & data.position;
								data.position >>= 1;
								if (data.position == 0) {
									data.position = resetValue;
									data.val = getNextValue(data.index++);
								}
								bits |= (resb > 0 ? 1 : 0) * power;
								power <<= 1;
							}
							dictionary[dictSize++] = f(bits);
							c = dictSize - 1;
							enlargeIn--;
							break;
						case 2:
							return result.join('');
					}
					if (enlargeIn == 0) {
						enlargeIn = Math.pow(2, numBits);
						numBits++;
					}
					if (dictionary[c]) {
						entry = dictionary[c];
					} else {
						if (c === dictSize) {
							entry = w + w.charAt(0);
						} else {
							return null;
						}
					}
					result.push(entry);
					// Add w+entry[0] to the dictionary.
					dictionary[dictSize++] = w + entry.charAt(0);
					enlargeIn--;
					w = entry;
					if (enlargeIn == 0) {
						enlargeIn = Math.pow(2, numBits);
						numBits++;
					}
				}
			}
		};
		return LZString;
	})();
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return LZString;
		});
	} else if (typeof module !== 'undefined' && module !== null) {
		module.exports = LZString
	}
	
})();

//$('#service-checkbox-CREDIT_CARDS').siblings('label')[0].style="background-color:#dfd"
//$('.form-control')[8].style="background-color:#dfd"