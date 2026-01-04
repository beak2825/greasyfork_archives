// ==UserScript==
// @name         Wikiloc auto apply filters
// @namespace    https://github.com/marcodallagatta/userscripts/tree/main/wikiloc-auto-add-filters
// @version      1.0
// @description  Automatically applies the specified filters to the search page on WikiLoc (unless it's the favorite list)
// @author       You
// @match        https://www.wikiloc.com/wikiloc/map.do?*
// @icon         https://icons.duckduckgo.com/ip2/wikiloc.com.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450232/Wikiloc%20auto%20apply%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/450232/Wikiloc%20auto%20apply%20filters.meta.js
// ==/UserScript==

(function() {
	'use strict';

	if (window.location.toString().includes('favoriteList')) return;

	const minLength = '3'; // in km, '0' for all
	const maxLength = '20'; // in km
	const elevMin = '200';
	const elevMax = '1250';
	const loop = '1'; // 0 not loop, 1 loop

	if (!window.location.toString().includes('uto')) { // checks if it contains max elevation
		window.location += `&act=1%2C43&lfr=${minLength}&lto=${maxLength}&ufr=${elevMin}&uto=${elevMax}&sto=3&loop=${loop}`;
	}
})();
