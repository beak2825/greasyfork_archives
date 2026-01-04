// ==UserScript==
// @name         servers.opennic.org simple filter by category
// @namespace    org.opennic.servers
// @version      0.0.0.2
// @description  Select what you want
// @author       AHOHNMYC
// @match        https://servers.opennic.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369737/serversopennicorg%20simple%20filter%20by%20category.user.js
// @updateURL https://update.greasyfork.org/scripts/369737/serversopennicorg%20simple%20filter%20by%20category.meta.js
// ==/UserScript==

const servers = document.querySelectorAll('[name^="ccg["] p');
const buttons = document.querySelectorAll('.bttn > i');

buttons.forEach(label => {
	label.style.cursor = 'pointer';

	label.addEventListener('click', e => {
		const alreadyChecked = !!label.style.border;
		/* Draw border over clicked button */
		buttons.forEach(label => {label.style.border = label.style.padding = ''});
		if (!alreadyChecked) {
			label.style.border = '1px solid black';
			label.style.padding = '2px';
		}

		servers.forEach(server => {
			const flags = Array.from(server.firstElementChild.querySelectorAll('i[style]'));
			/* true if color and flag symbol matches */
			const show = flags.some(flag => flag.style.color === label.style.color && flag.textContent === label.textContent[0]);

			server.style.display = show||alreadyChecked ? '' : 'none';
		})
	});
});
