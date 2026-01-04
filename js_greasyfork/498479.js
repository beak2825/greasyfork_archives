// ==UserScript==
// @name         feyorra.top
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  feyorra
// @author       LTW
// @license none
// @match        https://feyorra.top/faucet
// @match        https://feyorra.top/faucet/verify
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feyorra.top
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498479/feyorratop.user.js
// @updateURL https://update.greasyfork.org/scripts/498479/feyorratop.meta.js
// ==/UserScript==

(function() {
    'use strict';
const redirecionamento = 'https://claimtrx.com/faucet';
    let hasClaimed = false;

    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

async function claimReward() {
    var inputElement = document.querySelector('input[id*="normal-captcha-answer"]');

    if (inputElement && inputElement.value.trim() !== '' && !hasClaimed) {
        const claimButton = document.querySelector('button[type="submit"]');

        if (claimButton) {
            try {
                await delay(1000);

                hasClaimed = true;
                claimButton.click();
            } catch (error) {
                console.error("Erro ao reivindicar a recompensa:", error);
            }
        }
    }
}
if(window.location.href.includes('/verify')){setTimeout(() =>{window.location.href = 'https://feyorra.top/faucet'},3000);}
setTimeout(()=>{window.location.href = window.location.href;},35*1000);

    setInterval(() => {
        claimReward();
    }, 1000);

const minuteElement = document.getElementById('minute');

if (minuteElement && !isNaN(parseInt(minuteElement.textContent))) {
  const minuteValue = parseInt(minuteElement.textContent);
  if (minuteValue > 1) {
    window.location.href = redirecionamento;
  }
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
};
})();
