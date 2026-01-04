// ==UserScript==
// @name         amazonSellerMatchLowPrice
// @namespace    https://greasyfork.org/users/98044
// @version      1.6
// @description  Will refresh "Manage  Inventory" page every 16mins, click all "Match Low Price" buttons,
// @description  then all the "Save" buttons.
// @author       Davinna Mayawen
// @icon         https://media.tenor.com/images/e5b48218f76d06c730cae7f2928ad2c7/tenor.gif
// @include      *sellercentral.amazon.com/inventory?viewId=PRICING*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      https://opensource.org/licenses/MIT
// @copyright    Davinna Mayawen 2017-2021
// @downloadURL https://update.greasyfork.org/scripts/371025/amazonSellerMatchLowPrice.user.js
// @updateURL https://update.greasyfork.org/scripts/371025/amazonSellerMatchLowPrice.meta.js
// ==/UserScript==
$(document).ready(function(){
  'use strict';
  //change background color
  document.body.style.backgroundColor = "#9DA4AA";
  $("div.mt-filter-selection").css("background-color", "#9DA4AA");
    
  setInterval(function(){matchLowPrice()}, 60000);//every minuite
  setInterval(function(){pageReload()}, 300000);//every 5 minutes
});

function matchLowPrice() {
  const $matchLowPriceButtons = $('button span.a-dropdown-prompt:visible');
  for (var i = 0; i < $matchLowPriceButtons.length; i++) {
    $matchLowPriceButtons[i].click();
  }
  //console.log('clicked');
}

function pageReload() {
  //console.log('reloaded');
  window.location.reload(true);
}
