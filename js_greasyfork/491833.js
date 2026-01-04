// ==UserScript==
// @name         CoinPayZ
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Login, Faucet, Daily bonus, 8 Shortlinks e Saque.
// @author       LTW
// @license      none
// @match        https://coinpayz.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinpayz.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491833/CoinPayZ.user.js
// @updateURL https://update.greasyfork.org/scripts/491833/CoinPayZ.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const paymentMethod = "faucetpay"; // metodo de saque automatico entre payeer e faucetpay
    const redirecionamento = "https://coinpayz.xyz/faucet"; //url para redirecionar apos  claim
    const email = ""; // Email para saque FaucetPay e para login
    const senha = ""; // Senha para login
    const PayeerAccount = ""; //Saque payeer
    const tokenFaucetpay = "BITCOIN"; //token que ira sacar no metodo faucetpay
    const AutoSaque = true;
    const Saque = 0.10; //valor para começar o saque em dólares

//tokens para faucetpay copie e cole
/*
BITCOIN: 1
LITECOIN: 4
ETHEREUM: 64
DOGECOIN: 65
DASH: 66
DIGIBYTE: 67
TRON: 68
TETHER: 69
FEYORRA: 70
ZCASH: 71
BINANCE COIN: 72
SOLANA: 73
RIPPLE: 74
POLYGON: 75
BITCOIN CASH: 77
CARDANO: 78
TONCOIN: 79
*/

    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment') || pageTitle.includes('um momento')) {
        console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
        return;
    }

    setTimeout(function () {
        if (!pageTitle.includes('just a moment') || !pageTitle.includes('um momento')) {

            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            const select = (selector) => document.querySelector(selector);
            const selectValue = (selector) => select(selector)?.value?.replace(/\s/g, '');

if (window.location.href.includes("/dashboard")) {
    const claimLink = document.querySelector('a[href="https://coinpayz.xyz/daily"]');
    if (claimLink) {
        claimLink.click();
    } else {
        window.location.href = "https://coinpayz.xyz/faucet";
    }
}

if (window.location.href === "https://coinpayz.xyz/daily") {
    setTimeout(function() {
var countdownElement = document.querySelector(".btn.btn-warning.btn-block.text-uppercase.disabled");
if (countdownElement) {
    window.location.href = "https://coinpayz.xyz/faucet";
}
 }, 5000);
    function checkAnswerAndClaim() {
        var answerInput = document.getElementById("answer");
        if (answerInput && answerInput.value !== '') {
            var claimButton = document.querySelector(".btn.btn-success.btn-block.text-uppercase");
            if (claimButton && !claimButton.disabled) {
                setTimeout(function() {
                var clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                claimButton.dispatchEvent(clickEvent);
               }, 3000);
            } else {
                 window.location.href = "https://coinpayz.xyz/faucet";
            }
        } else {
            setTimeout(checkAnswerAndClaim, 1000);
        }
    }

    checkAnswerAndClaim();
}

function withdraw() {
    const divElement = document.querySelector('.col-12.text-center');
    if (divElement) {
        const textInsideDiv = divElement.textContent;
        const numericValue = parseFloat(textInsideDiv.match(/[\d.]+/g).join(''));
        const valordolar = numericValue * 0.00001;
        if (!isNaN(numericValue) && valordolar >= Saque) {
            if (window.location.href.indexOf("withdraw") === -1) {
                window.location.href = "https://coinpayz.xyz/withdraw";
            }
        }
    }
}
if(AutoSaque === true){
setTimeout(function() {
withdraw();
}, 5000);

if (window.location.href.includes("/withdraw")) {
    const divElement = document.querySelector('.col-12.text-center');
    if (divElement) {
        const textInsideDiv = divElement.textContent;
        const numericValue = parseFloat(textInsideDiv.match(/[\d.]+/g).join(''));
        const valordolar = numericValue * 0.00001;
        if (!isNaN(numericValue) && valordolar >= Saque) {
            var options = document.querySelectorAll('#gateways .dd-option');
            options.forEach(option => {
                var optionValue = option.querySelector('.dd-option-value').value;
                if (optionValue === paymentMethod) {
                    option.click();

                    if (paymentMethod === "faucetpay") {
                        var currencyOptions = document.querySelectorAll('#faucetpaycurrencies .dd-option');
                        currencyOptions.forEach(currencyOption => {
                            var currencyOptionValue = currencyOption.querySelector('.dd-option-value').value;
                            var currencyOptionText = currencyOption.querySelector('.dd-option-text').innerText;

                            if (currencyOptionValue === tokenFaucetpay || currencyOptionText.toLowerCase() === tokenFaucetpay.toLowerCase()) {
                                setTimeout(function () {
                                    currencyOption.click();
                                    setTimeout(function () {
                                        var walletInput = document.getElementById("waladd");
                                        walletInput.value = email;
                                        var withdrawButton = document.getElementById("checkbtn");
                                        if (withdrawButton) {
                                            withdrawButton.click();
                                            setTimeout(function() {
                                                var button = document.querySelector("button[type='submit'].btn-success");
                                                if (button) {
                                                    button.click();
                                                }
                                            }, 2000);
                                        }
                                    }, 1500);
                                }, 1500);
                            }
                        });
                    } else if (paymentMethod === "payeer") {
                        setTimeout(function () {
                            var payeerCurrencyOptions = document.querySelectorAll('#payeercurrencies .dd-option');
                            payeerCurrencyOptions.forEach(currencyOption => {
                                var currencyOptionValue = currencyOption.querySelector('.dd-option-value').value;
                                if (currencyOptionValue === "11") {
                                    currencyOption.click();
                                    setTimeout(function () {
                                        var walletInput = document.getElementById("waladd");
                                        walletInput.value = PayeerAccount;
                                        var withdrawButton = document.getElementById("checkbtn");
                                        if (withdrawButton) {
                                            withdrawButton.click();
                                            setTimeout(function() {
                                                var button = document.querySelector("button[type='submit'].btn-success");
                                                if (button) {
                                                    button.click();
                                                }
                                            }, 2000);
                                        }
                                    }, 1500);
                                }
                            });
                        }, 1500);
                    }
                }
            });
        } else {
            window.location.href = "https://coinpayz.xyz/faucet";
        }
    }
}
}
            if (window.location.href === 'https://coinpayz.xyz/' || window.location.href === 'https://coinpayz.xyz') {
                window.location.href = 'https://coinpayz.xyz/login';
            }
            if (window.location.href.includes("/login")) {
                document.getElementById("email").value = email;
                document.getElementById("password").value = senha;

                let buttonClicked = false;

                const checkAndClick = () => {
                    const answerInput = document.getElementById("answer");
                    if (!buttonClicked && answerInput.value !== '') {
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
            const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;

            const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
            const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
            const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

            const openModal = () => {
                setTimeout(function () {
                    const modalButton = select('[data-target="#myModal"]');
                    modalButton && modalButton.click();
                }, 7000);
            };

            setTimeout(function () {
                if (wasButtonClicked()) {
                    removeButtonClicked();
                    window.location.href = redirecionamento;
                }
            }, 3000);

            const checkAndClaim = async () => {
                const answerInput = document.getElementById("answer");
                const boostButton = document.querySelector('.btn.btn-info.btn-lg');
                const claimButton = document.querySelector('.btn.btn-primary.btn-lg');

                if (window.location.href.includes("/faucet") && answerInput.value !== '' && mbsolver() && !wasButtonClicked()) {
                    await sleep(1000);
                    if (boostButton && !boostButton.disabled) {
                        boostButton.click();
                        setButtonClicked();
                    } else if (claimButton && !claimButton.disabled) {
                        claimButton.click();
                        setButtonClicked();
                    }
                }
            };

            setTimeout(function () {
                location.reload();
            }, 160000);

            window.onload = openModal;
            openModal();

            setInterval(async () => {
                await checkAndClaim();
            }, 3000);
setTimeout(function () {
if (window.location.href.indexOf("faucet") > -1) {
    var alertWarnings = document.querySelectorAll('.alert.alert-warning');
    alertWarnings.forEach(function(alert) {
        if (alert.textContent.includes('Solve atleast 1 Shortlinks to continue claiming.')) {
          window.location.href = redirecionamento;
        }
    });
}
setTimeout(function() {
    if (window.location.href.includes("https://coinpayz.xyz/links")) {
        setTimeout(function() {
            var links = [
                'https://coinpayz.xyz/links/go/18',
                'https://coinpayz.xyz/links/go/23',
                'https://coinpayz.xyz/links/go/10',
                'https://coinpayz.xyz/links/go/38',
                'https://coinpayz.xyz/links/go/41',
                'https://coinpayz.xyz/links/go/3',
            ];

            var linkFound = false;

            for (var i = 0; i < links.length; i++) {
                var link = document.querySelector('a[href="' + links[i] + '"]');
                if (link) {
                    window.location.href = link.href;
                    linkFound = true;
                    break;
                }
            }

            if (!linkFound) {
                window.location.href = redirecionamento;
            }
        }, 3000);
    }
}, 3000);
}, 3000);
            if (window.location.href.includes("firewall")) {
                let firewall = setInterval(function () {
                    let recaptchav3 = document.querySelector("input#recaptchav3Token");
                    let hcaptcha = document.querySelector('.h-captcha > iframe');
                    let turnstile = document.querySelector('.cf-turnstile > input');
                    let boton = document.querySelector('button[type="submit"].btn.btn-primary.w-md');

                    if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstile && turnstile.value.length > 0))) {
                        boton.click();
                        clearInterval(firewall);
                    }
                }, 5000);
            }
        }
    }, 3000);
})();
