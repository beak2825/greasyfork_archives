// ==UserScript==
// @name         Link Sanitizer
// @description  Clean up unnecessary hyperlink redirections and link shims
// @version      1.1.9
// @author       cloux <cloux@rote.ch>
// @license      WTFPL 2.0; http://www.wtfpl.net/about/
// @namespace    https://github.com/cloux
// @homepage     https://github.com/cloux/LinkSanitizer
// @supportURL   https://github.com/cloux/LinkSanitizer
// @icon         http://icons.iconarchive.com/icons/designbolts/seo/128/Natural-Link-icon.png
// @include      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/374699/Link%20Sanitizer.user.js
// @updateURL https://update.greasyfork.org/scripts/374699/Link%20Sanitizer.meta.js
// ==/UserScript==

(function() {
	// Limit contentType to "text/plain" or "text/html"
	if ((document.contentType != undefined) && (document.contentType != "text/plain") && (document.contentType != "text/html")) {
		console.log("Hyperlink Sanitizer - Not loading for content type " + document.contentType);
		return;
	}
	// Sanitize single link
	function sanitize(weblink) {
		// skip non-http links      
		if (! /^http/.test(weblink)) {
			return weblink;
		}
		// whitelisted services
		if (/google\.[a-z]*\/(ServiceLogin|Logout|AccountChooser)/.test(weblink) || // google login service
		    /^https:\/\/translate\.google\./.test(weblink) ||                    // Google translator
		    /^http.*(login|registration)[./?].*http/.test(weblink) ||            // aliexpress, heise.de
		    /\/oauth\?/.test(weblink) ||                                         // OAuth on aws.amazon.com
		    /\/signin[/?]/.test(weblink) ||                                      // amazon.com, google, gmail
		    /^https?:\/\/downloads\.sourceforge\.net\//.test(weblink) ||         // downloads.sourceforge.net
		    /^https?:\/\/(www\.)?facebook\.com\/sharer/.test(weblink) ||         // share on FB
		    /^https?:\/\/(www\.)?linkedin\.com\/share/.test(weblink) ||          // share on linkedin
		    /^https?:\/\/(www\.)?twitter\.com\/(intent\/tweet|share)/.test(weblink) ||   // tweet link
		    /^https?:\/\/(www\.)?pinterest\.com\/pin\/create\//.test(weblink) || // pinterest post
		    /^https?:\/\/(www\.)?getpocket\.com\/save/.test(weblink) ||          // save link to pocket
		    /^https?:\/\/[a-z.]*archive\.org\//.test(weblink) ||                 // archive.org
		    /^https?:\/\/github\.com\//.test(weblink) ||                         // Github
		    /^https:\/\/id\.atlassian\.com\//.test(weblink)) {                   // Atlassian Login
			return weblink;
		}
		console.log("Hyperlink: " + weblink);
		var strnew = weblink.replace(/^..*(https?(%3A|:)[^\\()&]*).*/, '$1');
		strnew = strnew.replace(/%23/g, '#');
		strnew = strnew.replace(/%26/g, '&');
		strnew = strnew.replace(/%2F/g, '/');
		strnew = strnew.replace(/%3A/g, ':');
		strnew = strnew.replace(/%3D/g, '=');
		strnew = strnew.replace(/%3F/g, '?');
		// NOTE: %25 must be translated last
		strnew = strnew.replace(/%25/g, '%');
		console.log("SANITIZED: " + strnew);
		return strnew;
	}

	// MutationObserver callback
	function callback(mutationsList) {
		// Query for elements
		for (var mutation of mutationsList) {
			switch(mutation.type) {
				case "attributes":
					// Sanitize single mutated element
					if (/..https?(%3A|:)/.test(mutation.target.href)) {
						// Avoid infinite callback loops and set target href only if it would actually change
						var sanitizedLink = sanitize(mutation.target.href);
						if (mutation.target.href != sanitizedLink) {
							mutation.target.href = sanitizedLink;
						}
					}
					break;
				case "childList":
					// Sanitize all new elements
					for (var node of mutation.addedNodes) {
						if ((typeof node.href !== 'undefined') && (/..https?(%3A|:)/.test(node.href))) {
							node.href = sanitize(node.href);
						}
					}
					break;
			}
		}
	}

	// Create an observer instance linked to the callback function
	const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	var observer = new MutationObserver(callback);
	// Start observing added elements and changes of href attributes
	observer.observe(window.document.documentElement, { attributeFilter: [ "href" ], childList: true, subtree: true });

})();
