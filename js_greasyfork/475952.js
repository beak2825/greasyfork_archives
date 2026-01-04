// ==UserScript==
// @name         Yoofaucet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Login and collect faucet
// @author       White
// @match        https://yoofaucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yoofaucet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475952/Yoofaucet.user.js
// @updateURL https://update.greasyfork.org/scripts/475952/Yoofaucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fillEmailAndClickStartClaim() {
        var email = "example@example.com";
        var inputField = document.querySelector('input.offer-form__input[name="address"]');
        if (inputField) {
            inputField.value = email;
            var startClaimButton = document.querySelector('button.shine-made.btn.btn-success.btn-lg.p-3');
            if (startClaimButton) {
                setTimeout(function() {
                    startClaimButton.click();
                }, 3000);
            }
        }
    }

    function clickClaimNow() {
        var claimNowButton = document.querySelector('button#requestdaily.btn.btn-success.pulsen3');
        if (claimNowButton && !claimNowButton.disabled) {
            claimNowButton.click();
        }
    }
function clickClaimNow1() {
    var claimNowButton = document.querySelector('button.btn.btn-success');
    claimNowButton.click();
}

function waitForRecaptchaAndClickClaim() {
    var claimNowButton = document.querySelector('button.btn.btn-success');

    var recaptchaInterval = setInterval(function() {
        if (grecaptcha && grecaptcha.getResponse().length > 0) {
            clearInterval(recaptchaInterval);
            setTimeout(clickClaimNow1, 3000);
        }
    }, 1000);
}

window.addEventListener('load', waitForRecaptchaAndClickClaim);

    var currentUrl = window.location.href;

    if (currentUrl === "https://yoofaucet.com/") {
        window.location.href = "https://yoofaucet.com/?ref=9058";
    } else if (currentUrl === "https://yoofaucet.com/?ref=9058") {
        fillEmailAndClickStartClaim();
    }
    waitForRecaptchaAndClickClaim();

    clickClaimNow();

        function reloadPage() {
        setTimeout(function() {
            location.reload();
        }, 2 * 60 * 1000);
    }

    reloadPage();
})();