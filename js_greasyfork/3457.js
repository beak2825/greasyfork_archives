// ==UserScript==
// @name           BvS Partyhouse Defaults
// @namespace      BvS
// @description    Selects checkboxes for some partyhouse games.
// @version        1.3
// @history        1.3 New domain - animecubedgaming.com - Channel28
// @history        1.2 Now https compatible (Updated by Channel28)
// @include        http*://*animecubed.com/billy/bvs/partyhouse.*
// @include        http*://*animecubedgaming.com/billy/bvs/partyhouse.*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/3457/BvS%20Partyhouse%20Defaults.user.js
// @updateURL https://update.greasyfork.org/scripts/3457/BvS%20Partyhouse%20Defaults.meta.js
// ==/UserScript==
/*
Copyright (c) 2009 Daniel Karlsson

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

// Tsukiball
var form = document.getElementsByName("skib")[0]
if (form) {
	var check = document.getElementsByName("megatsuki")[0]; // MegaTsuki	
	if (check)
 {	
		check.setAttribute("checked", "checked");

	}
	var check = document.getElementsByName("rolltype")[2]; // Go for Broke
	
	if (check)
 {
		check.setAttribute("checked", "checked");

	}
	var check = document.getElementsByName("doemall")[0];
 // Throw All
	if (check)
 {	
	check.setAttribute("checked", "checked");

	}


}
// SNAKEMAN... OR NO SNAKEMAN
var form = document.getElementsByName("newsnake")[0]
if (form) {
	var check = document.getElementsByName("snakebox")[21] // Pick box 22
	if (check) {
	check.setAttribute("checked", "checked");
	}

	var check = document.getElementsByName("start_snake")[0] // Check to confirm
	if (check) {
	check.setAttribute("checked", "checked");
	}

	var check = document.getElementsByName("quick_burn")[0] // Quick-burn option checked
	if (check) {
	check.setAttribute("checked", "checked");
	}
}
// Scratchies
 // Upgrade to SuperTicket
var check = document.getElementsByName("superticket")[0];
	
if (check) {
	
check.setAttribute("checked", "checked");
	
}

// Party Room: Select All-Out Bash
var check = document.getElementsByName("partytype")[2]
if (check) {
check.setAttribute("checked", "checked");
}
// Over 11000
var check = document.getElementsByName("overamt")[1]
if (check) {
check.setAttribute("checked", "checked");	
}
// Jackpot
var form = document.getElementsByName("ninrou")[0]
if (form) {
	var check = document.getElementsByName("multijack")[0]	//Multijack
	if (check) {
		check.setAttribute("checked", "checked"); 
	}
	var checkboxes = ["rowone", "rowtwo", "rowthree", "rowfour", "rowfive"];

	for (var i in checkboxes) {
	
		var check = document.getElementsByName(checkboxes[i])[0];
 // Check all rows	
		if (check) {
			
			check.setAttribute("checked", "checked");

		}
	}

}
// Darts
var check = document.getElementsByName("megadart")[0]
if (check) {
	check.setAttribute("checked", "checked");
}

// Hotkeys
function process_event(event) {
   if (event.keyCode==70, 74){      //F or J
	if(document.forms.namedItem("dgame"))
         document.forms.namedItem("dgame").wrappedJSObject.submit();

	if(document.forms.namedItem("pr"))
         document.forms.namedItem("pr").wrappedJSObject.submit();

	if(document.forms.namedItem("cgame"))
         document.forms.namedItem("cgame").wrappedJSObject.submit();

	if(document.forms.namedItem("over11"))
         document.forms.namedItem("over11").wrappedJSObject.submit();
   
	if(document.forms.namedItem("newsnake"))
         document.forms.namedItem("newsnake").wrappedJSObject.submit();

	if(document.forms.namedItem("skib"))
         document.forms.namedItem("skib").wrappedJSObject.submit();

	if(document.forms.namedItem("ninrou"))
         document.forms.namedItem("ninrou").wrappedJSObject.submit();

	if(document.forms.namedItem("raf"))
         document.forms.namedItem("raf").wrappedJSObject.submit();
	}
}
window.addEventListener("keyup", process_event, false);