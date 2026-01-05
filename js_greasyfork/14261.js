// ==UserScript==
// @name        Fanfiction.net - Customize Default Result Filter
// @namespace   ssokolow.com
// @description Override Fanfiction.net's default choices for result filters
// @version     5
// @license     MIT
//
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
//
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_registerMenuCommand
// @grant       GM.registerMenuCommand
//
// @noframes
// @match       *://www.fanfiction.net/*
// @downloadURL https://update.greasyfork.org/scripts/14261/Fanfictionnet%20-%20Customize%20Default%20Result%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/14261/Fanfictionnet%20-%20Customize%20Default%20Result%20Filter.meta.js
// ==/UserScript==

(async function() {
	// Skip everything if this isn't a relevant page since we can't URL-match them.
	if (document.getElementById('filters')) {
  	// Let short-circuit eval only call GM_getValue once on empty query string
  	let preferred_filter;

  	if (window.location.search === "" &&
      	(preferred_filter = await GM.getValue('preferred_filter'))) {
    	// Make it more clear when the page hasn't yet reloaded
    	document.querySelector('body').style.opacity = 0.2;

    	history.replaceState({}, '', preferred_filter);
    	location.reload();
  	} else {
	    // Work around bad interaction between Firefox and replaceState+reload
	    let filter_form = document.querySelector('#filters #myform')
	    if (filter_form) { filter_form.reset(); }

	    GM.registerMenuCommand("Save Current Filters as Default", function() {
      	GM.setValue('preferred_filter', window.location.search);
    	}, 'S');
  	}
	}
})();