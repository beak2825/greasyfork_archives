// ==UserScript==
// @name        TV Tropes display options
// @namespace   https://github.com/Farow/userscripts
// @description Enables all display options
// @include     http://tvtropes.org/*
// @include     https://tvtropes.org/*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17204/TV%20Tropes%20display%20options.user.js
// @updateURL https://update.greasyfork.org/scripts/17204/TV%20Tropes%20display%20options.meta.js
// ==/UserScript==

try {
	init();
}
catch (error) {
	console.log(error);
}

function init() {
	let buttons = document.getElementsByClassName('display-btn');

	if (!buttons.length) {
		return;
	}

	for (let button of buttons) {
		button.classList.remove('disabled');
	}
}
