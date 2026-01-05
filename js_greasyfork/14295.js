// ==UserScript==
// @name        The Pirate Bay ad-blocker
// @namespace   tpb-adblock
// @description Block ads at thepiratebay.* domains. TPB is a all-age site but contains adult and sexist advertisements.
// @include     http://thepiratebay.*
// @include     http://www.thepiratebay.*
// @include     https://thepiratebay.*
// @include     https://www.thepiratebay.*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14295/The%20Pirate%20Bay%20ad-blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/14295/The%20Pirate%20Bay%20ad-blocker.meta.js
// ==/UserScript==

contentEval(function(){/*x_start*/

	(function() {

		// remove ads
		var ads = document.querySelectorAll("iframe, [src*=\"/static/ads/\"]");
		for( var x = 0; x < ads.length; x++ ) {
			ads[x].parentNode.removeChild(ads[x]);
		}

	})();

/*x_end*/});

function contentEval(source) {
	source = source.toString();
	source = source.substring(source.indexOf("/*x_start*/"), source.indexOf("/*x_end*/"));
	
	var script = document.createElement('script');
	script.textContent = source;

	document.body.appendChild(script);
}