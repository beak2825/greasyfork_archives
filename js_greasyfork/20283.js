// ==UserScript==
// @name        Email filler
// @namespace   https://github.com/Farow/userscripts
// @description Fills your email on input and text fields
// @include     *
// @version     1.0.0
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/20283/Email%20filler.user.js
// @updateURL https://update.greasyfork.org/scripts/20283/Email%20filler.meta.js
// ==/UserScript==

const emails = [
	'work.email@example.com',
	'personal.email@example.com',
];

document.addEventListener('keypress', keypress);

function keypress (event) {
	if (event.code != 'KeyE') {
		return;
	}

	if (!event.ctrlKey) {
		return;
	}

	if (event.target.tagName != 'INPUT' && event.target.tagName != 'TEXTAREA') {
		return;
	}

	fill_email(event.target);
	event.preventDefault();
}

function fill_email (target) {
	const email = emails.shift();

	/* save the selection as it gets reset when changing the input value */
	const selection_start = target.selectionStart;

	target.value = (
		/* before selection */
		target.value.substring(0, selection_start) +

		/* replace selection */
		email +

		/* after selection */
		target.value.substring(target.selectionEnd)
	);

	target.setSelectionRange(selection_start, selection_start + email.length);
	emails.push(email);
}
