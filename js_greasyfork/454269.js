// ==UserScript==
// @name        Directory Buttons for GitHub Material Icons
// @namespace   https://github.com/DenverCoder1
// @match       https://github.com/*
// @grant       none
// @version     1.0.2
// @author      Jonah Lawrence
// @license     MIT
// @description Add border to directory icons with Material Icons chrome extension and make them clickable
// @downloadURL https://update.greasyfork.org/scripts/454269/Directory%20Buttons%20for%20GitHub%20Material%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/454269/Directory%20Buttons%20for%20GitHub%20Material%20Icons.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function () {
	// add directory icon border styling
  const styles = `
		img[aria-label="Directory"], img.icon-directory {
			box-shadow: 0px 0px 0px 2px var(--bgColor-default, var(--color-canvas-default)), 0px 0px 0px 3px var(--borderColor-default, var(--color-border-default));
			border-radius: 1px;
			transform: scale(1.15);
			background: var(--bgColor-default, var(--color-canvas-default));
			cursor: pointer;
		}

		img[aria-label="Directory"]:hover, img.icon-directory:hover {
    	filter: brightness(1.25);
		}
  `;
  document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", "<style>" + styles + "</style>");

	// detect click on directory icons
  document.addEventListener("click", (el) => {
		// if the click is in a directory icon, get the href of the first link in the containing row and redirect to it
		const link = el.target.closest('img[aria-label="Directory"], img.icon-directory')?.closest(".Box-row, tr")?.querySelector("a")?.href;
		if (link) {
			window.location.href = link;
		}
  });
})();
