// ==UserScript==
// @name        Indeed - Remove Sponsored Listings
// @namespace   hapCodeJS
// @description Removes sponsored listings from Indeed job results.
// @include     https://www.indeed.com/jobs*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27580/Indeed%20-%20Remove%20Sponsored%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/27580/Indeed%20-%20Remove%20Sponsored%20Listings.meta.js
// ==/UserScript==
function main(){
  var sponNodes=document.getElementsByClassName('jasx_serpsjlabel_poststGray');
  while(sponNodes.length>0){
    var child=sponNodes[0].parentNode.parentNode;
    var parent=child.parentNode;
    parent.removeChild(child);
  }
}
main();
