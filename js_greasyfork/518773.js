// ==UserScript==
// @name            Liteonion.online/instant Auto faucet
// @namespace       bekerja pada tampermonkey maupun violentmonkey
// @version         0.3
// @description     Automatically login and click faucet
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant           window.onurlchange
// @grant           GM_registerMenuCommand
// @require         https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match           https://liteonion.online/instant/*
// @icon            https://i.ibb.co.com/XJSPdz0/large.png
// @license         Copyright OjoNgono
// @antifeature     referral-link Directs to a referral link when not logged in
// @downloadURL https://update.greasyfork.org/scripts/518773/Liteoniononlineinstant%20Auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/518773/Liteoniononlineinstant%20Auto%20faucet.meta.js
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
                clickLoginRegisterButton();
            }, 1000);

            const loginInterval = setInterval(() => {
                if (handleLoginPopup()) {
                    clearInterval(loginInterval);
                }
            }, 1000);

            setTimeout(() => {
                if (document.querySelector("#logoutModal")) {
                    rotateUrls();
                    checkTurnstileAndClick();
                }
            }, 5000);
        }
    });

    function enforceReferralUrl() {
    const loggedIn = document.querySelector("#logoutModal");
    if (loggedIn) {
        return;
    }
    if (window.location.href === "https://liteonion.online/instant/" && !window.location.href.includes("?r=3638")) {
        window.location.replace("https://liteonion.online/instant/?r=3638");
    }
}


    function enforceLogoutWithWarning() {
        const loggedIn = document.querySelector("#logoutModal");
        if (loggedIn) {
            alert('Please enter your email in the settings menu before using my script.');
            const logoutButton = document.querySelector('a[href="https://liteonion.online/instant/auth/logout"]');
            if (logoutButton) {
                logoutButton.click();
            } else {
                window.location.replace("https://liteonion.online/instant/auth/logout");
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
        const modalTitle = document.querySelector('.modal-title');
        if (modalTitle && modalTitle.textContent.includes('Login')) {
            const emailInput = document.querySelector('#InputEmail');
            const loginButton = document.querySelector('button[type="submit"].d-flex.align-items-center.btn.btn-outline.border.text-secondary');
            if (emailInput && loginButton) {
                emailInput.value = cfg.get('Email');
                loginButton.click();
                return true;
            }
        }
        return false;
    }

    const urls = [
        "https://liteonion.online/instant/faucet/currency/ltc",
        "https://liteonion.online/instant/faucet/currency/doge",
        "https://liteonion.online/instant/faucet/currency/usdt",
        "https://liteonion.online/instant/faucet/currency/sol",
        "https://liteonion.online/instant/faucet/currency/trx",
        "https://liteonion.online/instant/faucet/currency/bnb",
        "https://liteonion.online/instant/faucet/currency/bch",
        "https://liteonion.online/instant/faucet/currency/dash",
        "https://liteonion.online/instant/faucet/currency/dgb",
        "https://liteonion.online/instant/faucet/currency/eth",
        "https://liteonion.online/instant/faucet/currency/fey",
        "https://liteonion.online/instant/faucet/currency/zec",
        "https://liteonion.online/instant/faucet/currency/matic",
        "https://liteonion.online/instant/faucet/currency/xmr"
    ];

    let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;
    const rotateUrls = () => {
        if (window.location.href === "https://liteonion.online/instant/") {
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
    let turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
    return turnstileResponse && turnstileResponse.value !== '';
}

function checkRecaptcha() {
    let recaptchaFrame = document.querySelector("iframe[title='reCAPTCHA']");
    if (recaptchaFrame && window.grecaptcha) {
        return window.grecaptcha.getResponse().length !== 0;
    }
    return false;
}

function checkHcaptcha() {
    let HcaptchaFrame = document.querySelector("iframe[src^='https://newassets.hcaptcha.com']");
    if (HcaptchaFrame && window.hcaptcha) {
        return window.hcaptcha.getResponse().length !== 0;
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
    if (checkTurnstile() || checkHcaptcha() || checkRecaptcha()) {
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
}, 15000);


    function checkForMessage() {
        const swalContainer = document.querySelector('#swal2-html-container');
        if (swalContainer && swalContainer.style.display === 'block') {
            const pageText = swalContainer.innerText || "";
            const successMessage1 = "The faucet does not have sufficient funds for this transaction.";
            const successMessage2 = "has been added to your Main account!";
            const invalidCaptchaMessage = "Invalid Captcha";
            setTimeout(() => {
                const cleanedText = cleanText(pageText);
                if (cleanedText.includes(successMessage1) || cleanedText.includes(successMessage2) || cleanedText.includes(invalidCaptchaMessage)) {
                    window.location.replace("https://liteonion.online/instant/");
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
