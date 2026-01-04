// ==UserScript==
// @name HDFC CREDIT
// @namespace IRCTC PAY
// @match https://hdfcbankpayments.hdfcbank.com/PG/*
// @version     1
// @grant       none
// @description HDFC
// @downloadURL https://update.greasyfork.org/scripts/408003/HDFC%20CREDIT.user.js
// @updateURL https://update.greasyfork.org/scripts/408003/HDFC%20CREDIT.meta.js
// ==/UserScript==
var sele1 = 0;
var sele2 = 0;
var cli = new Event("click");  
	card_num = document.getElementById('card_no');
    card_name = document.getElementById('name');
    exp_mon = document.getElementById('expMonthSelect');
    exp_year = document.getElementById('expYearSelect');
   // exp_ccv = document.getElementById('hdfc_debit_cvv_no');
    ccv_no = document.getElementById('cvv_no');
    //card_pin = document.getElementById('hdfc_debit_pin_no');
    //captcha_text=document.getElementById('capacha');
    captcha =document.getElementById('capacha');
    function cardfill(){
    card_num.value="463917005026****";
    card_name.value="********";
    exp_mon.value="7";
    exp_year.value="2023"; 
   //exp_ccv.value="***";
    ccv_no.value="***";
   //card_pin.value="****";
    //captcha_text.focus();
    captcha.focus();
  }
document.getElementById("name").addEventListener('click', function (){
    card_num.value="****21070131****";
    card_name.value="*******";
    exp_mon.value="9";
    exp_year.value="2023"; 
    ccv_no.value="***";
   // card_pin.value="****";
    captcha.focus();});
function hdfcdebid(){
   if(card_num != null && card_num.value=="")
   {cardfill(); } 
  else
   spay=document.querySelectorAll('.payment_dropdown .stage')[0];
  if(spay != null && sele1 == "0" ){ sele1 = "1";
  spay.addEventListener('click', function () {spay.dispatchEvent(cli);});
                     spay.click();
                                   }
 payfill=document.querySelectorAll('.payment_dropdown .card')[0];
  if(payfill != null && sele2 == "0" && sele1 != "0"){sele2="1";
  spay.addEventListener('click', function () {payfill.dispatchEvent(cli); });
  payfill.click();                                                     }
            }
 setInterval(function () {hdfcdebid();}, 1000);   