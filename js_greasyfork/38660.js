// ==UserScript==
// @name       Ebay Collection only filter v2
// @namespace  CollectionOnlyFilter
// @version    0.6
// @description  Hides all collection only listings. tested on Firefox 58 & Chrome 63
// @include      https://www.ebay.co.uk/*
// @downloadURL https://update.greasyfork.org/scripts/38660/Ebay%20Collection%20only%20filter%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/38660/Ebay%20Collection%20only%20filter%20v2.meta.js
// ==/UserScript==

//span.s-item__delivery-options



var search_items = ["span.ship" , "span.s-item__localDelivery" , "span.s-item__deliveryOptions" , "span.s-item__delivery-options" ];

for (z = 0; z < search_items.length; z++) 
{ 
  //alert("valid "+z + "  " +search_items[z]);
  var elements = document.body.querySelectorAll(search_items[z]); 

  for (var i = 0; i < elements.length; i++) 
  {
       if(elements[i].innerHTML.search(/Collection only: Free|Free collection in person|Collection in person/) != -1)
      {
        //elements[i].parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";
        elements[i].parentElement.parentElement.parentElement.style.display = "none";
      }
  }
}
