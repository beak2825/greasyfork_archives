// ==UserScript==
// @name        Factorio Mod Portal hover to open thumbnails
// @namespace   MoneyAllDay
// @description Hover the cursor on the image thumbnails to open them instead of clicking
// @version     1.0.2
// @match       https://mods.factorio.com/mod*/*
// @icon        https://mods.factorio.com/static/favicon.ico
// @require     http://code.jquery.com/jquery-latest.js
// @grant       none
// @homepage    https://greasyfork.org/en/users/51059-moneyallday
// @author      MoneyAllDay
// @license     CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/466951/Factorio%20Mod%20Portal%20hover%20to%20open%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/466951/Factorio%20Mod%20Portal%20hover%20to%20open%20thumbnails.meta.js
// ==/UserScript==


this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function () {

	$('.gallery-thumbnail.p0').mouseenter(
		function () {
			$(this).not('.gallery-thumbnail.p0.active').click();
		});

})



// .gallery-thumbnail.p0
// .gallery-thumbnail.p0.active