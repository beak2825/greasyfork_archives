// ==UserScript==
// @name         Litecoin Faucet
// @namespace    https://litfaucet.com/?r=lotocamion
// @version      1.2
// @description  Claim free Litecoin
// @author       lotocamion
// @match        https://litfaucet.com/page/dashboard
// @match        https://litfaucet.com/page/dashboard/*
// @icon         https://www.google.com/s2/favicons?domain=litfaucet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436999/Litecoin%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/436999/Litecoin%20Faucet.meta.js
// ==/UserScript==

//Use my referral link below to signup//
//https://litfaucet.com/?r=lotocamion//

    (function() {
    'use strict';
     var clicked = false;
     setInterval(function() {
     if (!clicked && document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
     document.querySelector("#holder > div > div.col-xs-12.col-sm-8 > form > input").click();
     clicked = true;
     }
     }, 5000);
     setTimeout(function() {
     window.location.replace(window.location.pathname + window.location.search + window.location.hash);
     }, 2*75000);
     })();
