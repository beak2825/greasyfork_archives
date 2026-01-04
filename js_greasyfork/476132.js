// ==UserScript==
// @name         FaucetSpeed
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto Login and faucet collect 
// @author       White
// @match        https://faucetspeedbtc.com/login*
// @match        https://faucetspeedbtc.com/dashboard*
// @match        https://faucetspeedbtc.com/faucet*
// @match        https://faucetspeedbtc.com/auto*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucetspeedbtc.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476132/FaucetSpeed.user.js
// @updateURL https://update.greasyfork.org/scripts/476132/FaucetSpeed.meta.js
// ==/UserScript==

const config = {
    loginPageUrl: 'https://faucetspeedbtc.com/login',
    dashboardPageUrl: 'https://faucetspeedbtc.com/dashboard',
    redirectUrl: 'https://faucetspeedbtc.com/faucet',
    autoRedirectUrl: 'https://faucetspeedbtc.com/auto',
    email: 'seuemail@example.com',
    password: 'suasenha123',
    loginButtonSelector: 'button.btn-glow',
    faucetVerifyButtonSelector: 'button.btn.btn-primary.btn-lg.claim-button',
    imgSrcToCheck: 'assets/images/menu/bp.png'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PageHandler {
    static isUserLoggedIn() {
        const images = Array.from(document.querySelectorAll('img'));
        return images.some(img => img.src.includes(config.imgSrcToCheck));
    }

    static fillLoginForm() {
        const emailInput = document.querySelector('input[name="email"]');
        const passwordInput = document.querySelector('input[name="password"]');

        if (emailInput && passwordInput) {
            emailInput.value = config.email;
            passwordInput.value = config.password;
        }
    }

    static clickLoginButton() {
        const loginButton = document.querySelector(config.loginButtonSelector);

        if (loginButton) {
            loginButton.click();
        }
    }

    static clickVerifyButtonAfterDelay(delay) {
        setTimeout(() => {
            const verifyButton = document.querySelector(config.faucetVerifyButtonSelector);

            if (verifyButton) {
                verifyButton.click();
            }
        }, delay);
    }

    static async handleLoginPage() {
        if (!PageHandler.isUserLoggedIn()) {
            PageHandler.fillLoginForm();
            await sleep(7000);
            PageHandler.clickLoginButton();
        }
    }

    static handleDashboardPage() {
        window.location.href = config.redirectUrl;
    }

    static async handleFaucetPage() {
        await sleep(7000);

        const faucetValueElement = document.querySelector('.media-body p.lh-1.mb-1.font-weight-bold');

        if (faucetValueElement && faucetValueElement.innerText.trim() === '0') {
            console.log('O valor é 0. Redirecionando para /auto e fechando a página.');
            window.location.href = config.autoRedirectUrl;
            window.close();
        } else {
            for (let i = 5; i > 0; i--) {
                console.log(`Clique no botão "Verify" em ${i} segundos...`);
                await sleep(1000);
            }
            console.log('Clicando no botão "Verify"...');
            PageHandler.clickVerifyButtonAfterDelay(0);
        }
    }
}

(async function() {
    'use strict';

    const allowedURLs = [
        'https://faucetspeedbtc.com/',
        'https://faucetspeedbtc.com'
    ];
    const currentURL = window.location.href;
    const isAllowedURL = allowedURLs.some(url => currentURL.startsWith(url));

    if (isAllowedURL) {
        window.location.href = config.loginPageUrl;
    } else if (currentURL === config.loginPageUrl) {
        await PageHandler.handleLoginPage();
    } else if (currentURL === config.dashboardPageUrl) {
        PageHandler.handleDashboardPage();
    } else if (currentURL === config.redirectUrl) {
        await PageHandler.handleFaucetPage();
    }
})();
