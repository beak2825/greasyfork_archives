// ==UserScript==
// @name        Feyorra, Earn-pep3, etc. (Autofaucet)
// @namespace   Violentmonkey Scripts
// @match       https://feyorra.site/claim
// @match       https://earn-pepe.com/claim
// @match       https://feyorra.site/crazy
// @match       https://earn-pepe.com/crazy
// @grant       none
// @version     1.0
// @author      leenox_Uzer
// @description 4/20/2024, 1:35:42 PM
// @downloadURL https://update.greasyfork.org/scripts/494225/Feyorra%2C%20Earn-pep3%2C%20etc%20%28Autofaucet%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494225/Feyorra%2C%20Earn-pep3%2C%20etc%20%28Autofaucet%29.meta.js
// ==/UserScript==

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function solveCaptcha() {
  let captchaStatus = document.querySelector('#captcha-result').innerText.toUpperCase();
  let captchaIconElement = document.querySelector('.captcha-icon');
  let answerClassName = captchaIconElement.classList[2]
  let answerElement = document.querySelector(`i.${answerClassName}`);
  //alert("Answer is: " + answerElement);
  answerElement.click();
}

(async () => {
    if (window.document.body.innerText.includes("Human")) return;
    const claimButton = document.querySelector('.claim-button');
  /*
    if (window.location.pathname != '/claim') {
      window.location.pathname = '/claim';
    }
    */
    await sleep(4000);
    solveCaptcha();
    await sleep(1000);
    //await sleep(2000);
    await new Promise((resolve) => {
      setInterval(() => {
        let captchaStatus = document.querySelector('#captcha-result').innerText.toUpperCase();
        if (claimButton.disabled === false && captchaStatus === "VERIFIED!") {
          clearInterval(this);
          resolve();
        }
      }, 1000);
    })
    //await sleep(3000);
    claimButton.click();
})();
/*
window.addEventListener('load', async function() {
    if (window.location.pathname != '/claim') {
      window.location.pathname = '/claim';
    }
    // await sleep(2000);
    let claimButton = document.querySelector('.claim-button');
    let captchaStatus = document.querySelector('#captcha-result').innerText.toUpperCase();
    let captchaIconElement = document.querySelector('.captcha-icon');
    let answerClassName = captchaIconElement.classList[2]
    let answerElement = document.querySelector(`i.${answerClassName}`);
    //alert("Answer is: " + answerElement);
    //answerElement.click();
    //await sleep(2000);
    await new Promise((resolve) => {
      setInterval(() => {
        captchaStatus = document.querySelector('#captcha-result').innerText.toUpperCase();
        if (claimButton.disabled === false && captchaStatus === "VERIFIED!") {
          clearInterval(this);
          resolve();
        }
      }, 1000);
    })
    claimButton.click();

}, false)
*/