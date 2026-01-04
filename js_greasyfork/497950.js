// ==UserScript==
// @name         bitupdate.info
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  auto login, coleta faucet e shortlinks
// @author       LTW
// @match        https://bitupdate.info/*
// @license      none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hatecoin.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497950/bitupdateinfo.user.js
// @updateURL https://update.greasyfork.org/scripts/497950/bitupdateinfo.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const email = '';
  const password = '';
  const redirectUrl = 'https://bitupdate.info/faucet';

  if (window.location.href.includes("/dashboard")) {
    window.location.href = 'https://bitupdate.info/faucet';
  }

  if (window.location.href === "https://bitupdate.info/" || window.location.href === "https://bitupdate.info") {
    window.location.href = "https://bitupdate.info/login";
  }

  function checkForDailyLimitReached() {
    const textElements = document.querySelectorAll('body *');
    textElements.forEach(function(element) {
      if (element.textContent.includes('Daily limit reached, claim from Shortlink Wall to earn energy')) {
        window.location.href = redirectUrl;
      }
    });
  }

  window.onload = function() {
    checkForDailyLimitReached();
  };

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

  const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
  const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
  const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

  if (wasButtonClicked()) {
    removeButtonClicked();
    window.location.href = redirectUrl;
  }

const e = () => {
    const value = localStorage.getItem('f');
    return value === '0';
};
const b = () => localStorage.setItem('f', '2');
const a = () => localStorage.setItem('f', '1');
const c = () => {
  let currentValue = parseInt(localStorage.getItem('f')) || 0;
  let newValue = currentValue - 1;
  localStorage.setItem('f', newValue);
};
var button = document.querySelector('button.btn.btn-primary.btn-lg');
if (window.location.href.includes("/faucet") && button){
if (button.innerHTML.includes('You need to do 1 shortlinks to unlock') || button.innerHTML.includes('You need to do 1 more shortlinks to unlock')) {
    var href = window.location.href;
    var newHref = href.replace('/faucet', '/links');
    a();
    window.location.href = newHref;
}
}
if (window.location.href.includes("/faucet") && button){
if (button.innerHTML.includes('You need to do 2 more shortlinks to unlock')|| button.innerHTML.includes('You need to do 2 shortlinks to unlock')) {
    b();
    var href1 = window.location.href;
    var newHref1 = href1.replace('/faucet', '/links');
    window.location.href = newHref1;
}
}
setTimeout(function() {
    if (window.location.href === "https://bitupdate.info/links") {
        if (e()) {
            window.location.href = redirectUrl;
            return;
        }
        setTimeout(function() {
            var links = [
                'https://bitupdate.info/links/pre_verify/42',
            ];

            var linkFound = false;

            for (var i = 0; i < links.length; i++) {
                var link = document.querySelector('a[href="' + links[i] + '"]');
                if (link) {
                    c();
                    window.location.href = link.href;
                    linkFound = true;
                    break;
                }
            }

            if (!linkFound) {
                window.location.href = redirectUrl;
            }
        }, 1000);
    }
}, 1000);

const intervalID = setInterval(() => {
    if (window.location.href.includes("https://bitupdate.info/links/pre_verify")) {
        if (isAntiBotLinksValid()) {
            const submitButton = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
            if (submitButton) {
                submitButton.click();
                clearInterval(intervalID);
            }
        }
    }
}, 3000);
  function isAntiBotLinksValid() {
    const antibotlinksValue = document.getElementById('antibotlinks').value.replace(/\s/g, '');
    return antibotlinksValue.length === 12;
  }

  setTimeout(function() {
    location.reload();
  }, 180000);

setInterval(function() {
    let reCaptchaResponse = "";
    let hCaptchaResponse = "";

    const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
    if (reCaptchaTextarea) {
        reCaptchaResponse = reCaptchaTextarea.value;
    }

    if ((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) {
        if (window.location.href.includes("/faucet") && !wasButtonClicked() && isAntiBotLinksValid()) {
            const submitButton = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
            if (submitButton) {
                setButtonClicked();
                submitButton.click();
            }
        }
    }
}, 3000);

})();
