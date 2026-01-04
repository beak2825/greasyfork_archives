// ==UserScript==
// @name      ConnectMePlease
// @namespace https://greasyfork.org/users/4785
// @author    nil
// @version   0.1
// @grant     none
// @description click for me
// @include  https://webmail*.orange.fr/webmail/fr_FR/continue.html*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/421744/ConnectMePlease.user.js
// @updateURL https://update.greasyfork.org/scripts/421744/ConnectMePlease.meta.js
// ==/UserScript==

(function launcher() {
  function myinit() {
   var mylinks = [].slice.call(document.links);
   //console.log(mylinks.length);
   //alert(mylinks.length);
   var mylink = mylinks.filter ((a) =>  a.parentNode.hasAttribute("id") && "onglet-inbox" == a.parentNode.id);
   if (1 != mylink.length) {
     //console.log("SLT: lien non trouvé, page changée?");
     alert(123);
     return;
   }
   mylink = mylink[0];
   console.log(mylink);
   //console.log(mylink);

   //console.log("clicking!!??");
   mylink.click();
  }
  //console.log("coucou");
  window.addEventListener("DOMContentLoaded", myinit);
})();