// ==UserScript==
// @name        [Outdated] Get Into PC - Direct Download
// @description [Outdated] Extract the direct file download links from the redirecting pages.
// @namespace   RainSlide
// @author      RainSlide
// @icon        https://getintopc.com/wp-content/uploads/Getintopc.png
// @version     1.0.20200629.outdated
// @match       https://getintopc.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @inject-into context
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/406217/%5BOutdated%5D%20Get%20Into%20PC%20-%20Direct%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/406217/%5BOutdated%5D%20Get%20Into%20PC%20-%20Direct%20Download.meta.js
// ==/UserScript==

"use strict";

document.querySelectorAll('body .post-content > form[action]').forEach(
	form => form.addEventListener(
		"submit", event => {

			event.stopImmediatePropagation();
			event.preventDefault();

//			//

form = this.form || event.target;

const data = new URLSearchParams( new FormData(form) ).toString();

// "URL" is for webpages, and "link" is for direct file download links

const currentURL = location.origin + location.pathname;
const  middleURL = form.action || location.origin + "/wait-for-access/";
const   finalURL = GM_getValue("finalURL") || (() => {
	const temp = "https://share-knowledgee.info/please-wait-file-will-download-automatically-2/";
	GM_setValue("finalURL", temp);
	return temp;
})();

const xhr = ( url, referrer, success = null, failed  = null ) =>
	GM_xmlhttpRequest({
		"url": url,
		"method": "POST",
		"responseType": "text",
		"anonymous": true,
		"headers": {
			"Content-Type" : "application/x-www-form-urlencoded",
			"Origin"       : "https://getintopc.com",
			"Referrer"     : referrer
		},
		"data": data,
		"onload": success,
		"onerror": failed,
		"ontimeout": failed
	});

const isString = something =>
	Object.prototype.toString.call(something) === "[object String]";

const sanitizeURL = rawURL => new URL(rawURL).toString();

// Call String.prototype.match(), and get a capturing group from the return value of it
const getGroupfromMatch = ( str, regex, index = 1 ) => {
	if (
		isString(str) &&
		Object.prototype.toString.call(regex) === "[object RegExp]"
	) {
		const matchResults = String.prototype.match.call(str, regex); // str.match(regex);
		return Array.isArray(matchResults)
			&& isString(matchResults[index])
			&& matchResults[index];
	} else {
		return false;
	}
};

// Extract, sanitize and return the direct download link
const getLink = response => {
	const rawLink = getGroupfromMatch( response, /"location.href = ('.+?');"/ );
	if ( rawLink ) {
		const link = JSON.parse(
			rawLink.replace( /"/g, '\\"' ).replace( /^'|'$/g, '"' )
		);
		return isString(link) && sanitizeURL(link);
	} else {
		return false;
	}
}

// submit(): form.submit()
const submit = () => form.submit();

// refreshFinalURL(): fetch the middle URL for a new final URL
const refreshFinalURL = () => xhr(
	middleURL, currentURL, xhrEvent => {
		// 1. fetch success, try to get a new final URL from middle URL
		const newFinalURL = sanitizeURL(
			getGroupfromMatch(
				xhrEvent.responseText || xhrEvent.response,
				/<form id="gip_form" action="(.+?)" rel="nofollow" method="post">/
			)
		);

		if ( newFinalURL && newFinalURL !== finalURL ) {
			// 1.1. the new final URL is valid and is not the old one, test it in action
			xhr(
				newFinalURL, middleURL, xhrEvent => {
					const newLink = getLink(xhrEvent.responseText || xhrEvent.response);
					if (newLink) {
						// 1.1.1. it works, store the final URL, navgate to the link, end
						GM_setValue("finalURL", newFinalURL);
						location.href = Link;
						return undefined;
						// 1.1.2. it doesn't work, submit(), end
					} else submit();
				}
			);
			// 1.2. can't find a usable new final URL, submit(), end
		} else submit();
		submit();
		// 2. fetch failed, submit(), end
	}, submit
);

// Entry point: fetch the final URL
xhr(
	finalURL, middleURL, xhrEvent => {
	// 1. fetch success, try to get the link from final URL
		const link = getLink(xhrEvent.responseText || xhrEvent.response);
		link
			? location.assign(link) // 1.1. it works, just navgate to the link and end
			: refreshFinalURL();    // 1.2. something is wrong, refreshFinalURL()
	// 2. fetch failed, refreshFinalURL()
	}, refreshFinalURL
);

//			//

		}
	)
);
