// ==UserScript==
// @name         ChatGPT Search Shortcut
// @namespace    https://greasyfork.org/en/users/943407-webchantment
// @version      1.2
// @description  Search ChatGPT From Your Address Bar Without Having To Go To The Website
// @author       Webchantment
// @match        https://chat.openai.com/?search=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464847/ChatGPT%20Search%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/464847/ChatGPT%20Search%20Shortcut.meta.js
// ==/UserScript==

(async () => {

	const timeout = 500; //milliseconds

	const urlParams = new URLSearchParams(window.location.search);
	const searchInput = urlParams.get("search");

	const textarea = document.querySelector("form > * textarea");
	const button = document.querySelector("form > * button");

	if (searchInput && textarea && button) {
		setValue(textarea, searchInput);
		setTimeout(() => { button.click(); }, timeout);
	}

	//special method to set react input box values
	function setValue(input, value) {
		let nativeInputValueSetter = Object.getOwnPropertyDescriptor(input, "value").set;
		nativeInputValueSetter.call(input, value);

		let inputEvent = new Event("input", { bubbles: true });
		input.dispatchEvent(inputEvent);
	}

})();