// ==UserScript==
// @name        The Redeemer
// @namespace   raina
// @description Pops up the Steam product activation dialog when copying keys from bundle/reseller sites. Supports various bundle organizers and legitimate key resellers.
// @include     /^http:\/\/www\.dlh\.net\/en\/steam-keys\.html/
// @include     /^https:\/\/(www\.)?chrono\.gg/
// @include     /^https:\/\/groupees\.com\/(profile\/)?purchases/
// @include     /^https:\/\/secure\.nuuvem\.com\/account\/library/
// @include     /^https:\/\/www\.humblebundle\.com\/(downloads\?|home\/(keys|library))/
// @include     /^https?:\/\/(www\.)?dailyindiegame\.com\/account_page\.html/
// @include     /^https?:\/\/(www\.)?flyingbundle\.com\/users\/account/
// @include     /^https?:\/\/steamcompanion\.com\/gifts\/won/
// @include     /^https?:\/\/www\.bundlestars\.com\/en\/orders/
// @include     /^https?:\/\/www\.greenmangaming\.com\/user\/account/
// @include     /^https?:\/\/www\.indiegala\.com/(profile|game)\?/
// @include     /^https?:\/\/www\.oplata\.info\/info\/buy\.asp/
// @include     /^https?:\/\/www\.steamgifts\.com\/giveaways\/won/
// @version     2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10620/The%20Redeemer.user.js
// @updateURL https://update.greasyfork.org/scripts/10620/The%20Redeemer.meta.js
// ==/UserScript==
const activateProduct = e => {
	let productKey = window.getSelection().toString().trim() || e.target.value;
	if (/^[\d\w]{2,5}(\-[\d\w]{4,5}){2,4}$/.test(productKey)) {
		let activeproduct = window.open(
			"https://store.steampowered.com/account/registerkey?key=" + productKey,
			"activateproduct",
			"width=990,height=1000,resizable=0,scrollbars=0,status=0,location=0"
		);
	}
};
window.addEventListener("copy", activateProduct, false);
