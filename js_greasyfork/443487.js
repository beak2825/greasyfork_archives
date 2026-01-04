// ==UserScript==
// @name         ebay sponsored listings remover
// @namespace    errantmind
// @version      0.54
// @author       errant
// @description  Remove sponsored listings on ebay
// @include      *://www.ebay.*/*
// @run-at       document-end
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443487/ebay%20sponsored%20listings%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/443487/ebay%20sponsored%20listings%20remover.meta.js
// ==/UserScript==
"use strict";

$('.s-item').each(function(i, obj) {
  var findResult = $(this).find(".s-item__sep * span");
  if (findResult.length > 0) {
    //console.log("Child elements matched: " + findResult.length);
    //console.log(findResult);
    for (var i = 0; i < findResult.length; i++) {
      var inner_text = findResult[i].innerText;
      //inner_text = inner_text.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
      inner_text = inner_text.replace(/[^\x00-\x7F]/g, "");
      inner_text = inner_text.toLowerCase().trim();

      if(inner_text.length == 1) {
        var display = window.getComputedStyle(findResult[i], null).getPropertyValue("display");
        //console.log("display: " + display);
        //console.log(inner_text + " len " + inner_text.length);
        if(display !== 'none') {
          (this).remove();
          return;
        }
      }      
    }        
  }
});