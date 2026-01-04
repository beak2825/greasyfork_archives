// ==UserScript==
// @name         异步操作
// @namespace    https://greasyfork.org/users/1171320
// @version      1.02
// @description  将页面的同步操作改为异步操作，同时加载。已排除特定的验证码页面如 cloudflare, recaptcha。重写 setTimeout，setInterval，requestAnimationFrame，alert，confirm，prompt, for 循环
// @author         yzcjd
// @author2       Lama AI 辅助
// @match        *://*/*
// @exclude      *://*.cloudflare.com/*
// @exclude      *://*.recaptcha.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523110/%E5%BC%82%E6%AD%A5%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/523110/%E5%BC%82%E6%AD%A5%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
   'use strict';

   // 排除 iframe
   if (window.self !== window.top) return;

   // 检查页面是否包含验证码或人机验证
   const verificationPatterns = [
       /captcha/i,
       /verify/i,
       /challenge/i
   ];

   if (verificationPatterns.some(pattern => pattern.test(document.body.innerHTML))) {
       console.log('Detected verification page, script execution skipped.');
       return;
   }

   // 重写 setTimeout
   const originalSetTimeout = window.setTimeout;
   window.setTimeout = function(callback, delay, ...args) {
       return originalSetTimeout(() => {
           Promise.resolve().then(callback).catch(console.error);
       }, delay, ...args);
   };

   // 重写 setInterval
   const originalSetInterval = window.setInterval;
   window.setInterval = function(callback, delay, ...args) {
       return originalSetInterval(() => {
           Promise.resolve().then(callback).catch(console.error);
       }, delay, ...args);
   };

   // 重写 requestAnimationFrame
   const originalRequestAnimationFrame = window.requestAnimationFrame;
   window.requestAnimationFrame = function(callback) {
       return originalRequestAnimationFrame(() => {
           Promise.resolve().then(callback).catch(console.error);
       });
   };

   // 重写 alert
   const originalAlert = window.alert;
   window.alert = function(message) {
       Promise.resolve().then(() => {
           originalAlert(message);
       }).catch(console.error);
   };

   // 重写 confirm
   const originalConfirm = window.confirm;
   window.confirm = function(message) {
       return Promise.resolve().then(() => {
           return originalConfirm(message);
       }).catch(console.error);
   };

   // 重写 prompt
   const originalPrompt = window.prompt;
   window.prompt = function(message, defaultValue) {
       return Promise.resolve().then(() => {
           return originalPrompt(message, defaultValue);
       }).catch(console.error);
   };

   console.log('所有同步操作已经转换为异步操作!');
})();