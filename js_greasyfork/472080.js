// ==UserScript==
// @name         Hotpot.ai Unlimiter
// @namespace    https://leaked.wiki
// @version      0.1
// @description  Removes the local cooldowns for Hotpot.ai allowing you to generate multiple images at once!
// @author       You
// @match        *://hotpot.ai/art-generator
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472080/Hotpotai%20Unlimiter.user.js
// @updateURL https://update.greasyfork.org/scripts/472080/Hotpotai%20Unlimiter.meta.js
// ==/UserScript==
  
(function() {
 'use strict';


 function togglePremiumToFreemium() {
 var premiumSwitch = document.querySelector('.premiumBox .switch');

 if (premiumSwitch.checked) {
 premiumSwitch.checked = false;
 console.log('Modo Premium desativado, modo Freemium ativado.');
 } else {
 console.log('O modo Freemium já está ativado.');
 }
 }

 togglePremiumToFreemium();
})();