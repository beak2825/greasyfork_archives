// ==UserScript==
// @name         Facebook Mobile Remove Install App
// @description  Removes the "Get the best experience on the app" popup from the Facebook mobile website.
// @author       TarsierScripter
// @version      0.0.20
// @match        *://m.facebook.com/*
// @grant        none
// @inject-into  content
// @license		 MIT
// @namespace    FMRIA
// @downloadURL https://update.greasyfork.org/scripts/523877/Facebook%20Mobile%20Remove%20Install%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/523877/Facebook%20Mobile%20Remove%20Install%20App.meta.js
// ==/UserScript==

(function () {
	'use strict';
	// Selectors to remove
	const selectors = [ "div[data-comp-id='22222']" ];
	const xpath = "//span[text()='Get the best experience on the app']";
	const config = { childList: true, subtree: true };

	const remove = (function() {
		selectors.forEach((selector) => {
			// Fetch the elements to remove
			const elements = document.querySelectorAll(selector)
			// Iterate through the elements and remove them
			elements.forEach((element) => {
				// Use an xpath query to check if the element contains text we want removed.
				const result = document.evaluate(xpath, element, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				while ((matchingElement = result.iterateNext())) {
					// Found the element we were looking for!
					element.remove();
				}
			});
		});
		setTimeout(remove, 100);
	});
	remove();
})();
