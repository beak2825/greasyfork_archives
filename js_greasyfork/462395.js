// ==UserScript==
// @name         Soltoshindo faucet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Lets make thing easy
// @author       vikiweb
// @match        https://soltoshindo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soltoshindo.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462395/Soltoshindo%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/462395/Soltoshindo%20faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enter your email address and password and Go to https://soltoshindo.com/?r=1403

    let email = "email@email.com";
    let password = "password";
    let check_address = window.location.origin;

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    if(window.location.href.includes(check_address) && document.querySelector(".nk-banner .banner-wrap")){
        window.location.replace(check_address +'/login');
    }

    if (window.location.href.includes(check_address +'/login')) {
        setTimeout(function() {
            if (document.querySelector("input[name='email']")) {
                document.querySelector("input[name='email']").value = email;
            }
            if (document.querySelector("input[name='password']")) {
                document.querySelector("input[name='password']").value = password;
            }
            if (document.querySelector("button[type='submit']")) {
                document.querySelector("button[type='submit']").click();
            }
        }, 10000);
    }

    if (window.location.href.includes(check_address +'/dashboard')) {
        window.location.replace(check_address +'/claim');
    }

    if(window.location.href.includes(check_address +'/claim')){
        setInterval(function(){

            if(document.querySelector("#fauform button[type='submit']")){
                if(isCaptchaChecked()){
                    document.querySelector("#fauform button[type='submit']").click();
                }
            }

            let string = document.querySelector(".content .grid-cols-12 .intro-y:nth-child(4) .report-box .text-3xl");

            console.log(string)

            if(string){
                let parts = string.innerText.split("/");
                if (parts[0] === "0") {
                    console.log("The first value is 0.");
                    //alert('Come back tomorrow to claim again')
                    window.location.replace(check_address +'/auto');
                } else {
                    console.log("The first value is not 0.");
                }
            }

        }, 10000)
    }


})();