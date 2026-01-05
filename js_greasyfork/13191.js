// ==UserScript==
// @name        MAKE PAYMENT
// @namespace   ANAND KUMAR
// @description FILL PEY OPTION
// @include     https://www.irctc.co.in/eticketing/*
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13191/MAKE%20PAYMENT.user.js
// @updateURL https://update.greasyfork.org/scripts/13191/MAKE%20PAYMENT.meta.js
// ==/UserScript==
   bn=getCookie("bank");
 bty=getCookie("bt");
$(document).ready(function(){
  checkSearchType(bty);
var qu = document.getElementsByName(bty);
  for (var i = 0; i < qu.length; i++) {
  pg=qu[i].value
  switch (pg) {
    case bn:
    var elements = document.getElementsByName(bty);
    elements[i].click(checked = true);
      window.scrollTo(0,600);
      var con =getCookie("con");
      if(con=="PY")document.getElementById("jpBook:makePmntModeId1").click();
    break;
  }}});
document.getElementById('CREDIT_CARD').addEventListener('click', function(){
  document.getElementById('card_no_id').value = "";
   document.getElementById('card_expiry_mon_id').value ="01";
   document.getElementById('card_expiry_year_id').value = "2024";
   document.getElementById('cvv_no_id').value = "";
   document.getElementById('card_name_id').value = "";
   window.scrollTo(0,600);
});
 if(bty=="CREDIT_CARD"){document.getElementById('CREDIT_CARD').click();}