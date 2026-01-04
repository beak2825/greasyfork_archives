// ==UserScript==
// @name         Pre-fill bank deposit
// @namespace    https://greasyfork.org/en/users/1349307-jellyworlddoesntexist
// @version      1.0.0
// @description  Pre-fill the deposit amount with (current NP - your reserve amount)
// @author       jellyworlddoesntexist
// @match        https://www.neopets.com/bank.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503222/Pre-fill%20bank%20deposit.user.js
// @updateURL https://update.greasyfork.org/scripts/503222/Pre-fill%20bank%20deposit.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const reserveAmount = 50000; // Customize with the amount you'd like to keep on hand

  let np = document.getElementById("npanchor");
  np = np.innerText.replace(/,/g, '');

  if (np > reserveAmount) {
    document.querySelector('input[name="amount"]').value = np - reserveAmount;
  }
})();