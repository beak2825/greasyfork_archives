// ==UserScript==
// @name        BHIN-CHARTAWAL-EMPTY
// @namespace   JUSTONLYTESTKASKUS
// @include     https://www.bhinneka.com/mobile/aspx/shoppingcartempty.aspx
// @version     1.0.3
// @grant       none
// @description ga ono
// @downloadURL https://update.greasyfork.org/scripts/10507/BHIN-CHARTAWAL-EMPTY.user.js
// @updateURL https://update.greasyfork.org/scripts/10507/BHIN-CHARTAWAL-EMPTY.meta.js
// ==/UserScript==

//INI UNTUK TAB KERANJANG BELANJA KOSONG

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
  var x = window.open("http://www.bhinneka.com/mobile/aspx/addtocart.aspx?PartID=SKU00114080","_self");
  
  // var x = window.open("http://www.bhinneka.com/mobile/aspx/addtocart.aspx?PartID=SKU00715239","xab"); 
}
addJQuery(main);
