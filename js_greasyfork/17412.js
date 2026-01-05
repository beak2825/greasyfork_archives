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
// @name		 Place Harmonizer
// @namespace 	 https://greasyfork.org/en/users/19426-bmtg
// @version	  1.0.73
// @description  Harmonizes, formats, and locks a selected place
// @author	   WMEPH development group
// @include         https://editor-beta.waze.com/*editor/*
// @include         https://www.waze.com/*editor/*
// @exclude          https://www.waze.com/*user/editor/*
// @grant	   none

// @downloadURL https://update.greasyfork.org/scripts/17412/Place%20Harmonizer.user.js
// @updateURL https://update.greasyfork.org/scripts/17412/Place%20Harmonizer.meta.js
// ==/UserScript==
(function () {
	// item = W.selectionManager.selectedItems[0].model
	var WMEPHversion = GM_info.script.version.toString(); // pull version from header
	var WMEPHversionMeta = WMEPHversion.match(/(\d+\.\d+)/i)[1];  // get the X.X version
	var majorNewFeature = true;  // set to true to make an alert pop up after script update with new feature
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
	var defaultKBShortcut,shortcutParse, modifKey = 'Alt+';
	var forumMsgInputs;
	var venueWhitelist, venueWhitelistStr, WLSToMerge, wlKeyName, wlButtText = 'WL';  // Whitelisting vars
	var WLlocalStoreName = 'WMEPH-venueWhitelistNew';
	var WMEPH_NameLayer, nameLayer, dupeIDList = [], dupeHNRangeList, dupeHNRangeIDList, dupeHNRangeDistList;
	// Web search Window forming:
	var searchResultsWindowSpecs = '"resizable=yes, top='+ Math.round(window.screen.height*0.1) +', left='+ Math.round(window.screen.width*0.3) +', width='+ Math.round(window.screen.width*0.7) +', height='+ Math.round(window.screen.height*0.8) +'"';
	var searchResultsWindowName = '"WMEPH Search Results"';
	var WMEPHmousePosition;
	var useState = true;
	var cloneMaster = null;
	var bannButt, bannButt2, bannServ, bannDupl;  // Banner Buttons objects
		
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
			'1.0.73: Hours parser improvements',
			'1.0.73: Fixes for new WME version',
			'1.0.72: Hours parser improvements',
			'1.0.72: WME-Beta editor fixes',
			'1.0.71: Post your WL data to a Google Form for sharing between editors',
			'1.0.71: Added capability to force services on or off for specific chains based on PNH sheet setting',
			'1.0.71: Hours parser improvements',
			'1.0.70: Clone tool can copy description and hours',
			'1.0.70: Fixed issue with Dupefinder WL buttons not appearing',
			'1.0.69: PNH URLs are only updated if there is no URL on the place; otherwise asks you to check the existing url',
		];
		var WMEPHWhatsNewMetaList = [  // New in this major version
			'Live integration with Place Name Harmonization data sheets',
			'Over 800 chains harmonized',
			'Works everywhere in the USA and Canada',
			'Interactive banner buttons',
			'Automatically apply State/Region/Country-based formatting and locking rules',
			'Finds nearby duplicate places',
			'Easily add hours of operation with copy and paste for most places',
			'Whitelist places for future integration with highlighting scripts'
		];  
		var newSep = '\n - ', listSep = '<li>';  // joiners for script and html messages
		var WMEPHWhatsNew = WMEPHWhatsNewList.join(newSep);
		var WMEPHWhatsNewMeta = WMEPHWhatsNewMetaList.join(newSep);
		var WMEPHWhatsNewHList = WMEPHWhatsNewList.join(listSep);
		var WMEPHWhatsNewMetaHList = WMEPHWhatsNewMetaList.join(listSep);
		WMEPHWhatsNew = 'WMEPH v. ' + WMEPHversion + '\nUpdates:' + newSep + WMEPHWhatsNew;
		WMEPHWhatsNewMeta = 'WMEPH v. ' + WMEPHversionMeta + '\nMajor features:' + newSep + WMEPHWhatsNewMeta;
		if ( localStorage.getItem('featuresExamined') === null ) {
			localStorage.setItem('featuresExamined', '0');  // Storage for whether the User has pressed the button to look at updates
		}
		var thisUser = W.loginManager.user;
		var UpdateObject = require("Waze/Action/UpdateObject");
		
		
		
		// Whitelist initialization
		if ( validateWLS(localStorage.getItem(WLlocalStoreName)) === false ) {
			venueWhitelist = { '1.1.1': { Placeholder: {  } } }; // Populate with a dummy place
			saveWL_LS();
		} else {
			loadWL_LS();
		}
		// Initialize the WL Object
		var currentWL = {};
		
		// If the editor installs for the 1st time, alert with the new elements
		if ( localStorage.getItem('WMEPHversionMeta') === null ) {
			alert(WMEPHWhatsNewMeta);
			localStorage.setItem('WMEPHversionMeta', WMEPHversionMeta);
			localStorage.setItem('WMEPHversion', WMEPHversion);
			localStorage.setItem(GLinkWarning, '0');  // Reset warnings
			localStorage.setItem(SFURLWarning, '0');
			localStorage.setItem('featuresExamined', '1');  // disable the button
		} else if (localStorage.getItem('WMEPHversionMeta') !== WMEPHversionMeta) { // If the editor installs a newer MAJOR version, alert with the new elements
			alert(WMEPHWhatsNewMeta);
			localStorage.setItem('WMEPHversionMeta', WMEPHversionMeta);
			localStorage.setItem('WMEPHversion', WMEPHversion);
			localStorage.setItem(GLinkWarning, '0');  // Reset warnings
			localStorage.setItem(SFURLWarning, '0');
			localStorage.setItem('featuresExamined', '1');  // disable the button
		} else if (localStorage.getItem('WMEPHversion') !== WMEPHversion) {  // If MINOR version....
			if (majorNewFeature) {  //  with major feature update, then alert
				alert(WMEPHWhatsNew);
				localStorage.setItem('featuresExamined', '1');  // disable the button
			} else {  //  if not major feature update, then keep the button
				localStorage.setItem('featuresExamined', '0');
			}
			localStorage.setItem('WMEPHversion', WMEPHversion);  // store last installed version in localstorage
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
		W.selectionManager.events.register("selectionchanged", this, checkSelection);
		if ( W.model.venues.hasOwnProperty('events') ) {
			W.model.venues.events.register('objectschanged', this, deleteDupeLabel);
		} else if ( W.model.venues.hasOwnProperty('on') ) {
			W.model.venues.on('objectschanged', deleteDupeLabel);
		}
		W.accelerators.events.register('save', null, destroyDupeLabels);
		
		var WMEPHurl = 'https://www.waze.com/forum/posting.php?mode=reply&f=819&t=164962';  // WMEPH Forum thread URL
		var USAPNHMasURL = 'https://docs.google.com/spreadsheets/d/1-f-JTWY5UnBx-rFTa4qhyGMYdHBZWNirUTOgn222zMY/edit#gid=0';  // Master USA PNH link
		var placesWikiURL = 'https://wiki.waze.com/wiki/Places';  // WME Places wiki
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
		var defaultLockLevel = lockLevel2;
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
		
		
		bootstrapRunButton();
		
		
		
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
		var ignoreWords = ["an", "and", "as", "at", "by", "for", "from", "hhgregg", "in", "into", "of", "on", "or", "the", "to", "with"];
		var capWords = ["3M", "AAA", "AMC", "AOL", "AT&T", "ATM", "BBC", "BLT", "BMV", "BMW", "BP", "CBS", "CCS", "CGI", "CISCO", "CJ", "CNN", "CVS", "DHL", "DKNY", "DMV", "DSW", "ER", "ESPN", "FCU", "FCUK", "GNC", "H&M", "HP", "HSBC", "IBM", "IHOP", "IKEA", "IRS", "JBL", "JCPenney", "KFC", "LLC", "MBNA", "MCA", "MCI", "NBC", "NYPD", "PDQ", "PNC", "TCBY", "TNT", "TV", "UPS", "USA", "USPS", "VW", "XYZ", "ZZZ"
		];
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
		function normalizePhone(s, outputFormat) {
			if (!s) {
				bannButt.phoneMissing.active = true;
				if (currentWL.phoneWL) {
					bannButt.phoneMissing.WLactive = false;
				}
				return s;
			}
			var s1 = s.replace(/\D/g, '');  // remove non-number characters
			var m = s1.match(/^1?([2-9]\d{2})([2-9]\d{2})(\d{4})$/);  // Ignore leading 1, and also don't allow area code or exchange to start with 0 or 1 (***USA/CAN specific)
			if (!m) {  // then try alphanumeric matching
				s1 = s.replace(/[^0-9A-Z]/g, '').replace(/.*([2-9][0-9]{2}[0-9A-Z]{7})/g,'$1');
				s1 = replaceLetters(s1);
				m = s1.match(/^([2-9]\d{2})([2-9]\d{2})(\d{4})$/);  // Ignore leading 1, and also don't allow area code or exchange to start with 0 or 1 (***USA/CAN specific)
				if (!m) {	
					bannButt.phoneInvalid.active = true;
					return s;
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
			var m = s.match(/^https?:\/\/(.*)$/i);  // remove http(s):// 
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
			if (usrRank < 2) {
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
					harmonizePlaceGo(); 
				} else {  // Remove duplicate labels
					WMEPH_NameLayer.destroyFeatures();
				}
			} else {  // Remove duplicate labels
				WMEPH_NameLayer.destroyFeatures();
			}
		}
	
		// Main script
		function harmonizePlaceGo() {
			phlog('Running script on selected place...');
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
			
			// Whitelist: reset flags
			currentWL = {
				dupeWL: [], 
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
				nameMissing: {  // no WL
					active: false, severity: 3, message: 'Name is missing.'
				},
				
				hoursOverlap: {  // no WL
					active: false, severity: 3, message: 'Overlapping hours of operation.  Place might not save.'
				},
				
				fullAddressInference: {  // no WL
					active: false, severity: 3, message: 'Missing address was inferred from nearby segments. Verify the address and run script again.' 
				},
				
				unmappedRegion: {
					active: false, severity: 3, message: 'This category is usually not mapped in this region.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist unmapped category',
					WLaction: function() {
						wlKeyName = 'unmappedRegion';
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
						W.model.actionManager.add(new UpdateObject(item, { name: brand, aliases: newAliases }));
						bannButt.gasMismatch.active = false;  // reset the display flag
					},
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist gas brand mismatch',
					WLaction: function() {
						wlKeyName = 'gasMismatch';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				gasUnbranded: {  // no WL
					active: false, severity: 3, message: '"Unbranded" should not be used for the station brand. Change to the correct brand or use the blank entry at the top of the brand list.'
				},
				
				gasMkPrim: {  // no WL
					active: false, severity: 3,  message: "Gas Station is not the primary category", value: "Fix", title: 'Make the Gas Station category the primary category.',
					action: function() {
						newCategories = insertAtIX(newCategories,"GAS_STATION",0);  // Insert/move Gas category in the first position
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						bannButt.gasMkPrim.active = false;  // reset the display flag
						harmonizePlaceGo();
					}
				},
				 
				hotelMkPrim: {
					active: false, severity: 3, message: "Hotel category is not first", value: "Fix", title: 'Make the Hotel category the primary category.',
					action: function() {
						newCategories = insertAtIX(newCategories,"HOTEL",0);  // Insert/move Hotel category in the first position
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						bannButt.hotelMkPrim.active = false;  // reset the display flag
						harmonizePlaceGo();
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
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						bannButt.changeHMC2Office.active = false;  // reset the display flag
						harmonizePlaceGo();  // Rerun the script to update fields and lock
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
						bannButt.changeHMC2PetVet.active = false;  // reset the display flag
						harmonizePlaceGo();  // Rerun the script to update fields and lock
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
						bannButt.changeSchool2Offices.active = false;  // reset the display flag
						harmonizePlaceGo();  // Rerun the script to update fields and lock
					},
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist School category',  
					WLaction: function() {
						wlKeyName = 'changeSchool2Offices';
						whitelistAction(itemID, wlKeyName);
					}
				}, 
				
				pointNotArea: {  // Area 2 Point button
					active: false, severity: 3, message: "This category should be an point place.", value: "Change to point", title: 'Change to point place',
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
					active: false, severity: 3, message: "House number missing ", 
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
						bannButt.bankCorporate.active = false;   // reset the bank Branch display flag
						bannButt.bankBranch.active = false;   // reset the bank Branch display flag
						bannButt.standaloneATM.active = false;   // reset the standalone ATM display flag
						bannButt.bankType1.active = false;  // remove bank type warning
					}
				},
				
				catPostOffice: {  // no WL
					active: false, severity: 2, message: 'If this is not a USPS post office, change the category, as "Post Office" is only used for USPS locations.'
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
					active: false, severity: 2, message: 'This category is usually an point place, but can be a area in some cases. Verify if area is appropriate.',
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
					active: false, severity: 1, message: 'This category is usually an point place, but can be a area in some cases. Verify if area is appropriate.',
					WLactive: true, WLmessage: '', WLtitle: 'Whitelist point (not area)',  
					WLaction: function() {
						wlKeyName = 'pointNotArea';
						whitelistAction(itemID, wlKeyName);
					}
				},
				
				formatUSPS: {  // ### needs WL or not?
					active: false, severity: 1, message: 'Localize the post office according to your regional standards for USPS locations (e.g., "USPS - Tampa")'
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
					active: false, severity: 1, message: "Phone missing", 
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
					value: "Try hours", title: 'Try to parse hours and add',
					action: function() {
						var pasteHours = $('#WMEPH-HoursPaste'+devVersStr).val();
						phlogdev(pasteHours);
						$('.nav-tabs a[href="#landmark-edit-more-info"]').tab('show');
						var hoursObjectArray = parseHours(pasteHours);
						if (hoursObjectArray !== false) {
							phlogdev(hoursObjectArray);
							W.model.actionManager.add(new UpdateObject(item, { openingHours: hoursObjectArray }));
							bannButt.noHours.value = 'Replace hours';
							bannButt.noHours.severity = 0;
							bannButt.noHours.message = 'Hours: <input type="text" value="Paste Hours Here" id="WMEPH-HoursPaste'+devVersStr+'" style="width:170px;padding-left:3px;color:#AAA">';
						} else {
							phlog('Can\'t parse those hours');
							bannButt.noHours.severity = 1;
							bannButt.noHours.value = 'Can\'t parse, try again';
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
				
				addAlias: {    // no WL
					active: false, severity: 0, message: "Is " + optionalAlias + " at this location?", value: "Yes", title: 'Add ' + optionalAlias,
					action: function() {
						newAliases = insertAtIX(newAliases,optionalAlias,0);
						if (specCases.indexOf('altName2Desc') > -1 &&  item.attributes.description.toUpperCase().indexOf(optionalAlias.toUpperCase()) === -1 ) {
							newDescripion = optionalAlias + '\n' + newDescripion;
							W.model.actionManager.add(new UpdateObject(item, { description: newDescripion }));
						}
						newAliases = removeSFAliases(newName, newAliases);
						W.model.actionManager.add(new UpdateObject(item, { aliases: newAliases }));
						bannButt.addAlias.active = false;  // reset the display flag
					}
				},
				
				addCat2: {   // no WL
					active: false, severity: 0, message: "Is there a " + newCategories[0] + " at this location?", value: "Yes", title: 'Add ' + newCategories[0],
					action: function() {
						newCategories.push.apply(newCategories,altCategories);
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						bannButt.addCat2.active = false;  // reset the display flag
					}
				},
				
				addPharm: {   // no WL
					active: false, severity: 0, message: "Is there a Pharmacy at this location?", value: "Yes", title: 'Add Pharmacy category',
					action: function() {
						newCategories = insertAtIX(newCategories, 'PHARMACY', 1);
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						bannButt.addPharm.active = false;  // reset the display flag
					}
				},
				
				addSuper: {   // no WL
					active: false, severity: 0, message: "Does this location have a supermarket?", value: "Yes", title: 'Add Supermarket category',
					action: function() {
						newCategories = insertAtIX(newCategories, 'SUPERMARKET_GROCERY', 1);
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
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
						bannButt.appendAMPM.active = false;  // reset the display flag
						bannButt.addConvStore.active = false;  // also reset the addConvStore display flag
					}
				},
				
				addATM: {    // no WL
					active: false, severity: 0, message: "ATM at location? ", value: "Yes", title: "Add the ATM category to this place",
					action: function() {
						newCategories = insertAtIX(newCategories,"ATM",1);  // Insert ATM category in the second position
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
						bannButt.addATM.active = false;   // reset the display flag
					}
				},
				
				addConvStore: {  // no WL
					active: false, severity: 0, message: "Add convenience store category? ", value: "Yes", title: "Add the Convenience Store category to this place",
					action: function() {
						newCategories = insertAtIX(newCategories,"CONVENIENCE_STORE",1);  // Insert C.S. category in the second position
						W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
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
						if (region === 'SER') {
							W.model.actionManager.add(new UpdateObject(item, { aliases: ["United States Postal Service"] }));
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
					active: false, severity: 0, message: "No PNH match. If place is a chain: ", value: "Submit new data", title: "Submit info for a new chain through the linked form",
					action: function() {
						window.open(newPlaceURL);
					}
				},
				
				ApprovalSubmit: {  // no WL
					active: false, severity: 0, message: "PNH data exists but is not approved for your region: ", value: "Request approval", title: "Request region/country approval of this place",
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
			
			bannButt2 = {  
				placesWiki: {
					active: true, severity: 0, message: "", value: "Places wiki", title: "Open the places wiki page",
					action: function() {
						window.open(placesWikiURL);
					}
				},
				clearWL: {
					active: false, severity: 0, message: "", value: "Clear Place whitelist", title: "Clear all Whitelisted fields for this place",
					action: function() {
						if (confirm('Are you sure you want to clear all whitelisted fields for this place?') ) {  // misclick check
							delete venueWhitelist[itemID];
							saveWL_LS();
							harmonizePlaceGo();  // rerun the script to check all flags again
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
						localStorage.setItem('featuresExamined', '1');
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
					active: false, checked: false, icon: "serv-valet", value: "Valet", title: 'Valet',
					action: function() {
						servID = WMEServicesArray[0];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addValet.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addValet.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[0];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addValet.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addValet.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[0];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addValet.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addValet.active = false;
					}
				}, 
				addDriveThru: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-drivethru", value: "DriveThru", title: 'Drive-Thru',
					action: function() {
						servID = WMEServicesArray[1];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addDriveThru.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addDriveThru.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[1];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addDriveThru.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addDriveThru.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[1];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addDriveThru.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addDriveThru.active = false;
					}
				}, 
				addWiFi: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-wifi", value: "WiFi", title: 'WiFi',
					action: function() {
						servID = WMEServicesArray[2];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addWiFi.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addWiFi.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[2];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addWiFi.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addWiFi.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[2];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addWiFi.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addWiFi.active = false;
					}
				}, 
				addRestrooms: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-restrooms", value: "Restroom", title: 'Restrooms',
					action: function() {
						servID = WMEServicesArray[3];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addRestrooms.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addRestrooms.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[3];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addRestrooms.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addRestrooms.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[3];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addRestrooms.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addRestrooms.active = false;
					}
				}, 
				addCreditCards: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-credit", value: "CC", title: 'Credit Cards',
					action: function() {
						servID = WMEServicesArray[4];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addCreditCards.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addCreditCards.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[4];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addCreditCards.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addCreditCards.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[4];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addCreditCards.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addCreditCards.active = false;
					}
				}, 
				addReservations: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-reservations", value: "Reserve", title: 'Reservations',
					action: function() {
						servID = WMEServicesArray[5];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addReservations.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addReservations.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[5];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addReservations.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addReservations.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[5];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addReservations.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addReservations.active = false;
					}
				}, 
				addOutside: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-outdoor", value: "OusideSeat", title: 'Outside Seating',
					action: function() {
						servID = WMEServicesArray[6];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addOutside.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addOutside.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[6];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addOutside.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addOutside.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[6];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addOutside.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addOutside.active = false;
					}
				}, 
				addAC: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-ac", value: "AC", title: 'AC',
					action: function() {
						servID = WMEServicesArray[7];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addAC.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addAC.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[7];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addAC.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addAC.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[7];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addAC.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addAC.active = false;
					}
				},  
				addParking: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-parking", value: "Parking", title: 'Parking',
					action: function() {
						servID = WMEServicesArray[8];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addParking.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addParking.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[8];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addParking.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addParking.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[8];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addParking.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addParking.active = false;
					}
				}, 
				addDeliveries: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-deliveries", value: "Delivery", title: 'Deliveries',
					action: function() {
						servID = WMEServicesArray[9];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addDeliveries.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addDeliveries.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[9];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addDeliveries.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addDeliveries.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[9];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addDeliveries.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addDeliveries.active = false;
					}
				}, 
				addTakeAway: {  // append optional Alias to the name
					active: false, checked: false, icon: "serv-takeaway", value: "TakeOut", title: 'Take Out',
					action: function() {
						servID = WMEServicesArray[10];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addTakeAway.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addTakeAway.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[10];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addTakeAway.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addTakeAway.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[10];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addTakeAway.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addTakeAway.active = false;
					}
				}, 
				addWheelchair: {  // add service
					active: false, checked: false, icon: "serv-wheelchair", value: "WhCh", title: 'Wheelchair Accessible',
					action: function() {
						servID = WMEServicesArray[11];
						if ( ($("#service-checkbox-"+servID).prop('checked') && bannServ.addWheelchair.checked) || 
							(!$("#service-checkbox-"+servID).prop('checked') && !bannServ.addWheelchair.checked) ) { 
							$("#service-checkbox-"+servID).trigger('click');
						}
						updateServicesChecks(bannServ);
					},
					pnhOverride: false,
					actionOn: function() {
						servID = WMEServicesArray[11];
						if ( !$("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addWheelchair.checked = true;
						}
						updateServicesChecks(bannServ);
						bannServ.addWheelchair.active = true;
					},
					actionOff: function() {
						servID = WMEServicesArray[11];
						if ( $("#service-checkbox-"+servID).prop('checked') ) { 	
							$("#service-checkbox-"+servID).trigger('click');
							bannServ.addWheelchair.checked = false;
						}
						updateServicesChecks(bannServ);
						bannServ.addWheelchair.active = false;
					}
				},
				add247: {  // add 24/7 hours
					active: false, checked: false, icon: "serv-247", value: "247", title: 'Hours: Open 24/7',
					action: function() {
						if (!bannServ.add247.checked) {
							W.model.actionManager.add(new UpdateObject(item, { openingHours: [{days: [1,2,3,4,5,6,0], fromHour: "00:00", toHour: "00:00"}] }));
							bannServ.add247.checked = true;
						}
					}
				}
			};  // END bannServ definitions
			
			// Update icons to reflect current WME place services
			updateServicesChecks(bannServ);
			
			// Turn on New Features Button if not looked at yet
			if (localStorage.getItem('featuresExamined') === '0') {
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
			
			// Only can select one place at a time in WME, so the loop is superfluous (eg, ix=0 will work), but perhaps we leave it in case we add some sort of looping process like URs.
			for (var ix = 0; ix < W.selectionManager.selectedItems.length; ix++) {
				item = W.selectionManager.selectedItems[0].model;  // make the 0 --> ix for future looping
				// get GPS lat/long coords from place, call as itemGPS.lat, itemGPS.lon
				var itemGPS = OpenLayers.Layer.SphericalMercator.inverseMercator(item.attributes.geometry.bounds.right,item.attributes.geometry.bounds.top);
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
					var inferredAddress = WMEPH_inferAddress();  // Pull address info from nearby segments
					if (inferredAddress.state && inferredAddress.country) {
						addr = inferredAddress;
						if ( $("#WMEPH-AddAddresses" + devVersStr).prop('checked') ) {  // update the item's address if option is enabled
							updateAddress(item, addr);
							if (item.attributes.houseNumber && item.attributes.houseNumber.replace(/[^0-9A-Za-z]/g,'').length > 0 ) {
								bannButt.fullAddressInference.active = true;
								lockOK = false;
							}
						}
					} else {  //  if the inference doesn't work...
						alert("Place has no address data. Please set the address and rerun the script.");
						return;  //  don't run the rest of the script
					}
				}
				
				// Whitelist breakout if place exists on the Whitelist and the option is enabled
				itemID = item.attributes.id; 
				var WLMatch = false;
				if ( $("#WMEPH-EnableWhitelisting" + devVersStr).prop('checked') && venueWhitelist.hasOwnProperty(itemID) ) {
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
					alert("At present this script is not supported in this country.");
					return;
				}
				
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
				var stateDataTemp, areaCodeList = '800,822,833,844,855,866,877,888,';  //  include toll free non-geographic area codes
				var ixBank, ixATM, ixOffices;
						
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
							alert('Lock level sheet data is not correct');
						}
						areaCodeList = areaCodeList+stateDataTemp[ps_areacode_ix];
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
							alert('Lock level sheet data is not correct');
						}
						areaCodeList = areaCodeList+stateDataTemp[ps_areacode_ix];
						break;
					}
					
				}
				if (state2L === "Unknown" || region === "Unknown") {	// if nothing found:
					if (confirm('WMEPH: Localization Error!\nClick OK to report this error') ) {  // if the category doesn't translate, then pop an alert that will make a forum post to the thread
						forumMsgInputs = {
							subject: 'Re: WMEPH Localization Error report',
							message: 'Error report: Localization match failed for "' + addr.state.name + '".',
						};
						WMEPH_errorReport(forumMsgInputs);
					}
					return;
				}
				
				// Clear attributes from residential places
				if (item.attributes.residential) {   
					newName = item.attributes.houseNumber + " " + addr.street.name;
					if (item.attributes.name !== newName) {  // Set the residential place name to the address (to clear any personal info)
						phlogdev("Residential Name reset");
						W.model.actionManager.add(new UpdateObject(item, {name: newName}));
					}
					newCategories = ["RESIDENCE_HOME"];
					newDescripion = null;
					if (item.attributes.description !== null && item.attributes.description !== "") {  // remove any description
						phlogdev("Residential description cleared");
						W.model.actionManager.add(new UpdateObject(item, {description: newDescripion}));
					}
					newPhone = null;
					if (item.attributes.phone !== null && item.attributes.phone !== "") {  // remove any phone info
						phlogdev("Residential Phone cleared");
						W.model.actionManager.add(new UpdateObject(item, {phone: newPhone}));
					}
					newURL = null;
					if (item.attributes.url !== null && item.attributes.url !== "") {  // remove any url
						phlogdev("Residential URL cleared");
						W.model.actionManager.add(new UpdateObject(item, {url: newURL}));
					}
					if (item.attributes.services.length > 0) {
						phlogdev("Residential services cleared");
						W.model.actionManager.add(new UpdateObject(item, {services: [] }));
					}
				} else if (item.attributes.name !== "" && item.attributes.name !== " " && item.attributes.name !== null) {  // for non-residential places
					// Place Harmonization 
					var PNHMatchData = harmoList(newName,state2L,region,countryCode,newCategories);  // check against the PNH list
					PNHNameRegMatch = false;
					if (PNHMatchData[0] !== "NoMatch" && PNHMatchData[0] !== "ApprovalNeeded" ) { // *** Replace place data with PNH data
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
										if (ph_displaynote_ix > -1 && PNHMatchData[ph_displaynote_ix] !== '0' && PNHMatchData[ph_displaynote_ix] !== '') {
											bannButt.localizedName.message = PNHMatchData[ph_displaynote_ix];
										}
									}
									showDispNote = false;
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
							} else {
								bannButt.specCaseMessageLow.active = true;
								bannButt.specCaseMessageLow.message = PNHMatchData[ph_displaynote_ix];
							}
						}
						
						// Localized Storefinder code:
						if (ph_sfurl_ix > -1) {  // if the sfurl column exists...
							if ( ph_sfurllocal_ix > -1 && PNHMatchData[ph_sfurllocal_ix] !== "" && PNHMatchData[ph_sfurllocal_ix] !== "0" ) {
								bannButt.PlaceWebsite.value = "Store Locator (L)";
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
								
								customStoreFinderLocal = true;
							} else if (PNHMatchData[ph_sfurl_ix] !== "" && PNHMatchData[ph_sfurl_ix] !== "0") {
								bannButt.PlaceWebsite.value = "Store Locator";
								customStoreFinderURL = PNHMatchData[ph_sfurl_ix];
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
								newName = newName.slice(0,splix) + ' ' + PNHMatchData[ph_name_ix] + ' ' + newName.slice(splix+PNHMatchData[ph_name_ix].length);
								newName = newName.replace(/ {2,}/g,' ');
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
						} else if (["BANK_FINANCIAL"].indexOf(priPNHPlaceCat) > -1) {
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
						if (!containsAll(newAliases,newAliasesTemp) && newAliasesTemp !== "0" && newAliasesTemp !== "" && specCases.indexOf('optionName2') === -1 ) {
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
							} else {  // if second cat is optional
								phlogdev("Primary category updated" + " with " + priPNHPlaceCat);
								W.model.actionManager.add(new UpdateObject(item, { categories: [priPNHPlaceCat] }));
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
							if ( item.attributes.description !== "" || item.attributes.description !== null ) {
								bannButt.checkDescription.active = true;
							}
							phlogdev("Description updated");
							newDescripion = newDescripion + '\n' + item.attributes.description;
							W.model.actionManager.add(new UpdateObject(item, { description: newDescripion }));
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
					
					// Update name:
					if (newName !== item.attributes.name) {
						phlogdev("Name updated");
						W.model.actionManager.add(new UpdateObject(item, { name: newName }));
					}
							
					// Update aliases
					newAliases = removeSFAliases(newName, newAliases);
					for (naix=0; naix<newAliases.length; naix++) {
						newAliases[naix] = toTitleCase(newAliases[naix]);
					}
					if (newAliases !== item.attributes.aliases && newAliases.length !== item.attributes.aliases.length) {
						phlogdev("Alt Names updated");
						W.model.actionManager.add(new UpdateObject(item, { aliases: newAliases }));
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
							if ( $("#WMEPH-ConvenienceStoreToGasStations" + devVersStr).prop('checked') ) {  // Automatic if user has the setting checked
								newCategories = insertAtIX(newCategories, "CONVENIENCE_STORE", 1);  // insert the C.S. category
								W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
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
					switch (region) {
						case "NWR": regionFormURL = 'https://docs.google.com/forms/d/1hv5hXBlGr1pTMmo4n3frUx1DovUODbZodfDBwwTc7HE/viewform';
							newPlaceAddon = '?entry.925969794='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.925969794='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState;
							break;
						case "SWR": regionFormURL = 'https://docs.google.com/forms/d/1Qf2N4fSkNzhVuXJwPBJMQBmW0suNuy8W9itCo1qgJL4/viewform';
							newPlaceAddon = '?entry.1497446659='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.1497446659='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState; 
							break;
						case "HI": regionFormURL = 'https://docs.google.com/forms/d/1Qf2N4fSkNzhVuXJwPBJMQBmW0suNuy8W9itCo1qgJL4/viewform';
							newPlaceAddon = '?entry.925969794='+tempSubmitName+'&entry.1970139752='+newURLSubmit+'&entry.1749047694='+thisUser.userName+gFormState; 
							approvalAddon = '?entry.925969794='+PNHNameTempWeb+'&entry.50214576='+approvalMessage+'&entry.1749047694='+thisUser.userName+gFormState; 
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
						case "CAN": regionFormURL = 'https://docs.google.com/forms/d/13JwXsrWPNmCdfGR5OVr5jnGZw-uNGohwgjim-JYbSws/viewform';
							newPlaceAddon = '?entry_839085807='+tempSubmitName+'&entry_1067461077='+newURLSubmit; 
							approvalAddon = '?entry_839085807='+PNHNameTempWeb+'&entry_1125435193='+approvalMessage; 
							break;
						default: regionFormURL = "";
					}
					newPlaceURL = regionFormURL + newPlaceAddon;
					approveRegionURL = regionFormURL + approvalAddon;	
					
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
										if ( $("#WMEPH-EnableServices" + devVersStr).prop('checked')  ) {
											// Automatically enable new services
											bannServ[servKeys[psix]].actionOn();
										}
									} else if (CH_DATA_Temp[servHeaders[psix]] === '2') {  // these are never automatically added but shown
										bannServ[servKeys[psix]].active = true;
									} else if (CH_DATA_Temp[servHeaders[psix]] !== '') {  // check for state/region auto add
										bannServ[servKeys[psix]].active = true;
										if ($("#WMEPH-EnableServices" + devVersStr).prop('checked')) {
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
										
					
					// Check for missing hours field (taking out the option now
					if (item.attributes.openingHours.length === 0) {  // if no hours...
						if (!containsAny(newCategories,["STADIUM_ARENA","CEMETERY","FIRE_DEPARTMENT",
						"POLICE_STATION","MILITARY","TRANSPORTATION","AIRPORT","FERRY_PIER","SEAPORT_MARINA_HARBOR","SUBWAY_STATION",
						"BRIDGE","TUNNEL","JUNCTION_INTERCHANGE","ISLAND","SEA_LAKE_POOL","RIVER_STREAM","FOREST_GROVE","FARM","CANAL","SWAMP_MARSH","DAM"]) ) {
							bannButt.noHours.active = true;
							if (currentWL.noHours) {
								bannButt.noHours.WLactive = false;
							}
						}
					} else if (item.attributes.openingHours.length === 1) {  // if one set of hours exist...
						if (item.attributes.openingHours[0].days.length < 7 && item.attributes.openingHours[0].fromHour==='00:00' && 
						(item.attributes.openingHours[0].toHour==='00:00' || item.attributes.openingHours[0].toHour==='23:59' ) ) {
							bannButt.mismatch247.active = true;
						}
					}
					if ( !checkHours(item.attributes.openingHours) ) {
						phlogdev('Overlapping hours');
						bannButt.hoursOverlap.active = true;
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
							var itemURLTemp = normalizeURL(item.attributes.url,true);
							newURLTemp = newURLTemp.replace(/^www\.(.*)$/i,'$1');  // strip www
							itemURLTemp = itemURLTemp.replace(/^www\.(.*)$/i,'$1');  // strip www
							if ( newURLTemp !== itemURLTemp ) { // if formatted URLs don't match, then alert the editor to check the existing URL
								bannButt.longURL.active = true;
								if (currentWL.longURL) {
									bannButt.longURL.WLactive = false;
								}
								bannButt.PlaceWebsite.value = "Place Website";
								updateURL = false;
								tempPNHURL = newURL;
							}
						}
						if (updateURL && newURL !== item.attributes.url) {  // Update the URL
							phlogdev("URL updated");
							W.model.actionManager.add(new UpdateObject(item, { url: newURL }));
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
					} else if (countryCode === "CAN") {
						outputFormat = "+1-{0}-{1}-{2}";
					}
					newPhone = normalizePhone(item.attributes.phone, outputFormat);
					
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
					if (newPhone !== item.attributes.phone) {
						phlogdev("Phone updated");
						W.model.actionManager.add(new UpdateObject(item, {phone: newPhone}));
					}
				
					// Post Office cat check
					if (newCategories.indexOf("POST_OFFICE") > -1) {
						var USPSStrings = ['USPS','USPOSTALSERVICE','UNITEDSTATESPOSTALSERVICE','USPO','USPOSTOFFICE','UNITEDSTATESPOSTOFFICE','UNITEDSTATESPOSTALOFFICE'];
						var USPSMatch = false;
						for (var uspix=0; uspix<USPSStrings.length; uspix++) {
							if ( newName.toUpperCase().replace(/[ \/\-\.]/g,'').indexOf(USPSStrings[uspix]) > -1 ) {  // If it already has a USPS type term in the name, don't add the option
								USPSMatch = true;
								customStoreFinderURL = "https://tools.usps.com/go/POLocatorAction.action";
								customStoreFinder = true;
								if (region === 'SER' && item.attributes.aliases.indexOf("United States Postal Service") === -1) {
									W.model.actionManager.add(new UpdateObject(item, { aliases: ["United States Postal Service"] }));
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
				if ( !item.attributes.name || item.attributes.name.replace(/[^A-Za-z0-9]/g,'').length === 0 ) {
					bannButt.nameMissing.active = true;
					lockOK = false;
				}
						
				// House number check
				if (!item.attributes.houseNumber || item.attributes.houseNumber.replace(/\D/g,'').length === 0) {
					bannButt.hnMissing.active = true;
					if (currentWL.HNWL) {
						bannButt.hnMissing.WLactive = false;
					} else {
						lockOK = false;
					}
				} else {
					var hnOK = false;
					var hnTemp = item.attributes.houseNumber.replace(/[^\d]/g, '');  // Digits only
					var hnTempDash = item.attributes.houseNumber.replace(/[^\d-]/g, '');  // Digits and dashes only
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
				}
	
				if (!addr.street || addr.street.isEmpty) {
					bannButt.streetMissing.active = true;
					lockOK = false;
				}
				if (!addr.city || addr.city.isEmpty) {
					bannButt.cityMissing.active = true;
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
				
				// ### add something to remove unnecessary parent categories (Restaurant doesn't need food and drink)
				
				
				// update Severity for banner messages
				for (var bannKey in bannButt) {
					if (bannButt.hasOwnProperty(bannKey) && bannButt[bannKey].active) {
						severityButt = Math.max(bannButt[bannKey].severity, severityButt);
					}
				}
				
				// Place locking
				phlogdev('Place severity: ' + severityButt);
				if ( lockOK && severityButt < 2) {
					var levelToLock = defaultLockLevel;
					// Campus project exceptions
					if (region === "SER") {
						if (newCategories.indexOf("COLLEGE_UNIVERSITY") > -1 && newCategories.indexOf("PARKING_LOT") > -1) {
							levelToLock = lockLevel4;
						} else if ( item.isPoint() && newCategories.indexOf("COLLEGE_UNIVERSITY") > -1 && newCategories.indexOf("HOSPITAL_MEDICAL_CARE") === -1 ) {
							levelToLock = lockLevel4;
						}
					}
					if (levelToLock > (usrRank - 1)) {levelToLock = (usrRank - 1);}  // Only lock up to the user's level
					if (item.attributes.lockRank < levelToLock) {
						phlogdev("Venue locked!");
						W.model.actionManager.add(new UpdateObject(item, { lockRank: levelToLock }));
					}
					bannButt.placeLocked.active = true;
				}
				
				// Turn off unnecessary buttons
				if (item.attributes.categories.indexOf('PHARMACY') > -1) {
					bannButt.addPharm.active = false;
				}
				if (item.attributes.categories.indexOf('SUPERMARKET_GROCERY') > -1) {
					bannButt.addSuper.active = false;
				}
				
				// Final alerts for non-severe locations
				if (severityButt < 3) {
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
										saveWL_LS();  // Save the WL to local storage
										WMEPH_WLCounter();
										bannButt2.clearWL.active = true;
										bannDupl[dID].active = false;
										harmonizePlaceGo();
									}
								};
								if ( $("#WMEPH-EnableWhitelisting" + devVersStr).prop('checked') ) {
									if ( venueWhitelist.hasOwnProperty(itemID) && venueWhitelist[itemID].hasOwnProperty('dupeWL') && venueWhitelist[itemID].dupeWL.indexOf(dupeIDList[ijx]) > -1 ) {  // if the dupe is on the whitelist then remove it from the banner
										bannDupl[dupeIDList[ijx]].active = false;
									} else {  // Otherwise, activate the WL button
										bannDupl[dupeIDList[ijx]].WLactive = true;
									}
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
					if (arrayHNRatio[arrayHNRatioCheckIX] > 1.2) {
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
				// Assemble the banners
				assembleBanner();  // Make Messaging banners
				
			}  // (End Place 'loop')
			
		}  // END harmonizePlaceGo function
		
		// **** vvv Function definitions vvv ****
		
		// Set up banner messages
		function assembleBanner() {
			// push together messages from active banner messages
			var sidebarMessage = [];  // Initialize message array
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
					if ( $("#WMEPH-EnableWhitelisting" + devVersStr).prop('checked') ) {
						if (bannDupl[tempKey].hasOwnProperty('WLactive') && bannDupl[tempKey].WLactive && bannDupl[tempKey].hasOwnProperty('WLaction') ) {  // If there's a WL option, enable it
							severityButt = Math.max(bannDupl[tempKey].severity, severityButt);
							strButt1 += ' <input class="WLButton" id="WMEPH_WL' + tempKey + '" title="' + bannDupl[tempKey].WLtitle + '" type="button" value="' + bannDupl[tempKey].WLvalue + '">';
						}
					} else {
						severityButt = Math.max(bannDupl[tempKey].severity, severityButt);
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
						strButt1 += ' <input class="PHbutton" id="WMEPH_' + tempKey + '" title="' + bannButt[tempKey].title + '" type="button" value="' + bannButt[tempKey].value + '">';
					} 
					if ( $("#WMEPH-EnableWhitelisting" + devVersStr).prop('checked') ) {
						if ( bannButt[tempKey].hasOwnProperty('WLactive') && bannButt[tempKey].WLactive && bannButt[tempKey].hasOwnProperty('WLaction') ) {  // If there's a WL option, enable it
							severityButt = Math.max(bannButt[tempKey].severity, severityButt);
							strButt1 += bannButt[tempKey].WLmessage + ' <input class="WLButton" id="WMEPH_WL' + tempKey + '" title="' + bannButt[tempKey].WLtitle + '" type="button" value="' + wlButtText + '">';
						} 
					} else {
						severityButt = Math.max(bannButt[tempKey].severity, severityButt);
					}
					sidebarMessage.push(strButt1);
				}
			}
			
			// setup Add Service Buttons for suggested services
			var sidebarServButts = '', servButtHeight = '27', greyOption;
			for ( tempKey in bannServ ) {  
				if ( bannServ.hasOwnProperty(tempKey) && bannServ[tempKey].hasOwnProperty('active') && bannServ[tempKey].active ) {  //  If the particular service is active
					if ( bannServ[tempKey].checked ) {
						greyOption = '';
					} else {
						greyOption = '-grey';
					}
					strButt1 = '&nbsp<input class="servButton" id="WMEPH_' + tempKey + '" title="' + bannServ[tempKey].title + '" type="image" style="height:' + servButtHeight + 
						'px;background:none;border-color: none;border-style: none;" src="https://openmerchantaccount.com/img2/' + bannServ[tempKey].icon + greyOption + '.png">';
					sidebarServButts += strButt1;
				}
			}
			if (sidebarServButts.length>0) {
				sidebarMessage.push('Add services:<br>' + sidebarServButts);
			}
			
			//  Build general banners (below the Services)
			for ( tempKey in bannButt2 ) {  
				if ( bannButt2.hasOwnProperty(tempKey) && bannButt2[tempKey].hasOwnProperty('active') && bannButt2[tempKey].active ) {  //  If the particular message is active
					strButt1 = bannButt2[tempKey].message;
					if (bannButt2[tempKey].hasOwnProperty('action')) {
						strButt1 += ' <input class="PHbutton2" id="WMEPH_' + tempKey + '" title="' + bannButt2[tempKey].title + '" style="" type="button" value="' + bannButt2[tempKey].value + '">';
					} 
					sidebarMessage.push(strButt1);
					severityButt = Math.max(bannButt2[tempKey].severity, severityButt);
				}
			}
			
			// Add banner indicating that it's the beta version
			if (isDevVersion) {
				sidebarMessage.push('WMEPH Beta');
			} 
			
			// Post the banners to the sidebar
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
			
			// If pressing enter in the hours entry box, parse the entry
			$("#WMEPH-HoursPaste"+devVersStr).keyup(function(event){
				if( event.keyCode === 13 && $('#WMEPH-HoursPaste'+devVersStr).val() !== '' ){
					$("#WMEPH_noHours").click();
				}
			});
			$("#WMEPH-HoursPaste"+devVersStr).click(function(){
				this.value = '';
				this.style.color = 'black';
			}).blur(function(){
				if ( this.value === '') {
					this.value = 'Paste Hours Here';
					this.style.color = '#AAA';
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
					if ( $("#WMEPH-EnableWhitelisting" + devVersStr).prop('checked') && b[tempKey].hasOwnProperty('WLactive') && b[tempKey].WLactive && b[tempKey].hasOwnProperty('WLaction') ) {  
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
				$('<div id="WMEPH_banner">').css({"width": "100%", "background-color": "#fff", "color": "white", "font-size": "15px", "font-weight": "bold", "margin-left": "auto", "margin-right": "auto"}).prependTo(".contents");
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
		
		// CSS setups
		var cssCode = [
			".PHbutton { -webkit-border-radius: 10; -moz-border-radius: 10; border-radius: 10px; color: #111; background: #fff; padding: 0px 3px 0px 3px; text-decoration: none; }",
			".PHbutton:hover {color: #c00;}",
			".PHbutton2 { -webkit-border-radius: 10; -moz-border-radius: 10; border-radius: 10px; color: #111; background: #dfd; padding: 0px 3px 0px 3px; text-decoration: none; }",
			".PHbutton2:hover {color: #c00;}",
			".PHbutton3 { -webkit-border-radius: 10; -moz-border-radius: 10; border-radius: 10px; color: #111; background: #ddf; padding: 0px 3px 0px 3px; text-decoration: none; }",
			".PHbutton3:hover {color: #c00;}",
			".servButton { -webkit-border-radius: 8; -moz-border-radius: 8; border-radius: 8px; color: #111; background: #fff; padding: 0px 3px 0px 3px; text-decoration: none; }",
			".servButton:hover {color: #c00;}",
			".WLButton { -webkit-border-radius: 13; -moz-border-radius: 13; border-radius: 13px; color: #0a0; background: #FFF; padding: 0px 3px 0px 3px; text-decoration: none; }",
			".WLButton:hover {color: #2c2;}",
			".RBbutton { -webkit-border-radius: 10; -moz-border-radius: 10; border-radius: 10px; color: #FFF; background: #666; padding: 3px 6px 3px 6px; text-decoration: none; }",
			".RBbutton:hover {background: #222;}"
			];
		for (var cssix=0; cssix<cssCode.length; cssix++) {
			insertCss(cssCode[cssix]);
		}
		function insertCss( code ) {
			var style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML = code;
			document.head.appendChild( style );
		}  // END insertCss funtion
		
		// Display run button on place sidebar 
		function displayRunButton() {
			var betaDelay = 0;
			if (isDevVersion) { betaDelay = 30; }
			setTimeout(function() {
				if ($('#WMEPH_runButton').length === 0 ) {
					$('<div id="WMEPH_runButton">').css({"padding-bottom": "6px", "padding-top": "3px", "width": "290", "background-color": "#FFF", "color": "black", "font-size": "15px", "font-weight": "bold", "margin-left": "auto", "margin-right": "auto"}).prependTo(".contents");
				} 
				if ($('#runWMEPH'+devVersStr).length === 0 ) {
					var strButt1 = '<input class="RBbutton" id="runWMEPH'+devVersStr+'" title="Run WMEPH'+devVersStrSpace+' on Place" type="button" value="Run WMEPH'+devVersStrSpace+'">';
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
				if ($('#clonePlace').length === 0 ) {
					var strButt1 = '<div style="margin-bottom: 3px;"></div><input class="PHbutton3" id="clonePlace" title="Copy place info" type="button" value="Copy">'+
						' <input class="PHbutton3" id="pasteClone" title="Apply the Place info. (Ctrl-Alt-O)" type="button" value="Paste (for checked boxes):"><br>';
					$("#WMEPH_runButton").append(strButt1);
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPhn', 'HN');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPaddr', 'Addr.');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPurl', 'URL');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPph', 'Ph.');
					$("#WMEPH_runButton").append('<br>');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPdesc', 'Desc.');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPserv', 'Serv.');
					createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPhrs', 'Hrs.');
				}
				var btn = document.getElementById("clonePlace"); 
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
			}, betaDelay);
		}  // END displayRunButton funtion
		
		
		
		// Catch PLs and reloads that have a place selected already and limit attempts to about 10 seconds
		function bootstrapRunButton() {
			if (numAttempts < 10) {
				numAttempts++;
				if (W.selectionManager.selectedItems.length === 1) {
					if (W.selectionManager.selectedItems[0].model.type === "venue") {
						displayRunButton();
						if ( $("#WMEPH-EnableCloneMode" + devVersStr).prop('checked') ) {
							displayCloneButton();
						}
					}
				} else {
					setTimeout(bootstrapRunButton,1000);
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
				}
				if ( $("#WMEPH_CPaddr").prop('checked') ) {
					updateAddress(item, cloneMaster.addr);
				}
			} else {
				phlog('Please copy a place');
			}
		}
		
		// Parse hours paste for hours object array
		function parseHours(inputHours) {
			var daysOfTheWeek = {
				SS: ['saturdays', 'saturday', 'satur', 'sat', 'sa'],
				UU: ['sundays', 'sunday', 'sun', 'su'],
				MM: ['mondays', 'monday', 'mon', 'mo'],
				TT: ['tuesdays', 'tuesday', 'tues', 'tue', 'tu'],
				WW: ['wednesdays', 'wednesday', 'wed', 'we'],
				RR: ['thursdays', 'thursday', 'thurs', 'thur', 'thu', 'th'],
				FF: ['fridays', 'friday', 'fri', 'fr']
			};
			var dayCodeVec = ['MM','TT','WW','RR','FF','SS','UU','MM','TT','WW','RR','FF','SS','UU','MM','TT','WW','RR','FF'];
			var tfHourTemp, tfDaysTemp, newDayCodeVec = [];
			var tempRegex, twix, tsix;
			var inputHoursParse = inputHours.toLowerCase();
			inputHoursParse = inputHoursParse.replace(/\u2013|\u2014/g, "-");  // long dash replacing
			inputHoursParse = inputHoursParse.replace(/[^a-z0-9\:\-\. ]/g, ' ');  // replace unnecessary characters with spaces
			inputHoursParse = inputHoursParse.replace(/closed/g, '99:99-99:99').replace(/not open/g, '99:99-99:99');  // parse 'closed'
			inputHoursParse = inputHoursParse.replace(/weekdays/g, 'mon-fri').replace(/weekends/g, 'sat-sun');  // convert weekdays and weekends to days
			inputHoursParse = inputHoursParse.replace(/noon/g, "12:00").replace(/midnight/g, "00:00");  // replace 'noon', 'midnight'
			inputHoursParse = inputHoursParse.replace(/daily/g, "mon-sun");  // replace 'open daily'
			inputHoursParse = inputHoursParse.replace(/open 24 ?ho?u?rs?/g, "00:00-00:00");  // replace 'open 24 hour or similar'
			inputHoursParse = inputHoursParse.replace(/open twenty\-? ?four ho?u?rs?/g, "00:00-00:00");  // replace 'open 24 hour or similar'
			inputHoursParse = inputHoursParse.replace(/24 ?ho?u?rs?/g, "00:00-00:00");  // replace 'open 24 hour or similar'
			inputHoursParse = inputHoursParse.replace(/twenty\-? ?four ho?u?rs?/g, "00:00-00:00");  // replace 'open 24 hour or similar'
			// replace thru type words with dashes
			var thruWords = 'through|thru|to|until|-'.split("|");
			for (twix=0; twix<thruWords.length; twix++) {
				tempRegex = new RegExp(thruWords[twix], "g");
				inputHoursParse = inputHoursParse.replace(tempRegex,'-');
			}
			inputHoursParse = inputHoursParse.replace(/\-{2,}/g, "-");  // replace any duplicate dashes
			phlogdev('Initial parse: ' + inputHoursParse);
			
			// kill extra words
			var killWords = 'paste|here|business|operation|times|time|regular|weekday|weekend|opening|open|now|from|hours|hour|our|are|and|&'.split("|");
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
			
			// remove colons after Days field
			inputHoursParse = inputHoursParse.replace(/(\D+)\:(\d+)/g, '$1 $2');
			
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
			inputHoursParse = inputHoursParse.replace(/([A-Z])\-?([0-9])/g,'$1|$2');
			inputHoursParse = inputHoursParse.replace(/([0-9])\-?([A-Z])/g,'$1|$2');
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
			var noNumSkip = ['BANK','ATM','HOTEL','MOTEL','STORE','MARKET','SUPERMARKET','GYM','GAS','GASOLINE','GASSTATION','CAFE','OFFICE','OFFICES','CARRENTAL','RENTALCAR','RENTAL'];
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
			
			if ( venueWhitelist.hasOwnProperty(item.attributes.id) && $("#WMEPH-EnableWhitelisting" + devVersStr).prop('checked') ) {
				if ( venueWhitelist[item.attributes.id].hasOwnProperty('dupeWL') ) {
					wlDupeList = venueWhitelist[item.attributes.id].dupeWL;
				}
			}
			
			if (devUser) {
				t0 = performance.now();  // Speed check start
			}
			var numVenues = 0;
			for (var venix in venueList) {  // for each place on the map:
				if (venueList.hasOwnProperty(venix)) {  // hOP filter
					numVenues++;
					nameMatch = false;
					altNameMatch = -1;
					testVenueAtt = venueList[venix].attributes;
					var pt2ptDistance =  item.geometry.getCentroid().distanceTo(venueList[venix].geometry.getCentroid());
					wlDupeMatch = false;
					if (wlDupeList.length>0 && wlDupeList.indexOf(testVenueAtt.id) > -1) {
						wlDupeMatch = true;
					}
					
					// get HNs for places on same street
					var addrItem = item.getAddress();
					if ( addrItem.hasOwnProperty('attributes') ) {
						addrItem = addrItem.attributes;
					}
					var addrDupe = venueList[venix].getAddress();
					if ( addrDupe.hasOwnProperty('attributes') ) {
						addrDupe = addrDupe.attributes;
					}
					if (addrItem.street !== null && addrItem.street.name !== null && item.attributes.houseNumber && item.attributes.houseNumber !== '' &&
					addrDupe.street !== null && addrDupe.street.name !== null && testVenueAtt.houseNumber && testVenueAtt.houseNumber !== '' && 
					venix !== item.attributes.id && addrItem.street.name === addrDupe.street.name && testVenueAtt.houseNumber < 1000000) {
						dupeHNRangeList.push(parseInt(testVenueAtt.houseNumber));
						dupeHNRangeIDList.push(testVenueAtt.id);
						dupeHNRangeDistList.push(pt2ptDistance);
					}
					
					
					// Check for duplicates
					if ( !wlDupeMatch && dupeIDList.length<6 && pt2ptDistance < 1000 && !testVenueAtt.residential && venix !== item.attributes.id && 'string' === typeof testVenueAtt.id && testVenueAtt.name.length>1 && testVenueAtt.name !== null) {  // don't do res, the point itself, new points or no name
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
			return dupeNames;
		}  // END Dupefinder function
		
		// On selection of new item:
		function checkSelection() {
			if (W.selectionManager.selectedItems.length > 0) {
				var newItem = W.selectionManager.selectedItems[0].model;
				if (newItem.type === "venue") {
					displayRunButton();
					if ( $("#WMEPH-EnableCloneMode" + devVersStr).prop('checked') ) {
						displayCloneButton();
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
		function WMEPH_inferAddress() {
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
				MAX_RECURSION_DEPTH = 8,
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
					// Use address from segment with address that is closest by connectivity.
					foundAddresses = _.sortBy(foundAddresses, 'depth');
					foundAddresses = _.filter(foundAddresses, {
						depth: foundAddresses[0].depth
					});
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
					// If more than one of the closest segments by connectivity has the same FC, look for
					// closest segment geometrically.
					if (foundAddresses.length > 1) {
						foundAddresses = _.sortBy(foundAddresses, 'distance');
					}
					//console.debug(foundAddresses[0].streetName, foundAddresses[0].depth);
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
			var phContentHtml = '<div class="tab-pane" id="sidepanel-ph' + devVersStr + '"><div id="PlaceHarmonizer' + devVersStr + '"><p>WMEPH' + 
				devVersStrSpace + ' v. ' + WMEPHversion + '</p><hr align="center" width="90%"><p>Settings:</p></div></div>';
			$("#user-info div.tab-content:first").append(phContentHtml);
			
			// Enable certain settings by default if not set by the user:
			if (localStorage.getItem('WMEPH-EnableWhitelisting'+devVersStr) === null) {
				localStorage.setItem('WMEPH-EnableWhitelisting'+devVersStr, '1');
			}
			
			//Create Settings Checkboxes and Load Data
			//example condition:  if ( $("#WMEPH-DisableDFZoom" + devVersStr).prop('checked') ) { }
			//createSettingsCheckbox("PlaceHarmonizer" + devVersStr, "WMEPH-AlertNoHours" + devVersStr,"Alert for missing or unlikely hours of operation");
			createSettingsCheckbox("PlaceHarmonizer" + devVersStr, "WMEPH-WebSearchNewTab" + devVersStr,"Open URL & Search Results in new tab instead of new window");
			createSettingsCheckbox("PlaceHarmonizer" + devVersStr, "WMEPH-DisableDFZoom" + devVersStr,"Disable zoom & center for duplicates");
			createSettingsCheckbox("PlaceHarmonizer" + devVersStr, "WMEPH-HidePlacesWiki" + devVersStr,"Hide 'Places Wiki' button in results banner");
			createSettingsCheckbox("PlaceHarmonizer" + devVersStr, "WMEPH-EnableWhitelisting" + devVersStr,"Enable whitelisting mode");
			if (devUser || betaUser || usrRank > 1) {
				createSettingsCheckbox("PlaceHarmonizer" + devVersStr, "WMEPH-EnableServices" + devVersStr,"Enable automatic addition of common services");
			}
			if (devUser || betaUser || usrRank > 2) {
				createSettingsCheckbox("PlaceHarmonizer" + devVersStr, "WMEPH-ConvenienceStoreToGasStations" + devVersStr,'Automatically add "Convenience Store" category to gas stations');
			}
			if (devUser || betaUser || usrRank > 2) {
				createSettingsCheckbox("PlaceHarmonizer" + devVersStr, "WMEPH-AddAddresses" + devVersStr,"Add detected address fields to places with no address");
			}
			if (devUser || betaUser || usrRank > 2) {
				createSettingsCheckbox("PlaceHarmonizer" + devVersStr, "WMEPH-EnableCloneMode" + devVersStr,"Enable place cloning tools");
			}
			
			var phHRContentHtml = '<hr align="center" width="90%">';
			$("#PlaceHarmonizer" + devVersStr).append(phHRContentHtml);
			
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
        	$("#PlaceHarmonizer" + devVersStr).append(phKBContentHtml);
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
				var phDevContentHtml = '<hr align="center" width="90%"><p>Dev Only Settings:</p>';
				$("#PlaceHarmonizer" + devVersStr).append(phDevContentHtml);
				createSettingsCheckbox("PlaceHarmonizer" + devVersStr, "WMEPH-RegionOverride" + devVersStr,"Disable Region Specificity");
			
			}
			
			// *** Whitelisting section
			if (localStorage.getItem('WMEPH_WLAddCount') === null) {
				localStorage.setItem('WMEPH_WLAddCount', 1);  // Counter to remind of WL backups
			}
			var phWLContentHtml = $('<hr align="center" width="90%"><div id="PlaceHarmonizerWLTools' + devVersStr + '">Whitelist string: <input onClick="this.select();" type="text" id="WMEPH-WLInput'+devVersStr+
				'" style="width: 200px;padding-left:1px"><br>'+
				'<input class="PHbutton" id="WMEPH-WLMerge'+ devVersStr +'" title="Merge the string into your existing Whitelist" type="button" value="Merge">'+
				' <input class="PHbutton" id="WMEPH-WLPull'+ devVersStr +'" title="Pull your existing Whitelist for backup or sharing" type="button" value="Pull">'+
				'<br><input class="PHbutton" id="WMEPH-WLShare'+ devVersStr +'" title="Share your Whitelist to a public Google sheet" type="button" value="Share your WL">'+
				'</div><div id="PlaceHarmonizerWLToolsMsg' + devVersStr + '"></div>');
        	$("#PlaceHarmonizerKB" + devVersStr).append(phWLContentHtml);
			
			$("#WMEPH-WLMerge" + devVersStr).click(function() {
				$("#PlaceHarmonizerWLToolsMsg" + devVersStr).empty();
				if ($('#WMEPH-WLInput'+devVersStr).val() === 'resetWhitelist') {
					if (confirm('***Do you want to reset all Whitelist data?\nClick OK to erase.') ) {  // if the category doesn't translate, then pop an alert that will make a forum post to the thread
						venueWhitelist = { '1.1.1': { Placeholder: {  } } }; // Populate with a dummy place
						saveWL_LS();
					}
				} else {
					WLSToMerge = validateWLS($('#WMEPH-WLInput'+devVersStr).val());
					if (WLSToMerge) {
						phlog('Whitelists merged!');
						venueWhitelist = mergeWL(venueWhitelist,WLSToMerge);
						saveWL_LS();
					} else {
						phWLContentHtml = '<p style="color:red">Invalid Whitelist data<p>';
						$("#PlaceHarmonizerWLToolsMsg" + devVersStr).append(phWLContentHtml);
					}
				}
			});
			
			// Pull the data to the text field
			$("#WMEPH-WLPull" + devVersStr).click(function() {
				$("#PlaceHarmonizerWLToolsMsg" + devVersStr).empty();
				$('#WMEPH-WLInput'+devVersStr).val(localStorage.getItem(WLlocalStoreName));
				phWLContentHtml = '<p style="color:green">To backup the data, copy & paste the text in the box to a safe location.<p>';
				$("#PlaceHarmonizerWLToolsMsg" + devVersStr).append(phWLContentHtml);
				localStorage.setItem('WMEPH_WLAddCount', 1);
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
			$("#PlaceHarmonizer" + devVersStr).append(phContentHtml2);
			
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
		
		var t0 = performance.now(); // Speed check start
		var newNameListLength;  // static list length
		
		for (var pnhix=0; pnhix<PNH_DATA.length; pnhix++) {  // loop through all PNH places
			var pnhEntryTemp = PNH_DATA[pnhix].split("|");  // split the current PNH data line 
			if (pnhEntryTemp[ph_disable_ix] !== "1") {
				var newNameList = pnhEntryTemp[ph_name_ix].toUpperCase();  // pull out the primary PNH name & upper case it
				newNameList = newNameList.replace(/ AND /g, '');  // Clear the word "AND" from the name
				newNameList = newNameList.replace(/^THE /g, '');  // Clear the word "THE" from the start of the name
				newNameList = [newNameList.replace(/[^A-Z0-9]/g, '')];  // Clear non-letter and non-number characters, store in array
				
				// Add any aliases
				var tempAliases = pnhEntryTemp[ph_aliases_ix].toUpperCase();
				if ( tempAliases !== '' && tempAliases !== '0' && tempAliases !== '') {
					tempAliases = tempAliases.replace(/,[^A-za-z0-9]*/g, ",").split(",");  // tighten and split aliases
					for (var alix=0; alix<tempAliases.length; alix++) {
						newNameList.push( tempAliases[alix].replace(/ AND /g, '').replace(/^THE /g, '').replace(/[^A-Z0-9]/g, '') );
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
	function saveWL_LS() {
		venueWhitelistStr = JSON.stringify(venueWhitelist);
		localStorage.setItem(WLlocalStoreName, venueWhitelistStr);
	}
	function loadWL_LS() {
		venueWhitelistStr = localStorage.getItem(WLlocalStoreName);
		venueWhitelist = JSON.parse(venueWhitelistStr);
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
		phlog('Clearing dupe label...');
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
		var itemGPS = OpenLayers.Layer.SphericalMercator.inverseMercator(item.attributes.geometry.bounds.right,item.attributes.geometry.bounds.top);
		if (!venueWhitelist.hasOwnProperty(itemID)) {  // If venue is NOT on WL, then add it.
			venueWhitelist[itemID] = { };
		}
		venueWhitelist[itemID][wlKeyName] = {active: true};  // WL the flag for the venue
		venueWhitelist[itemID].city = addressTemp.city.name;  // Store city for the venue
		venueWhitelist[itemID].state = addressTemp.state.name;  // Store state for the venue
		venueWhitelist[itemID].country = addressTemp.country.name;  // Store country for the venue
		venueWhitelist[itemID].gps = itemGPS;  // Store GPS coords for the venue
		saveWL_LS();  // Save the WL to local storage
		WMEPH_WLCounter();
		bannButt2.clearWL.active = true;
	}
	
	// Keep track of how many whitelists have been added since the last pull, alert if over a threshold (100?)
	function WMEPH_WLCounter() {
		localStorage.WMEPH_WLAddCount = parseInt(localStorage.WMEPH_WLAddCount)+1;
		if (localStorage.WMEPH_WLAddCount > 50) {
			alert('Don\'t forget to periodically back up your Whitelist data using the Pull option in the WMEPH settings tab.');
			localStorage.WMEPH_WLAddCount = 1;
		}
	}
	
	// Run the script...
	placeHarmonizer_bootstrap();
			
	// Preload service icons
	var serv_valet = new Image(); serv_valet.src = "https://openmerchantaccount.com/img2/serv-valet.png";
	var serv_drivethru = new Image(); serv_drivethru.src = "https://openmerchantaccount.com/img2/serv-drivethru.png";
	var serv_wifi = new Image(); serv_wifi.src = "https://openmerchantaccount.com/img2/serv-wifi.png";
	var serv_restrooms = new Image(); serv_restrooms.src = "https://openmerchantaccount.com/img2/serv-restrooms.png";
	var serv_credit = new Image(); serv_credit.src = "https://openmerchantaccount.com/img2/serv-credit.png";
	var serv_reservations = new Image(); serv_reservations.src = "https://openmerchantaccount.com/img2/serv-reservations.png";
	var serv_outdoor = new Image(); serv_outdoor.src = "https://openmerchantaccount.com/img2/serv-outdoor.png";
	var serv_ac = new Image(); serv_ac.src = "https://openmerchantaccount.com/img2/serv-ac.png";
	var serv_parking = new Image(); serv_parking.src = "https://openmerchantaccount.com/img2/serv-parking.png";
	var serv_deliveries = new Image(); serv_deliveries.src = "https://openmerchantaccount.com/img2/serv-deliveries.png";
	var serv_takeaway = new Image(); serv_takeaway.src = "https://openmerchantaccount.com/img2/serv-takeaway.png";
	var serv_wheelchair = new Image(); serv_wheelchair.src = "https://openmerchantaccount.com/img2/serv-wheelchair.png";
	var serv_247 = new Image(); serv_247.src = "https://openmerchantaccount.com/img2/serv-247.png";
	var serv_valet_grey = new Image(); serv_valet_grey.src = "https://openmerchantaccount.com/img2/serv-valet-grey.png";
	var serv_drivethru_grey = new Image(); serv_drivethru_grey.src = "https://openmerchantaccount.com/img2/serv-drivethru-grey.png";
	var serv_wifi_grey = new Image(); serv_wifi_grey.src = "https://openmerchantaccount.com/img2/serv-wifi-grey.png";
	var serv_restrooms_grey = new Image(); serv_restrooms_grey.src = "https://openmerchantaccount.com/img2/serv-restrooms-grey.png";
	var serv_credit_grey = new Image(); serv_credit_grey.src = "https://openmerchantaccount.com/img2/serv-credit-grey.png";
	var serv_reservations_grey = new Image(); serv_reservations_grey.src = "https://openmerchantaccount.com/img2/serv-reservations-grey.png";
	var serv_outdoor_grey = new Image(); serv_outdoor_grey.src = "https://openmerchantaccount.com/img2/serv-outdoor-grey.png";
	var serv_ac_grey = new Image(); serv_ac_grey.src = "https://openmerchantaccount.com/img2/serv-ac-grey.png";
	var serv_parking_grey = new Image(); serv_parking_grey.src = "https://openmerchantaccount.com/img2/serv-parking-grey.png";
	var serv_deliveries_grey = new Image(); serv_deliveries_grey.src = "https://openmerchantaccount.com/img2/serv-deliveries-grey.png";
	var serv_takeaway_grey = new Image(); serv_takeaway_grey.src = "https://openmerchantaccount.com/img2/serv-takeaway-grey.png";
	var serv_wheelchair_grey = new Image(); serv_wheelchair_grey.src = "https://openmerchantaccount.com/img2/serv-wheelchair-grey.png";
	var serv_247_grey = new Image(); serv_247_grey.src = "https://openmerchantaccount.com/img2/serv-247-grey.png";
})();
