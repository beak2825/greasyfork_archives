// ==UserScript==
// @name        ekşi chat mada banlayıcı
// @namespace   Violentmonkey Scripts
// @match       http://chat.eksiduyuru.com/blab.php
// @grant       none
// @version     1.1
// @author      - 
// @license     MIT
// @description 15.02.2023 21:59:58
// @downloadURL https://update.greasyfork.org/scripts/460085/ek%C5%9Fi%20chat%20mada%20banlay%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/460085/ek%C5%9Fi%20chat%20mada%20banlay%C4%B1c%C4%B1.meta.js
// ==/UserScript==


setInterval(function() {
  const mada = document.getElementsByTagName("span");

  for (let i = 0; i < mada.length; i++) {
    if (/\bmada\b/.test(mada[i].textContent)) {
      const parentElement = mada[i].parentNode;
      parentElement.remove();
    }
  }
}, 1000);