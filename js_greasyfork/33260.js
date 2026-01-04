// ==UserScript==
// @name          WaniKani Show Specific SRS Level in Reviews
// @namespace     https://www.wanikani.com
// @description   Show "Apprentice 3" instead of "Apprentice", etc.
// @author        seanblue
// @version       1.0.1
// @include       *://www.wanikani.com/review/session*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/33260/WaniKani%20Show%20Specific%20SRS%20Level%20in%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/33260/WaniKani%20Show%20Specific%20SRS%20Level%20in%20Reviews.meta.js
// ==/UserScript==

const eventPrefix = 'seanblue.show_specific_srs.';

// Catch additional events.
// http://viralpatel.net/blogs/jquery-trigger-custom-event-show-hide-element/
(function($) {$.each(['hide'], function(i, ev) { var el = $.fn[ev]; $.fn[ev] = function() { this.trigger(eventPrefix + ev); return el.apply(this, arguments); }; }); })(jQuery);

(function() {
	'use strict';

	const style =
		'<style>' +
			'.srs .srs-up.srs-apprentice1:after,.srs .srs-down.srs-apprentice1:after { content: \'Apprentice 1\' }' +
			'.srs .srs-up.srs-apprentice2:after,.srs .srs-down.srs-apprentice2:after { content: \'Apprentice 2\' }' +
			'.srs .srs-up.srs-apprentice3:after,.srs .srs-down.srs-apprentice3:after { content: \'Apprentice 3\' }' +
			'.srs .srs-up.srs-apprentice4:after,.srs .srs-down.srs-apprentice4:after { content: \'Apprentice 4\' }' +
			'.srs .srs-up.srs-guru1:after,.srs .srs-down.srs-guru1:after { content: \'Guru 1\' }' +
			'.srs .srs-up.srs-guru2:after,.srs .srs-down.srs-guru2:after { content: \'Guru 2\' }' +
		'</style>';

	function addCss() {
		$('head').append(style);
	}

	function updateSrsNames() {
		window.Srs.name = function(e) {
			switch (e) {
				case 1:
					return "apprentice1";
				case 2:
					return "apprentice2";
				case 3:
					return "apprentice3";
				case 4:
					return "apprentice4";
				case 5:
					return "guru1";
				case 6:
					return "guru2";
				case 7:
					return "master";
				case 8:
					return "enlighten";
				case 9:
					return "burn";
			}
		};
	}

	(function() {
		$('#loading:visible').on(eventPrefix + 'hide', function() {
			addCss();
			updateSrsNames();
		});
	})();
})();