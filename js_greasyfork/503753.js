// ==UserScript==
// @name        Pick-A-Brick Color Line
// @name:en     Pick-A-Brick Color Line
// @description Shows elements' color below their ID in search results
// @namespace   Violentmonkey Scripts
// @match       https://www.lego.com/en-us/pick-and-build/pick-a-brick*
// @grant       none
// @version     1.3
// @author      The0x539
// @run-at      document-start
// @license     AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/503753/Pick-A-Brick%20Color%20Line.user.js
// @updateURL https://update.greasyfork.org/scripts/503753/Pick-A-Brick%20Color%20Line.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

let initialEnrichmentDone = false;
const ELEMENT_SELECTOR = 'li[class^=ElementsList_leaf_]';
const elementColors = {};

// Modify a PaB search result to include the color name below the element/design ID line.
function enrich(element) {
	const idElem = element.querySelector('p[data-test=pab-item-elementId]');
	const [elemId, partId] = idElem.innerHTML.split(' ')[1].split('/');
	const elemColor = elementColors[elemId];
	if (!elemColor) {
		return;
	}
	idElem.insertAdjacentHTML('afterend', `<p class="elem-color ds-body-xs-regular">${elemColor}</p>`);
}

// Intercept HTTP requests to a LEGO GraphQL endpoint that tells us the colors of the element IDs currently on the page.
// Store data from the response in the `elementColors` dictionary, which maps element IDs to color names.
const actualFetch = window.fetch;
window.fetch = async (...args) => {
	const response = await actualFetch(...args);
	if (args[0] !== 'https://www.lego.com/api/graphql/PickABrickQuery') {
		return response;
	}

	const body = await response.json();

	try {
		for (const element of body.data.searchElements.results) {
			elementColors[element.id] = element.facets.color.name;
		}

		// The elements shown on initial page load are included in the initial HTML response,
		// so we can't add the color line until the GraphQL request is made.
		if (!initialEnrichmentDone) {
			document.querySelectorAll(ELEMENT_SELECTOR).forEach(enrich);
			initialEnrichmentDone = true;
		}
	} catch {}

	// Reconstruct the response because we already consumed the body of the original response object.
	const { status, statusText, headers } = response;
	const options = { status, statusText, headers };
	return new Response(JSON.stringify(body), options);
}

const observeOptions = { childList: true, subtree: true };

// Searches performed after initial page load mutate the DOM after making the GraphQL request,
// so we need to catch that mutation in order to add color based on data intercepted from the response.
function onUpdateSearchResults(records, observer) {
	for (const record of records) {
		for (const node of record.addedNodes) {
			if (node.matches(ELEMENT_SELECTOR)) {
				enrich(node);
			} else {
				for (const leaf of node.querySelectorAll(ELEMENT_SELECTOR)) {
					enrich(leaf);
				}
			}
		}
	}
}

function onUpdatePage(records, observer) {
	for (const record of records) {
		for (const node of record.addedNodes) {
			const pabResultsWrapper = node.parentNode?.querySelector('#pab-results-wrapper');
			if (!pabResultsWrapper) continue;
			observer.disconnect(); // we found the element, so stop looking for it
			new MutationObserver(onUpdateSearchResults).observe(pabResultsWrapper, observeOptions);
			return;
		}
	}
}

document.addEventListener('readystatechange', (event) => {
	// This script needs to run at document-start in order to monkey-patch window.fetch,
	// but that's too early for us to perform these two DOM operations.
	if (document.readyState === 'interactive') {
		document.head.insertAdjacentHTML('beforeend', `
			<style>
				.elem-color {
					color: var(--ds-color-text-subdued);
					margin: 0;
				}
			</style>
		`);
		new MutationObserver(onUpdatePage).observe(document.body, observeOptions);
	}
});
