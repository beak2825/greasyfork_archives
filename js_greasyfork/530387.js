// ==UserScript==
// @name         Auto Redirect Script
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Auto redirection script for use with Auto CAPTCHA Solver extension on Nitro Type
// @author       Aratox
// @match        https://www.nitrotype.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530387/Auto%20Redirect%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/530387/Auto%20Redirect%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let captchaActive = false;
    let racePageStayDuration = 120000;
    let racePageTimer;

    function checkCaptchaMessage() {
        const captchaMessage = document.body.innerText.includes('ERR: CAPTCHA IS NOT RESOLVED');
        if (captchaMessage && !captchaActive) {
            captchaActive = true;
            handleCaptcha();
        }
    }

    function handleCaptcha() {
        console.log("CAPTCHA detected. Redirecting to race page...");
        window.location.href = "https://www.nitrotype.com/race";
    }

    function checkIfCaptchaSolved() {
        const validatedMessage = document.querySelector('.tc-i');
        if (validatedMessage && validatedMessage.innerText.includes("Validated! Play on.")) {
            console.log("CAPTCHA validated! Redirecting to garage...");
            window.location.href = "https://www.nitrotype.com/garage";
        } else {
            setTimeout(checkIfCaptchaSolved, 1000);
        }
    }

    function autoClickContinueButton() {
        const continueButton = document.querySelector('button.btn.btn--primary.btn--fw');
        if (continueButton) {
            console.log("Continue button found. Clicking it...");
            continueButton.click();

            setTimeout(() => {
                console.log("Redirecting to garage after clicking continue...");
                window.location.href = "https://www.nitrotype.com/garage";
            }, 1000);
        } else {
            setTimeout(autoClickContinueButton, 1000);
        }
    }

    function redirectToGarageAfterDelay() {
        console.log("Staying on race page for 2 minutes. Redirecting to garage...");
        window.location.href = "https://www.nitrotype.com/garage";
    }

    function checkIfRacePage() {
        if (window.location.pathname === "/race") {
            console.log("On race page. Checking if CAPTCHA is solved to redirect to garage...");
            checkIfCaptchaSolved();
            autoClickContinueButton();

            racePageTimer = setTimeout(redirectToGarageAfterDelay, racePageStayDuration);
        } else {
            clearTimeout(racePageTimer);
        }
    }

    setInterval(checkCaptchaMessage, 1000);

    window.addEventListener('load', checkIfRacePage);

})();
