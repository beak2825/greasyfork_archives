// ==UserScript==
// @name         Bow Product Page
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       matwg
// @match        https://shopdennys.com/collections/baby-bling/products/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @run-at  document-end

// @downloadURL https://update.greasyfork.org/scripts/396275/Bow%20Product%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/396275/Bow%20Product%20Page.meta.js
// ==/UserScript==
$(document).ready(function(){
  'use strict';
  let comingSoon = $("#REMOVEDID99");
  if(comingSoon) {
      console.log("Coming Soon. AKA. Refresh until launch.");
      location.reload();
  }
  console.log("Adding to cart");
  $("#product-add-to-cart").click();
  waitForKeyElements("div.ajax-success-modal:visible", goToCheckout);

});

function goToCheckout() {
    $("#dropdown-cart").find("button.btn").click();
}