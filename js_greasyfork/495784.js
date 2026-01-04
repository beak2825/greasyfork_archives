// ==UserScript==
// @name         memearns.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Faucet claim
// @author       Gysof
// @match        https://memearns.com/*
// @icon         https://memearns.com/public/morph/auth/img/logocolored.png
// @grant        none
// @criado       2024-05-22
// @modificado   2024-05-22
// @downloadURL https://update.greasyfork.org/scripts/495784/memearnscom.user.js
// @updateURL https://update.greasyfork.org/scripts/495784/memearnscom.meta.js
// ==/UserScript==

// Register here - https://memearns.com/?r=2071
// You will need Hcaptcha and Recaptcha solver - link - https://chromewebstore.google.com/detail/captcha-solver-auto-hcapt/hlifkpholllijblknnmbfagnkjneagid
// You will need AB Links Solver - I recommend mbsolver
// Editar email e pass linha 26 - 27
// Reivindicar faucet a cada 2 minutos em (Faucet) ou a cada 1 minuto em (1 Minute Faucet)

(function() {
    'use strict';

    // Editar email e senha
    const email = "Your@Email"; // Substitua com seu email
    const senha = "YouPassword"; // Substitua com sua senha

    if (window.location.href === "https://memearns.com/") {
        window.location.href = "https://memearns.com/login";
    } else if (window.location.href === "https://memearns.com/dashboard") {
        window.location.href = "https://memearns.com/faucet";
    }

    window.addEventListener('load', function() {
        if (window.location.href === "https://memearns.com/login") {
            document.getElementById('email').value = email;
            document.getElementById('password').value = senha;

            GyWr(GyCi);
        }
    });

    function GyWr(cb) {
        let GyIv = setInterval(() => {
            if (document.getElementsByClassName('g-recaptcha').length !== 0 && window.grecaptcha.getResponse().length !== 0) {
                clearInterval(GyIv);
                cb();
            }
        }, 1000);
    }

    function GyCi() {
        let GySb = document.querySelector('button.btn-submit.w-100[type="submit"]');
        if (GySb) {
            GySb.click();
        }
    }

    function GyVh() {
        var iframe = document.querySelector('.h-captcha iframe[data-hcaptcha-response]');
        if (iframe) {
            var response = iframe.getAttribute('data-hcaptcha-response');
            return response && response.trim() !== '';
        }
        return false;
    }

    function GyVa() {
        const GyAb = document.getElementById('antibotlinks');
        if (GyAb) {
            const GyAbv = GyAb.value.replace(/\s/g, '');
            return GyAbv.length === 12;
        }
        return false;
    }

    function GyCl() {
        setTimeout(() => {
            if (GyVh() && GyVa()) {
                let GyCb = document.querySelector('button.btn.solid_btn.btn-lg.text-white.claim-button');
                if (GyCb) {
                    GyCb.click();
                    if (window.location.href.includes("/faucet")) {
                        setTimeout(() => {
                            location.reload();
                        }, 150000);
                    } else if (window.location.href.includes("/notimer")) {
                        setTimeout(() => {
                            location.reload();
                        }, 60000);
                    }
                }
            }
        }, 5000);
    }

    function GyMn() {
        setInterval(() => {
            if ((window.location.href.includes("/faucet") || window.location.href.includes("/notimer")) && GyVh() && GyVa()) {
                GyCl();
            }
        }, 3000);
    }

    GyWr(GyCi);

    if (window.location.href.includes("/faucet") || window.location.href.includes("/notimer")) {
        setTimeout(GyMn, 5000);
    }
})();
