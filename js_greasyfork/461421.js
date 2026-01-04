// ==UserScript==
// @name         Cryptoearnfaucet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Free bitcoin faucet
// @author       vikiweb
// @match        https://cryptoearnfaucet.com/offer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptoearnfaucet.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461421/Cryptoearnfaucet.user.js
// @updateURL https://update.greasyfork.org/scripts/461421/Cryptoearnfaucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enter your email address on line 18 and Go to https://cryptoearnfaucet.com/offer/?r=93

    let email = ""
    let check_address = window.location.origin;

    // Check if captcha is checked
    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    function visibleCheck(elm) {
        if(!elm.offsetHeight && !elm.offsetWidth) { return false; }
        if(getComputedStyle(elm).visibility === 'hidden') { return false; }
        return true;
    }


    if(window.location.href.includes(check_address) && document.querySelector("#hero h1")){
        window.location.replace(check_address +'/offer/login');
    }

    if (window.location.href.includes(check_address +'/offer/login')) {
        setInterval(function() {
            if (document.querySelector("#InputEmail")) {
                document.querySelector("#InputEmail").value = email;
            }
            if (document.querySelector("button[type='submit']")) {
                document.querySelector("button[type='submit']").click();
            }
        }, 6000);
    }

    if (window.location.href.includes(check_address +'/offer/dashboard')) {
        window.location.replace(check_address +'/offer/faucet');
    }

    if(window.location.href.includes(check_address +'/offer/faucet')){
        setInterval(function(){
            if(document.querySelector("#fauform button[type='submit']") && document.querySelector("#fauform input[type='text'].form-control.mb-3").value != ""){
                document.querySelector("#fauform button[type='submit']").click();
            }

            if(document.querySelector(".swal2-shown .swal2-popup .swal2-confirm")){
                document.querySelector(".swal2-shown .swal2-popup .swal2-confirm").click();
            }

            if(document.querySelector(".next-button .btn.btn-primary") && visibleCheck(document.querySelector(".next-button .btn.btn-primary"))){
                document.querySelector(".next-button .btn.btn-primary").click();
            }

            let string = document.querySelector("#Claim > div.text-center.mb-3 > div.row > div.text-primary.col > p:nth-child(1)");
            if(string){
                let parts = string.innerText.split("/");
                if (parts[0] === "0") {
                    console.log("The first value is 0.");
                    window.location.replace(check_address +'/offer/auto');
                } else {
                    console.log("The first value is not 0.");
                }
            }

        }, 10000)
    }

    if(window.location.href.includes(check_address +'/offer/auto')){
        setInterval(function(){
            if(document.querySelector(".swal2-shown .swal2-popup .swal2-confirm")){
                document.querySelector(".swal2-shown .swal2-popup .swal2-confirm").click();
            }
        }, 10000)
    }

})();