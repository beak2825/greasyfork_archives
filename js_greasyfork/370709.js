// ==UserScript==
// @name         Barter.vg Wishlist Match Enhancer
// @description  Removes untradable items (0 tradable), and sort list in descending order by number of traders
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       mcbyte
// @match        https://barter.vg/u/*/w/m/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @runat        document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370709/Bartervg%20Wishlist%20Match%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/370709/Bartervg%20Wishlist%20Match%20Enhancer.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    $('#wishGame > option').each(function() {
		if (this.text.endsWith('(0)')) {
			$(this).remove();
		}
    });

	// sort select menu
	$('#wishGame > option').each(function() {
		var tradeCountObj = this.text.match(/\((\d+)\)/);
		if (tradeCountObj != null) {
			var tradeCount = tradeCountObj[1];
			$(this).attr('dataSort', tradeCount);
			console.log(this.text + ' is traded by this many people: ' + tradeCount);
		}
    });

	var selectList = $('#wishGame option');

	selectList.sort(function(a,b){
		var aVal = $(a).attr('dataSort');
		var bVal = $(b).attr('dataSort');
		if (aVal != bVal) {
			return  bVal - aVal;
		} else {
			return ($(a).text() > $(b).text() ? 1 : -1);
		}
	});
	console.log(selectList);
	$('#wishGame').empty().append(selectList);
	$('#wishGame').val('0');
	$('#wishGame option:first').text('[ any game on wishlist ] (Enhanced+)');

})();