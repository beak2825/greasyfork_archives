// ==UserScript==0
// @name         CryptoWorld
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Free TRX faucet
// @author       Worldcrypto
// @match        https://claimtrx.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptoearnfaucet.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470199/CryptoWorld.user.js
// @updateURL https://update.greasyfork.org/scripts/470199/CryptoWorld.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Register via https://claimtrx.com/?r=422226 and enter your email addreass and password on line no 25

    let sites = [
        {faucetUrl: "https://claimtrx.com/faucet", email: "", password: "", },
    ];

    let autoRotateTimerinMin = 1;

    let sitesMap = [
        {
            websiteUrl:"https://claimtrx.com",
            homePageCheck : ".container .herotext",
            loginSelectors :["#email", "#password"],
           //submitFormSelectors : ["form[action*='/verify'] button[type=submit]", "form[action*='/verify'] input.form-control"],
            submitFormSelectors : ["form[action*='/verify'] button[type=submit]"],
            claimCaptchaSelector : [".rscapimg", "selectedOption"],
            hasLimit : false,
        },

    ]

    function movetonext() {
        if (currentIndex === sites.length - 1) {
            currentIndex = 0;
            console.log("All sites visited. Starting from 0 again.");
        } else {
            currentIndex++;
        }
        window.location.href = sites[currentIndex].faucetUrl;
    }

    // Check if captcha is checked
    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    function visibleCheck(elm) {
        if(!elm.offsetHeight && !elm.offsetWidth) { return false; }
        if(getComputedStyle(elm).visibility === 'hidden') { return false; }
        return true;
    }

    let check_address = window.location.origin;
    let currentFaucetUrl = new URL(window.location.href);
    let currentOrigin = currentFaucetUrl.origin;
    let currentIndex = sites.findIndex(site => site.faucetUrl.includes(currentOrigin));
    let websiteIndex = sitesMap.findIndex(website => website.websiteUrl.includes(currentOrigin));

    function processSite(site) {

        if(window.location.href.includes(check_address) && document.querySelector(sitesMap[websiteIndex].homePageCheck)){
            window.location.replace(sitesMap[websiteIndex].websiteUrl +'/login');
        }

        if (window.location.href.includes(sitesMap[websiteIndex].websiteUrl +'/login')) {
            setInterval(function() {
                if (document.querySelector(sitesMap[websiteIndex].loginSelectors[0])) {
                    document.querySelector(sitesMap[websiteIndex].loginSelectors[0]).value = site.email;
                }
                if (document.querySelector(sitesMap[websiteIndex].loginSelectors[1])) {
                    document.querySelector(sitesMap[websiteIndex].loginSelectors[1]).value = site.password;
                }

                if(!sitesMap[websiteIndex].loginImageCapatha){
                    if (document.querySelector("button[type='submit']")) {
                        document.querySelector("button[type='submit']").click();
                    }
                }else{
                    document.querySelectorAll(sitesMap[websiteIndex].claimCaptchaSelector[0]).forEach(function(img) {
                        if (img.classList.contains(sitesMap[websiteIndex].claimCaptchaSelector[1])) {
                            // Do something if the element has the selectedOption class
                            console.log("Image is selected!");
                            document.querySelector("button[type='submit']").click();
                        } else {
                            // Do something if the element does not have the selectedOption class
                            console.log("Image is not selected!");
                        }
                    });
                }

            }, 6000);
        }

        if (window.location.href.includes(sitesMap[websiteIndex].websiteUrl +'/dashboard')) {
            window.location.replace(sitesMap[websiteIndex].websiteUrl +'/faucet');
        }

        if(window.location.href.includes(sitesMap[websiteIndex].websiteUrl +'/faucet')){

            setInterval(function(){
                if(!sitesMap[websiteIndex].claimCaptchaSelector){
                    if(document.querySelector(sitesMap[websiteIndex].submitFormSelectors[0]) && document.querySelector(sitesMap[websiteIndex].submitFormSelectors[1]).value != ""){
                        document.querySelector(sitesMap[websiteIndex].submitFormSelectors[0]).click();
                    }
                }else{
                    document.querySelectorAll(sitesMap[websiteIndex].claimCaptchaSelector[0]).forEach(function(img) {
                        if (img.classList.contains(sitesMap[websiteIndex].claimCaptchaSelector[1])) {
                            // Do something if the element has the selectedOption class
                            console.log("Image is selected!");
                            if(document.querySelectorAll(sitesMap[websiteIndex].submitFormSelectors[2]) && document.querySelectorAll(sitesMap[websiteIndex].submitFormSelectors[2]).value != ""){
                                document.querySelector(sitesMap[websiteIndex].submitFormSelectors[0]).click();
                            }else{
                                document.querySelector(sitesMap[websiteIndex].submitFormSelectors[0]).click();
                            }
                        } else {
                            // Do something if the element does not have the selectedOption class
                            console.log("Image is not selected!");
                        }
                    });
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
                        movetonext()
                    } else {
                        console.log("The first value is not 0.");
                    }
                }

            }, 10000)

            setInterval(function(){

                if(!document.querySelector(sitesMap[websiteIndex].submitFormSelectors[0])){
                    movetonext()
                }

            }, autoRotateTimerinMin * 60000)
        }
    }

    // Start processing the first site
    processSite(sites[currentIndex]);

})();