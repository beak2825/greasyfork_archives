// ==UserScript==
// @name         [GC] Negg SDB Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically calculate the number of Negg points in your Safety Depost Box
// @author       Masterofdarkness & zachiola
// @match        https://www.grundos.cafe/safetydeposit*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505235/%5BGC%5D%20Negg%20SDB%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/505235/%5BGC%5D%20Negg%20SDB%20Calculator.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function matchOrElse(match, orElse) {
  return match ? parseInt(match[1]) : orElse;
}

let neggPoints = 0;
document.querySelectorAll('div[id^="sdb-item-"]').forEach(itemDiv => {
  // Find the target <div> that is two siblings after the current <div>
  const qtyDiv = itemDiv.nextElementSibling.nextElementSibling;
  const descriptionDiv = qtyDiv.nextElementSibling.nextElementSibling;
   const pts = matchOrElse(descriptionDiv.innerHTML.match(/WORTH (\d+) (NEGG POINT|points at the Neggery|point at the Neggery|points in the Neopian Neggery)/i),0);
  neggPoints += pts * matchOrElse(qtyDiv.innerHTML.match(/>(\d+)</),1);
});

if(neggPoints > 0)
{
   document.querySelector('div.threequarters-width.margin-auto').insertAdjacentHTML('afterend', `<b>Total Negg Points on this page: ${neggPoints}</b>`);
}
})();