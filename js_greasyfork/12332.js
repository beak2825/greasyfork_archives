// ==UserScript==
// @name        MATAHARI-REVIEW
// @namespace   intelchallenge
// @include     https://m.mataharimall.com/checkout/review
// @version     1
// @grant       none
// @description MATAHARI-REVIEWx
// @downloadURL https://update.greasyfork.org/scripts/12332/MATAHARI-REVIEW.user.js
// @updateURL https://update.greasyfork.org/scripts/12332/MATAHARI-REVIEW.meta.js
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


                   jQ('.checkout-process button').click();
}
addJQuery(main);