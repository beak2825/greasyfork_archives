// ==UserScript==
// @name         Altcryp.com auto faucet
// @namespace    bekerja pada tampermonkey maupun violentmonkey
// @version      0.4
// @description  Automatically login and click faucet
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        window.onurlchange
// @grant        GM_registerMenuCommand
// @require      https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match        https://altcryp.com/*
// @license      Copyright OjoNgono
// @antifeature  referral-link Directs to a referral link when not logged in
// @downloadURL https://update.greasyfork.org/scripts/508083/Altcrypcom%20auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/508083/Altcrypcom%20auto%20faucet.meta.js
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

    const rotateUrls = () => {
    const isLoggedIn = document.querySelector("#logoutModal") !== null;
    const baseUrl = "https://altcryp.com/";

    if (window.location.href.startsWith(baseUrl) && isLoggedIn) {
        const urls = [
            "https://altcryp.com/faucet/currency/ltc",
            "https://altcryp.com/faucet/currency/usdt",
            "https://altcryp.com/faucet/currency/bnb",
            "https://altcryp.com/faucet/currency/bch",
            "https://altcryp.com/faucet/currency/dash",
            "https://altcryp.com/faucet/currency/doge",
            "https://altcryp.com/faucet/currency/dgb",
            "https://altcryp.com/faucet/currency/matic",
            "https://altcryp.com/faucet/currency/sol",
            "https://altcryp.com/faucet/currency/trx",
            "https://altcryp.com/faucet/currency/xrp",
            "https://altcryp.com/faucet/currency/zec",
            "https://altcryp.com/faucet/currency/pepe",
            "https://altcryp.com/faucet/currency/shib",
            "https://altcryp.com/faucet/currency/ton"
        ];

        let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;

        window.location.href = urls[currentIndex];

        currentIndex = (currentIndex + 1) % urls.length;
        localStorage.setItem('currentIndex', currentIndex);
    } else if (!isLoggedIn) {
    }
};

    window.addEventListener('load', () => {
        const email = cfg.get('Email');
        if (!email || email.trim() === '') {
            enforceLogoutWithWarning();
        } else {
            enforceReferralUrl();
            setTimeout(() => {
                clickLoginRegisterButton();
            }, 2000);

            const loginInterval = setInterval(() => {
                handleLoginPopup();
            }, 1000);



            setTimeout(() => {
                clearInterval(loginInterval);
                if (document.querySelector("#logoutModal")) {
                    rotateUrls();
                    checkTurnstileAndClick();
                }
            }, 10000);
        }
    });

    function enforceReferralUrl() {
    const loggedIn = document.querySelector("#logoutModal");
    if (loggedIn) {
        return;
    }
    if (window.location.href === "https://altcryp.com/" && !window.location.href.includes("?r=25413")) {
        window.location.replace("https://altcryp.com/?r=25413");
    }
}

    function enforceLogoutWithWarning() {
        const loggedIn = document.querySelector("#logoutModal");
        if (loggedIn) {
            alert('Please enter your email in the settings menu before using my script.');
            const logoutButton = document.querySelector('a[href="https://altcryp.com/auth/logout"]');
            if (logoutButton) {
                logoutButton.click();
            } else {
                window.location.replace("https://altcryp.com/auth/logout");
            }
        }
    }

    function clickLoginRegisterButton() {
        const loginButton = document.querySelector('span.mb-0');
        if (loginButton && loginButton.textContent.includes('Login / Register')) {
            loginButton.click();
        }
    }

    function handleLoginPopup() {
    setTimeout(() => {
        const modal = document.querySelector('#login');
        if (modal && modal.classList.contains('show')) {
            const emailInput = document.querySelector('#InputEmail');
            if (emailInput) {
                emailInput.value = cfg.get('Email');
            }

            const loginButton = document.querySelector('button[type="submit"].d-flex.align-items-center.btn.btn-outline.border.text-secondary');
            const checkTurnstileAndLogin = setInterval(() => {
                const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
                if (turnstileResponse && turnstileResponse.value.trim().length > 0) {
                    loginButton.click();
                    clearInterval(checkTurnstileAndLogin);
                }
            }, 1000);
        }
    }, 1500);
}


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
        let turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
        return turnstileResponse && turnstileResponse.value !== '';
    }

    function checkRecaptcha() {
        let recaptchaFrame = document.querySelector("iframe[title='reCAPTCHA']");
        if (recaptchaFrame) {
            return window.grecaptcha.getResponse().length !== 0;
        }
        return false;
    }

    function clickClaimNow() {
        let claimNowButton = document.querySelector('#subbutt');
        if (claimNowButton && claimNowButton.innerText.includes('Claim Now')) {
            claimNowButton.click();
        }
    }

    function clickUnlock() {
        let unlockButton = document.querySelector('button.btn.btn-primary.w-md');
        if (unlockButton && unlockButton.innerText.includes('Unlock')) {
            unlockButton.click();
        }
    }

    let intervalId = setInterval(function() {
        if (checkTurnstile() || checkRecaptcha()) {
            clickClaimNow();
            clickUnlock();
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        }
    }, 1000);
    let timeoutId = setTimeout(function() {
        clickClaimNow();
        clickUnlock();
        clearInterval(intervalId);
    }, 25000);

    function checkForMessage() {
        const swalContainer = document.querySelector('#swal2-html-container');
        if (swalContainer && swalContainer.style.display === 'block') {
            const pageText = swalContainer.innerText || "";
            const successMessage1 = "has been sent to your FaucetPay account!";
            const successMessage2 = "has been added to your Main account!";
            const invalidCaptchaMessage = "Invalid Captcha";
            setTimeout(() => {
                const cleanedText = cleanText(pageText);
                if (cleanedText.includes(successMessage1) || cleanedText.includes(successMessage2) || cleanedText.includes(invalidCaptchaMessage)) {
                    window.location.replace("https://altcryp.com/");
                } else {
                }
            }, 1000);
        } else {
        }
    }

    function cleanText(text) {
        return text.replace(/\s+/g, ' ').trim();
    }

    setInterval(checkForMessage, 1000);

})();
