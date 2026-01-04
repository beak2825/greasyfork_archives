// ==UserScript==
// @name         Faucetpaid faucet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  claim free trx and ltc
// @author       vikiweb
// @match        https://faucetpaid.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucetpaid.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462020/Faucetpaid%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/462020/Faucetpaid%20faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let email = "example@example.com"; //enter your faucetpay email here
    let sites = ['ltc', 'trx'];
    let currentFaucetUrl = window.location.href;
    let currentIndex = sites.findIndex(site => currentFaucetUrl.includes(site));

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    function movetonext() {
        if (currentIndex === sites.length - 1) {
            currentIndex = 0;
            console.log("All sites visited. Starting from 0 again.");
        } else {
            currentIndex++;
        }
        window.location.href = "https://faucetpaid.com/faucet/currency/" + sites[currentIndex];
    }

    if(document.querySelector("form[action*='/login']")){
        setInterval(function() {

            if (document.querySelector("#InputEmail")) {
                document.querySelector("#InputEmail").value = email;
            }

            if (document.querySelector("button[type='submit']")) {
                document.querySelector("button[type='submit']").click();
            }

        }, 6000);
    }

    if(document.querySelector("#userDropdown") && !window.location.href.includes('/faucet/currency/') && !window.location.href.includes('/firewall')){
        window.location.href = "https://faucetpaid.com/faucet/currency/" + sites[0]
    }

    setInterval(function() {
        if(document.querySelector(".swal2-shown .swal2-popup .swal2-confirm")){
            document.querySelector(".swal2-shown .swal2-popup .swal2-confirm").click();
        }

        if(document.querySelector("form#fauform")){
            if(isCaptchaChecked()){
                document.querySelector("form#fauform #subbutt").click()
            }
        }

        if(document.querySelector("form[action*='firewall/verify']")){
            if(isCaptchaChecked()){
                document.querySelector("form[action*='firewall/verify'] button[type='submit']").click()
            }
        }

        if(document.querySelector(".media .media-body a[href*='/faucet/currency']")){
            document.querySelector(".media .media-body a[href*='/faucet/currency']").click()
        }

    }, 6000);

    setInterval(function() {
        if(document.querySelector("h6 .currency-dashboard ")){
            if(document.querySelector("h6 .currency-dashboard ~ span").innerText != "Ready"){
                movetonext()
            }
        }
    }, 3000);

})();