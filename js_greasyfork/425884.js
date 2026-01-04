// ==UserScript==
// @name     Twitch - Hide Recommended Channels list
// @description Hides the "Recommended Channels" list from the sidebar on twitch.tv
// @version  1
// @grant    none
// @include	*://twitch.tv/*
// @include	*://*.twitch.tv/*
// @author	@sverigevader
// @namespace https://greasyfork.org/en/users/692021-sverigevader
// @downloadURL https://update.greasyfork.org/scripts/425884/Twitch%20-%20Hide%20Recommended%20Channels%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/425884/Twitch%20-%20Hide%20Recommended%20Channels%20list.meta.js
// ==/UserScript==

window.setTimeout(
	function check() {
		if (document.querySelector('[aria-label="Recommended Channels"]')) {
		  main();
		}
		window.setTimeout(check, 250);
	}, 250
);

function main() {
    var node = document.querySelector('[aria-label="Recommended Channels"]');
    node.innerHTML = "";
}