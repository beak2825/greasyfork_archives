// ==UserScript==
// @name         freecryptoss.com/ptc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  freecryptoss/ptc
// @author       LTW
// @license      none
// @match        https://freecryptoss.com/
// @match        https://freecryptoss.com/dashboard
// @match        https://freecryptoss.com/ptc*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freecryptoss.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499147/freecryptosscomptc.user.js
// @updateURL https://update.greasyfork.org/scripts/499147/freecryptosscomptc.meta.js
// ==/UserScript==

(function() {
    'use strict';
  const email = '';
  const password = '';
  const redirectUrlPTC = '';

(() => {
 if (window.location.href.includes("/dashboard")) {
 window.location.href = window.location.href.replace('/dashboard', '/ptc');}
  if (window.location.href.includes("/login")) {
    const fillLoginForm = () => {
      const emailField = document.getElementById('email');
      const passwordField = document.getElementById('password');

      if (emailField && passwordField) {
        emailField.value = email;
        passwordField.value = password;
      }
    };


    const checkAndClick = () => {
      if (grecaptcha && grecaptcha.getResponse().length !== 0) {
        setTimeout(() => {
          const logInButton = document.querySelector('[type="submit"]');
          logInButton.click();
        }, 3000);
      }
      fillLoginForm();
    };

    setInterval(checkAndClick, 3000);
  }
  if (window.location.href === 'https://freecryptoss.com/ptc') {
setTimeout(function() {
    let buttons = document.querySelectorAll('button');
    let button = Array.from(buttons).find(el => el.textContent.trim() === 'Go');
    if (button) {
        button.click();
    } else {
        window.location.href = redirectUrlPTC;
    }
}, 3000);
}
if (window.location.href.includes("/ptc/view")) {

    setInterval(function() {
        let reCaptchaResponse = "";
        let hCaptchaResponse = "";

        const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
        const hCaptchaTextarea = document.querySelector('textarea[name="h-captcha-response"]');
        const ptcCountdown = document.getElementById("ptcCountdown");

        if (reCaptchaTextarea) {
            reCaptchaResponse = reCaptchaTextarea.value;
        }

        if (hCaptchaTextarea) {
            hCaptchaResponse = hCaptchaTextarea.value;
        }

        if (((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) &&
            ptcCountdown && ptcCountdown.innerText.trim() === "0 second") {

            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton && !submitButton.disabled) {
                submitButton.click();
            }
        }
    }, 3000);
}

})();
})();