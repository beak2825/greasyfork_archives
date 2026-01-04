// ==UserScript==
// @name        Emi CK+ >> Plushies over Gen 2 Sprites
// @namespace   Violentmonkey Scripts
// @match       https://emi.dev/ck+/*
// @grant       GM_addStyle
// @version     1.0
// @author      Lynn
// @license     MIT
// @description 29/07/2024, 16:59:21
// @downloadURL https://update.greasyfork.org/scripts/502116/Emi%20CK%2B%20%3E%3E%20Plushies%20over%20Gen%202%20Sprites.user.js
// @updateURL https://update.greasyfork.org/scripts/502116/Emi%20CK%2B%20%3E%3E%20Plushies%20over%20Gen%202%20Sprites.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.innerHTML = 'function getPokeImage(poke, unownExtra = undefined) {	var shiny = poke.name && isShiny(poke) ? "shiny" : "normal";if (poke.name) {		poke = poke.name;	}	if (unownExtra !== undefined && poke == "unown") {		poke += ["-b", "-u", "-n", "-n", "-y", "-q", "-t"][unownExtra];	}	return \'https://raw.githubusercontent.com/AFalsePrayer/pokemon-plushies/main/raw/\' + poke + \'.png\';}';
document.getElementsByTagName('head')[0].appendChild(script);

GM_addStyle(`
	.calc-team img {
		height:50px !important;
  }`
);
