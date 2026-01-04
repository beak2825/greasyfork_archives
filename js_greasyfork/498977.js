// ==UserScript==
// @name         kazipay.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  kazipay
// @author       LTW
// @match        https://kazipay.com/*
// @license      none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kazipay.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498977/kazipaycom.user.js
// @updateURL https://update.greasyfork.org/scripts/498977/kazipaycom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const email = '';
    const senha = '';
    const redirecinamento = 'https://kazipay.com/member/faucet'

setTimeout(() => {
window.location.reload();
}, 300000);
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
if (window.location.href.includes('/login')) {
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
 if (!grecaptcha){
//checkFortime();
checkForDailyLimitReached();
}
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
