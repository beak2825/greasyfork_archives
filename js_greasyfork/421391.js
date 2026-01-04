// ==UserScript==
// @name         Taobao eur converter
// @version      1.4.2
// @description  Convert CNY to EUR in Taobao
// @author       McStecca
// @include      https://item.taobao.com/*
// @include      https://shop*.taobao.com/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @run-at       document-end
// @namespace    https://greasyfork.org/users/434104
// @downloadURL https://update.greasyfork.org/scripts/421391/Taobao%20eur%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/421391/Taobao%20eur%20converter.meta.js
// ==/UserScript==

function convertPrices(rate, price, tag) {
    let convertedPrice = Math.round(price * 100 * rate)/100;
    tag.html(tag.html() + " €" + convertedPrice);
}

function check(rate) {
  window.setInterval( function () {
  let tag = "";
  if($(".tb-rmb-num").eq(1).length){
    tag = $(".tb-rmb-num").eq(1);
  }else if($(".tb-rmb-num").length){
    tag = $(".tb-rmb-num");
  }else{
    console.log("false");
  }
  let price = tag.html();
  if (price.includes("<br")) {return;}
  let prices = price.split("-");
  tag.html(tag.html() + "<br> ");
  prices.forEach(price => {
    convertPrices(rate, parseFloat(price), tag);
  });
	}, 420);
}

$.get('https://openexchangerates.org/api/latest.json', {app_id: '7bdd8160ae2b46a6897ef2dccf629280'}, function(data) {
    const rate = (1 / data.rates.CNY) * (data.rates.EUR);
		check(rate);
});