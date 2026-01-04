// ==UserScript==
// @name         FreeBinance.co.in Auto Faucet Claim
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Auto Claim BNB Faucet from FreeBinance.co.in
// @author       Rodrigo Normandia

// @icon         https://www.google.com/s2/favicons?domain=FreeBinance.co.in

// @match        https://freebinance.co.in/backoffice/faucet

// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @grant        GM_openInTab
// @grant        window.onurlchange

// @note         ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// @note        Register with my referal link and suport this developer
// @note        https://freebinance.co.in/?ref=76841r
// @note         ----------------------------------------------------------------------------------------------------------------------------------------------------------------

// @downloadURL https://update.greasyfork.org/scripts/435903/FreeBinancecoin%20Auto%20Faucet%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/435903/FreeBinancecoin%20Auto%20Faucet%20Claim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var inputTextSubmitButton = "#basic-elements > div.container > div > div.card-body > div > div > div > div > div > form > div.card-body.py-1 > button";
    var goClaimButton = "#btn_go > a";
    var claimsLeft = "#basic-elements > div.row > div > div > div > div:nth-child(2) > div > div.card-header > span";
    var timeInterval = 60000;  //1000 ms = 1 second.
    var myVar;

    window.addEventListener('load', function() {
        var claims = parseInt(document.querySelector(claimsLeft).innerHTML);
        if (claims > 0){
            console.log(claims+" claims left");
            if (document.querySelector(inputTextSubmitButton)){
                console.log("waiting hCaptcha be solved");
                let myVar = setInterval(checkCaptcha, timeInterval);
                function checkCaptcha() {
                    console.log("Checking ....");
                    document.querySelector(inputTextSubmitButton).click();
                }
            } else if (document.querySelector(goClaimButton)) {
                console.log("Go claim ....");
                document.querySelector(goClaimButton).click();
            } else {
                setTimeout(function () {
                    window.location.href = window.location.href;
                }, 60000*3)
            }
        } else {
            console.log("No Claims left ....");
            setTimeout(function () {
                    window.location.href = window.location.href;
                }, 60000*24)
        }
    }, false);
})();