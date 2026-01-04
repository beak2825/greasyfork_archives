// ==UserScript==
// @name         bnbfree.in [Auto Faucet] (WARNING, DO NOT DEPOSIT)
// @namespace    free.bnb.auto.faucet
// @version      0.1
// @description  https://bnbfree.in/?r=7942 : Made In Trinidad
// @author       stealtosvra
// @match        https://bnbfree.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=controlc.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486189/bnbfreein%20%5BAuto%20Faucet%5D%20%28WARNING%2C%20DO%20NOT%20DEPOSIT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/486189/bnbfreein%20%5BAuto%20Faucet%5D%20%28WARNING%2C%20DO%20NOT%20DEPOSIT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hCaptcha() {
        return window.grecaptcha && window.grecaptcha.getResponse().length !== 0;
    }

    function checkAndClickRollButton() {
        if (hCaptcha()) {
            var rollButton = document.getElementById('free_play_form_button');
            if (!rollButton) {
                rollButton = document.querySelector('.free_play_element.new_button_style.profile_page_button_style');
            }
            if (rollButton) {
                rollButton.click();
            } else {
                console.error('Unable to find the "ROLL!" button');
            }
        }
    }

    setInterval(checkAndClickRollButton, 10000);

    var countdownTimer = 300; // seconds
    var countdownInterval = setInterval(function() {
        countdownTimer--;

        if (countdownTimer <= 0) {
            redirectToWebsite();
            clearInterval(countdownInterval);
        }
    }, 1000);

    function redirectToWebsite() {
        window.location.href = 'https://bnbfree.in';
    }
})();
