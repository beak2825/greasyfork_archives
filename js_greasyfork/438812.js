// ==UserScript==
// @name         SEMI-AUTO DIGIBYTE FAUCET
// @namespace    Claim free Digibyte
// @version      1.0
// @description  Claim free Digibyte
// @author       lotocamion
// @match        https://ezcoin.it/dgb/digibyte/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn
// @match        https://ezcoin.it/dgb/digibyte/
// @icon         https://www.google.com/s2/favicons?domain=ezcoin.it
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438812/SEMI-AUTO%20DIGIBYTE%20FAUCET.user.js
// @updateURL https://update.greasyfork.org/scripts/438812/SEMI-AUTO%20DIGIBYTE%20FAUCET.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /////EDIT YOUR ADDRESS BELOW/////
    var dgb = "D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn";/////EXAMPLE/////
    var clicked = false;
    if(document.getElementsByClassName("form-control")[0]) {
    document.getElementsByClassName("form-control")[0].value = dgb;
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