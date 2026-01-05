// ==UserScript==
// @name		BvS Mission Hotkeys
// @namespace		taltamir
// @description		Mission hotkeys for BvS
// @version		1.6
// @history		1.6 Fixed some bugs and added a shortcut to go back to mission select - by Takumi
// @history		1.5 New domain - animecubedgaming.com - Channel28
// @history 		1.4 Now https compatible (Updated by Channel28)
// @history		1.3 e is disabled if smoke bomb count is zero. Better code.
// @history		1.2 e is disabled if an ally may level in mission. script terminates after execution to plug memory hole and prevent slowdowns. This also prevent "playing too fast" error and the crashing of mission tweak script.
// @history		1.1 Pressing e now also gets you a new mission.
// @history		1.0 Initial version
// @include		http*://*animecubed.com/billy/bvs/mission*
// @include		http*://*animecubedgaming.com/billy/bvs/mission*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/2467/BvS%20Mission%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/2467/BvS%20Mission%20Hotkeys.meta.js
// ==/UserScript==

window.addEventListener("keyup", key_press, false);             //When a key is released, run function key_press and provide it with keyID.
 
function key_press(event)
{
    if (event.keyCode==68)                          //keypress d
    {
        if(document.forms.namedItem("attempt"))             //Check if there is an attempt mission button
        {
      window.removeEventListener("keyup", key_press, false);    //Remove keypress listener
            document.forms.namedItem("attempt").submit();       //Attempt mission
        }
        if(document.forms.namedItem("domission"))           //Check if there is a new mission button
        {
      window.removeEventListener("keyup", key_press, false);    //Remove keypress listener
            document.forms.namedItem("domission").submit(); //New mission
        }
    }
 
    if (event.keyCode==69)                          //keypress e
    {
	if(document.body.textContent.search("One of your Allies has potential to level here!")>=0); //Checks if an ally may level, if yes do nothing.
        else if(document.body.textContent.search("Item taken: Smoke Bombs - 0 remain")>=0);     //Checks if smokebomb count is zero, if yes do nothing.
        else if(document.forms.namedItem("attempt"))            //Check if there is an attempt mission button, but only if the above two ifs are false.
        {
            window.removeEventListener("keyup", key_press, false);  //Remove keypress listener
            document.querySelector('#jutsu374').checked = true;
      document.forms.namedItem("attempt").submit();     //Attempt mission
        }
 
    if(document.forms.namedItem("domission"))           //Check if there is a new mission button
        {
            window.removeEventListener("keyup", key_press, false);  //Remove keypress listener
            document.forms.namedItem("domission").submit(); //New mission
        }
    }
 
    if (event.keyCode==67 && document.forms.namedItem("chakra"))                            //keypress c
        document.forms.namedItem("chakra").submit();            //Charge chakra
 
    if (event.keyCode==66 && document.forms.namedItem("backmission"))                           //keypress b
        document.forms.namedItem("backmission").submit();           //Back to mission select
}