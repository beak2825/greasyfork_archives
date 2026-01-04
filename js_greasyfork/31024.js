// ==UserScript==
// @name        eBay - Remove Local Pickup
// @namespace   hapCodeJS
// @description Removes local pickup listings from eBay search results.
// @include     https://www.ebay.com/sch/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31024/eBay%20-%20Remove%20Local%20Pickup.user.js
// @updateURL https://update.greasyfork.org/scripts/31024/eBay%20-%20Remove%20Local%20Pickup.meta.js
// ==/UserScript==
function main(){
  var listShipNodes=document.getElementsByClassName('ship');
  var intIndex=1;
  while(intIndex<listShipNodes.length){
    if(listShipNodes[intIndex].innerText=='Pickup only: Free'){
       nodeChild=listShipNodes[intIndex].parentNode.parentNode.parentNode;
       nodeParent=nodeChild.parentNode;
       nodeParent.removeChild(nodeChild);
    }else{
      intIndex++;
    }
  }
}
main();
