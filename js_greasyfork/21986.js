// ==UserScript==
// @name        MH - Mr X - Actions speciales
// @namespace   MH
// @description Mise en avant des actions spéciales
// @include     */MH_Play/Play_action.php
// @icon        https://xballiet.github.io/ImagesMH/MZ.png
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21986/MH%20-%20Mr%20X%20-%20Actions%20speciales.user.js
// @updateURL https://update.greasyfork.org/scripts/21986/MH%20-%20Mr%20X%20-%20Actions%20speciales.meta.js
// ==/UserScript==

// S'il y a des actions spéciales dans le menu des actions, on change la couleur de celui-ci
var node = document.evaluate("//select/optgroup[1]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if (node.snapshotLength == 1) {
	var optgroup = node.snapshotItem(0);
	if (optgroup.getAttribute("label") == "** Actions Spéciales **") {
		optgroup.setAttribute("style", "background-color: #99CCFF;");
		optgroup.parentNode.setAttribute("style", "background-color: #99CCFF;");
	}
}