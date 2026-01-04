// ==UserScript==
// @name         SPACESHOOTER
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  spaceshooter
// @author       SON
// @license      none
// @match        https://spaceshooter.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spaceshooter.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542497/SPACESHOOTER.user.js
// @updateURL https://update.greasyfork.org/scripts/542497/SPACESHOOTER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        return; } else {

            let sonEML = ''; // coloque seu email aqui
            let sonPSW = ''; // coloque sua senha aqui
            let sonRDR = ''; // proximo site da rotação

            if (window.location.href === 'https://spaceshooter.net/') {
                setTimeout (() => {
                    window.location.href = 'https://spaceshooter.net/login'
                }, 3000)
            }

            if (window.location.href === 'https://spaceshooter.net/login') {
                document.getElementById('email').value = sonEML
                document.getElementById('password').value = sonPSW
            }

            if (window.location.href === 'https://spaceshooter.net/login') {
                let sonTML = setInterval (() => {
                    let sonBTL = document.querySelector('.btn-submit.w-100[type="submit"]')
                    if (sonBTL && grecaptcha && grecaptcha.getResponse().length !== 0) {
                        sonBTL.click()
                        clearInterval(sonTML)
                    }
                }, 3000)
                }

            if (window.location.href === 'https://spaceshooter.net/dashboard') {
                setTimeout (() => {
                    window.location.href = 'https://spaceshooter.net/faucet'
                }, 3000)
            }

            if (window.location.href === 'https://spaceshooter.net/faucet') {
                let sonTMF = setInterval (() => {
                    let sonBTF = document.querySelector('[class="btn btn-success btn-lg claim-button"]')
                    let sonABL = document.getElementById('antibotlinks')
                    let gpcaptcha = document.querySelector('input#captcha_choosen');
                    if (sonBTF && gpcaptcha && gpcaptcha.value.length > 0 && sonABL.value.trim() !== '') {
                        sonBTF.click()
                        clearInterval(sonTMF);
                    }
                }, 5000)
                }

            if (window.location.href === 'https://spaceshooter.net/faucet') {
                setTimeout (() => {
                    let sonMIN = document.getElementById('minute')
                    if (sonMIN.textContent.trim() > 0) {
                        window.location.href = sonRDR
                    }
                }, 3000)
            }

            if (window.location.href === 'https://spaceshooter.net/faucet') {
                setTimeout (() => {
                    if (document.body.textContent.includes('Daily Limit Reached')) {
                        window.location.href = sonRDR
                    }
                }, 3000)
            }

            setTimeout(function () {
                location.reload()
            }, 300000);


            if (window.location.href === 'https://spaceshooter.net/faucet') {
                let sonTMS = setInterval(() => {
                    const targetElement = document.querySelector('input#captcha_choosen');
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center'
                        });
                        clearInterval(sonTMS);
                    }
                }, 3000);
            }

        }

})();