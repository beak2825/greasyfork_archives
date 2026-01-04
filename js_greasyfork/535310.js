// ==UserScript==
// @name		Gmail Filter messages like this keyboard shortcut
// @match		https://mail.google.com/mail/u/0/*
// @require		https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @version		0.1
// @namespace https://greasyfork.org/users/3347
// @description keyboard shortcut (Ctrl+Shift+f) for "Filter messages like this"
// @downloadURL https://update.greasyfork.org/scripts/535310/Gmail%20Filter%20messages%20like%20this%20keyboard%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/535310/Gmail%20Filter%20messages%20like%20this%20keyboard%20shortcut.meta.js
// ==/UserScript==


$(document).keydown(e => {
	if (!e.ctrlKey || !e.shiftKey || e.altKey || String.fromCharCode(e.which).toLowerCase() !== 'f') return;
	let el;
	for (let item of document.getElementsByClassName('btb')) {
		if ($(item).is(':visible')) { el = item; break; }
	}
	document.getElementsByName('q')[0].value = 'from:(' + (el ? el.querySelector('[email]').getAttribute('email') : document.getElementsByClassName('gD')[0].getAttribute('email')) + ')';
	document.querySelector('button[aria-label="Search mail"]').click();
});
