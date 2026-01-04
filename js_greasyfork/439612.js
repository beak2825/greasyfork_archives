// ==UserScript==
// @name       zip2
// @description run
// @version 1.0.0
// @license MIT
// @namespace Kaznacheev
// ==/UserScript==
 
 
function zip(){
 
  var res =0;
  var odd=parseInt($('#double_your_btc_payout_multiplier').val());
  
  
  
  
 if(res==0){
  if($('#double_your_btc_stake').val()*1=="0.00000002"*1){
if($('#double_your_btc_payout_multiplier').val()=="24.00"){
  $('#double_your_btc_payout_multiplier').val("22.00");
  $('#double_your_btc_stake').val("0.00000003"*1);
}else{
  $('#double_your_btc_payout_multiplier').val((odd+1).toString()+".00");
}
res =1;
     }
}
  
 if(res==0){
  if($('#double_your_btc_stake').val()*1=="0.00000003"*1){
if($('#double_your_btc_payout_multiplier').val()=="27.00"){
  $('#double_your_btc_payout_multiplier').val("25.00");
  $('#double_your_btc_stake').val("0.00000004"*1);
}else{
  $('#double_your_btc_payout_multiplier').val((odd+1).toString()+".00");
}
res =1;
     }
} 
  
 if(res==0){
  if($('#double_your_btc_stake').val()*1=="0.00000004"*1){
if($('#double_your_btc_payout_multiplier').val()=="30.00"){
  $('#double_your_btc_payout_multiplier').val("19.00");
  $('#double_your_btc_stake').val("0.00000002"*1);
}else{
  $('#double_your_btc_payout_multiplier').val((odd+1).toString()+".00");
}
res =1;
     }
}
  
  
  
}
 