// ==UserScript==
// @name         Pandabuy converted prices
// @namespace    hydroxyfufu
// @version      0.1
// @description  Converts Pandabuy CNY prices to provided currency using provided exchange rate
// @author       hydroxyfufu
// @include      https://www.pandabuy.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453191/Pandabuy%20converted%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/453191/Pandabuy%20converted%20prices.meta.js
// ==/UserScript==
'use strict';

const EXCHANGE_RATE = 8.04356;
const CURRENCY_STRING = "GBP £";
const SHIPPING_FEE_PER_500g = 5.85;
var converted = false;

function convert() { 
    var cnyPriceTitleString = document.getElementsByClassName('price-title')[0].textContent;
    var cnyPriceString = /CNY ¥ ([0-9.]+)/gm.exec(cnyPriceTitleString)[1]
    var convPrice = parseFloat(cnyPriceString) / EXCHANGE_RATE;
  	var convPriceString = convPrice.toFixed(2);
  	
    var productDetails = document.getElementsByClassName("timeInfo-lable")

    for (var i = 0; i < productDetails.length; i++) {
      var d = productDetails[i].innerText;
      if (d.includes("Weight(g)")) {
        var weightString = /Weight\(g\): ([0-9]+)/mg.exec(d)[1]
        var shippingFee = (parseFloat(weightString) * SHIPPING_FEE_PER_500g) / 500
        convPriceString = (convPrice + shippingFee).toFixed(2) + "*"
        break;
      }
    }

    document.getElementsByClassName('price-title')[0].textContent = `${CURRENCY_STRING} ${convPriceString}`;
  	converted = true;
}

var interval = window.setInterval(function() {
        convert();
  			if (converted) {
        	window.clearInterval(interval)
        }
    }, 500);