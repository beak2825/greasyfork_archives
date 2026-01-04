// ==UserScript==
// @name        Dead Frontier - Money Warning for Inner City
// @namespace   Dead Frontier - Shrike00
// @include     /^https?://fairview\.deadfrontier\.com/onlinezombiemmo/index\.php$/
// @grant       none
// @version     0.1.4
// @author      Shrike00
// @description Displays a pop-up warning when leaving the outpost with cash equal or over the threshold value.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/437455/Dead%20Frontier%20-%20Money%20Warning%20for%20Inner%20City.user.js
// @updateURL https://update.greasyfork.org/scripts/437455/Dead%20Frontier%20-%20Money%20Warning%20for%20Inner%20City.meta.js
// ==/UserScript==

// Changelog
// 0.1.4 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.1.3 - February 19, 2025
// - Change: Updated for new event listeners.
// 0.1.2 - August 6, 2023
// - Change: Changed text colours.
// 0.1.1
// - Feature: Added optional warning banner to the outpost page.

// Procedures partly taken from hotrod's base.js and outpost.js (moving to inner city).

(function() {

	'use strict';
	// User Options
	const threshold = 1;
	const display_popup_warning = true;
	const display_warning_banner = false;

	// Helpers
	function getCash() {
		// Returns current cash-on-hand.
		const uservars = userVars;
		return parseInt(uservars["df_cash"]);
	}

	function innerCityButton() {
		// Returns button element for going to the Inner City.
		const outpost = document.getElementById("outpost");
		const navigables = outpost.getElementsByClassName("opElem");
		for (let i = 0; i < navigables.length; i++) {
			const child = navigables[i];
			const button = child.children[0];
			if (button.innerHTML.indexOf("Inner City") != -1) {
				return button;
			}
		}
	}

	function waitForInnerCityButton(callback, timeout) {
		// Waits for Inner City button to exist, then calls callback.
		const start = performance.now();
		const check = setInterval(function() {
			const innercity = innerCityButton();
			if (innercity !== undefined) {
				clearInterval(check);
				callback();
			}
			if (performance.now() - start > timeout) {
				clearInterval(check);
			}
		}, 200);
	}

	// Major Subroutines

	function removeEventListeners(button) {
		// Removes original event listeners from button.
		button.removeEventListener("click", nChangePage);
		button.removeEventListener("auxclick", nChangePage);
		button.removeEventListener("mousedown", nChangePage);
	}

	function setWarningHidden() {
		// Hides pop-up warning.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		prompt.removeAttribute("style");
		gamecontent.removeAttribute("class");
	}

	function setWarningVisible(innercityCallback) {
		// Shows pop-up warning/prompt.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		// Warning message
		prompt.style.setProperty("display", "inline");
		gamecontent.className = "warning";
		gamecontent.style.setProperty("font-family", "\"Courier New CE\", Arial");
		gamecontent.style.setProperty("font-weight", "bold");
		gamecontent.style.setProperty("color", "white");
		gamecontent.style.setProperty("text-align", "center");
		const cash = getCash().toLocaleString();
		// Copied from DF CSS.
		gamecontent.innerHTML = "You are carrying<br><span style=\"background: #E6CC4D; background-image: -webkit-gradient( linear, left top, left bottom, color-stop(0, #E6CC4D), color-stop(0.5, #E6CC4D), color-stop(1, #000000) ); -webkit-background-clip: text; -webkit-text-fill-color: transparent;\">$" + cash + "</span><br> Are you sure you wish to continue?";
		// Buttons
		const noButton = document.createElement("button");
		noButton.style.position = "absolute";
		noButton.style.top = "72px";
		noButton.style.left = "151px";
		noButton.innerHTML = "No";
		noButton.addEventListener("click", setWarningHidden);
		gamecontent.appendChild(noButton);
		const yesButton = document.createElement("button");
		yesButton.style.position = "absolute";
		yesButton.style.left = "86px";
		yesButton.style.top = "72px";
		yesButton.innerHTML = "Yes";
		yesButton.addEventListener("click", innercityCallback);
		gamecontent.appendChild(yesButton);
	}

	function pageChangeInnerCityCallback(innercityButton) {
		// Returns function (event callback) that goes to Inner City.
		return function(e) {
			const sound = innercityButton.dataset.sound !== undefined && innercityButton.dataset.sound !== "0";
			const modify = innercityButton.dataset.mod;
			const pageNum = parseInt(innercityButton.dataset.page);
			if (sound) {
				playSound("outpost");
				setTimeout(function() {
					doPageChange(pageNum, modify);
				}, 1000);
			} else {
				doPageChange(pageNum, modify);
			}
		}
	}

	function warningBanner() {
		// Creates warning banner element without text (to be supplied by caller).
		const banner = document.createElement("div");
		banner.style.position = "absolute";
		banner.style["text-align"] = "center";
		banner.style["font-size"] = "16px";
		banner.style.width = "500px";
		banner.style.top = "500px";
		banner.style.left = "100px";
		banner.style.color = "red";
		banner.setAttribute("mwic", "banner");
		return banner;
	}

	function removeWarningBanner(outpost) {
		// Removes warning banner from outpost screen.
		const children = outpost.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.getAttribute("mwic") == "banner") {
				child.remove();
				break;
			}
		}
	}

	function refreshBanner(outpost) {
		removeWarningBanner(outpost);
		const banner = warningBanner();
		banner.innerHTML = "<span style=\"color: white;\">You are carrying</span> <span style=\"background: #E6CC4D; background-image: -webkit-gradient( linear, left top, left bottom, color-stop(0, #E6CC4D), color-stop(0.5, #E6CC4D), color-stop(1, #000000) ); -webkit-background-clip: text; -webkit-text-fill-color: transparent;\">$" + getCash().toLocaleString() + "</span>";
		outpost.append(banner);
	}

	// Main Function
	function main() {
		// Banner
		let previous_cash = 0;
		if (getCash() >= threshold && display_warning_banner) {
			const outpost = document.getElementById("outpost");
			refreshBanner(outpost);
		}
		// Test on interval, in case cash changes on outpost screen for whatever reason.
		setInterval(function() {
			if (getCash() >= threshold && display_warning_banner && previous_cash != getCash()) {
				refreshBanner(outpost);
				previous_cash = getCash();
			}
		}, 1000);
		// Pop-up
		waitForInnerCityButton(function() {
			const innercity = innerCityButton();
			if (display_popup_warning) {
				function innerCityEventListener(e) {
					if (getCash() >= threshold) {
						setWarningVisible(pageChangeInnerCityCallback(innercity));
					} else {
						pageChangeInnerCityCallback(innercity)();
					}
				}
				removeEventListeners(innercity);
				innercity.addEventListener("click", innerCityEventListener);
				innercity.addEventListener("auxclick", innerCityEventListener);
			}
		}, 2000);
	}

	main();
})();

