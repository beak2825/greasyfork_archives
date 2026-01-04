// ==UserScript==
// @name         autofaucet.dutchycorp.space
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  dutchycorp!
// @author       LTW
// @license      none
// @match        https://autofaucet.dutchycorp.space/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dutchycorp.space
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496401/autofaucetdutchycorpspace.user.js
// @updateURL https://update.greasyfork.org/scripts/496401/autofaucetdutchycorpspace.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const redirecionamento = "https://faucetcrypto.com/dashboard";
    const email = "";
    const senha = "";

if (window.location.href === 'https://autofaucet.dutchycorp.space/dashboard.php' || window.location.href === 'https://autofaucet.dutchycorp.space/dashboard.php/') {
window.location.href = 'https://autofaucet.dutchycorp.space/roll.php';}
if (window.location.href === 'https://autofaucet.dutchycorp.space/' || window.location.href === 'https://autofaucet.dutchycorp.space') {
window.location.href = 'https://autofaucet.dutchycorp.space/login.php';}
    if (window.location.href.includes("/login")) {
          document.getElementsByName("username")[0].value = email;
          document.getElementsByName("password")[0].value = senha;

                let buttonClicked = false;

                const checkAndClick = () => {
                    if (!buttonClicked && grecaptcha && grecaptcha.getResponse().length !== 0) {
                        const logInButton = document.querySelector('[type="submit"]');
                        if (logInButton) {
                            logInButton.click();
                            buttonClicked = true;
                        }
                    }
                    setTimeout(checkAndClick, 1000);
                };

                setTimeout(checkAndClick, 5000);
            }
 if (window.location.href === 'https://autofaucet.dutchycorp.space/login.php') {}
setTimeout(function () {location.reload();}, 120000);
    function clickUnlockAndWait() {
        var intervalId = setInterval(function() {
            if (document.querySelector('.iconcaptcha-modal__body-title').textContent.trim() === 'Verification complete.') {
                clearInterval(intervalId);
                var unlockButton = document.getElementById('unlockbutton');
                if (unlockButton) {
                    setTimeout(function() {
                        unlockButton.click();

                        var intervalId2 = setInterval(function() {
                            var sendIcon = document.querySelector('#claim_boosted .material-icons.right');
                            if (sendIcon && sendIcon.offsetParent !== null) {
                                clearInterval(intervalId2);
                                setTimeout(function() {
                                    sendIcon.click();
                                }, Math.floor(Math.random() * 5000) + 500);
                            }
                        }, 1000);
                    }, Math.floor(Math.random() * 6000) + 1000);
                }
            }
        }, 1000);
    }

    function checkTimerAndRedirect() {
        var timerElement = document.querySelector('p > b#timer');
        if (timerElement) {
            if (window.location.href === "https://autofaucet.dutchycorp.space/roll.php") {
                window.location.href = "https://autofaucet.dutchycorp.space/coin_roll.php";
            } else if (window.location.href === "https://autofaucet.dutchycorp.space/coin_roll.php") {
                window.location.href = redirecionamento;
            }
        }
    }

    setTimeout(checkTimerAndRedirect, 5000);

    clickUnlockAndWait();

})();
