// ==UserScript==
// @name		PogomapAdblock
// @homepage	https://www.google.com/
// @namespace	PogomapAdblock
// @version		1.0
// @include		/^https?:\/\/.*po(go|ke)map\.com\/*/
// @exclude		http://www.lapogomap.com/*
// @grant		none
// @description blocks pogoads
// @downloadURL https://update.greasyfork.org/scripts/31366/PogomapAdblock.user.js
// @updateURL https://update.greasyfork.org/scripts/31366/PogomapAdblock.meta.js
// ==/UserScript==

modifyHTML();

function modifyHTML() {

	$('#map').css('top','');
	$('#map').css('bottom','');
	$('#filter_settings').css('top','50px');
	$('#locate').css('top','50px');

}