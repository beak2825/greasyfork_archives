// ==UserScript==
// @name         Earn Tron Instantly
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Free Tron
// @author       lotocamion
// @match        http://tron-earn.cf/*
// @match        http://tron-earn.cf/
// @icon         https://www.google.com/s2/favicons?domain=tron-earn.cf
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437280/Earn%20Tron%20Instantly.user.js
// @updateURL https://update.greasyfork.org/scripts/437280/Earn%20Tron%20Instantly.meta.js
// ==/UserScript==

(function() {
    'use strict';

     // EDIT YOUR ADDRESS HERE //
         var Tron= "D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn"/////Example/////


         var clicked = false;
         var Address = false;
         setInterval(function() {
         if (document.querySelector("body > div.container-fluid > div:nth-child(2) > div.col-xs-12.col-md-6.col-md-push-3.bg-primary.active > form > div.step2 > div:nth-child(2) > div > input")) {
         document.querySelector("body > div.container-fluid > div:nth-child(2) > div.col-xs-12.col-md-6.col-md-push-3.bg-primary.active > form > div.step2 > div:nth-child(2) > div > input").value = Tron;
         Address = true;
         }}, 1000);
         setInterval(function() {
         if (!clicked && document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
         document.querySelector("body > div.container-fluid > div:nth-child(2) > div.col-xs-12.col-md-6.col-md-push-3.bg-primary.active > form > div.step2 > div:nth-child(5) > div > input").click();
         clicked = true;
         }}, 500);
         var site = "http://tron-earn.cf/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d"
         setInterval(function() {
         if (document.querySelector("body > div.container-fluid > div:nth-child(2) > div.col-xs-12.col-md-6.col-md-push-3.bg-primary.active > div")) {
         window.location.href = site;
         }}, 60000);
          setTimeout(function() {
         window.location.replace(window.location.pathname + window.location.search + window.location.hash);
         }, 180000);
         })();