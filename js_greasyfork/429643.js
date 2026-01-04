// ==UserScript==
// @name        DECIPHER - Autodownload quota.xls when relaunching live studies
// @version     1.0
// @description When relaunching a live study, this script will automatically download quota.xls in-case there has been any updates made by the PM team. This way you can re-upload it, to apply those updates again.
// @author      Scott / SSearle
// @include     https://survey*.researchnow.com/apps/lumos/*
// @include     https://survey-*.dynata.com/apps/lumos/*
// @exclude     *:edit
// @grant		unsafeWindow
// @require     http://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/429643/DECIPHER%20-%20Autodownload%20quotaxls%20when%20relaunching%20live%20studies.user.js
// @updateURL https://update.greasyfork.org/scripts/429643/DECIPHER%20-%20Autodownload%20quotaxls%20when%20relaunching%20live%20studies.meta.js
// ==/UserScript==
(function() {
	'use strict';
	var jQuery = unsafeWindow.jQuery; 	//Need for Tampermonkey or it raises warnings.
	var $ = unsafeWindow.jQuery; 		//Need for Tampermonkey or it raises warnings.

	jQuery(".launch-button").click(function()										//When clicking launch button...
		{
			if (jQuery(".launch-button").text().includes("Save to Live Survey"))	//Check to see if study is -already live-...
				{

					var currentStudy = jQuery(location).attr("href").split("/");	//Get current URL
					var domainID = currentStudy[2];									//Domain
					var subServer = currentStudy[5];								//Sub Server
					currentStudy = currentStudy[6].split(":")						//Split out last bit
					var studyID = currentStudy[0];									//Actual ID of the study

					console.log("Domain = " + domainID);							//Clarity print
					console.log("Sub Server = " + subServer);						//
					console.log("Study ID = " + studyID);							//

                    window.open('https://'+domainID+'/rep/selfserve/'+subServer+'/'+studyID+':getQuota/'+studyID+'-quota.xls', '_blank');
				}
		});
})();