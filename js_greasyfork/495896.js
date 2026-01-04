// ==UserScript==
// @name        Messenger Dark Mode
// @namespace   Violentmonkey Scripts
// @match       https://www.messenger.com/*
// @grant       none
// @version     1.0
// @author      DrAg0r
// @license MIT
// @description 04/12/2023 16:33:53
// @downloadURL https://update.greasyfork.org/scripts/495896/Messenger%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/495896/Messenger%20Dark%20Mode.meta.js
// ==/UserScript==

window.onload = function(event) {
  darkAll();
  setInterval(function () {
    darkAll()
  }, 500);


  function darkAll() {
    document.querySelectorAll('.__fb-light-mode').forEach(function (element) {
      element.classList.remove('__fb-light-mode');
      element.classList.add('__fb-dark-mode');
    });
  }
};