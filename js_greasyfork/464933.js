// ==UserScript==
// @name         topfaucet.top : Auto Faucet
// @namespace    topfaucet.auto.faucet
// @version      1.1
// @description  https://ouo.io/g0EbKIi
// @author       stealtosvra
// @match        https://topfaucet.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sato.host
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464933/topfaucettop%20%3A%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/464933/topfaucettop%20%3A%20Auto%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}

    if (document.querySelector('.alert.alert-info').textContent.trim() === 'Your faucet claim of 0.00005000 USDT has been sent to your FaucetPay.io account.') {
        setTimeout(function() {
            console.log('Waited for 3 minutes');
            setInterval(function() {
                if (hCaptcha()) {
                    document.querySelector("input[type='submit']").click();
                } else {
          console.log('hCaptcha not found or response is empty');
          document.querySelector("input[type='submit']").click();
        }
            }, 7000);
        }, 180000);
    } else {
       if (hCaptcha()) {
                    document.querySelector("input[type='submit']").click();
                } else {
          console.log('hCaptcha not found or response is empty');
          document.querySelector("input[type='submit']").click();
        }
    }

})();

