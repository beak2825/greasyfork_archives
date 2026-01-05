// ==UserScript==
// @name          Colorize GCal:monthly timed events
// @description   Colored background for Google Calendar timed events in month view
// @include       https://calendar.google.com/*
// @version       1.1
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @run-at        document-start
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/tinycolor/1.4.1/tinycolor.min.js
// @downloadURL https://update.greasyfork.org/scripts/21320/Colorize%20GCal%3Amonthly%20timed%20events.user.js
// @updateURL https://update.greasyfork.org/scripts/21320/Colorize%20GCal%3Amonthly%20timed%20events.meta.js
// ==/UserScript==

setMutationHandler(document,
	'span.goog-inline-block[style*="background-color:"],' +
	'.st-c-pos .rb-n[style*="background-color:"],' +
	'.st-c-pos .te[style*="color:"]',
function(nodes) {
	nodes.forEach(function(n) {
		var bg = n.style.backgroundColor;
		var fg = n.style.color;
		n.style.color = n.style.backgroundColor = '';

		var appointment = n.className.indexOf('goog-inline-block')>=0 ? n.parentNode : n;
		var color = appointment.style.backgroundColor = bg || fg;
		var isDark = tinycolor(color).getBrightness() < 150; // brightness range is 0-255
		appointment.style.color = isDark ? 'white' : 'black';

		if (isDark && n.classList.contains('rb-n')) {
			n.style.fontWeight = 'bold';
			var v = n.querySelector('.rem-ic'); if (v) v.style.filter = 'invert(1)';
			v = n.querySelector('.rb-ni'); if (v) v.style.color = 'white';
		}

		if (n.style.border)
			n.style.border = '';
	});
	return true;
});
