// ==UserScript==
// @name         Starlavinia.name.tr Auto faucet
// @namespace    bekerja pada tampermonkey maupun violentmonkey
// @version      0.2
// @description  Automatically login and click faucet
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        window.onurlchange
// @grant        GM_registerMenuCommand
// @require      https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match        https://starlavinia.name.tr/*
// @icon         https://i.ibb.co.com/mzYKwsX/large-1.png
// @license      Copyright OjoNgono
// @antifeature  referral-link Directs to a referral link when not logged in
// @downloadURL https://update.greasyfork.org/scripts/520981/Starlavinianametr%20Auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/520981/Starlavinianametr%20Auto%20faucet.meta.js
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

    window.addEventListener('load', () => {
        const email = cfg.get('Email').trim();

        if (!email) {
            enforceLogoutWithWarning();
        } else {
            enforceReferralUrl();
            setTimeout(() => clickLoginModal(), 1000);
            const modalCheckInterval = setInterval(() => {
                if (document.querySelector('#login').classList.contains('show')) {
                    clearInterval(modalCheckInterval);
                    clickLoginModal();
                }
            }, 500);
            setTimeout(() => {
                if (document.querySelector("#logoutModal")) {
                    rotateUrls();
                    initiateClaimProcess();
                    waitAndClick('Go Claim', 500, 30);
                }
            }, 500);
        }
    });

    function enforceReferralUrl() {
        const loggedIn = document.querySelector("#logoutModal");
        if (loggedIn) return;

        if (window.location.href === "https://starlavinia.name.tr/" && !window.location.href.includes("?r=21564")) {
            window.location.replace("https://starlavinia.name.tr/?r=21564");
        }
    }

    function enforceLogoutWithWarning() {
        const loggedIn = document.querySelector("#logoutModal");
        if (loggedIn) {
            alert('Please enter your email in the settings menu before using my script.');
            const logoutButton = document.querySelector('a[href="https://starlavinia.name.tr/auth/logout"]');
            if (logoutButton) {
                logoutButton.click();
            } else {
                window.location.replace("https://starlavinia.name.tr/auth/logout");
            }
        }
    }

    function clickLoginModal() {
        const loginModal = document.querySelector('#login');
        if (loginModal) {
            if (!loginModal.classList.contains('show')) {
                loginModal.classList.add('show');
                loginModal.style.display = 'block';
                loginModal.setAttribute('aria-hidden', 'false');
                document.body.classList.add('modal-open');
            }

            const emailInput = document.querySelector('#InputEmail');
            if (emailInput) {
                emailInput.value = cfg.get('Email').trim();
            } else {
                return;
            }

            const csrfToken = document.querySelector('#token');
            if (!csrfToken || !csrfToken.value) return;

            const loginButton = loginModal.querySelector('button[type="submit"]');
            if (loginButton) loginButton.click();
        }
    }

    const urls = [
        "https://starlavinia.name.tr/faucet/currency/ltc",
        "https://starlavinia.name.tr/faucet/currency/doge",
        "https://starlavinia.name.tr/faucet/currency/usdt",
        "https://starlavinia.name.tr/faucet/currency/sol",
        "https://starlavinia.name.tr/faucet/currency/trx",
        "https://starlavinia.name.tr/faucet/currency/bnb",
        "https://starlavinia.name.tr/faucet/currency/bch",
        "https://starlavinia.name.tr/faucet/currency/dash",
        "https://starlavinia.name.tr/faucet/currency/dgb",
        "https://starlavinia.name.tr/faucet/currency/eth",
        "https://starlavinia.name.tr/faucet/currency/fey",
        "https://starlavinia.name.tr/faucet/currency/zec",
        "https://starlavinia.name.tr/faucet/currency/matic",
        "https://starlavinia.name.tr/faucet/currency/xmr"
    ];

    let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;
    const rotateUrls = () => {
        if (window.location.href === "https://starlavinia.name.tr/") {
            window.location.href = urls[currentIndex];
            currentIndex = (currentIndex + 1) % urls.length;
            localStorage.setItem('currentIndex', currentIndex);
        }
    };

    function initiateClaimProcess() {
    const interval = setInterval(() => {
        const inputField = document.querySelector('.form-control.mb-3');
        const captchaContainer = document.querySelector('.cf-turnstile');
        const claimButton = document.querySelector('#subutt');

        if (claimButton) {
            scrollToButton(claimButton);
        }

        if (inputField && inputField.value.trim() !== "" && captchaContainer) {
            const turnstileCompleted = captchaContainer.querySelector('[name="cf-turnstile-response"]');
            if (turnstileCompleted && turnstileCompleted.value.trim() !== "") {

                setTimeout(() => {
                    if (!claimButton.disabled) {
                        claimButton.click();

                        clearInterval(interval);
                    }
                }, 500);
            }
        }
    }, 2000);

    setTimeout(() => {
        clearInterval(interval);
    }, 30000);
}

