// ==UserScript==
// @name            KayDee tronxfaucet.com
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     [KayDee] Get Free Tron on tronxfaucet.com (1 TRX / 20 min).
// @author          KayDee
// @match           https://tronxfaucet.com
// @match           https://tronxfaucet.com/*

// @icon            https://www.google.com/s2/favicons?domain=tronxfaucet.com
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/431627/KayDee%20tronxfaucetcom.user.js
// @updateURL https://update.greasyfork.org/scripts/431627/KayDee%20tronxfaucetcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //var wallet = "";

    var firstButtonClicked = false;

    var intValue=1000;
    var timeoutValue=2*1000;
    // Get a reference to the last interval + 1
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
    }
    var claimSel="#tooplate_wrapper > center > div.row > div.col-lg-12.text-center > div > div.panel-body > form > button";
    var claim2Sel="#tooplate_wrapper > center > form > button";


    function checkClaim () {

        if (document.querySelector("#tooplate_wrapper > center > div.alert.alert-warning") && document.querySelector("#tooplate_wrapper > center > div.alert.alert-warning").innerText.includes("You can claim again in"))
        {
            timeoutValue=2*60*1000;

            var numberPattern = /\d+/g;

            var digits = document.querySelector("#tooplate_wrapper > center > div.alert.alert-warning").innerText.match( numberPattern );
            console.log(digits);
            if(digits[1] !=0) {

                console.log("CLAIM=> Need to wait for "+digits[1]+" minute(s)");
                console.log("CLAIM=> Sleep for "+timeoutValue/60000+" minute(s)");

                setTimeout(function() {
                    if (window.top.location.href.includes("tronxfaucet.com")) window.top.location.href = "https://tronxfaucet.com/?ref=9429";
                },timeoutValue);

            }
            else {
                try {
                    document.querySelector(claimSel).click();
                }
                catch (e) {}
            }
        }
        else if (document.querySelector(claimSel)) {
            try {
                document.querySelector(claimSel).click();
            }
            catch (e) {}
        }
        else {
            check2claim();
        }



    }

    function check2claim() {
        console.log("CLAIM=> check2claim")
        try {
            if (document.querySelector("#tooplate_wrapper > center > h1") && document.querySelector("#tooplate_wrapper > center > h1").innerText.includes("2.")) {
                console.log("CLAIM=> wait for captcha")
                var captchaInterval= setInterval(function() {
                    if (window.grecaptcha && window.grecaptcha.getResponse().length > 0) {
                        try { setTimeout(function() {
                            document.querySelector(claim2Sel).click();
                        }, 500);
                            }
                        catch (e) {}
                    }
                },1000)
                }
            else {
                console.log("CLAIM=> Restart");
                if (window.top.location.href.includes("tronxfaucet.com")) window.top.location.href = "https://tronxfaucet.com/?ref=9429";
            }
        }
        catch(e) {
            console.log("CLAIM=> check2claim error");
            console.log("CLAIM=> "+e);
        }
    }

    console.log("CLAIM=> Will start in "+timeoutValue);
    setTimeout(function() {
        checkClaim ();
    },timeoutValue);

})();