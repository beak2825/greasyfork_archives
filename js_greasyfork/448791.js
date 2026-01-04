// ==UserScript==
// @name         QA Log - Auto-Expand
// @version      1.0
// @description  Auto-clicks the "Expand" button in the QA Log to make things easier to read.
// @include      https://gp.dynata.com/https/spweb.emea.dynata.com/sfa/logs.php?*
// @author       Scott
// @grant        none
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/448791/QA%20Log%20-%20Auto-Expand.user.js
// @updateURL https://update.greasyfork.org/scripts/448791/QA%20Log%20-%20Auto-Expand.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jQuery = window.jQuery;							//Need for Tampermonkey or it raises warnings.
	var myInitTimer = setInterval(myInitFunction,100);	//Constantly checks until expand buttons are on page
	console.log("Autoclicker Loaded");			//Make sure is running


	function myInitFunction()
	{
		if (jQuery(".collapse-btn").length > 0)		//Once buttons are shown
		{
			jQuery(".collapse-btn").click();		//Click on them all
			clearInterval(myInitTimer);				//Stop further runs
		}
	}

})();