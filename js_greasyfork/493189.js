// ==UserScript==
// @name         ClaimCash
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  auto login e faucet
// @author       LTW
// @license      none
// @match        https://claimcash.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimcash.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493189/ClaimCash.user.js
// @updateURL https://update.greasyfork.org/scripts/493189/ClaimCash.meta.js
// ==/UserScript==


(async function() {
    'use strict';
const email = "";
const senha = "";
const redirecionamento = "https://bitupdate.info/faucet";
const saque = ""; // carteira para saque
const AutoSaque = true;
const startsaque = 10000; //valor em tokens para saque

if(AutoSaque === false){
if(window.location.href === 'https://claimcash.cc/dashboard'){
window.location.href = 'https://claimcash.cc/faucet';
}
}

if(AutoSaque === true){
if(window.location.href === 'https://claimcash.cc/dashboard'){
setTimeout(function() {
var mediaBodies = document.querySelectorAll('.media-body');
var encontrado = false;
mediaBodies.forEach(function(mediaBody) {
    var textElement = mediaBody.querySelector('p.text-muted.font-weight-medium');
    if (textElement && textElement.textContent.trim() === 'Balance') {
        var tokensElement = mediaBody.querySelector('h4.mb-0');
        if (tokensElement) {
            var tokensText = tokensElement.textContent.trim();
            var tokens = parseInt(tokensText);
            if (tokens > startsaque) {
                var inputElement = document.querySelector('input[name="wallet"]');
                if (inputElement) {
                    inputElement.value = saque;
                    setTimeout(function() {
                        var withdrawButton = document.querySelector('.btn.btn-success');
                        if (withdrawButton) {
                            withdrawButton.click();
                        }
                    }, 3000);
                }
            } else {
                encontrado = true;
                window.location.href = 'https://claimcash.cc/faucet';
            }
        }
    }

});
}, 3000);
}
}
    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://claimcash.cc/' || url === 'https://claimcash.cc') {
            window.location.href = 'https://claimcash.cc/login';
        }
    };
    const waitForElement = async (selector) => {
        while (!document.querySelector(selector)) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return document.querySelector(selector);
    };

    const preencherCampos = async () => {
        const [emailInput, passwordInput] = await Promise.all([waitForElement('#email'), waitForElement('#password')]);

        if (emailInput && passwordInput) {
            emailInput.value = email;
            passwordInput.value = senha;

            await waitForCaptchaCompletion();

            clicarBotaoLogin();
        }
    };

    const clicarBotaoLogin = () => {
        const signInButton = document.querySelector('.btn.btn-primary.btn-block.waves-effect.waves-light');

        if (signInButton) {
            signInButton.dispatchEvent(new MouseEvent('click'));
        }
    };

    const waitForCaptchaCompletion = async () => {
        while (!(grecaptcha && grecaptcha.getResponse().length > 0)) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    const executeScript = async () => {
        handlePageRedirection();

        if (window.location.href.includes('https://claimcash.cc/login')) {
            await preencherCampos();
        }
    };
setTimeout(function() {
    if (window.location.href === "https://claimcash.cc/links") {
        setTimeout(function() {
            var links = [
                'https://claimcash.cc/links/pre_verify/143',
            ];

            var linkFound = false;

            for (var i = 0; i < links.length; i++) {
                var link = document.querySelector('a[href="' + links[i] + '"]');
                if (link) {
                    var badge = link.querySelector('.badge.badge-info');
                    if (badge && badge.textContent.trim() !== '2/5') {
                        window.location.href = link.href;
                        linkFound = true;
                        break;
                    } else {
                        window.location.href = redirecionamento;
                        linkFound = true;
                        break;
                    }
                }
            }

            if (!linkFound) {
               window.location.href = redirecionamento;
            }
        }, 1000);
    }
}, 1000);
const intervalID = setInterval(() => {
    if (window.location.href.includes("https://claimcash.cc/links/pre_verify")) {
        if (mbsolver()) {
            const submitButton = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
            if (submitButton) {
                submitButton.click();
                clearInterval(intervalID);
            }
        }
    }
}, 3000);
    await executeScript();

var button = document.querySelector('button.btn-primary.btn-lg');
if (window.location.href.includes("/faucet") && button){
if (button.innerHTML.includes('You need to do 2 more shortlinks to unlock') || button.innerHTML.includes('You need to do 1 shortlinks to unlock') || button.innerHTML.includes('You need to do 1 more shortlinks to unlock') || button.innerHTML.includes('You need to do 2 shortlinks to unlock')) {
    var href = window.location.href;
    var newHref = href.replace('/faucet', '/links');
    window.location.href = newHref;
}
}
const minuteElement = document.getElementById('minute');

if (minuteElement && !isNaN(parseInt(minuteElement.textContent))) {
  const minuteValue = parseInt(minuteElement.textContent);
  if (minuteValue > 1) {
    window.location.href = redirecionamento;
  }
}

    let hasClicked = false;

    function mbsolver() {
        const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
        return valorAntibotlinks.length !==0;
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
const paragraphElement = document.querySelector('p.lh-1.mb-1.font-weight-bold');


    function checkForDailyLimitReached() {

    var textElements = document.querySelectorAll('body *');

    textElements.forEach(function(element) {

        if (element.textContent.includes('Daily limit reached, claim from Shortlink Wall to earn energy')) {

       window.location.href = redirecionamento;
        }
    });
}
setTimeout(function () {
    checkForDailyLimitReached();
}, 5000);

            setTimeout(function () {
            location.reload();
        }, 120000);
    setInterval(function() {


        if (window.location.href.includes("/faucet") && grecaptcha && grecaptcha.getResponse().length !== 0 && mbsolver() && !wasButtonClicked()) {

           const submitButton = document.querySelector('.btn.btn-primary.btn-lg');
            if (submitButton && !submitButton.disabled) {
                submitButton.dispatchEvent(new MouseEvent('click'));
                setButtonClicked();
            }
        }
    }, 3000);
})();
