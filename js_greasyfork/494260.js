// ==UserScript==
// @name         99faucet
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Faucet claim
// @author       Gysof
// @match        https://99faucet.com/*
// @icon         https://99faucet.com/matic.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494260/99faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/494260/99faucet.meta.js
// ==/UserScript==

// Register here - https://99faucet.com/?r=3396
// You will need Recaptcha solver - link - https://chromewebstore.google.com/detail/rektcaptcha-recaptcha-sol/bbdhfoclddncoaomddgkaaphcnddbpdh
// Editar email e pass nas linhas 23 - 24
// Reivindicar faucet a cada 1 minuto em (Free Faucet) ou sem tempo em (Unlimited Faucet)

(function() {
    'use strict';

    // Editar email e senha
    const email = "Your@Email"; // Substitua com seu email
    const senha = "YouPassword"; // Substitua com sua senha

    function GyVr() {
        return !!document.querySelector('iframe[title="reCAPTCHA"]');
    }

    function GyRcCp() {
        const GyRcInput = document.querySelector('.g-recaptcha-response');
        return GyRcInput && GyRcInput.value.trim() !== '';
    }

    function GyClBt() {
        const GyBt = document.querySelector('button[type="submit"]');
        if (GyBt) {
            GyBt.click();
        }
    }

    async function GyEsRcEClBt() {
        while (true) {
            if (GyVr() && GyRcCp()) {
                GyClBt();
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    function GyPeEs() {
        const GyEm = document.querySelector('#email');
        const GyPs = document.querySelector('#password');
        if (GyEm && GyPs) {
            GyEm.value = email;
            GyPs.value = senha;
        }
    }

    function GyRf() {
        if (location.href === 'https://99faucet.com/dashboard') {
            location.href = 'https://99faucet.com/faucet';
        }
    }

    function GyCc() {
        const GyClaimBtn = document.querySelector('button.claim-button');
        if (GyClaimBtn) {
            GyClaimBtn.click();
        }
    }

    async function GyEsRcCc() {
        while (true) {
            if (GyVr() && GyRcCp()) {
                GyCc();
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    function GyWa5s() {
        setTimeout(() => {
            GyEsRcCc().then(() => GyVrClBt());
        }, 5000);
    }

    async function GyVrClBt() {
        while (true) {
            const GyClaimBtn = document.querySelector('button.claim-button');
            if (!GyClaimBtn) {
                await new Promise(resolve => setTimeout(resolve, 180000));
                location.reload();
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    function GyRl() {
        setInterval(() => {
            location.reload();
        }, 180000);
    }

    function GyEs() {
        if (location.href === 'https://99faucet.com/') {
            location.href = 'https://99faucet.com/login';
        } else if (location.href === 'https://99faucet.com/login') {
            GyPeEs();
            GyEsRcEClBt();
        } else if (location.href === 'https://99faucet.com/dashboard') {
            GyRf();
        } else if (location.href === 'https://99faucet.com/faucet' || location.href === 'https://99faucet.com/notimer') {
            GyWa5s();
        }
    }

    function GyEns() {
        if (document.visibilityState === 'visible') {
            GyEs();
        } else {
            GyEs();
        }
    }

    document.addEventListener('visibilitychange', GyEns);
    window.addEventListener('load', GyEns);

    GyEs();
})();
