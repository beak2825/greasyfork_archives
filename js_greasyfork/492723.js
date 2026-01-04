// ==UserScript==
// @name        Tiktokcounter.net
// @namespace   Violentmonkey Scripts
// @match       https://tiktokcounter.net/*
// @match       https://vivgames.online/*
// @match       https://waezf.xyz/*
// @match       https://ashrfd.xyz/*
// @match       https://poqzn.xyz/*
// @grant       none
// @version     1.5
// @author      leenox_Uzer
// @description 3/24/2024, 2:36:27 AM
// @downloadURL https://update.greasyfork.org/scripts/492723/Tiktokcounternet.user.js
// @updateURL https://update.greasyfork.org/scripts/492723/Tiktokcounternet.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
  isHoverDone = true;
  isAdClickDone = true;
  isCaptchaCompleted = true;
  isTimerDone = true;
  assholeWhoReadsThis = true;
  let captchaCheck = document.querySelector('.h-captcha');
  //let captchaCheckInterval = null;

  let isRobotCheck = document.body.innerText;
  if (isRobotCheck === 'Cannot continue because you are a robot (INVALID CAPTCHA 2).') {
    window.history.back();
    return;
  }
  // Try this one?
  window.wT9882 -= 8;

  let fastInterval = setInterval(() => {
    let secondsLeft = document.querySelector('span.countdown').textContent;
    if (captchaCheck) {
      console.log("Captcha detected, will wait for captcha to be solved then will click on next")
      if ((grecaptcha && grecaptcha.getResponse().length !== 0) && parseInt(secondsLeft) === 0) {
        performMagic();
        clearInterval(fastInterval);
        fastInterval = null;
      }
    } else {
      console.log("No captcha detected, will wait for 15s then click next...")
      if (parseInt(secondsLeft) === 0) {
        performMagic();
        clearInterval(fastInterval);
        fastInterval = null;
      }
    }

  }, 350)

}, false);


const performMagic = () => {
  console.log("Timer has now reached zero... performing magic :D");
  isHoverDone = true;
  isAdClickDone = true;
  isCaptchaCompleted = true;
  isTimerDone = true;
  console.log("Clicking on next step!!!!!");
  document.getElementById('cbt').click();
  setTimeout(() => {
    document.getElementById('cbt').click();
  }, 1500);
  setTimeout(() => {
    document.getElementById('cbt').click();
  }, 300);
}