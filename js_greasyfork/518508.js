// ==UserScript==
// @name           Linksfly.link auto faucet
// @namespace      bekerja pada tampermonkey maupun violentmonkey
// @version        0.13
// @description    Automatically Login and Click Faucet
// @author         Ojo Ngono
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @require        https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match          https://linksfly.link/*
// @license        Copyright Turske
// @antifeature    referral-link Directs to a referral link when not logged in
// @downloadURL https://update.greasyfork.org/scripts/518508/Linksflylink%20auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/518508/Linksflylink%20auto%20faucet.meta.js
// ==/UserScript==

const cfg = new MonkeyConfig({
    title: 'Input Email Faucetpay:',
    menuCommand: true,
    params: {
        Email: {
            label: "Email Faucetpay",
            type: "text",
            default: ''
        },
    }
});

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const email = cfg.get('Email');
        if (!email || email.trim() === '') {
            enforceLogoutWithWarning();
        } else {
            enforceReferralUrl();
            setTimeout(() => {
                if (isLoggedIn()) {
                    fillEmailField(email);
                    rotateUrls();
                }
            }, 1000);
        }
    });

    function isLoggedIn() {
        const userDropdownButton = document.querySelector('#page-header-user-dropdown');
        return userDropdownButton !== null;
    }

    function enforceLogoutWithWarning() {
        if (isLoggedIn()) {
            alert('Please enter your email in the settings menu before using MY SCRIPT (26 row).');
            const logoutButton = document.querySelector('a[href="https://linksfly.link/auth/logout"]');
            if (logoutButton) {
                logoutButton.click();
            } else {
                window.location.replace("https://linksfly.link/auth/logout");
            }
        }
    }

    function enforceReferralUrl() {
        if (window.location.href.startsWith("https://linksfly.link") && !window.location.href.includes("?r=12119")) {
            if (!isLoggedIn()) {
                window.location.replace("https://linksfly.link/?r=12119");
            }
        }
    }

    function fillEmailField(email) {
        const emailInput = document.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.value = email;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function isTurnstileCompleted() {
        return document.querySelector('input[name="cf-turnstile-response"]')?.value !== "";
    }

    function isEmailFilled() {
        const emailField = document.querySelector('input[type="email"]');
        return emailField && emailField.value.trim() !== "";
    }

    function clickLoginButton() {
        const loginButton = document.querySelector('button[type="submit"].btn-user');
        if (loginButton) {
            loginButton.click();
        }
    }

    const checkConditionsInterval = setInterval(function() {
        if (isTurnstileCompleted() && isEmailFilled()) {
            clearInterval(checkConditionsInterval);
            clickLoginButton();
        }
    }, 1000);

    const observer = new MutationObserver(() => {
        const emailInput = document.querySelector('input[type="email"]');
        if (emailInput) {
            const email = cfg.get('Email').trim();
            if (email) {
                fillEmailField(email);
            }
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const turnstileObserver = new MutationObserver(() => {
        const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
        if (turnstileResponse && turnstileResponse.value !== "") {
            clickLoginButton();
            turnstileObserver.disconnect();
        }
    });

    const turnstileInput = document.querySelector('input[name="cf-turnstile-response"]');
    if (turnstileInput) {
        turnstileObserver.observe(turnstileInput, { attributes: true, attributeFilter: ['value'] });
    }

    const urls = [
        "https://linksfly.link/faucet/currency/btc",
        "https://linksfly.link/faucet/currency/ltc",
        "https://linksfly.link/faucet/currency/bnb",
        "https://linksfly.link/faucet/currency/bch",
        "https://linksfly.link/faucet/currency/dash",
        "https://linksfly.link/faucet/currency/doge",
        "https://linksfly.link/faucet/currency/dgb",
        "https://linksfly.link/faucet/currency/eth",
        "https://linksfly.link/faucet/currency/fey",
        "https://linksfly.link/faucet/currency/sol",
        "https://linksfly.link/faucet/currency/trx",
        "https://linksfly.link/faucet/currency/usdt",
        "https://linksfly.link/faucet/currency/zec",
        "https://linksfly.link/faucet/currency/tara",
        "https://linksfly.link/faucet/currency/ada",
        "https://linksfly.link/faucet/currency/xmr",
        "https://linksfly.link/faucet/currency/xrp"
    ];

    let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;

    const rotateUrls = () => {
        if (window.location.href === "https://linksfly.link/" || window.location.href.includes("/dashboard")) {
            window.location.href = urls[currentIndex];
            currentIndex = (currentIndex + 1) % urls.length;
            localStorage.setItem('currentIndex', currentIndex);
        }
    };

    const scrollToButton = () => {
        const submitButton = document.querySelector("#subbutt");
        if (submitButton) {
            const isVisible = () => {
                const rect = submitButton.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            };
            if (!isVisible()) {
                submitButton.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    };
    scrollToButton();

    function checkTurnstile() {
        const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
        return turnstileResponse && turnstileResponse.value !== '';
    }

    function checkRecaptcha() {
        const recaptchaFrame = document.querySelector("iframe[title='reCAPTCHA']");
        if (recaptchaFrame) {
            return window.grecaptcha.getResponse().length !== 0;
        }
        return false;
    }

    function clickClaimNow() {
        const claimNowButton = document.querySelector('#subbutt');
        if (claimNowButton && claimNowButton.innerText.includes('Claim Now')) {
            claimNowButton.click();
        }
    }

    function clickUnlock() {
        const unlockButton = document.querySelector('button.btn.btn-primary.w-md');
        if (unlockButton && unlockButton.innerText.includes('Unlock')) {
            unlockButton.click();
        }
    }

    let intervalId = setInterval(() => {
        if (checkTurnstile() || checkRecaptcha()) {
            clickClaimNow();
            clickUnlock();
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        }
    }, 10000);

    let timeoutId = setTimeout(() => {
        clickClaimNow();
        clickUnlock();
        clearInterval(intervalId);
    }, 45000);

    function checkForMessage() {
    const swalContainer = document.querySelector('#swal2-html-container');
    const alertDanger = document.querySelector('.alert.alert-danger.text-center');
    const alertSuccess = document.querySelector('.alert.alert-success.text-center');
    if (swalContainer && swalContainer.style.display === 'block') {
        const pageText = swalContainer.innerText || "";
        const successMessage1 = "has been sent to your FaucetPay account!";
        const successMessage2 = "has been added to your Main account!";
        const successMessage3 = "The faucet does not have sufficient funds for this transaction.";
        const invalidCaptchaMessage = "Invalid Captcha";

        setTimeout(() => {
            if (pageText.includes(successMessage1) ||
                pageText.includes(successMessage2) ||
                pageText.includes(successMessage3) ||
                pageText.includes(invalidCaptchaMessage)) {
                    window.location.replace("https://linksfly.link/dashboard");
            }
        }, 1000);
    }

    if (alertDanger) {
        const alertText = alertDanger.innerText || "";
        const dailyLimitMessage = "Daily claim limit for this coin reached, please comeback again tomorrow.";

        setTimeout(() => {
            if (alertText.includes(dailyLimitMessage)) {
                window.location.replace("https://linksfly.link/dashboard");
            }
        }, 1000);
    }
}

setInterval(checkForMessage, 1000);

})();
