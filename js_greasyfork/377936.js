// ==UserScript==
// @name         tampermonkey boolean option example
// @namespace    test
// @version      0.1
// @description  tampermonkey boolean option example.
// @author       1N07
// @match        none
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/377936/tampermonkey%20boolean%20option%20example.user.js
// @updateURL https://update.greasyfork.org/scripts/377936/tampermonkey%20boolean%20option%20example.meta.js
// ==/UserScript==

var optionHandle; //The option menu item
var optionBooleanValue = GM_getValue("optionBooleanValue", true); //the value for that item. Get the value from local store or default to true
SetOptionHandle();


/*Sets the option handle according to current value, along with on-click listener to change value. 
Only really needed for an option where the title changes according to value*/
function SetOptionHandle() 
{
	GM_unregisterMenuCommand(optionHandle); //unset option handle
	
	//set option handle according to current option value with on-click listener
	optionHandle = GM_registerMenuCommand("Option menu title text (" + (optionBooleanValue ? "on true, this" : "on false, this") + ") -click to change-", function(){
		//=== on click actions ===//
		optionBooleanValue = !optionBooleanValue; //toggle boolean value
		GM_setValue("optionBooleanValue", optionBooleanValue); //saved value locally
		SetOptionHandle(); //re-set the option handle (to update title text)
		
		//ask user to refresh to apply settings if refresh is needed - NOTE: value is changed above regardless. This is just for the refresh.
		if(confirm('Press "OK" to refresh the page to apply new settings'))
			location.reload();
		//========================//
	});
}