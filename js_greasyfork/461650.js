// ==UserScript==
// @name        reCaptcha Autoclick
// @namespace   https://tampermonkey.net/
// @version     1.5
// @description Automatically click reCaptcha checkbox button when detected it and doesn't solve the captcha for you!
// @author      Streampunk
// @icon        data:image/png;base64,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
// @match       http://*/*
// @match       https://*/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461650/reCaptcha%20Autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/461650/reCaptcha%20Autoclick.meta.js
// ==/UserScript==

(function(){
    'use strict';
	
let isRecaptchaFrame_1 = () => {
  return /https:\/\/www.google.com\/recaptcha\/api2\/anchor/.test(window.location.href);
};

let isReCaptchaFrame_2 = () => {
  return /https:\/\/www.recaptcha.net\/recaptcha\/api/.test(window.location.href);
};

let isReCaptchaFrame_3 = () => {
  return /https:\/\/recaptcha.net\/recaptcha\/api/.test(window.location.href);
};

let isReCaptchaFrame_4 = () => {
  return /https:\/\/www.recaptcha.net\/recaptcha\/api2/.test(window.location.href);
};

let isReCaptchaFrame_5 = () => {
  return /https:\/\/recaptcha.net\/recaptcha\/api2/.test(window.location.href);
};

let isReCaptchaFrame_6 = () => {
  return /https:\/\/www.google.com\/recaptcha\/enterprise/.test(window.location.href);
};

let captchaInterval_1 = setInterval(() => {
  if (isRecaptchaFrame_1()) {
    clearInterval(captchaInterval_1);
    document.getElementsByClassName('recaptcha-checkbox-checkmark')[0].click();
  }  
}, 500);

let captchaInterval_2 = setInterval(() => {
  if (isReCaptchaFrame_2()) {
    clearInterval(captchaInterval_2);
    document.querySelector(".recaptcha-checkbox-border").click();
  }  
}, 500);

let captchaInterval_3 = setInterval(() => {
  if (isReCaptchaFrame_3()) {
    clearInterval(captchaInterval_3);
    document.querySelector(".recaptcha-checkbox-border").click();
  }  
}, 500);

let captchaInterval_4 = setInterval(() => {
  if (isReCaptchaFrame_4()) {
    clearInterval(captchaInterval_4);
    document.querySelector(".recaptcha-checkbox-border").click();
  }  
}, 500);

let captchaInterval_5 = setInterval(() => {
  if (isReCaptchaFrame_5()) {
    clearInterval(captchaInterval_5);
    document.querySelector(".recaptcha-checkbox-border").click();
  }  
}, 500);

let captchaInterval_6 = setInterval(() => {
  if (isReCaptchaFrame_6()) {
    clearInterval(captchaInterval_6);
    document.querySelector(".recaptcha-checkbox-border").click();
  }  
}, 500);

})();