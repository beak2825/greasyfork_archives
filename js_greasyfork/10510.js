// ==UserScript==
// @name        BHIN-SETPAY
// @namespace   JUSTONLYTESTKASKUS
// @include     https://www.bhinneka.com/mobile/aspx/set_payment_method.aspx
// @version     1.0.1
// @grant       none
// @description ga ono
// @downloadURL https://update.greasyfork.org/scripts/10510/BHIN-SETPAY.user.js
// @updateURL https://update.greasyfork.org/scripts/10510/BHIN-SETPAY.meta.js
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
  
  /* jika mau klikpay disini */
 /*
  if(Zq("#ctl00_cphContent_radKlikPay").length){
    Zq("#ctl00_cphContent_radKlikPay").click();
    Zq("#ctl00_cphContent_btnNext").click();
  }else{
 Zq('#ctl00_cphContent_divBCA').click(); 
 Zq('#ctl00_cphContent_radBCA').click();
 Zq("#ctl00_cphContent_btnFNext").click();    
    
  }
  */
  
  
  /* BUAT BBMMONEY */
  
  
  /*
  if(!(Zq("#ctl00_cphContent_radBBMMoney").length||Zq('#ctl00_cphContent_radeMoney').length){
   window.open(window.location,"_self");
  }else{
    
*/
  
  
  
  /*
  
    if(Zq("#ctl00_cphContent_radBBMMoney").length){
    Zq("#ctl00_cphContent_radBBMMoney").click();
    Zq("#ctl00_cphContent_btnNext").click();
  }else{
  Zq('#ctl00_cphContent_radeMoney').click(); 
  Zq("#ctl00_cphContent_btnFNext").click();    
   
  }
  */
    
    
    /*
   } 
  */
  
  
  if(Zq('#ctl00_cphContent_radAutomaticATM').length){ /* PAKE ATM KARENA G KELIATAN DEH  */
    Zq('#ctl00_cphContent_radeMoney').click(); 
    Zq("#ctl00_cphContent_btnFNext").click();         
  }else{
    
    
    /* ini buat trial mandiri ecash */
    
    /*
           if(Zq("#ctl00_cphContent_radmandiriecash").length){
    Zq("#ctl00_cphContent_radmandiriecash").click();
    Zq("#ctl00_cphContent_btnNext").click();
  }else{
    
    */
    
    
    /* ini baru buat bbm money */
    
       if(Zq("#ctl00_cphContent_radBBMMoney").length){
    Zq("#ctl00_cphContent_radBBMMoney").click();
    Zq("#ctl00_cphContent_btnNext").click();
  }else{
    
        setTimeout(function(){
         window.open(window.location,"_self");
      },1250);
   
  } 
    
  }
  
  
  
    

  
  
  
  
  
  //tunggu jam 11
  //Zq('#ctl00_cphContent_radeMoney').click(); 
  
  
  
  
  
  
  

  
}
addJQuery(main);
