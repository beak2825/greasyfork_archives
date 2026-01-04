// ==UserScript==
// @name Aaron's Flipping Script
// @description Helps with loading flipping tables.(100% based on Grinjr's flipping script, just editted to supply/demand)
// @version 0.0.1
// @include https://www.gw2bltc.com/en/tp/search?*
// @namespace https://greasyfork.org/en/users/682578-svlyk
// @downloadURL https://update.greasyfork.org/scripts/409953/Aaron%27s%20Flipping%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/409953/Aaron%27s%20Flipping%20Script.meta.js
// ==/UserScript==

var buttonDiv = document.getElementsByClassName("btn-group m-bot-10 width-xs-full");
console.log(buttonDiv[0].innerHTML);
buttonDiv[0].innerHTML = '<div class=\"btn-group m-bot-10 width-xs-full\">\r\n<button type=\"button\" data-toggle=\"collapse\" data-target=\"#advanced-search\" aria-expanded=\"false\" aria-controls=\"More\" class=\"btn btn-default col-xs-4\">\r\n<i class=\"fa fa-plus\"><\/i> Options\r\n<\/button>\r\n<button type=\"button\" id=\"reset-form\" class=\"btn btn-default col-xs-4\" title=\"Reset Options\">\r\n<i class=\"fa fa-rotate-left\"><\/i>\r\n<\/button><button type=\"button\" id=\"remove-rows\" title=\"Remove Rows that don\'t flip well\" class=\"btn btn-default col-xs-8\" >\r\n\r\n<i class=\"fa fa-minus\"><\/i> Remove Hard to Flip Items<\/button>\r\n<\/div>';
document.getElementById("remove-rows").addEventListener (
    "click", RemoveRows, false
);


function RemoveRows(evt) {
  var supplyCol = 8;
  var demandCol = 10;
  var soldCol = 11
  var boughtCol = 12;

  var col = document.getElementsByClassName("table  table-result table-hover table-striped")[0].children[0].children[0].children;
  for (var c = 0; c < col.length; c++) {
    //console.log(col[c].innerText);
    switch (col[c].innerText) {
      case " Supply":
        supplyCol = c;
        break;
      case " Demand":
        demandCol = c;
        break;
      case " Sold":
        soldCol = c;
        break;
      case " Bought":
        boughtCol = c;
        break;
      default:
        break;
    }
  }

  var items = document.getElementsByClassName("table  table-result table-hover table-striped")[0].children[2].children;
  //items = items.querySelector("table"); //tbody
  console.log(items);
  for (var i = 0; i < items.length; i++) {
    var supply = parseInt(items[i].children[supplyCol].innerText);
    var demand = parseInt(items[i].children[demandCol].innerText);
    var sold = parseInt(items[i].children[soldCol].innerText);
    var bought = parseInt(items[i].children[boughtCol].innerText);
    var bought2 = bought/2;
    if (supply >= demand && (sold < bought/2 || supply > demand * 5)) {
    	//console.log("-", items[i].children[1].innerText, sold, bought);
        console.log(sold, ' is less than ', bought2);

    	items[i].parentNode.removeChild(items[i]);
      i--;
    }
    	//console.log("+", items[i].children[1].innerText, sold, bought);
  }

}