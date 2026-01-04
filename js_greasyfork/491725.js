// ==UserScript==
// @name         BigBtc
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Teste
// @author       LTW
// @license      none
// @match        https://bigbtc.win/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bigbtc.win
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491725/BigBtc.user.js
// @updateURL https://update.greasyfork.org/scripts/491725/BigBtc.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var redirecionamento = "https://bigbtc.win/faucet";

    function fillAddressAndSubmit() {
        const address = ""; //adicionar endereço de btc da faucetpay aqui
        const addressInput = document.querySelector('input[name="address"]');
        const enterButton = document.querySelector('input[value="ENTER"]');

        if (addressInput && enterButton) {
            addressInput.value = address;

            setTimeout(function () {
                enterButton.click();
            }, 10000);
        }
    }

    function recarregarPagina() {
        location.reload();
    }

    function verificarRespostaHcaptcha() {
        var iframe = document.querySelector('.h-captcha iframe[data-hcaptcha-response]');
        var clicked = localStorage.getItem('clicked') === 'true' || false;

        if (iframe) {
            var response = iframe.getAttribute('data-hcaptcha-response');
            if (response && !clicked) {
                setTimeout(function () {
                    const claimButton = document.querySelector('#claimbutn');

                    if (claimButton) {
                        localStorage.setItem('clicked', 'true');
                        claimButton.click();
                    }
                }, 3000);
            }
        }
    }

    const currentURL = window.location.href;
    if (currentURL === 'https://bigbtc.win'){
        window.onload = function () {
            fillAddressAndSubmit();
        };
    } else if (currentURL.includes('/faucet')) {
        function scrollToBottom() {
            window.scrollBy(0, window.innerHeight);
        }

        window.onload = function () {
            scrollToBottom();
            setInterval(verificarRespostaHcaptcha, 5000);
            setInterval(recarregarPagina, 180000);

            }
        };
function checkVisibilityAndCountdown() {
  var countdownElement = document.getElementById("countdown");
  if (countdownElement) {
    var countdownValue = parseInt(countdownElement.innerText);
    if (countdownValue > 30) {
      window.location.href = redirecionamento;
    }
  }
}

setTimeout(checkVisibilityAndCountdown, 4000);

if (localStorage.getItem('clicked') === 'true') {
      localStorage.setItem('clicked', 'false');
     }

})();