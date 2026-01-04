// ==UserScript==
// @name         steam, navigate inventory pages
// @description  adds event listeners to the arrows keys to navigate inventory pages
// @version      1.1
// @author       Tobias L
// @include     https://steamcommunity.com/id/*/inventory*
// @license      GPL-3.0-only
// @namespace    https://github.com/WhiteG00se/User-Scripts
// @downloadURL https://update.greasyfork.org/scripts/447037/steam%2C%20navigate%20inventory%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/447037/steam%2C%20navigate%20inventory%20pages.meta.js
// ==/UserScript==

setTimeout(function () {
	const nextPageButton = document.querySelector(".sih_button.next_page")
	const previousPageButton = document.querySelector(".sih_button.prev_page")
	document.addEventListener("keydown", function (e) {
		if (e.key === "ArrowRight") nextPageButton.click()
		if (e.key === "ArrowLeft") previousPageButton.click()
	})
}, 1000)
