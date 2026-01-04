// ==UserScript==
// @name         Litecoinfree
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Groland
// @description    dndjkdm
// @license       MIT
// @match        https://freeltc.online/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481971/Litecoinfree.user.js
// @updateURL https://update.greasyfork.org/scripts/481971/Litecoinfree.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const successAlert = document.querySelector('.show.fade.alert-danger.alert');
    const searchText = 'satoshi was sent to your';
    const sponsorLink = document.querySelector('.my-2.btn-block.btn');
  setTimeout(function() {
        // Localize e clique no elemento usando o seletor CSS fornecido
        document.querySelector('.form-group:nth-of-type(3) .my-2.btn-primary.btn-block.btn').click();
    }, 2000);
    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }
    setInterval(function() {

            if (isCaptchaChecked()) {
                if (document.querySelector("button[type='submit']")) {
                    document.querySelector("button[type='submit']").click();
                }
            }
        }, 1000);
setInterval(function(){

if (isCaptchaChecked()) {

    document.querySelector(".modal-body > div.form-group > .my-2.btn-block.btn").click();

}
     }, 1000);

    setTimeout(function() {
        if (sponsorLink.textContent === "Go to Sponsor's Link") {
            sponsorLink.click();
        }
    }, 2000);
   setTimeout(function() {
    if (window.location.href.includes("https://simpleads.io/btc/") && document.getElementById('satoshi was sent to your')){
        window.location.replace("https://simpleads.io/btc/") }
   }, 10000);
    setTimeout(function() {
            if (successAlert && successAlert.textContent.includes('satoshi was sent to your')) {
                location.reload();}}, 7000);


    setTimeout(function() {
    if (window.location.href.includes("https://simpleads.io/btc/") && document.body.innerHTML.includes("satoshi was sent to your")){
      window.location.replace("https://simpleads.io/btc/")}

    }, 30000);


     setTimeout(function() {
    if (window.location.href.includes("https://freeltc.online/") && document.body.innerHTML.includes("satoshi was sent to your")){
      window.location.replace("https://freeltc.online/")}

    }, 30000);




})();