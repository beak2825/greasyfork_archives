// ==UserScript==
// @name           Nexus Clash Reload on Top
// @namespace      http://userscripts.org/users/125692
// @description    Reload goes to the top of inventory.
// @include        http://nexusclash.com/modules.php?name=Game*
// @include        http://www.nexusclash.com/modules.php?name=Game*
// @exclude        http://nexusclash.com/modules.php?name=Game&op=disconnect
// @exclude        http://www.nexusclash.com/modules.php?name=Game&op=disconnect
// @grant          none
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/5170/Nexus%20Clash%20Reload%20on%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/5170/Nexus%20Clash%20Reload%20on%20Top.meta.js
// ==/UserScript==
//for nexus clash game. Put any item with a reload button at the top of inventory.
(function() {


var inventoryheading = document.evaluate(
	"//b[starts-with(.,'INVENTORY')]", 
	document, 
	null,
	XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	null
	);
if(inventoryheading.snapshotLength>0){
inventoryheading=inventoryheading.snapshotItem(0);//pick the first one
var inventorytbody=inventoryheading.parentNode.parentNode.parentNode.parentNode;//4 lvls up to tbody
var inventoryclothing = document.evaluate(
	"//tr[td/a/text()='Reload']", 
	inventorytbody, 
	null,
	XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	null
	);
	if (inventoryclothing.snapshotLength>0){
		var usableitem=0;
		for (i=0;usableitem=inventoryclothing.snapshotItem(i);i++){
			inventorytbody.insertBefore(usableitem,inventorytbody.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling);
		}
	}
}	
	
//EOF
})();