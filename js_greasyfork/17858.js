// ==UserScript==
// @name          DIY Soylent Scale to Ingredient 
// @version       0.0.1
// @namespace     http://userscripts.psbarrett.com
// @description	  Allows you to scale all ingredients to a set amount of a specific ingredient.
// @include       https://diy.soylent.com/recipes/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/17858/DIY%20Soylent%20Scale%20to%20Ingredient.user.js
// @updateURL https://update.greasyfork.org/scripts/17858/DIY%20Soylent%20Scale%20to%20Ingredient.meta.js
// ==/UserScript==
'use strict'

var amount_box_list = document.querySelectorAll('td.amount');
var unit_box_list = document.querySelectorAll('td.unit');
var name_box_list = document.querySelectorAll('td.name');

function click_handler_builder(amountb, unitsb, nameb) {
  return function() {
    var amount = amountb.getAttribute("data-amount");
    var units = unitsb.textContent;
    var name = nameb.textContent;
    var new_amount = window.prompt(
      "How many <" + units + "> of <" + name + "> do you have?",
      amount)

    var scale_factor = Number(new_amount)/Number(amount);

    for (var box of amount_box_list) {
      var scaled_amount = Number(box.getAttribute("data-amount"))*scale_factor;
      box.textContent = Math.round(scaled_amount*100)/100;
    }
  }
}

for (var i in amount_box_list) {
  var amountb = amount_box_list[i];
  var unitb = unit_box_list[i];
  var nameb = name_box_list[i];

  amountb.onclick = click_handler_builder(amountb, unitb, nameb);
}
  
console.log("Ingredient Scaling Enabled - Click to Scale");
