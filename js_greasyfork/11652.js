// ==UserScript==
// @name        ELEVEN-FINALBAYAR
// @namespace   JUSTONLYTESTKASKUS
// @include     https://m.elevenia.co.id/order/getOrderInfo.do
// @version     1
// @grant       none
// @description BUAT FINAL BAYAR
// @downloadURL https://update.greasyfork.org/scripts/11652/ELEVEN-FINALBAYAR.user.js
// @updateURL https://update.greasyfork.org/scripts/11652/ELEVEN-FINALBAYAR.meta.js
// ==/UserScript==


function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.Zq=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  Zq(document).ready(function(){      
    //BUAT BBMMONEY
    Zq("#InfoMethodPK04").click();
    Zq('#PK04 option').eq(5).prop('selected', true);
    Zq("#PK04").change();    

    
    submitProcess.submit();  



      /*
    //BUAT KLIKPAY
   Zq("#tab08").click(); 
   Zq('#PK03 option').eq(1).prop('selected', true);
   //Zq('.btnRed').click();
  Zq('.btnRed a').click();  
  Zq("#tab08").click(); 
  //Zq(".orderSubmit a").click();  
    
    //alert(Zq('#orderSubmit').html());
  
  Zq('#orderSubmit').find('a').trigger('click');
  Zq('#orderSubmit').find('a').trigger('click');
  Zq('#orderSubmit').find('a').trigger('click');
  Zq('#orderSubmit').find('a').trigger('click');
  Zq('#orderSubmit').find('a').trigger('click');
  Zq('#orderSubmit').find('a').trigger('click');
  Zq('#orderSubmit').find('a').trigger('click');

*/  
    
    
  						
    
    
    /*
    //BUAT KLIKPAY
   Zq("#InfoMethodPK03").click();
   Zq("#tab08").click(); 
   //Zq('.btnRed').click();
  Zq('.btnRed a').click();  
  Zq("#tab08").click(); 
  //Zq(".orderSubmit a").click();  
    
    //alert(Zq('#orderSubmit').html());
  submitProcess.submit();  
  Zq('#orderSubmit').find('a').trigger('click');
  Zq('#orderSubmit').find('a').trigger('click');
  Zq('#orderSubmit').find('a').trigger('click');
  Zq('#orderSubmit').find('a').trigger('click');
  Zq('#orderSubmit').find('a').trigger('click');
  Zq('#orderSubmit').find('a').trigger('click');
  Zq('#orderSubmit').find('a').trigger('click');

*/

  });
}
addJQuery(main);
