// ==UserScript==
// @name         Keran.co and Bagi.co.in auto faucet
// @namespace    auto faucet
// @version      0.6
// @description  Input Email for automate faucet interactions and auto-redirect if buttons are disabled
// @author       Ojo Ngono
// @match        *://bagi.co.in/*
// @match        *://keran.co/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        window.onurlchange
// @grant        GM_registerMenuCommand
// @require      https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @license      Copyright OjoNgono
// @antifeature  referral-link Directs to a referral link when not logged in
// @downloadURL https://update.greasyfork.org/scripts/499052/Keranco%20and%20Bagicoin%20auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/499052/Keranco%20and%20Bagicoin%20auto%20faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cfg = new MonkeyConfig({
        title: 'Bagi Keran Configuration',
        menuCommand: true,
        params: {
            Email: {
                label: "EmailFaucetpay",
                type: "text",
                default: ''
            }
        }
    });

    const email = cfg.get('Email');
    let currentReferralId = '';

    function determineSiteAndReferralId() {
        if (window.location.href.includes('bagi.co.in')) {
            currentReferralId = '65307';
        } else if (window.location.href.includes('keran.co')) {
            currentReferralId = '69657';
        }
    }

    function showEmailWarning() {
        alert("Please input your Email in the configuration menu.");
    }

    function isLoggedIn() {
        return document.querySelector('.user-dashboard') !== null;
    }

    function redirectToReferralIfNecessary() {
        const currentUrl = window.location.pathname;
        const queryParams = window.location.search;
        if (!isLoggedIn() && (currentUrl === '/' || currentUrl === '/index.php')) {
            if (!queryParams.includes('ref=')) {
                window.location.search = `?ref=${currentReferralId}`;
            }
        }
    }

    function redirectFromDashboard() {
        if (window.location.pathname.includes('/dashboard.php')) {
            window.location.href = '/faucet.php';
        }
    }

    function reloadIfAdditionalUrlExists() {
        const currentPath = window.location.pathname;
        const hasQueryString = window.location.search.length > 0;
        const hasHash = window.location.hash.length > 0;
        if (currentPath.includes('/faucet.php') && (hasQueryString || hasHash)) {
            window.location.href = '/faucet.php';
        }
    }

    function clickGetStartedFirst() {
        const button = document.querySelector('button[data-target="#myModal"]');
        if (button) {
            button.click();
            setTimeout(waitForModal, 500);
        }
    }

    function waitForModal() {
        const modal = document.querySelector('.modal-card');
        if (modal) {
            fillEmail();
        } else {
            setTimeout(waitForModal, 500);
        }
    }

    function fillEmail() {
        const emailInput = document.querySelector('input[name="address"]');
        if (emailInput && email) {
            emailInput.value = email;
            setTimeout(waitForCaptchaAndClick, 500);
        }
    }

    function checkRecaptcha() {
        if (typeof grecaptcha !== 'undefined') {
            return grecaptcha.getResponse().length > 0;
        }
        return false;
    }

    function checkTurnstile() {
        const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
        if (turnstileResponse && turnstileResponse.value.length > 0) {
            return true;
        }
        return false;
    }

    function isCaptchaSolved() {
        return checkRecaptcha() || checkTurnstile();
    }

    function clickGetStarted() {
        const button = document.querySelector('button.button.is-success[type="submit"]');
        if (button) {
            button.click();
        }
    }

    function clickClaimNow() {
        const claimButton = document.querySelector('button.button.is-info[type="submit"]');
        if (claimButton) {
            claimButton.click();
        }
    }

    function clickLinkButton() {
        const linkButton = document.querySelector('a.button.is-info[href="https://bagi.co.in/faucet.php"]');
        if (linkButton) {
            linkButton.click();
        }
    }

    function showModal() {
        const modal = document.querySelector('#myModal');
        if (modal) {
            modal.classList.add('is-active');
        }
    }

    function redirectIfButtonsDisabledOnFaucetPage() {
        const currentPath = window.location.pathname;

        if (currentPath.includes('/faucet.php')) {
            const buttons = document.querySelectorAll('button');
            let allDisabled = true;

            buttons.forEach(button => {
                if (!button.disabled) {
                    allDisabled = false;
                }
            });

            if (allDisabled) {
                if (window.location.href.includes('keran.co')) {
                    window.location.href = 'https://bagi.co.in/dashboard.php';
                } else if (window.location.href.includes('bagi.co.in')) {
                    window.location.href = 'https://keran.co/dashboard.php';
                }
            }
        }
    }

    const interval = setInterval(() => {
        if (isCaptchaSolved()) {
            clickGetStarted();
            clearInterval(interval);
        }
    }, 1000);

    document.addEventListener('DOMContentLoaded', function() {
        if (!email || email.trim() === '') {
            showEmailWarning();
            return;
        }
        determineSiteAndReferralId();
        redirectToReferralIfNecessary();
        redirectFromDashboard();
        reloadIfAdditionalUrlExists();
        if (window.location.pathname.includes('/faucet.php')) {
            clickClaimNow();
        }
        clickLinkButton();
        showModal();
        redirectIfButtonsDisabledOnFaucetPage();
        setTimeout(() => {
            clickGetStartedFirst();
        }, 500);
    });
})();
