// ==UserScript==
// @name         GitLab Dark Mode When Not Logged In
// @description  For some reason you can't enable dark theme if you are not logged in, but with this script you can!
// @version      1.0.0
// @author       Pabli
// @namespace    https://github.com/pabli24
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @license      MIT
// @match        https://gitlab.com/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522039/GitLab%20Dark%20Mode%20When%20Not%20Logged%20In.user.js
// @updateURL https://update.greasyfork.org/scripts/522039/GitLab%20Dark%20Mode%20When%20Not%20Logged%20In.meta.js
// ==/UserScript==

const isLight = document.documentElement.classList.contains('gl-light');
const isDark = document.documentElement.classList.contains('gl-dark');
const isNotLoggedIn = document.querySelector('header').classList.contains('header-logged-out');

if (isLight && !isDark && isNotLoggedIn) {
	document.documentElement.classList.replace('gl-light', 'gl-dark');
	
	document.head.innerHTML += '<meta name="color-scheme" content="dark light" />';
	document.head.innerHTML += '<link rel="stylesheet" href="/assets/application_dark-449c0613e86649a202dfb0d731bf88a31c63817b6e76fa7cc0ff22bb00af6106.css" />';
	document.head.innerHTML += '<link rel="stylesheet" href="/assets/highlight/themes/dark-d3b12a96d7c0b736869f2869cd6bf53fc38874df1fd29dfc0018b772e7d95eb6.css" />';
	
	const observer = new MutationObserver(mutations => {
		document.querySelectorAll('.white').forEach(element => {
			element.classList.replace('white', 'dark');
		});
	});
	observer.observe(document.body, { childList: true, subtree: true });
}