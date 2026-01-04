// ==UserScript==
// @name         Cin7 Sync Inventory to Tmall
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://t.pushhfit.com/top/t.php?i=c_products
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392761/Cin7%20Sync%20Inventory%20to%20Tmall.user.js
// @updateURL https://update.greasyfork.org/scripts/392761/Cin7%20Sync%20Inventory%20to%20Tmall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
      console.log('Cin7 sync inventory: ' + (new Date()).toLocaleString());
      location.href = 'https://t.pushhfit.com/top/t.php?i=c_products';
    }, 300000);
})();