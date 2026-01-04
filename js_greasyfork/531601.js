// ==UserScript==
// @name        gocomics unblocker
// @namespace   https://greasyfork.org/en/users/1164392-jan-ale
// @match       https://www.gocomics.com/*
// @grant       none
// @version     1.1
// @author      jan-ale
// @description unblocks gocomics paywall when trying to look in a comic archive
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/531601/gocomics%20unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/531601/gocomics%20unblocker.meta.js
// ==/UserScript==

(()=>{
	const style = document.createElement("style");
	style.innerHTML = `
.Paywall_upsell__b1P3R {
	display: none !important;
}
html, body {
	overflow: scroll !important;
}
`;
	document.head.appendChild(style);
})();