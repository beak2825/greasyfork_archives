// ==UserScript==
// @name         bitmonk.me
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bitmonk
// @author       LTW
// @license      none
// @match        https://bitmonk.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitmonk.me
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/498730/bitmonkme.user.js
// @updateURL https://update.greasyfork.org/scripts/498730/bitmonkme.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const redirecionamento = ""; // URL para redirecionar após claim
    const login = ""; // username para login
    const senha = ""; // senha

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const select = (selector) => document.querySelector(selector);

    if (window.location.href === 'https://bitmonk.me/dashboard' || window.location.href === 'https://bitmonk.me/dashboard/') {
        window.location.href = 'https://bitmonk.me/ptc';
    }

    if (window.location.href.includes('dailybounus')) {
        const checkAndClaim = () => {
            const claimButtons = document.querySelectorAll('a.btn.btn-soft-success.btn-sm');
            let disabledCount = 0;

            claimButtons.forEach(button => {
                if (!button.classList.contains('disabled')) {
                    button.click();
                } else {
                    disabledCount++;
                }
            });

            if (disabledCount === claimButtons.length) {
                window.location.href = 'https://bitmonk.me/faucet';
            }
        };

        setTimeout(checkAndClaim, 2000);
    }

    if (window.location.href.includes('https://bitmonk.me/ptc/view/')) {
        let wasClicked = false;
        const checkAndClaim1 = async () => {
            if (grecaptcha && grecaptcha.getResponse().length !== 0 && !wasClicked) {
                const Button = document.querySelector('.btn.btn-success');
                setTimeout(() => {
                    Button.click();
                    wasClicked = true;
                }, 3000);
            }
        };

        setInterval(checkAndClaim1, 5000);
    }

    if (window.location.href === 'https://bitmonk.me/ptc') {
        setTimeout(() => {
            const links = [
                'https://bitmonk.me/ptc/view/408',
                'https://bitmonk.me/ptc/view/296'
            ];

            let linkFound = false;

            for (const link of links) {
                const element = document.querySelector(`a[href="${link}"]`);
                if (element) {
                    window.location.href = element.href;
                    linkFound = true;
                    break;
                }
            }

            if (!linkFound) {
                window.location.href = 'https://bitmonk.me/dailybounus';
            }
        }, 1000);
    }

    if (window.location.href.includes("/login")) {
        setTimeout(() => {
            document.getElementById("username").value = login;
            const passwordElements = document.getElementsByName("password");
            for (const element of passwordElements) {
                element.value = senha;
            }

            let buttonClicked = false;

            const checkAndClick = () => {
                if (!buttonClicked && grecaptcha && grecaptcha.getResponse().length !== 0) {
                    const logInButton = document.querySelector('button[type="submit"]');
                    if (logInButton && logInButton.textContent.trim() === "Sign In") {
                        logInButton.click();
                        buttonClicked = true;
                    }
                }
                setTimeout(checkAndClick, 1000);
            };

            setTimeout(checkAndClick, 3000);
        }, 3000);
    }

    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

    if (wasButtonClicked()) {
        setTimeout(() => {
            window.location.href = redirecionamento;
            removeButtonClicked();
        }, 3000);
    }

    const checkAndClaim = async () => {
        if (window.location.href.includes("/faucet")) {
            const readyText = document.querySelector('h4#timer_text');
            if (readyText) {
                const timeParts = readyText.textContent.trim().split(':');
                if (timeParts.length === 3) {
                    const hours = parseInt(timeParts[0], 10);
                    const minutes = parseInt(timeParts[1], 10);
                    const seconds = parseInt(timeParts[2], 10);
                    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

                    if (totalSeconds > 60) {
                        window.location.href = redirecionamento;
                        return;
                    }
                }
            }
            if (grecaptcha && grecaptcha.getResponse().length !== 0 && !wasButtonClicked()) {
                if (readyText && readyText.textContent.trim() === 'Ready!') {
                    await sleep(3000);
                    select('.btn.btn-primary.mx-3')?.click();
                    setButtonClicked();
                }
            }
        }
    };

    setTimeout(() => {
        location.reload();
    }, 180000);

    setInterval(checkAndClaim, 5000);

    if (window.location.href.includes("firewall")) {
        const firewall = setInterval(() => {
            const recaptchav3 = document.querySelector("input#recaptchav3Token");
            const hcaptcha = document.querySelector('.h-captcha > iframe');
            const turnstile = document.querySelector('.cf-turnstile > input');
            const button = document.querySelector('button[type="submit"].btn.btn-primary.w-md');

            if (button && ((hcaptcha && hcaptcha.getAttribute('data-hcaptcha-response')?.length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3?.value.length > 0) || (turnstile?.value.length > 0))) {
                button.click();
                clearInterval(firewall);
            }
        }, 3000);
    }
})();

