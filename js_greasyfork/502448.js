// ==UserScript==
// @name         www.freebnbcoin.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  freebnbcoin
// @author       LTW
// @license      none
// @match        https://www.freebnbcoin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebnbcoin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502448/wwwfreebnbcoincom.user.js
// @updateURL https://update.greasyfork.org/scripts/502448/wwwfreebnbcoincom.meta.js
// ==/UserScript==

(() => {
    const email = "";
    const senha = "";
    const redirecionamento = '';

setTimeout(() => {location.reload();},5 * 60000);
  const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
  const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
  const removeButtonClicked = () => localStorage.removeItem('buttonClicked');
if(window.location.href.includes('/faucet')){
  if (wasButtonClicked()) {
    removeButtonClicked();
    window.location.href = '';
  }
}
if(window.location.href === 'https://www.freebnbcoin.com/'){window.location.href = 'https://www.freebnbcoin.com/login'}
if (window.location.href.includes('/login')) {
    setTimeout(() => {
        document.getElementById("email").value = email;
        document.getElementById("password").value = senha;
    }, 5000);

    let buttonClicked = false;

    const checkAndClick = () => {
        let reCaptchaResponse = "";
        let hCaptchaResponse = "";

        const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
        const hCaptchaTextarea = document.querySelector('textarea[name="h-captcha-response"]');

        if (reCaptchaTextarea) {
            reCaptchaResponse = reCaptchaTextarea.value;
        }

        if (hCaptchaTextarea) {
            hCaptchaResponse = hCaptchaTextarea.value;
        }

        if (!buttonClicked && (reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) {
            const logInButton = document.querySelector('.btn.btn-warning[type="submit"]');
            if (logInButton) {
                logInButton.click();
                buttonClicked = true;
                clearInterval(interval);
            }
        }
    };

    const interval = setInterval(checkAndClick, 2000);
}
if(window.location.href.includes('/dashboard')){window.location.href = 'https://www.freebnbcoin.com/faucet'}
    if(window.location.href.includes('/faucet') || window.location.href.includes('/madfaucet')){
    setInterval(function() {
        let reCaptchaResponse = "";
        let hCaptchaResponse = "";

        const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
        const hCaptchaTextarea = document.querySelector('textarea[name="h-captcha-response"]');

        if (reCaptchaTextarea) {
            reCaptchaResponse = reCaptchaTextarea.value;
        }

        if (hCaptchaTextarea) {
            hCaptchaResponse = hCaptchaTextarea.value;
        }

        if ((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) {
            if (!wasButtonClicked()) {
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton && !submitButton.disabled) {
                    submitButton.click();
                    setButtonClicked();
                }
            }
        }
    }, 3000);
    }
})();
