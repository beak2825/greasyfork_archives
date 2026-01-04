// ==UserScript==
// @name         Yandex SmartCaptcha Autoclick
// @namespace    https://tampermonkey.net/
// @version      1.9
// @description  Automatically click Yandex Smart Captcha checkbox button when detected it and doesn't solve the captcha for you!
// @author       Streampunk
// @icon         data:image/png;base64,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
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462283/Yandex%20SmartCaptcha%20Autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/462283/Yandex%20SmartCaptcha%20Autoclick.meta.js
// ==/UserScript==

(function(){
    'use strict';
let isYandexSmartCaptchaFrame_1 = () => {
  return /showcaptcha/.test(window.location.pathname);
};

let isYandexSmartCaptchaFrame_2 = () => {
  return /captcha-api.yandex.ru/.test(window.location.hostname);
};

let isYandexSmartCaptchaFrame_3 = () => {
  return /smartcaptcha.cloud.yandex.ru/.test(window.location.hostname);
};

let isYandexSmartCaptchaFrame_4 = () => {
  return /smartcaptcha/.test(window.location.hostname);
};

let captchaInterval_1 = setInterval(() => {
  if (isYandexSmartCaptchaFrame_1()) {
    clearInterval(captchaInterval_1);
    document.querySelector("#js-button").click();
  }  
}, 500);

let captchaInterval_2 = setInterval(() => {
  if (isYandexSmartCaptchaFrame_2()) {
    clearInterval(captchaInterval_2);
    document.querySelector("#checkbox > div > div > div > div > input").click();
    document.getElementById("smartcaptcha-demo-submit").click();
  }  
}, 500);

let captchaInterval_3 = setInterval(() => {
  if (isYandexSmartCaptchaFrame_3()) {
    clearInterval(captchaInterval_3);
    document.querySelector("#js-button").click();
  }  
}, 500);

let captchaInterval_4 = setInterval(() => {
  if (isYandexSmartCaptchaFrame_4()) {
    clearInterval(captchaInterval_4);
    document.querySelector("#js-button").click();
  }  
}, 500);

})();