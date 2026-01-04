// ==UserScript==
// @name        Steam OpenID auto approval
// @namespace   w8v1khnnd8e1s7ef
// @description Adds a checkbox to remember OpenID logins
// @match       https://steamcommunity.com/openid/login
// @grant       GM.setValue
// @grant       GM.getValue
// @version     1.1
// @run-at      document-end
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/435052/Steam%20OpenID%20auto%20approval.user.js
// @updateURL https://update.greasyfork.org/scripts/435052/Steam%20OpenID%20auto%20approval.meta.js
// ==/UserScript==

(async function () {
	"use strict";

	const openidForm = document.getElementById("openidForm");
	const loginForm = document.getElementById("loginForm");
	const errors = document.getElementById("error_display");
	
	// Abort if we're logged out or errors are showing
	if (!openidForm || loginForm || errors?.offsetHeight) {
		return;
	}

	let prefKey;
	{
		let realm;
		try {
			realm = JSON.parse(atob(openidForm.elements.openidparams.value))["openid.realm"];
		} catch (ignore) {}
		if (!realm) {
			return;
		}

		const accountID = document.querySelector("[data-miniprofile]")?.dataset.miniprofile ?? "default";
		prefKey = `autologin_${accountID}_${realm}`;
	}


	const loginButton = openidForm.elements.imageLogin;

	if (await GM.getValue(prefKey)) {
		loginButton.type = "hidden";
		loginButton.after("Signing in...");
		openidForm.submit();
	} else {
		// Create elements:
		// " ☑ Automatically sign into this site"
		const label = document.createElement("label");
		const checkbox = document.createElement("input");

		checkbox.type = "checkbox";
		label.title = "Automatically accept sign-in requests from this site in the future."

		label.append(checkbox, " Automatically sign into this site");

		openidForm.addEventListener("submit", async () => {
			if (checkbox.checked) {
				await GM.setValue(prefKey, true);
			}
		});

		loginButton.after(" ", label);
	}
})();
