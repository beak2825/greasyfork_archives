// ==UserScript==
// @name        Village Sign Series Stats
// @namespace   http://www.cryotest.com/
// @description Adds your Village Sign Series stats badge onto your profile page and Village Sign Series cache pages on geocaching.com.
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright   2019-2020, Cryo99
// @attribution Village Sign Series stats provided by Chris AKA Bus.Stop (http://www.villagesignseries.co.uk/)
// @attribution Icon image extracted from the Village Sign Series banner by Chris AKA Bus.Stop
// @icon        https://raw.githubusercontent.com/Cryo99/VillageSignStats/master/icon48.png
// @icon64      https://raw.githubusercontent.com/Cryo99/VillageSignStats/master/icon64.png
// @include     /^https?://www\.geocaching\.com/(account/dashboard|my|default|geocache|profile|seek/cache_details|p)/
// @exclude     /^https?://www\.geocaching\.com/(login|about|articles|myfriends)/
// @version     1.0.1
// @supportURL	https://github.com/Cryo99/VillageSignStats
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require     https://greasyfork.org/scripts/389508-gc-stats-banner-library/code/GC%20Stats%20Banner%20Library.js?version=880219
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/389350/Village%20Sign%20Series%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/389350/Village%20Sign%20Series%20Stats.meta.js
// ==/UserScript==


(function (){
	"use strict";

	var cfg = {
		cacheTitles: ['VS #'],
		callerVersion: GM_info.script.version,
		elPrefix: 'vss',
		seriesName: 'Village Signs',
		seriesURL: 'villagesignseries.co.uk',
		seriesLevels: ['Awards', 'Levels', 'None'],
		seriesLevelDefault: 'Awards'
	}
    new GCStatsBanner(cfg).init();
}());
