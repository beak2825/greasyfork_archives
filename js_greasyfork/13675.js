// ==UserScript==
// @name        Proxer_AnimeMangalisteZahlen
// @author      Dravorle
// @description Fügt der Anime/Mangaliste einen Counter hinzu
// @include     *proxer.me*
// @version     1.2.1 Wechsel zu OnLoad, da Chrome scheinbar Ready nicht checkt
// @grant       none
// @namespace https://greasyfork.org/users/12783
// @downloadURL https://update.greasyfork.org/scripts/13675/Proxer_AnimeMangalisteZahlen.user.js
// @updateURL https://update.greasyfork.org/scripts/13675/Proxer_AnimeMangalisteZahlen.meta.js
// ==/UserScript==
var scriptName = "Proxer_AnimeMangalisteZahlen";

$(window).on("load", function() {
  $(document).ajaxSuccess (function () {
    run();
  });
  run();
});

var run = function() {
  if(   !(window.location.href.indexOf("proxer.me/ucp?s=anime") >= 0)
     && !(window.location.href.indexOf("proxer.me/ucp?s=manga") >= 0)
     && !(window.location.href.indexOf("proxer.me/user") >= 0 && window.location.href.indexOf("/anime") >= 0)
     && !(window.location.href.indexOf("proxer.me/user") >= 0 && window.location.href.indexOf("/manga") >= 0) 
    ) {
    return;
  }
  
  var intCount;
  
  var tables = $("table");
  var ucp = false;
  if(window.location.href.indexOf("proxer.me/ucp") >= 0) {
    ucp = true;
  }
  /*
  * menuLinks/tables[0] > geschaut / gelesen
  * menuLinks/tables[1] > am Schauen / am Lesen
  * menuLinks/tables[2] > wird noch geschaut / wird noch gelesen
  * menuLinks/tables[3] > abgebrochen / abgebrochen
  */
    
  if(tables[0].rows[0].cells[0].innerHTML == "Geschaut" || tables[0].rows[0].cells[0].innerHTML == "Gelesen")
    {
      for(i=0; i<tables.length; i++) {
        if(tables[i].rows[2].cells[0].innerHTML == "Keine Einträge.") {
          intCount = 0;
        } else {
          intCount = (tables[i].rows.length -2);
        }
        tables[i].rows[0].cells[0].innerHTML += " ["+intCount+"]";
        if(ucp) { $("a.menu")[i].innerHTML += " ["+intCount+"]"; }
      }
    }
};