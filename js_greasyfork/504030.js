// ==UserScript==
// @name        Pick-A-Brick LDraw Colors
// @name:en     Pick-A-Brick LDraw Colors
// @description Replaces LEGO color names with LDraw color names on Pick a Brick
// @namespace   Violentmonkey Scripts
// @match       https://www.lego.com/en-us/pick-and-build/pick-a-brick*
// @grant       none
// @version     1.2.1
// @author      The0x539
// @run-at      document-start
// @license     AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/504030/Pick-A-Brick%20LDraw%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/504030/Pick-A-Brick%20LDraw%20Colors.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

const gistUrl = "https://gist.githubusercontent.com/The0x539/d046e6778f38232912c6ca1d840d614e/raw";
const colorMapPromise = fetch(gistUrl).then(resp => resp.json()).then(body => new Map(body));

const actualFetch = window.fetch;
window.fetch = async (...args) => {
	const response = await actualFetch(...args);
	if (args[0] !== 'https://www.lego.com/api/graphql/PickABrickQuery') {
		return response;
	}

	const body = await response.json();
	const colorMap = await colorMapPromise;
	replaceNames(body, colorMap);

	// Reconstruct the response because we already consumed the body of the original response object.
	const { status, statusText, headers } = response;
	const options = { status, statusText, headers };
	return new Response(JSON.stringify(body), options);
};

function replaceNames(body, colorMap) {
	for (const facet of body.data.searchElements.facets) {
		if (facet.id !== "element.facet.colourFamily") {
			continue;
		}

		for (const label of facet.labels) {
			for (const child of label.children) {
				if (colorMap.has(child.key)) {
					child.name = colorMap.get(child.key);
				}
			}
		}
	}

	for (const result of body.data.searchElements.results) {
		const colorFacet = result.facets.color;
		if (colorMap.has(colorFacet.key)) {
			colorFacet.name = colorMap.get(colorFacet.key);
		}
	}
}