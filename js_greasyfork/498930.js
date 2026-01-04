// ==UserScript==
// @name         Aruble
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Collect Faucet
// @author       LTW
// @license      none
// @match        https://aruble.net
// @match        https://aruble.net/page/faucet/*
// @match        https://aruble.net/account/login/*
// @match        https://aruble.net/page/Check/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aruble.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498930/Aruble.user.js
// @updateURL https://update.greasyfork.org/scripts/498930/Aruble.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const email = '';
    const token = 'BTC';
    const redirecionamento = '';

    if(window.location.href.includes('/login/')){
        document.getElementById("address").value = email;
        const claimButton = document.getElementById('claim-button');
        setTimeout(function() {
            claimButton.click();
        }, 5 * 1000);
    }

    if(window.location.href === 'https://aruble.net/'){
        window.location.href = 'https://aruble.net/page/faucet/' + token;
    }

    (() => {
        if (window.location.href.includes('/Check/')) {
            let clicked1 = false;

            setInterval(function() {
                let reCaptchaResponse = "";

                const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
                if (reCaptchaTextarea) {
                    reCaptchaResponse = reCaptchaTextarea.value;
                }

                if (reCaptchaResponse && reCaptchaResponse.length !== 0) {
                    if (!clicked1) {
                        const button = document.querySelector('input[type="submit"].btn.btn-block.btn-primary[name="verification"][value="Verification"]');
                        if (button && !button.disabled) {
                            button.click();
                            clicked1 = true;
                        }
                    }
                }
            }, 3000);
        }
    })();

    if(window.location.href.includes('/faucet/')){
        let clicked = false;

        function getRandomDelay(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function clickClaimButton() {
            if (!clicked) {
                const pageText = document.body.innerText;

                const isError = pageText.includes('error');
                const isWait = pageText.includes('wait');
                const isReached = pageText.includes('reached');

                if (!isError && !isWait && !isReached) {
                    const claimButton = document.getElementById('claim-button');
                    if (claimButton && !claimButton.disabled) {
                        clicked = true;
                        claimButton.click();
                        const randomDelay = getRandomDelay(2000, 8000);
                        let reCaptchaResponse = "";
                        const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
                        if (reCaptchaTextarea) {
                            reCaptchaResponse = reCaptchaTextarea.value;
                        }
                       const intervalId = setInterval(function() {
                            const mbsolver = () => !!document.getElementById('antibotlinks').value.trim();

                            if (reCaptchaResponse && reCaptchaResponse.length !== 0) {
                                if (reCaptchaResponse && reCaptchaResponse.length !== 0 && mbsolver()) {
                                    var antibotButton = document.getElementById('id_antibot');
                                    if (antibotButton) {
                                        antibotButton.click();
                                        clearInterval(intervalId);
                                    }
                                }
                            }
                        }, randomDelay);
                    }
                } else {
                    setTimeout(function() {
                        window.location.href = redirecionamento;
                    }, 1000);
                }
            }
        }

            setTimeout(function() {
                window.location.reload();
            }, 5 * 60 * 1000);
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const pageText = document.body.innerText;
        const isError = pageText.includes('error');
        const isWait = pageText.includes('wait');
        const isReached = pageText.includes('reached');

        if (!isError && !isWait && !isReached) {
            setInterval(clickClaimButton, 1000);
        } else {
          window.location.href = redirecionamento;

        }
    }
})();