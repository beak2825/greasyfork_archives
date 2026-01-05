// ==UserScript==
// @name        legoking
// @namespace   lego_king
// @description hide_lego_king
// @include     *brickinside.com*
// @version     1.0
// @require  https://code.jquery.com/jquery-2.1.3.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10020/legoking.user.js
// @updateURL https://update.greasyfork.org/scripts/10020/legoking.meta.js
// ==/UserScript==

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "https://code.jquery.com/jquery-2.1.3.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}


function main() {
//  $("DIV.main_th.def_f").has ('FONT.sn:contains('King')').hide();  
  $("DIV.main_th.def_f").has ("FONT.sn:contains('LEGO King')").hide();  
  //A[href="NeoView.php?Db=Materials01&Number=17569&BackDepth=1"]
}

// load jQuery and execute the main function
addJQuery(main);            
