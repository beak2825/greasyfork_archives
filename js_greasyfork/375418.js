// ==UserScript==
// @name         RED :: Upload Total Length Calculator
// @namespace    https://greasyfork.org/en/scripts/375418-red-upload-total-length-calculator
// @version      1.1
// @description  Calculates the release (and disc) total lengths from YADG-like tracklistings pasted from the foobar2000 texttools quickcopy command, and updates the input field to add them.
// @author       newstarshipsmell
// @include      /https://redacted\.ch/upload\.php(?!\?groupid=\d+)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375418/RED%20%3A%3A%20Upload%20Total%20Length%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/375418/RED%20%3A%3A%20Upload%20Total%20Length%20Calculator.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var albumDesc = document.querySelector('textarea#album_desc');

	var calcBtn = document.createElement('input');
	calcBtn.type = 'button';
	calcBtn.value = 'Calc Total(s)';

	var hook = document.querySelector('div.submit_div');
	hook.appendChild(document.createTextNode(' '));
	hook.appendChild(calcBtn);

	calcBtn.addEventListener('click', function() {
		var descLines = albumDesc.value.split('\n');
		var discTotals = [];
		var relTotal = [0, 0, 0];
		var mins, secs;

		for (var i = 0, len = descLines.length; i < len; i++) {
			if (/\[size=4\]\[b\]Disc \d+\[\/b\] \(0:00:00\)\[\/size\]/.test(descLines[i])) {
				discTotals.push([i, 0, 0]);
			}

			if (/\[b]\d+\[\/b]\. .+ \[i]\(\d{2}:\d{2}\)\[\/i]/.test(descLines[i])) {
				mins = parseInt(descLines[i].replace(/\[b]\d+\[\/b]\. .+ \[i]\((\d{2}):\d{2}\)\[\/i]/, "$1"));
				secs = parseInt(descLines[i].replace(/\[b]\d+\[\/b]\. .+ \[i]\(\d{2}:(\d{2})\)\[\/i]/, "$1"));

				if (discTotals.length) {
					discTotals[discTotals.length - 1][1] += mins;
					discTotals[discTotals.length - 1][2] += secs;
				}

				relTotal[1] += mins;
				relTotal[2] += secs;
			}

			if (/\[b]Total length:\[\/b] 0:00:00/.test(descLines[i])) {
				relTotal[0] = i;
			}
		}

		if (discTotals.length) {
			for (i = 0, len = discTotals.length; i < len; i++) {
				descLines[discTotals[i][0]] = descLines[discTotals[i][0]].replace(/(\[size=4\]\[b\]Disc \d+\[\/b\] \()0:00:00(\)\[\/size\])/,
																				  '$1' + getDuration(discTotals[i][1], discTotals[i][2], false) + '$2');
			}
		}

		descLines[relTotal[0]] = descLines[relTotal[0]].replace(/(\[b]Total length:\[\/b] )0:00:00/,
																'$1' + getDuration(relTotal[1], relTotal[2], true));

		albumDesc.value = descLines.join('\n');
	});

	function getDuration(m, s, omitH) {
		m += Math.trunc(s / 60);
		s = s % 60;
		var h = Math.trunc(m / 60);
		m = m % 60;
		return ((h == 0 && !omitH) ? '' : (h < 10 ? '0' : '') + h + ":") + (m < 10 ? '0' : '') + m + ":" + (s < 10 ? '0' : '') + s;
	}

})();