function scrollToButton(button) {
    const rect = button.getBoundingClientRect();
    const offset = rect.top + window.scrollY - (window.innerHeight - rect.height);
    window.scrollTo({
        top: offset,
        behavior: "smooth"
    });
}

function clickByText(buttonText) {
    const buttons = document.querySelectorAll('a.btn');
    for (const button of buttons) {
        if (button.textContent.trim() === buttonText) {
            button.click();
            return true;
        }
    }
    return false;
}
function waitAndClick(buttonText, interval = 500, maxAttempts = 20) {
    let attempts = 0;
    const timer = setInterval(() => {
        attempts++;
        if (clickByText(buttonText) || attempts >= maxAttempts) {
            clearInterval(timer);
        }
    }, interval);
}
})();
(function() {

    if (document.body.innerText.includes("405 Method Not Allowed")) {
        history.back();
    }
})();

(function () {

    const messagesToCheck = [
        { selector: '.swal2-popup.swal2-icon-warning #swal2-content', text: "You have been rate-limited. Please try again in a few seconds." },
        { selector: '.swal2-popup.swal2-icon-warning #swal2-content', text: "The faucet does not have sufficient funds for this transaction." },
        { selector: '.alert.alert-danger.text-center', text: "Daily claim limit for this coin reached." }
    ];

    const redirectUrl = "https://starlavinia.name.tr";

    function checkMessages() {
        for (const message of messagesToCheck) {
            const element = document.querySelector(message.selector);
            if (element && new RegExp(message.text, 'i').test(element.textContent))
 {
                window.location.href = redirectUrl;
                break;
            }
        }
    }

    const observer = new MutationObserver(() => checkMessages());
    observer.observe(document.body, { childList: true, subtree: true });

    checkMessages();
})();

(function() {

    const scriptsToRemove = [
        "https://securepubads.g.doubleclick.net/tag/js/gpt.js",
        "https://appsha-pnd.ctengine.io/js/script.js",
        "https://cdn.jsdelivr.net/gh/ourtecads/AntiAdblock@aff5230f61c60d6dc24a1ac69a40d2ebf3f65593/aab.js",
        "https://www.googletagmanager.com/gtm.js",
        "//static.surfe.pro/js/net.js",
        "https://cdn.bmcdn6.com/js/672b83d651ecd3171500b246.js",
        "https://cdn.bmcdn6.com/js/672b85386f0db41328561d51.js"
    ];

    scriptsToRemove.forEach(src => {
        let script = document.querySelector(`script[src="${src}"]`);
        if (script) {
            script.remove();
        }
    });

    const elementsToRemove = [
        '#div-gpt-ad-1728261904308-0',
        '#abb',
        '.ads',
        '.right-ads'
    ];

    elementsToRemove.forEach(selector => {
        let element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    });

    document.querySelectorAll("[class*='672b']").forEach(element => element.remove());

    document.querySelectorAll("ins[style='display:inline-block;width:1px;height:1px;']").forEach(element => element.remove());

    document.querySelectorAll("script").forEach(script => {
        const unwantedContents = [
            "googletag.cmd.push",
            "adsurfebe = window.adsurfebe",
            "Swal.fire(\"Disable your Ad Blocker",
            "672b83d651ecd3171500b246",
            "672b85386f0db41328561d51"
        ];
        unwantedContents.forEach(content => {
            if (script.textContent.includes(content)) {
                script.remove();
            }
        });
    });

    document.querySelectorAll("div.ads ins, div.ads script").forEach(element => element.remove());

    const extraSelectors = [
        '.col-6.col-md-2.col-lg-3',
        '.card.mt-3'
    ];

    extraSelectors.forEach(selector => {
        let element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    });
})();
