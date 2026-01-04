// ==UserScript==
// @name        Blackstar Rating Stars for All Ratings - RateYourMusic
// @description Uses the Blackstar rating stars for all releases on RYM
// @version     1.0
// @license     MIT
// @match       https://rateyourmusic.com/*
// @namespace   iN008
// @downloadURL https://update.greasyfork.org/scripts/435654/Blackstar%20Rating%20Stars%20for%20All%20Ratings%20-%20RateYourMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/435654/Blackstar%20Rating%20Stars%20for%20All%20Ratings%20-%20RateYourMusic.meta.js
// ==/UserScript==
let lookup_table = {
	'https://e.snmc.io/2.5/img/images/10m.png': 'https://e.snmc.io/2.5/img/images/black/10mb.png',
	'https://e.snmc.io/2.5/img/images/9m.png': 'https://e.snmc.io/2.5/img/images/black/9mb.png',
	'https://e.snmc.io/2.5/img/images/8m.png': 'https://e.snmc.io/2.5/img/images/black/8mb.png',
	'https://e.snmc.io/2.5/img/images/7m.png': 'https://e.snmc.io/2.5/img/images/black/7mb.png',
	'https://e.snmc.io/2.5/img/images/6m.png': 'https://e.snmc.io/2.5/img/images/black/6mb.png',
	'https://e.snmc.io/2.5/img/images/5m.png': 'https://e.snmc.io/2.5/img/images/black/5mb.png',
	'https://e.snmc.io/2.5/img/images/4m.png': 'https://e.snmc.io/2.5/img/images/black/4mb.png',
	'https://e.snmc.io/2.5/img/images/3m.png': 'https://e.snmc.io/2.5/img/images/black/3mb.png',
	'https://e.snmc.io/2.5/img/images/2m.png': 'https://e.snmc.io/2.5/img/images/black/2mb.png',
	'https://e.snmc.io/2.5/img/images/1m.png': 'https://e.snmc.io/2.5/img/images/black/1mb.png',
};

for (let image of document.getElementsByTagName('img')) {
	for (let query in lookup_table) {
		if (image.src == query) {
			image.src = lookup_table[query];
		}
	}
}