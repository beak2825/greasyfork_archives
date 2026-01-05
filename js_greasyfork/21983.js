// ==UserScript==
// @name        MH - Mamoune - Script change peau
// @namespace   MH
// @description Gestion des ascendants et descendants dans le profil d'un trõll
// @include     /View/PJView.php
// @icon        https://xballiet.github.io/ImagesMH/MZ.png
// @version     1.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21983/MH%20-%20Mamoune%20-%20Script%20change%20peau.user.js
// @updateURL https://update.greasyfork.org/scripts/21983/MH%20-%20Mamoune%20-%20Script%20change%20peau.meta.js
// ==/UserScript==

// Ascendants et Descendants
var nodes = document.evaluate("//text()[contains(., 'scendant')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if (nodes.snapshotLength != 0) {
	for (var i = 0 ; i < nodes.snapshotLength ; i++) {
		var node = nodes.snapshotItem(i);
		var val = node.nodeValue;
		var prefix = val.slice(0, val.indexOf("("));
		var id = val.slice(val.indexOf("(") + 1, val.indexOf(")"));
		var suffix = val.slice(val.indexOf(")") + 1);
		var elem = document.createElement('span');
		elem.appendChild(document.createTextNode(prefix));
		var link = document.createElement('a');
		link.setAttribute('href', '?ai_IDPJ=' + id);
		link.appendChild(document.createTextNode('(' + id + ')'));
		elem.appendChild(link);
		elem.appendChild(document.createTextNode(suffix));
		node.parentNode.replaceChild(elem, node.parentNode.lastChild);
	}
}