// ==UserScript==
// @name        Paperless: default currency
// @namespace   https://denilson.sa.nom.br/
// @author      Denilson Sá Maia
// @version     1.0
// @description Workaround to set the default currency for custom monetary fields in Paperless up to version 2.11.2.
// @icon        https://docs.paperless-ngx.com/assets/favicon.png
// @license     Public Domain
// @match       https://demo.paperless-ngx.com/*
// @downloadURL https://update.greasyfork.org/scripts/502490/Paperless%3A%20default%20currency.user.js
// @updateURL https://update.greasyfork.org/scripts/502490/Paperless%3A%20default%20currency.meta.js
// ==/UserScript==

// HOW TO USE THIS SCRIPT
// ----------------------
//
// 1. Make sure your browser can run user scripts. In doubt, just install the [Violentmonkey extension](https://violentmonkey.github.io/).
// 2. Click on `Install this script` from <https://greasyfork.org/en/scripts/502490-paperless-default-currency>
// 3. Click on the green `+ Edit` button.
// 4. Edit the `@match` line, replace `https://demo.paperless-ngx.com/*` with your Paperless installation. (e.g. `https://127.0.0.1:9493/*` )
// 5. Edit the `DEFAULT_CURRENCY` below to your preferred currency.
//
// See also: <https://github.com/paperless-ngx/paperless-ngx/discussions/6040>

(function () {
	"use strict";

  const DEFAULT_CURRENCY = 'EUR';

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
		debouncedMutationObserverSelectorAll('body', function() {
			for (const input of document.querySelectorAll('pngx-input-monetary.ng-untouched.ng-pristine input.form-control.text-muted.ng-untouched.ng-pristine[maxlength="3"]')) {
				if (input.value === 'USD') {
					input.value = DEFAULT_CURRENCY;
					const ev = new InputEvent('input', { data: DEFAULT_CURRENCY });
					input.dispatchEvent(ev);
				}
			}
		});
	}

	main();

})();

