// ==UserScript==
// @name         GMail Auto Reader
// @namespace    -
// @version      0.1
// @description  Fast GMail auto reader, not for spams email though
// @author       Hanz
// @match        https://mail.google.com/mail/u/0/h/*
// @icon         https://www.google.com/s2/favicons?domain=mail.google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431133/GMail%20Auto%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/431133/GMail%20Auto%20Reader.meta.js
// ==/UserScript==

(async () => {
	if (!window.location.href.includes('in%3A%20unread') && !window.location.href.includes('in:+unread')){
        document.getElementById('sbq').value = 'in: unread';
		return document.getElementsByName('nvp_site_mail')[0].click();
    }

	let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
	let checkboxes = document.querySelectorAll('input[type=checkbox]');
    if (checkboxes.length == 0) return alert("Disable the script to normally walks the site");

	for (const checkbox of checkboxes) {
 	   checkbox.checked = true;
	}
	document.querySelector('select[name=tact]').value = "rd";

	/*
	This is deleted because i found a better way to find unread messages effectively

	document.getElementsByName('f')[0].action = "?&st=" + (Number(window.location.href.replace(/.*=/, "")) + 100)
	document.getElementsByName('redir')[0].value = "?&st=" + (Number(window.location.href.replace(/.*=/, "")) + 100)
	*/

	await wait(100);
	await document.getElementsByName('nvp_tbu_go')[0].click();
})();

/*

This is GMail (HTML Mode) auto reader. To set the efficiency, you can set your maximum mails per page to 100 per page.
Brought to you by HanzHaxors

NOTE: Please run in browser console while in GMail Basic HTML layout

*/