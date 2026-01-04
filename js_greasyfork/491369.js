// ==UserScript==
// @name         bitmonk.me
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  O script faz login, PTC, coleta o bônus diário e, em seguida, acessa a faucet.
// @author       You
// @match        https://bitmonk.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitmonk.me
// @license      NONE
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/491369/bitmonkme.user.js
// @updateURL https://update.greasyfork.org/scripts/491369/bitmonkme.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    const AutoSaque = true;
    const Saque = 0.15; // valor para iniciar o saque em dolares minimo 0.15
    const methodo = "USDT"; //moeda para saque
    const endereço = ""; // endereço Faucetpay para saque
    const redirecionamento = "https://banfaucet.com/faucet"; //url para redirecionar apos  claim
    const login = ""; // username para login
    const senha = ""; // senha

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const select = (selector) => document.querySelector(selector);
    const selectValue = (selector) => select(selector)?.value?.replace(/\s/g, '');

    if (window.location.href === 'https://bitmonk.me/dashboard' || window.location.href === 'https://bitmonk.me/dashboard/') {
        window.location.href = 'https://bitmonk.me/ptc';
    }

    if (window.location.href.includes('dailybounus')) {
        const checkAndClaim = () => {
            const claimButtons = document.querySelectorAll('a.btn.btn-soft-success.btn-sm');
            let disabledCount = 0;

            claimButtons.forEach(button => {
                if (!button.classList.contains('disabled')) {
                    button.click();
                } else {
                    disabledCount++;
                }
            });

            if (disabledCount === claimButtons.length) {
                window.location.href = 'https://bitmonk.me/faucet';
            }
        };

        setTimeout(checkAndClaim, 5000);
    }

    if (window.location.href.includes('https://bitmonk.me/ptc/view/')) {
        let wasclicked = false;
        const checkAndClaim1 = async () => {
            if (grecaptcha && grecaptcha.getResponse().length !== 0 && !wasclicked) {
                const Button = document.querySelector('.btn.btn-success');
                setTimeout(function() {
                    Button.click();
                    wasclicked = true;
                }, 3000);
            }
        };

        setInterval(async () => {
            await checkAndClaim1();
        }, 5000);
    }

    setTimeout(function() {
        if (window.location.href === 'https://bitmonk.me/ptc') {
            setTimeout(function() {
                var links = [
                    'https://bitmonk.me/ptc/view/408',
                    'https://bitmonk.me/ptc/view/64'
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
                    window.location.href = 'https://bitmonk.me/dailybounus';
                }
            }, 3000);
        }
    }, 3000);

    if (window.location.href.includes("/login")) {
        setTimeout(function () {
            document.getElementById("username").value = login;
            var elementosSenha = document.getElementsByName("password");
            for (var i = 0; i < elementosSenha.length; i++) {
                elementosSenha[i].value = senha;
            }
            let buttonClicked = false;

            const checkAndClick = () => {
                if (!buttonClicked && grecaptcha && grecaptcha.getResponse().length !== 0) {
                    const logInButton = document.querySelector('button[type="submit"]');
                    if (logInButton && logInButton.textContent.trim() === "Sign In") {
                        logInButton.click();
                        buttonClicked = true;
                    }
                }
                setTimeout(checkAndClick, 1000);
            };

            setTimeout(checkAndClick, 3000);
        }, 3000);
    }

    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

    if (wasButtonClicked()) {
        setTimeout(function () {
            window.location.href = 'https://banfaucet.com/faucet';
            removeButtonClicked();
        }, 3000);
    }

    const checkAndClaim = async () => {
        if (window.location.href.includes("/faucet") && grecaptcha && grecaptcha.getResponse().length !== 0 && !wasButtonClicked()) {
            const readyText = document.querySelector('h4#timer_text');
            if (readyText && readyText.textContent.trim() === 'Ready!') {
                await sleep(3000);
                select('.btn.btn-primary.mx-3')?.click();
                setButtonClicked();
            }
        }
    };

    if (AutoSaque === true) {
        setTimeout(function() {
            function acionarWithdraw() {
                const withdrawButton = document.querySelector('.btn.btn-success');
                if (withdrawButton && withdrawButton.textContent.trim() === 'Withdraw') {
                    withdrawButton.click();
                }
            }

            const valorConversao = 0.0000028;
            const divElement = document.querySelector('.choices__item--selectable');
            const coinsValue = divElement.getAttribute('data-value');
            const coins = parseFloat(coinsValue.split(' ')[0]);
            const valorDolares = coins * valorConversao;

            if (AutoSaque === true) {
                setTimeout(function() {
                    function acionarWithdraw() {
                        const withdrawButton = document.querySelector('.btn.btn-success');
                        if (withdrawButton && withdrawButton.textContent.trim() === 'Withdraw') {
                            withdrawButton.click();
                        }
                    }

                    const tempoEspera = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
                    if (valorDolares > Saque && window.location.href !== "https://bitmonk.me/withdrawl") {
                        window.location.href = "https://bitmonk.me/withdrawl";
                    }
                    if (window.location.href === "https://bitmonk.me/withdrawl") {
                        const withdrawlAmountInput = document.getElementById('amount');
                        if (valorDolares > Saque) {
                            withdrawlAmountInput.value = Math.floor(coins);
                            document.getElementById('address').value = endereço;
                            setTimeout(acionarWithdraw, tempoEspera);
                        } else {
                            window.location.href = "https://bitmonk.me/faucet";
                        }
                    }

                    const col6Elements = document.querySelectorAll('.col-6');
                    col6Elements.forEach(element => {
                        if (element.textContent.includes(methodo)) {
                            element.click();
                            return;
                        }
                    });
                }, 5000);
            }

            setTimeout(function () {
                location.reload();
            }, 180000);
            setInterval(async () => {
                await checkAndClaim();
            }, 5000);
            if (window.location.href.includes("firewall")) {
                let firewall = setInterval(function() {
                    let recaptchav3 = document.querySelector("input#recaptchav3Token");
                    let hcaptcha = document.querySelector('.h-captcha > iframe');
                    let turnstile = document.querySelector('.cf-turnstile > input');
                    let boton = document.querySelector('button[type="submit"].btn.btn-primary.w-md');

                    if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstile && turnstile.value.length > 0))) {
                        boton.click();
                        clearInterval(firewall);
                    }
                }, 3000);
            }
        }, 5000);
    }
})();
