// ==UserScript==
// @name         Lucky Nerkmids
// @namespace    https://greasyfork.org/en/users/1349307-jellyworlddoesntexist
// @version      1.0.0
// @description  Auto-select the best Nerkmid options based on the guide by billytiddles
// @author       jellyworlddoesntexist
// @match        https://www.neopets.com/vending.phtml
// @match        https://www.neopets.com/vending2.phtml
// @match        https://www.neopets.com/vending3.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506297/Lucky%20Nerkmids.user.js
// @updateURL https://update.greasyfork.org/scripts/506297/Lucky%20Nerkmids.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Wait a random amount of time before submitting the form
  function submitForm(submit) {
    setTimeout(() => {
      submit.click();
    }, Math.floor(Math.random() * 3000) + 1000);
  }

  const form = document.querySelector('form[action="vending.phtml"], form[action="vending2.phtml"], form[action="vending3.phtml"]');
  const submit = form.querySelector('input[type="submit"]');

  switch (form.action) {
    // If this is the prize screen, click through to the index page
    case 'https://www.neopets.com/vending.phtml':
      submitForm(submit);
      break;

    // If this is the index page, click through to the vending machine
    case 'https://www.neopets.com/vending2.phtml':
      submitForm(submit);
      break;

    // If this is the vending machine, choose the luckiest, highest-scoring options.
    // If they don't impact the luck, randomize!
    case 'https://www.neopets.com/vending3.phtml':
      form.querySelector('select[name="nerkmid_id"]').selectedIndex = 1;
      form.querySelector('select[name="large_button"]').selectedIndex = 3;
      form.querySelector('select[name="small_button"]').selectedIndex = Math.floor(Math.random() * 6) + 1;
      form.querySelector('select[name="button_presses"]').selectedIndex = Math.floor(Math.random() * 5) + 1;
      form.querySelector('select[name="lever_pulls"]').selectedIndex = 6;
      submitForm(submit);
      break;

    // If something goes wrong, do nothing
    default:
      return;
  }
})();