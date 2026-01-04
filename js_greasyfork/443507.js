// ==UserScript==
// @name         6_C-Affiliates SH-1 for btcbunch.com
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Short C-Affiliates SH-1 on btcbunch.com
// @author       GrizonRu
// @match        https://cryptoaffiliates.store/*
// @include      https://cryptoaffiliates.store/*
// @icon         https://btcbunch.com/fexkomin_theme/img/beehive.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443507/6_C-Affiliates%20SH-1%20for%20btcbunchcom.user.js
// @updateURL https://update.greasyfork.org/scripts/443507/6_C-Affiliates%20SH-1%20for%20btcbunchcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    	setInterval(function() {
             if  (grecaptcha.getResponse().length > 0) {
                document.querySelector('button[class="btn btn-primary btn-captcha"]').click();
            }
    	}, 2000);
    	setInterval(function() {
                document.querySelector('a[class="btn btn-success btn-lg get-link"]').click();
    	}, 3000);
let css = `
.banner-inner, footer, .banner, #cookie-pop, .navbar-right, .text-left
{
	display: none;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();