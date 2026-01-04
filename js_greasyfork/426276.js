// ==UserScript==
// @name         Twitch Status+
// @namespace    https://github.com/kittenparry/
// @version      0.1
// @description  Switch to online and share activity status on page load™.
// @author       kittenparry
// @match        https://*.twitch.tv/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/426276/Twitch%20Status%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/426276/Twitch%20Status%2B.meta.js
// ==/UserScript==

setTimeout(() => {
	let avatar = document.querySelector('img[class="tw-block tw-border-radius-rounded tw-image tw-image-avatar"]');
	avatar.click();
	let online_toggle = document.querySelectorAll('input[class="ScToggleInput-sc-796zbf-1 doVmsZ tw-toggle__input"]')[0];
	if (!online_toggle.checked) {
		online_toggle.click();
		let activity_toggle = document.querySelectorAll('input[class="ScToggleInput-sc-796zbf-1 doVmsZ tw-toggle__input"]')[1];
		if (!activity_toggle.checked) {
			activity_toggle.click();
		}
		avatar.click();
	} else {
		avatar.click();
	}
}, 3000);
