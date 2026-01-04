// ==UserScript==
// @name         Auto Login | Auto Claim [ onlyfaucet.com ]
// @namespace    Terminator.Scripts
// @version      0.2
// @description  OnlyFaucet Automat
// @author       TERMINATOR
// @license      MIT
// @match        https://onlyfaucet.com/*
// @match        https://scripts.cs2resellers.com/ads/?onlyfaucet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlyfaucet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483860/Auto%20Login%20%7C%20Auto%20Claim%20%5B%20onlyfaucetcom%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/483860/Auto%20Login%20%7C%20Auto%20Claim%20%5B%20onlyfaucetcom%20%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var email = "HERE";
    var preferedCoin = "ltc"

    if (email === "HERE") return alert("Please fill your email!");

    function waitForElement(selector, callback) {
        var intervalId = setInterval(function () {
            var element = document.querySelector(selector);
            if (element) {
                clearInterval(intervalId);
                callback(element);
            }
        }, 500);
    }

    function login() {
        document.querySelector('[data-target="#login"]').click();

        waitForElement('input[name="wallet"]', function(emailInput) {
            emailInput.value = email;
            document.querySelector('form.user').submit();
        });
    }

    function claim() {
        waitForElement("#subbutt", function(element) {
            element.click();
        });
    }

    function handlePage() {
        if (window.location.href.startsWith("https://scripts.cs2resellers.com/ads/?onlyfaucet")) {
            setTimeout(function() {
                window.location.href = "https://onlyfaucet.com/";
            }, 60000);
        } else if (window.location.href.startsWith(`https://onlyfaucet.com/faucet/currency/${preferedCoin}`)) {
            setTimeout(() => {
                claim();
                setTimeout(() => {
                    window.location.href = "https://scripts.cs2resellers.com/ads/?onlyfaucet";
                }, 5000);
            }, 15000);
        } else if (window.location.href.startsWith("https://onlyfaucet.com/")) {
            var loginForm = document.querySelector('[data-target="#login"]');

            if (loginForm) {
                login();
            } else {
                window.location.href = `https://onlyfaucet.com/faucet/currency/${preferedCoin}`;
            }
        }
    }

    window.addEventListener('load', function() {
        handlePage();
        setInterval(() => {
            handlePage();
        }, 5000);
    })

})();
