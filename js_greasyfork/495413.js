// ==UserScript==
// @name         free-bonk.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Faucet claim
// @author       Gysof
// @match        https://free-bonk.com/*
// @match        https://free-pepe.com/bonkfaucet/*
// @match        https://free-pepe.com/bonkfaucet
// @icon         https://free-bonk.com/assets/images/favicon.png
// @grant        none
// @criado       2024-05-18
// @modificado   2024-05-18
// @downloadURL https://update.greasyfork.org/scripts/495413/free-bonkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/495413/free-bonkcom.meta.js
// ==/UserScript==

// Register here https://free-bonk.com/?r=62187
// You will need IconCaptcha solver - link - https://crypdona.cybranceehost.com/
// Editar email e pass linha 26 - 27
// Reivindicar faucet a cada 1 minuto

(function() {
    'use strict';

	// Editar email e senha
    const email = 'Your@Email'; // Substitua com seu email
    const senha = 'YouPassword'; // Substitua com sua senha

    if (window.location.href === 'https://free-bonk.com/') {
        window.location.href = 'https://free-bonk.com/login';
    } else if (window.location.href === 'https://free-bonk.com/login') {
        window.addEventListener('load', () => {
            const GyEm = document.querySelector('input[name="email"]');
            const GySn = document.querySelector('input[name="password"]');

            if (GyEm && GySn) {
                GyEm.value = email;
                GySn.value = senha;
                GyWc('button[class="btn btn-primary btn-block w-100"][type="submit"]');
            }
        });
    } else if (window.location.href === 'https://free-bonk.com/dashboard') {
        window.location.href = 'https://free-bonk.com/faucet';
    } else if (window.location.href === 'https://free-bonk.com/faucet') {
        window.addEventListener('load', () => {
            GyBt();
        });
    } else if (window.location.href.startsWith('https://free-pepe.com/bonkfaucet/')) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                GyWc('#submitBtn.btn.bt1.btn-primary.btn-block');
            }, 10000);
            GyCh();
            GyCk();
        });
    }

    function GyWc(buttonSelector) {
        let GyIv = setInterval(() => {
            let GyTk = document.querySelector('input[name="_iconcaptcha-token"]');
            let GySc = document.querySelector('.iconcaptcha-success');
            if (GyTk && GySc) {
                clearInterval(GyIv);
                const GyBt = document.querySelector(buttonSelector);
                if (GyBt) {
                    GyBt.click();
                }
            }
        }, 3000);
    }

    function GyBt() {
        let GyCl = false;
        const GyBt = document.querySelector('a#refreshLink.btn.btn-danger.my-1.f-w-400.f-16');
        if (GyBt && !GyCl) {
            GyBt.click();
            GyCl = true;
            setTimeout(() => {
                GyCl = false;
            }, 4 * 60 * 1000);
        }
    }

    function GyCh() {
        let GyEv = setInterval(() => {
            const GyEr = document.querySelector('body');
            if (GyEr && GyEr.innerText.includes('CAPTCHA ERROR')) {
                clearInterval(GyEv);
                window.location.reload();
            }
        }, 1000);
    }

    const GyCA = () => {
        const GySA = document.querySelector('div.alert.text-center.alert-success');
        if (GySA) {
            const GyAT = GySA.innerText;
            if (GyAT.includes('you have been rewarded') || GyAT.includes('Invalid Session ,Go back to Partner website')) {
                setTimeout(() => { window.close(); }, 1000);
            }
        }
    };

    setInterval(GyCA, 4000);

})();
