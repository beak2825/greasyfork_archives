// ==UserScript==
// @name        MATAHARI-CART01
// @namespace   intelchallenge
// @include     https://m.mataharimall.com/cart
// @version     1
// @grant       none
// @description MATAHARI-CART01x
// @downloadURL https://update.greasyfork.org/scripts/12330/MATAHARI-CART01.user.js
// @updateURL https://update.greasyfork.org/scripts/12330/MATAHARI-CART01.meta.js
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
  var x = jQ('.pt-price').html().replace("R","").replace("p","").replace(/\./gi,"").trim();
  if(x >  100000){
      window.location = window.location;

  }else{
  
    window.location = 'https://m.mataharimall.com/checkout/shipping';
  }
  
  

  
//alert(jQ('.pt-price').html().replace("R","").replace("p","").replace(/\./gi,""));
  
    }
addJQuery(main);