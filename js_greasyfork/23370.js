	// ==UserScript==
	// @name                NWS fixer
	// @namespace	        http://ekw.space
	// @description	        script to put NWS tropical weather updates in all caps
	// @include				http://www.nhc.noaa.gov/gtwo.php?basin=atlc&fdays=5
// @version 0.0.1.20160920210214
// @downloadURL https://update.greasyfork.org/scripts/23370/NWS%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/23370/NWS%20fixer.meta.js
	// ==/UserScript==

	var allCaps = document.getElementById("textproduct");
        allCaps.style.backgroundColor = 'red';

