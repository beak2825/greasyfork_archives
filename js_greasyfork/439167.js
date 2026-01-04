// ==UserScript==
// @name        betodds-1
// @description run
// @version 1.0.1
// @license MIT
// @namespace Kaznacheev
// ==/UserScript==
 function odds(betodss){ 
  var odd=parseInt($('#double_your_btc_payout_multiplier').val());
  if(odd>2){
    $('#double_your_btc_payout_multiplier').val((odd-1).toString()+".00");
  }else{
    $('#double_your_btc_payout_multiplier').val((betodss).toString()+".00");
  }
}