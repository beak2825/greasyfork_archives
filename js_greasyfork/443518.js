// ==UserScript==
// @name         4.1_Sort short (btcbunch.com) /Yellow
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sort short btcbunch faucet
// @author       Grizon
// @match        https://btcbunch.com/links
// @icon         https://btcbunch.com/fexkomin_theme/img/beehive.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443518/41_Sort%20short%20%28btcbunchcom%29%20Yellow.user.js
// @updateURL https://update.greasyfork.org/scripts/443518/41_Sort%20short%20%28btcbunchcom%29%20Yellow.meta.js
// ==/UserScript==

(function() {
    'use strict';
var links = document.querySelectorAll('a[class="btn btn-primary waves-effect waves-light"]');
links.forEach(link => {
link.removeAttribute("target");
});

setInterval(function() {
   	if (document.querySelector('a[href="https://btcbunch.com/links/go/149"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/149"]').click();} //MoroFly

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/151"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/151"]').click();} //Gameen

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/150"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/150"]').click();} //ZoroFly

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/152"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/152"]').click();} //Yameen

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/143"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/143"]').click();} //Wizzly

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/141"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/141"]').click();} //FoxLink

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/139"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/139"]').click();} //Cryptoon

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/140"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/140"]').click();} //BoxLink

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/148"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/148"]').click();} //PoroFly

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/142"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/142"]').click();} //MoxLink

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/153"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/153"]').click();} //Fameen

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/80"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/80"]').click();} //WoroFly

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/144"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/144"]').click();} //ZoxLink

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/155"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/155"]').click();} //DropLink

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/161"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/161"]').click();} //Mitly

//Шорты с капчей
//Можно дописывать свои
   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/184"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/184"]').click();} //SafeLink *BEST*

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/183"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/183"]').click();} //CutBits *BEST*

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/185"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/185"]').click();} //CutGo *BEST*

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/186"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/186"]').click();} //Z-Crypto *BEST*

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/182"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/182"]').click();} //S-Hero *BEST*

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/181"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/181"]').click();} //CutEarn *BEST*

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/180"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/180"]').click();} //FlyLink *BEST*

   	else if (document.querySelector('a[href="https://btcbunch.com/links/go/192"]')) {
   		document.querySelector('a[href="https://btcbunch.com/links/go/192"]').click();} //C-Affiliates SH-1




//Копируем код до этой строки.
}, 3000);
})();