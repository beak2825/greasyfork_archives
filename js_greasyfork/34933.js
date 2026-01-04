// ==UserScript==
// @name        Dickmojis
// @namespace   download
// @description Replaces images
// @include     http://*rabb.it/*
// @include     https://*rabb.it/*
// @version     0.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34933/Dickmojis.user.js
// @updateURL https://update.greasyfork.org/scripts/34933/Dickmojis.meta.js
// ==/UserScript==
// replaces emojis with bepis
let lookup_table = {
	'https://assets.rabb.it/images/emoji-data/sheets-indexed-256/sheet_apple_64_indexed_256.png': 'https://conversations.rabb.it/u/aa1c5758-9c15-481f-b38b-4831a8556e61.png',
};

for (let image of document.getElementsByTagName('img')) {
	for (let query in lookup_table) {
		if (image.src == query) {
			image.src = lookup_table[query];
		}
	}
}