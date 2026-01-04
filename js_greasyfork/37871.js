// ==UserScript==
// @name         programistic
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  change the content of the page !only for programist
// @author       olix3001
// @match        */*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37871/programistic.user.js
// @updateURL https://update.greasyfork.org/scripts/37871/programistic.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert("olix script is active");
   var ilerazy = prompt("how many things to change?");
    for(var i = 0;i<= ilerazy-1;i=i+1)
        {
    var what = prompt ("change...");
    if(what == "color")
       {
         var IdE1 = prompt ("Id");
         var color = prompt ("color");
           document.getElementById(IdE1).style.color = color;
                  alert("saved: change color to " + color);
       }
      if(what == "text")
       {
           var IdE2 = prompt ("Id");
           var tekst = prompt ("text");
           var tekstold = document.getElementById(IdE2).innerHTML;
           document.getElementById(IdE2).innerHTML = tekst;
            alert("saved: change text from " + tekstold + " to " + tekst);
       }


}
    alert("the command was executed");





})();