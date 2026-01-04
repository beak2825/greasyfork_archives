// ==UserScript==
// @name AliExpress
// @description Reload page with free shipping selection and sorted price ascending 
// @namespace Violentmonkey Scripts
// @match https://www.aliexpress.com/w*
// @grant none
// @version 0.0.1.20190510134650
// @downloadURL https://update.greasyfork.org/scripts/382742/AliExpress.user.js
// @updateURL https://update.greasyfork.org/scripts/382742/AliExpress.meta.js
// ==/UserScript==

var oldOnload = window.onload;
var locHref = window.location.href;
var fShip = '&isFreeShip=y';
var sPrice = '&SortType=price_asc';
var isSetShip = locHref.indexOf(fShip);
var isSetPrice = locHref.indexOf(sPrice);
var concatStr = '';

window.onload = function () {
  
  if (typeof oldOnload == 'function') {
    oldOnload();
  }
  
  console.log('location: '+ locHref + ', shipping: ' + isSetShip + ', price: ' + isSetPrice);
  
  
  if (isSetShip == -1) {
    concatStr = concatStr + fShip;
  }
    
  if (isSetPrice == -1) {
    concatStr = concatStr + sPrice;
  }
  
  if (isSetShip == -1 || isSetPrice == -1) {
    window.location.assign(locHref + concatStr);
  }

};