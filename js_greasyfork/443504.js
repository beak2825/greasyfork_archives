// ==UserScript==
// @name 1_CSS_Blocker content
// @namespace https://greasyfork.org/ru/users/816924-grizon
// @version 4.0
// @description Блокировщик контента
// @author GrizonRu
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.safelink.site/*
// @match *://*.cutbits.site/*
// @match *://*.cutgo.site/*
// @match *://*.zipcrypto.site/*
// @match *://*.cutearn.xyz/*
// @match *://*.flylink.site/*
// @match *://*.shorthero.site/*
// @match *://*.sl-2.btcbunch.com/*
// @match *://*.sl-1.btcbunch.com/*
// @match *://*.cryptoaffiliates.store/*
// @match *://*.2the.space/*
// @match *://*.crypto4tun.com/*
// @match *://*.askpaccosi.com/*
// @match *://*.cryptomonitor.in/*
// @match *://*.forexeen.us/*
// @match *://*.careerhunter.space/*
// @downloadURL https://update.greasyfork.org/scripts/443504/1_CSS_Blocker%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/443504/1_CSS_Blocker%20content.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "safelink.site" || location.hostname.endsWith(".safelink.site")) || (location.hostname === "cutbits.site" || location.hostname.endsWith(".cutbits.site")) || (location.hostname === "cutgo.site" || location.hostname.endsWith(".cutgo.site")) || (location.hostname === "zipcrypto.site" || location.hostname.endsWith(".zipcrypto.site")) || (location.hostname === "cutearn.xyz" || location.hostname.endsWith(".cutearn.xyz")) || (location.hostname === "flylink.site" || location.hostname.endsWith(".flylink.site")) || (location.hostname === "shorthero.site" || location.hostname.endsWith(".shorthero.site")) || (location.hostname === "sl-2.btcbunch.com" || location.hostname.endsWith(".sl-2.btcbunch.com")) || (location.hostname === "sl-1.btcbunch.com" || location.hostname.endsWith(".sl-1.btcbunch.com"))) {
		css += `
		head, .r-bg, .short, p, h2, h3, #p_5027841, #wcfloatDiv4, footer, .menu-fi, html>h12
		{
			display: none!important;
		}
		`;
}
if ((location.hostname === "cryptoaffiliates.store" || location.hostname.endsWith(".cryptoaffiliates.store"))) {
		css += `
		.banner-inner, footer, .banner, #cookie-pop, .navbar-right, .text-left
		{
			display: none;
		}
		`;
}
if ((location.hostname === "2the.space" || location.hostname.endsWith(".2the.space")) || (location.hostname === "crypto4tun.com" || location.hostname.endsWith(".crypto4tun.com")) || (location.hostname === "askpaccosi.com" || location.hostname.endsWith(".askpaccosi.com")) || (location.hostname === "cryptomonitor.in" || location.hostname.endsWith(".cryptomonitor.in")) || (location.hostname === "forexeen.us" || location.hostname.endsWith(".forexeen.us")) || (location.hostname === "careerhunter.space" || location.hostname.endsWith(".careerhunter.space"))) {
		css += `
		body
		{
			display: none!important;;
		}
		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
