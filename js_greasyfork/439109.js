// ==UserScript==
// @name       nextrun
// @description 456
// @version 1.0.2
// @license MIT
// @namespace Kaznacheev
// ==/UserScript==

function next(){
  var res =0;
  if ($('#double_your_btc_payout_multiplier').val()=="4.00"&&res==0)  {
  $('#double_your_btc_payout_multiplier').val("5.00");
    res =1;
  }
  if ($('#double_your_btc_payout_multiplier').val()=="5.00"&&res==0)  {
  $('#double_your_btc_payout_multiplier').val("6.00");
    res =1;
  }
  if ($('#double_your_btc_payout_multiplier').val()=="6.00"&&res==0)  {
  $('#double_your_btc_payout_multiplier').val("4.00");
  $('#double_your_btc_stake').val($('#double_your_btc_stake').val()*2); 
    res =1;
  }
}
