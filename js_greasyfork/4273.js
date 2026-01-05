// ==UserScript==
// @name History of the Seen
// @namespace https://github.com/theoky/HistoryOfTheSeen
// @description Script to implement a history of the seen approach for some news sites. Details at https://github.com/theoky/HistoryOfTheSeen
// @author          Theoky
// @version	        0.4192
// @lastchanges     workaround for bug in GreaseMonkey 3.2
// @license         GNU GPL version 3
// @released        2014-02-20
// @updated         2014-06-10
// @homepageURL   	https://github.com/theoky/HistoryOfTheSeen
//
// @grant      GM_getValue
// @grant      GM_setValue
// @grant      GM_deleteValue
// @grant      GM_registerMenuCommand
// @grant      GM_listValues
// @grant      GM_addStyle
//
// for testing purposes (set FireFox greasemonkey.fileIsGreaseable) 
// @include file://*testhistory.html
//
// @include http*://*.derstandard.at/*
// @include http*://*.faz.net/*
// @include http*://*.golem.de/*
// @include http*://*.handelsblatt.com/*
// @include http*://*.heise.de/newsticker/*
// @include http*://*.kleinezeitung.at/*
// @include http*://*.nachrichten.at/*
// @include http*://*.oe24.at/*
// @include http*://*.orf.at/*
// @include http*://orf.at/*
// @include http*://*.reddit.com/*
// @include http*://*.spiegel.de/*
// @include http*://*.sueddeutsche.de/*
// @include http*://*.welt.de/*
// @include http*://*.wirtschaftsblatt.at/*
// @include http*://*.zeit.de/*
// @include http*://dastandard.at/*
// @include http*://derstandard.at/*
// @include http*://diepresse.com/*
// @include http*://diestandard.at/*
// @include http*://kurier.at/*
// @include http*://slashdot.org/*
// @include http*://taz.de/*
// @include http*://notalwaysright.com/*
// @include http*://www.nytimes.com/*

// @require http://code.jquery.com/jquery-2.1.1.min.js
// @require http://code.jquery.com/ui/1.11.2/jquery-ui.js
// @require https://greasyfork.org/scripts/130-portable-md5-function/code/Portable%20MD5%20Function.js?version=10066
// was require md5.js 
// was require http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js
// @downloadURL https://update.greasyfork.org/scripts/4273/History%20of%20the%20Seen.user.js
// @updateURL https://update.greasyfork.org/scripts/4273/History%20of%20the%20Seen.meta.js
// ==/UserScript==

// Copyright (C) 2015  T. Kopetzky - theoky
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// Tested with FireFox 34 and GreaseMonkey 2.3

//-------------------------------------------------
//Functions

