// ==UserScript==
// @name         YourOnlineChoices_OFF
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turn off all ads on youronlinechoices -- it's not an userscript !!! Copy and paste a function below to the console.
// @author       neo
// @match        http://www.youronlinechoices.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394442/YourOnlineChoices_OFF.user.js
// @updateURL https://update.greasyfork.org/scripts/394442/YourOnlineChoices_OFF.meta.js
// ==/UserScript==

$(".partnerBox").each(function(index){
	let statusBox= false;
	try{
		if($(this).find(".on").length || $(this).find(".nocookie").length){
			statusBox = true;
		}
		
		if(statusBox){
			$(this).find("#rdio_out").click();
		}
	}
	catch{}
});

// kopiuj wklej do konsoli
// copy and paste this script into the console only after information retrieving disappears