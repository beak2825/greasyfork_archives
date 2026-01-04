// ==UserScript==
// @name        Little Bridges Series Stats
// @namespace   http://www.cryotest.com/
// @description Adds your Little Bridges stats badge onto your profile page and Little Bridges cache pages on geocaching.com.
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright   2020, Cryo99
// @attribution Little Bridges stats provided by Chris AKA Bus.Stop (https://www.littlebridgesseries.co.uk)
// @attribution Icon image extracted from the Little Bridges banner by Chris AKA Bus.Stop
// @icon        https://raw.githubusercontent.com/Cryo99/LittleBridgesStats/master/icon48.png
// @icon64      https://raw.githubusercontent.com/Cryo99/LittleBridgesStats/master/icon64.png
// @include     /^https?://www\.geocaching\.com/(account/dashboard|my|default|geocache|profile|seek/cache_details|p)/
// @exclude     /^https?://www\.geocaching\.com/(login|about|articles|myfriends)/
// @version     0.0.2
// @supportURL	https://github.com/Cryo99/LittleBridgesStats
// @require     https://greasyfork.org/scripts/389508-gc-stats-banner-library/code/GC%20Stats%20Banner%20Library.js?version=880219
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/418600/Little%20Bridges%20Series%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/418600/Little%20Bridges%20Series%20Stats.meta.js
// ==/UserScript==


(function (){
	"use strict";

	var cfg = {
		cacheTitles: ['Little Bridges #'],
		callerVersion: GM_info.script.version,
		elPrefix: 'lbs',
		seriesName: 'Little Bridges Series',
		seriesURL: 'littlebridgesseries.co.uk',
		seriesLevels: ['Levels', 'None'],
		seriesLevelDefault: 'Levels'
	};
    new GCStatsBanner(cfg).init();
}());
