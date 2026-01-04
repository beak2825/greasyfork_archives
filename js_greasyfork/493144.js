// ==UserScript==
// @name         BitcoinTrophy
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  teste
// @author       LTW
// @license      none
// @match        https://bitcointrophy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitcointrophy.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493144/BitcoinTrophy.user.js
// @updateURL https://update.greasyfork.org/scripts/493144/BitcoinTrophy.meta.js
// ==/UserScript==

(async function() {
    'use strict';
     var redirecionamento = "https://spaceshooter.net/faucet" //url para redirecionar após coleta
    const login = ""; // Email para login
    const senha = ""; // Senha para Login

if (window.location.href.includes("/login")) {
    setTimeout(function () {
    document.getElementById("email").value = login;
    document.getElementById("password").value = senha;

    let buttonClicked = false;

    const checkAndClick = () => {
        if (!buttonClicked && grecaptcha && grecaptcha.getResponse().length !== 0) {
            const logInButton = document.querySelector('.btn-submit.w-100[type="submit"]');
            if (logInButton) {
                logInButton.click();
                buttonClicked = true;
            }
        }
        setTimeout(checkAndClick, 1000);
    };

     setTimeout(checkAndClick, 5000);
    }, 5000);
}
    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://bitcointrophy.com/' || url === 'https://bitcointrophy.com') {
            window.location.href = 'https://bitcointrophy.com/login';
        } else if (url === 'https://bitcointrophy.com/dashboard') {
            window.location.href = 'https://bitcointrophy.com/faucet';
        }
    };
function checkForDailyLimitReached() {

    var textElements = document.querySelectorAll('body *');

    textElements.forEach(function(element) {

        if (element.textContent.includes('Daily limit reached')) {

       window.location.href = redirecionamento;
        }
    });
}


    checkForDailyLimitReached();
    if (window.location.href.includes("/links")) {
    setTimeout(function() {
        var cards = document.querySelectorAll('.features_card.my-3');

        cards.forEach(function(card) {
            var heading = card.querySelector('.section_heading.text-center');
            if (heading && heading.textContent.trim() === "Clicksfly") {
                var button = card.querySelector('button.default-btn');
                var buttonText = button.textContent.trim();

                if (buttonText !== "Visit Shortlinks 7/10") {
                    window.location.href = 'https://bitcointrophy.com/links/go/11';
                    return;
                } else { window.location.href = redirecionamento;}
            }
        });
    }, 3000);
}




    if (window.location.href.includes("/faucet?linkrequired=true")) {
        window.location.href = 'https://bitcointrophy.com/links';}
const waitForElement = async (selector) => {
    while (!document.querySelector(selector)) {
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector);
};
const executeScript = async () => {
    handlePageRedirection();
};

    await executeScript();

    let hasClicked = false;

    function mbsolver() {
        const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
        return valorAntibotlinks.length === 12;
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
setTimeout(function () {
            location.reload();
        }, 120000);
setInterval(function() {
if (window.location.href.includes("/faucet")) {
    const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');

    let gpcaptcha = document.querySelector('#captcha_choosen');

    if (gpcaptcha && gpcaptcha.value.length > 0 && mbsolver() && !wasButtonClicked()) {
        const submitButton = document.querySelector('.claim-button');
        if (submitButton) {
            submitButton.click();
            setButtonClicked();
        }
    }
}


}, 3000);

})();