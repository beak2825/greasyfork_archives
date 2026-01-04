// ==UserScript==
// @name         new Coinmedia.in auto click manual faucet
// @namespace    работает как с tampermonkey, так и с violentmonkey
// @version      0.2
// @description  Автоматическое нажатие кнопки [Collect your reward] после прохождения капчи
// @author       Danik Odze
// @match        https://coinmedia.in/faucet
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544967/new%20Coinmediain%20auto%20click%20manual%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/544967/new%20Coinmediain%20auto%20click%20manual%20faucet.meta.js
// ==/UserScript==

(function () {

    'use strict';

    const waitAndClickButton = () => {
        let captchaCheckInterval = setInterval(function () {
            const button = document.querySelector('button.btn.btn-info');
            if (checkTurnstile()) {
                clearInterval(captchaCheckInterval);
				setTimeout(() => {// задержка нажатия кнопки
					button.click();
				}, 3000);
            }
        }, 1000); // Проверяйте каждые 1 секунду
    };

    function checkTurnstile() {// капча
        const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
        return turnstileResponse && turnstileResponse.value !== '';
    }

    const checkForMessageAndRedirect = () => {
    const swalTitle = document.querySelector('.swal2-title');
    const swalContent = document.querySelector('.swal2-html-container');
    const successMessage = "Your wallet was successfully linked";
    const insufficientFundsMessage1 = "The faucet does not have sufficient funds for this transaction.";
    const insufficientFundsMessage2 = "You are sending an invalid amount of payment to the user.";
    const insufficientFundsMessage3 = "You have been rate-limited. Please try again in a few seconds.";

    if (swalContent && (swalContent.innerText.includes(insufficientFundsMessage1) || swalContent.innerText.includes(insufficientFundsMessage2) || swalContent.innerText.includes(insufficientFundsMessage3))) {
		window.location.href = 'https://coinmedia.in/dashboard';
    }
};

    const checkTurnstileAndUnlock = () => {
        if (window.location.href === "https://coinmedia.in/firewall") {
            const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
            const unlockButton = document.querySelector('button[style*="background-color: #00008B"]');

            if (turnstileResponse && turnstileResponse.value !== '' && unlockButton) {
                unlockButton.click();
            }
        }
    };

    setTimeout(() => {
        waitAndClickButton();
        setInterval(checkForMessageAndRedirect, 2000);
       setInterval(checkTurnstileAndUnlock, 1000);
    }, 3000);
})();
