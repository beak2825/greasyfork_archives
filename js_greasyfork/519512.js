// ==UserScript==
// @name         Coinmedia.in/ auto faucet
// @namespace    bekerja pada tampermonkey maupun violentmonkey
// @version      0.2
// @description  Automatically Login and Handle Faucet Pages
// @author       Ojo Ngono
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match        https://coinmedia.in/*
// @license      Copyright OjoNgono
// @antifeature  referral-link Directs to a referral link when not logged in
// @downloadURL https://update.greasyfork.org/scripts/519512/Coinmediain%20auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/519512/Coinmediain%20auto%20faucet.meta.js
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

(function () {
    'use strict';

    const savedEmail = cfg.get('Email');

    if (!savedEmail) {
        alert("Silakan masukkan Email Faucetpay di menu pengaturan untuk melanjutkan.");
        return;
    }

    const fillEmail = () => {
        const emailInput = document.querySelector('input[placeholder="Connect Your FaucetPay Email"]');
        if (emailInput) {
            emailInput.value = savedEmail;
        }
    };

    const waitAndClickButton = () => {
        const interval = setInterval(() => {
            const button = document.querySelector('button.btn.btn-danger');
            if (button) {
                if (!button.disabled) {
                    button.click();
                    clearInterval(interval);
                }
            }
        }, 500);
    };

    const checkForMessageAndRedirect = () => {
    const swalTitle = document.querySelector('.swal2-title');
    const swalContent = document.querySelector('.swal2-html-container');
    const successMessage = "Your wallet was successfully linked";
    const insufficientFundsMessage1 = "The faucet does not have sufficient funds for this transaction.";
    const insufficientFundsMessage2 = "You are sending an invalid amount of payment to the user.";
    const insufficientFundsMessage3 = "You have been rate-limited. Please try again in a few seconds.";

    const urls = [
        "https://coinmedia.in/auto/currency/ltc",
        "https://coinmedia.in/auto/currency/bnb",
        "https://coinmedia.in/auto/currency/bch",
        "https://coinmedia.in/auto/currency/dash",
        "https://coinmedia.in/auto/currency/doge",
        "https://coinmedia.in/auto/currency/dgb",
        "https://coinmedia.in/auto/currency/eth",
        "https://coinmedia.in/auto/currency/fey",
        "https://coinmedia.in/auto/currency/trx",
        "https://coinmedia.in/auto/currency/usdt",
        "https://coinmedia.in/auto/currency/sol",
        "https://coinmedia.in/auto/currency/xrp",
        "https://coinmedia.in/auto/currency/xlm",
        "https://coinmedia.in/auto/currency/ada",
        "https://coinmedia.in/auto/currency/usdc",
        "https://coinmedia.in/auto/currency/zec",
        "https://coinmedia.in/auto/currency/xmr"
    ];

    if (swalTitle && swalTitle.innerText === "Success!" && swalContent && swalContent.innerText.includes(successMessage)) {
        window.location.href = urls[0];
        return;
    }

    if (swalContent && (swalContent.innerText.includes(insufficientFundsMessage1) || swalContent.innerText.includes(insufficientFundsMessage2) || swalContent.innerText.includes(insufficientFundsMessage3))) {
        const currentPath = window.location.pathname;
        const currentIndex = urls.findIndex(url => url.includes(currentPath.split('/').pop()));

        if (currentIndex >= 0 && currentIndex < urls.length - 1) {
            window.location.href = urls[currentIndex + 1];
        }
    }
};

    const checkTurnstile = () => {
        let turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
        return turnstileResponse && turnstileResponse.value !== '';
    };

    const checkTurnstileAndUnlock = () => {
        if (window.location.href === "https://coinmedia.in/firewall") {
            const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
            const unlockButton = document.querySelector('button[style*="background-color: #00008B"]');

            if (turnstileResponse && turnstileResponse.value !== '' && unlockButton) {
                unlockButton.click();
            }
        }
    };

    const handleDashboardRedirect = () => {
        if (window.location.href === "https://coinmedia.in/dashboard") {
            if (!window.localStorage.getItem("redirected")) {
                window.localStorage.setItem("redirected", "true");
                window.location.href = "https://coinmedia.in/?r=10245";
            }
            return;
        }

        if (window.location.href === "https://coinmedia.in/?r=10245") {
            window.localStorage.removeItem("redirected");
        }
    };

    setTimeout(() => {
        handleDashboardRedirect();

        fillEmail();

        waitAndClickButton();

        setInterval(checkForMessageAndRedirect, 2000);

       setInterval(checkTurnstileAndUnlock, 1000);
    }, 3000);
})();
