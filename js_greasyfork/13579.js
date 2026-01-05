// ==UserScript==
// @name        Stop AMO Condescension
// @namespace   https://greasyfork.org/en/scripts/13579-stop-amo-condescension
// @description Stops mozilla from hiding links to download incompatible addons
// @include     http://addons.mozilla.org/*
// @include     https://addons.mozilla.org/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13579/Stop%20AMO%20Condescension.user.js
// @updateURL https://update.greasyfork.org/scripts/13579/Stop%20AMO%20Condescension.meta.js
// ==/UserScript==
var i;
var elem
var divs = document.getElementsByTagName("div");

for (i = 0; i < divs.length; i++) {
	elem = divs[i];
	if (elem.hasAttribute("data-min")) elem.setAttribute("data-min", "1.0");
	if (elem.hasAttribute("data-max")) elem.setAttribute("data-max", "99.*");
}

