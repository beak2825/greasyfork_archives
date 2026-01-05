// ==UserScript==
// @name		BvS Village Hotkeys
// @namespace		taltamir
// @description		Village hotkeys for BvS
// @version		1.5
// @history		1.5 Paperwork before collect. Check for "not enough stamina" message before performing ingredient hunt. Remove patrol option (collect cannot be disabled anyways)
// @history		1.4 Snow support
// @history		1.3 Fixed bunch of bugs, detect multiple keys: press C for concert, R to eat ramen, and D for the daily stuff that doesn't need a specific team.
// @history		1.2 Disabled gathering on d press, removing listener should work now, autocheck gathering buttons regardless.
// @history		1.1 Resource collect & Patrol added as options
// @history		1.0 Initial version
// @include		http://www.animecubed.com/billy/bvs/village.html
// @include		http://animecubed.com/billy/bvs/village.html
// @downloadURL https://update.greasyfork.org/scripts/17977/BvS%20Village%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/17977/BvS%20Village%20Hotkeys.meta.js
// ==/UserScript==

function submit_form(form_name)
{
	if (document.forms.namedItem(form_name))
	{
		remove_listener();											//Remove keypress listener before page refresh
		location.assign('javascript:' + form_name + '.submit()');
	}
}

function selectcheckbox (name,value)
{
	var checkbox = document.querySelector('input[name=' + name + '][value=' + value + ']');
	
	if (checkbox)
	{
		checkbox.checked = true;
	}
}

function key_press(event)
{
	if (event.keyCode==68)											//keypress d. This will be used for obviously daily actions that just need to get done.
	{
	
		if(typeof document.ingredienthunt.ingredientplace != 'undefined' && (document.documentElement.textContent || document.documentElement.innerText).indexOf("Not Enough Stamina!") < 0)			//Hunt for Ingredients, check for existance of the radio buttons and that there isn't a "not enough stamina" message.
//	The check for document.forms.namedItem("ingredienthunt") always returns true even if you already searched. This is because the already searched today message still displays that form name. Checking for the existance of the radio buttons seems to work so far
		{
			submit_form("ingredienthunt");
		}
		else if((document.documentElement.textContent || document.documentElement.innerText).indexOf("You can't get to your action - there is too much snow!") > -1)				//Check if received the error that snow is blocking you
		{
			submit_form("snowday");									//Go to snowday page
		}
		else if(document.forms.namedItem("paperwork"))				//Do paperwork if collect resources is disabled
		{
			submit_form("paperwork");
		}
		else if(document.forms.namedItem("rescol"))					//Collect Resources
		{
			submit_form("rescol");
		}
		else if(document.forms.namedItem("brotime"))				//Chillax in front of the Manly Altar!
		{
			submit_form("brotime");
		}
		else if(document.forms.namedItem("lemonaid"))				//Lemonaid.
		{
			submit_form("lemonaid");
		}
		else if(document.forms.namedItem("dicetime"))				//Roll That Die!
		{
			submit_form("dicetime");
		}
		else if(document.forms.namedItem("pandtime"))				//Get your Learn On!
		{
			submit_form("pandtime");
		}
	}
	else if (event.keyCode==82)										//keypress r
	{
		if(typeof document.ramen.ramentobuy != 'undefined')			//Purchase Ramen. Checks for radio buttons. Remember that it defaults to Diet on page load so if you want something else change the radio option manually and then press R.
// This has the same problem as the check for ingredient hunt. Made it check for radio button as well
		{
			
			submit_form("ramen");
		}
	}
	else if (event.keyCode==67)										//keypress c
	{
		if(document.forms.namedItem("blackstones"))					//Rock On! in the blackstone Concert. Remember to switch your team beforehand based on reward wanted.
		{
			submit_form("blackstones");
		}
	}
    else remove_listener();
}

function remove_listener()
{
	window.removeEventListener("keyup", key_press, false); 			// Removes the event listener, this is critically important to prevent "playing too fast" errors when spamming the button.
}

selectcheckbox("ingredientplace","forest");							//Select Forest Radio when the village is visited, making it the default. You can manually change it if you want and then click d to go through with it. Collection happens first.
selectcheckbox("ramentobuy","app");									//Select Diet Ramen Radio when the village is visited, making it the default. You can manually change it if you want and then click r to eat the new ramen you selected. Keep in mind that you will default to diet on refresh.
selectcheckbox("gothgoth","go");									//Check "Use Perfect Girl Evolution: Goth Goth" box on collect. There is no reason to ever not.
window.addEventListener("keyup", key_press, false);					//When a key is released, run function key_press and provide it with keyID.