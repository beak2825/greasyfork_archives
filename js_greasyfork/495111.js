// ==UserScript==
// @name         wildfaucet.com
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  wildfaucet
// @author       LTW
// @license      none.
// @match        https://wildfaucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wildfaucet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495111/wildfaucetcom.user.js
// @updateURL https://update.greasyfork.org/scripts/495111/wildfaucetcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const email = '';
    const senha = '';
    const redirecionamento = 'https://earncrypto.online/claim';


    setTimeout(() => {
        window.location.reload();
    }, 180000);

    const checkForDailyLimitReached = () => {
        const textElements = document.querySelectorAll('body *');
        textElements.forEach(element => {
            if (element.textContent.includes('Daily limit reached')) {
                window.location.href = redirecionamento;
            }
        });
    };
    const checkFortime = () => {
        var minuteElement = document.getElementById("minute");
if (minuteElement && parseInt(minuteElement.innerText) > 1) {
    window.location.href = redirecionamento;
}
            }




    setTimeout(() => {
        var checkInButton = document.querySelector("button[data-bs-dismiss='modal']");
        if (checkInButton) {
            $('#formWelcome').submit();
        }
    }, 3000);

    if (window.location.href.includes('/dashboard')) {
        window.location.href = window.location.href.replace('/dashboard', '/faucet');
    }

    if (window.location.href.includes('https://wildfaucet.com/login')) {
        document.getElementsByName("email")[0].value = email;
        document.getElementsByName("password")[0].value = senha;
        const checkTurnstileInput = setInterval(() => {
            const turnstileInput = document.querySelector('.cf-turnstile input');
            if (turnstileInput?.value) {
                clearInterval(checkTurnstileInput);
                document.getElementById('loginBtn').click();
            }
        }, 2000);
    }
const turnstileInput = document.querySelector('.cf-turnstile input');

if (window.location.href.includes('/faucet')) {
    if (!turnstileInput) {
        checkFortime();
        checkForDailyLimitReached();
    }

    const checkTurnstileInput = setInterval(() => {
        if (turnstileInput && turnstileInput.value) {
            clearInterval(checkTurnstileInput);
            document.getElementById('form-data').submit();
        }
    }, 2000);
}

})();
