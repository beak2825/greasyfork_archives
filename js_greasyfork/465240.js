// ==UserScript==
// @name         rumble
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT
// @description  rumble install
// @author       Bboy Tech
// @match        https://rumble.com/*
// @icon         https://www.google.com/s2/favicons?domain=rumble.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465240/rumble.user.js
// @updateURL https://update.greasyfork.org/scripts/465240/rumble.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var claimaTimer = setInterval (function() {claima(); }, Math.floor(Math.random() * 500) + 500);
    var claimbTimer = setInterval (function() {claimb(); }, Math.floor(Math.random() * 1000) + 1000);
    var claimcTimer = setInterval (function() {claimc(); }, Math.floor(Math.random() * 900000) + 1200000);

     function claima() {
         document.querySelector("div > div:nth-child(11) > ul > li:nth-child(2) > a > div").click();
         document.querySelector("body > main > div > article > div.main-and-sidebar > aside > ul > li.mediaList-item.first-item > a").click();
      }
      function claimb() {
         document.getElementsByClassName("bigPlayUIInner ctp")[0].click();
      }
      function claimc() {
         document.querySelector("body > main > div > article > div.main-and-sidebar > aside > ul > li.mediaList-item.first-item > a").click();
      }
})();