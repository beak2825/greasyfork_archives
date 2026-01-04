// ==UserScript==
// @name         BigBtc
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       White
// @match        https://bigbtc.win/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bigbtc.win
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476075/BigBtc.user.js
// @updateURL https://update.greasyfork.org/scripts/476075/BigBtc.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function fillAddressAndSubmit() {
        const address = "";
        const addressInput = document.querySelector('input[name="address"]');
        const enterButton = document.querySelector('input[value="ENTER"]');

        if (addressInput && enterButton) {
            addressInput.value = address;

            setTimeout(function () {
                enterButton.click();
            }, 10000);
        }
    }

    const currentURL = window.location.href;
    if (currentURL === 'https://bigbtc.win' || currentURL === 'https://bigbtc.win/') {
        window.location.href = 'https://bigbtc.win/?id=48581969';
    } else if (currentURL === 'https://bigbtc.win/?id=48581969') {
        window.onload = function () {
            fillAddressAndSubmit();
        };
    } else if (currentURL.includes('/faucet')) {
        function scrollToBottom() {
            window.scrollBy(0, window.innerHeight);
        }

        window.onload = function () {
            scrollToBottom();
            setInterval(verificarRespostaHcaptcha, 5000);

            function verificarRespostaHcaptcha() {
                var iframe = document.querySelector('.h-captcha iframe[data-hcaptcha-response]');

                if (iframe) {
                    var response = iframe.getAttribute('data-hcaptcha-response');
                    if (response) {
                        setTimeout(function () {
                            const claimButton = document.querySelector('#claimbutn');

                            if (claimButton) {
                                claimButton.click();
                            }
                        }, 3000);
                    }
                }
            }

        };
    }
})();


