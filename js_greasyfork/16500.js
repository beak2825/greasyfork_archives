// ==UserScript==
// @name		BvS Truck Hotkeys
// @namespace		taltamir
// @description		Truck hotkeys for BvS
// @version		1.0
// @history		1.0 Initial version
// @include		http://*animecubed.com/billy/bvs/truckload*
// @downloadURL https://update.greasyfork.org/scripts/16500/BvS%20Truck%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/16500/BvS%20Truck%20Hotkeys.meta.js
// ==/UserScript==

function submit_form(form_name)
{
	if (document.forms.namedItem(form_name))
	{
		remove_listener();											//Remove keypress listener
		location.assign('javascript:' + form_name + '.submit()');	//Click the button named form_name
	}
}

function key_press(event)
{
	if (event.keyCode==68)											//keypress d
	{
		if(document.forms.namedItem("truckload"))					//Check for existance of "Load the Truck!" button
		{
			document.truckload.loadtruck.value="1";					//Select "Load Normally" Radio button
			submit_form("truckload");								//Click the Load the Truck! button
		}
		else remove_listener();
	}
	else if (event.keyCode==70)										//keypress f (f for fast)
	{
		if(document.forms.namedItem("truckload"))					//Check for existance of "Load the Truck!" button
		{
			document.truckload.loadtruck.value="3";					//Select "Hurl Things" Radio button
			submit_form("truckload");								//Click the Load the Truck! button
		}
		else remove_listener();
	}
	else if (event.keyCode==83)										//keypress s (s for slow)
	{
		if(document.forms.namedItem("truckload"))					//Check for existance of "Load the Truck!" button
		{
			document.truckload.loadtruck.value="2";					//Select "Load Carefully" Radio button
			submit_form("truckload");								//Click the Load the Truck! button
		}
		else remove_listener();
	}
	else remove_listener(); 
}

function remove_listener()
{
	window.removeEventListener("keyup", key_press, false); 			// Removes the event listener, this is critically important to prevent "playing too fast" errors when spamming the button.
}

window.addEventListener("keyup", key_press, false); 				//When a key is released, run function key_press and provide it with keyID. Put this last to ensure loading is finished on scripts that need to process some data before player input