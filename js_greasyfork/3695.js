// ==UserScript==
// @name        Rutracker.org Magnet URLs
// @namespace   https://greasyfork.org/users/3348-xant1k
// @description Transforms info hash into a magnet url
// @include     http://rutracker.org/*
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/3695/Rutrackerorg%20Magnet%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/3695/Rutrackerorg%20Magnet%20URLs.meta.js
// ==/UserScript==

var e = document.getElementById("tor-hash");
if (e) {
	var hash = e.innerText;
	if (/^[0-9A-F]{40}$/.test(hash)) {
		e.innerHTML = "<a href='magnet:?xt=urn:btih:" + hash + "'>" + hash + "</a>";
	}
}