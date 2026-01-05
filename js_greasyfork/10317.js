// ==UserScript==
// @name           TorrensMD Link Corector
// @description    Corectarea URL-urilor TMD de pe nume de domenii diferite către acel domeniu pe care deja navighezi
// @include        *torrentsmd.*
// @include        *torrentsmoldova.*
// @version        0.1
// @namespace      https://greasyfork.org/users/3718
// @downloadURL https://update.greasyfork.org/scripts/10317/TorrensMD%20Link%20Corector.user.js
// @updateURL https://update.greasyfork.org/scripts/10317/TorrensMD%20Link%20Corector.meta.js
// ==/UserScript==

(function ($) {
	var hostname = window.location.hostname;

	$('a[href*="torrentsmd"], a[href*="torrentsmoldova"]').each(function() {
		var curhr = $(this).attr('href');
		$(this).attr('href',
			curhr.replace($(this).prop('hostname'), hostname)
		);
	});

})(jQuery);