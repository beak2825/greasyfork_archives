// ==UserScript==
// @name        Geeksforgeeks auto dark night mode - geeksforgeeks.org
// @namespace   marcusmors.com
// @match       https://www.geeksforgeeks.org/*
// @grant       none
// @version     1
// @author      Jose Vilca <@marcusmors>
// @description sets Geekforgeeks dark theme auto.
// @icon        https://www.google.com/s2/favicons?domain=geeksforgeeks.org
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/452033/Geeksforgeeks%20auto%20dark%20night%20mode%20-%20geeksforgeeksorg.user.js
// @updateURL https://update.greasyfork.org/scripts/452033/Geeksforgeeks%20auto%20dark%20night%20mode%20-%20geeksforgeeksorg.meta.js
// ==/UserScript==

// cookie options: gfgThemeLight or gfgThemeDark //last checked 25/09/2022

function get_cookie_value(cookie_key) {
	let name = cookie_key + "="
	let ca = document.cookie.split(";")
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i].trim()
		if (c.indexOf(name) == 0) {
			return c.substr(name.length)
		}
	}
	return null
	// https://stackoverflow.com/questions/23641531/get-a-cookie-value-javascript/23642134#23642134
}

function set_to_dark() {
	"use strict"
	const theme = get_cookie_value("gfg_theme") === "gfgThemeDark" ? "dark" : "light"

	if (theme === "dark") return

	const menu = document.querySelector(".hamburger-menu")
	if (menu) {
		// click the dark mode button inside the menu.
		menu.click()
		document.querySelector(".toggle-darkMode").click()
		menu.click()
		return
	}
	document.querySelectorAll('[data-gfg-action="toggleGFGTheme"]')[1].click()
}

jQuery(document).ready(set_to_dark)
