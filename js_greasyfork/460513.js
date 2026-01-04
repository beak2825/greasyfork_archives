// ==UserScript==
// @name        ekşi chat egmardernagon engelleyici
// @namespace   Violentmonkey Scripts
// @match       http://chat.eksiduyuru.com/blab.php
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description 22.02.2023 18:40:15
// @downloadURL https://update.greasyfork.org/scripts/460513/ek%C5%9Fi%20chat%20egmardernagon%20engelleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/460513/ek%C5%9Fi%20chat%20egmardernagon%20engelleyici.meta.js
// ==/UserScript==


setInterval(function() {
  const egmardernagon = document.getElementsByTagName("span");

  for (let i = 0; i < egmardernagon.length; i++) {
    if (/\begmardernagon\b/.test(egmardernagon[i].textContent)) {
      const parentElement = egmardernagon[i].parentNode;
      parentElement.remove();
    }
  }
}, 1000);