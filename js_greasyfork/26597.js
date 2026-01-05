// ==UserScript==
// @name        DiamondHunt Replaced Images
// @namespace   https://github.com/Farow/userscripts
// @description Replaces Default with Custom DH images
// @include     *
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26597/DiamondHunt%20Replaced%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/26597/DiamondHunt%20Replaced%20Images.meta.js
// ==/UserScript==

let lookup_table = {
	'http://www.diamondhunt.co/images/minerals/wood.png': 'http://i.imgur.com/re8hWGb.png', // Wood replacement
	'http://www.diamondhunt.co/images/pic_coin.png': 'http://i.imgur.com/iTX7oKN.png', // Coins
	'http://www.diamondhunt.co/images/pic_coin2.png': 'http://i.imgur.com/U1LhLvc.png',// Platinum
	'http://www.diamondhunt.co/images/donor_coin.png': 'http://i.imgur.com/0ZK4Hcy.png',// Donor Coin
	'http://www.diamondhunt.co/images/minerals/bloodDiamond.png':'http://i.imgur.com/QaPxYE0.png',// Blood Diamond
	'http://www.diamondhunt.co/images/minerals/Diamond.png':'http://i.imgur.com/QwwgKno.png',// Diamond
	'http://www.diamondhunt.co/images/minerals/emerald.png':'http://i.imgur.com/DoBQuPe.png',// Emerald
	'http://www.diamondhunt.co/images/minerals/copper.png':'http://i.imgur.com/5PvIXaV.png',// Copper
	'http://www.diamondhunt.co/images/minerals/tin.png':'http://imgur.com/l7w4sn2.png',// Tin
	'http://www.diamondhunt.co/images/minerals/iron.png':'http://i.imgur.com/4JVytyR.png',// Iron
	'http://www.diamondhunt.co/images/minerals/silver.png':'http://i.imgur.com/xqzN2yv.png',// Silver
	'http://www.diamondhunt.co/images/minerals/gold.png':'http://i.imgur.com/R9tNbI2.png',// Gold
	'http://www.diamondhunt.co/images/minerals/sand.png':'http://imgur.com/0vOSG78.png',// Sand
	'http://www.diamondhunt.co/images/stone.png':'http://i.imgur.com/L0Xejxq.png',// Stone
	'http://www.diamondhunt.co/images/minerals/stardust.png':'http://i.imgur.com/I89IPNe.png', // Stardust
};

for (let image of document.getElementsByTagName('img')) {
	for (let query in lookup_table) {
		if (image.src == query) {
			image.src = lookup_table[query];
		}
	}
}