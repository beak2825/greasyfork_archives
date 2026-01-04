// ==UserScript==
// @name             auto faucet Fastfaucet.site
// @namespace       tampermonkey 
// @version         0.1
// @description     Automatically Login and auto faucet
// @author          alialigood
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @match           https://fastfaucet.site/*
// @icon            https://i.ibb.co/XJSPdz0/large.png
// @downloadURL https://update.greasyfork.org/scripts/523601/auto%20faucet%20Fastfaucetsite.user.js
// @updateURL https://update.greasyfork.org/scripts/523601/auto%20faucet%20Fastfaucetsite.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Manually set your email address here
    const email = 'your_email@example.com'; // Replace with your email

    window.addEventListener('load', () => {
        console.log("Script loaded!");

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
            if (window.location.href === "https://fastfaucet.site/") {
                window.location.replace("https://fastfaucet.site/faucet/currency/dgb");
            }
            return;
        }

        setTimeout(() => {
            enforceReferralUrl(() => {
                fillEmailField(email);
                setTimeout(() => {
                    clickLoginButton();
                }, 2000);
            });
        }, 1000);
    });

    function isLoggedIn() {
        const userDropdown = document.querySelector('.nav-item.dropdown.no-arrow');
        const userIcon = document.querySelector('i.fas.fa-user-circle.fa-2x');
        return userDropdown && userIcon;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function enforceLogoutWithWarning() {
        if (isLoggedIn()) {
            alert('Please enter your email in the settings menu before using MY SCRIPT.');
            const logoutButton = document.querySelector('a[href="https://fastfaucet.site/auth/logout"]');
            if (logoutButton) {
                logoutButton.click();
            } else {
                window.location.replace("https://fastfaucet.site/auth/logout");
            }
        }
    }

    function enforceReferralUrl(callback) {
        if (!window.location.href.includes("?r=788")) {
            window.location.replace("https://fastfaucet.site/?r=788");
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

    function checkAndClickTryAgain() {
        const networkErrorMessage = document.querySelector('h2.title-xl-grad');
        const tryAgainButton = document.querySelector('.btn.btn-primary');
        if (networkErrorMessage && tryAgainButton && networkErrorMessage.textContent.trim() === "Network Error") {
            tryAgainButton.click();
        }
    }

    const observer = new MutationObserver(() => {
        checkAndClickTryAgain();
    });

    observer.observe(document.body, { childList: true, subtree: true });

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

(function() {
    if (window.location.href.includes("https://fastfaucet.site/faucet/currency/")) {
        (function() {
            if (document.getElementById("form-captcha") === null) {
                setTimeout(function() {
                    document.getElementsByTagName("form")[0].submit();
                }, 1000);
            }
        })();
    }
})();