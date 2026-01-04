// ==UserScript==
// @name        Fuck you Cumitet
// @namespace   Violentmonkey Scripts
// @match       https://dtf.ru/*
// @grant       none
// @version     1.0
// @license MIT
// @author      -
// @description ¯\_(ツ)_/¯
// @downloadURL https://update.greasyfork.org/scripts/473879/Fuck%20you%20Cumitet.user.js
// @updateURL https://update.greasyfork.org/scripts/473879/Fuck%20you%20Cumitet.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  document.querySelector('.comments__show-all').click();
})