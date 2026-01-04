// ==UserScript==
// @name         freeth.in [Auto Faucet]
// @namespace    free.eth.auto.faucet
// @version      0.1
// @description  https://freeth.in/?r=26286 : Made in Trinidad
// @author       stealtosvra
// @match        https://freeth.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=controlc.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497398/freethin%20%5BAuto%20Faucet%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/497398/freethin%20%5BAuto%20Faucet%5D.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function hCaptcha() {return window.grecaptcha && window.grecaptcha.getResponse().length !== 0;}
    function checkAndClickRollButton() {
        if (hCaptcha()) {var rollButton = document.getElementById('free_play_form_button');
            if (!rollButton) {rollButton = document.querySelector('.free_play_element.new_button_style.profile_page_button_style');}
            if (rollButton) {rollButton.click();} else {console.error('Unable to find the "ROLL!" button');}}}
 
    setInterval(checkAndClickRollButton, 10000);
 
    var countdownTimer = 300; // seconds
    var countdownInterval = setInterval(function() {
        countdownTimer--;
 
        if (countdownTimer <= 0) {
            redirectToWebsite();
            clearInterval(countdownInterval);
        }
    }, 1000);
 
    function redirectToWebsite() {window.location.href = 'https://freeth.in';}
 
})();