(function(){

	var defaultSettings = {
			ageOfUrl: 5, 	// age in days after a url is deleted from the store
							// < 0 erases all dates (disables history)
			targetOpacity: 0.3,
			targetOpacity4Dim: 0.85,
			steps: 10,
			dimInterval: 30000,
			expireAllDomains: true,		// On fast machines this can be true and expires
							// all domains in the database with each call. If false,
							// only the urls of the current domain are expired which 
							// is slightly faster.
			cleanOnlyDaily: true,
			considerViewPort: true,
			dbOpsPerRun: 5
		};

	var UNDEF = 'undefined';
	var DEFAULT_TAG = 'a';
	var defaultGetContentFct = function(elem) {
		if ((typeof elem != UNDEF) && (typeof elem.href != UNDEF)) {
			return elem.href;
		}
		return UNDEF;
	};
	var AFTER_SCROLL_DELAY = 750;
	var DO_DEBUG = false;
	var DEBUG_LVL_ERROR = 1;
	var DEBUG_LVL_WARN = 2;
	var DEBUG_LVL_INFO = 4;
	
	var perUrlSettings = [
  		{
			url : ['.*\.?slashdot\.org' ],
			tag : 'article',
			upTrigger: "../article",
			getContent: function(elem) {
				if ((typeof elem != UNDEF) && (typeof elem.id != UNDEF)) {
					return elem.id;
				}
				return UNDEF;
			},
			parentHints : [ ] 
		},

		{
			url : ['.*\.?derstandard\.at', '.*\.?diestandard\.at', '.*\.?dastandard\.at' ], 
			upTrigger: "../a",
			parentHints : [
					"ancestor::div[contains(concat(' ', @class, ' '), ' text ')]",
					"ancestor::ul[@class='stories']" ]
		},

		{
			url : ['notalwaysright\.com'],
			upTrigger: "../a[@rel='bookmark']",
			parentHints : [ "ancestor::div[contains(concat(' ', @class, ' '), ' post ')]" ]
		},

		{
			url : ['.*\.?golem.de'],
			upTrigger: "../a",
			parentHints : [ "ancestor::li",
					"ancestor::section[@id='index-promo']",
					"ancestor::section[contains(concat(' ', @class, ' '), ' promo ')]" ]
		},

		{
			url : ['.*\.?reddit.com'],
			// class="title may-blank  srTagged imgScanned"
			upTrigger: "../a[contains(@class, 'title') and contains(@class, 'may-blank')]",
			parentHints : [ "ancestor::div[contains(concat(' ', @class, ' '), ' thing ')]" ]
		},
		
		{
			url : ['nytimes\.com'],
			upTrigger: "../a",
			parentHints : [
					// "ancestor::li[contains(concat(' ', @class, ' '), ' portal-post ')]",
					"ancestor::div[contains(concat(' ', @class, ' '), ' collection ')]"
					]
		}		
	];
	
	var dimMap = {};
	var countDownTimer = defaultSettings.steps;
	var theHRefs = null;
	var curSettings = null;
	var KEY_LAST_EXPIRE_OP = "lastExpire";
	var timeOutAfterLastScroll = UNDEF;
	var tag2Process = null;
	var getContentFct = null;
	var theDomain = null;

	var progressbar;
	var progressLabel;	

	// Styling 
	var progressBarStyle = 
		".ui-widget {" + 
		"	font-family: Verdana,Arial,sans-serif !important;" + 
		"	font-size: 1.1em !important;" + 
		"}" + 
		".ui-widget-content {" + 
		"	border: 1px solid #aaaaaa !important;" + 
		"	color: #222222 !important;" + 
		"}" + 
		".ui-widget-header {" + 
		"	border: 1px solid #aaaaaa !important;" + 
		"	background: #cccccc   !important;" + 
		"	color: #222222 !important;" + 
		"	font-weight: bold !important;" + 
		"}" + 
		".ui-progressbar {" + 
		"	height: 2em !important;" + 
		"	text-align: left !important;" + 
		"	overflow: hidden !important;" + 
		"}" + 
		".ui-progressbar .ui-progressbar-value {" + 
		"	margin: -1px !important;" + 
		"	height: 100% !important;" + 
		"}" + 
		".ui-progressbar .ui-progressbar-overlay {" + 
		"	background: url('data:image/gif;base64,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') !important;" + 
		"	height: 100% !important;" + 
		"	filter: alpha(opacity=25) !important; /* support: IE8 */" + 
		"	opacity: 0.25 !important;" + 
		"}" + 
//		".ui-progressbar-indeterminate .ui-progressbar-value {" + 
//		"	background-image: none !important;" + 
//		"}" + 

		".ui-progressbar {" + 
		"	height: 2em !important;" + 
		"	text-align: left !important;" + 
		"	overflow: hidden !important;" + 
		" 	position: absolute !important;" + 
		" 	left: 20% !important;" + 
		" 	top: 4px !important;" + 
		" 	width: 60% !important;" + 
		"   z-index: 255 !important;" +
		"}" + 
		".progress-label {" + 
		"	position: absolute !important;" + 
		"	left: 5% !important;" + 
		"	top: 4px !important;" + 
		"	font-weight: bold !important;" + 
		"	text-shadow: 1px 1px 0 #fff !important;" + 
		"   z-index: 256 !important;" +
		"}";
		
	// Debugging
	function debuglog(msg) {
		if (DO_DEBUG) {
			console.log(msg);
		}
	}
	
	function debugLogLvl(lvl, msg) {
		if (lvl & DEBUG_LVL_ERROR) {
			console.log("error: " + msg);
		} 
		if (DO_DEBUG) {
			if (lvl & DEBUG_LVL_WARN) {
				console.log("warn:" + msg);
			} 
			if (lvl & DEBUG_LVL_INFO) {
				console.log(msg);
			} 
		}
	}

	var g_index;
	var g_keys;
	var g_lengthOfKeysArray;
	var g_workInProgress = false;
	var g_par1 = UNDEF;
	var g_par2 = UNDEF;
	var g_workerFctDefault = function(key, par1, par2) {
		GM_deleteValue(key);
	};
	var g_workerFct = g_workerFctDefault;
	var g_finishFct_Default = function() {
		document.location.reload(true);
	};
	var g_finishFct = g_finishFct_Default;
	var g_label;

	function appendProgressBar() {
		$("body").append ( '\
			<div id="progressbar" class="ui-progressbar ui-progressbar-indeterminate"><div class="progress-label">History of the Seen: Resetting DB for current domain...</div></div>');
	}

	function removeProgressBar(reload) {
		$("#progressbar").remove();
		if (reload) {
			document.location.reload(true);
		}
	}
	
	/*
	 * Init function for "threading"
	 */
	function initThreadingLoop()
	{
		if (g_workInProgress) {
			debugLogLvl(DEBUG_LVL_ERROR, "initThreading with already threading in progress.");
			return;
		}
		
		g_workInProgress = true;
		g_index = 0;
		g_keys = GM_listValues();

		if (!g_keys) {
			debugLogLvl(DEBUG_LVL_WARN, "g_keys empty?"); 
			return;
		}

		g_lengthOfKeysArray = g_keys.length;
		appendProgressBar();
		
		progressbar = $("#progressbar");
		progressLabel = $(".progress-label");

		progressbar.progressbar({
			value : false,
			change : function() {
				progressLabel.text(g_label + progressbar.progressbar("value").toFixed(2) + "% ");
			},
			complete : function() {
				progressLabel.text(" History of the Seen: Operation Complete! ");
			}
		});

		progressbar.progressbar("value", 0);
		setTimeout(doThreadWork, 1);
	}

	/*
	 * Worker method
	 */
	function doThreadWork()
	{
		if (!g_workInProgress) {
			return;
		}
		
		var i = 0;
		var currentKey = null;
		
		currentKey = g_keys[g_index];
		while (i < defaultSettings.dbOpsPerRun && currentKey) {
			g_workerFct(currentKey, g_par1, g_par2);
			
			g_index ++;
			i++;
			currentKey = g_keys[g_index];
		}
		progressbar.progressbar("value", g_index * 100 / g_lengthOfKeysArray);
		if (currentKey) {
			setTimeout(doThreadWork, 10);
		} else
		{
			removeProgressBar(false);
			if (g_finishFct !== UNDEF) {
				g_finishFct();
			}
			g_workInProgress = false;
		}
	}
	
	
	// Resetting section
	function resetAllUrls() {
		if (!g_workInProgress && confirm('Are you sure you want to erase the complete seen history?')) {
			g_label = " History of the Seen: Cleaning DB, done ";
			g_par1 = UNDEF;
			g_par2 = UNDEF;
			g_workerFct = g_workerFctDefault;
			g_finishFct = g_finishFct_Default;
			initThreadingLoop();
		}
	}

	function resetUrlsForCurrentHelper(dKey, domainOrUri) {
		if (confirm('Are you sure you want to erase the seen history for ' + 
				domainOrUri + '?')) {
			g_label = " History of the Seen: Cleaning DB, done ";
			g_par1 = dKey;
			g_par2 = domainOrUri;
			g_workerFct = function(key, dKey, domainOrUri) {
				if (key == KEY_LAST_EXPIRE_OP){
					return;
				}
				try {
					var val = GM_getValue(key, "{}");
					var dict = JSON.parse(val);
					if(dict) {
						if (dict[dKey] == domainOrUri) {
							GM_deleteValue(key);
						}
					}
				} catch (e) {
					console.log(e);
				}
			};
			g_finishFct = g_finishFct_Default;
			initThreadingLoop();
		}
	}
	
	function resetUrlsForCurrentDomain() {
		resetUrlsForCurrentHelper("domain", document.domain);
	}
	
	function resetUrlsForCurrentSite() {
		resetUrlsForCurrentHelper("base", document.baseURI);
	}

	function expireUrls()	{
		debugLogLvl(DEBUG_LVL_INFO, "expireUrls");
		if (defaultSettings.cleanOnlyDaily) {
			var lastExpireDate = new Date(GM_getValue(KEY_LAST_EXPIRE_OP, nDaysOlderFromNow(2)));
			var diff = Math.abs((new Date()) - lastExpireDate);
			if (diff / 1000 / 3600 / 24 < 1) {
				// less than one day -> no DB cleaning
				return;
			}
		}

		/*
		var val = GM_getValue(KEY_EXPIRE_OP_INPROGRESS);

		if (typeof val !== UNDEF) {
			// expire in progress
			return;
		}
		GM_setValue(KEY_EXPIRE_OP_INPROGRESS, True);

		 */
		// cutOffDate
		g_label = " History of the Seen: Expiring old URLs for this site, done ";
		g_par1 = nDaysOlderFromNow(defaultSettings.ageOfUrl);
		debuglog("cutOffDate" + g_par1);
		g_par2 = UNDEF;
		g_workerFct = function(key, cutOffDate, par2) {
			if (key == KEY_LAST_EXPIRE_OP){
				return;
			}
			
			var dict = JSON.parse(GM_getValue(key, "{}"));
			if(dict) {
				try {
					debuglog(dict["domain"], cutOffDate.getTime(), dict["date"]);
					if (cutOffDate.getTime() > dict["date"]) {
						if (defaultSettings.expireAllDomains ||
							(dict["domain"] == document.domain))
						{
							GM_deleteValue(key);
						}
					}
				} catch (e) {
					console.log(e);
				}
			}
			else {
				console.log('Error! JSON.parse failed - dict is likely to be corrupted. Probably best to completely clean DB.');
			}
		};
		g_finishFct = function() {
			GM_setValue(KEY_LAST_EXPIRE_OP, new Date());
		}
		initThreadingLoop();
	}

	function nDaysOlderFromNow(age, aDate, zeroHour) {
		var aDate = typeof aDate !== UNDEF ? aDate : new Date();
		var zeroHour = typeof zeroHour !== UNDEF ? zeroHour : true;
		
		var dateStore = new Date(aDate.getTime());
		var workDate = aDate;
		if (age >= 0) {
			workDate.setDate(dateStore.getDate() - age);
			if (zeroHour) {
				workDate.setHours(0,0,0,0);
			}
		}
		return workDate;
	}

	/*
	 * Find the settings for a given URL
	 */
	function findPerUrlSettings(theSettings, aDomain) {
		debugLogLvl(DEBUG_LVL_INFO, "findPerUrlSettings");
		
		for (var i=0; i < theSettings.length; ++i) {
			for (var j = 0; j < theSettings[i].url.length; ++j) {
				var myRegExp = new RegExp(theSettings[i].url[j], 'i');
				if (aDomain.match(myRegExp)) {
					return theSettings[i];
				}
			}
		}
	}

	/*
	 * Find the parent element as specified in the settings.
	 */
	function locateParentElem(curSettings, aDomain, aRoot) {
		if (!curSettings) {
			return null;
		}
		// console.log("locateParentElem 1", curSettings.url);
		var res = null;
		for (var xpath = 0; xpath < curSettings.parentHints.length; ++xpath) {
			// console.log("locateParentElem 2", curSettings.parentHints[xpath], aRoot);
			res = document.evaluate(curSettings.parentHints[xpath], aRoot, null, 9, null).singleNodeValue;
			if (res) {
				// console.log("locateParentElem found something");
				return res;
			}
		}
		return res;
	}
	
	/*
	 * Check if the current node qualifies for looking up the hierarchy. 
	 */
	function goUp(curSettings, aRoot) {
		if (!curSettings) {
			return false;
		}

		var res = null;
		if (curSettings.upTrigger !== "") {
			res = document.evaluate(curSettings.upTrigger, aRoot, null, 9, null).singleNodeValue;
		}
		return res !== null;
	}
	
	
	/*
	 * Set the opacity for specified links
	 */
	function dimLinks() {
		var interval = (1 - defaultSettings.targetOpacity4Dim)/defaultSettings.steps;
		var countDownTimer = countDownTimer - 1;
		var curOpacity = defaultSettings.targetOpacity4Dim + interval*countDownTimer;

		// TODO: Better iterate over dimmap
		for(var i = 0; i < theHRefs.length; i++)
		{
			var hash = 'm' + hex_md5(theHRefs[i].href);
			if (hash in dimMap) {
				theHRefs[i].style.opacity = curOpacity;
			}
		}
		
		if (countDownTimer > 0) {
			var to = setTimeout(dimLinks, defaultSettings.dimInterval);
		}
	}
	
	/*
	 * Check if an element is fully drawn on the viewport 
	 * from http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling?lq=1
	 */
	function isFullyInView(elem)
	{
		debugLogLvl(DEBUG_LVL_INFO, "isFullyInView");
	    var docViewTop = $(window).scrollTop();
	    var docViewBottom = docViewTop + $(window).height();

	    var elemTop = $(elem).offset().top;
	    var elemBottom = elemTop + $(elem).height();

	    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));

		// is really fully in view    
		// return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
		//  && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
	}

	/*
	 * Called after scrolling finished for defined time
	 */
	function evaluateElems() {
		debugLogLvl(DEBUG_LVL_INFO, "evaluate all");
		processElements(false);
		timeOutAfterLastScroll = UNDEF;
	} 
	
	/*
	 * Wait for scrolling to end
	 */
	function onScroll()
	{
		if (timeOutAfterLastScroll !== UNDEF) {
			window.clearTimeout(timeOutAfterLastScroll)
		}
		timeOutAfterLastScroll = setTimeout(evaluateElems, AFTER_SCROLL_DELAY);
	}

	/*
	 * Process all elements
	 */
	function processElements(firstCall) {
		debugLogLvl(DEBUG_LVL_INFO, "processElements");
		var allTagElems = document.getElementsByTagName(tag2Process);
		var elemMap = {};
		var theBase = document.baseURI;

		// Change the DOM

		// First loop: gather all new links and make already seen opaque.
		for(var i = 0; i < allTagElems.length; i++)
		{
			var hash = 'm' + hex_md5(getContentFct(allTagElems[i]));
			// setValue needs letter in the beginning, thus use of 'm'
			debugLogLvl(DEBUG_LVL_INFO, "hash: " + hash);

			var key = GM_getValue(hash);

			
			if (typeof key !== UNDEF && key !== null) {
				// workaround for issue https://github.com/greasemonkey/greasemonkey/issues/2156
				
				// key found -> loaded this reference already 
				debugLogLvl(DEBUG_LVL_INFO, "key found");

				if (firstCall) {
					var done = false;
					if(goUp(curSettings, allTagElems[i])) {
						var pe = locateParentElem(curSettings, theDomain, allTagElems[i])
						// console.log("locate parent done", pe);
						if (pe) {
							pe.style.opacity = defaultSettings.targetOpacity;
							done = true;
						}
					}
					if (!done) {
						// change display
						allTagElems[i].style.opacity = defaultSettings.targetOpacity;
						debugLogLvl(DEBUG_LVL_INFO, "changing opacity");
					}
				}
				
			} else {
				//check if element is fully visible
				debugLogLvl(DEBUG_LVL_INFO, "key not found");
				
				if (isFullyInView(allTagElems[i])) {
					debuglog(allTagElems[i] + " is in view");

					// key not found, store it with current date
					elemMap[hash] = {"domain":theDomain, "date":(new Date()).getTime(), "base":theBase};
					dimMap[hash] = allTagElems[i];
				}
			}
		}

		// remember all new urls to hide the next time
		for (var e2 in elemMap) {
			GM_setValue(e2, JSON.stringify(elemMap[e2]));
		}
		
		theHRefs = allTagElems;
		if (firstCall) {
			var to = setTimeout(dimLinks, defaultSettings.dimInterval);
		}
	}
	
//	Menus
	GM_registerMenuCommand("Remove the seen history for this site.", resetUrlsForCurrentSite);
	GM_registerMenuCommand("Remove the seen history for this domain.", resetUrlsForCurrentDomain);
	GM_registerMenuCommand("Remove all seen history (for all sites)!", resetAllUrls);

	GM_addStyle(progressBarStyle);

//	Main part
	function run_script() {
		debugLogLvl(DEBUG_LVL_INFO, "run");
		dimMap = {};
		theDomain = document.domain;

		curSettings = findPerUrlSettings(perUrlSettings, theDomain);
		tag2Process = DEFAULT_TAG;
		getContentFct = defaultGetContentFct;
		if (typeof curSettings != UNDEF) {
			if (typeof curSettings.tag != UNDEF) {
				tag2Process = curSettings.tag;
			}
			if (typeof curSettings.getContent != UNDEF) {
				getContentFct = curSettings.getContent;
			}
		}
		
		expireUrls();
		processElements(true);
		window.addEventListener("scroll", onScroll, false);
	}

	run_script();
 })();
