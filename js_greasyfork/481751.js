// ==UserScript==
// @name        Bazaar Quick Buy Script
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/bazaar.php
// @grant       none
// @version     0.1
// @author      Terekhov
// @description 12/8/2023, 1:52:38 PM
// @downloadURL https://update.greasyfork.org/scripts/481751/Bazaar%20Quick%20Buy%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/481751/Bazaar%20Quick%20Buy%20Script.meta.js
// ==/UserScript==

let lastEle;

(function () {
  'use strict';

  let listenerInterval;
  listenerInterval = setInterval(() => {
    const elements = document.querySelectorAll('[aria-label^="Buy: "]');
    if (!elements || !elements.length) {
      console.log('not ready yet');
      return;
    }

    elements.forEach(ele => ele.addEventListener('click', () => {

      const itemDiv = ele.parentElement.parentElement.parentElement.parentElement;
      console.log(itemDiv);

      setTimeout(() => {
        let fillMax = itemDiv.children[0].children[1].children[1].children[1]
        let buyButton = itemDiv.children[0].children[1].children[1].children[0];
        fillMax.click();
        buyButton.click();
      }, 200);
    }));
    clearInterval(listenerInterval);
  }, 200);

})();