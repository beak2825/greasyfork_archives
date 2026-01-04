// ==UserScript==
// @name        Youtube Undumbifier 
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      Blusk
// @description Disables volume bar focus
// @downloadURL https://update.greasyfork.org/scripts/414051/Youtube%20Undumbifier.user.js
// @updateURL https://update.greasyfork.org/scripts/414051/Youtube%20Undumbifier.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.getElementsByClassName('ytp-volume-panel')[0].addEventListener('focus', () => {
    window.focus();
    document.activeElement.blur();
  })
})()