// ==UserScript==
// @name         Litecoinmania Faucet (freesol.xyz)
// @namespace    Free Litecoin
// @version      1.1
// @description  Claim Free Litecoin
// @author       lotocamion
// @include      https://freesol.xyz/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD
// @icon         https://www.google.com/s2/favicons?domain=freesol.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437160/Litecoinmania%20Faucet%20%28freesolxyz%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437160/Litecoinmania%20Faucet%20%28freesolxyz%29.meta.js
// ==/UserScript==

(function() {
   'use strict';
         // EDIT YOUR ADDRESS HERE //
         var Ltc= "122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4"///EXAMPLE///
         var linkselector = "#id_shortlink > a"
         var clicked = false;
         var Address = false;
         setTimeout(function() {
         if(document.querySelector(linkselector)) {
         document.querySelector(linkselector).click();
         }
         setInterval(function() {
         if (document.querySelector("body > div.container-fluid > div:nth-child(2) > div.col-xs-12.col-md-6.col-md-push-3 > form > div.step2 > div:nth-child(1) > div > input")) {
         document.querySelector("body > div.container-fluid > div:nth-child(2) > div.col-xs-12.col-md-6.col-md-push-3 > form > div.step2 > div:nth-child(1) > div > input").value = Ltc;
         Address = true;
         }
         setTimeout(function() {
         if (!clicked && document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
         document.querySelector("body > div.container-fluid > div:nth-child(2) > div.col-xs-12.col-md-6.col-md-push-3 > form > div.step2 > div:nth-child(4) > div > input").click();
         clicked = true;
         }
         }, 2000);
         }, 2000);
         }, 2000);
         setTimeout(function() {
         window.location.replace(window.location.pathname + window.location.search + window.location.hash);
         }, 1*75000);


         })();
