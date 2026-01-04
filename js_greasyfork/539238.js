// ==UserScript==
// @name        Hide Gmail Sponsored Emails
// @description Hide sponsored emails in Gmail
// @author      kynak
// @include       https://mail.google.com/*
// @version 0.0.1.20250612201932
// @namespace https://greasyfork.org/users/428309
// @downloadURL https://update.greasyfork.org/scripts/539238/Hide%20Gmail%20Sponsored%20Emails.user.js
// @updateURL https://update.greasyfork.org/scripts/539238/Hide%20Gmail%20Sponsored%20Emails.meta.js
// ==/UserScript==

(function() {
	const hideSponsored = () => {
		const sponsoredLabels = Array.from(document.querySelectorAll('span'));
		sponsoredLabels.forEach(label => {
			if (label.innerText.toLowerCase().includes('sponsored')) {
				let row = label.closest('tr');
				if (row) {
					row.style.display = 'none';
				}
			}
		});
	};
	setInterval(hideSponsored, 1000);
})();