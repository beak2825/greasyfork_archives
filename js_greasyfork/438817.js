// ==UserScript==
// @name         SEMI-AUTO SOLANA FAUCET
// @namespace    Claim Free Solana
// @version      1.0
// @description  Claim Free Solana
// @author       lotocamion
// @match        https://secoin.tf/?r=4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK
// @match        https://secoin.tf/
// @icon         https://www.google.com/s2/favicons?domain=secoin.tf
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438817/SEMI-AUTO%20SOLANA%20FAUCET.user.js
// @updateURL https://update.greasyfork.org/scripts/438817/SEMI-AUTO%20SOLANA%20FAUCET.meta.js
// ==/UserScript==

     (function() {
    'use strict';


     /////EDIT YOUR ADDRESS BELOW/////
     var sol = "4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK";/////EXAMPLE/////
     var clicked = false;
     if(document.getElementsByClassName("form-control")[0]) {
     document.getElementsByClassName("form-control")[0].value = sol;
     }
     setInterval(function() {
     if ((!clicked && document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) && (clicked == false)) {
     document.getElementsByClassName("btn btn-primary btn-lg claim-button")[0].click();
     clicked = true;
     }}, 8000);
     if(document.getElementsByClassName("btn btn-info")[0]) {
     document.getElementsByClassName("btn btn-info")[0].click();
     }
     })();