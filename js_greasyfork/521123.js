// ==UserScript==
// @name            Hofaucet.xyz AutoClaim Faucet
// @namespace       bekerja pada tampermonkey maupun violentmonkey
// @version         0.1
// @author          Ojo Ngono
// @description     Automatically Login and Click Faucet
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @require         https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match           https://hofaucet.xyz/*
// @icon            https://i.ibb.co.com/XJSPdz0/large.png
// @license         Copyright OjoNgono
// @antifeature     referral-link Directs to a referral link when not logged in
// @downloadURL https://update.greasyfork.org/scripts/521123/Hofaucetxyz%20AutoClaim%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/521123/Hofaucetxyz%20AutoClaim%20Faucet.meta.js
// ==/UserScript==

const cfg = new MonkeyConfig({
    title: 'Input Email Faucetpay:',
    menuCommand: true,
    params: {
        Announcements: {
            type: 'text',
            default: 'Input Email Faucetpay',
            long: 2
        },
        Email: {
            label: "EmailFaucetpay",
            type: "text",
            default: ''
        }
    }
});

(function() {
    'use strict';

    const email = cfg.get('Email');
    const loggedIn = document.querySelector('a.nav-link[data-target="#logoutModal"]');

    function isLoggedIn() {
    const logoutButton = document.querySelector('a.nav-link[data-target="#logoutModal"]');
    return logoutButton !== null;
}


    function enforceReferralUrl() {
    if (!isLoggedIn() && window.location.href === "https://hofaucet.xyz/" && !window.location.href.includes("?r=1878")) {
        window.location.replace("https://hofaucet.xyz/?r=1878");
    }
}

    let enforceReferralInterval = setInterval(() => {
    if (!isLoggedIn()) {
        enforceReferralUrl();
    } else {
        clearInterval(enforceReferralInterval);
    }
}, 1000);


    window.addEventListener('load', () => {
        GM_addStyle(`label[for="Timeout"] {white-space: pre-wrap;}`);
        if (loggedIn) {
            if (!email) {
                alert("Please enter your FaucetPay email in the SETTINGS MENU.");
                forceLogout();
            } else {
                rotateUrls();
            }
        } else {
            if (email) {
                fillLoginForm(email);
            }
        }
    });

    function fillLoginForm(email) {
        const form = document.querySelector('form.user');
        if (form) {
            const emailInput = form.querySelector('input[name="wallet"]');
            if (emailInput) {
                emailInput.value = email;
            }
            const loginButton = form.querySelector('button[type="submit"]');
            if (loginButton) {
                loginButton.click();
            }
        }
    }

    function forceLogout() {
        const logoutButton = document.querySelector('a[href="https://hofaucet.xyz/auth/logout"]');
        if (logoutButton) {
            logoutButton.click();
        }
    }

    const urls = [
        "https://hofaucet.xyz/faucet/currency/trx",
        "https://hofaucet.xyz/faucet/currency/ltc",
        "https://hofaucet.xyz/faucet/currency/doge",
        "https://hofaucet.xyz/faucet/currency/usdt",
        "https://hofaucet.xyz/faucet/currency/eth"
    ];

    let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;

    const rotateUrls = () => {
        const loggedIn = document.querySelector('#logoutModal') || document.querySelector('a.nav-link[data-target="#logoutModal"]');
        if (loggedIn && window.location.href === "https://hofaucet.xyz/") {
            window.location.href = urls[currentIndex];
            currentIndex = (currentIndex + 1) % urls.length;
            localStorage.setItem('currentIndex', currentIndex);
        }
    };

    function clickClaimButton() {
    const claimNowButton = Array.from(document.querySelectorAll('button.btn.btn-primary')).find(
        button => button.textContent.trim() === "Claim Now"
    );

    if (claimNowButton) {
        claimNowButton.scrollIntoView({ behavior: "smooth", block: "center" });

        const recaptchaResponse = document.querySelector('.g-recaptcha-response');
        if (recaptchaResponse && recaptchaResponse.value.trim() !== "") {
            setTimeout(() => {
                claimNowButton.click();
            }, 500);
        }
    }
}

setInterval(clickClaimButton, 4000);


    function checkForMessage() {
    const swalPopup = document.querySelector('.swal2-popup.swal2-show');
    if (swalPopup) {
        const successMessageContainer = swalPopup.querySelector('.swal2-html-container');
        if (successMessageContainer) {
            const successMessage = successMessageContainer.innerText || "";
            const successIndicator = "has been sent to your FaucetPay account!";
            const claimSuccessIndicator = "Success!";
            const insufficientFundsMessage = "The faucet does not have sufficient funds for this transaction.";
            const invalidCaptchaMessage = "Invalid Claim";

            if (successMessage.includes(successIndicator) || successMessage.includes(claimSuccessIndicator)) {
                window.location.href = "https://hofaucet.xyz";
            } else if (successMessage.includes(insufficientFundsMessage)) {
                window.location.href = "https://hofaucet.xyz";
            } else if (successMessage.includes(invalidCaptchaMessage)) {
                window.location.href = "https://hofaucet.xyz";
            }
        }
    }

    const emptyBadge = document.querySelector('span.badge.badge-danger');
    if (emptyBadge && emptyBadge.textContent.trim() === "Empty") {
        window.location.href = "https://hofaucet.xyz";
    }

    const goClaimButton = document.querySelector('h4.next-button a.btn.btn-primary');
    if (goClaimButton && goClaimButton.innerText.includes('Go Claim')) {
        goClaimButton.click();
    }
}

setInterval(checkForMessage, 2000);

    function clickTryAgain() {
        let tryAgainButton = document.querySelector('a.btn.btn-primary');
        if (tryAgainButton && tryAgainButton.textContent.includes('Try Again')) {
            tryAgainButton.click();
        }
    }

    setInterval(clickTryAgain, 2000);
})();