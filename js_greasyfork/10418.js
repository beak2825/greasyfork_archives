// ==UserScript==
// @name        Youtube Annotations Off
// @namespace   Youtube
// @description Turn off youtube annotations
// @include     *youtube.com/watch*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10418/Youtube%20Annotations%20Off.user.js
// @updateURL https://update.greasyfork.org/scripts/10418/Youtube%20Annotations%20Off.meta.js
// ==/UserScript==

var ytplayer = document.getElementById ("movie_player");
ytplayer.addEventListener('onStateChange', function(state){
  if(state == 1) {
    var btnsettings = document.getElementsByClassName("ytp-button ytp-settings-button")[0];
    btnsettings.click();
    var menudiv = document.getElementById("ytp-main-menu-id");
    var menuitems = menudiv.getElementsByClassName("ytp-menuitem-label");
    for (var i=0; i<menuitems.length; i++) {
      if(menuitems[i].innerHTML == "Annotations"){
        var parentDiv = menuitems[i].parentNode;
        if(parentDiv.getAttribute("aria-checked") == "true"){
          menuitems[i].click();
         break;
        }
      }
    }
    btnsettings.click();
   }
});