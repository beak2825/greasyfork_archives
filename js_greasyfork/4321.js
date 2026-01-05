// ==UserScript==
// @name           Zombja Sonar Zs: 0 Hider
// @namespace      Ren Po Ken
// @version        1.2
// @history        1.2 New domain - animecubedgaming.com - Channel28
// @history        1.1 Now https compatible (Updated by Channel28)
// @description    Hides the Zs: 0  in the Zombja Sonar
// @include        http*://*animecubed.com/billy/bvs/zombjasonar.html
// @include        http*://*animecubedgaming.com/billy/bvs/zombjasonar.html
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/4321/Zombja%20Sonar%20Zs%3A%200%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/4321/Zombja%20Sonar%20Zs%3A%200%20Hider.meta.js
// ==/UserScript==


var SonarCells = document.evaluate("//td[@class='map_td']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
													//The above line gets the individual cells of the Sonar Map
var td;
for (var i = 0; td = SonarCells.snapshotItem(i); i++)
	if (/Zs: 0/i.test(td.innerHTML))				//checks for the dreaded "Zs: 0" string in the cell
		{temp = td.innerHTML.split("Zs: 0");		//splits the td and creates the arrays.  "Zs: 0" gets lost
		td.innerHTML=temp.join("");}				//rejoins the arrays without any deliminator

