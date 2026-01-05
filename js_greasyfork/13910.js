// ==UserScript==
// @name         New Outlook.com Email OWA Adbar remover
// @version      0.1.4
// @description  This script removes Outlook.com Email OWA Ads from new interface and reclaims the space.
// @author       Allan DSouza
// @match        https://outlook.live.com/*
// @grant        none
// @namespace https://greasyfork.org/users/20177
// @downloadURL https://update.greasyfork.org/scripts/13910/New%20Outlookcom%20Email%20OWA%20Adbar%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/13910/New%20Outlookcom%20Email%20OWA%20Adbar%20remover.meta.js
// ==/UserScript==


(function() {var css = [
    "._n_h {display: none; width: 0 !important; position: absolute}",
    "#primaryContainer > div:nth-child(7){ right: 0 !important; width: 100% !important;}",
    "._n_15 {display: none; width: 0 !important; position: absolute}",
    "._2qPmszDwBfYpF7PO9Mn3KN {display: none; width: 0 !important; position: absolute}"
].join("\n");

	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node); 
	} else {
		document.documentElement.appendChild(node);
	}
})();