// ==UserScript==
// @name        profitrunes
// @description run
// @version 1.0.1
// @license MIT
// @namespace Kaznacheev
// ==/UserScript==
 function profitrunes(profit){
  var res =0;
  
  if (profit==3 && res==0)  {
  $('#double_your_btc_payout_multiplier').val("4.00");
    res =1;
  }
  
  if (profit==4 && res==0)  {
  $('#double_your_btc_payout_multiplier').val("5.00");
    res =1;
  }
  
  if (profit==5 && res==0)  {
  $('#double_your_btc_payout_multiplier').val("6.00");
    res =1;
  }
  $('#double_your_btc_stake').val("0.00000001"*1);
  }