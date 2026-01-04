// ==UserScript==
// @name         WME Events Light Mode
// @namespace    http://tampermonkey.net/
// @description  Removed dark mode on Waze Events map
// @license      GNU GPLv3
// @version      0.1.1
// @author       fuji2086
// @match        https://*.waze.com/events*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/455630/WME%20Events%20Light%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/455630/WME%20Events%20Light%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
	$('.mte-map .leaflet-tile-pane').attr('style','filter: none');
	$('.mte-map .leaflet-tile-pane').attr('style','-webkit-filter: none');
	
})();