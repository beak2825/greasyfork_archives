// ==UserScript==
// @name         keforcash.com
// @namespace    keforcash.com
// @version      0.2
// @description  keforcash
// @author       LTW
// @match        https://keforcash.com/*
// @license      none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keforcash.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495310/keforcashcom.user.js
// @updateURL https://update.greasyfork.org/scripts/495310/keforcashcom.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
        return;
    }

    const login = '';
    const senha = '';
    const redirecionamento = 'https://keforcash.com/faucet';

    if (window.location.href === 'https://keforcash.com/') {
        window.location.href = 'https://keforcash.com/login';
    }

    if (window.location.href === 'https://keforcash.com/dashboard') {
        window.location.href = 'https://keforcash.com/faucet';
    }

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const select = selector => document.querySelector(selector);
    const selectValue = selector => select(selector)?.value?.replace(/\s/g, '');
    const currentURL = window.location.href;
    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');
    const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;
    if (wasButtonClicked()) {
        removeButtonClicked();
        window.location.href = redirecionamento;
    }
    if (currentURL.includes('/login')) {
        document.getElementsByName("email")[0].value = login;
        document.getElementsByName("password")[0].value = senha;
        const checkTurnstileInput = setInterval(async () => {
            const turnstileInput = document.querySelector('.cf-turnstile input');
            if (turnstileInput?.value) {
                clearInterval(checkTurnstileInput);
                document.querySelector('.login100-form-btn.btn.btn-primary.fw-bold').click();
            }
        }, 2000);
    }
    setInterval(function() {

    if (window.location.href.includes("/faucet") && grecaptcha && grecaptcha.getResponse().length !== 0 && mbsolver() && !wasButtonClicked()) {
        const submitButton = document.querySelector('button[type="submit"]');

        if (submitButton && !submitButton.disabled) {
            submitButton.click();
            setButtonClicked();
        }
    }
}, 3000);


})();
