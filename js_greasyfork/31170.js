// ==UserScript==
// @name        OUTIcomplete
// @namespace   raina
// @description Restores card number autocompletion in OUTI library login.
// @include     /^https:\/\/koha\.outikirjastot\.fi\//
// @include     /^https:\/\/[\w]+\.finna\.fi\//
// @version     2.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31170/OUTIcomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/31170/OUTIcomplete.meta.js
// ==/UserScript==
// jshint esversion: 6
if (window.top === window.self) {
	document.body.addEventListener("focus", ev => {
		if ("INPUT" === ev.target.tagName && /^user/.test(ev.target.name) && "on" !== ev.target.autocomplete) {
			ev.target.setAttribute("autocomplete", "on");
			ev.target.autocomplete = "on";
			ev.target.blur();
			setTimeout(() => {ev.target.focus();}, 500);
		}
	}, true);
}
