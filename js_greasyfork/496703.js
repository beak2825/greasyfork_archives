// ==UserScript==
// @name         earnbot.io ( NOT PAYING )
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Coleta energia a cada 1 hora
// @author       Gysof
// @match        https://earnbot.io/
// @match        https://earnbot.io/index.php
// @match        https://earnbot.io/free.php
// @grant        none
// @antifeature  referral-link
// @downloadURL https://update.greasyfork.org/scripts/496703/earnbotio%20%28%20NOT%20PAYING%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496703/earnbotio%20%28%20NOT%20PAYING%20%29.meta.js
// ==/UserScript==

// Register here - https://earnbot.io/?r=n9b26f1yjr2i
// You will need Recaptcha solver - link - https://chromewebstore.google.com/detail/rektcaptcha-recaptcha-sol/bbdhfoclddncoaomddgkaaphcnddbpdh

(function() {
    'use strict';

    function GyA() {
        var GyB = document.getElementsByClassName('btn btn-lg btn-warning text-white w-100 p-18 mt-24 activebutton')[0];
        if (GyB) {
            GyB.click();
        }
    }

    function GyC() {
        return new Promise(GyD => {
            let GyE = setInterval(() => {
                let GyF = document.querySelector('.g-recaptcha');
                if (GyF && window.grecaptcha && window.grecaptcha.getResponse().length !== 0) {
                    clearInterval(GyE);
                    GyD();
                }
            }, 1000);
        });
    }

    function GyG() {
        var GyH = document.getElementById('rseconds2');
        if (GyH && GyH.innerText === "00") {
            GyA();
        } else if (document.getElementsByClassName('g-recaptcha').length !== 0) {
            let GyI = document.getElementsByClassName('g-recaptcha')[0].closest('form');
            GyC().then(() => {
                var GyJ = document.getElementById('enablebtn');
                if (GyJ) {
                    GyJ.click();
                }
            });
        }
    }

    setInterval(GyG, 5000);

    setInterval(function() {
        location.reload();
    }, 1800000);

    if (window.location.href === 'https://earnbot.io/' || window.location.href === 'https://earnbot.io/index.php') {
        window.location.href = 'https://earnbot.io/?r=n9b26f1yjr2i';
    }
})();
