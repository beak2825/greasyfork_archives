// ==UserScript==
// @name        Greasy Fork Content Filter
// @namespace   https://openuserjs.org/
// @description Filter out unwanted content on Greasy Fork
// @include     http*://greasyfork.org/en/scripts*
// @version     1.0
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/22153/Greasy%20Fork%20Content%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/22153/Greasy%20Fork%20Content%20Filter.meta.js
// ==/UserScript==

GM_addStyle(".width-constraint {max-width: 1180px !important}");

var entrytitles = ["Agar.io", "OGARio", "Slither.io", "Diep.io"];

var nodes = document.evaluate("//ol[@class='script-list']/li/article/h2/a | //ol[@class='script-list']/li/article/h2/span[@class='description']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < nodes.snapshotLength; i++) {
	var curScript = nodes.snapshotItem(i).textContent.toString();
	for (var j = 0; j < entrytitles.length; j++) {
		var x = new RegExp("\\b" + entrytitles[j] + "\\b", "gi");
		if (curScript.match(x)) {
			nodes.snapshotItem(i).parentNode.parentNode.parentNode.style.display = 'none';
			break;
		}
	}
}