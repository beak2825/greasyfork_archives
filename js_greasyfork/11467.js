// ==UserScript==
// @name        ELEVEN-PRODUCT PER <GANTI PRODUK DISINI>
// @namespace   JUSTONLYTESTKASKUS
// @include     http://m.elevenia.co.id/prd-*
// @version     1.2
// @description TEST BUAT ELEVENIA NIH
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11467/ELEVEN-PRODUCT%20PER%20%3CGANTI%20PRODUK%20DISINI%3E.user.js
// @updateURL https://update.greasyfork.org/scripts/11467/ELEVEN-PRODUCT%20PER%20%3CGANTI%20PRODUK%20DISINI%3E.meta.js
// ==/UserScript==



function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  // Note, jQ replaces $ to avoid conflicts.
  //alert("There are " + jQ('a').length + " links on this page.");
    
if(jQ(".boxDetail2_4 p.pTit").html()=="Penjualan Produk ini telah Diberhentikan."||jQ(".boxDetail2_4 p.pTit").html()=="Produk ini habis terjual dan tidak tersedia lagi."){
  //alert('ea');
  setTimeout(function(){
    window.location.href = window.location;                        
  },0);
}  
else{  
    //jQ('#optionData0').val('1:1');
    //jQ('#optionData0').change();      
 
  
  
  /*
  setTimeout(function(){
    jQ('.btnRed button').click();                        
  },300);  
  */
    
  
  
  if(jQ('.boxDetail2_2_1 p.pStrong').html().trim() == '<strong><span>Rp </span>100.000</strong>'){    
  //  jQ('#optionData0').val('1:1');
  //  jQ('#optionData0').change();      
        jQ('#optionData0>option:eq(1)').prop('selected', 'selected').trigger('change');

    jQ('.btnRed button').click();
  }else{
    setTimeout(function(){window.location.href = window.location;},0);
    
  }  
  
  
}
}

addJQuery(main);








