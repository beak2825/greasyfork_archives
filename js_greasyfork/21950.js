// ==UserScript==
// @name        ModuleHider
// @namespace   hem
// @description hides empty modules in the uspace overview
// @match       https://uspace.univie.ac.at/web/studierende/pruefungspass*
// @include     https://uspace.univie.ac.at/de/web/studierende/pruefungspass*
// @include     https://uspace.univie.ac.at/en/web/studierende/pruefungspass*
// @author      oerpli
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21950/ModuleHider.user.js
// @updateURL https://update.greasyfork.org/scripts/21950/ModuleHider.meta.js
// ==/UserScript==

(function () {
	'use strict';

	String.prototype.contains = function (it) { return this.indexOf(it) != -1; };
	//var textS = $('#language_selection_dropdown').text().contains('DE')?'Leere Module einblenden':'Show empty modules';

	var textH = $('#language_selection_dropdown').text().contains('DE') ? 'Leere Module ausblenden' : 'Hide empty modules';
	var emptyM = true;
	$('.nav-pills').append('<li id=\'switchB\'><a href=\'#\' id=\'sBT\'>' + textH + '</a></li>');
	$('#switchB').toggle('highlight').toggle('highlight');
	$('#switchB').click(function () {
		var eelems = $('.red').parent().parent().parent().parent();
		if (emptyM) {
			$('#sBT').html($(this).html().replace('aus', 'ein').replace('Hide', 'Show'));
			eelems.hide();
		} else {
			$('#sBT').html($(this).html().replace('ein', 'aus').replace('Show', 'Hide'));
			eelems.show();
		}
		emptyM = !emptyM;
	});
})();
