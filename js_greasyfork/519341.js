// ==UserScript==
// @name         Ourinfo.top auto claim faucet
// @namespace    tampermonkey
// @version      0.1
// @description  Automatically Login and auto claim
// @author       aligood
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match        https://ourinfo.top/*
// @exclude      https://ourinfo.top/auth/login*

// @downloadURL https://update.greasyfork.org/scripts/519341/Ourinfotop%20auto%20claim%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/519341/Ourinfotop%20auto%20claim%20faucet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const faucetPayEmail = 'set gmail faucetpay here'; // أدخل إيميل الفوست باي هنا

    window.addEventListener('load', () => {
        const email = faucetPayEmail.trim();
        if (!email) {
            enforceLogoutWithWarning();
            return;
        }
        if (!isValidEmail(email)) {
            alert('Invalid email address. Please check your configuration.');
            enforceLogoutWithWarning();
            return;
        }
        if (isLoggedIn()) {
            if (isFaucetPage()) {
                checkGoClaimButton();
                autoClickClaimButton();
            } else {
                window.location.replace("https://ourinfo.top/faucet/currency/doge");
            }
        } else {
            setTimeout(() => {
                enforceReferralUrl(() => {
                    fillEmailField(email);
                    setTimeout(() => {
                        clickLoginButton();
                    }, 2000);
                });
            }, 1000);
        }
        const currentCoin = window.location.href.includes("doge") ? "doge" : "ltc";
        redirectIfLimitReached(currentCoin);
        autoClickClaimButton();
        checkAndClickTryAgain();
    });

    function isLoggedIn() {
        return !!document.querySelector('i.fas.fa-user-circle.fa-2x');
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function enforceLogoutWithWarning() {
        if (isLoggedIn()) {
            alert('Please enter your email in the settings menu before using MY SCRIPT.');
            const logoutButton = document.querySelector('a[href="https://ourinfo.top/auth/logout"]');
            if (logoutButton) {
                logoutButton.click();
            } else {
                window.location.replace("https://ourinfo.top/auth/logout");
            }
        }
    }

    function enforceReferralUrl(callback) {
        if (!window.location.href.includes("?r=3600")) {
            window.location.replace("https://ourinfo.top/?r=3600");
            setTimeout(callback, 1000);
        } else {
            callback();
        }
    }

    function fillEmailField(email) {
        const emailInput = document.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.value = email;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function clickLoginButton() {
        const loginButton = document.querySelector('button[type="submit"].btn-user');
        if (loginButton) loginButton.click();
    }

    function isFaucetPage() {
        return window.location.href.includes("/faucet/currency/");
    }

    function autoClickClaimButton() {
        const claimButton = document.getElementById('subbutt');
        if (claimButton && claimButton.classList.contains('btn-primary')) {
            setTimeout(() => {
                claimButton.click();
            }, 1000);
        }
    }

    function checkGoClaimButton() {
        const goClaimButton = document.querySelector('h4.next-button a.btn.btn-primary');
        if (goClaimButton && goClaimButton.textContent.trim() === "Go Claim") {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    function checkAndClickTryAgain() {
        const networkErrorMessage = document.querySelector('h2.title-xl-grad');
        const tryAgainButton = document.querySelector('.btn.btn-primary');
        if (networkErrorMessage && tryAgainButton && networkErrorMessage.textContent.trim() === "Network Error") {
            tryAgainButton.click();
        }
    }

    const observer = new MutationObserver(() => {
        checkGoClaimButton();
        checkAndClickTryAgain();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function redirectIfLimitReached(coin) {
        if (!window.location.href.includes(`/faucet/currency/${coin}`)) return;
        setTimeout(() => {
            const alertMessage = document.querySelector('.alert.alert-danger.text-center');
            const swalPopup = document.querySelector('.swal2-popup.swal2-show');
            if (
                (alertMessage && alertMessage.textContent.includes("Daily claim limit for this coin reached")) ||
                (swalPopup && swalPopup.textContent.includes("The faucet does not have sufficient funds for this transaction."))
            ) {
                if (coin === "ltc") {
                    return;
                }
                const nextCoin = coin === "doge" ? "ltc" : "doge";
                window.location.replace(`https://ourinfo.top/faucet/currency/${nextCoin}`);
            }
        }, 1000);
    }

    function clickOkButtonAfterDelay() {
        const okButton = document.querySelector('.swal2-confirm');
        if (okButton) {
            setTimeout(() => {
                okButton.click();
            }, 2000);
        }
    }

    clickOkButtonAfterDelay();
})();