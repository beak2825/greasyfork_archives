// ==UserScript==
// @name         CryptoBigPay
// @namespace    http://tampermonkey.net/
// @version      2024-04-17
// @description  GG
// @author       LTW
// @license      none
// @match        https://cryptobigpay.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptobigpay.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492606/CryptoBigPay.user.js
// @updateURL https://update.greasyfork.org/scripts/492606/CryptoBigPay.meta.js
// ==/UserScript==



(async () => {
    'use strict';
    const pageTitle = document.title;
    if (
        pageTitle.includes('Just a moment') ||
        pageTitle.includes('Um momento')
    ) {
        return;
    } else {
        const emailValue = '';
        const senha = '';
        const redirecionamento = 'https://banfaucet.com/faucet'
        const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
        const selector = async selector => {
            await wait(100);
            return document.querySelector(selector);
        };
var adBlockMessages = document.querySelectorAll('h1');

adBlockMessages.forEach(function(adBlockMessage) {
    if (adBlockMessage.textContent.trim() === "It looks like you're using an ad blocker. That's okay.  Who doesn't?") {
        location.reload();
    }
});
        if(window.location.href.includes('/faucet')){
function checkForDailyLimitReached() {

    var textElements = document.querySelectorAll('body *');

    textElements.forEach(function(element) {

        if (element.textContent.includes('Daily limit reached')) {

       window.location.href = 'https://cryptobigpay.online/madfaucet';
        }
    });
}
   checkForDailyLimitReached();
}

if(window.location.href.includes('/madfaucet')){
function checkForDailyLimitReached() {

    var textElements = document.querySelectorAll('body *');

    textElements.forEach(function(element) {

        if (element.textContent.includes('Daily limit reached')) {

       window.location.href = 'https://banfaucet.com/faucet';
        }
    });
}
   checkForDailyLimitReached();
}

setTimeout(function () {location.reload();}, 120000);
        const redirectToURL = url => window.location.href = url;

        const currentURL = window.location.href;
        if (currentURL.includes('/dashboard')) {
            await wait(2000);
const [textElement, valueElement] = await Promise.all([
    selector('.media-body p.font-weight-medium'),
    selector('.media-body h4')
]);

if (textElement && valueElement) {
    const text = textElement.textContent.trim();
    const value = parseInt(valueElement.textContent.trim());

    if (text === 'Energy' && !isNaN(value)) {
        redirectToURL(`https://cryptobigpay.online/${value > 20 ? 'wheel' : 'faucet'}`);
    }
}

        }

    const targetURLs = ['https://cryptobigpay.online/', 'https://cryptobigpay.online'];
    const loginURL = 'https://cryptobigpay.online/login';

    if (targetURLs.includes(currentURL)) {
        window.location.href = loginURL;
    }

    if (currentURL === loginURL) {
        const { email: emailInput, password: passwordInput } = document.forms[0].elements;

        if (emailInput && passwordInput) {
            emailInput.value = emailValue;
            passwordInput.value = senha;

            const checkTurnstileInput = setInterval(async () => {
                const turnstileInput = await selector('.cf-turnstile input');
                if (turnstileInput?.value) {
                    clearInterval(checkTurnstileInput);
                    await submitForm('.form-horizontal');
                }
            }, 3000);
        }
    }

    const submitForm = async formSelector => {
        const form = await selector(formSelector);
        if (form instanceof HTMLFormElement) {
            form.submit();
        } else {
            console.error('Formulário não encontrado:', formSelector);
        }
    };

(async () => {
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const selector = async selector => {
        await wait(100);
        return document.querySelector(selector);
    };

    const currentURL = window.location.href;
    if (currentURL.includes('https://cryptobigpay.online/dashboard')) {
        const mediaElements = document.querySelectorAll('.media');
        let energyFound = false;

        mediaElements.forEach(media => {
            const textElement = media.querySelector('.media-body p');
            const text = textElement?.textContent?.trim();
            if (text === 'Energy') {
                energyFound = true;
                const valueElement = media.querySelector('.media-body h4');
                const value = parseInt(valueElement?.textContent?.trim());

                if (!isNaN(value)) {
                    const destination = value > 20 ? 'wheel' : 'faucet';
                    window.location.href = `https://cryptobigpay.online/${destination}`;
                }
            }
        });

        if (!energyFound) {
             window.location.href = `https://cryptobigpay.online/faucet`;
        }
    }
})();

(async () => {
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const select = selector => document.querySelector(selector);
const selectValue = selector => select(selector)?.value?.replace(/\s/g, '');
const currentURL = window.location.href;
const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;
await wait(3000);

    if (currentURL.includes('/wheel')) {
        let clicked = localStorage.getItem('clicked');
        if (clicked === null || clicked === 'false') {
            while (!(grecaptcha && grecaptcha.getResponse().length !== 0) || !(mbsolver())) {
                await wait(1000);
            }

            const spinButton = select('#spin-button');
            if (spinButton) {
                await wait(2500);
                spinButton.click();
                localStorage.setItem('clicked', true);
                await wait(10000);
                window.location.reload();
            }
        } else {
            localStorage.setItem('clicked', false);
            window.location.href = currentURL.replace('/wheel', '/faucet');
        }

    }
})();
(async () => {
if (currentURL.includes('/wheel')) {
        await wait(8000);
        const minuteElement = document.getElementById('minute');
        if (minuteElement && !isNaN(parseInt(minuteElement.textContent))) {
            const minuteValue = parseInt(minuteElement.textContent);
            if (minuteValue > 1) {
                window.location.href = 'https://cryptobigpay.online/faucet';
            }
        }
    }
})();
(async () => {
if (currentURL.includes('/faucet')) {
        await wait(8000);
        const minuteElement = document.getElementById('minute');
        if (minuteElement && !isNaN(parseInt(minuteElement.textContent))) {
            const minuteValue = parseInt(minuteElement.textContent);
            if (minuteValue > 1) {
                window.location.href = 'https://cryptobigpay.online/madfaucet';
            }
        }
    }
})();
(async () => {
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const select = selector => document.querySelector(selector);
    const selectValue = selector => select(selector)?.value?.replace(/\s/g, '');
    const currentURL = window.location.href;
    const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;

    await wait(3000);

    if (currentURL.includes('/faucet')) {
        let clicked1 = localStorage.getItem('clicked1');

        if (clicked1 === null || clicked1 === 'false') {

            while (!(grecaptcha && grecaptcha.getResponse().length !== 0) || !(mbsolver())) {
                await wait(1000);
            }

            const spinButton = select('.btn.btn-primary.btn-lg.claim-button.a1');
            if (spinButton) {
                await wait(2500);
                spinButton.click();
                localStorage.setItem('clicked1', true);
            }
        } else {
            localStorage.setItem('clicked1', false);
            window.location.href = currentURL.replace('/faucet', '/madfaucet');
        }
        await wait(8000);
        const minuteElement = document.getElementById('minute');
        if (minuteElement && !isNaN(parseInt(minuteElement.textContent))) {
            const minuteValue = parseInt(minuteElement.textContent);
            if (minuteValue > 1) {
                window.location.href = redirecionamento;
            }
        }
    }
})();
(async () => {

        if (window.location.href.includes("firewall")) {

let checkTurnstileInput = setInterval(function() {
    let turnstileContainer = document.querySelector('.cf-turnstile');
    if (turnstileContainer) {
        let turnstileInput = turnstileContainer.querySelector('input');
        if (turnstileInput) {
            if (turnstileInput.value) {
                let unlockButton = document.querySelector('.btn.btn-primary.w-md');
                if (unlockButton) {
                    unlockButton.click();
                    clearInterval(checkTurnstileInput);
                }
            }
        }
    }
}, 3000);

        let firewall = setInterval(function() {
            let recaptchav3 = document.querySelector("input#recaptchav3Token");
            let hcaptcha = document.querySelector('.h-captcha > iframe');
            let turnstile = document.querySelector('.cf-turnstile > input');
            let boton = document.querySelector("button[type='submit']");
            if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstileResponseInput && turnstileResponseInput.value.trim() !== ''))) {
                boton.click();
                clearInterval(firewall);
            }
        }, 5000);
    }
})();
(async () => {
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const select = selector => document.querySelector(selector);
    const selectValue = selector => select(selector)?.value?.replace(/\s/g, '');
    const currentURL = window.location.href;
    const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;

    await wait(3000);

    if (currentURL.includes('/madfaucet')) {
        let clicked2 = localStorage.getItem('clicked2');

        if (clicked2 === null || clicked2 === 'false') {
            while (!(grecaptcha && grecaptcha.getResponse().length !== 0) || !(mbsolver())) {
                await wait(1000);
            }

            const spinButton = select('.btn.btn-primary.btn-lg.claim-button.a1');
            if (spinButton) {
                await wait(2500);
                spinButton.click();
                localStorage.setItem('clicked2', true);
            }
        } else {
            localStorage.setItem('clicked2', false);
            window.location.href = redirecionamento;
        }
    }
})();


