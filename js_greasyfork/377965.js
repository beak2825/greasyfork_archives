// ==UserScript==
// @name        GoodBlox Logo to Roblox Logo
// @namespace   https://greasyfork.org/
// @description More nostalgia...
// @include     http://goodblox.pw/*
// @include     https://goodblox.pw/*
// @version     0.2
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/377965/GoodBlox%20Logo%20to%20Roblox%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/377965/GoodBlox%20Logo%20to%20Roblox%20Logo.meta.js
// ==/UserScript==

let lookup_table = {
	'https://goodblox.pw/resources/logo.png': 'https://web.archive.org/web/20071021181906im_/http://www.roblox.com/images/Logo_267_70.png',
};

for (let image of document.getElementsByTagName('img')) {
	for (let query in lookup_table) {
		if (image.src == query) {
			image.src = lookup_table[query];
		}
	}
}