// ==UserScript==
// @name		MirkoLoader
// @description	Automatycznie pokazuje nowe wpisy na mirko.
// @namespace	
// @include		http://www.wykop.pl/mikroblog*
// @include		http://www.wykop.pl/tag*
// @include		http://www.wykop.pl/moj*
// @grant		none
// @version		1.0
// @run-atdocument-end
// @downloadURL https://update.greasyfork.org/scripts/2422/MirkoLoader.user.js
// @updateURL https://update.greasyfork.org/scripts/2422/MirkoLoader.meta.js
// ==/UserScript==

function main() {
    $('div#newEntriesCounter').hide();
        		$(document).ajaxComplete(function() {
               	$('div#newEntriesCounter').find('a.ajax').trigger('click')
        });
}

if (typeof $ == 'undefined') {
	if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
		// Firefox
		var $ = unsafeWindow.jQuery;
		main();
	} else {
		// Chrome
		addJQuery(main);
	}
} else {
	// Opera >.>
	main();
}

function addJQuery(callback) {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
}