// ==UserScript==
// @name         autocoin.in
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  autocoin
// @author       LTW
// @license      none
// @match        https://autocoin.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autocoin.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495450/autocoinin.user.js
// @updateURL https://update.greasyfork.org/scripts/495450/autocoinin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const email = '';
    const senha = '';
    const redirecinamento = 'https://keforcash.com/faucet'

setTimeout(() => {
window.location.reload();
}, 180000);
  const checkForDailyLimitReached = () => {
        const textElements = document.querySelectorAll('body *');
        textElements.forEach(element => {
            if (element.textContent.includes('Daily limit reached')) {
                window.location.href = redirecinamento;
            }
        });
    };
setTimeout(() => {
var checkInButton = document.querySelector("button[data-bs-dismiss='modal']");
if (checkInButton) {
   $('#formWelcome').submit();
}
}, 3000);
    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');
if (window.location.href.includes('/dashboard')) {window.location.href = window.location.href.replace('/dashboard', '/faucet');}
if (window.location.href.includes('https://autocoin.in/login')) {
    document.getElementsByName("email")[0].value = email;
    document.getElementsByName("password")[0].value = senha;
    const checkTurnstileInput = setInterval(async () => {
        if (grecaptcha && grecaptcha.getResponse().length !== 0) {
            clearInterval(checkTurnstileInput);
            document.getElementById('loginBtn').click();
        }
    }, 2000);
}

    const checkFortime = () => {
        var minuteElement = document.getElementById("minute");
if (minuteElement && parseInt(minuteElement.innerText) > 1) {
    window.location.href = redirecinamento;
}
            }

if (window.location.href.includes('/faucet')){
checkFortime();
checkForDailyLimitReached();
    async function selector(selector) {
    return document.querySelector(selector)}

    const checkTurnstileInput = setInterval(async () => {
        if (grecaptcha && grecaptcha.getResponse().length !== 0) {
            clearInterval(checkTurnstileInput);
            setButtonClicked();
            await $('#form-data').submit();
        }
    }, 2000);
}
})();
