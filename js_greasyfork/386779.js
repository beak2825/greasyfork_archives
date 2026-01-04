// ==UserScript==
// @name Games Done 24/7
// @version 2.3.20250107
// @description Awesome/Summer Games Done Quick schedule in 24-hour time format
// @namespace raina
// @match https://gamesdonequick.com/schedule*
// @grant none
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/386779/Games%20Done%20247.user.js
// @updateURL https://update.greasyfork.org/scripts/386779/Games%20Done%20247.meta.js
// ==/UserScript==
const main = document.querySelector(`main`);
let observer = new MutationObserver(mutation => {
	let times = main.querySelectorAll(`[class*="lg:text-base"].font-monospace`);
	if (times?.length) {
		observer.disconnect();
		times.forEach(time => {
			if (/PM$/.test(time.textContent.trim())) {
				time.textContent = time.textContent.replace(/^\d+/, function(match) {
					match = parseInt(match, 10);
					return match < 12 ? match + 12 : 12;
				});
			}
			time.textContent = time.textContent.slice(0, -3);
			time.style.textAlign = "center";
		});
	}
});
observer.observe(main, {subtree: true, childList: true});
