// ==UserScript==
// @name         Claimtoro
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Free satoshi
// @author       vikiweb
// @match        https://claimtoro.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462093/Claimtoro.user.js
// @updateURL https://update.greasyfork.org/scripts/462093/Claimtoro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enter your email address on line 18 and Go to https://cryptoearnfaucet.com/offer/?r=93

    let email = "email@email.com";
    let password = "password";
    
    let check_address = window.location.origin;

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    if(window.location.href.includes(check_address) && document.querySelector("#header-carousel")){
        window.location.replace(check_address +'/login');
    }

    if (window.location.href.includes(check_address +'/login')) {
        setTimeout(function() {
            if (document.querySelector("#email")) {
                document.querySelector("#email").value = email;
            }
            if (document.querySelector("#password")) {
                document.querySelector("#password").value = password;
            }
            if (document.querySelector("button[type='submit']")) {
                document.querySelector("button[type='submit']").click();
            }
        }, 10000);
    }

    if (window.location.href.includes(check_address +'/dashboard')) {
        window.location.replace(check_address +'/faucet');
    }

    if(window.location.href.includes(check_address +'/faucet')){
        setInterval(function(){

            if(document.querySelector("form[action*='faucet/verify']")){

                if(isCaptchaChecked()){
                    document.querySelector("form[action*='faucet/verify'] button[type='submit']").click()
                }
            }

            let string = document.querySelector("body > div.app-content.content > div.content-wrapper.max > div.content-body > div.row.justify-content-center > div:nth-child(4) > div > div > div:nth-child(1) > h5");
            if(string){
                let parts = string.innerText.split("/");
                if (parts[0] === "0") {
                    console.log("The first value is 0.");
                    alert('Come back tomorrow to claim again')
                } else {
                    console.log("The first value is not 0.");
                }
            }

        }, 10000)
    }


    if(window.location.href.includes(check_address +'/firewall')){
        setInterval(function(){
            if(document.querySelector("form[action*='firewall/verify']")){
                if(isCaptchaChecked()){
                    document.querySelector("form[action*='firewall/verify'] button[type='submit']").click()
                }
            }
        }, 10000)
    }

})();