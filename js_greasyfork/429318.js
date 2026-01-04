// ==UserScript==
// @name         A3 player
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  AutoPlay del directo de la web y silencia la publicidad!
// @author       Miguel
// @match        https://www.atresplayer.com/*
// @icon         https://www.google.com/s2/favicons?domain=atresplayer.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429318/A3%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/429318/A3%20player.meta.js
// ==/UserScript==
var play = "style__StyledStandardButton-sc-16vuxcz-2 style__StyledButtonWithIcon-sc-16vuxcz-3 ibBCBT style__RoundIconButtonReturn-sc-wynk5c-5 hGuxdG";
var publi = "style__StyledMessage-sc-fmrvxt-1 dqMcnb";
var soundoff = "vjs-volume-menu-button vjs-menu-button vjs-menu-button-inline vjs-control vjs-button vjs-volume-menu-button-horizontal vjs-vol-0";
 var soundon = "vjs-volume-menu-button vjs-menu-button vjs-menu-button-inline vjs-control vjs-button vjs-volume-menu-button-horizontal vjs-vol-1";
 var soundon2 = "vjs-volume-menu-button vjs-menu-button vjs-menu-button-inline vjs-control vjs-button vjs-volume-menu-button-horizontal vjs-vol-2";

var publisound = true;
(function() {
setInterval(function() {

 if (document.getElementsByClassName(play)[0] != null){document.getElementsByClassName(play)[0].click();}
 if (document.getElementsByClassName("adsVideoPlayer")[0] != null)
 {
     document.getElementsByClassName("adsVideoPlayer")[0].remove();
 }
 if (document.getElementsByClassName("vjs-custom-spinner")[0] != null)
 {
     document.getElementsByClassName("vjs-custom-spinner")[0].remove();
 }
if (document.getElementsByClassName(publi)[0] != null)
{
  if(document.getElementsByClassName(publi)[0].innerHTML == "El canal que estás viendo en directo se encuentra en estos momentos en publicidad")
  {
    if (document.getElementsByClassName(soundon)[0] != null)
    {
        document.getElementsByClassName(soundon)[0].click();
        publisound = true;
    }
      if (document.getElementsByClassName(soundon2)[0] != null)
    {
        document.getElementsByClassName(soundon2)[0].click();
        publisound = true;
    }
  }
}else{
    if (document.getElementsByClassName(soundoff)[0] != null && publisound)
    {
        document.getElementsByClassName(soundoff)[0].click();
    }
}

}, 100)
})();