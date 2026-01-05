// ==UserScript==
// @name           BVS Fields
// @namespace      jones
// @version        1.2
// @history        1.2 New domain - animecubedgaming.com - Channel28
// @history        1.1 Now https compatible (Updated by Channel28)
// @description    Hotkeys (1-4) for the Fields
// @include        http*://*animecubed.com/billy/bvs/villagefields.html
// @include        http*://*animecubedgaming.com/billy/bvs/villagefields.html
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/4663/BVS%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/4663/BVS%20Fields.meta.js
// ==/UserScript==

function process_event(event) 
{
	if (event.keyCode==49) // option 1
           {
document.forms.namedItem("search1").wrappedJSObject.submit();
           }
	if (event.keyCode==50) // option 2
           {
document.forms.namedItem("search2").wrappedJSObject.submit();
           }
	if (event.keyCode==51) // option 3
           {
document.forms.namedItem("search3").wrappedJSObject.submit();
           }
	if (event.keyCode==52) // option 4
           {
document.forms.namedItem("search4").wrappedJSObject.submit();
           }
}
window.addEventListener("keyup", process_event, false);