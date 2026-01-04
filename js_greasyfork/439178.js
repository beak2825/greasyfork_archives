// ==UserScript==
// @name        betodds+1
// @description run
// @version 1.0.0
// @license MIT
// @namespace Kaznacheev
// ==/UserScript==

function odds(contribution_rate,initial_rate){ 
  var odd=parseInt($('#double_your_btc_payout_multiplier').val());
  if(odd<contribution_rate){
    $('#double_your_btc_payout_multiplier').val((odd+1).toString()+".00");
  }else{
    $('#double_your_btc_payout_multiplier').val((initial_rate).toString()+".00");
  }
}




