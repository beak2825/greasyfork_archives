// ==UserScript==
// @name         Cin7 Sync Inventory
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://go.cin7.com/Cloud/ShopifyV2/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392396/Cin7%20Sync%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/392396/Cin7%20Sync%20Inventory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
      console.log('Cin7 sync inventory: ' + (new Date()).toLocaleString());
      __doPostBack('ctl00$ctl00$ContentPlaceHolder1$UploadUpdatedStockButton','');
      // or
      // location.href = $('#ctl00_ctl00_ContentPlaceHolder1_UploadUpdatedStockButton').attr('href');
    }, 60000);
})();