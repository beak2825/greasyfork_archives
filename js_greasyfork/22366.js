// ==UserScript==
// @name         [WorldWideTorrents.eu] Load Content Over HTTPS
// @namespace    pxgamer
// @version      0.3.1
// @description  Using SSL breaks the site as it tries to load everything from HTTP rather than the server root.
// @author       pxgamer
// @include      https://*worldwidetorrents.eu/*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22366/%5BWorldWideTorrentseu%5D%20Load%20Content%20Over%20HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/22366/%5BWorldWideTorrentseu%5D%20Load%20Content%20Over%20HTTPS.meta.js
// ==/UserScript==

(function() {
	'use strict';

	$('img[src^="https://worldwidetorrents.eu/"], script[src^="https://worldwidetorrents.eu/"]').each(function(){
		let newSrc = $(this).attr('src').replace('https://', 'https://www.');
		$(this).attr('src', newSrc);
	});

	$('link[href^="https://worldwidetorrents.eu/"]').each(function(){
		let newHref = $(this).attr('href').replace('https://', 'https://www.');
		$(this).attr('href', newHref);
	});
})();
