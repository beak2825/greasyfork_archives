// ==UserScript==
// @name        HDFC DEBID CARD
// @namespace   buddhacsc
// @include     https://securepayments.fssnet.co.in/hdfcbankb/*
// @version     1.5
// @grant       none
// @description HDFC
// @downloadURL https://update.greasyfork.org/scripts/20846/HDFC%20DEBID%20CARD.user.js
// @updateURL https://update.greasyfork.org/scripts/20846/HDFC%20DEBID%20CARD.meta.js
// ==/UserScript==
var sele1 = 0;
var sele2 = 0;
var cli = new Event("click");  
	card_num = document.getElementById('card_no');
    card_name = document.getElementById('name');
    exp_mon = document.getElementById('expMonthSelect');
    exp_year = document.getElementById('expYearSelect');
    exp_ccv = document.getElementById('hdfc_debit_cvv_no');
    card_pin = document.getElementById('hdfc_debit_pin_no');
    captcha_text=document.getElementById('capacha');
    function cardfill(){
    card_num.value="************";
    card_name.value="******";
    exp_mon.value="12";
    exp_year.value="20**"; 
    exp_ccv.value="***";
    card_pin.value="******";
    captcha_text.focus();
  }
document.getElementById("name").addEventListener('click', function (){
    card_num.value="41602107******";
    card_name.value="******";
    exp_mon.value="9";
    exp_year.value="20**"; 
    exp_ccv.value="***";
    card_pin.value="****";
    captcha_text.focus();});
function hdfcdebid(){
   if(card_num != null && card_num.value=="")
   {cardfill(); } 
  else
   spay=document.querySelectorAll('.payment_dropdown .stage')[0];
  if(spay != null && sele1 == "0" ){ sele1 = "1";
  spay.addEventListener('click', function () {spay.dispatchEvent(cli);});
                      spay.click();}
 payfill=document.querySelectorAll('.payment_dropdown .card')[0];
  if(payfill != null && sele2 == "0" && sele1 != "0"){sele2="1";
  spay.addEventListener('click', function () {payfill.dispatchEvent(cli); });
                     payfill.click();}
            }
 setInterval(function () {hdfcdebid();}, 1000);   