// ==UserScript==
// @name         Erome Auto Confirm age
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Automatically press the "I AM 18 OR OLDER" disclaimer Button
// @author       E
// @match        https://*.erome.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475141/Erome%20Auto%20Confirm%20age.user.js
// @updateURL https://update.greasyfork.org/scripts/475141/Erome%20Auto%20Confirm%20age.meta.js
// ==/UserScript==
 
if (document.readyState !== 'loading') {
  autoConfirm();
} else {
  document.addEventListener('DOMContentLoaded', autoConfirm);
}
 
function autoConfirm() {
  setTimeout(function() {
    var confirmButton = document.querySelector('#disclaimer > #home-box > div.enter');
    confirmButton.click();
  }, 250)
}