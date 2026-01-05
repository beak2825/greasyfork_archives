// ==UserScript==
// @name        MATAHARI-FINISHPAYMENT
// @namespace   intelchallenge
// @include     https://m.mataharimall.com/checkout/payment
// @version     1
// @grant       none
// @description MATAHARI-FINISHPAYMENTx
// @downloadURL https://update.greasyfork.org/scripts/12333/MATAHARI-FINISHPAYMENT.user.js
// @updateURL https://update.greasyfork.org/scripts/12333/MATAHARI-FINISHPAYMENT.meta.js
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

function main() {



$('#ui-id-3').trigger('click');
  
  
  
                     jQ('.checkout-process button').click();

  
  }
addJQuery(main);