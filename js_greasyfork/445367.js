// ==UserScript==
// @name         4.3_Sort short (cryptoaffiliates.store) /Blue
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sort short btcbunch faucet
// @author       Grizon
// @match        https://cryptoaffiliates.store/links
// @match        https://cryptomonitor.in/*
// @icon         https://btcbunch.com/fexkomin_theme/img/beehive.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445367/43_Sort%20short%20%28cryptoaffiliatesstore%29%20Blue.user.js
// @updateURL https://update.greasyfork.org/scripts/445367/43_Sort%20short%20%28cryptoaffiliatesstore%29%20Blue.meta.js
// ==/UserScript==
(function() {
    'use strict';
var links = document.querySelectorAll('a[class="btn btn-primary waves-effect waves-light"]');
links.forEach(link => {
link.removeAttribute("target");
});

setTimeout(function() {
   	if (document.querySelector('a[href="https://cryptoaffiliates.store/links/go/149"]')) {
   		document.querySelector('a[href="https://cryptoaffiliates.store/links/go/149"]').click();} //FlyLink

   	else if (document.querySelector('a[href="https://cryptoaffiliates.store/links/go/155"]')) {
   		document.querySelector('a[href="https://cryptoaffiliates.store/links/go/155"]').click();} //ZipCrypto

   	else if (document.querySelector('a[href="https://cryptoaffiliates.store/links/go/154"]')) {
   		document.querySelector('a[href="https://cryptoaffiliates.store/links/go/154"]').click();} //CutGo

   	else if (document.querySelector('a[href="https://cryptoaffiliates.store/links/go/152"]')) {
   		document.querySelector('a[href="https://cryptoaffiliates.store/links/go/152"]').click();} //CutBits

   	else if (document.querySelector('a[href="https://cryptoaffiliates.store/links/go/153"]')) {
   		document.querySelector('a[href="https://cryptoaffiliates.store/links/go/153"]').click();} //SafeLink

   	else if (document.querySelector('a[href="https://cryptoaffiliates.store/links/go/183"]')) {
   		document.querySelector('a[href="https://cryptoaffiliates.store/links/go/183"]').click();} //ZetLink

   	else if (document.querySelector('a[href="https://cryptoaffiliates.store/links/go/151"]')) {
   		document.querySelector('a[href="https://cryptoaffiliates.store/links/go/151"]').click();} //ShortHero

   	else if (document.querySelector('a[href="https://cryptoaffiliates.store/links/go/150"]')) {
   		document.querySelector('a[href="https://cryptoaffiliates.store/links/go/150"]').click();} //CutEarn

}, 4000);

})();