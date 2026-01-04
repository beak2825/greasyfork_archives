// ==UserScript==
// @name         faucetcrypto.com
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  FaucetCrypto
// @author       LTW
// @license      none
// @match        https://faucetcrypto.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucetcrypto.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496407/faucetcryptocom.user.js
// @updateURL https://update.greasyfork.org/scripts/496407/faucetcryptocom.meta.js
// ==/UserScript==

(function() {
    'use strict';
     const redirecionamento = '';

    function processPage() {
            if (window.location.href.includes('dashboard')) {
            const spanElement = document.querySelector('span.ml-2');
            if (spanElement) {
            const timeText = spanElement.textContent.trim();
            if (timeText.includes('m') && parseInt(timeText) > 1) {
            window.location.href = redirecionamento;
            }}
            var spans = document.querySelectorAll('span.ml-2');
            for (var i = 0; i < spans.length; i++) {
                if (spans[i].textContent.trim() === 'Claim Locked') {
                    window.location.href = 'https://faucetcrypto.com/ptc-advertisement/list';
                    return;
                }
            }

            var claimReadyButtons = document.querySelectorAll('span.ml-2');
            for (var j = 0; j < claimReadyButtons.length; j++) {
                if (claimReadyButtons[j].textContent.trim() === 'Ready To Claim!') {
                    claimReadyButtons[j].click();
                    return;
                }
            }
        }

        if (window.location.href === 'https://faucetcrypto.com/ptc-advertisement/list') {
            var c = document.querySelectorAll('span.ml-2');
            for (var t = 0; t < c.length; t++) {
                if (c[t].textContent.trim() === 'Ready To Claim!') {
                    c[t].click();
                    return;
                }
            }

            var buttons = document.querySelectorAll('button.justify-center');
            for (var n = 0; n < buttons.length; n++) {
                if (buttons[n].textContent.trim().includes('Window')) {
                    buttons[n].click();

                    setTimeout(function() {
                        var links = document.querySelectorAll('a');
                        for (var k = 0; k < links.length; k++) {
                            if (links[k].textContent.trim() === 'Watch') {
                                links[k].click();
                                return;
                            }
                        }
                    }, 3000);

                    return;
                }
            }
        }

        if (window.location.href.includes('https://faucetcrypto.com/ptc-advertisement/view-link/')) {
            setTimeout(() => {
                var continueLink = document.querySelector('a');
                if (continueLink && continueLink.textContent.trim() === 'Continue') {
                    continueLink.click();
                }
            }, 30000);
        }

if (window.location.href.includes('faucet-claim')) {
    var turnstileResponse = document.getElementsByName('cf-turnstile-response')[0];

    const captchaInterval = setInterval(() => {
        if (turnstileResponse && turnstileResponse.value.trim() !== '') {
            clearInterval(captchaInterval);

            setTimeout(() => {
                const buttons = document.querySelectorAll('button');
                buttons.forEach((button) => {
                    if (button.textContent.trim() === 'Validate Captcha' && !button.disabled) {
                        button.click();

                        const rewardInterval = setInterval(() => {
                            const rewardButtons = document.querySelectorAll('button');
                            rewardButtons.forEach((rewardButton) => {
                                if (rewardButton.textContent.trim() === 'Get Reward' && !rewardButton.disabled) {
                                    clearInterval(rewardInterval);
                                    setTimeout(() => rewardButton.click(), 2000);
                                }
                            });
                        }, 2000);
                    }
                });
            }, 15000);
        }
    }, 2000);
}


        if (window.location.href.includes('https://faucetcrypto.com/ptc-advertisement/view')) {
            const checkTurnstileInput = setInterval(async () => {
            if (turnstileResponse && turnstileResponse.value.trim() !== '') {
                clearInterval(checkTurnstileInput);
                const goToWindowInterval = setInterval(() => {
                    const buttons = document.querySelectorAll('button');
                    buttons.forEach((button) => {
                        if (button.textContent.trim() === 'Go to Window') {
                            clearInterval(goToWindowInterval);
                            setTimeout(() => {
                                button.click();
                            }, 2000);
                        }
                    });
                }, 2000);
            }
        }, 2000);
      }
    }
const noThanksInterval = setInterval(() => {
    document.querySelectorAll('button').forEach((button) => {
        if (button.textContent.trim() === 'No, Thanks') {
            clearInterval(noThanksInterval);
            setTimeout(() => button.click(), 2000);
        }
    });
}, 2000);
    setTimeout(processPage, 5000);
    setInterval(processPage, 15000);
})();