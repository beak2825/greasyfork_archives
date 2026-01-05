// ==UserScript==
// @name         Eldarya_prices_highlight
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.eldarya.fr/marketplace*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24755/Eldarya_prices_highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/24755/Eldarya_prices_highlight.meta.js
// ==/UserScript==

var watched_items = [];

// Objets et prix max recherché
watched_items.push({name : 'rayon', price : 200});
watched_items.push({name : 'tof', price : 100});
watched_items.push({name : 'coca', price : 50});
var background_color = '#FFAAAA';

function highlight_prices() {
	$('.marketplace-abstract.marketplace-search-item').each( function() {
		var price = $(this).find('#buyNowPrice-item-' + $(this).data('itemid')).data('price');
		if('undefined' == price) return; // No buy now pice ?
		
		var name = $(this).find('.abstract-name').html().trim();
		
		for (var i = 0; i < watched_items.length; i++) {
			if (false === new RegExp(watched_items[i].name, 'gi').test(name)) // Right item name ?
				continue;
			
			if (price < watched_items[i].price) // Low price ?
				$(this).css({'background-color' : background_color});
		}
	});
}

$(document).ajaxComplete( function(a,b,c) {
	if(/ajax_search/.test(c.url)) {
		highlight_prices();
	}
});

console.log('Eldarya - Prices Highlight started');