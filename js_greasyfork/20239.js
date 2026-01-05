// ==UserScript==
// @name        bihar suvidha
// @namespace   suvidha
// @description auto sividha
// @include     https://www.biharcommercialtax.gov.in/bweb/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20239/bihar%20suvidha.user.js
// @updateURL https://update.greasyfork.org/scripts/20239/bihar%20suvidha.meta.js
// ==/UserScript==
if(document.getElementById('transporterName')){
  var tp = prompt("ट्रांसपोर्टर कम्पनी का नाम","");
   document.getElementById('transporterName').value=tp;
document.getElementById('ownerFullName').value=tp;
  var tad = prompt("ट्रांसपोर्टर कम्पनी का पता","");
   document.getElementById('cmpnyAddrss').value=tad;
document.getElementById('serviceTaxNum').value="AAAAA2222A001";
document.getElementById('localPermitNum').value="NA";
document.getElementById('ntnlPermitNum').value="NA";
document.getElementById('cmpnyPan').value="AAAAA2222A";
document.getElementById('cmpnyBank').value="NA";
document.getElementById('cmpnyBankBrnch').value="NA";
document.getElementById('cmpnyBankAcc').value="NA";
document.getElementById('cmpnyPhone').value="9412345678";
document.getElementById('cmpnyEmail').value="aaaa@aa.aa";
document.getElementById('password').value="Aa@123456";
document.getElementById('confpassword').value="Aa@123456";
document.getElementById('secquest').value="NA";
document.getElementById('secans').value="NA";}
document.getElementById("submit").addEventListener('click', function () {  
 var us = document.getElementById("username").value;
  document.cookie="usn="+us+";expires=10 Dec 2020"});
  document.getElementById('password').value="Aa@123456";