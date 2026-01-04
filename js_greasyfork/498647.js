// ==UserScript==
// @name         CryptoEarns Automation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate tasks on CryptoEarns website
// @author       LTW
// @match        https://cryptoearns.com/*
// @license      none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptoearns.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498647/CryptoEarns%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/498647/CryptoEarns%20Automation.meta.js
// ==/UserScript==

(function () {
    'use strict';
const redirecionamento = 'https://bithub.win/faucet';

        let hasClaimed = localStorage.getItem('hasClaimed') === 'true';

        setInterval(function () {
            var errorMessageContainer = document.getElementById('captcha-solve');
            if (errorMessageContainer) {
                var errorMessage = errorMessageContainer.querySelector('.captcha-error');
                if (errorMessage && errorMessage.textContent.trim() === 'Something Went Wrong') {
                        location.reload();
                }
            }
        }, 1000);

        setTimeout(function () {
            window.location.href = redirecionamento;
        }, 60000);

        if (window.location.href === "https://cryptoearns.com/") {
            window.location.href = "https://cryptoearns.com/login";
            return;
        }

        if (window.location.href === "https://cryptoearns.com/dashboard") {
            window.location.href = "https://cryptoearns.com/faucet";
            return;
        }

        if (window.location.href.includes("https://cryptoearns.com/faucet")) {
            function verificarMensagem() {
                var divCaptchaSolverInfo = document.querySelector('.captcha-solver-info');
                if (
                    divCaptchaSolverInfo &&
                    (divCaptchaSolverInfo.innerText.trim() === 'Antibot WRONG_RESULT' ||
                        divCaptchaSolverInfo.innerText.trim() === "Antibot Cannot read properties of undefined (reading 'antibot')")
                ) {
                    setTimeout(function () {
                        location.reload();
                    }, 5000);
                }
            }

            setInterval(verificarMensagem, 20000);

            function mbsolver() {
                const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
                return valorAntibotlinks.length === 12;
            }

                        function claimReward(buttonSelector) {
var inputElement = document.getElementById('rscaptcha_response');
                if (!hasClaimed && inputElement && inputElement.value !== '' && mbsolver()) {
                    const claimButton = document.querySelector(buttonSelector);
                    if (claimButton) {
                        claimButton.click();
                        hasClaimed = true;
                        localStorage.setItem('hasClaimed', 'true');
                    } else {
                    }
                } else {

                }
            }

            const pageTitle = document.title.toLowerCase();
            if (pageTitle.includes('just a moment') || pageTitle.includes('um momento')) {
                console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
                return;
            }
            setInterval(function () {
                if (!pageTitle.includes('just a moment') || !pageTitle.includes('um momento')) {
                    claimReward('button.claim-button');
                }
            }, 3000);
        }
        if (hasClaimed) {
            setTimeout(() => {
                localStorage.setItem('hasClaimed', 'false');
                window.location.href = redirecionamento;
            }, 5000);
        }

function checkForDailyLimitReached() {
    var alertElements = document.querySelectorAll('div.alert.alert-warning.text-center');

    alertElements.forEach(function(element) {
        var content = element.textContent;

        if (content.includes('Daily Limit Reached')) {
            window.location.href = redirecionamento;
        }
    });
}


        window.onload = function () {
            checkForDailyLimitReached();
        };

})();
