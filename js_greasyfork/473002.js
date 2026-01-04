// ==UserScript==
// @name         Nairaland
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Claim free Litecoin
// @author       Basilio.
// @match        https://nairaland.top/faucet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nairaland.top
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473002/Nairaland.user.js
// @updateURL https://update.greasyfork.org/scripts/473002/Nairaland.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var email = "faucetpay email";////EXAMPLE////


    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }


    if(window.location.href === "https://nairaland.top/faucet/"){

        setInterval(function() {
            if (document.querySelector(".form-control")) {
                document.querySelector(".form-control").value = email;
            }


                if (document.querySelector(".btn.btn-block.btn-primary")) {
                    document.querySelector(".btn.btn-block.btn-primary").click();
                }
 window.location.replace("https://nairaland.top/faucet/faucet/currency/ltc")
        }, 5000);

    }


    if(window.location.href.includes("https://nairaland.top/faucet/faucet/currency/ltc")){

        setInterval(function() {

            if (isCaptchaChecked()) {
                document.querySelector(".btn.btn-primary").click();
            }
        }, 3000);
setInterval(function() {
            window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        }, 90000);
    }

})();