// ==UserScript==
// @name         Colorize Collage Subscriptions By Year
// @namespace    https://greasyfork.org/en/scripts/372606-colorize-collage-subscriptions-by-year
// @version      1.0
// @description  Colorize subscription additions by year / ranges of years.
// @author       newstarshipsmell
// @match        https://redacted.ch/userhistory.php?action=subscribed_collages
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372606/Colorize%20Collage%20Subscriptions%20By%20Year.user.js
// @updateURL https://update.greasyfork.org/scripts/372606/Colorize%20Collage%20Subscriptions%20By%20Year.meta.js
// ==/UserScript==

(function() {
	'use strict';
	// 'yearX_yearY' (or 'yearZ'): [Red(0-255), Green(0-255), Blue(0-255), Opacity-Left(0-1), Opacity-Right(0-1)],
	var colors = {'2018': [0, 255, 0, 0, 0.75],
				  '2016_2017': [191, 255, 0, 0, 0.75],
				  '2013_2015': [255, 255, 0, 0, 0.75],
				  '2010_2012': [255, 127, 0, 0, 0.75],
				  '2005_2009': [255, 0, 0, 0, 0.75],
				  '2000_2004': [127, 0, 0, 0, 0.75]};
	var additions = document.querySelectorAll('div.group_info');
	for (var i = 0, len = additions.length, j; i < len; i++) {
		j = parseInt(additions[i].querySelector('strong').lastChild.textContent.replace(' [', '').replace(']', ''));
		for (var k in colors) {
			if (j == parseInt(k) || (j >= parseInt(k.split('_')[0]) && j <= parseInt(k.split('_')[1]))) {
				additions[i].style['background-image'] = 'linear-gradient(to right, rgba(' + colors[k][0] + ',' + colors[k][1] + ',' + colors[k][2] + ',' +
					colors[k][3] + '), rgba(' + colors[k][0] + ',' + colors[k][1] + ',' + colors[k][2] + ',' + colors[k][4] + '))';
			}
		}
	}
})();