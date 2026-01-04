// ==UserScript==
// @name            Helpfpcoin.site Auto Claim Faucet
// @namespace       bekerja pada tampermonkey maupun violentmonkey
// @version         0.2
// @description     Secara otomatis masuk, klaim faucet, dan menangani sebagian halaman shortlink
// @author          Ojo Ngono
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @require         https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match           https://helpfpcoin.site/*
// @license         Hak Cipta OjoNgono
// @downloadURL https://update.greasyfork.org/scripts/519011/Helpfpcoinsite%20Auto%20Claim%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/519011/Helpfpcoinsite%20Auto%20Claim%20Faucet.meta.js
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

const email = cfg.get('Email');
const referralURL = "https://helpfpcoin.site/r/p3aE8FHAn5v";

function checkLoginStatus() {
    const logoutButton = document.querySelector('button.login_bt a[href="https://helpfpcoin.site/logout"]'); 
    if (logoutButton) {
        if (!email) {
            alert("You are logged in, but have not entered your Faucetpay email in the settings menu. Please enter your email before using my script.");
            logoutButton.click(); 
        }
    }
}

if (email) {
    window.addEventListener('load', function () {
        const loginButton = document.querySelector('.login_bt');
        const alreadyRedirected = GM_getValue('redirected', false);

        if (loginButton && loginButton.textContent.includes('Login or Register') && !alreadyRedirected) {
            GM_setValue('redirected', true);
            window.location.replace(referralURL);
        } else if (alreadyRedirected) {
            loginButton?.click();
            const loginBoxInterval = setInterval(function () {
                const loginBox = document.querySelector('.login_box');
                const emailInput = document.querySelector('input[name="email"]');
                const submitButton = document.querySelector('input[name="login"]');

                if (loginBox && emailInput && submitButton) {
                    emailInput.value = email;
                    const recaptchaResponse = document.querySelector('#g-recaptcha-response');
                    if (recaptchaResponse && recaptchaResponse.value) {
                        submitButton.click();
                        clearInterval(loginBoxInterval);
                        waitForClaimButton();
                    }
                }
            }, 1000);
        }
    });
} else {
    window.addEventListener('load', checkLoginStatus);
}

function scrollToButton() {
    const claimButton = document.querySelector('input[name="claim"]');
    if (claimButton) {
        claimButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

(function() {
    'use strict';

    function clickClaimButton() {
        const claimButton = document.querySelector('input[type="submit"][value="Claim"]');
        if (claimButton) {
            claimButton.click();
        } else {
            setTimeout(clickClaimButton, 1000);
        }
    }

    window.addEventListener('load', function() {
        setTimeout(clickClaimButton, 1000);
    });
})();


window.addEventListener('load', function () {
    setTimeout(function () {
        scrollToButton();
        setTimeout(clickClaimButton, 6000);
    }, 1000);
});

function checkForErrorAndRedirect() {
    const errorMessageBox = document.querySelector('.pop-box');
    if (errorMessageBox) {
        const errorMessage = errorMessageBox.querySelector('.des');
        if (errorMessage && errorMessage.textContent.includes('After every 20 faucet claims, 1 Shortlink must be completed to continue again!')) {
            const currentUrl = window.location.href;
            const match = currentUrl.match(/https:\/\/helpfpcoin.site\/faucet\/(\w+)/);
            if (match) {
                const currency = match[1];
                window.location.href = `https://helpfpcoin.site/link/${currency}`;
            }
        }
    }
}

window.addEventListener('load', checkForErrorAndRedirect);

function clickSpecificClaimLink() {
    const allowedLinks = ['/go/11', '/go/15', '/go/14', '/go/9'];
    const claimLinks = Array.from(document.querySelectorAll('a.link-go'));
    for (const link of claimLinks) {
        if (allowedLinks.some(allowedHref => link.href.includes(allowedHref))) {
            link.click();
            return;
        }
    }
}

window.addEventListener('load', function () {
    const currentUrl = window.location.href;
    if (currentUrl.includes('https://helpfpcoin.site/link/')) {
        setInterval(clickSpecificClaimLink, 5000);
    }
});

window.addEventListener('load', function () {
    const button = [...document.querySelectorAll('div.pop-box a')]
        .find(el => el.textContent.trim() === "Go New Link, Yes!");
    button?.click();
});
