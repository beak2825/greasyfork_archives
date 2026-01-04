// ==UserScript==
// @name         DonationAlerts Auto Login (via Twitch)
// @namespace    https://greasyfork.org/users/your-username
// @version      1.1
// @description  Automatically logs into DonationAlerts using your Twitch account.
// @author       akket0r
// @match        https://www.donationalerts.com/r/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donationalerts.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537773/DonationAlerts%20Auto%20Login%20%28via%20Twitch%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537773/DonationAlerts%20Auto%20Login%20%28via%20Twitch%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

	function sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms));
	}


    async function autoLoginTwitch() {
    	const element = document.querySelector(".control-link");
		if (element.innerText === 'Авторизоваться' || element.innerText === "Login") {
			console.log('[info] %cLogged in... waiting...', 'color: yellow;');
			element.click();

			await sleep(100); // delay 1s

			let twitchLoginBtn = document.querySelector("a.last-login-button");
			if (!twitchLoginBtn) {
				console.warn("[warning] %cPlease select authorization method...", 'color: orangered;');
				let twitchIco = document.querySelector(".icon--social-twitch");
				if (!twitchIco) {
					console.warn("[warning] %cCannot find twitch icon", 'color: orangered;');
				} else {
					twitchIco.click();
				}

				return;
			} else {
				await sleep(1000); // delay 1s
				twitchLoginBtn.click();
			}
		} else {
			await sleep(1000); // delay 1s
			let username = document.querySelector(".viewer-alias").innerText;
			console.log(`[info] %cYou are logged in as ${username}`, 'color: lime;');
		}
	}

	window.onload = () => {
		setTimeout(autoLoginTwitch, 1500);
	}
})();