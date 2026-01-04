// ==UserScript==
// @name         cryptobigpay.online
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Faucet claim
// @author       Gysof
// @match        https://cryptobigpay.online/*
// @icon         https://cryptobigpay.online/assets/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494525/cryptobigpayonline.user.js
// @updateURL https://update.greasyfork.org/scripts/494525/cryptobigpayonline.meta.js
// ==/UserScript==

// Register here - https://cryptobigpay.online/?r=25000
// You will need Hcaptcha solver - link - https://chromewebstore.google.com/detail/captcha-solver-auto-hcapt/hlifkpholllijblknnmbfagnkjneagid?hl=pt-PT
// You will need AB Links Solver - I recommend mbsolver
// Editar email e pass linha 21 - 22

(async function() {
    'use strict';

    // Editar email e senha
    const email = "Your@Email"; // Substitua com seu email
    const senha = "YouPassword"; // Substitua com sua senha

    function pr() {
        document.querySelector('#email.form-control').value = email;
        document.querySelector('#password.form-control').value = senha;
    }

    function en() {
        document.querySelector('.btn.btn-primary.btn-block.waves-effect.waves-light.a1').click();
    }

    const ca = async () => {
        while (!(grecaptcha && grecaptcha.getResponse().length > 0)) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    function ve() {
        const v = document.getElementById('antibotlinks').value.replace(/\s/g, '');
        return v.length === 12;
    }

    const lo = async () => {
        while (document.readyState !== 'complete') {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    function re() {
        document.querySelector('.btn.btn-primary.btn-lg.claim-button.a1').click();
    }

    const relo = () => {
        setTimeout(() => {
            window.location.reload();
        }, 5 * 60 * 1000); 
    };

    const rf = () => {
        if (window.location.href === "https://cryptobigpay.online/dashboard") {
            window.location.href = "https://cryptobigpay.online/faucet";
        }
    };

    function hc() {
        const ifr = document.querySelector('.h-captcha iframe[data-hcaptcha-response]');
        if (ifr) {
            const r = ifr.getAttribute('data-hcaptcha-response');
            if (r) {
                return true;
            }
        }
        return false;
    }

    function np() {
        if (ve() && hc()) {
            re();
            relo();
        }
    }

    window.addEventListener('load', async function() {
        if (window.location.href === "https://cryptobigpay.online/") {
            window.location.href = "https://cryptobigpay.online/login";
        }

        if (window.location.href === "https://cryptobigpay.online/login") {
            pr();
            await ca();
            en();
        }

        if (window.location.href === "https://cryptobigpay.online/faucet") {
            await lo();

            setInterval(function() {
                if (window.location.href.includes("/faucet")) {
                    np();
                }
            }, 3000);
        }

        rf();
    });

})();
