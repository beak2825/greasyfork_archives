// ==UserScript==
// @name        BHIN-SHIPPING
// @namespace   JUSTONLYTESTKASKUS
// @include     https://www.bhinneka.com/mobile/aspx/set_shipping_expedition.aspx
// @version     1
// @grant       none
// @description ga ono

// @downloadURL https://update.greasyfork.org/scripts/10509/BHIN-SHIPPING.user.js
// @updateURL https://update.greasyfork.org/scripts/10509/BHIN-SHIPPING.meta.js
// ==/UserScript==
//alert('x');

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
jQ('#tikiReg').click();
jQ('#ctl00_cphContent_rowShippingTikiReg').click();
jQ('#ctl00_cphContent_btnNext').click();


if(jQ("#radKUDUS").length){
  jQ("#radKUDUS").click();
  jQ("#ctl00_cphContent_btnNextPage").click();
} else{
   jQ('#ctl00_cphContent_txtSearch').val('kudus');
   jQ('#ctl00_cphContent_btnSearch').click();
} 
  
  
  
  
  
}
addJQuery(main);


