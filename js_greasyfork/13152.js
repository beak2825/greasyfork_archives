// ==UserScript==
// @name         VPP 5000
// @namespace    https://greasyfork.org/scripts/13152-vpp-500/
// @version      0.21
// @description  Automatically set quantity to 5000 if the app is free
// @author       You
// @match        https://volume.itunes.apple.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/13152/VPP%205000.user.js
// @updateURL https://update.greasyfork.org/scripts/13152/VPP%205000.meta.js
// ==/UserScript==

function waitForFnc(){
  if(!/in/.test(document.readyState)){
     // inputQuantity = document.getElementById("quantity");
      if($('#price') && $('#price').text() == "Free iOS App")
      {
          inputQuantity = $('#quantity');
          inputQuantity.val('5000');
          inputQuantity.keyup();
      
          $('.continue')[0].click();
      }
      
      if($('#search_term').val() != "" && $('#search_term').val() != undefined)
      {
           GM_setValue("vppsearchstring",$('#search_term').val());
        //  console.log(GM_getValue("vppsearchstring"));
         
          
      }
      else
      {
          $('#search_term').val(GM_getValue("vppsearchstring",""));
      }
      
      if($('.header-title').text() == "Your order is complete.")
      {
           $('#searchForm').submit();
          
      }
      
    //  if($($('.see-all')[0]).text() == "See More >")
   //   {
   //       console.log($($('.see-all')[0]).text());
        //  $('.see-all')[0].click();
   //   }
      
    window.setTimeout(waitForFnc,500);  
  }
  else{
   window.setTimeout(waitForFnc,50);
  }
     
}

waitForFnc();