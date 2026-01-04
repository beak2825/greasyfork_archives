// ==UserScript==
// @name         Lootbits.io
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  automate the lootbit site
// @author       Bboy Tech
// @match        https://lootbits.io/dashboard.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389348/Lootbitsio.user.js
// @updateURL https://update.greasyfork.org/scripts/389348/Lootbitsio.meta.js
// ==/UserScript==

(function() {
   this.$ = this.jQuery = jQuery.noConflict(true);
   var claimTimer = setInterval (function() {claim(); }, Math.floor(Math.random() * 1000) + 2000);
   function claim(){
       var number=document.getElementById("lootbits").innerHTML;
       var numdown=document.getElementById("countdown_time").innerHTML;
       if (numdown === "00:01")
       {
           location.href = "https://lootbits.io/dashboard.php";
       }
       else
       {
           if (number > 0)
           {
               $( ".confirm" ).click();
               $( ".lootbox" ).click();
           }
           else
           {
               //do nothing
           }
       }
       if (numdown === "00:00")
       {
           var href = $('#claimbtn').attr('href');
           var newhref = "https://lootbits.io/dashboard.php"+href
           location.href = newhref;
       }
       else
       {
               //do nothing
       }
       $( "#id3a8b998253cross3a8b998253" ).click();
   }
   document.getElementById("lootboxout").click;
})();