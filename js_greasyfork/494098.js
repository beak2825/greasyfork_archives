// ==UserScript==
// @name         blogsward.com/earn/ ( NOT PAYING )
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Faucet Claim
// @author       Gysof
// @match        https://blogsward.com/earn/*
// @icon         https://blogsward.com/public/images/favicon/android-chrome-384x384.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494098/blogswardcomearn%20%28%20NOT%20PAYING%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494098/blogswardcomearn%20%28%20NOT%20PAYING%20%29.meta.js
// ==/UserScript==

// Register here - https://blogsward.com/earn?ref=h4ssEdYQVBfJ
// hcaptcha solver. https://chromewebstore.google.com/detail/captcha-solver-auto-hcapt/hlifkpholllijblknnmbfagnkjneagid
// Editar email e pass linha 20 - 21

(function() {
    'use strict';
	
	// Define o email e a senha
    let userEmail = 'Your@Email'; // Substitua com seu email
    let userPassword = 'YourPassword'; // Substitua com sua senha

    function fillLoginForm() {
        var emailInput = document.querySelector('input.form-control[name="email"]');
        var passwordInput = document.querySelector('input.form-control[name="password"]');
        var loginButton = document.querySelector('.w-100.btn.btn-lg.btn-form.mt-3');

        if (emailInput && passwordInput) {
            emailInput.value = userEmail;
            passwordInput.value = userPassword;

            if (loginButton) {
                loginButton.click();
            }
        }
    }

    function waitForhCaptchaCompletion() {
        return new Promise(resolve => {
            var checkResponseInterval = setInterval(() => {
                var iframe = document.querySelector('.h-captcha iframe[data-hcaptcha-response]');
                if (iframe) {
                    var response = iframe.getAttribute('data-hcaptcha-response');
                    if (response) {
                        clearInterval(checkResponseInterval);
                        resolve(response);
                    }
                }
            }, 100);
        });
    }

    async function invokehCaptchaAndClaimReward() {
        var response = await waitForhCaptchaCompletion();

        var claimButton = document.querySelector('.btn.btn-primary.btn-custom');
        if (claimButton) {
            claimButton.click();

            setInterval(function() {
                location.reload();
            }, 5 * 60 * 1000);
        }
    }

    if (window.location.href === 'https://blogsward.com/earn/') {
        window.location.href = 'https://blogsward.com/earn/login';
    }

    if (window.location.href === 'https://blogsward.com/earn/login') {
        var waitForElementsInterval = setInterval(function() {
            var emailInput = document.querySelector('input.form-control[name="email"]');
            var passwordInput = document.querySelector('input.form-control[name="password"]');
            var loginButton = document.querySelector('.w-100.btn.btn-lg.btn-form.mt-3');
            if (emailInput && passwordInput && loginButton) {
                fillLoginForm();
                clearInterval(waitForElementsInterval);
            }
        }, 100);
    }

    if (window.location.href === 'https://blogsward.com/earn/home') {
        window.location.href = 'https://blogsward.com/earn/faucet';
    }

    if (window.location.href === 'https://blogsward.com/earn/faucet') {
        invokehCaptchaAndClaimReward();
    }

})();
