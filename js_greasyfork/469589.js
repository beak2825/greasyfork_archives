// ==UserScript==
// @name            Show/Hide Password Hover
// @namespace       https://greasyfork.org/users/821661
// @version         1.4
// @description     Show/Hide Password when hovering over the input password
// @match           <all_urls>
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/469589/ShowHide%20Password%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/469589/ShowHide%20Password%20Hover.meta.js
// ==/UserScript==

(function () {
	'use strict';
	document.addEventListener('mouseover', (e) => {
		if (!e.target.closest('input[type="password"]')) return;
		e.target.type = 'text';
		e.target.addEventListener('mouseout', () => {
			e.target.type = 'password';
		});
	});
})();
