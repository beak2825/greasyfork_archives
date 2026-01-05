// ==UserScript==
// @name		BvS Mission Hotkeys for April Fools
// @namespace		taltamir, yichizhng & Channel28
// @description		Mission hotkeys for BvS
// @version		1.4
// @history     	1.4 Fixed some bugs and added a shortcut to go back to mission select - by Takumi
// @history		1.3 If 'Act in the Kage's Place' appears, escape/smoke bomb not used - by Catprog
// @history		1.2 New domain - animecubedgaming.com - Channel28
// @history             1.1 Now https compatible (Updated by Channel28)
// @history		1.0 Initial version - based off TalTamir's BvS Mission Hotkeys, edited by Yichi for April Fools Day 2016 and some comments added by Channel28
// @include		http*://*animecubed.com/billy/bvs/mission*
// @include		http*://*animecubedgaming.com/billy/bvs/mission*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/18420/BvS%20Mission%20Hotkeys%20for%20April%20Fools.user.js
// @updateURL https://update.greasyfork.org/scripts/18420/BvS%20Mission%20Hotkeys%20for%20April%20Fools.meta.js
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
        var jutsu520 = document.querySelector('#jutsu520');         //is Unforeseen Consequences jutsu available?
        if (jutsu520 && (!jutsu520.disabled)) {
            return;
        }
       
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
 
function blah() {
    var jutsu520 = document.querySelector('#jutsu520');         //selects Unforeseen Consequences jutsu when available
    if (jutsu520 && (!jutsu520.disabled)) {
        //alert("omg omg omg");
        jutsu520.checked = true;
    }else if(document.body.textContent.search("Act in the Kage's Place")>=0){
     document.querySelector('#jutsu497').checked = true;
    }
}
 
blah();