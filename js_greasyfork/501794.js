// ==UserScript==
// @name         freepayz.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  freepayz
// @author       LTW
// @license      none
// @match        https://freepayz.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freepayz.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501794/freepayzcom.user.js
// @updateURL https://update.greasyfork.org/scripts/501794/freepayzcom.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const redirecionamento = '';
    const timeredirect = false;

if(timeredirect === true){
function convertToSeconds(timeString) {
    let parts = timeString.split(' ');
    let minutes = parseInt(parts[0]);
    let seconds = parseInt(parts[2]);
    return (minutes * 60) + seconds;
}
function is() {
    let timeString = $('#remaining').text().trim();
    let totalSeconds = convertToSeconds(timeString);
    return totalSeconds > 30;
}
if (is()) {
window.location.href = redirecionamento;
}
}
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const select = (selector) => document.querySelector(selector);
    const selectValue = (selector) => select(selector)?.value?.replace(/\s/g, '');
if (window.location.href === 'https://freepayz.com/' || window.location.href === 'https://freepayz.com') {
            window.location.href = 'https://freepayz.com/login';
}
if (window.location.href === 'https://freepayz.com/dashboard') {
            window.location.href = 'https://freepayz.com/faucet';
}
    const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;

    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

    if (wasButtonClicked()) {
        await sleep(2000);
        removeButtonClicked();
        window.location.href = redirecionamento;
    }
if(window.location.href.includes('/faucet')){ await sleep(3000); $('#startButton').click();}
     const checkAndClaim = async () => {
        if (window.location.href.includes("/faucet") && grecaptcha && grecaptcha.getResponse().length !== 0 && !wasButtonClicked()) {
            await sleep(1000);
            $('#claimReword').click();
            setButtonClicked();
        }
    };
setTimeout(function () {
    const textElements = document.querySelectorAll('body *');
    textElements.forEach(function(element) {
      if (element.textContent.includes('Daily limit reached')) {
        window.location.href = redirecionamento;
      }
    }); }, 3000);

setTimeout(function(){location.reload();},180000);
    setInterval(async () => {
        await checkAndClaim();
    }, 3000);
        if (window.location.href.includes("firewall")) {
        let firewall = setInterval(function() {
            let recaptchav3 = document.querySelector("input#recaptchav3Token");
            let hcaptcha = document.querySelector('.h-captcha > iframe');
            let turnstile = document.querySelector('.cf-turnstile > input');
            let boton = document.querySelector("button[type='submit']");
            if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstile && turnstile.value.length > 0))) {
                boton.click();
                clearInterval(firewall);
            }
        }, 5000);
    }
})();