// ==UserScript==
// @name        Tab Focus through Google Search Results
// @description Use the tab key to navigate through Google and DuckDuckGo search results
// @version     1.1.3
// @match       *://*/search*
// @include     *://*.google.*/search*
// @match       *://*.duckduckgo.com/*
// @grant       none
// @author      szupie szupie@gmail.com
// @namespace   szupie
// @downloadURL https://update.greasyfork.org/scripts/433135/Tab%20Focus%20through%20Google%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/433135/Tab%20Focus%20through%20Google%20Search%20Results.meta.js
// ==/UserScript==
(function () {
'use strict';

let selectors;

function init() {
	const results = document.querySelectorAll(selectors['resultTitle']);

	for (let i=0; i<results.length; i++) {
		const linkNode = results[i].closest('a');
		linkNode.setAttribute('tabindex', 1);
	}

	// capture focus changes on results list to scroll entire result into view
	document.querySelector(selectors['resultsDiv']).addEventListener("focus", e => {
		// only perform scroll if newly focused element is result link
		if (e.target.getAttribute('tabindex') === '1') {
			const resultNode = e.target.closest(selectors['resultNode']);
			const bounds = resultNode.getBoundingClientRect();
			// scroll item to top if it extends past viewport top,
			// or to bottom if it extends past viewport bottom
			if (bounds.top < 0) {
				resultNode.scrollIntoView();
			} else if (bounds.bottom > window.innerHeight) {
				resultNode.scrollIntoView(false);
			}
		}
	}, true);

	const styleNode = document.createElement('style');
	styleNode.type = 'text/css';
	styleNode.innerHTML = css;
	styleNode.id = 'tab-focus-results';
	document.getElementsByTagName('head')[0].appendChild(styleNode);
}

// CSS selectors
const googleSelectors = {
	'resultTitle': '.LC20lb',
	'resultsDiv': '#res',
	'resultNode': '.g'
};

const ddgSelectors = {
	'resultTitle': '#links a.result__a:not(.result__sitelink-title)',
	'resultsDiv': '#links',
	'resultNode': '.result'
};

if (window.location.hostname != 'duckduckgo.com') {
	selectors = googleSelectors;
} else {
	selectors = ddgSelectors;
}

// Style to indicate focus
const css =
`a[tabindex="1"]:focus::after {
	content: '►';
	position: absolute;
	right: 100%;
	margin-top: 1em;
	margin-right: 2px;
	color: #4273DB;
	font: 11px arial, sans-serif;
}
a[tabindex="1"]:focus h3 {
	outline: 2px solid;
}
a[tabindex="1"]:focus {
	outline: none;
}

/* for duckduckgo */
a.result__a[tabindex="1"]:focus::after {
	margin-top: 0.25em;
	margin-right: 0;
}`;

if (document.querySelector(selectors['resultTitle'])) {
	init();
} else {
	window.addEventListener('load', init);
}

})();
