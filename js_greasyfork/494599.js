// ==UserScript==
// @name         claimcoin.in
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Shorts
// @author       Gysof
// @match        https://claimcoin.in/*
// @icon         https://claimcoin.in/theme/assets/images/btc.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494599/claimcoinin.user.js
// @updateURL https://update.greasyfork.org/scripts/494599/claimcoinin.meta.js
// ==/UserScript==

// Editar o email e senha linha 41 - 42

let idleTime = 0;
let redirectInterval;
const IDLE_THRESHOLD = 60;


(function() {
    'use strict';

    // Editar o email e senha
    const email = "seuemail@gmail.com";
    const senha = "senha";

    function fazerLogin() {
        const emailInput = document.querySelector('input#email.form-control');
        const senhaInput = document.querySelector('input#password.form-control');

        if (emailInput && senhaInput) {
            emailInput.value = email;
            senhaInput.value = senha;
            invokeReCaptcha('.login-form', 2);
        }
    }

    function waitForReCaptcha(callback) {
        let interval = setInterval(() => {
            if (document.getElementsByClassName('g-recaptcha').length !== 0 && window.grecaptcha.getResponse().length !== 0) {
                clearInterval(interval);
                callback();
            }
        }, 1000);
    }

    function invokeReCaptcha(selector, time) {
        if (document.getElementsByClassName('g-recaptcha').length !== 0) {
            let c = document.querySelector(selector);
            waitForReCaptcha(() => {
                formSubmit(c, time);
                setTimeout(() => {
                    document.querySelector('.btn.btn-dark.btn-block.w-100').click();
                }, 2000);
            });
        } else {
            formSubmit(selector, time);
        }
    }

    function formSubmit(form, time) {
        setTimeout(() => {
            form.querySelector('button[type="submit"]').click();
        }, time * 1000);
    }

    if (window.location.href === "https://claimcoin.in/") {
        window.location.href = "https://claimcoin.in/login";
    }

    if (window.location.href === "https://claimcoin.in/dashboard") {
        window.location.href = "http://linksfly.link/Claimcoin-in-links";
    }

    if (window.location.href === "https://claimcoin.in/login") {
        window.addEventListener('load', fazerLogin);
    }

    if (window.location.href === "https://claimcoin.in/links") {
        window.addEventListener('load', function() {
            console.log("Página e elementos carregados completamente na página de links.");
            let btnLinks = document.querySelector('.btn.w-100.btn-dark.waves-effect.waves-light');
            btnLinks.addEventListener('click', function(event) {
                event.preventDefault();
                let url = this.getAttribute('href');
                window.location.href = url;
            });
            btnLinks.click();
        });
    }

    function removerCartoes() {
        var cartoes = document.querySelectorAll('div[class="card "]');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("EarnNow") ||
                textoCartao.includes("RsShort") ||
                textoCartao.includes("Shrinkme") ||
                textoCartao.includes("ShrinkEarn")) {
                cartao.remove();
            }
        });
    }
    removerCartoes();

})();
