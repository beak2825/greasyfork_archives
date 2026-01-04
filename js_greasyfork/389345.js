// ==UserScript==
// @name        War Memorial Series Stats
// @namespace   http://www.cryotest.com/
// @description Adds your War Memorial Series stats badge onto your profile page and War Memorial Series cache pages on geocaching.com.
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright   2019, Cryo99
// @attribution War Memorial Series stats provided by Chris AKA Bus.Stop (https://www.warmemorialseries.co.uk/)
// @attribution Icon image extracted from the War Memorial Series banner by Chris AKA Bus.Stop
// @icon        https://raw.githubusercontent.com/Cryo99/WarMemorialStats/master/icon48.png
// @icon64      https://raw.githubusercontent.com/Cryo99/WarMemorialStats/master/icon64.png
// @include     /^https?://www\.geocaching\.com/(account/dashboard|my|default|geocache|profile|seek/cache_details|p)/
// @exclude     /^https?://www\.geocaching\.com/(login|about|articles|myfriends)/
// @version     1.0.1
// @supportURL	https://github.com/Cryo99/WarMemorialStats
// @require     https://greasyfork.org/scripts/389508-gc-stats-banner-library/code/GC%20Stats%20Banner%20Library.js?version=880219
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/389345/War%20Memorial%20Series%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/389345/War%20Memorial%20Series%20Stats.meta.js
// ==/UserScript==


(function (){
	"use strict";

	var cfg = {
		cacheTitles: ['War Memorial #', 'Lest we Forget #', 'W.M.', 'WM #'],
		callerVersion: GM_info.script.version,
		elPrefix: 'wms',
		seriesName: 'War Memorial Series',
		seriesURL: 'warmemorialseries.co.uk',
		seriesLevels: ['Characters', 'None', 'Ranks'],
		seriesLevelDefault: 'Ranks'
	}
	new GCStatsBanner(cfg).init();
}());
