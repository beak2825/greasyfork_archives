// ==UserScript==
// @name         4.2_Sort short (cryptofenz.xyz) /Green
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sort short btcbunch faucet
// @author       Grizon
// @match        https://cryptofenz.xyz/links
// @match        https://cryptomonitor.in/*
// @icon         https://btcbunch.com/fexkomin_theme/img/beehive.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445366/42_Sort%20short%20%28cryptofenzxyz%29%20Green.user.js
// @updateURL https://update.greasyfork.org/scripts/445366/42_Sort%20short%20%28cryptofenzxyz%29%20Green.meta.js
// ==/UserScript==
(function() {
    'use strict';
var links = document.querySelectorAll('a[class="btn btn-primary waves-effect waves-light"]');
links.forEach(link => {
link.removeAttribute("target");
});

setTimeout(function() {
   	if (document.querySelector('a[href="https://cryptofenz.xyz/links/go/122"]')) {
   		document.querySelector('a[href="https://cryptofenz.xyz/links/go/122"]').click();} //SafeLink

   	else if (document.querySelector('a[href="https://cryptofenz.xyz/links/go/123"]')) {
   		document.querySelector('a[href="https://cryptofenz.xyz/links/go/123"]').click();} //CutGo

   		else if (document.querySelector('a[href="https://cryptofenz.xyz/links/go/124"]')) {
   		document.querySelector('a[href="https://cryptofenz.xyz/links/go/124"]').click();} //ZipCrypto

   		else if (document.querySelector('a[href="https://cryptofenz.xyz/links/go/120"]')) {
   		document.querySelector('a[href="https://cryptofenz.xyz/links/go/120"]').click();} //ShortHero

   		else if (document.querySelector('a[href="https://cryptofenz.xyz/links/go/121"]')) {
   		document.querySelector('a[href="https://cryptofenz.xyz/links/go/121"]').click();} //CutBits
}, 4000);

})();