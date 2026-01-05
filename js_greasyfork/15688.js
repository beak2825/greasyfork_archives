// ==UserScript==
// @name        hdfc debid
// @namespace   ANAND KUMAR
// @include     https://securepayments.fssnet.co.in/pgwaya/gateway/payment/*
// @version     1
// @description NAVODAY COMPUTER
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15688/hdfc%20debid.user.js
// @updateURL https://update.greasyfork.org/scripts/15688/hdfc%20debid.meta.js
// ==/UserScript==
if(document.form1.Ecom_Captcha_Value){
document.getElementById("Ecom_Payment_Card_Number_Debit").value="";
document.form1.Ecom_Payment_Card_ExpDate_Month.value="1";
document.form1.Ecom_Payment_Card_ExpDate_Year.value="2024";
document.getElementById("Ecom_Payment_Card_Name_Debit").value="";
form1.Ecom_Payment_Pin.value="";
document.form1.Ecom_Captcha_Value.focus();}