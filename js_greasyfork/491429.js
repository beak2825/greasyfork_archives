// ==UserScript==
// @name         SpaceShooter
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Coleta Faucet, Saque, Login e shortlinks
// @author       LTW
// @license      none
// @match        https://spaceshooter.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spaceshooter.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491429/SpaceShooter.user.js
// @updateURL https://update.greasyfork.org/scripts/491429/SpaceShooter.meta.js
// ==/UserScript==


(async function() {
    'use strict';
    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
        return;
            }else{
    var redirecionamento = "https://acryptominer.io/user/faucet" //url para redirecionar após coleta
    const login = ""; // Email para login e Saque
    const senha = ""; // Senha para Login
    var ComeçarSaque = 0.1; //valor em dolares
    var SaqueAuto = true; //mude para false para desativar
    var method = "SOL";
    /* metodos de saque
    BTC (FaucetPay)
    LTC (FaucetPay)
    USDT (Binance)
    SHIB (CWallet)
    PEPE (CWallet)
    SOL  (CWallet)
    */
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
if (SaqueAuto === true){
setTimeout(function () {
    var divElement = document.querySelector('.top-balance');
    var valueString = divElement.querySelector('p').innerText;
    var valueNumber = parseFloat(valueString.replace(/,/g, ''));
    var conversionRate = 0.01;
    var convertedValue = valueNumber / 10000000 * conversionRate;
    var finalValue = convertedValue.toFixed(2);

    if (window.location.href !== "https://spaceshooter.net/withdraw" && finalValue > ComeçarSaque) {
        window.location.href = "https://spaceshooter.net/withdraw";
    } else if (window.location.href === "https://spaceshooter.net/withdraw" && finalValue < ComeçarSaque) {
        window.location.href = "https://spaceshooter.net/faucet";
    } else {
        var methodInputs = document.querySelectorAll('.method');
        methodInputs.forEach(function(input) {
            if (input.getAttribute('data-coincode') === method) {
                input.checked = true;
                document.getElementById("wallet").value = login;
                var intervalo = Math.floor(Math.random() * (6000 - 2500 + 1)) + 2500;
                setTimeout(function() {
                    var buttons = document.querySelectorAll('button[type="submit"]');
                    for (var i = 0; i < buttons.length; i++) {
                        if (buttons[i].textContent.trim() === "Withdraw") {
                            buttons[i].click();
                            break;
                        }
                    }
                }, intervalo);
            }
        });
    }
}, 3000);
}

    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://spaceshooter.net/' || url === 'https://spaceshooter.net') {
            window.location.href = 'https://spaceshooter.net/login';
        } else if (url === 'https://spaceshooter.net/dashboard') {
            window.location.href = 'https://spaceshooter.net/faucet';
        }
    };

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
        return valorAntibotlinks.length !== 0;
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
if(window.location.href === "https://spaceshooter.net/faucet?linkrequired=true"){ window.location.href = 'https://spaceshooter.net/links';}
setTimeout(function() {
    if (window.location.href === "https://spaceshooter.net/links") {
        setTimeout(function() {
            var links = [
                'https://spaceshooter.net/links/go/12',
            ];

            var linkFound = false;

            for (var i = 0; i < links.length; i++) {
                var link = document.querySelector('a[href="' + links[i] + '"]');
                if (link) {
                    if (links[i] === 'https://spaceshooter.net/links/go/11') {
                        if (link.textContent.trim() !== 'Visit 6/10') {
                            window.location.href = link.href;
                            linkFound = true;
                        } else {
                            window.location.href = 'https://spaceshooter.net/faucet';
                            linkFound = true;
                        }
                    } else {
                        window.location.href = link.href;
                        linkFound = true;
                    }
                    break;
                }
            }

            if (!linkFound) {
                window.location.href = 'https://spaceshooter.net/faucet';
            }
        }, 1000);
    }
}, 1000);

const intervalID = setInterval(() => {
    if (window.location.href.includes("https://spaceshooter.net/links/go")) {
        let gpcaptcha = document.querySelector('input#captcha_choosen');
        if (gpcaptcha && gpcaptcha.value.length !== 0 && mbsolver()) {
            const submitButton = document.querySelector('button.btn.btn-success.btn-lg.text-white');
            if (submitButton) {
                submitButton.click();
                clearInterval(intervalID);
            }
        }
    }
}, 1000);


setTimeout(function () {
            location.reload();
        }, 120000);
    setInterval(function() {
        if (window.location.href.includes("/faucet")){
        const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
        let gpcaptcha = document.querySelector('input#captcha_choosen');
        if (gpcaptcha && gpcaptcha.value.length > 0 && mbsolver() && !wasButtonClicked()) {
            const submitButton = document.querySelector('button.btn.btn-success.text-white.btn-lg.claim-button[type="submit"]');
            if (submitButton) {
                submitButton.click();
                setButtonClicked();
            }
        }
      }
    }, 3000);
            }
})();