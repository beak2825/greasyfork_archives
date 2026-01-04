// ==UserScript==
// @name        Paradox forum autowide
// @namespace   Violentmonkey Scripts
// @match       https://forum.paradoxplaza.com/forum/*
// @grant       none
// @version     1.0
// @author      Anythinga
// @description 2/15/2023, 3:56:50 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460074/Paradox%20forum%20autowide.user.js
// @updateURL https://update.greasyfork.org/scripts/460074/Paradox%20forum%20autowide.meta.js
// ==/UserScript==


$(function() {
  console.log('Switching to wide layout');
  $('html').toggleClass('uix_page--fixed uix_page--fluid');
});