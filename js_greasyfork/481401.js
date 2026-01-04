// ==UserScript==
// @name           Mode Sombre Messenger
// @name:en        Messenger Dark Mode
// @namespace      Violentmonkey Scripts
// @match          https://www.messenger.com/*
// @license MIT
// @grant          none
// @version        1.0
// @author         -
// @description    Active le Mode Sombre pour Facebook Messenger
// @description:en Activate Dark Mode for Facebook Messenger
// @downloadURL https://update.greasyfork.org/scripts/481401/Mode%20Sombre%20Messenger.user.js
// @updateURL https://update.greasyfork.org/scripts/481401/Mode%20Sombre%20Messenger.meta.js
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