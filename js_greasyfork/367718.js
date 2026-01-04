// ==UserScript==
// @author			Rainbow-Spike
// @version			1.1
// @name			2ch MenuReturner
// @description		Полные названия досок
// @icon			https://www.google.com/s2/favicons?domain=2ch.hk
// @include			http*://2ch.hk*
// @grant			none
// @run-at			document-end
// @license			CC-BY-NC-SA-4.0
// @namespace https://greasyfork.org/users/7568
// @downloadURL https://update.greasyfork.org/scripts/367718/2ch%20MenuReturner.user.js
// @updateURL https://update.greasyfork.org/scripts/367718/2ch%20MenuReturner.meta.js
// ==/UserScript==

var	bar = document.getElementsByClassName("adminbar__boards")[0],
	as = bar.getElementsByTagName("a");
for (i in as) {
	as[i].innerHTML = as[i].title;
}