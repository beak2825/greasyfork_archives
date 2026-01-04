// ==UserScript==
// @name            Free Bitcoin via iqfaucet.com autologin
// @namespace       http://tampermonkey.net/
// @version         1.2
// @description     Claim free Bitcoin
// @author          vikiweb
// @match           https://iqfaucet.com/*
// @match           https://iqfaucet.com/
// @grant           none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456664/Free%20Bitcoin%20via%20iqfaucetcom%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/456664/Free%20Bitcoin%20via%20iqfaucetcom%20autologin.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var bitcoin = "16Lfq4QC9Lgbse4oggWUVAe1e6Rv7o6ELn";

    setInterval(function() {
          console.log('interval')
        if (document.querySelector("body > div:nth-child(3) > div.col-md-6 > div > form > div > center > input")) {
            document.querySelector("body > div:nth-child(3) > div.col-md-6 > div > form > div > center > input").value = bitcoin;
            setTimeout(function(){
                document.querySelector("body div.container div.col-md-6 div.well.content form button.btn.btn-primary").click();
            },2000)
        }

        if ((document.querySelector("body div.container div.col-md-6 div.well.content form button.btn.btn-success.btn-lg")) &&
            (window.location.href.includes("https://iqfaucet.com/index.php"))) {
            document.querySelector("body div.container div.col-md-6 div.well.content form button.btn.btn-success.btn-lg").click();
        }

        setTimeout(function() {
            function isCaptchaChecked() {
                return grecaptcha && grecaptcha.getResponse().length !== 0;
            }

            if (isCaptchaChecked()) {
                document.querySelector("body div.container div.col-md-6 div.well.content form button.btn.btn-success").click();
            }else{
                console.log('Not checked')
            }

        }, 1000);

        if ((document.querySelector("body div.container div.col-md-6 div.well.content div.alert.alert-warning"))){
            if ((document.querySelector("body div.container div.col-md-6 div.well.content div.alert.alert-warning").innerText.includes("You have already claimed"))){
                window.location.replace('https://iqfaucet.com/index.php');
            }
        }
        if((document.querySelectorAll("body div.container div.col-md-6 div.well.content div.alert.alert-success")[1])){
            if( (document.querySelectorAll("body div.container div.col-md-6 div.well.content div.alert.alert-success")[1].innerText.includes("You've claimed successfully"))) {
                window.location.replace('https://iqfaucet.com/index.php');
            }
        }
          
    }, 15000);

})();