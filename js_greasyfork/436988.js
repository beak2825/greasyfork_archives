// ==UserScript==
// @name        Steam: Automatically check Subscriber Agreement checkboxes
// @namespace   zo8dd7kkrrnquyxs5yd2
// @match       https://store.steampowered.com/account/registerkey
// @match       https://store.steampowered.com/account/registerkey?*
// @match       https://store.steampowered.com/account/registerkey/
// @match       https://store.steampowered.com/account/registerkey/?*
// @match       https://checkout.steampowered.com/checkout
// @match       https://checkout.steampowered.com/checkout?*
// @match       https://checkout.steampowered.com/checkout/
// @match       https://checkout.steampowered.com/checkout/?*
// @match       https://steamcommunity.com/*
// @grant       none
// @version     1.6.1
// @description Automatically checks Steam Subscriber Agreement checkboxes
// @inject-into content
// @run-at      document-end
// @sandbox     DOM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/436988/Steam%3A%20Automatically%20check%20Subscriber%20Agreement%20checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/436988/Steam%3A%20Automatically%20check%20Subscriber%20Agreement%20checkboxes.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const keepChecked = function (event) {
		if (!this.checked) {
			event.preventDefault();
		}
	};

	const checkIDs = ["accept_ssa", "market_sell_dialog_accept_ssa", "market_buyorder_dialog_accept_ssa", "market_buynow_dialog_accept_ssa", "market_multi_accept_ssa"];
	const found = [];

	for (const id of checkIDs) {
		const box = document.getElementById(id);

		if (box?.type === "checkbox") {
			box.checked = true;
			box.defaultChecked = true;
			box.tabIndex = -1;
			box.addEventListener("click", keepChecked);

			found.push(id);
		}
	}


	// Additionally prevent checkboxes from being unchecked by JavaScript.
	// The "redeem key" page for example does this - you have to manually re-tick the box for each key.
	// We do this by adding a special "checked" property to the checkboxes found.
	if (found.length) {
		const inject = function (checkIDs) {
			const checkedDescriptor = {
				configurable: true,
				enumerable: false,
				// no-op to prevent changes
				set() {},
				// copy over native getter
				get: Reflect.getOwnPropertyDescriptor(HTMLInputElement.prototype, "checked").get
			};

			for (const id of checkIDs) {
				Reflect.defineProperty(document.getElementById(id), "checked", checkedDescriptor);
			}
		};

		const script = document.createElement("script");
		script.textContent = `"use strict";(${inject})(${JSON.stringify(found)});`;
		(document.head ?? document.documentElement).prepend(script);
		script.remove();
	}
})();
