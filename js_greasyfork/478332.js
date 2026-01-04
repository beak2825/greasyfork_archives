// ==UserScript==
// @name		    Remove Jira's canned responses
// @namespace	    Violentmonkey Scripts
// @match		    https://jira.*/*
// @grant		    none
// @version		    1.0
// @author	   	    LeviOliveira
// @description     Removes canned responses from Jira comments as well as the automatically entered text
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/478332/Remove%20Jira%27s%20canned%20responses.user.js
// @updateURL https://update.greasyfork.org/scripts/478332/Remove%20Jira%27s%20canned%20responses.meta.js
// ==/UserScript==

// Intercept jsdcanned fetch requests and return a mock response
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
	let [resource, config] = args;

	let response = await originalFetch(resource, config);

	if(resource.startsWith("/rest/jsdcanned/")){
		return new Response(
			"", // empty response body as this is what is going to populate the comment box
			{status: 200} // options obj
		);
	}
	return response;
};

// Remove canned comment picker div wherever and whenever it appears
let observer = new MutationObserver(function(mutation) {
	document.querySelector('div[class="comment-picker-container"]')?.remove()
});

observer.observe(document.documentElement || document.body, {
	childList: true,
	subtree: true
});
