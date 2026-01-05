// ==UserScript==
// @name        Kill Typeahead Search
// @namespace   https://greasyfork.org/en/scripts/373-kill-typeahead-search
// @description Removes drop down lists that try to second guess the user
// @include     *
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/373/Kill%20Typeahead%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/373/Kill%20Typeahead%20Search.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
	var $ = unsafeWindow.jQuery;
	$('input[type=text]').unbind().attr('autocomplete', 'on');
	$('input[type=search]').unbind().attr('autocomplete', 'on');

	/* From https://en.wikipedia.org/wiki/MediaWiki:Gadget-disablesuggestions.js
	 * Exclude wikipedia.org locally if you use this gadget.
	 */
	if (mw) {
		mw.loader.using( 'mediawiki.searchSuggest', function () {
			$('#searchInput, #powerSearchText, #searchText, .mw-searchInput').off().attr('autocomplete', 'on');
			$('#simpleSearch #searchButton').attr( {'name': 'fulltext', 'value': 'Search' } );
		} );
	}
});