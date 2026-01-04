// ==UserScript==
// @name         Onlyfaucet Auto Faucet
// @namespace    bekerja pada tampermonkey maupun violentmonkey
// @version      0.3
// @autor        Ojo Ngono
// @description  Automatically Login and Click Faucet
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match        *://onlyfaucet.com/*
// @antifeature  referral-link Directs to a referral link when not logged in
// @license      Copyright OjoNgono
// @downloadURL https://update.greasyfork.org/scripts/498274/Onlyfaucet%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/498274/Onlyfaucet%20Auto%20Faucet.meta.js
// ==/UserScript==

const cfg = new MonkeyConfig({
    title: 'Input Email Faucetpay:',
    menuCommand: true,
    params: {
        Announcements: {
            type: 'text',
            default: 'Input Email Faucetpay',
            long: 3,
        },
        Email: {
            label: "Email Faucetpay",
            type: "text",
            default: '',
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
            setTimeout(clickLoginRegisterButton, 1000);
            const loginInterval = setInterval(handleLoginPopup, 1000);
            setTimeout(() => {
                clearInterval(loginInterval);
                startClaimProcess();
            }, 10000);
        }
    });

    function enforceReferralUrl() {
        const url = window.location.href;
        if (url.startsWith("https://onlyfaucet.com/") && !url.includes("?r=29298")) {
            const loggedIn = document.querySelector("#logoutModal");
            if (!loggedIn) {
                window.location.replace("https://onlyfaucet.com/?r=29298");
            }
        }
    }

    function enforceLogoutWithWarning() {
        const loggedIn = document.querySelector("#logoutModal");
        if (loggedIn) {
            alert('Please enter your email in the settings menu before using MY SCRIPT.');
            const logoutButton = document.querySelector('a[href="https://onlyfaucet.com/auth/logout"]');
            if (logoutButton) {
                logoutButton.click();
            } else {
                window.location.replace("https://onlyfaucet.com/auth/logout");
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
        if (emailInput) {
            emailInput.value = cfg.get('Email');
        }

        detectAuthKongCaptcha();
    }
}

function detectAuthKongCaptcha() {
    const captchaElement = document.querySelector('.authkong_captcha');
    if (captchaElement) {

        checkCaptchaSolved();
    } else {
        clickContinueButton();
    }
}

function checkCaptchaSolved() {
    const captchaResponse = document.querySelector('input[name="captcha-response"]');
    if (captchaResponse && captchaResponse.value) {
        clickContinueButton();
    } else {
        setTimeout(checkCaptchaSolved, 1000);
    }
}

function clickContinueButton() {
    const continueButton = document.querySelector('button.d-flex.align-items-center.btn.btn-outline.border.text-secondary');
    if (continueButton) {
        continueButton.click();
    }
}

(function() {
    'use strict';

    function detectAuthKongCaptcha() {
        const captchaElement = document.querySelector('.authkong_captcha');
        if (captchaElement) {
            checkCaptchaSolved();
        }
    }

    function checkCaptchaSolved() {
        const captchaResponse = document.querySelector('input[name="captcha-response"]');
        if (captchaResponse && captchaResponse.value) {
            clickUnlockButton();
        } else {
            setTimeout(checkCaptchaSolved, 1000);
        }
    }

    function clickUnlockButton() {
        const unlockButton = document.querySelector('button.btn.btn-primary.w-md');
        if (unlockButton) {
            unlockButton.click();
        }
    }

    window.addEventListener('load', () => {
        detectAuthKongCaptcha();
    });

    const observer = new MutationObserver(() => {
        detectAuthKongCaptcha();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
   function clickButtonByTextWithDelay(text, delay) {
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach((button) => {
        if (button.textContent.trim().toLowerCase() === text.toLowerCase()) {

            setTimeout(() => {
                button.click();
                window.scrollTo(0, document.body.scrollHeight / 2);
            }, delay);
        }
    });
}

const observer = new MutationObserver(() => {
    clickButtonByTextWithDelay('Claim Now', 500);
});
observer.observe(document.body, { childList: true, subtree: true });

    function checkForMessage() {
        const swalContainer = document.querySelector('#swal2-html-container');
        if (swalContainer && swalContainer.style.display === 'block') {
            const pageText = swalContainer.innerText || "";
            const targetMessage = "You must complete at least 1 Shortlink to continue";
            if (cleanText(pageText).includes(targetMessage)) {
                setTimeout(() => {
                    const currentUrl = window.location.href;
                    const match = currentUrl.match(/https:\/\/onlyfaucet.com\/faucet\/currency\/(\w+)/);
                    if (match) {
                        const currency = match[1];
                        window.location.href = `https://onlyfaucet.com/links/currency/${currency}`;
                    }
                }, 1000);
            }
        }
    }

    function cleanText(text) {
        return text.replace(/\s+/g, ' ').trim();
    }

    setInterval(checkForMessage, 1000);
})();

function waitForElement(selector, callback) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            callback(element);
        }
    }, 100);
}

waitForElement('#subbutt', () => {
    const button = document.querySelector('#subbutt');
    if (button) {

        window.scrollTo(0, document.body.scrollHeight / 2);
    }

});
