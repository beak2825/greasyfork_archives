// ==UserScript==
// @name         Google I'm Feeling Lucky Redirect Workaround
// @namespace    https://github.com/paponius/papo-userscripts/
// @version      0.3
// @description  Immediately redirects when google prompts 'redirection notice'. Used to circumvent google pestering you when querying with I'm Feeling Lucky feature.
// @author       paponius
// @include      https://www.google.com/url?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477786/Google%20I%27m%20Feeling%20Lucky%20Redirect%20Workaround.user.js
// @updateURL https://update.greasyfork.org/scripts/477786/Google%20I%27m%20Feeling%20Lucky%20Redirect%20Workaround.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* jshint -W014: true */ // Misleading line break before '||' and '&&'.

(async function() {
	'use strict';

	var config = {
		// empty sites array means, this will force redirect for all sites
		sites: [
			// 'imdb.com'
		],
		delay: 2000 // in ms
	};

	// From: https://stackoverflow.com/a/8486188
	function parseURI() {
		const url = location.search;
		const query = url.substr(1);
		const result = {};
		query.split("&").forEach(function(part) {
			var item = part.split("=");
			result[item[0]] = decodeURIComponent(item[1]);
		});
		return result;
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	var uriParams = parseURI();
	if (!uriParams.iflsig && !uriParams.psig && uriParams.q !== ''
		&& (config.sites.length === 0
			|| config.sites.some(site => uriParams.q.indexOf(site) !== -1)
			)
		) {
		await sleep(config.delay);
		location.href = uriParams.q;
	}
})();

/*

 * Sleep
   Sometimes cookies are not sent with the request. This will result in opening a generic page,
   e.g. IMDb not signed-in, in different that desired language, etc.
   Not sure why and if it's Firefox only problem. Waiting couple of seconds helps resolve this issue.

 * The issue with original GM script and with similar GM solutions
   * Google does not always stop at the Redirection Notice, this script must detect such cases and
	 not force the redirection.
	 * When the result is on a Google affiliated site, or otherwise approved.
	   In such case *iflsig* parameter is present in URI.
	 * The same for Picture Search results and *psig* parameter.
   * The parameter *q* might be empty. (read below)

 * The purpose of the Redirection Notice is to avoid redirecting to possible bogus and fraudulent
   web pages. It might not be desired to circumvent this safety measure in all cases.
   If this is required only for a limited set of target web sites, create a list in config.sites array.

 * Parameters Google uses Redirection Notice URI
	iflsig: A Google signature which authenticates trusted target redirects.
	psig:   As iflsig, but for Google Picture Search.
	ved:    Referrer
	ust:    Did not investigate the meaning. [Number]
	usg:    Did not investigate the meaning. [a-Z0-9_]
	url:    The target URI. (A new version/substitute for 'q'?)
	q:      The target URI. When *url* is used, *q* is present, but empty.

 * Examples and the format of the *I Feel Lucky* search
   https://www.google.com/search?q=site:imdb.com+matrix&btnI=

   I don't remember how I initialized the *I Feel Lucky Search* and how following links were produced.
   It was 4 years ago from now 2023.
   These links worked only around 5 minutes, until the signature was changed.

   From images results
   https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&ved=2ahUKEwir6oWy3aHmAhWLZlAKHZTADEAQjhx6BAgBEAI&url=https%3A%2F%2Fwww.imdb.com%2FREMOVED&psig=AOvVaw2f6fIfMs28RSnPJ7Ow98KS&ust=1575745988682157

   From web (normal) results
   https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=9&ved=2ahUKEwiRtOKE8qHmAhULL1AKHXUrACMQFjAIegQIAxAB&url=https%3A%2F%2Fsuperuser.com%2Fquestions%2F183554%2Fhow-to-recover-form-information-for-a-webpage-in-firefox&usg=AOvVaw3o_HBDRNqmzWbz1WQcqjPq

 */
