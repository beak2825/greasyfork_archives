// ==UserScript==
// @name         iQFaucet.com (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.1
// @description  Auto Claim.
// @author       Jadson Tavares
// @match        https://iqfaucet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428468/iQFaucetcom%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428468/iQFaucetcom%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        var buttonClaimNow = $("body > div:nth-child(3) > div.col-md-6 > div > form > button");

        if(window.location.href.includes('verify.php')){
            if(grecaptcha && grecaptcha.getResponse().length > 0){
                if(buttonClaimNow.is(':visible')){
                    buttonClaimNow.click();
                }
            }
        } else if(window.location.href.includes('index.php?c=1')){
            window.history.go(0);
        } else {
            if(buttonClaimNow.is(':visible')){
                buttonClaimNow.click();
            }
        }
    },10000);
})();