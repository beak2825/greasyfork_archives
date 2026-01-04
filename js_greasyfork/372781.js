// ==UserScript==
// @name                Show Pumpkin Ids In Link
// @name:en             Show Pumpkin Ids In Link
// @description A quick hack to display the pumpkin id in the link without needing to hover over it
// @namespace           http://www.aywas.com/
// @version             1
// @include             *://www.aywas.com/pumpkin_patch/*
// @author							Hamner (#13)
// @copyright           Public Domain
// @license             Public Domain
// @downloadURL https://update.greasyfork.org/scripts/372781/Show%20Pumpkin%20Ids%20In%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/372781/Show%20Pumpkin%20Ids%20In%20Link.meta.js
// ==/UserScript==


function insertIds() {
  var buttons = document.getElementsByClassName("a-button");
  
  for(var i=0; i < buttons.length; i++){
    var pumpkin = buttons[i];
    if( pumpkin.innerHTML == "Select Pumpkin" ) {
      var regexp = /aywas\.com\/pumpkin_patch\/\?id=(\d+)/g;
      var idMatch = regexp.exec(pumpkin.href);
      pumpkin.innerHTML = pumpkin.innerHTML + "\n" + idMatch[1];
    }
  }
}
insertIds();
