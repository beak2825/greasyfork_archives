// ==UserScript==
// @name         Banano Faucet and PTC
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Claim Faucet adn PTC
// @author       Basilio
// @match        https://banfaucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=banfaucet.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472666/Banano%20Faucet%20and%20PTC.user.js
// @updateURL https://update.greasyfork.org/scripts/472666/Banano%20Faucet%20and%20PTC.meta.js
// ==/UserScript==


   (function() {
    'use strict';

    var email = "email";////EXAMPLE////
    var password = "senha";////EXAMPLE////

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

/////Login////
 if(window.location.href === "https://banfaucet.com/"){
        window.location.replace("https://banfaucet.com/login")}

     if(window.location.href.includes("https://banfaucet.com/login")){

        setInterval(function() {
            if (document.querySelector("#inputEmail")) {
                document.querySelector("#inputEmail").value = email;
            }
            if (document.querySelector("#inputPassword")) {
                document.querySelector("#inputPassword").value = password;
            }
        }, 5000);


        setInterval(function() {

            if (isCaptchaChecked()) {
                if (document.querySelector("button[type='submit']")) {
                    document.querySelector("button[type='submit']").click();
                }
            }
        }, 6000);

    }

   if(window.location.href.includes("https://banfaucet.com/dashboard")){
       window.location.replace("https://try2link.com/bwBS")}
///////////Faucet //////

       if(window.location.href.includes ("https://banfaucet.com/faucet")){

       setInterval(function(){

if (isCaptchaChecked()) {

    document.querySelector("button[type='submit']").click();

}
     }, 10000);
    }

    ////////PTC//////
   if(window.location.href === "https://banfaucet.com/ptc"){
       if(document.querySelector(".btn-one")){
           document.querySelector(".btn-one").click();}}

    if(window.location.href.includes("https://banfaucet.com/ptc/view")){
       setInterval(function(){

if (isCaptchaChecked()) {

    document.querySelector(".btn.btn-success.btn-block").click();

}
     }, 6000);
    }
//Redirecionamento
    if (window.location.href.includes("https://banfaucet.com/faucet") && document.getElementById('second')){
        window.location.replace("https://try2link.com/3Dbw")}

    if (window.location.href.includes("https://banfaucet.com/ptc") && document.body.innerHTML.includes("There is PTC Ad left")){
      window.location.replace("https://try2link.com/bwBS")}
//////Firewall

        if(window.location.href.includes("https://banfaucet.com/firewall")){

        setInterval(function() {

            if (isCaptchaChecked()) {
                document.querySelector("button[type='submit']").click();
            }
        }, 3000);
    }
   

})();