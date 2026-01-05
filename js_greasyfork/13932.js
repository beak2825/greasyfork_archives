// ==UserScript==
// @name        Hide all candy corn
// @namespace   http://userscripts.org/users/125692
// @description hide candy corn
// @include        http://nexusclash.com/modules.php?name=Game*
// @include        http://www.nexusclash.com/modules.php?name=Game*
// @exclude        http://nexusclash.com/modules.php?name=Game&op=disconnect
// @exclude        http://www.nexusclash.com/modules.php?name=Game&op=disconnect
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13932/Hide%20all%20candy%20corn.user.js
// @updateURL https://update.greasyfork.org/scripts/13932/Hide%20all%20candy%20corn.meta.js
// ==/UserScript==

//name='enchanting'
var forms = document.evaluate(
	"//td[text()='Candy Corn'] ", 
	document, 
	null,
	XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	null
);
//alert("running");
if (forms.snapshotLength>0){
  forms.snapshotItem(0).parentNode.style.visibility='hidden';
}
