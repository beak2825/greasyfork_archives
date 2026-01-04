// ==UserScript==
// @name         Pepe claim
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Claim PEPE
// @author       Basilio
// @match        https://free-pepe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=free-pepe.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473004/Pepe%20claim.user.js
// @updateURL https://update.greasyfork.org/scripts/473004/Pepe%20claim.meta.js
// ==/UserScript==


   (function() {
    'use strict';



       'use strict';
    var cwallet = "cwalletID";////EXAMPLE////


    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

/////Login////


     if(window.location.href==="https://free-pepe.com/"){

        setInterval(function() {
            if (document.querySelector("input[name='wallet']")) {
                document.querySelector("input[name='wallet']").value = cwallet;
            }
            }, 6000);

 setInterval(function() {

                if (document.querySelector(".main_bt")) {
                    document.querySelector(".main_bt").click();
                }

        }, 6000);

    }
 

   if(window.location.href.includes("https://free-pepe.com/dashboard")){
       window.location.replace("https://free-pepe.com/faucet/currency/pepe")}
///////////Faucet //////

       if(window.location.href.includes ("https://free-pepe.com/faucet/currency/pepe")){

       setInterval(function(){

if (isCaptchaChecked()) {

    document.querySelector(".main_bt").click();

}
     }, 10000);
    }

 if(window.location.href==="https://free-pepe.com/firewall"){
      setInterval(function(){

if (isCaptchaChecked()) {

    document.querySelector(".btn.btn-primary.w-md").click();

}
     }, 10000);
    }



})();