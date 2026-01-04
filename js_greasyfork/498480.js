// ==UserScript==
// @name         claimtrx.com
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  claimtrx
// @author       LTW
// @license none
// @match        https://claimtrx.com/faucet
// @match        https://claimtrx.com/faucet/verify
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimtrx.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498480/claimtrxcom.user.js
// @updateURL https://update.greasyfork.org/scripts/498480/claimtrxcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
const redirecionamento = 'https://feyorra.top/faucet';
 let hasClaimed = false;

    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

async function claimReward() {
    var inputElement = document.querySelector('input[id*="normal-captcha-answer"]');

    if (inputElement && inputElement.value.trim() !== '' && !hasClaimed) {
        const claimButton = document.querySelector('button[type="submit"].btn.btn-primary.btn-lg.claim-button');

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
if(window.location.href.includes('/verify')){setTimeout(() =>{window.location.href = 'https://claimtrx.com/faucet'},3000);}

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
setTimeout(()=>{window.location.href = window.location.href;},35*1000);

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
