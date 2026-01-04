// ==UserScript==
// @name         Coinfaucet
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Claim PTC and Faucet
// @author       Basilio
// @match        https://coinfaucet.network/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinfaucet.network
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472848/Coinfaucet.user.js
// @updateURL https://update.greasyfork.org/scripts/472848/Coinfaucet.meta.js
// ==/UserScript==


   (function() {


       'use strict';
    var email = "email";////EXAMPLE////
    var password = "senha";////EXAMPLE////

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

/////Login////
 if(window.location.href === "https://coinfaucet.network/"){
        window.location.replace("https://coinfaucet.network/login")}

     if(window.location.href.includes("https://coinfaucet.network/login")){

        setInterval(function() {
            if (document.querySelector("#email")) {
                document.querySelector("#email").value = email;
            }
            if (document.querySelector("#password")) {
                document.querySelector("#password").value = password;
            }
        }, 5000);


        setInterval(function() {

            if (isCaptchaChecked()) {
                if (document.querySelector(".btn-submit.w-100")) {
                    document.querySelector(".btn-submit.w-100").click();
                }
            }
        }, 6000);

    }

   if(window.location.href.includes("https://coinfaucet.network/dashboard")){
       window.location.replace("https://coinfaucet.network/faucet")}
///////////Faucet //////

       if(window.location.href.includes ("https://coinfaucet.network/faucet")){

       setInterval(function(){

if (isCaptchaChecked()) {

    document.querySelector(".mt-2.btn.btn-one.btn-lg.claim-button").click();

}
     }, 10000);
    }

    ////////PTC//////
   if(window.location.href === "https://coinfaucet.network/ptc"){
       if(document.querySelector(".btn-one.w-100")){
           document.querySelector(".btn-one.w-100").click();}}

if(window.location.href.includes("https://coinfaucet.network/ptc/view")){
     setInterval(function(){



    document.querySelector("#verify").click();


     }, 10000);
    }

    
//Redirecionamento
    if (window.location.href.includes("https://coinfaucet.network/faucet") && document.getElementById('second')){
        window.location.replace("https://adshort.co/G3SNrO04")}

    if (window.location.href.includes("https://coinfaucet.network/ptc") && document.body.innerHTML.includes("There is PTC Ad left")){
      window.location.replace("https://adshort.co/gu9blr")}

    

})();