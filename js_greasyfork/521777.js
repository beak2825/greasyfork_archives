// ==UserScript==
// @name        Pardus message bar background
// @version     1
// @namespace   leaumar
// @description Adds starry background to message bar.
// @icon        https://icons.duckduckgo.com/ip2/pardus.at.ico
// @include     https://*.pardus.at/main.php
// @include     https://*.pardus.at/msgframe.php
// @grant       GM_setValue
// @grant       GM_getValue
// @license     MPL-2.0
// @author      leaumar@sent.com
// @downloadURL https://update.greasyfork.org/scripts/521777/Pardus%20message%20bar%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/521777/Pardus%20message%20bar%20background.meta.js
// ==/UserScript==

if (location.pathname.includes('main.php')) {
	// url(//static.pardus.at/img/stdhq/bgoutspace1.gif)
	// 256x256
	const { backgroundImage } = document.body.style;
	GM_setValue('backgroundImage', backgroundImage);
}

if (location.pathname.includes('msgframe.php')) {
	const backgroundImage = GM_getValue('backgroundImage', null);

	if (backgroundImage == null) {
		return;
	}

	const { height } = window.top.document.getElementById('msgframe').getBoundingClientRect();

	Object.assign(document.body.style, {
		backgroundImage,
		backgroundPositionY: `${height}px`,
	});
}
