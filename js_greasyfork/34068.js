// ==UserScript==
// @name          Replace emojis with shortcodes
// @description   To save your toots in plain text
// @namespace     Violentmonkey Scripts
// @include       *://mastodon.social/*
// @include       *://pawoo.net/*
// @grant         none
// @version 0.0.1.20171012151607
// @downloadURL https://update.greasyfork.org/scripts/34068/Replace%20emojis%20with%20shortcodes.user.js
// @updateURL https://update.greasyfork.org/scripts/34068/Replace%20emojis%20with%20shortcodes.meta.js
// ==/UserScript==

function replace(){
var emoji = document.evaluate(
	'//img[@class="emojione"]',
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);
				
for(var i = 0; i < emoji.snapshotLength; i++) {
	img = emoji.snapshotItem(i);
	altText = img.alt;
	replacement = document.createTextNode(altText);
	img.parentNode.replaceChild(replacement, img);
}
}

replace();