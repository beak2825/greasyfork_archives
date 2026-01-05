// ==UserScript==
// @name        BHIN-SHIPPADDRESS
// @namespace   JUSTONLYTESTKASKUS
// @include     https://www.bhinneka.com/mobile/aspx/set_shipping_address.aspx
// @version     1
// @grant       none
// @description ga ono
// @downloadURL https://update.greasyfork.org/scripts/10511/BHIN-SHIPPADDRESS.user.js
// @updateURL https://update.greasyfork.org/scripts/10511/BHIN-SHIPPADDRESS.meta.js
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
    Zq("#ctl00_cphContent_btnNext").click();
}
addJQuery(main);
