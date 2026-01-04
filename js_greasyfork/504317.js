// ==UserScript==
// @name         Faucets 1 hora
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script para navegação e interação com sites
// @author       LTW
// @license      none
// @match        https://tronpick.io/*
// @match        https://maticpick.io/*
// @match        https://bnbpick.io/*
// @match        https://litepick.io/*
// @match        https://solpick.io/*
// @match        https://dogepick.io/*
// @match        https://tronpayu.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504317/Faucets%201%20hora.user.js
// @updateURL https://update.greasyfork.org/scripts/504317/Faucets%201%20hora.meta.js
// ==/UserScript==

(function() {

    const email = "";
    const senha = "";

    const sitesConfig = [
        {
            urls: [
                "https://tronpick.io/",
                "https://maticpick.io/",
                "https://bnbpick.io/",
                "https://litepick.io/",
                "https://solpick.io/",
                "https://dogepick.io/",
                "https://tronpayu.io/"
            ],
            timerSelector: "#faucet_countdown_clock",
            emailSelector: 'input[id="user_email"]',
            passwordSelector: 'input[id="password"]',
            captchaType: 'all', // 'hcaptcha', 'recaptcha', 'iconcaptcha', or 'all'
            loginButtonSelector: '#process_login',
            faucetButtonSelector: '#process_claim_hourly_faucet'
        },

    ];

    let currentIndex = 0;

    const getCurrentSiteConfig = () => {
        for (let config of sitesConfig) {
            if (config.urls.some(url => window.location.href.includes(url))) {
                return config;
            }
        }
        return null;
    };

    const navigateToNextSite = () => {
        const config = getCurrentSiteConfig();
        if (config) {
            const currentUrl = window.location.href;
            const currentUrlIndex = config.urls.findIndex(url => currentUrl.includes(url));
            if (currentUrlIndex > -1) {
                const nextUrlIndex = (currentUrlIndex + 1) % config.urls.length;
                window.location.href = config.urls[nextUrlIndex];
            } else {
                window.location.href = config.urls[0];
            }
        }
    };

    const verifyCaptcha = () => {
        const hcaptchaResponse = document.querySelector('textarea[name="h-captcha-response"]');
        const recaptchaResponse = document.querySelector('textarea[name="g-recaptcha-response"]');
        const iconcaptchaTitle = document.querySelector('.iconcaptcha-modal__body-title');

        if (hcaptchaResponse && hcaptchaResponse.value) return true;
        if (recaptchaResponse && recaptchaResponse.value) return true;
        if (iconcaptchaTitle && iconcaptchaTitle.innerText.toLowerCase() === 'verification complete.') return true;

        return false;
    };

    const handleCaptchaAndSubmit = (config) => {
        const faucetButton = document.querySelector(config.faucetButtonSelector);

        const waitForCaptcha = setInterval(() => {
            if (verifyCaptcha() && faucetButton) {
                clearInterval(waitForCaptcha);
                faucetButton.click();

                setTimeout(() => {
                    handlePage();
                }, 3000);
            }
        }, 1000);
    };

    const handlePage = () => {
        const config = getCurrentSiteConfig();
        const path = window.location.pathname;

        if (path === "/") {
            window.location.href = window.location.origin + "/login.php";
        } else if (path === "/login.php") {
            handleFormInteraction(config);
        } else if (path.includes("/faucet.php")) {
            const timerElement = document.querySelector(config.timerSelector);
            if (timerElement && getComputedStyle(timerElement).display !== 'none') {
                navigateToNextSite();
            } else {
                handleCaptchaAndSubmit(config);
            }
        }
    };

    const handleFormInteraction = (config) => {
        const emailInput = document.querySelector(config.emailSelector);
        const passwordInput = document.querySelector(config.passwordSelector);
        const loginButton = document.querySelector(config.loginButtonSelector);

        if (emailInput) emailInput.value = email;
        if (passwordInput) passwordInput.value = senha;

        const waitForCaptcha = setInterval(() => {
            if (verifyCaptcha() && loginButton) {
                clearInterval(waitForCaptcha);
                loginButton.click();

                setTimeout(() => {
                    handlePage();
                }, 3000);
            }
        }, 1000);
    };

    setTimeout(() => {
        handlePage();
    }, 5000);
})();
