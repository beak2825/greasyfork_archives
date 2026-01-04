// ==UserScript==
// @name         enchoraled autobuy
// @namespace    http://roblox.com
// @match        https://*.roblox.com/catalog/*
// @version      3.0.3
// @author       drt
// @grant        none
// @run-at       document-idle
// @description  haha captcha bypass
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/472092/enchoraled%20autobuy.user.js
// @updateURL https://update.greasyfork.org/scripts/472092/enchoraled%20autobuy.meta.js
// ==/UserScript==

window.setTimeout( function() {
  window.close();
}, 30000);

function buy() {
  var buyButton = document.querySelector('.PurchaseButton');
  if (buyButton) {
    buyButton.click();
    setTimeout(function() {$('.btn-primary-md').click()}, 10)
  } else {
    setTimeout(buy, 1);
  }
}

buy();
