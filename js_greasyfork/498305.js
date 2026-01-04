// ==UserScript==
// @name            Steam Community modals as links
// @namespace       https://denilson.sa.nom.br/
// @author          Denilson Sá Maia
// @version         1.0
// @description     Converts pseudo-links from Steam Community into real anchor tags. Instead of opening them as iframes inside modal dialogs, they now open as a full page, they can be opened in another tab, and their URLs can be copied.
// @match           *://steamcommunity.com/*
// @run-at          document-end
// @icon            https://steamcommunity.com/favicon.ico
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/498305/Steam%20Community%20modals%20as%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/498305/Steam%20Community%20modals%20as%20links.meta.js
// ==/UserScript==

(function () {
	"use strict";

	//////////////////////////////////////////////////
	// Convenience functions

	// Returns a new function that will call the callback without arguments
	// after timeout milliseconds of quietness.
	function debounce(callback, timeout = 500) {
		let id = null;
		return function() {
			clearTimeout(id);
			id = setTimeout(callback, timeout);
		};
	}

	const active_mutation_observers = [];

	// Returns a new MutationObserver that observes a specific node.
	// The observer will be immediately active.
	function debouncedMutationObserver(rootNode, callback, timeout = 500) {
		const func = debounce(callback, timeout);
		func();
		const observer = new MutationObserver(func);
		observer.observe(rootNode, {
			subtree: true,
			childList: true,
			attributes: false,
		});
		active_mutation_observers.push(observer);
		return observer;
	}

	// Adds a MutationObserver to each root node matched by the CSS selector.
	function debouncedMutationObserverSelectorAll(rootSelector, callback, timeout = 500) {
		for (const root of document.querySelectorAll(rootSelector)) {
			debouncedMutationObserver(root, callback, timeout);
		}
	}

	function stopAllMutationObservers() {
		for (const mo of active_mutation_observers) {
			mo.disconnect();
		}
		active_mutation_observers.length = 0;
	}

	//////////////////////////////////////////////////

	function main() {
			debouncedMutationObserverSelectorAll("#AppHubContent", function() {
				for (const card of document.querySelectorAll(".apphub_Card.modalContentLink[data-modal-content-url]")) {
					const a = document.createElement("a");
					a.href = card.dataset.modalContentUrl;
					a.append(...card.childNodes);
					card.append(a);
					card.classList.remove('modalContentLink');
				}
			});
	}

	main();

})();