(async () => {
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const selector = async selector => {
        await wait(100);
        return document.querySelector(selector);
    };

    const currentURL = window.location.href;

    if (currentURL.includes('/madfaucet')) {
await wait(8000);
        const minuteElement = document.getElementById('minute');
        if (minuteElement && !isNaN(parseInt(minuteElement.textContent))) {
            const minuteValue = parseInt(minuteElement.textContent);
            if (minuteValue > 1) {
                window.location.href = redirecionamento;
            }
        }
        const alertDiv = await selector('.alert.alert-danger.text-center');

        if (alertDiv) {
            const alertText = alertDiv.textContent.trim();
            const regex = /15\s*shortlinks\s*To\s*Claim/i;
            if (regex.test(alertText)) {
                window.location.href = '/links';

            }
        }
    }
})();

(async () => {
setTimeout(function() {
    if (window.location.href.includes("/links")) {
        setTimeout(function() {
            var links = [
                'https://cryptobigpay.online/links/go/62',
                'https://cryptobigpay.online/links/go/120',
                'https://cryptobigpay.online/links/go/99',
                'https://cryptobigpay.online/links/go/104',
                'https://cryptobigpay.online/links/go/30',
                'https://cryptobigpay.online/links/go/31',
            ];

            var linkFound = false;

            for (var i = 0; i < links.length; i++) {
                var link = document.querySelector('a[href="' + links[i] + '"]');
                if (link) {
                    window.location.href = link.href;
                    linkFound = true;
                    break;
                }
            }

            if (!linkFound) {
                window.location.href = redirecionamento;
            }
        }, 3000);
    }
}, 3000);
})();
}
})();