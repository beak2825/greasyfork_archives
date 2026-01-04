// ==UserScript==
// @name         SpaceShooter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Claim Faucet , PTC 
// @author       Basilio
// @match        https://spaceshooter.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spaceshooter.net
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472712/SpaceShooter.user.js
// @updateURL https://update.greasyfork.org/scripts/472712/SpaceShooter.meta.js
// ==/UserScript==


   (function() {
    'use strict';

  


    var email = "email";////EXAMPLE////
    var password = "senha";////EXAMPLE////

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

/////Login////
 if(window.location.href === "https://spaceshooter.net/"){
        window.location.replace("https://spaceshooter.net/login")}

     if(window.location.href.includes("https://spaceshooter.net/login")){
setInterval(function() {
            if (document.querySelector("#email")) {
                document.querySelector("#email").value = email;
            }
            if (document.querySelector("#password")) {
                document.querySelector("#password").value = password;
            }



            if (isCaptchaChecked()) {
                if (document.querySelector(".btn-submit.w-100")) {
                    document.querySelector(".btn-submit.w-100").click();
                }
            }
        }, 6000);

    }
 //////////Faucet
if(window.location.href === "https://spaceshooter.net/faucet"){
setInterval(function(){

if (isCaptchaChecked()) {

    document.querySelector("button[type='submit']").click();

}
     }, 6000);
    }

    ////////PTC//////
   if(window.location.href === "https://spaceshooter.net/ptc"){
       if(document.querySelector(".claim-btn.w-100.text-white")){
           document.querySelector(".claim-btn.w-100.text-white").click();}}

    if(window.location.href.includes("https://spaceshooter.net/ptc/view")){
       setInterval(function(){

if (isCaptchaChecked()) {

    document.querySelector("button[type='submit']").click();

}
     }, 6000);
    }
//Redirecionamento
   if(window.location.href.includes("https://spaceshooter.net/dashboard")){
       window.location.replace("https://try2link.com/aomVtQN")}

        if (window.location.href.includes("https://spaceshooter.net/faucet") && document.getElementById('second')){
      window.location.replace("https://try2link.com/vKui")}

    if (window.location.href.includes("https://spaceshooter.net/ptc") && document.body.innerHTML.includes("Daily Limit Reached")){
      window.location.replace("https://try2link.com/aomVtQN")}


      

})();