// ==UserScript==
// @name         Claim auto faucets
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Renda Extra
// @author       Groland
// @match        https://bnb-earn.com/*
// @match        https://sol-earn.com/*
// @match        https://tron-earn.com/*
// @match        https://matic-earn.com/*
// @match        https://faucetdash.com/*
// @match        https://btcrocket.net/*
// @match        https://ethrocket.net/*
// @match        https://cryptoarea.net/*
// @match        https://cryptoxmr.net/*
// @match        https://dash-earn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bnb-earn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484510/Claim%20auto%20faucets.user.js
// @updateURL https://update.greasyfork.org/scripts/484510/Claim%20auto%20faucets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

  setInterval (function(){

if (isCaptchaChecked()) {

    document.querySelector(".text-center.col-lg-4 .w-100.mb-3.btn-primary.btn").click();

}
  }, 8000);



if (isCaptchaChecked()) {

setTimeout (function() { document.querySelector(".swal2-show.swal2-icon-success.swal2-modal.swal2-popup .btn-primary.btn.swal2-confirm").click();
                       }, 8000);


}


})();