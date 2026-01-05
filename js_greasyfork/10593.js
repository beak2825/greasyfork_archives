// ==UserScript==
// @name	TF2R - Confirm leave raffle
// @namespace	auhtwoo
// @description	Makes it difficult to leave raffles accidentally - thanks Iwasawa for original code, all I did was put it in its own script
// @include	http://tf2r.com/k*
// @include	https://tf2r.com/k*
// @grant	none
// @locale what
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/10593/TF2R%20-%20Confirm%20leave%20raffle.user.js
// @updateURL https://update.greasyfork.org/scripts/10593/TF2R%20-%20Confirm%20leave%20raffle.meta.js
// ==/UserScript==   

$(document).ready (function() {
		var btn = $('.jlbutl #enbut'),
			clicks;

		if (!btn.length) {
			return;
		}

		if (jQuery._data) {
			clicks = jQuery._data(btn.get(0), 'events').click;
		} else {
			clicks = btn.data('events').click;
		}

		clicks.unshift({type: 'click', handler: function(e) {
			var wantToLeave = confirm('Are you sure you want to leave this raffle?');
			if (!wantToLeave) {
				e.stopImmediatePropagation();
				return false;
			}
		}});
	});