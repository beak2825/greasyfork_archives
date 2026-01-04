// ==UserScript==
// @name        Melvor Bank Tab Values
// @namespace   http://tampermonkey.net/
// @version     0.8.0-0.22.2
// @description Shows value of each tab and automatically updates the values every two seconds
// @author      WhackyGirl
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com*
// @exclude     https://*.melvoridle.com/index.php
// @noframes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/434605/Melvor%20Bank%20Tab%20Values.user.js
// @updateURL https://update.greasyfork.org/scripts/434605/Melvor%20Bank%20Tab%20Values.meta.js
// ==/UserScript==

var autoBankTabValuator = setInterval(() => {
  if($('#bank-container').length) {
    var bankTabValues = [];

    bank.forEach(function (item, index) {
      if(bankTabValues[item.tab] == undefined) bankTabValues[item.tab] = 0;
      bankTabValues[item.tab] += item.qty * getItemSalePrice(item.id);
    });

    var bankTabsDOM = $("#bank-container .nav-tabs").find('.nav-item');

    bankTabsDOM.each(function(index) {
      var tabValueContent = "<small class='text-warning' style='display: block; text-align: center;'>" + convertGP(bankTabValues[index] ? bankTabValues[index] : 0) + "</small>";
      if($(this).find('.text-warning').length) {
        $(this).find('.text-warning').html(tabValueContent);
      } else {
        $(this).find('img').after(tabValueContent);
      }
    });
  }
}, 2000);