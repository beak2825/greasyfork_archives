// ==UserScript==
// @name		BvS Quest Hotkeys
// @namespace	BvS
// @description	Quest hotkeys for BvS
// @version		4
// @history		4 clicking d also starts the quest "forest of death"
// @history		3 clicking d also starts the quests "Very Tragic Story", "Stalkergirl", "Checkmate", "junk II", "junk III", "junk IV"
// @history		2 added claiming your snow rewards, streamlined code, clicking c when out of stamina should no longer reload page
// @history		1.7 fixed watching your show (watching your shows is now quest44 not quest43)
// @history		1.6 button press will start "watching your shows" if available.
// @history		1.5 on rolling quests, will reattempt with same jutsu choice if available.
// @history		1.4 will not reload page if out of stamina
// @history		1.3 solved problem where clicking d on the quest main page reloaded it. More efficient code. press d to start and skip chunin exam.
// @history		1.2 script termination to prevent performance degredation, and to prevent accidental reloading of quests page mid quest (if clicking d too fast).
// @history		1.1 Added updateURL
// @history		1.0 Initial version
// @match		http://www.animecubed.com/billy/bvs/quest*
// @match		http://animecubed.com/billy/bvs/quest*
// @match		http://www.animecubed.com/billy/bvs/chuninexam*
// @match		http://animecubed.com/billy/bvs/chuninexam*
// @downloadURL https://update.greasyfork.org/scripts/19100/BvS%20Quest%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/19100/BvS%20Quest%20Hotkeys.meta.js
// ==/UserScript==

function submit_form(form_name)
{
	if (document.forms.namedItem(form_name))
	{
		remove_listener();													//Remove keypress listener before page refresh
		location.assign('javascript:' + form_name + '.submit()');
	}
}

function remove_listener()
{
	window.removeEventListener("keyup", key_press, false); 					// Removes the event listener, this is critically important to prevent "playing too fast" errors when spamming the button.
}

function key_press(event)
{
	if (event.keyCode==68)													//keypress d
	{
		if(0<=document.body.textContent.search("Not Enough Stamina"))		//Check for out of stamina, to avoid reloading on quest fail. Must come before checking for "attack", since out of stamina hide from user but does not disable attack key.
		{
			remove_listener();												//Remove key listener
		}
		else if(document.forms.namedItem("goquest2"))						//Check for quest fail, to avoid reloading on quest fail
		{
			remove_listener();												//Remove key listener
		}
		else if(document.forms.namedItem("attack"))							//checks for a button named "Attack"
		{
			submit_form("attack");
		}
		else if(document.forms.namedItem("goquestgo"))						//Check for reattempt rolling quest with same jutsu
		{
			submit_form("goquestgo");
		}
		else if(document.forms.namedItem("goquest"))						//Check for going to next step in quest is available.
		{
			submit_form("goquest");
		}
		else if(document.forms.namedItem("questcontinue"))					//Check for Continue Quest (when you left the quest menu and came back)
		{
			submit_form("questcontinue");
		}
		else if(document.forms.namedItem("quest44"))						//Check if the "Watching your shows" quest is available.
		{
			submit_form("quest44");											//Start Daily shows quest
		}
		else if(document.forms.namedItem("questchu1"))						//Check if the chunin exam is available.
		{
			submit_form("questchu1");										//Start Chunin Exam quest
		}
		else if(document.forms.namedItem("skipchu"))						//Check for skip chunin exam button
		{
			submit_form("skipchu");											//Skip Chunin Exam
		}
		else if(document.forms.namedItem("quest85"))						//Check for "forest of death"
		{
			submit_form("quest85");
		}
		else if(document.forms.namedItem("quest17"))						//Check for "World Shoveling Association" to collect snow winning
		{
			submit_form("quest17");											//start "World Shoveling Association" quest
		}
		else if(document.forms.namedItem("quest125"))						//Check for "Very Tragic Story" quest
		{
			submit_form("quest125");
		}
		else if(document.forms.namedItem("quest159"))						//Check for "Stalkergirl" quest
		{
			submit_form("quest159");
		}
		else if(document.forms.namedItem("quest165"))						//Check for "Checkmate" quest
		{
			submit_form("quest165");
		}
		else if(document.forms.namedItem("quest94"))						//Check for "Junk II" quest
		{
			submit_form("quest94");
		}
		else if(document.forms.namedItem("quest145"))						//Check for "Junk III" quest
		{
			submit_form("quest145");
		}
		else if(document.forms.namedItem("quest87"))						//Check for "Junk IV" quest
		{
			submit_form("quest87");
		}
		else if(document.forms.namedItem("questhide"))						//Check for the quest hide interface to indicate that the current page is the main quest window, to prevent reloading it
		{
			remove_listener();												//Remove key listener
		}
		else
		{
			remove_listener();												//Remove key listener
			submit_form("minim4");											//Return to Quests menu if quest completed
		}
	}
	else if (event.keyCode==67)												//keypress c
	{
		submit_form("chakra");												//Charge chakra
	}
}

window.addEventListener("keyup", key_press, false);