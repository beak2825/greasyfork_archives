// ==UserScript==
// @name         adsblue
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Coleta Faucet, AutoLogin e Saque.
// @author       You
// @match        https://adsblue.biz/*
// @license      None
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adsblue.biz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491431/adsblue.user.js
// @updateURL https://update.greasyfork.org/scripts/491431/adsblue.meta.js
// ==/UserScript==

(function() {
  'use strict';
    const redirecionamento = "https://bitmonk.me/dashboard"; //url para redirecionar apos  claim
    const email = ""; // Email para saque FaucetPay e para login
    const senha = ""; // Senha para login
    var SaqueAuto = true; //Mude Para False Para Destativar



if(SaqueAuto === true){
if (window.location.href.includes("/dashboard")) {
    setInterval(function() {
    const claimButton = document.querySelector('.claim-button');
    if (claimButton && !claimButton.disabled) {
        claimButton.click();
    } else {
        const balanceElement = document.querySelector('.media-body p.text-muted.font-weight-medium');
        if (balanceElement && balanceElement.textContent.trim() === 'Balance') {
            const tokensText = balanceElement.nextElementSibling.textContent.trim();
            const tokens = parseFloat(tokensText.replace(/[,\.]/g, ''));
            if (tokens >= 10000) {
                const emailInput = document.querySelector('input[name="wallet"]');
                if (emailInput) {
                    emailInput.value = email;
                    const interval = setInterval(function() {
                        if (window.grecaptcha && window.grecaptcha.getResponse().length !== 0) {
                            var withdrawButton = document.querySelector('.btn.btn-success[type="submit"]');
                            if (withdrawButton) {
                                withdrawButton.click();
                                clearInterval(interval);
                            }
                        }
                    }, 1000);
                } else {
                    window.location.href = "https://adsblue.biz/faucet";
                }
            } else {
                window.location.href = "https://adsblue.biz/faucet";
            }
        } else {
            window.location.href = "https://adsblue.biz/faucet";
        }
    }
  }, 3000);
}
}
    if(SaqueAuto === false){
        const claimButton = document.querySelector('.claim-button');
    if (claimButton && !claimButton.disabled) {
        claimButton.click();
    } else {
    window.location.href = "https://adsblue.biz/faucet";
    }
 }
if (window.location.href == "https://adsblue.biz/" || window.location.href == "https://adsblue.biz") {
    window.location.href = "https://adsblue.biz/login";
  }

if (window.location.href.includes("/login")) {
    document.getElementById("email").value = email;
    document.getElementById("password").value = senha;

    let buttonClicked = false;

    const checkAndClick = () => {
        if (!buttonClicked && grecaptcha && grecaptcha.getResponse().length !== 0) {
            const logInButton = document.querySelector('.btn.btn-primary.btn-block.waves-effect.waves-light[type="submit"]');
            if (logInButton) {
                logInButton.click();
                buttonClicked = true;
            }
        }
        setTimeout(checkAndClick, 1000);
    };

     setTimeout(checkAndClick, 5000);
}


let hasClicked = false;

function mbsolver() {
  const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
  return valorAntibotlinks.length > 1;
}
function wasButtonClicked() {
  return localStorage.getItem('buttonClicked') === 'true';
}

function setButtonClicked() {
  localStorage.setItem('buttonClicked', 'true');
}

function removeButtonClicked() {
  localStorage.removeItem('buttonClicked');
}

if (wasButtonClicked()) {
  removeButtonClicked();
  window.location.href = redirecionamento;
}
    if (window.location.href.includes("/faucet")){
setInterval(function() {
  const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
  const grecaptchaResponse = (window.grecaptcha && window.grecaptcha.getResponse) ? window.grecaptcha.getResponse() : null;

  if (window.location.href.includes("/faucet") && grecaptchaResponse && grecaptchaResponse.length > 0 && mbsolver() && !wasButtonClicked()) {
    const submitButton = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
    if (submitButton) {
      submitButton.click();
      setButtonClicked();
    }
  }
}, 3000);
}
function checkForDailyLimitReached() {

    var textElements = document.querySelectorAll('body *');

    textElements.forEach(function(element) {

        if (element.textContent.includes('Daily limit reached')) {

       window.location.href = redirecionamento;
        }
    });
}

window.onload = function() {
    checkForDailyLimitReached();
    setInterval(function() {
    if (document.body.innerHTML.includes("It looks like you're using an ad blocker. That's okay.  Who doesn't?")) {
    location.reload();
    }
        }, 10000);
};
    setTimeout(function () {
            location.reload();
        }, 240000);
if (window.location.href.includes("firewall")) {
    let firewall = setInterval(function() {
        let recaptchav3 = document.querySelector("input#recaptchav3Token");
        let hcaptcha = document.querySelector('.h-captcha > iframe');
        let turnstile = document.querySelector('.cf-turnstile > input');
        let boton = document.querySelector("button[type='submit'].btn.btn-primary.w-md.a1");
// ==UserScript==
// @name         adsblue
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://adsblue.biz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adsblue.biz
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
    const redirecionamento = "https://bitmonk.me/dashboard"; //url para redirecionar apos  claim
    const email = ""; // Email para saque FaucetPay e para login
    const senha = ""; // Senha para login
    var SaqueAuto = true; //Mude Para False Para Destativar



if(SaqueAuto === true){
if (window.location.href.includes("/dashboard")) {
    setInterval(function() {
    const claimButton = document.querySelector('.claim-button');
    if (claimButton && !claimButton.disabled) {
        claimButton.click();
    } else {
        const balanceElement = document.querySelector('.media-body p.text-muted.font-weight-medium');
        if (balanceElement && balanceElement.textContent.trim() === 'Balance') {
            const tokensText = balanceElement.nextElementSibling.textContent.trim();
            const tokens = parseFloat(tokensText.replace(/[,\.]/g, ''));
            if (tokens >= 10000) {
                const emailInput = document.querySelector('input[name="wallet"]');
                if (emailInput) {
                    emailInput.value = email;
                    const interval = setInterval(function() {
                        if (window.grecaptcha && window.grecaptcha.getResponse().length !== 0) {
                            var withdrawButton = document.querySelector('.btn.btn-success[type="submit"]');
                            if (withdrawButton) {
                                withdrawButton.click();
                                clearInterval(interval);
                            }
                        }
                    }, 1000);
                } else {
                    window.location.href = "https://adsblue.biz/faucet";
                }
            } else {
                window.location.href = "https://adsblue.biz/faucet";
            }
        } else {
            window.location.href = "https://adsblue.biz/faucet";
        }
    }
  }, 3000);
}
}
    if(SaqueAuto === false){
        const claimButton = document.querySelector('.claim-button');
    if (claimButton && !claimButton.disabled) {
        claimButton.click();
    } else {
    window.location.href = "https://adsblue.biz/faucet";
    }
 }
if (window.location.href == "https://adsblue.biz/" || window.location.href == "https://adsblue.biz") {
    window.location.href = "https://adsblue.biz/login";
  }

if (window.location.href.includes("/login")) {
    document.getElementById("email").value = email;
    document.getElementById("password").value = senha;

    let buttonClicked = false;

    const checkAndClick = () => {
        if (!buttonClicked && grecaptcha && grecaptcha.getResponse().length !== 0) {
            const logInButton = document.querySelector('.btn.btn-primary.btn-block.waves-effect.waves-light[type="submit"]');
            if (logInButton) {
                logInButton.click();
                buttonClicked = true;
            }
        }
        setTimeout(checkAndClick, 1000);
    };

     setTimeout(checkAndClick, 5000);
}


let hasClicked = false;

function mbsolver() {
  const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
  return valorAntibotlinks.length > 1;
}
function wasButtonClicked() {
  return localStorage.getItem('buttonClicked') === 'true';
}

function setButtonClicked() {
  localStorage.setItem('buttonClicked', 'true');
}

function removeButtonClicked() {
  localStorage.removeItem('buttonClicked');
}

if (wasButtonClicked()) {
  removeButtonClicked();
  window.location.href = redirecionamento;
}
    if (window.location.href.includes("/faucet")){
setInterval(function() {
  const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
  const grecaptchaResponse = (window.grecaptcha && window.grecaptcha.getResponse) ? window.grecaptcha.getResponse() : null;

  if (window.location.href.includes("/faucet") && grecaptchaResponse && grecaptchaResponse.length > 0 && mbsolver() && !wasButtonClicked()) {
    const submitButton = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
    if (submitButton) {
      submitButton.click();
      setButtonClicked();
    }
  }
}, 3000);
}
function checkForDailyLimitReached() {

    var textElements = document.querySelectorAll('body *');

    textElements.forEach(function(element) {

        if (element.textContent.includes('Daily limit reached')) {

       window.location.href = redirecionamento;
        }
    });
}

window.onload = function() {
    checkForDailyLimitReached();
    setInterval(function() {
    if (document.body.innerHTML.includes("It looks like you're using an ad blocker. That's okay.  Who doesn't?")) {
    location.reload();
    }
        }, 10000);
};
    setTimeout(function () {
            location.reload();
        }, 240000);
if (window.location.href.includes("firewall")) {
    let firewall = setInterval(function() {
        let recaptchav3 = document.querySelector("input#recaptchav3Token");
        let hcaptcha = document.querySelector('.h-captcha > iframe');
        let turnstile = document.querySelector('.cf-turnstile > input');
        let boton = document.querySelector("button[type='submit'].btn.btn-primary.w-md.a1");


        if (boton && (
            (hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) ||
            grecaptcha.getResponse().length > 0 ||
            (recaptchav3 && recaptchav3.value.length > 0) ||
            (turnstile && turnstile.value.length > 0)
        )) {
            boton.click();
            clearInterval(firewall);
        }
    }, 5000);
}

})();


        if (boton && (
            (hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) ||
            grecaptcha.getResponse().length > 0 ||
            (recaptchav3 && recaptchav3.value.length > 0) ||
            (turnstile && turnstile.value.length > 0)
        )) {
            boton.click();
            clearInterval(firewall);
        }
    }, 5000);
}

})();
