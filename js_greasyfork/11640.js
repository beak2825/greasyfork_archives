// ==UserScript==
// @name         LAZADA-BUATLAZADARI70
// @namespace    STRP
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.lazada.co.id/checkout/step/paymentinformation/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11640/LAZADA-BUATLAZADARI70.user.js
// @updateURL https://update.greasyfork.org/scripts/11640/LAZADA-BUATLAZADARI70.meta.js
// ==/UserScript==

var x = 1;

$(document).ajaxSuccess(function() {
  if($("#checkout-remove-voucher").length){
    //alert('berhasil masukkan voucher loh');
    
    $('#placeYourOrderBtn').click();
  }else{
    
    //if (x > 3)
   // $('#coupon').val('merdeka8');
   // else 
    
      $('#coupon').val('LAZADARI70');    
    $('#couponSend').click();
    
    
    
   // x++;
  }
  
  
});
