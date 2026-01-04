// ==UserScript==
// @name         Share Button
// @namespace    http://your-namespace-here/
// @version      1.0
// @description  Adds a Share button to the page
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/461617/Share%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/461617/Share%20Button.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Create the Share button element
	const shareButton = document.createElement('button'); 
 shareButton.textContent = 'Share';
    shareButton.style.position = 'fixed';
    shareButton.style.top = '50%';
    shareButton.style.right = '20px';
    shareButton.style.transform = 'translateY(-50%)';
    shareButton.style.padding = '10px';
    shareButton.style.fontSize = '16px';
    shareButton.style.backgroundColor = 'blue';
    shareButton.style.color = 'white';
    shareButton.style.borderRadius = '5px';
    shareButton.style.cursor = 'pointer';

    // Set the opacity of the button to 0.5
    shareButton.style.opacity = '0.5';



	// Define the URL to share
	const url = window.location.href;

	// Add a click event listener to the Share button
	shareButton.addEventListener('click', () => {
		// Use the Web Share API if available
		if (navigator.share) {
			navigator.share({
					url: url
				})
				.catch(() => {
					// Fallback to copy to clipboard if the user cancels the share dialog
					GM_setClipboard(url, 'text');
					alert('URL copied to clipboard');
				});
		} else {
			// Fallback to opening a mail client with pre-filled email containing the URL
			const mailto = `mailto:?subject=Check out this link&body=${url}`;
			window.location.href = mailto;
		}
	});

	// Insert the Share button into the page
	const body = document.querySelector('body');
	body.appendChild(shareButton);
})();