// ==UserScript==
// @name         Window Name Eraser
// @namespace    https://tampermonkey.net/
// @version      1.4
// @description  Preventing data leakage through window.name
// @author       Streampunk
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAIVBMVEVImONImeP///9Hlt5Hlt87kd0vjt2ox+2AsebU4vVcn+Fv9GsLAAAAAnRSTlPx8MaJ79gAAAE6SURBVFiF7ZfrjsQgCIW9AIrv/8CrTicbRWstO8ls0vPTgW8OirQ11hqNcjZo5K2x4BUC8wAewApAmGJWQroDQIrsDnEk3AVQdI3i2MUUQMF1CkPCBABHfoiACEcpgUaREwepVo5H4QQVka47IG48w2uBB0VMAEmEV8LAwhiAoY+GygzyLCcAln6LBb4KKMH9vxVXg034EAD/xAFhI7oOyK1XTjF0KueYG3MNkLfg7EZIAJ7mi72RADrPd44WAFwBVg6+DcAR8Xc07gO4zFIkvg1AD4O164B36zYWdgDvpmmaaw9Qf4PbgNx1UEeq4hTEFuz2Ab7Gy21ACZcrOwDSAlBc8H0HOkDKUgGkPg7Qz0TtVF7V0D1ZJAA88DydwcMCULahvl6OlMTD8dvflR/A/wHoPr6LA2NV+gHVqi9JB+PEwAAAAABJRU5ErkJggg==
// @match        http://*/*
// @match        https://*/*
// @exclude      https://www.google.com/recaptcha/api2/*
// @exclude      https://google.com/recaptcha/api2/*
// @exclude      https://www.google.com/recaptcha/enterprise/*
// @exclude      https://google.com/recaptcha/enterprise/*
// @exclude      https://www.recaptcha.net/recaptcha/api2/*
// @exclude      https://recaptcha.net/recaptcha/api2/*
// @exclude      https://www.recaptcha.net/recaptcha/enterprise/*
// @exclude      https://recaptcha.net/recaptcha/enterprise/*
// @exclude      https://mail.proton.me/*
// @exclude      https://swisscows.email/*
// @exclude      https://webmail.vivaldi.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460925/Window%20Name%20Eraser.user.js
// @updateURL https://update.greasyfork.org/scripts/460925/Window%20Name%20Eraser.meta.js
// ==/UserScript==

'use strict';

//Prevent the website from starting
 var a = window.onload;
 window.onload = "";

//Remove property
 var old = window.name;
 window.name = "";

if (old != "" ) {
 console.log("Evaluating results");
 Firefox.extension.sendMessage({url: document.domain, caption: old}, function(response)
 {
 switch (response.radio) {
 case "fallback":
 //White listed: bring back the property
 window.name = old;
 console.log("Window Name Eraser: Whitelisted domain");
 break;
 default:
 console.log("Window Name Eraser: Blocked domain");
 break;
 }
 //Let the website start
 var getType = {};
 if (a && getType.toString.call(a) == '[object Function]') {
 window.onload = function () { a(); }
 }
 });
 }
 else {
 //Let the website start
 var getType = {};
 if (a && getType.toString.call(a) == '[object Function]') {
 window.onload = function () { a(); }
 }
 console.log("Window Name Eraser: Nothing to block here");
 }