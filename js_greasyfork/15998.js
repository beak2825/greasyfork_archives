// ==UserScript==
// @name         Aliexpress.com - USD to RUB conversion
// @namespace    TechnoBit
// @version      1.0.0.31
// @date         2015-12-24
// @description  Attempts to convert USD to Russian Ruble on aliexpress.com.
// @author       TechnoBit
// @match        http://*.aliexpress.com/*
// @match        https://*.aliexpress.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/15998/Aliexpresscom%20-%20USD%20to%20RUB%20conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/15998/Aliexpresscom%20-%20USD%20to%20RUB%20conversion.meta.js
// ==/UserScript==

// Update RUB before running the script!

var Rub = 66.9999;

/*******************/

function usdToRub(usd) {
  var res = '';
  // Check if string is not a single usd, i.e: US $0.67 - 10.56
  if (!$.isNumeric(usd)) {
    var val1 = parseFloat(usd.substring(4, usd.indexOf('-') - 1));
    var val2 = parseFloat(usd.substring(usd.indexOf('-') + 1, usd.length));
    val1 = (val1 * Rub).toFixed(2) + ' руб.';
    val2 = (val2 * Rub).toFixed(2) + ' руб.';
    str = val1 + ' - ' + val2;
  } 
  else {
    res = usd + ' - ' + parseFloat(usd * Rub).toFixed(2) + ' руб.';
  }
  return res;
}

$(function () {
  var pPrice = document.getElementsByClassName('p-price');
  
  if (pPrice.length > 0) {
    if ($('span[itemprop="priceCurrency"]').text() == 'US $') {
      //$('span[itemprop="lowPrice"]').text(usdToRub($('span[itemprop="lowPrice"]').text()));
      //$('span[itemprop="highPrice"]').text(usdToRub($('span[itemprop="highPrice"]').text()));
      $('span[itemprop="price"]').each(function (index, val) {
        $(this).text(usdToRub($(this).text()));
      });
    } else if ($('span[itemprop="priceCurrency"]').text() == ' руб.') {
      // Если у нас валюта рубли
      var res1;
      s = document.getElementsByTagName('SCRIPT');
      for (i = 0; i < s.length; i++) {
        item = s.item(i);
        if (item.text) {
            if (item.text.indexOf('currencyRate') >= 0) {
              res1 = item.text.match(/minPrice=\"(\d+\.\d+)\"/i);
              res2 = item.text.match(/totalValue: \"(US \$\d+\.\d+)\"/i);
              //res2 = text.match(/baseCurrencySymbol=\"(.+)\"/i);
              //$('span[itemprop="priceCurrency"]').text(' руб. - ' + res2[1] + res1[1]);
              $('span[itemprop="priceCurrency"]').text(' руб. - ' + res2[1]);
            }
        }
      }
      
      var origPrice = document.getElementsByClassName('original-price');
      if (origPrice.length > 0)
      {
        origPrice[0].innerHTML += ' - US $' + res1[1];
      }
    }
  }
});